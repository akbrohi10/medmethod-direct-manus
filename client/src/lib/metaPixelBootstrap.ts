type MetaConversionEvent = "Lead" | "Schedule";

export const CONFIRMATION_PIXEL_EVENTS = new Map<string, MetaConversionEvent>([
  ["/webinar-registration-confirmed", "Lead"],
  ["/live-webinar3-confirmed", "Lead"],
  ["/care-team-booking-confirmed", "Schedule"],
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

  const script = document.createElement("script");
  script.id = CONFIRMATION_PIXEL_SCRIPT_ID;
  const conversionCall = eventName === "Lead"
    ? "fbq('track', 'Lead');"
    : "fbq('track', 'Schedule');";
  script.textContent = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1589326469554181');
fbq('track', 'PageView');
${conversionCall}
`;
  document.head.appendChild(script);
  scheduleConversionDeliveryFallback(eventName);
  return true;
}
