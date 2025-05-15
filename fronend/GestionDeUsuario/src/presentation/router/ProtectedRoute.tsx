import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@hooks/useAuth';
import Loading from '@components/UI/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'USER' | 'ANY';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'ANY' 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Check if user has correct role
  const hasRequiredRole = () => {
    if (requiredRole === 'ANY') return true;
    if (!user) return false;
    
    if (requiredRole === 'ADMIN') {
      return user.role === 'ADMIN';
    }
    
    if (requiredRole === 'USER') {
      // In this app, ADMIN can access USER routes too
      return user.role === 'USER' || user.role === 'ADMIN';
    }
    
    return false;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading message="Checking authentication..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!hasRequiredRole()) {
    // Redirect to dashboard if authenticated but wrong role
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;