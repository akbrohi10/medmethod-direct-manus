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
