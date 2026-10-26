const CHECKOUT_KEY = "mmd_video_visit_checkout";
const VIDEO_VISIT_AMOUNT = "39.00";

/**
 * Mount the optional video-visit checkout into one React-owned root.
 *
 * The caller must supply the intake receipt already held by the thank-you page.
 * This module never reads or writes a receipt, renders a local completion state,
 * exposes globals, or changes the current URL.
 */
export function initializeThankYouVideoCheckout(root, receipt, onConfirmed) {
  "use strict";

  if (!root || typeof root.querySelector !== "function") {
    throw new TypeError("A checkout root element is required.");
  }

  const demoParams = new URLSearchParams(window.location.search);
  // Sandbox is selected only by the one exact thank-you URL requested for demos.
  const DEMO_MODE = demoParams.getAll("prefill").length === 1 && demoParams.get("prefill") === "demo";
  const state = {
    receipt: null,
    config: null,
    cardSession: null,
    apple: null,
    nativeAppleSession: null,
    initializing: false,
    disposed: false,
    confirmed: false,
    controllers: new Set(),
    cancelWaits: new Set(),
    listeners: [],
    boundElements: new WeakSet(),
  };

  function mounted() {
    return !state.disposed;
  }

  // Every checkout UI lookup is constrained to the React-owned checkout root.
  function byId(id) {
    return mounted() ? root.querySelector(`#${id}`) : null;
  }

  function isOwned(node) {
    return mounted() && Boolean(node) && root.contains(node);
  }

  function listen(target, type, handler, options) {
    if (!isOwned(target) || state.boundElements.has(target)) return;
    target.addEventListener(type, handler, options);
    state.boundElements.add(target);
    state.listeners.push(() => target.removeEventListener(type, handler, options));
  }

  function safeJson(value) {
    try {
      return JSON.parse(value);
    } catch (_) {
      return null;
    }
  }

  function parseReceipt(value) {
    const parsed = typeof value === "string" ? safeJson(value) : value;
    if (!parsed || typeof parsed !== "object") return null;
    const allowedKeys = ["submission_id", "submission_token", "sms_opt_in", "video_visit_interest", "is_test", "payment_status"];
    if (Object.keys(parsed).length !== allowedKeys.length || Object.keys(parsed).some((key) => !allowedKeys.includes(key))) return null;
    if (typeof parsed.submission_id !== "string" || !parsed.submission_id) return null;
    if (typeof parsed.submission_token !== "string" || !parsed.submission_token) return null;
    if (typeof parsed.sms_opt_in !== "boolean" || typeof parsed.is_test !== "boolean") return null;
    if (parsed.payment_status !== "NOT_REQUIRED") return null;
    return {
      submission_id: parsed.submission_id,
      submission_token: parsed.submission_token,
      sms_opt_in: parsed.sms_opt_in,
      video_visit_interest: parsed.video_visit_interest === true,
      is_test: parsed.is_test,
      payment_status: "NOT_REQUIRED",
    };
  }

  function savePendingOrder(order) {
    // Only non-clinical, minimal order metadata is retained for a refresh recovery check.
    const minimal = {
      order_id: String(order.order_id),
      payment_method: order.payment_method === "apple_pay" ? "apple_pay" : "card",
      state: "pending",
    };
    try {
      window.sessionStorage.setItem(CHECKOUT_KEY, JSON.stringify(minimal));
    } catch (_) {
      // Server-side status recovery remains available while this page is open.
    }
  }

  function clearPendingOrder() {
    try {
      window.sessionStorage.removeItem(CHECKOUT_KEY);
    } catch (_) {
      // A confirmed payment must not become a client failure because storage is blocked.
    }
  }

  function setStatus(message, kind) {
    const target = byId("checkout-status");
    if (!target) return;
    target.textContent = message || "";
    target.dataset.kind = kind || "";
  }

  function setError(message) {
    const target = byId("checkout-error");
    if (!target) return;
    target.textContent = message ? `${message} Your free intake remains complete.` : "";
  }

  function setBusy(button, busy, busyLabel) {
    if (!isOwned(button)) return;
    if (!button.dataset.defaultLabel) button.dataset.defaultLabel = button.textContent;
    button.disabled = busy;
    button.textContent = busy ? busyLabel : button.dataset.defaultLabel;
  }

  function closedError() {
    return new Error("Checkout has been closed.");
  }

  async function requestJson(url, options, fallback) {
    if (!mounted()) throw closedError();
    const controller = new AbortController();
    state.controllers.add(controller);
    const timer = window.setTimeout(() => controller.abort(), 20000);
    try {
      const response = await window.fetch(url, {
        ...(options || {}),
        headers: { Accept: "application/json", ...((options && options.headers) || {}) },
        signal: controller.signal,
      });
      let body = {};
      try {
        body = await response.json();
      } catch (_) {
        body = {};
      }
      if (!response.ok) throw new Error(body.error || fallback || "Unable to complete this request. Please try again.");
      if (!mounted()) throw closedError();
      return body;
    } catch (error) {
      if (error && error.name === "AbortError") throw new Error("The request timed out. Please try again.");
      throw error instanceof Error ? error : new Error(fallback || "Unable to complete this request. Please try again.");
    } finally {
      state.controllers.delete(controller);
      window.clearTimeout(timer);
    }
  }

  function demoMode(_receipt) {
    // An is_test receipt is not enough to change a future checkout environment.
    // Sandbox is selected only by the one exact thank-you URL requested for demos.
    return DEMO_MODE;
  }

  function demoSuffix(receiptForDemo) {
    return demoMode(receiptForDemo) ? "?prefill=demo" : "";
  }

  /**
   * The server confirmation is the only completion signal. The supplied receipt
   * submission ID must match before React is allowed to recheck server status.
   */
  function finishConfirmedVideoVisit(kind, confirmation) {
    if (!mounted() || state.confirmed || !state.receipt || !confirmation) return false;
    if (confirmation.submission_id !== state.receipt.submission_id) return false;
    const paid = kind === "paid" && confirmation.payment_status === "COMPLETED";
    const waived = kind === "waived" && confirmation.payment_status === "WAIVED";
    if (!paid && !waived) return false;

    state.confirmed = true;
    if (mounted() && typeof onConfirmed === "function") {
      try {
        const callbackResult = onConfirmed();
        // The public callback type is void, but avoid a rejected user callback
        // becoming an unhandled rejection if an async callback is supplied.
        if (callbackResult && typeof callbackResult.catch === "function") callbackResult.catch(() => {});
      } catch (_) {
        // Payment has already been confirmed by the server. React owns its retry UI.
      }
    }
    return true;
  }

  async function getPayPalConfig(receiptForConfig) {
    const config = await requestJson(`/api/paypal/client-token${demoSuffix(receiptForConfig)}`, null, "PayPal checkout is temporarily unavailable. Please try again.");
    if (!config.client_id || !config.environment) throw new Error("PayPal checkout is temporarily unavailable. Please try again.");
    if (demoMode(receiptForConfig) && config.environment !== "sandbox") {
      throw new Error("Demo checkout requires the PayPal Sandbox environment.");
    }
    return config;
  }

  async function createVideoOrder(receiptForOrder, paymentMethod) {
    const order = await requestJson(`/api/paypal/orders${demoSuffix(receiptForOrder)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submission_token: receiptForOrder.submission_token,
        payment_method: paymentMethod === "apple_pay" ? "apple_pay" : "card",
        demo_mode: demoMode(receiptForOrder),
      }),
    }, "Unable to start the optional video-visit checkout. Please try again.");
    if (!order.order_id || !order.approval_token) throw new Error("Unable to start the optional video-visit checkout. Please try again.");
    savePendingOrder({ order_id: order.order_id, payment_method: paymentMethod });
    return order;
  }

  async function captureVideoOrder(orderId, approvalToken) {
    const captured = await requestJson(`/api/paypal/orders/${encodeURIComponent(orderId)}/capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approval_token: approvalToken }),
    }, "Unable to confirm your video-visit payment. Please try again.");
    if (captured.payment_status !== "COMPLETED") {
      throw new Error("Your video-visit payment has not been confirmed. Please try again.");
    }
    clearPendingOrder();
    return captured;
  }

  async function validateCoupon(couponCode) {
    const result = await requestJson("/api/intake/coupon/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coupon_code: couponCode }),
    }, "Unable to validate that coupon. Please try again.");
    if (result.valid !== true || result.status !== "waived") throw new Error("That coupon code cannot be used for the optional video visit.");
    return result;
  }

  async function submitCoupon(receiptForCoupon, couponCode) {
    const result = await requestJson("/api/intake/coupon/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submission_token: receiptForCoupon.submission_token, coupon_code: couponCode }),
    }, "Unable to apply that coupon. Please try again.");
    if (result.payment_status !== "WAIVED" && result.status !== "waived") {
      throw new Error("The video-visit coupon was not confirmed. Please try again.");
    }
    clearPendingOrder();
    return result;
  }

  function normalizeVideoStatus(result) {
    const value = String(result && (result.status || result.video_visit_status || result.payment_status) || "").toLowerCase();
    if (value === "paid" || value === "completed") return "paid";
    if (value === "waived") return "waived";
    if (value === "pending") return "pending";
    return "available";
  }

  async function recoverVideoStatus(receiptForRecovery) {
    try {
      const result = await requestJson("/api/intake/video/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submission_token: receiptForRecovery.submission_token }),
      }, "");
      if (!mounted()) return;
      const status = normalizeVideoStatus(result);
      if (status === "paid" && finishConfirmedVideoVisit("paid", result.completion)) return;
      if (status === "waived" && finishConfirmedVideoVisit("waived", result.completion)) return;
      if (status === "pending" && result.order && typeof result.order.order_id === "string" && typeof result.order.approval_token === "string") {
        const pending = byId("video-payment-pending");
        const button = byId("recover-video-payment");
        const statusCopy = byId("video-recovery-status");
        if (pending) pending.hidden = false;
        if (button) {
          listen(button, "click", async () => {
            if (!mounted()) return;
            setBusy(button, true, "Checking existing payment…");
            try {
              const captured = await captureVideoOrder(result.order.order_id, result.order.approval_token);
              if (!finishConfirmedVideoVisit("paid", captured)) throw new Error("Your video-visit payment has not been confirmed. Please try again.");
            } catch (_) {
              if (mounted() && isOwned(statusCopy)) {
                statusCopy.textContent = "The existing video payment is not yet confirmed. You may resume the same secure checkout below, or contact the Care Team if you were charged. Your free intake is complete; do not start a second payment.";
              }
            } finally {
              setBusy(button, false, "Checking existing payment…");
            }
          });
        }
      }
    } catch (_) {
      // Status recovery is optional and must never disrupt the free intake confirmation.
    }
  }

  function waitForScript(script, fallback) {
    return new Promise((resolve, reject) => {
      let settled = false;
      const cleanup = () => {
        script.removeEventListener("load", loaded);
        script.removeEventListener("error", failed);
        state.cancelWaits.delete(cancel);
      };
      const loaded = () => {
        if (settled) return;
        settled = true;
        cleanup();
        mounted() ? resolve() : reject(closedError());
      };
      const failed = () => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(new Error(fallback));
      };
      const cancel = () => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(closedError());
      };
      state.cancelWaits.add(cancel);
      script.addEventListener("load", loaded, { once: true });
      script.addEventListener("error", failed, { once: true });
    });
  }

  function loadPayPalSdk(environment) {
    if (window.paypal) return Promise.resolve();
    const id = `paypal-web-sdk-v6-${environment}`;
    const existing = document.getElementById(id);
    if (existing) return waitForScript(existing, "PayPal checkout could not load.");
    const script = document.createElement("script");
    script.id = id;
    // This is the same PayPal Web SDK v6 source selection used by the intake checkout.
    script.src = environment === "sandbox" ? "https://www.sandbox.paypal.com/web-sdk/v6/core" : "https://www.paypal.com/web-sdk/v6/core";
    script.async = true;
    const waiting = waitForScript(script, "PayPal checkout could not load.");
    document.head.appendChild(script);
    return waiting;
  }

  function loadApplePaySdk() {
    const ready = () => Boolean(window.customElements && window.customElements.get("apple-pay-button"));
    if (ready()) return Promise.resolve();
    const existing = document.querySelector("script[data-mmd-apple-pay-sdk]");
    if (existing) return waitForScript(existing, "Apple Pay could not load.").then(() => {
      if (!ready()) throw new Error("Apple Pay button could not initialize.");
    });
    const script = document.createElement("script");
    script.src = "https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js";
    script.crossOrigin = "anonymous";
    script.async = true;
    script.dataset.mmdApplePaySdk = "true";
    const waiting = waitForScript(script, "Apple Pay could not load.").then(() => {
      if (!ready()) throw new Error("Apple Pay button could not initialize.");
    });
    document.head.appendChild(script);
    return waiting;
  }

  function clearFieldContainers() {
    ["video-card-name", "video-card-number", "video-card-expiry", "video-card-cvv"].forEach((id) => {
      const field = byId(id);
      if (field) field.innerHTML = "";
    });
  }

  async function setupCardFields(receiptForCard, config) {
    const fields = byId("checkout-card-fields");
    const payButton = byId("pay-video-card");
    const inputs = fields && fields.querySelector(".paypal-inputs");
    if (!fields || !payButton || !inputs || !window.paypal || !mounted()) return;
    fields.hidden = false;
    inputs.setAttribute("aria-busy", "true");
    clearFieldContainers();
    const instance = await window.paypal.createInstance({
      clientId: config.client_id,
      components: ["card-fields"],
      pageType: "checkout",
    });
    if (!mounted()) return;
    const methods = await instance.findEligibleMethods({ currencyCode: "USD" });
    if (!mounted()) return;
    if (!methods.isEligible("advanced_cards")) {
      fields.hidden = true;
      setStatus("Inline card checkout is not available for this PayPal account. Apple Pay may still be available.", "");
      return;
    }
    const secureFields = instance.createCardFieldsOneTimePaymentSession();
    const style = {
      input: { color: "#1f2937", background: "#ffffff", fontSize: "16px", lineHeight: "20px", fontFamily: "Montserrat, Arial, sans-serif", fontWeight: "500" },
      ".invalid": { color: "#b42318" },
    };
    const component = (type, placeholder) => secureFields.createCardFieldsComponent({ type, placeholder, style });
    const name = byId("video-card-name");
    const number = byId("video-card-number");
    const expiry = byId("video-card-expiry");
    const cvv = byId("video-card-cvv");
    if (!name || !number || !expiry || !cvv || !mounted()) return;
    name.appendChild(component("name", "Cardholder name"));
    number.appendChild(component("number", "Card number"));
    expiry.appendChild(component("expiry", "MM/YY"));
    cvv.appendChild(component("cvv", "CVV"));
    state.cardSession = secureFields;
    inputs.setAttribute("aria-busy", "false");
    payButton.disabled = false;
    listen(payButton, "click", async () => {
      if (!mounted() || !state.cardSession || payButton.disabled) return;
      setError("");
      setBusy(payButton, true, "Processing…");
      try {
        const created = await createVideoOrder(receiptForCard, "card");
        if (!mounted() || !state.cardSession) return;
        const authorized = await state.cardSession.submit(created.order_id);
        if (!mounted()) return;
        if (authorized.state !== "succeeded") {
          throw new Error((authorized.data && authorized.data.message) || "PayPal could not authorize this card. Please check the details and try again.");
        }
        const captured = await captureVideoOrder(created.order_id, created.approval_token);
        if (!finishConfirmedVideoVisit("paid", captured)) throw new Error("Your video-visit payment has not been confirmed. Please try again.");
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unable to complete the optional video-visit payment. Please try again.");
      } finally {
        setBusy(payButton, false, "Processing…");
      }
    });
  }

  async function setupApplePay(receiptForApplePay, config) {
    const container = byId("video-apple-pay");
    if (!container || !window.isSecureContext || !mounted()) return;
    try {
      await loadApplePaySdk();
      if (!mounted() || !window.ApplePaySession || !window.ApplePaySession.canMakePayments()) return;
      const instance = await window.paypal.createInstance({
        clientId: config.client_id,
        components: ["applepay-payments"],
        pageType: "checkout",
      });
      if (!mounted()) return;
      const methods = await instance.findEligibleMethods({ currencyCode: "USD" });
      if (!mounted() || !methods.isEligible("applepay")) return;
      state.apple = { session: instance.createApplePayOneTimePaymentSession(), details: methods.getDetails("applepay") };
      container.innerHTML = "<p class=\"apple-pay-divider\">or pay with</p><apple-pay-button id=\"video-apple-pay-button\" type=\"buy\" buttonstyle=\"black\" locale=\"en-US\" aria-label=\"Pay $39 with Apple Pay\"></apple-pay-button>";
      container.hidden = false;
      const appleButton = byId("video-apple-pay-button");
      if (appleButton) listen(appleButton, "click", () => {
        void startApplePay(receiptForApplePay, appleButton);
      });
    } catch (_) {
      // Apple Pay is shown only when the browser, Apple, and PayPal determine it is eligible.
    }
  }

  async function startApplePay(receiptForApplePay, button) {
    if (!mounted() || !state.apple || button.disabled) return;
    setError("");
    setBusy(button, true, "Processing…");
    try {
      const paypalAppleSession = state.apple.session;
      const request = {
        ...paypalAppleSession.formatConfigForPaymentRequest(state.apple.details.config),
        countryCode: "US",
        currencyCode: "USD",
        requiredBillingContactFields: ["name", "phone", "email", "postalAddress"],
        requiredShippingContactFields: [],
        total: { label: "MedMethod Direct", amount: VIDEO_VISIT_AMOUNT, type: "final" },
      };
      const nativeSession = new window.ApplePaySession(4, request);
      state.nativeAppleSession = nativeSession;
      nativeSession.onvalidatemerchant = (event) => {
        if (!mounted()) {
          try { nativeSession.abort(); } catch (_) {}
          return;
        }
        paypalAppleSession.validateMerchant({ validationUrl: event.validationURL })
          .then((payload) => {
            if (mounted()) nativeSession.completeMerchantValidation(payload.merchantSession);
          })
          .catch(() => {
            setError("Apple Pay merchant validation could not be completed. Please use a card instead.");
            try { nativeSession.abort(); } catch (_) {}
            setBusy(button, false, "Processing…");
          });
      };
      nativeSession.onpaymentmethodselected = () => {
        if (mounted()) nativeSession.completePaymentMethodSelection({ newTotal: request.total });
      };
      nativeSession.onpaymentauthorized = async (event) => {
        try {
          if (!mounted()) return;
          const created = await createVideoOrder(receiptForApplePay, "apple_pay");
          if (!mounted()) return;
          await paypalAppleSession.confirmOrder({
            orderId: created.order_id,
            token: event.payment.token,
            billingContact: event.payment.billingContact,
          });
          if (!mounted()) return;
          const captured = await captureVideoOrder(created.order_id, created.approval_token);
          if (!finishConfirmedVideoVisit("paid", captured)) throw new Error("Your video-visit payment has not been confirmed. Please try again.");
          if (mounted()) nativeSession.completePayment({ status: window.ApplePaySession.STATUS_SUCCESS });
        } catch (error) {
          setError(error instanceof Error ? error.message : "Apple Pay could not complete the optional video-visit payment. Please try again.");
          if (mounted()) {
            nativeSession.completePayment({ status: window.ApplePaySession.STATUS_FAILURE });
            setBusy(button, false, "Processing…");
          }
        }
      };
      nativeSession.oncancel = () => setBusy(button, false, "Processing…");
      nativeSession.begin();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Apple Pay could not start. Please use a card instead.");
      setBusy(button, false, "Processing…");
    }
  }

  async function initializeCheckout() {
    if (!mounted() || !state.receipt || state.initializing) return;
    state.initializing = true;
    setError("");
    setStatus("Preparing optional secure checkout…", "");
    try {
      state.config = await getPayPalConfig(state.receipt);
      if (!mounted()) return;
      await loadPayPalSdk(state.config.environment);
      if (!mounted()) return;
      if (!window.paypal) throw new Error("PayPal checkout could not initialize. Please try again.");
      await Promise.all([setupCardFields(state.receipt, state.config), setupApplePay(state.receipt, state.config)]);
      setStatus("", "");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to prepare the optional video-visit checkout. Please try again.");
    } finally {
      state.initializing = false;
    }
  }

  function openCheckout() {
    const checkout = byId("video-checkout");
    if (!checkout) return;
    checkout.hidden = false;
    checkout.scrollIntoView({ behavior: "smooth", block: "start" });
    void initializeCheckout();
  }

  function setupCoupon(receiptForCoupon) {
    const input = byId("video-coupon-code");
    const validateButton = byId("validate-video-coupon");
    const confirmed = byId("coupon-confirmed");
    const submitButton = byId("submit-video-coupon");
    const paymentArea = byId("checkout-payment-area");
    let couponCode = "";
    if (!input || !validateButton || !confirmed || !submitButton || !paymentArea) return;
    listen(validateButton, "click", async () => {
      if (!mounted()) return;
      const candidate = input.value.trim();
      if (!candidate) return;
      setError("");
      setBusy(validateButton, true, "Applying…");
      try {
        await validateCoupon(candidate);
        if (!mounted()) return;
        couponCode = candidate;
        confirmed.hidden = false;
        paymentArea.hidden = true;
        state.cardSession = null;
        setStatus("Coupon ready to waive the optional video visit.", "success");
      } catch (error) {
        if (!mounted()) return;
        couponCode = "";
        confirmed.hidden = true;
        paymentArea.hidden = false;
        setError(error instanceof Error ? error.message : "Unable to validate that coupon. Please try again.");
        if (!state.cardSession) void initializeCheckout();
      } finally {
        setBusy(validateButton, false, "Applying…");
      }
    });
    listen(submitButton, "click", async () => {
      if (!mounted() || !couponCode) return;
      setError("");
      setBusy(submitButton, true, "Confirming…");
      try {
        const waiver = await submitCoupon(receiptForCoupon, couponCode);
        if (!finishConfirmedVideoVisit("waived", waiver)) throw new Error("The video-visit referral code was not confirmed. Please try again.");
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unable to confirm the video-visit coupon. Please try again.");
      } finally {
        setBusy(submitButton, false, "Confirming…");
      }
    });
  }

  function dispose() {
    if (state.disposed) return;
    state.disposed = true;
    for (const removeListener of state.listeners.splice(0)) {
      try { removeListener(); } catch (_) {}
    }
    for (const controller of state.controllers) controller.abort();
    state.controllers.clear();
    for (const cancelWait of state.cancelWaits) cancelWait();
    state.cancelWaits.clear();
    if (state.nativeAppleSession) {
      try { state.nativeAppleSession.abort(); } catch (_) {}
      state.nativeAppleSession = null;
    }
  }

  if (!parseReceipt(receipt)) {
    setError("We could not verify your intake receipt.");
    return dispose;
  }
  state.receipt = receipt;

  // The enclosing React component supplies the valid receipt and all page-level UI.
  // These setup calls deliberately run once at initialization; no DOM-ready hook exists.
  const openButton = byId("open-video-checkout");
  if (openButton) listen(openButton, "click", openCheckout);
  setupCoupon(state.receipt);
  void recoverVideoStatus(state.receipt);
  void initializeCheckout();

  return dispose;
}
