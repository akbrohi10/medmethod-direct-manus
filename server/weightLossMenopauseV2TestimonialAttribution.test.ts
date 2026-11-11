import { openSync, readSync, fstatSync, closeSync } from "node:fs"; import { inverseHormoneQuizTreatmentCta } from "./fixtures/hormoneQuizTreatmentCtaScope"; import { inverseHormoneQuizPanel } from "./fixtures/hormoneQuizPanelScope"; import { inverseHormoneQuizPhone } from "./fixtures/hormoneQuizPhoneScope"; import { inverseHormoneQuizIntegration } from "./fixtures/hormoneQuizIntegrationScope"; import { readFileSync as integrationReadFileSync } from "node:fs"; import { createHash as integrationCreateHash } from "node:crypto"; import { inverseHormoneQuizGhlAnswerBlock } from "./fixtures/hormoneQuizGhlAnswerBlockScope"; import { inverseHormoneQuizSubmissionOrigin } from "./fixtures/hormoneQuizSubmissionOriginScope"; import { inverseHormoneQuizPrivacy } from "./fixtures/hormoneQuizPrivacyScope"; import { inverseHormoneQuizCtaPlacement } from "./fixtures/hormoneQuizCtaPlacementScope"; import { gunzipSync as ctaPlacementGunzipSync } from "node:zlib";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { describe, it, expect } from "vitest";
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
    return inverseHormoneQuizPanel(p, inverseHormoneQuizPhone(p, inverseHormoneQuizIntegration(p, inverseHormoneQuizPrivacy(p, inverseHormoneQuizCtaPlacement(p, b.toString("utf8"))))));
  } finally { closeSync(fd); }
};
const before = (p: string) => execFileSync("git", ["show", "946928b8:" + p], { cwd: root, encoding: "utf8" });
const page = "client/src/pages/WeightLossMenopauseV2.tsx";
const css = "client/src/pages/WeightLossMenopauseV2.css";
const helper = "server/fixtures/v2TestimonialAttributionScope.ts";
const helperSHA = "289a41016d926e29ea901349023bb373dfd7e17fde3c427e57fdbb63ffd7a18c";
const names = ["Salma, 47", "Michelle, 52", "Huda, 45", "Hufsa, 58", "Jennifer, 49"];
const rating = '<span className="testimonial-rating" aria-label="5 out of 5 stars">★★★★★</span>';
const header = (name: string) => '<div className="testimonial-card-header"><span className="testimonial-author">' + name + '</span>' + rating + '</div>';
const style = '\n/* V2 testimonials only: attribution and stars share one compact top row. */\n.wlm-v2-content #testimonials .testimonial-card-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 6px; }\n.wlm-v2-content #testimonials .testimonial-author { min-width: 0; color: var(--muted); font-family: inherit; font-size: .78rem; font-weight: 700; }\n.wlm-v2-content #testimonials .testimonial-card-header .testimonial-rating { flex: 0 0 auto; margin-bottom: 0; }\n';
const cards = (s: string) => [...s.matchAll(/<article className="testimonial-card">[\s\S]*?<\/article>/g)].map(m => m[0]);
const blockquote = (s: string) => s.match(/<blockquote>[\s\S]*?<\/blockquote>/)?.[0] ?? "";
const literals = (s: string) => [...s.matchAll(/\{("(?:[^"\\]|\\.)*")\}/g)].map(m => JSON.parse(m[1]));

describe("V2 testimonial attribution — exact compact top row only", () => {
  it("moves only the five exact attributions and restores both full production files to 946928b8 with no other production change", () => {
    const baseline = before(page), previous = cards(baseline), current = read(page);
    expect(previous).toHaveLength(5);
    let expected = baseline;
    previous.forEach((card, i) => {
      expect(card.split(rating).length - 1).toBe(1);
      expect(card.split('<footer>' + names[i] + '</footer>').length - 1).toBe(1);
      const next = card.replace(rating, header(names[i])).replace('<footer>' + names[i] + '</footer>', "");
      expect(current.split(next).length - 1).toBe(1);
      expected = expected.replace(card, next);
    });
    expect(current).toBe(expected);
    for (const p of [page, css]) expect(inverseV2TestimonialAttribution(p, read(p))).toBe(before(p));
    const scope = ["client", "server", "shared", "drizzle", "vite.config.ts", "vitest.config.ts", "package.json", "pnpm-lock.yaml"];
    const changed = [...execFileSync("git", ["diff", "--name-only", "946928b8", "--", ...scope], { cwd: root, encoding: "utf8" }).split("\n"), ...execFileSync("git", ["ls-files", "--others", "--exclude-standard", "--", ...scope], { cwd: root, encoding: "utf8" }).split("\n")].filter(p => { const approvedSHA = p === "server/fixtures/hormoneQuizCtaPlacementScope.ts" ? "045fb37fbf5cbcd1c0cf07f8e3ca0d84a18512b5151fd4d835835546bc26dcf8" : p === "server/hormoneQuizCtaPlacement.test.ts" ? "fe0b17234612ec41b0d953faba9136e852d1b3cf331ffc4de7d8c3bca1c9b90d" : p === "server/fixtures/hormoneQuizPrivacyScope.ts" ? "589a41f28d49b6bdc2dec9149f7dbfe996bdd0f0a5389fcf1d4ee501b04fb156" : p === "server/hormoneQuizPrivacy.test.ts" ? "ab258e67b82562ae04298394dba34c0bf021541fb6b452331509a9fb0e742e0c" : p === "server/fixtures/hormoneQuizSubmissionOriginScope.ts" ? "634e49eadc1c3ac7c3572582124b68b7db3543a642de13124a384794e1a9b905" : p === "server/fixtures/hormoneQuizGhlAnswerBlockScope.ts" ? "36bad6875b176d1d7cb671b38e64d53f352f38fb3a42969fcb98b9f4b48058b3" : p === "server/fixtures/hormoneQuizIntegrationScope.ts" ? "c213c08ee14e7d5195640881e15390d7ef3a35a13d71d153019e061f9711b80f" : p === "client/quiz-webhook-transport.ts" ? "1b0ab7d0d2f64e88a84b967159711d6033d79320baeef5b38c81845279e4cc3e" : p === "client/src/components/AdminQuizWebhooks.tsx" ? "1a4a4ea0221a621a95fdd1647c179dda582d83277ec70dedee7764b4fbb6d25f" : p === "drizzle/0018_greedy_moonstone.sql" ? "b38e984d44625730eaebca8ebfbe92c622897e7b776f2601b2b3affb427266f2" : p === "drizzle/meta/0018_snapshot.json" ? "aacbfbb9c0b8aa07bba06e7b6dc8adbd628edac958f5674c08c500d30c4c5680" : p === "server/hormoneQuizModel.ts" ? "969021c16190e99ecdb338049c10f7dcff9729293ae1509e1049544e3b3b201f" : p === "server/hormoneQuizPdf.ts" ? "8dfc2c0f606ac64d65dd3619bcba5f44297e8c11a90a3777e55c260067b2615c" : p === "server/hormoneQuizPrivateReport.ts" ? "0b09d70a1da392697b7c17e5c55c4a0c8c4cc244e96bed1afdac8c1aa68dc834" : p === "server/hormoneQuizRoutes.ts" ? "713d5f0a7c63f78ba6b24401779256d2dc4a68803b0eda6779e0c7eda6556e02" : p === "server/hormoneQuizSecurity.ts" ? "39d4b6330fb8c1d8967133d88e170a697416a95fc240cce8bf75dcf326e3bb9b" : p === "server/hormoneQuizService.ts" ? "ae03caf253af04e89b990dbfc515eda6e945f8a69b2e32fbf37532af52113b24" : p === "server/hormoneQuizStore.ts" ? "7a01d7245f73a051e886774b10e8893a31aaaad9b301c6bc31fd78ff22ce9d6a" : p === "server/routers/hormoneQuiz.ts" ? "1c1404a42c9e1d89c19440bd0533c0267a1fcd9636068b2491c22da29efbe9a6" : null; if (approvedSHA) { expect(integrationCreateHash("sha256").update(inverseHormoneQuizGhlAnswerBlock(p, inverseHormoneQuizSubmissionOrigin(p, inverseHormoneQuizPrivacy(p, ((source: string) => { if (p !== "server/hormoneQuizPrivacy.test.ts") return source; const edits = JSON.parse(ctaPlacementGunzipSync(Buffer.from("H4sIAAAAAAACA7WTXW/aMBSG/4rrq0TK0oQkEILYVFWbuNxE7wgXjn0MnhI7sk0pq/rfdwICpHaruotJvrLOOc/7no/VMzWtoBVVXW+sJ8+EW2AeFsxtyQuR1nSkptoIqLg99N7UdEYjqmH/bznkEqv0I1gHC2M7o+HHTv269+x7yzh0oP01P76V6snvLLjb7Z9jl9z0MOh5ic4uuNHOE1QjyJwEfUWct0pvQjL/fPz9plpYHjQPsKxpHyGwxviI9GGExJ2XZU3Dq7/3qr1vI+ijD/PCtwY2yg/EOI6Z3bgzd7U+kuEJ+KVuTTG2phEZAqNhFHtRkRMFNDcC86oLi7y8cfcfUbHrW+Uxr641+oylaj3YoB8q4x5IEtysaiqUlEPVmrbuE4aAq+k6Vpq3OwEuGGCrZB2G2E/cBk283cGMnMT3SqN4LDifY74DizP52NrEHjHkC2YleSGbbCIbWfCGi5QnXCYTWULGWSLKnKVlkY6aIi1SKXJRZgW+Ih83fDQW/Gi1ei3hL+TYg/NXsoSkSSejLB+nI+B52iRiWmSSNWyaZmMoi5FIm4zLLEul5LmAiSh51nCW8mkzTcSRrHdtOzs1E7vxqkvD9xavMhh2MeixiTco8xjnt9bsyVdrjcUJDUrJ/cMd6S+HOCy49sYeyHJxRzrlOub5driPM0Oy1iEEB/3TKH2ZM67z+jcO4HOqVwQAAA==", "base64")).toString("utf8")) as {old: string; new: string}[]; for (const e of [...edits].reverse()) { const lines = source.split("\n"); if (lines.filter(l => l === e.new).length !== 1) throw Error("Quiz CTA placement privacy test inverse mismatch"); source = lines.map(l => l === e.new ? e.old : l).join("\n"); } if (integrationCreateHash("sha256").update(source).digest("hex") !== "ab258e67b82562ae04298394dba34c0bf021541fb6b452331509a9fb0e742e0c") throw Error("Quiz CTA placement privacy test SHA mismatch"); return source; })(inverseHormoneQuizCtaPlacement(p, integrationReadFileSync(resolve(process.cwd(), p), "utf8"))))))).digest("hex")).toBe(approvedSHA); return false; } const baselineSHA = p === ".gitignore" ? "b4572613f7e7b7827f8dd1c7543b03f903082ba146ebe8115dd9bd81aebd4bee" : p === "client/src/pages/AdminSettings.tsx" ? "1fb9dc9c6c5a2f9be62dbf2bc8bfde870a4b3a41a32d767011d8d3cb57e3643b" : p === "drizzle/meta/_journal.json" ? "95c6b9bfc4ee56f65a5b59ee60ac9507746dee6e4bb0425ee397377ff653373b" : p === "drizzle/schema.ts" ? "b1b087b3c94cbd5c3a5395358b72b4e1c682b33317ebae806a2e962e7c9b3530" : p === "package.json" ? "9026530d7237c3303799cda328f2d3cc488e74cbc35d73df6b190a428b99bd42" : p === "server/_core/index.ts" ? "14ad2b6e75c8efb044e803f70d2239a7f87e5476219bd21f15b8b956fab2deeb" : p === "server/routers.ts" ? "4f89f8904bf00da655ee411ef26c721503af3083843bc1b92823b82b0161e116" : null; if (baselineSHA) { expect(integrationCreateHash("sha256").update(inverseHormoneQuizIntegration(p, inverseHormoneQuizGhlAnswerBlock(p, inverseHormoneQuizSubmissionOrigin(p, inverseHormoneQuizPrivacy(p, inverseHormoneQuizCtaPlacement(p, integrationReadFileSync(resolve(process.cwd(), p), "utf8"))))))).digest("hex")).toBe(baselineSHA); return ![".gitignore", "client/src/pages/AdminSettings.tsx", "drizzle/meta/_journal.json", "drizzle/schema.ts", "package.json", "server/_core/index.ts", "server/routers.ts"].includes(p); } return true; }).filter(p => p && !p.endsWith(".test.ts")).filter(p => {
      if (p === "server/fixtures/hormoneQuizTreatmentCtaScope.ts") { expect(createHash("sha256").update(read(p)).digest("hex")).toBe("4e2c90b2879cb08ced0129214db38f67751ec239632f99f353dd371e61b93668"); return false; } if (p === "client/public/hormone-symptom-quiz.html") return inverseHormoneQuizTreatmentCta(p, read(p)) !== before(p); if (p === "server/fixtures/hormoneQuizPanelScope.ts") { expect(createHash("sha256").update(read(p)).digest("hex")).toBe("f3e3c8f12ba66965de9fca2140e1842b43d6865b7f833a9e49485bbc4b9c4798"); return false; } if (p === "server/fixtures/hormoneQuizPhoneScope.ts") { expect(createHash("sha256").update(read(p)).digest("hex")).toBe("a1da7935b8aa5a94ea012f6b194339943f31bf799a066ed562bfba3c058fcb25"); return false; } if (p !== helper) return true;
      expect(createHash("sha256").update(read(p)).digest("hex")).toBe(helperSHA);
      return false;
    });
    expect([...new Set(changed)].sort()).toEqual([css, page].sort());
  });

  it("keeps five names and ages left with five existing purple stars right in each top row, no footers, and every story, headline, disclosure and native control unchanged", () => {
    const current = cards(read(page)), previous = cards(before(page));
    expect(current).toHaveLength(5);
    expect(previous).toHaveLength(5);
    expect(current.map(c => c.match(/<span className="testimonial-author">([^<]+)<\/span>/)?.[1])).toEqual(names);
    current.forEach((card, i) => {
      expect(card.startsWith('<article className="testimonial-card">' + header(names[i]) + '<blockquote>')).toBe(true);
      expect(card.split(header(names[i])).length - 1).toBe(1);
      expect(card.match(/className="testimonial-card-header"/g)).toHaveLength(1);
      expect(card.match(/className="testimonial-author"/g)).toHaveLength(1);
      expect(card.split(rating).length - 1).toBe(1);
      expect(card).not.toContain('<footer');
      expect(card.endsWith('</blockquote></article>')).toBe(true);
      expect(blockquote(card)).not.toBe("");
      expect(blockquote(card)).toBe(blockquote(previous[i]));
      expect(literals(card)).toEqual(literals(previous[i]));
      expect(card.match(/<strong className="testimonial-story-title">/g)).toHaveLength(1);
      expect(card.match(/<details className="testimonial-story"/g)).toHaveLength(1);
      expect(card).toContain('<details className="testimonial-story" onToggle={event => { const details = event.currentTarget; details.querySelector("summary")?.setAttribute("aria-expanded", String(details.open)); }}>');
      expect(card.match(/<summary role="button" aria-expanded="false">/g)).toHaveLength(1);
      expect(card).toContain('<span className="testimonial-read-more">Read more</span><span className="testimonial-read-less">Read less</span><span className="testimonial-story-context"> — ' + names[i] + '</span></summary><div className="testimonial-story-rest">');
      expect(card.match(/<details[\s\S]*?<\/details>/)?.[0]).toBe(previous[i].match(/<details[\s\S]*?<\/details>/)?.[0]);
      expect(literals(card.replace(/<details[\s\S]*?<\/details>/, ""))).toHaveLength(2);
      expect(card).not.toMatch(/<svg|<details[^>]+\sopen(?:[\s=>])|\sname=|onClick|useState|fetch\(|line-clamp|truncate|substring|slice\(/);
    });
    expect(read(page).replace(current.join("\n"), "CARDS")).toBe(before(page).replace(previous.join("\n"), "CARDS"));
  });

  it("appends exactly three V2 testimonial CSS rules for one compact left/right row and preserves every prior CSS byte, spacing, typography, colors and control style", () => {
    const current = read(css), baseline = before(css);
    expect(current).toBe(baseline + style);
    expect(current.split(style).length - 1).toBe(1);
    expect(style.match(/\{/g)).toHaveLength(3);
    expect(style.match(/\}/g)).toHaveLength(3);
    for (const line of style.trim().split("\n").slice(1)) expect(line.startsWith('.wlm-v2-content #testimonials ')).toBe(true);
    expect(style).toContain('display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 6px;');
    expect(style).toContain('min-width: 0; color: var(--muted); font-family: inherit; font-size: .78rem; font-weight: 700;');
    expect(style).toContain('.testimonial-card-header .testimonial-rating { flex: 0 0 auto; margin-bottom: 0; }');
    expect(style).not.toMatch(/padding:|line-height:|color: #|#doctor|#how-it-works|\.hero|\.mobile|#faq|@media|order:|flex-direction:|flex-wrap:/);
    for (const token of ['padding-top: 14px; padding-bottom: 14px', 'testimonial-rating { margin-bottom: 6px', 'testimonial-story-title { display: block; margin-bottom: 6px', 'blockquote { margin-bottom: 4px', 'testimonial-story { margin-top: 4px', 'min-height: 44px', 'padding: 8px 0; border: 0; border-radius: 0; text-decoration: underline', 'color: #7A1E7E', 'font-size: 14px', 'outline: 3px solid #7A1E7E', '.testimonial-read-less { display: none; }', '.testimonial-story[open] .testimonial-read-more { display: none; }', '.testimonial-story[open] .testimonial-read-less { display: inline; }', 'testimonial-story-context { position: absolute; width: 1px; height: 1px', 'prefers-reduced-motion']) expect(baseline).toContain(token);
    expect(inverseV2TestimonialAttribution(css, current)).toBe(baseline);
  });

  it("freezes the pure non-registering helper, rejects missing, repeated, mixed and tampered attribution fragments, is idempotent and preserves unrelated edits and other paths", () => {
    const source = read(helper), p = read(page), s = read(css), currentCards = cards(p), previousCards = cards(before(page));
    expect(createHash("sha256").update(source).digest("hex")).toBe(helperSHA);
    expect(source).not.toMatch(/\b(?:describe|it|test)\s*\(|\bimport\s|\brequire\s*\(|readFile|writeFile|execFile|fetch\(|process\.|https?:\/\//);
    for (const bad of [p.replace(currentCards[0], ""), p + currentCards[0], p.replace(currentCards[0], previousCards[0]), p.replace(header(names[0]), ""), p.replace(header(names[0]), header(names[0]) + header(names[0])), p.replace('testimonial-author">Salma, 47', 'testimonial-author">Salma, 99'), p.replace('testimonial-card-header', 'testimonial-card-header-tampered'), p.replace(rating, rating.replace('5 out of 5 stars', '4 out of 5 stars')), p.replace(rating, rating.replace('★★★★★', '★★★★')), p.replace('</blockquote></article>', '</blockquote><footer>Salma, 47</footer></article>'), p.replace('</blockquote></article>', '</blockquote><div></div></article>'), p.replace(currentCards[0], "SWAP_CARD").replace(currentCards[1], currentCards[0]).replace("SWAP_CARD", currentCards[1])]) expect(() => inverseV2TestimonialAttribution(page, bad)).toThrow();
    for (const token of ['display: flex', 'align-items: center', 'justify-content: space-between', 'gap: 12px', 'margin-bottom: 6px', 'min-width: 0', 'color: var(--muted)', 'font-family: inherit', 'font-size: .78rem', 'font-weight: 700', 'flex: 0 0 auto', 'margin-bottom: 0']) expect(() => inverseV2TestimonialAttribution(css, s.replace(style, style.replace(token, "UNAPPROVED")))).toThrow();
    for (const bad of [s + style, s.replace(style.split("\n")[2] + "\n", ""), s.replace(style, style.replace('testimonial-author', 'testimonial-author-tampered'))]) expect(() => inverseV2TestimonialAttribution(css, bad)).toThrow();
    for (const path of [page, css]) {
      const current = read(path), original = before(path);
      expect(inverseV2TestimonialAttribution(path, original)).toBe(original);
      expect(inverseV2TestimonialAttribution(path, inverseV2TestimonialAttribution(path, current))).toBe(original);
      expect(inverseV2TestimonialAttribution(resolve(root, path), current)).toBe(original);
      expect(inverseV2TestimonialAttribution(path.replaceAll("/", "\\"), current)).toBe(original);
      expect(inverseV2TestimonialAttribution(path, current + "\nUNAPPROVED")).toBe(original + "\nUNAPPROVED");
    }
    const storyEdit = p.replace('I finally started feeling like myself again.', 'UNAPPROVED STORY');
    expect(inverseV2TestimonialAttribution(page, storyEdit)).toBe(before(page).replace('I finally started feeling like myself again.', 'UNAPPROVED STORY'));
    expect(inverseV2TestimonialAttribution(page, storyEdit)).not.toBe(before(page));
    expect(inverseV2TestimonialAttribution(css, s.replace('padding-top: 14px', 'padding-top: 15px'))).toBe(before(css).replace('padding-top: 14px', 'padding-top: 15px'));
    expect(inverseV2TestimonialAttribution(css, s.replace('padding-top: 14px', 'padding-top: 15px'))).not.toBe(before(css));
    expect(inverseV2TestimonialAttribution('other.ts', 'unchanged')).toBe('unchanged');
    expect(inverseV2TestimonialAttribution('client/src/pages/WeightLossMenopause.tsx', p)).toBe(p);
    expect(inverseV2TestimonialAttribution('client/src/pages/WeightLossMenopause.css', s)).toBe(s);
  });
});
