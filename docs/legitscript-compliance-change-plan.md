# MedMethod Direct LegitScript Compliance Change Plan

**Status:** Draft for owner and compliance review before implementation  
**Source:** LegitScript Question 44 feedback supplied in `MMD.pages`  
**Prepared by:** Manus AI  

> This is a working compliance analysis, not formal legal advice. A qualified healthcare regulatory attorney or the assigned LegitScript analyst should confirm any consequential interpretation before MedMethod Direct relies on it.

## Executive summary

LegitScript’s feedback focuses on marketing that may cause consumers to equate compounded GLP-1 products with FDA-approved branded products or infer that compounded products are a cheaper equivalent. It also identifies testimonials and slogans that can imply predictable, representative, or hormone-caused weight-loss outcomes.

The submitted audit specifically requests temporary unpublishing of two URLs. The first, `/male`, has already been removed. The second, `/blog/semaglutide-vs-tirzepatide-women-midlife`, remains public and contains several of the most sensitive comparison claims. The same themes also appear throughout the homepage, landing pages, and a large number of location pages. A narrow homepage-only correction would therefore leave substantial duplicate risk elsewhere.

LegitScript describes its healthcare standards as requiring honest and accurate operations and advertising aligned with applicable laws and platform policies.[1] FDA’s current telehealth guidance states that compounded drugs are not FDA-approved and are not reviewed by FDA for safety, effectiveness, or quality before marketing. FDA specifically warns against presenting a compounded drug as the same as, a generic version of, or clinically proven to produce the same result as an FDA-approved drug.[2]

## Proposed decisions requiring approval

| Priority | Proposed action | Affected pages or components | Reason |
|---|---|---|---|
| Critical | Temporarily unpublish the semaglutide-versus-tirzepatide article | `/blog/semaglutide-vs-tirzepatide-women-midlife` | The submitted audit expressly identifies this URL. The article contains affordability, same-active-ingredient, brand comparison, compounded availability, and comparative outcome claims. |
| Critical | Remove the 30–45% affordability statement everywhere | `/`, `/lp/hrt3`, `/lp/WL` | The submitted audit quotes this claim verbatim and directs its immediate removal from the homepage. Duplicate use elsewhere should be removed in the same compliance release. |
| Critical | Eliminate side-by-side compounded-versus-brand price cards | `/`, `/lp/hrt3`, `/lp/WL2` | The audit reproduces and objects to the **~$100–$300/mo** compounded versus **~$150–$450/mo** brand-name comparison structure. |
| Critical | Separate compounded and FDA-approved brand references | Homepage, landing pages, medication components, FAQs, and location pages | Wegovy and Zepbound are currently shown alongside compounded semaglutide or tirzepatide. This can imply equivalence, interchangeability, or a cheaper substitute relationship. |
| High | Remove flagged outcome testimonials | `/`, `/lp/hrt3`, `/lp/hrt2`, `/lp/WL` | The audit expressly identifies 28-pound and 30-pound testimonials and hormone-linked statements that weight loss resumed. |
| High | Remove **“Just results”** | `/`, `/lp/hrt3`, `/lp/hrt2`, `/lp/WL` | The phrase can imply guaranteed or universal outcomes and is expressly flagged in the audit. |
| High | Correct repeated location-page compounded claims | Approximately 84–89 location-page source files | These pages describe compounded medications as using the “same active ingredients” and as more affordable than brand-name or insurance pathways. Leaving them unchanged could recreate the same concern at scale. |
| Review with LegitScript | Confirm whether the reproduced site description needs revision | Global metadata, homepage metadata, crawler metadata | The audit reproduces the description but does not state why it is included. It should not be changed solely by assumption. |

## Exact proposed content treatment

### 1. Medication pricing

The comparative two-column pricing cards should be removed. A neutral, non-comparative statement can replace them, subject to LegitScript approval:

> **Medication costs vary.** Medication is billed separately and costs depend on the medication prescribed, dosage, dispensing pharmacy, and any applicable insurance coverage. Dr. Al-Deek will review clinically appropriate options and expected costs during your visit.

This preserves useful consumer information without asserting that compounded products are cheaper or comparing specific compounded prices against branded drugs.

### 2. Compounded-medication disclosure

Where compounded medications remain discussed, the site should use a clear disclosure rather than “same active ingredient,” “generic,” equivalent-outcome, or superiority language:

> **Important information about compounded medications:** Compounded medications are not FDA-approved. FDA does not review compounded drugs for safety, effectiveness, or quality before marketing. A licensed clinician determines whether a compounded medication is appropriate based on an individual patient’s clinical needs.

This wording tracks FDA’s current public guidance and should still be reviewed against the practice’s actual pharmacy relationships and the assigned LegitScript analyst’s instructions.[2]

### 3. FDA-approved brand-name medications

MedMethod Direct may continue to explain that a clinician can prescribe FDA-approved brand-name medications when clinically appropriate, but those references should be presented in a separate section and not as a direct substitute comparison with compounded products. Insurance and prior-authorization language may remain if factually accurate, but should not conclude that compounded products are the more affordable or easier alternative.

### 4. Testimonials

The flagged testimonial carousel should be removed temporarily from the four affected pages. It should not be replaced with invented, rewritten, or composite testimonials. Any future testimonial should come from a genuine, documented patient with appropriate permission and should avoid quantified weight-loss outcomes, causal claims about hormones producing weight loss, or language implying representative results.

### 5. Results-oriented slogan

Replace:

> **No insurance. No middlemen. Just results.**

with restrained, process-focused language such as:

> **Thoughtful, physician-led care built around you.**

The replacement emphasizes individualized care rather than promising an outcome.

### 6. Named blog article

The recommended temporary-unpublish action is to remove the article route from public access, remove it from internal blog listings and the sitemap, and allow the URL to return the normal not-found page. The article should remain in source control for revision rather than being permanently deleted until LegitScript confirms the acceptable scope for clinical education about semaglutide and tirzepatide.

## Sitewide scope discovered during review

| Claim category | Current source scope |
|---|---:|
| “30–45% more affordable” | 3 files |
| “Just results” | 4 files |
| 28-pound testimonial | 4 files |
| Over-30-pound testimonial | 4 files |
| “Body finally started responding again” | 3 files |
| “Weight loss started again” | 4 files |
| Compounded options described as often more affordable | 84 files |
| Compounded semaglutide/tirzepatide described as a more affordable route | 89 files |
| “Same active ingredient(s)” framing | More than 80 files |

The primary consumer pages affected are `/`, `/lp/hrt3`, `/lp/hrt2`, `/lp/WL`, and `/lp/WL2`. The location-page template copies extend the same risk across many state and city URLs. Components such as general FAQs, treatment cards, medication content, and the medication-pricing page should also be included in the final text audit.

## Recommended implementation sequence

| Release step | Work | Verification |
|---|---|---|
| 1. Immediate containment | Unpublish the named blog article; confirm `/male` remains unavailable; remove the quoted homepage claim, comparison cards, flagged testimonials, and “Just results.” | Route checks, page screenshots, source search for exact flagged phrases, sitemap audit. |
| 2. Landing-page consistency | Apply equivalent corrections to `/lp/hrt3`, `/lp/hrt2`, `/lp/WL`, and `/lp/WL2`. | Desktop/mobile screenshots and automated regression tests for prohibited phrases. |
| 3. Sitewide location cleanup | Replace repeated “same active ingredient” and affordability copy across all location pages with approved neutral wording. | Automated source scan across every location file and production build. |
| 4. Disclosure and metadata review | Add the approved compounded-medication disclosure where applicable; resolve whether the global site description must change. | Review against FDA guidance, crawler metadata tests, LegitScript confirmation. |
| 5. Evidence package | Produce a before-and-after matrix, changed URL list, screenshots, and exact replacement wording for resubmission. | Owner review followed by delivery to the assigned LegitScript analyst. |

## Questions to send LegitScript before finalizing ambiguous items

1. Does the final site description reproduced on page 7 require revision, or was it included only to identify the homepage?
2. May MedMethod Direct publish non-comparative medication cost information without placing compounded and FDA-approved products side by side?
3. Is the proposed compounded-medication disclosure acceptable for Question 44?
4. May FDA-approved brand names be discussed in a separate educational section if compounded products are not described as equivalent, generic, cheaper, or clinically comparable?
5. Should all patient testimonials be temporarily removed, or only the specific quantified and hormone-causation testimonials identified in the audit?
6. For the named blog article, does LegitScript prefer a temporary 404, a noindex page, or a revised article submitted before republication?

## Approval requested

No website content was changed during this audit review. Approval is requested to implement the five-step sequence above, beginning with immediate containment. The safest compliance approach is to correct the duplicated claims sitewide in one coordinated release rather than patching only the homepage and leaving the same statements on landing and location pages.

## References

[1]: https://www.legitscript.com/certification/healthcare-certification/#requirements "LegitScript Healthcare Certification Requirements"
[2]: https://www.fda.gov/drugs/human-drug-compounding/fda-telehealth-companies-what-know-when-promoting-compounded-drugs "FDA to Telehealth Companies: What to Know When Promoting Compounded Drugs"
[3]: https://www.legitscript.com/healthcare/navigating-legitscript-certification-for-weight-loss-medications-common-inquiries-and-answers/ "Navigating LegitScript Certification for Weight Loss Medications"
