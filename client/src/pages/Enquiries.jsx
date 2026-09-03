import { useState, useEffect } from 'react';
import { enquiryService } from '../services/enquiryService';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import StatusBadge from '../components/common/StatusBadge';

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    event_type: 'Wedding Photography',
    tentative_date: '',
    source: 'Walk-in',
    notes: '',
  });

  const loadEnquiries = async (status = '') => {
    try {
      setLoading(true);
      const res = await enquiryService.getAll(status);
      setEnquiries(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries(filterStatus);
  }, [filterStatus]);

  const handleStatusChange = async (enquiryId, newStatus) => {
    try {
      await enquiryService.updateStatus(enquiryId, newStatus);
      loadEnquiries(filterStatus);
    } catch (err) {
      alert('Status update failed');
    }
  };

  const handleCreateEnquiry = async (e) => {
    e.preventDefault();
    try {
      await enquiryService.create(formData);
      setShowModal(false);
      setFormData({
        contact_name: '',
        contact_phone: '',
        contact_email: '',
        event_type: 'Wedding Photography',
        tentative_date: '',
        source: 'Walk-in',
        notes: '',
      });
      loadEnquiries(filterStatus);
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating enquiry');
    }
  };

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Lead & Enquiry Pipeline</h4>
          <p className="text-muted small mb-0">Track leads, convert enquiries to studio bookings, and manage outreach</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-circle me-2"></i>New Enquiry
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-body p-2 d-flex gap-2 flex-wrap">
          {['', 'new', 'in_progress', 'quoted', 'converted', 'lost'].map((st) => (
            <button
              key={st}
              className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-light'}`}
              onClick={() => setFilterStatus(st)}
            >
              {st === '' ? 'All Enquiries' : st.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <Loader message="Loading leads..." />
          ) : enquiries.length === 0 ? (
            <EmptyState
              icon="bi-chat-dots"
              title="No Enquiries"
              message="There are no enquiries in this pipeline status."
            />
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Lead Contact</th>
                    <th>Event Type</th>
                    <th>Tentative Date</th>
                    <th>Lead Source</th>
                    <th>Pipeline Status</th>
                    <th className="text-end pe-4">Move Status</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((e) => (
                    <tr key={e.id}>
                      <td className="ps-4">
                        <div className="fw-semibold text-dark">{e.contact_name}</div>
                        <div className="small text-muted">{e.contact_phone} • {e.contact_email || 'No email'}</div>
                      </td>
                      <td>
                        <span className="fw-medium">{e.event_type}</span>
                      </td>
                      <td>
                        {e.tentative_date ? new Date(e.tentative_date).toLocaleDateString() : 'Flexible'}
                      </td>
                      <td>
                        <span className="badge bg-light text-secondary border">{e.source}</span>
                      </td>
                      <td>
                        <StatusBadge status={e.status} />
                      </td>
                      <td className="text-end pe-4">
                        <select
                          className="form-select form-select-sm d-inline-block w-auto"
                          value={e.status}
                          onChange={(evt) => handleStatusChange(e.id, evt.target.value)}
                        >
                          <option value="new">New</option>
                          <option value="in_progress">In Progress</option>
                          <option value="quoted">Quoted</option>
                          <option value="converted">Converted</option>
                          <option value="lost">Lost</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Enquiry Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <form onSubmit={handleCreateEnquiry}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Capture Studio Enquiry</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Prospect / Client Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={formData.contact_name}
                      onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Phone Number *</label>
                      <input
                        type="tel"
                        className="form-control"
                        required
                        value={formData.contact_phone}
                        onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.contact_email}
                        onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Event Type *</label>
                      <select
                        className="form-select"
                        value={formData.event_type}
                        onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                      >
                        <option value="Wedding Photography">Wedding Photography</option>
                        <option value="Pre-Wedding Shoot">Pre-Wedding Shoot</option>
                        <option value="Model Portfolio">Model Portfolio</option>
                        <option value="Corporate Event">Corporate Event</option>
                        <option value="Maternity / Baby Shoot">Maternity / Baby Shoot</option>
                        <option value="Product Photography">Product Photography</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Tentative Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.tentative_date}
                        onChange={(e) => setFormData({ ...formData, tentative_date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Lead Source</label>
                    <select
                      className="form-select"
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    >
                      <option value="Walk-in">Walk-in</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Website">Website Form</option>
                      <option value="Referral">Client Referral</option>
                      <option value="Phone Enquiry">Phone Enquiry</option>
                    </select>
                  </div>
                  <div className="mb-0">
                    <label className="form-label small fw-semibold">Discussion Notes</label>
                    <textarea
                      rows="2"
                      className="form-control"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Lead</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}