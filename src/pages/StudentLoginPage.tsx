// ============================================
// ComES Website - Student Login Page
// ============================================

import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, GraduationCap } from 'lucide-react';
import { useStudentStore } from '@/store/studentStore';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';
import { Button, ThemeToggle } from '@/components/ui';

export const StudentLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useStudentStore();
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    const success = await login({ email, password });
    if (success) {
      navigate('/student/dashboard');
    }
  };

  return (
    <div className={cn(
      'min-h-screen flex items-center justify-center p-4',
      isDark 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
        : 'bg-gradient-to-br from-blue-50 via-white to-cyan-50'
    )}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={cn(
          'absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl',
          isDark ? 'bg-blue-500/10' : 'bg-blue-400/20'
        )} />
        <div className={cn(
          'absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl',
          isDark ? 'bg-cyan-500/10' : 'bg-cyan-400/20'
        )} />
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Back to Home */}
      <Link
        to="/"
        className={cn(
          'absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-xl transition-colors',
          isDark 
            ? 'text-gray-400 hover:text-white hover:bg-slate-800' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        )}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'relative w-full max-w-md p-8 rounded-2xl',
          isDark 
            ? 'bg-slate-900/80 border border-slate-800 backdrop-blur-xl' 
            : 'bg-white/80 backdrop-blur-xl shadow-2xl'
        )}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className={cn(
              'w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center',
              isDark 
                ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
                : 'bg-gradient-to-br from-blue-600 to-cyan-600'
            )}
          >
            <GraduationCap className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className={cn(
            'text-2xl font-bold mb-2',
            isDark ? 'text-white' : 'text-gray-900'
          )}>
            Student Login
          </h1>
          <p className={cn(
            'text-sm',
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            Sign in to access your ComES dashboard
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-500">{error}</p>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={cn(
              'block text-sm font-medium mb-2',
              isDark ? 'text-gray-300' : 'text-gray-700'
            )}>
              Email Address
            </label>
            <div className="relative">
              <Mail className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
                isDark ? 'text-gray-500' : 'text-gray-400'
              )} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  'w-full pl-10 pr-4 py-3 rounded-xl border transition-all',
                  isDark 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-blue-500' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                )}
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className={cn(
              'block text-sm font-medium mb-2',
              isDark ? 'text-gray-300' : 'text-gray-700'
            )}>
              Password
            </label>
            <div className="relative">
              <Lock className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
                isDark ? 'text-gray-500' : 'text-gray-400'
              )} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  'w-full pl-10 pr-12 py-3 rounded-xl border transition-all',
                  isDark 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-blue-500' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                )}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={cn(
                  'absolute right-3 top-1/2 -translate-y-1/2',
                  isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                )}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className={cn(
                  'w-4 h-4 rounded border transition-colors',
                  isDark ? 'border-slate-600 bg-slate-800' : 'border-gray-300'
                )}
              />
              <span className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                Remember me
              </span>
            </label>
            <Link
              to="/forgot-password"
              className={cn(
                'text-sm font-medium',
                isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
              )}
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
            Don't have an account?{' '}
            <Link
              to="/register"
              className={cn(
                'font-medium hover:underline',
                isDark ? 'text-blue-400' : 'text-blue-600'
              )}
            >
              Register here
            </Link>
          </p>
        </div>

        {/* Admin Link */}
        <div className="mt-4 pt-4 border-t text-center" style={{ borderColor: isDark ? '#334155' : '#e5e7eb' }}>
          <p className={cn('text-sm', isDark ? 'text-gray-500' : 'text-gray-500')}>
            Are you an admin?{' '}
            <Link
              to="/admin/login"
              className={cn(
                'font-medium hover:underline',
                isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Admin Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentLoginPage;
