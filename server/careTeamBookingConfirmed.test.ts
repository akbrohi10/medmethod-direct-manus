import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(
  resolve(process.cwd(), "client/src/pages/CareTeamBookingConfirmed.tsx"),
  "utf8",
);
const appSource = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
const metaPixelBootstrapSource = readFileSync(
  resolve(process.cwd(), "client/src/lib/metaPixelBootstrap.ts"),
  "utf8",
);

describe("care-team discovery-call confirmation", () => {
  it("registers a dedicated public confirmation route separate from the discovery-call calendar", () => {
    expect(appSource).toContain('const CareTeamBookingConfirmed = lazy(() => import("@/pages/CareTeamBookingConfirmed"));');
    expect(appSource).toContain('<Route path="/care-team-booking-confirmed" component={CareTeamBookingConfirmed} />');
    expect(appSource).toContain('<Route path="/care-team-booking" component={CareTeamBooking} />');
  });

  it("confirms the free discovery call without payment or physician-visit language", () => {
    expect(pageSource).toContain("Your Free Call Is Confirmed.");
    expect(pageSource).toContain("Your free 15-minute call with the MedMethod Direct Care Team has been scheduled.");
    expect(pageSource).toContain("This free call provides general information only.");
    expect(pageSource).toContain("It does not provide medical advice, diagnosis, or treatment recommendations.");
    expect(pageSource).toContain("Please refer to your appointment confirmation for the scheduled date, time, and call details.");
    expect(pageSource).not.toMatch(/\$50|deposit|payment|physician visit|remaining balance/i);
  });

  it("keeps the guarded dataLayer signal and uses the route-aware Schedule Pixel", () => {
    expect(pageSource).toContain('const CARE_TEAM_DISCOVERY_CALL_CONVERSION_STORAGE_KEY =');
    expect(pageSource).toContain('window.sessionStorage.getItem(CARE_TEAM_DISCOVERY_CALL_CONVERSION_STORAGE_KEY)');
    expect(pageSource).toContain('window.sessionStorage.setItem(CARE_TEAM_DISCOVERY_CALL_CONVERSION_STORAGE_KEY, "1")');
    expect(pageSource).toContain('w.dataLayer?.push({ event: "care_team_discovery_call_booked" })');
    expect(pageSource).not.toContain("fbq");
    expect(metaPixelBootstrapSource).toContain('["/care-team-booking-confirmed", "Schedule"]');
    expect(metaPixelBootstrapSource).toContain('"fbq(\'track\', \'Schedule\');"');
  });

  it("keeps the paused Add to Calendar feature completely off the confirmation page", () => {
    expect(pageSource).not.toContain("CareTeamAddToCalendar");
    expect(pageSource).not.toContain("Preparing calendar options");
    expect(pageSource).not.toContain("Calendar details are still processing");
  });
});
