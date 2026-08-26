# LegitScript Audit Extraction Notes

## Source

- Uploaded file: `/home/ubuntu/upload/MMD.pages`
- Converted review copy: `/home/ubuntu/tmp/mmd-legitscript-converted/MMD.pdf`

## Verified findings from preview and PDF pages 1-4

### Page 1

- The document states: **"We need website changes in response to LegitScript Question 44."**
- It says LegitScript identified claims that may **misleadingly compare compounded GLP-1 medications with FDA-approved branded products**.
- It instructs the site owner to **temporarily unpublish pages while they are being reviewed**. The exported PDF preserves two hyperlink lines, but the visible extracted titles are duplicated and do not reliably preserve the exact destination URLs. This must be cross-checked against the live site.
- It instructs the homepage to **immediately remove** the claim:
  - **"Compounded options are typically 30–45% more affordable than brand-name"**

### Page 2

- The document separately flags **side-by-side compounded-versus-brand medication and pricing comparisons** as content to remove or revise.

### Page 3

- The embedded screenshot shows a section titled **"Your Medication Options"**.
- The screenshot visibly compares:
  - **Compounded** semaglutide or tirzepatide at approximately **~$100–$300/mo**
  - **Brand-Name** Wegovy or Zepbound at approximately **~$150–$450/mo**
- The same screenshot also appears to compare **compounded hormone therapy** with brand-name or typical protocol language on a neighboring card.
- This screenshot is strong evidence that LegitScript is objecting not only to wording, but also to the current **comparative price-card structure**.

### Page 4

- Page 4 appears blank in the converted PDF export.

## Immediate interpretation

- The first confirmed compliance theme is: **do not compare compounded GLP-1 products against FDA-approved branded products using superiority, affordability, or side-by-side pricing framing**.
- The extracted pages strongly suggest the highest-priority targets will include the **homepage** and at least one other page using the same medication-pricing comparison module.
- Exact URLs for the "temporarily unpublish" instruction still need to be verified against the remaining pages and the live website because the PDF text extraction did not preserve the hyperlink destinations clearly.

## Verified findings from PDF pages 5-7

### Page 5

The document expressly flags **Wegovy and Zepbound references presented alongside compounded semaglutide or tirzepatide**. The concern is therefore not limited to a percentage-affordability statement. Brand-name drug references shown in the same comparison context as compounded GLP-1 products are also within scope.

### Page 6

The document reproduces the **Weight-Loss Medication** comparison card. The visible card compares compounded semaglutide or tirzepatide at **~$100–$300/mo** against brand-name Wegovy or Zepbound at **~$150–$450/mo**. Beneath the card, the audit separately flags **testimonials claiming 28-pound or 30-pound weight loss**.

### Page 7

The document flags testimonials that imply **hormone treatment caused or restarted weight loss**. The reproduced testimonials include language substantially equivalent to:

> "Once we balanced my hormones, my body finally started responding again."

and

> "Between my hormone treatment and personalized weight loss plan, I've lost 28 pounds..."

The audit also separately calls out the phrase **"Just results"**. A final text block reproduces the site description: **"Physician-led virtual hormone therapy, menopause care, and GLP-1 weight loss — 100% virtual. Board-certified care with Dr. Al-Deek. Book your consultation today."** The document does not explicitly explain whether this final description is itself objectionable, so it should be treated as a review item rather than automatically removed.

## Consolidated confirmed audit themes

| Theme | Confirmed objection |
|---|---|
| Compounded versus branded GLP-1 comparison | Remove affordability and side-by-side price comparisons between compounded GLP-1 products and FDA-approved branded drugs. |
| Brand references in compounded context | Remove or separate Wegovy and Zepbound references when presented alongside compounded semaglutide or tirzepatide. |
| Quantified testimonial outcomes | Remove testimonials claiming 28-pound or 30-pound weight loss. |
| Hormone-causation testimonials | Remove testimonial language implying hormone treatment caused, restarted, or materially produced weight loss. |
| Unqualified results language | Remove or revise **"Just results"** because it can imply guaranteed or universal outcomes. |

## Authoritative classification context

LegitScript's healthcare certification materials describe **Transparency & Advertising** as requiring honest, accurate operations and advertising aligned with applicable laws and platform policies. Its GLP-1 guidance also stresses transparent website disclosures, ethical advertising, and patient communications for businesses promoting weight-loss medications.[1][2]

FDA's current telehealth guidance states that compounded drugs are **not FDA-approved** and are not reviewed by FDA for safety, effectiveness, or quality before marketing. FDA specifically warns telehealth companies against false or misleading statements that present a compounded product as the same as, a generic version of, or clinically proven to produce the same result as an FDA-approved product.[3]

Based on the submitted audit and those sources, the practical risk classification is:

| Priority | Finding | Why it is high-risk | Proposed compliance direction for approval |
|---|---|---|---|
| Critical | Two pages requested to be temporarily unpublished | LegitScript expressly requested temporary removal during review. The PDF hyperlink annotations identify `/male` and `/blog/semaglutide-vs-tirzepatide-women-midlife`. | Keep `/male` unpublished; temporarily unpublish the named blog article until revised and re-reviewed. |
| Critical | Compounded-versus-brand GLP-1 price and affordability comparison | The audit expressly objects to side-by-side price framing and the 30–45% affordability statement. | Remove the percentage claim and eliminate comparative compounded/brand pricing cards. Present costs only in a neutral, non-comparative format if LegitScript confirms that format is acceptable. |
| Critical | Wegovy/Zepbound shown alongside compounded semaglutide/tirzepatide | The layout can imply equivalence, interchangeability, or a direct substitute relationship. | Separate FDA-approved and compounded treatment discussions, or remove named brands from the compounded product context. Add a clear compounded-drug disclosure where applicable. |
| High | Testimonials with 28-pound or 30-pound outcomes | Quantified outcomes can be interpreted as representative efficacy claims. | Remove these testimonials from public pages unless LegitScript provides written approval for substantiated, appropriately qualified use. |
| High | Testimonials linking hormone treatment to renewed weight loss | The audit expressly objects to implied causation. | Remove or replace the claims with non-outcome, process-focused statements from genuine, documented patients, subject to written approval. |
| High | **"Just results"** | The phrase may imply guaranteed, universal, or predictable results. | Replace with restrained language focused on individualized, physician-led care and explicitly note that outcomes vary. |
| Review | Final site description reproduced on page 7 | The audit reproduces it but does not expressly state what is objectionable. | Ask LegitScript whether the description is included as context or requires revision before changing it. |

## References

[1]: https://www.legitscript.com/certification/healthcare-certification/#requirements "LegitScript Healthcare Certification Requirements"
[2]: https://www.legitscript.com/healthcare/navigating-legitscript-certification-for-weight-loss-medications-common-inquiries-and-answers/ "Navigating LegitScript Certification for Weight Loss Medications"
[3]: https://www.fda.gov/drugs/human-drug-compounding/fda-telehealth-companies-what-know-when-promoting-compounded-drugs "FDA to Telehealth Companies: What to Know When Promoting Compounded Drugs"

## Current website audit

The current codebase and live site still contain most of the claims identified by LegitScript. No website copy or routes were changed during this review.

| Affected area | Current status | Confirmed scope |
|---|---|---|
| `/male` | Already removed and unpublished | The route, page component, redirect, and internal link were removed in checkpoint `822276c3`. This satisfies one of the two temporary-unpublish URLs recovered from the audit hyperlinks. |
| `/blog/semaglutide-vs-tirzepatide-women-midlife` | Still public | The article says compounded versions can be more accessible and affordable than brand-name options; uses "same active ingredient" or "same active molecule" framing; compares trial weight-loss percentages; lists compounded availability in a side-by-side table; and describes tirzepatide as producing greater weight loss. This is the second URL LegitScript expressly requested be temporarily unpublished. |
| Homepage `/` | Noncompliant claims still present | Contains "30–45% more affordable," "Just results," the compounded **~$100–$300/mo** versus brand-name **~$150–$450/mo** comparison, Wegovy/Zepbound beside compounded semaglutide/tirzepatide, a 28-pound testimonial, an over-30-pound testimonial, and hormone-related statements that weight loss restarted. |
| `/lp/hrt3` | Same core claims as homepage | Contains the 30–45% affordability statement, comparative pricing card, Wegovy/Zepbound references, "Just results," and the flagged testimonial claims. |
| `/lp/WL` | Multiple flagged claims | Contains the 30–45% affordability statement, "Just results," and the quantified or hormone-linked testimonial claims. |
| `/lp/hrt2` | Multiple flagged claims | Contains "Just results" and the quantified or hormone-linked testimonial claims. |
| `/lp/WL2` | Comparative pricing remains | Contains the same **~$100–$300/mo** compounded versus **~$150–$450/mo** brand-name price card and Wegovy/Zepbound references shown in the audit. |
| Location pages | Widespread additional risk | **84 source files** say compounded products use the "same active ingredients" and that compounded options are often more affordable. **89 source files** include the formulation that compounded semaglutide or tirzepatide from a 503B pharmacy is more affordable than using the brand/insurance process. |
| Other treatment content | Additional review needed | Components and medication pages use Wegovy/Zepbound and compounded product language in contexts that may require separation or clearer disclosures, even where the exact audit phrase is absent. |

### Exact source counts for expressly flagged phrases

| Phrase or claim | Number of current source files |
|---|---:|
| "30–45% more affordable" | 3 |
| "Just results" | 4 |
| "I've lost 28 pounds" | 4 |
| "lost over 30 pounds" | 4 |
| "body finally started responding again" | 3 |
| "weight loss started again" | 4 |
| "Compounded options are often more affordable" | 84 |
| Compounded semaglutide/tirzepatide from a 503B pharmacy described as more affordable | 89 |
| "same active ingredient" or "same active ingredients" framing | More than 80 |

The production homepage could not be fully rendered in the sandbox browser during this pass because the live client remained on its loading state, but the current production source and the successfully rendered named blog article confirm the flagged content is still deployed. The source audit is sufficient to map the required changes without modifying the live website.
