import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const thankYou2Source = readFileSync(
  new URL("../client/src/pages/ThankYou2.tsx", import.meta.url),
  "utf8",
);
const documentHeadSource = readFileSync(
  new URL("../client/index.html", import.meta.url),
  "utf8",
);

describe("Meta Pixel removal verification", () => {
  it("Meta Pixel 1589326469554181 is completely removed from the site", () => {
    // No pixel in static header
    expect(documentHeadSource).not.toContain("fbevents.js");
    expect(documentHeadSource).not.toContain("1589326469554181");
    // No pixel in ThankYou2 component
    expect(thankYou2Source).not.toContain("1589326469554181");
    expect(thankYou2Source).not.toContain("fbevents");
    // GTM dataLayer event is preserved
    expect(thankYou2Source).toContain("booking_complete_wl2");
  });
});
