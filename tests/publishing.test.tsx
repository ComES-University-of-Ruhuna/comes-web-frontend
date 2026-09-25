import type { ComponentProps, ReactNode } from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { BlogPage } from "../src/pages/BlogPage";
import { BlogPostPage } from "../src/pages/BlogPostPage";
import { ProjectsPage } from "../src/pages/ProjectsPage";
import { EventsPage } from "../src/pages/EventsPage";
import { EventCommitteeTable } from "../src/components/events/EventCommitteeTable";
import { useEvents } from "../src/hooks/useApi";
import type { ApiEvent } from "../src/services/events.service";
import { BlogManagementPage } from "../src/pages/admin/BlogManagementPage";
import { ProjectsManagementPage } from "../src/pages/admin/ProjectsManagementPage";
import api from "../src/services/api";

vi.hoisted(() => {
  const storage = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
    clear: () => storage.clear(),
  });
});

vi.mock("../src/services/api", () => ({
  default: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/store", () => ({ useThemeStore: () => ({ resolvedTheme: "light" }) }));
vi.mock("@/components/ui", () => {
  const Wrapper = ({ children }: { children: ReactNode }) => <div>{children}</div>;
  return {
    Section: Wrapper,
    PageTransition: Wrapper,
    FadeInView: Wrapper,
    HoverScale: Wrapper,
    Card: Wrapper,
    CardHeader: Wrapper,
    CardBody: Wrapper,
    Badge: Wrapper,
    SectionHeader: ({ title }: { title: string }) => <h2>{title}</h2>,
    NewsletterSection: () => null,
    Button: ({
      children,
      onClick,
      disabled,
      type,
      href,
    }: ComponentProps<"button"> & { href?: string }) =>
      href ? (
        <a href={href}>{children}</a>
      ) : (
        <button onClick={onClick} disabled={disabled} type={type}>
          {children}
        </button>
      ),
  };
});

const post = {
  _id: "saved-post",
  title: "Saved community update",
  slug: "saved-community-update",
  excerpt: "News from our committee",
  content: "## Published content\n\nA saved article with **Markdown** and enough text to publish.",
  category: "Tech",
  status: "published",
  coverImage: "https://example.com/article.jpg",
  author: null,
  tags: [],
  views: 0,
  likes: 0,
  isFeatured: false,
  readTime: 1,
  publishedAt: "2026-01-01",
  createdAt: "2026-01-01",
};
const project = {
  _id: "saved-project",
  title: "Saved research project",
  description: "A real community project",
  shortDescription: "A real community project",
  category: "Web",
  status: "in-progress",
  technologies: ["React"],
  team: [],
  teamMembers: ["Alex"],
  image: "https://example.com/project.jpg",
  demoUrl: "https://example.com/demo",
  githubUrl: "https://github.com/example/project",
  isFeatured: false,
};
let posts: (typeof post)[];
let projects: (typeof project)[];
const savedEvent: ApiEvent = {
  _id: "saved-event",
  slug: "saved-community-event",
  title: "Saved community event",
  description: "An event created by the committee",
  type: "workshop",
  date: "2099-06-15T10:00:00Z",
  endDate: "2099-06-15T17:00:00Z",
  location: "Engineering faculty",
  registeredCount: 2,
  registrations: ["member-1", "member-2"],
  maxParticipants: 10,
  isRegistrationOpen: true,
  availableSpots: 8,
  image: "https://example.com/event.jpg",
  tags: ["Technology"],
  status: "upcoming",
  isFeatured: true,
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
};
let upcomingEvents: ApiEvent[];
let completedEvents: ApiEvent[];
beforeEach(() => {
  vi.resetAllMocks();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    },
  );
  posts = [post];
  projects = [project];
  upcomingEvents = [savedEvent];
  completedEvents = [
    {
      ...savedEvent,
      _id: "completed-event",
      title: "Saved completed event",
      date: "2026-01-01",
      status: "completed",
      isRegistrationOpen: false,
    },
  ];
  vi.mocked(api.get).mockImplementation(async (url) => {
    const path = String(url);
    const pagination = { page: 1, pages: 1, total: 1, limit: 12 };
    if (path.startsWith("/events?")) {
      const events = path.includes("period=past") ? completedEvents : upcomingEvents;
      return {
        data: {
          success: true,
          data: { events, pagination: { ...pagination, total: events.length } },
        },
      };
    }
    const data = path.includes("/blog/featured")
      ? { posts: [] }
      : path.includes("/projects/featured")
        ? { projects: [] }
        : path.includes("/categories")
          ? { categories: ["Web"] }
          : path.includes("/blog/slug/")
            ? { post }
            : path.startsWith("/blog?")
              ? { posts, pagination: { ...pagination, total: posts.length } }
              : { projects, pagination: { ...pagination, total: projects.length } };
    return { data: { success: true, data } };
  });
  vi.mocked(api.post).mockResolvedValue({ data: { success: true } });
  vi.mocked(api.patch).mockResolvedValue({ data: { success: true } });
  vi.mocked(api.delete).mockResolvedValue({ data: { success: true } });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it("renders saved upcoming and completed events with real registration counts", async () => {
  render(
    <MemoryRouter>
      <EventsPage />
    </MemoryRouter>,
  );
  await screen.findByRole("heading", { name: savedEvent.title });
  await screen.findByRole("heading", { name: "Saved completed event" });
  expect(screen.getByText("2/10 registered")).toBeTruthy();
  expect(screen.getByText("8 spots left")).toBeTruthy();
  expect(screen.getByRole("img", { name: savedEvent.title }).getAttribute("src")).toBe(
    savedEvent.image,
  );
  expect(screen.getByRole("link", { name: "View Registration" }).getAttribute("href")).toBe(
    "/student/events",
  );
  expect(screen.queryByText("Annual Hackathon 2026")).toBeNull();
  expect(api.get).toHaveBeenCalledWith(expect.stringContaining("period=current"));
  expect(api.get).toHaveBeenCalledWith(expect.stringContaining("period=past"));
  expect(
    screen.getAllByText(new Date(savedEvent.endDate!).toLocaleString()).length,
  ).toBeGreaterThan(0);
  expect(screen.queryByRole("button", { name: "Hackathon" })).toBeNull();
});

it("loads a public committee table only when expanded", async () => {
  vi.mocked(api.get).mockResolvedValue({
    data: {
      success: true,
      data: { members: [{ name: "Alex Member", role: "Chair", team: "Operations" }] },
    },
  });
  const { container } = render(<EventCommitteeTable eventId="saved-event" title="Workshop" />);
  expect(api.get).not.toHaveBeenCalled();
  const details = container.querySelector("details")!;
  details.open = true;
  fireEvent(details, new Event("toggle"));
  const table = await screen.findByRole("table", { name: "Workshop organizing committee" });
  expect(table.textContent).toContain("Alex Member");
  expect(screen.getAllByRole("columnheader").map((cell) => cell.textContent)).toEqual([
    "Name",
    "Role",
    "Team",
  ]);
  expect(api.get).toHaveBeenCalledWith("/events/saved-event/organizers");
});

it("retries failed public committee loads and shows an empty state", async () => {
  vi.mocked(api.get)
    .mockRejectedValueOnce(new Error("Offline"))
    .mockResolvedValue({ data: { success: true, data: { members: [] } } });
  const { container } = render(<EventCommitteeTable eventId="saved-event" title="Workshop" />);
  const details = container.querySelector("details")!;
  details.open = true;
  fireEvent(details, new Event("toggle"));
  await screen.findByRole("alert");
  fireEvent.click(screen.getByRole("button", { name: "Retry" }));
  await screen.findByText("Organizing committee will be announced soon.");
});

it("lists ongoing, cancelled, and past events whose status was never updated", async () => {
  upcomingEvents = [
    {
      ...savedEvent,
      title: "Multi-day workshop",
      date: "2020-01-01",
      endDate: "2099-01-01",
      status: "ongoing",
    },
    { ...savedEvent, _id: "cancelled-event", title: "Cancelled workshop", status: "cancelled" },
  ];
  completedEvents = [{ ...savedEvent, title: "Previous workshop", date: "2020-01-01" }];
  render(
    <MemoryRouter>
      <EventsPage />
    </MemoryRouter>,
  );
  await screen.findByRole("heading", { name: "Multi-day workshop" });
  await screen.findByRole("heading", { name: "Previous workshop" });
  await screen.findByRole("heading", { name: "Cancelled workshop" });
  expect(screen.getByText("ongoing")).toBeTruthy();
  expect(screen.queryByRole("link", { name: "View Registration" })).toBeNull();
  expect(
    (screen.getByRole("button", { name: "Event Cancelled" }) as HTMLButtonElement).disabled,
  ).toBe(true);
});

it("keeps empty upcoming and past event collections empty", async () => {
  upcomingEvents = [];
  completedEvents = [];
  render(
    <MemoryRouter>
      <EventsPage />
    </MemoryRouter>,
  );
  await screen.findByText("No upcoming or ongoing events at the moment.");
  await screen.findByText("No past events available yet.");
  expect(screen.queryByText("Annual Hackathon 2026")).toBeNull();
  expect(screen.queryByText("Annual Hackathon 2025")).toBeNull();
});

it("shows event failures and retries without sample fallback", async () => {
  vi.mocked(api.get)
    .mockRejectedValueOnce(new Error("Offline"))
    .mockRejectedValueOnce(new Error("Offline"));
  render(
    <MemoryRouter>
      <EventsPage />
    </MemoryRouter>,
  );
  await screen.findByText("Unable to load upcoming events.");
  await screen.findByText("Unable to load past events.");
  expect(screen.queryByText("Annual Hackathon 2026")).toBeNull();
  fireEvent.click(screen.getAllByRole("button", { name: "Retry" })[0]);
  await screen.findByRole("heading", { name: savedEvent.title });
});

it("paginates events and resets the page when the category changes", async () => {
  vi.mocked(api.get).mockImplementation(async (url) => ({
    data: {
      success: true,
      data: {
        events: String(url).includes("period=past") ? [] : [savedEvent],
        pagination: {
          page: Number(new URLSearchParams(String(url).split("?")[1]).get("page")),
          pages: String(url).includes("period=past") ? 0 : 2,
          total: 10,
          limit: 9,
        },
      },
    },
  }));
  render(
    <MemoryRouter>
      <EventsPage />
    </MemoryRouter>,
  );
  await screen.findByRole("heading", { name: savedEvent.title });
  fireEvent.click(screen.getByRole("button", { name: "Next page" }));
  await waitFor(() => expect(api.get).toHaveBeenCalledWith(expect.stringContaining("page=2")));
  fireEvent.click(screen.getByRole("button", { name: "Workshop" }));
  await waitFor(() =>
    expect(api.get).toHaveBeenCalledWith(expect.stringMatching(/type=workshop.*page=1/)),
  );
});

it("supports uncapped events and disables registration for full events", async () => {
  upcomingEvents = [
    { ...savedEvent, maxParticipants: undefined, availableSpots: null },
    {
      ...savedEvent,
      _id: "full-event",
      title: "Full event",
      maxParticipants: 2,
      availableSpots: 0,
      isRegistrationOpen: false,
    },
  ];
  render(
    <MemoryRouter>
      <EventsPage />
    </MemoryRouter>,
  );
  await screen.findByText("2 registered");
  expect(screen.getAllByRole("link", { name: "View Registration" })).toHaveLength(1);
  expect(
    (screen.getByRole("button", { name: "Registration Full" }) as HTMLButtonElement).disabled,
  ).toBe(true);
});

it("ignores an older event response after a filter change", async () => {
  let finishFirst!: (value: Awaited<ReturnType<typeof api.get>>) => void;
  vi.mocked(api.get).mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finishFirst = resolve;
      }),
  );
  const { result, rerender } = renderHook(({ type }) => useEvents({ type }), {
    initialProps: { type: "workshop" },
  });
  rerender({ type: "seminar" });
  await waitFor(() => expect(result.current.data?.[0].title).toBe(savedEvent.title));
  await act(async () =>
    finishFirst({
      data: {
        success: true,
        data: {
          events: [{ ...savedEvent, title: "Stale response" }],
          pagination: { page: 1, pages: 1, total: 1 },
        },
      },
    } as Awaited<ReturnType<typeof api.get>>),
  );
  expect(result.current.data?.[0].title).toBe(savedEvent.title);
});

it("shows saved articles and cover photos without static samples or an author requirement", async () => {
  render(
    <MemoryRouter>
      <BlogPage />
    </MemoryRouter>,
  );
  await screen.findByRole("heading", { name: post.title });
  expect(screen.getByRole("img", { name: post.title }).getAttribute("src")).toBe(post.coverImage);
  expect(screen.getByRole("link", { name: post.title }).getAttribute("href")).toBe(
    `/blog/${post.slug}`,
  );
  expect(screen.queryByText("Getting Started with React 19")).toBeNull();
});

it("keeps an empty blog empty and searches through the API", async () => {
  posts = [];
  render(
    <MemoryRouter>
      <BlogPage />
    </MemoryRouter>,
  );
  await screen.findByText("No articles found.");
  expect(screen.queryByText("Featured Article")).toBeNull();
  fireEvent.change(screen.getByRole("textbox", { name: "Search articles" }), {
    target: { value: "new post" },
  });
  await waitFor(() =>
    expect(api.get).toHaveBeenCalledWith(expect.stringContaining("search=new+post")),
  );
});

it("shows a failed blog load and retries without a sample fallback", async () => {
  vi.mocked(api.get)
    .mockRejectedValueOnce(new Error("Offline"))
    .mockRejectedValueOnce(new Error("Offline"));
  render(
    <MemoryRouter>
      <BlogPage />
    </MemoryRouter>,
  );
  await screen.findByRole("alert");
  fireEvent.click(screen.getByRole("button", { name: "Retry" }));
  await screen.findByRole("heading", { name: post.title });
});

it("shows saved project contributors, photos, and demo URLs", async () => {
  render(
    <MemoryRouter>
      <ProjectsPage />
    </MemoryRouter>,
  );
  await screen.findByRole("heading", { name: project.title });
  expect(screen.getByRole("link", { name: "Live Demo" }).getAttribute("href")).toBe(
    project.demoUrl,
  );
  expect(screen.getByRole("img", { name: project.title }).getAttribute("src")).toBe(project.image);
  expect(screen.getByText(/Alex/)).toBeTruthy();
  expect(screen.queryByText("Smart Campus App")).toBeNull();
});

it("keeps an empty project collection empty", async () => {
  projects = [];
  render(
    <MemoryRouter>
      <ProjectsPage />
    </MemoryRouter>,
  );
  await screen.findByText("No projects in this category yet.");
  expect(screen.queryByText("Featured Projects")).toBeNull();
});

it("publishes a new blog through the protected API", async () => {
  posts = [];
  render(<BlogManagementPage />);
  await screen.findByText("No posts found");
  fireEvent.click(screen.getByRole("button", { name: /New Post/ }));
  fireEvent.change(screen.getByRole("textbox", { name: "Title" }), {
    target: { value: post.title },
  });
  fireEvent.change(screen.getByRole("textbox", { name: "Content" }), {
    target: { value: post.content },
  });
  fireEvent.change(screen.getByRole("combobox", { name: "Status" }), {
    target: { value: "published" },
  });
  fireEvent.click(screen.getByRole("checkbox", { name: "Featured post" }));
  fireEvent.click(screen.getByRole("button", { name: "Create Post" }));
  await waitFor(() =>
    expect(api.post).toHaveBeenCalledWith(
      "/blog",
      expect.objectContaining({
        title: post.title,
        content: post.content,
        status: "published",
        isFeatured: true,
        coverImage: "",
      }),
    ),
  );
});

it("loads draft content and retains the editor when saving fails", async () => {
  posts = [{ ...post, status: "draft" }];
  vi.mocked(api.patch).mockRejectedValueOnce(new Error("Save unavailable"));
  render(<BlogManagementPage />);
  await screen.findByText(post.title);
  expect(api.get).toHaveBeenCalledWith(expect.stringContaining("includeDrafts=true"));
  fireEvent.click(screen.getByRole("button", { name: `Edit ${post.title}` }));
  expect((screen.getByRole("textbox", { name: "Content" }) as HTMLTextAreaElement).value).toBe(
    post.content,
  );
  fireEvent.click(screen.getByRole("button", { name: "Update Post" }));
  await screen.findByRole("alert");
  expect(screen.getByText("Save unavailable")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Update Post" }));
  await waitFor(() => expect(api.patch).toHaveBeenCalledTimes(2));
});

it("persists project edits using backend field names", async () => {
  render(<ProjectsManagementPage />);
  await screen.findByText(project.title);
  fireEvent.click(screen.getByRole("button", { name: "Edit" }));
  fireEvent.click(screen.getByRole("checkbox", { name: "Featured project" }));
  fireEvent.click(screen.getByRole("button", { name: "Update Project" }));
  await waitFor(() =>
    expect(api.patch).toHaveBeenCalledWith(
      `/projects/${project._id}`,
      expect.objectContaining({
        description: project.description,
        teamMembers: ["Alex"],
        demoUrl: project.demoUrl,
        githubUrl: project.githubUrl,
        isFeatured: true,
      }),
    ),
  );
});

it("deletes projects only after confirmation and API success", async () => {
  vi.spyOn(window, "confirm").mockReturnValue(true);
  render(<ProjectsManagementPage />);
  await screen.findByText(project.title);
  projects = [];
  fireEvent.click(screen.getByRole("button", { name: `Delete ${project.title}` }));
  await screen.findByText("No projects found");
  expect(api.delete).toHaveBeenCalledWith(`/projects/${project._id}`);
});

it("renders a full published article as safe Markdown", async () => {
  render(
    <MemoryRouter initialEntries={[`/blog/${post.slug}`]}>
      <Routes>
        <Route path="/blog/:slug" element={<BlogPostPage />} />
      </Routes>
    </MemoryRouter>,
  );
  await screen.findByRole("heading", { name: "Published content" });
  expect(screen.getByText("Markdown").tagName).toBe("STRONG");
  expect(api.get).toHaveBeenCalledWith(`/blog/slug/${post.slug}`);
});

it("requests later pages instead of truncating the public blog collection", async () => {
  vi.mocked(api.get).mockImplementation(async (url) => ({
    data: {
      success: true,
      data: String(url).includes("featured")
        ? { posts: [] }
        : { posts: [post], pagination: { page: 1, pages: 2, total: 10, limit: 9 } },
    },
  }));
  render(
    <MemoryRouter>
      <BlogPage />
    </MemoryRouter>,
  );
  await screen.findByRole("heading", { name: post.title });
  fireEvent.click(screen.getByRole("button", { name: "Next page" }));
  await waitFor(() => expect(api.get).toHaveBeenCalledWith(expect.stringContaining("page=2")));
});

it("creates a project with persistent content and an explicitly empty team", async () => {
  projects = [];
  render(<ProjectsManagementPage />);
  await screen.findByText("No projects found");
  fireEvent.click(screen.getByRole("button", { name: "Add Project" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Title" }), {
    target: { value: project.title },
  });
  fireEvent.change(screen.getByRole("textbox", { name: "Description" }), {
    target: { value: project.description },
  });
  fireEvent.click(screen.getAllByRole("button", { name: "Add Project" }).at(-1)!);
  await waitFor(() =>
    expect(api.post).toHaveBeenCalledWith(
      "/projects",
      expect.objectContaining({
        title: project.title,
        description: project.description,
        teamMembers: [],
        status: "in-progress",
      }),
    ),
  );
});

it("does not render executable HTML or JavaScript links in article content", async () => {
  vi.mocked(api.get).mockResolvedValue({
    data: {
      success: true,
      data: {
        post: {
          ...post,
          content:
            "<script>alert(1)</script>\n\n[Unsafe](javascript:alert%281%29)\n\n<img src=x onerror=alert(1)>",
        },
      },
    },
  });
  const { container } = render(
    <MemoryRouter initialEntries={[`/blog/${post.slug}`]}>
      <Routes>
        <Route path="/blog/:slug" element={<BlogPostPage />} />
      </Routes>
    </MemoryRouter>,
  );
  await screen.findByRole("heading", { name: post.title });
  expect(container.querySelector("script, [onerror], a[href^='javascript:']")).toBeNull();
});
