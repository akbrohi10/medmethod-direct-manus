import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

type FaqCategory = { id: string; label: string };

const baseline = "94e43fdc";
const root = resolve(import.meta.dirname, "..");
const faqCssPath = "client/src/pages/WeightLossMenopauseV2Faq.css";
const faqComponentPath = "client/src/pages/WeightLossMenopauseV2Faq.tsx";
const faqDataPath = "client/src/pages/WeightLossMenopauseV2FaqData.ts";
const mobileGridMarker = "\n/* V2 mobile FAQ chips — six equal cells, no horizontal scrolling. */";
const expectedMobileGridOverride = `${mobileGridMarker}
@media(max-width:767px) {
  .wlm-v2-content #faq .v2-faq-tabs {
    display:grid;
    grid-template-columns:repeat(3,minmax(0,1fr));
    overflow-x:visible;
  }
  .wlm-v2-content #faq .v2-faq-tabs button {
    width:100%;
    min-width:0;
    height:44px;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:9px 4px;
    text-align:center;
  }
}
`;

const explicitUnchangedSources = [
  "client/src/pages/WeightLossMenopauseV2.tsx",
  faqComponentPath,
  faqDataPath,
  "client/src/pages/WeightLossMenopauseV2MobileBar.tsx",
  "client/src/components/weight-loss-menopause-v2/checkout97/VideoVisitCheckout97.tsx",
  "client/src/components/weight-loss-menopause-v2/checkout97/videoVisitCheckout97Storage.ts",
  "server/_core/vite.ts",
  "server/routers/stripe.wl2.test.ts",
  "server/routers/paypal.wl2.test.ts",
  "server/wl2OneTimePayment.ts",
  "server/wl2PaymentResume.test.ts",
  "shared/treatmentCatalog.json",
] as const;
const approvedMasterclassFinalFaqPaths = new Set([
  "client/src/components/masterclass2/FinalFaq.tsx",
  "client/src/components/masterclass2/FinalFaq.css",
]);
const legitScriptFooterSealStart =
  '\n          <div data-masterclass-legitscript-footer-seal className="mt-6 flex justify-center">';
const legitScriptFooterSealEnd = "\n          </div>";

const read = (file: string) => readFileSync(resolve(root, file), "utf8");
const atBaseline = (file: string) => execFileSync("git", ["show", `${baseline}:${file}`], { cwd: root, encoding: "utf8" });

function loadFaqCategories(): FaqCategory[] {
  const moduleUrl = pathToFileURL(resolve(root, faqDataPath)).href;
  const script = `import(${JSON.stringify(moduleUrl)}).then(module => process.stdout.write(JSON.stringify(module.V2_FAQ_CATEGORIES.map(({ id, label }) => ({ id, label })))));`;
  return JSON.parse(execFileSync(process.execPath, ["--import", "tsx", "-e", script], { cwd: root, encoding: "utf8" })) as FaqCategory[];
}

function changedProductionFiles(): string[] {
  return execFileSync("git", ["diff", "--name-only", baseline, "--", "client", "server", "shared"], { cwd: root, encoding: "utf8" })
    .split("\n")
    .filter(Boolean)
    .filter(file => !/\.test\.[cm]?[jt]sx?$/.test(file))
    .filter(file => !approvedMasterclassFinalFaqPaths.has(file) && file !== "client/src/pages/Masterclass2.tsx");
}

function normalizeApprovedFinalFaqPageLines(source: string): string {
  const withoutFinalFaq = source
    .replace('import FinalFaq from "@/components/masterclass2/FinalFaq";\n', "")
    .replace('        <FinalFaq intakeHref="https://intake.medmethoddirect.com/" />\n', "");
  const start = withoutFinalFaq.indexOf(legitScriptFooterSealStart);
  if (start < 0) return withoutFinalFaq;
  const end = withoutFinalFaq.indexOf(legitScriptFooterSealEnd, start);
  if (end < 0) throw new Error("Missing end of marked Masterclass LegitScript footer seal");
  return withoutFinalFaq.slice(0, start) + withoutFinalFaq.slice(end + legitScriptFooterSealEnd.length);
}

describe("Weight-Loss & Menopause V2 mobile FAQ chip grid", () => {
  it("is an append-only CSS change: the prefix is byte-identical to 94e43fdc and the appended mobile block is exact", () => {
    const css = read(faqCssPath);
    const markerIndex = css.indexOf(mobileGridMarker);

    expect(markerIndex, "mobile FAQ chip marker missing").toBeGreaterThan(-1);
    expect(css.indexOf(mobileGridMarker, markerIndex + mobileGridMarker.length), "mobile FAQ chip marker must occur once").toBe(-1);
    expect(css.slice(0, markerIndex)).toBe(atBaseline(faqCssPath));
    expect(css.slice(markerIndex)).toBe(expectedMobileGridOverride);
  });

  it("uses exactly the six immutable FAQ categories in their original ordered labels, with Cost selected by default", () => {
    const data = read(faqDataPath);
    const component = read(faqComponentPath);

    expect(data).toBe(atBaseline(faqDataPath));
    expect(component).toBe(atBaseline(faqComponentPath));
    expect(loadFaqCategories()).toEqual([
      { id: "cost", label: "Cost" },
      { id: "visits", label: "Visits" },
      { id: "weight-loss", label: "Weight loss" },
      { id: "menopause", label: "Menopause" },
      { id: "both", label: "Both" },
      { id: "safety", label: "Safety" },
    ]);
    expect(component).toContain('const [selectedCategory, setSelectedCategory] = useState("cost");');
    expect(component).toContain("{V2_FAQ_CATEGORIES.map((category, index) => (");
    expect(component).toContain(">{category.label}</button>");
  });

  it("limits the override to the #faq mobile query and keeps six equal, centered 44px cells without horizontal overflow", () => {
    const appended = read(faqCssPath).slice(read(faqCssPath).indexOf(mobileGridMarker));

    expect(appended).toContain("@media(max-width:767px)");
    expect(appended).not.toMatch(/@media\(max-width:(?!767px)/);
    expect(appended).toMatch(/\.wlm-v2-content #faq \.v2-faq-tabs \{[\s\S]*display:grid;[\s\S]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\);[\s\S]*overflow-x:visible;[\s\S]*\}/);
    expect(appended).toMatch(/\.wlm-v2-content #faq \.v2-faq-tabs button \{[\s\S]*width:100%;[\s\S]*min-width:0;[\s\S]*height:44px;[\s\S]*display:flex;[\s\S]*align-items:center;[\s\S]*justify-content:center;[\s\S]*padding:9px 4px;[\s\S]*text-align:center;[\s\S]*\}/);
    expect(appended).not.toMatch(/(?:font|color|border-radius|aria-selected|sticky|position)\s*:/);
  });

  it("leaves every production source byte-identical to 94e43fdc except the approved FAQ stylesheet append", () => {
    for (const file of explicitUnchangedSources) {
      expect(read(file), file).toBe(atBaseline(file));
    }
    expect(normalizeApprovedFinalFaqPageLines(read("client/src/pages/Masterclass2.tsx"))).toBe(atBaseline("client/src/pages/Masterclass2.tsx"));
    expect(changedProductionFiles()).toEqual([faqCssPath]);
  });
});
