import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { transformSync } from "esbuild";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeHomeDualCredentials, HOME_DUAL_CREDENTIAL_EDITS } from "./homeDualCredentialsBaseline";
const root = new URL("../", import.meta.url);
const homePath = "client/src/pages/HomeHrt3.tsx", teamPath = "client/src/components/home1/MedicalTeam.tsx", badgePath = "client/src/components/home1/HomeCredentialBadges.tsx";
const read = (p: string) => readFileSync(new URL(p, root), "utf8");
const old = (p: string) => execFileSync("git", ["show", `39e1a5ab:${p}`], { cwd: root, encoding: "utf8" });
const require = createRequire(import.meta.url);
function load(source: string): React.ComponentType<any> {
  const module: { exports: any } = { exports: {} };
  const req = (name: string) => name === "./HomeCredentialBadges" ? { __esModule: true, default: load(read(badgePath)) } : require(name);
  new Function("require", "module", "exports", transformSync(source, { loader: "tsx", format: "cjs", jsx: "automatic" }).code)(req, module, module.exports);
  return module.exports.default;
}
function render(source: string, props: Record<string, any> = {}) { return renderToStaticMarkup(React.createElement(load(source), props)); }
const home = read(homePath), team = read(teamPath), badges = read(badgePath);
describe("Homepage-only unboxed ABOM and MSCP credentials", () => {
  it("reconstructs both whole production sources and only two historical reader edits exactly", () => {
    for (const p of Object.keys(HOME_DUAL_CREDENTIAL_EDITS)) expect(beforeHomeDualCredentials(p, read(p))).toBe(old(p));
  });
  it("opts in only the root homepage and preserves all other production source paths", () => {
    const changed = execFileSync("git", ["diff", "--name-only", "39e1a5ab", "--", "client"], { cwd: root, encoding: "utf8" }).split("\n");
    const added = execFileSync("git", ["ls-files", "--others", "--exclude-standard", "--", "client"], { cwd: root, encoding: "utf8" }).split("\n");
    expect([...new Set([...changed,...added].filter(Boolean))].sort()).toEqual([homePath,teamPath,badgePath].sort());
    expect(home.split("          showHomeDualCredentials\n")).toHaveLength(2);
    expect(read("client/src/App.tsx")).toContain('<Route path={"/"} component={HomeHrt3} />');
    for (const p of ["client/src/pages/LpHrt3.tsx", "client/src/pages/Masterclass2.tsx", "client/src/pages/MasterclassVideoFirst.tsx", "client/src/pages/Masterclass3.tsx", "client/src/components/masterclass3/Masterclass3Credentials.tsx", "client/src/components/masterclass3/Masterclass3FullBio.tsx", "client/src/pages/WeightLossMenopauseV2.tsx", "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx", "client/src/App.tsx", "client/src/index.css", "client/src/components/home1/LpConsultationModal2.tsx"]) expect(read(p)).toBe(old(p));
  });
  it("renders the shared component byte-identically when no homepage opt-in is present", () => {
    for (const props of [{}, { showMscpCredential: true, firstCredentialLabel: "Family Physician", mscpBadgeSrc: "/manus-storage/mscp-badge-2026_09c3feaa.webp" }, { ctaLabel: "Book Visit", secondaryAction: { href: "/care-team-booking", label: "Call" }, swapBookingActions: true, showHomeDualCredentials: false }]) expect(render(team,props)).toBe(render(old(teamPath),props));
  });
  it("replaces rather than duplicates the old MSCP row in the patient-count-to-booking slot", () => {
    const html = render(team,{ showHomeDualCredentials: true, mscpBadgeSrc: "/manus-storage/mscp-badge-2026_09c3feaa.webp" });
    expect(html.match(/data-home-dual-credentials/g)).toHaveLength(1);
    expect(html).not.toContain("data-home-mscp-trust-row");
    expect(html).not.toContain("Certified menopause expertise.");
    expect(html.indexOf("data-home-dual-credentials")).toBeGreaterThan(html.indexOf("data-home-patient-volume-proof"));
    expect(html.indexOf("data-home-dual-credentials")).toBeLessThan(html.indexOf('id="hero-cta-sentinel"'));
  });
  it("uses exact patient-readable labels with MSCP first and ABOM second", () => {
    const html = render(badges);
    expect(html).toContain("Menopause Society Certified Practitioner (MSCP)");
    expect(html).toContain("Board-certified in Obesity Medicine (ABOM)");
    expect(html.indexOf('data-home-credential="mscp"')).toBeLessThan(html.indexOf('data-home-credential="abom"'));
    expect(html.match(/<img /g)).toHaveLength(2);
  });
  it("preserves official logo proportions, readable brand typography and an unboxed responsive layout", () => {
    expect(badges.match(/object-contain/g)).toHaveLength(2);
    expect(badges).toContain('width={900}');expect(badges).toContain('height={232}');
    expect(badges).toContain('width={256}');expect(badges).toContain('height={256}');
    expect(badges).toContain("sm:grid-cols-2");expect(badges).toContain("Montserrat, sans-serif");
    expect(badges).toContain("text-[15px] font-bold");expect(badges).toContain("text-[#7A1E7E]");
    expect(badges).not.toMatch(/object-cover|rounded-|border-|shadow-|bg-|filter|onClick|href=|useEffect|fetch\(|fbq|gtag|\bhj\b/);
  });
  it("adds actual ABOM board certification once, separately from retained OMA training", () => {
    const html = render(team,{showHomeDualCredentials:true});
    expect(html.match(/American Board of Obesity Medicine<\/div>/g)).toHaveLength(1);
    expect(html).toContain("Board Certification in Obesity Medicine (ABOM Diplomate)");
    expect(html).toContain("Obesity Medicine Association");expect(html).toContain("Obesity &amp; Metabolic Health Certification");
    expect(html.indexOf("Board Certification in Obesity Medicine (ABOM Diplomate)")).toBeLessThan(html.indexOf("Obesity Medicine Association"));
    expect(render(team)).not.toContain("Board Certification in Obesity Medicine (ABOM Diplomate)");
  });
  it("retains the existing one-time MSCP fallback and does not add any new CTA or event", () => {
    expect(badges).toContain('image.dataset.fallbackUsed !== "true"');
    expect(badges).toContain("image.src = mscpBadgeFallbackSrc;");
    expect(home).toContain('mscpBadgeFallbackSrc="https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/VUbVCEUAQsHMTUAM.webp"');
    expect(render(badges)).not.toMatch(/<a\b|<button\b|<input\b/);
  });
  it("preserves complete original booking callbacks and headline/body through the exact source inverse", () => {
    const actions = (s:string) => s.slice(s.indexOf("  const physicianBookingAction = ("),s.indexOf("  return (\n    <section",s.indexOf("  const physicianBookingAction = (")));
    expect(actions(team)).toBe(actions(old(teamPath)));
    expect(beforeHomeDualCredentials(homePath,home)).toBe(old(homePath));
    expect(home).toContain('ctaLabel="Book Your 45-Minute Visit"');expect(home).toContain('href: "/care-team-booking"');
  });
  it("rejects missing/duplicated approved fragments without masking unrelated edits", () => {
    const flag="          showHomeDualCredentials\n";
    expect(()=>beforeHomeDualCredentials(homePath,home+flag)).toThrow();
    expect(()=>beforeHomeDualCredentials(teamPath,team.replace("ABOM Diplomate","Other"))).toThrow();
    expect(()=>beforeHomeDualCredentials(teamPath,team.replace("  showHomeDualCredentials = false,\n",""))).toThrow();
    expect(beforeHomeDualCredentials(homePath,home+"\n// unrelated\n")).not.toBe(old(homePath));
    expect(beforeHomeDualCredentials(homePath,old(homePath))).toBe(old(homePath));
    expect(beforeHomeDualCredentials("unrelated",home)).toBe(home);
  });
});
