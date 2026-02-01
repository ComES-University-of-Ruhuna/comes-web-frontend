// ============================================
// ComES Website - Navbar Component
// ============================================

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import { NAV_LINKS } from '@/constants';
import { useScrollPosition, useClickOutside } from '@/hooks';
import { cn } from '@/utils';
import { ThemeToggle, UserProfileDropdown, NotificationsDropdown } from '@/components/ui';
import { useThemeStore, useStudentStore, useAuthStore } from '@/store';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isScrolled } = useScrollPosition();
  const location = useLocation();
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';
  const mobileMenuRef = useClickOutside<HTMLDivElement>(() =>
    setIsMobileMenuOpen(false)
  );

  // Check if user is authenticated
  const { isAuthenticated: isStudentAuth } = useStudentStore();
  const { isAuthenticated: isAdminAuth } = useAuthStore();
  const isAuthenticated = isStudentAuth || isAdminAuth;

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const isActive = (path: string) => location.pathname === path;

  // Dynamic styles based on scroll and theme
  const getNavStyles = () => {
    if (isScrolled) {
      return isDark 
        ? 'bg-slate-900/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-slate-800'
        : 'bg-white/95 backdrop-blur-md shadow-lg';
    }
    return isDark ? 'bg-slate-950' : 'bg-comesBlue';
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        getNavStyles()
      )}
    >
      <nav className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 relative overflow-hidden',
                isScrolled
                  ? isDark 
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white' 
                    : 'bg-comesBlue text-white'
                  : 'bg-white text-comesBlue'
              )}
            >
              <span className="relative z-10">CE</span>
              <div className="absolute inset-0 transition-opacity opacity-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent group-hover:opacity-100" />
            </motion.div>
            <div className="hidden sm:block">
              <h1
                className={cn(
                  'font-bold text-xl font-comes tracking-wide transition-colors',
                  isScrolled 
                    ? isDark ? 'text-white' : 'text-comesBlue' 
                    : 'text-white'
                )}
              >
                ComES
              </h1>
              <p
                className={cn(
                  'text-xs transition-colors',
                  isScrolled 
                    ? isDark ? 'text-gray-400' : 'text-gray-600' 
                    : 'text-blue-100'
                )}
              >
                Computer Engineering Society
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="items-center hidden gap-1 lg:flex">
            {NAV_LINKS.map((link, index) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={link.path}
                  className={cn(
                    'relative px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2',
                    isActive(link.path)
                      ? isScrolled
                        ? isDark 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'bg-comesBlue text-white'
                        : 'bg-white/20 text-white'
                      : isScrolled
                        ? isDark 
                          ? 'text-gray-300 hover:bg-slate-800 hover:text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                  )}
                >
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="nav-indicator"
                      className={cn(
                        'absolute inset-0 rounded-xl',
                        isScrolled
                          ? isDark 
                            ? 'bg-blue-500/20' 
                            : 'bg-comesBlue'
                          : 'bg-white/20'
                      )}
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="items-center hidden gap-3 lg:flex">
            {/* Theme Toggle - only show if not authenticated */}
            {!isAuthenticated && (
              <ThemeToggle 
                className={cn(
                  isScrolled 
                    ? '' 
                    : 'text-white hover:bg-white/10'
                )} 
              />
            )}

            {/* Notifications - only show if authenticated */}
            {isAuthenticated && (
              <NotificationsDropdown isScrolled={isScrolled} />
            )}

            {/* User Profile Dropdown or CTA Button */}
            {isAuthenticated ? (
              <UserProfileDropdown isScrolled={isScrolled} />
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className={cn(
                    'px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 flex items-center gap-2',
                    'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 hover:from-amber-300 hover:to-yellow-400',
                    'shadow-lg shadow-amber-500/25'
                  )}
                >
                  <Sparkles className="w-4 h-4" />
                  Join Us
                </Link>
                
              </motion.div>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            {!isAuthenticated && (
              <ThemeToggle 
                className={cn(
                  isScrolled 
                    ? '' 
                    : 'text-white hover:bg-white/10'
                )} 
              />
            )}
            {isAuthenticated && (
              <>
                <NotificationsDropdown isScrolled={isScrolled} />
                <UserProfileDropdown isScrolled={isScrolled} />
              </>
            )}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'p-2 rounded-xl transition-colors',
                isScrolled
                  ? isDark 
                    ? 'text-white hover:bg-slate-800' 
                    : 'text-comesBlue hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              )}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 lg:hidden top-16 md:top-20 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className={cn(
                'lg:hidden fixed right-0 top-16 md:top-20 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] w-80 shadow-2xl overflow-y-auto',
                isDark 
                  ? 'bg-slate-900 border-l border-slate-800' 
                  : 'bg-white'
              )}
            >
              <div className="p-6 space-y-2">
                {NAV_LINKS.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      className={cn(
                        'block px-4 py-3 rounded-xl font-medium transition-all duration-200',
                        isActive(link.path)
                          ? isDark 
                            ? 'bg-blue-500/20 text-blue-400' 
                            : 'bg-comesBlue text-white'
                          : isDark 
                            ? 'text-gray-300 hover:bg-slate-800' 
                            : 'text-gray-700 hover:bg-gray-100'
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={cn(
                    'pt-4 border-t mt-4',
                    isDark ? 'border-slate-800' : 'border-gray-200'
                  )}
                >
                  {isAuthenticated ? (
                    <UserProfileDropdown variant="mobile" />
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className={cn(
                          'flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full font-semibold mb-3 transition-all',
                          isDark 
                            ? 'bg-slate-800 text-white hover:bg-slate-700' 
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        )}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="flex items-center justify-center w-full gap-2 px-6 py-3 font-semibold text-white transition-all rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
