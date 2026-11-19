import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Helmet } from "react-helmet-async";
import { Check, ShieldCheck, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createMasterclass3VideoTracker, loadMasterclass3YouTubeAPI, type Masterclass3YouTubePlayer } from "@/lib/masterclass3VideoTracking";

const LOGO = "/manus-storage/medmethod-logo-navbar_99a2ea82.png";
const MASTERCLASS_YOUTUBE_ID = "UNYMLkd61z8";

// Keep this in sync with the original What You’ll Learn checklist on /live-webinar2.
const learningChecklist = [
  {
    title: "Why You Can’t Lose Weight Like You Used To",
    body: "What changes in your 30s, 40s & 50s—and why.",
  },
  {
    title: "Is It Perimenopause or Menopause?",
    body: "The signs and symptoms your body may be trying to tell you.",
  },
  {
    title: "Hot Flashes, Poor Sleep, Mood Changes & Low Energy",
    body: "Understand what may actually be happening with your hormones.",
  },
  {
    title: "The Truth About Hormone Therapy",
    body: "What every woman should know about her options.",
  },
  {
    title: "GLP-1s & Medical Weight Loss",
    body: "When they may help—and what proper treatment should look like.",
  },
  {
    title: "What to Ask Your Doctor",
    body: "Know your options and become a better advocate for your health.",
  },
  {
    title: "LIVE Q&A Replay with Dr. Jumana Al-Deek",
    body: "Watch people like you get answers from a menopause & medical weight loss specialist.",
  },
];

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
                <p className="text-sm font-bold leading-relaxed text-[#443b43] sm:text-base">First visit: $199 — $50 deposit, remaining $149 due day of visit.</p>
              </div>
              <section className="mt-5 rounded-2xl border border-[#d8c5dc] bg-[#fcfaff] p-5">
                <p className="text-sm font-bold leading-relaxed text-[#443b43] sm:text-base">Follow-up visits: $150 pay as you go, or ongoing care at $50/month.</p>
              </section>
              <div className="mt-7">
                <p className="text-center text-[11px] font-black uppercase tracking-[0.16em] text-[#251d29]">Medication Options</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <section className="overflow-hidden rounded-2xl border border-[#bca5d6] bg-white" data-masterclass-video-first-hormone-pricing>
                    <div className="bg-gradient-to-r from-[#6d3a9e] to-[#49246f] px-5 py-4 text-white"><p className="text-lg font-black">Hormone Therapy</p><p className="mt-1 text-xs font-medium text-white/90">Priced per hormone, based on your protocol</p></div>
                    <div className="divide-y divide-[#e2d7ec] px-5">
                      <p className="py-4 text-sm leading-relaxed text-[#443b43] sm:text-base">Hormone medication: $29–$99/month, depending on what is prescribed.</p>
                    </div>
                  </section>
                  <section className="overflow-hidden rounded-2xl border border-[#e5a9c9] bg-white" data-masterclass-video-first-weight-loss-pricing>
                    <div className="bg-gradient-to-r from-[#ec3b96] to-[#b32283] px-5 py-4 text-white"><p className="text-lg font-black">Weight-Loss Medication</p><p className="mt-1 text-xs font-medium text-white/90">Semaglutide &amp; tirzepatide, priced monthly</p></div>
                    <div className="divide-y divide-[#f0d5e2] px-5">
                      <p className="py-4 text-sm leading-relaxed text-[#443b43] sm:text-base">GLP-1 medication: $129–$299/month, depending on the medication.</p>
                    </div>
                  </section>
                </div>
                <p className="mx-auto mt-2 max-w-2xl text-center text-sm leading-relaxed text-[#655d63]">Medication is billed separately and is not included in visit fees.</p>
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

export default function Masterclass3() {
  const [disableFullScreen] = useState(() => typeof window !== "undefined" && window.matchMedia("(pointer: coarse), (max-width: 767px)").matches);
  const videoRef = useRef<HTMLElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let cancelled = false;
    let player: Masterclass3YouTubePlayer | undefined;
    const tracker = createMasterclass3VideoTracker();
    loadMasterclass3YouTubeAPI().then((api) => {
      if (cancelled || !iframeRef.current) return;
      player = new api.Player(iframeRef.current, {
        events: {
          onStateChange: (event) => tracker.onStateChange(event.data, event.target),
        },
      });
    }).catch(() => {
      // The ungated iframe remains playable if the optional API cannot load.
    });
    return () => {
      cancelled = true;
      tracker.dispose();
      player?.destroy();
    };
  }, []);

  const scrollToVideo = () => {
    videoRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <main className="min-h-screen bg-[#f7f3f5] text-[#25212a]" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <Helmet>
        <title>Free Masterclass: Menopause, Metabolism &amp; Weight Loss</title>
        <meta name="description" content="Watch Dr. Jumana Al-Deek explain how hormones, metabolism, and medical weight loss connect—plus real questions from women 35+." />
        <link rel="canonical" href="https://medmethoddirect.com/masterclass3" />
        <meta property="og:url" content="https://medmethoddirect.com/masterclass3" />
      </Helmet>
      <style>{`
        @keyframes mmdMasterclassWatchPulse {
          0%, 100% { opacity: 1; transform: translateY(0); }
          50% { opacity: .6; transform: translateY(8px); }
        }
        @media (prefers-reduced-motion: no-preference) {
          [data-masterclass-video-first-watch-arrow] { animation: mmdMasterclassWatchPulse 2.2s ease-in-out infinite; }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-masterclass-video-first-watch-arrow] { animation: none; opacity: 1; transform: none; }
        }
      `}</style>

      <article className="mx-auto min-h-screen w-full max-w-[1120px] overflow-hidden bg-white shadow-[0_24px_70px_rgba(42,25,54,0.13)] sm:my-6 sm:rounded-[1.5rem]">
        <div data-masterclass-video-first-banner className="bg-gradient-to-r from-[#e72e91] via-[#b92b92] to-[#5d237b] px-5 py-4 text-center text-[11px] font-black uppercase tracking-[0.14em] text-white sm:px-10 sm:py-5 sm:text-sm">
          FREE ON-DEMAND MASTERCLASS
        </div>
        <section data-masterclass-video-first-hero className="relative isolate overflow-hidden bg-[#fff9fb] px-5 pt-4 pb-3 text-center sm:px-10 sm:pt-8 sm:pb-4 lg:px-16">
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-85"
            aria-hidden="true"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 110%, rgba(232,51,158,0.20), transparent 39%), repeating-radial-gradient(ellipse at 50% 100%, transparent 0 22px, rgba(122,30,126,0.06) 23px 24px, transparent 25px 34px)",
            }}
          />
          <div className="mx-auto max-w-[850px]">
            <h1 className="mx-auto max-w-[810px] text-[clamp(1.25rem,6.5vw,1.75rem)] font-black leading-[1.08] tracking-[-0.045em] text-[#24102d] sm:text-[2.8rem] lg:text-[3.35rem]">
              Hot flashes. Waking up at 3 AM. Low libido. Weight that won't move no matter what you do.
            </h1>
            <p data-masterclass3-subheadline className="mx-auto mt-3 max-w-[810px] text-[0.82rem] font-semibold leading-snug text-[#6e5364] sm:mt-4 sm:text-base">
              Understand why it's happening — how your estrogen levels have everything to do with it — and what actually helps. Watch the video now.
            </p>
            <p data-masterclass-video-first-credentials className="mx-auto mt-3 max-w-[810px] text-[0.82rem] font-semibold leading-snug text-[#6e5364] sm:mt-4 sm:text-base">
              <span className="block">From Dr. Jumana Al-Deek, DO · Board-certified physician</span>{" "}
              <span className="mt-1 block">Menopause, Hormone, Metabolism &amp; Medical Weight-Loss Specialist · <span className="font-black text-[#7a1e7e]">50,000+ patients</span> seen</span>
            </p>
          </div>
        </section>

        <section ref={videoRef} data-masterclass-video-first-player className="bg-[#fff9fb] px-5 pb-4 sm:px-10 sm:pb-6 lg:px-16">
          <div data-masterclass-video-first-watch-cue className="mb-4 flex flex-col items-center gap-2 text-center">
            <p className="m-0 text-base font-extrabold text-[#7a1e7e] sm:text-lg">Watch Now—Get Answers.</p>
            <svg data-masterclass-video-first-watch-arrow viewBox="0 0 100 110" className="pointer-events-none h-[88px] w-[80px] shrink-0 drop-shadow-[0_6px_10px_rgba(122,30,126,0.18)] sm:h-[110px] sm:w-[100px]" aria-hidden="true" focusable="false">
              <defs>
                <linearGradient id="masterclass-watch-arrow-gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#e8339e" />
                  <stop offset="100%" stopColor="#7a1e7e" />
                </linearGradient>
              </defs>
              <path d="M36 4H64V56H90L50 102L10 56H36Z" fill="url(#masterclass-watch-arrow-gradient)" />
            </svg>
          </div>
          <div data-masterclass-video-first-youtube className="relative mx-auto aspect-video w-full max-w-[940px] overflow-hidden rounded-[1.35rem] border-[3px] border-white bg-[#1b1022] shadow-[0_20px_50px_rgba(123,28,104,0.26)] ring-1 ring-[#e1c7d6]">
            <iframe
              data-masterclass-video-first-iframe
              ref={iframeRef}
              id="masterclass3-youtube-player"
              src={`https://www.youtube-nocookie.com/embed/${MASTERCLASS_YOUTUBE_ID}?rel=0&enablejsapi=1&playsinline=1&origin=${encodeURIComponent(typeof window === "undefined" ? "https://medmethoddirect.com" : window.location.origin)}&fs=${disableFullScreen ? 0 : 1}`}
              title="Menopause, Metabolism & Medical Weight Loss: A New Approach to Health After 35+"
              className="absolute inset-0 h-full w-full"
              allow={`accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share${disableFullScreen ? "" : "; picture-in-picture"}`}
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen={!disableFullScreen}
              loading="eager"
            />
          </div>
        </section>

        <section data-masterclass-video-first-booking className="border-t border-[#f0e5eb] px-5 py-10 sm:px-10 sm:py-12 lg:px-16">
          <div className="mx-auto max-w-[860px] text-center">
            <p className="mb-2 text-sm font-semibold text-[#7a1e7e]">Ready to talk about your own hormones and weight?</p>
            <h2 className="text-2xl font-black text-[#281c30] sm:text-3xl">Want to Become a Patient?</h2>
            <p className="mt-3 text-xs font-black uppercase tracking-[0.06em] text-[#7a1e7e] sm:text-sm">100% virtual care · Available in 17 states</p>
            <p data-masterclass-video-first-patient-proof className="mt-3 text-sm font-semibold text-[#5a4452] sm:text-base">Dr. Al-Deek has seen <span className="font-black text-[#7a1e7e]">50,000+ patients.</span></p>
          </div>
          <div className="mx-auto mt-7 grid max-w-[900px] gap-5 sm:grid-cols-2">
            <div className="flex flex-col">
              <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.19em] text-[#7a1e7e] sm:text-left">Need more info?</p>
              <a href="/care-team-booking" data-masterclass3-primary-cta className="mt-2 inline-flex min-h-[82px] w-full items-center justify-center rounded-full bg-gradient-to-r from-[#e8339e] to-[#7a1e7e] px-5 py-3 text-center text-[13px] font-black uppercase tracking-[0.035em] text-white shadow-[0_10px_22px_rgba(122,30,126,0.22)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#7a1e7e] active:scale-[0.98]">
                Book Your Free 15-Minute Discovery Call
              </a>
              <p className="mt-3 px-1 text-center text-xs leading-relaxed text-[#5a4452] sm:text-left">a free 15-minute call with our care team — ask questions and decide if it's a good fit.</p>
            </div>
            <div className="flex flex-col">
              <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.19em] text-[#5a4452] sm:text-left">Ready to book?</p>
              <a href="/book-a-visit" data-masterclass3-secondary-cta className="mt-2 inline-flex min-h-[82px] w-full items-center justify-center rounded-full border-2 border-[#b8336a] bg-white px-5 py-3 text-center text-[13px] font-black uppercase tracking-[0.035em] text-[#7a1e7e] shadow-[0_5px_12px_rgba(122,30,126,0.05)] transition hover:-translate-y-0.5 hover:bg-[#fff5fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#7a1e7e] active:scale-[0.98]">
                Book Your 45-Minute Visit with Dr. Al-Deek — $199
              </a>
              <p className="mt-3 px-1 text-center text-xs leading-relaxed text-[#5a4452] sm:text-left">first visit $199, up to 45 minutes — $50 deposit today, remaining $149 due on the day of your visit.</p>
            </div>
          </div>
        </section>

        <div className="px-5 pt-8 pb-8 sm:px-10 sm:pt-12 sm:pb-12 lg:px-16">
          <section
            data-webinar2-learning
            className="mx-auto max-w-[980px] bg-[#fff7f5] px-0 py-6 sm:py-10"
          >
            <div className="mx-auto max-w-[900px] text-center">
              <p className="inline-flex rounded-full bg-[#fde8ef] px-6 py-2 text-sm font-black uppercase tracking-[0.2em] text-[#cf1475] sm:px-8 sm:text-base">
                What You’ll Learn
              </p>
              <h2 className="mx-auto mt-5 max-w-[780px] text-[2.55rem] font-black leading-[1] tracking-[-0.045em] text-[#432943] sm:text-6xl lg:text-[4rem]">
                Because You Deserve to Know.
              </h2>
              <ul data-webinar2-learning-checklist className="mx-auto mt-9 max-w-[800px] text-left sm:mt-11">
                {learningChecklist.map(({ title, body }) => (
                  <li
                    data-webinar2-learning-item
                    key={title}
                    className="flex gap-4 border-b border-[#eadde4] py-6 first:pt-0 last:border-b-0 last:pb-0 sm:gap-5 sm:py-7"
                  >
                    <span
                      data-webinar2-learning-check
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dd2d84] text-white shadow-[0_5px_12px_rgba(221,45,132,0.18)] sm:h-10 sm:w-10"
                      aria-hidden="true"
                    >
                      <Check className="h-5 w-5 stroke-[3] sm:h-6 sm:w-6" />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <h3 className="text-xl font-extrabold leading-[1.22] tracking-[-0.025em] text-[#432943] sm:text-2xl">
                        {title}
                      </h3>
                      <p className="mt-2 text-base font-medium leading-[1.55] text-[#514a52] sm:text-lg sm:leading-[1.6]">
                        {body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <div className="mt-7 flex justify-center sm:mt-8">
            <button
              type="button"
              data-masterclass-watch-button
              onClick={scrollToVideo}
              className="inline-flex min-h-14 w-full max-w-[720px] items-center justify-center rounded-full bg-gradient-to-r from-[#e8339e] to-[#7a1e7e] px-7 py-3 text-center text-sm font-black uppercase tracking-[0.035em] text-white shadow-[0_10px_22px_rgba(122,30,126,0.22)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#7a1e7e] active:scale-[0.98] sm:w-auto sm:px-10"
            >
              Watch the Free Masterclass
            </button>
          </div>
        </div>

        <section data-masterclass-video-first-bio className="bg-[#fff9fb] px-5 py-7 sm:px-10 sm:py-8 lg:px-16">
          <p className="mx-auto max-w-[780px] text-center text-sm font-semibold leading-relaxed text-[#4d3e49] sm:text-base">
            Presented by Dr. Jumana Al-Deek, DO—a board-certified family physician focused on perimenopause, menopause, metabolic health &amp; medical weight loss.
          </p>
          <img
            data-masterclass-presenter-photo
            src="/manus-storage/jumana-family-masterclass_238b56a3.webp"
            alt="Dr. Jumana Al-Deek with her family outdoors"
            width={1100}
            height={1100}
            loading="lazy"
            decoding="async"
            className="mx-auto mt-5 aspect-square w-full max-w-[340px] rounded-2xl border border-[#f0e5eb] object-cover shadow-[0_10px_28px_rgba(54,29,55,0.12)] sm:mt-6 sm:max-w-[390px]"
          />
        </section>
        <FeaturedInStrip />
        <section data-masterclass3-pricing className="border-t border-[#f0e5eb] px-5 py-10 sm:px-10 sm:py-12 lg:px-16">
          <PricingDetails />
        </section>
        <section data-masterclass3-bottom-booking className="border-t border-[#f0e5eb] px-5 py-10 sm:px-10 sm:py-12 lg:px-16">
          <div className="mx-auto mt-7 grid max-w-[900px] gap-5 sm:grid-cols-2">
            <div className="flex flex-col">
              <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.19em] text-[#7a1e7e] sm:text-left">Need more info?</p>
              <a href="/care-team-booking" data-masterclass3-primary-cta className="mt-2 inline-flex min-h-[82px] w-full items-center justify-center rounded-full bg-gradient-to-r from-[#e8339e] to-[#7a1e7e] px-5 py-3 text-center text-[13px] font-black uppercase tracking-[0.035em] text-white shadow-[0_10px_22px_rgba(122,30,126,0.22)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#7a1e7e] active:scale-[0.98]">
                Book Your Free 15-Minute Discovery Call
              </a>
              <p className="mt-3 px-1 text-center text-xs leading-relaxed text-[#5a4452] sm:text-left">a free 15-minute call with our care team — ask questions and decide if it's a good fit.</p>
            </div>
            <div className="flex flex-col">
              <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.19em] text-[#5a4452] sm:text-left">Ready to book?</p>
              <a href="/book-a-visit" data-masterclass3-secondary-cta className="mt-2 inline-flex min-h-[82px] w-full items-center justify-center rounded-full border-2 border-[#b8336a] bg-white px-5 py-3 text-center text-[13px] font-black uppercase tracking-[0.035em] text-[#7a1e7e] shadow-[0_5px_12px_rgba(122,30,126,0.05)] transition hover:-translate-y-0.5 hover:bg-[#fff5fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#7a1e7e] active:scale-[0.98]">
                Book Your 45-Minute Visit with Dr. Al-Deek — $199
              </a>
              <p className="mt-3 px-1 text-center text-xs leading-relaxed text-[#5a4452] sm:text-left">first visit $199, up to 45 minutes — $50 deposit today, remaining $149 due on the day of your visit.</p>
            </div>
          </div>
        </section>



        <footer className="border-t border-[#eee4e9] px-5 py-8 sm:px-10">
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-5 sm:flex-row">
            <a href="/" aria-label="MedMethod Direct home"><img src={LOGO} alt="MedMethod Direct" className="h-9 w-auto" loading="eager" /></a>
            <a href="tel:+18883627011" className="text-center leading-tight text-[#df2f91] transition-colors hover:text-[#7a1e7e] sm:text-right">
              <span className="block text-[9px] font-black tracking-[0.18em]">CALL NOW</span>
              <span className="block text-base font-black">(888) 362-7011</span>
            </a>
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-[#766d75]">Available in 17 states</p>
          <div className="mx-auto mt-6 flex max-w-3xl items-center justify-center gap-2 text-center text-xs text-[#766d75]"><ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />Physician-led virtual care. Individual recommendations require an appropriate medical evaluation.</div>
        </footer>
      </article>
    </main>
  );
}
