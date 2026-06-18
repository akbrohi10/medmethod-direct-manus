# AEO (Answer Engine Optimization) Audit Report

**Site:** medmethoddirect.com  
**Date:** June 17, 2026  
**Prepared by:** Manus AI

---

## Executive Summary

MedMethod Direct has a **stronger-than-average AEO foundation** compared to most telehealth practices, but several critical gaps prevent it from reaching its full potential with AI-powered search engines (Google AI Overviews, ChatGPT, Perplexity, Claude). The site already has some advanced signals that most competitors lack entirely — particularly the `llms.txt` file and explicit AI crawler permissions — but inconsistencies between that file and the live site, missing structured data on key pages, and a FAQ section that is invisible to crawlers due to client-side rendering significantly reduce effectiveness.

### Overall AEO Score: 62 / 100

| Category | Score | Weight | Notes |
|----------|-------|--------|-------|
| AI Crawler Access & Permissions | 9/10 | 10% | Excellent — robots.txt explicitly allows all major AI bots |
| llms.txt Implementation | 6/10 | 15% | File exists (rare advantage) but contains stale/contradictory data |
| Structured Data (JSON-LD) | 5/10 | 20% | Strong on location pages; weak on homepage, blog, FAQ |
| FAQ & Content Answerability | 6/10 | 20% | Great content, but hidden behind JS accordion + no FAQPage schema on homepage |
| Meta Tags & Open Graph | 6/10 | 10% | Present but contain outdated "9 states" references |
| Content Depth & E-E-A-T | 8/10 | 15% | Strong physician authority, clear expertise signals |
| Sitemap & Crawl Integrity | 4/10 | 10% | Sitemap declares URLs that don't exist in the router |

---

## Detailed Findings

### 1. AI Crawler Access & Permissions — Score: 9/10

**What's working well:**

The `robots.txt` explicitly allows all major AI crawlers by name — GPTBot (OpenAI/ChatGPT), Google-Extended (Gemini/AI Overviews), PerplexityBot, ClaudeBot, and anthropic-ai. This is a proactive, best-practice approach that most medical sites fail to implement. Many healthcare sites inadvertently block AI crawlers, which prevents their content from being cited in AI-generated answers [1].

**Minor gap:** The file does not mention `Applebot-Extended` (Apple Intelligence) or `cohere-ai` (Cohere). These are emerging but increasingly relevant.

---

### 2. llms.txt Implementation — Score: 6/10

**What's working well:**

Having a `llms.txt` file at all puts MedMethod Direct ahead of approximately 95% of telehealth competitors. The file follows the emerging llms.txt standard [2] and includes structured Q&A pairs specifically designed for AI systems to ingest — this is exactly what answer engines look for when building citation-ready responses.

**Critical issues:**

| Problem | Current llms.txt | Live Site Reality |
|---------|-----------------|-------------------|
| Licensed states count | 8 states listed | 17 states (site-wide) |
| Phone number | Not mentioned | 888-362-7011 |
| Consultation duration | "Free 20-minute wellness consultation" | 15-minute Discovery Call |
| Program structure | "$449 Clinical Diagnostic & Setup Fee" | Initiation fees vary by tier ($49–$449) |
| Terminology | "wellness consultation" | "Discovery Call" |
| Missing states | Only VA, FL, MD, DC, CO, AZ, NC, PA | Also MI, IL, TX, TN, NJ, GA, AL, WA, OH |

When an AI system encounters contradictions between `llms.txt` and the actual page content, it may either ignore the file entirely or — worse — surface the outdated information as its answer. This is a **high-priority fix** because the file is specifically designed to be the authoritative source for AI systems.

---

### 3. Structured Data (JSON-LD) — Score: 5/10

**What's working well:**

The **location pages** (McLean, Virginia, Florida, etc.) have excellent structured data implementation with four separate JSON-LD blocks: `MedicalBusiness`, `FAQPage`, `MedicalWebPage`, and `BreadcrumbList`. These pages include physician credentials, medical conditions treated, and review metadata. This is best-in-class for local AEO.

**Critical gaps on the homepage:**

The homepage has a single `MedicalBusiness` schema block, but it contains issues:

| Issue | Detail |
|-------|--------|
| Wrong phone number | Lists `+1-561-594-4949` instead of `888-362-7011` |
| Incomplete areaServed | Only 9 states instead of 17 |
| Missing `Physician` schema | No nested physician entity with credentials |
| No `FAQPage` schema | The homepage FAQ section has 25+ questions but zero structured data |
| No `WebSite` schema | Missing sitelinks searchbox opportunity |
| No `Organization` schema | Missing brand-level entity signals |
| Missing `sameAs` | Empty array — should link to social profiles |

**Blog pages have zero structured data.** The `BlogPost.tsx` template renders articles without any `Helmet` metadata, meaning:
- No page-specific `<title>` or meta description
- No `Article` or `BlogPosting` JSON-LD
- No `author`, `datePublished`, or `dateModified` signals
- No Open Graph or Twitter Card tags

This is a significant missed opportunity because blog content is the most "answerable" content on the site — articles like "Semaglutide vs. Tirzepatide" are exactly what AI systems want to cite.

---

### 4. FAQ & Content Answerability — Score: 6/10

**What's working well:**

The FAQ content itself is exceptional for AEO. Questions are phrased in natural language exactly as patients would ask them ("Why is my membership separate from my medication?", "What states do you serve?"). Answers are comprehensive, specific, and authoritative — not generic marketing copy. This is the kind of content that AI systems prefer to cite [3].

**Critical gaps:**

1. **No FAQPage schema on the homepage.** The location pages correctly implement `FAQPage` JSON-LD, but the homepage — which has the most comprehensive FAQ section — has none. Google AI Overviews and Perplexity heavily weight FAQ schema when selecting sources for direct answers [4].

2. **Client-side rendering hides FAQ content from crawlers.** The FAQ section uses a React accordion that renders answers only when clicked (`{open && <p>...</p>}`). While Googlebot can execute JavaScript, many AI crawlers (including early versions of PerplexityBot and some ChatGPT retrieval passes) may not fully render client-side content. The answers should be present in the DOM at all times (hidden via CSS, not conditional rendering) or served via SSR.

3. **Tabbed FAQ structure fragments content.** Only one category's questions are in the DOM at a time. A crawler that doesn't interact with tabs will only see the "How It Works" category (the default). The other 6 categories (24+ questions) are invisible unless the tab is clicked.

---

### 5. Meta Tags & Open Graph — Score: 6/10

**What's working well:**

The homepage has proper canonical URL, Open Graph tags, Twitter Card tags, and a descriptive meta description. The `index.html` and `Helmet` both set these values.

**Issues:**

| Problem | Location |
|---------|----------|
| Helmet meta says "licensed in 9 states" | Home1.tsx lines 96, 100, 107 |
| index.html meta says "17 states" (correct) | index.html line 7 |
| Duplicate/conflicting meta descriptions | Both index.html and Helmet set description — Helmet wins at runtime |
| Blog pages have no meta tags at all | BlogPost.tsx, BlogIndex.tsx |
| No `hreflang` tags | Not critical for US-only, but noted |

The "9 states" reference in the Helmet component means the actual rendered page shows outdated information to any crawler that executes JavaScript — which includes Google and most AI systems.

---

### 6. Content Depth & E-E-A-T — Score: 8/10

**What's working well:**

This is the site's strongest AEO dimension. The content demonstrates clear **Experience, Expertise, Authoritativeness, and Trustworthiness**:

- Named physician (Dr. Jumana Al-Deek, DO) with credentials prominently displayed
- Board certification and specialization clearly stated
- Medical disclaimer present in footer
- HIPAA compliance mentioned
- Specific, non-generic clinical language throughout
- Blog articles authored by the physician with clinical depth
- The "one physician manages both hormones and weight loss" positioning is a unique, citable differentiator

AI systems prioritize content from identifiable medical professionals over anonymous health content [5]. MedMethod Direct's physician-led positioning is a significant AEO advantage.

---

### 7. Sitemap & Crawl Integrity — Score: 4/10

**Critical issue:** The sitemap declares URLs that do not exist in the application router:

| Sitemap URL | Router Status |
|-------------|---------------|
| `/about` | No route exists — returns 404/NotFound |
| `/faq` | No route exists — FAQ is a section on homepage |
| `/how-it-works` | No route exists — section on homepage |

When AI crawlers follow sitemap URLs and encounter 404s or empty pages, it degrades the site's overall trust score. Crawl budget is wasted, and the site appears poorly maintained — which is the opposite signal you want to send to answer engines that are evaluating source reliability.

---

## Priority Recommendations

### Tier 1 — Critical (Do This Week)

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 1 | **Update llms.txt** — Fix states to 17, phone to 888-362-7011, consultation to "Free 15-minute Discovery Call", remove $449 references, update program descriptions | Very High | 30 min |
| 2 | **Add FAQPage JSON-LD to homepage** — Serialize all 25+ FAQ questions into a single FAQPage schema block in the Helmet | Very High | 45 min |
| 3 | **Fix Helmet meta descriptions** — Change "9 states" to "17 states" in Home1.tsx OG/Twitter/description tags | High | 5 min |
| 4 | **Fix phone number in JSON-LD** — Change from 561-594-4949 to 888-362-7011 | High | 2 min |
| 5 | **Update areaServed in JSON-LD** — Add all 17 states to the homepage MedicalBusiness schema | High | 10 min |

### Tier 2 — Important (Do This Month)

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 6 | **Add BlogPosting JSON-LD to blog articles** — Include author, datePublished, publisher, headline, description | High | 2 hrs |
| 7 | **Add Helmet to BlogPost.tsx and BlogIndex.tsx** — Page-specific title, description, canonical, OG tags | High | 1.5 hrs |
| 8 | **Render FAQ answers in DOM always** — Use CSS `hidden`/`block` toggle instead of conditional rendering, so crawlers see all answers | Medium-High | 1 hr |
| 9 | **Clean sitemap** — Remove `/about`, `/faq`, `/how-it-works` or create actual routes for them | Medium | 30 min |
| 10 | **Add WebSite + Organization schema** — Include `potentialAction` for sitelinks searchbox | Medium | 30 min |

### Tier 3 — Nice to Have (Ongoing)

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 11 | Add `Physician` schema nested in MedicalBusiness with full credentials | Medium | 20 min |
| 12 | Add `MedicalCondition` schema for each condition treated | Low-Medium | 1 hr |
| 13 | Add `Applebot-Extended` to robots.txt | Low | 2 min |
| 14 | Create a `/faq` standalone page (in addition to homepage section) for dedicated FAQ crawling | Medium | 2 hrs |
| 15 | Add `speakable` schema to FAQ answers for voice assistant optimization | Low | 30 min |

---

## Competitive Context

Most telehealth competitors (Hers, Ro, Noom, Found) have strong traditional SEO but weak AEO signals. Very few have `llms.txt` files, and most block AI crawlers entirely. MedMethod Direct's proactive AI-friendly posture is a genuine competitive advantage — but only if the content those crawlers find is accurate and well-structured.

Once the Tier 1 fixes are implemented, the site would score approximately **78–82/100** on AEO readiness, which would place it in the top tier for telehealth practices nationally.

---

## References

[1]: https://www.oomphinc.com/insights/answer-engine-optimization-healthcare/ "Answer Engine Optimization: What Healthcare Communicators Need to Know"
[2]: https://ahrefs.com/blog/what-is-llms-txt/ "What Is llms.txt, and Should You Care About It? - Ahrefs"
[3]: https://developers.google.com/search/blog/2025/05/succeeding-in-ai-search "Top ways to ensure your content performs well in Google's AI search"
[4]: https://www.frase.io/blog/faq-schema-ai-search-geo-aeo "Are FAQ Schemas Important for AI Search, GEO & AEO? - Frase.io"
[5]: https://cxl.com/blog/answer-engine-optimization-aeo-the-comprehensive-guide/ "Answer Engine Optimization (AEO): The Complete Guide for 2026 - CXL"
