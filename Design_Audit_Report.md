# MedMethod Direct — Design Audit Report

**Date:** March 31, 2026
**Scope:** Full-site visual audit covering the Women's Homepage, Men's Landing Page, State Hub Pages, City Pages (Group A and Group B), Blog, and Global Elements (Navbar, Footer).
**Focus Areas:** Spacing and whitespace, margins and padding uniformity, element alignment, typography consistency, color system adherence, visual glitches, and UX polish.

---

## Executive Summary

The MedMethod Direct app is well-built with strong brand consistency across most pages. The pink gradient system for women and the cyan (#00E5FF) system for men are applied correctly throughout. Typography (Montserrat) is consistent, and the overall section structure follows a repeatable pattern. However, the audit uncovered **23 actionable findings** across 4 severity tiers. The most impactful issues relate to spacing inconsistencies between sections, orphan elements in grids, watermarked stock images, and structural gaps between Group A and Group B city pages.

---

## Findings by Priority

### Priority 1 — Critical (Fix Before Launch)

| # | Page | Issue | Details |
|---|------|-------|---------|
| 1 | Homepage + Men's | **Placeholder videos** | Rick Astley "Never Gonna Give You Up" is the hero video on both pages. Must be replaced with brand video or professional telehealth stock footage. |
| 2 | Homepage + Men's | **Shutterstock watermark** on Vitamins & Supplements service card | Visible watermark on the image — looks unprofessional and potentially a licensing issue. |
| 3 | Homepage + Men's | **"Send Me A Trainer" logo** on Personal Training service card | Third-party brand logo visible in the card image — confusing for users and a branding conflict. |

### Priority 2 — High (Significant Design Polish)

| # | Page | Issue | Details |
|---|------|-------|---------|
| 4 | Men's Page | **FAQ not tabbed** | The men's FAQ uses the old single-list accordion format. The women's homepage FAQ was updated to a tabbed category layout. The men's page should match. |
| 5 | Homepage + Men's | **Orphan service card** (Personal Training) | The 9-card men's services grid leaves 1 card alone in the 3rd row. The 12-card women's grid fills evenly. Consider adding a 10th, 11th, 12th service to the men's page or restructuring the grid. |
| 6 | City Pages | **Group B pages missing sections** | Group B city pages (30 pages) are missing Patient Stories, Our Experts (Medical Team), Nearby Cities cross-links, and "Why Women Choose Us" cards that Group A pages have. This creates a noticeably shorter, thinner page experience. |
| 7 | City Pages | **Group A pages missing breadcrumbs** | Group B pages have breadcrumbs (Home > State > City) but Group A pages (Great Falls, McLean, etc.) do not. Should be consistent. |
| 8 | Men's Page | **"ELITE PERFORMANCE & LONGEVITY TRACK"** title wraps to 3 lines | The right pricing card title is too long compared to the other 1-line titles, causing uneven card heights. Consider shortening to "Elite Performance Track". |

### Priority 3 — Medium (Design System Refinement)

| # | Page | Issue | Details |
|---|------|-------|---------|
| 9 | Homepage | **Excessive whitespace** between Pricing and Key Services sections | There is a large gap (~80px+) between the pricing disclaimer and the "KEY SERVICES" heading. Other section transitions are tighter. |
| 10 | Homepage | **"Virtual Direct Primary Care"** title wraps to 3 lines | All other service card titles are 1-2 lines. This card's title causes uneven card heights in the 4-column grid. Consider shortening to "Virtual Primary Care". |
| 11 | Blog | **Orphan article card** | The 5th blog article sits alone, left-aligned in a new row. Should be centered or the layout should accommodate odd counts gracefully. |
| 12 | Men's Page | **"MOST POPULAR" vs "MOST COMPLETE" badges** use different styles | The center pricing card badge is cyan-filled, while the right card badge is outline-only. Should use the same visual treatment for consistency. |
| 13 | Sitewide | **Section padding not strictly uniform** | Most sections use py-20 or py-24, but some use py-16 or py-12. While not visually jarring, a strict 4-unit spacing system (py-16, py-20, py-24) would improve rhythm. |
| 14 | Homepage | **Doctor photos have different background styles** | Some medical team photos have white backgrounds, others have colored or environmental backgrounds. Consistent photo treatment would look more polished. |
| 15 | Homepage | **Blog card images have inconsistent styles** | The 3 blog preview cards use images with different color temperatures and compositions. Not a bug, but more cohesive imagery would elevate the section. |
| 16 | Homepage + Men's | **"40% OFF FOR PATIENTS" badge** on Personal Training card | This badge uses a different visual treatment (green overlay) than any other service card. It breaks the visual uniformity of the grid. |

### Priority 4 — Low (Nice-to-Have Polish)

| # | Page | Issue | Details |
|---|------|-------|---------|
| 17 | Navbar | **"8 States" icon** uses green circle | The green map-pin icon next to "8 States" doesn't match the brand palette. Consider using the pink accent or removing the icon. |
| 18 | Footer | **Column spacing tight at smaller viewports** | The 5-column footer layout gets cramped around 1024px-1200px viewport widths. Consider collapsing to fewer columns at that breakpoint. |
| 19 | State Hub | **No breadcrumbs** | State hub pages (e.g., /virginia) lack breadcrumbs while city pages have them. Adding "Home > Virginia" would improve navigation consistency. |
| 20 | Men's Page | **Step card descriptions cause uneven heights** | The 4 "How It Works" step cards have descriptions of varying length, causing slight height differences. Consider min-height or truncation. |
| 21 | City Pages | **"Related Reading" pills link to unbuilt blog routes** | The 3 article links in the hero area point to blog posts that don't exist yet. These return empty pages. |
| 22 | Homepage | **Tools for Success background image** partially obscures text | The left-side text in the "Everything You Need to Actually Succeed" section overlaps a background image. Text readability could be improved with a stronger overlay. |
| 23 | Sitewide | **Inconsistent CTA button text casing** | Most CTAs use ALL CAPS ("START YOUR JOURNEY TODAY") but a few use Title Case ("Schedule Free Consultation"). Should standardize. |

---

## What's Working Well

The audit also identified several areas of strong design execution that should be preserved.

The **brand color system** is well-implemented. The pink gradient for women and cyan for men are applied consistently across CTAs, accents, badges, and hover states. The **typography hierarchy** using Montserrat with varied weights creates clear visual structure — large bold headings, medium subheadings, and readable body text. The **section structure** follows a repeatable pattern (label, heading, subtitle, content, CTA) that creates rhythm and predictability. The **pricing cards** are well-designed with clear hierarchy — the center "Most Popular" card is elevated and highlighted. The **FAQ tabbed layout** (on women's pages) is compact and scannable. The **medical team section** builds trust effectively with real photos and credentials. The **stats bars** (10K+, 98%, 4.9★, 15%+) provide strong social proof at the right moment.

---

## Recommended Fix Order

For maximum impact with minimum effort, the following fix sequence is recommended:

1. **Replace placeholder videos** (Priority 1, #1) — highest visual impact, affects first impression
2. **Replace watermarked images** (Priority 1, #2-3) — licensing risk and unprofessional appearance
3. **Add tabbed FAQ to men's page** (Priority 2, #4) — quick win, code already exists from women's page
4. **Shorten long titles** (Priority 2, #8 and Priority 3, #10) — simple text edits, immediate visual improvement
5. **Add breadcrumbs to Group A pages** (Priority 2, #7) — consistency fix, template already exists
6. **Center orphan blog card** (Priority 3, #11) — simple CSS fix
7. **Normalize section spacing** (Priority 3, #13) — systematic pass through all pages
8. **Standardize CTA casing** (Priority 4, #23) — global search-and-replace
