import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createMasterclass3VideoTracker,
  emitMasterclass3VideoEvent,
  type Masterclass3TrackingTarget,
  type Masterclass3VideoEvent,
  type YouTubeAPI,
} from "../client/src/lib/masterclass3VideoTracking";

const events: Masterclass3VideoEvent[] = [
  "masterclass_video_start",
  "masterclass_video_25",
  "masterclass_video_50",
  "masterclass_video_75",
  "masterclass_video_90",
  "masterclass_video_complete",
];

function playerAt(current = 0, duration = 100) {
  return {
    getCurrentTime: vi.fn(() => current),
    getDuration: vi.fn(() => duration),
    destroy: vi.fn(),
  };
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Masterclass 3 event transport", () => {
  it("sends each fixed event through gtag and Hotjar without params or a duplicate queue push", () => {
    const target = {
      gtag: vi.fn(),
      dataLayer: { push: vi.fn() },
      hj: vi.fn(),
      fbq: vi.fn(),
    };
    for (const event of events) emitMasterclass3VideoEvent(event, target);
    expect(target.gtag.mock.calls).toEqual(
      events.map(event => ["event", event])
    );
    expect(target.hj.mock.calls).toEqual(events.map(event => ["event", event]));
    expect(target.dataLayer.push).not.toHaveBeenCalled();
    expect(target.fbq).not.toHaveBeenCalled();
  });

  it("falls back to event-only dataLayer entries and never calls Meta", () => {
    const target = { dataLayer: { push: vi.fn() }, fbq: vi.fn() };
    for (const event of events) emitMasterclass3VideoEvent(event, target);
    expect(target.dataLayer.push.mock.calls).toEqual(
      events.map(event => [{ event }])
    );
    expect(target.fbq).not.toHaveBeenCalled();
  });

  it("creates a queue when needed, without creating provider functions", () => {
    const target: Masterclass3TrackingTarget = {};
    emitMasterclass3VideoEvent("masterclass_video_start", target);
    expect(target).toEqual({
      dataLayer: [{ event: "masterclass_video_start" }],
    });
  });

  it("does not duplicate Google events if gtag throws, and still sends Hotjar", () => {
    const target = {
      gtag: vi.fn(() => {
        throw new Error("provider unavailable");
      }),
      dataLayer: { push: vi.fn() },
      hj: vi.fn(),
    };
    expect(() =>
      emitMasterclass3VideoEvent("masterclass_video_start", target)
    ).not.toThrow();
    expect(target.dataLayer.push).not.toHaveBeenCalled();
    expect(target.hj.mock.calls).toEqual([
      ["event", "masterclass_video_start"],
    ]);
  });

  it("tolerates failed queue and Hotjar providers", () => {
    const target = {
      dataLayer: {
        push: vi.fn(() => {
          throw new Error("queue unavailable");
        }),
      },
      hj: vi.fn(() => {
        throw new Error("Hotjar unavailable");
      }),
    };
    expect(() =>
      emitMasterclass3VideoEvent("masterclass_video_start", target)
    ).not.toThrow();
    expect(target.hj).toHaveBeenCalledTimes(1);
  });

  it("is safe without a browser", () => {
    expect(() =>
      emitMasterclass3VideoEvent("masterclass_video_start")
    ).not.toThrow();
  });

  it.each([
    "/masterclass3-demo",
    "/masterclass3/test",
    "/preview/masterclass3",
    "/admin/masterclass3",
  ])(
    "skips real-window tracking on %s but not explicitly injected targets",
    pathname => {
      const browser = {
        location: { pathname },
        gtag: vi.fn(),
        hj: vi.fn(),
        fbq: vi.fn(),
      };
      vi.stubGlobal("window", browser);
      emitMasterclass3VideoEvent("masterclass_video_start");
      expect(browser.gtag).not.toHaveBeenCalled();
      expect(browser.hj).not.toHaveBeenCalled();
      emitMasterclass3VideoEvent("masterclass_video_start", browser);
      expect(browser.gtag).toHaveBeenCalledTimes(1);
      expect(browser.fbq).not.toHaveBeenCalled();
    }
  );

  it("uses the real window on the live path without sending its URL or any extra data", () => {
    const browser = {
      location: { pathname: "/masterclass3" },
      gtag: vi.fn(),
      hj: vi.fn(),
    };
    vi.stubGlobal("window", browser);
    emitMasterclass3VideoEvent("masterclass_video_start");
    expect(browser.gtag.mock.calls).toEqual([
      ["event", "masterclass_video_start"],
    ]);
    expect(browser.hj.mock.calls).toEqual([
      ["event", "masterclass_video_start"],
    ]);
  });

  it("contains no Meta calls, global type augmentation, or identifying payload fields", () => {
    const source = readFileSync(
      new URL(
        "../client/src/lib/masterclass3VideoTracking.ts",
        import.meta.url
      ),
      "utf8"
    );
    expect(source).not.toMatch(
      /fbq|fbevents|facebook\.(?:com|net)|declare global|interface Window/
    );
    expect(source).not.toMatch(
      /contact|symptom|user_?id|video_?title|content_name/i
    );
  });
});

describe("Masterclass 3 playback controller", () => {
  it("starts only on PLAYING and polls exactly once per second, without duplicate intervals", () => {
    const emit = vi.fn();
    const player = playerAt(25);
    const tracker = createMasterclass3VideoTracker(emit);
    for (const state of [-1, 5, 2, 3, 0]) tracker.onStateChange(state, player);
    tracker.poll(player);
    expect(emit).not.toHaveBeenCalled();
    expect(player.getDuration).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
    tracker.onStateChange(1, player);
    tracker.onStateChange(1, player);
    expect(emit.mock.calls).toEqual([[events[0]]]);
    expect(vi.getTimerCount()).toBe(1);
    vi.advanceTimersByTime(999);
    expect(player.getCurrentTime).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(emit.mock.calls).toEqual([[events[0]], [events[1]]]);
    expect(player.getCurrentTime).toHaveBeenCalledTimes(1);
    expect(player.getDuration).toHaveBeenCalledTimes(1);
    tracker.dispose();
  });

  it("emits each crossed threshold once, including all thresholds crossed by seeking", () => {
    const emit = vi.fn();
    const player = playerAt();
    const tracker = createMasterclass3VideoTracker(emit);
    tracker.onStateChange(1, player);
    player.getCurrentTime.mockReturnValue(24.99);
    tracker.poll(player);
    expect(emit.mock.calls).toEqual([[events[0]]]);
    player.getCurrentTime.mockReturnValue(25);
    tracker.poll(player);
    tracker.poll(player);
    expect(emit.mock.calls).toEqual([[events[0]], [events[1]]]);
    player.getCurrentTime.mockReturnValue(91);
    tracker.poll(player);
    player.getCurrentTime.mockReturnValue(10);
    tracker.poll(player);
    player.getCurrentTime.mockReturnValue(100);
    tracker.poll(player);
    expect(emit.mock.calls).toEqual(events.slice(0, 5).map(event => [event]));
    tracker.dispose();
  });

  it.each([25, 50, 75, 90])(
    "counts the exact %s percent boundary, not just rounded values",
    percentage => {
      const emit = vi.fn();
      const player = playerAt(percentage * 2 - 0.01, 200);
      const tracker = createMasterclass3VideoTracker(emit);
      tracker.onStateChange(1, player);
      tracker.poll(player);
      const event = `masterclass_video_${percentage}`;
      expect(emit).not.toHaveBeenCalledWith(event);
      player.getCurrentTime.mockReturnValue(percentage * 2);
      tracker.poll(player);
      expect(emit).toHaveBeenCalledWith(event);
      tracker.dispose();
    }
  );

  it("completes only on ENDED after start, and deduplicates every event across replay", () => {
    const emit = vi.fn();
    const player = playerAt(100);
    const tracker = createMasterclass3VideoTracker(emit);
    tracker.onStateChange(0, player);
    expect(emit).not.toHaveBeenCalled();
    tracker.onStateChange(1, player);
    tracker.poll(player);
    expect(emit).not.toHaveBeenCalledWith(events[5]);
    tracker.onStateChange(2, player);
    tracker.onStateChange(3, player);
    expect(emit).not.toHaveBeenCalledWith(events[5]);
    tracker.onStateChange(0, player);
    tracker.onStateChange(0, player);
    tracker.onStateChange(1, player);
    tracker.poll(player);
    tracker.onStateChange(0, player);
    expect(emit.mock.calls).toEqual(events.map(event => [event]));
    expect(vi.getTimerCount()).toBe(0);
    tracker.dispose();
  });

  it.each([2, 3, -1, 5, 0])(
    "stops polling on non-playing state %s and resumes on PLAYING",
    state => {
      const emit = vi.fn();
      const player = playerAt(25);
      const tracker = createMasterclass3VideoTracker(emit);
      tracker.onStateChange(1, player);
      tracker.onStateChange(state, player);
      expect(vi.getTimerCount()).toBe(0);
      vi.advanceTimersByTime(3000);
      tracker.poll(player);
      expect(player.getCurrentTime).not.toHaveBeenCalled();
      tracker.onStateChange(1, player);
      vi.advanceTimersByTime(1000);
      expect(player.getCurrentTime).toHaveBeenCalledTimes(1);
      expect(
        emit.mock.calls.filter(([event]) => event === events[0])
      ).toHaveLength(1);
      tracker.dispose();
    }
  );

  it.each([
    [90, 0],
    [90, -1],
    [90, NaN],
    [90, Infinity],
    [90, -Infinity],
    [0, 100],
    [-1, 100],
    [NaN, 100],
    [Infinity, 100],
    [-Infinity, 100],
  ])("ignores invalid time/duration %s/%s", (current, duration) => {
    const emit = vi.fn();
    const player = playerAt(current, duration);
    const tracker = createMasterclass3VideoTracker(emit);
    tracker.onStateChange(1, player);
    tracker.poll(player);
    expect(emit.mock.calls).toEqual([[events[0]]]);
    player.getCurrentTime.mockReturnValue(50);
    player.getDuration.mockReturnValue(100);
    tracker.poll(player);
    expect(emit.mock.calls).toEqual(events.slice(0, 3).map(event => [event]));
    tracker.dispose();
  });

  it("makes dispose permanent and idempotent, clearing timers without destroying the parent's player", () => {
    const emit = vi.fn();
    const player = playerAt(90);
    const tracker = createMasterclass3VideoTracker(emit);
    tracker.onStateChange(1, player);
    tracker.dispose();
    tracker.dispose();
    vi.advanceTimersByTime(5000);
    tracker.poll(player);
    tracker.onStateChange(1, player);
    tracker.onStateChange(0, player);
    expect(vi.getTimerCount()).toBe(0);
    expect(player.getCurrentTime).not.toHaveBeenCalled();
    expect(player.destroy).not.toHaveBeenCalled();
    expect(emit.mock.calls).toEqual([[events[0]]]);
  });

  it("tolerates unavailable player methods and a throwing custom emitter", () => {
    const emit = vi.fn(() => {
      throw new Error("sink unavailable");
    });
    const player = playerAt(90);
    const tracker = createMasterclass3VideoTracker(emit);
    expect(() => tracker.onStateChange(1, player)).not.toThrow();
    player.getDuration.mockImplementationOnce(() => {
      throw new Error("iframe unavailable");
    });
    expect(() => tracker.poll(player)).not.toThrow();
    expect(() => tracker.poll(player)).not.toThrow();
    expect(() => tracker.poll(player)).not.toThrow();
    expect(() => tracker.onStateChange(0, player)).not.toThrow();
    expect(emit.mock.calls).toEqual(events.map(event => [event]));
    tracker.dispose();
  });

  it("keeps separate page-player controller instances independent", () => {
    const emit = vi.fn();
    const player = playerAt(90);
    const first = createMasterclass3VideoTracker(emit);
    const second = createMasterclass3VideoTracker(emit);
    first.onStateChange(1, player);
    second.onStateChange(1, player);
    expect(emit.mock.calls).toEqual([[events[0]], [events[0]]]);
    first.dispose();
    second.dispose();
  });
});

// Minimal DOM stub: script events are triggered by tests; no network is used.
function fakeBrowser(existingScript = false) {
  class Script {
    src = "https://www.youtube.com/iframe_api";
    async = false;
    listeners = new Map<string, Set<() => void>>();
    addEventListener(type: string, listener: () => void) {
      const listeners = this.listeners.get(type) ?? new Set<() => void>();
      listeners.add(listener);
      this.listeners.set(type, listeners);
    }
    removeEventListener(type: string, listener: () => void) {
      this.listeners.get(type)?.delete(listener);
    }
    fire(type: string) {
      for (const listener of [...(this.listeners.get(type) ?? [])]) listener();
    }
    remove() {
      const index = scripts.indexOf(this);
      if (index !== -1) scripts.splice(index, 1);
    }
  }
  const scripts: Script[] = existingScript ? [new Script()] : [];
  const browser: { YT?: YouTubeAPI; onYouTubeIframeAPIReady?: () => void } = {};
  const createElement = vi.fn(() => new Script());
  const appendChild = vi.fn((script: Script) => scripts.push(script));
  vi.stubGlobal("window", browser);
  vi.stubGlobal("document", {
    querySelector: vi.fn(() => scripts[0] ?? null),
    createElement,
    head: { appendChild },
  });
  return { browser, scripts, createElement, appendChild };
}

function fakeAPI(): YouTubeAPI {
  return { Player: vi.fn() as unknown as YouTubeAPI["Player"] };
}

async function freshLoader() {
  vi.resetModules();
  return (await import("../client/src/lib/masterclass3VideoTracking"))
    .loadMasterclass3YouTubeAPI;
}

describe("Masterclass 3 YouTube API loader", () => {
  it("rejects without a browser and can subsequently load in a browser", async () => {
    const load = await freshLoader();
    await expect(load()).rejects.toThrow("requires a browser");
    const { browser } = fakeBrowser();
    browser.YT = fakeAPI();
    await expect(load()).resolves.toBe(browser.YT);
  });

  it("returns a shared promise for an already available API without loading a script or creating a player", async () => {
    const load = await freshLoader();
    const { browser, createElement, appendChild } = fakeBrowser();
    const previous = vi.fn();
    browser.onYouTubeIframeAPIReady = previous;
    browser.YT = fakeAPI();
    const promise = load();
    expect(load()).toBe(promise);
    await expect(promise).resolves.toBe(browser.YT);
    expect(createElement).not.toHaveBeenCalled();
    expect(appendChild).not.toHaveBeenCalled();
    expect(browser.YT.Player).not.toHaveBeenCalled();
    expect(browser.onYouTubeIframeAPIReady).toBe(previous);
  });

  it("shares one script and promise, preserves the existing ready callback, and never creates or autoplays a video", async () => {
    const load = await freshLoader();
    const { browser, scripts, appendChild } = fakeBrowser();
    const previous = vi.fn(function (this: unknown) {
      expect(this).toBe(browser);
    });
    browser.onYouTubeIframeAPIReady = previous;
    const promise = load();
    expect(load()).toBe(promise);
    expect(scripts).toHaveLength(1);
    expect(appendChild).toHaveBeenCalledTimes(1);
    expect(scripts[0].src).toBe("https://www.youtube.com/iframe_api");
    expect(scripts[0].async).toBe(true);
    const api = fakeAPI();
    browser.YT = api;
    browser.onYouTubeIframeAPIReady?.();
    await expect(promise).resolves.toBe(api);
    expect(previous).toHaveBeenCalledTimes(1);
    expect(browser.onYouTubeIframeAPIReady).toBe(previous);
    expect(api.Player).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("reuses an existing in-flight API script", async () => {
    const load = await freshLoader();
    const { browser, scripts, createElement, appendChild } = fakeBrowser(true);
    const promise = load();
    expect(createElement).not.toHaveBeenCalled();
    expect(appendChild).not.toHaveBeenCalled();
    expect(scripts).toHaveLength(1);
    browser.YT = fakeAPI();
    browser.onYouTubeIframeAPIReady?.();
    await expect(promise).resolves.toBe(browser.YT);
  });

  it("still resolves if an existing ready callback throws", async () => {
    const load = await freshLoader();
    const { browser } = fakeBrowser();
    const previous = vi.fn(() => {
      throw new Error("unrelated callback failure");
    });
    browser.onYouTubeIframeAPIReady = previous;
    const promise = load();
    browser.YT = fakeAPI();
    expect(() => browser.onYouTubeIframeAPIReady?.()).not.toThrow();
    await expect(promise).resolves.toBe(browser.YT);
    expect(browser.onYouTubeIframeAPIReady).toBe(previous);
  });

  it("resolves on load if the API is already usable, and does not overwrite a later callback owner", async () => {
    const load = await freshLoader();
    const { browser, scripts } = fakeBrowser();
    const promise = load();
    const laterCallback = vi.fn();
    browser.onYouTubeIframeAPIReady = laterCallback;
    browser.YT = fakeAPI();
    scripts[0].fire("load");
    await expect(promise).resolves.toBe(browser.YT);
    expect(browser.onYouTubeIframeAPIReady).toBe(laterCallback);
  });

  it("rejects on script failure, restores the callback, and allows a shared-promise retry", async () => {
    const load = await freshLoader();
    const { browser, scripts, appendChild } = fakeBrowser();
    const previous = vi.fn();
    browser.onYouTubeIframeAPIReady = previous;
    const first = load();
    expect(load()).toBe(first);
    const rejected = expect(first).rejects.toThrow("Unable to load");
    const failedScript = scripts[0];
    failedScript.fire("error");
    await rejected;
    expect(scripts).toHaveLength(0);
    expect(browser.onYouTubeIframeAPIReady).toBe(previous);
    expect(failedScript.listeners.get("error")?.size).toBe(0);
    const retry = load();
    expect(retry).not.toBe(first);
    expect(load()).toBe(retry);
    expect(appendChild).toHaveBeenCalledTimes(2);
    browser.YT = fakeAPI();
    browser.onYouTubeIframeAPIReady?.();
    await expect(retry).resolves.toBe(browser.YT);
    expect(previous).toHaveBeenCalledTimes(1);
  });
});
