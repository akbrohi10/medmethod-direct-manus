import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const BASELINE = "ea6bf90f";
const root = resolve(import.meta.dirname, "..");
const pagePath = "client/src/pages/Masterclass2.tsx";
const sealMarker = "data-masterclass-legitscript-footer-seal";
const sealStart =
  '\n          <div data-masterclass-legitscript-footer-seal className="mt-6 flex justify-center">';
const sealEnd = "\n          </div>";
const sealAsset = "/manus-storage/legitscript-certified-seal-51795425_51edddb5.png";
const verificationHref =
  "https://www.legitscript.com/websites/?checker_keywords=medmethoddirect.com";
const verificationTitle = "Verify LegitScript Approval for www.medmethoddirect.com";
const verificationAlt = "Verify Approval for www.medmethoddirect.com";

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

describe("Masterclass LegitScript footer seal", () => {
  it("is exactly reversible to ea6bf90f by removing only the uniquely marked new footer div", () => {
    const page = read(pagePath);

    expect(count(page, sealMarker)).toBe(1);
    expect(removeMarkedSealBlock(page)).toBe(atBaseline(pagePath));
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

  it("leaves every production source other than the authorized Masterclass page insertion unchanged from ea6bf90f", () => {
    const changedProductionFiles = execFileSync(
      "git",
      ["diff", "--name-only", BASELINE, "--", "client", "server", "shared"],
      { cwd: root, encoding: "utf8" },
    )
      .split("\n")
      .filter(Boolean)
      .filter(path => !/\.test\.[cm]?[jt]sx?$/.test(path));

    expect(changedProductionFiles).toEqual([pagePath]);
  });
});
