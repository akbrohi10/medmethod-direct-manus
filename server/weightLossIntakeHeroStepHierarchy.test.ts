import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const landing = readFileSync(resolve(root, 'client/weight-loss-intake.html'), 'utf8');
const heroCss = landing.split('/* Approved flyer-inspired hero')[1].split('</style>')[0];
const heroMarkup = landing.split('<section class="hero">')[1].split('</section>')[0];

describe('Subdued hero steps on weight-loss-intake only', () => {
  it('uses smaller mint badges with dark-teal numbers and no faded text', () => {
    expect(heroCss).toContain('width:36px;height:36px;border-radius:50%;background:var(--hero-mint);color:var(--hero-deep-teal);font-size:1.125rem;font-weight:600');
    expect(heroCss).toContain('.hero .hero-start-number{width:30px;height:30px;font-size:1rem}');
    expect(heroCss).not.toMatch(/hero-start[^}]*opacity:/);
  });
  it('keeps the supporting copy readable, regular-weight and more compact', () => {
    expect(heroCss).toContain('font-size:clamp(1.05rem,1.5vw,1.2rem);font-weight:400;line-height:1.35');
    expect(heroCss).toContain('font-size:clamp(1rem,2.2vw,1.125rem);grid-template-columns:30px minmax(0,1fr);gap:11px');
    expect(heroCss).toContain('.hero .hero-start-steps{gap:12px}');
    expect(heroCss).toContain('color:var(--hero-navy)');
  });
  it('preserves the exact step wording, headline, CTA, destination and phone', () => {
    for (const wording of ['Complete your medical intake form.', 'Instantly receive a text and connect with your doctor.', 'Text a weight-loss', 'Doctor now', 'to see if', 'GLP-1s', 'are right for you.', 'For FREE!', 'Start My Free Doctor Visit', '5–10 min']) expect(heroMarkup).toContain(wording);
    expect(heroMarkup.match(/class="hero-start-number"/g)).toHaveLength(2);
    expect(heroMarkup).toContain('href="/intake/"');
    expect(heroMarkup).toContain('class="phone-screen"');
    expect(landing.match(/href="\/intake\/"/g)).toHaveLength(5);
  });
  it('does not introduce the hero-step style into protected intake or menopause pages', () => {
    for (const file of ['client/intake/index.html', 'client/src/pages/WeightLossMenopause.tsx']) {
      expect(readFileSync(resolve(root, file), 'utf8')).not.toContain('hero-start-steps');
    }
  });
});
