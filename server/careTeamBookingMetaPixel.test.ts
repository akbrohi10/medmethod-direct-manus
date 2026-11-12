import { afterEach, describe, expect, it, vi } from "vitest"; import { createHash as oldRemovalCreateHash } from "node:crypto"; import { oldMetaPixelRemovalHistoricalSource, oldMetaPixelRemovalApprovedInventory, oldMetaPixelRemovalNeedsInverse, OLD_REMOVAL_SOURCE_PATHS } from "./fixtures/oldMetaPixelRemovalScope"; const oldRemovalHelperSHA = "844f119278b6da6e807529d1446163610a3585dee5065cfad49f7bac01be4c2f";
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

  it.each(["/care-team-booking", "/care-team-booking/"]) ("retired installer remains inactive on %s despite repeated effects", path => {
    const scripts = mockBrowser(path);
    expect(installCareTeamBookingMetaPixel()).toBe(false);
    expect(installCareTeamBookingMetaPixel()).toBe(false);
    expect(scripts).toHaveLength(0);
  });

  it("does not dispatch or change an existing SDK, including queued initialization", () => {
    const scripts = mockBrowser();
    const queue = [["init", "synthetic-retired-id"]];
    const fbq = Object.assign(vi.fn(), { queue, getState: vi.fn(() => ({ pixels: [{ id: "synthetic-retired-id" }] })) });
    vi.stubGlobal("fbq", fbq);
    (window as unknown as { fbq: typeof fbq }).fbq = fbq;
    expect(installCareTeamBookingMetaPixel()).toBe(false);
    expect(fbq).not.toHaveBeenCalled();
    expect(fbq.getState).not.toHaveBeenCalled();
    expect(queue).toEqual([["init", "synthetic-retired-id"]]);
    expect(scripts).toHaveLength(0);
  });

  it("contains no retired SDK, collection URL, ID, or event dispatch", () => {
    expect(source).not.toMatch(/1589326469554181|fbq|fbevents|facebook\.(?:com|net)|createElement|setTimeout/);
  });

  it("keeps the booking calendar and redirect guards and existing confirmation mappings", () => {
    expect(pageSource).not.toContain("installCareTeamBookingMetaPixel();");
    expect(pageSource).toContain('src="https://link.sendmeapro.com/widget/booking/18sbmUpLKjc7pcLE8jdN?redirect=false"');
    expect(pageSource).toContain("event.origin !== CARE_TEAM_CALENDAR_ORIGIN");
    expect(pageSource).toContain("event.source !== calendarRef.current.contentWindow");
    expect(pageSource).toContain("window.location.assign(confirmationTarget)");
    expect(getMetaPixelEventForPath("/care-team-booking")).toBeUndefined(); // Dedicated installer, no shared-map change.
    expect(getMetaPixelEventForPath("/care-team-booking-confirmed")).toBe("Lead");
    expect(getMetaPixelEventForPath("/thank-you")).toBe("CompleteRegistration");
  });
});
