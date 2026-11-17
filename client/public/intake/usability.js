/* Intake-only usability. No provider calls, tracker installation or payment changes. */
window.MmdIntakeUsability = (function () {
  var config = {}, storageKey = "mmd_intake_progress_v1", ttl = 86400000;
  var states = "Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|District of Columbia|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming".split("|");
  function configure(value) { config = value; }
  function filled(value) { return typeof value === "string" ? value.trim().length > 0 : value !== null && value !== undefined && value !== ""; }
  function rows(value) { return (Array.isArray(value) ? value : []).filter(function (row) { return row && typeof row === "object" && [row.name, row.detail, row.extra].some(function (text) { return typeof text === "string" && text.trim(); }); }).map(function (row) { return { name: String(row.name || "").trim(), detail: String(row.detail || "").trim(), extra: String(row.extra || "").trim() }; }); }
  function validate(screen, answers, demoMode, original) {
    if (!screen) return false;
    if (screen.required && ["repeatMeds", "allergy"].indexOf(screen.type) !== -1) return rows(answers[screen.id]).length > 0;
    if (screen.type === "identity" && String(answers.phone || "").replace(/\D/g, "").length !== 10) return false;
    return original(screen, answers, demoMode);
  }
  function choiceMessage(field) {
    if (config.C(field)) return "Please choose at least one answer to continue.";
    var values = (field.options || []).map(function (o) { return o.value; });
    return values.length === 2 && values.indexOf("yes") !== -1 && values.indexOf("no") !== -1 ? "Please answer Yes or No to continue." : "Please choose an answer to continue.";
  }
  function entry(key, label, message, selector, reason) { return { key: key, label: label, message: message, selector: selector || "", reason: reason || "missing" }; }
  function missing(screen, answers, options) {
    options = options || {}; var result = [];
    if (!screen || options.enabled || options.submitting || options.uploadBusy) return result;
    function add(key, label, message, selector, reason) { result.push(entry(key, label, message, selector, reason)); }
    function question(q, selector) {
      if (!q || !q.required || config.validate(q, answers, options.demoMode)) return;
      if (q.type === "choice") {
        var value = answers[q.id], choices = (q.options || []).map(function (o) { return o.value; }), values = Array.isArray(value) ? value : [value];
        if (values.length && values.every(function (v) { return typeof v === "string" && choices.indexOf(v) !== -1; }) && !(values.indexOf("none") !== -1 && values.length > 1)) return;
      }
      add(q.id, q.question_text || q.question || "Answer", q.type === "choice" ? choiceMessage(q) : "Please fill this in to continue.", selector || ".stage > .field, .stage > .choices");
    }
    if (screen.type === "identity") {
      var labels = { "First name": ["first", "Please type your full first and last name."], "Last name": ["last", "Please type your full first and last name."], "Date of birth": ["dob", "Please select your full date of birth.", ".dob-field"], "State": ["state", "Please choose your state."], "Email address": ["email", "Please enter a valid email address."], "Mobile number": ["phone", "Please enter a valid 10-digit mobile number."], "Mobile number verification": ["verification", "Please verify your mobile number to continue.", 'section[aria-labelledby="mmd-phone-verification-title"]'], "Terms of Service and Privacy Policy acceptance": ["terms", "Please check this box to continue.", "#w-terms"], "Clinical review confirmation": ["checkoutAck", "Please check this box to continue.", "#mmd-free-intake-ack"], "Signed forms": ["signing", "Please return to the signing screen and sign all required forms.", ".mmd-return-signing"] };
      (options.missingDetails || []).forEach(function (label) { var value = labels[label] || [label, "Please fill this in to continue."]; add(value[0], label, value[1], value[2], value[0] === "email" || value[0] === "phone" ? "invalid_format" : "missing"); });
    } else if (screen.type === "signForms") {
      var signing = options.signing || {};
      (signing.documents || []).forEach(function (d) { add(d.id, d.title, "Please check this box to continue.", "#mmd-sign-forms-" + d.id); });
      if (signing.name) add("signer", "Full name", "Please type your full first and last name.", ".sign-forms-field-name");
      if (signing.electronic) add("electronic", "Electronic signature agreement", "Please check this box to continue.", ".sign-forms-electronic-agreement");
      if (signing.signature) add("signature", "Your signature", "Please sign below to continue.", ".sign-forms-signature-pad");
    } else if (screen.type === "glp1Group") {
      config.glp1.missing(screen, answers, options.demoMode).forEach(function (q) { question(q, "#mmd-glp1-" + q.id); });
    } else if (screen.type === "shippingAddress") {
      if (!filled(answers.wAddressLine1)) add("wAddressLine1", "Street address", "Please enter your street address.", "#wAddressLine1");
      if (!filled(answers.wAddressCity)) add("wAddressCity", "City", "Please enter your city.", "#wAddressCity");
      if (!filled(answers.state) || !config.ae(answers.state)) add("state", "State", !filled(answers.state) ? "Please choose your state." : "We can't ship to " + answers.state + " yet. Questions? Call our Care Team at (888) 362-7011.", "#wAddressState", !filled(answers.state) ? "missing" : "unsupported_state");
      if (!/^\d{5}$/.test(String(answers.wAddressZip || ""))) add("wAddressZip", "ZIP code", "Please enter your ZIP code.", "#wAddressZip", "invalid_format");
    } else if (screen.type === "measure") {
      [["ft", "Feet", 3, 8], ["inch", "Inches", 0, 11], ["lb", "Weight (lb)", 50, 1000]].forEach(function (f) { if (!config.D(answers[f[0]], f[2], f[3])) add(f[0], f[1], filled(answers[f[0]]) ? "Please enter " + f[1].toLowerCase() + " between " + f[2] + " and " + f[3] + "." : "Please fill this in to continue.", "", "invalid_format"); });
    } else if (screen.type === "treatmentInterest" || screen.type === "drugs") {
      add(screen.id, "Treatment option", "Pick one to continue – or tap 'I'm not sure' and Dr. Al-Deek will recommend one for you.", ".treatment-interest");
    } else if (screen.type === "repeatMeds" || screen.type === "allergy") {
      var hasNone = (screen.options || []).some(function (option) { return option.value === "none"; });
      if (screen.required && !rows(answers[screen.id]).length) add(screen.id, "Your list", hasNone ? "Please add at least one, or choose 'None'." : "Please add at least one to continue.", ".repeat", "empty_list");
    } else if (screen.fields) {
      screen.fields.forEach(function (f) {
        if (!config.T(f, answers) || !f.required) return;
        var value = answers[f.id], valid = config.C(f) ? Array.isArray(value) && value.length > 0 : filled(value);
        if (!valid) add(f.id, f.question || "Answer", f.options ? choiceMessage(f) : "Please fill this in to continue.", '[data-mmd-field="' + f.id + '"]');
      });
    } else {
      question(screen);
      (screen.follow_up_fields || []).forEach(function (f) {
        if (!config.T(f, answers) || !f.required) return;
        var valid = config.C(f) ? Array.isArray(answers[f.id]) && answers[f.id].length > 0 : filled(answers[f.id]);
        if (!valid) add(f.id, f.question || "Answer", f.options ? choiceMessage(f) : "Please fill this in to continue.", '[data-mmd-field="' + f.id + '"]');
      });
    }
    return result;
  }
  function target(item) {
    var node = item.selector ? document.querySelector(item.selector) : null;
    if (!node && !item.selector) {
      var labels = { first: "First name", last: "Last name", state: "Your state", email: "Email address", phone: "Mobile number", ft: "Feet", inch: "Inches", lb: "Weight (lb)" };
      node = Array.from(document.querySelectorAll(".stage .field")).find(function (field) { var span = field.querySelector("span"); return span && span.textContent.trim() === labels[item.key]; });
    }
    return node;
  }
  function focus(item, shake) {
    var node = target(item); if (!node) return;
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var control = node.matches("input,select,textarea,button") ? node : node.querySelector("input,select,textarea,button,canvas");
    var viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    var scrollTarget = node.getBoundingClientRect().height > viewportHeight - 180 && control ? control : node;
    scrollTarget.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" });
    if (control) control.focus({ preventScroll: true });
    if (shake && !reduced && node.animate) node.animate([{ transform: "translateX(0)" }, { transform: "translateX(-3px)" }, { transform: "translateX(3px)" }, { transform: "translateX(0)" }], { duration: 180 });
  }
  function events(screen, errors, demoMode) {
    var query = new URLSearchParams(window.location.search);
    if (demoMode || ["prefill", "preview", "test", "is_test", "admin"].some(function (key) { return query.has(key); }) || window.self !== window.top || typeof window.hj !== "function" || !/^w[A-Za-z0-9]{1,32}$/.test(screen.id)) return;
    window.hj("event", "intake_validation_error_" + screen.id);
    Array.from(new Set(errors.map(function (error) { return error.reason; }))).filter(function (reason) { return ["missing", "invalid_format", "empty_list", "unsupported_state"].indexOf(reason) !== -1; }).forEach(function (reason) { window.hj("event", "field_rejected_" + screen.id + "_" + reason); });
  }
  function keys() {
    var blocked = ["wShippingAddress", "wScalePhoto", "wSignForms", "w39", "w40", "w40a", "w41", "w01", "w02"];
    var allowed = ["ft", "inch", "lb", "videoVisitInterest"];
    (config.questions ? config.questions("w") : []).forEach(function (q) {
      if (blocked.indexOf(q.id) !== -1 || ["identity", "shippingAddress", "scalePhoto", "consent", "checkout"].indexOf(q.type) !== -1) return;
      if (["choice", "text", "short", "month", "date", "number", "repeatMeds", "allergy", "treatmentInterest"].indexOf(q.type) !== -1) allowed.push(q.id);
      (q.fields || []).concat(q.follow_up_fields || []).forEach(function (f) { allowed.push(f.id); });
    });
    return allowed;
  }
  function sanitize(answers) { var clean = {}; keys().forEach(function (key) { var value = answers[key]; if (typeof value === "string" && value.length <= 12000 || typeof value === "boolean" || typeof value === "number") clean[key] = value; else if (Array.isArray(value) && value.length <= 100) clean[key] = value.filter(function (x) { return typeof x === "string" || x && typeof x === "object"; }).map(function (x) { return typeof x === "string" ? x : { name: String(x.name || "").slice(0,12000), detail: String(x.detail || "").slice(0,12000), extra: String(x.extra || "").slice(0,12000) }; }); }); return clean; }
  function clear() { try { localStorage.removeItem(storageKey); } catch (_) {} }
  function load() {
    try {
      var raw = localStorage.getItem(storageKey); if (!raw || raw.length > 350000) return null;
      var draft = JSON.parse(raw), now = Date.now();
      if (draft.version !== 1 || draft.optIn !== true || !Number.isFinite(draft.expiresAt) || !Number.isFinite(draft.createdAt) || draft.expiresAt <= now || draft.createdAt > now || draft.expiresAt - draft.createdAt !== ttl || !/^w[A-Za-z0-9]{1,32}$/.test(draft.screen || "")) { clear(); return null; }
      return { answers: sanitize(draft.answers || {}), screen: draft.screen, history: (Array.isArray(draft.history) ? draft.history : []).filter(function (id) { return /^w[A-Za-z0-9]{1,32}$/.test(id); }).slice(0,100), createdAt: draft.createdAt, expiresAt: draft.expiresAt };
    } catch (_) { clear(); return null; }
  }
  function save(answers, screen, history, createdAt) {
    try { var now = Date.now(), start = createdAt || now; if (now >= start + ttl) { clear(); return false; } localStorage.setItem(storageKey, JSON.stringify({ version: 1, optIn: true, answers: sanitize(answers), screen: screen.id, history: history, createdAt: start, expiresAt: start + ttl })); return true; } catch (_) { return false; }
  }
  function ProgressSetting(props) {
    return props.demoMode ? null : props.JSX.jsxs("section", { className: "mmd-save-setting", "data-hj-suppress": true, children: [props.JSX.jsxs("label", { className: "checkline", children: [props.JSX.jsx("input", { type: "checkbox", checked: props.enabled, onChange: function (e) { props.onChange(e.target.checked); } }), props.JSX.jsx("span", { children: "Save my progress on this device" })] }), props.JSX.jsx("p", { children: "Optional. Saves questionnaire answers on this device for up to 24 hours. Avoid shared devices. Contact details, signatures and uploads are not saved; enter them again after a reload." }), props.notice && props.JSX.jsx("p", { role: "status", children: props.notice })] });
  }
  return { configure: configure, states: states, validate: validate, rows: rows, missing: missing, target: target, focus: focus, events: events, sanitize: sanitize, load: load, save: save, clear: clear, ProgressSetting: ProgressSetting, storageKey: storageKey, ttl: ttl };
})();
