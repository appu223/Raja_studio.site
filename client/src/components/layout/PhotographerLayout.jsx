import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function PhotographerLayout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const menu = [
    { name: 'My Shoots & Schedule', path: '/photographer/dashboard', icon: 'bi-camera-reels-fill' },
    { name: 'My Checked-out Gear', path: '/photographer/gear', icon: 'bi-box-seam-fill' },
  ];

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <header className="bg-dark text-white sticky-top py-2 px-3 px-md-4 shadow">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-warning text-dark rounded-3 d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
              <i className="bi bi-camera-fill fs-5"></i>
            </div>
            <div>
              <h6 className="fw-bold mb-0 text-white">RAJA STUDIO</h6>
              <small className="text-warning" style={{ fontSize: '0.68rem', letterSpacing: '1px' }}>
                CREW FIELD WORKSPACE
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="text-end d-none d-sm-block">
              <div className="fw-bold small text-white">{user?.first_name || user?.firstName} {user?.last_name || user?.lastName}</div>
              <small className="text-white-50">Lead Photographer</small>
            </div>
            <button className="btn btn-sm btn-outline-light" onClick={logout}>
              <i className="bi bi-box-arrow-right me-1"></i>Sign Out
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white border-bottom px-3 px-md-4">
        <div className="container-fluid d-flex gap-2 py-2">
          {menu.map((m) => (
            <Link
              key={m.path}
              to={m.path}
              className={`btn btn-sm ${location.pathname === m.path ? 'btn-dark' : 'btn-light border'}`}
            >
              <i className={`bi ${m.icon} me-1`}></i>
              {m.name}
            </Link>
          ))}
        </div>
      </nav>

      <main className="container-fluid py-4 px-3 px-md-4 flex-grow-1">
        {children}
      </main>
    </div>
  );
}