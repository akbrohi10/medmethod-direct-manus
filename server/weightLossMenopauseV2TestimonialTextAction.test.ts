import { openSync, readSync, fstatSync, closeSync } from "node:fs"; import { inverseHormoneQuizTreatmentCta } from "./fixtures/hormoneQuizTreatmentCtaScope"; import { inverseHormoneQuizPanel } from "./fixtures/hormoneQuizPanelScope"; import { inverseHormoneQuizPhone } from "./fixtures/hormoneQuizPhoneScope"; import { inverseHormoneQuizIntegration } from "./fixtures/hormoneQuizIntegrationScope"; import { readFileSync as integrationReadFileSync } from "node:fs"; import { createHash as integrationCreateHash } from "node:crypto"; import { inverseHormoneQuizGhlAnswerBlock } from "./fixtures/hormoneQuizGhlAnswerBlockScope"; import { inverseHormoneQuizSubmissionOrigin } from "./fixtures/hormoneQuizSubmissionOriginScope"; import { inverseHormoneQuizPrivacy } from "./fixtures/hormoneQuizPrivacyScope"; import { inverseHormoneQuizCtaPlacement } from "./fixtures/hormoneQuizCtaPlacementScope"; import { gunzipSync as ctaPlacementGunzipSync } from "node:zlib"; import { inverseHormoneQuizLetterRemoval } from "./fixtures/hormoneQuizLetterRemovalScope"; import { gunzipSync as letterRemovalGunzipSync } from "node:zlib";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { describe, it, expect } from "vitest";
import { inverseV2TestimonialTextAction } from "./fixtures/v2TestimonialTextActionScope";
import { inverseV2TestimonialAttribution } from "./fixtures/v2TestimonialAttributionScope";

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
    return inverseV2TestimonialAttribution(p, inverseHormoneQuizTreatmentCta(p, inverseHormoneQuizPanel(p, inverseHormoneQuizPhone(p, inverseHormoneQuizIntegration(p, inverseHormoneQuizPrivacy(p, inverseHormoneQuizCtaPlacement(p, inverseHormoneQuizLetterRemoval(p, b.toString("utf8")))))))));
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
    const changed = [...execFileSync("git", ["diff", "--name-only", "6372b9f4", "--", ...scope], { cwd: root, encoding: "utf8" }).split("\n"), ...execFileSync("git", ["ls-files", "--others", "--exclude-standard", "--", ...scope], { cwd: root, encoding: "utf8" }).split("\n")].filter(p => { const approvedSHA = p === "server/fixtures/hormoneQuizLetterRemovalScope.ts" ? "96938eba387ef8b4249cd02e6a6773b1073c877eb99812e4b7900d2be66d1d7d" : p === "server/hormoneQuizLetterRemoval.test.ts" ? "d7416dfa4c92225fa859e32f6d86fa640b6cfc5259b625471274a05011b6d98b" : p === "server/fixtures/hormoneQuizCtaPlacementScope.ts" ? "045fb37fbf5cbcd1c0cf07f8e3ca0d84a18512b5151fd4d835835546bc26dcf8" : p === "server/hormoneQuizCtaPlacement.test.ts" ? "fe0b17234612ec41b0d953faba9136e852d1b3cf331ffc4de7d8c3bca1c9b90d" : p === "server/fixtures/hormoneQuizPrivacyScope.ts" ? "589a41f28d49b6bdc2dec9149f7dbfe996bdd0f0a5389fcf1d4ee501b04fb156" : p === "server/hormoneQuizPrivacy.test.ts" ? "ab258e67b82562ae04298394dba34c0bf021541fb6b452331509a9fb0e742e0c" : p === "server/fixtures/hormoneQuizSubmissionOriginScope.ts" ? "634e49eadc1c3ac7c3572582124b68b7db3543a642de13124a384794e1a9b905" : p === "server/fixtures/hormoneQuizGhlAnswerBlockScope.ts" ? "36bad6875b176d1d7cb671b38e64d53f352f38fb3a42969fcb98b9f4b48058b3" : p === "server/fixtures/hormoneQuizIntegrationScope.ts" ? "c213c08ee14e7d5195640881e15390d7ef3a35a13d71d153019e061f9711b80f" : p === "client/quiz-webhook-transport.ts" ? "1b0ab7d0d2f64e88a84b967159711d6033d79320baeef5b38c81845279e4cc3e" : p === "client/src/components/AdminQuizWebhooks.tsx" ? "1a4a4ea0221a621a95fdd1647c179dda582d83277ec70dedee7764b4fbb6d25f" : p === "drizzle/0018_greedy_moonstone.sql" ? "b38e984d44625730eaebca8ebfbe92c622897e7b776f2601b2b3affb427266f2" : p === "drizzle/meta/0018_snapshot.json" ? "aacbfbb9c0b8aa07bba06e7b6dc8adbd628edac958f5674c08c500d30c4c5680" : p === "server/hormoneQuizModel.ts" ? "969021c16190e99ecdb338049c10f7dcff9729293ae1509e1049544e3b3b201f" : p === "server/hormoneQuizPdf.ts" ? "8dfc2c0f606ac64d65dd3619bcba5f44297e8c11a90a3777e55c260067b2615c" : p === "server/hormoneQuizPrivateReport.ts" ? "0b09d70a1da392697b7c17e5c55c4a0c8c4cc244e96bed1afdac8c1aa68dc834" : p === "server/hormoneQuizRoutes.ts" ? "713d5f0a7c63f78ba6b24401779256d2dc4a68803b0eda6779e0c7eda6556e02" : p === "server/hormoneQuizSecurity.ts" ? "39d4b6330fb8c1d8967133d88e170a697416a95fc240cce8bf75dcf326e3bb9b" : p === "server/hormoneQuizService.ts" ? "ae03caf253af04e89b990dbfc515eda6e945f8a69b2e32fbf37532af52113b24" : p === "server/hormoneQuizStore.ts" ? "7a01d7245f73a051e886774b10e8893a31aaaad9b301c6bc31fd78ff22ce9d6a" : p === "server/routers/hormoneQuiz.ts" ? "1c1404a42c9e1d89c19440bd0533c0267a1fcd9636068b2491c22da29efbe9a6" : null; if (approvedSHA) { expect(integrationCreateHash("sha256").update(inverseHormoneQuizGhlAnswerBlock(p, inverseHormoneQuizSubmissionOrigin(p, inverseHormoneQuizPrivacy(p, ((source: string) => { if (p !== "server/hormoneQuizPrivacy.test.ts") return source; const edits = JSON.parse(ctaPlacementGunzipSync(Buffer.from("H4sIAAAAAAACA7WTXW/aMBSG/4rrq0TK0oQkEILYVFWbuNxE7wgXjn0MnhI7sk0pq/rfdwICpHaruotJvrLOOc/7no/VMzWtoBVVXW+sJ8+EW2AeFsxtyQuR1nSkptoIqLg99N7UdEYjqmH/bznkEqv0I1gHC2M7o+HHTv269+x7yzh0oP01P76V6snvLLjb7Z9jl9z0MOh5ic4uuNHOE1QjyJwEfUWct0pvQjL/fPz9plpYHjQPsKxpHyGwxviI9GGExJ2XZU3Dq7/3qr1vI+ijD/PCtwY2yg/EOI6Z3bgzd7U+kuEJ+KVuTTG2phEZAqNhFHtRkRMFNDcC86oLi7y8cfcfUbHrW+Uxr641+oylaj3YoB8q4x5IEtysaiqUlEPVmrbuE4aAq+k6Vpq3OwEuGGCrZB2G2E/cBk283cGMnMT3SqN4LDifY74DizP52NrEHjHkC2YleSGbbCIbWfCGi5QnXCYTWULGWSLKnKVlkY6aIi1SKXJRZgW+Ih83fDQW/Gi1ei3hL+TYg/NXsoSkSSejLB+nI+B52iRiWmSSNWyaZmMoi5FIm4zLLEul5LmAiSh51nCW8mkzTcSRrHdtOzs1E7vxqkvD9xavMhh2MeixiTco8xjnt9bsyVdrjcUJDUrJ/cMd6S+HOCy49sYeyHJxRzrlOub5driPM0Oy1iEEB/3TKH2ZM67z+jcO4HOqVwQAAA==", "base64")).toString("utf8")) as {old: string; new: string}[]; for (const e of [...edits].reverse()) { const lines = source.split("\n"); if (lines.filter(l => l === e.new).length !== 1) throw Error("Quiz CTA placement privacy test inverse mismatch"); source = lines.map(l => l === e.new ? e.old : l).join("\n"); } if (integrationCreateHash("sha256").update(source).digest("hex") !== "ab258e67b82562ae04298394dba34c0bf021541fb6b452331509a9fb0e742e0c") throw Error("Quiz CTA placement privacy test SHA mismatch"); return source; })(inverseHormoneQuizCtaPlacement(p, ((source: string) => { const entry = (JSON.parse(letterRemovalGunzipSync(Buffer.from("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", "base64")).toString("utf8")) as Record<string, {sha: string; edits: {old: string; new: string}[]}>)[p]; if (!entry) return source; for (const e of [...entry.edits].reverse()) { const lines = source.split("\n"); if (lines.filter(l => l === e.new).length !== 1) throw Error("Quiz letter removal test inverse mismatch"); source = lines.map(l => l === e.new ? e.old : l).join("\n"); } if (integrationCreateHash("sha256").update(source).digest("hex") !== entry.sha) throw Error("Quiz letter removal test SHA mismatch"); return source; })(inverseHormoneQuizLetterRemoval(p, integrationReadFileSync(resolve(process.cwd(), p), "utf8"))))))))).digest("hex")).toBe(approvedSHA); return false; } const baselineSHA = p === ".gitignore" ? "b4572613f7e7b7827f8dd1c7543b03f903082ba146ebe8115dd9bd81aebd4bee" : p === "client/src/pages/AdminSettings.tsx" ? "1fb9dc9c6c5a2f9be62dbf2bc8bfde870a4b3a41a32d767011d8d3cb57e3643b" : p === "drizzle/meta/_journal.json" ? "95c6b9bfc4ee56f65a5b59ee60ac9507746dee6e4bb0425ee397377ff653373b" : p === "drizzle/schema.ts" ? "b1b087b3c94cbd5c3a5395358b72b4e1c682b33317ebae806a2e962e7c9b3530" : p === "package.json" ? "9026530d7237c3303799cda328f2d3cc488e74cbc35d73df6b190a428b99bd42" : p === "server/_core/index.ts" ? "14ad2b6e75c8efb044e803f70d2239a7f87e5476219bd21f15b8b956fab2deeb" : p === "server/routers.ts" ? "4f89f8904bf00da655ee411ef26c721503af3083843bc1b92823b82b0161e116" : null; if (baselineSHA) { expect(integrationCreateHash("sha256").update(inverseHormoneQuizIntegration(p, inverseHormoneQuizGhlAnswerBlock(p, inverseHormoneQuizSubmissionOrigin(p, inverseHormoneQuizPrivacy(p, inverseHormoneQuizCtaPlacement(p, inverseHormoneQuizLetterRemoval(p, integrationReadFileSync(resolve(process.cwd(), p), "utf8")))))))).digest("hex")).toBe(baselineSHA); return ![".gitignore", "client/src/pages/AdminSettings.tsx", "drizzle/meta/_journal.json", "drizzle/schema.ts", "package.json", "server/_core/index.ts", "server/routers.ts"].includes(p); } return true; }).filter(p => p && !p.endsWith(".test.ts")).filter(p => {
      if (p === "server/fixtures/v2TestimonialAttributionScope.ts") { expect(createHash("sha256").update(read(p)).digest("hex")).toBe("289a41016d926e29ea901349023bb373dfd7e17fde3c427e57fdbb63ffd7a18c"); return false; } if (p === "server/fixtures/hormoneQuizTreatmentCtaScope.ts") { expect(createHash("sha256").update(read(p)).digest("hex")).toBe("4e2c90b2879cb08ced0129214db38f67751ec239632f99f353dd371e61b93668"); return false; } if (p === "client/public/hormone-symptom-quiz.html") return inverseHormoneQuizTreatmentCta(p, read(p)) !== before(p); if (p === "server/fixtures/hormoneQuizPanelScope.ts") { expect(createHash("sha256").update(read(p)).digest("hex")).toBe("f3e3c8f12ba66965de9fca2140e1842b43d6865b7f833a9e49485bbc4b9c4798"); return false; } if (p === "server/fixtures/hormoneQuizPhoneScope.ts") { expect(createHash("sha256").update(read(p)).digest("hex")).toBe("a1da7935b8aa5a94ea012f6b194339943f31bf799a066ed562bfba3c058fcb25"); return false; } if (p !== helper) return true;
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
