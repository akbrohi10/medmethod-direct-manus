import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const pageSource = readFileSync(resolve(projectRoot, "client/src/pages/LiveWebinar.tsx"), "utf8");
const appSource = readFileSync(resolve(projectRoot, "client/src/App.tsx"), "utf8");
const bookCoverBlock = pageSource.match(/<div\s+data-webinar-book-cover[\s\S]*?<\/div>/)?.[0] ?? "";

describe("live webinar hero-only landing page", () => {
  it("registers the public /live-webinar route", () => {
    expect(appSource).toContain('const LiveWebinar = lazy(() => import("@/pages/LiveWebinar"))');
    expect(appSource).toContain('<Route path="/live-webinar" component={LiveWebinar} />');
  });

  it("uses the approved headline and physician authority details", () => {
    expect(pageSource).toContain("Women Are");
    expect(pageSource).toContain("Taking the Time to Understand");
    expect(pageSource).toContain("Perimenopause &amp;");
    expect(pageSource).toContain("Menopause.");
    expect(pageSource).toContain("Are You?");
    expect(pageSource).toContain("Dr. Jumana Al-Deek");
    expect(pageSource).toContain("DO, MS");
    expect(pageSource).toContain("The Menopause Weight Loss Trap");
    expect(pageSource).toContain("Waking at 3 AM");
    expect(pageSource).toContain("Low Energy");
    expect(pageSource).toContain("Low Libido");
    expect(pageSource).not.toContain("Feel Like Yourself Again");
  });

  it("keeps the page hero-only with a nonfunctional registration and accessible webinar video", () => {
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
    expect(pageSource).toContain('preload="metadata"');
    expect(pageSource).toContain("/manus-storage/replacement-speaking-event-web_3c5c62ae.mp4");
    expect(pageSource).toContain("/manus-storage/replacement-speaking-event-poster_5353b331.jpg");
    expect(pageSource).not.toContain("/manus-storage/dr-aldeek-speaking-event-web_db5bfc0c.mp4");
    expect(pageSource).not.toContain("/manus-storage/dr-aldeek-speaking-event-poster_125d9f5e.jpg");
    expect(pageSource).not.toContain("Video Placeholder");
    expect(pageSource).toContain("Dr. Photo Placeholder");
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
    expect(pageSource).not.toMatch(/Forbes|Entrepreneur|countdown|spots? (?:are )?limited/i);
    expect(pageSource.match(/<section\b/g)).toHaveLength(1);
  });

  it("uses the approved headline-video, symptom-band, and lower conversion hierarchy", () => {
    const upperRowPosition = pageSource.indexOf("data-webinar-upper-row");
    const headlinePosition = pageSource.indexOf("data-webinar-headline");
    const videoPosition = pageSource.indexOf("data-webinar-video-shell");
    const symptomsPosition = pageSource.indexOf("data-webinar-symptoms");
    const lowerRowPosition = pageSource.indexOf("data-webinar-lower-row");

    expect(pageSource.match(/lg:grid-cols-\[0\.95fr_1\.05fr\]/g)).toHaveLength(2);
    expect(upperRowPosition).toBeGreaterThan(-1);
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
