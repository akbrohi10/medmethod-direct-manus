import { describe, expect, it } from "vitest";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { Script } from "node:vm";

const root = resolve(import.meta.dirname, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const landing = read("client/weight-loss-intake.html");
const intake = read("client/intake/index.html");
const server = read("server/_core/index.ts");
const crawler = read("server/crawlerMiddleware.ts");
const vite = read("vite.config.ts");
const app = read("client/src/App.tsx");
const treatmentCatalog = JSON.parse(read("shared/treatmentCatalog.json"));

describe("Weight-loss intake static prototype import", () => {
  it("builds and serves the supplied pages at their approved direct routes, not at the homepage", () => {
    expect(vite).toContain('"weight-loss-intake": path.resolve(import.meta.dirname, "client/weight-loss-intake.html")');
    expect(vite).toContain('"intake/index": path.resolve(import.meta.dirname, "client/intake/index.html")');
    expect(server).toContain('app.get(["/weight-loss-intake", "/weight-loss-intake/"],');
    expect(server).toContain('app.get(["/intake", "/intake/"],');
    expect(server).toContain("res.sendFile(weightLossIntakeHtml)");
    expect(server).toContain("res.sendFile(intakePrototypeHtml)");
    expect(server).not.toContain('app.get(["/", "/weight-loss-intake"');
    expect(app).toContain('<Route path="/weight-loss-intake" component={WeightLossIntakeStandaloneRedirect} />');
    expect(app).toContain('<Route path="/intake/" component={IntakeStandaloneRedirect} />');
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
    ]);
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
    expect(intake).toContain("by setting your username and password, then log in.");
    expect(intake).toContain("Forms & Questionnaires");
    expect(intake).toContain("Sign and complete the remaining required forms.");
    expect(intake).toContain("confirmation-next-step-number");
  });

  it("keeps the imported static intake JavaScript syntactically valid after secure-payment wiring", () => {
    const inlineScript = intake.match(/<script>([\s\S]*?)<\/script>/)?.[1];
    expect(inlineScript).toBeTruthy();
    expect(() => new Script(inlineScript!)).not.toThrow();
  });
});
