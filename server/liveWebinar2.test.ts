import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const pageSource = fs.readFileSync(path.join(root, "client/src/pages/LiveWebinar2.tsx"), "utf8");
const appSource = fs.readFileSync(path.join(root, "client/src/App.tsx"), "utf8");
const originalPageSource = fs.readFileSync(path.join(root, "client/src/pages/LiveWebinar.tsx"), "utf8");
const testosteroneDisclosure =
  "Testosterone is prescribed off-label for hypoactive sexual desire disorder in women. There is no FDA-approved testosterone product for women in the United States. This treatment is available only to patients in Florida.";
const featuredInFooter = pageSource.match(/<footer\s+data-webinar2-featured-in[\s\S]*?<\/footer>/)?.[0] ?? "";
const legalFootnoteBlock = pageSource.match(/<div\s+data-webinar2-legal-footnote[\s\S]*?<\/div>/)?.[0] ?? "";

describe("live webinar 2 lean variation", () => {
  it("registers an isolated public review route without replacing the original webinar", () => {
    expect(appSource).toContain('const LiveWebinar2 = lazy(() => import("@/pages/LiveWebinar2"));');
    expect(appSource).toContain('<Route path="/live-webinar2" component={LiveWebinar2} />');
    expect(appSource).toContain('<Route path="/live-webinar" component={LiveWebinar} />');
    expect(appSource).toContain('location === "/live-webinar" || location === "/live-webinar2"');
    expect(originalPageSource).not.toContain("data-live-webinar2");
  });

  it("uses the lean reference-inspired hierarchy and supplied webinar content", () => {
    expect(pageSource).toContain("data-webinar2-card");
    expect(pageSource).toContain("data-webinar2-hero");
    expect(pageSource).toContain("Free Live Webinar");
    expect(pageSource).toContain("Understand What’s Really Happening to Your Body");
    expect(pageSource).toContain("After 35.");
    expect(pageSource).toContain("data-webinar2-event-row");
    expect(pageSource).toContain("data-webinar2-content-split");
    expect(pageSource).toContain("data-webinar2-learning");
    expect(pageSource.match(/onClick=\{handleReserveSeat\}/g)).toHaveLength(2);
    expect(pageSource).not.toContain("WOMEN ARE");
    expect(pageSource).not.toContain("data-webinar-symptoms");
  });

  it("uses a clearly labeled non-running countdown placeholder", () => {
    expect(pageSource).toContain("data-webinar2-countdown-placeholder");
    expect(pageSource).toContain("Countdown Placeholder · Preview Only");
    expect(pageSource).toContain("Activates when the webinar date and time are confirmed.");
    expect(pageSource).toContain('{ value: "00", label: "Days" }');
    expect(pageSource).toContain('{ value: "00", label: "Hours" }');
    expect(pageSource).toContain('{ value: "00", label: "Minutes" }');
    expect(pageSource).toContain('{ value: "00", label: "Seconds" }');
    expect(pageSource).not.toMatch(/setInterval|setTimeout|Date\.now|new Date/);
  });

  it("keeps RSVP inactive and preserves review-only compliance safeguards", () => {
    expect(pageSource).toContain('toast.info("Registration details are coming soon.")');
    expect(pageSource).not.toMatch(/<form\b|fetch\(|trpc\.|webhook|stripe|paypal/i);
    expect(pageSource).toContain('<meta name="robots" content="noindex, nofollow" />');
    expect(pageSource).toContain('href="https://medmethoddirect.com/live-webinar2"');
    expect(pageSource).toContain("This live webinar is for general educational purposes and is not a medical consultation.");
    expect(pageSource).toContain(testosteroneDisclosure);
    expect(pageSource).not.toContain("<ComplianceDisclosures testosteroneForWomen />");
    expect(pageSource).not.toContain("Medication Disclosures");
  });

  it("reuses the current video assets and inline visibility-based playback safeguards", () => {
    expect(pageSource).toContain('/manus-storage/replacement-speaking-event-web_3c5c62ae.mp4');
    expect(pageSource).toContain('/manus-storage/replacement-speaking-event-poster_5353b331.jpg');
    expect(pageSource).toContain('video.setAttribute("playsinline", "")');
    expect(pageSource).toContain('video.setAttribute("webkit-playsinline", "")');
    expect(pageSource).toContain('video.addEventListener("webkitbeginfullscreen", keepPlaybackInline)');
    expect(pageSource).toContain("entry.intersectionRatio >= 0.6");
    expect(pageSource).toContain("video.pause()");
    expect(pageSource).toContain("Play Video With Sound");
    expect(pageSource).toContain('controlsList="nodownload noremoteplayback nofullscreen"');
  });

  it("places the six existing monochrome outlet logos in Featured In at the bottom", () => {
    expect(pageSource).toContain("data-webinar2-featured-in");
    expect(pageSource).toContain("data-webinar2-legal-footnote");
    expect(pageSource).toContain("data-webinar2-testosterone-footnote");
    expect(pageSource).toContain("Featured In");
    expect(pageSource.indexOf("data-webinar2-featured-in")).toBeGreaterThan(pageSource.indexOf("data-webinar2-content-split"));
    expect(pageSource.indexOf("data-webinar2-legal-footnote")).toBeGreaterThan(pageSource.indexOf("</footer>"));
    expect(featuredInFooter).not.toContain(testosteroneDisclosure);
    expect(featuredInFooter).not.toContain("data-webinar2-testosterone-footnote");
    expect(legalFootnoteBlock).toContain(testosteroneDisclosure);
    expect(legalFootnoteBlock).toContain("bg-[#f3f0eb]");
    expect(legalFootnoteBlock).toContain("text-[9px]");
    expect(legalFootnoteBlock).toContain("sm:text-[10px]");
    expect(legalFootnoteBlock).toContain("text-[#5f5760]");

    for (const outlet of ["Flow Space", "SingleCare", "NTD", "Scary Mommy", "Daily Mail", "Yahoo Health"]) {
      expect(pageSource).toContain(`name: "${outlet}"`);
    }

    for (const asset of [
      "/manus-storage/flow-space-white_beb898dc.png",
      "/manus-storage/singlecare-white_500a5691.png",
      "/manus-storage/ntd-white_dd8e5f55.png",
      "/manus-storage/scary-mommy-white_b136c1bf.png",
      "/manus-storage/daily-mail-white_bc1019ba.png",
      "/manus-storage/yahoo-health-white_125ff57a.png",
    ]) {
      expect(pageSource).toContain(asset);
    }
  });
});
