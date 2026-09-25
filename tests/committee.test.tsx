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
  it("offers the appointed executive positions in order and saves the selection", async () => {
    vi.mocked(api.patch).mockResolvedValueOnce({ data: { data: { member } } });
    render(<TeamManagementPage />);
    await screen.findByRole("heading", { name: member.name });
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    const role = screen.getByRole("combobox", { name: "Role" });
    expect(
      within(role)
        .getAllByRole("option")
        .map((option) => option.textContent),
    ).toEqual([
      "Select a position",
      "Senior Treasurer",
      "Immediate Past President",
      "President",
      "President-Elect",
      "Vice President",
      "Secretary",
      "Assistant Secretary",
      "Main Organizer",
      "Head of Marketing & Finance",
      "Head of Public Relations",
      "Head of Web & Creative Design",
      "Subgroup Chair \u2013 Electronic & Embed",
      "Subgroup Chair \u2013 Network & Security",
      "Subgroup Chair \u2013 AI & Data Science",
      "Subgroup Chair \u2013 Software Engineering",
      "Board Member",
    ]);
    fireEvent.change(role, { target: { value: "Senior Treasurer" } });
    fireEvent.click(screen.getByRole("button", { name: "Update Member" }));
    await waitFor(() =>
      expect(api.patch).toHaveBeenCalledWith(
        "/team/member-1",
        expect.objectContaining({ role: "Senior Treasurer", department: "executive" }),
      ),
    );
  });

  it("preserves legacy executive titles and keeps other departments' roles editable", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: { data: { members: [{ ...member, role: "Legacy Coordinator" }] } },
    });
    render(<TeamManagementPage />);
    await screen.findByRole("heading", { name: member.name });
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect((screen.getByRole("combobox", { name: "Role" }) as HTMLSelectElement).value).toBe(
      "Legacy Coordinator",
    );
    fireEvent.change(screen.getByRole("combobox", { name: "Department" }), {
      target: { value: "technical" },
    });
    const role = screen.getByRole("textbox", { name: "Role" });
    expect((role as HTMLInputElement).value).toBe("Legacy Coordinator");
    fireEvent.change(role, { target: { value: "Technical Lead" } });
    expect((role as HTMLInputElement).value).toBe("Technical Lead");
  });

  it("uploads a photo and saves its Cloudinary URL with the member", async () => {
    const url = "https://res.cloudinary.com/comes/image/upload/portrait.png";
    vi.mocked(api.post).mockResolvedValueOnce({ data: { data: { url } } });
    vi.mocked(api.patch).mockResolvedValueOnce({
      data: { data: { member: { ...member, avatar: url } } },
    });
    render(<TeamManagementPage />);
    await screen.findByRole("heading", { name: member.name });
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    const photo = new File(["photo"], "portrait.png", { type: "image/png" });
    fireEvent.change(screen.getByLabelText("Upload photo"), { target: { files: [photo] } });
    expect(
      (screen.getByRole("button", { name: "Update Member" }) as HTMLButtonElement).disabled,
    ).toBe(true);
    expect(
      (screen.getByRole("button", { name: "Close member editor" }) as HTMLButtonElement).disabled,
    ).toBe(true);
    await screen.findByText("Photo uploaded");
    expect(api.post).toHaveBeenCalledWith(
      "/team/avatar",
      expect.any(FormData),
      expect.objectContaining({ headers: { "Content-Type": "multipart/form-data" } }),
    );
    expect((vi.mocked(api.post).mock.calls[0][1] as FormData).get("image")).toBe(photo);
    expect(screen.getByRole("img", { name: "Member photo preview" }).getAttribute("src")).toBe(url);
    fireEvent.click(screen.getByRole("button", { name: "Update Member" }));
    await waitFor(() =>
      expect(api.patch).toHaveBeenCalledWith(
        "/team/member-1",
        expect.objectContaining({ avatar: url }),
      ),
    );
  });

  it("keeps the original photo after a failed upload and supports retry and removal", async () => {
    vi.mocked(api.post)
      .mockRejectedValueOnce(new Error("Offline"))
      .mockResolvedValueOnce({
        data: { data: { url: "https://res.cloudinary.com/comes/image/upload/new.png" } },
      });
    render(<TeamManagementPage />);
    await screen.findByRole("heading", { name: member.name });
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    const input = screen.getByLabelText("Upload photo");
    const photo = new File(["photo"], "portrait.png", { type: "image/png" });
    fireEvent.change(input, { target: { files: [photo] } });
    await screen.findByRole("alert");
    expect(screen.getByRole("img", { name: "Member photo preview" }).getAttribute("src")).toBe(
      member.avatar,
    );
    fireEvent.change(input, { target: { files: [photo] } });
    await screen.findByText("Photo uploaded");
    fireEvent.click(screen.getByRole("button", { name: "Remove photo" }));
    expect((screen.getByLabelText("Avatar URL") as HTMLInputElement).value).toBe("");
    expect(screen.queryByRole("img", { name: "Member photo preview" })).toBeNull();
  });

  it.each([
    ["image/svg+xml", 10],
    ["image/png", 3 * 1024 * 1024 + 1],
  ])("rejects unsupported or oversized photos before uploading", async (type, size) => {
    render(<TeamManagementPage />);
    await screen.findByRole("heading", { name: member.name });
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.change(screen.getByLabelText("Upload photo"), {
      target: { files: [new File([new Uint8Array(size)], "photo", { type })] },
    });
    await screen.findByRole("alert");
    expect(api.post).not.toHaveBeenCalled();
  });

  it("filters the directory with department tabs and search", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        success: true,
        data: {
          members: [
            member,
            { ...member, _id: "technical", name: "Technical Lead", department: "technical" },
          ],
        },
      },
    });
    render(<TeamManagementPage />);
    await screen.findByRole("heading", { name: "Saved President" });
    fireEvent.click(screen.getByRole("tab", { name: /Executive Committee/ }));
    expect(screen.queryByRole("heading", { name: "Technical Lead" })).toBeNull();
    expect(
      screen.getByRole("tab", { name: /Executive Committee/ }).getAttribute("aria-selected"),
    ).toBe("true");
    fireEvent.change(screen.getByRole("textbox", { name: "Search members" }), {
      target: { value: "missing member" },
    });
    expect(screen.getByText("No team members match your filters")).toBeTruthy();
    fireEvent.change(screen.getByRole("textbox", { name: "Search members" }), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("tab", { name: /All members/ }));
    expect(screen.getByRole("heading", { name: "Technical Lead" })).toBeTruthy();
  });

  it("refreshes the roster using the toolbar control", async () => {
    render(<TeamManagementPage />);
    await screen.findByRole("heading", { name: "Saved President" });
    fireEvent.click(screen.getByRole("button", { name: "Refresh members" }));
    await waitFor(() => expect(api.get).toHaveBeenCalledTimes(2));
  });

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
