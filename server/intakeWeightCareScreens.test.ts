import { readFileSync } from "node:fs"; import { createHash as metaLeadScopeCreateHash } from "node:crypto"; import { gunzipSync as metaLeadScopeGunzipSync } from "node:zlib"; import { metaLeadConversionsHistoricalSource, metaLeadConversionsApprovedInventory, metaLeadConversionsNeedsInverse, META_LEAD_CONVERSIONS_SOURCE_PATHS } from "./fixtures/metaLeadConversionsScope"; const metaLeadConversionsHelperSHA = "d34479c6329419bf251177058890f3ac1bbb2d8fd943685846528c717b98afcc";
import { resolve } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const intake = metaLeadConversionsHistoricalSource("../client/intake/index.html", readFileSync(resolve(import.meta.dirname, "../client/intake/index.html"), "utf8"), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));
function component(name: string) {
  const start = intake.indexOf(`function ${name}(`);
  const end = intake.indexOf("function ", start + 10);
  expect(start).toBeGreaterThanOrEqual(0);
  return intake.slice(start, end);
}

describe("Weight Care lab, shipping, and scale screens", () => {
  it("keeps every inline intake script syntactically valid", () => {
    for (const match of intake.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
      const source = ts.createSourceFile("intake.js", match[1], ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
      expect((source as unknown as { parseDiagnostics: unknown[] }).parseDiagnostics).toEqual([]);
    }
  });

  it("uses six-month labs and places required shipping then optional scale immediately before notes", () => {
    expect(intake).toContain("Have you had any lab tests within the past 6 months?");
    expect(intake).not.toContain("Have you had any lab tests within the past 12 months?");
    const shipping = intake.indexOf('"id":"wShippingAddress"');
    const scale = intake.indexOf('"id":"wScalePhoto"');
    const notes = intake.indexOf('"id":"w38"');
    expect(shipping).toBeGreaterThan(0);
    expect(scale).toBeGreaterThan(shipping);
    expect(notes).toBeGreaterThan(scale);
    expect(intake.slice(shipping, scale)).toContain('"required":true');
    expect(intake.slice(scale, notes)).toContain('"required":false');
  });

  it("keeps shipping fields autofillable and suppressed, with editable canonical state and a five-digit ZIP", () => {
    const shipping = component("MmdShippingAddress");
    for (const value of ["Street address", "Apt, suite, unit", "City", "ZIP code", "shipping address-line1", "shipping address-line2", "shipping address-level2", "shipping address-level1", "shipping postal-code", "'data-hj-suppress':!0", "y.map(e=>(0,M.jsx)(`option`,{children:e},e))", "onChange:e=>t(`state`,e.target.value)"]) {
      expect(shipping).toContain(value);
    }
    expect(shipping).not.toContain("readOnly:!0");
    expect(shipping).toContain("Only used if Dr. Al-Deek prescribes medication for you. Nothing ships — and nothing is charged — until you’ve approved your plan first.");
    expect(shipping).toContain("Choose your state here. We’ll use it on your identity form.");
    expect(intake).toContain('/^\\d{5}$/.test(String(t.wAddressZip??``))');
  });

  it("accepts the requested lab/photo types and does not accept PDF as a scale image", () => {
    const start = intake.indexOf("function MmdUploadExtension");
    const end = intake.indexOf("async function MmdUploadPrivateFile", start);
    const helpers = new Function(`${intake.slice(start, end)}; return {MmdUploadAllowed,MmdUploadAccept};`)() as {
      MmdUploadAllowed: (file: { name: string; type?: string }, kind: string) => boolean;
      MmdUploadAccept: (kind: string) => string;
    };
    for (const extension of ["jpg", "png", "heic", "pdf"]) {
      expect(helpers.MmdUploadAllowed({ name: `synthetic.${extension}` }, "lab")).toBe(true);
    }
    for (const extension of ["jpg", "png", "heic"]) {
      expect(helpers.MmdUploadAllowed({ name: `synthetic.${extension}` }, "scale")).toBe(true);
    }
    expect(helpers.MmdUploadAllowed({ name: "synthetic.pdf", type: "application/pdf" }, "scale")).toBe(false);
    expect(helpers.MmdUploadAllowed({ name: "synthetic.svg", type: "image/svg+xml" }, "lab")).toBe(false);
    expect(helpers.MmdUploadAccept("lab")).toContain(".pdf,.jpg,.jpeg,.png,.heic");
  });

  it("uses private references only, empty demo uploads, transient file-input handling, and a real Skip callback", () => {
    const uploads = intake.slice(intake.indexOf("function MmdUploadError"), intake.indexOf("function MmdShippingUploadReview"));
    expect(uploads).not.toMatch(/FileReader|createObjectURL|localStorage|sessionStorage|indexedDB|data:image/);
    expect(uploads).toContain("Array.from(e.target.files??[])");
    expect(uploads).toContain("if(g.size>10485760)");
    expect(intake).toContain("labUploadRefs:[],scaleUploadRef:null");
    expect(intake).toContain("upload_refs:{lab_results:");
    const scale = component("MmdScalePhoto");
    expect(scale).toContain("onSkip:v");
    expect(scale).toContain("if(!u){h();v?.()}");
    expect(scale).toContain("try{e&&(await MmdDeletePrivateUpload(e,!0),t(null));");
    expect(scale).toContain("'data-hj-suppress':!0");
    expect(scale).toContain("/api/intake/assets/scale-example.jpg");
    expect(intake).toContain("onSkipScale:onContinue");
  });

  it("retains private shipping and upload review data without repeating the removed review on the final acknowledgment footer", () => {
    const review = component("MmdShippingUploadReview");
    expect(review).toContain("'data-hj-suppress':true");
    for (const label of ["Your shipping address", "Lab results uploaded:", "Scale photo:"]) expect(review).toContain(label);
    const finish = component("MmdIntakeFinish");
    expect(finish).not.toContain("MmdShippingUploadReview");
    expect(finish).toContain('id:"mmd-free-intake-ack"');
    expect(finish).toContain('checked:answers.checkoutAck===true,onChange:event=>onValue("checkoutAck",event.target.checked)');
    expect(intake).toContain('MmdIntakeSubmitScreen(screen)&&(0,M.jsx)(MmdIntakeFinish,{answers,onValue})');
  });
});
