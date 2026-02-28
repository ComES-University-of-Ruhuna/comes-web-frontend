// ============================================
// ComES Website - Student Portfolio Page
// ============================================

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  GraduationCap,
  Briefcase,
  Award,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";
import { ThemeToggle } from "@/components/ui";
import api from "@/services/api";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  thumbnail?: string;
}

interface StudentProfile {
  _id: string;
  name: string;
  email: string;
  username: string;
  registrationNo: string;
  batch: string;
  semester?: number;
  contactNo?: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  github?: string;
  linkedin?: string;
  website?: string;
  registeredEvents?: Event[];
  createdAt: string;
}

export const StudentPortfolioPage = () => {
  const { username } = useParams<{ username: string }>();
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudentPortfolio = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get(`/students/portfolio/${username}`);
        setStudent(response.data.data.student);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load student portfolio");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchStudentPortfolio();
    }
  }, [username]);

  if (loading) {
    return (
      <div
        className={cn(
          "flex min-h-screen items-center justify-center",
          isDark ? "bg-slate-950" : "bg-gray-50",
        )}
      >
        <div className="text-center">
          <Loader2
            className={cn(
              "mx-auto mb-4 h-12 w-12 animate-spin",
              isDark ? "text-blue-500" : "text-blue-600",
            )}
          />
          <p className={cn("text-lg", isDark ? "text-gray-300" : "text-gray-700")}>
            Loading portfolio...
          </p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div
        className={cn(
          "flex min-h-screen items-center justify-center p-4",
          isDark ? "bg-slate-950" : "bg-gray-50",
        )}
      >
        <div className="text-center">
          <h2 className={cn("mb-4 text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
            Portfolio Not Found
          </h2>
          <p className={cn("mb-6", isDark ? "text-gray-400" : "text-gray-600")}>
            {error || "The requested student portfolio could not be found."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen", isDark ? "bg-slate-950" : "bg-gray-50")}>
      {/* Header with Theme Toggle */}
      <header
        className={cn(
          "sticky top-0 z-50 border-b backdrop-blur-lg",
          isDark ? "border-slate-800 bg-slate-900/80" : "border-gray-200 bg-white/80",
        )}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link
            to="/"
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 transition-colors",
              isDark
                ? "text-gray-300 hover:bg-slate-800 hover:text-white"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section
        className={cn(
          "border-b py-16",
          isDark ? "border-slate-800 bg-slate-900" : "border-gray-200 bg-white",
        )}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-4xl"
          >
            <div className="flex flex-col items-start gap-8 md:flex-row">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="shrink-0"
              >
                <div
                  className={cn(
                    "h-32 w-32 overflow-hidden rounded-2xl border-4",
                    isDark ? "border-slate-800" : "border-gray-200",
                  )}
                >
                  {student.avatar ? (
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className={cn(
                        "flex h-full w-full items-center justify-center text-4xl font-bold",
                        isDark ? "bg-slate-800 text-blue-400" : "bg-gray-100 text-blue-600",
                      )}
                    >
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Info */}
              <div className="flex-1">
                <h1
                  className={cn(
                    "mb-2 text-3xl font-bold md:text-4xl",
                    isDark ? "text-white" : "text-gray-900",
                  )}
                >
                  {student.name}
                </h1>
                <p className={cn("mb-4 text-lg", isDark ? "text-gray-400" : "text-gray-600")}>
                  @{student.username}
                </p>

                {/* Quick Info */}
                <div className="mb-6 flex flex-wrap gap-4">
                  <div
                    className={cn(
                      "flex items-center gap-2",
                      isDark ? "text-gray-300" : "text-gray-700",
                    )}
                  >
                    <GraduationCap className="h-4 w-4" />
                    <span className="text-sm">{student.registrationNo}</span>
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-2",
                      isDark ? "text-gray-300" : "text-gray-700",
                    )}
                  >
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Batch {student.batch}</span>
                  </div>
                  {student.semester && (
                    <div
                      className={cn(
                        "flex items-center gap-2",
                        isDark ? "text-gray-300" : "text-gray-700",
                      )}
                    >
                      <Briefcase className="h-4 w-4" />
                      <span className="text-sm">Semester {student.semester}</span>
                    </div>
                  )}
                </div>

                {/* Bio */}
                {student.bio && (
                  <p className={cn("mb-6 text-base", isDark ? "text-gray-300" : "text-gray-700")}>
                    {student.bio}
                  </p>
                )}

                {/* Social Links */}
                <div className="flex flex-wrap gap-3">
                  {student.email && (
                    <a
                      href={`mailto:${student.email}`}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors",
                        isDark
                          ? "border-slate-700 bg-slate-800 text-gray-300 hover:bg-slate-700"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
                      )}
                    >
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">Email</span>
                    </a>
                  )}
                  {student.contactNo && (
                    <a
                      href={`tel:${student.contactNo}`}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors",
                        isDark
                          ? "border-slate-700 bg-slate-800 text-gray-300 hover:bg-slate-700"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
                      )}
                    >
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">Call</span>
                    </a>
                  )}
                  {student.github && (
                    <a
                      href={student.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors",
                        isDark
                          ? "border-slate-700 bg-slate-800 text-gray-300 hover:bg-slate-700"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
                      )}
                    >
                      <Github className="h-4 w-4" />
                      <span className="text-sm">GitHub</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {student.linkedin && (
                    <a
                      href={student.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors",
                        isDark
                          ? "border-slate-700 bg-slate-800 text-gray-300 hover:bg-slate-700"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
                      )}
                    >
                      <Linkedin className="h-4 w-4" />
                      <span className="text-sm">LinkedIn</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {student.website && (
                    <a
                      href={student.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors",
                        isDark
                          ? "border-slate-700 bg-slate-800 text-gray-300 hover:bg-slate-700"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
                      )}
                    >
                      <Globe className="h-4 w-4" />
                      <span className="text-sm">Website</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      {student.skills && student.skills.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h2
                className={cn("mb-6 text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}
              >
                Skills & Expertise
              </h2>
              <div className="flex flex-wrap gap-3">
                {student.skills.map((skill, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium",
                      isDark
                        ? "border border-blue-500/20 bg-blue-500/10 text-blue-400"
                        : "border border-blue-200 bg-blue-50 text-blue-700",
                    )}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Events Section */}
      {student.registeredEvents && student.registeredEvents.length > 0 && (
        <section className={cn("border-t py-12", isDark ? "border-slate-800" : "border-gray-200")}>
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h2
                className={cn(
                  "mb-6 flex items-center gap-3 text-2xl font-bold",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                <Award className="h-6 w-6" />
                Registered Events
              </h2>
              <div className="grid gap-4">
                {student.registeredEvents.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "rounded-xl border p-6",
                      isDark
                        ? "border-slate-800 bg-slate-900 hover:border-slate-700"
                        : "border-gray-200 bg-white hover:border-gray-300",
                    )}
                  >
                    <h3
                      className={cn(
                        "mb-2 text-lg font-semibold",
                        isDark ? "text-white" : "text-gray-900",
                      )}
                    >
                      {event.title}
                    </h3>
                    <p className={cn("mb-4 text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                      {event.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div
                        className={cn(
                          "flex items-center gap-2",
                          isDark ? "text-gray-400" : "text-gray-600",
                        )}
                      >
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      {event.location && (
                        <div
                          className={cn(
                            "flex items-center gap-2",
                            isDark ? "text-gray-400" : "text-gray-600",
                          )}
                        >
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer
        className={cn("mt-12 border-t py-8", isDark ? "border-slate-800" : "border-gray-200")}
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <p className={cn("text-sm", isDark ? "text-gray-500" : "text-gray-600")}>
              Member since{" "}
              {new Date(student.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudentPortfolioPage;
