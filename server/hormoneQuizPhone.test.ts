import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext, Script } from "node:vm";
import { describe, expect, it } from "vitest";
import { inverseHormoneQuizPhone } from "./fixtures/hormoneQuizPhoneScope";

const root = resolve(import.meta.dirname, "..");
const page = "client/public/hormone-symptom-quiz.html";
const built = "dist/public/hormone-symptom-quiz.html";
const helper = "server/fixtures/hormoneQuizPhoneScope.ts";
const helperSHA = "a1da7935b8aa5a94ea012f6b194339943f31bf799a066ed562bfba3c058fcb25";
const read = (p: string) => readFileSync(resolve(root, p), "utf8");
const before = (p: string) => execFileSync("git", ["show", "33d80aac:" + p], { cwd: root, encoding: "utf8" });
const fragments = [{"old": "      gateEl.classList.remove(\"hidden\");\n      window.scrollTo(0, 0);\n    }", "new": "      gateEl.classList.remove(\"hidden\");\n      formatGatePhone();\n      window.scrollTo(0, 0);\n    }"}, {"old": "    $(\"gateForm\").addEventListener(\"submit\", function(e){", "new": "    /* Gate phone display — match the existing US placeholder without changing validation or payload fields. */\n    function formatGatePhoneValue(value){\n      var digits = value.replace(/\\D/g, \"\");\n      if (/^\\s*\\+(?:1)?$/.test(value) || (/^\\s*\\+1/.test(value) && digits.length < 11)) return value;\n      if (digits.length === 11 && digits.charAt(0) === \"1\") digits = digits.slice(1);\n      // Do not truncate longer or unsupported numbers into an apparently valid US number.\n      if (digits.length > 10) return value;\n      if (!digits.length) return \"\";\n      if (digits.length <= 3) return \"(\" + digits;\n      if (digits.length <= 6) return \"(\" + digits.slice(0, 3) + \") \" + digits.slice(3);\n      return \"(\" + digits.slice(0, 3) + \") \" + digits.slice(3, 6) + \"-\" + digits.slice(6);\n    }\n    function formatGatePhone(event){\n      if (event && event.isComposing) return;\n      var input = $(\"gatePhone\"), value = input.value, formatted = formatGatePhoneValue(value);\n      if (formatted === value) return;\n      var start = input.selectionStart, end = input.selectionEnd;\n      var removedCountryCode = value.replace(/\\D/g, \"\").length === 11 && value.replace(/\\D/g, \"\").charAt(0) === \"1\" && formatted.replace(/\\D/g, \"\").length === 10;\n      function mappedCaret(position){\n        if (position === value.length) return formatted.length;\n        var count = value.slice(0, position).replace(/\\D/g, \"\").length - (removedCountryCode ? 1 : 0);\n        if (count <= 0) return formatted.charAt(0) === \"(\" ? 1 : 0;\n        for (var i = 0; i < formatted.length; i++) {\n          if (/\\d/.test(formatted.charAt(i)) && --count === 0) return i + 1;\n        }\n        return formatted.length;\n      }\n      input.value = formatted;\n      if (typeof start === \"number\" && typeof end === \"number\" && typeof input.setSelectionRange === \"function\") {\n        try { input.setSelectionRange(mappedCaret(start), mappedCaret(end)); } catch (ignore) {}\n      }\n    }\n    $(\"gatePhone\").addEventListener(\"beforeinput\", function(event){\n      var input = $(\"gatePhone\"), start = input.selectionStart, end = input.selectionEnd;\n      if (event.isComposing || start !== end || typeof start !== \"number\" || typeof input.setSelectionRange !== \"function\") return;\n      if (event.inputType === \"deleteContentBackward\") {\n        while (start > 0 && !/\\d/.test(input.value.charAt(start - 1))) start--;\n      } else if (event.inputType === \"deleteContentForward\") {\n        while (start < input.value.length && !/\\d/.test(input.value.charAt(start))) start++;\n      } else return;\n      try { input.setSelectionRange(start, start); } catch (ignore) {}\n    });\n    [\"input\", \"change\", \"blur\", \"compositionend\"].forEach(function(eventName){\n      $(\"gatePhone\").addEventListener(eventName, formatGatePhone);\n    });\n    $(\"gatePhone\").addEventListener(\"focus\", function(){ formatGatePhone(); setTimeout(formatGatePhone, 0); });\n    if (window.addEventListener) window.addEventListener(\"pageshow\", formatGatePhone);\n    formatGatePhone();\n\n    $(\"gateForm\").addEventListener(\"submit\", function(e){"}, {"old": "      var phone = $(\"gatePhone\").value.trim();", "new": "      var phone = $(\"gatePhone\").value.trim();\n      formatGatePhone();"}];
const scripts = (s: string) => [...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const digits = (s: string) => s.replace(/\D/g, "");
function engine(source: string, search = "", initialPhone = "") {
  const nodes: Record<string, any> = {}, timers: Function[] = [], downloads: any[] = [], revocations: string[] = [], windowListeners: Record<string, Function[]> = {};
  const node = (id: string): any => {
    if (nodes[id]) return nodes[id];
    const classes = new Set<string>(["quiz", "gate", "report"].includes(id) ? ["hidden"] : []);
    return nodes[id] = {
      value: id === "gatePhone" ? initialPhone : "", textContent: "", innerHTML: "", children: [], listeners: {} as Record<string, Function[]>, style: {}, attributes: {}, focused: false,
      selectionStart: null, selectionEnd: null,
      classList: { add(...c: string[]) { c.forEach(x => classes.add(x)); }, remove(...c: string[]) { c.forEach(x => classes.delete(x)); }, contains(c: string) { return classes.has(c); }, toggle(c: string, force?: boolean) { if (force === true || (force === undefined && !classes.has(c))) classes.add(c); else classes.delete(c); } },
      addEventListener(name: string, fn: Function) { (this.listeners[name] ??= []).push(fn); },
      dispatch(name: string, event: any = {}) { for (const fn of [...(this.listeners[name] ?? [])]) fn(event); },
      setSelectionRange(start: number, end: number) { this.selectionStart = start; this.selectionEnd = end; },
      setAttribute(name: string, value: string) { this.attributes[name] = value; }, removeAttribute(name: string) { delete this.attributes[name]; }, focus() { this.focused = true; this.dispatch("focus"); },
      appendChild(child: any) { this.children.push(child); }, click() { downloads.push({ href: this.href, download: this.download }); }, remove() {},
      reset() { for (const id of ["gateName", "gateEmail", "gatePhone"]) node(id).value = ""; },
    };
  };
  let blob: any;
  const env: any = {
    URLSearchParams, window: { location: { search }, scrollTo() {}, addEventListener(name: string, fn: Function) { (windowListeners[name] ??= []).push(fn); } },
    document: { getElementById: node, addEventListener() {}, createElement: () => node("created"), body: node("body") },
    Date: class extends Date { constructor() { super("2026-01-01T00:00:00.000Z"); } },
    Blob: class { constructor(public parts: string[], public options: any) {} },
    URL: { createObjectURL(value: any) { blob = value; return "blob:synthetic-local-report"; }, revokeObjectURL(url: string) { revocations.push(url); } },
    setTimeout(fn: Function) { timers.push(fn); return timers.length; }, clearTimeout() {},
  };
  scripts(source).forEach(script => runInNewContext(script, env));
  return { env, node, timers, downloads, revocations, windowListeners, blob: () => blob, flush() { while (timers.length) timers.shift()!(); } };
}
function submit(x: ReturnType<typeof engine>) {
  let prevented = 0;
  x.node("gateForm").dispatch("submit", { preventDefault() { prevented++; } });
  expect(prevented).toBe(1);
}
function setValidFields(x: ReturnType<typeof engine>, value: string) {
  x.node("gateName").value = " Synthetic Quiz "; x.node("gateEmail").value = " synthetic.quiz@example.com "; x.node("gatePhone").value = value;
}

describe("Quiz gate phone — display formatting only", () => {
  it("restores whole source and built HTML exactly to 33d80aac with only three frozen fragments, one production path and the exact new helper SHA while keeping all 22 old fixtures immutable", () => {
    const original = before(page), current = read(page);
    expect(fragments).toHaveLength(3);
    let expected = original;
    for (const f of fragments) {
      expect(original.split(f.old).length - 1).toBe(1);
      expect(original.split(f.new).length - 1).toBe(0);
      expect(current.split(f.new).length - 1).toBe(1);
      expected = expected.replace(f.old, f.new);
    }
    expect(current).toBe(expected);
    for (const path of [page, built]) {
      expect(read(path)).toBe(current);
      expect(inverseHormoneQuizPhone(path, read(path))).toBe(original);
    }
    const scope = ["client", "server", "shared", "drizzle", "vite.config.ts", "vitest.config.ts", "package.json", "pnpm-lock.yaml", "tsconfig.json"];
    const paths = [...execFileSync("git", ["diff", "--name-only", "33d80aac", "--", ...scope], { cwd: root, encoding: "utf8" }).split("\n"), ...execFileSync("git", ["ls-files", "--others", "--exclude-standard", "--", ...scope], { cwd: root, encoding: "utf8" }).split("\n")].filter(p => p && !/^server\/[^/]+\.test\.ts$/.test(p)).filter(p => {
      if (p !== helper) return true;
      expect(createHash("sha256").update(read(p)).digest("hex")).toBe(helperSHA);
      return false;
    });
    expect([...new Set(paths)].sort()).toEqual([page]);
    const fixtures = execFileSync("git", ["ls-tree", "-r", "--name-only", "33d80aac", "--", "server/fixtures"], { cwd: root, encoding: "utf8" }).trim().split("\n");
    expect(fixtures).toHaveLength(22);
    for (const p of fixtures) expect(read(p)).toBe(before(p));
  });

  it("formats each partial and complete US value, pasted punctuation and optional leading +1 or eleven-digit 1 without hidden truncation, preserving supported digit counts and idempotence", () => {
    const x = engine(read(page));
    const values = [
      ["", ""], ["letters", ""], ["5", "(5"], ["55", "(55"], ["555", "(555"], ["5555", "(555) 5"], ["55555", "(555) 55"], ["555555", "(555) 555"], ["5555555", "(555) 555-5"], ["55555555", "(555) 555-55"], ["555555555", "(555) 555-555"], ["5555555555", "(555) 555-5555"],
      ["(555) 555-5555", "(555) 555-5555"], ["555.555.5555", "(555) 555-5555"], [" 555 555 5555 ", "(555) 555-5555"], ["+1 (555) 555-5555", "(555) 555-5555"], ["+15555555555", "(555) 555-5555"], ["15555555555", "(555) 555-5555"],
      ["+", "+"], ["+1", "+1"], [" +1 555", " +1 555"], ["+1 (555) 555-555", "+1 (555) 555-555"], ["25555555555", "25555555555"], ["+44 20 5555 5555", "+44 20 5555 5555"], ["+1 555 555 5555 99", "+1 555 555 5555 99"], ["55555555555555555555", "55555555555555555555"],
    ];
    for (const [value, expected] of values) {
      const result = x.env.formatGatePhoneValue(value);
      expect(result).toBe(expected); expect(x.env.formatGatePhoneValue(result)).toBe(result);
      const countryRemoved = digits(value).length === 11 && digits(value).startsWith("1");
      expect(digits(result)).toBe(countryRemoved ? digits(value).slice(1) : digits(value));
      expect(digits(result).length).toBe(digits(value).length - (countryRemoved ? 1 : 0));
      if (digits(value).length > 10 && !countryRemoved) expect(result).toBe(value);
    }
    for (const country of ["", "+1 ", "1"]) expect(x.env.formatGatePhoneValue(country + "2025550100")).toBe("(202) 555-0100");
  });

  it("runs real listener arrays for typing paste cursor selection replacement native punctuation deletion composition and autofill fallbacks while preserving existing name email minimum-ten-digit validation and captured payload fields", () => {
    const current = read(page), original = before(page), x = engine(current), phone = x.node("gatePhone");
    expect(phone.listeners.input).toHaveLength(2);
    for (const name of ["beforeinput", "change", "blur", "compositionend", "focus"]) expect(phone.listeners[name]).toHaveLength(1);
    expect(x.windowListeners.pageshow).toHaveLength(1);
    let prevented = 0;
    const native = (type: string, event: any = {}) => phone.dispatch(type, { preventDefault() { prevented++; }, ...event });
    const set = (value: string, start = value.length, end = start) => { phone.value = value; phone.setSelectionRange(start, end); };
    const partials = ["(5", "(55", "(555", "(555) 5", "(555) 55", "(555) 555", "(555) 555-5", "(555) 555-55", "(555) 555-555", "(555) 555-5555"];
    phone.classList.add("invalid"); x.node("gatePhoneError").classList.remove("hidden");
    set("");
    for (const expected of partials) { set(phone.value + "5"); native("input", { inputType: "insertText", data: "5" }); expect(phone.value).toBe(expected); expect(phone.selectionStart).toBe(expected.length); expect(phone.selectionEnd).toBe(expected.length); }
    expect(phone.classList.contains("invalid")).toBe(false); expect(x.node("gatePhoneError").classList.contains("hidden")).toBe(true);
    set("+1 (202) 555-0100"); native("input", { inputType: "insertFromPaste" }); expect(phone.value).toBe("(202) 555-0100"); expect(phone.selectionStart).toBe(phone.value.length);
    set("5555555555", 3, 6); native("input"); expect(phone.value).toBe("(555) 555-5555"); expect(phone.selectionStart).toBe(phone.value.indexOf(")")); expect(phone.selectionEnd).toBe(phone.value.indexOf("-"));
    set("+1 5555555555", "+1 555".length, "+1 555555".length); native("input"); expect(phone.selectionStart).toBe(phone.value.indexOf(")")); expect(phone.selectionEnd).toBe(phone.value.indexOf("-"));
    set("(555) 555-5555", 2, 3); native("beforeinput", { inputType: "insertText" });
    set(phone.value.slice(0, phone.selectionStart) + "9" + phone.value.slice(phone.selectionEnd), 3); native("input", { inputType: "insertText", data: "9" }); expect(phone.value).toBe("(595) 555-5555"); expect(phone.selectionStart).toBe(3);
    for (const [inputType, position] of [["deleteContentBackward", "(555) ".length], ["deleteContentForward", "(555".length], ["deleteContentBackward", "(555) 555-".length], ["deleteContentForward", "(555) 555".length]] as const) {
      set("(555) 555-5555", position); native("beforeinput", { inputType });
      const at = phone.selectionStart, deleteAt = inputType === "deleteContentBackward" ? at - 1 : at;
      expect(/\d/.test(phone.value.charAt(deleteAt))).toBe(true);
      set(phone.value.slice(0, deleteAt) + phone.value.slice(deleteAt + 1), deleteAt); native("input", { inputType });
      expect(phone.value).toBe("(555) 555-555"); expect(digits(phone.value)).toBe("555555555");
    }
    set("(555) 555-5555", 2, 7); native("beforeinput", { inputType: "deleteContentBackward" }); expect([phone.selectionStart, phone.selectionEnd]).toEqual([2, 7]);
    set("5555555555", 4); native("beforeinput", { inputType: "deleteContentBackward", isComposing: true }); native("input", { isComposing: true }); expect(phone.value).toBe("5555555555"); expect(phone.selectionStart).toBe(4);
    native("compositionend", { isComposing: false }); expect(phone.value).toBe("(555) 555-5555"); expect(phone.selectionStart).toBe("(555) 5".length);
    set("5555555555", 0); native("input"); expect(phone.selectionStart).toBe(1);
    set("+1 5555555555", 1); native("input"); expect(phone.selectionStart).toBe(1);
    expect(prevented).toBe(0);
    for (const name of ["input", "change", "blur", "compositionend"]) { set("+1 202 555 0100"); native(name); expect(phone.value).toBe("(202) 555-0100"); }
    for (const initial of ["2025550100", "+1 202 555 0100"]) expect(engine(current, "", initial).node("gatePhone").value).toBe("(202) 555-0100");
    set("2025550100"); x.env.finish(); expect(phone.value).toBe("(202) 555-0100"); expect(x.node("gate").classList.contains("hidden")).toBe(false); expect(x.node("quiz").classList.contains("hidden")).toBe(true);
    set("+1 202 555 0100"); x.windowListeners.pageshow.forEach(fn => fn({ persisted: true })); expect(phone.value).toBe("(202) 555-0100");
    set("2025550100"); native("focus"); expect(phone.value).toBe("(202) 555-0100"); set("+1 202 555 0100"); x.flush(); expect(phone.value).toBe("(202) 555-0100");
    const noSelection = engine(current); noSelection.node("gatePhone").setSelectionRange = undefined; noSelection.node("gatePhone").value = "2025550100"; noSelection.node("gatePhone").dispatch("input"); expect(noSelection.node("gatePhone").value).toBe("(202) 555-0100");
    const throwsSelection = engine(current); throwsSelection.node("gatePhone").setSelectionRange = () => { throw new Error("Synthetic unsupported selection"); }; throwsSelection.node("gatePhone").value = "2025550100"; throwsSelection.node("gatePhone").selectionStart = 3; throwsSelection.node("gatePhone").selectionEnd = 3; expect(() => throwsSelection.node("gatePhone").dispatch("input")).not.toThrow(); expect(throwsSelection.node("gatePhone").value).toBe("(202) 555-0100");
    const invalid = engine(current); invalid.env.finish();
    submit(invalid); expect(invalid.node("gateName").focused).toBe(true); expect(invalid.env.submissionRecord).toBeNull();
    invalid.node("gateName").value = "Synthetic Quiz"; invalid.node("gateEmail").value = "invalid"; submit(invalid); expect(invalid.node("gateEmail").focused).toBe(true); expect(invalid.env.submissionRecord).toBeNull();
    invalid.node("gateEmail").value = "synthetic.quiz@example.com"; invalid.node("gatePhone").value = "555555555"; submit(invalid); expect(invalid.node("gatePhone").focused).toBe(true); expect(invalid.node("gatePhone").attributes["aria-invalid"]).toBe("true"); expect(invalid.env.submissionRecord).toBeNull(); expect(invalid.node("report").classList.contains("hidden")).toBe(true);
    for (const raw of [" 2025550100 ", "+1 202 555 0100", "12025550100", "25555555555", "+44 20 5555 5555"]) {
      const actual = engine(current), baseline = engine(original); setValidFields(actual, raw); setValidFields(baseline, raw); submit(actual); submit(baseline);
      expect(actual.env.submissionRecord.phone).toBe(raw.trim()); expect(actual.node("gatePhone").value).toBe(actual.env.formatGatePhoneValue(raw));
      expect(JSON.stringify(actual.env.submissionRecord)).toBe(JSON.stringify(baseline.env.submissionRecord));
      expect(Object.keys(actual.env.submissionRecord)).toEqual(["name", "email", "phone", "submittedAt", "answers", "balanceIndex", "pattern", "domainScores"]);
      expect(actual.env.window.__quizSubmission).toBe(actual.env.submissionRecord); expect(actual.node("submissionData").textContent).toBe(JSON.stringify(actual.env.submissionRecord)); expect(actual.node("report").classList.contains("hidden")).toBe(false); expect(actual.node("reportBody").innerHTML).toBe(baseline.node("reportBody").innerHTML);
    }
    const typed = engine(current); setValidFields(typed, "2025550100"); typed.node("gatePhone").dispatch("input"); submit(typed); expect(typed.env.submissionRecord.phone).toBe("(202) 555-0100");
    expect(current).toContain('var phone = $("gatePhone").value.trim();\n      formatGatePhone();'); expect(current).toContain('phone.replace(/\\D/g, "").length < 10');
  });

  it("freezes the pure helper and strict negative variants while preserving unrelated paths idempotence all CSS DOM and outside JavaScript plus model questions demo report wording download and reset behavior", () => {
    const helperSource = read(helper), current = read(page), original = before(page);
    expect(createHash("sha256").update(helperSource).digest("hex")).toBe(helperSHA);
    expect(JSON.parse(helperSource.split("\n")[0].slice("const fragments=".length, -1))).toEqual(fragments);
    expect(helperSource.slice(helperSource.indexOf("\n") + 1)).not.toMatch(/\b(?:describe|it|test)\s*\(|\bimport\s|\brequire\s*\(|readFile|writeFile|execFile|fetch\(|process\.|XMLHttpRequest|sendBeacon/);
    const malformed = [""];
    for (const f of fragments) {
      malformed.push(current.replace(f.new, ""), current + f.new, current + f.old, original + f.old, original + f.new, original.replace(f.old, ""), current.replace(f.new, f.old));
      const token = f === fragments[0] ? 'formatGatePhone();' : f === fragments[1] ? 'digits.length > 10' : 'formatGatePhone();';
      malformed.push(current.replace(f.new, f.new.replace(token, "UNAPPROVED")), original.replace(f.old, f.old.replace(f === fragments[0] ? 'gateEl.classList.remove' : f === fragments[1] ? 'addEventListener' : 'value.trim()', "UNAPPROVED")));
    }
    for (const token of ['digits.slice(1)', 'digits.length <= 3', 'digits.length <= 6', 'event.isComposing', '"beforeinput"', '"deleteContentBackward"', '"compositionend"', '"pageshow"', 'setTimeout(formatGatePhone, 0)']) malformed.push(current.replace(fragments[1].new, fragments[1].new.replace(token, "UNAPPROVED")));
    for (const path of [page, built, resolve(root, page), resolve(root, built), page.replaceAll("/", "\\"), "C:\\project\\" + built.replaceAll("/", "\\")]) {
      for (const bad of malformed) expect(() => inverseHormoneQuizPhone(path, bad)).toThrow("Quiz phone scope mismatch");
      expect(inverseHormoneQuizPhone(path, original)).toBe(original); expect(inverseHormoneQuizPhone(path, current)).toBe(original);
      expect(inverseHormoneQuizPhone(path, inverseHormoneQuizPhone(path, current))).toBe(original);
      expect(inverseHormoneQuizPhone(path, current + "\nUNAPPROVED")).toBe(original + "\nUNAPPROVED");
      const edited = current.replace('<title>Hormone Symptom Quiz</title>', '<title>UNAPPROVED</title>');
      expect(inverseHormoneQuizPhone(path, edited)).toBe(original.replace('<title>Hormone Symptom Quiz</title>', '<title>UNAPPROVED</title>')); expect(inverseHormoneQuizPhone(path, edited)).not.toBe(original);
    }
    for (const path of ["other.ts", "client/intake/index.html", "client/public/other.html", "dist/public/other.html", page + ".bak", "client/src/pages/WeightLossMenopauseV2.tsx"]) { expect(inverseHormoneQuizPhone(path, current)).toBe(current); expect(inverseHormoneQuizPhone(path, "")).toBe(""); }
    const css = (s: string) => [...s.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1]);
    const dom = (s: string) => s.replace(/<script>[\s\S]*?<\/script>/g, "<script></script>");
    expect(css(current)).toEqual(css(original)); expect(dom(current)).toBe(dom(original));
    expect(current.match(/<(?:input|form|label|button)\b[^>]*>/g)).toEqual(original.match(/<(?:input|form|label|button)\b[^>]*>/g));
    expect(scripts(current)).toHaveLength(2); scripts(current).forEach(s => expect(() => new Script(s)).not.toThrow());
    const strip = (s: string) => [...fragments].reverse().reduce((text, f) => text.replace(f.new, f.old), s);
    expect(strip(current)).toBe(original); expect(scripts(current).map(strip)).toEqual(scripts(original));
    expect(current.slice(current.indexOf('    /* ================= Report ================= */'))).toBe(original.slice(original.indexOf('    /* ================= Report ================= */')));
    expect(scripts(current).join("\n")).not.toMatch(/\b(?:fetch|XMLHttpRequest|sendBeacon|localStorage|sessionStorage)\b/);
    for (const query of ["", "?prefill=demo", "?utm_source=synthetic&prefill=demo", "?prfill=demo", "?prefill=Demo"]) {
      const actual = engine(current, query), baseline = engine(original, query);
      expect(actual.env.demoPrefill).toBe(query === "?prefill=demo" || query === "?utm_source=synthetic&prefill=demo");
      for (const key of ["QUESTIONS", "ITEM_DEFS", "DOMAINS", "BANDS", "answers", "order", "submissionRecord"]) expect(JSON.stringify(actual.env[key])).toBe(JSON.stringify(baseline.env[key]));
      expect(actual.env.QUESTIONS).toHaveLength(32);
      for (const fn of ["computeModel", "pickPattern", "driverMetrics", "orderDrivers", "syncConditional", "render", "next", "renderReport", "prefillDemoAnswers"]) expect(actual.env[fn].toString()).toBe(baseline.env[fn].toString());
      for (const x of [actual, baseline]) { if (!x.env.demoPrefill) x.env.QUESTIONS.forEach((q: any) => x.env.answers[q.id] = q.multi ? [q.opts.length - 1] : 0); x.env.renderReport(); }
      expect(JSON.stringify(actual.env.computeModel())).toBe(JSON.stringify(baseline.env.computeModel())); expect(JSON.stringify(actual.env.pickPattern(actual.env.computeModel()))).toBe(JSON.stringify(baseline.env.pickPattern(baseline.env.computeModel()))); expect(JSON.stringify(actual.env.driverMetrics(actual.env.computeModel()))).toBe(JSON.stringify(baseline.env.driverMetrics(baseline.env.computeModel())));
      expect(actual.node("reportBody").innerHTML).toBe(baseline.node("reportBody").innerHTML);
      for (const x of [actual, baseline]) x.node("dlBtn").dispatch("click");
      expect(actual.blob().parts).toEqual(baseline.blob().parts); expect(actual.blob().options).toEqual(baseline.blob().options); expect(actual.blob().options).toEqual({ type: "text/plain" });
      expect(actual.downloads).toEqual(baseline.downloads); expect(actual.downloads).toEqual([{ href: "blob:synthetic-local-report", download: "my-hormone-report.txt" }]);
      actual.flush(); baseline.flush(); expect(actual.revocations).toEqual(baseline.revocations); expect(actual.revocations).toEqual(["blob:synthetic-local-report"]);
      for (const x of [actual, baseline]) {
        for (const id of ["gateName", "gateEmail", "gatePhone"]) x.node(id).value = "synthetic-local-only";
        x.node("againBtn").dispatch("click"); expect(x.env.pos).toBe(0); expect(x.env.submissionRecord).toBeNull(); expect(x.env.window.__quizSubmission).toBeNull(); expect(x.node("submissionData").textContent).toBe("");
        for (const id of ["gateName", "gateEmail", "gatePhone"]) expect(x.node(id).value).toBe("");
        expect(x.node("report").classList.contains("hidden")).toBe(true); expect(x.node("intro").classList.contains("hidden")).toBe(false);
      }
      expect(JSON.stringify(actual.env.answers)).toBe(JSON.stringify(baseline.env.answers)); expect(JSON.stringify(actual.env.order)).toBe(JSON.stringify(baseline.env.order));
    }
  });
});
