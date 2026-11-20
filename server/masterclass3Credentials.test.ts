import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { transformSync } from "esbuild";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeMasterclass3Credentials, CREDENTIAL_IMPORT, CREDENTIAL_MOUNT, ABOM_ENTRY } from "./masterclass3CredentialsBaseline";
const root = new URL("../", import.meta.url);
const read = (p: string) => readFileSync(new URL(p, root), "utf8");
const old = (p: string) => execFileSync("git", ["show", `03fae9af:${p}`], { cwd: root, encoding: "utf8" });
const pagePath = "client/src/pages/Masterclass3.tsx", bioPath = "client/src/components/masterclass3/Masterclass3FullBio.tsx";
const page = read(pagePath), bio = read(bioPath);
const badgePath = "client/src/components/masterclass3/Masterclass3Credentials.tsx", badges = read(badgePath);
const require = createRequire(import.meta.url);
function render(text: string) {
  const module: { exports: any } = { exports: {} };
  const req = (name: string) => name === "@/components/ui/accordion" ? Object.fromEntries(["Accordion", "AccordionItem", "AccordionTrigger", "AccordionContent"].map(k => [k, ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children)])) : require(name);
  new Function("require", "module", transformSync(text, { loader: "tsx", format: "cjs", jsx: "automatic" }).code)(req, module);
  return renderToStaticMarkup(React.createElement(module.exports.default, { onBookVisit: () => {} }));
}
describe("V3 official ABOM/MSCP badges and distinct board certification only", () => {
  it("reconstructs both existing production files with exactly the three approved additions removed", () => {
    expect(beforeMasterclass3Credentials(pagePath, page)).toBe(old(pagePath));
    expect(beforeMasterclass3Credentials(bioPath, bio)).toBe(old(bioPath));
    expect(page.split(CREDENTIAL_IMPORT)).toHaveLength(2);
    expect(page.split(CREDENTIAL_MOUNT)).toHaveLength(2);
    expect(bio.split(ABOM_ENTRY)).toHaveLength(2);
  });
  it("mounts only after Presented by and before the existing family photograph, with an untouched hero", () => {
    expect(page.indexOf(CREDENTIAL_MOUNT)).toBeGreaterThan(page.indexOf("Presented by Dr. Jumana Al-Deek"));
    expect(page.indexOf(CREDENTIAL_MOUNT)).toBeLessThan(page.indexOf("data-masterclass-presenter-photo"));
    const hero = (s: string) => s.slice(s.indexOf("        <section data-masterclass-video-first-hero"), s.indexOf("        <section ref={videoRef}"));
    expect(hero(page)).toBe(hero(old(pagePath)));
    expect(bio).not.toMatch(/Licensed in 12 states|Al-Deek, MD/);
  });
  it("renders exactly two unaltered official images with accurate patient-readable labels and no new action", () => {
    const html = render(badges);
    expect(html.match(/<img /g)).toHaveLength(2);
    expect(html).toContain("Board-certified in Obesity Medicine (ABOM)");
    expect(html).toContain("Menopause Society Certified Practitioner (MSCP)");
    expect(html).toContain('/manus-storage/abom-diplomate-v3_d049b68f.webp');
    expect(html).toContain('/manus-storage/mscp-badge-2026_09c3feaa.webp');
    expect(badges.match(/object-contain/g)).toHaveLength(2);
    expect(badges).not.toMatch(/object-cover|filter:|onClick|href=|useEffect|fetch\(|fbq|gtag|identify/);
    expect(badges).toContain('sm:grid-cols-2');
    expect(badges).toContain('text-[15px] font-bold');
  });
  it("adds the actual ABOM board entry without conflating the existing separate OMA training", () => {
    const html = render(bio);
    expect(html).toContain("American Board of Obesity Medicine");
    expect(html).toContain("Board Certification in Obesity Medicine (ABOM Diplomate)");
    expect(html).toContain("Obesity Medicine Association");
    expect(html).toContain("Obesity &amp; Metabolic Health Certification");
    expect(html).toContain("Menopause Society Certified Practitioner");
    expect(bio.indexOf(ABOM_ENTRY)).toBeLessThan(bio.indexOf('org: "Obesity Medicine Association"'));
  });
  it("preserves all old assertions through only three narrow read adapters and every protected original file", () => {
    for (const p of ["server/masterclass3MagentaHeroBaseline.ts", "server/masterclass3MagentaHero.test.ts", "server/masterclass3Membership.test.ts"]) expect(beforeMasterclass3Credentials(p, read(p))).toBe(old(p));
    for (const p of ["client/src/pages/Masterclass2.tsx", "client/src/pages/MasterclassVideoFirst.tsx", "client/src/pages/HomeHrt3.tsx", "client/src/components/masterclass2/PhysicianProfile.tsx", "client/src/App.tsx", "client/src/index.css", "client/src/components/home1/LpConsultationModal2.tsx", "client/src/lib/masterclass3VideoTracking.ts", "server/masterclass3FullBio.test.ts", "server/masterclass3Page.test.ts"]) expect(read(p)).toBe(old(p));
  });
  it("rejects partial or duplicate changes and passes genuinely historical/unrelated sources unchanged", () => {
    expect(() => beforeMasterclass3Credentials(pagePath, page.replace(CREDENTIAL_IMPORT, ""))).toThrow();
    expect(() => beforeMasterclass3Credentials(pagePath, page + CREDENTIAL_MOUNT)).toThrow();
    expect(() => beforeMasterclass3Credentials(bioPath, bio + ABOM_ENTRY)).toThrow();
    expect(() => beforeMasterclass3Credentials(bioPath, bio.replace("ABOM Diplomate", "Other"))).toThrow();
    expect(beforeMasterclass3Credentials(pagePath, old(pagePath))).toBe(old(pagePath));
    expect(beforeMasterclass3Credentials(bioPath, old(bioPath))).toBe(old(bioPath));
    expect(beforeMasterclass3Credentials("unrelated", page)).toBe(page);
  });
});
