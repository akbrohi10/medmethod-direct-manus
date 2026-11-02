import { describe, expect, it } from "vitest";
import type { Request } from "express";
import type { IntakeDraft } from "./intakeSubmissionContract";
import { buildGhlIntakeWebhookPayload, normalizeGhlIntakePhone } from "./ghlIntakeWebhookPayload";

const draft = {
  patient: { first_name: "Synthetic", last_name: "GHLTest", email: "ghl-test@example.invalid", phone: "(202) 555-0188", state: "GA", dob: "1980-01-01", address_line1: "NEVER_SEND_ADDRESS" },
  consents: { sms_opt_in: false }, submitted_at: "2026-11-02T19:00:00.000Z",
  answers: { w: { diagnosis: "NEVER_SEND_HEALTH", treatment_interest: "NEVER_SEND_MEDICATION" } },
  intake_summary: "NEVER_SEND_SUMMARY", lab_results: ["NEVER_SEND_LABS"], signed_forms: ["NEVER_SEND_FORMS"], scale_photo_url: "NEVER_SEND_PHOTO",
} as unknown as IntakeDraft;
const request = (headers = {}, query = {}) => ({ headers, query }) as Pick<Request, "headers" | "query">;
const keys = ["event", "first_name", "last_name", "email", "phone", "state", "visit_type", "sms_opt_in", "submitted_at", "source", "is_test", "utm_source", "utm_medium", "utm_campaign", "utm_content"].sort();

describe("contact/status-only GHL intake payload", () => {
  it.each(["2025550188", "12025550188", "+1 (202) 555-0188"])("normalizes a US phone: %s", phone => expect(normalizeGhlIntakePhone(phone)).toBe("+12025550188"));
  it.each(["555", "+44 2079460958", "112025550188"])("rejects a phone that cannot be represented as a US ten-digit number: %s", phone => expect(normalizeGhlIntakePhone(phone)).toBeNull());
  it("uses exactly the approved keys and no clinical, file, signature or address fields", () => {
    const payload = buildGhlIntakeWebhookPayload(draft, { isTest: true, videoVisitInterest: false }, request())!;
    expect(Object.keys(payload).sort()).toEqual(keys);
    expect(payload).toMatchObject({ event: "intake_submitted", phone: "+12025550188", source: "website_intake", visit_type: "free_text_visit", is_test: true, sms_opt_in: false, utm_source: "", utm_medium: "", utm_campaign: "", utm_content: "" });
    expect(JSON.stringify(payload)).not.toContain("NEVER_SEND");
  });
  it("uses the server's test and visit classification rather than clinical answers", () => {
    expect(buildGhlIntakeWebhookPayload(draft, { isTest: false, videoVisitInterest: true }, request())).toMatchObject({ is_test: false, visit_type: "video_visit" });
  });
  it("takes only the four available UTM fields, ignoring all other referrer data", () => {
    const payload = buildGhlIntakeWebhookPayload(draft, { isTest: true, videoVisitInterest: false }, request({ referer: "https://www.medmethoddirect.com/intake/?utm_source=google&utm_medium=cpc&utm_campaign=fall&utm_content=ad1&health=NEVER_SEND_HEALTH" }));
    expect(payload).toMatchObject({ utm_source: "google", utm_medium: "cpc", utm_campaign: "fall", utm_content: "ad1" });
    expect(JSON.stringify(payload)).not.toContain("NEVER_SEND");
  });
  it("ignores malformed and structured attribution without throwing", () => {
    expect(buildGhlIntakeWebhookPayload(draft, { isTest: true, videoVisitInterest: false }, request({ referer: "bad url" }, { utm_source: ["bad"], utm_campaign: "bad\nvalue" }))).toMatchObject({ utm_source: "", utm_campaign: "" });
  });
});
