// ============================================
// ComES Website - Projects Service
// ============================================

import api, { type ApiResponse, type PaginatedData } from "./api";

export interface ApiProject {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  status: "planning" | "in-progress" | "completed" | "on-hold";
  image: string;
  images: string[];
  technologies: string[];
  team: Array<{
    name: string;
    role: string;
    avatar?: string;
  }>;
  startDate: string;
  endDate?: string;
  githubUrl?: string;
  liveUrl?: string;
  demoUrl?: string;
  featured: boolean;
  likes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFilters {
  category?: string;
  status?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}

export const projectsService = {
  // Get all projects with optional filters
  getAll: async (filters?: ProjectFilters): Promise<ApiResponse<PaginatedData<ApiProject>>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await api.get<ApiResponse<PaginatedData<ApiProject>>>(`/projects?${params}`);
    return response.data;
  },

  // Get featured projects
  getFeatured: async (): Promise<ApiResponse<{ projects: ApiProject[] }>> => {
    const response = await api.get<ApiResponse<{ projects: ApiProject[] }>>("/projects/featured");
    return response.data;
  },

  // Get categories
  getCategories: async (): Promise<ApiResponse<{ categories: string[] }>> => {
    const response = await api.get<ApiResponse<{ categories: string[] }>>("/projects/categories");
    return response.data;
  },

  // Get single project by ID
  getById: async (id: string): Promise<ApiResponse<{ project: ApiProject }>> => {
    const response = await api.get<ApiResponse<{ project: ApiProject }>>(`/projects/${id}`);
    return response.data;
  },

  // Get project by slug
  getBySlug: async (slug: string): Promise<ApiResponse<{ project: ApiProject }>> => {
    const response = await api.get<ApiResponse<{ project: ApiProject }>>(`/projects/slug/${slug}`);
    return response.data;
  },

  // Like a project
  like: async (projectId: string): Promise<ApiResponse<{ likes: number }>> => {
    const response = await api.post<ApiResponse<{ likes: number }>>(`/projects/${projectId}/like`);
    return response.data;
  },
};
