import { inverseApprovedV2HeroQuestion } from "./weightLossMenopauseV2HeroQuestion.test";
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
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');
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
    const changed = [...execFileSync('git', ['diff', '--name-only', '8992dce2', '--', ...scope], { cwd: root, encoding: 'utf8' }).split('\n'), ...execFileSync('git', ['ls-files', '--others', '--exclude-standard', '--', ...scope], { cwd: root, encoding: 'utf8' }).split('\n')].filter(p => p && !/\.test\.[cm]?[jt]sx?$/.test(p))
      .filter(p => p !== "client/src/pages/WeightLossMenopauseV2.tsx" || inverseApprovedV2HeroQuestion(p, readFileSync(resolve(process.cwd(), p), "utf8")) !== execFileSync("git", ["show", String('8992dce2') + ":" + p], { cwd: process.cwd(), encoding: "utf8" }));
    expect([...new Set(changed)]).toEqual([path]);
    for (const p of execFileSync('git', ['ls-tree', '-r', '--name-only', '8992dce2', '--', 'server/fixtures'], { cwd: root, encoding: 'utf8' }).trim().split('\n')) expect(read(p)).toBe(baseline(p));
  });
});
