import { useRef, useState } from "react";
import { isAxiosError } from "axios";
import { Link, useParams, useSearchParams } from "react-router";
import { ArrowLeft, CheckCircle2, KeyRound, Mail } from "lucide-react";
import { useThemeStore } from "@/store";
import { Button, ThemeToggle } from "@/components/ui";
import { authService } from "@/services/auth.service";
import { studentService } from "@/services/student.service";
import { cn } from "@/utils";
import LogoBlack from "@/assets/logo/Logo Black Coloured.png";
import LogoWhite from "@/assets/logo/Logo White Coloured.png";

export const PasswordRecoveryPage = () => {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const account = searchParams.get("account") || (token ? "user" : "student");
  const invalidLink =
    !["student", "user"].includes(account) ||
    (token !== undefined && !/^[a-f0-9]{64}$/.test(token));
  const loginPath = account === "user" ? "/admin/login" : "/login";
  const service = account === "user" ? authService : studentService;
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (invalidLink || submitting.current || complete) return;
    submitting.current = true;
    setLoading(true);
    setError("");
    try {
      const response = token
        ? await service.resetPassword(token)
        : await service.forgotPassword(email.trim().toLowerCase());
      if (!response.success)
        throw new Error(response.message || "Password recovery failed. Please try again.");
      setComplete(true);
    } catch (failure) {
      setError(
        (isAxiosError<{ message?: string }>(failure) && failure.response?.data?.message) ||
          (failure instanceof Error
            ? failure.message
            : "Password recovery failed. Please try again."),
      );
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  };

  return (
    <main
      className={cn(
        "flex min-h-screen items-center justify-center px-4 py-24",
        isDark ? "bg-slate-950 text-white" : "bg-gray-50 text-gray-900",
      )}
    >
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <section
        className={cn(
          "w-full max-w-md rounded-lg border p-6 sm:p-8",
          isDark ? "border-slate-800 bg-slate-900" : "border-gray-200 bg-white",
        )}
      >
        <img
          src={isDark ? LogoWhite : LogoBlack}
          alt="ComES"
          className="mx-auto mb-6 h-24 w-auto object-contain"
        />
        <p className={cn("mb-2 text-center text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
          {account === "user" ? "Admin account" : "Student account"}
        </p>
        <h1 className="mb-6 text-center text-2xl font-bold">
          {complete
            ? token
              ? "New Password Sent"
              : "Check Your Email"
            : token
              ? "Reset Password"
              : "Forgot Password"}
        </h1>
        {complete ? (
          <div role="status" className="space-y-4 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
            <p className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-600")}>
              {token
                ? "Your new password has been emailed to you. Change it after signing in."
                : "If an account with that email exists, a password reset link has been sent."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" aria-busy={loading}>
            {(error || invalidLink) && (
              <p
                role="alert"
                className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500"
              >
                {invalidLink ? "This reset link is invalid. Request a new link." : error}
              </p>
            )}
            {!token && (
              <div>
                <label htmlFor="recovery-email" className="mb-2 block text-sm font-medium">
                  Email Address
                </label>
                <input
                  id="recovery-email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={cn(
                    "w-full rounded-lg border px-3 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
                    isDark ? "border-slate-700 bg-slate-800" : "border-gray-300 bg-white",
                  )}
                />
              </div>
            )}
            <Button
              type="submit"
              loading={loading}
              disabled={invalidLink || loading}
              className="w-full"
              icon={token ? <KeyRound className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
            >
              {token ? "Confirm Password Reset" : "Send Reset Link"}
            </Button>
          </form>
        )}
        {token && !complete && (
          <Link
            to={`/forgot-password?account=${account}`}
            className="mt-4 block text-center text-sm text-blue-500 hover:underline"
          >
            Request a new link
          </Link>
        )}
        <Link
          to={loginPath}
          className={cn(
            "mt-6 flex items-center justify-center gap-2 text-sm hover:underline",
            isDark ? "text-gray-400" : "text-gray-600",
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </section>
    </main>
  );
};
