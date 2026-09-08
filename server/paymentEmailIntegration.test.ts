import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stripeSource = readFileSync(new URL("./routers/stripe.ts", import.meta.url), "utf8");
const paypalSource = readFileSync(new URL("./routers/paypal.ts", import.meta.url), "utf8");
const scheduledSource = readFileSync(new URL("./scheduledChargeHandler.ts", import.meta.url), "utf8");

describe("payment email integration", () => {
  it("sends the first email only from successful Stripe and PayPal deposit completion branches", () => {
    expect(stripeSource).toContain('templateKey: "deposit_paid"');
    expect(stripeSource.indexOf('status: "deposit_paid"')).toBeLessThan(stripeSource.indexOf('templateKey: "deposit_paid"'));
    expect(paypalSource).toContain('templateKey: "deposit_paid"');
    expect(paypalSource.indexOf('status: "deposit_paid"')).toBeLessThan(paypalSource.lastIndexOf('templateKey: "deposit_paid"'));
  });

  it("uses the persisted remaining amount for $149 or referral-adjusted $99 balance emails", () => {
    expect(stripeSource).toContain('templateKey: "balance_paid"');
    expect(stripeSource).toContain("chargedAmount: remainingAmount");
    expect(paypalSource).toContain("chargedAmount: payment.remainingAmount");
    expect(scheduledSource).toContain("chargedAmount: payment.remainingAmount");
  });

  it("covers scheduled Stripe charges and the shared PayPal vault path with the non-blocking sender", () => {
    expect(scheduledSource).toContain('import { sendPaymentEmailSafely } from "./emailService"');
    expect(scheduledSource.indexOf('status: "fully_paid"')).toBeLessThan(scheduledSource.indexOf('templateKey: "balance_paid"'));
    expect(paypalSource).toContain("export async function chargePayPalVault");
    expect(paypalSource).toContain("await sendPaymentEmailSafely({");
  });

  it("keeps WL2 one-time payments outside the new homepage deposit and balance email triggers", () => {
    const wl2StripeBlock = stripeSource.slice(
      stripeSource.indexOf("createWl2OneTimeIntent"),
      stripeSource.indexOf("scheduleRemainingCharge")
    );
    expect(wl2StripeBlock).not.toContain("sendPaymentEmailSafely");
    const wl2PaypalBlock = paypalSource.slice(
      paypalSource.indexOf("createWl2OneTimeOrder"),
      paypalSource.indexOf("scheduleRemainingCharge")
    );
    expect(wl2PaypalBlock).not.toContain("sendPaymentEmailSafely");
  });
});
