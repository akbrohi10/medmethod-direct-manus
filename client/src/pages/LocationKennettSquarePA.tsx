// IMAGE RULE: single physician or patient face on laptop screen only — no group Zoom calls
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/pa-t2-kennett-square-ejwCyrUqhiomRJpWbQJwHA.png";
const BOOK_URL = "https://app.medmethoddirect.com/booking";

const faqs = [
  {
    q: "Is there a menopause specialist in Kennett Square, PA?",
    a: "Kennett Square and southern Chester County have very few OB-GYNs who specialize in menopause management — most are in West Chester or Wilmington, DE. MedMethod Direct provides board-certified hormone therapy and menopause care via telehealth, so Kennett Square residents get specialist-level care without the drive."
  },
  {
    q: "Can I get HRT prescribed online in Pennsylvania?",
    a: "Yes. Pennsylvania allows licensed physicians to prescribe hormone replacement therapy via telehealth after a proper medical evaluation. MedMethod Direct physicians are PA-licensed and can prescribe bioidentical HRT, progesterone, and testosterone therapy with medication shipped directly to your Kennett Square address."
  },
  {
    q: "What services does MedMethod Direct offer in Kennett Square?",
    a: "We offer comprehensive women's health services including menopause management, bioidentical hormone therapy, GLP-1 weight loss programs (semaglutide/tirzepatide), thyroid optimization, and preventive longevity care — all via telehealth from your home."
  },
  {
    q: "How does the $449 diagnostic setup work?",
    a: "Your $449 onboarding includes a comprehensive lab panel (hormones, thyroid, metabolic markers), a 60-minute physician consultation to review your results, and a personalized treatment protocol. Most patients have their first prescription within 5–7 days of labs."
  },
  {
    q: "Do you serve other Chester County towns near Kennett Square?",
    a: "Yes — we serve all of Chester County including West Chester, Malvern, Newtown Square, Downingtown, and Coatesville. Any Pennsylvania resident can schedule a telehealth appointment regardless of their specific town."
  }
];

const nearbyCities = [
  { name: "West Chester, PA", path: "/west-chester-pa" },
  { name: "Malvern, PA", path: "/malvern-pa" },
  { name: "Newtown Square, PA", path: "/newtown-square-pa" },
  { name: "Wayne, PA", path: "/wayne-pa" },
  { name: "Philadelphia, PA", path: "/philadelphia-pa" },
];

export default function LocationKennettSquarePA() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalBusiness",
        name: "MedMethod Direct — Kennett Square, PA",
        url: "https://www.medmethoddirect.com/kennett-square-pa",
        telephone: "",
        description: "Board-certified telehealth menopause and hormone therapy for women in Kennett Square and southern Chester County, PA.",
        areaServed: { "@type": "City", name: "Kennett Square", containedInPlace: { "@type": "State", name: "Pennsylvania" } },
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
          { "@type": "ListItem", position: 2, name: "Pennsylvania", item: "https://www.medmethoddirect.com/pennsylvania" },
          { "@type": "ListItem", position: 3, name: "Kennett Square", item: "https://www.medmethoddirect.com/kennett-square-pa" }
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Menopause Doctor Kennett Square PA | Hormone Therapy | MedMethod Direct</title>
        <meta name="description" content="Board-certified menopause and hormone therapy for women in Kennett Square, PA. No drive to West Chester or Wilmington — telehealth appointments available this week." />
        <link rel="canonical" href="https://www.medmethoddirect.com/kennett-square-pa" />
        <meta property="og:title" content="Menopause Doctor Kennett Square PA | MedMethod Direct" />
        <meta property="og:description" content="Specialist-level hormone therapy and menopause care for Kennett Square women — via telehealth, no commute required." />
        <meta property="og:url" content="https://www.medmethoddirect.com/kennett-square-pa" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      {/* Breadcrumb */}
      <nav className="bg-stone-50 border-b border-stone-200 py-3 px-4 text-sm text-stone-500">
        <div className="max-w-5xl mx-auto flex gap-2">
          <Link href="/" className="hover:text-stone-800">Home</Link>
          <span>/</span>
          <Link href="/pennsylvania" className="hover:text-stone-800">Pennsylvania</Link>
          <span>/</span>
          <span className="text-stone-800 font-medium">Kennett Square</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[480px] flex items-center">
        <div className="absolute inset-0">
          {/* IMAGE RULE: single physician or patient face on laptop screen only — no group Zoom calls */}
          <img src={HERO_IMAGE} alt="Telehealth menopause consultation for Kennett Square PA women" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 to-stone-900/30" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">Kennett Square · Chester County · Pennsylvania</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 max-w-2xl">
            Menopause Care for Kennett Square Women — No Drive Required
          </h1>
          <p className="text-stone-200 text-lg mb-8 max-w-xl">
            Southern Chester County has few menopause specialists. MedMethod Direct brings board-certified hormone therapy to your home via telehealth — appointments available this week.
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
            <h2 className="text-3xl font-bold text-stone-800 mb-4">The Specialist Gap in Southern Chester County</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Kennett Square and the surrounding mushroom country corridor are beautiful places to live — but menopause specialists are scarce. The nearest OB-GYN practices managing HRT are typically in West Chester or across the border in Wilmington, DE, with wait times stretching 3–6 months.
            </p>
            <p className="text-stone-600 leading-relaxed">
              MedMethod Direct was built for exactly this gap. Our Pennsylvania-licensed physicians provide the same specialist-level menopause and hormone therapy care you'd find at a major academic medical center — delivered entirely via telehealth, with medication shipped to your door.
            </p>
          </div>
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
              { step: "01", title: "Lab Work", desc: "Order your comprehensive hormone panel online. Labs are drawn at a location near Kennett Square — no physician referral needed." },
              { step: "02", title: "Physician Consult", desc: "A 60-minute video consultation with your MedMethod physician to review results and build your personalized protocol." },
              { step: "03", title: "Medication Delivered", desc: "Prescriptions sent to a compounding pharmacy and shipped directly to your Chester County address within days." }
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
          <h2 className="text-xl font-bold text-stone-800 mb-6">Also Serving Nearby Pennsylvania Communities</h2>
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
        <p className="text-stone-300 mb-8 max-w-xl mx-auto">Join Kennett Square women who are getting specialist-level hormone care without leaving Chester County.</p>
        <a href={BOOK_URL} target="_blank" rel="noopener noreferrer">
          <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-10">
            Book Your $449 Diagnostic Consultation
          </Button>
        </a>
      </section>
    </>
  );
}
