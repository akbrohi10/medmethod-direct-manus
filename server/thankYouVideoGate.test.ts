import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { confirmedIntakeVideoAccess, readIntakeVideoReceipt, INTAKE_RECEIPT_KEY } from "../client/src/components/thank-you-video/receipt";

const receipt = { submission_id: "00000000-0000-4000-8000-000000000123", submission_token: "synthetic-receipt-token-not-real", sms_opt_in: false, video_visit_interest: false, is_test: false, payment_status: "NOT_REQUIRED" as const };
const read = (value: unknown) => readIntakeVideoReceipt({ getItem: key => key === INTAKE_RECEIPT_KEY ? JSON.stringify(value) : null });
const paid = { status: "paid", completion: { submission_id: receipt.submission_id, payment_status: "COMPLETED", capture_id: "mock-capture", environment: "live" } };
const waived = { status: "waived", completion: { submission_id: receipt.submission_id, payment_status: "WAIVED", amount: "0.00" } };

describe("thank-you-video intake and payment gate", () => {
  it("accepts only the same six-key receipt, whether or not the optional box was ticked", () => {
    expect(read(receipt)).toEqual(receipt);
    expect(read({ ...receipt, video_visit_interest: true })).toEqual({ ...receipt, video_visit_interest: true });
    expect(read(null)).toBeNull();
    for (const value of [{ ...receipt, paid: true }, { ...receipt, payment_status: "COMPLETED" }, { ...receipt, submission_token: "" }, { ...receipt, patient_email: "unused@example.test" }, { ...receipt, is_test: "true" }, { ...receipt, video_visit_interest: "true" }]) expect(read(value)).toBeNull();
    expect(readIntakeVideoReceipt({ getItem: () => "not JSON" })).toBeNull();
    expect(readIntakeVideoReceipt({ getItem: () => { throw new Error("Blocked storage"); } })).toBeNull();
  });
  it("unlocks only server-confirmed paid or waived results bound to this submission", () => {
    expect(confirmedIntakeVideoAccess(paid, receipt)).toBe("paid");
    expect(confirmedIntakeVideoAccess(waived, receipt)).toBe("waived");
    expect(confirmedIntakeVideoAccess({ status: "available" }, receipt)).toBe("available");
    expect(confirmedIntakeVideoAccess({ status: "pending" }, receipt)).toBe("pending");
    for (const value of [null, { status: "paid" }, { status: "waived" }, { ...paid, completion: { ...paid.completion, submission_id: "other" } }, { ...paid, completion: { ...paid.completion, payment_status: "APPROVED" } }, { ...paid, completion: { ...paid.completion, capture_id: "" } }, { ...paid, completion: { ...paid.completion, environment: "unknown" } }, { ...waived, completion: { ...waived.completion, amount: "39.00" } }, { ...waived, completion: { ...waived.completion, submission_id: "other" } }, { status: "COMPLETED" }, { status: "paid", paid: true }]) expect(() => confirmedIntakeVideoAccess(value, receipt)).toThrow("do not make another payment");
  });
  it("reuses existing hosted fields, conditional Apple Pay, and referral code with no new payment route", () => {
    const panel = readFileSync("client/src/components/thank-you-video/IntakeVideoPayment.tsx", "utf8");
    const adapter = readFileSync("client/src/components/thank-you-video/checkout.js", "utf8");
    for (const id of ["video-card-name", "video-card-number", "video-card-expiry", "video-card-cvv", "video-coupon-code", "validate-video-coupon", "submit-video-coupon", "video-apple-pay", "recover-video-payment"]) expect(panel).toContain(id);
    expect(panel).toContain("Add Your Zoom Video Visit");
    expect(panel).toContain("Complete your $97 payment below, then pick a time to meet with Dr. Al-Deek.");
    expect(panel).toContain("Pay $97 securely");
    expect(panel).not.toContain("$39");
    for (const phrase of ['const VIDEO_VISIT_AMOUNT = "97.00"', '"/api/intake/video/status"', '"/api/intake/coupon/validate"', '"/api/intake/coupon/submit"', 'createCardFieldsOneTimePaymentSession()', 'createApplePayOneTimePaymentSession()', 'window.ApplePaySession.canMakePayments()', 'aria-label=\\"Pay $97 with Apple Pay\\"', 'body: JSON.stringify({ approval_token: approvalToken })']) expect(adapter).toContain(phrase);
    expect(adapter).not.toContain('"39.00"');
    expect(adapter).not.toContain('window.location.replace(');
    expect(adapter).not.toMatch(/card_number|card_cvv|submission_token=|vault|recurring/);
    expect(adapter).toContain('root.querySelector');
  });
});
