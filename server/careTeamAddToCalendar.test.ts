import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildAppleCalendarIcs,
  buildGoogleCalendarUrl,
  buildOutlookCalendarUrl,
  formatCalendarUtc,
  getCareTeamFixedTimeZoneOffsetMinutes,
  parseCareTeamCalendarEvent,
} from "../client/src/lib/careTeamCalendarEvent";

const confirmationPageSource = readFileSync(
  resolve(process.cwd(), "client/src/pages/CareTeamBookingConfirmed.tsx"),
  "utf8",
);
const calendarControlSource = readFileSync(
  resolve(process.cwd(), "client/src/components/CareTeamAddToCalendar.tsx"),
  "utf8",
);

describe("care-team Add to Calendar", () => {
  const event = parseCareTeamCalendarEvent(
    "?contact_id=private-contact&start=2026-09-11T11%3A30%3A00-04%3A00&timezone=America%2FNew_York&location=https%3A%2F%2Fmeet.google.com%2Fabc-defg-hij",
  );

  it("parses the dynamic redirect fields and derives a 15-minute UTC event", () => {
    expect(event).not.toBeNull();
    expect(event?.start.toISOString()).toBe("2026-09-11T15:30:00.000Z");
    expect(event?.end.toISOString()).toBe("2026-09-11T15:45:00.000Z");
    expect(event?.timeZone).toBe("America/New_York");
    expect(event?.location).toBe("https://meet.google.com/abc-defg-hij");
    expect(formatCalendarUtc(event!.start)).toBe("20260911T153000Z");
  });

  it("correctly converts a timezone-qualified wall-clock start across daylight saving time", () => {
    const wallClockEvent = parseCareTeamCalendarEvent(
      "?start=September%2011%2C%202026%2011%3A30%20AM&timezone=America%2FNew_York%20%28EDT%29&location=Online",
    );

    expect(wallClockEvent?.start.toISOString()).toBe("2026-09-11T15:30:00.000Z");
    expect(wallClockEvent?.end.toISOString()).toBe("2026-09-11T15:45:00.000Z");

    const abbreviatedMonthEvent = parseCareTeamCalendarEvent(
      "?start=Sep%2011%2C%202026%2011%3A30%20AM&timezone=America%2FNew_York",
    );
    expect(abbreviatedMonthEvent?.start.toISOString()).toBe("2026-09-11T15:30:00.000Z");

    const numericEvent = parseCareTeamCalendarEvent(
      "?start=09%2F11%2F2026%2011%3A30%20AM&timezone=America%2FNew_York",
    );
    expect(numericEvent?.start.toISOString()).toBe("2026-09-11T15:30:00.000Z");
  });

  it("parses GoHighLevel weekday-prefixed starts with fixed US timezone abbreviations", () => {
    const expectedUtcHours: Record<string, string> = {
      EST: "15:30:00.000Z",
      EDT: "14:30:00.000Z",
      CST: "16:30:00.000Z",
      CDT: "15:30:00.000Z",
      MST: "17:30:00.000Z",
      MDT: "16:30:00.000Z",
      PST: "18:30:00.000Z",
      PDT: "17:30:00.000Z",
    };

    for (const [timeZone, utcTime] of Object.entries(expectedUtcHours)) {
      const fixedOffsetEvent = parseCareTeamCalendarEvent(
        `?start=Monday%2C%20September%2014%2C%202026%2010%3A30%20AM&timezone=${timeZone}`,
      );
      expect(fixedOffsetEvent?.start.toISOString()).toBe(`2026-09-14T${utcTime}`);
      expect(fixedOffsetEvent?.timeZone).toBe(timeZone);
    }

    expect(getCareTeamFixedTimeZoneOffsetMinutes("EDT")).toBe(-240);
    expect(getCareTeamFixedTimeZoneOffsetMinutes("PST")).toBe(-480);
  });

  it("omits an invalid Google ctz parameter for fixed abbreviations while preserving UTC dates", () => {
    const fixedOffsetEvent = parseCareTeamCalendarEvent(
      "?start=Monday%2C%20September%2014%2C%202026%2010%3A30%20AM&timezone=EDT",
    );
    const google = new URL(buildGoogleCalendarUrl(fixedOffsetEvent!));

    expect(google.searchParams.get("dates")).toBe("20260914T143000Z/20260914T144500Z");
    expect(google.searchParams.has("ctz")).toBe(false);
  });

  it("builds Google and Outlook links with matching event details and no contact identifier", () => {
    const google = new URL(buildGoogleCalendarUrl(event!));
    expect(google.origin).toBe("https://calendar.google.com");
    expect(google.searchParams.get("action")).toBe("TEMPLATE");
    expect(google.searchParams.get("dates")).toBe("20260911T153000Z/20260911T154500Z");
    expect(google.searchParams.get("location")).toBe("https://meet.google.com/abc-defg-hij");

    const outlook = new URL(buildOutlookCalendarUrl(event!));
    expect(outlook.origin).toBe("https://outlook.live.com");
    expect(outlook.searchParams.get("startdt")).toBe("2026-09-11T15:30:00.000Z");
    expect(outlook.searchParams.get("enddt")).toBe("2026-09-11T15:45:00.000Z");
    expect(`${google}${outlook}`).not.toContain("private-contact");
  });

  it("creates a standards-based Apple calendar file with the same UTC event", () => {
    const ics = buildAppleCalendarIcs(event!, new Date("2026-09-01T12:00:00.000Z"));
    expect(ics).toContain("BEGIN:VCALENDAR\r\nVERSION:2.0");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("DTSTAMP:20260901T120000Z");
    expect(ics).toContain("DTSTART:20260911T153000Z");
    expect(ics).toContain("DTEND:20260911T154500Z");
    expect(ics).toContain("SUMMARY:MedMethod Direct Care Team Discovery Call");
    expect(ics).toContain("LOCATION:https://meet.google.com/abc-defg-hij");
    expect(ics).toContain("END:VEVENT\r\nEND:VCALENDAR\r\n");
    expect(ics).toMatch(/DESCRIPTION:.{1,73}\r\n .+/);
    expect(ics).not.toContain("private-contact");
  });

  it("does not render calendar actions when required merge fields are missing or unresolved", () => {
    expect(parseCareTeamCalendarEvent("?contact_id=123")).toBeNull();
    expect(
      parseCareTeamCalendarEvent(
        "?start=%7B%7Bappointment.start_time%7D%7D&timezone=%7B%7Bappointment.timezone%7D%7D",
      ),
    ).toBeNull();
  });

  it("keeps the paused calendar implementation detached from the confirmation page", () => {
    expect(confirmationPageSource).not.toContain("CareTeamAddToCalendar");
    expect(confirmationPageSource).toContain('w.dataLayer?.push({ event: "care_team_discovery_call_booked" })');
    expect(calendarControlSource).toContain("data-care-team-appointment-details");
    expect(calendarControlSource).toContain("15 min");
    expect(calendarControlSource).toContain("dateTimeLabel");
    expect(calendarControlSource).toContain("timezoneLabel");
    expect(calendarControlSource).toContain("meetingHref");
    expect(calendarControlSource).toContain("data-care-team-calendar-actions");
    expect(calendarControlSource).toContain("space-y-3");
    expect(calendarControlSource).toContain("Google Calendar");
    expect(calendarControlSource).toContain("Outlook Calendar");
    expect(calendarControlSource).toContain("iCloud Calendar");
    expect(calendarControlSource).toContain("URL.createObjectURL(blob)");
    expect(calendarControlSource).toContain('get("contact_id")');
    expect(calendarControlSource).not.toContain("DropdownMenu");
  });
});
