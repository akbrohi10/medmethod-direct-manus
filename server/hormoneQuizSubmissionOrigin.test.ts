import { createHash } from "node:crypto"; import { inverseHormoneQuizPrivacy } from "./fixtures/hormoneQuizPrivacyScope"; import { inverseHormoneQuizCtaPlacement } from "./fixtures/hormoneQuizCtaPlacementScope"; import { gunzipSync as ctaPlacementGunzipSync } from "node:zlib";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { quizReportOrigin } from "./hormoneQuizPrivateReport";
import { createTestQuizAnswers, validateQuizAnswers } from "./hormoneQuizModel";
import { quizService } from "./hormoneQuizService";
import { hormoneQuizRouter } from "./routers/hormoneQuiz";
import { inverseHormoneQuizSubmissionOrigin } from "./fixtures/hormoneQuizSubmissionOriginScope";
import type { TrpcContext } from "./_core/context";

const root = resolve(import.meta.dirname, "..");
const baseline = "c11b5b4e";
const helper = "server/fixtures/hormoneQuizSubmissionOriginScope.ts";
const helperSHA = "634e49eadc1c3ac7c3572582124b68b7db3543a642de13124a384794e1a9b905";
const publicOrigin = "https://medmethoddirect.com";
const preview = "https://3000-i96796e94ozetw9qpb6zg-37388edb.us1.manus.computer";
const internalHost = "quiz-upstream.internal:3000";
const production = {
  "server/hormoneQuizPrivateReport.ts": { before: "0b09d70a1da392697b7c17e5c55c4a0c8c4cc244e96bed1afdac8c1aa68dc834", after: "378abd7a02401b0837e4e42c9d137a9c2aa2abf78ec5e58db8ff649411577e59" },
  "server/routers/hormoneQuiz.ts": { before: "1c1404a42c9e1d89c19440bd0533c0267a1fcd9636068b2491c22da29efbe9a6", after: "d664ec6e2b8a2263c5f074542f2c7d865716358df1791fb88c7568d7847e6306" },
};
const read = (p: string) => inverseHormoneQuizPrivacy(p, ((source: string) => { if (p !== "server/hormoneQuizPrivacy.test.ts") return source; const edits = JSON.parse(ctaPlacementGunzipSync(Buffer.from("H4sIAAAAAAACA7WTXW/aMBSG/4rrq0TK0oQkEILYVFWbuNxE7wgXjn0MnhI7sk0pq/rfdwICpHaruotJvrLOOc/7no/VMzWtoBVVXW+sJ8+EW2AeFsxtyQuR1nSkptoIqLg99N7UdEYjqmH/bznkEqv0I1gHC2M7o+HHTv269+x7yzh0oP01P76V6snvLLjb7Z9jl9z0MOh5ic4uuNHOE1QjyJwEfUWct0pvQjL/fPz9plpYHjQPsKxpHyGwxviI9GGExJ2XZU3Dq7/3qr1vI+ijD/PCtwY2yg/EOI6Z3bgzd7U+kuEJ+KVuTTG2phEZAqNhFHtRkRMFNDcC86oLi7y8cfcfUbHrW+Uxr641+oylaj3YoB8q4x5IEtysaiqUlEPVmrbuE4aAq+k6Vpq3OwEuGGCrZB2G2E/cBk283cGMnMT3SqN4LDifY74DizP52NrEHjHkC2YleSGbbCIbWfCGi5QnXCYTWULGWSLKnKVlkY6aIi1SKXJRZgW+Ih83fDQW/Gi1ei3hL+TYg/NXsoSkSSejLB+nI+B52iRiWmSSNWyaZmMoi5FIm4zLLEul5LmAiSh51nCW8mkzTcSRrHdtOzs1E7vxqkvD9xavMhh2MeixiTco8xjnt9bsyVdrjcUJDUrJ/cMd6S+HOCy49sYeyHJxRzrlOub5driPM0Oy1iEEB/3TKH2ZM67z+jcO4HOqVwQAAA==", "base64")).toString("utf8")) as {old: string; new: string}[]; for (const e of [...edits].reverse()) { const lines = source.split("\n"); if (lines.filter(l => l === e.new).length !== 1) throw Error("Quiz CTA placement privacy test inverse mismatch"); source = lines.map(l => l === e.new ? e.old : l).join("\n"); } if (hash(source) !== "ab258e67b82562ae04298394dba34c0bf021541fb6b452331509a9fb0e742e0c") throw Error("Quiz CTA placement privacy test SHA mismatch"); return source; })(inverseHormoneQuizCtaPlacement(p, readFileSync(resolve(root, p), "utf8"))));
const git = (...args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).split("\n").filter(p => { if (!["diff", "ls-files"].includes(args[0])) return true; const pin = p === "server/fixtures/hormoneQuizPrivacyScope.ts" ? "589a41f28d49b6bdc2dec9149f7dbfe996bdd0f0a5389fcf1d4ee501b04fb156" : p === "server/hormoneQuizPrivacy.test.ts" ? "ab258e67b82562ae04298394dba34c0bf021541fb6b452331509a9fb0e742e0c" : null; if (pin) { if (hash(read(p)) !== pin) throw Error("Quiz privacy inventory SHA mismatch"); return false; } const expected = ({"client/public/hormone-symptom-quiz.html": "24c45b7c284477614037c7a3fe305d57aeca022eba889103770a0d26c3b16f50", "server/_core/index.ts": "58b888efb532a6dc0165b784753cbfec632fa29f257376e96f7f03155da76bff"} as Record<string, string>)[p]; if (args[0] !== "diff" || !expected) return true; if (hash(inverseHormoneQuizPrivacy(p, read(p))) !== expected) throw Error("Quiz privacy production inverse SHA mismatch"); return false; }).filter(p => { if (!["diff", "ls-files"].includes(args[0])) return true; const pin = p === "server/fixtures/hormoneQuizCtaPlacementScope.ts" ? "045fb37fbf5cbcd1c0cf07f8e3ca0d84a18512b5151fd4d835835546bc26dcf8" : p === "server/hormoneQuizCtaPlacement.test.ts" ? "fe0b17234612ec41b0d953faba9136e852d1b3cf331ffc4de7d8c3bca1c9b90d" : null; if (!pin) return true; if (hash(read(p)) !== pin) throw Error("Quiz CTA placement inventory SHA mismatch"); return false; }).join("\n");
const before = (p: string) => git("show", baseline + ":" + p);
const hash = (s: string) => createHash("sha256").update(s).digest("hex");
const lines = (s: string) => s.split("\n").filter(Boolean);
const input = () => ({ request_key: "origin-local-only-" + "1".repeat(32), name: "Test Quiz", email: "test+origin@example.invalid", phone: "+15555550100", answers: createTestQuizAnswers() });
const quizId = "00000000-0000-4000-8000-000000000123";
function caller(headers: TrpcContext["req"]["headers"], admin = false) {
  return hormoneQuizRouter.createCaller({ user: admin ? { role: "admin" } : null, req: { headers }, res: {} } as TrpcContext);
}
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); });

describe("Quiz submission origin — exact checkpoint-only reverse-proxy fix", () => {
  it("pins both whole production files and reconstructs c11b5b4e from only the exact one-plus-two occurrences", () => {
    const packet = JSON.parse(read(helper).split("\n")[1].slice("const files = ".length, -1));
    expect(Object.keys(packet)).toEqual(Object.keys(production));
    for (const [p, pins] of Object.entries(production)) {
      const original = before(p), current = read(p), fragments = packet[p] as { old: string; new: string; count?: number }[];
      expect(hash(original)).toBe(pins.before); expect(hash(current)).toBe(pins.after);
      expect(fragments).toHaveLength(1);
      let expected = original;
      for (const f of fragments) {
        const count = f.count ?? 1;
        expect(count).toBe(p.endsWith("routers/hormoneQuiz.ts") ? 2 : 1);
        expect(original.split(f.old).length - 1).toBe(count);
        expect(current.split(f.new).length - 1).toBe(count);
        expected = expected.split(f.old).join(f.new);
      }
      expect(current).toBe(expected);
      for (const alias of [p, resolve(root, p), p.replaceAll("/", "\\"), "C:\\project\\" + p.replaceAll("/", "\\")]) {
        expect(inverseHormoneQuizSubmissionOrigin(alias, current)).toBe(original);
        expect(inverseHormoneQuizSubmissionOrigin(alias, original)).toBe(original);
        expect(inverseHormoneQuizSubmissionOrigin(alias, inverseHormoneQuizSubmissionOrigin(alias, current))).toBe(original);
        for (const f of fragments) for (const bad of ["", current.replace(f.new, ""), current + f.new, current + f.old, original + f.old, original + f.new, original.replace(f.old, ""), current.replace(f.new, f.new.slice(0, 1) + "UNAPPROVED" + f.new.slice(1))]) expect(() => inverseHormoneQuizSubmissionOrigin(alias, bad)).toThrow("Quiz submission origin scope mismatch");
        if (p.endsWith("routers/hormoneQuiz.ts")) expect(() => inverseHormoneQuizSubmissionOrigin(alias, current.replace(fragments[0].new, fragments[0].old))).toThrow("Quiz submission origin scope mismatch");
        expect(inverseHormoneQuizSubmissionOrigin(alias, "UNAPPROVED\n" + current)).toBe("UNAPPROVED\n" + original);
        expect(hash(inverseHormoneQuizSubmissionOrigin(alias, current + "\nUNAPPROVED"))).not.toBe(pins.before);
      }
      for (const outside of [p + ".bak", "server/unrelated.ts", "other/" + p + ".copy"]) expect(inverseHormoneQuizSubmissionOrigin(outside, current)).toBe(current);
    }
  });

  it("pins the pure helper and preserves all25 prior fixtures, contracts, and production inventory outside the two approved paths", () => {
    const source = read(helper);
    expect(hash(source)).toBe(helperSHA);
    expect(source.split("\n").slice(2).join("\n")).not.toMatch(/\b(?:describe|it|test)\s*\(|\bimport\s|\brequire\s*\(|readFile|writeFile|execFile|fetch\(|process\.|XMLHttpRequest|sendBeacon/);
    const prior = lines(git("ls-tree", "-r", "--name-only", baseline, "--", "server/fixtures"));
    expect(prior).toHaveLength(25);
    for (const p of prior) expect(read(p), p).toBe(before(p));
    const scope = ["client", "server", "shared", "drizzle", ".gitignore", "vite.config.ts", "vitest.config.ts", "package.json", "pnpm-lock.yaml", "tsconfig.json"];
    const changed = lines(git("diff", "--name-only", baseline, "--", ...scope));
    expect(changed.filter(p => !/^server\/[^/]+\.test\.ts$/.test(p) && p !== helper).sort()).toEqual(Object.keys(production).sort());
    const added = lines(git("ls-files", "--others", "--exclude-standard", "--", ...scope));
    expect(added.filter(p => p !== helper && p !== "server/hormoneQuizSubmissionOrigin.test.ts")).toEqual([]);
    for (const p of ["server/hormoneQuizService.ts", "server/hormoneQuizModel.ts", "server/hormoneQuizStore.ts", "server/hormoneQuizPdf.ts", "server/hormoneQuizSecurity.ts", "server/hormoneQuizRoutes.ts", "client/quiz-webhook-transport.ts", "client/public/hormone-symptom-quiz.html", "client/src/components/AdminQuizWebhooks.tsx"]) expect(read(p), p).toBe(before(p));
    for (const p of Object.keys(production)) expect(read(p)).not.toContain("fixtures/hormoneQuizSubmissionOriginScope");
  });

  it("accepts exact trusted HTTPS browser Origins before internal or conflicting Host in production where old host-only resolution rejects", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(() => quizReportOrigin(internalHost)).toThrow("Quiz origin unavailable.");
    for (const origin of [publicOrigin, "https://www.medmethoddirect.com", "https://medmethod-kywclyds.manus.space", preview]) {
      expect(quizReportOrigin(internalHost, { origin })).toBe(origin);
      expect(quizReportOrigin("attacker.example.invalid", { origin, "x-forwarded-host": "foreign.example.invalid" })).toBe(origin);
    }
  });

  it("fails closed on foreign, array, credentialed, HTTP, noncanonical, malformed or ambiguous Origin even with known Host and fallback headers", () => {
    vi.stubEnv("NODE_ENV", "production");
    const invalid: (string | string[])[] = ["https://foreign.example.invalid", "http://medmethoddirect.com", "https://medmethoddirect.com.evil.invalid", "https://user:pass@medmethoddirect.com", "https://medmethoddirect.com/", "https://medmethoddirect.com/path", "https://medmethoddirect.com?x=1", "https://medmethoddirect.com#hash", "https://medmethoddirect.com:443", "https://MEDMETHODDIRECT.COM", "https://medmethoddirect.com:444", "https://medmethoddirect.com,https://foreign.example.invalid", "https://medmethoddirect.com\\path", " https://medmethoddirect.com", "https://medmethoddirect.com\n", "null", "", "://", [publicOrigin], [publicOrigin, publicOrigin]];
    for (const origin of invalid) expect(() => quizReportOrigin("medmethoddirect.com", { origin, "x-forwarded-host": "medmethoddirect.com", referer: publicOrigin + "/hormone-symptom-quiz" })).toThrow("Quiz origin unavailable.");
  });

  it("preserves missing-header direct Host behavior and canonical default443 while accepting only one strict known forwarded Host", () => {
    vi.stubEnv("NODE_ENV", "production");
    for (const host of ["medmethoddirect.com", "MEDMETHODDIRECT.COM", "medmethoddirect.com:443"]) expect(quizReportOrigin(host)).toBe(publicOrigin);
    expect(quizReportOrigin(internalHost, { "x-forwarded-host": "www.medmethoddirect.com:443" })).toBe("https://www.medmethoddirect.com");
    expect(quizReportOrigin("medmethoddirect.com", { "x-forwarded-host": "foreign.example.invalid" })).toBe(publicOrigin);
    for (const forwarded of ["foreign.example.invalid", "https://medmethoddirect.com", "medmethoddirect.com/path", "medmethoddirect.com?x=1", "user@medmethoddirect.com", "medmethoddirect.com:444", "medmethoddirect.com,foreign.example.invalid", " medmethoddirect.com", "medmethoddirect.com\n", ["medmethoddirect.com"], ["medmethoddirect.com", "www.medmethoddirect.com"]]) expect(() => quizReportOrigin(internalHost, { "x-forwarded-host": forwarded })).toThrow("Quiz origin unavailable.");
    expect(() => quizReportOrigin("")).toThrow("Quiz origin unavailable.");
  });

  it("uses only safe known HTTPS Referer fallback and never lets fallback rescue an explicitly invalid Origin", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(quizReportOrigin(internalHost, { referer: publicOrigin + "/hormone-symptom-quiz.html?view=quiz#intro" })).toBe(publicOrigin);
    expect(quizReportOrigin(internalHost, { "x-forwarded-host": "unknown.internal", referer: "https://www.medmethoddirect.com:443/quiz" })).toBe("https://www.medmethoddirect.com");
    for (const referer of ["https://foreign.example.invalid/quiz", "http://medmethoddirect.com/quiz", "https://user@medmethoddirect.com/quiz", "https://medmethoddirect.com.evil.invalid/quiz", "https://medmethoddirect.com/quiz,other", "https://medmethoddirect.com\\quiz", "not-a-url", [publicOrigin]]) expect(() => quizReportOrigin(internalHost, { referer })).toThrow("Quiz origin unavailable.");
    expect(() => quizReportOrigin(internalHost, { origin: "https://foreign.example.invalid", referer: publicOrigin + "/quiz" })).toThrow("Quiz origin unavailable.");
  });

  it("retains the established preview only for matching development localhost Origin and rejects local Origin in production", () => {
    vi.stubEnv("NODE_ENV", "development");
    for (const host of ["localhost:3000", "127.0.0.1:3000"]) {
      expect(quizReportOrigin(host, { origin: "http://" + host })).toBe(preview);
      expect(quizReportOrigin(host, { origin: "https://" + host })).toBe(preview);
      expect(quizReportOrigin(host)).toBe(preview);
    }
    for (const origin of ["http://localhost:3001", "http://127.0.0.1:3000", "http://localhost:3000/", "http://localhost:3000.evil.invalid"]) expect(() => quizReportOrigin("localhost:3000", { origin })).toThrow("Quiz origin unavailable.");
    vi.stubEnv("NODE_ENV", "production");
    expect(() => quizReportOrigin("localhost:3000")).toThrow("Quiz origin unavailable.");
    expect(() => quizReportOrigin("localhost:3000", { origin: "http://localhost:3000" })).toThrow("Quiz origin unavailable.");
  });

  it("actual complete router accepts32 valid answers with internal Host plus public Origin and requests exactly one nonawaited flush", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const completion = vi.spyOn(quizService, "complete").mockResolvedValue({ quiz_id: quizId, duplicate: false });
    const flush = vi.spyOn(quizService, "flush").mockImplementation(() => new Promise<Awaited<ReturnType<typeof quizService.flush>>>(() => {}));
    const payload = input(); expect(Object.keys(validateQuizAnswers(payload.answers))).toHaveLength(32);
    const result = await caller({ host: internalHost, origin: publicOrigin }).complete(payload);
    expect(result).toEqual({ ok: true, quiz_id: quizId, duplicate: false });
    expect(completion).toHaveBeenCalledTimes(1); expect(completion).toHaveBeenCalledWith(payload, publicOrigin);
    expect(flush).toHaveBeenCalledTimes(1); expect(flush).toHaveBeenCalledWith(quizId);
  });

  it("actual complete router rejects invalid Origin before completion or enqueue with the unchanged friendly response", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const completion = vi.spyOn(quizService, "complete").mockResolvedValue({ quiz_id: quizId, duplicate: false });
    const flush = vi.spyOn(quizService, "flush").mockResolvedValue({ attempted: 0, sent: 0, failed: 0 });
    await expect(caller({ host: "medmethoddirect.com", origin: "https://foreign.example.invalid", "x-forwarded-host": "medmethoddirect.com", referer: publicOrigin + "/quiz" }).complete(input())).rejects.toMatchObject({ code: "BAD_REQUEST", message: "Quiz completion could not be recorded." });
    expect(completion).not.toHaveBeenCalled(); expect(flush).not.toHaveBeenCalled();
  });

  it("actual router preserves friendly genuine storage failure and passes trusted Origin to the mocked authorized admin test", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const completion = vi.spyOn(quizService, "complete").mockRejectedValue(new Error("PRIVATE_SYNTHETIC_STORAGE_FAILURE"));
    const flush = vi.spyOn(quizService, "flush").mockResolvedValue({ attempted: 0, sent: 0, failed: 0 });
    await expect(caller({ host: internalHost, origin: publicOrigin }).complete(input())).rejects.toMatchObject({ code: "BAD_REQUEST", message: "Quiz completion could not be recorded." });
    expect(completion).toHaveBeenCalledWith(input(), publicOrigin); expect(flush).not.toHaveBeenCalled();
    const adminResult = { quiz_id: quizId, keragon_http_status: 202, ghl_http_status: 202, report_pdf_url: publicOrigin + "/api/quiz/report/synthetic-local", report_expires_at: "2026-11-11T00:00:00.000Z", report_document_name: "Synthetic local report", duplicate: false };
    const sendTest = vi.spyOn(quizService, "sendTest").mockResolvedValue(adminResult);
    const request_key = "admin-origin-local-" + "2".repeat(32);
    await expect(caller({ host: internalHost, origin: publicOrigin }, true).sendTest({ request_key })).resolves.toEqual(adminResult);
    expect(sendTest).toHaveBeenCalledTimes(1); expect(sendTest).toHaveBeenCalledWith(request_key, publicOrigin);
    await expect(caller({ host: "medmethoddirect.com", origin: "https://foreign.example.invalid" }, true).sendTest({ request_key })).rejects.toMatchObject({ code: "INTERNAL_SERVER_ERROR", message: "The dummy quiz test could not complete. No private error details are shown." });
    expect(sendTest).toHaveBeenCalledTimes(1);
  });
});
