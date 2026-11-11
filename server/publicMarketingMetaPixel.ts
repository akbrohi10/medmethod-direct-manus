/** Additional public marketing PageViews only; deliberately independent of global fbq. */
export const PUBLIC_MARKETING_PIXEL_ID = "1651526243430714";
const CANONICAL_ORIGIN = "https://medmethoddirect.com";
const SCRIPT_ID = "public-marketing-meta-pageview";
const IMAGE_ID = "public-marketing-meta-pageview-image";
const FALLBACK_ID = "public-marketing-meta-pageview-noscript";

// Exact registered public pages only. Unknown/private/clinical/result/payment routes fail closed.
export const PUBLIC_MARKETING_PATHS = new Set<string>([
  "/", "/locations", "/brand-ambassador", "/masterclass", "/masterclass2",
  "/free-masterclass", "/live-webinar", "/live-webinar2", "/live-webinar3",
  "/lp/hrt2", "/lp/hrt3", "/lp/WL", "/lp/WL2", "/asynchronous",
  "/weight-loss-menopause", "/weight-loss-menopauseV2",
  "/privacy-policy", "/terms", "/hipaa-notice", "/subscription-policy",
  "/shipping-policy", "/accessibility",
  "/virginia", "/maryland", "/washington-dc", "/florida", "/north-carolina",
  "/pennsylvania", "/colorado", "/arizona", "/texas", "/georgia",
  "/illinois", "/michigan",
  "/virginia/mclean",
  "/virginia/great-falls",
  "/virginia/vienna",
  "/virginia/reston",
  "/virginia/arlington",
  "/virginia/culpeper",
  "/virginia/warrenton",
  "/virginia/middleburg",
  "/virginia/leesburg",
  "/virginia/fredericksburg",
  "/virginia/alexandria",
  "/virginia/falls-church",
  "/virginia/tysons",
  "/virginia/herndon",
  "/maryland/bethesda",
  "/maryland/chevy-chase",
  "/maryland/potomac",
  "/maryland/rockville",
  "/maryland/silver-spring",
  "/maryland/easton",
  "/maryland/frederick",
  "/maryland/annapolis",
  "/maryland/bel-air",
  "/maryland/ellicott-city",
  "/maryland/chevy-chase-md",
  "/washington-dc/georgetown",
  "/washington-dc/capitol-hill",
  "/washington-dc/dupont-circle",
  "/washington-dc/chevy-chase-dc",
  "/washington-dc/friendship-heights",
  "/florida/miami",
  "/florida/boca-raton",
  "/florida/naples",
  "/florida/sarasota",
  "/florida/tampa",
  "/florida/marco-island",
  "/florida/vero-beach",
  "/florida/jupiter",
  "/florida/palm-beach-gardens",
  "/florida/ponte-vedra",
  "/north-carolina/charlotte",
  "/north-carolina/raleigh",
  "/north-carolina/cary",
  "/north-carolina/chapel-hill",
  "/north-carolina/wilmington",
  "/north-carolina/asheville",
  "/north-carolina/pinehurst",
  "/north-carolina/southern-pines",
  "/north-carolina/mooresville",
  "/north-carolina/waxhaw",
  "/north-carolina/apex",
  "/pennsylvania/philadelphia",
  "/pennsylvania/pittsburgh",
  "/pennsylvania/wayne",
  "/pennsylvania/doylestown",
  "/pennsylvania/newtown-square",
  "/pennsylvania/malvern",
  "/pennsylvania/kennett-square",
  "/pennsylvania/west-chester",
  "/pennsylvania/newtown",
  "/pennsylvania/horsham",
  "/pennsylvania/lansdale",
  "/colorado/denver",
  "/colorado/boulder",
  "/colorado/colorado-springs",
  "/colorado/highlands-ranch",
  "/colorado/fort-collins",
  "/colorado/greenwood-village",
  "/colorado/castle-rock",
  "/colorado/parker",
  "/colorado/longmont",
  "/colorado/loveland",
  "/colorado/steamboat-springs",
  "/arizona/scottsdale",
  "/arizona/paradise-valley",
  "/arizona/chandler",
  "/arizona/gilbert",
  "/arizona/tempe",
  "/arizona/tucson",
  "/arizona/peoria",
  "/arizona/queen-creek",
  "/arizona/surprise",
  "/arizona/fountain-hills",
  "/arizona/prescott",
  "/texas/houston",
  "/texas/austin",
  "/texas/dallas",
  "/texas/san-antonio",
  "/texas/the-woodlands",
  "/texas/plano",
  "/texas/mckinney",
  "/texas/sugar-land",
  "/texas/frisco",
  "/texas/round-rock",
]);

export function publicMarketingPixelPath(requestUrl: string): string | null {
  try {
    const url = new URL(requestUrl, CANONICAL_ORIGIN);
    if (url.origin !== CANONICAL_ORIGIN) return null;
    if (["prefill", "preview", "demo", "test", "is_test", "admin", "qa"].some(key => url.searchParams.has(key))) return null;
    if (/^(demo|test|preview|admin|qa)$/i.test(url.searchParams.get("mode") ?? "")) return null;
    const path = url.pathname === "/index.html" ? "/" : url.pathname.replace(/\/$/, "") || "/";
    return PUBLIC_MARKETING_PATHS.has(path) ? path : null;
  } catch {
    return null;
  }
}

export function publicMarketingPixelImageUrl(path: string, noScript = false): string {
  if (!PUBLIC_MARKETING_PATHS.has(path)) throw new Error("Public marketing Pixel path is not allowed");
  const url = new URL("https://www.facebook.com/tr");
  url.searchParams.set("id", PUBLIC_MARKETING_PIXEL_ID);
  url.searchParams.set("ev", "PageView");
  url.searchParams.set("dl", CANONICAL_ORIGIN + path);
  if (noScript) url.searchParams.set("noscript", "1");
  return url.toString();
}

export function injectPublicMarketingMetaPixel(html: string, requestUrl: string): string {
  const path = publicMarketingPixelPath(requestUrl);
  if (!path || html.includes(`id="${SCRIPT_ID}"`)) return html;
  const pixelUrl = publicMarketingPixelImageUrl(path);
  const script = `<script id="${SCRIPT_ID}">
(function () {
  var intendedPath = ${JSON.stringify(path)};
  var imageUrl = ${JSON.stringify(pixelUrl)};
  function sendPublicPageView() {
    if (document.getElementById(${JSON.stringify(IMAGE_ID)})) return;
    var currentPath = window.location.pathname === "/index.html" ? "/" : window.location.pathname.replace(/\\/$/, "") || "/";
    var query = new URLSearchParams(window.location.search);
    if (currentPath !== intendedPath || ["prefill", "preview", "demo", "test", "is_test", "admin", "qa"].some(function (key) { return query.has(key); })) return;
    if (/^(demo|test|preview|admin|qa)$/i.test(query.get("mode") || "")) return;
    var image = document.createElement("img");
    image.id = ${JSON.stringify(IMAGE_ID)};
    image.width = 1; image.height = 1; image.alt = "";
    image.style.display = "none";
    image.setAttribute("referrerpolicy", "no-referrer");
    image.src = imageUrl;
    document.body.appendChild(image);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", sendPublicPageView, { once: true });
  else sendPublicPageView();
})();
</script>`;
  const fallback = `<noscript id="${FALLBACK_ID}"><img height="1" width="1" style="display:none" alt="" referrerpolicy="no-referrer" src="${publicMarketingPixelImageUrl(path, true).replaceAll("&", "&amp;")}" /></noscript>`;
  if (!/<head(?:\s[^>]*)?>/i.test(html) || !/<body(?:\s[^>]*)?>/i.test(html)) return html;
  return html.replace(/(<head(?:\s[^>]*)?>)/i, `$1\n${script}`)
    .replace(/(<body(?:\s[^>]*)?>)/i, `$1\n${fallback}`);
}
