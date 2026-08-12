# ThankYou2 Meta Pixel Verification

## Deployed-page findings — 2026-08-12

- The deployed `/thank-you2` page loads `https://connect.facebook.net/en_US/fbevents.js`.
- `window.fbq` is present as a function and reports as loaded.
- The initial console view did not show a browser error.

## Next check

- Confirm that the supplied Pixel ID is registered in the Meta runtime and that the page's Purchase call reaches that specific Pixel.

## Runtime diagnosis

The deployed ThankYou2 bundle contains the supplied Pixel ID and Purchase call. However, in the browser session the Meta library resource reports no transferred body, the `fbq` function remains only the initial queue stub, and no Meta tracking request is created. This browser environment is preventing the third-party Meta script from executing, so it cannot verify the event delivery from this session.

## Static-header repair verification

The supplied bootstrap now runs in the static document header for the `/thank-you2` path before the React app mounts. In preview, the document contains the header snippet and the queued calls are `init` for Pixel ID `1589326469554181`, followed by `PageView` and `Purchase`.

## Fresh production verification

With a cache-busting query on production, the static header is present and the Meta queue contains the expected `init`, `PageView`, and `Purchase` calls. The GTM data layer also contains `booking_complete_wl2`. The third-party Meta library remains only a queued stub in this browser environment, preventing the queued events from reaching Meta during sandbox verification.

## Production verification after sitewide fix (Aug 12 2026)

After removing the pathname gate:
- `fbq` function exists, `loaded=true`, `version=2.0`
- Queue contains: init(1589326469554181), PageView, Purchase — all 3 correct
- `fbevents.js` script tag IS in the DOM with `async=true`
- BUT: `transferSize=0`, `encodedBodySize=0`, `decodedBodySize=0`, `responseStatus=0`
- `fbq.callMethod` is `undefined` (library never executed)
- Zero `facebook.com/tr` tracking requests sent

**Conclusion**: The sandbox/Chromium environment is BLOCKING `fbevents.js` from loading (transferSize=0, responseStatus=0). This is a sandbox network restriction, NOT a code issue. The code is correct — on a real user's browser without ad blockers, the library will load and process the queue.

**However**, the user reports it's still not working on their real browser. This means either:
1. The deployment hasn't propagated yet (CDN cache)
2. There's a Content Security Policy blocking it
3. The user has an ad blocker
4. There's a conflict with GTM also loading a pixel

**Next approach**: Instead of relying solely on the static header, also fire the pixel from the React component using a dynamic script injection that doesn't depend on the initial page load timing.

## Comparison: /thank-you vs /thank-you2 (Aug 12 2026)

Both pages show IDENTICAL behavior in this sandbox:
- Both have `fbq` function present
- Both have `fbevents.js` script tag in DOM
- Both show `transferSize=0`, `decodedBodySize=0` (sandbox blocks the library)
- Both have `callMethod=undefined` (library never executed)
- `/thank-you` queue: init + PageView (no Purchase — correct, it's not gated)
- `/thank-you2` queue: init + PageView + Purchase (correct)

The user confirms `/thank-you` works in Meta Events Manager but `/thank-you2` doesn't.
Since the code is now identical in approach (both use the same sitewide header pixel),
the difference MUST be in how the user ARRIVES at each page:
- `/thank-you` is reached via the $50 payment flow (likely a different redirect mechanism)
- `/thank-you2` is reached via the $15 WL2 payment flow

KEY INSIGHT: The ThankYou component does NOT have any pixel-specific code — it relies
entirely on the sitewide header. So if /thank-you works, the sitewide header approach
IS correct. The issue must be something specific to the /thank-you2 page that prevents
the library from executing AFTER it loads.

WAIT — looking at the page title: /thank-you shows "You're Confirmed | MedMethod Direct"
which means react-helmet-async updated the title. But the initial HTML title is
"MedMethod Direct | Virtual Hormone Therapy & GLP-1 Weight Loss for Women".

This means /thank-you is loaded as a FULL PAGE LOAD (the default HTML title shows first,
then React updates it). The same should be true for /thank-you2.

REAL DIFFERENCE: The user may have tested /thank-you BEFORE the recent changes that
removed the old pixel from that page. Or there's a GTM trigger configured for /thank-you
but not /thank-you2.
