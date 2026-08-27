/**
 * StripePaymentForm.tsx
 *
 * Real Stripe Elements payment form for the /lp/hrt2 consultation modal.
 * Replaces the mock card form with actual Stripe.js payment processing.
 *
 * Flow:
 *   1. Parent calls trpc.stripe.createDepositIntent to get clientSecret
 *   2. This component renders Stripe Elements with that clientSecret
 *   3. On submit, calls stripe.confirmPayment() to charge the $50 deposit
 *   4. On success, calls trpc.stripe.confirmDeposit to update our DB
 *   5. Calls onComplete() to advance the modal to the calendar step
 */

import { trpc } from "@/lib/trpc";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe, Stripe as StripeType } from "@stripe/stripe-js";
import { Lock, CreditCard } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const BRAND_GRADIENT = "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)";
const BRAND_PINK = "#E8339E";
const BRAND_DISABLED = "#f0abcf";

// ─── Inner form (inside Elements provider) ──────────────────────────────────

function CheckoutForm({
  paymentId,
  consultationTotalAmountCents,
  remainingAmountCents,
  referralCreditAmountCents,
  onComplete,
  onError,
  onPaymentIntentId,
}: {
  paymentId: number;
  consultationTotalAmountCents: number;
  remainingAmountCents: number;
  referralCreditAmountCents: number;
  onComplete: () => void;
  onError: (msg: string) => void;
  onPaymentIntentId?: (piId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);

  const confirmDeposit = trpc.stripe.confirmDeposit.useMutation({
    onSuccess: () => {
      onComplete();
    },
    onError: (err) => {
      onError(`Confirmation error: ${err.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || submitting) return;

    setSubmitting(true);

    // Submit the Elements form first (validates card details)
    const { error: submitError } = await elements.submit();
    if (submitError) {
      onError(submitError.message ?? "Please check your card details.");
      setSubmitting(false);
      return;
    }

    // Confirm the payment with Stripe.
    // return_url is required for 3D Secure / bank redirect flows.
    // We pass the thanks page URL so Stripe can redirect back after auth.
    const returnUrl = `${window.location.origin}/thanks-payment?paymentId=${paymentId}`;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
        // Required because we hide the country field in PaymentElement.
        // Stripe requires us to supply any field we opted out of collecting.
        payment_method_data: {
          billing_details: {
            address: {
              country: "US",
            },
          },
        },
      },
      redirect: "if_required",
    });

    if (error) {
      // error.type === 'card_error' or 'validation_error' means the card was declined
      onError(error.message ?? "Payment failed. Please try again.");
      setSubmitting(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      // Notify parent of the PaymentIntent ID so it can include it in the GHL payload
      onPaymentIntentId?.(paymentIntent.id);
      // Update our DB record with the confirmed payment method
      confirmDeposit.mutate({
        paymentId,
        paymentIntentId: paymentIntent.id,
      });
    } else if (paymentIntent?.status === "requires_action") {
      // 3DS redirect is happening — Stripe will redirect to return_url automatically
      // Nothing to do here; the page will reload at /thanks-payment after auth
    } else {
      onError("Payment was not completed. Please try again.");
      setSubmitting(false);
    }
  };

  const isLoading = submitting || confirmDeposit.isPending;
  const totalLabel = `$${consultationTotalAmountCents / 100}`;
  const remainingLabel = `$${remainingAmountCents / 100}`;

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Pricing summary */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-sm text-gray-700">1st Visit — Video consultation + protocol</span>
          <span className="text-sm font-semibold text-gray-900">{totalLabel}</span>
        </div>
        <div className="px-4 py-3 bg-green-50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-green-800">Due today (deposit)</span>
            <span className="text-lg font-bold text-green-800">$50</span>
          </div>
          <p className="text-xs text-green-700 mt-1">
            Remaining {remainingLabel} due the day of your appointment
          </p>
        </div>
        {referralCreditAmountCents > 0 && (
          <div className="flex items-center justify-between border-t border-green-100 bg-white px-4 py-2.5 text-xs font-semibold text-green-700">
            <span>Referral credit applied</span>
            <span>−${referralCreditAmountCents / 100}</span>
          </div>
        )}
      </div>

      {/* Stripe Elements */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: 14,
            fontWeight: 600,
            color: "#374151",
            marginBottom: 8,
          }}
        >
          Card information
        </label>
        <div
          className="rounded-xl border border-gray-200 p-4 bg-white"
          style={{ minHeight: ready ? undefined : 120 }}
        >
          {!ready && (
            <div className="flex items-center justify-center h-20">
              <div
                className="animate-spin w-5 h-5 border-2 rounded-full"
                style={{ borderColor: BRAND_PINK, borderTopColor: "transparent" }}
              />
            </div>
          )}
          <PaymentElement
            onReady={() => setReady(true)}
            options={{
              layout: "tabs",
              fields: {
                billingDetails: {
                  // We default country to US server-side; hide it from the form
                  // but MUST supply it in confirmParams.payment_method_data above
                  address: { country: "never", postalCode: "auto" },
                },
              },
              // Hide Stripe's auto-generated mandate text (which shows the Stripe
              // account business name). Our own consent text below replaces it.
              terms: { card: "never" },
            }}
          />
        </div>
      </div>

      {/* Consent text */}
      <p className="text-xs text-gray-500 leading-relaxed">
        By providing your card information, you authorize <strong className="font-semibold text-gray-600">MedMethod Direct</strong> to charge a $50 deposit today. The remaining {remainingLabel} will be charged the day of your appointment. You may cancel or reschedule with at least 24 hours&apos; notice for a full refund of the deposit.
      </p>

      {/* Submit button */}
      <button
        type="submit"
        disabled={!stripe || !elements || !ready || isLoading}
        className="w-full py-4 rounded-xl text-white font-semibold text-base transition-all flex items-center justify-center gap-2"
        style={{
          background: !stripe || !elements || !ready || isLoading ? BRAND_DISABLED : BRAND_GRADIENT,
          cursor: !stripe || !elements || !ready || isLoading ? "not-allowed" : "pointer",
          boxShadow: !stripe || !elements || !ready || isLoading ? "none" : "0 8px 24px rgba(232,51,158,0.3)",
        }}
      >
        {isLoading ? (
          <>
            <div
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            />
            Processing...
          </>
        ) : (
          <>
            <Lock size={16} />
            Reserve My Consultation — $50 Deposit
          </>
        )}
      </button>

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-5 mt-1">
        <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          HIPAA Compliant
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          256-bit Encrypted
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
          <CreditCard size={14} />
          Powered by Stripe
        </span>
      </div>
    </form>
  );
}

// ─── Outer wrapper — creates the PaymentIntent and loads Stripe ──────────────

interface StripePaymentFormProps {
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  /** e.g. "/lp/WL" or "/lp/hrt3" — stored in Stripe metadata for webhook routing */
  landingPage?: string;
  consultationTotalAmountCents: number;
  remainingAmountCents: number;
  referralCreditAmountCents: number;
  onComplete: () => void;
  onPaymentId: (id: number) => void;
  /** Called with the Stripe PaymentIntent ID once payment succeeds */
  onPaymentIntentId?: (piId: string) => void;
}

export default function StripePaymentForm({
  patientName,
  patientEmail,
  patientPhone,
  landingPage,
  consultationTotalAmountCents,
  remainingAmountCents,
  referralCreditAmountCents,
  onComplete,
  onPaymentId,
  onPaymentIntentId,
}: StripePaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [stripeInstance, setStripeInstance] = useState<StripeType | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const initialized = useRef(false);

  // Get the publishable key
  const pubKeyQuery = trpc.stripe.getPublishableKey.useQuery();

  // Create the deposit PaymentIntent
  const createIntent = trpc.stripe.createDepositIntent.useMutation({
    onSuccess: (data) => {
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setPaymentId(data.paymentId);
        onPaymentId(data.paymentId);
      }
    },
    onError: (err) => {
      setInitError(`Could not initialize payment: ${err.message}`);
    },
  });

  // Load Stripe and create the intent once we have the publishable key
  useEffect(() => {
    if (initialized.current) return;
    if (!pubKeyQuery.data?.publishableKey) return;
    initialized.current = true;

    loadStripe(pubKeyQuery.data.publishableKey).then((s) => {
      if (s) setStripeInstance(s);
    });

    createIntent.mutate({
      patientName,
      patientEmail,
      patientPhone,
      landingPage: landingPage ?? "hrt2",
      affiliateCode: new URLSearchParams(window.location.search).get("ref") || undefined,
    });
  }, [pubKeyQuery.data?.publishableKey]);

  // ── Loading state ──────────────────────────────────────────────────────────

  if (pubKeyQuery.isLoading || createIntent.isPending || !clientSecret || !stripeInstance) {
    if (initError) {
      return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
          <p className="text-sm font-semibold text-red-700 mb-1">Payment unavailable</p>
          <p className="text-xs text-red-600">{initError}</p>
          <p className="text-xs text-gray-400 mt-2">
            Please contact us directly to complete your booking.
          </p>
        </div>
      );
    }

    if (!pubKeyQuery.data?.publishableKey && !pubKeyQuery.isLoading) {
      return (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center">
          <p className="text-sm font-semibold text-amber-700 mb-1">Payment not configured</p>
          <p className="text-xs text-amber-600">
            Stripe has not been set up yet. Please contact the clinic to complete your booking.
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12">
        <div
          className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{ borderColor: BRAND_PINK, borderTopColor: "transparent" }}
        />
        <p className="text-sm text-gray-400">Preparing secure payment...</p>
      </div>
    );
  }

  // ── Stripe Elements ────────────────────────────────────────────────────────

  return (
    <div>
      {errorMsg && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-700">{errorMsg}</p>
        </div>
      )}
      <Elements
        stripe={stripeInstance}
        options={{
          clientSecret,
          appearance: {
            theme: "stripe",
            variables: {
              colorPrimary: BRAND_PINK,
              colorBackground: "#ffffff",
              colorText: "#1f2937",
              colorDanger: "#ef4444",
              fontFamily: "Montserrat, system-ui, sans-serif",
              borderRadius: "12px",
              spacingUnit: "4px",
            },
          },
        }}
      >
        <CheckoutForm
          paymentId={paymentId!}
          consultationTotalAmountCents={consultationTotalAmountCents}
          remainingAmountCents={remainingAmountCents}
          referralCreditAmountCents={referralCreditAmountCents}
          onComplete={onComplete}
          onError={(msg) => setErrorMsg(msg)}
          onPaymentIntentId={onPaymentIntentId}
        />
      </Elements>
    </div>
  );
}
