import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import LpConsultationModal2 from "@/components/home1/LpConsultationModal2";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, PlayCircle, ShieldCheck, Video } from "lucide-react";
import { useState } from "react";

const LOGO = "/manus-storage/medmethod-logo-navbar_99a2ea82.png";
const MASTERCLASS_PLACEHOLDER_IMAGE_URL = "/manus-storage/medmethod-on-demand-masterclass-poster_52bb13b2.jpg";

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
      data-masterclass-video-first-featured-in
      aria-labelledby="masterclass-video-first-featured-heading"
      aria-busy={!isReady}
      className="overflow-hidden bg-gradient-to-r from-[#25134f] via-[#5b3aa4] to-[#2d185d] px-4 py-3 text-white"
    >
      <div className="mx-auto max-w-[1000px]">
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-white/45 sm:w-14" aria-hidden="true" />
          <h2 id="masterclass-video-first-featured-heading" className="text-[10px] font-black uppercase tracking-[0.16em] sm:text-xs">
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
    <Accordion type="single" collapsible className="mx-auto w-full max-w-3xl" data-masterclass-video-first-pricing>
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
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default function MasterclassVideoFirst() {
  const [consultationOpen, setConsultationOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#f7f3f5] text-[#25212a]" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <Helmet>
        <title>Free Masterclass | Dr. Jumana Al-Deek</title>
        <meta name="description" content="A free on-demand educational masterclass with Dr. Jumana Al-Deek about perimenopause, menopause, hormones, metabolism, and medical weight loss." />
        <link rel="canonical" href="https://medmethoddirect.com/masterclass" />
      </Helmet>

      <article className="mx-auto min-h-screen w-full max-w-[1120px] overflow-hidden bg-white shadow-[0_24px_70px_rgba(42,25,54,0.13)] sm:my-6 sm:rounded-[1.5rem]">
        <section data-masterclass-video-first-hero className="relative isolate overflow-hidden bg-[#fff9fb] px-5 pt-8 pb-7 text-center sm:px-10 sm:pt-12 sm:pb-10 lg:px-16">
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-85"
            aria-hidden="true"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 110%, rgba(232,51,158,0.20), transparent 39%), repeating-radial-gradient(ellipse at 50% 100%, transparent 0 22px, rgba(122,30,126,0.06) 23px 24px, transparent 25px 34px)",
            }}
          />
          <div className="mx-auto max-w-[850px]">
            <p data-masterclass-video-first-eyebrow className="inline-flex rounded-full bg-gradient-to-r from-[#e72e91] via-[#b92b92] to-[#5d237b] px-5 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(168,38,129,0.22)] sm:px-7 sm:py-3.5 sm:text-xs">
              Free On-Demand Masterclass
            </p>
            <h1 className="mx-auto mt-5 max-w-[790px] text-[2.25rem] font-black leading-[1.05] tracking-[-0.045em] text-[#24102d] sm:mt-7 sm:text-[3.35rem] lg:text-[4.05rem]">
              Perimenopause, Menopause &amp; Weight Loss: What Every Woman 35+ Should Know
            </h1>
            <p className="mx-auto mt-4 max-w-[700px] text-[1.03rem] font-semibold leading-relaxed text-[#6e5364] sm:mt-5 sm:text-lg">
              Watch Dr. Jumana Al-Deek explain the options women are asking about—plus a recorded live Q&amp;A.
            </p>
          </div>
        </section>

        <section data-masterclass-video-first-player className="bg-[#fff9fb] px-5 pb-9 sm:px-10 sm:pb-12 lg:px-16">
          <div data-masterclass-video-first-placeholder className="relative mx-auto aspect-video w-full max-w-[940px] overflow-hidden rounded-[1.35rem] border-[3px] border-white bg-[#1b1022] shadow-[0_20px_50px_rgba(123,28,104,0.26)] ring-1 ring-[#e1c7d6]">
            <img src={MASTERCLASS_PLACEHOLDER_IMAGE_URL} alt="Masterclass recording preview" className="h-full w-full object-cover" loading="eager" decoding="async" />
            <div className="absolute inset-0 flex items-center justify-center bg-[#211028]/58 px-5 text-center">
              <div className="max-w-md rounded-2xl border border-white/25 bg-[#341753]/90 px-6 py-6 text-white shadow-[0_18px_45px_rgba(27,11,36,0.38)] sm:px-9 sm:py-8">
                <PlayCircle className="mx-auto h-11 w-11 text-white/95 sm:h-14 sm:w-14" aria-hidden="true" />
                <p className="mt-3 text-base font-black uppercase tracking-[0.1em] sm:text-xl">Masterclass Recording Coming Soon</p>
                <p className="mt-2 text-xs leading-relaxed text-white/88 sm:text-sm">The full on-demand masterclass, including the recorded live Q&amp;A with Dr. Al-Deek, will be available here soon.</p>
              </div>
            </div>
          </div>
          <p className="mx-auto mt-4 max-w-[780px] text-center text-sm font-semibold leading-relaxed text-[#4d3e49] sm:text-base">
            Presented by Dr. Jumana Al-Deek, board-certified family medicine physician.
          </p>
          <p className="mx-auto mt-2 max-w-[780px] text-center text-xs leading-relaxed text-[#766d75] sm:text-sm">
            Educational content only. Individual treatment recommendations require an appropriate medical evaluation.
          </p>
        </section>

        <section data-masterclass-video-first-booking className="border-t border-[#f0e5eb] px-5 py-10 sm:px-10 sm:py-12 lg:px-16">
          <div className="mx-auto max-w-[860px] text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.17em] text-[#7a1e7e]">Ready when you are</p>
            <h2 className="mt-2 text-2xl font-black text-[#281c30] sm:text-3xl">Choose the next step that feels right for you.</h2>
            <p data-masterclass-video-first-patient-proof className="mt-3 text-sm font-semibold text-[#5a4452] sm:text-base">Dr. Al-Deek has seen <span className="font-black text-[#7a1e7e]">50,000+ patients.</span></p>
          </div>
          <div className="mx-auto mt-7 grid max-w-[900px] gap-5 sm:grid-cols-2">
            <div className="flex flex-col">
              <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.19em] text-[#7a1e7e] sm:text-left">Ready to book?</p>
              <button type="button" data-masterclass-video-first-physician-cta onClick={() => setConsultationOpen(true)} className="mt-2 inline-flex min-h-[82px] w-full items-center justify-center rounded-full bg-gradient-to-r from-[#e8339e] to-[#7a1e7e] px-5 py-3 text-center text-[13px] font-black uppercase tracking-[0.035em] text-white shadow-[0_10px_22px_rgba(122,30,126,0.22)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#7a1e7e] active:scale-[0.98]">
                <span className="flex flex-col items-center leading-tight"><span>Book Your 45-Minute Visit</span><span className="mt-1 text-[13px] font-medium normal-case tracking-normal text-white/90">with Dr. Al-Deek</span></span>
              </button>
              <p className="mt-3 px-1 text-center text-xs leading-relaxed text-[#5a4452] sm:text-left">$199 first visit. A $50 deposit holds your appointment and is applied to the visit.</p>
            </div>
            <div className="flex flex-col">
              <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.19em] text-[#5a4452] sm:text-left">Need more info?</p>
              <a href="/care-team-booking" data-masterclass-video-first-care-team-cta className="mt-2 inline-flex min-h-[82px] w-full items-center justify-center rounded-full border-2 border-[#b8336a] bg-white px-5 py-3 text-center text-[13px] font-black uppercase tracking-[0.035em] text-[#7a1e7e] shadow-[0_5px_12px_rgba(122,30,126,0.05)] transition hover:-translate-y-0.5 hover:bg-[#fff5fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#7a1e7e] active:scale-[0.98]">
                <span className="flex flex-col items-center leading-tight"><span>Book a Free 15-Minute Call</span><span className="mt-1 text-[13px] font-medium normal-case tracking-normal text-[#5a4452]">with our Care Team</span></span>
              </a>
              <p className="mt-3 px-1 text-center text-xs leading-relaxed text-[#5a4452] sm:text-left">Ask about the program and whether it may be a good fit. General information only—not medical advice.</p>
            </div>
          </div>
          <div className="mt-7"><PricingDetails /></div>
        </section>

        <FeaturedInStrip />

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
      <LpConsultationModal2 open={consultationOpen} onClose={() => setConsultationOpen(false)} landingPage="/masterclass" startAtPayment />
    </main>
  );
}
