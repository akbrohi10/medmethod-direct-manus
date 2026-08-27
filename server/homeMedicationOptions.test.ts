import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const homepageSource = readFileSync(
  resolve(process.cwd(), "client/src/pages/HomeHrt3.tsx"),
  "utf8",
);

const exactCompoundedDisclosure =
  "Compounded medications are not FDA-approved. They are prepared by licensed compounding pharmacies for an individual patient based on a prescription. FDA-approved alternatives are available and will be discussed with you by your physician. Results vary. Treatment requires ongoing medical monitoring.";

describe("homepage medication options", () => {
  it("keeps the simplified treatment choices and exact required disclosure", () => {
    expect(homepageSource).toContain("Medication Options");
    expect(homepageSource).toContain("Weight-Loss Medication");
    expect(homepageSource).toContain("Hormone Therapy");
    expect(homepageSource).toContain(exactCompoundedDisclosure);
    expect(homepageSource).toContain("FDA-approved alternatives");
  });

  it("removes the previous dense pricing, shipping, and protocol copy", () => {
    const removedCopy = [
      "Your Prescription Options",
      "~$30–$100",
      "~$150–$250",
      "Most patients (2–3 hormones)",
      "Preferred pricing may be available through partner pharmacies.",
      "Shipped directly to your door",
      "Estrogen · progesterone · testosterone · DHEA · vaginal estrogen",
      "Estimates only. Actual medication costs vary",
    ];

    for (const phrase of removedCopy) {
      expect(homepageSource).not.toContain(phrase);
    }
  });

  it("does not introduce prohibited brand-comparison terminology", () => {
    expect(homepageSource).not.toMatch(/brand[- ]name/i);
    expect(homepageSource).not.toContain("FDA-approved brand");
    expect(homepageSource).not.toContain("generic version");
    expect(homepageSource).not.toContain("same active ingredient");
  });
});
