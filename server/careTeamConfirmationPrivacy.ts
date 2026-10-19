export function injectCareTeamConfirmationPrivacyIntoHtml(html: string, requestUrl: string): string {
  if (requestUrl.split("?")[0] !== "/care-team-booking-confirmed") return html;
  if (html.includes('id="care-team-confirmation-url-privacy"')) return html;

  // This page does not use URL query/hash data. Run before GTM or Pixel loaders;
  // all other responses retain the untouched shared HTML shell.
  const guard = `<script id="care-team-confirmation-url-privacy">
window.history.replaceState(window.history.state, "", window.location.pathname);
</script>`;
  return html.replace(/(<meta\s+charset=[^>]+>)/i, `$1\n${guard}`);
}
