import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

const checkout = read(
  "client/src/components/masterclass2/checkout4799/VideoVisitCheckout4799.tsx",
);
const paypal = read(
  "client/src/components/masterclass2/checkout4799/VideoVisitPaypalPayment4799.tsx",
);
const stripe = read(
  "client/src/components/masterclass2/checkout4799/VideoVisitStripePayment4799.tsx",
);
const storage = read(
  "client/src/components/masterclass2/checkout4799/videoVisitCheckout4799Storage.ts",
);
const masterclass2 = read("client/src/pages/Masterclass2.tsx");
const receipt = read("client/src/pages/ThankYouVideo4799.tsx");
const originalReceipt = read("client/src/pages/ThankYouVideo.tsx");
const app = read("client/src/App.tsx");
const router = read("server/routers/masterclassVideo4799.ts");
const registry = read("server/routers.ts");
const newCheckout = checkout.slice(checkout.indexOf("function NewVideoVisitCheckout4799"));

function count(source: string, value: string) {
  return source.split(value).length - 1;
}

describe("masterclass2 $47.99 video visit client checkout", () => {
  it("uses only the dedicated registered router and exact $47.99 one-time checkout contract", () => {
    expect(registry).toContain(
      'import { masterclassVideo4799Router } from "./routers/masterclassVideo4799";',
    );
    expect(registry).toContain("masterclassVideo4799: masterclassVideo4799Router,");
    expect(router).toContain("export const MASTERCLASS_VIDEO_4799_PAYMENT");
    expect(router).toContain("amountCents: 4799");
    expect(router).toContain('amountUsd: "47.99"');
    expect(router).toContain('source: "/masterclass2" as const');
    expect(router).toContain('return { redirect_url: "/thank-you-video-4799" as const };');

    for (const source of [checkout, paypal, stripe]) {
      expect(source).toContain("trpc.masterclassVideo4799");
      expect(source).not.toContain("trpc.masterclassVideo.");
      expect(source).not.toMatch(
        /trpc\.(?:paypal|stripe)\.(?:createOrder|captureOrder|createDepositIntent|confirmDeposit)/,
      );
    }
    expect(router).not.toContain("vault:");
    expect(router).not.toContain("stored_credentials");
    expect(router).not.toContain("setup_future_usage");
    expect(router).not.toContain("customer:");
    expect(router).not.toContain("createCustomer(");
  });

  it("discloses the exact one-time self-pay terms and keeps provider card data in hosted fields", () => {
    expect(checkout).toContain("Pay $47.99 now");
    expect(checkout).toContain("one-time $47.99 USD payment");
    expect(checkout).toMatch(
      /no deposit,\s+balance, recurring charge, saved payment method, or subscription/,
    );
    expect(checkout).toMatch(
      /Medication, if clinically\s+appropriate, is separate and not included in this visit fee\./,
    );
    expect(checkout).toMatch(
      /Card details are entered only in secure provider-hosted payment\s+fields\./,
    );
    expect(checkout).not.toContain("LpConsultationModal");
    expect(checkout).not.toContain("ConsultationModal");
    expect(newCheckout).not.toContain("$39");
    expect(newCheckout).not.toContain("$199");
    expect(newCheckout).not.toContain("$50");
  });

  it("uses the dedicated opaque pending key, exact receipt allowlist, and legacy-first merged pending helper", () => {
    expect(storage).toContain(
      'MASTERCLASS_VIDEO_4799_PENDING_KEY = "masterclass-video4799-pending-v1"',
    );
    expect(storage).toContain(
      'import { getVideoVisitPendingCheckout as getLegacyVideoVisitPendingCheckout } from "../videoVisitCheckoutStorage";',
    );
    expect(storage).toContain(
      "return getLegacyVideoVisitPendingCheckout() ?? getVideoVisitPendingCheckout();",
    );
    expect(storage).toContain('return value === "/thank-you-video-4799";');
    expect(storage).toContain("window.location.assign(value)");
    for (const forbiddenValue of [
      "patientName",
      "patientEmail",
      "patientPhone",
      "clientSecret",
    ]) {
      expect(storage).not.toContain(forbiddenValue);
    }
    expect(storage).toContain(
      "storage.setItem(MASTERCLASS_VIDEO_4799_PENDING_KEY, JSON.stringify(pending));",
    );
    expect(storage).toContain(
      "storage.removeItem(MASTERCLASS_VIDEO_4799_PENDING_KEY);",
    );
    expect(storage).toContain("Private browsing, security policy, or quota failures");
    expect(storage).toContain("Clearing recovery metadata is best-effort");
  });

  it("delegates an existing legacy $39 pending payment before it can initialize a $47.99 checkout", () => {
    expect(checkout).toContain(
      'import LegacyVideoVisitCheckout from "../VideoVisitCheckout";',
    );
    expect(checkout).toContain(
      'import { getVideoVisitPendingCheckout as getLegacyVideoVisitPendingCheckout } from "../videoVisitCheckoutStorage";',
    );
    expect(checkout).toContain(
      "const legacyPending = props.open ? getLegacyVideoVisitPendingCheckout() : null;",
    );
    expect(checkout).toContain(
      "return legacyPending\n    ? <LegacyVideoVisitCheckout {...props} />\n    : <NewVideoVisitCheckout4799 {...props} />;",
    );
    expect(checkout.indexOf("const legacyPending")).toBeLessThan(
      checkout.indexOf("function NewVideoVisitCheckout4799"),
    );
    expect(masterclass2).toContain(
      'import VideoVisitCheckout from "@/components/masterclass2/checkout4799/VideoVisitCheckout4799";',
    );
    expect(masterclass2).toContain(
      'import { getMasterclass2VideoPendingCheckout as getVideoVisitPendingCheckout } from "@/components/masterclass2/checkout4799/videoVisitCheckout4799Storage";',
    );
    expect(masterclass2).toContain(
      'const pendingCheckout = getVideoVisitPendingCheckout();',
    );
    expect(masterclass2).toContain(
      '<VideoVisitCheckout open={consultationOpen} onClose={() => setConsultationOpen(false)} />',
    );
  });

  it("creates only selected card or eligible Apple Pay paths and preserves the exact $47.99 Apple Pay total", () => {
    expect(paypal).toContain("PayPalCardFieldsForm");
    expect(paypal).toContain('payment_method: "card"');
    expect(paypal).toContain('payment_method: "apple_pay"');
    expect(paypal).toContain('components: "card-fields,applepay"');
    expect(paypal).toContain("ApplePaySession");
    expect(paypal).toContain("Session.canMakePayments()");
    expect(paypal).toContain("paypalApplePay.config()");
    expect(paypal).toContain("if (!active || !nextConfig.isEligible) return;");
    expect(paypal).toContain('amount: "47.99"');
    expect(paypal).toContain("session.onpaymentauthorized = event => {");
    expect(paypal.indexOf('payment_method: "apple_pay"')).toBeGreaterThan(
      paypal.indexOf("session.onpaymentauthorized"),
    );
    expect(paypal).toContain("saveVideoVisitPendingCheckout({");
    expect(paypal).toContain('paymentMethod: "apple_pay"');
    expect(paypal).toContain("if (!applePay || !config) return null;");
    expect(paypal).toContain("data-masterclass2-video-apple-pay");
    expect(paypal).not.toContain("vault:");
    expect(paypal).not.toContain("saveForFuture");
  });

  it("uses Stripe Payment Element fields, returns 3DS to /masterclass2, and saves recovery metadata first", () => {
    expect(stripe).toContain("PaymentElement");
    expect(stripe).toContain('redirect: "if_required"');
    expect(stripe).toContain('return_url: `${window.location.origin}/masterclass2`');
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
    expect(stripe).toContain("Retry secure confirmation");
    expect(stripe).not.toContain("setup_future_usage");
    expect(stripe).not.toContain("createCustomer");
  });

  it("keeps the masterclass2 landing paid actions at $97 while preserving the local $47.99 checkout alias and same JSX mount", () => {
    expect(masterclass2).toContain("Only $97");
    expect(masterclass2).toContain('aria-label="Video visit — $97 per visit"');
    expect(masterclass2).toContain(
      '<span className="block whitespace-nowrap text-[10px] font-normal">$97 per visit</span>',
    );
    expect(masterclass2).not.toContain("$39");
    expect(count(masterclass2, "VideoVisitCheckout")).toBeGreaterThanOrEqual(2);
  });

  it("registers exactly one exact receipt route and keeps its calendar and styles identical apart from approved price/name changes", () => {
    expect(app).toContain(
      'const ThankYouVideo4799 = lazy(() => import("@/pages/ThankYouVideo4799"));',
    );
    expect(app).toContain(
      '<Route path="/thank-you-video-4799" component={ThankYouVideo4799} />',
    );
    expect(count(app, 'path="/thank-you-video-4799"')).toBe(1);
    expect(app).not.toContain('path="/thank-you-video-4799/"');
    expect(receipt).toContain("export default function ThankYouVideo4799()");
    expect(receipt).toContain("Your $47.99 Zoom video visit payment is confirmed.");
    const constants = (source: string) => source.slice(source.indexOf('const BRAND_ACCENT'), source.indexOf('const steps'));
    const calendarParameters = (source: string) => source.slice(source.indexOf('  const calendarParams'), source.indexOf('  const spacing'));
    const iframe = (source: string) => source.slice(source.indexOf('<iframe'), source.indexOf('/>', source.indexOf('<iframe')) + 2);
    expect(constants(receipt)).toBe(constants(originalReceipt));
    expect(calendarParameters(receipt)).toBe(calendarParameters(originalReceipt));
    expect(iframe(receipt)).toBe(iframe(originalReceipt));
    expect(receipt).toContain("You're Booked!");
    expect(receipt).toContain("Accept Your Calendar Invite");
    expect(receipt).toContain("Reply to Our Text to Secure Your Spot");
    expect(receipt).toContain('text: "Create Account"');
    expect(receipt).not.toContain("One Last Step: Pick Your Time");
  });
});
