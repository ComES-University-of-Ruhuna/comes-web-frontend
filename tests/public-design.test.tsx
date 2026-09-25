import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, expect, it, vi } from "vitest";
import { PublicPageHeader } from "../src/components/layout/PublicPageHeader";
import { HomeIntro } from "../src/components/layout/HomeIntro";
import { Navbar } from "../src/components/layout/Navbar";
import { NAV_LINKS } from "../src/constants";

vi.mock("@/store", () => ({
  useThemeStore: () => ({ resolvedTheme: "light" }),
  useStudentStore: () => ({ isAuthenticated: false }),
  useAuthStore: () => ({ isAuthenticated: false }),
}));
vi.mock("@/hooks", () => ({ useClickOutside: () => ({ current: null }) }));
vi.mock("@/components/ui", () => ({
  ThemeToggle: () => <button type="button">Theme</button>,
  UserProfileDropdown: () => null,
  NotificationsDropdown: () => null,
}));
afterEach(cleanup);

it.each([
  ["/about", "About ComES"],
  ["/events", "Events"],
  ["/projects", "Projects"],
  ["/team", "Our Team"],
  ["/gallery", "Gallery"],
  ["/blog", "Blog & News"],
  ["/contact", "Contact Us"],
  ["/faq", "Frequently Asked Questions"],
  ["/subgroups/software-engineering", "Software Engineering"],
  ["/subgroups/ai-data-science", "AI & Data Science"],
  ["/subgroups/embedded-electronics", "Electronics & Embedded Systems"],
  ["/subgroups/network-security", "Network & Cyber Security"],
])("provides a consistent accessible header for %s", (route, title) => {
  render(
    <MemoryRouter initialEntries={[route]}>
      <PublicPageHeader />
    </MemoryRouter>,
  );
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(title);
  expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Home" }).getAttribute("href")).toBe("/");
});

it.each(["/", "/blog/saved-article", "/admin"])(
  "does not add a duplicate page header at %s",
  (route) => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <PublicPageHeader />
      </MemoryRouter>,
    );
    expect(screen.queryByRole("heading")).toBeNull();
  },
);

it("keeps the homepage identity, membership action, and subgroup links", () => {
  render(
    <MemoryRouter>
      <HomeIntro />
    </MemoryRouter>,
  );
  expect(screen.getByRole("heading", { level: 1, name: "ComES" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Join ComES" }).getAttribute("href")).toBe("/register");
  expect(
    screen.getByRole("navigation", { name: "Engineering subgroups" }).querySelectorAll("a").length,
  ).toBe(4);
  expect(screen.getByRole("img").getAttribute("src")).toBe("/engineering-board.jpg");
});

it("exposes active navigation and expandable menus", () => {
  render(
    <MemoryRouter initialEntries={["/blog"]}>
      <Navbar />
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Updates" }));
  expect(screen.getByRole("link", { name: "Blog & News" }).getAttribute("aria-current")).toBe(
    "page",
  );
  const subgroups = screen.getByRole("button", { name: "Subgroups" });
  fireEvent.click(subgroups);
  expect(subgroups.getAttribute("aria-expanded")).toBe("true");
  expect(screen.getByRole("button", { name: "Updates" }).getAttribute("aria-expanded")).toBe(
    "false",
  );
  fireEvent.keyDown(subgroups, { key: "Escape" });
  expect(subgroups.getAttribute("aria-expanded")).toBe("false");
  fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
  expect(screen.getByRole("button", { name: "Close menu" }).getAttribute("aria-expanded")).toBe(
    "true",
  );
});

it("groups secondary pages while keeping core destinations directly accessible", () => {
  expect(NAV_LINKS.map((link) => link.label)).toEqual([
    "Society",
    "Subgroups",
    "Events",
    "Projects",
    "Updates",
    "Contact",
  ]);
  expect(
    NAV_LINKS.find((link) => link.label === "Society")?.children?.map((link) => link.path),
  ).toEqual(["/about", "/team", "/faq"]);
  expect(
    NAV_LINKS.find((link) => link.label === "Updates")?.children?.map((link) => link.path),
  ).toEqual(["/blog", "/gallery"]);
});

it("highlights the parent group on article routes and restores focus on Escape", () => {
  render(
    <MemoryRouter initialEntries={["/blog/saved-article"]}>
      <Navbar />
    </MemoryRouter>,
  );
  const trigger = screen.getByRole("button", { name: "Updates" });
  expect(trigger.getAttribute("data-active")).toBe("true");
  fireEvent.click(trigger);
  const link = screen.getByRole("link", { name: "Blog & News" });
  link.focus();
  fireEvent.keyDown(link, { key: "Escape" });
  expect(trigger.getAttribute("aria-expanded")).toBe("false");
  expect(document.activeElement).toBe(trigger);
});

it("opens the current mobile group and restores scrolling when closed", () => {
  render(
    <MemoryRouter initialEntries={["/team"]}>
      <Navbar />
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
  const mobile = within(screen.getByRole("navigation", { name: "Mobile navigation" }));
  expect(mobile.getByRole("button", { name: "Society" }).getAttribute("aria-expanded")).toBe(
    "true",
  );
  expect(mobile.getByRole("link", { name: "Committee & Team" }).getAttribute("aria-current")).toBe(
    "page",
  );
  expect(mobile.getByRole("link", { name: "Sign in" }).getAttribute("href")).toBe("/login");
  expect(document.body.style.overflow).toBe("hidden");
  fireEvent.click(screen.getByRole("button", { name: "Close menu" }));
  expect(screen.getByRole("button", { name: "Open menu" }).getAttribute("aria-expanded")).toBe(
    "false",
  );
  expect(document.body.style.overflow).toBe("");
});
