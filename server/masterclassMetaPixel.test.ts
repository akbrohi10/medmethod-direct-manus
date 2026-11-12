import { afterEach, describe, expect, it, vi } from "vitest"; import { createHash as oldRemovalCreateHash } from "node:crypto"; import { oldMetaPixelRemovalHistoricalSource, oldMetaPixelRemovalApprovedInventory, oldMetaPixelRemovalNeedsInverse, OLD_REMOVAL_SOURCE_PATHS } from "./fixtures/oldMetaPixelRemovalScope"; const oldRemovalHelperSHA = "844f119278b6da6e807529d1446163610a3585dee5065cfad49f7bac01be4c2f";
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

  it.each(["/masterclass2", "/masterclass2/"]) ("retired installer remains inactive on %s despite repeated effects", path => {
    const scripts = mockBrowser(path);
    expect(installMasterclassMetaPixel()).toBe(false);
    expect(installMasterclassMetaPixel()).toBe(false);
    expect(scripts).toHaveLength(0);
  });

  it("does not dispatch or inspect a previously initialized SDK", () => {
    const scripts = mockBrowser();
    const fbq = Object.assign(vi.fn(), { getState: vi.fn(() => ({ pixels: [{ id: "synthetic-retired-id" }] })) });
    vi.stubGlobal("fbq", fbq);
    (window as unknown as { fbq: typeof fbq }).fbq = fbq;
    expect(installMasterclassMetaPixel()).toBe(false);
    expect(fbq).not.toHaveBeenCalled();
    expect(fbq.getState).not.toHaveBeenCalled();
    expect(scripts).toHaveLength(0);
  });

  it("does not scan resource entries or load a replacement script", () => {
    const scripts = mockBrowser("/masterclass2", [{ name: "https://example.invalid/synthetic-resource" }]);
    const getEntriesByType = vi.fn();
    vi.stubGlobal("performance", { getEntriesByType });
    expect(installMasterclassMetaPixel()).toBe(false);
    expect(getEntriesByType).not.toHaveBeenCalled();
    expect(scripts).toHaveLength(0);
  });

  it("contains no retired SDK, collection URL, ID, or event dispatch", () => {
    expect(source).not.toMatch(/1589326469554181|fbq|fbevents|facebook\.(?:com|net)|createElement|setTimeout/);
  });

  it("intentional removal replacement: leaves tracking unmounted without restoring the retired installer", () => {
    expect(pageSource).not.toContain("installMasterclassMetaPixel();");
    expect(documentSource).not.toContain("1589326469554181");
    expect(documentSource).not.toContain("fbevents.js");
    expect(source).not.toContain("setTimeout"); // No second PageView image fallback with JS enabled.
  });

  it("intentional removal replacement: omits the old real noscript from masterclass2 HTML", () => {
    const html = injectRouteMetaIntoHtml(documentSource, getMetaForPath("/masterclass2?utm_source=ad"));
    expect(html.match(/id="masterclass-meta-pixel-noscript"/g)).toBeNull();
    expect(html).not.toContain('src="https://www.facebook.com/tr?id=1589326469554181&amp;ev=PageView&amp;noscript=1"');
    expect(html).not.toContain('height="1" width="1" style="display:none"');
    expect(injectRouteMetaIntoHtml(html, getMetaForPath("/masterclass2"))).toBe(html);
    for (const route of ["/", "/masterclass", "/weight-loss-menopause", "/care-team-booking-confirmed", "/thank-you"]) {
      expect(injectRouteMetaIntoHtml(documentSource, getMetaForPath(route))).not.toContain("masterclass-meta-pixel-noscript");
    }
    expect(generateCrawlerHtml(getMetaForPath("/masterclass2"))).not.toContain("facebook.com/tr");
  });
});
