import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const baseline = "c8783393";
const root = resolve(import.meta.dirname, "..");
const cssPath = "client/src/pages/WeightLossMenopauseV2.css";
const faqCssPath = "client/src/pages/WeightLossMenopauseV2Faq.css";
const pagePath = "client/src/pages/WeightLossMenopauseV2.tsx";
const doctorBioPath = "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx";
const masterclassProfilePath = "client/src/components/masterclass2/PhysicianProfile.tsx";
const indexPath = "client/index.html";
const homepagePath = "client/src/pages/HomeHrt3.tsx";
const homepageMedicalTeamPath = "client/src/components/home1/MedicalTeam.tsx";
const approvedFaqBehaviorComponentPaths = new Set([
  "client/src/components/masterclass2/FinalFaq.tsx",
  "client/src/pages/WeightLossMenopauseV2Faq.tsx",
]);
const heroFontMarker = "/* V2 hero headline — homepage font match only. */";
const approvedHeroFontAppend = `
/* V2 hero headline — homepage font match only. */
.wlm-v2-content .hero[data-medmethod-scope] h1 {
  font-family: "Montserrat", sans-serif;
  font-weight: 900;
}
`;
const desktopHeroSizingMarker = "/* V2 desktop hero headline — restrained sizing only. */";
const approvedDesktopHeroSizingAppend = `
/* V2 desktop hero headline — restrained sizing only. */
@media (min-width: 1025px) {
  .wlm-v2-content .hero[data-medmethod-scope] h1 {
    font-size: clamp(36px, 3vw, 50px);
  }
}
`;
const approvedAuditPriorityFixesAppend = `
/* V2 audit priority fixes — hero handoff and book-title contrast. */
@media (min-width: 901px) and (max-width: 1024px) {
  .wlm-v2-content .hero[data-medmethod-scope] h1 {
    font-size: clamp(36px, 3vw, 50px);
  }
}
.wlm-v2-content #doctor .doctor-bio-book {
  color: #7A1E7E;
}
`;
const approvedFaqAnswerFontAppend = `
/* V2 audit priority fix — readable FAQ answers only. */
.wlm-v2-content #faq .faq-list details > p {
  font-size: 17px;
}
`;
const approvedMscpCredential = '"Menopause Certified (MSCP)", ';
const approvedV2DoctorHeading = '<h2 id="v2-doctor-heading">Meet Dr. Jumana Al-Deek, DO, MS, MSCP</h2>';
const baselineV2DoctorHeading = '<h2 id="v2-doctor-heading">Meet Dr. Jumana Al-Deek, DO, MS</h2>';
const approvedMasterclassMscpCredentialLine = '  "Menopause Certified (MSCP)",\n';
const approvedHomepageMscpOptIn = "          showMscpCredential\n";
const approvedHomepageMscpDestructuredDefault = "  showMscpCredential = false,\n";
const approvedHomepageMscpType = "  showMscpCredential?: boolean;\n";
const approvedHomepageMscpCredentialSelection = [
  "  const credentialPills = showMscpCredential",
  '    ? [CREDENTIAL_PILLS[0], "Menopause Certified (MSCP)", ...CREDENTIAL_PILLS.slice(1)]',
  "    : CREDENTIAL_PILLS;",
  "",
].join("\n");
const approvedHomepageMscpCredentialMap = "{credentialPills.map((pill) => (";
const defaultHomepageCredentialMap = "{CREDENTIAL_PILLS.map((pill) => (";
const approvedHomepageFamilyPhysicianOptIn = '          firstCredentialLabel="Family Physician"\n';
const approvedHomepageFamilyPhysicianDestructuredDefault = "  firstCredentialLabel = CREDENTIAL_PILLS[0],\n";
const approvedHomepageFamilyPhysicianType = "  firstCredentialLabel?: string;\n";
const approvedHomepageFamilyPhysicianCredentialSelection = [
  "  const credentialPills = showMscpCredential",
  '    ? [firstCredentialLabel, "Menopause Certified (MSCP)", ...CREDENTIAL_PILLS.slice(1)]',
  "    : [firstCredentialLabel, ...CREDENTIAL_PILLS.slice(1)];",
  "",
].join("\n");
const retainedHomepageMscpCredentialSelection = [
  "  const credentialPills = showMscpCredential",
  '    ? [CREDENTIAL_PILLS[0], "Menopause Certified (MSCP)", ...CREDENTIAL_PILLS.slice(1)]',
  "    : CREDENTIAL_PILLS;",
  "",
].join("\n");


function read(file: string): string {
  return readFileSync(resolve(root, file), "utf8");
}

function atBaseline(file: string): string {
  return execFileSync("git", ["show", `${baseline}:${file}`], { cwd: root, encoding: "utf8" });
}

function cssWithoutApprovedAuditPriorityFixes(): string {
  const css = read(cssPath);
  return css.endsWith(approvedAuditPriorityFixesAppend)
    ? css.slice(0, -approvedAuditPriorityFixesAppend.length)
    : css;
}

function normalizeApprovedAuditPriorityAppend(file: string, source: string): string {
  return file === faqCssPath && source.endsWith(approvedFaqAnswerFontAppend)
    ? source.slice(0, -approvedFaqAnswerFontAppend.length)
    : source;
}

function normalizeApprovedV2DoctorBioMscpCredential(file: string, source: string): string {
  if (file !== doctorBioPath) return source;
  const count = (value: string) => source.split(value).length - 1;
  expect(count(approvedMscpCredential)).toBe(1);
  expect(count(approvedV2DoctorHeading)).toBe(1);
  return source
    .replace(approvedMscpCredential, "")
    .replace(approvedV2DoctorHeading, baselineV2DoctorHeading);
}

function normalizeApprovedMasterclassMscpCredential(file: string, source: string): string {
  if (file !== masterclassProfilePath) return source;
  expect(source.split(approvedMasterclassMscpCredentialLine).length - 1).toBe(1);
  return source.replace(approvedMasterclassMscpCredentialLine, "");
}

function normalizeApprovedHomepageMscpCredential(file: string, source: string): string {
  const count = (value: string) => source.split(value).length - 1;
  if (file === homepagePath) {
    expect(count(approvedHomepageFamilyPhysicianOptIn)).toBe(1);
    expect(count(approvedHomepageMscpOptIn)).toBe(1);
    return source
      .replace(approvedHomepageFamilyPhysicianOptIn, "")
      .replace(approvedHomepageMscpOptIn, "");
  }
  if (file !== homepageMedicalTeamPath) return source;
  expect(count(approvedHomepageFamilyPhysicianDestructuredDefault)).toBe(1);
  expect(count(approvedHomepageFamilyPhysicianType)).toBe(1);
  expect(count(approvedHomepageFamilyPhysicianCredentialSelection)).toBe(1);
  expect(count(approvedHomepageMscpDestructuredDefault)).toBe(1);
  expect(count(approvedHomepageMscpType)).toBe(1);
  expect(count(approvedHomepageMscpCredentialMap)).toBe(1);
  const restoredFamilyCredential = source
    .replace(approvedHomepageFamilyPhysicianDestructuredDefault, "")
    .replace(approvedHomepageFamilyPhysicianType, "")
    .replace(approvedHomepageFamilyPhysicianCredentialSelection, retainedHomepageMscpCredentialSelection);
  expect(restoredFamilyCredential.split(approvedHomepageMscpCredentialSelection).length - 1).toBe(1);
  return restoredFamilyCredential
    .replace(approvedHomepageMscpDestructuredDefault, "")
    .replace(approvedHomepageMscpType, "")
    .replace(approvedHomepageMscpCredentialSelection, "")
    .replace(approvedHomepageMscpCredentialMap, defaultHomepageCredentialMap);
}

function changedProductionFiles(): string[] {
  return execFileSync("git", ["diff", "--name-only", baseline, "--", "client", "server", "shared"], {
    cwd: root,
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean)
    .filter(file => !/\.test\.[cm]?[jt]sx?$/.test(file))
    .filter(file => !approvedFaqBehaviorComponentPaths.has(file))
    .filter(file => normalizeApprovedHomepageMscpCredential(file, normalizeApprovedAuditPriorityAppend(file, normalizeApprovedV2DoctorBioMscpCredential(file, normalizeApprovedMasterclassMscpCredential(file, normalizeApprovedV2SectionOrder(file, read(file)))))) !== atBaseline(file));
}

function normalizeApprovedV2SectionOrder(path: string, source: string): string {
  if (path !== "client/src/pages/WeightLossMenopauseV2.tsx") return source;
  const medicationPricingStart = '<section className="medication-pricing"';
  const estimatorStart = '<section className="estimator-band"';
  const doctorBioMount = "<WeightLossMenopauseV2DoctorBio />";
  const faqMount = '<WeightLossMenopauseV2Faq intakeHref={WEIGHT_MENOPAUSE_INTAKE_URL} />';
  const count = (value: string) => source.split(value).length - 1;
  if (count(medicationPricingStart) !== 1 || count(estimatorStart) !== 1 || count(doctorBioMount) !== 1 || count(faqMount) !== 1) {
    throw new Error("Expected exactly one approved V2 medication/estimator reorder boundary");
  }
  const medicationStart = source.indexOf(medicationPricingStart);
  const doctorStart = source.indexOf(doctorBioMount);
  const faqStart = source.indexOf(faqMount);
  if (medicationStart <= doctorStart || medicationStart >= faqStart) {
    throw new Error("Expected medication and estimator block only between doctor bio and final FAQ");
  }
  const medicationAndEstimator = source.slice(medicationStart, faqStart);
  if (!medicationAndEstimator.includes(estimatorStart) || !medicationAndEstimator.endsWith("\n")) {
    throw new Error("Expected the exact adjacent medication and estimator block with its trailing newline");
  }
  const withoutMedicationAndEstimator = source.slice(0, medicationStart) + source.slice(faqStart);
  const restoredDoctorStart = withoutMedicationAndEstimator.indexOf(doctorBioMount);
  if (restoredDoctorStart < 0) throw new Error("Missing V2 doctor-bio restoration anchor");
  return withoutMedicationAndEstimator.slice(0, restoredDoctorStart)
    + medicationAndEstimator
    + withoutMedicationAndEstimator.slice(restoredDoctorStart);
}

describe("Weight-Loss & Menopause V2 homepage hero font match", () => {
  it("keeps the approved six-line font append exact before the separately approved terminal desktop sizing append", () => {
    const css = cssWithoutApprovedAuditPriorityFixes();
    const markerIndex = css.indexOf(heroFontMarker);
    const sizingMarkerIndex = css.indexOf(desktopHeroSizingMarker);

    expect(markerIndex).toBe(atBaseline(cssPath).length + 1);
    expect(sizingMarkerIndex).toBe(atBaseline(cssPath).length + approvedHeroFontAppend.length + 1);
    expect(css.match(/\/\* V2 hero headline — homepage font match only\. \*\//g)).toHaveLength(1);
    expect(css.match(/\/\* V2 desktop hero headline — restrained sizing only\. \*\//g)).toHaveLength(1);
    expect(css).toBe(`${atBaseline(cssPath)}${approvedHeroFontAppend}${approvedDesktopHeroSizingAppend}`);
    expect(css.slice(0, markerIndex)).toBe(atBaseline(cssPath) + "\n");
    expect(css.slice(markerIndex, sizingMarkerIndex)).toBe(`${approvedHeroFontAppend.trimStart()}\n`);
    expect(css.slice(sizingMarkerIndex)).toBe(approvedDesktopHeroSizingAppend.trimStart());
  });

  it("changes only the scoped hero h1 family and weight, letting headline spans inherit while preserving the masked ampersand's DM Sans rule", () => {
    const css = cssWithoutApprovedAuditPriorityFixes();
    const append = css.slice(css.indexOf(heroFontMarker), css.indexOf(desktopHeroSizingMarker));
    const page = read(pagePath);
    const cssPrefix = css.slice(0, css.indexOf(heroFontMarker));

    expect(append).toBe(`${approvedHeroFontAppend.trimStart()}\n`);
    expect(append).toContain('.wlm-v2-content .hero[data-medmethod-scope] h1 {\n  font-family: "Montserrat", sans-serif;\n  font-weight: 900;\n}');
    expect(append).not.toMatch(/(?:font-size|line-height|letter-spacing|color|background|margin|padding|mask|text-decoration|transform)\s*:/);
    expect(append).not.toContain(".hero-headline-line");
    expect(append).not.toContain(".hero-ampersand");
    expect(append).not.toContain(".hero-free");
    expect(normalizeApprovedV2SectionOrder(pagePath, page)).toBe(atBaseline(pagePath));
    expect(page).toContain('<h1><span className="hero-headline-line">Text a Weight Loss <span className="hero-ampersand">&amp;</span><br />Hormone Doctor now.</span><span className="hero-headline-line hero-free"><em>First visit FREE!</em></span></h1>');
    expect(cssPrefix).toContain('.wlm-v2-content .hero[data-medmethod-scope] h1 .hero-ampersand{font-family:"DM Sans",Arial,sans-serif;line-height:0');
  });

  it("uses the existing globally loaded Montserrat 900 and the same homepage headline source convention", () => {
    const index = read(indexPath);
    const homepage = read(homepagePath);
    const homepageMedicalTeam = read(homepageMedicalTeamPath);

    expect(index).toBe(atBaseline(indexPath));
    expect(index).toMatch(/fonts\.googleapis\.com\/css2\?family=Montserrat:wght@400;500;600;700;800;900&/);
    expect(normalizeApprovedHomepageMscpCredential(homepagePath, homepage)).toBe(atBaseline(homepagePath));
    expect(homepage).toContain('import MedicalTeam from "@/components/home1/MedicalTeam";');
    expect(normalizeApprovedHomepageMscpCredential(homepageMedicalTeamPath, homepageMedicalTeam)).toBe(atBaseline(homepageMedicalTeamPath));
    expect(homepageMedicalTeam).toMatch(/<h1\s+className="font-black text-\[#111111\] leading-\[1\.05\]"\s+style=\{\{[\s\S]*?fontFamily: "Montserrat, sans-serif"/);
  });

  it("leaves every other production source at c8783393, including markup, global font links, content, data, and payment paths", () => {
    expect(changedProductionFiles()).toEqual([cssPath]);
  });
});
