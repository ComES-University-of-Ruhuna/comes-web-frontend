// ============================================
// ComES Website - Quiz Service
// ============================================

import api, { type ApiResponse } from "./api";

// ── Types ──────────────────────────────────────

export interface QuizAnswer {
  text: string;
  isCorrect?: boolean;
}

export interface QuizQuestion {
  _id: string;
  questionText: string;
  imageUrl?: string;
  answers: QuizAnswer[];
  timeLimitSeconds: number;
  marks: number;
}

export interface ApiQuiz {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  questions: QuizQuestion[];
  totalMarks: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionResponseItem {
  questionId: string;
  selectedAnswerIndex: number;
  responseTimeSeconds: number;
  isCorrect?: boolean;
  marksAwarded?: number;
}

export interface ApiQuizAttempt {
  _id: string;
  quizId: string;
  studentId: string;
  participantName: string;
  responses: QuestionResponseItem[];
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuizFilters {
  page?: number;
  limit?: number;
  search?: string;
  includeHidden?: boolean;
  sort?: string;
}

export interface QuizAttemptFilters {
  page?: number;
  limit?: number;
  sort?: "recent";
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface CreateQuizData {
  title: string;
  description?: string;
  questions: Omit<QuizQuestion, "_id">[];
  isVisible?: boolean;
}

export interface UpdateQuizData {
  title?: string;
  description?: string;
  questions?: Omit<QuizQuestion, "_id">[];
  isVisible?: boolean;
}

export interface SubmitAttemptData {
  responses: {
    questionId: string;
    selectedAnswerIndex: number;
    responseTimeSeconds: number;
  }[];
}

// ── Service ────────────────────────────────────

export const quizService = {
  // ── Public ──────────────────────────────────

  /** Get all visible quizzes (paginated, searchable) */
  getAll: async (
    filters?: QuizFilters,
  ): Promise<ApiResponse<{ quizzes: ApiQuiz[]; pagination: PaginationMeta }>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await api.get<ApiResponse<{ quizzes: ApiQuiz[]; pagination: PaginationMeta }>>(
      `/quizzes?${params}`,
    );
    return response.data;
  },

  /** Get a quiz by ID */
  getById: async (id: string): Promise<ApiResponse<{ quiz: ApiQuiz }>> => {
    const response = await api.get<ApiResponse<{ quiz: ApiQuiz }>>(`/quizzes/${id}`);
    return response.data;
  },

  // ── Admin ───────────────────────────────────

  /** Create a new quiz (admin) */
  create: async (data: CreateQuizData): Promise<ApiResponse<{ quiz: ApiQuiz }>> => {
    const response = await api.post<ApiResponse<{ quiz: ApiQuiz }>>("/quizzes", data);
    return response.data;
  },

  /** Update a quiz (admin) */
  update: async (id: string, data: UpdateQuizData): Promise<ApiResponse<{ quiz: ApiQuiz }>> => {
    const response = await api.patch<ApiResponse<{ quiz: ApiQuiz }>>(`/quizzes/${id}`, data);
    return response.data;
  },

  /** Delete a quiz and all its attempts (admin) */
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/quizzes/${id}`);
    return response.data;
  },

  /** Toggle quiz visibility (admin) */
  toggleVisibility: async (
    id: string,
    isVisible?: boolean,
  ): Promise<ApiResponse<{ quiz: ApiQuiz }>> => {
    const body = isVisible !== undefined ? { isVisible } : {};
    const response = await api.patch<ApiResponse<{ quiz: ApiQuiz }>>(
      `/quizzes/${id}/visibility`,
      body,
    );
    return response.data;
  },

  /** Get all attempts for a quiz (admin) */
  getAttempts: async (
    quizId: string,
    filters?: QuizAttemptFilters,
  ): Promise<ApiResponse<{ attempts: ApiQuizAttempt[]; pagination: PaginationMeta }>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await api.get<
      ApiResponse<{ attempts: ApiQuizAttempt[]; pagination: PaginationMeta }>
    >(`/quizzes/${quizId}/attempts?${params}`);
    return response.data;
  },

  // ── Student ─────────────────────────────────

  /** Submit a quiz attempt (student) */
  submitAttempt: async (
    quizId: string,
    data: SubmitAttemptData,
  ): Promise<ApiResponse<{ attempt: ApiQuizAttempt }>> => {
    const response = await api.post<ApiResponse<{ attempt: ApiQuizAttempt }>>(
      `/quizzes/${quizId}/attempt`,
      data,
    );
    return response.data;
  },
};
