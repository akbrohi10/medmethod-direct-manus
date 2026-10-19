import { CARE_TEAM_CONFIRMATION_LEAD_CODE } from "./careTeamConfirmationLead";

// Used only for /care-team-booking-confirmed. The early URL privacy guard must
// finish first; do not start tracking if any query or fragment remains.
export const CARE_TEAM_CONFIRMATION_PIXEL_CODE = `
(function () {
  if (window.location.pathname !== '/care-team-booking-confirmed' || window.location.search || window.location.hash) return;
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('set', 'autoConfig', false, '1589326469554181');
fbq('init', '1589326469554181');
fbq('track', 'PageView');
${CARE_TEAM_CONFIRMATION_LEAD_CODE}
})();
`;
