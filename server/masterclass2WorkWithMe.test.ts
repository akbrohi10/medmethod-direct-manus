import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
const page = readFileSync("client/src/pages/Masterclass2.tsx", "utf8");
const original = readFileSync("client/src/pages/MasterclassVideoFirst.tsx", "utf8");
const section = page.slice(page.indexOf("        <section data-masterclass-video-first-booking"), page.indexOf("\n\n        <footer"));

describe("masterclass2 compact stacked Work With Me booking pills", () => {
  it("uses the approved concise copy and qualified copay comparison", () => {
    for (const phrase of ["Choose How to Connect", "Book a Free 15-Minute Call", "Care Team · General information, not medical advice.", "Book My Video Visit — Only $39!", "Meet with Dr. Al-Deek by video · About the cost of a copay."]) expect(section).toContain(phrase);
    expect(section).not.toContain("the same as your copay");
    expect(section).toContain("100% virtual care · Available in 17 states");
    expect(section).not.toMatch(/Thoughtful care|Together, we’ll|Have questions\?|Personalized care\.|<h3/);
  });

  it("stacks two full-width pills without large cards or desktop columns", () => {
    expect(section).toContain("data-masterclass2-stacked-booking-pills");
    expect(section).toContain("flex max-w-[560px] flex-col gap-4 text-center");
    expect(section).not.toMatch(/sm:grid-cols-2|rounded-2xl|bg-white p-5/);
    expect(section.match(/min-h-\[56px\] w-full/g)).toHaveLength(2);
    expect(section.match(/rounded-full/g)).toHaveLength(2);
    expect(section).toContain("border-2 border-[#b8336a] bg-white");
    expect(section).toContain("bg-gradient-to-r from-[#e8339e] to-[#7a1e7e]");
    expect(section.match(/focus-visible:outline-offset-3/g)).toHaveLength(2);
  });

  it("groups helpers closer to their buttons and removes only the requested disclosure", () => {
    expect(section.match(/className="mt-1\.5 /g)).toHaveLength(2);
    expect(page).not.toContain("data-masterclass2-self-pay-disclosure");
    expect(page).not.toContain("Self-pay—we don’t accept insurance. Copays vary by plan. Medication priced separately.");
    expect(section).not.toContain("with care focused on you");
  });

  it("uses 15px medium-weight charcoal text with 24px line height for all three remaining supporting paragraphs", () => {
    expect(section.match(/text-\[15px\] font-medium leading-6 text-\[#5a4452\]/g)).toHaveLength(3);
    expect(section).not.toMatch(/<p[^>]+(?:text-xs|text-sm|leading-relaxed|font-semibold)/);
  });

  it("preserves both existing booking actions and places the free call first beneath the full bio", () => {
    expect(page.indexOf("data-masterclass2-work-with-me")).toBeGreaterThan(page.indexOf("<PhysicianProfile />"));
    expect(section.indexOf("data-masterclass2-free-call")).toBeLessThan(section.indexOf("data-masterclass2-video-offer"));
    expect(section).toContain('href="/care-team-booking"');
    expect(section).toContain('data-masterclass-video-first-physician-cta onClick={() => setConsultationOpen(true)}');
    expect(page).toContain('<VideoVisitCheckout open={consultationOpen} onClose={() => setConsultationOpen(false)} />');
    expect(page).toContain("data-masterclass2-mobile-booking");
  });

  it("keeps old pricing removed only from the duplicate and preserves the original deposit checkout", () => {
    expect(page).not.toMatch(/\$199|\$50|\$149|\$150|45-Minute|PricingDetails|LpConsultationModal2/);
    expect(original).toContain("See Full Pricing Details");
    expect(original).toContain("$199 first visit. A $50 deposit");
    expect(original).toContain("LpConsultationModal2");
    expect([...page.matchAll(/\$\d+/g)].map(m => m[0])).toEqual(["$39", "$39"]);
  });
});
