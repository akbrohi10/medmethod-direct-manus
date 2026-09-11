import { timingSafeEqual } from "node:crypto";
import type { Request, Response } from "express";
import { z } from "zod";
import { ENV } from "./_core/env";
import { storeCareTeamBookingCalendarEvent } from "./careTeamBookingCalendar";

const payloadSchema = z.object({
  contact_id: z.string().trim().min(1).max(191),
  start: z.string().trim().min(1).max(191),
  timezone: z.string().trim().min(1).max(100),
  location: z.string().trim().max(2_000).optional().default(""),
});

type JsonRecord = Record<string, unknown>;

function asRecord(value: unknown): JsonRecord | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonRecord)
    : null;
}

function asNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function customDataArrayToRecord(value: unknown): JsonRecord | null {
  if (!Array.isArray(value)) return null;
  const entries: Array<[string, unknown]> = [];

  for (const item of value) {
    const record = asRecord(item);
    if (!record) continue;
    const key =
      asNonEmptyString(record.key) ??
      asNonEmptyString(record.name) ??
      asNonEmptyString(record.field) ??
      asNonEmptyString(record.fieldKey);
    if (!key) continue;
    const fieldValue = record.value ?? record.fieldValue ?? record.field_value;
    entries.push([key, fieldValue]);
  }

  return entries.length ? Object.fromEntries(entries) : null;
}

function readField(sources: JsonRecord[], names: string[]): unknown {
  for (const source of sources) {
    for (const name of names) {
      if (source[name] !== undefined) return source[name];
    }
  }
  return undefined;
}

export function extractCareTeamBookingPayload(body: unknown): unknown {
  const root = asRecord(body);
  if (!root) return body;

  const data = asRecord(root.data);
  const customDataCandidates = [
    root.customData,
    root.custom_data,
    data?.customData,
    data?.custom_data,
  ];
  const customDataSources = customDataCandidates
    .map(candidate => asRecord(candidate) ?? customDataArrayToRecord(candidate))
    .filter((candidate): candidate is JsonRecord => Boolean(candidate));
  const sources = [...customDataSources, ...(data ? [data] : []), root];

  const contact = asRecord(root.contact) ?? (data ? asRecord(data.contact) : null);
  const appointment =
    asRecord(root.appointment) ?? (data ? asRecord(data.appointment) : null);

  return {
    contact_id:
      readField(sources, ["contact_id", "contactId"]) ?? contact?.id,
    start:
      readField(sources, ["start", "start_time", "startTime", "appointment_start_time"]) ??
      readField(appointment ? [appointment] : [], ["start", "start_time", "startTime"]),
    timezone:
      readField(sources, ["timezone", "timeZone", "appointment_timezone"]) ??
      readField(appointment ? [appointment] : [], ["timezone", "timeZone"]),
    location:
      readField(sources, ["location", "meeting_location", "meetingLocation"]) ??
      readField(appointment ? [appointment] : [], ["location", "meeting_location", "meetingLocation"]) ??
      "",
  };
}

function jsonValueType(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

export function describeJsonShape(
  value: unknown,
  path = "body",
  depth = 0,
  output: string[] = [],
): string[] {
  if (output.length >= 80) return output;
  const valueType = jsonValueType(value);
  output.push(`${path}:${valueType}`);
  if (depth >= 4) return output;

  if (Array.isArray(value)) {
    value.slice(0, 3).forEach((item, index) =>
      describeJsonShape(item, `${path}[${index}]`, depth + 1, output),
    );
    return output;
  }

  const record = asRecord(value);
  if (!record) return output;
  Object.entries(record)
    .slice(0, 40)
    .forEach(([key, nestedValue]) =>
      describeJsonShape(nestedValue, `${path}.${key}`, depth + 1, output),
    );
  return output;
}

function readBearerToken(req: Request): string {
  const authorization = req.get("authorization") ?? "";
  if (/^Bearer\s+/i.test(authorization)) {
    return authorization.replace(/^Bearer\s+/i, "").trim();
  }
  return (req.get("x-webhook-secret") ?? "").trim();
}

export function isCareTeamWebhookAuthorized(
  provided: string,
  expected = ENV.ghlCareTeamWebhookSecret,
): boolean {
  if (!provided || !expected || expected.length < 32) return false;
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
}

type StoreBooking = typeof storeCareTeamBookingCalendarEvent;

export function createCareTeamBookingWebhookHandler(
  storeBooking: StoreBooking = storeCareTeamBookingCalendarEvent,
  expectedSecret = ENV.ghlCareTeamWebhookSecret,
) {
  return async function careTeamBookingWebhookHandler(
    req: Request,
    res: Response,
  ): Promise<void> {
    if (!expectedSecret || expectedSecret.length < 32) {
      res.status(503).json({ ok: false, error: "webhook_not_configured" });
      return;
    }

    if (!isCareTeamWebhookAuthorized(readBearerToken(req), expectedSecret)) {
      res.status(401).json({ ok: false, error: "unauthorized" });
      return;
    }

    const extractedPayload = extractCareTeamBookingPayload(req.body);
    const parsed = payloadSchema.safeParse(extractedPayload);
    if (!parsed.success) {
      const diagnostic = {
        paths: describeJsonShape(req.body),
        invalidFields: Array.from(
          new Set(parsed.error.issues.map(issue => issue.path.join(".") || "body")),
        ),
      };
      console.warn("[CareTeam Booking Webhook] Invalid payload shape", diagnostic);
      res.status(400).json({ ok: false, error: "invalid_payload", diagnostic });
      return;
    }

    try {
      const saved = await storeBooking({
        contactId: parsed.data.contact_id,
        start: parsed.data.start,
        timezone: parsed.data.timezone,
        location: parsed.data.location,
      });

      console.info("[CareTeam Booking Webhook] Calendar details saved", {
        start: saved.start,
        timezone: saved.timezone,
        hasLocation: Boolean(saved.location),
      });
      res.status(200).json({ ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown_error";
      if (/required|invalid/i.test(message)) {
        res.status(400).json({
          ok: false,
          error: "invalid_calendar_data",
          diagnostic: {
            field: /timezone/i.test(message)
              ? "timezone"
              : /start/i.test(message)
                ? "start"
                : "calendar_data",
            start: parsed.data.start,
            startType: typeof parsed.data.start,
            timezone: parsed.data.timezone,
            timezoneType: typeof parsed.data.timezone,
          },
        });
        return;
      }

      console.error("[CareTeam Booking Webhook] Storage failed", {
        error: message,
      });
      res.status(500).json({ ok: false, error: "storage_failed" });
    }
  };
}

export const careTeamBookingWebhookHandler = createCareTeamBookingWebhookHandler();
