import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/common/Loader';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <Loader message="Verifying security credentials..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role_name || user?.role)) {
    return (
      <div className="alert alert-danger m-4">
        <h5 className="fw-bold"><i className="bi bi-shield-lock-fill me-2"></i>Access Forbidden</h5>
        <p className="mb-0">Your account role ({user?.role_name || user?.role}) does not have permission to view this section.</p>
      </div>
    );
  }

  return children;
}
