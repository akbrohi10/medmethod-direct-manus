const CARE_TEAM_BOOKING_PIXEL_SCRIPT_ID = "care-team-booking-meta-pixel";

// This installer belongs only to the booking page. Existing confirmation and
// masterclass tracking are deliberately left untouched.
const CARE_TEAM_BOOKING_PIXEL_CODE = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
// Keep the added tracking page-only, not automatic navigation or form tracking.
fbq.disablePushState = true;
fbq('set', 'autoConfig', false, '1589326469554181');
var careTeamBookingPixelInitialized = false;
try {
  careTeamBookingPixelInitialized = !!(fbq.getState && fbq.getState().pixels.some(function(pixel) {
    return String(pixel.id) === '1589326469554181';
  })) || !!(fbq.queue && Array.prototype.some.call(fbq.queue, function(call) {
    return call[0] === 'init' && String(call[1]) === '1589326469554181';
  }));
} catch (_) {}
if (!careTeamBookingPixelInitialized) fbq('init', '1589326469554181');
fbq('track', 'PageView');
fbq('track', 'Lead');
`;

export function installCareTeamBookingMetaPixel(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  if (window.location.pathname.replace(/\/$/, "") !== "/care-team-booking") return false;
  if (document.getElementById(CARE_TEAM_BOOKING_PIXEL_SCRIPT_ID)) return false;

  const script = document.createElement("script");
  script.id = CARE_TEAM_BOOKING_PIXEL_SCRIPT_ID;
  script.textContent = CARE_TEAM_BOOKING_PIXEL_CODE;
  document.head.appendChild(script);
  return true;
}
