import type { ComponentProps } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router";
import { PasswordRecoveryPage } from "../src/pages/PasswordRecoveryPage";
import { authService } from "../src/services/auth.service";
import { studentService } from "../src/services/student.service";

vi.mock("../src/services/auth.service", () => ({
  authService: { forgotPassword: vi.fn(), resetPassword: vi.fn() },
}));
vi.mock("../src/services/student.service", () => ({
  studentService: { forgotPassword: vi.fn(), resetPassword: vi.fn() },
}));
vi.mock("@/store", () => ({ useThemeStore: () => ({ resolvedTheme: "light" }) }));
vi.mock("@/components/ui", () => ({
  ThemeToggle: () => null,
  Button: ({
    children,
    type,
    disabled,
    loading,
  }: ComponentProps<"button"> & { loading?: boolean }) => (
    <button type={type} disabled={disabled || loading}>
      {children}
    </button>
  ),
}));

const renderPage = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/forgot-password" element={<PasswordRecoveryPage />} />
        <Route path="/reset-password/:token" element={<PasswordRecoveryPage />} />
      </Routes>
    </MemoryRouter>,
  );

describe("password recovery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    for (const service of [authService, studentService]) {
      vi.mocked(service.forgotPassword).mockResolvedValue({ success: true });
      vi.mocked(service.resetPassword).mockResolvedValue({ success: true });
    }
  });
  afterEach(cleanup);

  it.each([
    ["student", studentService, "/login"],
    ["user", authService, "/admin/login"],
  ] as const)("requests recovery for %s accounts", async (account, service, loginPath) => {
    renderPage(`/forgot-password?account=${account}`);
    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "Member@Example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send Reset Link" }));
    await screen.findByRole("heading", { name: "Check Your Email" });
    expect(service.forgotPassword).toHaveBeenCalledWith("member@example.com");
    expect(screen.getByRole("link", { name: "Back to sign in" }).getAttribute("href")).toBe(
      loginPath,
    );
  });

  it("requires explicit confirmation before resetting a password", async () => {
    const token = "a".repeat(64);
    renderPage(`/reset-password/${token}?account=student`);
    expect(studentService.resetPassword).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Confirm Password Reset" }));
    await screen.findByRole("heading", { name: "New Password Sent" });
    expect(studentService.resetPassword).toHaveBeenCalledExactlyOnceWith(token);
    expect(screen.queryByLabelText(/password/i)).toBeNull();
  });

  it("shows an expired-link failure and offers another reset link", async () => {
    vi.mocked(authService.resetPassword).mockRejectedValue(
      new Error("This reset link has expired."),
    );
    renderPage(`/reset-password/${"b".repeat(64)}?account=user`);
    fireEvent.click(screen.getByRole("button", { name: "Confirm Password Reset" }));
    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("expired"));
    expect(screen.getByRole("link", { name: "Request a new link" }).getAttribute("href")).toBe(
      "/forgot-password?account=user",
    );
  });

  it("rejects malformed links without calling the API", () => {
    renderPage("/reset-password/invalid?account=student");
    expect(
      (screen.getByRole("button", { name: "Confirm Password Reset" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    expect(studentService.resetPassword).not.toHaveBeenCalled();
  });
});
