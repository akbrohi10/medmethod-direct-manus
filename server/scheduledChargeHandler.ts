/**
 * scheduledChargeHandler.ts
 *
 * Express handler for POST /api/scheduled/sweep-due-charges
 *
 * Called by the global hourly Heartbeat cron job.
 * Sweeps all `deposit_paid` payments whose appointmentDate has passed (or is now)
 * and charges the $149 remaining balance off-session for each one.
 *
 * Auth: cron-only — must have user.isCron === true.
 * Idempotent: skips payments already fully_paid or failed.
 */

import type { Request, Response } from "express";
import Stripe from "stripe";
import { and, eq, isNotNull, lte } from "drizzle-orm";
import { getDb } from "./db";
import { payments } from "../drizzle/schema";
import { sdk } from "./_core/sdk";
import { getStripeSettings } from "./db";
import { createHeartbeatJob, listHeartbeatJobs } from "./_core/heartbeat";

/**
 * Ensure the global hourly sweep cron job exists.
 * Idempotent — safe to call on every server startup.
 * Uses the project owner identity (empty session token).
 */
export async function ensureGlobalSweepCron(): Promise<void> {
  const CRON_NAME = "sweep-due-charges-hourly";
  try {
    // Check if already registered
    const { jobs } = await listHeartbeatJobs("", { pageSize: 100 });
    const existing = jobs.find((j) => j.name === CRON_NAME);
    if (existing) {
      console.log(`[SweepCron] Global sweep cron already registered (taskUid: ${existing.taskUid})`);
      return;
    }
    // Register: every hour at :00 (6-field format: sec min hour dom mon dow)
    const job = await createHeartbeatJob(
      {
        name: CRON_NAME,
        cron: "0 0 * * * *",
        path: "/api/scheduled/sweep-due-charges",
        method: "POST",
        description: "Hourly sweep: charge all due deposit_paid payments",
      },
      ""
    );
    console.log(`[SweepCron] Global sweep cron registered (taskUid: ${job.taskUid})`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[SweepCron] Failed to register global sweep cron: ${msg}`);
    throw err;
  }
}

export async function chargeRemainingHandler(req: Request, res: Response) {
  try {
    // ── 1. Authenticate — cron-only ──────────────────────────────────────────
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron) {
      return res.status(403).json({ error: "cron-only endpoint" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database unavailable" });
    }

    const settings = await getStripeSettings();
    if (!settings) {
      console.error("[SweepDueCharges] Stripe not configured");
      return res.status(500).json({ error: "Stripe not configured" });
    }

    const secretKey =
      settings.mode === "live" ? settings.liveSecretKey : settings.testSecretKey;

    if (!secretKey) {
      console.error("[SweepDueCharges] Stripe secret key missing");
      return res.status(500).json({ error: "Stripe secret key not set" });
    }

    const stripe = new Stripe(secretKey, { apiVersion: "2026-06-24.dahlia" });

    // ── 2. Find all deposit_paid payments whose appointment date has passed ──
    const nowMs = Date.now();

    const duePayments = await db
      .select()
      .from(payments)
      .where(
        and(
          eq(payments.status, "deposit_paid"),
          isNotNull(payments.appointmentDate),
          lte(payments.appointmentDate, nowMs),
          isNotNull(payments.scheduledChargePaymentIntentId)
        )
      );

    console.log(`[SweepDueCharges] Found ${duePayments.length} due payment(s) to charge`);

    const results: Array<{
      paymentId: number;
      status: string;
      error?: string;
    }> = [];

    // ── 3. Charge each due payment ───────────────────────────────────────────
    for (const payment of duePayments) {
      if (!payment.scheduledChargePaymentIntentId) {
        results.push({ paymentId: payment.id, status: "skipped_no_pi" });
        continue;
      }

      if (!payment.stripeCustomerId || !payment.stripePaymentMethodId) {
        console.error(`[SweepDueCharges] Missing customer/PM for payment ${payment.id}`);
        results.push({ paymentId: payment.id, status: "skipped_no_pm" });
        continue;
      }

      try {
        const confirmedPi = await stripe.paymentIntents.confirm(
          payment.scheduledChargePaymentIntentId,
          {
            payment_method: payment.stripePaymentMethodId,
            off_session: true,
          }
        );

        if (confirmedPi.status === "succeeded") {
          await db
            .update(payments)
            .set({ status: "fully_paid", updatedAt: new Date() })
            .where(eq(payments.id, payment.id));

          console.log(`[SweepDueCharges] Payment ${payment.id} → fully_paid`);
          results.push({ paymentId: payment.id, status: "fully_paid" });
        } else {
          console.warn(`[SweepDueCharges] Unexpected PI status: ${confirmedPi.status} for payment ${payment.id}`);
          results.push({ paymentId: payment.id, status: confirmedPi.status });
        }
      } catch (stripeErr: unknown) {
        const errMsg = stripeErr instanceof Error ? stripeErr.message : String(stripeErr);
        console.error(`[SweepDueCharges] Stripe confirm failed for payment ${payment.id}:`, errMsg);

        await db
          .update(payments)
          .set({ status: "failed", updatedAt: new Date() })
          .where(eq(payments.id, payment.id));

        results.push({ paymentId: payment.id, status: "failed", error: errMsg });
      }
    }

    return res.json({
      ok: true,
      swept: duePayments.length,
      results,
      timestamp: new Date().toISOString(),
    });

  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    console.error("[SweepDueCharges] Unhandled error:", errMsg);
    return res.status(500).json({
      error: errMsg,
      stack,
      timestamp: new Date().toISOString(),
    });
  }
}
