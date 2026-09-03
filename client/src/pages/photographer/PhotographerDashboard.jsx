import { useState, useEffect } from 'react';
import { staffPortalService } from '../../services/staffPortalService';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';

export default function PhotographerDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [shoots, setShoots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status notes modal
  const [actionSession, setActionSession] = useState(null);
  const [targetStatus, setTargetStatus] = useState('');
  const [notes, setNotes] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [mRes, sRes] = await Promise.all([
        staffPortalService.getPhotographerDashboard(),
        staffPortalService.getPhotographerShoots(),
      ]);
      setMetrics(mRes.data.data);
      setShoots(sRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenStatusModal = (session, status) => {
    setActionSession(session);
    setTargetStatus(status);
    setNotes(session.completion_notes || '');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await staffPortalService.updateShootStatus(actionSession.id, targetStatus, notes);
      setActionSession(null);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed');
    }
  };

  if (loading) return <Loader message="Loading assigned photography shoots..." />;

  return (
    <div>
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Photographer Run Sheet & Dispatches</h4>
        <p className="text-muted small mb-0">Review venue locations, client contact numbers, timeline schedules, and update progress</p>
      </div>

      {/* 4 Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm p-3 bg-white">
            <span className="text-muted small">Shoots Scheduled Today</span>
            <h3 className="fw-bold text-warning my-1">{metrics.shoots_today}</h3>
            <small className="text-muted">On stage or on location</small>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm p-3 bg-white">
            <span className="text-muted small">Upcoming Shoots</span>
            <h3 className="fw-bold text-primary my-1">{metrics.upcoming_shoots}</h3>
            <small className="text-muted">Future sessions</small>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm p-3 bg-white">
            <span className="text-muted small">Checked-Out Studio Gear</span>
            <h3 className="fw-bold text-dark my-1">{metrics.checked_out_gear}</h3>
            <small className="text-muted">In your custody</small>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm p-3 bg-white">
            <span className="text-muted small">Completed Sessions</span>
            <h3 className="fw-bold text-success my-1">{metrics.completed_shoots}</h3>
            <small className="text-muted">Handed to editing</small>
          </div>
        </div>
      </div>

      {/* Shoots List */}
      <h6 className="fw-bold mb-3"><i className="bi bi-camera me-2 text-primary"></i>My Assigned Shoots</h6>
      {shoots.length === 0 ? (
        <EmptyState icon="bi-camera" title="No Shoots Assigned" message="The studio manager has not dispatched any shoots to your account." />
      ) : (
        <div className="row g-4">
          {shoots.map((s) => (
            <div className="col-lg-6" key={s.id}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <div>
                    <span className="badge bg-dark text-white me-2"><code>{s.session_code}</code></span>
                    <span className="small text-muted">Booking #{s.booking_number}</span>
                  </div>
                  <StatusBadge status={s.session_status} />
                </div>
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-1">{s.customer_name}</h5>
                  <p className="text-muted small mb-3">
                    <i className="bi bi-telephone text-primary me-2"></i>{s.customer_phone} &bull; {s.customer_email || 'No email'}
                  </p>

                  <div className="p-3 bg-light rounded border mb-3">
                    <div className="mb-2">
                      <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                      <strong>Venue:</strong> {s.venue || 'In-Studio'}
                    </div>
                    <div className="row g-2 small">
                      <div className="col-sm-6">
                        <span className="text-muted d-block">Start:</span>
                        <strong>{new Date(s.scheduled_start).toLocaleString()}</strong>
                      </div>
                      <div className="col-sm-6">
                        <span className="text-muted d-block">End:</span>
                        <strong>{new Date(s.scheduled_end).toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>

                  {s.special_requirements && (
                    <div className="alert alert-info py-2 small mb-3">
                      <strong>Client Note:</strong> {s.special_requirements}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                    {s.session_status === 'scheduled' && (
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleOpenStatusModal(s, 'in_progress')}
                      >
                        <i className="bi bi-play-circle me-1"></i>Start Shoot Session
                      </button>
                    )}
                    {s.session_status === 'in_progress' && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleOpenStatusModal(s, 'completed')}
                      >
                        <i className="bi bi-check2-circle me-1"></i>Mark Shoot Completed
                      </button>
                    )}
                    {s.session_status === 'completed' && (
                      <span className="badge bg-success bg-opacity-10 text-success border px-3 py-2">
                        <i className="bi bi-check-all me-1"></i>Photos Ingested / Finished
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notes & Status Modal */}
      {actionSession && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <form onSubmit={handleUpdateStatus}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Update Shoot: {actionSession.session_code}</h5>
                  <button type="button" className="btn-close" onClick={() => setActionSession(null)}></button>
                </div>
                <div className="modal-body p-4">
                  <p className="small text-muted">
                    Changing status to: <strong className="text-uppercase text-primary">{targetStatus}</strong>
                  </p>
                  <div className="mb-0">
                    <label className="form-label small fw-semibold">Work Notes / Memory Card ID / Lighting Details</label>
                    <textarea
                      rows="3"
                      className="form-control"
                      placeholder="e.g. Card A: Sony 128GB, shot 1400 candid frames, client requested warm skin tone grade..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-light" onClick={() => setActionSession(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Confirm & Sync</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}