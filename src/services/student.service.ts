// ============================================
// ComES Website - Student Service
// ============================================

import api, { type ApiResponse } from './api';
import { STORAGE_KEYS } from '@/config';

export interface Student {
  _id: string;
  name: string;
  email: string;
  username: string;
  registrationNo: string;
  batch: string;
  semester?: number;
  contactNo?: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  github?: string;
  linkedin?: string;
  website?: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface StudentRegisterData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  registrationNo: string;
  contactNo?: string;
}

export interface StudentAuthResponse {
  student: Student;
  accessToken: string;
  refreshToken: string;
}

// Student token management
let studentAccessToken: string | null = localStorage.getItem(STORAGE_KEYS.studentAccessToken);

export const setStudentAccessToken = (token: string | null) => {
  studentAccessToken = token;
  if (token) {
    localStorage.setItem(STORAGE_KEYS.studentAccessToken, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.studentAccessToken);
  }
};

export const getStudentAccessToken = () => studentAccessToken;

// Validate registration number format: EG/20XX/XXXX
export const validateRegistrationNo = (regNo: string): { valid: boolean; error?: string } => {
  const pattern = /^EG\/20(2[0-9]|[3-9][0-9])\/\d{4}$/;
  
  if (!regNo) {
    return { valid: false, error: 'Registration number is required' };
  }
  
  if (!pattern.test(regNo)) {
    return { valid: false, error: 'Invalid format. Use EG/20XX/XXXX (e.g., EG/2020/1234)' };
  }
  
  // Extract year and validate it's not in the future
  const yearMatch = regNo.match(/EG\/(\d{4})\//);
  if (yearMatch) {
    const year = parseInt(yearMatch[1], 10);
    const currentYear = new Date().getFullYear();
    
    if (year < 2020) {
      return { valid: false, error: 'Year must be 2020 or later' };
    }
    
    if (year > currentYear) {
      return { valid: false, error: 'Year cannot be in the future' };
    }
  }
  
  return { valid: true };
};

// Extract batch from registration number
// EG/2021/XXXX → 23rd batch, EG/2022/XXXX → 24th batch, etc.
export const extractBatchFromRegNo = (regNo: string): string => {
  const match = regNo.match(/EG\/(\d{4})\//);
  if (!match) return '';
  
  const year = parseInt(match[1], 10);
  const batchNumber = year - 1998; // 2021 - 1998 = 23
  
  // Add ordinal suffix
  const suffix = getOrdinalSuffix(batchNumber);
  return `${batchNumber}${suffix}`;
};

// Helper to get ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
const getOrdinalSuffix = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};

export const studentService = {
  // Register new student
  register: async (data: StudentRegisterData): Promise<ApiResponse<StudentAuthResponse>> => {
    const response = await api.post<ApiResponse<StudentAuthResponse>>('/students/register', data);
    if (response.data.data) {
      setStudentAccessToken(response.data.data.accessToken);
      localStorage.setItem(STORAGE_KEYS.studentRefreshToken, response.data.data.refreshToken);
    }
    return response.data;
  },

  // Login student
  login: async (credentials: { email: string; password: string }): Promise<ApiResponse<StudentAuthResponse>> => {
    const response = await api.post<ApiResponse<StudentAuthResponse>>('/students/login', credentials);
    if (response.data.data) {
      setStudentAccessToken(response.data.data.accessToken);
      localStorage.setItem(STORAGE_KEYS.studentRefreshToken, response.data.data.refreshToken);
    }
    return response.data;
  },

  // Logout student
  logout: async (): Promise<void> => {
    setStudentAccessToken(null);
    localStorage.removeItem(STORAGE_KEYS.studentRefreshToken);
  },

  // Get student profile
  getProfile: async (): Promise<ApiResponse<{ student: Student }>> => {
    const response = await api.get<ApiResponse<{ student: Student }>>('/students/me');
    return response.data;
  },

  // Update student profile
  updateProfile: async (data: Partial<Student>): Promise<ApiResponse<{ student: Student }>> => {
    const response = await api.patch<ApiResponse<{ student: Student }>>('/students/me', data);
    return response.data;
  },

  // Verify student email
  verifyEmail: async (token: string): Promise<ApiResponse<null>> => {
    const response = await api.get<ApiResponse<null>>(`/students/verify-email/${token}`);
    return response.data;
  },

  // Get all students (admin only)
  getAllStudents: async (params?: {
    page?: number;
    limit?: number;
    batch?: string;
    search?: string;
  }): Promise<ApiResponse<{ students: Student[]; total: number; page: number; pages: number }>> => {
    const response = await api.get<ApiResponse<{ students: Student[]; total: number; page: number; pages: number }>>(
      '/students',
      { params }
    );
    return response.data;
  },

  // Change password
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>('/students/change-password', data);
    return response.data;
  },

  // Get student's registered events
  getMyEvents: async (): Promise<ApiResponse<{ events: Array<{ _id: string; title: string; date: string; status: string }> }>> => {
    const response = await api.get<ApiResponse<{ events: Array<{ _id: string; title: string; date: string; status: string }> }>>('/students/my-events');
    return response.data;
  },

  // Register for an event
  registerForEvent: async (eventId: string): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>(`/students/events/${eventId}/register`);
    return response.data;
  },

  // Unregister from an event
  unregisterFromEvent: async (eventId: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/students/events/${eventId}/unregister`);
    return response.data;
  },

  // Delete student account
  deleteAccount: async (): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>('/students/me');
    return response.data;
  },
};
