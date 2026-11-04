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
const shippingFragments: Fragment[] = JSON.parse(readFileSync(resolve(root, shippingFixturePath), "utf8"));
const previousShippingFragments: Fragment[] = JSON.parse(execFileSync("git", ["show", `1476a622:${shippingFixturePath}`], { cwd: root, encoding: "utf8" }));
export const approvedShippingApprovalHtmlFragments = shippingFragments.slice(previousShippingFragments.length);
if (previousShippingFragments.length !== 55 || shippingFragments.length !== 59 || JSON.stringify(shippingFragments.slice(0, 55)) !== JSON.stringify(previousShippingFragments) || createHash("sha256").update(JSON.stringify(approvedShippingApprovalHtmlFragments)).digest("hex") !== "b70076ac088a824631b71d29b377d6091dae82e0f2e11c5bd2f31309df92f867") {
  throw new Error("Unexpected approved shipping-approval fragments");
}
for (const fragment of approvedShippingApprovalHtmlFragments) Object.freeze(fragment);
Object.freeze(approvedShippingApprovalHtmlFragments);

/** Reverse only the four exact display fragments appended after the unchanged 1476a622 prefix. */
export function inverseApprovedShippingApprovalWording(path: string, source: string): string {
  if (path !== intakePath) return source;
  for (const fragment of [...approvedShippingApprovalHtmlFragments].reverse()) {
    if (source.split(fragment.new).length - 1 !== fragment.count) throw new Error("Unexpected authorized shipping-approval source fragment count");
    source = source.split(fragment.new).join(fragment.old);
  }
  return source;
}

/** Normalize the four approved shipping fragments, then reverse the original exact intro/photo packet. */
export function inverseApprovedIntroDetailsPhoto(path: string, source: string): string {
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
        expect(() => inverseApprovedIntroDetailsPhoto(path, source.replace(fragment.new, fragment.old))).toThrow("Unexpected authorized intro-details-photo source fragment count");
        expect(() => inverseApprovedIntroDetailsPhoto(path, source + fragment.new)).toThrow("Unexpected authorized intro-details-photo source fragment count");
      }
      expect(inverseApprovedIntroDetailsPhoto(path, source + "\nUNAPPROVED")).not.toBe(old(path));
    }
    expect(inverseApprovedIntroDetailsPhoto("client/public/intake/sign-forms-ui.js", "unchanged")).toBe("unchanged");
    expect(inverseApprovedIntroDetailsPhoto(introducedDoctorPortraitAssetPath, "unchanged")).toBe("unchanged");
  });

  it("permits only intake HTML, the additive registration, and the exact introduced portrait asset from 0648c6e3", () => {
    const scope = ["client", "server", "shared", "package.json", "pnpm-lock.yaml", "vite.config.ts", "drizzle"];
    const paths = [
      ...execFileSync("git", ["diff", "--name-only", baseline, "--", ...scope], { cwd: root, encoding: "utf8" }).trim().split("\n"),
      ...execFileSync("git", ["ls-files", "--others", "--exclude-standard", "--", ...scope], { cwd: root, encoding: "utf8" }).trim().split("\n"),
    ].filter(Boolean)
      .filter(path => !approvedThankYouWordingPaths.some(approvedPath => approvedPath === path) || inverseApprovedThankYouWording(path, read(path)) !== old(path))
      .filter(path => !/\.test\.[cm]?[jt]sx?$/.test(path) && ![introDetailsPhotoFixturePath, "server/fixtures/intakeLatePatientInfoFragments.json", thankYouWordingFixturePath].includes(path));
    expect([...new Set(paths)].sort()).toEqual([intakePath, introDetailsPhotoRegistrationPath, introducedDoctorPortraitAssetPath].sort());
  });
});
