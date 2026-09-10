import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { shouldInstallMetaPixel } from "../client/src/lib/metaPixelBootstrap";

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
});
