import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createPayment: vi.fn(),
  getPaymentById: vi.fn(),
  getPaypalSettings: vi.fn(),
  updatePayment: vi.fn(),
}));

vi.mock("../db", () => ({
  createPayment: mocks.createPayment,
  getPaymentById: mocks.getPaymentById,
  getPaypalSettings: mocks.getPaypalSettings,
  updatePayment: mocks.updatePayment,
  getAllPayments: vi.fn(),
  upsertPaypalSettings: vi.fn(),
}));

import { paypalRouter } from "./paypal";

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

afterEach(() => vi.unstubAllGlobals());

describe("PayPal WL2 one-time payment procedures", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getPaypalSettings.mockResolvedValue(settings);
  });

  it("creates a $15 WL2 order with no vault or future balance", async () => {
    mocks.createPayment.mockResolvedValue(416);
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: "token" }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "ORDER-WL2-15" }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await caller.createWl2OneTimeOrder({
      patientName: "Jane Test",
      patientEmail: "jane@example.com",
      patientPhone: "555-0100",
    });

    expect(mocks.createPayment).toHaveBeenCalledWith(expect.objectContaining({
      landingPage: "/lp/WL2",
      paymentProvider: "paypal",
      paypalMode: "sandbox",
      depositAmount: 1500,
      remainingAmount: 0,
      status: "pending",
    }));
    const paypalOrderPayload = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(paypalOrderPayload.purchase_units[0].amount.value).toBe("15.00");
    expect(paypalOrderPayload.payment_source.card.attributes.vault).toBeUndefined();
    expect(result).toEqual({ orderId: "ORDER-WL2-15", paymentId: 416 });
  });

  it("finalizes a captured $15 WL2 PayPal payment as fully paid", async () => {
    mocks.getPaymentById.mockResolvedValue({
      id: 416,
      landingPage: "/lp/WL2",
      paymentProvider: "paypal",
      paypalMode: "sandbox",
      paypalOrderId: "ORDER-WL2-15",
    });
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: "token" }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "CAPTURE-WL2-15", status: "COMPLETED" }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(caller.captureWl2OneTimeOrder({ orderId: "ORDER-WL2-15", paymentId: 416 }))
      .resolves.toEqual({ success: true, captureId: "CAPTURE-WL2-15" });

    expect(mocks.updatePayment).toHaveBeenCalledWith(416, {
      paypalOrderId: "ORDER-WL2-15",
      remainingAmount: 0,
      status: "fully_paid",
    });
  });
});
