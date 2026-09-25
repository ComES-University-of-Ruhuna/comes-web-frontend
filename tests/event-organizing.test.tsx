import type { ComponentProps, ReactNode } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { OrganizingWorkspace } from "../src/components/events/OrganizingWorkspace";
import { OrganizingPage } from "../src/pages/student/OrganizingPage";
import type { CommitteeAssignment, OrganizedEvent } from "../src/services/eventCommittee.service";
import api from "../src/services/api";

vi.mock("../src/services/api", () => ({
  default: { get: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/store", () => ({ useThemeStore: () => ({ resolvedTheme: "light" }) }));
vi.mock("@/components/layout", () => ({ Navbar: () => null, Footer: () => null }));
vi.mock("@/components/ui", () => ({
  Badge: ({ children }: { children: ReactNode }) => <span>{children}</span>,
  Button: ({ children, onClick, disabled, type }: ComponentProps<"button">) => (
    <button type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  ),
}));

const member = { _id: "student-1", name: "Alex Member", registrationNo: "EG/2024/0001" };
const event: OrganizedEvent = {
  _id: "event-1",
  title: "Community Workshop",
  slug: "community-workshop",
  description: "A saved community workshop description",
  type: "workshop",
  date: "2099-01-01T10:00:00Z",
  location: "Faculty Hall",
  status: "upcoming",
  registeredCount: 0,
  registrations: [],
  maxParticipants: 30,
  isRegistrationOpen: true,
  availableSpots: 30,
  tags: [],
  isFeatured: true,
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
  organizingCommittee: [
    {
      member,
      role: "Chair",
      team: "Operations",
      isChair: true,
      contributions: "Initial contribution",
    },
  ],
};
let saved: OrganizedEvent;
const response = () => ({ data: { success: true, data: { event: saved } } });

beforeEach(() => {
  vi.resetAllMocks();
  saved = structuredClone(event);
  vi.mocked(api.get).mockImplementation(async (url) =>
    String(url).includes("committee-members")
      ? { data: { data: { members: [member] } } }
      : String(url) === "/students/organized-events"
        ? { data: { data: { events: [saved] } } }
        : response(),
  );
  vi.mocked(api.put).mockImplementation(async (_url, assignment) => {
    const fields = assignment as Pick<CommitteeAssignment, "role" | "team" | "isChair">;
    const previous = saved.organizingCommittee.find((entry) => entry.member._id === member._id);
    saved = {
      ...saved,
      organizingCommittee: [{ member, contributions: previous?.contributions || "", ...fields }],
    };
    return response();
  });
  vi.mocked(api.patch).mockImplementation(async (url, data) => {
    const fields = data as Partial<OrganizedEvent> & { contributions?: string };
    saved = String(url).endsWith("/contributions")
      ? {
          ...saved,
          organizingCommittee: saved.organizingCommittee.map((entry) => ({
            ...entry,
            contributions: fields.contributions ?? "",
          })),
        }
      : { ...saved, ...fields };
    return response();
  });
  vi.mocked(api.delete).mockImplementation(async () => {
    saved = { ...saved, organizingCommittee: [] };
    return response();
  });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const renderWorkspace = (mode: "admin" | "chair" = "admin") =>
  render(
    <MemoryRouter initialEntries={["/event/event-1"]}>
      <Routes>
        <Route path="/event/:id" element={<OrganizingWorkspace mode={mode} />} />
      </Routes>
    </MemoryRouter>,
  );

it("searches registered members and saves a role, team, and explicit chair access", async () => {
  saved.organizingCommittee = [];
  renderWorkspace();
  await screen.findByRole("heading", { name: event.title });
  fireEvent.change(screen.getByRole("searchbox", { name: "Search members" }), {
    target: { value: "Alex" },
  });
  fireEvent.click(await screen.findByRole("button", { name: /Alex Member/ }));
  expect(api.get).toHaveBeenCalledWith("/events/committee-members", { params: { search: "Alex" } });
  fireEvent.change(screen.getByRole("textbox", { name: "Role" }), {
    target: { value: "OC Chair" },
  });
  fireEvent.change(screen.getByRole("textbox", { name: "Team" }), {
    target: { value: "Operations" },
  });
  fireEvent.click(screen.getByRole("checkbox", { name: "Chair access" }));
  fireEvent.click(screen.getByRole("button", { name: "Add member" }));
  await screen.findByText("OC member added.");
  expect(api.put).toHaveBeenCalledWith("/events/event-1/committee/student-1", {
    role: "OC Chair",
    team: "Operations",
    isChair: true,
  });
  expect(screen.getByRole("textbox", { name: "Role for Alex Member" }).getAttribute("value")).toBe(
    "OC Chair",
  );
});

it("does not offer an already assigned member as a duplicate", async () => {
  renderWorkspace();
  await screen.findByRole("heading", { name: event.title });
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "Alex" } });
  const result = await screen.findByRole("button", { name: /Alex Member.*Added/ });
  expect((result as HTMLButtonElement).disabled).toBe(true);
});

it("revokes chair access without discarding contribution notes", async () => {
  renderWorkspace();
  const access = await screen.findByRole("checkbox", { name: "Chair access for Alex Member" });
  fireEvent.click(access);
  fireEvent.click(screen.getByRole("button", { name: "Save assignment" }));
  await screen.findByText("Assignment saved.");
  expect(api.put).toHaveBeenCalledWith("/events/event-1/committee/student-1", {
    role: "Chair",
    team: "Operations",
    isChair: false,
  });
  expect(
    (screen.getByRole("textbox", { name: "Contributions for Alex Member" }) as HTMLTextAreaElement)
      .value,
  ).toBe("Initial contribution");
});

it("chairs can save contributions but have no assignment controls", async () => {
  renderWorkspace("chair");
  const notes = await screen.findByRole("textbox", { name: "Contributions for Alex Member" });
  expect(screen.queryByRole("searchbox")).toBeNull();
  expect(screen.queryByRole("checkbox")).toBeNull();
  expect(screen.queryByRole("button", { name: "Save assignment" })).toBeNull();
  expect(screen.queryByRole("button", { name: "Remove Alex Member" })).toBeNull();
  fireEvent.change(notes, { target: { value: "Prepared the workshop materials" } });
  fireEvent.click(screen.getByRole("button", { name: "Save contributions" }));
  await screen.findByText("Contributions saved.");
  expect(api.patch).toHaveBeenCalledWith(
    "/students/organized-events/event-1/committee/student-1/contributions",
    { contributions: "Prepared the workshop materials" },
  );
});

it("keeps contribution edits when saving fails", async () => {
  vi.mocked(api.patch).mockRejectedValueOnce(new Error("Unavailable"));
  renderWorkspace("chair");
  const notes = await screen.findByRole("textbox", { name: "Contributions for Alex Member" });
  fireEvent.change(notes, { target: { value: "Unsaved contribution" } });
  fireEvent.click(screen.getByRole("button", { name: "Save contributions" }));
  await screen.findByRole("alert");
  expect((notes as HTMLTextAreaElement).value).toBe("Unsaved contribution");
  fireEvent.click(screen.getByRole("button", { name: "Save contributions" }));
  await screen.findByText("Contributions saved.");
});

it("saves chair event details without sending admin-only fields", async () => {
  renderWorkspace("chair");
  fireEvent.click(await screen.findByRole("button", { name: "Edit event details" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Event Title" }), {
    target: { value: "Updated workshop" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Update Event" }));
  await screen.findByText("Event details saved.");
  expect(api.patch).toHaveBeenCalledWith(
    "/students/organized-events/event-1",
    expect.objectContaining({ title: "Updated workshop" }),
  );
  expect(vi.mocked(api.patch).mock.calls[0][1]).not.toHaveProperty("isFeatured");
  expect(vi.mocked(api.patch).mock.calls[0][1]).not.toHaveProperty("organizingCommittee");
});

it("keeps the event editor open and preserves details on failure", async () => {
  vi.mocked(api.patch).mockRejectedValueOnce(new Error("Denied"));
  renderWorkspace("chair");
  fireEvent.click(await screen.findByRole("button", { name: "Edit event details" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Event Title" }), {
    target: { value: "Unsaved title" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Update Event" }));
  await screen.findByRole("alert");
  expect((screen.getByRole("textbox", { name: "Event Title" }) as HTMLInputElement).value).toBe(
    "Unsaved title",
  );
});

it("denies unavailable chair workspaces without showing editing controls", async () => {
  vi.mocked(api.get).mockRejectedValueOnce(new Error("Not found"));
  renderWorkspace("chair");
  await screen.findByRole("alert");
  expect(screen.queryByRole("button", { name: "Edit event details" })).toBeNull();
  expect(screen.queryByRole("textbox")).toBeNull();
});

it("removes an assignment after confirmation", async () => {
  vi.spyOn(window, "confirm").mockReturnValue(true);
  renderWorkspace();
  fireEvent.click(await screen.findByRole("button", { name: "Remove Alex Member" }));
  await screen.findByText("OC member removed.");
  expect(api.delete).toHaveBeenCalledWith("/events/event-1/committee/student-1");
  expect(screen.getByText("No organizing committee members assigned.")).toBeTruthy();
});

it("lists only assignments returned by the chair API", async () => {
  render(
    <MemoryRouter>
      <OrganizingPage />
    </MemoryRouter>,
  );
  const link = await screen.findByRole("link", { name: /Community Workshop/ });
  expect(link.getAttribute("href")).toBe("/student/organizing/event-1");
  await waitFor(() => expect(api.get).toHaveBeenCalledWith("/students/organized-events"));
});
