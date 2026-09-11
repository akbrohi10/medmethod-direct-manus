# Care-Team Booking Redirect

The care-team calendar at `https://link.sendmeapro.com/widget/booking/18sbmUpLKjc7pcLE8jdN` currently has no redirect destination. Its published configuration resolves `form_submit_redirect_url` to null and `form_submit_type` to `ThankYou`, which explains why the embedded **Your meeting has been scheduled** panel remains inside `/care-team-booking`.

HighLevel officially supports replacing the built-in confirmation message with a redirect under **Calendar Settings → Advanced settings → Form & confirmation → Confirmation page**. The destination required for this flow is:

`https://medmethoddirect.com/care-team-booking-confirmed?contact_id={{contact.id}}&start={{appointment.start_time}}&timezone={{appointment.timezone}}&location={{appointment.meeting_location}}`

If a custom form controls submission behavior, HighLevel instructs enabling **Use custom form rules** and setting the form’s On Submit action to the same Redirect URL.

The published HighLevel widget bundle uses a top-level navigation helper for configured external redirect URLs, assigning the resolved destination to `window.top.location.href`. The shared embed script also recognizes a `modify-parent-url` message. The website-side listener accepts that message only from the exact care-team iframe window and `https://link.sendmeapro.com`, and only when the destination path is `/care-team-booking-confirmed`. It preserves the dynamic query string so the confirmation page can generate accurate Google, Outlook/Office 365, and Apple calendar entries.

## Sources

1. [HighLevel: Getting Started — Setup a Booking Calendar](https://help.gohighlevel.com/support/solutions/articles/155000005061-getting-started-setup-a-booking-calendar)
2. [HighLevel: Embedding HighLevel Calendars Using HTML Code](https://help.gohighlevel.com/support/solutions/articles/48000982201-embedding-highlevel-calendars-using-html-code)
3. [HighLevel: Global Settings in Services](https://help.gohighlevel.com/support/solutions/articles/155000003546-global-settings-in-services)
