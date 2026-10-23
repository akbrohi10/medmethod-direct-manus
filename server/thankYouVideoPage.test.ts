import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
const root = resolve(import.meta.dirname, "..");
const page = readFileSync(resolve(root, "client/src/pages/ThankYouVideo.tsx"), "utf8");
const css = readFileSync(resolve(root, "client/src/pages/thank-you-video.css"), "utf8");
const intake = readFileSync(resolve(root, "client/intake/index.html"), "utf8");
const original = readFileSync(resolve(root, "client/src/components/home1/WL2BookingFollowup.tsx"), "utf8");
const router = readFileSync(resolve(root, "client/src/App.tsx"), "utf8");

describe("isolated video thank-you page", () => {
  it("registers the new route without replacing the original page or sharing its mutable component", () => {
    expect(router).toContain('<Route path="/thank-you2" component={ThankYou2} />');
    expect(router).toContain('<Route path="/thank-you-video" component={ThankYouVideo} />');
    expect(page).not.toContain("WL2BookingFollowup");
    expect(page).not.toContain("dataLayer");
    expect(page).toContain('content="noindex, nofollow"');
  });
  it("preserves the original follow-up wording, account action, contact and section order", () => {
    for (const text of ["Create Your Patient Account", "Accept Your Calendar Invite", "Reply to Our Text to Secure Your Spot", "What Happens Next", "Complete these 3 steps to prepare for your visit", "Questions? Call us anytime", "100% Virtual — No Office Visit Needed", "Create Account"]) {
      expect(original).toContain(text);
      expect(page).toContain(text);
    }
    expect(page).toContain("Continue exploring MedMethod Direct");
    expect(page).toContain('href="https://medmethoddirect.md-hq.com/registration"');
    expect(page.indexOf('className="tyv-calendar-card"')).toBeLessThan(page.indexOf('className="tyv-follow-up-heading"'));
    expect(page.indexOf('className="tyv-follow-ups"')).toBeLessThan(page.indexOf('className="tyv-support-cta"'));
  });
  it("contains only the $39 Zoom video visit offer and never embeds a booking frame before confirmation", () => {
    expect(page).toContain("Zoom video visit — $39");
    expect(page).toContain("Add Zoom Video Visit — $39");
    expect(page).toContain("Pay $39 for your Zoom video visit");
    expect(page).not.toMatch(/\$49|\$15|45.minute|15.minute/);
    expect(page).not.toContain("<iframe");
    expect(page).toContain('id="open-video-checkout" type="button" disabled');
    expect(page).toContain('data-src={BOOKING_URL}');
    expect(page).not.toMatch(/\?email=|\?name=|submission_token=/);
  });
  it("copies every literal palette color and the original typography from intake, with all styles root-scoped", () => {
    const intakeColors = new Set((intake.match(/#[\da-fA-F]{3,8}\b/g) || []).map(x => x.toLowerCase()));
    for (const color of css.match(/#[\da-fA-F]{3,8}\b/g) || []) expect(intakeColors.has(color.toLowerCase()), color).toBe(true);
    expect(css).toContain("font-family: Montserrat, Arial, sans-serif");
    expect(intake).toContain("font-family:Montserrat,Arial,sans-serif");
    expect(css).toContain("--tyv-teal: #0e7c7b");
    expect(css).toContain("--tyv-deep-teal: #075c5c");
    expect(css).toContain("--tyv-dark-button-start: #b6e46e");
    expect(css).toContain("--tyv-dark-button-end: #84cbc7");
    expect(css).toContain("padding: 15px 28px");
    for (const selector of css.matchAll(/(?:^|\})\s*([^{}@]+)\{/g)) {
      for (const part of selector[1].split(",")) expect(part.trim()).toMatch(/^#thank-you-video-root/);
    }
  });
  it("keeps four compact hosted-field wrappers and isolated hidden/receipt states", () => {
    for (const id of ["video-card-name", "video-card-number", "video-card-expiry", "video-card-cvv", "checkout-error", "video-payment-pending", "recover-video-payment"]) expect(page).toContain(`id="${id}"`);
    expect(css).toContain("height: 56px; min-height: 56px; max-height: 56px;");
    expect(css).toContain("#thank-you-video-root [hidden] { display: none !important; }");
    expect(page).toContain('script.src = "/intake/thank-you-video.js"');
  });
});
