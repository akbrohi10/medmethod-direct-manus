/**
 * TestPayment.tsx — /test-payment
 *
 * A standalone $5 payment test page for verifying live PayPal and Stripe integrations.
 * NOT linked from any public page. For internal use only.
 *
 * - Uses the active payment provider (PayPal or Stripe) from admin settings
 * - Charges exactly $5 (real charge — use your own card)
 * - Does NOT create a patient record or send webhooks
 */
import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import {
  PayPalScriptProvider,
  PayPalCardFieldsProvider,
  PayPalCardFieldsForm,
  usePayPalCardFields,
} from "@paypal/react-paypal-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Lock, CheckCircle, AlertCircle } from "lucide-react";

const BRAND_PINK = "#E8339E";

// ─── PayPal $5 form ───────────────────────────────────────────────────────────

function PayPalTestSubmitButton({ submitting, onSubmit }: { submitting: boolean; onSubmit: () => void }) {
  const { cardFieldsForm } = usePayPalCardFields();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!cardFieldsForm) return;
    const check = () => {
      try { if (cardFieldsForm.isEligible()) setReady(true); } catch { /* not ready */ }
    };
    const timer = setInterval(check, 300);
    check();
    return () => clearInterval(timer);
  }, [cardFieldsForm]);

  return (
    <button
      type="button"
      disabled={!ready || submitting}
      onClick={onSubmit}
      className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
      style={{
        background: !ready || submitting ? "#ccc" : `linear-gradient(135deg, ${BRAND_PINK}, #7B2FBE)`,
        cursor: !ready || submitting ? "not-allowed" : "pointer",
      }}
    >
      {submitting ? "Processing..." : <><Lock size={14} /> Charge $5 Now (Live Test)</>}
    </button>
  );
}

function PayPalTestFormInner({ submitting, onSubmit }: { submitting: boolean; onSubmit: () => void }) {
  const { cardFieldsForm } = usePayPalCardFields();
  const handleSubmit = async () => {
    if (!cardFieldsForm || submitting) return;
    onSubmit();
    try {
      await cardFieldsForm.submit({ billingAddress: { countryCode: "US" } });
    } catch (err) {
      console.error("[PayPal test submit error]", err);
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden p-1">
        <PayPalCardFieldsForm />
      </div>
      <PayPalTestSubmitButton submitting={submitting} onSubmit={handleSubmit} />
    </div>
  );
}

function PayPalTestForm({ clientId, mode }: { clientId: string; mode: string }) {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const createdRef = useRef(false);

  const createOrder = trpc.paypal.createTestOrder.useMutation();
  const captureOrder = trpc.paypal.captureTestOrder.useMutation({
    onSuccess: () => {
      setResult({ success: true, message: "✓ $5 charged successfully! PayPal Live is working." });
      setSubmitting(false);
    },
    onError: (err) => {
      setResult({ success: false, message: `Capture failed: ${err.message}` });
      setSubmitting(false);
    },
  });

  useEffect(() => {
    if (createdRef.current) return;
    createdRef.current = true;
    createOrder.mutate(undefined, {
      onSuccess: (data) => setOrderId(data.orderId),
      onError: (err) => setResult({ success: false, message: `Order creation failed: ${err.message}` }),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (result) {
    return (
      <div className={`rounded-xl border p-5 text-center ${result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
        {result.success
          ? <CheckCircle className="mx-auto mb-2 text-green-600" size={32} />
          : <AlertCircle className="mx-auto mb-2 text-red-600" size={32} />}
        <p className={`font-semibold text-sm ${result.success ? "text-green-800" : "text-red-700"}`}>{result.message}</p>
      </div>
    );
  }

  if (!orderId) {
    return <div className="text-center text-sm text-gray-400 py-6">Creating test order...</div>;
  }

  return (
    <PayPalScriptProvider options={{ clientId, components: "card-fields", vault: true, intent: "capture" }}>
      <PayPalCardFieldsProvider
        createOrder={() => Promise.resolve(orderId)}
        onApprove={({ orderID }) => captureOrder.mutate({ orderId: orderID })}
        onError={(err) => {
          setResult({ success: false, message: `Payment error: ${String(err)}` });
          setSubmitting(false);
        }}
      >
        <PayPalTestFormInner submitting={submitting || captureOrder.isPending} onSubmit={() => setSubmitting(true)} />
      </PayPalCardFieldsProvider>
    </PayPalScriptProvider>
  );
}

// ─── Stripe $5 form ───────────────────────────────────────────────────────────

function StripeTestFormInner() {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async () => {
    if (!stripe || !elements || submitting) return;
    setSubmitting(true);
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setResult({ success: false, message: submitError.message ?? "Validation error" });
      setSubmitting(false);
      return;
    }
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: { payment_method_data: { billing_details: { address: { country: "US" } } } },
    });
    if (error) {
      setResult({ success: false, message: error.message ?? "Payment failed" });
    } else if (paymentIntent?.status === "succeeded") {
      setResult({ success: true, message: "✓ $5 charged successfully! Stripe Live is working." });
    }
    setSubmitting(false);
  };

  if (result) {
    return (
      <div className={`rounded-xl border p-5 text-center ${result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
        {result.success
          ? <CheckCircle className="mx-auto mb-2 text-green-600" size={32} />
          : <AlertCircle className="mx-auto mb-2 text-red-600" size={32} />}
        <p className={`font-semibold text-sm ${result.success ? "text-green-800" : "text-red-700"}`}>{result.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <PaymentElement options={{ layout: "tabs", fields: { billingDetails: { address: { country: "never" } } } }} />
      <button
        type="button"
        disabled={submitting}
        onClick={handleSubmit}
        className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
        style={{
          background: submitting ? "#ccc" : `linear-gradient(135deg, ${BRAND_PINK}, #7B2FBE)`,
          cursor: submitting ? "not-allowed" : "pointer",
        }}
      >
        {submitting ? "Processing..." : <><Lock size={14} /> Charge $5 Now (Live Test)</>}
      </button>
    </div>
  );
}

function StripeTestForm({ publishableKey }: { publishableKey: string }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const createdRef = useRef(false);
  const createIntent = trpc.stripe.createTestIntent.useMutation();
  const stripePromise = useRef(loadStripe(publishableKey));

  useEffect(() => {
    if (createdRef.current) return;
    createdRef.current = true;
    createIntent.mutate(undefined, {
      onSuccess: (data) => setClientSecret(data.clientSecret ?? null),
      onError: (err) => setError(`Intent creation failed: ${err.message}`),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) return <div className="text-red-600 text-sm text-center py-4">{error}</div>;
  if (!clientSecret) return <div className="text-center text-sm text-gray-400 py-6">Preparing Stripe...</div>;

  return (
    <Elements stripe={stripePromise.current} options={{ clientSecret, appearance: { theme: "stripe" } }}>
      <StripeTestFormInner />
    </Elements>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function TestPayment() {
  const paypalQuery = trpc.paypal.getPublicClientId.useQuery();
  const stripeQuery = trpc.stripe.getPublishableKey.useQuery();

  const activeProvider = paypalQuery.data?.activeProvider ?? "stripe";
  const paypalMode = paypalQuery.data?.mode ?? "sandbox";
  const stripeMode = stripeQuery.data?.mode ?? "test";

  const isLoading = paypalQuery.isLoading || stripeQuery.isLoading;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <div className="w-full max-w-md">
        {/* Warning banner */}
        <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-center">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">⚠ Internal Test Page</p>
          <p className="text-xs text-amber-600">This page charges a real $5 to your card. For internal testing only — not linked from any public page.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="text-center mb-6">
            <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: BRAND_PINK }}>Payment Integration Test</p>
            <h1 className="text-xl font-bold text-gray-900">$5 Live Payment Test</h1>
            <p className="text-sm text-gray-500 mt-1">
              Active provider: <strong>{activeProvider === "paypal" ? `PayPal (${paypalMode})` : `Stripe (${stripeMode})`}</strong>
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-sm text-gray-400">Loading payment provider...</div>
          ) : activeProvider === "paypal" && paypalQuery.data?.clientId ? (
            <PayPalTestForm clientId={paypalQuery.data.clientId} mode={paypalMode} />
          ) : stripeQuery.data?.publishableKey ? (
            <StripeTestForm publishableKey={stripeQuery.data.publishableKey} />
          ) : (
            <div className="text-center py-8 text-sm text-red-500">No payment provider configured.</div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          After a successful test, refund the $5 from your{" "}
          {activeProvider === "paypal" ? "PayPal" : "Stripe"} dashboard.
        </p>
      </div>
    </div>
  );
}
