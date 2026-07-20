/**
 * ThanksPayment.tsx
 *
 * Success page shown after a patient completes the $50 deposit payment.
 * Also handles the Stripe 3DS redirect return_url flow — Stripe appends
 * ?payment_intent=pi_xxx&payment_intent_client_secret=...&redirect_status=succeeded
 * to the URL when redirecting back from 3DS authentication.
 */

import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

const BRAND_PINK = "#E8339E";
const BRAND_PURPLE = "#7A1E7E";

export default function ThanksPayment() {
  const [, navigate] = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "failed" | "pending">("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Parse URL params — Stripe adds these on 3DS redirect return
  const params = new URLSearchParams(window.location.search);
  const paymentIntentId = params.get("payment_intent");
  const redirectStatus = params.get("redirect_status");
  const paymentId = params.get("paymentId");

  // If we came back from a 3DS redirect, confirm the deposit in our DB
  const confirmDeposit = trpc.stripe.confirmDeposit.useMutation({
    onSuccess: () => setStatus("success"),
    onError: (err) => {
      setErrorMsg(err.message);
      setStatus("failed");
    },
  });

  useEffect(() => {
    if (redirectStatus === "succeeded" && paymentIntentId && paymentId) {
      // Came back from 3DS redirect — confirm in our DB
      confirmDeposit.mutate({
        paymentId: Number(paymentId),
        paymentIntentId,
      });
    } else if (redirectStatus === "failed") {
      setErrorMsg("Your payment was not completed. Please try again.");
      setStatus("failed");
    } else {
      // Came here directly after a non-redirect payment success
      setStatus("success");
    }
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(135deg, #fdf0f8 0%, #f5e8ff 100%)", fontFamily: "Montserrat, sans-serif" }}
    >
      {status === "loading" && (
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 border-4 rounded-full animate-spin"
            style={{ borderColor: BRAND_PINK, borderTopColor: "transparent" }}
          />
          <p className="text-gray-500 text-sm">Confirming your payment...</p>
        </div>
      )}

      {status === "failed" && (
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "#fee2e2" }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Payment Not Completed</h1>
          <p className="text-sm text-gray-500 mb-6">{errorMsg ?? "Something went wrong with your payment."}</p>
          <a
            href="/lp/hrt2"
            className="inline-block px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all"
            style={{ background: `linear-gradient(135deg, ${BRAND_PINK} 0%, ${BRAND_PURPLE} 100%)` }}
          >
            Try Again
          </a>
        </div>
      )}

      {status === "success" && (
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header band */}
          <div
            className="px-8 py-6 text-white text-center"
            style={{ background: `linear-gradient(135deg, ${BRAND_PINK} 0%, ${BRAND_PURPLE} 100%)` }}
          >
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-1">You're All Set!</h1>
            <p className="text-white/80 text-sm">Your $50 deposit has been received</p>
          </div>

          {/* Body */}
          <div className="px-8 py-7">
            <p className="text-gray-700 text-sm leading-relaxed mb-5">
              Thank you for reserving your consultation with <strong>MedMethod Direct</strong>. A confirmation email is on its way to you.
            </p>

            {/* What happens next */}
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-5 mb-6">
              <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">What Happens Next</h2>
              <ol className="space-y-3">
                {[
                  "Check your email for a booking confirmation and calendar invite.",
                  "Your physician will review your intake information before the visit.",
                  "The remaining $149 will be charged on the day of your appointment.",
                  "After your consultation, your personalized care plan will be sent within 24 hours.",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center mt-0.5"
                      style={{ background: BRAND_PINK }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-600">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Payment summary */}
            <div className="rounded-xl border border-gray-200 overflow-hidden mb-6">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-green-50">
                <span className="text-sm font-semibold text-green-800">Deposit paid today</span>
                <span className="text-sm font-bold text-green-800">$50.00 ✓</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
                <span className="text-sm text-gray-500">Remaining (due on appointment day)</span>
                <span className="text-sm font-semibold text-gray-700">$149.00</span>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <a
                href="/"
                className="inline-block px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: `linear-gradient(135deg, ${BRAND_PINK} 0%, ${BRAND_PURPLE} 100%)` }}
              >
                Return to MedMethod Direct
              </a>
              <p className="text-xs text-gray-400 mt-3">
                Questions? Call us at{" "}
                <a href="tel:+18883627011" className="text-pink-500 hover:underline">
                  (888) 362-7011
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
