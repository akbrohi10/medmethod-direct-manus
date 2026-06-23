import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export default function MedicationPricing() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { if (document.head.contains(link)) document.head.removeChild(link); };
  }, []);

  // ─── Brand Palette ───
  const INK = '#111111';
  const INK_SOFT = '#3D3D45';
  const INK_MUTED = '#7A7A85';
  const PAPER = '#FFFFFF';
  const PAPER_2 = '#FAF7FA';
  const LINE = '#E8E2EC';
  const PINK = '#E8338E';
  const PINK_BG = '#FDEAF4';
  const PINK_DEEP = '#C71F75';
  const PURPLE = '#7A1E7E';
  const PURPLE_BG = '#F0E3F2';
  const PURPLE_DEEP = '#5A1660';
  const AMBER_BG = '#FEF7E0';
  const AMBER_TEXT = '#9F6818';

  const FONT_DISPLAY = '"Montserrat", -apple-system, sans-serif';
  const FONT_BODY = '"Inter", "Montserrat", -apple-system, sans-serif';
  const SITE = 'https://medmethoddirect.com/';

  // ─── PRICING DATA ───
  // Brand figures verified June 2026 against manufacturer pages (links in each card + footer).
  // Compounded figures from MedMethod_SalesPricingMatrix_v7 (locked May 21, 2026).
  const glp1Drugs = [
    {
      name: 'Semaglutide Injection',
      desc: 'Weekly injection · same active ingredient as Wegovy',
      brandName: 'Wegovy',
      brandSource: 'NovoCare / Novo telehealth partners',
      brandStructure: 'dual',
      brandOptions: [
        { label: 'NovoCare direct (self-pay)', price: 349, annual: 4188, note: 'Standard maintenance self-pay. $199/mo intro for first 2 months on lowest doses.' },
        { label: '12-month subscription (Ro / WW / LifeMD)', price: 249, annual: 2988, note: 'Lowest brand price — requires a 12-month commitment through Novo telehealth partners.' },
      ],
      brandAnnual: 4188,
      compPrice: 179,
      compAnnual: 2148,
      compStructure: 'flat',
      compSavingsText: 'About $2,040/yr (~49%) less than NovoCare direct ($4,188/yr), or about $840/yr (~28%) less than the $2,988/yr 12-month subscription. Medication price only.',
    },
    {
      name: 'Tirzepatide Injection',
      desc: 'Weekly injection · same active ingredient as Zepbound',
      brandName: 'Zepbound',
      brandSource: 'LillyDirect Self-Pay Journey Program · single-dose vials',
      brandStructure: 'tiers',
      brandTiers: [
        { label: 'Month 1 · 2.5mg', price: 299 },
        { label: '5mg', price: 399 },
        { label: '7.5–15mg', price: 449 },
      ],
      brandAnnual: 5088,
      brandWarning: 'LillyDirect $449 holds only if you refill within 45 days. Miss the window on 7.5mg+ and the price jumps ($599–$1,049 by dose), so the 12-month total shown is the best case.',
      compStructure: 'tiers',
      compTiers: [
        { label: 'Month 1 (2.5mg/wk)', price: 199 },
        { label: 'Months 2–4 (5–7.5mg/wk)', price: 299 },
        { label: 'Months 5–12 (10–15mg/wk)', price: 349 },
      ],
      compAnnual: 3888,
    },
    {
      name: 'Oral Semaglutide',
      desc: 'Daily oral form · same drug family as Wegovy',
      brandName: 'Wegovy (oral)',
      brandSource: 'NovoCare (starter) → manufacturer subscription (maintenance)',
      brandStructure: 'starter-maint',
      brandStarter: 149,
      brandMaint: 299,
      brandAnnual: 3288,
      brandNote: 'NovoCare carries only starter doses (1.5/4mg). Maintenance doses (9/25mg) are filled through the manufacturer subscription channel, which is why the monthly price changes after Month 1.',
      compStructure: 'flat',
      compPrice: 149,
      compAnnual: 1788,
    },
    {
      name: 'Oral Tirzepatide / Oral GLP-1 (Lilly)',
      desc: 'Daily oral form',
      brandName: 'Foundayo (orforglipron)',
      brandSource: 'LillyDirect self-pay · dose ladder',
      brandStructure: 'tiers',
      brandTiers: [
        { label: 'Month 1 · 0.8mg (start)', price: 149 },
        { label: '2.5mg', price: 199 },
        { label: '5.5–9mg', price: 299 },
        { label: '14.5–17.2mg (max)', price: 349 },
      ],
      brandAnnual: 3438,
      brandAnnualText: '~$3,300–$3,750/yr',
      brandWarning: 'Foundayo contains orforglipron — a DIFFERENT molecule from tirzepatide, and is not interchangeable with Zepbound. LillyDirect self-pay is a dose ladder ($149 → $199 → $299 → $349). The two top doses drop from $349 to $299/mo if refilled within 45 days. Phase 3 trial weight loss was ~11–15%, below injectable tirzepatide (~15–21%).',
      compStructure: 'flat',
      compPrice: 199,
      compAnnual: 2388,
      compAltNote: 'Offered as an alternative oral option for patients who prefer to avoid injections — not a stated equivalent to Foundayo, which is a different molecule (see brand note). No efficacy claim is made for this formulation; appropriateness is a clinical decision your physician will discuss with you.',
      compSavingsText: 'About $900–$1,350 less per year (~28–36%) than Foundayo\u2019s typical annual cost, depending on final dose and 45-day refill timing. This is a price comparison between two different oral options — not a discount on the same drug. Foundayo is FDA-approved with Phase 3 trial data; the compounded option is not FDA-approved and has no comparable trial evidence. Medication price only.',
    },
  ];

  const brandSourceLinks = {
    'Semaglutide Injection': 'https://www.novocare.com/patient/medicines/wegovy.html',
    'Tirzepatide Injection': 'https://zepbound.lilly.com/coverage-savings',
    'Oral Semaglutide': 'https://www.novocare.com/pharmacy/wegovy.html',
    'Oral Tirzepatide / Oral GLP-1 (Lilly)': 'https://www.lilly.com/lillydirect/medicines/foundayo',
  };

  const bhrtDrugs = [
    { name: 'Estradiol Patch',         detail: '0.05–0.1mg · 2× weekly · 8 patches/mo',  compPrice: 99, brandName: 'Climara / Vivelle-Dot',  brandPrice: 292.81 },
    { name: 'Micronized Progesterone', detail: '100/200/300mg nightly · 30 caps',         compPrice: 49, brandName: 'Prometrium',             brandPrice: 497 },
    { name: 'Bi-Est Cream',            detail: 'Estriol + Estradiol · 30g',               compPrice: 69, brandName: 'Estrace cream (proxy)',  brandPrice: 114.79 },
    { name: 'Four-Hormone Cream',      detail: 'Estradiol + Estriol + Progesterone + Testosterone · 30g', compPrice: 89, brandName: null, brandPrice: null },
    { name: 'Testosterone Cream 30g',  detail: "Women's formula · 0.5% · 30g monthly",     compPrice: 69, brandName: null, brandPrice: null },
    { name: 'Testosterone Cream 15g',  detail: "Women's low-dose · 0.5% · 15g monthly",    compPrice: 49, brandName: null, brandPrice: null },
    { name: 'DHEA Capsules',           detail: '25mg Rx-grade · 30 capsules',              compPrice: 29, brandName: 'OTC supplement',         brandPrice: 30 },
    { name: 'Vaginal Estrogen Cream',  detail: 'Estriol 0.5mg/g · 30g',                    compPrice: 59, brandName: 'Premarin cream',         brandPrice: 592.70 },
  ];

  const bhrtStacks = [
    {
      name: 'Basic Menopause Protocol',
      desc: 'Estradiol patch and bioidentical progesterone.',
      items: ['Estradiol Patch', 'Micronized Progesterone'],
      compMonthly: 99 + 49,
      brandMonthly: 292.81 + 497,
    },
    {
      name: 'Standard Protocol',
      desc: 'Adds women\'s low-dose testosterone.',
      items: ['Estradiol Patch', 'Micronized Progesterone', "Testosterone Cream (women's)"],
      compMonthly: 99 + 49 + 69,
      brandMonthly: null,
      noteOnBrand: 'No brand-name equivalent exists for women\'s low-dose testosterone; it is available only compounded. No retail price comparison can be shown.',
    },
    {
      name: 'Comprehensive Protocol',
      desc: 'Full-spectrum hormone support plus DHEA and localized vaginal estrogen.',
      items: ['Four-Hormone Cream', 'DHEA Capsules', 'Vaginal Estrogen Cream'],
      compMonthly: 89 + 29 + 59,
      brandMonthly: null,
      noteOnBrand: 'No direct brand equivalent exists for the Four-Hormone Cream, so a like-for-like retail comparison is not available.',
    },
  ];

  const PageHeader = ({ subtitle }: { subtitle: string }) => (
    <div style={{
      marginBottom: '20px', padding: '28px 30px',
      background: `linear-gradient(135deg, ${PINK} 0%, ${PURPLE} 100%)`,
      color: '#FFFFFF', borderRadius: '14px', textAlign: 'center',
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '14px',
        padding: '6px 14px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '50px',
        border: '1px solid rgba(255,255,255,0.25)',
      }}>
        <div style={{
          width: '30px', height: '30px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '7px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '13px',
        }}>MMD</div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: '14px', fontWeight: 700, lineHeight: 1 }}>
            Med<span style={{ fontWeight: 800 }}>Method</span> <span style={{ fontWeight: 400, opacity: 0.95 }}>DIRECT</span>
          </div>
          <div style={{ fontSize: '8.5px', opacity: 0.85, marginTop: '2px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Your Path to Longevity</div>
        </div>
      </div>
      <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: '28px', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: '8px', lineHeight: 1.1 }}>
        Medication Pricing Guide
      </h1>
      <p style={{ fontSize: '13.5px', lineHeight: 1.5, opacity: 0.95, maxWidth: '560px', margin: '0 auto', fontWeight: 400 }}>
        {subtitle}
      </p>
    </div>
  );

  const ScopeBar = () => (
    <div style={{
      marginBottom: '28px', padding: '11px 18px', backgroundColor: PAPER_2,
      border: `1px solid ${LINE}`, borderRadius: '10px', textAlign: 'center',
      fontSize: '12px', color: INK_SOFT, lineHeight: 1.5,
    }}>
      This guide shows <strong>medication pricing only</strong>. For consultation, lab, and membership details, visit{' '}
      <a href={SITE} target="_blank" rel="noopener noreferrer" style={{ color: PINK_DEEP, fontWeight: 600, textDecoration: 'underline' }}>medmethoddirect.com</a>.
    </div>
  );

  const SourceLink = ({ name }: { name: string }) => (
    brandSourceLinks[name as keyof typeof brandSourceLinks] ? (
      <> · <a href={brandSourceLinks[name as keyof typeof brandSourceLinks]} target="_blank" rel="noopener noreferrer" style={{ color: PINK_DEEP, fontStyle: 'normal', fontWeight: 600, textDecoration: 'underline' }}>View manufacturer pricing ↗</a></>
    ) : null
  );

  const SavingsBox = ({ drug }: { drug: any }) => {
    if (drug.compSavingsText) {
      return (
        <div style={{ marginTop: '10px', padding: '8px 10px', backgroundColor: PAPER_2, border: `1px solid ${LINE}`, borderRadius: '6px', fontSize: '10.5px', color: INK_SOFT, lineHeight: 1.45 }}>
          <strong style={{ color: PURPLE_DEEP }}>Annual savings (medication only): </strong>{drug.compSavingsText}
        </div>
      );
    }
    if (typeof drug.brandAnnual === 'number' && typeof drug.compAnnual === 'number') {
      const sv = drug.brandAnnual - drug.compAnnual;
      const pct = Math.round(sv / drug.brandAnnual * 100);
      return (
        <div style={{ marginTop: '10px', padding: '8px 10px', backgroundColor: PAPER_2, border: `1px solid ${LINE}`, borderRadius: '6px', fontSize: '10.5px', color: INK_SOFT, lineHeight: 1.45 }}>
          <strong style={{ color: PURPLE_DEEP }}>Annual savings: </strong>about ${sv.toLocaleString()}/yr (~{pct}%) vs the brand-name path — medication price only.
        </div>
      );
    }
    return null;
  };

  const pageBreak: React.CSSProperties = { breakAfter: 'page', pageBreakAfter: 'always' };

  return (
    <>
      <Helmet>
        <title>Medication Pricing Guide | MedMethod Direct</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="Internal medication pricing guide for MedMethod Direct patients. Brand-name and compounded options for GLP-1 and BHRT medications." />
      </Helmet>
      <div style={{ backgroundColor: PAPER, color: INK, fontFamily: FONT_BODY, minHeight: '100vh', WebkitFontSmoothing: 'antialiased' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px 60px' }}>

        {/* ══════════════════ PAGE 1: GLP-1 ══════════════════ */}
        <PageHeader subtitle="Two pricing paths for your medication: brand-name through the manufacturer, or a compounded option. Dr. Al-Deek manages your care on either path. This page covers GLP-1 weight-management medications." />
        <ScopeBar />

        {/* HOW IT WORKS */}
        <div style={{ marginBottom: '32px', padding: '22px 24px', backgroundColor: PAPER_2, borderRadius: '12px', border: `1px solid ${LINE}` }}>
          <div style={{ fontSize: '10.5px', letterSpacing: '0.2em', color: PINK_DEEP, textTransform: 'uppercase', fontWeight: 700, marginBottom: '12px', textAlign: 'center' }}>
            How It Works · Two Paths
          </div>
          <div style={{ display: 'grid', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0, width: '30px', height: '30px', backgroundColor: PURPLE, color: '#FFF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '14px' }}>1</div>
              <div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: '14.5px', fontWeight: 700, marginBottom: '4px' }}>Brand-name via manufacturer direct</div>
                <div style={{ fontSize: '13px', color: INK_SOFT, lineHeight: 1.55 }}>
                  Dr. Al-Deek writes the brand-name prescription and routes it to NovoCare or LillyDirect. You pay the manufacturer's cash-pay rate directly. These are FDA-approved products.
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0, width: '30px', height: '30px', background: `linear-gradient(135deg, ${PINK}, ${PURPLE})`, color: '#FFF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '14px' }}>2</div>
              <div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: '14.5px', fontWeight: 700, marginBottom: '4px' }}>Compounded option</div>
                <div style={{ fontSize: '13px', color: INK_SOFT, lineHeight: 1.55 }}>
                  Prepared by a licensed compounding pharmacy at a lower monthly price. Compounded medications are <strong>not FDA-approved</strong>, and the FDA does not review them for safety, effectiveness, potency, or purity before they reach you. Whether this option is appropriate for you is a clinical decision Dr. Al-Deek will discuss with you. See &ldquo;What you should know&rdquo; below.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: '28px', fontWeight: 700, color: PURPLE_DEEP, letterSpacing: '-0.02em', marginBottom: '6px' }}>
            GLP-1 Weight-Management Medications
          </h2>
          <p style={{ fontSize: '13.5px', color: INK_SOFT, lineHeight: 1.55, maxWidth: '600px', margin: '0 auto' }}>
            Brand-name and compounded pricing side by side. Read both columns and decide with your physician.
          </p>
        </div>

        {glp1Drugs.map((drug, idx) => (
          <div key={idx} style={{ marginBottom: '22px', backgroundColor: PAPER, border: `2px solid ${LINE}`, borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px 16px', background: `linear-gradient(135deg, ${PINK_BG}, ${PURPLE_BG})`, borderBottom: `1px solid ${LINE}` }}>
              <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: '20px', fontWeight: 700, color: PURPLE_DEEP, letterSpacing: '-0.015em', marginBottom: '5px', lineHeight: 1.2 }}>{drug.name}</h3>
              <p style={{ fontSize: '13px', color: INK_SOFT, lineHeight: 1.5, margin: 0 }}>{drug.desc}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
              {/* BRAND COLUMN */}
              <div style={{ padding: '18px 20px', borderRight: `1px solid ${LINE}` }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: '13.5px', fontWeight: 700, color: INK, marginBottom: '2px' }}>{drug.brandName}</div>
                <div style={{ fontSize: '11px', color: INK_MUTED, fontStyle: 'italic', marginBottom: '12px', lineHeight: 1.4 }}>
                  {drug.brandSource}<SourceLink name={drug.name} />
                </div>

                {drug.brandStructure === 'flat' && (drug as any).brandPrice && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0', borderTop: `1px solid ${LINE}` }}>
                    <span style={{ fontSize: '12.5px', color: INK_SOFT }}>Monthly</span>
                    <span style={{ fontFamily: FONT_DISPLAY, fontSize: '20px', fontWeight: 700 }}>${(drug as any).brandPrice}<span style={{ fontSize: '11px', color: INK_MUTED, fontWeight: 500 }}>/mo</span></span>
                  </div>
                )}

                {drug.brandStructure === 'dual' && drug.brandOptions?.map((opt, i) => (
                  <div key={i} style={{ padding: '8px 0', borderTop: `1px solid ${LINE}` }}>
                    <div style={{ fontSize: '11.5px', color: INK_SOFT, marginBottom: '3px', fontWeight: 600 }}>
                      {i === 0 ? 'Option A · ' : 'Option B · '}{opt.label}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontFamily: FONT_DISPLAY, fontSize: '18px', fontWeight: 700 }}>${opt.price}<span style={{ fontSize: '11px', color: INK_MUTED, fontWeight: 500 }}>/mo</span></span>
                      <span style={{ fontSize: '11px', color: INK_MUTED, fontWeight: 600 }}>${opt.annual.toLocaleString()}/yr</span>
                    </div>
                    {opt.note && <div style={{ fontSize: '10px', color: INK_MUTED, marginTop: '3px', lineHeight: 1.4 }}>{opt.note}</div>}
                  </div>
                ))}

                {drug.brandStructure === 'starter-maint' && (
                  <>
                    <div style={{ padding: '8px 0', borderTop: `1px solid ${LINE}` }}>
                      <div style={{ fontSize: '11.5px', color: INK_SOFT, marginBottom: '2px' }}>Starter Month (Month 1)</div>
                      <div style={{ fontFamily: FONT_DISPLAY, fontSize: '18px', fontWeight: 700 }}>${drug.brandStarter}<span style={{ fontSize: '11px', color: INK_MUTED, fontWeight: 500 }}>/mo</span></div>
                    </div>
                    <div style={{ padding: '8px 0', borderTop: `1px solid ${LINE}` }}>
                      <div style={{ fontSize: '11.5px', color: INK_SOFT, marginBottom: '2px' }}>Ongoing (Months 2–12)</div>
                      <div style={{ fontFamily: FONT_DISPLAY, fontSize: '18px', fontWeight: 700 }}>${drug.brandMaint}<span style={{ fontSize: '11px', color: INK_MUTED, fontWeight: 500 }}>/mo</span></div>
                    </div>
                  </>
                )}

                {drug.brandStructure === 'tiers' && drug.brandTiers?.map((t, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0', borderTop: `1px solid ${LINE}` }}>
                    <span style={{ fontSize: '11.5px', color: INK_SOFT }}>{t.label}</span>
                    <span style={{ fontFamily: FONT_DISPLAY, fontSize: '15px', fontWeight: 700 }}>${t.price}</span>
                  </div>
                ))}

                {drug.brandStructure !== 'dual' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '8px', paddingTop: '8px', borderTop: `2px solid ${LINE}` }}>
                    <span style={{ fontSize: '10.5px', color: INK_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>12-month total</span>
                    <span style={{ fontFamily: FONT_DISPLAY, fontSize: '15px', fontWeight: 700 }}>{drug.brandAnnualText ? drug.brandAnnualText : `$${drug.brandAnnual.toLocaleString()}`}</span>
                  </div>
                )}

                {drug.brandNote && (
                  <div style={{ marginTop: '10px', padding: '8px 10px', backgroundColor: AMBER_BG, borderRadius: '6px', fontSize: '10.5px', color: INK_SOFT, lineHeight: 1.45 }}>
                    <strong style={{ color: AMBER_TEXT }}>Note:</strong> {drug.brandNote}
                  </div>
                )}
                {drug.brandWarning && (
                  <div style={{ marginTop: '10px', padding: '8px 10px', backgroundColor: AMBER_BG, borderRadius: '6px', fontSize: '10.5px', color: INK_SOFT, lineHeight: 1.45 }}>
                    <strong style={{ color: AMBER_TEXT }}>Important:</strong> {drug.brandWarning}
                  </div>
                )}
              </div>

              {/* COMPOUNDED COLUMN */}
              <div style={{ padding: '18px 20px', background: `linear-gradient(135deg, ${PINK_BG} 0%, #FFFFFF 100%)` }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: '13.5px', fontWeight: 700, color: PURPLE_DEEP, marginBottom: '2px' }}>Compounded option</div>
                <div style={{ fontSize: '11px', color: INK_MUTED, fontStyle: 'italic', marginBottom: '12px', lineHeight: 1.4 }}>Licensed compounding pharmacy · not FDA-approved</div>

                {drug.compStructure === 'flat' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0', borderTop: `1px solid ${LINE}` }}>
                      <span style={{ fontSize: '12.5px', color: INK_SOFT }}>Monthly</span>
                      <span style={{ fontFamily: FONT_DISPLAY, fontSize: '22px', fontWeight: 800, color: PINK_DEEP }}>${drug.compPrice}<span style={{ fontSize: '11px', color: INK_MUTED, fontWeight: 500 }}>/mo</span></span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '8px', paddingTop: '8px', borderTop: `2px solid ${PINK_BG}` }}>
                      <span style={{ fontSize: '10.5px', color: INK_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>12-month total</span>
                      <span style={{ fontFamily: FONT_DISPLAY, fontSize: '15px', fontWeight: 700, color: PINK_DEEP }}>${drug.compAnnual.toLocaleString()}</span>
                    </div>
                    {drug.compAltNote && (
                      <div style={{ marginTop: '10px', padding: '8px 10px', backgroundColor: AMBER_BG, borderRadius: '6px', fontSize: '10.5px', color: INK_SOFT, lineHeight: 1.45 }}>
                        <strong style={{ color: AMBER_TEXT }}>Alternative option:</strong> {drug.compAltNote}
                      </div>
                    )}
                    <SavingsBox drug={drug} />
                  </>
                )}

                {drug.compStructure === 'tiers' && drug.compTiers && (
                  <>
                    {drug.compTiers.map((t, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0', borderTop: `1px solid ${LINE}` }}>
                        <span style={{ fontSize: '11.5px', color: INK_SOFT }}>{t.label}</span>
                        <span style={{ fontFamily: FONT_DISPLAY, fontSize: '15px', fontWeight: 800, color: PINK_DEEP }}>${t.price}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '8px', paddingTop: '8px', borderTop: `2px solid ${PINK_BG}` }}>
                      <span style={{ fontSize: '10.5px', color: INK_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>12-month total</span>
                      <span style={{ fontFamily: FONT_DISPLAY, fontSize: '15px', fontWeight: 700, color: PINK_DEEP }}>${drug.compAnnual.toLocaleString()}</span>
                    </div>
                    <SavingsBox drug={drug} />
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* WHAT YOU SHOULD KNOW */}
        <div style={{ marginTop: '32px', marginBottom: '24px', padding: '24px 26px', backgroundColor: PAPER_2, border: `1px solid ${LINE}`, borderRadius: '14px' }}>
          <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: '18px', fontWeight: 700, color: PURPLE_DEEP, letterSpacing: '-0.015em', marginBottom: '14px' }}>
            What you should know
          </h3>
          <div style={{ display: 'grid', gap: '12px', fontSize: '12.5px', color: INK_SOFT, lineHeight: 1.6 }}>
            <div><strong style={{ color: PINK_DEEP }}>Compounded medications are not FDA-approved.</strong> The FDA does not verify their safety, effectiveness, potency, or purity before they reach you. They are permitted only under specific federal conditions. This is the central difference from the brand-name products — not simply price.</div>
            <div><strong style={{ color: PINK_DEEP }}>Compounding rules depend on shortage status.</strong> The conditions under which these GLP-1 drugs may be compounded have changed as they moved on and off the FDA shortage list. Your physician will confirm what is currently available.</div>
            <div><strong style={{ color: PINK_DEEP }}>Foundayo is a different drug.</strong> It contains orforglipron, not tirzepatide, and reported weight-loss results differ. It is not a substitute for Zepbound.</div>
            <div><strong style={{ color: PINK_DEEP }}>Compare total cost, not just the medication.</strong> Consult, labs, and membership are billed separately — see <a href={SITE} target="_blank" rel="noopener noreferrer" style={{ color: PINK_DEEP, fontWeight: 600 }}>medmethoddirect.com</a> for full program details.</div>
            <div><strong style={{ color: PINK_DEEP }}>Same physician on either path.</strong> Dr. Al-Deek manages your clinical care whether you choose brand-name or compounded.</div>
          </div>
        </div>

        {/* PAGE BREAK */}
        <div style={pageBreak} />

        {/* ══════════════════ PAGE 2: BHRT ══════════════════ */}
        <PageHeader subtitle="This page covers bioidentical hormone replacement therapy (BHRT). Compounded hormone pricing is shown alongside brand-name retail where a comparable product exists." />
        <ScopeBar />

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: '28px', fontWeight: 700, color: PURPLE_DEEP, letterSpacing: '-0.02em', marginBottom: '6px' }}>
            BHRT Hormone Therapy
          </h2>
          <p style={{ fontSize: '13.5px', color: INK_SOFT, lineHeight: 1.55, maxWidth: '600px', margin: '0 auto' }}>
            Bioidentical hormones prepared by a licensed compounding pharmacy. Like the GLP-1 options, compounded hormones are not FDA-approved.
          </p>
        </div>

        <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: '18px', fontWeight: 700, color: INK, letterSpacing: '-0.015em', marginBottom: '12px' }}>
          Individual hormone pricing
        </h3>
        <div style={{ marginBottom: '32px', backgroundColor: PAPER, border: `2px solid ${LINE}`, borderRadius: '14px', overflow: 'hidden' }}>
          {bhrtDrugs.map((drug, idx) => (
            <div key={idx} style={{ padding: '16px 20px', borderBottom: idx < bhrtDrugs.length - 1 ? `1px solid ${LINE}` : 'none' }}>
              <div style={{ marginBottom: '10px' }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: '15px', fontWeight: 700, color: PURPLE_DEEP, marginBottom: '3px' }}>{drug.name}</div>
                <div style={{ fontSize: '11.5px', color: INK_MUTED, fontStyle: 'italic', lineHeight: 1.4 }}>{drug.detail}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ padding: '10px 12px', background: `linear-gradient(135deg, ${PINK_BG}, ${PURPLE_BG})`, borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', letterSpacing: '0.1em', color: PINK_DEEP, textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>Compounded</div>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: '19px', fontWeight: 800, color: PINK_DEEP, lineHeight: 1.1 }}>${drug.compPrice}<span style={{ fontSize: '10px', color: INK_MUTED, fontWeight: 500 }}>/mo</span></div>
                  <div style={{ fontSize: '9.5px', color: INK_MUTED, marginTop: '2px' }}>${(drug.compPrice * 12).toLocaleString()}/yr</div>
                </div>
                <div style={{ padding: '10px 12px', backgroundColor: PAPER_2, borderRadius: '8px', textAlign: 'center', border: `1px solid ${LINE}` }}>
                  <div style={{ fontSize: '9px', letterSpacing: '0.1em', color: INK_MUTED, textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>Brand retail</div>
                  {drug.brandPrice ? (
                    <>
                      <div style={{ fontFamily: FONT_DISPLAY, fontSize: '16px', fontWeight: 700, color: INK_SOFT, lineHeight: 1.1 }}>${drug.brandPrice.toFixed(0)}<span style={{ fontSize: '9px', color: INK_MUTED, fontWeight: 500 }}>/mo</span></div>
                      <div style={{ fontSize: '9.5px', color: INK_MUTED, marginTop: '2px' }}>{drug.brandName}</div>
                    </>
                  ) : (
                    <div style={{ fontSize: '10.5px', color: INK_MUTED, fontStyle: 'italic', padding: '5px 0' }}>Compounded only<br/>(no brand equivalent)</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: '18px', fontWeight: 700, color: INK, letterSpacing: '-0.015em', marginBottom: '4px' }}>
          Sample protocols
        </h3>
        <p style={{ fontSize: '12.5px', color: INK_SOFT, lineHeight: 1.55, marginBottom: '16px' }}>
          Many patients take more than one hormone. These are illustrative combinations and their monthly compounded cost. Your physician decides what is appropriate for you.
        </p>

        {bhrtStacks.map((stack, idx) => (
          <div key={idx} style={{ marginBottom: '18px', backgroundColor: PAPER, border: `2px solid ${LINE}`, borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px 12px', background: `linear-gradient(135deg, ${PURPLE_BG}, ${PINK_BG})`, borderBottom: `1px solid ${LINE}` }}>
              <h4 style={{ fontFamily: FONT_DISPLAY, fontSize: '16px', fontWeight: 700, color: PURPLE_DEEP, letterSpacing: '-0.01em', marginBottom: '3px' }}>{stack.name}</h4>
              <p style={{ fontSize: '12px', color: INK_SOFT, lineHeight: 1.5, margin: 0 }}>{stack.desc}</p>
            </div>
            <div style={{ padding: '14px 20px' }}>
              <div style={{ fontSize: '10.5px', letterSpacing: '0.1em', color: INK_MUTED, textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>Includes</div>
              <ul style={{ paddingLeft: '18px', margin: '0 0 12px 0', fontSize: '12.5px', color: INK_SOFT, lineHeight: 1.6 }}>
                {stack.items.map((it, i) => <li key={i}>{it}</li>)}
              </ul>
              <div style={{ display: 'grid', gridTemplateColumns: stack.brandMonthly ? '1fr 1fr' : '1fr', gap: '10px' }}>
                <div style={{ padding: '12px 14px', background: `linear-gradient(135deg, ${PINK}, ${PURPLE})`, borderRadius: '8px', color: '#FFF' }}>
                  <div style={{ fontSize: '9.5px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, opacity: 0.9, marginBottom: '4px' }}>Compounded</div>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: '22px', fontWeight: 800, lineHeight: 1, marginBottom: '2px' }}>${stack.compMonthly}/mo</div>
                  <div style={{ fontSize: '11.5px', opacity: 0.92, fontWeight: 500 }}>${(stack.compMonthly * 12).toLocaleString()}/year</div>
                </div>
                {stack.brandMonthly && (
                  <div style={{ padding: '12px 14px', backgroundColor: PAPER_2, borderRadius: '8px', border: `1px solid ${LINE}` }}>
                    <div style={{ fontSize: '9.5px', letterSpacing: '0.12em', color: INK_MUTED, textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Brand retail</div>
                    <div style={{ fontFamily: FONT_DISPLAY, fontSize: '19px', fontWeight: 700, color: INK_SOFT, lineHeight: 1, marginBottom: '2px' }}>${stack.brandMonthly.toFixed(0)}/mo</div>
                    <div style={{ fontSize: '11.5px', color: INK_MUTED, fontWeight: 500 }}>${(stack.brandMonthly * 12).toFixed(0).toLocaleString()}/year</div>
                  </div>
                )}
              </div>
              {stack.noteOnBrand && (
                <div style={{ marginTop: '12px', padding: '9px 12px', backgroundColor: AMBER_BG, borderRadius: '6px', fontSize: '11px', color: INK_SOFT, lineHeight: 1.5 }}>
                  <strong style={{ color: AMBER_TEXT }}>Note:</strong> {stack.noteOnBrand}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* TRUST RECAP + CTA */}
        <div style={{ marginTop: '24px', marginBottom: '24px', padding: '20px 24px', backgroundColor: PAPER_2, border: `1px solid ${LINE}`, borderRadius: '12px', fontSize: '12.5px', color: INK_SOFT, lineHeight: 1.6 }}>
          <strong style={{ color: PINK_DEEP, fontFamily: FONT_DISPLAY }}>A reminder on compounded hormones.</strong> As with the GLP-1 options, compounded BHRT is not FDA-approved and is not reviewed for potency or purity before reaching you. Some hormones (women's low-dose testosterone, the Four-Hormone Cream) have no brand-name equivalent, so no retail comparison is possible.
        </div>

        <div style={{ padding: '30px 26px', background: `linear-gradient(135deg, ${PURPLE}, ${PINK})`, color: '#FFF', borderRadius: '14px', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '10.5px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, opacity: 0.9, marginBottom: '8px' }}>Questions about your options?</div>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: '23px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '10px', lineHeight: 1.2 }}>Talk with your care team</h2>
          <p style={{ fontSize: '13.5px', lineHeight: 1.6, opacity: 0.95, maxWidth: '480px', margin: '0 auto 18px' }}>
            Dr. Al-Deek and your advisor can walk through which path fits your health and your goals.
          </p>
          <div style={{ display: 'inline-block', padding: '13px 30px', backgroundColor: '#FFF', color: PURPLE_DEEP, borderRadius: '50px', fontFamily: FONT_DISPLAY, fontSize: '14.5px', fontWeight: 700 }}>
            medmethoddirect.com →
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ textAlign: 'center', fontSize: '10.5px', color: INK_MUTED, lineHeight: 1.6 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, color: INK_SOFT, marginBottom: '6px', letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '9.5px' }}>
            MedMethod Direct · Your Path to Longevity
          </div>
          <div>Compounded medications are prepared by licensed pharmacies under prescription and are not FDA-approved. This document is informational and is not medical advice. Medication pricing only; for full program costs visit <a href={SITE} target="_blank" rel="noopener noreferrer" style={{ color: PINK_DEEP, fontWeight: 600 }}>medmethoddirect.com</a>.</div>

          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: `1px solid ${LINE}`, textAlign: 'left', maxWidth: '620px', marginLeft: 'auto', marginRight: 'auto' }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, color: INK_SOFT, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
              Brand-name pricing sources (verified June 2026)
            </div>
            <div style={{ display: 'grid', gap: '4px', fontSize: '10.5px' }}>
              <div>Wegovy injection — NovoCare: <a href="https://www.novocare.com/patient/medicines/wegovy.html" target="_blank" rel="noopener noreferrer" style={{ color: PINK_DEEP, fontWeight: 600 }}>novocare.com/patient/medicines/wegovy</a></div>
              <div>Wegovy pill (oral) — NovoCare Pharmacy: <a href="https://www.novocare.com/pharmacy/wegovy.html" target="_blank" rel="noopener noreferrer" style={{ color: PINK_DEEP, fontWeight: 600 }}>novocare.com/pharmacy/wegovy</a></div>
              <div>Zepbound injection — LillyDirect: <a href="https://zepbound.lilly.com/coverage-savings" target="_blank" rel="noopener noreferrer" style={{ color: PINK_DEEP, fontWeight: 600 }}>zepbound.lilly.com/coverage-savings</a></div>
              <div>Foundayo (orforglipron) — LillyDirect: <a href="https://www.lilly.com/lillydirect/medicines/foundayo" target="_blank" rel="noopener noreferrer" style={{ color: PINK_DEEP, fontWeight: 600 }}>lilly.com/lillydirect/medicines/foundayo</a></div>
            </div>
            <div style={{ marginTop: '8px', fontSize: '9.5px', color: INK_MUTED, fontStyle: 'italic' }}>
              Manufacturer prices change frequently and vary by dose and program eligibility. Confirm current pricing at the links above.
            </div>
          </div>
        </div>

      </div>
    </div>
    </>
  );
}