import { afterEach, describe, expect, it, vi } from "vitest";
import { CARE_TEAM_CONFIRMATION_LEAD_CODE } from "../client/src/lib/careTeamConfirmationLead";

const flag = new Map<string, string>();
const events = [["track", "Lead"]];
const run = () => new Function(CARE_TEAM_CONFIRMATION_LEAD_CODE)();
function setup(pathname = "/care-team-booking-confirmed") {
  const fbq = vi.fn();
  const sessionStorage = { getItem: (key: string) => flag.get(key) ?? null, setItem: (key: string, value: string) => flag.set(key, value) };
  vi.stubGlobal("window", { location: { pathname }, sessionStorage });
  vi.stubGlobal("fbq", fbq);
  return fbq;
}

afterEach(() => { vi.unstubAllGlobals(); flag.clear(); });

describe("care-team confirmation session-only parameter-free Lead without Schedule", () => {
  it("fires Lead once and prevents duplicates on repeated calls or refresh", () => {
    const fbq = setup(); run(); run();
    expect(fbq.mock.calls).toEqual(events);
    expect([...flag]).toEqual([["mmd_lead_fired", "true"]]);
    const refreshedFbq = setup(); run();
    expect(refreshedFbq).not.toHaveBeenCalled();
  });

  it("can fire Lead once again in a new session", () => {
    const fbq = setup(); run(); flag.clear(); run();
    expect(fbq.mock.calls).toEqual([...events, ...events]);
  });

  it("preserves the earlier Lead flag and adds no Schedule or other event", () => {
    flag.set("mmd_lead_fired", "true");
    const fbq = setup(); run(); run();
    expect(fbq).not.toHaveBeenCalled();
    expect([...flag]).toEqual([["mmd_lead_fired", "true"]]);
  });

  it("ignores a legacy Schedule flag without removing it or calling Schedule", () => {
    flag.set("mmd_schedule_fired", "true");
    const fbq = setup(); run(); run();
    expect(fbq.mock.calls).toEqual(events);
    expect(flag.get("mmd_schedule_fired")).toBe("true");
    expect(flag.get("mmd_lead_fired")).toBe("true");
  });

  it.each(["/", "/masterclass", "/care-team-booking", "/webinar-registration-confirmed", "/intake/thank-you", "/care-team-booking-confirmed-other"])("does not add an event or flag on %s", path => {
    const fbq = setup(path); run();
    expect(fbq).not.toHaveBeenCalled(); expect(flag.size).toBe(0);
  });

  it("never marks Lead while fbq does not exist", () => {
    setup(); vi.stubGlobal("fbq", undefined); run();
    expect(flag.size).toBe(0);
    const fbq = setup(); run(); expect(fbq.mock.calls).toEqual(events);
  });

  it("queues only Lead when the async SDK is loading after the base snippet", () => {
    setup(); const queue: unknown[][] = [];
    vi.stubGlobal("fbq", (...args: unknown[]) => queue.push(args)); run(); run();
    expect(queue).toEqual(events);
  });

  it("fails closed when sessionStorage is blocked rather than risking repeat leads", () => {
    const fbq = setup();
    (window as unknown as { sessionStorage: object }).sessionStorage = { getItem() { throw new Error("storage denied"); } };
    expect(run).not.toThrow(); expect(fbq).not.toHaveBeenCalled();
  });

  it("does not send Lead when its flag cannot be persisted", () => {
    const fbq = setup();
    (window as unknown as { sessionStorage: object }).sessionStorage = { getItem: () => null, setItem() { throw new Error("storage full"); } };
    run(); expect(fbq).not.toHaveBeenCalled();
  });

  it("uses only exact two-argument Lead with no Schedule or personal/event fields", () => {
    expect(CARE_TEAM_CONFIRMATION_LEAD_CODE).toContain("fbq('track', 'Lead');");
    expect(CARE_TEAM_CONFIRMATION_LEAD_CODE).not.toContain("mmd_schedule_fired");
    expect(CARE_TEAM_CONFIRMATION_LEAD_CODE).not.toMatch(/\b(?:name|email|phone|dob|condition|treatment|value|currency|user_data|Schedule|Purchase|CompleteRegistration)\b/i);
    expect(CARE_TEAM_CONFIRMATION_LEAD_CODE).not.toContain("fbq('init'");
    expect(CARE_TEAM_CONFIRMATION_LEAD_CODE).not.toContain("PageView");
  });
});
