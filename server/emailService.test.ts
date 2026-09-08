import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createEmailDeliveryLog: vi.fn(),
  getEmailDeliveryLogByEventKey: vi.fn(),
  getEmailSettings: vi.fn(),
  getEmailTemplateByKey: vi.fn(),
  getPaymentById: vi.fn(),
  upsertEmailTemplate: vi.fn(),
  updateEmailDeliveryLog: vi.fn(),
  decryptEmailCredential: vi.fn(),
}));

vi.mock("./db", () => ({
  createEmailDeliveryLog: mocks.createEmailDeliveryLog,
  getEmailDeliveryLogByEventKey: mocks.getEmailDeliveryLogByEventKey,
  getEmailSettings: mocks.getEmailSettings,
  getEmailTemplateByKey: mocks.getEmailTemplateByKey,
  getPaymentById: mocks.getPaymentById,
  upsertEmailTemplate: mocks.upsertEmailTemplate,
  updateEmailDeliveryLog: mocks.updateEmailDeliveryLog,
}));

vi.mock("./emailCredentialCrypto", () => ({
  decryptEmailCredential: mocks.decryptEmailCredential,
}));

import { sendPaymentEmail, sendPaymentEmailSafely } from "./emailService";

const templates = {
  deposit_paid: {
    templateKey: "deposit_paid",
    displayName: "Initial payment",
    subject: "Deposit {{deposit_amount}} received",
    htmlBody: "<p>Hello {{patient_name}}. Balance: {{remaining_amount}}</p>",
    textBody: "Hello {{patient_name}}. Balance: {{remaining_amount}}",
  },
  balance_paid: {
    templateKey: "balance_paid",
    displayName: "Balance payment",
    subject: "Balance {{charged_amount}} received",
    htmlBody: "<p>{{charged_amount}} paid for {{appointment_date}}</p>",
    textBody: "{{charged_amount}} paid for {{appointment_date}}",
  },
};

const payment = {
  id: 42,
  patientName: "Jordan <Test>",
  patientEmail: "jordan@example.com",
  depositAmount: 5000,
  remainingAmount: 9900,
  consultationTotalAmount: 19900,
  referralCreditAmount: 5000,
  referralCode: "LECTURE50",
  appointmentDate: Date.UTC(2026, 8, 23, 13),
  paymentProvider: "stripe",
};

describe("payment email delivery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getPaymentById.mockResolvedValue(payment);
    mocks.getEmailTemplateByKey.mockImplementation(async (key: keyof typeof templates) => templates[key]);
    mocks.getEmailDeliveryLogByEventKey.mockResolvedValue(null);
    mocks.createEmailDeliveryLog.mockResolvedValue(1001);
    mocks.getEmailSettings.mockResolvedValue({
      enabled: true,
      resendApiKeyEncrypted: "encrypted-key",
      senderName: "MedMethod Direct",
      senderEmail: "notifications@medmethoddirect.com",
      replyToEmail: "support@medmethoddirect.com",
    });
    mocks.decryptEmailCredential.mockReturnValue("re_test_secret");
    mocks.updateEmailDeliveryLog.mockResolvedValue(undefined);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: "resend-message-1" }),
    }));
  });

  it("renders the referral-adjusted $99 balance and sends with a stable payment-event idempotency key", async () => {
    await expect(sendPaymentEmail({
      paymentId: payment.id,
      templateKey: "deposit_paid",
      chargedAmount: 5000,
      transactionId: "pi_deposit",
    })).resolves.toEqual({ status: "sent", messageId: "resend-message-1" });

    const fetchMock = vi.mocked(fetch);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, request] = fetchMock.mock.calls[0];
    expect(request?.headers).toMatchObject({
      Authorization: "Bearer re_test_secret",
      "Idempotency-Key": "payment-email/deposit_paid/42",
    });
    const body = JSON.parse(String(request?.body));
    expect(body.subject).toBe("Deposit $50.00 received");
    expect(body.text).toContain("Balance: $99.00");
    expect(body.html).toContain("Jordan &lt;Test&gt;");
    expect(mocks.updateEmailDeliveryLog).toHaveBeenCalledWith(1001, expect.objectContaining({
      status: "sent",
      providerMessageId: "resend-message-1",
    }));
  });

  it("renders the standard $149 appointment-date charge in the second email", async () => {
    mocks.getPaymentById.mockResolvedValue({
      ...payment,
      remainingAmount: 14900,
      referralCreditAmount: 0,
      referralCode: null,
    });

    await expect(sendPaymentEmail({
      paymentId: payment.id,
      templateKey: "balance_paid",
      chargedAmount: 14900,
      transactionId: "pi_standard_balance",
    })).resolves.toEqual({ status: "sent", messageId: "resend-message-1" });

    const [, request] = vi.mocked(fetch).mock.calls[0];
    const body = JSON.parse(String(request?.body));
    expect(body.subject).toBe("Balance $149.00 received");
    expect(body.text).toContain("$149.00 paid for Wednesday, September 23, 2026");
  });

  it("records a silent skip and never contacts Resend when admin email delivery is disabled", async () => {
    mocks.getEmailSettings.mockResolvedValue({ enabled: false });

    await expect(sendPaymentEmail({
      paymentId: payment.id,
      templateKey: "deposit_paid",
      chargedAmount: 5000,
      transactionId: "pi_disabled",
    })).resolves.toEqual({ status: "skipped" });

    expect(fetch).not.toHaveBeenCalled();
    expect(mocks.updateEmailDeliveryLog).toHaveBeenCalledWith(1001, {
      status: "skipped",
      errorMessage: "Email delivery is disabled",
    });
  });

  it("prevents permanent duplicate delivery for the same payment event", async () => {
    mocks.getEmailDeliveryLogByEventKey.mockResolvedValue({ providerMessageId: "already-sent" });

    await expect(sendPaymentEmail({
      paymentId: payment.id,
      templateKey: "balance_paid",
      chargedAmount: 9900,
      transactionId: "pi_balance_retry",
    })).resolves.toEqual({ status: "duplicate", messageId: "already-sent" });

    expect(mocks.createEmailDeliveryLog).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("records a failed provider request without throwing back into the payment flow", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({ message: "Sender domain is not verified" }),
    }));

    await expect(sendPaymentEmailSafely({
      paymentId: payment.id,
      templateKey: "balance_paid",
      chargedAmount: 9900,
      transactionId: "pi_balance",
    })).resolves.toEqual({ status: "failed" });

    expect(mocks.updateEmailDeliveryLog).toHaveBeenCalledWith(1001, {
      status: "failed",
      errorMessage: "Sender domain is not verified",
    });
  });

  it("contains unexpected database errors so a successful payment is not reversed", async () => {
    mocks.getPaymentById.mockRejectedValue(new Error("temporary database read failure"));

    await expect(sendPaymentEmailSafely({
      paymentId: payment.id,
      templateKey: "deposit_paid",
      chargedAmount: 5000,
      transactionId: "pi_successful_payment",
    })).resolves.toEqual({ status: "failed" });
  });
});
