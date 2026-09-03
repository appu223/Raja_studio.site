import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function CustomerLayout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const menu = [
    { name: 'My Dashboard', path: '/customer/dashboard', icon: 'bi-grid-1x2-fill' },
    { name: 'My Bookings & Shoots', path: '/customer/bookings', icon: 'bi-calendar-heart' },
    { name: 'Invoices & Payments', path: '/customer/finance', icon: 'bi-receipt-cutoff' },
    { name: 'My Photo Galleries', path: '/customer/galleries', icon: 'bi-images' },
    { name: 'Book New Session', path: '/customer/new-booking', icon: 'bi-plus-circle-fill' },
  ];

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Customer Topbar */}
      <header className="bg-white border-bottom sticky-top py-2 px-3 px-md-4 shadow-sm">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <Link to="/customer/dashboard" className="d-flex align-items-center gap-2 text-decoration-none">
              <div
                className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center"
                style={{ width: '38px', height: '38px' }}
              >
                <i className="bi bi-camera-fill fs-5"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-0 text-dark">RAJA STUDIO</h6>
                <small className="text-muted" style={{ fontSize: '0.68rem', letterSpacing: '1px' }}>
                  CLIENT EXPERIENCE PORTAL
                </small>
              </div>
            </Link>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="text-end d-none d-sm-block">
              <div className="fw-bold small text-dark">{user?.first_name || user?.firstName} {user?.last_name || user?.lastName}</div>
              <small className="text-muted">Client Account</small>
            </div>
            <button className="btn btn-sm btn-outline-danger" onClick={logout} title="Sign Out">
              <i className="bi bi-box-arrow-right me-1"></i>Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Sub-bar */}
      <nav className="bg-white border-bottom px-3 px-md-4">
        <div className="container-fluid d-flex gap-2 overflow-auto py-2">
          {menu.map((m) => (
            <Link
              key={m.path}
              to={m.path}
              className={`btn btn-sm text-nowrap ${
                location.pathname === m.path ? 'btn-primary' : 'btn-light border'
              }`}
            >
              <i className={`bi ${m.icon} me-2`}></i>
              {m.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container-fluid py-4 px-3 px-md-4 flex-grow-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-top py-3 text-center text-muted small mt-auto">
        Raja Studio • Client Experience Portal • Connected Securely to Studio Operations
      </footer>
    </div>
  );
}