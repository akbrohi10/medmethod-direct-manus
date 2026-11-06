import { createHash } from "node:crypto";
import { execFileSync } from 'node:child_process'; import { inverseApprovedV2Membership, membershipFixturePath } from "./weightLossMenopauseV2Membership.test"; import { compactMembershipFixturePath, inverseApprovedV2CompactMembership } from "./weightLossMenopauseV2CompactMembership.test";
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { inverseApprovedV2HeroAssessmentCtaBeforeMembership } from './weightLossMenopauseV2HeroAssessmentCta.test';
import { heroCtaComfortCssPath, inverseApprovedV2HeroCtaComfortBeforeMembership } from './weightLossMenopauseV2HeroCtaComfort.test';
const root = resolve(import.meta.dirname, '..');
export const v2HeroQuestionPagePath = 'client/src/pages/WeightLossMenopauseV2.tsx';
export const v2HeroQuestionBefore = '<h1><span className="hero-headline-line">Text a Weight Loss <span className="hero-ampersand">&amp;</span><br />Hormone Doctor now.</span><span className="hero-headline-line hero-free"><em>First visit FREE!</em></span></h1>';
export const v2HeroQuestionAfter = '<h1><span className="hero-headline-line">Is medical weight loss or hormone therapy right for you?</span><span className="hero-headline-line hero-free"><em>Find out free.</em></span></h1>';
export function inverseApprovedV2HeroQuestion(path: string, source: string): string { return inverseApprovedV2HeroQuestionBeforeMembership(path, inverseApprovedV2Membership(path, source)); } export function inverseApprovedV2HeroQuestionBeforeMembership(path: string, source: string): string {
  source = inverseApprovedV2HeroAssessmentCtaBeforeMembership(path, source);
  if (path !== v2HeroQuestionPagePath) return source;
  if (source.split(v2HeroQuestionAfter).length - 1 !== 1 || source.includes(v2HeroQuestionBefore)) throw new Error('Unexpected approved V2 hero question count');
  return source.replace(v2HeroQuestionAfter, v2HeroQuestionBefore);
}
const read = (p: string) => inverseApprovedV2Membership(p, readFileSync(resolve(root, p), 'utf8'));
const baseline = (p: string) => execFileSync('git', ['show', `eb2ccf4b:${p}`], { cwd: root, encoding: 'utf8' });
describe('V2 hero right-for-you question headline only', () => {
  it('uses the exact approved question and emphasized closing line with no other page change', () => {
    const page = read(v2HeroQuestionPagePath);
    expect(page).toContain(v2HeroQuestionAfter);
    expect(inverseApprovedV2HeroQuestionBeforeMembership(v2HeroQuestionPagePath, page)).toBe(baseline(v2HeroQuestionPagePath));
    expect(page.match(/<h1>/g)).toHaveLength(1);
  });
  it('retains CSS, fonts, supporting copy, phone, CTA and all other production sources byte-for-byte', () => {
    const scope = ['client', 'server', 'shared', 'drizzle', 'vite.config.ts', 'package.json', 'pnpm-lock.yaml'];
    const changed = [...execFileSync('git', ['diff', '--name-only', 'eb2ccf4b', '--', ...scope], { cwd: root, encoding: 'utf8' }).split('\n'), ...execFileSync('git', ['ls-files', '--others', '--exclude-standard', '--', ...scope], { cwd: root, encoding: 'utf8' }).split('\n')].filter(p => p && !/\.test\.[cm]?[jt]sx?$/.test(p) && !(p === heroCtaComfortCssPath && inverseApprovedV2HeroCtaComfortBeforeMembership(p, read(p)) === baseline(p))).filter(p => p !== compactMembershipFixturePath || inverseApprovedV2CompactMembership(p, "") !== "").filter(p => { const hash = p === "server/fixtures/v2RemoveCareSection.json" ? "b61356f9c7050f63cf37b5814469f4ab6029df8fa772947308cf1a0deb2f0c8c" : p === "server/fixtures/v2RemoveCareSectionScope.ts" ? "02689bf7ccb341f0976c77a78c9e291bc2343c5f4e65321017eda219a22d7bc5" : p === "server/fixtures/v2FooterLogoScope.ts" ? "2b2c90128a438022efef3785c2262a529b8a5a25ed6be9e426a89c21b9675391" : null; if (!hash) return true; expect(createHash("sha256").update(readFileSync(resolve(root, p), "utf8")).digest("hex")).toBe(hash); return false; }).filter(p => p !== membershipFixturePath || inverseApprovedV2Membership(p, "") !== "").filter(p=>!["client/src/pages/WeightLossMenopauseV2DoctorBio.tsx", "client/src/pages/WeightLossMenopauseV2MobileBar.tsx"].includes(p)||read(p)!==baseline(p));
    expect([...new Set(changed)]).toEqual([v2HeroQuestionPagePath]);
    expect(inverseApprovedV2HeroCtaComfortBeforeMembership('client/src/pages/WeightLossMenopauseV2.css', read('client/src/pages/WeightLossMenopauseV2.css'))).toBe(baseline('client/src/pages/WeightLossMenopauseV2.css'));
    for (const p of execFileSync('git', ['ls-tree', '-r', '--name-only', 'eb2ccf4b', '--', 'server/fixtures'], { cwd: root, encoding: 'utf8' }).trim().split('\n')) expect(read(p)).toBe(baseline(p));
  });
  it('rejects missing or duplicate replacement and detects unrelated page edits', () => {
    const page = read(v2HeroQuestionPagePath);
    expect(() => inverseApprovedV2HeroQuestionBeforeMembership(v2HeroQuestionPagePath, page.replace(v2HeroQuestionAfter, v2HeroQuestionBefore))).toThrow('Unexpected approved V2 hero question count');
    expect(() => inverseApprovedV2HeroQuestionBeforeMembership(v2HeroQuestionPagePath, page + v2HeroQuestionAfter)).toThrow('Unexpected approved V2 hero question count');
    expect(inverseApprovedV2HeroQuestionBeforeMembership(v2HeroQuestionPagePath, page + '\nUNAPPROVED')).not.toBe(baseline(v2HeroQuestionPagePath));
    expect(inverseApprovedV2HeroQuestion('client/src/pages/Home.tsx', 'unchanged')).toBe('unchanged');
  });
});
