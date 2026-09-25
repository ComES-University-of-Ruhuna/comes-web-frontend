// ============================================
// ComES Website - Navbar Component
// ============================================

import { useState, useEffect, useId, useRef } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, ChevronDown } from "lucide-react";
import { NAV_LINKS } from "@/constants";
import { useClickOutside } from "@/hooks";
import { cn } from "@/utils";
import { ThemeToggle, UserProfileDropdown, NotificationsDropdown } from "@/components/ui";
import { useThemeStore, useStudentStore, useAuthStore } from "@/store";
import type { NavLink } from "@/types";

import LogoBlack from "@/assets/logo/Logo Black Coloured.png";
import LogoWhite from "@/assets/logo/Logo White Coloured.png";

// NavItem component for desktop navigation with dropdown support
interface NavItemProps {
  link: NavLink;
  index: number;
  isScrolled: boolean;
  isDark: boolean;
  isActive: (path: string) => boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const NavItem = ({
  link,
  index,
  isScrolled,
  isDark,
  isActive,
  isOpen: isDropdownOpen,
  onOpenChange: setIsDropdownOpen,
}: NavItemProps) => {
  const dropdownRef = useClickOutside<HTMLDivElement>(() => {
    if (isDropdownOpen) setIsDropdownOpen(false);
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

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
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setIsDropdownOpen(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            setIsDropdownOpen(false);
            triggerRef.current?.focus();
          }
        }}
      >
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-expanded={isDropdownOpen}
          aria-controls={menuId}
          data-active={isChildActive || undefined}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setIsDropdownOpen(true);
              requestAnimationFrame(() => dropdownRef.current?.querySelector("a")?.focus());
            }
          }}
          className={cn(
            "site-nav-link relative flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
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
              id={menuId}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "site-nav-menu absolute top-full left-0 z-50 mt-2 w-64 overflow-hidden rounded-lg border shadow-lg",
                isDark ? "border border-slate-800 bg-slate-900" : "border border-gray-200 bg-white",
              )}
            >
              <div className="py-2">
                {link.children?.map((child) => (
                  <Link
                    key={child.path}
                    to={child.path}
                    onClick={() => setIsDropdownOpen(false)}
                    aria-current={isActive(child.path) ? "page" : undefined}
                    className={cn(
                      "site-subnav-link block px-4 py-3 text-sm font-medium transition-all duration-200",
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
        aria-current={isActive(link.path) ? "page" : undefined}
        className={cn(
          "site-nav-link relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
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
  const hasChildren = link.children && link.children.length > 0;
  const isChildActive = hasChildren && link.children?.some((child) => isActive(child.path));
  const [isExpanded, setIsExpanded] = useState(Boolean(isChildActive));
  const menuId = useId();

  if (hasChildren) {
    return (
      <motion.div
        className="site-mobile-entry"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls={menuId}
          data-active={isChildActive || undefined}
          className={cn(
            "site-mobile-link flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
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
              id={menuId}
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
                    aria-current={isActive(child.path) ? "page" : undefined}
                    className={cn(
                      "site-subnav-link block rounded-md px-3 py-3 text-sm font-medium transition-all duration-200",
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
      className="site-mobile-entry"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={link.path}
        aria-current={isActive(link.path) ? "page" : undefined}
        className={cn(
          "site-mobile-link block rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
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
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const isScrolled = true;
  const location = useLocation();
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";
  const mobileMenuRef = useClickOutside<HTMLElement>(() => setIsMobileMenuOpen(false));

  // Check if user is authenticated
  const { isAuthenticated: isStudentAuth } = useStudentStore();
  const { isAuthenticated: isAdminAuth } = useAuthStore();
  const isAuthenticated = isStudentAuth || isAdminAuth;

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenGroup(null);
  }, [location.pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  // Determine appropriate logo
  const logoSrc = isDark ? LogoWhite : LogoBlack;

  return (
    <motion.header
      ref={mobileMenuRef}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="site-navigation fixed top-0 right-0 left-0 z-50 border-b"
      onKeyDown={(event) => {
        if (event.key === "Escape" && isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
          mobileTriggerRef.current?.focus();
        }
      }}
    >
      <nav aria-label="Main navigation" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 md:h-20 xl:gap-6">
          {/* Logo */}
          <Link to="/" aria-label="ComES home" className="group flex shrink-0 items-center">
            <motion.img
              src={logoSrc}
              alt="ComES Logo"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="h-12 w-12 object-contain sm:h-14 sm:w-14"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden flex-1 items-center justify-center gap-1 xl:flex">
            {NAV_LINKS.map((link, index) => (
              <NavItem
                key={link.path}
                link={link}
                index={index}
                isScrolled={isScrolled}
                isDark={isDark}
                isActive={isActive}
                isOpen={openGroup === link.path}
                onOpenChange={(open) => setOpenGroup(open ? link.path : null)}
              />
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden shrink-0 items-center gap-2 border-l border-[var(--site-border)] pl-4 xl:flex">
            {/* Theme Toggle - only show if not authenticated */}
            {!isAuthenticated && <ThemeToggle />}

            {/* Notifications - only show if authenticated */}
            {isAuthenticated && <NotificationsDropdown isScrolled={isScrolled} />}

            {/* User Profile Dropdown or CTA Button */}
            {isAuthenticated ? (
              <UserProfileDropdown isScrolled={isScrolled} />
            ) : (
              <>
                <Link to="/login" className="site-nav-link px-3 py-2 font-medium whitespace-nowrap">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className={cn(
                    "site-button site-button--primary flex items-center gap-2 px-4 py-2 text-sm font-semibold whitespace-nowrap",
                  )}
                >
                  Join ComES
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex shrink-0 items-center gap-1 xl:hidden">
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
              ref={mobileTriggerRef}
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
              aria-expanded={isMobileMenuOpen}
              aria-controls="public-mobile-menu"
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
              className="fixed inset-0 top-16 bg-black/60 backdrop-blur-sm md:top-20 xl:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              id="public-mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className={cn(
                "site-nav-menu fixed top-16 right-0 h-[calc(100dvh-4rem)] w-80 max-w-[calc(100vw-2rem)] overflow-y-auto shadow-xl md:top-20 md:h-[calc(100dvh-5rem)] xl:hidden",
                isDark ? "border-l border-slate-800 bg-slate-900" : "bg-white",
              )}
            >
              <nav aria-label="Mobile navigation" className="space-y-1 p-4">
                <p className="px-3 py-3 text-xs font-semibold text-[var(--site-muted)]">
                  NAVIGATION
                </p>
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
                          "site-button site-button--outline mb-3 flex w-full items-center justify-center gap-2 px-6 py-3 font-semibold transition-all",
                          isDark
                            ? "bg-slate-800 text-white hover:bg-slate-700"
                            : "bg-gray-100 text-gray-900 hover:bg-gray-200",
                        )}
                      >
                        Sign in
                      </Link>
                      <Link
                        to="/register"
                        className="site-button site-button--primary flex w-full items-center justify-center gap-2 px-6 py-3 font-semibold"
                      >
                        Join ComES
                      </Link>
                    </>
                  )}
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
