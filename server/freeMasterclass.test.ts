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

  it("uses the approved symptom-first introduction with a static recording placeholder", () => {
    expect(pageSource).toContain('<title>Free On-Demand Masterclass | MedMethod Direct</title>');
    expect(pageSource).toContain('data-free-masterclass-symptom-intro');
    expect(pageSource).toContain('data-free-masterclass-context-banner');
    expect(pageSource).toContain('Free On-Demand Masterclass');
    expect(pageSource).toContain('Because You Deserve to Know.');
    expect(pageSource).toContain('For Women 35+');
    expect(pageSource).toContain('Struggling With Weight Gain, Poor Sleep, Hot Flashes or Mood Swings?');
    expect(pageSource).toContain('Understand Perimenopause, Menopause, Hormone Therapy &amp; Medical Weight Loss.');
    expect(pageSource).toContain('Physician and author of <em>The Menopause Weight Loss Trap</em>');
    expect(pageSource).toContain('dr-jumana-al-deek-headshot_75912bc8.png');
    expect(pageSource).toContain('data-free-masterclass-video');
    expect(pageSource).toContain('medmethod-on-demand-masterclass-poster_52bb13b2.jpg');
    expect(pageSource).toContain('data-free-masterclass-video-placeholder');
    expect(pageSource).toContain('Masterclass Recording Coming Soon');
    expect(pageSource).toContain('The full on-demand masterclass, including the recorded live Q&amp;A with Dr. Al-Deek, will be available here soon.');
    expect(pageSource).not.toContain('medmethod-on-demand-masterclass_2c3c01d5.mp4');
    expect(pageSource).not.toContain('<video');
    expect(pageSource).not.toContain('Playback speed');
    expect(pageSource).not.toContain('FULL RECORDING');
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
    expect(pageSource).toContain('data-free-masterclass-patient-volume-proof');
    expect(pageSource).toContain('Dr. Al-Deek has seen');
    expect(pageSource).toContain('50,000+ patients.');
    expect(pageSource.indexOf('data-free-masterclass-patient-volume-proof')).toBeLessThan(
      pageSource.indexOf('data-free-masterclass-physician-cta'),
    );
    expect(pageSource).toContain('href="/care-team-booking"');
    expect(pageSource).toContain('data-free-masterclass-pricing');
    expect(pageSource).toContain('See Full Pricing Details');
    expect(pageSource).not.toContain('data-free-masterclass-care-team-calendar');
    expect(pageSource).not.toContain('18sbmUpLKjc7pcLE8jdN_free_masterclass');
    expect(pageSource).not.toContain('CARE_TEAM_CALENDAR_ORIGIN');
  });
});
