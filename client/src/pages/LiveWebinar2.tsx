import { Helmet } from "react-helmet-async";
import { useEffect, useRef, useState } from "react";
import { Activity, Clock3, FlaskConical, MessageCircle, Play, Scale, Volume2 } from "lucide-react";
import { toast } from "sonner";

const DOCTOR_HEADSHOT_URL = "/manus-storage/dr-jumana-al-deek-headshot_75912bc8.png";
const WEBINAR_VIDEO_URL = "/manus-storage/replacement-speaking-event-web_3c5c62ae.mp4";
const WEBINAR_VIDEO_POSTER_URL = "/manus-storage/replacement-speaking-event-poster_5353b331.jpg";

// Confirmed event time: September 23, 2026 at 7:00 PM Eastern Daylight Time.
const WEBINAR_EVENT = {
  startsAt: "2026-09-23T19:00:00-04:00" as string | null,
  dateTimeDisplay: "WEDNESDAY, SEPTEMBER 23 · 7:00 PM ET",
  timezone: "ET",
};

const learningCards = [
  {
    number: "1",
    title: "The truth about hormone therapy (HRT)",
    body: "Including estrogen, progesterone and testosterone, potential benefits and risks, and common misconceptions.",
    icon: FlaskConical,
  },
  {
    number: "2",
    title: "Why losing weight can become harder",
    body: "In your late 30s and 40s — even when you’re eating and exercising the same way you always have.",
    icon: Scale,
  },
  {
    number: "3",
    title: "What’s actually happening to your hormones",
    body: "During perimenopause and menopause, how it affects your body, and what you can do about it.",
    icon: Activity,
  },
];

const featuredOutlets = [
  { name: "Flow Space", logo: "/manus-storage/flow-space-white_beb898dc.png" },
  { name: "SingleCare", logo: "/manus-storage/singlecare-white_500a5691.png" },
  { name: "NTD", logo: "/manus-storage/ntd-white_dd8e5f55.png" },
  { name: "Scary Mommy", logo: "/manus-storage/scary-mommy-white_b136c1bf.png" },
  { name: "Daily Mail", logo: "/manus-storage/daily-mail-white_bc1019ba.png" },
  { name: "Yahoo Health", logo: "/manus-storage/yahoo-health-white_125ff57a.png" },
];

type CountdownUnit = { value: string; label: string };

const EMPTY_COUNTDOWN: CountdownUnit[] = [
  { value: "00", label: "Days" },
  { value: "00", label: "Hours" },
  { value: "00", label: "Minutes" },
  { value: "00", label: "Seconds" },
];

function getCountdownUnits(startsAt: string | null): CountdownUnit[] {
  if (!startsAt) return EMPTY_COUNTDOWN;

  const targetTime = Date.parse(startsAt);
  if (!Number.isFinite(targetTime)) return EMPTY_COUNTDOWN;

  const remainingSeconds = Math.max(0, Math.floor((targetTime - Date.now()) / 1000));
  const days = Math.floor(remainingSeconds / 86_400);
  const hours = Math.floor((remainingSeconds % 86_400) / 3_600);
  const minutes = Math.floor((remainingSeconds % 3_600) / 60);
  const seconds = remainingSeconds % 60;

  return [
    { value: String(days).padStart(2, "0"), label: "Days" },
    { value: String(hours).padStart(2, "0"), label: "Hours" },
    { value: String(minutes).padStart(2, "0"), label: "Minutes" },
    { value: String(seconds).padStart(2, "0"), label: "Seconds" },
  ];
}

export default function LiveWebinar2() {
  const videoShellRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [hasVideoStarted, setHasVideoStarted] = useState(false);
  const [countdownUnits, setCountdownUnits] = useState(() => getCountdownUnits(WEBINAR_EVENT.startsAt));

  useEffect(() => {
    if (!WEBINAR_EVENT.startsAt) return;

    const updateCountdown = () => setCountdownUnits(getCountdownUnits(WEBINAR_EVENT.startsAt));
    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const shell = videoShellRef.current;
    const video = videoRef.current;
    if (!shell || !video) return;

    const webkitVideo = video as HTMLVideoElement & { webkitExitFullscreen?: () => void };
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const keepPlaybackInline = () => webkitVideo.webkitExitFullscreen?.();
    video.addEventListener("webkitbeginfullscreen", keepPlaybackInline);

    const attemptPlayback = () => {
      video.muted = false;
      const playback = video.play();
      playback
        ?.then(() => {
          setAutoplayBlocked(false);
          setHasVideoStarted(true);
        })
        .catch(() => setAutoplayBlocked(true));
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          attemptPlayback();
          return;
        }
        video.pause();
      },
      { threshold: [0, 0.6] },
    );

    observer.observe(shell);
    return () => {
      observer.disconnect();
      video.removeEventListener("webkitbeginfullscreen", keepPlaybackInline);
    };
  }, []);

  const handleReserveSeat = () => {
    toast.info("Registration is not connected yet. This button is for visual review only.");
  };

  const handlePlayWithSound = async () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    try {
      await video.play();
      setAutoplayBlocked(false);
      setHasVideoStarted(true);
    } catch {
      setAutoplayBlocked(true);
    }
  };

  return (
    <main
      data-live-webinar2
      className="min-h-screen bg-[#f3f0eb] px-0 py-0 text-[#24232a] sm:px-6 sm:py-8 lg:px-10 lg:py-12"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <Helmet>
        <title>Free Live Menopause Webinar | MedMethod Direct</title>
        <meta
          name="description"
          content="A free live educational webinar with Dr. Jumana Al-Deek about perimenopause, menopause, hormone therapy, and medical weight management."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://medmethoddirect.com/live-webinar2" />
      </Helmet>

      <article
        data-webinar2-card
        className="mx-auto w-full max-w-[1100px] overflow-hidden bg-white shadow-[0_24px_70px_rgba(42,25,54,0.13)] sm:rounded-[1.4rem]"
      >
        <header data-webinar2-zoom-banner className="bg-[#fff8fb] px-4 pt-4 pb-2 sm:px-8 sm:pt-7 sm:pb-3">
          <div className="mx-auto flex min-h-16 w-full max-w-[900px] items-center justify-center rounded-full bg-gradient-to-r from-[#e72e91] via-[#a12788] to-[#4b1c6e] px-5 py-4 text-center text-white shadow-[0_12px_28px_rgba(165,32,126,0.24)] sm:min-h-20 sm:px-8 sm:py-5">
            <p className="text-lg font-black uppercase leading-tight tracking-[0.055em] sm:text-2xl sm:tracking-[0.08em]">
              A Free Educational Webinar
            </p>
          </div>

          <div data-webinar2-top-event className="mx-auto mt-3 flex max-w-[900px] flex-col items-center sm:mt-4">
            <p data-webinar2-event-date className="text-center text-[11px] font-black uppercase tracking-[0.075em] text-[#4a2946] sm:text-sm sm:tracking-[0.1em]">
              {WEBINAR_EVENT.dateTimeDisplay}
            </p>
            <div data-webinar2-countdown-bar className="mt-2 flex justify-center sm:mt-2.5">
              <div data-webinar2-countdown aria-label="Webinar countdown" className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {countdownUnits.map(unit => (
                  <div key={unit.label} className="text-center">
                    <div className="min-w-[2.35rem] rounded-md bg-[#26222d] px-1.5 py-1.5 text-base font-black leading-5 tabular-nums text-white sm:min-w-12 sm:px-2 sm:py-2 sm:text-lg sm:leading-5">
                      {unit.value}
                    </div>
                    <p className="mt-1 text-[6px] font-black uppercase tracking-[0.07em] text-[#817781] sm:text-[7px]">{unit.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        <section
          data-webinar2-hero
          data-webinar2-centered-hero
          className="relative isolate mx-auto max-w-[1100px] overflow-hidden bg-[#fff8fb] px-5 pt-7 pb-9 text-center sm:px-10 sm:pt-10 sm:pb-12 lg:px-14 lg:pt-12 lg:pb-14"
        >
          <div
            data-webinar2-decorative-background
            className="pointer-events-none absolute inset-0 -z-10 opacity-90"
            aria-hidden="true"
            style={{
              backgroundImage:
                "repeating-radial-gradient(ellipse at -8% 75%, transparent 0 20px, rgba(218,44,132,0.075) 21px 22px, transparent 23px 31px), repeating-radial-gradient(ellipse at 108% 55%, transparent 0 22px, rgba(118,35,121,0.07) 23px 24px, transparent 25px 34px), radial-gradient(circle at 50% 100%, rgba(244,168,205,0.34), transparent 38%)",
            }}
          />

          <div data-webinar2-opening-copy className="relative z-10 mx-auto max-w-[800px] text-center">
            <p data-webinar2-audience-label className="text-sm font-black uppercase tracking-[0.18em] text-[#dd2d84] sm:text-base sm:tracking-[0.2em]">
              For Women 35+
            </p>
            <h1
              aria-label="Struggling With Weight Gain, Poor Sleep, Hot Flashes or Mood Swings?"
              className="mt-2 tracking-[-0.045em] sm:mt-3"
            >
              <span className="mx-auto block max-w-[790px] text-[2.05rem] font-black leading-[1.06] text-[#24102d] sm:text-[3rem] lg:text-[3.55rem]">
                Struggling With Weight Gain, Poor Sleep, Hot Flashes or Mood Swings?
              </span>
            </h1>
            <p
              data-webinar2-topic-line
              className="mx-auto mt-5 max-w-[720px] text-[1.28rem] font-extrabold leading-[1.2] tracking-[-0.025em] text-[#cf2b7f] sm:mt-7 sm:text-[1.8rem] lg:text-[2.05rem]"
            >
              Understand Perimenopause, Menopause, Hormone Therapy &amp; Medical Weight Loss.
            </p>
            <span data-webinar2-doctor-divider className="mx-auto mt-5 block h-0.5 w-28 rounded-full bg-[#d92780] sm:mt-6 sm:w-36" aria-hidden="true" />
            <div
              data-webinar2-authority-intro
              className="mx-auto mt-4 flex w-fit max-w-full items-center justify-center gap-3 rounded-full border border-[#e5cad9] bg-white/78 py-2.5 pr-5 pl-2.5 text-left shadow-[0_9px_24px_rgba(122,30,126,0.09)] sm:mt-5 sm:gap-4 sm:py-3 sm:pr-7 sm:pl-3"
            >
              <img
                src={DOCTOR_HEADSHOT_URL}
                alt="Dr. Jumana Al-Deek"
                className="h-14 w-14 shrink-0 rounded-full border-2 border-white object-cover shadow-[0_4px_12px_rgba(70,28,57,0.2)] sm:h-16 sm:w-16"
                loading="eager"
                decoding="async"
              />
              <div className="min-w-0">
                <p className="text-sm font-black leading-5 text-[#27132e] sm:text-base">Dr. Jumana Al-Deek</p>
                <p className="text-[10px] font-semibold leading-4 text-[#8b326c] sm:text-xs">
                  Physician and author of <em>The Menopause Weight Loss Trap</em>
                </p>
              </div>
            </div>

          </div>

          <div
            ref={videoShellRef}
            data-webinar2-video-shell
            className="relative z-10 mx-auto mt-6 aspect-video w-full max-w-[800px] overflow-hidden rounded-[1.45rem] border-[3px] border-white bg-[#1b1022] shadow-[0_20px_50px_rgba(123,28,104,0.25)] ring-1 ring-[#e1c7d6] sm:mt-7 sm:rounded-[1.7rem]"
          >
            <video
              ref={videoRef}
              className="h-full w-full bg-black object-cover"
              controls
              playsInline
              preload="metadata"
              poster={WEBINAR_VIDEO_POSTER_URL}
              aria-label="Dr. Jumana Al-Deek speaking at a women’s health educational event"
              controlsList="nodownload noremoteplayback nofullscreen"
              disablePictureInPicture
              disableRemotePlayback
              onPlay={() => setHasVideoStarted(true)}
            >
              <source src={WEBINAR_VIDEO_URL} type="video/mp4" />
              Your browser does not support embedded video playback.
            </video>

            {!hasVideoStarted && (
              <span
                data-webinar2-video-length-token
                className="pointer-events-none absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#e72e91] to-[#75207f] px-3 py-2 text-[10px] font-black text-white shadow-lg sm:top-4 sm:left-4 sm:gap-2 sm:px-4 sm:text-xs"
              >
                <Clock3 className="h-4 w-4" aria-hidden="true" />
                Watch: [VIDEO LENGTH]
              </span>
            )}

            {autoplayBlocked && (
              <button
                type="button"
                onClick={handlePlayWithSound}
                className="absolute inset-0 bg-black/24 text-center text-white backdrop-blur-[0.5px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white/90"
              >
                <span className="absolute top-[48%] left-1/2 inline-flex h-[4.5rem] w-[4.5rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-[#e72e91] to-[#6b1f80] text-white shadow-[0_12px_28px_rgba(71,20,80,0.36)] sm:h-24 sm:w-24">
                  <Play className="ml-1 h-8 w-8 fill-current sm:h-11 sm:w-11" aria-hidden="true" />
                </span>
                <span className="absolute bottom-3 left-1/2 inline-flex min-h-10 -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[#291232]/92 px-4 py-2 text-[9px] font-black uppercase tracking-[0.07em] shadow-xl sm:bottom-5 sm:min-h-11 sm:px-7 sm:py-2.5 sm:text-xs sm:tracking-[0.08em]">
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                  Play Video With Sound
                </span>
              </button>
            )}
          </div>

          <button
            data-webinar2-primary-cta
            type="button"
            onClick={handleReserveSeat}
            className="mx-auto mt-5 inline-flex min-h-16 w-full max-w-[720px] flex-col items-center justify-center gap-0.5 rounded-full bg-gradient-to-r from-[#ee2b91] to-[#7a1e7e] px-7 py-3 text-white shadow-[0_14px_30px_rgba(176,24,124,0.27)] transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d51b75] focus-visible:ring-offset-4 active:scale-[0.97] sm:mt-6"
          >
            <span className="text-sm font-black uppercase leading-5 tracking-[0.055em] sm:text-base">Reserve My Free Spot</span>
            <span data-webinar2-capacity-line className="text-[9px] font-bold uppercase leading-3 tracking-[0.14em] text-white/82 sm:text-[10px]">
              Limited Zoom Capacity
            </span>
          </button>

        </section>

        <section
          data-webinar2-featured-in
          aria-labelledby="webinar2-featured-in-heading"
          className="bg-gradient-to-r from-[#25134f] via-[#5b3aa4] to-[#2d185d] px-5 py-3 text-white sm:px-8 sm:py-3.5"
        >
          <div className="mx-auto max-w-[1020px]">
            <div className="flex items-center justify-center gap-3 sm:gap-5">
              <span className="h-px w-7 bg-white/45 sm:w-14" aria-hidden="true" />
              <h2 id="webinar2-featured-in-heading" className="shrink-0 text-[11px] font-black uppercase tracking-[0.16em] text-white sm:text-xs">
                Featured In
              </h2>
              <span className="h-px w-7 bg-white/45 sm:w-14" aria-hidden="true" />
            </div>
            <div
              data-webinar2-logo-marquee
              className="webinar2-logo-marquee scrollbar-hide mt-2.5"
              tabIndex={0}
              aria-label="Featured media outlets"
              style={{ WebkitMaskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)", maskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)" }}
            >
              <div data-webinar2-logo-track className="webinar2-logo-marquee__track">
                <div data-webinar2-logo-set className="flex shrink-0 items-center gap-7 pr-7 sm:gap-10 sm:pr-10 lg:gap-12 lg:pr-12">
                  {featuredOutlets.map(outlet => (
                    <div key={`${outlet.name}-primary`} className="flex h-8 w-24 shrink-0 items-center justify-center sm:h-9 sm:w-28 lg:w-32">
                      <img
                        src={outlet.logo}
                        alt={`${outlet.name} logo`}
                        className="max-h-full max-w-full object-contain opacity-95"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
                <div
                  data-webinar2-logo-set-duplicate
                  className="webinar2-logo-marquee__duplicate flex shrink-0 items-center gap-7 pr-7 sm:gap-10 sm:pr-10 lg:gap-12 lg:pr-12"
                  aria-hidden="true"
                >
                  {featuredOutlets.map(outlet => (
                    <div key={`${outlet.name}-duplicate`} className="flex h-8 w-24 shrink-0 items-center justify-center sm:h-9 sm:w-28 lg:w-32">
                      <img
                        src={outlet.logo}
                        alt=""
                        className="max-h-full max-w-full object-contain opacity-95"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="px-5 pt-10 pb-10 sm:px-10 sm:pt-12 sm:pb-14 lg:px-16 lg:pb-16">
          <section
            data-webinar2-learning
            className="mx-auto max-w-[980px] rounded-[2rem] border border-[#f0dfe5] bg-[#fff7f5] px-4 py-8 shadow-[0_20px_55px_rgba(85,45,68,0.08)] sm:px-8 sm:py-12 lg:px-12"
          >
            <div className="mx-auto max-w-[880px] text-center">
              <p className="inline-flex rounded-full bg-[#fde8ef] px-6 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#cf1475] sm:px-8 sm:text-sm">
                What You’ll Learn
              </p>
              <h2 className="mx-auto mt-5 max-w-[760px] text-4xl font-black leading-[1.02] tracking-[-0.045em] text-[#231f30] sm:text-5xl lg:text-6xl">
                Because You Deserve to Know
              </h2>
              <p className="mx-auto mt-5 max-w-[760px] text-base leading-7 text-[#5d5968] sm:text-xl sm:leading-8">
                Evidence-based insights you can actually use — so you can feel informed, confident, and in control.
              </p>
              <ol data-webinar2-learning-grid className="mt-8 space-y-5 text-left sm:mt-10 sm:space-y-6">
                {learningCards.map(({ number, title, body, icon: Icon }) => (
                  <li
                    data-webinar2-learning-card
                    key={number}
                    className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-4 rounded-[1.75rem] border border-white bg-white px-4 py-6 shadow-[0_16px_38px_rgba(105,48,79,0.09)] sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-7 sm:px-7 sm:py-8"
                  >
                    <div data-webinar2-learning-icon className="relative flex min-h-24 items-center justify-center sm:min-h-36">
                      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fde8f0] text-[#d61579] sm:h-36 sm:w-36" aria-hidden="true">
                        <Icon className="h-10 w-10 stroke-[1.8] sm:h-16 sm:w-16" />
                      </span>
                      <span
                        data-webinar2-learning-number
                        className="absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-full bg-[#db147a] text-xl font-black text-white shadow-[0_8px_18px_rgba(219,20,122,0.2)] sm:h-13 sm:w-13 sm:text-2xl"
                        aria-hidden="true"
                      >
                        {number}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-black leading-[1.18] tracking-[-0.025em] text-[#252132] sm:text-2xl">{title}</h3>
                      <p className="mt-3 text-sm leading-6 text-[#5f5b69] sm:text-lg sm:leading-8">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-7 flex justify-center sm:mt-8">
                <button
                  type="button"
                  onClick={handleReserveSeat}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-gradient-to-r from-[#ee2b91] to-[#7a1e7e] px-6 py-3.5 text-sm font-black uppercase tracking-[0.055em] text-white shadow-[0_12px_24px_rgba(176,24,124,0.2)] transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d51b75] focus-visible:ring-offset-4 active:scale-[0.97] sm:w-auto sm:text-base"
                >
                  Reserve My Free Spot
                </button>
              </div>
            </div>
          </section>

          <div className="mx-auto mt-11 grid max-w-[940px] gap-4 border-t border-[#ece4e9] pt-7 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
            <div>
              <p className="text-sm font-black text-[#29252f]">Become informed—not pressured.</p>
              <p className="mt-2 max-w-[720px] text-xs leading-5 text-[#716a73] sm:text-sm sm:leading-6">
                The goal is to help you understand your body, know your options, and make more informed decisions about your care.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 rounded-full bg-[#faf4f8] px-4 py-2.5 text-sm font-bold text-[#4b3149]">
              <MessageCircle className="h-5 w-5 text-[#d51b75]" aria-hidden="true" />
              Live Q&amp;A with Dr. Al-Deek
            </div>
          </div>

          <p className="mx-auto mt-8 max-w-[860px] text-center text-[10px] leading-5 text-[#7a727a] sm:text-xs">
            This live webinar is for general educational purposes and is not a medical consultation. Individual treatment recommendations require an appropriate medical evaluation.
          </p>
        </div>
      </article>
    </main>
  );
}
