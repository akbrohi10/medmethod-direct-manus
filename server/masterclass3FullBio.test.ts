import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { transformSync } from "esbuild";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeMasterclass3FullBio, FULL_BIO_IMPORT, FULL_BIO_MOUNT } from "./masterclass3FullBioBaseline";
import { beforeMasterclass3Membership } from "./masterclass3MembershipBaseline";

const root = new URL("../", import.meta.url);
const read = (p: string) => beforeMasterclass3Membership(p, readFileSync(new URL(p, root), "utf8"));
const old = (p: string) => execFileSync("git", ["show", `829de1b5:${p}`], { cwd: root, encoding: "utf8" });
const pagePath = "client/src/pages/Masterclass3.tsx";
const bioPath = "client/src/components/masterclass3/Masterclass3FullBio.tsx";
const sourcePath = "client/src/components/masterclass2/PhysicianProfile.tsx";
const page = read(pagePath), bio = read(bioPath), source = read(sourcePath);
const require = createRequire(import.meta.url);
function load(text: string) {
  const module: { exports: any } = { exports: {} };
  const compiled = transformSync(text + "\nmodule.exports.bioData = {CREDENTIAL_PILLS,FOCUS_AREA_PILLS,BIO_SECTIONS};", { loader: "tsx", format: "cjs", jsx: "automatic" }).code;
  const req = (name: string) => {
    if (name === "@/components/ui/accordion") {
      const wrapper = ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children);
      return { Accordion: wrapper, AccordionItem: wrapper, AccordionTrigger: wrapper, AccordionContent: wrapper };
    }
    return require(name);
  };
  new Function("require", "module", compiled)(req, module);
  return module.exports;
}
const original = load(source), copied = load(bio);
const render = (node: React.ReactNode) => renderToStaticMarkup(React.createElement(React.Fragment, null, node));
const tag = (text: string, marker: string) => text.match(new RegExp(`<[^\\n>]*${marker}[^\\n]*>`))![0];

describe("V3 full story — exact source copy, one outer expansion only", () => {
  it("adds exactly an import and a mount before footer, moving no existing sections", () => {
    expect(page.split(FULL_BIO_IMPORT)).toHaveLength(2);
    expect(page.split(FULL_BIO_MOUNT)).toHaveLength(2);
    expect(beforeMasterclass3FullBio(pagePath, page)).toBe(old(pagePath));
    expect(page.indexOf(FULL_BIO_MOUNT)).toBeGreaterThan(page.indexOf("<FeaturedInStrip />"));
    expect(page).toContain(FULL_BIO_MOUNT + '        <footer className="border-t border-[#eee4e9] px-5 py-8 sm:px-10">');
    expect(page.match(/data-masterclass3-primary-cta/g)).toHaveLength(1);
    expect(page.match(/data-masterclass3-secondary-cta/g)).toHaveLength(1);
    expect(page).not.toContain("data-masterclass3-bottom-booking");
  });
  it("copies all five full BIO_SECTIONS without changing a literal or JSX fragment", () => {
    expect(copied.bioData.BIO_SECTIONS.map((s: any) => s.label)).toEqual(["Practice Focus", "Philosophy", "Clinical Background", "Medical Training", "Advanced Training & Approach"]);
    for (let i = 0; i < original.bioData.BIO_SECTIONS.length; i++) {
      const a = original.bioData.BIO_SECTIONS[i], b = copied.bioData.BIO_SECTIONS[i];
      expect(b.label).toBe(a.label);
      expect(render(b.teaser)).toBe(render(a.teaser));
      expect(render(b.rest)).toBe(render(a.rest));
    }
    expect(bio.slice(bio.indexOf("const BIO_SECTIONS:"), bio.indexOf("export default function"))).toBe(source.slice(source.indexOf("const BIO_SECTIONS:"), source.indexOf("export default function")));
  });
  it("corrects only the credential pill and omits only the obsolete12-state pill", () => {
    expect(copied.bioData.CREDENTIAL_PILLS).toEqual(original.bioData.CREDENTIAL_PILLS.filter((s: string) => s !== "Licensed in 12 states").map((s: string) => s === "Menopause Certified (MSCP)" ? "Menopause Society Certified Practitioner" : s));
    expect(copied.bioData.FOCUS_AREA_PILLS).toEqual(original.bioData.FOCUS_AREA_PILLS);
    expect(bio).not.toMatch(/Licensed in 12 states|Menopause Certified \(MSCP\)|Al-Deek, MD/);
    expect(bio).toContain("Family Physician");
    expect(bio).toContain("Dr. Al-Deek is a board-certified physician");
    expect(bio).toContain("Meet Dr. Jumana Al-Deek, DO,MS");
    expect(page.match(/Available in 17 states/g)).toHaveLength(2);
  });
  it("copies the complete training, pre-medicine, quote and introduction markup", () => {
    const between = (s: string, a: string, b: string) => s.slice(s.indexOf(a), s.indexOf(b, s.indexOf(a)));
    expect(between(bio, "              {/* Education timeline */}", '          <div className="order-2')).toBe(between(source, "              {/* Education timeline */}", '          <div className="order-2'));
    const header = (s: string) => between(s, "      <header\n", "      <article\n");
    expect(header(bio).replaceAll("masterclass3-full-story-heading", "masterclass2-profile-heading").replaceAll("masterclass3-full-story-", "masterclass2-")).toBe(header(source));
    const rendered = render(React.createElement(copied.default, { onBookVisit: () => {} }));
    for (const s of ["Training &amp; Credentials", "Pre-Medicine Background", "Former NASM-Certified Personal Trainer", "About Your Physician", "Practice Focus", "Philosophy", "Clinical Background", "Medical Training", "Advanced Training &amp; Approach", "The Menopause Weight Loss Trap", "mom of four", "West Virginia School of Osteopathic Medicine", "AdventHealth Winter Park", "Georgetown University", "The Menopause Society", "Obesity Medicine Association"]) expect(rendered).toContain(s);
  });
  it("has one collapsed-by-default accessible outer toggle and no nested hidden paragraphs", () => {
    expect(bio).toContain('Meet your doctor — Dr. Jumana Al-Deek\'s full story');
    expect(bio).toContain('<Accordion type="single" collapsible');
    expect(bio.match(/<AccordionTrigger\b/g)).toHaveLength(1);
    expect(bio).not.toMatch(/defaultValue|defaultOpen|expanded\.has|toggleSection|maxHeight:|BIO_SECTIONS\.slice/);
    expect(bio).toContain("BIO_SECTIONS.map");
    expect(bio).toContain("{section.teaser} {section.rest}");
  });
  it("puts the two copied CTA styles/actions at the end and only within the expansion", () => {
    expect(bio.match(/data-masterclass3-bio-discovery-cta/g)).toHaveLength(1);
    expect(bio.match(/data-masterclass3-bio-visit-cta/g)).toHaveLength(1);
    expect(tag(bio, "data-masterclass3-bio-discovery-cta").replace("data-masterclass3-bio-discovery-cta", "data-masterclass3-primary-cta")).toBe(tag(page, "data-masterclass3-primary-cta"));
    expect(tag(bio, "data-masterclass3-bio-visit-cta").replace("data-masterclass3-bio-visit-cta", "data-masterclass3-secondary-cta").replace("onClick={onBookVisit}", "onClick={() => setConsultationOpen(true)}")).toBe(tag(page, "data-masterclass3-secondary-cta"));
    expect(bio).toContain("Book Your Free 15-Minute Discovery Call");
    expect(bio).toContain("Book Your 45-Minute Visit with Dr. Al-Deek — $199");
    expect(bio.indexOf("data-masterclass3-bio-booking")).toBeGreaterThan(bio.indexOf("</article>"));
    expect(bio.indexOf("data-masterclass3-bio-booking")).toBeLessThan(bio.indexOf("</AccordionContent>"));
    expect(page.match(/<LpConsultationModal2 /g)).toHaveLength(1);
    expect(bio).not.toMatch(/fetch\(|useMutation|createOrder|captureOrder|window\.open|\/book-a-visit|<LpConsultationModal2/);
  });
  it("leaves originals, source bio, routing, shared modal, styles, pricing fixture and tracker byte-identical", () => {
    for (const p of [sourcePath, "client/src/pages/Masterclass2.tsx", "client/src/pages/MasterclassVideoFirst.tsx", "client/src/App.tsx", "client/src/index.css", "client/src/components/home1/LpConsultationModal2.tsx", "client/src/components/home1/StripePaymentForm.tsx", "client/src/components/home1/PayPalPaymentForm.tsx", "client/src/lib/masterclass3VideoTracking.ts", "server/fixtures/masterclass3CopyEdits.json"]) expect(read(p)).toBe(old(p));
  });
  it("keeps every prior V3 assertion and registration unchanged beneath strict reversible read adapters", () => {
    for (const p of ["server/masterclass3Page.test.ts", "server/masterclass3BookingActions.test.ts", "server/masterclass3SingleBooking.test.ts", "server/masterclass3LearningLabel.test.ts"]) expect(beforeMasterclass3FullBio(p, read(p))).toBe(old(p));
    expect(() => beforeMasterclass3FullBio(pagePath, page + FULL_BIO_MOUNT)).toThrow();
    expect(() => beforeMasterclass3FullBio(pagePath, page.replace(FULL_BIO_IMPORT, ""))).toThrow();
  });
});
