import { readFileSync } from "node:fs"; import { createHash as metaLeadScopeCreateHash } from "node:crypto"; import { gunzipSync as metaLeadScopeGunzipSync } from "node:zlib"; import { metaLeadConversionsHistoricalSource, metaLeadConversionsApprovedInventory, metaLeadConversionsNeedsInverse, META_LEAD_CONVERSIONS_SOURCE_PATHS } from "./fixtures/metaLeadConversionsScope"; const metaLeadConversionsHelperSHA = "d34479c6329419bf251177058890f3ac1bbb2d8fd943685846528c717b98afcc"; import { beforeMetaSchedule, metaScheduleApprovedInventory } from "./fixtures/metaScheduleScope"; const metaScheduleHelperSHA = "b9687e0da13457a07b541655bef530808eacdd6c465a50c5104e967625b5c613";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = metaLeadConversionsHistoricalSource("../client/intake/index.html", beforeMetaSchedule("../client/intake/index.html", readFileSync(resolve(import.meta.dirname, "../client/intake/index.html"), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));

describe("intake pay-per-visit visual contract", () => {
  it("uses the Intro 97 teal hierarchy without an obsolete decorative phone illustration", () => {
    expect(source).toContain('className:"weight-intro intake-intro97"');
    expect(source).toContain('.intake-intro97 h1{color:#113a3a');
    expect(source).toContain('.intro97-step-number{color:#fff;background:#0e7c7b');
    expect(source).toContain('.intro97-pricing{background:#fff;border:1.5px solid #0e7c7b');
    expect(source).not.toContain('className:"intro-text-phone-icon"');
    expect(source).not.toContain('className:"intro-doctor"');
  });

  it("keeps the later plan card icon and the optional boolean video-interest control", () => {
    expect(source).toContain('.intro-care-icon{display:grid;place-items:center;width:80px;height:80px;border-radius:50%;background:#eef6f3;color:#075c5c');
    expect(source).toContain('.plan-consultation-card .intro-care-icon{align-self:start}');
    expect(source.match(/className:"intro-care-icon","aria-hidden":true,children:"\+"/g)).toHaveLength(1);
    expect(source).toContain("Pay-per-visit doctor care");
    expect(source).toContain("I'd like a video visit with Dr. Al-Deek - $97");
    expect(source).toContain('checked:answers.videoVisitInterest===true');
  });
});
