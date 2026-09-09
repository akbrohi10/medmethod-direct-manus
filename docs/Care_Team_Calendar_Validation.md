# Care-Team Discovery Calendar Validation

## Supplied Calendar

The supplied SendMeAPro booking URL is:

```text
https://link.sendmeapro.com/widget/booking/18sbmUpLKjc7pcLE8jdN
```

The homepage discovery-call CTA routes to the existing `/care-team-booking` page, which contains this exact iframe source and the provided embed-script source.

## Preview Observation

The iframe mounts at a measurable 810px height in the preview. The provider initially displayed a loading state, then loaded correctly as a standalone calendar, showing the **Care Team** booking view, 15-minute duration, date selection, time-zone selection, and available time slots. The public booking page retains the exact supplied source and clear non-medical discovery-call context. The embedded route should be rechecked after publication or in the owner’s normal browser session because the provider initialization can take a moment to finish.

## Homepage Action Check

The homepage hero now presents two distinct pill actions side by side on desktop:

1. **Book Your 45-Minute Appointment with Dr. Al-Deek** for the physician appointment flow.
2. **Book a Free 15-Minute Discovery Call** for the care-team scheduling route, with supporting text limiting that call to general program and fit information rather than medical advice.

Navigating through the homepage discovery-call pill reached `/care-team-booking` successfully. After the provider initialization delay, the embedded calendar rendered its Care Team header, 15-minute duration, date selector, and time-zone control inside the page.
