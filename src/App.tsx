// ============================================
// ComES Website - Main App Component
// ============================================

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout';
import { LoadingScreen } from '@/components/ui';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { initializeTheme } from '@/store';
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
} from '@/pages/admin';

// Initialize theme on app load
initializeTheme();

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
          <Route path="/events" element={<EventsPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
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
          <Route path="blog" element={<BlogManagementPage />} />
          <Route path="events" element={<EventsManagementPage />} />
          <Route path="projects" element={<ProjectsManagementPage />} />
          <Route path="team" element={<TeamManagementPage />} />
          <Route path="contacts" element={<AdminContactsPage />} />
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
