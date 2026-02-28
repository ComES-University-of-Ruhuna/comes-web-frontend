// ============================================
// ComES Website - User Profile Dropdown Component
// ============================================

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  Moon,
  Sun,
  Monitor,
  ChevronRight,
  GraduationCap,
  Shield,
} from "lucide-react";
import { useStudentStore } from "@/store/studentStore";
import { useAuthStore, useThemeStore } from "@/store";
import { cn } from "@/utils";

export const UserProfileDropdown = ({
  isScrolled = false,
  variant = "navbar",
}: {
  isScrolled?: boolean;
  variant?: "navbar" | "mobile";
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { student, isAuthenticated: isStudentAuth, logout: studentLogout } = useStudentStore();
  const { user, isAuthenticated: isAdminAuth, logout: adminLogout } = useAuthStore();
  const { theme, setTheme, resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  const isAuthenticated = isStudentAuth || isAdminAuth;
  const currentUser = student || user;
  const isAdmin = isAdminAuth && user?.role === "admin";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    if (isStudentAuth) {
      studentLogout();
    }
    if (isAdminAuth) {
      await adminLogout();
    }
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  // If not authenticated, show login buttons
  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-medium transition-all",
            isScrolled
              ? isDark
                ? "text-gray-300 hover:bg-slate-800 hover:text-white"
                : "text-gray-700 hover:bg-gray-100"
              : "text-white/90 hover:bg-white/10 hover:text-white",
          )}
        >
          Login
        </Link>
        <Link
          to="/register"
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-medium transition-all",
            "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600",
          )}
        >
          Register
        </Link>
      </div>
    );
  }

  // Mobile variant
  if (variant === "mobile") {
    return (
      <div className="space-y-2">
        {/* User Info */}
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl p-4",
            isDark ? "bg-slate-800" : "bg-gray-100",
          )}
        >
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full font-semibold",
              isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600",
            )}
          >
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser?.name || "User"}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              getInitials(currentUser?.name || "User")
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className={cn("truncate font-medium", isDark ? "text-white" : "text-gray-900")}>
              {currentUser?.name}
            </p>
            <p className={cn("truncate text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
              {currentUser?.email}
            </p>
          </div>
          {isAdmin ? (
            <Shield className="h-5 w-5 text-amber-500" />
          ) : (
            <GraduationCap className={cn("h-5 w-5", isDark ? "text-blue-400" : "text-blue-600")} />
          )}
        </div>

        {/* Dashboard Link */}
        <Link
          to={isAdmin ? "/admin" : "/student/dashboard"}
          className={cn(
            "flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
            isDark ? "text-gray-300 hover:bg-slate-800" : "text-gray-700 hover:bg-gray-100",
          )}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>{isAdmin ? "Admin Dashboard" : "Dashboard"}</span>
        </Link>

        {/* Profile Link */}
        <Link
          to={isAdmin ? "/admin/settings" : "/student/profile"}
          className={cn(
            "flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
            isDark ? "text-gray-300 hover:bg-slate-800" : "text-gray-700 hover:bg-gray-100",
          )}
        >
          <User className="h-5 w-5" />
          <span>Profile</span>
        </Link>

        {/* Theme Selector */}
        <div className={cn("px-4 py-3", isDark ? "text-gray-300" : "text-gray-700")}>
          <p className="mb-2 text-sm font-medium">Theme</p>
          <div className="flex gap-2">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm transition-all",
                  theme === option.value
                    ? isDark
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-blue-100 text-blue-600"
                    : isDark
                      ? "bg-slate-800 hover:bg-slate-700"
                      : "bg-gray-100 hover:bg-gray-200",
                )}
              >
                <option.icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-500 transition-all hover:bg-red-500/10",
          )}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    );
  }

  // Desktop dropdown variant
  return (
    <div ref={dropdownRef} className="relative">
      {/* Profile Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",
          isOpen
            ? isDark
              ? "border-blue-500 bg-blue-500/20"
              : "border-blue-500 bg-blue-50"
            : isScrolled
              ? isDark
                ? "border-slate-700 bg-slate-800 hover:border-slate-600"
                : "border-gray-200 bg-white hover:border-gray-300"
              : "border-white/30 bg-white/10 hover:bg-white/20",
          isScrolled ? (isDark ? "text-white" : "text-gray-900") : "text-white",
        )}
      >
        {currentUser?.avatar ? (
          <img
            src={currentUser.avatar}
            alt={currentUser?.name || "User"}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          getInitials(currentUser?.name || "User")
        )}
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl border shadow-xl",
              isDark ? "border-slate-800 bg-slate-900" : "border-gray-200 bg-white",
            )}
          >
            {/* User Info Header */}
            <div className={cn("border-b p-4", isDark ? "border-slate-800" : "border-gray-100")}>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full font-semibold",
                    isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600",
                  )}
                >
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser?.name || "User"}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(currentUser?.name || "User")
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        "truncate font-medium",
                        isDark ? "text-white" : "text-gray-900",
                      )}
                    >
                      {currentUser?.name}
                    </p>
                    {isAdmin && (
                      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-500">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className={cn("truncate text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                    {currentUser?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <Link
                to={isAdmin ? "/admin" : "/student/dashboard"}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all",
                  isDark
                    ? "text-gray-300 hover:bg-slate-800 hover:text-white"
                    : "text-gray-700 hover:bg-gray-100",
                )}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="flex-1">{isAdmin ? "Admin Dashboard" : "Dashboard"}</span>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </Link>

              <Link
                to={isAdmin ? "/admin/settings" : "/student/profile"}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all",
                  isDark
                    ? "text-gray-300 hover:bg-slate-800 hover:text-white"
                    : "text-gray-700 hover:bg-gray-100",
                )}
              >
                <User className="h-5 w-5" />
                <span className="flex-1">Profile</span>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </Link>

              {!isAdmin && (
                <Link
                  to="/student/settings"
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all",
                    isDark
                      ? "text-gray-300 hover:bg-slate-800 hover:text-white"
                      : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  <Settings className="h-5 w-5" />
                  <span className="flex-1">Settings</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
              )}
            </div>

            {/* Theme Selector */}
            <div className={cn("border-t p-4", isDark ? "border-slate-800" : "border-gray-100")}>
              <p
                className={cn(
                  "mb-2 text-xs font-medium",
                  isDark ? "text-gray-500" : "text-gray-400",
                )}
              >
                THEME
              </p>
              <div className="flex gap-1">
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm transition-all",
                      theme === option.value
                        ? isDark
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-blue-100 text-blue-600"
                        : isDark
                          ? "text-gray-400 hover:bg-slate-800 hover:text-white"
                          : "text-gray-600 hover:bg-gray-100",
                    )}
                  >
                    <option.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Logout */}
            <div className={cn("border-t p-2", isDark ? "border-slate-800" : "border-gray-100")}>
              <button
                onClick={handleLogout}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all",
                  "text-red-500 hover:bg-red-500/10",
                )}
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfileDropdown;
