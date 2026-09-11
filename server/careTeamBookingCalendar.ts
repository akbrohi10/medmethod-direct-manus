import { createHmac } from "node:crypto";
import { ENV } from "./_core/env";
import {
  getCareTeamBookingCalendarEventByHash,
  upsertCareTeamBookingCalendarEvent,
} from "./db";
import { parseCareTeamStart } from "../client/src/lib/careTeamCalendarEvent";

const EVENT_RETENTION_MS = 7 * 24 * 60 * 60 * 1_000;

export type CareTeamBookingWebhookInput = {
  contactId: string;
  start: string;
  timezone: string;
  location: string;
};

export type CareTeamBookingCalendarLookup = {
  start: string;
  timezone: string;
  location: string;
};

export function normalizeCareTeamContactId(contactId: string): string {
  return contactId.trim();
}

export function hashCareTeamContactId(
  contactId: string,
  secret = ENV.cookieSecret,
): string {
  const normalized = normalizeCareTeamContactId(contactId);
  if (!normalized) throw new Error("Contact ID is required");
  if (!secret) throw new Error("Server contact-ID hashing secret is not configured");

  return createHmac("sha256", secret)
    .update(`care-team-booking:${normalized}`, "utf8")
    .digest("hex");
}

export function normalizeCareTeamTimeZone(timezone: string): string {
  return timezone.replace(/\s+\([A-Z]{2,6}\)$/, "").trim();
}

export function validateCareTeamTimeZone(timezone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

export function normalizeCareTeamLocation(location: string): string {
  return location.trim().slice(0, 2_000);
}

export async function storeCareTeamBookingCalendarEvent(
  input: CareTeamBookingWebhookInput,
  now = Date.now(),
): Promise<CareTeamBookingCalendarLookup> {
  const contactId = normalizeCareTeamContactId(input.contactId);
  const timezone = normalizeCareTeamTimeZone(input.timezone);
  const location = normalizeCareTeamLocation(input.location);
  if (!contactId) throw new Error("Contact ID is required");
  if (!validateCareTeamTimeZone(timezone)) throw new Error("Timezone is invalid");

  const parsedStart = parseCareTeamStart(input.start.trim(), timezone);
  if (!parsedStart) throw new Error("Start time is invalid");

  await upsertCareTeamBookingCalendarEvent({
    contactIdHash: hashCareTeamContactId(contactId),
    startAt: parsedStart.getTime(),
    timezone,
    location: location || null,
    expiresAt: now + EVENT_RETENTION_MS,
  });

  return {
    start: parsedStart.toISOString(),
    timezone,
    location,
  };
}

export async function lookupCareTeamBookingCalendarEvent(
  contactId: string,
): Promise<CareTeamBookingCalendarLookup | null> {
  const normalized = normalizeCareTeamContactId(contactId);
  if (!normalized) return null;

  const event = await getCareTeamBookingCalendarEventByHash(
    hashCareTeamContactId(normalized),
  );
  if (!event) return null;

  return {
    start: new Date(event.startAt).toISOString(),
    timezone: event.timezone,
    location: event.location ?? "",
  };
}
