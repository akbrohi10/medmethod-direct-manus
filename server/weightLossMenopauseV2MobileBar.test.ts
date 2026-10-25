import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (file: string) => readFileSync(resolve(import.meta.dirname, "..", file), "utf8");
const page = read("client/src/pages/WeightLossMenopauseV2.tsx");
const css = read("client/src/pages/WeightLossMenopauseV2.css");
const mobileBar = read("client/src/pages/WeightLossMenopauseV2MobileBar.tsx");
const masterclass2 = read("client/src/pages/Masterclass2.tsx");
const originalInteraction = read("client/src/pages/weightLossMenopauseInteractions.ts");
const interaction = read("client/src/pages/weightLossMenopauseV2Interactions.ts");

const mobileBarMarker = "\n/* Approved V2 three-option mobile bar: content clearance only. */";
const legacyStickyCta = '<div className="sticky-cta" aria-hidden="true"><span className="sticky-cta-price">FREE<small> text care</small></span><a className="btn" href={WEIGHT_MENOPAUSE_INTAKE_URL} aria-label="Start your free doctor evaluation by text">Start your visit <span className="arrow">→</span></a></div>';
const approvedMobileBarCss = `
/* Approved V2 three-option mobile bar: content clearance only. */
@media (max-width: 767px) {
  .wlm-v2-page { padding-bottom: calc(112px + env(safe-area-inset-bottom, 0px)); }
}
`;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function mobileNav(source: string, marker: string) {
  const markerIndex = source.indexOf(marker);
  const navStart = source.lastIndexOf("<nav", markerIndex);
  const navEnd = source.indexOf("</nav>", markerIndex);

  if (markerIndex < 0 || navStart < 0 || navEnd < 0) {
    throw new Error(`Could not find the expected mobile nav: ${marker}`);
  }

  return source.slice(navStart, navEnd + "</nav>".length);
}

function controlSlice(source: string, marker: string) {
  const control = source.match(
    new RegExp(`<(?<tag>button|a)\\b[^>]*\\b${escapeRegExp(marker)}\\b[^>]*>[\\s\\S]*?<\\/\\k<tag>>`),
  );

  if (!control) throw new Error(`Could not find mobile control: ${marker}`);
  return control[0];
}

function restoreOriginalNames(source: string): string {
  return source
    .replaceAll("WeightLossMenopauseV2", "WeightLossMenopause")
    .replaceAll("weightLossMenopauseV2Interactions", "weightLossMenopauseInteractions")
    .replaceAll("weight-loss-menopauseV2", "weight-loss-menopause")
    .replaceAll("wlm-v2-page", "wlm-page")
    .replaceAll("wlm-v2-content", "wlm-content")
    .replaceAll("wlm-v2-", "wlm-");
}

const masterclassNav = mobileNav(masterclass2, "data-masterclass2-mobile-connection-bar");
const v2Nav = mobileNav(mobileBar, "data-wlm-v2-mobile-connection-bar");
const expectedV2Nav = masterclassNav
  .replaceAll("data-masterclass2-mobile-", "data-wlm-v2-mobile-")
  .replace(
    'style={{ display: consultationOpen ? "none" : undefined, left:',
    'style={{ fontFamily: "Montserrat, sans-serif", color: "#25212a", display: consultationOpen ? "none" : undefined, left:',
  );
const textVisit = controlSlice(v2Nav, "data-wlm-v2-mobile-text-visit");
const booking = controlSlice(v2Nav, "data-wlm-v2-mobile-booking");
const careCall = controlSlice(v2Nav, "data-wlm-v2-mobile-care-call");


describe("Weight-Loss & Menopause V2 approved mobile connection bar", () => {
  it("is the entire finalized Masterclass2 nav with only V2 marker remapping and the required explicit Montserrat font", () => {
    expect(v2Nav).toBe(expectedV2Nav);
    expect([...mobileBar.matchAll(/data-wlm-v2-mobile-connection-bar/g)]).toHaveLength(1);
    expect([...mobileBar.matchAll(/data-wlm-v2-mobile-text-visit/g)]).toHaveLength(1);
    expect([...mobileBar.matchAll(/data-wlm-v2-mobile-booking/g)]).toHaveLength(1);
    expect([...mobileBar.matchAll(/data-wlm-v2-mobile-care-call/g)]).toHaveLength(1);
    expect(mobileBar).not.toContain("data-masterclass2-mobile-");

    expect(v2Nav).toContain('aria-label="Choose how to connect"');
    expect(v2Nav).toMatch(/className="[^"]*\bfixed\b[^"]*\bz-40\b[^"]*\bmx-auto\b[^"]*\bmd:hidden\b/);
    expect(v2Nav).toContain("max-w-[440px]");
    expect(v2Nav).toContain("rounded-[12px]");
    expect(v2Nav).toContain("border-[#e9c8f3]");
    expect(v2Nav).toContain("bg-white");
    expect(v2Nav).toContain("p-1.5");
    expect(v2Nav).toContain("shadow-[0_6px_20px_rgba(61,22,64,0.12)]");
    expect(v2Nav).toContain('style={{ fontFamily: "Montserrat, sans-serif", color: "#25212a", display: consultationOpen ? "none" : undefined, left: "max(12px, env(safe-area-inset-left, 0px))", right: "max(12px, env(safe-area-inset-right, 0px))", bottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}');
  });

  it("keeps exactly three native, 68px mobile controls in the approved text, video, call order with their labels, icons, colors, and literal URLs", () => {
    const controlOrder = [
      ...v2Nav.matchAll(/<(?:button|a)\b[^>]*\b(data-wlm-v2-mobile-(?:text-visit|booking|care-call))\b[^>]*>/g),
    ].map(match => match[1]);

    expect(v2Nav).toContain("grid grid-cols-3 gap-1");
    expect(v2Nav.match(/<(?:button|a)\b/g)).toHaveLength(3);
    expect(v2Nav).not.toMatch(/<(?:form|input|select|textarea)\b/);
    expect(controlOrder).toEqual([
      "data-wlm-v2-mobile-text-visit",
      "data-wlm-v2-mobile-booking",
      "data-wlm-v2-mobile-care-call",
    ]);

    for (const control of [textVisit, booking, careCall]) {
      expect(control).toContain("min-h-[68px]");
      expect(control).toContain("min-w-0");
      expect(control).toContain("rounded-[9px]");
      expect(control).toContain("focus-visible:");
      expect(control).toContain('className="h-[22px] w-[22px] shrink-0"');
      expect(control).toContain("text-[11px]");
      expect(control).toMatch(/<span[^>]*\bwhitespace-nowrap\b[^>]*\bfont-bold\b[^>]*>/);
      expect(control).toMatch(/<span[^>]*\bwhitespace-nowrap\b[^>]*text-\[10px\][^>]*\bfont-normal\b[^>]*>/);
    }

    expect(textVisit).toMatch(/^<a\b/);
    expect(textVisit).toContain('href="https://intake.medmethoddirect.com/"');
    expect(textVisit).toContain('aria-label="Text visit — free"');
    expect(textVisit).toContain("border-[#b367ca]");
    expect(textVisit).toContain("bg-white");
    expect(textVisit).toContain("text-[#870081]");
    expect(textVisit).toMatch(/<MessageCircleMore\b[^>]*aria-hidden="true"[^>]*\/>/);
    expect(textVisit).toMatch(/<span[^>]*>Text Visit<\/span>/);
    expect(textVisit).toMatch(/<span[^>]*>Free<\/span>/);

    expect(booking).toMatch(/^<button\b/);
    expect(booking).toContain('aria-label="Video visit — $39 per visit"');
    expect(booking).toContain("bg-gradient-to-r");
    expect(booking).toContain("from-[#bb0d7e]");
    expect(booking).toContain("to-[#680686]");
    expect(booking).toContain("text-white");
    expect(booking).toMatch(/<Video\b[^>]*aria-hidden="true"[^>]*\/>/);
    expect(booking).toMatch(/<span[^>]*>Video Visit<\/span>/);
    expect(booking).toMatch(/<span[^>]*>\$39 per visit<\/span>/);

    expect(careCall).toMatch(/^<a\b/);
    expect(careCall).toContain('href="tel:+18883627011"');
    expect(careCall).toContain('aria-label="Call now for more information: (888) 362-7011"');
    expect(careCall).toContain("border-[#b367ca]");
    expect(careCall).toContain("bg-white");
    expect(careCall).toContain("text-[#870081]");
    expect(careCall).toMatch(/<PhoneCall\b[^>]*aria-hidden="true"[^>]*\/>/);
    expect(careCall).toMatch(/<span[^>]*>Call Now<\/span>/);
    expect(careCall).toMatch(/<span[^>]*>Clinic info<\/span>/);
  });

  it("uses only the existing Video Visit checkout state, identical click behavior, and delayed focus recovery without pending-checkout reopening or tracking", () => {
    expect(mobileBar).toContain('import { useEffect, useRef, useState } from "react";');
    expect(mobileBar).toContain('import VideoVisitCheckout from "@/components/masterclass2/VideoVisitCheckout";');
    expect(mobileBar).toContain("export default function WeightLossMenopauseV2MobileBar()");
    expect(mobileBar).toContain("  const [consultationOpen, setConsultationOpen] = useState(false);");
    expect(mobileBar).toContain("  const mobileBookingRef = useRef<HTMLButtonElement>(null);\n  const mobileBookingOpened = useRef(false);");
    expect(mobileBar).toContain("  useEffect(() => {\n    if (!consultationOpen && mobileBookingOpened.current) {\n      mobileBookingOpened.current = false;\n      const timer = window.setTimeout(() => mobileBookingRef.current?.focus({ preventScroll: true }), 250);\n      return () => window.clearTimeout(timer);\n    }\n  }, [consultationOpen]);");
    expect(booking).toContain('type="button"');
    expect(booking).toContain('aria-haspopup="dialog"');
    expect(booking).toContain("ref={mobileBookingRef}");
    expect(booking).toContain("onClick={() => { mobileBookingOpened.current = true; setConsultationOpen(true); }}");
    expect(mobileBar).toContain('<VideoVisitCheckout open={consultationOpen} onClose={() => setConsultationOpen(false)} />');
    expect(mobileBar.indexOf("<nav")).toBeLessThan(mobileBar.indexOf("<VideoVisitCheckout"));
    expect(mobileBar).toMatch(/return \(\n    <>[\s\S]*<\/>\n  \);/);

    for (const forbiddenBehavior of [
      "getVideoVisitPendingCheckout",
      "pendingCheckout",
      "provider_approved",
      "installMasterclassMetaPixel",
      "localStorage",
      "sessionStorage",
      "fetch(",
      "trpc.",
    ]) {
      expect(mobileBar).not.toContain(forbiddenBehavior);
    }
  });

  it("replaces the legacy sticky CTA with one page-level mount outside content, appends only the approved clearance rule, and leaves legacy interactions no-op", () => {
    expect(page).toContain('import WeightLossMenopauseV2DoctorBio from "./WeightLossMenopauseV2DoctorBio";\nimport WeightLossMenopauseV2MobileBar from "./WeightLossMenopauseV2MobileBar";');
    expect(page).toContain("      </div>\n      <WeightLossMenopauseV2MobileBar />\n    </div>");
    expect(page.match(/<WeightLossMenopauseV2MobileBar \/>/g)).toHaveLength(1);
    expect(page).not.toContain(legacyStickyCta);
    expect(page).not.toContain('<div className="sticky-cta"');

    const contentStart = page.indexOf('<div className="wlm-v2-content" ref={contentRef}>');
    const mountIndex = page.indexOf("<WeightLossMenopauseV2MobileBar />");
    const contentClose = page.lastIndexOf("      </div>", mountIndex);
    const pageClose = page.indexOf("    </div>", mountIndex);
    expect(contentStart).toBeGreaterThan(-1);
    expect(contentClose).toBeGreaterThan(contentStart);
    expect(mountIndex).toBeGreaterThan(contentClose);
    expect(pageClose).toBeGreaterThan(mountIndex);
    expect(page.slice(contentStart, contentClose)).not.toContain("<WeightLossMenopauseV2MobileBar />");

    expect(css).toContain(mobileBarMarker);
    expect(css.match(/\/\* Approved V2 three-option mobile bar: content clearance only\. \*\//g)).toHaveLength(1);
    expect(css.slice(css.indexOf(mobileBarMarker))).toBe(approvedMobileBarCss);

    expect(interaction).toContain('const sticky = root.querySelector<HTMLElement>(".sticky-cta");');
    expect(interaction).toContain("if (disposed || !sticky || !stickyStart || !stickyStop) return;");
    expect(restoreOriginalNames(interaction)).toBe(originalInteraction);
  });
});
