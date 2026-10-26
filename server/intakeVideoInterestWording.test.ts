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
  it("keeps the exact free branch and conditionally presents the $39 wording", () => {
    const pricing = fragment("function He({answers})", "})}var Ue=[]");
    expect(pricing).toContain('answers.videoVisitInterest===true');
    expect(pricing).toContain('videoVisitInterest?"$39":"FREE"');
    expect(pricing).toContain('videoVisitInterest?"Zoom video visit \\xB7 Ongoing text-based care included":"Ongoing text-based doctor care \\xB7 No commitment"');
    expect(pricing).toContain('videoVisitInterest?"Your Zoom video visit: $39 (paid after you submit)":"Optional Zoom video visits: $39 per visit"');

    const review = fragment("function qe({answers,onChangeMedication})", "})}function Xe({");
    expect(review).toContain('videoVisitInterest?"Zoom video visit $39 + ongoing text-based care":"FREE — no monthly fee or commitment"');
    expect(review).toContain('...(videoVisitInterest?["Meet Dr. Al-Deek face-to-face on Zoom - $39"]:[])');

    const finish = fragment("function MmdIntakeFinish({", "}\nfunction $e(){");
    expect(finish).toContain('answers.videoVisitInterest===true?(0,M.jsxs)("aside",{className:"order-summary panel"');
    expect(finish).toContain('children:"ZOOM VIDEO VISIT"');
    expect(finish).toContain('children:"$39"');
    expect(finish).toContain('children:"Paid on the next page, after you submit. Ongoing text-based care included."');
    expect(finish).toContain('):(0,M.jsx)("p",{className:"fine",children:"Your intake and ongoing text-based care are free. Medication costs are separate."})');

    expect(intakeSource).toContain('t.videoVisitInterest===true?`Review & submission`:`Review & free submission`');
    expect(intakeSource).toContain('answers.videoVisitInterest===true?"Submitting your intake...":"Submitting your free intake\\u2026"');
    expect(intakeSource).toContain('answers.videoVisitInterest===true?"Submit Intake & Book Video Visit":"Submit My Free Intake"');
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
