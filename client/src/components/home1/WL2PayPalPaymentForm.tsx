import { trpc } from "@/lib/trpc";
import { PayPalCardFieldsForm, PayPalCardFieldsProvider, PayPalScriptProvider, usePayPalCardFields } from "@paypal/react-paypal-js";
import { Lock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const BRAND_GRADIENT = "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)";
const BRAND_PINK = "#E8339E";
const BRAND_DISABLED = "#f0abcf";

interface WL2PayPalPaymentFormProps {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  onComplete: (paymentId: number, captureId: string) => void;
  onError: (message: string) => void;
}

function WL2SubmitButton({ submitting, onSubmit }: { submitting: boolean; onSubmit: () => void }) {
  const { cardFieldsForm } = usePayPalCardFields();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!cardFieldsForm) return;
    const interval = setInterval(() => { try { if (cardFieldsForm.isEligible()) setReady(true); } catch { /* fields are still loading */ } }, 300);
    return () => clearInterval(interval);
  }, [cardFieldsForm]);
  const disabled = !ready || submitting;
  return <button type="button" disabled={disabled} onClick={onSubmit} className="w-full py-4 rounded-xl text-white font-semibold text-base transition-all flex items-center justify-center gap-2" style={{ background: disabled ? BRAND_DISABLED : BRAND_GRADIENT }}>
    {submitting ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</> : <><Lock size={16} /> Book My Visit — $15</>}
  </button>;
}

function WL2CardFields({ submitting, onSubmit }: { submitting: boolean; onSubmit: () => void }) {
  const { cardFieldsForm } = usePayPalCardFields();
  const handleSubmit = async () => {
    if (!cardFieldsForm || submitting) return;
    onSubmit();
    try { await cardFieldsForm.submit({ billingAddress: { countryCode: "US" } }); } catch { /* provider onError handles payment errors */ }
  };
  return <div className="flex flex-col gap-5">
    <div className="rounded-xl border border-gray-200 overflow-hidden"><div className="flex items-center justify-between px-4 py-3 bg-green-50"><div><p className="text-sm font-semibold text-green-800">Due today — one-time appointment hold</p><p className="text-xs text-green-700 mt-1">Fully refunded when you attend. No additional charge is scheduled.</p></div><span className="text-xl font-bold text-green-800">$15</span></div></div>
    <div><label className="block text-sm font-semibold text-gray-700 mb-2">Card information</label><div className="rounded-xl border border-gray-200 bg-white overflow-hidden p-1"><PayPalCardFieldsForm /></div></div>
    <p className="text-xs text-gray-600 leading-relaxed">By providing your card information, you authorize <strong>MedMethod Direct</strong> to charge a one-time $15 appointment hold today. Your $15 is refunded when you attend, even if you decide not to continue. No additional payment is scheduled.</p>
    <WL2SubmitButton submitting={submitting} onSubmit={handleSubmit} />
  </div>;
}

function WL2PayPalProvider({ clientId, mode, orderId, paymentId, onComplete, onError }: {
  clientId: string; mode: "sandbox" | "live"; orderId: string; paymentId: number;
  onComplete: (paymentId: number, captureId: string) => void; onError: (message: string) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const captureOrder = trpc.paypal.captureWl2OneTimeOrder.useMutation({
    onSuccess: (data) => onComplete(paymentId, data.captureId),
    onError: (error) => { onError(`Payment confirmation failed: ${error.message}`); setSubmitting(false); },
  });
  return <PayPalScriptProvider options={{ clientId, components: "card-fields", intent: "capture", ...(mode === "sandbox" ? { currency: "USD", "buyer-country": "US" } : {}) }}>
    <PayPalCardFieldsProvider createOrder={() => Promise.resolve(orderId)} onApprove={({ orderID }) => captureOrder.mutate({ orderId: orderID, paymentId })} onError={(error) => { onError(`Payment failed: ${String(error)}`); setSubmitting(false); }}>
      <WL2CardFields submitting={submitting || captureOrder.isPending} onSubmit={() => setSubmitting(true)} />
    </PayPalCardFieldsProvider>
  </PayPalScriptProvider>;
}

export default function WL2PayPalPaymentForm({ patientName, patientEmail, patientPhone, onComplete, onError }: WL2PayPalPaymentFormProps) {
  const clientIdQuery = trpc.paypal.getPublicClientId.useQuery();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const created = useRef(false);
  const createOrder = trpc.paypal.createWl2OneTimeOrder.useMutation();

  useEffect(() => {
    if (created.current || !clientIdQuery.data?.clientId) return;
    created.current = true;
    createOrder.mutate({ patientName, patientEmail, patientPhone }, { onSuccess: (data) => { setOrderId(data.orderId); setPaymentId(data.paymentId); }, onError: (error) => setErrorMessage(`Could not initialize payment: ${error.message}`) });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientIdQuery.data?.clientId]);

  if (errorMessage) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">{errorMessage}</div>;
  if (!clientIdQuery.data?.clientId && !clientIdQuery.isLoading) return <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-700">PayPal is not configured. Please contact the clinic to complete your booking.</div>;
  if (!orderId || paymentId === null) return <div className="flex flex-col items-center justify-center gap-3 py-12"><div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: BRAND_PINK, borderTopColor: "transparent" }} /><p className="text-sm text-gray-500">Preparing secure $15 payment...</p></div>;

  return <WL2PayPalProvider clientId={clientIdQuery.data!.clientId!} mode={clientIdQuery.data?.mode ?? "sandbox"} orderId={orderId} paymentId={paymentId} onComplete={onComplete} onError={onError} />;
}
