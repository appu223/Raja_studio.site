import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => localStorage.getItem('raja_sidebar_collapsed') === 'true');

  const toggleSidebarCollapsed = () => {
    setIsSidebarCollapsed((collapsed) => {
      const nextCollapsed = !collapsed;
      localStorage.setItem('raja_sidebar_collapsed', String(nextCollapsed));
      return nextCollapsed;
    });
  };

  return (
    <div className={`app-wrapper ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onClose={() => setIsSidebarOpen(false)}
        onToggleCollapse={toggleSidebarCollapsed}
      />
      {isSidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop d-lg-none"
          aria-label="Close navigation"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <div className="app-main">
        <Topbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onToggleCollapse={toggleSidebarCollapsed}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
}
