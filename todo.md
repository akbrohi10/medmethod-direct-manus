# Testimonial Update Task (separate task — not part of Stripe payment system)

- [x] Audit current testimonial task scope; canceled because reviews/testimonials must come from genuine, approved customer records
- [x] Do not write fabricated state-specific testimonials or fictional personas
- [x] Do not add unverified wellness-advisor claims to testimonials
- [x] Do not create fictional patient personas for testimonial content
- [x] Do not deploy fabricated testimonials to location pages
- [x] Verify TypeScript compiles at 0 errors
- [x] Confirm no testimonial rendering changes were made
- [x] Save checkpoint documenting the policy-safe cancellation

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
- [x] Validate responsive hero composition and save checkpoint

## WL2 Thank-You Meta Pixel Verification

- [x] Verify the deployed `/thank-you2` Meta Pixel initialization and Purchase event for Pixel ID 1589326469554181
- [x] Confirm the page event path needs no code repair; the sandbox browser blocks third-party Meta script execution
- [x] Validate the queued init and Purchase calls and save checkpoint

## WL2 Full Meta Pixel Bootstrap

- [x] Replace the `/thank-you2` tracking logic with the supplied full Meta Pixel bootstrap
- [x] Add PageView, Purchase, and no-script fallback tracking for Pixel ID 1589326469554181 on `/thank-you2` only
- [x] Validate the full tracking markup and save checkpoint

## WL2 Header-Based Meta Pixel Repair

- [x] Move the supplied Meta Pixel bootstrap into the static document header for `/thank-you2`
- [x] Remove duplicate page-level Pixel bootstrap while preserving the WL2 dataLayer event
- [x] Validate header-based PageView and Purchase markup and save checkpoint

## WL2 Meta Pixel Delivery Diagnosis

- [x] Trace live Meta Pixel runtime, requests, and GTM/sitewide tracking interactions on `/thank-you2`
- [x] Repair the confirmed tracking-delivery root cause without duplicating Pixel events
- [x] Validate the live event-delivery path and save checkpoint

## WL2 Navbar Logo Removal

- [x] Remove the clickable logo from the `/lp/WL2` navbar to prevent users navigating to homepage

## Meta Pixel Complete Removal

- [x] Remove Meta Pixel 1589326469554181 from static header (index.html)
- [x] Remove Meta Pixel from ThankYou2 component (useEffect)
- [x] Remove noscript pixel fallback from body
- [x] Update tests to verify pixel is fully removed
- [x] Preserve GTM dataLayer event (booking_complete_wl2) for future use

## Affiliate Ref Code in Stripe Metadata

- [x] Pass affiliate `ref` URL parameter into Stripe PaymentIntent metadata as `affiliate_code` for $50 deposit

## Care Team Booking Page

- [x] Create `/care-team-booking` page with embedded SendMeAPro calendar
- [x] Add header with logo, phone number, and Patient Login
- [x] Register route in App.tsx

## Complete Replit Migration Package

- [x] Inventory application runtime, database schema, hosted assets, secrets, integrations, and scheduled workflows
- [x] Confirm production medical-data security and hosting requirements; user selected empty tables/test data only with no live records
- [x] Create a schema-only MySQL migration package with no patient or payment records
- [x] Create an inventory and backup plan for public images, fonts, icons, and uploaded files
- [x] Prepare Replit-compatible setup files and a safe environment-variable template without secret values
- [x] Document database-data, storage, payment, webhook, authentication, scheduler, and domain migration steps
- [x] Validate the portable build and migration materials without connecting to the production database
- [x] Save a checkpoint and deliver the migration package

## Production Deployment Entrypoint Repair

- [x] Restore the production main-server bundle at `dist/index.js`
- [x] Preserve separate Replit helper bundles for sweep and super-admin seed commands
- [x] Validate TypeScript, tests, build output, and production startup on an isolated port
- [x] Save and deliver a deployment-ready checkpoint

## Replit Duplication Guide
- [x] Write a copy-paste Replit Agent prompt that preserves the existing application and migration scope
- [x] Write ordered setup instructions for code, public assets, empty MySQL schema, Secrets, payment test modes, webhooks, and the hourly sweep
- [x] Validate the guide against the current repository and migration archives
- [x] Save and deliver the Replit duplication guide

## Custom Domain Return from Replit to Manus

- [x] Inspect public DNS and HTTPS responses for `medmethoddirect.com` and `www.medmethoddirect.com`
- [x] Identify and document the stale Replit DNS records without changing email or verification records
- [x] Verify both hostnames route to the Manus deployment after DNS correction

## PayPal Settings Query Repair

- [x] Inspect the expected `paypal_settings` schema, query implementation, current database columns, and runtime error details
- [x] Clear the stale application database connection state without changing existing payment configuration data
- [x] Run the full regression suite and verify PayPal public settings retrieval
- [x] Verify the homepage and PayPal settings endpoint after the server repair

## Remove Male Page

- [x] Locate the `/male` route, page component, internal links, sitemap entries, and metadata references
- [x] Remove the `/male` page and all project references without affecting other routes
- [x] Verify `/male` returns the not-found page and run the full test/build checks
- [x] Save a publishable checkpoint for removing `/male` from the live website

## LegitScript Compliance Audit Review

- [x] Extract the complete LegitScript feedback from `MMD.pages`
- [x] Classify each finding by requirement, risk, affected URL, and required supporting evidence
- [x] Compare every finding with the current website without changing live content
- [x] Prepare a prioritized proposed change plan for user approval before implementation

## LegitScript Compliance Website Remediation

- [x] Define neutral replacement copy and enumerate all affected routes, shared components, and location templates
- [x] Temporarily unpublish `/blog/semaglutide-vs-tirzepatide-women-midlife` and remove its public references
- [x] Remove compounded-versus-brand pricing, affordability, and Wegovy/Zepbound comparison framing from the homepage and landing pages
- [x] Remove flagged quantified testimonials, hormone-linked weight-loss claims, and “Just results” from all affected pages
- [x] Replace repeated “same active ingredient” and compounded-affordability language across location pages and shared medication content
- [x] Add automated compliance regression checks for every explicitly prohibited claim
- [x] Validate affected routes, TypeScript, the complete test suite, and the production build
- [x] Save a publishable compliance-remediation checkpoint

## 2026-08-25 Compliance Instructions Gap Review

- [x] Extract every requirement from `MMD_Website_Update_Instructions_2026-08-25.docx`
- [x] Compare each requirement with the current website and completed LegitScript remediation
- [x] Classify each item as complete, partial, missing, conflicting, or requiring clarification
- [x] Prepare a no-change gap report for user approval before any implementation

## 2026-08-25 Compliance Instructions Implementation

- [x] Add the required permanent `/male` redirect to `/` and remove remaining hidden men’s-testosterone references
- [x] Replace every outdated 9-state/17-state list and remove Tennessee, New Jersey, Alabama, Washington State, and Ohio
- [x] Remove all prohibited brand names, body/muscle/result phrases, comparisons, and disallowed service categories from visible and hidden content
- [x] Audit and correct every remaining blog post, book page, metadata field, structured-data block, label, public index file, and legacy route
- [x] Add the exact compounded-medication and Florida women’s-testosterone disclosures wherever required
- [x] Restrict fitness-app copy to weight-loss pages using the exact approved Everfit wording
- [x] Repair or remove every broken, placeholder, misleading, or outdated footer link and label
- [x] Add automated compliance and redirect regression coverage
- [x] Validate all affected routes, footer links, TypeScript, full tests, production build, and representative page rendering
- [x] Produce the required five-section deletion report and save a publishable checkpoint

## Colleague-Facing Compliance Change Report

- [x] Collect reliable pre-update and post-update screenshots for representative website pages
- [x] Write a concise shareable summary of removed content, rewritten sections, redirects, licensing corrections, disclosures, and preserved functionality
- [x] Add labeled before-and-after visuals and validation evidence to the report
- [x] Quality-check the report against checkpoint `bb04542e` and deliver the report with supporting images

## Florida Women’s Testosterone Disclosure Placement

- [x] Inventory every page using the Florida women’s testosterone disclosure and identify clipped or misplaced instances
- [x] Move each disclosure beside relevant treatment content without changing the mandated wording
- [x] Verify desktop and mobile spacing, readability, exact wording, tests, and production build
- [x] Save and deliver the corrected disclosure-placement checkpoint

## Comprehensive Compliance Before-and-After Verification Package

- [x] Map every material compliance edit to matched screenshot evidence or technical verification
- [x] Build an isolated pre-compliance environment without altering the live site or current project
- [x] Capture matched historical and current screenshots for the representative homepage, locations, HRT, weight-loss, legal, blog, city-template, and removed-route pages
- [x] Document repeated city-page changes with template-level file counts, disclosure coverage, and compliance scan evidence
- [x] Collect redirect, metadata, sitemap, hidden-content, disclosure, test, and preserved-system evidence
- [x] Write and quality-check a requirement-by-requirement verification report tied directly to `MMD_Website_Update_Instructions_2026-08-25.docx`
- [x] Write and quality-check a separate report containing only improvements completed beyond the supplied requirements
- [x] Deliver both reports, supporting images, and the updated documentation checkpoint

## Exact 12-Jurisdiction Correction from Supplied Instructions

- [x] Replace Nevada, Oregon, and West Virginia with Georgia, Illinois, and Michigan in every visible and hidden licensing reference
- [x] Verify the exact approved list on the homepage, landing pages, locations, Terms, metadata, structured data, social proof, and public indexes
- [x] Update compliance regression tests to enforce the supplied jurisdiction list and reject the incorrect substitutions
- [x] Re-run TypeScript, all tests, production build, source scans, and representative page verification
- [x] Recapture affected current screenshots and update both verification reports before delivery

## Georgia, Illinois, and Michigan State Hub Pages

- [x] Audit all Nevada, Oregon, and West Virginia patient-service references while preserving the physician’s legitimate West Virginia education credential
- [x] Remove Nevada, Oregon, and West Virginia location pages, routes, links, metadata, structured data, social proof, sitemap, and public-index references
- [x] Build compliant Georgia, Illinois, and Michigan state hub pages using the approved MedMethod location template and exact required disclosures
- [x] Register the three new state routes and update the locations directory, navigation, sitemap, crawler metadata, social proof, and public indexes
- [x] Add route and compliance regression coverage for removed and added state routes
- [x] Validate desktop and mobile rendering, links, TypeScript, all tests, production build, and state-reference scans
- [x] Update verification documentation and save a publishable checkpoint

## Homepage and New State-Hub Compliance/UX Audit

- [x] Review the approved compliance requirements and define the homepage/state-hub audit criteria
- [x] Audit the homepage for content flow, CTA hierarchy, disclosures, navigation, readability, and mobile usability
- [x] Audit the locations directory and Georgia, Illinois, and Michigan hubs for compliance, coherence, SEO, links, conversion flow, and responsive layout
- [x] Validate findings with source review, route checks, browser screenshots, and automated scans without changing website content
- [x] Prepare a prioritized no-change audit report with recommended fixes for user approval

## Minimal Homepage Compliance Copy Corrections

- [x] Qualify the final homepage CTA so a prescription is described only as clinically appropriate rather than guaranteed
- [x] Replace quantified result timelines and broad benefit-versus-risk language in the homepage FAQ with neutral patient-specific wording
- [x] Confirm no state-page, layout, pricing, payment, booking, tracking, or integration changes are introduced
- [x] Run focused compliance checks, TypeScript, tests, production build, and homepage visual verification
- [x] Save and deliver the minimal homepage copy-only checkpoint

## Shipping Policy Page and Footer Link

- [x] Create a dedicated Shipping Policy page using the exact substantive content supplied in `Med_Method_Direct_Shipping_Policy1.pdf`
- [x] Register the public Shipping Policy route with appropriate page metadata and existing legal-page styling
- [x] Add a Shipping Policy link to the footer Legal & Compliance section without changing the footer design
- [x] Add regression coverage for the route, policy content, and footer link
- [x] Validate TypeScript, tests, production build, route response, footer navigation, and desktop/mobile rendering
- [x] Save and deliver the Shipping Policy update checkpoint

## Sitewide Licensing Count Wording

- [x] Find every customer-facing “12 jurisdictions” licensing-count reference
- [x] Replace the approved count wording with “12 states” while preserving the exact location list
- [x] Update regression coverage to enforce the new customer-facing wording
- [x] Validate affected pages, TypeScript, tests, production build, and responsive rendering
- [x] Save and deliver the sitewide licensing-count wording checkpoint

## Homepage Preview API Query Pattern Error

- [x] Reproduce the homepage `/?from_webdev=1` API query error from browser, network, and server logs
- [x] Trace “The string did not match the expected pattern” to the exact request, URL, or input source
- [x] Apply the smallest safe repair without changing unrelated homepage or payment behavior
- [x] Add focused regression coverage for the confirmed failure mode
- [x] Validate homepage runtime, affected API calls, TypeScript, tests, production build, and browser logs
- [x] Save and deliver the homepage API query repair checkpoint

## Homepage Medication Options Simplification

- [x] Simplify only the homepage medication-options introduction and two treatment cards
- [x] Remove repeated pricing, fulfillment, shipping, and generalized patient-protocol clutter from that homepage section
- [x] Use “FDA-approved alternatives” rather than prohibited brand-comparison terminology
- [x] Preserve the exact required compounded-medication disclosure without changing a word
- [x] Confirm no other page, pricing flow, booking flow, payment flow, or integration is modified
- [x] Add focused regression coverage and validate TypeScript, tests, production build, and desktop/mobile rendering
- [x] Save and present the homepage-only revision for user approval before applying it elsewhere

## Homepage Intake Other Option

- [x] Add one sixth homepage intake option labeled “Other” with no follow-up field
- [x] Preserve the existing five approved service choices and balanced two-column layout
- [x] Confirm “Other” is included in the existing `services_selected` GHL webhook value
- [x] Confirm no other modal step, question, payment, booking, or external integration changes
- [x] Add focused regression coverage and validate TypeScript, tests, production build, and desktop/mobile modal rendering
- [x] Save and deliver the homepage intake update

## Homepage Intake Live-Event Attribution Option

- [x] Add “Live event or webinar” between “Dr. Al-Deek’s book” and “Podcast” in the homepage intake attribution list
- [x] Preserve the existing optional attribution step, Skip action, Other behavior, and GHL payload mapping
- [x] Confirm no service-choice, question, payment, booking, or webhook endpoint changes
- [x] Interactively confirm the unchanged intake sequence advances normally without any new required field
- [x] Add focused regression coverage and validate TypeScript, tests, production build, and responsive rendering
- [x] Save and deliver the homepage attribution update

## Footer Services Column Removal

- [x] Remove the complete Services column and its five service links from every active website footer variant
- [x] Rebalance the remaining footer columns without changing their content or destinations
- [x] Confirm the removed service links remain available only where intentionally used outside the footer
- [x] Add focused regression coverage and validate TypeScript, tests, production build, footer links, and desktop/mobile rendering
- [x] Save and deliver the footer-only update

## Homepage LECTURE50 Referral Credit

- [x] Add a homepage-only Referral Code field to checkout with Apply Code feedback and no effect on shared landing-page checkout flows
- [x] Validate LECTURE50 securely on the server and apply a $50 consultation credit while preserving the $50 deposit
- [x] Reduce only the appointment-day balance from $149 to $99 for valid LECTURE50 payments; retain $149 for standard payments
- [x] Persist referral code, credit amount, total visit price, deposit, and remaining balance with each applicable payment
- [x] Apply the correct deferred charge for both Stripe and PayPal payment paths and prevent client-side amount tampering
- [x] Include referral-credit details in Stripe/PayPal metadata and the current GHL lead/payment payloads
- [x] Preserve standard checkout, payment, booking, scheduling, affiliate, WL2, and admin behavior
- [x] Add focused regression coverage and validate database migration, TypeScript, all tests, production build, payment APIs, and desktop/mobile checkout rendering
- [x] Save and deliver the homepage referral-credit checkout checkpoint
- [x] Confirm the homepage and intake modal render normally in preview; avoid creating a disposable live PayPal order during visual validation because the active provider is currently live
- [x] Confirm the refreshed homepage mounts the updated consultation modal normally without browser-console or network errors
- [x] Confirm the open homepage modal owns the isolated referral-pricing state before payment-provider rendering
- [x] Verify the desktop checkout shows the homepage-only Referral Code field above standard $199/$50/$149 pricing without creating a live PayPal order during inspection
- [x] Verify LECTURE50 updates the desktop checkout to a $149 total, $50 deposit, $99 later balance, and visible $50 referral credit without creating a live PayPal order or charge
- [x] Confirm the applied desktop checkout has no horizontal overflow and that browser-only interception prevented live PayPal and referral API writes during visual inspection
- [x] Verify the applied LECTURE50 checkout remains readable and unclipped at a simulated 375-pixel mobile width
- [x] Restore the browser’s original fetch behavior and remove all temporary validation-only styling after checkout inspection

## Retired Menopause Book Page Discovery Cleanup

- [x] Remove `/the-menopause-weight-loss-trap` from the active sitemap so search engines are no longer told it is an indexable page
- [x] Remove the obsolete `/book` client shortcut that points to the retired internal URL
- [x] Replace the remaining internal BookTeaser link with the existing external Barnes & Noble destination
- [x] Preserve the server-side HTTP 301 redirect from `/the-menopause-weight-loss-trap` to `/`
- [x] Add regression coverage for sitemap exclusion, route removal, external book linking, and redirect preservation
- [x] Validate TypeScript, all tests, production build, sitemap XML, live-style HTTP behavior, and absence of active internal discovery references
- [x] Save and deliver the retired-page discovery cleanup checkpoint
- [x] Defer Google Search Console sitemap resubmission at the user’s request; the live sitemap cleanup is already published and verified

## Auditor Follow-Up: Blog and Location FAQ Language

- [x] Locate the complete affected sentence or paragraph containing “improved body composition” and “protecting and building muscle mass” in the menopause weight-gain blog
- [x] Remove the full affected blog sentence or paragraph rather than relying on a disclaimer
- [x] Locate every shared and page-level occurrence of the hormonal weight gain, low energy, low libido, and hormonal imbalance FAQ language
- [x] Remove the full affected location FAQ language from all 84 remaining page-level duplicates
- [x] Add regression coverage that prohibits the auditor-flagged phrases in the blog and location-page sources
- [x] Validate TypeScript, all 157 tests, production build, source-wide phrase scans, affected blog rendering, and representative location pages
- [x] Save and deliver the auditor-requested compliance-removal checkpoint

## Website Loading-Speed and Mobile-Usability Audit

- [x] Audit six representative live journeys only: homepage, locations directory, Georgia state hub, Alexandria city page, menopause weight-gain blog, and `/lp/WL2`
- [x] Inspect the shared state-hub and city-page templates once rather than loading every individual location URL
- [x] Measure response timing, page weight, Core Web Vitals indicators, render-blocking work, image loading, and third-party impact
- [x] Check desktop and 375-pixel mobile rendering for overflow, clipping, readability, tap targets, navigation, and layout stability
- [x] Inspect fresh browser, network, and server logs for runtime or API errors during representative page loads
- [x] Classify findings by high, medium, and low priority without changing website code
- [x] Deliver a concise no-change audit with only clearly justified optimization recommendations

## Additional LegitScript Auditor Remediation

- [x] Remove the flagged visceral-fat, insulin-sensitivity, root-cause, and compounded semaglutide/tirzepatide benefit claims from the menopause weight-gain article
- [x] Remove the flagged days-to-weeks, transformative, hormone-optimization, and combined hormone/GLP-1 benefit claims from the food-noise article
- [x] Remove Virtual Urgent Care from every homepage service reference, including hidden metadata or structured content
- [x] Neutralize the homepage phrases “come out of it stronger,” “fix what’s actually happening inside,” and “feel like yourself again” without redesigning the page
- [x] Review the supplied homepage title and description; retain them because they identify approved services and do not contain the auditor-flagged outcome claims
- [x] Unpublish the incomplete hormone-therapy weight/sleep/metabolism article from its route, source, blog registry, links, sitemap, and public discovery while preserving a permanent redirect to `/blog`
- [x] Add focused regression coverage for all newly prohibited claims, removed service references, metadata, and retired article discovery
- [x] Validate TypeScript, all 159 tests, production build, source scans, route behavior, and desktop/mobile rendering of affected public pages
- [x] Save and deliver the auditor-requested compliance update

## Thank-You Remaining-Balance Notice

- [x] Change only `/thank-you` to say “Your remaining balance will be charged on the day of your appointment. No surprises.”
- [x] Remove the displayed dollar amount from that notice because the remaining balance may vary
- [x] Preserve `/thank-you2`, checkout totals, LECTURE50 credit logic, deferred-charge amounts, payment scheduling, and webhook behavior
- [x] Add focused regression coverage and validate TypeScript, all 161 tests, production build, and desktop/mobile `/thank-you` rendering
- [x] Save and deliver the `/thank-you` wording-only checkpoint

## Live Webinar Hero-Only Landing Page

- [x] Create a new public route at `/live-webinar`
- [x] Build only the hero section; do not add section two, footer expansion, registration workflow, database fields, or webhook behavior
- [x] Use the approved headline: “Women are taking the TIME to learn about Perimenopause & Menopause. Are You?”
- [x] Include Dr. Jumana Al-Deek’s physician authority line and authorship of *The Menopause Weight Loss Trap*
- [x] Add a polished speaking-event video placeholder that can be replaced after the final video is uploaded
- [x] Include a clear Reserve My Seat CTA placeholder without inventing event date, time, capacity, or registration behavior
- [x] Add appropriate page title, description, canonical URL, and educational-event disclaimer
- [x] Add focused route/content regression coverage and validate TypeScript, all 165 tests, production build, and desktop/mobile rendering
- [x] Save and present the hero-only page for review before building any additional section

## Live Webinar Masterclass-Style Hero Revision

- [x] Replace the soft split-page composition with one bold, unified masterclass-style hero panel
- [x] Position the speaking-event video placeholder on the left where the reference presenter appears
- [x] Overlay the approved “Women are taking the TIME…” message on the left video placeholder
- [x] Place the webinar title, concise supporting copy, Dr. Al-Deek authority details, and Reserve My Seat CTA on the right
- [x] Keep the page hero-only with no form, date, countdown, media logos, false scarcity, footer expansion, or section two
- [x] Preserve noindex review status, canonical metadata, educational disclaimer, and placeholder-only CTA behavior
- [x] Update focused regression coverage and validate TypeScript, all 165 tests, production build, HTTP 200, and desktop/mobile rendering
- [x] Save and present the revised hero for approval before adding any additional page section

## Live Webinar Supplied-Mockup Recreation

- [x] Rebuild `/live-webinar` to closely match the supplied light cream editorial mockup rather than the dark masterclass concept
- [x] Preserve the mockup’s headline hierarchy, complete symptom list, conversation banner, event-details row, CTA, trust row, video area, and physician authority card
- [x] Use clearly labeled placeholders for the speaking-event video, Dr. Al-Deek photo, book image, date, and time
- [x] Keep the supplied draft wording unchanged for visual review, including Low Energy and Low Libido, until the user separately approves compliance copy revisions
- [x] Keep the page hero-only, registration inactive, and noindex with no database, webhook, payment, countdown, or additional section
- [x] Update focused regression coverage and validate TypeScript, all 165 tests, production build, HTTP 200, and desktop/mobile visual fidelity
- [x] Save and present the mockup-matched draft for user review before replacing placeholders or changing copy

## Live Webinar Balanced Conversion Hero

- [x] Keep “WOMEN ARE” on one desktop line and reduce headline scale enough to improve visual balance
- [x] Arrange the upper row as headline/symptoms beside the speaking-event video placeholder
- [x] Arrange the lower row as the physician authority card beside the event details, CTA, and one concise trust line
- [x] Move the primary CTA higher so it appears within the initial desktop viewport on standard laptop screens
- [x] Remove repeated Free and Live Online trust labels while retaining the event details and Live Q&A message
- [x] Preserve all current draft wording and placeholders, inactive registration, noindex metadata, educational disclaimer, and hero-only scope
- [x] Update focused regression coverage and validate TypeScript, all 166 tests, production build, HTTP 200, and desktop/mobile hierarchy
- [x] Save and present the balanced hero for conversion review before replacing assets or adding section two

## Live Webinar Video Integration

- [x] Inspect the supplied speaking-event video: 85.8 seconds, 1080×1080 H.264/AAC MOV, 135 MB original; prepare an 8.2 MB 720×720 H.264/AAC MP4 for browser delivery
- [x] Note that the supplied video contains the embedded phrase “Feel Like Yourself Again”; keep the webinar page noindex and flag this for compliance review before public launch
- [x] Copy the source video outside the project and upload the web-ready MP4 and poster to permanent project storage
- [x] Replace only the `/live-webinar` video placeholder with a responsive, accessible player
- [x] Keep playback user-initiated with native controls, plays-inline behavior, metadata preloading, and no autoplay with sound
- [x] Supersede the initial user-initiated setting with reliable muted autoplay while retaining inline playback, visible controls, and user-controlled sound; subsequently superseded by the user’s audible-autoplay request
- [x] Replace muted autoplay with an immediate sound-on autoplay attempt while retaining visible controls and a clear play fallback when the browser blocks audible autoplay; subsequently refined to visibility-based playback
- [x] Attempt sound-on playback when the video is substantially visible, pause when it leaves view, resume when it returns, and retain the Play Video With Sound fallback when browser policy blocks autoplay
- [x] Preserve the balanced hero, all current copy, photo/book/date/time placeholders, inactive registration, noindex metadata, and hero-only scope
- [x] Verify the square video and controls remain centered, readable, and unclipped in both desktop and 375-pixel mobile layouts
- [x] Verify the browser-policy Play Video With Sound fallback is prominent, readable, and comfortably tappable on desktop and mobile
- [x] Update focused regression coverage and validate TypeScript, all 166 tests, production build, byte-range video delivery, HTTP 200, and desktop/mobile playback layout
- [x] Verify sound-on playback while substantially visible, pause after scrolling out of view, and audible resume after returning to view in a controlled Chromium behavior test
- [x] Save and deliver the webinar video integration checkpoint

## Live Webinar Book-Cover Integration

- [x] Inspect the supplied 550×724 PNG book-cover image without altering or regenerating the artwork
- [x] Copy the source image outside the project, verify an identical SHA-256 checksum, and upload the unchanged 725,822-byte PNG to permanent project storage
- [x] Replace only the Book Image Placeholder on `/live-webinar` with the supplied cover, descriptive alt text, lazy loading, and asynchronous decoding
- [x] Preserve the authority-card layout, video behavior, doctor-photo/date/time placeholders, inactive registration, noindex metadata, and hero-only scope
- [x] Update focused regression coverage and validate TypeScript, all 166 tests across 33 files, production build, permanent 725,822-byte PNG delivery with matching checksum, HTTP 200, clean runtime logs, and desktop/mobile rendering
- [x] Save and deliver the webinar book-cover integration checkpoint

## Live Webinar Book-Cover Size and Frame Refinement

- [x] Enlarge the existing supplied book cover in the physician authority card
- [x] Remove the surrounding white card, border, padding, and frame while preserving the cover artwork itself
- [x] Preserve all other webinar content, hierarchy, video behavior, remaining placeholders, inactive registration, noindex metadata, and hero-only scope
- [x] Run focused coverage, TypeScript, and desktop/mobile rendering checks; the interim opaque-cover crop was superseded by the user-supplied transparent version before full validation
- [x] Do not checkpoint the interim opaque-cover crop; replace it with the user-supplied transparent artwork in the next refinement

## Live Webinar Transparent Book-Cover Refinement

- [x] Preserve the newly supplied 1060×1484 transparent 1,967,503-byte RGBA PNG unchanged outside the project, verify its matching SHA-256 checksum, and upload it to permanent project storage
- [x] Replace the current opaque book asset with the new transparent version while keeping the larger frameless presentation
- [x] Preserve all other webinar content, hierarchy, video behavior, remaining placeholders, inactive registration, noindex metadata, and hero-only scope
- [x] Update focused regression coverage and validate TypeScript, all 166 tests across 33 files, production build, permanent 1,967,503-byte PNG delivery with matching SHA-256 checksum, HTTP 200, clean runtime logs, and desktop/mobile rendering
- [x] Save and deliver the transparent book-cover checkpoint

## Live Webinar Video and Symptom Hierarchy Revision

- [x] Raise the webinar video within the upper hero composition so it aligns more closely with the headline
- [x] Move the complete existing symptom prompt and list beneath the headline-and-video row without changing its wording
- [x] Preserve CTA visibility, video playback behavior and fallback, authority card, transparent book cover, remaining placeholders, inactive registration, noindex metadata, and hero-only scope
- [x] Update focused regression coverage and validate TypeScript, all 166 tests across 33 files, production build, HTTP 200, clean runtime logs, desktop/mobile order, and the unchanged visibility-based video playback behavior and fallback
- [x] Save and deliver the approved webinar hierarchy checkpoint

## Live Webinar Video-Only Replacement

- [x] Inspect and archive the newly supplied 141,027,877-byte, 85.9-second, 1080×1080 H.264/AAC MOV unchanged outside the project with matching SHA-256 checksum
- [x] Prepare a 7,483,620-byte 720×720 H.264/AAC web MP4 and 720×720 poster, upload both to permanent project storage, and retain the unchanged original outside the project
- [x] Replace only the current `/live-webinar` video and poster asset references
- [x] Preserve the current layout, copy, video controls, sound-on autoplay attempt, 60% visibility pause/resume behavior, sound fallback, placeholders, inactive registration, noindex metadata, and hero-only scope
- [x] Update focused regression coverage and validate TypeScript, all 166 tests across 33 files, production build, exact permanent media delivery with byte ranges, HTTP 200, clean runtime logs, desktop/mobile rendering, and the unchanged 60%-visibility playback and sound-fallback logic
- [x] Save and deliver the webinar video-only replacement checkpoint

## Live Webinar Headshot-Only Replacement

- [x] Inspect and archive the newly supplied 1254×1254 RGB PNG headshot unchanged outside the project; verify its 1,866,276-byte size and matching SHA-256 checksum
- [x] Upload the unchanged supplied headshot to permanent project storage
- [x] Replace only the `Dr. Photo Placeholder` on `/live-webinar` with the supplied headshot and descriptive alternative text
- [x] Preserve the current layout, copy, video and autoplay behavior, symptom band, transparent book cover, event placeholders, inactive registration, noindex metadata, and hero-only scope
- [x] Update focused regression coverage and validate TypeScript, all 166 tests across 33 files, production build, exact permanent 1,866,276-byte image delivery with matching SHA-256 checksum, HTTP 200, clean runtime logs, and desktop/mobile rendering
- [x] Save and deliver the webinar headshot-only replacement checkpoint

## Live Webinar Zoom RSVP Banner

- [x] Add a visually distinct full-width banner above the existing `/live-webinar` hero content
- [x] Use only the approved banner copy: `LIVE ON ZOOM` and `RSVP NOW — SAVE YOUR FREE SPOT`
- [x] Make the live Zoom format and RSVP action immediately clear on desktop and mobile without unverified scarcity language
- [x] Preserve all existing hero copy, replacement video and autoplay behavior, symptom band, headshot, transparent book cover, event placeholders, inactive registration, noindex metadata, disclaimer, and hero-only scope
- [x] Update focused regression coverage and validate TypeScript, all 166 tests across 33 files, production build, HTTP 200, clean runtime logs, and desktop/mobile banner hierarchy and rendering
- [x] Save and deliver the standalone Zoom RSVP banner checkpoint

## Live Webinar Mobile Zoom RSVP Banner Refinement

- [x] Restyle only the mobile banner to use the supplied stacked hierarchy: `LIVE ON ZOOM`, `RSVP NOW`, divider, and `SAVE YOUR FREE SPOT!`
- [x] Emphasize `LIVE` and `FREE SPOT!` with the brand-pink accent against a deep-purple mobile banner
- [x] Preserve the current compact horizontal desktop banner at the `sm` breakpoint and above
- [x] Preserve all other webinar copy, media, autoplay behavior, symptom band, authority card, event placeholders, inactive registration, noindex metadata, disclaimer, and hero-only scope
- [x] Update focused regression coverage and validate TypeScript, all 166 tests across 33 files, production build, HTTP 200, clean runtime logs, reference-inspired 375px mobile rendering, and preserved desktop presentation
- [x] Save and deliver the mobile Zoom RSVP banner refinement checkpoint

## Live Webinar Desktop Authorship Alignment Repair

- [x] Keep `Author of` and *The Menopause Weight Loss Trap* in one continuous credential text flow and prevent the `Author of` label from splitting on desktop
- [x] Preserve the exact authorship wording and existing mobile authority-card presentation
- [x] Preserve all other webinar layout, banner, copy, media, autoplay behavior, symptom band, headshot, book cover, event placeholders, inactive registration, noindex metadata, disclaimer, and hero-only scope
- [x] Update focused regression coverage and validate TypeScript, all 166 tests across 33 files, production build, HTTP 200, clean runtime logs, corrected desktop text flow, and preserved mobile authority-card rendering
- [x] Save and deliver the desktop authorship-alignment repair checkpoint

## Live Webinar Mobile Inline-Playback Repair

- [x] Prevent the webinar video from opening the device’s native full-screen player when started on supported mobile browsers
- [x] Keep playback embedded inside the `/live-webinar` video frame with standard and WebKit inline-playback attributes plus native full-screen, picture-in-picture, and remote-playback suppression
- [x] Preserve native controls, the sound-on autoplay attempt, 60% visibility pause/resume behavior, blocked-autoplay fallback, video/poster assets, layout, and all page content
- [x] Add focused regression coverage and validate TypeScript, all 166 tests across 33 files, production build, compiled standard/WebKit inline safeguards, HTTP 200, clean runtime logs, embedded 375px rendering, and unchanged desktop layout
- [x] Save and deliver the mobile inline-playback repair checkpoint

## Live Webinar Educational Content and RSVP Section

- [x] Add a polished second section beneath the current hero using the supplied “Understand What’s Really Happening to Your Body After 35” introduction
- [x] Include the supplied six-item `What You’ll Learn` list without omitting or silently rewriting any user-provided point
- [x] Add the supplied informed-care message, live Q&A invitation, `FREE LIVE WEBINAR • LIMITED TO THE FIRST 100 RSVPs` line, and `Reserve Your Free Spot` CTA
- [x] Keep the new CTA inactive with the existing coming-soon feedback until registration is separately approved
- [x] Preserve the hero, Zoom banner, inline video and autoplay behavior, symptom band, headshot, book cover, event placeholders, noindex metadata, and educational disclaimer
- [x] Update focused regression coverage for exact content, all six learning outcomes, second-section scope, inactive registration, and preserved review safeguards
- [x] Validate TypeScript, all 167 tests across 33 files, production build, HTTP 200, clean runtime logs, and final desktop/mobile rendering including the required testosterone disclosure
- [x] Save and deliver the webinar educational-content section checkpoint

## Live Webinar As Seen In Social Proof

- [x] Preserve and use the supplied NTD and Yahoo Health files; retrieve clean logo assets for Flow Space, SingleCare, Scary Mommy, and Daily Mail because their repeated `imgo.jpg` uploads overwrote one another
- [x] Prepare and upload deployment-safe permanent logo assets outside the project directory without fabricating, redesigning, recoloring, or adding outlets
- [x] Add a compact static `As Seen In` section between the current hero and the educational section
- [x] Use one balanced desktop logo row and a readable mobile grid with accurate alternative text and no implied endorsement language
- [x] Preserve every existing webinar section, copy, media, autoplay and inline-playback behavior, inactive registration, noindex metadata, disclosures, and review safeguards
- [x] Add focused regression coverage and validate all six permanent logo assets, TypeScript, all 168 tests across 33 files, production build, HTTP 200, fresh browser/network logs, and final desktop/mobile rendering
- [x] Save and deliver the webinar As Seen In checkpoint

## Live Webinar Slim As Seen In Strip Refinement

- [x] Replace the individual white logo cards with one slim full-width purple media strip matching the supplied reference direction
- [x] Present all six existing outlet logos directly in a consistent monochrome light treatment without changing outlet names or adding new brands
- [x] Keep one compact logo row on desktop and a proportionate wrapped mobile treatment without horizontal overflow
- [x] Preserve the section’s position between the hero and educational content plus every other webinar element and behavior
- [x] Update focused regression coverage and validate TypeScript, all 168 tests across 33 files, production build, all six permanent monochrome assets, HTTP 200, clean runtime logs, the slim one-row desktop strip, and compact two-row mobile treatment
- [x] Save and deliver the slim As Seen In strip checkpoint

## Live Webinar Featured In Heading Refinement

- [x] Replace only the social-proof heading copy from `As Seen In` to `Featured In`
- [x] Make the heading larger, bolder, solid white, and easy to read on desktop and mobile while keeping the strip compact
- [x] Preserve the purple strip, all six monochrome outlet logos, section placement, and every other webinar element and behavior
- [x] Update focused regression coverage and validate TypeScript, all 168 tests across 33 files, production build, HTTP 200, clean current runtime logs, clear Featured In heading, and preserved desktop/mobile logo strip
- [x] Save and deliver the Featured In heading refinement checkpoint

## Live Webinar 2 Lean Reference Variation

- [x] Create a new review-only route at `/live-webinar2` without changing `/live-webinar`
- [x] Match the supplied lean reference structure with a slim brand bar, centered webinar promise, concise supporting line, dominant RSVP action, event row, and compact video/learning-content split
- [x] Reuse the current approved webinar video, poster, learning content, physician identity, and six monochrome Featured In logos without duplicating media files
- [x] Add a clearly labeled non-running countdown placeholder that displays neutral placeholder values and does not imply a real deadline until the event date is provided
- [x] Keep all RSVP actions inactive with coming-soon feedback, and retain `noindex, nofollow`, educational disclaimer, required testosterone disclosure, and review-only status
- [x] Place the compact Featured In strip at the bottom of `/live-webinar2`
- [x] Register the new route and add focused regression coverage for route isolation, lean structure, placeholder countdown, inactive registration, reused assets, and review safeguards
- [x] Validate TypeScript, all 174 tests across 34 files, production build, `/live-webinar2` and unchanged `/live-webinar` HTTP 200 responses, compiled inline-video safeguards, clean current runtime logs, final desktop/mobile rendering, placeholder countdown, disclosures, and bottom Featured In strip
- [x] Save and deliver the `/live-webinar2` variation checkpoint

## Live Webinar 2 Compact Disclosure Footnote

- [x] Remove only the large Medication Disclosures card from `/live-webinar2`
- [x] Place the exact required testosterone disclosure beneath the Featured In logos as a visually minimal but readable legal footnote
- [x] Preserve the exact mandated wording with 9px mobile and 10px larger-screen text, 80% white contrast, and readable line height
- [x] Preserve `/live-webinar`, the `/live-webinar2` layout and content, countdown placeholder, inactive RSVP actions, video behavior, logos, noindex metadata, and all other safeguards
- [x] Update focused regression coverage and validate compliance tests, TypeScript, all 174 tests across 34 files, production build, `/live-webinar2` and unchanged `/live-webinar` HTTP 200 responses, clean current logs, and desktop/mobile rendering of the compact readable footnote beneath Featured In
- [x] Save and deliver the compact disclosure-footnote checkpoint

## Live Webinar 2 Disclosure Separation

- [x] Move the exact testosterone disclosure completely outside and below the purple Featured In footer
- [x] Present the disclosure on a separate neutral background so it cannot be interpreted as part of the media-feature section
- [x] Preserve the exact mandated wording and compact readable 9px mobile/10px larger-screen typography
- [x] Preserve `/live-webinar`, every other `/live-webinar2` element and behavior, inactive RSVP actions, noindex metadata, and all review safeguards
- [x] Update focused regression coverage and validate compliance tests, TypeScript, all 174 tests across 34 files, production build, `/live-webinar2` and unchanged `/live-webinar` HTTP 200 responses, zero current browser or first-party network errors, no new server errors, and desktop/mobile rendering of the compact neutral footnote outside Featured In
- [x] Save and deliver the separated disclosure-footnote checkpoint

## Live Webinar 2 Top-Header Removal

- [x] Remove only the dark MedMethod / Live Education header from the top of `/live-webinar2`
- [x] Rebalance the opening white-space so the Free Live Webinar hero begins cleanly at the top of the card
- [x] Preserve `/live-webinar`, all `/live-webinar2` copy, countdown placeholder, inactive RSVP actions, inline video behavior, Featured In section, separated disclosure, noindex metadata, and review safeguards
- [x] Update focused regression coverage and validate TypeScript, all 174 tests across 34 files, production build, `/live-webinar2` and unchanged `/live-webinar` HTTP 200 responses, zero current browser, first-party network, or new server errors, and desktop/mobile rendering with the hero beginning cleanly after header removal
- [x] Save and deliver the `/live-webinar2` top-header removal checkpoint

## Live Webinar 2 Upper-Page Balance Refinement

- [x] Recompose the desktop headline into two intentional balanced lines while preserving its exact wording and natural mobile wrapping
- [x] Tighten only the upper hero’s vertical spacing between the webinar label, headline, supporting copy, CTA, and event row
- [x] Visually unify the Live on Zoom date block and placeholder countdown as one centered event-details composition
- [x] Preserve `/live-webinar`, all `/live-webinar2` wording, video and autoplay behavior, countdown placeholder status, inactive RSVP actions, learning content, Featured In section, separated disclosure, noindex metadata, and safeguards
- [x] Update focused regression coverage and validate TypeScript, all 174 tests across 34 files, production build, `/live-webinar2` and unchanged `/live-webinar` HTTP 200 responses, zero current browser, first-party network, or new server errors, and desktop/mobile rendering with balanced headline wrapping, tighter upper spacing, and a unified event row
- [x] Save and deliver the `/live-webinar2` upper-page balance checkpoint

## Live Webinar 2 Revision-Prompt Implementation

- [x] Change every visible age reference on `/live-webinar2` from 35 to 40 and add the exact author byline with the book title italicized
- [x] Add the existing MedMethod Direct logo, a non-underlined uppercase webinar label, and the line `Live and free — for women in Florida.` above the fold
- [x] Add an inline First Name and Email form as a clearly inactive review element, plus recording and Privacy Policy copy, without any webhook or data submission
- [x] Create one editable webinar-event configuration for the date display and future countdown, retain visible bracketed event tokens, and keep the timer non-running until real details are provided
- [x] Move the compact Featured In strip directly below the first CTA/form area and preserve all six existing monochrome logos
- [x] Add a presenter block using the existing headshot and book cover, a visible `[CREDENTIALS — BOARD CERTIFICATION, SPECIALTY, YEARS IN PRACTICE]` token, and the exact author identification
- [x] Reduce What You’ll Learn from six points to the four supplied points in the exact requested order
- [x] Add a visible `Watch: [VIDEO LENGTH]` label, preserve a minimum 44px play target and the current inline autoplay/pause safeguards
- [x] Make every CTA read `Reserve My Free Spot`, keep every action consistently focused on the inactive top form, and add a final CTA above the disclaimers
- [x] Preserve `noindex, nofollow`, the exact educational and testosterone disclosures, `/live-webinar`, all existing media assets, and the review-only status
- [x] Document remaining bracketed tokens in source (`[DAY]`, `[MONTH]`, `[DATE]`, `[TIME]`, `[TIMEZONE]`, `[DURATION]`, `[VIDEO LENGTH]`, and `[CREDENTIALS — BOARD CERTIFICATION, SPECIALTY, YEARS IN PRACTICE]`) and add focused regression coverage for the complete revision prompt
- [x] Validate 390px-first rendering, 1440px desktop layout, TypeScript, all 176 tests across 34 files, production build, `/live-webinar2` and unchanged `/live-webinar` HTTP 200 responses, compiled inactive-form and inline-video safeguards, zero current server or browser errors, only expected status-0 third-party Google tracking entries, and preserved page behavior
- [x] Save and deliver the revised `/live-webinar2` checkpoint

## Live Webinar 2 Second Revision Prompt — Nationwide Education

- [x] Rebuild the `/live-webinar2` hero into the requested 55/45 desktop text-and-video split and the specified mobile stacking order, using 16:9 video only on the smallest viewport to fit the logo-through-video sequence
- [x] Use the exact age-35+ webinar audience eyebrow, revised two-line hero promise, author subheadline, and nationwide educational availability treatment without implying clinical availability
- [x] Add the inactive two-field form, recording/privacy lines, date/time token line, and primary CTA in the requested hero order
- [x] Move the countdown into a slim full-width bar below the hero and drive date/time/timezone display from one editable configuration while retaining visible unfilled tokens
- [x] Move Featured In below the countdown bar, preserve the thin mobile-readable strip, and retain all six existing outlet logos
- [x] Add the compact presenter strip under the desktop video and the fuller presenter block beneath four revised learning bullets using existing real media plus visible credential tokens
- [x] Add the requested video-length label and retain the current autoplay and inline-playback behavior until the user revisits it
- [x] Preserve inactive registration, noindex review status, exact educational disclaimer, separate exact testosterone sentences, and replace only the outdated availability sentence with `[APPROVED AVAILABILITY DISCLAIMER]`
- [x] Keep `/live-webinar` unchanged and prevent new external links other than the existing Privacy Policy link
- [x] Document all bracketed tokens and their locations in `docs/Live_Webinar2_Remaining_Tokens.md` and add focused regression coverage for the complete second revision prompt
- [x] Validate 390px-first rendering, desktop layout, TypeScript, all 177 tests across 34 files, production build, `/live-webinar2` and unchanged `/live-webinar` HTTP 200 responses, compiled inactive-form, availability-token, and inline-video safeguards, zero current server/browser/first-party 5xx errors, and preserved current video behavior
- [x] Save and deliver the second `/live-webinar2` revision checkpoint

## Live Webinar 2 Countdown Placement Refinement

- [x] Move the existing dormant countdown bar above the `/live-webinar2` hero video while preserving the review-only state, responsive layout, inactive form, disclosures, Featured In placement, current video behavior, and unchanged `/live-webinar`
- [x] Update focused regression coverage and validate desktop/mobile rendering, route isolation, TypeScript, all 177 tests across 34 files, production build, both webinar HTTP 200 responses, and current runtime logs with no browser or first-party 5xx errors
- [x] Save and deliver the countdown-placement refinement checkpoint

## Live Webinar 2 Countdown Visual Refinement

- [x] Restyle the countdown above the `/live-webinar2` video as a simple modern panel matching the supplied reference: light surface, compact clock label, bold four-part dark clock, and restrained inactive-state note
- [x] Preserve the countdown’s existing inactive event configuration, readable mobile layout, video placement and behavior, inactive form, Featured In strip, disclosures, noindex review status, and unchanged `/live-webinar`
- [x] Update focused regression coverage and validate responsive rendering, TypeScript, all 178 tests across 34 files, production build, both webinar routes, and current runtime logs with no browser or first-party 5xx errors
- [x] Save and deliver the refined countdown visual checkpoint

## Live Webinar 2 Opening Simplification

- [x] Remove the MedMethod logo from the `/live-webinar2` opening and tighten the top spacing so the webinar label becomes the first visual element
- [x] Preserve the primary headline and purple promise while tightening their mobile and desktop spacing and line-height
- [x] Replace the long opening doctor/book paragraph with `A free educational webinar with Dr. Jumana Al-Deek.` and retain the full author/book identification in the existing presenter section
- [x] Move the nationwide educational availability line out of the opening copy stack to a quieter position below the video/form area without implying nationwide clinical availability
- [x] Preserve the countdown above the video, inactive form and event tokens, current video behavior, Featured In strip, disclosures, noindex review status, and unchanged `/live-webinar`
- [x] Update focused regression coverage and validate responsive hierarchy, TypeScript, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current runtime logs with no browser or first-party 5xx errors
- [x] Save and deliver the simplified opening checkpoint

## Live Webinar 2 Four-Box Countdown Simplification

- [x] Keep only the four dark countdown value boxes and their Days, Hours, Minutes, and Seconds labels above the `/live-webinar2` video
- [x] Remove the countdown panel background, border, clock icon, Event Countdown label, timezone text, divider, and inactive activation note
- [x] Preserve the existing dormant timing configuration, countdown values, placement above the video, responsive layout, inactive form, video behavior, Featured In strip, disclosures, noindex review status, and unchanged `/live-webinar`
- [x] Update focused regression coverage and validate responsive rendering, TypeScript, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current runtime logs with no browser or first-party 5xx errors
- [x] Save and deliver the four-box countdown checkpoint

## Live Webinar 2 Centered Reference-Inspired Redesign

- [x] Replace the `/live-webinar2` 55/45 desktop split with a focused single centered conversion column inspired by the supplied reference without copying its black-and-gold commercial style
- [x] Add a rounded top banner reading `LIVE ON ZOOM · FREE EDUCATIONAL WEBINAR` so the event format is immediately clear on desktop and mobile
- [x] Center the existing age-35+ label, approved headline, purple promise, and short Dr. Al-Deek educational introduction with a stronger compact hierarchy
- [x] Place a wider responsive webinar video directly below the centered message and retain the current inline, visibility-based playback safeguards and video-length token
- [x] Place one prominent `Reserve My Free Spot` CTA immediately below the video, followed by the four-box countdown and the visual-only First Name/Email form with existing event, recording, privacy, and nationwide educational details
- [x] Retain the presenter treatments, four learning outcomes, Featured In strip, exact disclosures, all unresolved factual tokens, noindex review status, and unchanged `/live-webinar`
- [x] Update focused regression coverage and validate mobile/desktop hierarchy, CTA focus behavior, video safeguards, TypeScript, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current runtime logs with no browser or first-party 5xx errors
- [x] Save and deliver the centered redesign checkpoint

## Live Webinar 2 Failed Visual-Editor Paragraph Deletion Repair

- [x] Identify the current paragraph corresponding to the stale visual-editor target near the former line 188 as `Free Live Webinar · For Women 35+` and confirm it was still present
- [x] Remove only the intended paragraph from `/live-webinar2` without changing the centered Live-on-Zoom banner, headline, video, CTA, countdown, form, or lower sections
- [x] Update focused regression coverage and validate mobile/desktop rendering, TypeScript, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current runtime logs with no browser or first-party 5xx errors
- [x] Save and deliver the visual-edit repair checkpoint

## Live Webinar 2 Symptom-First Headline Update

- [x] Replace the current `/live-webinar2` headline with `Women 35+: Struggling With Weight Gain, Poor Sleep, Hot Flashes or Mood Swings?`
- [x] Add `Understand Perimenopause, Menopause, Hormone Therapy & Medical Weight Loss.` directly beneath the symptom-first headline
- [x] Position `A free educational webinar with Dr. Jumana Al-Deek.` after the new topic line and preserve the centered conversion hierarchy
- [x] Preserve the Live-on-Zoom banner, video and playback behavior, CTA, countdown, inactive form, lower sections, exact disclosures, noindex review status, and unchanged `/live-webinar`
- [x] Update focused regression coverage and validate responsive hierarchy, TypeScript, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current runtime logs with no browser or first-party 5xx errors
- [x] Save and deliver the symptom-first headline checkpoint

## Live Webinar 2 Supplied Pink-and-Plum Hero Design

- [x] Restyle only the `/live-webinar2` upper section to closely follow the supplied pink-and-plum reference while retaining the current approved copy
- [x] Rebuild the top banner as a rounded pink-to-plum gradient capsule with separate camera and education icon circles, a centered divider, and the exact Live on Zoom / Free Educational Webinar labels
- [x] Match the supplied centered hierarchy with a pink `Women 35+:` lead, dark symptom headline, pink topic line, short magenta divider, and the doctor introduction with Dr. Jumana Al-Deek emphasized
- [x] Add a restrained soft-pink decorative background treatment around the hero without introducing a new media asset or reducing text contrast
- [x] Restyle the existing webinar video with the supplied rounded white frame, compact gradient video-length pill, prominent gradient play control, and dark sound fallback while preserving the real video, poster, controls, inline playback, and visibility behavior
- [x] Preserve the primary CTA, four-box countdown, inactive form, all event and credential tokens, lower sections, Featured In strip, exact disclosures, noindex review status, and unchanged `/live-webinar`
- [x] Update focused regression coverage and validate desktop/mobile fidelity, accessibility, playback safeguards, CTA behavior, TypeScript, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current runtime logs with no browser or first-party 5xx errors
- [x] Save and deliver the supplied-design checkpoint

## Live Webinar 2 Authority and Event-Information Cleanup

- [x] Replace the plain hero doctor introduction with a compact authority block using the existing real headshot, Dr. Jumana Al-Deek’s name, and the supported line `Physician and author of The Menopause Weight Loss Trap`
- [x] Remove the redundant compact presenter row near the form while retaining the fuller presenter section and its unfilled detailed credential token lower on the page
- [x] Consolidate date, time, timezone, duration, and Live Q&A into one clean centered event-details strip using the existing unresolved factual tokens
- [x] Combine the recording and Privacy Policy statements into one quiet supporting line beneath the event strip
- [x] Simplify nationwide wording to `This free educational webinar is available nationwide.` and remove the `See states` toggle and `[STATE LIST]` display because the webinar itself is educational and nationwide
- [x] Preserve the supplied pink-and-plum hero design, real video and playback safeguards, CTA, four-box countdown, visual-only inactive form, fuller presenter section, Featured In strip, exact disclosures, noindex review status, and unchanged `/live-webinar`
- [x] Update remaining-token documentation and focused regression coverage, then validate desktop/mobile hierarchy, accessibility, TypeScript, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current runtime logs with no browser or first-party 5xx errors
- [x] Save and deliver the authority/event cleanup checkpoint

## Live Webinar 2 Women 35+ Punctuation Update

- [x] Verify the visual editor successfully changed the visible hero lead from `Women 35+:` to `Women 35+`
- [x] Synchronize the hero accessibility label and focused regression safeguards so the removed colon is consistent everywhere
- [x] Preserve all other `/live-webinar2` content, supplied design, functionality, review safeguards, and unchanged `/live-webinar`
- [x] Validate desktop/mobile rendering, TypeScript, 29 focused checks, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current runtime logs with no browser or first-party 5xx errors
- [x] Save and deliver the punctuation-update checkpoint

## Live Webinar 2 Immediate Masterclass Clarity

- [x] Change the right side of the top banner from `Free Educational Webinar` to `Free Live Masterclass`
- [x] Add a separate `For Women 35+` audience label immediately above the symptom headline and remove `Women 35+` from the headline itself
- [x] Keep the symptom headline and topic line otherwise unchanged, preserving the direct three-second audience/topic hierarchy
- [x] Add a new `Reserve Your Free Spot` CTA between the physician authority block and the video, wired to the existing inactive visual-only registration form behavior
- [x] Preserve the existing primary CTA below the video, countdown, form, event information, real video and playback safeguards, lower sections, exact disclosures, noindex review status, and unchanged `/live-webinar`
- [x] Update focused regression coverage and validate desktop/mobile hierarchy, CTA behavior, accessibility, TypeScript, 29 focused checks, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current runtime logs with no browser or first-party 5xx errors
- [x] Save and deliver the immediate-masterclass-clarity checkpoint

## Live Webinar 2 Educational Webinar Banner Copy

- [x] Replace `Free Live Masterclass` in the `/live-webinar2` top banner with `A Free Educational Webinar`; superseded before checkpoint by the user’s single-message banner clarification
- [x] Preserve `Live on Zoom`, the audience label, symptom headline, above-video CTA, and every other page element and safeguard; preservation of `Live on Zoom` was explicitly superseded before checkpoint
- [x] Update focused regression coverage and validate mobile rendering, TypeScript, 29 focused checks, all 179 tests across 34 files, and production build for the interim wording; final responsive/route/log validation moves to the superseding task below
- [x] Do not create an interim educational-webinar banner-copy checkpoint because the user refined the design before checkpointing

## Live Webinar 2 Single-Message Educational Banner

- [x] Replace the entire top banner contents with one large centered `A FREE EDUCATIONAL WEBINAR` message
- [x] Remove `Live on Zoom`, both banner icons, and the center divider from the top banner only
- [x] Preserve the audience label, symptom headline, physician authority, both CTAs, video, countdown, inactive form, lower sections, exact disclosures, noindex review status, and unchanged `/live-webinar`
- [x] Update focused regression coverage and validate mobile/desktop rendering, accessibility, TypeScript, 29 focused checks, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current runtime logs with no browser or first-party 5xx errors
- [x] Save and deliver the single-message educational-banner checkpoint

## Live Webinar 2 Authority Intro Empty-Paragraph Cleanup

- [x] Verify the visual editor successfully removed `A free educational webinar with` from the physician authority block
- [x] Remove the resulting empty paragraph element so the authority block contains no blank semantic or layout residue
- [x] Preserve Dr. Jumana Al-Deek’s name, physician/author line, headshot, surrounding hero hierarchy, all safeguards, and unchanged `/live-webinar`
- [x] Update focused regression coverage and validate mobile/desktop rendering, TypeScript, 29 focused checks, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current runtime logs with no browser or first-party 5xx errors
- [x] Save and deliver the authority-intro cleanup checkpoint

## Live Webinar 2 Confirmed Event Date and Top Countdown

- [x] Set the event configuration to Wednesday, September 23, 2026 at 7:00 PM Eastern Time using an explicit daylight-saving-aware ISO timestamp
- [x] Display `WEDNESDAY, SEPTEMBER 23 · 7:00 PM ET` directly beneath the `A FREE EDUCATIONAL WEBINAR` banner
- [x] Move and restyle the live four-part Days/Hours/Minutes/Seconds countdown as a compact ticker directly beneath the confirmed date/time
- [x] Remove the duplicated lower countdown and repeated event-date/time line while retaining duration and Live Q&A information in the form-support area
- [x] Preserve visual-only inactive registration, recording/privacy/nationwide notes, both CTAs, real video and playback safeguards, lower sections, exact disclosures, noindex review status, and unchanged `/live-webinar`
- [x] Update remaining-token documentation and focused regression coverage, then validate the live countdown, responsive rendering, accessibility, TypeScript, 29 focused checks, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current runtime logs with no browser or first-party 5xx errors
- [x] Save and deliver the confirmed-event top-countdown checkpoint

## Live Webinar 2 Sliding Featured-In Logo Row

- [x] Replace the Featured In logo grid on `/live-webinar2` with one continuous horizontal row that loops smoothly across desktop and mobile
- [x] Use only the existing six approved outlet logos and duplicate the same set solely to create a seamless visual loop without adding or implying new media features
- [x] Pause the sliding row on hover and keyboard focus, hide the duplicate logo set from assistive technology, and disable motion when the visitor prefers reduced motion
- [x] Preserve the Featured In heading, purple strip, logo identities and alt text, section placement, exact disclosures, noindex review status, all other `/live-webinar2` content and behavior, and unchanged `/live-webinar`
- [x] Update focused regression coverage and validate responsive single-row motion, accessibility, TypeScript, 29 focused checks, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current runtime logs with no browser or first-party 5xx errors
- [x] Save and deliver the sliding Featured In checkpoint

## Live Webinar 2 Form, Support Card, and Presenter Removal

- [x] Remove the pictured First Name and Email visual-only form section from `/live-webinar2`
- [x] Remove the pictured duration/Live Q&A, recording, Privacy Policy, and nationwide educational support card from `/live-webinar2`
- [x] Remove the pictured large lower presenter card, including its detailed credentials token and book-cover treatment
- [x] Preserve the compact physician authority row near the top, the confirmed date and live countdown, both CTA buttons and inactive feedback behavior, video and playback safeguards, sliding Featured In strip, learning content, final CTA, exact disclosures, noindex review status, and unchanged `/live-webinar`
- [x] Remove obsolete form-focus logic, refs, imports, and no-longer-visible duration, privacy, credentials, and presenter tokens without introducing a registration integration
- [x] Update remaining-token documentation and focused regression coverage, then validate responsive flow, CTA behavior, accessibility, TypeScript, 29 focused checks, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current runtime logs with no browser or first-party 5xx errors
- [x] Save and deliver the section-removal checkpoint

## Live Webinar 2 Above-Video CTA Removal

- [x] Remove the `Reserve Your Free Spot` button positioned above the `/live-webinar2` video
- [x] Keep all remaining registration buttons as `Reserve My Free Spot` and preserve their inactive review-only feedback
- [x] Preserve the authority row, confirmed date/countdown, video and playback safeguards, sliding Featured In strip, learning content, final CTA, exact disclosures, noindex review status, and unchanged `/live-webinar`
- [x] Update focused regression coverage and validate mobile/desktop flow, CTA consistency, TypeScript, 29 focused checks, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current runtime logs with no browser or first-party 5xx errors
- [x] Save and deliver the above-video CTA-removal checkpoint

## Live Webinar 2 CTA Limited-Capacity Line

- [x] Add `LIMITED ZOOM CAPACITY` as smaller secondary text inside the first `Reserve My Free Spot` button directly beneath the video
- [x] Preserve the first CTA’s inactive review-only behavior and keep the two later `Reserve My Free Spot` buttons unchanged
- [x] Preserve all other `/live-webinar2` content, layout, playback safeguards, disclosures, noindex review status, and unchanged `/live-webinar`
- [x] Update focused regression coverage and validate mobile/desktop CTA rendering, TypeScript, 29 focused checks, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current runtime logs with no browser or first-party 5xx errors
- [x] Save and deliver the limited-capacity CTA checkpoint

## Live Webinar 2 Final CTA and Disclosure Removal

- [x] Remove the complete `Ready to save your free spot?` final CTA card from `/live-webinar2`
- [x] Remove the complete testosterone disclosure footer from `/live-webinar2` following the user’s explicit confirmation after the compliance-risk warning
- [x] Keep the removal isolated from `/live-webinar`, other treatment pages, and their existing disclosure requirements
- [x] Remove obsolete CTA-count and page-specific disclosure expectations while preserving the learning section, informed-care content, first video CTA, sliding Featured In strip, educational disclaimer, noindex review status, and all other page behavior
- [x] Update remaining-token documentation and narrowly scoped focused/compliance regression safeguards, then validate mobile/desktop flow, TypeScript, 29 focused checks, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current runtime logs with no browser or first-party 5xx errors
- [x] Save and deliver the final-CTA/disclosure-removal checkpoint

## Live Webinar 2 Light Card Learning-Section Redesign

- [x] Restyle only the `/live-webinar2` What You’ll Learn section using a warm ivory/blush background that remains visually distinct from the purple Featured In strip
- [x] Present the existing four learning points as white rounded cards with subtle blush borders, soft shadows, pink circular checkmarks, and restrained top accent lines
- [x] Use a two-by-two card grid on desktop and one stacked column on mobile, with the existing `Reserve My Free Spot` CTA centered beneath all four cards
- [x] Preserve the exact current What You’ll Learn label, `Clear answers for your next chapter.` heading, every learning-point word and order, CTA copy and inactive behavior, and all surrounding page content
- [x] Update focused regression coverage and validate exact copy preservation, responsive rendering, accessibility, TypeScript, 29 focused checks, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current runtime logs with no browser or first-party 5xx errors
- [x] Save and deliver the light-card learning-section checkpoint

## Live Webinar 2 Mockup-Based Learning-Section Replacement

- [x] Replace the current `/live-webinar2` learning-section heading with `Because You Deserve to Know`
- [x] Add the approved subtitle `Evidence-based insights you can actually use — so you can feel informed, confident, and in control.`
- [x] Replace the current four learning cards with the three approved numbered cards and their exact new title/body wording from the supplied mockup
- [x] Match the supplied stacked card design with pink number badges, topic-specific line icons, large pale-pink icon circles, white rounded cards, and a warm blush section background
- [x] Keep the three cards stacked on mobile and use a balanced responsive treatment on desktop without changing the approved wording
- [x] Preserve the existing `Reserve My Free Spot` CTA beneath the cards, its inactive feedback, all surrounding `/live-webinar2` content and safeguards, and unchanged `/live-webinar`
- [x] Update focused regression coverage and validate exact new copy, responsive rendering, accessibility, TypeScript, 29 focused checks, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current runtime logs with no browser or first-party 5xx errors
- [x] Save and deliver the mockup-based learning-section checkpoint

## Live Webinar 2 Cleaner Learning-Section Refinement

- [x] Remove the bulky outer learning-section border and shadow so the warm blush area feels open and closer to the original reference
- [x] Keep all three learning cards in one spacious vertical column on mobile and desktop with wider card proportions and more deliberate whitespace
- [x] Enlarge the heading, subtitle, topic icons, card titles, and supporting copy while improving mobile text width and line breaks
- [x] Simplify card borders and shadows while retaining the approved pink number badges, pale-pink icon circles, white cards, and warm blush background
- [x] Preserve every approved heading, subtitle, card title, supporting sentence, card order, CTA copy and behavior, surrounding `/live-webinar2` content, safeguards, and unchanged `/live-webinar`
- [x] Update focused regression coverage and validate clean reference fidelity, copy preservation, mobile/desktop rendering, accessibility, TypeScript, 29 focused checks, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current runtime logs with no browser or first-party 5xx errors
- [x] Save and deliver the cleaner learning-section refinement checkpoint

## Live Webinar 2 GLP-1 Learning-Card Restoration

- [x] Restore a fourth numbered learning card using the previously approved GLP-1 wording removed during the mockup redesign
- [x] Style card four with the same white card, pink number badge, pale-pink icon circle, typography, spacing, border, and shadow as cards one through three
- [x] Keep the GLP-1 card fourth in the approved learning order and preserve every word in the other three cards, section heading, subtitle, CTA, surrounding page, safeguards, and unchanged `/live-webinar`
- [x] Update focused regression coverage and validate four-card order, mobile/desktop rendering, accessibility, TypeScript, 29 focused checks, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current runtime logs with no browser or first-party 5xx errors
- [x] Save and deliver the GLP-1 learning-card restoration checkpoint

## Live Webinar 2 Learning-Card Geometry Repair

- [x] Rebuild all four learning-card icon areas to match the supplied reference with a larger pale-pink circle and a smaller numbered badge positioned at its upper-left edge
- [x] Eliminate number/icon overlap by reserving independent badge and icon geometry with consistent offsets across cards one through four
- [x] Optimize mobile and desktop card width, height, internal spacing, icon size, title width, body-copy width, and line-height to match the clean reference proportions
- [x] Keep all four cards visually consistent, including the restored GLP-1 card, without changing any heading, subtitle, card title, supporting sentence, order, CTA, or surrounding page content
- [x] Update focused regression coverage and validate overlap prevention, exact copy preservation, mobile/desktop rendering, accessibility, TypeScript, 29 focused checks, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current runtime logs with no browser or first-party 5xx errors
- [x] Save and deliver the learning-card geometry-repair checkpoint

## Live Webinar 2 First-Card Icon Prototype

- [x] Prototype only card one with a custom hormone/molecule line icon that more closely matches the supplied reference artwork
- [x] Reduce the excess white space above card one’s icon while preserving clear separation between the numbered badge, pale-pink circle, icon, and text
- [x] Keep cards two through four, every heading and card word, card order, CTA, surrounding page content, safeguards, and unchanged `/live-webinar` untouched pending user approval
- [x] Add focused regression coverage for the isolated custom icon and card-one spacing, then validate mobile/desktop rendering, accessibility, TypeScript, 22 focused checks, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current browser/first-party logs without new route or 5xx failures
- [x] Save and deliver the card-one icon prototype checkpoint for approval before updating the remaining icons

## Live Webinar 2 Supplied Molecule Artwork Prototype

- [x] Preserve the newly supplied combined 1536×1024 PNG outside the project and extract only the top-left hormone/molecule artwork for card one
- [x] Trim excess canvas and prepare a clean transparent card-one molecule asset without altering the supplied artwork’s pink line style
- [x] Upload the prepared icon to permanent project storage and replace only the rejected custom SVG on card one
- [x] Preserve card-one wording and geometry, cards two through four, all surrounding page content, safeguards, and unchanged `/live-webinar` pending user approval
- [x] Update focused regression coverage and validate exact supplied-asset use, mobile/desktop rendering, accessibility, TypeScript, 22 focused checks, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current-session browser, server, and first-party logs without errors or 5xx responses
- [x] Save and deliver the supplied-artwork card-one prototype checkpoint before updating the remaining icons

## Live Webinar 2 Card-One Landscape Proportion Repair

- [x] Re-proportion only learning card one into a shorter landscape shape that matches the supplied reference on mobile and desktop
- [x] Enlarge card one’s pale-pink molecule circle and numbered badge while preserving their clean relative placement and the exact supplied molecule asset
- [x] Widen card one’s text column and tighten its title/body typography and line-height to reduce unnecessary wrapping and vertical height
- [x] Keep card-one wording exact and leave cards two through four, the section heading/subtitle, CTA, surrounding page content, safeguards, and unchanged `/live-webinar` untouched pending approval
- [x] Update focused regression coverage and validate card-one aspect, icon scale, text wrapping, mobile/desktop rendering, accessibility, TypeScript, 22 focused checks, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current-session browser, server, and first-party logs without errors or 5xx responses
- [x] Save and deliver the card-one landscape-proportion checkpoint for approval

## Live Webinar 2 Enhanced Card-One Design Prototype

- [x] Develop a refined visual concept for card one using enhanced design exploration while preserving its exact supplied molecule artwork and wording
- [x] Reduce the numbered badge to approximately 40px mobile and 52px desktop and reposition it as a supporting label rather than the dominant graphic
- [x] Change card one’s title from near-black to an inviting warm deep plum and refine title/body font sizes and line-heights for a calmer hierarchy
- [x] Balance card-one icon scale, text width, internal spacing, and landscape proportions without changing cards two through four
- [x] Preserve every word, card order, CTA, surrounding `/live-webinar2` content, safeguards, and unchanged `/live-webinar` pending user approval
- [x] Update focused regression coverage and validate visual balance, mobile/desktop rendering, accessibility, TypeScript, 29 focused checks, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current-session server, browser, and first-party logs without errors or 5xx responses
- [x] Save and deliver the enhanced card-one prototype checkpoint for approval before updating the remaining cards

## Live Webinar 2 55+ Readability Typography Prototype

- [x] Darken the learning-section subtitle to warm gray `#514A52`, increase it to medium weight, and refine its responsive size and line-height for easier reading by women 55+
- [x] Update only card one’s title to warm deep plum `#432943` at 800 weight with the approved 18–20px mobile and 22–24px desktop scale
- [x] Update only card one’s supporting text to warm gray `#514A52`, medium weight, and a more readable 16–17px mobile and 18–19px desktop scale with 1.45–1.6 line-height
- [x] Leave cards two through four unchanged for direct visual comparison and preserve every word, icon, card order, CTA, surrounding page content, safeguards, and unchanged `/live-webinar`
- [x] Update focused regression coverage and validate readability, contrast, mobile/desktop rendering, accessibility, TypeScript, 29 focused checks, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current-session server, browser, and first-party logs without errors or 5xx responses
- [x] Save and deliver the 55+-readability card-one prototype checkpoint for comparison

## Live Webinar 2 Card-One Rich-Berry Title Color

- [x] Change only card one’s title color from `#432943` to the approved rich berry `#6F2754`
- [x] Preserve card one’s 800 weight, responsive font size, wording, supporting-text color, icon, geometry, and cards two through four unchanged for comparison
- [x] Update focused regression coverage and validate mobile/desktop rendering, contrast, TypeScript, 29 focused checks, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current-session server, browser, and first-party logs without errors or 5xx responses
- [x] Save and deliver the card-one rich-berry title-color checkpoint

## Live Webinar 2 Card-One Brand-Magenta Title Color

- [x] Change only card one’s title color from `#6F2754` to the approved existing brand magenta `#DD2D84`
- [x] Preserve card one’s 800 weight, responsive font size, wording, supporting-text color, icon, geometry, and cards two through four unchanged for comparison
- [x] Update focused regression coverage and validate mobile/desktop rendering, contrast, TypeScript, 29 focused checks, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current-session server, browser, and first-party logs without errors or 5xx responses
- [x] Save and deliver the card-one brand-magenta title-color checkpoint

## Live Webinar 2 Homepage-Inspired Card-One Example

- [x] Refine only card one with a cleaner white surface, lighter blush border, and softer restrained shadow inspired by the live MedMethod Direct homepage
- [x] Keep card one’s approved brand-magenta `#DD2D84` title, dark warm-gray body, restrained number badge, pale-blush icon field, exact supplied molecule artwork, and landscape proportions
- [x] Leave cards two through four, every word, card order, CTA, surrounding `/live-webinar2` content, safeguards, and unchanged `/live-webinar` untouched for comparison
- [x] Update focused regression coverage and validate visual contrast, mobile/desktop rendering, accessibility, TypeScript, 29 focused checks, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current-session server, browser, and first-party logs without errors or 5xx responses
- [x] Save and deliver the homepage-inspired card-one example checkpoint for approval

## Live Homepage Inspiration Review for Webinar Cards

- [x] Review `https://medmethoddirect.com` as the user-provided brand reference without changing the website
- [x] Identify the homepage’s strongest reusable color, typography, spacing, card, and physician-authority design cues
- [x] Recommend a specific brand-consistent direction for the `/live-webinar2` learning cards before any further implementation

## Live Webinar 2 Seven-Item Learning Checklist

- [x] Remove the complete four-card learning presentation, card-specific icon assets, numbered badges, and card-only geometry without affecting other page sections
- [x] Replace it with the exact approved `What You’ll Learn` and `Because You Deserve to Know.` hierarchy plus all seven supplied checklist items in the supplied order
- [x] Present one accessible vertical checklist with magenta checkmarks, bold readable titles, dark warm-gray explanations, and light blush dividers on the existing warm background
- [x] Preserve the existing `Reserve My Free Spot` CTA beneath the checklist, every surrounding `/live-webinar2` section and behavior, safeguards, and unchanged `/live-webinar`
- [x] Update focused regression coverage and validate exact copy, seven-item order, accessibility, mobile/desktop rendering, TypeScript, 29 focused checks, all 179 tests across 34 files, production build, both webinar routes returning HTTP 200, and current-session server, browser, and first-party logs without errors or 5xx responses
- [x] Save and deliver the seven-item checklist checkpoint

## Admin Resend Email Settings and Homepage Payment Notifications

- [x] Audit the current `/admin/settings` architecture, homepage $50 payment completion paths, LECTURE50 $99 remaining-balance logic, appointment-date scheduled charge handler, Stripe/PayPal flows, GHL webhooks, and existing notification helpers without changing behavior
- [x] Present and confirm direct transactional delivery as the selected architecture, including non-blocking payment behavior and permanent delivery idempotency
- [x] Store the admin-entered Resend API key with AES-256-GCM encryption in the database, never return it in full, support masked replacement/removal, and avoid plaintext persistence or logs
- [x] Add database-backed email delivery settings, two editable email templates, update timestamps, and permanent unique payment-event delivery logs
- [x] Add secure server-side Resend delivery with a global enable/disable toggle, verified sender address, test-email action, template-variable validation, HTML/text rendering, provider idempotency, and clear disabled/unconfigured failure states
- [x] Add an Email Settings tab/section to `/admin/settings` matching the existing dashboard design, with masked API-key management, status, enable toggle, sender configuration, test recipient, test-send action, editable subject/HTML/plain-text templates, and recent delivery history
- [x] Send the first customer email only after a successful homepage Stripe or PayPal $50 payment and include the correct $149 or referral-adjusted $99 remaining balance without altering payment, affiliate, GHL, booking, or referral behavior
- [x] Send the second customer email after successful Stripe or PayPal remaining-balance charges, using the actual persisted amount and preventing duplicate delivery during scheduled, manual, or retry paths
- [x] Preserve email silence when the admin toggle is disabled, when credentials/sender are incomplete, or when a payment/charge is unsuccessful; record delivery outcomes without blocking successful payments
- [x] Add Vitest coverage for encrypted credentials, admin-only settings, masked key handling, templates, enable gating, HTML escaping, Resend failure isolation, $50 triggers, $149/$99 rendering, permanent idempotency, and unchanged WL2 one-time payment flows
- [x] Validate the three schema-backed tables, 26 focused checks, all 194 tests across 38 files, TypeScript, production build, payment-flow isolation, both payment providers, `/`, `/admin/settings`, `/api/health` HTTP 200, protected email tRPC HTTP 403 when unauthorized, and clean current-session runtime logs; authenticated visual verification and a live Resend test remain owner activation steps because no admin session or API key was supplied
- [x] Save and deliver the completed Resend email-notification checkpoint with activation instructions

## Live Webinar Click-Triggered SendMeAPro Registration Form

- [x] Inspect both live webinar CTA implementations, current review-only behavior, reusable dialog patterns, third-party embed conventions, and focused regression coverage
- [x] Add one reusable accessible webinar-registration dialog that mounts the supplied SendMeAPro Webinar Form iframe only after a webinar CTA is clicked
- [x] Route the CTA buttons on `/live-webinar` and `/live-webinar2` to the click-triggered form without changing existing video, payment, intake, scheduling, or email behavior
- [x] Avoid automatic or duplicate GHL form-script installation; preserve responsive iframe height, close behavior, keyboard escape, focus return, and clear loading/error handling
- [x] Update focused webinar tests for the authorized registration behavior and preserve route-isolation safeguards outside the intended CTA change
- [x] Validate 20 focused webinar checks and all 196 tests across 39 files, TypeScript, production build, both webinar routes returning HTTP 200, desktop/mobile rendering, form opening on both routes with no submitted test lead, clean post-fix browser/dev-server logs, and zero post-fix first-party 5xx responses
- [x] Save and deliver the webinar registration-form checkpoint with practical live-form testing guidance

## Shared Footer LegitScript Approval Badge

- [x] Inspect the shared footer, related footer regression coverage, and the supplied LegitScript image/link endpoints
- [x] Add the supplied LegitScript approval badge to both shared public footer variants with the exact verification URL, accessible image text, secure new-tab behavior, responsive centered placement, and a durable project-hosted copy of the supplied seal
- [x] Confirm existing footer content and public-page footer reuse remain intact; update focused regression coverage
- [x] Validate the badge endpoint, responsive footer rendering, 4 focused footer checks and all 197 tests across 39 files, TypeScript, production build, homepage/blog/Virginia HTTP 200 responses, and current runtime logs with no new errors or first-party 5xx responses
- [x] Save and deliver the LegitScript footer-badge checkpoint

## Live Webinar 2 LegitScript Footer Badge

- [x] Inspect the current `/live-webinar2` bottom section and focused webinar regression coverage before adding the badge
- [x] Add the existing durable LegitScript Certified seal to a centered, polished `/live-webinar2` footer treatment with the exact verification link and secure accessible behavior
- [x] Preserve all existing webinar content, countdown, video, CTA/form, featured logos, learning checklist, and educational-disclosure behavior; update focused coverage
- [x] Validate desktop/mobile rendering, badge image/link, CTA form behavior, 16 focused checks and all 198 tests across 39 files, TypeScript, production build, live-webinar2 HTTP 200, and current logs with no new errors or first-party 5xx responses
- [x] Save and deliver the live-webinar2 footer-badge checkpoint

## Webinar Registration Conversion Thank-You Flow

- [x] Inspect existing thank-you routes, current Meta tracking patterns, webinar form capabilities, and GoHighLevel post-submission redirect constraints
- [x] Create a distinct public webinar-registration thank-you route with a clear confirmation message and a single guarded Meta conversion event
- [x] Preserve all existing thank-you pages, payment workflows, intake forms, webinar content, CTA dialog, and the current SendMeAPro form itself
- [x] Verify the GoHighLevel form’s supported redirect configuration and document the exact post-submission destination without guessing cross-origin form events; no GoHighLevel connector is available for account-side configuration
- [x] Add focused regression coverage and validate the Meta event guard, route behavior, form preservation, desktop/mobile layout, 26 focused checks and all 202 tests across 40 files, TypeScript, production build, route health, and current logs with no new errors or first-party 5xx responses
- [x] Save and deliver the webinar conversion thank-you checkpoint with the exact GoHighLevel redirect configuration step

## Confirmed Webinar Date and Time

- [x] Locate the current September 23 and 7:00 PM ET references across both webinar landing pages, countdown targets, confirmation route, tests, and documentation
- [x] Update the confirmed live webinar details to Wednesday, September 16 at 7:00 PM ET consistently across the visitor-facing webinar and confirmation experiences
- [x] Preserve webinar registration, the SendMeAPro form, trusted confirmation redirect behavior, Meta conversion event, payment/intake flows, and unrelated page content
- [x] Update focused regression coverage and validate the date/time, countdown target, route rendering, 25 focused checks and all 202 tests across 40 files, TypeScript, production build, responsive layouts, and current logs with no new errors or first-party 5xx responses
- [x] Save and deliver the confirmed webinar-date update checkpoint

## Live Webinar 2 Visible-Video Autoplay

- [x] Inspect current video autoplay, sound, intersection-observer, and focused regression behavior on `/live-webinar2`
- [x] Make the webinar video start reliably when it becomes visible using browser-compatible muted autoplay, with an accessible sound-on control and retained native controls
- [x] Preserve view-based pause behavior, inline mobile playback safeguards, fallback controls, event details, registration, tracking, and all unrelated page behavior
- [x] Update focused regression coverage and validate autoplay/sound behavior, desktop/mobile rendering, 19 focused checks and all 202 tests across 40 files, TypeScript, production build, route health, and current logs with no new errors or first-party 5xx responses
- [x] Save and deliver the visible-video autoplay improvement checkpoint

## Live Webinar 2 Audible Autoplay Priority

- [x] Inspect the current muted-autoplay strategy, sound fallback, and focused playback regression coverage on `/live-webinar2`
- [x] Attempt visible-video playback with sound enabled first while retaining a clear, accessible fallback when a browser blocks audible autoplay
- [x] Preserve inline playback, native controls, video visibility pause/resume behavior, event details, registration, tracking, and unrelated page behavior
- [x] Update focused regression coverage and validate audible-autoplay fallback behavior, desktop/mobile rendering, 19 focused checks and all 202 tests across 40 files, TypeScript, production build, route health, and current logs with no new errors or first-party 5xx responses
- [x] Save and deliver the audible-autoplay priority checkpoint

## Live Webinar 2 Subtitle Track

- [x] Inspect the current video source, player markup, caption-asset support, and focused regression coverage before adding subtitles
- [x] Create an accurate English WebVTT subtitle track from the webinar video audio and store it using the approved durable asset workflow
- [x] Add the caption track to `/live-webinar2` with native caption controls while preserving autoplay, sound fallback, inline playback, registration, tracking, and all unrelated page behavior
- [x] Update focused regression coverage and validate 12 focused webinar checks and all 202 tests across 40 files, loaded default English captions with 12 timed cues, desktop/mobile rendering, TypeScript, production build, route health, and current logs with no new errors or first-party 5xx responses
- [x] Save and deliver the live-webinar2 subtitle enhancement checkpoint

## Live Webinar 2 Public Subtitle Verification

- [x] Inspect the published `/live-webinar2` player for its deployed caption track, active cues, native control state, and release availability; confirmed 12 active English cues on the live domain, with the native captions control too easy to miss
- [x] Correct the public caption visibility issue with a branded timed overlay and CC control without altering video playback, registration, tracking, or other webinar behavior
- [x] Validate the live subtitle experience, CC On / CC Off toggle, video playback safeguards, 12 focused webinar checks and all 202 tests across 40 files, TypeScript, production build, route health, and current logs with no new errors or first-party 5xx responses
- [x] Save the public subtitle visibility correction and report the verification result
- [x] Add a clearly visible timed caption overlay and a visitor-controlled captions toggle because the native track is loaded on the live page but its browser control is easy to miss

## Webinar Confirmation Physician-Focused Actions

- [x] Inspect the webinar confirmation action area, homepage physician-information destination, and focused regression coverage before updating the actions; use the homepage root because its doctor information is part of the initial visitor journey rather than an isolated anchor section
- [x] Replace the webinar-return action with a primary Read More About Dr. Jumana Al-Deek homepage link and a clear secondary `(888) 362-7011` call option, avoiding any implication of an immediate appointment
- [x] Preserve the webinar confirmation message, date/time, Zoom reminder, Meta conversion guard, registration redirect, and all unrelated behavior; update focused coverage
- [x] Validate homepage and telephone action destinations, desktop/mobile layout, 3 focused checks and all 202 tests across 40 files, TypeScript, production build, route health, and current logs with no new errors or first-party 5xx responses
- [x] Save and deliver the physician-focused webinar confirmation action checkpoint

## Webinar Confirmation Single Action Refinement

- [x] Inspect the current confirmation-page actions and focused regression coverage before simplifying the layout
- [x] Remove the separate Call Us button, retain Read More About Dr. Jumana Al-Deek as the sole action button, and place Questions? Call us at (888) 362-7011 beneath it
- [x] Preserve confirmation message, event details, Zoom reminder, Meta conversion tracking, registration redirect, and all unrelated behavior; update focused coverage
- [x] Validate the responsive single-action layout, homepage and telephone destinations, 3 focused checks and all 202 tests across 40 files, TypeScript, production build, route health, and current logs with no new errors or first-party 5xx responses
- [x] Save and deliver the webinar confirmation single-action checkpoint

## Live Webinar 3 Exact Duplicate

- [x] Inspect the current `/live-webinar2` page, route registration, shared dependencies, and focused regression coverage before duplicating it
- [x] Create an isolated `LiveWebinar3` page that exactly matches the current `/live-webinar2` design, event details, video, captions, registration form, conversion behavior, and footer treatment
- [x] Register `/live-webinar3` without modifying the existing `/live-webinar`, `/live-webinar2`, payment, intake, or confirmation routes; add focused route-isolation coverage and confirm its primary CTA opens the shared form without submitting a lead
- [x] Validate matching desktop/mobile presentation, video/caption controls, primary registration action, 14 focused checks and all 204 tests across 41 files, TypeScript, production build, all webinar routes returning HTTP 200, and current logs with no new errors or first-party 5xx responses
- [x] Save and deliver the live-webinar3 duplicate-page checkpoint

## Live Webinar 3 A/B Variation 1

- [x] Inspect the current `/live-webinar3` top-page hierarchy, existing video markup, and focused coverage before applying the approved variation
- [x] Change only the `/live-webinar3` top banner text to Free Webinar and place the existing video directly beneath the event date/time ticker
- [x] Preserve all `/live-webinar2` content and behavior, plus the `/live-webinar3` video autoplay, captions, form, tracking, event details, checklist, featured logos, disclosure, and footer treatment
- [x] Update focused coverage and validate the revised hierarchy, desktop/mobile rendering, video/form behavior, 14 focused checks and all 204 tests across 41 files, TypeScript, production build, webinar routes, and current logs with no new errors or first-party 5xx responses
- [x] Save and deliver the live-webinar3 A/B variation checkpoint

## Live Webinar 3 A/B Variation 2: Short Form

- [x] Inspect the current `/live-webinar3` section order, CTA placement, featured footer, disclosure, LegitScript badge, and focused coverage before shortening the page
- [x] Remove only the approved symptom copy, physician authority block, and What You’ll Learn section from `/live-webinar3`
- [x] Retain the Free Webinar banner, date/time ticker, video, one clear Reserve My Free Spot CTA, Featured In footer, educational disclaimer, and LegitScript badge
- [x] Preserve `/live-webinar2` and all video, captions, form, tracking, event, confirmation, payment, intake, and unrelated page behavior
- [x] Update focused coverage and validate the short-form hierarchy, desktop/mobile rendering, registration action, 14 focused checks and all 204 tests across 41 files, TypeScript, production build, webinar routes, and current logs with no new errors or first-party 5xx responses
- [x] Save and deliver the short-form live-webinar3 A/B variation checkpoint

## Live Webinar 3 Unobstructed Captions

- [x] Inspect the current `/live-webinar3` active-caption overlay, video-control placement, and focused subtitle coverage
- [x] Move active subtitle text into a compact caption bar below the video while retaining the existing CC control and timed subtitle track
- [x] Preserve the unobstructed video frame, autoplay/sound fallback, reservation CTA, Featured In footer, disclaimer, badge, and all `/live-webinar2` behavior
- [x] Update focused coverage and validate active caption readability below the video, unobstructed footage, CC control visibility toggle, desktop/mobile layout, 14 focused checks and all 204 tests across 41 files, TypeScript, production build, webinar routes, and current logs with no new errors or first-party 5xx responses
- [x] Save the live-webinar3 caption-placement improvement checkpoint before beginning the next approved webinar variation

## Live Webinar 3 Companion Confirmation Flow

- [x] Inspect the existing webinar confirmation page, live-webinar3 form completion listener, current routes, removed webinar content, and focused regression coverage
- [x] Change only the `/live-webinar3` banner label to Free Live Zoom Webinar
- [x] Create `/live-webinar3-confirmed` as an isolated duplicate of the current webinar confirmation page with the fuller educational information removed from `/live-webinar3`
- [x] Update the live-webinar3 local trusted form-completion fallback to the new companion destination while preserving the existing webinar-two confirmation flow and conversion safeguards
- [x] Document the exact separate GoHighLevel form and redirect configuration required to send the live-webinar3 campaign to its companion confirmation page without altering the original campaign
- [x] Validate route isolation, page hierarchy, confirmation content, Meta tracking guard, form behavior, 11 focused checks and all 207 tests across 42 files, TypeScript, production build, desktop/mobile layouts, routes, and current logs with no new browser-console errors or first-party 5xx responses
- [x] Save and deliver the live-webinar3 companion confirmation-flow checkpoint

## Live Webinar Custom CC Control Removal

- [x] Inspect the current custom CC button, caption presentation, and focused video regression coverage across the live webinar pages
- [x] Remove the visible custom CC On/Off button while retaining automatic subtitle availability and unobstructed video presentation
- [x] Preserve autoplay/sound behavior, native video controls, caption timing, registration, event details, footer, and unrelated page behavior
- [x] Update focused coverage and validate automatic captions, unobstructed desktop/mobile video layout, 14 focused checks and all 207 tests across 42 files, TypeScript, production build, route health, and current logs with no new first-party 5xx responses
- [x] Save and deliver the cleaner video-control update checkpoint

## Live Webinar 3 Registration Destination Verification

- [x] Inspect the live-webinar3 dialog destination prop, trusted completion listener, companion confirmation route, current form ID, and GoHighLevel redirect boundary
- [x] Confirm no website-side live-webinar3 confirmation destination mismatch exists: the campaign already supplies `/live-webinar3-confirmed` to the trusted completion listener while the original flow retains its default route
- [x] Validate the registration form opens, trusted completion destination targets `/live-webinar3-confirmed`, both routes return HTTP 200, 8 focused checks and all 207 tests across 42 files pass, TypeScript and production build pass, and current logs show no new first-party 5xx responses
- [x] Record the verified destination and provide the exact remaining GoHighLevel redirect configuration step: duplicate the current Webinar Form, set only the duplicate’s On Submit → Open URL to `https://www.medmethoddirect.com/live-webinar3-confirmed`, publish it, and provide its new form ID for the page-three iframe

## Live Webinar 3 Provider Redirect Override Fix

- [x] Inspect the proven provider-side redirect to `/webinar-registration-confirmed`, the page-three launch context, existing confirmation guards, and focused coverage
- [x] Record a page-three registration handoff before opening the shared form and redirect only that marked completion from `/webinar-registration-confirmed` to `/live-webinar3-confirmed`
- [x] Preserve original webinar registrations, original confirmation behavior, conversion tracking isolation, form behavior, and all unrelated flows
- [x] Update focused coverage and validate both campaign paths, live redirect behavior, conversion guards, simulated provider redirect handoff, unmarked original confirmation behavior, 12 focused checks and all 208 tests across 42 files, TypeScript, production build, route health, and current logs with no new first-party 5xx responses
- [x] Save and deliver the corrected live-webinar3 redirect-flow checkpoint

## Live Webinar 2 Unobstructed Captions

- [x] Inspect the current `/live-webinar2` custom CC pill, active subtitle overlay, video controls, and focused regression coverage
- [x] Remove the visible live-webinar2 CC On/Off pill and move active subtitle text into a compact caption bar below the video
- [x] Preserve autoplay/sound behavior, native controls, caption timing, registration, event details, Featured In, footer, and all `/live-webinar3` behavior
- [x] Update focused coverage and validate active captions below the video, absent CC pill, unobstructed footage, registration form opening, desktop/mobile layout, 22 focused checks and all 208 tests across 42 files, TypeScript, production build, webinar routes, and current logs with no new first-party 5xx responses
- [x] Save and deliver the live-webinar2 unobstructed caption treatment checkpoint

## Webinar Video Meta Ad Copy

- [x] Analyze the attached webinar video for its message, audience hooks, visual tone, and compliant copy constraints
- [x] Draft compelling Meta ad copy variations with primary text, headline, description, and clear registration CTA
- [x] Recommend the strongest test-ready version and concise A/B options for the live webinar destinations

## Webinar Click-to-Unmute Overlay

- [x] Inspect the current muted-autoplay, sound fallback, caption placement, and focused video coverage on `/live-webinar2` and `/live-webinar3`
- [x] Add a matching visible click-to-unmute overlay to both webinar videos while they are muted and playing automatically
- [x] On visitor activation, restart the selected video from 00:00, enable sound, begin playback, and remove the overlay while retaining captions below the frame and native controls
- [x] Preserve registration, conversion, event, page-specific content, and all unrelated behavior; update focused regression coverage
- [x] Validate muted autoplay, click-to-unmute restart, sound playback, below-video subtitles, desktop/mobile overlay layout, 15 focused webinar checks and all 209 tests across 42 files, TypeScript, production build, both webinar routes returning HTTP 200, and zero relevant post-change runtime errors
- [x] Save and deliver the webinar audio-activation overlay checkpoint

## Live Webinar 3 Reply-YES Confirmation Panel

- [x] Inspect the current `/live-webinar3-confirmed` hierarchy and focused conversion-page coverage before updating its messaging
- [x] Replace the current post-registration status message with the approved reply-YES confirmation instruction in the panel below the event details
- [x] Preserve the event date/time, live-webinar3 conversion guard, doctor-information action, support line, and all unrelated webinar-two and payment behavior
- [x] Validate messaging hierarchy, desktop/mobile layout, conversion guard, 3 focused checks and all 209 tests across 42 files, TypeScript, production build, route health, and zero relevant post-change runtime errors
- [x] Save and deliver the live-webinar3 reply-YES confirmation-page checkpoint

## Original Webinar Reply-YES Confirmation Panel

- [x] Inspect the current `/webinar-registration-confirmed` hierarchy and focused tracking coverage before updating its messaging
- [x] Replace the original post-registration status and reminder with the approved reply-YES confirmation instruction below the event details
- [x] Preserve original webinar conversion tracking, event details, physician-information action, support line, the page-three confirmation flow, and all unrelated behavior
- [x] Validate messaging, tracking isolation, action destinations, desktop/mobile layout, 7 focused confirmation checks and all 209 tests across 42 files, TypeScript, production build, route health, and zero relevant post-change runtime errors
- [x] Save and deliver the original webinar reply-YES confirmation-page checkpoint

## Homepage Dual Appointment Actions

- [x] Inspect the homepage primary CTA area, current physician appointment behavior, reusable dialog components, and focused coverage
- [x] Add a clear 45-minute Dr. Al-Deek appointment pill and a separate free 15-minute care-team discovery-call pill on the homepage
- [x] Present the supplied SendMeAPro care-team calendar on its existing accessible public booking page with clear program-information/non-medical-advice context
- [x] Preserve existing physician appointment/payment/intake behavior, homepage content, webinar flows, and unrelated site behavior
- [x] Update focused coverage and validate distinct booking paths, provider calendar rendering after initialization, desktop/mobile layout, 2 focused checks and all 211 tests across 43 files, TypeScript, production build, homepage and care-team route HTTP 200 responses, and current logs with no new first-party 5xx responses
- [x] Save and deliver the homepage dual-action checkpoint

## Homepage lower discovery-call action — 2026-09-09

- [x] Inspect the lower homepage “Have questions? Call Now” action, route, and focused coverage
- [x] Replace it with the approved “Questions About Our Program? · Book a Free 15-Minute Call” action routed to `/care-team-booking`
- [x] Preserve the physician booking action and validate responsive layout, lower CTA destination, 3 focused checks and all 212 tests across 43 files, TypeScript, production build, homepage and care-team booking HTTP 200 responses, and current logs with no new first-party errors
- [x] Save and deliver the lower discovery-call action checkpoint

## Homepage lower mobile booking-bar readability fix — 2026-09-09

- [x] Inspect the lower mobile booking-bar layout, fixed-width behavior, text wrapping, and focused coverage
- [x] Stack the physician and discovery-call actions vertically on mobile and use compact, fully readable discovery-call copy
- [x] Preserve both booking destinations and validate stacked mobile layout, desktop breakpoints, 4 focused checks and all 213 tests across 43 files, TypeScript, production build, homepage and care-team booking HTTP 200 responses, and current logs with no new first-party errors
- [x] Save and deliver the mobile booking-bar readability checkpoint

## Homepage restored mobile booking pills — 2026-09-09

- [x] Inspect the current stacked mobile booking bar and focused coverage before restoring the prior pill layout
- [x] Restore the side-by-side rounded mobile booking pills and simplify the discovery action to Book Free 15-Minute Discovery Call
- [x] Preserve both booking destinations and validate compact side-by-side mobile labels, focused/full tests with 213 passing across 43 files, TypeScript, production build, homepage and care-team booking HTTP 200 responses, and current logs with no new first-party errors
- [x] Save and deliver the restored mobile pill-design checkpoint

## Homepage mobile booking-pill wording — 2026-09-09

- [x] Inspect the current lower mobile booking-pill labels and focused coverage before updating the approved copy
- [x] Update the physician pill to Ready to Book? · $50 Deposit Today and the discovery pill to Need More Info? · Free 15-Min Call
- [x] Preserve both booking destinations and validate compact label readability, 4 focused checks and all 213 tests across 43 files, TypeScript, production build, homepage and care-team booking HTTP 200 responses, and current logs with no new first-party errors
- [x] Save and deliver the updated mobile booking-pill wording checkpoint

## Homepage physician CTA abbreviation — 2026-09-09

- [x] Inspect the current physician booking label and focused coverage
- [x] Replace “Appointment” with the approved “Appt.” abbreviation without changing the booking destination
- [x] Validate compact label rendering, 4 focused checks and all 213 tests across 43 files, TypeScript, production build, homepage HTTP 200 response, and current logs with no new first-party errors
- [x] Save and deliver the physician CTA abbreviation checkpoint

## Homepage unified physician booking card — 2026-09-10

- [x] Inspect the current physician booking button, separate price panel, and focused coverage before merging the visual treatment
- [x] Merge the physician action into one fully clickable booking card with Book 45-Min Appt. with Dr. Al-Deek, $199 First Visit, and $50 Deposit Today
- [x] Preserve the physician booking destination, discovery-call action, full-pricing link, and all unrelated homepage behavior; update focused coverage
- [x] Validate desktop/mobile readability, booking behavior, 4 focused checks and all 213 tests across 43 files, TypeScript, production build, homepage HTTP 200 response, and current logs with no new first-party errors
- [x] Save and deliver the unified physician booking-card checkpoint

## Homepage Refined Booking Choices — 2026-09-10

- [x] Inspect the current physician and discovery booking CTA structure, destinations, responsive behavior, and focused coverage
- [x] Add concise self-selection labels above the two booking paths and smaller supporting lines inside each pill
- [x] Use balanced pill heights, clear $199 first-visit and $50 deposit explanation beneath the physician path, and concise non-medical discovery-call guidance beneath the care-team path
- [x] Preserve the existing physician appointment, care-team calendar, pricing-details, payment, intake, webinar, and unrelated site behavior
- [x] Update focused coverage and validate responsive hierarchy, booking destinations, pricing clarity, full tests, TypeScript, production build, route health, and logs
- [x] Save and deliver the refined homepage booking-choice checkpoint

## Homepage Compact Booking-Choice Polish — 2026-09-10

- [x] Inspect the current saved booking-choice spacing, typography, and interaction styling before the compact polish pass
- [x] Strengthen the two self-selection labels and tighten their relationship to the booking pills
- [x] Reduce both pill heights and internal spacing while preserving two readable text lines and equal visual weight
- [x] Refine shadows, explanatory-copy rhythm, and pricing-details spacing without changing approved copy or destinations
- [x] Validate desktop and mobile presentation, focused coverage, full tests, TypeScript, production build, routes, and logs
- [x] Save and deliver the compact booking-choice polish checkpoint

## Mobile Sticky Booking-Control Alignment — 2026-09-10

- [x] Inspect the current sticky physician and care-team controls, text, destinations, and focused coverage
- [x] Keep the physician sticky control as the compact filled primary action with its existing $50-deposit cue
- [x] Restyle the care-team sticky control as a compact secondary action while preserving its free 15-minute information-call cue and calendar route
- [x] Validate responsive presentation, booking destinations, focused coverage, full tests, TypeScript, production build, routes, and logs
- [x] Save and deliver the aligned sticky booking-control checkpoint

## Compact Medication Disclosure Band — 2026-09-10

- [x] Inspect the current compounded-medication and testosterone disclosure markup, approved text, and focused coverage
- [x] Combine the two oversized disclosure cards into one compact always-visible disclosure band with clear internal separation
- [x] Preserve every approved disclosure statement verbatim while reducing padding, typography scale, border weight, and empty vertical space
- [x] Validate disclosure content, desktop/mobile presentation, focused coverage, full tests, TypeScript, production build, routes, and logs
- [x] Save and deliver the compact medication-disclosure checkpoint

## Webinar Confirmation Meta Pixel Events — 2026-09-10

- [x] Inspect the existing event handling and coverage for `/webinar-registration-confirmed` and `/live-webinar3-confirmed`
- [x] Add one supplied Meta Pixel PageView and one Lead event on each confirmation-page load
- [x] Preserve existing confirmation content, confirmation flows, redirects, Meta tracking, and unrelated behavior
- [x] Validate event safeguards, page routes, focused coverage, full tests, TypeScript, production build, and logs
- [x] Save and deliver the webinar confirmation-event checkpoint

## Live Webinar Schedule Update — 2026-09-10

- [x] Inspect date, time, countdown, and registration details across `/live-webinar2`, `/live-webinar3`, `/webinar-registration-confirmed`, and `/live-webinar3-confirmed`
- [x] Update visible event details and countdown configuration to Wednesday, September 23 at 7:30 PM EST on both landing pages and both confirmation pages
- [x] Preserve the existing webinar forms, confirmation routing, Meta Pixel events, and all unrelated content and behavior
- [x] Validate date consistency, countdown behavior, registration routes, focused coverage, full tests, TypeScript, production build, and logs
- [x] Save and deliver the webinar schedule-update checkpoint

## Header Call Now CTA — 2026-09-10

- [x] Inspect the current header phone link, responsive layout, and focused coverage
- [x] Add the approved “Call Now:” label before `(888) 362-7011` while retaining the existing tap-to-call destination
- [x] Preserve the header logo, Patient Login control, responsive spacing, and all unrelated navigation behavior
- [x] Validate desktop/mobile header presentation, phone-link destination, focused coverage, full tests, TypeScript, production build, routes, and logs
- [x] Save and deliver the header Call Now CTA checkpoint

## Header Stacked Call Now CTA — 2026-09-10

- [x] Inspect the current centered header phone call-to-action and its responsive coverage
- [x] Stack and center `CALL NOW` above a larger `(888) 362-7011` within the existing tap-to-call link
- [x] Preserve the homepage header logo, Patient Login control, focus treatment, and all navigation behavior
- [x] Validate desktop/mobile header balance, phone-link destination, focused coverage, full tests, TypeScript, production build, routes, and logs
- [x] Save and deliver the stacked header Call Now CTA checkpoint

## Care-Team Discovery-Call Confirmation — 2026-09-10

- [x] Inspect the care-team booking page, existing confirmation-page patterns, route registration, and conversion-event safeguards
- [x] Create and register `/care-team-booking-confirmed` with free discovery-call confirmation copy and a clear general-information-only, non-medical disclaimer
- [x] Add guarded conversion tracking appropriate to a completed free discovery-call booking without mentioning deposits, payments, or physician visits
- [x] Preserve the existing care-team calendar URL, discovery-call route, webinar confirmation pages, and all unrelated booking behavior
- [x] Validate responsive presentation, tracking safeguards, route health, focused coverage, full tests, TypeScript, production build, and logs
- [x] Save and deliver the care-team discovery-call confirmation checkpoint and GoHighLevel redirect URL

## Thank-You Page Meta Pixel Investigation — 2026-09-10

- [x] Inspect `/thank-you`, the global Meta Pixel installation, route behavior, and existing tracking regression coverage
- [x] Add a guarded page-level Meta `Lead` event alongside the existing appointment completion event so Facebook ad optimization and Test Events can recognize the conversion explicitly
- [x] Preserve existing webinar, discovery-call, payment, and all unrelated Meta Pixel event behavior
- [x] Validate pixel loading and event safeguards, route health, focused coverage, full tests, TypeScript, production build, and logs
- [x] Save and deliver the thank-you page Meta Pixel tracking investigation checkpoint

## Webinar Confirmation Page Meta Pixel Verification — 2026-09-10

- [x] Inspect the published `/webinar-registration-confirmed` and `/live-webinar3-confirmed` pages, their Meta Pixel event code, and focused conversion coverage
- [x] Confirm that no code correction is required: both published pages queue the configured Pixel initialization plus page-level `PageView`, `Lead`, and `CompleteRegistration` events
- [x] Validate the live event queue and rendered routes; the session guard intentionally prevents repeat Lead submissions from the same browser session
- [x] Deliver the verification outcome without changing the published event implementation

## Webinar Meta Event Delivery Repair — 2026-09-10

- [x] Inspect the live Lead-event delivery path for both webinar confirmation pages after Meta Test Events confirmed the published PageView event is received
- [x] Dispatch the approved webinar Lead event during initial page parsing, before React mounts or session-level conversion safeguards can suppress the page-specific event
- [x] Validate the repaired event path, routes, focused coverage, full tests, TypeScript, production build, and current logs
- [x] Save and deliver the verified repair with precise Meta Test Events retest steps

## Webinar Meta Schedule Event — 2026-09-10

- [x] Inspect the current initial-load Meta event bootstrap and coverage for `/webinar-registration-confirmed` and `/live-webinar3-confirmed`
- [x] Replace the webinar-specific standard Meta `Lead` event with the requested `Schedule` event on exactly those two confirmation routes
- [x] Preserve the global PageView event, guarded CompleteRegistration and dataLayer signals, confirmation content, routing, and all unrelated tracking
- [x] Validate event targeting, routes, focused coverage, full tests, TypeScript, production build, and current logs
- [x] Save and deliver the Meta Schedule-event checkpoint and Test Events retest steps

## Webinar Meta Pixel Deduplication — 2026-09-10

- [x] Confirm that the duplicate arises from both direct site code and Google Tag Manager installing Pixel ID `1589326469554181` and dispatching its events
- [x] Remove the redundant direct site Pixel bootstrap while preserving the authoritative Google Tag Manager PageView and Schedule events plus existing guarded completion signals
- [x] Validate one authoritative Google Tag Manager Pixel bootstrap with one route-specific Schedule dispatch per page, route health, focused coverage, full tests, TypeScript, production build, and current logs
- [x] Save and deliver the webinar Meta Pixel deduplication checkpoint and retest steps

## Webinar Meta Schedule Delivery Repair — 2026-09-10

- [x] Inspect the published Schedule-event runtime on `/webinar-registration-confirmed` and `/live-webinar3-confirmed`; the PageView Pixel can initialize after the former two-second Schedule retry window expires
- [x] Replace the short header retry with a single-fire route-level dispatcher that waits up to 60 seconds for the existing GTM-managed Pixel while preserving PageView, completion tracking, confirmation content, routes, and unrelated conversion paths
- [x] Validate delayed Pixel readiness and exactly one Schedule dispatch on both confirmation routes, route health, focused coverage, 221 tests, TypeScript, production build, and current logs
- [x] Save and deliver the Schedule-event repair checkpoint with exact Meta Test Events retest steps

## Webinar Meta CompleteRegistration Event — 2026-09-10

- [x] Inspect the current Schedule and CompleteRegistration dispatch paths on `/webinar-registration-confirmed` and `/live-webinar3-confirmed`
- [x] Replace Schedule with one durable Meta `CompleteRegistration` event on exactly those two confirmation routes and remove the former duplicate page-level completion call
- [x] Preserve the working GTM-managed PageView, single Pixel installation, dataLayer completion signals, confirmation content, routes, and unrelated conversion tracking
- [x] Validate delayed Pixel readiness, exactly one CompleteRegistration dispatch per route, route health, focused coverage, 222 tests, TypeScript, production build, and current logs
- [x] Save and deliver the CompleteRegistration checkpoint with precise Meta Test Events retest steps

## Webinar CompleteRegistration Per-Load Delivery — 2026-09-10

- [x] Inspect the current session-level CompleteRegistration guard and confirm how it can suppress same-session retests
- [x] Replace session-level suppression with per-page-load deduplication on `/webinar-registration-confirmed` and `/live-webinar3-confirmed`
- [x] Preserve one CompleteRegistration per load, the working PageView, single Pixel installation, confirmation content, routes, and unrelated tracking
- [x] Validate first-load and repeat-load behavior, focused coverage, 222 tests, TypeScript, production build, route health, and current logs
- [x] Save and deliver the per-load CompleteRegistration checkpoint with a short Meta Test Events retest procedure

## Explicit Original Webinar CompleteRegistration — 2026-09-10

- [x] Inspect the current `/webinar-registration-confirmed` CompleteRegistration path and duplicate safeguards
- [x] Add an explicit `fbq('track', 'CompleteRegistration')` event to `/webinar-registration-confirmed` and remove its competing helper dispatch
- [x] Leave `/live-webinar3-confirmed`, the GTM-managed PageView, page content, routes, and unrelated tracking unchanged
- [x] Validate one requested event path, focused coverage, 222 tests, TypeScript, production build, route health, and current logs
- [x] Save and deliver the explicit CompleteRegistration checkpoint

## Meta Pixel Full Removal and Verification — 2026-09-10

- [x] Inventory every direct Meta/Facebook Pixel initialization and event call, plus Pixel delivery through Google Tag Manager
- [x] Remove all site-owned Meta Pixel code, event dispatches, helpers, and the GTM bootstrap that currently injects the Pixel; do not add replacement code
- [x] Remove or revise obsolete Pixel tests while preserving page content, routes, forms, payments, and non-tracking behavior
- [x] Verify client source, production build, and rendered pages contain no Meta Pixel library, Pixel ID, `fbq`, Facebook tracking image, Meta conversion event code, or GTM bootstrap
- [x] Run focused coverage, 221 tests, TypeScript, production build, six representative route checks, and current-log checks
- [x] Save a removal-only checkpoint and pause for user verification before installing any new Meta code

## Full Meta Pixel Replacement — 2026-09-10

- [x] Confirm the removal-only baseline contains no Meta Pixel code, event dispatches, helper code, or Google Tag Manager bootstrap
- [x] Install the supplied Pixel ID `1589326469554181` base code once in the global document head for every page, with its noscript fallback
- [x] Install one supplied `Lead` event only on `/webinar-registration-confirmed` and `/live-webinar3-confirmed`
- [x] Prevent duplicate Meta initialization or event firing without restoring Google Tag Manager, while preserving analytics, dataLayer, page content, and routes
- [x] Validate one base initialization, one global PageView, two route-specific Lead statements, zero GTM references, zero other Meta events, browser queues, focused coverage, 221 tests, TypeScript, production build, route health, and current logs
- [x] Save and deliver the full Meta Pixel replacement checkpoint with concise live retest instructions

## Webinar Confirmation Pixel Exclusion — 2026-09-10

- [x] Inspect the global Meta Pixel bootstrap and both webinar confirmation Lead implementations
- [x] Keep the direct Meta Pixel active elsewhere but prevent it from loading on `/webinar-registration-confirmed` and `/live-webinar3-confirmed`
- [x] Remove both confirmation-page Lead event scripts and the global noscript fallback that cannot honor route exclusions
- [x] Preserve confirmation content, routes, registration handoff, dataLayer signals, and unrelated site behavior
- [x] Validate one homepage Pixel init and PageView, complete Pixel absence on both confirmation routes, focused coverage, 221 tests, TypeScript, production build, route health, and current logs
- [x] Save and deliver the route-specific Pixel exclusion checkpoint

## Standalone Webinar Confirmation Pixels — 2026-09-10

- [x] Inspect the current shared HTML and route-aware Pixel state after the interrupted exclusion update
- [x] Install the supplied standalone Meta Pixel block with Pixel ID `1589326469554181`, `PageView`, and `Lead` on `/webinar-registration-confirmed`
- [x] Install the same standalone Meta Pixel block with `PageView` and `Lead` on `/live-webinar3-confirmed`
- [x] Prevent duplicate initialization or events while preserving confirmation content, routes, registration handoff, and non-Facebook dataLayer signals
- [x] Validate exactly one init, one PageView, and one Lead per confirmation page, zero Pixel runtime on ordinary pages, focused coverage, 224 tests, TypeScript, production build, route health, and current logs
- [x] Save and deliver the standalone confirmation-page Pixel checkpoint

## Published Webinar Lead Delivery Repair — 2026-09-10

- [x] Inspect the published original confirmation route; the Meta library request returned zero bytes, `fbq.callMethod` never initialized, the queue remained unconsumed, and no Facebook collection request was sent
- [x] Add a guarded direct Lead collection fallback after three seconds when no outbound Lead request is observed, without duplicating Pixel initialization or PageView
- [x] Preserve both confirmation routes, content, registration handoff, dataLayer signals, and ordinary-page Pixel scope
- [x] Validate one direct Lead collection fallback request on both routes when the Meta library does not consume its queue, focused coverage, 226 tests, TypeScript, production build, route health, and current logs
- [x] Save and deliver the published Lead repair checkpoint with concise Meta Test Events retest steps

## Strong Webinar Confirmation Pixel Exclusion — 2026-09-10

- [x] Superseded after the user approved a standalone Pixel on both webinar confirmation routes instead of excluding them
- [x] Remove the Meta Pixel base code entirely from the shared HTML shell
- [x] Superseded by the approved runtime installation on confirmation routes only; ordinary pages now have no Pixel
- [x] Preserve confirmation content, routes, registration handoff, dataLayer signals, and unrelated behavior
- [x] Validate shared HTML, confirmation-page runtime, ordinary-page absence, focused coverage, full tests, TypeScript, build, route health, and logs under the approved replacement scope
- [x] Deliver through the standalone confirmation-page Pixel checkpoint below

## Published Webinar Lead Delivery Repair — 2026-09-10

- [x] Inspect the published original confirmation route; the Meta library request returned zero bytes, `fbq.callMethod` never initialized, the queue remained unconsumed, and no Facebook collection request was sent
- [x] Add a guarded direct Lead collection fallback after three seconds when no outbound Lead request is observed, without duplicating Pixel initialization or PageView
- [x] Preserve both confirmation routes, content, registration handoff, dataLayer signals, and ordinary-page Pixel scope
- [x] Validate one direct Lead collection fallback request on both routes when the Meta library does not consume its queue, focused coverage, 226 tests, TypeScript, production build, route health, and current logs
- [x] Save and deliver the published Lead repair checkpoint with concise Meta Test Events retest steps

## Care-Team Confirmation Schedule Pixel — 2026-09-10

- [x] Inspect the current route-aware Meta Pixel configuration and `/care-team-booking-confirmed` tracking coverage
- [x] Install Pixel ID `1589326469554181` on `/care-team-booking-confirmed` with exactly one `PageView` and one `Schedule` event
- [x] Prevent duplicate initialization or events while preserving existing webinar Lead tracking, confirmation content, route behavior, and dataLayer signals
- [x] Validate one care-team init, one PageView, one Schedule, no Lead, preserved webinar Lead scope, focused coverage, 226 tests, TypeScript, production build, route health, and current logs
- [x] Save and deliver the care-team Schedule Pixel checkpoint with concise Meta Test Events steps

## Appointment Thank-You CompleteRegistration Pixel — 2026-09-10

- [x] Inspect the route-aware Meta Pixel configuration and `/thank-you` tracking coverage
- [x] Install Pixel ID `1589326469554181` on `/thank-you` with exactly one `PageView` and one `CompleteRegistration` event
- [x] Prevent duplicate initialization or events while preserving care-team Schedule tracking, webinar Lead tracking, page content, route behavior, and dataLayer signals
- [x] Validate one appointment init, one PageView, one CompleteRegistration, no Lead or Schedule, preserved care-team Schedule and webinar Lead scope, focused coverage, 226 tests, TypeScript, production build, route health, and current logs
- [x] Save and deliver the appointment CompleteRegistration Pixel checkpoint with concise Meta Test Events steps

## Live Website Outage Recovery — 2026-09-10

- [x] Pause all further Meta Pixel work until the live website is restored and verified
- [x] Inspect the live homepage response, production deployment logs, and browser console; the screenshot coincided with a clean production rollout restart and no persistent application exception was found
- [x] Confirm no rollback or code recovery is required because the live site recovered after the rollout and no current production errors remain
- [x] Validate five consecutive live homepage HTTP 200 responses, four critical live routes, a clean live desktop render and console, and a successful 390px mobile render
- [x] Save and deliver the stable recovery checkpoint with the confirmed transient rollout status

## Published Appointment CompleteRegistration Delivery Repair — 2026-09-10

- [x] Inspect the published `/thank-you` Pixel library state, queue handoff, and outbound CompleteRegistration request; both the Meta library and collection response were zero-byte in the sandbox browser
- [x] Pause correction work at the user’s request while prioritizing live-site stability; no additional Pixel code change was made
- [x] Preserve appointment content, payment flow, route behavior, dataLayer signals, care-team Schedule, and webinar Lead tracking
- [x] Confirm the existing published site and critical routes are healthy before any future CompleteRegistration troubleshooting resumes
- [x] Defer the CompleteRegistration repair checkpoint until the user explicitly resumes Pixel work

## Direct Live Client Error Fix — 2026-09-10

- [x] Restore the current feature-complete project version; do not use the older rollback or remove recent Pixel and confirmation-page work
- [x] Identify the stale-asset or client-runtime failure path that triggers the global unexpected-error boundary
- [x] Compare the current deployment with stable checkpoint `8083601e` to identify which later change introduced the failure and document whether direct repair or rollback is safer
- [x] Add targeted one-time recovery for failed dynamic imports or stale deployment assets without altering current features
- [x] Preserve all homepage, booking, payment, webinar, confirmation-page, and Meta Pixel work
- [x] Validate recovery behavior, desktop/mobile rendering, critical routes, 234 tests, TypeScript, production build, and current logs
- [x] Save and deliver the direct-fix checkpoint with concise publish and refresh instructions

## Browser-Specific Production 404 Investigation — 2026-09-10

- [x] Inspect the supplied screenshot and confirm the failing browser received a host-level 404 before React loaded
- [x] Audit `medmethoddirect.com`, `www.medmethoddirect.com`, and the Manus deployment domain across cache-busted requests, redirects, protocols, user agents, IPv4 edges, and repeated requests
- [x] Correlate the 7:34 PM screenshot with production server restarts at 7:34:06–7:34:07 PM and identify a transient deployment-edge routing window rather than browser data, DNS, React, Pixel, or application configuration
- [x] Preserve the direct client-error recovery and all homepage, booking, payment, webinar, confirmation-page, and Pixel work
- [x] Make no project-code correction because current routing and application evidence show none is necessary
- [x] Validate 12 repeated successful responses on each public hostname, both active apex IPv4 edges, Safari and Chrome user agents, root/www redirects, a fresh live browser render, and provide exact refresh remediation

## Care-Team Booking Confirmation Redirect — 2026-09-10

- [x] Confirm the homepage free 15-minute call action continues to open `/care-team-booking`
- [x] Inspect the embedded care-team calendar’s successful-booking signals and current redirect behavior
- [x] Prepare the trusted parent URL handoff for the provider’s successful-booking redirect signal while preserving dynamic parameters
- [x] Preserve the configured completed-booking redirect from `/care-team-booking` to `/care-team-booking-confirmed`; end-to-end live booking verification is explicitly paused with the calendar-data feature at the user’s request
- [x] Prepare the website-side confirmation handoff and document the exact HighLevel redirect template supplied by the user
- [x] Preserve the physician booking, webinar registration, payment, homepage, and unrelated tracking flows
- [x] Validate the dedicated confirmation page’s Schedule conversion event, focused/full tests, TypeScript, build, and responsive routes
- [x] Save the care-team redirect checkpoint with the exact required calendar-provider setting; live successful-booking verification remains separately pending above

## Care-Team Dynamic Add to Calendar — 2026-09-10

- [x] Read the GoHighLevel redirect parameters `contact_id`, `start`, `timezone`, and `location` on `/care-team-booking-confirmed`
- [x] Derive the event end time as 15 minutes after the validated booking start time
- [x] Add a small branded Add to Calendar dropdown with Google Calendar, Outlook/Office 365, and Apple Calendar options
- [x] Generate Google UTC dates, Outlook ISO 8601 start/end values, and a standards-compliant downloadable `.ics` event
- [x] Keep contact ID out of calendar links/files and avoid exposing patient or medical information
- [x] Show the calendar action only when valid dynamic booking details are present and provide a graceful fallback otherwise
- [x] Preserve the existing booking redirect behavior, timing, confirmation content, Schedule Pixel, and dataLayer event
- [x] Add focused regression tests and run the full 243-test suite, TypeScript, production build, route health, desktop/mobile rendering, dropdown interaction, and `.ics` download validation
- [x] Save and prepare delivery of the verified dynamic Add to Calendar checkpoint (`3ebb9452`)

## Care-Team Booking Webhook Calendar Data — 2026-09-11

- [x] Define the GoHighLevel webhook URL, authenticated payload contract, and contact-ID-only confirmation redirect
- [x] Add durable seven-day booking-calendar storage keyed by a one-way keyed contact-ID hash with no patient names, phone numbers, email addresses, or medical information
- [x] Add authenticated, idempotent webhook ingestion for `contact_id`, `start`, `timezone`, and `location`
- [x] Add a minimal no-store public lookup that returns appointment calendar data only for an exact contact ID and never returns the identifier itself
- [x] Handle webhook-before-redirect and redirect-before-webhook timing safely with bounded 45-second confirmation-page retries
- [x] Update Add to Calendar to use webhook lookup data while preserving direct query-field fallback for compatibility
- [x] Preserve the existing GoHighLevel success redirect timing, care-team Schedule Pixel, dataLayer event, and all unrelated booking/payment/webinar flows
- [x] Add and apply the non-destructive schema migration plus focused tests for authentication, validation, idempotency, lookup privacy, retry behavior, calendar links, and ICS output
- [x] Run 250 tests across 52 files, TypeScript, production build, authenticated/unauthenticated endpoint smoke checks, six critical route checks, and responsive confirmation-page validation
- [x] Save and prepare delivery of webhook checkpoint `73211484` with exact GoHighLevel URL, authentication header, payload, redirect template, and live test steps

## Care-Team Confirmation Native Calendar Layout — 2026-09-11

- [x] Replace the compact calendar dropdown with a branded details block showing `15 min`, the full start/end range and date, meeting link, and timezone from resolved webhook data
- [x] Add three stacked full-width actions labeled Google Calendar, Outlook Calendar, and iCloud Calendar with clear calendar/provider icons
- [x] Preserve Google and Outlook external calendar creation plus the existing standards-compliant Apple `.ics` download behavior
- [x] Keep the webhook pending/timeout state, contact-ID lookup, direct-query fallback, redirect timing, Schedule Pixel, dataLayer event, and all other confirmation-page content unchanged
- [x] Add focused layout/content regression coverage and validate calendar values, links, download, accessibility, TypeScript, 250 tests across 52 files, production build, six critical routes, and desktop/mobile rendering
- [x] Save and prepare delivery of refined care-team calendar-layout checkpoint `04ef42c0` while retaining the pending real-booking verification

## GoHighLevel Webhook Envelope Compatibility — 2026-09-11

- [x] Inspect the current invalid-payload path and production request evidence without recording or exposing raw contact data
- [x] Add an authenticated sanitized diagnostic that reports only JSON field paths and value types for invalid payloads
- [x] Accept `contact_id`, `start`, `timezone`, and `location` from GoHighLevel `customData` objects, key-value arrays, `data` wrappers, and standard contact/appointment envelopes while retaining flat top-level compatibility
- [x] Keep unknown standard GoHighLevel contact fields ignored and prevent names, phone numbers, email addresses, or other values from logs and responses
- [x] Add focused tests for flat, nested object, nested array, standard envelopes, malformed, unauthorized, sanitized-diagnostic, privacy, and idempotent storage behavior
- [x] Run 254 tests across 52 files, TypeScript, production build, authenticated sanitized-diagnostic endpoint checks, and six critical route health validations
- [x] Save and deliver compatibility checkpoint `a8c4f1e1`; confirm the published live GoHighLevel retry returned HTTP 200 `{"ok":true}` and production logged successful calendar-detail storage without contact data

## GoHighLevel Appointment Start-Time Compatibility — 2026-09-11

- [x] Add a temporary authenticated `invalid_calendar_data` diagnostic that returns only the rejected `start` string and its type
- [x] Keep contact ID, name, email, phone, location, and the remaining request body out of diagnostics and logs
- [x] Temporarily return the rejected `timezone` string and its type in the same authenticated date-only diagnostic
- [x] Capture the exact GoHighLevel start output as `Monday, September 14, 2026 11:15 AM`
- [x] Publish the temporary diagnostic and capture GoHighLevel outputs: weekday-prefixed start strings such as `Monday, September 14, 2026 10:30 AM` and timezone abbreviations such as `EDT`
- [x] Add deterministic fixed-offset support for `EST` (-05:00), `EDT` (-04:00), `CST` (-06:00), `CDT` (-05:00), `MST` (-07:00), `MDT` (-06:00), `PST` (-08:00), and `PDT` (-07:00)
- [x] Extend the shared server/client date parser for the confirmed weekday-prefixed GoHighLevel start format while retaining existing ISO, named-month, abbreviated-month, numeric, and IANA-zone support
- [x] Remove both temporary raw start and timezone diagnostic echoes after the confirmed formats are covered
- [x] Add focused format, privacy, webhook-storage, lookup, redirect, calendar-link, and ICS regression coverage, including all eight supported US timezone abbreviations
- [x] Run 257 tests across 52 files, TypeScript, production build, six critical route checks, and desktop/mobile confirmation rendering with the confirmed GHL start and `EDT` values
- [x] Save final parser checkpoint `443e3692`; live calendar-display verification was superseded when the user paused and removed the feature before production use

## Pause Care-Team Add to Calendar — 2026-09-11

- [x] Restore `/care-team-booking-confirmed` to its original pre-calendar presentation with no appointment details, provider buttons, polling state, or processing messages
- [x] Preserve `/care-team-booking` to `/care-team-booking-confirmed` redirect behavior, confirmation copy, Schedule Pixel, and dataLayer event
- [x] Detach the paused client calendar lookup from the confirmation page so no unfinished appointment-data handling is exposed to real bookers; retain the authenticated dormant backend for a future approved resumption
- [x] Preserve all homepage, physician booking, payment, webinar, email, and unrelated tracking behavior
- [x] Update regression coverage and validate the original desktop/mobile confirmation page, absence of calendar messaging, 258 tests across 52 files, TypeScript, production build, six critical routes, and clean post-restoration runtime logs
- [x] Save and prepare delivery of the targeted pre-calendar restoration checkpoint with clear publish instructions
