import { readFileSync } from "node:fs"; import { createHash as metaLeadScopeCreateHash } from "node:crypto"; import { gunzipSync as metaLeadScopeGunzipSync } from "node:zlib"; import { metaLeadConversionsHistoricalSource, metaLeadConversionsApprovedInventory, metaLeadConversionsNeedsInverse, META_LEAD_CONVERSIONS_SOURCE_PATHS } from "./fixtures/metaLeadConversionsScope"; const metaLeadConversionsHelperSHA = "d34479c6329419bf251177058890f3ac1bbb2d8fd943685846528c717b98afcc"; import { beforeMetaSchedule, metaScheduleApprovedInventory } from "./fixtures/metaScheduleScope"; const metaScheduleHelperSHA = "b9687e0da13457a07b541655bef530808eacdd6c465a50c5104e967625b5c613";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const modalSource = metaLeadConversionsHistoricalSource("client/src/components/home1/LpConsultationModal2.tsx", beforeMetaSchedule("client/src/components/home1/LpConsultationModal2.tsx", readFileSync(
  resolve(process.cwd(), "client/src/components/home1/LpConsultationModal2.tsx"),
  "utf8",
)), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));

describe("homepage intake Other option", () => {
  it("keeps the five approved choices and adds one simple sixth Other choice", () => {
    const approvedLabels = [
      "Weight Loss",
      "Hormone Therapy for Women",
      "Nutrition & Vitamin Optimization",
      "Dermatology & Skin",
      "Hair Restoration",
      "Other",
    ];

    for (const label of approvedLabels) {
      expect(modalSource).toContain(`label: "${label}"`);
    }

    const serviceOptionsBlock = modalSource.match(
      /const SERVICE_OPTIONS = \[([\s\S]*?)\n\];/,
    )?.[1];
    expect(serviceOptionsBlock?.match(/label:/g)).toHaveLength(6);
    expect(serviceOptionsBlock).not.toContain("Sexual Health");
    expect(serviceOptionsBlock).not.toContain("Longevity & Aging");
    expect(serviceOptionsBlock).not.toContain("Other / Not Sure");
  });

  it("continues sending Other through the existing services_selected webhook field", () => {
    expect(modalSource).toContain(
      'services_selected: selectedServices.join(", ") || ""',
    );
    expect(modalSource).toContain("await submitLeadWebhook()");
    expect(modalSource).not.toContain("otherServiceText");
  });

  it("adds Live event or webinar between the book and podcast attribution choices", () => {
    const attributionOptionsBlock = modalSource.match(
      /const ATTRIBUTION_OPTIONS = \[([\s\S]*?)\n\];/,
    )?.[1];

    expect(attributionOptionsBlock).toContain('"Live event or webinar"');
    expect(attributionOptionsBlock).toMatch(
      /"Dr\. Al-Deek's book",\s*"Live event or webinar",\s*"Podcast"/,
    );
    expect(modalSource).toContain(
      "how_did_you_find_us: attribution && attribution !== \"Other\"",
    );
    expect(modalSource).toContain("how_did_you_find_us_other:");
  });
});
