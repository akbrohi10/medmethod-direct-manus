import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(
  resolve(process.cwd(), "client/src/pages/LiveWebinar3Confirmed.tsx"),
  "utf8",
);
const appSource = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");

describe("live webinar 3 companion confirmation", () => {
  it("registers an isolated confirmation route that preserves the original webinar confirmation page", () => {
    expect(appSource).toContain('const LiveWebinar3Confirmed = lazy(() => import("@/pages/LiveWebinar3Confirmed"));');
    expect(appSource).toContain('<Route path="/live-webinar3-confirmed" component={LiveWebinar3Confirmed} />');
    expect(pageSource).toContain('data-live-webinar3-confirmation');
    expect(pageSource).toContain('href="/"');
    expect(pageSource).not.toContain('href="/live-webinar3"');
    expect(pageSource).toContain('content="noindex, nofollow"');
  });

  it("restores the fuller educational context after confirmation without a second registration CTA", () => {
    expect(pageSource).toContain('data-live-webinar3-confirmed-learning');
    expect(pageSource).toContain('data-live-webinar3-confirmed-doctor');
    expect(pageSource).toContain("Because You Deserve to Know.");
    expect(pageSource).toContain("Why You Can’t Lose Weight Like You Used To");
    expect(pageSource).toContain("Live Q&A with Dr. Jumana Al-Deek");
    expect(pageSource).toContain("Dr. Jumana Al-Deek");
    expect(pageSource).not.toContain("Reserve My Free Spot");
  });

  it("fires a separately guarded webinar conversion with no purchase semantics", () => {
    expect(pageSource).toContain('const LIVE_WEBINAR3_CONVERSION_STORAGE_KEY = "medmethod:live-webinar3-registration-conversion-fired"');
    expect(pageSource).toContain('w.dataLayer?.push({ event: "live_webinar3_registration_complete" })');
    expect(pageSource).toContain('w.fbq?.("track", "CompleteRegistration"');
    expect(pageSource).toContain('content_name: "Free Live Zoom Webinar"');
    expect(pageSource).not.toContain('"Purchase"');
  });
});
