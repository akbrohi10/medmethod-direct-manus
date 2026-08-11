import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

/** Handles the rare Stripe 3DS redirect for the WL2 one-time $15 payment. */
export default function ThanksPaymentWL2() {
  const [, navigate] = useLocation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const params = new URLSearchParams(window.location.search);
  const paymentIntentId = params.get("payment_intent");
  const paymentId = params.get("paymentId");
  const redirectStatus = params.get("redirect_status");
  const confirmPayment = trpc.stripe.confirmWl2OneTimePayment.useMutation({
    onSuccess: () => navigate("/thank-you2"),
    onError: (error) => setErrorMessage(error.message),
  });

  useEffect(() => {
    if (redirectStatus === "failed") { setErrorMessage("Your payment was not completed. Please try again."); return; }
    if (redirectStatus === "succeeded" && paymentIntentId && paymentId) {
      confirmPayment.mutate({ paymentId: Number(paymentId), paymentIntentId });
    } else {
      navigate("/thank-you2");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (errorMessage) return <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" style={{ fontFamily: "Montserrat, sans-serif" }}><p className="text-red-600 font-semibold mb-2">Payment issue</p><p className="text-gray-600 text-sm">{errorMessage}</p></div>;
  return <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ fontFamily: "Montserrat, sans-serif" }}><div className="w-10 h-10 rounded-full border-4 border-[#E8339E]/20 border-t-[#E8339E] animate-spin" /><p className="text-sm text-gray-500">Confirming your payment…</p></div>;
}
