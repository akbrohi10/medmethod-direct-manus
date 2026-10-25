import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const page = readFileSync("client/src/pages/Masterclass2.tsx", "utf8");
const original = readFileSync("client/src/pages/MasterclassVideoFirst.tsx", "utf8");

function sliceBetween(source: string, start: string, end: string) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex);

  if (startIndex < 0 || endIndex < 0) {
    throw new Error(`Could not find expected source boundaries: ${start} … ${end}`);
  }

  return source.slice(startIndex, endIndex);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const mobileConnectionBar = sliceBetween(
  page,
  "\n        <nav\n          data-masterclass2-mobile-connection-bar",
  "\n      <VideoVisitCheckout",
);
const mobileNav = mobileConnectionBar.match(/<nav\b[\s\S]*?>/)?.[0] ?? "";

function controlSlice(marker: string) {
  const control = mobileConnectionBar.match(
    new RegExp(`<(?<tag>button|a)\\b[^>]*\\b${escapeRegExp(marker)}\\b[^>]*>[\\s\\S]*?<\\/\\k<tag>>`),
  );

  if (!control) {
    throw new Error(`Could not find native mobile control: ${marker}`);
  }

  return control[0];
}

const mobileTextVisit = controlSlice("data-masterclass2-mobile-text-visit");
const mobileBooking = controlSlice("data-masterclass2-mobile-booking");
const mobileCareCall = controlSlice("data-masterclass2-mobile-care-call");
const mobileControls = [mobileTextVisit, mobileBooking, mobileCareCall];
const mobileControlOrder = [
  ...mobileConnectionBar.matchAll(
    /<(?:button|a)\b[^>]*\b(data-masterclass2-mobile-(?:text-visit|booking|care-call))\b[^>]*>/g,
  ),
].map((match) => match[1]);

describe("masterclass2 mobile connection bar", () => {
  it("adds one mobile-only, three-column connection nav with exactly three native controls in the approved order", () => {
    expect([...page.matchAll(/data-masterclass2-mobile-connection-bar/g)]).toHaveLength(1);
    expect([...page.matchAll(/data-masterclass2-mobile-text-visit/g)]).toHaveLength(1);
    expect([...page.matchAll(/data-masterclass2-mobile-booking/g)]).toHaveLength(1);
    expect([...page.matchAll(/data-masterclass2-mobile-care-call/g)]).toHaveLength(1);
    expect(mobileNav).toContain('aria-label="Choose how to connect"');
    expect(mobileNav).toMatch(/className="[^"]*\bfixed\b[^"]*\bz-40\b[^"]*\bmx-auto\b[^"]*\bmd:hidden\b/);
    expect(mobileConnectionBar).toContain("grid grid-cols-3 gap-1");
    expect([...mobileConnectionBar.matchAll(/\bgrid-cols-3\b/g)]).toHaveLength(1);
    expect(mobileConnectionBar.match(/<(?:button|a)\b/g)).toHaveLength(3);
    expect(mobileConnectionBar).not.toMatch(/<(?:form|input|select|textarea)\b/);
    expect(mobileControlOrder).toEqual([
      "data-masterclass2-mobile-text-visit",
      "data-masterclass2-mobile-booking",
      "data-masterclass2-mobile-care-call",
    ]);

    for (const control of mobileControls) {
      expect(control).toMatch(/^<(?:button|a)\b/);
      expect(control).toContain("min-h-[68px]");
      expect(control).toContain("focus-visible:");
      expect(control).toContain('className="h-[22px] w-[22px] shrink-0"');
      expect(control).toContain("text-[11px]");
      expect(control).toMatch(/<span[^>]*\bwhitespace-nowrap\b[^>]*\bfont-bold\b[^>]*>/);
      expect(control).toMatch(/<span[^>]*\bwhitespace-nowrap\b[^>]*text-\[10px\][^>]*\bfont-normal\b[^>]*>/);
    }

    expect(mobileTextVisit).toMatch(/^<a\b/);
    expect(mobileBooking).toMatch(/^<button\b/);
    expect(mobileCareCall).toMatch(/^<a\b/);
  });

  it("keeps the wrapper desktop-hidden and styled as the approved white, safe-area-aware floating surface", () => {
    expect(mobileNav).toContain("max-w-[440px]");
    expect(mobileNav).toContain("rounded-[12px]");
    expect(mobileNav).toContain("border-[#e9c8f3]");
    expect(mobileNav).toContain("bg-white");
    expect(mobileNav).toContain("p-1.5");
    expect(mobileNav).not.toContain("shadow");
    expect(mobileNav).not.toContain("backdrop-blur");
    expect(mobileNav).toContain('left: "max(12px, env(safe-area-inset-left, 0px))"');
    expect(mobileNav).toContain('right: "max(12px, env(safe-area-inset-right, 0px))"');
    expect(mobileNav).toContain('bottom: "calc(12px + env(safe-area-inset-bottom, 0px))"');
    expect(mobileNav).toContain('display: consultationOpen ? "none" : undefined');
    expect(mobileNav).not.toMatch(/\bmd:(?:flex|grid|block|inline-flex)\b/);
  });

  it("keeps the paid Video Visit button connected only to the existing checkout and focus recovery", () => {
    expect(mobileBooking).toContain('type="button"');
    expect(mobileBooking).toContain('aria-haspopup="dialog"');
    expect(mobileBooking).toContain('aria-label="Video visit — $39"');
    expect(mobileBooking).toContain("ref={mobileBookingRef}");
    expect(mobileBooking).toContain(
      "onClick={() => { mobileBookingOpened.current = true; setConsultationOpen(true); }}",
    );
    expect(mobileBooking).toContain("rounded-[9px]");
    expect(mobileBooking).toContain("bg-gradient-to-r");
    expect(mobileBooking).toContain("from-[#bb0d7e]");
    expect(mobileBooking).toContain("to-[#680686]");
    expect(mobileBooking).toContain("text-white");
    expect(mobileBooking).toMatch(/<span[^>]*>\s*Video Visit\s*<\/span>/);
    expect(mobileBooking).toMatch(/<span[^>]*>\s*\$39\s*<\/span>/);
    expect(mobileBooking).toMatch(/<Video\b[^>]*aria-hidden="true"[^>]*\/>/);
    expect(mobileBooking).not.toMatch(/(?:fetch\(|trpc\.|location\.|paypal|stripe|localStorage|sessionStorage)/i);

    expect(page).toContain(
      "  const mobileBookingRef = useRef<HTMLButtonElement>(null);\n  const mobileBookingOpened = useRef(false);",
    );
    expect(page).toContain(
      "  useEffect(() => {\n    if (!consultationOpen && mobileBookingOpened.current) {\n      mobileBookingOpened.current = false;\n      const timer = window.setTimeout(() => mobileBookingRef.current?.focus({ preventScroll: true }), 250);\n      return () => window.clearTimeout(timer);\n    }\n  }, [consultationOpen]);",
    );
    expect(page).toContain('<VideoVisitCheckout open={consultationOpen} onClose={() => setConsultationOpen(false)} />');
  });

  it("keeps the free text link and native phone link exact, visibly two-line, and decorative-icon-only", () => {
    expect(mobileTextVisit).toContain('href="https://intake.medmethoddirect.com/"');
    expect(mobileTextVisit).toContain('aria-label="Text visit — free"');
    expect(mobileTextVisit).toMatch(/<span[^>]*>\s*Text Visit\s*<\/span>/);
    expect(mobileTextVisit).toMatch(/<span[^>]*>\s*Free\s*<\/span>/);
    expect(mobileTextVisit).toMatch(/<MessageCircleMore\b[^>]*aria-hidden="true"[^>]*\/>/);

    expect(mobileCareCall).toContain('href="tel:+18883627011"');
    expect(mobileCareCall).toContain('aria-label="Call now for more information: (888) 362-7011"');
    expect(mobileCareCall).toMatch(/<span[^>]*>\s*Call Now\s*<\/span>/);
    expect(mobileCareCall).toMatch(/<span[^>]*>\s*For more info\s*<\/span>/);
    expect(mobileCareCall).toMatch(/<PhoneCall\b[^>]*aria-hidden="true"[^>]*\/>/);
    expect(mobileCareCall).not.toMatch(/\bonClick\s*=/);
    expect(mobileCareCall).not.toMatch(/\btarget\s*=/);

    for (const outlinedControl of [mobileTextVisit, mobileCareCall]) {
      expect(outlinedControl).toContain("rounded-[9px]");
      expect(outlinedControl).toContain("border-[#b367ca]");
      expect(outlinedControl).toContain("bg-white");
      expect(outlinedControl).toContain("text-[#870081]");
    }

    for (const control of mobileControls) {
      expect(control).not.toMatch(/<(?:Video|MessageCircleMore|PhoneCall)\b[^>]*aria-label=/);
      expect(control).not.toMatch(/(?:fetch\(|trpc\.|location\.|paypal|stripe|localStorage|sessionStorage)/i);
    }
  });

  it("reserves the taller mobile-only safe area without changing the approved headline, main copy, or large connection rows", () => {
    expect(page).toContain("<main data-masterclass2-page ");
    expect(page).toContain(
      "@media (max-width: 767px) {\n          [data-masterclass2-page] { padding-bottom: calc(112px + env(safe-area-inset-bottom, 0px)); }\n        }",
    );
    expect(page).not.toContain("padding-bottom: calc(88px + env(safe-area-inset-bottom, 0px))");
    expect(page).toContain("Menopause, Hormones");
    expect(page).toContain("Done Right for You.");
    expect(page).toContain("Watch Now—Get Answers.");
    expect(page).toContain("Choose How to Connect");
    expect(page).toContain("100% virtual care · Available in 17 states");
    expect(page).toContain('<a href="/care-team-booking" data-masterclass-video-first-care-team-cta');
    expect(page).not.toContain("Book My Video Visit — Only $39!");
    expect(original).not.toContain("data-masterclass2-mobile-connection-bar");
    expect(original).not.toContain("data-masterclass2-page");
  });
});
