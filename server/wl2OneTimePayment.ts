import type { InsertPayment } from "../drizzle/schema";

export const WL2_ONE_TIME_PAYMENT = {
  landingPage: "/lp/WL2" as const,
  amountCents: 1500,
  remainingAmountCents: 0,
  finalStatus: "fully_paid" as const,
};

export function createWl2OneTimePaymentRecord({
  patientName,
  patientEmail,
  patientPhone,
  paymentProvider,
  stripeMode,
  paypalMode,
  paymentIntentId,
}: {
  patientName: string;
  patientEmail: string;
  patientPhone?: string | null;
  paymentProvider: "stripe" | "paypal";
  stripeMode: "test" | "live";
  paypalMode?: "sandbox" | "live";
  paymentIntentId?: string;
}): InsertPayment {
  return {
    patientName,
    patientEmail,
    patientPhone: patientPhone ?? null,
    depositAmount: WL2_ONE_TIME_PAYMENT.amountCents,
    remainingAmount: WL2_ONE_TIME_PAYMENT.remainingAmountCents,
    depositPaymentIntentId: paymentIntentId,
    landingPage: WL2_ONE_TIME_PAYMENT.landingPage,
    paymentProvider,
    stripeMode,
    paypalMode,
    status: "pending",
  };
}
