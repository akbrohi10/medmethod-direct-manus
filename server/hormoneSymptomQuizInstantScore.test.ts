import { createHash } from "node:crypto"; import { inverseHormoneQuizTreatmentCta } from "./fixtures/hormoneQuizTreatmentCtaScope";
import { inverseApprovedV2HeroQuestion } from "./weightLossMenopauseV2HeroQuestion.test"; import { inverseApprovedV2Membership, membershipFixturePath } from "./weightLossMenopauseV2Membership.test"; import { compactMembershipFixturePath, inverseApprovedV2CompactMembership } from "./weightLossMenopauseV2CompactMembership.test";
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { inverseApprovedQuizCapitalizedIntro, quizIntroCapitalizationAfter } from './hormoneSymptomQuizIntroCapitalization.test';
const root = resolve(import.meta.dirname, '..');
const path = 'client/public/hormone-symptom-quiz.html';
const before = '<p class="intro-meta">30 questions &middot; about 5 minutes &middot; a few quick details at the end. Detailed report.</p>';
const after = '<p class="intro-meta">30 questions &middot; about 5 minutes &middot; instant score. Detailed report.</p>';
export function inverseApprovedQuizInstantScore(p: string, source: string): string {
  if (p !== path) return source;
  source = inverseApprovedQuizCapitalizedIntro(p, source);
  if (source.split(after).length - 1 !== 1 || source.includes(before)) throw new Error('Unexpected approved quiz instant score count');
  return source.replace(after, before);
}
const read = (p: string) => inverseHormoneQuizTreatmentCta(p, readFileSync(resolve(root, p), 'utf8'));
const baseline = (p: string) => execFileSync('git', ['show', `8992dce2:${p}`], { cwd: root, encoding: 'utf8' });
describe('quiz intro instant score wording only', () => {
  it('changes exactly the approved intro phrase, preserving every other source byte', () => {
    const html = read(path);
    const normalizedIntro = inverseApprovedQuizCapitalizedIntro(path, html);
    expect(normalizedIntro).toContain(after); expect(html).not.toContain('a few quick details at the end');
    expect(inverseApprovedQuizInstantScore(path, html)).toBe(baseline(path));
    expect(read('dist/public/hormone-symptom-quiz.html')).toBe(html);
  });
  it('rejects missing/duplicate copy and preserves detection of unrelated edits', () => {
    const html = read(path);
    expect(() => inverseApprovedQuizInstantScore(path, html.replace(quizIntroCapitalizationAfter, before))).toThrow('Unexpected approved quiz capitalized intro count');
    expect(() => inverseApprovedQuizInstantScore(path, html + quizIntroCapitalizationAfter)).toThrow('Unexpected approved quiz capitalized intro count');
    expect(() => inverseApprovedQuizInstantScore(path, html + before)).toThrow('Unexpected approved quiz instant score count');
    expect(inverseApprovedQuizInstantScore(path, html + '\nUNAPPROVED')).not.toBe(baseline(path));
    expect(inverseApprovedQuizInstantScore('client/intake/index.html', 'unchanged')).toBe('unchanged');
  });
  it('changes only one production file and keeps all previous fixtures and integrations unchanged', () => {
    const scope = ['client', 'server', 'shared', 'drizzle', 'vite.config.ts', 'package.json', 'pnpm-lock.yaml'];
    const changed = [...execFileSync('git', ['diff', '--name-only', '8992dce2', '--', ...scope], { cwd: root, encoding: 'utf8' }).split('\n'), ...execFileSync('git', ['ls-files', '--others', '--exclude-standard', '--', ...scope], { cwd: root, encoding: 'utf8' }).split('\n')].filter(p => p && !/\.test\.[cm]?[jt]sx?$/.test(p)).filter(p => p !== compactMembershipFixturePath || inverseApprovedV2CompactMembership(p, "") !== "").filter(p => { const hash = p === "server/fixtures/v2RemoveCareSection.json" ? "b61356f9c7050f63cf37b5814469f4ab6029df8fa772947308cf1a0deb2f0c8c" : p === "server/fixtures/v2RemoveCareSectionScope.ts" ? "02689bf7ccb341f0976c77a78c9e291bc2343c5f4e65321017eda219a22d7bc5" : p === "server/fixtures/v2FooterLogoScope.ts" ? "2b2c90128a438022efef3785c2262a529b8a5a25ed6be9e426a89c21b9675391" : p === "server/fixtures/v2TestimonialReadMoreScope.ts" ? "e7e3f1411a7b683859dbea1fdef49adc2af488e503cd8d3acc8f3712790342a8" : p === "server/fixtures/v2TestimonialTextActionScope.ts" ? "b64ca0e8da32e70e2e97da930e4d1a5e4e51b35df12b4ab81a34a29d42761c7c" : p === "server/fixtures/v2TestimonialAttributionScope.ts" ? "289a41016d926e29ea901349023bb373dfd7e17fde3c427e57fdbb63ffd7a18c" : p === "server/fixtures/hormoneQuizTreatmentCtaScope.ts" ? "4e2c90b2879cb08ced0129214db38f67751ec239632f99f353dd371e61b93668" : null; if (!hash) return true; expect(createHash("sha256").update(readFileSync(resolve(root, p), "utf8")).digest("hex")).toBe(hash); return false; }).filter(p => p !== membershipFixturePath || inverseApprovedV2Membership(p, "") !== "")
      .filter(p => !["client/src/pages/WeightLossMenopauseV2.tsx", "client/src/pages/WeightLossMenopauseV2.css", "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx", "client/src/pages/WeightLossMenopauseV2MobileBar.tsx"].includes(p) || inverseApprovedV2HeroQuestion(p, readFileSync(resolve(process.cwd(), p), "utf8")) !== execFileSync("git", ["show", String('8992dce2') + ":" + p], { cwd: process.cwd(), encoding: "utf8" }));
    expect([...new Set(changed)]).toEqual([path]);
    for (const p of execFileSync('git', ['ls-tree', '-r', '--name-only', '8992dce2', '--', 'server/fixtures'], { cwd: root, encoding: 'utf8' }).trim().split('\n')) expect(read(p)).toBe(baseline(p));
  });
});
