import type { Request, Response } from "express";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
  createCareTeamBookingWebhookHandler,
  isCareTeamWebhookAuthorized,
} from "./careTeamBookingWebhook";
import { hashCareTeamContactId } from "./careTeamBookingCalendar";

const TEST_SECRET = "test-care-team-webhook-secret-with-32-chars";

function createRequest(
  body: unknown,
  headers: Record<string, string> = {},
): Request {
  const normalizedHeaders = Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]),
  );
  return {
    body,
    get: (name: string) => normalizedHeaders[name.toLowerCase()],
  } as Request;
}

function createResponse() {
  const state: { statusCode: number; body: unknown } = {
    statusCode: 200,
    body: undefined,
  };
  const response = {
    status(code: number) {
      state.statusCode = code;
      return response;
    },
    json(body: unknown) {
      state.body = body;
      return response;
    },
  } as unknown as Response;
  return { response, state };
}

const validPayload = {
  contact_id: "contact_abc123",
  start: "2026-09-11T11:30:00-04:00",
  timezone: "America/New_York",
  location: "https://meet.google.com/abc-defg-hij",
};

describe("care-team booking calendar webhook", () => {
  it("uses constant-time authorization and rejects missing, short, or wrong secrets", () => {
    expect(isCareTeamWebhookAuthorized(TEST_SECRET, TEST_SECRET)).toBe(true);
    expect(isCareTeamWebhookAuthorized("", TEST_SECRET)).toBe(false);
    expect(isCareTeamWebhookAuthorized("wrong-secret-value-that-is-long-enough", TEST_SECRET)).toBe(false);
    expect(isCareTeamWebhookAuthorized(TEST_SECRET, "too-short")).toBe(false);
  });

  it("accepts a valid bearer-authenticated payload without returning the contact ID", async () => {
    const storeBooking = vi.fn(async () => ({
      start: "2026-09-11T15:30:00.000Z",
      timezone: "America/New_York",
      location: validPayload.location,
    }));
    const handler = createCareTeamBookingWebhookHandler(storeBooking, TEST_SECRET);
    const request = createRequest(
      { ...validPayload, extra_ghl_field: "ignored" },
      { authorization: `Bearer ${TEST_SECRET}` },
    );
    const { response, state } = createResponse();

    await handler(request, response);

    expect(state.statusCode).toBe(200);
    expect(state.body).toEqual({ ok: true });
    expect(storeBooking).toHaveBeenCalledWith({
      contactId: validPayload.contact_id,
      start: validPayload.start,
      timezone: validPayload.timezone,
      location: validPayload.location,
    });
    expect(JSON.stringify(state.body)).not.toContain(validPayload.contact_id);
  });

  it("also accepts the explicit X-Webhook-Secret header", async () => {
    const storeBooking = vi.fn(async () => ({
      start: "2026-09-11T15:30:00.000Z",
      timezone: "America/New_York",
      location: "",
    }));
    const handler = createCareTeamBookingWebhookHandler(storeBooking, TEST_SECRET);
    const { response, state } = createResponse();

    await handler(
      createRequest(validPayload, { "x-webhook-secret": TEST_SECRET }),
      response,
    );

    expect(state.statusCode).toBe(200);
    expect(storeBooking).toHaveBeenCalledOnce();
  });

  it("rejects unauthorized and invalid payloads before storage", async () => {
    const storeBooking = vi.fn();
    const handler = createCareTeamBookingWebhookHandler(storeBooking, TEST_SECRET);

    const unauthorized = createResponse();
    await handler(createRequest(validPayload), unauthorized.response);
    expect(unauthorized.state.statusCode).toBe(401);

    const invalid = createResponse();
    await handler(
      createRequest(
        { contact_id: "contact_abc123", start: "", timezone: "" },
        { authorization: `Bearer ${TEST_SECRET}` },
      ),
      invalid.response,
    );
    expect(invalid.state.statusCode).toBe(400);
    expect(storeBooking).not.toHaveBeenCalled();
  });

  it("hashes contact IDs deterministically without persisting the raw identifier", () => {
    const hash = hashCareTeamContactId(validPayload.contact_id, "hashing-secret");
    expect(hash).toHaveLength(64);
    expect(hash).toBe(hashCareTeamContactId(validPayload.contact_id, "hashing-secret"));
    expect(hash).not.toContain(validPayload.contact_id);
    expect(hash).not.toBe(hashCareTeamContactId("different-contact", "hashing-secret"));
  });

  it("mounts the production webhook and exposes only the minimal no-store lookup", () => {
    const serverSource = readFileSync(resolve(process.cwd(), "server/_core/index.ts"), "utf8");
    const routerSource = readFileSync(
      resolve(process.cwd(), "server/routers/careTeamBooking.ts"),
      "utf8",
    );
    const dbSource = readFileSync(resolve(process.cwd(), "server/db.ts"), "utf8");
    const schemaSource = readFileSync(resolve(process.cwd(), "drizzle/schema.ts"), "utf8");
    const componentSource = readFileSync(
      resolve(process.cwd(), "client/src/components/CareTeamAddToCalendar.tsx"),
      "utf8",
    );

    expect(serverSource).toContain('/api/webhooks/care-team-booking');
    expect(routerSource).toContain('"Cache-Control", "no-store, max-age=0"');
    expect(routerSource).toContain("event: await lookupCareTeamBookingCalendarEvent(input.contactId)");
    expect(schemaSource).toContain('contactIdHash: varchar("contactIdHash", { length: 64 }).notNull().unique()');
    expect(schemaSource).not.toContain('contactId: varchar("contactId"');
    expect(dbSource).toContain("onDuplicateKeyUpdate");
    expect(dbSource).toContain("lt(careTeamBookingCalendarEvents.expiresAt, Date.now())");
    expect(componentSource).toContain("refetchInterval");
    expect(componentSource).toContain("BOOKING_LOOKUP_WINDOW_MS");
    expect(componentSource).toContain("directEvent ?? webhookEvent");
  });
});
