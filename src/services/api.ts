// ============================================
// ComES Website - API Client Configuration
// ============================================

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_CONFIG, STORAGE_KEYS } from "@/config";

// Create axios instance with centralized config
const api = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: API_CONFIG.timeout,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: API_CONFIG.withCredentials,
});

// Token management
let accessToken: string | null = localStorage.getItem(STORAGE_KEYS.accessToken);
let studentAccessToken: string | null = localStorage.getItem(STORAGE_KEYS.studentAccessToken);

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (token) {
    localStorage.setItem(STORAGE_KEYS.accessToken, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.accessToken);
  }
};

export const setStudentAccessToken = (token: string | null) => {
  studentAccessToken = token;
  if (token) {
    localStorage.setItem(STORAGE_KEYS.studentAccessToken, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.studentAccessToken);
  }
};

export const getAccessToken = () => accessToken;
export const getStudentAccessToken = () => studentAccessToken;

// Request interceptor - add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Check if this is a student-specific endpoint (me, my-events, etc.)
    // Admin endpoints to /students (GET all, DELETE, notify) should use admin token
    const isStudentAuthEndpoint =
      config.url?.includes("/students/me") ||
      config.url?.includes("/students/my-") ||
      config.url?.includes("/students/events/") ||
      config.url?.includes("/students/change-password") ||
      config.url?.includes("/students/search") ||
      (config.url?.includes("/quizzes/") &&
        config.url?.includes("/attempt") &&
        config.method === "post");

    const token = isStudentAuthEndpoint ? studentAccessToken : accessToken;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 and not already retrying, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
        if (refreshToken) {
          const response = await axios.post(
            `${API_CONFIG.baseUrl}/auth/refresh-token`,
            {
              refreshToken,
            },
            { withCredentials: true },
          );

          const { token } = response.data.data;
          setAccessToken(token);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        }
      } catch {
        // Refresh failed - clear tokens and redirect to login
        setAccessToken(null);
        localStorage.removeItem(STORAGE_KEYS.refreshToken);
        window.dispatchEvent(new CustomEvent("auth:logout"));
      }
    }

    return Promise.reject(error);
  },
);

export default api;

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
