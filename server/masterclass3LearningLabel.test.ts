import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const root = new URL("../", import.meta.url);
const read = (p: string) => readFileSync(new URL(p, root), "utf8");
const old = (p: string) => execFileSync("git", ["show", `a522634c:${p}`], { cwd: root, encoding: "utf8" });
const path = "client/src/pages/Masterclass3.tsx";
const page = read(path);
const before = old(path);
const previous = "                What You’ll Learn\n";
const current = "                What You Will Learn in the Above Video\n";
const reverse = (s: string) => s.replace(current, previous);

describe("V3 learning label — exact wording change only", () => {
  it("changes precisely one unique label line, preserving every other source byte", () => {
    expect(before.split(previous)).toHaveLength(2);
    expect(page.split(current)).toHaveLength(2);
    expect(page).not.toContain(previous);
    expect(page).toBe(before.replace(previous, current));
    expect(reverse(page)).toBe(before);
  });
  it("preserves the pink pill classes, heading, all seven topics and every booking/video action", () => {
    const pill = '              <p className="inline-flex rounded-full bg-[#fde8ef] px-6 py-2 text-sm font-black uppercase tracking-[0.2em] text-[#cf1475] sm:px-8 sm:text-base">\n';
    expect(page).toContain(pill + current + "              </p>");
    expect(page).toContain("Because You Deserve to Know.");
    for (const anchor of ["const learningChecklist =", "function PricingDetails()", "useEffect(() =>", "data-masterclass-video-first-booking", "data-masterclass3-pricing", "data-masterclass-video-first-bio", "<footer", "<LpConsultationModal2 open="]) {
      expect(reverse(page).slice(reverse(page).indexOf(anchor))).toBe(before.slice(before.indexOf(anchor)));
    }
    expect(page.match(/<PricingDetails \/>/g)).toHaveLength(1);
    expect(page.match(/data-masterclass3-primary-cta/g)).toHaveLength(1);
    expect(page.match(/data-masterclass3-secondary-cta/g)).toHaveLength(1);
  });
  it("keeps original pages, routing, global styles, shared booking flow and copy fixture byte-identical", () => {
    for (const p of [
      "client/src/pages/MasterclassVideoFirst.tsx", "client/src/pages/Masterclass2.tsx", "client/src/App.tsx",
      "client/src/index.css", "client/src/components/home1/LpConsultationModal2.tsx",
      "client/src/components/home1/StripePaymentForm.tsx", "client/src/components/home1/PayPalPaymentForm.tsx",
      "client/src/lib/masterclass3VideoTracking.ts", "server/fixtures/masterclass3CopyEdits.json",
    ]) expect(read(p)).toBe(old(p));
  });
  it("changes historical checks only at their read boundary, leaving every assertion and test registration intact", () => {
    for (const [p, original] of [
      ["server/masterclass3Page.test.ts", 'const page = read("client/src/pages/Masterclass3.tsx");'],
      ["server/masterclass3SingleBooking.test.ts", "const page = read(path);"],
      ["server/masterclass3BookingActions.test.ts", 'const v3 = read("client/src/pages/Masterclass3.tsx");'],
    ]) {
      const updated = original.slice(0, -1) + '.replace("                What You Will Learn in the Above Video\\n", "                What You’ll Learn\\n");';
      expect(read(p).split(updated)).toHaveLength(2);
      expect(read(p).replace(updated, original)).toBe(old(p));
    }
  });
});
