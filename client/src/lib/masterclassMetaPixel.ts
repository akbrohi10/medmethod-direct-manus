const MASTERCLASS_PIXEL_SCRIPT_ID = "masterclass-meta-pixel";
const MASTERCLASS_PIXEL_ID = "1589326469554181";

// Only the supplied PageView event is used here. Confirmation conversions remain
// owned by the existing route-aware confirmation bootstrap.
const MASTERCLASS_PIXEL_CODE = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
// This installation is page-only: do not auto-track SPA navigation or forms.
fbq.disablePushState = true;
fbq('set', 'autoConfig', false, '1589326469554181');
var masterclassPixelInitialized = false;
try {
  masterclassPixelInitialized = !!(fbq.getState && fbq.getState().pixels.some(function(pixel) {
    return String(pixel.id) === '1589326469554181';
  }));
} catch (_) {}
if (!masterclassPixelInitialized) fbq('init', '1589326469554181');
fbq('track', 'PageView');
`;

function hasExistingMasterclassPageView(): boolean {
  return performance.getEntriesByType("resource").some((entry) => {
    try {
      const url = new URL(entry.name);
      const pageUrl = url.searchParams.get("dl");
      return (url.hostname === "facebook.com" || url.hostname.endsWith(".facebook.com")) &&
        url.pathname.replace(/\/$/, "") === "/tr" &&
        url.searchParams.get("id") === MASTERCLASS_PIXEL_ID &&
        url.searchParams.get("ev") === "PageView" &&
        !!pageUrl && new URL(pageUrl).pathname.replace(/\/$/, "") === "/masterclass";
    } catch {
      return false;
    }
  });
}

export function installMasterclassMetaPixel(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  if (window.location.pathname.replace(/\/$/, "") !== "/masterclass") return false;
  if (document.getElementById(MASTERCLASS_PIXEL_SCRIPT_ID)) return false;
  // Do not repeat a matching PageView if an external tag manager already sent it.
  if (hasExistingMasterclassPageView()) return false;

  const script = document.createElement("script");
  script.id = MASTERCLASS_PIXEL_SCRIPT_ID;
  script.textContent = MASTERCLASS_PIXEL_CODE;
  document.head.appendChild(script);
  return true;
}
