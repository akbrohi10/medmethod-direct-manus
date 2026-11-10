import { inverseApprovedV2HeroQuestion } from "./weightLossMenopauseV2HeroQuestion.test"; import { inverseApprovedV2Membership, membershipFixturePath } from "./weightLossMenopauseV2Membership.test"; import { compactMembershipFixturePath, inverseApprovedV2CompactMembership } from "./weightLossMenopauseV2CompactMembership.test"; import { inverseHormoneQuizIntegration } from "./fixtures/hormoneQuizIntegrationScope"; import { readFileSync as integrationReadFileSync } from "node:fs"; import { createHash as integrationCreateHash } from "node:crypto"; import { inverseHormoneQuizGhlAnswerBlock } from "./fixtures/hormoneQuizGhlAnswerBlockScope"; import { inverseHormoneQuizSubmissionOrigin } from "./fixtures/hormoneQuizSubmissionOriginScope"; import { inverseHormoneQuizPrivacy } from "./fixtures/hormoneQuizPrivacyScope";
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

const read = (path: string) => inverseHormoneQuizIntegration(path, inverseHormoneQuizPrivacy(path, readFileSync(resolve(root, path), "utf8")));
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
    ].filter(p => { const approvedSHA = p === "server/fixtures/hormoneQuizPrivacyScope.ts" ? "589a41f28d49b6bdc2dec9149f7dbfe996bdd0f0a5389fcf1d4ee501b04fb156" : p === "server/hormoneQuizPrivacy.test.ts" ? "ab258e67b82562ae04298394dba34c0bf021541fb6b452331509a9fb0e742e0c" : p === "server/fixtures/hormoneQuizSubmissionOriginScope.ts" ? "634e49eadc1c3ac7c3572582124b68b7db3543a642de13124a384794e1a9b905" : p === "server/fixtures/hormoneQuizGhlAnswerBlockScope.ts" ? "36bad6875b176d1d7cb671b38e64d53f352f38fb3a42969fcb98b9f4b48058b3" : p === "server/fixtures/hormoneQuizIntegrationScope.ts" ? "c213c08ee14e7d5195640881e15390d7ef3a35a13d71d153019e061f9711b80f" : p === "client/quiz-webhook-transport.ts" ? "1b0ab7d0d2f64e88a84b967159711d6033d79320baeef5b38c81845279e4cc3e" : p === "client/src/components/AdminQuizWebhooks.tsx" ? "1a4a4ea0221a621a95fdd1647c179dda582d83277ec70dedee7764b4fbb6d25f" : p === "drizzle/0018_greedy_moonstone.sql" ? "b38e984d44625730eaebca8ebfbe92c622897e7b776f2601b2b3affb427266f2" : p === "drizzle/meta/0018_snapshot.json" ? "aacbfbb9c0b8aa07bba06e7b6dc8adbd628edac958f5674c08c500d30c4c5680" : p === "server/hormoneQuizModel.ts" ? "969021c16190e99ecdb338049c10f7dcff9729293ae1509e1049544e3b3b201f" : p === "server/hormoneQuizPdf.ts" ? "8dfc2c0f606ac64d65dd3619bcba5f44297e8c11a90a3777e55c260067b2615c" : p === "server/hormoneQuizPrivateReport.ts" ? "0b09d70a1da392697b7c17e5c55c4a0c8c4cc244e96bed1afdac8c1aa68dc834" : p === "server/hormoneQuizRoutes.ts" ? "713d5f0a7c63f78ba6b24401779256d2dc4a68803b0eda6779e0c7eda6556e02" : p === "server/hormoneQuizSecurity.ts" ? "39d4b6330fb8c1d8967133d88e170a697416a95fc240cce8bf75dcf326e3bb9b" : p === "server/hormoneQuizService.ts" ? "ae03caf253af04e89b990dbfc515eda6e945f8a69b2e32fbf37532af52113b24" : p === "server/hormoneQuizStore.ts" ? "7a01d7245f73a051e886774b10e8893a31aaaad9b301c6bc31fd78ff22ce9d6a" : p === "server/routers/hormoneQuiz.ts" ? "1c1404a42c9e1d89c19440bd0533c0267a1fcd9636068b2491c22da29efbe9a6" : null; if (approvedSHA) { expect(integrationCreateHash("sha256").update(inverseHormoneQuizGhlAnswerBlock(p, inverseHormoneQuizSubmissionOrigin(p, inverseHormoneQuizPrivacy(p, integrationReadFileSync(resolve(process.cwd(), p), "utf8"))))).digest("hex")).toBe(approvedSHA); return false; } const baselineSHA = p === ".gitignore" ? "b4572613f7e7b7827f8dd1c7543b03f903082ba146ebe8115dd9bd81aebd4bee" : p === "client/src/pages/AdminSettings.tsx" ? "1fb9dc9c6c5a2f9be62dbf2bc8bfde870a4b3a41a32d767011d8d3cb57e3643b" : p === "drizzle/meta/_journal.json" ? "95c6b9bfc4ee56f65a5b59ee60ac9507746dee6e4bb0425ee397377ff653373b" : p === "drizzle/schema.ts" ? "b1b087b3c94cbd5c3a5395358b72b4e1c682b33317ebae806a2e962e7c9b3530" : p === "package.json" ? "9026530d7237c3303799cda328f2d3cc488e74cbc35d73df6b190a428b99bd42" : p === "server/_core/index.ts" ? "14ad2b6e75c8efb044e803f70d2239a7f87e5476219bd21f15b8b956fab2deeb" : p === "server/routers.ts" ? "4f89f8904bf00da655ee411ef26c721503af3083843bc1b92823b82b0161e116" : null; if (baselineSHA) { expect(integrationCreateHash("sha256").update(inverseHormoneQuizIntegration(p, inverseHormoneQuizGhlAnswerBlock(p, inverseHormoneQuizSubmissionOrigin(p, inverseHormoneQuizPrivacy(p, integrationReadFileSync(resolve(process.cwd(), p), "utf8")))))).digest("hex")).toBe(baselineSHA); return ![".gitignore", "client/src/pages/AdminSettings.tsx", "drizzle/meta/_journal.json", "drizzle/schema.ts", "package.json", "server/routers.ts"].includes(p); } return true; }).filter(Boolean).filter(p => p !== compactMembershipFixturePath || inverseApprovedV2CompactMembership(p, "") !== "").filter(p => { const hash = p === "server/fixtures/v2RemoveCareSection.json" ? "b61356f9c7050f63cf37b5814469f4ab6029df8fa772947308cf1a0deb2f0c8c" : p === "server/fixtures/v2RemoveCareSectionScope.ts" ? "02689bf7ccb341f0976c77a78c9e291bc2343c5f4e65321017eda219a22d7bc5" : p === "server/fixtures/v2FooterLogoScope.ts" ? "2b2c90128a438022efef3785c2262a529b8a5a25ed6be9e426a89c21b9675391" : p === "server/fixtures/v2TestimonialReadMoreScope.ts" ? "e7e3f1411a7b683859dbea1fdef49adc2af488e503cd8d3acc8f3712790342a8" : p === "server/fixtures/v2TestimonialTextActionScope.ts" ? "b64ca0e8da32e70e2e97da930e4d1a5e4e51b35df12b4ab81a34a29d42761c7c" : p === "server/fixtures/v2TestimonialAttributionScope.ts" ? "289a41016d926e29ea901349023bb373dfd7e17fde3c427e57fdbb63ffd7a18c" : p === "server/fixtures/hormoneQuizTreatmentCtaScope.ts" ? "4e2c90b2879cb08ced0129214db38f67751ec239632f99f353dd371e61b93668" : p === "server/fixtures/hormoneQuizPanelScope.ts" ? "f3e3c8f12ba66965de9fca2140e1842b43d6865b7f833a9e49485bbc4b9c4798" : p === "server/fixtures/hormoneQuizPhoneScope.ts" ? "a1da7935b8aa5a94ea012f6b194339943f31bf799a066ed562bfba3c058fcb25" : null; if (!hash) return true; expect(createHash("sha256").update(inverseHormoneQuizIntegration(p, inverseHormoneQuizPrivacy(p, readFileSync(resolve(root, p), "utf8")))).digest("hex")).toBe(hash); return false; }).filter(p => p !== membershipFixturePath || inverseApprovedV2Membership(p, "") !== "")
      .filter(p => !["client/src/pages/WeightLossMenopauseV2.tsx", "client/src/pages/WeightLossMenopauseV2.css", "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx", "client/src/pages/WeightLossMenopauseV2MobileBar.tsx"].includes(p) || inverseApprovedV2HeroQuestion(p, inverseHormoneQuizPrivacy(p, readFileSync(resolve(process.cwd(), p), "utf8"))) !== execFileSync("git", ["show", String(baseline) + ":" + p], { cwd: process.cwd(), encoding: "utf8" }))
      .filter(p => !verifyApprovedHormoneSymptomQuizAsset(p, inverseHormoneQuizPrivacy(p, readFileSync(resolve(process.cwd(), p), "utf8"))))
      .filter(p => !["client/src/App.tsx", "server/_core/index.ts"].includes(p) || inverseApprovedFinalProgressLabel(p, inverseHormoneQuizPrivacy(p, readFileSync(resolve(process.cwd(), p), "utf8"))) !== execFileSync("git", ["show", `0648c6e3:${p}`], { cwd: process.cwd(), encoding: "utf8" }))
      .filter(path => !approvedThankYouWordingPaths.some(approvedPath => approvedPath === path) || inverseApprovedThankYouWording(path, read(path)) !== old(path))
      .filter(path => !/\.test\.[cm]?[jt]sx?$/.test(path) && ![introDetailsPhotoFixturePath, "server/fixtures/intakeLatePatientInfoFragments.json", thankYouWordingFixturePath, glp1CombinedFixturePath, glp1CombinedAssetPath, progressFixturePath, progressAssetPath, shippingSkipFixturePath, finalProgressLabelFixturePath].includes(path))
      .filter(path => path !== "server/intakeSubmissionContract.ts" || inverseApprovedIntroDetailsPhoto(path, read(path)) !== old(path));
    expect([...new Set(paths)].sort()).toEqual([intakePath, introDetailsPhotoRegistrationPath, introducedDoctorPortraitAssetPath].sort());
  });
});
