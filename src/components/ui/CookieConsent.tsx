// ============================================
// ComES Website - Cookie Consent Banner
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Shield, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { useCookieStore } from '@/store/cookieStore';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';

export const CookieConsent = () => {
  const [showDetails, setShowDetails] = useState(false);
  const { consent, showBanner, setConsent } = useCookieStore();
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  // Don't show if user has already made a choice
  if (consent !== null || !showBanner) return null;

  const handleAcceptAll = () => {
    setConsent('all');
  };

  const handleAcceptNecessary = () => {
    setConsent('necessary');
  };

  const handleReject = () => {
    setConsent('rejected');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', bounce: 0.2 }}
        className={cn(
          'fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6',
          isDark ? 'bg-slate-900/95' : 'bg-white/95',
          'backdrop-blur-lg border-t',
          isDark ? 'border-slate-800' : 'border-gray-200',
          'shadow-2xl'
        )}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-8">
            {/* Icon and Text */}
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <div className={cn(
                  'p-3 rounded-xl flex-shrink-0',
                  isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                )}>
                  <Cookie className={cn(
                    'w-6 h-6',
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  )} />
                </div>
                <div>
                  <h3 className={cn(
                    'text-lg font-semibold mb-2',
                    isDark ? 'text-white' : 'text-gray-900'
                  )}>
                    We value your privacy
                  </h3>
                  <p className={cn(
                    'text-sm',
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    We use cookies to enhance your browsing experience, analyze site traffic, and understand 
                    where our visitors come from. By clicking "Accept All", you consent to our use of cookies.
                  </p>
                  
                  {/* Show Details Toggle */}
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className={cn(
                      'flex items-center gap-1 mt-3 text-sm font-medium transition-colors',
                      isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    )}
                  >
                    {showDetails ? 'Hide details' : 'Show details'}
                    {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Cookie Details */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className={cn(
                      'mt-4 p-4 rounded-xl space-y-4',
                      isDark ? 'bg-slate-800/50' : 'bg-gray-50'
                    )}>
                      {/* Necessary Cookies */}
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'p-2 rounded-lg flex-shrink-0',
                          isDark ? 'bg-green-500/20' : 'bg-green-100'
                        )}>
                          <Shield className={cn(
                            'w-4 h-4',
                            isDark ? 'text-green-400' : 'text-green-600'
                          )} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className={cn(
                              'text-sm font-semibold',
                              isDark ? 'text-white' : 'text-gray-900'
                            )}>
                              Necessary Cookies
                            </h4>
                            <span className={cn(
                              'text-xs px-2 py-0.5 rounded-full',
                              isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                            )}>
                              Always active
                            </span>
                          </div>
                          <p className={cn(
                            'text-xs mt-1',
                            isDark ? 'text-gray-500' : 'text-gray-500'
                          )}>
                            Essential for the website to function properly. These cannot be disabled.
                          </p>
                        </div>
                      </div>

                      {/* Analytics Cookies */}
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'p-2 rounded-lg flex-shrink-0',
                          isDark ? 'bg-purple-500/20' : 'bg-purple-100'
                        )}>
                          <BarChart3 className={cn(
                            'w-4 h-4',
                            isDark ? 'text-purple-400' : 'text-purple-600'
                          )} />
                        </div>
                        <div>
                          <h4 className={cn(
                            'text-sm font-semibold',
                            isDark ? 'text-white' : 'text-gray-900'
                          )}>
                            Analytics Cookies
                          </h4>
                          <p className={cn(
                            'text-xs mt-1',
                            isDark ? 'text-gray-500' : 'text-gray-500'
                          )}>
                            Help us understand how visitors interact with our website by collecting 
                            anonymous information like pages visited, time spent, and referral sources.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:min-w-[200px]">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAcceptAll}
                className="px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/25 transition-all"
              >
                Accept All
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAcceptNecessary}
                className={cn(
                  'px-6 py-3 rounded-xl font-semibold text-sm transition-all',
                  isDark 
                    ? 'bg-slate-800 text-white hover:bg-slate-700' 
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                )}
              >
                Necessary Only
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReject}
                className={cn(
                  'px-6 py-3 rounded-xl font-semibold text-sm transition-all',
                  isDark 
                    ? 'text-gray-400 hover:text-white' 
                    : 'text-gray-500 hover:text-gray-700'
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
