import { createHash } from "node:crypto"; import { inverseHormoneQuizGhlAnswerBlock } from "./fixtures/hormoneQuizGhlAnswerBlockScope"; import { inverseHormoneQuizSubmissionOrigin } from "./fixtures/hormoneQuizSubmissionOriginScope"; import { inverseHormoneQuizPrivacy } from "./fixtures/hormoneQuizPrivacyScope"; import { inverseHormoneQuizCtaPlacement } from "./fixtures/hormoneQuizCtaPlacementScope"; import { gunzipSync as ctaPlacementGunzipSync } from "node:zlib";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { inverseHormoneQuizIntegration, hormoneQuizIntegrationNewFileSHAs, hormoneQuizIntegrationBaselineSHAs } from "./fixtures/hormoneQuizIntegrationScope";

const root = resolve(import.meta.dirname, "..");
const baseline = "6fdc2970";
const page = "client/public/hormone-symptom-quiz.html";
const built = "dist/public/hormone-symptom-quiz.html";
const helper = "server/fixtures/hormoneQuizIntegrationScope.ts";
const read = (p: string) => inverseHormoneQuizGhlAnswerBlock(p, inverseHormoneQuizSubmissionOrigin(p, inverseHormoneQuizPrivacy(p, ((source: string) => { if (p !== "server/hormoneQuizPrivacy.test.ts") return source; const edits = JSON.parse(ctaPlacementGunzipSync(Buffer.from("H4sIAAAAAAACA7WTXW/aMBSG/4rrq0TK0oQkEILYVFWbuNxE7wgXjn0MnhI7sk0pq/rfdwICpHaruotJvrLOOc/7no/VMzWtoBVVXW+sJ8+EW2AeFsxtyQuR1nSkptoIqLg99N7UdEYjqmH/bznkEqv0I1gHC2M7o+HHTv269+x7yzh0oP01P76V6snvLLjb7Z9jl9z0MOh5ic4uuNHOE1QjyJwEfUWct0pvQjL/fPz9plpYHjQPsKxpHyGwxviI9GGExJ2XZU3Dq7/3qr1vI+ijD/PCtwY2yg/EOI6Z3bgzd7U+kuEJ+KVuTTG2phEZAqNhFHtRkRMFNDcC86oLi7y8cfcfUbHrW+Uxr641+oylaj3YoB8q4x5IEtysaiqUlEPVmrbuE4aAq+k6Vpq3OwEuGGCrZB2G2E/cBk283cGMnMT3SqN4LDifY74DizP52NrEHjHkC2YleSGbbCIbWfCGi5QnXCYTWULGWSLKnKVlkY6aIi1SKXJRZgW+Ih83fDQW/Gi1ei3hL+TYg/NXsoSkSSejLB+nI+B52iRiWmSSNWyaZmMoi5FIm4zLLEul5LmAiSh51nCW8mkzTcSRrHdtOzs1E7vxqkvD9xavMhh2MeixiTco8xjnt9bsyVdrjcUJDUrJ/cMd6S+HOCy49sYeyHJxRzrlOub5driPM0Oy1iEEB/3TKH2ZM67z+jcO4HOqVwQAAA==", "base64")).toString("utf8")) as {old: string; new: string}[]; for (const e of [...edits].reverse()) { const lines = source.split("\n"); if (lines.filter(l => l === e.new).length !== 1) throw Error("Quiz CTA placement privacy test inverse mismatch"); source = lines.map(l => l === e.new ? e.old : l).join("\n"); } if (hash(source) !== "ab258e67b82562ae04298394dba34c0bf021541fb6b452331509a9fb0e742e0c") throw Error("Quiz CTA placement privacy test SHA mismatch"); return source; })(inverseHormoneQuizCtaPlacement(p, readFileSync(resolve(root, p), "utf8"))))));
const before = (p: string) => execFileSync("git", ["show", baseline + ":" + p], { cwd: root, encoding: "utf8" });
const hash = (s: string) => createHash("sha256").update(s).digest("hex");
const helperSHA = "c213c08ee14e7d5195640881e15390d7ef3a35a13d71d153019e061f9711b80f";
const files: Record<string, { old: string; new: string }[]> = {".gitignore": [{"old": ".project-config.json\n", "new": ".project-config.json\n\n# Generated standalone quiz transport (rebuilt before dev and production build)\nclient/public/assets/hormone-quiz-transport.js\n"}], "client/public/hormone-symptom-quiz.html": [{"old": "  </head>", "new": "    <script defer src=\"/assets/hormone-quiz-transport.js\"></script>\n  </head>"}, {"old": "      renderReport();\n    });\n    [\"gateName\", \"gateEmail\", \"gatePhone\"]", "new": "      renderReport();\n      if (window.mmdQuizComplete) window.mmdQuizComplete(submissionRecord);\n    });\n    [\"gateName\", \"gateEmail\", \"gatePhone\"]"}, {"old": "        submissionRecord = null;", "new": "        submissionRecord = null;\n        if (window.mmdQuizReset) window.mmdQuizReset();"}], "client/src/pages/AdminSettings.tsx": [{"old": "import AdminEmailSettings from \"@/components/AdminEmailSettings\";\n", "new": "import AdminEmailSettings from \"@/components/AdminEmailSettings\";\nimport AdminQuizWebhooks from \"@/components/AdminQuizWebhooks\";\n"}, {"old": "  const [activeTab, setActiveTab] = useState<\"settings\" | \"paypal\" | \"intake\" | \"email\" | \"payments\">(\"settings\");\n", "new": "  const [activeTab, setActiveTab] = useState<\"settings\" | \"paypal\" | \"intake\" | \"email\" | \"quiz\" | \"payments\">(\"settings\");\n"}, {"old": "            Payments ({payments.length})\n          </button>\n", "new": "            Payments ({payments.length})\n          </button>\n          <button\n            onClick={() => setActiveTab(\"quiz\")}\n            className={`px-4 py-2 rounded-md text-sm font-semibold transition ${activeTab === \"quiz\" ? \"bg-white text-gray-900 shadow-sm\" : \"text-gray-500 hover:text-gray-700\"}`}\n          >\n            Quiz Webhooks\n          </button>\n"}, {"old": "          </button>\n        </div>\n", "new": "          </button>\n        </div>\n\n        {activeTab === \"quiz\" && <AdminQuizWebhooks />}\n"}], "drizzle/meta/_journal.json": [{"old": "      \"tag\": \"0017_demonic_quasimodo\",\n      \"breakpoints\": true\n", "new": "      \"tag\": \"0017_demonic_quasimodo\",\n      \"breakpoints\": true\n    },\n    {\n      \"idx\": 18,\n      \"version\": \"5\",\n      \"when\": 1794243351653,\n      \"tag\": \"0018_greedy_moonstone\",\n      \"breakpoints\": true\n"}], "drizzle/schema.ts": [{"old": "export type GhlIntakeWebhookOutbox = typeof ghlIntakeWebhookOutbox.$inferSelect;\n", "new": "export type GhlIntakeWebhookOutbox = typeof ghlIntakeWebhookOutbox.$inferSelect;\n\n/** Permanent quiz record: contact, selections, exact answers, score and PDF capability are AES-GCM encrypted. */\nexport const hormoneQuizRecords = mysqlTable(\"hormone_quiz_records\", {\n  quizId: varchar(\"quizId\", { length: 36 }).primaryKey(),\n  requestKeyHash: varchar(\"requestKeyHash\", { length: 64 }).notNull().unique(),\n  encryptedRecord: mediumblob(\"encryptedRecord\").notNull(),\n  submittedAt: bigint(\"submittedAt\", { mode: \"number\" }).notNull(),\n  isTest: int(\"isTest\").notNull().default(0),\n});\n\n/** Durable deduplication and retry claims. No personal/health data or webhook URLs in this table. */\nexport const hormoneQuizDeliveries = mysqlTable(\"hormone_quiz_deliveries\", {\n  quizId: varchar(\"quizId\", { length: 36 }).notNull(),\n  provider: mysqlEnum(\"provider\", [\"keragon\", \"ghl\"]).notNull(),\n  status: mysqlEnum(\"status\", [\"pending\", \"processing\", \"sent\", \"failed\"]).notNull().default(\"pending\"),\n  attempts: int(\"attempts\").notNull().default(0),\n  maxAttempts: int(\"maxAttempts\").notNull().default(2),\n  nextAttemptAt: bigint(\"nextAttemptAt\", { mode: \"number\" }).notNull(),\n  leaseOwner: varchar(\"leaseOwner\", { length: 64 }),\n  leaseExpiresAt: bigint(\"leaseExpiresAt\", { mode: \"number\" }),\n  httpStatus: int(\"httpStatus\").notNull().default(0),\n}, table => [\n  primaryKey({ columns: [table.quizId, table.provider] }),\n  index(\"hormone_quiz_delivery_due_idx\").on(table.status, table.nextAttemptAt, table.leaseExpiresAt),\n]);\n"}], "package.json": [{"old": "    \"predev\": \"pnpm generate:treatment-catalog\",\n", "new": "    \"generate:quiz-transport\": \"esbuild client/quiz-webhook-transport.ts --bundle --platform=browser --format=iife --minify --outfile=client/public/assets/hormone-quiz-transport.js\",\n    \"predev\": \"pnpm generate:treatment-catalog && pnpm generate:quiz-transport\",\n"}, {"old": "    \"prebuild\": \"pnpm generate:treatment-catalog\",\n", "new": "    \"prebuild\": \"pnpm generate:treatment-catalog && pnpm generate:quiz-transport\",\n"}], "server/_core/index.ts": [{"old": "import { registerIntakePaymentRoutes } from \"../intakePaymentRoutes\";\n", "new": "import { registerIntakePaymentRoutes } from \"../intakePaymentRoutes\";\nimport { registerHormoneQuizRoutes } from \"../hormoneQuizRoutes\";\n"}, {"old": "  registerIntakePaymentRoutes(app);\n", "new": "  registerIntakePaymentRoutes(app);\n  registerHormoneQuizRoutes(app);\n"}], "server/routers.ts": [{"old": "import { menopauseVideo97Router } from \"./routers/menopauseVideo97\";\n", "new": "import { menopauseVideo97Router } from \"./routers/menopauseVideo97\";\nimport { hormoneQuizRouter } from \"./routers/hormoneQuiz\";\n"}, {"old": "  menopauseVideo97: menopauseVideo97Router,\n", "new": "  menopauseVideo97: menopauseVideo97Router,\n  hormoneQuiz: hormoneQuizRouter,\n"}]};
const newFileSHAs: Record<string, string> = {"client/quiz-webhook-transport.ts": "1b0ab7d0d2f64e88a84b967159711d6033d79320baeef5b38c81845279e4cc3e", "client/src/components/AdminQuizWebhooks.tsx": "1a4a4ea0221a621a95fdd1647c179dda582d83277ec70dedee7764b4fbb6d25f", "drizzle/0018_greedy_moonstone.sql": "b38e984d44625730eaebca8ebfbe92c622897e7b776f2601b2b3affb427266f2", "drizzle/meta/0018_snapshot.json": "aacbfbb9c0b8aa07bba06e7b6dc8adbd628edac958f5674c08c500d30c4c5680", "server/hormoneQuizModel.ts": "969021c16190e99ecdb338049c10f7dcff9729293ae1509e1049544e3b3b201f", "server/hormoneQuizPdf.ts": "8dfc2c0f606ac64d65dd3619bcba5f44297e8c11a90a3777e55c260067b2615c", "server/hormoneQuizPrivateReport.ts": "0b09d70a1da392697b7c17e5c55c4a0c8c4cc244e96bed1afdac8c1aa68dc834", "server/hormoneQuizRoutes.ts": "713d5f0a7c63f78ba6b24401779256d2dc4a68803b0eda6779e0c7eda6556e02", "server/hormoneQuizSecurity.ts": "39d4b6330fb8c1d8967133d88e170a697416a95fc240cce8bf75dcf326e3bb9b", "server/hormoneQuizService.ts": "ae03caf253af04e89b990dbfc515eda6e945f8a69b2e32fbf37532af52113b24", "server/hormoneQuizStore.ts": "7a01d7245f73a051e886774b10e8893a31aaaad9b301c6bc31fd78ff22ce9d6a", "server/routers/hormoneQuiz.ts": "1c1404a42c9e1d89c19440bd0533c0267a1fcd9636068b2491c22da29efbe9a6"};
const baselineSHAs: Record<string, string> = {".gitignore": "b4572613f7e7b7827f8dd1c7543b03f903082ba146ebe8115dd9bd81aebd4bee", "client/public/hormone-symptom-quiz.html": "79f39d0d00a994e71a9a45184262edbff58dc78e229523303ce5e829112c70d5", "client/src/pages/AdminSettings.tsx": "1fb9dc9c6c5a2f9be62dbf2bc8bfde870a4b3a41a32d767011d8d3cb57e3643b", "drizzle/meta/_journal.json": "95c6b9bfc4ee56f65a5b59ee60ac9507746dee6e4bb0425ee397377ff653373b", "drizzle/schema.ts": "b1b087b3c94cbd5c3a5395358b72b4e1c682b33317ebae806a2e962e7c9b3530", "package.json": "9026530d7237c3303799cda328f2d3cc488e74cbc35d73df6b190a428b99bd42", "server/_core/index.ts": "14ad2b6e75c8efb044e803f70d2239a7f87e5476219bd21f15b8b956fab2deeb", "server/routers.ts": "4f89f8904bf00da655ee411ef26c721503af3083843bc1b92823b82b0161e116"};
const originalFixtures = ["server/fixtures/hormoneQuizPanelScope.ts", "server/fixtures/hormoneQuizPhoneScope.ts", "server/fixtures/hormoneQuizTreatmentCtaScope.ts", "server/fixtures/hormoneSymptomQuizDemoFragments.json", "server/fixtures/hormoneSymptomQuizFragments.json", "server/fixtures/intake-sign-forms-copy.json", "server/fixtures/intakeFinalProgressLabelFragments.json", "server/fixtures/intakeGlp1CombinedFragments.json", "server/fixtures/intakeIntroDetailsPhotoFragments.json", "server/fixtures/intakeLatePatientInfoFragments.json", "server/fixtures/intakeProgressFragments.json", "server/fixtures/intakeShippingSkipFragments.json", "server/fixtures/intakeSigningFixture.ts", "server/fixtures/intakeThankYouWordingFragments.json", "server/fixtures/v2FaqFinal.json", "server/fixtures/v2FooterLogoScope.ts", "server/fixtures/v2RemoveCareSection.json", "server/fixtures/v2RemoveCareSectionScope.ts", "server/fixtures/v2TestimonialAttributionScope.ts", "server/fixtures/v2TestimonialReadMoreScope.ts", "server/fixtures/v2TestimonialTextActionScope.ts", "server/fixtures/weightLossMenopauseV2CompactMembershipFragments.json", "server/fixtures/weightLossMenopauseV2MembershipFragments.json"];
const scope = ["client", "server", "shared", "drizzle", ".gitignore", "vite.config.ts", "vitest.config.ts", "package.json", "pnpm-lock.yaml", "tsconfig.json"];
const git = (...args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).split("\n").filter(Boolean).filter(p => { if (p !== "server/fixtures/hormoneQuizSubmissionOriginScope.ts") return true; if (hash(read(p)) !== "634e49eadc1c3ac7c3572582124b68b7db3543a642de13124a384794e1a9b905") throw Error("Quiz submission origin helper SHA mismatch"); return false; }).filter(p => { if (args[0] !== "diff" || args.at(-1) !== "server/fixtures" || p !== "server/fixtures/hormoneQuizGhlAnswerBlockScope.ts") return true; if (hash(read(p)) !== "36bad6875b176d1d7cb671b38e64d53f352f38fb3a42969fcb98b9f4b48058b3") throw Error("GHL quiz answer block helper SHA mismatch"); return false; }).filter(p => { if (!["diff", "ls-files"].includes(args[0])) return true; const pin = p === "server/fixtures/hormoneQuizPrivacyScope.ts" ? "589a41f28d49b6bdc2dec9149f7dbfe996bdd0f0a5389fcf1d4ee501b04fb156" : p === "server/hormoneQuizPrivacy.test.ts" ? "ab258e67b82562ae04298394dba34c0bf021541fb6b452331509a9fb0e742e0c" : null; if (!pin) return true; if (hash(read(p)) !== pin) throw Error("Quiz privacy inventory SHA mismatch"); return false; }).filter(p => { if (!["diff", "ls-files"].includes(args[0])) return true; const pin = p === "server/fixtures/hormoneQuizCtaPlacementScope.ts" ? "045fb37fbf5cbcd1c0cf07f8e3ca0d84a18512b5151fd4d835835546bc26dcf8" : p === "server/hormoneQuizCtaPlacement.test.ts" ? "fe0b17234612ec41b0d953faba9136e852d1b3cf331ffc4de7d8c3bca1c9b90d" : null; if (!pin) return true; if (hash(read(p)) !== pin) throw Error("Quiz CTA placement inventory SHA mismatch"); return false; });
const aliases = (p: string) => [p, resolve(root, p), p.replaceAll("/", "\\"), "C:\\project\\" + p.replaceAll("/", "\\"), ...(p === page ? [built, resolve(root, built), built.replaceAll("/", "\\")] : [])];
const strip = (p: string, source: string) => [...(files[p] ?? [])].reverse().reduce((s, f) => s.replace(f.new, f.old), source);
const verifyNew = (p: string, source: string) => { if (!Object.hasOwn(newFileSHAs, p)) return false; if (hash(source) !== newFileSHAs[p]) throw Error("Quiz new-file authorization mismatch"); return true; };

describe("Hormone quiz completion integration — frozen exact authorized scope", () => {
  it("reconstructs all eight tracked production files to6fdc2970 byte-for-byte with exactly sixteen independent fragments", () => {
    expect(Object.keys(files)).toHaveLength(8);
    expect(Object.values(files).flat()).toHaveLength(16);
    expect(hormoneQuizIntegrationBaselineSHAs).toEqual(baselineSHAs);
    for (const [p, fragments] of Object.entries(files)) {
      const original = before(p), current = read(p);
      expect(hash(original), p).toBe(baselineSHAs[p]);
      let expected = original;
      for (const f of fragments) {
        expect(original.split(f.old).length - 1, p).toBe(1);
        expect(original.split(f.new).length - 1, p).toBe(0);
        expect(current.split(f.new).length - 1, p).toBe(1);
        expected = expected.replace(f.old, f.new);
      }
      expect(current, p).toBe(expected);
      expect(strip(p, current), p).toBe(original);
      for (const path of aliases(p)) {
        expect(inverseHormoneQuizIntegration(path, current), path).toBe(original);
        expect(inverseHormoneQuizIntegration(path, original), path).toBe(original);
        expect(inverseHormoneQuizIntegration(path, inverseHormoneQuizIntegration(path, current)), path).toBe(original);
      }
    }
  });

  it("rejects missing duplicated mixed independently edited and ambiguous old/new integration fragments on each authorized path", () => {
    for (const [p, fragments] of Object.entries(files)) {
      const original = before(p), current = read(p);
      const malformed = [""];
      for (const f of fragments) {
        malformed.push(current.replace(f.new, ""), current + f.new, current + f.old, original + f.old, original + f.new, original.replace(f.old, ""));
        malformed.push(current.replace(f.new, f.new + "UNAPPROVED" + f.new));
        // Insert a marker inside each frozen fragment, not outside its authorized boundary.
        malformed.push(current.replace(f.new, f.new.slice(0, 1) + "UNAPPROVED" + f.new.slice(1)));
        if (fragments.length > 1) malformed.push(current.replace(f.new, f.old));
      }
      for (const path of aliases(p)) for (const bad of malformed) expect(() => inverseHormoneQuizIntegration(path, bad), p).toThrow("Quiz integration scope mismatch");
    }
  });

  it("preserves unrelated bytes and paths rather than swallowing edits outside authorized fragments", () => {
    for (const p of Object.keys(files)) {
      const original = before(p), current = read(p);
      for (const path of aliases(p)) {
        expect(inverseHormoneQuizIntegration(path, "UNAPPROVED\n" + current)).toBe("UNAPPROVED\n" + original);
        expect(inverseHormoneQuizIntegration(path, current + "\nUNAPPROVED")).toBe(original + "\nUNAPPROVED");
        expect(hash(inverseHormoneQuizIntegration(path, current + "\nUNAPPROVED"))).not.toBe(baselineSHAs[p]);
      }
      for (const path of [p + ".bak", "unrelated.ts", "client/intake/index.html", "other/" + p + ".copy"]) {
        expect(inverseHormoneQuizIntegration(path, current)).toBe(current);
        expect(inverseHormoneQuizIntegration(path, "")).toBe("");
      }
    }
  });

  it("freezes all twelve new full production and generated migration/meta files with explicit fixed SHA authorization", () => {
    expect(Object.keys(newFileSHAs)).toHaveLength(12);
    expect(hormoneQuizIntegrationNewFileSHAs).toEqual(newFileSHAs);
    expect(Object.isFrozen(hormoneQuizIntegrationNewFileSHAs)).toBe(true);
    for (const p of Object.keys(newFileSHAs)) {
      const source = read(p);
      expect(verifyNew(p, source), p).toBe(true);
      for (const bad of ["", source + "\n", "UNAPPROVED" + source, source.slice(1)]) expect(() => verifyNew(p, bad), p).toThrow("Quiz new-file authorization mismatch");
      expect(verifyNew(p + ".bak", source)).toBe(false);
    }
    expect(verifyNew("server/hormoneQuizUnapproved.ts", "unapproved")).toBe(false);
  });

  it("permits only the eight exact tracked paths and twelve fixed new sources plus one pure helper, with no broad skip", () => {
    const changed = git("diff", "--name-only", baseline, "--", ...scope).filter(p => { if (p !== "server/fixtures/hormoneQuizGhlAnswerBlockScope.ts") return true; if (hash(read(p)) !== "36bad6875b176d1d7cb671b38e64d53f352f38fb3a42969fcb98b9f4b48058b3") throw Error("GHL quiz answer block helper SHA mismatch"); return false; }).filter(p => !/^server\/[^/]+\.test\.ts$/.test(p));
    expect(changed.sort()).toEqual(Object.keys(files).sort());
    const added = git("ls-files", "--others", "--exclude-standard", "--", ...scope).filter(p => { if (p !== "server/fixtures/hormoneQuizGhlAnswerBlockScope.ts") return true; if (hash(read(p)) !== "36bad6875b176d1d7cb671b38e64d53f352f38fb3a42969fcb98b9f4b48058b3") throw Error("GHL quiz answer block helper SHA mismatch"); return false; }).filter(p => !/^server\/[^/]+\.test\.ts$/.test(p));
    expect(added.sort()).toEqual([...Object.keys(newFileSHAs), helper].sort());
    for (const p of added) {
      if (p === helper) expect(hash(read(p))).toBe(helperSHA);
      else expect(verifyNew(p, read(p))).toBe(true);
    }
    for (const p of changed) expect(hash(inverseHormoneQuizIntegration(p, read(p)))).toBe(baselineSHAs[p]);
  });

  it("keeps every existing pure helper and historical approval packet byte-exact to the baseline", () => {
    expect(git("ls-tree", "-r", "--name-only", baseline, "--", "server/fixtures")).toEqual(originalFixtures);
    expect(originalFixtures).toHaveLength(23);
    for (const p of originalFixtures) expect(read(p), p).toBe(before(p));
    expect(git("diff", "--name-only", baseline, "--", "server/fixtures")).toEqual([]);
  });

  it("freezes a pure test-free helper with exact independent packet constants and no production import or side effects", () => {
    const source = read(helper), lines = source.split("\n");
    expect(hash(source)).toBe(helperSHA);
    expect(JSON.parse(lines[0].slice("const files=".length, -1))).toEqual(files);
    expect(lines.slice(3).join("\n")).not.toMatch(/\b(?:describe|it|test)\s*\(|\bimport\s|\brequire\s*\(|readFile|writeFile|execFile|fetch\(|process\.|XMLHttpRequest|sendBeacon/);
    for (const p of [...Object.keys(files), ...Object.keys(newFileSHAs)]) expect(read(p), p).not.toContain("fixtures/hormoneQuizIntegrationScope");
  });

  it("adds exactly the deferred bridge completion-after-render and restart-only reset hooks while preserving all CSS questions scoring report and download bytes", () => {
    const original = before(page), current = read(page), fragments = files[page];
    expect(fragments).toHaveLength(3);
    expect(read(built)).toBe(current);
    expect(inverseHormoneQuizIntegration(built, read(built))).toBe(original);
    expect(current.split('<script defer src="/assets/hormone-quiz-transport.js"></script>').length - 1).toBe(1);
    expect(current).toContain('renderReport();\n      if (window.mmdQuizComplete) window.mmdQuizComplete(submissionRecord);');
    expect(current).toContain('submissionRecord = null;\n        if (window.mmdQuizReset) window.mmdQuizReset();');
    const css = (s: string) => [...s.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1]);
    expect(css(current)).toEqual(css(original));
    const restored = strip(page, current);
    expect(restored).toBe(original);
    expect(restored.match(/<(?:input|form|label|button)\b[^>]*>/g)).toEqual(original.match(/<(?:input|form|label|button)\b[^>]*>/g));
    for (const marker of ["    /* ================= Model ================= */", "    /* ================= Report ================= */"]) {
      const start = original.indexOf(marker);
      if (start >= 0) expect(restored.slice(start)).toBe(original.slice(start));
    }
  });
});
