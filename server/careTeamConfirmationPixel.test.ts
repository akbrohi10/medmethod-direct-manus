import { afterEach, describe, expect, it, vi } from "vitest";
import { CARE_TEAM_CONFIRMATION_PIXEL_CODE } from "../client/src/lib/careTeamConfirmationPixel";

const flag = new Map<string, string>();
function setup(pathname = "/care-team-booking-confirmed", search = "", hash = "") {
  const fbq = vi.fn();
  vi.stubGlobal("window", { fbq, location: { pathname, search, hash }, sessionStorage: { getItem: (key: string) => flag.get(key) ?? null, setItem: (key: string, value: string) => flag.set(key, value) } });
  vi.stubGlobal("fbq", fbq);
  vi.stubGlobal("document", {});
  return fbq;
}
const run = () => new Function(CARE_TEAM_CONFIRMATION_PIXEL_CODE)();
afterEach(() => { vi.unstubAllGlobals(); flag.clear(); });

describe("single confirmation head pixel with unconditional Lead after PageView", () => {
  it("initializes without matching data, calls PageView then Lead, and preserves manual-only configuration", () => {
    const fbq = setup(); run();
    expect(fbq.mock.calls).toEqual([["set", "autoConfig", false, "1589326469554181"], ["init", "1589326469554181"], ["track", "PageView"], ["track", "Lead"]]);
    expect(flag.size).toBe(0);
    expect(CARE_TEAM_CONFIRMATION_PIXEL_CODE).toContain("fbq('track', 'PageView');\nfbq('track', 'Lead');");
    expect(CARE_TEAM_CONFIRMATION_PIXEL_CODE).not.toContain("fbq('track', 'Schedule')");
    expect(CARE_TEAM_CONFIRMATION_PIXEL_CODE).not.toContain("fbq('track', 'Purchase')");
  });

  it("calls Lead immediately after PageView again on refresh", () => {
    setup(); run(); const refreshedFbq = setup(); run();
    expect(refreshedFbq.mock.calls).toEqual([["set", "autoConfig", false, "1589326469554181"], ["init", "1589326469554181"], ["track", "PageView"], ["track", "Lead"]]);
  });

  it("does not suppress Lead when the old session flag already exists", () => {
    flag.set("mmd_lead_fired", "true"); const fbq = setup(); run();
    expect(fbq.mock.calls.slice(-2)).toEqual([["track", "PageView"], ["track", "Lead"]]);
    expect([...flag]).toEqual([["mmd_lead_fired", "true"]]);
  });

  it("does not require sessionStorage for either event", () => {
    const fbq = setup();
    Object.defineProperty(window, "sessionStorage", { get() { throw new Error("storage denied"); } });
    expect(run).not.toThrow();
    expect(fbq.mock.calls.slice(-2)).toEqual([["track", "PageView"], ["track", "Lead"]]);
  });

  it.each(["/", "/masterclass", "/care-team-booking", "/care-team-booking-confirmed-other"])("does nothing on %s", path => {
    const fbq = setup(path); run(); expect(fbq).not.toHaveBeenCalled(); expect(flag.size).toBe(0);
  });

  it.each([["?booking=synthetic", ""], ["", "#synthetic"], ["?patient=synthetic", "#synthetic"]])("fails closed until query/hash data are removed", (search, hash) => {
    const fbq = setup("/care-team-booking-confirmed", search, hash); run();
    expect(fbq).not.toHaveBeenCalled(); expect(flag.size).toBe(0);
  });
});
