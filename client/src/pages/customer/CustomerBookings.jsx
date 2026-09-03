import { useState, useEffect } from 'react';
import { customerPortalService } from '../../services/customerPortalService';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';

export default function CustomerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    customerPortalService.getBookings()
      .then((res) => {
        setBookings(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader message="Loading your studio bookings..." />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">My Bookings & Shoot Schedule</h4>
          <p className="text-muted small mb-0">Track contracted packages, event dates, and live studio workflow status</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon="bi-calendar2-heart"
          title="No Bookings Yet"
          message="You don't have any bookings yet. Click 'Book New Session' to schedule your first shoot!"
        />
      ) : (
        <div className="row g-4">
          {bookings.map((b) => (
            <div className="col-12" key={b.id}>
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <div>
                    <span className="badge bg-light text-dark border me-2"><code>#{b.booking_number}</code></span>
                    <strong className="text-dark">Event Date: {new Date(b.event_date).toLocaleDateString()}</strong>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
                <div className="card-body p-4">
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <span className="text-muted small d-block">Venue Location</span>
                      <strong className="text-dark"><i className="bi bi-geo-alt me-1 text-danger"></i>{b.event_venue || 'Raja Studio Main Stage'}</strong>
                    </div>
                    <div className="col-md-6 text-md-end">
                      <span className="text-muted small d-block">Total Contract Amount</span>
                      <h5 className="fw-bold text-primary mb-0">₹{Number(b.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h5>
                      <small className="text-muted">Paid: ₹{Number(b.total_paid).toLocaleString('en-IN')} | Balance: <strong className="text-danger">₹{Number(b.balance_amount).toLocaleString('en-IN')}</strong></small>
                    </div>
                  </div>

                  {/* Price Snapshot Items */}
                  <h6 className="fw-bold small text-uppercase text-muted mb-2">Contract Services:</h6>
                  <div className="p-3 bg-light rounded border mb-3">
                    <ul className="list-unstyled mb-0 small">
                      {b.items?.map((it) => (
                        <li key={it.id} className="d-flex justify-content-between py-1 border-bottom">
                          <span><i className="bi bi-check2 text-success me-2"></i>{it.item_name_snapshot} (Qty: {it.quantity})</span>
                          <span className="fw-semibold">₹{Number(it.line_total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Shoot sessions */}
                  {b.sessions?.length > 0 && (
                    <div className="border-top pt-3">
                      <span className="fw-bold small text-uppercase text-muted d-block mb-2">Dispatched Shoots:</span>
                      <div className="d-flex gap-2 flex-wrap">
                        {b.sessions.map((s) => (
                          <div key={s.id} className="p-2 bg-white border rounded small">
                            <code>{s.session_code}</code>: {new Date(s.scheduled_start).toLocaleString()} &mdash; <StatusBadge status={s.session_status} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}