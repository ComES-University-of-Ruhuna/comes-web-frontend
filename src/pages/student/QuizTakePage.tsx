// ============================================
// ComES Website - Quiz Take Page
// ============================================

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router";
import {
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Trophy,
  Target,
  Percent,
  ChevronLeft,
  Loader2,
  AlertTriangle,
  RotateCcw,
  Home,
} from "lucide-react";
import { useThemeStore } from "@/store";
import { useStudentStore } from "@/store/studentStore";
import { cn } from "@/utils";
import { Button, Badge } from "@/components/ui";
import { Navbar, Footer } from "@/components/layout";
import { quizService, type ApiQuiz, type ApiQuizAttempt } from "@/services";

type QuizState = "loading" | "intro" | "playing" | "submitting" | "results" | "error";

interface QuestionAnswer {
  questionId: string;
  selectedAnswerIndex: number;
  responseTimeSeconds: number;
}

// ── Circular Timer ────────────────────────────
const CircularTimer = ({
  timeLeft,
  totalTime,
  isDark,
}: {
  timeLeft: number;
  totalTime: number;
  isDark: boolean;
}) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTime > 0 ? timeLeft / totalTime : 0;
  const offset = circumference * (1 - progress);
  const isWarning = timeLeft <= 5;

  return (
    <div className="relative flex h-20 w-20 items-center justify-center">
      <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 64 64">
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke={isDark ? "#334155" : "#e5e7eb"}
          strokeWidth="4"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke={isWarning ? "#ef4444" : "#a855f7"}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <span
        className={cn(
          "text-lg font-bold tabular-nums",
          isWarning ? "animate-pulse text-red-500" : isDark ? "text-white" : "text-gray-900",
        )}
      >
        {Math.ceil(timeLeft)}s
      </span>
    </div>
  );
};

// ── Results Screen ────────────────────────────
const ResultsView = ({
  quiz,
  attempt,
  isDark,
}: {
  quiz: ApiQuiz;
  attempt: ApiQuizAttempt;
  isDark: boolean;
}) => {
  const isPassing = attempt.percentage >= 50;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-2xl"
    >
      {/* Score Card */}
      <div
        className={cn(
          "mb-8 rounded-3xl border p-8 text-center",
          isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-200 bg-white shadow-xl",
        )}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className={cn(
            "mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full",
            isPassing
              ? isDark
                ? "bg-green-500/20"
                : "bg-green-100"
              : isDark
                ? "bg-red-500/20"
                : "bg-red-100",
          )}
        >
          <Trophy
            className={cn(
              "h-12 w-12",
              isPassing
                ? isDark
                  ? "text-green-400"
                  : "text-green-600"
                : isDark
                  ? "text-red-400"
                  : "text-red-600",
            )}
          />
        </motion.div>

        <h2 className={cn("mb-2 text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
          {isPassing ? "Great Job!" : "Keep Practicing!"}
        </h2>
        <p className={cn("mb-6 text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
          {quiz.title}
        </p>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className={cn("rounded-2xl p-4", isDark ? "bg-slate-800" : "bg-gray-50")}>
            <Target className="mx-auto mb-2 h-6 w-6 text-purple-500" />
            <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
              {attempt.totalMarks.toFixed(1)}
            </p>
            <p className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
              of {attempt.maxMarks}
            </p>
          </div>
          <div className={cn("rounded-2xl p-4", isDark ? "bg-slate-800" : "bg-gray-50")}>
            <Percent className="mx-auto mb-2 h-6 w-6 text-blue-500" />
            <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
              {attempt.percentage}%
            </p>
            <p className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>Score</p>
          </div>
          <div className={cn("rounded-2xl p-4", isDark ? "bg-slate-800" : "bg-gray-50")}>
            <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-green-500" />
            <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
              {attempt.responses.filter((r) => r.isCorrect).length}
            </p>
            <p className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
              of {attempt.responses.length} correct
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <Link to="/student/quizzes">
            <Button variant="secondary" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              More Quizzes
            </Button>
          </Link>
          <Link to="/student/dashboard">
            <Button variant="primary" className="gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Per-Question Breakdown */}
      <div className="space-y-3">
        <h3 className={cn("mb-4 text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>
          Question Breakdown
        </h3>
        {attempt.responses.map((response, index) => {
          const question = quiz.questions.find((q) => q._id === response.questionId);
          return (
            <motion.div
              key={response.questionId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className={cn(
                "flex items-center gap-4 rounded-xl p-4",
                isDark
                  ? "border border-slate-800 bg-slate-900/50"
                  : "border border-gray-200 bg-white",
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  response.isCorrect
                    ? isDark
                      ? "bg-green-500/20"
                      : "bg-green-100"
                    : isDark
                      ? "bg-red-500/20"
                      : "bg-red-100",
                )}
              >
                {response.isCorrect ? (
                  <CheckCircle2
                    className={cn("h-5 w-5", isDark ? "text-green-400" : "text-green-600")}
                  />
                ) : (
                  <XCircle className={cn("h-5 w-5", isDark ? "text-red-400" : "text-red-600")} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "truncate text-sm font-medium",
                    isDark ? "text-white" : "text-gray-900",
                  )}
                >
                  Q{index + 1}. {question?.questionText || "Question"}
                </p>
                <p className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
                  {response.responseTimeSeconds.toFixed(1)}s response time
                </p>
              </div>
              <Badge variant={response.isCorrect ? "primary" : "secondary"} className="shrink-0">
                +{(response.marksAwarded ?? 0).toFixed(1)}
              </Badge>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

// ── Main Page Component ───────────────────────
export const QuizTakePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { student } = useStudentStore();
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  const [state, setState] = useState<QuizState>("loading");
  const [quiz, setQuiz] = useState<ApiQuiz | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [attempt, setAttempt] = useState<ApiQuizAttempt | null>(null);
  const [error, setError] = useState("");
  const questionStartRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // Redirect if not logged in
  useEffect(() => {
    if (!student) {
      navigate("/login");
    }
  }, [student, navigate]);

  // Fetch quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return;
      try {
        const res = await quizService.getById(id);
        if (res.success && res.data) {
          setQuiz(res.data.quiz);
          setState("intro");
        } else {
          setError("Quiz not found");
          setState("error");
        }
      } catch {
        setError("Failed to load quiz");
        setState("error");
      }
    };
    fetchQuiz();
  }, [id]);

  // Timer
  useEffect(() => {
    if (state !== "playing" || !quiz) return;

    const question = quiz.questions[currentIndex];
    if (!question) return;

    setTimeLeft(question.timeLimitSeconds);
    questionStartRef.current = Date.now();

    const timeUpHandler = () => handleTimeUp();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(timerRef.current);
          timeUpHandler();
          return 0;
        }
        return Math.max(0, prev - 0.1);
      });
    }, 100);

    return () => clearInterval(timerRef.current);
  }, [state, currentIndex, quiz]);

  const handleTimeUp = useCallback(() => {
    if (!quiz) return;
    const question = quiz.questions[currentIndex];
    if (!question) return;

    // Auto-submit with no answer (index -1 will be wrong)
    const responseTime = question.timeLimitSeconds;
    const answer: QuestionAnswer = {
      questionId: question._id,
      selectedAnswerIndex: 0,
      responseTimeSeconds: responseTime,
    };

    setAnswers((prev) => {
      const newAnswers = [...prev, answer];
      if (currentIndex >= quiz.questions.length - 1) {
        submitQuiz(newAnswers);
      }
      return newAnswers;
    });

    if (currentIndex < quiz.questions.length - 1) {
      setSelectedAnswer(null);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [quiz, currentIndex]);

  const handleSelectAnswer = (index: number) => {
    if (state !== "playing") return;
    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    if (!quiz || selectedAnswer === null) return;
    clearInterval(timerRef.current);

    const question = quiz.questions[currentIndex];
    const responseTime = (Date.now() - questionStartRef.current) / 1000;

    const answer: QuestionAnswer = {
      questionId: question._id,
      selectedAnswerIndex: selectedAnswer,
      responseTimeSeconds: Math.round(responseTime * 100) / 100,
    };

    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentIndex >= quiz.questions.length - 1) {
      submitQuiz(newAnswers);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const submitQuiz = async (finalAnswers: QuestionAnswer[]) => {
    if (!quiz || !id) return;
    setState("submitting");

    try {
      const res = await quizService.submitAttempt(id, {
        responses: finalAnswers.map((a) => ({
          questionId: a.questionId,
          selectedAnswerIndex: a.selectedAnswerIndex,
          responseTimeSeconds: a.responseTimeSeconds,
        })),
      });

      if (res.success && res.data) {
        setAttempt(res.data.attempt);
        setState("results");
      } else {
        setError(res.message || "Failed to submit quiz");
        setState("error");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit quiz");
      setState("error");
    }
  };

  const startQuiz = () => {
    setState("playing");
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
  };

  const currentQuestion = quiz?.questions[currentIndex];

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
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            {/* ── Loading ──────────────────────── */}
            {state === "loading" && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              </div>
            )}

            {/* ── Error ────────────────────────── */}
            {state === "error" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-red-400" />
                <h2
                  className={cn(
                    "mb-2 text-xl font-semibold",
                    isDark ? "text-white" : "text-gray-900",
                  )}
                >
                  Something went wrong
                </h2>
                <p className={cn("mb-6 text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                  {error}
                </p>
                <Link to="/student/quizzes">
                  <Button variant="secondary" className="gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Quizzes
                  </Button>
                </Link>
              </motion.div>
            )}

            {/* ── Intro ────────────────────────── */}
            {state === "intro" && quiz && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto max-w-lg text-center"
              >
                <Link
                  to="/student/quizzes"
                  className={cn(
                    "mb-8 inline-flex items-center gap-1 text-sm transition-colors",
                    isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900",
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Quizzes
                </Link>

                <div
                  className={cn(
                    "rounded-3xl border p-8",
                    isDark
                      ? "border-slate-800 bg-slate-900/50"
                      : "border-gray-200 bg-white shadow-xl",
                  )}
                >
                  <div
                    className={cn(
                      "mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl",
                      isDark ? "bg-purple-500/20" : "bg-purple-100",
                    )}
                  >
                    <Target
                      className={cn("h-10 w-10", isDark ? "text-purple-400" : "text-purple-600")}
                    />
                  </div>

                  <h1
                    className={cn(
                      "mb-3 text-2xl font-bold",
                      isDark ? "text-white" : "text-gray-900",
                    )}
                  >
                    {quiz.title}
                  </h1>

                  {quiz.description && (
                    <p className={cn("mb-6 text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                      {quiz.description}
                    </p>
                  )}

                  <div className="mb-8 grid grid-cols-3 gap-3">
                    <div className={cn("rounded-xl p-3", isDark ? "bg-slate-800" : "bg-gray-50")}>
                      <p
                        className={cn("text-lg font-bold", isDark ? "text-white" : "text-gray-900")}
                      >
                        {quiz.questions.length}
                      </p>
                      <p className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
                        Questions
                      </p>
                    </div>
                    <div className={cn("rounded-xl p-3", isDark ? "bg-slate-800" : "bg-gray-50")}>
                      <p
                        className={cn("text-lg font-bold", isDark ? "text-white" : "text-gray-900")}
                      >
                        {quiz.totalMarks}
                      </p>
                      <p className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
                        Total Marks
                      </p>
                    </div>
                    <div className={cn("rounded-xl p-3", isDark ? "bg-slate-800" : "bg-gray-50")}>
                      <p
                        className={cn("text-lg font-bold", isDark ? "text-white" : "text-gray-900")}
                      >
                        <Clock className="mr-1 inline-block h-5 w-5" />
                      </p>
                      <p className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
                        Timed
                      </p>
                    </div>
                  </div>

                  <div
                    className={cn(
                      "mb-6 rounded-xl p-4 text-left",
                      isDark
                        ? "border border-amber-500/20 bg-amber-500/10"
                        : "border border-amber-200 bg-amber-50",
                    )}
                  >
                    <p
                      className={cn(
                        "mb-1 text-sm font-medium",
                        isDark ? "text-amber-400" : "text-amber-700",
                      )}
                    >
                      ⚡ Important
                    </p>
                    <ul
                      className={cn(
                        "space-y-1 text-xs",
                        isDark ? "text-amber-300/80" : "text-amber-600",
                      )}
                    >
                      <li>• Each question has its own time limit</li>
                      <li>• Faster correct answers earn more marks</li>
                      <li>• You cannot go back to previous questions</li>
                    </ul>
                  </div>

                  <Button variant="primary" className="w-full gap-2" onClick={startQuiz}>
                    Start Quiz
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ── Playing ──────────────────────── */}
            {state === "playing" && quiz && currentQuestion && (
              <div>
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isDark ? "text-gray-400" : "text-gray-600",
                      )}
                    >
                      Question {currentIndex + 1} of {quiz.questions.length}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {currentQuestion.marks} marks
                    </Badge>
                  </div>
                  <div
                    className={cn(
                      "h-2 overflow-hidden rounded-full",
                      isDark ? "bg-slate-800" : "bg-gray-200",
                    )}
                  >
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${((currentIndex + 1) / quiz.questions.length) * 100}%`,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Question Card */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className={cn(
                      "rounded-3xl border p-6 md:p-8",
                      isDark
                        ? "border-slate-800 bg-slate-900/50"
                        : "border-gray-200 bg-white shadow-xl",
                    )}
                  >
                    {/* Timer & Question */}
                    <div className="mb-6 flex items-start justify-between">
                      <div className="flex-1 pr-4">
                        <h2
                          className={cn(
                            "text-xl font-semibold",
                            isDark ? "text-white" : "text-gray-900",
                          )}
                        >
                          {currentQuestion.questionText}
                        </h2>
                      </div>
                      <CircularTimer
                        timeLeft={timeLeft}
                        totalTime={currentQuestion.timeLimitSeconds}
                        isDark={isDark}
                      />
                    </div>

                    {/* Question Image */}
                    {currentQuestion.imageUrl && (
                      <div className="mb-6 overflow-hidden rounded-xl">
                        <img
                          src={currentQuestion.imageUrl}
                          alt="Question"
                          className="max-h-64 w-full object-contain"
                        />
                      </div>
                    )}

                    {/* Answer Options */}
                    <div className="mb-6 space-y-3">
                      {currentQuestion.answers.map((answer, index) => {
                        const optionLetters = ["A", "B", "C", "D"];
                        const isSelected = selectedAnswer === index;

                        return (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleSelectAnswer(index)}
                            className={cn(
                              "flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all",
                              isSelected
                                ? "border-purple-500 bg-purple-500/10"
                                : isDark
                                  ? "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                                  : "border-gray-200 bg-gray-50 hover:border-gray-300",
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
                                isSelected
                                  ? "bg-purple-500 text-white"
                                  : isDark
                                    ? "bg-slate-700 text-gray-300"
                                    : "bg-gray-200 text-gray-600",
                              )}
                            >
                              {optionLetters[index]}
                            </div>
                            <span
                              className={cn(
                                "text-sm font-medium",
                                isDark ? "text-white" : "text-gray-900",
                              )}
                            >
                              {answer.text}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Next Button */}
                    <Button
                      variant="primary"
                      className="w-full gap-2"
                      disabled={selectedAnswer === null}
                      onClick={handleNextQuestion}
                    >
                      {currentIndex >= quiz.questions.length - 1 ? (
                        <>
                          Submit Quiz
                          <CheckCircle2 className="h-5 w-5" />
                        </>
                      ) : (
                        <>
                          Next Question
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {/* ── Submitting ───────────────────── */}
            {state === "submitting" && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="mb-4 h-12 w-12 animate-spin text-purple-500" />
                <p className={cn("text-lg font-medium", isDark ? "text-white" : "text-gray-900")}>
                  Submitting your answers...
                </p>
              </div>
            )}

            {/* ── Results ──────────────────────── */}
            {state === "results" && quiz && attempt && (
              <ResultsView quiz={quiz} attempt={attempt} isDark={isDark} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuizTakePage;
