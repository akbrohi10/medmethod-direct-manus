import { afterEach, describe, expect, it, vi } from "vitest";
import { CARE_TEAM_CONFIRMATION_LEAD_CODE } from "../client/src/lib/careTeamConfirmationLead";

const flag = new Map<string, string>();
const run = () => new Function(CARE_TEAM_CONFIRMATION_LEAD_CODE)();
function setup(pathname = "/care-team-booking-confirmed") {
  const fbq = vi.fn();
  const sessionStorage = { getItem: (key: string) => flag.get(key) ?? null, setItem: (key: string, value: string) => flag.set(key, value) };
  vi.stubGlobal("window", { location: { pathname }, sessionStorage });
  vi.stubGlobal("fbq", fbq);
  return fbq;
}

afterEach(() => { vi.unstubAllGlobals(); flag.clear(); });

describe("care-team confirmation session-only parameter-free Lead", () => {
  it("fires only once even when called again after a refresh in the same session", () => {
    const fbq = setup();
    run(); run();
    expect(fbq.mock.calls).toEqual([["track", "Lead"]]);
    expect([...flag]).toEqual([["mmd_lead_fired", "true"]]);
    const refreshedFbq = setup();
    run();
    expect(refreshedFbq).not.toHaveBeenCalled();
  });

  it("can fire once again in a new session", () => {
    const fbq = setup(); run(); flag.clear(); run();
    expect(fbq.mock.calls).toEqual([["track", "Lead"], ["track", "Lead"]]);
  });

  it.each(["/", "/masterclass", "/care-team-booking", "/webinar-registration-confirmed", "/intake/thank-you", "/care-team-booking-confirmed-other"])("does not add a Lead or flag on %s", path => {
    const fbq = setup(path); run();
    expect(fbq).not.toHaveBeenCalled();
    expect(flag.size).toBe(0);
  });

  it("never marks an event as fired while fbq does not exist", () => {
    setup(); vi.stubGlobal("fbq", undefined); run();
    expect(flag.size).toBe(0);
    const fbq = setup(); run();
    expect(fbq).toHaveBeenCalledOnce();
    expect(fbq).toHaveBeenCalledWith("track", "Lead");
  });

  it("queues safely when the async SDK is loading after the base snippet", () => {
    setup(); const queue: unknown[][] = [];
    vi.stubGlobal("fbq", (...args: unknown[]) => queue.push(args)); run(); run();
    expect(queue).toEqual([["track", "Lead"]]);
  });

  it("fails closed when sessionStorage is blocked rather than risking repeat leads", () => {
    const fbq = setup();
    (window as unknown as { sessionStorage: object }).sessionStorage = { getItem() { throw new Error("storage denied"); } };
    expect(run).not.toThrow(); expect(fbq).not.toHaveBeenCalled();
  });

  it("does not send data when storage cannot persist the flag", () => {
    const fbq = setup();
    (window as unknown as { sessionStorage: object }).sessionStorage = { getItem: () => null, setItem() { throw new Error("storage full"); } };
    run(); expect(fbq).not.toHaveBeenCalled();
  });

  it("has exactly two Lead arguments and no advanced matching or patient/event parameters", () => {
    expect(CARE_TEAM_CONFIRMATION_LEAD_CODE).toContain("fbq('track', 'Lead');");
    expect(CARE_TEAM_CONFIRMATION_LEAD_CODE).not.toMatch(/\b(?:name|email|phone|dob|condition|treatment|value|currency|user_data)\b/i);
    expect(CARE_TEAM_CONFIRMATION_LEAD_CODE).not.toContain("fbq('init'");
    expect(CARE_TEAM_CONFIRMATION_LEAD_CODE).not.toContain("PageView");
  });
});
