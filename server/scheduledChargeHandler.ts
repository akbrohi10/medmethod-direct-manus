/**
 * scheduledChargeHandler.ts
 *
 * Express handler for POST /api/scheduled/charge-remaining
 *
 * Called by the Heartbeat cron platform on the patient's appointment date.
 * Charges the $149 remaining balance off-session using the saved payment method.
 *
 * Auth: cron-only — must have user.isCron === true and user.taskUid set.
 * Idempotent: if the payment is already fully_paid or failed, returns 200 OK.
 */

import type { Request, Response } from "express";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { payments } from "../drizzle/schema";
import { sdk } from "./_core/sdk";
import { getStripeSettings } from "./db";

export async function chargeRemainingHandler(req: Request, res: Response) {
  try {
    // ── 1. Authenticate — cron-only ──────────────────────────────────────────
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) {
      return res.status(403).json({ error: "cron-only endpoint" });
    }

    const taskUid = user.taskUid;

    // ── 2. Look up the payment row by cron task UID ──────────────────────────
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database unavailable" });
    }

    const rows = await db
      .select()
      .from(payments)
      .where(eq(payments.scheduledChargePaymentCronTaskUid, taskUid))
      .limit(1);

    const payment = rows[0];

    if (!payment) {
      // Orphan cron — payment row deleted or never linked. Return 200 so Forge stops retrying.
      console.log(`[ScheduledCharge] No payment found for taskUid=${taskUid}. Skipping.`);
      return res.json({ ok: true, skipped: "orphan" });
    }

    // ── 3. Idempotency guard ─────────────────────────────────────────────────
    if (payment.status === "fully_paid") {
      console.log(`[ScheduledCharge] Payment ${payment.id} already fully_paid. Skipping.`);
      return res.json({ ok: true, skipped: "already_paid" });
    }

    if (payment.status === "failed") {
      console.log(`[ScheduledCharge] Payment ${payment.id} already failed. Skipping.`);
      return res.json({ ok: true, skipped: "already_failed" });
    }

    // ── 4. Get Stripe client ─────────────────────────────────────────────────
    const settings = await getStripeSettings();
    if (!settings) {
      console.error(`[ScheduledCharge] Stripe not configured for payment ${payment.id}`);
      return res.status(500).json({ error: "Stripe not configured" });
    }

    const secretKey =
      settings.mode === "live" ? settings.liveSecretKey : settings.testSecretKey;

    if (!secretKey) {
      console.error(`[ScheduledCharge] Stripe secret key missing for payment ${payment.id}`);
      return res.status(500).json({ error: "Stripe secret key not set" });
    }

    const stripe = new Stripe(secretKey, { apiVersion: "2026-06-24.dahlia" });

    // ── 5. Confirm the scheduled PaymentIntent off-session ───────────────────
    if (!payment.scheduledChargePaymentIntentId) {
      console.error(`[ScheduledCharge] No scheduledChargePaymentIntentId for payment ${payment.id}`);
      return res.status(500).json({ error: "No scheduled payment intent found" });
    }

    if (!payment.stripeCustomerId || !payment.stripePaymentMethodId) {
      console.error(`[ScheduledCharge] Missing customer/PM for payment ${payment.id}`);
      return res.status(500).json({ error: "Missing customer or payment method" });
    }

    let confirmedPi: Stripe.PaymentIntent;
    try {
      confirmedPi = await stripe.paymentIntents.confirm(
        payment.scheduledChargePaymentIntentId,
        {
          payment_method: payment.stripePaymentMethodId,
          off_session: true,
        }
      );
    } catch (stripeErr: unknown) {
      // Stripe charge failed (card declined, expired, etc.)
      const errMsg = stripeErr instanceof Error ? stripeErr.message : String(stripeErr);
      console.error(`[ScheduledCharge] Stripe confirm failed for payment ${payment.id}:`, errMsg);

      // Mark as failed in our DB
      await db
        .update(payments)
        .set({ status: "failed", updatedAt: new Date() })
        .where(eq(payments.id, payment.id));

      // Return 200 so Forge doesn't retry a declined card
      return res.json({ ok: false, error: errMsg, paymentId: payment.id });
    }

    // ── 6. Update payment status ─────────────────────────────────────────────
    if (confirmedPi.status === "succeeded") {
      await db
        .update(payments)
        .set({ status: "fully_paid", updatedAt: new Date() })
        .where(eq(payments.id, payment.id));

      console.log(`[ScheduledCharge] Payment ${payment.id} fully_paid. PI: ${confirmedPi.id}`);
      return res.json({ ok: true, paymentId: payment.id, status: "fully_paid" });
    }

    // Unexpected status (e.g. requires_action)
    console.warn(`[ScheduledCharge] Unexpected PI status: ${confirmedPi.status} for payment ${payment.id}`);
    return res.json({ ok: false, status: confirmedPi.status, paymentId: payment.id });

  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    console.error("[ScheduledCharge] Unhandled error:", errMsg);
    return res.status(500).json({
      error: errMsg,
      stack,
      context: { url: req.url, taskUid: "unknown" },
      timestamp: new Date().toISOString(),
    });
  }
}
