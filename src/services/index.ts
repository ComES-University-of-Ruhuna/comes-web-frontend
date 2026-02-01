// ============================================
// ComES Website - Services Index
// ============================================

export { default as api, setAccessToken, getAccessToken } from './api';
export type { ApiResponse, PaginatedData } from './api';

export { authService } from './auth.service';
export type { User, LoginCredentials, RegisterData, AuthResponse } from './auth.service';

export { eventsService } from './events.service';
export type { ApiEvent, EventFilters } from './events.service';

export { projectsService } from './projects.service';
export type { ApiProject, ProjectFilters } from './projects.service';

export { blogService } from './blog.service';
export type { ApiBlogPost, BlogFilters } from './blog.service';

export { teamService } from './team.service';
export type { ApiTeamMember, TeamFilters } from './team.service';

export { contactService } from './contact.service';
export type { ContactFormData, ContactSubmission } from './contact.service';

export { newsletterService } from './newsletter.service';
export type { NewsletterSubscription } from './newsletter.service';
