import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const pageSource = fs.readFileSync(path.join(projectRoot, "client/src/pages/FreeMasterclass.tsx"), "utf8");
const appSource = fs.readFileSync(path.join(projectRoot, "client/src/App.tsx"), "utf8");

describe("free evergreen masterclass landing page", () => {
  it("registers the isolated evergreen route", () => {
    expect(appSource).toContain('const FreeMasterclass = lazy(() => import("@/pages/FreeMasterclass"));');
    expect(appSource).toContain('<Route path="/free-masterclass" component={FreeMasterclass} />');
  });

  it("uses the approved symptom-first introduction while retaining immediate on-demand placeholder-video access", () => {
    expect(pageSource).toContain('data-free-masterclass-symptom-intro');
    expect(pageSource).toContain('data-free-masterclass-context-banner');
    expect(pageSource).toContain('Free 45-Minute On-Demand Masterclass');
    expect(pageSource).toContain('Because You Deserve to Know.');
    expect(pageSource).toContain('For Women 35+');
    expect(pageSource).toContain('Struggling With Weight Gain, Poor Sleep, Hot Flashes or Mood Swings?');
    expect(pageSource).toContain('Understand Perimenopause, Menopause, Hormone Therapy &amp; Medical Weight Loss.');
    expect(pageSource).toContain('Physician and author of <em>The Menopause Weight Loss Trap</em>');
    expect(pageSource).toContain('dr-jumana-al-deek-headshot_75912bc8.png');
    expect(pageSource).toContain('data-free-masterclass-video');
    expect(pageSource).toContain('replacement-speaking-event-web_3c5c62ae.mp4');
    expect(pageSource).toContain('controls playsInline preload="metadata"');
    expect(pageSource).toContain('Free On-Demand Masterclass · Watch Now');
    expect(pageSource).toContain('MASTERCLASS PREVIEW');
    expect(pageSource).toContain('Preview video shown while the full 45-minute masterclass is finalized.');
    expect(pageSource).not.toContain('Reserve My Free Spot');
    expect(pageSource).not.toContain('Limited Zoom Capacity');
  });

  it("places Featured In above the physician authority card and keeps brand contact access in the footer", () => {
    const featuredInIndex = pageSource.indexOf('<FeaturedInStrip />');
    const authorityCardIndex = pageSource.indexOf('Physician and author of <em>The Menopause Weight Loss Trap</em>');
    const footerIndex = pageSource.indexOf('<footer');

    expect(pageSource).not.toContain('<header className="border-b border-[#e7e0e4]');
    expect(featuredInIndex).toBeGreaterThan(pageSource.indexOf('Understand Perimenopause, Menopause, Hormone Therapy'));
    expect(featuredInIndex).toBeLessThan(authorityCardIndex);
    expect(pageSource.indexOf('href="tel:+18883627011"', footerIndex)).toBeGreaterThan(footerIndex);
    expect(pageSource.indexOf('src={LOGO}', footerIndex)).toBeGreaterThan(footerIndex);
  });

  it("keeps the established featured outlets, booking choices, and transparent pricing without a lower calendar embed", () => {
    expect(pageSource).toContain('This Is Menopause');
    expect(pageSource).toContain('Woman’s World');
    expect(pageSource).toContain('data-free-masterclass-physician-cta');
    expect(pageSource).toContain('data-free-masterclass-care-team-cta');
    expect(pageSource).toContain('href="/care-team-booking"');
    expect(pageSource).toContain('data-free-masterclass-pricing');
    expect(pageSource).toContain('See Full Pricing Details');
    expect(pageSource).not.toContain('data-free-masterclass-care-team-calendar');
    expect(pageSource).not.toContain('18sbmUpLKjc7pcLE8jdN_free_masterclass');
    expect(pageSource).not.toContain('CARE_TEAM_CALENDAR_ORIGIN');
  });
});
