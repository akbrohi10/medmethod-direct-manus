/* =============================================================================
   Blog Section — Clinical Noir Design
   White background, article cards with gradient category labels
   ============================================================================= */
import { ArrowRight } from "lucide-react";

const articles = [
  {
    category: "Hormone Therapy",
    title: "Low Testosterone: 10 Signs You Might Have It (And What to Do)",
    excerpt: "Fatigue, brain fog, low libido — these could be signs of low T. Learn how to identify the symptoms and what modern treatment options are available.",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80",
  },
  {
    category: "Weight Loss",
    title: "Semaglutide vs. Tirzepatide: Which GLP-1 Is Right for You?",
    excerpt: "Both medications have transformed medical weight loss. We break down the key differences, efficacy data, and how to know which option fits your goals.",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
  },
  {
    category: "Longevity",
    title: "The Science of Longevity: What the Latest Research Says About Living Longer",
    excerpt: "From NAD+ to peptides to hormone optimization — we explore the evidence-based interventions that are changing how we think about aging.",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80",
  },
];

export default function Blog() {
  return (
    <section id="blog" className="bg-[#f8f8f8] py-16 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10 gap-4">
          <div>
            <span
              className="section-label block mb-3"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Education & Insights
            </span>
            <h2
              className="font-black text-[#111111] leading-tight"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                letterSpacing: "-0.02em",
              }}
            >
              LATEST FROM THE
              <br />
              MEDMETHOD BLOG
            </h2>
          </div>
          <a
            href="#blog"
            className="text-sm font-bold tracking-wider flex items-center gap-2 self-start lg:self-auto"
            style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E" }}
          >
            VIEW ALL ARTICLES
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <a
              key={i}
              href="#blog"
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Image */}
              <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span
                    className="px-3 py-1 rounded-full text-white text-xs font-bold tracking-wider uppercase"
                    style={{
                      background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3
                  className="text-[#111111] font-black mb-3 leading-tight group-hover:text-[#E8339E] transition-colors"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "1rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {article.title}
                </h3>
                <p
                  className="text-gray-500 text-sm leading-relaxed mb-4"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className="text-gray-400 text-xs font-medium"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {article.readTime}
                  </span>
                  <span
                    className="text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all"
                    style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E" }}
                  >
                    READ ARTICLE
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
