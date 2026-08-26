# MedMethod Direct Homepage and New State-Hub Compliance/UX Audit

**Prepared for:** MedMethod Direct  
**Prepared by:** Manus AI  
**Audit date:** August 26, 2026  
**Pages reviewed:** `/`, `/locations`, `/georgia`, `/illinois`, `/michigan`  
**Status:** **No website content or functionality was changed during this audit.**

## Executive Summary

The homepage remains visually coherent, responsive, and conversion-oriented. It clearly presents the physician, visit purpose, $199 total consultation price, $50 deposit, phone access, and repeated booking actions. The Georgia, Illinois, and Michigan hubs are responsive, use consistent branding, identify the correct states, and integrate correctly with the locations directory, footer, sitemap, metadata, and public route structure.

The principal issue is not visual quality. It is **conversion-flow inconsistency**. The new state hubs currently combine three different offers: a paid 45-minute appointment in the hero, a $179 60-minute laboratory and program setup offer in the middle of the page, and a free 20-minute enrollment-specialist calendar inside the modal. These conflicting promises can reduce trust and make it unclear what the visitor is actually booking.[1] [2] [3] [4]

The audit also identified remaining language on the homepage and shared state-hub components that should be reviewed against the deletion-first compliance instructions, including outcome timelines, guaranteed-prescription wording, free-consultation labels, comparative pricing, quantified claims, thyroid references, fitness-app language, and several result-oriented intake choices.[5] [6]

## Audit Scorecard

| Area | Status | Assessment |
|---|---|---|
| Route availability | Pass | All five audited routes return HTTP 200. |
| Desktop responsiveness | Pass | No visible clipping, overflow, or broken grids. |
| Mobile responsiveness | Pass | Primary content remains readable; mobile layouts are stable. |
| State/jurisdiction accuracy | Pass | Georgia, Illinois, and Michigan are presented correctly within the approved 12-jurisdiction scope. |
| Basic SEO structure | Pass | The new hubs have unique titles, descriptions, canonicals, state schema, FAQ schema, and breadcrumbs.[1] |
| Homepage booking clarity | Pass with review | The $199 total, $50 deposit, and 45-minute visit are presented consistently on the homepage.[5] |
| State-hub booking clarity | **Critical gap** | The state hubs present conflicting free, $179, 20-minute, 45-minute, and 60-minute booking models.[1] [2] [3] [4] |
| Compliance-copy consistency | **High-priority review** | Several homepage and shared state-hub phrases do not align cleanly with the approved deletion-first direction.[2] [3] [4] [5] [6] |
| Navigation integrity | **High-priority review** | Several state-hub navigation links target homepage anchors that no longer exist.[2] [7] |
| Directory expectation setting | Review | Representative community links can appear to be city-specific pages even when they all return to one state hub.[7] |

## What Is Working Well

The homepage has a strong first-screen hierarchy. Visitors can quickly identify Dr. Al-Deek, understand the consultation purpose, see the total price and deposit, call the practice, or begin the booking flow. The mobile sticky actions reduce the risk that the long page hides the conversion path.[5]

The new state hubs are visually consistent and clearly state that care is available statewide. Each page uses a compliant single-face telehealth image, state-specific title and metadata, representative community names, approved service categories, FAQs, and a concluding booking action.[1]

The locations directory accurately lists the approved jurisdictions and provides a useful regional overview. Search, state cards, community pills, and the approved-jurisdiction panel are visually stable on desktop and mobile.[7]

## Critical Findings

### 1. The new state hubs present three incompatible offers

| Page area | Current promise |
|---|---|
| State-hub hero | “Book Your 45-Min Appointment” |
| Setup/pricing section | $179 for bloodwork, a 60-minute physician strategy session, and program setup |
| Header and expanded setup CTA | “FREE CONSULTATION” |
| Modal calendar | A free 20-minute slot with an enrollment specialist |
| Homepage | $199 total, $50 deposit, 45-minute physician consultation |

The state-hub visitor cannot determine whether the next step is a free discovery call, a $179 diagnostic program, or the homepage’s $199 physician visit. The inconsistency is structural because the hubs reuse legacy `Navbar`, `DiagnosticSetup`, `HowItWorks`, and `ConsultationModal` components instead of the current homepage’s booking model.[1] [2] [3] [4] [5]

**Recommended fix:** Make the homepage’s paid 45-minute consultation the single source of truth. Replace the state-hub header CTA, pricing block, process section, and modal with the same $199/$50-deposit flow used by the homepage. Preserve the state-specific hero, community, service, FAQ, and SEO content.

### 2. “Free consultation” remains active on the new state hubs

The desktop header, mobile menu, setup CTA, calendar URL, and calendar instruction all describe a free consultation.[2] [3] [4] This conflicts with the previously confirmed policy that there is no free consultation and with the paid state-hub hero.

**Recommended fix:** Remove all free-consultation labels from the state-hub path and route every primary state-hub CTA to the approved paid booking modal.

## High-Priority Findings

### 3. The state-hub setup section contains outdated or compliance-sensitive claims

The shared setup block contains “SAVE $270 · JUNE ONLY,” a “Typical Out-of-Pocket Cost Elsewhere” comparison, a 70% hormonal-imbalance statistic, thyroid-condition wording, fitness-app setup, and prescriptive statements about laboratory requirements.[3]

The seasonal label is also outdated for an August 2026 page. More importantly, these statements reintroduce comparison, quantified-result, thyroid, and fitness wording that the compliance work intended to remove or tightly restrict.[6]

**Recommended fix:** Remove the legacy setup block from the three new state hubs rather than rewriting it. Use the homepage consultation/pricing section or a compact neutral appointment summary.

### 4. The state-hub process describes a different business model

The shared process section states “This Isn’t a Subscription. It’s a Program,” begins with a free discovery call, requires laboratory scheduling, describes a 60-minute physician session, and ends with a program launch.[4] This conflicts with the homepage’s consultation-first model and optional ongoing-care choices.

**Recommended fix:** Replace the legacy process with the homepage’s actual steps: complete intake, reserve the 45-minute visit with a $50 deposit, meet with Dr. Al-Deek, and receive clinically appropriate recommendations.

### 5. Several state-hub navigation links target missing homepage sections

The shared state-hub navigation links to `#services`, `#about`, and `#book`, but the current homepage does not contain those section IDs.[2] [5] Visitors who select those links are returned to the homepage without reaching the expected section.

**Recommended fix:** Remove obsolete navigation items or remap them only to verified destinations such as pricing, how it works, FAQ, blog, locations, and patient login.

### 6. Homepage wording still requires a compliance pass

The homepage contains result timelines, broad benefit/risk language, an absolute virtual-versus-in-person equivalence statement, a thyroid-health reference, generalized hormone-medication pricing, and a final CTA saying the patient will leave with a prescription.[5]

**Recommended fix:** Delete or qualify those complete statements without changing the page layout. The final CTA should say a prescription may be issued **if clinically appropriate**.

## Medium-Priority UX Findings

### 7. The locations directory can overstate city-page coverage

The directory displays “99+ Cities Listed” and labels each state card with “cities served.” For Georgia, Illinois, and Michigan, every community pill links to the same state hub rather than a city-specific page.[7]

**Recommended fix:** Label those community names as “Representative service areas” or “Communities served statewide.” Keep the state-hub links, but avoid language suggesting that each community has a separate guide.

### 8. The new state hubs have limited unique content

The three hubs have unique state names, metadata, community lists, and one regional paragraph, but most visible sections are identical because they share one template.[1]

**Recommended fix:** Add one concise, factual state-specific access paragraph and one state-specific FAQ per page. Do not add claims, testimonials, local-office implications, or unsupported city routes.

### 9. The mobile footer is disproportionate to the state-page body

The mobile state hubs end with a long shared footer after the final CTA. The links are useful, but the volume dilutes the page’s conversion endpoint.

**Recommended fix:** Keep the full legal and location access but consider a more compact state-page footer variant after the booking CTA.

### 10. The homepage is exceptionally long on mobile

The mobile homepage includes numerous condition cards, detailed pricing, medication cards, process steps, FAQs, disclosures, and a large footer. The sticky CTA preserves access to booking, but the reading load remains high.[5]

**Recommended fix:** Preserve the core order while shortening repeated symptom content and reducing low-value repetition. Do not redesign the approved pricing or booking sections.

## Low-Priority UX Findings

The homepage condition cards use pointer and hover styling despite not being interactive, and the mobile carousel does not provide a visible swipe cue.[5] The state-hub community cards are informational, while the same names appear as links on `/locations`, which creates inconsistent interaction expectations.[1] [7]

**Recommended fix:** Remove pointer styling from static cards, add a subtle mobile swipe cue where appropriate, and label representative community groups consistently.

## Recommended Approval Package

| Package | Scope | Recommendation |
|---|---|---|
| A — Critical flow alignment | Remove free-consultation path; align all state-hub CTAs, price, duration, process, and modal with the homepage’s $199/$50-deposit 45-minute visit | **Approve first** |
| B — Compliance-copy cleanup | Remove/qualify the identified homepage timelines, prescription guarantee, virtual-equivalence claim, thyroid wording, state-hub comparisons, statistic, and fitness wording | **Approve with Package A** |
| C — Navigation and directory clarity | Repair dead anchors; relabel representative communities; clarify state-hub versus city-guide coverage | Approve next |
| D — Mobile simplification | Shorten repeated homepage content and compact the state-hub footer without redesigning core booking sections | Optional optimization |
| E — State-page differentiation | Add one factual state-specific paragraph and FAQ to each new hub | Optional SEO/UX improvement |

## Recommended Decision

Approve **Packages A, B, and C** as one focused repair. They address the highest-risk compliance and user-flow issues while preserving the current visual design and the valid state-specific structure. Packages D and E can be reviewed separately after the booking funnel is consistent.

> This report is a website content and user-experience review, not legal or regulatory advice. Final certification decisions remain with LegitScript and qualified regulatory counsel.

## References

[1]: ../client/src/components/location/StateHubPage.tsx "Shared Georgia, Illinois, and Michigan State Hub Template"
[2]: ../client/src/components/Navbar.tsx "Shared State-Hub Navigation"
[3]: ../client/src/components/DiagnosticSetup.tsx "Legacy Setup and Pricing Component"
[4]: ../client/src/components/HowItWorks.tsx "Legacy Program Process Component"
[5]: ../client/src/pages/HomeHrt3.tsx "Current Homepage"
[6]: compliance-instructions-gap-report.md "Approved 2026-08-25 Compliance Instructions Gap Analysis"
[7]: ../client/src/pages/Locations.tsx "Locations Directory"
