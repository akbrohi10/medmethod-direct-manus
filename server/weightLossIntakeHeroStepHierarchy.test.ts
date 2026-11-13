import { describe, expect, it } from 'vitest'; import { createHash as metaLeadScopeCreateHash } from "node:crypto"; import { gunzipSync as metaLeadScopeGunzipSync } from "node:zlib"; import { metaLeadConversionsHistoricalSource, metaLeadConversionsApprovedInventory, metaLeadConversionsNeedsInverse, META_LEAD_CONVERSIONS_SOURCE_PATHS } from "./fixtures/metaLeadConversionsScope"; const metaLeadConversionsHelperSHA = "d34479c6329419bf251177058890f3ac1bbb2d8fd943685846528c717b98afcc"; import { beforeMetaSchedule, metaScheduleApprovedInventory } from "./fixtures/metaScheduleScope"; const metaScheduleHelperSHA = "b9687e0da13457a07b541655bef530808eacdd6c465a50c5104e967625b5c613";
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const landing = metaLeadConversionsHistoricalSource('client/weight-loss-intake.html', beforeMetaSchedule('client/weight-loss-intake.html', readFileSync(resolve(root, 'client/weight-loss-intake.html'), 'utf8')), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));
const heroCss = landing.split('/* Approved flyer-inspired hero')[1].split('</style>')[0];
const heroMarkup = landing.split('<section class="hero">')[1].split('</section>')[0];

describe('Simplified weight-loss-intake hero', () => {
  it('removes the redundant two-step text and its markers entirely', () => {
    for (const removed of ['hero-start-steps', 'hero-start-number', 'Complete your medical intake form.', 'Instantly receive a text and connect with your doctor.']) {
      expect(heroMarkup).not.toContain(removed);
      expect(heroCss).not.toContain(removed);
    }
  });
  it('keeps a compact, intentional headline-to-CTA rhythm', () => {
    expect(heroCss).toContain('.hero .hero-copy>h1{max-width:none;margin:0 0 32px');
    expect(heroCss).toContain('.hero .hero-copy>.hero-actions{width:100%;margin:0}');
  });
  it('preserves the headline, CTA, destination and phone', () => {
    for (const wording of ['Text a weight-loss', 'Doctor now', 'to see if', 'GLP-1s', 'are right for you.', 'For FREE!', 'Start My Free Doctor Visit', '5–10 min']) expect(heroMarkup).toContain(wording);
    expect(heroMarkup).toContain('href="/intake/"');
    expect(heroMarkup).toContain('class="phone-screen"');
    expect(landing.match(/href="\/intake\//g)).toHaveLength(5);
  });
  it('does not introduce removed hero-step styling into protected intake or menopause pages', () => {
    for (const file of ['client/intake/index.html', 'client/src/pages/WeightLossMenopause.tsx']) {
      expect(metaLeadConversionsHistoricalSource(file, beforeMetaSchedule(file, readFileSync(resolve(root, file), 'utf8')), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"))).not.toContain('hero-start-steps');
    }
  });
});
