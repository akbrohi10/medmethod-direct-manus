import VideoVisitCheckout from "@/components/masterclass2/VideoVisitCheckout";
import PhysicianProfile from "@/components/masterclass2/PhysicianProfile";
import { Helmet } from "react-helmet-async";
import { ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { installMasterclassMetaPixel } from "@/lib/masterclassMetaPixel";
import { getVideoVisitPendingCheckout } from "@/components/masterclass2/videoVisitCheckoutStorage";

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

export default function Masterclass2() {
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [disableFullScreen] = useState(() => typeof window !== "undefined" && window.matchMedia("(pointer: coarse), (max-width: 767px)").matches);
  const videoRef = useRef<HTMLElement>(null);
  const mobileBookingRef = useRef<HTMLButtonElement>(null);
  const mobileBookingOpened = useRef(false);

  useEffect(() => {
    installMasterclassMetaPixel();
    const pendingCheckout = getVideoVisitPendingCheckout();
    if (pendingCheckout && ["confirming", "provider_approved"].includes(pendingCheckout.phase ?? "")) setConsultationOpen(true);
  }, []);

  useEffect(() => {
    if (!consultationOpen && mobileBookingOpened.current) {
      mobileBookingOpened.current = false;
      const timer = window.setTimeout(() => mobileBookingRef.current?.focus({ preventScroll: true }), 250);
      return () => window.clearTimeout(timer);
    }
  }, [consultationOpen]);

  const scrollToVideo = () => {
    videoRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <main data-masterclass2-page className="min-h-screen bg-[#f7f3f5] text-[#25212a]" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <Helmet>
        <title>Free Masterclass: Menopause, Metabolism &amp; Weight Loss</title>
        <meta name="description" content="Watch Dr. Jumana Al-Deek explain how hormones, metabolism, and medical weight loss connect—plus real questions from women 35+." />
        <link rel="canonical" href="https://medmethoddirect.com/masterclass2" />
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
        @media (max-width: 767px) {
          [data-masterclass2-page] { padding-bottom: calc(88px + env(safe-area-inset-bottom, 0px)); }
        }
      `}</style>

      <article className="mx-auto min-h-screen w-full max-w-[1120px] overflow-hidden bg-white shadow-[0_24px_70px_rgba(42,25,54,0.13)] sm:my-6 sm:rounded-[1.5rem]">
        <div data-masterclass-video-first-banner className="bg-gradient-to-r from-[#e72e91] via-[#b92b92] to-[#5d237b] px-5 py-4 text-center text-[11px] font-black uppercase tracking-[0.14em] text-white sm:px-10 sm:py-5 sm:text-sm">
          Free On-Demand Masterclass
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
              <span className="block">Weight won’t budge?</span>{" "}
              <span className="block">Hormones feel off?</span>{" "}
              <span className="block">What’s really going on?</span>
            </h1>
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
              src={`https://www.youtube-nocookie.com/embed/${MASTERCLASS_YOUTUBE_ID}?rel=0&playsinline=1&fs=${disableFullScreen ? 0 : 1}`}
              title="Menopause, Metabolism & Medical Weight Loss: A New Approach to Health After 35+"
              className="absolute inset-0 h-full w-full"
              allow={`accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share${disableFullScreen ? "" : "; picture-in-picture"}`}
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen={!disableFullScreen}
              loading="eager"
            />
          </div>
        </section>

        <FeaturedInStrip />

        <PhysicianProfile />

        <section data-masterclass-video-first-booking data-masterclass2-work-with-me aria-labelledby="masterclass2-work-heading" className="border-t border-[#f0e5eb] bg-[#fff9fb] px-5 py-8 sm:px-10 sm:py-10 lg:px-16">
          <div className="mx-auto max-w-[800px] text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#b8336a]">Work With Me</p>
            <h2 id="masterclass2-work-heading" className="mt-2 text-2xl font-bold leading-tight text-[#281c30] sm:text-3xl">Thoughtful care. A plan built around you.</h2>
            <p className="mx-auto mt-3 max-w-[740px] text-sm leading-relaxed text-[#5a4452] sm:text-base">Together, we’ll look at your symptoms, health history, and goals—not just the number on the scale. We’ll discuss a personalized approach to hormones, metabolism, and weight that supports your long-term health.</p>
            <p className="mt-4 text-xs font-semibold text-[#7a1e7e]">100% virtual care · Available in 17 states</p>
          </div>
          <div className="mx-auto mt-6 grid max-w-[900px] gap-4 sm:grid-cols-2">
            <div data-masterclass2-free-call className="flex flex-col rounded-2xl border border-[#e7d6df] bg-white p-5 sm:p-6">
              <h3 className="text-lg font-bold text-[#281c30]">Have questions? Let’s start here.</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5a4452]">Talk with our Care Team about getting started.</p>
              <a href="/care-team-booking" data-masterclass-video-first-care-team-cta className="mt-5 inline-flex min-h-[56px] w-full items-center justify-center rounded-full border-2 border-[#b8336a] bg-white px-4 py-3 text-center text-sm font-bold text-[#7a1e7e] transition hover:bg-[#fff5fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#7a1e7e] active:scale-[0.98]">Book a Free 15-Minute Call</a>
              <p className="mt-3 text-xs leading-relaxed text-[#766d75]">With our Care Team. General information—not medical advice.</p>
            </div>
            <div data-masterclass2-video-offer className="flex flex-col rounded-2xl border border-[#e8bdd4] bg-white p-5 sm:p-6">
              <h3 className="text-lg font-bold text-[#281c30]">Personalized care. $39 per video visit.</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5a4452]">About the cost of a copay—with a visit focused on you.</p>
              <button type="button" data-masterclass-video-first-physician-cta onClick={() => setConsultationOpen(true)} className="mt-5 inline-flex min-h-[56px] w-full items-center justify-center rounded-full bg-gradient-to-r from-[#e8339e] to-[#7a1e7e] px-4 py-3 text-center text-sm font-bold text-white shadow-[0_6px_18px_rgba(122,30,126,0.18)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#7a1e7e] active:scale-[0.98]">Book Now — $39 per visit</button>
              <p className="mt-3 text-xs leading-relaxed text-[#766d75]">Video visit with Dr. Al-Deek. Self-pay visit. Insurance copays vary by plan. Medication is priced separately.</p>
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
          <div className="mx-auto mt-6 flex max-w-3xl items-center justify-center gap-2 text-center text-xs text-[#766d75]"><ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />Physician-led virtual care. Individual recommendations require an appropriate medical evaluation.</div>
        </footer>
      </article>
        <button
          type="button"
          data-masterclass2-mobile-booking
          aria-haspopup="dialog"
          ref={mobileBookingRef}
          onClick={() => { mobileBookingOpened.current = true; setConsultationOpen(true); }}
          className="fixed z-40 mx-auto flex min-h-[56px] max-w-[440px] items-center justify-center rounded-full border border-white/70 bg-gradient-to-r from-[#b92b92] to-[#7a1e7e] px-5 py-3 text-center text-base font-bold text-white shadow-[0_8px_28px_rgba(122,30,126,0.32)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#7a1e7e] active:scale-[0.98] md:hidden"
          style={{ display: consultationOpen ? "none" : undefined, left: "max(12px, env(safe-area-inset-left, 0px))", right: "max(12px, env(safe-area-inset-right, 0px))", bottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}
        >
          Book Now — $39 per visit
        </button>
      <VideoVisitCheckout open={consultationOpen} onClose={() => setConsultationOpen(false)} />
    </main>
  );
}
