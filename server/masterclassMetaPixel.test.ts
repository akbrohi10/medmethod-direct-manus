import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { installMasterclassMetaPixel } from "../client/src/lib/masterclassMetaPixel";
import { getMetaForPath, injectRouteMetaIntoHtml, generateCrawlerHtml } from "./crawlerMiddleware";

const documentSource = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");
const pageSource = readFileSync(resolve(process.cwd(), "client/src/pages/Masterclass2.tsx"), "utf8");
const source = readFileSync(resolve(process.cwd(), "client/src/lib/masterclassMetaPixel.ts"), "utf8");

function mockBrowser(pathname = "/masterclass2", entries: Array<{ name: string }> = []) {
  const scripts: Array<{ id: string; textContent: string }> = [];
  vi.stubGlobal("window", { location: { pathname } });
  vi.stubGlobal("document", {
    getElementById: (id: string) => scripts.find(s => s.id === id),
    createElement: () => ({ id: "", textContent: "" }),
    head: { appendChild: (s: { id: string; textContent: string }) => scripts.push(s) },
  });
  vi.stubGlobal("performance", { getEntriesByType: () => entries });
  return scripts;
}

afterEach(() => vi.unstubAllGlobals());

describe("masterclass-only supplied Meta Pixel", () => {
  it("does nothing in a non-browser context", () => {
    expect(installMasterclassMetaPixel()).toBe(false);
  });

  it.each(["/", "/free-masterclass", "/care-team-booking-confirmed", "/thank-you", "/weight-loss-menopause", "/masterclass", "/masterclass-other"])("does not install on %s", path => {
    const scripts = mockBrowser(path);
    expect(installMasterclassMetaPixel()).toBe(false);
    expect(scripts).toHaveLength(0);
  });

  it.each(["/masterclass2", "/masterclass2/"])("installs once on %s despite repeated effects", path => {
    const scripts = mockBrowser(path);
    expect(installMasterclassMetaPixel()).toBe(true);
    expect(installMasterclassMetaPixel()).toBe(false);
    expect(scripts).toHaveLength(1);
    expect(scripts[0].id).toBe("masterclass-meta-pixel");
    expect(scripts[0].textContent).toContain("fbq('init', '1589326469554181');");
    expect(scripts[0].textContent).toContain("fbq('track', 'PageView');");
    expect(scripts[0].textContent).not.toMatch(/Lead|Schedule|CompleteRegistration|Purchase|content_name|content_category/);
  });

  it("executes only init and PageView when the pixel is not initialized", () => {
    const scripts = mockBrowser();
    const fbq = vi.fn();
    vi.stubGlobal("fbq", fbq);
    (window as unknown as { fbq: typeof fbq }).fbq = fbq;
    installMasterclassMetaPixel();
    new Function(scripts[0].textContent)();
    expect(fbq.mock.calls).toEqual([["set", "autoConfig", false, "1589326469554181"], ["init", "1589326469554181"], ["track", "PageView"]]);
    expect(source).toContain("fbq.disablePushState = true;");
  });

  it("reuses the same already-initialized pixel without another init", () => {
    const scripts = mockBrowser();
    const fbq = Object.assign(vi.fn(), { getState: () => ({ pixels: [{ id: "1589326469554181" }] }) });
    vi.stubGlobal("fbq", fbq);
    (window as unknown as { fbq: typeof fbq }).fbq = fbq;
    installMasterclassMetaPixel();
    new Function(scripts[0].textContent)();
    expect(fbq.mock.calls).toEqual([["set", "autoConfig", false, "1589326469554181"], ["track", "PageView"]]);
  });

  it("skips an existing matching masterclass PageView sent by another tag", () => {
    const url = "https://www.facebook.com/tr?id=1589326469554181&ev=PageView&dl=" + encodeURIComponent("https://medmethoddirect.com/masterclass2?utm_source=ad");
    const scripts = mockBrowser("/masterclass2", [{ name: url }]);
    expect(installMasterclassMetaPixel()).toBe(false);
    expect(scripts).toHaveLength(0);
  });

  it("does not mistake an unrelated route, pixel, or event for this PageView", () => {
    const scripts = mockBrowser("/masterclass2", [
      { name: "https://www.facebook.com/tr?id=1589326469554181&ev=PageView&dl=https%3A%2F%2Fmedmethoddirect.com%2F" },
      { name: "https://www.facebook.com/tr?id=other&ev=PageView&dl=https%3A%2F%2Fmedmethoddirect.com%2Fmasterclass2" },
      { name: "https://www.facebook.com/tr?id=1589326469554181&ev=Lead&dl=https%3A%2F%2Fmedmethoddirect.com%2Fmasterclass2" },
    ]);
    expect(installMasterclassMetaPixel()).toBe(true);
    expect(scripts).toHaveLength(1);
  });

  it("mounts tracking without editing the shared shell or confirmation bootstrap", () => {
    expect(pageSource).toContain("installMasterclassMetaPixel();");
    expect(documentSource).not.toContain("1589326469554181");
    expect(documentSource).not.toContain("fbevents.js");
    expect(source).not.toContain("setTimeout"); // No second PageView image fallback with JS enabled.
  });

  it("inserts the supplied real noscript exactly once only in masterclass2 HTML", () => {
    const html = injectRouteMetaIntoHtml(documentSource, getMetaForPath("/masterclass2?utm_source=ad"));
    expect(html.match(/id="masterclass-meta-pixel-noscript"/g)).toHaveLength(1);
    expect(html).toContain('src="https://www.facebook.com/tr?id=1589326469554181&amp;ev=PageView&amp;noscript=1"');
    expect(html).toContain('height="1" width="1" style="display:none"');
    expect(injectRouteMetaIntoHtml(html, getMetaForPath("/masterclass2"))).toBe(html);
    for (const route of ["/", "/masterclass", "/weight-loss-menopause", "/care-team-booking-confirmed", "/thank-you"]) {
      expect(injectRouteMetaIntoHtml(documentSource, getMetaForPath(route))).not.toContain("masterclass-meta-pixel-noscript");
    }
    expect(generateCrawlerHtml(getMetaForPath("/masterclass2"))).not.toContain("facebook.com/tr");
  });
});
