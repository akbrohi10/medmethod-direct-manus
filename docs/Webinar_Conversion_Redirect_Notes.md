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

## Implementation Verification

The dedicated confirmation route loaded successfully in the browser on September 8, 2026. It emitted one `webinar_registration_complete` dataLayer event, confirmed that the Meta Pixel function was available, and wrote the session deduplication marker. No form submission was performed during this verification.

The `/live-webinar2` page also loaded successfully after the conversion-route update, and its primary **Reserve My Free Spot** CTA continued to open the existing SendMeAPro registration dialog without entering or submitting any lead information.

## References

[1]: https://help.gohighlevel.com/support/solutions/articles/155000006092-tracking-external-forms-with-gohighlevel "Tracking External Forms with GoHighLevel"
[2]: https://localsink.com/guides/how-to-add-a-redirect-on-gohighlevel-form-before-after-submission-button-gets-pressed-two-methods/ "How to Add a Redirect on GoHighLevel Form Before After Submission Button Gets Pressed Two Methods"
