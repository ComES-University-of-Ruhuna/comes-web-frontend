// ============================================
// ComES Website - Navbar Component (Redesigned)
// ============================================

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ExternalLink } from "lucide-react";
import { NAV_LINKS } from "@/constants";
import { useScrollPosition, useClickOutside } from "@/hooks";
import { cn } from "@/utils";
import { UserProfileDropdown, NotificationsDropdown } from "@/components/ui";
import { useStudentStore, useAuthStore } from "@/store";
import type { NavLink } from "@/types";

// Circuit node SVG icon for logo
const CircuitIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="shrink-0">
    <circle cx="16" cy="16" r="4" fill="#0EA5E9" />
    <circle cx="16" cy="16" r="7" stroke="#0EA5E9" strokeWidth="1.5" opacity="0.5" />
    <line x1="16" y1="2" x2="16" y2="9" stroke="#0EA5E9" strokeWidth="1.5" opacity="0.4" />
    <line x1="16" y1="23" x2="16" y2="30" stroke="#0EA5E9" strokeWidth="1.5" opacity="0.4" />
    <line x1="2" y1="16" x2="9" y2="16" stroke="#0EA5E9" strokeWidth="1.5" opacity="0.4" />
    <line x1="23" y1="16" x2="30" y2="16" stroke="#0EA5E9" strokeWidth="1.5" opacity="0.4" />
    <circle cx="16" cy="4" r="2" fill="#0EA5E9" opacity="0.6" />
    <circle cx="16" cy="28" r="2" fill="#0EA5E9" opacity="0.6" />
    <circle cx="4" cy="16" r="2" fill="#0EA5E9" opacity="0.6" />
    <circle cx="28" cy="16" r="2" fill="#0EA5E9" opacity="0.6" />
  </svg>
);

// NavItem component for desktop navigation with dropdown support
interface NavItemProps {
  link: NavLink;
  index: number;
  isActive: (path: string) => boolean;
}

const NavItem = ({ link, index, isActive }: NavItemProps) => {
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
            "font-body relative flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
            isChildActive ? "text-accent-blue" : "text-text-secondary hover:text-text-primary",
          )}
        >
          <span className="relative z-10">{link.label}</span>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200",
              isDropdownOpen && "rotate-180",
            )}
          />
          {isChildActive && (
            <motion.div
              layoutId="nav-active"
              className="bg-accent-blue absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full"
              style={{ boxShadow: "0 0 8px rgba(14,165,233,0.6)" }}
            />
          )}
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 z-50 mt-2 w-60 overflow-hidden rounded-xl border border-[rgba(14,165,233,0.15)] bg-[#0D1E35]/95 shadow-xl shadow-black/30 backdrop-blur-xl"
            >
              <div className="py-1.5">
                {link.children?.map((child) => (
                  <Link
                    key={child.path}
                    to={child.path}
                    className={cn(
                      "font-body block px-4 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive(child.path)
                        ? "bg-accent-blue/10 text-accent-blue"
                        : "text-text-secondary hover:text-text-primary hover:bg-white/5",
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
          "font-body relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
          isActive(link.path) ? "text-accent-blue" : "text-text-secondary hover:text-text-primary",
        )}
      >
        <span className="relative z-10">{link.label}</span>
        {isActive(link.path) && (
          <motion.div
            layoutId="nav-active"
            className="bg-accent-blue absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full"
            style={{ boxShadow: "0 0 8px rgba(14,165,233,0.6)" }}
          />
        )}
      </Link>
    </motion.div>
  );
};

// MobileNavItem component
interface MobileNavItemProps {
  link: NavLink;
  index: number;
  isActive: (path: string) => boolean;
  onClose: () => void;
}

const MobileNavItem = ({ link, index, isActive, onClose }: MobileNavItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = link.children && link.children.length > 0;
  const isChildActive = hasChildren && link.children?.some((child) => isActive(child.path));

  if (hasChildren) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 + index * 0.08 }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "font-body flex w-full items-center justify-between rounded-xl px-4 py-3 text-lg font-medium transition-all duration-200",
            isChildActive ? "text-accent-blue" : "text-text-secondary hover:text-text-primary",
          )}
        >
          <span>{link.label}</span>
          <ChevronDown
            className={cn("h-5 w-5 transition-transform duration-200", isExpanded && "rotate-180")}
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
              <div className="ml-4 space-y-1 border-l border-[rgba(14,165,233,0.2)] pl-4">
                {link.children?.map((child) => (
                  <Link
                    key={child.path}
                    to={child.path}
                    onClick={onClose}
                    className={cn(
                      "font-body block rounded-lg px-4 py-2 text-base font-medium transition-all duration-200",
                      isActive(child.path)
                        ? "text-accent-blue"
                        : "text-text-muted hover:text-text-secondary",
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
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.08 }}
    >
      <Link
        to={link.path}
        onClick={onClose}
        className={cn(
          "font-body block rounded-xl px-4 py-3 text-lg font-medium transition-all duration-200",
          isActive(link.path) ? "text-accent-blue" : "text-text-secondary hover:text-text-primary",
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

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
        isScrolled
          ? "border-b border-[rgba(14,165,233,0.1)] bg-[#050A14]/80 shadow-lg shadow-black/20 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2.5">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <CircuitIcon />
            </motion.div>
            <div>
              <h1 className="font-display text-text-primary text-xl font-bold tracking-wider">
                ComES
              </h1>
              <p className="text-text-muted hidden text-[10px] font-medium tracking-wide sm:block">
                Computer Engineering Society
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link, index) => (
              <NavItem key={link.path} link={link} index={index} isActive={isActive} />
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 lg:flex">
            {/* Notifications - only show if authenticated */}
            {isAuthenticated && <NotificationsDropdown isScrolled={isScrolled} />}

            {/* User Profile Dropdown or CTA Buttons */}
            {isAuthenticated ? (
              <UserProfileDropdown isScrolled={isScrolled} />
            ) : (
              <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/login"
                    className="border-accent-blue/50 font-body text-accent-blue hover:border-accent-blue hover:bg-accent-blue/10 flex items-center gap-1.5 rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-200 hover:shadow-[0_0_20px_rgba(14,165,233,0.15)]"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Student Portal
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/register"
                    className="font-body flex items-center gap-1.5 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-all duration-200 hover:shadow-sky-500/30"
                  >
                    Join Us
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            {isAuthenticated && (
              <>
                <NotificationsDropdown isScrolled={isScrolled} />
                <UserProfileDropdown isScrolled={isScrolled} />
              </>
            )}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-text-secondary hover:text-text-primary rounded-xl p-2 transition-colors hover:bg-white/5"
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

      {/* Mobile Menu — Full Screen Slide-in */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-16 bg-black/70 backdrop-blur-sm md:top-20 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-full overflow-y-auto border-l border-[rgba(14,165,233,0.1)] bg-[#050A14]/98 backdrop-blur-xl sm:w-80 md:top-20 md:h-[calc(100vh-5rem)] lg:hidden"
            >
              <div className="space-y-1 p-6">
                {NAV_LINKS.map((link, index) => (
                  <MobileNavItem
                    key={link.path}
                    link={link}
                    index={index}
                    isActive={isActive}
                    onClose={() => setIsMobileMenuOpen(false)}
                  />
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 space-y-3 border-t border-[rgba(14,165,233,0.1)] pt-6"
                >
                  {isAuthenticated ? (
                    <UserProfileDropdown variant="mobile" />
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="border-accent-blue/50 font-body text-accent-blue hover:bg-accent-blue/10 flex w-full items-center justify-center gap-2 rounded-full border px-6 py-3 font-semibold transition-all"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Student Portal
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="font-body flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition-all"
                      >
                        Join Us
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
