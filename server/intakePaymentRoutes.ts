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

function getPayPalBaseUrl(mode: PayPalMode): string {
  return mode === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}

function paymentMode(settings: Awaited<ReturnType<typeof getPaypalSettings>>): PayPalMode {
  return settings?.mode === "live" ? "live" : "sandbox";
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
  paymentMethod: "card" | "apple_pay",
) {
  const { checkout_preview: _checkoutPreview, ...submitted } = intake;
  const isTest = mode === "sandbox" || submitted.is_test === true;
  return {
    ...submitted,
    event: "mmd_intake.submitted",
    schema_version: "1.0",
    submission_id: submissionId,
    submitted_at: new Date().toISOString(),
    is_test: isTest,
    payment: {
      provider: "paypal",
      method: paymentMethod,
      mode,
      amount: INTAKE_AMOUNT,
      currency: "USD",
      status: "pending",
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
  app.get("/api/paypal/client-token", async (_req: Request, res: Response) => {
    try {
      const settings = await getPaypalSettings();
      requireActivePayPal(settings);
      if (!settings) throw new Error("PayPal is not configured.");
      const mode = paymentMode(settings);
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
      const mode = paymentMode(settings);
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
