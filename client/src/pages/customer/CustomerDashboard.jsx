import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customerPortalService } from '../../services/customerPortalService';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/common/StatusBadge';

export default function CustomerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    customerPortalService.getDashboard()
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader message="Loading your studio dashboard..." />;
  }

  const { customer, summary } = data;

  return (
    <div>
      {/* Welcome Banner */}
      <div className="card border-0 shadow-sm p-4 bg-primary text-white rounded-3 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h3 className="fw-bold mb-1">Welcome back, {customer.full_name}! 👋</h3>
            <p className="mb-0 text-white-50">
              Track your scheduled photo shoots, download edited galleries, and view invoices in real time.
            </p>
          </div>
          <Link to="/customer/new-booking" className="btn btn-light text-primary fw-bold text-nowrap">
            <i className="bi bi-calendar-plus me-1"></i>Book New Session
          </Link>
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm p-3 bg-white h-100">
            <span className="text-muted small">My Studio Bookings</span>
            <h3 className="fw-bold text-dark my-1">{summary.total_bookings}</h3>
            <Link to="/customer/bookings" className="small text-primary text-decoration-none">
              View history &rarr;
            </Link>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm p-3 bg-white h-100">
            <span className="text-muted small">Outstanding Balance</span>
            <h3 className={`fw-bold my-1 ${summary.outstanding_balance > 0 ? 'text-danger' : 'text-success'}`}>
              ₹{summary.outstanding_balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h3>
            <Link to="/customer/finance" className="small text-primary text-decoration-none">
              {summary.outstanding_balance > 0 ? 'Pay balance now &rarr;' : 'All paid &rarr;'}
            </Link>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm p-3 bg-white h-100">
            <span className="text-muted small">Delivered Galleries</span>
            <h3 className="fw-bold text-info my-1">{summary.ready_galleries}</h3>
            <Link to="/customer/galleries" className="small text-primary text-decoration-none">
              Browse photo albums &rarr;
            </Link>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm p-3 bg-white h-100">
            <span className="text-muted small">Total Paid to Studio</span>
            <h3 className="fw-bold text-success my-1">
              ₹{summary.total_paid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h3>
            <small className="text-muted">Verified receipts</small>
          </div>
        </div>
      </div>

      {/* Next Upcoming Shoot Alert */}
      {summary.upcoming_shoot ? (
        <div className="card border-0 shadow-sm mb-4 border-start border-warning border-4">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="badge bg-warning text-dark text-uppercase">Upcoming Scheduled Shoot</span>
              <StatusBadge status={summary.upcoming_shoot.session_status} />
            </div>
            <h5 className="fw-bold text-dark mb-1">
              <i className="bi bi-camera me-2 text-primary"></i>
              Session #{summary.upcoming_shoot.session_code}
            </h5>
            <div className="row g-2 text-muted small mt-2">
              <div className="col-sm-6">
                <strong>Start Time:</strong> {new Date(summary.upcoming_shoot.scheduled_start).toLocaleString()}
              </div>
              <div className="col-sm-6">
                <strong>Venue:</strong> {summary.upcoming_shoot.venue || 'Studio Main Stage'}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm p-4 text-center mb-4 bg-white">
          <i className="bi bi-calendar-check text-muted" style={{ fontSize: '2.5rem' }}></i>
          <h6 className="fw-bold mt-2">No active shoots on your calendar today</h6>
          <p className="text-muted small mb-0">Need a wedding, portrait, or product photography session? We're ready!</p>
        </div>
      )}
    </div>
  );
}