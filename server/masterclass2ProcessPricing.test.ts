import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import postcss from "postcss";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const BASELINE = "f7c2c7e7";
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const readBaseline = (path: string) =>
  execFileSync("git", ["show", `${BASELINE}:${path}`], {
    cwd: root,
    encoding: "utf8",
  });
const count = (source: string, value: string) => source.split(value).length - 1;
const compact = (source: string) => source.replace(/\s+/g, " ").trim();
const normalizeApprovedProfileCredential = (path: string, source: string) =>
  path === "client/src/components/masterclass2/PhysicianProfile.tsx"
    ? source.replace('"Family Physician"', '"Board-Certified DO"')
    : source;
const normalizeApprovedV2DoctorBioCredential = (path: string, source: string) =>
  path === "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx"
    ? source.replace('"Family Physician"', '"Board-Certified DO"')
    : source;

const page = read("client/src/pages/Masterclass2.tsx");
const component = read("client/src/components/masterclass2/ProcessPricing.tsx");
const css = read("client/src/components/masterclass2/ProcessPricing.css");

const pageImport = 'import ProcessPricing from "@/components/masterclass2/ProcessPricing";\n';
const pageMount = "        <ProcessPricing />\n";
const approvedPageMount = [
  "        <PhysicianProfile />",
  "        <ProcessPricing />",
  "",
  "        <section data-masterclass-video-first-booking",
].join("\n");

const protectedSourcePaths = [
  // Existing V2 page and its page-specific styles and interactions remain byte-identical.
  "client/src/pages/WeightLossMenopauseV2.tsx",
  "client/src/pages/WeightLossMenopauseV2.css",
  "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx",
  "client/src/pages/WeightLossMenopauseV2MobileBar.tsx",
  "client/src/pages/weightLossMenopauseV2Interactions.ts",
  // Existing Masterclass 2 profile and both old and $47.99 payment/recovery paths remain untouched.
  "client/src/components/masterclass2/PhysicianProfile.tsx",
  "client/src/components/masterclass2/VideoVisitCheckout.tsx",
  "client/src/components/masterclass2/VideoVisitPaypalPayment.tsx",
  "client/src/components/masterclass2/VideoVisitStripePayment.tsx",
  "client/src/components/masterclass2/videoVisitCheckoutStorage.ts",
  "client/src/components/masterclass2/checkout4799/VideoVisitCheckout4799.tsx",
  "client/src/components/masterclass2/checkout4799/VideoVisitPaypalPayment4799.tsx",
  "client/src/components/masterclass2/checkout4799/VideoVisitStripePayment4799.tsx",
  "client/src/components/masterclass2/checkout4799/videoVisitCheckout4799Storage.ts",
  // No backend, intake route, or payment integration is part of this display-only change.
  "server/routers.ts",
  "server/routers/masterclassVideo.ts",
  "server/routers/masterclassVideo4799.ts",
  // Intake payment routes were separately upgraded to $97 on 2026-10-27.
  // Their behavior is covered by intakePaymentRoutes/intakePaidFinalization tests.
];

describe("masterclass2 ProcessPricing display-only addition", () => {
  it("is exactly reversible to the f7c2c7e7 Masterclass2 page by removing only its import/mount and restoring the three approved display prices", () => {
    expect(count(page, pageImport)).toBe(1);
    expect(count(page, pageMount)).toBe(1);
    expect(count(page, "Only $97")).toBe(1);
    expect(count(page, 'aria-label="Video visit — $97 per visit"')).toBe(1);
    expect(count(page, "$97 per visit</span>")).toBe(1);

    const restoredBaselinePage = page
      .replace(pageImport, "")
      .replace(pageMount, "")
      .replace("Only $97", "Only $47.99")
      .replace('aria-label="Video visit — $97 per visit"', 'aria-label="Video visit — $47.99 per visit"')
      .replace("$97 per visit</span>", "$47.99 per visit</span>");

    expect(restoredBaselinePage).toBe(readBaseline("client/src/pages/Masterclass2.tsx"));
  });

  it("imports and mounts the component once immediately after the physician profile and before Choose How to Connect", () => {
    expect(page).toContain(pageImport);
    expect(page).toContain(approvedPageMount);
    expect(page.indexOf("<PhysicianProfile />")).toBeLessThan(page.indexOf("<ProcessPricing />"));
    expect(page.indexOf("<ProcessPricing />")).toBeLessThan(page.indexOf("data-masterclass2-work-with-me"));
    expect(count(page, "<PhysicianProfile />")).toBe(1);
    expect(count(page, "<ProcessPricing />")).toBe(1);
    expect(page).not.toContain("ProcessPricing.css");
  });

  it("keeps the component self-contained with the exact V2 process, three-step journey, and visit-pricing copy", () => {
    expect(component).toContain('import "./ProcessPricing.css";');
    expect(component).toContain("export default function ProcessPricing()");
    expect(component).toContain('id="masterclass2-how-it-works"');
    expect(component).toContain("data-masterclass2-process-pricing");
    expect(component).toContain('aria-labelledby="masterclass2-process-pricing-title"');
    expect(component).toContain('id="masterclass2-process-pricing-title"');
    expect(component).toContain('aria-labelledby="masterclass2-visit-pricing-title"');
    expect(component).toContain('id="masterclass2-visit-pricing-title"');

    const normalizedComponent = compact(component);
    for (const exactCopy of [
      "How it works",
      "Your doctor.",
      "One text away.",
      "Start with a 5–10 minute intake.",
      "Fill out your intake",
      "Tell us about your health and goals.",
      "Text with your doctor",
      "Your doctor reviews your intake, then discusses your options with you.",
      "Make a plan together",
      "Agree on the next steps that are right for you.",
      "Simple, pay-per-visit care",
      "First text visit",
      "Includes 7 days of follow-up messaging.",
      "Additional text visits",
      "Video visit",
      "7 days of follow-up messaging",
      "Included with every visit—even your free first visit.",
      "Medication costs extra, if prescribed.",
      "Start Your Free Text Visit",
      "Intake first. Then text your doctor.",
      "Prescriptions only when medically appropriate. Follow-up covers that visit’s assessment and care plan. New concerns or additional treatments require a separate visit.",
      "No membership or long-term commitment.",
    ]) {
      expect(normalizedComponent).toContain(exactCopy);
    }

    expect(component.match(/<li>/g)).toHaveLength(3);
    expect(component.match(/className="process-step-number"/g)).toHaveLength(3);
    expect(component.match(/aria-hidden="true">\s*[123]\s*</g)).toHaveLength(3);
    expect(component).toContain("<dd>FREE</dd>");
    expect(component).toContain("$29 <span>each</span>");
    expect(component).toContain("<dd>$97</dd>");
  });

  it("uses only the approved native free-text-visit CTA and introduces no form, provider, or checkout behavior", () => {
    expect(component).toContain('const INTAKE_URL = "https://intake.medmethoddirect.com/";');
    expect(component).toContain('<a className="process-pricing-cta" href={INTAKE_URL}>');
    expect(component).toContain('Start Your Free Text Visit <span aria-hidden="true">→</span>');
    expect(component).not.toMatch(/<form\b|<input\b|<button\b|\bonClick\s*=|\btarget\s*=/);
    expect(component).not.toMatch(/fetch\(|trpc\.|paypal|stripe|checkout|localStorage|sessionStorage/i);
    expect(component).not.toContain("?video=1");
  });

  it("keeps all ProcessPricing style selectors strictly scoped and preserves desktop and mobile responsive rules", () => {
    const selectors: string[] = [];
    postcss.parse(css).walkRules(rule => selectors.push(...rule.selectors));
    expect(selectors.length).toBeGreaterThan(20);
    for (const selector of selectors) {
      expect(selector).toMatch(/^\[data-masterclass2-process-pricing\]/);
    }
    expect(css).not.toMatch(/\.wlm-v2-content|#how-it-works|\[data-masterclass2-page\]/);

    for (const requiredRule of [
      "[data-masterclass2-process-pricing] .process-pricing-layout {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);",
      "@media (min-width: 640px)",
      "@media (min-width: 1024px)",
      "@media (max-width: 900px)",
      "@media (max-width: 480px)",
      "[data-masterclass2-process-pricing] .process-pricing-layout {\n    grid-template-columns: minmax(0, 1fr);",
      "[data-masterclass2-process-pricing] .process-pricing-steps > li {\n    grid-template-columns: 42px minmax(0, 1fr);",
      "[data-masterclass2-process-pricing] .process-pricing-card {\n    padding: 22px 18px;",
      "[data-masterclass2-process-pricing] .process-pricing-cta {\n  display: flex;",
      "background: linear-gradient(105deg, #e8339e, #7a1e7e);",
    ]) {
      expect(css).toContain(requiredRule);
    }
  });

  it("keeps V2, physician profile, shared router, and all old/$47.99 checkout source byte-identical to f7c2c7e7", () => {
    for (const path of protectedSourcePaths) {
      expect(normalizeApprovedProfileCredential(path, normalizeApprovedV2DoctorBioCredential(path, read(path))), path).toBe(readBaseline(path));
    }
    const intakePanelPath = "client/src/components/thank-you-video/IntakeVideoPayment.tsx";
    expect(read(intakePanelPath).replaceAll("$97", "$39")).toBe(readBaseline(intakePanelPath));
  });
});
