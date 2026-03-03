// ============================================
// ComES Website - Cookie Consent Banner
// ============================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Shield, BarChart3, ChevronDown, ChevronUp } from "lucide-react";
import { useCookieStore } from "@/store/cookieStore";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";

export const CookieConsent = () => {
  const [showDetails, setShowDetails] = useState(false);
  const { consent, showBanner, setConsent } = useCookieStore();
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  // Don't show if user has already made a choice
  if (consent !== null || !showBanner) return null;

  const handleAcceptAll = () => {
    setConsent("all");
  };

  const handleAcceptNecessary = () => {
    setConsent("necessary");
  };

  const handleReject = () => {
    setConsent("rejected");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.2 }}
        className={cn(
          "fixed right-0 bottom-0 left-0 z-[100] p-4 md:p-6",
          isDark ? "bg-slate-900/95" : "bg-white/95",
          "border-t backdrop-blur-lg",
          isDark ? "border-slate-800" : "border-gray-200",
          "shadow-2xl",
        )}
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-8">
            {/* Icon and Text */}
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex-shrink-0 rounded-xl p-3",
                    isDark ? "bg-blue-500/20" : "bg-blue-100",
                  )}
                >
                  <Cookie className={cn("h-6 w-6", isDark ? "text-blue-400" : "text-blue-600")} />
                </div>
                <div>
                  <h3
                    className={cn(
                      "mb-2 text-lg font-semibold",
                      isDark ? "text-white" : "text-gray-900",
                    )}
                  >
                    We value your privacy
                  </h3>
                  <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                    We use cookies to enhance your browsing experience, analyze site traffic, and
                    understand where our visitors come from. By clicking "Accept All", you consent
                    to our use of cookies.
                  </p>

                  {/* Show Details Toggle */}
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className={cn(
                      "mt-3 flex items-center gap-1 text-sm font-medium transition-colors",
                      isDark
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-blue-600 hover:text-blue-700",
                    )}
                  >
                    {showDetails ? "Hide details" : "Show details"}
                    {showDetails ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Cookie Details */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      className={cn(
                        "mt-4 space-y-4 rounded-xl p-4",
                        isDark ? "bg-slate-800/50" : "bg-gray-50",
                      )}
                    >
                      {/* Necessary Cookies */}
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "flex-shrink-0 rounded-lg p-2",
                            isDark ? "bg-green-500/20" : "bg-green-100",
                          )}
                        >
                          <Shield
                            className={cn("h-4 w-4", isDark ? "text-green-400" : "text-green-600")}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4
                              className={cn(
                                "text-sm font-semibold",
                                isDark ? "text-white" : "text-gray-900",
                              )}
                            >
                              Necessary Cookies
                            </h4>
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-xs",
                                isDark
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-green-100 text-green-700",
                              )}
                            >
                              Always active
                            </span>
                          </div>
                          <p
                            className={cn(
                              "mt-1 text-xs",
                              isDark ? "text-gray-500" : "text-gray-500",
                            )}
                          >
                            Essential for the website to function properly. These cannot be
                            disabled.
                          </p>
                        </div>
                      </div>

                      {/* Analytics Cookies */}
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "flex-shrink-0 rounded-lg p-2",
                            isDark ? "bg-purple-500/20" : "bg-purple-100",
                          )}
                        >
                          <BarChart3
                            className={cn(
                              "h-4 w-4",
                              isDark ? "text-purple-400" : "text-purple-600",
                            )}
                          />
                        </div>
                        <div>
                          <h4
                            className={cn(
                              "text-sm font-semibold",
                              isDark ? "text-white" : "text-gray-900",
                            )}
                          >
                            Analytics Cookies
                          </h4>
                          <p
                            className={cn(
                              "mt-1 text-xs",
                              isDark ? "text-gray-500" : "text-gray-500",
                            )}
                          >
                            Help us understand how visitors interact with our website by collecting
                            anonymous information like pages visited, time spent, and referral
                            sources.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 sm:flex-row lg:min-w-[200px] lg:flex-col">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAcceptAll}
                className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-600 hover:to-cyan-600"
              >
                Accept All
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAcceptNecessary}
                className={cn(
                  "rounded-xl px-6 py-3 text-sm font-semibold transition-all",
                  isDark
                    ? "bg-slate-800 text-white hover:bg-slate-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200",
                )}
              >
                Necessary Only
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReject}
                className={cn(
                  "rounded-xl px-6 py-3 text-sm font-semibold transition-all",
                  isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700",
                )}
              >
                Reject All
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsent;
