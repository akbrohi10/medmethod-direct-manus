import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowRight, CalendarDays, Clock3, MailCheck } from "lucide-react";

const WEBINAR_CONVERSION_STORAGE_KEY = "medmethod:webinar-registration-conversion-fired";
const LIVE_WEBINAR3_HANDOFF_STORAGE_KEY = "medmethod:live-webinar3-confirmation-handoff";
const LIVE_WEBINAR3_CONFIRMATION_PATH = "/live-webinar3-confirmed";
const LIVE_WEBINAR3_HANDOFF_WINDOW_MS = 30 * 60 * 1000;
const WEBINAR_LEAD_SCRIPT_SELECTOR = "script[data-webinar-registration-lead]";
let webinarConversionTracked = false;
let liveWebinar3HandoffActive = false;

function consumeLiveWebinar3Handoff() {
  if (liveWebinar3HandoffActive) return true;

  try {
    const recordedAt = Number(window.sessionStorage.getItem(LIVE_WEBINAR3_HANDOFF_STORAGE_KEY));
    if (!Number.isFinite(recordedAt) || Date.now() - recordedAt > LIVE_WEBINAR3_HANDOFF_WINDOW_MS) {
      window.sessionStorage.removeItem(LIVE_WEBINAR3_HANDOFF_STORAGE_KEY);
      return false;
    }
    window.sessionStorage.removeItem(LIVE_WEBINAR3_HANDOFF_STORAGE_KEY);
    liveWebinar3HandoffActive = true;
    return true;
  } catch {
    return false;
  }
}

/**
 * The SendMeAPro form redirects completed webinar registrations to this route.
 * Separate guards keep the Meta conversion and matching dataLayer completion
 * signal from being emitted twice when a visitor refreshes this page.
 */
export default function WebinarRegistrationConfirmed() {
  const isLiveWebinar3Handoff = consumeLiveWebinar3Handoff();

  useEffect(() => {
    if (isLiveWebinar3Handoff) {
      window.location.replace(LIVE_WEBINAR3_CONFIRMATION_PATH);
      return;
    }

    if (!document.querySelector(WEBINAR_LEAD_SCRIPT_SELECTOR)) {
      const script = document.createElement("script");
      script.dataset.webinarRegistrationLead = "true";
      script.textContent = "fbq('track', 'Lead');";
      document.head.appendChild(script);
    }

    if (webinarConversionTracked) return;

    try {
      if (window.sessionStorage.getItem(WEBINAR_CONVERSION_STORAGE_KEY) === "1") return;
      window.sessionStorage.setItem(WEBINAR_CONVERSION_STORAGE_KEY, "1");
    } catch {
      // Session storage can be unavailable in privacy-restricted contexts. The
      // module-level guard still prevents duplicate tracking during this visit.
    }

    webinarConversionTracked = true;

    const w = window as typeof window & {
      dataLayer?: Array<Record<string, unknown>>;
    };

    w.dataLayer?.push({ event: "webinar_registration_complete" });
  }, [isLiveWebinar3Handoff]);

  if (isLiveWebinar3Handoff) return null;

  return (
    <>
      <Helmet>
        <title>Confirm Your Free Live Zoom Webinar Spot | MedMethod Direct</title>
        <meta
          name="description"
          content="We received your Free Live Zoom Webinar registration. Check your email or text messages and reply YES to confirm your spot."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://www.medmethoddirect.com/webinar-registration-confirmed" />
      </Helmet>

      <main
        data-webinar-registration-confirmation
        className="min-h-screen overflow-hidden bg-[#fffaf8] px-5 py-8 text-[#35152f] sm:px-8 sm:py-12"
      >
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[700px] flex-col items-center justify-center">
          <div className="w-full rounded-[2rem] border border-[#f0dce5] bg-white px-6 py-10 text-center shadow-[0_24px_70px_rgba(91,38,77,0.13)] sm:px-12 sm:py-14">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fde8ef] text-[#dd2d84] shadow-[0_10px_24px_rgba(221,45,132,0.16)] sm:h-[4.5rem] sm:w-[4.5rem]">
              <MailCheck className="h-9 w-9 stroke-[2.2] sm:h-10 sm:w-10" aria-hidden="true" />
            </div>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-[#cf1475]">
              Registration Received
            </p>
            <h1 className="mt-3 font-serif text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-[#35152f] sm:text-5xl">
              You’re almost in.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#655461] sm:text-lg sm:leading-8">
              We’ve received your registration for Dr. Al-Deek’s live webinar on Wednesday, September 23 at 7:30 PM EST.
            </p>

            <div className="mx-auto mt-8 grid max-w-[510px] gap-3 rounded-2xl border border-[#f0dce5] bg-[#fff7fa] p-4 text-left sm:grid-cols-2 sm:p-5">
              <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
                <CalendarDays className="h-5 w-5 shrink-0 text-[#dd2d84]" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#9b7388]">Date</p>
                  <p className="mt-0.5 text-sm font-extrabold text-[#432943]">Wednesday, September 23</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
                <Clock3 className="h-5 w-5 shrink-0 text-[#dd2d84]" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#9b7388]">Time</p>
                  <p className="mt-0.5 text-sm font-extrabold text-[#432943]">7:30 PM EST</p>
                </div>
              </div>
            </div>

            <div
              data-webinar-reply-yes-panel
              className="mx-auto mt-7 max-w-xl rounded-2xl border border-[#ebc8d9] bg-[#fff7fb] px-5 py-5 text-left shadow-[0_12px_28px_rgba(143,42,100,0.08)] sm:px-6 sm:py-6"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fde0ef] text-[#d51b75] sm:h-10 sm:w-10">
                  <MailCheck className="h-5 w-5 stroke-[2.3]" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-base font-black text-[#432943] sm:text-lg">One last step</p>
                  <p className="mt-1.5 text-sm leading-6 text-[#655461] sm:text-base sm:leading-7">
                    Check your email or texts and reply <strong className="font-black text-[#cf1475]">YES</strong> to confirm your spot. Because seats are limited, unconfirmed spots will be released to the waitlist.
                  </p>
                  <p className="mt-3 text-sm font-black text-[#cf1475] sm:text-base">Confirm now so you don’t lose your seat.</p>
                </div>
              </div>
            </div>

            <div className="mx-auto mt-8 max-w-xl">
              <div className="flex flex-col items-stretch justify-center">
                <a
                  href="/"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#ee2b91] to-[#7a1e7e] px-6 py-3 text-sm font-black uppercase tracking-[0.055em] text-white shadow-[0_12px_24px_rgba(176,24,124,0.2)] transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d51b75] focus-visible:ring-offset-4 active:scale-[0.97]"
                >
                  Read More About Dr. Jumana Al-Deek
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
              <p className="mt-4 text-sm font-semibold text-[#655461]">
                Questions? Call us at{" "}
                <a
                  href="tel:+18883627011"
                  className="whitespace-nowrap font-black text-[#7a1e7e] underline decoration-[#d85b9b]/60 underline-offset-4 transition hover:text-[#cf1475] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d51b75] focus-visible:ring-offset-2"
                >
                  (888) 362-7011
                </a>
                .
              </p>
            </div>
          </div>

          <p className="mt-6 max-w-xl text-center text-xs leading-5 text-[#7a727a]">
            This live webinar is for general educational purposes and is not a medical consultation. Individual treatment recommendations require an appropriate medical evaluation.
          </p>
        </div>
      </main>
    </>
  );
}
