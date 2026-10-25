import { useEffect, useRef, useState } from "react";
import { MessageCircleMore, PhoneCall, Video } from "lucide-react";
import VideoVisitCheckout from "@/components/masterclass2/VideoVisitCheckout";

/** V2-only mobile connection bar; reuses the existing $39 checkout unchanged. */
export default function WeightLossMenopauseV2MobileBar() {
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [pastHeroCta, setPastHeroCta] = useState(false);
  const mobileBookingRef = useRef<HTMLButtonElement>(null);
  const mobileBookingOpened = useRef(false);

  useEffect(() => {
    const heroCta = document.querySelector<HTMLElement>(".wlm-v2-content .hero-actions .btn");
    const header = document.querySelector<HTMLElement>(".wlm-v2-page > header");
    const desktop = window.matchMedia("(min-width: 768px)");
    const viewport = window.visualViewport;
    let frame: number | null = null;
    let disposed = false;

    function updateVisibility() {
      frame = null;
      if (disposed) return;
      const headerBottom = Math.max(0, header?.getBoundingClientRect().bottom ?? 0);
      setPastHeroCta(!desktop.matches && !!heroCta && heroCta.getBoundingClientRect().bottom <= headerBottom);
    }
    function queueVisibilityUpdate() {
      if (!disposed && frame === null) frame = window.requestAnimationFrame(updateVisibility);
    }

    window.addEventListener("scroll", queueVisibilityUpdate, { passive: true });
    window.addEventListener("resize", queueVisibilityUpdate);
    window.addEventListener("orientationchange", queueVisibilityUpdate);
    window.addEventListener("pageshow", queueVisibilityUpdate);
    desktop.addEventListener("change", queueVisibilityUpdate);
    viewport?.addEventListener("resize", queueVisibilityUpdate);
    viewport?.addEventListener("scroll", queueVisibilityUpdate, { passive: true });
    const observer = "ResizeObserver" in window ? new ResizeObserver(queueVisibilityUpdate) : null;
    if (heroCta) observer?.observe(heroCta);
    if (header) observer?.observe(header);
    updateVisibility();

    return () => {
      disposed = true;
      window.removeEventListener("scroll", queueVisibilityUpdate);
      window.removeEventListener("resize", queueVisibilityUpdate);
      window.removeEventListener("orientationchange", queueVisibilityUpdate);
      window.removeEventListener("pageshow", queueVisibilityUpdate);
      desktop.removeEventListener("change", queueVisibilityUpdate);
      viewport?.removeEventListener("resize", queueVisibilityUpdate);
      viewport?.removeEventListener("scroll", queueVisibilityUpdate);
      observer?.disconnect();
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!consultationOpen && mobileBookingOpened.current) {
      mobileBookingOpened.current = false;
      const timer = window.setTimeout(() => {
        if (mobileBookingRef.current?.getClientRects().length) {
          mobileBookingRef.current.focus({ preventScroll: true });
        }
      }, 250);
      return () => window.clearTimeout(timer);
    }
  }, [consultationOpen]);

  return (
    <>
        <nav
          data-wlm-v2-mobile-connection-bar
          aria-label="Choose how to connect"
          className="fixed z-40 mx-auto max-w-[440px] rounded-[12px] border border-[#e9c8f3] bg-white p-1.5 shadow-[0_6px_20px_rgba(61,22,64,0.12)] md:hidden"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#25212a", display: consultationOpen || !pastHeroCta ? "none" : undefined, left: "max(12px, env(safe-area-inset-left, 0px))", right: "max(12px, env(safe-area-inset-right, 0px))", bottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}
        >
          <div className="grid grid-cols-3 gap-1">
            <a
              data-wlm-v2-mobile-text-visit
              href="https://intake.medmethoddirect.com/"
              aria-label="Text visit — free"
              className="flex min-h-[68px] min-w-0 flex-col items-center justify-center gap-0.5 rounded-[9px] border border-[#b367ca] bg-white px-0.5 py-1 text-center text-[11px] leading-[14px] text-[#870081] transition-transform duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#870081] active:scale-[0.97] motion-reduce:transition-none"
            >
              <MessageCircleMore className="h-[22px] w-[22px] shrink-0" aria-hidden="true" />
              <span className="block whitespace-nowrap font-bold">Text Visit</span>
              <span className="block whitespace-nowrap text-[10px] font-normal">Free</span>
            </a>
            <button
              type="button"
              data-wlm-v2-mobile-booking
              aria-label="Video visit — $39 per visit"
              aria-haspopup="dialog"
              ref={mobileBookingRef}
              onClick={() => { mobileBookingOpened.current = true; setConsultationOpen(true); }}
              className="flex min-h-[68px] min-w-0 flex-col items-center justify-center gap-0.5 rounded-[9px] bg-gradient-to-r from-[#bb0d7e] to-[#680686] px-0.5 py-1 text-center text-[11px] leading-[14px] text-white transition-transform duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#870081] active:scale-[0.97] motion-reduce:transition-none"
            >
              <Video className="h-[22px] w-[22px] shrink-0" aria-hidden="true" />
              <span className="block whitespace-nowrap font-bold">Video Visit</span>
              <span className="block whitespace-nowrap text-[10px] font-normal">$39 per visit</span>
            </button>
            <a
              data-wlm-v2-mobile-care-call
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
    </>
  );
}
