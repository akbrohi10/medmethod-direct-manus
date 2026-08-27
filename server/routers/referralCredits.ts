import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getPaymentById, updatePayment } from "../db";
import {
  formatUsdFromCents,
  resolveReferralCredit,
} from "../referralCredits";
import { publicProcedure, router } from "../_core/trpc";
import { getStripeClientForMode } from "./stripe";

export const referralCreditsRouter = router({
  redeem: publicProcedure
    .input(
      z.object({
        paymentId: z.number().int().positive(),
        code: z.string().trim().min(1).max(64),
      }),
    )
    .mutation(async ({ input }) => {
      const payment = await getPaymentById(input.paymentId);
      if (!payment) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Payment record not found" });
      }

      if (payment.landingPage !== "/") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Referral codes are not available for this checkout",
        });
      }

      if (payment.status !== "pending") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Referral codes must be applied before payment",
        });
      }

      const resolved = resolveReferralCredit(input.code, payment.landingPage);
      if (!resolved.applied) {
        return {
          applied: false as const,
          message: "Referral code not recognized",
          consultationTotalAmount: payment.consultationTotalAmount,
          depositAmount: payment.depositAmount,
          remainingAmount: payment.remainingAmount,
          referralCreditAmount: payment.referralCreditAmount,
          referralCode: payment.referralCode,
        };
      }

      if (payment.paymentProvider === "stripe" && payment.depositPaymentIntentId) {
        const stripe = await getStripeClientForMode(payment.stripeMode ?? "test");
        if (!stripe) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "Stripe is not configured for this payment",
          });
        }

        await stripe.paymentIntents.update(payment.depositPaymentIntentId, {
          metadata: {
            referral_code: resolved.code,
            referral_credit_amount: formatUsdFromCents(resolved.referralCreditAmount),
            consultation_total_amount: formatUsdFromCents(resolved.consultationTotalAmount),
            deposit_amount: formatUsdFromCents(resolved.depositAmount),
            remaining_amount: formatUsdFromCents(resolved.remainingAmount),
          },
        });
      }

      await updatePayment(input.paymentId, {
        consultationTotalAmount: resolved.consultationTotalAmount,
        depositAmount: resolved.depositAmount,
        remainingAmount: resolved.remainingAmount,
        referralCode: resolved.code,
        referralCreditAmount: resolved.referralCreditAmount,
      });

      return {
        applied: true as const,
        message: "LECTURE50 applied — $50 credit",
        consultationTotalAmount: resolved.consultationTotalAmount,
        depositAmount: resolved.depositAmount,
        remainingAmount: resolved.remainingAmount,
        referralCreditAmount: resolved.referralCreditAmount,
        referralCode: resolved.code,
      };
    }),
});
