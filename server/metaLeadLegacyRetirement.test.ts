import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import { CONFIRMATION_PIXEL_EVENTS, buildMetaEventFallbackUrl, getMetaPixelEventForPath, installMetaPixelForCurrentRoute, shouldInstallMetaPixel } from "../client/src/lib/metaPixelBootstrap";
import { installMasterclassMetaPixel } from "../client/src/lib/masterclassMetaPixel";
import { installCareTeamBookingMetaPixel } from "../client/src/lib/careTeamBookingMetaPixel";
import { CARE_TEAM_CONFIRMATION_PIXEL_CODE } from "../client/src/lib/careTeamConfirmationPixel";
import { CARE_TEAM_CONFIRMATION_LEAD_CODE } from "../client/src/lib/careTeamConfirmationLead";

const root = process.cwd();
const helperNames = ["metaPixelBootstrap", "masterclassMetaPixel", "careTeamBookingMetaPixel", "careTeamConfirmationPixel", "careTeamConfirmationLead"];
const paths = ["/", "/masterclass2", "/masterclass2/", "/care-team-booking", "/care-team-booking/", "/care-team-booking-confirmed", "/webinar-registration-confirmed", "/live-webinar3-confirmed", "/thank-you"];
afterEach(() => vi.unstubAllGlobals());

function filesUnder(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  });
}

describe("legacy client tracking retirement", () => {
  it.each(helperNames)("removes all legacy ID, SDK, collector, and dispatch code from %s", name => {
    const source = readFileSync(resolve(root, "client/src/lib", name + ".ts"), "utf8");
    expect(source).not.toMatch(/1589326469554181|fbq|fbevents|facebook\.(?:com|net)|createElement|setTimeout|sendBeacon|fetch\s*\(/);
    expect(source).not.toMatch(/\b\d{16}\b/);
  });

  it("leaves no retired pixel ID anywhere in production client library sources", () => {
    for (const file of filesUnder(resolve(root, "client/src/lib"))) {
      expect(readFileSync(file, "utf8"), file).not.toContain("1589326469554181");
    }
  });

  it("keeps the retired modules disconnected from all other client entrypoint sources", () => {
    const legacyPaths = helperNames.map(name => resolve(root, "client/src/lib", name + ".ts"));
    for (const file of filesUnder(resolve(root, "client/src"))) {
      if (legacyPaths.includes(file) || !/\.[cm]?[jt]sx?$/.test(file)) continue;
      expect(readFileSync(file, "utf8"), file).not.toMatch(/(?:from\s*|import\s*\(\s*|require\s*\(\s*)["'][^"']*(?:metaPixelBootstrap|masterclassMetaPixel|careTeamBookingMetaPixel|careTeamConfirmationPixel|careTeamConfirmationLead)["']/);
    }
  });

  it("retains all exported API shapes without enabling historical routes", () => {
    expect(CONFIRMATION_PIXEL_EVENTS).toBeInstanceOf(Map);
    expect(getMetaPixelEventForPath("/care-team-booking-confirmed")).toBe("Lead");
    expect(getMetaPixelEventForPath("/thank-you")).toBe("CompleteRegistration");
    for (const pathname of paths) expect(shouldInstallMetaPixel(pathname)).toBe(false);
    for (const event of ["Lead", "Schedule", "CompleteRegistration"] as const) {
      expect(buildMetaEventFallbackUrl(event, "https://example.invalid/confirmation?synthetic=1#synthetic", 123)).toBe("");
    }
    expect(CARE_TEAM_CONFIRMATION_PIXEL_CODE).toBe("");
    expect(CARE_TEAM_CONFIRMATION_LEAD_CODE).toBe("");
  });

  it("all installers remain inert in a non-browser context", () => {
    expect(installMetaPixelForCurrentRoute()).toBe(false);
    expect(installMasterclassMetaPixel()).toBe(false);
    expect(installCareTeamBookingMetaPixel()).toBe(false);
    expect(() => new Function(CARE_TEAM_CONFIRMATION_PIXEL_CODE)()).not.toThrow();
    expect(() => new Function(CARE_TEAM_CONFIRMATION_LEAD_CODE)()).not.toThrow();
  });

  it.each(paths)("cannot touch browser, network, timer, or storage APIs on %s", pathname => {
    const forbidden = new Proxy({}, { get(_target, property) { throw new Error("Unexpected browser access: " + String(property)); } });
    const fbq = vi.fn(), fetch = vi.fn(), setTimeout = vi.fn(), Image = vi.fn();
    vi.stubGlobal("window", { location: { pathname, search: "?synthetic=1", hash: "#synthetic" }, document: forbidden, sessionStorage: forbidden, localStorage: forbidden, fbq });
    vi.stubGlobal("document", forbidden);
    vi.stubGlobal("performance", forbidden);
    vi.stubGlobal("navigator", forbidden);
    vi.stubGlobal("fetch", fetch);
    vi.stubGlobal("setTimeout", setTimeout);
    vi.stubGlobal("Image", Image);
    vi.stubGlobal("fbq", fbq);
    for (let repeat = 0; repeat < 2; repeat++) {
      expect(installMetaPixelForCurrentRoute()).toBe(false);
      expect(installMasterclassMetaPixel()).toBe(false);
      expect(installCareTeamBookingMetaPixel()).toBe(false);
      new Function(CARE_TEAM_CONFIRMATION_PIXEL_CODE)();
      new Function(CARE_TEAM_CONFIRMATION_LEAD_CODE)();
    }
    for (const spy of [fbq, fetch, setTimeout, Image]) expect(spy).not.toHaveBeenCalled();
  });

  it("does not rewrite the frozen historical removal fixture", () => {
    const fixture = readFileSync(resolve(root, "server/fixtures/oldMetaPixelRemovalScope.ts"));
    expect(createHash("sha256").update(fixture).digest("hex")).toBe("844f119278b6da6e807529d1446163610a3585dee5065cfad49f7bac01be4c2f");
  });
});
