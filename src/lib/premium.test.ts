import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  isPremiumActive,
  activatePremium,
  deactivatePremium,
  getPremiumCourseProgress,
  markPremiumCourseOpened,
  markPremiumCourseCompleted,
  resetPremiumCourseProgress,
  getPremiumStats,
  subscribePremium,
} from "../lib/premium";

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("premium activation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it("should be inactive by default", () => {
    expect(isPremiumActive()).toBe(false);
  });

  it("should activate and deactivate", () => {
    activatePremium();
    expect(localStorageMock.setItem).toHaveBeenCalledWith("kairo.premium.active", "1");
    localStorageMock.getItem.mockReturnValue("1");
    expect(isPremiumActive()).toBe(true);
    deactivatePremium();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("kairo.premium.active");
  });

  it("should notify subscribers on activation", () => {
    const listener = vi.fn();
    const unsub = subscribePremium(listener);
    activatePremium();
    expect(listener).toHaveBeenCalled();
    unsub();
  });
});

describe("premium progress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it("should mark a course as opened", () => {
    markPremiumCourseOpened("curso-1");
    const stored = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
    expect(stored["curso-1"].startedAt).toBeTruthy();
    expect(stored["curso-1"].completedAt).toBeNull();
    expect(getPremiumCourseProgress("curso-1")).toBeNull();
  });

  it("should preserve startedAt when completing", () => {
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify({
        "curso-1": { startedAt: "2026-01-01", completedAt: null, lastOpenedAt: null },
      }),
    );
    markPremiumCourseCompleted("curso-1");
    const stored = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
    expect(stored["curso-1"].startedAt).toBe("2026-01-01");
    expect(stored["curso-1"].completedAt).toBeTruthy();
  });

  it("should compute stats correctly", () => {
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify({
        a: { startedAt: "x", completedAt: "y", lastOpenedAt: "z" },
        b: { startedAt: "x", completedAt: null, lastOpenedAt: "z" },
      }),
    );
    const stats = getPremiumStats(["a", "b", "c"]);
    expect(stats).toEqual({ total: 3, started: 2, completed: 1, pct: 33 });
  });

  it("should reset progress for one course only", () => {
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify({
        a: { startedAt: "x", completedAt: null, lastOpenedAt: null },
        b: { startedAt: "x", completedAt: null, lastOpenedAt: null },
      }),
    );
    resetPremiumCourseProgress("a");
    const stored = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
    expect(stored.a).toBeUndefined();
    expect(stored.b).toBeDefined();
  });
});
