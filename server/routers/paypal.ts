/**
 * PayPal tRPC Router
 *
 * Mirrors the Stripe router (server/routers/stripe.ts) but uses PayPal Orders API.
 *
 * Flow:
 *   1. createOrder  — creates a $50 PayPal order and returns the order ID
 *   2. captureOrder — captures the approved order, saves payment record, schedules $149
 *   3. scheduleRemainingCharge — schedules the $149 charge on the appointment date
 *   4. chargeNow    — immediately charges the $149 remaining balance (admin)
 *   5. getSettings  — returns PayPal settings (keys masked) + active provider
 *   6. updateSettings — saves PayPal credentials + active provider toggle
 *   7. listPayments — lists all PayPal payments for the admin dashboard
 *
 * PayPal webhook for GHL is handled by server/paypalPaymentWebhook.ts
 * Webhook URL: https://medmethoddirect.com/api/webhooks/paypal-payment
 */
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createPayment,
  getAllPayments,
  getPaymentById,
  getPaypalSettings,
  updatePayment,
  upsertPaypalSettings,
} from "../db";
import { publicProcedure, router, superAdminOrAdminProcedure } from "../_core/trpc";

// ─── PayPal REST API helpers ──────────────────────────────────────────────────

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

async function getPayPalClient(mode: PayPalMode): Promise<{
  baseUrl: string;
  token: string;
} | null> {
  const settings = await getPaypalSettings();
  if (!settings) return null;

  const clientId =
    mode === "live" ? settings.liveClientId : settings.sandboxClientId;
  const clientSecret =
    mode === "live" ? settings.liveClientSecret : settings.sandboxClientSecret;

  if (!clientId || !clientSecret) return null;

  try {
    const token = await getPayPalAccessToken(clientId, clientSecret, mode);
    return { baseUrl: getPayPalBaseUrl(mode), token };
  } catch {
    return null;
  }
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const paypalRouter = router({
  /**
   * Get PayPal settings (keys masked) + active provider.
   * Used by the admin settings page.
   */
  getSettings: superAdminOrAdminProcedure.query(async () => {
    const settings = await getPaypalSettings();
    const mask = (key: string | null | undefined) =>
      key ? `${key.slice(0, 6)}...${key.slice(-4)}` : null;
    return {
      mode: settings?.mode ?? "sandbox",
      activeProvider: settings?.activeProvider ?? "stripe",
      sandboxClientId: settings?.sandboxClientId ?? null,
      sandboxClientIdMasked: mask(settings?.sandboxClientId),
      sandboxClientSecretMasked: mask(settings?.sandboxClientSecret),
      liveClientId: settings?.liveClientId ?? null,
      liveClientIdMasked: mask(settings?.liveClientId),
      liveClientSecretMasked: mask(settings?.liveClientSecret),
      hasSandboxKeys: !!(settings?.sandboxClientId && settings?.sandboxClientSecret),
      hasLiveKeys: !!(settings?.liveClientId && settings?.liveClientSecret),
    };
  }),

  /**
   * Save PayPal credentials and active provider.
   */
  updateSettings: superAdminOrAdminProcedure
    .input(
      z.object({
        mode: z.enum(["sandbox", "live"]).optional(),
        activeProvider: z.enum(["stripe", "paypal"]).optional(),
        sandboxClientId: z.string().optional(),
        sandboxClientSecret: z.string().optional(),
        liveClientId: z.string().optional(),
        liveClientSecret: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await upsertPaypalSettings(input);
      return { success: true };
    }),

  /**
   * Public: get the active client ID for the current mode (used by frontend PayPal SDK).
   * Never exposes the secret.
   */
  getPublicClientId: publicProcedure.query(async () => {
    const settings = await getPaypalSettings();
    if (!settings) return { clientId: null, mode: "sandbox" as PayPalMode, activeProvider: "stripe" };
    const mode = settings.mode ?? "sandbox";
    const clientId =
      mode === "live" ? settings.liveClientId : settings.sandboxClientId;
    return {
      clientId: clientId ?? null,
      mode,
      activeProvider: settings.activeProvider ?? "stripe",
    };
  }),

  /**
   * Public: create a $50 PayPal order and return the order ID.
   * The frontend uses this to render the PayPal button.
   */
  createOrder: publicProcedure
    .input(
      z.object({
        patientName: z.string(),
        patientEmail: z.string().email(),
        patientPhone: z.string(),
        landingPage: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const settings = await getPaypalSettings();
      if (!settings) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "PayPal not configured" });

      const mode = settings.mode ?? "sandbox";
      const client = await getPayPalClient(mode);
      if (!client) throw new TRPCError({ code: "PRECONDITION_FAILED", message: `PayPal ${mode} credentials not configured` });

      // Create a payment record first so we have an ID to embed in the order
      const paymentId = await createPayment({
        patientName: input.patientName,
        patientEmail: input.patientEmail,
        patientPhone: input.patientPhone,
        landingPage: input.landingPage ?? "",
        status: "pending",
        depositAmount: 5000,
        remainingAmount: 14900,
        paymentProvider: "paypal",
        paypalMode: mode,
        stripeMode: "test", // not used for PayPal, but column is NOT NULL
      });

      // Create PayPal order
      const res = await fetch(`${client.baseUrl}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${client.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: { currency_code: "USD", value: "50.00" },
              description: "MedMethod Direct — $50 consultation deposit",
              custom_id: String(paymentId),
            },
          ],
          application_context: {
            brand_name: "MedMethod Direct",
            user_action: "PAY_NOW",
          },
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `PayPal order creation failed: ${text}` });
      }

      const order = (await res.json()) as { id: string };
      await updatePayment(paymentId, { paypalOrderId: order.id });

      return { orderId: order.id, paymentId };
    }),

  /**
   * Public: capture an approved PayPal order and mark deposit as paid.
   */
  captureOrder: publicProcedure
    .input(
      z.object({
        orderId: z.string(),
        paymentId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const settings = await getPaypalSettings();
      if (!settings) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "PayPal not configured" });

      const mode = settings.mode ?? "sandbox";
      const client = await getPayPalClient(mode);
      if (!client) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "PayPal credentials not configured" });

      const res = await fetch(
        `${client.baseUrl}/v2/checkout/orders/${input.orderId}/capture`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${client.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `PayPal capture failed: ${text}` });
      }

      const capture = (await res.json()) as {
        status: string;
        id: string;
        purchase_units?: Array<{
          payments?: { captures?: Array<{ id: string; status: string }> };
        }>;
      };

      if (capture.status !== "COMPLETED") {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `PayPal capture status: ${capture.status}` });
      }

      await updatePayment(input.paymentId, {
        status: "deposit_paid",
        paypalOrderId: input.orderId,
      });

      return { success: true, captureId: capture.id };
    }),

  /**
   * Public: schedule the $149 remaining charge on the appointment date.
   * Called after the patient selects their appointment slot.
   */
  scheduleRemainingCharge: publicProcedure
    .input(
      z.object({
        paymentId: z.number(),
        appointmentDate: z.number(), // UTC ms
      })
    )
    .mutation(async ({ input }) => {
      const payment = await getPaymentById(input.paymentId);
      if (!payment) throw new TRPCError({ code: "NOT_FOUND", message: "Payment not found" });
      if (payment.paymentProvider !== "paypal") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Payment is not a PayPal payment" });
      }
      if (payment.status === "fully_paid") return { success: true, alreadyPaid: true };
      if (payment.scheduledChargePaymentCronTaskUid && !payment.scheduledChargePaymentCronTaskUid.startsWith("cancelled")) {
        return { success: true, alreadyScheduled: true };
      }

      // Save the appointment date — the global hourly sweep cron
      // (/api/scheduled/sweep-due-charges) will pick this up and charge it
      // once the appointmentDate has passed.
      await updatePayment(input.paymentId, {
        appointmentDate: input.appointmentDate,
        scheduledChargePaymentCronTaskUid: `paypal-sweep-${input.paymentId}-${Date.now()}`,
      });

      return { success: true };
    }),

  /**
   * Admin: immediately charge the $149 remaining balance via PayPal.
   * Uses PayPal Orders API to create and capture a new order.
   */
  chargeNow: superAdminOrAdminProcedure
    .input(
      z.object({
        paymentId: z.number(),
        appointmentDate: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const payment = await getPaymentById(input.paymentId);
      if (!payment) throw new TRPCError({ code: "NOT_FOUND", message: "Payment not found" });
      if (payment.paymentProvider !== "paypal") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Payment is not a PayPal payment" });
      }
      if (payment.status === "fully_paid") {
        throw new TRPCError({ code: "CONFLICT", message: "Payment is already fully paid" });
      }

      const mode = payment.paypalMode ?? "sandbox";
      const client = await getPayPalClient(mode);
      if (!client) throw new TRPCError({ code: "PRECONDITION_FAILED", message: `PayPal ${mode} credentials not configured` });

      // Create a new $149 order
      const createRes = await fetch(`${client.baseUrl}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${client.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: { currency_code: "USD", value: "149.00" },
              description: "MedMethod Direct — $149 remaining balance (charged by admin)",
              custom_id: String(input.paymentId),
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
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `PayPal order creation failed: ${text}` });
      }

      const order = (await createRes.json()) as { id: string; status: string };

      // Capture immediately
      const captureRes = await fetch(
        `${client.baseUrl}/v2/checkout/orders/${order.id}/capture`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${client.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!captureRes.ok) {
        const text = await captureRes.text();
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `PayPal capture failed: ${text}` });
      }

      const capture = (await captureRes.json()) as { status: string; id: string };
      if (capture.status !== "COMPLETED") {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `PayPal capture status: ${capture.status}` });
      }

      await updatePayment(input.paymentId, {
        ...(input.appointmentDate ? { appointmentDate: input.appointmentDate } : {}),
        status: "fully_paid",
        paypalRemainingOrderId: order.id,
        scheduledChargePaymentCronTaskUid: `cancelled-by-admin-${Date.now()}`,
      });

      return { success: true, chargedOrderId: order.id, amount: 149 };
    }),

  /**
   * Admin: list all PayPal payment records.
   */
  listPayments: superAdminOrAdminProcedure.query(async () => {
    const settings = await getPaypalSettings();
    const mode = settings?.mode ?? "sandbox";
    const all = await getAllPayments();
    // Filter to PayPal payments matching current mode
    return all.filter(
      (p) =>
        p.paymentProvider === "paypal" &&
        (p.paypalMode ?? "sandbox") === mode
    );
  }),
});
