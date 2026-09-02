import { Helmet } from "react-helmet-async";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  MessageCircle,
  MonitorPlay,
  Play,
  Radio,
  Star,
  Tag,
  UserRound,
  Video,
} from "lucide-react";
import { toast } from "sonner";

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

export default function LiveWebinar() {
  const handleReserveSeat = () => {
    toast.info("Registration details are coming soon.");
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

      <section className="relative isolate mx-auto w-full max-w-[1536px] overflow-hidden px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-8">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-70"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(circle at 6% 5%, rgba(232,51,158,0.05), transparent 24%), radial-gradient(circle at 90% 82%, rgba(122,30,126,0.05), transparent 25%)",
          }}
        />

        <div className="grid items-start gap-7 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 xl:gap-14">
          <div>
            <div className="flex items-center gap-3 text-[#b51c68]">
              <CalendarDays className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" aria-hidden="true" />
              <p className="text-[0.72rem] font-black uppercase tracking-[0.12em] sm:text-base sm:tracking-[0.09em]">
                Free Live Women&apos;s Health Webinar
              </p>
            </div>

            <div className="mt-5 text-center lg:mt-4">
              <div className="flex items-center justify-center gap-4 sm:gap-6">
                <span className="h-0.5 w-12 bg-gradient-to-r from-[#ec227f] to-[#7A1E7E] sm:w-20" aria-hidden="true" />
                <h1 className="text-[2.35rem] font-black uppercase leading-none tracking-[0.02em] text-[#10172a] sm:text-[3.7rem] lg:text-[4rem] xl:text-[4.35rem]">
                  Women Are
                </h1>
                <span className="h-0.5 w-12 bg-gradient-to-r from-[#ec227f] to-[#7A1E7E] sm:w-20" aria-hidden="true" />
              </div>

              <p className="mt-2 text-[1.36rem] font-extrabold leading-tight tracking-[-0.025em] text-black sm:text-[2.05rem] lg:text-[2rem] xl:text-[2.2rem]">
                Taking the Time to Understand
              </p>
              <p className="mt-2 bg-gradient-to-r from-[#ed0f78] via-[#c41483] to-[#301070] bg-clip-text text-[2.35rem] font-black uppercase leading-[0.95] tracking-[-0.035em] text-transparent sm:text-[3.75rem] lg:text-[3.55rem] xl:text-[4rem]">
                Perimenopause &amp;
                <span className="block">Menopause.</span>
              </p>
              <div className="relative mx-auto mt-1 w-fit px-6 pb-4">
                <p
                  className="relative z-10 -rotate-2 text-[3.4rem] leading-none text-[#10172a] sm:text-[5.2rem] lg:text-[4.8rem] xl:text-[5.3rem]"
                  style={{ fontFamily: "Brush Script MT, Segoe Script, cursive" }}
                >
                  Are You?
                </p>
                <span
                  className="absolute bottom-1 left-4 h-2 w-[88%] -rotate-3 rounded-full bg-gradient-to-r from-[#ef1378] to-[#d7148a]"
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-extrabold text-[#111827] sm:text-base">Do any of these sound familiar?</p>
              <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {symptoms.map(symptom => (
                  <div key={symptom} className="flex min-h-8 items-center gap-3 text-sm font-semibold text-[#131827] sm:text-[0.94rem]">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f8eff1] text-[#c9196f]">
                      <Check className="h-4 w-4 stroke-[3]" aria-hidden="true" />
                    </span>
                    <span>{symptom}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-4 rounded-xl bg-[#f4eeeb] px-4 py-3.5 sm:px-5">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f2e8e3] text-[#aa7742]">
                <Star className="h-7 w-7 fill-current" aria-hidden="true" />
              </span>
              <p className="text-sm font-bold leading-5 text-[#161827] sm:text-base sm:leading-6">
                Hormones are one of the biggest conversations in women&apos;s health today.
                <span className="text-[#d51b75]"> Come learn why.</span>
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-lg border border-[#eadfdd] bg-white/70 sm:grid-cols-4">
              <div className="flex min-h-16 items-center gap-2 border-b border-r border-[#eadfdd] px-3 py-3 sm:border-b-0">
                <CalendarDays className="h-5 w-5 shrink-0 text-[#c91972]" aria-hidden="true" />
                <span className="text-xs font-extrabold uppercase tracking-[0.04em]">[Date]</span>
              </div>
              <div className="flex min-h-16 items-center gap-2 border-b border-[#eadfdd] px-3 py-3 sm:border-b-0 sm:border-r">
                <Clock3 className="h-5 w-5 shrink-0 text-[#c91972]" aria-hidden="true" />
                <span className="text-xs font-extrabold uppercase tracking-[0.04em]">[Time]</span>
              </div>
              <div className="flex min-h-16 items-center gap-2 border-r border-[#eadfdd] px-3 py-3">
                <MonitorPlay className="h-5 w-5 shrink-0 text-[#c91972]" aria-hidden="true" />
                <span className="text-xs font-extrabold uppercase tracking-[0.04em]">Live Online</span>
              </div>
              <div className="flex min-h-16 items-center gap-2 px-3 py-3">
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

            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-extrabold uppercase tracking-[0.04em] text-[#252236] sm:text-xs">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#bf166d]" aria-hidden="true" /> Free to Attend
              </span>
              <span className="hidden h-5 w-px bg-[#c9aabb] sm:block" aria-hidden="true" />
              <span className="inline-flex items-center gap-2">
                <Radio className="h-4 w-4 text-[#bf166d]" aria-hidden="true" /> Live Online
              </span>
              <span className="hidden h-5 w-px bg-[#c9aabb] sm:block" aria-hidden="true" />
              <span className="inline-flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-[#bf166d]" aria-hidden="true" /> Live Q&amp;A
              </span>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-rows-[minmax(430px,1fr)_auto]">
            <div className="relative min-h-[360px] overflow-hidden rounded-[1.25rem] bg-[#251225] shadow-[0_22px_55px_rgba(48,17,46,0.20)] sm:min-h-[470px] lg:min-h-0">
              <div
                className="absolute inset-0"
                aria-hidden="true"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(35,10,27,0.30), rgba(21,8,24,0.68)), radial-gradient(circle at 72% 24%, rgba(226,67,150,0.38), transparent 30%), radial-gradient(circle at 23% 75%, rgba(105,38,104,0.55), transparent 40%), linear-gradient(135deg, #4a203f 0%, #1e1728 55%, #32152b 100%)",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 h-[45%] bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_100%] opacity-40" aria-hidden="true" />
              <div className="relative z-10 flex h-full min-h-[360px] flex-col items-center justify-center px-6 py-8 text-center text-white sm:min-h-[470px]">
                <button
                  type="button"
                  onClick={() => toast.info("The speaking-event video will be added after the hero design is approved.")}
                  className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-white text-[#111827] shadow-[0_14px_34px_rgba(0,0,0,0.28)] transition duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 active:scale-[0.97] sm:h-28 sm:w-28"
                  aria-label="Video placeholder"
                >
                  <Play className="ml-1 h-10 w-10 fill-current sm:h-12 sm:w-12" aria-hidden="true" />
                </button>
                <p className="mt-6 text-base font-black uppercase tracking-[0.09em] sm:text-xl">Video Placeholder</p>
                <p className="mt-2 max-w-[410px] text-xs font-semibold leading-5 text-white/70 sm:text-sm">
                  Speaking-event highlight video will be placed here.
                </p>
              </div>
            </div>

            <div className="grid items-center gap-5 rounded-[1.1rem] bg-[#f4eeeb] p-5 sm:grid-cols-[auto_1fr_auto] sm:gap-6 sm:p-6">
              <div className="mx-auto flex h-32 w-32 shrink-0 flex-col items-center justify-center rounded-full border border-[#e6d9da] bg-[#eee7e4] text-center text-[#9e416d] sm:mx-0 sm:h-36 sm:w-36">
                <UserRound className="h-10 w-10" aria-hidden="true" />
                <span className="mt-2 px-4 text-[9px] font-black uppercase leading-4 tracking-[0.08em]">Dr. Photo Placeholder</span>
              </div>

              <div>
                <p className="font-serif text-[1.8rem] font-bold leading-tight text-[#1e1730] sm:text-[2.25rem]">
                  Dr. Jumana Al-Deek <span className="text-lg font-medium">DO, MS</span>
                </p>
                <p className="mt-2 text-xs font-black uppercase tracking-[0.06em] text-[#b81768] sm:text-sm">
                  Menopause &amp; Medical Weight Loss Specialist
                </p>
                <div className="mt-4 space-y-2 border-t border-[#d8cdcd] pt-4 text-xs font-semibold leading-5 text-[#252236] sm:text-sm">
                  <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#c4156e]" aria-hidden="true" /> Board-Certified Family Physician</p>
                  <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#c4156e]" aria-hidden="true" /> Menopause Society Trained</p>
                  <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#c4156e]" aria-hidden="true" /> Author of <em>The Menopause Weight Loss Trap</em></p>
                </div>
              </div>

              <div className="mx-auto flex h-36 w-24 shrink-0 flex-col items-center justify-center rounded-md border border-[#dccfd2] bg-white px-2 text-center shadow-[0_10px_24px_rgba(71,30,50,0.12)] sm:mx-0">
                <Video className="h-7 w-7 text-[#bf176e]" aria-hidden="true" />
                <span className="mt-2 text-[9px] font-black uppercase leading-4 tracking-[0.08em] text-[#6d3150]">Book Image Placeholder</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-[920px] text-center text-[10px] leading-5 text-[#716b72] sm:text-xs">
          This live webinar is for general educational purposes and is not a medical consultation. Individual treatment recommendations require an appropriate medical evaluation.
        </p>
      </section>
    </main>
  );
}
