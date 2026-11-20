import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import edits from "./fixtures/masterclass3HeroEdits.json";
import { beforeMasterclass3Hero } from "./masterclass3HeroBaseline";
import { beforeMasterclass3PatientEmphasis } from "./masterclass3PatientEmphasisBaseline";

const root = new URL("../", import.meta.url);
const path = "client/src/pages/Masterclass3.tsx";
const read = (p: string) => beforeMasterclass3PatientEmphasis(p, readFileSync(new URL(p, root), "utf8"));
const old = (p: string) => execFileSync("git", ["show", `61b4cd49:${p}`], { cwd: root, encoding: "utf8" });
const page = read(path), original = old(path);
const hero = (s: string) => s.slice(s.indexOf('<section data-masterclass-video-first-hero'), s.indexOf('<section ref={videoRef}'));
const headline = "Hot flashes. Waking up at 3 AM. Low libido. Weight that won't move no matter what you do.";
const subheadline = "Understand why it's happening — how your estrogen levels have everything to do with it — and what actually helps. Watch the video now.";
const credentials = "Dr. Jumana Al-Deek, DO · Board-certified family physician · 50,000+ patients seen";

describe("V3 four approved hero changes only", () => {
  it("exactly restores the saved entire page using only the four approved edit blocks", () => {
    expect(edits).toHaveLength(4);
    expect(beforeMasterclass3Hero(path, page)).toBe(original);
    for (const edit of edits) expect(page.split(edit.after)).toHaveLength(2);
  });
  it("preserves exact banner, headline and subheadline copy", () => {
    for (const text of ["FREE ON-DEMAND MASTERCLASS", headline, subheadline]) {
      expect(page.split(text)).toHaveLength(2);
      expect(original.split(text)).toHaveLength(2);
    }
    expect(page.slice(page.indexOf("<Helmet>"), page.indexOf('<section data-masterclass-video-first-hero'))).toBe(original.slice(original.indexOf("<Helmet>"), original.indexOf('<section data-masterclass-video-first-hero')));
  });
  it("uses one plain credential line with unchanged credential paragraph styling", () => {
    const p = hero(page).match(/<p data-masterclass-video-first-credentials[^>]*>([\s\S]*?)<\/p>/)!;
    const o = hero(original).match(/<p data-masterclass-video-first-credentials[^>]*>/)!;
    expect(p[1].trim()).toBe(credentials);
    expect(p[0]).not.toContain("<span");
    expect(p[0].slice(0, p[0].indexOf(">") + 1)).toBe(o[0]);
    expect(hero(page)).not.toMatch(/From Dr|Specialist|backgroundImage|radial-gradient|opacity-85/);
  });
  it("reduces only the mobile font range and leaves desktop typography intact", () => {
    const cls = (s: string) => hero(s).match(/<h1 className="([^"]+)"/)![1];
    expect(cls(page).replace("text-[clamp(1.125rem,4.8vw,1.25rem)]", "text-[clamp(1.25rem,6.5vw,1.75rem)]")).toBe(cls(original));
    expect(cls(page)).toContain("sm:text-[2.8rem] lg:text-[3.35rem]");
    expect(hero(page).match(/<section[^>]*>/)![0]).toBe(hero(original).match(/<section[^>]*>/)![0]);
  });
  it("removes the standalone watch line but preserves the arrow, embed and all content below", () => {
    const start = '<section ref={videoRef}';
    const watch = '            <p className="m-0 text-base font-extrabold text-[#7a1e7e] sm:text-lg">Watch Now—Get Answers.</p>\n';
    expect(page).not.toContain("Watch Now—Get Answers.");
    expect(page.slice(page.indexOf(start))).toBe(original.slice(original.indexOf(start)).replace(watch, ""));
    expect(page.slice(0, page.indexOf('<section data-masterclass-video-first-hero'))).toBe(original.slice(0, original.indexOf('<section data-masterclass-video-first-hero')));
  });
  it("keeps every protected page/integration and every prior assertion unchanged", () => {
    for (const p of ["client/src/pages/Masterclass2.tsx", "client/src/pages/MasterclassVideoFirst.tsx", "client/src/pages/HomeHrt3.tsx", "client/src/components/masterclass3/Masterclass3FullBio.tsx", "client/src/components/home1/LpConsultationModal2.tsx", "client/src/lib/masterclass3VideoTracking.ts", "client/src/index.css", "client/src/App.tsx", "server/masterclass3Membership.test.ts", "server/masterclass3FullBio.test.ts", "server/masterclass3FullBioBaseline.ts", "server/masterclass3Page.test.ts", "server/masterclass3BookingActions.test.ts", "server/masterclass3SingleBooking.test.ts", "server/masterclass3LearningLabel.test.ts"]) expect(read(p)).toBe(old(p));
    const adapter = read("server/masterclass3MembershipBaseline.ts").replace('import { beforeMasterclass3Hero } from "./masterclass3HeroBaseline";\n\n', "").replace("  source = beforeMasterclass3Hero(path, source);\n", "");
    expect(adapter).toBe(old("server/masterclass3MembershipBaseline.ts"));
    expect(beforeMasterclass3Hero(path, original)).toBe(original);
    expect(beforeMasterclass3Hero("unrelated", "unchanged")).toBe("unchanged");
    expect(() => beforeMasterclass3Hero(path, page.replace(credentials, "changed credential"))).toThrow();
    expect(() => beforeMasterclass3Hero(path, page + edits[0].after)).toThrow();
  });
});
