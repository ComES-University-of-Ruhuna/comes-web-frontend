// ============================================
// ComES Website - Student Dashboard Page
// ============================================

import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  User,
  Calendar,
  BookOpen,
  Award,
  Bell,
  Settings,
  FileText,
  Clock,
  ChevronRight,
  Sparkles,
  Users,
  UserPlus,
} from "lucide-react";
import { useStudentStore } from "@/store/studentStore";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";
import { Button, Badge, CreateTeamModal } from "@/components/ui";
import { Navbar, Footer } from "@/components/layout";

// Quick Stats Card
const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
  isDark,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  isDark: boolean;
}) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={cn(
      "rounded-2xl border p-6 transition-all",
      isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-200 bg-white shadow-sm",
    )}
  >
    <div className={cn("mb-4 flex h-12 w-12 items-center justify-center rounded-xl", color)}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <p className={cn("mb-1 text-sm", isDark ? "text-gray-400" : "text-gray-600")}>{label}</p>
    <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>{value}</p>
  </motion.div>
);

// Upcoming Events Card
const UpcomingEventCard = ({
  event,
  isDark,
}: {
  event: { title: string; date: string; type: string };
  isDark: boolean;
}) => (
  <div
    className={cn(
      "flex items-center gap-4 rounded-xl p-4 transition-all",
      isDark ? "bg-slate-800/50 hover:bg-slate-800" : "bg-gray-50 hover:bg-gray-100",
    )}
  >
    <div
      className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
        isDark ? "bg-blue-500/20" : "bg-blue-100",
      )}
    >
      <Calendar className={cn("h-5 w-5", isDark ? "text-blue-400" : "text-blue-600")} />
    </div>
    <div className="min-w-0 flex-1">
      <p className={cn("truncate font-medium", isDark ? "text-white" : "text-gray-900")}>
        {event.title}
      </p>
      <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>{event.date}</p>
    </div>
    <Badge variant="secondary" className="shrink-0">
      {event.type}
    </Badge>
  </div>
);

export const StudentDashboardPage = () => {
  const { student } = useStudentStore();
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);

  // Mock data - replace with real data later
  const upcomingEvents = [
    { title: "Web Development Workshop", date: "Feb 5, 2026 - 2:00 PM", type: "Workshop" },
    { title: "AI/ML Seminar", date: "Feb 10, 2026 - 10:00 AM", type: "Seminar" },
    { title: "Hackathon 2026", date: "Feb 15, 2026 - 9:00 AM", type: "Competition" },
  ];

  const quickLinks = [
    { icon: Users, label: "My Teams", href: "/student/teams", color: "bg-indigo-500" },
    { icon: BookOpen, label: "My Quizzes", href: "/student/quizzes", color: "bg-purple-500" },
    { icon: Calendar, label: "Events", href: "/events", color: "bg-blue-500" },
    {
      icon: Award,
      label: "Certificates",
      href: "/student/certificates",
      color: "bg-amber-500",
      badge: "Coming Soon",
    },
    {
      icon: FileText,
      label: "Resources",
      href: "/student/resources",
      color: "bg-green-500",
      badge: "Coming Soon",
    },
  ];

  return (
    <div
      className={cn(
        "font-comes flex min-h-screen flex-col transition-colors duration-300",
        isDark ? "bg-slate-950 text-gray-100" : "bg-white text-gray-900",
      )}
    >
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
        <div className={cn("min-h-screen pt-8 pb-12", isDark ? "bg-slate-950" : "bg-gray-50")}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Welcome Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1
                    className={cn(
                      "mb-2 text-3xl font-bold",
                      isDark ? "text-white" : "text-gray-900",
                    )}
                  >
                    Welcome back, {student?.name?.split(" ")[0] || "Student"}! 👋
                  </h1>
                  <p className={cn("text-lg", isDark ? "text-gray-400" : "text-gray-600")}>
                    {student?.registrationNo && (
                      <span className="mr-4">
                        <Badge variant="secondary">{student.registrationNo}</Badge>
                      </span>
                    )}
                    Here's what's happening with your ComES activities
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="primary"
                    className="gap-2"
                    onClick={() => setIsCreateTeamModalOpen(true)}
                  >
                    <UserPlus className="h-4 w-4" />
                    <span className="hidden sm:inline">Create Team</span>
                  </Button>
                  <Button variant="secondary" className="gap-2">
                    <Bell className="h-4 w-4" />
                    <span className="hidden sm:inline">Notifications</span>
                  </Button>
                  <Link to="/student/settings">
                    <Button variant="secondary" className="gap-2">
                      <Settings className="h-4 w-4" />
                      <span className="hidden sm:inline">Settings</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4"
            >
              <StatCard
                icon={Calendar}
                label="Events Attended"
                value={0}
                color="bg-blue-500"
                isDark={isDark}
              />
              <StatCard
                icon={BookOpen}
                label="Quizzes Completed"
                value={0}
                color="bg-purple-500"
                isDark={isDark}
              />
              <StatCard
                icon={Award}
                label="Certificates"
                value={0}
                color="bg-amber-500"
                isDark={isDark}
              />
              <StatCard
                icon={Clock}
                label="Hours Active"
                value={0}
                color="bg-green-500"
                isDark={isDark}
              />
            </motion.div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Main Content */}
              <div className="space-y-8 lg:col-span-2">
                {/* Quick Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2
                    className={cn(
                      "mb-4 text-xl font-semibold",
                      isDark ? "text-white" : "text-gray-900",
                    )}
                  >
                    Quick Links
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {quickLinks.map((link) => (
                      <Link key={link.label} to={link.href}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "flex cursor-pointer items-center gap-4 rounded-2xl border p-5 transition-all",
                            isDark
                              ? "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                              : "border-gray-200 bg-white hover:shadow-lg",
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-12 w-12 items-center justify-center rounded-xl",
                              link.color,
                            )}
                          >
                            <link.icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <p
                              className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}
                            >
                              {link.label}
                            </p>
                            {link.badge && (
                              <Badge variant="secondary" className="mt-1 text-xs">
                                {link.badge}
                              </Badge>
                            )}
                          </div>
                          <ChevronRight
                            className={cn("h-5 w-5", isDark ? "text-gray-500" : "text-gray-400")}
                          />
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </motion.div>

                {/* Upcoming Events */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h2
                      className={cn(
                        "text-xl font-semibold",
                        isDark ? "text-white" : "text-gray-900",
                      )}
                    >
                      Upcoming Events
                    </h2>
                    <Link to="/events">
                      <Button variant="ghost" size="sm" className="gap-1">
                        View all
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div
                    className={cn(
                      "overflow-hidden rounded-2xl border",
                      isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-200 bg-white",
                    )}
                  >
                    <div
                      className="divide-y"
                      style={{ borderColor: isDark ? "#334155" : "#e5e7eb" }}
                    >
                      {upcomingEvents.map((event, index) => (
                        <UpcomingEventCard key={index} event={event} isDark={isDark} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Profile Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={cn(
                    "rounded-2xl border p-6 text-center",
                    isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-200 bg-white",
                  )}
                >
                  <div
                    className={cn(
                      "mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold",
                      isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600",
                    )}
                  >
                    {student?.avatar ? (
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      student?.name?.charAt(0).toUpperCase() || "S"
                    )}
                  </div>
                  <h3
                    className={cn(
                      "mb-1 text-lg font-semibold",
                      isDark ? "text-white" : "text-gray-900",
                    )}
                  >
                    {student?.name || "Student"}
                  </h3>
                  <p className={cn("mb-4 text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                    {student?.email}
                  </p>
                  {student?.registrationNo && (
                    <Badge variant="primary" className="mb-4">
                      {student.registrationNo}
                    </Badge>
                  )}
                  <Link to="/student/profile">
                    <Button variant="secondary" className="w-full gap-2">
                      <User className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  </Link>
                </motion.div>

                {/* Quiz Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className={cn(
                    "relative overflow-hidden rounded-2xl border p-6",
                    isDark
                      ? "border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-blue-500/10"
                      : "border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50",
                  )}
                >
                  <div className="absolute top-2 right-2">
                    <Sparkles
                      className={cn("h-5 w-5", isDark ? "text-purple-400" : "text-purple-500")}
                    />
                  </div>
                  <BookOpen
                    className={cn("mb-4 h-10 w-10", isDark ? "text-purple-400" : "text-purple-500")}
                  />
                  <h3
                    className={cn(
                      "mb-2 text-lg font-semibold",
                      isDark ? "text-white" : "text-gray-900",
                    )}
                  >
                    Take a Quiz
                  </h3>
                  <p className={cn("mb-4 text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                    Test your knowledge with interactive quizzes and earn top marks.
                  </p>
                  <Link to="/student/quizzes">
                    <Button variant="primary" className="w-full">
                      Browse Quizzes
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Create Team Modal */}
      <CreateTeamModal
        isOpen={isCreateTeamModalOpen}
        onClose={() => setIsCreateTeamModalOpen(false)}
        onSuccess={() => {
          // Optionally refresh teams or show success notification
          console.log("Team created successfully!");
        }}
      />
    </div>
  );
};

export default StudentDashboardPage;
