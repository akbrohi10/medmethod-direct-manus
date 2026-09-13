import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  resolve(process.cwd(), "client/src/components/home1/MedicalTeam.tsx"),
  "utf8",
);

describe("homepage Featured In banner", () => {
  it("uses the eight approved publication marks in an accessible duplicated marquee", () => {
    for (const outlet of [
      "Flow Space",
      "SingleCare",
      "NTD",
      "Scary Mommy",
      "Daily Mail",
      "Yahoo Health",
      "This Is Menopause",
      "Woman’s World",
    ]) {
      expect(source).toContain(`name: "${outlet}"`);
    }

    expect(source).toContain('/manus-storage/this-is-menopause-white_a9dd5679.png');
    expect(source).toContain('/manus-storage/womans-world-white_ef5f9e69.png');
    expect(source).toContain('aria-label="Featured media outlets"');
    expect(source).toContain('aria-hidden="true"');
    expect(source).toContain("webinar2-logo-marquee__track");
    expect(source).toContain("webinar2-logo-marquee__duplicate");
    expect(source).toContain('loading="eager"');
    expect(source).toContain("onLoad={handleAssetSettled}");
    expect(source).toContain("onError={handleAssetSettled}");
    expect(source).toContain("aria-busy={!isReady}");
    expect(source).toContain('isReady ? "is-ready" : ""');
  });

  it("places the banner immediately after the doctor image and before the booking choices at every responsive layout", () => {
    expect(source.indexOf('<FeaturedInMarquee placement="desktop" />')).toBeGreaterThan(
      source.indexOf('src={DR_ALDEEK_SQUARE}'),
    );
    expect(source.indexOf('<FeaturedInMarquee placement="mobile" />')).toBeGreaterThan(
      source.lastIndexOf('src={DR_ALDEEK_SQUARE}'),
    );
    expect(source.indexOf('<FeaturedInMarquee placement="mobile" />')).toBeLessThan(
      source.indexOf('id="hero-cta-sentinel"'),
    );
  });

  it("keeps existing paid and free booking choices intact", () => {
    expect(source).toContain("data-home-physician-appointment-cta");
    expect(source).toContain("data-home-discovery-call-cta");
    expect(source).toContain("min-h-[76px]");
  });
});
