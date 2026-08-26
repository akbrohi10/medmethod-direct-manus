import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const componentSource = readFileSync(
  new URL("../client/src/pages/LpWL2.tsx", import.meta.url),
  "utf8",
);

describe("LpWL2 conversion-focused section order", () => {
  it("shows medication-cost guidance before How It Works and removes ongoing-care membership copy", () => {
    const medicationIndex = componentSource.indexOf("/* ── Medication Costs ── */");
    const howItWorksIndex = componentSource.indexOf("/* ── How It Works ── */");

    expect(medicationIndex).toBeGreaterThan(-1);
    expect(howItWorksIndex).toBeGreaterThan(-1);
    expect(medicationIndex).toBeLessThan(howItWorksIndex);
    expect(componentSource).not.toContain("Your Customized Treatment Plan");
    expect(componentSource).not.toContain("Ongoing Physician Support");
    expect(componentSource).not.toContain("$49/month");
  });
});
