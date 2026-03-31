/* MaleStickyMobileCTA.tsx */
export default function MaleStickyMobileCTA({ onConsultClick }: { onConsultClick: () => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pb-4 pt-2"
      style={{ background: "linear-gradient(to top, rgba(10,15,30,0.98) 60%, transparent)" }}>
      <button
        onClick={onConsultClick}
        className="w-full py-4 rounded-full font-bold text-sm tracking-wider text-white"
        style={{ fontFamily: "Montserrat, sans-serif", background: "linear-gradient(135deg, #00E5FF 0%, #00B8CC 100%)", boxShadow: "0 8px 24px rgba(0,229,255,0.4)" }}>
        FREE CONSULTATION →
      </button>
    </div>
  );
}
