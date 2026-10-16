import { describe, expect, it } from "vitest";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { Script } from "node:vm";

const root = resolve(import.meta.dirname, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const landing = read("client/weight-loss-intake.html");
const intake = read("client/intake/index.html");
const intakeThankYou = read("client/intake/thank-you/index.html");
const server = read("server/_core/index.ts");
const crawler = read("server/crawlerMiddleware.ts");
const vite = read("vite.config.ts");
const app = read("client/src/App.tsx");
const treatmentCatalog = JSON.parse(read("shared/treatmentCatalog.json"));

describe("Weight-loss intake static prototype import", () => {
  it("builds and serves the supplied pages at their approved direct routes, not at the homepage", () => {
    expect(vite).toContain('"weight-loss-intake": path.resolve(import.meta.dirname, "client/weight-loss-intake.html")');
    expect(vite).toContain('"intake/index": path.resolve(import.meta.dirname, "client/intake/index.html")');
    expect(vite).toContain('"intake/thank-you/index": path.resolve(import.meta.dirname, "client/intake/thank-you/index.html")');
    expect(server).toContain('app.get(["/weight-loss-intake", "/weight-loss-intake/"],');
    expect(server).toContain('app.get(["/intake", "/intake/"],');
    expect(server).toContain('app.get(["/intake/thank-you", "/intake/thank-you/"],');
    expect(server).toContain("res.sendFile(weightLossIntakeHtml)");
    expect(server).toContain("res.sendFile(intakePrototypeHtml)");
    expect(server).toContain("res.sendFile(intakeThankYouHtml)");
    expect(server).not.toContain('app.get(["/", "/weight-loss-intake"');
    expect(app).toContain('<Route path="/weight-loss-intake" component={WeightLossIntakeStandaloneRedirect} />');
    expect(app).toContain('<Route path="/intake/" component={IntakeStandaloneRedirect} />');
    expect(app).toContain('<Route path="/intake/thank-you" component={IntakeThankYouStandaloneRedirect} />');
  });

  it("preserves the supplied landing and intake documents while moving all landing Start Your Visit CTAs to intake", () => {
    expect(landing).toContain("Your weight-loss");
    expect(landing).toContain('class="phone-stage"');
    expect(landing).toContain('class="sticky-cta"');
    expect(landing).toContain('href="/weight-loss-intake/ui-polish.css"');
    expect(landing).toContain('src="/weight-loss-intake/ui-polish.js"');
    expect((landing.match(/href="\/intake\/"/g) ?? []).length).toBe(5);
    expect(intake).toContain('id="root"');
    expect(intake).toContain('href="/intake/ui-polish.css"');
    expect(intake).toContain('src="/intake/ui-polish.js"');
    expect(intake).toContain("var __mmdSession");
  });

  it("uses one shared GLP-1 catalog for landing, intake choice cards and intake review cards", () => {
    const browserCatalog = read("client/public/treatment-catalog.js");
    const generator = read("scripts/generate-treatment-catalog.mjs");
    expect(generator).toContain("shared/treatmentCatalog.json");
    expect(browserCatalog).toContain("MMD_TREATMENT_CATALOG");
    expect(landing).toContain('src="/treatment-catalog.js"');
    expect(landing).toContain('data-shared-glp1-catalog');
    expect(intake).toContain('src="/treatment-catalog.js"');
    expect(intake).toContain("window.MMD_TREATMENT_CATALOG.glp1.options.map");
    expect(landing).not.toContain("Zepbound Vial");
    expect(landing).not.toContain("$70");
    expect(intake).not.toContain("f={options:[{value:`compounded_semaglutide`");

    const expected = [
      ["Compounded Semaglutide", "$129", "1-month supply"],
      ["Compounded Tirzepatide", "$149", "1-month supply"],
      ["Compounded Liraglutide", "$115", "1-month supply"],
      ["Wegovy® – Direct from NovoCare®", "$349/month", undefined],
      ["Wegovy Pill® – Direct from NovoCare®", "$199/month", undefined],
      ["Zepbound® KwikPen – Direct from LillyDirect®", "$299/month", undefined],
      ["Foundayo® Pill – Direct from LillyDirect®", "$149/month", undefined],
    ];
    expect(treatmentCatalog.glp1.options.map((option: { name: string; price: string; supply?: string }) => [option.name, option.price, option.supply])).toEqual(expected);
    expect(treatmentCatalog.glp1.notSure).toEqual({ value: "not_sure", name: "I'm not sure", helper: "I would like a recommendation" });
  });

  it("keeps both documents self-contained, noindex, and outside the existing site stylesheet", () => {
    for (const page of [landing, intake]) {
      expect(page).toContain('name="robots" content="noindex,follow"');
      expect(page).not.toContain("data:image/");
    }
    expect(landing).toContain('href="https://medmethoddirect.com/weight-loss-intake"');
    expect(intake).toContain('href="https://medmethoddirect.com/intake/"');
    expect(crawler).toContain('path === "/weight-loss-intake" || path === "/weight-loss-intake/"');
    expect(crawler).toContain('path === "/intake" || path === "/intake/"');
    expect(read("client/src/index.css")).not.toContain("Weight-Loss Intake Static Prototype");
  });

  it("preserves supplied media while keeping payment credentials and patient delivery off the browser", () => {
    expect(statSync(resolve(root, "client/weight-loss-intake.html")).size).toBeLessThan(120_000);
    expect(statSync(resolve(root, "client/intake/index.html")).size).toBeLessThan(400_000);
    expect(landing).toContain("/manus-storage/wli-");
    expect(intake).toContain("/manus-storage/wli-");
    expect(landing).not.toContain("/api/trpc");
    expect(intake).not.toContain("/api/trpc");
    expect(intake).not.toContain("/api/webhooks");
    expect(intake).not.toContain("www.paypal.com/sdk");
    expect(intake).not.toContain("api-m.paypal.com");
    expect(intake).toContain("/api/paypal/client-token");
    expect(intake).toContain("/api/paypal/orders");
    expect(intake).toContain("approval_token");
    expect(intake).not.toContain("KERAGON_WEBHOOK_URL");
    expect(server).not.toContain('"/api/weight-loss-intake"');
    expect(server).not.toContain('"/api/intake"');
  });

  it("keeps all four supplied polish files and the updated standalone route manifest", () => {
    expect(read("client/public/weight-loss-intake/ui-polish.css")).toContain("Technical polish");
    expect(read("client/public/weight-loss-intake/ui-polish.js")).toContain("UI-only navigation and tab accessibility");
    expect(read("client/public/intake/ui-polish.css")).toContain("Readability and touch targets");
    expect(read("client/public/intake/ui-polish.js")).toContain("UI-only enhancement");
    const routes = JSON.parse(read("client/public/weight-loss-intake/manus-routes.json"));
    expect(routes.routes).toEqual([
      { path: "/weight-loss-intake", title: "MMD Weight Loss" },
      { path: "/intake/", title: "MMD Intake Form" },
      { path: "/intake/thank-you/", title: "Intake Complete" },
    ]);
  });

  it("shows the supplied LegitScript verification seal only in the weight-loss landing footer", () => {
    const seal = "https://static.legitscript.com/seals/51795425.png";
    const checker = "https://www.legitscript.com/websites/?checker_keywords=medmethoddirect.com";

    expect(landing).toContain(checker);
    expect(landing).toContain(seal);
    expect(landing).toContain('class="footer-legitscript-seal"');
    expect(landing).toContain('title="Verify LegitScript Approval for www.medmethoddirect.com"');
    expect(landing).toContain('alt="Verify Approval for www.medmethoddirect.com"');
    expect(landing).toContain('width="73" height="79"');
    expect(landing).toContain('rel="noopener noreferrer"');
    expect(landing).toContain(".footer-bottom{display:flex;align-items:center;justify-content:space-between");
    expect(intake).not.toContain(seal);
  });

  it("copies the homepage legal-navigation menu into the weight-loss landing footer only", () => {
    const footer = landing.match(/<footer class="wave-top wave-footer">[\s\S]*?<\/footer>/)?.[0] ?? "";
    expect(footer).toContain('class="footer-legal-nav" aria-label="MedMethod Direct legal links"');
    expect(footer).toContain('class="footer-legal-login" href="https://medmethoddirect.md-hq.com/"');
    for (const [label, href] of [
      ["Terms", "/terms"],
      ["Privacy", "/privacy-policy"],
      ["HIPAA Notice", "/hipaa-notice"],
      ["Subscription &amp; Refunds", "/subscription-policy"],
      ["Shipping", "/shipping-policy"],
      ["Accessibility", "/accessibility"],
    ]) expect(footer).toContain(`href="${href}">${label}</a>`);
    expect(landing).toContain(".footer-legal-nav{display:flex;flex-wrap:wrap;align-items:center");
    expect(intake).not.toContain('class="footer-legal-nav"');
  });

  it("keeps final consent choices immediately usable and makes the choices mutually exclusive", () => {
    expect(intake).toContain(
      "case`consent`:return t.wConsent===!0&&t.wDecline!==!0;",
    );
    expect(intake).toContain("),o=!0;let s=e=>{r(t=>({...t,[e]:!t[e]}))}");
    expect(intake).not.toContain("wConsentSectionsRead===!0");
    expect(intake).toContain("n&&t(`wDecline`,!1)");
    expect(intake).toContain("n&&t(`wConsent`,!1)");
    expect(intake).toContain(
      "We're unable to continue your Weight Care intake without your consent to discuss GLP-1 treatment.",
    );
  });

  it("shows the temporary three-step account-onboarding guidance above Start over after a completed intake", () => {
    const confirmationStart = intake.indexOf("confirmation-next-steps");
    const restartStart = intake.indexOf("children:`Start over`");

    expect(confirmationStart).toBeGreaterThan(-1);
    expect(restartStart).toBeGreaterThan(confirmationStart);
    expect(intake).toContain("What happens next");
    expect(intake).toContain("Check your email");
    expect(intake).toContain("for our welcome message and Patient Portal link.");
    expect(intake).toContain("Create your account");
    expect(intake).toContain("Set your username and password, then log in to the patient portal.");
    expect(intake).toContain("Forms & Questionnaires");
    expect(intake).toContain("Sign and complete the remaining required forms.");
    expect(intake).toContain("confirmation-next-step-number");
  });

  it("uses a separate noindex thank-you URL after a completed intake payment without putting patient data in the URL", () => {
    expect(intake).toContain("window.location.replace(`/intake/thank-you/${y?`?prefill=demo`:``}`)");
    expect(intake).toContain("if(n===`success`){__mmdSession.removeItem(i),window.location.replace(`/intake/thank-you/`);return}");
    expect(intake).not.toContain("thank-you/?submission");
    expect(intakeThankYou).toContain('name="robots" content="noindex,follow"');
    expect(intakeThankYou).toContain('href="https://medmethoddirect.com/intake/thank-you"');
    expect(intakeThankYou).toContain("You're in");
    expect(intakeThankYou).toContain("What happens next");
    expect(intakeThankYou).toContain("Check your text messages");
    expect(intakeThankYou).toContain("Please reply to our message so we can stay connected!");
    expect(intakeThankYou).toContain("Check your email &amp; create your account");
    expect(intakeThankYou).toContain("Look for our welcome email with your Patient Portal link.");
    expect(intakeThankYou).toContain("Complete your required forms");
    expect(intakeThankYou).toContain("Review, sign, and submit all required forms.");
    expect(intakeThankYou).toContain("/manus-storage/patient-portal-forms-questionnaires-v2_eb7ffe2e.webp");
    expect(intakeThankYou).toContain('alt="Patient Portal menu with Forms and Questionnaires highlighted"');
    expect(intakeThankYou).toContain("Once completed, Dr. Al-Deek will review your information and get in touch with you for the next steps.");
    expect(intakeThankYou).toContain('href="tel:+18883627011"');
    expect(intakeThankYou).toContain('href="/intake/"');
    expect(intakeThankYou).not.toContain("/api/paypal/");
    expect(intakeThankYou).not.toContain("KERAGON_WEBHOOK_URL");
    expect(crawler).toContain('path === "/intake/thank-you" || path === "/intake/thank-you/"');
  });

  it("renders Apple Pay only when eligible, with an explicit native black button in both checkout themes", () => {
    const applePayLoader = intake.slice(
      intake.indexOf("function MmdLoadApplePaySdk()"),
      intake.indexOf("function MmdApplePayCheckout"),
    );

    expect(applePayLoader).toContain("window.customElements&&window.customElements.get(`apple-pay-button`)");
    expect(applePayLoader).not.toContain("if(window.ApplePaySession){resolve(!0);return}");
    expect(intake).toContain("methods.isEligible(`applepay`)");
    expect(intake).toContain("!available?null");
    expect(intake).toContain("buttonstyle:`black`");
    expect(intake).toContain("background:#000");
    expect(intake).toContain("-webkit-appearance:-apple-pay-button");
    expect(intake).toContain("-apple-pay-button-type:buy");
    expect(intake).toContain("-apple-pay-button-style:black");
    expect(intake).toContain("--apple-pay-button-height:52px");
    expect(intake).toContain("--apple-pay-button-width:100%");
    expect(intake).toContain("--apple-pay-button-border-radius:999px");
    expect(intake).toContain("@media (prefers-color-scheme:dark){.apple-pay-option");
  });

  it("keeps the imported static intake JavaScript syntactically valid after secure-payment wiring", () => {
    const inlineScript = intake.match(/<script>([\s\S]*?)<\/script>/)?.[1];
    expect(inlineScript).toBeTruthy();
    expect(() => new Script(inlineScript!)).not.toThrow();
  });
});
