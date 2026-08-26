# Technical Evidence Summary

**Historical baseline:** checkpoint `26488264` for the general pre-remediation site; checkpoint `4f0a0bf4` for the original `/male` page  
**Current evidence:** corrected working version captured after exact jurisdiction reconciliation  
**Capture viewport:** 1280 × 720, full-page screenshots

## Screenshot Evidence

Fifteen matched before-and-after route pairs were captured successfully. Active routes were captured at the same URL. Discontinued routes were captured at the original historical URL and at the current permanent redirect destination.

| Route | Current Behavior |
|---|---|
| `/` | Retained and remediated |
| `/locations` | Retained; exact 12-jurisdiction presentation |
| `/lp/hrt2` | Retained and remediated |
| `/lp/hrt3` | Retained and remediated |
| `/lp/WL` | Retained and remediated |
| `/lp/WL2` | Retained and remediated |
| `/terms` | Retained; licensing and disclosure language corrected |
| `/blog` | Retained and remediated |
| `/blog/why-weight-gain-feels-different-in-menopause` | Retained and remediated |
| `/florida/boca-raton` | Representative Florida location template |
| `/virginia/arlington` | Representative non-Florida location template |
| `/pricing-guide` | Redirects to `/` |
| `/blog/semaglutide-vs-tirzepatide-women-midlife` | Redirects to `/blog` |
| `/male` | Redirects to `/` |
| `/the-menopause-weight-loss-trap` | Redirects to `/` |

## Exact Jurisdiction Evidence

The supplied document’s approved list is enforced as:

|  |  |  |
|---|---|---|
| Florida | Arizona | Colorado |
| District of Columbia | Georgia | Illinois |
| Maryland | Michigan | North Carolina |
| Pennsylvania | Texas | Virginia |

Nevada and Oregon were removed from public client source. “West Virginia” remains only inside Dr. Al-Deek’s legitimate education credential, not as a licensing claim. The regression suites explicitly reject Nevada, Oregon, and West Virginia from patient-service location content.

## New State-Hub Evidence

| State | Route | Integration Evidence |
|---|---|---|
| Georgia | `/georgia` | Router, locations directory, footer, sitemap, crawler metadata, `llms.txt` |
| Illinois | `/illinois` | Router, locations directory, footer, sitemap, crawler metadata, `llms.txt` |
| Michigan | `/michigan` | Router, locations directory, footer, sitemap, crawler metadata, `llms.txt` |

All three pages use the shared compliant statewide hub template with unique copy, state-specific representative cities, approved services, FAQ content, SEO metadata, and MedicalBusiness/FAQ/Breadcrumb structured data. Desktop and mobile screenshots verified the three pages and the updated `/locations` directory.

## Scope and Deletion Evidence

| Metric | Result |
|---|---:|
| Changed files from baseline | 192 |
| Insertions from baseline | 4,078 |
| Deletions from baseline | 18,627 |
| Deleted source files | 23 |
| Remaining location-page source files covered by template rules | 104 |
| Representative comparison boards | 15 |
| Successful screenshot pairs | 15 of 15 |

Deleted source files include the named medication-comparison article, comparison pricing page, former book page, duplicate homepages, legacy HRT landing page, hardcoded testimonials, comparison components, unsupported program modules, and fitness/coaching modules.

## Disclosure Evidence

The shared component contains the exact compounded-medication and Florida women’s-testosterone wording. Current source-level checks identify compounded-treatment handling across 100 page/article files and the testosterone disclosure prop in 15 source files. The compliance regression suite verifies required treatment-bearing files use the shared component or exact mandated wording.

## Redirect Evidence

The server handles discontinued routes before the SPA fallback. The redirect set includes `/male`, `/pricing-guide`, the named article, former book and guide pages, duplicate legacy homepages, the old HRT landing page, the old GLP-1 alias, and `/start/women`. Regression tests enforce their continued presence.

## Validation Evidence

| Validation | Result |
|---|---:|
| TypeScript | Passed |
| Automated test files | 23 passed |
| Automated tests | 119 passed |
| Production build | Passed |
| Exact 12-jurisdiction check | Passed |
| Nevada/Oregon public-source scan | Zero matches |
| Representative screenshot capture | 15 of 15 pairs |

## Preserved Operational Systems

The compliance work did not intentionally modify payment amounts or payment-provider behavior. Stripe, PayPal, the $50 deposit and balance workflow, WL2 $15 payment, GHL intake/payment webhooks, booking calendars, admin payment settings, and scheduled charge sweep remain in the project. The PayPal public configuration endpoint returned HTTP 200 during implementation verification.

## Evidence Files

| Evidence | Location |
|---|---|
| Screenshot manifest | External deliverables package: `screenshots/manifest.json` |
| Comparison boards | External deliverables package: `comparisons/` |
| Redirect implementation | `server/_core/index.ts` |
| Compliance regression suite | `server/legitScriptCompliance.test.ts` |
| State-hub and removed-state regression suite | `server/stateHubRoutes.test.ts` |
| Shared disclosure component | `client/src/components/ComplianceDisclosures.tsx` |
| Detailed five-section report | `docs/2026-08-25-compliance-implementation-report.md` |
