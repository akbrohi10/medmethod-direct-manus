// ============================================================================
// BlogIndex.tsx — MedMethod Direct Blog Index Page
// Design: Clean editorial layout, asymmetric featured post + grid,
// pillar filter tabs, Montserrat headlines, warm white background.
// Brand: Pink #E8339E / Plum #7A1E7E
// ============================================================================
import { useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { blogPosts, PILLAR_LABELS, PILLAR_COLORS, type BlogPost } from "@/data/blogPosts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";

const BRAND_GRADIENT = "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)";
const BRAND_PINK = "#E8339E";
const BRAND_PLUM = "#7A1E7E";

const ALL_PILLARS = "all";

function PillarBadge({ pillar, label }: { pillar: BlogPost["pillar"]; label: string }) {
  return (
    <span
      className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full"
      style={{
        background: `${PILLAR_COLORS[pillar]}18`,
        color: PILLAR_COLORS[pillar],
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      {label}
    </span>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="group cursor-pointer h-full flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-pink-200 hover:shadow-xl transition-all duration-300">
        {/* Thumbnail */}
        <div
          className="w-full aspect-[16/9] flex-shrink-0 overflow-hidden"
          style={{
            background: post.heroImage
              ? undefined
              : `linear-gradient(135deg, ${PILLAR_COLORS[post.pillar]}22 0%, ${PILLAR_COLORS[post.pillar]}08 100%)`,
          }}
        >
          {post.heroImage ? (
            <img
              src={post.heroImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span style={{ fontSize: 48, opacity: 0.3 }}>✦</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6">
          <PillarBadge pillar={post.pillar} label={post.pillarLabel} />
          <h2
            className="mt-3 text-lg font-bold leading-snug text-gray-900 group-hover:text-[#E8339E] transition-colors line-clamp-2"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            {post.title}
          </h2>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
            {post.excerpt}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: BRAND_GRADIENT }}
              >
                J
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {post.author.name}, {post.author.credentials}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(post.publishDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  {" · "}{post.readTime} min read
                </p>
              </div>
            </div>
            <span
              className="text-xs font-bold tracking-wider group-hover:translate-x-1 transition-transform"
              style={{ color: BRAND_PINK, fontFamily: "Montserrat, sans-serif" }}
            >
              READ →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function FeaturedPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-pink-200 hover:shadow-2xl transition-all duration-300 flex flex-col lg:flex-row">
        {/* Image */}
        <div
          className="w-full lg:w-1/2 aspect-[16/9] lg:aspect-auto flex-shrink-0 overflow-hidden"
          style={{
            background: post.heroImage
              ? undefined
              : `linear-gradient(135deg, ${PILLAR_COLORS[post.pillar]}22 0%, ${PILLAR_COLORS[post.pillar]}08 100%)`,
            minHeight: 280,
          }}
        >
          {post.heroImage ? (
            <img
              src={post.heroImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span style={{ fontSize: 72, opacity: 0.2 }}>✦</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center p-8 lg:p-10 flex-1">
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full text-white"
              style={{ background: BRAND_GRADIENT, fontFamily: "Montserrat, sans-serif" }}
            >
              Featured
            </span>
            <PillarBadge pillar={post.pillar} label={post.pillarLabel} />
          </div>
          <h2
            className="text-2xl lg:text-3xl font-bold leading-snug text-gray-900 group-hover:text-[#E8339E] transition-colors mb-3"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            {post.title}
          </h2>
          <p className="text-gray-500 leading-relaxed mb-6 line-clamp-3">{post.excerpt}</p>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: BRAND_GRADIENT }}
            >
              J
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700" style={{ fontFamily: "Montserrat, sans-serif" }}>
                {post.author.name}, {post.author.credentials}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(post.publishDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                {" · "}{post.readTime} min read
              </p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function BlogIndex() {
  const [consultOpen, setConsultOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>(ALL_PILLARS);

  const featured = blogPosts.find((p) => p.featured);
  const filtered = blogPosts.filter((p) => {
    if (activeFilter === ALL_PILLARS) return true;
    return p.pillar === activeFilter;
  });
  const gridPosts = activeFilter === ALL_PILLARS
    ? filtered.filter((p) => !p.featured)
    : filtered;

  const pillars = Object.entries(PILLAR_LABELS) as [BlogPost["pillar"], string][];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Helmet>
        <title>The MedMethod Journal | Hormone, Menopause & Weight Loss Insights</title>
        <link rel="canonical" href="https://medmethoddirect.com/blog" />
        <meta property="og:title" content="The MedMethod Journal | Hormone, Menopause & Weight Loss Insights" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://medmethoddirect.com/blog" />
        <meta property="og:site_name" content="MedMethod Direct" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The MedMethod Journal | Hormone, Menopause & Weight Loss Insights" />
        </Helmet>
      <Navbar onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />

      {/* Breadcrumb */}
      <div className="pt-24 pb-0 px-4">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            <Link
              href="/"
              className="flex items-center gap-1.5 font-semibold transition-colors duration-200 hover:opacity-70"
              style={{ color: BRAND_PINK, fontFamily: "Montserrat, sans-serif" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Home
            </Link>
            <span className="text-gray-300" aria-hidden="true">/</span>
            <span
              className="font-semibold text-gray-400"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Blog
            </span>
          </nav>
        </div>
      </div>

      {/* Hero banner */}
      <section className="pt-6 pb-14 px-4" style={{ background: "linear-gradient(180deg, #fff 0%, #fafafa 100%)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-4"
            style={{ color: BRAND_PINK, fontFamily: "Montserrat, sans-serif" }}
          >
            The MedMethod Direct Journal
          </p>
          <h1
            className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-5"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Answers for women who are{" "}
            <span style={{ background: BRAND_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              done guessing
            </span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Medically grounded, empathetically written articles on hormones, menopause, weight loss, and longevity — authored by Dr. Jumana Al-Deek, DO.
          </p>
        </div>
      </section>

      {/* Pillar filter tabs */}
      <section className="sticky top-16 lg:top-20 z-30 bg-[#fafafa] border-b border-gray-100 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveFilter(ALL_PILLARS)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-all"
            style={{
              fontFamily: "Montserrat, sans-serif",
              background: activeFilter === ALL_PILLARS ? BRAND_GRADIENT : "transparent",
              color: activeFilter === ALL_PILLARS ? "#fff" : "#6b7280",
              border: activeFilter === ALL_PILLARS ? "none" : "1px solid #e5e7eb",
            }}
          >
            All Topics
          </button>
          {pillars.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-all"
              style={{
                fontFamily: "Montserrat, sans-serif",
                background: activeFilter === key ? PILLAR_COLORS[key] : "transparent",
                color: activeFilter === key ? "#fff" : "#6b7280",
                border: activeFilter === key ? "none" : "1px solid #e5e7eb",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {blogPosts.length === 0 ? (
          /* Empty state — shown until first articles are published */
          <div className="text-center py-24">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "linear-gradient(135deg, rgba(232,51,158,0.1) 0%, rgba(122,30,126,0.1) 100%)" }}
            >
              <span style={{ fontSize: 36 }}>✦</span>
            </div>
            <h2
              className="text-2xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Articles coming soon
            </h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              We're preparing medically grounded articles on hormones, menopause, and weight loss — written by Dr. Jumana Al-Deek, DO. Check back soon.
            </p>
            <button
              onClick={() => setConsultOpen(true)}
              className="px-8 py-3 rounded-full text-sm font-bold tracking-wider text-white transition-all hover:opacity-90"
              style={{ background: BRAND_GRADIENT, fontFamily: "Montserrat, sans-serif" }}
            >
              Book Your 45-Min Appointment
            </button>
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featured && activeFilter === ALL_PILLARS && (
              <div className="mb-10">
                <FeaturedPostCard post={featured} />
              </div>
            )}

            {/* Grid */}
            {gridPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ justifyItems: 'center' }}>
                {gridPosts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-400">No articles in this category yet — check back soon.</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Bottom CTA */}
      <section className="py-16 px-4" style={{ background: "linear-gradient(135deg, rgba(232,51,158,0.05) 0%, rgba(122,30,126,0.05) 100%)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: BRAND_PINK, fontFamily: "Montserrat, sans-serif" }}
          >
            Ready to take the next step?
          </p>
          <h2
            className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Knowledge is the first step. A conversation is the second.
          </h2>
          <p className="text-gray-500 mb-8">
            Schedule a appointment with our wellness team and get personalized guidance — no pressure, no obligation.
          </p>
          <button
            onClick={() => setConsultOpen(true)}
            className="px-10 py-4 rounded-full text-sm font-bold tracking-wider text-white transition-all hover:opacity-90"
            style={{ background: BRAND_GRADIENT, boxShadow: "0 8px 30px rgba(232,51,158,0.3)", fontFamily: "Montserrat, sans-serif" }}
          >
            Book Your 45-Min Appointment →
          </button>
        </div>
      </section>

      <Footer onConsultClick={() => setConsultOpen(true)} />
    </div>
  );
}
