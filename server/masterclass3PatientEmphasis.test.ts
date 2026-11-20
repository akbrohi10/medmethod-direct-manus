import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { beforeMasterclass3PatientEmphasis, PATIENT_EMPHASIS } from "./masterclass3PatientEmphasisBaseline";
import { beforeMasterclass3MagentaHero } from "./masterclass3MagentaHeroBaseline";
const root = new URL("../", import.meta.url);
const read = (p: string) => beforeMasterclass3MagentaHero(p, readFileSync(new URL(p, root), "utf8"));
const old = (p: string, version = "046e809d") => execFileSync("git", ["show", `${version}:${p}`], { cwd: root, encoding: "utf8" });
const path = "client/src/pages/Masterclass3.tsx", page = read(path);

describe("V3 original patient-count emphasis only", () => {
  it("changes only the patient-count span and exactly reconstructs the entire previous page", () => {
    expect(page.split(PATIENT_EMPHASIS)).toHaveLength(2);
    expect(beforeMasterclass3PatientEmphasis(path, page)).toBe(old(path));
    expect(page).toContain('Dr. Jumana Al-Deek, DO · Board-certified family physician · ' + PATIENT_EMPHASIS + ' seen');
    expect(PATIENT_EMPHASIS).toBe('<span className="font-black text-[#7a1e7e]">50,000+ patients</span>');
    expect(old(path, "61b4cd49")).toContain(PATIENT_EMPHASIS);
    expect(PATIENT_EMPHASIS).not.toMatch(/text-\[\d|fontFamily|block|tracking|onClick|href/);
  });
  it("preserves every other page, source section, integration and historical assertion", () => {
    for (const p of ["client/src/pages/Masterclass2.tsx", "client/src/pages/MasterclassVideoFirst.tsx", "client/src/pages/HomeHrt3.tsx", "client/src/components/masterclass3/Masterclass3FullBio.tsx", "client/src/components/home1/LpConsultationModal2.tsx", "client/src/lib/masterclass3VideoTracking.ts", "client/src/index.css", "client/src/App.tsx", "server/masterclass3MembershipBaseline.ts", "server/masterclass3Membership.test.ts", "server/masterclass3FullBio.test.ts", "server/masterclass3FullBioBaseline.ts", "server/masterclass3Page.test.ts", "server/masterclass3BookingActions.test.ts", "server/masterclass3SingleBooking.test.ts", "server/masterclass3LearningLabel.test.ts", "server/fixtures/masterclass3HeroEdits.json"]) expect(read(p)).toBe(old(p));
    const imp = 'import { beforeMasterclass3PatientEmphasis } from "./masterclass3PatientEmphasisBaseline";\n';
    expect(read("server/masterclass3HeroBaseline.ts").replace(imp, "").replace("  source = beforeMasterclass3PatientEmphasis(path, source);\n", "")).toBe(old("server/masterclass3HeroBaseline.ts"));
    expect(read("server/masterclass3Hero.test.ts").replace(imp, "").replace('const read = (p: string) => beforeMasterclass3PatientEmphasis(p, readFileSync(new URL(p, root), "utf8"));', 'const read = (p: string) => readFileSync(new URL(p, root), "utf8");')).toBe(old("server/masterclass3Hero.test.ts"));
  });
  it("requires a unique span and passes historical or unrelated source through unchanged", () => {
    expect(() => beforeMasterclass3PatientEmphasis(path, page + PATIENT_EMPHASIS)).toThrow();
    expect(beforeMasterclass3PatientEmphasis(path, old(path))).toBe(old(path));
    expect(beforeMasterclass3PatientEmphasis("unrelated", PATIENT_EMPHASIS)).toBe(PATIENT_EMPHASIS);
  });
});
