import { Helmet } from "react-helmet-async";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { CalendarDays, CheckCircle2, MessageCircle, Play } from "lucide-react";
import { toast } from "sonner";

const DOCTOR_HEADSHOT_URL = "/manus-storage/dr-jumana-al-deek-headshot_75912bc8.png";
const BOOK_COVER_URL = "/manus-storage/menopause-weight-loss-trap-book-cover-transparent_02607d91.png";
const WEBINAR_VIDEO_URL = "/manus-storage/replacement-speaking-event-web_3c5c62ae.mp4";
const WEBINAR_VIDEO_POSTER_URL = "/manus-storage/replacement-speaking-event-poster_5353b331.jpg";

// Set `startsAt` to the confirmed ISO date-time to activate the countdown and replace the display tokens below.
const WEBINAR_EVENT = {
  startsAt: null as string | null,
  dateTimeDisplay: "[DAY], [MONTH] [DATE] · [TIME] [TIMEZONE]",
  timezone: "[TIMEZONE]",
  duration: "[DURATION]",
};

const learningPoints = [
  "The truth about hormone therapy (HRT) — including estrogen, progesterone and testosterone, potential benefits and risks, and common misconceptions.",
  "Why losing weight can suddenly become harder in your late 30s and 40s even when you're eating and exercising the same way you always have.",
  "What's actually happening to your hormones during perimenopause and menopause — and why it can affect everything from sleep and mood to metabolism, muscle and belly fat.",
  "How GLP-1 medications work and where medical weight loss may fit into your overall health strategy.",
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
  const registrationFormRef = useRef<HTMLFormElement>(null);
  const videoShellRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [hasVideoStarted, setHasVideoStarted] = useState(false);
  const [showStates, setShowStates] = useState(false);
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

  const focusRegistrationForm = () => {
    registrationFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => registrationFormRef.current?.querySelector<HTMLInputElement>('input[name="firstName"]')?.focus(), 450);
  };

  const handleReserveSeat = () => {
    focusRegistrationForm();
    toast.info("Registration is not connected yet. This form is for visual review only.");
  };

  const handleRegistrationPreview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleReserveSeat();
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

  const eventDateLine = `${WEBINAR_EVENT.dateTimeDisplay} · ${WEBINAR_EVENT.duration} + live Q&A`;

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
        className="mx-auto w-full max-w-[1180px] overflow-hidden bg-white shadow-[0_24px_70px_rgba(42,25,54,0.13)] sm:rounded-[1.4rem]"
      >
        <section
          data-webinar2-hero
          className="mx-auto grid max-w-[1100px] gap-6 px-5 pt-6 pb-8 sm:px-10 sm:pt-8 sm:pb-10 lg:grid-cols-[minmax(0,1.22fr)_minmax(0,1fr)] lg:items-center lg:gap-10 lg:px-14 lg:py-10"
        >
          <div data-webinar2-opening-copy className="order-1 lg:col-start-1">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#b78a3f] sm:text-[11px]">
              Free Live Webinar · For Women 35+
            </p>
            <h1 className="mt-3 max-w-[590px] tracking-[-0.04em] text-[#26242c]">
              <span className="block text-[2rem] font-black leading-[1.08] sm:text-[2.5rem] lg:text-[3rem]">You’re not imagining it.</span>
              <span className="mt-2 block text-[1.75rem] font-medium italic leading-[1.12] text-[#6f3568] sm:mt-2.5 sm:text-[2.15rem] lg:text-[2.55rem]">
                Here’s what’s actually changing — and what you can do about it.
              </span>
            </h1>
            <p data-webinar2-short-intro className="mt-3 max-w-[560px] text-sm font-semibold leading-6 text-[#4b4750] sm:text-[15px]">
              A free educational webinar with Dr. Jumana Al-Deek.
            </p>
          </div>

          <div className="order-2 mx-auto w-full max-w-[350px] lg:col-start-2 lg:row-span-3 lg:max-w-none">
            <div
              data-webinar2-countdown-bar
              className="mb-4 flex justify-center"
            >
              <div data-webinar2-countdown aria-label="Webinar countdown" className="grid grid-cols-4 gap-2 sm:gap-2.5">
                {countdownUnits.map(unit => (
                  <div key={unit.label} className="text-center">
                    <div className="min-w-[3.25rem] rounded-lg bg-[#26222d] px-2 py-2.5 text-xl font-black leading-6 tabular-nums text-white sm:min-w-14 sm:py-3 sm:text-2xl sm:leading-7">
                      {unit.value}
                    </div>
                    <p className="mt-1.5 text-[8px] font-black uppercase tracking-[0.08em] text-[#817781] sm:text-[9px]">{unit.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              ref={videoShellRef}
              data-webinar2-video-shell
              className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#1b1022] shadow-[0_18px_42px_rgba(48,22,54,0.2)] sm:aspect-[4/5]"
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
                  className="pointer-events-none absolute top-3 left-3 z-10 rounded-full bg-black/75 px-3 py-2 text-xs font-black text-white shadow-lg"
                >
                  Watch: [VIDEO LENGTH]
                </span>
              )}

              {autoplayBlocked && (
                <button
                  type="button"
                  onClick={handlePlayWithSound}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40 px-6 text-center text-white backdrop-blur-[1px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white/90"
                >
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#6f1d78] shadow-xl">
                    <Play className="ml-1 h-8 w-8 fill-current" aria-hidden="true" />
                  </span>
                  <span className="rounded-full bg-black/65 px-4 py-2 text-xs font-black uppercase tracking-[0.08em]">
                    Play Video With Sound
                  </span>
                </button>
              )}
            </div>
          </div>

          <div data-webinar2-compact-presenter className="order-3 hidden items-center justify-center gap-3 text-center lg:col-start-2 lg:row-start-4 lg:mt-[-1rem] lg:flex">
            <img
              src={DOCTOR_HEADSHOT_URL}
              alt="Dr. Jumana Al-Deek"
              className="h-10 w-10 rounded-full border border-[#dbc4d1] object-cover"
              loading="lazy"
              decoding="async"
            />
            <p className="text-xs font-bold leading-5 text-[#4e4750] sm:text-sm">
              <span className="font-black">Dr. Jumana Al-Deek</span>
              <span className="mx-1.5 text-[#b58aa5]">•</span>
              <span data-webinar2-compact-credentials-token className="font-black text-[#8d3b70]">
                [CREDENTIALS]
              </span>
            </p>
          </div>

          <form
            ref={registrationFormRef}
            data-webinar2-registration-preview
            onSubmit={handleRegistrationPreview}
            className="order-4 grid w-full max-w-[560px] gap-3 rounded-xl border border-[#eadbe4] bg-[#fffafd] p-4 shadow-[0_12px_30px_rgba(81,30,67,0.08)] sm:grid-cols-2 lg:col-start-1 lg:row-start-2"
          >
            <label className="text-left">
              <span className="sr-only">First Name</span>
              <input
                name="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="First Name"
                className="h-12 w-full rounded-md border border-[#d9ccd5] bg-white px-4 text-base text-[#28242d] outline-none transition focus:border-[#c51b79] focus:ring-2 focus:ring-[#c51b79]/15"
              />
            </label>
            <label className="text-left">
              <span className="sr-only">Email</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                className="h-12 w-full rounded-md border border-[#d9ccd5] bg-white px-4 text-base text-[#28242d] outline-none transition focus:border-[#c51b79] focus:ring-2 focus:ring-[#c51b79]/15"
              />
            </label>
          </form>

          <div className="order-5 max-w-[560px] lg:col-start-1 lg:row-start-3">
            <button
              type="button"
              onClick={handleReserveSeat}
              className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-gradient-to-r from-[#ee2b91] to-[#7a1e7e] px-6 py-3 text-sm font-black uppercase tracking-[0.045em] text-white shadow-[0_12px_24px_rgba(176,24,124,0.2)] transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d51b75] focus-visible:ring-offset-2 active:scale-[0.97] sm:w-auto"
            >
              Reserve My Free Spot
            </button>
            <p data-webinar2-event-line className="mt-3 text-xs font-black leading-5 text-[#27242d] sm:text-sm">
              {eventDateLine}
            </p>
            <p className="mt-1.5 text-xs font-semibold text-[#5c555e] sm:text-sm">
              Can’t attend live? Register anyway and we’ll send you the recording.
            </p>
            <p className="mt-1.5 text-[11px] text-[#766f77] sm:text-xs">
              We respect your privacy.{" "}
              <a href="/privacy-policy" className="font-bold text-[#9b216f] underline underline-offset-2">
                Privacy Policy
              </a>
            </p>
            <div data-webinar2-availability className="mt-4 max-w-[560px] border-t border-[#ece4e9] pt-3 text-[11px] font-semibold leading-5 text-[#655d66] sm:text-xs">
              <p>
                Available nationwide for this free educational webinar.{" "}
                <button
                  type="button"
                  aria-expanded={showStates}
                  onClick={() => setShowStates(current => !current)}
                  className="font-black text-[#a91970] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d51b75]"
                >
                  See states
                </button>
              </p>
              {showStates && (
                <p data-webinar2-state-list-token className="mt-2 rounded-md border border-dashed border-[#c892ad] bg-[#fff8fc] px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#8d3b70]">
                  [STATE LIST]
                </p>
              )}
            </div>
          </div>
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
            <div className="mt-2 grid grid-cols-3 items-center gap-x-5 gap-y-2.5 sm:grid-cols-6 sm:gap-x-7 lg:gap-x-10">
              {featuredOutlets.map(outlet => (
                <div key={outlet.name} className="flex h-8 min-w-0 items-center justify-center sm:h-9">
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
          </div>
        </section>

        <div className="px-5 pt-10 pb-10 sm:px-10 sm:pt-12 sm:pb-14 lg:px-16 lg:pb-16">
          <section data-webinar2-learning className="mx-auto max-w-[940px]">
            <div className="mx-auto max-w-[760px]">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c31b78]">What You’ll Learn</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.035em] text-[#28242d] sm:text-4xl">
                Clear answers for your next chapter.
              </h2>
              <ul className="mt-6 space-y-4">
                {learningPoints.map(point => (
                  <li key={point} className="flex items-start gap-3 text-sm leading-6 text-[#4c4750] sm:text-base">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#d51b75]" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={handleReserveSeat}
                className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-gradient-to-r from-[#ee2b91] to-[#7a1e7e] px-6 py-3.5 text-sm font-black uppercase tracking-[0.055em] text-white shadow-[0_12px_24px_rgba(176,24,124,0.2)] transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d51b75] focus-visible:ring-offset-4 active:scale-[0.97] sm:w-auto sm:text-base"
              >
                Reserve My Free Spot
              </button>
            </div>

            <section
              data-webinar2-presenter
              className="mx-auto mt-10 grid max-w-[940px] items-center gap-5 rounded-xl border border-[#eadde5] bg-[#fffafd] p-5 text-center shadow-[0_12px_30px_rgba(74,33,65,0.06)] sm:grid-cols-[124px_1fr_92px] sm:text-left"
            >
              <img
                src={DOCTOR_HEADSHOT_URL}
                alt="Dr. Jumana Al-Deek"
                className="mx-auto h-28 w-28 rounded-full border border-[#dbc4d1] object-cover sm:mx-0 sm:h-28 sm:w-28"
                loading="lazy"
                decoding="async"
              />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#b11970]">Your Presenter</p>
                <h2 className="mt-1.5 text-2xl font-black tracking-[-0.025em] text-[#29252f]">Dr. Jumana Al-Deek</h2>
                <p
                  data-webinar2-credentials-token
                  className="mt-2 inline-block rounded-md border border-dashed border-[#bf8ba9] bg-white px-2.5 py-1.5 text-[10px] font-black uppercase leading-4 tracking-[0.07em] text-[#8d3b70] sm:text-[11px]"
                >
                  [CREDENTIALS — BOARD CERTIFICATION, SPECIALTY, YEARS IN PRACTICE]
                </p>
                <div className="mt-3 flex items-center justify-center gap-3 sm:justify-start">
                  <p className="text-sm font-semibold leading-5 text-[#4e4750]">
                    Author of <em className="font-bold">The Menopause Weight Loss Trap</em>
                  </p>
                  <img
                    src={BOOK_COVER_URL}
                    alt="Cover of The Menopause Weight Loss Trap by Dr. Jumana Al-Deek"
                    className="h-20 w-14 object-contain drop-shadow-[0_8px_10px_rgba(71,30,50,0.18)] sm:hidden"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
              <img
                src={BOOK_COVER_URL}
                alt="Cover of The Menopause Weight Loss Trap by Dr. Jumana Al-Deek"
                className="mx-auto hidden h-28 w-20 object-contain drop-shadow-[0_10px_12px_rgba(71,30,50,0.18)] sm:block"
                loading="lazy"
                decoding="async"
              />
            </section>
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

          <section data-webinar2-final-cta className="mx-auto mt-10 max-w-[900px] rounded-xl bg-[#f7eef5] px-5 py-7 text-center sm:px-8">
            <h2 className="text-2xl font-black tracking-[-0.025em] text-[#302632] sm:text-3xl">Ready to save your free spot?</h2>
            <p className="mx-auto mt-2 max-w-[650px] text-sm leading-6 text-[#655d66]">
              Return to the short form above to reserve your place when registration is connected.
            </p>
            <button
              type="button"
              onClick={handleReserveSeat}
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-gradient-to-r from-[#ee2b91] to-[#7a1e7e] px-7 py-3.5 text-sm font-black uppercase tracking-[0.055em] text-white shadow-[0_12px_24px_rgba(176,24,124,0.2)] transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d51b75] focus-visible:ring-offset-4 active:scale-[0.97] sm:w-auto sm:text-base"
            >
              Reserve My Free Spot
            </button>
          </section>

          <p className="mx-auto mt-8 max-w-[860px] text-center text-[10px] leading-5 text-[#7a727a] sm:text-xs">
            This live webinar is for general educational purposes and is not a medical consultation. Individual treatment recommendations require an appropriate medical evaluation.
          </p>
        </div>

        <div data-webinar2-legal-footnote className="bg-[#f3f0eb] px-5 py-3 sm:px-8 sm:py-4">
          <p
            data-webinar2-testosterone-footnote
            className="mx-auto max-w-[860px] text-center text-[9px] font-medium leading-4 text-[#5f5760] sm:text-[10px]"
          >
            Testosterone is prescribed off-label for hypoactive sexual desire disorder in women. There is no FDA-approved testosterone product for women in the United States. [APPROVED AVAILABILITY DISCLAIMER]
          </p>
        </div>
      </article>
    </main>
  );
}
