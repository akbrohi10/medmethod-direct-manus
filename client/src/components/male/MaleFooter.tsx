/* MaleFooter.tsx — Men's Health Footer */
import { Instagram, Facebook, Linkedin, Twitter } from "lucide-react";

const TEAL = "#00C2CB";
const MEN_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/medmethod-men-logo_c015511e.png";

export default function MaleFooter({ onConsultClick }: { onConsultClick: () => void }) {
  return (
    <footer style={{ background: "#060B17", borderTop: "1px solid rgba(0,194,203,0.1)" }}>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <img src={MEN_LOGO} alt="MedMethod Direct Men" style={{ height: 48, width: "auto", objectFit: "contain", marginBottom: 16 }} />
            <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.35)", maxWidth: 280, fontFamily: "Montserrat, sans-serif" }}>
              Board-certified men's health physicians delivering TRT, weight loss, and performance optimization — 100% virtually.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                  style={{ background: "rgba(0,194,203,0.1)", border: "1px solid rgba(0,194,203,0.2)", color: "rgba(255,255,255,0.5)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,194,203,0.2)"; e.currentTarget.style.color = TEAL; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,194,203,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-black text-white text-xs tracking-widest uppercase mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Services</h4>
            <ul className="space-y-2.5">
              {["TRT / Testosterone", "Weight Loss", "Sexual Health", "Peptide Therapy", "Hair Restoration", "Longevity Medicine"].map(s => (
                <li key={s}><a href="#services" className="text-sm transition-colors" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "Montserrat, sans-serif" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>{s}</a></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-black text-white text-xs tracking-widest uppercase mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Company</h4>
            <ul className="space-y-2.5">
              {["How It Works", "Pricing", "Results", "FAQ", "For Women →"].map((s, i) => (
                <li key={s}><a href={i === 4 ? "/" : "#"} className="text-sm transition-colors" style={{ color: i === 4 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.35)", fontFamily: "Montserrat, sans-serif" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = i === 4 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.35)")}>{s}</a></li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4 className="font-black text-white text-xs tracking-widest uppercase mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Get Started</h4>
            <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "Montserrat, sans-serif" }}>
              Free consultation with a men's health specialist. No commitment required.
            </p>
            <button onClick={onConsultClick}
              className="w-full py-3 rounded-full text-sm font-bold tracking-wider text-white transition-all"
              style={{ fontFamily: "Montserrat, sans-serif", background: "linear-gradient(135deg, #00C2CB 0%, #0099A8 100%)", boxShadow: "0 4px 16px rgba(0,194,203,0.3)" }}>
              FREE CONSULTATION
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid rgba(0,194,203,0.08)" }}>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "Montserrat, sans-serif" }}>
            © 2025 MedMethod Direct. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "HIPAA Notice"].map(l => (
              <a key={l} href="#" className="text-xs transition-colors" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "Montserrat, sans-serif" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}>{l}</a>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs mt-6" style={{ color: "rgba(255,255,255,0.15)", fontFamily: "Montserrat, sans-serif", lineHeight: 1.6 }}>
          MedMethod Direct is not a pharmacy. Prescriptions are issued by licensed physicians and filled by licensed compounding pharmacies. Results vary. This website is for informational purposes only and does not constitute medical advice. Consult a qualified healthcare provider before starting any treatment.
        </p>
      </div>
    </footer>
  );
}
