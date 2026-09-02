import { Helmet } from "react-helmet-async";
import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  MessageCircle,
  MonitorPlay,
  Play,
  Star,
  Tag,
} from "lucide-react";
import ComplianceDisclosures from "@/components/ComplianceDisclosures";
import { toast } from "sonner";

const WEBINAR_VIDEO_URL = "/manus-storage/replacement-speaking-event-web_3c5c62ae.mp4";
const WEBINAR_VIDEO_POSTER_URL = "/manus-storage/replacement-speaking-event-poster_5353b331.jpg";
const BOOK_COVER_URL = "/manus-storage/menopause-weight-loss-trap-book-cover-transparent_02607d91.png";
const DOCTOR_HEADSHOT_URL = "/manus-storage/dr-jumana-al-deek-headshot_75912bc8.png";

const symptoms = [
  "Waking at 3 AM",
  "Low Energy",
  "Night Sweats",
  "Mood Changes",
  "Hot Flashes",
  "Weight Loss Feels Harder",
  "Stubborn Weight Gain",
  "Low Libido",
  "Brain Fog",
];

const learningPoints = [
  "What’s actually happening to your hormones during perimenopause and menopause—and why it can affect everything from sleep and mood to metabolism, muscle and belly fat.",
  "The truth about hormone therapy (HRT)—including estrogen, progesterone and testosterone, potential benefits and risks, and common misconceptions.",
  "Why losing weight can suddenly become harder after 40 even when you’re eating and exercising the same way you always have.",
  "How GLP-1 medications work and where medical weight loss may fit into your overall health strategy.",
  "The connection between hormones, menopause and weight management—and why treating the whole picture matters.",
  "What good menopause care should actually look like and the important questions you should be asking your physician.",
];

export default function LiveWebinar() {
  const videoShellRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  useEffect(() => {
    const shell = videoShellRef.current;
    const video = videoRef.current;
    if (!shell || !video) return;

    const webkitVideo = video as HTMLVideoElement & {
      webkitExitFullscreen?: () => void;
    };

    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const keepPlaybackInline = () => {
      webkitVideo.webkitExitFullscreen?.();
    };

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

  const handleReserveSeat = () => {
    toast.info("Registration details are coming soon.");
  };

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
      className="min-h-screen overflow-hidden bg-[#fbf9f5] text-[#0a1021]"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <Helmet>
        <title>Live Menopause Webinar with Dr. Jumana Al-Deek | MedMethod Direct</title>
        <meta
          name="description"
          content="A live educational webinar with Dr. Jumana Al-Deek about perimenopause, menopause, hormone therapy, and medical weight management."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://medmethoddirect.com/live-webinar" />
      </Helmet>

      <section className="relative isolate mx-auto w-full max-w-[1536px] overflow-hidden px-5 py-7 sm:px-8 sm:py-9 lg:px-12 lg:py-7">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-70"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(circle at 6% 5%, rgba(232,51,158,0.05), transparent 24%), radial-gradient(circle at 90% 82%, rgba(122,30,126,0.05), transparent 25%)",
          }}
        />

        <div
          data-webinar-zoom-rsvp-banner
          className="mb-6 overflow-hidden rounded-[1.2rem] bg-[#210442] px-4 py-4 text-white shadow-[0_18px_42px_rgba(126,20,105,0.22)] sm:bg-gradient-to-r sm:from-[#e91678] sm:via-[#c51682] sm:to-[#5a147e] sm:px-8 sm:py-5 lg:mb-7"
        >
          <div data-webinar-mobile-zoom-banner className="text-center sm:hidden">
            <p className="text-[1.65rem] font-black uppercase leading-none tracking-[-0.025em]">
              <span className="text-[#ff4f9d]">Live</span> on Zoom
            </p>
            <p className="mt-1.5 text-[2.55rem] font-black uppercase leading-[0.92] tracking-[-0.035em]">
              RSVP Now
            </p>
            <span className="mx-auto my-2.5 block h-px w-[88%] bg-[#ff4f9d]" aria-hidden="true" />
            <p className="text-[1.05rem] font-black uppercase leading-none tracking-[0.055em]">
              Save Your <span className="text-[#ff4f9d]">Free Spot!</span>
            </p>
          </div>

          <div data-webinar-desktop-zoom-banner className="mx-auto hidden max-w-[1180px] items-center justify-center gap-5 text-center sm:flex lg:gap-7">
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30 sm:h-12 sm:w-12">
                <MonitorPlay className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
              </span>
              <p className="text-[1.55rem] font-black uppercase leading-none tracking-[0.035em] sm:text-[1.9rem] lg:text-[2.15rem]">
                Live on Zoom
              </p>
            </div>
            <span className="h-10 w-px bg-white/35" aria-hidden="true" />
            <p className="text-sm font-extrabold uppercase leading-tight tracking-[0.075em] sm:text-lg lg:text-xl">
              RSVP Now <span className="px-1 text-white/70" aria-hidden="true">—</span> Save Your Free Spot
            </p>
          </div>
        </div>

        <div
          data-webinar-upper-row
          className="grid items-stretch gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 xl:gap-12"
        >
          <div data-webinar-headline className="flex flex-col">
            <div className="text-center lg:pt-3">
              <div className="flex items-center justify-center gap-3 sm:gap-5">
                <span className="h-0.5 w-8 shrink-0 bg-gradient-to-r from-[#ec227f] to-[#7A1E7E] sm:w-14" aria-hidden="true" />
                <h1 className="whitespace-nowrap text-[2.2rem] font-black uppercase leading-none tracking-[0.02em] text-[#10172a] sm:text-[3.35rem] lg:text-[3.45rem] xl:text-[3.9rem]">
                  Women Are
                </h1>
                <span className="h-0.5 w-8 shrink-0 bg-gradient-to-r from-[#ec227f] to-[#7A1E7E] sm:w-14" aria-hidden="true" />
              </div>

              <p className="mt-2 text-[1.25rem] font-extrabold leading-tight tracking-[-0.025em] text-black sm:text-[1.82rem] lg:text-[1.72rem] xl:text-[1.95rem]">
                Taking the Time to Understand
              </p>
              <p className="mt-2 bg-gradient-to-r from-[#ed0f78] via-[#c41483] to-[#301070] bg-clip-text text-[2.08rem] font-black uppercase leading-[0.95] tracking-[-0.035em] text-transparent sm:text-[3.25rem] lg:text-[3rem] xl:text-[3.45rem]">
                Perimenopause &amp;
                <span className="block">Menopause.</span>
              </p>
              <div className="relative mx-auto mt-1 w-fit px-6 pb-3">
                <p
                  className="relative z-10 -rotate-2 text-[3.25rem] leading-none text-[#10172a] sm:text-[4.75rem] lg:text-[4.2rem] xl:text-[4.75rem]"
                  style={{ fontFamily: "Brush Script MT, Segoe Script, cursive" }}
                >
                  Are You?
                </p>
                <span
                  className="absolute bottom-0.5 left-4 h-2 w-[88%] -rotate-3 rounded-full bg-gradient-to-r from-[#ef1378] to-[#d7148a]"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          <div
            ref={videoShellRef}
            data-webinar-video-shell
            className="relative min-h-[360px] overflow-hidden rounded-[1.25rem] bg-[#100913] shadow-[0_22px_55px_rgba(48,17,46,0.20)] sm:min-h-[470px] lg:min-h-[430px]"
          >
            <video
              ref={videoRef}
              data-webinar-video
              className="absolute inset-0 h-full w-full bg-[#100913] object-contain"
              controls
              controlsList="nodownload noremoteplayback nofullscreen"
              disablePictureInPicture
              disableRemotePlayback
              playsInline
              preload="metadata"
              poster={WEBINAR_VIDEO_POSTER_URL}
              aria-label="Dr. Jumana Al-Deek speaking with women at an educational event"
              onPlaying={() => setAutoplayBlocked(false)}
            >
              <source src={WEBINAR_VIDEO_URL} type="video/mp4" />
              Your browser does not support the video element.
            </video>
            {autoplayBlocked && (
              <button
                type="button"
                onClick={handlePlayWithSound}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#100913]/50 px-6 text-center text-white backdrop-blur-[1px] transition hover:bg-[#100913]/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white/70"
                aria-label="Play webinar video with sound"
              >
                <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white text-[#111827] shadow-[0_14px_34px_rgba(0,0,0,0.28)] sm:h-24 sm:w-24">
                  <Play className="ml-1 h-9 w-9 fill-current sm:h-11 sm:w-11" aria-hidden="true" />
                </span>
                <span className="text-sm font-black uppercase tracking-[0.08em] sm:text-base">Play Video With Sound</span>
              </button>
            )}
          </div>
        </div>

        <div
          data-webinar-symptoms
          className="mt-5 rounded-[1.1rem] border border-[#eadfdd] bg-white/65 px-5 py-4 shadow-[0_12px_30px_rgba(88,36,65,0.05)] sm:px-6"
        >
          <p className="text-sm font-extrabold text-[#111827] sm:text-base">Do any of these sound familiar?</p>
          <div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2.5 lg:grid-cols-3 xl:grid-cols-5">
            {symptoms.map(symptom => (
              <div key={symptom} className="flex min-h-7 items-center gap-2.5 text-xs font-semibold leading-4 text-[#131827] sm:text-[0.9rem]">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f8eff1] text-[#c9196f]">
                  <Check className="h-3.5 w-3.5 stroke-[3]" aria-hidden="true" />
                </span>
                <span>{symptom}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          data-webinar-lower-row
          className="mt-5 grid items-stretch gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 xl:gap-12"
        >
          <div className="order-2 grid items-center gap-5 rounded-[1.1rem] bg-[#f4eeeb] p-5 sm:grid-cols-[auto_1fr_auto] sm:gap-5 sm:p-6 lg:order-1">
            <div className="flex items-center gap-3 rounded-xl bg-[#fbf7f4] px-4 py-3 sm:col-span-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f2e8e3] text-[#aa7742]">
                <Star className="h-5 w-5 fill-current" aria-hidden="true" />
              </span>
              <p className="text-xs font-bold leading-5 text-[#161827] sm:text-sm">
                Hormones are one of the biggest conversations in women&apos;s health today.
                <span className="text-[#d51b75]"> Come learn why.</span>
              </p>
            </div>

            <div
              data-webinar-headshot
              className="mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-full border border-[#d6b9c2] bg-white sm:mx-0 sm:h-32 sm:w-32"
            >
              <img
                src={DOCTOR_HEADSHOT_URL}
                alt="Dr. Jumana Al-Deek"
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div>
              <p className="font-serif text-[1.7rem] font-bold leading-tight text-[#1e1730] sm:text-[2rem]">
                Dr. Jumana Al-Deek <span className="text-base font-medium">DO, MS</span>
              </p>
              <p className="mt-1.5 text-[11px] font-black uppercase tracking-[0.055em] text-[#b81768] sm:text-xs">
                Menopause &amp; Medical Weight Loss Specialist
              </p>
              <div className="mt-3 space-y-1.5 border-t border-[#d8cdcd] pt-3 text-[11px] font-semibold leading-4.5 text-[#252236] sm:text-xs">
                <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#c4156e]" aria-hidden="true" /> Board-Certified Family Physician</p>
                <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#c4156e]" aria-hidden="true" /> Menopause Society Trained</p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#c4156e]" aria-hidden="true" />
                  <span className="min-w-0"><span className="whitespace-nowrap">Author of</span>{" "}<em>The Menopause Weight Loss Trap</em></span>
                </p>
              </div>
            </div>

            <div
              data-webinar-book-cover
              className="mx-auto h-48 w-36 shrink-0 sm:mx-0 sm:h-52 sm:w-40"
            >
              <img
                src={BOOK_COVER_URL}
                alt="Cover of The Menopause Weight Loss Trap by Dr. Jumana Al-Deek"
                className="h-full w-full object-contain drop-shadow-[0_14px_18px_rgba(71,30,50,0.2)]"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div className="order-1 flex flex-col justify-center rounded-[1.1rem] border border-[#eadfdd] bg-white/78 p-5 shadow-[0_16px_38px_rgba(88,36,65,0.08)] sm:p-6 lg:order-2">
            <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-[#eadfdd] bg-white sm:grid-cols-4">
              <div className="flex min-h-14 items-center gap-2 border-b border-r border-[#eadfdd] px-3 py-3 sm:border-b-0">
                <CalendarDays className="h-5 w-5 shrink-0 text-[#c91972]" aria-hidden="true" />
                <span className="text-xs font-extrabold uppercase tracking-[0.04em]">[Date]</span>
              </div>
              <div className="flex min-h-14 items-center gap-2 border-b border-[#eadfdd] px-3 py-3 sm:border-b-0 sm:border-r">
                <Clock3 className="h-5 w-5 shrink-0 text-[#c91972]" aria-hidden="true" />
                <span className="text-xs font-extrabold uppercase tracking-[0.04em]">[Time]</span>
              </div>
              <div className="flex min-h-14 items-center gap-2 border-r border-[#eadfdd] px-3 py-3">
                <MonitorPlay className="h-5 w-5 shrink-0 text-[#c91972]" aria-hidden="true" />
                <span className="text-xs font-extrabold uppercase tracking-[0.04em]">Live Online</span>
              </div>
              <div className="flex min-h-14 items-center gap-2 px-3 py-3">
                <Tag className="h-5 w-5 shrink-0 text-[#c91972]" aria-hidden="true" />
                <span className="text-xs font-extrabold uppercase tracking-[0.04em]">Free</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReserveSeat}
              className="mt-4 inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-[#e91678] via-[#cc167f] to-[#501079] px-6 py-4 text-base font-black uppercase tracking-[0.08em] text-white shadow-[0_16px_34px_rgba(164,20,113,0.24)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(164,20,113,0.32)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d51b75] focus-visible:ring-offset-4 active:scale-[0.97] sm:text-xl"
            >
              Reserve My Free Spot
              <span className="text-2xl leading-none" aria-hidden="true">→</span>
            </button>

            <div className="mt-3 flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-[0.05em] text-[#252236]">
              <MessageCircle className="h-4 w-4 text-[#bf166d]" aria-hidden="true" />
              Live Q&amp;A Included
            </div>
          </div>
        </div>

        <p className="mx-auto mt-5 max-w-[920px] text-center text-[10px] leading-5 text-[#716b72] sm:text-xs">
          This live webinar is for general educational purposes and is not a medical consultation. Individual treatment recommendations require an appropriate medical evaluation.
        </p>
      </section>

      <section
        data-webinar-learning-section
        className="relative isolate border-t border-[#eadfdd] bg-[#fffdf9] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
      >
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-80"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(circle at 8% 18%, rgba(232,51,158,0.07), transparent 25%), radial-gradient(circle at 92% 72%, rgba(90,20,126,0.08), transparent 28%)",
          }}
        />

        <div className="mx-auto w-full max-w-[1360px]">
          <div data-webinar-learning-intro className="mx-auto max-w-[1040px] text-center">
            <h2 className="font-serif text-[2.5rem] font-bold leading-[1.02] tracking-[-0.035em] text-[#1e1730] sm:text-[3.6rem] lg:text-[4.25rem]">
              Understand What’s Really Happening to Your Body After 35
            </h2>
            <div className="mx-auto mt-6 h-1.5 w-24 rounded-full bg-gradient-to-r from-[#ed0f78] to-[#5a147e]" aria-hidden="true" />
            <p className="mx-auto mt-7 max-w-[960px] text-base font-medium leading-8 text-[#41394b] sm:text-lg">
              If you’re experiencing stubborn weight gain, belly fat, poor sleep, hot flashes, night sweats, brain fog, mood changes—or simply feel like your body isn’t responding the way it used to—there may be more happening than you realize.
            </p>
            <p className="mx-auto mt-4 max-w-[960px] text-base font-medium leading-8 text-[#41394b] sm:text-lg">
              Join Dr. Jumana Al-Deek for a <strong className="font-extrabold text-[#c51673]">FREE live webinar</strong> designed to cut through the confusion surrounding perimenopause, menopause, hormone therapy and medical weight loss—and help you understand what your options really are.
            </p>
          </div>

          <div
            data-webinar-learning-outcomes
            className="mt-12 overflow-hidden rounded-[1.5rem] bg-[#210442] p-6 text-white shadow-[0_28px_70px_rgba(55,13,78,0.20)] sm:p-9 lg:p-12"
          >
            <div className="flex flex-col gap-2 text-center sm:text-left">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ff63aa]">Live Educational Session</p>
              <h3 className="text-[2rem] font-black leading-tight tracking-[-0.025em] sm:text-[2.75rem]">What You’ll Learn</h3>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:gap-5">
              {learningPoints.map((point, index) => (
                <div
                  key={point}
                  data-webinar-learning-item
                  className="flex items-start gap-4 rounded-[1.1rem] border border-white/15 bg-white/[0.08] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
                >
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ff4f9d] text-sm font-black text-white shadow-[0_8px_18px_rgba(255,79,157,0.25)]">
                    <Check className="h-4 w-4 stroke-[3]" aria-hidden="true" />
                    <span className="sr-only">Learning point {index + 1}</span>
                  </span>
                  <p className="text-sm font-semibold leading-6 text-white/95 sm:text-[0.96rem]">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <div data-webinar-informed-message className="rounded-[1.35rem] border border-[#eadfdd] bg-white p-6 shadow-[0_16px_42px_rgba(88,36,65,0.08)] sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c91972]">Most Importantly</p>
              <h3 className="mt-2 font-serif text-[2.1rem] font-bold leading-tight text-[#1e1730] sm:text-[2.65rem]">Become Informed.</h3>
              <p className="mt-4 text-base font-medium leading-7 text-[#41394b]">
                The goal isn’t to tell you what treatment you should choose. It’s to give you the knowledge to understand your body, know your options, and make more informed decisions about your care.
              </p>
            </div>

            <div data-webinar-live-qa className="rounded-[1.35rem] border border-[#eadfdd] bg-[#f7efec] p-6 shadow-[0_16px_42px_rgba(88,36,65,0.07)] sm:p-8">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#c91972] shadow-[0_8px_20px_rgba(88,36,65,0.10)]">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-[1.55rem] font-black leading-tight text-[#1e1730] sm:text-[2rem]">PLUS: Live Q&amp;A with Dr. Al-Deek</h3>
              <p className="mt-3 text-base font-medium leading-7 text-[#41394b]">
                Bring your questions and get the opportunity to ask Dr. Al-Deek directly.
              </p>
            </div>
          </div>

          <div
            data-webinar-final-rsvp
            className="mt-8 overflow-hidden rounded-[1.5rem] bg-gradient-to-r from-[#e91678] via-[#bd177f] to-[#541078] px-6 py-9 text-center text-white shadow-[0_24px_60px_rgba(164,20,113,0.24)] sm:px-10 sm:py-11"
          >
            <p className="text-xs font-black uppercase tracking-[0.14em] text-white/90 sm:text-sm">
              Free Live Webinar <span className="px-1.5 text-white/55" aria-hidden="true">•</span> Limited to the First 100 RSVPs
            </p>
            <h3 className="mx-auto mt-3 max-w-[760px] text-[2rem] font-black uppercase leading-tight tracking-[-0.025em] sm:text-[3.25rem]">
              Reserve Your Free Spot
            </h3>
            <button
              type="button"
              onClick={handleReserveSeat}
              className="mx-auto mt-6 inline-flex min-h-14 w-full max-w-[520px] items-center justify-center gap-3 rounded-lg bg-white px-7 py-4 text-sm font-black uppercase tracking-[0.08em] text-[#7a1e7e] shadow-[0_14px_32px_rgba(37,5,52,0.22)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(37,5,52,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#7a1e7e] active:scale-[0.97] sm:text-lg"
            >
              Reserve Your Free Spot
              <span className="text-xl leading-none" aria-hidden="true">→</span>
            </button>
            <p className="mt-3 text-xs font-semibold text-white/80">Registration details are coming soon.</p>
          </div>
        </div>
      </section>

      <ComplianceDisclosures testosteroneForWomen />
    </main>
  );
}
