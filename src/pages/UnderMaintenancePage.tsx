// ============================================
// ComES Website - Under Maintenance Page
// ============================================

import { motion } from "framer-motion";
import { ArrowLeft, Home, Wrench, Clock, Mail } from "lucide-react";
import { Button, PageTransition, FadeInView, HoverScale } from "@/components/ui";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";

export const UnderMaintenancePage = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <PageTransition>
      <div
        className={cn(
          "relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4",
          isDark ? "bg-slate-900" : "bg-gray-50",
        )}
      >
        {/* Animated background blobs */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], x: [0, 50, 0], y: [0, -30, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-20 left-1/4 h-64 w-64 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.5, 1, 1.5],
            x: [0, -50, 0],
            y: [0, 30, 0],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute right-1/4 bottom-20 h-72 w-72 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-500/20 blur-3xl"
        />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              "absolute h-2 w-2 rounded-full",
              isDark ? "bg-amber-400/40" : "bg-amber-500/30",
            )}
            style={{ top: `${20 + i * 12}%`, left: `${10 + i * 15}%` }}
            animate={{ y: [-20, 20, -20], x: [-10, 10, -10], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}

        <div className="relative z-10 mx-auto max-w-2xl text-center">
          {/* Icon */}
          <FadeInView>
            <div className="relative mb-8">
              <motion.div
                className={cn(
                  "flex items-center justify-center text-[120px] font-black select-none md:text-[160px]",
                  isDark ? "text-slate-800" : "text-gray-100",
                )}
              >
                🚧
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.3 }}
                  className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-2xl shadow-amber-500/40"
                >
                  <Wrench className="h-12 w-12 text-white" />
                </motion.div>
              </div>
            </div>
          </FadeInView>

          {/* Title */}
          <FadeInView delay={0.1}>
            <h1
              className={cn(
                "mb-4 text-4xl font-black md:text-5xl",
                isDark ? "text-white" : "text-comesBlue",
              )}
            >
              Under{" "}
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Maintenance
              </span>
            </h1>
          </FadeInView>

          {/* Subtitle */}
          <FadeInView delay={0.2}>
            <p
              className={cn(
                "mb-8 text-lg leading-relaxed md:text-xl",
                isDark ? "text-gray-400" : "text-gray-600",
              )}
            >
              We're working hard to bring you something amazing. This page is currently under
              development and will be available soon.
            </p>
          </FadeInView>

          {/* Progress indicator */}
          <FadeInView delay={0.3}>
            <div
              className={cn(
                "mb-8 inline-flex items-center gap-3 rounded-2xl border px-6 py-3",
                isDark
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                  : "border-amber-200 bg-amber-50 text-amber-700",
              )}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Clock className="h-5 w-5" />
              </motion.div>
              <span className="font-medium">Coming soon — stay tuned!</span>
            </div>
          </FadeInView>

          {/* Action Buttons */}
          <FadeInView delay={0.4}>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <HoverScale>
                <Button href="/" size="lg" icon={<Home className="h-5 w-5" />}>
                  Back to Home
                </Button>
              </HoverScale>
              <HoverScale>
                <Button
                  href="/contact"
                  variant="outline"
                  size="lg"
                  icon={<Mail className="h-5 w-5" />}
                  className={cn(
                    isDark && "hover:text-comesBlue border-white text-white hover:bg-white",
                  )}
                >
                  Contact Us
                </Button>
              </HoverScale>
            </div>
          </FadeInView>

          {/* Back link */}
          <FadeInView delay={0.5}>
            <button
              onClick={() => window.history.back()}
              className={cn(
                "mt-8 inline-flex items-center gap-2 text-sm transition-colors",
                isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600",
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              Go back to previous page
            </button>
          </FadeInView>
        </div>
      </div>
    </PageTransition>
  );
};

export default UnderMaintenancePage;
