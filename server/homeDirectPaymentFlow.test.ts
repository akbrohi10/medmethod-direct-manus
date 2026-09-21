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

describe("homepage two-step physician booking", () => {
  it("opens the homepage physician flow at its minimal contact-details step", () => {
    expect(homeSource).toContain("<LpConsultationModal2");
    expect(homeSource).toContain('landingPage="/"');
    expect(homeSource).toContain("startAtPayment");
    expect(modalSource).toContain("startAtPayment?: boolean;");
    expect(modalSource).toContain("const DIRECT_CONTACT_STEP_VALUE = -1;");
    expect(modalSource).toContain(
      "useState(() => startAtPayment ? DIRECT_CONTACT_STEP_VALUE : 0)",
    );
    expect(modalSource).toContain(
      "setStep(startAtPayment ? DIRECT_CONTACT_STEP_VALUE : 0)",
    );
  });

  it("collects only name, email, and phone before payment in step 1 of 2", () => {
    expect(modalSource).toContain("data-direct-booking-contact-step");
    expect(modalSource).toContain("data-direct-booking-step-1-indicator");
    expect(modalSource).toContain("STEP 1 OF 2");
    expect(modalSource).toContain("data-direct-booking-contact-fields");
    expect(modalSource).toContain(">Name</span>");
    expect(modalSource).toContain(">Email address</span>");
    expect(modalSource).toContain(">Phone number</span>");
    expect(modalSource).toContain('autoComplete="name"');
    expect(modalSource).toContain('autoComplete="email"');
    expect(modalSource).toContain('autoComplete="tel"');
    expect(modalSource).toContain("directBookingContactIsValid");
    expect(modalSource).toContain("isValidPhone(leadData.phone)");
    expect(modalSource).toContain("Continue to Secure Payment");
    expect(modalSource).toContain("setStep(PAYMENT_STEP)");
  });

  it("shows step 2 of 2 and the approved deposit sentence above secure payment fields", () => {
    expect(modalSource).toContain("data-direct-booking-step-2-indicator");
    expect(modalSource).toContain("STEP 2 OF 2");
    expect(modalSource).toContain("data-direct-payment-deposit-prompt");
    expect(modalSource).toContain(
      "Make your $50 deposit now to lock in your appointment.",
    );
    expect(modalSource.indexOf("data-direct-booking-contact-fields")).toBeLessThan(
      modalSource.indexOf("data-direct-booking-step-2-indicator"),
    );
    expect(modalSource.indexOf("data-direct-booking-step-2-indicator")).toBeLessThan(
      modalSource.indexOf("<StripePaymentForm"),
    );
    expect(modalSource).not.toContain("data-direct-payment-contact-fields");
  });

  it("keeps payment identity values and back navigation in the short flow", () => {
    expect(modalSource).toContain(
      'patientEmail={leadData.email.trim() || answers.email || ""}',
    );
    expect(modalSource).toContain(
      "patientPhone={leadData.phone || answers.phone}",
    );
    expect(modalSource).toContain("if (startAtPayment && isPaymentStep)");
    expect(modalSource).toContain("setStep(DIRECT_CONTACT_STEP_VALUE)");
  });

  it("keeps the complete intake and lead-capture implementation intact for other entry points", () => {
    expect(modalSource).toContain("const SERVICE_OPTIONS = [");
    expect(modalSource).toContain("const questions = [");
    expect(modalSource).toContain("<LeadCaptureForm");
    expect(modalSource).toContain("await submitLeadWebhook()");
    expect(modalSource).toContain("const PAYMENT_STEP_VALUE = 8;");
  });
});
