import { execFileSync } from "node:child_process"; import { createHash as metaLeadScopeCreateHash } from "node:crypto"; import { gunzipSync as metaLeadScopeGunzipSync } from "node:zlib"; import { metaLeadConversionsHistoricalSource, metaLeadConversionsApprovedInventory, metaLeadConversionsNeedsInverse, META_LEAD_CONVERSIONS_SOURCE_PATHS } from "./fixtures/metaLeadConversionsScope"; const metaLeadConversionsHelperSHA = "d34479c6329419bf251177058890f3ac1bbb2d8fd943685846528c717b98afcc"; import { beforeMetaSchedule, metaScheduleApprovedInventory } from "./fixtures/metaScheduleScope"; const metaScheduleHelperSHA = "b9687e0da13457a07b541655bef530808eacdd6c465a50c5104e967625b5c613";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(import.meta.dirname, "..");
const intakePath = resolve(repoRoot, "client/intake/index.html");
const intakeSource = metaLeadConversionsHistoricalSource(intakePath, beforeMetaSchedule(intakePath, readFileSync(intakePath, "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));

function fragment(start: string, end: string) {
  const index = intakeSource.indexOf(start);
  expect(index, `missing ${start}`).toBeGreaterThanOrEqual(0);
  const tail = intakeSource.indexOf(end, index);
  expect(tail, `missing ${end} after ${start}`).toBeGreaterThan(index);
  return intakeSource.slice(index, tail + end.length);
}

function expectUnchangedFromHead(start: string, end: string) {
  const currentStart = intakeSource.indexOf(start);
  const currentEnd = intakeSource.indexOf(end, currentStart);
  expect(currentStart, `missing ${start}`).toBeGreaterThanOrEqual(0);
  expect(currentEnd, `missing ${end} after ${start}`).toBeGreaterThan(currentStart);
  const headSource = execFileSync("git", ["show", "HEAD:client/intake/index.html"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  const headStart = headSource.indexOf(start);
  const headEnd = headSource.indexOf(end, headStart);
  expect(headStart, `HEAD missing ${start}`).toBeGreaterThanOrEqual(0);
  expect(headEnd, `HEAD missing ${end} after ${start}`).toBeGreaterThan(headStart);
  expect(intakeSource.slice(currentStart, currentEnd)).toBe(headSource.slice(headStart, headEnd));
}

function expectSubmitChangedOnlyForSigningTransport() {
  const start = "async function MmdSubmitFreeIntake(";
  const end = "function MmdStoreFreeIntakeReceipt(";
  const currentStart = intakeSource.indexOf(start);
  const currentEnd = intakeSource.indexOf(end, currentStart);
  expect(currentStart, `missing ${start}`).toBeGreaterThanOrEqual(0);
  expect(currentEnd, `missing ${end} after ${start}`).toBeGreaterThan(currentStart);
  const headSource = execFileSync("git", ["show", "HEAD:client/intake/index.html"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  const headStart = headSource.indexOf(start);
  const headEnd = headSource.indexOf(end, headStart);
  expect(headStart, `HEAD missing ${start}`).toBeGreaterThanOrEqual(0);
  expect(headEnd, `HEAD missing ${end} after ${start}`).toBeGreaterThan(headStart);
  const current = intakeSource.slice(currentStart, currentEnd);
  expect(current).toContain("route,answers,demoMode=false,signing=null");
  expect(current).toContain("signing:signing");
  expect(current.replace(",signing=null", "").replace(",signing:signing", "")).toBe(
    headSource.slice(headStart, headEnd),
  );
}

describe("intake video-visit interest wording", () => {
  it("uses the $97 pay-per-visit model while retaining the free first-text-visit branch", () => {
    const pricing = fragment("function He({answers})", "})}var Ue=[]");
    expect(pricing).toContain('answers.videoVisitInterest===true');
    expect(pricing).toContain('videoVisitInterest?"$97":"FREE"');
    expect(pricing).toContain('videoVisitInterest?"Video visit · $97":"First text visit · FREE with 7 days of follow-up messaging"');
    expect(pricing).toContain('"Additional text visits are $29 each"');
    expect(pricing).toContain('videoVisitInterest?"Your video visit: $97 (pay after you submit)":"Optional video visits are $97"');

    const review = fragment("function qe({answers,onChangeMedication})", "})}function Xe({");
    expect(review).toContain('videoVisitInterest?"Video visit $97":"First text visit FREE — includes 7 days of follow-up messaging"');
    expect(review).toContain('...(videoVisitInterest?["Meet Dr. Al-Deek face-to-face by video - $97"]:[])');

    const finish = fragment("function MmdIntakeFinish({", "}\nfunction $e(){");
    expect(finish).not.toContain('className:"order-summary panel"');
    expect(finish).not.toContain('children:"VIDEO VISIT"');
    expect(finish).not.toContain('MmdShippingUploadReview');
    expect(finish).toContain('id:"mmd-free-intake-ack",type:"checkbox",checked:answers.checkoutAck===true');
    expect(finish).toContain('onChange:event=>onValue("checkoutAck",event.target.checked)');
    expect(finish).toContain('children:"I confirm my information is accurate and consent to submit it for clinical review."');
    expect(intakeSource).toContain('MmdIntakeSubmitScreen(screen)&&(0,M.jsx)(MmdIntakeFinish,{answers,onValue})');
    expect(intakeSource).toContain('className:"patient-submit-note",children:answers.videoVisitInterest===true?"You\'ll pay $97 and pick your time on the next page.":"Watch for a text from us after you submit."');
    expect(intakeSource).toContain('t.videoVisitInterest===true?`Review & submission`:`Review & free submission`');
    expect(intakeSource).toContain('answers.videoVisitInterest===true?"Submitting your intake...":"Submitting your free intake\\u2026"');
    expect(intakeSource).toContain('MmdIntakeSubmitScreen(screen)?answers.videoVisitInterest===true?"Submit & book my video visit":"Submit & start my free visit"');
    expect(intakeSource).not.toContain("$39");
    expect(intakeSource).not.toMatch(/Free ongoing|No monthly|Ongoing text-based/i);
  });

  it("does not alter protected submission, verification, or redirect behavior", () => {
    expectSubmitChangedOnlyForSigningTransport();
    expectUnchangedFromHead(
      "function MmdDemoIdentityVerificationSkipped(",
      "function MmdPhoneVerification({",
    );
    expect(intakeSource).toContain('MmdIntakePhoneReady(answers,demoMode)');
    expect(intakeSource).toContain('MmdPhoneVerificationSatisfied');
    expect(intakeSource).toContain('allowedRedirects=demoSubmission?["/intake/thank-you/?prefill=demo"]:["/thank-you-video","/intake/thank-you/"]');
  });
});
