/**
 * GHL Booking Confirmation Webhook Handler (Option A)
 *
 * Go High Level fires this webhook when a patient books an appointment.
 * We match the patient email to their payment record and automatically
 * schedule the $149 remaining charge via Heartbeat cron.
 *
 * Setup in GHL:
 *   Settings → Integrations → Webhooks → Add Webhook
 *   URL: https://medmethoddirect.com/api/ghl/booking-confirmed
 *   Events: Appointment Created / Appointment Booked
 *
 * GHL webhook payload (relevant fields):
 *   {
 *     "type": "AppointmentCreate" | "AppointmentBooked",
 *     "contactEmail": "patient@example.com",
 *     "email": "patient@example.com",
 *     "contact": { "email": "patient@example.com" },
 *     "startTime": "2026-07-25T09:00:00+00:00",
 *     "appointment": {
 *       "startTime": "2026-07-25T09:00:00+00:00",
 *       "contactEmail": "patient@example.com"
 *     }
 *   }
 */

import { Request, Response } from "express";
import Stripe from "stripe";
import { getAllPayments, getStripeSettings, updatePayment } from "./db";
import { createHeartbeatJob } from "./_core/heartbeat";

// ─── Types ───────────────────────────────────────────────────────────────────

interface GHLWebhookPayload {
  type?: string;
  contactEmail?: string;
  email?: string;
  contact?: { email?: string };
  startTime?: string;
  appointment?: {
    startTime?: string;
    contactEmail?: string;
    email?: string;
  };
  // GHL nests appointment data inside "calendar" object
  calendar?: {
    startTime?: string;
    appointmentId?: string;
    status?: string;
  };
  // GHL sometimes sends snake_case
  start_time?: string;
  contact_email?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function extractEmail(payload: GHLWebhookPayload): string | null {
  return (
    payload.contactEmail ||
    payload.email ||
    payload.contact?.email ||
    payload.appointment?.contactEmail ||
    payload.appointment?.email ||
    payload.contact_email ||
    null
  );
}

export function extractStartTime(payload: GHLWebhookPayload): string | null {
  return (
    payload.startTime ||
    payload.start_time ||
    payload.calendar?.startTime ||
    payload.appointment?.startTime ||
    null
  );
}

/**
 * Get a Stripe client for a specific mode (test or live).
 * Always uses the mode the payment was created in to avoid cross-environment issues.
 */
async function getStripeClientForMode(mode: "test" | "live"): Promise<Stripe | null> {
  const settings = await getStripeSettings();
  if (!settings) return null;
  const secretKey = mode === "live" ? settings.liveSecretKey : settings.testSecretKey;
  if (!secretKey) return null;
  return new Stripe(secretKey, { apiVersion: "2026-06-24.dahlia" });
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function ghlBookingWebhookHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const payload = req.body as GHLWebhookPayload;

    console.log("[GHL Webhook] Received:", JSON.stringify(payload, null, 2));

    // Extract email and appointment start time
    const email = extractEmail(payload);
    const startTimeStr = extractStartTime(payload);

    if (!email) {
      console.warn("[GHL Webhook] No email found in payload — ignoring");
      res.status(200).json({ ok: true, skipped: "no_email" });
      return;
    }

    if (!startTimeStr) {
      console.warn("[GHL Webhook] No startTime found in payload — ignoring");
      res.status(200).json({ ok: true, skipped: "no_start_time" });
      return;
    }

    // GHL sends startTime without timezone info when the calendar is set to US Eastern.
    // If no timezone offset is present, treat it as US Eastern (America/New_York).
    // EDT = UTC-4, EST = UTC-5. We use a simple heuristic: append -04:00 for EDT
    // (March–November) or -05:00 for EST (November–March).
    let parsedTimeStr = startTimeStr;
    if (!/[Zz]|[+-]\d{2}:?\d{2}$/.test(startTimeStr)) {
      // No timezone info — assume US Eastern
      // Quick DST check: parse the date naively to check the month
      const naive = new Date(startTimeStr + "Z"); // treat as UTC temporarily to get month
      const month = naive.getUTCMonth(); // 0-indexed
      // EDT: March (2) through early November (10), EST: November through early March
      // Simplified: months 3-10 (Apr-Oct) are always EDT, others EST
      // March and November are edge cases but this is close enough
      const isEDT = month >= 2 && month <= 10;
      parsedTimeStr = startTimeStr + (isEDT ? "-04:00" : "-05:00");
      console.log(`[GHL Webhook] No TZ in startTime, assuming US Eastern (${isEDT ? 'EDT' : 'EST'}): ${parsedTimeStr}`);
    }

    const appointmentDate = new Date(parsedTimeStr);
    if (isNaN(appointmentDate.getTime())) {
      console.warn("[GHL Webhook] Invalid startTime:", startTimeStr);
      res.status(200).json({ ok: true, skipped: "invalid_start_time" });
      return;
    }

    // Extract the raw date from the GHL string (YYYY-MM-DD) for display and cron.
    // GHL sends the date in the calendar's timezone (US Eastern), so the date portion
    // is the actual appointment date as seen by the provider/patient.
    const rawDateMatch = startTimeStr.match(/^(\d{4})-(\d{2})-(\d{2})/);

    // For storage/display purposes, use noon UTC on the raw date from GHL.
    // This ensures the date displays correctly in any timezone (GMT-12 to GMT+12).
    const displayDate = rawDateMatch
      ? new Date(`${rawDateMatch[1]}-${rawDateMatch[2]}-${rawDateMatch[3]}T12:00:00Z`)
      : appointmentDate;
    const appointmentTimestamp = displayDate.getTime();

    console.log(
      `[GHL Webhook] Booking confirmed for ${email} at ${appointmentDate.toISOString()}`
    );

    // Find the most recent deposit_paid payment for this email
    const allPayments = await getAllPayments();
    const normalizedEmail = email.toLowerCase().trim();

    const matchingPayment = allPayments
      .filter(
        (p) =>
          p.patientEmail?.toLowerCase().trim() === normalizedEmail &&
          p.status === "deposit_paid" &&
          !p.appointmentDate // not yet scheduled
      )
      .sort((a, b) => {
        // Most recent first
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      })[0];

    if (!matchingPayment) {
      console.warn(
        `[GHL Webhook] No unscheduled deposit_paid payment found for ${email}`
      );
      res.status(200).json({ ok: true, skipped: "no_matching_payment" });
      return;
    }

    console.log(
      `[GHL Webhook] Matched payment #${matchingPayment.id} for ${email} (mode: ${matchingPayment.stripeMode})`
    );

    // Check if customer/payment method are saved
    if (!matchingPayment.stripeCustomerId || !matchingPayment.stripePaymentMethodId) {
      console.warn(
        `[GHL Webhook] Payment #${matchingPayment.id} has no Stripe customer/PM — cannot schedule charge`
      );
      // Still save the appointment date even if we can't schedule the charge
      await updatePayment(matchingPayment.id, {
        appointmentDate: appointmentTimestamp,
      });
      res.status(200).json({ ok: true, scheduled: false, reason: "no_stripe_customer" });
      return;
    }

    // Use the Stripe mode the payment was created in — not the current global mode.
    // This prevents cross-environment issues if the admin switches modes later.
    const paymentStripeMode = matchingPayment.stripeMode ?? "test";
    const stripe = await getStripeClientForMode(paymentStripeMode);
    if (!stripe) {
      console.warn(`[GHL Webhook] Stripe not configured for ${paymentStripeMode} mode — saving date only`);
      await updatePayment(matchingPayment.id, {
        appointmentDate: appointmentTimestamp,
      });
      res.status(200).json({ ok: true, scheduled: false, reason: "stripe_not_configured" });
      return;
    }

    // Create the $149 PaymentIntent (to be confirmed by cron on appointment day)
    const pi = await stripe.paymentIntents.create({
      amount: 14900,
      currency: "usd",
      customer: matchingPayment.stripeCustomerId,
      payment_method: matchingPayment.stripePaymentMethodId,
      confirm: false,
      description: "MedMethod Direct — $149 remaining balance (HRT consultation)",
      metadata: {
        source: "medmethod-direct",
        paymentId: String(matchingPayment.id),
        appointmentDate: String(appointmentTimestamp),
        patientName: matchingPayment.patientName ?? "",
        patientEmail: matchingPayment.patientEmail ?? "",
        triggeredBy: "ghl_webhook",
        stripeMode: paymentStripeMode,
      },
    });

    // Build cron expression: fire at 13:00 UTC (9 AM Eastern) on the appointment date.
    // Reuse rawDateMatch extracted earlier — the raw GHL date IS the appointment date.
    const cronDay = rawDateMatch ? parseInt(rawDateMatch[3], 10) : appointmentDate.getUTCDate();
    const cronMonth = rawDateMatch ? parseInt(rawDateMatch[2], 10) : appointmentDate.getUTCMonth() + 1;
    // Fire at 13:00 UTC = 9 AM Eastern (EDT)
    const cronExpr = `0 0 13 ${cronDay} ${cronMonth} *`;

    let taskUid: string | null = null;
    try {
      const job = await createHeartbeatJob(
        {
          name: `charge-remaining-${matchingPayment.id}`,
          cron: cronExpr,
          path: "/api/scheduled/charge-remaining",
          method: "POST",
          description: `Auto-charge $149 for ${matchingPayment.patientName ?? email} (payment #${matchingPayment.id}) — booked via GHL`,
        },
        "" // Empty = use project owner identity for Heartbeat authentication
      );
      taskUid = job.taskUid;
      console.log(
        `[GHL Webhook] Heartbeat cron created: ${taskUid} (cron: ${cronExpr})`
      );
    } catch (heartbeatErr) {
      console.error("[GHL Webhook] Heartbeat job creation failed:", heartbeatErr);
    }

    // Save everything to DB
    await updatePayment(matchingPayment.id, {
      appointmentDate: appointmentTimestamp,
      scheduledChargePaymentIntentId: pi.id,
      scheduledChargePaymentCronTaskUid: taskUid ?? undefined,
    });

    console.log(
      `[GHL Webhook] Payment #${matchingPayment.id} scheduled. PI: ${pi.id}, Cron: ${taskUid ?? "failed"}`
    );

    res.status(200).json({
      ok: true,
      scheduled: true,
      paymentId: matchingPayment.id,
      paymentIntentId: pi.id,
      cronTaskUid: taskUid,
      appointmentDate: appointmentDate.toISOString(),
    });
  } catch (err) {
    console.error("[GHL Webhook] Unhandled error:", err);
    // Always return 200 to GHL so it doesn't retry
    res.status(200).json({ ok: false, error: String(err) });
  }
}
