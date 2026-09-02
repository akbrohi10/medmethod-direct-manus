import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const pageSource = readFileSync(resolve(projectRoot, "client/src/pages/LiveWebinar.tsx"), "utf8");
const appSource = readFileSync(resolve(projectRoot, "client/src/App.tsx"), "utf8");

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

  it("keeps the page hero-only with a nonfunctional registration and video placeholder", () => {
    expect(pageSource).toContain("Video Placeholder");
    expect(pageSource).toContain("Dr. Photo Placeholder");
    expect(pageSource).toContain("Book Image Placeholder");
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

  it("suppresses social-proof popups on the focused webinar landing page", () => {
    expect(appSource).toContain('if (location === "/live-webinar") return null;');
  });
});
