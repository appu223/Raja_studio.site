import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import StatusBadge from '../components/common/StatusBadge';

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getCalendar()
      .then((res) => {
        setEvents(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Studio Master Calendar</h4>
          <p className="text-muted small mb-0">Consolidated operational schedule, venue dispatches, and crew assignments</p>
        </div>
        <span className="badge bg-primary bg-opacity-10 text-primary border border-primary px-3 py-2">
          <i className="bi bi-calendar-range me-1"></i> {events.length} Scheduled Sessions
        </span>
      </div>

      {loading ? (
        <Loader message="Compiling studio schedule timeline..." />
      ) : events.length === 0 ? (
        <EmptyState
          icon="bi-calendar2-week"
          title="No Sessions Scheduled"
          message="Shoot sessions dispatched from the bookings engine will organize here."
        />
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Date & Time</th>
                    <th>Session Code</th>
                    <th>Client & Booking</th>
                    <th>Venue Location</th>
                    <th>Assigned Crew</th>
                    <th className="text-end pe-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev) => (
                    <tr key={ev.id}>
                      <td className="ps-4">
                        <div className="fw-bold text-dark">
                          {new Date(ev.scheduled_start).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <small className="text-muted">
                          {new Date(ev.scheduled_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(ev.scheduled_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </small>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          <code>{ev.session_code}</code>
                        </span>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">{ev.customer_name}</div>
                        <small className="text-muted">Booking #{ev.booking_number} • {ev.customer_phone}</small>
                      </td>
                      <td>
                        <i className="bi bi-geo-alt-fill text-danger me-1 small"></i>
                        {ev.venue || 'Studio Main Stage'}
                      </td>
                      <td>
                        {ev.crew?.length > 0 ? (
                          <div className="d-flex gap-1 flex-wrap">
                            {ev.crew.map((c, i) => (
                              <span key={i} className="badge bg-light text-secondary border small">
                                {c.first_name} {c.last_name} ({c.role_in_shoot})
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted small">No crew assigned</span>
                        )}
                      </td>
                      <td className="text-end pe-4">
                        <StatusBadge status={ev.session_status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}