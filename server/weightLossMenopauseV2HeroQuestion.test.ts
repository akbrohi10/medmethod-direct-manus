import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
const root = resolve(import.meta.dirname, '..');
export const v2HeroQuestionPagePath = 'client/src/pages/WeightLossMenopauseV2.tsx';
export const v2HeroQuestionBefore = '<h1><span className="hero-headline-line">Text a Weight Loss <span className="hero-ampersand">&amp;</span><br />Hormone Doctor now.</span><span className="hero-headline-line hero-free"><em>First visit FREE!</em></span></h1>';
export const v2HeroQuestionAfter = '<h1><span className="hero-headline-line">Is medical weight loss or hormone therapy right for you?</span><span className="hero-headline-line hero-free"><em>Find out free.</em></span></h1>';
export function inverseApprovedV2HeroQuestion(path: string, source: string): string {
  if (path !== v2HeroQuestionPagePath) return source;
  if (source.split(v2HeroQuestionAfter).length - 1 !== 1 || source.includes(v2HeroQuestionBefore)) throw new Error('Unexpected approved V2 hero question count');
  return source.replace(v2HeroQuestionAfter, v2HeroQuestionBefore);
}
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');
const baseline = (p: string) => execFileSync('git', ['show', `eb2ccf4b:${p}`], { cwd: root, encoding: 'utf8' });
describe('V2 hero right-for-you question headline only', () => {
  it('uses the exact approved question and emphasized closing line with no other page change', () => {
    const page = read(v2HeroQuestionPagePath);
    expect(page).toContain(v2HeroQuestionAfter);
    expect(inverseApprovedV2HeroQuestion(v2HeroQuestionPagePath, page)).toBe(baseline(v2HeroQuestionPagePath));
    expect(page.match(/<h1>/g)).toHaveLength(1);
  });
  it('retains CSS, fonts, supporting copy, phone, CTA and all other production sources byte-for-byte', () => {
    const scope = ['client', 'server', 'shared', 'drizzle', 'vite.config.ts', 'package.json', 'pnpm-lock.yaml'];
    const changed = [...execFileSync('git', ['diff', '--name-only', 'eb2ccf4b', '--', ...scope], { cwd: root, encoding: 'utf8' }).split('\n'), ...execFileSync('git', ['ls-files', '--others', '--exclude-standard', '--', ...scope], { cwd: root, encoding: 'utf8' }).split('\n')].filter(p => p && !/\.test\.[cm]?[jt]sx?$/.test(p));
    expect([...new Set(changed)]).toEqual([v2HeroQuestionPagePath]);
    expect(read('client/src/pages/WeightLossMenopauseV2.css')).toBe(baseline('client/src/pages/WeightLossMenopauseV2.css'));
    for (const p of execFileSync('git', ['ls-tree', '-r', '--name-only', 'eb2ccf4b', '--', 'server/fixtures'], { cwd: root, encoding: 'utf8' }).trim().split('\n')) expect(read(p)).toBe(baseline(p));
  });
  it('rejects missing or duplicate replacement and detects unrelated page edits', () => {
    const page = read(v2HeroQuestionPagePath);
    expect(() => inverseApprovedV2HeroQuestion(v2HeroQuestionPagePath, page.replace(v2HeroQuestionAfter, v2HeroQuestionBefore))).toThrow('Unexpected approved V2 hero question count');
    expect(() => inverseApprovedV2HeroQuestion(v2HeroQuestionPagePath, page + v2HeroQuestionAfter)).toThrow('Unexpected approved V2 hero question count');
    expect(inverseApprovedV2HeroQuestion(v2HeroQuestionPagePath, page + '\nUNAPPROVED')).not.toBe(baseline(v2HeroQuestionPagePath));
    expect(inverseApprovedV2HeroQuestion('client/src/pages/Home.tsx', 'unchanged')).toBe('unchanged');
  });
});
