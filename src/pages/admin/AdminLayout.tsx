// ============================================
// ComES Website - Admin Layout
// ============================================

import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  FolderKanban,
  FileText,
  Users,
  Mail,
  Newspaper,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  BarChart3,
  UserCircle,
  BrainCircuit,
} from "lucide-react";
import { useAuthStore } from "@/store";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";
import { ThemeToggle } from "@/components/ui";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/admin/members", label: "Members", icon: UserCircle },
  { path: "/admin/events", label: "Events", icon: Calendar },
  { path: "/admin/projects", label: "Projects", icon: FolderKanban },
  { path: "/admin/blog", label: "Blog Posts", icon: FileText },
  { path: "/admin/team", label: "Team Members", icon: Users },
  { path: "/admin/contacts", label: "Contact Messages", icon: Mail },
  { path: "/admin/notifications", label: "Notifications", icon: Bell },
  { path: "/admin/newsletter", label: "Newsletter", icon: Newspaper },
  { path: "/admin/quizzes", label: "Quizzes", icon: BrainCircuit },
  { path: "/admin/settings", label: "Settings", icon: Settings },
];

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className={cn("flex min-h-screen", isDark ? "bg-slate-950" : "bg-gray-100")}>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 hidden h-full flex-col transition-all duration-300 lg:flex",
          sidebarOpen ? "w-64" : "w-20",
          isDark ? "border-r border-slate-800 bg-slate-900" : "border-r border-gray-200 bg-white",
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex h-16 items-center gap-3 border-b px-4",
            isDark ? "border-slate-800" : "border-gray-200",
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 font-bold text-white">
            CE
          </div>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn("text-lg font-bold", isDark ? "text-white" : "text-gray-900")}
            >
              Admin Panel
            </motion.span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all",
                      sidebarOpen ? "justify-start" : "justify-center",
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                        : isDark
                          ? "text-gray-400 hover:bg-slate-800 hover:text-white"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                    )
                  }
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={cn(
            "absolute top-20 -right-3 flex h-6 w-6 items-center justify-center rounded-full shadow-lg",
            isDark ? "bg-slate-800 text-gray-400" : "border border-gray-200 bg-white text-gray-600",
          )}
        >
          <ChevronRight
            className={cn("h-4 w-4 transition-transform", !sidebarOpen && "rotate-180")}
          />
        </button>

        {/* User Info */}
        <div className={cn("border-t p-4", isDark ? "border-slate-800" : "border-gray-200")}>
          <div className={cn("flex items-center gap-3", !sidebarOpen && "justify-center")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 font-bold text-white">
              {user?.name?.charAt(0) || "A"}
            </div>
            {sidebarOpen && (
              <div className="min-w-0 flex-1">
                <p className={cn("truncate font-medium", isDark ? "text-white" : "text-gray-900")}>
                  {user?.name || "Admin"}
                </p>
                <p className={cn("truncate text-sm", isDark ? "text-gray-500" : "text-gray-500")}>
                  {user?.email || "admin@comes.lk"}
                </p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={handleLogout}
              className={cn(
                "mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 transition-colors",
                isDark
                  ? "bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900",
              )}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <div
        className={cn(
          "fixed top-0 right-0 left-0 z-40 flex h-16 items-center justify-between px-4 lg:hidden",
          isDark ? "border-b border-slate-800 bg-slate-900" : "border-b border-gray-200 bg-white",
        )}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className={cn("rounded-lg p-2", isDark ? "hover:bg-slate-800" : "hover:bg-gray-100")}
          >
            <Menu className={cn("h-6 w-6", isDark ? "text-white" : "text-gray-900")} />
          </button>
          <span className={cn("font-bold", isDark ? "text-white" : "text-gray-900")}>
            Admin Panel
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            className={cn(
              "relative rounded-lg p-2",
              isDark ? "hover:bg-slate-800" : "hover:bg-gray-100",
            )}
          >
            <Bell className={cn("h-5 w-5", isDark ? "text-gray-400" : "text-gray-600")} />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className={cn(
                "fixed top-0 left-0 z-50 flex h-full w-72 flex-col lg:hidden",
                isDark ? "bg-slate-900" : "bg-white",
              )}
            >
              <div
                className={cn(
                  "flex h-16 items-center justify-between border-b px-4",
                  isDark ? "border-slate-800" : "border-gray-200",
                )}
              >
                <span className={cn("text-lg font-bold", isDark ? "text-white" : "text-gray-900")}>
                  Admin Panel
                </span>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className={cn("h-6 w-6", isDark ? "text-gray-400" : "text-gray-600")} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        end={item.end}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all",
                            isActive
                              ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                              : isDark
                                ? "text-gray-400 hover:bg-slate-800 hover:text-white"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                          )
                        }
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className={cn("border-t p-4", isDark ? "border-slate-800" : "border-gray-200")}>
                <button
                  onClick={handleLogout}
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 transition-colors",
                    isDark
                      ? "bg-slate-800 text-gray-400 hover:text-white"
                      : "bg-gray-100 text-gray-600 hover:text-gray-900",
                  )}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen flex-1 transition-all duration-300",
          "pt-16 lg:pt-0",
          sidebarOpen ? "lg:ml-64" : "lg:ml-20",
        )}
      >
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
