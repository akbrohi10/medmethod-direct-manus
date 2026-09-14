import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import LpConsultationModal2 from "@/components/home1/LpConsultationModal2";
import {
  CARE_TEAM_BOOKING_CONFIRMATION_PATH,
  CARE_TEAM_CALENDAR_ORIGIN,
  getCareTeamConfirmationRedirectTarget,
} from "@/lib/careTeamBookingRedirect";
import { Helmet } from "react-helmet-async";
import { CalendarDays, CheckCircle2, PlayCircle, ShieldCheck, Stethoscope, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const LOGO = "/manus-storage/medmethod-logo-navbar_99a2ea82.png";
const MASTERCLASS_VIDEO_URL = "/manus-storage/replacement-speaking-event-web_3c5c62ae.mp4";
const MASTERCLASS_VIDEO_POSTER_URL = "/manus-storage/replacement-speaking-event-poster_5353b331.jpg";
const CARE_TEAM_CALENDAR_URL = "https://link.sendmeapro.com/widget/booking/18sbmUpLKjc7pcLE8jdN";

const FEATURED_OUTLETS = [
  { name: "Flow Space", logo: "/manus-storage/flow-space-white_beb898dc.png" },
  { name: "SingleCare", logo: "/manus-storage/singlecare-white_500a5691.png" },
  { name: "NTD", logo: "/manus-storage/ntd-white_dd8e5f55.png" },
  { name: "Scary Mommy", logo: "/manus-storage/scary-mommy-white_b136c1bf.png" },
  { name: "Daily Mail", logo: "/manus-storage/daily-mail-white_bc1019ba.png" },
  { name: "Yahoo Health", logo: "/manus-storage/yahoo-health-white_125ff57a.png" },
  { name: "This Is Menopause", logo: "/manus-storage/this-is-menopause-white_a9dd5679.png" },
  { name: "Woman’s World", logo: "/manus-storage/womans-world-white_ef5f9e69.png" },
];

function FeaturedInStrip() {
  const [pendingAssets, setPendingAssets] = useState(FEATURED_OUTLETS.length);
  const isReady = pendingAssets === 0;

  return (
    <section
      data-free-masterclass-featured-in
      aria-labelledby="free-masterclass-featured-heading"
      aria-busy={!isReady}
      className="overflow-hidden bg-gradient-to-r from-[#25134f] via-[#5b3aa4] to-[#2d185d] px-4 py-3 text-white"
    >
      <div className="mx-auto max-w-[1000px]">
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-white/45 sm:w-14" aria-hidden="true" />
          <h2 id="free-masterclass-featured-heading" className="text-[10px] font-black uppercase tracking-[0.16em] sm:text-xs">
            Featured In
          </h2>
          <span className="h-px w-8 bg-white/45 sm:w-14" aria-hidden="true" />
        </div>
        <div
          className="webinar2-logo-marquee scrollbar-hide mt-2.5"
          tabIndex={0}
          aria-label="Featured media outlets"
          style={{ WebkitMaskImage: "linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)", maskImage: "linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)" }}
        >
          <div className={`webinar2-logo-marquee__track ${isReady ? "is-ready" : ""}`}>
            <div className="flex shrink-0 items-center gap-7 pr-7 sm:gap-10 sm:pr-10">
              {FEATURED_OUTLETS.map((outlet) => (
                <div key={`${outlet.name}-primary`} className="flex h-8 w-24 shrink-0 items-center justify-center sm:h-9 sm:w-28">
                  <img
                    src={outlet.logo}
                    alt={`${outlet.name} logo`}
                    className="max-h-full max-w-full object-contain opacity-95"
                    loading="eager"
                    decoding="async"
                    onLoad={() => setPendingAssets((count) => Math.max(0, count - 1))}
                    onError={() => setPendingAssets((count) => Math.max(0, count - 1))}
                  />
                </div>
              ))}
            </div>
            <div className="webinar2-logo-marquee__duplicate flex shrink-0 items-center gap-7 pr-7 sm:gap-10 sm:pr-10" aria-hidden="true">
              {FEATURED_OUTLETS.map((outlet) => (
                <div key={`${outlet.name}-duplicate`} className="flex h-8 w-24 shrink-0 items-center justify-center sm:h-9 sm:w-28">
                  <img src={outlet.logo} alt="" className="max-h-full max-w-full object-contain opacity-95" loading="eager" decoding="async" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingDetails() {
  return (
    <Accordion type="single" collapsible className="mx-auto w-full max-w-3xl" data-free-masterclass-pricing>
      <AccordionItem value="pricing" className="rounded-2xl border border-[#e7d6df] bg-white px-5 shadow-[0_10px_28px_rgba(89,31,84,0.08)] sm:px-8">
        <AccordionTrigger className="justify-center gap-2 py-5 text-center text-sm font-black uppercase tracking-[0.08em] text-[#7a1e7e] hover:no-underline sm:text-base">
          See Full Pricing Details
        </AccordionTrigger>
        <AccordionContent className="pb-7 text-left">
          <div className="border-t border-[#eadfe5] pt-6">
            <p className="text-center text-[11px] font-black uppercase tracking-[0.16em] text-[#e8339e]">Transparent Pricing</p>
            <h2 className="mt-2 text-center text-2xl font-black text-[#251d29] sm:text-3xl">Your Care Plan</h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-[#655d63] sm:text-base">
              Pricing covers physician care, monitoring, and prescribing. Medication is billed separately and varies by medication, dosage, pharmacy, and insurance coverage.
            </p>
            <div className="mt-6 rounded-2xl border border-[#efcade] bg-gradient-to-br from-[#fff8fc] to-white p-5 sm:p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-xs font-black uppercase tracking-[0.13em] text-[#c32e78]">Initial Consultation</p>
                <p className="text-3xl font-black text-[#251d29]">$199</p>
              </div>
              <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2 sm:text-base">
                <p className="rounded-xl bg-white px-4 py-3 text-[#443b43]"><strong className="text-[#251d29]">Reserve today:</strong> $50 deposit</p>
                <p className="rounded-xl bg-white px-4 py-3 text-[#443b43]"><strong className="text-[#251d29]">Day of visit:</strong> remaining $149</p>
              </div>
              <div className="mt-5 flex gap-3 rounded-xl border border-[#f0c3da] bg-white/80 p-4">
                <Video className="mt-0.5 h-5 w-5 shrink-0 text-[#c32e78]" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-[#443b43]"><strong className="text-[#251d29]">45-minute physician consultation.</strong> Meet one-on-one with Dr. Jumana Al-Deek to review your health, symptoms, current medications, and goals.</p>
              </div>
              <ul className="mt-5 grid gap-2 text-sm text-[#443b43] sm:grid-cols-2">
                {["Comprehensive medical review", "Personalized treatment plan", "Prescription at your visit — if clinically appropriate", "30 days of direct text access", "Patient dashboard & progress tracking", "Medication options based on your needs"].map((item) => (
                  <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />{item}</li>
                ))}
              </ul>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[#e7e2e5] bg-[#fafafa] p-4">
                <p className="text-xs font-black uppercase tracking-[0.1em] text-[#786c75]">Option 1 — Pay as you go</p>
                <p className="mt-1 font-black text-[#251d29]">$150 follow-up visits</p>
                <p className="mt-2 text-sm text-[#655d63]">Schedule a physician follow-up when needed. No monthly commitment.</p>
              </div>
              <div className="rounded-xl border border-[#e7e2e5] bg-[#fafafa] p-4">
                <p className="text-xs font-black uppercase tracking-[0.1em] text-[#786c75]">Option 2</p>
                <p className="mt-1 font-black text-[#251d29]">$50/month ongoing care</p>
                <p className="mt-2 text-sm text-[#655d63]">Continued physician support, secure messaging, medication and dosing management.</p>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default function FreeMasterclass() {
  const [consultationOpen, setConsultationOpen] = useState(false);
  const calendarRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleCalendarMessage = (event: MessageEvent) => {
      if (event.origin !== CARE_TEAM_CALENDAR_ORIGIN) return;
      if (!calendarRef.current?.contentWindow || event.source !== calendarRef.current.contentWindow) return;
      const confirmationTarget = getCareTeamConfirmationRedirectTarget(event.data);
      if (confirmationTarget) window.location.assign(confirmationTarget);
    };

    window.addEventListener("message", handleCalendarMessage);
    return () => window.removeEventListener("message", handleCalendarMessage);
  }, []);

  return (
    <main className="min-h-screen bg-[#f3f0eb] text-[#25212a]" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <Helmet>
        <title>Free 45-Minute Masterclass | MedMethod Direct</title>
        <meta name="description" content="Watch a free on-demand educational masterclass with Dr. Jumana Al-Deek about menopause, hormones, metabolism, and medical weight loss." />
        <link rel="canonical" href="https://medmethoddirect.com/free-masterclass" />
      </Helmet>

      <header className="border-b border-[#e7e0e4] bg-white/95 px-4 py-3 backdrop-blur sm:px-7 sm:py-4">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4">
          <a href="/" aria-label="MedMethod Direct home"><img src={LOGO} alt="MedMethod Direct" className="h-8 w-auto sm:h-10" loading="eager" /></a>
          <a href="tel:+18883627011" className="text-right leading-tight text-[#df2f91] transition-colors hover:text-[#7a1e7e]">
            <span className="block text-[9px] font-black tracking-[0.18em]">CALL NOW</span>
            <span className="block text-sm font-black sm:text-base">(888) 362-7011</span>
          </a>
        </div>
      </header>

      <article className="mx-auto w-full max-w-[1120px] overflow-hidden bg-white shadow-[0_24px_70px_rgba(42,25,54,0.13)] sm:my-6 sm:rounded-[1.5rem]">
        <FeaturedInStrip />

        <section className="bg-[#fff8fb] px-5 pt-8 pb-7 text-center sm:px-10 sm:pt-11 sm:pb-9 lg:px-16">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#c32e78] sm:text-xs">Free On-Demand Masterclass</p>
          <h1 className="mx-auto mt-3 max-w-4xl text-3xl font-black leading-[1.06] text-[#281c30] sm:text-5xl">
            <span className="bg-gradient-to-r from-[#e72e91] to-[#7a1e7e] bg-clip-text text-transparent">Menopause, Hormones &amp; Weight Loss.</span><br />Done Right for You.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#5c535c] sm:text-lg">A free 45-minute educational masterclass with Dr. Jumana Al-Deek, DO. Watch at your own pace and learn more about menopause, metabolic health, hormones, and medically supervised weight management.</p>
        </section>

        <section data-free-masterclass-video className="bg-[#fff8fb] px-5 pb-9 sm:px-10 lg:px-16">
          <div className="relative mx-auto aspect-video w-full max-w-[860px] overflow-hidden rounded-[1.35rem] border-[3px] border-white bg-[#1b1022] shadow-[0_20px_50px_rgba(123,28,104,0.25)] ring-1 ring-[#e1c7d6]">
            <video className="h-full w-full bg-black object-cover" controls playsInline preload="metadata" poster={MASTERCLASS_VIDEO_POSTER_URL} aria-label="Free educational masterclass with Dr. Jumana Al-Deek">
              <source src={MASTERCLASS_VIDEO_URL} type="video/mp4" />
              Your browser does not support embedded video playback.
            </video>
            <span className="pointer-events-none absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#e72e91] to-[#75207f] px-3 py-2 text-[10px] font-black text-white shadow-lg sm:top-4 sm:left-4 sm:text-xs"><PlayCircle className="h-4 w-4" aria-hidden="true" />MASTERCLASS PREVIEW</span>
          </div>
          <p className="mx-auto mt-3 max-w-[860px] text-center text-xs leading-relaxed text-[#6e666d] sm:text-sm">Preview video shown while the full 45-minute masterclass is finalized. Educational content only. Individual treatment recommendations require an appropriate medical evaluation.</p>
        </section>

        <section data-free-masterclass-booking className="px-5 py-9 sm:px-10 sm:py-11 lg:px-16">
          <div className="mx-auto max-w-[900px] text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.17em] text-[#7a1e7e]">Ready to talk about your options?</p>
            <h2 className="mt-2 text-2xl font-black text-[#281c30] sm:text-3xl">Choose the next step that feels right for you.</h2>
          </div>
          <div className="mx-auto mt-7 grid max-w-[900px] gap-5 sm:grid-cols-2">
            <div className="flex flex-col">
              <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.19em] text-[#7a1e7e] sm:text-left">Ready to book?</p>
              <button type="button" data-free-masterclass-physician-cta onClick={() => setConsultationOpen(true)} className="mt-2 inline-flex min-h-[82px] w-full items-center justify-center rounded-full bg-gradient-to-r from-[#e8339e] to-[#7a1e7e] px-5 py-3 text-center text-[13px] font-black uppercase tracking-[0.035em] text-white shadow-[0_10px_22px_rgba(122,30,126,0.22)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#7a1e7e] active:scale-[0.98]">
                <span className="flex flex-col items-center leading-tight"><span>Book Your 45-Minute Visit</span><span className="mt-1 text-[13px] font-medium normal-case tracking-normal text-white/90">with Dr. Al-Deek</span></span>
              </button>
              <p className="mt-3 px-1 text-center text-xs leading-relaxed text-[#5a4452] sm:text-left">$199 first visit. A $50 deposit holds your appointment and is applied to the visit.</p>
            </div>
            <div className="flex flex-col">
              <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.19em] text-[#5a4452] sm:text-left">Need more info?</p>
              <a href="#care-team-calendar" data-free-masterclass-care-team-cta className="mt-2 inline-flex min-h-[82px] w-full items-center justify-center rounded-full border-2 border-[#b8336a] bg-white px-5 py-3 text-center text-[13px] font-black uppercase tracking-[0.035em] text-[#7a1e7e] shadow-[0_5px_12px_rgba(122,30,126,0.05)] transition hover:-translate-y-0.5 hover:bg-[#fff5fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#7a1e7e] active:scale-[0.98]">
                <span className="flex flex-col items-center leading-tight"><span>Book a Free 15-Minute Call</span><span className="mt-1 text-[13px] font-medium normal-case tracking-normal text-[#5a4452]">with our Care Team</span></span>
              </a>
              <p className="mt-3 px-1 text-center text-xs leading-relaxed text-[#5a4452] sm:text-left">Ask about the program and whether it may be a good fit. General information only—not medical advice.</p>
            </div>
          </div>
          <div className="mt-7"><PricingDetails /></div>
        </section>

        <section id="care-team-calendar" data-free-masterclass-care-team-calendar className="border-t border-[#eee4e9] bg-[#fff8fb] px-5 py-10 sm:px-10 sm:py-12 lg:px-16">
          <div className="mx-auto max-w-3xl text-center">
            <CalendarDays className="mx-auto h-8 w-8 text-[#c32e78]" aria-hidden="true" />
            <p className="mt-3 text-[11px] font-black uppercase tracking-[0.16em] text-[#c32e78]">Need a little guidance first?</p>
            <h2 className="mt-2 text-2xl font-black text-[#281c30] sm:text-3xl">Book a Free 15-Minute Discovery Call</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#655d63] sm:text-base">Our Care Team can answer general questions about the program, scheduling, and whether MedMethod Direct may be a good fit.</p>
            <p className="mt-3 text-sm font-bold text-[#7a1e7e]">This free call does not provide medical advice or clinical guidance.</p>
          </div>
          <div className="mx-auto mt-7 max-w-3xl overflow-hidden rounded-2xl border border-[#eadfe5] bg-white shadow-[0_10px_28px_rgba(89,31,84,0.08)]">
            <iframe ref={calendarRef} src={CARE_TEAM_CALENDAR_URL} allow="payment" style={{ width: "100%", border: "none", overflow: "hidden", minHeight: "700px" }} scrolling="no" id="18sbmUpLKjc7pcLE8jdN_free_masterclass" title="Care Team Discovery Call Calendar" />
          </div>
        </section>

        <footer className="px-5 py-8 text-center sm:px-10">
          <div className="mx-auto flex max-w-3xl items-center justify-center gap-2 text-xs text-[#766d75]"><ShieldCheck className="h-4 w-4 text-emerald-500" aria-hidden="true" />Physician-led virtual care. Individual recommendations require an appropriate medical evaluation.</div>
          <a href="tel:+18883627011" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#7a1e7e] hover:text-[#e8339e]"><Stethoscope className="h-4 w-4" aria-hidden="true" />Questions? Call (888) 362-7011</a>
        </footer>
      </article>
      <LpConsultationModal2 open={consultationOpen} onClose={() => setConsultationOpen(false)} landingPage="/free-masterclass" />
    </main>
  );
}
