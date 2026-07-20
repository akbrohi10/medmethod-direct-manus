# Testimonial Update Task (separate task — not part of Stripe payment system)

- [ ] Audit current testimonial structure (how quotes are rendered, where they live in each page)
- [ ] Write 4-5 unique testimonials per state (8 states) with diverse personas
- [ ] Include wellness advisor accountability theme in several testimonials
- [ ] Persona variety: busy professional mom, executive, perimenopause, full menopause, weight loss seeker, post-GLP1 plateau, empty nester, fitness-focused
- [ ] Deploy state-specific testimonials to all 84+ city pages
- [ ] Verify TypeScript compiles at 0 errors
- [ ] Spot-check rendering on sample pages
- [ ] Save checkpoint

## Stripe Payment System (Admin Dashboard + /lp/hrt2)

- [x] Database schema: `stripe_settings` and `payments` tables created and migrated
- [x] Backend tRPC router: `server/routers/stripe.ts` with key management + payment intents
- [x] Admin dashboard: `/admin/settings` — Stripe key management (test/live toggle, key entry)
- [x] Admin dashboard: payments tab with all payment records
- [x] Stripe Elements integration: `StripePaymentForm.tsx` replaces mock card form in LpConsultationModal2
- [x] GHL webhooks preserved unchanged in LpConsultationModal2
- [x] All 11 vitest tests passing
- [x] Promote owner user to admin role in database — auto-assigned on first login via upsertUser (OWNER_OPEN_ID check)
- [x] Scheduled $149 charge: Heartbeat cron job to charge remaining balance on appointment date
  - /api/scheduled/charge-remaining Express handler (server/scheduledChargeHandler.ts)
  - scheduleRemainingCharge tRPC mutation creates Heartbeat cron at 09:00 UTC on appointment date
  - Handler mounted in server/_core/index.ts before tRPC middleware
  - scheduledChargePaymentCronTaskUid column added to payments table

## Super Admin Login System

- [x] Add bcrypt for password hashing
- [x] Add super_admin_credentials table to schema (email, passwordHash)
- [x] Seed super admin: akbrohi4567@gmail.com with strong hashed password
- [x] tRPC router: superAdmin.login mutation (email + password → JWT session, sa_session cookie)
- [x] tRPC router: superAdmin.logout mutation
- [x] tRPC router: superAdmin.me query (session check)
- [x] Build /admin/login page with email/password form
- [x] Update AdminSettings to accept super admin session (not just Manus OAuth admin)
- [x] Run tests and save checkpoint

## Brand Ambassador Page Design Refinements

- [x] Global: subtle dot-grid or gradient texture on #F9F9F9 sections, 80-100px section padding, body text #444444
- [x] Hero: gradient orbs (pink bottom-right, purple top-left), stat badges row, larger H1
- [x] Why Join Cards: copy update card 2, box shadows, icon tint, hover glow border, eyebrow label
- [x] How It Works: copy update step 3, thicker gradient line (3px), sub-labels per step, gradient wash background
- [x] Ambassador Guidelines: decorative gradient bar left of paragraph, gradient checkmarks, card container around checklist
- [x] FAQ: copy updates (2 items), left border accent on open item, animated chevron, row spacing
- [x] Closing CTA Banner: diagonal gradient, white button with purple text + shadow, abstract white circle shape
- [x] Ready to Apply form: MMD logo lockup, subtext above form, styled inputs, gradient submit button

## Brand Ambassador Page — Final Visual Polish Pass

- [ ] Global: force all paragraph/description text to #444444, reduce dot-grid opacity to 3%
- [ ] Section 1 Hero: full-width gradient divider line between hero and Section 2, enlarge right orb
- [ ] Section 2 Cards: 32px internal padding, 56px icon circles, watermark numbers (01/02/03) at 4% opacity, fix body text color
- [ ] Section 3 How It Works: 4px gradient top border strip, fix italic sub-labels to #888780
- [ ] Section 4 Guidelines: vertically center left column, 40px card padding, gradient top accent bar on checklist card
- [ ] Section 5 FAQ: 20px top/bottom row padding, lavender #F8F0FF 40% background wash, purple #7A1E7E question text when expanded
- [ ] Section 6 CTA Banner: second white circle (10% opacity) top-right, stronger button shadow 0 6px 20px rgba(0,0,0,0.25)
- [ ] Section 7 Form: card container (white, 1px #E0E0E0 border, 16px radius, shadow), 4px gradient top bar, MMD logo lockup, subtext above first field, styled inputs, gradient submit button
- [ ] Run tests and save checkpoint
