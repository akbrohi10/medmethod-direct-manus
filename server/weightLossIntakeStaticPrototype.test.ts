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

  it("preserves the landing and intake documents while keeping all landing CTAs pointed at intake", () => {
    expect(landing).toContain("Text your");
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

  it("places How it works directly after Featured In while retaining medication options and the estimator", () => {
    const sectionTags = Array.from(landing.matchAll(/<section\b[^>]*>/g), match => match[0]);
    expect(sectionTags.slice(0, 5)).toEqual([
      '<section class="hero">',
      '<section class="featured-in" aria-labelledby="featured-in-title">',
      '<section class="section wave-top wave-soft" id="how-it-works">',
      '<section class="medication-pricing" aria-labelledby="medication-pricing-title">',
      '<section class="estimator-band" aria-label="Weight-loss estimate">',
    ]);
    expect(sectionTags.filter(tag => tag.includes('id="how-it-works"'))).toHaveLength(1);
  });

  it("keeps a straight edge below Featured In without disabling other section curves", () => {
    expect(landing).toContain('#how-it-works.wave-top::before{display:none}');
    expect(landing).toContain('.wave-top::before{content:"";position:absolute');
    expect(landing).toContain('border-radius:58% 42% 0 0 / 100% 100% 0 0');
    expect(landing).not.toMatch(/(?:^|[\s}])\.wave-top::before\{display:none\}/);
    expect(intake).not.toContain('#how-it-works.wave-top::before{display:none}');
  });

  it("uses the approved free text-doctor model only on the landing page without changing the separate intake checkout", () => {
    expect(landing).toContain("Text your");
    expect(landing).toContain("weight-loss doctor");
    expect(landing).toContain("for FREE.");
    expect(landing).toContain("Connect with a licensed doctor focused on medical weight loss.");
    expect(landing).toContain("Complete your intake. Then text your doctor.");
    expect(landing).toContain("Start My Free Doctor Visit");
    expect(landing).toContain("Medication costs extra.");
    expect(landing).toContain("Your first doctor conversation is free.");
    expect(landing).toContain("Patient perspectives");
    expect(landing).not.toContain("$49/month");
    expect(landing).not.toContain("$49 today");
    expect(landing).not.toContain("100% refunded");
    expect(landing).not.toContain("FREE BONUS");
    expect(landing).not.toContain("Membership pricing");
    expect(landing).not.toContain("Member perspectives");
    expect(intake).toContain("Pay $49.00 securely");
  });

  it("removes only the hero brand-label line and centers the remaining hero text", () => {
    expect(landing).not.toContain('<span class="hero-eyebrow">MMD Weight Loss</span>');
    expect(landing).toContain('.hero .hero-copy>h1,.hero .hero-copy>p{text-align:center;margin-inline:auto}');
    expect(landing).toContain('<span class="hero-headline-main">Text your</span>');
    expect(landing).toContain('<span class="hero-headline-middle">weight-loss doctor</span>');
    expect(landing).toContain('<span class="hero-headline-last">for FREE.</span>');
    expect(landing).toContain('<a class="wordmark" href="#top">MMD <span>Weight Loss</span></a>');
    expect(landing).toContain('<div class="care-brand">MMD <span>Weight Loss</span></div>');
  });

  it("uses brand-led medical weight-loss copy without naming a physician or generalizing individual credentials", () => {
    const active = landing.replace(/<section[^>]*data-archived-physician-testimonials>[\s\S]*?<\/section>/, "");
    expect(active).toContain("Discuss your GLP-1 options, health history, and long-term goals.");
    expect(active).toContain("A real doctor. Care built around you.");
    expect(active).toContain("<h3>Connect with your doctor by text</h3><p>Your welcome text arrives instantly. Ask questions through HIPAA-compliant messaging.</p>");
    expect(active).toContain("<h3>Discuss your options</h3>");
    expect(active).toContain("Clinical decisions remain with your treating physician.");
    expect(active).not.toMatch(/Al-Deek|Jumana|50,000|Certified Personal Trainer|The Menopause Weight Loss Trap|same doctor, every time|always within 24/);
    expect(active).not.toContain("board-certified");
  });

  it("replaces personal portraits with neutral doctor icons and explains treating-physician transparency", () => {
    expect(landing).toContain('class="chat-avatar doctor-icon"');
    expect(landing).toContain('class="care-doctor-icon"');
    expect(landing).toContain('class="care-connection"');
    expect(landing).toContain("your treating physician’s name and credentials are shared when care begins.");
    expect(landing).not.toContain("wli-bfde38427412ca12_83dcac15.jpg");
    expect(landing).not.toContain("wli-3f0ba6b015e68ccd_f0119801.jpg");
    expect(landing).toContain('<span class="bubble-label">Your doctor</span>');
    expect(landing).toContain("Hi Sarah, your doctor here.");
    expect(landing).toContain('data-chat-at="3300"');
    expect(landing).toContain('data-live-chat');
  });

  it("temporarily hides original named testimonials rather than rewriting or fabricating brand reviews", () => {
    const archived = landing.match(/<section[^>]*id="testimonials" hidden data-archived-physician-testimonials>[\s\S]*?<\/section>/)?.[0] ?? "";
    expect(archived).not.toBe("");
    expect(archived.match(/<blockquote>/g)).toHaveLength(6);
    expect(archived).toContain("Dr. Al-Deek is incredibly easy to chat with.");
    expect(archived).toContain("Having the same doctor throughout my care is a big reason I continue working with Dr. Al-Deek.");
    expect(landing).toContain("[data-archived-physician-testimonials]{display:none!important}");
    expect(intake).not.toContain("care-connection");
    expect(intakeThankYou).toContain("Once completed, Dr. Al-Deek will review your information");
  });

  it("applies the approved brand-guideline palette only to the weight-loss landing hero", () => {
    expect(landing).toContain("/* MMD brand-guideline palette — hero only. */");
    expect(landing).toContain("Montserrat:wght@400;500;600;700;800;900");
    expect(landing).toContain("--hero-navy:#061A46");
    expect(landing).toContain("--hero-teal:#008A96");
    expect(landing).toContain("--hero-ivory:#FFFCF5");
    expect(landing).toContain("--hero-lavender:#E9ECF8");
    expect(landing).toContain("--hero-white:#FFFFFF");
    expect(landing).toContain(".hero .hero-actions .btn{background:var(--hero-teal)");
    expect(landing).toContain(".hero .phone{background:var(--hero-navy)");
    expect(landing).toContain(".hero h1,.hero h1 em,.hero .hero-headline-main,.hero .hero-headline-middle{color:var(--hero-navy);background:none;font-weight:900");
    expect(intake).not.toContain("--hero-teal:#008A96");
  });

  it("extends the approved brand system through the remaining landing sections without touching intake", () => {
    expect(landing).toContain("/* Approved MMD brand system — standalone landing page only. */");
    expect(landing).toContain('name="theme-color" content="#FFFCF5"');
    expect(landing).toContain("--bg:#FFFCF5");
    expect(landing).toContain("--surface:#FFFFFF");
    expect(landing).toContain("--soft:#E9ECF8");
    expect(landing).toContain("--navy:#061A46");
    expect(landing).toContain("--teal:#008A96");
    expect(landing).toContain(".price-card.featured{background:var(--soft)}");
    expect(landing).toContain("footer{background:var(--navy)}");
    expect(landing).toContain(".wave-footer{--wave-color:var(--navy)}");
    expect(landing).toContain(".app-feature-list li:before{color:var(--soft)}");
    expect(landing).toContain(".sticky-cta .btn{min-height:60px;min-width:0;flex:1;flex-direction:column;gap:3px;padding:10px 12px;border-radius:14px;background:var(--teal)");
    expect(read("client/public/weight-loss-intake/ui-polish.css")).toContain(".site-header .btn, .privacy-band .btn { background: var(--teal); }");
    expect(intake).not.toContain("/* Approved MMD brand system — standalone landing page only. */");
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
      ["Wegovy Pill® – Direct from NovoCare®", "$149/month", undefined],
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

  it("uses the supplied full-frame app social preview only for the weight-loss intake link", () => {
    const image = "https://medmethoddirect.com/manus-storage/weight-loss-intake-social-app-preview_7c150823.jpeg";
    expect(landing).toContain('<link rel="canonical" href="https://medmethoddirect.com/weight-loss-intake" />');
    expect(landing).toContain(`<meta property="og:image" content="${image}" />`);
    expect(landing).toContain('<meta property="og:image:width" content="1734" />');
    expect(landing).toContain('<meta property="og:image:height" content="907" />');
    expect(landing).toContain('<meta property="og:image:alt" content="MMD Weight Loss: Your weight-loss doctor, one text away" />');
    expect(landing).toContain(`<meta name="twitter:image" content="${image}" />`);
    expect(landing).toContain('<meta name="twitter:card" content="summary_large_image" />');
    expect(intake).not.toContain("weight-loss-intake-social-app-preview_7c150823.jpeg");
    expect(intakeThankYou).not.toContain("weight-loss-intake-social-app-preview_7c150823.jpeg");
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
    expect(footer).toContain('class="footer-phone" href="tel:+18883627011"');
    expect(footer).toContain('Call us: <span>+1 888-362-7011</span>');
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
    expect(landing).toContain(".footer-phone{display:inline-flex;align-items:center;justify-content:center;min-height:44px");
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
    expect(intakeThankYou).toContain("Complete your Account Details &amp; Required Forms");
    expect(intakeThankYou).toContain("On the right-side menu, click My Account Details to complete your information then click Forms &amp; Questionnaires to review, sign, and submit all required forms.");
    expect(intakeThankYou).toContain("/manus-storage/PatientPortalMenuHighlights_5e7b0fd0.png");
    expect(intakeThankYou).toContain('alt="Patient Portal menu with My Account Details and Forms and Questionnaires highlighted"');
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

  it("adds the server-validated family coupon above payment fields and hides every payment method only after it is applied", () => {
    expect(intake).toContain("Coupon code");
    expect(intake).toContain("Have a coupon code? Apply it before entering payment details.");
    expect(intake).toContain("/api/intake/coupon/validate");
    expect(intake).toContain("/api/intake/coupon/submit");
    expect(intake).toContain("Family discount applied — $49 waived");
    expect(intake).toContain("Submit intake for clinical review");
    expect(intake).toContain("payment_status!==`WAIVED`");
    expect(intake).toContain("!o&&(0,M.jsxs)(M.Fragment");
    expect(intake).not.toContain("MMD_INTAKE_FAMILY_COUPON_CODE");
    expect(intake).not.toContain("coupon_code:`family`");
  });

  it("keeps the imported static intake JavaScript syntactically valid after secure-payment wiring", () => {
    const inlineScript = intake.match(/<script>([\s\S]*?)<\/script>/)?.[1];
    expect(inlineScript).toBeTruthy();
    expect(() => new Script(inlineScript!)).not.toThrow();
  });
});
