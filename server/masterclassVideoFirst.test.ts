import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const pageSource = fs.readFileSync(path.join(projectRoot, "client/src/pages/MasterclassVideoFirst.tsx"), "utf8");
const webinarSource = fs.readFileSync(path.join(projectRoot, "client/src/pages/LiveWebinar2.tsx"), "utf8");
const appSource = fs.readFileSync(path.join(projectRoot, "client/src/App.tsx"), "utf8");
const viteSource = fs.readFileSync(path.join(projectRoot, "server/_core/vite.ts"), "utf8");

describe("video-first masterclass variant", () => {
  it("registers an isolated /masterclass route without replacing the original page", () => {
    expect(appSource).toContain('const MasterclassVideoFirst = lazy(() => import("@/pages/MasterclassVideoFirst"));');
    expect(appSource).toContain('<Route path="/masterclass" component={MasterclassVideoFirst} />');
    expect(appSource).toContain('<Route path="/free-masterclass" component={FreeMasterclass} />');
    expect(appSource).toContain('location === "/masterclass") return null;');
  });

  it("puts concise context and the YouTube recording before all booking content", () => {
    expect(pageSource).toContain('data-masterclass-video-first-banner');
    expect(pageSource).toContain('bg-gradient-to-r from-[#e72e91] via-[#b92b92] to-[#5d237b] px-5 py-4 text-center');
    expect(pageSource.match(/Free On-Demand Masterclass/g)).toHaveLength(1);
    expect(pageSource).not.toContain('data-masterclass-video-first-eyebrow');
    expect(pageSource.indexOf('data-masterclass-video-first-banner')).toBeLessThan(pageSource.indexOf('data-masterclass-video-first-hero'));
    expect(pageSource).not.toContain('Watch the 45-minute masterclass');
    expect(pageSource).toContain('Weight Loss, <span className="whitespace-nowrap">GLP-1s</span> &amp; Hormones — Finally Explained.');
    expect(pageSource).toContain('text-[clamp(1.4rem,7.5vw,2rem)] font-black');
    expect(pageSource).toContain('From Dr. Jumana Al-Deek, DO · Board-certified physician · <span className="font-black text-[#7a1e7e]">50,000+ patients</span> seen');
    expect(pageSource).toContain('Presented by Dr. Jumana Al-Deek, DO—a board-certified family physician focused on perimenopause, menopause, metabolic health &amp; medical weight loss.');
    expect(pageSource).not.toContain('Press play to watch free');
    expect(pageSource).not.toContain('Finally. A Doctor Who Understands Menopause &amp; Weight Loss.');
    expect(pageSource).toContain('const MASTERCLASS_YOUTUBE_ID = "UNYMLkd61z8";');
    expect(pageSource).not.toContain('n-jYhuCP5Vg');
    expect(pageSource).toContain('data-masterclass-video-first-youtube');
    expect(pageSource).not.toContain('data-masterclass-video-first-play\n');
    expect(pageSource).not.toContain('setVideoStarted(true)');
    expect(pageSource).not.toContain('masterclass-youtube-poster-UNYMLkd61z8_797de672.jpg');
    expect(pageSource).toContain('data-masterclass-video-first-iframe');
    expect(pageSource).toContain('const [disableFullScreen] = useState(() => typeof window !== "undefined" && window.matchMedia("(pointer: coarse), (max-width: 767px)").matches);');
    expect(pageSource).toContain('https://www.youtube-nocookie.com/embed/${MASTERCLASS_YOUTUBE_ID}?rel=0&playsinline=1&fs=${disableFullScreen ? 0 : 1}');
    expect(pageSource).toContain('loading="eager"');
    expect(pageSource).toContain('allowFullScreen={!disableFullScreen}');
    expect(pageSource).toContain('web-share${disableFullScreen ? "" : "; picture-in-picture"}');
    expect(pageSource).not.toContain('Use the YouTube player settings to adjust playback speed, captions, or video quality.');
    expect(pageSource).not.toContain('Educational content only. Individual treatment recommendations require an appropriate medical evaluation.');
    expect(pageSource).toContain('Physician-led virtual care. Individual recommendations require an appropriate medical evaluation.');
    expect(pageSource).not.toContain('data-masterclass-video-first-placeholder');
    expect(pageSource).not.toContain('Masterclass Recording Coming Soon');
    expect(pageSource).not.toContain('medmethod-on-demand-masterclass-poster_52bb13b2.jpg');
    expect(pageSource).not.toContain('<video');
    const order = [
      'data-masterclass-video-first-hero',
      'data-masterclass-video-first-player',
      '<section\n            data-webinar2-learning',
      'data-masterclass-watch-button',
      'data-masterclass-video-first-bio',
      '<FeaturedInStrip />',
      'data-masterclass-video-first-booking',
      '<footer',
    ].map((marker) => pageSource.indexOf(marker));
    expect(order.every((position) => position >= 0)).toBe(true);
    expect(order).toEqual([...order].sort((a, b) => a - b));
    expect(pageSource).toContain('Ready to talk about your own hormones and weight?');
    expect(pageSource).toContain('videoRef.current?.scrollIntoView({');
    expect(pageSource).toContain('window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"');
    expect(pageSource).toContain('Watch the Free Masterclass');
    expect(pageSource).toContain('bg-gradient-to-r from-[#25134f] via-[#5b3aa4] to-[#2d185d]');
    expect(pageSource).toContain('webinar2-logo-marquee__track');
    expect(pageSource).toContain('webinar2-logo-marquee__duplicate');
    expect(pageSource).toContain('const isReady = pendingAssets === 0;');
    expect(pageSource).toContain('This Is Menopause');
    expect(pageSource).toContain('Woman’s World');
  });

  it("places the supplied family image under the presenter credit without changing the page order", () => {
    const bio = pageSource.indexOf('Presented by Dr. Jumana Al-Deek, DO—a board-certified family physician');
    const image = pageSource.indexOf('data-masterclass-presenter-photo');
    const featured = pageSource.indexOf('<FeaturedInStrip />');
    expect(bio).toBeGreaterThan(-1);
    expect(image).toBeGreaterThan(bio);
    expect(featured).toBeGreaterThan(image);
    expect(pageSource).toContain('src="/manus-storage/jumana-family-masterclass_238b56a3.webp"');
    expect(pageSource).toContain('alt="Dr. Jumana Al-Deek with her family outdoors"');
    expect(pageSource).toContain('loading="lazy"');
  });

  it("keeps the webinar checklist except for the masterclass replay copy and larger label", () => {
    const list = (source: string) => source.match(/const learningChecklist = \[([\s\S]*?)\];/)?.[1]?.trim();
    const checklistMarkup = (source: string) => source.match(/<section\s+data-webinar2-learning[\s\S]*?<\/ul>/)?.[0]?.replace(/^\s+/gm, "").trim();
    const masterclassReplayList = list(webinarSource)
      ?.replace('title: "LIVE Q&A with Dr. Jumana Al-Deek"', 'title: "LIVE Q&A Replay with Dr. Jumana Al-Deek"')
      .replace('body: "Get answers directly from a menopause & medical weight loss specialist."', 'body: "Watch people like you get answers from a menopause & medical weight loss specialist."');
    expect(list(pageSource)).toBe(masterclassReplayList);
    expect(checklistMarkup(pageSource)?.replace('text-sm font-black uppercase tracking-[0.2em] text-[#cf1475] sm:px-8 sm:text-base', 'text-xs font-black uppercase tracking-[0.2em] text-[#cf1475] sm:px-8 sm:text-sm')).toBe(checklistMarkup(webinarSource));
    expect(pageSource).toContain('text-sm font-black uppercase tracking-[0.2em] text-[#cf1475] sm:px-8 sm:text-base');
    expect(pageSource).not.toContain('Reserve My Free Spot');
  });

  it("uses a dedicated social preview for the masterclass route", () => {
    expect(pageSource).toContain('Free Masterclass: Menopause, Metabolism &amp; Weight Loss');
    expect(pageSource).toContain('Watch Dr. Jumana Al-Deek explain how hormones, metabolism, and medical weight loss connect—plus real questions from women 35+.');
    expect(pageSource).toContain('https://medmethoddirect.com/masterclass');
    expect(pageSource).not.toContain('<meta property="og:image"');
    expect(pageSource).not.toContain('<meta name="twitter:image"');
    expect(viteSource).toContain('if (cleanPath !== "/masterclass") return template;');
    expect(viteSource).toContain('return injectRouteMetaIntoHtml(template, getMetaForPath(url));');
    expect(viteSource).toContain('injectMasterclassRouteMeta(template, req.originalUrl)');
  });

  it("keeps the established physician and care-team actions after the video", () => {
    expect(pageSource).toContain('Want to Become a Patient?');
    expect(pageSource).not.toContain('Ready when you are');
    expect(pageSource).not.toContain('Start with a 45-minute visit with Dr. Al-Deek to discuss your health and goals.');
    expect(pageSource).toContain('100% virtual care · Available in 17 states');
    expect(pageSource).not.toContain('Choose the next step that feels right for you.');
    expect(pageSource).toContain('data-masterclass-video-first-physician-cta');
    expect(pageSource).toContain('data-masterclass-video-first-care-team-cta');
    expect(pageSource).toContain('href="/care-team-booking"');
    expect(pageSource).toContain('landingPage="/masterclass"');
    expect(pageSource).toContain('landingPage="/masterclass" startAtPayment');
    expect(pageSource).toContain('Dr. Al-Deek has seen');
    expect(pageSource).toContain('50,000+ patients.');
    expect(pageSource).toContain('data-masterclass-video-first-pricing');
  });

  it("keeps complete pricing transparent inside the expandable details section", () => {
    expect(pageSource).toContain('data-masterclass-video-first-pricing-details');
    expect(pageSource).toContain('45-minute physician consultation');
    expect(pageSource).toContain('Reserve today:</strong> $50 deposit');
    expect(pageSource).toContain('Day of visit:</strong> remaining $149');
    expect(pageSource).toContain('data-masterclass-video-first-pay-as-you-go');
    expect(pageSource).toContain('Follow-up visit');
    expect(pageSource).toContain('$150');
    expect(pageSource).toContain('data-masterclass-video-first-ongoing-care');
    expect(pageSource).toContain('$50<span className="text-xl tracking-normal">/month</span>');
    expect(pageSource).toContain('data-masterclass-video-first-weight-loss-pricing');
    expect(pageSource).toContain('~$100–$300');
    expect(pageSource).toContain('~$150–$450');
    expect(pageSource).toContain('data-masterclass-video-first-hormone-pricing');
    expect(pageSource).toContain('~$30–$100');
    expect(pageSource).toContain('~$150–$250');
    expect(pageSource).toContain('Medication is separate from physician care.');
    expect(pageSource).toContain('Medication can be shipped to your door or called into your local pharmacy');
    expect(pageSource).toContain('FDA-approved options');
    expect(pageSource).not.toMatch(/\b(?:Wegovy|Zepbound)\b/i);
    expect(pageSource).toContain('Compounded medications are not FDA-approved.');
    expect(pageSource).toContain('Testosterone is prescribed off-label for hypoactive sexual desire disorder in women.');
  });
});
