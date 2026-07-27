/**
 * Stripe Payment Webhook Handler
 *
 * Fires ONLY for successful payments originating from /lp/glp1 or /lp/hrt3.
 * On a successful payment_intent.succeeded event, this handler:
 *   1. Verifies the Stripe webhook signature (when STRIPE_WEBHOOK_SECRET is set).
 *   2. Checks that the payment's landingPage metadata is "/lp/glp1" or "/lp/hrt3".
 *   3. Checks idempotency — skips if this transaction_id was already successfully sent.
 *   4. Builds a flat JSON payload and POSTs it to the GHL inbound webhook URL.
 *   5. Retries up to 3 times with exponential backoff on non-2xx responses.
 *   6. Logs every attempt (request body, HTTP status, response body) to payment_webhook_log.
 *
 * ─── Configuration ───────────────────────────────────────────────────────────
 * GHL_PAYMENT_WEBHOOK_URL  — GoHighLevel inbound webhook URL (required)
 * STRIPE_WEBHOOK_SECRET    — Stripe webhook signing secret (optional in dev,
 *                            strongly recommended in production)
 *
 * Both values live in server/stripePaymentWebhook.ts (this file) under
 * WEBHOOK_CONFIG so the owner can update the GHL URL in one place.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Setup in Stripe Dashboard:
 *   Developers → Webhooks → Add endpoint
 *   URL: https://medmethoddirect.com/api/webhooks/stripe-payment
 *   Events to listen for: payment_intent.succeeded
 *
 * Do NOT modify the existing intake-form webhook or /api/ghl/booking-confirmed.
 */

import { Request, Response } from "express";
import Stripe from "stripe";
import { getDb } from "./db";
import { paymentWebhookLog } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

// ─── Configuration — update GHL_PAYMENT_WEBHOOK_URL here to change destination ──
export const WEBHOOK_CONFIG = {
  /**
   * GoHighLevel inbound webhook URL for payment success events.
   * Update this value to change the destination without touching any other code.
   */
  GHL_PAYMENT_WEBHOOK_URL:
    process.env.GHL_PAYMENT_WEBHOOK_URL ??
    "https://services.leadconnectorhq.com/hooks/cFQraxSJv1aDKQFAghbI/webhook-trigger/d37a2de2-c00f-40ed-bb00-a8efa3127093",

  /**
   * Stripe webhook signing secret — set via STRIPE_WEBHOOK_SECRET env var.
   * When set, every incoming request is signature-verified before processing.
   * Strongly recommended in production.
   */
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ?? "",

  /**
   * Landing pages that are eligible to trigger the payment webhook.
   * Only payments whose Stripe metadata.landingPage matches one of these
   * values will be forwarded to GHL. All other payments are silently ignored.
   */
  ALLOWED_LANDING_PAGES: ["/lp/glp1", "/lp/hrt3"] as string[],

  /** Maximum number of delivery attempts per transaction_id */
  MAX_ATTEMPTS: 3,

  /** Base delay in ms for exponential backoff (attempt 1 → 1s, 2 → 2s, 3 → 4s) */
  BACKOFF_BASE_MS: 1000,
};

// ─── Types ────────────────────────────────────────────────────────────────────

/** Flat GHL payload — all fields always present, empty string when unknown */
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

/** Sleep for `ms` milliseconds */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Normalise a Stripe landingPage metadata value to a canonical path.
 * Stripe metadata stores values like "glp1", "hrt3", "/lp/glp1", "lp/glp1".
 * We normalise all variants to "/lp/glp1" or "/lp/hrt3".
 */
function normaliseLandingPage(raw: string | null | undefined): string {
  if (!raw) return "";
  const s = raw.trim().toLowerCase();
  if (s === "glp1" || s === "lp/glp1" || s === "/lp/glp1") return "/lp/glp1";
  if (s === "hrt3" || s === "lp/hrt3" || s === "/lp/hrt3") return "/lp/hrt3";
  // Also handle older landing page slugs that map to these two paths
  if (s.includes("glp1") || s.includes("glp-1")) return "/lp/glp1";
  if (s.includes("hrt3") || s.includes("hrt-3")) return "/lp/hrt3";
  return "";
}

/**
 * Split a full name into first and last name.
 * Returns { firstName, lastName } — lastName may be empty for single-word names.
 */
function splitName(fullName: string | null | undefined): { firstName: string; lastName: string } {
  if (!fullName) return { firstName: "", lastName: "" };
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ");
  return { firstName, lastName };
}

/**
 * Check whether this transaction_id was already successfully delivered.
 * Returns true if a success=1 row exists for this transaction_id.
 */
async function isAlreadyDelivered(transactionId: string): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;
    const rows = await db
      .select({ id: paymentWebhookLog.id })
      .from(paymentWebhookLog)
      .where(
        and(
          eq(paymentWebhookLog.transactionId, transactionId),
          eq(paymentWebhookLog.success, 1)
        )
      )
      .limit(1);
    return rows.length > 0;
  } catch (err) {
    console.error("[PaymentWebhook] isAlreadyDelivered DB error:", err);
    return false;
  }
}

/**
 * Log one delivery attempt to the payment_webhook_log table.
 */
async function logAttempt(params: {
  transactionId: string;
  landingPagePath: string;
  attemptNumber: number;
  requestBody: string;
  httpStatus: number;
  responseBody: string | null;
  errorMessage: string | null;
  success: boolean;
}): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;
    await db.insert(paymentWebhookLog).values({
      transactionId: params.transactionId,
      landingPagePath: params.landingPagePath,
      attemptNumber: params.attemptNumber,
      requestBody: params.requestBody,
      httpStatus: params.httpStatus,
      responseBody: params.responseBody
        ? params.responseBody.slice(0, 2000)
        : null,
      errorMessage: params.errorMessage,
      success: params.success ? 1 : 0,
    });
  } catch (err) {
    console.error("[PaymentWebhook] logAttempt DB error:", err);
  }
}

/**
 * POST the GHL payload with exponential backoff retry.
 * Logs every attempt to the DB.
 */
async function deliverToGhl(
  payload: GhlPaymentPayload,
  transactionId: string,
  landingPagePath: string
): Promise<void> {
  const url = WEBHOOK_CONFIG.GHL_PAYMENT_WEBHOOK_URL;
  const bodyStr = JSON.stringify(payload);

  for (let attempt = 1; attempt <= WEBHOOK_CONFIG.MAX_ATTEMPTS; attempt++) {
    let httpStatus = 0;
    let responseBody: string | null = null;
    let errorMessage: string | null = null;
    let success = false;

    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: bodyStr,
        signal: AbortSignal.timeout(15_000), // 15s timeout per attempt
      });

      httpStatus = resp.status;
      responseBody = await resp.text().catch(() => null);
      success = resp.ok; // 2xx

      console.log(
        `[PaymentWebhook] Attempt ${attempt}/${WEBHOOK_CONFIG.MAX_ATTEMPTS} → HTTP ${httpStatus} | txn: ${transactionId} | path: ${landingPagePath}`
      );
    } catch (err: unknown) {
      errorMessage = err instanceof Error ? err.message : String(err);
      console.error(
        `[PaymentWebhook] Attempt ${attempt}/${WEBHOOK_CONFIG.MAX_ATTEMPTS} network error | txn: ${transactionId}:`,
        errorMessage
      );
    }

    await logAttempt({
      transactionId,
      landingPagePath,
      attemptNumber: attempt,
      requestBody: bodyStr,
      httpStatus,
      responseBody,
      errorMessage,
      success,
    });

    if (success) {
      console.log(`[PaymentWebhook] Delivered successfully on attempt ${attempt} | txn: ${transactionId}`);
      return;
    }

    if (attempt < WEBHOOK_CONFIG.MAX_ATTEMPTS) {
      const delay = WEBHOOK_CONFIG.BACKOFF_BASE_MS * Math.pow(2, attempt - 1);
      console.log(`[PaymentWebhook] Retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }

  console.error(
    `[PaymentWebhook] All ${WEBHOOK_CONFIG.MAX_ATTEMPTS} attempts failed for txn: ${transactionId}`
  );
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

/**
 * Express route handler for POST /api/webhooks/stripe-payment
 *
 * IMPORTANT: This route must be registered BEFORE express.json() middleware
 * so that the raw body is available for Stripe signature verification.
 * See server/_core/index.ts for the registration order.
 */
export async function stripePaymentWebhookHandler(
  req: Request,
  res: Response
): Promise<void> {
  // ── 1. Parse and verify the Stripe event ────────────────────────────────────
  let event: Stripe.Event;

  const webhookSecret = WEBHOOK_CONFIG.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers["stripe-signature"];

  if (webhookSecret && sig) {
    // Signature verification — requires raw body buffer
    // The route is registered with express.raw() so req.body is a Buffer here.
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_LIVE ?? process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder", {
        apiVersion: "2026-06-24.dahlia",
      });
      event = stripe.webhooks.constructEvent(
        req.body as Buffer,
        sig as string,
        webhookSecret
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[PaymentWebhook] Signature verification failed: ${msg}`);
      res.status(400).json({ error: `Webhook signature verification failed: ${msg}` });
      return;
    }
  } else {
    // No secret configured — parse JSON directly (dev/test mode)
    try {
      event = (typeof req.body === "string" ? JSON.parse(req.body) : req.body) as Stripe.Event;
    } catch {
      res.status(400).json({ error: "Invalid JSON body" });
      return;
    }
    if (!webhookSecret) {
      console.warn("[PaymentWebhook] STRIPE_WEBHOOK_SECRET not set — skipping signature verification (dev mode)");
    }
  }

  // ── 2. Only handle payment_intent.succeeded ──────────────────────────────────
  if (event.type !== "payment_intent.succeeded") {
    // Acknowledge other events without processing them
    res.status(200).json({ received: true, processed: false, reason: "event_type_not_handled" });
    return;
  }

  const pi = event.data.object as Stripe.PaymentIntent;
  const metadata = pi.metadata ?? {};

  // ── 3. Check landing page scope ──────────────────────────────────────────────
  const rawLandingPage = metadata.landingPage ?? metadata.landing_page ?? "";
  const landingPagePath = normaliseLandingPage(rawLandingPage);

  if (!WEBHOOK_CONFIG.ALLOWED_LANDING_PAGES.includes(landingPagePath)) {
    console.log(
      `[PaymentWebhook] Ignoring payment_intent.succeeded — landingPage "${rawLandingPage}" is not in allowed list. PI: ${pi.id}`
    );
    res.status(200).json({ received: true, processed: false, reason: "landing_page_not_in_scope" });
    return;
  }

  const transactionId = pi.id;

  // ── 4. Idempotency check ─────────────────────────────────────────────────────
  const alreadyDelivered = await isAlreadyDelivered(transactionId);
  if (alreadyDelivered) {
    console.log(`[PaymentWebhook] Duplicate event — already delivered for txn: ${transactionId}. Skipping.`);
    res.status(200).json({ received: true, processed: false, reason: "already_delivered" });
    return;
  }

  // ── 5. Build flat GHL payload ────────────────────────────────────────────────
  const patientName = metadata.patientName ?? "";
  const { firstName, lastName } = splitName(patientName);
  const email = metadata.patientEmail ?? pi.receipt_email ?? "";
  const phone = metadata.patientPhone ?? "";
  const formSubmissionId = metadata.paymentId ?? metadata.form_submission_id ?? "";
  const amountCents = pi.amount_received ?? pi.amount ?? 0;
  const paymentAmountStr = amountCents > 0 ? (amountCents / 100).toFixed(2) : "";
  const currency = (pi.currency ?? "usd").toUpperCase();
  const paidAt = pi.created ? new Date(pi.created * 1000).toISOString() : "";
  const productName = pi.description ?? "";

  const payload: GhlPaymentPayload = {
    event: "payment_success",
    landing_page_path: landingPagePath,
    email,
    phone,
    first_name: firstName,
    last_name: lastName,
    form_submission_id: String(formSubmissionId),
    payment_amount: paymentAmountStr,
    payment_currency: currency,
    payment_status: "succeeded",
    transaction_id: transactionId,
    payment_processor: "stripe",
    product_name: productName,
    paid_at: paidAt,
  };

  console.log(`[PaymentWebhook] Processing payment_intent.succeeded | txn: ${transactionId} | path: ${landingPagePath} | email: ${email}`);

  // Respond to Stripe immediately — do not block on GHL delivery
  res.status(200).json({ received: true, processed: true });

  // ── 6. Deliver to GHL with retry (async, after response) ────────────────────
  deliverToGhl(payload, transactionId, landingPagePath).catch((err: unknown) => {
    console.error("[PaymentWebhook] Unhandled error in deliverToGhl:", err);
  });
}
