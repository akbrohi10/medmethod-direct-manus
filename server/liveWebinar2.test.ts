import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const pageSource = fs.readFileSync(path.join(root, "client/src/pages/LiveWebinar2.tsx"), "utf8");
const globalStyles = fs.readFileSync(path.join(root, "client/src/index.css"), "utf8");
const appSource = fs.readFileSync(path.join(root, "client/src/App.tsx"), "utf8");
const originalPageSource = fs.readFileSync(path.join(root, "client/src/pages/LiveWebinar.tsx"), "utf8");
const learningChecklistBlock = pageSource.match(/const learningChecklist = \[([\s\S]*?)\];/)?.[1] ?? "";
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

  it("uses the exact approved seven-item checklist and preserves the current inline video behavior", () => {
    const expectedTitles = [
      "Why You Can’t Lose Weight Like You Used To",
      "Is It Perimenopause or Menopause?",
      "Hot Flashes, Poor Sleep, Mood Changes & Low Energy",
      "The Truth About Hormone Therapy",
      "GLP-1s & Medical Weight Loss",
      "What to Ask Your Doctor",
      "LIVE Q&A with Dr. Jumana Al-Deek",
    ];
    const expectedBodies = [
      "What changes in your 30s, 40s & 50s—and why.",
      "The signs and symptoms your body may be trying to tell you.",
      "Understand what may actually be happening with your hormones.",
      "What every woman should know about her options.",
      "When they may help—and what proper treatment should look like.",
      "Know your options and become a better advocate for your health.",
      "Get answers directly from a menopause & medical weight loss specialist.",
    ];
    const positions = expectedTitles.map(title => learningChecklistBlock.indexOf(title));
    positions.forEach(position => expect(position).toBeGreaterThanOrEqual(0));
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expectedBodies.forEach(body => expect(learningChecklistBlock).toContain(body));
    expect(learningChecklistBlock.match(/title: "/g)).toHaveLength(7);
    expect(learningSectionBlock).toContain("What You’ll Learn");
    expect(learningSectionBlock).toContain("Because You Deserve to Know.");
    expect(learningSectionBlock).not.toContain("Evidence-based insights you can actually use");
    expect(learningSectionBlock).toContain("data-webinar2-learning-checklist");
    expect(learningSectionBlock).toContain("data-webinar2-learning-item");
    expect(learningSectionBlock).toContain("data-webinar2-learning-check");
    expect(learningSectionBlock).not.toContain("data-webinar2-learning-card");
    expect(learningSectionBlock).not.toContain("data-webinar2-learning-icon");
    expect(learningSectionBlock).not.toContain("data-webinar2-learning-number");
    expect(learningSectionBlock).toContain("bg-[#fff7f5]");
    expect(learningSectionBlock).toContain('className="mx-auto max-w-[980px] bg-[#fff7f5] px-0 py-6 sm:py-10"');
    expect(learningSectionBlock).toContain("max-w-[800px]");
    expect(learningSectionBlock).toContain("border-b border-[#eadde4]");
    expect(learningSectionBlock).toContain("rounded-full bg-[#dd2d84]");
    expect(learningSectionBlock).toContain("<Check");
    expect(learningSectionBlock).toContain("text-xl font-extrabold");
    expect(learningSectionBlock).toContain("text-[#432943]");
    expect(learningSectionBlock).toContain("text-base font-medium leading-[1.55] text-[#514a52]");
    expect(pageSource).not.toContain("SUPPLIED_HORMONE_MOLECULE_ICON_URL");
    expect(pageSource).not.toContain("SuppliedHormoneMoleculeIcon");
    expect(pageSource).not.toContain("Activity");
    expect(pageSource).not.toContain("Scale");
    expect(pageSource).not.toContain("Syringe");
    expect(learningSectionBlock.indexOf("data-webinar2-learning-checklist")).toBeLessThan(learningSectionBlock.indexOf("Reserve My Free Spot"));
    expect(pageSource.match(/LIVE Q&A with Dr\. Jumana Al-Deek/g) ?? []).toHaveLength(1);
    expect(pageSource).not.toContain("MessageCircle");
    expect(pageSource).toContain("data-webinar2-informed-message");
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
    expect(pageSource).not.toContain("Live Q&amp;A with Dr. Al-Deek");
    expect(pageSource).not.toMatch(/<button[\s\S]{0,300}LIVE Q&amp;A with Dr\. Jumana Al-Deek/);
  });
});
