import { createHash } from "node:crypto";
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
const read = (p: string) => readFileSync(resolve(root, p), "utf8");
const git = (...args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8" });
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
