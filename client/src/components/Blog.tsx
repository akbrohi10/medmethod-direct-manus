/* =============================================================================
   Blog Section — Clinical Noir Design
   Pulls 3 featured articles from real blogPosts data with CDN hero images
   ============================================================================= */
import { ArrowRight } from "lucide-react";
import { blogPosts, PILLAR_COLORS } from "@/data/blogPosts";

// Pick the 3 best articles: featured first, then by pillar diversity
const FEATURED_SLUGS = [
  "why-weight-gain-feels-different-in-menopause",
  "putting-yourself-last-has-to-change",
];

const featuredArticles = FEATURED_SLUGS.map(
  (slug) => blogPosts.find((p) => p.slug === slug)!
).filter(Boolean);

export default function Blog() {
  return (
    <section id="blog" className="py-16 lg:py-24" style={{ background: "#F4F4F8" }}>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10 gap-4">
          <div>
            <span
              className="section-label block mb-3"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Education &amp; Insights
            </span>
            <h2
              className="font-black text-[#111111] leading-tight"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                letterSpacing: "-0.02em",
              }}
            >
              KNOWLEDGE IS
              <br />
              YOUR FIRST MEDICINE
            </h2>
          </div>
          <a
            href="/blog"
            className="text-sm font-bold tracking-wider flex items-center gap-2 self-start lg:self-auto"
            style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E" }}
          >
            VIEW ALL ARTICLES
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredArticles.map((article) => (
            <a
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Image */}
              <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                {article.heroImage ? (
                  <img
                    src={article.heroImage}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{ background: "linear-gradient(135deg, #E8339E22 0%, #7A1E7E22 100%)" }}
                  />
                )}
                <div className="absolute top-3 left-3">
                  <span
                    className="px-3 py-1 rounded-full text-white text-xs font-bold tracking-wider uppercase"
                    style={{
                      background: `linear-gradient(135deg, ${PILLAR_COLORS[article.pillar]} 0%, #7A1E7E 100%)`,
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    {article.pillarLabel}
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
                  className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className="text-gray-400 text-xs font-medium"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {article.readTime} min read · Dr. {article.author.name.split(" ").slice(-1)[0]}, {article.author.credentials}
                  </span>
                  <span
                    className="text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all"
                    style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E" }}
                  >
                    READ
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
