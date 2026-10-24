import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
const page = readFileSync("client/src/pages/Masterclass2.tsx", "utf8");
const original = readFileSync("client/src/pages/MasterclassVideoFirst.tsx", "utf8");

describe("masterclass2 approved Work With Me offer", () => {
  it("uses the approved patient-centered copy and qualified copay comparison", () => {
    for (const phrase of ["Work With Me", "Thoughtful care. A plan built around you.", "Together, we’ll look at your symptoms, health history, and goals—not just the number on the scale.", "Personalized care. $39 per video visit.", "About the cost of a copay—with a visit focused on you.", "Self-pay visit. Insurance copays vary by plan. Medication is priced separately."]) expect(page).toContain(phrase);
    expect(page).not.toContain("the same as your copay");
    expect(page).toContain("Available in 17 states");
  });
  it("places the free Care Team call before the paid doctor visit beneath the full bio", () => {
    expect(page.indexOf("data-masterclass2-work-with-me")).toBeGreaterThan(page.indexOf("<PhysicianProfile />"));
    expect(page.indexOf("data-masterclass2-free-call")).toBeLessThan(page.indexOf("data-masterclass2-video-offer"));
    expect(page).toContain('href="/care-team-booking"');
    expect(page).toContain("Book a Free 15-Minute Call");
    expect(page).toContain("With our Care Team. General information—not medical advice.");
    expect(page).toContain("Book Now — $39 per visit");
    expect(page).toContain("Video visit with Dr. Al-Deek.");
    expect(page).toContain('<VideoVisitCheckout open={consultationOpen} onClose={() => setConsultationOpen(false)} />');
  });
  it("removes old pricing only from the duplicate and never sends it to the old deposit checkout", () => {
    expect(page).not.toMatch(/\$199|\$50|\$149|\$150|45-Minute|PricingDetails|LpConsultationModal2/);
    expect(original).toContain("See Full Pricing Details");
    expect(original).toContain("$199 first visit. A $50 deposit");
    expect(original).toContain("LpConsultationModal2");
    expect([...page.matchAll(/\$\d+/g)].map(m => m[0])).toEqual(["$39", "$39"]);
  });
});
