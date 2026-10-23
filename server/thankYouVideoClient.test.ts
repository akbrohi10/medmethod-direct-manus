import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";
import { describe, expect, it, vi } from "vitest";

const root = resolve(import.meta.dirname, "..");
const intake = readFileSync(resolve(root, "client/intake/index.html"), "utf8");
const script = readFileSync(resolve(root, "client/public/intake/thank-you-video.js"), "utf8");
const receipt = { submission_id: "synthetic-test-id", submission_token: "synthetic-test-token", sms_opt_in: false, video_visit_interest: true, is_test: false, payment_status: "NOT_REQUIRED" };

function intakeHelpers(result: Record<string, unknown>) {
  const values = new Map<string, string>();
  const request = vi.fn().mockResolvedValue(result);
  const context = vm.createContext({ Te: request, be: () => ({ synthetic: true }), MmdLivePhoneVerificationToken: () => "synthetic-phone-token", window: { sessionStorage: { setItem: (k: string, v: string) => values.set(k, v), removeItem: (k: string) => values.delete(k) } } });
  const start = intake.indexOf("async function MmdSubmitFreeIntake"), end = intake.indexOf("var Ae=", start);
  new vm.Script(intake.slice(start, end) + ";globalThis.api={submit:MmdSubmitFreeIntake,store:MmdStoreFreeIntakeReceipt}").runInContext(context);
  return { api: context.api, values, request };
}
function videoHelpers(fetchMock: ReturnType<typeof vi.fn>) {
  const window = { location: { search: "?paid=true&amount=49&prefill=demo" }, fetch: fetchMock, setTimeout, clearTimeout, sessionStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} } };
  const document = { readyState: "loading", addEventListener: () => {}, getElementById: () => null };
  const context = vm.createContext({ window, document, AbortController, URLSearchParams, Promise, setTimeout, clearTimeout });
  new vm.Script(script).runInContext(context);
  return (window as any).MmdThankYouVideo;
}

describe("server-directed video thank-you client", () => {
  it.each(["/thank-you-video", "/intake/thank-you/"])("follows only the returned allowlisted destination %s and stores the legacy six-field receipt", async (destination) => {
    const { api, values, request } = intakeHelpers({ ...receipt, redirect_url: destination });
    const result = await api.submit("w", { videoVisitInterest: false }, false);
    expect(result.redirect_url).toBe(destination); // Not inferred from checkbox, URL, or client payment flags.
    expect(api.store(result)).toBe(true);
    expect(JSON.parse(values.get("mmd_free_intake_receipt")!)).toEqual(receipt);
    expect(JSON.parse(request.mock.calls[0][1].body)).toMatchObject({ video_visit_interest: false });
    expect(intake).toContain("window.location.replace(receipt.redirect_url)");
  });
  it.each([undefined, "https://evil.example.test/", "/thank-you-video?email=test@example.test", "/thank-you2", "//evil.example.test/"])("rejects missing or unexpected destinations before navigating: %s", async (destination) => {
    const { api } = intakeHelpers({ ...receipt, redirect_url: destination });
    await expect(api.submit("w", {}, false)).rejects.toThrow("could not be confirmed");
  });
  it("uses the receipt and server capture rather than URL flags as payment proof", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ payment_status: "PENDING" }) });
    const api = videoHelpers(fetchMock);
    await expect(api.captureVideoOrder("MOCK-ORDER", "MOCK-APPROVAL")).rejects.toThrow("has not been confirmed");
    expect(script).toContain("const VIDEO_VISIT_AMOUNT = \"39.00\"");
    expect(script).not.toContain('new URLSearchParams(window.location.search)');
    expect(script).toContain("const validReceipt = await recoverVideoStatus(receipt)");
    expect(script).toContain("if (!byId(\"thank-you-video-root\") || !validReceipt) return");
    expect(script).toContain("unlockVideoCalendar()");
    expect(script).not.toContain("submission_token=");
    expect(script).not.toMatch(/\$49|\$15|45.minute|15.minute/);
  });
  it("posts only the accepted receipt token, approved method and receipt-owned test mode", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ order_id: "MOCK-ORDER", approval_token: "MOCK-APPROVAL" }) });
    const api = videoHelpers(fetchMock);
    await api.createVideoOrder(receipt, "card");
    expect(fetchMock.mock.calls[0][0]).toBe("/api/paypal/orders");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ submission_token: receipt.submission_token, payment_method: "card", demo_mode: false });
    expect(api.parseReceipt({ ...receipt, payment_status: "COMPLETED" })).toBeNull();
  });
});
