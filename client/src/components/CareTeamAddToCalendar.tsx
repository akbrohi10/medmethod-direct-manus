import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  CalendarDays,
  Clock3,
  Cloud,
  ExternalLink,
  Globe2,
  Link2,
  MapPin,
} from "lucide-react";
import {
  buildAppleCalendarIcs,
  buildGoogleCalendarUrl,
  buildOutlookCalendarUrl,
  createCareTeamCalendarEvent,
  parseCareTeamCalendarEvent,
} from "@/lib/careTeamCalendarEvent";
import { trpc } from "@/lib/trpc";

const APPLE_CALENDAR_FILENAME = "medmethod-care-team-discovery-call.ics";
const BOOKING_LOOKUP_WINDOW_MS = 45_000;

function downloadAppleCalendar(ics: string) {
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = APPLE_CALENDAR_FILENAME;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
}

function GoogleCalendarIcon() {
  return (
    <span
      aria-hidden="true"
      className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#d9dce3] bg-white shadow-sm"
    >
      <span className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#4285f4_0_25%,#34a853_25%_50%,#fbbc04_50%_75%,#ea4335_75%)]" />
      <span className="pt-1 text-[10px] font-black text-[#4285f4]">31</span>
    </span>
  );
}

function OutlookCalendarIcon() {
  return (
    <span
      aria-hidden="true"
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#0a64b7] text-[11px] font-black text-white shadow-sm"
    >
      O
    </span>
  );
}

function ICloudCalendarIcon() {
  return (
    <span
      aria-hidden="true"
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#ffd6dc] bg-[#fff2f4] text-[#ed5a6e] shadow-sm"
    >
      <Cloud className="h-4 w-4" />
    </span>
  );
}

const calendarActionClass =
  "flex min-h-12 w-full items-center gap-3 rounded-xl border border-[#cba4b8] bg-white px-4 py-3 text-left text-sm font-black text-[#432943] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#b72f74] hover:bg-[#fff8fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d51b75] focus-visible:ring-offset-3 active:scale-[0.99]";

export default function CareTeamAddToCalendar() {
  const directEvent = useMemo(
    () => parseCareTeamCalendarEvent(window.location.search),
    [],
  );
  const contactId = useMemo(() => {
    const value = new URLSearchParams(window.location.search).get("contact_id")?.trim() ?? "";
    return value && !value.includes("{{") && !value.includes("}}") ? value : "";
  }, []);
  const [pollDeadline] = useState(() => Date.now() + BOOKING_LOOKUP_WINDOW_MS);
  const [lookupTimedOut, setLookupTimedOut] = useState(false);

  useEffect(() => {
    if (!contactId || directEvent) return;
    const timeout = window.setTimeout(
      () => setLookupTimedOut(true),
      BOOKING_LOOKUP_WINDOW_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [contactId, directEvent]);

  const bookingLookup = trpc.careTeamBooking.getCalendarEvent.useQuery(
    { contactId },
    {
      enabled: Boolean(contactId) && !directEvent,
      retry: false,
      refetchOnWindowFocus: false,
      refetchInterval: query =>
        !query.state.data?.event && Date.now() < pollDeadline ? 2_000 : false,
    },
  );

  const webhookEvent = useMemo(() => {
    const lookup = bookingLookup.data?.event;
    if (!lookup) return null;
    return createCareTeamCalendarEvent({
      start: lookup.start,
      timezone: lookup.timezone,
      location: lookup.location,
    });
  }, [bookingLookup.data]);

  const event = directEvent ?? webhookEvent;

  const links = useMemo(() => {
    if (!event) return null;
    return {
      google: buildGoogleCalendarUrl(event),
      outlook: buildOutlookCalendarUrl(event),
      apple: buildAppleCalendarIcs(event),
    };
  }, [event]);

  if (!event || !links) {
    if (!contactId || directEvent) return null;

    return (
      <div
        data-care-team-calendar-pending
        className="mx-auto mt-7 max-w-xl rounded-2xl border border-[#ebc8d9] bg-white px-5 py-5 text-center shadow-[0_12px_28px_rgba(143,42,100,0.08)] sm:px-6"
        role="status"
        aria-live="polite"
      >
        <CalendarClock className="mx-auto h-5 w-5 text-[#d51b75]" aria-hidden="true" />
        <p className="mt-2 text-sm font-black text-[#432943]">
          {lookupTimedOut ? "Calendar details are still processing" : "Preparing calendar options"}
        </p>
        <p className="mt-1 text-sm leading-6 text-[#655461]">
          {lookupTimedOut
            ? "Please use the calendar links in your confirmation email or refresh this page shortly."
            : "Your appointment details may take a few seconds to arrive."}
        </p>
      </div>
    );
  }

  const dateLabel = new Intl.DateTimeFormat("en-US", {
    timeZone: event.timeZone,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(event.start);
  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: event.timeZone,
    hour: "numeric",
    minute: "2-digit",
  });
  const timezoneAbbreviation = new Intl.DateTimeFormat("en-US", {
    timeZone: event.timeZone,
    timeZoneName: "short",
  })
    .formatToParts(event.start)
    .find(part => part.type === "timeZoneName")?.value;
  const dateTimeLabel = `${timeFormatter.format(event.start)} – ${timeFormatter.format(event.end)} · ${dateLabel}`;
  const timezoneLabel = timezoneAbbreviation
    ? `${event.timeZone} (${timezoneAbbreviation})`
    : event.timeZone;
  const meetingHref = /^https?:\/\//i.test(event.location) ? event.location : null;

  return (
    <div
      data-care-team-add-to-calendar
      className="mx-auto mt-7 max-w-xl rounded-2xl border border-[#e7c6d7] bg-white px-4 py-5 shadow-[0_14px_34px_rgba(117,39,91,0.09)] sm:px-6 sm:py-6"
    >
      <p className="text-center text-sm font-black text-[#432943] sm:text-base">
        Save your appointment
      </p>

      <div
        data-care-team-appointment-details
        className="mt-4 space-y-3 rounded-xl border border-[#ead5df] bg-[#fff9fc] px-4 py-4 text-left sm:px-5"
      >
        <div className="flex items-start gap-3 text-sm leading-6 text-[#594c56]">
          <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[#b72f74]" aria-hidden="true" />
          <span className="font-bold text-[#432943]">15 min</span>
        </div>
        <div className="flex items-start gap-3 text-sm leading-6 text-[#594c56]">
          <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-[#b72f74]" aria-hidden="true" />
          <span>{dateTimeLabel}</span>
        </div>
        {event.location ? (
          <div className="flex items-start gap-3 text-sm leading-6 text-[#594c56]">
            {meetingHref ? (
              <Link2 className="mt-0.5 h-5 w-5 shrink-0 text-[#b72f74]" aria-hidden="true" />
            ) : (
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#b72f74]" aria-hidden="true" />
            )}
            {meetingHref ? (
              <a
                href={meetingHref}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all font-semibold text-[#7a1e7e] underline decoration-[#d9a2bd] underline-offset-3 hover:text-[#d51b75]"
              >
                {event.location}
              </a>
            ) : (
              <span className="break-words">{event.location}</span>
            )}
          </div>
        ) : null}
        <div className="flex items-start gap-3 text-sm leading-6 text-[#594c56]">
          <Globe2 className="mt-0.5 h-5 w-5 shrink-0 text-[#b72f74]" aria-hidden="true" />
          <span>{timezoneLabel}</span>
        </div>
      </div>

      <div data-care-team-calendar-actions className="mt-5 space-y-3">
        <a
          href={links.google}
          target="_blank"
          rel="noopener noreferrer"
          className={calendarActionClass}
        >
          <GoogleCalendarIcon />
          <span className="flex-1 text-center">Google Calendar</span>
          <ExternalLink className="h-4 w-4 shrink-0 text-[#a35a82]" aria-hidden="true" />
        </a>
        <a
          href={links.outlook}
          target="_blank"
          rel="noopener noreferrer"
          className={calendarActionClass}
        >
          <OutlookCalendarIcon />
          <span className="flex-1 text-center">Outlook Calendar</span>
          <ExternalLink className="h-4 w-4 shrink-0 text-[#a35a82]" aria-hidden="true" />
        </a>
        <button
          type="button"
          onClick={() => downloadAppleCalendar(links.apple)}
          className={calendarActionClass}
        >
          <ICloudCalendarIcon />
          <span className="flex-1 text-center">iCloud Calendar</span>
          <span className="h-4 w-4 shrink-0" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
