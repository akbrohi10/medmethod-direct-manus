import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createPayment: vi.fn(),
  getPaymentById: vi.fn(),
  getPaypalSettings: vi.fn(),
  updatePayment: vi.fn(),
  sendPaymentEmailSafely: vi.fn(),
}));

vi.mock("../db", () => ({
  createPayment: mocks.createPayment,
  getPaymentById: mocks.getPaymentById,
  getPaypalSettings: mocks.getPaypalSettings,
  updatePayment: mocks.updatePayment,
  getAllPayments: vi.fn(),
  upsertPaypalSettings: vi.fn(),
}));
vi.mock("../emailService", () => ({ sendPaymentEmailSafely: mocks.sendPaymentEmailSafely }));

import { chargePayPalVault, paypalRouter } from "./paypal";

const caller = paypalRouter.createCaller({} as never);
const settings = {
  id: 1,
  mode: "sandbox" as const,
  activeProvider: "paypal" as const,
  sandboxClientId: "sandbox-client",
  sandboxClientSecret: "sandbox-secret",
  liveClientId: null,
  liveClientSecret: null,
  updatedAt: new Date(),
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getPaypalSettings.mockResolvedValue(settings);
});
afterEach(() => vi.unstubAllGlobals());

describe("masterclass PayPal Apple Pay", () => {
  it("creates only the masterclass $50 deposit with the documented saved Apple Pay source", async () => {
    mocks.createPayment.mockResolvedValue(717);
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: "token" }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "ORDER-APPLE-50" }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(caller.createApplePayOrder({
      patientName: "Jane Test", patientEmail: "jane@example.com", patientPhone: "555-0100",
      landingPage: "/masterclass", saveForFuture: true,
    })).resolves.toEqual({ orderId: "ORDER-APPLE-50", paymentId: 717 });

    expect(mocks.createPayment).toHaveBeenCalledWith(expect.objectContaining({
      landingPage: "/masterclass", paymentProvider: "paypal", depositAmount: 5000, remainingAmount: 14900,
    }));
    const payload = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(payload.purchase_units[0].amount).toEqual({ currency_code: "USD", value: "50.00" });
    expect(payload.payment_source).toEqual({
      apple_pay: {
        stored_credentials: { payment_initiator: "CUSTOMER", payment_type: "RECURRING" },
        attributes: { vault: { store_in_vault: "ON_SUCCESS" } },
      },
    });
    expect(payload.payment_source.card).toBeUndefined();
    expect(mocks.updatePayment).toHaveBeenCalledWith(717, { paypalOrderId: "ORDER-APPLE-50" });
  });

  it("rejects non-masterclass Apple Pay order requests at the procedure boundary", async () => {
    await expect(caller.createApplePayOrder({
      patientName: "Jane Test", patientEmail: "jane@example.com", patientPhone: "555-0100",
      landingPage: "/", saveForFuture: true,
    } as never)).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(mocks.createPayment).not.toHaveBeenCalled();
  });

  it("captures Apple Pay separately and stores only an Apple Pay vault source with consent time", async () => {
    mocks.getPaymentById
      .mockResolvedValueOnce({ id: 717, paymentProvider: "paypal", landingPage: "/masterclass", paypalOrderId: "ORDER-APPLE-50", paypalMode: "sandbox" })
      .mockResolvedValueOnce({ id: 717, depositAmount: 5000 });
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: "token" }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        id: "CAPTURE-APPLE-50", status: "COMPLETED",
        payment_source: { apple_pay: { attributes: { vault: { id: "VAULT-APPLE", status: "VAULTED", customer: { id: "CUSTOMER-APPLE" } } } } },
      }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(caller.captureApplePayOrder({ orderId: "ORDER-APPLE-50", paymentId: 717 }))
      .resolves.toEqual({ success: true, captureId: "CAPTURE-APPLE-50", hasVaultToken: true, vaultStatus: "VAULTED" });
    expect(mocks.updatePayment).toHaveBeenCalledWith(717, expect.objectContaining({
      status: "deposit_paid", paypalVaultToken: "VAULT-APPLE", paypalCustomerId: "CUSTOMER-APPLE",
      paypalVaultPaymentSource: "apple_pay", paypalApplePayConsentAt: expect.any(Date),
      paypalApplePayVaultStatus: "vaulted",
    }));
    expect(mocks.sendPaymentEmailSafely).toHaveBeenCalledWith(expect.objectContaining({ paymentId: 717, chargedAmount: 5000 }));
  });

  it("uses payment_source.apple_pay with a recurring merchant-initiated credential for the later balance", async () => {
    mocks.getPaymentById.mockResolvedValue({ id: 717, remainingAmount: 14900, referralCode: null });
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: "token" }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "ORDER-APPLE-149", status: "COMPLETED" }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(chargePayPalVault(717, "VAULT-APPLE", "sandbox", "apple_pay"))
      .resolves.toEqual({ success: true, captureId: "ORDER-APPLE-149" });
    const payload = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(payload.payment_source).toEqual({
      apple_pay: {
        vault_id: "VAULT-APPLE",
        stored_credentials: { payment_initiator: "MERCHANT", payment_type: "RECURRING", usage: "SUBSEQUENT" },
      },
    });
    expect(payload.payment_source.card).toBeUndefined();
  });

  it("preserves the existing card-vault source for legacy and card deposits", async () => {
    mocks.getPaymentById.mockResolvedValue({ id: 718, remainingAmount: 14900, referralCode: null });
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: "token" }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "ORDER-CARD-149", status: "COMPLETED" }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    await chargePayPalVault(718, "VAULT-CARD", "sandbox");
    const payload = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(payload.payment_source).toEqual({
      card: {
        vault_id: "VAULT-CARD",
        stored_credentials: { payment_initiator: "MERCHANT", payment_type: "UNSCHEDULED", usage: "SUBSEQUENT" },
      },
    });
  });
});
