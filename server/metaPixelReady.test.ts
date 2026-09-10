import { afterEach, describe, expect, it, vi } from "vitest";
import { trackMetaEventWhenReadyOnce } from "../client/src/lib/metaPixel";

describe("delayed Meta Pixel event delivery", () => {
  afterEach(() => {
    vi.useRealTimers();
    Reflect.deleteProperty(globalThis, "window");
  });

  it("waits for fbq, sends CompleteRegistration once, and guards only after delivery", async () => {
    vi.useFakeTimers();
    const calls: unknown[][] = [];
    const fakeWindow = {
      location: { pathname: "/webinar-registration-confirmed" },
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
      dedupeKey: "test:webinar-complete-registration",
      retryIntervalMs: 250,
      timeoutMs: 60_000,
    };

    trackMetaEventWhenReadyOnce(options);
    await vi.advanceTimersByTimeAsync(2_000);
    expect(calls).toHaveLength(0);

    fakeWindow.fbq = (...args: unknown[]) => calls.push(args);
    await vi.advanceTimersByTimeAsync(250);

    expect(calls).toEqual([["track", "CompleteRegistration", undefined]]);

    trackMetaEventWhenReadyOnce(options);
    await vi.advanceTimersByTimeAsync(1_000);
    expect(calls).toHaveLength(1);
  });
});
