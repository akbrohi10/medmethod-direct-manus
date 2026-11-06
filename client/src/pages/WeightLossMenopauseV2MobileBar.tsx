import { useEffect, useRef, useState } from "react";
import VideoVisitCheckout from "@/components/weight-loss-menopause-v2/checkout97/VideoVisitCheckout97";
import { getMenopauseV2VideoPendingCheckout } from "@/components/weight-loss-menopause-v2/checkout97/videoVisitCheckout97Storage";

/** V2-only mobile connection bar with an isolated, server-verified $97 checkout. */
export default function WeightLossMenopauseV2MobileBar() {
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [pastHeroCta, setPastHeroCta] = useState(false);
  const mobileBookingRef = useRef<HTMLButtonElement>(null);
  const mobileBookingOpened = useRef(false);

  useEffect(() => {
    // Resume the original provider payment; never replace it with a new charge.
    if (getMenopauseV2VideoPendingCheckout()) setConsultationOpen(true);
  }, []);

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
          aria-label="Start my free assessment"
          className="fixed z-40 mx-auto max-w-[440px] rounded-[12px] border border-[#e9c8f3] bg-white p-1.5 shadow-[0_6px_20px_rgba(61,22,64,0.12)] md:hidden"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#25212a", display: consultationOpen || !pastHeroCta ? "none" : undefined, left: "max(12px, env(safe-area-inset-left, 0px))", right: "max(12px, env(safe-area-inset-right, 0px))", bottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}
        >
          <a
            data-wlm-v2-mobile-assessment
            href="https://intake.medmethoddirect.com/"
            className="flex min-h-[68px] w-full min-w-0 flex-col items-center justify-center gap-1 rounded-[9px] bg-gradient-to-r from-[#bb0d7e] to-[#680686] px-3 py-2 text-center text-white transition-transform duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#870081] active:scale-[0.97] motion-reduce:transition-none"
          >
            <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-[16px] font-bold leading-[22px] sm:text-[18px]">Start my free assessment <span aria-hidden="true">→</span></span>
            <span className="block text-[14px] font-normal leading-[18px]">Takes 5–10 min</span>
          </a>
        </nav>
      <VideoVisitCheckout open={consultationOpen} onClose={() => setConsultationOpen(false)} />
    </>
  );
}
