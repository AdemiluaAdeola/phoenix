import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';

export default function AdminRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, isAdmin, isLoading, error } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="container">
        <div className="card">
          <h3>Checking admin access...</h3>
          <p>Please wait while Supabase verifies your session.</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return (
      <div className="container">
        <div className="card">
          <h3>Admin access required</h3>
          <p>{error || 'Your account does not have permission to view this dashboard.'}</p>
        </div>
      </div>
    );
  }

  return children;
}
