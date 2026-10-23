import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";

const intake = readFileSync(resolve(import.meta.dirname, "../client/intake/index.html"), "utf8");
const phoneStart = intake.indexOf("function MmdDemoIdentityVerificationSkipped(");
const phoneEnd = intake.indexOf("async function MmdPhoneVerificationApi", phoneStart);
const finishStart = intake.indexOf("function MmdIntakePhoneReady(");
const finishEnd = intake.indexOf("function MmdIntakeFinish({", finishStart);
const submitStart = intake.indexOf("async function MmdSubmitFreeIntake");
const submitEnd = intake.indexOf("var Ae=", submitStart);
const consent = { type: "consent" };
const valid = { wConsent: true, wDecline: false, checkoutAck: true, contactValid: true, phoneVerificationSettings: { mode: "live", required: true, demo_available: false } };

function helpers(search: string) {
  const request = vi.fn().mockResolvedValue({ submission_id: "synthetic-only", submission_token: "synthetic-only-token", is_test: true, payment_status: "NOT_REQUIRED", redirect_url: search === "?prefill=demo" ? "/intake/thank-you/?prefill=demo" : "/intake/thank-you/" });
  const build = vi.fn((_route, _answers, _source, demo) => ({ is_test: demo }));
  const source = `${intake.slice(phoneStart, phoneEnd)};${intake.slice(finishStart, finishEnd)};${intake.slice(submitStart, submitEnd)};return { MmdIntakePhoneReady, MmdIntakeFinishReady, MmdLivePhoneVerificationToken, MmdSubmitFreeIntake };`;
  const api = new Function("window", "URLSearchParams", "x", "se", "Te", "be", source)(
    { location: { search } }, URLSearchParams, () => [{ type: "checkout" }],
    (screen: { type: string }, answers: Record<string, unknown>) => screen.type === "consent" ? answers.wConsent === true && answers.wDecline !== true : answers.checkoutAck === true && answers.contactValid === true,
    request, build,
  );
  return { api, request, build };
}

describe("explicit demo final-step mobile verification skip", () => {
  it("allows exact demo finishing under live settings without inventing phone attestation", () => {
    const { api } = helpers("?prefill=demo");
    expect(api.MmdIntakePhoneReady(valid, true)).toBe(true);
    expect(api.MmdIntakeFinishReady(consent, valid, true)).toBe(true);
    expect(api.MmdLivePhoneVerificationToken(valid)).toBeNull();
    expect(valid).not.toHaveProperty("phoneVerified");
  });

  it.each(["", "?prefill=Demo", "?prefill=true", "?demo=true", "?prefill=demo&prefill=other", "?prefill=demo&prefill=demo"])("requires verification for non-exact or ambiguous query %s", search => {
    const { api } = helpers(search);
    expect(api.MmdIntakePhoneReady(valid, true)).toBe(false);
    expect(api.MmdIntakeFinishReady(consent, valid, true)).toBe(false);
  });

  it("requires initialized demo flag and all existing consent/accuracy/contact checks", () => {
    const { api } = helpers("?theme=dark&prefill=demo");
    expect(api.MmdIntakePhoneReady(valid, false)).toBe(false);
    for (const key of ["wConsent", "checkoutAck", "contactValid"]) expect(api.MmdIntakeFinishReady(consent, { ...valid, [key]: false }, true)).toBe(false);
    expect(api.MmdIntakeFinishReady(consent, { ...valid, wDecline: true }, true)).toBe(false);
  });

  it("retains normal valid-token completion and expiration enforcement", () => {
    const { api } = helpers("");
    const verified = { ...valid, phoneVerified: true, phoneVerificationToken: "SYNTHETIC-ONLY", phoneVerificationExpiresAt: Date.now() + 60000 };
    expect(api.MmdIntakeFinishReady(consent, verified, false)).toBe(true);
    expect(api.MmdIntakeFinishReady(consent, { ...verified, phoneVerificationExpiresAt: Date.now() - 1 }, false)).toBe(false);
  });

  it("uses the explicit test request path, is_test builder flag and null token only for demo", async () => {
    const { api, request, build } = helpers("?prefill=demo");
    const result = await api.MmdSubmitFreeIntake("w", valid, true);
    expect(request.mock.calls[0][0]).toBe("/api/intake/submit?prefill=demo");
    expect(JSON.parse(request.mock.calls[0][1].body)).toMatchObject({ intake: { is_test: true }, demo_mode: true, phone_verification_token: null });
    expect(build).toHaveBeenCalledWith("w", valid, "mmd-intake-web", true);
    expect(result.is_test).toBe(true);
    expect(result.redirect_url).toBe("/intake/thank-you/?prefill=demo");
  });

  it("accepts the demo thank-you query only for the exact approved demo request", async () => {
    const { api } = helpers("?prefill=demo");
    await expect(api.MmdSubmitFreeIntake("w", valid, false)).rejects.toThrow("could not be confirmed");
    expect(intake).toContain('const allowedRedirects=demoSubmission?["/intake/thank-you/?prefill=demo"]:["/thank-you-video","/intake/thank-you/"]');
  });

  it.each(["", "?prefill=Demo", "?prefill=demo&prefill=other"])("never sends the explicit test route for %s", async search => {
    const { api, request } = helpers(search);
    await api.MmdSubmitFreeIntake("w", valid, true);
    expect(request.mock.calls[0][0]).toBe("/api/intake/submit");
    expect(JSON.parse(request.mock.calls[0][1].body)).toMatchObject({ intake: { is_test: false }, demo_mode: false });
  });
});
