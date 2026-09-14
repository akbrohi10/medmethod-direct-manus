import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const pageSource = fs.readFileSync(path.join(projectRoot, "client/src/pages/FreeMasterclass.tsx"), "utf8");
const appSource = fs.readFileSync(path.join(projectRoot, "client/src/App.tsx"), "utf8");

describe("free evergreen masterclass landing page", () => {
  it("registers the isolated evergreen route", () => {
    expect(appSource).toContain('const FreeMasterclass = lazy(() => import("@/pages/FreeMasterclass"));');
    expect(appSource).toContain('<Route path="/free-masterclass" component={FreeMasterclass} />');
  });

  it("provides immediate placeholder-video access and does not reuse live-event language", () => {
    expect(pageSource).toContain('data-free-masterclass-video');
    expect(pageSource).toContain('replacement-speaking-event-web_3c5c62ae.mp4');
    expect(pageSource).toContain('controls playsInline preload="metadata"');
    expect(pageSource).toContain('Free On-Demand Masterclass');
    expect(pageSource).toContain('MASTERCLASS PREVIEW');
    expect(pageSource).toContain('Preview video shown while the full 45-minute masterclass is finalized.');
    expect(pageSource).not.toContain('Reserve My Free Spot');
    expect(pageSource).not.toContain('Limited Zoom Capacity');
  });

  it("keeps the established featured outlets, booking choices, and transparent pricing without a lower calendar embed", () => {
    expect(pageSource).toContain('This Is Menopause');
    expect(pageSource).toContain('Woman’s World');
    expect(pageSource).toContain('data-free-masterclass-physician-cta');
    expect(pageSource).toContain('data-free-masterclass-care-team-cta');
    expect(pageSource).toContain('href="/care-team-booking"');
    expect(pageSource).toContain('data-free-masterclass-pricing');
    expect(pageSource).toContain('See Full Pricing Details');
    expect(pageSource).not.toContain('data-free-masterclass-care-team-calendar');
    expect(pageSource).not.toContain('18sbmUpLKjc7pcLE8jdN_free_masterclass');
    expect(pageSource).not.toContain('CARE_TEAM_CALENDAR_ORIGIN');
  });
});
