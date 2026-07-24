// ============================================
// ComES Website - Student Store (Zustand)
// ============================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isAxiosError } from "axios";
import { studentService, type Student, type StudentRegisterData } from "@/services/student.service";
import { setStudentAccessToken } from "@/services/student.service";

interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: Array<{ msg?: string }>;
}

const getAuthErrorMessage = (error: unknown, fallback: string): string => {
  if (!isAxiosError<ApiErrorResponse>(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  if (error.code === "ERR_NETWORK") {
    return "Unable to connect to the server. Please try again shortly.";
  }

  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.response?.data?.errors?.[0]?.msg ||
    fallback
  );
};

interface StudentState {
  student: Student | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  register: (data: StudentRegisterData) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  updateStudent: (student: Student) => void;
}

export const useStudentStore = create<StudentState>()(
  persist(
    (set) => ({
      student: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await studentService.login(credentials);

          if (response.success && response.data) {
            set({
              student: response.data.student,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          }

          set({ isLoading: false, error: response.message || "Login failed" });
          return false;
        } catch (error) {
          set({ isLoading: false, error: getAuthErrorMessage(error, "Login failed") });
          return false;
        }
      },

      register: async (data: StudentRegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await studentService.register(data);
          if (response.success && response.data) {
            setStudentAccessToken(response.data.accessToken);
            localStorage.setItem("studentRefreshToken", response.data.refreshToken);
            set({
              student: response.data.student,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          }
          set({ isLoading: false, error: response.message || "Registration failed" });
          return false;
        } catch (error) {
          set({
            isLoading: false,
            error: getAuthErrorMessage(error, "Registration failed"),
          });
          return false;
        }
      },

      logout: () => {
        setStudentAccessToken(null);
        localStorage.removeItem("studentRefreshToken");
        set({
          student: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      checkAuth: async () => {
        const token = localStorage.getItem("studentRefreshToken");
        if (!token) {
          set({ isAuthenticated: false, student: null });
          return;
        }

        set({ isLoading: true });
        try {
          const response = await studentService.getProfile();
          if (response.success && response.data) {
            set({
              student: response.data.student,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({ isAuthenticated: false, student: null, isLoading: false });
          }
        } catch {
          set({ isAuthenticated: false, student: null, isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
      updateStudent: (student: Student) => set({ student }),
    }),
    {
      name: "student-auth-storage",
      partialize: (state) => ({
        student: state.student,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
