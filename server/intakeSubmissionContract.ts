import { z } from "zod";
import treatmentCatalog from "../shared/treatmentCatalog.json";

export const INTAKE_SMS_OPT_IN_TEXT = "Yes, I'd like to receive text messages from MedMethod Direct about my care, including appointment reminders, treatment updates, and health information such as lab results. I understand that standard text messages are not encrypted and may be seen by others with access to my phone. Message frequency varies. Message & data rates may apply. Reply STOP to opt out or HELP for help. Consent is not a condition of purchase. See our Terms of Service and Privacy Policy.";
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
export type VerifiedIntakePayment = {
  provider: "paypal"; environment: "sandbox" | "live"; status: "COMPLETED";
  order_id: string; capture_id: string; amount: "49.00"; currency: "USD"; captured_at: string;
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
  // The recommendation option has no medication price; preserve its current text.
  if (option) draft.answers.w.treatment_interest = option.name;
  else if (!/not.?sure|recommend|unsure/i.test(selected)) throw new Error("The treatment selection is invalid.");
  for (const key of Object.keys(draft.answers.w)) {
    if (!/^w\d+[A-Za-z]*$/.test(key) && !["ft", "inch", "lb", "wConsent", "wDecline", "treatment_interest"].includes(key)) {
      throw new Error("The Weight Care answer fields are invalid.");
    }
  }
  if (/<(?!\/?b\s*>|br\s*\/?\s*>)/i.test(draft.intake_summary_html)) throw new Error("The intake summary format is invalid.");
  return draft;
}
export function finalizePaidIntake(draft: IntakeDraft, phone: PhoneAttestation, payment: VerifiedIntakePayment) {
  return { ...draft, event: "mmd_intake.paid_submitted", schema_version: "1.1", is_test: payment.environment === "sandbox" || draft.is_test,
    patient: { ...draft.patient, ...phone }, checkout_preview: { payment_processed: true, card_fields_omitted: true }, payment };
}
export function finalizeWaivedIntake(draft: IntakeDraft, phone: PhoneAttestation) {
  return { ...draft, event: "mmd_intake.waived_submitted", schema_version: "1.1", patient: { ...draft.patient, ...phone },
    checkout_preview: { payment_processed: false, card_fields_omitted: true },
    payment: { provider: "none", method: "coupon", mode: "waived", amount: "0.00", currency: "USD", status: "waived", original_amount: "49.00", coupon_type: "family" } };
}
