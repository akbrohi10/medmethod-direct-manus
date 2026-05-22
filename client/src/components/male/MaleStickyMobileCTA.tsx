/* MaleStickyMobileCTA.tsx — scroll-aware, safe-area-aware */
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

export default function MaleStickyMobileCTA({ onConsultClick }: { onConsultClick: () => void }) {
  const [visible, setVisible] = useState(false);
  const [atForm, setAtForm] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
      const formEl = document.getElementById("male-consultation");
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
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pt-2"
      style={{
        background: "linear-gradient(to top, rgba(10,15,30,0.98) 60%, transparent)",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom, 1rem))",
      }}
    >
      <button
        onClick={onConsultClick}
        className="w-full py-4 rounded-full font-bold text-sm tracking-wider text-white flex items-center justify-center gap-2"
        style={{
          fontFamily: "Montserrat, sans-serif",
          background: "linear-gradient(135deg, #00E5FF 0%, #00B8CC 100%)",
          boxShadow: "0 8px 24px rgba(0,229,255,0.4)",
        }}
      >
        FREE CONSULTATION
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
