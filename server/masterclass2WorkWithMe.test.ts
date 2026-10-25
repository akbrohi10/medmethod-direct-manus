import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const page = readFileSync("client/src/pages/Masterclass2.tsx", "utf8");
const original = readFileSync("client/src/pages/MasterclassVideoFirst.tsx", "utf8");
const sectionStart = page.indexOf("        <section data-masterclass-video-first-booking");
const sectionEnd = page.indexOf("\n\n        <footer", sectionStart);
const section = page.slice(sectionStart, sectionEnd);

function row(marker: string, nextMarker: string) {
  const start = section.indexOf(marker);
  const end = section.indexOf(nextMarker, start);
  return section.slice(start, end === -1 ? undefined : end);
}

const videoOffer = row("data-masterclass2-video-offer", "data-masterclass2-text-visit");
const textVisit = row("data-masterclass2-text-visit", "data-masterclass2-free-call");
const freeCall = row("data-masterclass2-free-call", "data-masterclass2-connection-disclosures");
const textVisitAnchor = textVisit.match(/<a[^>]*data-masterclass2-text-visit-cta[^>]*>/)?.[0] ?? "";
const careTeamAnchor = freeCall.match(/<a[^>]*data-masterclass-video-first-care-team-cta[^>]*>/)?.[0] ?? "";
const videoButton = videoOffer.match(/<button\b[\s\S]*?className="[^"]*"/)?.[0] ?? "";

const rows = [videoOffer, textVisit, freeCall];

describe("masterclass2 Choose How to Connect connection rows", () => {
  it("keeps the approved header and a single compact connection-row container", () => {
    expect(section).toContain("data-masterclass2-work-with-me");
    expect(section).toContain("Choose How to Connect");
    expect(section).toContain("100% virtual care · Available in 17 states");
    expect(section).toMatch(/<div[^>]*data-masterclass2-connection-rows[^>]*className="[^"]*max-w-\[640px\][^"]*flex-col[^"]*gap-3\.5[^"]*"/);
    expect(section).not.toContain("data-masterclass2-stacked-booking-pills");
    expect(section).not.toMatch(/Book a Free 15-Minute Call|About the cost of a copay/);
  });

  it("keeps exactly three full-width rounded native controls in video, text, then care-team order", () => {
    expect(section.indexOf("data-masterclass2-video-offer")).toBeLessThan(section.indexOf("data-masterclass2-text-visit"));
    expect(section.indexOf("data-masterclass2-text-visit")).toBeLessThan(section.indexOf("data-masterclass2-free-call"));
    expect(section.match(/data-masterclass2-(?:video-offer|text-visit|free-call)(?=[\s>])/g)).toHaveLength(3);
    expect(rows).toHaveLength(3);

    for (const currentRow of rows) {
      expect(currentRow).toMatch(/<(?:button|a)\b[\s\S]*?className="[^"]*\bw-full\b[^"]*\brounded-/);
      expect(currentRow).toMatch(/focus-visible:(?:outline|ring)/);
      expect(currentRow).not.toMatch(/<p\b/);
    }

    expect(videoOffer).toMatch(/<button\b/);
    expect(textVisit).toMatch(/<a\b/);
    expect(freeCall).toMatch(/<a\b/);
  });

  it("keeps the paid video row connected to the existing checkout and its approved price", () => {
    expect(videoOffer).toContain('data-masterclass-video-first-physician-cta onClick={() => setConsultationOpen(true)}');
    expect(videoButton).toContain("bg-gradient-to-r");
    expect(videoButton).toContain("from-[#e8339e]");
    expect(videoButton).toContain("to-[#7a1e7e]");
    expect(videoOffer).toContain("Book My Video Visit");
    expect(videoOffer).toContain("Only $39");
    expect(videoOffer).toMatch(/<Video\b[^>]*aria-hidden="true"[^>]*\/>/);
    expect(videoOffer).toMatch(/<ArrowRight\b[^>]*aria-hidden="true"[^>]*\/>/);
  });

  it("keeps the text-only intake row exact, direct, and free of tracking, prefills, and checkout calls", () => {
    expect(textVisitAnchor).toMatch(/^<a href="https:\/\/intake\.medmethoddirect\.com\/" data-masterclass2-text-visit-cta\b/);
    expect(textVisit).toContain("Free Doctor Visit — Text Only");
    expect(textVisit).toContain("Complete your intake (5–10 min), then start messaging with your doctor.");
    expect(textVisitAnchor).toMatch(/bg-\[#(?:fff[\w]*|f[\w]*)\]/i);
    expect(textVisitAnchor).toMatch(/border[^\"]*\[#(?:E8D5DC|[\w]+)\]/i);
    expect(textVisit).toMatch(/<MessageCircleMore\b[^>]*aria-hidden="true"[^>]*\/>/);
    expect(textVisit).toMatch(/<ArrowRight\b[^>]*aria-hidden="true"[^>]*\/>/);
    expect(textVisit).not.toMatch(/(?:utm_|tracking|prefill|checkout|setConsultationOpen|VideoVisitCheckout)/i);
  });

  it("keeps the free care-team discovery call as the outlined, non-medical-advice option", () => {
    expect(careTeamAnchor).toMatch(/^<a href="\/care-team-booking" data-masterclass-video-first-care-team-cta\b/);
    expect(careTeamAnchor).toMatch(/(?:border|outline)/);
    expect(careTeamAnchor).toMatch(/bg-white/);
    expect(freeCall).toContain("Free 15-Minute Discovery Call");
    expect(freeCall).toContain("Talk with our care team, ask questions, and find the best option for you.");
    expect(freeCall).toMatch(/<PhoneCall\b[^>]*aria-hidden="true"[^>]*\/>/);
    expect(freeCall).toMatch(/<ArrowRight\b[^>]*aria-hidden="true"[^>]*\/>/);
  });

  it("uses decorative, unlabelled standard lucide icons and one shared disclosure footer", () => {
    for (const icon of ["Video", "MessageCircleMore", "PhoneCall"]) {
      expect(page).toMatch(new RegExp(`import\\s*\\{[^}]*\\b${icon}\\b[^}]*\\}\\s*from\\s*["']lucide-react["']`));
    }
    expect(section.match(/<ArrowRight\b[^>]*aria-hidden="true"[^>]*\/>/g)).toHaveLength(3);
    expect(section).not.toMatch(/<(?:Video|MessageCircleMore|PhoneCall|ArrowRight)\b[^>]*aria-label=/);

    const disclosuresStart = section.indexOf("data-masterclass2-connection-disclosures");
    expect(disclosuresStart).toBeGreaterThan(section.indexOf("data-masterclass2-free-call"));
    const disclosures = section.slice(disclosuresStart);
    expect(disclosures).toContain("Ongoing text care included. Medication priced separately.");
    expect(disclosures).toContain("Care Team call: general information, not medical advice.");
    expect([...disclosures.matchAll(/Ongoing text care included\. Medication priced separately\.|Care Team call: general information, not medical advice\./g)]).toHaveLength(2);
    for (const currentRow of rows) {
      expect(currentRow).not.toMatch(/Ongoing text care included|Care Team call: general information/);
    }
  });

  it("leaves the original pricing guard, mobile paid action, and checkout integration intact", () => {
    expect(page).not.toMatch(/\$199|\$50|\$149|\$150|45-Minute|PricingDetails|LpConsultationModal2/);
    expect(original).toContain("See Full Pricing Details");
    expect(original).toContain("$199 first visit. A $50 deposit");
    expect(original).toContain("LpConsultationModal2");
    expect([...page.replace('aria-label="Video visit — $39 per visit"', "").matchAll(/\$\d+/g)].map(match => match[0])).toEqual(["$39", "$39"]);
    expect(page).toContain("data-masterclass2-mobile-booking");
    expect(page).toContain('aria-label="Video visit — $39 per visit"');
    expect(page).toContain("<VideoVisitCheckout open={consultationOpen} onClose={() => setConsultationOpen(false)} />");
  });
});
