import { createHash } from "node:crypto";
import { execFileSync } from 'node:child_process'; import { inverseApprovedV2Membership, membershipFixturePath } from './weightLossMenopauseV2Membership.test'; import { compactMembershipFixturePath, inverseApprovedV2CompactMembership } from "./weightLossMenopauseV2CompactMembership.test";
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
const root = resolve(import.meta.dirname, '..');
export const heroCtaComfortCssPath = 'client/src/pages/WeightLossMenopauseV2.css';
export const heroCtaComfortStyles = '\n/* V2 hero CTA — lighter vertical padding and shadow only. */\n.wlm-v2-content .hero[data-medmethod-scope] .hero-actions .btn {\n  min-height: 80px;\n  padding-top: 12px;\n  padding-bottom: 12px;\n  box-shadow: 0 7px 16px rgba(181, 34, 132, .10);\n}\n.wlm-v2-content .hero[data-medmethod-scope] .hero-actions .btn:hover {\n  box-shadow: 0 10px 22px rgba(181, 34, 132, .14);\n}\n';
export function inverseApprovedV2HeroCtaComfort(path: string, source: string): string { return inverseApprovedV2HeroCtaComfortBeforeMembership(path, inverseApprovedV2Membership(path, source)); } export function inverseApprovedV2HeroCtaComfortBeforeMembership(path: string, source: string): string {
  if (path !== heroCtaComfortCssPath) return source;
  if (source.split(heroCtaComfortStyles).length - 1 !== 1 || !source.endsWith(heroCtaComfortStyles)) throw new Error('Unexpected approved V2 hero CTA comfort style count');
  return source.slice(0, -heroCtaComfortStyles.length);
}
const read = (p: string) => inverseApprovedV2Membership(p, readFileSync(resolve(root, p), 'utf8'));
const baseline = (p: string) => execFileSync('git', ['show', `8c161014:${p}`], { cwd: root, encoding: 'utf8' });
describe('V2 hero button padding and shadow only', () => {
  it('appends only the approved strictly scoped style block with the complete prior CSS unchanged', () => {
    const css = read(heroCtaComfortCssPath);
    expect(inverseApprovedV2HeroCtaComfortBeforeMembership(heroCtaComfortCssPath, css)).toBe(baseline(heroCtaComfortCssPath));
    expect(css).toBe(baseline(heroCtaComfortCssPath) + heroCtaComfortStyles);
    expect(heroCtaComfortStyles.match(/min-height:/g)).toHaveLength(1);
    expect(heroCtaComfortStyles.match(/padding-(?:top|bottom):/g)).toHaveLength(2);
    expect(heroCtaComfortStyles.match(/box-shadow:/g)).toHaveLength(2);
    expect(heroCtaComfortStyles).not.toMatch(/font|width:|background:|color:|border|radius|gap:|transform|transition/);
  });
  it('leaves the entire page component, wording, destination and every other production file byte-identical', () => {
    const scope = ['client', 'server', 'shared', 'drizzle', 'vite.config.ts', 'package.json', 'pnpm-lock.yaml'];
    const changed = [...execFileSync('git', ['diff', '--name-only', '8c161014', '--', ...scope], { cwd: root, encoding: 'utf8' }).split('\n'), ...execFileSync('git', ['ls-files', '--others', '--exclude-standard', '--', ...scope], { cwd: root, encoding: 'utf8' }).split('\n')].filter(p => p && !/\.test\.[cm]?[jt]sx?$/.test(p) && (p !== membershipFixturePath || inverseApprovedV2Membership(p, '') !== '') && !(p === 'client/src/pages/WeightLossMenopauseV2.tsx' && read(p) === baseline(p))).filter(p => p !== compactMembershipFixturePath || inverseApprovedV2CompactMembership(p, "") !== "").filter(p => { const hash = p === "server/fixtures/v2RemoveCareSection.json" ? "b61356f9c7050f63cf37b5814469f4ab6029df8fa772947308cf1a0deb2f0c8c" : p === "server/fixtures/v2RemoveCareSectionScope.ts" ? "02689bf7ccb341f0976c77a78c9e291bc2343c5f4e65321017eda219a22d7bc5" : p === "server/fixtures/v2FooterLogoScope.ts" ? "2b2c90128a438022efef3785c2262a529b8a5a25ed6be9e426a89c21b9675391" : p === "server/fixtures/v2TestimonialReadMoreScope.ts" ? "e7e3f1411a7b683859dbea1fdef49adc2af488e503cd8d3acc8f3712790342a8" : p === "server/fixtures/v2TestimonialTextActionScope.ts" ? "b64ca0e8da32e70e2e97da930e4d1a5e4e51b35df12b4ab81a34a29d42761c7c" : p === "server/fixtures/v2TestimonialAttributionScope.ts" ? "289a41016d926e29ea901349023bb373dfd7e17fde3c427e57fdbb63ffd7a18c" : null; if (!hash) return true; expect(createHash("sha256").update(readFileSync(resolve(root, p), "utf8")).digest("hex")).toBe(hash); return false; }).filter(p => p !== membershipFixturePath || inverseApprovedV2Membership(p, "") !== "").filter(p=>!["client/src/pages/WeightLossMenopauseV2DoctorBio.tsx", "client/src/pages/WeightLossMenopauseV2MobileBar.tsx"].includes(p)||read(p)!==baseline(p));
    expect([...new Set(changed)]).toEqual([heroCtaComfortCssPath]);
    expect(read('client/src/pages/WeightLossMenopauseV2.tsx')).toBe(baseline('client/src/pages/WeightLossMenopauseV2.tsx'));
    for (const p of execFileSync('git', ['ls-tree', '-r', '--name-only', '8c161014', '--', 'server/fixtures'], { cwd: root, encoding: 'utf8' }).trim().split('\n')) expect(read(p)).toBe(baseline(p));
  });
  it('rejects omitted, duplicated or misplaced style blocks and detects all unrelated CSS edits', () => {
    const css = read(heroCtaComfortCssPath);
    expect(() => inverseApprovedV2HeroCtaComfortBeforeMembership(heroCtaComfortCssPath, baseline(heroCtaComfortCssPath))).toThrow('Unexpected approved V2 hero CTA comfort style count');
    expect(() => inverseApprovedV2HeroCtaComfortBeforeMembership(heroCtaComfortCssPath, css + heroCtaComfortStyles)).toThrow('Unexpected approved V2 hero CTA comfort style count');
    expect(() => inverseApprovedV2HeroCtaComfortBeforeMembership(heroCtaComfortCssPath, css + 'UNAPPROVED')).toThrow('Unexpected approved V2 hero CTA comfort style count');
    expect(inverseApprovedV2HeroCtaComfortBeforeMembership(heroCtaComfortCssPath, 'UNAPPROVED\n' + css)).not.toBe(baseline(heroCtaComfortCssPath));
    expect(inverseApprovedV2HeroCtaComfort('client/src/pages/Home.tsx', 'unchanged')).toBe('unchanged');
  });
});
