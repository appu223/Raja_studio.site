import { useState, useEffect } from 'react';
import { customerService } from '../services/customerService';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import ConfirmModal from '../components/common/ConfirmModal';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({ full_name: '', email: '', phone: '', city: '', address: '', notes: '' });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadCustomers = async (searchQuery = '') => {
    try {
      setLoading(true);
      const res = await customerService.getAll(searchQuery);
      setCustomers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadCustomers(search);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ full_name: '', email: '', phone: '', city: '', address: '', notes: '' });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleOpenEdit = (customer) => {
    setEditingId(customer.id);
    setFormData({
      full_name: customer.full_name,
      email: customer.email || '',
      phone: customer.phone,
      city: customer.city || '',
      address: customer.address || '',
      notes: customer.notes || '',
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      if (editingId) {
        await customerService.update(editingId, formData);
      } else {
        await customerService.create(formData);
      }
      setShowModal(false);
      loadCustomers(search);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await customerService.delete(deleteTarget.id);
      setDeleteTarget(null);
      loadCustomers(search);
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Customer Directory</h4>
          <p className="text-muted small mb-0">Manage client profiles, contact information, and event history</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <i className="bi bi-person-plus-fill me-2"></i>New Customer
        </button>
      </div>

      {/* Search Bar */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-body p-3">
          <form onSubmit={handleSearchSubmit} className="row g-2">
            <div className="col-md-10">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by customer name, phone number, or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-outline-secondary w-100">
                Filter
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <Loader message="Loading customers..." />
          ) : customers.length === 0 ? (
            <EmptyState
              icon="bi-people"
              title="No Customers Found"
              message="Get started by creating your first studio customer profile."
            />
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Customer</th>
                    <th>Phone</th>
                    <th>Location</th>
                    <th>Bookings</th>
                    <th>Registered</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id}>
                      <td className="ps-4">
                        <div className="fw-semibold text-dark">{c.full_name}</div>
                        <small className="text-muted">{c.email || 'No email registered'}</small>
                      </td>
                      <td>
                        <i className="bi bi-telephone text-muted me-2 small"></i>
                        {c.phone}
                      </td>
                      <td>{c.city || '—'}</td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {c.total_bookings} bookings
                        </span>
                      </td>
                      <td className="small text-muted">
                        {new Date(c.created_at).toLocaleDateString()}
                      </td>
                      <td className="text-end pe-4">
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => handleOpenEdit(c)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setDeleteTarget(c)}
                        >
                          <i className="bi bi-trash"></i>
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

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <form onSubmit={handleSaveCustomer}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    {editingId ? 'Edit Customer' : 'Add New Customer'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  {errorMsg && <div className="alert alert-danger py-2 small">{errorMsg}</div>}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Phone Number *</label>
                      <input
                        type="tel"
                        className="form-control"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">City</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Address</label>
                    <textarea
                      rows="2"
                      className="form-control"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="mb-0">
                    <label className="form-label small fw-semibold">Notes</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Special requirements, reference, etc."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Customer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        show={!!deleteTarget}
        title="Delete Customer Profile"
        message={`Are you sure you want to remove "${deleteTarget?.full_name}"? Historical bookings linked to this client will remain in record.`}
        confirmText="Delete Profile"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}