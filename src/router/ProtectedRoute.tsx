import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/other/LoadingSpinner';

interface ProtectedRouteProps {
  requiredRole: 'applicant' | 'recruiter' | 'admin';
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  console.log('ProtectedRoute: isAuthenticated', isAuthenticated);
  console.log('ProtectedRoute: user', user);
  console.log('ProtectedRoute: isLoading', isLoading);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute; 