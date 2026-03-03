// ============================================
// ComES Website - Student Quizzes Page
// ============================================

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import {
  BookOpen,
  Search,
  Clock,
  HelpCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useThemeStore } from "@/store";
import { useStudentStore } from "@/store/studentStore";
import { cn } from "@/utils";
import { Button, Badge } from "@/components/ui";
import { Navbar, Footer } from "@/components/layout";
import { quizService, type ApiQuiz } from "@/services";

// Quiz Card Component
const QuizCard = ({
  quiz,
  isDark,
  onStart,
}: {
  quiz: ApiQuiz;
  isDark: boolean;
  onStart: (id: string) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    className={cn(
      "group cursor-pointer rounded-2xl border p-6 transition-all",
      isDark
        ? "border-slate-800 bg-slate-900/50 hover:border-purple-500/50"
        : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-xl",
    )}
    onClick={() => onStart(quiz._id)}
  >
    {/* Header */}
    <div className="mb-4 flex items-start justify-between">
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl",
          isDark ? "bg-purple-500/20" : "bg-purple-100",
        )}
      >
        <BookOpen className={cn("h-6 w-6", isDark ? "text-purple-400" : "text-purple-600")} />
      </div>
      <Badge variant="primary" className="text-xs">
        {quiz.questions.length} {quiz.questions.length === 1 ? "Question" : "Questions"}
      </Badge>
    </div>

    {/* Title & Description */}
    <h3
      className={cn(
        "mb-2 line-clamp-2 text-lg font-semibold transition-colors group-hover:text-purple-500",
        isDark ? "text-white" : "text-gray-900",
      )}
    >
      {quiz.title}
    </h3>
    {quiz.description && (
      <p className={cn("mb-4 line-clamp-2 text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
        {quiz.description}
      </p>
    )}

    {/* Stats */}
    <div className="mb-4 flex items-center gap-4">
      <div className="flex items-center gap-1.5">
        <Award className={cn("h-4 w-4", isDark ? "text-amber-400" : "text-amber-500")} />
        <span className={cn("text-sm font-medium", isDark ? "text-gray-300" : "text-gray-700")}>
          {quiz.totalMarks} marks
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <Clock className={cn("h-4 w-4", isDark ? "text-blue-400" : "text-blue-500")} />
        <span className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>Timed</span>
      </div>
    </div>

    {/* CTA */}
    <div
      className={cn(
        "flex items-center justify-between border-t pt-4",
        isDark ? "border-slate-700" : "border-gray-100",
      )}
    >
      <span className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
        {new Date(quiz.createdAt).toLocaleDateString()}
      </span>
      <div className="flex items-center gap-1 text-sm font-medium text-purple-500 transition-all group-hover:gap-2">
        Start Quiz
        <ArrowRight className="h-4 w-4" />
      </div>
    </div>
  </motion.div>
);

export const QuizzesPage = () => {
  const navigate = useNavigate();
  const { student } = useStudentStore();
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  const [quizzes, setQuizzes] = useState<ApiQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9;

  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await quizService.getAll({ page, limit, search: search || undefined });
      if (res.success && res.data) {
        setQuizzes(res.data.quizzes);
        setTotalPages(res.data.pagination.pages);
      }
    } catch (err) {
      console.error("Failed to fetch quizzes", err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  // Debounce search
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleStartQuiz = (id: string) => {
    if (!student) {
      navigate("/login");
      return;
    }
    navigate(`/student/quizzes/${id}`);
  };

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
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl",
                        isDark ? "bg-purple-500/20" : "bg-purple-100",
                      )}
                    >
                      <Sparkles
                        className={cn("h-5 w-5", isDark ? "text-purple-400" : "text-purple-600")}
                      />
                    </div>
                    <h1
                      className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}
                    >
                      Quizzes
                    </h1>
                  </div>
                  <p className={cn("text-lg", isDark ? "text-gray-400" : "text-gray-600")}>
                    Test your knowledge with interactive quizzes
                  </p>
                </div>
                <Link to="/student/dashboard">
                  <Button variant="secondary" size="sm" className="gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="relative max-w-md">
                <Search
                  className={cn(
                    "absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2",
                    isDark ? "text-gray-500" : "text-gray-400",
                  )}
                />
                <input
                  type="text"
                  placeholder="Search quizzes..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className={cn(
                    "w-full rounded-xl border py-3 pr-4 pl-12 transition-all focus:ring-2 focus:ring-purple-500 focus:outline-none",
                    isDark
                      ? "border-slate-700 bg-slate-900 text-white placeholder-gray-500"
                      : "border-gray-200 bg-white text-gray-900 placeholder-gray-400",
                  )}
                />
              </div>
            </motion.div>

            {/* Content */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              </div>
            ) : quizzes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <HelpCircle
                  className={cn(
                    "mx-auto mb-4 h-16 w-16",
                    isDark ? "text-gray-600" : "text-gray-300",
                  )}
                />
                <h3
                  className={cn(
                    "mb-2 text-xl font-semibold",
                    isDark ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  No quizzes found
                </h3>
                <p className={cn("text-sm", isDark ? "text-gray-500" : "text-gray-400")}>
                  {search ? "Try a different search term" : "Check back later for new quizzes!"}
                </p>
              </motion.div>
            ) : (
              <>
                {/* Quiz Grid */}
                <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {quizzes.map((quiz) => (
                    <QuizCard
                      key={quiz._id}
                      quiz={quiz}
                      isDark={isDark}
                      onStart={handleStartQuiz}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className={cn(
                        "rounded-lg p-2 transition-colors disabled:opacity-40",
                        isDark ? "hover:bg-slate-800" : "hover:bg-gray-200",
                      )}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isDark ? "text-gray-400" : "text-gray-600",
                      )}
                    >
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className={cn(
                        "rounded-lg p-2 transition-colors disabled:opacity-40",
                        isDark ? "hover:bg-slate-800" : "hover:bg-gray-200",
                      )}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuizzesPage;
