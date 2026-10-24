import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createPayment,
  getPaymentById,
  getPaypalSettings,
  getStripeSettings,
  updatePayment,
} from "../db";
import { ENV } from "../_core/env";
import { publicProcedure, router } from "../_core/trpc";
import { getPayPalClient, type PayPalMode } from "./paypal";
import { getStripeClientForMode } from "./stripe";

/**
 * Dedicated one-time checkout for /masterclass2.
 *
 * This is intentionally separate from the legacy consultation deposit routers:
 * it never creates a customer, vaults a payment method, sets future usage, or
 * schedules a balance. The existing payments table supplies the one-time ledger
 * row without requiring a schema change.
 */
export const MASTERCLASS_VIDEO_PAYMENT = {
  source: "/masterclass2" as const,
  amountCents: 3900,
  amountUsd: "39.00",
  paypalDescription: "MedMethod Direct — Masterclass Video — $39.00 one-time purchase",
  stripeDescription: "MedMethod Direct — Masterclass Video — $39.00 one-time purchase",
  stripePurpose: "masterclass_video_one_time_39_usd",
  finalStatus: "fully_paid" as const,
};

type Provider = "paypal" | "stripe";
type CheckoutMode = "sandbox" | "live" | "test";

type CheckoutTokenPayload = {
  v: 1;
  kind: "checkout";
  paymentId: number;
  checkoutId: string;
  provider: Provider;
  mode: CheckoutMode;
  providerId: string;
  source: typeof MASTERCLASS_VIDEO_PAYMENT.source;
  exp: number;
};

type ProviderBindingPayload = {
  v: 1;
  kind: "provider_binding";
  paymentId: number;
  checkoutId: string;
  provider: Provider;
  mode: CheckoutMode;
  source: typeof MASTERCLASS_VIDEO_PAYMENT.source;
};

type SignedPayload = CheckoutTokenPayload | ProviderBindingPayload;

type CheckoutCreateResult =
  | { orderId: string; checkout_token: string }
  | { paymentIntentId: string; clientSecret: string; checkout_token: string };

type IdempotencyEntry = {
  contactFingerprint: string;
  expiresAt: number;
  result: Promise<CheckoutCreateResult>;
};

const CHECKOUT_TTL_MS = 30 * 60 * 1000;
const MAX_CACHED_CHECKOUTS = 500;
// A dedicated secret takes precedence, with the configured JWT/cookie secret as the
// durable default. Development may use a process-local fallback; production may not.
const checkoutTokenSecret = process.env.MASTERCLASS_VIDEO_CHECKOUT_TOKEN_SECRET
  || ENV.cookieSecret
  || (ENV.isProduction ? undefined : randomBytes(32).toString("base64url"));
const checkoutCreates = new Map<string, IdempotencyEntry>();

const contactSchema = z.object({
  checkout_id: z.string().uuid(),
  patientName: z.string().trim().min(1).max(255),
  patientEmail: z.string().trim().email().max(320),
  patientPhone: z.string().trim().min(1).max(32),
});

const paypalCreateSchema = contactSchema.extend({
  payment_method: z.enum(["card", "apple_pay"]),
});

function fail(code: "BAD_REQUEST" | "CONFLICT" | "NOT_FOUND" | "PRECONDITION_FAILED" | "INTERNAL_SERVER_ERROR", message: string): never {
  throw new TRPCError({ code, message });
}

function requireCheckoutTokenSecret(): string {
  if (!checkoutTokenSecret) {
    fail("PRECONDITION_FAILED", "Checkout token signing is not configured.");
  }
  return checkoutTokenSecret;
}

function b64url(value: string): string {
  return Buffer.from(value).toString("base64url");
}

function sign(value: string): string {
  return createHmac("sha256", requireCheckoutTokenSecret()).update(value).digest("base64url");
}

function signPayload(payload: SignedPayload): string {
  const body = b64url(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

function readSignedPayload(token: string): SignedPayload {
  const [body, suppliedSignature, ...extra] = token.split(".");
  if (!body || !suppliedSignature || extra.length > 0) {
    return fail("BAD_REQUEST", "Invalid checkout token.");
  }

  const expectedSignature = sign(body);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return fail("BAD_REQUEST", "Invalid checkout token.");
  }

  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SignedPayload;
    if (parsed.v !== 1 || !parsed.kind || parsed.source !== MASTERCLASS_VIDEO_PAYMENT.source) {
      return fail("BAD_REQUEST", "Invalid checkout token.");
    }
    return parsed;
  } catch {
    return fail("BAD_REQUEST", "Invalid checkout token.");
  }
}

function makeProviderBinding(input: Omit<ProviderBindingPayload, "v" | "kind">): string {
  return signPayload({ v: 1, kind: "provider_binding", ...input });
}

function makeCheckoutToken(input: Omit<CheckoutTokenPayload, "v" | "kind" | "exp">): string {
  return signPayload({
    v: 1,
    kind: "checkout",
    ...input,
    exp: Math.floor((Date.now() + CHECKOUT_TTL_MS) / 1000),
  });
}

function requireCheckoutToken(input: {
  token: string;
  provider: Provider;
  providerId: string;
}): CheckoutTokenPayload {
  const payload = readSignedPayload(input.token);
  if (payload.kind !== "checkout" || payload.exp < Math.floor(Date.now() / 1000)) {
    return fail("BAD_REQUEST", "Checkout token has expired or is invalid.");
  }
  if (payload.provider !== input.provider || payload.providerId !== input.providerId) {
    return fail("BAD_REQUEST", "Checkout token does not match this payment.");
  }
  return payload;
}

function contactFingerprint(input: {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  paymentMethod?: "card" | "apple_pay";
}): string {
  // Retain only an HMAC in the bounded process cache; never log contact details.
  return createHmac("sha256", requireCheckoutTokenSecret())
    .update(JSON.stringify({
      name: input.patientName.trim(),
      email: input.patientEmail.trim().toLowerCase(),
      phone: input.patientPhone.trim(),
      method: input.paymentMethod ?? null,
    }))
    .digest("base64url");
}

function clearExpiredCheckouts(): void {
  const now = Date.now();
  for (const [key, entry] of Array.from(checkoutCreates.entries())) {
    if (entry.expiresAt < now) checkoutCreates.delete(key);
  }
  while (checkoutCreates.size >= MAX_CACHED_CHECKOUTS) {
    const oldestKey = checkoutCreates.keys().next().value as string | undefined;
    if (!oldestKey) break;
    checkoutCreates.delete(oldestKey);
  }
}

async function createIdempotently<T extends CheckoutCreateResult>(input: {
  provider: Provider;
  checkoutId: string;
  fingerprint: string;
  create: () => Promise<T>;
}): Promise<T> {
  clearExpiredCheckouts();
  const key = `${input.provider}:${input.checkoutId}`;
  const existing = checkoutCreates.get(key);
  if (existing) {
    if (existing.contactFingerprint !== input.fingerprint) {
      return fail("CONFLICT", "This checkout ID is already associated with different contact details.");
    }
    return existing.result as Promise<T>;
  }

  const result = input.create();
  checkoutCreates.set(key, {
    contactFingerprint: input.fingerprint,
    expiresAt: Date.now() + CHECKOUT_TTL_MS,
    result,
  });

  try {
    return await result;
  } catch (error) {
    // A failed creation has no successful checkout to replay.
    checkoutCreates.delete(key);
    throw error;
  }
}

function assertOneTimeMasterclassRecord(payment: {
  landingPage: string | null;
  paymentProvider: Provider;
  consultationTotalAmount: number;
  depositAmount: number;
  remainingAmount: number;
}): void {
  if (
    payment.landingPage !== MASTERCLASS_VIDEO_PAYMENT.source
    || payment.consultationTotalAmount !== MASTERCLASS_VIDEO_PAYMENT.amountCents
    || payment.depositAmount !== MASTERCLASS_VIDEO_PAYMENT.amountCents
    || payment.remainingAmount !== 0
  ) {
    fail("BAD_REQUEST", "Payment is not the expected one-time masterclass video checkout.");
  }
}

function assertPayPalOrderShape(order: unknown, paymentId: number, expectedOrderId: string, requireCompleted: boolean): void {
  const typed = order as {
    id?: string;
    status?: string;
    purchase_units?: Array<{
      custom_id?: string;
      description?: string;
      amount?: { currency_code?: string; value?: string };
      payments?: { captures?: Array<{ id?: string; status?: string; amount?: { currency_code?: string; value?: string } }> };
    }>;
  };
  if (typed.id !== expectedOrderId) {
    fail("BAD_REQUEST", "PayPal returned an order ID that does not match this checkout.");
  }
  const units = typed.purchase_units;
  if (!units || units.length !== 1) {
    fail("BAD_REQUEST", "PayPal order does not contain the expected purchase unit.");
  }
  const unit = units[0];
  if (
    unit.custom_id !== `masterclass-video:${paymentId}`
    || unit.description !== MASTERCLASS_VIDEO_PAYMENT.paypalDescription
    || unit.amount?.currency_code !== "USD"
    || unit.amount?.value !== MASTERCLASS_VIDEO_PAYMENT.amountUsd
  ) {
    fail("BAD_REQUEST", "PayPal order does not match the expected masterclass video purchase.");
  }

  if (!requireCompleted) return;
  if (typed.status !== "COMPLETED") {
    fail("BAD_REQUEST", "PayPal order is not completed.");
  }
  const captures = unit.payments?.captures;
  if (!captures || captures.length !== 1) {
    fail("BAD_REQUEST", "PayPal order must have one completed capture.");
  }
  const capture = captures[0];
  if (
    !capture.id
    || capture.status !== "COMPLETED"
    || capture.amount?.currency_code !== "USD"
    || capture.amount?.value !== MASTERCLASS_VIDEO_PAYMENT.amountUsd
  ) {
    fail("BAD_REQUEST", "PayPal capture does not match the exact one-time $39.00 purchase.");
  }
}

async function getPayPalOrder(client: { baseUrl: string; token: string }, orderId: string): Promise<unknown> {
  const response = await fetch(`${client.baseUrl}/v2/checkout/orders/${encodeURIComponent(orderId)}`, {
    headers: { Authorization: `Bearer ${client.token}` },
  });
  if (!response.ok) {
    fail("INTERNAL_SERVER_ERROR", "Unable to verify the PayPal order.");
  }
  return response.json();
}

async function getActiveProvider(): Promise<Provider> {
  const settings = await getPaypalSettings();
  return settings?.activeProvider ?? "stripe";
}

async function requireActivePayPalConfiguration(): Promise<{ mode: PayPalMode }> {
  const settings = await getPaypalSettings();
  if (!settings || settings.activeProvider !== "paypal") {
    fail("PRECONDITION_FAILED", "PayPal is not the active payment provider.");
  }
  const mode = settings.mode ?? "sandbox";
  const clientId = mode === "live" ? settings.liveClientId : settings.sandboxClientId;
  const clientSecret = mode === "live" ? settings.liveClientSecret : settings.sandboxClientSecret;
  if (!clientId || !clientSecret) {
    fail("PRECONDITION_FAILED", `PayPal ${mode} credentials are not configured.`);
  }
  return { mode };
}

async function requireActiveStripeConfiguration(): Promise<{ mode: "test" | "live" }> {
  if (await getActiveProvider() !== "stripe") {
    fail("PRECONDITION_FAILED", "Stripe is not the active payment provider.");
  }
  const settings = await getStripeSettings();
  if (!settings) {
    fail("PRECONDITION_FAILED", "Stripe is not configured.");
  }
  const mode = settings.mode ?? "test";
  const secretKey = mode === "live" ? settings.liveSecretKey : settings.testSecretKey;
  const publicKey = mode === "live" ? settings.livePublishableKey : settings.testPublishableKey;
  if (!secretKey || !publicKey) {
    fail("PRECONDITION_FAILED", `Stripe ${mode} credentials are not configured.`);
  }
  return { mode };
}

export const masterclassVideoRouter = router({
  /** Public, non-secret setup configuration for the selected checkout provider. */
  config: publicProcedure.query(async () => {
    const activeProvider = await getActiveProvider();
    if (activeProvider === "paypal") {
      const settings = await getPaypalSettings();
      const mode = settings?.mode ?? "sandbox";
      const clientId = mode === "live" ? settings?.liveClientId : settings?.sandboxClientId;
      const clientSecret = mode === "live" ? settings?.liveClientSecret : settings?.sandboxClientSecret;
      return {
        activeProvider,
        mode,
        // `clientId`/`publishableKey` are deliberately stable across providers so
        // the isolated frontend component has one public config contract.
        clientId: clientId && clientSecret ? clientId : null,
        publishableKey: null,
      };
    }

    const settings = await getStripeSettings();
    const mode = settings?.mode ?? "test";
    const publicKey = mode === "live" ? settings?.livePublishableKey : settings?.testPublishableKey;
    const secretKey = mode === "live" ? settings?.liveSecretKey : settings?.testSecretKey;
    return {
      activeProvider,
      mode,
      clientId: null,
      publishableKey: publicKey && secretKey ? publicKey : null,
    };
  }),

  /** Creates a non-vaulted $39.00 PayPal Card Fields or eligible Apple Pay order. */
  createPaypalOrder: publicProcedure
    .input(paypalCreateSchema)
    .mutation(async ({ input }) => {
      // Fail before any provider or payment-record creation when production lacks
      // either the dedicated secret or the stable JWT/cookie-secret fallback.
      requireCheckoutTokenSecret();
      const { mode } = await requireActivePayPalConfiguration();
      const fingerprint = contactFingerprint({
        patientName: input.patientName,
        patientEmail: input.patientEmail,
        patientPhone: input.patientPhone,
        paymentMethod: input.payment_method,
      });

      return createIdempotently({
        provider: "paypal",
        checkoutId: input.checkout_id,
        fingerprint,
        create: async () => {
          const client = await getPayPalClient(mode);
          if (!client) {
            fail("PRECONDITION_FAILED", `PayPal ${mode} credentials are not configured.`);
          }

          const paymentId = await createPayment({
            patientName: input.patientName,
            patientEmail: input.patientEmail,
            patientPhone: input.patientPhone,
            consultationTotalAmount: MASTERCLASS_VIDEO_PAYMENT.amountCents,
            depositAmount: MASTERCLASS_VIDEO_PAYMENT.amountCents,
            remainingAmount: 0,
            referralCreditAmount: 0,
            status: "pending",
            landingPage: MASTERCLASS_VIDEO_PAYMENT.source,
            paymentProvider: "paypal",
            paypalMode: mode,
            stripeMode: "test", // Required non-null legacy column; unused for PayPal.
          });

          const response = await fetch(`${client.baseUrl}/v2/checkout/orders`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${client.token}`,
              "Content-Type": "application/json",
              // Client checkout UUID makes retries idempotent at PayPal as well.
              "PayPal-Request-Id": `masterclass-video-${input.checkout_id}`,
              Prefer: "return=representation",
            },
            body: JSON.stringify({
              intent: "CAPTURE",
              purchase_units: [{
                amount: { currency_code: "USD", value: MASTERCLASS_VIDEO_PAYMENT.amountUsd },
                description: MASTERCLASS_VIDEO_PAYMENT.paypalDescription,
                custom_id: `masterclass-video:${paymentId}`,
              }],
              // Card Fields explicitly use card verification. Apple Pay is intentionally
              // left to the eligible buyer-present PayPal Apple Pay SDK flow; there is no
              // vault, stored credential, customer, or future-use instruction in either path.
              ...(input.payment_method === "card" ? {
                payment_source: {
                  card: { attributes: { verification: { method: "SCA_WHEN_REQUIRED" } } },
                },
              } : {}),
            }),
          });
          if (!response.ok) {
            fail("INTERNAL_SERVER_ERROR", "Unable to create the PayPal order.");
          }
          const order = await response.json() as { id?: string };
          if (!order.id) {
            fail("INTERNAL_SERVER_ERROR", "PayPal did not return an order ID.");
          }

          await updatePayment(paymentId, { paypalOrderId: order.id });
          return {
            orderId: order.id,
            checkout_token: makeCheckoutToken({
              paymentId,
              checkoutId: input.checkout_id,
              provider: "paypal",
              mode,
              providerId: order.id,
              source: MASTERCLASS_VIDEO_PAYMENT.source,
            }),
          };
        },
      });
    }),

  /** Captures (or safely re-verifies) the exact bound PayPal one-time order. */
  capturePaypalOrder: publicProcedure
    .input(z.object({ orderId: z.string().min(1).max(128), checkout_token: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const token = requireCheckoutToken({
        token: input.checkout_token,
        provider: "paypal",
        providerId: input.orderId,
      });
      const payment = await getPaymentById(token.paymentId);
      if (!payment || payment.paymentProvider !== "paypal" || payment.paypalOrderId !== input.orderId) {
        fail("NOT_FOUND", "Masterclass video PayPal checkout was not found.");
      }
      assertOneTimeMasterclassRecord(payment);
      if (payment.paypalMode !== token.mode || (token.mode !== "sandbox" && token.mode !== "live")) {
        fail("BAD_REQUEST", "PayPal checkout mode does not match the original checkout.");
      }

      const client = await getPayPalClient(token.mode);
      if (!client) {
        fail("PRECONDITION_FAILED", `PayPal ${token.mode} credentials are not configured.`);
      }

      const initialOrder = await getPayPalOrder(client, input.orderId);
      const initialStatus = (initialOrder as { status?: string }).status;
      if (initialStatus === "COMPLETED") {
        // Do not issue a second capture on a browser retry.
        assertPayPalOrderShape(initialOrder, payment.id, input.orderId, true);
      } else {
        assertPayPalOrderShape(initialOrder, payment.id, input.orderId, false);
        if (initialStatus !== "APPROVED") {
          fail("BAD_REQUEST", "PayPal order is not approved for capture.");
        }
        const captureResponse = await fetch(
          `${client.baseUrl}/v2/checkout/orders/${encodeURIComponent(input.orderId)}/capture`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${client.token}`,
              "Content-Type": "application/json",
              // Stable per bound order so concurrent browser retries converge at PayPal.
              "PayPal-Request-Id": `masterclass-video-capture-${payment.id}`,
            },
          },
        );
        if (!captureResponse.ok) {
          fail("INTERNAL_SERVER_ERROR", "Unable to capture the PayPal order.");
        }
        const capture = await captureResponse.json() as { status?: string };
        if (capture.status !== "COMPLETED") {
          fail("BAD_REQUEST", "PayPal order has not completed.");
        }
        // Retrieve the final representation so amount, custom_id, description,
        // and exactly one completed $39.00 capture are independently verified.
        const completedOrder = await getPayPalOrder(client, input.orderId);
        assertPayPalOrderShape(completedOrder, payment.id, input.orderId, true);
      }

      await updatePayment(payment.id, {
        paypalOrderId: input.orderId,
        remainingAmount: 0,
        status: MASTERCLASS_VIDEO_PAYMENT.finalStatus,
      });
      return { redirect_url: "/thank-you-video" as const };
    }),

  /** Creates a non-customer, no-future-use Stripe $39.00 PaymentIntent. */
  createStripeIntent: publicProcedure
    .input(contactSchema)
    .mutation(async ({ input }) => {
      // See createPaypalOrder: production must use a durable configured signing secret.
      requireCheckoutTokenSecret();
      const { mode } = await requireActiveStripeConfiguration();
      const fingerprint = contactFingerprint(input);

      return createIdempotently({
        provider: "stripe",
        checkoutId: input.checkout_id,
        fingerprint,
        create: async () => {
          const stripe = await getStripeClientForMode(mode);
          if (!stripe) {
            fail("PRECONDITION_FAILED", `Stripe ${mode} credentials are not configured.`);
          }
          const paymentId = await createPayment({
            patientName: input.patientName,
            patientEmail: input.patientEmail,
            patientPhone: input.patientPhone,
            consultationTotalAmount: MASTERCLASS_VIDEO_PAYMENT.amountCents,
            depositAmount: MASTERCLASS_VIDEO_PAYMENT.amountCents,
            remainingAmount: 0,
            referralCreditAmount: 0,
            status: "pending",
            landingPage: MASTERCLASS_VIDEO_PAYMENT.source,
            paymentProvider: "stripe",
            stripeMode: mode,
            paypalMode: "sandbox", // Required legacy column; unused for Stripe.
          });
          const binding = makeProviderBinding({
            paymentId,
            checkoutId: input.checkout_id,
            provider: "stripe",
            mode,
            source: MASTERCLASS_VIDEO_PAYMENT.source,
          });
          const intent = await stripe.paymentIntents.create({
            amount: MASTERCLASS_VIDEO_PAYMENT.amountCents,
            currency: "usd",
            receipt_email: input.patientEmail,
            description: MASTERCLASS_VIDEO_PAYMENT.stripeDescription,
            metadata: {
              purpose: MASTERCLASS_VIDEO_PAYMENT.stripePurpose,
              source: MASTERCLASS_VIDEO_PAYMENT.source,
              payment_id: String(paymentId),
              checkout_id: input.checkout_id,
              checkout_binding: binding,
            },
          }, {
            // Client-generated stable UUID gives Stripe a bounded provider-side retry key.
            idempotencyKey: `masterclass-video-${input.checkout_id}`,
          });
          if (!intent.id || !intent.client_secret) {
            fail("INTERNAL_SERVER_ERROR", "Stripe did not return a payment intent for checkout.");
          }

          await updatePayment(paymentId, { depositPaymentIntentId: intent.id });
          return {
            paymentIntentId: intent.id,
            clientSecret: intent.client_secret,
            checkout_token: makeCheckoutToken({
              paymentId,
              checkoutId: input.checkout_id,
              provider: "stripe",
              mode,
              providerId: intent.id,
              source: MASTERCLASS_VIDEO_PAYMENT.source,
            }),
          };
        },
      });
    }),

  /** Verifies a successful exact Stripe intent before allowing the video thank-you redirect. */
  confirmStripePayment: publicProcedure
    .input(z.object({ paymentIntentId: z.string().min(1).max(128), checkout_token: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const token = requireCheckoutToken({
        token: input.checkout_token,
        provider: "stripe",
        providerId: input.paymentIntentId,
      });
      if (token.mode !== "test" && token.mode !== "live") {
        fail("BAD_REQUEST", "Stripe checkout mode does not match the original checkout.");
      }

      const payment = await getPaymentById(token.paymentId);
      if (!payment || payment.paymentProvider !== "stripe" || payment.depositPaymentIntentId !== input.paymentIntentId) {
        fail("NOT_FOUND", "Masterclass video Stripe checkout was not found.");
      }
      assertOneTimeMasterclassRecord(payment);
      if (payment.stripeMode !== token.mode) {
        fail("BAD_REQUEST", "Stripe checkout mode does not match the original checkout.");
      }

      const stripe = await getStripeClientForMode(token.mode);
      if (!stripe) {
        fail("PRECONDITION_FAILED", `Stripe ${token.mode} credentials are not configured.`);
      }
      const intent = await stripe.paymentIntents.retrieve(input.paymentIntentId);
      const expectedBinding = makeProviderBinding({
        paymentId: payment.id,
        checkoutId: token.checkoutId,
        provider: "stripe",
        mode: token.mode,
        source: MASTERCLASS_VIDEO_PAYMENT.source,
      });
      if (
        intent.id !== input.paymentIntentId
        || intent.status !== "succeeded"
        || intent.amount !== MASTERCLASS_VIDEO_PAYMENT.amountCents
        || intent.amount_received !== MASTERCLASS_VIDEO_PAYMENT.amountCents
        || intent.currency.toLowerCase() !== "usd"
        || intent.metadata.source !== MASTERCLASS_VIDEO_PAYMENT.source
        || intent.metadata.purpose !== MASTERCLASS_VIDEO_PAYMENT.stripePurpose
        || intent.metadata.payment_id !== String(payment.id)
        || intent.metadata.checkout_id !== token.checkoutId
        || intent.metadata.checkout_binding !== expectedBinding
      ) {
        fail("BAD_REQUEST", "Stripe payment does not match the expected one-time $39.00 masterclass video checkout.");
      }

      await updatePayment(payment.id, {
        remainingAmount: 0,
        status: MASTERCLASS_VIDEO_PAYMENT.finalStatus,
      });
      return { redirect_url: "/thank-you-video" as const };
    }),
});
