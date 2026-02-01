// ============================================
// ComES Website - Admin Login Page
// ============================================

import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuthStore, useThemeStore } from '@/store';
import { cn } from '@/utils';
import { Button, ThemeToggle } from '@/components/ui';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    const success = await login({ email, password });
    if (success) {
      navigate('/admin');
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
        <span>Back to Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'w-full max-w-md p-8 rounded-2xl shadow-2xl relative z-10',
          isDark 
            ? 'bg-slate-900/80 backdrop-blur-xl border border-slate-800' 
            : 'bg-white/80 backdrop-blur-xl border border-gray-200'
        )}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/30 mb-4">
            CE
          </div>
          <h1 className={cn(
            'text-2xl font-bold',
            isDark ? 'text-white' : 'text-gray-900'
          )}>
            Admin Login
          </h1>
          <p className={cn(
            'mt-2',
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            Sign in to access the dashboard
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className={cn(
              'block text-sm font-medium mb-2',
              isDark ? 'text-gray-300' : 'text-gray-700'
            )}>
              Email Address
            </label>
            <div className="relative">
              <Mail className={cn(
                'absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5',
                isDark ? 'text-gray-500' : 'text-gray-400'
              )} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@comes.lk"
                required
                className={cn(
                  'w-full pl-12 pr-4 py-3 rounded-xl border transition-colors',
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-blue-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                )}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className={cn(
              'block text-sm font-medium mb-2',
              isDark ? 'text-gray-300' : 'text-gray-700'
            )}>
              Password
            </label>
            <div className="relative">
              <Lock className={cn(
                'absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5',
                isDark ? 'text-gray-500' : 'text-gray-400'
              )} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={cn(
                  'w-full pl-12 pr-12 py-3 rounded-xl border transition-colors',
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-blue-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={cn(
                  'absolute right-4 top-1/2 -translate-y-1/2',
                  isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                )}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            className="w-full"
          >
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <p className={cn(
          'mt-6 text-center text-sm',
          isDark ? 'text-gray-500' : 'text-gray-500'
        )}>
          Protected area. Authorized personnel only.
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
