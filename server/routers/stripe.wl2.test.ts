import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createPayment: vi.fn(),
  getPaymentById: vi.fn(),
  getStripeSettings: vi.fn(),
  updatePayment: vi.fn(),
  createIntent: vi.fn(),
  retrieveIntent: vi.fn(),
}));

vi.mock("../db", () => ({
  createPayment: mocks.createPayment,
  getPaymentById: mocks.getPaymentById,
  getStripeSettings: mocks.getStripeSettings,
  updatePayment: mocks.updatePayment,
  getAllPayments: vi.fn(),
  getPaypalSettings: vi.fn(),
  upsertStripeSettings: vi.fn(),
}));

vi.mock("stripe", () => ({
  default: vi.fn().mockImplementation(() => ({
    paymentIntents: {
      create: mocks.createIntent,
      retrieve: mocks.retrieveIntent,
    },
  })),
}));

import { stripeRouter } from "./stripe";

const caller = stripeRouter.createCaller({} as never);
const settings = {
  id: 1,
  mode: "test" as const,
  testPublishableKey: "pk_test_wl2",
  testSecretKey: "sk_test_wl2",
  livePublishableKey: null,
  liveSecretKey: null,
  updatedAt: new Date(),
};

describe("Stripe WL2 one-time payment procedures", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getStripeSettings.mockResolvedValue(settings);
  });

  it("creates a $15 WL2 intent with no future payment balance", async () => {
    mocks.createIntent.mockResolvedValue({ id: "pi_wl2_15", client_secret: "secret_wl2_15" });
    mocks.createPayment.mockResolvedValue(315);

    const result = await caller.createWl2OneTimeIntent({
      patientName: "Jane Test",
      patientEmail: "jane@example.com",
      patientPhone: "555-0100",
    });

    expect(mocks.createIntent).toHaveBeenCalledWith(expect.objectContaining({
      amount: 1500,
      currency: "usd",
      description: "MedMethod Direct — WL2 $15 refundable appointment hold",
    }));
    expect(mocks.createPayment).toHaveBeenCalledWith(expect.objectContaining({
      landingPage: "/lp/WL2",
      paymentProvider: "stripe",
      depositAmount: 1500,
      remainingAmount: 0,
      status: "pending",
      depositPaymentIntentId: "pi_wl2_15",
    }));
    expect(result).toEqual({ clientSecret: "secret_wl2_15", paymentId: 315 });
  });

  it("finalizes a successful $15 WL2 Stripe payment as fully paid", async () => {
    mocks.getPaymentById.mockResolvedValue({
      id: 315,
      landingPage: "/lp/WL2",
      paymentProvider: "stripe",
      stripeMode: "test",
      depositPaymentIntentId: "pi_wl2_15",
    });
    mocks.retrieveIntent.mockResolvedValue({ status: "succeeded", payment_method: "pm_wl2_15" });

    await expect(caller.confirmWl2OneTimePayment({ paymentId: 315, paymentIntentId: "pi_wl2_15" }))
      .resolves.toEqual({ success: true });

    expect(mocks.updatePayment).toHaveBeenCalledWith(315, {
      stripePaymentMethodId: "pm_wl2_15",
      remainingAmount: 0,
      status: "fully_paid",
    });
  });
});
