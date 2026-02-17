// ============================================
// ComES Website - Main App Component
// ============================================

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout';
import { LoadingScreen, CustomCursor, CookieConsent, ToastContainer } from '@/components/ui';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { initializeTheme, initializeCookies } from '@/store';
import {
  HomePage,
  AboutPage,
  EventsPage,
  TeamPage,
  ProjectsPage,
  GalleryPage,
  BlogPage,
  ContactPage,
  FAQPage,
  NotFoundPage,
  StudentRegisterPage,
  StudentLoginPage,
  StudentPortfolioPage,
  StudentDashboardPage,
  StudentProfilePage,
  StudentEventsPage,
  StudentSettingsPage,
  StudentTeamsPage,
  SoftwareEngineeringPage,
  AIDataSciencePage,
  EmbeddedElectronicsPage,
  NetworkSecurityPage,
} from '@/pages';
import {
  AdminLayout,
  LoginPage as AdminLoginPage,
  DashboardPage,
  BlogManagementPage,
  EventsManagementPage,
  ProjectsManagementPage,
  TeamManagementPage,
  ContactsPage as AdminContactsPage,
  NewsletterPage,
  SettingsPage,
  AnalyticsPage,
  MembersManagementPage,
  NotificationsPage,
} from '@/pages/admin';

// Initialize theme and cookies on app load
initializeTheme();
initializeCookies();

// Animated Routes Component
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
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
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
        </Route>

        {/* Student Registration Route (public) */}
        <Route path="/register" element={<StudentRegisterPage />} />

        {/* Student Login Route (public) */}
        <Route path="/login" element={<StudentLoginPage />} />

        {/* Student Portfolio Route (public) */}
        <Route path="/portfolio/:username" element={<StudentPortfolioPage />} />

        {/* Student Dashboard Routes */}
        <Route path="/student/dashboard" element={<StudentDashboardPage />} />
        <Route path="/student/profile" element={<StudentProfilePage />} />
        <Route path="/student/events" element={<StudentEventsPage />} />
        <Route path="/student/settings" element={<StudentSettingsPage />} />
        <Route path="/student/teams" element={<StudentTeamsPage />} />
        <Route path="/student/quizzes" element={<StudentDashboardPage />} />
        <Route path="/student/certificates" element={<StudentDashboardPage />} />
        <Route path="/student/resources" element={<StudentDashboardPage />} />

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
          <Route path="projects" element={<ProjectsManagementPage />} />
          <Route path="team" element={<TeamManagementPage />} />
          <Route path="contacts" element={<AdminContactsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="newsletter" element={<NewsletterPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    // Check if user has already visited (skip loading on subsequent visits)
    const hasVisited = sessionStorage.getItem('comes-visited');
    if (hasVisited) {
      setIsLoading(false);
      setShowApp(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    sessionStorage.setItem('comes-visited', 'true');
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
          <AnimatedRoutes />
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
