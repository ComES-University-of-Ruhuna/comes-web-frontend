// ============================================
// ComES Website - API Hooks
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { eventsService, projectsService, blogService, teamService, contactService, newsletterService } from '@/services';
import type { ApiEvent, EventFilters, ApiProject, ProjectFilters, ApiBlogPost, BlogFilters, ApiTeamMember, TeamFilters } from '@/services';

// Generic async state hook
interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// ==================== Events Hooks ====================

export function useEvents(filters?: EventFilters): AsyncState<ApiEvent[]> & { pagination: { page: number; pages: number; total: number } | null } {
  const [data, setData] = useState<ApiEvent[] | null>(null);
  const [pagination, setPagination] = useState<{ page: number; pages: number; total: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await eventsService.getAll(filters);
      if (response.data) {
        setData(response.data.items);
        setPagination({
          page: response.data.pagination.page,
          pages: response.data.pagination.pages,
          total: response.data.pagination.total,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch, pagination };
}

export function useFeaturedEvents(): AsyncState<ApiEvent[]> {
  const [data, setData] = useState<ApiEvent[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await eventsService.getFeatured();
      if (response.data) {
        setData(response.data.events);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch featured events');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useEventRegistration() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (eventId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await eventsService.register(eventId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const unregister = async (eventId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await eventsService.unregister(eventId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unregister');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { register, unregister, isLoading, error };
}

// ==================== Projects Hooks ====================

export function useProjects(filters?: ProjectFilters): AsyncState<ApiProject[]> & { pagination: { page: number; pages: number; total: number } | null } {
  const [data, setData] = useState<ApiProject[] | null>(null);
  const [pagination, setPagination] = useState<{ page: number; pages: number; total: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await projectsService.getAll(filters);
      if (response.data) {
        setData(response.data.items);
        setPagination({
          page: response.data.pagination.page,
          pages: response.data.pagination.pages,
          total: response.data.pagination.total,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch, pagination };
}

export function useFeaturedProjects(): AsyncState<ApiProject[]> {
  const [data, setData] = useState<ApiProject[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await projectsService.getFeatured();
      if (response.data) {
        setData(response.data.projects);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch featured projects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useProjectCategories(): AsyncState<string[]> {
  const [data, setData] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await projectsService.getCategories();
      if (response.data) {
        setData(response.data.categories);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

// ==================== Blog Hooks ====================

export function useBlogPosts(filters?: BlogFilters): AsyncState<ApiBlogPost[]> & { pagination: { page: number; pages: number; total: number } | null } {
  const [data, setData] = useState<ApiBlogPost[] | null>(null);
  const [pagination, setPagination] = useState<{ page: number; pages: number; total: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await blogService.getAll(filters);
      if (response.data) {
        setData(response.data.items);
        setPagination({
          page: response.data.pagination.page,
          pages: response.data.pagination.pages,
          total: response.data.pagination.total,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blog posts');
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch, pagination };
}

export function useFeaturedBlogPosts(): AsyncState<ApiBlogPost[]> {
  const [data, setData] = useState<ApiBlogPost[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await blogService.getFeatured();
      if (response.data) {
        setData(response.data.posts);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch featured posts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

// ==================== Team Hooks ====================

export function useTeamMembers(filters?: TeamFilters): AsyncState<ApiTeamMember[]> {
  const [data, setData] = useState<ApiTeamMember[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await teamService.getAll(filters);
      if (response.data) {
        setData(response.data.members);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch team members');
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

// ==================== Contact Hook ====================

export function useContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (data: { name: string; email: string; subject: string; message: string }): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      await contactService.submit(data);
      setIsSubmitted(true);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit contact form');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setIsSubmitted(false);
    setError(null);
  };

  return { submit, isSubmitting, isSubmitted, error, reset };
}

// ==================== Newsletter Hook ====================

export function useNewsletter() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribe = async (email: string, name?: string): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      await newsletterService.subscribe({ email, name });
      setIsSubscribed(true);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setIsSubscribed(false);
    setError(null);
  };

  return { subscribe, isSubmitting, isSubscribed, error, reset };
}
