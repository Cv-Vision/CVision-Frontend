import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'applicant' | 'recruiter';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const role = user?.role as 'applicant' | 'recruiter' | undefined;

  // En desarrollo, permitimos acceso si el rol coincide o si no hay rol requerido
  if (import.meta.env.DEV) {
    if (!role && requiredRole) {
      // Si no hay rol pero se requiere uno, lo establecemos automáticamente
      localStorage.setItem('mockRole', requiredRole);
    }
    return <>{children}</>;
  }

  // Usuarios no autenticados o sin rol requerido redirigen a home
  if (!isAuthenticated || (requiredRole && role !== requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}