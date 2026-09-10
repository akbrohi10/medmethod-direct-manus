import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const documentHeadSource = readFileSync(
  new URL("../client/index.html", import.meta.url),
  "utf8",
);

describe("Meta Pixel installation", () => {
  it("uses the existing Google Tag Manager container as the sole sitewide Meta Pixel bootstrap", () => {
    expect(documentHeadSource).toContain("GTM-KMBG6HSR");
    expect(documentHeadSource).not.toContain("https://connect.facebook.net/en_US/fbevents.js");
    expect(documentHeadSource).not.toContain("fbq('init', '1589326469554181')");
    expect(documentHeadSource).not.toContain("fbq('track', 'PageView')");
    expect(documentHeadSource).not.toContain("CompleteRegistration");
    expect(documentHeadSource).not.toContain("Purchase");
  });
});
