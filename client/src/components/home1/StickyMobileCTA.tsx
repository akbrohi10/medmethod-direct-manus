/* =============================================================================
   Sticky Mobile CTA Bar — Clinical Noir Design
   Fixed bottom bar on mobile only, disappears when consultation section is in view
   ============================================================================= */
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

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
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden px-4 pt-2"
      style={{ background: "linear-gradient(to top, #111111 60%, transparent)", paddingBottom: "max(1rem, env(safe-area-inset-bottom, 1rem))" }}
    >
      <a
        onClick={onConsultClick}
        className="btn-gradient w-full py-4 rounded-full text-sm font-bold tracking-wider flex items-center justify-center gap-2"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        BOOK MY DISCOVERY CALL
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}
