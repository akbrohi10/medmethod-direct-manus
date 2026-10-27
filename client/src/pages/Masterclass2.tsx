import VideoVisitCheckout from "@/components/masterclass2/checkout4799/VideoVisitCheckout4799";
import PhysicianProfile from "@/components/masterclass2/PhysicianProfile";
import ProcessPricing from "@/components/masterclass2/ProcessPricing";
import FinalFaq from "@/components/masterclass2/FinalFaq";
import { V2_FAQ_FOOTER_PARAGRAPHS } from "@/pages/WeightLossMenopauseV2FaqData";
import { Helmet } from "react-helmet-async";
import { ArrowRight, MessageCircleMore, PhoneCall, ShieldCheck, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { installMasterclassMetaPixel } from "@/lib/masterclassMetaPixel";
import { getMasterclass2VideoPendingCheckout as getVideoVisitPendingCheckout } from "@/components/masterclass2/checkout4799/videoVisitCheckout4799Storage";

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
  const mobileBookingRef = useRef<HTMLAnchorElement>(null);
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
        <link rel="canonical" href="https://medmethoddirect.com/masterclass" />
        <meta property="og:url" content="https://medmethoddirect.com/masterclass" />
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
          [data-masterclass2-page] { padding-bottom: calc(144px + env(safe-area-inset-bottom, 0px)); }
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
            <h1
              className="mx-auto max-w-[810px] font-black text-[#111111] leading-[1.05]"
              style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.375rem, 7vw, 3.5rem)", letterSpacing: "-0.02em" }}
            >
              <span
                data-masterclass2-home-headline
                className="block"
                style={{ backgroundImage: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
              >
                <span className="block">Menopause, Hormones</span>{" "}
                <span className="block">&amp; Weight Loss.</span>{" "}
                <span data-masterclass2-headline-promise className="mt-2 block text-[0.8em] leading-[1.1] sm:mt-3">Done Right for You.</span>
              </span>
            </h1>
            <p
              data-masterclass2-virtual-subheading
              className="mt-2 font-extrabold text-[#111111]"
              style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.4rem)", letterSpacing: "-0.01em" }}
            >
              100% Virtual
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

        <div data-masterclass2-family-photo-section className="bg-[#fff9fb] px-5 pt-6 sm:px-10 sm:pt-8 lg:px-16">
          <img
            data-masterclass2-family-photo
            src="/manus-storage/jumana-family-masterclass_238b56a3.webp"
            alt="Dr. Jumana Al-Deek with her family outdoors"
            width={1100}
            height={1100}
            loading="lazy"
            decoding="async"
            className="mx-auto block h-auto w-full max-w-[340px] rounded-2xl border border-[#f0e5eb] object-contain shadow-[0_10px_28px_rgba(54,29,55,0.12)] sm:max-w-[390px]"
          />
        </div>

        <PhysicianProfile />
        <ProcessPricing />

        <section data-masterclass-video-first-booking data-masterclass2-work-with-me aria-labelledby="masterclass2-work-heading" className="border-t border-[#f0e5eb] bg-white px-5 py-8 sm:px-10 sm:py-10 lg:px-16">
          <div className="mx-auto max-w-[640px] text-center">
            <h2 id="masterclass2-work-heading" className="mx-auto max-w-[520px] text-[clamp(1.75rem,7.4vw,2.5rem)] font-extrabold leading-[1.12] tracking-[-0.025em] text-[#171225]">Choose How to Connect</h2>
            <p className="mt-3 text-[14px] font-medium leading-6 text-[#5a4452] sm:text-[15px]">100% virtual care · Available in 17 states</p>
          </div>
          <div data-masterclass2-connection-rows className="mx-auto mt-6 flex max-w-[640px] flex-col gap-3.5 text-left sm:mt-7">
            <div data-masterclass2-video-offer>
              <a href="https://intake.medmethoddirect.com/?video=1" data-masterclass-video-first-physician-cta className="group flex min-h-[88px] w-full items-center gap-3 rounded-[28px] bg-gradient-to-r from-[#e8339e] to-[#7a1e7e] px-4 py-4 text-left text-white shadow-[0_6px_18px_rgba(122,30,126,0.12)] transition-colors duration-150 hover:from-[#df2c92] hover:to-[#6b1a70] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#7a1e7e] sm:gap-5 sm:rounded-full sm:px-6 sm:py-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center sm:h-16 sm:w-16"><Video className="h-7 w-7 sm:h-9 sm:w-9" aria-hidden="true" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold leading-6 sm:text-[19px]">Book My Video Visit</span>
                  <span className="mt-1 block text-[14px] font-medium leading-5 text-white/90 sm:text-base sm:leading-6">Only $97</span>
                  <span className="mt-1 block text-[14px] font-medium leading-5 text-white/90 sm:text-base sm:leading-6">Includes seven days of follow-up messaging.</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" aria-hidden="true" />
              </a>
            </div>
            <div data-masterclass2-text-visit>
              <a href="https://intake.medmethoddirect.com/" data-masterclass2-text-visit-cta className="group flex min-h-[88px] w-full items-center gap-3 rounded-[28px] border border-[#e7cbdc] bg-[#fdf8fb] px-4 py-4 text-left text-[#7a1e7e] transition-colors duration-150 hover:bg-[#f7edf3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#7a1e7e] sm:gap-5 sm:rounded-[36px] sm:px-6 sm:py-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fce8f3] sm:h-16 sm:w-16"><MessageCircleMore className="h-7 w-7 sm:h-9 sm:w-9" aria-hidden="true" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold leading-6 sm:text-[19px]">Free First Doctor Visit — Text Only</span>
                  <span className="mt-1 block text-[14px] font-medium leading-[1.55] text-[#5a4452] sm:text-base">Complete your intake (5–10 min), then connect with your doctor by text.</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" aria-hidden="true" />
              </a>
            </div>
            <div data-masterclass2-free-call>
              <a href="/care-team-booking" data-masterclass-video-first-care-team-cta className="group flex min-h-[88px] w-full items-center gap-3 rounded-[28px] border border-[#e7cbdc] bg-white px-4 py-4 text-left text-[#7a1e7e] transition-colors duration-150 hover:bg-[#fdf8fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#7a1e7e] sm:gap-5 sm:rounded-[36px] sm:px-6 sm:py-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fce8f3] sm:h-16 sm:w-16"><PhoneCall className="h-7 w-7 sm:h-9 sm:w-9" aria-hidden="true" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold leading-6 sm:text-[19px]">Free 15-Minute Discovery Call</span>
                  <span className="mt-1 block text-[14px] font-medium leading-[1.55] text-[#5a4452] sm:text-base">Talk with our care team, ask questions, and find the best option for you.</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" aria-hidden="true" />
              </a>
            </div>
          </div>
          <div data-masterclass2-connection-disclosures className="mx-auto mt-5 max-w-[640px] text-center text-[12px] font-medium leading-5 text-[#766d75] sm:text-[13px]">
            <p>Every doctor visit includes seven days of follow-up messaging about your care plan. New concerns or additional treatments require a separate visit. Medication priced separately.</p>
            <p className="mt-1">Care Team call: general information, not medical advice.</p>
          </div>
        </section>

        <FinalFaq intakeHref="https://intake.medmethoddirect.com/" />
        <footer className="border-t border-[#eee4e9] px-5 py-8 sm:px-10">
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-5 sm:flex-row">
            <a href="/" aria-label="MedMethod Direct home"><img src={LOGO} alt="MedMethod Direct" className="h-9 w-auto" loading="eager" /></a>
            <a href="tel:+18883627011" className="text-center leading-tight text-[#df2f91] transition-colors hover:text-[#7a1e7e] sm:text-right">
              <span className="block text-[9px] font-black tracking-[0.18em]">CALL NOW</span>
              <span className="block text-base font-black">(888) 362-7011</span>
            </a>
          </div>
          <div className="mx-auto mt-6 flex max-w-3xl items-center justify-center gap-2 text-center text-xs text-[#766d75]"><ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />Physician-led virtual care. Individual recommendations require an appropriate medical evaluation.</div>
          <div data-masterclass-legitscript-footer-seal className="mt-6 flex justify-center">
            <a
              href="https://www.legitscript.com/websites/?checker_keywords=medmethoddirect.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Verify LegitScript Approval for www.medmethoddirect.com"
              className="inline-flex rounded-md transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7a1e7e]"
            >
              <img
                src="/manus-storage/legitscript-certified-seal-51795425_51edddb5.png"
                alt="Verify Approval for www.medmethoddirect.com"
                width="73"
                height="79"
                loading="eager"
                decoding="async"
                className="block h-auto w-[61px] max-w-full object-contain sm:w-[73px]"
              />
            </a>
          </div>
          <div data-masterclass-footer-disclaimers className="mx-auto mt-6 max-w-3xl space-y-3 text-center text-xs leading-6 text-[#766d75] sm:text-[13px]">
            {V2_FAQ_FOOTER_PARAGRAPHS.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </footer>
      </article>
        <nav
          data-masterclass2-mobile-connection-bar
          aria-label="Choose how to connect"
          className="fixed z-40 mx-auto max-w-[440px] rounded-[12px] border border-[#e9c8f3] bg-white p-1.5 shadow-[0_6px_20px_rgba(61,22,64,0.12)] md:hidden"
          style={{ display: consultationOpen ? "none" : undefined, left: "max(12px, env(safe-area-inset-left, 0px))", right: "max(12px, env(safe-area-inset-right, 0px))", bottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}
        >
          <div className="grid grid-cols-3 gap-1">
            <a
              data-masterclass2-mobile-text-visit
              href="https://intake.medmethoddirect.com/"
              aria-label="First text visit — free"
              className="flex min-h-[68px] min-w-0 flex-col items-center justify-center gap-0.5 rounded-[9px] border border-[#b367ca] bg-white px-0.5 py-1 text-center text-[11px] leading-[14px] text-[#870081] transition-transform duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#870081] active:scale-[0.97] motion-reduce:transition-none"
            >
              <MessageCircleMore className="h-[22px] w-[22px] shrink-0" aria-hidden="true" />
              <span className="block whitespace-nowrap font-bold">Text Visit</span>
              <span className="block whitespace-nowrap text-[10px] font-normal">First free</span>
            </a>
            <a
              href="https://intake.medmethoddirect.com/?video=1"
              data-masterclass2-mobile-booking
              aria-label="Video visit — $97"
              ref={mobileBookingRef}
              className="flex min-h-[68px] min-w-0 flex-col items-center justify-center gap-0.5 rounded-[9px] bg-gradient-to-r from-[#bb0d7e] to-[#680686] px-0.5 py-1 text-center text-[11px] leading-[14px] text-white transition-transform duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#870081] active:scale-[0.97] motion-reduce:transition-none"
            >
              <Video className="h-[22px] w-[22px] shrink-0" aria-hidden="true" />
              <span className="block whitespace-nowrap font-bold">Video Visit</span>
              <span className="block whitespace-nowrap text-[10px] font-normal">$97</span>
            </a>
            <a
              data-masterclass2-mobile-care-call
              href="tel:+18883627011"
              aria-label="Call now for more information: (888) 362-7011"
              className="flex min-h-[68px] min-w-0 flex-col items-center justify-center gap-0.5 rounded-[9px] border border-[#b367ca] bg-white px-0.5 py-1 text-center text-[11px] leading-[14px] text-[#870081] transition-transform duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#870081] active:scale-[0.97] motion-reduce:transition-none"
            >
              <PhoneCall className="h-[22px] w-[22px] shrink-0" aria-hidden="true" />
              <span className="block whitespace-nowrap font-bold">Call Now</span>
              <span className="block whitespace-nowrap text-[10px] font-normal">Clinic info</span>
            </a>
          </div>
        </nav>
      <VideoVisitCheckout open={consultationOpen} onClose={() => setConsultationOpen(false)} />
    </main>
  );
}
