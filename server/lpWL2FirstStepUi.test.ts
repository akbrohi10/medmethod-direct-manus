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
    expect(componentSource).toContain('disabled={step === "intake" ? intakeNextButton.disabled : !leadValid}');
    expect(componentSource).toContain('placeholder="MM/DD/YYYY"');
    expect(componentSource).toContain("formatWl2DateOfBirthInput(e.target.value)");
  });
});
