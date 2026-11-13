import { describe, expect, it } from "vitest"; import { createHash as metaLeadScopeCreateHash } from "node:crypto"; import { gunzipSync as metaLeadScopeGunzipSync } from "node:zlib"; import { metaLeadConversionsHistoricalSource, metaLeadConversionsApprovedInventory, metaLeadConversionsNeedsInverse, META_LEAD_CONVERSIONS_SOURCE_PATHS } from "./fixtures/metaLeadConversionsScope"; const metaLeadConversionsHelperSHA = "d34479c6329419bf251177058890f3ac1bbb2d8fd943685846528c717b98afcc"; import { beforeMetaSchedule, metaScheduleApprovedInventory } from "./fixtures/metaScheduleScope"; const metaScheduleHelperSHA = "b9687e0da13457a07b541655bef530808eacdd6c465a50c5104e967625b5c613";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildNeutralWebinarRegistrationPayload } from "../client/src/lib/neutralTrackingPayloads";

const projectRoot = process.cwd();
const webinarConfirmationSource = metaLeadConversionsHistoricalSource("client/src/pages/WebinarRegistrationConfirmed.tsx", beforeMetaSchedule("client/src/pages/WebinarRegistrationConfirmed.tsx", readFileSync(
  resolve(projectRoot, "client/src/pages/WebinarRegistrationConfirmed.tsx"),
  "utf8",
)), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));
const companionConfirmationSource = metaLeadConversionsHistoricalSource("client/src/pages/LiveWebinar3Confirmed.tsx", beforeMetaSchedule("client/src/pages/LiveWebinar3Confirmed.tsx", readFileSync(
  resolve(projectRoot, "client/src/pages/LiveWebinar3Confirmed.tsx"),
  "utf8",
)), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));
const pixelBootstrapSource = metaLeadConversionsHistoricalSource("client/src/lib/metaPixelBootstrap.ts", beforeMetaSchedule("client/src/lib/metaPixelBootstrap.ts", readFileSync(
  resolve(projectRoot, "client/src/lib/metaPixelBootstrap.ts"),
  "utf8",
)), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));

describe("neutral webinar tracking payloads", () => {
  it("uses generic metadata for both webinar lead events", () => {
    expect(buildNeutralWebinarRegistrationPayload("webinar_registration_complete")).toEqual({
      event: "webinar_registration_complete",
      content_name: "Webinar Registration",
      content_category: "Lead",
    });
    expect(buildNeutralWebinarRegistrationPayload("live_webinar3_registration_complete")).toEqual({
      event: "live_webinar3_registration_complete",
      content_name: "Webinar Registration",
      content_category: "Lead",
    });
  });

  it("uses the neutral payload for every webinar confirmation dataLayer event", () => {
    expect(webinarConfirmationSource).toContain(
      'buildNeutralWebinarRegistrationPayload("webinar_registration_complete")',
    );
    expect(companionConfirmationSource).toContain(
      'buildNeutralWebinarRegistrationPayload("live_webinar3_registration_complete")',
    );
  });

  it("keeps direct Meta confirmation events free of condition-specific metadata", () => {
    expect(pixelBootstrapSource).toContain("fbq('track', 'Lead');");
    expect(pixelBootstrapSource).not.toContain("content_name");
    expect(pixelBootstrapSource).not.toContain("content_category");
    expect(pixelBootstrapSource).not.toContain("Hormone Therapy Lead");
    expect(pixelBootstrapSource).not.toContain("Weight Loss Webinar");
  });
});
