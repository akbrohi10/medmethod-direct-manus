import { execFileSync } from 'node:child_process'; import { createHash as metaLeadScopeCreateHash } from "node:crypto"; import { gunzipSync as metaLeadScopeGunzipSync } from "node:zlib"; import { metaLeadConversionsHistoricalSource, metaLeadConversionsApprovedInventory, metaLeadConversionsNeedsInverse, META_LEAD_CONVERSIONS_SOURCE_PATHS } from "./fixtures/metaLeadConversionsScope"; const metaLeadConversionsHelperSHA = "d34479c6329419bf251177058890f3ac1bbb2d8fd943685846528c717b98afcc"; import { beforeMetaSchedule, metaScheduleApprovedInventory } from "./fixtures/metaScheduleScope"; const metaScheduleHelperSHA = "b9687e0da13457a07b541655bef530808eacdd6c465a50c5104e967625b5c613";
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
const root = resolve(import.meta.dirname, '..'), path = 'client/public/intake/progress.js';
const source = metaLeadConversionsHistoricalSource(path, beforeMetaSchedule(path, readFileSync(resolve(root, path), 'utf8')), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));
const before = execFileSync('git', ['show', `24838ad1:${path}`], { cwd: root, encoding: 'utf8' });
function load(code: string) {
  const env: any = { window: {} }; runInNewContext(code, env);
  const React = { useRef: (value: any) => ({ current: value }), useLayoutEffect: (fn: () => void) => fn() };
  const jsx = (type: string, props: any) => ({ type, props });
  return env.window.MmdCreateIntakeProgress(React, { jsx, jsxs: jsx });
}
const now = load(source), old = load(before);
const screens = Array.from({ length: 31 }, (_, index) => ({ id: index === 29 ? 'w01' : index === 30 ? 'w02' : `q${index}`, type: index === 29 ? 'price' : index === 30 ? 'identity' : 'choice', section: 'Health history' }));
function walk(progress: any, list = screens) { let previous: any = null; return list.map((screen, index) => previous = progress.project(previous, screen, list, list.slice(0, index).map(s => s.id), false)); }
function find(node: any, role: string): any { if (!node) return undefined; if (Array.isArray(node)) return node.map(n => find(n, role)).find(Boolean); if (node.props?.role === role) return node; return find(node.props?.children, role); }
describe('truthful final intake progress label', () => {
  it('says Almost there with the existing percent on How it works and Last step only on Patient info', () => {
    const views = walk(now); const how = views.at(-2), final = views.at(-1);
    expect(how.id).toBe('w01'); expect(how.label).toBe(`Almost there · ${how.rounded}%`); expect(how.time).toBe('About 1 minute left');
    expect(final.id).toBe('w02'); expect(final.label).toBe('Last step!'); expect(final.rounded).toBe(100);
    expect(views.filter(v => v.label === 'Last step!')).toHaveLength(1);
  });
  it('changes no percent, occurrence history, section or timing value on any screen', () => {
    const current = walk(now), baseline = walk(old);
    current.forEach((view, index) => { const { label, ...rest } = view, { label: previousLabel, ...previousRest } = baseline[index]; expect(rest).toEqual(previousRest); if (view.id !== 'w01') expect(label).toBe(previousLabel); });
  });
  it('restores Almost there when Back returns from Patient info to How it works', () => {
    const views = walk(now), index = screens.length - 2;
    const back = now.project(views.at(-1), screens[index], screens, screens.slice(0, index).map(s => s.id), false);
    expect(back.percent).toBe(views[index].percent); expect(back.label).toBe(`Almost there · ${back.rounded}%`); expect(back.label).not.toBe('Last step!');
  });
  it('keeps the last-step wording truthful for shorter and longer conditional paths', () => {
    for (const count of [30, 31, 32, 33, 34, 35]) {
      const list = Array.from({ length: count }, (_, i) => ({ id: i === count - 2 ? 'w01' : i === count - 1 ? 'w02' : `s${i}`, type: i === count - 1 ? 'identity' : 'choice', section: 'Health history' }));
      const views = walk(now, list); expect(views.filter(v => v.label === 'Last step!')).toHaveLength(1); expect(views.at(-2).label).toMatch(/^Almost there · \d+%$/); expect(views.at(-1).label).toBe('Last step!');
    }
  });
  it('does not announce last step to screen readers on the penultimate screen', () => {
    const index = screens.length - 2; const node = now.Progress({ screen: screens[index], screens, history: screens.slice(0, index).map(s => s.id), hidden: false });
    expect(find(node, 'progressbar').props['aria-valuetext']).not.toContain('last step');
    const final = now.Progress({ screen: screens.at(-1), screens, history: screens.slice(0, -1).map(s => s.id), hidden: false });
    expect(find(final, 'progressbar').props['aria-valuetext']).toContain('last step');
  });
  it('keeps the component byte-identical except one condition and refreshes only its script cache key', () => {
    expect(source.replace('last = index === visible.length - 1;', 'last = index >= visible.length - 2;')).toBe(before);
    const html = metaLeadConversionsHistoricalSource('client/intake/index.html', beforeMetaSchedule('client/intake/index.html', readFileSync(resolve(root, 'client/intake/index.html'), 'utf8')), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8")), previous = execFileSync('git', ['show', '24838ad1:client/intake/index.html'], { cwd: root, encoding: 'utf8' });
    expect(html.replace('<script src="/intake/progress.js?v=20261106-final-step">', '<script src="/intake/progress.js?v=20261105">')).toBe(previous);
  });
});
