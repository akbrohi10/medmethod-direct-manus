import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import vm from "node:vm";
import { PHYSICIAN_CALENDAR_ID, installPhysicianScheduleListener, isPhysicianBookingComplete } from "../client/src/lib/metaScheduleBooking";
import { metaLeadFrameHtml, metaLeadRequestExcluded } from "./metaLeadTracking";
import { beforeMetaSchedule, metaScheduleHash } from "./fixtures/metaScheduleScope";

const root = process.cwd();
const source = readFileSync(resolve(root, "client/public/meta-lead.js"), "utf8");
const ORIGIN = "https://link.sendmeapro.com";
const UUID = "00000000-0000-4000-8000-000000000001";
const ONCE = "mmd_meta_schedule_once_v1", DONE = "mmd_meta_schedule_completed_v1", LEAD = "mmd_meta_lead_once_v1";
const NOW = 1_800_000_000_000;
function bookingFrame(src = `${ORIGIN}/widget/booking/${PHYSICIAN_CALENDAR_ID}`) { return { src, contentWindow: {} } as HTMLIFrameElement; }
function complete(frame: HTMLIFrameElement, receipt: unknown = { calendarId: PHYSICIAN_CALENDAR_ID, fingerprint: "provider-private-fingerprint" }) {
  return { source: frame.contentWindow, origin: ORIGIN, data: ["msgsndr-booking-complete", receipt] } as MessageEvent;
}
function browser(options: { pathname?: string; search?: string; hash?: string; cleanupFails?: boolean; eligible?: boolean; storage?: Map<string, string>; receipt?: (s: string) => string; uuid?: string; storageFails?: boolean; cryptoMissing?: boolean; loading?: boolean } = {}) {
  const storage = options.storage ?? new Map<string, string>();
  const writes: Array<[string, string]> = [], removals: string[] = [], frames: any[] = [];
  const listeners = new Map<string, Set<Function>>();
  const add = (name: string, fn: Function) => { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name)!.add(fn); };
  const calendar = bookingFrame();
  const querySelector = vi.fn((selector: string) => selector === "iframe[data-appointment-calendar-embed]" ? calendar : null);
  const document = {
    readyState: options.loading ? "loading" : "complete", querySelector,
    getElementById: (id: string) => frames.find(f => f.id === id) ?? null,
    createElement: vi.fn(() => { const f: any = { attrs: {}, messages: [], contentWindow: { postMessage: (...args: unknown[]) => f.messages.push(args) }, setAttribute(name: string, value: string) { this.attrs[name] = value; } }; return f; }),
    body: { appendChild: (frame: unknown) => frames.push(frame) }, addEventListener: add,
  };
  const window: any = {
    __mmdMetaLeadEligible: options.eligible ?? true,
    location: { pathname: options.pathname ?? "/thank-you", search: options.search ?? "", hash: options.hash ?? "" },
    history: { state: { preserved: "synthetic-state" }, replaceState: vi.fn((state: unknown, _title: string, url: string) => { if (options.cleanupFails) throw Error("cleanup failed"); window.location.pathname = url; window.location.search = ""; window.location.hash = ""; window.history.state = state; }) },
    sessionStorage: {
      getItem: (key: string) => { if (options.storageFails) throw Error("storage denied"); const value = storage.get(key) ?? null; return key === ONCE && value !== null && options.receipt ? options.receipt(value) : value; },
      setItem: (key: string, value: string) => { if (options.storageFails) throw Error("storage denied"); writes.push([key, value]); storage.set(key, value); },
      removeItem: (key: string) => { if (options.storageFails) throw Error("storage denied"); removals.push(key); storage.delete(key); },
    },
    crypto: options.cryptoMissing ? undefined : { randomUUID: vi.fn(() => options.uuid ?? UUID) },
    addEventListener: add, removeEventListener: (name: string, fn: Function) => listeners.get(name)?.delete(fn),
  };
  vm.runInNewContext(source, { window, document, URLSearchParams, Date: { now: () => NOW }, Number, Object, JSON });
  const dispatch = (event: unknown) => { for (const fn of [...(listeners.get("message") ?? [])]) fn(event); };
  return { window, document, storage, writes, removals, frames, calendar, dispatch, listeners, lead: window.MmdMetaLead };
}
function install(b: ReturnType<typeof browser>) { vi.stubGlobal("window", b.window); vi.stubGlobal("document", b.document); return installPhysicianScheduleListener(); }
function ready(b: ReturnType<typeof browser>) { const f = b.frames[0]; b.dispatch({ source: f.contentWindow, origin: "null", data: { type: "mmd_meta_ready" } }); return f; }
function neutral(enabled = true, direct = false) {
  const listeners: Function[] = [], scripts: any[] = [], readyMessages: unknown[] = [];
  const parent: any = { postMessage: (...args: unknown[]) => readyMessages.push(args) };
  const window: any = { addEventListener: (_: string, fn: Function) => listeners.push(fn) };
  window.parent = direct ? window : parent;
  const document = { createElement: () => ({}), getElementsByTagName: () => [{ parentNode: { insertBefore: (s: unknown) => scripts.push(s) } }] };
  const context = vm.createContext({ window, document });
  Object.defineProperty(context, "fbq", { get: () => window.fbq });
  vm.runInContext(metaLeadFrameHtml(enabled).match(/<script>([\s\S]*?)<\/script>/)![1], context);
  const dispatch = (data: unknown, origin = "https://medmethoddirect.com", from = parent) => listeners.forEach(fn => fn({ source: from, origin, data }));
  const calls = () => (window.fbq?.queue ?? []).map((args: IArguments) => Array.from(args));
  return { scripts, readyMessages, dispatch, calls, parent };
}
afterEach(() => vi.unstubAllGlobals());

describe("physician Schedule booking verification", () => {
  it("accepts only the provider completion array for the exact live calendar frame", () => { const f = bookingFrame(); expect(isPhysicianBookingComplete(complete(f), f)).toBe(true); expect(PHYSICIAN_CALENDAR_ID).toBe("Ew0Y6y4FVcwaZeb9Y826"); });
  it.each(["null", "https://evil.example", "http://link.sendmeapro.com", "https://link.sendmeapro.com.evil.example", "https://medmethoddirect.com"])("rejects untrusted message origin %s", origin => { const f = bookingFrame(); expect(isPhysicianBookingComplete({ ...complete(f), origin } as MessageEvent, f)).toBe(false); });
  it("rejects missing frames, missing child windows and spoofed event source", () => { const f = bookingFrame(); expect(isPhysicianBookingComplete(complete(f), null)).toBe(false); expect(isPhysicianBookingComplete(complete(f), { ...f, contentWindow: null } as HTMLIFrameElement)).toBe(false); expect(isPhysicianBookingComplete({ ...complete(f), source: {} } as MessageEvent, f)).toBe(false); });
  it.each(["https://evil.example/widget/booking/Ew0Y6y4FVcwaZeb9Y826", `${ORIGIN}/widget/booking/other`, `${ORIGIN}/widget/booking/${PHYSICIAN_CALENDAR_ID}/`, `${ORIGIN}/other/${PHYSICIAN_CALENDAR_ID}`, "not-a-url"])("rejects nonmatching calendar iframe URL %s", src => { const f = bookingFrame(src); expect(isPhysicianBookingComplete(complete(f), f)).toBe(false); });
  it.each([null, {}, "msgsndr-booking-complete", [], ["msgsndr-booking-complete"], ["booking_complete", {}], ["msgsndr-booking-complete", {}, "extra"]])("rejects nonexact completion envelope %#", data => { const f = bookingFrame(); expect(isPhysicianBookingComplete({ ...complete(f), data } as MessageEvent, f)).toBe(false); });
  it.each([null, [], "receipt", {}, { calendarId: "other", fingerprint: "x" }, { calendarId: PHYSICIAN_CALENDAR_ID }, { calendarId: PHYSICIAN_CALENDAR_ID, fingerprint: "" }, { calendarId: PHYSICIAN_CALENDAR_ID, fingerprint: "  \n" }, { calendarId: PHYSICIAN_CALENDAR_ID, fingerprint: 123 }])("rejects wrong calendar or absent nonempty string fingerprint %#", receipt => { const f = bookingFrame(); expect(isPhysicianBookingComplete(complete(f, receipt), f)).toBe(false); });
  it("never schedules at installation, page load, payment success or unrelated messages", () => {
    const b = browser(); const cleanup = install(b);
    expect(b.frames).toHaveLength(0); expect(b.writes).toEqual([]);
    for (const data of [{ type: "payment-success" }, ["msgsndr-payment-complete", { calendarId: PHYSICIAN_CALENDAR_ID, fingerprint: "x" }], { event: "booking_complete" }, ["msgsndr-booking-complete", { calendarId: "other", fingerprint: "x" }]]) b.dispatch({ ...complete(b.calendar), data });
    expect(b.frames).toHaveLength(0); expect(b.storage.has(DONE)).toBe(false); cleanup();
  });
  it("looks up the exact calendar selector and sends Schedule only after verified booking", () => {
    const b = browser(); install(b); b.dispatch(complete(b.calendar));
    expect(b.document.querySelector).toHaveBeenCalledWith("iframe[data-appointment-calendar-embed]"); expect(b.frames).toHaveLength(1); expect(ready(b).messages).toEqual([[{ type: "mmd_meta_schedule_emit" }, "*"]]);
    expect(b.window.location.pathname).toBe("/thank-you");
  });
  it("does not consume a valid calendar message before the tracking helper becomes available", () => { const b = browser(); const tracking = b.window.MmdMetaLead; b.window.MmdMetaLead = undefined; install(b); b.dispatch(complete(b.calendar)); expect(b.frames).toHaveLength(0); b.window.MmdMetaLead = tracking; b.dispatch(complete(b.calendar)); expect(b.frames).toHaveLength(1); });
  it("handles once and removes only its own listener on cleanup", () => { const b = browser(); const spy = vi.spyOn(b.document, "querySelector"); const cleanup = install(b); b.dispatch(complete(b.calendar)); b.dispatch(complete(b.calendar)); expect(spy).toHaveBeenCalledTimes(1); cleanup(); expect(b.listeners.get("message")?.size).toBe(1); ready(b); expect(b.listeners.get("message")?.size).toBe(0); });
  it("does not resend on remount or refresh even after another valid provider receipt", () => { const b = browser(); const cleanup = install(b); b.dispatch(complete(b.calendar)); cleanup(); install(b); b.dispatch(complete(b.calendar)); expect(b.frames).toHaveLength(1); const refreshed = browser({ storage: b.storage }); install(refreshed); refreshed.dispatch(complete(refreshed.calendar)); expect(refreshed.frames).toHaveLength(0); expect(refreshed.storage.get(DONE)).toBe("1"); });
  it.each(["/", "/intake", "/thank-you2", "/thank-you-video", "/thank-you-video-4799", "/thank-you-video-97", "/care-team-booking-confirmed", "/webinar-registration-confirmed", "/live-webinar3-confirmed", "/admin"])("never installs or schedules outside physician host %s", pathname => { const b = browser({ pathname }); const existing = b.listeners.get("message")?.size ?? 0; install(b); expect(b.listeners.get("message")?.size ?? 0).toBe(existing); expect(b.lead.schedule()).toBe(false); expect(b.frames).toHaveLength(0); expect(b.storage.has(DONE)).toBe(false); });
  it.each(["/thank-you", "/thank-you/", "/THANK-YOU"])("accepts only normalized existing physician host %s", pathname => { const b = browser({ pathname }); install(b); b.dispatch(complete(b.calendar)); expect(b.frames).toHaveLength(1); });
});

describe("physician Schedule receipt privacy and Lead isolation", () => {
  it("clears search and hash only after verified booking while preserving history state", () => { const b = browser({ search: "?booking_id=private&email=private%40example.invalid", hash: "#private-receipt" }); const state = b.window.history.state; install(b); expect(b.window.history.replaceState).not.toHaveBeenCalled(); expect(b.frames).toHaveLength(0); b.dispatch(complete(b.calendar)); expect(b.window.history.replaceState).toHaveBeenCalledWith(state, "", "/thank-you"); expect(b.window.history.state).toBe(state); expect(b.window.location).toMatchObject({ pathname: "/thank-you", search: "", hash: "" }); expect(ready(b).messages).toEqual([[{ type: "mmd_meta_schedule_emit" }, "*"]]); });
  it("fails closed without dispatch if URL cleanup fails", () => { const b = browser({ search: "?booking_id=private", hash: "#private", cleanupFails: true }); install(b); b.dispatch(complete(b.calendar)); expect(b.frames).toHaveLength(0); expect(b.storage.has(DONE)).toBe(false); expect(b.window.location.search).toBe("?booking_id=private"); });
  it("checks exclusions before URL cleanup so test/admin flags cannot be erased into live eligibility", () => { for (const search of ["?test=1", "?admin=1", "?mode=test", "?demo=1", "?qa=1"]) { const b = browser({ search, hash: "#private" }); install(b); b.dispatch(complete(b.calendar)); expect(b.window.history.replaceState).not.toHaveBeenCalled(); expect(b.window.location.search).toBe(search); expect(b.window.location.hash).toBe("#private"); expect(b.frames).toHaveLength(0); expect(b.storage.has(DONE)).toBe(false); } });
  it("creates and consumes an independent UUID receipt, then stamps the completed marker", () => {
    const b = browser(); expect(b.lead.schedule()).toBe(true);
    expect(b.writes).toEqual([[ONCE, JSON.stringify({ v: 1, path: "/thank-you", at: NOW, token: UUID })], [DONE, "1"]]);
    expect(b.removals).toContain(ONCE); expect(b.storage.has(ONCE)).toBe(false); expect(b.storage.get(DONE)).toBe("1"); expect(b.lead.schedule()).toBe(false); expect(b.frames).toHaveLength(1);
  });
  it("never resumes a stale stored receipt on page load and replaces it only after fresh verified completion", () => { const storage = new Map([[ONCE, JSON.stringify({ v: 1, path: "/thank-you", at: NOW - 900001, token: UUID })]]); const b = browser({ storage }); expect(b.frames).toHaveLength(0); expect(b.storage.has(DONE)).toBe(false); install(b); b.dispatch(complete(b.calendar)); expect(b.frames).toHaveLength(1); expect(JSON.parse(b.writes[0][1]).at).toBe(NOW); });
  it.each(["version", "path", "uuid", "expired", "future", "timestamp", "null", "malformed"])("fails closed if the stamped receipt is corrupted: %s", kind => {
    const receipt = (s: string) => { const r = JSON.parse(s); if (kind === "version") r.v = 2; if (kind === "path") r.path = "/thank-you2"; if (kind === "uuid") r.token = "fingerprint"; if (kind === "expired") r.at = NOW - 900001; if (kind === "future") r.at = NOW + 1; if (kind === "timestamp") r.at = "now"; return kind === "null" ? "null" : kind === "malformed" ? "{" : JSON.stringify(r); };
    const b = browser({ receipt }); expect(b.lead.schedule()).toBe(false); expect(b.frames).toHaveLength(0); expect(b.storage.has(DONE)).toBe(false);
  });
  it.each([{ uuid: "bad" }, { cryptoMissing: true }, { storageFails: true }])("fails closed without secure receipt or available storage %#", options => { const b = browser(options); expect(b.lead.schedule()).toBe(false); expect(b.frames).toHaveLength(0); });
  it.each(["?prefill=demo", "?preview=1", "?demo=1", "?test=1", "?is_test=1", "?admin=1", "?qa=1", "?test_event_code=x", "?mode=test", "?mode=admin"])("excludes booking Schedule for %s", search => { const b = browser({ search }); install(b); b.dispatch(complete(b.calendar)); expect(b.lead.schedule()).toBe(false); expect(b.frames).toHaveLength(0); expect(b.storage.has(DONE)).toBe(false); });
  it("excludes server-ineligible and persistently excluded sessions", () => { for (const b of [browser({ eligible: false }), browser({ storage: new Map([["mmd_meta_session_excluded_v1", "1"]]) })]) { expect(b.lead.schedule()).toBe(false); expect(b.frames).toHaveLength(0); } const b = browser(); b.lead.exclude(); expect(b.lead.schedule()).toBe(false); });
  it.each(["development", "test", "production"])("requires production unauthenticated request eligibility: %s", env => { const req = { originalUrl: "/thank-you", headers: {} }; expect(metaLeadRequestExcluded(req, env)).toBe(env !== "production"); for (const cookie of ["app_session_id=x", "sa_session=x", "manus-cookie=x"]) expect(metaLeadRequestExcluded({ ...req, headers: { cookie } }, env)).toBe(true); });
  it("cannot arm or consume Lead on thank-you even with an explicit wrong destination and old valid receipts", () => {
    for (const destination of ["/thank-you", "/thank-you2", "/care-team-booking-confirmed", "/intake/thank-you", "/thank-you-video"]) {
      const storage = new Map([[LEAD, JSON.stringify({ v: 1, path: destination, at: NOW, token: UUID })]]); const b = browser({ storage }); expect(b.frames).toHaveLength(0); expect(b.lead.arm(destination)).toBe(false); expect(b.lead.consume(destination)).toBe(false); expect(b.frames).toHaveLength(0); expect(b.lead.schedule()).toBe(true); expect(ready(b).messages).toEqual([[{ type: "mmd_meta_schedule_emit" }, "*"]]);
    }
  });
  it("cannot arm or consume physician-host Lead even from another page", () => { const b = browser({ pathname: "/intake" }); expect(b.lead.arm("/thank-you")).toBe(false); expect(b.lead.consume("/thank-you")).toBe(false); expect(b.frames).toHaveLength(0); });
  it("never stores or forwards the provider fingerprint or other receipt fields", () => { const b = browser(); install(b); b.dispatch(complete(b.calendar, { calendarId: PHYSICIAN_CALENDAR_ID, fingerprint: "SECRET-PROVIDER-FINGERPRINT", email: "private@example.invalid", appointmentId: "private-appointment" })); const f = ready(b); const output = JSON.stringify({ writes: b.writes, storage: [...b.storage], messages: f.messages, src: f.src }); expect(output).not.toMatch(/SECRET-PROVIDER|private@example|private-appointment|fingerprint|calendarId|appointmentId/); expect(f.attrs).toEqual({ "aria-hidden": "true", sandbox: "allow-scripts", referrerpolicy: "no-referrer" }); expect(f.hidden).toBe(true); });
  it("grants only the exact opaque child with one static field once", () => { const b = browser(); b.lead.schedule(); const f = b.frames[0]; for (const event of [{ source: {}, origin: "null", data: { type: "mmd_meta_ready" } }, { source: f.contentWindow, origin: ORIGIN, data: { type: "mmd_meta_ready" } }, { source: f.contentWindow, origin: "null", data: { type: "mmd_meta_ready", fingerprint: "secret" } }]) b.dispatch(event); expect(f.messages).toEqual([]); ready(b); ready(b); expect(f.messages).toEqual([[{ type: "mmd_meta_schedule_emit" }, "*"]]); });
  it.each(["/intake/thank-you", "/thank-you-video", "/thank-you2", "/thank-you-video-4799", "/thank-you-video-97", "/care-team-booking-confirmed", "/webinar-registration-confirmed", "/live-webinar3-confirmed"])("preserves the original one-time parameter-free Lead scope %s", destination => { const b = browser({ pathname: "/intake" }); expect(b.lead.arm(destination)).toBe(true); expect(b.lead.consume(destination)).toBe(true); expect(b.lead.consume(destination)).toBe(false); expect(ready(b).messages).toEqual([[{ type: "mmd_meta_emit" }, "*"]]); expect(b.storage.has(DONE)).toBe(false); });
});

describe("neutral SDK Schedule dispatch and frozen source scope", () => {
  it("loads no SDK before approval, then uses autoConfig false, absent init userdata and Schedule with no parameters", () => { const n = neutral(); expect(n.scripts).toEqual([]); expect(n.calls()).toEqual([]); expect(n.readyMessages).toEqual([[{ type: "mmd_meta_ready" }, "*"]]); n.dispatch({ type: "mmd_meta_schedule_emit" }); expect(n.scripts).toHaveLength(1); expect(n.scripts[0]).toMatchObject({ src: "https://connect.facebook.net/en_US/fbevents.js", referrerPolicy: "no-referrer" }); expect(n.calls()).toEqual([["set", "autoConfig", false, "1651526243430714"], ["init", "1651526243430714"], ["track", "Schedule"]]); n.dispatch({ type: "mmd_meta_emit" }); n.dispatch({ type: "mmd_meta_schedule_emit" }); expect(n.calls()).toHaveLength(3); expect(n.calls().flat()).not.toContain("Lead"); expect(n.calls().flat()).not.toContain("PageView"); });
  it("preserves parameter-free Lead only for the original static Lead signal", () => { const n = neutral(); n.dispatch({ type: "mmd_meta_emit" }); expect(n.calls()).toEqual([["set", "autoConfig", false, "1651526243430714"], ["init", "1651526243430714"], ["track", "Lead"]]); });
  it("rejects untrusted origins, wrong parent, extra fields and unknown SDK signals", () => { const n = neutral(); n.dispatch({ type: "mmd_meta_schedule_emit" }, "null"); n.dispatch({ type: "mmd_meta_schedule_emit" }, "https://evil.example"); n.dispatch({ type: "mmd_meta_schedule_emit" }, "https://medmethoddirect.com", {}); n.dispatch({ type: "mmd_meta_schedule_emit", fingerprint: "secret" }); n.dispatch({ type: "booking_complete" }); expect(n.scripts).toHaveLength(0); expect(n.calls()).toEqual([]); n.dispatch({ type: "mmd_meta_schedule_emit" }, "https://www.medmethoddirect.com"); expect(n.calls().at(-1)).toEqual(["track", "Schedule"]); });
  it("does not initialize on a direct neutral-frame visit or an excluded server response", () => { for (const n of [neutral(true, true), neutral(false)]) { n.dispatch({ type: "mmd_meta_schedule_emit" }); expect(n.scripts).toEqual([]); expect(n.calls()).toEqual([]); expect(n.readyMessages).toEqual([]); } expect(metaLeadFrameHtml(false)).not.toContain("fbevents.js"); });
  it("binds the listener only in the existing ThankYou component effect and leaves provider calendar markup intact", () => { const page = readFileSync(resolve(root, "client/src/pages/ThankYou.tsx"), "utf8"); expect(page).toContain('import { installPhysicianScheduleListener } from "@/lib/metaScheduleBooking";'); expect(page).toContain("useEffect(() => installPhysicianScheduleListener(), []);"); expect(page).toContain("data-appointment-calendar-embed"); const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(resolve(dir, e.name)) : [resolve(dir, e.name)]); const importers = walk(resolve(root, "client/src")).filter(p => /\.[jt]sx?$/.test(p) && readFileSync(p, "utf8").includes('from "@/lib/metaScheduleBooking"')); expect(importers).toEqual([resolve(root, "client/src/pages/ThankYou.tsx")]); });
  it("pins frozen approved production sources and reconstructs all three baseline files byte-exactly", () => { const pins: Record<string, string> = { "client/public/meta-lead.js": "b5ed2ff408bdea83761f0e910e7b257e4effda8a0d968ec6a5d178e413ee5c05", "server/metaLeadTracking.ts": "1386b2a5913a7708fbdd0921b63625f3e0d9f73bb72fd3999b836e156df12639", "client/src/pages/ThankYou.tsx": "9b4fa926f27281fc86834b35c8761853b4736b86e3e0829a86d362662c9bd2c0", "client/src/lib/metaScheduleBooking.ts": "9be53b721fe3ee104dd27c03ca01f536116a257e69e017cf4b99041dc79434fc" }; for (const [p, hash] of Object.entries(pins)) { const current = readFileSync(resolve(root, p), "utf8"); expect(metaScheduleHash(current), p).toBe(hash); if (p !== "client/src/lib/metaScheduleBooking.ts") { const baseline = execFileSync("git", ["show", `4287c6d3:${p}`], { cwd: root, encoding: "utf8" }); expect(beforeMetaSchedule(p, current), p).toBe(baseline); expect(beforeMetaSchedule(p, baseline), p).toBe(baseline); } } expect(source).not.toMatch(/fbevents\.js|fbq\s*\(|[.\[]fingerprint/); });
});
