import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { HomeIntro } from "../src/components/layout/HomeIntro";
import { homeSlidesService } from "../src/services/homeSlides.service";

const preferences = vi.hoisted(() => ({ reducedMotion: false }));
vi.mock("../src/services/homeSlides.service", () => ({ homeSlidesService: { list: vi.fn() } }));
vi.mock("framer-motion", async (importOriginal) => ({
  ...(await importOriginal<typeof import("framer-motion")>()),
  useReducedMotion: () => preferences.reducedMotion,
}));
const slides = [
  { _id: "slide-1", image: "/first.jpg", altText: "Engineering workshop", order: 0 },
  { _id: "slide-2", image: "/second.jpg", altText: "ComES community", order: 1 },
];
beforeEach(() => {
  preferences.reducedMotion = false;
  vi.mocked(homeSlidesService.list).mockResolvedValue(slides);
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.clearAllMocks();
});
const renderHero = async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <HomeIntro />
      </MemoryRouter>,
    );
  });
};

it("loads published slides and supports next, previous and keyboard navigation", async () => {
  await renderHero();
  expect(homeSlidesService.list).toHaveBeenCalledWith();
  const hero = screen.getByRole("region", { name: "ComES highlights" });
  expect(hero.classList.contains("site-home-hero")).toBe(true);
  expect(hero.classList.contains("site-home-hero--slideshow")).toBe(true);
  expect(screen.getByRole("img", { name: "Engineering workshop" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
  expect(screen.getByRole("img", { name: "ComES community" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Previous slide" }));
  expect(screen.getByRole("img", { name: "Engineering workshop" })).toBeTruthy();
  fireEvent.keyDown(screen.getByRole("region", { name: "ComES highlights" }), { key: "ArrowLeft" });
  expect(screen.getByRole("img", { name: "ComES community" })).toBeTruthy();
});
it("rotates every six seconds and pauses on hover, focus and explicit pause", async () => {
  vi.useFakeTimers();
  await renderHero();
  act(() => {
    vi.advanceTimersByTime(6000);
  });
  expect(screen.getByRole("img", { name: "ComES community" })).toBeTruthy();
  fireEvent.mouseEnter(screen.getByRole("region", { name: "ComES highlights" }));
  act(() => {
    vi.advanceTimersByTime(6000);
  });
  expect(screen.getByRole("img", { name: "ComES community" })).toBeTruthy();
  fireEvent.mouseLeave(screen.getByRole("region", { name: "ComES highlights" }));
  fireEvent.focus(screen.getByRole("link", { name: "Join ComES" }));
  act(() => {
    vi.advanceTimersByTime(6000);
  });
  expect(screen.getByRole("img", { name: "ComES community" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Play slideshow" }));
  act(() => {
    vi.advanceTimersByTime(6000);
  });
  expect(screen.getByRole("img", { name: "Engineering workshop" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Pause slideshow" }));
  act(() => {
    vi.advanceTimersByTime(6000);
  });
  expect(screen.getByRole("img", { name: "Engineering workshop" })).toBeTruthy();
});
it("starts paused for reduced motion", async () => {
  preferences.reducedMotion = true;
  vi.useFakeTimers();
  await renderHero();
  act(() => {
    vi.advanceTimersByTime(12000);
  });
  expect(screen.getByRole("img", { name: "Engineering workshop" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Play slideshow" })).toBeTruthy();
});
it.each(["empty", "failure"])("retains the banner when the list is %s", async (mode) => {
  if (mode === "empty") vi.mocked(homeSlidesService.list).mockResolvedValue([]);
  else vi.mocked(homeSlidesService.list).mockRejectedValue(new Error("Offline"));
  await renderHero();
  expect(screen.getByRole("img").getAttribute("src")).toBe("/banner.jpg");
  expect(screen.queryByRole("button", { name: "Next slide" })).toBeNull();
});
it("supports swipe navigation and pauses rotation after interaction", async () => {
  await renderHero();
  const hero = screen.getByRole("region", { name: "ComES highlights" });
  fireEvent.touchStart(hero, { touches: [{ clientX: 240 }] });
  fireEvent.touchEnd(hero, { changedTouches: [{ clientX: 60 }] });
  expect(screen.getByRole("img", { name: "ComES community" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Play slideshow" })).toBeTruthy();
});

it("skips broken images and falls back when none remain", async () => {
  await renderHero();
  fireEvent.error(screen.getByRole("img", { name: "Engineering workshop" }));
  expect(screen.getByRole("img", { name: "ComES community" })).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Next slide" })).toBeNull();
  fireEvent.error(screen.getByRole("img", { name: "ComES community" }));
  expect(screen.getByRole("img").getAttribute("src")).toBe("/banner.jpg");
});
