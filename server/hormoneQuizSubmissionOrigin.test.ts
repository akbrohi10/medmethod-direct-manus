import { createHash } from "node:crypto"; import { inverseHormoneQuizPrivacy } from "./fixtures/hormoneQuizPrivacyScope"; import { inverseHormoneQuizCtaPlacement } from "./fixtures/hormoneQuizCtaPlacementScope"; import { gunzipSync as ctaPlacementGunzipSync } from "node:zlib"; import { inverseHormoneQuizLetterRemoval } from "./fixtures/hormoneQuizLetterRemovalScope"; import { gunzipSync as letterRemovalGunzipSync } from "node:zlib"; import { inverseHormoneQuizDoctorIntro } from "./fixtures/hormoneQuizDoctorIntroScope"; import { gunzipSync as doctorIntroGunzipSync } from "node:zlib";
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
const read = (p: string) => inverseHormoneQuizPrivacy(p, ((source: string) => { if (p !== "server/hormoneQuizPrivacy.test.ts") return source; const edits = JSON.parse(ctaPlacementGunzipSync(Buffer.from("H4sIAAAAAAACA7WTXW/aMBSG/4rrq0TK0oQkEILYVFWbuNxE7wgXjn0MnhI7sk0pq/rfdwICpHaruotJvrLOOc/7no/VMzWtoBVVXW+sJ8+EW2AeFsxtyQuR1nSkptoIqLg99N7UdEYjqmH/bznkEqv0I1gHC2M7o+HHTv269+x7yzh0oP01P76V6snvLLjb7Z9jl9z0MOh5ic4uuNHOE1QjyJwEfUWct0pvQjL/fPz9plpYHjQPsKxpHyGwxviI9GGExJ2XZU3Dq7/3qr1vI+ijD/PCtwY2yg/EOI6Z3bgzd7U+kuEJ+KVuTTG2phEZAqNhFHtRkRMFNDcC86oLi7y8cfcfUbHrW+Uxr641+oylaj3YoB8q4x5IEtysaiqUlEPVmrbuE4aAq+k6Vpq3OwEuGGCrZB2G2E/cBk283cGMnMT3SqN4LDifY74DizP52NrEHjHkC2YleSGbbCIbWfCGi5QnXCYTWULGWSLKnKVlkY6aIi1SKXJRZgW+Ih83fDQW/Gi1ei3hL+TYg/NXsoSkSSejLB+nI+B52iRiWmSSNWyaZmMoi5FIm4zLLEul5LmAiSh51nCW8mkzTcSRrHdtOzs1E7vxqkvD9xavMhh2MeixiTco8xjnt9bsyVdrjcUJDUrJ/cMd6S+HOCy49sYeyHJxRzrlOub5driPM0Oy1iEEB/3TKH2ZM67z+jcO4HOqVwQAAA==", "base64")).toString("utf8")) as {old: string; new: string}[]; for (const e of [...edits].reverse()) { const lines = source.split("\n"); if (lines.filter(l => l === e.new).length !== 1) throw Error("Quiz CTA placement privacy test inverse mismatch"); source = lines.map(l => l === e.new ? e.old : l).join("\n"); } if (hash(source) !== "ab258e67b82562ae04298394dba34c0bf021541fb6b452331509a9fb0e742e0c") throw Error("Quiz CTA placement privacy test SHA mismatch"); return source; })(inverseHormoneQuizCtaPlacement(p, ((source: string) => { const entry = (JSON.parse(letterRemovalGunzipSync(Buffer.from("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", "base64")).toString("utf8")) as Record<string, {sha: string; edits: {old: string; new: string}[]}>)[p]; if (!entry) return source; for (const e of [...entry.edits].reverse()) { const lines = source.split("\n"); if (lines.filter(l => l === e.new).length !== 1) throw Error("Quiz letter removal test inverse mismatch"); source = lines.map(l => l === e.new ? e.old : l).join("\n"); } if (hash(source) !== entry.sha) throw Error("Quiz letter removal test SHA mismatch"); return source; })(inverseHormoneQuizLetterRemoval(p, ((source: string) => { const entry = (JSON.parse(doctorIntroGunzipSync(Buffer.from("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", "base64")).toString("utf8")) as Record<string, {sha: string; edits: {old: string; new: string}[]}>)[p]; if (!entry) return source; for (const e of [...entry.edits].reverse()) { const lines = source.split("\n"); if (lines.filter(l => l === e.new).length !== 1) throw Error("Quiz doctor introduction test inverse mismatch"); source = lines.map(l => l === e.new ? e.old : l).join("\n"); } if (hash(source) !== entry.sha) throw Error("Quiz doctor introduction test SHA mismatch"); return source; })(inverseHormoneQuizDoctorIntro(p, readFileSync(resolve(root, p), "utf8"))))))));
const git = (...args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).split("\n").filter(p => { if (!["diff", "ls-files"].includes(args[0])) return true; const pin = p === "server/fixtures/hormoneQuizDoctorIntroScope.ts" ? "6e429f0c6d2a58cf48fe9445ab65468e3565797f6d86dc251c02742784f8e77c" : p === "server/hormoneQuizDoctorIntro.test.ts" ? "ca9274dd296790db34ca74c313b8ae11eb5e7f64d9774eb7e803a7c46ea6db2a" : null; if (!pin) return true; if (hash(read(p)) !== pin) throw Error("Quiz doctor introduction inventory SHA mismatch"); return false; }).filter(p => { if (!["diff", "ls-files"].includes(args[0])) return true; const pin = p === "server/fixtures/hormoneQuizPrivacyScope.ts" ? "589a41f28d49b6bdc2dec9149f7dbfe996bdd0f0a5389fcf1d4ee501b04fb156" : p === "server/hormoneQuizPrivacy.test.ts" ? "ab258e67b82562ae04298394dba34c0bf021541fb6b452331509a9fb0e742e0c" : null; if (pin) { if (hash(read(p)) !== pin) throw Error("Quiz privacy inventory SHA mismatch"); return false; } const expected = ({"client/public/hormone-symptom-quiz.html": "24c45b7c284477614037c7a3fe305d57aeca022eba889103770a0d26c3b16f50", "server/_core/index.ts": "58b888efb532a6dc0165b784753cbfec632fa29f257376e96f7f03155da76bff"} as Record<string, string>)[p]; if (args[0] !== "diff" || !expected) return true; if (hash(inverseHormoneQuizPrivacy(p, read(p))) !== expected) throw Error("Quiz privacy production inverse SHA mismatch"); return false; }).filter(p => { if (!["diff", "ls-files"].includes(args[0])) return true; const pin = p === "server/fixtures/hormoneQuizCtaPlacementScope.ts" ? "045fb37fbf5cbcd1c0cf07f8e3ca0d84a18512b5151fd4d835835546bc26dcf8" : p === "server/hormoneQuizCtaPlacement.test.ts" ? "fe0b17234612ec41b0d953faba9136e852d1b3cf331ffc4de7d8c3bca1c9b90d" : null; if (!pin) return true; if (hash(read(p)) !== pin) throw Error("Quiz CTA placement inventory SHA mismatch"); return false; }).filter(p => { if (!["diff", "ls-files"].includes(args[0])) return true; const pin = p === "server/fixtures/hormoneQuizLetterRemovalScope.ts" ? "96938eba387ef8b4249cd02e6a6773b1073c877eb99812e4b7900d2be66d1d7d" : p === "server/hormoneQuizLetterRemoval.test.ts" ? "d7416dfa4c92225fa859e32f6d86fa640b6cfc5259b625471274a05011b6d98b" : null; if (!pin) return true; if (hash(read(p)) !== pin) throw Error("Quiz letter removal inventory SHA mismatch"); return false; }).join("\n");
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
