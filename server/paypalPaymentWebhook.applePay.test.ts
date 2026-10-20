import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getDb: vi.fn(),
  getPaypalSettings: vi.fn(),
  getPayPalClient: vi.fn(),
}));

vi.mock("./db", () => ({ getDb: mocks.getDb, getPaypalSettings: mocks.getPaypalSettings }));
vi.mock("./routers/paypal", () => ({ getPayPalClient: mocks.getPayPalClient }));
vi.mock("./stripePaymentWebhook", () => ({ WEBHOOK_CONFIG: { GHL_PAYMENT_WEBHOOK_URL: "", ALLOWED_LANDING_PAGES: [], MAX_ATTEMPTS: 1, BACKOFF_BASE_MS: 0 } }));

import { paypalPaymentWebhookHandler } from "./paypalPaymentWebhook";

function response() {
  const res = {
    statusCode: 200,
    body: undefined as unknown,
    status(code: number) { this.statusCode = code; return this; },
    json(body: unknown) { this.body = body; return this; },
  };
  return res;
}

describe("PayPal Apple Pay vault webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getPaypalSettings.mockResolvedValue({ sandboxWebhookId: "sandbox-webhook-id", liveWebhookId: null });
  });

  it("rejects an unsigned delayed vault event before it can query or mutate a payment", async () => {
    const db = { select: vi.fn(), update: vi.fn() };
    mocks.getDb.mockResolvedValue(db);
    const req = {
      body: { event_type: "VAULT.PAYMENT-TOKEN.CREATED", resource: { id: "vault", customer: { id: "customer" } } },
      header: () => undefined,
    };
    const res = response();

    await paypalPaymentWebhookHandler(req as never, res as never);
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: "Invalid PayPal Apple Pay vault webhook signature" });
    expect(db.select).not.toHaveBeenCalled();
    expect(db.update).not.toHaveBeenCalled();
  });

  it("uses PayPal's signature-verification API before examining a signed delayed vault event", async () => {
    const db = {
      select: vi.fn(() => ({ from: () => ({ where: () => [] }) })),
      update: vi.fn(),
    };
    mocks.getDb.mockResolvedValue(db);
    mocks.getPayPalClient.mockResolvedValue({ baseUrl: "https://api-m.sandbox.paypal.com", token: "token" });
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ verification_status: "SUCCESS" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const headers: Record<string, string> = {
      "paypal-auth-algo": "SHA256withRSA",
      "paypal-cert-url": "https://api.paypal.test/cert",
      "paypal-transmission-id": "transmission-id",
      "paypal-transmission-sig": "signature",
      "paypal-transmission-time": "2026-10-20T00:00:00Z",
    };
    const req = {
      body: { event_type: "VAULT.PAYMENT-TOKEN.CREATED", resource: { id: "vault", customer: { id: "customer" } } },
      header: (name: string) => headers[name],
    };
    const res = response();

    await paypalPaymentWebhookHandler(req as never, res as never);
    expect(fetchMock).toHaveBeenCalledWith("https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature", expect.objectContaining({ method: "POST" }));
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ignored: true, reason: "unmatched_or_ambiguous_apple_pay_vault" });
    expect(db.update).not.toHaveBeenCalled();
  });
});
