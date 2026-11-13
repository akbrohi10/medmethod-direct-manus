import { readFileSync } from "node:fs"; import { createHash as metaLeadScopeCreateHash } from "node:crypto"; import { gunzipSync as metaLeadScopeGunzipSync } from "node:zlib"; import { metaLeadConversionsHistoricalSource, metaLeadConversionsApprovedInventory, metaLeadConversionsNeedsInverse, META_LEAD_CONVERSIONS_SOURCE_PATHS } from "./fixtures/metaLeadConversionsScope"; const metaLeadConversionsHelperSHA = "d34479c6329419bf251177058890f3ac1bbb2d8fd943685846528c717b98afcc"; import { beforeMetaSchedule, metaScheduleApprovedInventory } from "./fixtures/metaScheduleScope"; const metaScheduleHelperSHA = "b9687e0da13457a07b541655bef530808eacdd6c465a50c5104e967625b5c613";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = metaLeadConversionsHistoricalSource("client/src/pages/ThankYou.tsx", beforeMetaSchedule("client/src/pages/ThankYou.tsx", readFileSync(resolve(process.cwd(), "client/src/pages/ThankYou.tsx"), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));
const documentHeadSource = metaLeadConversionsHistoricalSource("client/index.html", beforeMetaSchedule("client/index.html", readFileSync(resolve(process.cwd(), "client/index.html"), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));
const bootstrapSource = metaLeadConversionsHistoricalSource("client/src/lib/metaPixelBootstrap.ts", beforeMetaSchedule("client/src/lib/metaPixelBootstrap.ts", readFileSync(resolve(process.cwd(), "client/src/lib/metaPixelBootstrap.ts"), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));

describe("appointment thank-you tracking", () => {
  it("uses the route-aware Pixel with one CompleteRegistration event", () => {
    expect(documentHeadSource).toContain("GTM-KMBG6HSR");
    expect(documentHeadSource).not.toContain("https://connect.facebook.net/en_US/fbevents.js");
    expect(documentHeadSource).not.toContain("1589326469554181");
    expect(bootstrapSource).toContain('"/webinar-registration-confirmed"');
    expect(bootstrapSource).toContain('"/live-webinar3-confirmed"');
    expect(bootstrapSource).toContain('["/thank-you", "CompleteRegistration"]');
    expect(bootstrapSource).toContain('"fbq(\'track\', \'CompleteRegistration\');"');
  });

  it("retains only the guarded non-Facebook booking completion signal", () => {
    expect(pageSource).toContain('const THANK_YOU_CONVERSION_STORAGE_KEY = "medmethod:appointment-deposit-conversion-fired"');
    expect(pageSource).toContain("window.sessionStorage.getItem(THANK_YOU_CONVERSION_STORAGE_KEY)");
    expect(pageSource).toContain('window.sessionStorage.setItem(THANK_YOU_CONVERSION_STORAGE_KEY, "1")');
    expect(pageSource).toContain('w.dataLayer?.push({ event: "booking_complete" })');
    expect(pageSource).not.toContain("fbq");
  });
});
