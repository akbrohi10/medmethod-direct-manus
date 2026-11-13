import { readFileSync } from "node:fs"; import { createHash as metaLeadScopeCreateHash } from "node:crypto"; import { gunzipSync as metaLeadScopeGunzipSync } from "node:zlib"; import { metaLeadConversionsHistoricalSource, metaLeadConversionsApprovedInventory, metaLeadConversionsNeedsInverse, META_LEAD_CONVERSIONS_SOURCE_PATHS } from "./fixtures/metaLeadConversionsScope"; const metaLeadConversionsHelperSHA = "d34479c6329419bf251177058890f3ac1bbb2d8fd943685846528c717b98afcc"; import { beforeMetaSchedule, metaScheduleApprovedInventory } from "./fixtures/metaScheduleScope"; const metaScheduleHelperSHA = "b9687e0da13457a07b541655bef530808eacdd6c465a50c5104e967625b5c613";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const modalSource = metaLeadConversionsHistoricalSource("client/src/components/home1/LpConsultationModal2.tsx", beforeMetaSchedule("client/src/components/home1/LpConsultationModal2.tsx", readFileSync(
  resolve(process.cwd(), "client/src/components/home1/LpConsultationModal2.tsx"),
  "utf8",
)), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));
const notificationSource = metaLeadConversionsHistoricalSource("client/src/components/SocialProofNotificationsLP.tsx", beforeMetaSchedule("client/src/components/SocialProofNotificationsLP.tsx", readFileSync(
  resolve(process.cwd(), "client/src/components/SocialProofNotificationsLP.tsx"),
  "utf8",
)), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));
const styleSource = metaLeadConversionsHistoricalSource("client/src/index.css", beforeMetaSchedule("client/src/index.css", readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));

describe("homepage mobile intake usability", () => {
  it("uses an upper-centered, safe-area-aware modal with a protected action footer", () => {
    expect(modalSource).toContain("items-center justify-center");
    expect(modalSource).toContain("-translate-y-[2svh]");
    expect(modalSource).toContain('maxHeight: "min(86dvh, 720px)"');
    expect(modalSource).toContain("calc(env(safe-area-inset-bottom) + 0.75rem)");
  });

  it("suppresses mobile social-proof overlays while the homepage intake modal is active", () => {
    expect(modalSource).toContain('document.body.dataset.mmIntakeModalOpen = "true"');
    expect(notificationSource).toContain("data-social-proof-notification");
    expect(styleSource).toContain('body[data-mm-intake-modal-open="true"] [data-social-proof-notification]');
  });

  it("keeps a visible notification dismissal control as a secondary fallback", () => {
    expect(notificationSource).toContain("handleDismiss");
    expect(notificationSource).toContain('aria-label="Dismiss notification"');
    expect(notificationSource).toContain("CONFIG.dismissCooldown");
  });
});
