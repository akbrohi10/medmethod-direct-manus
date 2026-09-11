import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const modalSource = readFileSync(
  resolve(process.cwd(), "client/src/components/home1/LpConsultationModal2.tsx"),
  "utf8",
);

describe("paid-booking exit engagement fallback", () => {
  it("preserves the existing continue and exit choices", () => {
    expect(modalSource).toContain("Continue Where I Left Off");
    expect(modalSource).toContain("onClick={() => setShowExitConfirm(false)}");
    expect(modalSource).toContain("Not Today");
    expect(modalSource).toContain("onClick={handleClose}");
  });

  it("offers a compact free care-team booking path with the required disclaimer", () => {
    expect(modalSource).toContain('landingPage === "/"');
    expect(modalSource).toContain("data-exit-care-team-fallback");
    expect(modalSource).toContain("Need More Info?");
    expect(modalSource).toContain("Book a Free 15-Minute Call");
    expect(modalSource).toContain("with our Care Team");
    expect(modalSource).toContain('href="/care-team-booking"');
    expect(modalSource).toContain("General information only—not medical advice.");
  });

  it("adds one understated call-now link rather than a second large button", () => {
    expect(modalSource).toContain("data-exit-call-now");
    expect(modalSource).toContain('href="tel:+18883627011"');
    expect(modalSource).toContain("Prefer to talk now? Call (888) 362-7011");
  });
});
