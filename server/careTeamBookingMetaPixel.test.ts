import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { installCareTeamBookingMetaPixel } from "../client/src/lib/careTeamBookingMetaPixel";
import { getMetaPixelEventForPath } from "../client/src/lib/metaPixelBootstrap";

const pageSource = readFileSync(resolve(process.cwd(), "client/src/pages/CareTeamBooking.tsx"), "utf8");
const source = readFileSync(resolve(process.cwd(), "client/src/lib/careTeamBookingMetaPixel.ts"), "utf8");

function mockBrowser(pathname = "/care-team-booking") {
  const scripts: Array<{ id: string; textContent: string }> = [];
  vi.stubGlobal("window", { location: { pathname } });
  vi.stubGlobal("document", {
    getElementById: (id: string) => scripts.find(script => script.id === id),
    createElement: () => ({ id: "", textContent: "" }),
    head: { appendChild: (script: { id: string; textContent: string }) => scripts.push(script) },
  });
  return scripts;
}

afterEach(() => vi.unstubAllGlobals());

describe("care-team booking page-only supplied Meta events", () => {
  it("does nothing outside a browser", () => {
    expect(installCareTeamBookingMetaPixel()).toBe(false);
  });

  it.each(["/", "/masterclass", "/care-team-booking-confirmed", "/thank-you", "/weight-loss-menopause", "/care-team-booking-other"])("does not install on %s", path => {
    const scripts = mockBrowser(path);
    expect(installCareTeamBookingMetaPixel()).toBe(false);
    expect(scripts).toHaveLength(0);
  });

  it.each(["/care-team-booking", "/care-team-booking/"])("installs only once on %s", path => {
    const scripts = mockBrowser(path);
    expect(installCareTeamBookingMetaPixel()).toBe(true);
    expect(installCareTeamBookingMetaPixel()).toBe(false);
    expect(scripts).toHaveLength(1);
    expect(scripts[0].id).toBe("care-team-booking-meta-pixel");
    expect(scripts[0].textContent).toContain("fbq('track', 'PageView');\nfbq('track', 'Lead');");
    expect(scripts[0].textContent).not.toMatch(/Schedule|Purchase|CompleteRegistration|content_name|content_category/);
  });

  it("initializes the existing pixel and fires only the supplied events without extra parameters", () => {
    const scripts = mockBrowser();
    const fbq = vi.fn();
    vi.stubGlobal("fbq", fbq);
    (window as unknown as { fbq: typeof fbq }).fbq = fbq;
    installCareTeamBookingMetaPixel();
    new Function(scripts[0].textContent)();
    expect(fbq.mock.calls).toEqual([
      ["set", "autoConfig", false, "1589326469554181"],
      ["init", "1589326469554181"],
      ["track", "PageView"],
      ["track", "Lead"],
    ]);
    expect(source).toContain("fbq.disablePushState = true;");
    expect(source).not.toContain("setTimeout");
  });

  it("reuses an already-initialized pixel when arriving from another route", () => {
    const scripts = mockBrowser();
    const fbq = Object.assign(vi.fn(), { getState: () => ({ pixels: [{ id: "1589326469554181" }] }) });
    vi.stubGlobal("fbq", fbq);
    (window as unknown as { fbq: typeof fbq }).fbq = fbq;
    installCareTeamBookingMetaPixel();
    new Function(scripts[0].textContent)();
    expect(fbq.mock.calls).toEqual([["set", "autoConfig", false, "1589326469554181"], ["track", "PageView"], ["track", "Lead"]]);
  });

  it("does not enqueue a duplicate init while a prior pixel is still loading", () => {
    const scripts = mockBrowser();
    const fbq = Object.assign(vi.fn(), { queue: [["init", "1589326469554181"]] });
    vi.stubGlobal("fbq", fbq);
    (window as unknown as { fbq: typeof fbq }).fbq = fbq;
    installCareTeamBookingMetaPixel();
    new Function(scripts[0].textContent)();
    expect(fbq.mock.calls).toEqual([["set", "autoConfig", false, "1589326469554181"], ["track", "PageView"], ["track", "Lead"]]);
  });

  it("keeps the booking calendar and redirect guards and existing confirmation mappings", () => {
    expect(pageSource).toContain("installCareTeamBookingMetaPixel();");
    expect(pageSource).toContain('src="https://link.sendmeapro.com/widget/booking/18sbmUpLKjc7pcLE8jdN"');
    expect(pageSource).toContain("event.origin !== CARE_TEAM_CALENDAR_ORIGIN");
    expect(pageSource).toContain("event.source !== calendarRef.current.contentWindow");
    expect(pageSource).toContain("window.location.assign(confirmationTarget)");
    expect(getMetaPixelEventForPath("/care-team-booking")).toBeUndefined(); // Dedicated installer, no shared-map change.
    expect(getMetaPixelEventForPath("/care-team-booking-confirmed")).toBe("Lead");
    expect(getMetaPixelEventForPath("/thank-you")).toBe("CompleteRegistration");
  });
});
