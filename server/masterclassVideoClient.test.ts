import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

const checkout = read(
  "client/src/components/masterclass2/VideoVisitCheckout.tsx"
);
const paypal = read(
  "client/src/components/masterclass2/VideoVisitPaypalPayment.tsx"
);
const stripe = read(
  "client/src/components/masterclass2/VideoVisitStripePayment.tsx"
);
const storage = read(
  "client/src/components/masterclass2/videoVisitCheckoutStorage.ts"
);

describe("masterclass2 $39 video visit client checkout", () => {
  it("is a compact controlled dialog and does not reuse legacy consultation checkout", () => {
    expect(checkout).toContain("export interface VideoVisitCheckoutProps");
    expect(checkout).toContain("open: boolean;");
    expect(checkout).toContain("onClose: () => void;");
    expect(checkout).toContain("data-masterclass2-video-checkout");
    expect(checkout).toContain("max-h-[calc(100dvh-1.5rem)]");
    expect(checkout).toContain("font-['Montserrat',sans-serif]");
    expect(checkout).toContain("$39");
    expect(checkout).not.toContain("LpConsultationModal");
    expect(checkout).not.toContain("ConsultationModal");
    expect(checkout).not.toContain("$199");
    expect(checkout).not.toContain("$50");
  });

  it("states the exact one-time self-pay terms and separate medication note", () => {
    expect(checkout).toContain("one-time $39.00 USD payment");
    expect(checkout).toMatch(
      /no deposit,\s+balance, recurring charge, saved payment method, or subscription/
    );
    expect(checkout).toMatch(
      /Medication, if clinically\s+appropriate, is separate and not included in this visit fee\./
    );
  });

  it("uses only the dedicated public checkout router and hosted provider fields", () => {
    for (const source of [checkout, paypal, stripe]) {
      expect(source).toContain("trpc.masterclassVideo");
      expect(source).not.toMatch(
        /trpc\.(?:paypal|stripe)\.(?:createOrder|captureOrder|createDepositIntent|confirmDeposit)/
      );
    }
    expect(paypal).toContain("PayPalCardFieldsForm");
    expect(paypal).toContain('payment_method: "card"');
    expect(paypal).toContain('payment_method: "apple_pay"');
    expect(paypal).not.toContain("vault:");
    expect(paypal).not.toContain("saveForFuture");
    expect(stripe).toContain("PaymentElement");
    expect(stripe).toContain('redirect: "if_required"');
    expect(stripe).not.toContain("setup_future_usage");
    expect(stripe).not.toContain("createCustomer");
  });

  it("creates only after an explicit selected payment path and retries verification with the same opaque token", () => {
    expect(paypal).toContain(
      'const [method, setMethod] = useState<"card" | "apple_pay">("card")'
    );
    expect(paypal.indexOf('payment_method: "card"')).toBeGreaterThan(
      paypal.indexOf("const startCard")
    );
    expect(paypal.indexOf('payment_method: "apple_pay"')).toBeGreaterThan(
      paypal.indexOf("session.onpaymentauthorized")
    );
    expect(paypal).toContain("checkout_token: created.checkout_token");
    expect(paypal).toContain("Retry secure confirmation");
    expect(stripe).toContain("checkout_token: intent.checkout_token");
    expect(stripe).toContain("Retry secure confirmation");
  });

  it("persists only opaque checkout/provider identifiers and navigates only to the exact receipt route", () => {
    expect(storage).toContain(
      'MASTERCLASS_VIDEO_PENDING_KEY = "masterclass-video-pending-v1"'
    );
    expect(storage).toContain('return value === "/thank-you-video";');
    expect(storage).toContain("window.location.assign(value)");
    expect(storage).not.toContain("patientName");
    expect(storage).not.toContain("patientEmail");
    expect(storage).not.toContain("patientPhone");
    expect(storage).not.toContain("clientSecret");
  });

  it("treats browser storage write and removal failures as non-payment failures", () => {
    expect(storage).toContain(
      "storage.setItem(MASTERCLASS_VIDEO_PENDING_KEY, JSON.stringify(pending));"
    );
    expect(storage).toContain(
      "storage.removeItem(MASTERCLASS_VIDEO_PENDING_KEY);"
    );
    expect(storage).toContain(
      "Private browsing, security policy, or quota failures"
    );
    expect(storage).toContain("Clearing recovery metadata is best-effort");
  });

  it("saves Stripe recovery metadata before 3DS confirmation and restores normal retry after a validation error", () => {
    expect(storage).toContain(
      'phase?: "created" | "confirming" | "provider_approved";'
    );
    expect(storage).toContain('pending.phase !== "confirming"');
    expect(stripe.indexOf('savePendingPhase("confirming");')).toBeLessThan(
      stripe.indexOf("await stripe.confirmPayment({")
    );
    expect(stripe).toContain('savePendingPhase("created");');
    expect(stripe).toContain(
      'const markProviderApproved = () => savePendingPhase("provider_approved");'
    );
  });

  it("uses the stored provider's strict server confirmation before config or provider SDK checkout", () => {
    expect(checkout).toContain("function PendingPaymentConfirmation");
    expect(checkout).toContain(
      "trpc.masterclassVideo.confirmStripePayment.useMutation()"
    );
    expect(checkout).toContain(
      "trpc.masterclassVideo.capturePaypalOrder.useMutation()"
    );
    expect(checkout).toContain(
      'pending?.phase === "confirming" || pending?.phase === "provider_approved"'
    );
    expect(checkout).toContain(
      'enabled: open && step === "payment" && !serverConfirmationPending'
    );
    expect(checkout).toContain("{serverConfirmationPending && pending && (");
    expect(checkout).toContain("const stored = safePendingCheckout();");
    expect(checkout).toContain(
      "if (stored && needsServerConfirmation(stored)) {"
    );
  });
});
