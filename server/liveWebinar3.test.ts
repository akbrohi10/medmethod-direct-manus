import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const appSource = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
const liveWebinar2Source = readFileSync(
  resolve(process.cwd(), "client/src/pages/LiveWebinar2.tsx"),
  "utf8",
);
const liveWebinar3Source = readFileSync(
  resolve(process.cwd(), "client/src/pages/LiveWebinar3.tsx"),
  "utf8",
);

describe("live webinar 3 A/B variation", () => {
  it("registers an isolated public route without changing the existing webinar routes", () => {
    expect(appSource).toContain('const LiveWebinar3 = lazy(() => import("@/pages/LiveWebinar3"));');
    expect(appSource).toContain('const LiveWebinar3Confirmed = lazy(() => import("@/pages/LiveWebinar3Confirmed"));');
    expect(appSource).toContain('<Route path="/live-webinar3" component={LiveWebinar3} />');
    expect(appSource).toContain('<Route path="/live-webinar3-confirmed" component={LiveWebinar3Confirmed} />');
    expect(appSource).toContain('location === "/live-webinar3"');
    expect(appSource).toContain('location === "/live-webinar3-confirmed"');
    expect(appSource).toContain('<Route path="/live-webinar2" component={LiveWebinar2} />');
    expect(appSource).toContain('<Route path="/live-webinar" component={LiveWebinar} />');
  });

  it("uses the approved short-form conversion path while retaining the event, video, CTA, and footer essentials", () => {
    expect(liveWebinar3Source).toContain("Free Live Zoom Webinar");
    expect(liveWebinar3Source).toContain('startsAt: "2026-09-23T19:30:00-04:00" as string | null');
    expect(liveWebinar3Source).toContain('dateTimeDisplay: "WEDNESDAY, SEPTEMBER 23 · 7:30 PM EST"');
    expect(liveWebinar3Source).not.toContain("A Free Educational Webinar");
    expect(liveWebinar3Source).toContain("data-webinar3-top-video");
    expect(liveWebinar3Source).toContain("data-webinar2-video-shell");
    expect(liveWebinar3Source).toContain("data-webinar2-video-captions");
    expect(liveWebinar3Source).toContain("data-webinar3-caption-bar");
    expect(liveWebinar3Source).not.toContain("data-webinar2-caption-overlay");
    expect(liveWebinar3Source).not.toContain("data-webinar2-captions-toggle");
    expect(liveWebinar3Source).not.toContain("setCaptionsEnabled");
    expect(liveWebinar3Source).toContain("{activeCaption && (");
    expect(liveWebinar3Source).toContain("data-webinar2-primary-cta");
    expect(liveWebinar3Source).toContain('confirmationPath="/live-webinar3-confirmed"');
    expect(liveWebinar3Source).toContain('const LIVE_WEBINAR3_HANDOFF_STORAGE_KEY = "medmethod:live-webinar3-confirmation-handoff"');
    expect(liveWebinar3Source).toContain('window.sessionStorage.setItem(LIVE_WEBINAR3_HANDOFF_STORAGE_KEY, String(Date.now()))');
    expect(liveWebinar3Source).toContain('window.sessionStorage.removeItem(LIVE_WEBINAR3_HANDOFF_STORAGE_KEY)');
    expect(liveWebinar3Source).toContain('onOpenChange={handleRegistrationOpenChange}');
    expect(liveWebinar3Source).toContain("data-webinar2-featured-in");
    expect(liveWebinar3Source).toContain("data-webinar3-short-footer");
    expect(liveWebinar3Source).toContain("data-webinar2-legitscript-footer");
    expect(liveWebinar3Source).toContain("for general educational purposes and is not a medical consultation");
    expect(liveWebinar3Source).not.toContain("data-webinar2-opening-copy");
    expect(liveWebinar3Source).not.toContain("data-webinar2-authority-intro");
    expect(liveWebinar3Source).not.toContain("data-webinar2-learning");
    expect(liveWebinar3Source).not.toContain("Because You Deserve to Know.");
    expect(liveWebinar3Source.indexOf("data-webinar2-top-event")).toBeLessThan(
      liveWebinar3Source.indexOf("data-webinar3-top-video"),
    );
    expect(liveWebinar3Source.indexOf("data-webinar3-top-video")).toBeLessThan(
      liveWebinar3Source.indexOf("data-webinar3-primary-cta"),
    );
    expect(liveWebinar3Source.indexOf("data-webinar3-primary-cta")).toBeLessThan(
      liveWebinar3Source.indexOf("data-webinar2-featured-in"),
    );
    expect(liveWebinar3Source.indexOf("data-webinar2-featured-in")).toBeLessThan(
      liveWebinar3Source.indexOf("data-webinar3-short-footer"),
    );
    expect(liveWebinar3Source).not.toBe(liveWebinar2Source);
  });

  it("uses a visible muted-autoplay overlay that restarts the webinar from the beginning with sound", () => {
    expect(liveWebinar3Source).toContain("data-webinar3-unmute-overlay");
    expect(liveWebinar3Source).toContain('aria-label="Restart video from the beginning with sound"');
    expect(liveWebinar3Source).toContain("Your video is playing");
    expect(liveWebinar3Source).toContain("Tap to start with sound");
    expect(liveWebinar3Source).toContain("const handleEnableSound = async () => {");
    expect(liveWebinar3Source).toContain("video.pause();");
    expect(liveWebinar3Source).toContain("video.currentTime = 0");
    expect(liveWebinar3Source).toContain("await video.play();");
    expect(liveWebinar3Source).toContain("data-webinar3-caption-bar");
  });
});
