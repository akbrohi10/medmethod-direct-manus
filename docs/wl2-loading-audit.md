# WL2 Loading Audit — 2026-08-11

- The live `/lp/WL2` route initially displayed the app-level loading screen before the page rendered.
- Once rendered, the above-the-fold hero loaded successfully with the doctor image, logo, copy, CTA, and social-proof notification.
- The full page has a long scroll length; the embedded booking calendar is not above the fold and should remain deferred until the final modal step.
- Next audit actions: inspect the WL2 source for image attributes, font delivery, route-level scripts, and third-party components that can be deferred without changing the approved design.

## Optimization Validation

The optimized hero image and logo were verified in the preview render. The hero preserves its approved composition and the logo remains visually intact. The former hero PNG measured approximately 1.99 MB and the logo PNG approximately 718 KB; the WL2-specific WebP replacements are approximately 67 KB and 13 KB. The global preload for an unrelated hero image and the site-wide GHL form-embed script were also removed, while the actual booking calendar remains deferred until the final modal step.
