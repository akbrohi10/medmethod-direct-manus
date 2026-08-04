/**
 * PayPalPaymentForm.tsx
 *
 * PayPal checkout form for the consultation modal.
 * Mirrors StripePaymentForm.tsx but uses PayPal Orders API via @paypal/react-paypal-js.
 *
 * Flow:
 *   1. Parent calls trpc.paypal.createOrder to get orderId + paymentId
 *   2. PayPalButtons renders the PayPal button
 *   3. On approval, calls trpc.paypal.captureOrder to confirm payment
 *   4. Calls onComplete() to advance the modal to the calendar step
 */
import { trpc } from "@/lib/trpc";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Lock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const BRAND_PINK = "#E8339E";

interface PayPalPaymentFormProps {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  landingPage?: string;
  onComplete: () => void;
  onError: (msg: string) => void;
  onPaymentId?: (id: number) => void;
}

function PayPalFormInner({
  patientName,
  patientEmail,
  patientPhone,
  landingPage,
  onComplete,
  onError,
  onPaymentId,
  clientId,
}: PayPalPaymentFormProps & { clientId: string }) {
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const createdRef = useRef(false);

  const createOrderMutation = trpc.paypal.createOrder.useMutation();
  const captureOrderMutation = trpc.paypal.captureOrder.useMutation();

  // Pre-create the order so we have a paymentId ready
  useEffect(() => {
    if (createdRef.current) return;
    createdRef.current = true;
    setCreating(true);
    createOrderMutation.mutate(
      { patientName, patientEmail, patientPhone, landingPage },
      {
        onSuccess: (data) => {
          setOrderId(data.orderId);
          setPaymentId(data.paymentId);
          onPaymentId?.(data.paymentId);
          setCreating(false);
        },
        onError: (err) => {
          onError(`Could not initialize PayPal: ${err.message}`);
          setCreating(false);
        },
      }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (creating || !orderId || paymentId === null) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-3">
        <div
          className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: `${BRAND_PINK} transparent ${BRAND_PINK} ${BRAND_PINK}` }}
        />
        <p className="text-sm text-gray-500">Preparing PayPal checkout…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Security badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <Lock size={12} />
        <span>Secured by PayPal — $50 deposit today</span>
      </div>

      <PayPalButtons
        style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
        createOrder={() => Promise.resolve(orderId)}
        onApprove={async () => {
          try {
            await captureOrderMutation.mutateAsync({
              orderId,
              paymentId: paymentId!,
            });
            onComplete();
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "PayPal capture failed";
            onError(msg);
          }
        }}
        onError={(err) => {
          onError(`PayPal error: ${String(err)}`);
        }}
        onCancel={() => {
          onError("PayPal payment was cancelled. Please try again.");
        }}
      />

      <p className="text-[11px] text-center text-gray-400 leading-relaxed">
        You will be charged <strong>$50 today</strong> to reserve your appointment.
        The remaining <strong>$149</strong> is due at your visit.
        30-day notice to cancel.
      </p>
    </div>
  );
}

export default function PayPalPaymentForm(props: PayPalPaymentFormProps) {
  const clientIdQuery = trpc.paypal.getPublicClientId.useQuery();

  if (clientIdQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div
          className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: `${BRAND_PINK} transparent ${BRAND_PINK} ${BRAND_PINK}` }}
        />
      </div>
    );
  }

  if (!clientIdQuery.data?.clientId) {
    return (
      <div className="text-center py-6 text-sm text-red-500">
        PayPal is not configured. Please contact support.
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: clientIdQuery.data.clientId,
        currency: "USD",
        intent: "capture",
        vault: true,
        "enable-funding": "paypal",
      }}
    >
      <PayPalFormInner {...props} clientId={clientIdQuery.data.clientId} />
    </PayPalScriptProvider>
  );
}
