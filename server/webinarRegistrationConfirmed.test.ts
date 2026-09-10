import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(
  resolve(process.cwd(), "client/src/pages/WebinarRegistrationConfirmed.tsx"),
  "utf8",
);
const appSource = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");

describe("webinar registration conversion confirmation", () => {
  it("registers a dedicated public route without reusing appointment or payment thank-you pages", () => {
    expect(appSource).toContain('const WebinarRegistrationConfirmed = lazy(() => import("@/pages/WebinarRegistrationConfirmed"));');
    expect(appSource).toContain('<Route path="/webinar-registration-confirmed" component={WebinarRegistrationConfirmed} />');
    expect(pageSource).toContain('data-webinar-registration-confirmation');
    expect(pageSource).toContain('href="/"');
    expect(pageSource).not.toContain('href="/live-webinar2"');
    expect(pageSource).toContain("Read More About Dr. Jumana Al-Deek");
    expect(pageSource).toContain('href="tel:+18883627011"');
    expect(pageSource).toContain("(888) 362-7011");
    expect(pageSource).not.toContain("Call Us");
    expect(pageSource).toContain("Registration Received");
    expect(pageSource).toContain("You’re almost in.");
    expect(pageSource).toContain("data-webinar-reply-yes-panel");
    expect(pageSource).toContain("Check your email or texts and reply");
    expect(pageSource).toContain("unconfirmed spots will be released to the waitlist");
    expect(pageSource).toContain("Confirm now so you don’t lose your seat.");
    expect(pageSource).not.toContain("You’re all set.");
    expect(pageSource).not.toContain("Webinar Registration Confirmed");
    expect(pageSource.match(/href="tel:\+18883627011"/g)).toHaveLength(1);
    expect(pageSource.indexOf("Read More About Dr. Jumana Al-Deek")).toBeLessThan(pageSource.indexOf("Questions? Call us at"));
    expect(pageSource).toContain('content="noindex, nofollow"');
  });

  it("fires one guarded webinar PageView, Lead, and CompleteRegistration conversion without purchase semantics", () => {
    expect(pageSource).toContain('const WEBINAR_CONVERSION_STORAGE_KEY = "medmethod:webinar-registration-conversion-fired"');
    expect(pageSource).toContain('window.sessionStorage.getItem(WEBINAR_CONVERSION_STORAGE_KEY)');
    expect(pageSource).toContain('window.sessionStorage.setItem(WEBINAR_CONVERSION_STORAGE_KEY, "1")');
    expect(pageSource).toContain('w.fbq?.("track", "PageView")');
    expect(pageSource).toContain('w.fbq?.("track", "Lead")');
    expect(pageSource).toContain('w.dataLayer?.push({ event: "webinar_registration_complete" })');
    expect(pageSource).toContain('w.fbq?.("track", "CompleteRegistration"');
    expect(pageSource).toContain('content_name: "Live Educational Webinar"');
    expect(pageSource).not.toContain('"Purchase"');
  });

  it("forwards only a recent page-three registration handoff before rendering or tracking the original confirmation", () => {
    expect(pageSource).toContain('const LIVE_WEBINAR3_HANDOFF_STORAGE_KEY = "medmethod:live-webinar3-confirmation-handoff"');
    expect(pageSource).toContain('const LIVE_WEBINAR3_CONFIRMATION_PATH = "/live-webinar3-confirmed"');
    expect(pageSource).toContain('const LIVE_WEBINAR3_HANDOFF_WINDOW_MS = 30 * 60 * 1000');
    expect(pageSource).toContain('window.location.replace(LIVE_WEBINAR3_CONFIRMATION_PATH)');
    expect(pageSource).toContain('if (isLiveWebinar3Handoff) return null');
    expect(pageSource.indexOf('window.location.replace(LIVE_WEBINAR3_CONFIRMATION_PATH)')).toBeLessThan(
      pageSource.indexOf('w.dataLayer?.push({ event: "webinar_registration_complete" })'),
    );
  });

  it("shows the supplied event details and reply-YES confirmation instruction without creating a clinical claim", () => {
    expect(pageSource).toContain("Wednesday, September 23");
    expect(pageSource).toContain("7:30 PM EST");
    expect(pageSource).toContain("reply");
    expect(pageSource).toContain("YES");
    expect(pageSource).toContain("This live webinar is for general educational purposes and is not a medical consultation.");
  });
});
