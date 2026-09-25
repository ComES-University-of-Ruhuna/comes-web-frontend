import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
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
import { ProfilePage } from "../src/pages/student/ProfilePage";

vi.mock("../src/store/themeStore", () => ({ useThemeStore: () => ({ resolvedTheme: "light" }) }));
vi.mock("../src/components/layout", () => ({ Navbar: () => null, Footer: () => null }));

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

describe("student profile photo uploads", () => {
  const oldAvatar = "https://res.cloudinary.com/test/image/upload/old.png";
  const newAvatar = "https://res.cloudinary.com/test/image/upload/new.png";
  const profileStudent = { ...student, role: "student" as const, avatar: oldAvatar };
  const file = new File(["photo"], "profile.png", { type: "image/png" });
  const renderProfile = () =>
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );
  const choosePhoto = (photo: File) =>
    fireEvent.change(screen.getByLabelText("Choose profile photo"), { target: { files: [photo] } });
  const savedResponse = (config: InternalAxiosRequestConfig): AxiosResponse => ({
    ...response(config),
    data: { success: true, data: { student: { ...profileStudent, avatar: newAvatar } } },
  });

  beforeEach(() => {
    useStudentStore.setState({ student: profileStudent });
    setStudentAccessToken("photo-owner-token");
    setAccessToken("another-admin-token");
  });

  it("uploads with progress, persists the photo, and preserves unsaved profile fields", async () => {
    let finish: (() => void) | undefined;
    const adapter = vi.fn(
      (config: InternalAxiosRequestConfig) =>
        new Promise<AxiosResponse>((resolve) => {
          config.onUploadProgress?.({ loaded: 50, total: 100, bytes: 50, lengthComputable: true });
          finish = () => resolve(savedResponse(config));
        }),
    );
    api.defaults.adapter = adapter;
    renderProfile();
    fireEvent.click(screen.getByRole("button", { name: "Edit Profile" }));
    const name = screen.getByDisplayValue(student.name) as HTMLInputElement;
    fireEvent.change(name, { target: { value: "Unsaved name" } });
    choosePhoto(file);
    await waitFor(() => expect(adapter).toHaveBeenCalledTimes(1));
    expect(screen.getByRole("status").textContent).toContain("50%");
    expect(
      (screen.getByRole("button", { name: "Save Changes" }) as HTMLButtonElement).disabled,
    ).toBe(true);
    expect(
      (screen.getByRole("button", { name: "Change profile photo" }) as HTMLButtonElement).disabled,
    ).toBe(true);
    const config = adapter.mock.calls[0][0];
    expect(config.url).toBe("/students/me/avatar");
    expect(config.headers.Authorization).toBe("Bearer photo-owner-token");
    expect(config.timeout).toBe(90000);
    expect(config.data.get("image")).toBe(file);
    await act(async () => finish?.());
    expect(await screen.findByText("Profile photo updated.")).toBeTruthy();
    expect(screen.getByRole("img", { name: student.name }).getAttribute("src")).toBe(newAvatar);
    expect(useStudentStore.getState().student?.avatar).toBe(newAvatar);
    expect(JSON.parse(localStorage.getItem("student-auth-storage")!).state.student.avatar).toBe(
      newAvatar,
    );
    expect(name.value).toBe("Unsaved name");
    expect(
      (screen.getByRole("button", { name: "Save Changes" }) as HTMLButtonElement).disabled,
    ).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(name.value).toBe(student.name);
    expect(useStudentStore.getState().student?.avatar).toBe(newAvatar);
  });

  it("retains the current photo after failure and retries the same file", async () => {
    const adapter = vi
      .fn()
      .mockImplementationOnce(async (config: InternalAxiosRequestConfig) => {
        throw new AxiosError("Upload failed", "ERR_BAD_RESPONSE", config, undefined, {
          ...response(config),
          status: 502,
          data: { message: "Image upload failed. Please try again." },
        });
      })
      .mockImplementationOnce(async (config: InternalAxiosRequestConfig) => savedResponse(config));
    api.defaults.adapter = adapter;
    renderProfile();
    choosePhoto(file);
    expect((await screen.findByRole("alert")).textContent).toContain(
      "Image upload failed. Please try again.",
    );
    expect(useStudentStore.getState().student?.avatar).toBe(oldAvatar);
    expect(screen.getByRole("img", { name: student.name }).getAttribute("src")).toBe(oldAvatar);
    fireEvent.click(screen.getByRole("button", { name: "Retry photo upload" }));
    expect(await screen.findByText("Profile photo updated.")).toBeTruthy();
    expect(adapter).toHaveBeenCalledTimes(2);
    expect(adapter.mock.calls[1][0].data.get("image")).toBe(file);
  });

  it.each([
    new File(["svg"], "photo.svg", { type: "image/svg+xml" }),
    new File([new Uint8Array(3 * 1024 * 1024 + 1)], "large.png", { type: "image/png" }),
    new File([], "empty.png", { type: "image/png" }),
  ])("rejects invalid files before uploading: $name", (photo) => {
    const adapter = vi.fn();
    api.defaults.adapter = adapter;
    renderProfile();
    choosePhoto(photo);
    expect(screen.getByRole("alert").textContent).toContain(
      "Choose a JPEG, PNG, or WebP image up to 3 MB.",
    );
    expect(adapter).not.toHaveBeenCalled();
    expect(useStudentStore.getState().student?.avatar).toBe(oldAvatar);
  });
});

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
  it("uses the student's token for profile uploads even with a separate admin session", async () => {
    setStudentAccessToken("profile-student-token");
    setAccessToken("other-admin-token");
    setStudentAdminAccess(false);
    const adapter = vi.fn(async (config: InternalAxiosRequestConfig) => response(config));
    api.defaults.adapter = adapter;
    await api.post("/students/me/avatar", new FormData(), {
      headers: { "Content-Type": "multipart/form-data" },
    });
    expect(adapter.mock.calls[0][0].headers.Authorization).toBe("Bearer profile-student-token");
  });
  it("uses a regular student's token for chair requests without granting admin access", async () => {
    setStudentAccessToken("chair-token");
    setAccessToken("other-admin-token");
    setStudentAdminAccess(false);
    const adapter = vi.fn(async (config: InternalAxiosRequestConfig) => response(config));
    api.defaults.adapter = adapter;
    await api.get("/students/organized-events");
    await api.patch("/students/organized-events/event-1", { title: "Chair update" });
    await api.post("/students/organized-events/event-1/image", new FormData(), {
      headers: { "Content-Type": "multipart/form-data" },
    });
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

  it.each([
    "/students",
    "/quizzes/quiz-1/attempt",
    "/students/organized-events/event-1",
    "/students/me/avatar",
  ])("refreshes the student session for %s", async (url) => {
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
  });

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
