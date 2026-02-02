// ============================================
// ComES Website - Analytics Service
// ============================================

import api from './api';

export interface VisitorData {
  id: string;
  sessionId: string;
  visitedAt: string;
  pageViews: PageView[];
  userAgent: string;
  screenResolution: string;
  language: string;
  referrer: string;
  country?: string;
  city?: string;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  duration: number;
  isReturning: boolean;
}

export interface PageView {
  path: string;
  title: string;
  timestamp: string;
  duration: number;
}

export interface AnalyticsSummary {
  totalVisitors: number;
  totalPageViews: number;
  uniqueVisitors: number;
  averageSessionDuration: number;
  bounceRate: number;
  returningVisitors: number;
  newVisitors: number;
  topPages: { path: string; views: number; title: string }[];
  topReferrers: { source: string; count: number }[];
  deviceBreakdown: { device: string; count: number; percentage: number }[];
  browserBreakdown: { browser: string; count: number; percentage: number }[];
  visitsByDate: { date: string; visitors: number; pageViews: number }[];
  visitsByHour: { hour: number; visitors: number }[];
  recentVisitors: VisitorData[];
}

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// Generate unique session ID
const generateSessionId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Get or create session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('comes-session-id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('comes-session-id', sessionId);
  }
  return sessionId;
};

// Detect device type
const getDeviceType = (): 'desktop' | 'mobile' | 'tablet' => {
  const ua = navigator.userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(navigator.userAgent)) {
    return 'mobile';
  }
  return 'desktop';
};

// Detect browser
const getBrowser = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('SamsungBrowser')) return 'Samsung Browser';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  if (ua.includes('Trident')) return 'Internet Explorer';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('Edg')) return 'Edge Chromium';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Unknown';
};

// Detect OS
const getOS = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Unknown';
};

// Track page start time for duration calculation
let pageStartTime = Date.now();
let currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

class AnalyticsService {
  private visitTracked = false;

  async trackVisit(): Promise<void> {
    if (this.visitTracked) return;
    
    try {
      const visitData = {
        sessionId: getSessionId(),
        path: window.location.pathname,
        title: document.title,
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
        referrer: document.referrer || 'direct',
        device: getDeviceType(),
        browser: getBrowser(),
        os: getOS(),
        timestamp: new Date().toISOString(),
      };

      await api.post('/analytics/visit', visitData);
      this.visitTracked = true;
      
      // Reset page start time
      pageStartTime = Date.now();
      currentPath = window.location.pathname;
    } catch (error) {
      console.error('Failed to track visit:', error);
    }
  }

  async trackPageView(path: string, title: string): Promise<void> {
    try {
      // Calculate duration on previous page
      const duration = Math.round((Date.now() - pageStartTime) / 1000);
      
      const pageViewData = {
        sessionId: getSessionId(),
        previousPath: currentPath,
        previousDuration: duration,
        path,
        title,
        timestamp: new Date().toISOString(),
      };

      await api.post('/analytics/pageview', pageViewData);
      
      // Reset for new page
      pageStartTime = Date.now();
      currentPath = path;
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }

  async getAnalyticsSummary(filters?: AnalyticsFilters): Promise<AnalyticsSummary> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      
      const response = await api.get<AnalyticsSummary>(`/analytics/summary?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get analytics summary:', error);
      // Return mock data for demo purposes
      return this.getMockAnalyticsSummary();
    }
  }

  async getVisitors(filters?: AnalyticsFilters): Promise<{ visitors: VisitorData[]; total: number }> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      
      const response = await api.get<{ visitors: VisitorData[]; total: number }>(`/analytics/visitors?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get visitors:', error);
      return { visitors: [], total: 0 };
    }
  }

  // Mock data for demonstration when API is not available
  private getMockAnalyticsSummary(): AnalyticsSummary {
    const today = new Date();
    const visitsByDate = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toISOString().split('T')[0],
        visitors: Math.floor(Math.random() * 100) + 20,
        pageViews: Math.floor(Math.random() * 300) + 50,
      };
    });

    return {
      totalVisitors: 1247,
      totalPageViews: 4832,
      uniqueVisitors: 892,
      averageSessionDuration: 245,
      bounceRate: 42.5,
      returningVisitors: 355,
      newVisitors: 892,
      topPages: [
        { path: '/', title: 'Home', views: 1523 },
        { path: '/events', title: 'Events', views: 856 },
        { path: '/about', title: 'About', views: 643 },
        { path: '/projects', title: 'Projects', views: 521 },
        { path: '/team', title: 'Team', views: 412 },
        { path: '/blog', title: 'Blog', views: 389 },
        { path: '/contact', title: 'Contact', views: 287 },
        { path: '/gallery', title: 'Gallery', views: 201 },
      ],
      topReferrers: [
        { source: 'direct', count: 523 },
        { source: 'google.com', count: 312 },
        { source: 'facebook.com', count: 198 },
        { source: 'linkedin.com', count: 124 },
        { source: 'twitter.com', count: 67 },
      ],
      deviceBreakdown: [
        { device: 'Desktop', count: 623, percentage: 50 },
        { device: 'Mobile', count: 498, percentage: 40 },
        { device: 'Tablet', count: 126, percentage: 10 },
      ],
      browserBreakdown: [
        { browser: 'Chrome', count: 685, percentage: 55 },
        { browser: 'Safari', count: 249, percentage: 20 },
        { browser: 'Firefox', count: 187, percentage: 15 },
        { browser: 'Edge', count: 99, percentage: 8 },
        { browser: 'Others', count: 27, percentage: 2 },
      ],
      visitsByDate,
      visitsByHour: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        visitors: Math.floor(Math.random() * 50) + (hour >= 9 && hour <= 21 ? 30 : 5),
      })),
      recentVisitors: [],
    };
  }
}

export const analyticsService = new AnalyticsService();
