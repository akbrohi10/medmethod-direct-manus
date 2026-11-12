import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";
import { describe, expect, it, vi } from "vitest";

const root = resolve(import.meta.dirname, "..");
const intake = readFileSync(resolve(root, "client/intake/index.html"), "utf8");
const videoSource = readFileSync(resolve(root, "client/public/intake/video-visit.js"), "utf8");
const accepted = {
  submission_id: "synthetic-submission",
  submission_token: "synthetic-receipt-token",
  sms_opt_in: false,
  video_visit_interest: false,
  is_test: false,
  payment_status: "NOT_REQUIRED",
  redirect_url: "/intake/thank-you/",
};

function loadIntake(body: Record<string, unknown> = accepted, options: { status?: number; search?: string; reject?: boolean; missingSdk?: boolean; throwingSdk?: boolean } = {}) {
  const calls: Array<{ destination: string; options: { excluded: boolean } }> = [];
  const arm = vi.fn((destination: string, armOptions: { excluded: boolean }) => {
    calls.push({ destination, options: armOptions });
    if (options.throwingSdk) throw new Error("mock tracking unavailable");
    return !armOptions.excluded;
  });
  const status = options.status ?? 201;
  const fetch = vi.fn().mockImplementation(async () => {
    if (options.reject) throw new Error("mock transport rejected");
    return { ok: status >= 200 && status < 300, status, json: async () => body };
  });
  const values = new Map<string, string>();
  const windowObject = {
    location: { search: options.search ?? "", replace: vi.fn() },
    setTimeout,
    clearTimeout,
    sessionStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    },
    ...(options.missingSdk ? {} : { MmdMetaLead: { arm } }),
  };
  // Execute the exact production request, accepted-result and receipt-storage helpers;
  // only clinical payload assembly, verification and fetch are neutral local mocks.
  const start = intake.indexOf("async function we(");
  const end = intake.indexOf("var Ae=", start);
  expect(start).toBeGreaterThan(0);
  expect(end).toBeGreaterThan(start);
  const context = vm.createContext({
    window: windowObject,
    fetch,
    URLSearchParams,
    AbortController,
    DOMException,
    be: (route: string, _answers: unknown, source: string, is_test: boolean) => ({ route, source, is_test }),
    MmdLivePhoneVerificationToken: () => "synthetic-verification-token",
    MmdDemoIdentityVerificationSkipped: (demo: boolean) => {
      const query = new URLSearchParams(options.search ?? "");
      return demo === true && query.getAll("prefill").length === 1 && query.get("prefill") === "demo";
    },
  });
  new vm.Script(intake.slice(start, end) + ";globalThis.api={MmdSubmitFreeIntake,MmdStoreFreeIntakeReceipt};").runInContext(context);
  const api = context.api as {
    MmdSubmitFreeIntake: (route: string, answers: Record<string, unknown>, demo?: boolean, signing?: unknown) => Promise<typeof accepted>;
    MmdStoreFreeIntakeReceipt: (receipt: typeof accepted) => boolean;
  };
  return { api, arm, calls, fetch, values, windowObject };
}

function loadVideoClient() {
  const arm = vi.fn();
  const consume = vi.fn();
  const fetch = vi.fn();
  const location = { pathname: "/intake/thank-you/", search: "", replace: vi.fn() };
  const document = {
    readyState: "loading",
    addEventListener: vi.fn(),
    getElementById: vi.fn(() => null),
  };
  const context = vm.createContext({
    window: { location, MmdMetaLead: { arm, consume }, fetch, setTimeout, clearTimeout, sessionStorage: { removeItem: vi.fn() } },
    document, URLSearchParams, AbortController, DOMException,
  });
  new vm.Script(videoSource).runInContext(context);
  const api = context.window.MmdVideoVisit as {
    finishConfirmedVideoVisit: (kind: string, confirmation: unknown) => boolean;
    captureVideoOrder: (id: string, token: string) => Promise<unknown>;
    submitCoupon: (receipt: typeof accepted, code: string) => Promise<unknown>;
  };
  return { api, arm, consume, fetch, location };
}

describe("Meta Lead intake acceptance hooks (local mocks only)", () => {
  it.each(["/intake/thank-you/", "/thank-you-video"])("arms only the accepted initial intake neutral destination %s", async (destination) => {
    const runtime = loadIntake({ ...accepted, redirect_url: destination, video_visit_interest: destination === "/thank-you-video" });
    const receipt = await runtime.api.MmdSubmitFreeIntake("w", { videoVisitInterest: destination === "/thank-you-video", email: "synthetic@example.test", answers: "PRIVATE" }, false, { synthetic: true });
    expect(runtime.calls).toEqual([{ destination, options: { excluded: false } }]);
    expect(runtime.arm).toHaveBeenCalledTimes(1);
    expect(receipt.redirect_url).toBe(destination);
    expect(runtime.windowObject.location.replace).not.toHaveBeenCalled();
    expect(runtime.values.size).toBe(0); // The tracking hook itself stores no receipt or health/contact data.
    expect(JSON.stringify(runtime.calls)).not.toMatch(/synthetic|PRIVATE|email|submission|verification|video_visit|sms/);
    expect(runtime.fetch).toHaveBeenCalledTimes(1);
    expect(runtime.fetch.mock.calls[0][0]).toBe("/api/intake/submit");
    const request = JSON.parse(runtime.fetch.mock.calls[0][1].body);
    expect(request).toEqual({ intake: { route: "w", source: "mmd-intake-web", is_test: false }, phone_verification_token: "synthetic-verification-token", demo_mode: false, video_visit_interest: destination === "/thank-you-video", signing: { synthetic: true } });
  });

  it("arms after response validation, before the unchanged receipt/redirect UI branch", () => {
    const validate = intake.indexOf('throw Error("Your free intake could not be confirmed. Please retry completion.");');
    const hook = intake.indexOf("MmdArmIntakeLead(result,demoMode);", validate);
    const returned = intake.indexOf("return{submission_id:result.submission_id", validate);
    expect(hook).toBeGreaterThan(validate);
    expect(hook).toBeLessThan(returned);
    expect(intake).toContain('const receipt=await MmdSubmitFreeIntake("w",answers,demo,signing);setAnswers({_submissionId:ve(),_submittedAt:new Date().toISOString()});if(MmdStoreFreeIntakeReceipt(receipt))window.location.replace(receipt.redirect_url);else setLocalReceipt(receipt)');
    expect(intake.match(/MmdArmIntakeLead\(result,demoMode\);/g)).toHaveLength(1);
    expect(intake).not.toContain("fbq(");
  });

  it("uses authoritative is_test plus client demo exclusion without changing demo routing", async () => {
    const runtime = loadIntake({ ...accepted, is_test: true, redirect_url: "/intake/thank-you/?prefill=demo" }, { search: "?prefill=demo" });
    const result = await runtime.api.MmdSubmitFreeIntake("w", {}, true);
    expect(result.is_test).toBe(true);
    expect(result.redirect_url).toBe("/intake/thank-you/?prefill=demo");
    expect(runtime.calls).toEqual([{ destination: "/intake/thank-you/", options: { excluded: true } }]);
    expect(runtime.fetch.mock.calls[0][0]).toBe("/api/intake/submit?prefill=demo");
  });

  it.each([true, undefined, null, "false", 0, "true"])("fails closed for non-exact-false response is_test=%s while preserving accepted receipt behavior", async (is_test) => {
    const runtime = loadIntake({ ...accepted, is_test });
    await expect(runtime.api.MmdSubmitFreeIntake("w", {}, false)).resolves.toMatchObject({ submission_id: accepted.submission_id });
    expect(runtime.calls).toEqual([{ destination: "/intake/thank-you/", options: { excluded: true } }]);
  });

  it("excludes malformed demo query client mode even when the request is normal", async () => {
    const runtime = loadIntake(accepted, { search: "?prefill=demo&prefill=demo" });
    await runtime.api.MmdSubmitFreeIntake("w", {}, true);
    expect(runtime.fetch.mock.calls[0][0]).toBe("/api/intake/submit");
    expect(runtime.calls[0].options.excluded).toBe(true);
  });

  it.each([400, 422, 500])("does not arm on non-success HTTP %s even with acceptance-shaped data", async (status) => {
    const runtime = loadIntake(accepted, { status });
    await expect(runtime.api.MmdSubmitFreeIntake("w", {})).rejects.toThrow();
    expect(runtime.arm).not.toHaveBeenCalled();
  });

  it("does not arm on transport failure", async () => {
    const runtime = loadIntake(accepted, { reject: true });
    await expect(runtime.api.MmdSubmitFreeIntake("w", {})).rejects.toThrow();
    expect(runtime.arm).not.toHaveBeenCalled();
  });

  it.each([
    { submission_id: "" }, { submission_token: "" }, { payment_status: "COMPLETED" },
    { payment_status: "WAIVED" }, { redirect_url: "/thank-you-video?receipt=PRIVATE" },
    { redirect_url: "/thank-you" }, { redirect_url: "/intake/thank-you/?prefill=demo" },
  ])("does not arm on an unconfirmed/paid/injected result %j", async (override) => {
    const runtime = loadIntake({ ...accepted, ...override });
    await expect(runtime.api.MmdSubmitFreeIntake("w", {})).rejects.toThrow("could not be confirmed");
    expect(runtime.arm).not.toHaveBeenCalled();
  });

  it.each([{ missingSdk: true }, { throwingSdk: true }])("never converts tracking unavailability into failed accepted intake %j", async (options) => {
    const runtime = loadIntake(accepted, options);
    await expect(runtime.api.MmdSubmitFreeIntake("w", {})).resolves.toEqual(accepted);
  });

  it("preserves the exact existing minimal free-intake receipt and checkout cleanup", async () => {
    const runtime = loadIntake();
    runtime.values.set("mmd_video_visit_checkout", "synthetic-pending");
    const result = await runtime.api.MmdSubmitFreeIntake("w", {});
    expect(runtime.api.MmdStoreFreeIntakeReceipt(result)).toBe(true);
    const { redirect_url: _redirect, ...receipt } = accepted;
    expect(JSON.parse(runtime.values.get("mmd_free_intake_receipt")!)).toEqual(receipt);
    expect(runtime.values.has("mmd_video_visit_checkout")).toBe(false);
    expect(runtime.calls).toHaveLength(1);
  });

  it("keeps later paid, waived and already-confirmed video transitions entirely unarmed", () => {
    const runtime = loadVideoClient();
    expect(videoSource).not.toContain("MmdMetaLead");
    expect(runtime.api.finishConfirmedVideoVisit("paid", { payment_status: "PENDING" })).toBe(false);
    expect(runtime.api.finishConfirmedVideoVisit("paid", { payment_status: "COMPLETED" })).toBe(true);
    expect(runtime.api.finishConfirmedVideoVisit("waived", { payment_status: "WAIVED" })).toBe(true);
    expect(runtime.location.replace.mock.calls).toEqual([["/thank-you-video"], ["/thank-you-video"]]);
    expect(runtime.arm).not.toHaveBeenCalled();
    expect(runtime.consume).not.toHaveBeenCalled(); // Destination consumption is exclusively shared SDK responsibility.
    expect(runtime.fetch).not.toHaveBeenCalled();
  });

  it("does not arm on mocked video capture or coupon success", async () => {
    const runtime = loadVideoClient();
    runtime.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ payment_status: "COMPLETED" }) });
    const captured = await runtime.api.captureVideoOrder("synthetic-order", "synthetic-approval");
    expect(runtime.api.finishConfirmedVideoVisit("paid", captured)).toBe(true);
    runtime.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ payment_status: "WAIVED" }) });
    const waived = await runtime.api.submitCoupon(accepted, "synthetic-coupon");
    expect(runtime.api.finishConfirmedVideoVisit("waived", waived)).toBe(true);
    expect(runtime.arm).not.toHaveBeenCalled();
    expect(runtime.consume).not.toHaveBeenCalled();
  });
});
