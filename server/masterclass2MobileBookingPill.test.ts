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

const mobileConnectionBar = sliceBetween(
  page,
  "\n        <nav\n          data-masterclass2-mobile-connection-bar",
  "\n      <VideoVisitCheckout",
);
const mobileNav = mobileConnectionBar.match(/<nav\b[\s\S]*?>/)?.[0] ?? "";

function controlSlice(marker: string, nextMarker?: string) {
  const markerIndex = mobileConnectionBar.indexOf(marker);
  const start = mobileConnectionBar.lastIndexOf("<", markerIndex);
  const next = nextMarker ? mobileConnectionBar.indexOf(nextMarker, markerIndex) : -1;
  return mobileConnectionBar.slice(start, next === -1 ? undefined : next);
}

const mobileBooking = controlSlice(
  "data-masterclass2-mobile-booking",
  "data-masterclass2-mobile-text-visit",
);
const mobileTextVisit = controlSlice(
  "data-masterclass2-mobile-text-visit",
  "data-masterclass2-mobile-care-call",
);
const mobileCareCall = controlSlice("data-masterclass2-mobile-care-call");
const mobileControls = [mobileBooking, mobileTextVisit, mobileCareCall];

describe("masterclass2 mobile connection bar", () => {
  it("adds one mobile-only, three-column connection nav with exactly three native controls", () => {
    expect([...page.matchAll(/data-masterclass2-mobile-connection-bar/g)]).toHaveLength(1);
    expect([...page.matchAll(/data-masterclass2-mobile-booking/g)]).toHaveLength(1);
    expect(mobileNav).toContain('aria-label="Choose how to connect"');
    expect(mobileNav).toMatch(/className="[^"]*\bfixed\b[^"]*\bz-40\b[^"]*\bmx-auto\b[^"]*\bmd:hidden\b/);
    expect(mobileConnectionBar).toContain("grid grid-cols-3 gap-1");
    expect([...mobileConnectionBar.matchAll(/\bgrid-cols-3\b/g)]).toHaveLength(1);
    expect(mobileConnectionBar.match(/<(?:button|a)\b/g)).toHaveLength(3);
    expect(mobileConnectionBar).not.toMatch(/<(?:form|input|select|textarea)\b/);

    for (const control of mobileControls) {
      expect(control).toMatch(/<(?:button|a)\b/);
      expect(control).toContain("min-h-[68px]");
      expect(control).toContain("focus-visible:");
    }

    expect(mobileBooking).toMatch(/^<button\b/);
    expect(mobileTextVisit).toMatch(/^<a\b/);
    expect(mobileCareCall).toMatch(/^<a\b/);
  });

  it("keeps the wrapper desktop-hidden and styled as the translucent, safe-area-aware floating surface", () => {
    expect(mobileNav).toContain("rounded-[24px]");
    expect(mobileNav).toMatch(/\bbg-white\/\d+/);
    expect(mobileNav).toMatch(/\bborder\b/);
    expect(mobileNav).toMatch(/\bshadow-\[/);
    expect(mobileNav).toMatch(/\bbackdrop-blur(?:-[\w-]+)?\b/);
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
    expect(mobileBooking).toMatch(/bg-gradient-to-[\w-]+/);
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

  it("keeps the free text and care-team links exact, visible in two lines, and decorative-icon-only", () => {
    expect(mobileTextVisit).toContain('href="https://intake.medmethoddirect.com/"');
    expect(mobileTextVisit).toContain('aria-label="Text your doctor — free"');
    expect(mobileTextVisit).toMatch(/<span[^>]*>\s*Text Your Doctor\s*<\/span>/);
    expect(mobileTextVisit).toMatch(/<span[^>]*>\s*Free\s*<\/span>/);
    expect(mobileTextVisit).toMatch(/<MessageCircleMore\b[^>]*aria-hidden="true"[^>]*\/>/);
    expect(mobileTextVisit).toMatch(/(?:bg-\[|bg-pink-)/);

    expect(mobileCareCall).toContain('href="/care-team-booking"');
    expect(mobileCareCall).toContain('aria-label="Care Team call — free, 15 minutes"');
    expect(mobileCareCall).toMatch(/<span[^>]*>\s*Care Team Call\s*<\/span>/);
    expect(mobileCareCall).toMatch(/<span[^>]*>\s*Free · 15 min\s*<\/span>/);
    expect(mobileCareCall).toMatch(/<PhoneCall\b[^>]*aria-hidden="true"[^>]*\/>/);
    expect(mobileCareCall).toContain("bg-white");

    for (const control of mobileControls) {
      expect(control).not.toMatch(/<(?:Video|MessageCircleMore|PhoneCall)\b[^>]*aria-label=/);
      expect(control).not.toMatch(/(?:fetch\(|trpc\.|location\.|paypal|stripe|localStorage|sessionStorage)/i);
    }
  });

  it("reserves the taller mobile-only safe area without changing the approved headline or main copy", () => {
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
    expect(page).not.toContain("Book My Video Visit — Only $39!");
    expect(original).not.toContain("data-masterclass2-mobile-connection-bar");
    expect(original).not.toContain("data-masterclass2-page");
  });
});
