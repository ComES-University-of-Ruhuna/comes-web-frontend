// ============================================
// ComES Website - Student Settings Page
// ============================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router';
import { 
  Bell, 
  Mail, 
  Shield,
  ArrowLeft,
  Moon,
  Sun,
  Monitor,
  CheckCircle,
  Trash2,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useStudentStore } from '@/store/studentStore';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';
import { Button } from '@/components/ui';
import { Navbar, Footer } from '@/components/layout';
import * as studentService from '@/services/student.service';

export const SettingsPage = () => {
  const { logout } = useStudentStore();
  const { theme, setTheme, resolvedTheme } = useThemeStore();
  const navigate = useNavigate();
  const isDark = resolvedTheme === 'dark';
  
  const [notifications, setNotifications] = useState({
    emailEvents: true,
    emailNewsletter: true,
    emailUpdates: false,
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    // TODO: Save to backend
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      setDeleteError('');
      await studentService.default.deleteAccount();
      logout();
      navigate('/');
    } catch (err: any) {
      setDeleteError(err.response?.data?.message || 'Failed to delete account. Please try again.');
      setIsDeleting(false);
    }
  };

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  return (
    <div className={cn(
      'min-h-screen flex flex-col font-comes transition-colors duration-300',
      isDark ? 'bg-slate-950 text-gray-100' : 'bg-white text-gray-900'
    )}>
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
        <div className={cn(
          'min-h-screen py-8',
          isDark ? 'bg-slate-950' : 'bg-gray-50'
        )}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <Link 
              to="/student/dashboard"
              className={cn(
                'inline-flex items-center gap-2 mb-6 transition-colors',
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className={cn('text-3xl font-bold mb-2', isDark ? 'text-white' : 'text-gray-900')}>
                Settings
              </h1>
              <p className={cn('text-lg', isDark ? 'text-gray-400' : 'text-gray-600')}>
                Manage your preferences and account settings
              </p>
            </motion.div>

            {/* Theme Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={cn(
                'p-6 rounded-2xl border mb-6',
                isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-sm'
              )}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  isDark ? 'bg-purple-500/20' : 'bg-purple-100'
                )}>
                  {isDark ? <Moon className="w-5 h-5 text-purple-400" /> : <Sun className="w-5 h-5 text-purple-600" />}
                </div>
                <div>
                  <h2 className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
                    Appearance
                  </h2>
                  <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                    Choose your preferred theme
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all',
                      theme === option.value
                        ? isDark
                          ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                          : 'bg-blue-50 border-blue-500 text-blue-600'
                        : isDark
                          ? 'border-slate-700 hover:border-slate-600 text-gray-400'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    )}
                  >
                    <option.icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{option.label}</span>
                    {theme === option.value && (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Notification Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={cn(
                'p-6 rounded-2xl border mb-6',
                isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-sm'
              )}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                )}>
                  <Bell className={cn('w-5 h-5', isDark ? 'text-blue-400' : 'text-blue-600')} />
                </div>
                <div>
                  <h2 className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
                    Notifications
                  </h2>
                  <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                    Manage your email notifications
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Event Notifications */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className={cn('w-5 h-5', isDark ? 'text-gray-400' : 'text-gray-500')} />
                    <div>
                      <p className={cn('font-medium', isDark ? 'text-white' : 'text-gray-900')}>
                        Event Updates
                      </p>
                      <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                        Get notified about events you've registered for
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationChange('emailEvents')}
                    className={cn(
                      'relative w-12 h-6 rounded-full transition-colors',
                      notifications.emailEvents
                        ? 'bg-blue-500'
                        : isDark ? 'bg-slate-700' : 'bg-gray-200'
                    )}
                  >
                    <div className={cn(
                      'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                      notifications.emailEvents ? 'translate-x-7' : 'translate-x-1'
                    )} />
                  </button>
                </div>

                {/* Newsletter */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className={cn('w-5 h-5', isDark ? 'text-gray-400' : 'text-gray-500')} />
                    <div>
                      <p className={cn('font-medium', isDark ? 'text-white' : 'text-gray-900')}>
                        Newsletter
                      </p>
                      <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                        Receive our monthly newsletter
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationChange('emailNewsletter')}
                    className={cn(
                      'relative w-12 h-6 rounded-full transition-colors',
                      notifications.emailNewsletter
                        ? 'bg-blue-500'
                        : isDark ? 'bg-slate-700' : 'bg-gray-200'
                    )}
                  >
                    <div className={cn(
                      'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                      notifications.emailNewsletter ? 'translate-x-7' : 'translate-x-1'
                    )} />
                  </button>
                </div>

                {/* General Updates */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className={cn('w-5 h-5', isDark ? 'text-gray-400' : 'text-gray-500')} />
                    <div>
                      <p className={cn('font-medium', isDark ? 'text-white' : 'text-gray-900')}>
                        General Updates
                      </p>
                      <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                        News about ComES and announcements
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationChange('emailUpdates')}
                    className={cn(
                      'relative w-12 h-6 rounded-full transition-colors',
                      notifications.emailUpdates
                        ? 'bg-blue-500'
                        : isDark ? 'bg-slate-700' : 'bg-gray-200'
                    )}
                  >
                    <div className={cn(
                      'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                      notifications.emailUpdates ? 'translate-x-7' : 'translate-x-1'
                    )} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Privacy & Security */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={cn(
                'p-6 rounded-2xl border mb-6',
                isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-sm'
              )}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  isDark ? 'bg-green-500/20' : 'bg-green-100'
                )}>
                  <Shield className={cn('w-5 h-5', isDark ? 'text-green-400' : 'text-green-600')} />
                </div>
                <div>
                  <h2 className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
                    Privacy & Security
                  </h2>
                  <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                    Manage your account security
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Link 
                  to="/student/profile"
                  className={cn(
                    'flex items-center justify-between p-4 rounded-xl transition-all',
                    isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-50'
                  )}
                >
                  <span className={cn(isDark ? 'text-white' : 'text-gray-900')}>Change Password</span>
                  <ArrowLeft className={cn('w-5 h-5 rotate-180', isDark ? 'text-gray-400' : 'text-gray-500')} />
                </Link>

                <div className={cn(
                  'flex items-center justify-between p-4 rounded-xl',
                  isDark ? 'bg-slate-800/50' : 'bg-gray-50'
                )}>
                  <div>
                    <span className={cn(isDark ? 'text-white' : 'text-gray-900')}>Two-Factor Authentication</span>
                    <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                      Coming soon
                    </p>
                  </div>
                  <span className={cn('text-xs px-2 py-1 rounded-lg', isDark ? 'bg-slate-700 text-gray-400' : 'bg-gray-200 text-gray-500')}>
                    Soon
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={cn(
                'p-6 rounded-2xl border',
                'border-red-500/20 bg-red-500/5'
              )}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/20">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h2 className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
                    Danger Zone
                  </h2>
                  <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                    Irreversible actions
                  </p>
                </div>
              </div>

              {!showDeleteConfirm ? (
                <Button
                  variant="ghost"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-red-500 hover:bg-red-500/10 gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </Button>
              ) : (
                <div className={cn(
                  'p-4 rounded-xl',
                  isDark ? 'bg-slate-900' : 'bg-white'
                )}>
                  <p className={cn('text-sm mb-4', isDark ? 'text-gray-300' : 'text-gray-700')}>
                    Are you sure you want to delete your account? This action cannot be undone.
                  </p>
                  {deleteError && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-500">{deleteError}</p>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteError('');
                      }}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="bg-red-500 text-white hover:bg-red-600"
                    >
                      {isDeleting ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Deleting...</span>
                        </div>
                      ) : (
                        'Yes, Delete My Account'
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SettingsPage;
