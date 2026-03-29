// IMAGE RULE: single physician or patient face on laptop screen only — no group Zoom calls
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/co-t2-castle-rock_47c06ba4.png";
const BOOK_URL = "https://app.medmethoddirect.com/booking";

const faqs = [
  {
    "q": "Is there a menopause specialist in Castle Rock, CO?",
    "a": "Castle Rock and Douglas County have limited menopause specialists \u2014 most are in Denver or Colorado Springs, 30\u201345 minutes away. MedMethod Direct provides board-certified hormone therapy via telehealth so Castle Rock women get specialist-level care without the drive."
  },
  {
    "q": "Can I get HRT prescribed online in Colorado?",
    "a": "Yes. Colorado-licensed physicians can prescribe hormone replacement therapy via telehealth after a proper medical evaluation. MedMethod Direct physicians are CO-licensed and can prescribe bioidentical HRT shipped to your Castle Rock address."
  },
  {
    "q": "What does the $449 diagnostic setup include?",
    "a": "Your $449 onboarding includes a comprehensive hormone and metabolic lab panel, a 60-minute physician consultation, and a personalized treatment protocol. Most patients receive their first prescription within 5\u20137 days of completing labs."
  },
  {
    "q": "Do you offer GLP-1 weight loss in Castle Rock?",
    "a": "Yes. We offer semaglutide and tirzepatide programs for women throughout Douglas County. Your physician evaluates your metabolic health and prescribes the appropriate GLP-1 medication shipped directly to you."
  },
  {
    "q": "Do you serve other Douglas County communities?",
    "a": "Yes \u2014 we serve all of Douglas County including Parker, Lone Tree, Highlands Ranch, and Roxborough Park. Any Colorado resident can schedule a telehealth appointment."
  }
];

const nearbyCities = [
  {
    "name": "Parker, CO",
    "path": "/parker-co"
  },
  {
    "name": "Highlands Ranch, CO",
    "path": "/highlands-ranch-co"
  },
  {
    "name": "Denver, CO",
    "path": "/denver-co"
  },
  {
    "name": "Colorado Springs, CO",
    "path": "/colorado-springs-co"
  },
  {
    "name": "Greenwood Village, CO",
    "path": "/greenwood-village-co"
  }
];

export default function LocationCastleRockCO() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalBusiness",
        name: "MedMethod Direct — Castle Rock, CO",
        url: "https://www.medmethoddirect.com/castle-rock-co",
        description: "Board-certified telehealth menopause and hormone therapy for women in Castle Rock, Colorado.",
        areaServed: { "@type": "City", name: "Castle Rock", containedInPlace: { "@type": "State", name: "Colorado" } },
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
          { "@type": "ListItem", position: 2, name: "Colorado", item: "https://www.medmethoddirect.com/colorado" },
          { "@type": "ListItem", position: 3, name: "Castle Rock", item: "https://www.medmethoddirect.com/castle-rock-co" }
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Menopause Doctor Castle Rock CO | Hormone Therapy | MedMethod Direct</title>
        <meta name="description" content="Board-certified menopause and hormone therapy for women in Castle Rock, CO. Specialist-level HRT and GLP-1 weight loss via telehealth — no drive to Denver." />
        <link rel="canonical" href="https://www.medmethoddirect.com/castle-rock-co" />
        <meta property="og:title" content="Menopause Doctor Castle Rock CO | MedMethod Direct" />
        <meta property="og:description" content="Board-certified menopause and hormone therapy for women in Castle Rock, CO. Specialist-level HRT and GLP-1 weight loss via telehealth — no drive to Denver." />
        <meta property="og:url" content="https://www.medmethoddirect.com/castle-rock-co" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      {/* Breadcrumb */}
      <nav className="bg-stone-50 border-b border-stone-200 py-3 px-4 text-sm text-stone-500">
        <div className="max-w-5xl mx-auto flex gap-2">
          <Link href="/" className="hover:text-stone-800">Home</Link>
          <span>/</span>
          <Link href="/colorado" className="hover:text-stone-800">Colorado</Link>
          <span>/</span>
          <span className="text-stone-800 font-medium">Castle Rock</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[480px] flex items-center">
        <div className="absolute inset-0">
          {/* IMAGE RULE: single physician or patient face on laptop screen only — no group Zoom calls */}
          <img src={HERO_IMAGE} alt="Telehealth menopause consultation for Castle Rock CO women" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 to-stone-900/30" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">Castle Rock · Douglas County · Colorado</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 max-w-2xl">
            Menopause & Hormone Therapy for Castle Rock, CO Women
          </h1>
          <p className="text-stone-200 text-lg mb-8 max-w-xl">
            Castle Rock is one of Colorado's fastest-growing affluent communities — but menopause specialists are scarce. MedMethod Direct delivers board-certified HRT via telehealth.
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
            <h2 className="text-3xl font-bold text-stone-800 mb-4">The Specialist Gap Between Denver and Colorado Springs</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Castle Rock sits at the midpoint of the I-25 corridor between Denver and Colorado Springs — but that geography means the nearest menopause specialists are 30–45 minutes in either direction. Douglas County's rapidly growing population of professional women 35–65 is significantly underserved.
            </p>
            <p className="text-stone-600 leading-relaxed">
              MedMethod Direct fills that gap. Our Colorado-licensed physicians provide specialist-level menopause care, bioidentical hormone therapy, and GLP-1 weight loss programs entirely via telehealth — with medication shipped to your Castle Rock address.
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
              { step: "01", title: "Lab Work", desc: "Order your comprehensive hormone panel online. Labs drawn near Castle Rock — no physician referral needed." },
              { step: "02", title: "Physician Consult", desc: "A 60-minute video consultation with your MedMethod physician to review results and build your personalized protocol." },
              { step: "03", title: "Medication Delivered", desc: "Prescriptions sent to a compounding pharmacy and shipped directly to your Douglas County address within days." }
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
          <h2 className="text-xl font-bold text-stone-800 mb-6">Also Serving Nearby Colorado Communities</h2>
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
        <p className="text-stone-300 mb-8 max-w-xl mx-auto">Join Castle Rock women who are getting specialist-level hormone care from home.</p>
        <a href={BOOK_URL} target="_blank" rel="noopener noreferrer">
          <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-10">
            Book Your $449 Diagnostic Consultation
          </Button>
        </a>
      </section>
    </>
  );
}
