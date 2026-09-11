import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  CARE_TEAM_BOOKING_CONFIRMATION_PATH,
  getCareTeamConfirmationRedirectTarget,
  isCareTeamConfirmationRedirectMessage,
} from "../client/src/lib/careTeamBookingRedirect";

const bookingPageSource = readFileSync(
  resolve(process.cwd(), "client/src/pages/CareTeamBooking.tsx"),
  "utf8",
);
const homepageSource = readFileSync(
  resolve(process.cwd(), "client/src/pages/HomeHrt3.tsx"),
  "utf8",
);

describe("care-team completed-booking handoff", () => {
  it("recognizes only HighLevel's exact parent-URL action for the care-team confirmation path", () => {
    expect(isCareTeamConfirmationRedirectMessage([
      "modify-parent-url",
      "https://medmethoddirect.com/care-team-booking-confirmed",
    ])).toBe(true);
    expect(isCareTeamConfirmationRedirectMessage([
      "modify-parent-url",
      "/care-team-booking-confirmed",
    ])).toBe(true);
    expect(isCareTeamConfirmationRedirectMessage([
      "modify-parent-url",
      "https://medmethoddirect.com/live-webinar3-confirmed",
    ])).toBe(false);
    expect(isCareTeamConfirmationRedirectMessage(["highlevel.setHeight", { height: 900 }])).toBe(false);
    expect(isCareTeamConfirmationRedirectMessage("care-team-booking-confirmed")).toBe(false);
  });

  it("accepts a query or hash on the dedicated confirmation destination", () => {
    const message = [
      "modify-parent-url",
      "https://www.medmethoddirect.com/care-team-booking-confirmed?start=2026-09-11T11%3A30%3A00-04%3A00&timezone=America%2FNew_York#confirmed",
    ];
    expect(isCareTeamConfirmationRedirectMessage(message)).toBe(true);
    expect(getCareTeamConfirmationRedirectTarget(message)).toBe(
      "/care-team-booking-confirmed?start=2026-09-11T11%3A30%3A00-04%3A00&timezone=America%2FNew_York#confirmed",
    );
  });

  it("keeps the homepage CTA on the calendar and navigates only a trusted calendar-frame message", () => {
    expect(homepageSource).toContain('href="/care-team-booking"');
    expect(bookingPageSource).toContain("event.origin !== CARE_TEAM_CALENDAR_ORIGIN");
    expect(bookingPageSource).toContain("event.source !== calendarRef.current.contentWindow");
    expect(bookingPageSource).toContain("getCareTeamConfirmationRedirectTarget(event.data)");
    expect(bookingPageSource).toContain("window.location.assign(confirmationTarget)");
    expect(CARE_TEAM_BOOKING_CONFIRMATION_PATH).toBe("/care-team-booking-confirmed");
  });
});
