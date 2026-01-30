import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';
import { Role } from '../types/role';
import React from 'react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: Role[] }> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  const loc = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" state={{ from: loc }} replace />;
  if (allowedRoles && (!user || !allowedRoles.includes((user.role as Role)))) return <Navigate to="/login" replace />;

  return <>{children}</>;
};
