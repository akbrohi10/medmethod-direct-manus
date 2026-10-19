// Runs after the existing base initializer and PageView, which define/queue fbq.
// Independent boolean-only flags prevent duplicate Lead/Schedule on refresh.
// Storage-denied browsers fail closed for each event.
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
(function () {
  if (window.location.pathname !== '/care-team-booking-confirmed' || typeof fbq !== 'function') return;
  try {
    if (window.sessionStorage.getItem('mmd_schedule_fired') === 'true') return;
    window.sessionStorage.setItem('mmd_schedule_fired', 'true');
  } catch (_) {
    return;
  }
  fbq('track', 'Schedule');
})();
`;
