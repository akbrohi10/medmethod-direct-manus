import { inverseApprovedV2HeroQuestion } from "./weightLossMenopauseV2HeroQuestion.test"; import { inverseApprovedV2Membership, membershipFixturePath } from "./weightLossMenopauseV2Membership.test";
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
    const paths = [...execFileSync('git', ['diff', '--name-only', '24838ad1', '--', ...scope], { cwd: root, encoding: 'utf8' }).split('\n'), ...execFileSync('git', ['ls-files', '--others', '--exclude-standard', '--', ...scope], { cwd: root, encoding: 'utf8' }).split('\n')].filter(p => p && !/\.test\.[cm]?[jt]sx?$/.test(p) && p !== finalProgressLabelFixturePath).filter(p => p !== membershipFixturePath || inverseApprovedV2Membership(p, "") !== "")
      .filter(p => !["client/src/pages/WeightLossMenopauseV2.tsx", "client/src/pages/WeightLossMenopauseV2.css"].includes(p) || inverseApprovedV2HeroQuestion(p, readFileSync(resolve(process.cwd(), p), "utf8")) !== execFileSync("git", ["show", String('24838ad1') + ":" + p], { cwd: process.cwd(), encoding: "utf8" }))
      .filter(p => !verifyApprovedHormoneSymptomQuizAsset(p, readFileSync(resolve(process.cwd(), p), "utf8")))
      .filter(p => !["client/src/App.tsx", "server/_core/index.ts"].includes(p) || inverseApprovedFinalProgressLabel(p, readFileSync(resolve(process.cwd(), p), "utf8")) !== execFileSync("git", ["show", `24838ad1:${p}`], { cwd: process.cwd(), encoding: "utf8" }));
    expect([...new Set(paths)].sort()).toEqual(Object.keys(packet.files).sort());
    for (const path of execFileSync('git', ['ls-tree', '-r', '--name-only', '24838ad1', '--', 'server/fixtures'], { cwd: root, encoding: 'utf8' }).trim().split('\n')) expect(read(path)).toBe(old(path));
  });
});
