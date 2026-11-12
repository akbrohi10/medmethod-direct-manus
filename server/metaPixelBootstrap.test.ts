import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  buildMetaEventFallbackUrl,
  getMetaPixelEventForPath,
  installMetaPixelForCurrentRoute,
  shouldInstallMetaPixel,
} from "../client/src/lib/metaPixelBootstrap";

const documentSource = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");
const bootstrapSource = readFileSync(resolve(process.cwd(), "client/src/lib/metaPixelBootstrap.ts"), "utf8");
afterEach(() => vi.unstubAllGlobals());

describe("retired standalone confirmation compatibility API", () => {
  it("keeps historical route metadata without enabling installation", () => {
    for (const pathname of ["/webinar-registration-confirmed", "/live-webinar3-confirmed", "/care-team-booking-confirmed", "/thank-you", "/"]) {
      expect(shouldInstallMetaPixel(pathname)).toBe(false);
    }
    expect(getMetaPixelEventForPath("/webinar-registration-confirmed")).toBe("Lead");
    expect(getMetaPixelEventForPath("/live-webinar3-confirmed")).toBe("Lead");
    expect(getMetaPixelEventForPath("/care-team-booking-confirmed")).toBe("Lead");
    expect(getMetaPixelEventForPath("/thank-you")).toBe("CompleteRegistration");
    expect(getMetaPixelEventForPath("/")).toBeUndefined();
  });

  it("keeps the shared HTML free of the retired pixel while preserving GTM", () => {
    expect(documentSource).not.toContain("1589326469554181");
    expect(documentSource).toContain("GTM-KMBG6HSR");
  });

  it("contains no legacy SDK, collection URL, or dispatch code", () => {
    expect(bootstrapSource).not.toMatch(/1589326469554181|fbq|fbevents|facebook\.(?:com|net)|createElement|setTimeout/);
  });

  it("cannot construct an event fallback URL", () => {
    for (const event of ["Lead", "Schedule", "CompleteRegistration"] as const) {
      expect(buildMetaEventFallbackUrl(event, "https://example.invalid/confirmation?synthetic=1", 123456)).toBe("");
    }
  });

  it("does nothing without a browser", () => {
    expect(installMetaPixelForCurrentRoute()).toBe(false);
  });

  it.each(["/care-team-booking-confirmed", "/webinar-registration-confirmed", "/live-webinar3-confirmed", "/thank-you"]) ("does not install, schedule, or emit on %s", pathname => {
    const createElement = vi.fn(), appendChild = vi.fn(), setTimeout = vi.fn(), fbq = vi.fn(), fetch = vi.fn();
    vi.stubGlobal("window", { location: { pathname, search: "?synthetic=1", hash: "#synthetic" }, setTimeout, fbq });
    vi.stubGlobal("document", { createElement, head: { appendChild }, body: { appendChild } });
    vi.stubGlobal("fetch", fetch);
    expect(installMetaPixelForCurrentRoute()).toBe(false);
    expect(installMetaPixelForCurrentRoute()).toBe(false);
    for (const spy of [createElement, appendChild, setTimeout, fbq, fetch]) expect(spy).not.toHaveBeenCalled();
  });
});
