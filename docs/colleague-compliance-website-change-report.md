# MedMethod Direct Website Compliance Update

**Prepared for internal sharing**  
**Prepared by:** Manus AI  
**Date:** August 26, 2026  
**Implementation checkpoint:** `bb04542e`

## Executive Summary

MedMethod Direct completed a broad website update based on the supplied LegitScript audit and the follow-up website instructions dated August 25, 2026. The work used a **deletion-first approach**: prohibited or unsupported claims were removed rather than replaced with new medical claims. The project now uses the approved service categories and licensing scope, includes the required medication disclosures, redirects discontinued URLs, and removes noncompliant material from visible pages, metadata, structured data, public indexing files, and unused legacy modules.[1]

The implementation has been completed in the project and saved as checkpoint `bb04542e`. Publication to the live domain should be confirmed separately. This summary documents the work performed; it is not a guarantee of certification and does not replace review by LegitScript or qualified regulatory counsel.

## Changes at a Glance

| Area | Before the Update | After the Update |
|---|---|---|
| Licensing presentation | Multiple pages contained inconsistent 9-state or 17-state references, and the locations page showed a nine-state map with nationwide-expansion language. | Licensing copy now uses the exact **12 approved jurisdictions**. The stale map and all-50-states messaging were removed. |
| Medication marketing | Certain pages used drug-brand names, medication-versus-medication framing, pricing comparisons, equivalence language, or affordability promotion. | Prohibited brands and comparison framing were removed. Medication language is neutral and tied to individualized physician review. |
| Testimonials and outcomes | Hardcoded testimonials, quantified results, body/muscle claims, transformation language, and broad result promises appeared across active and legacy content. | Those sections, sentences, FAQ objects, cards, notifications, quiz answers, and legacy modules were deleted. |
| Service categories | The site included longevity, thyroid, peptide, fitness/coaching, transformation, and men’s treatment language outside the approved scope. | Public menus and intake choices are restricted to the five approved service categories. Non-Florida women’s-testosterone references were removed. |
| Disclosures | Compounded-medication and women’s-testosterone wording varied by page or was missing. | A shared component now delivers the exact required compounded-medication disclosure and the exact Florida-only women’s-testosterone disclosure where applicable. |
| Discontinued pages | Removed pages could return a not-found screen or remain exposed through old routes, links, sitemaps, or indexes. | Discontinued URLs now use genuine server-side HTTP 301 redirects, and related registry, sitemap, cross-link, crawler, and index references were removed. |
| Footer and navigation | Some footer links, labels, social placeholders, and service names were outdated, misleading, or pointed to removed content. | Both footer variants now use approved labels and verified destinations. Placeholder and obsolete links were removed. |

## Representative Before-and-After Visual

The locations page provides the clearest visual example. The original version displayed a nine-state map, “9 Active States,” a “50 States Goal,” and nationwide-expansion messaging. The revised version displays the exact 12 approved jurisdictions and clearly separates the licensing statement from the existing detailed city guides.[2]

![MedMethod Direct locations and licensing presentation before and after](https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/dTjhXymPZAVkoBOs.png)

> **Screenshot note:** This is a representative desktop comparison of the same `/locations` route. Some compliance changes—such as metadata cleanup, redirects, disclosures, and removal of hidden legacy modules—are not visible in screenshots and are documented below.

## Approved Licensing Scope

The site now identifies MedMethod Direct as licensed in the following **12 jurisdictions**:

| Approved Jurisdictions |  |  |
|---|---|---|
| Florida | Arizona | Colorado |
| District of Columbia | Georgia | Illinois |
| Maryland | Michigan | North Carolina |
| Pennsylvania | Texas | Virginia |

Tennessee, New Jersey, Alabama, Washington State, and Ohio were removed from licensing statements and location-based social-proof arrays. References to Washington, DC were retained only when they refer to the approved District of Columbia. Terms of Service, page metadata, structured data, public indexing information, and visible state counts were aligned to the same scope.[1]

## Pages Removed or Unpublished

The following public pages or legacy routes were removed because their primary purpose relied on noncompliant comparisons, brands, services, claims, or duplicate content. Their URLs now return HTTP 301 redirects instead of serving the removed material.[1]

| Discontinued URL | Current Destination |
|---|---|
| `/male` | `/` |
| `/pricing-guide` | `/` |
| `/blog/semaglutide-vs-tirzepatide-women-midlife` | `/blog` |
| `/the-menopause-weight-loss-trap` | `/` |
| `/guide/how-it-works` | `/` |
| `/before-you-start-treatment` | `/` |
| `/start/women` | `/` |
| `/home-1`, `/home-v1`, `/home-2`, `/home-3` | `/` |
| `/lp/hrt` | `/lp/hrt3` |
| `/lp/glp1` | `/lp/WL` |

The implementation deleted **19 obsolete page and shared-component source files** and removed additional noncompliant sections from active pages. This included hardcoded testimonial components, comparison-heavy pricing sections, transformation and longevity program cards, fitness/coaching modules, disallowed treatment content, and duplicate legacy pages.[1]

## Content Revisions Across Active Pages

The active homepage, HRT pages, weight-management pages, location pages, blog, legal pages, and intake modals were reviewed together. Complete sentences or blocks were removed when they contained prohibited material; surrounding layouts were repaired so pages remained coherent rather than displaying blank or broken sections.

| Content Type | Action Completed |
|---|---|
| Drug brands and comparisons | Removed named-brand promotional content, medication-versus-medication framing, “same active ingredient” language, and compounded-versus-brand pricing or affordability comparisons. |
| Testimonials and quantified outcomes | Removed hardcoded testimonial sections, weight-loss ranges, pounds lost, body-composition promises, transformation statements, and broad result claims. |
| Services outside scope | Removed longevity medicine, thyroid optimization/treatment, peptide therapy, men’s hormone treatment, fitness coaching, personal training, workout/meal-plan promotion, and transformation program language. |
| Intake and payment labels | Restricted service selections and operational labels while preserving plan IDs, prices, payment processing, and submission behavior. |
| Blogs and metadata | Removed prohibited categories and phrases from article content, registry records, crawler descriptions, structured data, sitemap/public index references, and global metadata. |
| Location templates | Removed noncompliant testimonials, program cards, unsupported service blocks, comparison FAQs, and non-Florida women’s-testosterone references across the location-page library. |

## Required Medication Disclosures

The exact required disclosures were implemented through a shared component to avoid wording drift across pages.[3]

### Compounded Medication Disclosure

> Compounded medications are not FDA-approved. They are prepared by licensed compounding pharmacies for an individual patient based on a prescription. FDA-approved alternatives are available and will be discussed with you by your physician. Results vary. Treatment requires ongoing medical monitoring.

This disclosure is displayed on every remaining page that mentions compounded semaglutide or compounded tirzepatide. The final implementation audit identified **92** relevant page/article placements with required coverage.[1]

### Florida Women’s Testosterone Disclosure

> Testosterone is prescribed off-label for hypoactive sexual desire disorder in women. There is no FDA-approved testosterone product for women in the United States. This treatment is available only to patients in Florida.

Non-Florida treatment references were removed. The final implementation audit identified **14** Florida or HRT page placements using the required disclosure.[1]

## Functionality Preserved

The compliance changes were designed not to disrupt the operational systems that support the business. The following functionality remains in the project:

| Preserved System | Status |
|---|---|
| Stripe payments | Preserved, including deposit and WL2 flows |
| PayPal payments | Preserved; the public configuration endpoint returned HTTP 200 during verification |
| $50 deposit and scheduled balance workflow | Preserved |
| WL2 one-time $15 payment flow | Preserved |
| GHL intake and payment webhooks | Preserved |
| Intake forms and booking calendars | Preserved |
| Admin payment settings and sweep controls | Preserved |
| Scheduled charge sweep | Preserved and registered at server startup |

## Validation Results

The updated project was subjected to automated, route-level, visual, and runtime checks before the checkpoint was saved.[1]

| Validation | Result |
|---|---|
| TypeScript | Passed with no errors |
| Automated tests | **115 passed across 22 test files** |
| Production build | Passed |
| Compliance regression suite | Passed all prohibited-state, brand, claim, comparison, service, disclosure, route, and footer checks |
| Final source scans | Zero matches for the targeted removed states, brands, body claims, outcome claims, comparisons, disallowed services, prohibited fitness terms, and outdated counts |
| Redirect verification | All discontinued URLs listed above returned HTTP 301 |
| Footer links | All remaining local destinations returned HTTP 200 |
| Representative pages | Homepage, HRT landing page, WL2 landing page, locations page, Terms page, and redirected routes were reviewed |

## Recommended Next Steps

The team should first confirm that checkpoint `bb04542e` has been published to the live domain. After publication, this change summary and the detailed five-section implementation report should be submitted to LegitScript as remediation evidence. Finally, regulatory counsel should conduct a focused review of the required disclosures, licensing statements, and any future medical marketing copy before additional treatments or jurisdictions are added.

## References

[1]: ./2026-08-25-compliance-implementation-report.md "Detailed five-section implementation report"
[2]: https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/dTjhXymPZAVkoBOs.png "Locations and licensing presentation before-and-after comparison"
[3]: ../client/src/components/ComplianceDisclosures.tsx "Shared exact medication-disclosure component"
[4]: manus-webdev://bb04542e "Approved compliance implementation checkpoint"
