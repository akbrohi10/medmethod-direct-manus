import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const pageSource = fs.readFileSync(path.join(projectRoot, "client/src/pages/MasterclassVideoFirst.tsx"), "utf8");
const appSource = fs.readFileSync(path.join(projectRoot, "client/src/App.tsx"), "utf8");

describe("video-first masterclass variant", () => {
  it("registers an isolated /masterclass route without replacing the original page", () => {
    expect(appSource).toContain('const MasterclassVideoFirst = lazy(() => import("@/pages/MasterclassVideoFirst"));');
    expect(appSource).toContain('<Route path="/masterclass" component={MasterclassVideoFirst} />');
    expect(appSource).toContain('<Route path="/free-masterclass" component={FreeMasterclass} />');
    expect(appSource).toContain('location === "/masterclass") return null;');
  });

  it("puts concise context and the recording placeholder before all booking content", () => {
    expect(pageSource).toContain('Perimenopause, Menopause &amp; Weight Loss: What Every Woman 35+ Should Know');
    expect(pageSource).toContain('about perimenopause, menopause, hormones, metabolism, and medical weight loss.');
    expect(pageSource).toContain('Watch Dr. Jumana Al-Deek explain the options women are asking about—plus a recorded live Q&amp;A.');
    expect(pageSource).toContain('data-masterclass-video-first-placeholder');
    expect(pageSource).toContain('Masterclass Recording Coming Soon');
    expect(pageSource).not.toContain('<video');
    expect(pageSource.indexOf('data-masterclass-video-first-player')).toBeLessThan(
      pageSource.indexOf('data-masterclass-video-first-booking'),
    );
    expect(pageSource.indexOf('data-masterclass-video-first-booking')).toBeLessThan(
      pageSource.indexOf('<FeaturedInStrip />'),
    );
    expect(pageSource).toContain('bg-gradient-to-r from-[#25134f] via-[#5b3aa4] to-[#2d185d]');
    expect(pageSource).toContain('webinar2-logo-marquee__track');
    expect(pageSource).toContain('webinar2-logo-marquee__duplicate');
    expect(pageSource).toContain('const isReady = pendingAssets === 0;');
    expect(pageSource).toContain('This Is Menopause');
    expect(pageSource).toContain('Woman’s World');
  });

  it("keeps the established physician and care-team actions after the video", () => {
    expect(pageSource).toContain('data-masterclass-video-first-physician-cta');
    expect(pageSource).toContain('data-masterclass-video-first-care-team-cta');
    expect(pageSource).toContain('href="/care-team-booking"');
    expect(pageSource).toContain('landingPage="/masterclass"');
    expect(pageSource).toContain('landingPage="/masterclass" startAtPayment');
    expect(pageSource).toContain('Dr. Al-Deek has seen');
    expect(pageSource).toContain('50,000+ patients.');
    expect(pageSource).toContain('data-masterclass-video-first-pricing');
  });

  it("keeps complete pricing transparent inside the expandable details section", () => {
    expect(pageSource).toContain('data-masterclass-video-first-pricing-details');
    expect(pageSource).toContain('45-minute physician consultation');
    expect(pageSource).toContain('Reserve today:</strong> $50 deposit');
    expect(pageSource).toContain('Day of visit:</strong> remaining $149');
    expect(pageSource).toContain('data-masterclass-video-first-pay-as-you-go');
    expect(pageSource).toContain('Follow-up visit');
    expect(pageSource).toContain('$150');
    expect(pageSource).toContain('data-masterclass-video-first-ongoing-care');
    expect(pageSource).toContain('$50<span className="text-xl tracking-normal">/month</span>');
    expect(pageSource).toContain('data-masterclass-video-first-weight-loss-pricing');
    expect(pageSource).toContain('~$100–$300');
    expect(pageSource).toContain('~$150–$450');
    expect(pageSource).toContain('data-masterclass-video-first-hormone-pricing');
    expect(pageSource).toContain('~$30–$100');
    expect(pageSource).toContain('~$150–$250');
    expect(pageSource).toContain('Medication is separate from physician care.');
    expect(pageSource).toContain('Medication can be shipped to your door or called into your local pharmacy');
    expect(pageSource).toContain('FDA-approved options');
    expect(pageSource).not.toMatch(/\b(?:Wegovy|Zepbound)\b/i);
    expect(pageSource).toContain('Compounded medications are not FDA-approved.');
    expect(pageSource).toContain('Testosterone is prescribed off-label for hypoactive sexual desire disorder in women.');
  });
});
