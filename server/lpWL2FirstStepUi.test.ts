import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const componentSource = readFileSync(
  new URL("../client/src/pages/LpWL2.tsx", import.meta.url),
  "utf8",
);

describe("LpWL2 first-step UI", () => {
  it("uses a visual-only scroll affordance instead of written scroll instructions", () => {
    expect(componentSource).toContain("aria-label={WL2_SCROLL_AFFORDANCE_LABEL}");
    expect(componentSource).toContain("<ChevronDown size={22}");
    expect(componentSource).not.toContain("Scroll down to complete all required questions");
    expect(componentSource).not.toContain("More required questions below");
  });

  it("binds the rendered Next button to the completed intake state and a familiar Date of Birth field", () => {
    expect(componentSource).toContain('if (step === "intake") handleIntakeNext();');
    expect(componentSource).toContain('disabled={step === "lead" && !leadValid}');
    expect(componentSource).toContain('placeholder="MM/DD/YYYY"');
    expect(componentSource).toContain("formatWl2DateOfBirthInput(e.target.value)");
  });

  it("guides an incomplete submission to the first missing field with a visible alert", () => {
    expect(componentSource).toContain("const handleIntakeNext = () => {");
    expect(componentSource).toContain("document.getElementById(WL2_FIELD_ANCHORS[missing])?.scrollIntoView");
    expect(componentSource).toContain('role="alert"');
    expect(componentSource).toContain("Please complete {WL2_FIELD_LABELS[missingField]} to continue.");
    expect(componentSource).toContain('id="wl2-field-medications"');
  });
});
