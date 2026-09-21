import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const homeSource = readFileSync(
  resolve(root, "client/src/pages/HomeHrt3.tsx"),
  "utf8",
);
const modalSource = readFileSync(
  resolve(root, "client/src/components/home1/LpConsultationModal2.tsx"),
  "utf8",
);

describe("homepage checkout-first physician booking", () => {
  it("opens the homepage physician flow at the secure payment step", () => {
    expect(homeSource).toContain("<LpConsultationModal2");
    expect(homeSource).toContain("landingPage=\"/\"");
    expect(homeSource).toContain("startAtPayment");
    expect(modalSource).toContain("startAtPayment?: boolean;");
    expect(modalSource).toContain("const PAYMENT_STEP_VALUE = 8;");
    expect(modalSource).toContain(
      "useState(() => startAtPayment ? PAYMENT_STEP_VALUE : 0)",
    );
  });

  it("shows the approved deposit sentence above the secure payment fields", () => {
    expect(modalSource).toContain("data-direct-payment-deposit-prompt");
    expect(modalSource).toContain(
      "Make your $50 deposit now to lock in your appointment.",
    );
    expect(modalSource).toContain("data-direct-payment-contact-fields");
    expect(modalSource.indexOf("data-direct-payment-deposit-prompt")).toBeLessThan(
      modalSource.indexOf("data-direct-payment-contact-fields"),
    );
    expect(modalSource.indexOf("data-direct-payment-contact-fields")).toBeLessThan(
      modalSource.indexOf("<StripePaymentForm"),
    );
  });

  it("keeps the complete intake and lead-capture implementation intact for other entry points", () => {
    expect(modalSource).toContain("const SERVICE_OPTIONS = [");
    expect(modalSource).toContain("const questions = [");
    expect(modalSource).toContain("<LeadCaptureForm");
    expect(modalSource).toContain("await submitLeadWebhook()");
    expect(modalSource).toContain("{isPaymentStep && !startAtPayment && (");
  });
});
