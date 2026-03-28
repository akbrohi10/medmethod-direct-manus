# MedMethod Direct — SEO Strategy Audit Report
**Prepared:** March 27, 2026 | **Scope:** Full site vs. agreed content strategy

---

## Executive Summary

The site has a strong technical SEO foundation and has implemented the highest-priority content from the blog strategy. However, **significant portions of the agreed keyword and location strategy remain unbuilt**. Of the 8 licensed states, only Virginia has any location page infrastructure, and within Virginia only McLean is live. Of the 50 planned blog topics and 15 detailed briefs, only 5 articles are published. The on-page technical signals (meta descriptions, structured data, canonical tags) are partially in place but missing several critical elements. The table below summarizes the overall completion status by category.

| SEO Category | Strategy Scope | Currently Live | Completion |
|---|---|---|---|
| Blog articles (priority 5) | 5 articles | 5 articles | **100%** |
| Blog articles (full roadmap) | 50 topics | 5 articles | **10%** |
| Virginia location pages | 7 pages | 1 page (McLean) | **14%** |
| State-level landing pages | 8 states | 0 pages | **0%** |
| Structured data (JSON-LD) | All pages | 0 pages | **0%** |
| On-page meta tags | All pages | Partial | **~60%** |
| Internal linking architecture | Full network | Partial | **~40%** |
| `llms.txt` / AI discoverability | All states | 6 states listed | **75%** |
| Sitemap completeness | All live URLs | 8 URLs | **Partial** |

---

## 1. Blog Content: What Is Live vs. What Was Planned

### What Is Live

All five of the **Top 5 Priority Articles** identified in the content strategy have been written and published. This is the most important content milestone and is fully complete.

| Slug | Primary Keyword | Pillar | Status |
|---|---|---|---|
| `why-weight-gain-feels-different-in-menopause` | menopause weight gain | Menopause & Metabolism | ✅ Live |
| `what-is-food-noise-midlife` | food noise midlife | GLP-1 Education | ✅ Live |
| `semaglutide-vs-tirzepatide-women-midlife` | semaglutide vs tirzepatide women | GLP-1 Education | ✅ Live |
| `hormone-therapy-weight-sleep-metabolism` | hormone therapy weight loss menopause | Hormone Therapy | ✅ Live |
| `putting-yourself-last-has-to-change` | women's health midlife self-care | Symptoms & Identity | ✅ Live |

### What Is Missing from the Blog Strategy

The remaining 10 articles from the Top 15 Detailed Briefs have not yet been written. These represent the next highest-priority content investments, ordered by their brief priority ranking:

| Brief # | Working Title | Primary Keyword | Pillar | Priority |
|---|---|---|---|---|
| 5 | What Does Testosterone Actually Do for Women? | testosterone for women | Hormone Therapy | High |
| 6 | Can GLP-1s and Hormone Therapy Work Better Together? | GLP-1 and hormone therapy | Hormone Therapy | High |
| 7 | Insulin Resistance and Menopause: The Hidden Connection | insulin resistance menopause | Menopause & Metabolism | High |
| 8 | Why You Feel Like a Different Person in Perimenopause | perimenopause symptoms | Symptoms & Identity | High |
| 9 | The Truth About HRT and Breast Cancer Risk | HRT breast cancer risk | Hormone Therapy | High |
| 10 | What to Expect in the First 90 Days on a GLP-1 | semaglutide first 90 days | GLP-1 Education | Medium |
| 11 | Why Am I So Tired All the Time? Midlife Fatigue | fatigue perimenopause | Symptoms & Identity | Medium |
| 12 | Compounded Semaglutide vs. Brand-Name Ozempic | compounded semaglutide vs Ozempic | GLP-1 Education | Medium |
| 13 | Brain Fog in Menopause: Is It Real? | menopause brain fog | Symptoms & Identity | Medium |
| 14 | Muscle Is the Organ of Longevity | muscle loss menopause | Longevity | Medium |

Beyond the Top 15, there are 35 additional topics in the full 50-topic roadmap that have not yet been assigned briefs or written. The **Longevity & Healthy Aging** pillar (topics 31–40) and the remaining **Symptoms & Identity** topics (topics 41–50) are entirely unrepresented in the live blog.

Additionally, the **Virginia-specific blog article** planned in the keyword strategy — *"Why Women in Northern Virginia Are Choosing Virtual Hormone Care Over Their Local OB/GYN"* (slug: `/blog/virtual-vs-local-hormone-care-northern-virginia`) — has not been written. This article was identified as an SEO asset that supports all location pages and targets the keyword cluster `virtual vs in-person hormone therapy Virginia`.

---

## 2. Location Pages: Virginia Strategy

### What Is Live

The McLean location page (`/virginia/mclean`) is fully built and live. It correctly implements the strategy's recommended content structure: a "Looking for a Menopause Doctor Near McLean?" persuasion section, a virtual vs. local comparison table, McLean-specific FAQ, and local neighborhood references (Great Falls, Vienna, Reston, Arlington). All 9 primary keyword targets for McLean are represented in the page copy.

### What Is Missing from the Virginia Strategy

The strategy defined a 7-page Virginia build order. Only 1 of 7 pages exists.

| Priority | Page | URL | Status | Keyword Targets |
|---|---|---|---|---|
| 1 | Virginia state hub | `/virginia` | ❌ Not built | 7 state-level keywords |
| 2 | McLean | `/virginia/mclean` | ✅ Live | 9 keywords |
| 3 | Great Falls | `/virginia/great-falls` | ❌ Not built | 5 keywords |
| 4 | Vienna / Tysons | `/virginia/vienna` | ❌ Not built | 6 keywords |
| 5 | Reston | `/virginia/reston` | ❌ Not built | 6 keywords |
| 6 | Arlington | `/virginia/arlington` | ❌ Not built | 6 keywords |
| 7 | Virtual vs. Local blog | `/blog/virtual-vs-local-hormone-care-northern-virginia` | ❌ Not built | 3 keywords |

The `/virginia` state hub page is the most important missing piece. It serves as the internal linking root for all neighborhood pages and targets the 7 state-level keywords (`online menopause doctor Virginia`, `virtual hormone therapy Virginia`, `telehealth menopause treatment Virginia`, etc.). Without it, the neighborhood pages lack a parent page to link to and from, which weakens the topical authority signal for the entire Virginia cluster.

---

## 3. Other Licensed States: No Pages Built

The site is licensed in 8 states: Florida, Virginia, Maryland, Washington DC, Colorado, Arizona, North Carolina, and Pennsylvania. The `llms.txt` file currently lists only 6 of these (omitting North Carolina and Pennsylvania). **No state-level or city-level landing pages exist for any state other than Virginia.** This represents the largest untapped SEO opportunity on the site.

Each state should eventually have at minimum:
- A state hub page (e.g., `/florida`, `/maryland`)
- 3–5 high-value city/neighborhood pages targeting the same keyword pattern used for Virginia

---

## 4. Technical SEO: On-Page Signals

### Meta Tags

The blog articles each have well-crafted `metaDescription` values stored in `blogPosts.ts` and the McLean page has a proper title tag and meta description. However, the following pages are missing or have generic meta descriptions:

| Page | Meta Title | Meta Description | Status |
|---|---|---|---|
| Homepage (`/`) | MedMethod Direct — Your Path to Longevity | Generic tagline only | ⚠️ Needs keyword enrichment |
| Men's page (`/male`) | Unknown | Unknown | ⚠️ Needs audit |
| Blog index (`/blog`) | Unknown | Unknown | ⚠️ Needs dedicated meta |
| `/virginia/mclean` | Set correctly | Set correctly | ✅ Good |
| All blog articles | Set correctly | Set correctly | ✅ Good |

The homepage meta title should include the primary keyword cluster (`virtual menopause doctor`, `hormone therapy online`, `GLP-1 weight loss`) rather than just the brand tagline.

### Structured Data (JSON-LD): Not Implemented

**No page on the site currently has JSON-LD structured data.** This is a significant gap. The strategy document noted that `MedicalBusiness` and `LocalBusiness` schema should be added to location pages, and `Article` / `MedicalWebPage` schema should be added to blog posts. The specific schemas needed are:

| Page Type | Schema Type | SEO Benefit |
|---|---|---|
| Homepage | `MedicalBusiness`, `Organization` | Brand knowledge panel, rich results |
| Blog articles | `Article`, `MedicalWebPage` | Article rich results, author authority |
| Location pages | `MedicalBusiness`, `LocalBusiness` | Local pack eligibility, "near me" results |
| FAQ sections | `FAQPage` | FAQ rich results (accordion in SERPs) |

The FAQ sections on both the homepage and the McLean page are strong candidates for `FAQPage` schema, as Google frequently surfaces these as expanded accordion results in search — a significant CTR boost for branded and local queries.

### Canonical Tags

Canonical tags have not been verified as present on all pages. For a single-page React app using Wouter routing, canonical tags must be set dynamically per route. This should be confirmed and implemented using a `<Helmet>` or equivalent per-page meta component.

### Sitemap Completeness

The current `sitemap.xml` lists 8 URLs. It is missing the `/male` page (which is in the sitemap — confirmed) but will need to be updated each time a new location page or blog article is added. A dynamic sitemap generator would be preferable to a static XML file as the site scales.

---

## 5. Internal Linking Architecture

The strategy relies on a hub-and-spoke internal linking model: state hub pages link to neighborhood pages, neighborhood pages link to relevant blog articles, and blog articles link back to service pages and consultation CTAs. The current state of internal linking is:

- **Blog articles → Services page:** Present (each article has a CTA linking to consultation)
- **Blog articles → Other articles:** Partially present (some cross-links exist)
- **McLean page → Blog articles:** Present (links to relevant articles in the "Why Virtual Wins" section)
- **Homepage → McLean page:** Now present via Locations navbar link (added today)
- **McLean page → `/virginia` hub:** Broken — links to a `/virginia` page that does not yet exist
- **State hub pages → Neighborhood pages:** Cannot exist until state hub pages are built

The most urgent internal linking fix is to either build the `/virginia` state hub page or temporarily redirect the McLean page's Virginia references to the homepage until the hub is built.

---

## 6. `llms.txt` and AI Discoverability

The `llms.txt` file is a meaningful differentiator — very few medical telehealth sites have implemented this. However, two issues need correction:

1. **Missing states:** North Carolina and Pennsylvania are licensed states not listed in the `llms.txt` services coverage section.
2. **Stale as pages are added:** Each new location page and blog article needs to be manually added to `llms.txt`. This file should be updated with every content deployment.

---

## 7. Prioritized Action Plan

The following table ranks the remaining SEO work by impact and effort, to guide the build order going forward.

| Priority | Action | Impact | Effort | Rationale |
|---|---|---|---|---|
| 1 | Build `/virginia` state hub page | Very High | Low | Unlocks the full Virginia keyword cluster and provides internal linking root |
| 2 | Add `FAQPage` JSON-LD to homepage and McLean page | High | Low | FAQ rich results are a quick SERP CTR win with no content work required |
| 3 | Add `MedicalBusiness` + `Article` JSON-LD sitewide | High | Medium | Required for local pack eligibility and article rich results |
| 4 | Write the 5 remaining high-priority blog briefs (#5–9) | High | High | Fills the hormone therapy and identity pillars; captures high-intent searches |
| 5 | Build Great Falls and Vienna location pages | High | Medium | Next two highest-value Virginia neighborhoods per the strategy |
| 6 | Enrich homepage meta title with primary keywords | Medium | Very Low | Immediate on-page SEO improvement, 10-minute fix |
| 7 | Write the Virginia virtual vs. local blog article | Medium | Medium | Supports all Virginia location pages; targets a low-competition keyword cluster |
| 8 | Build Reston and Arlington location pages | Medium | Medium | Completes the Virginia neighborhood network |
| 9 | Fix `llms.txt` state list (add NC and PA) | Low | Very Low | Accuracy fix for AI crawler discoverability |
| 10 | Begin Florida or Maryland state + city pages | Medium | High | Opens the next highest-value state markets |

---

*Audit prepared for MedMethod Direct | March 27, 2026*
