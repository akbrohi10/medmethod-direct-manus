import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const BASELINE = "ea6bf90f";
const root = resolve(import.meta.dirname, "..");
const pagePath = "client/src/pages/Masterclass2.tsx";
const finalFaqPath = "client/src/components/masterclass2/FinalFaq.tsx";
const sealMarker = "data-masterclass-legitscript-footer-seal";
const sealStart =
  '\n          <div data-masterclass-legitscript-footer-seal className="mt-6 flex justify-center">';
const sealEnd = "\n          </div>";
const sealAsset = "/manus-storage/legitscript-certified-seal-51795425_51edddb5.png";
const verificationHref =
  "https://www.legitscript.com/websites/?checker_keywords=medmethoddirect.com";
const verificationTitle = "Verify LegitScript Approval for www.medmethoddirect.com";
const verificationAlt = "Verify Approval for www.medmethoddirect.com";
const footerParagraphImport =
  'import { V2_FAQ_FOOTER_PARAGRAPHS } from "@/pages/WeightLossMenopauseV2FaqData";\n';
const footerDisclaimers = `
          <div data-masterclass-footer-disclaimers className="mx-auto mt-6 max-w-3xl space-y-3 text-center text-xs leading-6 text-[#766d75] sm:text-[13px]">
            {V2_FAQ_FOOTER_PARAGRAPHS.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </div>`;
const approvedMobilePadding =
  "        @media (max-width: 767px) {\n          [data-masterclass2-page] { padding-bottom: calc(144px + env(safe-area-inset-bottom, 0px)); }\n        }";
const previousMobilePadding =
  "        @media (max-width: 767px) {\n          [data-masterclass2-page] { padding-bottom: calc(112px + env(safe-area-inset-bottom, 0px)); }\n        }";
const approvedShowAllConditionalStart =
  "                {category.items.length > 3 && (\n";
const approvedShowAllConditionalEnd = "\n                )}";
const approvedV2HeroFontAppend = `
/* V2 hero headline — homepage font match only. */
.wlm-v2-content .hero[data-medmethod-scope] h1 {
  font-family: "Montserrat", sans-serif;
  font-weight: 900;
}
`;
const approvedV2DesktopHeroSizingAppend = `
/* V2 desktop hero headline — restrained sizing only. */
@media (min-width: 1025px) {
  .wlm-v2-content .hero[data-medmethod-scope] h1 {
    font-size: clamp(36px, 3vw, 50px);
  }
}
`;

const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const atBaseline = (path: string) =>
  execFileSync("git", ["show", `${BASELINE}:${path}`], {
    cwd: root,
    encoding: "utf8",
  });
const count = (source: string, value: string) => source.split(value).length - 1;

function markedSealBlock(source: string): string {
  const start = source.indexOf(sealStart);
  const end = source.indexOf(sealEnd, start);

  if (start < 0 || end < 0) {
    throw new Error("Missing marked Masterclass LegitScript footer seal block");
  }

  return source.slice(start, end + sealEnd.length);
}

function removeMarkedSealBlock(source: string): string {
  const block = markedSealBlock(source);
  return source.replace(block, "");
}

function removeApprovedSmallFixes(source: string): string {
  return source
    .replace(footerParagraphImport, "")
    .replace(footerDisclaimers, "")
    .replace(approvedMobilePadding, previousMobilePadding)
    .replace('aria-label="Video visit — $97"', 'aria-label="Video visit — $97 per visit"')
    .replace(
      '<span className="block whitespace-nowrap text-[10px] font-normal">$97</span>',
      '<span className="block whitespace-nowrap text-[10px] font-normal">$97 per visit</span>',
    );
}

function unwrapApprovedFinalFaqConditional(source: string): string {
  expect(count(source, approvedShowAllConditionalStart)).toBe(1);
  expect(count(source, approvedShowAllConditionalEnd)).toBe(1);
  return source
    .replace(approvedShowAllConditionalStart, "")
    .replace(approvedShowAllConditionalEnd, "");
}

function normalizeApprovedV2HeroFontAppend(path: string, source: string): string {
  return path === "client/src/pages/WeightLossMenopauseV2.css"
    ? source.replace(approvedV2DesktopHeroSizingAppend, "").replace(approvedV2HeroFontAppend, "")
    : source;
}

describe("Masterclass LegitScript footer seal", () => {
  it("is exactly reversible to ea6bf90f by removing only the uniquely marked new footer div", () => {
    const page = read(pagePath);

    expect(count(page, sealMarker)).toBe(1);
    expect(removeMarkedSealBlock(removeApprovedSmallFixes(page))).toBe(atBaseline(pagePath));
  });

  it("uses the approved verification destination, secure new-tab attributes, exact title, and authorized seal asset", () => {
    const seal = markedSealBlock(read(pagePath));
    const anchor = seal.match(/<a\b[\s\S]*?<\/a>/)?.[0] ?? "";
    const image = seal.match(/<img\b[^>]*\/>/)?.[0] ?? "";

    expect(anchor).toContain(`href="${verificationHref}"`);
    expect(anchor).toContain('target="_blank"');
    expect(anchor).toContain('rel="noopener noreferrer"');
    expect(anchor).toContain(`title="${verificationTitle}"`);
    expect(anchor).toContain("focus-visible:outline-[#7a1e7e]");
    expect(image).toContain(`src="${sealAsset}"`);
    expect(image).toContain(`alt="${verificationAlt}"`);
    expect(image).toMatch(/\bwidth=(?:\{73\}|"73")/);
    expect(image).toMatch(/\bheight=(?:\{79\}|"79")/);
    expect(image).toContain('loading="eager"');
    expect(image).toContain('decoding="async"');
  });

  it("keeps the badge object-contained at approximately 61px on mobile and 73px from the small breakpoint", () => {
    const image = markedSealBlock(read(pagePath)).match(/<img\b[^>]*\/>/)?.[0] ?? "";

    expect(image).toContain("object-contain");
    expect(image).toContain("w-[61px]");
    expect(image).toContain("sm:w-[73px]");
  });

  it("leaves every production source other than the authorized Masterclass page and conditionally updated FinalFaq unchanged from ea6bf90f", () => {
    const changedProductionFiles = execFileSync(
      "git",
      ["diff", "--name-only", BASELINE, "--", "client", "server", "shared"],
      { cwd: root, encoding: "utf8" },
    )
      .split("\n")
      .filter(Boolean)
      .filter(path => !/\.test\.[cm]?[jt]sx?$/.test(path))
      .filter(path => normalizeApprovedV2HeroFontAppend(path, read(path)) !== atBaseline(path));

    expect(changedProductionFiles).toEqual([
      finalFaqPath,
      pagePath,
    ]);
    expect(unwrapApprovedFinalFaqConditional(read(finalFaqPath))).toBe(
      atBaseline(finalFaqPath),
    );
  });
});
