// ============================================
// ComES Website - Navbar Component
// ============================================

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, ChevronDown } from "lucide-react";
import { NAV_LINKS } from "@/constants";
import { useScrollPosition, useClickOutside } from "@/hooks";
import { cn } from "@/utils";
import { ThemeToggle, UserProfileDropdown, NotificationsDropdown } from "@/components/ui";
import { useThemeStore, useStudentStore, useAuthStore } from "@/store";
import type { NavLink } from "@/types";

// NavItem component for desktop navigation with dropdown support
interface NavItemProps {
  link: NavLink;
  index: number;
  isScrolled: boolean;
  isDark: boolean;
  isActive: (path: string) => boolean;
}

const NavItem = ({ link, index, isScrolled, isDark, isActive }: NavItemProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(() => setIsDropdownOpen(false));

  const hasChildren = link.children && link.children.length > 0;
  const isChildActive = hasChildren && link.children?.some((child) => isActive(child.path));

  if (hasChildren) {
    return (
      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="relative"
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={cn(
            "relative flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
            isChildActive
              ? isScrolled
                ? isDark
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-comesBlue text-white"
                : "bg-white/20 text-white"
              : isScrolled
                ? isDark
                  ? "text-gray-300 hover:bg-slate-800 hover:text-white"
                  : "text-gray-700 hover:bg-gray-100"
                : "text-white/90 hover:bg-white/10 hover:text-white",
          )}
        >
          <span className="relative z-10">{link.label}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isDropdownOpen && "rotate-180",
            )}
          />
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "absolute top-full left-0 z-50 mt-2 w-64 overflow-hidden rounded-xl shadow-xl",
                isDark ? "border border-slate-800 bg-slate-900" : "border border-gray-200 bg-white",
              )}
            >
              <div className="py-2">
                {link.children?.map((child) => (
                  <Link
                    key={child.path}
                    to={child.path}
                    className={cn(
                      "block px-4 py-3 text-sm font-medium transition-all duration-200",
                      isActive(child.path)
                        ? isDark
                          ? "bg-blue-500/20 text-blue-400"
                          : "text-comesBlue bg-blue-50"
                        : isDark
                          ? "text-gray-300 hover:bg-slate-800 hover:text-white"
                          : "text-gray-700 hover:bg-gray-100",
                    )}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={link.path}
        className={cn(
          "relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
          isActive(link.path)
            ? isScrolled
              ? isDark
                ? "bg-blue-500/20 text-blue-400"
                : "bg-comesBlue text-white"
              : "bg-white/20 text-white"
            : isScrolled
              ? isDark
                ? "text-gray-300 hover:bg-slate-800 hover:text-white"
                : "text-gray-700 hover:bg-gray-100"
              : "text-white/90 hover:bg-white/10 hover:text-white",
        )}
      >
        {isActive(link.path) && (
          <motion.div
            layoutId="nav-indicator"
            className={cn(
              "absolute inset-0 rounded-xl",
              isScrolled ? (isDark ? "bg-blue-500/20" : "bg-comesBlue") : "bg-white/20",
            )}
            transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
          />
        )}
        <span className="relative z-10">{link.label}</span>
      </Link>
    </motion.div>
  );
};

// MobileNavItem component for mobile navigation with dropdown support
interface MobileNavItemProps {
  link: NavLink;
  index: number;
  isDark: boolean;
  isActive: (path: string) => boolean;
}

const MobileNavItem = ({ link, index, isDark, isActive }: MobileNavItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasChildren = link.children && link.children.length > 0;
  const isChildActive = hasChildren && link.children?.some((child) => isActive(child.path));

  if (hasChildren) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "flex w-full items-center justify-between rounded-xl px-4 py-3 font-medium transition-all duration-200",
            isChildActive
              ? isDark
                ? "bg-blue-500/20 text-blue-400"
                : "bg-comesBlue text-white"
              : isDark
                ? "text-gray-300 hover:bg-slate-800"
                : "text-gray-700 hover:bg-gray-100",
          )}
        >
          <span>{link.label}</span>
          <ChevronDown
            className={cn("h-4 w-4 transition-transform duration-200", isExpanded && "rotate-180")}
          />
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div
                className={cn(
                  "mt-1 ml-4 space-y-1 border-l-2 pl-4",
                  isDark ? "border-slate-700" : "border-gray-200",
                )}
              >
                {link.children?.map((child) => (
                  <Link
                    key={child.path}
                    to={child.path}
                    className={cn(
                      "block rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
                      isActive(child.path)
                        ? isDark
                          ? "bg-blue-500/20 text-blue-400"
                          : "text-comesBlue bg-blue-50"
                        : isDark
                          ? "text-gray-400 hover:bg-slate-800 hover:text-gray-200"
                          : "text-gray-600 hover:bg-gray-100",
                    )}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={link.path}
        className={cn(
          "block rounded-xl px-4 py-3 font-medium transition-all duration-200",
          isActive(link.path)
            ? isDark
              ? "bg-blue-500/20 text-blue-400"
              : "bg-comesBlue text-white"
            : isDark
              ? "text-gray-300 hover:bg-slate-800"
              : "text-gray-700 hover:bg-gray-100",
        )}
      >
        {link.label}
      </Link>
    </motion.div>
  );
};

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isScrolled } = useScrollPosition();
  const location = useLocation();
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";
  const mobileMenuRef = useClickOutside<HTMLDivElement>(() => setIsMobileMenuOpen(false));

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
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const isActive = (path: string) => location.pathname === path;

  // Dynamic styles based on scroll and theme
  const getNavStyles = () => {
    if (isScrolled) {
      return isDark
        ? "bg-slate-900/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-slate-800"
        : "bg-white/95 backdrop-blur-md shadow-lg";
    }
    return isDark ? "bg-slate-950" : "bg-comesBlue";
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("fixed top-0 right-0 left-0 z-50 transition-all duration-300", getNavStyles())}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl text-lg font-bold transition-all duration-300",
                isScrolled
                  ? isDark
                    ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
                    : "bg-comesBlue text-white"
                  : "text-comesBlue bg-white",
              )}
            >
              <span className="relative z-10">CE</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.div>
            <div className="hidden sm:block">
              <h1
                className={cn(
                  "font-comes text-xl font-bold tracking-wide transition-colors",
                  isScrolled ? (isDark ? "text-white" : "text-comesBlue") : "text-white",
                )}
              >
                ComES
              </h1>
              <p
                className={cn(
                  "text-xs transition-colors",
                  isScrolled ? (isDark ? "text-gray-400" : "text-gray-600") : "text-blue-100",
                )}
              >
                Computer Engineering Society
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link, index) => (
              <NavItem
                key={link.path}
                link={link}
                index={index}
                isScrolled={isScrolled}
                isDark={isDark}
                isActive={isActive}
              />
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 lg:flex">
            {/* Theme Toggle - only show if not authenticated */}
            {!isAuthenticated && (
              <ThemeToggle className={cn(isScrolled ? "" : "text-white hover:bg-white/10")} />
            )}

            {/* Notifications - only show if authenticated */}
            {isAuthenticated && <NotificationsDropdown isScrolled={isScrolled} />}

            {/* User Profile Dropdown or CTA Button */}
            {isAuthenticated ? (
              <UserProfileDropdown isScrolled={isScrolled} />
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className={cn(
                    "flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300",
                    "bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 hover:from-amber-300 hover:to-yellow-400",
                    "shadow-lg shadow-amber-500/25",
                  )}
                >
                  <Sparkles className="h-4 w-4" />
                  Join Us
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            {!isAuthenticated && (
              <ThemeToggle className={cn(isScrolled ? "" : "text-white hover:bg-white/10")} />
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
                "rounded-xl p-2 transition-colors",
                isScrolled
                  ? isDark
                    ? "text-white hover:bg-slate-800"
                    : "text-comesBlue hover:bg-gray-100"
                  : "text-white hover:bg-white/10",
              )}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
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
              className="fixed inset-0 top-16 bg-black/60 backdrop-blur-sm md:top-20 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className={cn(
                "fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 overflow-y-auto shadow-2xl md:top-20 md:h-[calc(100vh-5rem)] lg:hidden",
                isDark ? "border-l border-slate-800 bg-slate-900" : "bg-white",
              )}
            >
              <div className="space-y-2 p-6">
                {NAV_LINKS.map((link, index) => (
                  <MobileNavItem
                    key={link.path}
                    link={link}
                    index={index}
                    isDark={isDark}
                    isActive={isActive}
                  />
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={cn(
                    "mt-4 border-t pt-4",
                    isDark ? "border-slate-800" : "border-gray-200",
                  )}
                >
                  {isAuthenticated ? (
                    <UserProfileDropdown variant="mobile" />
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className={cn(
                          "mb-3 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold transition-all",
                          isDark
                            ? "bg-slate-800 text-white hover:bg-slate-700"
                            : "bg-gray-100 text-gray-900 hover:bg-gray-200",
                        )}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-blue-600 hover:to-cyan-600"
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
