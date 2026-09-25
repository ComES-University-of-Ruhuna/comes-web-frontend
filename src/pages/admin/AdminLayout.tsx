// ============================================
// ComES Website - Admin Layout
// ============================================

import { useState } from "react";
import { Outlet, NavLink, Link, useLocation, useNavigate } from "react-router";
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
  Globe,
} from "lucide-react";
import { useAuthStore } from "@/store";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";
import { ThemeToggle } from "@/components/ui";
import { DashboardSwitch } from "@/components/ui/DashboardSwitch";
import { useStudentStore } from "@/store/studentStore";

import LogoBlack from "@/assets/logo/Logo Black Coloured.png";
import LogoWhite from "@/assets/logo/Logo White Coloured.png";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/admin/members", label: "Members", icon: UserCircle },
  { path: "/admin/events", label: "Events", icon: Calendar },
  { path: "/admin/projects", label: "Projects", icon: FolderKanban },
  { path: "/admin/blog", label: "Blog Posts", icon: FileText },
  { path: "/admin/team", label: "Committee & Team", icon: Users },
  { path: "/admin/contacts", label: "Contact Messages", icon: Mail },
  { path: "/admin/notifications", label: "Notifications", icon: Bell },
  { path: "/admin/newsletter", label: "Newsletter", icon: Newspaper },
  { path: "/admin/quizzes", label: "Quizzes", icon: BrainCircuit },
  { path: "/admin/settings", label: "Settings", icon: Settings },
];

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user: adminUser, logout } = useAuthStore();
  const {
    student,
    isAuthenticated: studentAuthenticated,
    logout: studentLogout,
  } = useStudentStore();
  const isStudentAdmin = studentAuthenticated && student?.role === "admin";
  const user = isStudentAdmin ? student : adminUser;
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currentSection =
    navItems.find((item) => (item.end ? pathname === item.path : pathname.startsWith(item.path)))
      ?.label || "Dashboard";

  const handleLogout = async () => {
    if (studentAuthenticated) studentLogout();
    await logout();
    navigate(isStudentAdmin ? "/login" : "/admin/login");
  };

  return (
    <div className="admin-workspace flex min-h-screen overflow-x-clip" data-theme={resolvedTheme}>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 hidden h-full flex-col border-r border-[var(--admin-border)] bg-[var(--admin-surface)] transition-all duration-300 lg:flex",
          sidebarOpen ? "w-64" : "w-20",
        )}
      >
        <div
          className={cn(
            "flex h-20 shrink-0 items-center gap-3 border-b border-[var(--admin-border)] px-4",
          )}
        >
          <img
            src={isDark ? LogoWhite : LogoBlack}
            alt="ComES Logo"
            className="h-11 w-12 shrink-0 object-contain"
          />
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-w-0 text-[var(--admin-text)]"
            >
              <span className="block text-lg font-semibold">ComES</span>
              <span className="block text-xs text-[var(--admin-muted)]">Administration</span>
            </motion.span>
          )}
        </div>

        {/* Navigation */}
        <nav aria-label="Admin navigation" className="flex-1 overflow-y-auto py-5">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  title={!sidebarOpen ? item.label : undefined}
                  aria-label={item.label}
                  className={({ isActive }) =>
                    cn(
                      "flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-[13px] transition-colors",
                      sidebarOpen ? "justify-start" : "justify-center",
                      isActive
                        ? "bg-[var(--admin-tint)] text-[var(--admin-accent)]"
                        : "text-[var(--admin-muted)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text)]",
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
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          className={cn(
            "absolute top-24 -right-3 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-muted)]",
          )}
        >
          <ChevronRight
            className={cn("h-3 w-3 transition-transform", sidebarOpen && "rotate-180")}
          />
        </button>

        {/* User Info */}
        <div className="border-t border-[var(--admin-border)] p-4">
          <div className={cn("flex items-center gap-3", !sidebarOpen && "justify-center")}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--admin-tint)] text-sm font-semibold text-[var(--admin-accent)]">
              {user?.name?.charAt(0) || "A"}
            </div>
            {sidebarOpen && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--admin-text)]">
                  {user?.name || "Admin"}
                </p>
                <p className="truncate text-xs text-[var(--admin-muted)]">
                  {user?.email || "admin@comes.lk"}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            aria-label="Logout"
            title="Logout"
            className={cn(
              "mt-3 flex min-h-9 w-full items-center justify-center gap-2 rounded-md text-sm text-[var(--admin-muted)] transition-colors hover:bg-[var(--admin-hover)]",
            )}
          >
            <LogOut className="h-4 w-4" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div
        className={cn(
          "fixed top-0 right-0 left-0 z-40 flex h-16 items-center justify-between border-b border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 lg:hidden",
        )}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open admin navigation"
            aria-expanded={mobileMenuOpen}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              isDark ? "hover:bg-slate-800" : "hover:bg-gray-100",
            )}
          >
            <Menu className={cn("h-6 w-6", isDark ? "text-white" : "text-gray-900")} />
          </button>
          <span className={cn("font-bold", isDark ? "text-white" : "text-gray-900")}>
            ComES <span className="font-normal text-[var(--admin-muted)]">Admin</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/" aria-label="View website" title="View website" className="admin-icon-button">
            <Globe className="h-4 w-4" />
          </Link>
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
                "fixed top-0 left-0 z-50 flex h-full w-72 max-w-[85vw] flex-col bg-[var(--admin-surface)] lg:hidden",
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
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close admin navigation"
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                >
                  <X className={cn("h-6 w-6", isDark ? "text-gray-400" : "text-gray-600")} />
                </button>
              </div>
              <nav aria-label="Admin navigation" className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        end={item.end}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                            isActive
                              ? "bg-[var(--admin-tint)] text-[var(--admin-accent)]"
                              : "text-[var(--admin-muted)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text)]",
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
          "min-h-screen min-w-0 flex-1 transition-all duration-300",
          "pt-16 lg:pt-0",
          sidebarOpen ? "lg:ml-64" : "lg:ml-20",
        )}
      >
        <header className="hidden h-20 items-center justify-between border-b border-[var(--admin-border)] bg-[var(--admin-surface)] px-8 lg:flex">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-[var(--admin-muted)]">Workspace</span>
            <ChevronRight className="h-3 w-3 text-[var(--admin-muted)]" />
            <span className="font-medium">{currentSection}</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-[var(--admin-muted)] hover:bg-[var(--admin-hover)]"
            >
              <Globe className="h-4 w-4" />
              View website
            </Link>
          </div>
        </header>
        <div className="mx-auto max-w-[1600px] min-w-0 px-4 py-6 sm:px-6 lg:p-8">
          <DashboardSwitch />
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
