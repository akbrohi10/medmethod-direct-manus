import { describe, expect, it, vi } from "vitest";
import { handoffWl2PostPayment, WL2_POST_PAYMENT_PATH, WL2_PREVIEW_PAYMENT_SKIP_PATH } from "../client/src/lib/wl2PostPayment";

describe("WL2 post-payment destination", () => {
  it("sends the one-time payment webhook and immediately routes a successful payment to the URL-trackable thank-you page", () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true });
    const navigate = vi.fn();

    handoffWl2PostPayment({
      fetchImpl,
      navigate,
      webhookUrl: "https://example.test/wl2-payment",
      payload: {
        first_name: "Test",
        email: "test@example.com",
        phone: "555-0100",
        payment_id: 15,
        transaction_id: "pi_test",
        payment_processor: "stripe",
        landing_page: "/lp/WL2",
        amount: 15,
        remaining_amount: 0,
        payment_status: "fully_paid",
        payment_type: "one_time_refundable_hold",
      },
    });

    expect(fetchImpl).toHaveBeenCalledWith(
      "https://example.test/wl2-payment",
      expect.objectContaining({ method: "POST", keepalive: true }),
    );
    expect(navigate).toHaveBeenCalledWith(WL2_POST_PAYMENT_PATH);
  });

  it("keeps the preview skip path separate from a real payment completion", () => {
    expect(WL2_PREVIEW_PAYMENT_SKIP_PATH).toBe("/thank-you2?preview=1");
  });
});
