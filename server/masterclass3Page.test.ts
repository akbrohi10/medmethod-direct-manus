import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");
const source = read("client/src/pages/MasterclassVideoFirst.tsx");
const page = read("client/src/pages/Masterclass3.tsx");
const baseline = "452b46a1";
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const edits: Array<{ old: string; new: string; at: number }> = JSON.parse(read("server/fixtures/masterclass3CopyEdits.json"));
const pricing = [
  "First visit: $199 — $50 deposit, remaining $149 due day of visit.",
  "Follow-up visits: $150 pay as you go, or ongoing care at $50/month.",
  "Hormone medication: $29–$99/month, depending on what is prescribed.",
  "GLP-1 medication: $129–$299/month, depending on the medication.",
  "Medication is billed separately and is not included in visit fees.",
];
const between = (text: string, start: string, end: string) => {
  const at = text.indexOf(start);
  expect(at).toBeGreaterThanOrEqual(0);
  const last = text.indexOf(end, at + start.length);
  expect(last).toBeGreaterThan(at);
  return text.slice(at, last);
};

describe("Masterclass V3 — edited actual short-source copy only", () => {
  it("leaves both protected original page files byte-identical", () => {
    expect(hash(source)).toBe("099c311b0147d3947143a000b4b652f3398a60dbde7e89c3c95da71b266bfa88");
    expect(hash(read("client/src/pages/Masterclass2.tsx"))).toBe("3b81afb6d839677e85f8dcc82874cffbe39cee358cd1dfad777f65c0dbd1a2b3");
  });
  it("reconstructs the entire copied original with only the recorded allowed edits", () => {
    let restored = page;
    for (const change of [...edits].reverse()) {
      expect(restored.slice(change.at, change.at + change.new.length)).toBe(change.new);
      restored = restored.slice(0, change.at) + change.old + restored.slice(change.at + change.new.length);
    }
    expect(restored).toBe(source);
  });
  it("adds only the V3 import, route and overlay exclusion to App", () => {
    let app = read("client/src/App.tsx");
    for (const line of [
      'const Masterclass3 = lazy(() => import("@/pages/Masterclass3"));\n',
      '        <Route path="/masterclass3" component={Masterclass3} />\n',
      '  if (location === "/masterclass3") return null;\n',
    ]) {
      expect(app.split(line)).toHaveLength(2);
      app = app.replace(line, "");
    }
    expect(app).toBe(execFileSync("git", ["show", `${baseline}:client/src/App.tsx`], { cwd: root, encoding: "utf8" }));
    expect(app).toContain('<Route path="/masterclass" component={Masterclass2} />');
    expect(app).toContain('<Route path="/masterclass2" component={MasterclassVideoFirst} />');
  });
  it("uses the exact symptom hero copy, DO credentials and new canonical", () => {
    expect(page).toContain("FREE ON-DEMAND MASTERCLASS");
    expect(page).toContain("Hot flashes. Waking up at 3 AM. Low libido. Weight that won't move no matter what you do.");
    expect(page).toContain("Understand why it's happening — how your estrogen levels have everything to do with it — and what actually helps. Watch the video now.");
    expect(page).toContain("From Dr. Jumana Al-Deek, DO");
    expect(page.match(/https:\/\/medmethoddirect.com\/masterclass3/g)).toHaveLength(2);
  });
  it("preserves the learn list, entire bio, featured logos and inherited animation CSS", () => {
    for (const [start,end] of [
      ["// Keep this in sync", "function PricingDetails()"],
      ['        <div className="px-5 pt-8 pb-8', '        <FeaturedInStrip />'],
      ['      <style>{`', '      <article'],
    ]) expect(between(page,start,end)).toBe(between(source,start,end));
    const extra = '          <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-[#766d75]">Available in 17 states</p>\n';
    expect(between(page,"        <footer", "      </article>").replace(extra, "")).toBe(between(source,"        <footer", "      </article>"));
  });
  it("keeps the source layout and serves the ungated API-enabled video without autoplay", () => {
    expect(page).toContain('const MASTERCLASS_YOUTUBE_ID = "UNYMLkd61z8";');
    expect(page).toContain("enablejsapi=1&playsinline=1&origin=");
    expect(page).toContain("new api.Player(iframeRef.current");
    expect(page).toContain("tracker.onStateChange(event.data, event.target)");
    expect(page).toContain("tracker.dispose()");
    expect(page).toContain("player?.destroy()");
    expect(page).not.toContain("autoplay=1");
    expect(page).toContain('<LpConsultationModal2 open={consultationOpen} onClose={() => setConsultationOpen(false)} landingPage="/masterclass" startAtPayment />');
    expect(page).not.toMatch(/<form\b/);
  });
  it("places booking directly after video and repeats the source discovery link and physician modal action after pricing", () => {
    const video = page.indexOf("ref={videoRef}");
    const booking = page.indexOf("<section data-masterclass-video-first-booking");
    const learning = page.indexOf("data-webinar2-learning");
    const bio = page.indexOf("data-masterclass-video-first-bio");
    const featured = page.indexOf("<FeaturedInStrip />");
    const price = page.indexOf("<section data-masterclass3-pricing");
    const bottom = page.indexOf("data-masterclass3-bottom-booking");
    expect([video,booking,learning,bio,featured,price,bottom]).toEqual([video,booking,learning,bio,featured,price,bottom].sort((a,b)=>a-b));
    expect(page.match(/href="\/care-team-booking"/g)).toHaveLength(2);
    expect(page).not.toContain("/book-a-visit");
    expect(page.match(/data-masterclass3-secondary-cta onClick=\{\(\) => setConsultationOpen\(true\)\}/g)).toHaveLength(2);
    expect(page.match(/Book Your Free 15-Minute Discovery Call/g)).toHaveLength(2);
    expect(page.match(/Book Your 45-Minute Visit with Dr\. Al-Deek — \$199/g)).toHaveLength(2);
  });
  it("contains only the five verified pricing statements and excludes all removed offers", () => {
    const sheet = between(page,"function PricingDetails()", "export default function");
    for (const statement of pricing) expect(sheet.split(statement)).toHaveLength(2);
    expect(sheet.match(/\$\d+(?:–\$\d+)?(?:\/month)?/g)).toEqual(["$199","$50","$149","$150","$50/month","$29–$99/month","$129–$299/month"]);
    expect(page).not.toMatch(/\$95|\$97|\$19\.99|\$1,000|~\$|\$29\/month|free text|free first doctor|intake-first|\bquiz\b|Al-Deek, MD/i);
    expect(page).toContain("(888) 362-7011");
    expect(page).toContain("Available in 17 states");
  });
});
