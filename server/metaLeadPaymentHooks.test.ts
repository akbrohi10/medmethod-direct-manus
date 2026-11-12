import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  armVerifiedPaymentLead, armVerifiedVideoPaymentLead, rememberPaymentLeadProvenance,
  KNOWN_INTAKE_RECEIPTS, META_LEAD_PAYMENT_PREFIX,
} from "../client/src/lib/metaLeadPaymentHooks";

const mocks = vi.hoisted(() => ({
  settings: vi.fn(), paypalSettings: vi.fn(), retrieve: vi.fn(), update: vi.fn(), getPayment: vi.fn(), sendEmail: vi.fn(),
}));
vi.mock("./db", () => ({
  getStripeSettings: mocks.settings, getPaypalSettings: mocks.paypalSettings,
  updatePayment: mocks.update, getPaymentById: mocks.getPayment,
  createPayment: vi.fn(), getAllPayments: vi.fn(), upsertStripeSettings: vi.fn(), upsertPaypalSettings: vi.fn(),
}));
vi.mock("./emailService", () => ({ sendPaymentEmailSafely: mocks.sendEmail }));
vi.mock("stripe", () => ({ default: class { paymentIntents = { retrieve: mocks.retrieve }; } }));
import { stripeRouter } from "./routers/stripe";
import { paypalRouter } from "./routers/paypal";

const root = path.resolve(import.meta.dirname, "..");
const source = (file: string) => readFileSync(path.join(root, file), "utf8");
let store: Map<string, string>;
let arm: ReturnType<typeof vi.fn>;
function mark(provider = "stripe", id = "pi_verified") { return `${META_LEAD_PAYMENT_PREFIX}${provider}:${id}`; }
function token(provider = "stripe", id = "pi_verified", mode: unknown = "live", destination = "/thank-you-video-4799") {
  return Buffer.from(JSON.stringify({ v: 1, kind: "checkout", provider, providerId: id, mode,
    source: destination === "/thank-you-video-97" ? "/weight-loss-menopauseV2" : "/masterclass2" })).toString("base64url") + ".server-authenticated-signature";
}
beforeEach(() => {
  vi.clearAllMocks(); store = new Map(); arm = vi.fn();
  vi.stubGlobal("window", { sessionStorage: { getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value) }, MmdMetaLead: { arm } });
});
afterEach(() => vi.unstubAllGlobals());

describe("standalone verified payment arming", () => {
  it.each(["/thank-you", "/thank-you2", "/thank-you-video", "/thank-you-video-4799", "/thank-you-video-97"])("arms only exact neutral destination %s with live result", destination => {
    rememberPaymentLeadProvenance("stripe", "pi_verified");
    expect(armVerifiedPaymentLead(destination, "stripe", "pi_verified", true)).toBe(true);
    expect(arm).toHaveBeenCalledTimes(1); expect(arm).toHaveBeenCalledWith(destination, { excluded: false });
  });
  it.each(["/thank-you?email=private", "/thank-you#receipt", "https://example.com/thank-you", "/unknown", "//thank-you"])("does not arm unapproved destination %s", destination => {
    rememberPaymentLeadProvenance("stripe", "pi_verified");
    expect(armVerifiedPaymentLead(destination, "stripe", "pi_verified", true)).toBe(false);
    expect(arm).not.toHaveBeenCalled();
  });
  it.each([false, undefined, null, "live", 1])("excludes non-boolean live classification %s", live => {
    rememberPaymentLeadProvenance("stripe", "pi_verified");
    expect(armVerifiedPaymentLead("/thank-you", "stripe", "pi_verified", live as boolean)).toBe(false);
    expect(arm).toHaveBeenCalledTimes(1); expect(arm).toHaveBeenCalledWith("/thank-you", { excluded: true });
  });
  it("does not refresh flags after duplicate/recovery callbacks or repeated creation", () => {
    rememberPaymentLeadProvenance("stripe", "pi_verified");
    armVerifiedPaymentLead("/thank-you", "stripe", "pi_verified", true);
    const first = store.get(mark());
    rememberPaymentLeadProvenance("stripe", "pi_verified");
    expect(armVerifiedPaymentLead("/thank-you", "stripe", "pi_verified", true)).toBe(false);
    expect(store.get(mark())).toBe(first); expect(arm).toHaveBeenCalledTimes(1);
  });
  it("unknown older checkout provenance is exclusion-only", () => {
    expect(armVerifiedPaymentLead("/thank-you", "stripe", "pi_verified", true)).toBe(false);
    expect(arm).toHaveBeenCalledTimes(1); expect(arm).toHaveBeenCalledWith("/thank-you", { excluded: true });
  });
  it.each(KNOWN_INTAKE_RECEIPTS)("latches existing intake/session exclusion marker %s by presence only", key => {
    store.set(key, "private receipt never parsed"); rememberPaymentLeadProvenance("stripe", "pi_verified");
    store.delete(key);
    expect(armVerifiedPaymentLead("/thank-you", "stripe", "pi_verified", true)).toBe(false);
    expect(arm).toHaveBeenCalledTimes(1); expect(arm).toHaveBeenCalledWith("/thank-you", { excluded: true });
  });
  it("late intake acceptance excludes a previously standalone checkout", () => {
    rememberPaymentLeadProvenance("stripe", "pi_verified"); store.set("mmd_meta_intake_accepted_v1", "1");
    expect(armVerifiedPaymentLead("/thank-you", "stripe", "pi_verified", true)).toBe(false);
    expect(arm).toHaveBeenCalledWith("/thank-you", { excluded: true });
  });
  it("explicit full-intake provenance remains excluded across repeated creation", () => {
    rememberPaymentLeadProvenance("paypal", "ORDER-verified", { excluded: true });
    rememberPaymentLeadProvenance("paypal", "ORDER-verified", { excluded: false });
    expect(armVerifiedPaymentLead("/thank-you", "paypal", "ORDER-verified", true)).toBe(false);
    expect(arm).toHaveBeenCalledTimes(1); expect(arm).toHaveBeenCalledWith("/thank-you", { excluded: true });
  });
  it("an exclusion discovered after success invalidates rather than refreshes the pending flag", () => {
    rememberPaymentLeadProvenance("stripe", "pi_verified"); armVerifiedPaymentLead("/thank-you", "stripe", "pi_verified", true);
    store.set("mmd_free_intake_receipt", "existing"); armVerifiedPaymentLead("/thank-you", "stripe", "pi_verified", true);
    armVerifiedPaymentLead("/thank-you", "stripe", "pi_verified", true);
    expect(arm.mock.calls).toEqual([["/thank-you", { excluded: false }], ["/thank-you", { excluded: true }]]);
  });
  it("missing helper or denied storage cannot interrupt payment", () => {
    rememberPaymentLeadProvenance("stripe", "pi_verified"); (window as any).MmdMetaLead = undefined;
    expect(armVerifiedPaymentLead("/thank-you", "stripe", "pi_verified", true)).toBe(false);
    (window as any).sessionStorage.getItem = () => { throw Error("blocked"); };
    expect(() => rememberPaymentLeadProvenance("stripe", "pi_verified")).not.toThrow();
    expect(armVerifiedPaymentLead("/thank-you", "stripe", "pi_verified", true)).toBe(false);
  });
  it("helper exceptions are swallowed and duplicate callbacks still cannot refresh", () => {
    rememberPaymentLeadProvenance("stripe", "pi_verified"); arm.mockImplementation(() => { throw Error("measurement unavailable"); });
    expect(armVerifiedPaymentLead("/thank-you", "stripe", "pi_verified", true)).toBe(false);
    armVerifiedPaymentLead("/thank-you", "stripe", "pi_verified", true); expect(arm).toHaveBeenCalledTimes(1);
  });
  it("passes no provider identifiers, receipts, URLs, or contact fields to arm", () => {
    rememberPaymentLeadProvenance("paypal", "ORDER-neutral"); armVerifiedPaymentLead("/thank-you", "paypal", "ORDER-neutral", true);
    expect(JSON.stringify(arm.mock.calls)).toBe('[["/thank-you",{"excluded":false}]]');
  });
});

describe("already server-authenticated video result metadata", () => {
  it.each(["stripe", "paypal"] as const)("supports %s live signed checkout metadata after verified result", provider => {
    rememberPaymentLeadProvenance(provider, "pi_verified");
    expect(armVerifiedVideoPaymentLead("/thank-you-video-4799", provider, "pi_verified", token(provider))).toBe(true);
    expect(arm).toHaveBeenCalledTimes(1); expect(arm).toHaveBeenCalledWith("/thank-you-video-4799", { excluded: false });
  });
  it.each(["sandbox", "test", undefined])("excludes original checkout mode %s regardless of current admin mode", mode => {
    rememberPaymentLeadProvenance("stripe", "pi_verified");
    expect(armVerifiedVideoPaymentLead("/thank-you-video-4799", "stripe", "pi_verified", token("stripe", "pi_verified", mode === undefined ? null : mode))).toBe(false);
    expect(arm).toHaveBeenCalledWith("/thank-you-video-4799", { excluded: true });
  });
  it("supports $97 without leaking verified token to arm", () => {
    rememberPaymentLeadProvenance("paypal", "ORDER-97");
    armVerifiedVideoPaymentLead("/thank-you-video-97", "paypal", "ORDER-97", token("paypal", "ORDER-97", "live", "/thank-you-video-97"));
    expect(arm).toHaveBeenCalledTimes(1); expect(arm).toHaveBeenCalledWith("/thank-you-video-97", { excluded: false });
  });
  it.each(["garbage", token("paypal"), token("stripe", "pi_other"), token("stripe", "pi_verified", "live", "/thank-you-video-97")])("rejects mismatched/malformed authenticated metadata", checkoutToken => {
    rememberPaymentLeadProvenance("stripe", "pi_verified");
    expect(armVerifiedVideoPaymentLead("/thank-you-video-4799", "stripe", "pi_verified", checkoutToken)).toBe(false);
    expect(arm).not.toHaveBeenCalled();
  });
});

describe("offline authoritative server results", () => {
  it.each([true, false, undefined])("Stripe exposes optional verified-live flag only on genuine live succeeded PI (%s)", livemode => {
    mocks.settings.mockResolvedValue({ mode: "live", liveSecretKey: "mock-only" });
    mocks.retrieve.mockResolvedValue({ id: "pi_verified", status: "succeeded", livemode, payment_method: "pm_fake", amount: 5000 });
    return stripeRouter.createCaller({} as never).confirmDeposit({ paymentId: 1, paymentIntentId: "pi_verified" }).then(result => {
      expect(result).toEqual(livemode === true ? { success: true, metaLeadLivePayment: true } : { success: true });
    });
  });
  it("Stripe processing/requires_action cannot return verified success", async () => {
    mocks.settings.mockResolvedValue({ mode: "live", liveSecretKey: "mock-only" });
    mocks.retrieve.mockResolvedValue({ id: "pi_verified", status: "processing", livemode: true });
    await expect(stripeRouter.createCaller({} as never).confirmDeposit({ paymentId: 1, paymentIntentId: "pi_verified" })).rejects.toThrow("Payment not confirmed");
    expect(mocks.update).not.toHaveBeenCalled();
  });
  it.each(["live", "sandbox"])("PayPal capture exposes only genuine COMPLETED %s result mode", async mode => {
    mocks.paypalSettings.mockResolvedValue({ mode, liveClientId: "mock", liveClientSecret: "mock", sandboxClientId: "mock", sandboxClientSecret: "mock" });
    mocks.getPayment.mockResolvedValue({ depositAmount: 5000 });
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ access_token: "mock-only" })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "ORDER-verified", status: "COMPLETED" })));
    vi.stubGlobal("fetch", fetchMock);
    const result = await paypalRouter.createCaller({} as never).captureOrder({ paymentId: 1, orderId: "ORDER-verified" });
    expect(result).toEqual({ success: true, captureId: "ORDER-verified", hasVaultToken: false, ...(mode === "live" ? { metaLeadLivePayment: true } : {}) });
  });
  it("PayPal APPROVED or pending capture cannot return verified success", async () => {
    mocks.paypalSettings.mockResolvedValue({ mode: "live", liveClientId: "mock", liveClientSecret: "mock" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ access_token: "mock-only" })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "ORDER-verified", status: "APPROVED" }))));
    await expect(paypalRouter.createCaller({} as never).captureOrder({ paymentId: 1, orderId: "ORDER-verified" })).rejects.toThrow("PayPal capture status");
    expect(mocks.update).not.toHaveBeenCalled();
  });
});

describe("exact callback and exclusion placement", () => {
  it("Stripe direct hook precedes the existing early-redirect callback but remains inside succeeded branch", () => {
    const file = source("client/src/components/home1/StripePaymentForm.tsx");
    const branch = file.slice(file.indexOf('if (paymentIntent?.status === "succeeded")'), file.indexOf('} else if (paymentIntent?.status === "requires_action")'));
    expect(branch).toContain('paymentIntent.livemode === true');
    expect(branch.indexOf("armVerifiedPaymentLead")).toBeLessThan(branch.indexOf("onPaymentIntentId?."));
    expect(file).not.toMatch(/fbq|fbevents|facebook\.com\/tr/);
  });
  it.each(["4799", "97"])("video %s hooks follow verified mutation, never click/provider-approved metadata", suffix => {
    const base = suffix === "4799" ? "client/src/components/masterclass2/checkout4799" : "client/src/components/weight-loss-menopause-v2/checkout97";
    for (const kind of ["StripePayment", "PaypalPayment", "Checkout"]) {
      const file = source(`${base}/VideoVisit${kind}${suffix}.tsx`);
      for (const fragment of file.split("armVerifiedVideoPaymentLead(").slice(1)) expect(fragment).toMatch(/^result\.redirect_url,/);
      expect(file).not.toMatch(/fbq|fbevents|facebook\.com\/tr/);
    }
  });
  it("unknown 3DS fallback is still unarmed and unchanged", () => {
    const file = source("client/src/pages/ThanksPayment.tsx");
    expect(file.slice(file.indexOf("} else {"), file.indexOf("}, []);"))).not.toContain("armVerified");
    expect(file).toContain('navigate("/thank-you");');
  });
  it("full-intake consultation passes explicit exclusion while intake-bound video/waiver and generic redirects remain unarmed", () => {
    expect(source("client/src/components/home1/LpConsultationModal2.tsx").match(/metaLeadExcluded=\{!startAtPayment\}/g)).toHaveLength(2);
    for (const file of ["client/src/components/thank-you-video/checkout.js"])
      expect(source(file)).not.toMatch(/armVerifiedPaymentLead|armVerifiedVideoPaymentLead|MmdMetaLead\.arm/);
  });
});

describe("WL2 and legacy independent video payment coverage", () => {
  it.each(["stripe", "paypal"] as const)("WL2 %s counts only known live creation and never refreshes on recovery", provider => {
    rememberPaymentLeadProvenance(provider, "opaque_verified");
    expect(armVerifiedPaymentLead("/thank-you2", provider, "opaque_verified", true)).toBe(true);
    expect(armVerifiedPaymentLead("/thank-you2", provider, "opaque_verified", true)).toBe(false);
    expect(arm.mock.calls).toEqual([["/thank-you2", { excluded: false }]]);
  });
  it.each(KNOWN_INTAKE_RECEIPTS)("WL2 excludes already locally accepted intake marker %s without parsing it", key => {
    rememberPaymentLeadProvenance("stripe", "pi_wl2");
    store.set(key, "not JSON: do not parse this receipt");
    expect(armVerifiedPaymentLead("/thank-you2", "stripe", "pi_wl2", true)).toBe(false);
    expect(arm).toHaveBeenCalledWith("/thank-you2", { excluded: true });
  });
  it.each(["stripe", "paypal"] as const)("legacy $39 %s uses the exact server-authenticated live token and neutral destination", provider => {
    rememberPaymentLeadProvenance(provider, "opaque_verified");
    expect(armVerifiedVideoPaymentLead("/thank-you-video", provider, "opaque_verified", token(provider, "opaque_verified"))).toBe(true);
    expect(armVerifiedVideoPaymentLead("/thank-you-video", provider, "opaque_verified", token(provider, "opaque_verified"))).toBe(false);
    expect(arm.mock.calls).toEqual([["/thank-you-video", { excluded: false }]]);
  });
  it.each(KNOWN_INTAKE_RECEIPTS)("legacy video never arms over intake-owned flag when %s is present at success", key => {
    rememberPaymentLeadProvenance("stripe", "pi_legacy");
    store.set(key, "not JSON: do not parse this receipt");
    expect(armVerifiedVideoPaymentLead("/thank-you-video", "stripe", "pi_legacy", token("stripe", "pi_legacy"))).toBe(false);
    expect(arm).not.toHaveBeenCalled();
  });
  it.each(KNOWN_INTAKE_RECEIPTS)("legacy video never arms latched intake upgrade after %s disappears", key => {
    store.set(key, "not JSON: do not parse this receipt");
    rememberPaymentLeadProvenance("paypal", "ORDER-legacy"); store.delete(key);
    expect(armVerifiedVideoPaymentLead("/thank-you-video", "paypal", "ORDER-legacy", token("paypal", "ORDER-legacy"))).toBe(false);
    expect(arm).not.toHaveBeenCalled();
  });
  it.each(["sandbox", "test", null])("legacy original token mode %s remains excluded", mode => {
    rememberPaymentLeadProvenance("stripe", "pi_legacy");
    expect(armVerifiedVideoPaymentLead("/thank-you-video", "stripe", "pi_legacy", token("stripe", "pi_legacy", mode))).toBe(false);
    expect(arm).toHaveBeenCalledWith("/thank-you-video", { excluded: true });
  });
  it("legacy malformed/wrong-provider/wrong-ID/wrong-source metadata never arms", () => {
    rememberPaymentLeadProvenance("stripe", "pi_legacy");
    for (const checkoutToken of ["garbage", token("paypal", "pi_legacy"), token("stripe", "pi_other"), token("stripe", "pi_legacy", "live", "/thank-you-video-97")]) {
      expect(armVerifiedVideoPaymentLead("/thank-you-video", "stripe", "pi_legacy", checkoutToken)).toBe(false);
    }
    expect(arm).not.toHaveBeenCalled();
  });
  it.each(["/thank-you2", "/thank-you-video"])("unknown older direct return to %s cannot manufacture standalone provenance", destination => {
    expect(armVerifiedPaymentLead(destination, "stripe", "pi_old", true)).toBe(false);
    expect(arm).toHaveBeenCalledWith(destination, { excluded: true });
  });
  it("WL2 Stripe hooks use SDK succeeded live proof and bound server-success variables; creation only remembers", () => {
    const file = source("client/src/components/home1/WL2StripePaymentForm.tsx");
    const branch = file.slice(file.indexOf('} else if (paymentIntent?.status === "succeeded")'), file.indexOf('} else if (paymentIntent?.status !== "requires_action")'));
    expect(branch).toContain('armVerifiedPaymentLead("/thank-you2", "stripe", paymentIntent.id, paymentIntent.livemode === true)');
    expect(branch.indexOf("armVerifiedPaymentLead")).toBeLessThan(branch.indexOf("confirmPayment.mutate"));
    expect(file).toContain('armVerifiedPaymentLead("/thank-you2", "stripe", variables.paymentIntentId, result.metaLeadLivePayment === true)');
    const created = file.slice(file.indexOf("const createIntent ="), file.indexOf("  useEffect(() =>", file.indexOf("const createIntent =")));
    expect(created).toContain('rememberPaymentLeadProvenance("stripe", data.clientSecret?.split("_secret_")[0])');
    expect(created).not.toContain("armVerified");
    expect(file).not.toMatch(/fbq|fbevents|facebook\.com\/tr/);
  });
  it("WL2 PayPal order creation never counts and approval only invokes existing capture mutation", () => {
    const file = source("client/src/components/home1/WL2PayPalPaymentForm.tsx");
    expect(file).toContain('rememberPaymentLeadProvenance("paypal", data.orderId)');
    expect(file).toContain('if (data.success === true) armVerifiedPaymentLead("/thank-you2", "paypal", variables.orderId, data.metaLeadLivePayment === true)');
    expect(file).toContain('onApprove={({ orderID }) => captureOrder.mutate({ orderId: orderID, paymentId })}');
    expect(file.slice(file.indexOf("export default function"))).not.toContain("armVerified");
    expect(file).not.toMatch(/fbq|fbevents|facebook\.com\/tr/);
  });
  it("WL2 3DS arms after actual confirm success only, not URL status or fallback redirect", () => {
    const file = source("client/src/pages/ThanksPaymentWL2.tsx");
    const callback = file.slice(file.indexOf("onSuccess:"), file.indexOf("onError:"));
    expect(callback).toContain('if (result.success === true) armVerifiedPaymentLead("/thank-you2", "stripe", variables.paymentIntentId, result.metaLeadLivePayment === true)');
    expect(callback.indexOf("armVerifiedPaymentLead")).toBeLessThan(callback.indexOf("window.location.href"));
    expect(file.slice(file.indexOf("  useEffect(() =>"))).not.toContain("armVerified");
    expect(file).not.toMatch(/loadStripe|PayPalScriptProvider|fbq|fbevents|facebook\.com\/tr/);
  });
  it("actual WL2 bank return arms only after verified server confirmation, before the unchanged existing handoff", () => {
    const file = source("client/src/pages/LpWL2.tsx");
    const callback = file.slice(file.indexOf("const confirmThreeDsReturn ="), file.indexOf("  useEffect(() =>", file.indexOf("const confirmThreeDsReturn =")));
    expect(callback).toContain('if (result.success === true) armVerifiedPaymentLead("/thank-you2", "stripe", variables.paymentIntentId, result.metaLeadLivePayment === true)');
    expect(callback.indexOf("armVerifiedPaymentLead")).toBeLessThan(callback.indexOf("handleOneTimePaymentComplete"));
    expect(callback).not.toMatch(/fbq|fbevents|facebook\.com\/tr/);
    expect(file.slice(file.indexOf("const handleOneTimePaymentComplete ="), file.indexOf("const confirmThreeDsReturn ="))).not.toContain("armVerified");
  });
  it.each(["StripePayment", "PaypalPayment", "Checkout"])("legacy %s hooks are only post-authenticated mutation results, never generic completion", kind => {
    const file = source(`client/src/components/masterclass2/VideoVisit${kind}.tsx`);
    expect(file.split("armVerifiedVideoPaymentLead(").slice(1)).toHaveLength(kind === "PaypalPayment" ? 1 : 2);
    for (const fragment of file.split("armVerifiedVideoPaymentLead(").slice(1)) expect(fragment).toMatch(/^result\.redirect_url,/);
    if (kind !== "Checkout") expect(file).toContain("rememberPaymentLeadProvenance(");
    if (kind === "Checkout") expect(file.slice(file.indexOf("const handleCompletion ="), file.indexOf("const handleError ="))).not.toContain("armVerified");
    expect(file).not.toMatch(/fbq|fbevents|facebook\.com\/tr/);
  });
});

describe("offline WL2 authoritative verification preserves provider behavior", () => {
  const stripePayment = { id: 315, landingPage: "/lp/WL2", paymentProvider: "stripe", stripeMode: "live", depositPaymentIntentId: "pi_wl2" };
  const paypalPayment = { id: 416, landingPage: "/lp/WL2", paymentProvider: "paypal", paypalMode: "live", paypalOrderId: "ORDER-WL2" };
  it.each([
    ["live", true, "pi_wl2", true], ["live", false, "pi_wl2", false], ["live", undefined, "pi_wl2", false],
    ["test", true, "pi_wl2", false], ["test", false, "pi_wl2", false], ["live", true, "pi_other", false],
  ])("Stripe original mode=%s live=%s returned-ID=%s optional flag=%s", async (mode, livemode, id, eligible) => {
    mocks.settings.mockResolvedValue({ mode: "test", liveSecretKey: "mock-only", testSecretKey: "mock-only" });
    mocks.getPayment.mockResolvedValue({ ...stripePayment, stripeMode: mode });
    mocks.retrieve.mockResolvedValue({ id, status: "succeeded", livemode, payment_method: "pm_fake" });
    const result = await stripeRouter.createCaller({} as never).confirmWl2OneTimePayment({ paymentId: 315, paymentIntentId: "pi_wl2" });
    expect(result).toEqual({ success: true, ...(eligible ? { metaLeadLivePayment: true } : {}) });
    expect(mocks.retrieve).toHaveBeenCalledTimes(1); expect(mocks.retrieve).toHaveBeenCalledWith("pi_wl2");
    expect(mocks.update).toHaveBeenCalledTimes(1); expect(mocks.update).toHaveBeenCalledWith(315, { stripePaymentMethodId: "pm_fake", remainingAmount: 0, status: "fully_paid" });
    expect(mocks.sendEmail).not.toHaveBeenCalled();
  });
  it.each(["processing", "requires_action", "requires_payment_method"])("Stripe %s keeps original failed-verification behavior", async status => {
    mocks.settings.mockResolvedValue({ mode: "live", liveSecretKey: "mock-only" });
    mocks.getPayment.mockResolvedValue(stripePayment);
    mocks.retrieve.mockResolvedValue({ id: "pi_wl2", status, livemode: true });
    await expect(stripeRouter.createCaller({} as never).confirmWl2OneTimePayment({ paymentId: 315, paymentIntentId: "pi_wl2" })).rejects.toThrow("Payment not confirmed");
    expect(mocks.update).not.toHaveBeenCalled();
  });
  it("Stripe unbound input still fails before a provider request or DB update", async () => {
    mocks.getPayment.mockResolvedValue(stripePayment);
    await expect(stripeRouter.createCaller({} as never).confirmWl2OneTimePayment({ paymentId: 315, paymentIntentId: "pi_other" })).rejects.toThrow("does not match");
    expect(mocks.retrieve).not.toHaveBeenCalled(); expect(mocks.update).not.toHaveBeenCalled();
  });
  it.each([["live", "ORDER-WL2", true], ["sandbox", "ORDER-WL2", false], ["live", "ORDER-other", false], ["sandbox", "CAPTURE-WL2", false]])("PayPal original mode=%s returned-ID=%s optional flag=%s", async (mode, id, eligible) => {
    mocks.paypalSettings.mockResolvedValue({ mode: "sandbox", liveClientId: "mock-only", liveClientSecret: "mock-only", sandboxClientId: "mock-only", sandboxClientSecret: "mock-only" });
    mocks.getPayment.mockResolvedValue({ ...paypalPayment, paypalMode: mode });
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ access_token: "mock-only" })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id, status: "COMPLETED" })));
    vi.stubGlobal("fetch", fetchMock);
    const result = await paypalRouter.createCaller({} as never).captureWl2OneTimeOrder({ paymentId: 416, orderId: "ORDER-WL2" });
    expect(result).toEqual({ success: true, captureId: id, ...(eligible ? { metaLeadLivePayment: true } : {}) });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toBe(`https://api-m${mode === "sandbox" ? ".sandbox" : ""}.paypal.com/v2/checkout/orders/ORDER-WL2/capture`);
    expect(mocks.update).toHaveBeenCalledTimes(1); expect(mocks.update).toHaveBeenCalledWith(416, { paypalOrderId: "ORDER-WL2", remainingAmount: 0, status: "fully_paid" });
    expect(mocks.sendEmail).not.toHaveBeenCalled();
  });
  it.each(["APPROVED", "PENDING"])("PayPal %s is never actual captured success", async status => {
    mocks.paypalSettings.mockResolvedValue({ mode: "live", liveClientId: "mock-only", liveClientSecret: "mock-only" });
    mocks.getPayment.mockResolvedValue(paypalPayment);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ access_token: "mock-only" })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "ORDER-WL2", status }))));
    await expect(paypalRouter.createCaller({} as never).captureWl2OneTimeOrder({ paymentId: 416, orderId: "ORDER-WL2" })).rejects.toThrow("PayPal capture status");
    expect(mocks.update).not.toHaveBeenCalled();
  });
  it("PayPal unbound input still fails before an additional capture request", async () => {
    mocks.getPayment.mockResolvedValue(paypalPayment); const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock);
    await expect(paypalRouter.createCaller({} as never).captureWl2OneTimeOrder({ paymentId: 416, orderId: "ORDER-other" })).rejects.toThrow("does not match");
    expect(fetchMock).not.toHaveBeenCalled(); expect(mocks.update).not.toHaveBeenCalled();
  });
});
