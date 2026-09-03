import { Helmet } from "react-helmet-async";
import { useEffect, useRef, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, MessageCircle, Play } from "lucide-react";
import { toast } from "sonner";

const WEBINAR_VIDEO_URL = "/manus-storage/replacement-speaking-event-web_3c5c62ae.mp4";
const WEBINAR_VIDEO_POSTER_URL = "/manus-storage/replacement-speaking-event-poster_5353b331.jpg";

const learningPoints = [
  "What’s actually happening to your hormones during perimenopause and menopause—and why it can affect everything from sleep and mood to metabolism, muscle and belly fat.",
  "The truth about hormone therapy (HRT)—including estrogen, progesterone and testosterone, potential benefits and risks, and common misconceptions.",
  "Why losing weight can suddenly become harder after 40 even when you’re eating and exercising the same way you always have.",
  "How GLP-1 medications work and where medical weight loss may fit into your overall health strategy.",
  "The connection between hormones, menopause and weight management—and why treating the whole picture matters.",
  "What good menopause care should actually look like and the important questions you should be asking your physician.",
];

const featuredOutlets = [
  { name: "Flow Space", logo: "/manus-storage/flow-space-white_beb898dc.png" },
  { name: "SingleCare", logo: "/manus-storage/singlecare-white_500a5691.png" },
  { name: "NTD", logo: "/manus-storage/ntd-white_dd8e5f55.png" },
  { name: "Scary Mommy", logo: "/manus-storage/scary-mommy-white_b136c1bf.png" },
  { name: "Daily Mail", logo: "/manus-storage/daily-mail-white_bc1019ba.png" },
  { name: "Yahoo Health", logo: "/manus-storage/yahoo-health-white_125ff57a.png" },
];

const placeholderCountdown = [
  { value: "00", label: "Days" },
  { value: "00", label: "Hours" },
  { value: "00", label: "Minutes" },
  { value: "00", label: "Seconds" },
];

export default function LiveWebinar2() {
  const videoShellRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

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
      playback?.then(() => setAutoplayBlocked(false)).catch(() => setAutoplayBlocked(true));
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

  const handleReserveSeat = () => toast.info("Registration details are coming soon.");

  const handlePlayWithSound = async () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    try {
      await video.play();
      setAutoplayBlocked(false);
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
        className="mx-auto w-full max-w-[1180px] overflow-hidden bg-white shadow-[0_24px_70px_rgba(42,25,54,0.13)] sm:rounded-[1.4rem]"
      >
        <header className="border-b-2 border-[#d8a94f] bg-[#231f2d] px-5 py-4 text-white sm:px-10 sm:py-5">
          <div className="mx-auto flex max-w-[1020px] items-center justify-between gap-4">
            <div aria-label="MedMethod Direct" className="leading-none">
              <p className="text-lg font-black tracking-[-0.04em] sm:text-xl">
                Med<span className="text-[#e8339e]">Method</span>
              </p>
              <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.34em] text-white/75">Direct</p>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#e8c77e] sm:text-[11px]">
              Live Education
            </p>
          </div>
        </header>

        <div className="px-5 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          <section data-webinar2-hero className="mx-auto max-w-[1000px] text-center">
            <p className="text-sm font-bold underline decoration-[#d8a94f] decoration-2 underline-offset-4 sm:text-base">
              Free Live Webinar
            </p>
            <h1 className="mx-auto mt-6 max-w-[940px] text-[2rem] font-medium leading-[1.12] tracking-[-0.035em] text-[#26242c] sm:text-[3rem] lg:text-[3.65rem]">
              Understand What’s Really Happening to Your Body <strong className="font-black">After 35.</strong>
            </h1>
            <p className="mx-auto mt-5 max-w-[880px] text-sm font-semibold leading-6 text-[#4b4750] sm:text-lg sm:leading-8">
              Perimenopause, menopause, hormone therapy and medical weight loss—explained clearly by Dr. Jumana Al-Deek.
            </p>
            <button
              type="button"
              onClick={handleReserveSeat}
              className="mt-7 inline-flex min-h-14 items-center justify-center rounded-md bg-gradient-to-r from-[#ee2b91] to-[#7a1e7e] px-7 py-4 text-sm font-black uppercase tracking-[0.055em] text-white shadow-[0_14px_28px_rgba(176,24,124,0.25)] transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d51b75] focus-visible:ring-offset-4 active:scale-[0.97] sm:text-lg"
            >
              Yes — Reserve My Free Spot
            </button>
          </section>

          <section
            data-webinar2-event-row
            className="mx-auto mt-10 grid max-w-[920px] gap-7 border-y border-dashed border-[#d8a94f]/65 py-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-10"
          >
            <div className="flex items-center justify-center gap-5 lg:justify-start">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#faf3f8] text-[#c61a79]">
                <CalendarDays className="h-7 w-7" aria-hidden="true" />
              </span>
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#8a7f88]">Live on Zoom</p>
                <p className="mt-2 text-base font-black text-[#27242d]">[DATE] · [TIME]</p>
              </div>
            </div>

            <div data-webinar2-countdown-placeholder>
              <div className="mb-3 flex items-center justify-center gap-2 text-center lg:justify-end">
                <Clock3 className="h-4 w-4 text-[#c61a79]" aria-hidden="true" />
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7d707b]">
                  Countdown Placeholder · Preview Only
                </p>
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {placeholderCountdown.map(unit => (
                  <div key={unit.label} className="text-center">
                    <div className="rounded-md bg-[#29252f] px-2 py-3 text-xl font-black tabular-nums text-white sm:text-2xl">
                      {unit.value}
                    </div>
                    <p className="mt-1.5 text-[8px] font-bold uppercase tracking-[0.08em] text-[#817781] sm:text-[9px]">
                      {unit.label}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-center text-[9px] leading-4 text-[#928994] lg:text-right">
                Activates when the webinar date and time are confirmed.
              </p>
            </div>
          </section>

          <section
            data-webinar2-content-split
            className="mx-auto mt-12 grid max-w-[980px] gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-12"
          >
            <div
              ref={videoShellRef}
              data-webinar2-video-shell
              className="relative mx-auto aspect-square w-full max-w-[430px] overflow-hidden rounded-lg bg-[#1b1022] shadow-[0_18px_42px_rgba(48,22,54,0.2)]"
            >
              <video
                ref={videoRef}
                className="h-full w-full bg-black object-contain"
                controls
                playsInline
                preload="metadata"
                poster={WEBINAR_VIDEO_POSTER_URL}
                aria-label="Dr. Jumana Al-Deek speaking at a women’s health educational event"
                controlsList="nodownload noremoteplayback nofullscreen"
                disablePictureInPicture
                disableRemotePlayback
              >
                <source src={WEBINAR_VIDEO_URL} type="video/mp4" />
                Your browser does not support embedded video playback.
              </video>

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

            <div data-webinar2-learning>
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
                className="mt-7 inline-flex min-h-13 w-full items-center justify-center rounded-md bg-gradient-to-r from-[#ee2b91] to-[#7a1e7e] px-6 py-3.5 text-sm font-black uppercase tracking-[0.055em] text-white shadow-[0_12px_24px_rgba(176,24,124,0.2)] transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d51b75] focus-visible:ring-offset-4 active:scale-[0.97] sm:w-auto sm:text-base"
              >
                Reserve My Free Spot
              </button>
            </div>
          </section>

          <div className="mx-auto mt-12 grid max-w-[980px] gap-4 border-t border-[#ece4e9] pt-8 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
            <div>
              <p className="text-sm font-black text-[#29252f]">Become informed—not pressured.</p>
              <p className="mt-2 max-w-[720px] text-xs leading-5 text-[#716a73] sm:text-sm sm:leading-6">
                The goal is to help you understand your body, know your options, and make more informed decisions about your care.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-md bg-[#faf4f8] px-4 py-3 text-sm font-bold text-[#4b3149]">
              <MessageCircle className="h-5 w-5 text-[#d51b75]" aria-hidden="true" />
              Live Q&amp;A with Dr. Al-Deek
            </div>
          </div>

          <p className="mx-auto mt-8 max-w-[860px] text-center text-[10px] leading-5 text-[#7a727a] sm:text-xs">
            This live webinar is for general educational purposes and is not a medical consultation. Individual treatment recommendations require an appropriate medical evaluation.
          </p>

        </div>

        <footer
          data-webinar2-featured-in
          className="bg-gradient-to-r from-[#25134f] via-[#5b3aa4] to-[#2d185d] px-5 py-5 text-white sm:px-8 sm:py-6"
        >
          <div className="mx-auto max-w-[1020px]">
            <div className="flex items-center justify-center gap-3 sm:gap-5">
              <span className="h-px w-9 bg-white/55 sm:w-20" aria-hidden="true" />
              <h2 className="shrink-0 text-sm font-black uppercase tracking-[0.16em] text-white sm:text-base">
                Featured In
              </h2>
              <span className="h-px w-9 bg-white/55 sm:w-20" aria-hidden="true" />
            </div>
            <div className="mt-3 grid grid-cols-3 items-center gap-x-5 gap-y-4 sm:grid-cols-6 sm:gap-x-7 lg:gap-x-10">
              {featuredOutlets.map(outlet => (
                <div key={outlet.name} className="flex h-11 min-w-0 items-center justify-center sm:h-12 lg:h-14">
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

            <p
              data-webinar2-testosterone-footnote
              className="mx-auto mt-4 max-w-[860px] border-t border-white/15 pt-3 text-center text-[9px] font-medium leading-4 text-white/80 sm:text-[10px]"
            >
              Testosterone is prescribed off-label for hypoactive sexual desire disorder in women. There is no FDA-approved testosterone product for women in the United States. This treatment is available only to patients in Florida.
            </p>
          </div>
        </footer>
      </article>
    </main>
  );
}
