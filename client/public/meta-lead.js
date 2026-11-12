/* First-party success gating only. Meta runs solely in an opaque neutral frame. */
(function (window, document) {
  "use strict";
  if (window.MmdMetaLead) return;
  var KEY = "mmd_meta_lead_once_v1";
  var INTAKE_KEY = "mmd_meta_intake_accepted_v1";
  var EXCLUDED_KEY = "mmd_meta_session_excluded_v1";
  var TTL = 15 * 60 * 1000;
  var allowed = ["/intake/thank-you", "/thank-you-video", "/thank-you", "/thank-you2", "/thank-you-video-4799", "/thank-you-video-97", "/care-team-booking-confirmed", "/webinar-registration-confirmed", "/live-webinar3-confirmed"];
  var sent = false;
  function path(value) {
    if (typeof value !== "string" || value.indexOf("?") >= 0 || value.indexOf("#") >= 0) return null;
    var clean = value.replace(/\/$/, "").toLowerCase();
    return allowed.indexOf(clean) >= 0 ? clean : null;
  }
  function excluded() {
    if (window.__mmdMetaLeadEligible !== true) return true;
    var query = new URLSearchParams(window.location.search);
    var keys = ["prefill", "preview", "demo", "test", "is_test", "admin", "qa", "test_event_code"];
    if (keys.some(function (key) { return query.has(key); }) || /^(demo|test|preview|admin|qa)$/i.test(query.get("mode") || "")) return true;
    try { return window.sessionStorage.getItem(EXCLUDED_KEY) === "1"; } catch (_) { return true; }
  }
  function deny() {
    try { window.sessionStorage.setItem(EXCLUDED_KEY, "1"); window.sessionStorage.removeItem(KEY); } catch (_) {}
    return false;
  }
  function arm(destination, options) {
    options = options || {};
    var target = path(destination);
    if (!target || options.excluded === true || excluded()) return deny();
    var intake = target === "/intake/thank-you" || target === "/thank-you-video";
    try {
      if (!intake && window.sessionStorage.getItem(INTAKE_KEY) === "1") return false;
      if (intake) window.sessionStorage.setItem(INTAKE_KEY, "1");
      var prior = JSON.parse(window.sessionStorage.getItem(KEY) || "null");
      if (prior && prior.path === target && Date.now() - prior.at >= 0 && Date.now() - prior.at <= TTL) return true;
      if (!window.crypto || typeof window.crypto.randomUUID !== "function") return false;
      window.sessionStorage.setItem(KEY, JSON.stringify({ v: 1, path: target, at: Date.now(), token: window.crypto.randomUUID() }));
      return true;
    } catch (_) { return false; }
  }
  function consume(destination) {
    if (sent || excluded()) { if (excluded()) deny(); return false; }
    var target = path(destination || window.location.pathname);
    var item;
    try {
      item = JSON.parse(window.sessionStorage.getItem(KEY) || "null");
      if (!item || item.v !== 1 || item.path !== target || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(item.token) || !Number.isFinite(item.at) || Date.now() - item.at < 0 || Date.now() - item.at > TTL) return false;
      window.sessionStorage.removeItem(KEY);
    } catch (_) { return false; }
    if (document.getElementById("mmd-meta-neutral-lead")) return false;
    sent = true;
    // Do not alter the application's route: the sandboxed child is Meta's only document.
    var frame = document.createElement("iframe");
    frame.id = "mmd-meta-neutral-lead";
    frame.title = "Confirmation measurement";
    frame.hidden = true;
    frame.setAttribute("aria-hidden", "true");
    frame.setAttribute("sandbox", "allow-scripts");
    frame.setAttribute("referrerpolicy", "no-referrer");
    frame.src = "/meta-confirmation";
    var granted = false;
    function onReady(event) {
      if (granted || event.source !== frame.contentWindow || event.origin !== "null" || !event.data || Object.keys(event.data).length !== 1 || event.data.type !== "mmd_meta_ready") return;
      granted = true;
      window.removeEventListener("message", onReady);
      frame.contentWindow.postMessage({ type: "mmd_meta_emit" }, "*");
    }
    window.addEventListener("message", onReady);
    document.body.appendChild(frame);
    return true;
  }
  window.MmdMetaLead = Object.freeze({ arm: arm, consume: consume, exclude: deny });
  if (excluded()) deny();
  function boot() { if (path(window.location.pathname)) consume(window.location.pathname); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
})(window, document);
