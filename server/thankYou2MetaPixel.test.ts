import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const documentHeadSource = readFileSync(
  new URL("../client/index.html", import.meta.url),
  "utf8",
);
const thankYou2Source = readFileSync(
  new URL("../client/src/pages/ThankYou2.tsx", import.meta.url),
  "utf8",
);

describe("Meta Pixel installation", () => {
  it("contains the supplied sitewide base code without GTM or thank-you-two page events", () => {
    expect(documentHeadSource).not.toContain("GTM-KMBG6HSR");
    expect(documentHeadSource).toContain("https://connect.facebook.net/en_US/fbevents.js");
    expect(documentHeadSource.match(/fbq\('init', '1589326469554181'\)/g)).toHaveLength(1);
    expect(documentHeadSource.match(/fbq\('track', 'PageView'\)/g)).toHaveLength(1);
    expect(documentHeadSource).toContain("https://www.facebook.com/tr?id=1589326469554181&ev=PageView&noscript=1");
    expect(thankYou2Source).not.toContain("fbq");
    expect(thankYou2Source).toContain('dataLayer.push({ event: "booking_complete" })');
  });
});
