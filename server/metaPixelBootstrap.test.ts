import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  buildMetaEventFallbackUrl,
  getMetaPixelEventForPath,
  shouldInstallMetaPixel,
} from "../client/src/lib/metaPixelBootstrap";

const documentSource = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");
const bootstrapSource = readFileSync(resolve(process.cwd(), "client/src/lib/metaPixelBootstrap.ts"), "utf8");

describe("standalone webinar confirmation Meta Pixel", () => {
  it("installs the requested event on each tracked confirmation route only", () => {
    expect(shouldInstallMetaPixel("/webinar-registration-confirmed")).toBe(true);
    expect(shouldInstallMetaPixel("/live-webinar3-confirmed")).toBe(true);
    expect(shouldInstallMetaPixel("/care-team-booking-confirmed")).toBe(true);
    expect(shouldInstallMetaPixel("/thank-you")).toBe(true);
    expect(shouldInstallMetaPixel("/")).toBe(false);
    expect(getMetaPixelEventForPath("/webinar-registration-confirmed")).toBe("Lead");
    expect(getMetaPixelEventForPath("/live-webinar3-confirmed")).toBe("Lead");
    expect(getMetaPixelEventForPath("/care-team-booking-confirmed")).toBe("Schedule");
    expect(getMetaPixelEventForPath("/thank-you")).toBe("CompleteRegistration");
  });

  it("keeps Pixel code out of the shared HTML shell", () => {
    expect(documentSource).not.toContain("1589326469554181");
    expect(documentSource).not.toContain("fbevents.js");
    expect(documentSource).not.toContain("fbq");
    expect(documentSource).not.toContain("facebook.com/tr");
    expect(documentSource).not.toContain("GTM-KMBG6HSR");
  });

  it("contains one supplied init and PageView plus explicit Lead, Schedule, and CompleteRegistration calls", () => {
    expect(bootstrapSource.match(/fbq\('init', '1589326469554181'\)/g)).toHaveLength(1);
    expect(bootstrapSource.match(/fbq\('track', 'PageView'\)/g)).toHaveLength(1);
    expect(bootstrapSource.match(/fbq\('track', 'Lead'\)/g)).toHaveLength(1);
    expect(bootstrapSource.match(/fbq\('track', 'Schedule'\)/g)).toHaveLength(1);
    expect(bootstrapSource.match(/fbq\('track', 'CompleteRegistration'\)/g)).toHaveLength(1);
    expect(bootstrapSource).toContain("https://connect.facebook.net/en_US/fbevents.js");
    expect(bootstrapSource).not.toContain("Purchase");
  });

  it("builds direct event fallback URLs for cases where the Meta library never sends the queue", () => {
    const fallbackUrl = new URL(buildMetaEventFallbackUrl("Schedule", "https://medmethoddirect.com/care-team-booking-confirmed", 123456));
    expect(fallbackUrl.origin + fallbackUrl.pathname).toBe("https://www.facebook.com/tr");
    expect(fallbackUrl.searchParams.get("id")).toBe("1589326469554181");
    expect(fallbackUrl.searchParams.get("ev")).toBe("Schedule");
    expect(fallbackUrl.searchParams.get("noscript")).toBe("1");
    expect(fallbackUrl.searchParams.get("dl")).toBe("https://medmethoddirect.com/care-team-booking-confirmed");
    expect(fallbackUrl.searchParams.get("ts")).toBe("123456");
  });

  it("guards each fallback with an outbound event request check and one event-specific DOM marker", () => {
    expect(bootstrapSource).toContain('url.searchParams.get("ev") === eventName');
    expect(bootstrapSource).toContain("hasCollectionRequest(eventName)");
    expect(bootstrapSource).toContain("confirmation-${eventName.toLowerCase()}-fallback");
    expect(bootstrapSource).toContain("scheduleConversionDeliveryFallback(eventName)");
  });
});
