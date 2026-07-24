// ============================================
// ComES Website - Protected Route Component
// ============================================

import { Navigate, useLocation } from "react-router";
import { useAuthStore } from "@/store/authStore";
import { useStudentStore } from "@/store/studentStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireStudent?: boolean;
}

export const ProtectedRoute = ({
  children,
  requireAdmin = false,
  requireStudent = false,
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const {
    student,
    isAuthenticated: isStudentAuthenticated,
    isLoading: isStudentLoading,
  } = useStudentStore();
  const location = useLocation();

  // TEMPORARY: Bypass authentication for development
  // TODO: Remove this bypass before production!
  const BYPASS_AUTH = false;

  if (BYPASS_AUTH) {
    return <>{children}</>;
  }

  if (requireStudent) {
    if (isStudentLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        </div>
      );
    }

    if (!isStudentAuthenticated || !student) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
  }

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  // Not logged in - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check admin role if required
  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
