import { AxiosError, AxiosHeaders } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { authService } from "../src/services";
import { useAuthStore } from "../src/store/authStore";

vi.hoisted(() => {
  vi.stubGlobal("localStorage", {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  });
});

vi.mock("../src/services", () => ({ authService: { login: vi.fn() } }));

describe("admin login errors", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
  });

  it.each(["Incorrect email or password", "This account has been deactivated"])(
    "displays the API's rejection reason: %s",
    async (message) => {
      vi.mocked(authService.login).mockRejectedValue(
        new AxiosError(
          "Request failed with status code 401",
          "ERR_BAD_REQUEST",
          undefined,
          undefined,
          {
            status: 401,
            statusText: "Unauthorized",
            headers: {},
            config: { headers: new AxiosHeaders() },
            data: { success: false, message },
          },
        ),
      );
      const result = await useAuthStore
        .getState()
        .login({ email: "admin@example.com", password: "test-only" });
      expect(result).toBe(false);
      expect(useAuthStore.getState()).toMatchObject({
        error: message,
        isLoading: false,
        isAuthenticated: false,
      });
    },
  );

  it("preserves network failures without a response body", async () => {
    vi.mocked(authService.login).mockRejectedValue(new Error("Network Error"));
    await useAuthStore.getState().login({ email: "admin@example.com", password: "test-only" });
    expect(useAuthStore.getState().error).toBe("Network Error");
  });
});
