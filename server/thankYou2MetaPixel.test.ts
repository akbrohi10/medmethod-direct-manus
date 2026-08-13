import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const documentHeadSource = readFileSync(
  new URL("../client/index.html", import.meta.url),
  "utf8",
);

describe("Meta Pixel installation", () => {
  it("loads pixel 1589326469554181 sitewide with PageView + Purchase on /thank-you2", () => {
    // Pixel library loads on all pages
    expect(documentHeadSource).toContain("https://connect.facebook.net/en_US/fbevents.js");
    expect(documentHeadSource).toContain("fbq('init', '1589326469554181')");
    expect(documentHeadSource).toContain("fbq('track', 'PageView')");
    // Purchase event gated to /thank-you2 only
    expect(documentHeadSource).toContain("window.location.pathname === '/thank-you2'");
    expect(documentHeadSource).toContain("fbq('track', 'Purchase')");
    // Noscript fallback present
    expect(documentHeadSource).toContain("facebook.com/tr?id=1589326469554181&ev=PageView&noscript=1");
  });
});
