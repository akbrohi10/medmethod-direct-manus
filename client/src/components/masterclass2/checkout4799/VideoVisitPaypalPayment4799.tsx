import { trpc } from "@/lib/trpc";
import {
  PayPalCardFieldsForm,
  PayPalCardFieldsProvider,
  PayPalScriptProvider,
  SCRIPT_LOADING_STATE,
  usePayPalCardFields,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { Apple, CreditCard, LockKeyhole } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  type VideoVisitPendingCheckout,
  saveVideoVisitPendingCheckout,
} from "./videoVisitCheckout4799Storage";

type Contact = {
  name: string;
  email: string;
  phone: string;
};

type CreatedOrder = {
  orderId: string;
  checkout_token: string;
};

type ApplePayConfig = {
  isEligible: boolean;
  countryCode: string;
  merchantCapabilities: string[];
  supportedNetworks: string[];
};

type PayPalApplePaySdk = {
  config: () => Promise<ApplePayConfig>;
  validateMerchant: (input: {
    validationUrl: string;
    displayName: string;
  }) => Promise<{ merchantSession: unknown }>;
  confirmOrder: (input: {
    orderId: string;
    token: unknown;
    billingContact?: unknown;
  }) => Promise<unknown>;
};

type NativeApplePaySession = {
  onvalidatemerchant: ((event: { validationURL: string }) => void) | null;
  onpaymentauthorized:
    | ((event: {
        payment: { token: unknown; billingContact?: unknown };
      }) => void)
    | null;
  oncancel: (() => void) | null;
  begin: () => void;
  abort: () => void;
  completeMerchantValidation: (merchantSession: unknown) => void;
  completePayment: (status: number) => void;
};

type NativeApplePaySessionConstructor = {
  new (
    version: number,
    paymentRequest: Record<string, unknown>
  ): NativeApplePaySession;
  canMakePayments: () => boolean;
  STATUS_SUCCESS: number;
  STATUS_FAILURE: number;
};

type ApplePayWindow = Window & {
  ApplePaySession?: NativeApplePaySessionConstructor;
  paypal?: { Applepay?: () => PayPalApplePaySdk };
};

const APPLE_PAY_SCRIPT_ID = "masterclass2-video-apple-pay-sdk";
const APPLE_PAY_SCRIPT_SRC =
  "https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js";

function paymentError(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function loadApplePaySdk(): Promise<void> {
  if (typeof window === "undefined")
    return Promise.reject(
      new Error("Apple Pay is available only in a browser.")
    );
  if ((window as ApplePayWindow).ApplePaySession) return Promise.resolve();

  const existing = document.getElementById(
    APPLE_PAY_SCRIPT_ID
  ) as HTMLScriptElement | null;
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Apple Pay could not load.")),
        { once: true }
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = APPLE_PAY_SCRIPT_ID;
    script.src = APPLE_PAY_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Apple Pay could not load."));
    document.head.appendChild(script);
  });
}

function CardSubmitButton({
  busy,
  onSubmit,
}: {
  busy: boolean;
  onSubmit: () => void;
}) {
  const { cardFieldsForm } = usePayPalCardFields();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!cardFieldsForm) return;
    let tries = 0;
    const checkReadiness = () => {
      try {
        if (cardFieldsForm.isEligible()) {
          setReady(true);
          return;
        }
      } catch {
        // The SDK may be mounting its hosted iframes; keep the button disabled.
      }
      tries += 1;
      if (tries >= 40) setReady(false);
    };
    const interval = window.setInterval(checkReadiness, 250);
    checkReadiness();
    return () => window.clearInterval(interval);
  }, [cardFieldsForm]);

  const submit = async () => {
    if (!cardFieldsForm || !ready || busy) return;
    onSubmit();
    try {
      await cardFieldsForm.submit({ billingAddress: { countryCode: "US" } });
    } catch {
      // The provider's onError callback reports a safe, user-facing error.
    }
  };

  return (
    <button
      type="button"
      disabled={!ready || busy}
      onClick={() => void submit()}
      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e8339e] to-[#7a1e7e] px-4 py-3 text-sm font-extrabold uppercase tracking-[0.06em] text-white shadow-[0_8px_18px_rgba(122,30,126,0.25)] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a1e7e] disabled:cursor-not-allowed disabled:opacity-55"
    >
      <LockKeyhole className="h-4 w-4" aria-hidden="true" />
      {busy ? "Confirming payment…" : "Pay $47.99 now"}
    </button>
  );
}

function PayPalCardFields({
  order,
  onPaymentStart,
  onPaymentComplete,
  onPaymentError,
}: {
  order: CreatedOrder;
  onPaymentStart: () => void;
  onPaymentComplete: () => Promise<void>;
  onPaymentError: (message: string) => void;
}) {
  const [submitting, setSubmitting] = useState(false);

  return (
    <PayPalCardFieldsProvider
      createOrder={() => Promise.resolve(order.orderId)}
      onApprove={({ orderID }) => {
        if (orderID !== order.orderId) {
          setSubmitting(false);
          onPaymentError(
            "We could not match this payment to your secure checkout. No additional charge was made."
          );
          return;
        }
        void onPaymentComplete().catch((error: unknown) => {
          setSubmitting(false);
          onPaymentError(
            paymentError(
              error,
              "We could not verify the payment yet. Please retry secure confirmation."
            )
          );
        });
      }}
      onError={() => {
        setSubmitting(false);
        onPaymentError(
          "Your payment could not be completed. Please check your card details and try again."
        );
      }}
    >
      <div className="space-y-4" data-masterclass2-video-card-fields>
        <div>
          <label className="mb-2 block text-sm font-bold text-[#3d3040]">
            Card information
          </label>
          <div className="rounded-xl border border-[#dfd1df] bg-white p-2">
            <PayPalCardFieldsForm />
          </div>
        </div>
        <CardSubmitButton
          busy={submitting}
          onSubmit={() => {
            setSubmitting(true);
            onPaymentStart();
          }}
        />
      </div>
    </PayPalCardFieldsProvider>
  );
}

function ApplePayButton({
  contact,
  checkoutId,
  onCreated,
  onPaymentComplete,
  onPaymentError,
  onUseCard,
}: {
  contact: Contact;
  checkoutId: string;
  onCreated: (order: CreatedOrder) => void;
  onPaymentComplete: (order: CreatedOrder) => Promise<void>;
  onPaymentError: (message: string) => void;
  onUseCard: () => void;
}) {
  const [{ options, isPending, isResolved }] = usePayPalScriptReducer();
  const [applePay, setApplePay] = useState<PayPalApplePaySdk | null>(null);
  const [config, setConfig] = useState<ApplePayConfig | null>(null);
  const [checking, setChecking] = useState(true);
  const [processing, setProcessing] = useState(false);
  const createOrder = trpc.masterclassVideo4799.createPaypalOrder.useMutation();

  useEffect(() => {
    let active = true;
    if (isPending) return;
    if (!isResolved || !options.clientId) {
      setChecking(false);
      return;
    }

    const checkEligibility = async () => {
      try {
        await loadApplePaySdk();
        const appleWindow = window as ApplePayWindow;
        const Session = appleWindow.ApplePaySession;
        const paypalApplePay = appleWindow.paypal?.Applepay?.();
        if (!Session || !Session.canMakePayments() || !paypalApplePay) return;
        const nextConfig = await paypalApplePay.config();
        if (!active || !nextConfig.isEligible) return;
        setApplePay(paypalApplePay);
        setConfig(nextConfig);
      } catch {
        // Apple Pay is an optional eligible-wallet choice; card checkout remains available.
      } finally {
        if (active) setChecking(false);
      }
    };

    void checkEligibility();
    return () => {
      active = false;
    };
  }, [isPending, isResolved, options.clientId]);

  const startApplePay = () => {
    const appleWindow = window as ApplePayWindow;
    const Session = appleWindow.ApplePaySession;
    if (!Session || !applePay || !config || processing) {
      onUseCard();
      return;
    }

    setProcessing(true);
    try {
      const session = new Session(4, {
        countryCode: config.countryCode,
        merchantCapabilities: config.merchantCapabilities,
        supportedNetworks: config.supportedNetworks,
        currencyCode: "USD",
        total: {
          label: "MedMethod Direct Video Visit",
          type: "final",
          amount: "47.99",
        },
      });

      session.onvalidatemerchant = event => {
        void applePay
          .validateMerchant({
            validationUrl: event.validationURL,
            displayName: "MedMethod Direct",
          })
          .then(result =>
            session.completeMerchantValidation(result.merchantSession)
          )
          .catch(() => {
            session.abort();
            setProcessing(false);
            onPaymentError(
              "Apple Pay could not be verified. Please try your card instead."
            );
          });
      };

      session.onpaymentauthorized = event => {
        void (async () => {
          try {
            // This is intentionally created only after the user selected and authorized Apple Pay.
            const order = await createOrder.mutateAsync({
              checkout_id: checkoutId,
              patientName: contact.name,
              patientEmail: contact.email,
              patientPhone: contact.phone,
              payment_method: "apple_pay",
            });
            const created: CreatedOrder = {
              orderId: order.orderId,
              checkout_token: order.checkout_token,
            };
            await applePay.confirmOrder({
              orderId: created.orderId,
              token: event.payment.token,
              billingContact: event.payment.billingContact,
            });
            onCreated(created);
            saveVideoVisitPendingCheckout({
              version: 1,
              provider: "paypal",
              checkoutId,
              checkoutToken: created.checkout_token,
              orderId: created.orderId,
              paymentMethod: "apple_pay",
              phase: "provider_approved",
            });
            await onPaymentComplete(created);
            session.completePayment(Session.STATUS_SUCCESS);
          } catch (error) {
            session.completePayment(Session.STATUS_FAILURE);
            setProcessing(false);
            onPaymentError(
              paymentError(
                error,
                "Apple Pay could not complete. No additional charge was made."
              )
            );
          }
        })();
      };

      session.oncancel = () => setProcessing(false);
      session.begin();
    } catch (error) {
      setProcessing(false);
      onPaymentError(
        paymentError(
          error,
          "Apple Pay could not start. Please use your card instead."
        )
      );
    }
  };

  if (checking) return null;
  if (!applePay || !config) return null;

  return (
    <button
      type="button"
      onClick={startApplePay}
      disabled={processing || createOrder.isPending}
      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-bold text-white transition hover:bg-black/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a1e7e] disabled:cursor-wait disabled:opacity-60"
      data-masterclass2-video-apple-pay
    >
      <Apple className="h-4 w-4" aria-hidden="true" />
      {processing || createOrder.isPending
        ? "Opening Apple Pay…"
        : "Buy with Apple Pay"}
    </button>
  );
}

export interface VideoVisitPaypalPayment4799Props {
  clientId: string;
  mode: "sandbox" | "live";
  contact: Contact | null;
  checkoutId: string;
  pending?: VideoVisitPendingCheckout | null;
  onComplete: (redirectUrl: unknown) => void;
  onError: (message: string) => void;
}

/** PayPal Advanced Card Fields and eligible Apple Pay for the one-time $47.99 video visit only. */
export default function VideoVisitPaypalPayment4799({
  clientId,
  mode,
  contact,
  checkoutId,
  pending,
  onComplete,
  onError,
}: VideoVisitPaypalPayment4799Props) {
  const [method, setMethod] = useState<"card" | "apple_pay">("card");
  const [order, setOrder] = useState<CreatedOrder | null>(
    pending?.provider === "paypal" &&
      pending.checkoutId === checkoutId &&
      pending.orderId
      ? { orderId: pending.orderId, checkout_token: pending.checkoutToken }
      : null
  );
  const [paymentStarted, setPaymentStarted] = useState(false);
  const [providerApproved, setProviderApproved] = useState(
    pending?.provider === "paypal" &&
      pending.checkoutId === checkoutId &&
      pending.phase === "provider_approved"
  );
  const createOrder = trpc.masterclassVideo4799.createPaypalOrder.useMutation();
  const captureOrder = trpc.masterclassVideo4799.capturePaypalOrder.useMutation();

  const savePendingOrder = (
    created: CreatedOrder,
    paymentMethod: "card" | "apple_pay"
  ) => {
    setOrder(created);
    saveVideoVisitPendingCheckout({
      version: 1,
      provider: "paypal",
      checkoutId,
      checkoutToken: created.checkout_token,
      orderId: created.orderId,
      paymentMethod,
      phase: "created",
    });
  };

  const markProviderApproved = (
    created: CreatedOrder,
    paymentMethod: "card" | "apple_pay"
  ) => {
    setPaymentStarted(true);
    setProviderApproved(true);
    saveVideoVisitPendingCheckout({
      version: 1,
      provider: "paypal",
      checkoutId,
      checkoutToken: created.checkout_token,
      orderId: created.orderId,
      paymentMethod,
      phase: "provider_approved",
    });
  };

  const completePayment = async (created = order) => {
    if (!created)
      throw new Error(
        "Your payment checkout is not ready. Please retry secure confirmation."
      );
    const result = await captureOrder.mutateAsync({
      orderId: created.orderId,
      checkout_token: created.checkout_token,
    });
    onComplete(result.redirect_url);
  };

  const startCard = async () => {
    if (order || createOrder.isPending) return;
    if (!contact) {
      onError("Contact details are required to start a new secure payment.");
      return;
    }
    try {
      const created = await createOrder.mutateAsync({
        checkout_id: checkoutId,
        patientName: contact.name,
        patientEmail: contact.email,
        patientPhone: contact.phone,
        payment_method: "card",
      });
      savePendingOrder(created, "card");
    } catch (error) {
      onError(
        paymentError(
          error,
          "We could not prepare secure card payment. Please try again."
        )
      );
    }
  };

  const retryConfirmation = () => {
    void completePayment().catch((error: unknown) => {
      onError(
        paymentError(
          error,
          "We could not verify the payment yet. No additional charge was made."
        )
      );
    });
  };

  const requiresServerRetry = providerApproved;

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        components: "card-fields,applepay",
        intent: "capture",
        currency: "USD",
        ...(mode === "sandbox" ? { "buyer-country": "US" } : {}),
      }}
    >
      <div className="space-y-4">
        {!order && (
          <div
            className="grid gap-3 sm:grid-cols-2"
            aria-label="Payment method"
          >
            <button
              type="button"
              onClick={() => setMethod("card")}
              className={`rounded-xl border p-3 text-left text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a1e7e] ${method === "card" ? "border-[#a92b85] bg-[#fff5fb] text-[#6e1c6f]" : "border-[#ddd1dd] bg-white text-[#403440]"}`}
              aria-pressed={method === "card"}
            >
              <CreditCard className="mb-1 h-5 w-5" aria-hidden="true" />
              Pay by card
            </button>
            <button
              type="button"
              onClick={() => setMethod("apple_pay")}
              className={`rounded-xl border p-3 text-left text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a1e7e] ${method === "apple_pay" ? "border-[#a92b85] bg-[#fff5fb] text-[#6e1c6f]" : "border-[#ddd1dd] bg-white text-[#403440]"}`}
              aria-pressed={method === "apple_pay"}
            >
              <Apple className="mb-1 h-5 w-5" aria-hidden="true" />
              Apple Pay
            </button>
          </div>
        )}

        {!order && method === "card" && (
          <button
            type="button"
            onClick={() => void startCard()}
            disabled={createOrder.isPending}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e8339e] to-[#7a1e7e] px-4 py-3 text-sm font-extrabold uppercase tracking-[0.06em] text-white shadow-[0_8px_18px_rgba(122,30,126,0.25)] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a1e7e] disabled:cursor-wait disabled:opacity-60"
          >
            <LockKeyhole className="h-4 w-4" aria-hidden="true" />
            {createOrder.isPending
              ? "Preparing secure card fields…"
              : "Continue to secure card fields"}
          </button>
        )}

        {!order && method === "apple_pay" && contact && (
          <>
            <ApplePayButton
              contact={contact}
              checkoutId={checkoutId}
              onCreated={created => markProviderApproved(created, "apple_pay")}
              onPaymentComplete={completePayment}
              onPaymentError={onError}
              onUseCard={() => setMethod("card")}
            />
            <p className="text-center text-xs text-[#6d626d]">
              Apple Pay appears only when it is eligible on this device. Choose
              card if it is unavailable.
            </p>
          </>
        )}

        {!order && method === "apple_pay" && !contact && (
          <p className="rounded-xl border border-[#ead4e4] bg-[#fff9fc] p-4 text-center text-sm font-semibold text-[#5d4e60]">
            This payment can be retried only after it has been authorized.
            Please return to contact details to begin a new checkout.
          </p>
        )}

        {order && requiresServerRetry && (
          <button
            type="button"
            onClick={retryConfirmation}
            disabled={captureOrder.isPending}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#e8339e] to-[#7a1e7e] px-4 py-3 text-sm font-extrabold uppercase tracking-[0.06em] text-white shadow-[0_8px_18px_rgba(122,30,126,0.25)] transition disabled:opacity-60"
          >
            {captureOrder.isPending
              ? "Verifying payment…"
              : "Retry secure confirmation"}
          </button>
        )}

        {order &&
          !requiresServerRetry &&
          pending?.paymentMethod !== "apple_pay" &&
          method !== "apple_pay" && (
            <PayPalCardFields
              order={order}
              onPaymentStart={() => setPaymentStarted(true)}
              onPaymentComplete={async () => {
                markProviderApproved(order, "card");
                await completePayment(order);
              }}
              onPaymentError={onError}
            />
          )}

        {order &&
          !requiresServerRetry &&
          (pending?.paymentMethod === "apple_pay" || method === "apple_pay") &&
          !paymentStarted && (
            <button
              type="button"
              onClick={retryConfirmation}
              disabled={captureOrder.isPending}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#e8339e] to-[#7a1e7e] px-4 py-3 text-sm font-extrabold uppercase tracking-[0.06em] text-white shadow-[0_8px_18px_rgba(122,30,126,0.25)] transition disabled:opacity-60"
            >
              {captureOrder.isPending
                ? "Verifying payment…"
                : "Retry secure confirmation"}
            </button>
          )}

        {(paymentStarted || captureOrder.isPending) &&
          order &&
          !requiresServerRetry && (
            <button
              type="button"
              onClick={retryConfirmation}
              disabled={captureOrder.isPending}
              className="w-full text-center text-xs font-bold text-[#7a1e7e] underline underline-offset-4 disabled:opacity-50"
            >
              {captureOrder.isPending
                ? "Verifying secure payment…"
                : "Retry secure confirmation"}
            </button>
          )}
      </div>
    </PayPalScriptProvider>
  );
}
