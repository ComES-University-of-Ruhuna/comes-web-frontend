import type { ComponentProps, ReactNode } from "react";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TeamPage } from "../src/pages/TeamPage";
import { TeamManagementPage } from "../src/pages/admin/TeamManagementPage";
import api from "../src/services/api";
import type { ApiTeamMember } from "../src/services/team.service";

vi.mock("../src/services/api", () => ({
  default: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/store", () => ({ useThemeStore: () => ({ resolvedTheme: "light" }) }));
vi.mock("@/components/ui", () => ({
  Section: ({ children }: { children: ReactNode }) => <section>{children}</section>,
  PageTransition: ({ children }: { children: ReactNode }) => <>{children}</>,
  Button: ({ children, onClick, disabled, type }: ComponentProps<"button">) => (
    <button onClick={onClick} disabled={disabled} type={type}>
      {children}
    </button>
  ),
}));

const member: ApiTeamMember = {
  _id: "member-1",
  name: "Saved President",
  role: "President",
  department: "executive",
  batch: "2024",
  avatar: "https://example.com/portrait.jpg",
  email: "president@example.com",
  contactNo: "+94701117791",
  linkedin: "https://linkedin.com/in/president",
  bio: "Committee biography",
  isActive: true,
  order: 0,
  term: { start: "2026-01-01T00:00:00Z" },
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(api.get).mockResolvedValue({ data: { success: true, data: { members: [member] } } });
});
afterEach(cleanup);

describe("published committee", () => {
  it("uses saved fields and category counts instead of static roster data", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        success: true,
        data: {
          members: [
            member,
            {
              ...member,
              _id: "advisor",
              name: "Faculty Advisor",
              department: "advisory",
              contactNo: undefined,
              bio: undefined,
            },
            { ...member, _id: "inactive", name: "Hidden Member", isActive: false },
          ],
        },
      },
    });
    render(<TeamPage />);
    await screen.findByRole("heading", { name: "Saved President" });
    expect(api.get).toHaveBeenCalledWith("/team?");
    expect(screen.queryByText("Hidden Member")).toBeNull();
    expect(screen.queryByText("Kavishka Kalhara")).toBeNull();
    expect(screen.getByRole("img", { name: "Saved President" }).getAttribute("src")).toBe(
      member.avatar,
    );
    expect(screen.getByRole("link", { name: member.contactNo }).getAttribute("href")).toBe(
      `tel:${member.contactNo}`,
    );
    expect(screen.getByText("Committee biography")).toBeTruthy();
    expect(screen.getByText("Executive leaders").parentElement?.textContent).toBe(
      "1Executive leaders",
    );
    fireEvent.click(screen.getByRole("tab", { name: "Executive Committee" }));
    await waitFor(() =>
      expect(screen.queryByRole("heading", { name: "Faculty Advisor" })).toBeNull(),
    );
  });

  it("does not restore hard-coded entries for an empty published list", async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { success: true, data: { members: [] } } });
    render(<TeamPage />);
    await screen.findByText("No committee members published in this category.");
    expect(screen.queryByText("Kavishka Kalhara")).toBeNull();
  });

  it("shows a failed load and allows retry", async () => {
    vi.mocked(api.get).mockRejectedValueOnce(new Error("Unavailable"));
    render(<TeamPage />);
    await screen.findByRole("alert");
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    await screen.findByRole("heading", { name: "Saved President" });
  });
});

describe("committee editor", () => {
  it("edits saved details, clears optional fields, and publishes the saved response", async () => {
    let saved = { ...member };
    vi.mocked(api.patch).mockImplementation(async (_url, data) => {
      saved = { ...saved, ...(data as Partial<ApiTeamMember>) };
      return { data: { success: true, data: { member: saved } } };
    });
    render(<TeamManagementPage />);
    await screen.findByRole("heading", { name: "Saved President" });
    expect(api.get).toHaveBeenCalledWith("/team?includeInactive=true");
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.change(within(dialog).getByLabelText("Full Name *"), {
      target: { value: "Updated President" },
    });
    fireEvent.change(within(dialog).getByLabelText("Phone Number"), {
      target: { value: "+94702223333" },
    });
    for (const label of ["Email", "Avatar URL", "LinkedIn URL"])
      fireEvent.change(within(dialog).getByLabelText(label), { target: { value: "" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Update Member" }));
    await screen.findByText("Team member updated successfully");
    expect(api.patch).toHaveBeenCalledWith(
      "/team/member-1",
      expect.objectContaining({
        name: "Updated President",
        contactNo: "+94702223333",
        email: "",
        avatar: "",
        linkedin: "",
      }),
    );
    cleanup();
    vi.mocked(api.get).mockResolvedValue({ data: { success: true, data: { members: [saved] } } });
    render(<TeamPage />);
    await screen.findByRole("heading", { name: "Updated President" });
    expect(screen.getByRole("link", { name: "+94702223333" })).toBeTruthy();
    expect(screen.queryByRole("link", { name: /on LinkedIn/ })).toBeNull();
  });

  it("keeps inactive members available for reactivation", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: { success: true, data: { members: [{ ...member, isActive: false }] } },
    });
    vi.mocked(api.patch).mockResolvedValue({ data: { data: { member } } });
    render(<TeamManagementPage />);
    await screen.findByRole("heading", { name: "Saved President" });
    fireEvent.click(screen.getByTitle("Inactive - Click to activate"));
    await waitFor(() =>
      expect(api.patch).toHaveBeenCalledWith("/team/member-1", { isActive: true }),
    );
  });

  it("prefills existing executives without creating records until the admin saves", async () => {
    render(<TeamManagementPage />);
    await screen.findByRole("heading", { name: "Saved President" });
    fireEvent.click(screen.getByRole("button", { name: "Add Member" }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.change(within(dialog).getByLabelText("Existing Executive Roster"), {
      target: { value: "exec-1" },
    });
    expect((within(dialog).getByLabelText("Full Name *") as HTMLInputElement).value).toBe(
      "Kavishka Kalhara",
    );
    expect((within(dialog).getByLabelText("Department") as HTMLSelectElement).value).toBe(
      "executive",
    );
    expect(api.post).not.toHaveBeenCalled();
    vi.mocked(api.post).mockResolvedValue({
      data: { data: { member: { ...member, _id: "member-2", name: "Kavishka Kalhara" } } },
    });
    fireEvent.change(within(dialog).getByLabelText("Batch"), { target: { value: "2024" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Add Member" }));
    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith(
        "/team",
        expect.objectContaining({
          name: "Kavishka Kalhara",
          department: "executive",
          batch: "2024",
        }),
      ),
    );
  });
});
