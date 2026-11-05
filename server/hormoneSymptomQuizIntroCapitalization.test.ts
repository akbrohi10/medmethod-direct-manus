import { inverseApprovedV2HeroQuestion } from "./weightLossMenopauseV2HeroQuestion.test";
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
    const changed = [...execFileSync('git', ['diff', '--name-only', '999e236d', '--', ...scope], { cwd: root, encoding: 'utf8' }).split('\n'), ...execFileSync('git', ['ls-files', '--others', '--exclude-standard', '--', ...scope], { cwd: root, encoding: 'utf8' }).split('\n')].filter(p => p && !/\.test\.[cm]?[jt]sx?$/.test(p))
      .filter(p => p !== "client/src/pages/WeightLossMenopauseV2.tsx" || inverseApprovedV2HeroQuestion(p, readFileSync(resolve(process.cwd(), p), "utf8")) !== execFileSync("git", ["show", String('999e236d') + ":" + p], { cwd: process.cwd(), encoding: "utf8" }));
    expect([...new Set(changed)]).toEqual([htmlPath]);
    for (const p of execFileSync('git', ['ls-tree', '-r', '--name-only', '999e236d', '--', 'server/fixtures'], { cwd: root, encoding: 'utf8' }).trim().split('\n')) expect(read(p)).toBe(baseline(p));
  });
});
