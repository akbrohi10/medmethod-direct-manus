/* First-party success gating only. Meta runs solely in an opaque neutral frame. */
(function (window, document) {
  "use strict";
  if (window.MmdMetaLead) return;
  var KEY = "mmd_meta_lead_once_v1";
  var INTAKE_KEY = "mmd_meta_intake_accepted_v1";
  var EXCLUDED_KEY = "mmd_meta_session_excluded_v1";
  var TTL = 15 * 60 * 1000;
  var INTAKE_ALIAS = "/confirmation";
  var INTAKE_DONE = "mmd_meta_intake_done_v1:";
  var allowed = ["/intake/thank-you", INTAKE_ALIAS, "/thank-you-video", "/thank-you", "/thank-you2", "/thank-you-video-4799", "/thank-you-video-97", "/care-team-booking-confirmed", "/webinar-registration-confirmed", "/live-webinar3-confirmed"];
  var sent = false;
  var intakeReady = false;
  function note() {
    // Fixed text only: never log queries, identities, clinical receipts or contact data.
    if (window.console && typeof window.console.info === "function") window.console.info("[Confirmation measurement] suppressed.");
    return false;
  }
  function intakeThankYou(value) { return value === "/intake/thank-you" || value === INTAKE_ALIAS; }
  function intakeReceipt(value) { return typeof value === "string" && /^[0-9a-f]{64}$/.test(value); }
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
    return note();
  }
  function arm(destination, options) {
    options = options || {};
    var target = path(destination);
    if (!target || options.excluded === true || excluded()) return deny();
    // The alias is never a general payment/booking destination.
    if (target === INTAKE_ALIAS && !intakeReceipt(options.intakeReceipt)) return note();
    // The physician calendar host is Schedule-only, never a payment Lead.
    if (target === "/thank-you" || path(window.location.pathname) === "/thank-you") return false;
    var intake = intakeThankYou(target) || target === "/thank-you-video";
    try {
      if (!intake && window.sessionStorage.getItem(INTAKE_KEY) === "1") return false;
      if (intake) window.sessionStorage.setItem(INTAKE_KEY, "1");
      if (intakeReceipt(options.intakeReceipt) && window.localStorage.getItem(INTAKE_DONE + options.intakeReceipt) === "1") return note();
      var prior = JSON.parse(window.sessionStorage.getItem(KEY) || "null");
      if (prior && prior.path === target && prior.intakeReceipt === options.intakeReceipt && Date.now() - prior.at >= 0 && Date.now() - prior.at <= TTL) return true;
      if (!window.crypto || typeof window.crypto.randomUUID !== "function") return false;
      var item = { v: 1, path: target, at: Date.now(), token: window.crypto.randomUUID() };
      if (intakeReceipt(options.intakeReceipt)) item.intakeReceipt = options.intakeReceipt;
      window.sessionStorage.setItem(KEY, JSON.stringify(item));
      return true;
    } catch (_) { return false; }
  }
  // Call only after the first-party submit response is accepted/validated; await before navigation.
  // The clinical UUID is transiently hashed here, never stored in the gate or sent to the child.
  async function armIntakeAccepted(result, options) {
    options = options || {};
    if (options.excluded === true || excluded() || !result || result.is_test !== false) return deny();
    var target = path(result.redirect_url);
    if ((!intakeThankYou(target) && target !== "/thank-you-video") || result.payment_status !== "NOT_REQUIRED" ||
        typeof result.submission_id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(result.submission_id) ||
        typeof result.submission_token !== "string" || !result.submission_token) return note();
    try {
      var digest = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode("mmd-intake-lead-v1:" + result.submission_id.toLowerCase()));
      var receipt = Array.from(new Uint8Array(digest)).map(function (byte) { return byte.toString(16).padStart(2, "0"); }).join("");
      return arm(target, { excluded: false, intakeReceipt: receipt });
    } catch (_) { return note(); }
  }
  // UI must read its original parameters first. Only these two intake TY routes may be scrubbed.
  function consumeIntakeThankYou() {
    var current = path(window.location.pathname);
    if (window.__mmdIntakeThankYou !== true || !intakeThankYou(current)) return note();
    var suppressed = excluded(); // Preserve demo/test/admin exclusions before discarding query params.
    if (suppressed) deny();
    try { window.history.replaceState(window.history.state, "", INTAKE_ALIAS); }
    catch (_) { return note(); }
    intakeReady = true;
    if (suppressed) return false;
    var item;
    try { item = JSON.parse(window.sessionStorage.getItem(KEY) || "null"); } catch (_) { return note(); }
    if (!item || !intakeThankYou(item.path)) return note();
    return consume(item.path);
  }
  function consume(destination) {
    if (sent || excluded()) { if (excluded()) deny(); else note(); return false; }
    var target = path(destination || window.location.pathname);
    var current = path(window.location.pathname);
    if ((intakeThankYou(current) && window.__mmdIntakeThankYou === true) && !intakeReady) return note();
    if (target === INTAKE_ALIAS && (!intakeReady || window.__mmdIntakeThankYou !== true)) return note();
    if (target === "/thank-you" || path(window.location.pathname) === "/thank-you") {
      try { var legacy = JSON.parse(window.sessionStorage.getItem(KEY) || "null"); if (legacy && legacy.path === target) window.sessionStorage.removeItem(KEY); } catch (_) {}
      return false;
    }
    var item;
    try {
      item = JSON.parse(window.sessionStorage.getItem(KEY) || "null");
      if (!item || item.v !== 1 || item.path !== target || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(item.token) || !Number.isFinite(item.at) || Date.now() - item.at < 0 || Date.now() - item.at > TTL) return note();
      if (item.intakeReceipt !== undefined) {
        if (!intakeReceipt(item.intakeReceipt)) return note();
        if (window.localStorage.getItem(INTAKE_DONE + item.intakeReceipt) === "1") { window.sessionStorage.removeItem(KEY); return note(); }
        // Claim before creating the SDK frame: refresh/replayed accepted responses must not retry it.
        window.localStorage.setItem(INTAKE_DONE + item.intakeReceipt, "1");
      } else if (target === INTAKE_ALIAS) return note();
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
  // Only the physician calendar's verified completion handler may call this.
  var SCHEDULE_KEY = "mmd_meta_schedule_once_v1";
  var SCHEDULE_DONE = "mmd_meta_schedule_completed_v1";
  function schedule() {
    if (sent || excluded() || path(window.location.pathname) !== "/thank-you") return false;
    try {
      // Neutralize only this completed-booking host before loading Meta; routing stays intact.
      if (window.location.search || window.location.hash) window.history.replaceState(window.history.state, "", "/thank-you");
      if (window.sessionStorage.getItem(SCHEDULE_DONE) === "1" || !window.crypto || typeof window.crypto.randomUUID !== "function") return false;
      // An independent short-lived, one-use receipt; never the provider fingerprint.
      window.sessionStorage.setItem(SCHEDULE_KEY, JSON.stringify({ v: 1, path: "/thank-you", at: Date.now(), token: window.crypto.randomUUID() }));
      var receipt = JSON.parse(window.sessionStorage.getItem(SCHEDULE_KEY) || "null");
      if (!receipt || receipt.v !== 1 || receipt.path !== "/thank-you" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(receipt.token) || !Number.isFinite(receipt.at) || Date.now() - receipt.at < 0 || Date.now() - receipt.at > TTL) return false;
      window.sessionStorage.removeItem(SCHEDULE_KEY);
      window.sessionStorage.setItem(SCHEDULE_DONE, "1");
    } catch (_) { return false; }
    if (document.getElementById("mmd-meta-neutral-lead")) return false;
    sent = true;
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
      frame.contentWindow.postMessage({ type: "mmd_meta_schedule_emit" }, "*");
    }
    window.addEventListener("message", onReady);
    document.body.appendChild(frame);
    return true;
  }
  window.MmdMetaLead = Object.freeze({ arm: arm, armIntakeAccepted: armIntakeAccepted, consume: consume, consumeIntakeThankYou: consumeIntakeThankYou, exclude: deny, schedule: schedule });
  if (excluded()) deny();
  function boot() {
    var current = path(window.location.pathname);
    if (intakeThankYou(current)) return; // TY UI reads parameters, scrubs, then consumes explicitly.
    if (current) consume(current);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
})(window, document);
