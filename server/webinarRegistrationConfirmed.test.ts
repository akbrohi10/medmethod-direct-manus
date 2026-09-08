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
    expect(pageSource).toContain('href="/live-webinar2"');
    expect(pageSource).toContain('content="noindex, nofollow"');
  });

  it("fires one guarded webinar CompleteRegistration conversion without purchase semantics", () => {
    expect(pageSource).toContain('const WEBINAR_CONVERSION_STORAGE_KEY = "medmethod:webinar-registration-conversion-fired"');
    expect(pageSource).toContain('window.sessionStorage.getItem(WEBINAR_CONVERSION_STORAGE_KEY)');
    expect(pageSource).toContain('window.sessionStorage.setItem(WEBINAR_CONVERSION_STORAGE_KEY, "1")');
    expect(pageSource).toContain('w.dataLayer?.push({ event: "webinar_registration_complete" })');
    expect(pageSource).toContain('w.fbq?.("track", "CompleteRegistration"');
    expect(pageSource).toContain('content_name: "Live Educational Webinar"');
    expect(pageSource).not.toContain('"Purchase"');
    expect(pageSource).not.toContain('"PageView"');
  });

  it("shows the supplied confirmed event details and inbox reminder without creating a clinical claim", () => {
    expect(pageSource).toContain("Wednesday, September 23");
    expect(pageSource).toContain("7:00 PM ET");
    expect(pageSource).toContain("Your Zoom link has been sent to the email address you used to register");
    expect(pageSource).toContain("This live webinar is for general educational purposes and is not a medical consultation.");
  });
});
