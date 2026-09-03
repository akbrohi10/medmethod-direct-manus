# Live Webinar 2 — Remaining Fill-In Tokens

`/live-webinar2` remains review-only. The following visible tokens must be replaced and checked before any advertising or registration activation.

| Token | Location | Required input |
|---|---|---|
| `[DAY]`, `[MONTH]`, `[DATE]`, `[TIME]`, `[TIMEZONE]` | `WEBINAR_EVENT.dateTimeDisplay` and hero date line | Confirmed webinar calendar date, start time, and timezone |
| `[DURATION]` | `WEBINAR_EVENT.duration` and hero date line | Confirmed webinar duration |
| `[STATE LIST]` | Inline availability disclosure after visitors select **See states** | Confirmed state list for educational-event availability and ad geo-targeting |
| `[CREDENTIALS]` | Compact presenter strip below the desktop hero video | Short verified credential line |
| `[CREDENTIALS — BOARD CERTIFICATION, SPECIALTY, YEARS IN PRACTICE]` | Full presenter block below **What You’ll Learn** | Verified full credential line |
| `[VIDEO LENGTH]` | Video overlay label before playback starts | Confirmed runtime of the final webinar video |
| `[APPROVED AVAILABILITY DISCLAIMER]` | Separate testosterone disclosure footnote | Regulatory-approved replacement availability language |

The First Name and Email form is intentionally visual-only. It must remain inactive until an approved registration destination and confirmation workflow are configured.

The countdown now displays only its four value boxes and unit labels. Set `WEBINAR_EVENT.startsAt` to the confirmed ISO date-time when the real countdown should begin.
