import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const thankYou2Source = readFileSync(
  new URL("../client/src/pages/ThankYou2.tsx", import.meta.url),
  "utf8",
);
const wl2Source = readFileSync(
  new URL("../client/src/pages/LpWL2.tsx", import.meta.url),
  "utf8",
);
const documentHeadSource = readFileSync(
  new URL("../client/index.html", import.meta.url),
  "utf8",
);

describe("ThankYou2 Meta Purchase tracking", () => {
  it("places the supplied pixel in the static header only for the WL2 thank-you route", () => {
    expect(documentHeadSource).toContain("window.location.pathname === '/thank-you2'");
    expect(documentHeadSource).toContain("https://connect.facebook.net/en_US/fbevents.js");
    expect(documentHeadSource).toContain("fbq('init', '1589326469554181')");
    expect(documentHeadSource).toContain("fbq('track', 'PageView')");
    expect(documentHeadSource).toContain("fbq('track', 'Purchase')");
    expect(thankYou2Source).not.toContain("initializeWl2MetaPixel");
    expect(thankYou2Source).not.toContain("purchaseTracked");
    expect(wl2Source).not.toContain("1589326469554181");
  });
});
