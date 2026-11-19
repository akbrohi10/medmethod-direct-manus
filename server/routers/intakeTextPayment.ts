import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getIntakeTextPaymentService, textPaymentOrigin } from "../intakeTextPaymentIntegration";
import { IntakeTextPaymentError } from "../intakeTextPaymentService";
import { IntakeTextPaymentStoreError } from "../intakeTextPaymentStore";

const capability = z.string().regex(/^[A-Za-z0-9_-]{43}$/);
const paymentToken = z.object({ payment_token: capability }).strict();
const safeMessage = "Your payment didn't go through. Please try again or use a different card.";
const configurationMessage = "Payment checkout is not configured. Please contact the Care Team; do not make another payment.";
const modeChangedMessage = "The payment mode changed. Please refresh checkout or contact the Care Team; do not make another payment.";
const confirmationMessage = "Payment confirmation is unavailable. Please retry or contact the Care Team; do not make another payment.";
async function safe<T>(work: () => Promise<T>): Promise<T> {
  try { return await work(); }
  catch (error) {
    const message = (error instanceof IntakeTextPaymentStoreError && error.code === "storage_unavailable")
      || (error instanceof IntakeTextPaymentError && error.code === "not_configured") ? configurationMessage
      : error instanceof IntakeTextPaymentError && error.code === "mode_mismatch" ? modeChangedMessage
      : error instanceof IntakeTextPaymentError && error.code === "provider_unavailable" ? safeMessage
      : confirmationMessage;
    throw new TRPCError({ code: "BAD_REQUEST", message });
  }
}
function guard(req: Parameters<typeof textPaymentOrigin>[0]) {
  if (req.headers["x-mmd-text-payment"] !== "1") throw new TRPCError({ code: "FORBIDDEN", message: "This payment request is unavailable." });
  return textPaymentOrigin(req);
}
export const intakeTextPaymentRouter = router({
  config: publicProcedure.query(() => safe(async () => ({ ...await getIntakeTextPaymentService().configuration(), currency: "USD" as const }))),
  order: publicProcedure.input(z.unknown()).mutation(({ ctx, input }) => safe(() =>
    getIntakeTextPaymentService().create({ body: input, public_origin: guard(ctx.req) }))),
  capture: publicProcedure.input(paymentToken.extend({ order_id: z.string().regex(/^[A-Za-z0-9_-]{3,128}$/) }).strict())
    .mutation(({ ctx, input }) => safe(() => { guard(ctx.req); return getIntakeTextPaymentService().capture(input); })),
  status: publicProcedure.input(paymentToken).mutation(({ ctx, input }) => safe(() => { guard(ctx.req); return getIntakeTextPaymentService().status(input.payment_token); })),
  resume: publicProcedure.input(z.object({ token: capability }).strict()).mutation(({ ctx, input }) => safe(() => { guard(ctx.req); return getIntakeTextPaymentService().resume(input.token); })),
  restore: publicProcedure.input(paymentToken).mutation(({ ctx, input }) => safe(() => { guard(ctx.req); return getIntakeTextPaymentService().restore(input.payment_token); })),
});
