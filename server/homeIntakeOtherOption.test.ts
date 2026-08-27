import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const modalSource = readFileSync(
  resolve(process.cwd(), "client/src/components/home1/LpConsultationModal2.tsx"),
  "utf8",
);

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
});
