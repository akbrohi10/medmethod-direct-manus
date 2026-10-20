import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import type { Express, Request, Response } from "express";
import { z } from "zod";
import { getIntakeDeliverySettings, getPaypalSettings } from "./db";
import { decryptIntakeCredential } from "./intakeCredentialCrypto";
import { ENV } from "./_core/env";

const INTAKE_AMOUNT = "49.00";
const TOKEN_TTL_MS = 30 * 60 * 1000;
const DELIVERY_TIMEOUT_MS = 15_000;
const MAX_INTAKE_BYTES = 180_000;

type PayPalMode = "sandbox" | "live";

type ApprovalToken = {
  version: 1;
  submissionId: string;
  orderId: string;
  mode: PayPalMode;
  expiresAt: number;
};

const submissionSchema = z.object({
  intake: z.record(z.string(), z.unknown()),
  phone_verification_token: z.string().max(2048).nullable().optional(),
  payment_method: z.enum(["card", "apple_pay"]).optional(),
});

const couponCodeSchema = z.object({
  coupon_code: z.string().trim().min(1).max(64),
});

const waivedSubmissionSchema = submissionSchema.extend({
  coupon_code: z.string().trim().min(1).max(64),
});

/** Never expose or compare the private coupon value in browser code. */
export function isFamilyIntakeCoupon(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const expected = ENV.intakeFamilyCouponCode.trim().toLocaleLowerCase("en-US");
  const received = value.trim().toLocaleLowerCase("en-US");
  if (!expected || expected.length !== received.length) return false;
  return timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(received, "utf8"));
}

function getPayPalBaseUrl(mode: PayPalMode): string {
  return mode === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}

function paymentMode(settings: Awaited<ReturnType<typeof getPaypalSettings>>): PayPalMode {
  return settings?.mode === "live" ? "live" : "sandbox";
}

// The public demo URL is deliberately the only way to override the protected
// Admin Settings mode. Every normal intake request continues to use the mode
// selected by the administrator; demo requests are always non-live.
function paymentModeForRequest(
  settings: Awaited<ReturnType<typeof getPaypalSettings>>,
  request: Request,
): PayPalMode {
  return request.query.prefill === "demo" ? "sandbox" : paymentMode(settings);
}

function requireActivePayPal(settings: Awaited<ReturnType<typeof getPaypalSettings>>) {
  if (!settings || settings.activeProvider !== "paypal") {
    throw new Error("PayPal is not the enabled payment provider. An administrator must enable PayPal in Admin Settings before the intake can collect the $49.00 consultation fee.");
  }
}

async function getPayPalClient(mode: PayPalMode) {
  const settings = await getPaypalSettings();
  if (!settings) throw new Error("PayPal is not configured.");

  const clientId = mode === "live" ? settings.liveClientId : settings.sandboxClientId;
  const clientSecret = mode === "live" ? settings.liveClientSecret : settings.sandboxClientSecret;
  if (!clientId || !clientSecret) throw new Error(`PayPal ${mode} credentials are not configured.`);

  const tokenResponse = await fetch(`${getPayPalBaseUrl(mode)}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!tokenResponse.ok) throw new Error("PayPal authentication could not be completed.");

  const token = await tokenResponse.json() as { access_token?: string };
  if (!token.access_token) throw new Error("PayPal did not return an access token.");
  return { baseUrl: getPayPalBaseUrl(mode), token: token.access_token };
}

function tokenSecret(): string {
  if (!ENV.cookieSecret) throw new Error("Payment approval token signing is not configured.");
  return ENV.cookieSecret;
}

function encodeApprovalToken(payload: ApprovalToken): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", tokenSecret()).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function decodeApprovalToken(value: unknown): ApprovalToken {
  if (typeof value !== "string") throw new Error("Payment approval token is missing.");
  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) throw new Error("Payment approval token is invalid.");

  const expected = createHmac("sha256", tokenSecret()).update(encoded).digest("base64url");
  const expectedBytes = Buffer.from(expected);
  const signatureBytes = Buffer.from(signature);
  if (expectedBytes.length !== signatureBytes.length || !timingSafeEqual(expectedBytes, signatureBytes)) {
    throw new Error("Payment approval token is invalid.");
  }

  let payload: unknown;
  try {
    payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  } catch {
    throw new Error("Payment approval token is invalid.");
  }

  const parsed = z.object({
    version: z.literal(1),
    submissionId: z.string().uuid(),
    orderId: z.string().min(3).max(128),
    mode: z.enum(["sandbox", "live"]),
    expiresAt: z.number().int().positive(),
  }).safeParse(payload);
  if (!parsed.success || parsed.data.expiresAt < Date.now()) {
    throw new Error("Payment approval token has expired. Please start payment again.");
  }
  return parsed.data;
}

function cleanForDelivery(
  intake: Record<string, unknown>,
  submissionId: string,
  mode: PayPalMode,
  paymentMethod: "card" | "apple_pay" | "waived_family",
) {
  const { checkout_preview: _checkoutPreview, ...submitted } = intake;
  const isWaived = paymentMethod === "waived_family";
  const isTest = isWaived ? submitted.is_test === true : mode === "sandbox" || submitted.is_test === true;
  return {
    ...submitted,
    event: "mmd_intake.submitted",
    schema_version: "1.0",
    submission_id: submissionId,
    submitted_at: new Date().toISOString(),
    is_test: isTest,
    payment: {
      provider: isWaived ? "none" : "paypal",
      method: isWaived ? "coupon" : paymentMethod,
      mode: isWaived ? "waived" : mode,
      amount: isWaived ? "0.00" : INTAKE_AMOUNT,
      currency: "USD",
      status: isWaived ? "waived" : "pending",
      ...(isWaived ? { original_amount: INTAKE_AMOUNT, coupon_type: "family" } : {}),
    },
  };
}

async function deliverIntake(payload: Record<string, unknown>) {
  // The verified app secret is the intended primary destination. The admin
  // value remains available as a write-only encrypted fallback for future
  // rotation without ever exposing either URL to the browser.
  let endpoint = ENV.keragonWebhookUrl.trim();
  if (!endpoint) {
    const settings = await getIntakeDeliverySettings();
    if (settings?.keragonWebhookUrlEncrypted) {
      endpoint = decryptIntakeCredential(settings.keragonWebhookUrlEncrypted);
    }
  }
  if (!endpoint) {
    throw new Error("KERAGON_WEBHOOK_URL is not configured. An administrator must set the project secret or Intake Delivery setting before this intake can be submitted.");
  }
  const body = JSON.stringify(payload);
  if (Buffer.byteLength(body, "utf8") > MAX_INTAKE_BYTES) {
    throw new Error("This intake is too large to send securely. Please shorten any free-text answers and try again.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DELIVERY_TIMEOUT_MS);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body,
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("Keragon could not accept this intake. Your card has not been charged.");
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Keragon did not respond in time. Your card has not been charged.");
    }
    throw error instanceof Error ? error : new Error("Keragon could not accept this intake. Your card has not been charged.");
  } finally {
    clearTimeout(timeout);
  }
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unable to process the intake payment. Please try again.";
}

export function registerIntakePaymentRoutes(app: Express) {
  // Coupon validation returns only eligibility. The code itself remains server-only
  // and is revalidated before the waived intake is delivered.
  app.post("/api/intake/coupon/validate", (req: Request, res: Response) => {
    const parsed = couponCodeSchema.safeParse(req.body);
    if (!parsed.success || !isFamilyIntakeCoupon(parsed.data.coupon_code)) {
      return res.status(422).json({ valid: false, error: "That coupon code is not valid." });
    }
    res.setHeader("Cache-Control", "no-store");
    return res.json({ valid: true, amount: "0.00", status: "waived" });
  });

  // The free path is intentionally independent of PayPal. It preserves the
  // no-database-storage boundary and delivers the normal sanitized payload once.
  app.post("/api/intake/coupon/submit", async (req: Request, res: Response) => {
    try {
      const parsed = waivedSubmissionSchema.safeParse(req.body);
      if (!parsed.success || !isFamilyIntakeCoupon(parsed.success ? parsed.data.coupon_code : undefined)) {
        return res.status(422).json({ error: "That coupon code is not valid." });
      }
      const submissionId = randomUUID();
      // A waived submission must remain usable even if PayPal is disabled or not
      // configured. The waived payload does not retain this placeholder mode.
      const deliveryPayload = cleanForDelivery(parsed.data.intake, submissionId, "sandbox", "waived_family");
      await deliverIntake(deliveryPayload);
      return res.status(201).json({ submission_id: submissionId, payment_status: "WAIVED", amount: "0.00" });
    } catch (error) {
      return res.status(422).json({ error: errorMessage(error).replace("Your card has not been charged.", "No payment was processed.") });
    }
  });

  app.get("/api/paypal/client-token", async (_req: Request, res: Response) => {
    try {
      const settings = await getPaypalSettings();
      requireActivePayPal(settings);
      if (!settings) throw new Error("PayPal is not configured.");
      const mode = paymentModeForRequest(settings, _req);
      // PayPal Web SDK v6 accepts a browser-safe public Client ID directly. The
      // opaque value from /v1/identity/generate-token is not a JWT and is rejected
      // by createInstance() for Advanced Card Fields.
      const clientId = mode === "live" ? settings.liveClientId : settings.sandboxClientId;
      if (!clientId) throw new Error(`PayPal ${mode} Client ID is not configured.`);
      res.json({ client_id: clientId, environment: mode });
    } catch (error) {
      res.status(503).json({ error: errorMessage(error) });
    }
  });

  // Intentionally does not read settings, deliver an intake, create a PayPal
  // order, or expose request contents. It allows safe verification that a
  // deployment accepts JSON POST bodies before a real checkout is attempted.
  app.post("/api/paypal/orders/preflight", (req: Request, res: Response) => {
    const receivedBytes = Buffer.byteLength(JSON.stringify(req.body ?? {}), "utf8");
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ ok: true, received_bytes: receivedBytes, max_intake_bytes: MAX_INTAKE_BYTES });
  });

  app.post("/api/paypal/orders", async (req: Request, res: Response) => {
    try {
      const parsed = submissionSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "The completed intake payload is invalid." });

      const settings = await getPaypalSettings();
      requireActivePayPal(settings);
      const mode = paymentModeForRequest(settings, req);
      const paymentMethod = parsed.data.payment_method === "apple_pay" ? "apple_pay" : "card";
      const submissionId = randomUUID();
      const deliveryPayload = cleanForDelivery(parsed.data.intake, submissionId, mode, paymentMethod);

      // Explicit owner-approved sequence: deliver the completed intake before payment.
      // No intake payload is persisted by this server.
      await deliverIntake(deliveryPayload);

      const client = await getPayPalClient(mode);
      const orderResponse = await fetch(`${client.baseUrl}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${client.token}`,
          "Content-Type": "application/json",
          "PayPal-Request-Id": `mmd-intake-${submissionId}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [{
            amount: { currency_code: "USD", value: INTAKE_AMOUNT },
            description: "MedMethod Direct — $49 intake consultation",
            custom_id: submissionId,
          }],
          // Apple Pay supplies its encrypted payment token through PayPal v6's
          // confirmOrder call. Card Fields still need the card source declaration.
          ...(paymentMethod === "card"
            ? {
              payment_source: {
                card: {
                  attributes: {
                    verification: { method: "SCA_WHEN_REQUIRED" },
                  },
                },
              },
            }
            : {}),
        }),
      });
      if (!orderResponse.ok) throw new Error("PayPal could not prepare the $49.00 card payment. Your intake was delivered but your card was not charged.");

      const order = await orderResponse.json() as { id?: string; links?: Array<{ rel?: string; href?: string }> };
      if (!order.id) throw new Error("PayPal did not return a payment order. Your card was not charged.");
      const approvalUrl = order.links?.find((link) => link.rel === "approve")?.href ?? "";
      const approvalToken = encodeApprovalToken({ version: 1, submissionId, orderId: order.id, mode, expiresAt: Date.now() + TOKEN_TTL_MS });
      res.status(201).json({
        order_id: order.id,
        approval_url: approvalUrl,
        approval_token: approvalToken,
        environment: mode,
        payment_method: paymentMethod,
      });
    } catch (error) {
      // A 5xx response from this route is replaced by the production proxy's
      // generic gateway page. These are handled checkout validation/delivery
      // failures, so return a non-gateway status and preserve the safe message.
      res.status(422).json({ error: errorMessage(error) });
    }
  });

  app.post("/api/paypal/orders/:orderId/capture", async (req: Request, res: Response) => {
    try {
      const orderId = z.string().min(3).max(128).regex(/^[A-Za-z0-9-]+$/).parse(req.params.orderId);
      const approval = decodeApprovalToken(req.body?.approval_token);
      if (approval.orderId !== orderId) return res.status(400).json({ error: "Payment approval does not match this order." });

      const client = await getPayPalClient(approval.mode);
      const captureResponse = await fetch(`${client.baseUrl}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${client.token}`,
          "Content-Type": "application/json",
          "PayPal-Request-Id": `mmd-intake-capture-${orderId}`,
        },
      });
      if (!captureResponse.ok) throw new Error("PayPal could not confirm the card payment. Please check the card details and try again.");

      const capture = await captureResponse.json() as { status?: string; id?: string; purchase_units?: Array<{ payments?: { captures?: Array<{ id?: string }> } }> };
      if (capture.status !== "COMPLETED") throw new Error("PayPal did not complete the card payment.");
      const captureId = capture.purchase_units?.[0]?.payments?.captures?.[0]?.id ?? capture.id ?? orderId;
      res.json({ submission_id: approval.submissionId, payment_status: "COMPLETED", capture_id: captureId, environment: approval.mode });
    } catch (error) {
      res.status(400).json({ error: errorMessage(error) });
    }
  });
}
