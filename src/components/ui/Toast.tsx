// ============================================
// ComES Website - Toast Component
// ============================================

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useToastStore, type ToastType } from "@/store/toastStore";
import { cn } from "@/utils";

const toastStyles: Record<ToastType, { bg: string; border: string; icon: string; iconBg: string }> =
  {
    success: {
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      icon: "text-green-500",
      iconBg: "bg-green-500/20",
    },
    error: {
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      icon: "text-red-500",
      iconBg: "bg-red-500/20",
    },
    warning: {
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
      icon: "text-yellow-500",
      iconBg: "bg-yellow-500/20",
    },
    info: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      icon: "text-blue-500",
      iconBg: "bg-blue-500/20",
    },
  };

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5" />,
  error: <AlertCircle className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[9999] flex w-full max-w-sm flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const styles = toastStyles[toast.type];

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-xl",
                styles.bg,
                styles.border,
              )}
            >
              <div className={cn("shrink-0 rounded-lg p-1.5", styles.iconBg)}>
                <span className={styles.icon}>{toastIcons[toast.type]}</span>
              </div>

              <p className="flex-1 pt-1 text-sm text-white/90">{toast.message}</p>

              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 rounded-lg p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white/90"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
