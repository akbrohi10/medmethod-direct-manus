# MedMethod Direct — FAQ vs. Program Cards Audit

## Program Cards Summary (home1/PopularPrograms.tsx)

| Program | Price (3mo/6mo/12mo) | Initiation Fee | Key Features |
|---------|---------------------|----------------|--------------|
| **Ignite** | $129 / $109 / $99 | $49 / $49 / $0 (waived 12mo) | Async physician access, 48hr response SLA, custom protocol, à la carte drug menu |
| **Transformation** | $249 / $215 / $199 | $199 / $199 / $199 | Live video consult (30min), 30+ biomarker labs, Performance Coach, nutrition/fitness plan, 24hr SLA, BHRT/TRT available |
| **Longevity** | $379 / $325 / $299 | $349 / $349 / $349 | 45min strategy consult, 75+ biomarker labs, quarterly labs, advanced diagnostics (CT calcium, DEXA, CGM), 12hr SLA, at-home phlebotomy |

## FAQ Claims vs. Program Cards — Alignment Check

### ✅ ALIGNED

1. **"Ignite covers asynchronous physician access and protocol design"** → Matches card: async intake, 48hr response, custom protocol design.

2. **"Transformation adds live video visits, baseline labs, structured nutrition and fitness plans, and a Performance Coach"** → Matches card: 30-min live video, 30+ biomarker labs, nutrition/fitness plan, Performance Coach.

3. **"Longevity adds quarterly physician strategy sessions, expanded diagnostics, and premium peptide access"** → Partially matches: quarterly 45-min strategy session ✅, expanded diagnostics ✅. However, "premium peptide access" is NOT mentioned anywhere on the Longevity card.

4. **"Ignite is asynchronous, with live video available at $49 per visit"** → Card says async with 48hr response. The $49/visit add-on is not shown on the card but is stated in the FAQ.

5. **"Transformation includes an initial live consultation plus regular video check-ins and unlimited secure messaging at a 24-hour response standard"** → Matches card: initial live video call, monthly/every-other-month check-ins, unlimited messaging 24hr SLA.

6. **"Longevity adds a quarterly 45-minute physician strategy session and priority access at a 12-hour standard"** → Matches card exactly.

7. **"The one-time initiation fee covers your onboarding: physician intake, custom protocol design, and dashboard setup at every tier"** → Matches Ignite card.

8. **"At Transformation it also includes your 45-minute live consultation and a baseline 30+ biomarker lab panel"** → ⚠️ MISMATCH: Card says **30-minute** consultation, FAQ says **45-minute**.

9. **"At Longevity it includes a premium 75+ biomarker panel and at-home phlebotomy where available"** → Matches card.

10. **"Cherry financing is available on the 6- and 12-month plans"** → Not contradicted by cards, but cards don't mention Cherry.

11. **"Is the Ignite 12-month initiation fee waiver real? Yes."** → Matches card: Ignite 12mo initiation = $0 (waived).

---

### ❌ MISALIGNED / INACCURATE

| # | FAQ Claim | What the Card Actually Says | Issue |
|---|-----------|---------------------------|-------|
| 1 | "Transformation includes your **45-minute** live consultation" (billing FAQ, initiation fee question) | Transformation card says **"30-minute in-depth live physician video consultation"** | **Duration mismatch: FAQ says 45 min, card says 30 min** |
| 2 | "Term pricing rewards commitment with lower monthly membership rates — up to **15%** on the 6-month plan and up to **23%** on the 12-month plan" | Ignite: 3mo=$129, 6mo=$109 (15.5% off), 12mo=$99 (23.3% off). Transformation: 3mo=$249, 6mo=$215 (13.7% off), 12mo=$199 (20.1% off). Longevity: 3mo=$379, 6mo=$325 (14.2% off), 12mo=$299 (21.1% off). | **Percentages only match Ignite exactly. Transformation and Longevity discounts are lower than stated (13.7%/20.1% and 14.2%/21.1% vs. "up to 15%/23%").** The "up to" language technically covers this since Ignite hits those numbers, but it's borderline misleading. |
| 3 | "Longevity adds... premium peptide access" | Longevity card does NOT mention peptides anywhere in initiation or ongoing includes | **Missing from card — either add to card or remove from FAQ** |
| 4 | FAQ says "Ignite is for the patient who knows what they want and values speed and price over coaching" | Card tagline says "Async access · price-sensitive" and description says "Patients who know what they want & value speed + price over coaching" | ✅ Actually aligned — just confirming |
| 5 | FAQ: "Do I have to buy medication to have a membership? No." | The program cards (home1) are membership-only tiers (Ignite/Transformation/Longevity) separate from the medication cards in the other PopularPrograms component | ✅ Aligned — the home1 cards are membership-only |

---

### ⚠️ POTENTIAL ISSUES (Not Wrong, But Worth Noting)

1. **Two different PopularPrograms components exist:**
   - `components/PopularPrograms.tsx` — Shows medication bundles (SlimMethod, AccelerateMethod, RestoreMethod, LongevityMethod, ThriveMethod) with drug pricing
   - `components/home1/PopularPrograms.tsx` — Shows membership tiers (Ignite, Transformation, Longevity) without drug pricing
   
   The FAQ references BOTH systems but doesn't clearly distinguish between them. A patient reading the FAQ might be confused about which "tier" or "program" is being discussed.

2. **FAQ mentions "BHRT for women, TRT for men"** — The Transformation card says "BHRT and TRT available in this tier" which aligns, but the site is positioned as women-focused. The male page exists separately.

3. **FAQ says "What states do you serve? We operate across multiple states..."** — This is vague. The site now clearly states 17 states in the footer. The FAQ should be updated to match.

---

## RECOMMENDED FIXES

| Priority | Fix | Location |
|----------|-----|----------|
| 🔴 High | Change "45-minute live consultation" → "30-minute live consultation" in the initiation fee FAQ answer | FAQ.tsx, line 101 |
| 🟡 Medium | Update "What states do you serve?" answer to list the 17 states or say "Licensed in 17 states" | FAQ.tsx, line 148-149 |
| 🟡 Medium | Either add "premium peptide access" to the Longevity card OR remove it from the FAQ | FAQ.tsx line 78 or PopularPrograms card |
| 🟢 Low | Consider clarifying discount percentages or using "up to" more carefully | FAQ.tsx, line 97 |
