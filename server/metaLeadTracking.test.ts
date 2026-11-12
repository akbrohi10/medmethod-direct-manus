import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { injectMetaLeadGate, metaLeadFrameHtml, metaLeadRequestExcluded } from "./metaLeadTracking";

const source = readFileSync(new URL("../client/public/meta-lead.js", import.meta.url), "utf8");
function browser(options: { eligible?: boolean; search?: string; pathname?: string; storage?: Map<string, string> } = {}) {
  const storage = options.storage ?? new Map<string, string>();
  const listeners: Record<string, Function> = {};
  const frames: any[] = [];
  const document = {
    readyState: "complete",
    getElementById: (id: string) => frames.find(f => f.id === id) ?? null,
    createElement: () => ({ attrs: {} as Record<string, string>, contentWindow: { postMessage: (...args: unknown[]) => frames[0]?.messages.push(args) }, messages: [] as unknown[], setAttribute(name: string, value: string) { this.attrs[name] = value; } }),
    body: { appendChild: (frame: unknown) => frames.push(frame) },
    addEventListener: (name: string, fn: Function) => { listeners[name] = fn; },
  };
  const window: any = {
    __mmdMetaLeadEligible: options.eligible ?? true,
    location: { pathname: options.pathname ?? "/intake", search: options.search ?? "" },
    sessionStorage: { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value), removeItem: (key: string) => storage.delete(key) },
    crypto: { randomUUID: () => "00000000-0000-4000-8000-000000000001" },
    addEventListener: (name: string, fn: Function) => { listeners[name] = fn; },
    removeEventListener: (name: string) => { delete listeners[name]; },
  };
  vm.runInNewContext(source, { window, document, URLSearchParams, Date, Number, Object, JSON });
  return { window, document, storage, frames, listeners, lead: window.MmdMetaLead };
}

describe("Meta Lead privacy and one-time gates", () => {
  it("does not arm or load anything on direct confirmation visits", () => {
    const b = browser({ pathname: "/intake/thank-you/" });
    expect(b.frames).toHaveLength(0);
    expect(b.lead.consume()).toBe(false);
  });
  it("consumes a fresh accepted-intake flag once before dispatch", () => {
    const b = browser();
    expect(b.lead.arm("/intake/thank-you/", { excluded: false })).toBe(true);
    expect(b.lead.consume("/intake/thank-you/")).toBe(true);
    expect(b.storage.has("mmd_meta_lead_once_v1")).toBe(false);
    expect(b.lead.consume("/intake/thank-you/")).toBe(false);
    expect(b.frames).toHaveLength(1);
    expect(b.frames[0].attrs).toMatchObject({ sandbox: "allow-scripts", referrerpolicy: "no-referrer" });
    expect(b.frames[0].src).toBe("/meta-confirmation");
  });
  it("does not resend after refresh", () => {
    const b = browser();b.lead.arm("/intake/thank-you/");b.lead.consume("/intake/thank-you/");
    const refreshed = browser({ pathname: "/intake/thank-you/", storage: b.storage });
    expect(refreshed.frames).toHaveLength(0);
  });
  it("does not arm a second standalone-payment Lead after intake", () => {
    const b = browser();b.lead.arm("/thank-you-video");b.lead.consume("/thank-you-video");
    for (const target of ["/thank-you", "/thank-you2", "/thank-you-video-4799", "/thank-you-video-97"]) expect(b.lead.arm(target)).toBe(false);
  });
  it("preserves a legitimate second intake submission as a separate eligible success", () => {
    const b = browser();b.lead.arm("/intake/thank-you/");b.lead.consume("/intake/thank-you/");
    expect(browser({ storage: b.storage }).lead.arm("/intake/thank-you/")).toBe(true);
  });
  it.each(["?prefill=demo", "?preview=results", "?is_test=true", "?demo=1", "?test=1", "?admin=1", "?qa=1", "?mode=test"])("excludes %s before arming", search => {
    const b = browser({ search });expect(b.lead.arm("/intake/thank-you/")).toBe(false);expect(b.frames).toHaveLength(0);
  });
  it("fails closed for preview/admin eligibility and explicit non-live success", () => {
    expect(browser({ eligible: false }).lead.arm("/thank-you")).toBe(false);
    const b = browser();expect(b.lead.arm("/thank-you", { excluded: true })).toBe(false);expect(b.lead.arm("/thank-you")).toBe(false);
  });
  it("rejects wrong destinations, expired and malformed flags", () => {
    const b = browser();expect(b.lead.arm("/thank-you?email=secret")).toBe(false);
    const c = browser();c.lead.arm("/thank-you");expect(c.lead.consume("/thank-you2")).toBe(false);
    const item = JSON.parse(c.storage.get("mmd_meta_lead_once_v1")!);item.at = Date.now() - 20 * 60 * 1000;c.storage.set("mmd_meta_lead_once_v1", JSON.stringify(item));expect(c.lead.consume("/thank-you")).toBe(false);
  });
  it("grants only its exact opaque child once and transmits no identifiers", () => {
    const b = browser();b.lead.arm("/thank-you");b.lead.consume("/thank-you");const f = b.frames[0];
    b.listeners.message({ source: {}, origin: "null", data: { type: "mmd_meta_ready" } });expect(f.messages).toEqual([]);
    b.listeners.message({ source: f.contentWindow, origin: "https://evil.example", data: { type: "mmd_meta_ready" } });expect(f.messages).toEqual([]);
    b.listeners.message({ source: f.contentWindow, origin: "null", data: { type: "mmd_meta_ready", email: "secret" } });expect(f.messages).toEqual([]);
    b.listeners.message({ source: f.contentWindow, origin: "null", data: { type: "mmd_meta_ready" } });expect(f.messages).toEqual([[{ type: "mmd_meta_emit" }, "*"]]);
  });
  it("keeps the SDK out of all parent pages and has a parameter-free Lead in the neutral child only", () => {
    const html = metaLeadFrameHtml(true);
    expect(html).toContain("fbq('set','autoConfig',false,'1651526243430714')");
    expect(html).toContain("fbq('init','1651526243430714')");
    expect(html).toContain("fbq('track','Lead');");
    expect(html).not.toContain("fbq('track','PageView')");
    expect(html).not.toMatch(/<input|<form|<noscript|external_id|content_name|balance_index/);
    expect(source).not.toContain("fbevents.js");
    expect(metaLeadFrameHtml(false)).not.toContain("fbevents.js");
  });
  it("initializes no SDK on direct neutral-frame visits or before an approved parent signal", () => {
    expect(metaLeadFrameHtml(true)).toContain("if (window.parent === window) return;");
    expect(metaLeadFrameHtml(true)).toContain("event.source !== window.parent");
    expect(metaLeadFrameHtml(true)).toContain("Object.keys(event.data).length !== 1");
  });
  it("excludes development, test queries and authenticated cookies server-side", () => {
    const req = { originalUrl: "/thank-you", headers: {} };
    expect(metaLeadRequestExcluded(req, "production")).toBe(false);
    for (const env of ["development", "test", undefined]) expect(metaLeadRequestExcluded(req, env)).toBe(true);
    expect(metaLeadRequestExcluded({ originalUrl: "/thank-you?prefill=demo", headers: {} }, "production")).toBe(true);
    for (const cookie of ["app_session_id=private", "sa_session=private"]) expect(metaLeadRequestExcluded({ ...req, headers: { cookie } }, "production")).toBe(true);
  });
  it("injects only first-party bookkeeping at approved sources/confirmations and preserves question/upgrade content", () => {
    const html = "<html><head><title>Original</title></head><body>Original</body></html>";
    for (const path of ["/", "/index.html", "/virginia/mclean", "/intake/", "/lp/wl", "/lp/wl2", "/thanks-payment", "/thanks-payment-wl2", "/care-team-booking", "/intake/thank-you/", "/thank-you-video"]) {
      const result = injectMetaLeadGate(html, { originalUrl: path, headers: {} }, "production");
      expect(result).toContain('src="/meta-lead.js"');expect(result).not.toContain("fbevents.js");expect(result).toContain("<body>Original</body>");
    }
    expect(injectMetaLeadGate(html, { originalUrl: "/hormone-symptom-quiz", headers: {} }, "production")).toBe(html);
    expect(injectMetaLeadGate(html, { originalUrl: "/admin/settings", headers: {} }, "production")).toBe(html);
  });
});
