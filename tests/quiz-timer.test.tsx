import { StrictMode, type ComponentProps } from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router";
import { QuizTakePage } from "../src/pages/student/QuizTakePage";
import { quizService, type ApiQuiz } from "../src/services";

vi.mock("../src/services", () => ({ quizService: { getById: vi.fn(), submitAttempt: vi.fn() } }));
vi.mock("@/store", () => ({ useThemeStore: () => ({ resolvedTheme: "light" }) }));
vi.mock("@/store/studentStore", () => {
  const student = { _id: "student-1", name: "Student" };
  return { useStudentStore: () => ({ student }) };
});
vi.mock("@/components/layout", () => ({ Navbar: () => null, Footer: () => null }));
vi.mock("@/components/ui", () => ({
  Button: ({ children, onClick, disabled }: ComponentProps<"button">) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  Badge: ({ children }: ComponentProps<"span">) => <span>{children}</span>,
}));

describe("quiz timer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const quiz: ApiQuiz = {
      _id: "quiz-1",
      slug: "timed-quiz",
      title: "Timed quiz",
      description: "",
      isVisible: true,
      totalMarks: 10,
      createdAt: "",
      updatedAt: "",
      questions: [
        {
          _id: "question-1",
          questionText: "Choose an answer",
          timeLimitSeconds: 1,
          marks: 10,
          answers: [
            { text: "First", isCorrect: true },
            { text: "Second", isCorrect: false },
          ],
        },
      ],
    };
    vi.mocked(quizService.getById).mockResolvedValue({ success: true, data: { quiz } });
    vi.mocked(quizService.submitAttempt).mockResolvedValue({
      success: false,
      message: "Test submission complete",
    });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("submits an unanswered timeout exactly once in Strict Mode", async () => {
    render(
      <StrictMode>
        <MemoryRouter initialEntries={["/student/quizzes/quiz-1"]}>
          <Routes>
            <Route path="/student/quizzes/:id" element={<QuizTakePage />} />
          </Routes>
        </MemoryRouter>
      </StrictMode>,
    );
    const startButton = await screen.findByRole("button", { name: /start quiz/i });
    vi.useFakeTimers();
    fireEvent.click(startButton);
    await act(async () => {
      vi.advanceTimersByTime(1100);
    });
    expect(quizService.submitAttempt).toHaveBeenCalledTimes(1);
    expect(quizService.submitAttempt).toHaveBeenCalledWith("quiz-1", {
      responses: [{ questionId: "question-1", selectedAnswerIndex: -1, responseTimeSeconds: 1 }],
    });
    await act(async () => {
      vi.advanceTimersByTime(5000);
    });
    expect(quizService.submitAttempt).toHaveBeenCalledTimes(1);
  });
});
