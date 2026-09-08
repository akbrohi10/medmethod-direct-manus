import { randomUUID } from "node:crypto";
import type { Payment } from "../drizzle/schema";
import {
  createEmailDeliveryLog,
  getEmailDeliveryLogByEventKey,
  getEmailSettings,
  getEmailTemplateByKey,
  getPaymentById,
  upsertEmailTemplate,
  updateEmailDeliveryLog,
} from "./db";
import { decryptEmailCredential } from "./emailCredentialCrypto";

export type PaymentEmailTemplateKey = "deposit_paid" | "balance_paid";

export const PAYMENT_EMAIL_TEMPLATE_KEYS: PaymentEmailTemplateKey[] = ["deposit_paid", "balance_paid"];

export const DEFAULT_PAYMENT_EMAIL_TEMPLATES = {
  deposit_paid: {
    templateKey: "deposit_paid",
    displayName: "Initial $50 Payment Confirmation",
    subject: "Your MedMethod Direct appointment deposit is confirmed",
    htmlBody: `<p>Hi {{patient_name}},</p><p>We received your <strong>{{deposit_amount}}</strong> appointment deposit.</p><p>Your remaining balance is <strong>{{remaining_amount}}</strong>. It will be charged automatically on your appointment date after your appointment is scheduled.</p><p>Thank you,<br>MedMethod Direct</p>`,
    textBody: `Hi {{patient_name}},\n\nWe received your {{deposit_amount}} appointment deposit.\n\nYour remaining balance is {{remaining_amount}}. It will be charged automatically on your appointment date after your appointment is scheduled.\n\nThank you,\nMedMethod Direct`,
  },
  balance_paid: {
    templateKey: "balance_paid",
    displayName: "Appointment Balance Payment Confirmation",
    subject: "Your MedMethod Direct appointment balance was charged",
    htmlBody: `<p>Hi {{patient_name}},</p><p>We successfully charged <strong>{{charged_amount}}</strong> for your appointment scheduled for <strong>{{appointment_date}}</strong>.</p><p>Your consultation balance is now paid in full.</p><p>Thank you,<br>MedMethod Direct</p>`,
    textBody: `Hi {{patient_name}},\n\nWe successfully charged {{charged_amount}} for your appointment scheduled for {{appointment_date}}.\n\nYour consultation balance is now paid in full.\n\nThank you,\nMedMethod Direct`,
  },
} as const;

type TemplateVariables = Record<string, string>;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderTemplate(template: string, variables: TemplateVariables, escapeValues: boolean): string {
  return template.replace(/\{\{([a-z0-9_]+)\}\}/gi, (_match, key: string) => {
    const value = variables[key] ?? "";
    return escapeValues ? escapeHtml(value) : value;
  });
}

function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

function formatAppointmentDate(timestamp: number | null): string {
  if (!timestamp) return "your appointment date";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(timestamp));
}

function getPaymentVariables(payment: Payment, chargedAmount: number): TemplateVariables {
  return {
    patient_name: payment.patientName?.trim() || "there",
    deposit_amount: formatMoney(payment.depositAmount),
    remaining_amount: formatMoney(payment.remainingAmount),
    charged_amount: formatMoney(chargedAmount),
    consultation_total: formatMoney(payment.consultationTotalAmount),
    appointment_date: formatAppointmentDate(payment.appointmentDate),
    referral_code: payment.referralCode ?? "",
  };
}

function wrapEmailHtml(content: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f8f5f8;font-family:Arial,sans-serif;color:#342c35"><div style="max-width:620px;margin:0 auto;padding:32px 20px"><div style="background:#fff;border:1px solid #f0dce8;border-radius:18px;padding:30px"><div style="font-size:20px;font-weight:700;color:#dd2d84;margin-bottom:22px">MedMethod Direct</div><div style="font-size:16px;line-height:1.65">${content}</div></div><p style="font-size:12px;line-height:1.5;color:#746b74;text-align:center;margin:18px 0 0">This is a transactional payment notification from MedMethod Direct.</p></div></body></html>`;
}

export async function ensureDefaultPaymentEmailTemplates(): Promise<void> {
  for (const templateKey of PAYMENT_EMAIL_TEMPLATE_KEYS) {
    const existing = await getEmailTemplateByKey(templateKey);
    if (!existing) {
      await upsertEmailTemplate(DEFAULT_PAYMENT_EMAIL_TEMPLATES[templateKey]);
    }
  }
}

async function postResendEmail(input: {
  apiKey: string;
  from: string;
  to: string;
  replyTo?: string | null;
  subject: string;
  html: string;
  text: string;
  idempotencyKey: string;
  tags: Array<{ name: string; value: string }>;
}): Promise<{ id: string }> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": input.idempotencyKey,
    },
    body: JSON.stringify({
      from: input.from,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
      ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      tags: input.tags,
    }),
  });
  const body = (await response.json().catch(() => ({}))) as { id?: string; message?: string; name?: string };
  if (!response.ok || !body.id) {
    throw new Error(body.message || body.name || `Resend request failed (${response.status})`);
  }
  return { id: body.id };
}

export async function sendPaymentEmail(input: {
  paymentId: number;
  templateKey: PaymentEmailTemplateKey;
  chargedAmount: number;
  transactionId?: string | null;
}): Promise<{ status: "sent" | "failed" | "skipped" | "duplicate"; messageId?: string }> {
  await ensureDefaultPaymentEmailTemplates();
  const payment = await getPaymentById(input.paymentId);
  if (!payment?.patientEmail) return { status: "skipped" };

  const eventKey = `payment-email/${input.templateKey}/${payment.id}`;
  const existing = await getEmailDeliveryLogByEventKey(eventKey);
  if (existing) return { status: "duplicate", messageId: existing.providerMessageId ?? undefined };

  const template = await getEmailTemplateByKey(input.templateKey);
  if (!template) return { status: "skipped" };
  const variables = getPaymentVariables(payment, input.chargedAmount);
  const subject = renderTemplate(template.subject, variables, false);
  const logId = await createEmailDeliveryLog({
    eventKey,
    paymentId: payment.id,
    templateKey: input.templateKey,
    recipientEmail: payment.patientEmail,
    subject,
    chargedAmount: input.chargedAmount,
    appointmentDate: payment.appointmentDate,
    paymentProvider: payment.paymentProvider,
    transactionId: input.transactionId ?? null,
    status: "pending",
  });

  const settings = await getEmailSettings();
  if (!settings?.enabled) {
    await updateEmailDeliveryLog(logId, { status: "skipped", errorMessage: "Email delivery is disabled" });
    return { status: "skipped" };
  }
  if (!settings.resendApiKeyEncrypted || !settings.senderEmail) {
    await updateEmailDeliveryLog(logId, { status: "skipped", errorMessage: "Email settings are incomplete" });
    return { status: "skipped" };
  }

  try {
    const apiKey = decryptEmailCredential(settings.resendApiKeyEncrypted);
    const from = settings.senderName?.trim()
      ? `${settings.senderName.trim()} <${settings.senderEmail}>`
      : settings.senderEmail;
    const result = await postResendEmail({
      apiKey,
      from,
      to: payment.patientEmail,
      replyTo: settings.replyToEmail,
      subject,
      html: wrapEmailHtml(renderTemplate(template.htmlBody, variables, true)),
      text: renderTemplate(template.textBody, variables, false),
      idempotencyKey: eventKey,
      tags: [
        { name: "event", value: input.templateKey },
        { name: "payment_id", value: String(payment.id) },
      ],
    });
    await updateEmailDeliveryLog(logId, {
      status: "sent",
      providerMessageId: result.id,
      errorMessage: null,
      sentAt: new Date(),
    });
    return { status: "sent", messageId: result.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await updateEmailDeliveryLog(logId, { status: "failed", errorMessage: message.slice(0, 2000) });
    console.error(`[PaymentEmail] ${eventKey} failed: ${message}`);
    return { status: "failed" };
  }
}

export async function sendPaymentEmailSafely(input: {
  paymentId: number;
  templateKey: PaymentEmailTemplateKey;
  chargedAmount: number;
  transactionId?: string | null;
}): Promise<{ status: "sent" | "failed" | "skipped" | "duplicate"; messageId?: string }> {
  try {
    return await sendPaymentEmail(input);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[PaymentEmail] Non-blocking notification failure for payment ${input.paymentId}: ${message}`);
    return { status: "failed" };
  }
}

export async function sendTestEmail(recipientEmail: string, templateKey: PaymentEmailTemplateKey): Promise<{ id: string }> {
  await ensureDefaultPaymentEmailTemplates();
  const settings = await getEmailSettings();
  if (!settings?.resendApiKeyEncrypted || !settings.senderEmail) {
    throw new Error("Configure the Resend API key and verified sender address first");
  }
  const template = await getEmailTemplateByKey(templateKey);
  if (!template) throw new Error("Email template not found");
  const sampleVariables: TemplateVariables = {
    patient_name: "Test Patient",
    deposit_amount: "$50.00",
    remaining_amount: "$149.00",
    charged_amount: templateKey === "deposit_paid" ? "$50.00" : "$149.00",
    consultation_total: "$199.00",
    appointment_date: "Wednesday, September 23, 2026",
    referral_code: "",
  };
  const apiKey = decryptEmailCredential(settings.resendApiKeyEncrypted);
  const from = settings.senderName?.trim()
    ? `${settings.senderName.trim()} <${settings.senderEmail}>`
    : settings.senderEmail;
  return postResendEmail({
    apiKey,
    from,
    to: recipientEmail,
    replyTo: settings.replyToEmail,
    subject: `[TEST] ${renderTemplate(template.subject, sampleVariables, false)}`,
    html: wrapEmailHtml(renderTemplate(template.htmlBody, sampleVariables, true)),
    text: renderTemplate(template.textBody, sampleVariables, false),
    idempotencyKey: `test-email/${templateKey}/${randomUUID()}`,
    tags: [{ name: "event", value: "admin_test" }],
  });
}
