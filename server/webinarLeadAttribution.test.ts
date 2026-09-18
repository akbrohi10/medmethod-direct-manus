import { describe, expect, it } from "vitest";
import {
  buildWebinarRegistrationUrl,
  webinarAttributionKeys,
} from "../client/src/lib/webinarLeadAttribution";

describe("webinar lead attribution", () => {
  it("forwards standard paid-ad parameters and a filterable webinar source to the hosted GoHighLevel form", () => {
    const formUrl = buildWebinarRegistrationUrl(
      "https://link.sendmeapro.com/widget/form/A3e1g5dCf1hc3tY3xpHi",
      "live-webinar2",
      "?utm_source=fb_ad&utm_medium=Women+45%2B&utm_campaign=Menopause+Webinar&utm_content=Video+Creative&campaign_id=987654&fbclid=fb.test",
    );
    const params = new URL(formUrl).searchParams;

    expect(params.get("utm_source")).toBe("fb_ad");
    expect(params.get("utm_medium")).toBe("Women 45+");
    expect(params.get("utm_campaign")).toBe("Menopause Webinar");
    expect(params.get("utm_content")).toBe("Video Creative");
    expect(params.get("campaign_id")).toBe("987654");
    expect(params.get("fbclid")).toBe("fb.test");
    expect(params.get("source")).toBe("webinar_live-webinar2");
  });

  it("keeps only approved attribution keys and does not forward unrelated landing-page parameters", () => {
    const formUrl = buildWebinarRegistrationUrl(
      "https://link.sendmeapro.com/widget/form/A3e1g5dCf1hc3tY3xpHi?existing=value",
      "live-webinar3",
      "?utm_source=fb_ad&email=not-forwarded&contact_id=not-forwarded&random=value",
    );
    const params = new URL(formUrl).searchParams;

    expect(params.get("existing")).toBe("value");
    expect(params.get("utm_source")).toBe("fb_ad");
    expect(params.get("source")).toBe("webinar_live-webinar3");
    expect(params.has("email")).toBe(false);
    expect(params.has("contact_id")).toBe(false);
    expect(params.has("random")).toBe(false);
  });

  it("documents the standard source, campaign, and click-id forwarding set", () => {
    expect(webinarAttributionKeys).toEqual([
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "campaign_id",
      "ad_id",
      "adset_id",
      "gclid",
      "fbclid",
      "msclkid",
      "ttclid",
      "wbraid",
      "gbraid",
    ]);
  });
});
