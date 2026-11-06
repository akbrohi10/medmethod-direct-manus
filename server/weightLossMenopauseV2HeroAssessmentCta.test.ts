import { createHash } from "node:crypto";
import { execFileSync } from 'node:child_process'; import { inverseApprovedV2Membership, membershipFixturePath } from "./weightLossMenopauseV2Membership.test"; import { compactMembershipFixturePath, inverseApprovedV2CompactMembership } from "./weightLossMenopauseV2CompactMembership.test";
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { heroCtaComfortCssPath, inverseApprovedV2HeroCtaComfortBeforeMembership } from './weightLossMenopauseV2HeroCtaComfort.test';
const root = resolve(import.meta.dirname, '..');
const pagePath = 'client/src/pages/WeightLossMenopauseV2.tsx';
export const v2HeroAssessmentCtaBefore = '<div className="hero-actions"><a className="btn" href={WEIGHT_MENOPAUSE_INTAKE_URL}><span className="hero-cta-label">Start your free visit <span className="arrow" aria-hidden="true">→</span></span><span className="hero-cta-timing">Complete intake · 5–10 min</span></a></div>';
export const v2HeroAssessmentCtaAfter = '<div className="hero-actions"><a className="btn" href={WEIGHT_MENOPAUSE_INTAKE_URL}><span className="hero-cta-label">Start your free assessment <span className="arrow" aria-hidden="true">→</span></span><span className="hero-cta-timing">Takes 5–10 min</span></a></div>';
export function inverseApprovedV2HeroAssessmentCta(path: string, source: string): string { return inverseApprovedV2HeroAssessmentCtaBeforeMembership(path, inverseApprovedV2Membership(path, source)); } export function inverseApprovedV2HeroAssessmentCtaBeforeMembership(path: string, source: string): string {
  source = inverseApprovedV2HeroCtaComfortBeforeMembership(path, source);
  if (path !== pagePath) return source;
  if (source.split(v2HeroAssessmentCtaAfter).length - 1 !== 1 || source.includes(v2HeroAssessmentCtaBefore)) throw new Error('Unexpected approved V2 hero assessment CTA count');
  return source.replace(v2HeroAssessmentCtaAfter, v2HeroAssessmentCtaBefore);
}
const read = (p: string) => inverseApprovedV2Membership(p, readFileSync(resolve(root, p), 'utf8'));
const baseline = (p: string) => execFileSync('git', ['show', `fc90ab2a:${p}`], { cwd: root, encoding: 'utf8' });
describe('V2 hero assessment button wording only', () => {
  it('uses the exact approved two lines and restores the entire page with one CTA inverse', () => {
    const page = read(pagePath);
    expect(page).toContain(v2HeroAssessmentCtaAfter);
    expect(inverseApprovedV2HeroAssessmentCtaBeforeMembership(pagePath, page)).toBe(baseline(pagePath));
    expect(page).not.toContain('no payment to start');
    expect(page).toContain('WEIGHT_MENOPAUSE_INTAKE_URL = "https://intake.medmethoddirect.com/"');
  });
  it('preserves all CSS, the headline, arrow, link, header and remaining production files', () => {
    const scope = ['client', 'server', 'shared', 'drizzle', 'vite.config.ts', 'package.json', 'pnpm-lock.yaml'];
    const changed = [...execFileSync('git', ['diff', '--name-only', 'fc90ab2a', '--', ...scope], { cwd: root, encoding: 'utf8' }).split('\n'), ...execFileSync('git', ['ls-files', '--others', '--exclude-standard', '--', ...scope], { cwd: root, encoding: 'utf8' }).split('\n')].filter(p => p && !/\.test\.[cm]?[jt]sx?$/.test(p) && !(p === heroCtaComfortCssPath && inverseApprovedV2HeroCtaComfortBeforeMembership(p, read(p)) === baseline(p))).filter(p => p !== compactMembershipFixturePath || inverseApprovedV2CompactMembership(p, "") !== "").filter(p => { const hash = p === "server/fixtures/v2RemoveCareSection.json" ? "b61356f9c7050f63cf37b5814469f4ab6029df8fa772947308cf1a0deb2f0c8c" : p === "server/fixtures/v2RemoveCareSectionScope.ts" ? "02689bf7ccb341f0976c77a78c9e291bc2343c5f4e65321017eda219a22d7bc5" : null; if (!hash) return true; expect(createHash("sha256").update(readFileSync(resolve(root, p), "utf8")).digest("hex")).toBe(hash); return false; }).filter(p => p !== membershipFixturePath || inverseApprovedV2Membership(p, "") !== "").filter(p=>!["client/src/pages/WeightLossMenopauseV2DoctorBio.tsx", "client/src/pages/WeightLossMenopauseV2MobileBar.tsx"].includes(p)||read(p)!==baseline(p));
    expect([...new Set(changed)]).toEqual([pagePath]);
    expect(inverseApprovedV2HeroCtaComfortBeforeMembership('client/src/pages/WeightLossMenopauseV2.css', read('client/src/pages/WeightLossMenopauseV2.css'))).toBe(baseline('client/src/pages/WeightLossMenopauseV2.css'));
    for (const p of execFileSync('git', ['ls-tree', '-r', '--name-only', 'fc90ab2a', '--', 'server/fixtures'], { cwd: root, encoding: 'utf8' }).trim().split('\n')) expect(read(p)).toBe(baseline(p));
  });
  it('rejects missing or duplicated changes and detects any unrelated page edit', () => {
    const page = read(pagePath);
    expect(() => inverseApprovedV2HeroAssessmentCtaBeforeMembership(pagePath, page.replace(v2HeroAssessmentCtaAfter, v2HeroAssessmentCtaBefore))).toThrow('Unexpected approved V2 hero assessment CTA count');
    expect(() => inverseApprovedV2HeroAssessmentCtaBeforeMembership(pagePath, page + v2HeroAssessmentCtaAfter)).toThrow('Unexpected approved V2 hero assessment CTA count');
    expect(inverseApprovedV2HeroAssessmentCtaBeforeMembership(pagePath, page + '\nUNAPPROVED')).not.toBe(baseline(pagePath));
    expect(inverseApprovedV2HeroAssessmentCta('client/src/pages/Home.tsx', 'unchanged')).toBe('unchanged');
  });
});
