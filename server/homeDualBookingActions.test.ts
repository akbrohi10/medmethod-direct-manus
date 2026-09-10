import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(resolve(process.cwd(), "client/src/pages/HomeHrt3.tsx"), "utf8");
const medicalTeamSource = readFileSync(resolve(process.cwd(), "client/src/components/home1/MedicalTeam.tsx"), "utf8");
const careTeamBookingSource = readFileSync(resolve(process.cwd(), "client/src/pages/CareTeamBooking.tsx"), "utf8");
const appSource = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
const heroStart = homeSource.indexOf("<MedicalTeam");
const heroEnd = homeSource.indexOf("\n        />", heroStart);
const heroSource = homeSource.slice(heroStart, heroEnd);

describe("homepage dual booking actions", () => {
  it("offers distinct physician appointment and care-team discovery actions in the homepage hero", () => {
    expect(heroSource).toContain('ctaEyebrow="Ready to Book?"');
    expect(heroSource).toContain('ctaLabel="Book Your 45-Minute Visit"');
    expect(heroSource).toContain('ctaSupportingLine="with Dr. Al-Deek"');
    expect(heroSource).toContain("$199 first visit. A $50 deposit holds your appointment and is applied to the visit.");
    expect(heroSource).toContain("secondaryAction={{");
    expect(heroSource).toContain('href: "/care-team-booking"');
    expect(heroSource).toContain('eyebrow: "Need More Info?"');
    expect(heroSource).toContain('label: "Book a Free 15-Minute Call"');
    expect(heroSource).toContain('supportingLine: "with our Care Team"');
    expect(heroSource).toContain("General information only—not medical advice.");
    expect(heroSource).not.toContain("$199 First Visit");
    expect(heroSource).not.toContain("$50 Deposit Today");
    expect(medicalTeamSource).toContain("data-home-physician-appointment-cta");
    expect(medicalTeamSource).toContain("data-home-discovery-call-cta");
    expect(medicalTeamSource).toContain("ctaSupportingLine?: ReactNode");
    expect(medicalTeamSource).toContain("supportingLine?: ReactNode");
    expect(medicalTeamSource).toContain("min-h-[76px]");
    expect(medicalTeamSource).toContain("sm:grid-cols-2");
    expect(medicalTeamSource).toContain("text-[11px] font-extrabold uppercase tracking-[0.19em]");
  });

  it("keeps booking information clear without adding unverified policies", () => {
    expect(homeSource).toContain("See full pricing details");
    expect(homeSource).not.toContain("No card required");
    expect(homeSource).not.toContain("Free reschedule up to 24 hours before");
    expect(medicalTeamSource.indexOf("ctaMicrocopy &&")).toBeGreaterThan(
      medicalTeamSource.indexOf("secondaryAction &&"),
    );
  });

  it("routes the mobile lower questions action to the discovery-call calendar instead of a telephone link", () => {
    expect(homeSource).toContain("data-home-sticky-discovery-call-cta");
    expect(homeSource).toContain('href="/care-team-booking"');
    expect(homeSource).toContain('aria-label="Need More Info? Book a Free 15-Minute Discovery Call"');
    expect(homeSource).toContain("Need More Info?");
    expect(homeSource).toContain("Free 15-Min Call");
    expect(homeSource).toContain("Ready to Book?");
    expect(homeSource).toContain("$50 Deposit Today");
    expect(homeSource).not.toContain("Have questions?");
    expect(homeSource).not.toContain("Call Now");
  });

  it("keeps the compact mobile booking actions in the approved side-by-side pill layout", () => {
    expect(homeSource).toContain('className="flex gap-2"');
    expect(homeSource).toContain("tracking-tight uppercase whitespace-nowrap");
    expect(homeSource).toContain("showStickyCTA ? 'h-20' : 'h-0'");
  });

  it("keeps the supplied SendMeAPro care-team calendar on its own public route", () => {
    expect(appSource).toContain('<Route path="/care-team-booking" component={CareTeamBooking} />');
    expect(careTeamBookingSource).toContain("Book a Free 15-Minute Discovery Call");
    expect(careTeamBookingSource).toContain("This free call does not provide medical advice or clinical guidance.");
    expect(careTeamBookingSource).toContain('src="https://link.sendmeapro.com/widget/booking/18sbmUpLKjc7pcLE8jdN"');
    expect(careTeamBookingSource).toContain('id="18sbmUpLKjc7pcLE8jdN_1788980907986"');
  });
});
