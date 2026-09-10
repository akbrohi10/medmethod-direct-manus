import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(resolve(process.cwd(), "client/src/pages/ThankYou.tsx"), "utf8");
const documentHeadSource = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");

describe("appointment thank-you Meta Pixel conversion", () => {
  it("loads the configured sitewide Meta Pixel base snippet", () => {
    expect(documentHeadSource).toContain("https://connect.facebook.net/en_US/fbevents.js");
    expect(documentHeadSource).toContain("fbq('init', '1589326469554181')");
    expect(documentHeadSource).toContain("fbq('track', 'PageView')");
  });

  it("fires one guarded PageView, Lead, and appointment-completion event on the payment thank-you page", () => {
    expect(pageSource).toContain('const THANK_YOU_CONVERSION_STORAGE_KEY = "medmethod:appointment-deposit-conversion-fired"');
    expect(pageSource).toContain("window.sessionStorage.getItem(THANK_YOU_CONVERSION_STORAGE_KEY)");
    expect(pageSource).toContain('window.sessionStorage.setItem(THANK_YOU_CONVERSION_STORAGE_KEY, "1")');
    expect(pageSource).toContain('w.dataLayer?.push({ event: "booking_complete" })');
    expect(pageSource).toContain('w.fbq?.("track", "PageView")');
    expect(pageSource).toContain('w.fbq?.("track", "Lead")');
    expect(pageSource).toContain('w.fbq?.("track", "CompleteRegistration"');
    expect(pageSource).toContain('content_name: "Physician Consultation Deposit"');
    expect(pageSource).toContain('content_category: "Appointment Deposit"');
    expect(pageSource).not.toContain('"Purchase"');
  });
});
