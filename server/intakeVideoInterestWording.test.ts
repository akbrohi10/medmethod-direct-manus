import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(import.meta.dirname, "..");
const intakePath = resolve(repoRoot, "client/intake/index.html");
const intakeSource = readFileSync(intakePath, "utf8");

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
    expect(finish).toContain('answers.videoVisitInterest===true?(0,M.jsxs)("aside",{className:"order-summary panel"');
    expect(finish).toContain('children:"VIDEO VISIT"');
    expect(finish).toContain('children:"$97"');
    expect(finish).toContain('children:"Pay and pick a time after submitting your intake."');
    expect(finish).toContain('):(0,M.jsx)("p",{className:"fine",children:"Your first text visit is FREE and includes 7 days of follow-up messaging. Medication costs extra."})');
    expect(intakeSource).toContain('t.videoVisitInterest===true?`Review & submission`:`Review & free submission`');
    expect(intakeSource).toContain('answers.videoVisitInterest===true?"Submitting your intake...":"Submitting your free intake\\u2026"');
    expect(intakeSource).toContain('answers.videoVisitInterest===true?"Submit Intake & Book Video Visit":"Submit My Free Intake"');
    expect(intakeSource).not.toContain("$39");
    expect(intakeSource).not.toMatch(/Free ongoing|No monthly|Ongoing text-based/i);
  });

  it("does not alter protected submission, verification, or redirect behavior", () => {
    const submitStart = "async function MmdSubmitFreeIntake(";
    const submitEnd = "function MmdStoreFreeIntakeReceipt(";
    expectUnchangedFromHead(submitStart, submitEnd);
    expectUnchangedFromHead(
      "function MmdDemoIdentityVerificationSkipped(",
      "function MmdPhoneVerification({",
    );
    expect(intakeSource).toContain('MmdIntakePhoneReady(answers,demoMode)');
    expect(intakeSource).toContain('MmdPhoneVerificationSatisfied');
    expect(intakeSource).toContain('allowedRedirects=demoSubmission?["/intake/thank-you/?prefill=demo"]:["/thank-you-video","/intake/thank-you/"]');
  });
});
