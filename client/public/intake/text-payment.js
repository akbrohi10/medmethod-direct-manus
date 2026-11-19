/* Standalone intake checkout. Public SDK credentials only; never send intake data to PayPal. */
(function () {
  "use strict";
  // Pin the explicit URL-only demo override for this document's entire checkout.
  var DEMO_SANDBOX = false;
  try { DEMO_SANDBOX = new URLSearchParams(window.location.search).get("prefill") === "demo"; } catch (_) { /* Non-browser harnesses remain normal sessions. */ }
  var STORAGE_KEY = DEMO_SANDBOX ? "mmd_text_payment_demo_v1" : "mmd_text_payment_v1";
  var NAMESPACE = "mmdTextPayPal";
  var PAYMENT_ERROR = "Your payment didn't go through. Please try again or use a different card.";
  var CONFIG_ERROR = "Secure payment isn't configured correctly. Please contact the Care Team at (888) 362-7011.";
  var SDK_ERROR = "Secure payment is temporarily unavailable. Please retry loading payment options.";
  var RECOVERY_ERROR = "We couldn't confirm your payment status. Check again before making another payment.";
  var STORAGE_ERROR = "Payment checkout is not configured. Please contact the Care Team; do not make another payment.";
  var MODE_ERROR = "The payment mode changed. Please refresh checkout or contact the Care Team; do not make another payment.";
  var CONFIRMATION_ERROR = "Payment confirmation is unavailable. Please retry or contact the Care Team; do not make another payment.";
  function safePaymentMessage(failure, fallback) {
    var message = failure && failure.message;
    return [STORAGE_ERROR, MODE_ERROR, CONFIRMATION_ERROR, CONFIG_ERROR].indexOf(message) !== -1 ? message : fallback;
  }
  var sdkLoad = null;

  function opaquePair(value) {
    if (!value || typeof value.payment_token !== "string" || typeof value.order_id !== "string") return null;
    if (!/^[A-Za-z0-9._~-]{1,16384}$/.test(value.payment_token) || !/^[A-Za-z0-9_-]{1,128}$/.test(value.order_id)) return null;
    return { payment_token: value.payment_token, order_id: value.order_id };
  }
  function readPair() {
    try { return opaquePair(JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || "null")); } catch (_) { return null; }
  }
  function savePair(pair) {
    try { window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(opaquePair(pair))); } catch (_) { /* Recovery remains available in memory. */ }
  }
  function clearPair(pair) {
    try {
      var stored = readPair();
      if (stored && stored.payment_token === pair.payment_token) window.sessionStorage.removeItem(STORAGE_KEY);
    } catch (_) { /* No patient data is persisted by this module. */ }
  }
  function validConfig(config) {
    return config && config.configured === true && typeof config.client_id === "string" &&
      /^[A-Za-z0-9_-]{10,256}$/.test(config.client_id) &&
      (config.environment === "live" || config.environment === "sandbox") &&
      config.amount === "29.00" && config.currency === "USD";
  }
  function sameMode(result, config) {
    return result && (result.environment === undefined || result.environment === config.environment) &&
      (result.client_id === undefined || result.client_id === config.client_id) && (result.currency === undefined || result.currency === "USD");
  }
  function verified(result, config) {
    return sameMode(result, config) && result.payment_status === "COMPLETED" &&
      result.payment_provider === "paypal" && result.amount === "29.00" &&
      (result.redirect_url === "/intake/thank-you/" ||
        (config.environment === "sandbox" && result.is_test === true && result.redirect_url === "/intake/thank-you/?prefill=demo"));
  }
  function sdkUrl(config) {
    var query = new URLSearchParams({
      "client-id": config.client_id, components: "card-fields",
      "disable-funding": "paylater,venmo", currency: "USD", intent: "capture"
    });
    if (config.environment === "sandbox") query.set("buyer-country", "US");
    return "https://www.paypal.com/sdk/js?" + query.toString();
  }
  function matchesScript(script, config) {
    try {
      var url = new URL(script.src), expected = new URL(sdkUrl(config));
      if (url.origin !== expected.origin || url.pathname !== expected.pathname) return false;
      if (script.getAttribute("data-namespace") !== NAMESPACE) return false;
      return url.searchParams.toString() === expected.searchParams.toString();
    } catch (_) { return false; }
  }
  function loadSdk(config, retry) {
    var key = config.environment + ":" + config.client_id;
    if (sdkLoad && sdkLoad.key !== key) return Promise.reject(new Error(CONFIG_ERROR));
    if (retry && sdkLoad && sdkLoad.failed) {
      if (sdkLoad.script) sdkLoad.script.remove();
      // A failed load may have left a partial namespace, but never touch the optional video SDK.
      try { delete window[NAMESPACE]; } catch (_) { return Promise.reject(new Error(CONFIG_ERROR)); }
      sdkLoad = null;
    }
    if (sdkLoad) return sdkLoad.promise;
    var existing = document.querySelector('script[data-namespace="' + NAMESPACE + '"]');
    if (existing && !matchesScript(existing, config)) return Promise.reject(new Error(CONFIG_ERROR));
    if (window[NAMESPACE] && !existing) return Promise.reject(new Error(CONFIG_ERROR));
    var entry = { key: key, script: existing, failed: false, promise: null };
    sdkLoad = entry;
    entry.promise = new Promise(function (resolve, reject) {
      var script = existing || document.createElement("script"), settled = false, timer;
      entry.script = script;
      function clean() {
        window.clearTimeout(timer);
        script.removeEventListener("load", loaded);
        script.removeEventListener("error", failed);
      }
      function failed() {
        if (settled) return;
        settled = true; entry.failed = true; clean(); reject(new Error(SDK_ERROR));
      }
      function loaded() {
        if (settled) return;
        var sdk = window[NAMESPACE];
        if (!sdk || typeof sdk.CardFields !== "function") { failed(); return; }
        settled = true; clean(); resolve(sdk);
      }
      timer = window.setTimeout(failed, 15000);
      script.addEventListener("load", loaded);
      script.addEventListener("error", failed);
      if (existing && window[NAMESPACE]) { loaded(); return; }
      if (!existing) {
        script.src = sdkUrl(config); script.async = true;
        script.setAttribute("data-namespace", NAMESPACE);
        document.head.appendChild(script);
      }
    });
    return entry.promise;
  }

  window.MmdCreateTextPayment = function (React, JSX, helpers) {
    if (!helpers || typeof helpers.request !== "function") throw new Error("Text payment requires the intake request helper.");
    var configPromise = null, completionClaims = new Set();
    function configuration(retry) {
      if (retry) configPromise = null;
      if (!configPromise) {
        configPromise = helpers.request("/api/intake/text-payment/config", DEMO_SANDBOX ? { method: "GET", demo_mode: true } : { method: "GET" }, CONFIG_ERROR).then(function (config) {
          if (!validConfig(config)) throw new Error(config && config.readiness_reason === "payment_storage_unavailable" ? STORAGE_ERROR : CONFIG_ERROR);
          if (DEMO_SANDBOX && config.environment !== "sandbox") throw new Error(CONFIG_ERROR);
          return config;
        });
        configPromise.catch(function () { configPromise = null; });
      }
      return configPromise;
    }
    function post(path, body) {
      return helpers.request(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }, PAYMENT_ERROR);
    }
    return function TextPayment(props) {
      var latest = React.useRef(props); latest.current = props;
      var root = React.useRef(null), nameHost = React.useRef(null), numberHost = React.useRef(null), expiryHost = React.useRef(null), securityHost = React.useRef(null);
      var cardFields = React.useRef(null), cardSubmission = React.useRef(null), safeFailure = React.useRef("");
      var mounted = React.useRef(false);
      var operation = React.useRef(null);
      if (!operation.current) {
        var initialPair = DEMO_SANDBOX ? readPair() : opaquePair(props.resumePayment) || readPair();
        operation.current = { pair: initialPair, create: null, capture: null, status: null, open: false, done: false, blocked: !!initialPair, recovered: false };
      }
      var op = operation.current;
      var configState = React.useState(null), config = configState[0], setConfig = configState[1];
      var sdkState = React.useState(null), sdk = sdkState[0], setSdk = sdkState[1];
      var loadState = React.useState("loading"), loading = loadState[0], setLoading = loadState[1];
      var errorState = React.useState(""), error = errorState[0], setError = errorState[1];
      var busyState = React.useState(false), processing = busyState[0], setProcessing = busyState[1];
      var recoveryState = React.useState(op.blocked), recovering = recoveryState[0], setRecovering = recoveryState[1];
      var confirmedState = React.useState(false), confirmed = confirmedState[0], setConfirmed = confirmedState[1];
      var fundingState = React.useState({ card: null }), funding = fundingState[0], setFunding = fundingState[1];
      var retryState = React.useState(0), retry = retryState[0], setRetry = retryState[1];
      var recoveryRetryState = React.useState(0), recoveryRetry = recoveryRetryState[0], setRecoveryRetry = recoveryRetryState[1];
      function showError(message) {
        safeFailure.current = [STORAGE_ERROR, MODE_ERROR, CONFIRMATION_ERROR, CONFIG_ERROR].indexOf(message) !== -1 ? message : "";
        if (mounted.current) setError(message);
      }
      async function freshConfiguration(activeConfig) {
        var current;
        try {
          // Configuration only: no intake, card values, order, capture or settings change.
          current = await helpers.request("/api/intake/text-payment/config", DEMO_SANDBOX ? { method: "GET", demo_mode: true } : { method: "GET" }, CONFIG_ERROR);
        } catch (failure) { throw new Error(safePaymentMessage(failure, CONFIG_ERROR)); }
        if (!validConfig(current)) throw new Error(current && current.readiness_reason === "payment_storage_unavailable" ? STORAGE_ERROR : CONFIG_ERROR);
        if (DEMO_SANDBOX && current.environment !== "sandbox") throw new Error(CONFIG_ERROR);
        if (!sameMode(current, activeConfig)) throw new Error(MODE_ERROR);
        return current;
      }
      function payBusy(value) { if (mounted.current) setProcessing(value); }
      function eligibleNow() {
        return latest.current.valid === true && latest.current.busy !== true && !op.open &&
          !op.create && !op.capture && !op.status && !op.blocked && !op.done;
      }
      // Card fields are hosted by PayPal. Native submit and server guards own checkout eligibility.
      function updateActions() {}
      function validate() {
        try { return typeof latest.current.onValidate === "function" && latest.current.onValidate() === true; } catch (_) { return false; }
      }
      async function complete(result, activeConfig) {
        if (!verified(result, activeConfig)) throw new Error(PAYMENT_ERROR);
        if (op.pair && result.paypal_order_id !== undefined && result.paypal_order_id !== op.pair.order_id) throw new Error(PAYMENT_ERROR);
        if (op.done) return;
        op.done = true; op.blocked = true; op.open = false;
        if (mounted.current) { setConfirmed(true); setRecovering(false); setError(""); }
        updateActions();
        var claim = op.pair && op.pair.payment_token;
        if (claim && completionClaims.has(claim)) return;
        if (claim) completionClaims.add(claim);
        try {
          await latest.current.onComplete(result);
          if (op.pair) clearPair(op.pair);
        } catch (_) {
          // A verified charge must never become a new checkout if parent navigation fails.
          showError("Your payment is confirmed, but we couldn't open your confirmation. Please contact the Care Team at (888) 362-7011.");
        }
      }
      function paymentFailed(failure) {
        if (op.done) return;
        // Do not unlock an in-flight capture on a late SDK popup error or cancel event.
        if (!op.capture && !op.create) { op.open = false; payBusy(false); }
        showError(safeFailure.current || safePaymentMessage(failure, PAYMENT_ERROR)); updateActions();
      }
      function createOrder() {
        if (op.create) return op.create;
        if (op.done || op.blocked || op.capture || latest.current.busy === true || !validate() || latest.current.valid !== true) return Promise.reject(new Error(PAYMENT_ERROR));
        op.open = true; payBusy(true); showError("");
        op.create = (async function () {
          await freshConfiguration(config);
          if (op.pair) return op.pair.order_id;
          // Read the current callback only when checkout starts. Serialize a real immutable snapshot.
          var input = await latest.current.getInput();
          if (DEMO_SANDBOX) input = Object.assign({}, input, { demo_mode: true });
          if (!validate() || latest.current.valid !== true || latest.current.busy === true) throw new Error(PAYMENT_ERROR);
          var result = await post("/api/intake/text-payment/order", input);
          if (!sameMode(result, config)) throw new Error(CONFIG_ERROR);
          var pair = opaquePair(result);
          if (!pair) throw new Error(PAYMENT_ERROR);
          op.pair = pair; savePair(pair);
          return pair.order_id;
        })().catch(function (failure) {
          var message = safePaymentMessage(failure, PAYMENT_ERROR);
          op.open = false; payBusy(false); showError(message); throw new Error(message);
        }).finally(function () { op.create = null; updateActions(); });
        updateActions(); return op.create;
      }
      function approve(data) {
        if (op.capture) return op.capture;
        if (op.done) return Promise.resolve();
        if (!op.pair || !data || op.blocked || op.status || latest.current.busy === true || data.orderID !== op.pair.order_id || !validate() || latest.current.valid !== true) {
          paymentFailed(); return Promise.reject(new Error(PAYMENT_ERROR));
        }
        op.open = true; payBusy(true); showError("");
        op.capture = (async function () {
          await freshConfiguration(config);
          var result = await post("/api/intake/text-payment/capture", op.pair);
          await complete(result, config);
        })().catch(function (failure) {
          // An ambiguous capture must be checked server-side before enabling another attempt.
          op.blocked = true;
          if (mounted.current) setRecovering(true);
          var message = safePaymentMessage(failure, PAYMENT_ERROR);
          showError(message); throw new Error(message);
        }).finally(function () { op.capture = null; op.open = false; payBusy(false); updateActions(); });
        updateActions(); return op.capture;
      }
      function checkStatus(activeConfig) {
        if (op.status) return op.status;
        if (!op.pair || op.done) return Promise.resolve();
        op.blocked = true;
        if (mounted.current) { setRecovering(true); setError(""); }
        op.status = (async function () {
          var result = await post("/api/intake/text-payment/status", { payment_token: op.pair.payment_token });
          if (!sameMode(result, activeConfig)) throw new Error(CONFIG_ERROR);
          if (result.order_id && result.order_id !== op.pair.order_id) throw new Error(CONFIG_ERROR);
          if (result.payment_status === "COMPLETED") { await complete(result, activeConfig); return; }
          if (result.amount !== undefined && result.amount !== "29.00") throw new Error(CONFIG_ERROR);
          // Only explicit server states can release recovery. Never infer unpaid from an error.
          if (["PENDING", "CREATED", "SAVED", "APPROVED", "NOT_COMPLETED", "DECLINED", "CANCELLED", "CANCELED", "VOIDED", "EXPIRED"].indexOf(result.payment_status) === -1) throw new Error(RECOVERY_ERROR);
          if (["VOIDED", "EXPIRED"].indexOf(result.payment_status) !== -1) { clearPair(op.pair); op.pair = null; }
          op.blocked = false; op.recovered = true;
          if (mounted.current) setRecovering(false);
        })().catch(function (failure) { showError(safePaymentMessage(failure, RECOVERY_ERROR)); }).finally(function () { op.status = null; updateActions(); });
        updateActions(); return op.status;
      }
      React.useLayoutEffect(function () {
        mounted.current = true;
        if (op.pair) savePair(op.pair);
        // Mask the payment region AND every ancestor before rendering third-party buttons.
        for (var node = root.current; node && node.nodeType === 1; node = node.parentElement) {
          node.setAttribute("data-hj-suppress", "true"); node.setAttribute("data-cs-mask", "true");
        }
        return function () { mounted.current = false; };
      }, []);
      React.useEffect(function () {
        var stopped = false;
        setLoading("loading"); setError("");
        configuration(retry > 0).then(function (value) {
          if (stopped) return null;
          setConfig(value);
          return loadSdk(value, retry > 0);
        }).then(function (value) {
          if (stopped || !value) return;
          setSdk(value); setLoading("ready");
        }).catch(function (failure) {
          if (stopped) return;
          var message = safePaymentMessage(failure, SDK_ERROR);
          setLoading(message === CONFIG_ERROR || message === STORAGE_ERROR ? "configuration-error" : "sdk-error");
          showError(message);
        });
        return function () { stopped = true; };
      }, [retry]);
      var resumeToken = props.resumePayment && props.resumePayment.payment_token;
      var resumeOrder = props.resumePayment && props.resumePayment.order_id;
      React.useEffect(function () {
        var incoming = DEMO_SANDBOX ? null : opaquePair(latest.current.resumePayment);
        if (incoming && !op.done && !op.create && !op.capture && !op.status &&
          (!op.pair || op.pair.payment_token !== incoming.payment_token)) {
          op.pair = incoming; op.blocked = true; op.recovered = false; savePair(incoming);
        }
        if (config && op.pair && !op.done && (!op.recovered || recoveryRetry > 0)) checkStatus(config);
      }, [config, resumeToken, resumeOrder, recoveryRetry]);
      React.useEffect(function () {
        if (!sdk || !config || !nameHost.current || !numberHost.current || !expiryHost.current || !securityHost.current) return;
        var stopped = false, instance = null, fields = [];
        setFunding({ card: null });
        try {
          instance = sdk.CardFields({
            createOrder: createOrder, onApprove: approve, onCancel: paymentFailed, onError: paymentFailed,
            style: { input: { "font-size": "16px", "font-family": "Arial, sans-serif", color: "#113A3A", padding: "12px", border: "0", "box-shadow": "none" },
              ":focus": { color: "#113A3A" }, ".invalid": { color: "#a52c35" } }
          });
          if (!instance.isEligible()) { setFunding({ card: false }); return; }
          cardFields.current = instance;
          var name = instance.NameField({ placeholder: "Cardholder name" });
          var number = instance.NumberField({ placeholder: "Card number" });
          var expiry = instance.ExpiryField({ placeholder: "MM / YY" });
          var security = instance.CVVField({ placeholder: "Security code" });
          fields = [name, number, expiry, security];
          Promise.all([name.render(nameHost.current), number.render(numberHost.current), expiry.render(expiryHost.current), security.render(securityHost.current)])
            .then(function () { if (!stopped) setFunding({ card: true }); })
            .catch(function () { if (!stopped) { setLoading("fields-error"); showError(SDK_ERROR); } });
        } catch (_) { if (!stopped) { setLoading("fields-error"); showError(SDK_ERROR); } }
        return function () {
          stopped = true;
          if (cardFields.current === instance) cardFields.current = null;
          fields.forEach(function (field) { try { if (typeof field.close === "function") Promise.resolve(field.close()).catch(function () {}); } catch (_) {} });
          try { if (instance && typeof instance.close === "function") Promise.resolve(instance.close()).catch(function () {}); } catch (_) {}
        };
      }, [sdk, config, retry]);
      React.useEffect(function () { updateActions(); }, [props.valid, props.busy, processing, recovering, confirmed, funding]);

      function submitCard() {
        if (cardSubmission.current) return cardSubmission.current;
        if (latest.current.busy === true || op.open || op.create || op.capture || op.status || op.blocked || op.done) return Promise.resolve();
        if (!validate() || !eligibleNow() || latest.current.valid !== true || !cardFields.current || funding.card !== true) return Promise.resolve();
        var instance = cardFields.current;
        // Set a promise synchronously so rapid taps cannot begin a second card submission.
        cardSubmission.current = Promise.resolve().then(async function () {
          showError("");
          await freshConfiguration(config);
          if (config.environment === "live") {
            var previewInput = await latest.current.getInput();
            if (previewInput && previewInput.demo_mode === true) {
              showError("Demo intakes require Sandbox payment settings. No live payment was started."); return;
            }
          }
          var state = await instance.getState();
          if (!state || state.isFormValid !== true) { showError("Please complete your card details."); return; }
          if (!eligibleNow() || !validate() || latest.current.valid !== true) return;
          payBusy(true); showError("");
          await instance.submit();
        }).catch(function (failure) { paymentFailed(failure); }).finally(function () {
          cardSubmission.current = null;
          if (!op.open && !op.create && !op.capture) payBusy(false);
        });
        return cardSubmission.current;
      }
      function field(ref, label, extra) {
        return JSX.jsxs("div", { className: "mmd-text-card-field" + (extra ? " " + extra : ""), "data-hj-suppress": "true", "data-cs-mask": "true", children: [
          JSX.jsx("span", { className: "mmd-text-card-label", children: label }),
          JSX.jsx("div", { ref: ref, className: "mmd-text-card-host", "aria-label": label })
        ] });
      }
      var unavailable = loading === "ready" && funding.card === false;
      var busy = processing || props.busy === true;
      return JSX.jsxs("section", { ref: root, className: "mmd-text-payment full" + (busy || recovering || confirmed ? " is-blocked" : ""), "data-hj-suppress": "true", "data-cs-mask": "true", "aria-label": "Credit card payment", "aria-busy": busy || loading === "loading", children: [
        JSX.jsxs("h2", { className: "mmd-text-payment-heading", children: [JSX.jsx("svg", { width: 17, height: 19, viewBox: "0 0 20 22", fill: "none", stroke: "currentColor", strokeWidth: 1.6, "aria-hidden": "true", children: JSX.jsxs("g", { children: [JSX.jsx("rect", { x: 3, y: 9, width: 14, height: 11, rx: 3 }), JSX.jsx("path", { d: "M6 9V6a4 4 0 0 1 8 0v3M10 13v3" })] }) }), "Credit card payment – $29 today"] }),
        config && config.environment === "sandbox" && JSX.jsx("p", { className: "mmd-text-payment-sandbox", role: "status", children: "Sandbox test payment — no real charge." }),
        loading === "loading" && JSX.jsx("p", { className: "mmd-text-payment-status", role: "status", children: "Loading secure payment options…" }),
        JSX.jsxs("div", { className: "mmd-text-payment-options", hidden: loading !== "ready" || confirmed || unavailable, children: [
          field(nameHost, "Cardholder name", "mmd-text-card-name"),
          field(numberHost, "Card number", "mmd-text-card-number"),
          JSX.jsxs("div", { className: "mmd-text-card-row", children: [field(expiryHost, "Expiration date"), field(securityHost, "Security code")] }),
          JSX.jsx("button", { type: "button", className: "mmd-text-payment-pay", disabled: funding.card !== true || busy || recovering || confirmed,
            "aria-disabled": props.valid !== true || undefined, onClick: submitCard, children: busy ? "Processing payment…" : "Pay $29 securely →" }),
          JSX.jsx("p", { className: "mmd-text-card-provider", children: "Secure card processing by PayPal." })
        ] }),
        unavailable && JSX.jsx("p", { className: "mmd-text-payment-availability", role: "alert", children: "Credit card payment is not enabled for this account or browser. Please contact the Care Team at (888) 362-7011." }),
        loading === "ready" && props.valid !== true && !recovering && !confirmed && JSX.jsx("p", { className: "mmd-text-payment-hint", children: "Complete all required fields, SMS permission and consents above to pay." }),
        (busy || recovering || confirmed) && JSX.jsx("p", { className: "mmd-text-payment-status", role: "status", "aria-live": "polite", children: confirmed ? "Payment confirmed. Opening your confirmation…" : busy ? "Processing your payment…" : "Checking your payment status…" }),
        error && JSX.jsx("p", { className: "mmd-text-payment-error", role: "alert", children: error }),
        (loading === "sdk-error" || loading === "fields-error" || loading === "configuration-error") && !op.done && JSX.jsx("button", { type: "button", className: "mmd-text-payment-retry", disabled: busy, onClick: function () { setSdk(null); setRetry(function (value) { return value + 1; }); }, children: "Retry loading payment options" }),
        recovering && error && config && !op.done && JSX.jsx("button", { type: "button", className: "mmd-text-payment-retry", disabled: busy || !!op.status, onClick: function () { setRecoveryRetry(function (value) { return value + 1; }); }, children: "Check payment status again" }),
        JSX.jsx("p", { className: "mmd-text-payment-fine-print", children: "Charged once. Full refund if Dr. Al-Deek determines you're not a candidate. Medication costs are separate." })
      ] });
    };
  };
})();
