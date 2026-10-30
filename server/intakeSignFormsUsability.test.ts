import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const intake = read("client/intake/index.html");
const ui = read("client/public/intake/sign-forms-ui.js");
const css = read("client/public/intake/sign-forms.css");

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

describe("Sign Your Forms usability", () => {
  it("starts every acknowledgement and electronic agreement checked, while retaining individually reversible controls", () => {
    const form = namedFunction(ui, "MmdSignForms");

    expect(form).toContain("var documentChecksState = l.useState(function () {");
    expect(form).toContain("initiallyAccepted[id] = true;");
    expect(form).toContain("var electronicAgreementState = l.useState(true);");
    expect(form).toContain("onChange: function (event) { updateDocumentCheck(document.id, event); }");
    expect(form).toContain("setElectronicAgreement(event.target.checked);");
    expect(form).toContain("next[id] = checked;");
  });

  it("keeps all five acknowledgement controls visible below their closed, button-only document headers", () => {
    const form = namedFunction(ui, "MmdSignForms");

    expect((form.match(/className: "sign-forms-document-toggle"/g) ?? [])).toHaveLength(1);
    expect(form).toContain('"aria-expanded": documentIsOpen');
    expect(form).toContain('className: "sign-forms-checkline sign-forms-document-checkline"');
    expect(form).toContain("hidden: !documentIsOpen");
    expect(form).toContain("M.jsx(MmdSignFormsContent, { content: document.content })");
    expect(form).not.toContain("contentIsVisible");
    expect(form.indexOf('className: "sign-forms-document-toggle"')).toBeLessThan(
      form.indexOf('className: "sign-forms-checkline sign-forms-document-checkline"'),
    );
    expect(form.indexOf('className: "sign-forms-checkline sign-forms-document-checkline"')).toBeLessThan(
      form.indexOf("hidden: !documentIsOpen"),
    );
    expect(form).not.toContain('M.jsx("summary"');
    expect(form).not.toContain('M.jsx("details"');
  });

  it("starts with an empty white manual pad and retains the editable name, optional relation, and readonly Eastern date", () => {
    const form = namedFunction(ui, "MmdSignForms");
    const clearSignature = namedFunction(ui, "clearSignature");

    expect(form).toContain("var signatureState = l.useState(false);");
    expect(form).toContain('context.fillStyle = "#ffffff"');
    expect(clearSignature).toContain('context.fillStyle = "#ffffff"');
    expect(form).toContain("Full name");
    expect(form).toContain("Relation to patient (only if signing for someone else)");
    expect(form).toContain('autoComplete: "name"');
    expect(form).toContain('readOnly: true');
    expect(form).toContain('"aria-readonly": "true"');
    expect(form).toContain("MmdEasternDate(dateNow)");
    expect(css).toMatch(/\.sign-forms-canvas\{[\s\S]*?background:#fff !important;/);
  });

  it("uses one full-width responsive signing column with full-width fields and pad, including a narrow stack", () => {
    expect(css).toMatch(/\.sign-forms\{[\s\S]*?width:100%;[\s\S]*?max-width:760px;/);
    expect(css).toMatch(/\.sign-forms input\[type="text"\]\{[\s\S]*?width:100%;/);
    expect(css).toMatch(/\.sign-forms-canvas\{[\s\S]*?width:100%;/);
    expect(css).toMatch(/\.sign-forms-fields-grid\{[\s\S]*?grid-template-columns:minmax\(0,1fr\);/);
    expect(css).toContain("@media (max-width:720px)");
    expect(intake).toContain(".stage.sign-forms-stage{flex:0 0 auto;width:min(760px,calc(100% - 32px));");
    expect(intake).toContain(".footer.sign-forms-footer{position:static;inset:auto;width:min(760px,calc(100% - 32px));");
    expect(intake).toContain('"stage sign-forms-stage"');
    expect(intake).toContain('"sign-forms-footer"');
  });

  it("keeps invalid Sign Your Forms Continue clickable only to trigger validation, while valid readiness proceeds through the original guard", () => {
    const app = intake.slice(intake.lastIndexOf("function $e()"), intake.lastIndexOf("(0,u.createRoot)"));

    expect(app).toContain("[formsValidationAttempt,setFormsValidationAttempt]=(0,l.useState)(0)");
    expect(app).toContain("validationAttempt:formsValidationAttempt");
    expect(app).toContain('if(screen?.type==="signForms"&&!formsReady&&!submittingRef.current&&!uploadBusy){setFormsValidationAttempt(value=>value+1);return}');
    expect(app).toContain('disabled:submitting||uploadBusy||!canContinue&&!informationOnly&&screen.type!=="signForms"');
    expect(app).toContain('"aria-disabled":screen.type==="signForms"?submitting||uploadBusy||!formsReady:undefined');
    expect(app).toContain('if(!screen||!se(screen,answers,demo)||submittingRef.current||uploadBusy||["signForms","consent"].includes(screen.type)&&!formsReady)return;');

    const form = namedFunction(ui, "MmdSignForms");
    expect(form).toContain("documents, validationAttempt})");
    expect(form).toContain("setValidationVisible(true);");
    expect(form).toContain('className: "sign-forms-validation-message"');
    expect(form).toContain('role: "alert"');
    expect(form).toContain('"aria-invalid": documentIsMissing ? "true" : undefined');
    expect(form).toContain("target.scrollIntoView({behavior: \"smooth\", block: \"center\"});");
  });
});
