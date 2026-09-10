import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(
  resolve(process.cwd(), "client/src/pages/LiveWebinar3Confirmed.tsx"),
  "utf8",
);
const appSource = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
const documentHeadSource = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");
const metaPixelHelperSource = readFileSync(resolve(process.cwd(), "client/src/lib/metaPixel.ts"), "utf8");

describe("live webinar 3 companion confirmation", () => {
  it("registers an isolated confirmation route that preserves the original webinar confirmation page", () => {
    expect(appSource).toContain('const LiveWebinar3Confirmed = lazy(() => import("@/pages/LiveWebinar3Confirmed"));');
    expect(appSource).toContain('<Route path="/live-webinar3-confirmed" component={LiveWebinar3Confirmed} />');
    expect(pageSource).toContain('data-live-webinar3-confirmation');
    expect(pageSource).toContain('href="/"');
    expect(pageSource).not.toContain('href="/live-webinar3"');
    expect(pageSource).toContain('content="noindex, nofollow"');
    expect(pageSource).toContain("Registration Received");
    expect(pageSource).toContain("You’re almost in.");
    expect(pageSource).toContain("Wednesday, September 23");
    expect(pageSource).toContain("7:30 PM EST");
    expect(pageSource).toContain("data-live-webinar3-reply-yes-panel");
    expect(pageSource).toContain("Check your email or texts and reply");
    expect(pageSource).toContain("YES");
    expect(pageSource).toContain("unconfirmed spots will be released to the waitlist");
    expect(pageSource).toContain("Confirm now so you don’t lose your seat.");
    expect(pageSource).not.toContain("You’re all set.");
    expect(pageSource).not.toContain("Free Live Zoom Webinar Confirmed");
  });

  it("restores the fuller educational context after confirmation without a second registration CTA", () => {
    expect(pageSource).toContain('data-live-webinar3-confirmed-learning');
    expect(pageSource).toContain('data-live-webinar3-confirmed-doctor');
    expect(pageSource).toContain("Because You Deserve to Know.");
    expect(pageSource).toContain("Why You Can’t Lose Weight Like You Used To");
    expect(pageSource).toContain("Live Q&A with Dr. Jumana Al-Deek");
    expect(pageSource).toContain("Dr. Jumana Al-Deek");
    expect(pageSource).not.toContain("Reserve My Free Spot");
  });

  it("fires the requested Schedule event once after the existing GTM Pixel becomes available", () => {
    expect(pageSource).toContain('const LIVE_WEBINAR3_CONVERSION_STORAGE_KEY = "medmethod:live-webinar3-registration-conversion-fired"');
    expect(pageSource).toContain('w.dataLayer?.push({ event: "live_webinar3_registration_complete" })');
    expect(pageSource).toContain('w.fbq?.("track", "CompleteRegistration"');
    expect(pageSource).toContain('content_name: "Free Live Zoom Webinar"');
    expect(pageSource).toContain('window.sessionStorage.removeItem(LIVE_WEBINAR3_HANDOFF_STORAGE_KEY)');
    expect(pageSource).not.toContain('"Purchase"');
    expect(pageSource).toContain('eventName: "Schedule"');
    expect(pageSource).toContain('expectedPath: "/live-webinar3-confirmed"');
    expect(pageSource).toContain('const LIVE_WEBINAR3_SCHEDULE_STORAGE_KEY = "medmethod:live-webinar3-registration-schedule-fired"');
    expect(metaPixelHelperSource).toContain('timeoutMs = 60_000');
    expect(metaPixelHelperSource).toContain('typeof fbq === "function"');
    expect(metaPixelHelperSource).toContain('fbq("track", eventName, parameters)');
    expect(documentHeadSource).not.toContain("window.fbq('track', 'Schedule')");
    expect(documentHeadSource).not.toContain("fbq('track', 'Lead')");
  });
});
