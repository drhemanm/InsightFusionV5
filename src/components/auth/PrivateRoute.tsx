import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation();
  const { user, isAuthenticated, isLoading, setLoading } = useAuthStore();

  // Prevent infinite loading by setting a timeout
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        console.log('⏰ PrivateRoute loading timeout, forcing loading to false');
        setLoading(false);
      }, 5000); // 5 second timeout for private routes

      return () => clearTimeout(timeout);
    }
  }, [isLoading, setLoading]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">If this takes too long, please refresh the page</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    console.log('🚫 Redirecting to login - not authenticated');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('✅ User authenticated, rendering protected content');
  return <>{children}</>;
};