// IMAGE RULE: single physician or patient face on laptop screen only — no group Zoom calls
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/md-t2-easton_795af720.png";
const BOOK_URL = "https://app.medmethoddirect.com/booking";

const faqs = [
  {
    "q": "Is there a menopause specialist in Easton, MD?",
    "a": "Easton and the Eastern Shore have very limited specialist medical care \u2014 the nearest menopause physicians are in Annapolis or Baltimore, requiring a Bay Bridge crossing. MedMethod Direct provides board-certified hormone therapy via telehealth so Eastern Shore women get specialist-level care without the drive."
  },
  {
    "q": "Can I get HRT prescribed online in Maryland?",
    "a": "Yes. Maryland-licensed physicians can prescribe hormone replacement therapy via telehealth. MedMethod Direct physicians are MD-licensed and can prescribe bioidentical HRT shipped to your Easton address."
  },
  {
    "q": "What does the $449 diagnostic setup include?",
    "a": "Your $449 onboarding includes a comprehensive hormone and metabolic lab panel, a 60-minute physician consultation, and a personalized treatment protocol. Labs can be drawn at a local facility near Easton."
  },
  {
    "q": "Do you offer GLP-1 weight loss in Easton?",
    "a": "Yes. We offer semaglutide and tirzepatide programs for women throughout the Eastern Shore. Your physician evaluates your metabolic health and prescribes the appropriate GLP-1 medication shipped directly to you."
  },
  {
    "q": "Do you serve other Eastern Shore communities?",
    "a": "Yes \u2014 we serve all of Maryland's Eastern Shore including St. Michaels, Oxford, Cambridge, and Chestertown. Any Maryland resident can schedule a telehealth appointment."
  }
];

const nearbyCities = [
  {
    "name": "Annapolis, MD",
    "path": "/annapolis-md"
  },
  {
    "name": "Bel Air, MD",
    "path": "/bel-air-md"
  },
  {
    "name": "Ellicott City, MD",
    "path": "/ellicott-city-md"
  },
  {
    "name": "Frederick, MD",
    "path": "/frederick-md"
  },
  {
    "name": "Bethesda, MD",
    "path": "/bethesda-md"
  }
];

export default function LocationEastonMD() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalBusiness",
        name: "MedMethod Direct — Easton, MD",
        url: "https://www.medmethoddirect.com/easton-md",
        description: "Board-certified telehealth menopause and hormone therapy for women in Easton, Maryland.",
        areaServed: { "@type": "City", name: "Easton", containedInPlace: { "@type": "State", name: "Maryland" } },
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
          { "@type": "ListItem", position: 2, name: "Maryland", item: "https://www.medmethoddirect.com/maryland" },
          { "@type": "ListItem", position: 3, name: "Easton", item: "https://www.medmethoddirect.com/easton-md" }
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Menopause Doctor Easton MD | Hormone Therapy | MedMethod Direct</title>
        <meta name="description" content="Board-certified menopause and hormone therapy for women in Easton, MD. Specialist-level HRT via telehealth — no Bay Bridge drive to Annapolis or Baltimore." />
        <link rel="canonical" href="https://www.medmethoddirect.com/easton-md" />
        <meta property="og:title" content="Menopause Doctor Easton MD | MedMethod Direct" />
        <meta property="og:description" content="Board-certified menopause and hormone therapy for women in Easton, MD. Specialist-level HRT via telehealth — no Bay Bridge drive to Annapolis or Baltimore." />
        <meta property="og:url" content="https://www.medmethoddirect.com/easton-md" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      {/* Breadcrumb */}
      <nav className="bg-stone-50 border-b border-stone-200 py-3 px-4 text-sm text-stone-500">
        <div className="max-w-5xl mx-auto flex gap-2">
          <Link href="/" className="hover:text-stone-800">Home</Link>
          <span>/</span>
          <Link href="/maryland" className="hover:text-stone-800">Maryland</Link>
          <span>/</span>
          <span className="text-stone-800 font-medium">Easton</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[480px] flex items-center">
        <div className="absolute inset-0">
          {/* IMAGE RULE: single physician or patient face on laptop screen only — no group Zoom calls */}
          <img src={HERO_IMAGE} alt="Telehealth menopause consultation for Easton MD women" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 to-stone-900/30" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">Easton · Talbot County · Maryland</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 max-w-2xl">
            Menopause Care for Easton, MD Women — No Bay Bridge Required
          </h1>
          <p className="text-stone-200 text-lg mb-8 max-w-xl">
            Easton is the Eastern Shore's most affluent community — but specialist medical care means crossing the Bay Bridge. MedMethod Direct delivers board-certified HRT via telehealth.
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
            <h2 className="text-3xl font-bold text-stone-800 mb-4">The Specialist Gap on Maryland's Eastern Shore</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Easton and Talbot County attract some of Maryland's most affluent residents — but the Eastern Shore's geographic isolation means the nearest menopause specialists are in Annapolis or Baltimore, requiring a Bay Bridge crossing. Women managing perimenopause or seeking comprehensive HRT face a genuine access barrier.
            </p>
            <p className="text-stone-600 leading-relaxed">
              MedMethod Direct was built for communities like Easton. Our Maryland-licensed physicians provide specialist-level menopause care and hormone therapy entirely via telehealth, with medication shipped directly to your Eastern Shore address.
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
              { step: "01", title: "Lab Work", desc: "Order your comprehensive hormone panel online. Labs drawn near Easton — no physician referral needed." },
              { step: "02", title: "Physician Consult", desc: "A 60-minute video consultation with your MedMethod physician to review results and build your personalized protocol." },
              { step: "03", title: "Medication Delivered", desc: "Prescriptions sent to a compounding pharmacy and shipped directly to your Talbot County address within days." }
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
          <h2 className="text-xl font-bold text-stone-800 mb-6">Also Serving Nearby Maryland Communities</h2>
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
        <p className="text-stone-300 mb-8 max-w-xl mx-auto">Join Easton women who are getting specialist-level hormone care from home.</p>
        <a href={BOOK_URL} target="_blank" rel="noopener noreferrer">
          <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-10">
            Book Your $449 Diagnostic Consultation
          </Button>
        </a>
      </section>
    </>
  );
}
