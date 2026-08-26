# 2026-08-25 Website Instructions — Extraction and Gap Notes

**Source:** `/home/ubuntu/upload/MMD_Website_Update_Instructions_2026-08-25.docx`  
**Review mode:** Analysis only. No website changes are authorized until the owner approves the gap report.

## Extracted Requirements

The document requires the following: delete `/male`, remove links and sitemap entry, but add a 301 redirect from `/male` to `/`; restrict licensing copy to Florida, Arizona, Colorado, District of Columbia, Georgia, Illinois, Maryland, Michigan, North Carolina, Pennsylvania, Texas, and Virginia; remove Tennessee, New Jersey, Alabama, Washington State, and Ohio; delete sentences containing the listed muscle/body, brand-comparison, and results phrases; remove Ozempic, Wegovy, Zepbound, and Mounjaro everywhere; unpublish the named semaglutide-versus-tirzepatide article and audit all remaining blog posts; remove Longevity & Healthy Aging, Sexual Health & ED, Thyroid and Metabolic, and Gut Health & Nutrition service categories; repair or remove every footer link; restrict the Everfit fitness/nutrition copy to weight-loss pages using the exact supplied wording; add the exact supplied compounded-medication and women’s-testosterone disclosures wherever triggered; audit hidden metadata, labels, widgets, assets, and downloads; rerun all searches and link checks; and produce the five-section deletion report.

## Current Findings Captured So Far

| Requirement | Current status found |
|---|---|
| `/male` page and public links | Page, route, links, components, and sitemap entry are removed. The URL currently renders 404 rather than the newly requested 301 redirect to `/`. |
| Other male-testosterone content | A true remaining hidden reference exists in `Home1.tsx`: “BHRT for women, TRT for men.” Many other testosterone matches are women’s treatment references and trigger the separate disclosure requirement. |
| Licensed states | Current copy still contains Tennessee, New Jersey, Alabama, Washington State, Ohio, and many “17 states” claims. Dense sources include both footer variants, `Home1.tsx`, shared FAQ/social-proof components, landing pages, and `client/public/llms.txt`. District of Columbia references are permitted and must not be confused with Washington State. |
| Banned drug brands | 22 matches remain in 11 files, including shared FAQ/treatment/medication components, BookPage, HomeHrt3, LpHrt, LpHrt2, LpHrt3, and `llms.txt`. |
| Muscle/body/result wording | Numerous remaining matches exist in the book page, the hormone/metabolism blog article and registry copy, diagnostic content, shared service/treatment components, location pages, metadata, and image alt text. “Performance coach” also appears throughout location pages; the document’s unqualified ban on “performance” needs to be applied literally if approved. |
| Brand-versus-compounded framing | Remaining true comparison language exists in shared FAQ/medication content, LocationFlorida, LocationGreatFalls, LpHrt, and `llms.txt`. |
| Named blog post | The article, route registration, source, sitemap entry, blog listing, `llms.txt` entry, and location links are already removed; the URL returns 404. |
| Disallowed services | “Longevity & Healthy Aging” remains in three files; “Thyroid & Metabolic” in two; “Longevity Medicine” in 28 files. Broader service components also contain Sexual Health, Gut Health, Longevity, thyroid, peptide, NAD+, and personal-training cards. |
| Footer links | Both footer variants still contain placeholder `href="#"` social links and multiple section links that share generic anchors rather than guaranteed destinations. The Home1 footer itself comments that several legal pages may 404. Its states list is outdated and it still lists thyroid/longevity services. |
| Fitness app | Twenty matches remain in 14 files, including shared onboarding/hero copy and 11 location-page variants. The mandated exact Everfit wording does not appear. |
| Exact compounded disclosure | The exact mandated wording appears zero times. The source audit found compounded semaglutide/tirzepatide references in 84 client files. Existing disclosures use different wording. |
| Exact women’s-testosterone disclosure | The exact mandated wording appears zero times. Women’s-testosterone references occur in 90 client files, including visible copy, structured data, metadata, and public AI/indexing text. |
| Public hidden-text hotspot | `client/public/llms.txt` still contains outdated states, 17-state claims, banned brands, brand/compounded comparisons, longevity content, testosterone content, and old discovery-call copy. |
| Book page hotspot | `BookPage.tsx` still contains banned brands, lean-muscle/fat-related wording, quantified outcomes, and 17-state copy in both structured data and visible content. |

## Important Conflict With Prior Remediation

The new document says not to write replacement medical copy and to delete whole sentences or paragraphs. The prior remediation, completed before this document was supplied, intentionally blended removed sections with neutral replacement language at the owner’s request. If the owner approves this new document as controlling, those sections should be re-audited against its stricter delete-without-rewrite rule.
