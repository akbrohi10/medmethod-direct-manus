import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowRight, CheckCircle2, CircleHelp, Phone } from "lucide-react";

const CARE_TEAM_DISCOVERY_CALL_CONVERSION_STORAGE_KEY =
  "medmethod:care-team-discovery-call-conversion-fired";
let careTeamDiscoveryCallConversionTracked = false;

/**
 * GoHighLevel should redirect completed care-team bookings to this route.
 * The guards prevent duplicate conversion events when the confirmation page
 * is refreshed during a single browser session.
 */
export default function CareTeamBookingConfirmed() {
  useEffect(() => {
    if (careTeamDiscoveryCallConversionTracked) return;

    try {
      if (window.sessionStorage.getItem(CARE_TEAM_DISCOVERY_CALL_CONVERSION_STORAGE_KEY) === "1") return;
      window.sessionStorage.setItem(CARE_TEAM_DISCOVERY_CALL_CONVERSION_STORAGE_KEY, "1");
    } catch {
      // Storage can be unavailable in privacy-restricted contexts. The module
      // guard still prevents duplicate tracking during the current visit.
    }

    careTeamDiscoveryCallConversionTracked = true;

    const w = window as typeof window & {
      dataLayer?: Array<Record<string, unknown>>;
    };

    w.dataLayer?.push({ event: "care_team_discovery_call_booked" });
  }, []);

  return (
    <>
      <Helmet>
        <title>Your Free Discovery Call Is Confirmed | MedMethod Direct</title>
        <meta
          name="description"
          content="Your free 15-minute MedMethod Direct care-team discovery call is confirmed. Review your appointment confirmation for the scheduled details."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://www.medmethoddirect.com/care-team-booking-confirmed" />
      </Helmet>

      <main
        data-care-team-booking-confirmed
        className="min-h-screen overflow-hidden bg-[#fffaf8] px-5 py-8 text-[#35152f] sm:px-8 sm:py-12"
      >
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[760px] items-center">
          <section className="w-full rounded-[2rem] border border-[#f0dce5] bg-white px-6 py-10 text-center shadow-[0_24px_70px_rgba(91,38,77,0.13)] sm:px-12 sm:py-14">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fde8ef] text-[#dd2d84] shadow-[0_10px_24px_rgba(221,45,132,0.16)] sm:h-[4.5rem] sm:w-[4.5rem]">
              <CheckCircle2 className="h-9 w-9 stroke-[2.2] sm:h-10 sm:w-10" aria-hidden="true" />
            </div>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-[#cf1475]">
              Discovery Call Booked
            </p>
            <h1 className="mt-3 font-serif text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-[#35152f] sm:text-5xl">
              Your Free Call Is Confirmed.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#655461] sm:text-lg sm:leading-8">
              Your free 15-minute call with the MedMethod Direct Care Team has been scheduled.
            </p>

            <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-[#ebc8d9] bg-[#fff7fb] px-5 py-5 text-left shadow-[0_12px_28px_rgba(143,42,100,0.08)] sm:px-6 sm:py-6">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fde0ef] text-[#d51b75] sm:h-10 sm:w-10">
                  <CircleHelp className="h-5 w-5 stroke-[2.3]" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-base font-black text-[#432943] sm:text-lg">What to expect</p>
                  <p className="mt-1.5 text-sm leading-6 text-[#655461] sm:text-base sm:leading-7">
                    A Care Team member can answer general questions about the MedMethod Direct program, scheduling, and whether it may be a good fit.
                  </p>
                </div>
              </div>
            </div>

            <p className="mx-auto mt-5 max-w-xl text-sm font-semibold leading-6 text-[#7a1e7e] sm:text-base">
              This free call provides general information only. It does not provide medical advice, diagnosis, or treatment recommendations.
            </p>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#655461] sm:text-base">
              Please refer to your appointment confirmation for the scheduled date, time, and call details.
            </p>

            <div className="mx-auto mt-8 max-w-xl">
              <a
                href="/"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#ee2b91] to-[#7a1e7e] px-6 py-3 text-sm font-black uppercase tracking-[0.055em] text-white shadow-[0_12px_24px_rgba(176,24,124,0.2)] transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d51b75] focus-visible:ring-offset-4 active:scale-[0.97]"
              >
                Read More About Dr. Jumana Al-Deek
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
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
          </section>
        </div>
      </main>
    </>
  );
}
