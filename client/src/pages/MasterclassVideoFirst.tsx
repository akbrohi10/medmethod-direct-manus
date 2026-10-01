import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import LpConsultationModal2 from "@/components/home1/LpConsultationModal2";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, ShieldCheck, Video } from "lucide-react";
import { useState } from "react";

const LOGO = "/manus-storage/medmethod-logo-navbar_99a2ea82.png";
const MASTERCLASS_YOUTUBE_ID = "UNYMLkd61z8";

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
            <div data-masterclass-video-first-pricing-details>
              <p className="text-center text-[11px] font-black uppercase tracking-[0.16em] text-[#e8339e]">Care Designed Around You</p>
              <h2 className="mt-2 text-center text-2xl font-black text-[#251d29] sm:text-3xl">More Than a Prescription</h2>
              <p className="mx-auto mt-2 max-w-2xl text-center text-sm font-medium leading-relaxed text-[#655d63] sm:text-base">A doctor who gets to know you—plus clear care and medication options.</p>

              <div className="mt-6 rounded-2xl border border-[#d79ab8] bg-gradient-to-r from-[#fff4fa] via-[#fffafd] to-[#f9f2ff] p-5 sm:p-6">
                <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
                  <div><p className="text-xs font-black uppercase tracking-[0.13em] text-[#c32e78]">First Visit</p><p className="mt-1 text-sm font-bold text-[#443b43]">45-minute physician consultation</p></div>
                  <p className="text-5xl font-black tracking-[-0.06em] text-[#e8339e]">$199</p>
                </div>
                <div className="mt-5 grid gap-2 text-sm sm:grid-cols-2 sm:text-base">
                  <p className="rounded-xl bg-white px-4 py-3 text-[#443b43]"><strong className="text-[#251d29]">Reserve today:</strong> $50 deposit</p>
                  <p className="rounded-xl bg-white px-4 py-3 text-[#443b43]"><strong className="text-[#251d29]">Day of visit:</strong> remaining $149</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <section className="rounded-2xl border border-[#d8c5dc] bg-[#fcfaff] p-5" data-masterclass-video-first-pay-as-you-go>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#5b3aa4]">Option 1 · Pay as you go</p>
                  <p className="mt-3 text-4xl font-black tracking-[-0.05em] text-[#251d29]">$150</p>
                  <p className="mt-1 text-sm font-black uppercase tracking-[0.06em] text-[#443b43]">Follow-up visit</p>
                  <p className="mt-4 border-t border-[#dbcddd] pt-4 text-sm leading-relaxed text-[#5f5560]">No monthly commitment. Schedule a physician visit when you need one.</p>
                </section>
                <section className="rounded-2xl border border-[#ecb4d1] bg-gradient-to-br from-[#fff7fb] to-[#f9f0fb] p-5" data-masterclass-video-first-ongoing-care>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#e8339e]">Option 2 · Ongoing care</p>
                  <p className="mt-3 text-4xl font-black tracking-[-0.05em] text-[#e8339e]">$50<span className="text-xl tracking-normal">/month</span></p>
                  <ul className="mt-4 space-y-2 text-sm text-[#443b43]">
                    {["Direct secure messaging with Dr. Al-Deek", "Medication and dosing management", "Prescription refills and lab review"].map((item) => (
                      <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#e8339e]" aria-hidden="true" />{item}</li>
                    ))}
                  </ul>
                  <p className="mt-4 border-t border-[#e7bad2] pt-4 text-sm leading-relaxed text-[#5f5560]">Video visits available for $50. Cancel anytime with 30 days&apos; notice.</p>
                </section>
              </div>

              <div className="mt-7">
                <p className="text-center text-[11px] font-black uppercase tracking-[0.16em] text-[#251d29]">Medication Options</p>
                <p className="mx-auto mt-2 max-w-2xl text-center text-sm leading-relaxed text-[#655d63]">Medication is separate from physician care. Estimates vary based on medication, dose, pharmacy, and your individual protocol.</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <section className="overflow-hidden rounded-2xl border border-[#e5a9c9] bg-white" data-masterclass-video-first-weight-loss-pricing>
                    <div className="bg-gradient-to-r from-[#ec3b96] to-[#b32283] px-5 py-4 text-white"><p className="text-lg font-black">Weight-Loss Medication</p><p className="mt-1 text-xs font-medium text-white/90">Semaglutide &amp; tirzepatide, priced monthly</p></div>
                    <div className="divide-y divide-[#f0d5e2] px-5">
                      <div className="flex items-start justify-between gap-4 py-4"><div><p className="text-sm font-black text-[#251d29]">Compounded</p><p className="mt-1 text-xs text-[#655d63]">Semaglutide or tirzepatide</p></div><p className="whitespace-nowrap text-lg font-black text-[#e8339e]">~$100–$300<span className="text-xs text-[#655d63]">/mo</span></p></div>
                      <div className="flex items-start justify-between gap-4 py-4"><div><p className="text-sm font-black text-[#251d29]">FDA-approved options</p><p className="mt-1 text-xs text-[#655d63]">Medication choices vary by pharmacy and coverage</p></div><p className="whitespace-nowrap text-lg font-black text-[#e8339e]">~$150–$450<span className="text-xs text-[#655d63]">/mo</span></p></div>
                    </div>
                  </section>
                  <section className="overflow-hidden rounded-2xl border border-[#bca5d6] bg-white" data-masterclass-video-first-hormone-pricing>
                    <div className="bg-gradient-to-r from-[#6d3a9e] to-[#49246f] px-5 py-4 text-white"><p className="text-lg font-black">Hormone Therapy</p><p className="mt-1 text-xs font-medium text-white/90">Priced per hormone, based on your protocol</p></div>
                    <div className="divide-y divide-[#e2d7ec] px-5">
                      <div className="flex items-start justify-between gap-4 py-4"><div><p className="text-sm font-black text-[#251d29]">Individual hormones</p><p className="mt-1 text-xs leading-relaxed text-[#655d63]">Estrogen · Progesterone · Testosterone · DHEA · Vaginal estrogen</p></div><p className="whitespace-nowrap text-lg font-black text-[#6d3a9e]">~$30–$100<span className="text-xs text-[#655d63]">/mo</span></p></div>
                      <div className="flex items-start justify-between gap-4 py-4"><div><p className="text-sm font-black text-[#251d29]">Most patients (2–3 hormones)</p><p className="mt-1 text-xs text-[#655d63]">Typical combined protocol</p></div><p className="whitespace-nowrap text-lg font-black text-[#6d3a9e]">~$150–$250<span className="text-xs text-[#655d63]">/mo</span></p></div>
                    </div>
                  </section>
                </div>
              </div>

              <div className="mt-5 flex gap-3 rounded-xl border border-[#f0c3da] bg-[#fff9fc] p-4"><Video className="mt-0.5 h-5 w-5 shrink-0 text-[#c32e78]" aria-hidden="true" /><p className="text-sm leading-relaxed text-[#443b43]"><strong className="text-[#251d29]">Convenient fulfillment.</strong> Medication can be shipped to your door or called into your local pharmacy, when clinically appropriate.</p></div>
              <p className="mt-4 text-center text-xs leading-relaxed text-[#766d75]">Medication options and prescriptions are determined only after an appropriate medical evaluation. Individual recommendations and costs vary.</p>
              <div className="mt-4 space-y-2 rounded-xl bg-[#f8f6f8] px-4 py-3 text-[11px] leading-relaxed text-[#766d75]">
                <p>Compounded medications are not FDA-approved. They are prepared by licensed compounding pharmacies for an individual patient based on a prescription. FDA-approved alternatives are available and will be discussed with you by your physician. Results vary. Treatment requires ongoing medical monitoring.</p>
                <p>Testosterone is prescribed off-label for hypoactive sexual desire disorder in women. There is no FDA-approved testosterone product for women in the United States. This treatment is available only to patients in Florida.</p>
              </div>
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
        <title>Free Masterclass: Menopause, Metabolism &amp; Weight Loss</title>
        <meta name="description" content="Watch Dr. Jumana Al-Deek explain how hormones, metabolism, and medical weight loss connect—plus real questions from women 35+." />
        <link rel="canonical" href="https://medmethoddirect.com/masterclass" />
      </Helmet>

      <article className="mx-auto min-h-screen w-full max-w-[1120px] overflow-hidden bg-white shadow-[0_24px_70px_rgba(42,25,54,0.13)] sm:my-6 sm:rounded-[1.5rem]">
        <div data-masterclass-video-first-banner className="bg-gradient-to-r from-[#e72e91] via-[#b92b92] to-[#5d237b] px-5 py-4 text-center text-[11px] font-black uppercase tracking-[0.14em] text-white sm:px-10 sm:py-5 sm:text-sm">
          Free On-Demand Masterclass
        </div>
        <section data-masterclass-video-first-hero className="relative isolate overflow-hidden bg-[#fff9fb] px-5 pt-7 pb-7 text-center sm:px-10 sm:pt-10 sm:pb-10 lg:px-16">
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-85"
            aria-hidden="true"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 110%, rgba(232,51,158,0.20), transparent 39%), repeating-radial-gradient(ellipse at 50% 100%, transparent 0 22px, rgba(122,30,126,0.06) 23px 24px, transparent 25px 34px)",
            }}
          />
          <div className="mx-auto max-w-[850px]">
            <h1 className="mx-auto max-w-[790px] text-[2.25rem] font-black leading-[1.05] tracking-[-0.045em] text-[#24102d] sm:text-[3.35rem] lg:text-[4.05rem]">
              <span className="mb-3 block text-sm font-black uppercase tracking-[0.1em] text-[#7a1e7e] sm:mb-4 sm:text-lg">Watch the 45-minute masterclass</span>
              <span className="block">Weight Loss, <span className="whitespace-nowrap">GLP-1s</span> &amp; Hormones—Finally Explained.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-[700px] text-[1.03rem] font-semibold leading-relaxed text-[#6e5364] sm:mt-5 sm:text-lg">
              Dr. Al-Deek explains your options, then answers real questions from women 35+ in a recorded live Q&amp;A.
            </p>
          </div>
        </section>

        <section data-masterclass-video-first-player className="bg-[#fff9fb] px-5 pb-9 sm:px-10 sm:pb-12 lg:px-16">
          <p className="pb-3 text-center text-xs font-black uppercase tracking-[0.12em] text-[#7a1e7e] sm:text-sm">Press play to watch free</p>
          <div data-masterclass-video-first-youtube className="relative mx-auto aspect-video w-full max-w-[940px] overflow-hidden rounded-[1.35rem] border-[3px] border-white bg-[#1b1022] shadow-[0_20px_50px_rgba(123,28,104,0.26)] ring-1 ring-[#e1c7d6]">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${MASTERCLASS_YOUTUBE_ID}?rel=0&modestbranding=1&playsinline=1`}
              title="Menopause, Metabolism & Medical Weight Loss: A New Approach to Health After 35+"
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <p className="mx-auto mt-4 max-w-[780px] text-center text-sm font-semibold leading-relaxed text-[#4d3e49] sm:text-base">
            Presented by Dr. Jumana Al-Deek, board-certified family medicine physician.
          </p>
        </section>

        <section data-masterclass-video-first-booking className="border-t border-[#f0e5eb] px-5 py-10 sm:px-10 sm:py-12 lg:px-16">
          <div className="mx-auto max-w-[860px] text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.17em] text-[#7a1e7e]">Ready when you are</p>
            <h2 className="mt-2 text-2xl font-black text-[#281c30] sm:text-3xl">Want to Become a Patient?</h2>
            <p className="mt-3 text-xs font-black uppercase tracking-[0.06em] text-[#7a1e7e] sm:text-sm">100% virtual care · Available in 17 states</p>
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
