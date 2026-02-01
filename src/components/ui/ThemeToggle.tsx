// ============================================
// ComES Website - Theme Toggle Component
// ============================================

import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';

interface ThemeToggleProps {
  className?: string;
  variant?: 'icon' | 'full';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'icon',
}) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useThemeStore();

  if (variant === 'icon') {
    return (
      <motion.button
        onClick={toggleTheme}
        className={cn(
          'relative p-2.5 rounded-xl transition-colors',
          'hover:bg-gray-100 dark:hover:bg-slate-800',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
          className
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {resolvedTheme === 'light' ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="w-5 h-5 text-amber-500" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="w-5 h-5 text-blue-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }

  // Full variant with all three options
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 p-1 rounded-xl',
        'bg-gray-100 dark:bg-slate-800',
        className
      )}
    >
      {[
        { value: 'light' as const, icon: Sun, label: 'Light' },
        { value: 'dark' as const, icon: Moon, label: 'Dark' },
        { value: 'system' as const, icon: Monitor, label: 'System' },
      ].map(({ value, icon: Icon, label }) => (
        <motion.button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            'relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
            theme === value
              ? 'text-white'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label={`Set theme to ${label}`}
        >
          {theme === value && (
            <motion.div
              layoutId="theme-indicator"
              className="absolute inset-0 bg-blue-600 dark:bg-blue-500 rounded-lg"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </span>
        </motion.button>
      ))}
    </div>
  );
};

export default ThemeToggle;
