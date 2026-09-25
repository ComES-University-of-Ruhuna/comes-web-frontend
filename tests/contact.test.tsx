import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { ContactPage } from "../src/pages/ContactPage";
import { ContactsPage } from "../src/pages/admin/ContactsPage";
import type { ContactList, ContactSubmission } from "../src/services/contact.service";
import api from "../src/services/api";

vi.hoisted(() => {
  const storage = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
  });
});
vi.mock("../src/services/api", () => ({
  default: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));
vi.mock("../src/store/themeStore", () => ({ useThemeStore: () => ({ resolvedTheme: "light" }) }));
const message: ContactSubmission = {
  _id: "contact-1",
  name: "Contact Visitor",
  email: "visitor@example.com",
  subject: "Membership question",
  message: "Please send the membership application details.",
  status: "new",
  createdAt: "2026-09-25T12:00:00Z",
};
let messages: ContactSubmission[];
const listResponse = (contacts: ContactSubmission[], page = 1) => ({
  data: {
    success: true,
    data: {
      contacts: contacts.slice((page - 1) * 20, page * 20),
      pagination: {
        page,
        limit: 20,
        total: contacts.length,
        pages: Math.ceil(contacts.length / 20),
      },
    },
  },
});
beforeEach(() => {
  vi.resetAllMocks();
  messages = [{ ...message }];
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    },
  );
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, "close", {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.removeAttribute("open");
    },
  });
  vi.spyOn(window, "confirm").mockReturnValue(true);
  vi.mocked(api.get).mockImplementation(async (url, config) => {
    if (url === "/contact") {
      const params = config?.params as { page: number; status?: string; search?: string };
      const filtered = messages.filter(
        (entry) =>
          (!params.status || entry.status === params.status) &&
          (!params.search ||
            `${entry.name} ${entry.email} ${entry.subject}`
              .toLowerCase()
              .includes(params.search.toLowerCase())),
      );
      return listResponse(filtered, params.page);
    }
    const found = messages.find((entry) => `/contact/${entry._id}` === url)!;
    const contact = { ...found, status: found.status === "new" ? ("read" as const) : found.status };
    messages = messages.map((entry) => (entry._id === contact._id ? contact : entry));
    return { data: { success: true, data: { contact } } };
  });
  vi.mocked(api.post).mockImplementation(async (_url, data) => {
    messages.unshift({ ...message, ...(data as ContactSubmission), _id: "new-contact" });
    return { data: { success: true, data: { id: "new-contact" } } };
  });
  vi.mocked(api.patch).mockImplementation(async (url, data) => {
    messages = messages.map((entry) =>
      `/contact/${entry._id}` === url
        ? { ...entry, ...(data as Partial<ContactSubmission>) }
        : entry,
    );
    return {
      data: {
        success: true,
        data: { contact: messages.find((entry) => `/contact/${entry._id}` === url) },
      },
    };
  });
  vi.mocked(api.delete).mockImplementation(async (url) => {
    messages = messages.filter((entry) => `/contact/${entry._id}` !== url);
    return { data: { success: true, data: null } };
  });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it("shows a public contact-form submission in the admin inbox instead of samples", async () => {
  messages = [];
  const publicPage = render(
    <MemoryRouter>
      <ContactPage />
    </MemoryRouter>,
  );
  fireEvent.change(screen.getByLabelText(/^Your Name/), { target: { value: message.name } });
  fireEvent.change(screen.getByLabelText(/^Email Address/), { target: { value: message.email } });
  const subject = screen.getByLabelText(/^Subject/) as HTMLSelectElement;
  fireEvent.change(subject, { target: { value: subject.options[1].value } });
  fireEvent.change(screen.getByLabelText(/^Your Message/), { target: { value: message.message } });
  fireEvent.click(screen.getByRole("button", { name: "Send Message" }));
  expect(await screen.findByText("Message Sent Successfully!")).toBeTruthy();
  expect(api.post).toHaveBeenCalledWith(
    "/contact",
    expect.objectContaining({ name: message.name, email: message.email, message: message.message }),
  );
  publicPage.unmount();
  render(<ContactsPage />);
  expect(await screen.findByText(message.name)).toBeTruthy();
  expect(screen.getByText("1 message")).toBeTruthy();
  expect(screen.queryByText("Sarah Johnson")).toBeNull();
  expect(api.get).toHaveBeenCalledWith("/contact", {
    params: { page: 1, limit: 20, search: undefined, status: undefined },
  });
});

it("marks opened messages read and persists archiving across remounts", async () => {
  const view = render(<ContactsPage />);
  fireEvent.click(await screen.findByRole("button", { name: `Open message: ${message.subject}` }));
  const dialog = await screen.findByRole("dialog", { name: "Message Details" });
  expect((within(dialog).getByLabelText("Message status") as HTMLSelectElement).value).toBe("read");
  expect(api.get).toHaveBeenCalledWith("/contact/contact-1");
  expect(within(dialog).getByRole("link").getAttribute("href")).toBe(
    "mailto:visitor%40example.com?subject=Re%3A%20Membership%20question",
  );
  fireEvent.click(within(dialog).getByRole("button", { name: "Archive" }));
  await waitFor(() =>
    expect((within(dialog).getByLabelText("Message status") as HTMLSelectElement).value).toBe(
      "archived",
    ),
  );
  expect(api.patch).toHaveBeenCalledWith("/contact/contact-1", { status: "archived" });
  fireEvent.keyDown(dialog, { key: "Escape" });
  expect(screen.queryByRole("dialog")).toBeNull();
  view.unmount();
  render(<ContactsPage />);
  expect(await screen.findByText("archived")).toBeTruthy();
});

it("uses server-side search and resets pagination when the status changes", async () => {
  messages = Array.from({ length: 21 }, (_, index) => ({
    ...message,
    _id: `contact-${index}`,
    subject: `Question ${index}`,
    status: index === 20 ? "archived" : "new",
  }));
  render(<ContactsPage />);
  fireEvent.click(await screen.findByRole("button", { name: "Next page" }));
  expect(await screen.findByRole("button", { name: "Open message: Question 20" })).toBeTruthy();
  fireEvent.change(screen.getByLabelText("Filter by status"), { target: { value: "archived" } });
  await waitFor(() =>
    expect(api.get).toHaveBeenLastCalledWith("/contact", {
      params: { page: 1, limit: 20, status: "archived", search: undefined },
    }),
  );
  fireEvent.change(screen.getByLabelText("Search messages"), { target: { value: "Question 20" } });
  await waitFor(() =>
    expect(api.get).toHaveBeenLastCalledWith("/contact", {
      params: { page: 1, limit: 20, status: "archived", search: "Question 20" },
    }),
  );
  expect(await screen.findByRole("button", { name: "Open message: Question 20" })).toBeTruthy();
  expect(screen.queryByRole("navigation", { name: "Pagination" })).toBeNull();
});

it("confirms deletion and returns to the previous page after deleting its last item", async () => {
  messages = Array.from({ length: 21 }, (_, index) => ({
    ...message,
    _id: `contact-${index}`,
    subject: `Question ${index}`,
  }));
  render(<ContactsPage />);
  fireEvent.click(await screen.findByRole("button", { name: "Next page" }));
  const remove = await screen.findByRole("button", { name: "Delete message: Question 20" });
  vi.mocked(window.confirm).mockReturnValueOnce(false);
  fireEvent.click(remove);
  expect(api.delete).not.toHaveBeenCalled();
  fireEvent.click(remove);
  await waitFor(() => expect(api.delete).toHaveBeenCalledWith("/contact/contact-20"));
  expect(await screen.findByRole("button", { name: "Open message: Question 0" })).toBeTruthy();
  expect(screen.queryByRole("navigation", { name: "Pagination" })).toBeNull();
  expect(messages).toHaveLength(20);
});

it("distinguishes loading and failed requests from an empty inbox and supports retry", async () => {
  vi.mocked(api.get).mockRejectedValueOnce(new Error("Inbox offline"));
  render(<ContactsPage />);
  expect(screen.getByRole("status").textContent).toBe("Loading messages...");
  expect((await screen.findByRole("alert")).textContent).toContain("Inbox offline");
  expect(screen.queryByText("No messages found")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Retry" }));
  expect(await screen.findByText(message.name)).toBeTruthy();
  messages = [];
  fireEvent.click(screen.getByRole("button", { name: "Refresh messages" }));
  expect(await screen.findByText("No messages found")).toBeTruthy();
});

it("keeps a message unchanged when an update or deletion fails", async () => {
  vi.mocked(api.patch).mockRejectedValueOnce(new Error("Archive failed"));
  vi.mocked(api.delete).mockRejectedValueOnce(new Error("Delete failed"));
  render(<ContactsPage />);
  fireEvent.click(await screen.findByRole("button", { name: `Open message: ${message.subject}` }));
  const dialog = await screen.findByRole("dialog", { name: "Message Details" });
  fireEvent.click(within(dialog).getByRole("button", { name: "Archive" }));
  expect((await within(dialog).findByRole("alert")).textContent).toBe("Archive failed");
  expect((within(dialog).getByLabelText("Message status") as HTMLSelectElement).value).toBe("read");
  fireEvent.click(within(dialog).getByRole("button", { name: "Delete" }));
  await waitFor(() => expect(within(dialog).getByRole("alert").textContent).toBe("Delete failed"));
  expect(messages).toHaveLength(1);
});

it("ignores stale list responses after changing the search", async () => {
  let resolveFirst:
    | ((value: { data: { success: boolean; data: ContactList } }) => void)
    | undefined;
  vi.mocked(api.get).mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        resolveFirst = resolve;
      }),
  );
  render(<ContactsPage />);
  fireEvent.change(screen.getByLabelText("Search messages"), { target: { value: "missing" } });
  expect(await screen.findByText("No messages found")).toBeTruthy();
  await act(async () => resolveFirst?.(listResponse([message])));
  expect(screen.queryByText(message.name)).toBeNull();
});
