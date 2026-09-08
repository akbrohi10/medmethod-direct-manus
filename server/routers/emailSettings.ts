import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  getEmailSettings,
  getEmailTemplates,
  getRecentEmailDeliveryLogs,
  upsertEmailSettings,
  upsertEmailTemplate,
} from "../db";
import { encryptEmailCredential } from "../emailCredentialCrypto";
import {
  ensureDefaultPaymentEmailTemplates,
  PAYMENT_EMAIL_TEMPLATE_KEYS,
  sendTestEmail,
  type PaymentEmailTemplateKey,
} from "../emailService";
import { router, superAdminOrAdminProcedure } from "../_core/trpc";

const templateKeySchema = z.enum(["deposit_paid", "balance_paid"]);

export const emailSettingsRouter = router({
  getSettings: superAdminOrAdminProcedure.query(async () => {
    await ensureDefaultPaymentEmailTemplates();
    const settings = await getEmailSettings();
    return {
      enabled: settings?.enabled === 1,
      apiKeyConfigured: !!settings?.resendApiKeyEncrypted,
      apiKeyMasked: settings?.resendApiKeyEncrypted ? "re_••••••••••••••••" : null,
      senderName: settings?.senderName ?? "MedMethod Direct",
      senderEmail: settings?.senderEmail ?? "",
      replyToEmail: settings?.replyToEmail ?? "",
      updatedAt: settings?.updatedAt ?? null,
    };
  }),

  updateSettings: superAdminOrAdminProcedure
    .input(
      z.object({
        enabled: z.boolean(),
        apiKey: z.string().trim().optional(),
        removeApiKey: z.boolean().optional(),
        senderName: z.string().trim().max(255),
        senderEmail: z.union([z.string().trim().email(), z.literal("")]),
        replyToEmail: z.union([z.string().trim().email(), z.literal("")]),
      })
    )
    .mutation(async ({ input }) => {
      const current = await getEmailSettings();
      let resendApiKeyEncrypted = current?.resendApiKeyEncrypted ?? null;
      if (input.removeApiKey) resendApiKeyEncrypted = null;
      if (input.apiKey) {
        if (!input.apiKey.startsWith("re_")) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Resend API keys must start with re_" });
        }
        resendApiKeyEncrypted = encryptEmailCredential(input.apiKey);
      }
      if (input.enabled && (!resendApiKeyEncrypted || !input.senderEmail)) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Configure the Resend API key and verified sender email before enabling customer emails",
        });
      }
      await upsertEmailSettings({
        enabled: input.enabled ? 1 : 0,
        resendApiKeyEncrypted,
        senderName: input.senderName || "MedMethod Direct",
        senderEmail: input.senderEmail || null,
        replyToEmail: input.replyToEmail || null,
      });
      return { success: true };
    }),

  listTemplates: superAdminOrAdminProcedure.query(async () => {
    await ensureDefaultPaymentEmailTemplates();
    return getEmailTemplates();
  }),

  updateTemplate: superAdminOrAdminProcedure
    .input(
      z.object({
        templateKey: templateKeySchema,
        subject: z.string().trim().min(1).max(500),
        htmlBody: z.string().trim().min(1).max(30000),
        textBody: z.string().trim().min(1).max(30000),
      })
    )
    .mutation(async ({ input }) => {
      await ensureDefaultPaymentEmailTemplates();
      const templates = await getEmailTemplates();
      const current = templates.find((template) => template.templateKey === input.templateKey);
      if (!current) throw new TRPCError({ code: "NOT_FOUND", message: "Email template not found" });
      await upsertEmailTemplate({
        templateKey: input.templateKey,
        displayName: current.displayName,
        subject: input.subject,
        htmlBody: input.htmlBody,
        textBody: input.textBody,
      });
      return { success: true };
    }),

  sendTest: superAdminOrAdminProcedure
    .input(z.object({ recipientEmail: z.string().trim().email(), templateKey: templateKeySchema }))
    .mutation(async ({ input }) => {
      try {
        const result = await sendTestEmail(input.recipientEmail, input.templateKey as PaymentEmailTemplateKey);
        return { success: true, messageId: result.id };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "Test email failed",
        });
      }
    }),

  listDeliveryLogs: superAdminOrAdminProcedure.query(async () => getRecentEmailDeliveryLogs(50)),

  templateVariables: superAdminOrAdminProcedure.query(() => ({
    supportedKeys: PAYMENT_EMAIL_TEMPLATE_KEYS,
    variables: [
      "{{patient_name}}",
      "{{deposit_amount}}",
      "{{remaining_amount}}",
      "{{charged_amount}}",
      "{{consultation_total}}",
      "{{appointment_date}}",
      "{{referral_code}}",
    ],
  })),
});
