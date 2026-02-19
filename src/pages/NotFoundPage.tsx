// ============================================
// ComES Website - 404 Not Found Page
// ============================================

import { motion } from "framer-motion";
import { ArrowLeft, Home, Search, Compass, RefreshCw, Sparkles } from "lucide-react";
import { Button, PageTransition, FadeInView, HoverScale } from "@/components/ui";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";

export const NotFoundPage = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  const helpfulLinks = [
    { label: "About Us", href: "/about", icon: Compass },
    { label: "Events", href: "/events", icon: Search },
    { label: "Projects", href: "/projects", icon: RefreshCw },
    { label: "Contact", href: "/contact", icon: Sparkles },
  ];

  return (
    <PageTransition>
      <div
        className={cn(
          "relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4",
          isDark ? "bg-slate-900" : "bg-gray-50",
        )}
      >
        {/* Animated background elements */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute w-64 h-64 rounded-full top-20 left-1/4 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.5, 1, 1.5],
            x: [0, -50, 0],
            y: [0, 30, 0],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute rounded-full right-1/4 bottom-20 h-72 w-72 bg-gradient-to-br from-purple-400/20 to-pink-500/20 blur-3xl"
        />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              "absolute h-2 w-2 rounded-full",
              isDark ? "bg-blue-400/40" : "bg-blue-500/30",
            )}
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 15}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          {/* 404 Illustration */}
          <FadeInView>
            <div className="relative mb-8">
              <motion.span
                className={cn(
                  "text-[150px] font-black select-none md:text-[200px]",
                  isDark ? "text-slate-800" : "text-gray-100",
                )}
                animate={{
                  textShadow: isDark
                    ? [
                        "0 0 20px rgba(59, 130, 246, 0)",
                        "0 0 40px rgba(59, 130, 246, 0.3)",
                        "0 0 20px rgba(59, 130, 246, 0)",
                      ]
                    : undefined,
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                404
              </motion.span>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  className="text-6xl font-bold text-transparent bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 bg-clip-text md:text-8xl"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  style={{ backgroundSize: "200% 200%" }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  Oops!
                </motion.span>
              </div>
            </div>
          </FadeInView>

          {/* Content */}
          <FadeInView delay={0.1}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.3 }}
              className="flex items-center justify-center w-16 h-16 mx-auto mb-6 shadow-lg rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-blue-500/30"
            >
              <Compass className="w-8 h-8 text-white" />
            </motion.div>
          </FadeInView>

          <FadeInView delay={0.2}>
            <h1
              className={cn(
                "mb-4 text-3xl font-bold md:text-4xl",
                isDark ? "text-white" : "text-comesBlue",
              )}
            >
              Page Not{" "}
              <span className="text-transparent bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text">
                Found
              </span>
            </h1>
          </FadeInView>

          <FadeInView delay={0.3}>
            <p className={cn("mb-8 text-lg", isDark ? "text-gray-400" : "text-gray-600")}>
              The page you're looking for doesn't exist or has been moved. Don't worry, it happens
              to the best of us!
            </p>
          </FadeInView>

          {/* Actions */}
          <FadeInView delay={0.4}>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <HoverScale>
                <Button
                  onClick={() => window.history.back()}
                  variant="outline"
                  size="lg"
                  icon={<ArrowLeft className="w-5 h-5" />}
                  iconPosition="left"
                >
                  Go Back
                </Button>
              </HoverScale>
              <HoverScale>
                <Button href="/" size="lg" icon={<Home className="w-5 h-5" />} iconPosition="left">
                  Back to Home
                </Button>
              </HoverScale>
            </div>
          </FadeInView>

          {/* Helpful Links */}
          <FadeInView delay={0.5}>
            <div
              className={cn("mt-12 border-t pt-8", isDark ? "border-slate-700" : "border-gray-200")}
            >
              <p className={cn("mb-6", isDark ? "text-gray-500" : "text-gray-500")}>
                Here are some helpful links:
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {helpfulLinks.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-4 py-2 transition-all",
                      isDark
                        ? "border-slate-700 text-gray-300 hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-400"
                        : "border-gray-200 text-gray-600 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600",
                    )}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <link.icon className="w-4 h-4" />
                    <span className="font-medium">{link.label}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </FadeInView>
        </div>
      </div>
    </PageTransition>
  );
};

export default NotFoundPage;
