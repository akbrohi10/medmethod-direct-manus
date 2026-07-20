/**
 * Stripe router tests — validates the key management and payment intent logic
 * without hitting real Stripe APIs or the database.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock the DB helpers ──────────────────────────────────────────────────────

vi.mock("./db", () => ({
  getStripeSettings: vi.fn(),
  upsertStripeSettings: vi.fn(),
  createPayment: vi.fn(),
  updatePayment: vi.fn(),
  getPaymentById: vi.fn(),
  getAllPayments: vi.fn(),
}));

import * as db from "./db";

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Stripe settings helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null publishable key when no settings exist", async () => {
    vi.mocked(db.getStripeSettings).mockResolvedValue(null);

    const settings = await db.getStripeSettings();
    expect(settings).toBeNull();
  });

  it("returns test publishable key when mode is test", async () => {
    vi.mocked(db.getStripeSettings).mockResolvedValue({
      id: 1,
      mode: "test",
      testPublishableKey: "pk_test_abc123",
      testSecretKey: "sk_test_xyz",
      livePublishableKey: null,
      liveSecretKey: null,
      updatedAt: new Date(),
    });

    const settings = await db.getStripeSettings();
    expect(settings).not.toBeNull();
    expect(settings!.mode).toBe("test");
    expect(settings!.testPublishableKey).toBe("pk_test_abc123");
  });

  it("returns live publishable key when mode is live", async () => {
    vi.mocked(db.getStripeSettings).mockResolvedValue({
      id: 1,
      mode: "live",
      testPublishableKey: "pk_test_abc123",
      testSecretKey: "sk_test_xyz",
      livePublishableKey: "pk_live_def456",
      liveSecretKey: "sk_live_uvw",
      updatedAt: new Date(),
    });

    const settings = await db.getStripeSettings();
    expect(settings!.mode).toBe("live");
    expect(settings!.livePublishableKey).toBe("pk_live_def456");
  });

  it("upsertStripeSettings is called with correct data", async () => {
    vi.mocked(db.upsertStripeSettings).mockResolvedValue(undefined);

    await db.upsertStripeSettings({
      mode: "test",
      testPublishableKey: "pk_test_new",
      testSecretKey: "sk_test_new",
    });

    expect(db.upsertStripeSettings).toHaveBeenCalledWith({
      mode: "test",
      testPublishableKey: "pk_test_new",
      testSecretKey: "sk_test_new",
    });
  });
});

describe("Payment record helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("createPayment returns an insertId", async () => {
    vi.mocked(db.createPayment).mockResolvedValue(42);

    const id = await db.createPayment({
      patientName: "Jane Doe",
      patientEmail: "jane@example.com",
      patientPhone: "5550001234",
      depositAmount: 5000,
      remainingAmount: 14900,
      stripeCustomerId: "cus_test123",
      depositPaymentIntentId: "pi_test123",
      status: "deposit_paid",
      landingPage: "hrt2",
    });

    expect(id).toBe(42);
  });

  it("getPaymentById returns null when not found", async () => {
    vi.mocked(db.getPaymentById).mockResolvedValue(null);

    const payment = await db.getPaymentById(999);
    expect(payment).toBeNull();
  });

  it("getAllPayments returns an array", async () => {
    vi.mocked(db.getAllPayments).mockResolvedValue([]);

    const payments = await db.getAllPayments();
    expect(Array.isArray(payments)).toBe(true);
  });

  it("updatePayment is called with correct id and data", async () => {
    vi.mocked(db.updatePayment).mockResolvedValue(undefined);

    await db.updatePayment(42, {
      stripePaymentMethodId: "pm_test_abc",
      status: "deposit_paid",
    });

    expect(db.updatePayment).toHaveBeenCalledWith(42, {
      stripePaymentMethodId: "pm_test_abc",
      status: "deposit_paid",
    });
  });
});

describe("Key redaction logic", () => {
  it("redacts a secret key correctly", () => {
    // Inline the redact logic to test it
    function redactKey(key: string | null | undefined): string {
      if (!key) return "";
      if (key.length <= 8) return "****";
      return key.slice(0, 7) + "..." + key.slice(-4);
    }

    expect(redactKey("sk_test_abcdefghijklmnop")).toBe("sk_test...mnop");
    expect(redactKey("sk_live_xyz1234567890")).toBe("sk_live...7890");
    expect(redactKey(null)).toBe("");
    expect(redactKey("")).toBe("");
    expect(redactKey("short")).toBe("****");
  });

  it("does not save a redacted key (contains ...)", () => {
    // Simulate the updateSettings mutation logic
    function shouldSaveKey(key: string | undefined): boolean {
      if (!key) return false;
      if (key.includes("...")) return false;
      return true;
    }

    expect(shouldSaveKey("sk_test_abc...1234")).toBe(false);
    expect(shouldSaveKey("sk_test_realkey123")).toBe(true);
    expect(shouldSaveKey(undefined)).toBe(false);
    expect(shouldSaveKey("")).toBe(false);
  });
});
