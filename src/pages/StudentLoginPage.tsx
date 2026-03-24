// ============================================
// ComES Website - Student Login Page (Redesigned)
// ============================================

import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, GraduationCap } from "lucide-react";
import { useStudentStore } from "@/store/studentStore";

const ease = [0.25, 0.46, 0.45, 0.94];

export const StudentLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useStudentStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const success = await login({ email, password });
    if (success) navigate("/student/dashboard");
  };

  return (
    <div className="theme-force-dark flex min-h-screen items-center justify-center bg-bg-primary p-4">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="circuit-grid absolute inset-0 opacity-20" />
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* Back to Home */}
      <Link
        to="/"
        className="font-body text-text-muted hover:text-text-primary absolute top-4 left-4 flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-colors hover:bg-white/5"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="relative w-full max-w-md rounded-2xl border border-border-d bg-bg-card/80 p-8 backdrop-blur-xl"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 shadow-lg shadow-sky-500/30"
          >
            <GraduationCap className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="font-display text-text-primary mb-2 text-2xl font-bold">Student Login</h1>
          <p className="font-body text-text-secondary text-sm">
            Sign in to access your ComES dashboard
          </p>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            <p className="font-body text-sm text-red-400">{error}</p>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-body text-text-secondary mb-2 block text-sm font-medium">
              Email Address
            </label>
            <div className="relative">
              <Mail className="text-text-muted absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-bg-primary font-body text-text-primary placeholder:text-text-muted focus:border-accent-blue w-full rounded-xl border border-border-d py-3 pr-4 pl-10 text-sm transition-colors outline-none"
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-body text-text-secondary mb-2 block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="text-text-muted absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-bg-primary font-body text-text-primary placeholder:text-text-muted focus:border-accent-blue w-full rounded-xl border border-border-d py-3 pr-12 pl-10 text-sm transition-colors outline-none"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-text-muted hover:text-text-secondary absolute top-1/2 right-3 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="bg-bg-primary h-4 w-4 rounded border border-border-h"
              />
              <span className="font-body text-text-muted text-sm">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="font-body text-accent-blue text-sm font-medium hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="font-body w-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 py-3 font-semibold text-white shadow-lg shadow-sky-500/20 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </motion.button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="font-body text-text-muted text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-accent-blue font-medium hover:underline">
              Register here
            </Link>
          </p>
        </div>

        <div className="mt-4 border-t border-border-d pt-4 text-center">
          <p className="font-body text-text-muted text-sm">
            Are you an admin?{" "}
            <Link
              to="/admin/login"
              className="text-text-secondary hover:text-accent-blue font-medium"
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
