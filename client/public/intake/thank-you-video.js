(function (window, document) {
  "use strict";

  const RECEIPT_KEY = "mmd_free_intake_receipt";
  const CHECKOUT_KEY = "mmd_video_visit_checkout";
  const VIDEO_VISIT_AMOUNT = "39.00";
  const CARE_EMAIL = "info@medmethoddirect.com";
  const CARE_PHONE = "888-362-7011";
  const DEMO_MODE = false; // New route mode and offer are receipt-owned, never selected by the URL.
  let state = { receipt: null, config: null, cardSession: null, apple: null, initializing: false };

  function byId(id) {
    return document.getElementById(id);
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

  function readReceipt() {
    try {
      return parseReceipt(window.sessionStorage.getItem(RECEIPT_KEY));
    } catch (_) {
      return null;
    }
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
    if (!button) return;
    if (!button.dataset.defaultLabel) button.dataset.defaultLabel = button.textContent;
    button.disabled = busy;
    button.textContent = busy ? busyLabel : button.dataset.defaultLabel;
  }

  async function requestJson(url, options, fallback) {
    const controller = new AbortController();
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
      return body;
    } catch (error) {
      if (error && error.name === "AbortError") throw new Error("The request timed out. Please try again.");
      throw error instanceof Error ? error : new Error(fallback || "Unable to complete this request. Please try again.");
    } finally {
      window.clearTimeout(timer);
    }
  }

  function demoMode(receipt) {
    return receipt.is_test === true;
  }

  function demoSuffix(receipt) {
    return demoMode(receipt) ? "?prefill=demo" : "";
  }

  async function getPayPalConfig(receipt) {
    const config = await requestJson(`/api/paypal/client-token${demoSuffix(receipt)}`, null, "PayPal checkout is temporarily unavailable. Please try again.");
    if (!config.client_id || !config.environment) throw new Error("PayPal checkout is temporarily unavailable. Please try again.");
    if (demoMode(receipt) && config.environment !== "sandbox") {
      throw new Error("Demo checkout requires the PayPal Sandbox environment.");
    }
    return config;
  }

  async function createVideoOrder(receipt, paymentMethod) {
    const order = await requestJson(`/api/paypal/orders${demoSuffix(receipt)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submission_token: receipt.submission_token,
        payment_method: paymentMethod === "apple_pay" ? "apple_pay" : "card",
        demo_mode: receipt.is_test,
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

  async function submitCoupon(receipt, couponCode) {
    const result = await requestJson("/api/intake/coupon/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submission_token: receipt.submission_token, coupon_code: couponCode }),
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

  async function recoverVideoStatus(receipt) {
    try {
      const result = await requestJson("/api/intake/video/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submission_token: receipt.submission_token }),
      }, "");
      const status = normalizeVideoStatus(result);
      if (status === "paid") showComplete("paid");
      if (status === "waived") showComplete("waived");
      if (status === "pending" && result.order && typeof result.order.order_id === "string" && typeof result.order.approval_token === "string") {
        const pending = byId("video-payment-pending");
        const button = byId("recover-video-payment");
        const statusCopy = byId("video-recovery-status");
        if (pending) pending.hidden = false;
        if (button) button.onclick = async () => {
          setBusy(button, true, "Checking existing payment…");
          try {
            await captureVideoOrder(result.order.order_id, result.order.approval_token);
            showComplete("paid");
          } catch (_) {
            if (statusCopy) statusCopy.textContent = "The existing video payment is not yet confirmed. You may resume the same secure checkout below, or contact the Care Team if you were charged. Your free intake is complete; do not start a second payment.";
          } finally {
            setBusy(button, false, "Checking existing payment…");
          }
        };
      }
      return true;
    } catch (_) {
      setStatus("Your completed-intake receipt could not be verified. Your free intake remains complete. Please contact the Care Team before making a payment.", "");
      return false;
    }
  }

  function loadPayPalSdk(environment) {
    if (window.paypal) return Promise.resolve();
    const id = `paypal-web-sdk-v6-${environment}`;
    const existing = document.getElementById(id);
    if (existing) {
      return new Promise((resolve, reject) => {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", () => reject(new Error("PayPal checkout could not load.")), { once: true });
      });
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.id = id;
      // This is the same PayPal Web SDK v6 source selection used by the intake checkout.
      script.src = environment === "sandbox" ? "https://www.sandbox.paypal.com/web-sdk/v6/core" : "https://www.paypal.com/web-sdk/v6/core";
      script.async = true;
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", () => reject(new Error("PayPal checkout could not load.")), { once: true });
      document.head.appendChild(script);
    });
  }

  function loadApplePaySdk() {
    return new Promise((resolve, reject) => {
      const ready = () => Boolean(window.customElements && window.customElements.get("apple-pay-button"));
      if (ready()) return resolve();
      const existing = document.querySelector("script[data-mmd-apple-pay-sdk]");
      const finished = () => ready() ? resolve() : reject(new Error("Apple Pay button could not initialize."));
      if (existing) {
        existing.addEventListener("load", finished, { once: true });
        existing.addEventListener("error", () => reject(new Error("Apple Pay could not load.")), { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = "https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js";
      script.crossOrigin = "anonymous";
      script.async = true;
      script.dataset.mmdApplePaySdk = "true";
      script.addEventListener("load", finished, { once: true });
      script.addEventListener("error", () => reject(new Error("Apple Pay could not load.")), { once: true });
      document.head.appendChild(script);
    });
  }

  function clearFieldContainers() {
    ["video-card-name", "video-card-number", "video-card-expiry", "video-card-cvv"].forEach((id) => {
      const field = byId(id);
      if (field) field.innerHTML = "";
    });
  }

  async function setupCardFields(receipt, config) {
    const fields = byId("checkout-card-fields");
    const payButton = byId("pay-video-card");
    const inputs = fields && fields.querySelector(".tyv-paypal-inputs");
    if (!fields || !payButton || !inputs || !window.paypal) return;
    fields.hidden = false;
    inputs.setAttribute("aria-busy", "true");
    clearFieldContainers();
    const instance = await window.paypal.createInstance({
      clientId: config.client_id,
      components: ["card-fields"],
      pageType: "checkout",
    });
    const methods = await instance.findEligibleMethods({ currencyCode: "USD" });
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
    byId("video-card-name").appendChild(component("name", "Cardholder name"));
    byId("video-card-number").appendChild(component("number", "Card number"));
    byId("video-card-expiry").appendChild(component("expiry", "MM/YY"));
    byId("video-card-cvv").appendChild(component("cvv", "CVV"));
    state.cardSession = secureFields;
    inputs.setAttribute("aria-busy", "false");
    payButton.disabled = false;
    payButton.onclick = async () => {
      if (!state.cardSession || payButton.disabled) return;
      setError("");
      setBusy(payButton, true, "Processing…");
      try {
        const created = await createVideoOrder(receipt, "card");
        const authorized = await state.cardSession.submit(created.order_id);
        if (authorized.state !== "succeeded") {
          throw new Error((authorized.data && authorized.data.message) || "PayPal could not authorize this card. Please check the details and try again.");
        }
        await captureVideoOrder(created.order_id, created.approval_token);
        showComplete("paid");
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unable to complete the optional video-visit payment. Please try again.");
      } finally {
        setBusy(payButton, false, "Processing…");
      }
    };
  }

  async function setupApplePay(receipt, config) {
    const container = byId("video-apple-pay");
    if (!container || !window.isSecureContext) return;
    try {
      await loadApplePaySdk();
      if (!window.ApplePaySession || !window.ApplePaySession.canMakePayments()) return;
      const instance = await window.paypal.createInstance({
        clientId: config.client_id,
        components: ["applepay-payments"],
        pageType: "checkout",
      });
      const methods = await instance.findEligibleMethods({ currencyCode: "USD" });
      if (!methods.isEligible("applepay")) return;
      state.apple = { session: instance.createApplePayOneTimePaymentSession(), details: methods.getDetails("applepay") };
      container.innerHTML = "<p class=\"apple-pay-divider\">or pay with</p><apple-pay-button id=\"video-apple-pay-button\" type=\"buy\" buttonstyle=\"black\" locale=\"en-US\" aria-label=\"Pay $39 for your Zoom video visit with Apple Pay\"></apple-pay-button>";
      container.hidden = false;
      const appleButton = byId("video-apple-pay-button");
      appleButton.addEventListener("click", () => startApplePay(receipt, appleButton));
    } catch (_) {
      // Apple Pay is shown only when the browser, Apple, and PayPal determine it is eligible.
    }
  }

  async function startApplePay(receipt, button) {
    if (!state.apple || button.disabled) return;
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
      nativeSession.onvalidatemerchant = (event) => {
        paypalAppleSession.validateMerchant({ validationUrl: event.validationURL })
          .then((payload) => nativeSession.completeMerchantValidation(payload.merchantSession))
          .catch(() => {
            setError("Apple Pay merchant validation could not be completed. Please use a card instead.");
            nativeSession.abort();
            setBusy(button, false, "Processing…");
          });
      };
      nativeSession.onpaymentmethodselected = () => nativeSession.completePaymentMethodSelection({ newTotal: request.total });
      nativeSession.onpaymentauthorized = async (event) => {
        try {
          const created = await createVideoOrder(receipt, "apple_pay");
          await paypalAppleSession.confirmOrder({
            orderId: created.order_id,
            token: event.payment.token,
            billingContact: event.payment.billingContact,
          });
          await captureVideoOrder(created.order_id, created.approval_token);
          nativeSession.completePayment({ status: window.ApplePaySession.STATUS_SUCCESS });
          showComplete("paid");
        } catch (error) {
          setError(error instanceof Error ? error.message : "Apple Pay could not complete the optional video-visit payment. Please try again.");
          nativeSession.completePayment({ status: window.ApplePaySession.STATUS_FAILURE });
          setBusy(button, false, "Processing…");
        }
      };
      nativeSession.oncancel = () => setBusy(button, false, "Processing…");
      nativeSession.begin();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Apple Pay could not start. Please use a card instead.");
      setBusy(button, false, "Processing…");
    }
  }

  function unlockVideoCalendar() {
    const calendar = byId("video-calendar");
    if (!calendar || calendar.querySelector("iframe")) return;
    const source = calendar.dataset.src;
    if (source !== "https://link.sendmeapro.com/widget/booking/Ew0Y6y4FVcwaZeb9Y826") return;
    const frame = document.createElement("iframe");
    frame.src = source;
    frame.title = "Book your Zoom video visit — $39";
    frame.loading = "lazy";
    frame.className = "thank-you-video-calendar-frame";
    calendar.replaceChildren(frame);
  }

  function showComplete(kind) {
    // Called only after server status/capture/waiver confirmation, not from local storage or URL flags.
    unlockVideoCalendar();
    const pageTitle = byId("video-page-title");
    const pageCopy = byId("video-page-copy");
    if (pageTitle) pageTitle.textContent = "You're Booked!";
    if (pageCopy) pageCopy.textContent = kind === "waived"
      ? "Your Zoom video visit — $39 has been waived. Now pick a time below to meet with Dr. Al-Deek."
      : "Your Zoom video visit — $39 payment is confirmed. Now pick a time below to meet with Dr. Al-Deek.";
    const checkout = byId("video-checkout");
    const card = byId("video-visit-card");
    const complete = byId("video-visit-complete");
    const title = byId("video-complete-title");
    const copy = byId("video-complete-copy");
    if (checkout) checkout.hidden = true;
    if (card) card.hidden = true;
    const pending = byId("video-payment-pending");
    if (pending) pending.hidden = true;
    if (complete) complete.hidden = false;
    if (kind === "waived") {
      if (title) title.textContent = "Zoom video visit — $39 waived";
      if (copy) copy.innerHTML = `No charge was collected for your optional video visit. Choose your Zoom video visit time in the calendar below. Need help? Contact the Care Team at <a href="mailto:${CARE_EMAIL}">${CARE_EMAIL}</a> or <a href="tel:+18883627011">${CARE_PHONE}</a>.`;
    } else {
      if (title) title.textContent = "Zoom video visit — $39 paid";
      if (copy) copy.innerHTML = `Thank you. Choose your Zoom video visit time in the calendar below. Need help? Contact the Care Team at <a href="mailto:${CARE_EMAIL}">${CARE_EMAIL}</a> or <a href="tel:+18883627011">${CARE_PHONE}</a>.`;
    }
  }

  async function initializeCheckout() {
    if (!state.receipt || state.initializing) return;
    state.initializing = true;
    setError("");
    setStatus("Preparing optional secure checkout…", "");
    try {
      state.config = await getPayPalConfig(state.receipt);
      await loadPayPalSdk(state.config.environment);
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
    initializeCheckout();
  }

  function setupCoupon(receipt) {
    const input = byId("video-coupon-code");
    const validateButton = byId("validate-video-coupon");
    const confirmed = byId("coupon-confirmed");
    const submitButton = byId("submit-video-coupon");
    const paymentArea = byId("checkout-payment-area");
    let couponCode = "";
    if (!input || !validateButton || !confirmed || !submitButton || !paymentArea) return;
    input.disabled = false;
    validateButton.disabled = false;
    validateButton.addEventListener("click", async () => {
      const candidate = input.value.trim();
      if (!candidate) return;
      setError("");
      setBusy(validateButton, true, "Applying…");
      try {
        await validateCoupon(candidate);
        couponCode = candidate;
        confirmed.hidden = false;
        submitButton.disabled = false;
        paymentArea.hidden = true;
        state.cardSession = null;
        setStatus("Coupon ready to waive the optional video visit.", "success");
      } catch (error) {
        couponCode = "";
        confirmed.hidden = true;
        submitButton.disabled = true;
        paymentArea.hidden = false;
        setError(error instanceof Error ? error.message : "Unable to validate that coupon. Please try again.");
        if (!state.cardSession) initializeCheckout();
      } finally {
        setBusy(validateButton, false, "Applying…");
      }
    });
    submitButton.addEventListener("click", async () => {
      if (!couponCode) return;
      setError("");
      setBusy(submitButton, true, "Confirming…");
      try {
        await submitCoupon(receipt, couponCode);
        showComplete("waived");
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unable to confirm the video-visit coupon. Please try again.");
      } finally {
        setBusy(submitButton, false, "Confirming…");
      }
    });
  }

  function applySmsCopy(receipt) {
    if (receipt.sms_opt_in) return;
    const title = byId("care-message-title");
    const copy = byId("care-message-copy");
    if (title) title.textContent = "Use your secure Patient Portal";
    if (copy) copy.textContent = "Because you did not opt in to SMS, use your secure Patient Portal and welcome email for care updates and required forms.";
  }

  async function initializePage() {
    if (!byId("thank-you-video-root")) return;
    const receipt = readReceipt();
    const confirmed = byId("confirmed-intake");
    const anonymous = byId("no-intake");
    if (!receipt) {
      if (anonymous) anonymous.hidden = false;
      return;
    }
    state.receipt = receipt;
    if (confirmed) confirmed.hidden = false;
    if (receipt.is_test && byId("demo-banner")) byId("demo-banner").hidden = false;
    applySmsCopy(receipt);
    const validReceipt = await recoverVideoStatus(receipt);
    if (!byId("thank-you-video-root") || !validReceipt) return;
    if (!byId("video-calendar").querySelector("iframe")) {
      byId("video-page-title").textContent = "Your intake is complete!";
      byId("video-page-copy").textContent = "Your intake has been received. Follow the steps below to get started.";
    }
    const openButton = byId("open-video-checkout");
    if (openButton) { openButton.disabled = false; openButton.addEventListener("click", openCheckout); }
    setupCoupon(receipt);
  }

  // Expose only logic helpers for local mocked tests; no PHI is rendered or added to URLs.
  window.MmdThankYouVideo = {
    parseReceipt,
    readReceipt,
    createVideoOrder,
    captureVideoOrder,
    validateCoupon,
    submitCoupon,
    normalizeVideoStatus,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePage, { once: true });
  } else {
    initializePage();
  }
})(window, document);
