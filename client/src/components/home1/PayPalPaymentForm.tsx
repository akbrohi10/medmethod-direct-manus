/**
 * PayPalPaymentForm.tsx
 *
 * PayPal Advanced Card Fields — inline card number, expiry, CVV form.
 * No popup, no redirect. Works exactly like the Stripe form.
 *
 * Flow:
 *   1. trpc.paypal.createOrder creates a $50 order (card payment source)
 *   2. PayPalCardFieldsProvider initialises the SDK with createOrder callback
 *   3. PayPalCardFieldsForm renders inline card fields (number, expiry, CVV, name)
 *   4. On submit, cardFieldsForm.submit() sends card data to PayPal and triggers onApprove
 *   5. onApprove calls trpc.paypal.captureOrder to confirm in our DB
 *   6. onComplete() advances the modal to the calendar step
 *
 * Requires PayPal Advanced Card Processing to be enabled on the merchant account.
 */
import { trpc } from "@/lib/trpc";
import {
  PayPalCardFieldsForm,
  PayPalCardFieldsProvider,
  PayPalScriptProvider,
  usePayPalCardFields,
} from "@paypal/react-paypal-js";
import { CreditCard, Lock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const BRAND_GRADIENT = "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)";
const BRAND_PINK = "#E8339E";
const BRAND_DISABLED = "#f0abcf";

interface PayPalPaymentFormProps {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  landingPage?: string;
  consultationTotalAmountCents: number;
  remainingAmountCents: number;
  referralCreditAmountCents: number;
  onComplete: () => void;
  onError: (msg: string) => void;
  onPaymentId?: (id: number) => void;
}

// ─── Submit button (must live inside PayPalCardFieldsProvider) ───────────────

function SubmitButton({
  submitting,
  onSubmit,
}: {
  submitting: boolean;
  onSubmit: () => void;
}) {
  const { cardFieldsForm } = usePayPalCardFields();
  const [ready, setReady] = useState(false);
  const [notEligible, setNotEligible] = useState(false);

  useEffect(() => {
    if (!cardFieldsForm) return;
    // Poll until the hosted fields are ready (isEligible becomes true)
    let attempts = 0;
    const check = () => {
      try {
        const eligible = cardFieldsForm.isEligible();
        console.log(`[PayPal CardFields] isEligible=${eligible} (attempt ${attempts})`);
        if (eligible) {
          setReady(true);
        } else {
          attempts++;
          // After 10 seconds of polling, mark as not eligible
          if (attempts > 33) {
            setNotEligible(true);
          }
        }
      } catch {
        // not ready yet
      }
    };
    const timer = setInterval(check, 300);
    check();
    return () => clearInterval(timer);
  }, [cardFieldsForm]);

  const isDisabled = !ready || submitting;

  if (notEligible) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
        <p className="text-sm font-semibold text-amber-700 mb-1">Card fields not available</p>
        <p className="text-xs text-amber-600">
          PayPal Advanced Card Fields are not eligible for this account in the current mode.
          Please check the browser console for details, or contact PayPal support to enable ACDC on your Live account.
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onSubmit}
      className="w-full py-4 rounded-xl text-white font-semibold text-base transition-all flex items-center justify-center gap-2"
      style={{
        background: isDisabled ? BRAND_DISABLED : BRAND_GRADIENT,
        cursor: isDisabled ? "not-allowed" : "pointer",
        boxShadow: isDisabled ? "none" : "0 8px 24px rgba(232,51,158,0.3)",
      }}
    >
      {submitting ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Lock size={16} />
          Reserve My Consultation — $50 Deposit
        </>
      )}
    </button>
  );
}

// ─── Inner form (inside PayPalCardFieldsProvider) ────────────────────────────

function CardFormInner({
  submitting,
  consultationTotalAmountCents,
  remainingAmountCents,
  referralCreditAmountCents,
  onSubmit,
}: {
  submitting: boolean;
  consultationTotalAmountCents: number;
  remainingAmountCents: number;
  referralCreditAmountCents: number;
  onSubmit: () => void;
}) {
  const { cardFieldsForm } = usePayPalCardFields();
  const totalLabel = `$${consultationTotalAmountCents / 100}`;
  const remainingLabel = `$${remainingAmountCents / 100}`;

  const handleSubmit = async () => {
    if (!cardFieldsForm || submitting) return;
    onSubmit();
    try {
      await cardFieldsForm.submit({
        billingAddress: { countryCode: "US" },
      });
    } catch (err: unknown) {
      // Errors are surfaced via the provider's onError callback
      console.error("[PayPal CardFields submit error]", err);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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

      {/* Security badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <Lock size={12} />
        <span>Secured by PayPal — $50 deposit today</span>
      </div>

      {/* Card fields label */}
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
        {/* Inline PayPal card fields — renders number, expiry, CVV, name */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden p-1">
          <PayPalCardFieldsForm />
        </div>
      </div>

      {/* Consent text */}
      <p className="text-xs text-gray-500 leading-relaxed">
        By providing your card information, you authorize{" "}
        <strong className="font-semibold text-gray-600">MedMethod Direct</strong> to charge a $50
        deposit today. The remaining {remainingLabel} will be charged the day of your appointment. You may
        cancel or reschedule with at least 24 hours&apos; notice for a full refund of the deposit.
      </p>

      {/* Submit */}
      <SubmitButton submitting={submitting} onSubmit={handleSubmit} />

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
          Powered by PayPal
        </span>
      </div>
    </div>
  );
}

// ─── Provider wrapper — wires createOrder + onApprove + onError ──────────────

function PayPalCardFormWithProvider({
  orderId,
  paymentId,
  consultationTotalAmountCents,
  remainingAmountCents,
  referralCreditAmountCents,
  onComplete,
  onError,
}: {
  orderId: string;
  paymentId: number;
  consultationTotalAmountCents: number;
  remainingAmountCents: number;
  referralCreditAmountCents: number;
  onComplete: () => void;
  onError: (msg: string) => void;
}) {
  const [submitting, setSubmitting] = useState(false);

  const captureOrder = trpc.paypal.captureOrder.useMutation({
    onSuccess: () => {
      onComplete();
    },
    onError: (err) => {
      onError(`Payment confirmation failed: ${err.message}`);
      setSubmitting(false);
    },
  });

  return (
    <PayPalCardFieldsProvider
      createOrder={() => Promise.resolve(orderId)}
      onApprove={({ orderID }) => {
        // PayPal has approved the card — confirm in our DB
        captureOrder.mutate({ orderId: orderID, paymentId });
      }}
      onError={(err) => {
        onError(`Payment failed: ${String(err)}`);
        setSubmitting(false);
      }}
    >
      <CardFormInner
        submitting={submitting || captureOrder.isPending}
        consultationTotalAmountCents={consultationTotalAmountCents}
        remainingAmountCents={remainingAmountCents}
        referralCreditAmountCents={referralCreditAmountCents}
        onSubmit={() => setSubmitting(true)}
      />
    </PayPalCardFieldsProvider>
  );
}

// ─── Outer wrapper — creates the order, then loads the card form ──────────────

export default function PayPalPaymentForm({
  patientName,
  patientEmail,
  patientPhone,
  landingPage,
  consultationTotalAmountCents,
  remainingAmountCents,
  referralCreditAmountCents,
  onComplete,
  onError,
  onPaymentId,
}: PayPalPaymentFormProps) {
  const clientIdQuery = trpc.paypal.getPublicClientId.useQuery();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const createdRef = useRef(false);

  const createOrderMutation = trpc.paypal.createOrder.useMutation();

  useEffect(() => {
    if (createdRef.current) return;
    if (!clientIdQuery.data?.clientId) return;
    createdRef.current = true;

    createOrderMutation.mutate(
      { patientName, patientEmail, patientPhone, landingPage },
      {
        onSuccess: (data) => {
          setOrderId(data.orderId);
          setPaymentId(data.paymentId);
          onPaymentId?.(data.paymentId);
        },
        onError: (err) => {
          setInitError(`Could not initialize payment: ${err.message}`);
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientIdQuery.data?.clientId]);

  // Loading
  if (clientIdQuery.isLoading || createOrderMutation.isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <div
          className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: `${BRAND_PINK} transparent ${BRAND_PINK} ${BRAND_PINK}` }}
        />
        <p className="text-sm text-gray-400">Preparing secure payment...</p>
      </div>
    );
  }

  // Init error
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

  // Not configured
  if (!clientIdQuery.data?.clientId) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center">
        <p className="text-sm font-semibold text-amber-700 mb-1">Payment not configured</p>
        <p className="text-xs text-amber-600">
          PayPal has not been set up yet. Please contact the clinic to complete your booking.
        </p>
      </div>
    );
  }

  if (!orderId || paymentId === null) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <div
          className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: `${BRAND_PINK} transparent ${BRAND_PINK} ${BRAND_PINK}` }}
        />
        <p className="text-sm text-gray-400">Preparing secure payment...</p>
      </div>
    );
  }

  const mode = clientIdQuery.data.mode ?? "sandbox";

  return (
    <PayPalScriptProvider
      options={{
        clientId: clientIdQuery.data.clientId,
        components: "card-fields",
        intent: "capture",
        vault: true,
        ...(mode === "sandbox" ? { currency: "USD", "buyer-country": "US" } : {}),
      }}
    >
      <PayPalCardFormWithProvider
        orderId={orderId}
        paymentId={paymentId}
        consultationTotalAmountCents={consultationTotalAmountCents}
        remainingAmountCents={remainingAmountCents}
        referralCreditAmountCents={referralCreditAmountCents}
        onComplete={onComplete}
        onError={onError}
      />
    </PayPalScriptProvider>
  );
}
