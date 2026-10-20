import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const modal = readFileSync(resolve(process.cwd(), "client/src/components/home1/LpConsultationModal2.tsx"), "utf8");
const page = readFileSync(resolve(process.cwd(), "client/src/pages/MasterclassVideoFirst.tsx"), "utf8");

describe("masterclass payment popup sizing", () => {
  it("expands only the masterclass payment step, not contact details or other entry points", () => {
    expect(modal).toContain('const isExpandedMasterclassPayment = landingPage === "/masterclass" && isPaymentStep;');
    expect(modal).toContain("data-masterclass-payment-expanded={isExpandedMasterclassPayment || undefined}");
    expect(page).toContain('landingPage="/masterclass" startAtPayment');
  });

  it("preserves existing default and calendar sizes while adding a wider payment-only override", () => {
    expect(modal).toContain("maxWidth: isCalendarStep ? 860 : 480,");
    expect(modal).toContain('maxHeight: "min(86dvh, 720px)",');
    expect(modal).toContain("...(isExpandedMasterclassPayment ? {");
    expect(modal).toContain("maxWidth: 680,");
    expect(modal).toContain('maxHeight: "min(94dvh, 960px, calc(100dvh - max(1rem, env(safe-area-inset-top)) - max(1rem, env(safe-area-inset-bottom))))",');
  });

  it("keeps payment within phone safe areas and retains one accessible outer scroll body", () => {
    expect(modal).toContain('isExpandedMasterclassPayment ? "translate-y-0" : "-translate-y-[2svh]"');
    expect(modal).toContain('<div className="flex-1 overflow-y-auto" ref={scrollBodyRef}>');
    expect(modal).toContain('className="flex-shrink-0 px-6 pt-2 pb-4 bg-white border-t border-gray-50"');
  });

  it("preserves hosted payment components, identity, deposit guidance, and return navigation", () => {
    expect(modal).toContain("<PayPalPaymentForm");
    expect(modal).toContain('enableApplePay={landingPage === "/masterclass"}');
    expect(modal).toContain("<StripePaymentForm");
    expect(modal).toContain('patientEmail={leadData.email.trim() || answers.email || ""}');
    expect(modal).toContain("patientPhone={leadData.phone || answers.phone}");
    expect(modal).toContain("Make your <strong>$50 deposit today</strong>.");
    expect(modal).toContain("if (startAtPayment && isPaymentStep)");
    expect(modal).toContain('window.location.assign("/thank-you");');
  });
});
