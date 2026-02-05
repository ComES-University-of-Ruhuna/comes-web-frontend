// ============================================
// ComES Website - Admin Layout
// ============================================

import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
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
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';
import { ThemeToggle } from '@/components/ui';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/admin/members', label: 'Members', icon: UserCircle },
  { path: '/admin/events', label: 'Events', icon: Calendar },
  { path: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { path: '/admin/blog', label: 'Blog Posts', icon: FileText },
  { path: '/admin/team', label: 'Team Members', icon: Users },
  { path: '/admin/contacts', label: 'Contact Messages', icon: Mail },
  { path: '/admin/newsletter', label: 'Newsletter', icon: Newspaper },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className={cn(
      'min-h-screen flex',
      isDark ? 'bg-slate-950' : 'bg-gray-100'
    )}>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col fixed left-0 top-0 h-full z-40 transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-20',
          isDark ? 'bg-slate-900 border-r border-slate-800' : 'bg-white border-r border-gray-200'
        )}
      >
        {/* Logo */}
        <div className={cn(
          'h-16 flex items-center gap-3 px-4 border-b',
          isDark ? 'border-slate-800' : 'border-gray-200'
        )}>
          <div className="flex items-center justify-center w-10 h-10 font-bold text-white rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
            CE
          </div>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn('font-bold text-lg', isDark ? 'text-white' : 'text-gray-900')}
            >
              Admin Panel
            </motion.span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="px-3 space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
                      sidebarOpen ? 'justify-start' : 'justify-center',
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                        : isDark
                          ? 'text-gray-400 hover:text-white hover:bg-slate-800'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    )
                  }
                >
                  <item.icon className="flex-shrink-0 w-5 h-5" />
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
            'absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center shadow-lg',
            isDark ? 'bg-slate-800 text-gray-400' : 'bg-white text-gray-600 border border-gray-200'
          )}
        >
          <ChevronRight className={cn('w-4 h-4 transition-transform', !sidebarOpen && 'rotate-180')} />
        </button>

        {/* User Info */}
        <div className={cn(
          'p-4 border-t',
          isDark ? 'border-slate-800' : 'border-gray-200'
        )}>
          <div className={cn(
            'flex items-center gap-3',
            !sidebarOpen && 'justify-center'
          )}>
            <div className="flex items-center justify-center w-10 h-10 font-bold text-white rounded-full bg-gradient-to-br from-blue-500 to-cyan-500">
              {user?.name?.charAt(0) || 'A'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className={cn('font-medium truncate', isDark ? 'text-white' : 'text-gray-900')}>
                  {user?.name || 'Admin'}
                </p>
                <p className={cn('text-sm truncate', isDark ? 'text-gray-500' : 'text-gray-500')}>
                  {user?.email || 'admin@comes.lk'}
                </p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={handleLogout}
              className={cn(
                'mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-colors',
                isDark
                  ? 'bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700'
                  : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              )}
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <div className={cn(
        'lg:hidden fixed top-0 left-0 right-0 h-16 z-40 flex items-center justify-between px-4',
        isDark ? 'bg-slate-900 border-b border-slate-800' : 'bg-white border-b border-gray-200'
      )}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className={cn('p-2 rounded-lg', isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100')}
          >
            <Menu className={cn('w-6 h-6', isDark ? 'text-white' : 'text-gray-900')} />
          </button>
          <span className={cn('font-bold', isDark ? 'text-white' : 'text-gray-900')}>Admin Panel</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button className={cn('p-2 rounded-lg relative', isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100')}>
            <Bell className={cn('w-5 h-5', isDark ? 'text-gray-400' : 'text-gray-600')} />
            <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1" />
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
              className="fixed inset-0 z-40 lg:hidden bg-black/50"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className={cn(
                'lg:hidden fixed left-0 top-0 h-full w-72 z-50 flex flex-col',
                isDark ? 'bg-slate-900' : 'bg-white'
              )}
            >
              <div className={cn(
                'h-16 flex items-center justify-between px-4 border-b',
                isDark ? 'border-slate-800' : 'border-gray-200'
              )}>
                <span className={cn('font-bold text-lg', isDark ? 'text-white' : 'text-gray-900')}>
                  Admin Panel
                </span>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className={cn('w-6 h-6', isDark ? 'text-gray-400' : 'text-gray-600')} />
                </button>
              </div>
              <nav className="flex-1 py-4 overflow-y-auto">
                <ul className="px-3 space-y-1">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        end={item.end}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
                            isActive
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                              : isDark
                                ? 'text-gray-400 hover:text-white hover:bg-slate-800'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          )
                        }
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className={cn('p-4 border-t', isDark ? 'border-slate-800' : 'border-gray-200')}>
                <button
                  onClick={handleLogout}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-colors',
                    isDark
                      ? 'bg-slate-800 text-gray-400 hover:text-white'
                      : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                  )}
                >
                  <LogOut className="w-4 h-4" />
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
          'flex-1 min-h-screen transition-all duration-300',
          'pt-16 lg:pt-0',
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
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
