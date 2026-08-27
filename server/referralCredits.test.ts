import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  LECTURE50_REFERRAL_CREDIT,
  STANDARD_CONSULTATION_PRICING,
  formatUsdFromCents,
  normalizeReferralCode,
  resolveReferralCredit,
} from "./referralCredits";

const readProjectFile = (path: string) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

describe("LECTURE50 referral-credit rules", () => {
  it("normalizes the code and applies the approved homepage pricing", () => {
    expect(normalizeReferralCode(" lecture50 ")).toBe("LECTURE50");

    expect(resolveReferralCredit(" lecture50 ", "/")).toEqual({
      applied: true,
      ...LECTURE50_REFERRAL_CREDIT,
    });
  });

  it("preserves the $50 deposit and reduces only the later balance by $50", () => {
    const result = resolveReferralCredit("LECTURE50", "/");

    expect(result.depositAmount).toBe(5_000);
    expect(result.remainingAmount).toBe(9_900);
    expect(result.referralCreditAmount).toBe(5_000);
    expect(result.consultationTotalAmount).toBe(14_900);
    expect(result.depositAmount + result.remainingAmount).toBe(result.consultationTotalAmount);
  });

  it("does not apply the code on shared landing-page checkout flows", () => {
    expect(resolveReferralCredit("LECTURE50", "/lp/hrt3")).toEqual({
      applied: false,
      code: "LECTURE50",
      ...STANDARD_CONSULTATION_PRICING,
    });
  });

  it("preserves standard pricing for unrecognized codes", () => {
    expect(resolveReferralCredit("NOT-A-CODE", "/")).toEqual({
      applied: false,
      code: "NOT-A-CODE",
      ...STANDARD_CONSULTATION_PRICING,
    });
    expect(formatUsdFromCents(9_900)).toBe("99.00");
  });
});

describe("referral-credit payment integration", () => {
  const schema = readProjectFile("drizzle/schema.ts");
  const migration = readProjectFile("drizzle/0009_luxuriant_alex_wilder.sql");
  const appRouter = readProjectFile("server/routers.ts");
  const referralRouter = readProjectFile("server/routers/referralCredits.ts");
  const stripeRouter = readProjectFile("server/routers/stripe.ts");
  const paypalRouter = readProjectFile("server/routers/paypal.ts");
  const ghlHandler = readProjectFile("server/ghlWebhookHandler.ts");
  const modal = readProjectFile("client/src/components/home1/LpConsultationModal2.tsx");
  const stripeForm = readProjectFile("client/src/components/home1/StripePaymentForm.tsx");
  const paypalForm = readProjectFile("client/src/components/home1/PayPalPaymentForm.tsx");

  it("persists the consultation total, referral code, and credit with non-destructive defaults", () => {
    expect(schema).toContain('consultationTotalAmount: int("consultationTotalAmount").default(19900).notNull()');
    expect(schema).toContain('referralCode: varchar("referralCode", { length: 64 })');
    expect(schema).toContain('referralCreditAmount: int("referralCreditAmount").default(0).notNull()');
    expect(migration).toContain("ADD `consultationTotalAmount` int DEFAULT 19900 NOT NULL");
    expect(migration).toContain("ADD `referralCode` varchar(64)");
    expect(migration).toContain("ADD `referralCreditAmount` int DEFAULT 0 NOT NULL");
  });

  it("registers a server-only redemption endpoint with homepage and pending-payment guards", () => {
    expect(appRouter).toContain("referralCredits: referralCreditsRouter");
    expect(referralRouter).toContain('payment.landingPage !== "/"');
    expect(referralRouter).toContain('payment.status !== "pending"');
    expect(referralRouter).toContain("resolveReferralCredit(input.code, payment.landingPage)");
    expect(referralRouter).toContain("remainingAmount: resolved.remainingAmount");
  });

  it("charges the trusted persisted remaining amount in Stripe, PayPal, and GHL scheduling paths", () => {
    expect(stripeRouter.match(/amount: remainingAmount/g)?.length).toBeGreaterThanOrEqual(2);
    expect(paypalRouter).toContain('value: remainingAmountUsd');
    expect(paypalRouter).toContain("const payment = await getPaymentById(paymentId)");
    expect(ghlHandler).toContain("const remainingAmount = matchingPayment.remainingAmount");
    expect(ghlHandler).toContain("amount: remainingAmount");
  });

  it("shows the field only on the homepage and forwards referral details to GHL", () => {
    expect(modal).toContain('const referralCodeEnabled = landingPage === "/"');
    expect(modal).toContain("Have a referral code?");
    expect(modal).toContain("Apply Code");
    expect(modal).toContain('if (normalizedCode !== "LECTURE50")');
    expect(modal).toContain("onApplied(LECTURE50_PRICING)");
    expect(modal).toContain("persistedPaymentIdRef.current = paymentId");
    expect(modal).not.toContain("disabled={!paymentId || !code.trim()");
    expect(modal).toContain('referral_code: referralPricing.referralCode ?? ""');
    expect(modal).toContain("referral_credit_amount:");
    expect(modal).toContain("remaining_balance:");
  });

  it("renders provider-agnostic pricing from trusted server results", () => {
    for (const source of [stripeForm, paypalForm]) {
      expect(source).toContain("consultationTotalAmountCents");
      expect(source).toContain("remainingAmountCents");
      expect(source).toContain("referralCreditAmountCents");
      expect(source).toContain("Referral credit applied");
    }
  });
});
