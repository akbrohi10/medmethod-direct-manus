/* =============================================================================
   Sticky Mobile CTA Bar — Two-Pill Design
   Fixed bottom bar on mobile only with "Call Now" and "Schedule a Discovery Call"
   pills. Disappears when consultation section is in view.
   ============================================================================= */
import { useEffect, useState } from "react";
import { Phone, ArrowRight } from "lucide-react";

const PHONE_NUMBER = "8883627011";
const PHONE_DISPLAY = "tel:+1" + PHONE_NUMBER;

export default function StickyMobileCTA({ onConsultClick }: { onConsultClick: () => void }) {
  const [visible, setVisible] = useState(false);
  const [atForm, setAtForm] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setVisible(scrollY > 400);

      const formEl = document.getElementById("consultation");
      if (formEl) {
        const rect = formEl.getBoundingClientRect();
        setAtForm(rect.top < window.innerHeight && rect.bottom > 0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (atForm || !visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden px-3 pt-2"
      style={{
        background: "linear-gradient(to top, #111111 60%, transparent)",
        paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0.75rem))",
      }}
    >
      <div className="flex gap-2">
        {/* Call Now pill */}
        <a
          href={PHONE_DISPLAY}
          className="btn-gradient flex-1 py-3.5 rounded-full text-sm font-bold tracking-wider flex items-center justify-center gap-2"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          <Phone className="w-4 h-4" />
          CALL NOW
        </a>

        {/* Schedule pill */}
        <a
          onClick={onConsultClick}
          className="btn-gradient flex-1 py-3.5 rounded-full text-sm font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          SCHEDULE
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
