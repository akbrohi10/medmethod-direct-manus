import { trpc } from "@/lib/trpc";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { LockKeyhole } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  type VideoVisitPendingCheckout,
  saveVideoVisitPendingCheckout,
} from "./videoVisitCheckoutStorage";

type Contact = {
  name: string;
  email: string;
  phone: string;
};

type CreatedIntent = {
  paymentIntentId: string;
  clientSecret: string;
  checkout_token: string;
};

function paymentError(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function ConfirmedStripePayment({
  intent,
  onComplete,
  onError,
}: {
  intent: Pick<CreatedIntent, "paymentIntentId" | "checkout_token">;
  onComplete: (redirectUrl: unknown) => void;
  onError: (message: string) => void;
}) {
  const confirmPayment =
    trpc.masterclassVideo.confirmStripePayment.useMutation();

  const retryConfirmation = async () => {
    try {
      const result = await confirmPayment.mutateAsync({
        paymentIntentId: intent.paymentIntentId,
        checkout_token: intent.checkout_token,
      });
      onComplete(result.redirect_url);
    } catch (error) {
      onError(
        paymentError(
          error,
          "We could not verify the payment yet. No additional charge was made."
        )
      );
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-[#ead4e4] bg-[#fff9fc] p-4">
      <p className="text-sm font-bold text-[#4a3449]">
        Your secure payment needs confirmation.
      </p>
      <p className="text-xs leading-relaxed text-[#6d626d]">
        Retrying checks the same one-time payment only. It will not create
        another charge.
      </p>
      <button
        type="button"
        onClick={() => void retryConfirmation()}
        disabled={confirmPayment.isPending}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e8339e] to-[#7a1e7e] px-4 py-3 text-sm font-extrabold uppercase tracking-[0.06em] text-white shadow-[0_8px_18px_rgba(122,30,126,0.25)] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a1e7e] disabled:cursor-wait disabled:opacity-60"
      >
        {confirmPayment.isPending
          ? "Verifying payment…"
          : "Retry secure confirmation"}
      </button>
    </div>
  );
}

function StripeElementForm({
  intent,
  onComplete,
  onError,
}: {
  intent: CreatedIntent & { checkoutId: string };
  onComplete: (redirectUrl: unknown) => void;
  onError: (message: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [needsServerConfirmation, setNeedsServerConfirmation] = useState(false);

  const confirmPayment =
    trpc.masterclassVideo.confirmStripePayment.useMutation();

  const savePendingPhase = (
    phase: "created" | "confirming" | "provider_approved"
  ) => {
    saveVideoVisitPendingCheckout({
      version: 1,
      provider: "stripe",
      checkoutId: intent.checkoutId,
      checkoutToken: intent.checkout_token,
      paymentIntentId: intent.paymentIntentId,
      phase,
    });
  };

  const markProviderApproved = () => savePendingPhase("provider_approved");

  const confirmWithServer = async () => {
    const result = await confirmPayment.mutateAsync({
      paymentIntentId: intent.paymentIntentId,
      checkout_token: intent.checkout_token,
    });
    onComplete(result.redirect_url);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements || submitting || needsServerConfirmation) return;

    setSubmitting(true);
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setSubmitting(false);
      onError(submitError.message ?? "Please check your payment details.");
      return;
    }

    // Stripe may leave this page for 3DS. Save the opaque, server-verifiable
    // intent before confirmation so the returning page cannot create another
    // intent while the bank authentication result is being resolved.
    savePendingPhase("confirming");
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        // The URL includes no contact details or other patient information.
        return_url: `${window.location.origin}${window.location.pathname.replace(/\/$/, "") === "/masterclass" ? "/masterclass" : "/masterclass2"}`,
        payment_method_data: {
          billing_details: { address: { country: "US" } },
        },
      },
    });

    if (error) {
      // Validation/decline errors did not authorize the provider payment, so
      // return this stable checkout to its normal hosted-field retry state.
      savePendingPhase("created");
      setSubmitting(false);
      onError(
        error.message ??
          "Your payment could not be completed. Please try again."
      );
      return;
    }

    if (paymentIntent?.id !== intent.paymentIntentId) {
      setSubmitting(false);
      onError(
        "We could not match this payment to your secure checkout. No additional charge was made."
      );
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      markProviderApproved();
      setNeedsServerConfirmation(true);
      try {
        await confirmWithServer();
      } catch (serverError) {
        setSubmitting(false);
        onError(
          paymentError(
            serverError,
            "We could not verify the payment yet. No additional charge was made."
          )
        );
      }
      return;
    }

    // Masterclass bank-authentication returns use /masterclass; other consumers keep their legacy /masterclass2 fallback. The
    // opaque intent/token saved before confirmation lets the user verify the same payment.
    if (
      paymentIntent?.status === "requires_action" ||
      paymentIntent?.status === "processing"
    ) {
      markProviderApproved();
      setSubmitting(false);
      setNeedsServerConfirmation(true);
      return;
    }

    setSubmitting(false);
    onError("Payment was not completed. Please try again.");
  };

  if (needsServerConfirmation) {
    return (
      <ConfirmedStripePayment
        intent={intent}
        onComplete={onComplete}
        onError={onError}
      />
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <label className="mb-2 block text-sm font-bold text-[#3d3040]">
          Payment information
        </label>
        <div className="min-h-[132px] rounded-xl border border-[#dfd1df] bg-white p-3">
          <PaymentElement
            onReady={() => setReady(true)}
            options={{
              layout: "tabs",
              fields: {
                billingDetails: {
                  address: { country: "never", postalCode: "auto" },
                },
              },
              terms: { card: "never" },
            }}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={
          !stripe ||
          !elements ||
          !ready ||
          submitting ||
          confirmPayment.isPending
        }
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e8339e] to-[#7a1e7e] px-4 py-3 text-sm font-extrabold uppercase tracking-[0.06em] text-white shadow-[0_8px_18px_rgba(122,30,126,0.25)] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a1e7e] disabled:cursor-wait disabled:opacity-55"
      >
        <LockKeyhole className="h-4 w-4" aria-hidden="true" />
        {submitting || confirmPayment.isPending
          ? "Confirming payment…"
          : "Pay $39 now"}
      </button>
    </form>
  );
}

export interface VideoVisitStripePaymentProps {
  publishableKey: string;
  contact: Contact | null;
  checkoutId: string;
  pending?: VideoVisitPendingCheckout | null;
  onComplete: (redirectUrl: unknown) => void;
  onError: (message: string) => void;
}

/** Stripe Payment Element for the $39, one-time masterclass video visit. */
export default function VideoVisitStripePayment({
  publishableKey,
  contact,
  checkoutId,
  pending,
  onComplete,
  onError,
}: VideoVisitStripePaymentProps) {
  const [intent, setIntent] = useState<CreatedIntent | null>(null);
  const [initializing, setInitializing] = useState(Boolean(contact));
  const [initError, setInitError] = useState<string | null>(null);
  const stripePromise = useMemo(
    () => loadStripe(publishableKey),
    [publishableKey]
  );
  const createIntent = trpc.masterclassVideo.createStripeIntent.useMutation();

  useEffect(() => {
    if (!contact || intent || initError || createIntent.isPending) return;
    let active = true;
    setInitializing(true);

    void createIntent
      .mutateAsync({
        checkout_id: checkoutId,
        patientName: contact.name,
        patientEmail: contact.email,
        patientPhone: contact.phone,
      })
      .then(created => {
        if (!active) return;
        setIntent(created);
        saveVideoVisitPendingCheckout({
          version: 1,
          provider: "stripe",
          checkoutId,
          checkoutToken: created.checkout_token,
          paymentIntentId: created.paymentIntentId,
          phase: "created",
        });
      })
      .catch((error: unknown) => {
        if (!active) return;
        const message = paymentError(
          error,
          "We could not prepare secure payment. Please try again."
        );
        setInitError(message);
        onError(message);
      })
      .finally(() => {
        if (active) setInitializing(false);
      });

    return () => {
      active = false;
    };
    // A checkout may be created only once for the stable checkout ID. Contact changes occur through Back.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutId, contact]);

  const recoverableIntent =
    pending?.provider === "stripe" &&
    pending.checkoutId === checkoutId &&
    pending.paymentIntentId &&
    pending.phase === "provider_approved"
      ? {
          paymentIntentId: pending.paymentIntentId,
          checkout_token: pending.checkoutToken,
        }
      : null;

  if (recoverableIntent && !contact) {
    return (
      <ConfirmedStripePayment
        intent={recoverableIntent}
        onComplete={onComplete}
        onError={onError}
      />
    );
  }

  if (initError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
        <p className="text-sm font-bold text-red-800">
          Secure payment unavailable
        </p>
        <p className="mt-1 text-xs leading-relaxed text-red-700">{initError}</p>
      </div>
    );
  }

  if (initializing || !intent) {
    return (
      <div className="flex min-h-28 flex-col items-center justify-center gap-3 text-center">
        <span
          className="h-6 w-6 animate-spin rounded-full border-2 border-[#e8339e] border-t-transparent"
          aria-hidden="true"
        />
        <p className="text-sm font-semibold text-[#655765]">
          Preparing secure payment…
        </p>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise as PromiseLike<Stripe | null>}
      options={{
        clientSecret: intent.clientSecret,
        appearance: { theme: "stripe" },
      }}
    >
      <StripeElementForm
        intent={{ ...intent, checkoutId }}
        onComplete={onComplete}
        onError={onError}
      />
    </Elements>
  );
}
