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

describe("Meta Pixel removal", () => {
  it("contains no sitewide Meta or GTM bootstrap and no thank-you-two Meta events", () => {
    expect(documentHeadSource).not.toContain("GTM-KMBG6HSR");
    expect(documentHeadSource).not.toContain("https://connect.facebook.net/en_US/fbevents.js");
    expect(documentHeadSource).not.toContain("1589326469554181");
    expect(documentHeadSource).not.toContain("facebook.com/tr");
    expect(thankYou2Source).not.toContain("fbq");
    expect(thankYou2Source).toContain('dataLayer.push({ event: "booking_complete" })');
  });
});
