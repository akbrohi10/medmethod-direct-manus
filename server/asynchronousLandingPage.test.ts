import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = process.cwd();
const pageSource = readFileSync(resolve(projectRoot, "client/src/pages/Asynchronous.tsx"), "utf8");
const pageStyles = readFileSync(resolve(projectRoot, "client/src/pages/Asynchronous.css"), "utf8");
const appSource = readFileSync(resolve(projectRoot, "client/src/App.tsx"), "utf8");

describe("/asynchronous landing page", () => {
  it("registers an isolated lazy-loaded public route", () => {
    expect(appSource).toContain('const Asynchronous = lazy(() => import("@/pages/Asynchronous"))');
    expect(appSource).toContain('<Route path="/asynchronous" component={Asynchronous} />');
    expect(appSource).toContain('location === "/asynchronous"');
  });

  it("uses the supplied physician-led asynchronous landing-page hierarchy", () => {
    expect(pageSource).toContain("Lose weight with a plan that accounts for your hormones.");
    expect(pageSource).toContain("One front door.");
    expect(pageSource).toContain("Clear care pricing.");
    expect(pageSource).toContain("Care that comes to you.");
    expect(pageSource).toContain("See what happens after you pay.");
    expect(pageSource).toContain("Start with your story.");
    expect(pageSource).toContain("/manus-storage/embedded-4_715d8d54.png");
    expect(pageSource).not.toContain("data:image/");
    expect(pageSource).not.toMatch(/myalloy/i);
  });

  it("aligns the weight-led headline with the first care path and first assessment choice", () => {
    const weightCardIndex = pageSource.indexOf('className="async-path-card weight"');
    const hormoneCardIndex = pageSource.indexOf('className="async-path-card">');
    const weightChoiceIndex = pageSource.indexOf('icon="⌁" label="Medical weight care"');
    const hormoneChoiceIndex = pageSource.indexOf('icon="◯" label="Hormone care"');

    expect(weightCardIndex).toBeGreaterThan(-1);
    expect(weightCardIndex).toBeLessThan(hormoneCardIndex);
    expect(weightChoiceIndex).toBeGreaterThan(-1);
    expect(weightChoiceIndex).toBeLessThan(hormoneChoiceIndex);
  });

  it("keeps the supplied assessment as a non-submitting eleven-screen prototype", () => {
    expect(pageSource.match(/data-asynchronous-step=/g)).toHaveLength(11);
    expect(pageSource).toContain("Interactive prototype · no data or payment is submitted");
    expect(pageSource).toContain("Nothing entered here is sent or saved.");
    expect(pageSource).not.toMatch(/\bfetch\s*\(/);
    expect(pageSource).not.toContain("trpc.");
    expect(pageSource).not.toMatch(/<form\b/);
  });

  it("keeps medical pricing framed as placeholder information with required disclosures", () => {
    expect(pageSource).toContain("PLACEHOLDER PRICES");
    expect(pageSource).toContain("Medication interest is not a prescription or guarantee.");
    expect(pageSource).toContain("<ComplianceDisclosures compact compounded />");
    expect(pageSource).toContain("Compounded medications are not FDA-approved.");
    expect(pageSource).not.toMatch(/\b(?:Wegovy|Zepbound|Ozempic|Mounjaro)\b/i);
  });

  it("uses one unambiguous payment moment and compares member visit pricing directly", () => {
    expect(pageSource).toContain("In the live flow, this is the single payment step.");
    expect(pageSource).toContain("Continue to clinical intake");
    expect(pageSource).toContain("Finish assessment");
    expect(pageSource).not.toContain("Preview post-payment intake");
    expect(pageSource).not.toContain("Doctor review — $49");
    expect(pageSource).toContain("Members: <b>$50 per visit</b>");
    expect(pageSource).toContain("Without membership: <b>$150 per visit</b>");
  });

  it("adds verified trust signals and accessible modal focus management", () => {
    expect(pageSource).toContain("Board-Certified DO");
    expect(pageSource).toContain("Licensed in 12 states");
    expect(pageSource).toContain("LegitScript Certified");
    expect(pageSource).toContain("assessmentCloseRef");
    expect(pageSource).toContain("restoreFocusRef");
    expect(pageSource).toContain('event.key !== "Tab"');
    expect(pageSource).toContain("closeAssessment");
    expect(pageSource).toContain("closeChat");
  });

  it("uses a tube illustration for the vaginal cream option", () => {
    expect(pageSource).toMatch(/id: "estradiol-cream",[\s\S]*?visual: "tube"/);
    expect(pageStyles).toContain(".async-drug-visual.tube::before");
  });

  it("preserves desktop and mobile responsive layouts", () => {
    expect(pageStyles).toContain(".async-hero");
    expect(pageStyles).toContain("grid-template-columns: 1.06fr 0.94fr");
    expect(pageStyles).toContain("@media (max-width: 900px)");
    expect(pageStyles).toContain("@media (max-width: 640px)");
    expect(pageStyles).toContain(".async-flow-panel");
  });
});
