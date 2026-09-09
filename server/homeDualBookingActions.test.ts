import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(resolve(process.cwd(), "client/src/pages/HomeHrt3.tsx"), "utf8");
const medicalTeamSource = readFileSync(resolve(process.cwd(), "client/src/components/home1/MedicalTeam.tsx"), "utf8");
const careTeamBookingSource = readFileSync(resolve(process.cwd(), "client/src/pages/CareTeamBooking.tsx"), "utf8");
const appSource = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");

describe("homepage dual booking actions", () => {
  it("offers distinct physician appointment and care-team discovery actions in the homepage hero", () => {
    expect(homeSource).toContain('ctaLabel="Book Your 45-Minute Appointment with Dr. Al-Deek"');
    expect(homeSource).toContain("secondaryAction={{");
    expect(homeSource).toContain('href: "/care-team-booking"');
    expect(homeSource).toContain('label: "Book a Free 15-Minute Discovery Call"');
    expect(homeSource).toContain("General information only — no medical advice.");
    expect(medicalTeamSource).toContain("data-home-physician-appointment-cta");
    expect(medicalTeamSource).toContain("data-home-discovery-call-cta");
    expect(medicalTeamSource).toContain("secondaryAction?: { href: string; label: ReactNode; description?: ReactNode }");
  });

  it("keeps the supplied SendMeAPro care-team calendar on its own public route", () => {
    expect(appSource).toContain('<Route path="/care-team-booking" component={CareTeamBooking} />');
    expect(careTeamBookingSource).toContain("Book a Free 15-Minute Discovery Call");
    expect(careTeamBookingSource).toContain("This free call does not provide medical advice or clinical guidance.");
    expect(careTeamBookingSource).toContain('src="https://link.sendmeapro.com/widget/booking/18sbmUpLKjc7pcLE8jdN"');
    expect(careTeamBookingSource).toContain('id="18sbmUpLKjc7pcLE8jdN_1788980907986"');
  });
});
