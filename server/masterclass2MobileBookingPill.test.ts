import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const page = readFileSync("client/src/pages/Masterclass2.tsx", "utf8");
const original = readFileSync("client/src/pages/MasterclassVideoFirst.tsx", "utf8");
const pill = page.slice(page.indexOf('        <button\n          type="button"\n          data-masterclass2-mobile-booking'), page.indexOf('\n      <VideoVisitCheckout'));

describe("masterclass2 mobile sticky booking pill", () => {
  it("adds exactly one mobile-only bottom pill using the existing booking copy", () => {
    expect([...page.matchAll(/data-masterclass2-mobile-booking/g)]).toHaveLength(1);
    expect(pill).toContain('type="button"');
    expect(pill).toContain('aria-haspopup="dialog"');
    expect(pill).toContain("Book My Visit — $39");
    expect(pill).toContain("fixed z-40");
    expect(pill).toContain("md:hidden");
    expect(pill).toContain("rounded-full");
    expect(pill).toContain("min-h-[56px]");
    expect(pill).toContain("max-w-[440px]");
  });
  it("opens the existing modal without changing provider or payment behavior", () => {
    expect(pill).toContain("mobileBookingOpened.current = true; setConsultationOpen(true);");
    expect(pill).toContain("ref={mobileBookingRef}");
    expect(page).toContain("mobileBookingRef.current?.focus({ preventScroll: true })");
    expect(page).toContain("window.clearTimeout(timer)");
    expect(pill).toContain('display: consultationOpen ? "none" : undefined');
    expect(pill).not.toMatch(/fetch\(|trpc\.|location\.|paypal|stripe|href=|localStorage|sessionStorage/);
    expect(page).toContain('<VideoVisitCheckout open={consultationOpen} onClose={() => setConsultationOpen(false)} />');
    expect(pill).toContain("focus-visible:outline-2");
  });
  it("reserves content space and respects bottom and side safe areas only on this mobile page", () => {
    expect(page).toContain("<main data-masterclass2-page ");
    expect(page).toContain("@media (max-width: 767px)");
    expect(page).toContain("[data-masterclass2-page] { padding-bottom: calc(88px + env(safe-area-inset-bottom, 0px)); }");
    expect(pill).toContain('left: "max(12px, env(safe-area-inset-left, 0px))"');
    expect(pill).toContain('right: "max(12px, env(safe-area-inset-right, 0px))"');
    expect(pill).toContain('bottom: "calc(12px + env(safe-area-inset-bottom, 0px))"');
    expect(original).not.toContain("data-masterclass2-mobile-booking");
    expect(original).not.toContain("data-masterclass2-page");
  });
});
