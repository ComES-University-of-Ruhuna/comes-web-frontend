// ============================================
// ComES Website - Configuration
// ============================================

// API Configuration - Single place to change backend URL
export const API_CONFIG = {
  // Base URL for the API - change this when deploying to production
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  
  // Request timeout in milliseconds
  timeout: 10000,
  
  // Whether to include credentials (cookies) in requests
  withCredentials: true,
} as const;

// App Configuration
export const APP_CONFIG = {
  // App name
  name: 'ComES',
  fullName: 'Computer Engineering Society',
  
  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // Version
  version: '1.0.0',
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  studentAccessToken: 'studentAccessToken',
  studentRefreshToken: 'studentRefreshToken',
  sessionId: 'comes-session-id',
} as const;

export default {
  api: API_CONFIG,
  app: APP_CONFIG,
  storage: STORAGE_KEYS,
};
