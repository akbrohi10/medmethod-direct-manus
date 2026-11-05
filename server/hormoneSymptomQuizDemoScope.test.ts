import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
const root = resolve(import.meta.dirname, '..');
export const quizDemoFixturePath = 'server/fixtures/hormoneSymptomQuizDemoFragments.json';
const raw = readFileSync(resolve(root, quizDemoFixturePath), 'utf8');
const packetHash = '5381e10072494afdf112c89eff1395bdd51aab18491d440a5365068ea894ffc2';
const hash = (v: string) => createHash('sha256').update(v).digest('hex');
const packet: { baseline: string; path: string; fragments: { old: string; new: string; count: number }[] } = JSON.parse(raw);
if (hash(raw) !== packetHash || packet.baseline !== 'a827f914' || packet.path !== 'client/public/hormone-symptom-quiz.html' || packet.fragments.length !== 4 || packet.fragments.some(f => f.count !== 1 || !f.old || !f.new || f.old === f.new)) throw new Error('Unexpected approved quiz demo packet');
export function inverseApprovedQuizDemo(path: string, source: string): string {
  if (path !== packet.path) return source;
  for (const f of [...packet.fragments].reverse()) {
    if (source.split(f.new).length - 1 !== 1) throw new Error('Unexpected approved quiz demo fragment count');
    source = source.replace(f.new, f.old);
  }
  return source;
}
export function verifyApprovedQuizDemoAsset(path: string, source: string): boolean {
  if (path !== quizDemoFixturePath) return false;
  if (hash(source) !== packetHash) throw new Error('Unexpected approved quiz demo asset');
  return true;
}
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');
const old = (p: string) => execFileSync('git', ['show', `a827f914:${p}`], { cwd: root, encoding: 'utf8' });
describe('exact query-only hormone quiz demo scope', () => {
  it('restores the entire quiz to the immediately previous checkpoint with four exact edits', () => {
    expect(inverseApprovedQuizDemo(packet.path, read(packet.path))).toBe(old(packet.path));
    expect(hash(raw)).toBe(packetHash); expect(verifyApprovedQuizDemoAsset(quizDemoFixturePath, raw)).toBe(true);
  });
  it('rejects missing/duplicate demo fragments, modified fixtures and unrelated edits', () => {
    for (const f of packet.fragments) {
      expect(() => inverseApprovedQuizDemo(packet.path, read(packet.path).replace(f.new, f.old))).toThrow('Unexpected approved quiz demo fragment count');
      expect(() => inverseApprovedQuizDemo(packet.path, read(packet.path) + f.new)).toThrow('Unexpected approved quiz demo fragment count');
    }
    expect(() => verifyApprovedQuizDemoAsset(quizDemoFixturePath, raw + '\n')).toThrow('Unexpected approved quiz demo asset');
    expect(inverseApprovedQuizDemo(packet.path, read(packet.path) + '\nUNAPPROVED')).not.toBe(old(packet.path));
    expect(inverseApprovedQuizDemo('client/intake/index.html', 'unchanged')).toBe('unchanged');
  });
  it('changes only one production HTML file and retains all original fixtures and route integrations', () => {
    const scope = ['client', 'server', 'shared', 'drizzle', 'vite.config.ts', 'package.json', 'pnpm-lock.yaml'];
    const paths = [...execFileSync('git', ['diff', '--name-only', 'a827f914', '--', ...scope], { cwd: root, encoding: 'utf8' }).split('\n'), ...execFileSync('git', ['ls-files', '--others', '--exclude-standard', '--', ...scope], { cwd: root, encoding: 'utf8' }).split('\n')].filter(p => p && !/\.test\.[cm]?[jt]sx?$/.test(p) && !verifyApprovedQuizDemoAsset(p, read(p)));
    expect([...new Set(paths)]).toEqual([packet.path]);
    for (const p of ['client/src/App.tsx', 'server/_core/index.ts', 'vite.config.ts', ...execFileSync('git', ['ls-tree', '-r', '--name-only', 'a827f914', '--', 'server/fixtures'], { cwd: root, encoding: 'utf8' }).trim().split('\n')]) expect(read(p)).toBe(old(p));
  });
});
