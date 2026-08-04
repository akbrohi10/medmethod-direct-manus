/**
 * scheduledChargeHandler.ts
 *
 * Express handler for POST /api/scheduled/sweep-due-charges
 *
 * Called by the global hourly Heartbeat cron job.
 * Sweeps all `deposit_paid` payments whose appointmentDate has passed (or is now)
 * and charges the $149 remaining balance off-session for each one.
 *
 * Supports both Stripe and PayPal payment providers.
 *
 * Auth: cron-only — must have user.isCron === true.
 * Idempotent: skips payments already fully_paid or failed.
 */

import type { Request, Response } from "express";
import Stripe from "stripe";
import { and, eq, isNotNull, lte, or } from "drizzle-orm";
import { getDb } from "./db";
import { payments } from "../drizzle/schema";
import { sdk } from "./_core/sdk";
import { getStripeSettings, getPaypalSettings } from "./db";
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
        description: "Hourly sweep: charge all due deposit_paid payments (Stripe + PayPal)",
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

// ─── PayPal helpers ────────────────────────────────────────────────────────────

type PayPalMode = "sandbox" | "live";

function getPayPalBaseUrl(mode: PayPalMode): string {
  return mode === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

async function getPayPalAccessToken(
  clientId: string,
  clientSecret: string,
  mode: PayPalMode
): Promise<string> {
  const base = getPayPalBaseUrl(mode);
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal auth failed (${res.status}): ${text}`);
  }
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

// ─── Main sweep handler ────────────────────────────────────────────────────────

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

    const nowMs = Date.now();

    // ── 2. Find all deposit_paid payments whose appointment date has passed ──
    // Include both Stripe (have scheduledChargePaymentIntentId) and PayPal
    // (have paypalOrderId and paymentProvider = 'paypal') payments.
    const duePayments = await db
      .select()
      .from(payments)
      .where(
        and(
          eq(payments.status, "deposit_paid"),
          isNotNull(payments.appointmentDate),
          lte(payments.appointmentDate, nowMs),
          or(
            // Stripe: has a scheduled PI
            isNotNull(payments.scheduledChargePaymentIntentId),
            // PayPal: has a paypal order ID (sweep approach)
            and(
              eq(payments.paymentProvider, "paypal"),
              isNotNull(payments.paypalOrderId)
            )
          )
        )
      );

    console.log(`[SweepDueCharges] Found ${duePayments.length} due payment(s) to charge`);

    const results: Array<{
      paymentId: number;
      provider: string;
      status: string;
      error?: string;
    }> = [];

    // ── 3. Charge each due payment ───────────────────────────────────────────
    for (const payment of duePayments) {
      if (payment.paymentProvider === "paypal") {
        // ── PayPal path ──────────────────────────────────────────────────────
        try {
          const ppSettings = await getPaypalSettings();
          if (!ppSettings) {
            console.error(`[SweepDueCharges] PayPal not configured for payment ${payment.id}`);
            results.push({ paymentId: payment.id, provider: "paypal", status: "skipped_no_config" });
            continue;
          }

          const mode = (payment.paypalMode ?? ppSettings.mode ?? "sandbox") as PayPalMode;
          const clientId = mode === "live" ? ppSettings.liveClientId : ppSettings.sandboxClientId;
          const clientSecret = mode === "live" ? ppSettings.liveClientSecret : ppSettings.sandboxClientSecret;

          if (!clientId || !clientSecret) {
            console.error(`[SweepDueCharges] PayPal ${mode} credentials missing for payment ${payment.id}`);
            results.push({ paymentId: payment.id, provider: "paypal", status: "skipped_no_credentials" });
            continue;
          }

          const baseUrl = getPayPalBaseUrl(mode);
          const token = await getPayPalAccessToken(clientId, clientSecret, mode);

          // Create a new $149 order using the vault token (billing agreement)
          // PayPal requires a vault token for off-session charges.
          // We use the original order ID as the billing agreement reference.
          const createRes = await fetch(`${baseUrl}/v2/checkout/orders`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              intent: "CAPTURE",
              purchase_units: [
                {
                  amount: { currency_code: "USD", value: "149.00" },
                  description: "MedMethod Direct — $149 remaining balance (auto-charged on appointment date)",
                  custom_id: String(payment.id),
                },
              ],
              payment_source: {
                token: {
                  id: payment.paypalOrderId,
                  type: "BILLING_AGREEMENT",
                },
              },
            }),
          });

          if (!createRes.ok) {
            const text = await createRes.text();
            throw new Error(`PayPal order creation failed (${createRes.status}): ${text}`);
          }

          const order = (await createRes.json()) as { id: string; status: string };

          // Capture immediately
          const captureRes = await fetch(`${baseUrl}/v2/checkout/orders/${order.id}/capture`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!captureRes.ok) {
            const text = await captureRes.text();
            throw new Error(`PayPal capture failed (${captureRes.status}): ${text}`);
          }

          const capture = (await captureRes.json()) as { status: string; id: string };

          if (capture.status === "COMPLETED") {
            await db
              .update(payments)
              .set({
                status: "fully_paid",
                paypalRemainingOrderId: order.id,
                updatedAt: new Date(),
              })
              .where(eq(payments.id, payment.id));

            console.log(`[SweepDueCharges] PayPal payment ${payment.id} → fully_paid`);
            results.push({ paymentId: payment.id, provider: "paypal", status: "fully_paid" });
          } else {
            console.warn(`[SweepDueCharges] PayPal unexpected capture status: ${capture.status} for payment ${payment.id}`);
            results.push({ paymentId: payment.id, provider: "paypal", status: capture.status });
          }
        } catch (ppErr: unknown) {
          const errMsg = ppErr instanceof Error ? ppErr.message : String(ppErr);
          console.error(`[SweepDueCharges] PayPal charge failed for payment ${payment.id}:`, errMsg);

          await db
            .update(payments)
            .set({ status: "failed", updatedAt: new Date() })
            .where(eq(payments.id, payment.id));

          results.push({ paymentId: payment.id, provider: "paypal", status: "failed", error: errMsg });
        }
      } else {
        // ── Stripe path ──────────────────────────────────────────────────────
        if (!payment.scheduledChargePaymentIntentId) {
          results.push({ paymentId: payment.id, provider: "stripe", status: "skipped_no_pi" });
          continue;
        }

        if (!payment.stripeCustomerId || !payment.stripePaymentMethodId) {
          console.error(`[SweepDueCharges] Missing customer/PM for Stripe payment ${payment.id}`);
          results.push({ paymentId: payment.id, provider: "stripe", status: "skipped_no_pm" });
          continue;
        }

        try {
          const settings = await getStripeSettings();
          if (!settings) {
            console.error("[SweepDueCharges] Stripe not configured");
            results.push({ paymentId: payment.id, provider: "stripe", status: "skipped_no_config" });
            continue;
          }

          const secretKey =
            settings.mode === "live" ? settings.liveSecretKey : settings.testSecretKey;

          if (!secretKey) {
            console.error("[SweepDueCharges] Stripe secret key missing");
            results.push({ paymentId: payment.id, provider: "stripe", status: "skipped_no_key" });
            continue;
          }

          const stripe = new Stripe(secretKey, { apiVersion: "2026-06-24.dahlia" });

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

            console.log(`[SweepDueCharges] Stripe payment ${payment.id} → fully_paid`);
            results.push({ paymentId: payment.id, provider: "stripe", status: "fully_paid" });
          } else {
            console.warn(`[SweepDueCharges] Unexpected Stripe PI status: ${confirmedPi.status} for payment ${payment.id}`);
            results.push({ paymentId: payment.id, provider: "stripe", status: confirmedPi.status });
          }
        } catch (stripeErr: unknown) {
          const errMsg = stripeErr instanceof Error ? stripeErr.message : String(stripeErr);
          console.error(`[SweepDueCharges] Stripe confirm failed for payment ${payment.id}:`, errMsg);

          await db
            .update(payments)
            .set({ status: "failed", updatedAt: new Date() })
            .where(eq(payments.id, payment.id));

          results.push({ paymentId: payment.id, provider: "stripe", status: "failed", error: errMsg });
        }
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
