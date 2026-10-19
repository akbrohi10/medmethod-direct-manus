import { CARE_TEAM_CONFIRMATION_PIXEL_CODE } from "../client/src/lib/careTeamConfirmationPixel";

export function injectCareTeamConfirmationPrivacyIntoHtml(html: string, requestUrl: string): string {
  if (requestUrl.split("?")[0] !== "/care-team-booking-confirmed") return html;
  let page = html;

  // This page does not use URL query/hash data. Run before GTM or Pixel loaders;
  // all other responses retain the untouched shared HTML shell.
  if (!page.includes('id="care-team-confirmation-url-privacy"')) {
    const guard = `<script id="care-team-confirmation-url-privacy">
window.history.replaceState(window.history.state, "", window.location.pathname);
</script>`;
    page = page.replace(/(<meta\s+charset=[^>]+>)/i, `$1\n${guard}`);
  }

  // The existing client installer sees this ID and skips a duplicate copy.
  if (!page.includes('id="confirmation-meta-pixel"')) {
    page = page.replace(/<\/head>/i, `<!-- Meta Pixel Code -->\n<script id="confirmation-meta-pixel">${CARE_TEAM_CONFIRMATION_PIXEL_CODE}</script>\n<!-- End Meta Pixel Code -->\n</head>`);
  }

  // An image inside head/noscript is invalid HTML when JavaScript is disabled.
  // Keep the supplied PageView fallback in the body; it never runs with JS on.
  if (!page.includes('id="care-team-confirmation-meta-pixel-noscript"')) {
    page = page.replace(/<body([^>]*)>/i, '<body$1>\n<noscript id="care-team-confirmation-meta-pixel-noscript"><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1589326469554181&amp;ev=PageView&amp;noscript=1" /></noscript>');
  }
  return page;
}
