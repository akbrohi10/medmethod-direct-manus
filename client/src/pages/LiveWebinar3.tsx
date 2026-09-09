import { Helmet } from "react-helmet-async";
import { useEffect, useRef, useState } from "react";
import { Clock3, Play, Volume2 } from "lucide-react";
import WebinarRegistrationDialog from "@/components/WebinarRegistrationDialog";

const WEBINAR_VIDEO_URL = "/manus-storage/replacement-speaking-event-web_3c5c62ae.mp4";
const WEBINAR_VIDEO_POSTER_URL = "/manus-storage/replacement-speaking-event-poster_5353b331.jpg";
const WEBINAR_VIDEO_CAPTIONS_VTT = [
  "WEBVTT",
  "",
  "00:00:00.300 --> 00:00:01.900",
  "My name is Dr. Jumana Al-Deek.",
  "",
  "00:00:01.900 --> 00:00:10.300",
  "I'm a board-certified doctor, family medicine physician,",
  "and I specialize in menopause, medical weight loss, and metabolism.",
  "",
  "00:00:22.500 --> 00:00:28.800",
  "A lot of women—an entire generation of women—",
  "have been scared off hormone therapy because of this one.",
  "",
  "00:00:28.800 --> 00:00:32.700",
  "A lot of women have thought that hormone therapy causes cancer.",
  "",
  "00:00:32.700 --> 00:00:42.800",
  "So back in 2002, there was a study by the Women's Health Initiative,",
  "WHI for short, and they looked at women.",
  "",
  "00:00:42.800 --> 00:00:45.700",
  "There were a couple things wrong with the study.",
  "I'm going to point out the first one.",
  "",
  "00:00:45.700 --> 00:00:52.400",
  "They were looking at women who are much older than the general population",
  "that we start hormone therapy in.",
  "",
  "00:00:52.400 --> 00:01:04.900",
  "Number two, they also studied these women—the actual hormone they looked at",
  "was a pill, an estrogen pill, and this pill was from horse urine.",
  "",
  "00:01:04.900 --> 00:01:09.400",
  "You don't have to wait until you're in menopause",
  "to get on hormone therapy.",
  "",
  "00:01:09.400 --> 00:01:14.700",
  "The idea is to get on it while you're going through perimenopause,",
  "so the transition is seamless.",
  "",
  "00:01:14.700 --> 00:01:19.600",
  "This was amazing.",
  "",
  "00:01:19.600 --> 00:01:20.000",
  "Wow!",
].join("\n");
const WEBINAR_VIDEO_CAPTIONS_SRC = `data:text/vtt;charset=utf-8,${encodeURIComponent(WEBINAR_VIDEO_CAPTIONS_VTT)}`;
const LIVE_WEBINAR3_HANDOFF_STORAGE_KEY = "medmethod:live-webinar3-confirmation-handoff";

// Confirmed event time: September 16, 2026 at 7:00 PM Eastern Daylight Time.
const WEBINAR_EVENT = {
  startsAt: "2026-09-16T19:00:00-04:00" as string | null,
  dateTimeDisplay: "WEDNESDAY, SEPTEMBER 16 · 7:00 PM ET",
  timezone: "ET",
};

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

export default function LiveWebinar3() {
  const videoShellRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [hasVideoStarted, setHasVideoStarted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [activeCaption, setActiveCaption] = useState<string | null>(null);
  const [countdownUnits, setCountdownUnits] = useState(() => getCountdownUnits(WEBINAR_EVENT.startsAt));
  const [registrationOpen, setRegistrationOpen] = useState(false);

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
    video.muted = false;
    video.defaultMuted = false;
    setVideoMuted(false);

    const captionElement = video.querySelector<HTMLTrackElement>("track[kind='captions']");
    const syncActiveCaption = () => {
      const captionTrack = video.textTracks[0];
      const text = Array.from(captionTrack?.activeCues ?? [])
        .map(cue => (cue as VTTCue).text)
        .join(" ");
      setActiveCaption(text || null);
    };
    const prepareCaptionTrack = () => {
      const captionTrack = video.textTracks[0];
      if (!captionTrack) return;
      // The branded overlay below makes captions consistently visible across
      // browsers; retain the native track in hidden mode for timed cue support.
      captionTrack.mode = "hidden";
      syncActiveCaption();
    };

    prepareCaptionTrack();
    captionElement?.addEventListener("load", prepareCaptionTrack);
    video.addEventListener("timeupdate", syncActiveCaption);
    video.addEventListener("seeked", syncActiveCaption);

    const keepPlaybackInline = () => webkitVideo.webkitExitFullscreen?.();
    video.addEventListener("webkitbeginfullscreen", keepPlaybackInline);

    const attemptPlayback = async () => {
      video.muted = false;
      video.defaultMuted = false;
      setVideoMuted(false);

      try {
        await video.play();
        setAutoplayBlocked(false);
        setHasVideoStarted(true);
      } catch {
        // Some browsers require a user gesture for audible autoplay. Keep the
        // motion available by retrying muted, then expose a clear sound control.
        video.muted = true;
        video.defaultMuted = true;
        setVideoMuted(true);

        try {
          await video.play();
          setAutoplayBlocked(false);
          setHasVideoStarted(true);
        } catch {
          setAutoplayBlocked(true);
        }
      }
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
      captionElement?.removeEventListener("load", prepareCaptionTrack);
      video.removeEventListener("timeupdate", syncActiveCaption);
      video.removeEventListener("seeked", syncActiveCaption);
    };
  }, []);

  const handleReserveSeat = () => {
    try {
      window.sessionStorage.setItem(LIVE_WEBINAR3_HANDOFF_STORAGE_KEY, String(Date.now()));
    } catch {
      // The trusted postMessage path remains available when session storage is unavailable.
    }
    setRegistrationOpen(true);
  };

  const handleRegistrationOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      try {
        window.sessionStorage.removeItem(LIVE_WEBINAR3_HANDOFF_STORAGE_KEY);
      } catch {
        // Session storage can be unavailable in privacy-restricted contexts.
      }
    }
    setRegistrationOpen(nextOpen);
  };

  const handlePlayWithSound = async () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    video.muted = false;
    video.defaultMuted = false;
    try {
      await video.play();
      setAutoplayBlocked(false);
      setHasVideoStarted(true);
      setVideoMuted(false);
    } catch {
      setAutoplayBlocked(true);
    }
  };

  const handleEnableSound = async () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    video.muted = false;
    video.defaultMuted = false;
    try {
      await video.play();
      setAutoplayBlocked(false);
      setHasVideoStarted(true);
      setVideoMuted(false);
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
              Free Live Zoom Webinar
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

        <section data-webinar3-top-video className="bg-[#fff8fb] px-5 pt-2 pb-6 sm:px-10 sm:pt-3 sm:pb-8 lg:px-14">
          <div
            ref={videoShellRef}
            data-webinar2-video-shell
            className="relative mx-auto aspect-video w-full max-w-[800px] overflow-hidden rounded-[1.45rem] border-[3px] border-white bg-[#1b1022] shadow-[0_20px_50px_rgba(123,28,104,0.25)] ring-1 ring-[#e1c7d6] sm:rounded-[1.7rem]"
          >
            <video
              ref={videoRef}
              className="h-full w-full bg-black object-cover"
              autoPlay
              controls
              playsInline
              preload="auto"
              poster={WEBINAR_VIDEO_POSTER_URL}
              aria-label="Dr. Jumana Al-Deek speaking at a women’s health educational event"
              controlsList="nodownload noremoteplayback nofullscreen"
              disablePictureInPicture
              disableRemotePlayback
              onPlay={() => setHasVideoStarted(true)}
              onVolumeChange={event => setVideoMuted(event.currentTarget.muted)}
            >
              <source src={WEBINAR_VIDEO_URL} type="video/mp4" />
              <track
                data-webinar2-video-captions
                kind="captions"
                src={WEBINAR_VIDEO_CAPTIONS_SRC}
                srcLang="en"
                label="English"
              />
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

            {hasVideoStarted && videoMuted && !autoplayBlocked && (
              <button
                data-webinar3-unmute-overlay
                type="button"
                onClick={handleEnableSound}
                aria-label="Restart video from the beginning with sound"
                className="absolute inset-0 z-10 grid place-items-center bg-[#26183b]/25 p-4 text-center backdrop-blur-[1px] transition hover:bg-[#26183b]/32 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white/90"
              >
                <span className="flex max-w-[17rem] flex-col items-center rounded-[1.4rem] border border-white/20 bg-[#241044]/88 px-5 py-5 text-white shadow-[0_16px_34px_rgba(40,16,74,0.35)] sm:max-w-[23rem] sm:px-8 sm:py-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/16 sm:h-14 sm:w-14">
                    <Volume2 className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
                  </span>
                  <span className="mt-3 text-base font-black leading-tight sm:text-xl">Your video is playing</span>
                  <span className="mt-1 text-sm font-bold text-white/88 sm:text-base">Tap to start with sound</span>
                </span>
              </button>
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
          {activeCaption && (
            <div
              data-webinar3-caption-bar
              aria-live="polite"
              aria-atomic="true"
              className="mx-auto mt-3 flex w-full max-w-[800px] justify-center px-1 sm:mt-4"
            >
              <span className="inline-flex max-w-full items-center justify-center rounded-lg border border-[#e5cad9] bg-white px-3 py-2 text-center text-xs font-bold leading-snug text-[#321d38] shadow-[0_7px_16px_rgba(89,31,84,0.12)] sm:px-4 sm:text-sm">
                {activeCaption}
              </span>
            </div>
          )}
        </section>

        <section data-webinar3-primary-cta className="bg-[#fff8fb] px-5 pt-0 pb-8 text-center sm:px-10 sm:pb-10 lg:px-14">
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

        <div data-webinar3-short-footer className="px-5 pt-7 pb-10 sm:px-10 sm:pt-8 sm:pb-12 lg:px-16 lg:pb-14">
          <p className="mx-auto max-w-[860px] text-center text-[10px] leading-5 text-[#7a727a] sm:text-xs">
            This live webinar is for general educational purposes and is not a medical consultation. Individual treatment recommendations require an appropriate medical evaluation.
          </p>

          <footer
            data-webinar2-legitscript-footer
            className="mx-auto mt-8 flex max-w-[940px] justify-center border-t border-[#ece4e9] pt-7 sm:mt-10 sm:pt-8"
          >
            <a
              href="https://www.legitscript.com/websites/?checker_keywords=medmethoddirect.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Verify LegitScript Approval for www.medmethoddirect.com"
              aria-label="Verify LegitScript Approval for www.medmethoddirect.com"
              className="inline-flex rounded-md transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75c943] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fff7f5]"
            >
              <img
                src="/manus-storage/legitscript-certified-seal-51795425_51edddb5.png"
                alt="Verify Approval for www.medmethoddirect.com"
                width="73"
                height="79"
                loading="eager"
                decoding="async"
              />
            </a>
          </footer>
        </div>
      </article>
      <WebinarRegistrationDialog
        open={registrationOpen}
        onOpenChange={handleRegistrationOpenChange}
        confirmationPath="/live-webinar3-confirmed"
      />
    </main>
  );
}
