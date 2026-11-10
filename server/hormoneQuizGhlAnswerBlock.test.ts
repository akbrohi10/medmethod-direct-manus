import { createHash } from "node:crypto"; import { inverseHormoneQuizSubmissionOrigin } from "./fixtures/hormoneQuizSubmissionOriginScope"; import { inverseHormoneQuizPrivacy } from "./fixtures/hormoneQuizPrivacyScope"; import { gunzipSync } from "node:zlib";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { QUIZ_QUESTIONS, computeQuizScore, createTestQuizAnswers, quizAnswerTexts, validateQuizAnswers, type QuizAnswers } from "./hormoneQuizModel";
import { formatGhlQuizAnswers, buildGhlQuizPayload, buildKeragonQuizPayload, type StoredQuizRecord } from "./hormoneQuizService";
import { inverseHormoneQuizGhlAnswerBlock } from "./fixtures/hormoneQuizGhlAnswerBlockScope";
const baselineSHA = "ae03caf253af04e89b990dbfc515eda6e945f8a69b2e32fbf37532af52113b24";
const currentSHA = "7fc28ca7977793d0e1778892b10dc9543aba52d6102b4aea2c62bbcdf94f4fa9";
const helperSHA = "36bad6875b176d1d7cb671b38e64d53f352f38fb3a42969fcb98b9f4b48058b3";
const fragments = [{"old": "import { computeQuizScore, createTestQuizAnswers, quizAnswerTexts, validateQuizAnswers, type QuizAnswers, type QuizAnswerText } from \"./hormoneQuizModel\";", "new": "import { QUIZ_QUESTIONS, computeQuizScore, createTestQuizAnswers, quizAnswerTexts, validateQuizAnswers, type QuizAnswers, type QuizAnswerText } from \"./hormoneQuizModel\";"}, {"old": "export function buildGhlQuizPayload(record:StoredQuizRecord){return {first_name:record.first_name,last_name:record.last_name,email:record.email,phone:record.phone,tags:\"quiz-completed\",source:\"hormone-symptom-quiz\",submitted_at:record.submitted_at};}", "new": "export function formatGhlQuizAnswers(record:StoredQuizRecord):string{\n  const [year,month,day]=record.submitted_at.slice(0,10).split(\"-\");\n  const questions=QUIZ_QUESTIONS.filter(q=>q.id!==\"recognize\"&&!q.conditional);\n  const blocks=questions.map((q,i)=>{\n    const value=record.selections[q.id];\n    const answer=Array.isArray(value)?value.map(n=>q.opts[n]?.[0]).filter((label):label is string=>typeof label===\"string\").join(\", \")\n      :typeof value===\"number\"?String(q.opts[value]?.[0]??\"\"):\"\";\n    return `${i+1}. ${q.text}<br>Answer: ${answer||\"No answer\"}`;\n  });\n  const index=record.balance_index===null?\"No answer\":`${record.balance_index}/100`;\n  return [`Hormone Symptom Quiz – completed ${month}/${day}/${year}`,`Balance Index: ${index} (${record.score_band})`,\"\",blocks.join(\"<br><br>\")].join(\"<br>\");\n}\nexport function buildGhlQuizPayload(record:StoredQuizRecord){return {first_name:record.first_name,last_name:record.last_name,email:record.email,phone:record.phone,tags:\"quiz-completed\",source:\"hormone-symptom-quiz\",submitted_at:record.submitted_at,quiz_answers:formatGhlQuizAnswers(record)};}"}];
// Independently pinned full question text/order from the unchanged approved model.
const pinnedQuestions = [
  [
    "age",
    "How old are you?"
  ],
  [
    "cycle",
    "Where are you in the cycle picture?"
  ],
  [
    "wakeNights",
    "How many nights a week do you wake up in the middle of the night?"
  ],
  [
    "wakeTime",
    "When you wake up, what time is it usually?"
  ],
  [
    "wakeCause",
    "What wakes you most often?"
  ],
  [
    "backAsleep",
    "Once you're awake, how long until you're back asleep?"
  ],
  [
    "desire",
    "Compared to two years ago, your libido — wanting sex and physical closeness — is…"
  ],
  [
    "arousal",
    "Once things start, how long does it take to feel fully aroused?"
  ],
  [
    "orgasm",
    "How long does it usually take to reach orgasm?"
  ],
  [
    "orgasmChange",
    "And compared to two years ago, how has reaching orgasm itself changed?"
  ],
  [
    "dryness",
    "Dryness or discomfort during intimacy?"
  ],
  [
    "wantFreq",
    "How often do you find yourself wanting intimacy these days?"
  ],
  [
    "weird",
    "Tap any of these you've noticed lately."
  ],
  [
    "flashes",
    "How many hot flashes or sudden waves of heat do you get in a day?"
  ],
  [
    "sweats",
    "How many nights a week do night sweats wake you or soak your sleep clothes?"
  ],
  [
    "words",
    "Mid-sentence, the word just isn't there. How often does that happen?"
  ],
  [
    "fog",
    "Compared to two years ago, your mental sharpness feels…"
  ],
  [
    "anxietyLevel",
    "How anxious do you feel day to day, compared to two years ago?"
  ],
  [
    "anxiety",
    "A wave of worry that arrives out of nowhere — how often?"
  ],
  [
    "swings",
    "How often do your moods swing — fine one moment, then tearful, snappy, or overwhelmed the next?"
  ],
  [
    "weightChange",
    "How has your weight changed in the last two years?"
  ],
  [
    "weightWhere",
    "Where is the weight going?"
  ],
  [
    "triedToLose",
    "In the last two years, what happened when you tried to lose it?"
  ],
  [
    "recovery",
    "After a workout, how long until you feel recovered?"
  ],
  [
    "activeDays",
    "How many days a week are you active for 30 minutes or more?"
  ],
  [
    "afternoon",
    "Compared to two years ago, your energy by mid-afternoon is…"
  ],
  [
    "cravings",
    "Cravings — for sugar, salt, or an evening snack — how strong are they lately?"
  ],
  [
    "joints",
    "New joint aches or stiffness?"
  ],
  [
    "bladder",
    "Bladder changes — leaking a little, or needing to go more often?"
  ],
  [
    "fixFirst",
    "Last one. If one thing could change first, what would you pick?"
  ]
] as const;

const root = resolve(import.meta.dirname, "..");
const servicePath = "server/hormoneQuizService.ts";
const helperPath = "server/fixtures/hormoneQuizGhlAnswerBlockScope.ts";
const baseline = "520dd6a1";
const read = (p: string) => { let latest = readFileSync(resolve(root, p), "utf8"); const edits = (JSON.parse(gunzipSync(Buffer.from("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", "base64")).toString("utf8")) as Record<string, {old: string; new: string}[]>)[p]; if (edits) { for (const e of [...edits].reverse()) { const lines = latest.split("\n"); if (lines.filter(l => l === e.new).length !== 1) throw Error("Quiz privacy historical fragment mismatch"); latest = lines.map(l => l === e.new ? e.old : l).join("\n"); } if (latest !== execFileSync("git", ["show", "ed12f8af:" + p], { cwd: root, encoding: "utf8" })) throw Error("Quiz privacy historical inverse mismatch"); } let source = inverseHormoneQuizSubmissionOrigin(p, inverseHormoneQuizPrivacy(p, latest)); if (/^server\/[^/]+\.test\.ts$/.test(p) && p !== "server/hormoneQuizGhlAnswerBlock.test.ts" && p !== "server/hormoneQuizSubmissionOrigin.test.ts" && p !== "server/hormoneQuizPrivacy.test.ts") { source = source.replace(" import { inverseHormoneQuizSubmissionOrigin } from \"./fixtures/hormoneQuizSubmissionOriginScope\";", "").replace("const approvedSHA = p === \"server/fixtures/hormoneQuizSubmissionOriginScope.ts\" ? \"634e49eadc1c3ac7c3572582124b68b7db3543a642de13124a384794e1a9b905\" : ", "const approvedSHA = ").replaceAll("inverseHormoneQuizSubmissionOrigin(p, integrationReadFileSync(resolve(process.cwd(), p), \"utf8\"))", "integrationReadFileSync(resolve(process.cwd(), p), \"utf8\")"); if (p === "server/hormoneQuizIntegrationScope.test.ts") source = source.replace("inverseHormoneQuizSubmissionOrigin(p, readFileSync(resolve(root, p), \"utf8\"))", "readFileSync(resolve(root, p), \"utf8\")").replace(".filter(Boolean).filter(p => { if (p !== \"server/fixtures/hormoneQuizSubmissionOriginScope.ts\") return true; if (hash(read(p)) !== \"634e49eadc1c3ac7c3572582124b68b7db3543a642de13124a384794e1a9b905\") throw Error(\"Quiz submission origin helper SHA mismatch\"); return false; })", ".filter(Boolean)"); if (source !== git("show", "c11b5b4e:" + p)) throw Error("Quiz submission origin historical normalization mismatch"); } return source; };
const git = (...args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).split("\n").filter(p => { if (p !== "server/fixtures/hormoneQuizSubmissionOriginScope.ts") return true; if (hash(read(p)) !== "634e49eadc1c3ac7c3572582124b68b7db3543a642de13124a384794e1a9b905") throw Error("Quiz submission origin helper SHA mismatch"); return false; }).filter(p => { const expected = ({"server/hormoneQuizPrivateReport.ts": "0b09d70a1da392697b7c17e5c55c4a0c8c4cc244e96bed1afdac8c1aa68dc834", "server/routers/hormoneQuiz.ts": "1c1404a42c9e1d89c19440bd0533c0267a1fcd9636068b2491c22da29efbe9a6"} as Record<string, string>)[p]; if (args[0] !== "diff" || !expected) return true; if (hash(read(p)) !== expected) throw Error("Quiz submission origin production inverse SHA mismatch"); return false; }).filter(p => { if (!["diff", "ls-files"].includes(args[0]) || p !== "server/hormoneQuizSubmissionOrigin.test.ts") return true; if (hash(read(p)) !== "05d305c7a5e90e7e6b0d2e2183e3bd60a39ef50704ec807f9d2954e264da5234") throw Error("Quiz submission origin direct test SHA mismatch"); return false; }).filter(p => { if (!["diff", "ls-files"].includes(args[0])) return true; const pin = p === "server/fixtures/hormoneQuizPrivacyScope.ts" ? "589a41f28d49b6bdc2dec9149f7dbfe996bdd0f0a5389fcf1d4ee501b04fb156" : p === "server/hormoneQuizPrivacy.test.ts" ? "ab258e67b82562ae04298394dba34c0bf021541fb6b452331509a9fb0e742e0c" : null; if (pin) { if (hash(read(p)) !== pin) throw Error("Quiz privacy inventory SHA mismatch"); return false; } const expected = ({"client/public/hormone-symptom-quiz.html": "24c45b7c284477614037c7a3fe305d57aeca022eba889103770a0d26c3b16f50", "server/_core/index.ts": "58b888efb532a6dc0165b784753cbfec632fa29f257376e96f7f03155da76bff"} as Record<string, string>)[p]; if (args[0] !== "diff" || !expected) return true; if (hash(inverseHormoneQuizPrivacy(p, read(p))) !== expected) throw Error("Quiz privacy production inverse SHA mismatch"); return false; }).join("\n");
const before = (p: string) => git("show", baseline + ":" + p);
const hash = (s: string) => createHash("sha256").update(s).digest("hex");
const lines = (s: string) => s.split("\n").filter(Boolean);
const aliases = [servicePath, resolve(root, servicePath), servicePath.replaceAll("/", "\\"), "C:\\project\\" + servicePath.replaceAll("/", "\\")];
const exactKeys = ["first_name", "last_name", "email", "phone", "tags", "source", "submitted_at", "quiz_answers"];
const core = pinnedQuestions.map(([id]) => QUIZ_QUESTIONS.find(q => q.id === id)!);
function record(selections: QuizAnswers = createTestQuizAnswers()): StoredQuizRecord {
  const score = computeQuizScore(createTestQuizAnswers());
  return {
    quiz_id: "00000000-0000-4000-8000-000000000001", submitted_at: "2026-11-09T23:59:59.999Z",
    first_name: "Test", last_name: "Quiz", name: "PRIVATE_NAME", email: "test+quiz@example.invalid", phone: "+15555550100",
    balance_index: score.balance_index, score_band: score.score_band, answers: quizAnswerTexts(createTestQuizAnswers()), selections,
    report_pdf_url: "https://example.invalid/PRIVATE_PDF_TOKEN", report_document_name: "PRIVATE_DOCUMENT_NAME",
    report_expires_at: 1794326400000, fingerprint: "PRIVATE_FINGERPRINT", is_test: true,
  };
}
const questionLines = (r: StoredQuizRecord) => formatGhlQuizAnswers(r).split("<br>").slice(3);
const declarations = (s: string) => [...s.matchAll(/\b(?:describe|it|test)\s*\(\s*(['"])(.*?)\1/g)].map(m => m[0]);
const assertions = (s: string) => [...s.matchAll(/\bexpect\s*\(/g)].length;

// Reconstruct every allowed historical edit independently, preserving frozen registrations and positions.
function historicalEdits(p: string, original: string): [string, string][] {
  const edits: [string, string][] = [];
  const first = original.split("\n")[0];
  const guards = original.split("\n").filter(l => l.includes("const approvedSHA = ") && l.includes(baselineSHA));
  for (const line of guards) {
    const raw = 'integrationReadFileSync(resolve(process.cwd(), p), "utf8")';
    if (!line.includes(raw)) throw Error("Historical guard shape mismatch");
    edits.push([line, line.replaceAll("const approvedSHA = ", "const approvedSHA = p === " + JSON.stringify(helperPath) + " ? " + JSON.stringify(helperSHA) + " : ").replaceAll(raw, "inverseHormoneQuizGhlAnswerBlock(p, " + raw + ")")]);
  }
  if (guards.length) edits.push([first, first + ' import { inverseHormoneQuizGhlAnswerBlock } from "./fixtures/hormoneQuizGhlAnswerBlockScope";']);
  if (p === "server/hormoneQuizIntegrationScope.test.ts") {
    edits.push(['const read = (p: string) => readFileSync(resolve(root, p), "utf8");', 'const read = (p: string) => inverseHormoneQuizGhlAnswerBlock(p, readFileSync(resolve(root, p), "utf8"));']);
    for (const line of original.split("\n")) if (line.includes("const changed = git(") || line.includes("const added = git(")) {
      edits.push([line, line.replace(".filter(p => !", '.filter(p => { if (p !== ' + JSON.stringify(helperPath) + ') return true; if (hash(read(p)) !== ' + JSON.stringify(helperSHA) + ') throw Error("GHL quiz answer block helper SHA mismatch"); return false; }).filter(p => !')]);
    }
    edits.push([first, first + ' import { inverseHormoneQuizGhlAnswerBlock } from "./fixtures/hormoneQuizGhlAnswerBlockScope";']);
    const fixtureGit = "const git = (...args: string[]) => execFileSync(\"git\", args, { cwd: root, encoding: \"utf8\" }).split(\"\\n\").filter(Boolean);";
    edits.push([fixtureGit, "const git = (...args: string[]) => execFileSync(\"git\", args, { cwd: root, encoding: \"utf8\" }).split(\"\\n\").filter(Boolean).filter(p => { if (args[0] !== \"diff\" || args.at(-1) !== \"server/fixtures\" || p !== \"server/fixtures/hormoneQuizGhlAnswerBlockScope.ts\") return true; if (hash(read(p)) !== \"36bad6875b176d1d7cb671b38e64d53f352f38fb3a42969fcb98b9f4b48058b3\") throw Error(\"GHL quiz answer block helper SHA mismatch\"); return false; });"]);
  }
  if (p === "server/hormoneQuizIntegration.test.ts") {
    const line = original.split("\n")[58];
    edits.push([line, line.replace('["first_name","last_name","email","phone","tags","source","submitted_at"]', '["first_name","last_name","email","phone","tags","source","submitted_at","quiz_answers"]')]);
  }
  return edits;
}

describe("GHL quiz answer block — latest exact eight-field authorized scope", () => {
  it("reconstructs the whole service to520dd6a1 from exactly two fixed fragments and pinned source SHAs", () => {
    const original = before(servicePath), current = read(servicePath);
    expect(fragments).toHaveLength(2); expect(hash(original)).toBe(baselineSHA); expect(hash(current)).toBe(currentSHA);
    let expected = original;
    for (const f of fragments) {
      expect(original.split(f.old).length - 1).toBe(1); expect(current.split(f.new).length - 1).toBe(1);
      expected = expected.replace(f.old, f.new);
    }
    expect(current).toBe(expected);
    for (const p of aliases) {
      expect(inverseHormoneQuizGhlAnswerBlock(p, current)).toBe(original);
      expect(inverseHormoneQuizGhlAnswerBlock(p, original)).toBe(original);
      expect(inverseHormoneQuizGhlAnswerBlock(p, inverseHormoneQuizGhlAnswerBlock(p, current))).toBe(original);
    }
    const outside = (s: string, side: "old" | "new") => fragments.reduce((text, f, i) => text.replace(f[side], `FIXED_FRAGMENT_${i}`), s);
    expect(outside(current, "new")).toBe(outside(original, "old"));
  });

  it("rejects missing duplicated mixed tampered and ambiguous fragments without hiding unrelated bytes or paths", () => {
    const current = read(servicePath), original = before(servicePath), malformed = [""];
    for (const f of fragments) malformed.push(current.replace(f.new, ""), current + f.new, current + f.old, original + f.old, original + f.new, original.replace(f.old, ""), current.replace(f.new, f.old), current.replace(f.new, f.new.slice(0, 1) + "UNAPPROVED" + f.new.slice(1)));
    for (const p of aliases) {
      for (const bad of malformed) expect(() => inverseHormoneQuizGhlAnswerBlock(p, bad)).toThrow("GHL quiz answer block scope mismatch");
      expect(inverseHormoneQuizGhlAnswerBlock(p, "UNAPPROVED\n" + current)).toBe("UNAPPROVED\n" + original);
      expect(hash(inverseHormoneQuizGhlAnswerBlock(p, current + "\nUNAPPROVED"))).not.toBe(baselineSHA);
    }
    for (const p of [servicePath + ".bak", "server/other.ts", "other/" + servicePath + ".copy"]) {
      expect(inverseHormoneQuizGhlAnswerBlock(p, current)).toBe(current);
      expect(inverseHormoneQuizGhlAnswerBlock(p, "")).toBe("");
    }
  });

  it("pins the pure new helper and all24 prior fixtures while permitting no unrelated production or inventory additions", () => {
    const source = read(helperPath);
    expect(hash(source)).toBe(helperSHA);
    expect(JSON.parse(source.split("\n")[1].slice("const fragments = ".length, -1))).toEqual(fragments);
    expect(source.split("\n").slice(2).join("\n")).not.toMatch(/\b(?:describe|it|test)\s*\(|\bimport\s|\brequire\s*\(|readFile|writeFile|execFile|fetch\(|process\.|XMLHttpRequest|sendBeacon/);
    const prior = lines(git("ls-tree", "-r", "--name-only", baseline, "--", "server/fixtures"));
    expect(prior).toHaveLength(24);
    for (const p of prior) expect(read(p), p).toBe(before(p));
    const scope = ["client", "server", "shared", "drizzle", ".gitignore", "vite.config.ts", "vitest.config.ts", "package.json", "pnpm-lock.yaml", "tsconfig.json"];
    const changed = lines(git("diff", "--name-only", baseline, "--", ...scope));
    expect(changed.filter(p => !/^server\/[^/]+\.test\.ts$/.test(p) && p !== helperPath).sort()).toEqual([servicePath]);
    const additions = lines(git("ls-files", "--others", "--exclude-standard", "--", ...scope));
    expect(additions.filter(p => p !== "server/hormoneQuizGhlAnswerBlock.test.ts" && p !== helperPath)).toEqual([]);
    for (const p of ["server/hormoneQuizModel.ts", "server/hormoneQuizStore.ts", "server/hormoneQuizPdf.ts", "server/hormoneQuizPrivateReport.ts", "server/hormoneQuizSecurity.ts", "server/hormoneQuizRoutes.ts", "server/routers/hormoneQuiz.ts", "client/quiz-webhook-transport.ts", "client/src/components/AdminQuizWebhooks.tsx", "client/public/hormone-symptom-quiz.html"]) expect(read(p), p).toBe(before(p));
    expect(read(servicePath)).not.toContain("fixtures/hormoneQuizGhlAnswerBlockScope");
  });

  it("exactly reverses39 historical files and80 edits preserving all old names lines assertion counts and delivery coverage after checkpoint", () => {
    const paths = lines(git("ls-tree", "-r", "--name-only", baseline, "--", "server")).filter(p => /^server\/[^/]+\.test\.ts$/.test(p));
    let files = 0, pairs = 0;
    for (const p of paths) {
      const original = before(p), edits = historicalEdits(p, original), current = read(p);
      if (edits.length) files++;
      pairs += edits.length;
      let expected = original, reconstructed = current;
      for (const [old, next] of edits) { expect(expected.split(old).length - 1, p).toBe(1); expected = expected.replace(old, next); }
      expect(current, p).toBe(expected);
      for (const [old, next] of [...edits].reverse()) { expect(reconstructed.split(next).length - 1, p).toBe(1); reconstructed = reconstructed.replace(next, old); }
      expect(reconstructed, p).toBe(original);
      expect(current.split("\n").length, p).toBe(original.split("\n").length);
      expect(declarations(current), p).toEqual(declarations(original));
      expect(assertions(current), p).toBe(assertions(original));
    }
    expect(files).toBe(39); expect(pairs).toBe(80);
    const integration = read("server/hormoneQuizIntegration.test.ts");
    expect(integration.split("\n")).toHaveLength(101);
    expect(integration.slice(integration.indexOf(' it("retries each failed destination'))).toBe(before("server/hormoneQuizIntegration.test.ts").slice(before("server/hormoneQuizIntegration.test.ts").indexOf(' it("retries each failed destination')));
  });

  it("emits exactly8 flat string keys with the original seven unchanged and no PDF score ID group summary or arbitrary fields", () => {
    const r = { ...record(), unexpectedHealth: "DO_NOT_SEND", adminSecret: "DO_NOT_SEND_SECRET", answers: [{ id: "PRIVATE_ANSWER_ID", section: "PRIVATE_SECTION", question: "PRIVATE_QUESTION", answer: "PRIVATE_ANSWER" }] } as StoredQuizRecord;
    const payload = buildGhlQuizPayload(r), json = JSON.stringify(payload);
    expect(exactKeys).toHaveLength(8); expect(Object.keys(payload)).toEqual(exactKeys);
    expect(Object.entries(payload).slice(0, 7)).toEqual(Object.entries({ first_name: r.first_name, last_name: r.last_name, email: r.email, phone: r.phone, tags: "quiz-completed", source: "hormone-symptom-quiz", submitted_at: r.submitted_at }));
    expect(Object.values(payload).every(v => typeof v === "string")).toBe(true);
    expect(payload.quiz_answers).toBe(formatGhlQuizAnswers(r));
    for (const key of ["quiz_id", "balance_index", "score_band", "symptom_group", "quiz_answers_summary", "report_pdf_url", "report_document_name", "report_expires_at", "fingerprint", "is_test", "name", "answers", "selections", "unexpectedHealth", "adminSecret", "event", "q01_age", "q30_first_priority"]) expect(payload).not.toHaveProperty(key);
    for (const value of [r.quiz_id, "PRIVATE_PDF_TOKEN", "PRIVATE_DOCUMENT_NAME", "PRIVATE_FINGERPRINT", "PRIVATE_NAME", "PRIVATE_ANSWER_ID", "PRIVATE_SECTION", "PRIVATE_QUESTION", "PRIVATE_ANSWER", "DO_NOT_SEND", "DO_NOT_SEND_SECRET"]) expect(json).not.toContain(value);
  });

  it("pins all30 full core question texts and order with exact literalbr answer lines blank lines and no other HTML", () => {
    expect(pinnedQuestions).toHaveLength(30);
    expect(QUIZ_QUESTIONS.filter(q => q.id !== "recognize" && !q.conditional).map(q => [q.id, q.text])).toEqual(pinnedQuestions);
    const r = record(), expected = [`Hormone Symptom Quiz – completed 11/09/2026`, `Balance Index: ${r.balance_index}/100 (${r.score_band})`, ""];
    pinnedQuestions.forEach(([id, text], i) => {
      const q = core[i], value = r.selections[id];
      expected.push(`${i + 1}. ${text}`, "Answer: " + (Array.isArray(value) ? value.map(n => q.opts[n][0]).join(", ") : q.opts[value][0]));
      if (i < 29) expected.push("");
    });
    const block = buildGhlQuizPayload(r).quiz_answers;
    expect(block).toBe(expected.join("<br>"));
    expect(block.split("<br>")).toHaveLength(92); expect(block.match(/<br>/g)).toHaveLength(91);
    expect(block.match(/<br><br>/g)).toHaveLength(30);
    expect(block).not.toMatch(/[\r\n]|<br\s*\/\s*>|<BR>|<br\s+>|<br><br><br>|<\/(?:p|div)>|&lt;br&gt;/);
    expect(block.replaceAll("<br>", "")).not.toMatch(/[<>]/);
    expect(block.endsWith("<br>")).toBe(false);
    expect(questionLines(r).filter(l => /^\d+\. /.test(l))).toEqual(pinnedQuestions.map(([, text], i) => `${i + 1}. ${text}`));
  });

  it("uses the submittedISO UTC calendar date and actual BalanceIndex and band including zero100 and missing index", () => {
    for (const [submitted_at, date] of [["2026-01-01T00:00:00.000Z", "01/01/2026"], ["2026-12-31T23:59:59.999Z", "12/31/2026"], ["2024-02-29T00:01:00.000Z", "02/29/2024"]]) {
      for (const balance_index of [0, 1, 73, 100, null]) {
        const score_band = balance_index === null ? "Insufficient data" : "Actual stored band";
        const r = { ...record(), submitted_at, balance_index, score_band };
        expect(formatGhlQuizAnswers(r).split("<br>").slice(0, 3)).toEqual([`Hormone Symptom Quiz – completed ${date}`, `Balance Index: ${balance_index === null ? "No answer" : balance_index + "/100"} (${score_band})`, ""]);
        expect(buildGhlQuizPayload(r).submitted_at).toBe(submitted_at);
      }
    }
  });

  it("uses exact readable labels for every single choice including skipped options never numeric selection indices", () => {
    for (let qIndex = 0; qIndex < core.length; qIndex++) {
      const q = core[qIndex]; if (q.multi) continue;
      for (let n = 0; n < q.opts.length; n++) {
        const r = record({ ...createTestQuizAnswers(), [q.id]: n });
        const answer = questionLines(r)[qIndex * 3 + 1];
        expect(answer, `${q.id}:${n}`).toBe(`Answer: ${q.opts[n][0]}`);
        expect(answer).not.toBe(`Answer: ${n}`);
      }
    }
  });

  it("joins multis comma-space in selected order uses Noanswer for missing choices and excludes Quickcheck and conditional answers", () => {
    const selections = { ...createTestQuizAnswers(), weird: [11, 0, 7, 1], weirdWorst: 2, recognize: [1, 2, 3, 10] };
    const r = record(validateQuizAnswers(selections)), block = formatGhlQuizAnswers(r);
    expect(questionLines(r)[37]).toBe("Answer: Headaches or migraines (new or worse), Itchy ears, Dizziness, A burning tongue or mouth");
    expect(block).not.toContain("; ");
    const q = core[12];
    for (let n = 0; n < q.opts.length; n++) expect(questionLines(record({ ...selections, weird: [n] }))[37]).toBe(`Answer: ${q.opts[n][0]}`);
    expect(block).not.toContain("Which of these have you noticed?"); expect(block).not.toContain("Which one of those bothers you most?"); expect(block).not.toContain("Quick check");
    for (const variant of [{ ...selections, recognize: [12], weirdWorst: 0 }, (() => { const copy: QuizAnswers = { ...selections }; delete copy.recognize; delete copy.weirdWorst; return copy; })()]) expect(formatGhlQuizAnswers(record(variant))).toBe(block);
    const none = formatGhlQuizAnswers(record({}));
    expect(none.match(/Answer: No answer/g)).toHaveLength(30);
    expect(questionLines(record({})).filter(l => l.startsWith("Answer:"))).toEqual(Array(30).fill("Answer: No answer"));
    for (const value of [[], [999], 999]) expect(questionLines(record({ ...selections, weird: value }))[37]).toBe("Answer: No answer");
    expect(Object.keys(buildGhlQuizPayload(record({})))).toEqual(exactKeys);
  });

  it("preserves Keragon builder source JSON all32 answer semantics and record immutability with no new delivery behavior", () => {
    const r = record(), snapshot = JSON.stringify(r);
    const expected = { event: "mmd_quiz.completed", quiz_id: r.quiz_id, submitted_at: r.submitted_at, first_name: r.first_name, last_name: r.last_name, email: r.email, phone: r.phone, balance_index: r.balance_index, score_band: r.score_band, answers: r.answers.map(a => ({ id: a.id, section: a.section, question: a.question, answer: a.answer })), report_pdf_url: r.report_pdf_url, report_document_name: r.report_document_name };
    expect(JSON.stringify(buildKeragonQuizPayload(r))).toBe(JSON.stringify(expected));
    expect(buildKeragonQuizPayload(r).answers).toHaveLength(32);
    expect(buildKeragonQuizPayload(r).answers.find(a => a.id === "weird")?.answer).toBe("Itchy ears; A burning tongue or mouth");
    expect(buildKeragonQuizPayload(r).answers.map(a => a.id)).toContain("recognize"); expect(buildKeragonQuizPayload(r).answers.map(a => a.id)).toContain("weirdWorst");
    const builder = (s: string) => s.split("\n").find(l => l.startsWith("export function buildKeragonQuizPayload"));
    expect(builder(read(servicePath))).toBe(builder(before(servicePath)));
    const delivery = (s: string) => s.slice(s.indexOf("export type QuizServiceDependencies="));
    expect(delivery(read(servicePath))).toBe(delivery(before(servicePath)));
    formatGhlQuizAnswers(r); buildGhlQuizPayload(r); expect(JSON.stringify(r)).toBe(snapshot);
  });
});
