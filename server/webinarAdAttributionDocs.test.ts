import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const guideSource = fs.readFileSync(
  path.join(root, "docs/webinar-ad-attribution.md"),
  "utf8",
);

describe("webinar ad attribution operating guide", () => {
  it("documents the exact HighLevel-compatible Meta tracking template and source-field requirement", () => {
    expect(guideSource).toContain("utm_source=fb_ad&utm_medium={{adset.name}}&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&campaign_id={{campaign.id}}");
    expect(guideSource).toContain("form ID `A3e1g5dCf1hc3tY3xpHi`");
    expect(guideSource).toContain("built-in **Source** field");
    expect(guideSource).toContain("webinar_live-webinar2");
    expect(guideSource).toContain("webinar_live-webinar3");
  });

  it("documents a controlled test for both webinar landing pages", () => {
    expect(guideSource).toContain("https://medmethoddirect.com/live-webinar2?utm_source=fb_ad");
    expect(guideSource).toContain("https://medmethoddirect.com/live-webinar3?utm_source=fb_ad");
    expect(guideSource).toContain("Paid Social");
  });
});
