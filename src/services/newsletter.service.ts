// ============================================
// ComES Website - Newsletter Service
// ============================================

import api, { type ApiResponse } from './api';

export interface NewsletterSubscription {
  _id: string;
  email: string;
  name?: string;
  isActive: boolean;
  subscribedAt: string;
}

export const newsletterService = {
  // Subscribe to newsletter
  subscribe: async (data: { email: string; name?: string }): Promise<ApiResponse<{ subscription: NewsletterSubscription }>> => {
    const response = await api.post<ApiResponse<{ subscription: NewsletterSubscription }>>('/newsletter/subscribe', data);
    return response.data;
  },

  // Unsubscribe from newsletter
  unsubscribe: async (data: { email?: string; token?: string }): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>('/newsletter/unsubscribe', data);
    return response.data;
  },
};
