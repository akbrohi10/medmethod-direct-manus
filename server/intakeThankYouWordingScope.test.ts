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

const root = resolve(import.meta.dirname, "..");
const baseline = "76d1479d";
export const thankYouWordingFixturePath = "server/fixtures/intakeThankYouWordingFragments.json";
export const approvedThankYouWordingPaths = Object.freeze([
  "client/intake/thank-you/index.html",
  "client/public/intake/video-visit.js",
] as const);
type Fragment = Readonly<{ old: string; new: string; count: number }>;
type Packet = { baseline: string; files: Record<string, readonly Fragment[]> };
const packetSource = readFileSync(resolve(root, thankYouWordingFixturePath), "utf8");
const packetHash = "b76ab43d01ba6fda7b586a050b74d87b53e23cf98032aa06d7ce29fbaed8adf3";
const packet: Packet = JSON.parse(packetSource);
if (
  createHash("sha256").update(packetSource).digest("hex") !== packetHash ||
  Object.keys(packet).sort().join(",") !== "baseline,files" ||
  packet.baseline !== baseline ||
  Object.keys(packet.files).sort().join(",") !== [...approvedThankYouWordingPaths].sort().join(",") ||
  packet.files[approvedThankYouWordingPaths[0]].length !== 12 ||
  packet.files[approvedThankYouWordingPaths[1]].length !== 3 ||
  approvedThankYouWordingPaths.some(path => packet.files[path].some((fragment, index) =>
    Object.keys(fragment).sort().join(",") !== "count,new,old" ||
    fragment.count !== (path === approvedThankYouWordingPaths[0] && index === 4 ? 2 : 1) ||
    !fragment.old || !fragment.new || fragment.old === fragment.new,
  ))
) throw new Error("Unexpected approved thank-you wording packet");
for (const fragments of Object.values(packet.files)) {
  for (const fragment of fragments) Object.freeze(fragment);
  Object.freeze(fragments);
}
Object.freeze(packet.files);
Object.freeze(packet);

/** Reverse only the frozen approved fragments on the two exact thank-you source paths. */
export function inverseApprovedThankYouWording(path: string, source: string): string {
  if (!approvedThankYouWordingPaths.some(approvedPath => approvedPath === path)) return source;
  for (const fragment of [...packet.files[path]].reverse()) {
    if (source.split(fragment.new).length - 1 !== fragment.count) {
      throw new Error("Unexpected authorized thank-you wording source fragment count");
    }
    source = source.split(fragment.new).join(fragment.old);
  }
  return source;
}

const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const old = (path: string) => execFileSync("git", ["show", `${baseline}:${path}`], { cwd: root, encoding: "utf8" });

// Independently pin these later intake-only display packets; importing the intro helper would be circular.
const intakeFixturePath = "server/fixtures/intakeLatePatientInfoFragments.json";
const intakeFixtureSource = read(intakeFixturePath);
const intakeFragments: Fragment[] = JSON.parse(intakeFixtureSource);
const signingPrefixSource = execFileSync("git", ["show", `0c5f2ca4:${intakeFixturePath}`], { cwd: root, encoding: "utf8" });
const signingPrefix: Fragment[] = JSON.parse(signingPrefixSource);
const approvedShippingApprovalHtmlFragments = intakeFragments.slice(55, 59);
const approvedSigningConnectionHtmlFragments = intakeFragments.slice(59);
if (intakeFragments.length !== 61 || signingPrefix.length !== 59 || createHash("sha256").update(signingPrefixSource).digest("hex") !== "145fcb1a162123ea36bb8ae756e34af543170837083a44ca34a64abb555789b8" || !signingPrefixSource.endsWith("\n]\n") || !intakeFixtureSource.startsWith(signingPrefixSource.slice(0, -3) + ",\n") || JSON.stringify(intakeFragments.slice(0, 59)) !== JSON.stringify(signingPrefix) || createHash("sha256").update(JSON.stringify(intakeFragments.slice(0, 59))).digest("hex") !== "fd64a544685dc810b04f74693ca9500ad5201b29bdf43e69cda0686c60030bff" || createHash("sha256").update(JSON.stringify(approvedShippingApprovalHtmlFragments)).digest("hex") !== "b70076ac088a824631b71d29b377d6091dae82e0f2e11c5bd2f31309df92f867" || approvedSigningConnectionHtmlFragments.length !== 2 || createHash("sha256").update(JSON.stringify(approvedSigningConnectionHtmlFragments)).digest("hex") !== "7fc4a428667945db527fe1169448c6cb49ed7fc27097ed773f997ecc586446da" || [...approvedShippingApprovalHtmlFragments, ...approvedSigningConnectionHtmlFragments].some(fragment => Object.keys(fragment).sort().join(",") !== "count,new,old" || fragment.count !== 1 || !fragment.old || !fragment.new || fragment.old === fragment.new)) {
  throw new Error("Unexpected approved later intake display fragments");
}
for (const fragments of [approvedShippingApprovalHtmlFragments, approvedSigningConnectionHtmlFragments]) {
  for (const fragment of fragments) Object.freeze(fragment);
  Object.freeze(fragments);
}
function inverseApprovedSigningConnectionCopy(path: string, source: string): string {
  if (path !== "client/intake/index.html") return source;
  source = inverseApprovedGlp1Combined(path, source);
  for (const fragment of [...approvedSigningConnectionHtmlFragments].reverse()) {
    if (source.split(fragment.new).length - 1 !== fragment.count) throw new Error("Unexpected authorized signing-connection source fragment count");
    source = source.split(fragment.new).join(fragment.old);
  }
  return source;
}
function inverseApprovedShippingApprovalWording(path: string, source: string): string {
  if (path !== "client/intake/index.html") return source;
  source = inverseApprovedSigningConnectionCopy(path, source);
  for (const fragment of [...approvedShippingApprovalHtmlFragments].reverse()) {
    if (source.split(fragment.new).length - 1 !== fragment.count) throw new Error("Unexpected authorized shipping-approval source fragment count");
    source = source.split(fragment.new).join(fragment.old);
  }
  return source;
}

describe("thank-you wording exact production scope", () => {
  it("freezes the exact twelve-HTML/three-client packet with thirteen HTML occurrences and introduced fixture path", () => {
    expect(createHash("sha256").update(read(thankYouWordingFixturePath)).digest("hex")).toBe(packetHash);
    expect(Object.keys(packet).sort()).toEqual(["baseline", "files"]);
    expect(packet.baseline).toBe(baseline);
    expect(Object.keys(packet.files).sort()).toEqual([...approvedThankYouWordingPaths].sort());
    expect(packet.files[approvedThankYouWordingPaths[0]]).toHaveLength(12);
    expect(packet.files[approvedThankYouWordingPaths[0]].map(fragment => fragment.count)).toEqual([1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1]);
    expect(packet.files[approvedThankYouWordingPaths[0]].reduce((total, fragment) => total + fragment.count, 0)).toBe(13);
    expect(packet.files[approvedThankYouWordingPaths[1]]).toHaveLength(3);
    expect(packet.files[approvedThankYouWordingPaths[1]].map(fragment => fragment.count)).toEqual([1, 1, 1]);
    expect(execFileSync("git", ["ls-tree", "--name-only", baseline, "--", thankYouWordingFixturePath], { cwd: root, encoding: "utf8" })).toBe("");
  });

  it.each(approvedThankYouWordingPaths)("restores the complete %s byte-for-byte to 76d1479d", path => {
    expect(inverseApprovedThankYouWording(path, read(path))).toBe(old(path));
  });

  it("rejects missing and duplicated fragments and leaves unexpected edits visible", () => {
    for (const path of approvedThankYouWordingPaths) {
      const source = read(path);
      for (const fragment of packet.files[path]) {
        let visible = fragment.new;
        for (const later of packet.files[path]) if (later.old === visible) visible = later.new;
        expect(source.split(visible).length - 1).toBe(fragment.count);
        expect(() => inverseApprovedThankYouWording(path, source.replace(visible, fragment.old))).toThrow("Unexpected authorized thank-you wording source fragment count");
        expect(() => inverseApprovedThankYouWording(path, source + visible)).toThrow("Unexpected authorized thank-you wording source fragment count");
      }
      expect(inverseApprovedThankYouWording(path, source + "\nUNAPPROVED")).not.toBe(old(path));
    }
    for (const path of ["client/intake/index.html", "client/public/intake/sign-forms-ui.js", thankYouWordingFixturePath, "client/intake/thank-you/index.html.extra"]) {
      expect(inverseApprovedThankYouWording(path, "unchanged")).toBe("unchanged");
    }
  });

  it("permits no production change beyond the exact two inverses and introduced packet from 76d1479d", () => {
    const scope = ["client", "server", "shared", "package.json", "pnpm-lock.yaml", "vite.config.ts", "drizzle"];
    const paths = [...new Set([
      ...execFileSync("git", ["diff", "--name-only", baseline, "--", ...scope], { cwd: root, encoding: "utf8" }).split("\n"),
      ...execFileSync("git", ["ls-files", "--others", "--exclude-standard", "--", ...scope], { cwd: root, encoding: "utf8" }).split("\n"),
    ])].filter(Boolean).filter(p => p !== compactMembershipFixturePath || inverseApprovedV2CompactMembership(p, "") !== "").filter(p => p !== membershipFixturePath || inverseApprovedV2Membership(p, "") !== "")
      .filter(p => !["client/src/pages/WeightLossMenopauseV2.tsx", "client/src/pages/WeightLossMenopauseV2.css", "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx", "client/src/pages/WeightLossMenopauseV2MobileBar.tsx"].includes(p) || inverseApprovedV2HeroQuestion(p, readFileSync(resolve(process.cwd(), p), "utf8")) !== execFileSync("git", ["show", String(baseline) + ":" + p], { cwd: process.cwd(), encoding: "utf8" }))
      .filter(p => !verifyApprovedHormoneSymptomQuizAsset(p, readFileSync(resolve(process.cwd(), p), "utf8")))
      .filter(p => !["client/src/App.tsx", "server/_core/index.ts"].includes(p) || inverseApprovedFinalProgressLabel(p, readFileSync(resolve(process.cwd(), p), "utf8")) !== execFileSync("git", ["show", `76d1479d:${p}`], { cwd: process.cwd(), encoding: "utf8" })).filter(path => !/\.test\.[cm]?[jt]sx?$/.test(path) && ![thankYouWordingFixturePath, glp1CombinedFixturePath, glp1CombinedAssetPath, progressFixturePath, progressAssetPath, shippingSkipFixturePath, finalProgressLabelFixturePath].includes(path));
    const remaining = paths.filter(path => {
      if (path === "server/intakeSubmissionContract.ts") return inverseApprovedShippingSkip(path, read(path)) !== old(path);
      if (path === "client/intake/index.html") return inverseApprovedShippingApprovalWording(path, read(path)) !== old(path);
      if (path === "server/fixtures/intakeLatePatientInfoFragments.json") {
        const previous = JSON.parse(old(path));
        const current = JSON.parse(read(path));
        expect(previous).toHaveLength(55);
        expect(current).toHaveLength(61);
        expect(current.slice(0, previous.length)).toEqual(previous);
        expect(approvedShippingApprovalHtmlFragments).toHaveLength(4);
        expect(current.slice(previous.length, 59)).toEqual(approvedShippingApprovalHtmlFragments);
        expect(current.slice(0, 59)).toEqual(signingPrefix);
        expect(approvedSigningConnectionHtmlFragments).toHaveLength(2);
        expect(current.slice(59)).toEqual(approvedSigningConnectionHtmlFragments);
        const source = read("client/intake/index.html");
        expect(inverseApprovedSigningConnectionCopy("client/intake/index.html", source)).toBe(execFileSync("git", ["show", "0c5f2ca4:client/intake/index.html"], { cwd: root, encoding: "utf8" }));
        for (const fragment of approvedSigningConnectionHtmlFragments) {
          expect(() => inverseApprovedShippingApprovalWording("client/intake/index.html", source.replace(fragment.new, fragment.old))).toThrow("Unexpected authorized signing-connection source fragment count");
          expect(() => inverseApprovedShippingApprovalWording("client/intake/index.html", source + fragment.new)).toThrow("Unexpected authorized signing-connection source fragment count");
        }
        expect(inverseApprovedSigningConnectionCopy("client/public/intake/sign-forms-ui.js", "unchanged")).toBe("unchanged");
        return false;
      }
      return true;
    });
    expect(remaining.sort()).toEqual([...approvedThankYouWordingPaths].sort());
    expect(remaining.filter(path => inverseApprovedThankYouWording(path, read(path)) !== old(path))).toEqual([]);
  });
});
