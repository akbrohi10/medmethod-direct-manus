import type { Request } from "express";
import type { IntakeDraft } from "./intakeSubmissionContract";

export type GhlIntakeWebhookPayload = {
  event: "intake_submitted";
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  state: string;
  visit_type: "free_text_visit" | "video_visit";
  sms_opt_in: boolean;
  submitted_at: string;
  source: "website_intake";
  is_test: boolean;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
};

export function normalizeGhlIntakePhone(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  const national = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  return /^\d{10}$/.test(national) ? `+1${national}` : null;
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;
function attribution(request: Pick<Request, "headers" | "query">): Record<typeof UTM_KEYS[number], string> {
  let referrer: URL | undefined;
  const raw = request.headers.referer;
  try { if (typeof raw === "string") referrer = new URL(raw); } catch { /* Absent/malformed attribution is empty. */ }
  const result = {} as Record<typeof UTM_KEYS[number], string>;
  for (const key of UTM_KEYS) {
    const value = request.query?.[key] ?? referrer?.searchParams.get(key);
    result[key] = typeof value === "string" && !/[\u0000-\u001f\u007f]/.test(value) ? value.slice(0, 256) : "";
  }
  return result;
}

/** Do not spread the intake: the GHL event is intentionally a closed contact/status allowlist. */
export function buildGhlIntakeWebhookPayload(
  draft: IntakeDraft,
  options: { isTest: boolean; videoVisitInterest: boolean },
  request: Pick<Request, "headers" | "query">,
): GhlIntakeWebhookPayload | null {
  const phone = normalizeGhlIntakePhone(draft.patient.phone);
  if (!phone) return null;
  return {
    event: "intake_submitted",
    first_name: draft.patient.first_name,
    last_name: draft.patient.last_name,
    email: draft.patient.email,
    phone,
    state: draft.patient.state,
    visit_type: options.videoVisitInterest ? "video_visit" : "free_text_visit",
    sms_opt_in: draft.consents.sms_opt_in,
    submitted_at: draft.submitted_at,
    source: "website_intake",
    is_test: options.isTest,
    ...attribution(request),
  };
}
