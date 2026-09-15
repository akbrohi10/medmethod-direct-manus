import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import LpConsultationModal2 from "@/components/home1/LpConsultationModal2";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, PlayCircle, ShieldCheck, Video } from "lucide-react";
import { useState } from "react";

const LOGO = "/manus-storage/medmethod-logo-navbar_99a2ea82.png";
const DOCTOR_HEADSHOT_URL = "/manus-storage/dr-jumana-al-deek-headshot_75912bc8.png";
const MASTERCLASS_VIDEO_URL = "/manus-storage/replacement-speaking-event-web_3c5c62ae.mp4";
const MASTERCLASS_VIDEO_POSTER_URL = "/manus-storage/replacement-speaking-event-poster_5353b331.jpg";

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

  return (
    <main className="min-h-screen bg-[#f3f0eb] text-[#25212a]" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <Helmet>
        <title>Free 45-Minute Masterclass | MedMethod Direct</title>
        <meta name="description" content="Watch a free on-demand educational masterclass with Dr. Jumana Al-Deek about menopause, hormones, metabolism, and medical weight loss." />
        <link rel="canonical" href="https://medmethoddirect.com/free-masterclass" />
      </Helmet>

      <article className="mx-auto w-full max-w-[1120px] overflow-hidden bg-white shadow-[0_24px_70px_rgba(42,25,54,0.13)] sm:my-6 sm:rounded-[1.5rem]">
        <section data-free-masterclass-symptom-intro className="relative isolate overflow-hidden bg-[#fff8fb] px-5 pt-8 pb-8 text-center sm:px-10 sm:pt-11 sm:pb-10 lg:px-16">
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-90"
            aria-hidden="true"
            style={{
              backgroundImage:
                "repeating-radial-gradient(ellipse at -8% 75%, transparent 0 20px, rgba(218,44,132,0.075) 21px 22px, transparent 23px 31px), repeating-radial-gradient(ellipse at 108% 55%, transparent 0 22px, rgba(118,35,121,0.07) 23px 24px, transparent 25px 34px), radial-gradient(circle at 50% 100%, rgba(244,168,205,0.34), transparent 38%)",
            }}
          />
          <div className="relative z-10 mx-auto max-w-[820px]">
            <div data-free-masterclass-context-banner className="mx-auto mb-6 max-w-[680px] rounded-full bg-gradient-to-r from-[#e72e91] via-[#b92b92] to-[#5d237b] px-5 py-4 text-white shadow-[0_12px_30px_rgba(168,38,129,0.22)] sm:mb-8 sm:px-8 sm:py-5">
              <p className="text-base font-black uppercase tracking-[0.13em] sm:text-xl sm:tracking-[0.16em]">Free 45-Minute On-Demand Masterclass</p>
              <p className="mt-1 text-[10px] font-semibold tracking-[0.09em] text-white/90 sm:text-xs">Because You Deserve to Know.</p>
            </div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#dd2d84] sm:text-base sm:tracking-[0.2em]">For Women 35+</p>
            <h1 className="mt-2 tracking-[-0.045em] sm:mt-3">
              <span className="mx-auto block max-w-[790px] text-[2.05rem] font-black leading-[1.06] text-[#24102d] sm:text-[3rem] lg:text-[3.55rem]">
                Struggling With Weight Gain, Poor Sleep, Hot Flashes or Mood Swings?
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-[720px] text-[1.28rem] font-extrabold leading-[1.2] tracking-[-0.025em] text-[#cf2b7f] sm:mt-7 sm:text-[1.8rem] lg:text-[2.05rem]">
              Understand Perimenopause, Menopause, Hormone Therapy &amp; Medical Weight Loss.
            </p>
            <span className="mx-auto mt-5 block h-0.5 w-28 rounded-full bg-[#d92780] sm:mt-6 sm:w-36" aria-hidden="true" />
            <div className="mt-5 -mx-5 sm:mt-6 sm:-mx-10 lg:-mx-16">
              <FeaturedInStrip />
            </div>
            <div className="mx-auto mt-4 flex w-fit max-w-full items-center justify-center gap-3 rounded-full border border-[#e5cad9] bg-white/78 py-2.5 pr-5 pl-2.5 text-left shadow-[0_9px_24px_rgba(122,30,126,0.09)] sm:mt-5 sm:gap-4 sm:py-3 sm:pr-7 sm:pl-3">
              <img src={DOCTOR_HEADSHOT_URL} alt="Dr. Jumana Al-Deek" className="h-14 w-14 shrink-0 rounded-full border-2 border-white object-cover shadow-[0_4px_12px_rgba(70,28,57,0.2)] sm:h-16 sm:w-16" loading="eager" decoding="async" />
              <div className="min-w-0">
                <p className="text-sm font-black leading-5 text-[#27132e] sm:text-base">Dr. Jumana Al-Deek</p>
                <p className="text-[10px] font-semibold leading-4 text-[#8b326c] sm:text-xs">Physician and author of <em>The Menopause Weight Loss Trap</em></p>
              </div>
            </div>
          </div>
        </section>

        <section data-free-masterclass-video className="bg-[#fff8fb] px-5 pb-9 sm:px-10 lg:px-16">
          <p className="mb-4 text-center text-[11px] font-black uppercase tracking-[0.16em] text-[#c32e78] sm:text-xs">Free On-Demand Masterclass · Watch Now</p>
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
              <a href="/care-team-booking" data-free-masterclass-care-team-cta className="mt-2 inline-flex min-h-[82px] w-full items-center justify-center rounded-full border-2 border-[#b8336a] bg-white px-5 py-3 text-center text-[13px] font-black uppercase tracking-[0.035em] text-[#7a1e7e] shadow-[0_5px_12px_rgba(122,30,126,0.05)] transition hover:-translate-y-0.5 hover:bg-[#fff5fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#7a1e7e] active:scale-[0.98]">
                <span className="flex flex-col items-center leading-tight"><span>Book a Free 15-Minute Call</span><span className="mt-1 text-[13px] font-medium normal-case tracking-normal text-[#5a4452]">with our Care Team</span></span>
              </a>
              <p className="mt-3 px-1 text-center text-xs leading-relaxed text-[#5a4452] sm:text-left">Ask about the program and whether it may be a good fit. General information only—not medical advice.</p>
            </div>
          </div>
          <div className="mt-7"><PricingDetails /></div>
        </section>

        <footer className="border-t border-[#eee4e9] px-5 py-8 sm:px-10">
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-5 sm:flex-row">
            <a href="/" aria-label="MedMethod Direct home"><img src={LOGO} alt="MedMethod Direct" className="h-9 w-auto" loading="eager" /></a>
            <a href="tel:+18883627011" className="text-center leading-tight text-[#df2f91] transition-colors hover:text-[#7a1e7e] sm:text-right">
              <span className="block text-[9px] font-black tracking-[0.18em]">CALL NOW</span>
              <span className="block text-base font-black">(888) 362-7011</span>
            </a>
          </div>
          <div className="mx-auto mt-6 flex max-w-3xl items-center justify-center gap-2 text-center text-xs text-[#766d75]"><ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />Physician-led virtual care. Individual recommendations require an appropriate medical evaluation.</div>
        </footer>
      </article>
      <LpConsultationModal2 open={consultationOpen} onClose={() => setConsultationOpen(false)} landingPage="/free-masterclass" />
    </main>
  );
}
