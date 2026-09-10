import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(resolve(process.cwd(), "client/src/pages/ThankYou.tsx"), "utf8");
const documentHeadSource = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");

describe("appointment thank-you tracking after Meta removal", () => {
  it("uses the supplied direct Meta Pixel base code without Google Tag Manager", () => {
    expect(documentHeadSource).not.toContain("GTM-KMBG6HSR");
    expect(documentHeadSource).toContain("https://connect.facebook.net/en_US/fbevents.js");
    expect(documentHeadSource.match(/fbq\('init', '1589326469554181'\)/g)).toHaveLength(1);
    expect(documentHeadSource.match(/fbq\('track', 'PageView'\)/g)).toHaveLength(1);
  });

  it("retains only the guarded non-Facebook booking completion signal", () => {
    expect(pageSource).toContain('const THANK_YOU_CONVERSION_STORAGE_KEY = "medmethod:appointment-deposit-conversion-fired"');
    expect(pageSource).toContain("window.sessionStorage.getItem(THANK_YOU_CONVERSION_STORAGE_KEY)");
    expect(pageSource).toContain('window.sessionStorage.setItem(THANK_YOU_CONVERSION_STORAGE_KEY, "1")');
    expect(pageSource).toContain('w.dataLayer?.push({ event: "booking_complete" })');
    expect(pageSource).not.toContain("fbq");
  });
});
