import { inverseApprovedV2HeroQuestion } from "./weightLossMenopauseV2HeroQuestion.test"; import { inverseApprovedV2Membership, membershipFixturePath } from "./weightLossMenopauseV2Membership.test"; import { compactMembershipFixturePath, inverseApprovedV2CompactMembership } from "./weightLossMenopauseV2CompactMembership.test";
import { verifyApprovedHormoneSymptomQuizAsset } from "./hormoneSymptomQuizScope.test";
import { inverseApprovedFinalProgressLabel, finalProgressLabelFixturePath } from "./intakeFinalProgressLabelScope.test";
import { inverseApprovedShippingSkip, shippingSkipFixturePath } from "./intakeShippingSkipScope.test";
import { progressFixturePath, progressAssetPath } from "./intakeProgressScope.test";
import { inverseApprovedGlp1Combined, glp1CombinedFixturePath, glp1CombinedAssetPath } from "./intakeGlp1CombinedScope.test";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { inverseApprovedThankYouWording, approvedThankYouWordingPaths, thankYouWordingFixturePath } from "./intakeThankYouWordingScope.test";

const root = resolve(import.meta.dirname, "..");
const baseline = "0648c6e3";
const intakePath = "client/intake/index.html";
export const introDetailsPhotoFixturePath = "server/fixtures/intakeIntroDetailsPhotoFragments.json";
export const introDetailsPhotoRegistrationPath = "server/intakeScaleExampleAsset.ts";
export const introducedDoctorPortraitAssetPath = "server/intakeDoctorPortraitAsset.ts";
type Fragment = { old: string; new: string; count: number };
type Packet = { baseline: string; html_fragments: Fragment[]; registration_fragments: Fragment[]; introduced_asset: string };
const packetSource = readFileSync(resolve(root, introDetailsPhotoFixturePath), "utf8");
const packet: Packet = JSON.parse(packetSource);
const packetHash = "8ceb00a180d3f0e3bb90de27a1b537bca72879757731fa6674be8938ef4e443b";
if (createHash("sha256").update(packetSource).digest("hex") !== packetHash || packet.baseline !== baseline || packet.introduced_asset !== introducedDoctorPortraitAssetPath || packet.html_fragments.length !== 7 || packet.registration_fragments.length !== 2 || [...packet.html_fragments, ...packet.registration_fragments].some(fragment => fragment.count !== 1 || !fragment.old || !fragment.new || fragment.old === fragment.new)) {
  throw new Error("Unexpected approved intro-details-photo packet");
}
export const approvedIntroDetailsPhotoHtmlFragments = packet.html_fragments;

const shippingFixturePath = "server/fixtures/intakeLatePatientInfoFragments.json";
const shippingFixtureSource = readFileSync(resolve(root, shippingFixturePath), "utf8");
const shippingFragments: Fragment[] = JSON.parse(shippingFixtureSource);
const previousShippingFragments: Fragment[] = JSON.parse(execFileSync("git", ["show", `1476a622:${shippingFixturePath}`], { cwd: root, encoding: "utf8" }));
export const approvedShippingApprovalHtmlFragments = shippingFragments.slice(55, 59);
if (previousShippingFragments.length !== 55 || shippingFragments.length !== 61 || JSON.stringify(shippingFragments.slice(0, 55)) !== JSON.stringify(previousShippingFragments) || createHash("sha256").update(JSON.stringify(approvedShippingApprovalHtmlFragments)).digest("hex") !== "b70076ac088a824631b71d29b377d6091dae82e0f2e11c5bd2f31309df92f867") {
  throw new Error("Unexpected approved shipping-approval fragments");
}
for (const fragment of approvedShippingApprovalHtmlFragments) Object.freeze(fragment);
Object.freeze(approvedShippingApprovalHtmlFragments);

const previousSigningFixtureSource = execFileSync("git", ["show", `0c5f2ca4:${shippingFixturePath}`], { cwd: root, encoding: "utf8" });
const previousSigningFragments: Fragment[] = JSON.parse(previousSigningFixtureSource);
export const approvedSigningConnectionHtmlFragments = shippingFragments.slice(59);
if (previousSigningFragments.length !== 59 || createHash("sha256").update(previousSigningFixtureSource).digest("hex") !== "145fcb1a162123ea36bb8ae756e34af543170837083a44ca34a64abb555789b8" || !previousSigningFixtureSource.endsWith("\n]\n") || !shippingFixtureSource.startsWith(previousSigningFixtureSource.slice(0, -3) + ",\n") || JSON.stringify(shippingFragments.slice(0, 59)) !== JSON.stringify(previousSigningFragments) || createHash("sha256").update(JSON.stringify(shippingFragments.slice(0, 59))).digest("hex") !== "fd64a544685dc810b04f74693ca9500ad5201b29bdf43e69cda0686c60030bff" || approvedSigningConnectionHtmlFragments.length !== 2 || createHash("sha256").update(JSON.stringify(approvedSigningConnectionHtmlFragments)).digest("hex") !== "7fc4a428667945db527fe1169448c6cb49ed7fc27097ed773f997ecc586446da" || approvedSigningConnectionHtmlFragments.some(fragment => Object.keys(fragment).sort().join(",") !== "count,new,old" || fragment.count !== 1 || !fragment.old || !fragment.new || fragment.old === fragment.new)) {
  throw new Error("Unexpected approved signing-connection fragments");
}
for (const fragment of approvedSigningConnectionHtmlFragments) Object.freeze(fragment);
Object.freeze(approvedSigningConnectionHtmlFragments);

/** Reverse only the two frozen display strings appended after the byte-identical 0c5f2ca4 prefix. */
export function inverseApprovedSigningConnectionCopy(path: string, source: string): string {
  if (path !== intakePath) return source;
  source = inverseApprovedGlp1Combined(path, source);
  for (const fragment of [...approvedSigningConnectionHtmlFragments].reverse()) {
    if (source.split(fragment.new).length - 1 !== fragment.count) throw new Error("Unexpected authorized signing-connection source fragment count");
    source = source.split(fragment.new).join(fragment.old);
  }
  return source;
}

/** Normalize the two signing strings, then reverse the unchanged four shipping display fragments. */
export function inverseApprovedShippingApprovalWording(path: string, source: string): string {
  if (path !== intakePath) return source;
  source = inverseApprovedSigningConnectionCopy(path, source);
  for (const fragment of [...approvedShippingApprovalHtmlFragments].reverse()) {
    if (source.split(fragment.new).length - 1 !== fragment.count) throw new Error("Unexpected authorized shipping-approval source fragment count");
    source = source.split(fragment.new).join(fragment.old);
  }
  return source;
}

/** Normalize two signing strings and four shipping fragments, then reverse the original exact intro/photo packet. */
export function inverseApprovedIntroDetailsPhoto(path: string, source: string): string {
  if (path !== intakePath) source = inverseApprovedShippingSkip(path, source);
  if (approvedThankYouWordingPaths.some(approvedPath => approvedPath === path)) return inverseApprovedThankYouWording(path, source);
  if (path === intakePath) source = inverseApprovedShippingApprovalWording(path, source);
  const fragments = path === intakePath ? packet.html_fragments : path === introDetailsPhotoRegistrationPath ? packet.registration_fragments : [];
  for (const fragment of [...fragments].reverse()) {
    if (source.split(fragment.new).length - 1 !== fragment.count) throw new Error("Unexpected authorized intro-details-photo source fragment count");
    source = source.split(fragment.new).join(fragment.old);
  }
  return source;
}

const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const old = (path: string) => execFileSync("git", ["show", `${baseline}:${path}`], { cwd: root, encoding: "utf8" });

describe("intro details copy and doctor photo exact production scope", () => {
  it("freezes the exact seven-HTML/two-registration packet and introduced paths", () => {
    expect(createHash("sha256").update(read(introDetailsPhotoFixturePath)).digest("hex")).toBe(packetHash);
    expect(Object.keys(packet).sort()).toEqual(["baseline", "html_fragments", "registration_fragments", "introduced_asset"].sort());
    expect(packet.baseline).toBe(baseline);
    expect(packet.html_fragments).toHaveLength(7);
    expect(packet.registration_fragments).toHaveLength(2);
    expect(packet.introduced_asset).toBe(introducedDoctorPortraitAssetPath);
    for (const fragment of [...packet.html_fragments, ...packet.registration_fragments]) expect(fragment.count).toBe(1);
    expect(execFileSync("git", ["ls-tree", "--name-only", baseline, "--", introducedDoctorPortraitAssetPath, introDetailsPhotoFixturePath], { cwd: root, encoding: "utf8" })).toBe("");
    expect(read(introducedDoctorPortraitAssetPath).length).toBeGreaterThan(0);
  });

  it.each([intakePath, introDetailsPhotoRegistrationPath])("restores the complete %s byte-for-byte to 0648c6e3", path => {
    expect(inverseApprovedIntroDetailsPhoto(path, read(path))).toBe(old(path));
  });

  it("rejects a missing or duplicated approved fragment instead of hiding unexpected edits", () => {
    for (const [path, fragments] of [[intakePath, packet.html_fragments], [introDetailsPhotoRegistrationPath, packet.registration_fragments]] as const) {
      const source = read(path);
      for (const fragment of fragments) {
        const groupFragments: Fragment[] = JSON.parse(read(glp1CombinedFixturePath)).fragments;
        const nestedInGroupWrapper = path === intakePath && groupFragments.some(group => group.new.includes(fragment.new));
        expect(() => inverseApprovedIntroDetailsPhoto(path, source.replace(fragment.new, fragment.old))).toThrow(nestedInGroupWrapper ? "Unexpected authorized GLP-1 fragment count" : "Unexpected authorized intro-details-photo source fragment count");
        expect(() => inverseApprovedIntroDetailsPhoto(path, source + fragment.new)).toThrow("Unexpected authorized intro-details-photo source fragment count");
      }
      expect(inverseApprovedIntroDetailsPhoto(path, source + "\nUNAPPROVED")).not.toBe(old(path));
    }
    expect(inverseApprovedIntroDetailsPhoto("client/public/intake/sign-forms-ui.js", "unchanged")).toBe("unchanged");
    expect(inverseApprovedIntroDetailsPhoto(introducedDoctorPortraitAssetPath, "unchanged")).toBe("unchanged");
    const source = read(intakePath);
    expect(inverseApprovedSigningConnectionCopy(intakePath, source)).toBe(execFileSync("git", ["show", `0c5f2ca4:${intakePath}`], { cwd: root, encoding: "utf8" }));
    for (const fragment of approvedSigningConnectionHtmlFragments) {
      expect(() => inverseApprovedIntroDetailsPhoto(intakePath, source.replace(fragment.new, fragment.old))).toThrow("Unexpected authorized signing-connection source fragment count");
      expect(() => inverseApprovedIntroDetailsPhoto(intakePath, source + fragment.new)).toThrow("Unexpected authorized signing-connection source fragment count");
    }
    expect(inverseApprovedSigningConnectionCopy("client/public/intake/sign-forms-ui.js", "unchanged")).toBe("unchanged");
  });

  it("permits only intake HTML, the additive registration, and the exact introduced portrait asset from 0648c6e3", () => {
    const scope = ["client", "server", "shared", "package.json", "pnpm-lock.yaml", "vite.config.ts", "drizzle"];
    const paths = [
      ...execFileSync("git", ["diff", "--name-only", baseline, "--", ...scope], { cwd: root, encoding: "utf8" }).trim().split("\n"),
      ...execFileSync("git", ["ls-files", "--others", "--exclude-standard", "--", ...scope], { cwd: root, encoding: "utf8" }).trim().split("\n"),
    ].filter(Boolean).filter(p => p !== compactMembershipFixturePath || inverseApprovedV2CompactMembership(p, "") !== "").filter(p => { const hash = p === "server/fixtures/v2RemoveCareSection.json" ? "b61356f9c7050f63cf37b5814469f4ab6029df8fa772947308cf1a0deb2f0c8c" : p === "server/fixtures/v2RemoveCareSectionScope.ts" ? "02689bf7ccb341f0976c77a78c9e291bc2343c5f4e65321017eda219a22d7bc5" : p === "server/fixtures/v2FooterLogoScope.ts" ? "2b2c90128a438022efef3785c2262a529b8a5a25ed6be9e426a89c21b9675391" : p === "server/fixtures/v2TestimonialReadMoreScope.ts" ? "e7e3f1411a7b683859dbea1fdef49adc2af488e503cd8d3acc8f3712790342a8" : null; if (!hash) return true; expect(createHash("sha256").update(readFileSync(resolve(root, p), "utf8")).digest("hex")).toBe(hash); return false; }).filter(p => p !== membershipFixturePath || inverseApprovedV2Membership(p, "") !== "")
      .filter(p => !["client/src/pages/WeightLossMenopauseV2.tsx", "client/src/pages/WeightLossMenopauseV2.css", "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx", "client/src/pages/WeightLossMenopauseV2MobileBar.tsx"].includes(p) || inverseApprovedV2HeroQuestion(p, readFileSync(resolve(process.cwd(), p), "utf8")) !== execFileSync("git", ["show", String(baseline) + ":" + p], { cwd: process.cwd(), encoding: "utf8" }))
      .filter(p => !verifyApprovedHormoneSymptomQuizAsset(p, readFileSync(resolve(process.cwd(), p), "utf8")))
      .filter(p => !["client/src/App.tsx", "server/_core/index.ts"].includes(p) || inverseApprovedFinalProgressLabel(p, readFileSync(resolve(process.cwd(), p), "utf8")) !== execFileSync("git", ["show", `0648c6e3:${p}`], { cwd: process.cwd(), encoding: "utf8" }))
      .filter(path => !approvedThankYouWordingPaths.some(approvedPath => approvedPath === path) || inverseApprovedThankYouWording(path, read(path)) !== old(path))
      .filter(path => !/\.test\.[cm]?[jt]sx?$/.test(path) && ![introDetailsPhotoFixturePath, "server/fixtures/intakeLatePatientInfoFragments.json", thankYouWordingFixturePath, glp1CombinedFixturePath, glp1CombinedAssetPath, progressFixturePath, progressAssetPath, shippingSkipFixturePath, finalProgressLabelFixturePath].includes(path))
      .filter(path => path !== "server/intakeSubmissionContract.ts" || inverseApprovedIntroDetailsPhoto(path, read(path)) !== old(path));
    expect([...new Set(paths)].sort()).toEqual([intakePath, introDetailsPhotoRegistrationPath, introducedDoctorPortraitAssetPath].sort());
  });
});
