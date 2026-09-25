// ============================================
// ComES Website - Contact Service
// ============================================

import api, { type ApiResponse } from "./api";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

export interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  status: "new" | "read" | "replied" | "archived";
  createdAt: string;
}

export interface ContactList {
  contacts: ContactSubmission[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export const contactService = {
  // Submit contact form
  submit: async (data: ContactFormData): Promise<ApiResponse<{ id: string }>> => {
    const response = await api.post<ApiResponse<{ id: string }>>("/contact", data);
    return response.data;
  },
  list: async (params: {
    page: number;
    limit: number;
    search?: string;
    status?: ContactSubmission["status"];
  }): Promise<ApiResponse<ContactList>> => {
    const response = await api.get<ApiResponse<ContactList>>("/contact", { params });
    return response.data;
  },
  get: async (id: string): Promise<ApiResponse<{ contact: ContactSubmission }>> => {
    const response = await api.get<ApiResponse<{ contact: ContactSubmission }>>(`/contact/${id}`);
    return response.data;
  },
  updateStatus: async (
    id: string,
    status: ContactSubmission["status"],
  ): Promise<ApiResponse<{ contact: ContactSubmission }>> => {
    const response = await api.patch<ApiResponse<{ contact: ContactSubmission }>>(
      `/contact/${id}`,
      { status },
    );
    return response.data;
  },
  remove: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/contact/${id}`);
    return response.data;
  },
};
