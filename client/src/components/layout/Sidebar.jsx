import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'bi-speedometer2' },
    { name: 'Calendar Dispatch', path: '/calendar', icon: 'bi-calendar-week' },
    { name: 'Customers', path: '/customers', icon: 'bi-people' },
    { name: 'Enquiries', path: '/enquiries', icon: 'bi-chat-dots' },
    { name: 'Services & Catalog', path: '/services', icon: 'bi-camera-reels' },
    { name: 'Bookings', path: '/bookings', icon: 'bi-calendar-check' },
    { name: 'Shoots', path: '/shoots', icon: 'bi-camera' },
    { name: 'Editing Queue', path: '/editing', icon: 'bi-scissors' },
    { name: 'Galleries', path: '/galleries', icon: 'bi-images' },
    { name: 'Finance & Invoices', path: '/finance', icon: 'bi-cash-stack' },
    { name: 'Inventory', path: '/inventory', icon: 'bi-box-seam' },
    { name: 'Reports', path: '/reports', icon: 'bi-graph-up' },
    { name: 'Administration', path: '/admin', icon: 'bi-shield-lock' },
  ];

  return (
    <aside className={`app-sidebar ${isOpen ? 'show' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-icon">
          <i className="bi bi-camera-fill"></i>
        </div>
        <div>
          <h1 className="brand-title">RAJA STUDIO</h1>
          <small className="text-muted" style={{ fontSize: '0.7rem' }}>MANAGEMENT ERP</small>
        </div>
      </div>

      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={onClose}
            >
              <i className={`bi ${item.icon} fs-5`}></i>
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}