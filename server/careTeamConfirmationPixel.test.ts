import { afterEach, describe, expect, it, vi } from "vitest";
import { CARE_TEAM_CONFIRMATION_PIXEL_CODE } from "../client/src/lib/careTeamConfirmationPixel";

const run = () => new Function(CARE_TEAM_CONFIRMATION_PIXEL_CODE)();
afterEach(() => vi.unstubAllGlobals());

describe("retired confirmation script compatibility export", () => {
  it("is an empty string, not an executable tracking snippet", () => {
    expect(CARE_TEAM_CONFIRMATION_PIXEL_CODE).toBe("");
    expect(run).not.toThrow();
  });

  it.each(["/care-team-booking-confirmed", "/care-team-booking", "/", "/masterclass"]) ("does nothing on %s, including refresh", pathname => {
    const fbq = vi.fn(), getItem = vi.fn(), setItem = vi.fn(), createElement = vi.fn();
    vi.stubGlobal("fbq", fbq);
    vi.stubGlobal("window", { fbq, location: { pathname, search: "?synthetic=1", hash: "#synthetic" }, sessionStorage: { getItem, setItem } });
    vi.stubGlobal("document", { createElement });
    run(); run();
    for (const spy of [fbq, getItem, setItem, createElement]) expect(spy).not.toHaveBeenCalled();
  });

  it("does not access denied browser storage", () => {
    const win = {};
    Object.defineProperty(win, "sessionStorage", { get() { throw new Error("storage denied"); } });
    vi.stubGlobal("window", win);
    expect(run).not.toThrow();
  });
});
