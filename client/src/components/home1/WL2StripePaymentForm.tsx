import { trpc } from "@/lib/trpc";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe as StripeType } from "@stripe/stripe-js";
import { Lock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createWl2ThreeDsReturnUrl } from "@/lib/wl2PaymentResume";

const BRAND_GRADIENT = "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)";
const BRAND_PINK = "#E8339E";
const BRAND_DISABLED = "#f0abcf";

interface WL2StripePaymentFormProps {
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  onComplete: (paymentId: number, paymentIntentId: string) => void;
  onThreeDsRedirect: (paymentId: number) => void;
}

function StripeCheckout({ paymentId, onComplete, onError, onThreeDsRedirect }: {
  paymentId: number;
  onComplete: (paymentId: number, paymentIntentId: string) => void;
  onError: (message: string) => void;
  onThreeDsRedirect: (paymentId: number) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const confirmPayment = trpc.stripe.confirmWl2OneTimePayment.useMutation({
    onSuccess: (_, variables) => onComplete(paymentId, variables.paymentIntentId),
    onError: (error) => {
      onError(`Payment confirmation failed: ${error.message}`);
      setSubmitting(false);
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements || submitting) return;
    setSubmitting(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      onError(submitError.message ?? "Please check your card details.");
      setSubmitting(false);
      return;
    }

    // Persist the minimal data needed to reopen the final modal screen if Stripe
    // requires a 3DS bank-authentication redirect.
    onThreeDsRedirect(paymentId);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: createWl2ThreeDsReturnUrl(window.location.origin),
        payment_method_data: { billing_details: { address: { country: "US" } } },
      },
      redirect: "if_required",
    });

    if (error) {
      onError(error.message ?? "Payment failed. Please try again.");
      setSubmitting(false);
    } else if (paymentIntent?.status === "succeeded") {
      confirmPayment.mutate({ paymentId, paymentIntentId: paymentIntent.id });
    } else if (paymentIntent?.status !== "requires_action") {
      onError("Payment was not completed. Please try again.");
      setSubmitting(false);
    }
  };

  const isLoading = submitting || confirmPayment.isPending;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-green-50">
          <div>
            <p className="text-sm font-semibold text-green-800">Due today — one-time appointment hold</p>
            <p className="text-xs text-green-700 mt-1">Fully refunded when you attend. No additional charge is scheduled.</p>
          </div>
          <span className="text-xl font-bold text-green-800">$15</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Card information</label>
        <div className="rounded-xl border border-gray-200 p-4 bg-white" style={{ minHeight: ready ? undefined : 120 }}>
          {!ready && <div className="flex items-center justify-center h-20"><div className="animate-spin w-5 h-5 border-2 rounded-full" style={{ borderColor: BRAND_PINK, borderTopColor: "transparent" }} /></div>}
          <PaymentElement
            onReady={() => setReady(true)}
            options={{
              layout: "tabs",
              fields: { billingDetails: { address: { country: "never", postalCode: "auto" } } },
              terms: { card: "never" },
            }}
          />
        </div>
      </div>

      <p className="text-xs text-gray-600 leading-relaxed">
        By providing your card information, you authorize <strong>MedMethod Direct</strong> to charge a one-time $15 appointment hold today. Your $15 is refunded when you attend, even if you decide not to continue. No additional payment is scheduled.
      </p>

      <button type="submit" disabled={!stripe || !elements || !ready || isLoading} className="w-full py-4 rounded-xl text-white font-semibold text-base transition-all flex items-center justify-center gap-2" style={{ background: !stripe || !elements || !ready || isLoading ? BRAND_DISABLED : BRAND_GRADIENT }}>
        {isLoading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</> : <><Lock size={16} /> Book My Visit — $15</>}
      </button>
    </form>
  );
}

export default function WL2StripePaymentForm({ patientName, patientEmail, patientPhone, onComplete, onThreeDsRedirect }: WL2StripePaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [stripeInstance, setStripeInstance] = useState<StripeType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const initialized = useRef(false);
  const publishableKey = trpc.stripe.getPublishableKey.useQuery();
  const createIntent = trpc.stripe.createWl2OneTimeIntent.useMutation({
    onSuccess: (data) => { setClientSecret(data.clientSecret); setPaymentId(data.paymentId); },
    onError: (error) => setErrorMessage(`Could not initialize payment: ${error.message}`),
  });

  useEffect(() => {
    if (initialized.current || !publishableKey.data?.publishableKey) return;
    initialized.current = true;
    loadStripe(publishableKey.data.publishableKey).then((instance) => instance && setStripeInstance(instance));
    createIntent.mutate({ patientName, patientEmail, patientPhone });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishableKey.data?.publishableKey]);

  if (errorMessage) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">{errorMessage}</div>;
  if (!publishableKey.data?.publishableKey && !publishableKey.isLoading) return <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-700">Stripe is not configured. Please contact the clinic to complete your booking.</div>;
  if (!clientSecret || !stripeInstance || paymentId === null) return <div className="flex flex-col items-center justify-center gap-3 py-12"><div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: BRAND_PINK, borderTopColor: "transparent" }} /><p className="text-sm text-gray-500">Preparing secure $15 payment...</p></div>;

  return (
    <div>
      {errorMessage && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{errorMessage}</div>}
      <Elements stripe={stripeInstance} options={{ clientSecret, appearance: { theme: "stripe", variables: { colorPrimary: BRAND_PINK, fontFamily: "Montserrat, system-ui, sans-serif", borderRadius: "12px" } } }}>
        <StripeCheckout paymentId={paymentId} onComplete={onComplete} onError={setErrorMessage} onThreeDsRedirect={onThreeDsRedirect} />
      </Elements>
    </div>
  );
}
