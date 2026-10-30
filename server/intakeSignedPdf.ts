import PDFDocument from "pdfkit";
import canonicalForms from "../shared/intakeSignForms.json";

type CanonicalContentBlock =
  | { tag: "h3" | "p"; text: string }
  | { tag: "ul" | "ol"; items: string[] };

type CanonicalForm = {
  id: "glp1" | "general" | "telehealth" | "privacy" | "policy";
  title: string;
  checkbox: string;
  content: CanonicalContentBlock[];
};

export type IntakeSignedPdfInput = {
  submissionId: string;
  patientFullName: string;
  patientDob: string;
  patientLastName: string;
  signerName: string;
  relation: string;
  signedAt: string;
  demo: boolean;
  signaturePng: Buffer;
};

export type IntakeSignedPdf = {
  form: string;
  title: string;
  file_name: string;
  bytes: Buffer;
};

const forms = canonicalForms as CanonicalForm[];
const expectedFormIds = ["glp1", "general", "telehealth", "privacy", "policy"] as const;

const filePrefixes: Record<CanonicalForm["id"], string> = {
  glp1: "GLP-1-Weight-Care-Consent",
  general: "General-Consent-to-Treatment",
  telehealth: "Telehealth-Consent",
  privacy: "Notice-of-Privacy-Practices-Acknowledgment",
  policy: "Medication-Lab-Payment-Shipping-Refund-Policy",
};

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const BODY_TOP = 125;
const BODY_BOTTOM = 704;
const TEAL = "#126C6E";
const INK = "#1E293B";
const MUTED = "#64748B";
const DEMO = "#94A3B8";
const MAX_PDF_BYTES = 2 * 1024 * 1024;

/**
 * Generates the five signed consent PDFs from the canonical intake form source.
 * This module intentionally has no storage, network, or browser responsibilities.
 */
export async function generateIntakeSignedPdfs(
  input: IntakeSignedPdfInput,
): Promise<IntakeSignedPdf[]> {
  assertCanonicalForms();

  const signedAt = parseSignedAt(input.signedAt);
  const easternDate = formatEasternDate(signedAt);
  const fileDate = formatEasternFileDate(signedAt);
  const safeLastName = makeSafeFilenameSegment(input.patientLastName);

  return Promise.all(
    forms.map(async form => {
      const bytes = await renderSignedForm(form, input, signedAt, easternDate);
      if (bytes.length >= MAX_PDF_BYTES) {
        throw new Error(`Generated ${form.id} PDF exceeds the 2 MB size limit.`);
      }

      return {
        form: form.id,
        title: form.title,
        file_name: `${filePrefixes[form.id]}_${safeLastName}_${fileDate}.pdf`,
        bytes,
      };
    }),
  );
}

function assertCanonicalForms(): void {
  const actualIds = forms.map(form => form.id);
  if (
    actualIds.length !== expectedFormIds.length ||
    actualIds.some((id, index) => id !== expectedFormIds[index])
  ) {
    throw new Error("The canonical intake-sign form set does not contain the expected five forms.");
  }
}

function parseSignedAt(value: string): Date {
  const signedAt = new Date(value);
  if (Number.isNaN(signedAt.getTime())) {
    throw new Error("signedAt must be a valid date-time string.");
  }
  return signedAt;
}

function easternParts(date: Date): Record<string, string> {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);

  return Object.fromEntries(
    parts.filter(part => part.type !== "literal").map(part => [part.type, part.value]),
  );
}

function formatEasternDate(date: Date): string {
  const parts = easternParts(date);
  return `${parts.month} ${parts.day}, ${parts.year} at ${parts.hour}:${parts.minute} ${parts.dayPeriod} ET`;
}

function formatEasternFileDate(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts.filter(part => part.type !== "literal").map(part => [part.type, part.value]),
  );
  return `${values.year}-${values.month}-${values.day}`;
}

function makeSafeFilenameSegment(lastName: string): string {
  const safe = lastName
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, 80);
  return safe || "Patient";
}

function renderSignedForm(
  form: CanonicalForm,
  input: IntakeSignedPdfInput,
  signedAt: Date,
  easternDate: string,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: [PAGE_WIDTH, PAGE_HEIGHT],
      margins: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
      bufferPages: true,
      info: {
        Title: form.title,
        Author: "MedMethod Direct",
        Subject: "Electronically signed intake form",
        CreationDate: signedAt,
        ModDate: signedAt,
      },
    });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("error", reject);
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    try {
      let cursorY = BODY_TOP;

      const nextPage = () => {
        doc.addPage();
        cursorY = BODY_TOP;
      };

      const reserve = (height: number) => {
        if (height > BODY_BOTTOM - BODY_TOP) {
          throw new Error("A signed intake PDF block is too tall to fit on one page.");
        }
        if (cursorY + height > BODY_BOTTOM) {
          nextPage();
        }
      };

      const bodyTextHeight = (text: string, width = CONTENT_WIDTH, fontSize = 10.2) => {
        doc.font("Helvetica").fontSize(fontSize);
        return doc.heightOfString(text, { width, lineGap: 2.8 });
      };

      const renderParagraph = (text: string) => {
        const height = bodyTextHeight(text);
        reserve(height + 8);
        doc
          .font("Helvetica")
          .fontSize(10.2)
          .fillColor(INK)
          .text(text, MARGIN, cursorY, { width: CONTENT_WIDTH, lineGap: 2.8 });
        cursorY += height + 8;
      };

      const renderHeading = (text: string) => {
        doc.font("Helvetica-Bold").fontSize(11);
        const height = doc.heightOfString(text, { width: CONTENT_WIDTH, lineGap: 2 });
        // Keep a heading with at least a line of its following content where possible.
        reserve(height + 22);
        doc
          .font("Helvetica-Bold")
          .fontSize(11)
          .fillColor(TEAL)
          .text(text, MARGIN, cursorY, { width: CONTENT_WIDTH, lineGap: 2 });
        cursorY += height + 4;
      };

      const renderList = (items: string[], ordered: boolean) => {
        const markerWidth = 20;
        const itemWidth = CONTENT_WIDTH - markerWidth;

        items.forEach((item, index) => {
          const height = bodyTextHeight(item, itemWidth);
          reserve(height + 4);
          doc
            .font("Helvetica-Bold")
            .fontSize(10.2)
            .fillColor(TEAL)
            .text(ordered ? `${index + 1}.` : "•", MARGIN, cursorY, {
              width: markerWidth - 3,
              lineGap: 2.8,
            });
          doc
            .font("Helvetica")
            .fontSize(10.2)
            .fillColor(INK)
            .text(item, MARGIN + markerWidth, cursorY, {
              width: itemWidth,
              lineGap: 2.8,
            });
          cursorY += height + 4;
        });
        cursorY += 4;
      };

      for (const block of form.content) {
        if (block.tag === "p") {
          renderParagraph(block.text);
        } else if (block.tag === "h3") {
          renderHeading(block.text);
        } else if (block.tag === "ul" || block.tag === "ol") {
          renderList(block.items, block.tag === "ol");
        }
      }

      renderAcknowledgmentAndSignature({
        doc,
        form,
        input,
        easternDate,
        getCursorY: () => cursorY,
        setCursorY: nextY => {
          cursorY = nextY;
        },
        reserve,
      });

      decoratePages(doc, form.title, input.demo);
      doc.end();
    } catch (error) {
      doc.destroy();
      reject(error);
    }
  });
}

function renderAcknowledgmentAndSignature(options: {
  doc: PDFKit.PDFDocument;
  form: CanonicalForm;
  input: IntakeSignedPdfInput;
  easternDate: string;
  getCursorY: () => number;
  setCursorY: (nextY: number) => void;
  reserve: (height: number) => void;
}): void {
  const { doc, form, input, easternDate, getCursorY, setCursorY, reserve } = options;
  const relationship = input.relation.trim();
  const metadata = [
    `Patient name: ${input.patientFullName}`,
    `Date of birth: ${input.patientDob}`,
    `Signer name: ${input.signerName}`,
    ...(relationship ? [`Relation to patient: ${relationship}`] : []),
    `Signed: ${easternDate}`,
  ];
  const acknowledgmentHeight = measureText(doc, form.checkbox, CONTENT_WIDTH - 22, 10.2, 2.8);
  const metadataHeights = metadata.map(line => measureText(doc, line, CONTENT_WIDTH, 10.2, 2.5));
  const electronicRecord = `Signed electronically via MedMethod Direct intake · Submission ID: ${input.submissionId}`;
  const electronicRecordHeight = measureText(doc, electronicRecord, CONTENT_WIDTH, 8.8, 1.8);
  const signatureAreaHeight = 64;
  const totalHeight =
    10 +
    acknowledgmentHeight +
    13 +
    metadataHeights.reduce((sum, height) => sum + height + 3, 0) +
    8 +
    signatureAreaHeight +
    6 +
    electronicRecordHeight;

  // The entire acknowledgement, identity, signature, and submission record moves together.
  reserve(totalHeight);
  let cursorY = getCursorY() + 10;

  doc.rect(MARGIN, cursorY + 1, 11, 11).lineWidth(1).strokeColor(TEAL).stroke();
  doc
    .moveTo(MARGIN + 2.5, cursorY + 6.5)
    .lineTo(MARGIN + 5, cursorY + 9)
    .lineTo(MARGIN + 9, cursorY + 3)
    .lineWidth(1.25)
    .strokeColor(TEAL)
    .stroke();
  doc
    .font("Helvetica")
    .fontSize(10.2)
    .fillColor(INK)
    .text(form.checkbox, MARGIN + 18, cursorY, {
      width: CONTENT_WIDTH - 18,
      lineGap: 2.8,
    });
  cursorY += acknowledgmentHeight + 13;

  for (let index = 0; index < metadata.length; index += 1) {
    doc
      .font("Helvetica")
      .fontSize(10.2)
      .fillColor(INK)
      .text(metadata[index], MARGIN, cursorY, { width: CONTENT_WIDTH, lineGap: 2.5 });
    cursorY += metadataHeights[index] + 3;
  }

  cursorY += 5;
  drawSignature(doc, input.signaturePng, cursorY);
  cursorY += signatureAreaHeight + 6;
  doc
    .font("Helvetica")
    .fontSize(8.8)
    .fillColor(MUTED)
    .text(electronicRecord, MARGIN, cursorY, { width: CONTENT_WIDTH, lineGap: 1.8 });
  cursorY += electronicRecordHeight;
  setCursorY(cursorY);
}

function measureText(
  doc: PDFKit.PDFDocument,
  text: string,
  width: number,
  fontSize: number,
  lineGap: number,
): number {
  doc.font("Helvetica").fontSize(fontSize);
  return doc.heightOfString(text, { width, lineGap });
}

function drawSignature(doc: PDFKit.PDFDocument, signaturePng: Buffer, y: number): void {
  const boxWidth = 230;
  const boxHeight = 60;
  const lineY = y + boxHeight;

  // The white field guarantees a legible signature background even for transparent PNGs.
  doc.save().rect(MARGIN, y, boxWidth, boxHeight).fill("#FFFFFF").restore();
  doc.image(signaturePng, MARGIN, y, {
    fit: [boxWidth, boxHeight],
    valign: "bottom",
  });
  doc
    .moveTo(MARGIN, lineY)
    .lineTo(MARGIN + boxWidth, lineY)
    .lineWidth(0.8)
    .strokeColor(INK)
    .stroke();
}

function decoratePages(doc: PDFKit.PDFDocument, title: string, demo: boolean): void {
  const pageRange = doc.bufferedPageRange();
  for (let index = 0; index < pageRange.count; index += 1) {
    doc.switchToPage(pageRange.start + index);
    const pageNumber = index + 1;

    doc.save();
    if (demo) {
      doc.rect(MARGIN, 18, CONTENT_WIDTH, 21).fill("#F1F5F9");
      doc
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .fillColor(DEMO)
        .text("DEMO - NOT FOR CLINICAL USE", MARGIN, 24, {
          width: CONTENT_WIDTH,
          align: "center",
        });
    }

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor(TEAL)
      .text("MedMethod Direct", MARGIN, 50, { width: CONTENT_WIDTH });
    doc
      .font("Helvetica-Bold")
      .fontSize(13)
      .fillColor(INK)
      .text(title, MARGIN, 72, { width: CONTENT_WIDTH, lineGap: 1 });
    doc
      .moveTo(MARGIN, 110)
      .lineTo(PAGE_WIDTH - MARGIN, 110)
      .lineWidth(0.8)
      .strokeColor(TEAL)
      .stroke();
    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor(MUTED)
      .text(`Page ${pageNumber} of ${pageRange.count}`, MARGIN, 731, {
        width: CONTENT_WIDTH,
        align: "right",
      });
    doc.restore();
  }
}
