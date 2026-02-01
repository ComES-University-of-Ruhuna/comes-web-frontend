// ============================================
// ComES Website - Protected Route Component
// ============================================

import { Navigate, useLocation } from 'react-router';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  // TEMPORARY: Bypass authentication for development
  // TODO: Remove this bypass before production!
  const BYPASS_AUTH = true;

  if (BYPASS_AUTH) {
    return <>{children}</>;
  }

  const { user, isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="w-8 h-8 border-2 border-blue-500 rounded-full animate-spin border-t-transparent" />
      </div>
    );
  }

  // Not logged in - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check admin role if required
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
