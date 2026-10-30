import { describe, expect, it } from "vitest";
import {
  EMPTY_INTAKE_UPLOADS,
  INTAKE_SMS_OPT_IN_TEXT,
  finalizeFreeIntake,
  validateIntakeDraft,
  type VerifiedIntakeUploads,
} from "./intakeSubmissionContract";

function syntheticDraft() {
  return {
    event: "mmd_intake.submitted",
    schema_version: "1.0",
    submission_id: "873ef4af-190d-45cb-9d51-42c627f5376a",
    submitted_at: "2026-10-30T15:00:00.000Z",
    is_test: false,
    route: "weight_care",
    patient: {
      first_name: "Synthetic",
      last_name: "Weight Care",
      dob: "1985-01-15",
      state: "GA",
      state_name: "Georgia",
      email: "synthetic-weight-care@example.test",
      phone: "(202) 555-0101",
      sex: "female",
      address_line1: "SYNTHETIC 123 Example Street",
      address_line2: "",
      city: "Atlanta",
      zip: "30301",
    },
    answers: { w: { w04: "compounded_semaglutide", w30: "no" } },
    consents: {
      terms_accepted: true,
      final_submission_acknowledged: true,
      sms_opt_in: false,
      sms_opt_in_at: null,
      sms_opt_in_text: INTAKE_SMS_OPT_IN_TEXT,
      contact_preference: "phone_portal",
      glp1_consent: true,
      glp1_declined: false,
      glp1_consent_at: "2026-10-30T15:00:00.000Z",
      glp1_consent_version: "2026-10",
    },
    meta: { source: "mmd-intake-web", form_version: "1.2.0" },
    checkout_preview: { payment_processed: false, card_fields_omitted: true },
    intake_summary: "SYNTHETIC TEST ONLY — no patient and no charge.",
    intake_summary_html: "<b>SYNTHETIC TEST ONLY — no patient and no charge.</b>",
  };
}

function finalized(draft = validateIntakeDraft(syntheticDraft()), uploads = EMPTY_INTAKE_UPLOADS) {
  return finalizeFreeIntake(
    draft,
    { phone_verified: false, phone_verified_at: null },
    { is_test: false, video_visit_interest: false },
    uploads,
  );
}

const resolvedUploads: VerifiedIntakeUploads = {
  lab_results: [
    { url: "https://private.example.test/lab-1", file_name: "synthetic-lab.pdf", mime_type: "application/pdf" },
    { url: "https://private.example.test/lab-2", file_name: "synthetic-image.jpg", mime_type: "image/jpeg" },
  ],
  lab_results_provided: true,
  lab_result_1_url: "https://private.example.test/lab-1",
  lab_result_2_url: "https://private.example.test/lab-2",
  lab_result_3_url: null,
  lab_result_4_url: null,
  lab_result_5_url: null,
  scale_photo_url: "https://private.example.test/scale",
  scale_photo_provided: true,
};

const uploadId = "A".repeat(32);

describe("Weight Care shipping and private-upload contract", () => {
  it("accepts a complete shipping address and defaults an omitted second address line", () => {
    const withExplicitSecondLine = validateIntakeDraft(syntheticDraft());
    const withoutSecondLine = validateIntakeDraft({
      ...syntheticDraft(),
      patient: { ...syntheticDraft().patient, address_line2: undefined },
    });

    expect(withExplicitSecondLine.patient).toMatchObject({
      address_line1: "SYNTHETIC 123 Example Street",
      address_line2: "",
      city: "Atlanta",
      state: "GA",
      zip: "30301",
    });
    expect(withoutSecondLine.patient.address_line2).toBe("");
  });

  it.each([
    ["address line 1", { address_line1: "" }],
    ["city", { city: "" }],
    ["ZIP", { zip: "3030" }],
    ["non-numeric ZIP", { zip: "30A01" }],
  ])("rejects a missing or invalid %s", (_label, patientChange) => {
    const draft = syntheticDraft();
    expect(() => validateIntakeDraft({
      ...draft,
      patient: { ...draft.patient, ...patientChange },
    })).toThrow("completed intake or consent information is invalid");
  });

  it("accepts only up to five opaque upload references and never browser-supplied attachment URLs", () => {
    const draft = syntheticDraft();
    const valid = validateIntakeDraft({
      ...draft,
      upload_refs: { lab_results: [uploadId, "B".repeat(33)], scale_photo: "C".repeat(34) },
    });

    expect(valid.upload_refs).toEqual({ lab_results: [uploadId, "B".repeat(33)], scale_photo: "C".repeat(34) });
    expect(() => validateIntakeDraft({
      ...draft,
      upload_refs: { lab_results: Array.from({ length: 6 }, (_, index) => String(index).padStart(32, "0")), scale_photo: null },
    })).toThrow("completed intake or consent information is invalid");
    expect(() => validateIntakeDraft({
      ...draft,
      upload_refs: { lab_results: ["https://attacker.example.test/lab.pdf"], scale_photo: null },
    })).toThrow("completed intake or consent information is invalid");
  });

  it("limits normal Weight Care answers to the w-prefixed field family", () => {
    const draft = syntheticDraft();
    expect(validateIntakeDraft(draft).answers.w.w30).toBe("no");
    expect(() => validateIntakeDraft({
      ...draft,
      answers: { w: { ...draft.answers.w, lab_result_6: "synthetic" } },
    })).toThrow("Weight Care answer fields are invalid");
  });

  it("finalizes only server-resolved attachment fields, strips browser references, and writes canonical attachment summaries", () => {
    const source = {
      ...syntheticDraft(),
      upload_refs: { lab_results: [uploadId], scale_photo: "D".repeat(32) },
      intake_summary: "SYNTHETIC TEST ONLY\nLab results uploaded: Yes (12 files)\nScale photo: provided",
      intake_summary_html: "<b>SYNTHETIC TEST ONLY</b><br><b>Lab results uploaded: Yes (12 files)</b><br>Scale photo: provided",
    };
    const output = finalized(validateIntakeDraft(source), resolvedUploads);

    expect(output).not.toHaveProperty("upload_refs");
    expect(JSON.stringify(output)).not.toContain(uploadId);
    expect(output).toMatchObject({
      lab_results: resolvedUploads.lab_results,
      lab_results_provided: true,
      lab_result_1_url: "https://private.example.test/lab-1",
      lab_result_2_url: "https://private.example.test/lab-2",
      lab_result_3_url: null,
      lab_result_4_url: null,
      lab_result_5_url: null,
      scale_photo_url: "https://private.example.test/scale",
      scale_photo_provided: true,
    });
    expect(output.intake_summary).toBe("SYNTHETIC TEST ONLY\nLab results uploaded: Yes (2 files)\nScale photo: provided");
    expect(output.intake_summary_html).toBe("<b>SYNTHETIC TEST ONLY</b><br>Lab results uploaded: Yes (2 files)<br>Scale photo: provided");
  });

  it("always includes empty server attachment fields for a demo or ordinary no-upload completion", () => {
    const draft = validateIntakeDraft(syntheticDraft());
    const output = finalizeFreeIntake(
      draft,
      { phone_verified: false, phone_verified_at: null },
      { is_test: true, video_visit_interest: false },
    );

    expect(output.is_test).toBe(true);
    expect(output).toMatchObject(EMPTY_INTAKE_UPLOADS);
    expect(output.intake_summary).toContain("Lab results uploaded: No");
    expect(output.intake_summary).toContain("Scale photo: not provided");
    expect(output.intake_summary_html).toContain("Lab results uploaded: No");
    expect(output.intake_summary_html).toContain("Scale photo: not provided");
  });
});
