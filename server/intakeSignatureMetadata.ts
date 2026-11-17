import { z } from "zod";

export const INTAKE_TYPED_SIGNATURE_STYLES = ["dancing_script", "great_vibes", "homemade_apple"] as const;
export type IntakeSignatureStyle = (typeof INTAKE_TYPED_SIGNATURE_STYLES)[number];
export type IntakeSignatureAudit = {
  signature_method?: "drawn" | "typed";
  typed_name?: string;
  signature_style?: IntakeSignatureStyle;
};

const auditSchema = z.object({
  signature_method: z.enum(["drawn", "typed"]).optional(),
  typed_name: z.string().trim().min(1).max(200).refine(value => !/[\u0000-\u001f\u007f]/.test(value)).optional(),
  signature_style: z.enum(INTAKE_TYPED_SIGNATURE_STYLES).optional(),
}).strict();

/** No metadata is valid legacy drawn input; typed fields must be complete and identity-bound. */
export function validatedIntakeSignatureAudit(value: IntakeSignatureAudit, signerName: string): IntakeSignatureAudit {
  const parsed = auditSchema.safeParse({
    ...(value.signature_method !== undefined ? { signature_method: value.signature_method } : {}),
    ...(value.typed_name !== undefined ? { typed_name: value.typed_name } : {}),
    ...(value.signature_style !== undefined ? { signature_style: value.signature_style } : {}),
  });
  if (!parsed.success) throw new Error("Signed-form signature metadata is invalid.");
  const audit = parsed.data;
  if (audit.signature_method === "typed") {
    if (!audit.typed_name || !audit.signature_style || audit.typed_name !== signerName.trim()) {
      throw new Error("The typed signature name and style must match the signer name.");
    }
  } else if (audit.typed_name !== undefined || audit.signature_style !== undefined) {
    throw new Error("Typed signature metadata requires the typed signature method.");
  }
  return audit;
}
