import { describe, expect, it } from "vitest";
import { createWl2OneTimePaymentRecord, WL2_ONE_TIME_PAYMENT } from "./wl2OneTimePayment";

describe("WL2 one-time payment contract", () => {
  it("creates a $15 payment record with no $149 balance", () => {
    const record = createWl2OneTimePaymentRecord({
      patientName: "Jane Test",
      patientEmail: "jane@example.com",
      patientPhone: "555-0100",
      paymentProvider: "stripe",
      stripeMode: "live",
      paymentIntentId: "pi_wl2_test",
    });

    expect(record).toMatchObject({
      depositAmount: 1500,
      remainingAmount: 0,
      status: "pending",
      landingPage: "/lp/WL2",
      paymentProvider: "stripe",
      stripeMode: "live",
      depositPaymentIntentId: "pi_wl2_test",
    });
  });

  it("defines fully_paid as the terminal status after the $15 capture", () => {
    expect(WL2_ONE_TIME_PAYMENT).toEqual({
      landingPage: "/lp/WL2",
      amountCents: 1500,
      remainingAmountCents: 0,
      finalStatus: "fully_paid",
    });
  });
});
