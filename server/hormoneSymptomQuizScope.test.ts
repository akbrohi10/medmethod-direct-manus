import { inverseApprovedV2HeroQuestion } from "./weightLossMenopauseV2HeroQuestion.test"; import { inverseApprovedV2Membership, membershipFixturePath } from "./weightLossMenopauseV2Membership.test"; import { compactMembershipFixturePath, inverseApprovedV2CompactMembership } from "./weightLossMenopauseV2CompactMembership.test";
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { inverseApprovedQuizDemo, verifyApprovedQuizDemoAsset } from './hormoneSymptomQuizDemoScope.test';
const root = resolve(import.meta.dirname, '..');
export const hormoneSymptomQuizFixturePath = 'server/fixtures/hormoneSymptomQuizFragments.json';
export const hormoneSymptomQuizHtmlPath = 'client/public/hormone-symptom-quiz.html';
const packetRaw = readFileSync(resolve(root, hormoneSymptomQuizFixturePath), 'utf8');
const packetHash = '37c3033c286ff9b1e096c0cb42bddc87860083e35e518e43b484f6587c6156e9';
export const hormoneSymptomQuizHtmlHash = 'db2679e2347857f1e282234f6324a12b4536a409ff4c65d83884a475ba7af845';
type Fragment = { old: string; new: string; count: number };
const packet: { baseline: string; html_sha256: string; files: Record<string, Fragment[]> } = JSON.parse(packetRaw);
const hash = (s: string | Buffer) => createHash('sha256').update(s).digest('hex');
if (hash(packetRaw) !== packetHash || packet.baseline !== '48d614b7' || packet.html_sha256 !== hormoneSymptomQuizHtmlHash || Object.keys(packet.files).sort().join('|') !== 'client/src/App.tsx|server/_core/index.ts' || Object.values(packet.files).flat().length !== 4 || Object.values(packet.files).flat().some(f => f.count !== 1 || !f.old || !f.new || f.old === f.new)) throw new Error('Unexpected approved standalone hormone quiz packet');
export function inverseApprovedHormoneSymptomQuiz(path: string, source: string): string {
  for (const f of [...(packet.files[path] ?? [])].reverse()) {
    if (source.split(f.new).length - 1 !== 1) throw new Error('Unexpected authorized hormone quiz fragment count');
    source = source.replace(f.new, f.old);
  }
  return source;
}
export function verifyApprovedHormoneSymptomQuizAsset(path: string, source: string): boolean {
  if (verifyApprovedQuizDemoAsset(path, source)) return true;
  if (path !== hormoneSymptomQuizHtmlPath && path !== hormoneSymptomQuizFixturePath) return false;
  if (path === hormoneSymptomQuizHtmlPath) source = inverseApprovedQuizDemo(path, source);
  if (hash(source) !== (path === hormoneSymptomQuizHtmlPath ? hormoneSymptomQuizHtmlHash : packetHash)) throw new Error('Unexpected authorized hormone quiz asset');
  return true;
}
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');
const old = (p: string) => execFileSync('git', ['show', `48d614b7:${p}`], { cwd: root, encoding: 'utf8' });
describe('exact standalone hormone quiz import scope', () => {
  it('preserves supplied HTML byte-for-byte at a frozen original hash', () => {
    expect(hash(inverseApprovedQuizDemo(hormoneSymptomQuizHtmlPath, read(hormoneSymptomQuizHtmlPath)))).toBe(hormoneSymptomQuizHtmlHash);
    expect(verifyApprovedHormoneSymptomQuizAsset(hormoneSymptomQuizHtmlPath, read(hormoneSymptomQuizHtmlPath))).toBe(true);
    expect(() => verifyApprovedHormoneSymptomQuizAsset(hormoneSymptomQuizHtmlPath, read(hormoneSymptomQuizHtmlPath) + '\n')).toThrow('Unexpected authorized hormone quiz asset');
  });
  it('restores both existing integration files exactly with only four authorized additions', () => {
    expect(hash(packetRaw)).toBe(packetHash);
    for (const p of Object.keys(packet.files)) expect(inverseApprovedHormoneSymptomQuiz(p, read(p))).toBe(old(p));
  });
  it('rejects missing/duplicate hooks and preserves detection of unrelated changes', () => {
    for (const [path, fragments] of Object.entries(packet.files)) {
      for (const f of fragments) {
        expect(() => inverseApprovedHormoneSymptomQuiz(path, read(path).replace(f.new, f.old))).toThrow('Unexpected authorized hormone quiz fragment count');
        expect(() => inverseApprovedHormoneSymptomQuiz(path, read(path) + '\n' + f.new)).toThrow('Unexpected authorized hormone quiz fragment count');
      }
      expect(inverseApprovedHormoneSymptomQuiz(path, read(path) + '\nUNAPPROVED')).not.toBe(old(path));
    }
    expect(inverseApprovedHormoneSymptomQuiz('client/intake/index.html', 'unchanged')).toBe('unchanged');
  });
  it('changes no other production file, original question, payment or intake asset', () => {
    const scope = ['client', 'server', 'shared', 'drizzle', 'vite.config.ts', 'package.json', 'pnpm-lock.yaml'];
    const paths = [...execFileSync('git', ['diff', '--name-only', '48d614b7', '--', ...scope], { cwd: root, encoding: 'utf8' }).split('\n'), ...execFileSync('git', ['ls-files', '--others', '--exclude-standard', '--', ...scope], { cwd: root, encoding: 'utf8' }).split('\n')].filter(p => p && !/\.test\.[cm]?[jt]sx?$/.test(p) && !verifyApprovedHormoneSymptomQuizAsset(p, read(p))).filter(p => p !== compactMembershipFixturePath || inverseApprovedV2CompactMembership(p, "") !== "").filter(p => { const hash = p === "server/fixtures/v2RemoveCareSection.json" ? "b61356f9c7050f63cf37b5814469f4ab6029df8fa772947308cf1a0deb2f0c8c" : p === "server/fixtures/v2RemoveCareSectionScope.ts" ? "02689bf7ccb341f0976c77a78c9e291bc2343c5f4e65321017eda219a22d7bc5" : p === "server/fixtures/v2FooterLogoScope.ts" ? "2b2c90128a438022efef3785c2262a529b8a5a25ed6be9e426a89c21b9675391" : p === "server/fixtures/v2TestimonialReadMoreScope.ts" ? "e7e3f1411a7b683859dbea1fdef49adc2af488e503cd8d3acc8f3712790342a8" : p === "server/fixtures/v2TestimonialTextActionScope.ts" ? "b64ca0e8da32e70e2e97da930e4d1a5e4e51b35df12b4ab81a34a29d42761c7c" : p === "server/fixtures/v2TestimonialAttributionScope.ts" ? "289a41016d926e29ea901349023bb373dfd7e17fde3c427e57fdbb63ffd7a18c" : null; if (!hash) return true; expect(createHash("sha256").update(readFileSync(resolve(root, p), "utf8")).digest("hex")).toBe(hash); return false; }).filter(p => p !== membershipFixturePath || inverseApprovedV2Membership(p, "") !== "")
      .filter(p => !["client/src/pages/WeightLossMenopauseV2.tsx", "client/src/pages/WeightLossMenopauseV2.css", "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx", "client/src/pages/WeightLossMenopauseV2MobileBar.tsx"].includes(p) || inverseApprovedV2HeroQuestion(p, readFileSync(resolve(process.cwd(), p), "utf8")) !== execFileSync("git", ["show", String('48d614b7') + ":" + p], { cwd: process.cwd(), encoding: "utf8" }));
    expect([...new Set(paths)].sort()).toEqual(Object.keys(packet.files).sort());
    for (const path of execFileSync('git', ['ls-tree', '-r', '--name-only', '48d614b7', '--', 'server/fixtures'], { cwd: root, encoding: 'utf8' }).trim().split('\n')) expect(read(path)).toBe(old(path));
  });
});
