import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import fixture from "./fixtures/intakePaymentReadinessScope.json";

const root = resolve(import.meta.dirname, "..");
const text = (path: string) => readFileSync(resolve(root, path), "utf8");
const sha = (value: string) => createHash("sha256").update(value).digest("hex");
const git = (...args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
function inverse(value: string, edits: { old: string; new: string; position: number }[]) {
  for (const edit of [...edits].reverse()) {
    if (value.slice(edit.position, edit.position + edit.new.length) !== edit.new) throw new Error("Approved edit differs");
    value = value.slice(0, edit.position) + edit.old + value.slice(edit.position + edit.new.length);
  }
  return value;
}
const jsPath = "client/public/intake/text-payment.js";
const htmlPath = "client/intake/index.html";
const unchanged = ["client/public/intake/text-payment.css", "client/public/intake/text-payment-api.js", "client/intake-text-payment-transport.ts", "server/intakePaymentRoutes.ts", "server/intakeTextPaymentIntegration.ts", "server/intakeTextPaymentWorker.ts", "server/ghlIntakeWebhookQueue.ts", "server/metaLeadTracking.ts", "client/public/meta-lead.js", "client/intake/thank-you/index.html"];

describe("payment readiness approved scope against 71497ac6", () => {
  it("pins baseline hashes independently and inverses all client changes exactly", () => {
    for (const [path, expected] of Object.entries(fixture.hashes)) expect(sha(git("show", `${fixture.baseline}:${path}`))).toBe(expected);
    expect(sha(inverse(text(jsPath), fixture.ui_edits))).toBe(fixture.hashes[jsPath]);
    expect(sha(inverse(text(htmlPath), fixture.html_edits))).toBe(fixture.hashes[htmlPath]);
  });
  it("freezes the entire four-field render/labels/button/privacy markup and all checkout CSS", () => {
    const start = "      function field(ref, label, extra) {";
    const before = git("show", `${fixture.baseline}:${jsPath}`);
    const current = text(jsPath);
    expect(current.slice(current.indexOf(start))).toBe(before.slice(before.indexOf(start)));
    expect(sha(text("client/public/intake/text-payment.css"))).toBe(fixture.hashes["client/public/intake/text-payment.css"]);
  });
  it("freezes all other payment, delivery, tracking, thank-you, and transport paths", () => {
    for (const path of unchanged) expect(sha(text(path)), path).toBe(fixture.hashes[path as keyof typeof fixture.hashes]);
  });
  it("versions only the three checkout links and rejects extra unapproved client edits", () => {
    expect(fixture.html_edits).toHaveLength(3);
    for (const asset of ["text-payment.css", "text-payment-api.js", "text-payment.js"]) {
      expect(text(htmlPath).split(`/intake/${asset}?v=20261119-readiness-v3`).length - 1).toBe(1);
    }
    expect(() => inverse(text(jsPath).replace("await freshConfiguration(config);", "await unrelatedChange();"), fixture.ui_edits)).toThrow();
    expect(sha(inverse(text(jsPath) + "\n// outside authorized edits\n", fixture.ui_edits))).not.toBe(fixture.hashes[jsPath]);
  });
  it("allows only approved server readiness, shared-key, UI, current direct tests and bookkeeping files", () => {
    const allowed = new Set([htmlPath, jsPath, "server/intakeTextPaymentStore.ts", "server/intakeTextPaymentService.ts", "server/routers/intakeTextPayment.ts", "server/intakePrivateBlobDb.ts", "server/intakePrivateApplicationKey.ts", "server/intakeTextPaymentService.test.ts", "server/intakeTextPaymentUi.test.ts", "server/intakePaymentReadiness.test.ts", "server/intakePaymentKeyReuse.test.ts", "server/intakePaymentReadinessScope.test.ts", "server/fixtures/intakePaymentReadinessScope.json", "todo.md"]);
    const changed = git("diff", "--name-only", fixture.baseline).trim().split("\n").filter(Boolean);
    const untracked = git("ls-files", "--others", "--exclude-standard").trim().split("\n").filter(Boolean);
    expect([...new Set([...changed, ...untracked])].filter(path => !allowed.has(path))).toEqual([]);
    expect(changed).not.toContain(".env");
  });
});
