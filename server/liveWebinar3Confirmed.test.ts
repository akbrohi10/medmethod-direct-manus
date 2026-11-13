import { readFileSync } from "node:fs"; import { createHash as metaLeadScopeCreateHash } from "node:crypto"; import { gunzipSync as metaLeadScopeGunzipSync } from "node:zlib"; import { metaLeadConversionsHistoricalSource, metaLeadConversionsApprovedInventory, metaLeadConversionsNeedsInverse, META_LEAD_CONVERSIONS_SOURCE_PATHS } from "./fixtures/metaLeadConversionsScope"; const metaLeadConversionsHelperSHA = "d34479c6329419bf251177058890f3ac1bbb2d8fd943685846528c717b98afcc"; import { beforeMetaSchedule, metaScheduleApprovedInventory } from "./fixtures/metaScheduleScope"; const metaScheduleHelperSHA = "b9687e0da13457a07b541655bef530808eacdd6c465a50c5104e967625b5c613";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = metaLeadConversionsHistoricalSource("client/src/pages/LiveWebinar3Confirmed.tsx", beforeMetaSchedule("client/src/pages/LiveWebinar3Confirmed.tsx", readFileSync(
  resolve(process.cwd(), "client/src/pages/LiveWebinar3Confirmed.tsx"),
  "utf8",
)), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));
const appSource = metaLeadConversionsHistoricalSource("client/src/App.tsx", beforeMetaSchedule("client/src/App.tsx", readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));
const documentHeadSource = metaLeadConversionsHistoricalSource("client/index.html", beforeMetaSchedule("client/index.html", readFileSync(resolve(process.cwd(), "client/index.html"), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));
const bootstrapSource = metaLeadConversionsHistoricalSource("client/src/lib/metaPixelBootstrap.ts", beforeMetaSchedule("client/src/lib/metaPixelBootstrap.ts", readFileSync(resolve(process.cwd(), "client/src/lib/metaPixelBootstrap.ts"), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));

describe("live webinar 3 companion confirmation", () => {
  it("registers an isolated confirmation route that preserves the original webinar confirmation page", () => {
    expect(appSource).toContain('const LiveWebinar3Confirmed = lazy(() => import("@/pages/LiveWebinar3Confirmed"));');
    expect(appSource).toContain('<Route path="/live-webinar3-confirmed" component={LiveWebinar3Confirmed} />');
    expect(pageSource).toContain('data-live-webinar3-confirmation');
    expect(pageSource).toContain('href="/"');
    expect(pageSource).not.toContain('href="/live-webinar3"');
    expect(pageSource).toContain('content="noindex, nofollow"');
    expect(pageSource).toContain("Registration Received");
    expect(pageSource).toContain("You’re almost in.");
    expect(pageSource).toContain("Wednesday, September 23");
    expect(pageSource).toContain("7:30 PM EST");
    expect(pageSource).toContain("data-live-webinar3-reply-yes-panel");
    expect(pageSource).toContain("Check your email or texts and reply");
    expect(pageSource).toContain("YES");
    expect(pageSource).toContain("unconfirmed spots will be released to the waitlist");
    expect(pageSource).toContain("Confirm now so you don’t lose your seat.");
    expect(pageSource).not.toContain("You’re all set.");
    expect(pageSource).not.toContain("Free Live Zoom Webinar Confirmed");
  });

  it("restores the fuller educational context after confirmation without a second registration CTA", () => {
    expect(pageSource).toContain('data-live-webinar3-confirmed-learning');
    expect(pageSource).toContain('data-live-webinar3-confirmed-doctor');
    expect(pageSource).toContain("Because You Deserve to Know.");
    expect(pageSource).toContain("Why You Can’t Lose Weight Like You Used To");
    expect(pageSource).toContain("Live Q&A with Dr. Jumana Al-Deek");
    expect(pageSource).toContain("Dr. Jumana Al-Deek");
    expect(pageSource).not.toContain("Reserve My Free Spot");
  });

  it("uses the standalone webinar Pixel with one PageView and Lead sequence", () => {
    expect(pageSource).toContain('const LIVE_WEBINAR3_CONVERSION_STORAGE_KEY = "medmethod:live-webinar3-registration-conversion-fired"');
    expect(pageSource).toContain('import { buildNeutralWebinarRegistrationPayload } from "@/lib/neutralTrackingPayloads";');
    expect(pageSource).toContain('buildNeutralWebinarRegistrationPayload("live_webinar3_registration_complete")');
    expect(pageSource).toContain('window.sessionStorage.removeItem(LIVE_WEBINAR3_HANDOFF_STORAGE_KEY)');
    expect(pageSource).not.toContain("fbq");
    expect(pageSource).not.toContain("CompleteRegistration");
    expect(pageSource).not.toContain("Schedule");
    expect(documentHeadSource).toContain("GTM-KMBG6HSR");
    expect(documentHeadSource).not.toContain("1589326469554181");
    expect(bootstrapSource).toContain('"/live-webinar3-confirmed"');
    expect(bootstrapSource.match(/fbq\('track', 'PageView'\)/g)).toHaveLength(1);
    expect(bootstrapSource.match(/fbq\('track', 'Lead'\)/g)).toHaveLength(1);
  });
});
