import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getIntakeDeliverySettings, upsertIntakeDeliverySettings } from "../db";
import { encryptIntakeCredential } from "../intakeCredentialCrypto";
import { router, superAdminOrAdminProcedure } from "../_core/trpc";

function validateKeragonWebhookUrl(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Enter a valid HTTPS webhook URL." });
  }

  if (url.protocol !== "https:" || url.username || url.password) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "The Keragon webhook URL must be HTTPS and cannot include credentials." });
  }

  const host = url.hostname.toLowerCase();
  const privateHost = host === "localhost" || host === "::1" || /^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host) || /^169\.254\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host);
  if (privateHost) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "The Keragon webhook URL must use a public HTTPS host." });
  }

  return url.toString();
}

export const intakeDeliverySettingsRouter = router({
  getSettings: superAdminOrAdminProcedure.query(async () => {
    const settings = await getIntakeDeliverySettings();
    return {
      keragonWebhookConfigured: Boolean(settings?.keragonWebhookUrlEncrypted),
      updatedAt: settings?.updatedAt ?? null,
    };
  }),

  updateSettings: superAdminOrAdminProcedure
    .input(z.object({
      keragonWebhookUrl: z.string().trim().max(2048).optional(),
      removeKeragonWebhookUrl: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const current = await getIntakeDeliverySettings();
      let keragonWebhookUrlEncrypted = current?.keragonWebhookUrlEncrypted ?? null;

      if (input.removeKeragonWebhookUrl) keragonWebhookUrlEncrypted = null;
      if (input.keragonWebhookUrl) {
        keragonWebhookUrlEncrypted = encryptIntakeCredential(validateKeragonWebhookUrl(input.keragonWebhookUrl));
      }

      await upsertIntakeDeliverySettings({ keragonWebhookUrlEncrypted });
      return { success: true, keragonWebhookConfigured: Boolean(keragonWebhookUrlEncrypted) };
    }),
});
