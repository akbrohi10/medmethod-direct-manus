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
