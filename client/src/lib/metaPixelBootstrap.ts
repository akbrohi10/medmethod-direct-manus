export const WEBINAR_CONFIRMATION_PIXEL_PATHS = new Set([
  "/webinar-registration-confirmed",
  "/live-webinar3-confirmed",
]);

const WEBINAR_PIXEL_SCRIPT_ID = "webinar-confirmation-meta-pixel";

export function shouldInstallMetaPixel(pathname: string): boolean {
  return WEBINAR_CONFIRMATION_PIXEL_PATHS.has(pathname);
}

export function installMetaPixelForCurrentRoute(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  if (!shouldInstallMetaPixel(window.location.pathname)) return false;
  if (document.getElementById(WEBINAR_PIXEL_SCRIPT_ID)) return false;

  const script = document.createElement("script");
  script.id = WEBINAR_PIXEL_SCRIPT_ID;
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
fbq('track', 'Lead');
`;
  document.head.appendChild(script);
  return true;
}
