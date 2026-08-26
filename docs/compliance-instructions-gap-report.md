# MedMethod Direct — 2026-08-25 Compliance Instructions Gap Report

**Author:** Manus AI  
**Status:** Draft — owner approval required before implementation  
**Scope:** Comparison of the uploaded `MMD_Website_Update_Instructions_2026-08-25.docx` with the current project after the first LegitScript remediation.

> **Important:** No public website content was changed during this review. This is a working compliance analysis, not formal legal advice; qualified healthcare regulatory counsel should review consequential decisions.

## Executive Assessment

The first remediation completed several high-priority items, but the new document is broader and stricter. The named `/male` page and semaglutide-versus-tirzepatide article are already removed, the comparison-based pricing guide is unpublished, and the first set of testimonial and pricing comparisons was cleaned. However, the new document introduces substantial additional work involving state licensing copy, four banned brand names everywhere, service-category removal, exact disclosures, footer repair, hidden metadata, the book page, legacy public routes, and every remaining location page.[1] [2]

| Classification | Assessment |
|---|---|
| **Complete** | The named blog article is removed with its public references. `/male`, its links, components, and sitemap entry are removed. No hosted PDF/download files were found in the website source. |
| **Partially complete** | `/male` is removed but returns 404 rather than the newly requested 301 redirect. The first pricing/testimonial cleanup is complete, but the new document bans a wider set of words and all four drug brands everywhere. |
| **Missing** | The 12-state correction, exact Everfit wording, exact compounded and women’s-testosterone disclosures, disallowed-service cleanup, footer-link repair, remaining-blog audit corrections, and full hidden-content cleanup. |
| **Requires approval/clarification** | Whether to apply the new document’s delete-without-rewriting rule retroactively; whether “performance coach” must be deleted because the document bans “performance”; and whether women’s testosterone must be removed outside Florida rather than merely disclosed. |

## Requirement-by-Requirement Gap Matrix

| Task | Status | What is already complete | What remains |
|---|---|---|---|
| **1. Delete `/male`** | **Partial** | The page, React route, `/start/men` compatibility route, footer link, male-only components, and sitemap reference are removed. | `/male` currently reaches the not-found page, not the newly required 301 redirect to `/`. A hidden structured-data statement on public legacy route `/home-1` and `/home-v1` still says **“BHRT for women, TRT for men.”**[3] |
| **2. Fix served states** | **Missing / high priority** | Some older pages list only nine approved jurisdictions. | Tennessee, New Jersey, Alabama, Washington State, and Ohio remain in shared footer, FAQ, social-proof, Home1, and `llms.txt` content. “Licensed in 17 states” remains across homepage/landing/booking copy. District of Columbia references are permitted and must not be removed accidentally. The 12 approved states must replace all inconsistent 9-state and 17-state lists. |
| **3. Delete banned words and phrases** | **Partial / high priority** | The first LegitScript comparison phrases and hardcoded testimonials were removed from the pages included in the first audit. | **22 banned brand-name matches remain in 11 files.** Remaining brand/compounded comparison copy exists in shared FAQ/medication content, two location pages, `/lp/hrt`, and `llms.txt`. Body-composition and lean-muscle wording remains in a live blog article and registry metadata. BookPage contains banned brands, lean-muscle/fat language, and quantified outcome wording. “Performance coach” appears broadly; literal application of the document would require deleting those sentences. |
| **4. Delete one blog and check the rest** | **Partial** | `/blog/semaglutide-vs-tirzepatide-women-midlife` is unregistered, deleted, removed from blog listing, sitemap, location links, and public AI/indexing text. | The remaining hormone/metabolism article and its blog-card metadata still contain **body composition** and **lean muscle** phrases. Every remaining article must receive the document’s stricter sentence-deletion treatment. |
| **5. Remove services not offered** | **Missing / high priority** | The removed `/male` page no longer advertises men’s testosterone. | “Longevity & Healthy Aging” remains in three files; “Thyroid & Metabolic” remains in two; “Longevity Medicine” remains in 28 files. Shared service/treatment components also expose Sexual Health, Gut Health, thyroid, longevity, peptide, NAD+, virtual-primary-care, and personal-training categories on public legacy routes. These routes must be cleaned or unpublished.[3] |
| **6. Fix footer links** | **Missing** | Core legal routes exist for terms, privacy, HIPAA, subscription policy, telehealth consent, and accessibility.[3] | Both footer variants contain placeholder social links using `href="#"`. One footer maps several different company labels to the same `#about` anchor. The Home1 footer has generic service anchors, outdated states, disallowed thyroid/longevity labels, and internal comments acknowledging possible 404 destinations. Every footer link still needs a route-by-route click test.[4] |
| **7. Fix fitness-app text** | **Missing** | No exact old heading match was found. | Twenty fitness/nutrition matches remain in 14 files, including hormone/location content. The exact required Everfit sentence appears **zero times**. Existing “personalized fitness and nutrition app” and “custom fitness and nutrition plan” copy must be removed from hormone pages; the approved exact text may appear only on weight-loss pages. |
| **8. Add required disclosures** | **Missing / highest priority** | The first remediation added a shorter compounded-medication disclosure in some locations. | The document’s exact compounded disclosure appears **zero times**, while qualifying compounded semaglutide/tirzepatide wording appears in **84 client files**. The exact women’s-testosterone disclosure also appears **zero times**, while women’s-testosterone references appear in **90 client files**. The Florida-only sentence conflicts with non-Florida pages currently advertising women’s testosterone; those non-Florida references should be removed if this document is controlling. |
| **9. Check hidden places** | **Partial / high priority** | No website-hosted PDF, DOC, DOCX, or ZIP downloads were found. No banned asset filename was found in the local project, apart from a regression-test filename. | Violations remain in meta descriptions, JSON-LD, public `llms.txt`, button/service labels, FAQ data, social-proof notifications, and storage-asset URL strings. `llms.txt` is a dense exposure containing outdated states, banned brands, comparison framing, longevity content, testosterone content, and an obsolete discovery-call flow.[5] |
| **10. Check the work** | **Not complete** | The first remediation added automated tests for the first audit’s phrases and removed routes. | New regression checks are required for all four brand names, the five removed states, 17-state claims, exact disclosure coverage, banned service labels, blog phrases, fitness copy, footer integrity, and `/male` 301 behavior. |
| **11. Write the report** | **Not started for this document** | A first-remediation summary exists.[2] | After approved implementation, produce the document’s five required sections: pages changed, exact deleted text, could-not-fix items, images/files, and copy gaps. |

## Major Public Hotspots Not Fully Covered by the First Remediation

The current router still exposes legacy pages at `/home-1`, `/home-v1`, `/home-2`, and `/home-3`, in addition to `/lp/hrt`.[3] Those routes render older shared components that contain many of the remaining banned brands, disallowed services, outdated states, footer problems, and legacy claims. Cleaning only the main homepage would therefore be insufficient.

The book page at `/the-menopause-weight-loss-trap` is another major hotspot. Its visible copy and structured data still contain banned brand names, lean-muscle and fat-related language, quantified outcomes, and “17 states” wording.[6]

## Conflicts and Decisions Requiring Owner Approval

| Decision | Why approval is needed | Recommended interpretation |
|---|---|---|
| **Apply delete-without-rewriting retroactively?** | The prior remediation blended removed text with neutral replacement copy at the owner’s request. The new document expressly forbids writing new medical replacement claims. | Treat the new document as controlling. Preserve layout only where deletion leaves the section coherent; otherwise remove the affected paragraph/card and list the resulting gap in Task 11. |
| **Add `/male` 301 redirect?** | The owner previously requested that `/male` be deleted entirely; the new document requires a permanent redirect to `/`. | Add the 301 redirect because it is explicit in the newer compliance instructions. |
| **Delete “performance coach” sentences?** | “Performance” is listed as a banned word, even though these sentences describe coaching rather than a medical outcome. | Apply the document literally unless the compliance author confirms coaching use is exempt. |
| **Women’s testosterone outside Florida** | The mandated disclosure says the treatment is available only in Florida, while many non-Florida location pages advertise it. | Remove women’s-testosterone references from every non-Florida page and keep the exact disclosure only where the Florida service is described. |
| **State pages for Georgia, Illinois, Michigan** | The allowed list includes these states, but the current router has no state hubs for them. | Correct all state lists to the 12 approved states. Do not create new location pages unless separately requested. |
| **Legacy public routes** | Old routes are public and contain many violations, but the document does not say whether they must stay available. | If not needed for active campaigns, unpublish/redirect the legacy routes instead of rewriting obsolete duplicate sites. |

## Recommended Approval Scope

Approve one controlled remediation covering all 11 tasks exactly as written, with these implementation rules: add the `/male` 301 redirect; update all licensing copy to the 12 approved states; remove all four banned brand names; remove the specified services and all non-approved service categories; remove or unpublish obsolete legacy routes; use only the exact two supplied disclosures; apply the exact Everfit sentence only to weight-loss pages; repair and verify both footers; and generate the five-section deletion report. No unrelated design, pricing, or payment-flow changes should be made.

## References

[1]: ./compliance-instructions-gap-notes.md "Extracted 2026-08-25 compliance instructions and source-audit notes"
[2]: ./legitscript-remediation-summary.md "First LegitScript remediation summary"
[3]: ../client/src/App.tsx "Current application route table"
[4]: ../client/src/components/home1/Footer.tsx "Current Home1 footer implementation"
[5]: ../client/public/llms.txt "Current public AI/indexing reference text"
[6]: ../client/src/pages/BookPage.tsx "Current Menopause Weight Loss Trap page"
