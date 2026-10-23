import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
const root = resolve(import.meta.dirname, "..");
const page = readFileSync(resolve(root, "client/src/pages/ThankYouVideo.tsx"), "utf8");
const css = readFileSync(resolve(root, "client/src/pages/thank-you-video.css"), "utf8");
const intake = readFileSync(resolve(root, "client/intake/index.html"), "utf8");
const original = readFileSync(resolve(root, "client/src/components/home1/WL2BookingFollowup.tsx"), "utf8");
const originalPage = readFileSync(resolve(root, "client/src/pages/ThankYou2.tsx"), "utf8");
const router = readFileSync(resolve(root, "client/src/App.tsx"), "utf8");

describe("video booking confirmation only", () => {
  it("keeps the original page and isolated new route with no additional tracking", () => {
    expect(router).toContain('<Route path="/thank-you2" component={ThankYou2} />');
    expect(router).toContain('<Route path="/thank-you-video" component={ThankYouVideo} />');
    expect(originalPage).toContain("<WL2BookingFollowup />");
    expect(page).toContain("<VideoBookingFollowup />");
    expect(page).not.toContain("dataLayer");
    expect(page).toContain('content="noindex, nofollow"');
  });
  it("has the exact requested heading, subtitle, badge and calendar introduction", () => {
    expect(page).toContain("You're Booked!");
    expect(page).toContain("Your $39 Zoom video visit payment is confirmed. Now pick a time below to meet with Dr. Al-Deek.");
    expect(page).toContain("100% Virtual - No Office Visit Needed");
    expect(page).toContain("Book Your Zoom Video Visit with Dr. Al-Deek");
    expect(page).toContain("Choose a date and time that works for you");
    expect(page).not.toMatch(/\$49|\$15|45.minute|15.minute/);
  });
  it("copies the original iframe source, height, loading setting and structure exactly except its accessible title", () => {
    const iframe = (text: string) => text.slice(text.indexOf("<iframe"), text.indexOf("/>", text.indexOf("<iframe")) + 2);
    expect(iframe(page)).toBe(iframe(original).replace("Book your 15-minute visit with Dr. Al-Deek", "Book your Zoom video visit with Dr. Al-Deek"));
    expect(page).toContain('const BOOKING_URL = "https://link.sendmeapro.com/widget/booking/Ew0Y6y4FVcwaZeb9Y826"');
    expect(page).toContain('const calendarSrc = `${BOOKING_URL}${calendarParams.size ? `?${calendarParams.toString()}` : ""}`');
    expect(page.indexOf("<iframe")).toBeLessThan(page.indexOf("What Happens Next"));
    expect(page).not.toContain('data-src=');
  });
  it("preserves original next-step wording, account link and layout classes", () => {
    for (const text of ["Create Your Patient Account", "Accept Your Calendar Invite", "Reply to Our Text to Secure Your Spot", "What Happens Next", "Complete these 3 steps to prepare for your visit", "Questions? Call us anytime", "Create Account", "https://medmethoddirect.md-hq.com/registration", "Continue exploring MedMethod Direct"]) {
      expect(page).toContain(text);
    }
    for (const cls of ['className="w-full max-w-lg mx-auto mb-5 text-center"', 'className={`w-full max-w-lg mx-auto ${spacing}`}', 'className="flex items-start gap-4"']) expect(page).toContain(cls);
  });
  it("contains no upsell, lock, payment controls, payment script or API calls", () => {
    expect(page).not.toMatch(/Prefer a face-to-face|Add Zoom Video Visit|Complete your \$39 payment|video-checkout|video-card-|PayPal|paypal|ApplePay|unlockVideoCalendar|fetch\(/);
    expect(page).not.toContain("useEffect");
    expect(page).not.toContain("thank-you-video.js");
    expect(existsSync(resolve(root, "client/public/intake/thank-you-video.js"))).toBe(false);
  });
  it("uses only intake-derived palette, fonts and primary-button styles with isolated selectors", () => {
    const colors = new Set((intake.match(/#[\da-fA-F]{3,8}\b/g) || []).map(x => x.toLowerCase()));
    for (const color of css.match(/#[\da-fA-F]{3,8}\b/g) || []) expect(colors.has(color.toLowerCase()), color).toBe(true);
    expect(css).toContain("font-family: Montserrat, Arial, sans-serif");
    expect(css).toContain("background: linear-gradient(90deg, #0e7c7b, #075c5c)");
    expect(css).toContain("padding: 15px 28px");
    expect(css).toContain("padding: 14px 20px");
    expect(page).not.toMatch(/#E8339E|#7A1E7E|Playfair Display/);
    for (const selector of css.matchAll(/(?:^|\})\s*([^{}@]+)\{/g)) for (const part of selector[1].split(",")) expect(part.trim()).toMatch(/^#thank-you-video-root/);
  });
});
