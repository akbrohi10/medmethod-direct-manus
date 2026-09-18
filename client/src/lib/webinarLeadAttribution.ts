const GHL_ATTRIBUTION_QUERY_KEYS = [
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
] as const;

export type WebinarLandingPage = "live-webinar2" | "live-webinar3";

const MAX_ATTRIBUTION_VALUE_LENGTH = 500;

function cleanQueryValue(value: string | null): string | null {
  if (!value) return null;

  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, "").trim();
  return cleaned ? cleaned.slice(0, MAX_ATTRIBUTION_VALUE_LENGTH) : null;
}

/**
 * GoHighLevel records attribution when its hosted form submits. Because the
 * webinar form is embedded in an iframe on a different origin, forward the
 * paid-click parameters from the landing-page URL into that hosted form URL.
 *
 * The `source` parameter is intentionally separate from UTM attribution. When
 * the HighLevel form includes a Source field, it gives the contact a clear,
 * filterable webinar-page label without overwriting the paid-ad campaign,
 * ad-set, or ad name supplied in the UTM parameters.
 */
export function buildWebinarRegistrationUrl(
  formUrl: string,
  landingPage: WebinarLandingPage,
  pageSearch = typeof window === "undefined" ? "" : window.location.search,
): string {
  const formUrlWithAttribution = new URL(formUrl);
  const landingPageParams = new URLSearchParams(pageSearch);

  for (const key of GHL_ATTRIBUTION_QUERY_KEYS) {
    const value = cleanQueryValue(landingPageParams.get(key));
    if (value) formUrlWithAttribution.searchParams.set(key, value);
  }

  formUrlWithAttribution.searchParams.set("source", `webinar_${landingPage}`);

  return formUrlWithAttribution.toString();
}

export const webinarAttributionKeys = GHL_ATTRIBUTION_QUERY_KEYS;
