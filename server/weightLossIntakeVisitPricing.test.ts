import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const landing = readFileSync(resolve(root, "client/weight-loss-intake.html"), "utf8");
const baseline = execFileSync(
  "git",
  ["show", "83a2d916:client/weight-loss-intake.html"],
  { cwd: root, encoding: "utf8" },
);

// Temporary manifest content is embedded here so this historical inverse guard stays self-contained.
const APPROVED_REPLACEMENTS = [
  [
    "Ongoing care by secure text is free. Optional Zoom video visits: $39 each. Medication costs extra.",
    "Your first text visit is FREE and includes 7 days of follow-up messaging. Additional text visits are $29 each. Video visits are $97. Medication costs extra.",
  ],
  [
    "Ongoing doctor care by secure text is free.",
    "Your first text visit with a doctor is FREE.",
  ],
  [
    "<summary>Is ongoing text-based care free?</summary><p>Yes. Ongoing asynchronous doctor follow-up by secure text is free, not just the first conversation. Medication costs are separate, and a prescription is not guaranteed. Optional Zoom video visits with a doctor specializing in medical weight loss cost $39 per visit one time; purchase after the free intake and arrange the appointment after payment.</p>",
    "<summary>How much does it cost?</summary><p>Your first text visit is FREE and includes 7 days of follow-up messaging. Additional text visits are $29 each, and video visits are $97. Medication costs extra if prescribed.</p>",
  ],
  [
    "No. Video is optional and is not required to submit the intake. You can begin with free ongoing asynchronous doctor follow-up by secure text; your doctor typically responds within a few hours. A physician may still determine that an evaluation by video is clinically needed. If you choose an optional Zoom video visit, it costs $39 per visit one time; purchase the upgrade after the free intake, then arrange the appointment after payment.",
    "No. Video is optional and is not required to submit the intake. Your first text visit is FREE and includes 7 days of follow-up messaging; your doctor typically responds within a few hours. A physician may still determine that an evaluation by video is clinically needed. Video visits are $97. You pay after submitting your free intake, then choose your time.",
  ],
  [
    "Optional Zoom video visits with a doctor specializing in medical weight loss cost $39 per visit, one time; purchase after the free intake and arrange the appointment after payment.",
    "Video visits are $97. You pay after submitting your free intake, then choose your time.",
  ],
  ["Secure text care is free", "Your first text visit is free"],
  [
    "Complete your intake, then connect with your doctor for ongoing asynchronous follow-up about your GLP-1 options and health goals.",
    "Complete your intake, then connect with your doctor by text about your GLP-1 options and health goals.",
  ],
  [
    "Use a secure care thread for ongoing questions and physician follow-up.",
    "Use text to ask questions and get physician follow-up for 7 days after your visit.",
  ],
  ["with ongoing support", "with follow-up support"],
  ["but the ongoing relationship", "but the relationship"],
  ["Secure text", "Text"],
  ["secure text", "text"],
] as const;

const EXPECTED_SOURCE_COUNTS = [1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 4] as const;

function applyApprovedReplacements(html: string) {
  return APPROVED_REPLACEMENTS.reduce(
    (updated, [source, replacement]) => updated.replaceAll(source, replacement),
    html,
  );
}

describe("Approved weight-loss intake visit pricing copy", () => {
  it("is exactly the baseline document after the approved ordered replacements only", () => {
    let expected = baseline;
    for (const [[source, replacement], sourceCount] of APPROVED_REPLACEMENTS.map((pair, index) => [
      pair,
      EXPECTED_SOURCE_COUNTS[index],
    ] as const)) {
      expect(expected.split(source).length - 1).toBe(sourceCount);
      expected = expected.replaceAll(source, replacement);
    }
    expect(applyApprovedReplacements(baseline)).toBe(expected);
    expect(landing).toBe(expected);
  });

  it("removes superseded visit-pricing language from the landing document case-insensitively", () => {
    for (const superseded of [/\$39/i, /ongoing/i, /per visit/i, /secure text/i]) {
      expect(landing).not.toMatch(superseded);
    }
  });
});
