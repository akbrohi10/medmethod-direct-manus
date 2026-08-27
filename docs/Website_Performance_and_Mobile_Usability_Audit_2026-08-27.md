# Website Performance and Mobile-Usability Audit

**Prepared by:** Manus AI  
**Date:** August 27, 2026  
**Scope:** No-change audit of unique MedMethod Direct templates and conversion journeys

## Executive Summary

The website is **mobile responsive across the tested templates**. All six representative routes returned HTTP 200, rendered without document-level horizontal overflow, showed no broken images, and produced no fresh application, API, or 4xx/5xx errors during the audit. Desktop and 375-pixel mobile screenshots showed no clipping or unusable layouts.

Performance is **good after the application and hosting layer are warm, but inconsistent on a completely cold visit**. The second cold-browser-cache pass produced mobile LCP readings from **1.11 to 2.60 seconds**. Google considers LCP of 2.5 seconds or less good at the 75th percentile.[1] The first homepage pass, however, encountered a hosting/network cold start and produced **8.83 seconds LCP**. These are laboratory observations, not real-user 75th-percentile field data.

The clearest optimization opportunity is **image transfer size**, especially on city pages. The representative Alexandria page transferred approximately **10.45 MB**, driven primarily by a **6.34 MB hero PNG** and a shared **1.86 MB service-card PNG**. The next largest opportunity is deferring payment and marketing scripts until they are needed.

## Efficient Test Coverage

The audit did not load every city or state page. It tested one route per unique template or major journey:

| Representative route | Coverage purpose |
|---|---|
| `/` | Main homepage and $199/$50-deposit intake entry |
| `/locations` | Locations directory template |
| `/georgia` | Shared Georgia/Illinois/Michigan state-hub template |
| `/virginia/alexandria` | Representative city-page pattern |
| `/blog/why-weight-gain-feels-different-in-menopause` | Article template and updated compliance content |
| `/lp/WL2` | Weight-loss conversion landing page |

The measurements used the live production domain, a clean browser cache, Chromium mobile emulation at 375 × 812 pixels, Navigation Timing, Paint Timing, LCP and layout-shift observers, network transfer records, and desktop/mobile screenshot review. The audit did not submit forms, create payment records, process charges, or send webhooks.

## Performance Results

| Route | Warmed mobile LCP | Transfer | Requests | CLS | Mobile overflow |
|---|---:|---:|---:|---:|---|
| `/` | 2.60 s | 5.82 MB | 64 | 0.0000 | None |
| `/locations` | 2.56 s | 1.25 MB | 40 | 0.0001 | None |
| `/georgia` | 1.11 s | 4.20 MB | 50 | 0.0000 | None |
| `/virginia/alexandria` | 1.14 s | 10.45 MB | 54 | 0.0000 | None |
| Menopause blog | 1.56 s | 2.09 MB | 38 | 0.0001 | None |
| `/lp/WL2` | 1.28 s | 1.64 MB | 45 | 0.0000 | None |

The tested CLS values are excellent. Google recommends CLS of 0.1 or less.[2] The homepage and Locations LCP values were just above the 2.5-second target in the warmed laboratory pass, while the other four representative routes were below it. Because LCP should be evaluated using real-user 75th-percentile data, these measurements should be treated as diagnostic rather than as Search Console field scores.[1]

## Mobile-Usability Results

All six routes remained within the 375-pixel viewport. The homepage’s condition carousel intentionally extends cards within its own horizontal scroller, but it does not create document-level overflow. Text, pricing, cards, disclosures, location lists, article content, and calls to action remained readable and unclipped.

Several shared navigation and footer links have rendered hit areas below 44 pixels in height. Examples include the 40 × 40 mobile menu button, 36-pixel-tall appointment buttons on some legacy location pages, and footer text links with 15–18-pixel line boxes. This is not a broken layout, but increasing the invisible padding around these controls would improve touch comfort without changing their appearance.

The audit found **zero broken images** across all six representative routes and no current browser-console errors or 4xx/5xx network responses in the project preview after rendering the same pages.

## Prioritized Findings

| Priority | Finding | Evidence | Recommended action |
|---|---|---|---|
| High | Oversized PNG images dominate several routes | Alexandria hero: 6.34 MB; shared vitamins image: 1.86 MB; homepage physician image: 1.95 MB; navbar logo: 0.70 MB | Create correctly sized WebP or AVIF variants and responsive `srcset` values. Prioritize the shared logo and service-card image because one optimization benefits many pages. |
| High | Cold visits can be materially slower than warmed visits | First homepage pass: 4.74 s TTFB and 8.83 s LCP; warmed pass: 0.69 s TTFB and 2.60 s LCP | Investigate short edge caching for the public application shell and verify production cold-start behavior from U.S. monitoring. Keep authenticated/API responses uncached. |
| High | Payment libraries load during initial page viewing | Stripe.js transferred about 250–281 KB before checkout on the homepage and WL2 | Dynamically import Stripe/PayPal payment forms only when the patient reaches the payment step. Preserve all existing payment behavior and test both providers before release. |
| Medium | The homepage activates a large third-party stack | GTM, multiple Google tags, Meta Pixel, Hotjar, affiliate tracking, analytics, Stripe and related endpoints were observed | Audit tag necessity and duplication. Where business requirements allow, load nonessential analytics and session-recording scripts after consent or browser idle. |
| Medium | Some shared mobile controls have small touch boxes | Mobile menu measured 40 × 40; several legacy CTA and footer links measured below 44 pixels tall | Increase padding or minimum target size while leaving typography and layout visually unchanged. |

## Overall Assessment

| Area | Assessment |
|---|---|
| Responsive layout | **Good.** No clipping, broken images, or document-level horizontal overflow was found. |
| Visual stability | **Very good.** CLS remained effectively zero across the representative routes. |
| Warmed load experience | **Acceptable to good.** Four routes were comfortably below 2.5 seconds LCP; homepage and Locations were slightly above. |
| Cold-load consistency | **Needs improvement.** The initial homepage visit was substantially slower before the host and assets were warm. |
| Highest-value optimization | **Image compression and responsive delivery**, followed by deferred payment and marketing scripts. |

No website source, payment logic, booking logic, tracking configuration, or public content was changed during this audit.

## References

[1]: https://web.dev/articles/lcp "web.dev — Largest Contentful Paint"
[2]: https://web.dev/articles/cls "web.dev — Cumulative Layout Shift"
[3]: https://web.dev/articles/inp "web.dev — Interaction to Next Paint"

