import { inverseApprovedV2HeroQuestion } from "./weightLossMenopauseV2HeroQuestion.test";
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { inverseApprovedQuizInstantScore } from './hormoneSymptomQuizInstantScore.test';
const root = resolve(import.meta.dirname, '..');
const htmlPath = 'client/public/hormone-symptom-quiz.html';
const previous = '<a class="cta" href="https://medmethoddirect.com" target="_blank" rel="noopener">Book my discovery call</a>';
const approved = '<a class="cta" href="https://medmethoddirect.com/care-team-booking" target="_blank" rel="noopener">Book my discovery call</a>';
export function inverseApprovedQuizBookingLink(path: string, source: string): string {
  source = inverseApprovedQuizInstantScore(path, source);
  if (path !== htmlPath) return source;
  if (source.split(approved).length - 1 !== 1 || source.includes(previous)) throw new Error('Unexpected approved quiz booking link count');
  return source.replace(approved, previous);
}
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');
const baseline = (path: string) => execFileSync('git', ['show', `23e7d9b7:${path}`], { cwd: root, encoding: 'utf8' });
describe('quiz report discovery call link only', () => {
  it('changes exactly one href while keeping every other byte of the quiz unchanged', () => {
    const html = read(htmlPath);
    expect(html).toContain(approved); expect(html).not.toContain(previous);
    expect(inverseApprovedQuizBookingLink(htmlPath, html)).toBe(baseline(htmlPath));
    expect(read('dist/public/hormone-symptom-quiz.html')).toBe(html);
  });
  it('preserves strict missing/duplicate-link rejection and detects unrelated edits', () => {
    const html = read(htmlPath);
    expect(() => inverseApprovedQuizBookingLink(htmlPath, html.replace(approved, previous))).toThrow('Unexpected approved quiz booking link count');
    expect(() => inverseApprovedQuizBookingLink(htmlPath, html + approved)).toThrow('Unexpected approved quiz booking link count');
    expect(inverseApprovedQuizBookingLink(htmlPath, html + '\nUNAPPROVED')).not.toBe(baseline(htmlPath));
    expect(inverseApprovedQuizBookingLink('client/intake/index.html', 'unchanged')).toBe('unchanged');
  });
  it('changes no other production file, route, integration, fixture, styling, copy or demo behavior', () => {
    const scope = ['client', 'server', 'shared', 'drizzle', 'vite.config.ts', 'package.json', 'pnpm-lock.yaml'];
    const changed = [...execFileSync('git', ['diff', '--name-only', '23e7d9b7', '--', ...scope], { cwd: root, encoding: 'utf8' }).split('\n'), ...execFileSync('git', ['ls-files', '--others', '--exclude-standard', '--', ...scope], { cwd: root, encoding: 'utf8' }).split('\n')].filter(p => p && !/\.test\.[cm]?[jt]sx?$/.test(p))
      .filter(p => p !== "client/src/pages/WeightLossMenopauseV2.tsx" || inverseApprovedV2HeroQuestion(p, readFileSync(resolve(process.cwd(), p), "utf8")) !== execFileSync("git", ["show", String('23e7d9b7') + ":" + p], { cwd: process.cwd(), encoding: "utf8" }));
    expect([...new Set(changed)]).toEqual([htmlPath]);
    for (const p of execFileSync('git', ['ls-tree', '-r', '--name-only', '23e7d9b7', '--', 'server/fixtures'], { cwd: root, encoding: 'utf8' }).trim().split('\n')) expect(read(p)).toBe(baseline(p));
  });
});
