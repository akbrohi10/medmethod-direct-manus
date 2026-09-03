import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const pageSource = readFileSync(resolve(projectRoot, "client/src/pages/LiveWebinar.tsx"), "utf8");
const appSource = readFileSync(resolve(projectRoot, "client/src/App.tsx"), "utf8");
const bookCoverBlock = pageSource.match(/<div\s+data-webinar-book-cover[\s\S]*?<\/div>/)?.[0] ?? "";
const learningPointsBlock = pageSource.match(/const learningPoints = \[([\s\S]*?)\];/)?.[1] ?? "";
const featuredOutletsBlock = pageSource.match(/const featuredOutlets = \[([\s\S]*?)\];/)?.[1] ?? "";
const asSeenInBlock = pageSource.match(/<section\s+data-webinar-as-seen-in[\s\S]*?<\/section>/)?.[0] ?? "";

describe("live webinar landing page", () => {
  it("registers the public /live-webinar route", () => {
    expect(appSource).toContain('const LiveWebinar = lazy(() => import("@/pages/LiveWebinar"))');
    expect(appSource).toContain('<Route path="/live-webinar" component={LiveWebinar} />');
  });

  it("uses the approved headline and physician authority details", () => {
    expect(pageSource).toContain("data-webinar-zoom-rsvp-banner");
    expect(pageSource).toContain("data-webinar-mobile-zoom-banner");
    expect(pageSource).toContain("data-webinar-desktop-zoom-banner");
    expect(pageSource).toContain('data-webinar-mobile-zoom-banner className="text-center sm:hidden"');
    expect(pageSource).toContain('data-webinar-desktop-zoom-banner className="mx-auto hidden');
    expect(pageSource).toContain("sm:flex");
    expect(pageSource).toContain("bg-[#210442]");
    expect(pageSource).toContain('className="text-[#ff4f9d]">Live</span> on Zoom');
    expect(pageSource).toContain('className="text-[#ff4f9d]">Free Spot!</span>');
    expect(pageSource).toContain("Live on Zoom");
    expect(pageSource).toContain("RSVP Now");
    expect(pageSource).toContain("Save Your Free Spot");
    expect(pageSource).not.toContain("Free Live Women&apos;s Health Webinar");
    expect(pageSource).toContain("Women Are");
    expect(pageSource).toContain("Taking the Time to Understand");
    expect(pageSource).toContain("Perimenopause &amp;");
    expect(pageSource).toContain("Menopause.");
    expect(pageSource).toContain("Are You?");
    expect(pageSource).toContain("Dr. Jumana Al-Deek");
    expect(pageSource).toContain("DO, MS");
    expect(pageSource).toContain("The Menopause Weight Loss Trap");
    expect(pageSource).toContain('<span className="whitespace-nowrap">Author of</span>');
    expect(pageSource).toContain('<em>The Menopause Weight Loss Trap</em>');
    expect(pageSource).not.toContain('/> Author of <em>');
    expect(pageSource).toContain("Waking at 3 AM");
    expect(pageSource).toContain("Low Energy");
    expect(pageSource).toContain("Low Libido");
    expect(pageSource).not.toContain("Feel Like Yourself Again");
  });

  it("keeps registration inactive with an accessible webinar video and three approved sections", () => {
    expect(pageSource).toContain("data-webinar-video");
    expect(pageSource).toContain("data-webinar-video-shell");
    expect(pageSource).toContain("<video");
    expect(pageSource).toContain("controls");
    expect(pageSource).not.toContain("autoPlay");
    expect(pageSource).toContain("video.muted = false");
    expect(pageSource).toContain("video.play()");
    expect(pageSource).toContain("IntersectionObserver");
    expect(pageSource).toContain("entry.intersectionRatio >= 0.6");
    expect(pageSource).toContain("video.pause()");
    expect(pageSource).toContain("autoplayBlocked");
    expect(pageSource).toContain("Play Video With Sound");
    expect(pageSource).toContain("playsInline");
    expect(pageSource).toContain('video.setAttribute("playsinline", "")');
    expect(pageSource).toContain('video.setAttribute("webkit-playsinline", "")');
    expect(pageSource).toContain('video.addEventListener("webkitbeginfullscreen", keepPlaybackInline)');
    expect(pageSource).toContain("webkitExitFullscreen?.()");
    expect(pageSource).toContain('controlsList="nodownload noremoteplayback nofullscreen"');
    expect(pageSource).toContain("disablePictureInPicture");
    expect(pageSource).toContain("disableRemotePlayback");
    expect(pageSource).toContain('preload="metadata"');
    expect(pageSource).toContain("/manus-storage/replacement-speaking-event-web_3c5c62ae.mp4");
    expect(pageSource).toContain("/manus-storage/replacement-speaking-event-poster_5353b331.jpg");
    expect(pageSource).not.toContain("/manus-storage/dr-aldeek-speaking-event-web_db5bfc0c.mp4");
    expect(pageSource).not.toContain("/manus-storage/dr-aldeek-speaking-event-poster_125d9f5e.jpg");
    expect(pageSource).not.toContain("Video Placeholder");
    expect(pageSource).not.toContain("Dr. Photo Placeholder");
    expect(pageSource).toContain("data-webinar-headshot");
    expect(pageSource).toContain("/manus-storage/dr-jumana-al-deek-headshot_75912bc8.png");
    expect(pageSource).toContain('alt="Dr. Jumana Al-Deek"');
    expect(pageSource).not.toContain("Book Image Placeholder");
    expect(pageSource).toContain("/manus-storage/menopause-weight-loss-trap-book-cover-transparent_02607d91.png");
    expect(pageSource).toContain("Cover of The Menopause Weight Loss Trap by Dr. Jumana Al-Deek");
    expect(pageSource).toContain('loading="lazy"');
    expect(pageSource).toContain('decoding="async"');
    expect(bookCoverBlock).toContain("h-48 w-36");
    expect(bookCoverBlock).toContain("sm:h-52 sm:w-40");
    expect(bookCoverBlock).toContain("object-contain");
    expect(bookCoverBlock).not.toMatch(/scale-\[|object-cover|overflow-hidden/);
    expect(bookCoverBlock).not.toMatch(/\bborder\b|\bbg-white\b|\bp-1\.5\b|\brounded\b/);
    expect(bookCoverBlock).not.toContain(" shadow-");
    expect(pageSource).toContain("[Date]");
    expect(pageSource).toContain("[Time]");
    expect(pageSource).toContain("Reserve My Free Spot");
    expect(pageSource).toContain("Registration details are coming soon.");
    expect(pageSource).toContain("lg:grid-cols-[0.95fr_1.05fr]");
    expect(pageSource).toContain('content="noindex, nofollow"');
    expect(pageSource).not.toMatch(/<form\b/);
    expect(pageSource).not.toMatch(/trpc\.|webhook|fetch\(/i);
    expect(pageSource).not.toMatch(/Forbes|Entrepreneur|countdown/i);
    expect(pageSource.match(/<section\b/g)).toHaveLength(3);
  });

  it("places the six approved static outlet logos between the hero and educational section", () => {
    const heroPosition = pageSource.indexOf("data-webinar-lower-row");
    const mediaPosition = pageSource.indexOf("data-webinar-as-seen-in");
    const learningPosition = pageSource.indexOf("data-webinar-learning-section");

    expect(mediaPosition).toBeGreaterThan(heroPosition);
    expect(learningPosition).toBeGreaterThan(mediaPosition);
    expect(pageSource).toContain("As Seen In");
    expect(featuredOutletsBlock.match(/name: "/g)).toHaveLength(6);
    expect(pageSource.match(/data-webinar-media-logo\b/g)).toHaveLength(1);
    expect(asSeenInBlock).toContain("bg-gradient-to-r");
    expect(asSeenInBlock).toContain("grid-cols-3");
    expect(asSeenInBlock).toContain("sm:grid-cols-6");
    expect(asSeenInBlock).not.toMatch(/rounded-xl|border-\[#e7dada\]|bg-white|shadow-\[0_10px_28px/);

    for (const outlet of ["Flow Space", "SingleCare", "NTD", "Scary Mommy", "Daily Mail", "Yahoo Health"]) {
      expect(featuredOutletsBlock).toContain(`name: "${outlet}"`);
    }

    for (const asset of [
      "/manus-storage/flow-space-white_beb898dc.png",
      "/manus-storage/singlecare-white_500a5691.png",
      "/manus-storage/ntd-white_dd8e5f55.png",
      "/manus-storage/scary-mommy-white_b136c1bf.png",
      "/manus-storage/daily-mail-white_bc1019ba.png",
      "/manus-storage/yahoo-health-white_125ff57a.png",
    ]) {
      expect(featuredOutletsBlock).toContain(asset);
    }

    for (const oldAsset of [
      "/manus-storage/flow-space_12f7eb24.jpg",
      "/manus-storage/singlecare_b2c19243.png",
      "/manus-storage/ntd_4d4cd7f7.jpg",
      "/manus-storage/scary-mommy_420d0902.jpg",
      "/manus-storage/daily-mail-wordmark_c6ff20de.png",
      "/manus-storage/yahoo-health_4d6f1cee.webp",
    ]) {
      expect(featuredOutletsBlock).not.toContain(oldAsset);
    }

    expect(pageSource).toContain('alt={`${outlet.name} logo`}');
    expect(pageSource).not.toMatch(/Featured as an Expert|endorsed by|trusted by/i);
  });

  it("includes the approved educational overview, six learning outcomes, live Q&A, and final RSVP panel", () => {
    expect(pageSource).toContain("data-webinar-learning-section");
    expect(pageSource).toContain("Understand What’s Really Happening to Your Body After 35");
    expect(pageSource).toContain("If you’re experiencing stubborn weight gain, belly fat, poor sleep, hot flashes, night sweats, brain fog, mood changes");
    expect(pageSource).toContain("designed to cut through the confusion surrounding perimenopause, menopause, hormone therapy and medical weight loss");
    expect(pageSource).toContain("What You’ll Learn");
    expect(learningPointsBlock.match(/^  "/gm)).toHaveLength(6);
    expect(pageSource).toContain("data-webinar-learning-item");
    expect(pageSource).toContain("metabolism, muscle and belly fat");
    expect(pageSource).toContain("potential benefits and risks, and common misconceptions");
    expect(pageSource).toContain("harder after 40");
    expect(pageSource).toContain("How GLP-1 medications work");
    expect(pageSource).toContain("treating the whole picture matters");
    expect(pageSource).toContain("important questions you should be asking your physician");
    expect(pageSource).toContain("data-webinar-informed-message");
    expect(pageSource).toContain("Become Informed.");
    expect(pageSource).toContain("The goal isn’t to tell you what treatment you should choose");
    expect(pageSource).toContain("data-webinar-live-qa");
    expect(pageSource).toContain("PLUS: Live Q&amp;A with Dr. Al-Deek");
    expect(pageSource).toContain("Bring your questions and get the opportunity to ask Dr. Al-Deek directly.");
    expect(pageSource).toContain("data-webinar-final-rsvp");
    expect(pageSource).toContain("Limited to the First 100 RSVPs");
    expect(pageSource.match(/onClick=\{handleReserveSeat\}/g)).toHaveLength(2);
    expect(pageSource).toContain("<ComplianceDisclosures testosteroneForWomen />");
    expect(pageSource).not.toMatch(/<form\b/);
  });

  it("uses the approved headline-video, symptom-band, and lower conversion hierarchy", () => {
    const zoomBannerPosition = pageSource.indexOf("data-webinar-zoom-rsvp-banner");
    const upperRowPosition = pageSource.indexOf("data-webinar-upper-row");
    const headlinePosition = pageSource.indexOf("data-webinar-headline");
    const videoPosition = pageSource.indexOf("data-webinar-video-shell");
    const symptomsPosition = pageSource.indexOf("data-webinar-symptoms");
    const lowerRowPosition = pageSource.indexOf("data-webinar-lower-row");

    expect(pageSource.match(/lg:grid-cols-\[0\.95fr_1\.05fr\]/g)).toHaveLength(2);
    expect(zoomBannerPosition).toBeGreaterThan(-1);
    expect(upperRowPosition).toBeGreaterThan(zoomBannerPosition);
    expect(headlinePosition).toBeGreaterThan(upperRowPosition);
    expect(videoPosition).toBeGreaterThan(headlinePosition);
    expect(symptomsPosition).toBeGreaterThan(videoPosition);
    expect(lowerRowPosition).toBeGreaterThan(symptomsPosition);
    expect(pageSource).toContain("lg:min-h-[430px]");
    expect(pageSource).toContain("lg:grid-cols-3 xl:grid-cols-5");
    expect(pageSource).toContain("whitespace-nowrap");
    expect(pageSource).toContain("lg:order-1");
    expect(pageSource).toContain("lg:order-2");
    expect(pageSource).toContain("Live Q&amp;A Included");
    expect(pageSource).not.toContain("Free to Attend");
    expect(pageSource.match(/Live Online/g)).toHaveLength(1);
  });

  it("suppresses social-proof popups on the focused webinar landing page", () => {
    expect(appSource).toContain('if (location === "/live-webinar") return null;');
  });
});
