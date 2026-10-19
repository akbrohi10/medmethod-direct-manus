import { afterEach, describe, expect, it, vi } from "vitest";
import { CARE_TEAM_CONFIRMATION_LEAD_CODE } from "../client/src/lib/careTeamConfirmationLead";

const flag = new Map<string, string>();
const events = [["track", "Lead"], ["track", "Schedule"]];
const run = () => new Function(CARE_TEAM_CONFIRMATION_LEAD_CODE)();
function setup(pathname = "/care-team-booking-confirmed") {
  const fbq = vi.fn();
  const sessionStorage = { getItem: (key: string) => flag.get(key) ?? null, setItem: (key: string, value: string) => flag.set(key, value) };
  vi.stubGlobal("window", { location: { pathname }, sessionStorage });
  vi.stubGlobal("fbq", fbq);
  return fbq;
}

afterEach(() => { vi.unstubAllGlobals(); flag.clear(); });

describe("care-team confirmation session-only parameter-free Lead and Schedule", () => {
  it("fires both once and prevents duplicates on repeated calls or refresh", () => {
    const fbq = setup(); run(); run();
    expect(fbq.mock.calls).toEqual(events);
    expect([...flag]).toEqual([["mmd_lead_fired", "true"], ["mmd_schedule_fired", "true"]]);
    const refreshedFbq = setup(); run();
    expect(refreshedFbq).not.toHaveBeenCalled();
  });

  it("can fire both once again in a new session", () => {
    const fbq = setup(); run(); flag.clear(); run();
    expect(fbq.mock.calls).toEqual([...events, ...events]);
  });

  it("keeps the earlier Lead flag and sends only Schedule if Lead already fired", () => {
    flag.set("mmd_lead_fired", "true");
    const fbq = setup(); run(); run();
    expect(fbq.mock.calls).toEqual([["track", "Schedule"]]);
    expect(flag.get("mmd_lead_fired")).toBe("true");
    expect(flag.get("mmd_schedule_fired")).toBe("true");
  });

  it("sends only Lead when Schedule already fired", () => {
    flag.set("mmd_schedule_fired", "true");
    const fbq = setup(); run(); run();
    expect(fbq.mock.calls).toEqual([["track", "Lead"]]);
  });

  it.each(["/", "/masterclass", "/care-team-booking", "/webinar-registration-confirmed", "/intake/thank-you", "/care-team-booking-confirmed-other"])("does not add either event or flag on %s", path => {
    const fbq = setup(path); run();
    expect(fbq).not.toHaveBeenCalled(); expect(flag.size).toBe(0);
  });

  it("never marks events while fbq does not exist", () => {
    setup(); vi.stubGlobal("fbq", undefined); run();
    expect(flag.size).toBe(0);
    const fbq = setup(); run(); expect(fbq.mock.calls).toEqual(events);
  });

  it("queues both safely when the async SDK is loading after the base snippet", () => {
    setup(); const queue: unknown[][] = [];
    vi.stubGlobal("fbq", (...args: unknown[]) => queue.push(args)); run(); run();
    expect(queue).toEqual(events);
  });

  it("fails closed when sessionStorage is blocked rather than risking repeat events", () => {
    const fbq = setup();
    (window as unknown as { sessionStorage: object }).sessionStorage = { getItem() { throw new Error("storage denied"); } };
    expect(run).not.toThrow(); expect(fbq).not.toHaveBeenCalled();
  });

  it("does not send an event when its flag cannot be persisted", () => {
    const fbq = setup();
    (window as unknown as { sessionStorage: object }).sessionStorage = { getItem: () => null, setItem() { throw new Error("storage full"); } };
    run(); expect(fbq).not.toHaveBeenCalled();
  });

  it("uses only the exact two-argument events and no matching/patient/value/currency fields", () => {
    expect(CARE_TEAM_CONFIRMATION_LEAD_CODE).toContain("fbq('track', 'Lead');");
    expect(CARE_TEAM_CONFIRMATION_LEAD_CODE).toContain("fbq('track', 'Schedule');");
    expect(CARE_TEAM_CONFIRMATION_LEAD_CODE).not.toMatch(/\b(?:name|email|phone|dob|condition|treatment|value|currency|user_data|Purchase|CompleteRegistration)\b/i);
    expect(CARE_TEAM_CONFIRMATION_LEAD_CODE).not.toContain("fbq('init'");
    expect(CARE_TEAM_CONFIRMATION_LEAD_CODE).not.toContain("PageView");
  });
});
