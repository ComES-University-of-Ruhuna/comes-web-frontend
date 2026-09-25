import type { ComponentProps, ReactNode } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { OrganizingWorkspace } from "../src/components/events/OrganizingWorkspace";
import { OrganizingPage } from "../src/pages/student/OrganizingPage";
import { EventEditor } from "../src/pages/admin/EventsManagementPage";
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

it("saves an event image and local end time with only the three supported categories", async () => {
  const onSave = vi.fn().mockResolvedValue(undefined);
  render(<EventEditor event={event} onSave={onSave} onClose={vi.fn()} />);
  const types = screen.getByRole("combobox", { name: "Event Type" }) as HTMLSelectElement;
  expect(Array.from(types.options).map((option) => option.text)).toEqual([
    "Competition",
    "Workshop",
    "Other",
  ]);
  fireEvent.change(screen.getByLabelText("Event Image URL"), {
    target: { value: "https://example.com/event.jpg" },
  });
  fireEvent.change(screen.getByLabelText("End Date"), { target: { value: "2099-01-02" } });
  fireEvent.change(screen.getByLabelText("End Time"), { target: { value: "17:30" } });
  fireEvent.click(screen.getByRole("button", { name: "Update Event" }));
  await waitFor(() =>
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        image: "https://example.com/event.jpg",
        endDate: new Date("2099-01-02T17:30").toISOString(),
      }),
    ),
  );
});

it("rejects an end time before the start without discarding edits", async () => {
  const onSave = vi.fn();
  render(<EventEditor event={event} onSave={onSave} onClose={vi.fn()} />);
  fireEvent.change(screen.getByLabelText("End Date"), { target: { value: "2098-01-01" } });
  fireEvent.change(screen.getByLabelText("End Time"), { target: { value: "09:00" } });
  fireEvent.click(screen.getByRole("button", { name: "Update Event" }));
  await screen.findByText("End time must be after the start time.");
  expect(onSave).not.toHaveBeenCalled();
});

it("formats selected description text, previews it, and saves the Markdown", async () => {
  const onSave = vi.fn().mockResolvedValue(undefined);
  render(<EventEditor event={event} onSave={onSave} onClose={vi.fn()} />);
  const description = screen.getByRole("textbox", { name: "Description" }) as HTMLTextAreaElement;
  fireEvent.change(description, { target: { value: "Welcome to our workshop" } });
  description.setSelectionRange(0, 7);
  fireEvent.click(screen.getByRole("button", { name: "Bold" }));
  expect(description.value).toBe("**Welcome** to our workshop");
  fireEvent.click(screen.getByRole("button", { name: "Preview description" }));
  expect(
    screen.getByRole("region", { name: "Description preview" }).querySelector("strong")
      ?.textContent,
  ).toBe("Welcome");
  fireEvent.click(screen.getByRole("button", { name: "Update Event" }));
  await waitFor(() =>
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ description: "**Welcome** to our workshop" }),
    ),
  );
});

it("formats multiple lines as a numbered list and inserts an editable link", () => {
  render(<EventEditor event={event} onSave={vi.fn()} onClose={vi.fn()} />);
  const description = screen.getByRole("textbox", { name: "Description" }) as HTMLTextAreaElement;
  fireEvent.change(description, { target: { value: "Welcome\nWorkshop" } });
  description.setSelectionRange(0, description.value.length);
  fireEvent.click(screen.getByRole("button", { name: "Numbered list" }));
  expect(description.value).toBe("1. Welcome\n2. Workshop");
  description.setSelectionRange(description.value.length, description.value.length);
  fireEvent.click(screen.getByRole("button", { name: "Link" }));
  expect(description.value).toContain("[Link text](https://example.com)");
  expect(description.value.slice(description.selectionStart, description.selectionEnd)).toBe(
    "https://example.com",
  );
});

it("saves custom registration and clears its URL when switching to platform", async () => {
  const onSave = vi.fn().mockResolvedValue(undefined);
  render(<EventEditor event={event} onSave={onSave} onClose={vi.fn()} />);
  expect((screen.getByLabelText("Registration") as HTMLSelectElement).value).toBe("platform");
  fireEvent.change(screen.getByLabelText("Registration"), { target: { value: "custom" } });
  fireEvent.change(screen.getByLabelText("Registration URL"), {
    target: { value: "https://forms.example.com/event" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Update Event" }));
  await waitFor(() =>
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        registrationMode: "custom",
        registrationUrl: "https://forms.example.com/event",
      }),
    ),
  );
  await waitFor(() =>
    expect(
      (screen.getByRole("button", { name: "Update Event" }) as HTMLButtonElement).disabled,
    ).toBe(false),
  );
  fireEvent.change(screen.getByLabelText("Registration"), { target: { value: "platform" } });
  fireEvent.click(screen.getByRole("button", { name: "Update Event" }));
  await waitFor(() =>
    expect(onSave).toHaveBeenLastCalledWith(
      expect.objectContaining({ registrationMode: "platform", registrationUrl: "" }),
    ),
  );
});

it("preserves the existing image and allows clearing the end time", async () => {
  const onSave = vi.fn().mockResolvedValue(undefined);
  render(
    <EventEditor
      event={{ ...event, image: "https://example.com/saved.jpg", endDate: "2099-01-02T17:30:00Z" }}
      onSave={onSave}
      onClose={vi.fn()}
    />,
  );
  expect((screen.getByLabelText("End Date") as HTMLInputElement).value).not.toBe("");
  fireEvent.change(screen.getByLabelText("End Date"), { target: { value: "" } });
  fireEvent.change(screen.getByLabelText("End Time"), { target: { value: "" } });
  fireEvent.click(screen.getByRole("button", { name: "Update Event" }));
  await waitFor(() =>
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ image: "https://example.com/saved.jpg", endDate: null }),
    ),
  );
});

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
