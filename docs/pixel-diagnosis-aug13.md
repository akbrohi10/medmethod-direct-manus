# Meta Pixel Diagnosis — Aug 13, 2026

## Key Finding: /thank-you vs /thank-you2

### /thank-you (WORKS in Meta Events Manager)
- fbq queue: `init:1589326469554181, track:PageView` (only 2 items)
- dataLayer events: `gtm.js, booking_complete`
- NO Purchase event in the page HTML or queue
- The pixel that "works" on /thank-you is ONLY firing init + PageView
- The Purchase conversion must be triggered by GTM using the `booking_complete` dataLayer event

### /thank-you2 (NOT working in Meta Events Manager)
- fbq queue: `init:1589326469554181, track:PageView, track:PageView, track:Purchase` (4 items)
- dataLayer events: `gtm.js, booking_complete_wl2`
- Purchase IS in the queue from our code

## Root Cause
The pixel on /thank-you "works" because GTM fires a Purchase tag triggered by the
`booking_complete` dataLayer event. Our website code only provides init + PageView.

For /thank-you2, GTM doesn't have a trigger for `booking_complete_wl2`, so even though
our code queues Purchase, the GTM-managed pixel may be overriding or conflicting.

## Solution
The dataLayer event on /thank-you2 is `booking_complete_wl2`. GTM needs a trigger
that fires the Purchase tag when this event occurs. This is a GTM configuration change.

ALTERNATIVELY: Change the dataLayer event on /thank-you2 from `booking_complete_wl2`
to `booking_complete` (same as /thank-you) so the existing GTM trigger fires for both pages.
