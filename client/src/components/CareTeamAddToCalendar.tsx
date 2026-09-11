import { useEffect, useMemo, useState } from "react";
import { CalendarClock, CalendarPlus, ChevronDown, Download, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  const formattedStart = new Intl.DateTimeFormat("en-US", {
    timeZone: event.timeZone,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(event.start);

  return (
    <div
      data-care-team-add-to-calendar
      className="mx-auto mt-7 max-w-xl rounded-2xl border border-[#ebc8d9] bg-white px-5 py-5 shadow-[0_12px_28px_rgba(143,42,100,0.08)] sm:px-6"
    >
      <p className="text-sm font-black text-[#432943] sm:text-base">Save your appointment</p>
      <p className="mt-1 text-sm leading-6 text-[#655461]">{formattedStart}</p>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="mx-auto mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#b72f74] bg-[#fff7fb] px-5 py-2.5 text-sm font-black text-[#7a1e7e] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#fde8f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d51b75] focus-visible:ring-offset-3 active:scale-[0.97]"
          >
            <CalendarPlus className="h-4 w-4" aria-hidden="true" />
            Add to Calendar
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          sideOffset={8}
          className="w-64 rounded-xl border-[#ebc8d9] bg-white p-1.5 text-[#432943] shadow-[0_18px_45px_rgba(91,38,77,0.18)]"
        >
          <DropdownMenuLabel className="px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#9b4778]">
            Choose a calendar
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-[#f0dce5]" />
          <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-3 py-2.5 focus:bg-[#fff0f7] focus:text-[#7a1e7e]">
            <a href={links.google} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 text-[#d51b75]" aria-hidden="true" />
              Google Calendar
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-3 py-2.5 focus:bg-[#fff0f7] focus:text-[#7a1e7e]">
            <a href={links.outlook} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 text-[#d51b75]" aria-hidden="true" />
              Outlook / Office 365
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer rounded-lg px-3 py-2.5 focus:bg-[#fff0f7] focus:text-[#7a1e7e]"
            onSelect={() => downloadAppleCalendar(links.apple)}
          >
            <Download className="h-4 w-4 text-[#d51b75]" aria-hidden="true" />
            Apple Calendar (.ics)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
