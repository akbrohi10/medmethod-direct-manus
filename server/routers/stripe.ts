/**
 * Stripe router — handles key management (admin) and payment processing (public).
 *
 * Payment flow:
 *   1. publicProcedure: getPublishableKey — returns the active publishable key (safe for frontend)
 *   2. publicProcedure: createDepositIntent — creates a $50 PaymentIntent, saves customer + PM, returns client_secret
 *   3. publicProcedure: scheduleRemainingCharge — saves appointment date, creates a $149 PaymentIntent
 *      with a future_usage setup so it can be charged off-session on the appointment date
 *
 * Admin:
 *   4. adminProcedure: getSettings — returns all keys (redacted for display)
 *   5. adminProcedure: updateSettings — saves keys/mode
 *   6. adminProcedure: listPayments — returns all payment records
 */

import Stripe from "stripe";
import { z } from "zod";
import {
  createPayment,
  getAllPayments,
  getPaymentById,
  getStripeSettings,
  updatePayment,
  upsertStripeSettings,
} from "../db";
import { publicProcedure, router, superAdminOrAdminProcedure } from "../_core/trpc";
import { createHeartbeatJob } from "../_core/heartbeat";

// ─── Helpers ────────────────────────────────────────────────────────────────

async function getStripeClient(): Promise<Stripe | null> {
  const settings = await getStripeSettings();
  if (!settings) return null;

  const secretKey =
    settings.mode === "live"
      ? settings.liveSecretKey
      : settings.testSecretKey;

  if (!secretKey) return null;

  return new Stripe(secretKey, { apiVersion: "2026-06-24.dahlia" });
}

/**
 * Get a Stripe client for a specific mode (test or live).
 * Used when we need to charge using the same mode the payment was created in,
 * regardless of the current global mode setting.
 */
async function getStripeClientForMode(mode: "test" | "live"): Promise<Stripe | null> {
  const settings = await getStripeSettings();
  if (!settings) return null;

  const secretKey = mode === "live" ? settings.liveSecretKey : settings.testSecretKey;
  if (!secretKey) return null;

  return new Stripe(secretKey, { apiVersion: "2026-06-24.dahlia" });
}

function redactKey(key: string | null | undefined): string {
  if (!key) return "";
  if (key.length <= 8) return "****";
  return key.slice(0, 7) + "..." + key.slice(-4);
}

// ─── Router ─────────────────────────────────────────────────────────────────

export const stripeRouter = router({
  /**
   * Returns the active publishable key for the current mode.
   * Safe to expose to the frontend.
   */
  getPublishableKey: publicProcedure.query(async () => {
    const settings = await getStripeSettings();
    if (!settings) return { publishableKey: null, mode: "test" as const };

    const publishableKey =
      settings.mode === "live"
        ? settings.livePublishableKey
        : settings.testPublishableKey;

    return {
      publishableKey: publishableKey ?? null,
      mode: settings.mode,
    };
  }),

  /**
   * Admin: get current settings (keys are redacted for display).
   */
  getSettings: superAdminOrAdminProcedure.query(async () => {
    const settings = await getStripeSettings();
    if (!settings) {
      return {
        mode: "test" as const,
        testPublishableKey: "",
        testSecretKey: "",
        livePublishableKey: "",
        liveSecretKey: "",
        configured: false,
      };
    }
    return {
      mode: settings.mode,
      testPublishableKey: settings.testPublishableKey ?? "",
      testSecretKey: redactKey(settings.testSecretKey),
      livePublishableKey: settings.livePublishableKey ?? "",
      liveSecretKey: redactKey(settings.liveSecretKey),
      configured: true,
    };
  }),

  /**
   * Admin: save/update Stripe keys and mode.
   * Only updates fields that are provided (non-empty strings).
   */
  updateSettings: superAdminOrAdminProcedure
    .input(
      z.object({
        mode: z.enum(["test", "live"]).optional(),
        testPublishableKey: z.string().optional(),
        testSecretKey: z.string().optional(),
        livePublishableKey: z.string().optional(),
        liveSecretKey: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const update: Record<string, string | "test" | "live"> = {};
      if (input.mode) update.mode = input.mode;
      if (input.testPublishableKey) update.testPublishableKey = input.testPublishableKey;
      // Only save secret keys if they look like real keys (not redacted display values)
      if (input.testSecretKey && !input.testSecretKey.includes("...")) {
        update.testSecretKey = input.testSecretKey;
      }
      if (input.livePublishableKey) update.livePublishableKey = input.livePublishableKey;
      if (input.liveSecretKey && !input.liveSecretKey.includes("...")) {
        update.liveSecretKey = input.liveSecretKey;
      }
      await upsertStripeSettings(update);
      return { success: true };
    }),

  /**
   * Public: create a $50 deposit PaymentIntent.
   * Returns the client_secret so the frontend can confirm the payment with Stripe.js.
   * Also creates a Stripe Customer and saves the payment record to the DB.
   */
  createDepositIntent: publicProcedure
    .input(
      z.object({
        patientName: z.string(),
        patientEmail: z.string().email(),
        patientPhone: z.string().optional(),
        landingPage: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const stripe = await getStripeClient();
      if (!stripe) {
        throw new Error("Stripe is not configured. Please contact support.");
      }

      // Create a Stripe Customer so we can charge them again later
      const customer = await stripe.customers.create({
        name: input.patientName,
        email: input.patientEmail,
        phone: input.patientPhone,
        metadata: { source: "medmethod-direct", landingPage: input.landingPage ?? "hrt2" },
      });

      // Create a $50 PaymentIntent with setup_future_usage so the payment method
      // is saved for the future $149 charge
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 5000, // $50 in cents
        currency: "usd",
        customer: customer.id,
        setup_future_usage: "off_session",
        description: "MedMethod Direct — $50 deposit (HRT consultation)",
        metadata: {
          source: "medmethod-direct",
          landingPage: input.landingPage ?? "hrt2",
          patientName: input.patientName,
          patientEmail: input.patientEmail,
        },
      });

      // Save the payment record to our DB with status 'pending' until Stripe confirms.
      // Tag with the active Stripe mode so the admin dashboard can filter by environment.
      const activeSettings = await getStripeSettings();
      const paymentId = await createPayment({
        patientName: input.patientName,
        patientEmail: input.patientEmail,
        patientPhone: input.patientPhone ?? null,
        depositAmount: 5000,
        remainingAmount: 14900,
        stripeCustomerId: customer.id,
        depositPaymentIntentId: paymentIntent.id,
        status: "pending",
        landingPage: input.landingPage ?? "hrt2",
        stripeMode: activeSettings?.mode ?? "test",
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentId,
        customerId: customer.id,
      };
    }),

  /**
   * Public: confirm deposit was successful and save the payment method for later.
   * Called after Stripe.js confirms the payment on the frontend.
   */
  confirmDeposit: publicProcedure
    .input(
      z.object({
        paymentId: z.number(),
        paymentIntentId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const stripe = await getStripeClient();
      if (!stripe) throw new Error("Stripe not configured");

      // Retrieve the confirmed PaymentIntent to get the payment method
      const pi = await stripe.paymentIntents.retrieve(input.paymentIntentId);

      if (pi.status !== "succeeded") {
        throw new Error(`Payment not confirmed. Status: ${pi.status}`);
      }

      const paymentMethodId =
        typeof pi.payment_method === "string"
          ? pi.payment_method
          : pi.payment_method?.id ?? null;

      // Save the payment method to our DB record
      await updatePayment(input.paymentId, {
        stripePaymentMethodId: paymentMethodId ?? undefined,
        status: "deposit_paid",
      });

      return { success: true };
    }),

  /**
   * Public: schedule the $149 remaining charge on the appointment date.
   * Saves the appointment date to the DB, creates a $149 PaymentIntent,
   * and schedules a Heartbeat cron job to confirm it off-session on that date.
   *
   * The cron fires at 09:00 UTC on the appointment date.
   * The callback at /api/scheduled/charge-remaining handles the actual charge.
   *
   * This is a publicProcedure because it is called from the frontend after
   * the patient books their appointment in the GHL calendar iframe (Option B).
   * The paymentId is validated against the DB to ensure it exists and belongs
   * to a real deposit_paid payment before scheduling.
   */
  scheduleRemainingCharge: publicProcedure
    .input(
      z.object({
        paymentId: z.number(),
        appointmentDate: z.number(), // UTC timestamp in ms
      })
    )
    .mutation(async ({ input }) => {
      const payment = await getPaymentById(input.paymentId);
      if (!payment) throw new Error("Payment record not found");

      // Guard: only allow scheduling for payments that are in deposit_paid status
      if (payment.status !== "deposit_paid") {
        throw new Error(`Payment #${input.paymentId} is not in deposit_paid status (status: ${payment.status})`);
      }

      // Guard: prevent double-scheduling
      if (payment.appointmentDate) {
        throw new Error(`Payment #${input.paymentId} already has an appointment scheduled`);
      }

      // Use the Stripe mode that was active when the payment was created.
      // This ensures we charge in the correct environment even if the admin
      // has since switched between test and live mode.
      const paymentStripeMode = payment.stripeMode ?? "test";
      const stripe = await getStripeClientForMode(paymentStripeMode);
      if (!stripe) throw new Error(`Stripe not configured for ${paymentStripeMode} mode`);

      if (!payment.stripeCustomerId) {
        throw new Error("No Stripe customer found for this payment. The patient may not have completed the payment form.");
      }

      // Auto-recover missing payment method from the original deposit PaymentIntent.
      // This can happen if confirmDeposit was not called (e.g. 3DS redirect, network error).
      let paymentMethodId = payment.stripePaymentMethodId;
      if (!paymentMethodId && payment.depositPaymentIntentId) {
        try {
          const depositPi = await stripe.paymentIntents.retrieve(payment.depositPaymentIntentId);
          if (depositPi.status === "succeeded") {
            const pmId = typeof depositPi.payment_method === "string"
              ? depositPi.payment_method
              : depositPi.payment_method?.id ?? null;
            if (pmId) {
              // Save it for future use
              await updatePayment(input.paymentId, { stripePaymentMethodId: pmId, status: "deposit_paid" });
              paymentMethodId = pmId;
              console.log(`[ScheduleRemainingCharge] Recovered payment method ${pmId} for payment #${input.paymentId}`);
            }
          }
        } catch (recoverErr) {
          console.error("[ScheduleRemainingCharge] Failed to recover payment method:", recoverErr);
        }
      }

      if (!paymentMethodId) {
        throw new Error("No payment method found for this payment. The $50 deposit may not have been fully confirmed. Please check Stripe dashboard.");
      }

      // Create a $149 PaymentIntent in "requires_confirmation" state
      // We will confirm it off-session on the appointment date via a cron job
      const pi = await stripe.paymentIntents.create({
        amount: 14900, // $149 in cents
        currency: "usd",
        customer: payment.stripeCustomerId,
        payment_method: paymentMethodId,
        confirm: false, // Will be confirmed by cron on appointment date
        off_session: true,
        description: "MedMethod Direct — $149 remaining balance (HRT consultation)",
        metadata: {
          source: "medmethod-direct",
          paymentId: String(input.paymentId),
          appointmentDate: String(input.appointmentDate),
          patientName: payment.patientName ?? "",
          patientEmail: payment.patientEmail ?? "",
        },
      });

      // Build cron expression: fire at 09:00 UTC on the appointment date
      const apptDate = new Date(input.appointmentDate);
      const cronExpr = `0 0 9 ${apptDate.getUTCDate()} ${apptDate.getUTCMonth() + 1} *`;

      // Create the Heartbeat cron job
      // Empty session token = use project owner identity for Heartbeat authentication
      let taskUid: string | null = null;
      try {
        const job = await createHeartbeatJob(
          {
            name: `charge-remaining-${input.paymentId}`,
            cron: cronExpr,
            path: "/api/scheduled/charge-remaining",
            method: "POST",
            description: `Charge $149 remaining for patient ${payment.patientName ?? ""} (payment #${input.paymentId})`,
          },
          "" // Empty = use project owner identity
        );
        taskUid = job.taskUid;
      } catch (heartbeatErr) {
        // Log but don't fail — the PI is already created; admin can manually charge
        console.error("[ScheduleRemainingCharge] Heartbeat job creation failed:", heartbeatErr);
      }

      // Save appointment date, scheduled PI, and cron task UID to DB
      await updatePayment(input.paymentId, {
        appointmentDate: input.appointmentDate,
        scheduledChargePaymentIntentId: pi.id,
        scheduledChargePaymentCronTaskUid: taskUid ?? undefined,
      });

      return {
        success: true,
        scheduledPaymentIntentId: pi.id,
        cronTaskUid: taskUid,
      };
    }),

  /**
   * Admin: immediately charge the $149 remaining balance now (off-session).
   * Also saves the appointment date if provided.
   * After a successful charge, marks the payment as fully_paid and cancels
   * any pending Heartbeat cron job so the patient is not double-charged.
   */
  chargeNow: superAdminOrAdminProcedure
    .input(
      z.object({
        paymentId: z.number(),
        appointmentDate: z.number().optional(), // UTC timestamp in ms (optional)
      })
    )
    .mutation(async ({ input }) => {
      const payment = await getPaymentById(input.paymentId);
      if (!payment) throw new Error("Payment record not found");

      if (payment.status === "fully_paid") {
        throw new Error("This payment has already been paid in full.");
      }

      if (!payment.stripeCustomerId) {
        throw new Error("No Stripe customer found for this payment.");
      }

      const paymentStripeMode = payment.stripeMode ?? "test";
      const stripe = await getStripeClientForMode(paymentStripeMode);
      if (!stripe) throw new Error(`Stripe not configured for ${paymentStripeMode} mode`);

      // Auto-recover missing payment method from the original deposit PaymentIntent
      let paymentMethodId = payment.stripePaymentMethodId;
      if (!paymentMethodId && payment.depositPaymentIntentId) {
        try {
          const depositPi = await stripe.paymentIntents.retrieve(payment.depositPaymentIntentId);
          if (depositPi.status === "succeeded") {
            const pmId = typeof depositPi.payment_method === "string"
              ? depositPi.payment_method
              : depositPi.payment_method?.id ?? null;
            if (pmId) {
              await updatePayment(input.paymentId, { stripePaymentMethodId: pmId, status: "deposit_paid" });
              paymentMethodId = pmId;
              console.log(`[ChargeNow] Recovered payment method ${pmId} for payment #${input.paymentId}`);
            }
          }
        } catch (recoverErr) {
          console.error("[ChargeNow] Failed to recover payment method:", recoverErr);
        }
      }

      if (!paymentMethodId) {
        throw new Error("No payment method found. The $50 deposit may not have been fully confirmed. Check Stripe dashboard.");
      }

      // Create and immediately confirm a $149 PaymentIntent off-session
      const pi = await stripe.paymentIntents.create({
        amount: 14900,
        currency: "usd",
        customer: payment.stripeCustomerId,
        payment_method: paymentMethodId,
        confirm: true, // Charge immediately
        off_session: true,
        description: "MedMethod Direct — $149 remaining balance (HRT consultation, charged by admin)",
        metadata: {
          source: "medmethod-direct",
          paymentId: String(input.paymentId),
          patientName: payment.patientName ?? "",
          patientEmail: payment.patientEmail ?? "",
          triggeredBy: "admin_charge_now",
        },
      });

      if (pi.status !== "succeeded") {
        throw new Error(`Charge failed. Stripe status: ${pi.status}. Check Stripe dashboard for details.`);
      }

      // Save appointment date (if provided), mark fully paid, and clear the cron task
      // so the Heartbeat job (if any) won't double-charge.
      await updatePayment(input.paymentId, {
        ...(input.appointmentDate ? { appointmentDate: input.appointmentDate } : {}),
        status: "fully_paid",
        // Clear the cron task UID so the admin UI shows 'Paid in full'
        // and the scheduled handler skips this payment if it fires.
        scheduledChargePaymentCronTaskUid: `cancelled-by-admin-${Date.now()}`,
      });

      console.log(`[ChargeNow] Payment #${input.paymentId} charged $149 immediately. PI: ${pi.id}`);

      return {
        success: true,
        chargedPaymentIntentId: pi.id,
        amount: 149,
      };
    }),

  /**
   * Admin: list all payment records, filtered by the currently active Stripe mode.
   * Test mode shows only test payments; Live mode shows only real payments.
   */
  listPayments: superAdminOrAdminProcedure.query(async () => {
    const settings = await getStripeSettings();
    const mode = settings?.mode ?? "test";
    return getAllPayments(mode);
  }),
});
