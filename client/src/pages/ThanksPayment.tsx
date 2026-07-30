/**
 * ThanksPayment.tsx
 *
 * Silent redirect page for Stripe 3DS return_url flow.
 * Stripe redirects here after bank authentication, we verify the payment
 * in the background, then immediately redirect to /thank-you.
 * The patient sees only a brief loading spinner — never a full page.
 */

import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function ThanksPayment() {
  const [, navigate] = useLocation();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Parse URL params — Stripe adds these on 3DS redirect return
  const params = new URLSearchParams(window.location.search);
  const paymentIntentId = params.get("payment_intent");
  const redirectStatus = params.get("redirect_status");
  const paymentId = params.get("paymentId");

  const confirmDeposit = trpc.stripe.confirmDeposit.useMutation({
    onSuccess: () => {
      navigate("/thank-you");
    },
    onError: (err) => {
      setErrorMsg(err.message);
    },
  });

  useEffect(() => {
    if (redirectStatus === "failed") {
      setErrorMsg("Your payment was not completed. Please try again.");
      return;
    }
    if (redirectStatus === "succeeded" && paymentIntentId && paymentId) {
      // 3DS redirect — confirm in DB then go to /thank-you
      confirmDeposit.mutate({
        paymentId: Number(paymentId),
        paymentIntentId,
      });
    } else {
      // Non-redirect success — go straight to /thank-you
      navigate("/thank-you");
    }
  }, []);

  // Error state — show a message with a retry link
  if (errorMsg) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 py-12 text-center"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        <p className="text-red-600 font-semibold mb-2">Payment issue</p>
        <p className="text-gray-600 text-sm mb-6">{errorMsg}</p>
        <a
          href="/"
          className="text-sm text-[#E8339E] underline hover:opacity-80"
        >
          Return to homepage
        </a>
        <p className="text-xs text-gray-400 mt-4">
          Need help?{" "}
          <a href="tel:+18883627011" className="text-[#E8339E] hover:underline">
            (888) 362-7011
          </a>
        </p>
      </div>
    );
  }

  // Loading / redirect in progress — minimal spinner only
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <div className="w-10 h-10 rounded-full border-4 border-[#E8339E]/20 border-t-[#E8339E] animate-spin" />
      <p className="text-sm text-gray-500">Confirming your payment…</p>
    </div>
  );
}
