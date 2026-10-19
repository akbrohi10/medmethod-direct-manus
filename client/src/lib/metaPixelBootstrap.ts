import { CARE_TEAM_CONFIRMATION_LEAD_CODE } from "./careTeamConfirmationLead";

type MetaConversionEvent = "Lead" | "Schedule" | "CompleteRegistration";

export const CONFIRMATION_PIXEL_EVENTS = new Map<string, MetaConversionEvent>([
  ["/webinar-registration-confirmed", "Lead"],
  ["/live-webinar3-confirmed", "Lead"],
  ["/care-team-booking-confirmed", "Lead"],
  ["/thank-you", "CompleteRegistration"],
]);

const CONFIRMATION_PIXEL_SCRIPT_ID = "confirmation-meta-pixel";
const META_PIXEL_ID = "1589326469554181";

export function getMetaPixelEventForPath(pathname: string): MetaConversionEvent | undefined {
  return CONFIRMATION_PIXEL_EVENTS.get(pathname);
}

export function buildMetaEventFallbackUrl(
  eventName: MetaConversionEvent,
  pageUrl: string,
  timestamp: number,
): string {
  const url = new URL("https://www.facebook.com/tr");
  url.searchParams.set("id", META_PIXEL_ID);
  url.searchParams.set("ev", eventName);
  url.searchParams.set("noscript", "1");
  url.searchParams.set("dl", pageUrl);
  url.searchParams.set("ts", String(timestamp));
  return url.toString();
}

function hasCollectionRequest(eventName: MetaConversionEvent): boolean {
  return performance.getEntriesByType("resource").some(entry => {
    try {
      const url = new URL(entry.name);
      return url.hostname.endsWith("facebook.com") && url.pathname === "/tr" && url.searchParams.get("ev") === eventName;
    } catch {
      return false;
    }
  });
}

function scheduleConversionDeliveryFallback(eventName: MetaConversionEvent): void {
  window.setTimeout(() => {
    const fallbackId = `confirmation-${eventName.toLowerCase()}-fallback`;
    if (hasCollectionRequest(eventName) || document.getElementById(fallbackId)) return;

    const image = document.createElement("img");
    image.id = fallbackId;
    image.width = 1;
    image.height = 1;
    image.alt = "";
    image.style.display = "none";
    image.src = buildMetaEventFallbackUrl(eventName, window.location.href, Date.now());
    document.body.appendChild(image);
  }, 3_000);
}

export function shouldInstallMetaPixel(pathname: string): boolean {
  return CONFIRMATION_PIXEL_EVENTS.has(pathname);
}

export function installMetaPixelForCurrentRoute(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  const eventName = getMetaPixelEventForPath(window.location.pathname);
  if (!eventName) return false;
  if (document.getElementById(CONFIRMATION_PIXEL_SCRIPT_ID)) return false;

  if (window.location.pathname === "/care-team-booking-confirmed" &&
      (window.location.search || window.location.hash)) {
    try {
      window.history.replaceState(window.history.state, "", window.location.pathname);
    } catch (_) {
      return false; // Never load this Pixel with a URL we could not sanitize.
    }
  }

  const script = document.createElement("script");
  script.id = CONFIRMATION_PIXEL_SCRIPT_ID;
  const isCareTeamConfirmation = window.location.pathname === "/care-team-booking-confirmed";
  const conversionCall = isCareTeamConfirmation
    ? CARE_TEAM_CONFIRMATION_LEAD_CODE
    : eventName === "Lead"
    ? "fbq('track', 'Lead');"
    : eventName === "Schedule"
      ? "fbq('track', 'Schedule');"
      : "fbq('track', 'CompleteRegistration');";
  script.textContent = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
${isCareTeamConfirmation ? "fbq('set', 'autoConfig', false, '1589326469554181');" : ""}
fbq('init', '1589326469554181');
fbq('track', 'PageView');
${conversionCall}
`;
  document.head.appendChild(script);
  // The supplied care-team snippet should send Lead once. A timed image
  // fallback can race the queued SDK event and count the same lead twice.
  if (window.location.pathname !== "/care-team-booking-confirmed") {
    scheduleConversionDeliveryFallback(eventName);
  }
  return true;
}
