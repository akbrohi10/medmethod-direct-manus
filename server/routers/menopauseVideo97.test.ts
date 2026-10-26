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

import { menopauseVideo97Router, MENOPAUSE_VIDEO_97_PAYMENT } from "./menopauseVideo97";
import { masterclassVideoRouter, MASTERCLASS_VIDEO_PAYMENT } from "./masterclassVideo";
import { masterclassVideo4799Router, MASTERCLASS_VIDEO_4799_PAYMENT } from "./masterclassVideo4799";

const caller = menopauseVideo97Router.createCaller({} as never);
const legacyCaller = masterclassVideoRouter.createCaller({} as never);
const legacy4799Caller = masterclassVideo4799Router.createCaller({} as never);
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

function paypalOrder(paymentId: number, status = "CREATED", orderId = "ORDER-9700") {
  return {
    id: orderId,
    status,
    purchase_units: [{
      custom_id: `menopause-video97:${paymentId}`,
      description: MENOPAUSE_VIDEO_97_PAYMENT.paypalDescription,
      amount: { currency_code: "USD", value: "97.00" },
      ...(status === "COMPLETED" ? {
        payments: { captures: [{ id: "CAPTURE-9700", status: "COMPLETED", amount: { currency_code: "USD", value: "97.00" } }] },
      } : {}),
    }],
  };
}

function paypalPayment(id: number) {
  return {
    id,
    paymentProvider: "paypal" as const,
    landingPage: "/weight-loss-menopauseV2",
    consultationTotalAmount: 9700,
    depositAmount: 9700,
    remainingAmount: 0,
    paypalMode: "sandbox" as const,
    paypalOrderId: "ORDER-9700",
  };
}

function stripePayment(id: number) {
  return {
    id,
    paymentProvider: "stripe" as const,
    landingPage: "/weight-loss-menopauseV2",
    consultationTotalAmount: 9700,
    depositAmount: 9700,
    remainingAmount: 0,
    stripeMode: "test" as const,
    depositPaymentIntentId: "pi_9700",
  };
}

describe("menopause V2 video one-time checkout", () => {
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

  it("creates a bound PayPal card order for the exact one-time $97.00 purchase without vaulting", async () => {
    mocks.createPayment.mockResolvedValue(9700);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response({ id: "ORDER-9700" }, 201)));

    const result = await caller.createPaypalOrder({ ...contact, payment_method: "card" });

    expect(mocks.createPayment).toHaveBeenCalledWith(expect.objectContaining({
      landingPage: "/weight-loss-menopauseV2", paymentProvider: "paypal", consultationTotalAmount: 9700,
      depositAmount: 9700, remainingAmount: 0, status: "pending",
    }));
    const body = JSON.parse((fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0][1].body);
    expect(body).toMatchObject({
      intent: "CAPTURE",
      purchase_units: [{
        amount: { currency_code: "USD", value: "97.00" },
        description: MENOPAUSE_VIDEO_97_PAYMENT.paypalDescription,
        custom_id: "menopause-video97:9700",
      }],
      payment_source: { card: { attributes: { verification: { method: "SCA_WHEN_REQUIRED" } } } },
    });
    expect(JSON.stringify(body)).not.toContain("vault");
    expect(JSON.stringify(body)).not.toContain("stored_credentials");
    expect(result).toEqual(expect.objectContaining({ orderId: "ORDER-9700", checkout_token: expect.any(String) }));
  });

  it("allows the explicit eligible Apple Pay request with no PayPal vault/future-use fields", async () => {
    mocks.createPayment.mockResolvedValue(40);
    const fetchMock = vi.fn().mockResolvedValue(response({ id: "ORDER-APPLE-9700" }, 201));
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
    const createFetch = vi.fn().mockResolvedValue(response({ id: "ORDER-9700" }, 201));
    vi.stubGlobal("fetch", createFetch);
    const created = await caller.createPaypalOrder({ ...contact, checkout_id: "97792663-71b3-4140-ab91-21a0ea7d15a5", payment_method: "card" });
    mocks.getPaymentById.mockResolvedValue(paypalPayment(42));
    const verifyFetch = vi.fn().mockResolvedValue(response(paypalOrder(42, "COMPLETED")));
    vi.stubGlobal("fetch", verifyFetch);

    await expect(caller.capturePaypalOrder({ orderId: "ORDER-9700", checkout_token: created.checkout_token }))
      .resolves.toEqual({ redirect_url: "/thank-you-video-97" });
    expect(verifyFetch).toHaveBeenCalledTimes(1);
    expect(verifyFetch.mock.calls[0][0]).toContain("/v2/checkout/orders/ORDER-9700");
    expect(verifyFetch.mock.calls[0][1]?.method).toBeUndefined();
    expect(mocks.updatePayment).toHaveBeenLastCalledWith(42, { paypalOrderId: "ORDER-9700", remainingAmount: 0, status: "fully_paid" });

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
      .resolves.toEqual({ redirect_url: "/thank-you-video-97" });
    expect(captureFlowFetch).toHaveBeenCalledTimes(3);
    expect(captureFlowFetch.mock.calls[1][1]).toMatchObject({
      method: "POST",
      headers: expect.objectContaining({ "PayPal-Request-Id": "menopause-video97-capture-45" }),
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
    mocks.createIntent.mockResolvedValue({ id: "pi_9700", client_secret: "pi_9700_secret" });

    const result = await caller.createStripeIntent({ ...contact, checkout_id: "d954ff8a-d631-48cd-9ac5-49233e49df1d" });

    expect(mocks.createIntent).toHaveBeenCalledWith(expect.objectContaining({
      amount: 9700,
      currency: "usd",
      description: MENOPAUSE_VIDEO_97_PAYMENT.stripeDescription,
      metadata: expect.objectContaining({
        purpose: MENOPAUSE_VIDEO_97_PAYMENT.stripePurpose,
        source: "/weight-loss-menopauseV2",
        payment_id: "43",
        checkout_id: "d954ff8a-d631-48cd-9ac5-49233e49df1d",
        checkout_binding: expect.any(String),
      }),
    }), { idempotencyKey: "menopause-video97-d954ff8a-d631-48cd-9ac5-49233e49df1d" });
    const intentArgs = mocks.createIntent.mock.calls[0][0];
    expect(intentArgs.customer).toBeUndefined();
    expect(intentArgs.setup_future_usage).toBeUndefined();
    expect(result).toEqual({ paymentIntentId: "pi_9700", clientSecret: "pi_9700_secret", checkout_token: expect.any(String) });
  });

  it("confirms only a bound exact successful Stripe intent and finalizes it with no remaining balance", async () => {
    mocks.getPaypalSettings.mockResolvedValue({ ...paypalSettings, activeProvider: "stripe" });
    mocks.createPayment.mockResolvedValue(44);
    mocks.createIntent.mockResolvedValue({ id: "pi_9700", client_secret: "pi_9700_secret" });
    const created = await caller.createStripeIntent({ ...contact, checkout_id: "570bd966-5cc4-426c-bfb9-3b9b82109409" });
    mocks.getPaymentById.mockResolvedValue(stripePayment(44));
    const metadata = mocks.createIntent.mock.calls[0][0].metadata;
    mocks.retrieveIntent.mockResolvedValue({
      id: "pi_9700", status: "succeeded", amount: 9700, amount_received: 9700, currency: "usd", metadata,
    });

    await expect(caller.confirmStripePayment({ paymentIntentId: "pi_9700", checkout_token: created.checkout_token }))
      .resolves.toEqual({ redirect_url: "/thank-you-video-97" });
    expect(mocks.getStripeClientForMode).toHaveBeenLastCalledWith("test");
    expect(mocks.updatePayment).toHaveBeenLastCalledWith(44, { remainingAmount: 0, status: "fully_paid" });

    mocks.retrieveIntent.mockResolvedValueOnce({
      id: "pi_9700", status: "succeeded", amount: 9700, amount_received: 9700, currency: "usd",
      metadata: { ...metadata, checkout_binding: "forged" },
    });
    await expect(caller.confirmStripePayment({ paymentIntentId: "pi_9700", checkout_token: created.checkout_token }))
      .rejects.toMatchObject({ code: "BAD_REQUEST" });

    mocks.retrieveIntent.mockResolvedValueOnce({
      id: "pi_different", status: "succeeded", amount: 9700, amount_received: 9700, currency: "usd", metadata,
    });
    await expect(caller.confirmStripePayment({ paymentIntentId: "pi_9700", checkout_token: created.checkout_token }))
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

  it("rejects Stripe $39.00, $47.99, $96.99, underpaid, and non-USD intents before finalizing the ledger", async () => {
    mocks.getPaypalSettings.mockResolvedValue({ ...paypalSettings, activeProvider: "stripe" });
    mocks.createPayment.mockResolvedValue(4802);
    mocks.createIntent.mockResolvedValue({ id: "pi_exact_9700", client_secret: "pi_exact_9700_secret" });
    const created = await caller.createStripeIntent({ ...contact, checkout_id: "ed3445a8-9e75-49ea-a3d5-e356feea6bf2" });
    mocks.getPaymentById.mockResolvedValue({ ...stripePayment(4802), depositPaymentIntentId: "pi_exact_9700" });
    const metadata = mocks.createIntent.mock.calls[0][0].metadata;
    mocks.updatePayment.mockClear();

    for (const [amount, amountReceived, currency] of [
      [3900, 3900, "usd"],
      [4799, 4799, "usd"],
      [9699, 9699, "usd"],
      [9700, 9699, "usd"],
      [9700, 9700, "eur"],
    ]) {
      mocks.retrieveIntent.mockResolvedValueOnce({
        id: "pi_exact_9700",
        status: "succeeded",
        amount,
        amount_received: amountReceived,
        currency,
        metadata,
      });
      await expect(caller.confirmStripePayment({
        paymentIntentId: "pi_exact_9700",
        checkout_token: created.checkout_token,
      })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    }
    expect(mocks.updatePayment).not.toHaveBeenCalled();
  });

  it("rejects PayPal completed orders with $39.00, $47.99, or $96.99 purchase units and non-USD units", async () => {
    mocks.createPayment.mockResolvedValue(4803);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response({ id: "ORDER-UNIT-MISMATCH" }, 201)));
    const created = await caller.createPaypalOrder({ ...contact, checkout_id: "d11a1532-5a3d-4f43-a60a-4d5f15a937e0", payment_method: "card" });
    mocks.getPaymentById.mockResolvedValue({ ...paypalPayment(4803), paypalOrderId: "ORDER-UNIT-MISMATCH" });
    mocks.updatePayment.mockClear();

    for (const underpayment of ["39.00", "47.99", "96.99"]) {
      const unit = paypalOrder(4803, "COMPLETED", "ORDER-UNIT-MISMATCH");
      unit.purchase_units[0].amount.value = underpayment;
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response(unit)));
      await expect(caller.capturePaypalOrder({ orderId: "ORDER-UNIT-MISMATCH", checkout_token: created.checkout_token }))
        .rejects.toMatchObject({ code: "BAD_REQUEST" });
    }

    const nonUsdUnit = paypalOrder(4803, "COMPLETED", "ORDER-UNIT-MISMATCH");
    nonUsdUnit.purchase_units[0].amount.currency_code = "EUR";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response(nonUsdUnit)));
    await expect(caller.capturePaypalOrder({ orderId: "ORDER-UNIT-MISMATCH", checkout_token: created.checkout_token }))
      .rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(mocks.updatePayment).not.toHaveBeenCalled();
  });

  it("rejects PayPal completed orders with $39.00, $47.99, or $96.99 captures and non-USD captures", async () => {
    mocks.createPayment.mockResolvedValue(4804);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response({ id: "ORDER-CAPTURE-MISMATCH" }, 201)));
    const created = await caller.createPaypalOrder({ ...contact, checkout_id: "e7839b48-b08e-459c-87d6-1de64d836f9f", payment_method: "card" });
    mocks.getPaymentById.mockResolvedValue({ ...paypalPayment(4804), paypalOrderId: "ORDER-CAPTURE-MISMATCH" });
    mocks.updatePayment.mockClear();

    for (const underpayment of ["39.00", "47.99", "96.99"]) {
      const capture = paypalOrder(4804, "COMPLETED", "ORDER-CAPTURE-MISMATCH");
      capture.purchase_units[0].payments!.captures![0].amount!.value = underpayment;
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response(capture)));
      await expect(caller.capturePaypalOrder({ orderId: "ORDER-CAPTURE-MISMATCH", checkout_token: created.checkout_token }))
        .rejects.toMatchObject({ code: "BAD_REQUEST" });
    }

    const nonUsdCapture = paypalOrder(4804, "COMPLETED", "ORDER-CAPTURE-MISMATCH");
    const nonUsdCaptureAmount = nonUsdCapture.purchase_units[0].payments!.captures![0].amount!;
    nonUsdCaptureAmount.currency_code = "EUR";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response(nonUsdCapture)));
    await expect(caller.capturePaypalOrder({ orderId: "ORDER-CAPTURE-MISMATCH", checkout_token: created.checkout_token }))
      .rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(mocks.updatePayment).not.toHaveBeenCalled();
  });

  it("uses only its own exact $97 paid ledger for receipt status and makes no provider requests", async () => {
    mocks.createPayment.mockResolvedValue(4810);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response({ id: "ORDER-RECEIPT-PAID" }, 201)));
    const paypalCheckout = await caller.createPaypalOrder({
      ...contact,
      checkout_id: "665e0867-390c-4ae9-a842-8c5b1f43d5dc",
      payment_method: "card",
    });
    mocks.getPaymentById.mockResolvedValue({
      ...paypalPayment(4810),
      paypalOrderId: "ORDER-RECEIPT-PAID",
      status: "fully_paid",
    });
    mocks.getPayPalClient.mockClear();
    mocks.getStripeClientForMode.mockClear();
    const providerFetch = vi.fn();
    vi.stubGlobal("fetch", providerFetch);

    await expect(caller.receiptStatus({
      provider: "paypal",
      providerId: "ORDER-RECEIPT-PAID",
      checkout_token: paypalCheckout.checkout_token,
    })).resolves.toEqual({ paid: true, amountUsd: "97.00" });
    expect(providerFetch).not.toHaveBeenCalled();
    expect(mocks.getPayPalClient).not.toHaveBeenCalled();
    expect(mocks.getStripeClientForMode).not.toHaveBeenCalled();

    mocks.getPaypalSettings.mockResolvedValue({ ...paypalSettings, activeProvider: "stripe" });
    mocks.createPayment.mockResolvedValue(4811);
    mocks.createIntent.mockResolvedValue({ id: "pi_receipt_paid", client_secret: "pi_receipt_paid_secret" });
    const stripeCheckout = await caller.createStripeIntent({
      ...contact,
      checkout_id: "3df05059-ed79-4cfd-85f4-063633c69a63",
    });
    mocks.getPaymentById.mockResolvedValue({
      ...stripePayment(4811),
      depositPaymentIntentId: "pi_receipt_paid",
      status: "fully_paid",
    });
    mocks.getPayPalClient.mockClear();
    mocks.getStripeClientForMode.mockClear();
    providerFetch.mockClear();

    await expect(caller.receiptStatus({
      provider: "stripe",
      providerId: "pi_receipt_paid",
      checkout_token: stripeCheckout.checkout_token,
    })).resolves.toEqual({ paid: true, amountUsd: "97.00" });
    expect(providerFetch).not.toHaveBeenCalled();
    expect(mocks.getPayPalClient).not.toHaveBeenCalled();
    expect(mocks.getStripeClientForMode).not.toHaveBeenCalled();
  });

  it("returns unpaid from the bound ledger and rejects wrong tokens or amounts without provider calls", async () => {
    mocks.createPayment.mockResolvedValue(4812);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response({ id: "ORDER-RECEIPT-UNPAID" }, 201)));
    const checkout = await caller.createPaypalOrder({
      ...contact,
      checkout_id: "542e4e1f-79c0-4f21-9276-3b7351a0f862",
      payment_method: "card",
    });
    const providerFetch = vi.fn();
    vi.stubGlobal("fetch", providerFetch);
    mocks.getPayPalClient.mockClear();
    mocks.getStripeClientForMode.mockClear();
    mocks.getPaymentById.mockResolvedValue({
      ...paypalPayment(4812),
      paypalOrderId: "ORDER-RECEIPT-UNPAID",
      status: "pending",
    });

    await expect(caller.receiptStatus({
      provider: "paypal",
      providerId: "ORDER-RECEIPT-UNPAID",
      checkout_token: checkout.checkout_token,
    })).resolves.toEqual({ paid: false });

    await expect(caller.receiptStatus({
      provider: "paypal",
      providerId: "ORDER-WRONG",
      checkout_token: checkout.checkout_token,
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });

    await expect(caller.receiptStatus({
      provider: "paypal",
      providerId: "ORDER-RECEIPT-UNPAID",
      checkout_token: "forged",
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });

    mocks.getPaymentById.mockResolvedValue({
      ...paypalPayment(4812),
      paypalOrderId: "ORDER-RECEIPT-UNPAID",
      consultationTotalAmount: 3900,
      depositAmount: 3900,
      status: "fully_paid",
    });
    await expect(caller.receiptStatus({
      provider: "paypal",
      providerId: "ORDER-RECEIPT-UNPAID",
      checkout_token: checkout.checkout_token,
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });

    expect(providerFetch).not.toHaveBeenCalled();
    expect(mocks.getPayPalClient).not.toHaveBeenCalled();
    expect(mocks.getStripeClientForMode).not.toHaveBeenCalled();
  });

  it("uses distinct old and $97.00 Stripe idempotency keys for the same checkout UUID", async () => {
    const sharedCheckoutId = "7119eeb1-5388-4570-a2b9-d7f9c723d8e7";
    mocks.getPaypalSettings.mockResolvedValue({ ...paypalSettings, activeProvider: "stripe" });
    mocks.createPayment.mockResolvedValueOnce(4805).mockResolvedValueOnce(4806);
    mocks.createIntent
      .mockResolvedValueOnce({ id: "pi_legacy_shared", client_secret: "pi_legacy_shared_secret" })
      .mockResolvedValueOnce({ id: "pi_9700_shared", client_secret: "pi_9700_shared_secret" });

    await legacyCaller.createStripeIntent({ ...contact, checkout_id: sharedCheckoutId });
    await caller.createStripeIntent({ ...contact, checkout_id: sharedCheckoutId });

    expect(mocks.createPayment).toHaveBeenCalledTimes(2);
    expect(mocks.createIntent.mock.calls[0][1]).toEqual({ idempotencyKey: `masterclass-video-${sharedCheckoutId}` });
    expect(mocks.createIntent.mock.calls[1][1]).toEqual({ idempotencyKey: `menopause-video97-${sharedCheckoutId}` });
    expect(mocks.createIntent.mock.calls[0][0].metadata.purpose).toBe(MASTERCLASS_VIDEO_PAYMENT.stripePurpose);
    expect(mocks.createIntent.mock.calls[1][0].metadata.purpose).toBe(MENOPAUSE_VIDEO_97_PAYMENT.stripePurpose);
  });

  it("keeps $39, $47.99, and $97 checkout namespaces isolated and rejects both cross-route tokens before provider verification", async () => {
    const sharedCheckoutId = "4148d7ce-d708-4d36-ae75-79d0827378f3";
    mocks.createPayment.mockResolvedValueOnce(4807).mockResolvedValueOnce(4808).mockResolvedValueOnce(4809);
    const createFetch = vi.fn()
      .mockResolvedValueOnce(response({ id: "ORDER-LEGACY-SHARED" }, 201))
      .mockResolvedValueOnce(response({ id: "ORDER-4799-SHARED" }, 201))
      .mockResolvedValueOnce(response({ id: "ORDER-9700-SHARED" }, 201));
    vi.stubGlobal("fetch", createFetch);

    const legacy39 = await legacyCaller.createPaypalOrder({ ...contact, checkout_id: sharedCheckoutId, payment_method: "card" });
    const legacy4799 = await legacy4799Caller.createPaypalOrder({ ...contact, checkout_id: sharedCheckoutId, payment_method: "card" });
    const current = await caller.createPaypalOrder({ ...contact, checkout_id: sharedCheckoutId, payment_method: "card" });

    expect(mocks.createPayment).toHaveBeenCalledTimes(3);
    expect(createFetch.mock.calls[0][1].headers["PayPal-Request-Id"])
      .toBe(`masterclass-video-${sharedCheckoutId}`);
    expect(createFetch.mock.calls[1][1].headers["PayPal-Request-Id"])
      .toBe(`masterclass-video4799-${sharedCheckoutId}`);
    expect(createFetch.mock.calls[2][1].headers["PayPal-Request-Id"])
      .toBe(`menopause-video97-${sharedCheckoutId}`);

    createFetch.mockClear();
    mocks.updatePayment.mockClear();

    await expect(caller.capturePaypalOrder({ orderId: "ORDER-LEGACY-SHARED", checkout_token: legacy39.checkout_token }))
      .rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.capturePaypalOrder({ orderId: "ORDER-4799-SHARED", checkout_token: legacy4799.checkout_token }))
      .rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(legacy4799Caller.capturePaypalOrder({ orderId: "ORDER-9700-SHARED", checkout_token: current.checkout_token }))
      .rejects.toMatchObject({ code: "BAD_REQUEST" });

    expect(createFetch).not.toHaveBeenCalled();
    expect(mocks.getPaymentById).not.toHaveBeenCalled();
    expect(mocks.getPayPalClient).toHaveBeenCalledTimes(3); // Creation only; source rejection precedes ledger/provider verification.
    expect(mocks.updatePayment).not.toHaveBeenCalled();
    expect(MASTERCLASS_VIDEO_4799_PAYMENT.source).toBe("/masterclass2");
  });

});
