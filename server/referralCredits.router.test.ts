import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  getPaymentById: vi.fn(),
  updatePayment: vi.fn(),
  getStripeClientForMode: vi.fn(),
}));

vi.mock("./db", () => ({
  getPaymentById: mocks.getPaymentById,
  updatePayment: mocks.updatePayment,
}));

vi.mock("./routers/stripe", () => ({
  getStripeClientForMode: mocks.getStripeClientForMode,
}));

import { referralCreditsRouter } from "./routers/referralCredits";

const basePayment = {
  id: 42,
  landingPage: "/",
  status: "pending",
  paymentProvider: "paypal",
  paypalMode: "sandbox",
  stripeMode: "test",
  depositPaymentIntentId: null,
  consultationTotalAmount: 19_900,
  depositAmount: 5_000,
  remainingAmount: 14_900,
  referralCode: null,
  referralCreditAmount: 0,
};

const caller = referralCreditsRouter.createCaller({
  user: null,
  req: {} as TrpcContext["req"],
  res: {} as TrpcContext["res"],
});

describe("referralCredits.redeem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getPaymentById.mockResolvedValue({ ...basePayment });
    mocks.updatePayment.mockResolvedValue(undefined);
  });

  it("persists the approved LECTURE50 amounts for a pending homepage payment", async () => {
    const result = await caller.redeem({ paymentId: 42, code: " lecture50 " });

    expect(result).toMatchObject({
      applied: true,
      referralCode: "LECTURE50",
      referralCreditAmount: 5_000,
      consultationTotalAmount: 14_900,
      depositAmount: 5_000,
      remainingAmount: 9_900,
    });
    expect(mocks.updatePayment).toHaveBeenCalledWith(42, {
      consultationTotalAmount: 14_900,
      depositAmount: 5_000,
      remainingAmount: 9_900,
      referralCode: "LECTURE50",
      referralCreditAmount: 5_000,
    });
  });

  it("rejects referral codes for shared non-homepage checkouts", async () => {
    mocks.getPaymentById.mockResolvedValue({ ...basePayment, landingPage: "/lp/hrt3" });

    await expect(caller.redeem({ paymentId: 42, code: "LECTURE50" })).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
    expect(mocks.updatePayment).not.toHaveBeenCalled();
  });

  it("rejects changes after the deposit is no longer pending", async () => {
    mocks.getPaymentById.mockResolvedValue({ ...basePayment, status: "deposit_paid" });

    await expect(caller.redeem({ paymentId: 42, code: "LECTURE50" })).rejects.toMatchObject({
      code: "CONFLICT",
    });
    expect(mocks.updatePayment).not.toHaveBeenCalled();
  });

  it("does not alter a payment when the code is unrecognized", async () => {
    const result = await caller.redeem({ paymentId: 42, code: "UNKNOWN" });

    expect(result).toMatchObject({ applied: false, message: "Referral code not recognized" });
    expect(mocks.updatePayment).not.toHaveBeenCalled();
  });

  it("updates Stripe deposit metadata before persisting the referral credit", async () => {
    const updateIntent = vi.fn().mockResolvedValue({ id: "pi_test" });
    mocks.getPaymentById.mockResolvedValue({
      ...basePayment,
      paymentProvider: "stripe",
      depositPaymentIntentId: "pi_test",
    });
    mocks.getStripeClientForMode.mockResolvedValue({
      paymentIntents: { update: updateIntent },
    });

    await caller.redeem({ paymentId: 42, code: "LECTURE50" });

    expect(updateIntent).toHaveBeenCalledWith("pi_test", {
      metadata: {
        referral_code: "LECTURE50",
        referral_credit_amount: "50.00",
        consultation_total_amount: "149.00",
        deposit_amount: "50.00",
        remaining_amount: "99.00",
      },
    });
    expect(mocks.updatePayment).toHaveBeenCalledOnce();
  });
});
