import { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import Loader from '../components/common/Loader';
import StatusBadge from '../components/common/StatusBadge';

export default function DashboardPreview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await reportService.getDashboard();
      setData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadTimer = setTimeout(() => loadDashboard(), 0);
    return () => clearTimeout(loadTimer);
  }, []);

  if (loading) {
    return <Loader message="Aggregating live studio business intelligence..." />;
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
      </div>
    );
  }

  const {
    kpis,
    status_distribution: statusDistribution = [],
    popular_services: popularServices = [],
    upcoming_shoots: upcomingShoots = [],
    recent_payments: recentPayments = [],
  } = data;

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Executive Studio Overview</h4>
          <p className="text-muted small mb-0">Live operations, financial aggregates, active production queues, and dispatch telemetry</p>
        </div>
        <button className="btn btn-primary" onClick={loadDashboard}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh Metrics
        </button>
      </div>

      {/* 6 Real-Time Studio KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-2">
          <div className="card border-0 shadow-sm p-3 bg-white h-100">
            <span className="text-muted small">Total Clients</span>
            <h3 className="fw-bold text-dark my-1">{kpis.total_customers}</h3>
            <small className="text-muted">Registered CRM profiles</small>
          </div>
        </div>

        <div className="col-sm-6 col-xl-2">
          <div className="card border-0 shadow-sm p-3 bg-white h-100">
            <span className="text-muted small">Active Bookings</span>
            <h3 className="fw-bold text-primary my-1">{kpis.total_bookings}</h3>
            <small className="text-muted">Committed contracts</small>
          </div>
        </div>

        <div className="col-sm-6 col-xl-2">
          <div className="card border-0 shadow-sm p-3 bg-white h-100">
            <span className="text-muted small">Shoots Today</span>
            <h3 className="fw-bold text-warning my-1">{kpis.shoots_today}</h3>
            <small className="text-muted">On-stage & on-location</small>
          </div>
        </div>

        <div className="col-sm-6 col-xl-2">
          <div className="card border-0 shadow-sm p-3 bg-white h-100">
            <span className="text-muted small">Editing Queue</span>
            <h3 className="fw-bold text-info my-1">{kpis.editing_queue_depth}</h3>
            <small className="text-muted">Tasks in post-production</small>
          </div>
        </div>

        <div className="col-sm-6 col-xl-2">
          <div className="card border-0 shadow-sm p-3 bg-white h-100">
            <span className="text-muted small">Realized Revenue</span>
            <h3 className="fw-bold text-success my-1" style={{ fontSize: '1.4rem' }}>
              ₹{kpis.total_revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </h3>
            <small className="text-muted">Verified bank/cash receipts</small>
          </div>
        </div>

        <div className="col-sm-6 col-xl-2">
          <div className="card border-0 shadow-sm p-3 bg-white h-100">
            <span className="text-muted small">Receivables Due</span>
            <h3 className="fw-bold text-danger my-1" style={{ fontSize: '1.4rem' }}>
              ₹{kpis.outstanding_receivables.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </h3>
            <small className="text-muted">Pending balance recovery</small>
          </div>
        </div>
      </div>

      {/* Row 2: Upcoming Shoots & Booking Status Distribution */}
      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <span className="fw-bold">
                <i className="bi bi-camera-fill text-primary me-2"></i>Upcoming Shoot Dispatches
              </span>
              <span className="badge bg-light text-dark border">Next 5 Sessions</span>
            </div>
            <div className="card-body p-0">
              {upcomingShoots.length === 0 ? (
                <div className="text-center text-muted p-4">No upcoming shoots scheduled for today or future dates.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small">
                      <tr>
                        <th className="ps-4">Code</th>
                        <th>Customer</th>
                        <th>Date & Time</th>
                        <th>Venue</th>
                        <th className="text-end pe-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingShoots.map((s) => (
                        <tr key={s.id}>
                          <td className="ps-4"><code>{s.session_code}</code></td>
                          <td className="fw-semibold text-dark">{s.customer_name}</td>
                          <td className="small text-muted">{new Date(s.scheduled_start).toLocaleString()}</td>
                          <td className="small text-truncate" style={{ maxWidth: '140px' }}>{s.venue}</td>
                          <td className="text-end pe-4"><StatusBadge status={s.session_status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white fw-bold">
              <i className="bi bi-pie-chart-fill text-info me-2"></i>Booking Pipeline Distribution
            </div>
            <div className="card-body">
              {statusDistribution.length === 0 ? (
                <div className="text-center text-muted p-4">No bookings recorded yet.</div>
              ) : (
                <ul className="list-group list-group-flush">
                  {statusDistribution.map((sd) => (
                    <li key={sd.status} className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                      <span className="text-capitalize fw-semibold text-secondary">
                        {sd.status.replace('_', ' ')}
                      </span>
                      <span className="badge bg-primary rounded-pill px-3 py-1">{sd.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Popular Services & Recent Payments */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white fw-bold">
              <i className="bi bi-award-fill text-warning me-2"></i>Top Services by Studio Demand
            </div>
            <div className="card-body p-0">
              {popularServices.length === 0 ? (
                <div className="text-center text-muted p-4">Service sales analytics will appear once bookings are committed.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small">
                      <tr>
                        <th className="ps-4">Service Item</th>
                        <th className="text-center">Bookings</th>
                        <th className="text-end pe-4">Total Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {popularServices.map((ps, idx) => (
                        <tr key={idx}>
                          <td className="ps-4 fw-semibold text-dark">{ps.name}</td>
                          <td className="text-center"><span className="badge bg-light text-dark border">{ps.count} orders</span></td>
                          <td className="text-end pe-4 fw-bold text-success">
                            ₹{Number(ps.total_revenue).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white fw-bold">
              <i className="bi bi-credit-card-2-front-fill text-success me-2"></i>Recent Financial Receipts
            </div>
            <div className="card-body p-0">
              {recentPayments.length === 0 ? (
                <div className="text-center text-muted p-4">No verified payment transactions logged yet.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small">
                      <tr>
                        <th className="ps-4">Receipt</th>
                        <th>Client</th>
                        <th>Method</th>
                        <th className="text-end pe-4">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPayments.map((rp, idx) => (
                        <tr key={idx}>
                          <td className="ps-4"><code>{rp.payment_number}</code></td>
                          <td className="fw-semibold text-dark">{rp.customer_name}</td>
                          <td><span className="badge bg-light text-dark border text-uppercase">{rp.payment_method}</span></td>
                          <td className="text-end pe-4 fw-bold text-success">
                            +₹{Number(rp.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}