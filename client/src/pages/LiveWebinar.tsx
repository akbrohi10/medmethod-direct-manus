import { Helmet } from "react-helmet-async";
import { BookOpen, Play, ShieldCheck, Video } from "lucide-react";
import { toast } from "sonner";

export default function LiveWebinar() {
  const handleReserveSeat = () => {
    toast.info("Registration details are coming soon.");
  };

  return (
    <main
      className="min-h-screen overflow-hidden bg-[#f7f4f6] px-3 py-4 text-white sm:px-6 sm:py-7 lg:px-10 lg:py-9"
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

      <section className="mx-auto max-w-[1220px] overflow-hidden rounded-[1.65rem] border border-white/10 bg-[#071f35] shadow-[0_30px_90px_rgba(19,23,42,0.28)] sm:rounded-[2rem]">
        <div className="bg-gradient-to-r from-[#E8339E] via-[#bd278f] to-[#7A1E7E] px-4 py-2.5 text-center text-[10px] font-black uppercase tracking-[0.16em] text-white sm:text-xs sm:tracking-[0.24em]">
          Live Educational Webinar · Event Details Coming Soon
        </div>

        <div
          className="relative isolate overflow-hidden"
          style={{
            background:
              "radial-gradient(circle at 10% 26%, rgba(232,51,158,0.20), transparent 34%), radial-gradient(circle at 86% 72%, rgba(93,47,163,0.24), transparent 38%), linear-gradient(135deg, #092944 0%, #06192b 58%, #0b2037 100%)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-25" aria-hidden="true">
            <div className="absolute -left-32 top-16 h-96 w-96 rounded-full border border-white/20" />
            <div className="absolute -bottom-40 right-8 h-[28rem] w-[28rem] rounded-full border border-[#E8339E]/35" />
            <div className="absolute left-[46%] top-0 h-full w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />
          </div>

          <header className="px-5 pb-5 pt-6 text-center sm:px-8 sm:pb-7 sm:pt-8">
            <a
              href="/"
              className="mx-auto flex w-fit flex-col items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff59b7] focus-visible:ring-offset-4 focus-visible:ring-offset-[#071f35]"
              aria-label="MedMethod Direct home"
            >
              <span className="text-[1.25rem] font-black leading-none tracking-[-0.045em] text-white sm:text-[1.55rem]">
                Med<span className="text-[#ff55b5]">Method</span>
              </span>
              <span className="mt-1 text-[0.58rem] font-bold uppercase tracking-[0.37em] text-white/70 sm:text-[0.68rem]">
                Direct
              </span>
            </a>
            <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#9be7ef] sm:text-xs sm:tracking-[0.3em]">
              A live conversation with Dr. Jumana Al-Deek
            </p>
          </header>

          <div className="grid items-stretch gap-7 px-4 pb-6 sm:px-7 sm:pb-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-0 lg:px-10 lg:pb-10">
            <div className="relative min-h-[430px] overflow-hidden rounded-[1.35rem] border border-white/15 bg-[#151226] shadow-[0_24px_60px_rgba(0,0,0,0.30)] sm:min-h-[520px] lg:rounded-r-none lg:border-r-0">
              <div
                className="absolute inset-0"
                aria-hidden="true"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(9,24,43,0.12) 0%, rgba(10,14,28,0.44) 52%, rgba(11,9,23,0.90) 100%), radial-gradient(circle at 30% 18%, rgba(232,51,158,0.50), transparent 30%), radial-gradient(circle at 74% 50%, rgba(82,72,166,0.55), transparent 37%), linear-gradient(145deg, #1a2540 0%, #11162a 48%, #24132d 100%)",
                }}
              />
              <div className="absolute inset-0 opacity-25" aria-hidden="true">
                <div className="absolute -left-24 top-14 h-64 w-64 rounded-full border border-white/40" />
                <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full border border-[#ff62bc]/50" />
              </div>

              <div className="relative z-10 flex h-full min-h-[430px] flex-col items-center justify-between px-6 py-7 text-center sm:min-h-[520px] sm:px-8 sm:py-9">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/15 px-3.5 py-2 text-[9px] font-extrabold uppercase tracking-[0.22em] text-white/80 backdrop-blur-sm sm:text-[10px]">
                  <Video className="h-3.5 w-3.5" aria-hidden="true" />
                  Highlight Video Coming Soon
                </div>

                <p className="max-w-[460px] text-[1.75rem] font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-[2.45rem] lg:text-[2.65rem]">
                  Women are taking the <span className="font-black text-[#ff59b7]">TIME</span> to learn about
                  <span className="mt-2 block font-black uppercase leading-[0.98] text-white">
                    Perimenopause &amp; Menopause.
                  </span>
                  <span className="mt-4 block font-black italic text-[#ff69bd]">Are You?</span>
                </p>

                <button
                  type="button"
                  onClick={() => toast.info("The speaking-event video will be added after the hero design is approved.")}
                  className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/45 bg-white/12 text-white backdrop-blur-sm transition duration-200 hover:scale-105 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#151226] active:scale-[0.97] sm:h-16 sm:w-16"
                  aria-label="Speaking-event highlight video coming soon"
                >
                  <Play className="ml-1 h-6 w-6 fill-current sm:h-7 sm:w-7" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-[1.35rem] border border-white/15 bg-[#071a2d]/88 px-6 py-8 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-sm sm:px-9 sm:py-10 lg:rounded-l-none lg:px-11 lg:py-12">
              <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#75d8e6] sm:text-xs">
                Understand Your Next Chapter
              </span>

              <h1 className="mt-4 text-[2.05rem] font-black leading-[0.96] tracking-[-0.045em] text-white sm:text-[3.4rem] sm:leading-[0.94] sm:tracking-[-0.05em] lg:text-[4rem]">
                Making Sense of
                <span className="mt-2 block bg-gradient-to-r from-[#ff5ab8] via-[#e83ca5] to-[#a862e8] bg-clip-text text-transparent">
                  Perimenopause
                </span>
                <span className="mt-1 block">&amp; Menopause</span>
              </h1>

              <p className="mt-6 max-w-[590px] text-[0.98rem] font-medium leading-7 text-white/78 sm:text-lg sm:leading-8">
                Explore common symptoms, hormone therapy, GLP-1 medications, and what informed physician-led care should include.
              </p>

              <div className="mt-7 border-y border-white/12 py-5">
                <p className="text-base font-extrabold text-white sm:text-lg">Dr. Jumana Al-Deek, DO</p>
                <div className="mt-3 flex items-start gap-2.5 text-sm leading-6 text-white/72">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#ff59b7]" aria-hidden="true" />
                  <span>Board-Certified Physician · Menopause &amp; Medical Weight Loss</span>
                </div>
                <div className="mt-2 flex items-start gap-2.5 text-sm leading-6 text-white/72">
                  <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-[#75d8e6]" aria-hidden="true" />
                  <span>
                    Author of <em>The Menopause Weight Loss Trap</em>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReserveSeat}
                className="mt-7 inline-flex min-h-14 w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#f041aa] to-[#8a289c] px-7 py-4 text-sm font-black uppercase tracking-[0.08em] text-white shadow-[0_16px_34px_rgba(232,51,158,0.28)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(232,51,158,0.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff75c7] focus-visible:ring-offset-4 focus-visible:ring-offset-[#071a2d] active:scale-[0.97] sm:max-w-[360px]"
              >
                Reserve My Seat
              </button>
              <p className="mt-3 text-xs font-semibold text-white/55">
                Event date and registration details coming soon.
              </p>
            </div>
          </div>

          <div className="grid border-t border-white/10 bg-[#041726]/82 text-center sm:grid-cols-3">
            <div className="border-b border-white/10 px-5 py-4 sm:border-b-0 sm:border-r">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Physician-Led</p>
              <p className="mt-1 text-sm font-bold text-white">Live Education</p>
            </div>
            <div className="border-b border-white/10 px-5 py-4 sm:border-b-0 sm:border-r">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Focused On</p>
              <p className="mt-1 text-sm font-bold text-white">Midlife Women&apos;s Health</p>
            </div>
            <div className="px-5 py-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Registration</p>
              <p className="mt-1 text-sm font-bold text-white">Opening Soon</p>
            </div>
          </div>
        </div>

        <p className="bg-[#f7f4f6] px-5 py-4 text-center text-[11px] leading-5 text-[#706a73] sm:text-xs">
          This live webinar is for general educational purposes and is not a medical consultation. Individual treatment recommendations require an appropriate medical evaluation.
        </p>
      </section>
    </main>
  );
}
