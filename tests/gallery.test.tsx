import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { GalleryPage } from "../src/pages/GalleryPage";
import GalleryManagementPage from "../src/pages/admin/GalleryManagementPage";
import {
  galleryService,
  type GalleryPhoto,
  type GalleryData,
} from "../src/services/gallery.service";
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
const event = {
  _id: "event-1",
  title: "Engineering workshop",
  slug: "engineering-workshop",
  date: "2026-02-01",
};
const imageUrl = "https://res.cloudinary.com/comes/image/upload/gallery.jpg";
const photograph: GalleryPhoto = {
  _id: "photo-1",
  event,
  title: "Opening session",
  description: "A day of building together.",
  image: imageUrl,
  isPublished: true,
  createdAt: "2026-02-02",
};
let photos: GalleryPhoto[];
let intersections: (() => void)[];
beforeEach(() => {
  vi.resetAllMocks();
  intersections = [];
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        intersections.push(() =>
          callback(
            [{ isIntersecting: true } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver,
          ),
        );
      }
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    },
  );
  photos = [
    { ...photograph },
    { ...photograph, _id: "photo-2", title: "Workshop team", event: null },
  ];
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: vi.fn(() => "blob:preview"),
  });
  Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: vi.fn() });
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
  vi.mocked(api.get).mockImplementation(async (url) => {
    const parsed = new URL(String(url), "http://test");
    if (parsed.pathname === "/events")
      return {
        data: {
          success: true,
          data: { events: [event], pagination: { page: 1, pages: 1, total: 1, limit: 30 } },
        },
      };
    if (parsed.pathname === "/gallery/albums")
      return { data: { data: { albums: [{ ...event, count: 1 }] } } };
    const images = photos.filter(
      (photo) =>
        (parsed.searchParams.get("includeUnpublished") === "true" || photo.isPublished) &&
        (!parsed.searchParams.get("event") ||
          photo.event?._id === parsed.searchParams.get("event")),
    );
    const page = Number(parsed.searchParams.get("page")) || 1;
    return {
      data: {
        data: {
          images: images.slice((page - 1) * 24, page * 24),
          pagination: {
            page,
            pages: Math.ceil(images.length / 24),
            total: images.length,
            limit: 24,
          },
        },
      },
    };
  });
  vi.mocked(api.post).mockImplementation(async (url, body) => {
    if (url === "/gallery/upload") return { data: { data: { url: imageUrl } } };
    const image = {
      ...photograph,
      ...(body as Partial<GalleryPhoto>),
      _id: `photo-${photos.length + 1}`,
      event,
    };
    photos.push(image);
    return { data: { data: { image } } };
  });
  vi.mocked(api.patch).mockImplementation(async (url, body) => {
    photos = photos.map((photo) =>
      String(url).endsWith(photo._id) ? { ...photo, ...(body as Partial<GalleryPhoto>) } : photo,
    );
    const image = photos.find((photo) => String(url).endsWith(photo._id));
    return { data: { data: { image } } };
  });
  vi.mocked(api.delete).mockImplementation(async (url) => {
    photos = photos.filter((photo) => !String(url).endsWith(photo._id));
    return { data: undefined };
  });
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const populatePhotos = (count: number) => {
  photos = Array.from({ length: count }, (_, index) => ({
    ...photograph,
    _id: `photo-${index + 1}`,
    title: `Photo ${index + 1}`,
  }));
};

it("appends scroll batches once, keeps existing photo nodes, and stops at the end", async () => {
  populatePhotos(50);
  render(
    <MemoryRouter>
      <GalleryPage />
    </MemoryRouter>,
  );
  const first = await screen.findByRole("button", { name: "View photo: Photo 1" });
  const firstBatch = first.closest("figure")!.parentElement;
  expect(screen.queryByRole("button", { name: "View photo: Photo 25" })).toBeNull();
  expect(screen.getByAltText("Photo 4").getAttribute("loading")).toBe("lazy");
  expect(screen.queryByRole("navigation", { name: "Pagination" })).toBeNull();
  const intersect = intersections.at(-1)!;
  act(() => {
    intersect();
    intersect();
  });
  await screen.findByRole("button", { name: "View photo: Photo 48" });
  expect(screen.getByRole("button", { name: "View photo: Photo 1" })).toBe(first);
  expect(first.closest("figure")!.parentElement).toBe(firstBatch);
  expect(
    screen.getByRole("button", { name: "View photo: Photo 25" }).closest("figure")!.parentElement,
  ).not.toBe(firstBatch);
  expect(
    vi.mocked(api.get).mock.calls.filter(([url]) => String(url).includes("page=2")),
  ).toHaveLength(1);
  expect(vi.mocked(api.get).mock.calls.filter(([url]) => url === "/gallery/albums")).toHaveLength(
    1,
  );
  await waitFor(() =>
    expect(
      (screen.getByRole("button", { name: "Load more photos" }) as HTMLButtonElement).disabled,
    ).toBe(false),
  );
  act(() => intersections.at(-1)!());
  await screen.findByText("All photographs loaded.");
  expect(screen.getAllByRole("button", { name: /^View photo:/ })).toHaveLength(50);
  expect(screen.queryByRole("button", { name: "Load more photos" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "View photo: Photo 25" }));
  expect(within(screen.getByRole("dialog")).getByText("25 / 50")).toBeTruthy();
});

it("keeps previous photos on a loading error and retries the same batch without duplicates", async () => {
  populatePhotos(26);
  const original = vi.mocked(api.get).getMockImplementation()!;
  let fail = true;
  vi.mocked(api.get).mockImplementation(async (url, config) => {
    if (String(url).includes("page=2")) {
      if (fail) {
        fail = false;
        throw new Error("Unavailable");
      }
      return {
        data: {
          data: {
            images: [photos[23], photos[24], photos[25]],
            pagination: { page: 2, pages: 2, total: 26, limit: 24 },
          },
        },
      };
    }
    return original(url, config);
  });
  render(
    <MemoryRouter>
      <GalleryPage />
    </MemoryRouter>,
  );
  await screen.findByRole("button", { name: "View photo: Photo 24" });
  act(() => intersections.at(-1)!());
  await screen.findByText("Unable to load more photographs.");
  expect(screen.getAllByRole("button", { name: /^View photo:/ })).toHaveLength(24);
  act(() => intersections.at(-1)!());
  expect(
    vi.mocked(api.get).mock.calls.filter(([url]) => String(url).includes("page=2")),
  ).toHaveLength(1);
  fireEvent.click(screen.getByRole("button", { name: "Retry loading" }));
  await screen.findByText("All photographs loaded.");
  expect(screen.getAllByRole("button", { name: /^View photo:/ })).toHaveLength(26);
  expect(
    vi.mocked(api.get).mock.calls.filter(([url]) => String(url).includes("page=2")),
  ).toHaveLength(2);
});

it("resets batches on event changes and ignores an old pending response", async () => {
  populatePhotos(26);
  photos = photos.map((photo, index) => ({ ...photo, event: index < 24 ? null : event }));
  const original = vi.mocked(api.get).getMockImplementation()!;
  let resolvePage: ((response: { data: { data: GalleryData } }) => void) | undefined;
  vi.mocked(api.get).mockImplementation((url, config) =>
    String(url).includes("page=2")
      ? new Promise((resolve) => {
          resolvePage = resolve;
        })
      : original(url, config),
  );
  render(
    <MemoryRouter>
      <GalleryPage />
    </MemoryRouter>,
  );
  await screen.findByRole("button", { name: "View photo: Photo 24" });
  act(() => intersections.at(-1)!());
  await waitFor(() => expect(resolvePage).toBeDefined());
  fireEvent.change(screen.getByLabelText("Event"), { target: { value: event._id } });
  await screen.findByText("2 photographs");
  await act(async () =>
    resolvePage!({
      data: {
        data: {
          images: [{ ...photograph, _id: "stale", title: "Stale photo" }],
          pagination: { page: 2, pages: 2, total: 26, limit: 24 },
        },
      },
    }),
  );
  expect(screen.getAllByRole("button", { name: /^View photo:/ })).toHaveLength(2);
  expect(screen.queryByRole("button", { name: "View photo: Stale photo" })).toBeNull();
  expect(screen.queryByRole("button", { name: "View photo: Photo 1" })).toBeNull();
});

it("offers manual loading when IntersectionObserver is unavailable", async () => {
  vi.stubGlobal("IntersectionObserver", undefined);
  populatePhotos(25);
  render(
    <MemoryRouter>
      <GalleryPage />
    </MemoryRouter>,
  );
  fireEvent.click(await screen.findByRole("button", { name: "Load more photos" }));
  await screen.findByRole("button", { name: "View photo: Photo 25" });
  expect(screen.getAllByRole("button", { name: /^View photo:/ })).toHaveLength(25);
});

it("renders persisted photographs, real totals, and a null-event archive", async () => {
  render(
    <MemoryRouter>
      <GalleryPage />
    </MemoryRouter>,
  );
  expect(await screen.findByRole("button", { name: "View photo: Opening session" })).toBeTruthy();
  expect(screen.getByText("2 photographs / 1 events")).toBeTruthy();
  expect(screen.getByText("Community archive")).toBeTruthy();
  expect(screen.queryByText("500+")).toBeNull();
  expect(screen.getByAltText("Opening session").getAttribute("src")).toBe(imageUrl);
});
it("filters by event and starts at the first page", async () => {
  render(
    <MemoryRouter>
      <GalleryPage />
    </MemoryRouter>,
  );
  await screen.findByText("2 photographs / 1 events");
  fireEvent.change(screen.getByLabelText("Event"), { target: { value: event._id } });
  await screen.findByText("1 photographs");
  expect(screen.queryByRole("button", { name: "View photo: Workshop team" })).toBeNull();
  expect(api.get).toHaveBeenCalledWith("/gallery?limit=24&event=event-1&page=1");
});
it("opens an accessible viewer, navigates with arrows, cancels and restores focus", async () => {
  render(
    <MemoryRouter>
      <GalleryPage />
    </MemoryRouter>,
  );
  const trigger = await screen.findByRole("button", { name: "View photo: Opening session" });
  trigger.focus();
  fireEvent.click(trigger);
  const dialog = screen.getByRole("dialog", { name: "Photo viewer" });
  expect(within(dialog).getByRole("link", { name: event.title }).getAttribute("href")).toBe(
    "/events/engineering-workshop",
  );
  expect(
    (within(dialog).getByRole("button", { name: "Previous photo" }) as HTMLButtonElement).disabled,
  ).toBe(true);
  fireEvent.keyDown(dialog, { key: "ArrowRight" });
  expect(within(dialog).getByRole("heading", { name: "Workshop team" })).toBeTruthy();
  fireEvent.keyDown(dialog, { key: "ArrowLeft" });
  expect(within(dialog).getByRole("heading", { name: "Opening session" })).toBeTruthy();
  fireEvent.keyDown(dialog, { key: "Escape" });
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(document.activeElement).toBe(trigger);
});
it("retries failed loads and distinguishes an empty gallery", async () => {
  photos = [];
  vi.mocked(api.get).mockRejectedValueOnce(new Error("Network unavailable"));
  render(
    <MemoryRouter>
      <GalleryPage />
    </MemoryRouter>,
  );
  expect(await screen.findByRole("alert")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Retry" }));
  expect(await screen.findByText("The next chapter is coming.")).toBeTruthy();
});
it("replaces broken photos with an accessible placeholder", async () => {
  render(
    <MemoryRouter>
      <GalleryPage />
    </MemoryRouter>,
  );
  fireEvent.error(await screen.findByAltText("Opening session"));
  expect(screen.getByRole("img", { name: "Opening session: image unavailable" })).toBeTruthy();
});
const selectEvent = async () => {
  await screen.findByRole("option", { name: event.title });
  fireEvent.change(screen.getByLabelText("Event"), { target: { value: event._id } });
};
const addFile = () =>
  fireEvent.change(screen.getByLabelText("Photos"), {
    target: { files: [new File(["image-data"], "session-photo.jpg", { type: "image/jpeg" })] },
  });
it("uploads multipart images and persists event, caption, and draft visibility", async () => {
  render(
    <MemoryRouter>
      <GalleryManagementPage />
    </MemoryRouter>,
  );
  expect((screen.getByLabelText("Photos") as HTMLInputElement).disabled).toBe(true);
  await selectEvent();
  addFile();
  fireEvent.change(screen.getByLabelText("Caption"), { target: { value: "Our workshop team." } });
  fireEvent.click(screen.getByLabelText("Publish photos"));
  fireEvent.click(screen.getByRole("button", { name: "Save photos" }));
  await screen.findByText("1 of 1 photographs saved.");
  const uploadCall = vi.mocked(api.post).mock.calls.find(([url]) => url === "/gallery/upload")!;
  expect(uploadCall[1]).toBeInstanceOf(FormData);
  expect((uploadCall[1] as FormData).get("image")).toBeInstanceOf(File);
  expect(uploadCall[2]).toMatchObject({
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 90000,
  });
  expect(api.post).toHaveBeenCalledWith("/gallery", {
    event: event._id,
    title: "session photo",
    description: "Our workshop team.",
    image: imageUrl,
    isPublished: false,
  });
  expect(await screen.findByText("Draft")).toBeTruthy();
});
it("retries metadata saving without uploading the same image twice", async () => {
  const implementation = vi.mocked(api.post).getMockImplementation()!;
  let fail = true;
  vi.mocked(api.post).mockImplementation(async (url, body, config) => {
    if (url === "/gallery" && fail) {
      fail = false;
      throw new Error("Metadata save failed");
    }
    return implementation(url, body, config);
  });
  render(
    <MemoryRouter>
      <GalleryManagementPage />
    </MemoryRouter>,
  );
  await selectEvent();
  addFile();
  fireEvent.click(screen.getByRole("button", { name: "Save photos" }));
  await screen.findByText("Metadata save failed");
  await waitFor(() =>
    expect(
      (screen.getByRole("button", { name: "Retry unsaved photos" }) as HTMLButtonElement).disabled,
    ).toBe(false),
  );
  fireEvent.click(screen.getByRole("button", { name: "Retry unsaved photos" }));
  await screen.findByText("1 of 1 photographs saved.");
  expect(vi.mocked(api.post).mock.calls.filter(([url]) => url === "/gallery/upload")).toHaveLength(
    1,
  );
  expect(vi.mocked(api.post).mock.calls.filter(([url]) => url === "/gallery")).toHaveLength(2);
});
it("rejects invalid files and cleans up local preview URLs", async () => {
  render(
    <MemoryRouter>
      <GalleryManagementPage />
    </MemoryRouter>,
  );
  await selectEvent();
  const large = new File([new Uint8Array(3 * 1024 * 1024 + 1)], "large.png", { type: "image/png" });
  fireEvent.change(screen.getByLabelText("Photos"), {
    target: { files: [large, new File(["pdf"], "notes.pdf", { type: "application/pdf" })] },
  });
  expect(await screen.findByRole("alert")).toHaveProperty(
    "textContent",
    "Not added: large.png, notes.pdf. Use JPEG, PNG or WebP files up to 3 MB.",
  );
  expect(api.post).not.toHaveBeenCalled();
  addFile();
  fireEvent.click(screen.getByRole("button", { name: "Remove session-photo.jpg from queue" }));
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:preview");
});
it("edits captions, unpublishes, and requires confirmation before deleting", async () => {
  render(
    <MemoryRouter>
      <GalleryManagementPage />
    </MemoryRouter>,
  );
  fireEvent.click(await screen.findByRole("button", { name: "Edit Opening session" }));
  fireEvent.change(screen.getByLabelText("Caption"), { target: { value: "Updated caption" } });
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  expect(api.patch).toHaveBeenCalledWith("/gallery/photo-1", {
    title: "Opening session",
    description: "Updated caption",
    isPublished: true,
  });
  fireEvent.click(await screen.findByRole("button", { name: "Unpublish Opening session" }));
  await screen.findByRole("button", { name: "Publish Opening session" });
  fireEvent.click(screen.getByRole("button", { name: "Delete Opening session" }));
  expect(api.delete).not.toHaveBeenCalled();
  fireEvent.click(await screen.findByRole("button", { name: "Confirm delete" }));
  await waitFor(() =>
    expect(screen.queryByRole("heading", { name: "Opening session" })).toBeNull(),
  );
  expect(api.delete).toHaveBeenCalledWith("/gallery/photo-1");
});
it("reports upload progress through the service", async () => {
  const progress = vi.fn();
  await galleryService.upload(new File(["photo"], "photo.jpg"), progress);
  const config = vi.mocked(api.post).mock.calls[0][2]!;
  config.onUploadProgress!({ loaded: 25, total: 100, bytes: 25, lengthComputable: true });
  expect(progress).toHaveBeenCalledWith(25);
});
