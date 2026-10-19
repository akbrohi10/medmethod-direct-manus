import { afterEach, describe, expect, it, vi } from "vitest";
import { CARE_TEAM_CONFIRMATION_LEAD_CODE } from "../client/src/lib/careTeamConfirmationLead";

const run = () => new Function(CARE_TEAM_CONFIRMATION_LEAD_CODE)();
afterEach(() => vi.unstubAllGlobals());

describe("unconditional parameter-free confirmation Lead command", () => {
  it("is exactly the supplied Lead call with no condition or session checks", () => {
    expect(CARE_TEAM_CONFIRMATION_LEAD_CODE).toBe("fbq('track', 'Lead');");
  });

  it("calls Lead on every execution and refreshed load", () => {
    const fbq = vi.fn(); vi.stubGlobal("fbq", fbq); run(); run();
    expect(fbq.mock.calls).toEqual([["track", "Lead"], ["track", "Lead"]]);
    const refreshedFbq = vi.fn(); vi.stubGlobal("fbq", refreshedFbq); run();
    expect(refreshedFbq.mock.calls).toEqual([["track", "Lead"]]);
  });

  it("ignores the old Lead and Schedule flags without reading or modifying them", () => {
    const fbq = vi.fn(); vi.stubGlobal("fbq", fbq);
    const getItem = vi.fn(() => "true"), setItem = vi.fn(), removeItem = vi.fn();
    vi.stubGlobal("window", { sessionStorage: { getItem, setItem, removeItem } }); run();
    expect(fbq).toHaveBeenCalledWith("track", "Lead");
    expect(getItem).not.toHaveBeenCalled(); expect(setItem).not.toHaveBeenCalled(); expect(removeItem).not.toHaveBeenCalled();
  });

  it("does not skip Lead if sessionStorage access is denied", () => {
    const fbq = vi.fn(); vi.stubGlobal("fbq", fbq);
    const win = {}; Object.defineProperty(win, "sessionStorage", { get() { throw new Error("storage denied"); } });
    vi.stubGlobal("window", win); expect(run).not.toThrow(); expect(fbq).toHaveBeenCalledWith("track", "Lead");
  });

  it("queues the command while the base snippet's asynchronous SDK is loading", () => {
    const queue: unknown[][] = []; vi.stubGlobal("fbq", (...args: unknown[]) => queue.push(args)); run();
    expect(queue).toEqual([["track", "Lead"]]);
  });

  it("does not contain extra events, parameters, matching, initialization or suppression logic", () => {
    expect(CARE_TEAM_CONFIRMATION_LEAD_CODE).not.toMatch(/sessionStorage|mmd_lead_fired|\bif\b|PageView|Schedule|Purchase|CompleteRegistration|name|email|phone|dob|condition|treatment|value|currency|user_data|init/);
  });
});
