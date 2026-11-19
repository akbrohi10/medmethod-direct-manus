import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");
const baseline = (path: string) => execFileSync("git", ["show", `301d9ba0:${path}`], { cwd: root, encoding: "utf8" });
const source = read("client/src/pages/MasterclassVideoFirst.tsx");
const v3 = read("client/src/pages/Masterclass3.tsx");
const tag = (text: string, selector: string) => text.match(new RegExp(`<[^\\n>]*${selector}[^\\n]*>`))![0];
const modal = (text: string) => text.match(/      <LpConsultationModal2[^\n]+\n/)![0];
const physician = tag(source, "data-masterclass-video-first-physician-cta");
const care = tag(source, "data-masterclass-video-first-care-team-cta");
const handler = (text: string) => text.match(/onClick=\{(\(\) => setConsultationOpen\(true\))\}/)![1];

describe("V3 booking actions — exact existing short source behavior", () => {
  it("runs the same source click handler for both V3 physician buttons", () => {
    expect(physician).toContain('<button type="button"');
    const tags = v3.match(/<button[^\n]*data-masterclass3-secondary-cta[^\n]*>/g)!;
    expect(tags).toHaveLength(2);
    for (const element of tags) {
      expect(element).toContain('type="button"');
      expect(element).not.toContain("href=");
      expect(handler(element)).toBe(handler(physician));
      const calls: boolean[] = [];
      const run = new Function("setConsultationOpen", `return (${handler(element)})();`);
      run((value: boolean) => calls.push(value));
      expect(calls).toEqual([true]);
    }
  });
  it("reuses one existing modal with the exact source props and close callback", () => {
    expect(v3).toContain('import LpConsultationModal2 from "@/components/home1/LpConsultationModal2";');
    expect(v3).toContain('const [consultationOpen, setConsultationOpen] = useState(false);');
    expect(v3.match(/<LpConsultationModal2 /g)).toHaveLength(1);
    expect(modal(v3)).toBe(modal(source));
    expect(modal(v3)).toContain('landingPage="/masterclass" startAtPayment');
    expect(modal(v3)).toContain('onClose={() => setConsultationOpen(false)}');
  });
  it("keeps both discovery anchors exactly as already wired and equivalent to the source", () => {
    const originalTags = baseline("client/src/pages/Masterclass3.tsx").match(/<a[^\n]*data-masterclass3-primary-cta[^\n]*>/g)!;
    const tags = v3.match(/<a[^\n]*data-masterclass3-primary-cta[^\n]*>/g)!;
    expect(tags).toEqual(originalTags);
    expect(care).toContain('href="/care-team-booking"');
    for (const element of tags) {
      expect(element).toContain('href="/care-team-booking"');
      expect(element).not.toMatch(/onClick=|target=|download=|\?/);
    }
    expect(care).not.toMatch(/onClick=|target=|download=|\?/);
  });
  it("reconstructs the previous V3 with exactly five wiring edits and no design or content changes", () => {
    const oldEdits = JSON.parse(baseline("server/fixtures/masterclass3CopyEdits.json"));
    const currentEdits = JSON.parse(read("server/fixtures/masterclass3CopyEdits.json"));
    expect(currentEdits.slice(0, oldEdits.length)).toEqual(oldEdits);
    const corrections = currentEdits.slice(oldEdits.length);
    expect(corrections).toHaveLength(5);
    let restored = v3;
    for (const e of corrections.reverse()) {
      expect(restored.slice(e.at, e.at + e.new.length)).toBe(e.new);
      restored = restored.slice(0, e.at) + e.old + restored.slice(e.at + e.new.length);
    }
    expect(restored).toBe(baseline("client/src/pages/Masterclass3.tsx"));
  });
  it("preserves both original pages, all routing, the shared modal and all video tracking code", () => {
    for (const path of [
      "client/src/pages/MasterclassVideoFirst.tsx", "client/src/pages/Masterclass2.tsx",
      "client/src/App.tsx", "client/src/components/home1/LpConsultationModal2.tsx",
      "client/src/components/home1/StripePaymentForm.tsx", "client/src/components/home1/PayPalPaymentForm.tsx",
      "client/src/lib/masterclass3VideoTracking.ts", "client/src/index.css",
    ]) expect(read(path)).toBe(baseline(path));
  });
  it("removes the guessed visit route without introducing any new navigation or payment implementation", () => {
    expect(v3).not.toContain("/book-a-visit");
    const before = baseline("client/src/pages/Masterclass3.tsx");
    const hrefs = (text: string) => [...text.matchAll(/href="([^"]+)"/g)].map(x => x[1]);
    expect(hrefs(v3)).toEqual(hrefs(before).filter(x => x !== "/book-a-visit"));
    expect(v3).not.toMatch(/window\.open|location\.assign|fetch\(|createOrder|captureOrder|useMutation/);
  });
});
