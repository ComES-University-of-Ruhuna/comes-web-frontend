// ============================================
// ComES Website - Admin Quiz Management Page
// ============================================

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Search,
  X,
  HelpCircle,
  Loader2,
  Trophy,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";
import {
  quizService,
  type ApiQuiz,
  type ApiQuizAttempt,
  type CreateQuizData,
  type UpdateQuizData,
} from "@/services";

// ── Types ──────────────────────────────────────
interface QuestionFormData {
  questionText: string;
  imageUrl: string;
  answers: { text: string; isCorrect: boolean }[];
  timeLimitSeconds: number;
  marks: number;
}

const emptyQuestion = (): QuestionFormData => ({
  questionText: "",
  imageUrl: "",
  answers: [
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ],
  timeLimitSeconds: 30,
  marks: 10,
});

// ── Quiz Form Modal ───────────────────────────
const QuizFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isDark,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateQuizData | UpdateQuizData) => void;
  initialData?: ApiQuiz;
  isDark: boolean;
  loading: boolean;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [questions, setQuestions] = useState<QuestionFormData[]>([emptyQuestion()]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || "");
      setIsVisible(initialData.isVisible);
      setQuestions(
        initialData.questions.map((q) => ({
          questionText: q.questionText,
          imageUrl: q.imageUrl || "",
          answers: q.answers.map((a) => ({ text: a.text, isCorrect: a.isCorrect || false })),
          timeLimitSeconds: q.timeLimitSeconds,
          marks: q.marks,
        })),
      );
    } else {
      setTitle("");
      setDescription("");
      setIsVisible(true);
      setQuestions([emptyQuestion()]);
    }
  }, [initialData, isOpen]);

  const addQuestion = () => setQuestions((prev) => [...prev, emptyQuestion()]);

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof QuestionFormData, value: any) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, [field]: value } : q)));
  };

  const updateAnswer = (qIndex: number, aIndex: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? { ...q, answers: q.answers.map((a, j) => (j === aIndex ? { ...a, text } : a)) }
          : q,
      ),
    );
  };

  const setCorrectAnswer = (qIndex: number, aIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              answers: q.answers.map((a, j) => ({ ...a, isCorrect: j === aIndex })),
            }
          : q,
      ),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description: description || undefined,
      isVisible,
      questions: questions.map((q) => ({
        questionText: q.questionText,
        imageUrl: q.imageUrl || undefined,
        answers: q.answers,
        timeLimitSeconds: q.timeLimitSeconds,
        marks: q.marks,
      })),
    } as CreateQuizData);
  };

  if (!isOpen) return null;

  const inputClass = cn(
    "w-full px-3 py-2 rounded-lg border text-sm transition-colors focus:ring-2 focus:ring-purple-500 focus:outline-none",
    isDark
      ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400",
  );

  const labelClass = cn(
    "block text-sm font-medium mb-1",
    isDark ? "text-gray-300" : "text-gray-700",
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn(
          "relative mx-4 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border p-6",
          isDark ? "border-slate-800 bg-slate-900" : "border-gray-200 bg-white shadow-2xl",
        )}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>
            {initialData ? "Edit Quiz" : "Create New Quiz"}
          </h2>
          <button
            onClick={onClose}
            className={cn(
              "rounded-lg p-2 transition-colors",
              isDark ? "hover:bg-slate-800" : "hover:bg-gray-100",
            )}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={3}
              maxLength={200}
              placeholder="e.g. JavaScript Fundamentals"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              maxLength={2000}
              placeholder="Brief description of the quiz..."
              className={inputClass}
            />
          </div>

          {/* Visibility */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-300 transition-colors peer-checked:bg-purple-500 peer-focus:ring-2 peer-focus:ring-purple-500 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full" />
            </label>
            <span className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-700")}>
              {isVisible ? "Visible to students" : "Hidden from students"}
            </span>
          </div>

          {/* Questions */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label
                className={cn("text-sm font-medium", isDark ? "text-gray-300" : "text-gray-700")}
              >
                Questions ({questions.length})
              </label>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center gap-1 text-sm font-medium text-purple-500 hover:text-purple-400"
              >
                <Plus className="h-4 w-4" />
                Add Question
              </button>
            </div>

            <div className="space-y-4">
              {questions.map((question, qIndex) => (
                <div
                  key={qIndex}
                  className={cn(
                    "rounded-xl border p-4",
                    isDark ? "border-slate-700 bg-slate-800/50" : "border-gray-200 bg-gray-50",
                  )}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        isDark ? "text-gray-300" : "text-gray-700",
                      )}
                    >
                      Question {qIndex + 1}
                    </span>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Question Text */}
                  <input
                    type="text"
                    value={question.questionText}
                    onChange={(e) => updateQuestion(qIndex, "questionText", e.target.value)}
                    required
                    placeholder="Enter question text..."
                    className={cn(inputClass, "mb-3")}
                  />

                  {/* Image URL */}
                  <input
                    type="url"
                    value={question.imageUrl}
                    onChange={(e) => updateQuestion(qIndex, "imageUrl", e.target.value)}
                    placeholder="Image URL (optional)"
                    className={cn(inputClass, "mb-3")}
                  />

                  {/* Answers */}
                  <div className="mb-3 space-y-2">
                    {question.answers.map((answer, aIndex) => (
                      <div key={aIndex} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCorrectAnswer(qIndex, aIndex)}
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 transition-colors",
                            answer.isCorrect
                              ? "border-green-500 bg-green-500 text-white"
                              : isDark
                                ? "border-slate-600 text-gray-500 hover:border-green-500"
                                : "border-gray-300 text-gray-400 hover:border-green-500",
                          )}
                          title={answer.isCorrect ? "Correct answer" : "Mark as correct"}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                        <input
                          type="text"
                          value={answer.text}
                          onChange={(e) => updateAnswer(qIndex, aIndex, e.target.value)}
                          required
                          placeholder={`Answer ${String.fromCharCode(65 + aIndex)}`}
                          className={cn(inputClass, "flex-1")}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Time & Marks */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>
                        Time Limit (seconds)
                      </label>
                      <input
                        type="number"
                        min={5}
                        max={300}
                        value={question.timeLimitSeconds}
                        onChange={(e) =>
                          updateQuestion(qIndex, "timeLimitSeconds", Number(e.target.value))
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>
                        Marks
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={question.marks}
                        onChange={(e) => updateQuestion(qIndex, "marks", Number(e.target.value))}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div
            className="flex justify-end gap-3 border-t pt-4"
            style={{ borderColor: isDark ? "#334155" : "#e5e7eb" }}
          >
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                isDark
                  ? "text-gray-400 hover:bg-slate-800 hover:text-white"
                  : "text-gray-600 hover:bg-gray-100",
              )}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-purple-500 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-600 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {initialData ? "Update Quiz" : "Create Quiz"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ── Attempts Modal ────────────────────────────
const AttemptsModal = ({
  isOpen,
  onClose,
  quizId,
  quizTitle,
  isDark,
}: {
  isOpen: boolean;
  onClose: () => void;
  quizId: string;
  quizTitle: string;
  isDark: boolean;
}) => {
  const [attempts, setAttempts] = useState<ApiQuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAttempts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await quizService.getAttempts(quizId, { page, limit: 10 });
      if (res.success && res.data) {
        setAttempts(res.data.attempts);
        setTotalPages(res.data.pagination.pages);
      }
    } catch (err) {
      console.error("Failed to fetch attempts", err);
    } finally {
      setLoading(false);
    }
  }, [quizId, page]);

  useEffect(() => {
    if (isOpen) fetchAttempts();
  }, [isOpen, fetchAttempts]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "relative mx-4 max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl border p-6",
          isDark ? "border-slate-800 bg-slate-900" : "border-gray-200 bg-white shadow-2xl",
        )}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className={cn("text-lg font-bold", isDark ? "text-white" : "text-gray-900")}>
              Quiz Attempts
            </h2>
            <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>{quizTitle}</p>
          </div>
          <button
            onClick={onClose}
            className={cn(
              "rounded-lg p-2 transition-colors",
              isDark ? "hover:bg-slate-800" : "hover:bg-gray-100",
            )}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
          </div>
        ) : attempts.length === 0 ? (
          <div className="py-12 text-center">
            <Trophy
              className={cn("mx-auto mb-3 h-12 w-12", isDark ? "text-gray-600" : "text-gray-300")}
            />
            <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
              No attempts yet
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {attempts.map((attempt, index) => (
                <div
                  key={attempt._id}
                  className={cn(
                    "flex items-center gap-4 rounded-xl p-3",
                    isDark ? "bg-slate-800/50" : "bg-gray-50",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                      index === 0
                        ? "bg-amber-500 text-white"
                        : index === 1
                          ? "bg-gray-400 text-white"
                          : index === 2
                            ? "bg-amber-700 text-white"
                            : isDark
                              ? "bg-slate-700 text-gray-400"
                              : "bg-gray-200 text-gray-600",
                    )}
                  >
                    {(page - 1) * 10 + index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "truncate text-sm font-medium",
                        isDark ? "text-white" : "text-gray-900",
                      )}
                    >
                      {attempt.participantName}
                    </p>
                    <p className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
                      {new Date(attempt.completedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-sm font-bold", isDark ? "text-white" : "text-gray-900")}>
                      {attempt.totalMarks.toFixed(1)} / {attempt.maxMarks}
                    </p>
                    <p
                      className={cn(
                        "text-xs font-medium",
                        attempt.percentage >= 50 ? "text-green-500" : "text-red-500",
                      )}
                    >
                      {attempt.percentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className={cn(
                    "rounded-lg p-1.5 transition-colors disabled:opacity-40",
                    isDark ? "hover:bg-slate-800" : "hover:bg-gray-200",
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-600")}>
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className={cn(
                    "rounded-lg p-1.5 transition-colors disabled:opacity-40",
                    isDark ? "hover:bg-slate-800" : "hover:bg-gray-200",
                  )}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

// ── Delete Confirmation Modal ─────────────────
const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  quizTitle,
  isDark,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  quizTitle: string;
  isDark: boolean;
  loading: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "relative mx-4 w-full max-w-sm rounded-2xl border p-6 text-center",
          isDark ? "border-slate-800 bg-slate-900" : "border-gray-200 bg-white shadow-2xl",
        )}
      >
        <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-400" />
        <h3 className={cn("mb-2 text-lg font-bold", isDark ? "text-white" : "text-gray-900")}>
          Delete Quiz?
        </h3>
        <p className={cn("mb-6 text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
          This will permanently delete "<strong>{quizTitle}</strong>" and all its attempts.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className={cn(
              "flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-colors",
              isDark
                ? "bg-slate-800 text-gray-300 hover:bg-slate-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200",
            )}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ═══════════════════════════════════════════════
// Main Page Component
// ═══════════════════════════════════════════════
export const QuizManagementPage = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  const [quizzes, setQuizzes] = useState<ApiQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [includeHidden, setIncludeHidden] = useState(true);

  // Modals
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<ApiQuiz | undefined>();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingQuiz, setDeletingQuiz] = useState<ApiQuiz | null>(null);
  const [attemptsModalOpen, setAttemptsModalOpen] = useState(false);
  const [viewingAttempts, setViewingAttempts] = useState<{ id: string; title: string } | null>(
    null,
  );

  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await quizService.getAll({
        page,
        limit: 10,
        search: search || undefined,
        includeHidden,
        sort: "-createdAt",
      });
      if (res.success && res.data) {
        setQuizzes(res.data.quizzes);
        setTotalPages(res.data.pagination.pages);
      }
    } catch (err) {
      console.error("Failed to fetch quizzes", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, includeHidden]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ── Handlers ──────────────────────────────────

  const handleCreate = async (data: CreateQuizData | UpdateQuizData) => {
    setActionLoading(true);
    try {
      await quizService.create(data as CreateQuizData);
      setFormModalOpen(false);
      fetchQuizzes();
    } catch (err) {
      console.error("Failed to create quiz", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (data: CreateQuizData | UpdateQuizData) => {
    if (!editingQuiz) return;
    setActionLoading(true);
    try {
      await quizService.update(editingQuiz._id, data as UpdateQuizData);
      setFormModalOpen(false);
      setEditingQuiz(undefined);
      fetchQuizzes();
    } catch (err) {
      console.error("Failed to update quiz", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingQuiz) return;
    setActionLoading(true);
    try {
      await quizService.delete(deletingQuiz._id);
      setDeleteModalOpen(false);
      setDeletingQuiz(null);
      fetchQuizzes();
    } catch (err) {
      console.error("Failed to delete quiz", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleVisibility = async (quiz: ApiQuiz) => {
    try {
      await quizService.toggleVisibility(quiz._id, !quiz.isVisible);
      fetchQuizzes();
    } catch (err) {
      console.error("Failed to toggle visibility", err);
    }
  };

  const openEdit = (quiz: ApiQuiz) => {
    setEditingQuiz(quiz);
    setFormModalOpen(true);
  };

  const openDelete = (quiz: ApiQuiz) => {
    setDeletingQuiz(quiz);
    setDeleteModalOpen(true);
  };

  const openAttempts = (quiz: ApiQuiz) => {
    setViewingAttempts({ id: quiz._id, title: quiz.title });
    setAttemptsModalOpen(true);
  };

  const openCreate = () => {
    setEditingQuiz(undefined);
    setFormModalOpen(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
            Quiz Management
          </h1>
          <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
            Create and manage quizzes for students
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-purple-500/25 transition-colors hover:bg-purple-600"
        >
          <Plus className="h-4 w-4" />
          Create Quiz
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative max-w-sm flex-1">
          <Search
            className={cn(
              "absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2",
              isDark ? "text-gray-500" : "text-gray-400",
            )}
          />
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className={cn(
              "w-full rounded-xl border py-2 pr-4 pl-10 text-sm transition-colors focus:ring-2 focus:ring-purple-500 focus:outline-none",
              isDark
                ? "border-slate-700 bg-slate-800 text-white placeholder-gray-500"
                : "border-gray-200 bg-white text-gray-900 placeholder-gray-400",
            )}
          />
        </div>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={includeHidden}
            onChange={(e) => setIncludeHidden(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
          />
          <span className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
            Show hidden
          </span>
        </label>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      ) : quizzes.length === 0 ? (
        <div className="py-20 text-center">
          <HelpCircle
            className={cn("mx-auto mb-4 h-16 w-16", isDark ? "text-gray-600" : "text-gray-300")}
          />
          <h3
            className={cn("mb-1 text-lg font-semibold", isDark ? "text-gray-400" : "text-gray-600")}
          >
            No quizzes found
          </h3>
          <p className={cn("mb-4 text-sm", isDark ? "text-gray-500" : "text-gray-400")}>
            {search ? "Try a different search term" : "Create your first quiz to get started"}
          </p>
          {!search && (
            <button
              onClick={openCreate}
              className="text-sm font-medium text-purple-500 hover:text-purple-400"
            >
              + Create Quiz
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Quiz Table */}
          <div
            className={cn(
              "overflow-hidden rounded-2xl border",
              isDark ? "border-slate-800" : "border-gray-200",
            )}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={cn(isDark ? "bg-slate-800/50" : "bg-gray-50")}>
                    <th
                      className={cn(
                        "px-4 py-3 text-left text-xs font-semibold",
                        isDark ? "text-gray-400" : "text-gray-500",
                      )}
                    >
                      Quiz
                    </th>
                    <th
                      className={cn(
                        "hidden px-4 py-3 text-center text-xs font-semibold sm:table-cell",
                        isDark ? "text-gray-400" : "text-gray-500",
                      )}
                    >
                      Questions
                    </th>
                    <th
                      className={cn(
                        "hidden px-4 py-3 text-center text-xs font-semibold sm:table-cell",
                        isDark ? "text-gray-400" : "text-gray-500",
                      )}
                    >
                      Marks
                    </th>
                    <th
                      className={cn(
                        "px-4 py-3 text-center text-xs font-semibold",
                        isDark ? "text-gray-400" : "text-gray-500",
                      )}
                    >
                      Status
                    </th>
                    <th
                      className={cn(
                        "px-4 py-3 text-right text-xs font-semibold",
                        isDark ? "text-gray-400" : "text-gray-500",
                      )}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={cn("divide-y", isDark ? "divide-slate-800" : "divide-gray-100")}>
                  {quizzes.map((quiz) => (
                    <tr
                      key={quiz._id}
                      className={cn(
                        "transition-colors",
                        isDark ? "hover:bg-slate-800/30" : "hover:bg-gray-50",
                      )}
                    >
                      <td className="px-4 py-3">
                        <p
                          className={cn(
                            "text-sm font-medium",
                            isDark ? "text-white" : "text-gray-900",
                          )}
                        >
                          {quiz.title}
                        </p>
                        <p
                          className={cn(
                            "max-w-xs truncate text-xs",
                            isDark ? "text-gray-500" : "text-gray-400",
                          )}
                        >
                          {quiz.description || "No description"}
                        </p>
                      </td>
                      <td className="hidden px-4 py-3 text-center sm:table-cell">
                        <span
                          className={cn(
                            "text-sm font-medium",
                            isDark ? "text-gray-300" : "text-gray-700",
                          )}
                        >
                          {quiz.questions.length}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 text-center sm:table-cell">
                        <span
                          className={cn(
                            "text-sm font-medium",
                            isDark ? "text-gray-300" : "text-gray-700",
                          )}
                        >
                          {quiz.totalMarks}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleVisibility(quiz)}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                            quiz.isVisible
                              ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                              : "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20",
                          )}
                        >
                          {quiz.isVisible ? (
                            <>
                              <Eye className="h-3 w-3" />
                              Visible
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3" />
                              Hidden
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openAttempts(quiz)}
                            className={cn(
                              "rounded-lg p-2 transition-colors",
                              isDark
                                ? "text-gray-400 hover:bg-slate-700"
                                : "text-gray-500 hover:bg-gray-200",
                            )}
                            title="View attempts"
                          >
                            <Trophy className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openEdit(quiz)}
                            className={cn(
                              "rounded-lg p-2 transition-colors",
                              isDark
                                ? "text-gray-400 hover:bg-slate-700"
                                : "text-gray-500 hover:bg-gray-200",
                            )}
                            title="Edit quiz"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openDelete(quiz)}
                            className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-500/10"
                            title="Delete quiz"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
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
                className={cn("text-sm font-medium", isDark ? "text-gray-400" : "text-gray-600")}
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

      {/* Modals */}
      <AnimatePresence>
        <QuizFormModal
          isOpen={formModalOpen}
          onClose={() => {
            setFormModalOpen(false);
            setEditingQuiz(undefined);
          }}
          onSubmit={editingQuiz ? handleUpdate : handleCreate}
          initialData={editingQuiz}
          isDark={isDark}
          loading={actionLoading}
        />
      </AnimatePresence>

      <AnimatePresence>
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setDeletingQuiz(null);
          }}
          onConfirm={handleDelete}
          quizTitle={deletingQuiz?.title || ""}
          isDark={isDark}
          loading={actionLoading}
        />
      </AnimatePresence>

      <AnimatePresence>
        {viewingAttempts && (
          <AttemptsModal
            isOpen={attemptsModalOpen}
            onClose={() => {
              setAttemptsModalOpen(false);
              setViewingAttempts(null);
            }}
            quizId={viewingAttempts.id}
            quizTitle={viewingAttempts.title}
            isDark={isDark}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizManagementPage;
