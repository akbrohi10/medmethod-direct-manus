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

- [x] Global: force all paragraph/description text to #444444, reduce dot-grid opacity to 3%
- [x] Section 1 Hero: full-width gradient divider line between hero and Section 2, enlarge right orb
- [x] Section 2 Cards: 32px internal padding, 56px icon circles, watermark numbers (01/02/03) at 4% opacity, fix body text color
- [x] Section 3 How It Works: 4px gradient top border strip, fix italic sub-labels to #888780
- [x] Section 4 Guidelines: vertically center left column, 40px card padding, gradient top accent bar on checklist card
- [x] Section 5 FAQ: 20px top/bottom row padding, lavender #F8F0FF 40% background wash, purple #7A1E7E question text when expanded
- [x] Section 6 CTA Banner: second white circle (10% opacity) top-right, stronger button shadow 0 6px 20px rgba(0,0,0,0.25)
- [x] Section 7 Form: card container (white, 1px #E0E0E0 border, 16px radius, shadow), 4px gradient top bar, MMD logo lockup, subtext above first field, styled inputs, gradient submit button
- [x] Run tests and save checkpoint

## Admin Dashboard — Mode-Filtered Stats

- [x] Add `stripeMode` column to payments table (enum: test | live)
- [x] Tag new payments with active mode at creation time in createDepositIntent
- [x] Filter listPayments by active mode (only show payments for current mode)
- [x] Filter stats cards (Total Payments, Revenue Collected) by active mode
- [x] Run tests and save checkpoint

## GHL Appointment Date Capture — Auto-Schedule $149 Charge

- [x] Option A: GHL webhook endpoint POST /api/ghl/booking-confirmed — match email to payment, schedule $149 charge
- [x] Option B: postMessage listener in LpConsultationModal2 — capture date from GHL iframe, call scheduleRemainingCharge
- [x] appointmentDate column already present in payments table (bigint, UTC ms)
- [x] scheduleRemainingCharge updated: publicProcedure, status/double-schedule guards, empty session token for Heartbeat
- [x] Run tests and save checkpoint (27 tests passing)

## Dr. Al-Deek Booking Page

- [x] Create dedicated booking page at /dr-aldeek-booking with doctor name + calendar embed

## Crawler-Detection Middleware for Social Media Link Previews

- [x] Create server/crawlerMiddleware.ts with bot user-agent detection (Facebook, Twitter, WhatsApp, iMessage, LinkedIn, Telegram, Slack, Discord)
- [x] Define per-route OG meta map (/, /dr-aldeek-booking, /lp/hrt, /lp/hrt2, /lp/glp1, state pages)
- [x] Return minimal HTML with correct OG/Twitter meta tags for detected bots
- [x] Mount middleware in server/_core/index.ts before static file serving
- [x] Write vitest tests for crawler middleware
- [x] Verify no regressions (pnpm test)
- [x] Save checkpoint

## /lp/hrt2 Pricing Copy Updates

- [x] Hero CTA: change button text from "Start Your Plan — Only $50 Today" to "Reserve Your Spot — $50 Deposit" and add subtext "$50 deposit today, $149 due at your visit — $199 total for Month 1."
- [x] Pricing card: add line under Month 1 $199 — "$199 total for Month 1 — $50 today to reserve your appointment, $149 due the day of your visit."
- [x] Add medication cost disclosure near pricing table
- [x] FAQ: add "How much does medication cost?" entry
- [x] Consistency check: all standalone "$50" mentions must be paired with deposit/total language
- [x] Save checkpoint

## New Landing Page /lp/hrt3

- [x] Create client/src/pages/LpHrt3.tsx with MedicalTeam hero + hrt2 sections from "How HRT Works" onward
- [x] Wire all CTAs to LpConsultationModal2 (same as /lp/hrt2)
- [x] Register /lp/hrt3 route in App.tsx
- [x] Save checkpoint
## Stripe Payment Webhook → GHL (payment_success)
- [x] Audit existing codebase: Stripe setup, existing webhook handlers, schema
- [x] Add payment_webhook_log table to drizzle/schema.ts (idempotency + attempt logging)
- [x] Run db:push migration and apply SQL via webdev_execute_sql
- [x] Create server/stripePaymentWebhook.ts — POST /api/webhooks/stripe-payment handler
- [x] Scope filter: only fires for /lp/glp1 and /lp/hrt3 (ALLOWED_LANDING_PAGES)
- [x] Idempotency: skip if transaction_id already delivered (success=1 row in DB)
- [x] Retry logic: exponential backoff, up to 3 attempts, logs every attempt
- [x] Flat JSON payload with all 14 fields always present (empty string not omitted)
- [x] Register route in server/_core/index.ts BEFORE express.json() for raw body
- [x] Add STRIPE_WEBHOOK_SECRET and GHL_PAYMENT_WEBHOOK_URL to env.ts
- [x] Write vitest tests (18 tests, all passing)
- [x] Send 2 test payloads to GHL — both HTTP 200 confirmed
- [x] Save checkpoint (version 4a621e4a)

## Mobile & UX Audit
- [x] ThankYou page: add "WHAT HAPPENS NEXT" heading above the 3 steps
- [x] ThankYou page: make calendar iframe height responsive (taller on mobile)
- [x] LpHrt2: add sticky mobile CTA (Book Now + Call Now) matching LpHrt3 and LpGlp1
- [x] LpHrt2: add hero-cta-sentinel div to trigger sticky CTA after scroll
- [x] crawlerMiddleware.ts: update GLP-1 description to include "GLP-1" keyword
- [x] crawlerMiddleware.test.ts: update tests to use .toContain() for flexible title matching
- [x] All 72 tests passing
- [x] Save checkpoint

## PayPal Payment Option

- [x] Add paypalSettings table to drizzle schema (test/live client ID + secret, active provider toggle)
- [x] Add paymentProvider field to payments table (stripe | paypal)
- [x] Run DB migration for new schema
- [x] Build PayPal server router (createOrder, captureOrder, scheduleRemainingCharge, chargeNow)
- [x] Build PayPal GHL webhook handler (mirrors stripePaymentWebhook.ts)
- [x] Build PayPal checkout UI component (PayPalButtons from @paypal/react-paypal-js)
- [x] Update LpConsultationModal2 to render Stripe or PayPal form based on active provider
- [x] Update AdminSettings: add PayPal settings tab, provider toggle, webhook URL display
- [x] All 72 tests passing

## WL2 Intake Form → GHL Webhook

- [x] Send completed `/lp/WL2` intake details to the supplied GHL webhook through a secure server-side endpoint
- [x] Preserve the existing payment and calendar-booking flow if the webhook is temporarily unavailable
- [x] Add automated coverage for the WL2 intake webhook payload and failure handling
- [x] Run tests and save checkpoint

## WL2 One-Time $15 Payment Flow

- [x] Create $15 one-time Stripe and PayPal payment procedures for `/lp/WL2` only
- [x] Store successful WL2 payments as `Fully Paid` with no remaining $149 balance or scheduled charge
- [x] Replace the shared $50/$149 payment forms only in the WL2 modal and update related payment copy
- [x] Add Vitest coverage and verify the existing payment flows remain unchanged
- [x] Run tests and save checkpoint

## WL2 Embedded Booking Step

- [x] Replace the final WL2 calendar step with the booking and follow-up content from `/thank-you2` inside the intake modal
- [x] Keep WL2 patients inside the modal after the $15 payment with no redirect to a separate page
- [x] Test the embedded booking flow and save checkpoint

## WL2 Embedded Booking Follow-Up

- [x] Return Stripe 3DS completions to the WL2 intake modal instead of `/thank-you2`
- [x] Restore WL2 booking prefill data and show the embedded final booking step after authentication
- [x] Add targeted coverage for the WL2 booking-step resume behavior, run tests, and save checkpoint

## WL2 Resume-Flow Validation

- [x] Add tests for persisted WL2 resume data, 3DS return parsing, and cleared resume state after confirmation
- [x] Route the WL2 modal through the tested resume helpers before opening embedded booking content
- [x] Run focused and full tests, then save checkpoint

## WL2 Payment-Step Performance

- [x] Identify and remove avoidable sequential loading before WL2 card fields render
- [x] Improve WL2 payment loading feedback without changing checkout behavior
- [x] Run tests and save checkpoint

## WL2 Preview Payment Skip

- [x] Restrict a WL2 payment-skip control to recognized preview environments
- [x] Add a preview-only button that opens the embedded booking step without charging a card
- [x] Test visibility rules, run tests, and save checkpoint

## WL2 Loading Performance

- [x] Audit WL2 images, fonts, scripts, and embedded calendar loading for avoidable delays
- [x] Optimize high-impact WL2 asset and third-party loading without visual changes
- [x] Validate performance improvements, run tests, and save checkpoint

## WL2 Intake Completion

- [x] Replace the Age field with Date of Birth and send the date to the WL2 GHL webhook
- [x] Require all relevant WL2 intake answers before allowing advancement
- [x] Add a clear scroll cue and completion state for lower intake questions
- [x] Test the improved intake flow and save checkpoint

## WL2 Intake Completion Follow-Up

- [x] Require or normalize the visible Height (in) input before WL2 progression
- [x] Add focused tests for the Date of Birth payload and full intake progression gate
- [x] Run full validation and save the WL2 intake completion checkpoint

## WL2 Post-Payment Thank-You Redirect

- [x] Remove the WL2 modal booking step and show only three intake progress steps
- [x] Redirect successful WL2 $15 payments, including Stripe 3DS returns, to `/thank-you2`
- [x] Preserve the WL2 payment webhook and test the post-payment redirect flow
- [x] Save checkpoint

## WL2 Post-Payment Redirect Validation

- [x] Extract and test the WL2 payment-success redirect and webhook handoff
- [x] Route both standard capture and Stripe 3DS success through the tested handoff
- [x] Run full validation and save the post-payment redirect checkpoint

## WL2 First-Step Usability Repair

- [x] Replace written WL2 scroll instructions with a visual-only scroll affordance
- [x] Simplify the WL2 Date of Birth selection experience
- [x] Fix the WL2 Next-button progression gate after required first-step fields are completed
- [x] Test the repaired first-step flow and save checkpoint

## WL2 First-Step UI Validation

- [x] Add focused coverage for the completed first-step Next-button state and visual scroll affordance
- [x] Run full tests and save the WL2 first-step usability checkpoint

## WL2 First-Step Component Validation

- [x] Add targeted component-source coverage for the WL2 Next-button and visual scroll affordance
- [x] Run full validation and save the WL2 first-step usability checkpoint

## WL2 Guided Missing-Field Validation

- [x] Identify the first missing required WL2 intake answer in form order
- [x] Show a clear notice, highlight the missing field, and scroll it into view when Next is attempted
- [x] Test the guided validation flow and save checkpoint

## WL2 GHL Field-Remapping Test

- [x] Send one updated, clearly labeled WL2 test intake with Date of Birth to the configured GHL webhook
- [x] Confirm delivery details for GHL field remapping

## WL2 Labs Helper Text

- [x] Remove the lab-sharing helper text shown after selecting “Yes, I have labs” on `/lp/WL2`
- [x] Validate the targeted UI change and save checkpoint

## WL2 Mobile Form Continuation

- [x] Remove competing mobile page actions while the WL2 intake modal is open
- [x] Strengthen the visual-only cue that additional required intake content continues below the fold
- [x] Validate the revised mobile intake experience and save checkpoint

## WL2 Intake Mobile Action Isolation

- [x] Hide the page-level Call Now and Book My Appt. sticky bar whenever the WL2 intake modal is open
- [x] Confirm the sticky bar remains visible on the landing page after the modal is closed
- [x] Run focused validation and save checkpoint

## WL2 Social-Proof Refinement

- [x] Tighten the social-proof section spacing and improve visual separation
- [x] Add a restrained brand-accent line and clearer dividers without adding cards
- [x] Validate the refined social-proof section and save checkpoint

## WL2 Social-Proof Statistic Copy

- [x] Change the displayed patient statistic from 10,000+ to 10K+ on `/lp/WL2`
- [x] Validate the targeted copy update and save checkpoint

## WL2 Patient Statistic Typography

- [x] Replace the 10K+ serif treatment with a clean bold sans-serif treatment
- [x] Tighten the supporting Patients Seen spacing and validate the adjustment
- [x] Save checkpoint

## WL2 Conversion-Focused Section Order

- [x] Remove the Your Customized Treatment Plan / ongoing-care section from `/lp/WL2`
- [x] Place Medication Pricing before How It Works on `/lp/WL2`
- [x] Validate the simplified section order and save checkpoint

## WL2 Thank-You Meta Purchase Tracking

- [x] Add Meta Pixel ID 1589326469554181 initialization and Purchase event to `/thank-you2` only
- [x] Add targeted coverage confirming the event is isolated to the WL2 thank-you page
- [x] Test the conversion event integration and save checkpoint

## WL2 Responsive Hero Alignment

- [x] Correct the tablet and mobile hero copy-to-image alignment on `/lp/WL2`
- [x] Remove unintended intermediate-layout whitespace while preserving the approved desktop hero
- [ ] Validate responsive hero composition and save checkpoint
