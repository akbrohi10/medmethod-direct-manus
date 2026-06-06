/*
 * YourMedication.tsx
 * Design: Horizontal scroll carousel showcasing all 6 MedMethod Direct medications.
 * Each card: product image, medication name, form type, key details, In Stock badge, program link.
 * Snap-scroll on mobile, arrow navigation on desktop.
 * Light background (#FAFAFA) for contrast against surrounding dark sections.
 */

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check, ArrowRight, Pill } from "lucide-react";

/* ── CDN URLs ─────────────────────────────────────────────────────────── */
const SEMAGLUTIDE_VIAL =
  "/manus-storage/semaglutideb12v2_89b7b383_056326d3.png";
const TIRZEPATIDE_VIAL =
  "/manus-storage/tirzepatidev2_7c07c418_77c3ca8c.png";
const ORAL_SEMAGLUTIDE =
  "/manus-storage/oralsemaglutidev2_ed023e6c_4de2326d.png";
const ORAL_TIRZEPATIDE =
  "/manus-storage/oraltirze_5b190778_2119af90.png";
const ESTRADIOL_PATCH =
  "/manus-storage/patchv2_0f258fe0_49523870.png";
const PROGESTERONE_CAPSULES =
  "/manus-storage/progesterone_0ae7daa8_3479ebfe.png";
const TESTOSTERONE_CREAM =
  "/manus-storage/testocreammetered_397b8bc6_10ecf81c.png";
const FOUR_HORMONE_CREAM =
  "/manus-storage/4hormone_c3653d96_2c9f906e.png";
const BI_EST_CREAM =
  "/manus-storage/biest_179b52e8_ddeae887.png";
const VAGINAL_ESTROGEN_CREAM =
  "/manus-storage/vaginalestrogen_f54954dd_0f636a37.png";
const DHEA_CAPSULES =
  "/manus-storage/dheacapsules_ee755e86_f8355c90.png";
const TESTOSTERONE_LOW_DOSE =
  "/manus-storage/testocream_20960034_d29c8388.png";
const ZEPBOUND_PEN =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/CEVzfjoRpvjPssOc.webp";
const ZEPBOUND_LOGO =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/nzQKifmLIHhUmqKx.png";
const WEGOVY_PEN =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/xULqFLzJRzLBIKIs.png";
const WEGOVY_LOGO =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/RsueKshBHQxlBMUU.png";
const WEGOVY_PILL =
  "/manus-storage/Wegovypill_06012b53_af214ad9.jpeg";
const FOUNDAYO_BOTTLE =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/mZQtjRShlxknoDgQ.png";
const FOUNDAYO_LOGO =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/vuFGUEgaqyBIXccG.png";
const MINOXIDIL_5 =
  "/manus-storage/minoxidil-5_b8936bc5_ab4f0ac3.png";
const ORAL_MINOXIDIL =
  "/manus-storage/oral-minoxidil-new_04bbc7e7_7869e08b.png";
const SPIRONOLACTONE =
  "/manus-storage/spironolactone_48650ef8_9b8e2b53.png";
const FINASTERIDE =
  "/manus-storage/finasteride_91ef4261_7800773e.png";
const DUTASTERIDE =
  "/manus-storage/dutasteride_5c68aad7_a146599d.png";
const TOPICAL_FINASTERIDE =
  "/manus-storage/topical-finasteride_0a06ba59_f7179194.png";
const MINOXIDIL_FINASTERIDE_COMBO =
  "/manus-storage/minoxidil-finasteride-combo_009cb028_90774d76.png";
const KETOCONAZOLE =
  "/manus-storage/ketoconazole_f2b74b1f_d9a0703f.png";
const CICLOPIROX =
  "/manus-storage/ciclopirox_ba847a79_562f2291.png";
const SELENIUM_SULFIDE =
  "/manus-storage/selenium_4ca6403c_a46a3c6e.png";
const TRETINOIN =
  "/manus-storage/tretinoin_v2_52825a15_90644220.png";
const TAZAROTENE =
  "/manus-storage/tazarotene_v2_fcf3cca9_95e7dfa1.png";
const ADAPALENE =
  "/manus-storage/adapalene_v4_61099e38_fe1ec1c3.png";
const HYDROQUINONE =
  "/manus-storage/hydroquinone_0120a995_d1e513fd.png";
const TRANEXAMIC_ACID =
  "/manus-storage/tranexamicacid_a087e180_2e3dfcef.png";
const AZELAIC_ACID =
  "/manus-storage/azelaicacid_v2_bf448066_9d294e99.png";
const CLINDAMYCIN =
  "/manus-storage/clindamycin_b0f4b92b_c6b63a7d.png";
const DAPSONE =
  "/manus-storage/dapsone_v3_09a2b776_045657a9.png";
const BENZOYL_PEROXIDE =
  "/manus-storage/benzoylperoxide_2ff178bd_8dcfd18b.png";
const GLYCOLIC_ACID =
  "/manus-storage/glycolicacid_7fb074be_59b067d0.png";
const SALICYLIC_ACID =
  "/manus-storage/salicylicacid_a956be0b_d728e8e6.png";
const TRIPLE_CREAM =
  "/manus-storage/triplecream_8955ce3e_5b73a959.png";
const LATISSE =
  "/manus-storage/latisse_8202dd46_05b22cf1.png";
const BIMATOPROST =
  "/manus-storage/bimatoprost_4b6063ef_f2eea21f.png";

/* ── Medication Data ──────────────────────────────────────────────────── */
interface Med {
  name: string;
  form: string;
  image: string;
  program: string;
  accent: string;
  badge: string;
  details: string[];
  isBrandName?: boolean;
  elevated?: boolean;
  price?: string;
  priceNote?: string;
  logo?: string;
  bgImage?: string;
  bgImageCutout?: string;
  bgSize?: string;
  /* When 'contain', the bgImage is rendered as a real <img> inside the well so it can have padding above/below and animate on hover. Defaults to 'cover' for backwards compatibility with the brand-name cards. */
  bgFit?: "cover" | "contain";
  detailSubtitles?: string[];
  /* Brand-name comparison: shown above price as a struck-through brand price + Save % pill */
  savings?: { brandName: string; brandPrice: string; savePct: number };
  /* Italic callout for compounded-only meds with no brand-name equivalent */
  compoundedOnlyNote?: string;
  /* Muted trust chip (e.g. "USP Pharmaceutical-Grade") for cards without a savings story */
  trustSignal?: string;
  /* Use the v2 redesigned savings layout (corner badge + dominant compounded price). Prototype only — will roll out to all BHRT cards once approved. */
  savingsV2?: boolean;
  /* Filter category — drives the segmented pill filter above the carousel. */
  category?: "weight-loss" | "hormones" | "adrenal-vitality" | "hair-care" | "skin-care";
  /* Dual availability badges (e.g. Brand Name + Compounded) shown in place of price */
  availabilityBadges?: string[];
  /* When true, hides the price from the card bottom panel */
  hidePrice?: boolean;
  /* Label shown in place of "Compounded · Rx" when price is hidden */
  availabilityLabel?: string;
}

/* ── Filter Categories ─────────────────────────────────────────────────
   Drives the segmented pill filter above the carousel. Order = display order.
*/
type FilterValue = "all" | "weight-loss" | "hormones" | "adrenal-vitality" | "hair-care" | "skin-care";
const FILTER_PILLS: { value: FilterValue; label: string; deepLink: string }[] = [
  { value: "all",              label: "All Medications", deepLink: ""                  },
  { value: "weight-loss",      label: "Weight Loss",     deepLink: "weight-loss"      },
  { value: "hormones",         label: "Hormones",        deepLink: "hormones"         },
  { value: "adrenal-vitality", label: "Adrenal & Vitality", deepLink: "adrenal-vitality" },
  { value: "hair-care",         label: "Hair Care",          deepLink: "hair-care"         },
  { value: "skin-care",         label: "Skin Care",          deepLink: "skin-care"         },
];

const medications: Med[] = [
  /* ── Brand-Name Cards (front of carousel) ── */
  {
    name: "Wegovy",
    category: "weight-loss",
    form: "Semaglutide Injection · Novo Nordisk",
    image: "/manus-storage/wegovy_182c2026_a4847894.jpeg",
    bgImage: "/manus-storage/wegovy_182c2026_a4847894.jpeg",
    program: "NovoCare / Telehealth",
    accent: "#E8339E",
    badge: "Brand Name",
    isBrandName: true,
    price: "$199–$399/mo",
    priceNote: "Price increases as dose increases",
    details: [
      "FDA-approved GLP-1 receptor agonist",
      "Pre-filled single-dose pen",
      "Once-weekly injection",
    ],
  },
  {
    name: "Wegovy Pill",
    category: "weight-loss",
    form: "Oral Semaglutide · Novo Nordisk",
    image: WEGOVY_PILL,
    bgImage: WEGOVY_PILL,
    program: "NovoCare / Telehealth",
    accent: "#E8339E",
    badge: "Brand Name",
    isBrandName: true,
    price: "$149–$299/mo",
    priceNote: "Price increases as dose increases",
    details: [
      "FDA-approved oral GLP-1",
      "Daily tablet — no injections",
      "Take on empty stomach with water",
    ],
  },
  {
    name: "Zepbound",
    category: "weight-loss",
    form: "Tirzepatide Injection · Eli Lilly",
    image: "/manus-storage/zepbound_4bda9ad3_7b01e991.jpeg",
    bgImage: "/manus-storage/zepbound_4bda9ad3_7b01e991.jpeg",
    program: "LillyDirect",
    accent: "#E8339E",
    badge: "Brand Name",
    isBrandName: true,
    price: "$299–$449/mo",
    priceNote: "Price increases as dose increases",
    details: [
      "FDA-approved dual GIP/GLP-1 agonist",
      "Pre-filled single-use pen",
      "Dose escalation: 2.5mg → 15mg",
    ],
  },
  {
    name: "Foundayo",
    category: "weight-loss",
    form: "Orforglipron Tablet · Eli Lilly",
    image: "/manus-storage/Foundayo_569ed15f_2f7d1bed.jpeg",
    bgImage: "/manus-storage/Foundayo_569ed15f_2f7d1bed.jpeg",
    program: "LillyDirect",
    accent: "#E8339E",
    badge: "Brand Name",
    isBrandName: true,
    price: "$149–$299/mo",
    priceNote: "Price increases as dose increases",
    details: [
      "First non-peptide oral GLP-1",
      "Daily pill — no food/water restrictions",
      "Once-daily dosing",
    ],
  },
  /* ── Compounded Cards ── */
  {
    name: "Semaglutide + B12",
    category: "weight-loss",
    form: "Injectable Vial",
    image: SEMAGLUTIDE_VIAL,
    bgImage: SEMAGLUTIDE_VIAL,
    program: "SlimMethod",
    accent: "#E8339E",
    badge: "In Stock",
    price: "$179–$249/mo",
    priceNote: "Price increases as dose increases",
    details: [
      "Compounded GLP-1 receptor agonist",
      "Vitamin B12 for energy support",
      "2mL multi-dose vial",
    ],
  },
  {
    name: "Oral Semaglutide",
    category: "weight-loss",
    form: "Oral Capsule",
    image: ORAL_SEMAGLUTIDE,
    bgImage: ORAL_SEMAGLUTIDE,
    program: "SlimMethod",
    accent: "#E8339E",
    badge: "In Stock",
    price: "$149–$249/mo",
    priceNote: "Price increases as dose increases",
    details: [
      "Compounded GLP-1 oral form",
      "No injections required",
      "Daily oral dosing",
    ],
  },
  {
    name: "Tirzepatide + Niacinamide",
    category: "weight-loss",
    form: "Injectable Vial",
    image: TIRZEPATIDE_VIAL,
    bgImage: TIRZEPATIDE_VIAL,
    program: "AccelerateMethod",
    accent: "#E8339E",
    badge: "In Stock",
    price: "$199–$349/mo",
    priceNote: "Price increases as dose increases",
    details: [
      "Dual GIP/GLP-1 receptor agonist",
      "Niacinamide for metabolic support",
      "2mL multi-dose vial",
    ],
  },
  {
    name: "Oral Tirzepatide + Niacinamide",
    category: "weight-loss",
    form: "Oral Capsule",
    image: ORAL_TIRZEPATIDE,
    bgImage: ORAL_TIRZEPATIDE,
    program: "AccelerateMethod",
    accent: "#E8339E",
    badge: "In Stock",
    price: "$199–$299/mo",
    priceNote: "Price increases as dose increases",
    details: [
      "Dual GIP/GLP-1 oral form",
      "Niacinamide for metabolic support",
      "No injections required",
    ],
  },
  {
    name: "Estradiol Patch",
    category: "hormones",
    form: "Transdermal Patch",
    image: ESTRADIOL_PATCH,
    bgImage: ESTRADIOL_PATCH,
    program: "HormoneMethod",
    accent: "#D4628A",
    badge: "In Stock",
    price: "$99/mo",
    savings: { brandName: "Climara / Vivelle-Dot", brandPrice: "$293", savePct: 66 },
    savingsV2: true,
    details: [
      "Bioidentical estradiol",
      "Applied twice weekly",
      "Menopause & perimenopause relief",
    ],
  },
  {
    name: "Progesterone Capsules",
    category: "hormones",
    form: "Oral Capsule",
    image: PROGESTERONE_CAPSULES,
    bgImage: PROGESTERONE_CAPSULES,
    program: "HormoneMethod",
    accent: "#C44D7B",
    badge: "In Stock",
    price: "$49/mo",
    savings: { brandName: "Prometrium", brandPrice: "$497", savePct: 90 },
    savingsV2: true,
    details: [
      "Compounded 100mg capsules",
      "Taken orally at bedtime",
      "Hormonal balance support",
    ],
  },
  {
    name: "Testosterone Cream",
    category: "hormones",
    form: "Metered-Dose Stick",
    image: TESTOSTERONE_CREAM,
    bgImage: TESTOSTERONE_CREAM,
    program: "HormoneMethod",
    accent: "#B8336A",
    badge: "In Stock",
    price: "$69/mo",
    compoundedOnlyNote: "Compounded only — no FDA-approved option for women",
    savingsV2: true,
    details: [
      "Compounded for women",
      "Metered dose precision",
      "Energy, libido & mood support",
    ],
  },
  {
    name: "Four-Hormone Cream",
    category: "hormones",
    form: "Airless Pump · 30g",
    image: FOUR_HORMONE_CREAM,
    bgImage: FOUR_HORMONE_CREAM,
    program: "HormoneMethod",
    accent: "#A02864",
    badge: "Flagship",
    price: "$89/mo",
    compoundedOnlyNote: "Compounded only — no brand equivalent",
    savingsV2: true,
    details: [
      "Estradiol • Estriol • Progesterone • Testosterone",
      "30g full-spectrum compounded cream",
      "Four hormones in one daily application",
    ],
  },
  {
    name: "Bi-Est Cream",
    category: "hormones",
    form: "Metered-Dose Stick",
    image: BI_EST_CREAM,
    bgImage: BI_EST_CREAM,
    program: "HormoneMethod",
    accent: "#B8336A",
    badge: "In Stock",
    price: "$69/mo",
    savings: { brandName: "Estrace", brandPrice: "$115", savePct: 40 },
    savingsV2: true,
    details: [
      "Estriol & Estradiol blend",
      "30g compounded topical cream",
      "Targeted estrogen support",
    ],
  },
  {
    name: "Vaginal Estrogen Cream",
    category: "hormones",
    form: "Tube + Applicator",
    image: VAGINAL_ESTROGEN_CREAM,
    bgImage: VAGINAL_ESTROGEN_CREAM,
    program: "HormoneMethod",
    accent: "#C44D7B",
    badge: "In Stock",
    price: "$59/mo",
    savings: { brandName: "Premarin / Estrace", brandPrice: "$593", savePct: 90 },
    savingsV2: true,
    details: [
      "Estriol 0.5mg/g compounded cream",
      "30g tube with calibrated applicator",
      "Vaginal & GSM symptom relief",
    ],
  },
  {
    name: "Testosterone Cream — Low-Dose",
    category: "hormones",
    form: "Airless Pump · Starter",
    image: TESTOSTERONE_LOW_DOSE,
    bgImage: TESTOSTERONE_LOW_DOSE,
    program: "HormoneMethod",
    accent: "#B8336A",
    badge: "Starter",
    price: "$49/mo",
    compoundedOnlyNote: "Compounded only — no FDA-approved option for women",
    savingsV2: true,
    details: [
      "0.5% strength · gentle entry dose",
      "15g compounded starter pack",
      "Ideal for new patients & low-dose protocols",
    ],
  },
  {
    name: "DHEA Capsules",
    category: "adrenal-vitality",
    form: "Oral Capsule",
    image: DHEA_CAPSULES,
    bgImage: DHEA_CAPSULES,
    // Wide 16:10 PNG — fill the well edge-to-edge with cover; no blur/cutout treatment needed.
    program: "HormoneMethod",
    accent: "#C44D7B",
    badge: "In Stock",
    price: "$29/mo",
    trustSignal: "USP Pharmaceutical-Grade",
    savingsV2: true,
    details: [
      "25mg compounded capsules",
      "30-count bottle · once daily",
      "Adrenal support & hormone precursor",
    ],
  },
  {
    name: "Minoxidil 5%",
    category: "hair-care",
    form: "Rx Foam / Solution",
    image: MINOXIDIL_5,
    bgImage: MINOXIDIL_5,
    program: "HairCare",
    accent: "#C44D7B",
    badge: "In Stock",
    trustSignal: "FDA-Approved Active",
    savingsV2: true,
    hidePrice: true,
    availabilityLabel: "Brand Name or Compounded \u00B7 Rx",
    details: [
      "Reactivates dormant follicles & stimulates new growth",
      "Foam or topical solution \u2014 your choice",
      "Brand name or compounded available",
    ],
  },
  {
    name: "Oral Minoxidil",
    category: "hair-care",
    form: "Prescription Tablet",
    image: ORAL_MINOXIDIL,
    bgImage: ORAL_MINOXIDIL,
    program: "HairCare",
    accent: "#C44D7B",
    badge: "In Stock",
    price: "From $29/mo",
    trustSignal: "FDA-Approved Active",
    savingsV2: true,
    details: [
      "Low-dose systemic support for thicker, fuller hair",
      "Once-daily tablet · no messy topical application",
      "Brand name or compounded available",
    ],
  },
  {
    name: "Spironolactone",
    category: "hair-care",
    form: "Prescription Tablet",
    image: SPIRONOLACTONE,
    bgImage: SPIRONOLACTONE,
    program: "HairCare",
    accent: "#C44D7B",
    badge: "In Stock",
    price: "From $25/mo",
    trustSignal: "Anti-Androgen Therapy",
    savingsV2: true,
    details: [
      "Blocks androgen-driven hair thinning at the root",
      "Reduces scalp DHT to slow shedding & support regrowth",
      "Brand name or compounded available",
    ],
  },
  {
    name: "Finasteride",
    category: "hair-care",
    form: "Rx Only",
    image: FINASTERIDE,
    bgImage: FINASTERIDE,
    program: "HairCare",
    accent: "#C44D7B",
    badge: "In Stock",
    price: "From $30/mo",
    trustSignal: "DHT Pathway Support",
    savingsV2: true,
    details: [
      "Inhibits 5-alpha reductase to reduce DHT-driven hair loss",
      "Clinically proven to slow thinning & promote regrowth",
      "Brand name or compounded available",
    ],
  },
  {
    name: "Dutasteride",
    category: "hair-care",
    form: "Rx Only",
    image: DUTASTERIDE,
    bgImage: DUTASTERIDE,
    program: "HairCare",
    accent: "#C44D7B",
    badge: "In Stock",
    price: "From $35/mo",
    trustSignal: "Advanced DHT Control",
    savingsV2: true,
    details: [
      "Dual 5-alpha reductase inhibitor for stronger DHT suppression",
      "Ideal for patients who need more aggressive hair-loss intervention",
      "Brand name or compounded available",
    ],
  },
  {
    name: "Topical Finasteride",
    category: "hair-care",
    form: "Rx Only",
    image: TOPICAL_FINASTERIDE,
    bgImage: TOPICAL_FINASTERIDE,
    program: "HairCare",
    accent: "#C44D7B",
    badge: "In Stock",
    price: "From $40/mo",
    trustSignal: "DHT Pathway Support",
    savingsV2: true,
    details: [
      "Targets DHT directly at the scalp with minimal systemic absorption",
      "Ideal for patients who prefer topical over oral therapy",
      "Brand name or compounded available",
    ],
  },
  {
    name: "Minoxidil + Finasteride",
    category: "hair-care",
    form: "Rx Only",
    image: MINOXIDIL_FINASTERIDE_COMBO,
    bgImage: MINOXIDIL_FINASTERIDE_COMBO,
    program: "HairCare",
    accent: "#C44D7B",
    badge: "In Stock",
    price: "From $55/mo",
    trustSignal: "Multi-Pathway Hair Support",
    savingsV2: true,
    details: [
      "Combines growth stimulation + DHT blocking in one topical formula",
      "Optional ketoconazole for anti-inflammatory scalp support",
      "Brand name or compounded available",
    ],
  },
  {
    name: "Ketoconazole 2%",
    category: "hair-care",
    form: "Nizoral Rx",
    image: KETOCONAZOLE,
    bgImage: KETOCONAZOLE,
    program: "HairCare",
    accent: "#C44D7B",
    badge: "In Stock",
    price: "From $20/mo",
    trustSignal: "Scalp Support Therapy",
    savingsV2: true,
    details: [
      "Anti-fungal shampoo that reduces scalp inflammation & DHT locally",
      "Supports a healthy follicle environment for stronger regrowth",
      "Brand name or compounded available",
    ],
  },
  {
    name: "Ciclopirox 1% Shampoo",
    category: "hair-care",
    form: "Loprox\u00AE",
    image: CICLOPIROX,
    bgImage: CICLOPIROX,
    program: "HairCare",
    accent: "#C44D7B",
    badge: "In Stock",
    price: "From $20/mo",
    trustSignal: "Sensitive Scalp Therapy",
    savingsV2: true,
    details: [
      "Prescription-strength antifungal that calms scalp irritation & flaking",
      "Gentle enough for sensitive scalps while supporting hair retention",
      "Brand name or compounded available",
    ],
  },
  {
    name: "Selenium Sulfide 2.5%",
    category: "hair-care",
    form: "Rx Strength",
    image: SELENIUM_SULFIDE,
    bgImage: SELENIUM_SULFIDE,
    program: "HairCare",
    accent: "#C44D7B",
    badge: "In Stock",
    price: "From $15/mo",
    trustSignal: "Prescription Shampoo",
    savingsV2: true,
    details: [
      "Controls seborrheic dermatitis & dandruff that can worsen hair thinning",
      "Reduces scalp yeast overgrowth to create a healthier growth environment",
      "Brand name or compounded available",
    ],
  },
  {
    name: "Tretinoin (Retin-A)",
    category: "skin-care",
    form: "Topical Retinoid",
    image: TRETINOIN,
    bgImage: TRETINOIN,
    program: "SkinCare",
    accent: "#C44D7B",
    badge: "In Stock",
    price: "From $30/mo",
    trustSignal: "Rx Retinoid",
    savingsV2: true,
    details: [
      "Gold-standard retinoid that accelerates cell turnover for smoother skin",
      "Reduces fine lines, hyperpigmentation & acne with consistent use",
      "Brand name or compounded available",
    ],
  },
  {
    name: "Tazarotene (Tazorac)",
    category: "skin-care",
    form: "Topical Retinoid",
    image: TAZAROTENE,
    bgImage: TAZAROTENE,
    program: "SkinCare",
    accent: "#C44D7B",
    badge: "In Stock",
    price: "From $35/mo",
    trustSignal: "Stronger Retinoid",
    savingsV2: true,
    details: [
      "Next-generation retinoid for stubborn acne & psoriasis",
      "Stronger anti-aging effects with faster visible results",
      "Brand name or compounded available",
    ],
  },
  {
    name: "Adapalene",
    category: "skin-care",
    form: "Topical Retinoid",
    image: ADAPALENE,
    bgImage: ADAPALENE,
    program: "SkinCare",
    accent: "#C44D7B",
    badge: "In Stock",
    price: "From $25/mo",
    trustSignal: "Acne + Anti-Aging",
    savingsV2: true,
    details: [
      "Gentle retinoid ideal for acne-prone skin with mild anti-aging benefits",
      "Well-tolerated first-line option with less irritation than stronger retinoids",
      "Brand name or compounded available",
    ],
  },
  {
    name: "Hydroquinone",
    category: "skin-care",
    form: "Topical Brightening Cream",
    image: HYDROQUINONE,
    bgImage: HYDROQUINONE,
    program: "SkinCare",
    accent: "#C44D7B",
    badge: "In Stock",
    price: "From $30/mo",
    trustSignal: "Melasma Treatment",
    savingsV2: true,
    details: [
      "Gold-standard depigmenting agent for melasma & dark spots",
      "Evens skin tone by inhibiting melanin production at the source",
      "Brand name or compounded available",
    ],
  },
  {
    name: "Tranexamic Acid",
    category: "skin-care",
    form: "Advanced Bright Serum",
    image: TRANEXAMIC_ACID,
    bgImage: TRANEXAMIC_ACID,
    program: "SkinCare",
    accent: "#C44D7B",
    badge: "In Stock",
    price: "From $35/mo",
    trustSignal: "Brightening Serum",
    savingsV2: true,
    details: [
      "Targets stubborn pigmentation & melasma without the irritation of hydroquinone",
      "Safe for long-term use to maintain even, luminous skin tone",
      "Brand name or compounded available",
    ],
  },
  {
    name: "Azelaic Acid",
    category: "skin-care",
    form: "Topical Cream",
    image: AZELAIC_ACID,
    bgImage: AZELAIC_ACID,
    program: "SkinCare",
    accent: "#C44D7B",
    badge: "In Stock",
    price: "From $25/mo",
    trustSignal: "Rosacea & Acne",
    savingsV2: true,
    details: [
      "Treats rosacea, acne & post-inflammatory hyperpigmentation in one formula",
      "Anti-bacterial & anti-inflammatory with gentle brightening effects",
      "Brand name or compounded available",
    ],
  },
  {
    name: "Clindamycin",
    category: "skin-care",
    form: "Topical Antibiotic Gel",
    image: CLINDAMYCIN,
    bgImage: CLINDAMYCIN,
    program: "SkinCare",
    accent: "#C44D7B",
    badge: "In Stock",
    price: "From $20/mo",
    trustSignal: "Acne Treatment",
    savingsV2: true,
    details: [
      "Kills acne-causing bacteria directly at the skin surface",
      "Often paired with retinoids for faster, more complete clearing",
      "Brand name or compounded available",
    ],
  },
  {
    name: "Dapsone (Aczone)",
    category: "skin-care",
    form: "Anti-inflammatory Acne Treatment",
    image: DAPSONE,
    bgImage: DAPSONE,
    program: "SkinCare",
    accent: "#C44D7B",
    badge: "In Stock",
    price: "From $30/mo",
    trustSignal: "Anti-inflammatory",
    savingsV2: true,
    details: [
      "Reduces inflammatory acne without drying or irritating the skin",
      "Especially effective for adult women with hormonal breakouts",
      "Brand name or compounded available",
    ],
  },
  {
    name: "Benzoyl Peroxide",
    category: "skin-care",
    form: "Topical Acne Treatment Gel",
    image: BENZOYL_PEROXIDE,
    bgImage: BENZOYL_PEROXIDE,
    program: "SkinCare",
    accent: "#C44D7B",
    badge: "In Stock",
    price: "From $20/mo",
    trustSignal: "Antibacterial",
    savingsV2: true,
    details: [
      "Kills acne-causing bacteria on contact & unclogs pores",
      "Available in multiple Rx concentrations for mild to severe breakouts",
      "Brand name or compounded available",
    ],
  },
  {
    name: "Glycolic Acid",
    category: "skin-care",
    form: "Exfoliating Serum",
    image: GLYCOLIC_ACID,
    bgImage: GLYCOLIC_ACID,
    program: "SkinCare",
    accent: "#C44D7B",
    badge: "In Stock",
    price: "From $30/mo",
    trustSignal: "Chemical Exfoliant",
    savingsV2: true,
    details: [
      "Dissolves dead skin cells to improve tone, texture & radiance",
      "Rx-strength formula that accelerates cell turnover for smoother skin",
      "Brand name or compounded available",
    ],
  },
  {
    name: "Salicylic Acid",
    category: "skin-care",
    form: "Clarifying Serum",
    image: SALICYLIC_ACID,
    bgImage: SALICYLIC_ACID,
    program: "SkinCare",
    accent: "#C44D7B",
    badge: "In Stock",
    price: "From $25/mo",
    trustSignal: "Pore-Clearing BHA",
    savingsV2: true,
    details: [
      "Penetrates deep into pores to dissolve oil, debris & blackheads",
      "Ideal for oily and acne-prone skin — reduces breakouts & inflammation",
      "Brand name or compounded available",
    ],
  },
  {
    name: "Triple Cream",
    category: "skin-care",
    form: "Compounded Hyperpigmentation Treatment",
    image: TRIPLE_CREAM,
    bgImage: TRIPLE_CREAM,
    program: "SkinCare",
    accent: "#C44D7B",
    badge: "In Stock",
    price: "From $45/mo",
    trustSignal: "Multi-Agent Formula",
    savingsV2: true,
    details: [
      "Combines hydroquinone, tretinoin & a mild steroid to fade dark spots fast",
      "Gold-standard compounded formula for melasma & post-inflammatory hyperpigmentation",
      "Brand name or compounded available",
    ],
  },
  {
    name: "Latisse (Bimatoprost)",
    category: "skin-care",
    form: "Eyelash Growth Treatment",
    image: LATISSE,
    bgImage: LATISSE,
    program: "SkinCare",
    accent: "#C44D7B",
    badge: "In Stock",
    price: "From $50/mo",
    trustSignal: "FDA-Approved",
    savingsV2: true,
    details: [
      "Clinically proven to grow longer, thicker & darker eyelashes in 8–16 weeks",
      "Once-daily prescription solution applied to the upper lash line",
      "Brand name or compounded available",
    ],
  },
  {
    name: "Bimatoprost 0.03%",
    category: "skin-care",
    form: "Lash Enhancement Solution",
    image: BIMATOPROST,
    bgImage: BIMATOPROST,
    program: "SkinCare",
    accent: "#C44D7B",
    badge: "In Stock",
    price: "From $35/mo",
    trustSignal: "Prostaglandin Analog",
    savingsV2: true,
    details: [
      "Generic alternative to Latisse — same active ingredient at a lower cost",
      "Extends the lash growth cycle for visibly fuller, longer lashes",
      "Brand name or compounded available",
    ],
  },
];

/* ── Component ────────────────────────────────────────────────────────── */
/** Read the initial filter from the URL (?cat=weight-loss / hormones / adrenal-vitality). */
function readInitialFilter(): FilterValue {
  if (typeof window === "undefined") return "all";
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = (params.get("cat") || "").toLowerCase();
    const found = FILTER_PILLS.find((p) => p.deepLink === raw);
    return found ? found.value : "all";
  } catch {
    return "all";
  }
}

export default function YourMedication({ onConsultClick }: { onConsultClick?: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [filter, setFilter] = useState<FilterValue>("all"); // hydrate after mount to avoid SSR mismatch

  // Hydrate the filter from the URL on mount + listen to back/forward navigation.
  useEffect(() => {
    setFilter(readInitialFilter());
    const onPop = () => setFilter(readInitialFilter());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Build the filtered list + per-pill counts.
  const filteredMedications = filter === "all" ? medications : medications.filter((m) => m.category === filter);
  const counts: Record<FilterValue, number> = {
    "all": medications.length,
    "weight-loss": medications.filter((m) => m.category === "weight-loss").length,
    "hormones": medications.filter((m) => m.category === "hormones").length,
    "adrenal-vitality": medications.filter((m) => m.category === "adrenal-vitality").length,
    "hair-care": medications.filter((m) => m.category === "hair-care").length,
    "skin-care": medications.filter((m) => m.category === "skin-care").length,
  };

  const handleFilterClick = (value: FilterValue) => {
    if (value === filter) return;
    setFilter(value);
    setActiveIndex(0);
    // URL sync (no full navigation; preserves scroll).
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const deep = FILTER_PILLS.find((p) => p.value === value)?.deepLink || "";
      if (deep) url.searchParams.set("cat", deep);
      else url.searchParams.delete("cat");
      window.history.replaceState({}, "", url.toString());
    }
    // Reset carousel scroll so the visitor sees the first card of the new category.
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTo({ left: 0, behavior: "smooth" });
    });
  };

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    // Calculate active card index based on scroll position (center-snap)
    const cardWidth = 300; // 280px card + 20px gap
    const idx = Math.round((el.scrollLeft) / cardWidth);
    setActiveIndex(Math.min(Math.max(idx, 0), Math.max(medications.length - 1, 0)));
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  // Re-check scroll edges after a filter change since scrollWidth changes.
  useEffect(() => {
    const id = window.setTimeout(checkScroll, 50);
    return () => window.clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 300;
    el.scrollBy({ left: dir === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
  };

  return (
    <section
      id="medications"
      className="relative pt-10 pb-12 md:pt-14 md:pb-28 overflow-hidden"
      style={{ background: "#FAFAFA" }}
    >
      {/* Subtle top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, #E8339E33, #7A1E7E33, transparent)",
        }}
      />

      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <p
            className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
            style={{ color: "#E8339E" }}
          >
            Your Medication
          </p>
          <h2
            className="text-3xl md:text-4xl font-extrabold mb-4"
            style={{ color: "#111", fontFamily: "'Playfair Display', serif" }}
          >
            Prescribed by Your Doctor.{" "}
            <span style={{ color: "#E8339E" }}>Shipped to Your Door.</span>
          </h2>
          <p
            className="text-base md:text-lg max-w-2xl mx-auto mb-2"
            style={{ color: "#666" }}
          >
            Brand-name or compounded, we prescribe both. Your doctor guides you through the options — so you choose what fits your body and your budget.
          </p>
        </div>

        {/* ── Category Filter Pills ── */}
        <div className="relative mb-4 md:mb-9">
          {/* Right-edge fade affordance — visible only on mobile where pills overflow */}
          <div
            aria-hidden="true"
            className="sm:hidden pointer-events-none absolute top-0 right-0 bottom-0 w-10 z-[2]"
            style={{
              background: "linear-gradient(270deg, #FAFAFA 20%, transparent)",
            }}
          />
          <div
            role="tablist"
            aria-label="Filter medications by category"
            className="grid grid-cols-3 gap-3 px-4 max-w-[600px] mx-auto"
          >
          {FILTER_PILLS.map((pill) => {
            const active = pill.value === filter;
            const count = counts[pill.value];
            return (
              <button
                key={pill.value}
                role="tab"
                aria-selected={active}
                aria-controls="medications-track"
                onClick={() => handleFilterClick(pill.value)}
                className="group flex items-center justify-center gap-1.5 rounded-full border px-3 py-2.5 text-[12.5px] font-semibold transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.97] w-full overflow-hidden"
                style={{
                  background: active
                    ? "linear-gradient(135deg, #E8339E, #7A1E7E)"
                    : "#fff",
                  color: active ? "#fff" : "#1A0D2E",
                  borderColor: active ? "transparent" : "#E5DEEA",
                  boxShadow: active
                    ? "0 6px 18px rgba(232,51,158,0.30), 0 1px 2px rgba(122,30,126,0.20)"
                    : "0 1px 2px rgba(0,0,0,0.04)",
                  cursor: active ? "default" : "pointer",
                }}
              >
                <span className="truncate">{pill.label}</span>
                <span
                  className="inline-flex items-center justify-center rounded-full text-[11px] font-bold tabular-nums transition-colors duration-200"
                  style={{
                    minWidth: 22,
                    height: 20,
                    padding: "0 6px",
                    background: active ? "rgba(255,255,255,0.22)" : "#F4EEF7",
                    color: active ? "#fff" : "#7A1E7E",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full border transition-all duration-200"
            style={{
              background: canScrollLeft ? "#fff" : "#f5f5f5",
              borderColor: canScrollLeft ? "#E8339E44" : "#e0e0e0",
              opacity: canScrollLeft ? 1 : 0.4,
              boxShadow: canScrollLeft ? "0 4px 16px rgba(0,0,0,0.08)" : "none",
              cursor: canScrollLeft ? "pointer" : "default",
            }}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} style={{ color: canScrollLeft ? "#E8339E" : "#aaa" }} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full border transition-all duration-200"
            style={{
              background: canScrollRight ? "#fff" : "#f5f5f5",
              borderColor: canScrollRight ? "#E8339E44" : "#e0e0e0",
              opacity: canScrollRight ? 1 : 0.4,
              boxShadow: canScrollRight ? "0 4px 16px rgba(0,0,0,0.08)" : "none",
              cursor: canScrollRight ? "pointer" : "default",
            }}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight size={20} style={{ color: canScrollRight ? "#E8339E" : "#aaa" }} />
          </button>

          {/* Left fade */}
          {canScrollLeft && (
            <div
              className="absolute left-0 top-0 bottom-0 w-12 z-[5] pointer-events-none"
              style={{
                background: "linear-gradient(90deg, #FAFAFA, transparent)",
              }}
            />
          )}

          {/* Right fade */}
          {canScrollRight && (
            <div
              className="absolute right-0 top-0 bottom-0 w-12 z-[5] pointer-events-none"
              style={{
                background: "linear-gradient(270deg, #FAFAFA, transparent)",
              }}
            />
          )}

          {/* Scrollable Track */}
          <div
            ref={scrollRef}
            id="medications-track"
            role="tabpanel"
            aria-live="polite"
            className="flex items-start md:items-stretch gap-5 overflow-x-auto pb-4 snap-x snap-mandatory pl-4 pr-4 md:pl-0 md:pr-0 transition-opacity duration-200 ease-out"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
            key={filter /* full remount on filter change so cards animate in cleanly */}
          >
            {filteredMedications.map((med, idx) => (
              <MedCard
                key={med.name}
                med={med}
                isActive={idx === activeIndex}
                onConsultClick={onConsultClick}
                animationDelayMs={Math.min(idx, 6) * 40}
              />
            ))}

            {/* End-of-carousel CTA card */}
            <div
              className="flex-shrink-0 snap-center rounded-2xl overflow-hidden flex flex-col items-center justify-center text-center p-8"
              style={{
                width: "clamp(260px, calc(100vw - 48px), 280px)",
                minHeight: "420px",
                background: "linear-gradient(135deg, #0D0D1A, #1A0D2E)",
                border: "1.5px solid rgba(232,51,158,0.2)",
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                style={{ background: "rgba(232,51,158,0.12)" }}
              >
                <Pill size={24} style={{ color: "#E8339E" }} />
              </div>
              <h3
                className="text-lg font-extrabold mb-3"
                style={{ color: "#fff", fontFamily: "'Playfair Display', serif" }}
              >
                Looking for a different medication?
              </h3>
              <p
                className="text-xs leading-relaxed mb-6"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                We have access to a full compounding formulary across weight loss, hormones, and longevity. Your physician will find the right fit for you.
              </p>
              <button
                onClick={() => onConsultClick?.()}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #E8339E, #7A1E7E)",
                  color: "#fff",
                }}
              >
                Schedule a Discovery Call
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Scroll progress indicator (mobile only) */}
          <div className="flex md:hidden justify-center items-center gap-3 mt-4">
            {filteredMedications.length <= 8 ? (
              <div className="flex gap-1.5">
                {filteredMedications.map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      background: i === activeIndex ? "#E8339E" : "#ddd",
                      transform: i === activeIndex ? "scale(1.4)" : "scale(1)",
                    }}
                  />
                ))}
              </div>
            ) : (
              <div
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold tabular-nums"
                style={{
                  background: "#F4EEF7",
                  color: "#7A1E7E",
                  letterSpacing: "0.3px",
                }}
              >
                <span>{Math.min(activeIndex + 1, filteredMedications.length)}</span>
                <span style={{ opacity: 0.5 }}>of</span>
                <span>{filteredMedications.length}</span>
                <span
                  className="ml-1 text-[10px] uppercase tracking-wider"
                  style={{ color: "#7A1E7E", opacity: 0.7 }}
                >
                  · swipe
                </span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Hide scrollbar + filter card fade-in */}
      <style>{`
        #medications [class*="overflow-x-auto"]::-webkit-scrollbar {
          display: none;
        }
        @keyframes medcardFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .medcard-fade-in {
          animation: medcardFadeIn 280ms cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .medcard-fade-in { animation: none; }
        }
      `}</style>
    </section>
  );
}

/* ── Individual Card ──────────────────────────────────────────────────── */
/* Elevated card icons */
const ElevatedCheckIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);
const ElevatedPenIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
);
const ElevatedCalIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);
const ELEVATED_ICONS = [ElevatedCheckIcon, ElevatedPenIcon, ElevatedCalIcon];

function MedCard({
  med,
  isActive = false,
  onConsultClick,
  animationDelayMs = 0,
}: {
  med: Med;
  isActive?: boolean;
  onConsultClick?: () => void;
  animationDelayMs?: number;
}) {
  const [hovered, setHovered] = useState(false);
  const active = hovered || isActive;

  /* ── Elevated (premium) card layout ── */
  if (med.elevated) {
    return (
      <div
        className="medcard-fade-in flex-shrink-0 snap-center rounded-2xl overflow-hidden transition-all duration-300 relative flex flex-col"
        style={{
          width: "clamp(260px, calc(100vw - 48px), 280px)",
          background: "#fff",
          border: `1.5px solid ${med.accent}40`,
          boxShadow: active
            ? `0 16px 48px ${med.accent}25, 0 0 0 2px ${med.accent}30`
            : `0 4px 20px ${med.accent}12, 0 1px 4px rgba(0,0,0,0.04)`,
          transform: isActive ? "scale(1.03)" : "scale(1)",
          transformOrigin: "center top",
          animationDelay: `${animationDelayMs}ms`,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image area with dark background */}
        <div
          className="relative flex items-center justify-center overflow-hidden rounded-t-2xl"
          style={{
            height: "200px",
            background: med.bgImage
              ? `url(${med.bgImage}) center/${med.bgSize || 'cover'} no-repeat`
              : `linear-gradient(160deg, #0D0B1F, #1A0D2E)`,
            backgroundColor: '#0D0B1F',
          }}
        >
          {/* Badge */}
          <span
            className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider z-[2]"
            style={{
              background: "rgba(27,58,75,0.85)",
              backdropFilter: "blur(8px)",
              color: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            {med.badge}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Form type + manufacturer */}
          <p
            className="text-[9px] font-bold uppercase tracking-[0.15em] mb-1"
            style={{ color: med.accent }}
          >
            {med.form}
          </p>

          {/* Name with ® */}
          <h3
            className="text-lg font-extrabold mb-0.5"
            style={{ color: "#111", lineHeight: 1.2 }}
          >
            {med.name}<span style={{ fontSize: "10px", verticalAlign: "super" }}>&reg;</span>
          </h3>

          {/* Program */}
          <p
            className="text-[12px] font-medium mb-3"
            style={{ color: "#666" }}
          >
            Included in {med.program}
          </p>

          {/* Divider */}
          <div className="h-px w-full mb-3" style={{ background: "#f0f0f0" }} />

          {/* Details — elevated with icons + subtitles */}
          <ul className="space-y-3 flex-1">
            {med.details.map((d, i) => {
              const IconComp = ELEVATED_ICONS[i % ELEVATED_ICONS.length];
              return (
                <li key={d} className="flex items-start gap-2.5">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `${med.accent}10` }}
                  >
                    <IconComp color={med.accent} />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold leading-tight" style={{ color: "#222" }}>{d}</span>
                    {med.detailSubtitles?.[i] && (
                      <span className="text-[11px] leading-tight mt-0.5" style={{ color: "#777" }}>
                        {med.detailSubtitles[i]}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Price bar + Start Now button */}
          {med.price && (
            <div
              className="mt-3 -mx-4 px-4 py-3 flex items-center justify-between"
              style={{
                borderTop: `1.5px solid ${med.accent}20`,
                background: `linear-gradient(90deg, ${med.accent}05, ${med.accent}08)`,
              }}
            >
              <div className="min-w-0">
                {med.savings ? (
                  <>
                    {/* Brand-name reference price */}
                    <div className="flex items-baseline gap-1 mb-0.5">
                      <span className="text-[9px] uppercase font-bold tracking-wider" style={{ color: "#999", letterSpacing: "0.06em" }}>
                        Brand name
                      </span>
                      <span className="text-[10px]" style={{ color: "#999", textDecoration: "line-through" }}>
                        {med.savings.brandPrice}/mo
                      </span>
                    </div>
                    {/* Compounded (our) price + Save % pill */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] uppercase font-bold tracking-wider" style={{ color: med.accent, letterSpacing: "0.06em" }}>
                        Compounded
                      </span>
                      <p className="text-sm font-extrabold" style={{ color: "#111" }}>
                        {med.price}
                      </p>
                      <span
                        className="inline-flex items-center rounded-full px-1.5 py-[1px] text-[9px] font-extrabold uppercase tracking-wider"
                        style={{ background: "#E6F9F0", color: "#0D8050", letterSpacing: "0.04em" }}
                      >
                        Save {med.savings.savePct}%
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    {med.compoundedOnlyNote && (
                      <p className="text-[10px] italic mb-1" style={{ color: "#888", lineHeight: 1.3 }}>
                        {med.compoundedOnlyNote}
                      </p>
                    )}
                    {med.trustSignal && !med.compoundedOnlyNote && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-[1px] text-[9px] font-bold uppercase tracking-wider mb-1"
                        style={{ background: `${med.accent}10`, color: med.accent, letterSpacing: "0.04em" }}
                      >
                        {med.trustSignal}
                      </span>
                    )}
                    <p className="text-sm font-extrabold" style={{ color: "#111" }}>
                      {med.price}
                    </p>
                    {med.priceNote && (
                      <p className="text-[12px] mt-0.5" style={{ color: "#555" }}>
                        {med.priceNote}
                      </p>
                    )}
                  </>
                )}
              </div>
              <button
                onClick={() => onConsultClick?.()}
                className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-[11px] font-bold text-white transition-all hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #E8339E, #7A1E7E)",
                  boxShadow: "0 4px 12px rgba(232,51,158,0.40)",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                Start Now
                <ArrowRight size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── Standard card layout ── */
  return (
    <div
      className="medcard-fade-in flex-shrink-0 snap-center rounded-2xl overflow-hidden transition-all duration-300 relative flex flex-col"
      style={{
        width: "clamp(260px, calc(100vw - 48px), 280px)",
        background: "#fff",
        border: active ? `2px solid ${med.accent}66` : "1.5px solid #EBEBEB",
        boxShadow: active
          ? `0 16px 48px ${med.accent}20, 0 4px 12px rgba(0,0,0,0.06)`
          : "0 4px 16px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.03)",
        transform: isActive ? "scale(1.03)" : "scale(1)",
        transformOrigin: "center top",
        animationDelay: `${animationDelayMs}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area */}
      <div
        className="relative flex items-center justify-center overflow-hidden rounded-t-2xl"
        style={{
          height: "220px",
          // bgFit: "contain"  -> dark base color only; bottle rendered as foreground <img> below so it can be padded + hover-lifted.
          // bgFit: "cover"   -> bgImage fills the well as background (legacy treatment for brand-name cards w/ white-bg PNGs).
          background:
            med.bgImage && med.bgFit !== "contain"
              ? `url(${med.bgImage}) center/${med.bgSize || 'cover'} no-repeat`
              : !med.bgImage
                ? `linear-gradient(160deg, ${med.accent}08 0%, ${med.accent}04 40%, ${med.accent}0A 100%)`
                : undefined,
          backgroundColor: med.bgImage ? '#0D0B1F' : undefined,
        }}
      >
        {/* Radial glow behind product (only when no bgImage) */}
        {!med.bgImage && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 60% 50% at 50% 55%, ${med.accent}15, transparent 70%)`,
            }}
          />
        )}

        {/* bgFit: contain — two render paths:
            (A) When bgImageCutout exists (Option 2): the original PNG fills the well corner-to-corner as a seamless backdrop (cover, un-blurred), and a transparent-background cutout of the bottle overlays on top — hover-lifts cleanly with no rectangular seam.
            (B) Fallback: blurred scaled-up source as filler + crisp source as overlay (the previous Option A treatment). */}
        {med.bgImage && med.bgFit === "contain" && (
          med.bgImageCutout ? (
            <>
              <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
                style={{
                  background: `url(${med.bgImage}) center/cover no-repeat`,
                  zIndex: 0,
                }}
              />
              <img
                src={med.bgImageCutout}
                alt={med.name}
                className="object-contain transition-transform duration-300 ease-out relative z-[1]"
                style={{
                  maxHeight: "calc(100% - 24px)",
                  maxWidth: "calc(100% - 24px)",
                  transform: active ? "scale(1.08) translateY(-6px)" : "scale(1)",
                  filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.45))",
                }}
              />
            </>
          ) : (
            <>
              <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
                style={{
                  background: `url(${med.bgImage}) center/cover no-repeat`,
                  transform: "scale(1.6)",
                  filter: "blur(28px) brightness(0.85)",
                  opacity: 0.95,
                  zIndex: 0,
                }}
              />
              <img
                src={med.bgImage}
                alt={med.name}
                className="object-contain transition-transform duration-300 ease-out relative z-[1]"
                style={{
                  maxHeight: "calc(100% - 32px)",
                  maxWidth: "calc(100% - 32px)",
                  transform: active ? "scale(1.06) translateY(-4px)" : "scale(1)",
                  filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.35))",
                }}
              />
            </>
          )
        )}

        {/* Brand logo (top-left) */}
        {med.logo && (
          <img
            src={med.logo}
            alt={`${med.name} logo`}
            className="absolute top-3 left-3 object-contain z-[2]"
            style={{
              height: "28px",
              maxWidth: "100px",
              filter: med.bgImage ? "brightness(0) invert(1)" : "none",
            }}
          />
        )}

        {!med.bgImage && (
          <img
            src={med.image}
            alt={med.name}
            className="object-contain transition-transform duration-300 relative z-[1]"
            style={{
              height: med.isBrandName ? "160px" : "180px",
              width: "auto",
              maxWidth: med.isBrandName ? "160px" : "auto",
              marginTop: med.logo ? "24px" : "0",
              transform: active ? "scale(1.08) translateY(-6px)" : "scale(1)",
              filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.12))",
            }}
          />
        )}

        {/* Badge — frosted glass style */}
        <span
          className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider z-[2]"
          style={{
            background: med.isBrandName
              ? "rgba(27,58,75,0.85)"
              : "rgba(230,249,240,0.9)",
            backdropFilter: "blur(8px)",
            color: med.isBrandName ? "#fff" : "#0D8050",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          {!med.isBrandName && (
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#0D8050" }}
            />
          )}
          {med.badge}
        </span>
      </div>

      {/* Gradient divider */}
      <div
        className="h-[2px] w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${med.accent}40, transparent)`,
        }}
      />

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Form type */}
        <p
          className="text-[11px] font-bold uppercase tracking-[0.15em] mb-1.5"
          style={{ color: med.accent }}
        >
          {med.form}
        </p>

        {/* Name */}
        <h3
          className="text-base font-extrabold mb-1"
          style={{ color: "#111", lineHeight: 1.3 }}
        >
          {med.name}{med.isBrandName && <sup style={{ fontSize: "0.55em", verticalAlign: "super", fontWeight: 700 }}>&reg;</sup>}
        </h3>

        {/* Program */}
        <p
          className="text-[12px] font-medium mb-3"
          style={{ color: "#777" }}
        >
          Included in {med.program}
        </p>

        {/* Details — enhanced checkmarks */}
        <ul className="space-y-2 flex-1">
          {med.details.map((d) => (
            <li
              key={d}
              className="flex items-start gap-2 text-xs"
              style={{ color: "#444" }}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0"
                style={{ background: `${med.accent}12` }}
              >
                <Check
                  size={11}
                  strokeWidth={3}
                  style={{ color: med.accent }}
                />
              </span>
              <span className="leading-[1.4] pt-0.5">{d}</span>
            </li>
          ))}
        </ul>

        {/* Rx disclaimer — styled with shield icon (compounded only) — sits ABOVE price for layout parity */}
        {!med.isBrandName && (
          <div
            className="mt-4 pt-3 flex items-center gap-2"
            style={{ borderTop: "1px solid #f0f0f0" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={med.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <p className="text-[12px] font-medium" style={{ color: "#666" }}>
              Rx Only — prescribed by your MedMethod physician
            </p>
          </div>
        )}

        {/* Price — v2 layout (corner badge + dominant compounded price) */}
        {(med.price || med.hidePrice) && med.savingsV2 && (
          <div
            className="mt-4 -mx-5 px-5 py-4 relative"
            style={{
              background: `linear-gradient(135deg, ${med.accent}08 0%, ${med.accent}14 50%, ${med.accent}08 100%)`,
              borderTop: `1px solid ${med.accent}20`,
              borderBottom: `1px solid ${med.accent}20`,
            }}
          >
            {/* Floating corner badge — SAVE % for savings cards, EXCLUSIVE for compounded-only, USP for DHEA */}
            {med.savings ? (
              <div
                className="absolute -top-2.5 right-4 inline-flex flex-col items-center justify-center rounded-full px-2.5 py-1"
                style={{
                  background: "linear-gradient(135deg, #0FB070, #0D8050)",
                  boxShadow: "0 6px 14px rgba(13, 128, 80, 0.32), 0 0 0 2px #fff",
                  minWidth: "58px",
                }}
              >
                <span className="text-[8px] font-extrabold text-white uppercase tracking-[0.08em] leading-none">Save</span>
                <span className="text-[14px] font-extrabold text-white leading-none mt-0.5">{med.savings.savePct}%</span>
              </div>
            ) : med.compoundedOnlyNote ? (
              <div
                className="absolute -top-2.5 right-4 inline-flex items-center justify-center rounded-full px-3 py-1.5"
                style={{
                  background: `linear-gradient(135deg, ${med.accent}, ${med.accent}DD)`,
                  boxShadow: `0 6px 14px ${med.accent}50, 0 0 0 2px #fff`,
                }}
              >
                <span className="text-[10px] font-extrabold text-white uppercase tracking-[0.08em] leading-none">Exclusive</span>
              </div>
            ) : med.trustSignal ? (
              <div
                className="absolute -top-2.5 right-4 inline-flex items-center justify-center rounded-full px-3 py-1.5"
                style={{
                  background: `linear-gradient(135deg, ${med.accent}, ${med.accent}DD)`,
                  boxShadow: `0 6px 14px ${med.accent}50, 0 0 0 2px #fff`,
                }}
              >
                <span className="text-[10px] font-extrabold text-white uppercase tracking-[0.08em] leading-none">USP Grade</span>
              </div>
            ) : null}

            {/* Reference line above the hero price — either branded price comparison or italic note */}
            {med.savings ? (
              <div className="mb-2" style={{ paddingRight: "68px" }}>
                {/* Brand-name label — small, muted, makes the comparison unambiguous */}
                <p
                  className="text-[9px] font-bold uppercase tracking-[0.12em]"
                  style={{ color: "#999" }}
                >
                  Brand name: {med.savings.brandName}
                </p>
                {/* Struck-through retail price */}
                <p className="text-[12px] mt-0.5">
                  <span
                    style={{ color: "#999", textDecoration: "line-through", textDecorationThickness: "1.5px" }}
                  >
                    {med.savings.brandPrice}/mo
                  </span>
                  <span className="ml-1" style={{ color: "#999" }}>retail</span>
                </p>
              </div>
            ) : med.compoundedOnlyNote ? (
              <p
                className="text-[11px] italic mb-1 truncate"
                style={{ color: "#888", paddingRight: "82px", lineHeight: 1.35 }}
              >
                {med.compoundedOnlyNote}
              </p>
            ) : med.trustSignal ? (
              <p
                className="text-[11px] mb-1 truncate"
                style={{ color: "#888", paddingRight: "82px", lineHeight: 1.35 }}
              >
                {med.trustSignal}
              </p>
            ) : null}

            {/* Compounded price — dominant hero, sans-serif to match GLP-1 cards */}
            {!med.hidePrice && (
              <p className="text-base font-extrabold" style={{ color: "#111" }}>
                {med.price}
              </p>
            )}
            <p
              className="text-[10px] font-bold uppercase tracking-[0.12em] mt-1"
              style={{ color: med.accent }}
            >
              {med.availabilityLabel || "Compounded \u00B7 Rx"}
            </p>
            {!med.hidePrice && med.priceNote && (
              <p className="text-[12px] mt-1" style={{ color: "#666", fontWeight: 500 }}>
                {med.priceNote}
              </p>
            )}
          </div>
        )}

        {/* Original (v1) price block — used for every card except savingsV2 prototype */}
        {med.price && !med.savingsV2 && (
          <div
            className="mt-4 -mx-5 px-5 py-3"
            style={{
              background: `linear-gradient(90deg, ${med.accent}06, ${med.accent}10, ${med.accent}06)`,
              borderTop: `1px solid ${med.accent}15`,
              borderBottom: `1px solid ${med.accent}15`,
            }}
          >
            {/* Savings comparison: explicit Brand name vs Compounded two-line layout */}
            {med.savings ? (
              <>
                {/* Brand-name reference price (struck through) */}
                <div className="flex items-baseline gap-1.5 mb-0.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "#999", letterSpacing: "0.06em" }}>
                    Brand name
                  </span>
                  <span className="text-[11px]" style={{ color: "#999", textDecoration: "line-through" }}>
                    {med.savings.brandPrice}/mo
                  </span>
                  <span className="text-[10px] truncate" style={{ color: "#999" }}>
                    {med.savings.brandName}
                  </span>
                </div>
                {/* Compounded (our) price + Save % pill on the same line */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: med.accent, letterSpacing: "0.06em" }}>
                    Compounded
                  </span>
                  <p className="text-base font-extrabold" style={{ color: "#111" }}>
                    {med.price}
                  </p>
                  <span
                    className="inline-flex items-center rounded-full px-2 py-[2px] text-[10px] font-extrabold uppercase tracking-wider"
                    style={{ background: "#E6F9F0", color: "#0D8050", letterSpacing: "0.04em" }}
                  >
                    Save {med.savings.savePct}%
                  </span>
                </div>
                {med.priceNote && (
                  <p className="text-[12px] mt-0.5" style={{ color: "#555", fontWeight: 500 }}>
                    {med.priceNote}
                  </p>
                )}
              </>
            ) : (
              <>
                {/* Compounded-only callout (no brand equivalent) */}
                {med.compoundedOnlyNote && (
                  <p className="text-[11px] italic mb-1" style={{ color: "#888", lineHeight: 1.35 }}>
                    {med.compoundedOnlyNote}
                  </p>
                )}
                {/* Generic trust signal chip */}
                {med.trustSignal && !med.compoundedOnlyNote && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[10px] font-bold uppercase tracking-wider mb-1"
                    style={{ background: `${med.accent}10`, color: med.accent, letterSpacing: "0.04em" }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    {med.trustSignal}
                  </span>
                )}
                <p className="text-base font-extrabold" style={{ color: "#111" }}>
                  {med.price}
                </p>
                {med.priceNote && (
                  <p className="text-[13px] mt-0.5" style={{ color: "#555", fontWeight: 500 }}>
                    {med.priceNote}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {/* Start Now button — always at the bottom, aligned across all cards */}
        <button
          onClick={() => onConsultClick?.()}
          className="mt-4 w-full flex items-center justify-center gap-2 rounded-full py-3 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #E8339E, #7A1E7E)",
            boxShadow: "0 4px 16px rgba(232,51,158,0.40)",
            cursor: "pointer",
            border: "none",
          }}
        >
          Start Now
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
