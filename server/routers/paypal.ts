/**
 * PayPal tRPC Router — Vault-enabled
 *
 * Flow:
 *   1. createSetupToken  — creates a PayPal setup token to vault the payment method
 *   2. createOrder       — creates a $50 PayPal order using the vaulted payment method
 *   3. captureOrder      — captures the approved order, saves vault token, marks deposit_paid
 *   4. scheduleRemainingCharge — saves appointment date; sweep cron charges on that date
 *   5. chargeNow         — admin: immediately charges $149 using the vault token
 *   6. getSettings       — returns PayPal settings (keys masked) + active provider
 *   7. updateSettings    — saves PayPal credentials + active provider toggle
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
  clientId: string;
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
    return { baseUrl: getPayPalBaseUrl(mode), token, clientId };
  } catch {
    return null;
  }
}

/**
 * Charge $149 via PayPal Vault token (server-side, no customer interaction needed).
 * Used by both chargeNow and the sweep cron.
 */
export async function chargePayPalVault(
  paymentId: number,
  vaultToken: string,
  mode: PayPalMode
): Promise<{ success: boolean; captureId?: string; error?: string }> {
  const client = await getPayPalClient(mode);
  if (!client) return { success: false, error: `PayPal ${mode} credentials not configured` };

  // Create order using saved payment method (vault token)
  const createRes = await fetch(`${client.baseUrl}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${client.token}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": `charge-${paymentId}-${Date.now()}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: { currency_code: "USD", value: "149.00" },
          description: "MedMethod Direct — $149 remaining balance",
          custom_id: String(paymentId),
        },
      ],
      payment_source: {
        paypal: {
          vault_id: vaultToken,
        },
      },
    }),
  });

  if (!createRes.ok) {
    const text = await createRes.text();
    return { success: false, error: `PayPal order creation failed: ${text}` };
  }

  const order = (await createRes.json()) as { id: string; status: string };

  // If order is already COMPLETED (auto-captured), we're done
  if (order.status === "COMPLETED") {
    await updatePayment(paymentId, {
      status: "fully_paid",
      paypalRemainingOrderId: order.id,
      scheduledChargePaymentCronTaskUid: `cancelled-by-charge-${Date.now()}`,
    });
    return { success: true, captureId: order.id };
  }

  // Otherwise capture it
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
    return { success: false, error: `PayPal capture failed: ${text}` };
  }

  const capture = (await captureRes.json()) as { status: string; id: string };
  if (capture.status !== "COMPLETED") {
    return { success: false, error: `PayPal capture status: ${capture.status}` };
  }

  await updatePayment(paymentId, {
    status: "fully_paid",
    paypalRemainingOrderId: order.id,
    scheduledChargePaymentCronTaskUid: `cancelled-by-charge-${Date.now()}`,
  });

  return { success: true, captureId: capture.id };
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const paypalRouter = router({
  /**
   * Get PayPal settings (keys masked) + active provider.
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
   * Public: get the active client ID + vault intent for the current mode.
   * Used by the frontend PayPal SDK to initialize the button.
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
   * Public: create a $50 PayPal order with vault intent.
   * Returns orderId and paymentId. The frontend PayPal button uses orderId.
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

      // Create PayPal order with vault intent so the payment method is saved
      const res = await fetch(`${client.baseUrl}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${client.token}`,
          "Content-Type": "application/json",
          "PayPal-Request-Id": `create-${paymentId}-${Date.now()}`,
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
          payment_source: {
            paypal: {
              experience_context: {
                brand_name: "MedMethod Direct",
                user_action: "PAY_NOW",
                return_url: "https://medmethoddirect.com/thank-you",
                cancel_url: "https://medmethoddirect.com",
              },
              attributes: {
                vault: {
                  store_in_vault: "ON_SUCCESS",
                  usage_type: "MERCHANT",
                  customer_type: "CONSUMER",
                },
              },
            },
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
   * Public: capture an approved PayPal order, extract vault token, mark deposit_paid.
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
        payment_source?: {
          paypal?: {
            attributes?: {
              vault?: {
                id?: string;
                customer?: { id?: string };
              };
            };
          };
        };
        purchase_units?: Array<{
          payments?: { captures?: Array<{ id: string; status: string }> };
        }>;
      };

      if (capture.status !== "COMPLETED") {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `PayPal capture status: ${capture.status}` });
      }

      // Extract vault token and customer ID from the capture response
      const vaultToken = capture.payment_source?.paypal?.attributes?.vault?.id ?? null;
      const customerId = capture.payment_source?.paypal?.attributes?.vault?.customer?.id ?? null;

      await updatePayment(input.paymentId, {
        status: "deposit_paid",
        paypalOrderId: input.orderId,
        ...(vaultToken ? { paypalVaultToken: vaultToken } : {}),
        ...(customerId ? { paypalCustomerId: customerId } : {}),
      });

      return { success: true, captureId: capture.id, hasVaultToken: !!vaultToken };
    }),

  /**
   * Public: schedule the $149 remaining charge on the appointment date.
   * The global sweep cron will pick this up and charge via vault token.
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

      await updatePayment(input.paymentId, {
        appointmentDate: input.appointmentDate,
        scheduledChargePaymentCronTaskUid: `paypal-sweep-${input.paymentId}-${Date.now()}`,
      });

      return { success: true };
    }),

  /**
   * Admin: immediately charge $149 via the stored vault token.
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
      if (!payment.paypalVaultToken) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "No saved PayPal payment method on file. The customer must complete a new checkout to save their payment method before automatic charging is available.",
        });
      }

      const mode = (payment.paypalMode ?? "sandbox") as PayPalMode;
      if (input.appointmentDate) {
        await updatePayment(input.paymentId, { appointmentDate: input.appointmentDate });
      }

      const result = await chargePayPalVault(input.paymentId, payment.paypalVaultToken, mode);
      if (!result.success) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: result.error ?? "PayPal charge failed" });
      }

      return { success: true, captureId: result.captureId, amount: 149 };
    }),

  /**
   * Admin: list all PayPal payment records for the current mode.
   */
  listPayments: superAdminOrAdminProcedure.query(async () => {
    const settings = await getPaypalSettings();
    const mode = settings?.mode ?? "sandbox";
    const all = await getAllPayments();
    return all.filter(
      (p) =>
        p.paymentProvider === "paypal" &&
        (p.paypalMode ?? "sandbox") === mode
    );
  }),
});
