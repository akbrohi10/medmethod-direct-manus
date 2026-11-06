import { createHash } from "node:crypto";
import { inverseApprovedV2HeroQuestion } from "./weightLossMenopauseV2HeroQuestion.test"; import { inverseApprovedV2Membership, membershipFixturePath } from "./weightLossMenopauseV2Membership.test"; import { compactMembershipFixturePath, inverseApprovedV2CompactMembership } from "./weightLossMenopauseV2CompactMembership.test";
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
const root = resolve(import.meta.dirname, '..');
const htmlPath = 'client/public/hormone-symptom-quiz.html';
export const quizIntroCapitalizationBefore = '<p class="intro-meta">30 questions &middot; about 5 minutes &middot; instant score. Detailed report.</p>';
export const quizIntroCapitalizationAfter = '<p class="intro-meta">30 questions &middot; About 5 minutes &middot; Instant score &middot; Detailed report</p>';
export function inverseApprovedQuizCapitalizedIntro(path: string, source: string): string {
  if (path !== htmlPath) return source;
  if (source.split(quizIntroCapitalizationAfter).length - 1 !== 1 || source.includes(quizIntroCapitalizationBefore)) throw new Error('Unexpected approved quiz capitalized intro count');
  return source.replace(quizIntroCapitalizationAfter, quizIntroCapitalizationBefore);
}
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');
const baseline = (p: string) => execFileSync('git', ['show', `999e236d:${p}`], { cwd: root, encoding: 'utf8' });
describe('quiz intro capitalization and separators only', () => {
  it('uses the exact approved line and preserves every other HTML byte', () => {
    const html = read(htmlPath);
    expect(html).toContain(quizIntroCapitalizationAfter);
    expect(inverseApprovedQuizCapitalizedIntro(htmlPath, html)).toBe(baseline(htmlPath));
    expect(read('dist/public/hormone-symptom-quiz.html')).toBe(html);
  });
  it('rejects absent or duplicate replacement and detects all unrelated edits', () => {
    const html = read(htmlPath);
    expect(() => inverseApprovedQuizCapitalizedIntro(htmlPath, html.replace(quizIntroCapitalizationAfter, quizIntroCapitalizationBefore))).toThrow('Unexpected approved quiz capitalized intro count');
    expect(() => inverseApprovedQuizCapitalizedIntro(htmlPath, html + quizIntroCapitalizationAfter)).toThrow('Unexpected approved quiz capitalized intro count');
    expect(inverseApprovedQuizCapitalizedIntro(htmlPath, html + '\nUNAPPROVED')).not.toBe(baseline(htmlPath));
    expect(inverseApprovedQuizCapitalizedIntro('client/intake/index.html', 'unchanged')).toBe('unchanged');
  });
  it('changes no other production file or previous frozen fixture', () => {
    const scope = ['client', 'server', 'shared', 'drizzle', 'vite.config.ts', 'package.json', 'pnpm-lock.yaml'];
    const changed = [...execFileSync('git', ['diff', '--name-only', '999e236d', '--', ...scope], { cwd: root, encoding: 'utf8' }).split('\n'), ...execFileSync('git', ['ls-files', '--others', '--exclude-standard', '--', ...scope], { cwd: root, encoding: 'utf8' }).split('\n')].filter(p => p && !/\.test\.[cm]?[jt]sx?$/.test(p)).filter(p => p !== compactMembershipFixturePath || inverseApprovedV2CompactMembership(p, "") !== "").filter(p => { const hash = p === "server/fixtures/v2RemoveCareSection.json" ? "b61356f9c7050f63cf37b5814469f4ab6029df8fa772947308cf1a0deb2f0c8c" : p === "server/fixtures/v2RemoveCareSectionScope.ts" ? "02689bf7ccb341f0976c77a78c9e291bc2343c5f4e65321017eda219a22d7bc5" : p === "server/fixtures/v2FooterLogoScope.ts" ? "2b2c90128a438022efef3785c2262a529b8a5a25ed6be9e426a89c21b9675391" : p === "server/fixtures/v2TestimonialReadMoreScope.ts" ? "e7e3f1411a7b683859dbea1fdef49adc2af488e503cd8d3acc8f3712790342a8" : p === "server/fixtures/v2TestimonialTextActionScope.ts" ? "b64ca0e8da32e70e2e97da930e4d1a5e4e51b35df12b4ab81a34a29d42761c7c" : null; if (!hash) return true; expect(createHash("sha256").update(readFileSync(resolve(root, p), "utf8")).digest("hex")).toBe(hash); return false; }).filter(p => p !== membershipFixturePath || inverseApprovedV2Membership(p, "") !== "")
      .filter(p => !["client/src/pages/WeightLossMenopauseV2.tsx", "client/src/pages/WeightLossMenopauseV2.css", "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx", "client/src/pages/WeightLossMenopauseV2MobileBar.tsx"].includes(p) || inverseApprovedV2HeroQuestion(p, readFileSync(resolve(process.cwd(), p), "utf8")) !== execFileSync("git", ["show", String('999e236d') + ":" + p], { cwd: process.cwd(), encoding: "utf8" }));
    expect([...new Set(changed)]).toEqual([htmlPath]);
    for (const p of execFileSync('git', ['ls-tree', '-r', '--name-only', '999e236d', '--', 'server/fixtures'], { cwd: root, encoding: 'utf8' }).trim().split('\n')) expect(read(p)).toBe(baseline(p));
  });
});
