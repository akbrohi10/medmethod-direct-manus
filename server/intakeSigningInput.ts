import { z } from "zod";
import sharp from "sharp";
import type { IntakeDraft } from "./intakeSubmissionContract";

export const intakeSigningSchema = z.object({
  version: z.literal("2026-10"),
  signer_name: z.string().trim().min(1).max(200).refine(value => !/[\u0000-\u001f\u007f]/.test(value)),
  relation: z.string().trim().max(150).refine(value => !/[\u0000-\u001f\u007f]/.test(value)).default(""),
  signed_at: z.string().datetime({ offset: true }),
  document_checks: z.object({ glp1: z.literal(true), general: z.literal(true), telehealth: z.literal(true), privacy: z.literal(true), policy: z.literal(true) }).strict(),
  electronic_agreement: z.literal(true),
  signature_png: z.string().min(50).max(720_000).regex(/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/),
}).strict();
export type IntakeSigningInput = z.infer<typeof intakeSigningSchema>;

/** Signature bytes are transient input: never part of a relay payload or browser receipt. */
export async function validateIntakeSigning(value: unknown, draft: IntakeDraft, now = Date.now()) {
  const parsed = intakeSigningSchema.safeParse(value);
  if (!parsed.success) throw new Error("Please complete all five form acknowledgments and sign your forms before submitting.");
  const signing = parsed.data;
  const signedAt = Date.parse(signing.signed_at);
  if (signedAt > now + 5 * 60_000 || signedAt < now - 24 * 60 * 60_000) {
    throw new Error("Your form signature has expired or has an invalid date. Please review and sign again.");
  }
  if (draft.consents.glp1_consent !== true || draft.consents.glp1_declined !== false || draft.answers.w.wConsent !== true || draft.answers.w.wDecline === true) {
    throw new Error("The GLP-1 acknowledgment must agree with your signed forms.");
  }
  const encoded = signing.signature_png.slice("data:image/png;base64,".length);
  const bytes = Buffer.from(encoded, "base64");
  if (bytes.length > 512_000 || bytes.toString("base64") !== encoded || bytes.length < 32 || !bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    throw new Error("Your signature image is invalid. Please clear the pad and sign again.");
  }
  try {
    const image = sharp(bytes, { limitInputPixels: 4_000_000, failOn: "error" });
    const info = await image.metadata();
    if (info.format !== "png" || !info.width || !info.height || info.width < 32 || info.height < 16 || (info.pages ?? 1) > 1) throw new Error("invalid");
    const { data, info: raw } = await image.flatten({ background: "#ffffff" }).greyscale().threshold(180).raw().toBuffer({ resolveWithObject: true });
    let ink = 0, left = raw.width, top = raw.height, right = -1, bottom = -1;
    for (let y = 0; y < raw.height; y++) for (let x = 0; x < raw.width; x++) {
      if (data[y * raw.width + x] < 128) { ink++; left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y); }
    }
    if (ink < 12 || right - left < 4 || ink > raw.width * raw.height * 0.5) throw new Error("invalid");
    // Trim only the blank pad surrounding real ink. Server-produced output is always
    // dark ink on opaque white and contains no client image metadata.
    const signaturePng = await sharp(data, { raw: { width: raw.width, height: raw.height, channels: 1 } })
      .extract({ left, top, width: right - left + 1, height: bottom - top + 1 })
      .resize({ width: 960, height: 180, fit: "inside", withoutEnlargement: true })
      .extend({ top: 3, bottom: 3, left: 3, right: 3, background: "#ffffff" }).png({ compressionLevel: 9 }).toBuffer();
    return { signing, signaturePng };
  } catch {
    throw new Error("A visible signature is required. Please clear the pad and sign again.");
  }
}
