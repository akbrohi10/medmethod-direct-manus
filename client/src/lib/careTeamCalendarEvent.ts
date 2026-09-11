export const CARE_TEAM_EVENT_TITLE = "MedMethod Direct Care Team Discovery Call";
export const CARE_TEAM_EVENT_DURATION_MINUTES = 15;
export const CARE_TEAM_EVENT_DESCRIPTION =
  "Your free 15-minute discovery call with the MedMethod Direct Care Team. This call provides general program information only and does not include medical advice.";

export type CareTeamCalendarEvent = {
  title: string;
  description: string;
  start: Date;
  end: Date;
  timeZone: string;
  location: string;
};

type DateParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

const MONTHS: Record<string, number> = {
  january: 1,
  jan: 1,
  february: 2,
  feb: 2,
  march: 3,
  mar: 3,
  april: 4,
  apr: 4,
  may: 5,
  june: 6,
  jun: 6,
  july: 7,
  jul: 7,
  august: 8,
  aug: 8,
  september: 9,
  sep: 9,
  sept: 9,
  october: 10,
  oct: 10,
  november: 11,
  nov: 11,
  december: 12,
  dec: 12,
};

export const CARE_TEAM_FIXED_TIME_ZONE_OFFSETS_MINUTES: Readonly<Record<string, number>> = {
  EST: -5 * 60,
  EDT: -4 * 60,
  CST: -6 * 60,
  CDT: -5 * 60,
  MST: -7 * 60,
  MDT: -6 * 60,
  PST: -8 * 60,
  PDT: -7 * 60,
};

function cleanDynamicValue(value: string | null): string {
  const cleaned = value?.trim() ?? "";
  if (!cleaned || cleaned.includes("{{") || cleaned.includes("}}")) return "";
  return cleaned.slice(0, 2_000);
}

export function normalizeCareTeamTimeZone(value: string): string {
  const trimmed = value.trim();
  const abbreviation = trimmed.toUpperCase();
  if (abbreviation in CARE_TEAM_FIXED_TIME_ZONE_OFFSETS_MINUTES) {
    return abbreviation;
  }
  return trimmed.replace(/\s+\([A-Z]{2,6}\)$/, "").trim();
}

export function getCareTeamFixedTimeZoneOffsetMinutes(timeZone: string): number | null {
  return CARE_TEAM_FIXED_TIME_ZONE_OFFSETS_MINUTES[timeZone.toUpperCase()] ?? null;
}

export function isValidCareTeamTimeZone(timeZone: string): boolean {
  if (getCareTeamFixedTimeZoneOffsetMinutes(timeZone) !== null) return true;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

function parseWallClockParts(value: string): DateParts | null {
  const isoLike = value.match(
    /^(\d{4})-(\d{2})-(\d{2})[T\s](\d{1,2}):(\d{2})(?::(\d{2}))?(?:\.\d{1,3})?$/,
  );
  if (isoLike) {
    return {
      year: Number(isoLike[1]),
      month: Number(isoLike[2]),
      day: Number(isoLike[3]),
      hour: Number(isoLike[4]),
      minute: Number(isoLike[5]),
      second: Number(isoLike[6] ?? 0),
    };
  }

  const namedMonth = value.match(
    /^(?:[A-Za-z]+,\s*)?([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i,
  );
  if (!namedMonth) return null;

  const month = MONTHS[namedMonth[1].toLowerCase()];
  if (!month) return null;

  let hour = Number(namedMonth[4]) % 12;
  if (namedMonth[7].toUpperCase() === "PM") hour += 12;

  return {
    year: Number(namedMonth[3]),
    month,
    day: Number(namedMonth[2]),
    hour,
    minute: Number(namedMonth[5]),
    second: Number(namedMonth[6] ?? 0),
  };
}

function parseNumericWallClockParts(value: string): DateParts | null {
  const numeric = value.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i,
  );
  if (!numeric) return null;

  let hour = Number(numeric[4]) % 12;
  if (numeric[7].toUpperCase() === "PM") hour += 12;

  return {
    year: Number(numeric[3]),
    month: Number(numeric[1]),
    day: Number(numeric[2]),
    hour,
    minute: Number(numeric[5]),
    second: Number(numeric[6] ?? 0),
  };
}

function getPartsInTimeZone(date: Date, timeZone: string): DateParts | null {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date);

    const values = Object.fromEntries(
      parts.filter(part => part.type !== "literal").map(part => [part.type, Number(part.value)]),
    );

    return {
      year: values.year,
      month: values.month,
      day: values.day,
      hour: values.hour,
      minute: values.minute,
      second: values.second,
    };
  } catch {
    return null;
  }
}

function sameDateParts(left: DateParts, right: DateParts): boolean {
  return (
    left.year === right.year &&
    left.month === right.month &&
    left.day === right.day &&
    left.hour === right.hour &&
    left.minute === right.minute &&
    left.second === right.second
  );
}

function wallClockToUtc(parts: DateParts, timeZone: string): Date | null {
  const wallClockUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );

  let instant = wallClockUtc;
  for (let iteration = 0; iteration < 3; iteration += 1) {
    const observed = getPartsInTimeZone(new Date(instant), timeZone);
    if (!observed) return null;

    const observedAsUtc = Date.UTC(
      observed.year,
      observed.month - 1,
      observed.day,
      observed.hour,
      observed.minute,
      observed.second,
    );
    const nextInstant = wallClockUtc - (observedAsUtc - instant);
    if (nextInstant === instant) break;
    instant = nextInstant;
  }

  const result = new Date(instant);
  const roundTrip = getPartsInTimeZone(result, timeZone);
  return roundTrip && sameDateParts(roundTrip, parts) ? result : null;
}

function fixedOffsetWallClockToUtc(parts: DateParts, offsetMinutes: number): Date | null {
  const instant = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  ) - offsetMinutes * 60_000;
  const result = new Date(instant);
  const roundTrip = new Date(result.getTime() + offsetMinutes * 60_000);
  const roundTripParts: DateParts = {
    year: roundTrip.getUTCFullYear(),
    month: roundTrip.getUTCMonth() + 1,
    day: roundTrip.getUTCDate(),
    hour: roundTrip.getUTCHours(),
    minute: roundTrip.getUTCMinutes(),
    second: roundTrip.getUTCSeconds(),
  };

  return sameDateParts(roundTripParts, parts) ? result : null;
}

export function parseCareTeamStart(value: string, timeZone: string): Date | null {
  if (/([zZ]|[+-]\d{2}:?\d{2})$/.test(value)) {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parts = parseWallClockParts(value) ?? parseNumericWallClockParts(value);
  if (!parts) return null;

  const normalizedTimeZone = normalizeCareTeamTimeZone(timeZone);
  const fixedOffsetMinutes = getCareTeamFixedTimeZoneOffsetMinutes(normalizedTimeZone);
  return fixedOffsetMinutes === null
    ? wallClockToUtc(parts, normalizedTimeZone)
    : fixedOffsetWallClockToUtc(parts, fixedOffsetMinutes);
}

export function parseCareTeamCalendarEvent(search: string): CareTeamCalendarEvent | null {
  const params = new URLSearchParams(search);
  return createCareTeamCalendarEvent({
    start: params.get("start"),
    timezone: params.get("timezone"),
    location: params.get("location"),
  });
}

export function createCareTeamCalendarEvent(input: {
  start: string | null;
  timezone: string | null;
  location?: string | null;
}): CareTeamCalendarEvent | null {
  const startValue = cleanDynamicValue(input.start);
  const timeZone = normalizeCareTeamTimeZone(cleanDynamicValue(input.timezone));
  const location = cleanDynamicValue(input.location ?? null);

  if (!startValue || !timeZone || !isValidCareTeamTimeZone(timeZone)) return null;

  const start = parseCareTeamStart(startValue, timeZone);
  if (!start) return null;

  return {
    title: CARE_TEAM_EVENT_TITLE,
    description: CARE_TEAM_EVENT_DESCRIPTION,
    start,
    end: new Date(start.getTime() + CARE_TEAM_EVENT_DURATION_MINUTES * 60_000),
    timeZone,
    location,
  };
}

export function formatCalendarUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function buildGoogleCalendarUrl(event: CareTeamCalendarEvent): string {
  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", event.title);
  url.searchParams.set("dates", `${formatCalendarUtc(event.start)}/${formatCalendarUtc(event.end)}`);
  url.searchParams.set("details", event.description);
  if (event.location) url.searchParams.set("location", event.location);
  if (getCareTeamFixedTimeZoneOffsetMinutes(event.timeZone) === null) {
    url.searchParams.set("ctz", event.timeZone);
  }
  return url.toString();
}

export function buildOutlookCalendarUrl(event: CareTeamCalendarEvent): string {
  const url = new URL("https://outlook.live.com/calendar/0/deeplink/compose");
  url.searchParams.set("path", "/calendar/action/compose");
  url.searchParams.set("rru", "addevent");
  url.searchParams.set("subject", event.title);
  url.searchParams.set("startdt", event.start.toISOString());
  url.searchParams.set("enddt", event.end.toISOString());
  url.searchParams.set("body", event.description);
  if (event.location) url.searchParams.set("location", event.location);
  return url.toString();
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function foldIcsLine(line: string): string {
  const chunks = line.match(/.{1,73}/g) ?? [line];
  return chunks.map((chunk, index) => (index === 0 ? chunk : ` ${chunk}`)).join("\r\n");
}

export function buildAppleCalendarIcs(
  event: CareTeamCalendarEvent,
  generatedAt = new Date(),
): string {
  const uid = `care-team-${event.start.getTime()}@medmethoddirect.com`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MedMethod Direct//Care Team Discovery Call//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatCalendarUtc(generatedAt)}`,
    `DTSTART:${formatCalendarUtc(event.start)}`,
    `DTEND:${formatCalendarUtc(event.end)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    ...(event.location ? [`LOCATION:${escapeIcsText(event.location)}`] : []),
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return `${lines.map(foldIcsLine).join("\r\n")}\r\n`;
}
