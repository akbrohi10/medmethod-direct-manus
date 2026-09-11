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

    const parsed = payloadSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ ok: false, error: "invalid_payload" });
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
        res.status(400).json({ ok: false, error: "invalid_calendar_data" });
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
