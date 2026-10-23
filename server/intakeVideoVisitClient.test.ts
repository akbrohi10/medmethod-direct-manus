import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";

const root = resolve(import.meta.dirname, "..");
const clientPath = resolve(root, "client/public/intake/video-visit.js");
const pagePath = resolve(root, "client/intake/thank-you/index.html");
const source = readFileSync(clientPath, "utf8");
const page = readFileSync(pagePath, "utf8");

type ResponseBody = Record<string, unknown>;

function response(body: ResponseBody, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

function loadClient(fetchMock = vi.fn()) {
  const values = new Map<string, string>();
  const document = {
    readyState: "loading",
    getElementById: vi.fn(() => null),
    querySelector: vi.fn(() => null),
    addEventListener: vi.fn(),
    createElement: vi.fn(() => ({ addEventListener: vi.fn(), dataset: {}, style: {} })),
    head: { appendChild: vi.fn() },
  };
  const windowObject: Record<string, unknown> = {
    location: { search: "" },
    sessionStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    },
    fetch: fetchMock,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    isSecureContext: true,
  };
  const context = vm.createContext({
    window: windowObject,
    document,
    URLSearchParams,
    AbortController,
    DOMException,
    Promise,
    setTimeout,
    clearTimeout,
  });
  new vm.Script(source, { filename: clientPath }).runInContext(context);
  return { api: windowObject.MmdVideoVisit as Record<string, (...args: never[]) => Promise<unknown> | unknown>, fetchMock, values, document, windowObject };
}

const receipt = {
  submission_id: "submission-safe-id",
  submission_token: "submission-safe-token",
  sms_opt_in: false,
  video_visit_interest: true,
  is_test: false,
  payment_status: "NOT_REQUIRED",
} as const;

describe("optional video visit confirmation client", () => {
  it("uses the approved referral label and placeholder without the removed helper text", () => {
    expect(page).toContain('<label id="coupon-title" for="video-coupon-code">Enter referral code</label>');
    expect(page).toContain('placeholder="Enter referral code"');
    expect(page).not.toContain("Optional video-visit coupon");
    expect(page).not.toContain("A coupon can waive only the optional video visit. Your intake is already free.");
    expect(page).not.toContain('aria-describedby="video-coupon-note"');
    expect(page).toContain('<button class="secondary" id="validate-video-coupon" type="button">Apply</button>');
  });

  it("is valid browser JavaScript and keeps the confirmation receipt strictly minimal", () => {
    const { api } = loadClient();
    expect(api.parseReceipt(JSON.stringify(receipt))).toEqual(receipt);
    expect(api.parseReceipt(JSON.stringify({ ...receipt, payment_status: "COMPLETED" }))).toBeNull();
    expect(api.parseReceipt(JSON.stringify({ ...receipt, submission_token: "" }))).toBeNull();
    expect(api.parseReceipt(JSON.stringify({ ...receipt, patient_email: "not-allowed@example.test" }))).toBeNull();

    expect(source).toContain('mmd_free_intake_receipt');
    expect(page).toContain("Complete your free intake to get started");
    expect(page).toContain('href="/intake/"');
    expect(page).not.toContain("Dr. Al-Deek");
    expect(page).not.toContain("$49 safety net");
    expect(page).toContain("Prefer a face-to-face conversation?");
    expect(page).toContain("Add a Video Visit — $39");
    expect(page).toContain("PatientPortalMenuHighlights_5e7b0fd0.png");
    expect(page).toContain('<strong id="care-message-title">Check your text messages</strong>');
    expect(page).toContain("Look for a text from MedMethod Direct. Open it and reply to start chatting with our Care Team or a doctor.");
    expect(page).not.toContain("Doctor-led weight-care review");
    expect(page).not.toContain("Your intake is free.");
    expect(page.indexOf('PatientPortalMenuHighlights_5e7b0fd0.png')).toBeLessThan(page.indexOf('id="video-visit-card"'));
    expect(page.indexOf('id="video-visit-card"')).toBeLessThan(page.indexOf('id="video-checkout"'));
    expect(page).toContain('class="start-over" href="/intake/">Start over</a>');
    expect(source).toContain('title.textContent = "Use your secure Patient Portal"');
    expect(source).toContain('copy.textContent = "Because you did not opt in to SMS, use your secure Patient Portal and welcome email for care updates and required forms."');
  });

  it("posts only the submission token and approved payment method to the optional PayPal order API", async () => {
    const fetchMock = vi.fn().mockResolvedValue(response({
      order_id: "VIDEO-ORDER-1", approval_token: "approval-token", payment_method: "card", environment: "sandbox",
    }));
    const { api, values } = loadClient(fetchMock);

    await expect(api.createVideoOrder(receipt, "card")).resolves.toMatchObject({ order_id: "VIDEO-ORDER-1" });
    expect(fetchMock).toHaveBeenCalledWith("/api/paypal/orders", expect.objectContaining({ method: "POST" }));
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent).toEqual({ submission_token: "submission-safe-token", payment_method: "card", demo_mode: false });
    expect(sent).not.toHaveProperty("intake");
    expect(sent).not.toHaveProperty("card_number");
    expect(JSON.parse(values.get("mmd_video_visit_checkout")!)).toEqual({ order_id: "VIDEO-ORDER-1", payment_method: "card", state: "pending" });
  });

  it("uses a demo query only in demo mode and forces the explicit test flag through the boundary", async () => {
    const fetchMock = vi.fn().mockResolvedValue(response({
      order_id: "VIDEO-DEMO-ORDER", approval_token: "demo-approval", payment_method: "apple_pay", environment: "sandbox",
    }));
    const { api, windowObject } = loadClient(fetchMock);
    (windowObject.location as { search: string }).search = "?prefill=demo";

    // Re-evaluate so the demo-only mode is established at page load like a real browser.
    const demo = loadClient(fetchMock);
    (demo.windowObject.location as { search: string }).search = "?prefill=demo";
    const testReceipt = { ...receipt, is_test: true };
    await api.createVideoOrder(testReceipt, "apple_pay");
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent).toMatchObject({ payment_method: "apple_pay", demo_mode: true });

    expect(source).toContain("?prefill=demo");
    expect(source).toContain('components: ["card-fields"]');
    expect(source).toContain('components: ["applepay-payments"]');
    expect(source).toContain("ApplePaySession.canMakePayments()");
    expect(source).toContain("createApplePayOneTimePaymentSession()");
    expect(source).toContain("validateMerchant({ validationUrl: event.validationURL })");
    expect(source).toContain("payment_method: paymentMethod === \"apple_pay\" ? \"apple_pay\" : \"card\"");
  });

  it("does not report payment completion before a COMPLETED server capture response and sends only the approval token", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response({ payment_status: "PENDING" }))
      .mockResolvedValueOnce(response({ payment_status: "COMPLETED", submission_id: "submission-safe-id" }));
    const { api, values } = loadClient(fetchMock);

    await expect(api.captureVideoOrder("VIDEO-ORDER-1", "approval-token")).rejects.toThrow("has not been confirmed");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ approval_token: "approval-token" });
    await expect(api.captureVideoOrder("VIDEO-ORDER-1", "approval-token")).resolves.toMatchObject({ payment_status: "COMPLETED" });
    expect(values.get("mmd_video_visit_checkout")).toBeUndefined();
  });

  it("uses token-only coupon API contracts and treats a waiver as no-card checkout", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response({ valid: true, status: "waived" }))
      .mockResolvedValueOnce(response({ payment_status: "WAIVED" }));
    const { api } = loadClient(fetchMock);

    await expect(api.validateCoupon("VIDEO39")).resolves.toMatchObject({ status: "waived" });
    await expect(api.submitCoupon(receipt, "VIDEO39")).resolves.toMatchObject({ payment_status: "WAIVED" });
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ coupon_code: "VIDEO39" });
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({ submission_token: "submission-safe-token", coupon_code: "VIDEO39" });
    expect(fetchMock.mock.calls[0][0]).toBe("/api/intake/coupon/validate");
    expect(fetchMock.mock.calls[1][0]).toBe("/api/intake/coupon/submit");
  });

  it("preserves hosted-field-only card collection and keeps no receipt token in the URL", () => {
    expect(page).toContain("PayPal-hosted secure fields");
    expect(source).toContain("https://www.sandbox.paypal.com/web-sdk/v6/core");
    expect(source).toContain("https://www.paypal.com/web-sdk/v6/core");
    expect(source).toContain('body: JSON.stringify({ approval_token: approvalToken })');
    expect(source).not.toContain("card_number");
    expect(source).not.toContain("card_cvv");
    expect(source).not.toContain("vault");
    expect(source).not.toContain("recurring");
    expect(source).not.toContain("submission_token=");
    expect(page).not.toContain("submission_token=");
  });

  it("caps all four confirmation-page card containers at 56px and sizes nested hosted frames to fit", () => {
    expect(page).toContain('.paypal-field > div { height: 56px; min-height: 56px; max-height: 56px;');
    expect(page).toContain('.paypal-field > div > *, .paypal-field > div iframe { display: block; width: 100%; height: 100% !important; min-height: 0 !important; max-height: 100% !important; }');
    expect(page).toContain('.paypal-field > div iframe { border: 0; }');
    expect(page.match(/<label class="paypal-field">/g)).toHaveLength(4);
    for (const id of ["video-card-name", "video-card-number", "video-card-expiry", "video-card-cvv"]) expect(page).toContain(`id="${id}"`);
    expect(source).toContain('const component = (type, placeholder) => secureFields.createCardFieldsComponent({ type, placeholder, style });');
  });

  it("never converts a successful capture into failure if temporary browser storage is blocked", async () => {
    const fetchMock = vi.fn().mockResolvedValue(response({ payment_status: "COMPLETED" }));
    const { api, windowObject } = loadClient(fetchMock);
    const storage = windowObject.sessionStorage as { getItem: () => unknown; setItem: () => unknown; removeItem: () => unknown };
    storage.getItem = () => { throw new Error("Storage is blocked"); };
    storage.removeItem = () => { throw new Error("Storage is blocked"); };
    expect(api.readReceipt()).toBeNull();
    await expect(api.captureVideoOrder("VIDEO-ORDER-1", "approval-token")).resolves.toMatchObject({ payment_status: "COMPLETED" });
  });

  it("offers recovery of the original pending order without another order request", () => {
    expect(page).toContain('id="video-payment-pending"');
    expect(page).toContain("Check payment confirmation");
    expect(source).toContain("captureVideoOrder(result.order.order_id, result.order.approval_token)");
    expect(source).toContain("do not start a second payment");
    expect(page).toContain('id="video-visit-card"');
  });
});
