import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildMetaLeadFallbackUrl, shouldInstallMetaPixel } from "../client/src/lib/metaPixelBootstrap";

const documentSource = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");
const bootstrapSource = readFileSync(resolve(process.cwd(), "client/src/lib/metaPixelBootstrap.ts"), "utf8");

describe("standalone webinar confirmation Meta Pixel", () => {
  it("installs only on the two requested confirmation routes", () => {
    expect(shouldInstallMetaPixel("/webinar-registration-confirmed")).toBe(true);
    expect(shouldInstallMetaPixel("/live-webinar3-confirmed")).toBe(true);
    expect(shouldInstallMetaPixel("/")).toBe(false);
    expect(shouldInstallMetaPixel("/thank-you")).toBe(false);
  });

  it("keeps Pixel code out of the shared HTML shell", () => {
    expect(documentSource).not.toContain("1589326469554181");
    expect(documentSource).not.toContain("fbevents.js");
    expect(documentSource).not.toContain("fbq");
    expect(documentSource).not.toContain("facebook.com/tr");
    expect(documentSource).not.toContain("GTM-KMBG6HSR");
  });

  it("contains exactly one supplied init, PageView, and Lead sequence", () => {
    expect(bootstrapSource.match(/fbq\('init', '1589326469554181'\)/g)).toHaveLength(1);
    expect(bootstrapSource.match(/fbq\('track', 'PageView'\)/g)).toHaveLength(1);
    expect(bootstrapSource.match(/fbq\('track', 'Lead'\)/g)).toHaveLength(1);
    expect(bootstrapSource).toContain("https://connect.facebook.net/en_US/fbevents.js");
    expect(bootstrapSource).not.toContain("CompleteRegistration");
    expect(bootstrapSource).not.toContain("Schedule");
    expect(bootstrapSource).not.toContain("Purchase");
  });

  it("builds a direct Lead fallback URL for cases where the Meta library never sends the queued event", () => {
    const fallbackUrl = new URL(buildMetaLeadFallbackUrl("https://medmethoddirect.com/webinar-registration-confirmed", 123456));
    expect(fallbackUrl.origin + fallbackUrl.pathname).toBe("https://www.facebook.com/tr");
    expect(fallbackUrl.searchParams.get("id")).toBe("1589326469554181");
    expect(fallbackUrl.searchParams.get("ev")).toBe("Lead");
    expect(fallbackUrl.searchParams.get("noscript")).toBe("1");
    expect(fallbackUrl.searchParams.get("dl")).toBe("https://medmethoddirect.com/webinar-registration-confirmed");
    expect(fallbackUrl.searchParams.get("ts")).toBe("123456");
  });

  it("guards the fallback with an outbound Lead request check and one DOM marker", () => {
    expect(bootstrapSource).toContain('url.searchParams.get("ev") === "Lead"');
    expect(bootstrapSource).toContain("hasLeadCollectionRequest()");
    expect(bootstrapSource).toContain("WEBINAR_LEAD_FALLBACK_ID");
    expect(bootstrapSource).toContain("scheduleLeadDeliveryFallback()");
  });
});
