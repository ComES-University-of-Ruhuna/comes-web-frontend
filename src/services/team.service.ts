// ============================================
// ComES Website - Team Service
// ============================================

import api, { type ApiResponse } from "./api";

export interface ApiTeamMember {
  _id: string;
  name: string;
  role: string;
  department:
    | "executive"
    | "technical"
    | "creative"
    | "marketing"
    | "events"
    | "finance"
    | "advisory";
  avatar?: string;
  bio?: string;
  email?: string;
  contactNo?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  batch: string;
  order: number;
  term: {
    start: string;
    end?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamFilters {
  department?: string;
  isActive?: boolean;
  batch?: string;
  includeInactive?: boolean;
}

export const teamDepartments = [
  { id: "executive", label: "Executive Committee" },
  { id: "advisory", label: "Faculty Advisors" },
  { id: "technical", label: "Technical" },
  { id: "creative", label: "Creative" },
  { id: "marketing", label: "Marketing" },
  { id: "events", label: "Events" },
  { id: "finance", label: "Finance" },
] as const;

export const teamService = {
  // Get all team members
  getAll: async (filters?: TeamFilters): Promise<ApiResponse<{ members: ApiTeamMember[] }>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await api.get<ApiResponse<{ members: ApiTeamMember[] }>>(`/team?${params}`);
    return response.data;
  },

  // Get members by department
  getByDepartment: async (
    department: string,
  ): Promise<ApiResponse<{ members: ApiTeamMember[] }>> => {
    const response = await api.get<ApiResponse<{ members: ApiTeamMember[] }>>(
      `/team/department/${department}`,
    );
    return response.data;
  },

  // Get single member
  getById: async (id: string): Promise<ApiResponse<{ member: ApiTeamMember }>> => {
    const response = await api.get<ApiResponse<{ member: ApiTeamMember }>>(`/team/${id}`);
    return response.data;
  },
};
