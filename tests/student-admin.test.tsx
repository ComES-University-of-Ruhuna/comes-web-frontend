import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { ProtectedRoute } from "../src/components/ProtectedRoute";
import { DashboardSwitch } from "../src/components/ui/DashboardSwitch";
import { AdminLayout } from "../src/pages/admin/AdminLayout";
import { useStudentStore } from "../src/store/studentStore";
import { useAuthStore } from "../src/store/authStore";
import api, {
  setAccessToken,
  setStudentAccessToken,
  setStudentAdminAccess,
} from "../src/services/api";
import { STORAGE_KEYS } from "../src/config";

vi.mock("../src/store/themeStore", () => ({ useThemeStore: () => ({ resolvedTheme: "light" }) }));

vi.hoisted(() => {
  const values = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => values.set(key, value)),
    removeItem: vi.fn((key: string) => values.delete(key)),
    clear: () => values.clear(),
  });
});

const student = {
  _id: "student-1",
  name: "Student Admin",
  email: "student@example.com",
  username: "student",
  registrationNo: "EG/2024/0001",
  batch: "2024",
  isEmailVerified: true,
  createdAt: "2026-01-01",
  role: "admin" as const,
};

const renderDashboards = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/student/dashboard"
          element={
            <>
              <DashboardSwitch />
              <h1>Student dashboard</h1>
            </>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <DashboardSwitch />
              <h1>Admin dashboard</h1>
            </ProtectedRoute>
          }
        />
        <Route path="/admin/login" element={<h1>Admin login</h1>} />
      </Routes>
    </MemoryRouter>,
  );

const response = (config: InternalAxiosRequestConfig): AxiosResponse => ({
  data: { success: true },
  status: 200,
  statusText: "OK",
  headers: {},
  config,
});
const originalAdapter = api.defaults.adapter;

beforeEach(() => {
  localStorage.clear();
  setAccessToken(null);
  setStudentAccessToken(null);
  setStudentAdminAccess(false);
  useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false });
  useStudentStore.setState({ student, isAuthenticated: true, isLoading: false });
});

afterEach(() => {
  cleanup();
  api.defaults.adapter = originalAdapter;
  vi.restoreAllMocks();
});

describe("student administrator dashboards", () => {
  it("keeps real notification tools without placeholder website settings", () => {
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <AdminLayout />
      </MemoryRouter>,
    );
    expect(screen.queryByRole("link", { name: "Settings" })).toBeNull();
    expect(screen.getByRole("link", { name: "Notifications" }).getAttribute("href")).toBe(
      "/admin/notifications",
    );
    expect(screen.getByRole("navigation", { name: "Dashboard switch" })).toBeTruthy();
  });

  it("switches between both dashboards without a separate admin login", () => {
    renderDashboards("/student/dashboard");
    fireEvent.click(screen.getByRole("link", { name: "Admin" }));
    expect(screen.getByRole("heading", { name: "Admin dashboard" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Admin" }).getAttribute("aria-current")).toBe("page");
    fireEvent.click(screen.getByRole("link", { name: "Student" }));
    expect(screen.getByRole("heading", { name: "Student dashboard" })).toBeTruthy();
  });

  it("supports direct navigation to admin after session restoration", () => {
    renderDashboards("/admin");
    expect(screen.getByRole("heading", { name: "Admin dashboard" })).toBeTruthy();
  });

  it("hides the switch and denies admin routes to regular students", () => {
    useStudentStore.setState({ student: { ...student, role: "student" } });
    renderDashboards("/admin");
    expect(screen.getByRole("heading", { name: "Student dashboard" })).toBeTruthy();
    expect(screen.queryByRole("navigation", { name: "Dashboard switch" })).toBeNull();
  });

  it("waits for student authentication before rendering admin content", () => {
    useStudentStore.setState({ isLoading: true });
    renderDashboards("/admin");
    expect(screen.queryByRole("heading", { name: "Admin dashboard" })).toBeNull();
  });

  it("redirects unauthenticated visitors to admin login", () => {
    useStudentStore.setState({ student: null, isAuthenticated: false });
    renderDashboards("/admin");
    expect(screen.getByRole("heading", { name: "Admin login" })).toBeTruthy();
  });
});

describe("student administrator token routing", () => {
  it("uses a regular student's token for chair requests without granting admin access", async () => {
    setStudentAccessToken("chair-token");
    setAccessToken("other-admin-token");
    setStudentAdminAccess(false);
    const adapter = vi.fn(async (config: InternalAxiosRequestConfig) => response(config));
    api.defaults.adapter = adapter;
    await api.get("/students/organized-events");
    await api.patch("/students/organized-events/event-1", { title: "Chair update" });
    expect(
      adapter.mock.calls.every(([config]) => config.headers.Authorization === "Bearer chair-token"),
    ).toBe(true);
  });
  it("uses the student admin session even when another user token exists", async () => {
    setAccessToken("user-token");
    setStudentAccessToken("student-token");
    setStudentAdminAccess(true);
    const adapter = vi.fn(async (config: InternalAxiosRequestConfig) => response(config));
    api.defaults.adapter = adapter;
    await api.get("/students");
    expect(adapter.mock.calls[0][0].headers.Authorization).toBe("Bearer student-token");
    await api.get("/auth/me");
    expect(adapter.mock.calls[1][0].headers.Authorization).toBe("Bearer user-token");
  });

  it("preserves standalone admin authentication", async () => {
    setAccessToken("user-token");
    setStudentAccessToken("student-token");
    const adapter = vi.fn(async (config: InternalAxiosRequestConfig) => response(config));
    api.defaults.adapter = adapter;
    await api.get("/students");
    expect(adapter.mock.calls[0][0].headers.Authorization).toBe("Bearer user-token");
    await api.get("/students/me");
    expect(adapter.mock.calls[1][0].headers.Authorization).toBe("Bearer student-token");
  });

  it.each(["/students", "/quizzes/quiz-1/attempt", "/students/organized-events/event-1"])(
    "refreshes the student session for %s",
    async (url) => {
      setStudentAccessToken("old-student-token");
      setStudentAdminAccess(url === "/students");
      localStorage.setItem(STORAGE_KEYS.studentRefreshToken, "student-refresh");
      const refresh = vi
        .spyOn(axios, "post")
        .mockResolvedValue({ data: { data: { accessToken: "new-student-token" } } });
      const adapter = vi.fn(async (config: InternalAxiosRequestConfig) => {
        if (config.headers.Authorization === "Bearer old-student-token") {
          throw new AxiosError("Expired", "ERR_BAD_REQUEST", config, undefined, {
            ...response(config),
            status: 401,
            headers: new AxiosHeaders(),
          });
        }
        return response(config);
      });
      api.defaults.adapter = adapter;
      await api.request({ url, method: url === "/students" ? "get" : "post" });
      expect(refresh).toHaveBeenCalledWith(
        expect.stringContaining("/students/refresh-token"),
        { refreshToken: "student-refresh" },
        { withCredentials: true },
      );
      expect(adapter).toHaveBeenCalledTimes(2);
      expect(adapter.mock.calls[1][0].headers.Authorization).toBe("Bearer new-student-token");
    },
  );

  it("removes student admin token selection on logout", async () => {
    setStudentAdminAccess(true);
    setStudentAccessToken("student-token");
    setAccessToken("user-token");
    useStudentStore.getState().logout();
    const adapter = vi.fn(async (config: InternalAxiosRequestConfig) => response(config));
    api.defaults.adapter = adapter;
    await api.get("/students");
    expect(adapter.mock.calls[0][0].headers.Authorization).toBe("Bearer user-token");
  });
});
