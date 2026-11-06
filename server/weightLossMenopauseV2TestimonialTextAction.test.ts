import { openSync, readSync, fstatSync, closeSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { describe, it, expect } from "vitest";
import { inverseV2TestimonialTextAction } from "./fixtures/v2TestimonialTextActionScope";

const root = resolve(import.meta.dirname, "..");
const read = (p: string) => {
  const fd = openSync(resolve(root, p), "r");
  try {
    const b = Buffer.alloc(fstatSync(fd).size);
    let n = 0;
    while (n < b.length) {
      const count = readSync(fd, b, n, b.length - n, n);
      if (!count) throw new Error("Unexpected incomplete source read");
      n += count;
    }
    return b.toString("utf8");
  } finally {
    closeSync(fd);
  }
};
const before = (p: string) => execFileSync("git", ["show", "6372b9f4:" + p], { cwd: root, encoding: "utf8" });
const page = "client/src/pages/WeightLossMenopauseV2.tsx";
const css = "client/src/pages/WeightLossMenopauseV2.css";
const helper = "server/fixtures/v2TestimonialTextActionScope.ts";
const helperSHA = "b64ca0e8da32e70e2e97da930e4d1a5e4e51b35df12b4ab81a34a29d42761c7c";
const arrow = '<svg className="testimonial-story-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>';
const marker = '</span></summary><div className="testimonial-story-rest">';
const extract = (s: string) => s.match(/<div className="testimonial-grid">[\s\S]*?<\/div><\/div><\/section>/)?.[0] ?? "";
const cards = (s: string) => [...extract(s).matchAll(/<article className="testimonial-card">[\s\S]*?<\/article>/g)].map(m => m[0]);
const literals = (s: string) => [...s.matchAll(/\{("(?:[^"\\]|\\.)*")\}/g)].map(m => JSON.parse(m[1]));
const styleBlock = (s: string) => s.match(/\.wlm-v2-content #testimonials \.testimonial-story > summary \{[^\n]*\}\n\.wlm-v2-content #testimonials \.testimonial-story > summary::-webkit-details-marker \{[^\n]*\}\n\.wlm-v2-content #testimonials \.testimonial-story > summary::after \{[^\n]*\}\n\.wlm-v2-content #testimonials \.testimonial-story > summary:focus-visible \{[^\n]*\}/)?.[0] ?? "";

describe("V2 testimonial text action — confirmed borderless underlined control only", () => {
  it("removes exactly five summary SVG arrows and restores both complete files to 6372b9f4 without changing any other production path", () => {
    const s = read(page), baseline = before(page);
    expect(baseline.split(arrow).length - 1).toBe(5);
    expect(s).toBe(baseline.split(arrow).join(""));
    expect(s).not.toContain('className="testimonial-story-chevron"');
    expect(s.split(marker).length - 1).toBe(5);
    for (const p of [page, css]) expect(inverseV2TestimonialTextAction(p, read(p))).toBe(before(p));
    const scope = ["client", "server", "shared", "drizzle", "vite.config.ts", "vitest.config.ts", "package.json", "pnpm-lock.yaml"];
    const changed = [...execFileSync("git", ["diff", "--name-only", "6372b9f4", "--", ...scope], { cwd: root, encoding: "utf8" }).split("\n"), ...execFileSync("git", ["ls-files", "--others", "--exclude-standard", "--", ...scope], { cwd: root, encoding: "utf8" }).split("\n")].filter(p => p && !p.endsWith(".test.ts")).filter(p => {
      if (p !== helper) return true;
      expect(createHash("sha256").update(read(p)).digest("hex")).toBe(helperSHA);
      return false;
    });
    expect([...new Set(changed)].sort()).toEqual([css, page].sort());
  });

  it("preserves all five complete stories, headlines, names, stars, native closed disclosures and exact Read more/Read less ARIA behavior", () => {
    const previous = cards(before(page)), current = cards(read(page));
    expect(previous).toHaveLength(5);
    expect(current).toHaveLength(5);
    expect(current.map(c => c.match(/<footer>([^<]+)<\/footer>/)?.[1])).toEqual(["Salma, 47", "Michelle, 52", "Huda, 45", "Hufsa, 58", "Jennifer, 49"]);
    current.forEach((card, i) => {
      expect(card).toBe(previous[i].replace(arrow, ""));
      expect(literals(card)).toEqual(literals(previous[i]));
      expect(card.match(/<details className="testimonial-story"/g)).toHaveLength(1);
      expect(card).toContain('<details className="testimonial-story" onToggle={event => { const details = event.currentTarget; details.querySelector("summary")?.setAttribute("aria-expanded", String(details.open)); }}>');
      expect(card.match(/<summary role="button" aria-expanded="false">/g)).toHaveLength(1);
      expect(card).toContain('<span className="testimonial-read-more">Read more</span><span className="testimonial-read-less">Read less</span><span className="testimonial-story-context"> — ' + card.match(/<footer>([^<]+)<\/footer>/)?.[1] + marker);
      expect(card.match(/aria-label="5 out of 5 stars">★★★★★/g)).toHaveLength(1);
      expect(card).not.toMatch(/<svg|<details[^>]+\sopen(?:[\s=>])|\sname=|onClick|useState|fetch\(|line-clamp|truncate|substring|slice\(/);
      const outside = card.replace(/<details[\s\S]*?<\/details>/, "");
      const previousOutside = previous[i].replace(/<details[\s\S]*?<\/details>/, "");
      expect(outside).toBe(previousOutside);
      expect(literals(outside)).toHaveLength(2);
      expect(card.match(/<div className="testimonial-story-rest">([\s\S]*?)<\/div>/)?.[1]).toBe(previous[i].match(/<div className="testimonial-story-rest">([\s\S]*?)<\/div>/)?.[1]);
    });
  });

  it("uses borderless bold purple underlined inline-flex text with a 44px target and visible focus while retaining current 14px type and card padding", () => {
    const s = read(css), baseline = before(css), block = styleBlock(s), oldBlock = styleBlock(baseline);
    expect(block).toBe('.wlm-v2-content #testimonials .testimonial-story > summary { display: inline-flex; align-items: center; justify-content: flex-start; gap: 0; min-height: 44px; padding: 8px 0; border: 0; border-radius: 0; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; background: transparent; color: #7A1E7E; font-family: inherit; font-size: 14px; font-weight: 700; line-height: 1.5; cursor: pointer; list-style: none; }\n.wlm-v2-content #testimonials .testimonial-story > summary::-webkit-details-marker { display: none; }\n.wlm-v2-content #testimonials .testimonial-story > summary::after { content: none; display: none; }\n.wlm-v2-content #testimonials .testimonial-story > summary:focus-visible { outline: 3px solid #7A1E7E; outline-offset: 3px; border-radius: 4px; }');
    expect(oldBlock).not.toBe("");
    expect(s).toBe(baseline.replace(oldBlock, block));
    expect(inverseV2TestimonialTextAction(css, s)).toBe(baseline);
    const tail = s.slice(s.indexOf("/* V2 testimonial stories only:"));
    for (const token of ["padding-top: 14px; padding-bottom: 14px", "testimonial-rating { margin-bottom: 6px", "testimonial-story-title { display: block; margin-bottom: 6px", "blockquote { margin-bottom: 4px", "testimonial-story { margin-top: 4px", ".testimonial-read-less { display: none; }", ".testimonial-story[open] .testimonial-read-more { display: none; }", ".testimonial-story[open] .testimonial-read-less { display: inline; }", "testimonial-story-context { position: absolute; width: 1px; height: 1px", "prefers-reduced-motion"]) expect(tail).toContain(token);
    expect(block).not.toMatch(/border: [1-9]|border-radius: 10px|display: flex;|justify-content: space-between|padding: 8px 12px/);
    expect(tail).not.toMatch(/#doctor|#how-it-works|\.hero|\.mobile|#faq/);
    for (const m of block.matchAll(/([^{}]+)\{/g)) expect(m[1]).toContain(".wlm-v2-content #testimonials");
  });

  it("freezes the pure non-registering helper and rejects missing, repeated, mixed or altered fragments without masking unrelated edits", () => {
    const source = read(helper), p = read(page), s = read(css), block = styleBlock(s), oldBlock = styleBlock(before(css));
    expect(createHash("sha256").update(source).digest("hex")).toBe(helperSHA);
    expect(source).not.toMatch(/\b(?:describe|it|test)\s*\(|\bimport\s|\brequire\s*\(/);
    for (const bad of [p.replace(marker, "UNAPPROVED"), p + marker, p.replace(marker, "</span>" + arrow + '</summary><div className="testimonial-story-rest">'), before(page).replace(arrow, arrow.replace('width="18"', 'width="19"'))]) expect(() => inverseV2TestimonialTextAction(page, bad)).toThrow();
    for (const token of ["display: inline-flex", "min-height: 44px", "padding: 8px 0", "border: 0", "text-decoration: underline", "color: #7A1E7E", "font-size: 14px", "font-weight: 700", "outline: 3px solid #7A1E7E"]) expect(() => inverseV2TestimonialTextAction(css, s.replace(block, block.replace(token, "UNAPPROVED")))).toThrow();
    for (const bad of [s.replace(block, ""), s + block, s + oldBlock, baselineStyleMutation()]) expect(() => inverseV2TestimonialTextAction(css, bad)).toThrow();
    function baselineStyleMutation() { return before(css).replace("padding: 8px 12px; border: 2px solid #7A1E7E", "padding: 8px 12px; border: 3px solid #7A1E7E"); }
    for (const path of [page, css]) {
      const current = read(path), original = before(path);
      expect(inverseV2TestimonialTextAction(path, original)).toBe(original);
      expect(inverseV2TestimonialTextAction(path, inverseV2TestimonialTextAction(path, current))).toBe(original);
      expect(inverseV2TestimonialTextAction(resolve(root, path), current)).toBe(original);
      expect(inverseV2TestimonialTextAction(path.replaceAll("/", "\\"), current)).toBe(original);
      expect(inverseV2TestimonialTextAction(path, current + "\nUNAPPROVED")).toBe(original + "\nUNAPPROVED");
    }
    expect(inverseV2TestimonialTextAction(page, p.replace("Salma, 47", "Salma, 99"))).not.toBe(before(page));
    expect(inverseV2TestimonialTextAction(css, s.replace("padding-top: 14px", "padding-top: 15px"))).not.toBe(before(css));
    expect(inverseV2TestimonialTextAction("other.ts", "unchanged")).toBe("unchanged");
    expect(inverseV2TestimonialTextAction("client/src/pages/WeightLossMenopause.tsx", p)).toBe(p);
    expect(inverseV2TestimonialTextAction("client/src/pages/WeightLossMenopause.css", s)).toBe(s);
  });
});
