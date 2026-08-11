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
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createPayment,
  getAllPayments,
  getPaymentById,
  getPaypalSettings,
  getStripeSettings,
  updatePayment,
  upsertStripeSettings,
} from "../db";
import { publicProcedure, router, superAdminOrAdminProcedure } from "../_core/trpc";
import { createWl2OneTimePaymentRecord, WL2_ONE_TIME_PAYMENT } from "../wl2OneTimePayment";

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
   * Public: create a one-time $15 PaymentIntent for the /lp/WL2 refundable hold.
   * This intentionally does not save a payment method or create a future balance.
   */
  createWl2OneTimeIntent: publicProcedure
    .input(
      z.object({
        patientName: z.string(),
        patientEmail: z.string().email(),
        patientPhone: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const stripe = await getStripeClient();
      if (!stripe) throw new Error("Stripe is not configured. Please contact support.");

      const paymentIntent = await stripe.paymentIntents.create({
        amount: 1500,
        currency: "usd",
        receipt_email: input.patientEmail,
        description: "MedMethod Direct — WL2 $15 refundable appointment hold",
        metadata: {
          source: "medmethod-direct",
          landingPage: "/lp/WL2",
          paymentType: "one_time_refundable_hold",
          patientName: input.patientName,
          patientEmail: input.patientEmail,
        },
      });

      const activeSettings = await getStripeSettings();
      const paymentId = await createPayment(createWl2OneTimePaymentRecord({
        patientName: input.patientName,
        patientEmail: input.patientEmail,
        patientPhone: input.patientPhone,
        paymentProvider: "stripe",
        stripeMode: activeSettings?.mode ?? "test",
        paymentIntentId: paymentIntent.id,
      }));

      return { clientSecret: paymentIntent.client_secret, paymentId };
    }),

  /** Confirms the successful WL2 $15 charge and finalizes it with no later charge. */
  confirmWl2OneTimePayment: publicProcedure
    .input(z.object({ paymentId: z.number(), paymentIntentId: z.string() }))
    .mutation(async ({ input }) => {
      const payment = await getPaymentById(input.paymentId);
      if (!payment || payment.landingPage !== "/lp/WL2" || payment.paymentProvider !== "stripe") {
        throw new TRPCError({ code: "NOT_FOUND", message: "WL2 payment not found" });
      }
      if (payment.depositPaymentIntentId !== input.paymentIntentId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Payment intent does not match this WL2 payment" });
      }

      const stripe = await getStripeClientForMode(payment.stripeMode ?? "test");
      if (!stripe) throw new Error("Stripe not configured");
      const intent = await stripe.paymentIntents.retrieve(input.paymentIntentId);
      if (intent.status !== "succeeded") {
        throw new Error(`Payment not confirmed. Status: ${intent.status}`);
      }

      const paymentMethodId =
        typeof intent.payment_method === "string"
          ? intent.payment_method
          : intent.payment_method?.id ?? null;

      await updatePayment(input.paymentId, {
        stripePaymentMethodId: paymentMethodId ?? undefined,
        remainingAmount: WL2_ONE_TIME_PAYMENT.remainingAmountCents,
        status: WL2_ONE_TIME_PAYMENT.finalStatus,
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

      // Auto-recover missing payment method.
      // Strategy 1: retrieve from the original deposit PaymentIntent.
      // Strategy 2: list the customer's saved payment methods.
      let paymentMethodId = payment.stripePaymentMethodId;
      if (!paymentMethodId) {
        // Strategy 1: retrieve from deposit PaymentIntent
        if (payment.depositPaymentIntentId) {
          try {
            const depositPi = await stripe.paymentIntents.retrieve(payment.depositPaymentIntentId);
            console.log(`[Recovery] Deposit PI status: ${depositPi.status}, payment_method: ${JSON.stringify(depositPi.payment_method)}`);
            const pmId = typeof depositPi.payment_method === "string"
              ? depositPi.payment_method
              : (depositPi.payment_method as any)?.id ?? null;
            if (pmId) {
              await updatePayment(input.paymentId, { stripePaymentMethodId: pmId, status: "deposit_paid" });
              paymentMethodId = pmId;
              console.log(`[Recovery] Recovered PM ${pmId} from deposit PI for payment #${input.paymentId}`);
            } else {
              console.warn(`[Recovery] Deposit PI ${payment.depositPaymentIntentId} has no payment_method attached (status: ${depositPi.status})`);
            }
          } catch (recoverErr: any) {
            console.error(`[Recovery] Failed to retrieve deposit PI ${payment.depositPaymentIntentId}:`, recoverErr?.message ?? recoverErr);
          }
        }

        // Strategy 2: list the customer's saved payment methods
        if (!paymentMethodId && payment.stripeCustomerId) {
          try {
            const pms = await stripe.paymentMethods.list({
              customer: payment.stripeCustomerId,
              type: "card",
              limit: 1,
            });
            const pm = pms.data[0];
            if (pm) {
              await updatePayment(input.paymentId, { stripePaymentMethodId: pm.id, status: "deposit_paid" });
              paymentMethodId = pm.id;
              console.log(`[Recovery] Recovered PM ${pm.id} from customer PM list for payment #${input.paymentId}`);
            } else {
              console.warn(`[Recovery] Customer ${payment.stripeCustomerId} has no saved payment methods`);
            }
          } catch (listErr: any) {
            console.error(`[Recovery] Failed to list PMs for customer ${payment.stripeCustomerId}:`, listErr?.message ?? listErr);
          }
        }
      }

      if (!paymentMethodId) {
        throw new Error("No payment method found. The patient's card could not be retrieved from Stripe. Please check the Stripe dashboard for this customer's payment methods.");
      }

      // Create a $149 PaymentIntent in "requires_confirmation" state
      // We will confirm it off-session on the appointment date via a cron job
      const pi = await stripe.paymentIntents.create({
        amount: 14900, // $149 in cents
        currency: "usd",
        customer: payment.stripeCustomerId,
        payment_method: paymentMethodId,
        confirm: false, // Will be confirmed by cron on appointment date
        description: "MedMethod Direct — $149 remaining balance (HRT consultation)",
        metadata: {
          source: "medmethod-direct",
          paymentId: String(input.paymentId),
          appointmentDate: String(input.appointmentDate),
          patientName: payment.patientName ?? "",
          patientEmail: payment.patientEmail ?? "",
        },
      });

      // Save appointment date and scheduled PI to DB.
      // The global hourly sweep cron (/api/scheduled/sweep-due-charges) will
      // pick this up and charge it once the appointmentDate has passed.
      await updatePayment(input.paymentId, {
        appointmentDate: input.appointmentDate,
        scheduledChargePaymentIntentId: pi.id,
      });

      return {
        success: true,
        scheduledPaymentIntentId: pi.id,
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

      // Auto-recover missing payment method.
      // Strategy 1: retrieve from the original deposit PaymentIntent.
      // Strategy 2: list the customer's saved payment methods.
      let paymentMethodId = payment.stripePaymentMethodId;
      if (!paymentMethodId) {
        // Strategy 1: retrieve from deposit PaymentIntent
        if (payment.depositPaymentIntentId) {
          try {
            const depositPi = await stripe.paymentIntents.retrieve(payment.depositPaymentIntentId);
            console.log(`[ChargeNow Recovery] Deposit PI status: ${depositPi.status}, payment_method: ${JSON.stringify(depositPi.payment_method)}`);
            const pmId = typeof depositPi.payment_method === "string"
              ? depositPi.payment_method
              : (depositPi.payment_method as any)?.id ?? null;
            if (pmId) {
              await updatePayment(input.paymentId, { stripePaymentMethodId: pmId, status: "deposit_paid" });
              paymentMethodId = pmId;
              console.log(`[ChargeNow Recovery] Recovered PM ${pmId} from deposit PI for payment #${input.paymentId}`);
            } else {
              console.warn(`[ChargeNow Recovery] Deposit PI has no payment_method attached (status: ${depositPi.status})`);
            }
          } catch (recoverErr: any) {
            console.error(`[ChargeNow Recovery] Failed to retrieve deposit PI:`, recoverErr?.message ?? recoverErr);
          }
        }

        // Strategy 2: list the customer's saved payment methods
        if (!paymentMethodId && payment.stripeCustomerId) {
          try {
            const pms = await stripe.paymentMethods.list({
              customer: payment.stripeCustomerId,
              type: "card",
              limit: 1,
            });
            const pm = pms.data[0];
            if (pm) {
              await updatePayment(input.paymentId, { stripePaymentMethodId: pm.id, status: "deposit_paid" });
              paymentMethodId = pm.id;
              console.log(`[ChargeNow Recovery] Recovered PM ${pm.id} from customer PM list for payment #${input.paymentId}`);
            } else {
              console.warn(`[ChargeNow Recovery] Customer ${payment.stripeCustomerId} has no saved payment methods`);
            }
          } catch (listErr: any) {
            console.error(`[ChargeNow Recovery] Failed to list PMs for customer:`, listErr?.message ?? listErr);
          }
        }
      }

      if (!paymentMethodId) {
        throw new Error("No payment method found. The patient's card could not be retrieved from Stripe. Please check the Stripe dashboard for this customer's payment methods.");
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
   * Admin: manually trigger the sweep cron to charge all due payments immediately.
   * Calls the internal sweep handler directly (bypasses HTTP auth).
   */
  triggerSweep: superAdminOrAdminProcedure.mutation(async () => {
    // Import and call the sweep handler logic directly
    const { runSweep } = await import("../scheduledChargeHandler");
    const result = await runSweep();
    return result;
  }),

  /**
   * Admin: list all payment records, filtered by the currently active Stripe mode.
   * Test mode shows only test payments; Live mode shows only real payments.
   */
  listPayments: superAdminOrAdminProcedure.query(async () => {
    // Determine active provider and mode, then filter payments accordingly.
    // PayPal settings take priority if PayPal is the active provider.
    const paypalSettings = await getPaypalSettings();
    const activeProvider = (paypalSettings?.activeProvider ?? "stripe") as "stripe" | "paypal";

    if (activeProvider === "paypal") {
      const ppMode = (paypalSettings?.mode ?? "sandbox") as "sandbox" | "live";
      return getAllPayments({ provider: "paypal", mode: ppMode });
    }

    // Stripe path
    const stripeSettings = await getStripeSettings();
    const stripeMode = (stripeSettings?.mode ?? "test") as "test" | "live";
    return getAllPayments({ provider: "stripe", mode: stripeMode });
  }),

  /**
   * Public: create a $5 TEST Stripe PaymentIntent (for live integration testing only).
   */
  createTestIntent: publicProcedure.mutation(async () => {
    const stripe = await getStripeClient();
    if (!stripe) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Stripe is not configured." });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 500, // $5 in cents
      currency: "usd",
      description: "MedMethod Direct — $5 live payment test",
      metadata: { source: "test-payment-page" },
    });

    return { clientSecret: paymentIntent.client_secret };
  }),
});
