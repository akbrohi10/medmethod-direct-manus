import { inverseApprovedV2HeroQuestion } from "./weightLossMenopauseV2HeroQuestion.test"; import { inverseApprovedV2Membership, membershipFixturePath } from "./weightLossMenopauseV2Membership.test"; import { compactMembershipFixturePath, inverseApprovedV2CompactMembership } from "./weightLossMenopauseV2CompactMembership.test";
import { inverseApprovedHormoneSymptomQuiz, verifyApprovedHormoneSymptomQuizAsset } from "./hormoneSymptomQuizScope.test";
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
const root = resolve(import.meta.dirname, '..');
export const finalProgressLabelFixturePath = 'server/fixtures/intakeFinalProgressLabelFragments.json';
const raw = readFileSync(resolve(root, finalProgressLabelFixturePath), 'utf8');
const hash = '7ce32085219791c0baf1c9361377def8f22e400c6d79aad1bbef9c559525139f';
type Fragment = { old: string; new: string; count: number };
const packet: { baseline: string; files: Record<string, Fragment[]> } = JSON.parse(raw);
if (createHash('sha256').update(raw).digest('hex') !== hash || packet.baseline !== '24838ad1' || Object.keys(packet.files).sort().join('|') !== 'client/intake/index.html|client/public/intake/progress.js' || Object.values(packet.files).some(fs => fs.length !== 1 || fs[0].count !== 1 || !fs[0].old || !fs[0].new || fs[0].old === fs[0].new)) throw new Error('Unexpected approved final progress label packet');
export function inverseApprovedFinalProgressLabel(path: string, source: string) {
  source = inverseApprovedHormoneSymptomQuiz(path, source);
  for (const fragment of packet.files[path] ?? []) {
    if (source.split(fragment.new).length - 1 !== fragment.count) throw new Error('Unexpected authorized final progress label fragment count');
    source = source.split(fragment.new).join(fragment.old);
  }
  return source;
}
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');
const old = (p: string) => execFileSync('git', ['show', `24838ad1:${p}`], { cwd: root, encoding: 'utf8' });
describe('final-screen-only progress label exact scope', () => {
  it('freezes the packet and restores both entire production files', () => {
    expect(createHash('sha256').update(raw).digest('hex')).toBe(hash);
    for (const path of Object.keys(packet.files)) expect(inverseApprovedFinalProgressLabel(path, read(path))).toBe(old(path));
  });
  it('rejects missing/duplicate fragments and preserves unrelated-change detection', () => {
    for (const [path, fragments] of Object.entries(packet.files)) {
      const source = read(path), fragment = fragments[0];
      expect(() => inverseApprovedFinalProgressLabel(path, source.replace(fragment.new, fragment.old))).toThrow('Unexpected authorized final progress label fragment count');
      expect(() => inverseApprovedFinalProgressLabel(path, source + fragment.new)).toThrow('Unexpected authorized final progress label fragment count');
      expect(inverseApprovedFinalProgressLabel(path, source + '\nUNAPPROVED')).not.toBe(old(path));
    }
    expect(inverseApprovedFinalProgressLabel('server/intakeSubmissionContract.ts', 'unchanged')).toBe('unchanged');
  });
  it('retains all prior fixtures and allows only the label expression and cache key in production', () => {
    const scope = ['client', 'server', 'shared', 'drizzle', 'package.json', 'pnpm-lock.yaml', 'vite.config.ts'];
    const paths = [...execFileSync('git', ['diff', '--name-only', '24838ad1', '--', ...scope], { cwd: root, encoding: 'utf8' }).split('\n'), ...execFileSync('git', ['ls-files', '--others', '--exclude-standard', '--', ...scope], { cwd: root, encoding: 'utf8' }).split('\n')].filter(p => p && !/\.test\.[cm]?[jt]sx?$/.test(p) && p !== finalProgressLabelFixturePath).filter(p => p !== compactMembershipFixturePath || inverseApprovedV2CompactMembership(p, "") !== "").filter(p => { const hash = p === "server/fixtures/v2RemoveCareSection.json" ? "b61356f9c7050f63cf37b5814469f4ab6029df8fa772947308cf1a0deb2f0c8c" : p === "server/fixtures/v2RemoveCareSectionScope.ts" ? "02689bf7ccb341f0976c77a78c9e291bc2343c5f4e65321017eda219a22d7bc5" : p === "server/fixtures/v2FooterLogoScope.ts" ? "2b2c90128a438022efef3785c2262a529b8a5a25ed6be9e426a89c21b9675391" : p === "server/fixtures/v2TestimonialReadMoreScope.ts" ? "e7e3f1411a7b683859dbea1fdef49adc2af488e503cd8d3acc8f3712790342a8" : p === "server/fixtures/v2TestimonialTextActionScope.ts" ? "b64ca0e8da32e70e2e97da930e4d1a5e4e51b35df12b4ab81a34a29d42761c7c" : null; if (!hash) return true; expect(createHash("sha256").update(readFileSync(resolve(root, p), "utf8")).digest("hex")).toBe(hash); return false; }).filter(p => p !== membershipFixturePath || inverseApprovedV2Membership(p, "") !== "")
      .filter(p => !["client/src/pages/WeightLossMenopauseV2.tsx", "client/src/pages/WeightLossMenopauseV2.css", "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx", "client/src/pages/WeightLossMenopauseV2MobileBar.tsx"].includes(p) || inverseApprovedV2HeroQuestion(p, readFileSync(resolve(process.cwd(), p), "utf8")) !== execFileSync("git", ["show", String('24838ad1') + ":" + p], { cwd: process.cwd(), encoding: "utf8" }))
      .filter(p => !verifyApprovedHormoneSymptomQuizAsset(p, readFileSync(resolve(process.cwd(), p), "utf8")))
      .filter(p => !["client/src/App.tsx", "server/_core/index.ts"].includes(p) || inverseApprovedFinalProgressLabel(p, readFileSync(resolve(process.cwd(), p), "utf8")) !== execFileSync("git", ["show", `24838ad1:${p}`], { cwd: process.cwd(), encoding: "utf8" }));
    expect([...new Set(paths)].sort()).toEqual(Object.keys(packet.files).sort());
    for (const path of execFileSync('git', ['ls-tree', '-r', '--name-only', '24838ad1', '--', 'server/fixtures'], { cwd: root, encoding: 'utf8' }).trim().split('\n')) expect(read(path)).toBe(old(path));
  });
});
