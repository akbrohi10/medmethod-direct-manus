// IMAGE RULE: single physician or patient face on laptop screen only — no group Zoom calls
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/fl-t2-palm-beach-gardens_cf7b35fe.png";
const BOOK_URL = "https://app.medmethoddirect.com/booking";

const faqs = [
  {
    "q": "Is there a menopause specialist in Palm Beach Gardens, FL?",
    "a": "Palm Beach Gardens has general OB-GYN practices, but dedicated menopause specialists managing comprehensive HRT are concentrated in Boca Raton or West Palm Beach. MedMethod Direct provides board-certified hormone therapy via telehealth so Palm Beach Gardens women get specialist-level care without the commute."
  },
  {
    "q": "Can I get bioidentical HRT online in Florida?",
    "a": "Yes. Florida-licensed physicians can prescribe bioidentical hormone replacement therapy via telehealth. MedMethod Direct physicians are FL-licensed and prescribe customized bioidentical estrogen, progesterone, and testosterone shipped to your Palm Beach Gardens address."
  },
  {
    "q": "What is included in the $449 diagnostic consultation?",
    "a": "Your $449 onboarding includes a comprehensive hormone and metabolic lab panel, a 60-minute physician consultation, and a personalized treatment protocol. Most patients receive their first prescription within 5\u20137 days of completing labs."
  },
  {
    "q": "Do you offer GLP-1 weight loss in Palm Beach Gardens?",
    "a": "Yes. We offer semaglutide and tirzepatide programs for women throughout Northern Palm Beach County. Your physician evaluates your metabolic health and prescribes the appropriate GLP-1 medication shipped directly to you."
  },
  {
    "q": "Do you serve other Palm Beach County communities?",
    "a": "Yes \u2014 we serve all of Palm Beach County including Jupiter, Boca Raton, Delray Beach, and West Palm Beach. Any Florida resident can schedule a telehealth appointment."
  }
];

const nearbyCities = [
  {
    "name": "Jupiter, FL",
    "path": "/jupiter-fl"
  },
  {
    "name": "Vero Beach, FL",
    "path": "/vero-beach-fl"
  },
  {
    "name": "Miami, FL",
    "path": "/miami-fl"
  },
  {
    "name": "Marco Island, FL",
    "path": "/marco-island-fl"
  },
  {
    "name": "Ponte Vedra, FL",
    "path": "/ponte-vedra-fl"
  }
];

export default function LocationPalmBeachGardensFL() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalBusiness",
        name: "MedMethod Direct — Palm Beach Gardens, FL",
        url: "https://www.medmethoddirect.com/palm-beach-gardens-fl",
        description: "Board-certified telehealth menopause and hormone therapy for women in Palm Beach Gardens, Florida.",
        areaServed: { "@type": "City", name: "Palm Beach Gardens", containedInPlace: { "@type": "State", name: "Florida" } },
        medicalSpecialty: "Endocrinology",
        availableService: [
          { "@type": "MedicalTherapy", name: "Hormone Replacement Therapy" },
          { "@type": "MedicalTherapy", name: "GLP-1 Weight Loss" },
          { "@type": "MedicalTherapy", name: "Menopause Management" }
        ]
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map(f => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a }
        }))
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.medmethoddirect.com" },
          { "@type": "ListItem", position: 2, name: "Florida", item: "https://www.medmethoddirect.com/florida" },
          { "@type": "ListItem", position: 3, name: "Palm Beach Gardens", item: "https://www.medmethoddirect.com/palm-beach-gardens-fl" }
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Menopause Doctor Palm Beach Gardens FL | Hormone Therapy | MedMethod Direct</title>
        <meta name="description" content="Board-certified menopause and hormone therapy for women in Palm Beach Gardens, FL. Specialist-level HRT and GLP-1 weight loss via telehealth — appointments this week." />
        <link rel="canonical" href="https://www.medmethoddirect.com/palm-beach-gardens-fl" />
        <meta property="og:title" content="Menopause Doctor Palm Beach Gardens FL | MedMethod Direct" />
        <meta property="og:description" content="Board-certified menopause and hormone therapy for women in Palm Beach Gardens, FL. Specialist-level HRT and GLP-1 weight loss via telehealth — appointments this week." />
        <meta property="og:url" content="https://www.medmethoddirect.com/palm-beach-gardens-fl" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      {/* Breadcrumb */}
      <nav className="bg-stone-50 border-b border-stone-200 py-3 px-4 text-sm text-stone-500">
        <div className="max-w-5xl mx-auto flex gap-2">
          <Link href="/" className="hover:text-stone-800">Home</Link>
          <span>/</span>
          <Link href="/florida" className="hover:text-stone-800">Florida</Link>
          <span>/</span>
          <span className="text-stone-800 font-medium">Palm Beach Gardens</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[480px] flex items-center">
        <div className="absolute inset-0">
          {/* IMAGE RULE: single physician or patient face on laptop screen only — no group Zoom calls */}
          <img src={HERO_IMAGE} alt="Telehealth menopause consultation for Palm Beach Gardens FL women" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 to-stone-900/30" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">Palm Beach Gardens · Palm Beach County · Florida</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 max-w-2xl">
            Hormone Therapy & Menopause Care for Palm Beach Gardens, FL Women
          </h1>
          <p className="text-stone-200 text-lg mb-8 max-w-xl">
            Palm Beach Gardens is one of Florida's most affluent communities. MedMethod Direct delivers board-certified menopause and hormone therapy via telehealth — appointments available this week.
          </p>
          <a href={BOOK_URL} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8">
              Book Your Consultation
            </Button>
          </a>
        </div>
      </section>

      {/* Access Gap */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-stone-800 mb-4">Specialist-Level Care for Palm Beach Gardens Women</h2>
            
          <div className="space-y-4 text-base leading-relaxed" style={{ color: "#444" }}>
            <p>
              If you live in Palm Beach Gardens and you've been searching for a{" "}
              <strong>menopause doctor near Palm Beach Gardens, FL</strong>, a{" "}
              <strong>medical weight loss physician serving Palm Beach Gardens, Florida</strong>, or a hormone specialist who treats the whole picture — you've found the right place. MedMethod Direct is a virtual women's health clinic built around one insight most practices miss: <strong>hormones and weight are the same problem</strong>. You cannot fix one without addressing the other.
            </p>
            <p>
              We specialize in the full spectrum of women's metabolic and hormonal health:{" "}
              <strong>perimenopause and menopause management</strong>,{" "}
              <strong>hormone replacement therapy (HRT)</strong>,{" "}
              <strong>bioidentical hormone therapy (BHRT)</strong>,{" "}
              <strong>testosterone optimization for women</strong>, GLP-1 medications including{" "}
              <strong>compounded semaglutide and tirzepatide</strong>, insulin resistance, thyroid optimization, and longevity-focused care — all managed virtually by Dr. Jumana Al-Deek, DO.
            </p>
            <p>
              Whether you're experiencing{" "}
              <strong>perimenopause weight gain</strong>, brain fog, night sweats, low libido, or you've tried GLP-1s elsewhere and hit a plateau — the missing piece is almost always hormonal. MedMethod Direct is one of the only virtual practices in Florida that addresses <strong>weight loss and hormone balance together</strong>, in a single physician-led program. No driving to Jupiter or Boca Raton. No waiting rooms. Just one team, one plan, and results that last.
            </p>
          </div>

          {/* Internal links to blog articles */}
          <div className="mt-8 flex flex-wrap gap-3 items-center">
            <span className="text-xs font-bold tracking-wider uppercase" style={{ color: "#999" }}>
              Related reading:
            </span>
            {[
              { label: "Why menopause weight gain feels different", href: "/blog/why-weight-gain-feels-different-in-menopause" },
              { label: "Semaglutide vs. tirzepatide for women", href: "/blog/semaglutide-vs-tirzepatide-women-midlife" },
              { label: "Can hormone therapy help with weight & sleep?", href: "/blog/hormone-therapy-weight-sleep-metabolism" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all hover:shadow-sm"
                style={{
                  color: "#E8339E",
                  borderColor: "rgba(232,51,158,0.3)",
                  background: "rgba(232,51,158,0.04)",
                }}
              >
                {link.label} →
              </Link>
            ))}
          </div></div>
          <div className="bg-stone-50 rounded-2xl p-8 border border-stone-200">
            <h3 className="text-xl font-bold text-stone-800 mb-6">What We Treat</h3>
            <ul className="space-y-3 text-stone-600">
              {["Hot flashes & night sweats","Hormonal weight gain","Brain fog & fatigue","Sleep disruption","Low libido & vaginal dryness","Perimenopause symptoms","Thyroid dysfunction","Metabolic optimization"].map(s => (
                <li key={s} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-stone-50 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-10 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Lab Work", desc: "Order your comprehensive hormone panel online. Labs drawn near Palm Beach Gardens — no physician referral needed." },
              { step: "02", title: "Physician Consult", desc: "A 60-minute video consultation with your MedMethod physician to review results and build your personalized protocol." },
              { step: "03", title: "Medication Delivered", desc: "Prescriptions sent to a compounding pharmacy and shipped directly to your Palm Beach County address within days." }
            ].map(item => (
              <div key={item.step} className="bg-white rounded-2xl p-8 border border-stone-200">
                <div className="text-4xl font-bold text-amber-500 mb-3">{item.step}</div>
                <h3 className="text-lg font-bold text-stone-800 mb-2">{item.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-stone-200 pb-6">
                <h3 className="text-lg font-semibold text-stone-800 mb-2">{faq.q}</h3>
                <p className="text-stone-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Cities */}
      <section className="bg-stone-50 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-stone-800 mb-6">Also Serving Nearby Florida Communities</h2>
          <div className="flex flex-wrap gap-3">
            {nearbyCities.map(c => (
              <Link key={c.path} href={c.path}>
                <span className="inline-block px-4 py-2 bg-white border border-stone-200 rounded-full text-stone-700 text-sm hover:border-amber-400 hover:text-amber-700 transition-colors cursor-pointer">
                  {c.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-stone-800 py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Start?</h2>
        <p className="text-stone-300 mb-8 max-w-xl mx-auto">Join Palm Beach Gardens women who are getting specialist-level hormone care from home.</p>
        <a href={BOOK_URL} target="_blank" rel="noopener noreferrer">
          <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-10">
            Book Your $449 Diagnostic Consultation
          </Button>
        </a>
      </section>
    </>
  );
}
