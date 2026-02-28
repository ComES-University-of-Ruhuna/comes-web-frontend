// ============================================
// ComES Website - Admin Login Page
// ============================================

import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";
import { useAuthStore, useThemeStore } from "@/store";
import { cn } from "@/utils";
import { Button, ThemeToggle } from "@/components/ui";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const success = await login({ email, password });
    if (success) {
      navigate("/admin");
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
        <span>Back to Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "relative z-10 w-full max-w-md rounded-2xl p-8 shadow-2xl",
          isDark
            ? "border border-slate-800 bg-slate-900/80 backdrop-blur-xl"
            : "border border-gray-200 bg-white/80 backdrop-blur-xl",
        )}
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-2xl font-bold text-white shadow-lg shadow-blue-500/30">
            CE
          </div>
          <h1 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
            Admin Login
          </h1>
          <p className={cn("mt-2", isDark ? "text-gray-400" : "text-gray-600")}>
            Sign in to access the dashboard
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-500"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
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
                  "absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2",
                  isDark ? "text-gray-500" : "text-gray-400",
                )}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="youremail@domain.lk"
                required
                className={cn(
                  "w-full rounded-xl border py-3 pr-4 pl-12 transition-colors",
                  isDark
                    ? "border-slate-700 bg-slate-800 text-white placeholder-gray-500 focus:border-blue-500"
                    : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-blue-500",
                  "focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
                )}
              />
            </div>
          </div>

          {/* Password Field */}
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
                  "absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2",
                  isDark ? "text-gray-500" : "text-gray-400",
                )}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={cn(
                  "w-full rounded-xl border py-3 pr-12 pl-12 transition-colors",
                  isDark
                    ? "border-slate-700 bg-slate-800 text-white placeholder-gray-500 focus:border-blue-500"
                    : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-blue-500",
                  "focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={cn(
                  "absolute top-1/2 right-4 -translate-y-1/2",
                  isDark
                    ? "text-gray-500 hover:text-gray-300"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" variant="primary" loading={isLoading} className="w-full">
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <p className={cn("mt-6 text-center text-sm", isDark ? "text-gray-500" : "text-gray-500")}>
          Protected area. Authorized personnel only.
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
