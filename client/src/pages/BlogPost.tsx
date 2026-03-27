// ============================================================================
// BlogPost.tsx — MedMethod Direct Article Template
// Design: Clean editorial reading layout, wide prose column, sticky sidebar CTA,
// author bio block, related posts, quiz CTA at bottom.
// Brand: Pink #E8339E / Plum #7A1E7E / Montserrat + Georgia serif
// ============================================================================
import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { useState } from "react";
import { blogPosts, PILLAR_COLORS } from "@/data/blogPosts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";
import NotFound from "@/pages/NotFound";

const BRAND_GRADIENT = "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)";
const BRAND_PINK = "#E8339E";

// Each article's content is a React component keyed by slug.
// Articles register themselves here when created.
export const articleComponents: Record<string, React.ComponentType> = {};

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [consultOpen, setConsultOpen] = useState(false);

  const post = blogPosts.find((p) => p.slug === slug);
  const ArticleContent = slug ? articleComponents[slug] : undefined;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post || !ArticleContent) {
    return <NotFound />;
  }

  const related = blogPosts
    .filter((p) => p.slug !== slug && p.pillar === post.pillar)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Navbar onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />

      {/* Hero */}
      <section className="pt-24 pb-0">
        {post.heroImage && (
          <div className="w-full max-h-[420px] overflow-hidden">
            <img src={post.heroImage} alt={post.title} className="w-full object-cover" />
          </div>
        )}
        <div
          className={`px-4 py-10 ${!post.heroImage ? "pt-28" : ""}`}
          style={{
            background: post.heroImage
              ? undefined
              : `linear-gradient(180deg, ${PILLAR_COLORS[post.pillar]}10 0%, #fff 100%)`,
          }}
        >
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
              <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-gray-600 transition-colors">Journal</Link>
              <span>/</span>
              <span className="text-gray-500 truncate max-w-[200px]">{post.title}</span>
            </nav>

            {/* Pillar badge */}
            <span
              className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4"
              style={{
                background: `${PILLAR_COLORS[post.pillar]}18`,
                color: PILLAR_COLORS[post.pillar],
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              {post.pillarLabel}
            </span>

            {/* Title */}
            <h1
              className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-5"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {post.title}
            </h1>

            {/* Author + meta row */}
            <div className="flex items-center gap-4 pb-8 border-b border-gray-100">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                style={{ background: BRAND_GRADIENT }}
              >
                J
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {post.author.name}, {post.author.credentials}
                </p>
                <p className="text-xs text-gray-400" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {post.author.title} &nbsp;·&nbsp;{" "}
                  {new Date(post.publishDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  &nbsp;·&nbsp; {post.readTime} min read
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article body + sidebar */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">

          {/* Prose column */}
          <article className="flex-1 max-w-3xl">
            <div className="prose prose-lg prose-gray max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-5
              prose-li:text-gray-600 prose-li:leading-relaxed
              prose-strong:text-gray-800
              prose-a:text-[#E8339E] prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-4 prose-blockquote:border-[#E8339E] prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:text-gray-500
            ">
              <ArticleContent />
            </div>

            {/* Author bio */}
            <div
              className="mt-14 p-6 rounded-2xl flex gap-5 items-start"
              style={{ background: "linear-gradient(135deg, rgba(232,51,158,0.05) 0%, rgba(122,30,126,0.05) 100%)", border: "1px solid rgba(232,51,158,0.12)" }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                style={{ background: BRAND_GRADIENT }}
              >
                J
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-0.5" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {post.author.name}, {post.author.credentials}
                </p>
                <p className="text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: BRAND_PINK, fontFamily: "Montserrat, sans-serif" }}>
                  {post.author.title}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Dr. Jumana Al-Deek is a board-certified osteopathic physician specializing in women's hormonal health, menopause management, medically guided weight loss, and longevity medicine. She founded MedMethod Direct to give women direct access to thoughtful, personalized medical care — without the wait, the dismissal, or the guesswork.
                </p>
              </div>
            </div>

            {/* Bottom CTA */}
            <div
              className="mt-10 p-8 rounded-2xl text-center"
              style={{ background: BRAND_GRADIENT }}
            >
              <p className="text-white/80 text-xs font-bold tracking-widest uppercase mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Ready for personalized guidance?
              </p>
              <h3
                className="text-xl font-bold text-white mb-3"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Schedule a free consultation with our wellness team
              </h3>
              <p className="text-white/75 text-sm mb-6">
                No pressure. No obligation. Just a conversation about what's possible for you.
              </p>
              <button
                onClick={() => setConsultOpen(true)}
                className="px-8 py-3 rounded-full text-sm font-bold tracking-wider bg-white transition-all hover:bg-white/90"
                style={{ color: BRAND_PINK, fontFamily: "Montserrat, sans-serif" }}
              >
                I'm Doing This For Me →
              </button>
            </div>
          </article>

          {/* Sticky sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-28 flex flex-col gap-6">
              {/* Consult CTA */}
              <div
                className="p-6 rounded-2xl"
                style={{ background: "linear-gradient(135deg, rgba(232,51,158,0.06) 0%, rgba(122,30,126,0.06) 100%)", border: "1px solid rgba(232,51,158,0.15)" }}
              >
                <p
                  className="text-xs font-bold tracking-widest uppercase mb-2"
                  style={{ color: BRAND_PINK, fontFamily: "Montserrat, sans-serif" }}
                >
                  Free Consultation
                </p>
                <h3
                  className="text-base font-bold text-gray-900 mb-3 leading-snug"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  Have questions about your health?
                </h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Speak with our wellness team — they'll listen, explain your options, and help you understand what's possible. 100% free.
                </p>
                <button
                  onClick={() => setConsultOpen(true)}
                  className="w-full py-3 rounded-full text-xs font-bold tracking-wider text-white transition-all hover:opacity-90"
                  style={{ background: BRAND_GRADIENT, fontFamily: "Montserrat, sans-serif" }}
                >
                  Schedule Free Call →
                </button>
              </div>

              {/* Related posts */}
              {related.length > 0 && (
                <div>
                  <p
                    className="text-xs font-bold tracking-widest uppercase mb-4 text-gray-400"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Related Articles
                  </p>
                  <div className="flex flex-col gap-4">
                    {related.map((r) => (
                      <Link key={r.slug} href={`/blog/${r.slug}`}>
                        <div className="group cursor-pointer">
                          <span
                            className="text-xs font-bold tracking-wider uppercase"
                            style={{ color: PILLAR_COLORS[r.pillar], fontFamily: "Montserrat, sans-serif" }}
                          >
                            {r.pillarLabel}
                          </span>
                          <p
                            className="text-sm font-semibold text-gray-800 group-hover:text-[#E8339E] transition-colors leading-snug mt-1"
                            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                          >
                            {r.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">{r.readTime} min read</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Back to blog */}
              <Link href="/blog">
                <span
                  className="text-xs font-bold tracking-wider flex items-center gap-1 hover:gap-2 transition-all"
                  style={{ color: BRAND_PINK, fontFamily: "Montserrat, sans-serif" }}
                >
                  ← Back to Journal
                </span>
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <Footer onConsultClick={() => setConsultOpen(true)} />
    </div>
  );
}
