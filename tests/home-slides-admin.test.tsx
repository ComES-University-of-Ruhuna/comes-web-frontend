import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import HomeSlidesManagementPage from "../src/pages/admin/HomeSlidesManagementPage";
import { type HomeSlide } from "../src/services/homeSlides.service";
import api from "../src/services/api";

vi.mock("../src/services/api", () => ({
  default: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));
const image = "https://res.cloudinary.com/comes/image/upload/hero.jpg";
let slides: HomeSlide[];
beforeEach(() => {
  vi.resetAllMocks();
  slides = [{ _id: "slide-1", image, altText: "Opening session", order: 0, isPublished: false }];
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: vi.fn(() => "blob:preview"),
  });
  Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: vi.fn() });
  vi.mocked(api.get).mockImplementation(async () => ({ data: { data: { slides: [...slides] } } }));
  vi.mocked(api.post).mockImplementation(async (url, data) => {
    if (url === "/homepage-slides/upload") return { data: { data: { url: image } } };
    const slide = { ...(data as Omit<HomeSlide, "_id">), _id: "slide-2" };
    slides.push(slide);
    return { data: { data: { slide } } };
  });
  vi.mocked(api.patch).mockImplementation(async (url, data) => {
    slides = slides.map((slide) =>
      url === `/homepage-slides/${slide._id}`
        ? { ...slide, ...(data as Partial<HomeSlide>) }
        : slide,
    );
    return { data: { data: { slide: slides[0] } } };
  });
  vi.mocked(api.delete).mockImplementation(async () => {
    slides = [];
    return {};
  });
});
afterEach(cleanup);
const renderAdmin = async () => {
  render(
    <MemoryRouter>
      <HomeSlidesManagementPage />
    </MemoryRouter>,
  );
  await screen.findByRole("form", { name: "Edit Opening session" });
};
const chooseFile = () =>
  fireEvent.change(screen.getByLabelText("Image (JPEG, PNG or WebP, up to 3 MB)"), {
    target: { files: [new File(["image"], "hero.jpg", { type: "image/jpeg" })] },
  });

it("uploads multipart image, saves metadata, and retains the slide on reload", async () => {
  await renderAdmin();
  const form = within(screen.getByRole("region", { name: "New slide" }));
  chooseFile();
  fireEvent.change(form.getByLabelText("Image description"), {
    target: { value: "Workshop team" },
  });
  fireEvent.change(form.getByLabelText("Display order"), { target: { value: "3" } });
  fireEvent.click(form.getByLabelText("Published"));
  fireEvent.submit(form.getByRole("button", { name: "Add slide" }).closest("form")!);
  await screen.findByText("Slide published.");
  expect(api.get).toHaveBeenCalledWith("/homepage-slides/admin");
  const upload = vi.mocked(api.post).mock.calls[0];
  expect(upload[0]).toBe("/homepage-slides/upload");
  expect((upload[1] as FormData).get("image")).toBeInstanceOf(File);
  expect(api.post).toHaveBeenCalledWith("/homepage-slides", {
    image,
    altText: "Workshop team",
    order: 3,
    isPublished: true,
  });
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:preview");
  cleanup();
  await renderAdmin();
  expect(screen.getByRole("form", { name: "Edit Workshop team" })).toBeTruthy();
});
it("saves descriptions, display order and publishing changes", async () => {
  await renderAdmin();
  const editor = within(screen.getByRole("form", { name: "Edit Opening session" }));
  fireEvent.change(editor.getByLabelText("Image description"), {
    target: { value: "Updated workshop" },
  });
  fireEvent.change(editor.getByLabelText("Display order"), { target: { value: "4" } });
  fireEvent.click(editor.getByLabelText("Published"));
  fireEvent.click(editor.getByRole("button", { name: "Save changes" }));
  await screen.findByText("Saved");
  expect(api.patch).toHaveBeenCalledWith("/homepage-slides/slide-1", {
    altText: "Updated workshop",
    order: 4,
    isPublished: true,
  });
});
it("requires confirmation before removing a slide", async () => {
  await renderAdmin();
  fireEvent.click(screen.getByRole("button", { name: "Remove Opening session" }));
  expect(api.delete).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(api.delete).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Remove Opening session" }));
  fireEvent.click(screen.getByRole("button", { name: "Remove slide" }));
  await screen.findByText("No homepage slides yet.");
  expect(api.delete).toHaveBeenCalledWith("/homepage-slides/slide-1");
});
it.each([
  new File(["text"], "bad.txt", { type: "text/plain" }),
  new File([new Uint8Array(3 * 1024 * 1024 + 1)], "large.jpg", { type: "image/jpeg" }),
])("rejects unsupported or oversized uploads", async (file) => {
  await renderAdmin();
  fireEvent.change(screen.getByLabelText("Image (JPEG, PNG or WebP, up to 3 MB)"), {
    target: { files: [file] },
  });
  expect(screen.getByRole("alert").textContent).toContain("no larger than 3 MB");
  expect(api.post).not.toHaveBeenCalled();
});
it("reuses the uploaded URL when metadata save fails and is retried", async () => {
  await renderAdmin();
  vi.mocked(api.post)
    .mockResolvedValueOnce({ data: { data: { url: image } } })
    .mockRejectedValueOnce(new Error("Save failed"));
  chooseFile();
  fireEvent.change(
    within(screen.getByRole("region", { name: "New slide" })).getByLabelText("Image description"),
    { target: { value: "Retry image" } },
  );
  fireEvent.submit(screen.getByRole("button", { name: "Add slide" }).closest("form")!);
  await screen.findByText("Save failed");
  fireEvent.submit(screen.getByRole("button", { name: "Add slide" }).closest("form")!);
  await screen.findByText("Slide saved as draft.");
  expect(
    vi.mocked(api.post).mock.calls.filter(([url]) => url === "/homepage-slides/upload"),
  ).toHaveLength(1);
});
it("shows list failures and retries without losing management access", async () => {
  vi.mocked(api.get).mockRejectedValueOnce(new Error("Network unavailable"));
  render(
    <MemoryRouter>
      <HomeSlidesManagementPage />
    </MemoryRouter>,
  );
  await screen.findByText("Network unavailable");
  fireEvent.click(screen.getByRole("button", { name: "Retry" }));
  await screen.findByRole("form", { name: "Edit Opening session" });
});
it("shows an error for malformed slide lists", async () => {
  vi.mocked(api.get).mockResolvedValueOnce({ data: { data: {} } });
  render(
    <MemoryRouter>
      <HomeSlidesManagementPage />
    </MemoryRouter>,
  );
  await screen.findByText("Unable to load homepage slides.");
  expect(screen.getByRole("button", { name: "Retry" })).toBeTruthy();
});

it("keeps a slide when deletion fails", async () => {
  await renderAdmin();
  vi.mocked(api.delete).mockRejectedValueOnce(new Error("Delete failed"));
  fireEvent.click(screen.getByRole("button", { name: "Remove Opening session" }));
  fireEvent.click(screen.getByRole("button", { name: "Remove slide" }));
  await waitFor(() => expect(screen.getByRole("alert").textContent).toBe("Delete failed"));
  expect(screen.getByRole("form", { name: "Edit Opening session" })).toBeTruthy();
});
