import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import { inverseRemovedV2CareSection, readCareScopeFile as readCareScopeFileBeforeFooter, removedV2CareSection as packet } from './fixtures/v2RemoveCareSectionScope';
import { inverseV2FooterLogo } from './fixtures/v2FooterLogoScope';
import { inverseV2TestimonialReadMore } from './fixtures/v2TestimonialReadMoreScope';
import { inverseV2TestimonialTextAction } from "./fixtures/v2TestimonialTextActionScope";
const readCareScopeFile = (path: string) => inverseV2FooterLogo(path, inverseV2TestimonialReadMore(path, inverseV2TestimonialTextAction(path, readCareScopeFileBeforeFooter(path))));
const root = resolve(import.meta.dirname, '..');
const before = (p: string) => execFileSync('git', ['show', packet.baseline + ':' + p], { cwd: root, encoding: 'utf8' });
describe('V2 care-plan section — confirmed deletion only', () => {
  it('removes the entire pictured section and all three cards exactly once', () => {
    const s = readCareScopeFile(packet.path);
    expect(before(packet.path).split(packet.old)).toHaveLength(2);
    for (const text of ['More than a prescription', 'A doctor’s assessment. A clear care plan.', 'Physician-led decisions', 'Your care plan, explained', 'Seven days of follow-up', 'support-section']) expect(s).not.toContain(text);
    expect(s).toContain('<WeightLossMenopauseV2DoctorBio />\n\n' + packet.anchor);
  });
  it('restores the complete page byte-for-byte and keeps every style, other section and data source unchanged', () => {
    const s = readCareScopeFile(packet.path);
    expect(s).toBe(before(packet.path).replace(packet.old, ''));
    expect(inverseRemovedV2CareSection(packet.path, s)).toBe(before(packet.path));
    for (const p of ['client/src/pages/WeightLossMenopauseV2.css', 'client/src/pages/WeightLossMenopauseV2DoctorBio.tsx', 'client/src/pages/WeightLossMenopauseV2MobileBar.tsx', 'client/src/pages/WeightLossMenopauseV2Faq.tsx', 'client/src/pages/Masterclass2.tsx', 'client/public/hormone-symptom-quiz.html', 'client/intake/index.html', 'shared/treatmentCatalog.json']) expect(readCareScopeFile(p)).toBe(before(p));
    const changed = execFileSync('git', ['diff', '--name-only', packet.baseline, '--', 'client', 'server', 'shared', 'drizzle', 'vite.config.ts', 'package.json', 'pnpm-lock.yaml'], { cwd: root, encoding: 'utf8' }).trim().split('\n').filter(p => p && !p.endsWith('.test.ts') && !p.startsWith('server/fixtures/'));
    expect(changed.filter(p => p !== 'client/src/pages/WeightLossMenopauseV2.css' || readCareScopeFile(p) !== before(p))).toEqual([packet.path]);
  });
  it('preserves the five independent testimonial disclosures, four process steps, compact pricing and CTA', () => {
    const s = readCareScopeFile(packet.path);
    expect(s.match(/<details className="testimonial-story"/g)).toHaveLength(5);
    expect(s).toContain('data-v2-four-process-steps');
    expect(s).toContain('<details className="compact-membership-details">');
    expect(s).toContain('Start your free assessment');
    expect(s.match(/<article className="testimonial-card">/g)).toHaveLength(5);
  });
  it('freezes the approval packet and test-only helper and rejects missing or duplicate boundaries without masking unrelated edits', () => {
    expect(createHash('sha256').update(JSON.stringify(packet)).digest('hex')).toBe('f6e120b999c6344bc1ef4a7856b33083acedda5f3aa140ea8d3bffda2b5ce472');
    expect(createHash('sha256').update(readCareScopeFile('server/fixtures/v2RemoveCareSectionScope.ts')).digest('hex')).toBe('02689bf7ccb341f0976c77a78c9e291bc2343c5f4e65321017eda219a22d7bc5');
    const s = readCareScopeFile(packet.path);
    expect(() => inverseRemovedV2CareSection(packet.path, s.replace(packet.anchor, 'UNAPPROVED'))).toThrow();
    expect(() => inverseRemovedV2CareSection(packet.path, s + packet.anchor)).toThrow();
    expect(inverseRemovedV2CareSection(packet.path, s + 'UNAPPROVED')).not.toBe(before(packet.path));
    expect(inverseRemovedV2CareSection(packet.path, before(packet.path))).toBe(before(packet.path));
    expect(inverseRemovedV2CareSection('unrelated.ts', 'same')).toBe('same');
  });
});
