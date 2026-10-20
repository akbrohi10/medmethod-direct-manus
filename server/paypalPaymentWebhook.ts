/**
 * PayPal Payment Webhook Handler
 *
 * Fires when a PayPal payment.capture.completed event arrives.
 * Mirrors stripePaymentWebhook.ts — forwards a flat JSON payload to GHL.
 *
 * Setup in PayPal Developer Dashboard:
 *   My Apps & Credentials → your app → Webhooks → Add Webhook
 *   URL: https://medmethoddirect.com/api/webhooks/paypal-payment
 *   Events: PAYMENT.CAPTURE.COMPLETED
 *
 * The same GHL_PAYMENT_WEBHOOK_URL used by Stripe is reused here.
 */
import { and, eq, isNull } from "drizzle-orm";
import { Request, Response } from "express";
import { paymentWebhookLog, payments } from "../drizzle/schema";
import { getDb, getPaypalSettings } from "./db";
import { getPayPalClient, type PayPalMode } from "./routers/paypal";
import { WEBHOOK_CONFIG } from "./stripePaymentWebhook";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GhlPaymentPayload {
  event: "payment_success";
  landing_page_path: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  form_submission_id: string;
  payment_amount: string;
  payment_currency: string;
  payment_status: string;
  transaction_id: string;
  payment_processor: string;
  product_name: string;
  paid_at: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type PayPalWebhookEvent = {
  event_type?: string;
  resource?: Record<string, unknown>;
};

/** The delayed Apple Pay vault event is verified with PayPal before it can mutate a payment. */
async function verifyApplePayVaultWebhook(req: Request, event: PayPalWebhookEvent): Promise<boolean> {
  const headerNames = [
    "paypal-auth-algo",
    "paypal-cert-url",
    "paypal-transmission-id",
    "paypal-transmission-sig",
    "paypal-transmission-time",
  ];
  if (headerNames.some((header) => !req.header(header))) return false;

  const settings = await getPaypalSettings();
  const configurations: Array<{ mode: PayPalMode; webhookId: string | null | undefined }> = [
    { mode: "sandbox", webhookId: settings?.sandboxWebhookId },
    { mode: "live", webhookId: settings?.liveWebhookId },
  ];
  for (const configuration of configurations) {
    if (!configuration.webhookId) continue;
    const client = await getPayPalClient(configuration.mode);
    if (!client) continue;
    try {
      const verify = await fetch(`${client.baseUrl}/v1/notifications/verify-webhook-signature`, {
        method: "POST",
        headers: { Authorization: `Bearer ${client.token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          auth_algo: req.header("paypal-auth-algo"),
          cert_url: req.header("paypal-cert-url"),
          transmission_id: req.header("paypal-transmission-id"),
          transmission_sig: req.header("paypal-transmission-sig"),
          transmission_time: req.header("paypal-transmission-time"),
          webhook_id: configuration.webhookId,
          webhook_event: event,
        }),
      });
      if (!verify.ok) continue;
      const result = (await verify.json()) as { verification_status?: string };
      if (result.verification_status === "SUCCESS") return true;
    } catch {
      // Never trust a notification whose verification itself failed.
    }
  }
  return false;
}

async function sendToGhl(
  payload: GhlPaymentPayload,
  attempt: number
): Promise<{ ok: boolean; status: number; body: string }> {
  const url = WEBHOOK_CONFIG.GHL_PAYMENT_WEBHOOK_URL;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await res.text();
    return { ok: res.ok, status: res.status, body };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, status: 0, body: msg };
  }
}

// ─── Handler ─────────────────────────────────────────────────────────────────

/**
 * Express route handler for POST /api/webhooks/paypal-payment
 *
 * Legacy capture forwarding is retained. The Apple Pay vault-token event is
 * security-sensitive and is verified against PayPal before it can update a record.
 */
export async function paypalPaymentWebhookHandler(
  req: Request,
  res: Response
): Promise<Response> {
  const db = await getDb();
  if (!db) {
    return res.status(500).json({ error: "Database unavailable" });
  }

  try {
    const event = req.body as PayPalWebhookEvent & {
      resource?: {
        id?: string;
        custom_id?: string;
        customer?: { id?: string };
        amount?: { value?: string; currency_code?: string };
        create_time?: string;
        status?: string;
      };
    };

    // Saved Apple Pay methods can finish vaulting after capture. PayPal then
    // sends this event with the vault token and PayPal customer ID. Keep the
    // token tied only to the matching masterclass Apple Pay deposit so the
    // appointment-day sweep can use payment_source.apple_pay later.
    if (event.event_type === "VAULT.PAYMENT-TOKEN.CREATED") {
      const paypalSettings = await getPaypalSettings();
      if (!paypalSettings?.sandboxWebhookId && !paypalSettings?.liveWebhookId) {
        return res.status(503).json({ error: "Apple Pay vault webhook verification is not configured" });
      }
      if (!(await verifyApplePayVaultWebhook(req, event))) {
        return res.status(401).json({ error: "Invalid PayPal Apple Pay vault webhook signature" });
      }
      const vaultId = event.resource?.id;
      const customerId = event.resource?.customer?.id;
      if (!vaultId || !customerId) {
        return res.status(200).json({ ignored: true, reason: "missing_vault_identity" });
      }

      const matches = await db
        .select({ id: payments.id })
        .from(payments)
        .where(and(
          eq(payments.paymentProvider, "paypal"),
          eq(payments.landingPage, "/masterclass"),
          eq(payments.status, "deposit_paid"),
          eq(payments.paypalVaultPaymentSource, "apple_pay"),
          eq(payments.paypalApplePayVaultStatus, "pending"),
          eq(payments.paypalCustomerId, customerId),
          isNull(payments.paypalVaultToken),
        ));

      if (matches.length !== 1) {
        return res.status(200).json({ ignored: true, reason: "unmatched_or_ambiguous_apple_pay_vault" });
      }

      await db.update(payments)
        .set({ paypalVaultToken: vaultId, paypalApplePayVaultStatus: "vaulted", updatedAt: new Date() })
        .where(eq(payments.id, matches[0].id));
      return res.status(200).json({ received: true, vaulted: true });
    }

    // Only handle capture completions
    if (event.event_type !== "PAYMENT.CAPTURE.COMPLETED") {
      return res.status(200).json({ ignored: true, event_type: event.event_type });
    }

    const resource = event.resource ?? {};
    const captureId = resource.id ?? "";
    const paymentIdStr = resource.custom_id ?? "";
    const amount = resource.amount?.value ?? "0";
    const currency = resource.amount?.currency_code ?? "USD";
    const paidAt = resource.create_time ?? new Date().toISOString();

    // Look up the payment record by paymentId embedded in custom_id
    const paymentId = parseInt(paymentIdStr, 10);
    if (!paymentId || isNaN(paymentId)) {
      console.warn("[PayPalWebhook] Missing or invalid custom_id:", paymentIdStr);
      return res.status(200).json({ ignored: true, reason: "no_custom_id" });
    }

    const paymentRows = await db
      .select()
      .from(payments)
      .where(eq(payments.id, paymentId))
      .limit(1);

    if (!paymentRows.length) {
      console.warn("[PayPalWebhook] Payment not found for id:", paymentId);
      return res.status(200).json({ ignored: true, reason: "payment_not_found" });
    }

    const payment = paymentRows[0];

    // Check allowed landing pages
    const landingPage = payment.landingPage ?? "";
    if (!WEBHOOK_CONFIG.ALLOWED_LANDING_PAGES.includes(landingPage)) {
      console.log(`[PayPalWebhook] Skipping non-eligible landing page: ${landingPage}`);
      return res.status(200).json({ ignored: true, reason: "landing_page_not_eligible" });
    }

    // Idempotency check — skip if already successfully sent
    const existing = await db
      .select()
      .from(paymentWebhookLog)
      .where(
        and(
          eq(paymentWebhookLog.transactionId, captureId),
          eq(paymentWebhookLog.success, 1)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      console.log(`[PayPalWebhook] Already processed capture ${captureId} — skipping`);
      return res.status(200).json({ skipped: true, reason: "already_processed" });
    }

    // Build GHL payload
    const nameParts = (payment.patientName ?? "").trim().split(/\s+/);
    const firstName = nameParts[0] ?? "";
    const lastName = nameParts.slice(1).join(" ");

    const payload: GhlPaymentPayload = {
      event: "payment_success",
      landing_page_path: landingPage,
      email: payment.patientEmail ?? "",
      phone: payment.patientPhone ?? "",
      first_name: firstName,
      last_name: lastName,
      form_submission_id: String(payment.id),
      payment_amount: amount,
      payment_currency: currency,
      payment_status: "succeeded",
      transaction_id: captureId,
      payment_processor: "paypal",
      product_name: "MedMethod Direct — Consultation Deposit",
      paid_at: paidAt,
    };

    // Attempt delivery with retries
    let lastResult = { ok: false, status: 0, body: "" };
    for (let attempt = 1; attempt <= WEBHOOK_CONFIG.MAX_ATTEMPTS; attempt++) {
      lastResult = await sendToGhl(payload, attempt);

      // Log each attempt
      await db.insert(paymentWebhookLog).values({
        transactionId: captureId,
        landingPagePath: landingPage,
        requestBody: JSON.stringify(payload),
        httpStatus: lastResult.status,
        responseBody: lastResult.body.slice(0, 2000),
        success: lastResult.ok ? 1 : 0,
        attemptNumber: attempt,
      });

      if (lastResult.ok) {
        console.log(
          `[PayPalWebhook] GHL delivery success on attempt ${attempt} for capture ${captureId}`
        );
        break;
      }

      console.warn(
        `[PayPalWebhook] GHL delivery failed (attempt ${attempt}/${WEBHOOK_CONFIG.MAX_ATTEMPTS}): ` +
          `HTTP ${lastResult.status} — ${lastResult.body.slice(0, 200)}`
      );

      if (attempt < WEBHOOK_CONFIG.MAX_ATTEMPTS) {
        await sleep(WEBHOOK_CONFIG.BACKOFF_BASE_MS * Math.pow(2, attempt - 1));
      }
    }

    return res.status(200).json({
      received: true,
      captureId,
      ghlDelivered: lastResult.ok,
      ghlStatus: lastResult.status,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[PayPalWebhook] Unhandled error:", msg);
    return res.status(500).json({ error: msg });
  }
}
