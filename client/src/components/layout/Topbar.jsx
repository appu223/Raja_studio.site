import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { reportService } from '../../services/reportService';
import { Link } from 'react-router-dom';

export default function Topbar({ onToggleSidebar, onToggleCollapse, isSidebarCollapsed }) {
  const { user, logout } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (user) {
      reportService.getNotifications()
        .then((res) => setNotifications(res.data.data))
        .catch(() => {});
    }
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      await reportService.markNotificationRead(id);
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, is_read: 1 } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const initials = user
    ? `${user.first_name?.[0] || user.firstName?.[0] || 'U'}${user.last_name?.[0] || user.lastName?.[0] || ''}`
    : 'RS';

  return (
    <header className="app-topbar position-relative">
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-light d-lg-none" onClick={onToggleSidebar}>
          <i className="bi bi-list fs-5"></i>
        </button>
        <button
          type="button"
          className="btn btn-light d-none d-lg-inline-flex align-items-center justify-content-center"
          onClick={onToggleCollapse}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <i className={`bi ${isSidebarCollapsed ? 'bi-layout-sidebar' : 'bi-layout-sidebar-inset'} fs-5`}></i>
        </button>
        <span className="fw-semibold text-secondary">Studio Workspace</span>
      </div>

      <div className="d-flex align-items-center gap-3">
        {/* Notification Bell with Badge & Dropdown */}
        <div className="position-relative">
          <button
            className="btn btn-sm btn-outline-secondary position-relative"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <i className="bi bi-bell"></i>
            {unreadCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
            )}
          </button>

          {showDropdown && (
            <div
              className="card position-absolute end-0 mt-2 shadow border-0"
              style={{ width: '320px', zIndex: 1050 }}
            >
              <div className="card-header bg-white d-flex justify-content-between align-items-center py-2">
                <span className="small fw-bold">Notifications ({unreadCount} new)</span>
                <button className="btn-close small" style={{ fontSize: '0.65rem' }} onClick={() => setShowDropdown(false)}></button>
              </div>
              <div className="list-group list-group-flush small" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div className="p-3 text-center text-muted">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`list-group-item list-group-item-action p-2 ${!n.is_read ? 'bg-light' : ''}`}
                      onClick={() => handleMarkAsRead(n.id)}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <strong className="text-dark">{n.title}</strong>
                        {!n.is_read && <span className="badge bg-primary" style={{ fontSize: '0.6rem' }}>NEW</span>}
                      </div>
                      <p className="mb-1 text-muted" style={{ fontSize: '0.8rem' }}>{n.message}</p>
                      {n.action_link && (
                        <Link to={n.action_link} className="text-primary fw-semibold" style={{ fontSize: '0.75rem' }}>
                          View Module &rarr;
                        </Link>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Badge */}
        <div className="d-flex align-items-center gap-2 border-start ps-3">
          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
            style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}
          >
            {initials}
          </div>
          <div className="d-none d-sm-block text-start me-2">
            <div className="fw-bold small" style={{ lineHeight: 1.2 }}>
              {user ? `${user.first_name || user.firstName} ${user.last_name || user.lastName}` : 'Raja Staff'}
            </div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>{user?.role_name || user?.role || 'Staff'}</div>
          </div>
          <button className="btn btn-sm btn-outline-danger" title="Sign Out" onClick={logout}>
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </div>
    </header>
  );
}