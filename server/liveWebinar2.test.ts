import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const pageSource = fs.readFileSync(path.join(root, "client/src/pages/LiveWebinar2.tsx"), "utf8");
const globalStyles = fs.readFileSync(path.join(root, "client/src/index.css"), "utf8");
const appSource = fs.readFileSync(path.join(root, "client/src/App.tsx"), "utf8");
const originalPageSource = fs.readFileSync(path.join(root, "client/src/pages/LiveWebinar.tsx"), "utf8");
const learningCardsBlock = pageSource.match(/const learningCards = \[([\s\S]*?)\];/)?.[1] ?? "";
const featuredInBlock = pageSource.match(/<section\s+data-webinar2-featured-in[\s\S]*?<\/section>/)?.[0] ?? "";
const learningSectionBlock = pageSource.match(/<section\s+data-webinar2-learning[\s\S]*?<\/section>/)?.[0] ?? "";
const primaryCtaBlock = pageSource.match(/<button\s+data-webinar2-primary-cta[\s\S]*?<\/button>/)?.[0] ?? "";

describe("live webinar 2 second revision prompt", () => {
  it("keeps the nationwide educational variation isolated from the original webinar route", () => {
    expect(appSource).toContain('const LiveWebinar2 = lazy(() => import("@/pages/LiveWebinar2"));');
    expect(appSource).toContain('<Route path="/live-webinar2" component={LiveWebinar2} />');
    expect(appSource).toContain('<Route path="/live-webinar" component={LiveWebinar} />');
    expect(appSource).toContain('location === "/live-webinar" || location === "/live-webinar2"');
    expect(originalPageSource).not.toContain("data-live-webinar2");
  });

  it("uses the approved centered hero with one prominent educational-webinar banner message", () => {
    expect(pageSource).toContain("data-webinar2-hero");
    expect(pageSource).toContain("data-webinar2-centered-hero");
    expect(pageSource).toContain("data-webinar2-zoom-banner");
    expect(pageSource).toContain("A Free Educational Webinar");
    expect(pageSource).not.toContain("Live on");
    expect(pageSource).not.toContain('<span className="block">Zoom</span>');
    expect(pageSource).not.toContain("Masterclass");
    expect(pageSource).toContain("Play");
    expect(pageSource).toContain("Volume2");
    expect(pageSource).not.toContain("GraduationCap");
    expect(pageSource).not.toContain("<Video");
    expect(pageSource).toContain("from-[#e72e91] via-[#a12788] to-[#4b1c6e]");
    expect(pageSource).toContain("data-webinar2-decorative-background");
    expect(pageSource).toContain("repeating-radial-gradient");
    expect(pageSource).not.toContain("lg:grid-cols-[minmax(0,1.22fr)_minmax(0,1fr)]");
    expect(pageSource).not.toContain("Free Live Webinar · For Women 35+");
    expect(pageSource).toContain("data-webinar2-audience-label");
    expect(pageSource).toContain("For Women 35+");
    expect(pageSource).not.toContain(">Women 35+</span>");
    expect(pageSource).not.toContain("Women 35+:");
    expect(pageSource).toContain("Struggling With Weight Gain, Poor Sleep, Hot Flashes or Mood Swings?");
    expect(pageSource).toContain("data-webinar2-topic-line");
    expect(pageSource).toContain("Understand Perimenopause, Menopause, Hormone Therapy &amp; Medical Weight Loss.");
    expect(pageSource).not.toContain("You’re not imagining it.");
    expect(pageSource).not.toContain("Here’s what’s actually changing — and what you can do about it.");
    expect(pageSource).not.toContain("After 35");
    expect(pageSource).not.toContain("After 40");
    expect(pageSource).toContain("data-webinar2-doctor-divider");
    expect(pageSource).toContain("data-webinar2-authority-intro");
    expect(pageSource).not.toContain("A free educational webinar with");
    expect(pageSource).not.toContain("data-webinar2-short-intro");
    expect(pageSource).toContain("Physician and author of <em>The Menopause Weight Loss Trap</em>");
    expect(pageSource).not.toContain('Author of <em className="font-bold">The Menopause Weight Loss Trap</em>');
    expect(pageSource).not.toContain("This free educational webinar is available nationwide.");
    expect(pageSource).not.toContain("See states");
    expect(pageSource).not.toContain("data-webinar2-state-list-token");
    expect(pageSource).not.toContain("[STATE LIST]");
    expect(pageSource).not.toContain("Live and free — for women in Florida.");
  });

  it("uses the centered conversion hierarchy with the confirmed date/countdown at the top and no form below the video", () => {
    expect(pageSource).not.toContain("data-webinar2-brand-logo");
    expect(pageSource).not.toContain("medmethod-logo-navbar_99a2ea82.png");
    expect(pageSource.indexOf("data-webinar2-zoom-banner")).toBeLessThan(pageSource.indexOf("data-webinar2-opening-copy"));
    expect(pageSource.indexOf("data-webinar2-top-event")).toBeGreaterThan(pageSource.indexOf("A Free Educational Webinar"));
    expect(pageSource.indexOf("data-webinar2-countdown-bar")).toBeLessThan(pageSource.indexOf("data-webinar2-opening-copy"));
    expect(pageSource.indexOf("data-webinar2-opening-copy")).toBeLessThan(pageSource.indexOf("data-webinar2-audience-label"));
    expect(pageSource.indexOf("data-webinar2-audience-label")).toBeLessThan(pageSource.indexOf("Struggling With Weight Gain"));
    expect(pageSource.indexOf("Struggling With Weight Gain")).toBeLessThan(pageSource.indexOf("data-webinar2-topic-line"));
    expect(pageSource.indexOf("data-webinar2-topic-line")).toBeLessThan(pageSource.indexOf("data-webinar2-authority-intro"));
    expect(pageSource.indexOf("data-webinar2-authority-intro")).toBeLessThan(pageSource.indexOf("data-webinar2-video-shell"));
    expect(pageSource).not.toContain("data-webinar2-above-video-cta");
    expect(pageSource.indexOf("data-webinar2-video-shell")).toBeLessThan(pageSource.indexOf("data-webinar2-primary-cta"));
    expect(pageSource.indexOf("data-webinar2-primary-cta")).toBeLessThan(pageSource.indexOf("data-webinar2-featured-in"));
    expect(pageSource).not.toContain("data-webinar2-registration-preview");
    expect(pageSource).not.toContain("data-webinar2-duration-line");
    expect(pageSource).toContain("aspect-video");
    expect(pageSource).not.toContain("sm:aspect-[4/5]");
    expect(pageSource).toContain("max-w-[800px]");
    expect(pageSource).not.toContain("data-webinar2-compact-presenter");
  });

  it("keeps the compact authority introduction above the video and removes the redundant lower authority and support blocks", () => {
    expect(pageSource).not.toContain("data-webinar2-short-intro");
    expect(pageSource).toContain("data-webinar2-authority-intro");
    expect(pageSource.indexOf("data-webinar2-authority-intro")).toBeLessThan(pageSource.indexOf("data-webinar2-video-shell"));
    expect(pageSource).not.toContain("data-webinar2-availability");
    expect(pageSource).not.toContain("data-webinar2-recording-privacy");
    expect(pageSource).not.toContain("data-webinar2-presenter");
  });

  it("removes the visual-only form while keeping every RSVP action consistently inactive", () => {
    expect(pageSource).not.toContain("data-webinar2-registration-preview");
    expect(pageSource.match(/<input\b/g) ?? []).toHaveLength(0);
    expect(pageSource).not.toContain('name="firstName"');
    expect(pageSource).not.toContain('name="email"');
    expect(pageSource).not.toContain("handleRegistrationPreview");
    expect(pageSource).not.toContain("registrationFormRef");
    expect(pageSource).not.toContain("scrollIntoView");
    expect(pageSource).toContain("Registration is not connected yet. This button is for visual review only.");
    expect(pageSource.match(/onClick=\{handleReserveSeat\}/g)).toHaveLength(2);
    expect(pageSource).not.toContain("Reserve Your Free Spot");
    expect(pageSource.match(/Reserve My Free Spot/g)).toHaveLength(2);
    expect(primaryCtaBlock).toContain("Reserve My Free Spot");
    expect(primaryCtaBlock).toContain("data-webinar2-capacity-line");
    expect(primaryCtaBlock).toContain("Limited Zoom Capacity");
    expect(pageSource.match(/Limited Zoom Capacity/g)).toHaveLength(1);
    expect(pageSource).not.toContain("Yes — Reserve My Free Spot");
    expect(pageSource).not.toContain("Can’t attend live? Register anyway and we’ll send you the recording.");
    expect(pageSource).not.toContain('href="/privacy-policy"');
    expect(pageSource.match(/<a\b/g) ?? []).toHaveLength(0);
    expect(pageSource).not.toMatch(/fetch\(|trpc\.|webhook|stripe|paypal/i);
  });

  it("uses the confirmed Eastern event time for one active countdown directly beneath the top banner", () => {
    expect(pageSource).toContain("const WEBINAR_EVENT = {");
    expect(pageSource).toContain('startsAt: "2026-09-23T19:00:00-04:00" as string | null');
    expect(pageSource).toContain('dateTimeDisplay: "WEDNESDAY, SEPTEMBER 23 · 7:00 PM ET"');
    expect(pageSource).toContain('timezone: "ET"');
    expect(pageSource).not.toContain('duration: "[DURATION]"');
    expect(pageSource).not.toContain("const eventSupportLine =");
    expect(pageSource).toContain("if (!WEBINAR_EVENT.startsAt) return;");
    expect(pageSource).toContain("window.setInterval(updateCountdown, 1_000)");
    expect(pageSource).toContain("data-webinar2-top-event");
    expect(pageSource).toContain("data-webinar2-event-date");
    expect(pageSource).toContain("data-webinar2-countdown-bar");
    expect(pageSource.match(/data-webinar2-countdown-bar/g)).toHaveLength(1);
    expect(pageSource.indexOf("data-webinar2-countdown-bar")).toBeGreaterThan(pageSource.indexOf("A Free Educational Webinar"));
    expect(pageSource.indexOf("data-webinar2-countdown-bar")).toBeLessThan(pageSource.indexOf("data-webinar2-opening-copy"));
    expect(pageSource).not.toContain("data-webinar2-event-line");
    expect(pageSource).not.toContain("data-webinar2-duration-line");
  });

  it("shows only four dark countdown boxes and their unit labels while reserving the clock icon for the video-length pill", () => {
    expect(pageSource).not.toContain("data-webinar2-countdown-label");
    expect(pageSource).not.toContain("data-webinar2-countdown-timezone");
    expect(pageSource).not.toContain("data-webinar2-countdown-preview-token");
    expect(pageSource).not.toContain("[COUNTDOWN ACTIVATES WHEN EVENT DATE IS SET]");
    expect(pageSource).not.toContain("Event Countdown ·");
    expect(pageSource).toContain("Clock3");
    expect(pageSource).toContain("bg-gradient-to-r from-[#e72e91] to-[#75207f]");
    expect(pageSource).toContain('aria-label="Webinar countdown"');
    expect(pageSource).toContain("grid grid-cols-4 gap-1.5 sm:gap-2");
    expect(pageSource).toContain("bg-[#26222d]");
    for (const unit of ["Days", "Hours", "Minutes", "Seconds"]) {
      expect(pageSource).toContain(`label: "${unit}"`);
    }
  });

  it("places one accessible sliding Featured In row below the hero using only the six approved logos", () => {
    expect(pageSource.indexOf("data-webinar2-featured-in")).toBeGreaterThan(pageSource.indexOf("data-webinar2-video-shell"));
    expect(pageSource.indexOf("data-webinar2-featured-in")).toBeLessThan(pageSource.indexOf("data-webinar2-learning"));
    expect(featuredInBlock).toContain("Featured In");
    expect(featuredInBlock).toContain("py-3");
    expect(featuredInBlock).toContain("data-webinar2-logo-marquee");
    expect(featuredInBlock).toContain("data-webinar2-logo-track");
    expect(featuredInBlock).toContain("data-webinar2-logo-set");
    expect(featuredInBlock).toContain("data-webinar2-logo-set-duplicate");
    expect(featuredInBlock).toContain('tabIndex={0}');
    expect(featuredInBlock).toContain('aria-hidden="true"');
    expect(pageSource.match(/featuredOutlets\.map/g)).toHaveLength(2);
    expect(globalStyles).toContain("@keyframes webinar2-logo-marquee");
    expect(globalStyles).toContain("animation: webinar2-logo-marquee 24s linear infinite");
    expect(globalStyles).toContain(".webinar2-logo-marquee:focus-within .webinar2-logo-marquee__track");
    expect(globalStyles).toContain("@media (prefers-reduced-motion: reduce)");
    expect(globalStyles).toContain(".webinar2-logo-marquee__duplicate");

    for (const outlet of ["Flow Space", "SingleCare", "NTD", "Scary Mommy", "Daily Mail", "Yahoo Health"]) {
      expect(pageSource).toContain(`name: "${outlet}"`);
    }
  });

  it("uses only the compact headshot authority introduction and removes the lower presenter treatment", () => {
    expect(pageSource).toContain("data-webinar2-authority-intro");
    expect(pageSource).not.toContain("data-webinar2-compact-presenter");
    expect(pageSource).not.toContain("data-webinar2-compact-credentials-token");
    expect(pageSource).not.toContain("[CREDENTIALS]");
    expect(pageSource).not.toContain("data-webinar2-presenter");
    expect(pageSource).toContain('/manus-storage/dr-jumana-al-deek-headshot_75912bc8.png');
    expect(pageSource).not.toContain('/manus-storage/menopause-weight-loss-trap-book-cover-transparent_02607d91.png');
    expect(pageSource).not.toContain("BOOK_COVER_URL");
    expect(pageSource).not.toContain("data-webinar2-credentials-token");
    expect(pageSource).not.toContain("[CREDENTIALS — BOARD CERTIFICATION, SPECIALTY, YEARS IN PRACTICE]");
    expect(pageSource).toContain("Physician and author of <em>The Menopause Weight Loss Trap</em>");
  });

  it("uses the four approved numbered learning cards and preserves the current inline video behavior", () => {
    expect(learningCardsBlock.match(/number: "/g)).toHaveLength(4);
    const expectedTitles = [
      "The truth about hormone therapy (HRT)",
      "Why losing weight can become harder",
      "What’s actually happening to your hormones",
      "How GLP-1 medications work",
    ];
    const positions = expectedTitles.map(title => learningCardsBlock.indexOf(title));
    positions.forEach(position => expect(position).toBeGreaterThanOrEqual(0));
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(learningSectionBlock).toContain("What You’ll Learn");
    expect(learningSectionBlock).toContain("Because You Deserve to Know");
    expect(learningSectionBlock).toContain("Evidence-based insights you can actually use — so you can feel informed, confident, and in control.");
    expect(learningSectionBlock).toContain("data-webinar2-learning-grid");
    expect(learningSectionBlock).toContain("data-webinar2-learning-card");
    expect(learningSectionBlock).toContain("data-webinar2-learning-icon");
    expect(learningSectionBlock).toContain("data-webinar2-learning-number");
    expect(learningSectionBlock).toContain("data-webinar2-first-card-landscape");
    expect(learningSectionBlock).toContain("bg-[#fff7f5]");
    expect(learningSectionBlock).toContain('className="mx-auto max-w-[980px] bg-[#fff7f5] px-0 py-6 sm:py-10"');
    expect(learningSectionBlock).not.toContain("shadow-[0_20px_55px");
    expect(learningSectionBlock).toContain("bg-white");
    expect(learningSectionBlock).toContain("bg-[#fde8f0]");
    expect(learningSectionBlock).toContain("bg-[#db147a]");
    expect(learningSectionBlock).toContain("max-w-[820px]");
    expect(learningSectionBlock).toContain("grid-cols-[100px_minmax(0,1fr)]");
    expect(learningSectionBlock).toContain("grid-cols-[116px_minmax(0,1fr)]");
    expect(learningSectionBlock).toContain("sm:grid-cols-[190px_minmax(0,1fr)]");
    expect(learningSectionBlock).toContain("sm:grid-cols-[220px_minmax(0,1fr)]");
    expect(learningSectionBlock).toContain("min-h-0");
    expect(learningSectionBlock).toContain("ml-2 h-24 w-24");
    expect(learningSectionBlock).toContain("sm:ml-7 sm:h-36 sm:w-36");
    expect(learningSectionBlock).toContain("top-1 left-1 h-10 w-10 text-base");
    expect(learningSectionBlock).toContain("sm:h-[3.25rem] sm:w-[3.25rem] sm:text-xl");
    expect(learningSectionBlock).toContain("text-lg font-medium leading-7 text-[#514a52] sm:text-xl sm:leading-8");
    expect(learningSectionBlock).toContain("text-[1.125rem] font-extrabold leading-[1.12] text-[#6f2754]");
    expect(learningSectionBlock).not.toContain("text-[#432943]");
    expect(learningSectionBlock).toContain("text-base font-medium leading-6 text-[#514a52]");
    expect(learningSectionBlock).toContain("sm:text-lg sm:leading-[1.55]");
    expect(learningSectionBlock).toContain('font-black leading-[1.12] text-[#252132] sm:text-[1.75rem]');
    expect(learningSectionBlock).toContain("ml-4 h-[5.5rem] w-[5.5rem] sm:ml-9 sm:h-44 sm:w-44");
    expect(learningSectionBlock).toContain("absolute z-10");
    expect(learningSectionBlock).toContain("h-10 w-10");
    expect(learningSectionBlock).toContain("sm:top-2 sm:left-1 sm:h-16 sm:w-16");
    expect(learningSectionBlock).not.toContain("justify-center sm:min-h-40");
    expect(pageSource).toContain("function SuppliedHormoneMoleculeIcon");
    expect(pageSource).toContain("data-webinar2-supplied-molecule-icon");
    expect(pageSource).toContain("SUPPLIED_HORMONE_MOLECULE_ICON_URL");
    expect(pageSource).toContain('/manus-storage/hormone-molecule-supplied_32e248f7.png');
    expect(pageSource).toContain("icon: SuppliedHormoneMoleculeIcon");
    expect(pageSource).toContain('scale-[1.3] object-contain');
    expect(pageSource).not.toContain("data-webinar2-prototype-molecule-icon");
    expect(pageSource).not.toContain("FlaskConical");
    expect(learningSectionBlock).toContain('data-webinar2-first-icon-prototype={number === "1" ? "true" : undefined}');
    expect(learningSectionBlock).toContain('number === "1" ? "min-h-24 items-center sm:min-h-40" : "min-h-28 items-center sm:min-h-48"');
    expect(pageSource).toContain("Scale");
    expect(pageSource).toContain("Activity");
    expect(pageSource).toContain("Syringe");
    expect(learningCardsBlock).toContain("Including estrogen, progesterone and testosterone, potential benefits and risks, and common misconceptions.");
    expect(learningCardsBlock).toContain("In your late 30s and 40s — even when you’re eating and exercising the same way you always have.");
    expect(learningCardsBlock).toContain("During perimenopause and menopause, how it affects your body, and what you can do about it.");
    expect(learningCardsBlock).toContain("And where medical weight loss may fit into your overall health strategy.");
    expect(learningSectionBlock.indexOf("data-webinar2-learning-grid")).toBeLessThan(learningSectionBlock.indexOf("Reserve My Free Spot"));
    expect(learningCardsBlock).not.toContain("Clear answers for your next chapter.");
    expect(pageSource).toContain("Watch: [VIDEO LENGTH]");
    expect(pageSource).toContain("h-[4.5rem] w-[4.5rem]");
    expect(pageSource).toContain("sm:h-24 sm:w-24");
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
    expect(pageSource).not.toContain("data-webinar2-legal-footnote");
    expect(pageSource).not.toContain("data-webinar2-testosterone-footnote");
    expect(pageSource).not.toContain("[APPROVED AVAILABILITY DISCLAIMER]");
    expect(pageSource).not.toContain("Testosterone is prescribed off-label for hypoactive sexual desire disorder in women.");
    expect(pageSource).not.toContain("This treatment is available only to patients in Florida.");
    expect(pageSource).not.toContain("data-webinar2-final-cta");
    expect(pageSource).not.toContain("Ready to save your free spot?");
    expect(pageSource).not.toContain("Registration will open here once the event registration link is connected.");
    expect(pageSource).toContain("rounded-full bg-[#faf4f8]");
    expect(pageSource).not.toMatch(/<button[\s\S]{0,300}Live Q&amp;A with Dr\. Al-Deek/);
  });
});
