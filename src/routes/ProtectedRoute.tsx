import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/constants/roles';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-brand-dark text-brand-text">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent"></div>
          <p className="text-sm font-medium text-brand-muted">Validating credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role) && role !== 'admin') {
    const defaultRedirects: Record<UserRole, string> = {
      government: '/government',
      procurement: '/procurement',
      shipping: '/shipping',
      refinery: '/refinery',
      executive: '/decision',
      admin: '/government',
    };
    return <Navigate to={defaultRedirects[role]} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
