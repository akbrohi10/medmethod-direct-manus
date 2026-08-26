# Homepage and New State-Hub Compliance/UX Audit Notes

**Status:** No website changes made. Findings are for approval.

## Homepage strengths

- The first screen presents the physician, visit purpose, total price, deposit, and primary booking CTA.
- The phone number remains tappable in the fixed header and the mobile sticky bar provides both booking and calling actions.
- Pricing, follow-up options, medication-cost guidance, required disclosures, process steps, FAQ, and final CTA follow a generally understandable sequence.
- Desktop and mobile screenshots show no visible clipping or horizontal overflow.

## Homepage findings requiring review

| Priority | Finding | Evidence / user impact |
|---|---|---|
| High | The FAQ still contains quantified treatment-result timelines and broad efficacy/safety claims. | `HomeHrt3.tsx` includes “benefits ... far outweigh the risks,” appetite changes in “1–2 weeks,” weight loss in “4–8 weeks,” and hormone improvement timelines. This conflicts with the deletion-first compliance direction and may create expectations the earlier remediation intended to remove. |
| High | The final CTA says patients will “leave with ... a prescription.” | The rest of the page correctly qualifies prescribing as clinically appropriate. The final CTA removes that qualification and can sound guaranteed. |
| Medium | The FAQ states virtual care provides “the same thorough evaluation” as in-person care. | This absolute equivalence claim is stronger than necessary and may be better framed as the services available through the virtual visit. |
| Medium | The connected-care introduction still references “thyroid health.” | Thyroid treatment was removed from the approved service categories. Even though this sentence is contextual rather than a service offer, it can blur the approved scope. |
| Medium | Hormone medication pricing still uses “Most patients,” price ranges, and “Preferred pricing” language. | The section is understandable, but it is more promotional and generalized than the neutral cost guidance used elsewhere. |
| Medium | The mobile page is exceptionally long. | Eleven symptom cards, pricing detail, two medication cards, four process steps, and twelve FAQs create a lengthy path before the final CTA. The sticky mobile CTA mitigates this but does not reduce cognitive load. |
| Low | Condition cards visually imply interactivity but have no click action. | Cards use `cursor-pointer` and hover scaling, which can cause users to expect navigation or expanded details. |
| Low | The mobile carousel has no visible swipe cue. | Desktop arrows are hidden on mobile. Users may not realize additional condition cards are available horizontally. |

## Preliminary recommendation

Keep the overall conversion structure. Prioritize removal or qualification of the remaining result timelines, guaranteed-prescription wording, absolute virtual-care equivalence, and thyroid-scope reference. Then simplify low-value mobile content and clarify carousel behavior without redesigning the page.

## Locations directory and new state hubs — visual findings

### Strengths

- `/locations` clearly presents all 12 approved jurisdictions and groups detailed guides by region.
- Georgia, Illinois, and Michigan share a consistent visual structure and use the compliant single-face telehealth image.
- Each state hub visibly identifies the state, representative communities, physician-led virtual care, approved service categories, FAQs, and a final booking CTA.
- Desktop and mobile captures show no obvious clipping, broken grids, or horizontal overflow.

### Findings requiring review

| Priority | Finding | Evidence / user impact |
|---|---|---|
| High | The state-hub header promotes a “FREE CONSULTATION,” while the hero and final CTA promote a paid 45-minute appointment. | This contradicts the established no-free-consultation policy and creates two different conversion promises on the same page. |
| High | The state hubs show a $179 “60-minute Physician Strategy Session” and a separate setup fee, while the homepage shows a $199 45-minute consultation with a $50 deposit. | Visitors can receive conflicting prices, visit lengths, and payment structures depending on the page they enter from. |
| High | The process section says “This Isn’t a Subscription. It’s a Program,” includes lab-work scheduling, and describes a program launch. | This does not match the homepage’s consultation-first model and optional $50/month ongoing care. It can make the service feel like a separate business model. |
| Medium | The locations directory reports “99+ cities listed,” but the three new state hubs intentionally have no city-detail pages. | The directory uses representative communities for those states. The wording may imply that every listed community has a dedicated guide. |
| Medium | The state pages are highly consistent but nearly identical beyond state and community substitutions. | The layout is coherent, but the unique value and local relevance are limited, which can make the pages feel templated to users and search engines. |
| Medium | The mobile footer is very long relative to the state-page body. | It adds a large amount of navigation after the final CTA and can dilute the end-of-page action. |
| Low | Community cards are informational but visually resemble selectable controls. | Users may expect city links or expanded details even though no city routes were created. |

### Preliminary recommendation

Keep the state-hub design and approved-service structure. Align the state-hub header, pricing strip, appointment duration, and process steps with the homepage’s actual booking model before promoting these pages. Clarify that community names indicate statewide coverage rather than individual city guides, and add modest unique state context without introducing new medical claims.

## Source and route validation

The following findings were confirmed in source and through HTTP checks. No website content was changed.

| Priority | Validated finding | Source / behavior |
|---|---|---|
| Critical | The new state hubs present three incompatible funnels on one page. | The hero promises a paid 45-minute appointment. `DiagnosticSetup.tsx` advertises a $179 60-minute strategy session and setup package. `ConsultationModal.tsx` ends at a free 20-minute enrollment-specialist calendar. |
| Critical | “FREE CONSULTATION” remains in the desktop/mobile state-hub header, expanded pricing panel, and calendar URL. | This directly conflicts with the previously approved no-free-consultation policy and the paid homepage flow. |
| High | The shared state-hub pricing block contains outdated and compliance-sensitive language. | It displays “SAVE $270 · JUNE ONLY,” “Typical Out-of-Pocket Cost Elsewhere,” a 70% claim, thyroid-condition language, fitness-app setup, and prescriptive lab requirements. |
| High | The shared process block describes a different business model. | It states “This Isn’t a Subscription. It’s a Program,” includes a discovery call, required lab scheduling, a 60-minute physician strategy session, and program launch. |
| High | Several shared navigation links on the state hubs point to homepage anchors that do not exist. | `Navbar.tsx` targets `#services`, `#about`, and `#book`; the current homepage only exposes `#pricing-details`, `#how-it-works`, and `#faq` among those navigation targets. |
| High | The generic state-hub modal contains additional prohibited or result-oriented language. | It includes “Lose weight & burn fat,” “Improve energy & metabolism,” and “I’ve tried everything,” then schedules a free consultation rather than the advertised paid appointment. |
| Medium | The state-hub services/process section is inherited from legacy location pages rather than the current homepage model. | This explains why the visual design is consistent but the pricing and next steps diverge from the current homepage. |
| Medium | `/locations` reports “99+ Cities Listed” and labels each state card with “cities served.” | For Georgia, Illinois, and Michigan, every community pill links to the same state hub. This is technically functional but can imply dedicated city pages that do not exist. |
| Medium | The state hubs have valid unique titles, descriptions, state names, community lists, and regional introductions, but most long-form content is identical. | The pages are usable and coherent, yet have limited state-specific differentiation beyond the configuration text. |
| Low | The state-hub community cards are informational, while the locations-directory community pills are links. | The two presentations set different interaction expectations for the same representative communities. |

All audited routes returned HTTP 200: `/`, `/locations`, `/georgia`, `/illinois`, and `/michigan`.
