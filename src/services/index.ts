// ============================================
// ComES Website - Services Index
// ============================================

export { default as api, setAccessToken, getAccessToken } from "./api";
export type { ApiResponse, PaginatedData } from "./api";

export { authService } from "./auth.service";
export type { User, LoginCredentials, RegisterData, AuthResponse } from "./auth.service";

export { eventsService } from "./events.service";
export type { ApiEvent, EventFilters } from "./events.service";

export { projectsService } from "./projects.service";
export type { ApiProject, ProjectFilters } from "./projects.service";

export { blogService } from "./blog.service";
export type { ApiBlogPost, BlogFilters } from "./blog.service";

export { teamService } from "./team.service";
export type { ApiTeamMember, TeamFilters } from "./team.service";

export { contactService } from "./contact.service";
export type { ContactFormData, ContactSubmission } from "./contact.service";

export { newsletterService } from "./newsletter.service";
export type { NewsletterSubscription } from "./newsletter.service";

export {
  studentService,
  validateRegistrationNo,
  extractBatchFromRegNo,
  setStudentAccessToken,
  getStudentAccessToken,
} from "./student.service";
export type { Student, StudentRegisterData, StudentAuthResponse } from "./student.service";

export { analyticsService } from "./analytics.service";
export type {
  VisitorData,
  PageView,
  AnalyticsSummary,
  AnalyticsFilters,
} from "./analytics.service";

export { competitionTeamService } from "./competitionTeam.service";
export type { CreateCompetitionTeamData, StudentSearchResult } from "./competitionTeam.service";

export { quizService } from "./quiz.service";
export type {
  ApiQuiz,
  ApiQuizAttempt,
  QuizQuestion,
  QuizAnswer,
  QuizFilters,
  CreateQuizData,
  UpdateQuizData,
  SubmitAttemptData,
} from "./quiz.service";
