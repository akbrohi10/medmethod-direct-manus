import { trpc } from "@/lib/trpc";
import { SCRIPT_LOADING_STATE, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useEffect, useRef, useState } from "react";

type ApplePayConfig = {
  isEligible: boolean;
  countryCode: string;
  merchantCapabilities: string[];
  supportedNetworks: string[];
};

type ApplePaySdk = {
  config: () => Promise<ApplePayConfig>;
  validateMerchant: (input: { validationUrl: string; displayName: string }) => Promise<{ merchantSession: unknown }>;
  confirmOrder: (input: { orderId: string; token: unknown; billingContact?: unknown }) => Promise<unknown>;
};

type NativeApplePaySession = {
  onvalidatemerchant: ((event: { validationURL: string }) => void) | null;
  onpaymentauthorized: ((event: { payment: { token: unknown; billingContact?: unknown } }) => void) | null;
  oncancel: (() => void) | null;
  begin: () => void;
  abort: () => void;
  completeMerchantValidation: (merchantSession: unknown) => void;
  completePayment: (status: number) => void;
};

type NativeApplePaySessionConstructor = {
  new (version: number, paymentRequest: Record<string, unknown>): NativeApplePaySession;
  canMakePayments: () => boolean;
  STATUS_SUCCESS: number;
  STATUS_FAILURE: number;
};

type ApplePayWindow = Window & {
  ApplePaySession?: NativeApplePaySessionConstructor;
  paypal?: { Applepay?: () => ApplePaySdk };
};

const APPLE_PAY_SDK_ID = "masterclass-apple-pay-sdk";
const APPLE_PAY_SDK_SRC = "https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js";

function loadApplePaySdk(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("Apple Pay is available only in a browser."));
  if ((window as ApplePayWindow).ApplePaySession) return Promise.resolve();

  const existing = document.getElementById(APPLE_PAY_SDK_ID) as HTMLScriptElement | null;
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Apple Pay could not load.")), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = APPLE_PAY_SDK_ID;
    script.src = APPLE_PAY_SDK_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Apple Pay could not load."));
    document.head.appendChild(script);
  });
}

function friendlyError(error: unknown): string {
  return error instanceof Error && error.message ? error.message : "Apple Pay could not complete the deposit. Please try your card instead.";
}

interface PayPalApplePayOptionProps {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  landingPage: "/masterclass";
  onUseCard: () => void;
  onAvailableChange: (available: boolean) => void;
  onPaymentId: (paymentId: number) => void;
  onComplete: () => void;
  onError: (message: string) => void;
}

/**
 * Masterclass-only Apple Pay option. It is intentionally separate from the
 * Advanced Card Fields path: a saved Apple Pay vault uses `apple_pay.vault_id`,
 * not the card-vault source used by the existing inline card checkout.
 */
export default function PayPalApplePayOption({
  patientName,
  patientEmail,
  patientPhone,
  landingPage,
  onUseCard,
  onAvailableChange,
  onPaymentId,
  onComplete,
  onError,
}: PayPalApplePayOptionProps) {
  const [{ isPending, isResolved }] = usePayPalScriptReducer();
  const [applePay, setApplePay] = useState<ApplePaySdk | null>(null);
  const [config, setConfig] = useState<ApplePayConfig | null>(null);
  const [consented, setConsented] = useState(false);
  const [checking, setChecking] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const reportedAvailability = useRef<boolean | null>(null);

  const createOrder = trpc.paypal.createApplePayOrder.useMutation();
  const captureOrder = trpc.paypal.captureApplePayOrder.useMutation();

  const reportAvailability = (available: boolean) => {
    if (reportedAvailability.current === available) return;
    reportedAvailability.current = available;
    onAvailableChange(available);
  };

  useEffect(() => {
    let mounted = true;
    if (isPending) return;
    if (!isResolved) {
      setChecking(false);
      reportAvailability(false);
      return;
    }

    const checkEligibility = async () => {
      try {
        await loadApplePaySdk();
        const appleWindow = window as ApplePayWindow;
        const Session = appleWindow.ApplePaySession;
        const paypalApplePay = appleWindow.paypal?.Applepay?.();
        if (!Session || !Session.canMakePayments() || !paypalApplePay) {
          if (mounted) {
            setChecking(false);
            reportAvailability(false);
          }
          return;
        }
        const nextConfig = await paypalApplePay.config();
        if (!mounted) return;
        const available = nextConfig.isEligible === true;
        setApplePay(available ? paypalApplePay : null);
        setConfig(available ? nextConfig : null);
        setChecking(false);
        reportAvailability(available);
      } catch {
        if (mounted) {
          setChecking(false);
          reportAvailability(false);
        }
      }
    };

    void checkEligibility();
    return () => { mounted = false; };
  }, [isPending, isResolved]);

  const startApplePay = () => {
    if (!consented) {
      setMessage("Please agree to save Apple Pay for the disclosed remaining balance before continuing.");
      return;
    }
    const appleWindow = window as ApplePayWindow;
    const Session = appleWindow.ApplePaySession;
    if (!Session || !applePay || !config) {
      onError("Apple Pay is not available on this device. Please use your card instead.");
      onUseCard();
      return;
    }

    setMessage(null);
    setProcessing(true);

    try {
      const session = new Session(4, {
        countryCode: config.countryCode,
        merchantCapabilities: config.merchantCapabilities,
        supportedNetworks: config.supportedNetworks,
        currencyCode: "USD",
        requiredBillingContactFields: ["postalAddress"],
        total: {
          label: "MedMethod Direct",
          type: "final",
          amount: "50.00",
        },
      });

      session.onvalidatemerchant = (event) => {
        void applePay.validateMerchant({ validationUrl: event.validationURL, displayName: "MedMethod Direct" })
          .then((result) => session.completeMerchantValidation(result.merchantSession))
          .catch((error) => {
            session.abort();
            setProcessing(false);
            onError(friendlyError(error));
          });
      };

      session.onpaymentauthorized = (event) => {
        void (async () => {
          try {
            const created = await createOrder.mutateAsync({
              patientName,
              patientEmail,
              patientPhone,
              landingPage,
              saveForFuture: true,
            });
            onPaymentId(created.paymentId);

            await applePay.confirmOrder({
              orderId: created.orderId,
              token: event.payment.token,
              billingContact: event.payment.billingContact,
            });
            await captureOrder.mutateAsync({ orderId: created.orderId, paymentId: created.paymentId });
            session.completePayment(Session.STATUS_SUCCESS);
            onComplete();
          } catch (error) {
            session.completePayment(Session.STATUS_FAILURE);
            setProcessing(false);
            onError(friendlyError(error));
          }
        })();
      };

      session.oncancel = () => setProcessing(false);
      session.begin();
    } catch (error) {
      setProcessing(false);
      onError(friendlyError(error));
    }
  };

  if (checking || isPending) {
    return (
      <div data-masterclass-apple-pay-loading className="py-4 text-center text-sm text-gray-400">
        Checking Apple Pay availability…
      </div>
    );
  }

  if (!applePay || !config) return null;

  return (
    <section data-masterclass-apple-pay-option className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="mb-3 text-sm font-semibold text-gray-800">Pay securely with Apple Pay</p>
      <label data-masterclass-apple-pay-consent className="mb-3 flex cursor-pointer items-start gap-2 text-xs leading-relaxed text-gray-600">
        <input
          type="checkbox"
          checked={consented}
          onChange={(event) => {
            setConsented(event.target.checked);
            setMessage(null);
          }}
          className="mt-0.5 h-4 w-4 shrink-0 accent-black"
        />
        <span>
          I authorize MedMethod Direct to securely save this Apple Pay payment method through PayPal and automatically charge the remaining $149 balance on the day of my appointment. The $50 deposit is charged today.
        </span>
      </label>
      <button
        data-masterclass-apple-pay-button
        type="button"
        onClick={startApplePay}
        disabled={processing}
        className="flex h-[52px] w-full items-center justify-center rounded-xl bg-black text-base font-semibold text-white transition-opacity disabled:cursor-wait disabled:opacity-60"
        style={{ WebkitAppearance: "-apple-pay-button", background: "#000", color: "#fff" }}
      >
        {processing ? "Processing Apple Pay…" : "Buy with Apple Pay"}
      </button>
      {message && <p role="alert" className="mt-2 text-xs font-medium text-red-600">{message}</p>}
      <div className="my-4 flex items-center gap-3 text-xs text-gray-400" aria-hidden="true">
        <span className="h-px flex-1 bg-gray-200" />
        <span>OR</span>
        <span className="h-px flex-1 bg-gray-200" />
      </div>
      <button
        data-masterclass-use-card
        type="button"
        onClick={onUseCard}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
      >
        Pay with card instead
      </button>
    </section>
  );
}
