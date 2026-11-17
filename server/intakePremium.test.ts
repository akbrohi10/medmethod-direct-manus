import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import vm from "node:vm";

const root = resolve(import.meta.dirname, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const hash = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
const fixture = JSON.parse(read("server/intakePremiumScope.fixture.json")) as {
  baseline: Record<string, string>;
  unchanged: Record<string, string>;
  changes: { path: string; before: string; after: string; count: number; positions: number[] }[];
};
const source = read("client/public/intake/premium-ui.js");
const css = read("client/public/intake/premium.css");
const page = read("client/intake/index.html");
function undo(path: string) {
  let result = read(path);
  for (const change of [...fixture.changes].reverse()) {
    if (change.path !== path) continue;
    for (const position of [...change.positions].reverse()) {
      expect(result.slice(position, position + change.after.length)).toBe(change.after);
      result = result.slice(0, position) + change.before + result.slice(position + change.after.length);
    }
  }
  return result;
}
function runtime() {
  const context = { window: {} as Record<string, any>, MutationObserver: class {} };
  vm.runInNewContext(source, context);
  const jsx = (type: any, props: any) => typeof type === "function" ? type(props) : { type, props };
  const JSX = { jsx, jsxs: jsx };
  const React = { Fragment: "fragment", useState: (value: any) => [value, () => {}], useRef: () => ({ current: null }), useEffect: () => {} };
  return { context, JSX, React };
}
function text(node: any): string {
  if (node == null || node === false) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(text).join("");
  return text(node.props?.children);
}

describe("Weight Care intake premium presentation", () => {
  it("reconstructs every existing touched source byte exactly after removing approved presentation substitutions", () => {
    for (const [path, expected] of Object.entries(fixture.baseline)) expect(hash(undo(path))).toBe(expected);
  });
  it("keeps payment, phone, uploads, consent PDFs, webhooks, questionnaire progress and routing byte unchanged", () => {
    for (const [path, expected] of Object.entries(fixture.unchanged)) expect(hash(readFileSync(resolve(root, path)))).toBe(expected);
  });
  it("keeps all data-hj-suppress markers intact in the inline intake source", () => {
    expect(page.match(/data-hj-suppress/g)).toEqual(undo("client/intake/index.html").match(/data-hj-suppress/g));
    expect(read("client/public/intake/glp1-screens.js")).toContain('"data-hj-suppress": true');
  });
  it("preserves question-heading text exactly while adding a short italic accent", () => {
    const { context, JSX } = runtime();
    for (const original of ["Which treatment are you interested in?", "Your GLP-1 history", "Have you had any lab tests within the past 6 months?", "Last step: where should Dr. Al-Deek text you?", "A few important safety questions", "Anything else you would like to share with the doctor?"]) {
      const node = context.window.MmdPremiumHeading(JSX, original);
      expect(text(node)).toBe(original);
      expect(node.props.children[1].type).toBe("em");
      expect(node.props.children[1].props.children.trim().split(/\s+/).length).toBeLessThanOrEqual(3);
    }
  });
  it("renders the approved $29 welcome without initializing the clinical app or collecting any data", () => {
    const { context, JSX, React } = runtime();
    let mounts = 0;
    const Component = context.window.MmdCreatePremiumIntake(React, JSX, () => { mounts++; return null; });
    const output = text(Component());
    expect(mounts).toBe(0);
    for (const copy of ["DOCTOR-GUIDED WEIGHT CARE", "Start your weight care visit with Dr. Al-Deek", "$29", "one-time", "Includes 7 days of follow-up messaging with your doctor", "Full refund if Dr. Al-Deek determines you're not a candidate", "Start my assessment"]) expect(output).toContain(copy);
    expect(output.toLowerCase()).not.toContain("free");
    expect(source).not.toMatch(/fetch\(|sessionStorage|localStorage|sendBeacon|fbq\(|hj\(|identify\(/);
  });
  it("retains original server-confirmed no-payment intake and optional $97 video contracts", () => {
    expect(page).toContain('result.payment_status!=="NOT_REQUIRED"');
    expect(page).toContain('"/thank-you-video","/intake/thank-you/"');
    expect(page).toContain('"Submit & book my video visit"');
    expect(page).toContain('"Submit & start my text visit"');
    expect(read("server/intakeSubmissionContract.ts")).toContain('VIDEO_VISIT_AMOUNT = "97.00"');
    expect(read("client/public/intake/video-visit.js")).toContain('const VIDEO_VISIT_AMOUNT = "97.00"');
  });
  it("uses only self-hosted normal and italic Fraunces and Inter with swap", () => {
    expect(css.match(/font-display:swap/g)).toHaveLength(3);
    for (const file of ["fraunces-500.woff2", "fraunces-500-italic.woff2", "inter-variable.woff2"]) {
      expect(readFileSync(resolve(root, "client/public/intake/fonts", file)).subarray(0, 4).toString()).toBe("wOF2");
    }
    for (const path of ["client/intake/index.html", "client/intake/thank-you/index.html"]) expect(read(path)).not.toMatch(/fonts\.googleapis\.com|fonts\.gstatic\.com/);
  });
  it("has the exact green tokens, AA-friendly typography, compact controls and reduced-motion fallback", () => {
    for (const token of ["--ink:#113a3a", "--accent:#0e7c7b", "--accent-tint:#e8f4f3", "--bg:#faf9f7", "--surface:#fff", "--muted:#5f6b6a", "--line:#e3e8e6"]) expect(css).toContain(token);
    expect(css).not.toMatch(/#(?:e8339e|f[0-9a-f]2c[0-9a-f]{2})\b|\bpink\b|\bberry\b/i);
    expect(css).toContain("font-size:28px!important");
    expect(css).toContain("font-size:34px!important");
    expect(css).toContain("prefers-reduced-motion:reduce");
    expect(css).toContain("outline:2px solid var(--accent)");
  });
  it("keeps conditional progress computation and uses a percentage-only segmented presentation", () => {
    expect(css).toContain("mask-image:repeating-linear-gradient");
    expect(hash(read("client/public/intake/progress.js"))).toBe(fixture.unchanged["client/public/intake/progress.js"]);
    expect(source).not.toMatch(/step_number|aria-valuenow|MmdCreateIntakeProgress/);
  });
  it("retains all thank-you control IDs and operational script while changing only pricing display and shell", () => {
    const path = "client/intake/thank-you/index.html", after = read(path), before = undo(path);
    expect(after.match(/\bid="[^"]+"/g)).toEqual(before.match(/\bid="[^"]+"/g));
    expect(after.match(/<script[^>]+src="[^"]+"[^>]*>/g)).toEqual(before.match(/<script[^>]+src="[^"]+"[^>]*>/g));
    expect(after).not.toMatch(/free intake/i);
    expect(after).toContain("Payment is only for the optional $97 video visit.");
    expect(after).toContain('id="video-checkout" aria-labelledby="checkout-title" hidden');
  });
  it("delegates the visual header to native controls and places it outside the glass containing block", () => {
    expect(source).toContain('nativeAction(".top .back")');
    expect(source).toContain('nativeAction(".top .help")');
    expect(css).toContain(".premium-form-panel .top{display:none}");
    expect(css).toContain(".premium-form-panel:has(.modal-bg.open)");
  });
});
