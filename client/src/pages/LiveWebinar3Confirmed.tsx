import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowRight, CalendarDays, Check, CheckCircle2, Clock3, Mail } from "lucide-react";

const LIVE_WEBINAR3_CONVERSION_STORAGE_KEY = "medmethod:live-webinar3-registration-conversion-fired";
const LIVE_WEBINAR3_HANDOFF_STORAGE_KEY = "medmethod:live-webinar3-confirmation-handoff";
let liveWebinar3ConversionTracked = false;

const learningChecklist = [
  { title: "Why You Can’t Lose Weight Like You Used To", body: "What changes in your 30s, 40s & 50s—and why." },
  { title: "Is It Perimenopause or Menopause?", body: "The signs and symptoms your body may be trying to tell you." },
  { title: "Hot Flashes, Poor Sleep, Mood Changes & Low Energy", body: "Understand what may actually be happening with your hormones." },
  { title: "The Truth About Hormone Therapy", body: "What every woman should know about her options." },
  { title: "GLP-1s & Medical Weight Loss", body: "When they may help—and what proper treatment should look like." },
  { title: "What to Ask Your Doctor", body: "Know your options and become a better advocate for your health." },
  { title: "Live Q&A with Dr. Jumana Al-Deek", body: "Get answers directly from a menopause & medical weight loss specialist." },
] as const;

/**
 * The SendMeAPro form redirects completed webinar registrations to this route.
 * A guard keeps Meta CompleteRegistration and the matching dataLayer event from
 * being emitted twice when a visitor refreshes this confirmation page.
 */
export default function LiveWebinar3Confirmed() {
  useEffect(() => {
    try {
      window.sessionStorage.removeItem(LIVE_WEBINAR3_HANDOFF_STORAGE_KEY);
    } catch {
      // Session storage can be unavailable in privacy-restricted contexts.
    }
    if (liveWebinar3ConversionTracked) return;

    try {
      if (window.sessionStorage.getItem(LIVE_WEBINAR3_CONVERSION_STORAGE_KEY) === "1") return;
      window.sessionStorage.setItem(LIVE_WEBINAR3_CONVERSION_STORAGE_KEY, "1");
    } catch {
      // Session storage can be unavailable in privacy-restricted contexts. The
      // module-level guard still prevents duplicate tracking during this visit.
    }

    liveWebinar3ConversionTracked = true;

    const w = window as typeof window & {
      dataLayer?: Array<Record<string, unknown>>;
      fbq?: (command: string, eventName: string, parameters?: Record<string, unknown>) => void;
    };

    w.dataLayer?.push({ event: "live_webinar3_registration_complete" });
    w.fbq?.("track", "CompleteRegistration", {
      content_name: "Free Live Zoom Webinar",
      content_category: "Webinar Registration",
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Free Live Zoom Webinar Registration Confirmed | MedMethod Direct</title>
        <meta
          name="description"
          content="Your Free Live Zoom Webinar registration is confirmed. Check your email for the Zoom link and explore what the webinar will cover."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://www.medmethoddirect.com/live-webinar3-confirmed" />
      </Helmet>

      <main
        data-live-webinar3-confirmation
        className="min-h-screen overflow-hidden bg-[#fffaf8] px-5 py-8 text-[#35152f] sm:px-8 sm:py-12"
      >
        <div className="mx-auto max-w-[820px]">
          <div className="w-full rounded-[2rem] border border-[#f0dce5] bg-white px-6 py-10 text-center shadow-[0_24px_70px_rgba(91,38,77,0.13)] sm:px-12 sm:py-14">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fde8ef] text-[#dd2d84] shadow-[0_10px_24px_rgba(221,45,132,0.16)] sm:h-[4.5rem] sm:w-[4.5rem]">
              <CheckCircle2 className="h-9 w-9 stroke-[2.4] sm:h-10 sm:w-10" aria-hidden="true" />
            </div>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-[#cf1475]">
              Free Live Zoom Webinar Confirmed
            </p>
            <h1 className="mt-3 font-serif text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-[#35152f] sm:text-5xl">
              You’re all set.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#655461] sm:text-lg sm:leading-8">
              Thank you for registering for our free live educational webinar.
            </p>

            <div className="mx-auto mt-8 grid max-w-[510px] gap-3 rounded-2xl border border-[#f0dce5] bg-[#fff7fa] p-4 text-left sm:grid-cols-2 sm:p-5">
              <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
                <CalendarDays className="h-5 w-5 shrink-0 text-[#dd2d84]" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#9b7388]">Date</p>
                  <p className="mt-0.5 text-sm font-extrabold text-[#432943]">Wednesday, September 16</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
                <Clock3 className="h-5 w-5 shrink-0 text-[#dd2d84]" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#9b7388]">Time</p>
                  <p className="mt-0.5 text-sm font-extrabold text-[#432943]">7:00 PM ET</p>
                </div>
              </div>
            </div>

            <div className="mx-auto mt-7 flex max-w-xl items-start gap-3 rounded-xl border border-[#ece4e9] bg-[#fffdfd] px-4 py-4 text-left sm:px-5">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#7a1e7e]" aria-hidden="true" />
              <p className="text-sm leading-6 text-[#655461] sm:text-base">
                Your Zoom link has been sent to the email address you used to register. Please check your inbox—and your spam or promotions folder, just in case.
              </p>
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

          <section
            data-live-webinar3-confirmed-learning
            aria-labelledby="live-webinar3-confirmed-learning-heading"
            className="mt-6 rounded-[2rem] border border-[#f0dce5] bg-[#fff7f5] px-6 py-9 shadow-[0_18px_44px_rgba(91,38,77,0.08)] sm:mt-8 sm:px-12 sm:py-12"
          >
            <div className="mx-auto max-w-[700px] text-center">
              <p className="inline-flex rounded-full bg-[#fde8ef] px-5 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#cf1475] sm:px-6 sm:text-xs">
                What You’ll Learn
              </p>
              <h2 id="live-webinar3-confirmed-learning-heading" className="mt-5 font-serif text-3xl font-bold leading-tight tracking-[-0.035em] text-[#432943] sm:text-4xl">
                Because You Deserve to Know.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#655461] sm:text-base sm:leading-7">
                Understand perimenopause, menopause, hormone therapy, and medical weight loss—so you can feel more informed about your options and the questions you may want to ask.
              </p>

              <div data-live-webinar3-confirmed-doctor className="mx-auto mt-7 max-w-xl rounded-2xl border border-[#e5cad9] bg-white px-5 py-5 text-left shadow-sm sm:px-6">
                <p className="text-sm font-black text-[#432943]">Dr. Jumana Al-Deek</p>
                <p className="mt-1 text-sm leading-6 text-[#655461]">
                  Physician and author of <em>The Menopause Weight Loss Trap</em>.
                </p>
              </div>

              <ul className="mx-auto mt-8 max-w-[680px] text-left sm:mt-10">
                {learningChecklist.map(({ title, body }) => (
                  <li key={title} className="flex gap-3 border-b border-[#eadde4] py-5 first:pt-0 last:border-b-0 last:pb-0 sm:gap-4 sm:py-6">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#dd2d84] text-white shadow-[0_5px_12px_rgba(221,45,132,0.18)] sm:h-9 sm:w-9" aria-hidden="true">
                      <Check className="h-4 w-4 stroke-[3] sm:h-5 sm:w-5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-base font-extrabold leading-[1.3] text-[#432943] sm:text-lg">{title}</h3>
                      <p className="mt-1.5 text-sm leading-6 text-[#514a52] sm:text-base">{body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <p className="mx-auto mt-7 max-w-xl text-center text-xs leading-5 text-[#7a727a]">
            This live webinar is for general educational purposes and is not a medical consultation. Individual treatment recommendations require an appropriate medical evaluation.
          </p>
        </div>
      </main>
    </>
  );
}
