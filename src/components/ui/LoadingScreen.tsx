// ============================================
// ComES Website - Security Loading Screen
// ============================================

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ShieldCheck,
  Cpu,
  Fingerprint,
  Lock,
  Wifi,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface SecurityCheck {
  id: string;
  label: string;
  icon: React.ReactNode;
  duration: number;
}

const securityChecks: SecurityCheck[] = [
  {
    id: "connection",
    label: "Establishing secure connection",
    icon: <Wifi className="h-5 w-5" />,
    duration: 800,
  },
  {
    id: "ddos",
    label: "DDoS protection verification",
    icon: <Shield className="h-5 w-5" />,
    duration: 1000,
  },
  {
    id: "fingerprint",
    label: "Browser fingerprint analysis",
    icon: <Fingerprint className="h-5 w-5" />,
    duration: 700,
  },
  {
    id: "encryption",
    label: "Encrypting data channel",
    icon: <Lock className="h-5 w-5" />,
    duration: 600,
  },
  {
    id: "system",
    label: "System integrity check",
    icon: <Cpu className="h-5 w-5" />,
    duration: 500,
  },
];

interface LoadingScreenProps {
  onComplete: () => void;
  minDuration?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, minDuration = 3500 }) => {
  const [currentCheckIndex, setCurrentCheckIndex] = useState(0);
  const [completedChecks, setCompletedChecks] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    let checkIndex = 0;

    const runCheck = () => {
      if (checkIndex < securityChecks.length) {
        const check = securityChecks[checkIndex];
        setCurrentCheckIndex(checkIndex);

        setTimeout(() => {
          setCompletedChecks((prev) => [...prev, check.id]);
          setProgress(((checkIndex + 1) / securityChecks.length) * 100);
          checkIndex++;
          runCheck();
        }, check.duration);
      } else {
        // Ensure minimum duration
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minDuration - elapsed);

        setTimeout(() => {
          setIsComplete(true);
          setTimeout(onComplete, 800);
        }, remaining);
      }
    };

    runCheck();
  }, [onComplete, minDuration]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
            {/* Animated grid background */}
            <div className="absolute inset-0 opacity-20">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)`,
                  backgroundSize: "50px 50px",
                  animation: "gridMove 20s linear infinite",
                }}
              />
            </div>

            {/* Glowing orbs */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-500/30 blur-[120px]"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-cyan-500/20 blur-[100px]"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-lg px-6 text-center">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="mb-8"
            >
              <div className="relative mx-auto h-24 w-24">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 rounded-2xl border-2 border-blue-500/30"
                  style={{ transform: "rotate(45deg)" }}
                />
                <div className="absolute inset-2 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/30">
                  <span className="text-3xl font-bold text-white">CE</span>
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-2 text-3xl font-bold text-white"
            >
              ComES
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8 text-blue-300"
            >
              Computer Engineering Society
            </motion.p>

            {/* Security Checks */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-6 rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6 backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center gap-2 text-blue-400">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-sm font-medium">Security Verification</span>
              </div>

              <div className="space-y-3">
                {securityChecks.map((check, index) => {
                  const isCompleted = completedChecks.includes(check.id);
                  const isCurrent = index === currentCheckIndex && !isCompleted;

                  return (
                    <motion.div
                      key={check.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                        isCompleted
                          ? "text-green-400"
                          : isCurrent
                            ? "text-blue-300"
                            : "text-slate-500"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300 ${
                          isCompleted
                            ? "bg-green-500/20"
                            : isCurrent
                              ? "bg-blue-500/20"
                              : "bg-slate-800/50"
                        }`}
                      >
                        {isCompleted ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                          >
                            <CheckCircle2 className="h-5 w-5" />
                          </motion.div>
                        ) : isCurrent ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <Loader2 className="h-5 w-5" />
                          </motion.div>
                        ) : (
                          check.icon
                        )}
                      </div>
                      <span>{check.label}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="relative"
            >
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500"
                  style={{ backgroundSize: "200% 100%" }}
                  animate={{
                    width: `${progress}%`,
                    backgroundPosition: ["0% 0%", "100% 0%"],
                  }}
                  transition={{
                    width: { duration: 0.3 },
                    backgroundPosition: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    },
                  }}
                />
              </div>
              <div className="mt-2 text-xs text-slate-500">{Math.round(progress)}% verified</div>
            </motion.div>
          </div>

          {/* Scan line effect */}
          <motion.div
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute right-0 left-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// CSS for grid animation (add to index.css)
// @keyframes gridMove {
//   0% { transform: translate(0, 0); }
//   100% { transform: translate(50px, 50px); }
// }

export default LoadingScreen;
