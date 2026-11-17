export type IntakeCorrectionContact = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

/** Separate event: never reuse/spread the original intake or add clinical/attribution fields. */
export function buildGhlIntakePhoneCorrectionPayload(
  contact: IntakeCorrectionContact,
  submissionId: string,
  timestamp: string,
  isTest: boolean,
) {
  return {
    event: "phone_corrected" as const,
    submission_id: submissionId,
    first_name: contact.first_name,
    last_name: contact.last_name,
    email: contact.email,
    phone: contact.phone,
    tags: ["phone-corrected"],
    timestamp,
    source: "website_intake" as const,
    is_test: isTest,
  };
}
