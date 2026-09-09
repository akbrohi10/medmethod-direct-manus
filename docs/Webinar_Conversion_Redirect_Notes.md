# Webinar Registration Conversion Redirect Notes

## Local Destination

The dedicated destination is `/webinar-registration-confirmed`. It is intentionally separate from existing appointment and payment thank-you routes, and it will carry the webinar-only Meta `CompleteRegistration` event.

## Form Constraint

The registration form is rendered inside the SendMeAPro/GoHighLevel iframe `A3e1g5dCf1hc3tY3xpHi`. The parent page cannot inspect its inputs or reliably infer a successful submission because browser same-origin rules isolate iframe content. HighLevel’s official external-form-tracking documentation also states that iframe-based forms are not supported by DOM-based external tracking.[1]

## Redirect Method

The form itself must be configured in GoHighLevel to use its post-submission **Open URL** action and point to `https://www.medmethoddirect.com/webinar-registration-confirmed` after the site is published. A trusted postMessage listener in the host dialog will provide a same-site fallback if the form emits a recognized successful-submission signal; it will not manufacture a conversion from a button click or form load.

The fallback accepts only a known HighLevel/SendMeAPro origin, only messages emitted by this dialog’s iframe, and—when provided—only the matching webinar form ID. It then redirects the top-level site to the confirmation route. No global provider display script is installed.

## GoHighLevel Configuration Step

No GoHighLevel connector is available in this task, so the account-side form setting cannot be changed from the website code. In GoHighLevel, open the **Webinar Form** with ID `A3e1g5dCf1hc3tY3xpHi`, then open **Styles and Options** (gear icon) → **Options**. Under **On Submit**, choose **Open URL**, paste the published destination below, then save and publish the form.[2]

```text
https://www.medmethoddirect.com/webinar-registration-confirmed
```

Use the exact production URL above, not a development-preview address. After saving, submit one controlled test registration in a private browser window. The browser should navigate to the dedicated confirmation route, which emits the guarded `CompleteRegistration` Meta event and `webinar_registration_complete` dataLayer event exactly once per browser session.

## Live Webinar 3 Campaign-Specific Form

`/live-webinar3` now has the separate companion confirmation route below. Its website-side trusted completion listener is already configured to send recognized successful form messages to this path, while `/live-webinar2` retains the original route.

```text
https://www.medmethoddirect.com/live-webinar3-confirmed
```

For a deterministic provider-side redirect that does not change the original campaign, duplicate the existing **Webinar Form** in GoHighLevel first. Preserve its fields, required settings, and existing email/workflow behavior. On the duplicate form, choose **Styles and Options** → **Options** → **On Submit** → **Open URL**, then enter the live-webinar3 destination above and publish the duplicate.[2]

After publishing, provide the duplicate form’s new embed code or form ID. The `/live-webinar3` iframe should then be pointed to that duplicate form only; do not replace the original form used by `/live-webinar2`. This keeps the original campaign on `/webinar-registration-confirmed` and sends the short-form campaign to `/live-webinar3-confirmed`.

| Campaign | Landing page | Provider-side redirect | Website confirmation |
|---|---|---|---|
| Original webinar | `/live-webinar2` | `https://www.medmethoddirect.com/webinar-registration-confirmed` | `/webinar-registration-confirmed` |
| Short-form A/B webinar | `/live-webinar3` | `https://www.medmethoddirect.com/live-webinar3-confirmed` | `/live-webinar3-confirmed` |

## Live Webinar 3 Verification

The website-side flow is already assigned correctly: `/live-webinar3` supplies `/live-webinar3-confirmed` to the shared dialog’s trusted successful-submission listener, while the original campaign keeps its default confirmation path. The page-three confirmation route, form load, focused tests, full test suite, TypeScript check, and production build were reverified on September 9, 2026.

Because the current iframe still uses the original GoHighLevel form ID `A3e1g5dCf1hc3tY3xpHi`, the provider-side redirect must be changed on a **duplicate** form before a real submitted lead can be guaranteed to land at the page-three confirmation URL. Do not alter the original form’s Open URL setting; that would redirect the page-two campaign as well.

## Shared-Form Redirect Override Safeguard

The live provider test showed that the shared GoHighLevel form redirects successful `/live-webinar3` submissions to the original `/webinar-registration-confirmed` URL. The website now records a short-lived page-three handoff marker immediately before that campaign opens the shared form. If the provider sends the visitor to the original confirmation URL, that page consumes the marker and immediately replaces the location with `/live-webinar3-confirmed` before rendering its original confirmation content or conversion event.

Unmarked visits to `/webinar-registration-confirmed` remain on the original confirmation page. A simulated page-three handoff and an unmarked original-flow check both passed in the browser. The duplicate-form redirect configuration remains the preferred long-term provider-side separation, but the current live page-three flow now has a website-side safeguard.

## Event Details

The confirmed webinar is **Wednesday, September 16, 2026 at 7:00 PM ET**. Update the GoHighLevel confirmation message for the Webinar Form to the same event details so its provider-hosted confirmation remains consistent with the website confirmation route.

## Implementation Verification

The dedicated confirmation route loaded successfully in the browser on September 8, 2026. It emitted one `webinar_registration_complete` dataLayer event, confirmed that the Meta Pixel function was available, and wrote the session deduplication marker. No form submission was performed during this verification.

The `/live-webinar2` page also loaded successfully after the conversion-route update, and its primary **Reserve My Free Spot** CTA continued to open the existing SendMeAPro registration dialog without entering or submitting any lead information.

## References

[1]: https://help.gohighlevel.com/support/solutions/articles/155000006092-tracking-external-forms-with-gohighlevel "Tracking External Forms with GoHighLevel"
[2]: https://localsink.com/guides/how-to-add-a-redirect-on-gohighlevel-form-before-after-submission-button-gets-pressed-two-methods/ "How to Add a Redirect on GoHighLevel Form Before After Submission Button Gets Pressed Two Methods"
