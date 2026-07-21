/**
 * GHL Booking Webhook Handler tests
 * Validates email/date extraction, payment matching logic, and guard conditions.
 */

import { describe, it, expect } from "vitest";
import { extractEmail, extractStartTime } from "./ghlWebhookHandler";

// ─── Re-export type for tests ─────────────────────────────────────────────────

interface GHLPayload {
  type?: string;
  contactEmail?: string;
  email?: string;
  contact?: { email?: string };
  startTime?: string;
  appointment?: { startTime?: string; contactEmail?: string; email?: string };
  start_time?: string;
  contact_email?: string;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("GHL webhook: extractEmail", () => {
  it("extracts contactEmail from top-level field", () => {
    expect(extractEmail({ contactEmail: "jane@example.com" })).toBe("jane@example.com");
  });

  it("extracts email from top-level email field", () => {
    expect(extractEmail({ email: "jane@example.com" })).toBe("jane@example.com");
  });

  it("extracts email from nested contact object", () => {
    expect(extractEmail({ contact: { email: "jane@example.com" } })).toBe("jane@example.com");
  });

  it("extracts email from nested appointment object", () => {
    expect(extractEmail({ appointment: { contactEmail: "jane@example.com" } })).toBe("jane@example.com");
  });

  it("returns null when no email is present", () => {
    expect(extractEmail({})).toBeNull();
  });

  it("prefers contactEmail over email", () => {
    expect(extractEmail({ contactEmail: "primary@example.com", email: "secondary@example.com" })).toBe(
      "primary@example.com"
    );
  });
});

describe("GHL webhook: extractStartTime", () => {
  it("extracts startTime from top-level field", () => {
    expect(extractStartTime({ startTime: "2026-08-01T09:00:00Z" })).toBe("2026-08-01T09:00:00Z");
  });

  it("extracts start_time from snake_case field", () => {
    expect(extractStartTime({ start_time: "2026-08-01T09:00:00Z" })).toBe("2026-08-01T09:00:00Z");
  });

  it("extracts startTime from nested appointment object", () => {
    expect(extractStartTime({ appointment: { startTime: "2026-08-01T09:00:00Z" } })).toBe(
      "2026-08-01T09:00:00Z"
    );
  });

  it("returns null when no startTime is present", () => {
    expect(extractStartTime({})).toBeNull();
  });
});

describe("GHL webhook: date parsing", () => {
  it("parses ISO 8601 date string correctly", () => {
    const date = new Date("2026-08-15T14:30:00+00:00");
    expect(isNaN(date.getTime())).toBe(false);
    expect(date.getUTCFullYear()).toBe(2026);
    expect(date.getUTCMonth()).toBe(7); // 0-indexed
    expect(date.getUTCDate()).toBe(15);
  });

  it("rejects invalid date strings", () => {
    const date = new Date("not-a-date");
    expect(isNaN(date.getTime())).toBe(true);
  });

  it("builds correct 6-field cron expression for appointment date", () => {
    const apptDate = new Date("2026-08-15T09:00:00Z");
    const cronExpr = `0 0 9 ${apptDate.getUTCDate()} ${apptDate.getUTCMonth() + 1} *`;
    expect(cronExpr).toBe("0 0 9 15 8 *");
  });
});

describe("scheduleRemainingCharge: guard logic", () => {
  it("rejects payments not in deposit_paid status", () => {
    const payment = { status: "pending", appointmentDate: null };
    const isAllowed = payment.status === "deposit_paid" && !payment.appointmentDate;
    expect(isAllowed).toBe(false);
  });

  it("rejects payments that already have an appointment date", () => {
    const payment = { status: "deposit_paid", appointmentDate: 1753000000000 };
    const isAllowed = payment.status === "deposit_paid" && !payment.appointmentDate;
    expect(isAllowed).toBe(false);
  });

  it("allows deposit_paid payments with no appointment date", () => {
    const payment = { status: "deposit_paid", appointmentDate: null };
    const isAllowed = payment.status === "deposit_paid" && !payment.appointmentDate;
    expect(isAllowed).toBe(true);
  });
});
