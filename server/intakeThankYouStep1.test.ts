import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const baseline = "1e99a10c";
const clientPath = "client/public/intake/video-visit.js";
const thankYouPath = "client/intake/thank-you/index.html";
const source = readFileSync(resolve(root, clientPath), "utf8");
const thankYou = readFileSync(resolve(root, thankYouPath), "utf8");
const baselineFile = (path: string) => execFileSync("git", ["show", `${baseline}:${path}`], { cwd: root, encoding: "utf8" });

const titleCopy = "Check your text messages";
const bodyCopy = "You should have received a text from MedMethod Direct, or you'll receive one shortly. Please reply to our message so we can stay connected!";
const oldTitleCopy = "Use your secure Patient Portal";
const oldBodyCopy = "Because you did not opt in to SMS, use your secure Patient Portal and welcome email for care updates and required forms.";
const oldLoader = '<script src="/intake/video-visit.js?v=intake-video-97-20261027"></script>';
const newLoader = '<script src="/intake/video-visit.js?v=intake-video-97-20261030-step1"></script>';

type Receipt = {
  submission_id: string;
  submission_token: string;
  sms_opt_in: boolean;
  video_visit_interest: boolean;
  is_test: boolean;
  payment_status: "NOT_REQUIRED";
};

type TextNode = { textContent: string };
type ApplySmsCopy = (receipt: Receipt) => void;

function functionSource(name: string, nextName: string) {
  const start = source.indexOf(`  function ${name}(`);
  const end = source.indexOf(`\n\n  function ${nextName}(`, start);
  if (start < 0 || end < 0) throw new Error(`Could not extract ${name}`);
  return source.slice(start, end);
}

function loadApplySmsCopy(nodes = new Map<string, TextNode>()) {
  const document = { getElementById: (id: string) => nodes.get(id) ?? null };
  const context = vm.createContext({ document });
  const harness = `${functionSource("byId", "safeJson")}\n${functionSource("applySmsCopy", "initializePage")}\nglobalThis.applySmsCopy = applySmsCopy;`;
  new vm.Script(harness, { filename: clientPath }).runInContext(context);
  return context.applySmsCopy as ApplySmsCopy;
}

function receipt(sms_opt_in: boolean): Receipt {
  return {
    submission_id: "synthetic-submission-id",
    submission_token: "synthetic-submission-token",
    sms_opt_in,
    video_visit_interest: false,
    is_test: true,
    payment_status: "NOT_REQUIRED",
  };
}

describe("intake thank-you Step 1 SMS copy", () => {
  it("keeps the approved heading and body for both SMS preference states without mutating the receipt", () => {
    const optInTitle = { textContent: titleCopy };
    const optInBody = { textContent: bodyCopy };
    const optInReceipt = receipt(true);
    const optInBefore = JSON.parse(JSON.stringify(optInReceipt));
    loadApplySmsCopy(new Map([
      ["care-message-title", optInTitle],
      ["care-message-copy", optInBody],
    ]))(optInReceipt);
    expect(optInTitle.textContent).toBe(titleCopy);
    expect(optInBody.textContent).toBe(bodyCopy);
    expect(optInReceipt).toEqual(optInBefore);

    const optOutTitle = { textContent: oldTitleCopy };
    const optOutBody = { textContent: oldBodyCopy };
    const optOutReceipt = receipt(false);
    const optOutBefore = JSON.parse(JSON.stringify(optOutReceipt));
    loadApplySmsCopy(new Map([
      ["care-message-title", optOutTitle],
      ["care-message-copy", optOutBody],
    ]))(optOutReceipt);
    expect(optOutTitle.textContent).toBe(titleCopy);
    expect(optOutBody.textContent).toBe(bodyCopy);
    expect(optOutReceipt).toEqual(optOutBefore);
  });

  it("is safe when either Step 1 DOM node is absent", () => {
    const optOutReceipt = receipt(false);
    const before = JSON.parse(JSON.stringify(optOutReceipt));
    expect(() => loadApplySmsCopy()(optOutReceipt)).not.toThrow();
    expect(optOutReceipt).toEqual(before);
  });

  it("keeps the static Step 1 markup exact", () => {
    expect(thankYou).toContain(`<strong id="care-message-title">${titleCopy}</strong><span id="care-message-copy">${bodyCopy}</span>`);
  });

  it("changes only the two authorized client literals from the clean baseline", () => {
    const expected = baselineFile(clientPath)
      .replace(oldTitleCopy, titleCopy)
      .replace(oldBodyCopy, bodyCopy);
    expect(source).toBe(expected);
  });

  it("changes only the thank-you loader cache key from the clean baseline", () => {
    expect(thankYou).toBe(baselineFile(thankYouPath).replace(oldLoader, newLoader));
  });

  it("leaves every other production source unchanged from the clean baseline", () => {
    const changedProductionPaths = execFileSync(
      "git",
      ["diff", "--name-only", baseline, "--", "client", "server", "shared"],
      { cwd: root, encoding: "utf8" },
    )
      .split("\n")
      .filter((path) => path && !path.endsWith(".test.ts"))
      .sort();

    expect(changedProductionPaths).toEqual([thankYouPath, clientPath].sort());
  });
});
