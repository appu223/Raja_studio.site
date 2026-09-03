import { useState, useEffect } from 'react';
import { shootService } from '../services/shootService';
import { bookingService } from '../services/bookingService';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import StatusBadge from '../components/common/StatusBadge';

export default function Shoots() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  // Scheduling Modal State
  const [showModal, setShowModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [venue, setVenue] = useState('');
  const [selectedStaff, setSelectedStaff] = useState([]); // [{ user_id, role_in_shoot }]
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadSessions = async (status = '') => {
    try {
      setLoading(true);
      const res = await shootService.getAll(status);
      setSessions(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions(statusFilter);
  }, [statusFilter]);

  const handleOpenScheduleModal = async () => {
    setErrorMsg('');
    try {
      const [bRes, sRes] = await Promise.all([
        bookingService.getAll(''),
        shootService.getStaff(),
      ]);
      // Exclude closed or cancelled bookings from new scheduling
      setBookings(bRes.data.data.filter((b) => !['closed', 'cancelled'].includes(b.status)));
      setStaffList(sRes.data.data);
      setSelectedBooking('');
      setStartTime('');
      setEndTime('');
      setVenue('');
      setSelectedStaff([]);
      setShowModal(true);
    } catch (err) {
      alert('Could not load bookings or crew staff list');
    }
  };

  const handleToggleStaff = (user, role = 'Lead Photographer') => {
    const exists = selectedStaff.find((s) => s.user_id === user.id);
    if (exists) {
      setSelectedStaff(selectedStaff.filter((s) => s.user_id !== user.id));
    } else {
      setSelectedStaff([...selectedStaff, { user_id: user.id, role_in_shoot: role }]);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBooking) {
      setErrorMsg('Please select a booking to assign a shoot to');
      return;
    }
    if (selectedStaff.length === 0) {
      setErrorMsg('Please assign at least one staff member to this shoot');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      await shootService.create({
        booking_id: parseInt(selectedBooking, 10),
        scheduled_start: startTime,
        scheduled_end: endTime,
        venue,
        staff_assignments: selectedStaff,
      });

      setShowModal(false);
      loadSessions(statusFilter);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to schedule shoot session');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (sessionId, nextStatus) => {
    try {
      await shootService.updateStatus(sessionId, nextStatus);
      loadSessions(statusFilter);
    } catch (err) {
      alert(err.response?.data?.message || 'Status transition failed');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Shoot Dispatch & Crew Operations</h4>
          <p className="text-muted small mb-0">Schedule photography shoots, assign camera crew, and monitor timeline</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenScheduleModal}>
          <i className="bi bi-camera-fill me-2"></i>Schedule Shoot
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-body p-2 d-flex gap-2 flex-wrap">
          {['', 'scheduled', 'in_progress', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-light'}`}
              onClick={() => setStatusFilter(st)}
            >
              {st === '' ? 'All Sessions' : st.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Session Cards */}
      {loading ? (
        <Loader message="Loading shoot schedule..." />
      ) : sessions.length === 0 ? (
        <EmptyState
          icon="bi-camera"
          title="No Shoot Sessions Found"
          message="Schedule a shoot session for any active booking to dispatch photographers."
        />
      ) : (
        <div className="row g-3">
          {sessions.map((sess) => (
            <div className="col-lg-6" key={sess.id}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <div>
                    <span className="badge bg-light text-dark border me-2">
                      <code>{sess.session_code}</code>
                    </span>
                    <span className="small text-muted">Booking #{sess.booking_number}</span>
                  </div>
                  <StatusBadge status={sess.session_status} />
                </div>
                <div className="card-body">
                  <h5 className="fw-bold mb-1">{sess.customer_name}</h5>
                  <p className="text-muted small mb-3">
                    <i className="bi bi-geo-alt me-1 text-danger"></i>
                    {sess.venue || 'Studio Main Floor'}
                  </p>

                  <div className="p-3 bg-light rounded border mb-3">
                    <div className="row g-2 small">
                      <div className="col-sm-6">
                        <span className="text-muted d-block">Start Time:</span>
                        <strong className="text-dark">
                          {new Date(sess.scheduled_start).toLocaleString()}
                        </strong>
                      </div>
                      <div className="col-sm-6">
                        <span className="text-muted d-block">End Time:</span>
                        <strong className="text-dark">
                          {new Date(sess.scheduled_end).toLocaleString()}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Assigned Crew Badges */}
                  <div className="mb-3">
                    <span className="text-muted small fw-bold d-block mb-1 text-uppercase">
                      Assigned Crew:
                    </span>
                    <div className="d-flex gap-1 flex-wrap">
                      {sess.assigned_staff?.length > 0 ? (
                        sess.assigned_staff.map((st) => (
                          <span key={st.id} className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1">
                            <i className="bi bi-person-fill me-1"></i>
                            {st.first_name} {st.last_name} ({st.role_in_shoot})
                          </span>
                        ))
                      ) : (
                        <span className="text-muted small">No crew assigned yet</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                    {sess.session_status === 'scheduled' && (
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => handleStatusUpdate(sess.id, 'in_progress')}
                      >
                        <i className="bi bi-play-circle me-1"></i>Start Shoot
                      </button>
                    )}
                    {sess.session_status === 'in_progress' && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleStatusUpdate(sess.id, 'completed')}
                      >
                        <i className="bi bi-check2-circle me-1"></i>Mark Completed
                      </button>
                    )}
                    {!['completed', 'cancelled'].includes(sess.session_status) && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleStatusUpdate(sess.id, 'cancelled')}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Shoot Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <form onSubmit={handleScheduleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Schedule Shoot Session</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  {errorMsg && (
                    <div className="alert alert-danger py-2 small d-flex align-items-center">
                      <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                      <div>{errorMsg}</div>
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Target Booking *</label>
                    <select
                      className="form-select"
                      required
                      value={selectedBooking}
                      onChange={(e) => setSelectedBooking(e.target.value)}
                    >
                      <option value="">-- Choose Booking --</option>
                      {bookings.map((b) => (
                        <option key={b.id} value={b.id}>
                          #{b.booking_number} — {b.customer_name} ({new Date(b.event_date).toLocaleDateString()})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Start Date & Time *</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        required
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">End Date & Time *</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        required
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Venue / Location</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. In-Studio Hall A or Grand Heritage Resort"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                    />
                  </div>

                  {/* Multi-Staff Assignment Picker */}
                  <div className="mb-0">
                    <label className="form-label small fw-semibold">
                      Assign Camera Crew / Staff * (Automatic Overlap Conflict Check)
                    </label>
                    <div className="p-3 border rounded bg-light" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                      {staffList.map((user) => {
                        const isAssigned = selectedStaff.some((s) => s.user_id === user.id);
                        return (
                          <div key={user.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                            <div className="form-check mb-0">
                              <input
                                className="form-check-input me-2"
                                type="checkbox"
                                id={`staff-${user.id}`}
                                checked={isAssigned}
                                onChange={() => handleToggleStaff(user)}
                              />
                              <label className="form-check-label fw-semibold" htmlFor={`staff-${user.id}`}>
                                {user.first_name} {user.last_name}
                                <span className="badge bg-secondary ms-2 small" style={{ fontSize: '0.7rem' }}>
                                  {user.role_name}
                                </span>
                              </label>
                              <div className="text-muted small ps-4">{user.designation || user.skills || 'Crew'}</div>
                            </div>
                            {isAssigned && (
                              <span className="badge bg-success small">Assigned</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Verifying Availability...' : 'Confirm Schedule'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}