export const INTAKE_RECEIPT_KEY = "mmd_free_intake_receipt";

export interface IntakeVideoReceipt {
  submission_id: string;
  submission_token: string;
  sms_opt_in: boolean;
  video_visit_interest: boolean;
  is_test: boolean;
  payment_status: "NOT_REQUIRED";
}

export function readIntakeVideoReceipt(storage: Pick<Storage, "getItem">): IntakeVideoReceipt | null {
  try {
    const value = JSON.parse(storage.getItem(INTAKE_RECEIPT_KEY) || "null");
    const keys = ["submission_id", "submission_token", "sms_opt_in", "video_visit_interest", "is_test", "payment_status"];
    if (!value || typeof value !== "object" || Array.isArray(value) || Object.keys(value).length !== keys.length || Object.keys(value).some(key => !keys.includes(key))) return null;
    if (typeof value.submission_id !== "string" || !value.submission_id || typeof value.submission_token !== "string" || !value.submission_token) return null;
    if (typeof value.sms_opt_in !== "boolean" || typeof value.video_visit_interest !== "boolean" || typeof value.is_test !== "boolean" || value.payment_status !== "NOT_REQUIRED") return null;
    return value;
  } catch {
    return null;
  }
}

export type IntakeVideoAccess = "available" | "pending" | "paid" | "waived";

/** Only the existing server's receipt-bound status can unlock the calendar. */
export function confirmedIntakeVideoAccess(result: unknown, receipt: IntakeVideoReceipt): IntakeVideoAccess {
  if (!result || typeof result !== "object") throw new Error("Unable to verify your video visit. Please retry; do not make another payment.");
  const value = result as { status?: unknown; completion?: { submission_id?: unknown; payment_status?: unknown; capture_id?: unknown; environment?: unknown; amount?: unknown } };
  if (value.status === "available" || value.status === "pending") return value.status;
  const completion = value.completion;
  if (completion?.submission_id === receipt.submission_id) {
    if (value.status === "paid" && completion.payment_status === "COMPLETED" && typeof completion.capture_id === "string" && completion.capture_id && (completion.environment === "live" || completion.environment === "sandbox")) return "paid";
    if (value.status === "waived" && completion.payment_status === "WAIVED" && completion.amount === "0.00") return "waived";
  }
  throw new Error("Unable to verify your video visit. Please retry; do not make another payment.");
}
