import type { Request, Response } from "express";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
  createCareTeamBookingWebhookHandler,
  describeJsonShape,
  extractCareTeamBookingPayload,
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

  it("accepts GoHighLevel fields nested inside a customData object", async () => {
    const storeBooking = vi.fn(async () => ({
      start: "2026-09-11T15:30:00.000Z",
      timezone: "America/New_York",
      location: validPayload.location,
    }));
    const handler = createCareTeamBookingWebhookHandler(storeBooking, TEST_SECRET);
    const { response, state } = createResponse();

    await handler(
      createRequest(
        {
          type: "AppointmentStatus",
          email: "private@example.com",
          phone: "+17035550123",
          customData: validPayload,
        },
        { authorization: `Bearer ${TEST_SECRET}` },
      ),
      response,
    );

    expect(state.statusCode).toBe(200);
    expect(state.body).toEqual({ ok: true });
    expect(storeBooking).toHaveBeenCalledWith({
      contactId: validPayload.contact_id,
      start: validPayload.start,
      timezone: validPayload.timezone,
      location: validPayload.location,
    });
    expect(JSON.stringify(state.body)).not.toContain("private@example.com");
    expect(JSON.stringify(state.body)).not.toContain("+17035550123");
  });

  it("accepts GoHighLevel customData key-value arrays and data wrappers", async () => {
    const storeBooking = vi.fn(async () => ({
      start: "2026-09-11T15:30:00.000Z",
      timezone: "America/New_York",
      location: validPayload.location,
    }));
    const handler = createCareTeamBookingWebhookHandler(storeBooking, TEST_SECRET);
    const { response, state } = createResponse();
    const customData = Object.entries(validPayload).map(([key, value]) => ({
      key,
      fieldValue: value,
    }));

    await handler(
      createRequest(
        { data: { customData } },
        { authorization: `Bearer ${TEST_SECRET}` },
      ),
      response,
    );

    expect(state.statusCode).toBe(200);
    expect(storeBooking).toHaveBeenCalledWith({
      contactId: validPayload.contact_id,
      start: validPayload.start,
      timezone: validPayload.timezone,
      location: validPayload.location,
    });
  });

  it("extracts standard contact and appointment envelopes without storing unrelated fields", () => {
    expect(
      extractCareTeamBookingPayload({
        contact: { id: validPayload.contact_id, email: "private@example.com" },
        appointment: {
          startTime: validPayload.start,
          timeZone: validPayload.timezone,
          meetingLocation: validPayload.location,
        },
      }),
    ).toEqual(validPayload);
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
        {
          contact_id: "contact_abc123",
          start: "",
          timezone: "",
          email: "private@example.com",
        },
        { authorization: `Bearer ${TEST_SECRET}` },
      ),
      invalid.response,
    );
    expect(invalid.state.statusCode).toBe(400);
    expect(invalid.state.body).toMatchObject({
      ok: false,
      error: "invalid_payload",
      diagnostic: {
        invalidFields: expect.arrayContaining(["start", "timezone"]),
        paths: expect.arrayContaining([
          "body:object",
          "body.contact_id:string",
          "body.start:string",
          "body.timezone:string",
          "body.email:string",
        ]),
      },
    });
    expect(JSON.stringify(invalid.state.body)).not.toContain("private@example.com");
    expect(storeBooking).not.toHaveBeenCalled();
  });

  it("describes only JSON paths and types, never incoming values", () => {
    const description = describeJsonShape({
      contact: { email: "private@example.com" },
      customData: [{ key: "contact_id", value: "secret-contact-value" }],
    });
    expect(description).toContain("body.contact.email:string");
    expect(description).toContain("body.customData:array");
    expect(description).toContain("body.customData[0].value:string");
    expect(description.join(" ")).not.toContain("private@example.com");
    expect(description.join(" ")).not.toContain("secret-contact-value");
  });

  it("does not echo rejected calendar values after authenticated diagnosis is complete", async () => {
    const storeBooking = vi.fn(async () => {
      throw new Error("Start time is invalid");
    });
    const handler = createCareTeamBookingWebhookHandler(storeBooking, TEST_SECRET);
    const { response, state } = createResponse();
    const sensitivePayload = {
      ...validPayload,
      start: "GHL human-readable start value",
      email: "private@example.com",
      phone: "+17035550123",
      name: "Private Person",
    };

    await handler(
      createRequest(sensitivePayload, { authorization: `Bearer ${TEST_SECRET}` }),
      response,
    );

    expect(state.statusCode).toBe(400);
    expect(state.body).toEqual({ ok: false, error: "invalid_calendar_data" });
    const responseBody = JSON.stringify(state.body);
    expect(responseBody).not.toContain(sensitivePayload.contact_id);
    expect(responseBody).not.toContain(sensitivePayload.location);
    expect(responseBody).not.toContain(sensitivePayload.email);
    expect(responseBody).not.toContain(sensitivePayload.phone);
    expect(responseBody).not.toContain(sensitivePayload.name);
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
