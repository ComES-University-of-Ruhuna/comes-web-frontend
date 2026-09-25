// ============================================
// ComES Website - Main App Component
// ============================================

import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Outlet, Navigate, useLocation } from "react-router";
import { AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout";
import { LoadingScreen, CustomCursor, CookieConsent, ToastContainer } from "@/components/ui";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { initializeTheme, initializeCookies, useAuthStore, useStudentStore } from "@/store";
import { HomePage } from "@/pages/HomePage";
import { AboutPage } from "@/pages/AboutPage";
import { EventsPage } from "@/pages/EventsPage";
import { TeamPage } from "@/pages/TeamPage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { GalleryPage } from "@/pages/GalleryPage";
import { BlogPage } from "@/pages/BlogPage";
import { BlogPostPage } from "@/pages/BlogPostPage";
import { ContactPage } from "@/pages/ContactPage";
import { FAQPage } from "@/pages/FAQPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { UnderMaintenancePage } from "@/pages/UnderMaintenancePage";
import { StudentRegisterPage } from "@/pages/StudentRegisterPage";
import { StudentLoginPage } from "@/pages/StudentLoginPage";
import { StudentPortfolioPage } from "@/pages/StudentPortfolioPage";
import { PasswordRecoveryPage } from "@/pages/PasswordRecoveryPage";
import {
  SoftwareEngineeringPage,
  AIDataSciencePage,
  EmbeddedElectronicsPage,
  NetworkSecurityPage,
} from "@/pages/subgroups";

const StudentDashboardPage = lazy(() =>
  import("@/pages/student").then((pages) => ({ default: pages.StudentDashboardPage })),
);
const StudentOrganizingPage = lazy(() =>
  import("@/pages/student/OrganizingPage").then((pages) => ({ default: pages.OrganizingPage })),
);
const OrganizingWorkspace = lazy(() =>
  import("@/components/events/OrganizingWorkspace").then((components) => ({
    default: components.OrganizingWorkspace,
  })),
);
const StudentProfilePage = lazy(() =>
  import("@/pages/student").then((pages) => ({ default: pages.StudentProfilePage })),
);
const StudentEventsPage = lazy(() =>
  import("@/pages/student").then((pages) => ({ default: pages.StudentEventsPage })),
);
const StudentSettingsPage = lazy(() =>
  import("@/pages/student").then((pages) => ({ default: pages.StudentSettingsPage })),
);
const StudentTeamsPage = lazy(() =>
  import("@/pages/student").then((pages) => ({ default: pages.StudentTeamsPage })),
);
const StudentQuizzesPage = lazy(() =>
  import("@/pages/student").then((pages) => ({ default: pages.StudentQuizzesPage })),
);
const StudentQuizTakePage = lazy(() =>
  import("@/pages/student").then((pages) => ({ default: pages.StudentQuizTakePage })),
);
const StudentCertificatesPage = lazy(() =>
  import("@/pages/student").then((pages) => ({ default: pages.StudentCertificatesPage })),
);
const StudentResourcesPage = lazy(() =>
  import("@/pages/student").then((pages) => ({ default: pages.StudentResourcesPage })),
);
const AdminLayout = lazy(() =>
  import("@/pages/admin").then((pages) => ({ default: pages.AdminLayout })),
);
const AdminLoginPage = lazy(() =>
  import("@/pages/admin").then((pages) => ({ default: pages.LoginPage })),
);
const DashboardPage = lazy(() =>
  import("@/pages/admin").then((pages) => ({ default: pages.DashboardPage })),
);
const BlogManagementPage = lazy(() =>
  import("@/pages/admin").then((pages) => ({ default: pages.BlogManagementPage })),
);
const EventsManagementPage = lazy(() =>
  import("@/pages/admin").then((pages) => ({ default: pages.EventsManagementPage })),
);
const ProjectsManagementPage = lazy(() =>
  import("@/pages/admin").then((pages) => ({ default: pages.ProjectsManagementPage })),
);
const TeamManagementPage = lazy(() =>
  import("@/pages/admin").then((pages) => ({ default: pages.TeamManagementPage })),
);
const AdminContactsPage = lazy(() =>
  import("@/pages/admin").then((pages) => ({ default: pages.ContactsPage })),
);
const NewsletterPage = lazy(() =>
  import("@/pages/admin").then((pages) => ({ default: pages.NewsletterPage })),
);
const AnalyticsPage = lazy(() =>
  import("@/pages/admin").then((pages) => ({ default: pages.AnalyticsPage })),
);
const MembersManagementPage = lazy(() =>
  import("@/pages/admin").then((pages) => ({ default: pages.MembersManagementPage })),
);
const NotificationsPage = lazy(() =>
  import("@/pages/admin").then((pages) => ({ default: pages.NotificationsPage })),
);
const QuizManagementPage = lazy(() =>
  import("@/pages/admin").then((pages) => ({ default: pages.QuizManagementPage })),
);

// Initialize theme and cookies on app load
initializeTheme();
initializeCookies();

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Animated Routes Component
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location}>
          {/* Public Routes */}

          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            {/* <Route path="/" element={<NotFoundPage />} /> */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/subgroups/software-engineering" element={<SoftwareEngineeringPage />} />
            <Route path="/subgroups/ai-data-science" element={<AIDataSciencePage />} />
            <Route path="/subgroups/embedded-electronics" element={<EmbeddedElectronicsPage />} />
            <Route path="/subgroups/network-security" element={<NetworkSecurityPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/maintenance" element={<UnderMaintenancePage />} />
          </Route>

          {/* Student Registration Route (public) */}
          <Route path="/register" element={<StudentRegisterPage />} />

          {/* Student Login Route (public) */}
          <Route path="/login" element={<StudentLoginPage />} />
          <Route
            path="/forgot-password"
            element={<PasswordRecoveryPage key={location.pathname + location.search} />}
          />
          <Route
            path="/reset-password/:token"
            element={<PasswordRecoveryPage key={location.pathname + location.search} />}
          />

          {/* Student Portfolio Route (public) */}
          <Route path="/portfolio/:username" element={<StudentPortfolioPage />} />

          {/* Student Dashboard Routes */}
          <Route
            element={
              <ProtectedRoute requireStudent>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/student/dashboard" element={<StudentDashboardPage />} />
            <Route path="/student/profile" element={<StudentProfilePage />} />
            <Route path="/student/events" element={<StudentEventsPage />} />
            <Route path="/student/organizing" element={<StudentOrganizingPage />} />
            <Route path="/student/organizing/:id" element={<StudentOrganizingPage />} />
            <Route path="/student/settings" element={<StudentSettingsPage />} />
            <Route path="/student/teams" element={<StudentTeamsPage />} />
            <Route path="/student/quizzes" element={<StudentQuizzesPage />} />
            <Route path="/student/quizzes/:id" element={<StudentQuizTakePage />} />
            <Route path="/student/certificates" element={<StudentCertificatesPage />} />
            <Route path="/student/resources" element={<StudentResourcesPage />} />
          </Route>

          {/* Admin Login Route (public) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="members" element={<MembersManagementPage />} />
            <Route path="blog" element={<BlogManagementPage />} />
            <Route path="events" element={<EventsManagementPage />} />
            <Route path="events/:id/committee" element={<OrganizingWorkspace mode="admin" />} />
            <Route path="projects" element={<ProjectsManagementPage />} />
            <Route path="team" element={<TeamManagementPage />} />
            <Route path="contacts" element={<AdminContactsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="newsletter" element={<NewsletterPage />} />
            <Route path="quizzes" element={<QuizManagementPage />} />
            <Route path="settings" element={<Navigate to="/admin" replace />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showApp, setShowApp] = useState(false);
  const { checkAuth } = useAuthStore();
  const checkStudentAuth = useStudentStore((state) => state.checkAuth);

  useEffect(() => {
    // Check if user has already visited (skip loading on subsequent visits)
    const hasVisited = sessionStorage.getItem("comes-visited");
    if (hasVisited) {
      setIsLoading(false);
      setShowApp(true);
    }
  }, []);

  // Proactively validate/refresh the admin session on every app load
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      checkAuth();
    }
    checkStudentAuth();
  }, [checkAuth, checkStudentAuth]);

  const handleLoadingComplete = () => {
    sessionStorage.setItem("comes-visited", "true");
    setIsLoading(false);
    setTimeout(() => setShowApp(true), 100);
  };

  return (
    <>
      <CustomCursor />
      <CookieConsent />
      <ToastContainer />
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      {showApp && (
        <BrowserRouter>
          <Suspense
            fallback={
              <div role="status" className="flex min-h-screen items-center justify-center">
                Loading...
              </div>
            }
          >
            <AnimatedRoutes />
          </Suspense>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
