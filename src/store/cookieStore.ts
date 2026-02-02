// ============================================
// ComES Website - Cookie Consent Store
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CookiePreference = 'all' | 'necessary' | 'rejected' | null;

interface CookieState {
  consent: CookiePreference;
  showBanner: boolean;
  analyticsEnabled: boolean;
  setConsent: (consent: CookiePreference) => void;
  setShowBanner: (show: boolean) => void;
  resetConsent: () => void;
}

export const useCookieStore = create<CookieState>()(
  persist(
    (set) => ({
      consent: null,
      showBanner: true,
      analyticsEnabled: false,
      
      setConsent: (consent) => {
        const analyticsEnabled = consent === 'all';
        set({ 
          consent, 
          showBanner: false,
          analyticsEnabled 
        });
        
        // If analytics enabled, track the visit
        if (analyticsEnabled) {
          import('@/services/analytics.service').then(({ analyticsService }) => {
            analyticsService.trackVisit();
          });
        }
      },
      
      setShowBanner: (show) => set({ showBanner: show }),
      
      resetConsent: () => set({ 
        consent: null, 
        showBanner: true, 
        analyticsEnabled: false 
      }),
    }),
    {
      name: 'comes-cookie-consent',
      partialize: (state) => ({ 
        consent: state.consent,
        showBanner: state.consent === null,
        analyticsEnabled: state.analyticsEnabled,
      }),
    }
  )
);

// Initialize analytics if already consented
export const initializeCookies = () => {
  const state = useCookieStore.getState();
  if (state.consent === 'all' && state.analyticsEnabled) {
    import('@/services/analytics.service').then(({ analyticsService }) => {
      analyticsService.trackVisit();
    });
  }
};
