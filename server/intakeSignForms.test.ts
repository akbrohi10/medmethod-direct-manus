import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

type ContentBlock = {
  tag: "h3" | "p" | "ul" | "ol";
  text?: string;
  items?: string[];
};
type SignFormDocument = {
  id: "glp1" | "general" | "telehealth" | "privacy" | "policy";
  title: string;
  checkbox: string;
  content: ContentBlock[];
  linkLabel?: string;
};
type Glp1Section = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  defaultOpen: boolean;
};
type CanonicalFixture = {
  checkboxes: Record<SignFormDocument["id"], string>;
  sourceCopy: Record<"general" | "telehealth" | "privacy", string>;
  glp1: Glp1Section[];
  policy: ContentBlock[];
};

const root = resolve(import.meta.dirname, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const intake = read("client/intake/index.html");
const dataSource = read("client/public/intake/sign-forms-data.js");
const uiSource = read("client/public/intake/sign-forms-ui.js");
const cssSource = read("client/public/intake/sign-forms.css");
const fixture = JSON.parse(read("server/fixtures/intake-sign-forms-copy.json")) as CanonicalFixture;

const documents = new Function("window", `${dataSource}; return window.MmdSignFormDocuments;`)({}) as SignFormDocument[];

function normalizedSourceCopy(value: string): string {
  // Source PDFs number the two General Consent list items. Numbering itself is
  // presentational; every word and punctuation mark remains part of the comparison.
  return value
    .replace(/(^|\n)\s*\d+\.\s+/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function documentText(document: SignFormDocument): string {
  return document.content
    .map(block => block.text ?? (block.items ?? []).join(" "))
    .join(" ");
}

function documentById(id: SignFormDocument["id"]): SignFormDocument {
  const document = documents.find(candidate => candidate.id === id);
  if (!document) throw new Error(`Missing ${id} sign-form document.`);
  return document;
}

function glp1Blocks(source: Glp1Section[]): ContentBlock[] {
  return source.flatMap(section => [
    { tag: "h3" as const, text: section.title },
    ...section.paragraphs.map(text => ({ tag: "p" as const, text })),
    ...(section.bullets ? [{ tag: "ul" as const, items: section.bullets }] : []),
  ]);
}

function namedFunction(source: string, name: string): string {
  const start = source.lastIndexOf(`function ${name}(`);
  expect(start, `Expected ${name} to remain a named standalone helper.`).toBeGreaterThanOrEqual(0);
  let parameterDepth = 0;
  let braceStart = -1;
  for (let index = source.indexOf("(", start); index < source.length; index += 1) {
    if (source[index] === "(") parameterDepth += 1;
    if (source[index] === ")") parameterDepth -= 1;
    if (parameterDepth === 0) {
      braceStart = source.indexOf("{", index);
      break;
    }
  }
  expect(braceStart, `Expected ${name} to have a function body.`).toBeGreaterThanOrEqual(0);
  let depth = 0;
  for (let index = braceStart; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  throw new Error(`Unable to extract ${name}.`);
}

function componentSource(name: string): string {
  const start = intake.lastIndexOf(`function ${name}(`);
  expect(start, `Expected ${name} in the intake client.`).toBeGreaterThanOrEqual(0);
  const next = intake.indexOf("function ", start + name.length + 10);
  return intake.slice(start, next === -1 ? undefined : next);
}

function builderSource(): string {
  return namedFunction(intake, "be");
}

const expectedCheckboxes = [
  "I have read and understand the GLP-1 Weight Care Consent, including the risks, and I consent to evaluation for GLP-1 treatment.",
  "I have read and agree to the General Consent to Treatment.",
  "I have read and agree to the Telehealth Consent.",
  "I acknowledge that I received the Notice of Privacy Practices.",
  "I have read this policy and understand that if medication or lab tests are ordered for me, payment is required before my order is sent to the pharmacy, and that prescription orders are final once submitted and are not eligible for return or refund except as described in this policy.",
] as const;

describe("Weight Care Sign Your Forms", () => {
  it("uses precisely the five source documents and their five acknowledgement labels", () => {
    expect(documents.map(document => document.id)).toEqual(["glp1", "general", "telehealth", "privacy", "policy"]);
    expect(documents.map(document => document.checkbox)).toEqual(expectedCheckboxes);
    expect(documents.map(document => document.checkbox)).toEqual([
      fixture.checkboxes.glp1,
      fixture.checkboxes.general,
      fixture.checkboxes.telehealth,
      fixture.checkboxes.privacy,
      fixture.checkboxes.policy,
    ]);
    expect(documents).toHaveLength(5);
    expect(documentById("privacy").linkLabel).toBe("Read the full Notice of Privacy Practices");
  });

  it("preserves every canonical General, Telehealth, and Privacy source-copy word and punctuation", () => {
    for (const id of ["general", "telehealth", "privacy"] as const) {
      expect(normalizedSourceCopy(documentText(documentById(id)))).toBe(normalizedSourceCopy(fixture.sourceCopy[id]));
    }
  });

  it("derives the GLP-1 document from the complete original GLP-1 object and retains the six-section policy", () => {
    expect(documentById("glp1").content).toEqual(glp1Blocks(fixture.glp1));
    expect(documentById("policy").content).toEqual(fixture.policy);
    expect(documentById("policy").content.filter(block => block.tag === "h3").map(block => block.text)).toEqual([
      "1. Medication Orders & Payment",
      "2. Pharmacy Fulfillment & Shipping",
      "3. Delivery Address, Tracking & Patient Responsibility",
      "4. Temperature-Sensitive Medications",
      "5. Damaged, Incorrect, Missing, Lost or Compromised Shipments",
      "6. Medication Returns, Exchanges & Refunds",
    ]);
  });

  it("keeps only approved public placeholders and no print, test-patient, or source-PDF artifacts", () => {
    const publicCopy = documents.map(documentText).join("\n");
    expect(publicCopy.match(/\[[A-Z][A-Z /]+\]/g)).toEqual([
      "[EFFECTIVE DATE]",
      "[PRIVACY OFFICER NAME / EMAIL / PHONE]",
    ]);
    expect(publicCopy).not.toMatch(/Bary Test|Test MMD|10\/20\/2026|09\/08\/2026|md-hq\.com\/demo/i);
    expect(JSON.stringify(fixture)).not.toMatch(/demo\.patient@example\.com|123 Demo Street|Bary Test|Test MMD/i);
    expect(`${dataSource}\n${uiSource}`).not.toMatch(/window\.print|print\s*\(|toBlob|FileReader|application\/pdf|\.pdf\b/i);
  });

  it("is an isolated, Hotjar-suppressed UI: it sends and stores nothing, and exposes its PNG only through the transient signing callback", () => {
    const form = namedFunction(uiSource, "MmdSignForms");
    expect(uiSource).toContain('"data-hj-suppress": "true"');
    expect(uiSource).toContain('"data-hj-suppress": "true",\n                    onChange');
    expect(uiSource).toContain('"data-hj-suppress": "true",\n                onPointerDown');
    expect(uiSource).not.toMatch(/\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB|document\.cookie|navigator\.sendBeacon/i);
    expect(uiSource).not.toMatch(/toBlob|FileReader|Blob\s*\(|FormData\s*\(/i);
    expect(form).toContain("var signingCallbackRef = l.useRef(onSigningChange)");
    expect(form).toContain('signaturePng = canvas.toDataURL("image/png")');
    expect(form).toContain("callback(null)");
    expect(form).toContain('version: "2026-10"');
    expect(form).toContain("signer_name: signatureName.trim()");
    expect(form).toContain("relation: relationship.trim()");
    expect(form).toContain("signed_at: signedAtRef.current");
    expect(form).toContain("document_checks: {");
    expect(form).toContain("glp1: true,");
    expect(form).toContain("general: true,");
    expect(form).toContain("telehealth: true,");
    expect(form).toContain("privacy: true,");
    expect(form).toContain("policy: true");
    expect(form).toContain("electronic_agreement: true");
    expect(form).toContain("signature_png: signaturePng");
  });

  it("requires every document acknowledgement, electronic agreement, nonblank editable name, and a real manual signature", () => {
    const form = namedFunction(uiSource, "MmdSignForms");
    const signatureMotion = namedFunction(uiSource, "continueSignature");

    expect(form).toContain("var allDocumentsAccepted = glpConsent && generalConsent && telehealthConsent && privacyConsent && policyConsent;");
    expect(form).toContain("Boolean(signatureName.trim()) && allDocumentsAccepted && electronicAgreement && hasSignature");
    expect(form).toContain("Full name");
    expect(form).toContain("Relation to patient (only if signing for someone else)");
    expect(form).toContain('autoComplete: "name"');
    expect(form).toContain("nameEditedRef.current = true");
    expect(form).toContain("patientName = patientName || \"\"");
    expect(form).toContain("I agree to sign electronically, and my electronic signature is as valid as a handwritten one.");
    expect(form.match(/setHasSignature\(true\)/g)).toHaveLength(1);
    expect(signatureMotion).toContain("distanceFromStart < 4");
    expect(signatureMotion).toContain("if (!drawing.started)");
    expect(signatureMotion).toContain("setHasSignature(true)");
    expect(namedFunction(uiSource, "clearSignature")).toContain("setHasSignature(false)");
  });

  it("uses a read-only Eastern calendar date on both sides of a UTC date boundary", () => {
    const easternDate = namedFunction(uiSource, "MmdEasternDate");
    const easternDateParts = namedFunction(uiSource, "MmdEasternDateParts");
    const nextEasternMidnight = namedFunction(uiSource, "MmdNextEasternMidnight");
    const api = new Function(`${easternDate}\n${easternDateParts}\n${nextEasternMidnight}\nreturn { MmdEasternDate, MmdNextEasternMidnight };`)() as {
      MmdEasternDate: (value: string) => string;
      MmdNextEasternMidnight: (value: string) => Date;
    };

    // 00:30 UTC is still the preceding calendar day in New York; 04:30 UTC is
    // the new Eastern day after midnight during daylight-saving time.
    expect(api.MmdEasternDate("2026-10-30T00:30:00.000Z")).toBe("10/29/2026");
    expect(api.MmdEasternDate("2026-10-30T04:30:00.000Z")).toBe("10/30/2026");
    expect(api.MmdNextEasternMidnight("2026-10-30T03:59:59.000Z").toISOString()).toBe("2026-10-30T04:00:00.000Z");
    expect(uiSource).toContain('timeZone: "America/New_York"');
    expect(uiSource).toContain("readOnly: true");
    expect(uiSource).toContain('"aria-readonly": "true"');
  });

  it("paints and keeps the signature canvas white, including in dark color-scheme mode", () => {
    const resizeCanvas = uiSource.slice(uiSource.indexOf("function resizeCanvas()"), uiSource.indexOf("resizeSignatureCanvasRef.current", uiSource.indexOf("function resizeCanvas()")));
    const clearSignature = namedFunction(uiSource, "clearSignature");
    expect(resizeCanvas).toContain('context.fillStyle = "#ffffff"');
    expect(resizeCanvas).toContain("context.fillRect(0, 0, cssWidth, cssHeight)");
    expect(clearSignature).toContain('context.fillStyle = "#ffffff"');
    expect(clearSignature).toContain("context.fillRect(0, 0, canvas.width, canvas.height)");
    expect(cssSource).toMatch(/\.sign-forms-canvas\{[\s\S]*?color-scheme:light;[\s\S]*?background:#fff !important;/);
    expect(cssSource).toMatch(/@media \(prefers-color-scheme:dark\)\{[\s\S]*?\.sign-forms-canvas\{background:#fff !important;/);
  });

  it("wires Sign Your Forms immediately before final review, removes the legacy Ze view, sends the in-memory signing envelope only at submission, and keeps be() byte-for-byte unchanged", () => {
    const flow = namedFunction(intake, "MmdIntakeFlowScreens");
    expect(flow).toContain(".flatMap(");
    expect(flow).toContain('screen.type==="consent"?[{id:"wSignForms",route:"w",type:"signForms"');
    expect(flow).toContain("},screen]:[screen]");

    expect(intake).toMatch(/src="\/intake\/sign-forms-data\.js(?:\?[^\"]*)?"/);
    expect(intake).toMatch(/src="\/intake\/sign-forms-ui\.js(?:\?[^\"]*)?"/);
    expect(intake).toMatch(/href="\/intake\/sign-forms\.css(?:\?[^\"]*)?"/);
    expect(intake.indexOf('src="/intake/sign-forms-ui.js')).toBeLessThan(intake.indexOf("window.MmdCreateSignForms(l,M)"));
    expect(intake).toContain("window.MmdCreateSignForms(l,M)");
    expect(intake).toContain("window.MmdSignFormDocuments");

    const screenRenderer = componentSource("Qe");
    expect(screenRenderer).not.toContain("Consent to Telehealth");
    expect(screenRenderer).toContain("Terms of Service");
    expect(screenRenderer).toContain("Privacy Policy");

    const finish = componentSource("MmdIntakeFinish");
    expect(finish).not.toMatch(/\bZe\b/);

    const app = intake.slice(intake.lastIndexOf("function $e()"), intake.lastIndexOf("(0,u.createRoot)"));
    expect(app).toContain('[formsReady,setFormsReady]=(0,l.useState)(false)');
    expect(app).toContain("signingPayloadRef=(0,l.useRef)(null)");
    expect(app).toContain("const onSigningChange=signing=>{signingPayloadRef.current=signing}");
    expect(app).toContain('screen.type==="signForms"?(0,M.jsx)(MmdSignForms');
    expect(app).toContain("onReadyChange:setFormsReady");
    expect(app).toContain("onSigningChange:onSigningChange");
    expect(app).toContain('onGlpConsentChange:checked=>onValue("wConsent",checked)');
    expect(app).toContain('screen.type==="signForms"?formsReady:screen.type==="consent"?formsReady&&MmdIntakeFinishReady');
    expect(app).toContain('screen.type!=="signForms"&&!["checkoutAck","phoneVerificationSettings"].includes(key))setFormsReady(false)');
    expect(app).toContain('navigate(formsReady?returnScreen:"wSignForms")');

    const submit = namedFunction(intake, "MmdSubmitFreeIntake");
    expect(submit).toContain("signing");
    expect(submit).toMatch(/JSON\.stringify\(\{[^}]*signing/);

    const builder = builderSource();
    expect(builder).toContain("glp1_consent:t.wConsent===!0");
    expect(builder).not.toMatch(/signature|formsReady|signForms|electronicAgreement|relationship/i);
    expect(createHash("sha256").update(builder).digest("hex")).toBe("59a3ec57205a52cf44fa62e906aa522c7b4ab26a7f5815e652079b810a03ead3");
  });
});
