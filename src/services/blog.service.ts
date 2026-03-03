// ============================================
// ComES Website - Blog Service
// ============================================

import api, { type ApiResponse, type PaginatedData } from "./api";

export interface ApiBlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
  category: string;
  tags: string[];
  image: string;
  readTime: number;
  status: "draft" | "published" | "archived";
  featured: boolean;
  likes: number;
  views: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFilters {
  category?: string;
  tag?: string;
  featured?: boolean;
  status?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export const blogService = {
  // Get all posts with optional filters
  getAll: async (filters?: BlogFilters): Promise<ApiResponse<PaginatedData<ApiBlogPost>>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await api.get<ApiResponse<PaginatedData<ApiBlogPost>>>(`/blog?${params}`);
    return response.data;
  },

  // Get featured posts
  getFeatured: async (): Promise<ApiResponse<{ posts: ApiBlogPost[] }>> => {
    const response = await api.get<ApiResponse<{ posts: ApiBlogPost[] }>>("/blog/featured");
    return response.data;
  },

  // Get categories
  getCategories: async (): Promise<ApiResponse<{ categories: string[] }>> => {
    const response = await api.get<ApiResponse<{ categories: string[] }>>("/blog/categories");
    return response.data;
  },

  // Get tags
  getTags: async (): Promise<ApiResponse<{ tags: string[] }>> => {
    const response = await api.get<ApiResponse<{ tags: string[] }>>("/blog/tags");
    return response.data;
  },

  // Get single post by ID
  getById: async (id: string): Promise<ApiResponse<{ post: ApiBlogPost }>> => {
    const response = await api.get<ApiResponse<{ post: ApiBlogPost }>>(`/blog/${id}`);
    return response.data;
  },

  // Get post by slug
  getBySlug: async (slug: string): Promise<ApiResponse<{ post: ApiBlogPost }>> => {
    const response = await api.get<ApiResponse<{ post: ApiBlogPost }>>(`/blog/slug/${slug}`);
    return response.data;
  },

  // Like a post
  like: async (postId: string): Promise<ApiResponse<{ likes: number }>> => {
    const response = await api.post<ApiResponse<{ likes: number }>>(`/blog/${postId}/like`);
    return response.data;
  },
};
