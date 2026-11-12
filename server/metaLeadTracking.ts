import type { Express, Request } from "express";
import { COOKIE_NAME } from "../shared/const";
import { PUBLIC_MARKETING_PATHS } from "./publicMarketingMetaPixel";

export const META_LEAD_PIXEL_ID = "1651526243430714";
export const META_LEAD_FRAME_PATH = "/meta-confirmation";
const origins = ["https://medmethoddirect.com", "https://www.medmethoddirect.com"];
const confirmationPaths = new Set(["/intake/thank-you", "/thank-you-video", "/thank-you", "/thank-you2", "/thank-you-video-4799", "/thank-you-video-97", "/care-team-booking-confirmed", "/webinar-registration-confirmed", "/live-webinar3-confirmed"]);

export function metaLeadRequestExcluded(req: Pick<Request, "originalUrl" | "headers">, environment = process.env.NODE_ENV): boolean {
  if (environment !== "production") return true;
  try {
    const url = new URL(req.originalUrl, origins[0]);
    if (url.origin !== origins[0]) return true;
    if (["prefill", "preview", "demo", "test", "is_test", "admin", "qa", "test_event_code"].some(key => url.searchParams.has(key))) return true;
    if (/^(demo|test|preview|admin|qa)$/i.test(url.searchParams.get("mode") ?? "")) return true;
    // Fail closed for authenticated sessions, without reading identity or sending it to Meta.
    const cookieNames = (req.headers.cookie ?? "").split(";").map(pair => pair.trim().split("=")[0]);
    if ([COOKIE_NAME, "sa_session", "manus-cookie"].some(name => cookieNames.includes(name))) return true;
    return false;
  } catch { return true; }
}

export function injectMetaLeadGate(html: string, req: Pick<Request, "originalUrl" | "headers">, environment = process.env.NODE_ENV): string {
  if (html.includes('id="mmd-meta-lead-gate"') || !/<head(?:\s[^>]*)?>/i.test(html)) return html;
  let path: string;
  try { path = new URL(req.originalUrl, origins[0]).pathname.replace(/\/$/, "").toLowerCase() || "/"; if (path === "/index.html") path = "/"; } catch { return html; }
  // Source pages get only first-party success bookkeeping. No Meta SDK is loaded here.
  const source = ["/intake", "/care-team-booking", "/lp/wl", "/lp/wl2", "/thanks-payment", "/thanks-payment-wl2"].includes(path) || Array.from(PUBLIC_MARKETING_PATHS).some(publicPath => publicPath.toLowerCase() === path);
  if (!source && !confirmationPaths.has(path)) return html;
  const eligible = !metaLeadRequestExcluded(req, environment);
  const tag = `<script id="mmd-meta-lead-gate">window.__mmdMetaLeadEligible=${eligible ? "true" : "false"};</script><script src="/meta-lead.js" referrerpolicy="no-referrer"></script>`;
  return html.replace(/(<head(?:\s[^>]*)?>)/i, `$1\n${tag}`);
}

export function metaLeadFrameHtml(enabled: boolean): string {
  const bootstrap = enabled ? `
(function () {
  if (window.parent === window) return;
  var emitted = false;
  window.addEventListener('message', function (event) {
    if (emitted || event.source !== window.parent || ${JSON.stringify(origins)}.indexOf(event.origin) < 0 || !event.data || Object.keys(event.data).length !== 1 || event.data.type !== 'mmd_meta_emit') return;
    emitted = true;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;t.referrerPolicy='no-referrer';s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('set','autoConfig',false,'${META_LEAD_PIXEL_ID}');
    fbq('init','${META_LEAD_PIXEL_ID}');
    fbq('track','Lead');
  });
  window.parent.postMessage({type:'mmd_meta_ready'}, '*');
})();` : "";
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="referrer" content="no-referrer"><meta name="robots" content="noindex,nofollow"><title>Confirmation</title><script>${bootstrap}</script></head><body></body></html>`;
}

export function registerMetaLeadFrame(app: Express): void {
  app.get(META_LEAD_FRAME_PATH, (req, res) => {
    if (req.originalUrl !== META_LEAD_FRAME_PATH) { res.status(404).end(); return; }
    const enabled = !metaLeadRequestExcluded(req);
    res.set({
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "Referrer-Policy": "no-referrer",
      "Content-Security-Policy": "default-src 'none'; script-src 'unsafe-inline' https://connect.facebook.net; connect-src https://www.facebook.com https://connect.facebook.net; img-src https://www.facebook.com; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors https://medmethoddirect.com https://www.medmethoddirect.com",
    }).type("html").send(metaLeadFrameHtml(enabled));
  });
}
