import { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import { customerService } from '../services/customerService';
import { serviceCatalogService } from '../services/serviceService';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import StatusBadge from '../components/common/StatusBadge';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  // Creation Modal States
  const [showModal, setShowModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [selectedServices, setSelectedServices] = useState([]); // [{ service_id, quantity, base_price, name }]
  const [discountAmount, setDiscountAmount] = useState(0);
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Booking Details Modal
  const [viewBooking, setViewBooking] = useState(null);

  const loadBookings = async (status = '') => {
    try {
      setLoading(true);
      const res = await bookingService.getAll(status);
      setBookings(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings(filterStatus);
  }, [filterStatus]);

  const handleOpenCreateModal = async () => {
    setErrorMsg('');
    try {
      const [custRes, srvRes] = await Promise.all([
        customerService.getAll(''),
        serviceCatalogService.getServices(true),
      ]);
      setCustomers(custRes.data.data);
      setServices(srvRes.data.data);
      setSelectedServices([]);
      setSelectedCustomer('');
      setEventDate('');
      setEventVenue('');
      setSpecialRequirements('');
      setDiscountAmount(0);
      setShowModal(true);
    } catch (err) {
      alert('Failed to load customers or services');
    }
  };

  const handleToggleService = (srv) => {
    const exists = selectedServices.find((s) => s.service_id === srv.id);
    if (exists) {
      setSelectedServices(selectedServices.filter((s) => s.service_id !== srv.id));
    } else {
      setSelectedServices([
        ...selectedServices,
        { service_id: srv.id, name: srv.name, base_price: parseFloat(srv.base_price), quantity: 1 },
      ]);
    }
  };

  // Preliminary client-side preview (server strictly validates and calculates real totals)
  const previewSubtotal = selectedServices.reduce((sum, item) => sum + item.base_price * item.quantity, 0);
  const previewTotal = Math.max(0, previewSubtotal - (parseFloat(discountAmount) || 0));

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) {
      setErrorMsg('Please select a customer');
      return;
    }
    if (selectedServices.length === 0) {
      setErrorMsg('Please select at least one service');
      return;
    }

    setCreating(true);
    setErrorMsg('');

    try {
      await bookingService.create({
        customer_id: parseInt(selectedCustomer, 10),
        event_date: eventDate,
        event_venue: eventVenue,
        special_requirements: specialRequirements,
        discount_amount: parseFloat(discountAmount) || 0,
        selected_services: selectedServices.map((s) => ({
          service_id: s.service_id,
          quantity: s.quantity,
        })),
      });

      setShowModal(false);
      loadBookings(filterStatus);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setCreating(false);
    }
  };

  const handleStatusTransition = async (id, nextStatus) => {
    try {
      await bookingService.updateStatus(id, nextStatus);
      loadBookings(filterStatus);
      if (viewBooking && viewBooking.id === id) {
        const updated = await bookingService.getById(id);
        setViewBooking(updated.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Status transition denied');
    }
  };

  const handleOpenDetails = async (id) => {
    try {
      const res = await bookingService.getById(id);
      setViewBooking(res.data.data);
    } catch (err) {
      alert('Could not load booking details');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Booking Operations</h4>
          <p className="text-muted small mb-0">Manage customer studio assignments, contracts, and workflow progress</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          <i className="bi bi-calendar-plus me-2"></i>Create Booking
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-body p-2 d-flex gap-2 flex-wrap">
          {[
            { label: 'All Bookings', value: '' },
            { label: 'Draft', value: 'draft' },
            { label: 'Confirmed', value: 'confirmed' },
            { label: 'Staff Assigned', value: 'staff_assigned' },
            { label: 'Shoot Done', value: 'shoot_completed' },
            { label: 'Editing', value: 'editing' },
            { label: 'Ready', value: 'gallery_ready' },
            { label: 'Delivered', value: 'delivered' },
            { label: 'Closed', value: 'closed' },
          ].map((f) => (
            <button
              key={f.value}
              className={`btn btn-sm ${filterStatus === f.value ? 'btn-primary' : 'btn-light'}`}
              onClick={() => setFilterStatus(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <Loader message="Loading bookings..." />
          ) : bookings.length === 0 ? (
            <EmptyState
              icon="bi-calendar-x"
              title="No Bookings Found"
              message="Create a booking to schedule a photo shoot and commit service packages."
            />
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Booking #</th>
                    <th>Customer</th>
                    <th>Event Date</th>
                    <th>Total Amount</th>
                    <th>Paid</th>
                    <th>Workflow Status</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td className="ps-4">
                        <span className="badge bg-light text-dark border">
                          <code>{b.booking_number}</code>
                        </span>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">{b.customer_name}</div>
                        <small className="text-muted">{b.customer_phone}</small>
                      </td>
                      <td>
                        <i className="bi bi-calendar3 me-2 text-muted small"></i>
                        {new Date(b.event_date).toLocaleDateString()}
                      </td>
                      <td>
                        <span className="fw-bold text-dark">
                          ₹{Number(b.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td>
                        <span className={`fw-semibold ${Number(b.total_paid) >= Number(b.total_amount) ? 'text-success' : 'text-danger'}`}>
                          ₹{Number(b.total_paid).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={b.status} />
                      </td>
                      <td className="text-end pe-4">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleOpenDetails(b.id)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Booking Wizard Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <form onSubmit={handleCreateBooking}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">New Booking Wizard</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  {errorMsg && <div className="alert alert-danger py-2 small">{errorMsg}</div>}

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Customer *</label>
                      <select
                        className="form-select"
                        required
                        value={selectedCustomer}
                        onChange={(e) => setSelectedCustomer(e.target.value)}
                      >
                        <option value="">-- Choose Customer --</option>
                        {customers.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.full_name} ({c.phone})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Event Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        required
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Event Venue</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Grand Palace Hall, Bangalore"
                      value={eventVenue}
                      onChange={(e) => setEventVenue(e.target.value)}
                    />
                  </div>

                  {/* Service Selection Picker */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Select Services *</label>
                    <div className="p-3 border rounded bg-light" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                      {services.map((srv) => {
                        const isChecked = selectedServices.some((s) => s.service_id === srv.id);
                        return (
                          <div key={srv.id} className="form-check d-flex justify-content-between align-items-center py-1">
                            <div>
                              <input
                                className="form-check-input me-2"
                                type="checkbox"
                                id={`srv-${srv.id}`}
                                checked={isChecked}
                                onChange={() => handleToggleService(srv)}
                              />
                              <label className="form-check-label" htmlFor={`srv-${srv.id}`}>
                                {srv.name}
                              </label>
                            </div>
                            <span className="fw-semibold small">
                              ₹{Number(srv.base_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Financial calculation preview */}
                  <div className="row g-3 p-3 bg-white border rounded mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Special Discount (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={discountAmount}
                        onChange={(e) => setDiscountAmount(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 text-end d-flex flex-column justify-content-center">
                      <div className="text-muted small">Subtotal: ₹{previewSubtotal.toFixed(2)}</div>
                      <div className="fw-bold fs-5 text-primary">Est. Total: ₹{previewTotal.toFixed(2)}</div>
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Prices verified and locked server-side
                      </small>
                    </div>
                  </div>

                  <div className="mb-0">
                    <label className="form-label small fw-semibold">Special Requirements</label>
                    <textarea
                      rows="2"
                      className="form-control"
                      placeholder="Notes on timing, outfit changes, drone clearance..."
                      value={specialRequirements}
                      onChange={(e) => setSpecialRequirements(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={creating}>
                    {creating ? 'Saving...' : 'Create Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal & State Transition Manager */}
      {viewBooking && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <div>
                  <h5 className="modal-title fw-bold">Booking #{viewBooking.booking_number}</h5>
                  <StatusBadge status={viewBooking.status} />
                </div>
                <button type="button" className="btn-close" onClick={() => setViewBooking(null)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-2">Customer Information</h6>
                    <div className="text-dark fw-semibold">{viewBooking.customer_name}</div>
                    <div className="text-muted small">Phone: {viewBooking.customer_phone}</div>
                    <div className="text-muted small">Email: {viewBooking.customer_email || '—'}</div>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-2">Event Run Sheet</h6>
                    <div className="text-dark"><strong>Date:</strong> {new Date(viewBooking.event_date).toLocaleDateString()}</div>
                    <div className="text-dark"><strong>Venue:</strong> {viewBooking.event_venue || 'In-Studio'}</div>
                    <div className="text-muted small"><strong>Notes:</strong> {viewBooking.special_requirements || 'None'}</div>
                  </div>
                </div>

                <h6 className="fw-bold mb-2">Price Snapshot Items</h6>
                <div className="table-responsive border rounded mb-4">
                  <table className="table table-sm mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Item</th>
                        <th className="text-center">Qty</th>
                        <th className="text-end">Unit Snapshot</th>
                        <th className="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewBooking.items?.map((it) => (
                        <tr key={it.id}>
                          <td>{it.item_name_snapshot}</td>
                          <td className="text-center">{it.quantity}</td>
                          <td className="text-end">₹{Number(it.unit_price_snapshot).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td className="text-end fw-semibold">₹{Number(it.line_total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="d-flex justify-content-between p-3 bg-light rounded">
                  <div>
                    <span className="text-muted small d-block">Paid to date: ₹{Number(viewBooking.total_paid).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    <span className="text-danger fw-bold">Outstanding Balance: ₹{Number(viewBooking.balance_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="text-end">
                    <div className="text-muted small">Subtotal: ₹{Number(viewBooking.subtotal_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                    <div className="text-muted small">Discount: -₹{Number(viewBooking.discount_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                    <h5 className="fw-bold text-primary mb-0">Total: ₹{Number(viewBooking.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h5>
                  </div>
                </div>

                {/* State Transition Actions */}
                <hr />
                <h6 className="fw-bold mb-2">Workflow Progression</h6>
                <div className="d-flex gap-2 flex-wrap">
                  {viewBooking.status === 'draft' && (
                    <button className="btn btn-sm btn-primary" onClick={() => handleStatusTransition(viewBooking.id, 'confirmed')}>
                      <i className="bi bi-check-circle me-1"></i>Confirm Booking
                    </button>
                  )}
                  {viewBooking.status === 'confirmed' && (
                    <button className="btn btn-sm btn-info" onClick={() => handleStatusTransition(viewBooking.id, 'staff_assigned')}>
                      Mark Staff Assigned
                    </button>
                  )}
                  {viewBooking.status === 'staff_assigned' && (
                    <button className="btn btn-sm btn-warning" onClick={() => handleStatusTransition(viewBooking.id, 'shoot_scheduled')}>
                      Schedule Shoot Session
                    </button>
                  )}
                  {viewBooking.status === 'shoot_scheduled' && (
                    <button className="btn btn-sm btn-success" onClick={() => handleStatusTransition(viewBooking.id, 'shoot_completed')}>
                      Mark Shoot Completed
                    </button>
                  )}
                  {viewBooking.status === 'shoot_completed' && (
                    <button className="btn btn-sm btn-secondary" onClick={() => handleStatusTransition(viewBooking.id, 'editing')}>
                      Send to Editing
                    </button>
                  )}
                  {viewBooking.status === 'editing' && (
                    <button className="btn btn-sm btn-success" onClick={() => handleStatusTransition(viewBooking.id, 'gallery_ready')}>
                      Gallery Ready
                    </button>
                  )}
                  {viewBooking.status === 'gallery_ready' && (
                    <button className="btn btn-sm btn-primary" onClick={() => handleStatusTransition(viewBooking.id, 'delivered')}>
                      Mark Delivered
                    </button>
                  )}
                  {viewBooking.status === 'delivered' && (
                    <button className="btn btn-sm btn-dark" onClick={() => handleStatusTransition(viewBooking.id, 'closed')}>
                      Close Booking
                    </button>
                  )}
                  {!['closed', 'cancelled'].includes(viewBooking.status) && (
                    <button className="btn btn-sm btn-outline-danger ms-auto" onClick={() => handleStatusTransition(viewBooking.id, 'cancelled')}>
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}