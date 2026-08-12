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
  it("loads the pixel library sitewide via static header and fires Purchase on /thank-you2", () => {
    // Static header: library loads on every page
    expect(documentHeadSource).toContain("https://connect.facebook.net/en_US/fbevents.js");
    expect(documentHeadSource).toContain("fbq('init', '1589326469554181')");
    expect(documentHeadSource).toContain("fbq('track', 'PageView')");
    // Static header: Purchase gated to /thank-you2
    expect(documentHeadSource).toContain("window.location.pathname === '/thank-you2'");
    expect(documentHeadSource).toContain("fbq('track', 'Purchase')");
    // Component-level backup: ThankYou2 also fires the pixel in useEffect
    expect(thankYou2Source).toContain("1589326469554181");
    expect(thankYou2Source).toContain("Purchase");
    expect(thankYou2Source).toContain("connect.facebook.net/en_US/fbevents.js");
    // Pixel must NOT be on the WL2 landing page itself
    expect(wl2Source).not.toContain("1589326469554181");
  });
});
