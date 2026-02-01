// ============================================
// ComES Website - Admin Settings Page
// ============================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  Globe,
  Bell,
  Lock,
  Palette,
  Database,
  Shield,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';
import { Button } from '@/components/ui';

interface Settings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    github: string;
  };
  notifications: {
    emailNotifications: boolean;
    newContactAlert: boolean;
    newSubscriberAlert: boolean;
    eventReminders: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
  };
}

const defaultSettings: Settings = {
  siteName: 'ComES - Computer Engineering Society',
  siteDescription: 'Empowering future engineers through technology and innovation',
  contactEmail: 'contact@comes.edu',
  socialLinks: {
    facebook: 'https://facebook.com/comes',
    twitter: 'https://twitter.com/comes',
    instagram: 'https://instagram.com/comes',
    linkedin: 'https://linkedin.com/company/comes',
    github: 'https://github.com/comes',
  },
  notifications: {
    emailNotifications: true,
    newContactAlert: true,
    newSubscriberAlert: false,
    eventReminders: true,
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 30,
  },
};

export const SettingsPage = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'api', label: 'API & Integrations', icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn('text-3xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
            Settings
          </h1>
          <p className={cn('mt-1', isDark ? 'text-gray-400' : 'text-gray-600')}>
            Configure your website settings
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Save className="w-4 h-4" />}
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className={cn(
          'lg:w-64 shrink-0 p-2 rounded-2xl border',
          isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'
        )}>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors',
                  activeTab === tab.id
                    ? isDark
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-blue-50 text-blue-600'
                    : isDark
                      ? 'text-gray-400 hover:bg-slate-800 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className={cn(
          'flex-1 p-6 rounded-2xl border',
          isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'
        )}>
          {/* General Settings */}
          {activeTab === 'general' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className={cn('text-xl font-semibold pb-4 border-b', isDark ? 'text-white border-slate-800' : 'text-gray-900 border-gray-200')}>
                General Settings
              </h2>

              <div className="space-y-4">
                <div>
                  <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border transition-colors',
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-900',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                    )}
                  />
                </div>

                <div>
                  <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                    Site Description
                  </label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                    rows={3}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border transition-colors resize-none',
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-900',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                    )}
                  />
                </div>

                <div>
                  <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border transition-colors',
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-900',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                    )}
                  />
                </div>

                <div>
                  <label className={cn('block text-sm font-medium mb-4', isDark ? 'text-gray-300' : 'text-gray-700')}>
                    Social Media Links
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(settings.socialLinks).map(([key, value]) => (
                      <div key={key}>
                        <label className={cn('block text-xs font-medium mb-1 capitalize', isDark ? 'text-gray-400' : 'text-gray-500')}>
                          {key}
                        </label>
                        <input
                          type="url"
                          value={value}
                          onChange={(e) => setSettings({
                            ...settings,
                            socialLinks: { ...settings.socialLinks, [key]: e.target.value }
                          })}
                          className={cn(
                            'w-full px-3 py-2 rounded-lg border transition-colors text-sm',
                            isDark
                              ? 'bg-slate-800 border-slate-700 text-white'
                              : 'bg-gray-50 border-gray-200 text-gray-900',
                            'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className={cn('text-xl font-semibold pb-4 border-b', isDark ? 'text-white border-slate-800' : 'text-gray-900 border-gray-200')}>
                Notification Settings
              </h2>

              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email notifications for important updates' },
                  { key: 'newContactAlert', label: 'New Contact Alerts', desc: 'Get notified when someone submits a contact form' },
                  { key: 'newSubscriberAlert', label: 'New Subscriber Alerts', desc: 'Get notified when someone subscribes to newsletter' },
                  { key: 'eventReminders', label: 'Event Reminders', desc: 'Send reminders before upcoming events' },
                ].map(({ key, label, desc }) => (
                  <div
                    key={key}
                    className={cn(
                      'flex items-center justify-between p-4 rounded-xl border',
                      isDark ? 'border-slate-800' : 'border-gray-200'
                    )}
                  >
                    <div>
                      <p className={cn('font-medium', isDark ? 'text-white' : 'text-gray-900')}>{label}</p>
                      <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>{desc}</p>
                    </div>
                    <button
                      onClick={() => setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          [key]: !settings.notifications[key as keyof typeof settings.notifications]
                        }
                      })}
                      className={cn(
                        'relative w-14 h-8 rounded-full transition-colors',
                        settings.notifications[key as keyof typeof settings.notifications]
                          ? 'bg-blue-500'
                          : isDark ? 'bg-slate-700' : 'bg-gray-300'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-1 w-6 h-6 bg-white rounded-full transition-transform shadow-lg',
                          settings.notifications[key as keyof typeof settings.notifications] ? 'left-7' : 'left-1'
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className={cn('text-xl font-semibold pb-4 border-b', isDark ? 'text-white border-slate-800' : 'text-gray-900 border-gray-200')}>
                Security Settings
              </h2>

              <div className="space-y-4">
                <div className={cn(
                  'flex items-center justify-between p-4 rounded-xl border',
                  isDark ? 'border-slate-800' : 'border-gray-200'
                )}>
                  <div className="flex items-center gap-3">
                    <Shield className={cn('w-5 h-5', isDark ? 'text-gray-400' : 'text-gray-500')} />
                    <div>
                      <p className={cn('font-medium', isDark ? 'text-white' : 'text-gray-900')}>Two-Factor Authentication</p>
                      <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSettings({
                      ...settings,
                      security: { ...settings.security, twoFactorAuth: !settings.security.twoFactorAuth }
                    })}
                    className={cn(
                      'relative w-14 h-8 rounded-full transition-colors',
                      settings.security.twoFactorAuth ? 'bg-blue-500' : isDark ? 'bg-slate-700' : 'bg-gray-300'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 w-6 h-6 bg-white rounded-full transition-transform shadow-lg',
                        settings.security.twoFactorAuth ? 'left-7' : 'left-1'
                      )}
                    />
                  </button>
                </div>

                <div>
                  <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                    })}
                    min={5}
                    max={120}
                    className={cn(
                      'w-full max-w-xs px-4 py-3 rounded-xl border transition-colors',
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-900',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                    )}
                  />
                </div>

                <div className={cn(
                  'p-4 rounded-xl border',
                  isDark ? 'border-slate-800' : 'border-gray-200'
                )}>
                  <h3 className={cn('font-medium mb-3', isDark ? 'text-white' : 'text-gray-900')}>
                    Change Password
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="password"
                      placeholder="Current password"
                      className={cn(
                        'w-full px-4 py-3 rounded-xl border transition-colors',
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                      )}
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      className={cn(
                        'w-full px-4 py-3 rounded-xl border transition-colors',
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                      )}
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className={cn(
                        'w-full px-4 py-3 rounded-xl border transition-colors',
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                      )}
                    />
                    <Button variant="primary" size="sm">
                      Update Password
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className={cn('text-xl font-semibold pb-4 border-b', isDark ? 'text-white border-slate-800' : 'text-gray-900 border-gray-200')}>
                Appearance Settings
              </h2>

              <div className="space-y-4">
                <div>
                  <label className={cn('block text-sm font-medium mb-4', isDark ? 'text-gray-300' : 'text-gray-700')}>
                    Theme Preference
                  </label>
                  <div className="grid grid-cols-3 gap-4 max-w-md">
                    {['light', 'dark', 'system'].map((theme) => (
                      <button
                        key={theme}
                        className={cn(
                          'p-4 rounded-xl border-2 text-center capitalize transition-colors',
                          isDark
                            ? 'border-slate-700 hover:border-blue-500'
                            : 'border-gray-200 hover:border-blue-500'
                        )}
                      >
                        <Palette className={cn('w-6 h-6 mx-auto mb-2', isDark ? 'text-gray-400' : 'text-gray-500')} />
                        <span className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-gray-900')}>
                          {theme}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* API & Integrations */}
          {activeTab === 'api' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className={cn('text-xl font-semibold pb-4 border-b', isDark ? 'text-white border-slate-800' : 'text-gray-900 border-gray-200')}>
                API & Integrations
              </h2>

              <div className="space-y-4">
                <div>
                  <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                    API Key
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value="sk_live_abc123xyz789def456..."
                        readOnly
                        className={cn(
                          'w-full px-4 py-3 pr-12 rounded-xl border transition-colors font-mono text-sm',
                          isDark
                            ? 'bg-slate-800 border-slate-700 text-white'
                            : 'bg-gray-50 border-gray-200 text-gray-900'
                        )}
                      />
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showApiKey ? (
                          <EyeOff className={cn('w-5 h-5', isDark ? 'text-gray-500' : 'text-gray-400')} />
                        ) : (
                          <Eye className={cn('w-5 h-5', isDark ? 'text-gray-500' : 'text-gray-400')} />
                        )}
                      </button>
                    </div>
                    <Button variant="outline">Regenerate</Button>
                  </div>
                  <p className={cn('text-sm mt-2', isDark ? 'text-gray-500' : 'text-gray-400')}>
                    Use this key to authenticate API requests. Keep it secret!
                  </p>
                </div>

                <div className={cn(
                  'p-4 rounded-xl border',
                  isDark ? 'border-slate-800' : 'border-gray-200'
                )}>
                  <h3 className={cn('font-medium mb-3', isDark ? 'text-white' : 'text-gray-900')}>
                    Webhook URL
                  </h3>
                  <input
                    type="url"
                    placeholder="https://your-server.com/webhook"
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border transition-colors',
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                    )}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
