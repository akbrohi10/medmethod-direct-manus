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
  "Testosterone is prescribed off-label for hypoactive sexual desire disorder in women. There is no FDA-approved testosterone product for women in the United States. This treatment is available only to patients in Florida.";

describe("live webinar 2 revision-prompt implementation", () => {
  it("keeps the variation isolated from the original webinar route", () => {
    expect(appSource).toContain('const LiveWebinar2 = lazy(() => import("@/pages/LiveWebinar2"));');
    expect(appSource).toContain('<Route path="/live-webinar2" component={LiveWebinar2} />');
    expect(appSource).toContain('<Route path="/live-webinar" component={LiveWebinar} />');
    expect(appSource).toContain('location === "/live-webinar" || location === "/live-webinar2"');
    expect(originalPageSource).not.toContain("data-live-webinar2");
  });

  it("uses the revised age-40 hero, author byline, Florida line, logo, and non-link label", () => {
    expect(pageSource).toContain('src={BRAND_LOGO_URL}');
    expect(pageSource).toContain('/manus-storage/medmethod-logo-navbar_99a2ea82.png');
    expect(pageSource).toContain("Free Live Webinar");
    expect(pageSource).toContain("uppercase tracking-[0.24em]");
    expect(pageSource).not.toMatch(/Free Live Webinar[\s\S]{0,120}underline/);
    expect(pageSource).toContain("After 40.");
    expect(pageSource).not.toContain("After 35.");
    expect(pageSource).toContain("Perimenopause, menopause, hormone therapy and medical weight loss — explained clearly by Dr. Jumana Al-Deek, author of");
    expect(pageSource).toContain("<em>The Menopause Weight Loss Trap</em>");
    expect(pageSource).toContain("Live and free — for women in Florida.");
  });

  it("adds exactly two visual-only form fields and keeps all registration behavior inactive", () => {
    expect(pageSource).toContain("data-webinar2-registration-preview");
    expect(pageSource.match(/<input\b/g)).toHaveLength(2);
    expect(pageSource).toContain('name="firstName"');
    expect(pageSource).toContain('type="email"');
    expect(pageSource).toContain("event.preventDefault()");
    expect(pageSource).toContain("Registration is not connected yet. This form is for visual review only.");
    expect(pageSource).toContain("Can’t attend live? Register anyway and we’ll send you the recording.");
    expect(pageSource).toContain('href="/privacy-policy"');
    expect(pageSource.match(/Reserve My Free Spot/g)).toHaveLength(3);
    expect(pageSource).not.toContain("Yes — Reserve My Free Spot");
    expect(pageSource).toContain("scrollIntoView");
    expect(pageSource).not.toMatch(/fetch\(|trpc\.|webhook|stripe|paypal/i);
  });

  it("uses one editable event configuration and leaves the timer dormant while tokens remain", () => {
    expect(pageSource).toContain("const WEBINAR_EVENT = {");
    expect(pageSource).toContain("startsAt: null as string | null");
    for (const token of ["[DAY]", "[MONTH]", "[DATE]", "[TIME]", "[TIMEZONE]", "[DURATION]"]) {
      expect(pageSource).toContain(token);
    }
    expect(pageSource).toContain("const eventDetails =");
    expect(pageSource).toContain("if (!WEBINAR_EVENT.startsAt) return;");
    expect(pageSource).toContain("window.setInterval(updateCountdown, 1_000)");
    expect(pageSource).toContain("data-webinar2-countdown-timezone");
    expect(pageSource).toContain("data-webinar2-countdown-preview-note");
    expect(pageSource).not.toContain("Countdown Placeholder · Preview Only");
  });

  it("moves Featured In beneath the form and uses the real presenter and book assets", () => {
    expect(pageSource.indexOf("data-webinar2-featured-in")).toBeGreaterThan(pageSource.indexOf("data-webinar2-registration-preview"));
    expect(pageSource.indexOf("data-webinar2-featured-in")).toBeLessThan(pageSource.indexOf("data-webinar2-event-row"));
    expect(featuredInBlock).toContain("Featured In");
    expect(featuredInBlock).toContain("sm:grid-cols-6");
    expect(pageSource).toContain("data-webinar2-presenter");
    expect(pageSource).toContain('/manus-storage/dr-jumana-al-deek-headshot_75912bc8.png');
    expect(pageSource).toContain('/manus-storage/menopause-weight-loss-trap-book-cover-transparent_02607d91.png');
    expect(pageSource).toContain("data-webinar2-credentials-token");
    expect(pageSource).toContain("[CREDENTIALS — BOARD CERTIFICATION, SPECIALTY, YEARS IN PRACTICE]");
    expect(pageSource).toContain("Author of <em className=\"font-bold\">The Menopause Weight Loss Trap</em>");

    for (const outlet of ["Flow Space", "SingleCare", "NTD", "Scary Mommy", "Daily Mail", "Yahoo Health"]) {
      expect(pageSource).toContain(`name: "${outlet}"`);
    }
  });

  it("uses the four supplied learning points in the requested order and removes the other two", () => {
    expect(learningPointsBlock.match(/^\s*"/gm)).toHaveLength(4);
    const expectedPoints = [
      "The truth about hormone therapy (HRT)",
      "Why losing weight can suddenly become harder after 40",
      "What’s actually happening to your hormones during perimenopause and menopause",
      "How GLP-1 medications work",
    ];
    const positions = expectedPoints.map(point => learningPointsBlock.indexOf(point));
    positions.forEach(position => expect(position).toBeGreaterThanOrEqual(0));
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(learningPointsBlock).not.toContain("The connection between hormones, menopause and weight management");
    expect(learningPointsBlock).not.toContain("What good menopause care should actually look like");
  });

  it("adds the video-length token, preserves inline playback, and uses a non-interactive Q&A pill", () => {
    expect(pageSource).toContain("data-webinar2-video-length-token");
    expect(pageSource).toContain("Watch: [VIDEO LENGTH]");
    expect(pageSource).toContain("h-16 w-16");
    expect(pageSource).toContain('video.setAttribute("playsinline", "")');
    expect(pageSource).toContain('video.setAttribute("webkit-playsinline", "")');
    expect(pageSource).toContain("entry.intersectionRatio >= 0.6");
    expect(pageSource).toContain("video.pause()");
    expect(pageSource).toContain("Play Video With Sound");
    expect(pageSource).toContain("rounded-full bg-[#faf4f8]");
    expect(pageSource).not.toMatch(/<button[\s\S]{0,300}Live Q&amp;A with Dr\. Al-Deek/);
  });

  it("adds the final CTA above the unchanged review-only disclosures", () => {
    expect(pageSource).toContain("data-webinar2-final-cta");
    expect(pageSource.indexOf("data-webinar2-final-cta")).toBeLessThan(pageSource.indexOf("This live webinar is for general educational purposes"));
    expect(pageSource).toContain('<meta name="robots" content="noindex, nofollow" />');
    expect(pageSource).toContain('href="https://medmethoddirect.com/live-webinar2"');
    expect(pageSource).toContain("This live webinar is for general educational purposes and is not a medical consultation. Individual treatment recommendations require an appropriate medical evaluation.");
    expect(legalFootnoteBlock).toContain(testosteroneDisclosure);
    expect(pageSource.indexOf("data-webinar2-legal-footnote")).toBeGreaterThan(pageSource.indexOf("data-webinar2-final-cta"));
  });
});
