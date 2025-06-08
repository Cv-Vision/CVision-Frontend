import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'candidate' | 'recruiter';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { role } = useAuth();
  const location = useLocation();

  // En desarrollo, permitimos acceso si el rol coincide o si no hay rol requerido
  if (import.meta.env.DEV) {
    if (!role && requiredRole) {
      // Si no hay rol pero se requiere uno, lo establecemos automáticamente
      localStorage.setItem('mockRole', requiredRole);
    }
    return <>{children}</>;
  }

  // En producción, mantenemos la lógica de protección
  if (!role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}