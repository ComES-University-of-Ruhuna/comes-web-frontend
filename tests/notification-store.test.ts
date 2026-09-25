import { beforeEach, expect, it, vi } from "vitest";
import { useNotificationStore } from "../src/store/notificationStore";

vi.hoisted(() => {
  const values = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => values.set(key, value)),
    removeItem: vi.fn((key: string) => values.delete(key)),
    clear: () => values.clear(),
  });
});

beforeEach(() => {
  localStorage.clear();
  useNotificationStore.setState({ notifications: [], unreadCount: 0 });
});

it("starts without demo notifications", () => {
  expect(useNotificationStore.getInitialState()).toMatchObject({
    notifications: [],
    unreadCount: 0,
  });
});

it.each([false, true])(
  "removes persisted samples while preserving real alerts: %s",
  async (withRealAlerts) => {
    const samples = [1, 2, 3, 4].map((number) => ({
      id: `sample-${number}`,
      type: "system",
      title: "Demo",
      message: "Demo notification",
      timestamp: new Date().toISOString(),
      read: number > 2,
    }));
    const realAlerts = withRealAlerts
      ? [
          { ...samples[0], id: "real-unread", title: "Saved event", read: false },
          { ...samples[0], id: "real-read", title: "Read update", read: true },
        ]
      : [];
    localStorage.setItem(
      "comes-notifications",
      JSON.stringify({
        state: { notifications: [...samples, ...realAlerts], unreadCount: 99 },
        version: 0,
      }),
    );

    await useNotificationStore.persist.rehydrate();

    expect(useNotificationStore.getState().notifications).toEqual(realAlerts);
    expect(useNotificationStore.getState().unreadCount).toBe(withRealAlerts ? 1 : 0);
    expect(JSON.parse(localStorage.getItem("comes-notifications")!).version).toBe(1);
    await useNotificationStore.persist.rehydrate();
    expect(useNotificationStore.getState().notifications).toEqual(realAlerts);
  },
);

it("continues to add, read, and remove genuine notifications", () => {
  useNotificationStore.getState().addNotification({
    type: "event",
    title: "Saved event",
    message: "Event registration confirmed",
  });
  const notification = useNotificationStore.getState().notifications[0];
  expect(useNotificationStore.getState().unreadCount).toBe(1);
  useNotificationStore.getState().markAsRead(notification.id);
  expect(useNotificationStore.getState().unreadCount).toBe(0);
  expect(useNotificationStore.getState().notifications[0].read).toBe(true);
  useNotificationStore.getState().removeNotification(notification.id);
  expect(useNotificationStore.getState().notifications).toEqual([]);
});
