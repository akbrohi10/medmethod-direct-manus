import { afterEach, describe, expect, it, vi } from "vitest";
import { CARE_TEAM_CONFIRMATION_LEAD_CODE } from "../client/src/lib/careTeamConfirmationLead";

const run = () => new Function(CARE_TEAM_CONFIRMATION_LEAD_CODE)();
afterEach(() => vi.unstubAllGlobals());

describe("retired confirmation command compatibility export", () => {
  it("is an empty string and needs no global SDK", () => {
    expect(CARE_TEAM_CONFIRMATION_LEAD_CODE).toBe("");
    expect(run).not.toThrow();
  });

  it("does not emit on execution, repeat, or refresh", () => {
    const fbq = vi.fn(); vi.stubGlobal("fbq", fbq); run(); run();
    expect(fbq).not.toHaveBeenCalled();
    const refreshed = vi.fn(); vi.stubGlobal("fbq", refreshed); run();
    expect(refreshed).not.toHaveBeenCalled();
  });

  it("does not read or modify historical session flags", () => {
    const getItem = vi.fn(() => "true"), setItem = vi.fn(), removeItem = vi.fn();
    vi.stubGlobal("window", { sessionStorage: { getItem, setItem, removeItem } });
    run();
    for (const spy of [getItem, setItem, removeItem]) expect(spy).not.toHaveBeenCalled();
  });

  it("does not access denied browser storage", () => {
    const win = {};
    Object.defineProperty(win, "sessionStorage", { get() { throw new Error("storage denied"); } });
    vi.stubGlobal("window", win);
    expect(run).not.toThrow();
  });

  it("cannot add a command to a previously existing SDK queue", () => {
    const queue: unknown[][] = [];
    vi.stubGlobal("fbq", (...args: unknown[]) => queue.push(args));
    run();
    expect(queue).toEqual([]);
  });
});
