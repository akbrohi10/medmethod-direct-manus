import { z } from "zod";
import treatmentCatalog from "../shared/treatmentCatalog.json";

export const INTAKE_SMS_OPT_IN_TEXT = "Yes, I'd like to receive text messages from MedMethod Direct about my care, including appointment reminders, treatment updates, and health information such as lab results. I understand that standard text messages are not encrypted and may be seen by others with access to my phone. Message frequency varies. Message & data rates may apply. Reply STOP to opt out or HELP for help. Consent is not a condition of purchase. See our Terms of Service and Privacy Policy.";
export const VIDEO_VISIT_AMOUNT = "39.00" as const;
export const VIDEO_VISIT_DESCRIPTION = "optional one-time medical-weight-loss Zoom video visit";

const isoTimestamp = z.string().datetime({ offset: true });
const patientSchema = z.object({
  first_name: z.string().trim().min(1).max(100), last_name: z.string().trim().min(1).max(100),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), state: z.string().regex(/^[A-Z]{2}$/),
  state_name: z.string().trim().min(1).max(80), email: z.string().email().max(254),
  phone: z.string().min(10).max(40), sex: z.string().max(40),
});
const consentSchema = z.object({
  terms_accepted: z.literal(true), final_submission_acknowledged: z.literal(true),
  sms_opt_in: z.boolean(), sms_opt_in_at: isoTimestamp.nullable(),
  sms_opt_in_text: z.literal(INTAKE_SMS_OPT_IN_TEXT), contact_preference: z.enum(["sms", "phone_portal"]),
  glp1_consent: z.boolean(), glp1_declined: z.boolean(),
  glp1_consent_at: isoTimestamp, glp1_consent_version: z.literal("2026-10"),
}).refine(c => c.sms_opt_in ? c.sms_opt_in_at !== null && c.contact_preference === "sms" : c.sms_opt_in_at === null && c.contact_preference === "phone_portal", "SMS consent election is inconsistent.")
  .refine(c => c.glp1_consent !== c.glp1_declined, "Please choose the treatment consent option.");
const draftSchema = z.object({
  event: z.literal("mmd_intake.submitted"), schema_version: z.literal("1.0"),
  submission_id: z.string().uuid(), submitted_at: isoTimestamp, is_test: z.boolean(), route: z.literal("weight_care"),
  patient: patientSchema, answers: z.object({ w: z.record(z.string(), z.unknown()) }).strict(),
  consents: consentSchema, meta: z.object({ source: z.literal("mmd-intake-web"), form_version: z.literal("1.2.0") }),
  checkout_preview: z.object({ payment_processed: z.literal(false), card_fields_omitted: z.literal(true) }),
  intake_summary: z.string().min(1).max(60000), intake_summary_html: z.string().min(1).max(90000),
});

export type IntakeDraft = z.infer<typeof draftSchema>;
export type PhoneAttestation = { phone_verified: boolean; phone_verified_at: string | null };
export type VerifiedVideoVisitPayment = {
  provider: "paypal"; environment: "sandbox" | "live"; status: "COMPLETED";
  order_id: string; capture_id: string; amount: typeof VIDEO_VISIT_AMOUNT; currency: "USD"; captured_at: string;
};
export type CompletedFreeIntakeReceipt = {
  submission_id: string;
  submitted_at: string;
  is_test: boolean;
  sms_opt_in: boolean;
  video_visit_interest: boolean;
};

function rejectCardData(value: unknown, depth = 0): void {
  if (depth > 20) throw new Error("The intake payload is too deeply nested.");
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    const name = key.toLowerCase().replace(/[^a-z]/g, "");
    if (["cardnumber", "cardcvv", "cardcvc", "cvv", "cvc", "securitycode", "cardexpiry", "cardexpiration", "billingzip", "cardholdername", "paymenttoken"].includes(name)) {
      throw new Error("Payment card data must stay in the secure PayPal fields.");
    }
    rejectCardData(child, depth + 1);
  }
}

export function validateIntakeDraft(value: unknown): IntakeDraft {
  if (Buffer.byteLength(JSON.stringify(value ?? {}), "utf8") > 180000) throw new Error("This intake is too large to send securely. Please shorten any free-text answers and try again.");
  rejectCardData(value);
  const parsed = draftSchema.safeParse(value);
  if (!parsed.success) throw new Error("The completed intake or consent information is invalid. Please review the form.");
  const draft = parsed.data;
  const selected = draft.answers.w.w04;
  if (typeof selected !== "string") throw new Error("The treatment selection is missing.");
  const option = treatmentCatalog.glp1.options.find(o => o.value === selected);
  // Only the catalog's human-readable name is delivered; pricing is not a clinical answer.
  if (option) {
    const display = treatmentCatalog.glp1.pageDisplays.weightLossIntake[
      selected as keyof typeof treatmentCatalog.glp1.pageDisplays.weightLossIntake
    ];
    draft.answers.w.treatment_interest = display?.name ?? option.name;
  }
  else if (!/not.?sure|recommend|unsure/i.test(selected)) throw new Error("The treatment selection is invalid.");
  for (const key of Object.keys(draft.answers.w)) {
    if (!/^w\d+[A-Za-z]*$/.test(key) && !["ft", "inch", "lb", "wConsent", "wDecline", "treatment_interest"].includes(key)) {
      throw new Error("The Weight Care answer fields are invalid.");
    }
  }
  if (/<(?!\/?b\s*>|br\s*\/?\s*>)/i.test(draft.intake_summary_html)) throw new Error("The intake summary format is invalid.");
  return draft;
}

/** The only full clinical payload. It is sent once a free intake is accepted. */
export function finalizeFreeIntake(
  draft: IntakeDraft,
  phone: PhoneAttestation,
  options: { is_test: boolean; video_visit_interest: boolean },
) {
  return {
    ...draft,
    event: "mmd_intake.free_submitted",
    schema_version: "1.1",
    // Test classification is server-derived from the eligible sandbox demo path.
    is_test: options.is_test,
    patient: { ...draft.patient, ...phone },
    checkout_preview: { payment_processed: false, card_fields_omitted: true },
    care: { intake: "free", payment_required: false, amount: "0.00", currency: "USD" },
    payment: { provider: "none", status: "not_required", amount: "0.00", currency: "USD" },
    ...(options.video_visit_interest ? { video_visit_interest: true } : {}),
  };
}

/**
 * The paid event deliberately contains no draft, patient, answers, or consent data.
 * `event_id` / `submission_id` identify this event, while `related_submission_id`
 * identifies the already-delivered free intake.
 */
export function finalizeVideoVisitPaid(
  receipt: CompletedFreeIntakeReceipt,
  eventId: string,
  payment: VerifiedVideoVisitPayment,
) {
  return {
    event: "mmd_intake.video_visit_paid",
    schema_version: "1.1",
    event_id: eventId,
    submission_id: eventId,
    related_submission_id: receipt.submission_id,
    submitted_at: payment.captured_at,
    is_test: receipt.is_test,
    service: { type: "optional_video_visit", description: VIDEO_VISIT_DESCRIPTION, one_time: true, amount: VIDEO_VISIT_AMOUNT, currency: "USD" },
    payment,
  };
}

/** The family code waives only the optional video service, never the free intake. */
export function finalizeVideoVisitWaived(receipt: CompletedFreeIntakeReceipt, eventId: string) {
  return {
    event: "mmd_intake.video_visit_waived",
    schema_version: "1.1",
    event_id: eventId,
    submission_id: eventId,
    related_submission_id: receipt.submission_id,
    submitted_at: new Date().toISOString(),
    is_test: receipt.is_test,
    service: { type: "optional_video_visit", description: VIDEO_VISIT_DESCRIPTION, one_time: true, amount: "0.00", original_amount: VIDEO_VISIT_AMOUNT, currency: "USD" },
    payment: { provider: "none", status: "waived", amount: "0.00", original_amount: VIDEO_VISIT_AMOUNT, currency: "USD", coupon_type: "family" },
  };
}
