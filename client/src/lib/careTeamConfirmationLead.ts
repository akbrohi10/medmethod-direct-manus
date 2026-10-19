// Runs after the existing base initializer and PageView, which define/queue fbq.
// Storage-denied browsers fail closed: do not risk duplicate session conversions.
export const CARE_TEAM_CONFIRMATION_LEAD_CODE = `
(function () {
  if (window.location.pathname !== '/care-team-booking-confirmed' || typeof fbq !== 'function') return;
  try {
    if (window.sessionStorage.getItem('mmd_lead_fired') === 'true') return;
    window.sessionStorage.setItem('mmd_lead_fired', 'true');
  } catch (_) {
    return;
  }
  fbq('track', 'Lead');
})();
`;
