export const INTAKE_SIGNING_TIME = "2026-10-21T19:05:00.000Z";

// A small PNG data URL used only in mocked-route tests. Validation and image-processing
// behavior belong to intakeSigningInput.test.ts; payment tests only need the transport shape.
export const SYNTHETIC_SIGNATURE_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADElEQVR42mNk+M/wHwAF/gL+J1X9AAAAAElFTkSuQmCC";

export type SyntheticIntakeSigning = {
  version: "2026-10";
  signer_name: string;
  relation: string;
  signed_at: string;
  document_checks: {
    glp1: true;
    general: true;
    telehealth: true;
    privacy: true;
    policy: true;
  };
  electronic_agreement: true;
  signature_png: string;
};

/** Complete, top-level free-intake signing envelope with intentionally synthetic values. */
export function syntheticIntakeSigning(
  overrides: Partial<SyntheticIntakeSigning> = {},
): SyntheticIntakeSigning {
  return {
    version: "2026-10",
    signer_name: "Integration TEST ONLY",
    relation: "Self",
    signed_at: INTAKE_SIGNING_TIME,
    document_checks: {
      glp1: true,
      general: true,
      telehealth: true,
      privacy: true,
      policy: true,
    },
    electronic_agreement: true,
    signature_png: SYNTHETIC_SIGNATURE_PNG,
    ...overrides,
  };
}

export const SYNTHETIC_SIGNED_FORM_IDS = [
  "glp1",
  "general",
  "telehealth",
  "privacy",
  "policy",
] as const;

/** Minimal PDFs for mocked services only; PDF content/rendering is covered separately. */
export function syntheticSignedPdfs() {
  return SYNTHETIC_SIGNED_FORM_IDS.map(form => ({
    form,
    title: `Synthetic ${form} signed form`,
    file_name: `Synthetic-${form}.pdf`,
    bytes: Buffer.from(`%PDF-1.4\n% synthetic ${form} signed form\n`, "utf8"),
  }));
}

/** Capability-shaped result returned by the mocked private signed-forms store. */
export function syntheticSignedFormsPreparation() {
  const signed_forms = SYNTHETIC_SIGNED_FORM_IDS.map(form => ({
    form,
    title: `Synthetic ${form} signed form`,
    file_name: `Synthetic-${form}.pdf`,
    url: `https://forms.example.test/api/intake/signed-forms/synthetic-${form}`,
    signed_at: INTAKE_SIGNING_TIME,
    signer_name: "Integration TEST ONLY",
    relation: "Self",
  }));
  const byForm = new Map(signed_forms.map(form => [form.form, form.url]));
  return {
    glp1_consent_url: byForm.get("glp1") ?? null,
    general_consent_url: byForm.get("general") ?? null,
    telehealth_consent_url: byForm.get("telehealth") ?? null,
    privacy_notice_ack_url: byForm.get("privacy") ?? null,
    medication_policy_url: byForm.get("policy") ?? null,
    signed_forms,
  };
}
