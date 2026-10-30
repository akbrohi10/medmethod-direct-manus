import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import canonicalForms from "../shared/intakeSignForms.json";
import { generateIntakeSignedPdfs } from "./intakeSignedPdf";

const pdfTextAvailable = existsSync("/usr/bin/pdftotext");
const outputDir = mkdtempSync(join(tmpdir(), "signed-intake-pdfs-"));
const darkSignaturePng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAACAAAAAMCAIAAACMdijuAAAAGUlEQVR4nGMQsXGjKWIYtWDUglELRi0gjABdfeEBi8LodQAAAABJRU5ErkJggg==",
  "base64",
);

const input = {
  submissionId: "submission-abc-123",
  patientFullName: "Ada Lovelace",
  patientDob: "December 10, 1815",
  patientLastName: "O'Neil / Example",
  signerName: "Ada Lovelace",
  relation: "Self",
  signedAt: "2026-10-30T16:45:00.000Z",
  demo: true,
  signaturePng: darkSignaturePng,
};

function extractText(path: string): string {
  return execFileSync("pdftotext", ["-layout", path, "-"], { encoding: "utf8" });
}

function normalizedText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

afterAll(() => {
  rmSync(outputDir, { recursive: true, force: true });
});

describe("generateIntakeSignedPdfs", () => {
  it("renders all five canonical forms with valid, bounded signed PDF outputs", async () => {
    const generated = await generateIntakeSignedPdfs(input);

    expect(generated.map(pdf => pdf.form)).toEqual([
      "glp1",
      "general",
      "telehealth",
      "privacy",
      "policy",
    ]);
    expect(generated.map(pdf => pdf.title)).toEqual(
      canonicalForms.map(form => form.title),
    );
    expect(generated.map(pdf => pdf.file_name)).toEqual([
      "GLP-1-Weight-Care-Consent_ONeilExample_2026-10-30.pdf",
      "General-Consent-to-Treatment_ONeilExample_2026-10-30.pdf",
      "Telehealth-Consent_ONeilExample_2026-10-30.pdf",
      "Notice-of-Privacy-Practices-Acknowledgment_ONeilExample_2026-10-30.pdf",
      "Medication-Lab-Payment-Shipping-Refund-Policy_ONeilExample_2026-10-30.pdf",
    ]);

    for (const pdf of generated) {
      expect(pdf.bytes.subarray(0, 5).toString("ascii")).toBe("%PDF-");
      expect(pdf.bytes.length).toBeGreaterThan(1_000);
      expect(pdf.bytes.length).toBeLessThan(2 * 1024 * 1024);
      writeFileSync(join(outputDir, pdf.file_name), pdf.bytes);
    }
  });

  it.skipIf(!pdfTextAvailable)(
    "keeps canonical body text before the final signed acknowledgement block on every document",
    async () => {
      const generated = await generateIntakeSignedPdfs(input);

      for (const [index, pdf] of generated.entries()) {
        const form = canonicalForms[index];
        const path = join(outputDir, pdf.file_name);
        writeFileSync(path, pdf.bytes);
        const text = extractText(path);
        const normalized = normalizedText(text);
        const info = execFileSync("pdfinfo", [path], { encoding: "utf8" });
        const firstBodyText = form.content[0].tag === "ul" || form.content[0].tag === "ol"
          ? form.content[0].items[0]
          : form.content[0].text;
        const lastBlock = form.content.at(-1);
        const lastBodyText = lastBlock && (lastBlock.tag === "ul" || lastBlock.tag === "ol")
          ? lastBlock.items.at(-1)
          : lastBlock?.text;
        const acknowledgement = form.checkbox;
        const electronicRecord =
          "Signed electronically via MedMethod Direct intake · Submission ID: submission-abc-123";

        const pageCount = Number(info.match(/Pages:\s+(\d+)/)?.[1]);
        expect(pageCount).toBeGreaterThan(0);
        expect(text).toContain("MedMethod Direct");
        expect(text.split("\f").filter(Boolean)).toHaveLength(pageCount);
        expect((text.match(/DEMO - NOT FOR CLINICAL USE/g) ?? [])).toHaveLength(pageCount);
        expect(normalized).toContain(normalizedText(firstBodyText));
        expect(normalized).toContain(normalizedText(lastBodyText ?? ""));
        expect(normalized).toContain(normalizedText(acknowledgement));
        expect(normalized).toContain("Patient name: Ada Lovelace");
        expect(normalized).toContain("Date of birth: December 10, 1815");
        expect(normalized).toContain("Signer name: Ada Lovelace");
        expect(normalized).toContain("Relation to patient: Self");
        expect(normalized).toContain("Signed: October 30, 2026 at 12:45 PM ET");
        expect(normalized).toContain(normalizedText(electronicRecord));

        expect(normalized.indexOf(normalizedText(firstBodyText))).toBeLessThan(
          normalized.indexOf(normalizedText(lastBodyText ?? "")),
        );
        expect(normalized.indexOf(normalizedText(lastBodyText ?? ""))).toBeLessThan(
          normalized.indexOf(normalizedText(acknowledgement)),
        );
        expect(normalized.indexOf(normalizedText(acknowledgement))).toBeLessThan(
          normalized.indexOf(normalizedText(electronicRecord)),
        );
      }
    },
  );

  it("omits an empty relationship instead of rendering a blank relationship line", async () => {
    const [pdf] = await generateIntakeSignedPdfs({ ...input, relation: "   ", demo: false });
    const path = join(outputDir, "empty-relation.pdf");
    writeFileSync(path, pdf.bytes);

    if (pdfTextAvailable) {
      const text = extractText(path);
      expect(text).not.toContain("Relation to patient:");
      expect(text).not.toContain("DEMO - NOT FOR CLINICAL USE");
    }
  });

  it("rejects an invalid signedAt value before creating PDFs", async () => {
    await expect(
      generateIntakeSignedPdfs({ ...input, signedAt: "not-a-date" }),
    ).rejects.toThrow("signedAt must be a valid date-time string.");
  });

  it("uses a stable fallback segment when the last name has no filename-safe characters", async () => {
    const [pdf] = await generateIntakeSignedPdfs({ ...input, patientLastName: "***" });
    expect(pdf.file_name).toBe("GLP-1-Weight-Care-Consent_Patient_2026-10-30.pdf");
  });
});
