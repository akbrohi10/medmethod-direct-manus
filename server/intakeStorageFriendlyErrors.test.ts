import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Script } from "node:vm";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const intake = readFileSync(resolve(import.meta.dirname, "../client/intake/index.html"), "utf8");
const finalSubmitError = "Something went wrong submitting your intake. Please try again, or call us at (888) 362-7011.";
const attachmentError = "We couldn't upload this attachment. You can continue with your intake and upload it later in your Patient Portal.";
const app = intake.slice(intake.lastIndexOf("function $e()"), intake.lastIndexOf("(0,u.createRoot)"));

function sourceNodes(source: string): ts.Node[] {
  const file = ts.createSourceFile("intake-inline.js", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const nodes: ts.Node[] = [];
  const visit = (node: ts.Node) => { nodes.push(node); ts.forEachChild(node, visit); };
  visit(file);
  return nodes;
}

describe("intake storage failures use safe, non-blocking client messages", () => {
  it("maps upload API/storage errors to the optional-attachment message without weakening local validation", () => {
    const start = intake.indexOf("const MMD_ATTACHMENT_UPLOAD_ERROR=");
    const end = intake.indexOf("function MmdShippingAddress", start);
    const uploads = intake.slice(start, end);

    expect(uploads).toContain(JSON.stringify(attachmentError));
    expect(uploads).toContain("function MmdUploadError(){return MMD_ATTACHMENT_UPLOAD_ERROR}");
    expect(uploads).toContain("You can upload up to 5 lab result files.");
    expect(uploads).toContain("Choose PDF, JPG, PNG, or HEIC files only.");
    expect(uploads).toContain("Each file must be 10 MB or smaller.");
    expect(uploads).toContain("Choose a JPG, PNG, or HEIC image.");
    expect(uploads).toContain("The photo must be 10 MB or smaller.");
    expect(uploads).toContain("d(!1),n(!1)");

    const uploadErrorSource = uploads.slice(0, uploads.indexOf("async function MmdUploadJson"));
    const uploadError = new Function(`${uploadErrorSource};return MmdUploadError;`)() as (error?: unknown) => string;
    expect(uploadError(new Error("database credentials leaked"))).toBe(attachmentError);
    expect(uploadError({ error: "storage timeout" })).toBe(attachmentError);
  });

  it("uses the exact friendly error for every final-submit failure and clears busy state", () => {
    expect(intake).toContain(JSON.stringify(finalSubmitError));
    const inlineScript = intake.match(/<script>([\s\S]*?)<\/script>/)?.[1];
    expect(inlineScript).toBeTruthy();
    expect(() => new Script(inlineScript!)).not.toThrow();

    const catches = sourceNodes(app).filter(ts.isCatchClause).filter(clause => clause.variableDeclaration?.name.getText() === "failure");
    expect(catches).toHaveLength(1);
    const finalCatch = catches[0]!;
    expect(finalCatch.block.getText()).toBe("{setError(MMD_INTAKE_SUBMISSION_ERROR)}");
    expect(app).toContain("}finally{submittingRef.current=false;setSubmitting(false)}return}");
    expect(finalCatch.block.getText()).not.toContain("failure.message");
    expect(finalCatch.block.getText()).not.toContain("Unable to complete your free intake");
  });

  it("keeps the friendly final-submit wrapper scoped away from phone and payment failures", () => {
    expect(intake).toContain("/api/phone-verification/confirm");
    expect(intake).toContain("PayPal did not respond in time. Please try again.");
    expect(app).toContain("Please verify your mobile number before submitting your free intake.");
    expect(app).not.toContain("setError(MMD_INTAKE_SUBMISSION_ERROR);setError(");
  });
});
