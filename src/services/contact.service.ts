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

export const contactService = {
  // Submit contact form
  submit: async (data: ContactFormData): Promise<ApiResponse<{ contact: ContactSubmission }>> => {
    const response = await api.post<ApiResponse<{ contact: ContactSubmission }>>("/contact", data);
    return response.data;
  },
};
