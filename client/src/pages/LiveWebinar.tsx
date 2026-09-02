import { Helmet } from "react-helmet-async";
import { BookOpen, Play, ShieldCheck, Video } from "lucide-react";
import { toast } from "sonner";

export default function LiveWebinar() {
  const handleReserveSeat = () => {
    toast.info("Registration details are coming soon.");
  };

  return (
    <main
      className="min-h-screen overflow-hidden bg-[#fbf8fa] text-[#171523]"
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

      <section className="relative isolate flex min-h-screen flex-col">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(circle at 12% 22%, rgba(232,51,158,0.10), transparent 31%), radial-gradient(circle at 90% 74%, rgba(122,30,126,0.11), transparent 34%), linear-gradient(180deg, #fffdfd 0%, #fbf8fa 100%)",
          }}
        />

        <header className="px-5 pt-5 sm:px-8 sm:pt-7">
          <a
            href="/"
            className="mx-auto flex w-fit flex-col items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8339E] focus-visible:ring-offset-4"
            aria-label="MedMethod Direct home"
          >
            <span className="text-[1.32rem] font-black leading-none tracking-[-0.045em] text-[#171523] sm:text-[1.55rem]">
              Med<span className="text-[#E8339E]">Method</span>
            </span>
            <span className="mt-1 text-[0.64rem] font-bold uppercase tracking-[0.35em] text-[#4b4653] sm:text-[0.7rem]">
              Direct
            </span>
          </a>
        </header>

        <div className="mx-auto flex w-full max-w-[1240px] flex-1 items-center px-5 py-8 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
          <div className="grid w-full items-center gap-9 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14">
            <div className="mx-auto max-w-[590px] text-center lg:mx-0 lg:text-left">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E8339E]/20 bg-white px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#9a267f] shadow-sm sm:text-xs">
                <Video className="h-4 w-4" aria-hidden="true" />
                Live Educational Webinar
              </div>

              <h1 className="text-[2.35rem] font-black leading-[0.98] tracking-[-0.045em] text-[#151321] sm:text-5xl lg:text-[4rem]">
                Making Sense of
                <span className="mt-2 block bg-gradient-to-r from-[#E8339E] to-[#6a1b84] bg-clip-text text-transparent">
                  Menopause
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-[570px] text-base font-medium leading-7 text-[#514d5e] sm:text-lg sm:leading-8 lg:mx-0">
                A live conversation about perimenopause and menopause, hormone therapy,
                medical weight management, and what thoughtful physician-led care should include.
              </p>

              <div className="mx-auto mt-6 max-w-[560px] rounded-2xl border border-[#eadde7] bg-white/85 p-4 text-left shadow-[0_14px_45px_rgba(74,31,70,0.07)] lg:mx-0">
                <p className="text-sm font-extrabold text-[#1e1a28] sm:text-base">
                  Dr. Jumana Al-Deek, DO
                </p>
                <div className="mt-2 flex items-start gap-2 text-sm leading-6 text-[#625d6b]">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#E8339E]" aria-hidden="true" />
                  <span>Board-Certified Physician · Menopause &amp; Medical Weight Loss</span>
                </div>
                <div className="mt-1.5 flex items-start gap-2 text-sm leading-6 text-[#625d6b]">
                  <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-[#7A1E7E]" aria-hidden="true" />
                  <span>
                    Author of <em>The Menopause Weight Loss Trap</em>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReserveSeat}
                className="mt-7 inline-flex min-h-14 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] px-7 py-4 text-sm font-extrabold uppercase tracking-[0.08em] text-white shadow-[0_16px_35px_rgba(179,36,139,0.25)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(179,36,139,0.32)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8339E] focus-visible:ring-offset-4 active:scale-[0.97] sm:w-auto sm:min-w-[260px]"
              >
                Reserve My Seat
              </button>
              <p id="webinar-registration-status" className="mt-3 text-xs font-semibold text-[#78727f]">
                Event date and registration details coming soon.
              </p>
            </div>

            <div className="mx-auto w-full max-w-[720px]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-[#eadce8] bg-[#1d1222] shadow-[0_28px_80px_rgba(51,21,55,0.22)] sm:aspect-video sm:rounded-[2rem]">
                <div
                  className="absolute inset-0"
                  aria-hidden="true"
                  style={{
                    background:
                      "radial-gradient(circle at 22% 20%, rgba(232,51,158,0.42), transparent 32%), radial-gradient(circle at 82% 78%, rgba(122,30,126,0.65), transparent 38%), linear-gradient(135deg, #231329 0%, #140f1c 62%, #29152f 100%)",
                  }}
                />
                <div className="absolute inset-0 opacity-20" aria-hidden="true">
                  <div className="absolute -left-16 top-7 h-52 w-52 rounded-full border border-white/35" />
                  <div className="absolute -bottom-20 right-4 h-64 w-64 rounded-full border border-white/25" />
                  <div className="absolute left-[18%] top-[22%] h-px w-[64%] bg-gradient-to-r from-transparent via-white to-transparent" />
                </div>

                <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 py-7 text-center sm:px-10">
                  <span className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.28em] text-white/70 sm:text-xs">
                    Highlight Video Coming Soon
                  </span>
                  <p className="max-w-[620px] text-[1.45rem] font-semibold leading-[1.14] tracking-[-0.025em] text-white sm:text-[2.05rem] lg:text-[2.35rem]">
                    Women are taking the <span className="font-black text-[#ff5ab5]">TIME</span> to learn about
                    <span className="mt-1 block font-black uppercase leading-[1.02] text-white">
                      Perimenopause &amp; Menopause.
                    </span>
                    <span className="mt-2 block font-black italic text-[#ff69bb]">Are You?</span>
                  </p>

                  <button
                    type="button"
                    onClick={() => toast.info("The webinar highlight video will be added after the hero design is approved.")}
                    className="mt-5 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/35 bg-white/12 text-white backdrop-blur-sm transition duration-200 hover:scale-105 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1d1222] active:scale-[0.97] sm:h-14 sm:w-14"
                    aria-label="Webinar highlight video coming soon"
                  >
                    <Play className="ml-0.5 h-5 w-5 fill-current sm:h-6 sm:w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <p className="mt-4 px-3 text-center text-xs leading-5 text-[#716b77]">
                This live webinar is for general educational purposes and is not a medical consultation.
                Individual treatment recommendations require an appropriate medical evaluation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
