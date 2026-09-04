import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const pageSource = fs.readFileSync(path.join(root, "client/src/pages/LiveWebinar2.tsx"), "utf8");
const appSource = fs.readFileSync(path.join(root, "client/src/App.tsx"), "utf8");
const originalPageSource = fs.readFileSync(path.join(root, "client/src/pages/LiveWebinar.tsx"), "utf8");
const learningPointsBlock = pageSource.match(/const learningPoints = \[([\s\S]*?)\];/)?.[1] ?? "";
const featuredInBlock = pageSource.match(/<section\s+data-webinar2-featured-in[\s\S]*?<\/section>/)?.[0] ?? "";
const legalFootnoteBlock = pageSource.match(/<div\s+data-webinar2-legal-footnote[\s\S]*?<\/div>/)?.[0] ?? "";
const testosteroneDisclosure =
  "Testosterone is prescribed off-label for hypoactive sexual desire disorder in women. There is no FDA-approved testosterone product for women in the United States. [APPROVED AVAILABILITY DISCLAIMER]";

describe("live webinar 2 second revision prompt", () => {
  it("keeps the nationwide educational variation isolated from the original webinar route", () => {
    expect(appSource).toContain('const LiveWebinar2 = lazy(() => import("@/pages/LiveWebinar2"));');
    expect(appSource).toContain('<Route path="/live-webinar2" component={LiveWebinar2} />');
    expect(appSource).toContain('<Route path="/live-webinar" component={LiveWebinar} />');
    expect(appSource).toContain('location === "/live-webinar" || location === "/live-webinar2"');
    expect(originalPageSource).not.toContain("data-live-webinar2");
  });

  it("uses the approved centered hero with a clear live Zoom banner and age-35-plus educational framing", () => {
    expect(pageSource).toContain("data-webinar2-hero");
    expect(pageSource).toContain("data-webinar2-centered-hero");
    expect(pageSource).toContain("data-webinar2-zoom-banner");
    expect(pageSource).toContain("Live on Zoom");
    expect(pageSource).toContain("Free Educational Webinar");
    expect(pageSource).toContain("mx-auto max-w-[800px] text-center");
    expect(pageSource).not.toContain("lg:grid-cols-[minmax(0,1.22fr)_minmax(0,1fr)]");
    expect(pageSource).toContain("Free Live Webinar · For Women 35+");
    expect(pageSource).toContain("You’re not imagining it.");
    expect(pageSource).toContain("Here’s what’s actually changing — and what you can do about it.");
    expect(pageSource).not.toContain("After 35");
    expect(pageSource).not.toContain("After 40");
    expect(pageSource).toContain("A free educational webinar with Dr. Jumana Al-Deek.");
    expect(pageSource).toContain('Author of <em className="font-bold">The Menopause Weight Loss Trap</em>');
    expect(pageSource).toContain("Available nationwide for this free educational webinar.");
    expect(pageSource).toContain("See states");
    expect(pageSource).toContain("data-webinar2-state-list-token");
    expect(pageSource).toContain("[STATE LIST]");
    expect(pageSource).not.toContain("Live and free — for women in Florida.");
  });

  it("uses the centered conversion hierarchy with video, primary CTA, countdown, and inactive form in order", () => {
    expect(pageSource).not.toContain("data-webinar2-brand-logo");
    expect(pageSource).not.toContain("medmethod-logo-navbar_99a2ea82.png");
    expect(pageSource.indexOf("data-webinar2-zoom-banner")).toBeLessThan(pageSource.indexOf("data-webinar2-opening-copy"));
    expect(pageSource.indexOf("Free Live Webinar · For Women 35+")).toBeLessThan(pageSource.indexOf("You’re not imagining it."));
    expect(pageSource.indexOf("You’re not imagining it.")).toBeLessThan(pageSource.indexOf("data-webinar2-video-shell"));
    expect(pageSource.indexOf("data-webinar2-video-shell")).toBeLessThan(pageSource.indexOf("data-webinar2-primary-cta"));
    expect(pageSource.indexOf("data-webinar2-primary-cta")).toBeLessThan(pageSource.indexOf("data-webinar2-countdown-bar"));
    expect(pageSource.indexOf("data-webinar2-countdown-bar")).toBeLessThan(pageSource.indexOf("data-webinar2-registration-preview"));
    expect(pageSource.indexOf("data-webinar2-registration-preview")).toBeLessThan(pageSource.indexOf("data-webinar2-event-line"));
    expect(pageSource).toContain("aspect-video");
    expect(pageSource).not.toContain("sm:aspect-[4/5]");
    expect(pageSource).toContain("max-w-[800px]");
    expect(pageSource).toContain("data-webinar2-compact-presenter");
  });

  it("keeps secondary nationwide availability below the registration details and full authorship in the presenter section", () => {
    expect(pageSource).toContain("data-webinar2-short-intro");
    expect(pageSource.indexOf("data-webinar2-availability")).toBeGreaterThan(pageSource.indexOf("data-webinar2-registration-preview"));
    expect(pageSource.indexOf("data-webinar2-availability")).toBeGreaterThan(pageSource.indexOf("Privacy Policy"));
    expect(pageSource.indexOf("data-webinar2-presenter")).toBeGreaterThan(pageSource.indexOf("data-webinar2-learning"));
  });

  it("adds exactly two visual-only form fields and keeps every RSVP action focused on that inactive form", () => {
    expect(pageSource).toContain("data-webinar2-registration-preview");
    expect(pageSource.match(/<input\b/g)).toHaveLength(2);
    expect(pageSource).toContain('name="firstName"');
    expect(pageSource).toContain('name="email"');
    expect(pageSource).toContain('type="email"');
    expect(pageSource).toContain("event.preventDefault()");
    expect(pageSource).toContain("Registration is not connected yet. This form is for visual review only.");
    expect(pageSource).toContain("scrollIntoView");
    expect(pageSource).toContain("querySelector<HTMLInputElement>('input[name=\"firstName\"]')");
    expect(pageSource.match(/onClick=\{handleReserveSeat\}/g)).toHaveLength(3);
    expect(pageSource.match(/Reserve My Free Spot/g)).toHaveLength(3);
    expect(pageSource).not.toContain("Yes — Reserve My Free Spot");
    expect(pageSource).toContain("Can’t attend live? Register anyway and we’ll send you the recording.");
    expect(pageSource).toContain('href="/privacy-policy"');
    expect(pageSource.match(/<a\b/g)).toHaveLength(1);
    expect(pageSource).not.toMatch(/fetch\(|trpc\.|webhook|stripe|paypal/i);
  });

  it("uses one editable date-time configuration for the dormant countdown below the primary CTA and above the form", () => {
    expect(pageSource).toContain("const WEBINAR_EVENT = {");
    expect(pageSource).toContain("startsAt: null as string | null");
    expect(pageSource).toContain('dateTimeDisplay: "[DAY], [MONTH] [DATE] · [TIME] [TIMEZONE]"');
    expect(pageSource).toContain('timezone: "[TIMEZONE]"');
    expect(pageSource).toContain('duration: "[DURATION]"');
    expect(pageSource).toContain("const eventDateLine =");
    expect(pageSource).toContain("if (!WEBINAR_EVENT.startsAt) return;");
    expect(pageSource).toContain("window.setInterval(updateCountdown, 1_000)");
    expect(pageSource).toContain("data-webinar2-countdown-bar");
    expect(pageSource.indexOf("data-webinar2-countdown-bar")).toBeGreaterThan(pageSource.indexOf("data-webinar2-primary-cta"));
    expect(pageSource.indexOf("data-webinar2-countdown-bar")).toBeLessThan(pageSource.indexOf("data-webinar2-registration-preview"));
  });

  it("shows only four dark countdown boxes and their unit labels", () => {
    expect(pageSource).not.toContain("data-webinar2-countdown-label");
    expect(pageSource).not.toContain("data-webinar2-countdown-timezone");
    expect(pageSource).not.toContain("data-webinar2-countdown-preview-token");
    expect(pageSource).not.toContain("[COUNTDOWN ACTIVATES WHEN EVENT DATE IS SET]");
    expect(pageSource).not.toContain("Event Countdown ·");
    expect(pageSource).not.toContain("Clock3");
    expect(pageSource).toContain('aria-label="Webinar countdown"');
    expect(pageSource).toContain("grid grid-cols-4 gap-2 sm:gap-3");
    expect(pageSource).toContain("bg-[#26222d]");
    for (const unit of ["Days", "Hours", "Minutes", "Seconds"]) {
      expect(pageSource).toContain(`label: "${unit}"`);
    }
  });

  it("places Featured In below the hero video and preserves all six logos", () => {
    expect(pageSource.indexOf("data-webinar2-featured-in")).toBeGreaterThan(pageSource.indexOf("data-webinar2-video-shell"));
    expect(pageSource.indexOf("data-webinar2-featured-in")).toBeLessThan(pageSource.indexOf("data-webinar2-learning"));
    expect(featuredInBlock).toContain("Featured In");
    expect(featuredInBlock).toContain("py-3");
    expect(featuredInBlock).toContain("grid-cols-3");
    expect(featuredInBlock).toContain("sm:grid-cols-6");

    for (const outlet of ["Flow Space", "SingleCare", "NTD", "Scary Mommy", "Daily Mail", "Yahoo Health"]) {
      expect(pageSource).toContain(`name: "${outlet}"`);
    }
  });

  it("uses compact and full presenter treatments with real media and visible tokens", () => {
    expect(pageSource).toContain("data-webinar2-compact-presenter");
    expect(pageSource).toContain("data-webinar2-compact-credentials-token");
    expect(pageSource).toContain("[CREDENTIALS]");
    expect(pageSource).toContain("data-webinar2-presenter");
    expect(pageSource.indexOf("data-webinar2-presenter")).toBeGreaterThan(pageSource.indexOf("data-webinar2-learning"));
    expect(pageSource).toContain('/manus-storage/dr-jumana-al-deek-headshot_75912bc8.png');
    expect(pageSource).toContain('/manus-storage/menopause-weight-loss-trap-book-cover-transparent_02607d91.png');
    expect(pageSource).toContain("data-webinar2-credentials-token");
    expect(pageSource).toContain("[CREDENTIALS — BOARD CERTIFICATION, SPECIALTY, YEARS IN PRACTICE]");
    expect(pageSource).toContain("Author of <em className=\"font-bold\">The Menopause Weight Loss Trap</em>");
  });

  it("uses the four requested learning points in order and preserves the current inline video behavior", () => {
    expect(learningPointsBlock.match(/^\s*"/gm)).toHaveLength(4);
    const expectedPoints = [
      "The truth about hormone therapy (HRT)",
      "Why losing weight can suddenly become harder in your late 30s and 40s",
      "What's actually happening to your hormones during perimenopause and menopause",
      "How GLP-1 medications work",
    ];
    const positions = expectedPoints.map(point => learningPointsBlock.indexOf(point));
    positions.forEach(position => expect(position).toBeGreaterThanOrEqual(0));
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(learningPointsBlock).not.toContain("The connection between hormones, menopause and weight management");
    expect(learningPointsBlock).not.toContain("What good menopause care should actually look like");
    expect(pageSource).toContain("Watch: [VIDEO LENGTH]");
    expect(pageSource).toContain("h-16 w-16");
    expect(pageSource).toContain('video.setAttribute("playsinline", "")');
    expect(pageSource).toContain('video.setAttribute("webkit-playsinline", "")');
    expect(pageSource).toContain("entry.intersectionRatio >= 0.6");
    expect(pageSource).toContain("video.pause()");
    expect(pageSource).toContain("Play Video With Sound");
  });

  it("keeps review safeguards and separates the exact disclosure from media credibility", () => {
    expect(pageSource).toContain('<meta name="robots" content="noindex, nofollow" />');
    expect(pageSource).toContain('href="https://medmethoddirect.com/live-webinar2"');
    expect(pageSource).toContain("This live webinar is for general educational purposes and is not a medical consultation. Individual treatment recommendations require an appropriate medical evaluation.");
    expect(legalFootnoteBlock).toContain(testosteroneDisclosure);
    expect(pageSource).toContain("[APPROVED AVAILABILITY DISCLAIMER]");
    expect(pageSource).not.toContain("This treatment is available only to patients in Florida.");
    expect(pageSource.indexOf("data-webinar2-legal-footnote")).toBeGreaterThan(pageSource.indexOf("data-webinar2-final-cta"));
    expect(pageSource).toContain("data-webinar2-final-cta");
    expect(pageSource).toContain("rounded-full bg-[#faf4f8]");
    expect(pageSource).not.toMatch(/<button[\s\S]{0,300}Live Q&amp;A with Dr\. Al-Deek/);
  });
});
