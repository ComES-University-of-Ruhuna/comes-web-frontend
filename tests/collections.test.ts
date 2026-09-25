import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "../src/services/api";
import { eventsService } from "../src/services/events.service";
import { projectsService } from "../src/services/projects.service";
import { blogService } from "../src/services/blog.service";

vi.mock("../src/services/api", () => ({ default: { get: vi.fn() } }));

describe("paginated collections", () => {
  beforeEach(() => vi.clearAllMocks());

  it.each([
    ["events", "/events", eventsService],
    ["projects", "/projects", projectsService],
    ["posts", "/blog", blogService],
  ] as const)("maps %s into items without losing pagination", async (key, path, service) => {
    const items = [{ _id: "item-1" }];
    const pagination = { page: 2, limit: 10, total: 25, pages: 3 };
    vi.mocked(api.get).mockResolvedValue({
      data: { success: true, data: { [key]: items, pagination } },
    });
    const result = await service.getAll({ page: 2, limit: 10, sort: undefined });
    expect(result.data).toEqual({ items, pagination });
    expect(api.get).toHaveBeenCalledWith(`${path}?page=2&limit=10`);
  });

  it("preserves responses without data", async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { success: false, message: "Unavailable" } });
    expect(await eventsService.getAll()).toEqual({
      success: false,
      message: "Unavailable",
      data: undefined,
    });
  });
});
