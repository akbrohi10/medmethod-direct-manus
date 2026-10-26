import LegacyVideoVisitCheckout from "../VideoVisitCheckout";
import { getVideoVisitPendingCheckout as getLegacyVideoVisitPendingCheckout } from "../videoVisitCheckoutStorage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import {
  CheckCircle2,
  ChevronLeft,
  LockKeyhole,
  Phone,
  Video,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import VideoVisitPaypalPayment from "./VideoVisitPaypalPayment4799";
import VideoVisitStripePayment from "./VideoVisitStripePayment4799";
import {
  clearVideoVisitPendingCheckout,
  createVideoVisitCheckoutId,
  getVideoVisitPendingCheckout,
  redirectToVideoVisitThankYou,
  type VideoVisitPendingCheckout,
} from "./videoVisitCheckout4799Storage";

type Contact = {
  name: string;
  email: string;
  phone: string;
};

type CheckoutStep = "contact" | "payment";

const EMPTY_CONTACT: Contact = { name: "", email: "", phone: "" };

function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}

function validContact(contact: Contact): string | null {
  if (contact.name.trim().length < 2) return "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim()))
    return "Please enter a valid email address.";
  if (normalizePhone(contact.phone).length < 7)
    return "Please enter a valid mobile number.";
  return null;
}

function safePendingCheckout(): VideoVisitPendingCheckout | null {
  return getVideoVisitPendingCheckout();
}

function needsServerConfirmation(
  pending: VideoVisitPendingCheckout | null
): boolean {
  return (
    pending?.phase === "confirming" || pending?.phase === "provider_approved"
  );
}

/**
 * Resolves an existing, opaque provider payment without loading either payment
 * SDK. The pending provider is authoritative here: an admin provider switch
 * must never turn a returning 3DS/approved payment into a new checkout.
 */
function PendingPaymentConfirmation({
  pending,
  onComplete,
  onError,
}: {
  pending: VideoVisitPendingCheckout;
  onComplete: (redirectUrl: unknown) => void;
  onError: (message: string) => void;
}) {
  const confirmStripePayment =
    trpc.masterclassVideo4799.confirmStripePayment.useMutation();
  const capturePaypalOrder =
    trpc.masterclassVideo4799.capturePaypalOrder.useMutation();
  const verifying =
    confirmStripePayment.isPending || capturePaypalOrder.isPending;

  const retryConfirmation = async () => {
    try {
      if (pending.provider === "stripe" && pending.paymentIntentId) {
        const result = await confirmStripePayment.mutateAsync({
          paymentIntentId: pending.paymentIntentId,
          checkout_token: pending.checkoutToken,
        });
        onComplete(result.redirect_url);
        return;
      }

      if (pending.provider === "paypal" && pending.orderId) {
        const result = await capturePaypalOrder.mutateAsync({
          orderId: pending.orderId,
          checkout_token: pending.checkoutToken,
        });
        onComplete(result.redirect_url);
        return;
      }

      onError(
        "We could not match this payment to your secure checkout. No additional charge was made."
      );
    } catch (error) {
      onError(
        error instanceof Error && error.message
          ? error.message
          : "We could not verify the payment yet. No additional charge was made."
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
        disabled={verifying}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e8339e] to-[#7a1e7e] px-4 py-3 text-sm font-extrabold uppercase tracking-[0.06em] text-white shadow-[0_8px_18px_rgba(122,30,126,0.25)] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a1e7e] disabled:cursor-wait disabled:opacity-60"
      >
        {verifying ? "Verifying payment…" : "Retry secure confirmation"}
      </button>
    </div>
  );
}

export interface VideoVisitCheckout4799Props {
  open: boolean;
  onClose: () => void;
}

/** Preserve the original amount and provider IDs for an already-started $39 payment. */
export default function VideoVisitCheckout4799(props: VideoVisitCheckout4799Props) {
  const legacyPending = props.open ? getLegacyVideoVisitPendingCheckout() : null;
  return legacyPending
    ? <LegacyVideoVisitCheckout {...props} />
    : <NewVideoVisitCheckout4799 {...props} />;
}

/**
 * Controlled, /masterclass2-only checkout for a single $47.99 self-pay video visit.
 * It has no connection to the existing consultation/deposit modals.
 */
function NewVideoVisitCheckout4799({
  open,
  onClose,
}: VideoVisitCheckout4799Props) {
  const [step, setStep] = useState<CheckoutStep>("contact");
  const [contact, setContact] = useState<Contact>(EMPTY_CONTACT);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [pending, setPending] = useState<VideoVisitPendingCheckout | null>(
    null
  );
  const [message, setMessage] = useState<string | null>(null);
  const [resumeNotice, setResumeNotice] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const serverConfirmationPending = needsServerConfirmation(pending);

  const configQuery = trpc.masterclassVideo4799.config.useQuery(undefined, {
    // Returning provider confirmation uses the saved provider IDs only. Do not
    // fetch/select the current active provider or load an SDK for that path.
    enabled: open && step === "payment" && !serverConfirmationPending,
    retry: false,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!open) return;
    const stored = safePendingCheckout();
    if (!stored) {
      setStep("contact");
      setContact(EMPTY_CONTACT);
      setCheckoutId(null);
      setPending(null);
      setMessage(null);
      setResumeNotice(false);
      return;
    }

    // Stored data intentionally contains only opaque provider IDs/tokens—never contact data.
    const needsContactReentry = !needsServerConfirmation(stored);
    setStep(needsContactReentry ? "contact" : "payment");
    setContact(EMPTY_CONTACT);
    setCheckoutId(stored.checkoutId);
    setPending(stored);
    setMessage(null);
    setResumeNotice(!needsContactReentry);
  }, [open]);

  useEffect(() => {
    if (open && step === "contact") {
      window.setTimeout(() => nameInputRef.current?.focus(), 0);
    }
  }, [open, step]);

  const close = () => {
    setMessage(null);
    onClose();
  };

  const beginPayment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const error = validContact(contact);
    if (error) {
      setMessage(error);
      return;
    }
    const nextCheckoutId =
      pending?.phase === "created" && checkoutId
        ? checkoutId
        : createVideoVisitCheckoutId();
    if (!nextCheckoutId) {
      setMessage(
        "Your browser could not start a secure checkout. Please refresh and try again."
      );
      return;
    }
    setCheckoutId(nextCheckoutId);
    setPending(current => (current?.phase === "created" ? current : null));
    setResumeNotice(false);
    setMessage(null);
    setStep("payment");
  };

  const goBack = () => {
    // A provider callback can persist a newer phase than this component's
    // render state. Never clear it and permit a new purchase after a provider
    // confirmation attempt; keep the patient on same-payment verification.
    const stored = safePendingCheckout();
    if (stored && needsServerConfirmation(stored)) {
      setCheckoutId(stored.checkoutId);
      setPending(stored);
      setContact(EMPTY_CONTACT);
      setMessage(null);
      setResumeNotice(true);
      setStep("payment");
      return;
    }

    // A new UUID prevents altered contact details from reusing a provider order/intent.
    clearVideoVisitPendingCheckout();
    setPending(null);
    setCheckoutId(null);
    setMessage(null);
    setResumeNotice(false);
    setStep("contact");
  };

  const handleCompletion = (redirectUrl: unknown) => {
    if (!redirectToVideoVisitThankYou(redirectUrl)) {
      setMessage(
        "Payment confirmation did not return the expected receipt page. No redirect was made."
      );
      return;
    }
    clearVideoVisitPendingCheckout();
  };

  const handleError = (error: string) => setMessage(error);
  const config = configQuery.data;
  const activeProvider = config?.activeProvider;

  return (
    <Dialog open={open} onOpenChange={nextOpen => !nextOpen && close()}>
      <DialogContent
        showCloseButton={false}
        aria-describedby="masterclass2-video-checkout-description"
        className="max-h-[calc(100dvh-1.5rem)] w-[min(100%-1rem,34rem)] max-w-[34rem] gap-0 overflow-y-auto rounded-2xl border-[#e5d5e2] bg-[#fffdfd] p-0 font-['Montserrat',sans-serif] shadow-[0_24px_70px_rgba(63,22,64,0.27)] sm:max-h-[calc(100dvh-3rem)]"
        data-masterclass2-video-checkout
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#f0e3ed] bg-[#fffdfd]/95 px-5 py-4 backdrop-blur sm:px-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#e8339e]">
              One-time video visit
            </p>
            <DialogTitle className="mt-1 text-xl font-black tracking-[-0.025em] text-[#2f2031]">
              Book your video visit
            </DialogTitle>
            <DialogDescription
              id="masterclass2-video-checkout-description"
              className="mt-1 text-xs leading-relaxed text-[#6c5e6c]"
            >
              Step {step === "contact" ? "1" : "2"} of 2 · secure self-pay
              checkout
            </DialogDescription>
          </div>
          <button
            type="button"
            onClick={close}
            className="-mr-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#6c5e6c] transition hover:bg-[#f7eef5] hover:text-[#4a2448] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a1e7e]"
            aria-label="Close video visit checkout"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="p-5 sm:p-6">
          <div className="mb-5 rounded-xl border border-[#e5cbe0] bg-gradient-to-r from-[#fff5fb] to-[#f9f3ff] p-4">
            <div className="flex items-start gap-3">
              <Video
                className="mt-0.5 h-5 w-5 shrink-0 text-[#b52980]"
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-[#432e42]">
                  Zoom video visit with Dr. Al-Deek
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#665766]">
                  Personalized, self-pay physician care.
                </p>
              </div>
              <span className="whitespace-nowrap text-xl font-black tracking-[-0.04em] text-[#7a1e7e]">
                $47.99
              </span>
            </div>
          </div>

          {message && (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-relaxed text-red-800"
            >
              {message}
            </div>
          )}

          {step === "contact" && (
            <form onSubmit={beginPayment} className="space-y-4" noValidate>
              {pending?.phase === "created" && (
                <div className="rounded-xl border border-[#decce6] bg-[#faf6fc] p-3 text-xs leading-relaxed text-[#5d4e60]">
                  Re-enter your contact details to continue the same secure
                  checkout. No new payment will be created.
                </div>
              )}
              <div>
                <label
                  htmlFor="masterclass2-video-name"
                  className="mb-1.5 block text-sm font-bold text-[#403440]"
                >
                  Full name
                </label>
                <input
                  ref={nameInputRef}
                  id="masterclass2-video-name"
                  name="name"
                  autoComplete="name"
                  value={contact.name}
                  onChange={event =>
                    setContact(current => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className="min-h-12 w-full rounded-xl border border-[#dcd0db] bg-white px-3 text-base text-[#332734] shadow-sm outline-none transition placeholder:text-[#a196a1] focus:border-[#b52b8c] focus:ring-2 focus:ring-[#e8339e]/20"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="masterclass2-video-email"
                  className="mb-1.5 block text-sm font-bold text-[#403440]"
                >
                  Email
                </label>
                <input
                  id="masterclass2-video-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={contact.email}
                  onChange={event =>
                    setContact(current => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  className="min-h-12 w-full rounded-xl border border-[#dcd0db] bg-white px-3 text-base text-[#332734] shadow-sm outline-none transition placeholder:text-[#a196a1] focus:border-[#b52b8c] focus:ring-2 focus:ring-[#e8339e]/20"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="masterclass2-video-phone"
                  className="mb-1.5 block text-sm font-bold text-[#403440]"
                >
                  Mobile number
                </label>
                <div className="relative">
                  <Phone
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b7c8a]"
                    aria-hidden="true"
                  />
                  <input
                    id="masterclass2-video-phone"
                    name="tel"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    value={contact.phone}
                    onChange={event =>
                      setContact(current => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                    className="min-h-12 w-full rounded-xl border border-[#dcd0db] bg-white py-0 pr-3 pl-10 text-base text-[#332734] shadow-sm outline-none transition placeholder:text-[#a196a1] focus:border-[#b52b8c] focus:ring-2 focus:ring-[#e8339e]/20"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e8339e] to-[#7a1e7e] px-4 py-3 text-sm font-extrabold uppercase tracking-[0.06em] text-white shadow-[0_8px_18px_rgba(122,30,126,0.25)] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a1e7e]"
              >
                Continue to secure payment
              </button>
            </form>
          )}

          {step === "payment" && (
            <section aria-label="Secure payment" className="space-y-4">
              {resumeNotice && (
                <div className="rounded-xl border border-[#decce6] bg-[#faf6fc] p-3 text-xs leading-relaxed text-[#5d4e60]">
                  We found an in-progress secure payment. Confirm the same
                  checkout before starting another payment; no new payment will
                  be created.
                </div>
              )}

              {!resumeNotice && (
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex min-h-10 items-center gap-1.5 text-sm font-bold text-[#7a1e7e] underline underline-offset-4 transition hover:text-[#e8339e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a1e7e]"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  Back to contact details
                </button>
              )}

              {serverConfirmationPending && pending && (
                <PendingPaymentConfirmation
                  pending={pending}
                  onComplete={handleCompletion}
                  onError={handleError}
                />
              )}

              {!serverConfirmationPending && configQuery.isLoading && (
                <div className="flex min-h-28 flex-col items-center justify-center gap-3 text-center">
                  <span
                    className="h-6 w-6 animate-spin rounded-full border-2 border-[#e8339e] border-t-transparent"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-semibold text-[#655765]">
                    Loading secure payment…
                  </p>
                </div>
              )}

              {!serverConfirmationPending && configQuery.isError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
                  <p className="text-sm font-bold text-red-800">
                    Secure payment is temporarily unavailable
                  </p>
                  <button
                    type="button"
                    onClick={() => void configQuery.refetch()}
                    className="mt-2 text-xs font-bold text-[#7a1e7e] underline underline-offset-4"
                  >
                    Try again
                  </button>
                </div>
              )}

              {!serverConfirmationPending &&
                !configQuery.isLoading &&
                !configQuery.isError &&
                activeProvider === "paypal" &&
                (config?.clientId ? (
                  <VideoVisitPaypalPayment
                    clientId={config.clientId}
                    mode={config.mode === "live" ? "live" : "sandbox"}
                    contact={resumeNotice ? null : contact}
                    checkoutId={checkoutId ?? ""}
                    pending={pending}
                    onComplete={handleCompletion}
                    onError={handleError}
                  />
                ) : (
                  <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-semibold text-red-800">
                    PayPal is not configured for this checkout.
                  </p>
                ))}

              {!serverConfirmationPending &&
                !configQuery.isLoading &&
                !configQuery.isError &&
                activeProvider === "stripe" &&
                (config?.publishableKey ? (
                  <VideoVisitStripePayment
                    publishableKey={config.publishableKey}
                    contact={resumeNotice ? null : contact}
                    checkoutId={checkoutId ?? ""}
                    pending={pending}
                    onComplete={handleCompletion}
                    onError={handleError}
                  />
                ) : (
                  <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-semibold text-red-800">
                    Stripe is not configured for this checkout.
                  </p>
                ))}
            </section>
          )}

          <div className="mt-5 border-t border-[#f0e5ee] pt-4">
            <p className="flex gap-2 text-xs leading-relaxed text-[#625662]">
              <LockKeyhole
                className="mt-0.5 h-4 w-4 shrink-0 text-[#7a1e7e]"
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1">
                By selecting <strong>Pay $47.99 now</strong>, you authorize a
                one-time $47.99 USD payment for this visit. There is no deposit,
                balance, recurring charge, saved payment method, or subscription.
              </span>
            </p>
            <p className="mt-2 text-xs leading-relaxed text-[#766977]">
              This is a self-pay physician visit. Medication, if clinically
              appropriate, is separate and not included in this visit fee.
            </p>
            <p className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-[#756576]">
              <CheckCircle2
                className="h-4 w-4 shrink-0 text-emerald-600"
                aria-hidden="true"
              />
              Card details are entered only in secure provider-hosted payment
              fields.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
