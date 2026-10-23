import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const landing = read("client/weight-loss-intake.html");
const section = landing.match(/<section[^>]*id="how-it-works">[\s\S]*?<\/section>/)?.[0] ?? "";
const compact = landing.split("/* Approved compact How it works — this section only. */")[1]?.split("</style>")[0] ?? "";

describe("Compact How it works on weight-loss-intake only", () => {
  it("uses exactly the approved three short titles without explanations", () => {
    expect(section).toContain("<h2>How it works</h2>");
    expect([...section.matchAll(/<h3>(.*?)<\/h3>/g)].map(match => match[1])).toEqual([
      "Complete your intake (5-10min)",
      "Text with your doctor",
      "Discuss your options with your doctor, based on your evaluation.",
    ]);
    expect(section.match(/class="step"/g)).toHaveLength(3);
    expect([...section.matchAll(/class="step-num">(\d)</g)].map(match => match[1])).toEqual(["1", "2", "3"]);
    expect(section).not.toMatch(/<p\b|<ul\b|<li\b/);
    expect(section).not.toMatch(/Start with your questions|5–8 minute|welcome text arrives instantly/);
  });

  it("puts numbers beside readable text with compact responsive spacing", () => {
    expect(compact).toContain("#how-it-works .step{display:grid;grid-template-columns:34px minmax(0,1fr);align-items:center;gap:12px;min-height:0;padding:18px;border-radius:16px}");
    expect(compact).toContain("#how-it-works .step-num{width:34px;height:34px;margin:0");
    expect(compact).toContain("font-size:1.25rem;line-height:1.35");
    expect(compact).toContain("white-space:normal");
    expect(compact).toContain("@media(max-width:900px)");
    expect(compact).toContain("#how-it-works .steps{grid-template-columns:1fr;gap:24px;margin-top:18px}");
    expect(compact).toContain("#how-it-works .step{padding:16px}");
    expect(compact).not.toMatch(/font-family:|color:|background:|height:([1-9]\d{2,})px/);
  });

  it("keeps the existing horizontal and mobile downward connectors", () => {
    expect(landing).toContain('content:"→"');
    expect(landing).toContain('content:"↓"');
    expect(compact).toContain("#how-it-works .step:not(:last-child)::after{top:50%;right:-29px;width:28px;line-height:1;transform:translateY(-50%)}");
    expect(compact).toContain("bottom:-25px;transform:translateX(50%)");
    expect(landing).toContain("#how-it-works.wave-top::before{display:none}");
    expect(landing.match(/href="\/intake\/"/g)).toHaveLength(5);
  });

  it("limits every new style selector to this section, not shared files", () => {
    const selectors = [...compact.matchAll(/([^{}]+)\{/g)].map(match => match[1].trim());
    expect(selectors.length).toBeGreaterThan(5);
    for (const selector of selectors) {
      expect(selector.startsWith("#how-it-works") || selector.startsWith("@media")).toBe(true);
    }
    for (const path of ["client/intake/index.html", "client/intake/thank-you/index.html", "client/src/pages/WeightLossMenopause.tsx", "client/src/pages/MasterclassVideoFirst.tsx", "client/src/index.css", "client/public/weight-loss-intake/ui-polish.css"]) {
      expect(read(path)).not.toContain("Approved compact How it works");
    }
  });
});
