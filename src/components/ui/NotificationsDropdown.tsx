// ============================================
// ComES Website - Notifications Dropdown Component
// ============================================

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Trash2,
  Calendar,
  Megaphone,
  Clock,
  Settings,
  ChevronRight,
} from "lucide-react";
import { useNotificationStore, type Notification } from "@/store/notificationStore";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";

interface NotificationsDropdownProps {
  isScrolled?: boolean;
  className?: string;
}

// Format relative time
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
};

// Get icon for notification type
const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "event":
      return Calendar;
    case "announcement":
      return Megaphone;
    case "reminder":
      return Clock;
    case "system":
    default:
      return Settings;
  }
};

// Get color for notification type
const getNotificationColor = (type: Notification["type"], isDark: boolean) => {
  switch (type) {
    case "event":
      return isDark ? "text-blue-400 bg-blue-500/20" : "text-blue-600 bg-blue-100";
    case "announcement":
      return isDark ? "text-amber-400 bg-amber-500/20" : "text-amber-600 bg-amber-100";
    case "reminder":
      return isDark ? "text-purple-400 bg-purple-500/20" : "text-purple-600 bg-purple-100";
    case "system":
    default:
      return isDark ? "text-gray-400 bg-gray-500/20" : "text-gray-600 bg-gray-100";
  }
};

export const NotificationsDropdown = ({
  isScrolled = false,
  className,
}: NotificationsDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } =
    useNotificationStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      {/* Notification Bell Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative rounded-xl p-2 transition-colors",
          isScrolled
            ? isDark
              ? "text-gray-300 hover:bg-slate-800 hover:text-white"
              : "text-gray-700 hover:bg-gray-100"
            : "text-white/90 hover:bg-white/10 hover:text-white",
        )}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
      >
        <Bell className="h-5 w-5" />

        {/* Unread Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl shadow-2xl sm:w-96",
              isDark ? "border border-slate-800 bg-slate-900" : "border border-gray-200 bg-white",
            )}
          >
            {/* Header */}
            <div
              className={cn(
                "flex items-center justify-between border-b px-4 py-3",
                isDark ? "border-slate-800" : "border-gray-100",
              )}
            >
              <div className="flex items-center gap-2">
                <Bell className={cn("h-5 w-5", isDark ? "text-blue-400" : "text-blue-600")} />
                <h3 className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600",
                    )}
                  >
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className={cn(
                      "rounded-lg p-1.5 transition-colors",
                      isDark
                        ? "text-gray-400 hover:bg-slate-800 hover:text-white"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
                    )}
                    title="Mark all as read"
                  >
                    <CheckCheck className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "rounded-lg p-1.5 transition-colors",
                    isDark
                      ? "text-gray-400 hover:bg-slate-800 hover:text-white"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
                  )}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div
                  className={cn(
                    "flex flex-col items-center justify-center px-4 py-12",
                    isDark ? "text-gray-400" : "text-gray-500",
                  )}
                >
                  <Bell className="mb-3 h-12 w-12 opacity-30" />
                  <p className="text-sm font-medium">No notifications</p>
                  <p className="mt-1 text-xs opacity-70">You're all caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800/50">
                  {notifications.map((notification, index) => {
                    const Icon = getNotificationIcon(notification.type);
                    const colorClass = getNotificationColor(notification.type, isDark);

                    const content = (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className={cn(
                          "group relative flex gap-3 p-4 transition-colors",
                          !notification.read && (isDark ? "bg-slate-800/30" : "bg-blue-50/50"),
                          notification.link
                            ? isDark
                              ? "cursor-pointer hover:bg-slate-800"
                              : "cursor-pointer hover:bg-gray-50"
                            : "",
                        )}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        {/* Icon */}
                        <div
                          className={cn(
                            "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl",
                            colorClass,
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={cn(
                                "truncate text-sm font-medium",
                                isDark ? "text-white" : "text-gray-900",
                              )}
                            >
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                            )}
                          </div>
                          <p
                            className={cn(
                              "mt-0.5 line-clamp-2 text-sm",
                              isDark ? "text-gray-400" : "text-gray-600",
                            )}
                          >
                            {notification.message}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <span
                              className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}
                            >
                              {formatRelativeTime(notification.timestamp)}
                            </span>
                            {notification.link && (
                              <ChevronRight
                                className={cn(
                                  "h-3 w-3",
                                  isDark ? "text-gray-600" : "text-gray-400",
                                )}
                              />
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-shrink-0 flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className={cn(
                                "rounded p-1 transition-colors",
                                isDark
                                  ? "text-gray-400 hover:bg-slate-700 hover:text-white"
                                  : "text-gray-500 hover:bg-gray-200 hover:text-gray-700",
                              )}
                              title="Mark as read"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className={cn(
                              "rounded p-1 transition-colors",
                              isDark
                                ? "text-gray-400 hover:bg-red-500/20 hover:text-red-400"
                                : "text-gray-500 hover:bg-red-100 hover:text-red-600",
                            )}
                            title="Remove"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    );

                    if (notification.link) {
                      return (
                        <Link
                          key={notification.id}
                          to={notification.link}
                          onClick={() => setIsOpen(false)}
                        >
                          {content}
                        </Link>
                      );
                    }

                    return <div key={notification.id}>{content}</div>;
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div
                className={cn(
                  "flex items-center justify-between border-t px-4 py-3",
                  isDark ? "border-slate-800" : "border-gray-100",
                )}
              >
                <button
                  onClick={clearAll}
                  className={cn(
                    "text-xs font-medium transition-colors",
                    isDark
                      ? "text-gray-400 hover:text-red-400"
                      : "text-gray-500 hover:text-red-600",
                  )}
                >
                  Clear all
                </button>
                <Link
                  to="/student/settings"
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium transition-colors",
                    isDark
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-blue-600 hover:text-blue-700",
                  )}
                >
                  Notification settings
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsDropdown;
