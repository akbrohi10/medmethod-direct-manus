import { afterEach, describe, expect, it, vi } from "vitest";
import { trackMetaEventWhenReadyOnce } from "../client/src/lib/metaPixel";

describe("delayed Meta Pixel event delivery", () => {
  afterEach(() => {
    vi.useRealTimers();
    Reflect.deleteProperty(globalThis, "window");
  });

  it("waits for fbq, sends CompleteRegistration once, and guards only after delivery", async () => {
    vi.useFakeTimers();
    const storage = new Map<string, string>();
    const calls: unknown[][] = [];
    const fakeWindow = {
      location: { pathname: "/webinar-registration-confirmed" },
      sessionStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
      },
      setTimeout: globalThis.setTimeout.bind(globalThis),
    } as unknown as Window & {
      fbq?: (...args: unknown[]) => void;
    };

    Object.defineProperty(globalThis, "window", {
      configurable: true,
      writable: true,
      value: fakeWindow,
    });

    const options = {
      eventName: "CompleteRegistration",
      expectedPath: "/webinar-registration-confirmed",
      storageKey: "test:webinar-complete-registration",
      retryIntervalMs: 250,
      timeoutMs: 60_000,
    };

    trackMetaEventWhenReadyOnce(options);
    await vi.advanceTimersByTimeAsync(2_000);
    expect(calls).toHaveLength(0);
    expect(storage.get(options.storageKey)).toBeUndefined();

    fakeWindow.fbq = (...args: unknown[]) => calls.push(args);
    await vi.advanceTimersByTimeAsync(250);

    expect(calls).toEqual([["track", "CompleteRegistration", undefined]]);
    expect(storage.get(options.storageKey)).toBe("1");

    trackMetaEventWhenReadyOnce(options);
    await vi.advanceTimersByTimeAsync(1_000);
    expect(calls).toHaveLength(1);
  });
});
