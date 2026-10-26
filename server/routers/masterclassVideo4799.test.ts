import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.hoisted(() => {
  // Both isolated router modules use the existing durable JWT/cookie signing-secret
  // fallback, allowing cross-route tokens to reach (and fail) the exact source guard.
  process.env.JWT_SECRET = "masterclass-video-test-durable-signing-secret";
});

const mocks = vi.hoisted(() => ({
  createPayment: vi.fn(),
  getPaymentById: vi.fn(),
  getPaypalSettings: vi.fn(),
  getStripeSettings: vi.fn(),
  updatePayment: vi.fn(),
  getPayPalClient: vi.fn(),
  getStripeClientForMode: vi.fn(),
  createIntent: vi.fn(),
  retrieveIntent: vi.fn(),
}));

vi.mock("../db", () => ({
  createPayment: mocks.createPayment,
  getPaymentById: mocks.getPaymentById,
  getPaypalSettings: mocks.getPaypalSettings,
  getStripeSettings: mocks.getStripeSettings,
  updatePayment: mocks.updatePayment,
}));
vi.mock("./paypal", () => ({ getPayPalClient: mocks.getPayPalClient }));
vi.mock("./stripe", () => ({ getStripeClientForMode: mocks.getStripeClientForMode }));

import { masterclassVideo4799Router, MASTERCLASS_VIDEO_4799_PAYMENT } from "./masterclassVideo4799";
import { masterclassVideoRouter, MASTERCLASS_VIDEO_PAYMENT } from "./masterclassVideo";

const caller = masterclassVideo4799Router.createCaller({} as never);
const legacyCaller = masterclassVideoRouter.createCaller({} as never);
const checkoutId = "dcbfcfe4-b967-4870-a222-965a63082e08";
const contact = {
  checkout_id: checkoutId,
  patientName: "Jane Test",
  patientEmail: "jane@example.com",
  patientPhone: "555-0100",
};
const paypalSettings = {
  id: 1,
  mode: "sandbox" as const,
  activeProvider: "paypal" as const,
  sandboxClientId: "paypal-client",
  sandboxClientSecret: "paypal-secret",
  liveClientId: null,
  liveClientSecret: null,
};
const stripeSettings = {
  id: 1,
  mode: "test" as const,
  testPublishableKey: "pk_test_masterclass",
  testSecretKey: "sk_test_masterclass",
  livePublishableKey: null,
  liveSecretKey: null,
};
const paypalClient = { baseUrl: "https://paypal.example", token: "paypal-token", clientId: "paypal-client" };
const stripeClient = { paymentIntents: { create: mocks.createIntent, retrieve: mocks.retrieveIntent } };

function response(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status });
}

function paypalOrder(paymentId: number, status = "CREATED", orderId = "ORDER-4799") {
  return {
    id: orderId,
    status,
    purchase_units: [{
      custom_id: `masterclass-video4799:${paymentId}`,
      description: MASTERCLASS_VIDEO_4799_PAYMENT.paypalDescription,
      amount: { currency_code: "USD", value: "47.99" },
      ...(status === "COMPLETED" ? {
        payments: { captures: [{ id: "CAPTURE-4799", status: "COMPLETED", amount: { currency_code: "USD", value: "47.99" } }] },
      } : {}),
    }],
  };
}

function paypalPayment(id: number) {
  return {
    id,
    paymentProvider: "paypal" as const,
    landingPage: "/masterclass2",
    consultationTotalAmount: 4799,
    depositAmount: 4799,
    remainingAmount: 0,
    paypalMode: "sandbox" as const,
    paypalOrderId: "ORDER-4799",
  };
}

function stripePayment(id: number) {
  return {
    id,
    paymentProvider: "stripe" as const,
    landingPage: "/masterclass2",
    consultationTotalAmount: 4799,
    depositAmount: 4799,
    remainingAmount: 0,
    stripeMode: "test" as const,
    depositPaymentIntentId: "pi_4799",
  };
}

describe("masterclass video one-time checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getPaypalSettings.mockResolvedValue(paypalSettings);
    mocks.getStripeSettings.mockResolvedValue(stripeSettings);
    mocks.getPayPalClient.mockResolvedValue(paypalClient);
    mocks.getStripeClientForMode.mockResolvedValue(stripeClient);
  });
  afterEach(() => vi.unstubAllGlobals());

  it("returns only stable public config aliases and never a secret", async () => {
    await expect(caller.config()).resolves.toEqual({
      activeProvider: "paypal", mode: "sandbox", clientId: "paypal-client", publishableKey: null,
    });
    mocks.getPaypalSettings.mockResolvedValue({ ...paypalSettings, activeProvider: "stripe" });
    await expect(caller.config()).resolves.toEqual({
      activeProvider: "stripe", mode: "test", clientId: null, publishableKey: "pk_test_masterclass",
    });
  });

  it("creates a bound PayPal card order for the exact one-time $47.99 purchase without vaulting", async () => {
    mocks.createPayment.mockResolvedValue(4799);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response({ id: "ORDER-4799" }, 201)));

    const result = await caller.createPaypalOrder({ ...contact, payment_method: "card" });

    expect(mocks.createPayment).toHaveBeenCalledWith(expect.objectContaining({
      landingPage: "/masterclass2", paymentProvider: "paypal", consultationTotalAmount: 4799,
      depositAmount: 4799, remainingAmount: 0, status: "pending",
    }));
    const body = JSON.parse((fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0][1].body);
    expect(body).toMatchObject({
      intent: "CAPTURE",
      purchase_units: [{
        amount: { currency_code: "USD", value: "47.99" },
        description: MASTERCLASS_VIDEO_4799_PAYMENT.paypalDescription,
        custom_id: "masterclass-video4799:4799",
      }],
      payment_source: { card: { attributes: { verification: { method: "SCA_WHEN_REQUIRED" } } } },
    });
    expect(JSON.stringify(body)).not.toContain("vault");
    expect(JSON.stringify(body)).not.toContain("stored_credentials");
    expect(result).toEqual(expect.objectContaining({ orderId: "ORDER-4799", checkout_token: expect.any(String) }));
  });

  it("allows the explicit eligible Apple Pay request with no PayPal vault/future-use fields", async () => {
    mocks.createPayment.mockResolvedValue(40);
    const fetchMock = vi.fn().mockResolvedValue(response({ id: "ORDER-APPLE-4799" }, 201));
    vi.stubGlobal("fetch", fetchMock);

    await caller.createPaypalOrder({ ...contact, checkout_id: "99d55995-f7dc-4d7b-91b7-321b404de212", payment_method: "apple_pay" });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.payment_source).toBeUndefined();
    expect(JSON.stringify(body)).not.toContain("vault");
    expect(JSON.stringify(body)).not.toContain("stored_credentials");
  });

  it("reuses an in-flight/successful checkout UUID without creating a second PayPal record", async () => {
    mocks.createPayment.mockResolvedValue(41);
    const fetchMock = vi.fn().mockResolvedValue(response({ id: "ORDER-IDEMPOTENT" }, 201));
    vi.stubGlobal("fetch", fetchMock);
    const idempotentContact = { ...contact, checkout_id: "198a4a5e-3a73-4142-9b87-63e3bbbdfd70", payment_method: "card" as const };

    const [first, second] = await Promise.all([
      caller.createPaypalOrder(idempotentContact),
      caller.createPaypalOrder(idempotentContact),
    ]);
    expect(second).toEqual(first);
    expect(mocks.createPayment).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("requires the signed PayPal binding, verifies an already captured order, and does not recapture it", async () => {
    mocks.createPayment.mockResolvedValue(42);
    const createFetch = vi.fn().mockResolvedValue(response({ id: "ORDER-4799" }, 201));
    vi.stubGlobal("fetch", createFetch);
    const created = await caller.createPaypalOrder({ ...contact, checkout_id: "97792663-71b3-4140-ab91-21a0ea7d15a5", payment_method: "card" });
    mocks.getPaymentById.mockResolvedValue(paypalPayment(42));
    const verifyFetch = vi.fn().mockResolvedValue(response(paypalOrder(42, "COMPLETED")));
    vi.stubGlobal("fetch", verifyFetch);

    await expect(caller.capturePaypalOrder({ orderId: "ORDER-4799", checkout_token: created.checkout_token }))
      .resolves.toEqual({ redirect_url: "/thank-you-video-4799" });
    expect(verifyFetch).toHaveBeenCalledTimes(1);
    expect(verifyFetch.mock.calls[0][0]).toContain("/v2/checkout/orders/ORDER-4799");
    expect(verifyFetch.mock.calls[0][1]?.method).toBeUndefined();
    expect(mocks.updatePayment).toHaveBeenLastCalledWith(42, { paypalOrderId: "ORDER-4799", remainingAmount: 0, status: "fully_paid" });

    await expect(caller.capturePaypalOrder({ orderId: "ORDER-other", checkout_token: created.checkout_token }))
      .rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("captures only an approved matching order with a stable request ID and accepts a minimal capture response after final GET verification", async () => {
    mocks.createPayment.mockResolvedValue(45);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response({ id: "ORDER-APPROVED" }, 201)));
    const created = await caller.createPaypalOrder({ ...contact, checkout_id: "dd4d2ea3-27f1-44fc-9966-9fae05f1e523", payment_method: "card" });
    mocks.getPaymentById.mockResolvedValue({ ...paypalPayment(45), paypalOrderId: "ORDER-APPROVED" });
    const captureFlowFetch = vi.fn()
      .mockResolvedValueOnce(response(paypalOrder(45, "APPROVED", "ORDER-APPROVED")))
      // PayPal capture responses may omit order metadata; the final GET is authoritative.
      .mockResolvedValueOnce(response({ status: "COMPLETED" }))
      .mockResolvedValueOnce(response(paypalOrder(45, "COMPLETED", "ORDER-APPROVED")));
    vi.stubGlobal("fetch", captureFlowFetch);

    await expect(caller.capturePaypalOrder({ orderId: "ORDER-APPROVED", checkout_token: created.checkout_token }))
      .resolves.toEqual({ redirect_url: "/thank-you-video-4799" });
    expect(captureFlowFetch).toHaveBeenCalledTimes(3);
    expect(captureFlowFetch.mock.calls[1][1]).toMatchObject({
      method: "POST",
      headers: expect.objectContaining({ "PayPal-Request-Id": "masterclass-video4799-capture-45" }),
    });
  });

  it("rejects a PayPal GET with a returned order ID different from the requested bound order", async () => {
    mocks.createPayment.mockResolvedValue(46);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response({ id: "ORDER-EXPECTED" }, 201)));
    const created = await caller.createPaypalOrder({ ...contact, checkout_id: "2ddb7b69-9c46-4b44-8fe4-e48be1f46f17", payment_method: "card" });
    mocks.getPaymentById.mockResolvedValue({ ...paypalPayment(46), paypalOrderId: "ORDER-EXPECTED" });
    const verifyFetch = vi.fn().mockResolvedValue(response(paypalOrder(46, "APPROVED", "ORDER-OTHER")));
    vi.stubGlobal("fetch", verifyFetch);

    await expect(caller.capturePaypalOrder({ orderId: "ORDER-EXPECTED", checkout_token: created.checkout_token }))
      .rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(verifyFetch).toHaveBeenCalledTimes(1);
  });

  it("rejects a PayPal order that is not approved without issuing a capture POST", async () => {
    mocks.createPayment.mockResolvedValue(48);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response({ id: "ORDER-CREATED" }, 201)));
    const created = await caller.createPaypalOrder({ ...contact, checkout_id: "5e2a4489-bb1d-4b17-8791-1e28e7c862d7", payment_method: "card" });
    mocks.updatePayment.mockClear();
    mocks.getPaymentById.mockResolvedValue({ ...paypalPayment(48), paypalOrderId: "ORDER-CREATED" });
    const verifyFetch = vi.fn().mockResolvedValue(response(paypalOrder(48, "CREATED", "ORDER-CREATED")));
    vi.stubGlobal("fetch", verifyFetch);

    await expect(caller.capturePaypalOrder({ orderId: "ORDER-CREATED", checkout_token: created.checkout_token }))
      .rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(verifyFetch).toHaveBeenCalledTimes(1);
    expect(mocks.updatePayment).not.toHaveBeenCalled();
  });

  it("rejects a completed PayPal order whose sole capture lacks an ID", async () => {
    mocks.createPayment.mockResolvedValue(47);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response({ id: "ORDER-NO-CAPTURE-ID" }, 201)));
    const created = await caller.createPaypalOrder({ ...contact, checkout_id: "4adf496d-e7da-46a7-acdf-efc223546962", payment_method: "card" });
    mocks.getPaymentById.mockResolvedValue({ ...paypalPayment(47), paypalOrderId: "ORDER-NO-CAPTURE-ID" });
    const missingCaptureId = paypalOrder(47, "COMPLETED", "ORDER-NO-CAPTURE-ID");
    delete missingCaptureId.purchase_units[0].payments?.captures?.[0].id;
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response(missingCaptureId)));

    await expect(caller.capturePaypalOrder({ orderId: "ORDER-NO-CAPTURE-ID", checkout_token: created.checkout_token }))
      .rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("creates a one-time Stripe intent without customer or setup_future_usage and binds its metadata", async () => {
    mocks.getPaypalSettings.mockResolvedValue({ ...paypalSettings, activeProvider: "stripe" });
    mocks.createPayment.mockResolvedValue(43);
    mocks.createIntent.mockResolvedValue({ id: "pi_4799", client_secret: "pi_4799_secret" });

    const result = await caller.createStripeIntent({ ...contact, checkout_id: "d954ff8a-d631-48cd-9ac5-49233e49df1d" });

    expect(mocks.createIntent).toHaveBeenCalledWith(expect.objectContaining({
      amount: 4799,
      currency: "usd",
      description: MASTERCLASS_VIDEO_4799_PAYMENT.stripeDescription,
      metadata: expect.objectContaining({
        purpose: MASTERCLASS_VIDEO_4799_PAYMENT.stripePurpose,
        source: "/masterclass2",
        payment_id: "43",
        checkout_id: "d954ff8a-d631-48cd-9ac5-49233e49df1d",
        checkout_binding: expect.any(String),
      }),
    }), { idempotencyKey: "masterclass-video4799-d954ff8a-d631-48cd-9ac5-49233e49df1d" });
    const intentArgs = mocks.createIntent.mock.calls[0][0];
    expect(intentArgs.customer).toBeUndefined();
    expect(intentArgs.setup_future_usage).toBeUndefined();
    expect(result).toEqual({ paymentIntentId: "pi_4799", clientSecret: "pi_4799_secret", checkout_token: expect.any(String) });
  });

  it("confirms only a bound exact successful Stripe intent and finalizes it with no remaining balance", async () => {
    mocks.getPaypalSettings.mockResolvedValue({ ...paypalSettings, activeProvider: "stripe" });
    mocks.createPayment.mockResolvedValue(44);
    mocks.createIntent.mockResolvedValue({ id: "pi_4799", client_secret: "pi_4799_secret" });
    const created = await caller.createStripeIntent({ ...contact, checkout_id: "570bd966-5cc4-426c-bfb9-3b9b82109409" });
    mocks.getPaymentById.mockResolvedValue(stripePayment(44));
    const metadata = mocks.createIntent.mock.calls[0][0].metadata;
    mocks.retrieveIntent.mockResolvedValue({
      id: "pi_4799", status: "succeeded", amount: 4799, amount_received: 4799, currency: "usd", metadata,
    });

    await expect(caller.confirmStripePayment({ paymentIntentId: "pi_4799", checkout_token: created.checkout_token }))
      .resolves.toEqual({ redirect_url: "/thank-you-video-4799" });
    expect(mocks.getStripeClientForMode).toHaveBeenLastCalledWith("test");
    expect(mocks.updatePayment).toHaveBeenLastCalledWith(44, { remainingAmount: 0, status: "fully_paid" });

    mocks.retrieveIntent.mockResolvedValueOnce({
      id: "pi_4799", status: "succeeded", amount: 4799, amount_received: 4799, currency: "usd",
      metadata: { ...metadata, checkout_binding: "forged" },
    });
    await expect(caller.confirmStripePayment({ paymentIntentId: "pi_4799", checkout_token: created.checkout_token }))
      .rejects.toMatchObject({ code: "BAD_REQUEST" });

    mocks.retrieveIntent.mockResolvedValueOnce({
      id: "pi_different", status: "succeeded", amount: 4799, amount_received: 4799, currency: "usd", metadata,
    });
    await expect(caller.confirmStripePayment({ paymentIntentId: "pi_4799", checkout_token: created.checkout_token }))
      .rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects creation when a non-active provider is requested", async () => {
    mocks.getPaypalSettings.mockResolvedValue({ ...paypalSettings, activeProvider: "stripe" });
    await expect(caller.createPaypalOrder({ ...contact, checkout_id: "6c2447c4-bb76-4982-b3fa-c0fe29c2d769", payment_method: "card" }))
      .rejects.toMatchObject({ code: "PRECONDITION_FAILED" });
    expect(mocks.createPayment).not.toHaveBeenCalled();
  });

  it("rejects reuse of a checkout UUID with different contact details without retaining raw contact data", async () => {
    mocks.createPayment.mockResolvedValue(4801);
    const fetchMock = vi.fn().mockResolvedValue(response({ id: "ORDER-CACHE-CONFLICT" }, 201));
    vi.stubGlobal("fetch", fetchMock);
    const duplicateCheckout = "4a1e40f8-fc17-4a6d-b7de-d0cfb2b4f0c1";

    await caller.createPaypalOrder({ ...contact, checkout_id: duplicateCheckout, payment_method: "card" });
    await expect(caller.createPaypalOrder({
      ...contact,
      checkout_id: duplicateCheckout,
      patientEmail: "different@example.com",
      payment_method: "card",
    })).rejects.toMatchObject({ code: "CONFLICT" });

    expect(mocks.createPayment).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("rejects Stripe $39.00, $47.00, $47.98, underpaid, and non-USD intents before finalizing the ledger", async () => {
    mocks.getPaypalSettings.mockResolvedValue({ ...paypalSettings, activeProvider: "stripe" });
    mocks.createPayment.mockResolvedValue(4802);
    mocks.createIntent.mockResolvedValue({ id: "pi_exact_4799", client_secret: "pi_exact_4799_secret" });
    const created = await caller.createStripeIntent({ ...contact, checkout_id: "ed3445a8-9e75-49ea-a3d5-e356feea6bf2" });
    mocks.getPaymentById.mockResolvedValue({ ...stripePayment(4802), depositPaymentIntentId: "pi_exact_4799" });
    const metadata = mocks.createIntent.mock.calls[0][0].metadata;
    mocks.updatePayment.mockClear();

    for (const [amount, amountReceived, currency] of [
      [3900, 3900, "usd"],
      [4700, 4700, "usd"],
      [4798, 4798, "usd"],
      [4799, 4798, "usd"],
      [4799, 4799, "eur"],
    ]) {
      mocks.retrieveIntent.mockResolvedValueOnce({
        id: "pi_exact_4799",
        status: "succeeded",
        amount,
        amount_received: amountReceived,
        currency,
        metadata,
      });
      await expect(caller.confirmStripePayment({
        paymentIntentId: "pi_exact_4799",
        checkout_token: created.checkout_token,
      })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    }
    expect(mocks.updatePayment).not.toHaveBeenCalled();
  });

  it("rejects PayPal completed orders with a $39.00 purchase unit or a non-USD unit", async () => {
    mocks.createPayment.mockResolvedValue(4803);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response({ id: "ORDER-UNIT-MISMATCH" }, 201)));
    const created = await caller.createPaypalOrder({ ...contact, checkout_id: "d11a1532-5a3d-4f43-a60a-4d5f15a937e0", payment_method: "card" });
    mocks.getPaymentById.mockResolvedValue({ ...paypalPayment(4803), paypalOrderId: "ORDER-UNIT-MISMATCH" });
    mocks.updatePayment.mockClear();

    const $39Unit = paypalOrder(4803, "COMPLETED", "ORDER-UNIT-MISMATCH");
    $39Unit.purchase_units[0].amount.value = "39.00";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response($39Unit)));
    await expect(caller.capturePaypalOrder({ orderId: "ORDER-UNIT-MISMATCH", checkout_token: created.checkout_token }))
      .rejects.toMatchObject({ code: "BAD_REQUEST" });

    const nonUsdUnit = paypalOrder(4803, "COMPLETED", "ORDER-UNIT-MISMATCH");
    nonUsdUnit.purchase_units[0].amount.currency_code = "EUR";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response(nonUsdUnit)));
    await expect(caller.capturePaypalOrder({ orderId: "ORDER-UNIT-MISMATCH", checkout_token: created.checkout_token }))
      .rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(mocks.updatePayment).not.toHaveBeenCalled();
  });

  it("rejects PayPal completed orders with a $39.00 capture or a non-USD capture", async () => {
    mocks.createPayment.mockResolvedValue(4804);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response({ id: "ORDER-CAPTURE-MISMATCH" }, 201)));
    const created = await caller.createPaypalOrder({ ...contact, checkout_id: "e7839b48-b08e-459c-87d6-1de64d836f9f", payment_method: "card" });
    mocks.getPaymentById.mockResolvedValue({ ...paypalPayment(4804), paypalOrderId: "ORDER-CAPTURE-MISMATCH" });
    mocks.updatePayment.mockClear();

    const $39Capture = paypalOrder(4804, "COMPLETED", "ORDER-CAPTURE-MISMATCH");
    const $39CaptureAmount = $39Capture.purchase_units[0].payments!.captures![0].amount!;
    $39CaptureAmount.value = "39.00";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response($39Capture)));
    await expect(caller.capturePaypalOrder({ orderId: "ORDER-CAPTURE-MISMATCH", checkout_token: created.checkout_token }))
      .rejects.toMatchObject({ code: "BAD_REQUEST" });

    const nonUsdCapture = paypalOrder(4804, "COMPLETED", "ORDER-CAPTURE-MISMATCH");
    const nonUsdCaptureAmount = nonUsdCapture.purchase_units[0].payments!.captures![0].amount!;
    nonUsdCaptureAmount.currency_code = "EUR";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response(nonUsdCapture)));
    await expect(caller.capturePaypalOrder({ orderId: "ORDER-CAPTURE-MISMATCH", checkout_token: created.checkout_token }))
      .rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(mocks.updatePayment).not.toHaveBeenCalled();
  });

  it("uses distinct old and $47.99 Stripe idempotency keys for the same checkout UUID", async () => {
    const sharedCheckoutId = "7119eeb1-5388-4570-a2b9-d7f9c723d8e7";
    mocks.getPaypalSettings.mockResolvedValue({ ...paypalSettings, activeProvider: "stripe" });
    mocks.createPayment.mockResolvedValueOnce(4805).mockResolvedValueOnce(4806);
    mocks.createIntent
      .mockResolvedValueOnce({ id: "pi_legacy_shared", client_secret: "pi_legacy_shared_secret" })
      .mockResolvedValueOnce({ id: "pi_4799_shared", client_secret: "pi_4799_shared_secret" });

    await legacyCaller.createStripeIntent({ ...contact, checkout_id: sharedCheckoutId });
    await caller.createStripeIntent({ ...contact, checkout_id: sharedCheckoutId });

    expect(mocks.createPayment).toHaveBeenCalledTimes(2);
    expect(mocks.createIntent.mock.calls[0][1]).toEqual({ idempotencyKey: `masterclass-video-${sharedCheckoutId}` });
    expect(mocks.createIntent.mock.calls[1][1]).toEqual({ idempotencyKey: `masterclass-video4799-${sharedCheckoutId}` });
    expect(mocks.createIntent.mock.calls[0][0].metadata.purpose).toBe(MASTERCLASS_VIDEO_PAYMENT.stripePurpose);
    expect(mocks.createIntent.mock.calls[1][0].metadata.purpose).toBe(MASTERCLASS_VIDEO_4799_PAYMENT.stripePurpose);
  });

  it("keeps old and $47.99 checkout UUID caches and provider request IDs isolated, then rejects cross-route tokens before provider verification", async () => {
    const sharedCheckoutId = "4148d7ce-d708-4d36-ae75-79d0827378f3";
    mocks.createPayment.mockResolvedValueOnce(4807).mockResolvedValueOnce(4808);
    const createFetch = vi.fn()
      .mockResolvedValueOnce(response({ id: "ORDER-LEGACY-SHARED" }, 201))
      .mockResolvedValueOnce(response({ id: "ORDER-4799-SHARED" }, 201));
    vi.stubGlobal("fetch", createFetch);

    const legacy = await legacyCaller.createPaypalOrder({ ...contact, checkout_id: sharedCheckoutId, payment_method: "card" });
    const current = await caller.createPaypalOrder({ ...contact, checkout_id: sharedCheckoutId, payment_method: "card" });

    expect(mocks.createPayment).toHaveBeenCalledTimes(2);
    expect(createFetch.mock.calls[0][1].headers["PayPal-Request-Id"])
      .toBe(`masterclass-video-${sharedCheckoutId}`);
    expect(createFetch.mock.calls[1][1].headers["PayPal-Request-Id"])
      .toBe(`masterclass-video4799-${sharedCheckoutId}`);

    createFetch.mockClear();
    mocks.updatePayment.mockClear();
    mocks.getPaymentById
      .mockResolvedValueOnce({
        id: 4807,
        paymentProvider: "paypal" as const,
        landingPage: MASTERCLASS_VIDEO_PAYMENT.source,
        consultationTotalAmount: MASTERCLASS_VIDEO_PAYMENT.amountCents,
        depositAmount: MASTERCLASS_VIDEO_PAYMENT.amountCents,
        remainingAmount: 0,
        paypalMode: "sandbox" as const,
        paypalOrderId: "ORDER-LEGACY-SHARED",
      })
      .mockResolvedValueOnce({
        id: 4808,
        paymentProvider: "paypal" as const,
        landingPage: MASTERCLASS_VIDEO_4799_PAYMENT.source,
        consultationTotalAmount: MASTERCLASS_VIDEO_4799_PAYMENT.amountCents,
        depositAmount: MASTERCLASS_VIDEO_4799_PAYMENT.amountCents,
        remainingAmount: 0,
        paypalMode: "sandbox" as const,
        paypalOrderId: "ORDER-4799-SHARED",
      });

    await expect(caller.capturePaypalOrder({ orderId: "ORDER-LEGACY-SHARED", checkout_token: legacy.checkout_token }))
      .rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(legacyCaller.capturePaypalOrder({ orderId: "ORDER-4799-SHARED", checkout_token: current.checkout_token }))
      .rejects.toMatchObject({ code: "BAD_REQUEST" });

    expect(createFetch).not.toHaveBeenCalled();
    expect(mocks.getPaymentById).toHaveBeenCalledTimes(2);
    expect(mocks.getPayPalClient).toHaveBeenCalledTimes(2); // Creation only; exact ledger rejection precedes provider verification.
    expect(mocks.updatePayment).not.toHaveBeenCalled();
  });

});
