import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";
import {
  INTAKE_SMS_OPT_IN_TEXT,
  VIDEO_VISIT_AMOUNT,
  finalizeVideoVisitPaid,
  validateIntakeDraft,
} from "./intakeSubmissionContract";

type Spec = { label: string; value: string };
type TreatmentOption = {
  value: string;
  name: string;
  price: string;
  supply?: string;
  frequency?: string;
  form?: string;
  note?: string;
  images: { intake?: string | null };
  imageAlt?: string;
};
type IntakeDisplay = {
  name: string;
  price: string;
  supply?: string;
  specs: Spec[];
};
type TreatmentCatalog = {
  glp1: {
    notSure: { value: string; name: string; helper: string };
    options: TreatmentOption[];
    pageDisplays: { weightLossIntake: Record<string, IntakeDisplay> };
  };
  hrt: { options: Array<{ name: string; price: string; supply?: string }> };
};
type IntakeTreatmentOption = TreatmentOption & {
  image: string | null | undefined;
  note: string | null;
  productInformation: null;
  pricingNote: string | null;
  specs: Spec[];
};

const root = resolve(import.meta.dirname, "..");
const intakeSource = readFileSync(resolve(root, "client/intake/index.html"), "utf8");
const catalog = JSON.parse(readFileSync(resolve(root, "shared/treatmentCatalog.json"), "utf8")) as TreatmentCatalog;

const approvedIntakeDisplays = [
  {
    value: "compounded_semaglutide",
    name: "Compounded Semaglutide",
    price: "$129/month — fixed price",
    supply: null,
    specs: [
      { label: "Vial size", value: "2.5–12.5 mg vial" },
      { label: "Form", value: "Injection (multidose vial)" },
    ],
    pricingNote: null,
  },
  {
    value: "compounded_tirzepatide",
    name: "Compounded Tirzepatide",
    price: "$149 to $299/month",
    supply: null,
    specs: [
      { label: "Vial size", value: "10–60 mg vial" },
      { label: "Form", value: "Injection (multidose vial)" },
    ],
    pricingNote: "Price varies by dose.",
  },
  {
    value: "compounded_liraglutide",
    name: "Compounded Liraglutide",
    price: "$115",
    supply: "28-day supply",
    specs: [
      { label: "Strength", value: "6mg/mL" },
      { label: "Form", value: "Injection (multidose vial)" },
    ],
    pricingNote: null,
  },
  {
    value: "wegovy_direct_novocare",
    name: "Wegovy® Pen — Direct from NovoCare®",
    price: "$349/month — fixed price",
    supply: "Four single-dose, prefilled pens",
    specs: [{ label: "Dose per Pen", value: "0.25–2.4 mg" }],
    pricingNote: null,
  },
  {
    value: "wegovy_pill_direct_novocare",
    name: "Wegovy® Pill — Direct from NovoCare®",
    price: "$149 to $299/month",
    supply: null,
    specs: [{ label: "Strength", value: "1.5–25 mg" }],
    pricingNote: "Price varies by dose.",
  },
  {
    value: "zepbound_kwikpen_direct_lillydirect",
    name: "Zepbound® KwikPen — Direct from LillyDirect®",
    price: "$299 to $449/month",
    supply: "Four prefilled pens",
    specs: [{ label: "Dose per Pen", value: "2.5–15 mg" }],
    pricingNote: "Price varies by dose.",
  },
  {
    value: "foundayo_pill_direct_lillydirect",
    name: "Foundayo® Pill — Direct from LillyDirect®",
    price: "$149 to $299/month",
    supply: null,
    specs: [{ label: "Strength", value: "0.8–17.2 mg" }],
    pricingNote: "Price varies by dose.",
  },
] as const;

function extractNamedFunction(source: string, name: string, from = 0): string {
  const match = new RegExp(`function\\s+${name}\\s*\\([^)]*\\)\\s*\\{`).exec(source.slice(from));
  if (!match || match.index === undefined) throw new Error(`Could not find function ${name} in the local intake source.`);

  const functionStart = from + match.index;
  const bodyStart = source.indexOf("{", functionStart);
  let depth = 0;
  let quote: "'" | '"' | "`" | null = null;

  for (let index = bodyStart; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (character === "\\") index += 1;
      else if (character === quote) quote = null;
      continue;
    }
    if (character === "'" || character === '"' || character === "`") {
      quote = character;
      continue;
    }
    if (character === "{") depth += 1;
    if (character === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(functionStart, index + 1);
    }
  }
  throw new Error(`Could not extract the complete ${name} function body.`);
}

function intakeTreatmentOptionFactory() {
  const functionSource = extractNamedFunction(intakeSource, "MmdIntakeTreatmentOption");
  return runInNewContext(
    `"use strict"; ${functionSource}; MmdIntakeTreatmentOption;`,
    { window: { MMD_TREATMENT_CATALOG: catalog } },
  ) as (option: TreatmentOption) => IntakeTreatmentOption;
}

function intakeSummaryFormatter(options: IntakeTreatmentOption[]) {
  const optionsAnchor = intakeSource.indexOf("p=f.options");
  expect(optionsAnchor, "the local intake must keep p=f.options for treatment lookup").toBeGreaterThan(-1);
  const functionSource = extractNamedFunction(intakeSource, "g", optionsAnchor);
  return runInNewContext(
    `"use strict"; ${functionSource}; g;`,
    { p: options, m: catalog.glp1.notSure },
  ) as (selectedId: string) => string;
}

function syntheticDraft(selected: string) {
  return {
    event: "mmd_intake.submitted",
    schema_version: "1.0",
    submission_id: "873ef4af-190d-45cb-9d51-42c627f5376a",
    submitted_at: "2026-10-21T19:00:00.000Z",
    is_test: false,
    route: "weight_care",
    patient: {
      first_name: "Pricing",
      last_name: "TEST ONLY",
      dob: "1985-01-15",
      state: "GA",
      state_name: "Georgia",
      email: "pricing-test@example.com",
      phone: "(202) 555-0101",
      sex: "female",
      address_line1: "SYNTHETIC 123 Example Street",
      address_line2: "",
      city: "Atlanta",
      zip: "30301",
    },
    answers: { w: { w04: selected, treatment_interest: "Unapproved client display text" } },
    consents: {
      terms_accepted: true,
      final_submission_acknowledged: true,
      sms_opt_in: false,
      sms_opt_in_at: null,
      sms_opt_in_text: INTAKE_SMS_OPT_IN_TEXT,
      contact_preference: "phone_portal",
      glp1_consent: true,
      glp1_declined: false,
      glp1_consent_at: "2026-10-21T19:00:00.000Z",
      glp1_consent_version: "2026-10",
    },
    meta: { source: "mmd-intake-web", form_version: "1.2.0" },
    checkout_preview: { payment_processed: false, card_fields_omitted: true },
    intake_summary: "SYNTHETIC TEST ONLY — no patient and no charge.",
    intake_summary_html: "<b>SYNTHETIC TEST ONLY — no patient and no charge.</b>",
  };
}

describe("local intake medication pricing", () => {
  it("maps every local intake medication to the approved display data without mutating the shared catalog", () => {
    const catalogBefore = JSON.parse(JSON.stringify(catalog)) as TreatmentCatalog;
    const mapTreatment = intakeTreatmentOptionFactory();
    const catalogOptionsAnchor = intakeSource.indexOf("window.MMD_TREATMENT_CATALOG.glp1.options");

    expect(catalogOptionsAnchor).toBeGreaterThan(-1);
    expect(intakeSource.slice(catalogOptionsAnchor, catalogOptionsAnchor + 500)).toContain("MmdIntakeTreatmentOption");

    for (const expected of approvedIntakeDisplays) {
      const canonical = catalog.glp1.options.find(option => option.value === expected.value);
      expect(canonical, `canonical ${expected.value} option`).toBeDefined();
      const displayed = mapTreatment(canonical!);

      expect(displayed).toMatchObject({
        value: expected.value,
        name: expected.name,
        price: expected.price,
        image: canonical!.images.intake,
        imageAlt: canonical!.imageAlt,
        frequency: canonical!.frequency,
        note: expected.supply,
        productInformation: null,
        pricingNote: expected.pricingNote,
      });
      expect(displayed.specs).toEqual(expected.specs);
    }

    expect(catalog).toEqual(catalogBefore);
  });

  it("adds the exact dose-range note only to the four approved variable-price local intake medications", () => {
    const mapTreatment = intakeTreatmentOptionFactory();
    const pricingNotes = catalog.glp1.options.map(option => ({
      value: option.value,
      pricingNote: mapTreatment(option).pricingNote,
    }));

    expect(pricingNotes).toEqual(approvedIntakeDisplays.map(({ value, pricingNote }) => ({ value, pricingNote })));
    expect(pricingNotes.filter(item => item.pricingNote !== null)).toEqual([
      { value: "compounded_tirzepatide", pricingNote: "Price varies by dose." },
      { value: "wegovy_pill_direct_novocare", pricingNote: "Price varies by dose." },
      { value: "zepbound_kwikpen_direct_lillydirect", pricingNote: "Price varies by dose." },
      { value: "foundayo_pill_direct_lillydirect", pricingNote: "Price varies by dose." },
    ]);
  });

  it("formats the intake treatment summary with price, pricing note, supply, and specification values", () => {
    const mapTreatment = intakeTreatmentOptionFactory();
    const options = catalog.glp1.options.map(mapTreatment);
    const summary = intakeSummaryFormatter(options);

    for (const expected of approvedIntakeDisplays) {
      expect(summary(expected.value)).toBe([
        expected.name,
        expected.price,
        expected.pricingNote,
        expected.supply,
        ...expected.specs.map(spec => spec.value),
      ].filter(Boolean).join(" — "));
    }
    expect(summary(catalog.glp1.notSure.value)).toBe("Not sure - wants recommendation");
  });

  it("keeps canonical GLP-1 details and the HRT catalog separate from local intake displays", () => {
    expect(catalog.glp1.options.map(({ name, price, supply }) => [name, price, supply])).toEqual([
      ["Compounded Semaglutide", "$129", "1-month supply"],
      ["Compounded Tirzepatide", "$149", "1-month supply"],
      ["Compounded Liraglutide", "$115", "1-month supply"],
      ["Wegovy® – Direct from NovoCare®", "$349/month", undefined],
      ["Wegovy Pill® – Direct from NovoCare®", "$149/month", undefined],
      ["Zepbound® KwikPen – Direct from LillyDirect®", "$299/month", undefined],
      ["Foundayo® Pill – Direct from LillyDirect®", "$149/month", undefined],
    ]);
    expect(catalog.hrt.options.map(({ name, price, supply }) => [name, price, supply])).toEqual([
      ["Estradiol Tablets", "$29", "1-month supply"],
      ["Estradiol Patch", "$99", "1-month supply"],
      ["Micronized Progesterone Pill", "$69", "3-month supply"],
      ["Vaginal Estrogen Cream", "$79", "2-month supply"],
      ["PT-141 Injection", "$179", "1-month supply"],
      ["Vaginal Estrogen Cream + PT-141", "$258", "1-month supply"],
      ["Estriol Face Cream", "$119", "1-month supply"],
      ["Eye Cream", "$89", "1-month supply"],
      ["GHK-Cu + Biopeptides Cream", "$109", "1-month supply"],
      ["Advanced Cell Repair Serum", "$119", "1-month supply"],
      ["Emerald Cream", "$99", "1-month supply"],
      ["Low-Dose Minoxidil Pill", "$84", "3-month supply"],
    ]);
  });

  it("normalizes every submitted local selection to its intake display name while preserving the draft schema and $97 video charge", () => {
    for (const expected of approvedIntakeDisplays) {
      const draft = validateIntakeDraft(syntheticDraft(expected.value));
      expect(draft.answers.w.treatment_interest).toBe(expected.name);
      expect(Object.keys(draft).sort()).toEqual([
        "answers",
        "checkout_preview",
        "consents",
        "event",
        "intake_summary",
        "intake_summary_html",
        "is_test",
        "meta",
        "patient",
        "route",
        "schema_version",
        "submission_id",
        "submitted_at",
      ]);
    }

    const paid = finalizeVideoVisitPaid(
      { submission_id: "873ef4af-190d-45cb-9d51-42c627f5376a", submitted_at: "2026-10-21T19:00:00.000Z", is_test: false, sms_opt_in: false, video_visit_interest: true },
      "373ef4af-190d-45cb-9d51-42c627f5376b",
      { provider: "paypal", environment: "sandbox", status: "COMPLETED", order_id: "TEST-ORDER", capture_id: "TEST-CAPTURE", amount: VIDEO_VISIT_AMOUNT, currency: "USD", captured_at: "2026-10-21T19:01:00.000Z" },
    );
    expect(VIDEO_VISIT_AMOUNT).toBe("97.00");
    expect(paid.service.amount).toBe("97.00");
    expect(paid.payment.amount).toBe("97.00");
  });
});
