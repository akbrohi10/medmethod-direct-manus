import { readFileSync } from "node:fs";
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
    expect(page).toContain('{(access === "paid" || access === "waived") && <VideoBookingFollowup waived={access === "waived"} />}');
    expect(page).not.toContain("dataLayer");
    expect(page).toContain('content="noindex, nofollow"');
  });
  it("has the exact requested heading, subtitle, badge and calendar introduction", () => {
    expect(page).toContain("One Last Step: Pick Your Time");
    expect(page).toContain("Your $39 Zoom video visit is secured. Choose a date and time below to schedule your visit with Dr. Al-Deek.");
    expect(page).toContain("100% Virtual - No Office Visit Needed");
    expect(page).toContain("Schedule Your Zoom Video Visit with Dr. Al-Deek");
    expect(page).toContain("Pick a date and time that works for you. Your visit isn't scheduled until you choose a time.");
    expect(page).not.toContain("You're Booked!");
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
  it("uses the approved three preparation steps, removes the account button and preserves layout/contact links", () => {
    for (const text of ["Check Your Email for Your Zoom Link", "Create Your Patient Account", "Join Your Zoom Visit", "What Happens Next", "Once you've picked your time, here's how to get ready.", "Your booking confirmation and Zoom link are on their way to your inbox. Add the visit to your calendar so you don't miss it.", "Check your email for your Patient Portal invite. Click the link to create your username and password, then complete your forms before your visit so Dr. Al-Deek can review your information ahead of time.", "At your scheduled time, click the Zoom link in your email to meet with Dr. Al-Deek. Need to reschedule? Just reply to our text or call us.", "Questions? Call us anytime", "Continue exploring MedMethod Direct"]) {
      expect(page).toContain(text);
    }
    expect(page).toContain("icon: Calendar");
    expect(page).toContain("icon: UserPlus");
    expect(page).toContain("icon: Video");
    expect(page).not.toContain("https://medmethoddirect.md-hq.com/registration");
    expect(page).not.toContain("step.link");
    expect(page).toContain('href="tel:8883627011"');
    for (const cls of ['className="w-full max-w-lg mx-auto mb-5 text-center"', 'className={`w-full max-w-lg mx-auto ${spacing}`}', 'className="flex items-start gap-4"']) expect(page).toContain(cls);
  });
  it("checks the existing receipt status before rendering checkout or the unchanged calendar", () => {
    expect(page).toContain('readIntakeVideoReceipt(window.sessionStorage)');
    expect(page).toContain('fetch("/api/intake/video/status"');
    expect(page).toContain('JSON.stringify({ submission_token: receipt.submission_token })');
    expect(page).toContain('confirmedIntakeVideoAccess(result, receipt)');
    expect(page).toContain('receipt && (access === "available" || access === "pending") && <IntakeVideoPayment');
    expect(page).toContain('Complete your free intake first. After submission, you can add an optional $39 Zoom video visit and choose a time.');
    expect(page).toContain('href="/intake/"');
    expect(page).toContain('do not make another payment.');
    expect(page).not.toContain('payment_status=');
    expect(page).not.toContain('submission_token=');
  });
  it("uses only intake-derived palette, fonts and primary-button styles with isolated selectors", () => {
    const colors = new Set((intake.match(/#[\da-fA-F]{3,8}\b/g) || []).map(x => x.toLowerCase()));
    for (const color of css.match(/#[\da-fA-F]{3,8}\b/g) || []) expect(colors.has(color.toLowerCase()), color).toBe(true);
    expect(css).toContain("font-family: Montserrat, Arial, sans-serif");
    expect(css).toContain("background: linear-gradient(90deg, #0e7c7b, #075c5c)");
    expect(css).toContain("padding: 15px 28px");
    expect(css).toContain("padding: 14px 20px");
    expect(page).not.toMatch(/#E8339E|#7A1E7E|Playfair Display/);
    for (const selector of css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/(?:^|\})\s*([^{}@]+)\{/g)) for (const part of selector[1].split(",")) expect(part.trim()).toMatch(/^#thank-you-video-root/);
  });
});
