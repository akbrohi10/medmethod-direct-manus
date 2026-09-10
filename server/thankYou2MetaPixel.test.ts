import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const documentHeadSource = readFileSync(
  new URL("../client/index.html", import.meta.url),
  "utf8",
);

describe("Meta Pixel installation", () => {
  it("loads pixel 1589326469554181 sitewide with init + PageView only in header", () => {
    // Pixel library loads on all pages
    expect(documentHeadSource).toContain("https://connect.facebook.net/en_US/fbevents.js");
    expect(documentHeadSource).toContain("fbq('init', '1589326469554181')");
    expect(documentHeadSource).toContain("fbq('track', 'PageView')");
    // No duplicate events in header — thank-you page events fire from React components only
    expect(documentHeadSource).not.toContain("CompleteRegistration");
    expect(documentHeadSource).not.toContain("Purchase");
    // Noscript fallback present
    expect(documentHeadSource).toContain("facebook.com/tr?id=1589326469554181&ev=PageView&noscript=1");
  });
});
