// ============================================
// ComES Website - Events Service
// ============================================

import api, { type ApiResponse, type PaginatedData } from "./api";

export interface ApiEvent {
  _id: string;
  title: string;
  slug: string;
  description: string;
  type: "workshop" | "hackathon" | "seminar" | "competition" | "social" | "other";
  date: string;
  endDate?: string;
  location: string;
  maxParticipants?: number;
  registeredCount: number;
  registrations: string[];
  isRegistrationOpen: boolean;
  availableSpots: number | null;
  image?: string;
  icon?: string;
  tags: string[];
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventFilters {
  type?: string;
  status?: string;
  featured?: boolean;
  upcoming?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}

export const eventsService = {
  // Get all events with optional filters
  getAll: async (filters?: EventFilters): Promise<ApiResponse<PaginatedData<ApiEvent>>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await api.get<
      ApiResponse<{ events: ApiEvent[]; pagination: PaginatedData<ApiEvent>["pagination"] }>
    >(`/events?${params}`);
    return {
      ...response.data,
      data: response.data.data && {
        items: response.data.data.events,
        pagination: response.data.data.pagination,
      },
    };
  },

  // Get featured events
  getFeatured: async (): Promise<ApiResponse<{ events: ApiEvent[] }>> => {
    const response = await api.get<ApiResponse<{ events: ApiEvent[] }>>("/events/featured");
    return response.data;
  },

  // Get single event by ID
  getById: async (id: string): Promise<ApiResponse<{ event: ApiEvent }>> => {
    const response = await api.get<ApiResponse<{ event: ApiEvent }>>(`/events/${id}`);
    return response.data;
  },

  // Get event by slug
  getBySlug: async (slug: string): Promise<ApiResponse<{ event: ApiEvent }>> => {
    const response = await api.get<ApiResponse<{ event: ApiEvent }>>(`/events/slug/${slug}`);
    return response.data;
  },

  // Register for event
  register: async (eventId: string): Promise<ApiResponse<{ event: ApiEvent }>> => {
    const response = await api.post<ApiResponse<{ event: ApiEvent }>>(
      `/events/${eventId}/register`,
    );
    return response.data;
  },

  // Unregister from event
  unregister: async (eventId: string): Promise<ApiResponse<{ event: ApiEvent }>> => {
    const response = await api.delete<ApiResponse<{ event: ApiEvent }>>(
      `/events/${eventId}/register`,
    );
    return response.data;
  },
};
