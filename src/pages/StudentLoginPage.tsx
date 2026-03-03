// ============================================
// ComES Website - Student Login Page
// ============================================

import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, GraduationCap } from "lucide-react";
import { useStudentStore } from "@/store/studentStore";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";
import { Button, ThemeToggle } from "@/components/ui";

export const StudentLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useStudentStore();
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const success = await login({ email, password });
    if (success) {
      navigate("/student/dashboard");
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center p-4",
        isDark
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
          : "bg-gradient-to-br from-blue-50 via-white to-cyan-50",
      )}
    >
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={cn(
            "absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-3xl",
            isDark ? "bg-blue-500/10" : "bg-blue-400/20",
          )}
        />
        <div
          className={cn(
            "absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full blur-3xl",
            isDark ? "bg-cyan-500/10" : "bg-cyan-400/20",
          )}
        />
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Back to Home */}
      <Link
        to="/"
        className={cn(
          "absolute top-4 left-4 flex items-center gap-2 rounded-xl px-4 py-2 transition-colors",
          isDark
            ? "text-gray-400 hover:bg-slate-800 hover:text-white"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        )}
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "relative w-full max-w-md rounded-2xl p-8",
          isDark
            ? "border border-slate-800 bg-slate-900/80 backdrop-blur-xl"
            : "bg-white/80 shadow-2xl backdrop-blur-xl",
        )}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className={cn(
              "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl",
              isDark
                ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                : "bg-gradient-to-br from-blue-600 to-cyan-600",
            )}
          >
            <GraduationCap className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className={cn("mb-2 text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
            Student Login
          </h1>
          <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
            Sign in to access your ComES dashboard
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            <p className="text-sm text-red-500">{error}</p>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className={cn(
                "mb-2 block text-sm font-medium",
                isDark ? "text-gray-300" : "text-gray-700",
              )}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                className={cn(
                  "absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2",
                  isDark ? "text-gray-500" : "text-gray-400",
                )}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "w-full rounded-xl border py-3 pr-4 pl-10 transition-all",
                  isDark
                    ? "border-slate-700 bg-slate-800 text-white placeholder-gray-500 focus:border-blue-500"
                    : "border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500",
                )}
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label
              className={cn(
                "mb-2 block text-sm font-medium",
                isDark ? "text-gray-300" : "text-gray-700",
              )}
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className={cn(
                  "absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2",
                  isDark ? "text-gray-500" : "text-gray-400",
                )}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  "w-full rounded-xl border py-3 pr-12 pl-10 transition-all",
                  isDark
                    ? "border-slate-700 bg-slate-800 text-white placeholder-gray-500 focus:border-blue-500"
                    : "border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500",
                )}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={cn(
                  "absolute top-1/2 right-3 -translate-y-1/2",
                  isDark
                    ? "text-gray-500 hover:text-gray-300"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className={cn(
                  "h-4 w-4 rounded border transition-colors",
                  isDark ? "border-slate-600 bg-slate-800" : "border-gray-300",
                )}
              />
              <span className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                Remember me
              </span>
            </label>
            <Link
              to="/forgot-password"
              className={cn(
                "text-sm font-medium",
                isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700",
              )}
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
            Don't have an account?{" "}
            <Link
              to="/register"
              className={cn(
                "font-medium hover:underline",
                isDark ? "text-blue-400" : "text-blue-600",
              )}
            >
              Register here
            </Link>
          </p>
        </div>

        {/* Admin Link */}
        <div
          className="mt-4 border-t pt-4 text-center"
          style={{ borderColor: isDark ? "#334155" : "#e5e7eb" }}
        >
          <p className={cn("text-sm", isDark ? "text-gray-500" : "text-gray-500")}>
            Are you an admin?{" "}
            <Link
              to="/admin/login"
              className={cn(
                "font-medium hover:underline",
                isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-900",
              )}
            >
              Admin Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentLoginPage;
