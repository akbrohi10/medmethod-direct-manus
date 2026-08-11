import { describe, expect, it } from "vitest";
import {
  clearWl2PaymentResume,
  createWl2ThreeDsReturnUrl,
  getWl2PaymentResume,
  getWl2ThreeDsPaymentIntent,
  saveWl2PaymentResume,
} from "../client/src/lib/wl2PaymentResume";

function createMemoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
}

describe("WL2 Stripe 3DS return URL", () => {
  it("returns to the WL2 intake page rather than a separate thank-you page", () => {
    expect(createWl2ThreeDsReturnUrl("https://medmethoddirect.com"))
      .toBe("https://medmethoddirect.com/lp/WL2?wl2_3ds=1");
  });

  it("restores the saved WL2 patient details needed to reopen the modal", () => {
    const storage = createMemoryStorage();
    const payload = { paymentId: 315, firstName: "Jane", email: "jane@example.com", phone: "555-0100" };

    saveWl2PaymentResume(payload, storage);

    expect(getWl2PaymentResume(storage)).toEqual(payload);
  });

  it("recognizes only a successful WL2 3DS return with a payment intent", () => {
    expect(getWl2ThreeDsPaymentIntent("?wl2_3ds=1&redirect_status=succeeded&payment_intent=pi_wl2_15"))
      .toBe("pi_wl2_15");
    expect(getWl2ThreeDsPaymentIntent("?wl2_3ds=1&redirect_status=failed&payment_intent=pi_wl2_15"))
      .toBeNull();
    expect(getWl2ThreeDsPaymentIntent("?wl2_3ds=1&redirect_status=succeeded"))
      .toBeNull();
  });

  it("clears saved WL2 resume details once payment confirmation completes", () => {
    const storage = createMemoryStorage();
    saveWl2PaymentResume({ paymentId: 315, firstName: "Jane", email: "jane@example.com", phone: "555-0100" }, storage);

    clearWl2PaymentResume(storage);

    expect(getWl2PaymentResume(storage)).toBeNull();
  });
});
