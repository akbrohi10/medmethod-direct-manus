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

describe("ThankYou2 Meta Purchase tracking", () => {
  it("initializes the supplied pixel and tracks Purchase only on the WL2 thank-you page", () => {
    expect(thankYou2Source).toContain('const WL2_META_PIXEL_ID = "1589326469554181"');
    expect(thankYou2Source).toContain('fbq?.("init", WL2_META_PIXEL_ID)');
    expect(thankYou2Source).toContain('fbq?.("track", "PageView")');
    expect(thankYou2Source).toContain('fbq?.("track", "Purchase")');
    expect(thankYou2Source).toContain("https://connect.facebook.net/en_US/fbevents.js");
    expect(thankYou2Source).toContain("https://www.facebook.com/tr?id=1589326469554181&ev=PageView&noscript=1");
    expect(thankYou2Source).toContain("purchaseTracked");
    expect(wl2Source).not.toContain("1589326469554181");
  });
});
