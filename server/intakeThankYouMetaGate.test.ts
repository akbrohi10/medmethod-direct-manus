import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { webcrypto, createHash } from "node:crypto";
import vm from "node:vm";
import { injectMetaLeadGate, metaLeadFrameHtml } from "./metaLeadTracking";

const script = readFileSync(new URL("../client/public/meta-lead.js", import.meta.url), "utf8");
const KEY = "mmd_meta_lead_once_v1";
const DONE = "mmd_meta_intake_done_v1:";
const accepted = {
  submission_id: "00000000-0000-4000-8000-000000000101", submission_token: "dummy-first-party-capability",
  payment_status: "NOT_REQUIRED", is_test: false, redirect_url: "/intake/thank-you/",
};
function browser(options: { pathname?: string; search?: string; eligible?: boolean; scope?: boolean; session?: Map<string, string>; local?: Map<string, string>; failStorage?: boolean } = {}) {
  const session = options.session ?? new Map<string, string>();
  const local = options.local ?? new Map<string, string>();
  const listeners = new Map<string, Function>();
  const frames: any[] = [];
  const info = vi.fn();
  const location = { pathname: options.pathname ?? "/intake", search: options.search ?? "", hash: "#dummy" };
  const store = (values: Map<string, string>) => ({
    getItem: (key: string) => { if (options.failStorage) throw Error("storage blocked"); return values.get(key) ?? null; },
    setItem: (key: string, value: string) => { if (options.failStorage) throw Error("storage blocked"); values.set(key, value); },
    removeItem: (key: string) => { if (options.failStorage) throw Error("storage blocked"); values.delete(key); },
  });
  const history = { state: { unchanged: true }, replaceState: vi.fn((_state: any, _title: string, url: string) => {
    expect(frames).toHaveLength(0); location.pathname = url; location.search = ""; location.hash = "";
  }) };
  const document = {
    readyState: "complete", getElementById: (id: string) => frames.find(frame => frame.id === id) ?? null,
    createElement: () => ({ attrs: {} as Record<string, string>, contentWindow: { postMessage: vi.fn() }, setAttribute(key: string, value: string) { this.attrs[key] = value; } }),
    body: { appendChild: (frame: any) => { frames.push(frame); } }, addEventListener: (name: string, fn: Function) => listeners.set(name, fn),
  };
  const window: any = {
    __mmdMetaLeadEligible: options.eligible ?? true, __mmdIntakeThankYou: options.scope ?? false,
    location, history, console: { info }, crypto: webcrypto,
    sessionStorage: store(session), localStorage: store(local),
    addEventListener: (name: string, fn: Function) => listeners.set(name, fn), removeEventListener: (name: string) => listeners.delete(name),
  };
  vm.runInNewContext(script, { window, document, URLSearchParams, Date, Number, Object, JSON, TextEncoder, Uint8Array, Array });
  return { lead: window.MmdMetaLead, window, document, session, local, frames, info, location, history, listeners };
}
function destination(from: ReturnType<typeof browser>, search = "?video=1&phone=15555550100&program=PRIVATE") {
  return browser({ pathname: "/intake/thank-you/", scope: true, search, session: from.session, local: from.local });
}

describe("intake-only TY generic alias and parameter-free Meta gate", () => {
  it("hashes each validated accepted submission and emits once only after read-before-scrub", async () => {
    const b = browser();
    expect(await b.lead.armIntakeAccepted(accepted)).toBe(true);
    const receipt = JSON.parse(b.session.get(KEY)!);
    expect(receipt.intakeReceipt).toBe(createHash("sha256").update("mmd-intake-lead-v1:" + accepted.submission_id).digest("hex"));
    expect(JSON.stringify(receipt)).not.toContain(accepted.submission_id);
    expect(JSON.stringify(receipt)).not.toContain(accepted.submission_token);
    const ty = destination(b);
    expect(ty.frames).toHaveLength(0); // Boot must not race the UI parameter read.
    const params = new URLSearchParams(ty.location.search);
    expect(params.get("video")).toBe("1");
    expect(ty.lead.consume()).toBe(false);
    expect(ty.lead.consumeIntakeThankYou()).toBe(true);
    expect(ty.history.replaceState).toHaveBeenCalledWith({ unchanged: true }, "", "/confirmation");
    expect(ty.location.search).toBe("");
    expect(ty.location.hash).toBe("");
    expect(ty.session.has(KEY)).toBe(false);
    expect(ty.local.get(DONE + receipt.intakeReceipt)).toBe("1");
    expect(ty.frames[0].src).toBe("/meta-confirmation");
    expect(ty.frames[0].attrs).toEqual({ "aria-hidden": "true", sandbox: "allow-scripts", referrerpolicy: "no-referrer" });
    const frame = ty.frames[0];
    ty.listeners.get("message")!({ source: frame.contentWindow, origin: "null", data: { type: "mmd_meta_ready" } });
    expect(frame.contentWindow.postMessage).toHaveBeenCalledWith({ type: "mmd_meta_emit" }, "*");
    expect(JSON.stringify(frame.contentWindow.postMessage.mock.calls)).not.toMatch(/submission|phone|PRIVATE|receipt|capability/);
    ty.lead.consumeIntakeThankYou(); ty.lead.consume();
    expect(ty.frames).toHaveLength(1);
  });

  it("does not resend on refresh, back navigation, retry acceptance, or a cloned tab", async () => {
    const b = browser(); await b.lead.armIntakeAccepted(accepted);
    const cloned = new Map(b.session);
    const ty = destination(b); expect(ty.lead.consumeIntakeThankYou()).toBe(true);
    const refresh = browser({ pathname: "/confirmation", scope: true, session: b.session, local: b.local });
    expect(refresh.lead.consumeIntakeThankYou()).toBe(false); expect(refresh.frames).toHaveLength(0);
    const tab = browser({ pathname: "/intake/thank-you/", scope: true, session: cloned, local: b.local });
    expect(tab.lead.consumeIntakeThankYou()).toBe(false); expect(tab.frames).toHaveLength(0);
    const retry = browser({ session: b.session, local: b.local });
    expect(await retry.lead.armIntakeAccepted(accepted)).toBe(false); expect(retry.session.has(KEY)).toBe(false);
  });

  it("allows a distinct second submission while an unconsumed duplicate keeps the same receipt", async () => {
    const b = browser(); await b.lead.armIntakeAccepted(accepted); const first = b.session.get(KEY);
    await b.lead.armIntakeAccepted(accepted); expect(b.session.get(KEY)).toBe(first);
    destination(b).lead.consumeIntakeThankYou();
    const again = browser({ session: b.session, local: b.local });
    expect(await again.lead.armIntakeAccepted({ ...accepted, submission_id: "00000000-0000-4000-8000-000000000102" })).toBe(true);
    const ty = destination(again); expect(ty.lead.consumeIntakeThankYou()).toBe(true); expect(ty.frames).toHaveLength(1);
  });

  it.each(["/thank-you", "/thank-you2", "/thank-you-video-97", "/care-team-booking-confirmed", "/webinar-registration-confirmed"])("rejects accepted-result API on non-intake destination %s", redirect_url => {
    const b = browser(); return b.lead.armIntakeAccepted({ ...accepted, redirect_url }).then((ok: boolean) => {
      expect(ok).toBe(false); expect(b.session.has(KEY)).toBe(false); expect(b.frames).toHaveLength(0);
    });
  });

  it.each(["COMPLETED", "WAIVED", "PENDING", undefined])("does not arm from payment/booking-shaped status %s", async payment_status => {
    const b = browser(); expect(await b.lead.armIntakeAccepted({ ...accepted, payment_status })).toBe(false); expect(b.session.has(KEY)).toBe(false);
  });

  it.each([true, undefined, "false", null])("fails closed for non-exact-false accepted is_test=%s", async is_test => {
    const b = browser(); expect(await b.lead.armIntakeAccepted({ ...accepted, is_test })).toBe(false); expect(b.frames).toHaveLength(0);
    expect(JSON.stringify(b.info.mock.calls)).not.toContain(accepted.submission_id);
  });

  it.each(["?prefill=demo", "?test=1", "?admin=1", "?mode=demo", "?preview=1", "?test_event_code=dummy"])("keeps exclusion after scrubbing %s", async search => {
    const b = browser(); await b.lead.armIntakeAccepted(accepted);
    const ty = destination(b, search); expect(ty.lead.consumeIntakeThankYou()).toBe(false);
    expect(ty.location.pathname).toBe("/confirmation"); expect(ty.location.search).toBe(""); expect(ty.frames).toHaveLength(0);
    expect(await ty.lead.armIntakeAccepted(accepted)).toBe(false);
    expect(new Set(ty.info.mock.calls.map(args => args[0]))).toEqual(new Set(["[Confirmation measurement] suppressed."]));
  });

  it("scrubs direct visits without minting receipt and keeps alias strictly intake-only", () => {
    const ty = browser({ pathname: "/intake/thank-you/", search: "?video=1", scope: true });
    expect(ty.lead.consumeIntakeThankYou()).toBe(false); expect(ty.location.pathname).toBe("/confirmation"); expect(ty.frames).toHaveLength(0);
    const unscoped = browser({ pathname: "/confirmation" }); expect(unscoped.lead.arm("/confirmation")).toBe(false);
    expect(unscoped.lead.consumeIntakeThankYou()).toBe(false); expect(unscoped.history.replaceState).not.toHaveBeenCalled();
  });

  it.each(["/thank-you-video", "/thank-you", "/thank-you2", "/thank-you-video-97", "/care-team-booking-confirmed"])("never scrubs unrelated existing route %s", pathname => {
    const b = browser({ pathname, search: "?existing=keep" }); b.lead.consumeIntakeThankYou(); expect(b.history.replaceState).not.toHaveBeenCalled(); expect(b.location.search).toBe("?existing=keep");
  });

  it("preserves initial accepted video intake but later paid transition has no second event", async () => {
    const b = browser(); expect(await b.lead.armIntakeAccepted({ ...accepted, redirect_url: "/thank-you-video" })).toBe(true);
    const initial = browser({ pathname: "/thank-you-video", session: b.session, local: b.local }); expect(initial.frames).toHaveLength(1);
    const paid = browser({ pathname: "/thank-you-video", session: b.session, local: b.local }); expect(paid.frames).toHaveLength(0);
    expect(await paid.lead.armIntakeAccepted({ ...accepted, redirect_url: "/thank-you-video", payment_status: "COMPLETED" })).toBe(false);
  });

  it("fails closed when dedupe storage is unavailable or receipt is expired/malformed", async () => {
    const blocked = browser({ failStorage: true }); expect(await blocked.lead.armIntakeAccepted(accepted)).toBe(false); expect(blocked.frames).toHaveLength(0);
    for (const override of [{ at: Date.now() - 20 * 60 * 1000 }, { intakeReceipt: accepted.submission_id }, { token: "invalid" }]) {
      const b = browser(); await b.lead.armIntakeAccepted(accepted); b.session.set(KEY, JSON.stringify({ ...JSON.parse(b.session.get(KEY)!), ...override }));
      const ty = destination(b); expect(ty.lead.consumeIntakeThankYou()).toBe(false); expect(ty.frames).toHaveLength(0);
    }
  });

  it("executes actual acceptance-shaped mocked fetch, never payment or rejected response", async () => {
    const b = browser(); const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => accepted });
    const submit = async () => { const response = await fetch("/api/intake/submit"); if (!response.ok) return false; return b.lead.armIntakeAccepted(await response.json()); };
    expect(await submit()).toBe(true); expect(fetch).toHaveBeenCalledWith("/api/intake/submit");
    fetch.mockResolvedValueOnce({ ok: false, json: async () => accepted }); expect(await submit()).toBe(false);
    expect(b.frames).toHaveLength(0); // Accepted-result API only arms. UI/nav consumes later.
  });

  it("injects intake scope only on original TY/alias and keeps neutral child parameter-free", () => {
    const html = "<!doctype html><html><head><title>Original</title></head><body>Original</body></html>";
    for (const path of ["/confirmation", "/confirmation/?video=1", "/intake/thank-you/?video=1"]) {
      const result = injectMetaLeadGate(html, { originalUrl: path, headers: {} }, "production");
      expect(result).toContain("window.__mmdIntakeThankYou=true;"); expect(result).toContain('src="/meta-lead.js"'); expect(result).not.toContain("fbevents.js");
    }
    for (const path of ["/intake/", "/thank-you-video", "/thank-you", "/thank-you2"]) expect(injectMetaLeadGate(html, { originalUrl: path, headers: {} }, "production")).not.toContain("__mmdIntakeThankYou");
    const sdk = metaLeadFrameHtml(true); expect(sdk).toContain("fbq('set','autoConfig',false,'1651526243430714')"); expect(sdk).toContain("fbq('init','1651526243430714');"); expect(sdk).toContain("fbq('track','Lead');");
    expect(sdk).not.toMatch(/external_id|content_name|<input|<form|PageView/); expect(script).not.toContain("fbevents.js");
    expect(metaLeadFrameHtml(false)).toContain("[Confirmation measurement] suppressed.");
  });
});
