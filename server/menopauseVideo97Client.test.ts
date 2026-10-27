import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  getVideoVisitReceipt97,
  saveVideoVisitReceipt97,
  type VideoVisitPendingCheckout,
} from "../client/src/components/weight-loss-menopause-v2/checkout97/videoVisitCheckout97Storage";

const root = process.cwd();
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

const checkout = read(
  "client/src/components/weight-loss-menopause-v2/checkout97/VideoVisitCheckout97.tsx",
);
const paypal = read(
  "client/src/components/weight-loss-menopause-v2/checkout97/VideoVisitPaypalPayment97.tsx",
);
const stripe = read(
  "client/src/components/weight-loss-menopause-v2/checkout97/VideoVisitStripePayment97.tsx",
);
const storage = read(
  "client/src/components/weight-loss-menopause-v2/checkout97/videoVisitCheckout97Storage.ts",
);
const mobileBar = read("client/src/pages/WeightLossMenopauseV2MobileBar.tsx");
const v2Page = read("client/src/pages/WeightLossMenopauseV2.tsx");
const receipt = read("client/src/pages/ThankYouVideo97.tsx");
const app = read("client/src/App.tsx");
const legacyCheckout = read("client/src/components/masterclass2/VideoVisitCheckout.tsx");
const legacyStorage = read("client/src/components/masterclass2/videoVisitCheckoutStorage.ts");
const checkout4799 = read(
  "client/src/components/masterclass2/checkout4799/VideoVisitCheckout4799.tsx",
);
const storage4799 = read(
  "client/src/components/masterclass2/checkout4799/videoVisitCheckout4799Storage.ts",
);
const masterclass2 = read("client/src/pages/Masterclass2.tsx");

const newCheckout = checkout.slice(checkout.indexOf("function NewVideoVisitCheckout97"));

type MemoryStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

function memoryStorage(initial: Record<string, string> = {}): MemoryStorage {
  const values = new Map(Object.entries(initial));
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
  };
}

function count(source: string, value: string) {
  return source.split(value).length - 1;
}

describe("Weight-Loss & Menopause V2 $97 video visit client checkout", () => {
  it("uses only the dedicated menopauseVideo97 API and exact $97 checkout contract", () => {
    for (const source of [checkout, paypal, stripe]) {
      expect(source).toContain("trpc.menopauseVideo97");
      expect(source).not.toContain("trpc.masterclassVideo.");
      expect(source).not.toContain("trpc.masterclassVideo4799.");
      expect(source).not.toMatch(
        /trpc\.(?:paypal|stripe)\.(?:createOrder|captureOrder|createDepositIntent|confirmDeposit)/,
      );
    }

    expect(checkout).toContain("single $97.00 self-pay video visit");
    expect(checkout).toContain("Pay $97.00 now");
    expect(checkout).toContain("one-time $97.00 USD payment");
    expect(checkout).toMatch(
      /no deposit,\s+balance, recurring charge, saved payment method, or subscription/,
    );
    expect(checkout).toMatch(
      /Card details are entered only in secure provider-hosted payment\s+fields\./,
    );
    expect(newCheckout).not.toContain("$39");
    expect(newCheckout).not.toContain("$47.99");
    expect(newCheckout).not.toContain("$199");
    expect(newCheckout).not.toContain("$50");
  });

  it("holds the PayPal card and eligible Apple Pay paths to 97.00 USD without vaulting", () => {
    expect(paypal).toContain("PayPalCardFieldsForm");
    expect(paypal).toContain('payment_method: "card"');
    expect(paypal).toContain('payment_method: "apple_pay"');
    expect(paypal).toContain('components: "card-fields,applepay"');
    expect(paypal).toContain("ApplePaySession");
    expect(paypal).toContain("Session.canMakePayments()");
    expect(paypal).toContain("paypalApplePay.config()");
    expect(paypal).toContain('currencyCode: "USD"');
    expect(paypal).toContain('amount: "97.00"');
    expect(paypal).toContain('label: "MedMethod Direct Video Visit"');
    expect(paypal).toContain("session.onpaymentauthorized = event => {");
    expect(paypal.indexOf('payment_method: "apple_pay"')).toBeGreaterThan(
      paypal.indexOf("session.onpaymentauthorized"),
    );
    expect(paypal).toContain("saveVideoVisitPendingCheckout({");
    expect(paypal).toContain('paymentMethod: "apple_pay"');
    expect(paypal).toContain("data-menopause-v2-video97-apple-pay");
    expect(paypal).not.toContain("vault:");
    expect(paypal).not.toContain("saveForFuture");
  });

  it("uses Stripe Payment Element confirmation recovery and returns 3DS only to the V2 landing page", () => {
    expect(stripe).toContain("PaymentElement");
    expect(stripe).toContain('redirect: "if_required"');
    expect(stripe).toContain(
      'return_url: `${window.location.origin}/weight-loss-menopauseV2`',
    );
    expect(stripe).toContain('address: { country: "never", postalCode: "auto" }');
    expect(stripe).toContain('terms: { card: "never" }');
    expect(stripe.indexOf('savePendingPhase("confirming");')).toBeLessThan(
      stripe.indexOf("await stripe.confirmPayment({"),
    );
    expect(stripe).toContain('savePendingPhase("created");');
    expect(stripe).toContain(
      'const markProviderApproved = () => savePendingPhase("provider_approved");',
    );
    expect(stripe).toContain("checkout_token: intent.checkout_token");
    expect(stripe).toContain("Pay $97.00 now");
    expect(stripe).not.toContain("setup_future_usage");
    expect(stripe).not.toContain("createCustomer");
  });

  it("uses a distinct opaque V2 pending namespace, exact receipt route allowlist, and stores no PHI or provider secret", () => {
    expect(storage).toContain(
      'MENOPAUSE_VIDEO_97_PENDING_KEY = "menopause-video97-pending-v1"',
    );
    expect(storage).toContain(
      'MENOPAUSE_VIDEO_97_RECEIPT_KEY = "menopause-video97-receipt-v1"',
    );
    expect(storage).toContain(
      'import { getVideoVisitPendingCheckout as getLegacyVideoVisitPendingCheckout } from "../../masterclass2/videoVisitCheckoutStorage";',
    );
    expect(storage).toContain(
      "return getLegacyVideoVisitPendingCheckout() ?? getVideoVisitPendingCheckout();",
    );
    expect(storage).toContain('return value === "/thank-you-video-97";');
    expect(storage).toContain("window.location.assign(value)");
    expect(storage).toContain(
      "storage.setItem(MENOPAUSE_VIDEO_97_PENDING_KEY, JSON.stringify(pending));",
    );
    expect(storage).toContain(
      "storage.removeItem(MENOPAUSE_VIDEO_97_PENDING_KEY);",
    );
    expect(storage).toContain(
      "storage.setItem(MENOPAUSE_VIDEO_97_RECEIPT_KEY, serialized);",
    );

    for (const forbiddenValue of [
      "patientName",
      "patientEmail",
      "patientPhone",
      "clientSecret",
      "billing_details",
    ]) {
      expect(storage).not.toContain(forbiddenValue);
    }
  });

  it("rejects malformed receipt records locally and saves only the three opaque identifiers", () => {
    const key = "menopause-video97-receipt-v1";
    const validPending: VideoVisitPendingCheckout = {
      version: 1,
      provider: "stripe",
      checkoutId: "1a2b3c4d-5e6f-4a8b-9c0d-1e2f3a4b5c6d",
      checkoutToken: "opaque-checkout-token",
      paymentIntentId: "pi_opaque_only",
      phase: "provider_approved",
    };
    const saved = memoryStorage();

    expect(saveVideoVisitReceipt97(validPending, saved)).toBe(true);
    expect(JSON.parse(saved.getItem(key)!)).toEqual({
      provider: "stripe",
      providerId: "pi_opaque_only",
      checkout_token: "opaque-checkout-token",
    });

    for (const malformed of [
      "not-json",
      JSON.stringify(null),
      JSON.stringify({}),
      JSON.stringify({ provider: "stripe", providerId: "pi_1" }),
      JSON.stringify({ provider: "stripe", providerId: "pi_1", checkout_token: "token", extra: "forged" }),
      JSON.stringify({ provider: "unknown", providerId: "pi_1", checkout_token: "token" }),
      JSON.stringify({ provider: "stripe", providerId: "", checkout_token: "token" }),
      JSON.stringify({ provider: "stripe", providerId: "pi_1", checkout_token: "" }),
    ]) {
      expect(getVideoVisitReceipt97(memoryStorage({ [key]: malformed }))).toBeNull();
    }
  });

  it("does not trust a shape-valid forged receipt: only receiptStatus paid:true and exact 97.00 can reach the calendar", () => {
    const key = "menopause-video97-receipt-v1";
    const forgedButWellShaped = {
      provider: "paypal",
      providerId: "forged-order-id",
      checkout_token: "forged-token",
    };
    expect(
      getVideoVisitReceipt97(
        memoryStorage({ [key]: JSON.stringify(forgedButWellShaped) }),
      ),
    ).toEqual(forgedButWellShaped);

    expect(receipt).toContain(
      'import { getVideoVisitReceipt97 } from "@/components/weight-loss-menopause-v2/checkout97/videoVisitCheckout97Storage";',
    );
    expect(receipt).toContain(
      "trpc.menopauseVideo97.receiptStatus.useQuery(receipt ?? MISSING_RECEIPT, {",
    );
    expect(receipt).toContain("enabled: !!receipt,");
    expect(receipt).toContain(
      'const paid = !!receipt && receiptStatus.data?.paid === true && receiptStatus.data.amountUsd === "97.00";',
    );
    expect(receipt).toContain("if (!paid) {");
    expect(receipt).toContain("data-video97-payment-gate");
    expect(receipt).toContain("A verified $97 video visit payment is required");
    expect(receipt.indexOf("if (!paid) {")).toBeLessThan(
      receipt.indexOf("<iframe"),
    );
    expect(receipt).not.toContain("receipt.status");
    expect(receipt).not.toContain("localStorage");
    expect(receipt).not.toContain("sessionStorage");
  });

  it("keeps the V2 page and mobile control at the authorized $97 labels while preserving all other mobile navigation destinations", () => {
    expect(v2Page).toContain("<div><dt>Video visit</dt><dd>$97</dd></div>");
    expect(v2Page).toContain("A virtual Zoom visit is $97");
    expect(v2Page).not.toContain("$39");
    expect(v2Page).not.toContain("$47.99");

    expect(mobileBar).toContain(
      'import VideoVisitCheckout from "@/components/weight-loss-menopause-v2/checkout97/VideoVisitCheckout97";',
    );
    expect(mobileBar).toContain('aria-label="Video visit — $97 per visit"');
    expect(mobileBar).toContain(
      '<span className="block whitespace-nowrap text-[10px] font-normal">$97 per visit</span>',
    );
    expect(mobileBar).toContain('href="https://intake.medmethoddirect.com/"');
    expect(mobileBar).toContain('href="tel:+18883627011"');
    expect(mobileBar).toContain('aria-label="First text visit — free"');
    expect(mobileBar).toContain(
      'aria-label="Call now for more information: (888) 362-7011"',
    );
  });

  it("delegates an old $39 pending payment before the $97 checkout can initialize, and mount recovery preserves that priority", () => {
    expect(checkout).toContain(
      'import LegacyVideoVisitCheckout from "../../masterclass2/VideoVisitCheckout";',
    );
    expect(checkout).toContain(
      'import { getVideoVisitPendingCheckout as getLegacyVideoVisitPendingCheckout } from "../../masterclass2/videoVisitCheckoutStorage";',
    );
    expect(checkout).toContain(
      "const legacyPending = props.open ? getLegacyVideoVisitPendingCheckout() : null;",
    );
    expect(checkout).toContain(
      "return legacyPending\n    ? <LegacyVideoVisitCheckout {...props} />\n    : <NewVideoVisitCheckout97 {...props} />;",
    );
    expect(checkout.indexOf("const legacyPending")).toBeLessThan(
      checkout.indexOf("function NewVideoVisitCheckout97"),
    );
    expect(newCheckout).not.toContain("getLegacyVideoVisitPendingCheckout");
    expect(mobileBar).toContain(
      'import { getMenopauseV2VideoPendingCheckout } from "@/components/weight-loss-menopause-v2/checkout97/videoVisitCheckout97Storage";',
    );
    expect(mobileBar).toContain(
      "if (getMenopauseV2VideoPendingCheckout()) setConsultationOpen(true);",
    );
  });

  it("registers exactly one $97 receipt route and leaves $39 and $47.99 client contracts distinct", () => {
    expect(app).toContain(
      'const ThankYouVideo97 = lazy(() => import("@/pages/ThankYouVideo97"));',
    );
    expect(app).toContain(
      '<Route path="/thank-you-video-97" component={ThankYouVideo97} />',
    );
    expect(count(app, 'path="/thank-you-video-97"')).toBe(1);
    expect(app).toContain(
      'if (location === "/thank-you-video-97" || location === "/thank-you-video-97/") return null;',
    );

    expect(legacyCheckout).toContain("single $39.00 self-pay video visit");
    expect(legacyCheckout).toContain("Pay $39 now");
    expect(legacyCheckout).toContain("trpc.masterclassVideo");
    expect(legacyStorage).toContain(
      'MASTERCLASS_VIDEO_PENDING_KEY = "masterclass-video-pending-v1"',
    );
    expect(legacyStorage).toContain('return value === "/thank-you-video";');
    expect(legacyCheckout).not.toContain("menopauseVideo97");

    expect(checkout4799).toContain("single $47.99 self-pay video visit");
    expect(checkout4799).toContain("trpc.masterclassVideo4799");
    expect(storage4799).toContain(
      'MASTERCLASS_VIDEO_4799_PENDING_KEY = "masterclass-video4799-pending-v1"',
    );
    expect(storage4799).toContain('return value === "/thank-you-video-4799";');
    expect(masterclass2).toContain("Only $97");
    expect(masterclass2).not.toContain("menopauseVideo97");
  });
});
