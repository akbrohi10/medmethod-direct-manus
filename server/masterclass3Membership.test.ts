import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { transformSync } from "esbuild";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeMasterclass3Membership, MEMBERSHIP_ADDITION } from "./masterclass3MembershipBaseline";

const root = new URL("../", import.meta.url);
const read = (p: string) => readFileSync(new URL(p, root), "utf8");
const old = (p: string) => execFileSync("git", ["show", `4c09752b:${p}`], { cwd: root, encoding: "utf8" });
const path = "client/src/pages/Masterclass3.tsx";
const page = read(path);
const helperImport = 'import { beforeMasterclass3Membership } from "./masterclass3MembershipBaseline";\n';
function renderPricing() {
  const functionSource = page.slice(page.indexOf("function PricingDetails()"), page.indexOf("export default function Masterclass3()"));
  const compiled = transformSync(functionSource + "\nmodule.exports = PricingDetails;", { loader: "tsx", format: "cjs", jsx: "automatic" }).code;
  const module: { exports: any } = { exports: {} };
  const wrapper = ({ children, ...props }: any) => React.createElement("div", props, children);
  new Function("require", "module", "Accordion", "AccordionItem", "AccordionTrigger", "AccordionContent", "Video", compiled)(createRequire(import.meta.url), module, wrapper, wrapper, wrapper, wrapper, () => null);
  return renderToStaticMarkup(React.createElement(module.exports));
}

describe("V3 membership benefits — three paragraphs inside the existing pricing card only", () => {
  it("reconstructs the entire saved page by removing exactly the approved insertion", () => {
    expect(page.split(MEMBERSHIP_ADDITION)).toHaveLength(2);
    expect(beforeMasterclass3Membership(path, page)).toBe(old(path));
    expect(page.match(/data-masterclass3-membership-/g)).toHaveLength(3);
    expect(page).toContain("Follow-up visits: $150 pay as you go, or ongoing care at $50/month.</p>\n" + MEMBERSHIP_ADDITION + "              </section>");
  });
  it("renders the exact benefits and separate member video charge before medication options", () => {
    const markup = renderPricing();
    expect(markup).toContain("Membership includes:</strong> Direct secure messaging with Dr. Al-Deek, medication and dosing management, prescription refills, and lab review.");
    expect(markup).toContain("Additional video visits for members: $50 each</strong>, charged separately.");
    expect(markup).toContain("Cancel anytime with 30 days’ notice.");
    expect(markup.indexOf("Membership includes:")).toBeGreaterThan(markup.indexOf("ongoing care at $50/month"));
    expect(markup.indexOf("Cancel anytime")).toBeLessThan(markup.indexOf("Medication Options"));
    expect(markup).toContain("First visit: $199 — $50 deposit, remaining $149 due day of visit.");
    expect(markup).toContain("Medication is billed separately and is not included in visit fees.");
  });
  it("inherits the existing card and accordion without adding links, controls, promises or actions", () => {
    expect(MEMBERSHIP_ADDITION).not.toMatch(/<a\b|<button\b|onClick|href|unlimited|included video|free video/i);
    expect(page).toContain('<Accordion type="single" collapsible className="mx-auto w-full max-w-3xl"');
    expect(page.match(/See Full Pricing Details/g)).toHaveLength(1);
    expect(page.match(/data-masterclass3-primary-cta/g)).toHaveLength(1);
    expect(page.match(/data-masterclass3-secondary-cta/g)).toHaveLength(1);
    expect(page).toContain('<Masterclass3FullBio onBookVisit={() => setConsultationOpen(true)} />');
  });
  it("leaves originals, full story, homepage, routing, pricing provenance and integrations byte-identical", () => {
    for (const p of ["client/src/pages/Masterclass2.tsx", "client/src/pages/MasterclassVideoFirst.tsx", "client/src/pages/HomeHrt3.tsx", "client/src/components/masterclass3/Masterclass3FullBio.tsx", "client/src/components/masterclass2/PhysicianProfile.tsx", "client/src/App.tsx", "client/src/index.css", "client/src/lib/masterclass3VideoTracking.ts", "client/src/components/home1/LpConsultationModal2.tsx", "server/fixtures/masterclass3CopyEdits.json", "server/masterclass3Page.test.ts", "server/masterclass3SingleBooking.test.ts", "server/masterclass3BookingActions.test.ts", "server/masterclass3LearningLabel.test.ts"]) expect(read(p)).toBe(old(p));
  });
  it("preserves every historical assertion via only reversible read-boundary changes", () => {
    const baseline = read("server/masterclass3FullBioBaseline.ts");
    expect(baseline.replace(helperImport, "").replace("  source = beforeMasterclass3Membership(path, source);\n", "")).toBe(old("server/masterclass3FullBioBaseline.ts"));
    const oldRead = 'const read = (p: string) => readFileSync(new URL(p, root), "utf8");';
    const newRead = 'const read = (p: string) => beforeMasterclass3Membership(p, readFileSync(new URL(p, root), "utf8"));';
    expect(read("server/masterclass3FullBio.test.ts").replace(helperImport, "").replace(newRead, oldRead)).toBe(old("server/masterclass3FullBio.test.ts"));
    expect(() => beforeMasterclass3Membership(path, page + MEMBERSHIP_ADDITION)).toThrow();
    expect(() => beforeMasterclass3Membership(path, page.replace("charged separately.", "included."))).toThrow();
    expect(beforeMasterclass3Membership(path, old(path))).toBe(old(path));
    expect(beforeMasterclass3Membership("unrelated", "unchanged")).toBe("unchanged");
  });
});
