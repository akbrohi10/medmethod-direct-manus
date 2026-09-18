# Webinar Lead Attribution Setup

## Purpose

The two webinar landing pages now forward ad-attribution parameters from the visitor’s landing-page URL into the hosted GoHighLevel **Webinar Form** iframe. This allows each new webinar contact to retain the campaign, ad set, ad, and click identifiers that accompanied the visitor from an ad.

The pages also send a separate GoHighLevel `source` value so contacts can be filtered by landing page:

| Landing page | GoHighLevel Source value |
|---|---|
| `/live-webinar2` | `webinar_live-webinar2` |
| `/live-webinar3` | `webinar_live-webinar3` |

> **Scope:** This applies to new submissions after the website checkpoint is published. It cannot reconstruct the original ad for contacts who submitted before attribution parameters were present.

## Required Meta Ads Manager Tracking Parameters

At the **Ad** level in Meta Ads Manager, open **Tracking** and set the URL parameters to the following exact HighLevel-compatible template:

```text
utm_source=fb_ad&utm_medium={{adset.name}}&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&campaign_id={{campaign.id}}
```

This keeps the HighLevel fields aligned as follows:

| HighLevel contact attribution | Meta value |
|---|---|
| Source | `fb_ad` (recognized as Paid Social) |
| Campaign Name | Meta campaign name |
| Adset Name | Meta ad set name |
| Ad Name | Meta ad name |
| Campaign ID | Meta campaign ID |

Use unique, stable campaign, ad-set, and ad names. Do not rename an active item if historical reporting needs to stay readable; create a new one instead.

## Required GoHighLevel Form Step

In GoHighLevel, open **Sites → Forms → Webinar Form** (form ID `A3e1g5dCf1hc3tY3xpHi`) and add the built-in **Source** field if it is not already present. The field is hidden from the visitor. Save and publish the form.

The website passes `source=webinar_live-webinar2` or `source=webinar_live-webinar3` to the iframe URL. HighLevel uses that URL value to override the form’s default Source field, making the landing page visible as the contact’s **Contact Source**. This source field complements—rather than replaces—HighLevel’s First and Latest Attribution values.

## Where to Review a Lead

Open **Contacts**, select the new webinar contact, and review:

1. **Activity / Attribution**: First Attribution and Latest Attribution should show the UTM source, campaign, ad set, ad, campaign ID, referrer, and applicable click IDs.
2. **Contact Source**: should read `webinar_live-webinar2` or `webinar_live-webinar3`.
3. **Form Submission**: should identify the Webinar Form submission.

## Controlled Test

After publishing the website checkpoint and the GoHighLevel form, open one of these test URLs in a private browser window, submit a disposable test contact, and then inspect the contact record:

```text
https://medmethoddirect.com/live-webinar2?utm_source=fb_ad&utm_medium=test_adset&utm_campaign=test_webinar_campaign&utm_content=test_creative&campaign_id=123456
```

```text
https://medmethoddirect.com/live-webinar3?utm_source=fb_ad&utm_medium=test_adset&utm_campaign=test_webinar_campaign&utm_content=test_creative&campaign_id=123456
```

The contact should show **Paid Social** attribution with the test campaign, ad set, and ad values, plus the matching webinar landing-page Contact Source.

## Technical Notes

The GoHighLevel form is hosted inside an iframe. HighLevel’s external DOM form tracking does not apply to iframe forms, so the landing-page parameters are explicitly forwarded to the hosted form URL. The site forwards only standard campaign parameters and click IDs; it does not collect additional visitor data or change payment, booking, Meta Pixel, or webinar confirmation behavior.

## References

[1]: https://help.gohighlevel.com/support/solutions/articles/48001219997-understanding-attribution-source "HighLevel: Understanding Attribution Source"
[2]: https://help.gohighlevel.com/support/solutions/articles/48001204042-how-to-set-up-facebook-ad-reporting "HighLevel: Facebook Ad Reporting Setup"
[3]: https://help.gohighlevel.com/support/solutions/articles/155000001506-source-field-in-forms-and-surveys "HighLevel: Source Field in Forms and Surveys"
