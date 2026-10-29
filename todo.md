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

## Paid-Booking Exit Care-Team Fallback — 2026-09-11

- [x] Inspect the active homepage 45-minute payment modal’s exit confirmation and existing care-team CTA design
- [x] Add a compact `NEED MORE INFO?` section below the existing exit choices on the homepage flow only
- [x] Add `BOOK A FREE 15-MINUTE CALL` with `with our Care Team` and the general-information-only supporting copy
- [x] Add a secondary text link, `Prefer to talk now? Call (888) 362-7011`, beneath the booking CTA without introducing another large competing button
- [x] Navigate the fallback CTA directly to `/care-team-booking` while preserving Continue Where I Left Off and Not Today behavior
- [x] Make the phone option a direct `tel:+18883627011` link and keep the three engagement paths visually distinct and uncluttered
- [x] Preserve the paid booking, payment, referral, email, webinar, Pixel, landing-page modal, and unrelated homepage flows
- [x] Add regression coverage and validate the active modal visually, direct care-team navigation, 261 tests across 53 files, TypeScript, production build, six critical routes, and current runtime logs
- [x] Save and prepare delivery of the verified exit-modal fallback checkpoint with clear publish instructions

## Mobile Intake Modal Visibility & Notification Overlap — 2026-09-11

- [x] Inspect the active homepage intake modal and social-proof notification positioning at mobile Safari dimensions
- [x] Move the homepage intake modal into an upper-centered mobile position while retaining readable form content
- [x] Reserve protected bottom space so the purple Next button remains visible above mobile browser chrome
- [x] Ensure social-proof notifications cannot cover the active intake-form action area
- [x] Add an unobtrusive dismiss control for the social-proof notification as a secondary fallback
- [x] Preserve the intake questions, step progress, payment, exit fallback, care-team booking, and desktop behavior
- [x] Add regression coverage and validate mobile/desktop modal layout, booking flow, 264 tests across 54 files, TypeScript, build, six critical routes, and clean post-repair runtime logs
- [x] Save and prepare delivery of the verified mobile intake usability checkpoint with publish instructions

## Webinar Featured In Logo Additions — 2026-09-11

- [x] Inspect the existing Featured In rotating logo implementation on `/live-webinar2` and `/live-webinar3`
- [x] Prepare the supplied This Is Menopause and Woman’s World logo assets for the web asset store
- [x] Add both logos with matching scale, spacing, and rotation behavior on both webinar landing pages
- [x] Add or update regression coverage for the two additional Featured In brands
- [x] Validate desktop and mobile banner legibility, rotation, 265 tests across 54 files, TypeScript, production build, web-asset redirects, and both webinar routes
- [x] Save and prepare delivery of the verified Featured In update with publish instructions

## Homepage Featured In Banner — 2026-09-13

- [x] Inspect the active homepage hero layout around the doctor image and booking CTA choices
- [x] Reuse the eight approved publication assets and existing accessible marquee behavior
- [x] Add a compact rotating Featured In banner below the doctor image and above the paid/free booking choices
- [x] Preserve mobile CTA visibility, notification safety, booking modal, payment, referral, and care-team flows
- [x] Add regression coverage and validate desktop/mobile hierarchy, marquee motion, 268 tests across 55 files, TypeScript, production build, and homepage route
- [x] Save and prepare delivery of the verified homepage Featured In banner with publish instructions

## Homepage Featured In Marquee Continuity Repair — 2026-09-13

- [x] Reproduce and identify the initial logo pop or jump when the homepage Featured In rotation first loads
- [x] Correct image readiness or marquee track geometry without changing the banner’s design, logos, or accessibility
- [x] Validate first-cycle and sustained-loop continuity on desktop and mobile, 268 tests across 55 files, TypeScript, production build, homepage route, and clean current runtime logs
- [x] Save and prepare delivery of the verified marquee continuity repair with publish instructions

## Webinar Featured In Marquee Continuity Repair — 2026-09-13

- [x] Inspect the `/live-webinar2` and `/live-webinar3` Featured In marquee implementations and tests
- [x] Add the homepage-proven asset-readiness gate to both webinar marquees without changing banner design or content
- [x] Validate first-load and sustained marquee continuity, webinar page layouts, 268 tests across 55 files, TypeScript, production build, both routes, and clean current runtime logs
- [x] Save and prepare delivery of the synchronized webinar marquee repair with publish instructions

## Payment-Step Referral Placement — 2026-09-13

- [x] Inspect the active homepage payment step, card fields, referral application state, pricing copy, and tests
- [x] Move the optional referral control directly below card details for both Stripe and PayPal without changing payment or referral validation logic
- [x] Show clear adjusted deposit and remaining-balance feedback only after a valid referral code is applied
- [x] Validate source-level card-to-referral order, referral application, existing booking/payment paths, 268 tests across 55 files, TypeScript, production build, homepage route, and clean current client logs
- [x] Save and prepare delivery of the verified payment-step referral placement with publish instructions

## Evergreen Free Masterclass Landing Page — 2026-09-14

- [x] Inspect reusable Live Webinar 3, Featured In marquee, placeholder video, physician booking, care-team booking, transparent pricing, and calendar embed implementations
- [x] Create and register the evergreen `/free-masterclass` route without modifying the live webinar routes
- [x] Use the existing saved webinar video as a clearly replaceable placeholder with immediate, ungated playback
- [x] Add a compact rotating Featured In strip near the top and remove all live-event, countdown, RSVP, Zoom, and date-specific language
- [x] Add a concise post-video paid physician booking CTA and secondary free 15-minute care-team CTA using existing destinations
- [x] Add a compact accessible See Full Pricing Details accordion with the approved transparent initial-consultation and follow-up information
- [x] Embed the existing free care-team calendar lower on the page with a general-information-only disclaimer
- [x] Preserve physician intake/payment, care-team confirmation redirect, pricing/referral behavior, webinars, tracking, and unrelated routes
- [x] Add regression coverage and validate the video, CTA destinations, pricing accordion, calendar embed, mobile/desktop layout, 271 tests across 56 files, TypeScript, production build, and critical routes
- [x] Save and prepare delivery of the verified evergreen masterclass checkpoint with clear placeholder-video and publish instructions

## Streamline Free Masterclass Care-Team Section — 2026-09-14

- [x] Inspect the lower embedded care-team calendar section and its masterclass regression coverage
- [x] Remove the lower calendar heading, general-information disclaimer, and GoHighLevel embed from `/free-masterclass`
- [x] Remove only now-unused calendar handoff code and imports while retaining the compact free care-team booking CTA
- [x] Preserve the masterclass video, Featured In strip, physician intake CTA, pricing accordion, footer, and all unrelated booking flows
- [x] Validate the streamlined desktop/mobile page, retained care-team booking destination, 271 tests across 56 files, TypeScript, production build, and masterclass route
- [x] Save and prepare delivery of the verified streamlined masterclass checkpoint with publish instructions

## Facebook Domain Verification Meta Tag — 2026-09-14

- [x] Inspect the shared document head and existing verification metadata
- [x] Add the supplied `facebook-domain-verification` meta tag without changing other head or tracking code
- [x] Add regression coverage for the exact supplied verification tag
- [x] Validate source, focused regression test, TypeScript, production build output, and homepage route
- [x] Save and prepare delivery of the publishable verification-tag checkpoint

## Homepage Outcome-Focused Appointment Copy — 2026-09-15

- [x] Inspect the active homepage appointment description and focused regression coverage
- [x] Replace the opening description with the approved outcome-focused wording about helping visitors feel more like themselves again
- [x] Preserve the appointment length, physician attribution, CTA labels, pricing, booking paths, and surrounding layout
- [x] Add focused regression coverage for the approved outcome-focused copy
- [x] Validate the updated copy, focused regression test, TypeScript, production build, and homepage route
- [x] Save and prepare delivery of the homepage copy checkpoint with publish instructions

## Free Masterclass Symptom-First Introduction — 2026-09-15

- [x] Inspect the existing approved symptom-first landing-page treatment, masterclass introduction, shared headshot, and focused regression coverage
- [x] Replace the masterclass pre-video introduction with the approved `For Women 35+` symptom-first hierarchy and physician authority card
- [x] Retain clear on-demand masterclass context immediately near the video without reintroducing live-event language
- [x] Preserve the existing preview video, Featured In strip, physician booking CTA, care-team CTA, pricing accordion, footer, routes, and tracking
- [x] Add focused regression coverage for the approved symptom-first introduction
- [x] Validate desktop/mobile hierarchy, video visibility, booking behavior, 273 tests across 58 files, TypeScript, production build, and masterclass/home/care-team route health
- [x] Save and prepare delivery of the refined masterclass-introduction checkpoint with publish instructions

## Free Masterclass Header and Featured In Hierarchy — 2026-09-15

- [x] Inspect the current masterclass header, Featured In strip, physician authority-card order, footer, and focused regression coverage
- [x] Remove the top logo and call-now header without changing its homepage or other-route usage
- [x] Place the rotating purple Featured In strip directly above Dr. Al-Deek’s authority card in the symptom-first introduction
- [x] Add the MedMethod Direct logo and accessible Call Now number to the masterclass footer
- [x] Preserve the symptom-first opening, on-demand video, booking actions, pricing accordion, marquee motion, routes, and tracking
- [x] Add focused regression coverage for the requested visual ordering and retained footer contact access
- [x] Validate desktop/mobile hierarchy, logo and phone accessibility, video and booking visibility, 274 tests across 58 files, TypeScript, production build, and masterclass/home route health
- [x] Save and prepare delivery of the reorganized masterclass hierarchy checkpoint with publish instructions

## Free Masterclass Top Context Banner — 2026-09-15

- [x] Inspect the current masterclass introduction and focused regression coverage for the top-banner insertion point
- [x] Add the compact rounded pink-to-purple `Free 45-Minute On-Demand Masterclass` banner above the symptom hook
- [x] Add the supporting `Because You Deserve to Know.` subtitle without introducing live-webinar language
- [x] Preserve the symptom-first hierarchy, Featured In strip, authority card, video, booking paths, pricing accordion, footer, routes, and tracking
- [x] Add focused regression coverage for the approved banner and subtitle
- [x] Validate desktop/mobile first-screen hierarchy, video visibility, booking preservation, 274 tests across 58 files, TypeScript, production build, and masterclass route health
- [x] Save and prepare delivery of the on-demand masterclass banner checkpoint with publish instructions

## Live Facebook Domain Verification Detection — 2026-09-15

- [x] Inspect the published apex, www, and Manus deployment-domain HTML for the exact `facebook-domain-verification` meta tag
- [x] Compare the live HTML with `client/index.html` and the latest published checkpoint state
- [x] Identify that Facebook receives crawler-specific Express HTML, which lacked the verification tag even though the React document head includes it
- [x] Add the same exact verification tag to crawler-specific HTML without changing social preview, Pixel, or conversion code
- [x] Add regression coverage that protects the verification tag in Facebook’s crawler response
- [x] Validate the exact tag in local regular and Facebook-crawler HTML, focused tests, 274 full tests, TypeScript, production build, and home route health without changing Meta Pixel events or conversion tracking
- [x] Publish the crawler-response correction and recheck the exact tag in Facebook-user-agent production HTML across the canonical apex and www domains
- [x] Save and prepare delivery of the crawler-response correction checkpoint with clear Facebook retry guidance

## Homepage Patient-Volume Credibility Line — 2026-09-15

- [x] Confirm the published Facebook crawler response now includes the exact verification tag after deployment on both apex and www canonical requests
- [x] Inspect the active homepage hero and focused regression coverage for a compact credibility-line insertion point
- [x] Add `10,000+ Patients Seen` immediately above the paid and free booking choices with restrained supporting text
- [x] Preserve the doctor image, Featured In strip, booking CTAs, payment flow, care-team flow, notification behavior, and responsive layout
- [x] Add focused regression coverage for patient-proof copy and placement before booking actions
- [x] Validate live Facebook tag on apex and www crawler responses, homepage desktop/mobile hierarchy, booking visibility, 275 tests across 58 files, TypeScript, production build, and route health
- [x] Save and prepare delivery of the verified homepage credibility update with Facebook retry guidance and publish instructions

## Homepage Patient-Volume Proof Simplification — 2026-09-15

- [x] Inspect the current homepage patient-volume badge and focused test coverage
- [x] Replace the icon, border, capsule, and supporting subtext with one centered proof line: `Dr. Al-Deek has seen 10,000+ patients.`
- [x] Preserve Featured In, booking actions, payment flow, care-team flow, and responsive spacing
- [x] Validate mobile and desktop clarity, booking visibility, 275 tests across 58 files, TypeScript, production build, and homepage route
- [x] Save and prepare delivery of the verified simplified patient-volume proof with publish instructions

## Landing-Page Patient-Volume Proof — 2026-09-15

- [x] Inspect `/live-webinar2`, `/live-webinar3`, and `/free-masterclass` for compact proof-line placement and focused coverage
- [x] Add the exact single line `Dr. Al-Deek has seen 10,000+ patients.` to all three pages with no icon, badge, card, or supporting subtext
- [x] Preserve page-specific on-demand/live context, video access, Featured In, booking actions, pricing, calendar, tracking, and responsive layouts
- [x] Add focused regression coverage for copy and proof placement before the primary CTA on all three pages
- [x] Validate desktop/mobile clarity, video and booking visibility, 275 tests across 58 files, TypeScript, production build, all three routes, and current runtime logs
- [x] Save and prepare delivery of the verified three-page proof update with publish instructions

## Google Tag Manager Container Installation — 2026-09-17

- [x] Inspect the shared visitor-facing document template and confirm no existing Google Tag Manager container is installed
- [x] Add the supplied `GTM-KMBG6HSR` bootstrap script directly after the required document character-set declaration, ahead of existing third-party scripts
- [x] Add the supplied `GTM-KMBG6HSR` noscript iframe immediately after the opening visitor-facing body tag
- [x] Add focused regression coverage for the unique container ID and required head/body placements
- [x] Run focused and full validation, build, route checks, and save a publishable checkpoint

## Landing-Page Patient-Volume Proof Update — 2026-09-17

- [x] Update the exact proof line to `Dr. Al-Deek has seen 50,000+ patients.` on `/live-webinar2`, `/live-webinar3`, and `/free-masterclass`
- [x] Preserve the homepage proof line and all layouts, CTA placement, video, booking, payment, calendar, and tracking behavior
- [x] Update focused regression coverage for all three requested landing pages
- [x] Run focused and full validation, route checks, and production build; then save a publishable checkpoint
- [x] Confirm in the preview browser that all three requested landing pages render one visible `Dr. Al-Deek has seen 50,000+ patients.` line before their primary next-step action

## Homepage Patient-Volume Proof Update — 2026-09-17

- [x] Update the homepage proof line to `Dr. Al-Deek has seen 50,000+ patients.`
- [x] Preserve the existing simple one-line styling and placement immediately before the booking choices
- [x] Update focused homepage proof regression coverage
- [x] Run focused and full validation, homepage route and visual checks, and production build; then save a publishable checkpoint
- [x] Pass focused coverage, 277 full tests, TypeScript, production build, and HTTP 200 checks confirming exactly one `50,000+` proof line on the homepage and all three landing pages
- [x] Confirm in the preview browser that the homepage renders the updated proof line clearly above the unchanged paid and free booking choices

## Webinar Autoplay Overlay Reliability — 2026-09-18

- [x] Confirm that `/live-webinar2` and `/live-webinar3` currently autoplay muted and restart from 0:00 with sound after clicking the large overlay
- [x] Identify the smaller purple play control as the generic fallback displayed when autoplay is blocked by a browser or privacy setting
- [x] Initialize both videos muted in the rendered HTML and playback logic to maximize browser-approved autoplay reliability
- [x] Replace the generic smaller fallback with the same prominent sound-start overlay, preserving a consistent next step if autoplay is blocked
- [x] Preserve the click action that restarts the video from the beginning and enables sound
- [x] Validate focused and full tests, type checks, production build, browser autoplay and restart behavior, then save a publishable checkpoint

## Webinar Inline Playback Lock — 2026-09-18

- [x] Confirm native video controls can provide a browser path into a full-screen player despite existing inline attributes
- [x] Keep both webinar videos frame-only by removing native controls and disabling direct video pointer interaction
- [x] Reinforce inline playback before the user-triggered sound restart and immediately exit a legacy WebKit fullscreen transition if one occurs
- [x] Preserve the large purple sound-start panel and its restart-from-0:00-with-sound behavior
- [x] Add regression coverage that prohibits native controls and preserves inline playback safeguards
- [x] Run focused and full validation, browser interaction checks, and production build; then save a publishable checkpoint

## Webinar Lead Ad Attribution — 2026-09-18

- [x] Confirm the webinar registration form is a GoHighLevel iframe, so DOM-based External Tracking cannot inspect its submitted fields
- [x] Forward paid-ad UTM fields and click identifiers from the webinar landing URL into the hosted GoHighLevel form URL on both live webinar pages
- [x] Label each submission with a separate GoHighLevel Source value for `/live-webinar2` or `/live-webinar3`, without replacing the ad attribution fields
- [x] Add focused source-level regression coverage and an operating guide with the exact Meta Ads Manager tracking template
- [x] Validate the website, verify forwarded iframe URLs in the browser, save a checkpoint, and provide the one required GoHighLevel Source-field step

## External Blog Destination — 2026-09-20

- [x] Set `https://drjumanaaldeek.com/blog` as the single canonical destination for site-owned Blog calls to action
- [x] Route the prior `/blog` index and individual `/blog/:slug` article URLs to the external blog so older internal links remain functional
- [x] Update the shared homepage and secondary footers, legacy navigation, and blog-section calls to action to point directly to the new destination
- [x] Add regression coverage for the direct links and legacy route redirect
- [x] Run focused and full validation, HTTP redirect checks, save a checkpoint, and confirm publishing status

## Homepage Booking Flow Revision — 2026-09-21

- [x] Put the free 15-minute care-team call in the primary/first booking position on the desktop hero and mobile sticky action row; move the 45-minute physician visit to the secondary position without changing either action’s copy, subtext, destination, or calendar behavior.
- [x] Route only the homepage physician action directly to the secure $50 checkout step, retaining the complete reusable intake flow for all other entry points. The checkout-first path safely collects the minimal existing payment-record identity details before secure card fields initialize.
- [x] Add the approved checkout sentence directly above payment fields: `Make your $50 deposit now to lock in your appointment.`
- [x] Replace the care-team confirmation’s former `Your Free Call Is Confirmed.` headline with the existing scheduled-call sentence, promoted into the same bold serif headline treatment; preserve the confirmation icon, label, expectations box, disclaimer, CTA, tracking, and absence of paused calendar UI.
- [x] Validate with focused coverage (29 tests), full suite (289 tests across 63 files), TypeScript, production build, HTTP 200 route checks for homepage, care-team, confirmation, webinar, and masterclass routes, desktop interaction checks, and 375 px mobile screenshots.

## Homepage Two-Step Physician Booking — 2026-09-21

- [x] Replace the homepage-only checkout-first physician action with a two-step path while retaining the complete reusable nine-step intake flow for all other entry points.
- [x] Add Step 1 of 2 with only Name, Email address, and Phone number; validate all three values before payment initialization so the payment forms always receive the required patient identity data.
- [x] Add Step 2 of 2 to the existing $50 secure deposit screen, retain the exact approved deposit sentence above the payment fields, and provide Back navigation that preserves entered contact details.
- [x] Match both new progress labels to the existing uppercase step-indicator treatment: `STEP 1 OF 2` and `STEP 2 OF 2`.
- [x] Preserve homepage layout, desktop/mobile booking-action order, payment/referral flow, calendar behavior, webhooks, tracking, and all non-homepage intake paths.
- [x] Validate focused coverage (28 tests), full suite (291 tests across 63 files), TypeScript, production build, route HTTP 200 checks, desktop contact-to-payment browser flow, back navigation, and 375 px mobile homepage review without initiating a real payment.

## Payment Screen Clarity Refinement — 2026-09-21

- [x] Replace repetitive deposit language with a concise scheduling-focused payment headline: `Reserve Your Appointment & Choose Your Time`.
- [x] State clearly that the $50 deposit is paid today and that the next screen presents Dr. Al-Deek’s calendar to choose the preferred date and time.
- [x] Retain the total first-visit price, remaining-balance timing, and 24-hour full-refund policy while removing duplicate deposit/hold-your-spot language.
- [x] Preserve the two-step booking flow, payment fields, Stripe/PayPal behavior, referral logic, calendar transition, payment webhooks, tracking, and all existing page styling.
- [x] Validate focused coverage (21 tests), full suite (291 tests across 63 files), TypeScript, production build, critical route HTTP 200 checks, and desktop/mobile visual review without submitting a payment.

## Care-Team Confirmation Copy Refinement — 2026-09-21

- [x] Shorten the confirmation headline to `Your Free 15-Minute Call Is Scheduled.` while retaining the existing serif font, size, weight, and responsive two-line treatment.
- [x] Add a clear text-message confirmation reminder directly below the headline: `Please reply to the text message you'll receive to confirm your spot.`
- [x] Add a plain-text calendar reminder beside the existing appointment-detail reminder: `Don't forget to add this appointment to your calendar.`
- [x] Preserve the icon, discovery-call label, expectations card, general-information-only disclaimer, CTA, Schedule tracking, redirect destination, and the explicitly paused/absent Add-to-Calendar UI.
- [x] Validate focused coverage (4 tests), full suite (291 tests across 63 files), TypeScript, production build, critical route HTTP 200 checks, and desktop/375 px mobile visual review.

## Appointment Thank-You Calendar Reload Repair — 2026-09-23

- [x] Change the completed $50 deposit handoff to a full document navigation to `/thank-you` after the established GHL payment webhook, matching the reliable state reached by a manual refresh.
- [x] Prioritize the existing Dr. Al-Deek GHL calendar iframe with eager loading so calendar initialization begins immediately on the thank-you page.
- [x] Preserve the payment confirmation content, existing GHL calendar URL, payment/referral behavior, scheduled-charge behavior, tracking, and all unrelated booking flows.
- [x] Add regression coverage for the fresh payment handoff and eager appointment-calendar embed; validate focused tests, 293 full tests across 63 files, TypeScript, production build, critical route HTTP 200 checks, and mobile/desktop thank-you review.

## Tracking Payload Cleanup — 2026-09-24

- [x] Audit source-owned GTM, dataLayer, and Meta confirmation tracking, plus the published GTM container runtime; no condition-specific `content_name` or `content_category` values were present in the published container.
- [x] Standardize both webinar Lead dataLayer payloads to the neutral metadata `content_name: "Webinar Registration"` and `content_category: "Lead"`, while preserving their existing event names, confirmation routes, visible content, and Meta standard Lead event.
- [x] Keep direct Meta confirmation calls parameter-free and preserve all URL paths, booking/payment flows, GTM installation, and public page copy.
- [x] Validate focused tracking tests, 296 full tests across 64 files, TypeScript, production build, critical route HTTP 200 checks, and a production-source scan showing no condition-specific tracking payload values.

## Full On-Demand Masterclass Recording — 2026-09-27

- [x] Upload the supplied 65-minute H.264/AAC masterclass recording and a frame from the session as its web poster to secure project storage.
- [x] Update only `/free-masterclass`; the homepage, `/live-webinar2`, and `/live-webinar3` remain unchanged.
- [x] Replace the temporary preview source and preview label with the full recording, accurately label the page as an on-demand masterclass, and state that it includes the recorded live Q&A with Dr. Al-Deek.
- [x] Add accessible, visible playback-speed choices—0.75x, 1x, 1.25x, and 1.5x—while retaining native video controls and inline playback.
- [x] Validate focused coverage, 297 full tests across 64 files, TypeScript, production build, storage asset availability, desktop/mobile visual review, live player metadata, speed switching to 1.5x, and HTTP 200 checks for the masterclass plus unaffected critical routes.

## Masterclass Static Video Placeholder — 2026-09-27

- [x] Remove the full recording player and all playback-speed controls from `/free-masterclass` while keeping its dedicated URL and the rest of its page structure intact.
- [x] Retain a static visual frame from the supplied recording as the placeholder, with clear non-interactive `Masterclass Recording Coming Soon` language and accurate recorded-Q&A context.
- [x] Preserve the homepage, webinar landing pages, booking paths, pricing, payment flows, care-team flows, tracking, Featured In section, and page design.
- [x] Validate focused coverage, 297 full tests across 64 files, TypeScript, production build, route HTTP 200 checks, and desktop/mobile visual review.

## Video-First Masterclass Variant — 2026-09-27

- [x] Create a separate, concise `/masterclass` page without changing the original `/free-masterclass` page.
- [x] Place only the on-demand label, concise video promise, and full-width static recording placeholder above the fold; move booking choices, pricing, and Featured In below it.
- [x] Preserve the established physician intake action, care-team booking link, pricing, legal framing, and patient-volume proof; suppress the floating social-proof notification so the video area remains distraction-free.
- [x] Validate focused coverage, 299 full tests across 65 files, TypeScript, production build, HTTP 200 checks for the alternate/original masterclass and critical routes, and desktop/mobile visual review.

## Video-First Masterclass Featured In Refinement — 2026-09-27

- [x] Replace the alternate `/masterclass` page’s plain gray logo grid with the established purple gradient Featured In marquee.
- [x] Restore the full eight approved white publication marks and the asset-readiness gate before continuous rotation begins.
- [x] Preserve the video-first page hierarchy, original `/free-masterclass` page, booking/payment/tracking flows, and all unrelated routes.
- [x] Validate focused coverage, 299 full tests across 65 files, TypeScript, production build, critical route HTTP 200 checks, desktop/mobile review, and verified marquee readiness/movement.

## Video-First Masterclass Perimenopause Messaging — 2026-09-27

- [x] Add `Perimenopause` to the main `/masterclass` video-first headline so women 35+ can immediately recognize the page as relevant before menopause begins.
- [x] Add perimenopause to the page’s search description while retaining the minimal video-first hierarchy, booking paths, original `/free-masterclass` page, and all unrelated flows.
- [x] Validate focused coverage, 299 full tests across 65 files, TypeScript, production build, critical route HTTP 200 checks, and desktop/mobile visual review.

## Video-First Masterclass Streamlined Booking — 2026-09-27

- [x] Update only the `/masterclass` physician appointment action to bypass the reusable long intake.
- [x] Reuse the proven two-step payment entry: Name, Email, and Phone (required by payment processing), followed by the existing secure $50 deposit screen and calendar handoff.
- [x] Preserve the complete intake for all other entry points, plus the care-team action, payment providers, referral rules, tracking, original `/free-masterclass` page, and unrelated routes.
- [x] Validate focused coverage, 299 full tests across 65 files, TypeScript, production build, critical route HTTP 200 checks, and browser walkthrough through contact details and initialized secure payment fields.

## Video-First Masterclass Complete Pricing — 2026-09-27

- [x] Keep the `/masterclass` page video-first by placing all additional pricing information inside the existing collapsed `See Full Pricing Details` accordion.
- [x] Add the $199 first visit, $50 deposit/$149 remaining split, $150 pay-as-you-go follow-up, and $50/month ongoing-care option with included services.
- [x] Add estimated monthly weight-loss medication and hormone-therapy ranges plus shipping/local-pharmacy fulfillment information.
- [x] Preserve compliance by using neutral FDA-approved medication labels rather than prescription brand names and include the required compounded-medication and testosterone disclosures.
- [x] Preserve the streamlined masterclass booking flow, rotating Featured In strip, original `/free-masterclass`, payment/referral/tracking behavior, and unrelated routes.
- [x] Validate focused and compliance coverage, 300 full tests across 65 files, TypeScript, production build, critical route HTTP 200 checks, and collapsed/expanded desktop plus mobile page review.

## Asynchronous Care Landing Page — 2026-09-27

- [x] Adapt the supplied standalone `LandingPage.html` into the existing React/Vite application without changing existing public pages or flows
- [x] Register the isolated `/asynchronous` route and suppress unrelated social-proof popups on that route
- [x] Preserve the supplied physician-led landing-page hierarchy, care paths, pricing, process, sample chat, FAQ, and responsive visual system
- [x] Rebuild the supplied assessment as an 11-screen client-side prototype with path-specific hormone, weight, and combined-care questions
- [x] Keep the prototype non-submitting: no payment, network request, database write, or persistence; display explicit prototype notices and prevent collection of real medical/payment information
- [x] Upload and use the supplied logo and physician portrait through project storage
- [x] Add compliant compounded-medication disclosures and neutral FDA-approved medication labels while preserving the intended prototype pricing flow
- [x] Validate 305 tests across 66 files, TypeScript, production build, HTTP 200 on `/asynchronous` and five critical routes, desktop/mobile full-page screenshots, and the full 11-screen assessment through its completion state

## Asynchronous Prototype Review Refinements — 2026-09-27

- [x] Clarify that the $49 occurs once at the checkout step; remove the second-charge impression from the results-step button
- [x] Show member ($50) and non-member ($150) follow-up video-visit prices side by side
- [x] Put medical weight care first in both the page cards and assessment choices to match the weight-led headline
- [x] Add verified trust signals: Board-Certified DO, licensed in 12 states, and LegitScript certification
- [x] Replace the vaginal cream vial illustration with a tube illustration
- [x] Move keyboard focus into each dialog, trap focus while open, close with Escape, and restore focus to the opening control
- [x] Confirm the React implementation already uses stored image assets and contains no embedded `data:image` payloads or MyAlloy links
- [x] Keep placeholder pharmacy-rate labels and compounded-treatment copy visibly marked for pharmacy/legal approval before launch
- [x] Validate 309 tests across 66 files, TypeScript, production build, critical route HTTP checks, desktop/mobile visual review, and browser focus entry/restoration

## Masterclass YouTube Recording — 2026-09-28

- [x] Replace the `/masterclass` coming-soon placeholder with the supplied YouTube recording `n-jYhuCP5Vg`
- [x] Use YouTube’s privacy-enhanced embed, keep playback in the existing responsive frame, and retain native fullscreen, captions, quality, and playback-speed controls
- [x] Preserve the concise page hierarchy, booking actions, pricing accordion, rotating Featured In strip, and original `/free-masterclass` page
- [x] Delete the supplied 1.08 GB MOV and the 1.08 GB local web conversion, freeing 2.01 GiB; retain only the small poster still used by `/free-masterclass`
- [x] Remove every site reference to the obsolete uploaded video object so it is no longer loaded or served by the website
- [x] Validate the public YouTube metadata and embed endpoint, 309 tests across 66 files, TypeScript, production build, five critical route checks, and desktop/mobile player rendering

## Masterclass Video-First Headline — 2026-09-28

- [x] Replace the `/masterclass` headline with `Finally. A Doctor Who Understands Menopause & Weight Loss.`
- [x] Add the approved supporting line connecting perimenopause, hormones, metabolism, medical weight loss, and real questions from women 35+
- [x] Preserve the Free On-Demand Masterclass banner, YouTube player, booking actions, pricing, Featured In strip, and all unrelated routes and flows
- [x] Validate focused coverage, 309 full tests across 66 files, TypeScript, production build, `/masterclass` HTTP 200, and desktop/mobile visual review

## Masterclass Social Share Preview — 2026-09-28

- [x] Create a dedicated 1200×630 branded social image with the Free On-Demand Masterclass label, menopause/metabolism/weight-loss headline, Dr. Al-Deek portrait, and Watch Free play treatment
- [x] Upload the share image to project storage and confirm public PNG delivery at exactly 1200×630
- [x] Add page-specific title, description, canonical URL, Open Graph, and Twitter Card metadata to `/masterclass`
- [x] Add the same route-specific metadata to the crawler middleware so Facebook, Messenger, iMessage, WhatsApp, LinkedIn, X, Slack, and other preview crawlers no longer receive homepage metadata
- [x] Preserve the Facebook domain-verification tag and all visible page content, paths, booking flows, tracking, and unrelated route metadata
- [x] Validate 312 tests across 66 files, TypeScript, production build, crawler HTML, public image delivery, and critical route HTTP checks

## Masterclass Social Preview Deduplication — 2026-09-28

- [x] Confirm the duplicate was caused by Apple/iMessage-style clients receiving the homepage Open Graph image in the initial SPA HTML and then seeing the masterclass image added during React hydration
- [x] Keep one masterclass social image in the initial `/masterclass` HTML for both crawler and normal browser user agents
- [x] Remove client-side Open Graph/Twitter image insertion from the masterclass React page so hydration cannot create a second preview image
- [x] Limit the full-HTML metadata replacement to `/masterclass`; preserve the homepage and all unrelated route metadata
- [x] Verify raw homepage HTML still has its original image while raw and hydrated `/masterclass` HTML each have exactly one `og:title`, `og:image`, `og:url`, and `twitter:image`
- [x] Validate 313 tests across 66 files, TypeScript, production build, Facebook verification coverage, and critical route HTTP checks

## Webinar 2 October 28 Schedule — 2026-09-30

- [x] Set `/live-webinar2` to Wednesday, October 28, 2026 at 7:30 PM Eastern Daylight Time (`2026-10-28T19:30:00-04:00`), including the visible date and countdown target.
- [x] Update its companion `/webinar-registration-confirmed` page to Wednesday, October 28 at 7:30 PM EDT.
- [x] Leave `/live-webinar3`, `/live-webinar3-confirmed`, form routing, playback, tracking, and other pages unchanged.
- [x] Verify 23 focused tests, 313 total tests, TypeScript, production build, HTTP 200 on the two affected routes and their companion variants, and mobile/desktop preview layouts.
- [x] Document the external handoff: the GoHighLevel registration form, reminder workflows, and webinar meeting still need an October 28 at 7:30 PM EDT update by their owner. The HighLevel connector is currently disabled; no provider-side changes were made or implied.

## Webinar 2 Compact Brand Mark — 2026-09-30

- [x] Add the existing approved MedMethod Direct logo centered directly above the gradient webinar banner on `/live-webinar2`, without creating a full navigation header or changing booking actions.
- [x] Keep the logo small and the spacing compact on mobile and desktop, preserving the event date, countdown, video, and registration form.
- [x] Update source regression coverage and validate 16 focused tests, 313 full tests across 66 files, TypeScript, production build, four route checks, and mobile/desktop preview layouts.

## Masterclass Video Replacement — 2026-09-30

- [x] Replace the YouTube ID on `/masterclass` with the user-provided `UNYMLkd61z8` only; keep the privacy-enhanced in-page player and its speed, caption, and quality controls.
- [x] Verify YouTube oEmbed identifies the replacement as Dr. Jumana Al-Deek's “Menopause, Metabolism & Medical Weight Loss: A New Approach to Health After 35+”.
- [x] Confirm the rendered masterclass contains exactly one iframe with the new ID and none with the retired ID; mobile layout remains intact.
- [x] Validate 35 focused tests, 313 full tests across 66 files, TypeScript, production build, and HTTP 200 on the masterclass and adjacent critical routes.

## Masterclass Full-Width Banner — 2026-09-30

- [x] Replace the compact rounded Free On-Demand Masterclass pill with a full-width pink-to-purple row at the top of `/masterclass`, matching the user-approved reference direction.
- [x] Keep the same white banner wording, hero headline, subtext, new YouTube recording, booking actions, pricing and all other pages unchanged.
- [x] Review desktop and 375px mobile layout; keep the video prominent on the first mobile screen.
- [x] Validate 5 focused tests, 313 full tests, TypeScript, production build and four critical routes.

## Masterclass Patient Booking Call to Action — 2026-09-30

- [x] Replace the soft booking-section headline with the owner-approved “Want to Become a Patient?” and add the 45-minute Dr. Al-Deek visit explanation.
- [x] Add the explicitly owner-confirmed “100% virtual care · Available in 17 states” line on `/masterclass` only, without implying a guaranteed treatment outcome.
- [x] Preserve the original physician deposit and free care-team CTAs, pricing, player, social proof, and tracking.
- [x] Narrowly scope compliance regression coverage to this explicit page exception; the shared navigation and locations still say 12 states and have not been changed here.
- [x] Verify 17 focused tests, 314 full tests, TypeScript, production build, HTTP 200 on four critical routes, and desktop/mobile booking-section layout.
- [x] Document the separate follow-up: obtain the approved list of 17 covered states (and whether DC is counted separately) before reconciling older sitewide 12-state claims and intake eligibility rules; this page-copy task does not change those systems.

## Masterclass Booking Copy Simplification — 2026-09-30

- [x] Remove the specific supporting sentence beginning “Start with a 45-minute visit” from the `/masterclass` patient-booking section.
- [x] Retain “Want to Become a Patient?”, 100% virtual/17-state wording, patient proof, both booking options, payment/referral paths, and all other page content.
- [x] Validate 5 focused tests, 314 full tests, TypeScript, production build, four critical route checks, and mobile visual spacing.

## Masterclass Watch-First Hook — 2026-09-30

- [x] Replace the doctor-first hero headline with a visible two-line video-first hook: “Watch the 45-minute masterclass” followed by “Weight Loss, GLP-1s & Hormones—Finally Explained.”
- [x] Explain that the full recording also contains a recorded live Q&A; the last transcript timestamp is about 57 minutes, so 45 minutes is a rounded learning hook rather than an exact full-player runtime.
- [x] Add a restrained “Press play to watch free” cue immediately above the existing YouTube embed; leave its video ID, native controls, booking CTAs, pricing, tracking, and unrelated pages unchanged.
- [x] Validate 47 focused tests, 314 full tests, TypeScript, production build, four route HTTP checks, and mobile/desktop visuals with the player visible in the first screen.

## Masterclass Under-Video Copy Cleanup — 2026-09-30

- [x] Remove the YouTube player-settings instruction and the separate “Educational content only” paragraph directly beneath the `/masterclass` video.
- [x] Keep the Dr. Al-Deek presenter line, the footer medical-evaluation qualifier, the video/player, physician and care-team booking actions, pricing, and unrelated routes intact.
- [x] Validate 17 focused tests, 314 full tests, TypeScript, production build, four route 200 checks, and mobile layout.

## Masterclass Lean Hero and Authority Line — 2026-09-30

- [x] Remove the redundant “Watch the 45-minute masterclass” line beneath the existing Free On-Demand Masterclass banner; make “Weight Loss, GLP-1s & Hormones—Finally Explained.” the sole, larger main headline.
- [x] Remove Dr. Al-Deek’s repeated name from the hero support text while retaining the recorded live Q&A context.
- [x] Consolidate physician identification and credentials under the player: Dr. Jumana Al-Deek, DO, board-certified family physician focused on perimenopause, menopause, metabolic health and medical weight loss. Avoid suggesting separate specialty board certification.
- [x] Keep the exact patient proof and physician booking-button attribution intact for clarity; leave the video, payment, care-team, pricing, tracking and other pages unchanged.
- [x] Validate 17 focused tests, 314 full tests, TypeScript, production build, four route 200 checks, and desktop/mobile first-screen player visibility.

## Masterclass Booking Eyebrow Removal — 2026-09-30

- [x] Remove “Ready when you are” above “Want to Become a Patient?” on `/masterclass` and the now-unused heading top margin.
- [x] Preserve the heading, proof, virtual-care line, both booking actions, pricing and the rest of the page.
- [x] Validate 5 focused tests, 314 full tests, TypeScript, production build, four routes and mobile layout.

## Masterclass Watch-First Content Order — 2026-09-30

- [x] Make the main headline fit three lines on 375px and 320px screens and replace the support paragraph with the approved physician/proof line; remove “Press play to watch free.”
- [x] Keep the existing YouTube player immediately below the hero; it is entirely visible in the initial 375×812 and 320×700 viewports without scrolling.
- [x] Copy the `/live-webinar2` What You’ll Learn headings, seven-item checklist, order, and section markup/style unchanged; replace its registration action with a separate “Watch the Free Masterclass” button that scrolls to the player and respects reduced-motion preference.
- [x] Move the existing Dr. Al-Deek bio beneath the learning action, then put the existing rotating Featured In strip immediately beneath the bio and above the booking section.
- [x] Add the requested bridge line above “Want to Become a Patient?” while retaining the physician and care-team buttons, price disclosure, virtual/17-state copy, patient proof, pricing details and footer.
- [x] Verify real browser watch-button scroll from below the list to the player (top at 0, URL unchanged), mobile and desktop visual review, 315 tests across 66 files, TypeScript, production build, and HTTP 200 on five critical routes.
- [x] Note that the copied webinar checklist intentionally retains its exact “LIVE Q&A” wording on this on-demand recording, per the explicit verbatim-copy request.

## Clean Masterclass Video Poster — 2026-09-30

- [x] Replace the initial YouTube iframe thumbnail with the current video’s uploaded poster and one large brand-colored, keyboard-accessible play button.
- [x] Load the same privacy-enhanced YouTube embed only after clicking play, with autoplay permitted; preserve native playback speed, captions, quality, and full-screen controls once playing.
- [x] Keep video inside the original responsive frame; verify the URL remains `/masterclass`, the poster disappears, and the iframe uses `UNYMLkd61z8` after click.
- [x] Adjust poster positioning so its title is not cropped on mobile; review 375px preview and desktop rendering.
- [x] Validate 315 tests across 66 files, TypeScript, production build, five routes returning HTTP 200, and public poster delivery at HTTP 200.

## Masterclass Patient-Proof Color — 2026-09-30

- [x] Restore the existing brand-purple `#7a1e7e` and bold emphasis to “50,000+ patients” in the concise hero proof line on `/masterclass`.
- [x] Keep all other proof-line words, mobile layout, poster and video behavior, learning section, booking flow and other pages unchanged.
- [x] Verify mobile visual treatment, 315 tests across 66 files, TypeScript, production build, and `/masterclass` HTTP 200.

## Masterclass Mobile Inline YouTube Playback — 2026-09-30

- [x] Preserve YouTube's `playsinline=1` setting and keep the click-to-load video inside the existing responsive frame.
- [x] On touch/mobile activations, pass `fs=0` to hide YouTube's fullscreen control, remove iframe fullscreen permission and omit picture-in-picture; keep those options on desktop.
- [x] Verify a simulated mobile activation retains the `/masterclass` URL and loads the iframe inside its existing frame with `fs=0`, no `allowfullscreen`, and no picture-in-picture; desktop activation retains `fs=1` and fullscreen permission.
- [x] Validate 315 tests across 66 files, TypeScript, production build, and five critical routes at HTTP 200.
- [x] Document the limitation: on iPhone, an external app's embedded browser can force the native fullscreen controller when its own WKWebView does not allow inline media playback; site code cannot override that host-app setting. Check on the actual affected browser after publish.

## Masterclass Learning Label Size — 2026-09-30

- [x] Increase only the `/masterclass` “What You’ll Learn” label one responsive type step (12→14px mobile, 14→16px larger screens); keep the copied webinar checklist content, order and remaining styling intact.
- [x] Verify 18 focused tests, 315 full tests, TypeScript, production build, four HTTP 200 routes, and a full 375px mobile layout review.

## Masterclass Native YouTube Player Restoration — 2026-09-30

- [x] Remove the site-owned poster and purple play overlay that caused a second YouTube tap; render the current `UNYMLkd61z8` privacy-enhanced YouTube embed immediately on `/masterclass`.
- [x] Keep the video in the same responsive frame and preserve inline/mobile fullscreen preferences (`playsinline=1`, `fs=0` on touch/narrow screens); leave booking, pricing, copy, tracking and other pages unchanged.
- [x] Verify that the first visible play control belongs to YouTube, and one click enters YouTube playback/loading without a second site-owned button; native title/channel/watch controls are expected to reappear.
- [x] Review 375px mobile initial screen and validate 315 tests across 66 files, TypeScript, production build and five critical route HTTP 200 checks.

## Live-Webinar Centered Brand Logo — 2026-10-01

- [x] Reuse the exact homepage MedMethod Direct logo asset, centered above the existing Live on Zoom / RSVP banner on `/live-webinar` only.
- [x] Keep its footprint compact (`h-8` mobile, `h-9` larger screens) without adding a navigation bar or changing the video, webinar copy, registration, or other routes.
- [x] Validate 20 focused tests, 316 full tests across 66 files, TypeScript, production build, four critical route HTTP 200 checks, and first-screen mobile/desktop previews.

## Live-Webinar Tagline-Free Logo — 2026-10-01

- [x] Match the homepage treatment by clipping the same approved centered MedMethod Direct logo asset to hide only the “Feel Like Yourself Again” tagline below the wordmark on `/live-webinar`.
- [x] Preserve the logo position and webinar layout, video, CTA, form, tracking and other routes.
- [x] Verify the wordmark alone on mobile and desktop, 8 focused tests, 316 full tests, TypeScript, production build and four route HTTP 200 checks.

## Live-Webinar Logo Size Refinement — 2026-10-01

- [x] Increase the centered MedMethod Direct wordmark one size step (`h-9` mobile; `h-10` desktop), preserving the homepage-style tagline clip.
- [x] Review first-screen mobile and desktop proportions and retain the banner, headline, video and registration hierarchy.
- [x] Validate 8 focused tests, 316 full tests, TypeScript, production build and four critical routes at HTTP 200.

## Supplements Standalone Store Preview — 2026-10-01
- [x] Import the supplied coded store as `/supplements` on the existing MedMethod Direct project, preserving its visual design, six-product catalog, hash navigation, filters, cart, and demo checkout rather than recreating them as React components.
- [x] Move 11 unique embedded images to project storage; the standalone HTML now references `/manus-storage/` assets instead of base64 images. Retain the supplied pink-to-purple styling and responsive layout.
- [x] Serve the standalone document at `/supplements` and `/supplements/` in development and production; preserve existing SPA, booking, payment, webinar, pixel, and GTM flows. Allow crawlers to read the page's own metadata, including Facebook verification.
- [x] Keep the page `noindex,follow` with explicit sample-product/pricing, draft-policy, and demo-only disclaimers. There is no real order, payment/card field, shipping, or API submission; demo cart is local browser storage.
- [x] Align one research heading phrase with the existing sitewide compliance guard (`featured reference products` rather than `brand-name products`), with no design or interaction change.
- [x] Validate 320 tests across 67 files, TypeScript, production build, desktop/mobile (1280px/375px) visual and interaction QA, all six product images, no horizontal overflow, no browser JS errors or `/api/` requests from demo checkout, and development/production route HTTP 200 plus crawler metadata.
- [x] Store preview published after owner review; a real sales launch would separately require confirmed products and image rights, supplier inventory, shipping/tax rules, approved claims and final policies, and payment/fulfillment integration. Do not connect this demo to existing medical payment or booking flows.

## Supplements Preview Dropdown Alias — 2026-10-02
- [x] Register `/supplements` alongside the existing React routes solely for preview route discovery; redirect any in-app navigation to the original standalone document. Do not rebuild the supplied store or change its payment/demo behavior.
- [x] Add a regression check for the route alias and direct Express serving.
- [x] Validate 321 tests across 67 files, TypeScript and production build; browser navigation from the SPA opens the original store document, route HTTP 200 remains intact, and the supplied HTML/server route are unchanged from the published checkpoint.

## Masterclass Presenter Photo — 2026-10-02
- [x] Place the user-supplied family photo directly below the unchanged Dr. Al-Deek presenter line on `/masterclass`, before the existing Featured In strip; preserve video-first order, copy, booking, tracking, pricing and other pages.
- [x] Optimize a centered 1100×1100 WebP crop (158 KB, no EXIF), keep the original upload untouched, and serve the photo from `/manus-storage/` rather than storing media in the repo.
- [x] Confirm faces and full family remain visible at 375px and 1280px; verify no overflow, asset HTTP 200, 322 tests across 67 files, TypeScript, build, and critical route responses.

## Masterclass Q&A Replay Copy — 2026-10-02
- [x] Change only the final `/masterclass` learning item to “LIVE Q&A Replay with Dr. Jumana Al-Deek” and “Watch people like you get answers from a menopause & medical weight loss specialist.” Keep `/live-webinar2` wording unchanged.
- [x] Confirm mobile and desktop text wrapping with no overflow, focused and full Vitest suites, TypeScript, production build, and masterclass HTTP 200.

## Homepage Hero Photo Reliability — 2026-10-03
- [x] Confirm homepage responds HTTP 200. Reproduce the live portrait successfully in current mobile Chromium; visitor’s screenshot shows a genuine broken-image state, but the intermittent cause cannot be proven from one browser session.
- [x] Replace the shared hero portrait’s 2 MB PNG (delivered as `application/octet-stream`) with the exact same full-frame photo optimized to a 94 KB WebP delivered as `image/webp`. Prioritize loading for mobile and desktop; preserve layout, copy, tracking, booking and payment flows.
- [x] Confirm image decoding and mobile/desktop screenshots with no overflow, new asset HTTP 200 with image MIME, 323 tests across 67 files, TypeScript, production build, and critical route HTTP 200 checks.
- [ ] Publish the checkpoint to put this reliability fix on the live site; the previous PNG remains in the live page until publication.

## Weight-Loss & Menopause Imported React Page — 2026-10-12
- [x] Inspect ZIP HANDOFF/README and exact checksums, site framework/router/header/footer/styles; obtain owner approval for this existing-project integration, shared shell differences, Explore navigation and noindex prototype treatment.
- [x] Add `/weight-loss-menopause` as a lazy-loaded real React component, not a new project, standalone redirect or iframe. Preserve supplied markup, copy, section order, seven GLP-1/five HRT cards, prices/supplies, six testimonials, phone animation, estimator, app tabs, FAQ and sticky CTA behavior.
- [x] Upload five exact transparent HRT PNGs and all 28 unique embedded images to this project's asset storage; preserve bytes/composition and keep media outside the repo. New page uses only new project paths. HRT media remain centered contain on #F4F0E9.
- [x] Scope imported CSS/reset/variables/reduced-motion/keyframes to page content. Scope DOM queries and clean up timers, listeners, observers and animation frames on unmount. Preserve hero text-line centering and responsive alignment/tap targets.
- [x] Use shared header with local anchors and Muse intake CTA, omit page-specific state banner. Restore original ZIP footer on this page only per subsequent owner confirmation; keep original purple styling, MMD Weight Loss wordmark, four section anchors, disclosures and copyright. Shared footer on other pages and Explore link remain unchanged.
- [x] Add neutral title/description/canonical/social metadata and noindex,follow in React and direct/crawler metadata; omit sitemap pending finalized content and launch approval.
- [x] Browser tests pass at 320, 375, 768, 1024, 1440px: image decode, no horizontal overflow, hero centering, default GLP-1, HRT hides entire estimator, restoration/slider, five app tabs, FAQ, sticky rules and SPA navigation away/back. Screenshots reviewed.
- [x] Focused 37 tests, TypeScript and build passed. Full suite: 328 passing, 2 failing, 68 files/330 tests. Initial configuration failures cleared on rerun; no configuration changes were made.
- [ ] Resolve prior sitewide compliance policy conflict before claiming complete validation: supplied Wegovy/Zepbound, Sexual Health and meal/workout-plan text is expressly prohibited by existing tests. Supplied compounded disclosure also lacks the site's exact required wording. No guard weakened or supplied wording removed; owner decision needed.
- [ ] Public publishing is NOT authorized. Save draft checkpoint and give Preview for review; Git connection unchanged.
- [x] Final focused validation: 44 tests across import/crawler/masterclass suites; TypeScript/build passed. Fresh production server (unused port 3197) serves the correct route title/canonical/noindex and existing routes return 200. Verified all five HRT storage responses match original ZIP bytes exactly. Verified masterclass computed typography unchanged after visiting the new page and that prototype noindex is removed on navigation away.

## Weight-Loss & Menopause Original Footer Restoration — 2026-10-12
- [x] Obtain explicit confirmation and restore ZIP footer on this page only. Main section markup and current header unchanged byte-for-byte; no shared component, stylesheet, payment or intake edits.
- [x] Compare rendered footer text and four link destinations exactly with ZIP; check purple styling, no overflow, 44px link targets, sticky CTA absence near footer, treatment toggle and navigation to homepage at 375/768/1440px. Visual review passed.
- [x] Validate 48 focused tests, TypeScript, production build and Preview HTTP 200. Full suite remains 328 pass/2 known compliance failures; no new regressions and no compliance guards changed.
- [x] Save as a new unpublished checkpoint; do not publish this footer update automatically.

## Weight-Loss & Menopause Start Your Visit Intake URL — 2026-10-12
- [x] With explicit owner confirmation, update every Start Your Visit CTA on `/weight-loss-menopause` only—header, hero, estimator, pricing, privacy and mobile sticky—to `https://intake.medmethoddirect.com/`.
- [x] Verify 7 rendered mobile-menu/page links and 6 desktop/page links target the approved URL, with no remaining Muse destination on this page; `/masterclass` did not receive the new URL.
- [x] Validate 37 focused tests, TypeScript and production build. Full suite remains 328 pass/2 previously documented compliance conflicts, no new failures; save as unpublished checkpoint.


## Weight-Loss Intake Static Prototype Import — 2026-10-13
- [x] Import the supplied `MMD-Weight-Loss-Intake-Website.zip` into this existing MedMethod Direct project without touching `/` or replacing React pages.
- [x] Preserve the two original documents as page-isolated static routes: `/weight-loss-intake` (original `index.html`) and `/intake/` (original `intake/index.html`). The supplied layout, header/footer, interactions, responsive CSS, inline SVG icons, and page-specific scripts remain in the standalone documents rather than the React/global stylesheet.
- [x] Extract all 31 unique embedded images (3.91 MB total) without transforming their pixels, upload them to this project’s storage, and replace every inline `data:image` reference. Source documents now contain zero base64 image URLs (88 KB landing document and 323 KB intake document).
- [x] Keep all four supplied support files at their matching static paths: `/weight-loss-intake/ui-polish.css`, `/weight-loss-intake/ui-polish.js`, `/intake/ui-polish.css`, and `/intake/ui-polish.js`; preserve an updated route-local `manus-routes.json` for the two approved paths.
- [x] Change all five supplied landing-page `Start your visit` links to `/intake/`; do not change existing homepage, booking, payment, care-team, checkout, or patient workflows.
- [x] Mark both prototype pages `noindex,follow`, give them their direct canonical URLs, and pass social crawlers through to the standalone documents so generic homepage metadata cannot replace it. Add redirect-only App aliases strictly for WebDev Preview route discovery—those aliases full-navigate to the original documents, not a rebuilt React page.
- [x] Validate: 35 focused tests; TypeScript; production build; development and fresh-production HTTP 200 for both routes plus four polish files; crawler metadata; phone (375px), tablet (768px), desktop (1440px) browser QA; image decode; mobile menu/app tabs; landing-to-intake navigation; local initial intake progression without entering/submitting personal data; no PayPal/Stripe/API integration request; and navigation back to the existing homepage with no imported-style leakage.
- [ ] Full suite status remains 328 passing/2 failing across 70 test files. Both failures are the same pre-existing `legitScriptCompliance` failures at the saved baseline from the earlier `/weight-loss-menopause` import. The new supplied static package intentionally preserves additional phrases incompatible with that guard (brand names, `meal plan`, and `brand-name` wording). It remains noindex/prototype-only; a separately approved compliance/content review is required before public launch. No supplied wording or compliance guard was changed in this import.


## Intake Consent Checkbox Repair — 2026-10-13
- [x] Reproduce the live `/intake/?prefill=demo` failure: both final consent checkboxes were rendered disabled whenever the currently open disclosure state did not include both `Possible side effects` and `Serious risks`; the disabled Continue button in the reported screenshot was therefore expected from the defective condition.
- [x] With owner approval, update only the imported `/intake/` document: record the two default-open required disclosures as read, retain that read state if the user collapses them, and keep both final checkbox controls usable.
- [x] Make the two final choices mutually exclusive: selecting consent clears decline and enables Continue; selecting decline clears consent, displays the existing cannot-continue explanation, and keeps Continue disabled. Do not submit, store, transmit, activate, or alter PayPal/Keragon/API behavior.
- [x] Add regression coverage and validate 6 focused tests, TypeScript, production build, fresh-production static serving/noindex, and non-submitting desktop/mobile browser QA. Browser QA confirms collapsed disclosures do not disable controls, consent/decline choices are exclusive, consent enables Continue, decline blocks it, and no integration request occurs.
- [x] Full suite remains 334 passing/2 failing across 69 files—the same previously documented compliance guard failures from the earlier imported weight-loss prototypes; no new test failure introduced.
- [x] Save this approved repair as an unpublished checkpoint; no live publication is authorized.

## Intake Keragon Delivery + $49 PayPal Payment — 2026-10-13
- [x] With explicit owner approval, turn `/intake/` from a static UX-only payment screen into an approved secure flow: deliver the completed intake to Keragon **before** a $49.00 one-time PayPal card order is created; do not store intake submissions on this server.
- [x] Add an admin-only **Intake Delivery** tab at `/admin/settings` with a write-only `KERAGON_WEBHOOK_URL` field. It requires a public HTTPS URL, encrypts the saved value using AES-256-GCM, never returns plaintext to the browser, and supports replacement/removal. Database migration `0012_early_sway.sql` created and applied the `intake_delivery_settings` table.
- [x] Add server-only PayPal endpoints that read the existing enabled PayPal provider plus active sandbox/live mode and credentials from Admin Settings. Browser card fields receive only a PayPal client token; an HMAC-signed, 30-minute approval token binds capture to the server-created order. No card number, expiry, CVV, PayPal secret, or Keragon URL is exposed to the page.
- [x] Guard the sequence: absent/failed/timed-out Keragon delivery prevents order creation and explicitly states that the card has not been charged. A successful delivery followed by declined/abandoned payment leaves the unpaid intake with Keragon, as approved. The form copy now explains this pre-payment delivery order accurately.
- [x] Keep a safe non-charging fallback if inline PayPal card fields are unavailable; it offers retry instead of the prior incomplete hosted-checkout path that could not preserve signed capture authorization.
- [x] Validation: migration applied successfully; 12 focused tests plus static-JS parsing and TypeScript passed; mobile synthetic QA reached the payment screen with fake/demo data and initiated only client-token loading (no order/capture); direct order guard returned the missing-`KERAGON_WEBHOOK_URL` error without charging; fresh production build served `/intake/`, `/weight-loss-intake`, `/masterclass`, and `/` with HTTP 200 and retained the payment guard.
- [ ] Before a real submission can proceed, an authorized admin must enter the exact Keragon endpoint in **Admin Settings → Intake Delivery**. Do not add the URL to source code or browser config. Current `noindex,follow` status remains unchanged.
- [ ] Full suite: 339 passing / 2 failing across 70 files. Both failures are the pre-existing, separately documented `legitScriptCompliance` conflicts from imported weight-loss content; the new payment setting introduced no additional full-suite failure. No compliance guard was weakened.
- [x] Save as unpublished checkpoint `085f9d12` only; public publishing remains unapproved.

## Intake Immediate Final Consent Choices — 2026-10-13
- [x] With explicit owner approval, remove only the `/intake/` final-step prerequisite that required opening “Possible side effects” and “Serious risks” before either checkbox could be selected.
- [x] Keep all disclosure accordions unchanged and available to read. Keep mutually exclusive choices: consent enables Continue; decline clears consent, shows the existing cannot-continue notice, and leaves Continue disabled.
- [x] Validate 7 focused tests, TypeScript, static-JavaScript parsing, mobile and desktop browser flows, production build, and fresh-production HTTP 200 smoke checks. On both viewports, controls are enabled before disclosures are opened.
- [x] Full suite remains 339 passing / 2 known imported-content compliance failures; no new failures. Save an unpublished checkpoint only; do not publish automatically.

## Intake PayPal Card-Field Initialization — 2026-10-13
- [x] With explicit owner approval, fix `/intake/` Sandbox card fields that displayed `clientToken must be a valid JSON Web Token`.
- [x] Root cause: the PayPal identity endpoint supplied an opaque value while the loaded Web SDK v6 `createInstance` requires a JWT when using `clientToken`.
- [x] Keep Admin Settings as the source of truth for enabled provider, mode and saved credentials. The browser now receives only the selected public `client_id` and invokes Web SDK v6 with `clientId`; the selected Client Secret remains server-only for order creation and capture.
- [x] Verify the Sandbox endpoint returns only `client_id` and `environment` with no secret; browser QA rendered all four PayPal-hosted secure fields, no initialization errors, and issued no order/capture POST. Focused tests (11), TypeScript, production build, and fresh production route/config smoke tests passed.
- [x] Full suite remains 339 passing / 2 separately documented imported-content compliance failures; no new failure. Save an unpublished checkpoint only; do not publish automatically.

## Intake Payment POST Origin Diagnostic — 2026-10-13
- [x] With explicit owner approval, add a non-delivering `POST /api/paypal/orders/preflight` diagnostic. It does not read settings, contact Keragon, create an order, capture payment, or return request contents; it only returns byte count and configured maximum.
- [x] Add a JSON parser error boundary immediately after the 50 MB parsers. Malformed JSON now returns structured HTTP 400, oversized bodies return HTTP 413, and unrelated errors continue through Express.
- [x] Diagnosis: a clearly synthetic tiny live order POST returned a Cloudflare origin 502 in about 2.5 seconds—before any Sandbox order was created—while the local preview reached the expected Keragon configuration guard. This points to the production origin/proxy POST path, not the entered test card or PayPal SDK credentials.
- [x] Validate 12 focused tests, TypeScript, production build, local and fresh-production synthetic preflight (HTTP 200), plus malformed JSON (HTTP 400). Full suite remains 340 passing / 2 separately documented imported-content compliance failures; no new failure. Save as an unpublished checkpoint only.

## Intake Specific Checkout Error Response — 2026-10-13
- [x] With explicit owner approval, change only caught safe application failures on `/api/paypal/orders` from HTTP 502 to HTTP 422. Production proxies now preserve the JSON error rather than replacing it with a generic Cloudflare gateway page.
- [x] No Keragon payload, credentials, order/capture sequence, payment amount, or card-field handling changed. A synthetic local request returned HTTP 422 with the exact missing-`KERAGON_WEBHOOK_URL` configuration message and no order/delivery/card data.
- [x] Validate 13 focused tests, TypeScript and production build. Full suite remains 341 passing / 2 separately documented imported-content compliance failures; no new failure. Save as an unpublished checkpoint only.

## Intake Keragon App-Secret Delivery Source — 2026-10-13
- [x] With explicit owner approval, use the verified project `KERAGON_WEBHOOK_URL` secret as the primary pre-payment delivery destination; retain the encrypted Admin Settings Intake Delivery URL only as a server-side fallback.
- [x] Keep both values server-only. Neither destination is embedded in the static intake, returned from an API, logged, or exposed in browser output.
- [x] Run one clearly marked synthetic Sandbox validation: Keragon accepted the test payload and PayPal prepared an order; no capture occurred and no charge was made.
- [x] Validate 13 focused tests, TypeScript, production build, and fresh-production client-config/preflight checks. Full suite remains 341 passing / 2 separately documented imported-content compliance failures; no new failure. Save as an unpublished checkpoint only.

## Shared Treatment Catalog + Price Update — 2026-10-14
- [x] Create `shared/treatmentCatalog.json` as the single source of truth for the owner-approved GLP-1 and HRT medication names, displayed prices, supply terms, current product images, and the intake’s first `I'm not sure — I would like a recommendation` choice.
- [x] Add a generated browser-safe catalog (`client/public/treatment-catalog.js`) and generation step run automatically before development and production builds. `/weight-loss-intake` and `/intake/` now render their GLP-1 cards from that catalog at runtime; `/weight-loss-menopause` imports the same JSON directly and renders both its GLP-1 and HRT medication cards from it. No duplicate medication price list remains on these three page paths.
- [x] Update GLP-1 everywhere it appears in those flows: Compounded Semaglutide `$129` + `1-month supply`; Compounded Tirzepatide `$149` + `1-month supply`; Compounded Liraglutide `$115` + `1-month supply`; Wegovy® – Direct from NovoCare® `$349/month`; Wegovy Pill® – Direct from NovoCare® `$199/month`; Zepbound® KwikPen – Direct from LillyDirect® `$299/month`; Foundayo® Pill – Direct from LillyDirect® `$149/month`.
- [x] Update the `/weight-loss-menopause` HRT list everywhere it appears: Estradiol Tablets `$29` + `1-month supply`; Estradiol Patch `$99` + `1-month supply`; Micronized Progesterone Pill `$69` + `3-month supply`; Vaginal Estrogen Cream `$79` + `2-month supply`; PT-141 Injection `$179` + `1-month supply`; Vaginal Estrogen Cream + PT-141 `$258` + `1-month supply`; Estriol Face Cream `$119` + `1-month supply`; Eye Cream `$89` + `1-month supply`; GHK-Cu + Biopeptides Cream `$109` + `1-month supply`; Advanced Cell Repair Serum `$119` + `1-month supply`; Emerald Cream `$99` + `1-month supply`; Low-Dose Minoxidil Pill `$84` + `3-month supply`.
- [x] Remove Estradiol Gel (Divigel) and the Spironolactone + Biotin + Minoxidil Combination Pill from rendered cards, selection/review data, and page-visible source content. The unused imported estradiol-gel storage asset is intentionally retained only as non-rendered source-media provenance; it is not shipped into any medication card.
- [x] Format compounded and HRT medications with their price followed by the supply on its own line; brand-name GLP-1 items show only `$___/month`. No changed card uses the phrase `per month`.
- [x] Validate: 18 focused regression tests across catalog, static intake, and menopause page coverage; TypeScript; production build; fresh production HTTP 200 for `/weight-loss-intake`, `/intake/`, `/weight-loss-menopause`, `/treatment-catalog.js`, and `/`; desktop (1440px), tablet (768px), and phone (375px) browser QA with seven GLP-1 landing cards, seven GLP-1 menopause cards, twelve HRT cards after switching panels, and seven main-intake selection cards. All current product images decoded with no browser errors/resource failures, no horizontal overflow, and no form submission/payment/delivery activity during QA.
- [ ] Full suite status: 346 passing / 1 failing across 71 files. The only failure is the previously documented `legitScriptCompliance` guard reacting to the owner-approved imported prototype medication brand content; the shared-catalog change introduced no additional failing test. The guard was not weakened.
- [x] Saved as unpublished checkpoint `a4ed0bb9`; no public deployment was requested or performed.

## Intake Apple Pay Option — 2026-10-14
- [x] Add an Apple Pay option to `/intake/` checkout only, beside the existing PayPal-hosted card fields. No other route, form, booking flow, or payment page receives the Apple Pay component.
- [x] Use PayPal Web SDK v6’s `applepay-payments` component and a native Apple Pay session. The option is rendered only when all three conditions succeed: secure context, the visitor’s Apple device/browser reports Apple Pay availability, and the selected PayPal account reports `applepay` eligibility. Unsupported browsers retain the card-only experience without an empty Apple Pay placeholder.
- [x] Use the existing secure $49 order/capture boundary for Apple Pay. Before Apple Pay authorization, the approved intake is sent to Keragon through the existing server-only destination; the new delivery payload records only `payment.method: "apple_pay"` (or `"card"`), never a card number, CVV, Apple Pay token, or wallet details. The server does not write form answers or payment method data to its database.
- [x] Preserve the selected Admin Settings PayPal environment and browser-safe public Client ID. Apple Pay validates the merchant through PayPal, submits its encrypted native token through PayPal’s `confirmOrder`, then uses the existing signed approval token and server-side capture endpoint. No PayPal secret or Apple merchant credential is exposed to the static page.
- [x] Validate: 15 focused tests; TypeScript; production build; production direct-route smoke checks (`/intake/`, `/weight-loss-intake`, `/`, `/masterclass` all HTTP 200); static-bundle parsing; and mobile browser QA. A deterministic no-charge browser test confirmed the Apple Pay control is hidden for an unsupported browser, visible/enabled for a simulated eligible Apple device after checkout acknowledgement, starts the native sheet, completes merchant validation, and creates **zero** `/api/paypal/orders*` requests during the test.
- [x] Full suite: 347 passing / 1 failing across 71 files. The sole failure is the previously documented `legitScriptCompliance` assertion against the owner-approved imported brand medication prototype content; this update introduced no additional failure.
- [ ] Before Apple Pay can appear to real customers and complete real payments, enable Apple Pay for the active PayPal account and register `medmethoddirect.com` in PayPal’s Apple Pay/domain configuration. The live check confirms `/.well-known/apple-developer-merchantid-domain-association` currently returns the normal website HTML, not Apple’s required merchant-domain association file. That Apple-provided verification file has not been added because it must come from the approved PayPal/Apple configuration flow.
- [ ] Save as an unpublished checkpoint only; do not publish.

## Intake Demo Checkout Always Uses Sandbox — 2026-10-15
- [x] With explicit owner approval, force only `/intake/?prefill=demo` through the saved **Sandbox** PayPal Client ID, SDK endpoint, order creation, capture, and pre-payment Keragon payload—even when Admin Settings has Live selected.
- [x] Keep normal `/intake/` controlled exclusively by the protected Admin Settings mode. The server, not a browser-only condition, makes the mode decision for both client configuration and orders. A demo request therefore cannot initiate a Live order or capture.
- [x] Preserve test labeling: demo delivery is `is_test: true`, the issued approval token is Sandbox-bound, and the existing demo banner/confirmation behavior remains unchanged. No real or synthetic capture was submitted during validation.
- [x] Validate: 16 focused tests, TypeScript, static-bundle parsing, production build, and no-charge browser QA. With Admin Settings currently Live, normal configuration returned `environment: live`, while demo configuration returned `environment: sandbox`; actual demo browser progression rendered four Sandbox-hosted card frames, loaded only `www.sandbox.paypal.com` SDK resources, made no Live SDK request, and made zero payment POSTs.
- [x] Full suite: 348 passing / 1 failing across 71 files. The sole failure is the documented pre-existing `legitScriptCompliance` assertion against owner-approved imported prototype medication brand content; this update introduced no additional failure.
- [x] Saved as unpublished checkpoint `87ac0dfb`; not published.

## Intake Confirmation Next Steps — 2026-10-15
- [x] Add a temporary page-local `What happens next` panel to the paid `/intake/` confirmation state, positioned after the existing $49 safety-net notice and immediately above the unchanged `Start over` button.
- [x] Use the approved interim onboarding copy: `1. Check your inbox and spam folder`; `2. Open the link in the email`; `3. Create your account and set your password`. The final copy can be replaced later without changing payment, Keragon delivery, confirmation, or account behavior.
- [x] Match the supplied visual reference with three numbered mint/lime circles, a connecting vertical line, strong readable copy, responsive wrapping, and page-scoped styles. The panel is semantic (`section`, labelled heading, ordered list) and does not affect any other site route.
- [x] Validate: 9 focused static-intake tests, TypeScript, production build, static-bundle parsing, and phone (375px) plus desktop (1440px) confirmation-screen browser QA through the existing non-payment success-state rendering. All three steps render above Start over with no horizontal overflow. No data delivery, payment order, capture, or external request was triggered by visual QA.
- [x] Full suite: 349 passing / 1 failing across 71 files. The only failure remains the documented `legitScriptCompliance` assertion against owner-approved imported brand medication prototype content; this confirmation-only update introduced no additional failure.
- [x] Saved as unpublished checkpoint `d8c43e13`; not published.

## Apple Pay Live Domain Verification File — 2026-10-15
- [x] Stage the exact user-provided Apple/PayPal association file as `client/public/.well-known/apple-developer-merchantid-domain-association` without modifying its signed contents (9,094 bytes; SHA-256 `cdb19c18ab558f50994fb98413eaad9d495b552a2fdf07505e4fb4f5777e4969`).
- [x] Add an explicit Express `GET /.well-known/apple-developer-merchantid-domain-association` route before crawler/static fallback. It returns the supplied file as `text/plain`, `Cache-Control: no-store`, rather than an HTML page; this is necessary because standard Express static handling ignores dot-directories.
- [x] Validate the exact route in development and a freshly built production server: HTTP 200, `Content-Type: text/plain; charset=utf-8`, 9,094 bytes, and exact byte-for-byte SHA-256 match to the supplied file. The production build contains `dist/public/.well-known/apple-developer-merchantid-domain-association`.
- [x] Validate 10 focused tests, TypeScript, and production build. Full suite: 351 passing / 1 failing across 72 files; the only failure remains the documented pre-existing `legitScriptCompliance` assertion against owner-approved imported prototype medication brand content.
- [x] Saved as unpublished checkpoint `90efd559`; not published. Publication remains required before `https://medmethoddirect.com/.well-known/apple-developer-merchantid-domain-association` can change from the current website fallback response and PayPal can register the Live domain.

## Intake Confirmation Portal-Onboarding Copy — 2026-10-15
- [x] Replace only the temporary three-step paid-confirmation wording on `/intake/`, preserving the existing numbered timeline, position above `Start over`, and all payment, Keragon, account, and delivery behavior.
- [x] Use the approved copy exactly: **Check your email** — `for our welcome message and Patient Portal link.`; **Create your account** — `by setting your username and password, then log in.`; **Go to Forms & Questionnaires in the portal** — `Sign and complete the remaining required forms.`
- [x] Keep each title visually distinct from its supporting line while preserving responsive wrapping, the dark-theme color treatment, numbered markers, and no horizontal overflow.
- [x] Validate: 9 focused tests, TypeScript, production build, static-bundle parsing, and non-payment success-state browser QA at 375px and 1440px. All three approved instructions render before `Start over` at both widths.
- [x] Full suite: 351 passing / 1 failing across 72 files. The sole failure remains the documented `legitScriptCompliance` assertion against owner-approved imported prototype medication brand content; this copy-only update introduced no additional failure.
- [x] Saved as unpublished checkpoint `0f144e7a`; not published.

## Intake Apple Pay Black Button Across Themes — 2026-10-15
- [x] Keep `/intake/` Apple Pay visibility eligibility-only, as approved: unsupported devices or unavailable PayPal Apple Pay methods do not receive a misleading payment control.
- [x] Make the eligible native `Buy with Pay` control explicitly solid black in both light and dark checkout themes, with the native `buy` type, black style, full available width, a 52px touch target, and pill radius. The card form, $49 amount, eligibility gate, merchant validation, Keragon delivery, and payment capture behavior remain unchanged.
- [x] Correct light-theme divider/status colors separately from the black native button; restore the existing light-on-dark treatment under the dark theme media query.
- [x] Validate: 18 focused static-intake/payment tests, TypeScript, production build, and a no-charge mocked Apple Pay browser check. In both 390px light and dark contexts, an eligible control is visible at 52px height with `background: rgb(0, 0, 0)`, native `buttonstyle="black"`, and `type="buy"`. No order/capture/delivery request was made.
- [x] Full suite: 352 passing / 1 failing across 72 files. The only failure remains the documented `legitScriptCompliance` assertion against owner-approved imported prototype medication brand content; this styling-only change introduced no additional failure.
- [x] Saved as unpublished checkpoint `6e1b6227`; not published.

## Intake Native Apple Pay White Label Repair — 2026-10-15
- [x] Fix the root cause of the light-theme black rectangle: Safari exposes `ApplePaySession` natively before the Apple JavaScript SDK has registered the `apple-pay-button` custom element. The prior loader incorrectly treated the native session as proof that the visible button element was ready.
- [x] Load/verify the Apple JavaScript SDK until `customElements.get('apple-pay-button')` confirms the native component is registered. The eligible button now uses Apple’s actual `buttonstyle="black"`, `type="buy"`, localized native control, which supplies the required white `Buy with Pay` label.
- [x] Apply Apple-supported JavaScript button sizing properties plus the Safari CSS fallback: `-webkit-appearance: -apple-pay-button`, `-apple-pay-button-type: buy`, `-apple-pay-button-style: black`, full width, 52px height, and the existing pill radius. Eligibility-only visibility, the $49 amount, card flow, merchant validation, Keragon delivery, and capture boundary are unchanged.
- [x] Validate: 18 focused static-intake/payment tests, TypeScript, production build, static parsing, a no-charge merchant-validation click path, and eligible light/dark checkout QA. Both theme contexts now verify a visible 52px black native button with `buttonstyle="black"` and `type="buy"`; no payment order or capture was created.
- [x] Full suite: 352 passing / 1 failing across 72 files. The lone failure remains the documented `legitScriptCompliance` assertion against owner-approved imported prototype medication brand content; this native-button repair introduced no additional failure.
- [x] Saved as unpublished checkpoint `ce7363a3`; not published.

## Weight-Loss Intake LegitScript Footer Seal — 2026-10-15
- [x] Add the user-supplied LegitScript verification link and certified seal only to the lower-right of the `/weight-loss-intake` static landing-page footer, beside the existing copyright/prototype line. No shared footer, `/intake/`, `/weight-loss-menopause`, homepage, checkout, or payment flow was changed.
- [x] Preserve the supplied checker URL, image source, accessible title/alt text, and 73×79 desktop display size. The new-tab link includes `noopener noreferrer`; the page-scoped responsive footer layout reduces the seal proportionally to 61px wide on narrow phones to prevent clipping.
- [x] Validate: 11 focused route/footer tests, TypeScript, production build, fresh production `/weight-loss-intake` smoke test (HTTP 200 with seal present), and desktop/mobile browser review. The external seal image returned HTTP 200 `image/png`; it is right-aligned beside the copyright copy and fully visible in both responsive layouts.
- [x] Full suite: 353 passing / 1 failing across 72 files. The lone failure remains the previously documented `legitScriptCompliance` assertion against owner-approved imported prototype medication brand content; this footer-only update introduced no additional failure.
- [x] Saved as unpublished checkpoint `f4f53d80`; not published.

## Weight-Loss & Menopause LegitScript Footer Seal — 2026-10-15
- [x] Add the supplied LegitScript Certified seal only to the lower-right of the original purple footer on `/weight-loss-menopause`, alongside its existing copyright/prototype copy. The shared footer, `/weight-loss-intake`, `/intake/`, homepage, pricing, checkout, and payment behavior remain unchanged.
- [x] Preserve the checker URL, external seal source, accessible title/alt text, 73×79 desktop dimensions, and safe new-tab attributes. Page-scoped CSS scales the image to 61px wide on narrow phones without clipping or altering other page styles.
- [x] Validate: 18 focused tests, TypeScript, production build, external seal response (HTTP 200 `image/png`), desktop/mobile preview review, and fresh production-browser rendering at 1440px and 375px. The rendered checker link and loaded dimensions are correct in both layouts.
- [x] Full suite: 353 passing / 1 failing across 72 files. The lone failure remains the previously documented `legitScriptCompliance` assertion against owner-approved imported prototype medication brand content; this footer-only update introduced no additional failure.
- [x] Saved as unpublished checkpoint `32144c0f`; not published.

## Landing-Page Footer Legal Menus — 2026-10-15
- [x] Copy the homepage footer’s Patient Login, Terms, Privacy, HIPAA Notice, Subscription & Refunds, Shipping, and Accessibility links to the end of the original footers on `/weight-loss-intake` and `/weight-loss-menopause` only.
- [x] Reuse the exact homepage destinations, retain the external Patient Login link’s safe new-tab attributes, preserve both page-specific LegitScript seals and their existing footer copy, and use page-scoped responsive styling so all links remain readable and usable on phones.
- [x] Validate: 19 focused tests passed; TypeScript passed; production build passed; direct production routes `/weight-loss-intake`, `/weight-loss-menopause`, `/`, and `/masterclass` all returned HTTP 200; four desktop/mobile browser checks confirmed all seven destinations, correct row order after the seal/copyright area, no horizontal overflow, and readable wrapping.
- [x] Full suite: 354 passing / 1 failing across 72 files. The sole failure remains the pre-existing `legitScriptCompliance` assertion against owner-approved imported prototype medication brand content; this footer-navigation update introduced no additional failure.
- [x] Saved as unpublished checkpoint `54a8ae6a`; not published.

## Intake Confirmation Step 2 Portal Wording — 2026-10-15
- [x] Update only Step 2 on the completed `/intake/` confirmation timeline: title remains `Create your account`; supporting text is now `Set your username and password, then log in to the patient portal.`
- [x] Preserve Steps 1 and 3, the surrounding completion content, the $49 safety-net copy, payment/Keragon behavior, timeline layout, and the `Start over` action.
- [x] Validate: 12 focused static-intake tests, TypeScript, production build, and non-payment confirmation-screen browser QA. The new Step 2 copy is visible above `Start over` with no horizontal overflow at 343px mobile and 760px desktop widths.
- [x] Full suite: 354 passing / 1 failing across 72 files. The only failure remains the documented `legitScriptCompliance` assertion against owner-approved imported prototype medication brand content; this text-only update introduced no additional failure.
- [x] Saved as an unpublished checkpoint; not published.

## Intake Dedicated Thank-You Route — 2026-10-16
- [x] Create the page-isolated, noindex confirmation document at `/intake/thank-you/`. It recreates the approved completed-intake content: `You’re in`, the 24-hour review note, Dr. Al-Deek messaging block, $49 safety net, all three current Patient Portal next steps, and `Start over` to `/intake/`.
- [x] Give the document its own title (`Intake Complete | MedMethod Direct`), canonical `https://medmethoddirect.com/intake/thank-you`, responsive light/dark styling, Demo/Sandbox banner only for an explicit `?prefill=demo` URL, and no intake answer, payment detail, submission ID, patient identifier, Keragon URL, API call, or tracking pixel.
- [x] Add standalone route/build/crawler/preview support: Vite outputs `dist/public/intake/thank-you/index.html`; Express serves both `/intake/thank-you` and `/intake/thank-you/`; social crawlers receive the document’s own noindex/canonical/title rather than generic SPA metadata; the preview route list has a redirect-only alias without rendering React overlays.
- [x] Redirect from the existing card and Apple Pay `onPaid` callback only after the server capture helper returns a completed result. The mocked no-charge Sandbox capture QA made one intercepted create-order and one intercepted capture response, then navigated to `/intake/thank-you/?prefill=demo`; no real PayPal or Keragon request was permitted. The legacy hosted-return `paypal=success` branch also full-navigates to the generic thank-you document, which remains non-sensitive and does not by itself assert payment verification.
- [x] Validate: 43 focused route/crawler/static-intake tests; TypeScript; production build; fresh production document and crawler checks; development HTTP 200 checks for `/`, `/intake/`, `/intake/thank-you/`, `/weight-loss-intake`, `/weight-loss-menopause`, and `/masterclass`; direct mobile (375px) and desktop (1440px) browser QA with image decode/no overflow/no API calls; explicit demo-banner check; and mocked confirmed-capture redirect QA.
- [x] Full suite: 355 passing / 1 failing across 72 files. The only failure remains the documented pre-existing `legitScriptCompliance` assertion against owner-approved imported prototype medication brand content; this confirmation-route update introduced no additional failure.
- [x] Saved as an unpublished checkpoint; not published.

## Intake Thank-You Patient Portal Guidance — 2026-10-16
- [x] Update only the dedicated `/intake/thank-you/` page’s `What happens next` sequence: (1) Check your text messages and reply to Med Method Direct; (2) Check the welcome email, create the Patient Portal account, and log in; (3) Complete required forms through Forms & Questionnaires in the right-side Patient Portal menu.
- [x] Upload the user-supplied 1200×653 WebP Patient Portal screenshot (51 KB) to this project’s media storage and place it directly below Step 3. Keep the original pixels, use accurate non-identifying alt text, responsive width, and page-local styling.
- [x] Add the approved follow-up: `Once completed, Dr. Al-Deek will review your information and get in touch with you for the next steps.` Add the Care Team callout with an accessible telephone link to `888-362-7011`.
- [x] Preserve the thank-you title/canonical/noindex metadata, demo-only banner, payment-success redirect, safety-net, doctor block, Start over action, other site pages, and no-data/no-payment behavior. This page still makes no API, Keragon, PayPal, or tracking request.
- [x] Validate: 43 focused route/crawler/static-intake tests, TypeScript, production build, responsive browser QA at 375px mobile, 390px dark mobile, and 1440px desktop, visual review, storage image decode/delivery, fresh production route HTTP 200, and crawler metadata. No horizontal overflow or API requests occurred. Full suite: 355 passing / 1 pre-existing `legitScriptCompliance` failure; the page-only content update introduced no new failure.
- [x] Saved as an unpublished checkpoint; not published.

## Weight-Loss Landing Footer Phone Links — 2026-10-16
- [x] Add a clear `Call us: +1 888-362-7011` tap-to-call link (`tel:+18883627011`) to the original footer navigation area on `/weight-loss-intake` and `/weight-loss-menopause` only. The shared site footer and all unrelated routes remain unchanged.
- [x] Use page-scoped responsive treatments consistent with each imported footer: high-contrast bordered call pills, `44px` desktop and `48px` phone touch targets, keyboard focus visibility, and the phone number emphasized within the link. The controls appear under the local footer navigation on desktop and mobile, before disclosures/seals/legal links.
- [x] Validate: 20 focused footer tests, TypeScript, production build, clean `git diff --check`, and responsive browser QA at 1440px and 375px. Both page links are visible, have the correct `tel:` target and label, remain at least 44px tall, and introduce no horizontal overflow. Fresh production browser smoke checks at 390px confirm the same behavior.
- [x] Full suite: 355 passing / 1 failing across 72 files. The sole failure remains the documented pre-existing `legitScriptCompliance` assertion against owner-approved imported prototype medication brand content; this footer-only update introduced no additional failure.
- [x] Saved as an unpublished checkpoint; not published.

## Wegovy Pill Price Correction — 2026-10-16
- [x] Change only **Wegovy Pill® – Direct from NovoCare®** in the shared treatment catalog from `$199/month` to the approved **`$149/month`**. The Wegovy® injection remains `$349/month`; all other medication names, prices, supply lines, and payment fees are unchanged.
- [x] Keep all requested routes on the same single treatment source: `/weight-loss-intake` treatment card loads the generated browser catalog; `/weight-loss-menopause` GLP-1 card imports `shared/treatmentCatalog.json`; `/intake/` selection and plan-review cards load the same browser catalog. No duplicate Wegovy Pill price list exists in those page sources.
- [x] Update the main intake’s Keragon-bound data safely: the raw `answers.treatment_interest` preserves the selected label as `Wegovy Pill® – Direct from NovoCare® — $149/month`; server delivery sanitizes it into `intake_summary` and `intake_summary_html` as `Treatment interest: Wegovy Pill - Direct from NovoCare - $149/month`. No card data, capture, or real webhook delivery was used for validation.
- [x] Price appearance confirmation: (1) **`/weight-loss-intake` selection card** — `$149/month`; (2) **`/weight-loss-menopause` GLP-1 selection card** — `$149/month`; (3) **`/intake/` treatment-selection card** — `$149/month`; (4) **`/intake/` plan review card** — `$149/month`; (5) **`/intake/` pre-payment payload / Keragon `intake_summary`** — `$149/month`. The checkout charge remains the unrelated `$49.00` consultation fee and does not display a medication price.
- [x] Validate: 32 focused catalog/static-intake/menopause/payment tests; TypeScript; production build; a stale-price audit; desktop (1440px), tablet (768px), and mobile (375px) shared-catalog browser QA (7 landing GLP-1 cards, 7 menopause GLP-1 cards, 12 HRT cards, 7 intake cards); mocked no-charge intake review/checkout QA; and fresh production HTTP 200 for `/weight-loss-intake`, `/weight-loss-menopause`, `/intake/`, and `/treatment-catalog.js`. All active catalog consumers expose `$149/month` for Wegovy Pill.
- [x] Full suite: 356 passing / 1 failing across 72 files. The only failure remains the documented pre-existing `legitScriptCompliance` assertion against owner-approved imported prototype medication brand content; this price correction introduced no additional failure.
- [x] Saved as an unpublished checkpoint; not published.

## Weight-Loss & Menopause Program-Price Card — 2026-10-17
- [x] Keep the original `Medication pricing, upfront.` GLP-1/HRT toggle and catalog markup intact for later reuse, but hide the entire visitor-facing section with both semantic `hidden` state and scoped CSS. It remains in the source and shared-catalog interactions; it is absent from visible layout, accessibility focus, and product-card rendering.
- [x] Put the approved `One program price. No surprises.` card in the same page position. It includes the exact $49 today / $49 per month message, $49 summary, refund/cancel line, all three checklist items, medication-separate note, and a `Start your visit →` CTA that retains the existing `https://intake.medmethoddirect.com/` destination.
- [x] Change only the hero CTA label to `See your options →` and its supporting line to `A few quick questions`. All other existing `Start your visit` links remain unchanged; the new program card adds its requested CTA.
- [x] Update only the `How much does medication cost?` FAQ answer to: `Medication is priced separately, and your exact medication and price are confirmed during your assessment before you're charged.`
- [x] Validate: 8 focused menopause-page tests, TypeScript, production build, clean diff check, desktop (1440px) and phone (375px) browser QA, no horizontal overflow, visible card copy/CTA, exact FAQ text, and zero visible medication cards or old pricing heading. Fresh production HTTP 200 checks passed for `/`, `/weight-loss-menopause`, `/intake/`, and `/masterclass`; crawler metadata and the built React asset contain the correct route title/noindex and new page copy.
- [x] Full suite: 357 passing / 1 failing across 72 files. The only failure remains the documented pre-existing `legitScriptCompliance` assertion against owner-approved imported prototype medication brand content; this page-only update introduced no additional failure.
- [x] Saved as an unpublished checkpoint; not published.

## Weight-Loss & Menopause Mobile-First Pricing Card Refinement — 2026-10-17
- [x] Refine only the existing visitor-facing program-price section to match the approved mobile-first reference hierarchy: a centered headline/description above one unified card with the $49 amount, membership timing, refund/cancel note, divider, three-item checklist, medication note, and centered `Start your visit →` CTA.
- [x] Preserve the exact approved copy, $49 membership details, medication-separate disclosure, existing CTA destination (`https://intake.medmethoddirect.com/`), hidden-but-retained medication grid, hero CTA/FAQ updates, shared catalog, page header/footer, and all other page sections.
- [x] Use scoped responsive styles only. The section is centered within an 860px layout; the card is capped at 820px; phone layout uses a 347px-wide card on a 375px viewport, 24px radius, a full-width CTA, readable centered summary/note, and no horizontal overflow. The page’s existing sticky header/mobile CTA were hidden only during a clean visual capture and were not changed.
- [x] Validate: 8 focused menopause-page tests, TypeScript, production build, clean diff check, development browser QA at 375px and 1440px, and a fresh production browser session at 375px. Both builds show the correct heading, `$49`, divider, three checklist items, archived grid hidden, unchanged external CTA destination, and no horizontal overflow. Full suite: 357 passing / 1 failing across 72 files; the only failure remains the documented pre-existing `legitScriptCompliance` assertion against owner-approved imported prototype medication brand content.
- [x] Saved as an unpublished checkpoint; not published.

## Weight-Loss & Menopause CTA Label Consistency — 2026-10-17
- [x] Apply confirmed copy-only update to all remaining visit CTAs on `/weight-loss-menopause`: page-specific header (desktop/mobile), program card, estimator, lower pricing section, privacy section, and mobile sticky CTA now say `See your options →`. Update the sticky accessible label to match. Hero wording and `A few quick questions` remain unchanged.
- [x] Preserve every link destination, pricing/medication copy, archived grid, layouts, and other pages. Shared Navbar source/default remains unchanged; this page passes its existing `primaryLabel` override.
- [x] Validate 8 focused tests, TypeScript, build, and no-submission browser QA at 375/768/1440px: all intake CTA labels match, arrow/CTA fit, sticky appears normally, no page overflow or JS errors. A normalized baseline comparison confirms only the approved labels/arrow changed. Fresh production HTTP 200 on new page and four existing routes. Full suite: 357 pass/1 known pre-existing compliance failure, no new failures.

This update is for an unpublished checkpoint only. No public deployment is authorized.

## Weight-Loss & Menopause Warmer Pricing Card — 2026-10-17
- [x] Apply approved styling-only refinements: soft blush fading into white behind the summary, slightly smaller brand-purple $49, lighter border/gentler shadow, and modestly tighter divider/medication-note/button spacing. Preserve centered heading, pink checks, left-aligned benefits and gradient CTA.
- [x] Keep TSX markup, every price/word/link, hero, archived grid, payment/booking behavior and all other pages unchanged. All edits scoped to the existing program-price CSS block; regression coverage added.
- [x] Validate 9 focused tests, TypeScript/build, fresh production HTTP 200 on five routes, and browser checks at 320/375/768/1440px. Screenshots reviewed; no overflow or JS errors, price color/size confirmed, 52px CTA unchanged. Full suite: 358 pass/1 known prior compliance failure; no new failures.

Save this completed styling update as a checkpoint only. Do not publish automatically.

## Weight-Loss & Menopause Exact Pre-Card Restoration — 2026-10-18
- [x] Obtain explicit approval to restore the entire page exactly to 2fc9d1e4, immediately before the medication grid was archived and the new program card was added. Restore TSX, scoped CSS and matching page regression test directly from Git, byte-for-byte; do not mix later page edits into the old layout.
- [x] Confirm page dependencies, assets, interactions, shared Navbar and treatment catalog are unchanged since the approved source checkpoint. Original drug grid, GLP-1/HRT switch, original Start your visit labels/5-10 min hero and FAQ restored; newer program-price card/refinements removed from the current page. No other page, booking, payment, secret, tracking or Git-connection changes.
- [x] Verify 10 focused tests, TypeScript/build and five fresh production route HTTP 200 checks. Browser checks at 375/1440px pass for seven GLP-1 cards, twelve HRT cards, restored estimator switching, image decode, original CTA and no overflow/errors. Full suite 356 pass/1 known previous compliance failure, no new failures.

Save the restored page as a new checkpoint only. Public publishing is not authorized.

## Weight-Loss & Menopause Drug-Card Get Started Buttons — 2026-10-18
- [x] Owner confirmed buttons-only scope. Add one full-width “Get started” gradient CTA to the reusable medication card, producing buttons on all 7 GLP-1 and 12 HRT cards. Use the existing https://intake.medmethoddirect.com/ destination with no medication auto-selection.
- [x] Preserve all pre-existing TSX markup byte-for-byte, CSS rules, card order, prices/supplies, images, GLP-1/HRT toggle, estimator, other CTAs, other pages and payment/tracking behavior. Only add the card CTA and three scoped CSS lines plus regression coverage.
- [x] Validate 8 focused tests, TypeScript, production build, 5 fresh production route HTTP 200 checks, and all 19 buttons at 375/768/1440px. Confirm exact link destination via intercepted navigation (no intake submission), white text/gradient, 44px+ touch targets, unchanged prices/supplies/order, no overflow or browser JS errors; mobile/desktop visual review passed.
- [x] Full suite: 357 pass/1 previously documented LegitScript content-policy failure, with no new regressions. Save checkpoint only; publishing is not authorized.

## Weight-Loss & Menopause Four Pictured HRT Cards — 2026-10-18
- [x] Apply the explicitly approved page-only display filter for Estradiol Tablets, Estradiol Patch, Micronized Progesterone Pill, and Vaginal Estrogen Cream. Keep their existing images, order, prices/supplies, styling and Get started buttons; Divigel remains removed.
- [x] Preserve the 12-item shared HRT catalog and intake options, seven GLP-1 cards, estimator/toggle behavior, external intake destination with no medication auto-selection, CSS/interactions, other pages, payments/tracking and Git connection. Source comparison confirms only the HRT allowlist and render source changed.
- [x] Validate 9 focused tests, TypeScript, production build, five fresh production HTTP 200 routes, and development/production browser checks at 375/768/1440px: four HRT cards/images/buttons, no placeholders, unchanged prices, correct intercepted intake navigation with no submission, working estimator, no overflow or JS errors. Desktop/mobile screenshots reviewed. Full suite: 358 pass/1 documented pre-existing LegitScript imported-prototype content failure; no new regressions.

Save this completed correction as a checkpoint only. Public publishing is not authorized.

## Weight-Loss & Menopause Wegovy Injection Card Alignment — 2026-10-18
- [x] Apply approved Wegovy-injection-only spacing correction on `/weight-loss-menopause` for multi-column layouts (621px+): match the neighboring 196px image box and reserve the neighboring price-block height so Frequency/Form, disclaimer and Get started align. Keep the image contained without cropping and keep the existing button position.
- [x] Preserve mobile layout and every other card's geometry; TSX, images, $349/month injection price, absence of a supply line, wording, CTA styling/destination, shared catalog, four-card HRT subset and all other page/payment/tracking behavior remain unchanged. Only six scoped CSS lines and one regression test were added.
- [x] Validate 10 focused tests, TypeScript/build, five fresh production HTTP 200 routes, clean diff, and development/production browser QA at 375/768/1440px. Wegovy image/price/details/note/button align within 1px of neighboring cards at tablet/desktop; original CTA position and outer card height retained. Other GLP-1 cards and mobile Wegovy geometry match the measured baseline exactly, with no overflow or JS errors. Desktop/mobile screenshots reviewed. Full suite: 359 pass/1 documented pre-existing imported-prototype compliance failure; no new regressions.

Save this completed alignment fix as a checkpoint only. Do not publish.

## Masterclass Step 2 Payment Popup Sizing — 2026-10-19
- [x] Apply the explicitly approved sizing-only enlargement to Step 2 on `/masterclass`: up to 680px wide and min(94dvh, 960px), bounded by phone safe areas. Remove only this expanded step's upward mobile offset; retain the existing outer scroll body, close/back controls and responsive containment.
- [x] Preserve Step 1, the default 480px/720px modal limits, calendar limits, homepage/other landing-page popups, all page copy, payment amounts/providers/processing, hosted field components, patient-identity handling and booking redirects. Browser regression confirms homepage Step 2 remains 480px by 720px and masterclass Back restores Step 1's original width and contact details.
- [x] Validate 23 focused tests, TypeScript, production build, five fresh production HTTP 200 routes, and no-payment browser QA at 1440x1080, 1366x900, 768x1024, 375x812 and 320x568. Blank SDK fixtures and actual PayPal hosted inputs with all checkout-order mutations intercepted confirm four fields render without clipping, the full card block is visible on desktop/tablet, and phones use only the overall popup scroll as needed. Actual hosted desktop/mobile screenshots reviewed; no order/charge/capture/webhook submission and no JS errors. Full suite: 363 passing / 1 documented pre-existing imported-prototype compliance failure; no new regressions.

Save this completed fix as a checkpoint only. Public publishing is not authorized.

## Masterclass PageView Meta Pixel — 2026-10-19
- [x] Add the supplied Meta Pixel 1589326469554181 on `/masterclass` only, using the supplied bootstrap with PageView (no Lead, Schedule, registration, purchase, custom clinical labels or patient data). Mount tracking for direct/internal navigation with a per-document script marker, matching outbound-PageView guard, and existing-pixel initialization reuse.
- [x] Add the supplied 1x1 noscript PageView image to only this route's initial HTML through the existing metadata transformation; shared document, confirmation Pixel bootstrap, and social-crawler HTML are unchanged. Disable automatic navigation PageViews/form-button auto-configuration in the masterclass installation so it does not leak automatic events to unrelated SPA pages. The current public GTM-KMBG6HSR script has no matching Meta Pixel ID/bootstrap; no GTM account changes were made.
- [x] Preserve masterclass content/JSX/styles/images/YouTube UNYMLkd61z8, booking/payment components and all other route behavior. Source comparison confirms only tracking imports/effect added to page; payment components and shared confirmation bootstrap remain byte-identical. No form submission or payment attempted.
- [x] Validate 68 focused tests, TypeScript, final production build, eight HTTP route/query/trailing-slash responses and social-crawler metadata, and development/production browser QA at 375/768/1440px. Actual Meta SDK plus fetched official pixel configuration produces exactly one intercepted PageView with the correct ID, no conversion events, one library, no horizontal overflow or JS errors. Internal navigation/remount does not duplicate it; no-JavaScript fallback sends exactly one intercepted PageView; unrelated direct routes have no new installation. Test collection requests were intercepted, not sent to Meta. Full suite: 378 passing / 1 documented pre-existing imported-prototype compliance failure; no new failures.

Save as a checkpoint only. Public publishing is not authorized.

## Care-Team Booking Confirmation Meta Pixel — 2026-10-19
- [x] Apply the confirmed supplied PageView + Lead snippet only on `/care-team-booking-confirmed` using existing Pixel 1589326469554181. Keep the existing PageView once and replace this route's Schedule conversion with Lead, with no custom event parameters. Keep all other confirmation mappings and `/masterclass` tracking unchanged.
- [x] Prevent a duplicate Lead from the old three-second SDK/image fallback race on this page only; other pages' fallback behavior remains unchanged. Preserve the existing single-install marker, page content/JSX/styles, guarded dataLayer booking signal, routes, booking/payment components and Git connection.
- [x] Validate 32 focused tests, TypeScript, final build, five fresh production HTTP 200 routes, and actual Meta SDK development/production browser QA at 375/768/1440px with collection requests intercepted. Exactly one PageView and one Lead, no Schedule/other conversions, no added custom parameters, one library/script, no overflow or JS errors; repeated installer call does not duplicate events. Source comparisons verify confirmation page, shared HTML, masterclass and payment components unchanged. No form/payment submission or test events sent to Meta. Full suite: 380 passing / 1 documented pre-existing imported-prototype compliance failure; no new failures.

Save this tracking update as a checkpoint only. Do not publish.

## Care-Team Booking Page Meta Pixel — 2026-10-19
- [x] Add the owner-confirmed `fbq('track', 'PageView'); fbq('track', 'Lead');` only on `/care-team-booking`, using existing Pixel 1589326469554181. Dedicated route-guarded installer mounts on the booking page, prevents repeated script insertion and reuses already-loaded or queued pixel initialization. No timed image fallback, custom parameters, clinical labels, or patient data. Added automatic-navigation/form-tracking guards only in this new installer to keep the addition page-scoped.
- [x] Preserve all calendar embed and confirmation redirect behavior, page copy, header/footer, layout/styles, routes, and booking/payment components. Source comparison confirms the page differs solely by one import and one tracking effect. Existing confirmation bootstrap/mapping, confirmation page, masterclass installer/page, shared shell, crawler metadata and redirect helper remain byte-identical; no changes to GTM settings, secrets or Git configuration.
- [x] Validate 45 focused tests, TypeScript, production build and five fresh HTTP200 production routes. Development/production direct-page browser checks at375/768/1440px show one PageView and one Lead, no other events/custom data, one SDK/script, unchanged calendar URL, no overflow or JS errors. Corrected QA attribution to use the active browser route because Meta redacts the transmitted page URL to the origin. Development/production internal-navigation checks confirm the exact two calls once with loaded pixel/library reused, no reinit/remount duplicates or extra homepage events; Meta may deduplicate a repeated PageView within the same document and this is not bypassed. Existing confirmation events remain unchanged. All collection requests intercepted; no actual Meta test events, calendar form submissions or payments. Full suite:393 pass/1 documented pre-existing imported-prototype compliance failure; no new failures.

Checkpoint only; do not publish this change.

## Care-Team Confirmation Lead Session Guard & URL Privacy — 2026-10-19
- [x] Apply directly per owner instruction on `/care-team-booking-confirmed` only: replace the already-present unguarded Lead with the exact parameter-free `fbq('track', 'Lead')` after the unchanged existing PageView and base initialization. New `mmd_lead_fired` sessionStorage flag stores only string `true`; skips repeats/refreshes, requires existing fbq, and fails closed if flag storage is unavailable. No second base, PageView, image fallback, value/currency or personal/clinical/matching arguments. Existing other page event installations remain unchanged.
- [x] Add confirmation-only documented manual-only `autoConfig: false` before the existing init to suppress automatic page/form metadata. Do not add init matching data or change Meta account settings. No matching fields found in tested payloads; Meta's account-level Automatic Advanced Matching setting is separate and must remain disabled by the account owner. Standard Pixel network/browser/cookie identifiers still exist; this is not a zero-data or HIPAA-compliance claim.
- [x] Prevent query/referrer data reaching the Pixel on this route: a no-store/no-referrer 302 to the identical clean path when a query or incoming referrer exists, then serve normal HTML without a loop; route-only early response script strips query/hash before GTM/Meta; bootstrap repeats the clean URL defense and fails closed if it cannot sanitize. Shared HTML file/GTM installation remains byte-identical. Other routes' HTML, referrer/query handling, booking/payment components, visible confirmation content/styles and masterclass/booking tracking remain unchanged.
- [x] Validate96 focused tests, TypeScript and production build. Full suite415 passing/1 known pre-existing imported-prototype compliance failure; no new failures. Five production HTTP200 route checks verify the HTML privacy guard appears only on the target route. Real SDK preview/production browser checks cover375/768/1440px: firstload PageView+Lead, refresh PageView only, fresh-session Lead, delayed SDK queuing, no duplicate base/script, no custom/advanced-matching data, unavailableflag storage skipping Lead but retaining PageView, query/hash/sensitive incoming referrer cleanup with no synthetic private marker on any captured Meta request, empty document.referrer, no overflow/JS errors in normal sessions, and unchanged masterclass. All collection requests intercepted; no actual Meta test events, bookings, patient data or payments sent.

Checkpoint only; do not publish. Explain exact Lead code and Meta Pixel Helper verification, including that sessionStorage is per-tab session storage and account-level matching controls were not modified.

## Care-Team Confirmation Lead + Schedule — 2026-10-19
- [x] Owner explicitly approved `PageView + Lead + Schedule` on `/care-team-booking-confirmed` only, checkpoint only. Preserved existing base/PageView/shared bootstrap byte-for-byte and existing Lead IIFE verbatim. Appended only exact parameter-free `fbq('track', 'Schedule')` behind the same route/fbq/storage-safety checks, with independent boolean-only `mmd_schedule_fired` flag so existing `mmd_lead_fired=true` does not suppress the new Schedule. Each conversion call occurs once per tab session; refresh retains only the original PageView. No Purchase, CompleteRegistration, value/currency, personal/health/matching parameters, extra pixel/base, fallback or visible content/style changes on this page. Other page event installations/maps, shared shell/GTM, URL/referrer privacy defenses, calendar/payment behavior and Meta account settings untouched.
- [x]98 focused tests, TypeScript and production build passed. Full regression417 passed/1 documented pre-existing LegitScript imported/generated-content failure; no new failures. Real-browser preview and freshly built isolated production checks at375/768/1440px observed exact first-load fbq call order PageView→Lead→Schedule, refresh PageView only, existing Lead flag migration calling only PageView+Schedule, one base/script, only true session flag values, unchanged headline/layout/no overflow/JS errors, unchanged masterclass/no Schedule flag, and5 production HTTP200 routes. All external tracking and gateway delivery blocked, no actual Meta conversions or booking/payment submissions. Temporary production server stopped automatically.
- [x] Explicit delivery caveat: these tests prove website call configuration, NOT Meta acceptance. The prior live fresh-session audit retrieved Pixel1589326469554181's real remote config with `restrictedEventNames` including Lead and Schedule (also Purchase/CompleteRegistration), and confirmed SDK suppression. No Meta restriction was removed, disabled or bypassed; this addition cannot resolve the account-side block. Previous cached-configuration delivery QA did not establish acceptance under the live restrictions. Do not publish this new update.

## Care-Team Confirmation PageView + Lead Only — 2026-10-19
- [x] Owner explicitly confirmed removal of Schedule only on `/care-team-booking-confirmed`, checkpoint only. Removed the recently added Schedule IIFE and its flag handling; restored `careTeamConfirmationLead.ts` byte-for-byte to the original protected version from0454d3ff. Existing base/init/PageView/shared bootstrap, exact parameter-free Lead, once-per-tab-session `mmd_lead_fired=true`, fbq readiness/queueing and storage-denied fail-closed behavior unchanged. No new PageView/base or Purchase/CompleteRegistration; no matching/personal/health/value/currency arguments. Prior unused Schedule flag is harmlessly left to expire; it is never read or written by this confirmation code. All other pages/events, content/styles, clean-URL/referrer defenses, calendar/payment behavior, secrets, Meta settings and Git connection unchanged.
- [x]98 focused tests, TypeScript and production build passed. Full suite417 passed/1 previously documented unrelated LegitScript prohibited-brand content assertion. Preview and freshly built isolated production browser checks at375/768/1440 observed PageView→Lead only on first load and PageView only on refresh, no Schedule/Purchase or new Schedule flag, one base/library, retained existing flags, unchanged headline and masterclass/no confirmation Lead leakage, no overflow/JS errors, and5 production routes HTTP200. All external collection and gateway requests blocked, no actual test conversions/booking/payment submissions; temporary production server stopped automatically. These checks establish website calls, not Meta acceptance. The previously identified Meta-side Lead restriction is untouched and is not resolved by this removal. Approved checkpoint only, not published.

## Care-Team Confirmation Head Pixel + Guarded Lead — 2026-10-19
- [x] Owner supplied full Pixel1589326469554181 base/PageView/Lead/noscript code for `/care-team-booking-confirmed` only, then explicitly selected Keep Lead once per session instead of unconditional Lead. Added one authoritative guarded script to this route's initial server-rendered `<head>` after the existing early URL privacy guard. Retained exact previous `careTeamConfirmationLead.ts`, `mmd_lead_fired=true`, fbq readiness/queueing, blocked-storage fail-closed behavior and manual-only autoConfigfalse/no advanced matching. Existing client installer detects the same script ID and does not add a second copy; guarded source is shared for its existing internal-navigation fallback. Added supplied PageView-only noscript image in HTML-valid body location, not invalid head image markup; inactive when JS is enabled. No Schedule/Purchase or custom/personal/health/value/currency arguments. Shared shell/GTM, route map and all other route installations, visible copy/styles, clean-URL/referrer protections, calendar/payment/secrets/Git/Meta account settings unchanged. Scope approved for checkpoint only, not published.
- [x]107 focused tests, TypeScript and production build passed; full suite426 passed/1 known pre-existing unrelated LegitScript prohibited-content assertion. Preview and isolated production real-browser375/768/1440px checks verified initial response has one head script/init, early privacy precedes it, one library/no client duplication, PageView→Lead first-load calls and PageView only refresh, unchanged heading/layout/no overflow/errors and unchanged masterclass/no confirmation script/noscript/Lead. JavaScript-disabled browser attempted exactly one supplied PageView noscript request, no Lead/dl/custom data and empty referrer. Sensitive synthetic query/hash cleaned before head Pixel initialization. Five route HTML responses HTTP200 and fallback route scope checked. All collection/gateway requests intercepted/blocked, no actual Meta conversions/booking/payment data submitted; temporary production server stopped. These are implementation/call tests, NOT Meta acceptance: previously identified remote Lead restriction is neither disabled nor bypassed by this change.

## Care-Team Confirmation Lead on Every Load — 2026-10-19
- [x] Owner explicitly confirmed Lead on every load on `/care-team-booking-confirmed` only, save and publish. Replaced only `CARE_TEAM_CONFIRMATION_LEAD_CODE` with exact `fbq('track', 'Lead');`: no Lead sessionStorage/flag reads/writes, condition, IIFE, SDK type check or storage-denied suppression. Parent confirmation-only head initializer still defines the asynchronous fbq queue, calls PageView then immediately this unconditional Lead. Old flags left harmlessly untouched, never consulted. One head/base/library with existing client duplicate-ID guard; all URL/hash/query/referrer and manual-only matching safeguards remain. Other pages/events, visible copy/layout, noscript PageView, booking/payment, secrets, Git and Meta account settings unchanged. Four related test files updated only for this new approved behavior.
- [x]100 focused tests, TypeScript and build passed; full suite419 passed/1 previously documented unrelated LegitScript content assertion. Preview and freshly built isolated production375/768/1440px browser checks observed exact PageView→Lead first-load AND refresh calls, one base/library, no new session flag, old true flags and blocked Lead-flag storage do not suppress either event; unchanged no-JS PageView fallback, masterclass and clean-URL privacy, no overflow/errors, five route HTML200s. All Meta collection/gateway requests blocked, no actual test conversions/bookings/payments sent; isolated production server stopped. These checks prove website calls, not Meta acceptance; Meta-side restriction neither removed nor bypassed.
- Publication is explicitly approved for the resulting release checkpoint. Current session's full tool list confirms no direct publish/deploy action; publication must use the website panel Publish action or an existing auto-publish configuration. Do not claim live deployment solely from saving a checkpoint. Live HTML status will be checked after save and the exact remaining UI action reported if still necessary. Historical unrelated tracker items are not in scope.

## Masterclass Apple Pay Deposit Option — completed 2026-10-20

- [x] Added Apple Pay only to Step 2 of the `/masterclass` 45-minute-visit popup when PayPal is active and its selected Sandbox/Live configuration is ready.
- [x] Runtime-gated display by Apple device/wallet capability and PayPal merchant eligibility; black button/white text; no payment order until the visitor explicitly chooses Apple Pay or card.
- [x] Uses the exact $50 deposit and requires unchecked consent for saving Apple Pay through PayPal and charging the existing $149 balance on the appointment day. Later charges use `payment_source.apple_pay.vault_id` with PayPal’s recurring merchant-initiated source; card/legacy vaults remain `payment_source.card`.
- [x] Added source-safe pending/vaulted handling, PayPal webhook-signature verification for delayed vault tokens, stable remaining-balance idempotency, and masked Sandbox/Live Webhook ID fields in Admin Settings. The matching PayPal app must subscribe to `PAYMENT.CAPTURE.COMPLETED` and `VAULT.PAYMENT-TOKEN.CREATED`; the Apple Pay option remains unavailable until that active environment’s webhook ID is saved.
- [x] Applied additive database fields for vault source, consent/readiness, and environment webhook IDs. No existing payments, card checkout, Stripe behavior, `/intake`, other pages, or public deployment changed.
- [x] Validated: 27 focused tests passed; TypeScript and production build passed; preview and built-production browser simulations passed for eligible/ineligible devices with no real payment/order/submission; `/masterclass`, `/`, `/weight-loss-menopause`, and `/intake/` production route smoke tests returned 200. Full suite: 431 passed, with one documented pre-existing `legitScriptCompliance` failure.

## Intake Family Coupon — completed 2026-10-20

- [x] Added a **Coupon code** field and Apply control above the payment fields on `/intake/` only. Normal $49 PayPal card and eligible Apple Pay checkout remain unchanged until a coupon is successfully applied.
- [x] Added the server-only, case-insensitive, whitespace-trimmed unlimited code **`family`** through `MMD_INTAKE_FAMILY_COUPON_CODE` (with the approved `family` default). The browser contains neither the configuration name nor a hardcoded valid code; validation uses a constant-time server comparison and generic invalid-code feedback.
- [x] A valid code changes only this intake checkout to **Family discount applied — $49 waived**, updates the order summary to $0.00, hides card and Apple Pay controls, retains the final accuracy/submission consent, and provides the sole in-card action **Submit intake for clinical review**. The redundant sticky checkout footer is hidden only in this waived state to prevent mobile overlap.
- [x] The waived submit endpoint revalidates the code server-side, does not read PayPal settings, does not create/capture a PayPal order, does not collect card details, and sends the existing sanitized intake exactly once to the existing server-to-Keragon delivery boundary. The delivered payment metadata is `provider: none`, `method: coupon`, `mode: waived`, `amount: 0.00`, `status: waived`, and the user is redirected to the existing `/intake/thank-you/` confirmation route. No server-side intake database storage was added.
- [x] Validated: direct server validation accepts `family` and rejects an invalid code; 24 focused tests, TypeScript, syntax validation, and production build passed. Preview and rebuilt-production browser QA at 375px and 1440px exercised invalid code, family coupon, hidden card/Apple Pay fields, $0 summary, required final consent, and one intercepted waived submission to the existing thank-you route; no real intake, Keragon delivery, PayPal order, or payment was sent. `/intake/`, `/intake/thank-you/`, `/weight-loss-intake`, `/weight-loss-menopause`, `/masterclass`, and `/` returned production HTTP 200. Full suite: 433 passed, with the same one documented pre-existing `legitScriptCompliance` failure.

## Intake Thank-You Account Details Guidance — completed 2026-10-20

- [x] Updated only Step 3 on `/intake/thank-you/` to **Complete your Account Details & Required Forms** with the approved instructions: use **My Account Details** first, then **Forms & Questionnaires** to review, sign, and submit required forms.
- [x] Replaced the prior portal screenshot with the supplied highlighted-menu image, stored at the project storage path and given descriptive alt text covering both highlighted menu items.
- [x] No intake, payment, redirect, tracking, routing, or other thank-you-page content changed. Focused regression tests (14), TypeScript, and production build passed. Desktop and mobile browser QA plus rebuilt-production checks verified the exact copy, loaded image, no horizontal overflow, no browser errors, and HTTP 200 for the thank-you, intake, landing, masterclass, and home routes. Full suite: 433 passed, with the one documented pre-existing `legitScriptCompliance` failure.

## Weight-Loss Intake Social Preview — completed 2026-10-20

- [x] Replaced the social-sharing thumbnail only for `/weight-loss-intake` with the supplied original 1734×907 (1.91:1) image. The image is stored in project storage without crop, resize, or generated replacement.
- [x] Added that page’s direct canonical, Open Graph, and `summary_large_image` Twitter tags, including matching original dimensions and descriptive image alt text. No visible landing-page content, other route metadata, payment flow, or routing changed.
- [x] Verified the preview and rebuilt production responses for normal, Facebook-style, and Teams-style user agents: each receives the same route-only image tags. The storage redirect resolves to HTTP 200 `image/jpeg`; relevant production routes return 200. Focused social metadata tests (15), TypeScript, and build passed. Full suite: 434 passed, with the one documented pre-existing `legitScriptCompliance` failure.

## Weight-Loss Intake Typography Social Banner — completed 2026-10-20

- [x] Replaced only the `/weight-loss-intake` Open Graph and Twitter social-preview asset with the newly supplied `MMDWeightLossTypographyBanner.png` in project storage. The original 1734×907 (1.91:1) PNG remains uncropped and unmodified.
- [x] Preserved the route’s canonical URL, preview title/description, native image dimensions, image alt text, and `summary_large_image` card format. No visible landing-page content, other route metadata, intake/payment behavior, tracking, or routing changed.
- [x] Verified normal, Facebook-style, and Teams-style preview responses in both preview and rebuilt production; each exposes the new route-only image metadata. The storage redirect resolves to HTTP 200 `image/png`; relevant production routes return 200. Focused tests (15), TypeScript, and build passed. Full suite: 434 passed, with the one documented pre-existing `legitScriptCompliance` failure.

## Weight-Loss Intake App-Screen Social Preview — completed 2026-10-20

- [x] Replaced only the `/weight-loss-intake` Open Graph and Twitter social-preview asset with the newly supplied app-screen image in project storage. The original 1734×907 (1.91:1) JPEG remains uncropped and unmodified.
- [x] Preserved the route’s canonical URL, preview title/description, native image dimensions, image alt text, and `summary_large_image` card format. No visible landing-page content, other route metadata, intake/payment behavior, tracking, or routing changed.
- [x] Verified normal, Facebook-style, and Teams-style preview responses in preview and rebuilt production; each exposes the new route-only image metadata. The storage redirect resolves to HTTP 200 `image/jpeg`; relevant production routes return 200. Focused tests (15), TypeScript, and build passed. Full suite: 434 passed, with the one documented pre-existing `legitScriptCompliance` failure.

## Weight-Loss Intake Free Text-Doctor Model — completed 2026-10-20

- [x] Updated only `/weight-loss-intake` to the approved asynchronous, free first doctor-conversation model: “Text a weight-loss doctor for FREE,” GLP-1 answers, complete intake then text the doctor, and the page-wide CTA “Start My Free Doctor Visit.” The page says medication costs are separate and clinical appropriateness/prescriptions are decided by Dr. Al-Deek.
- [x] Removed visible $49/month, $49-today, paid-membership, refund-offer, paid video-visit, and free-bonus-app messaging from the landing page. Reframed medication options, the three-step process, supportive-tool copy, testimonials, FAQ, what-to-expect panel, footer description, navigation, and mobile sticky CTA. Retained clinical-safety language and the shared GLP-1 catalog/prices.
- [x] Deliberately left `/intake/`, its existing payment checkout, payment/server code, routes, and the current social-share image unchanged until the separately planned intake redesign. All five page CTAs still route to `/intake/`.
- [x] Validated 1440px/768px/375px browser layouts, CTA destinations, no horizontal overflow, mobile sticky CTA, no browser errors, focused tests (16), TypeScript, production build, and built-production route/copy boundary checks. Full suite: 435 passed; the sole failure remains the documented pre-existing `legitScriptCompliance` assertion.

## Weight-Loss Intake Personal Hero Wording — completed 2026-10-20

- [x] Updated only the `/weight-loss-intake` headline from “Text a weight-loss doctor for FREE.” to “Text your weight-loss doctor for FREE.” Preserved the layout, all CTA destinations, separate medication-cost language, intake/payment behavior, and every other page.
- [x] Updated matching regression assertions. Validated focused tests (16), TypeScript, production build, whitespace, and browser QA at 1440px, 768px, and 375px with no overflow, page errors, or intake submission.

## Weight-Loss Intake Hero Brand-Palette Preview — completed 2026-10-20

- [x] Applied the supplied MMD Weight Loss palette only to the `/weight-loss-intake` hero: Warm Cream `#FAF9F5`, Deep Navy `#06264A`, Ocean Ink `#063B47`, Signature Teal `#008C95`, Soft Mint `#EAF7F1`, and Slate `#59656F`. Kept current typography, hero wording, layout, phone mockup, CTA destinations, intake/payment behavior, and all non-hero sections unchanged.
- [x] Validated all six computed colors in-browser, 1440px/768px/375px hero layouts, CTA behavior, no overflow or browser errors, focused tests (17), TypeScript, and production build. Preview only; no publication.

## Weight-Loss Intake Alternate Hero Brand System — completed 2026-10-20

- [x] Replaced the previous hero-only color preview on `/weight-loss-intake` with the newly approved guideline: Deep Navy `#061A46`, Signature Teal `#008A96`, Warm Ivory `#FFFCF5`, Soft Lavender `#E9ECF8`, and White `#FFFFFF`.
- [x] Loaded Montserrat 900 and applied the approved hierarchy only inside the hero: 900 headline, 800 CTA/eyebrow, 600 supporting copy, and 400 note/disclosure. The lavender reply surface is confined to the hero phone mockup.
- [x] Preserved hero content, layout, images, CTA destinations, intake/payment behavior, social metadata, all non-hero sections, and all other pages. Validated exact computed colors/weights, desktop/tablet/mobile no-submission browser QA, 17 focused tests, TypeScript, and production build. Checkpoint only; not published.

## Weight-Loss Intake Full Brand-System Rollout — completed 2026-10-20

- [x] Extended the approved alternate MMD Weight Loss system across the remaining `/weight-loss-intake` landing page only: Warm Ivory `#FFFCF5`, Deep Navy `#061A46`, Signature Teal `#008A96`, Soft Lavender `#E9ECF8`, and White `#FFFFFF`.
- [x] Updated non-hero backgrounds, pricing/start panel, app workspace, testimonials, header/privacy/mobile sticky CTAs, visual accents, footer, document theme color, and page-local focus/hover treatments. The hero remains the approved final option; all sections, text, images, pricing/business-model messaging, anchors, app tabs, five intake CTA destinations, and intake/payment flow are unchanged.
- [x] Validated desktop/tablet/mobile (1440/768/375px) without submission: no horizontal overflow or page errors; exact computed ivory/navy/teal/lavender colors; five intake CTAs; functional app tabs; and visible teal mobile sticky CTA. Focused suite: 18 passed; TypeScript and production build passed; built-production route/browser smoke passed for `/weight-loss-intake`, `/intake/`, and `/`. Full suite remains 437 passed with one known, unrelated `legitScriptCompliance` imported-content failure. Checkpoint only; not published.

## Weight-Loss Intake Brand-Led Doctor Presentation — completed 2026-10-20

- [x] Apply the approved brand-led direction on `/weight-loss-intake` only: preserve “Text your weight-loss doctor for FREE,” add the licensed medical weight-loss doctor supporting line, use “your doctor” in illustrative chat/medication/How it works/start-panel/FAQ copy, and replace the personal portrait/biography with “A real doctor. Care built around you.” and a neutral icon-based care panel. Remove individual credentials, book/patient-count copy, same-doctor promises and the physician-specific 24-hour guarantee; retain treating-physician identity transparency.
- [x] Hide the six named physician testimonials pending approved brand-neutral reviews, preserving their original quotes and attributions byte-for-byte. Retain approved palette, five intake CTA labels/destinations, shared medication catalog/prices, app assets/tabs, estimator, chat animation script, metadata/social image, footer/legal links and all other pages. Intake, thank-you, payment, webhook, storage and tracking code remain unchanged; the separate paid intake has not been converted to the free offer.
- [x] Validate 21 focused tests, TypeScript/build, exact content/scope review, desktop/tablet/mobile at 1440/768/375/320px in development and production, six production HTTP 200 routes, neutral animated greeting, hidden reviews, seven medication cards, five CTAs, app/estimator/FAQ/menu/sticky interactions, no overflow/errors and no submissions. Desktop/mobile visual captures reviewed. Full regression: 440 passed / 1 documented pre-existing imported-content LegitScript compliance assertion. Checkpoint only; do not publish. Existing response-time, free-offer and secure-messaging operational claims remain subject to launch verification.

## Weight-Loss Intake Step 2 Text-Messaging Copy — completed 2026-10-20
- [x] Update only the How it works Step 2 heading to “Connect with your doctor by text” and paragraph to “Your welcome text arrives instantly. Ask questions through HIPAA-compliant messaging.” Preserve all styling, neighboring steps, content, links and functionality elsewhere.
- [x] Verify the landing document is byte-identical to checkpoint ebf30212 after reversing this exact heading/paragraph replacement. Update only its matching regression assertion. Passed 21 focused tests, TypeScript, production build, 1440/768/375/320px no-submission browser checks, and desktop/mobile visual review; no overflow or JavaScript errors. This is approved marketing copy only, not a change to message delivery or a new compliance certification. Save checkpoint only; do not publish.

## Weight-Loss Intake Hero Label Removal & Centering — completed 2026-10-20
- [x] Remove the entire hero-only “MMD Weight Loss” eyebrow and its teal dot. Explicitly center the remaining hero headline and paragraphs within the existing copy column; preserve the headline wording, typography, palette, CTA and phone/two-column layout. Header and care-panel branding remain intact.
- [x] Passed 22 focused tests, TypeScript and production build; responsive browser checks at 320/375/768/874/961/1440px confirm no label, centered text within 1px, five existing intake destinations, and no overflow/errors. Desktop/mobile captures reviewed. Exact reversal of the label removal and new CSS/comment is byte-identical to 835ab35a, confirming no other document changes; the initial inverse-check whitespace mismatch was resolved without source changes. Checkpoint only; do not publish.

## Weight-Loss Intake How It Works Placement — completed 2026-10-20
- [x] Move the existing How it works section directly below Featured In on `/weight-loss-intake`: Hero → Featured In → How it works → Medication options → Estimator → remaining sections. Preserve its markup, text, three cards and styling exactly; retain every other section's relative order.
- [x] Passed 23 focused tests, TypeScript/build and independent byte-for-byte scope verification: reversing the one-line section move restores the full document to 2c073799. Browser QA at 1440/768/375/320px confirms exact adjacency, functional How it works navigation anchor, three cards, five intake destinations, seven medication cards, no overflow/errors, and intact Featured In strip. Desktop/mobile section captures reviewed. No intake submissions or payment changes. Checkpoint only; do not publish.

## Weight-Loss Intake Featured In Straight Edge — completed 2026-10-20
- [x] Disable only `#how-it-works.wave-top::before` to restore the straight horizontal boundary beneath Featured In. Keep Hero → Featured In → How it works → Medication options → Estimator, all spacing, logos, palette, text/cards and every other wave unchanged.
- [x] Passed 24 focused tests, TypeScript/build and exact inverse verification: removing the new scoped CSS/comment restores the document byte-for-byte to e54450ce. Browser checks at 1440/768/375/320px confirm straight edge, retained other curves, unchanged section heights/padding, order, cards and no overflow/errors. Desktop/mobile boundary screenshots reviewed. No submissions, payment or other-page changes. Checkpoint only; do not publish.

## Weight-Loss Intake Mobile Visit CTA Polish — completed 2026-10-20
- [x] Apply the approved mobile-only (900px and below) polish to hero and sticky CTAs: matching 17px bold labels, balanced centered wrapping, centered 5–10 min helper, smaller independently positioned right arrows, consistent 18px corners/padding, and one full-width teal sticky button with transparent wrapper and the redundant Free to text side label hidden. Preserve all button markup, wording, destinations, visibility logic, section order, other content and desktop.
- [x] Passed 25 focused tests, TypeScript/build and exact inverse verification: removing only the mobile CSS block restores the full document to c879ada1 byte-for-byte. Browser QA at 320/375/390/430/768/900px confirms contained labels/arrows, independent text/helper centering within 1px, 88–93px buttons, safe wrapping, working sticky show/hide and unchanged destinations; 901/1440px computed button styles exactly match the baseline. No overflow/errors or submissions. Mobile hero/sticky/narrow-phone captures reviewed. Checkpoint only; do not publish.

## Weight-Loss Intake Compact Trust Section — completed 2026-10-20
- [x] Replace only the large #doctor presentation with the approved “A real doctor. Not a chatbot.” heading and concise licensed-doctor guidance/follow-up message. Keep the original physician-name-and-credentials disclosure verbatim as a small supporting note, reuse the neutral doctor SVG, and use the approved navy/teal/ivory/lavender palette in a compact responsive panel. Remove the repeated branding/review tiles and overlapping clinical-oversight/follow-up explanations from this section.
- [x] Preserve section position/order, hero, mobile CTA polish, straight Featured In edge, medication grid/estimator/app, original archived reviews, metadata, all five intake destinations, other pages and all payment/intake/tracking behavior. Exact in-memory reversal of this section and new scoped CSS restores the full document byte-for-byte to a59f18ef; the temporary independent patch-context issue was resolved without source changes.
- [x] Validate 26 focused tests, TypeScript/build and full suite (445 pass / 1 documented pre-existing imported-prototype LegitScript compliance failure). Responsive no-submission QA at 1440/768/375/320px confirms exact copy/disclosure, retained order/cards/destinations, no overflow/errors and substantially reduced section height: 258px vs 703px desktop and 398px vs 1377px at 375px. Desktop/mobile captures reviewed. Checkpoint only; do not publish.

## Weight-Loss Intake Five Mobile Audit Polish Fixes — completed 2026-10-21
- [x] Apply all five explicitly approved fixes on `/weight-loss-intake`: 13px readable mobile notes/specs/captions/disclosures with adequate app-caption and exercise-label space; slightly darker CTA-only teal #007E88 (white contrast 4.839:1) and navy hover without brightening filters; 14px estimator visit label with a 44px minimum tap height; include #expect in the fixed-header scroll offset; remove eight noncritical logo preloads and add lazy/async hints plus measured image dimensions to the 28 existing static images. Preserve the original seal's 73×79 display attributes (same intrinsic 292×316 ratio) and correct self-closing attribute placement.
- [x] Opt only this landing catalog mount into seven lazy/async medication images through an explicit data attribute; preserve its existing fixed image frames. Keep generator and generated script synchronized. Independent VM comparison proves the shared renderer's default markup and catalog JSON byte-identical to the baseline; other pages/intake do not opt in. No shared catalog names/prices, routes, intake/$49 checkout, payments, webhooks, tracking, section order, copy, image paths/alts, metadata or interaction scripts changed. Exact reversal of the HTML loading/dimension changes restores the baseline document apart from the approved preload removals. Mobile typography/tap sizing does not restyle desktop.
- [x] Validate 32 focused tests, TypeScript, production build, clean diff and independent scope review. Development and production browser QA at 320×720, 375×812, 390×844, 430×932, 812×375 landscape, 768×1024 and 1440×1000 confirms accessible default/hover CTA contrast, readable secondary copy, estimator target height, header-safe What to expect label, seven lazy medication images, all five app panels loaded with contained captions and exercise labels, five unchanged intake destinations, keyboard estimator/FAQ behavior, no overflow or JS errors. Automated mobile accessibility scan reports no violations for the selected WCAG rule tags. Mobile visuals reviewed; six production routes returned HTTP 200. No form/payment submissions; temporary production server stopped automatically. Full suite: 451 passed / 1 documented pre-existing imported-prototype LegitScript compliance assertion. These are browser-emulated checks, not physical-device certification.

Save the completed update as a checkpoint only. Do not publish; the separate paid intake remains deliberately unchanged.

## Intake Mobile Number Formatting — completed 2026-10-21
- [x] On `/intake/` only, format the existing Mobile number as it is entered or pasted: `(555) 555-5555`. Strip punctuation and letters, accept a pasted U.S. `+1`/leading `1`, and cap the display at ten digits. Retain the exact placeholder, telephone keyboard hint, existing validation, normalized phone-verification reset/acceptance checks, screen layout, intake submission, payment, tracking, and all other routes.
- [x] Added source-level coverage for progressive entry, common pasted U.S. formats, and one-field-only scope. Typed and pasted values were verified without a submission at 375px and 1440px in both the preview and fresh production build. Focused tests, TypeScript, and production build pass. Full suite: 454 passed / 1 documented pre-existing imported-prototype LegitScript compliance assertion. Checkpoint only; do not publish.

## Weight-Loss Intake Updated Hero Brand Guideline — completed 2026-10-21
- [x] Updated `/weight-loss-intake` hero only to the approved guideline: DM Serif Display for the main headline; DM Sans for hero body copy, CTA, and supporting text; Deep Teal `#003B3E`, Brand Teal `#008F83`, Navy `#06263B`, Warm Ivory `#F7F3EB`, Soft Mint `#E8F3EC`, and Sage `#91B7AB` across the hero, phone illustration, chat UI, status accents, and badge.
- [x] Preserved all hero wording, centered layout, phone animation, existing CTA label and `/intake/` destination, other landing sections, the standalone intake form, and all unrelated routes. Reviewed mobile/tablet/desktop visual fit at 375px, 768px, and 1440px: no horizontal overflow or browser errors.
- [x] Validated focused tests, TypeScript, production build, preview and fresh production browser checks, and production HTTP 200 routes for `/weight-loss-intake`, `/intake/`, `/weight-loss-menopause`, and `/`. Full suite: 454 passed / 1 documented pre-existing imported-prototype LegitScript compliance assertion. Checkpoint only; not published.

## Weight-Loss Intake Hero Headline Refinement — completed 2026-10-21
- [x] Updated only the `/weight-loss-intake` three-line hero headline to: “Text a / weight-loss doctor / now — for free.” The visual hierarchy, typography, colors, CTA label and `/intake/` destination are unchanged.
- [x] Added semantic spacing between display spans so assistive technology reads the headline as one natural sentence without affecting the visual treatment. The intake form and all other page copy/routes are unchanged.
- [x] Validated exact wording, three-line treatment, CTA destination, no overflow, and no browser errors at 375px, 768px, and 1440px in preview and production. Focused tests, TypeScript, production build, and direct production route checks passed. Checkpoint only; not published.

## Weight-Loss Intake White Phone Screen — completed 2026-10-21
- [x] Changed only the hero phone’s inner screen and chat header backgrounds to the existing white token (`#FFFFFF`). Kept the ivory hero, deep-teal frame/notch, mint doctor messages, teal patient messages, shadow, layout, wording, CTA destinations, animation, intake form and other routes unchanged. Exact inverse comparison confirms the runtime document differs by only those two CSS lines.
- [x] Verified computed colors, preserved animation, CTA destination, no horizontal overflow and no browser errors at 375px, 768px and 1440px; reviewed mobile and desktop screenshots. Focused tests: 27 passed; TypeScript and production build passed. Full suite: 455 passed / 1 documented pre-existing LegitScript compliance failure. Checkpoint only; not published.

## Weight-Loss Intake Flyer-Inspired Hero — completed 2026-10-21
- [x] Applied the approved hero-only hierarchy: large DM Serif Display “Text a weight-loss doctor now. For FREE!” headline with sage underline; two numbered steps (“Complete your medical intake form.” and “Instantly receive a text and connect with your doctor.”); prominent full-width existing intake CTA beneath the steps. Kept the 5–10 min helper and existing doctor-response timing/medication-cost note. Phone stays on the right on desktop and beneath the copy on phone/tablet.
- [x] Existing white-screen animated phone subtree, scripts, metadata, all other sections, intake form, payments, shared catalog and other routes are byte-identical to baseline. New CSS is hero-scoped. Verified actual ordering, fonts, underline, text fit, CTA href, animation, estimator/app/FAQ interactions and no overflow/JS errors at 320/375/430/768/1024/1440px; reviewed mobile/desktop captures. Focused tests: 33 passed; TypeScript/build passed; full suite 455 passed / 1 documented pre-existing compliance failure. Fresh production checked five HTTP 200 routes and 375/1440px hero rendering. Checkpoint only; not published.

## Weight-Loss Intake Mobile Hero Formatting — completed 2026-10-21
- [x] On `/weight-loss-intake` only, refined the approved flyer-inspired hero at mobile widths: a centered three-line headline at 361–620px (with the existing four-line narrow-phone fallback), first-line-aligned numbered-step circles, and a centered CTA label with its arrow in normal flow.
- [x] Kept the exact hero wording, sage underline, DM Serif Display/DM Sans system, CTA destination (`/intake/`), white animated phone, chat content/animation, desktop presentation, and all non-hero sections unchanged.
- [x] Made the mobile phone more compact and legible only: 600px white screen, 486px chat area, modestly larger chat type, and a correctly placed HIPAA badge; verified the full existing animated conversation remains visible.
- [x] Validated browser behavior at 320, 375, 390, 430, 768, and 1440px with no horizontal overflow or page errors, retained estimator/app interactions, focused regression coverage (34 tests), TypeScript, and production build. Full test suite remains 456 passing / 1 pre-existing imported-client compliance scan failure. Checkpoint only; not published.

## Weight-Loss Intake Three-Line Hero Headline — completed 2026-10-21
- [x] On `/weight-loss-intake` only, regrouped the existing headline into the reference’s intentional three-line hierarchy: “Text a weight-loss” / “doctor now.” / “For FREE!” The exact approved wording, colors, sage underline, steps, CTA, phone animation, and every non-hero section remain unchanged.
- [x] Applied a 37px narrow-phone treatment at 320px and retained the standard 42px mobile treatment above that width, so all tested devices preserve the three-line grouping without horizontal overflow. Verified the headline, CTA destination, and estimator at 320, 375, 430, 768, and 1440px with no page errors.
- [x] Focused tests: 34 passed; TypeScript and production build passed. Checkpoint only; not published.

## Weight-Loss Intake Step 1 Mobile Text Alignment — completed 2026-10-21
- [x] Center only Step 1’s text vertically beside the numbered circle at widths up to 620px. Preserve the circle position, row height/gap, Step 2, three-line headline, CTA, animated phone, desktop styling, all wording, intake and other routes. Only one mobile-scoped CSS rule and its matching regression assertion were added.
- [x] Browser baseline comparison at 320/375/390/430/620/768/1440px confirms text/circle centers within 0.44px and unchanged circle/row/Step 2/headline/button/phone geometry, with no overflow or JS errors. Mobile and desktop captures reviewed. Independent inverse comparison restores the landing document byte-for-byte to checkpoint 6ad493dc; 34 focused tests, TypeScript and production build passed. Checkpoint only; do not publish.

## Weight-Loss Intake Original Intake Links — completed 2026-10-21
- [x] Complete the explicitly approved earlier link-only change: all five `/weight-loss-intake` intake CTAs use `https://intake.medmethoddirect.com/`, without query parameters or prefill. `/weight-loss-menopause` remains unchanged and uses the same destination. The separate `?start=weight_care` entry request still requires the original project's editable source.
- [x] Preserve local `/intake/` files/APIs, other pages, content, CSS, scripts, images, prices, tracking, storage and admin behavior. Inverse href comparison reproduces the prior landing document byte-for-byte. Validate 44 focused tests and 375/768/1440px no-submission browser checks, including intercepted CTA navigation, seven medication cards, unchanged inline CSS and no local-intake links/overflow/errors. Checkpoint only; do not publish. Save separately before the next branding change.

## Weight-Loss Intake Latest Brand Guideline Rollout — completed 2026-10-21
- [x] Apply the approved latest guide to the remaining `/weight-loss-intake` landing sections only: DM Serif Display headings, DM Sans body/navigation/buttons, deep teal #003B3E, brand teal #008F83, navy #06263B, warm ivory #F7F3EB, mint #E8F3EC and sage #91B7AB. Update section surfaces, accents, cards, app tabs, footer and dark-teal CTA surfaces; retain accessible white-on-dark-teal text. Browser theme color matches warm ivory.
- [x] Preserve the approved hero CSS and computed headline/phone/CTA geometry, fonts and colors at all tested sizes. All markup, wording, medication prices/images, five original-intake hrefs, scripts, section order and sharing metadata remain byte-identical (except the browser theme color). Local intake/thank-you, menopause page, shared catalog, payment/webhook, tracking, admin and other routes remain untouched. Earlier original-intake links were checkpointed separately as 16607d28.
- [x] Validate 48 focused tests, TypeScript/build, independent scope review, six production HTTP 200 routes and development/production browser QA at 320/375/768/1440px: correct loaded fonts/palette, seven original medication images/cards, five links, estimator/app/FAQ/mobile-menu interactions, unchanged hero baseline, no overflow/errors/submissions. Mobile/desktop section screenshots reviewed. Full suite: 460 passed / 1 documented pre-existing imported-content LegitScript assertion; no new regressions. Checkpoint only; do not publish.

## Local Intake Spruce Verification and Paid Keragon Handoff — completed 2026-10-21
- [x] Restore all five `/weight-loss-intake` CTAs to local `/intake/`, with no other landing content/design/price changes. `/weight-loss-menopause`, its external intake destination, shared catalog, tracking, admin, database schema and thank-you pages remain unchanged.
- [x] Add Spruce request/resend/confirm/settings and existing-style required verification controls: hashed six-digit codes, 10-minute expiry, five wrong attempts, 60-second cooldown, IP limits, bounded temporary RAM state and phone-bound 30-minute opaque tokens. Production verified live/required; Development sandbox; credentials server-only. Add exact optional unchecked SMS consent, stable submission UUID/timestamp, and fix static-bundle identifier collisions/demo continuation validation.
- [x] Finalize `mmd_intake.paid_submitted` / schema `1.1` only after matching verified $49.00 USD PayPal capture, with server-owned phone attestation, exact consents, checkout_preview and verified payment fields. Name-only treatment_interest; display/summary prices retained. Preserve secret-first Keragon URL, encrypted existing fallback and JSON headers; deduplicate concurrent/retried completion in process and remove clinical/contact payload from RAM after delivery. No intake database/disk storage added. Keep family coupon a distinct $0 waived/no-capture event, with sandbox-only demo waiver bypass.
- [x] One authorized synthetic `is_test:true` Keragon POST accepted HTTP 204: submission `8207bf33-ab1c-4e61-a76f-3c722893169c`, sends 1, mocked PayPal/no order or charge, sandbox verifier/no SMS. Exact JSON and receipt stored outside repository; external integration tests are opt-in/skipped ordinarily. Do not resend the one-time test.
- [x] Validation: 77 focused tests pass; TypeScript/build pass; full suite 486 pass / 2 skip / 1 documented pre-existing LegitScript imported-content compliance failure. Five production routes HTTP 200; public verification settings live/required/no demo. Intercepted 375/768/1440px browser QA passes verification/wrong-code/reset, optional SMS wording, layout, stable-ID synthetic questionnaire/waiver and unchanged thank-you redirect with no external delivery. Independent scope proof: landing changes only five hrefs; protected pages/shared config untouched. Checkpoint only; not published. Downstream Keragon/Cerbo invitation email and welcome-SMS delivery remain unverified.

## Weight-Loss Intake Hero Step Hierarchy — completed 2026-10-21
- [x] Soften only the hero's Step 1 and Step 2 on `/weight-loss-intake`: desktop badges 48px to 36px; responsive badges 42px to 30px; soft-mint fill and dark-teal digits; smaller regular-weight step text with a 16px mobile minimum; tighter row/text gaps. Preserve existing Step 1 alignment, all wording, headline, CTA, phone and animation, five local intake links, metadata, prices, other sections/pages and intake/payment/webhook behavior.
- [x] Exactly six CSS-line replacements; independent scope review confirms all markup, non-step CSS and scripts are byte-identical to prior checkpoint 2ca5307b. Added four targeted regression tests. Passed 42 focused tests, TypeScript/build, built static-route check and intercepted baseline-versus-update QA at 320/375/430/768/1440px: badge sizes/colors, readable lighter copy, compact step block, unchanged headline/CTA/phone/How-it-works computed styles, no overflow/errors or submissions. Mobile/desktop visuals reviewed. Checkpoint only; not published.

## Masterclass Video Hook and Pulsing Arrow — completed 2026-10-22
- [x] On `/masterclass` only, use the approved headline “Why does weight loss feel so hard?”, exact viewer-benefit paragraph about weight loss/GLP-1s/hormones and informed long-term-health choices, and “Press play to understand your options.” Add a large in-flow magenta-to-purple downward arrow immediately above the video (80×88px mobile; 100×110px larger screens), with a slow 2.2-second opacity/translation pulse; disable animation for reduced motion. The decorative arrow is aria-hidden and pointer-disabled and never covers the player.
- [x] Preserve the exact existing YouTube ID/iframe attributes and fullscreen behavior, credentials, checklist, presenter image, booking/pricing/payment/modal, Meta pixel and all other routes including both weight-loss landings. Updated only the masterclass component, its scoped test and tracker. Passed 33 focused video/layout/payment/tracking tests, TypeScript/build, independent scope review and intercepted 320/375/768/1440px browser QA: exact wording, arrow centering/size/non-overlap, normal/reduced-motion behavior, retained watch-scroll action and player, no overflow or page errors. Phone/desktop visuals reviewed. No payments, submissions or publication; checkpoint for Preview only.

## Masterclass Simplified Weight/Hormone Hook — completed 2026-10-22
- [x] On `/masterclass` only, apply the approved single H1: “Weight won’t budge? Hormones feel off? What’s really going on?” Keep the exact existing physician/board-certification/50,000+ credibility line directly below it; remove the long introductory paragraph; replace the previous play prompt with “Watch Now—Get Answers.” Fit the three questions as three intentional lines and tighten only introduction spacing. Keep the existing pulsing arrow/SVG/animation and video iframe byte-identical. All other content, prices, booking, payments, Meta tracking and other pages remain unchanged.
- [x] Validation: 33 focused masterclass video/layout/payment/tracking tests, TypeScript/build and whitespace checks pass. Independent diff review confirms page-only scope. Intercepted 320/375/768/1440px browser QA verifies exact headline/credits/CTA, one H1, removal of the paragraph, three readable lines, unchanged arrow/player dimensions and watch-scroll action, normal/reduced-motion behavior, no overlap/overflow/page errors, and visible existing Play controls on phone/desktop. The video begins 150/128/117/81px higher respectively. Final phone/desktop visuals reviewed. No payments, submissions or publication; checkpoint only.

## Masterclass Top Specialty Credential — completed 2026-10-22
- [x] Update only the top `/masterclass` credential block to the two approved groups: “From Dr. Jumana Al-Deek, DO · Board-certified physician” and “Menopause, Hormone, Metabolism & Medical Weight-Loss Specialist · 50,000+ patients seen.” Keep the patient count emphasized. Fit only this block to 810px max width and 16px desktop type; preserve its mobile size and safe wrapping. Headline, watch CTA, arrow/CSS, iframe/video, metadata, all other content, booking/pricing/payments/tracking and other routes remain unchanged.
- [x] Validation: 34 focused masterclass tests, TypeScript/build and whitespace checks pass. Independent inverse replacement proves the entire component is otherwise byte-identical to 1780e7af. Intercepted 320/375/768/1440px browser QA confirms exact two-group title/credentials/count, readable type, safe mobile wrapping and two physical desktop lines, unchanged headline/CTA/arrow/video, reduced-motion behavior, visible existing video Play controls, no overlaps/overflow/page errors. Mobile/desktop visuals reviewed. No payments/submissions/publication; checkpoint only.

## Weight-Loss Intake GLP-1 Hero Headline — completed 2026-10-22
- [x] On `/weight-loss-intake` only, update the single hero H1 to the exact approved wording: “Text a weight-loss Doctor now to see if GLP-1s are right for you. For FREE!” Preserve the existing DM Serif Display font family, original main/middle/FREE sizes and colors, and sage FREE underline. Keep the additional qualifying phrase inside the same H1 with balanced responsive wrapping and keep GLP-1s unbroken. All other wording, styles, steps, phone animation, CTA destinations, prices, share metadata and pages remain unchanged.
- [x] Validation: 39 focused landing regressions across 4 suites, TypeScript/build and whitespace checks pass. Independent inverse removal of only the H1 update and two headline-specific CSS rules/comment restores the exact prior document byte-for-byte. Intercepted before/after browser QA at 320/375/430/768/1024/1440px confirms exact accessible headline, no clipping/overflow/errors, retained font/color/FREE styling and unchanged step/CTA/phone/screen/How-it-works/footer measurements and all five local `/intake/` links. Phone/desktop visuals reviewed. No payments, submissions or publication; checkpoint only.

## Weight-Loss Intake GLP-1s Teal Accent — completed 2026-10-22
- [x] On `/weight-loss-intake` only, color only “GLP-1s” in the hero qualification line with existing brand teal #008F83, including explicit text-fill for consistent rendering. The surrounding words remain navy and “For FREE!” keeps its existing styling. No text, font sizes/weights, spacing, backgrounds, geometry, steps, phone animation, CTAs, links, other pages or integrations changed.
- [x] Validation: 40 focused tests across 4 landing suites, TypeScript/build and whitespace checks pass. Inverse restoration of the single CSS rule reproduces the full prior landing document byte-for-byte. Intercepted before/after 320/375/768/1440px browser QA confirms teal text and text-fill only on GLP-1s, navy surrounding words, identical headline/layout/font/phone/step/button measurements and five local intake links, no overflow/errors/submissions. Final mobile/desktop visuals reviewed. Checkpoint only; not published.

## Free Ongoing Weight Care + Optional $39 Video Visit — 2026-10-22

- Implemented the owner-approved model on `/weight-loss-intake`, local `/intake/` and its existing confirmation flow: free initial assessment and ongoing asynchronous doctor follow-up; medication billed separately; no monthly care charge or 6-/12-month commitment. Preserved landing design, hero headline, five local intake CTAs and shared medication prices.
- Intake introduction is doctor-neutral, replaces the $49/month/refund offer with FREE text-based care, and includes unchecked optional Zoom-video interest at $39 per visit. Interest is not payment authorization. `Complete My Free Intake` delivers the completed verified/consented questionnaire before any optional purchase.
- Full clinical handoff: `mmd_intake.free_submitted`, schema 1.1, `payment.status=not_required`, amount `0.00`, server phone attestation, exact optional SMS metadata and name-only treatment interest. Temporary clinical/contact payload is removed after accepted relay. Purpose-bound signed expiring receipt stores only non-contact metadata. Signing preflight occurs before delivery. Dedupe/recovery is bounded to the process/TTL; no durable patient storage was added.
- Confirmation preserves portal screenshot/account instructions, uses SMS-consent-aware guidance, and offers separate optional $39 PayPal-hosted card/eligible black Apple Pay checkout using existing configured mode. Payment failure/cancellation never reverses free completion. Pending payment can retry the existing order confirmation without creating another order. Post-payment scheduling uses Care Team contact pending a real calendar link; no visit duration or calendar was invented.
- Verified capture sends only a minimal linked `mmd_intake.video_visit_paid` event, never the questionnaire again. Family coupon waives the video visit through separate `mmd_intake.video_visit_waived` with zero charge, not a capture claim. Amount, provider identity, order/capture and event retries are server validated.
- `/weight-loss-menopause`, `/masterclass`, homepage, shared catalog, phone-verification module, admin, tracking and DB schema remain unchanged. No real Keragon, PayPal or Spruce actions were performed for this change.
- Validation: responsive intercepted flows at 375/768/1440px, verification/SMS consent, stable retry, optional interest, free completion, safe receipt/refresh, hosted checkout, payment failure, waiver and anonymous confirmation passed. Eight production routes HTTP 200; live+required production verification/no demo bypass; production mobile flow passed. TypeScript/build and whitespace/scope checks passed. Full suite: 509 passed, 2 opt-in integrations skipped, 1 documented pre-existing LegitScript imported-content compliance failure.
- Before publication, the external Keragon workflow must route free submissions to onboarding independently of payment and handle minimal linked video paid/waived events separately to avoid duplicate patient/onboarding actions. External Keragon workflow was not modified; a real calendar link can be added later.
- Checkpoint only; not published.

## Local Intake Introductory Text-Care Phone Icon — 2026-10-22

- Replaced only the plus in the introductory FREE text-care card on `/intake/` with an inline miniature phone inspired by the owner reference: dark frame, white screen, teal/lavender conversation bubbles, no unreadable tiny chat text. Kept existing 80px pale circle, positioning, all text, prices, layout, optional-interest state and functionality unchanged. Later plan-card plus remains unchanged. No external asset, new dependency, network action or other route change.
- Exact inverse restores the complete intake HTML to checkpoint d229e177. Responsive intercepted baseline parity at 375/768/1440px: all non-icon DOM, circle/card dimensions, controls and placement identical; no overflow or JS errors. Mobile visual reviewed. 14 focused tests passed; TypeScript and production build passed; independent scope review and whitespace check passed.
- Checkpoint only; not published.

## Consolidated Intake Finish + Connection-First Confirmation — 2026-10-23
- Implemented the exact owner-approved scope only in local `/intake/` and its existing confirmation page. Removed mandatory answer-summary, plan-review and separate checkout screens from visible navigation; the existing clinical consent screen now also includes the explicit final accuracy/submission acknowledgement and `Submit My Free Intake`. Retained original clinical schema definitions for payload behavior; full medical questions, consent disclosures/decisions/timestamps, phone verification, SMS election and all server code remain unchanged.
- Required final consent, acknowledgement, contact validity and phone verification guard submission. Recovery from expired verification returns directly to the consolidated finish, preserving all answers, consents, acknowledgement and submission identity. Original risk sections and consent choices remain available without deleting medical information.
- Confirmation is concise and prioritizes `What happens next`, unchanged email/account and required-form instructions, exact existing portal screenshot and care-team help. Opted-in first instruction is `Check your text messages` / `Look for a text from MedMethod Direct. Open it and reply to start chatting with our Care Team or a doctor.` Existing receipt-driven opted-out portal guidance remains unchanged. No sent/delivered claim. Optional $39 video offer, recovery, coupon/checkout and completion blocks remain functional below guidance/screenshot; Start over is a quiet accessible text link.
- Verified byte-identical full clinical schema, consent component/information, payload and both summary builders versus b16f31e3; intercepted baseline-versus-new full submitted JSON matched exactly at 375/768/1440px. Every pre-consent questionnaire screen remains unchanged; three extra finishing screens removed. Stable retry, decline/ack guards, opted-in/opted-out copy, portal placement, hosted optional-video success/failure/waiver and refresh recovery passed with no external actions. Expired live-required phone re-verification recovery passed with exact clinical payload preservation. Desktop/mobile final layouts visually reviewed.
- 87 focused tests across 11 files passed; TypeScript/build passed. Full suite: 514 passing, 2 opt-in integrations skipped, one documented pre-existing LegitScript imported-content compliance failure. Six production routes HTTP 200; production verification live+required/no demo bypass; production mobile mocked flow passed. Independent scope review and git whitespace checks passed. Backend/Keragon, payment client, landing pages, medication prices, tracking/admin/database and other routes unchanged. No real SMS, patient handoff or charge performed. Temporary production server stopped.
- Checkpoint only; not published.

## Short Intake Introduction — 2026-10-23
- Applied the exact approved introduction-only copy: `Start your free intake`; `Connect with a doctor specializing in medical weight loss.`; FREE text-based doctor care with `Assessment and ongoing follow-up included. No monthly fee or commitment. Medication costs extra.`; `Prefer a video visit?` / `Optional Zoom visit — $39 per visit.` / `Interest only. No charge now.` Preserved the reference-style phone SVG, existing unchecked controlled interest checkbox and `Continue with intake` button. Removed the opening timeline, long treatment paragraph, repeated doctor/text/video explanations and duplicate Weight Care eyebrow. No style, medical-schema or downstream-flow changes.
- Exact inverse replacements restore client/intake/index.html byte-for-byte to checkpoint553c16bc. Medical questions, consent information/records, verification, submission/payload builders, pricing and all other pages (including confirmation), backend, Keragon/payment behavior unchanged. Relevant test wording updated and two new intro regressions added.
- Validated 375/768/1440px light/dark browser rendering, phone preservation, unchecked/toggle interest behavior, no overflow/errors and unchanged entire post-intro questionnaire. Full intercepted submitted JSON matches baseline exactly at all widths; retry, confirmation, optional hosted video-payment/failure/waiver and refresh behaviors retained. Intro content height at375px reduced from1167.31px to466.86px; existing viewport wrapper/CTA layout preserved. Mobile/desktop final visuals reviewed. No real submission, SMS, charge or external integration call.
-55 focused tests across7files, TypeScript and build passed. Full suite516pass/2opt-in integrations skipped/one unchanged pre-existing LegitScript imported-content compliance failure. Independent scope review and git diff whitespace/inverse checks passed. Checkpoint only; not published.

## Skip Redundant Weight-Care Information Screen — 2026-10-23
- Applied the exact approved single-screen skip: `w03a` / `A doctor’s visit, without the waiting room` is excluded from the local intake's visible navigation. Only the screen-ID predicate was added to `MmdIntakeFlowScreens`; the underlying definition, all medical/treatment questions, intro, verification/consents, payload/summary builders, confirmation and optional39video behavior remain unchanged. No backend/Keragon, pricing or other-page changes.
- Exact inverse replacement restores the full document to489ff18c. Regression confirms onlyw03a is excluded and unrelated information/question screens remain.26 focused tests across5files, TypeScript/build and whitespace/scope checks passed. Full suite517pass/2opt-in skipped/one documented unchanged pre-existing LegitScript imported-content failure.
- Intercepted375/768/1440px browser QA confirms the screen is skipped forward and Back, every other screen keeps its exact order, the opening card is unchanged and full submitted JSON matches baseline exactly. Stable retry/consent/SMS, confirmation, hosted optional video success/failure/waiver and refresh remain intact. No real handoff, SMS or charge. Independent review passed. Checkpoint only; not published.

## Optional Video Checkout Card-Field Height — 2026-10-23
- On /intake/thank-you/ only, cap all four PayPal-hosted card-field containers (name/number/expiry/CVV) at56px. Fit mounted SDK component roots and descendant frames to the inner container height so nested provider wrappers cannot expand the fields. Existing widths,padding,borders/colors,responsive columns,ApplePay50px styling,wording,39price,coupon and every JS/payment/submission behavior unchanged. Exact inverse three-rule replacement restores confirmation HTML byte-for-byte toce44291a; video-visit.js byte-identical. Related sizing regression added.
- Mocked Chromium QA reproduces baseline oversized nested fields then verifies all four56px containers at320/375/768/1440 in light/dark, with direct/nested/shadow-root component fixtures, inner-frame/input fit,keyboard focus,no concealed oversized mock content,no page overflow/errors and no order creation/submission/SMS/handoff. These are mocked hosted-fields layout checks, not a real payment or real provider validation/3DS test. Final mobile/desktop captures reviewed.
-64 focused tests across5files, TypeScript and production build passed. Full suite518passed/2opt-in skipped/one unchanged documented pre-existing LegitScript imported-content failure. Independent CSS-only scope and whitespace checks passed. Checkpoint only; do not publish.

## New Zoom Video Visit Thank-You Page — 2026-10-23
- Duplicate the local /thank-you2 template into isolated /thank-you-video (and trailing-slash alias), preserving its header/help, virtual badge, calendar card, three follow-up steps/account action, support phone CTA and footer. New offer is Zoom video visit — $39; remove every legacy hold price/duration from only the new copy. /thank-you2 and its shared follow-up component remain byte-identical; original /intake/thank-you/ HTML and checkout JS remain unchanged.
- Copy actual /intake/ palette and Montserrat typography, including the final active teal/white button gradients, 16px regular button text, pill radius, desktop 15px 28px and mobile 14px 20px padding. All new styles root-scoped. New hosted card-field wrappers stay at 56px.
- After successful free-intake acceptance, server returns redirect_url derived from the accepted/stored video_visit_interest: true -> /thank-you-video; false -> /intake/thank-you/. Client accepts only these exact relative destinations and stores the same six-field non-clinical receipt without redirect or patient details. No patient data/query-mode decision in page URLs. Existing clinical/consent/Spruce/Keragon contracts and medication pricing unchanged; inverse byte-equality proves only completion helpers and navigation changed inside intake.
- New standalone checkout adapter reuses existing receipt-gated, server-verified $39.00 USD PayPal card/eligible Apple Pay flow and separate family video waiver. Calendar stays locked until server-confirmed paid/waived status, never URL/local flags. Anonymous preview can inspect layout but cannot pay/book; refresh recovers without another intake or charge. Existing calendar URL reused without patient parameters. No real payments, external handoff, SMS or calendar bookings were performed in validation.
- Passed 93 focused tests; 31 new-page/price regressions after final CSS adjustments; TypeScript and latest production build. Full suite: 537 passed, 2 opt-in integrations skipped, only the unchanged documented pre-existing LegitScript imported-content assertion fails. Explicit tests reject $49.00, $39.99 and non-USD captures. At 375/768/1440, both full synthetic choices route correctly, clinical payloads match, retry IDs remain stable, active computed fonts/background/button styles match intake, fields fit/no overflow or page errors, mocked failures do not unlock booking, and refresh/waiver/query-forgery guards pass. Six production route/asset HTTP 200 checks and both-choice 375px production smoke passed; temporary server stopped. Checkpoint only; not published.

## Correct Video Page to Booking-Only Confirmation — 2026-10-23
- On /thank-you-video only, replace the upsell/payment surface with an exact source-based duplicate of local ThankYou2/WL2BookingFollowup layout: check icon/You're Booked!, exact requested $39 payment-confirmation subtitle, virtual badge, Zoom booking title and existing subtitle, immediate calendar, same three follow-up cards/account action/support/footer. Original JSX geometry/section order copied; only requested new copy and intake-derived styling differ. No new tracking. Delete the now-unreferenced new-page checkout adapter, all upsell/card/coupon/Apple Pay controls and calendar locks.
- Copy original calendar URL, iframe structure, sizing and loading settings exactly (accessible title renamed to Zoom). No added embed script; original has none beyond the unchanged site runtime. Select Oct28 on both actual embedded calendars read-only: both show the same 9 available UTC times including12:30PM/12:45PM/1:15PM. No slot selected or booking submitted. Side-by-side actual-page screenshot exported outside project, original left/corrected right.
- Preserve /intake/ document, current intake thank-you HTML/script, ThankYou2/shared original component, App/router, all server modules/payment/contract, catalog and every other page byte-identically. Server-selected destinations remain video interest -> /thank-you-video and free -> /intake/thank-you/, with no patient URL/query decision. Existing code is interest-based and returns NOT_REQUIRED before payment: this correction does NOT implement the user's assumed paid-before-redirect requirement because intake/server changes were explicitly forbidden. Clearly disclosed this remaining flow limitation to the user.
- Actual local intake styles are teal #0e7c7b/#075c5c, not magenta; copied actual colors/Montserrat/font/buttons, disclosed the conflict with requested non-teal styling. Computed button font16px400,gradient,color,pill radius andpadding match intake. Original visual logo/heading/link palette replaced only in new copy; all CSS root-scoped. Keep original five-percent virtual-badge tint readable.
-30 focused tests, TypeScript and latest build passed. Full suite536pass/2opt-in skipped/one unchanged documented pre-existing compliance failure. Six full mocked intake option flows at375/768/1440 pass forward/retry/refresh destinations, identical medical/consent payloads and zero new-page payment calls; current free thank-you unaffected. Real calendars render across widths; their initial nonblocking third-party storage warning is shared by both originals and is not application code. After selecting a visible date, both show identical live times. Checkpoint only; not published; no real payment, Keragon handoff, SMS or booking.

## Intake Thank-You Referral Field Copy — 2026-10-23
- On `/intake/thank-you/` only, label and placeholder now read exactly “Enter referral code”; removed the helper “A coupon can waive only the optional video visit. Your intake is already free.” Removed its unused aria-describedby reference to avoid a dangling accessibility link.
- Apply button, field identifiers, validation/waiver contracts, checkout JavaScript, CSS, $39 price/payment behavior, intake, other thank-you pages and all other pages unchanged. Independent inverse comparison confirms only the approved markup changes.
- Validated 64 focused regressions, TypeScript and production build; intercepted 375px dark/1440px light browser checks confirm exact copy, no helper, working Apply request and no overflow/errors. No real payment, waiver submission, webhook or SMS. Checkpoint only; no publication.

## Demo-Only Identity Verification Skip — 2026-10-23
- On local `/intake/` only, initialized `prefill=demo` sessions can continue beyond the identity/mobile step without sending or entering a code. Demo displays “Demo mode: mobile verification skipped on this step.” and hides that step’s verification controls; optional SMS and Terms remain unchanged.
- The helper requires a true demo flag and a single prefill parameter whose value is exactly demo; rejects missing/wrong/case-mismatched values and duplicate prefill parameters. Unrelated parameters do not activate demo. Retains contact validation, required phone digits and Terms acceptance. No verified-phone flag, token or expiry is fabricated.
- Normal identity verification, settings hooks, generic phone/token helpers, root and final-submission guards, payload builders and every server/payment/webhook file remain unchanged. This is only a step-continuation bypass: production live final submission still requires genuine verification as before; existing sandbox demo submission rules remain intact. Exact inverse comparison restores the entire intake document to its prior checkpoint.
- Validated 53 focused tests, TypeScript/build and intercepted development/production browser checks at 375/768/1440px: demo continuation/no verification code; normal required verification, wrong-code rejection, confirm and phone-change reset; unchanged final live guard, optional SMS, Terms and no overflow/errors. Five production routes HTTP 200. Full suite 550 passed / 2 opt-in tests skipped / 1 documented pre-existing LegitScript imported-content compliance failure; no new regressions. No real SMS, submission, Keragon, PayPal or charge. Temporary production server stopped.
- Checkpoint only; not published.

## All Intake Submissions → Existing Intake Thank-You — 2026-10-23
- Updated only the server-owned successful-submission destination helper: both free text-care and optional video-interest choices now return `/intake/thank-you/` (existing canonical route), never `/thank-you-video`. Ignores client/body/query redirect values; same-intake retries retain the same server result.
- Form and demo-step skip, clinical/consent payload, receipt fields/video-interest metadata, phone/security guards, Keragon relay, prices/PayPal/waiver behavior, and both thank-you pages remain unchanged. Production diff is only the helper comment and return; related test expectations and this tracker updated. Independent scope check passed.
- Validated 64 focused tests, TypeScript/build and six intercepted full-intake browser flows (free/video × 375/768/1440px): failed-delivery retry, canonical local destination without query/patient data, six-field receipt/refresh, identical clinical payload and no payment calls. Full suite 550 passed / 2 opt-in skipped / 1 documented pre-existing LegitScript imported-content compliance failure; no new regression. `git diff --check` passed. No real intake, Keragon, SMS, charge or booking.
- Checkpoint only; not published.

## Final-Step Demo Mobile Verification Skip — 2026-10-23
- Extended the owner-approved exact `?prefill=demo` skip from identity to the consolidated final screen/readiness/submit guard. Normal users still require a valid, unexpired, mode-matched phone token; required terms, medical consent and final accuracy acknowledgement remain intact.
- Explicit demo completion sends the existing clinical builder with `is_test:true` to `/api/intake/submit?prefill=demo`. Server bypass requires one exact scalar query value plus `demo_mode:true` and validated `draft.is_test:true`; duplicate/array/wrong query, forged flags alone and normal requests cannot bypass live verification. Server-owned demo attestation is `phone_verified:false` / `phone_verified_at:null`, not a fabricated verification. Existing advertised sandbox path remains compatible.
- Existing submission contract, patient/contact handling, signing, dedupe, normal PayPal/waiver gates, prices and `/intake/thank-you/` redirect remain unchanged; no thank-you/landing/other-page edits. Client diff reverses exactly to the prior document using four scoped replacements; related tests added/updated. Independent read-only security review passed.
- Passed 79 focused tests, TypeScript/build; full suite 567 passed / 2 opt-in skipped / 1 documented pre-existing LegitScript compliance assertion. Browser checks passed at375/768/1440px for full demo completion, required checkbox enforcement, stable mocked retry/test-only receipt/local thank-you, and normal final verification recovery with wrong-code rejection. Production smoke passed five route loads, normal live+required settings and mocked demo/normal final flows; temporary server stopped. All SMS, submissions, PayPal and Keragon actions intercepted; no real lead, SMS, charge or booking.
- Checkpoint only; not published.

## Optional Video Visit Booking Redirect — 2026-10-23
- On `/intake/thank-you/` only, successful optional-video completion now replaces the current page with `/thank-you-video` after the server confirms either an exact PayPal `COMPLETED` capture or an exact referral `WAIVED` outcome. The path contains no patient, receipt, or payment data.
- Free intake, pending/failed payment, malformed status, and invalid-referral states remain on the existing intake thank-you page; server payment validation, the intake form, the original thank-you pages, and the booking page were not changed.
- Validated 54 focused tests; full suite 568 passed / 2 skipped with the single documented pre-existing LegitScript compliance failure; TypeScript/build passed. Intercepted development and production browser QA at 375px and 1440px verified confirmed paid/waived redirects and non-redirect free/invalid paths without real payments, waivers, bookings, or deliveries.

## Demo Thank-You Redirect Retention — 2026-10-23
- On local `/intake/` only, an exact `?prefill=demo` test submission now receives the server-owned completion URL `/intake/thank-you/?prefill=demo`; normal submissions continue to receive the clean `/intake/thank-you/` URL.
- The intake client accepts the demo query only when it used the exact approved demo submission path. All other returned URLs and normal submissions remain limited to the existing safe destinations.
- Validated 45 focused server/client regressions, TypeScript, production build, and mocked complete browser flows at 375px and 1440px (demo query retained; normal verified flow remains clean; retry stable; no SMS, payment, waiver, webhook, or other external action). Full suite: 569 passed, 2 skipped, plus the single documented pre-existing `legitScriptCompliance` imported-content scan failure.
- Checkpoint only; not published.

## Demo Thank-You Sandbox Override — 2026-10-23
- On `/intake/thank-you/` only, the single exact URL query `?prefill=demo` now requests PayPal Sandbox credentials and the Sandbox SDK for the optional $39 video checkout, even if Admin Settings currently selects Live.
- The clean thank-you URL, malformed/duplicate demo parameters, and normal receipts continue to use the selected Admin Settings environment. Server order creation requires both the exact query and an eligible synthetic demo receipt before it can create a Sandbox order.
- Validated 56 focused payment/demo/client regressions, TypeScript, production build, intercepted browser checks in development and built production (Sandbox only for exact demo; Live only for normal), and no payment, order, referral, SMS, webhook, or external provider action was performed. Full suite: 570 passed, 2 skipped, plus the single documented pre-existing `legitScriptCompliance` imported-content scan failure.
- Checkpoint only; not published.

## Video Booking Redirect Cache Refresh — 2026-10-23
- The public `/intake/video-visit.js` asset was cached by browsers for up to four hours at its fixed URL, which could leave a completed $39 checkout on the legacy “Video visit paid — $39” fallback instead of using the current server-confirmed redirect.
- `/intake/thank-you/` now loads the same verified checkout script through a versioned, non-patient-data URL (`?v=video-booking-redirect-20261023`), forcing the current script to load immediately. A completed $39 payment or confirmed referral waiver then redirects to `/thank-you-video`; pending, failed, and invalid outcomes remain on the page.
- Validated 61 focused checkout/payment/static tests, TypeScript, build, and intercepted development plus built-production browser flows for both paid and waived confirmation redirects. No additional charge, payment attempt, referral application, webhook, SMS, or other provider request occurred. Full suite: 570 passed, 2 skipped, with the one documented pre-existing `legitScriptCompliance` imported-content scan failure.
- Checkpoint only; not published.

## PayPal Capture-Response Compatibility — 2026-10-23
- Preserved strict signed-order verification before capture: matching order ID, submission binding/custom ID, exact description, and exactly $39.00 USD remain required.
- PayPal capture responses may omit echoed purchase-unit metadata after that order check. The server now accepts that documented representation only when the completed order, exactly one capture ID, and exactly $39.00 USD remain verified; any supplied mismatch is rejected.
- Added regressions for accepted omitted purchase-unit echoes and rejected mismatched approved-order binding. Passed 44 focused payment/client tests, TypeScript, and build. Full suite: 572 passed, 2 skipped, with the one documented pre-existing `legitScriptCompliance` imported-content scan failure.
- No new payment, retry, refund, webhook, SMS, or provider call was made. Checkpoint only; not published.

## Weight-Loss Intake Hero Step Removal — 2026-10-23
- Removed only the redundant two-item hero step list and its numbered markers from `/weight-loss-intake`.
- Preserved the approved headline, CTA, five local `/intake/` links, free-care note, phone illustration, hero palette, and all other pages; tightened the former list gap so the CTA follows the headline cleanly.
- Passed focused hero/static regressions, TypeScript, production build, and no-submission browser QA at 375px, 768px, and 1440px. Full suite: 572 passed, 2 skipped, with the one documented unrelated `legitScriptCompliance` imported-content scan failure.
- Checkpoint only; not published.

## Weight-Loss Intake Hero Headline Order — 2026-10-23
- On `/weight-loss-intake` only, reordered the hero to: “Text a weight-loss” / “Doctor now For FREE!” / “to see if GLP-1s are right for you.”
- Kept the existing teal underlined `For FREE!` accent inline with the second line, retained the teal GLP-1s treatment, CTA, phone illustration, five local `/intake/` links, and all other routes.
- Applied only a compact 86% responsive treatment to the combined second line so it remains intact without overflow. Passed focused regressions, TypeScript, build, and no-submission browser QA at 375px, 768px, and 1440px. Full suite: 572 passed, 2 skipped, with the one documented unrelated `legitScriptCompliance` scan failure.
- Checkpoint only; not published.

## Compact How It Works — 2026-10-23
- On `/weight-loss-intake` only, simplified the existing How it works section to the three owner-approved titles: `Complete your intake (5-10min)`, `Text with your doctor`, and `Discuss your options with your doctor, based on your evaluation.` Removed the introductory paragraph, card explanations and bullets; retained numbered cards, existing brand palette/typography and horizontal/stacked connecting arrows.
- Added only `#how-it-works`-scoped compact CSS: 34px numbered circles beside readable 20px text, 16-/18px card padding, reduced heading/card/section spacing, three desktop columns and stacked mobile/tablet rows. Long evaluation-qualified Step 3 wraps naturally rather than shrinking or clipping.
- Exact inverse restores the full landing HTML byte-for-byte to the saved baseline outside the one section and its scoped CSS. Intake, both thank-you flows, menopause, masterclass, medication catalog/prices, payment/server contracts, tracking, shared styles, navigation and all five `/intake/` CTAs unchanged. Independent read-only scope review passed.
- Passed 50 focused landing regressions, TypeScript and production build. Full suite: 576 passed, 2 opt-in live integrations skipped, 1 documented pre-existing imported-client LegitScript compliance assertion failed; no new regressions. `git diff --check` passed.
- Real intercepted browser checks at 320/375/430/768/900/901/1024/1440px: exact concise copy, numbers beside text, arrows, preserved fonts/colors/hero/CTA destinations, no overflow/errors, functioning FAQ and header-safe navigation. Mobile section height reduced from 1057.3px to 413.5px at 375px; desktop from 552.0px to 246.2px at 1440px. Visual review completed.
- Built production smoke: six relevant routes HTTP 200 and 375/1440px responsive checks passed. Temporary server stopped. No real patient submission, charge, Spruce or Keragon request. Checkpoint only; not published.

## Weight-Loss Intake Medication Display Update — 2026-10-23
- Updated only the seven `/weight-loss-intake` medication cards with the owner-approved display prices and details: Compounded Semaglutide `$129/month — fixed price`, 2.5–12.5 mg vial, multidose vial injection; Compounded Tirzepatide `$149 to $299/month`, 10–60 mg vial, multidose vial injection; Compounded Liraglutide `$115`, 6mg/mL, 28-day supply, multidose vial injection; Wegovy® Pen — Direct from NovoCare® `$349/month — fixed price`, four single-dose prefilled pens, 0.25–2.4 mg per pen; Wegovy® Pill — Direct from NovoCare® `$149 to $299/month`, 1.5–25 mg; Zepbound® KwikPen — Direct from LillyDirect® `$299 to $449/month`, four prefilled pens, 2.5–15 mg per pen; Foundayo® Pill — Direct from LillyDirect® `$149 to $299/month`, 0.8–17.2 mg.
- Kept a single shared catalog source with an explicit `glp1.pageDisplays.weightLossIntake` presentation profile, activated only by the target landing mount's `data-catalog-display="weightLossIntake"`. All canonical GLP-1 options/names/prices/supply data, HRT entries, images/alt text and notes are unchanged. Default and lazy-only generated renderer markup remain byte-identical to the saved baseline; unknown display values fall back to the unchanged renderer.
- Added only three opted-in price/supply layout rules for natural readable wrapping. Existing fonts, colors, card order/images, hero, How it works, metadata, navigation and all five `/intake/` CTA links unchanged. `/intake/`, `/weight-loss-menopause`, all thank-you pages, masterclass, payments/phone verification/Keragon payloads, tracking and shared styles remain byte-identical. Exact inverse landing scope and canonical-catalog equality passed.
- Passed 53 focused tests, TypeScript and production build. Full suite: 580 passing, 2 opt-in integrations skipped, 1 documented pre-existing imported-client LegitScript compliance assertion failed; no new regressions. Added exact seven-item display tests and persistent SHA-256 default-render parity safeguards. `git diff --check` passed.
- Intercepted Chromium QA at 320/375/430/768/1024/1440px verified every name/price/detail, all seven loaded images, preserved styles/hero/CTAs, no text clipping, page overflow or runtime errors. Intake mounted with unchanged canonical medication/HRT data and no submission. Desktop and mobile screenshots reviewed, including explicit $115/6mg/mL/28-day Liraglutide verification. Built production six-route HTTP 200 checks and 375/1440px card/intake comparisons passed; temporary server stopped. No real patient handoff, SMS, payment or coupon action occurred.
- Checkpoint only; not published. This is intentionally a landing-page-only presentation update; intake and other pages keep their existing prices until separately approved.

## Intake Medication Pricing + Dose Note — 2026-10-23
- Updated only local `/intake/` medication presentation to reuse the seven already-approved `glp1.pageDisplays.weightLossIntake` entries. Matches landing names, prices, fixed-price labels, dose/strength ranges, forms and supplies, including Liraglutide $115 / 6mg/mL / 28-day supply. No duplicated price list was added.
- Added exactly “Price varies by dose.” beneath the ranges for Compounded Tirzepatide, Wegovy Pill, Zepbound KwikPen and Foundayo Pill only; no dose-price note on fixed-price Semaglutide/Wegovy Pen or Liraglutide. Choice and archived plan cards use the same display helper; text/HTML intake summaries include current price/details and applicable note.
- Server medication-name normalization uses the approved intake display name only, never a price in `answers.w.treatment_interest`. Delivery field names/event/schema, all other clinical answers, phone verification, optional SMS consent, submission/navigation/demo behavior, free care and optional $39 payment are unchanged.
- Complete intake CSS and medical questionnaire/consent definitions byte-identical. `/weight-loss-intake`, `/weight-loss-menopause`, all thank-you pages, PayPal code, shared canonical catalog and generated asset, HRT, global styles, admin, tracking and database files unchanged.
- Validated 113 existing focused tests plus 5 independent new medication regressions; TypeScript and production build passed. Full suite: 585 passed, 2 opt-in live tests skipped, 1 documented pre-existing LegitScript imported-content compliance failure. `git diff --check` passed. Intercepted Chromium 320/375/768/1440px checks passed: all seven prices/specs, exactly four notes, images/fonts/colors, no overflow/errors, identical non-presentation draft fields, required final acknowledgement and successful free demo submission/thank-you redirect. No real SMS, PayPal payment or Keragon handoff performed.
- Production smoke: eight protected/current routes HTTP 200 and built medication application code matches current source; temporary server stopped. Mobile range and Liraglutide screenshots reviewed. Checkpoint only; not published.

## Masterclass2 Independent Duplicate — 2026-10-23
- Added independent `/masterclass2` source copy, lazy route and its own canonical/social preview. Normalizing only component name and canonical gives the exact original source; `/masterclass` remains byte-identical. Preserved design, wording, images, YouTube recording, arrow, learning sections, prices and existing shared booking/payment features. No new navigation, tracking, payment, intake, calendar or database changes. Existing masterclass-only Meta Pixel scope remains unchanged.
- Extended the existing 17-state claim test only to the owner-approved exact duplicate and required source identity; all other routes remain excluded.
- Validated 39 focused tests, TypeScript/build, 320/375/768/1440px exact browser text/image/layout/font/color/video parity, pricing and watch controls, visible YouTube Play control, and mocked booking/card layout at five widths. No real lead, payment, order or webhook was sent. Production: six routes HTTP 200, own canonical/social metadata and crawler response passed; temporary server stopped. Full suite: 590 passed, 2 opt-in integration tests skipped, 1 documented pre-existing imported-content compliance assertion failing. `git diff --check` and original-source comparison passed.
- Saved as checkpoint only; no publication. Preview route: `/masterclass2`.

## Masterclass2 Full Physician Bio + Learning Section Removal — 2026-10-23
- On `/masterclass2` only, removed the entire What You’ll Learn/Because You Deserve to Know checklist and its unused data/icon. Tightened only its now-empty wrapper while retaining the exact Watch the Free Masterclass button.
- Replaced the prior brief presenter/family-photo block with an isolated local PhysicianProfile copied from the homepage: original portrait/storage path; exact credentials and specialty badges; complete Practice Focus and Philosophy; three expandable Clinical Background, Medical Training, Advanced Training & Approach panels; five training entries, pre-medicine background and original quote. Retained homepage Montserrat/Georgia typography, pink/purple colors and interaction; added local accessible accordion IDs/controls. Did not copy unrelated homepage hero/CTAs, coaches, or duplicate Featured In.
- Homepage/MedicalTeam and original masterclass are byte-identical; headline/video/arrow/Featured In/booking/pricing/modal/payment and other pages unchanged. Adapted stale duplicate regressions to exact inverse comparison excluding only the approved sections. State-availability guard remains restricted to masterclass and masterclass2, unchanged claim on both.
- Passed 41 focused tests, TypeScript and production build. Full suite: 596 passed, 2 opt-in integrations skipped, 1 documented pre-existing imported-content compliance assertion failing. Browser checks at 320/375/768/1440px: original protected-section HTML/computed-style parity (excluding editor-only data-loc markers), portrait loaded, all three accordion/keyboard toggles work without clipping, no overflow/errors, video play control and watch/pricing controls intact. Production six routes HTTP 200 and mobile profile flow passed; temporary server stopped. `git diff --check` and unchanged-file scope passed. No real payments, submissions or bookings.
- Checkpoint only; not published.

## Masterclass2 Portrait Removal Only — 2026-10-23
- Removed only the newly added doctor portrait, its image/aspect-ratio wrapper and unused PORTRAIT constant from the local PhysicianProfile. No replacement image or empty image-height spacer; family photo not restored. Existing text columns remain; mobile starts directly with the bio.
- Exact inverse source comparison proves all bio text, credentials, specialty badges, training/pre-medicine panels, quote, typography/colors and accordion logic are unchanged. Masterclass2 page, homepage/MedicalTeam, original masterclass and every other image/section/video/booking/payment are byte-identical. Updated only the two relevant portrait-related regressions and this tracker. Independent review passed.
- Passed 41 focused tests, TypeScript and production build. Full suite 596 passed, 2 opt-in integration tests skipped, 1 documented pre-existing imported-content compliance assertion failing. Browser 320/375/768/1440px checks: no profile image/aspect wrapper, unchanged protected-section DOM/styles, intact bio/three accordion and keyboard toggles, no clipping/overflow/runtime errors. Production six routes HTTP 200 and mobile flow passed; temporary server stopped. No submissions, bookings or payments.
- Checkpoint only; not published.

## Masterclass2 Featured In Below Video — 2026-10-23
- Moved only the existing FeaturedInStrip JSX instance from below the physician profile to immediately after the YouTube player section, before the watch CTA and bio. Component code, all eight logos, duplicate marquee items, asset paths, gradients, fonts, spacing and behavior unchanged; exactly one strip remains. No other sections changed.
- Inverse relocation produces Masterclass2.tsx byte-for-byte equal to c3e2eb43. Independent review confirms scope is page, two directly related source-order regressions and tracker only. Original masterclass, homepage, local PhysicianProfile, shared booking/payment/tracking and all other routes untouched.
- Passed 41 focused tests, TypeScript/build. Full suite 596 passed, 2 live integration tests skipped, 1 documented pre-existing imported-content compliance failure. Intercepted browser QA 320/375/768/1440px: player.nextElementSibling is banner, banner precedes watch CTA/bio, zero section-boundary gap, all logo images load, exact protected-section DOM/style parity, working bio/keyboard accordions/pricing/watch controls, no overflow/runtime errors. Six production routes HTTP 200 and mobile checks passed; temporary server stopped. No payments, bookings or submissions.
- Checkpoint only; not published.

## Masterclass2 Watch Pill Removal Only — 2026-10-23
- Removed only the Watch the Free Masterclass pill button below Featured In and its centered/padded wrapper on /masterclass2. The bio now follows the banner directly; no empty button spacer. Original masterclass retains its button. All video/arrow/cue/headline/banner/logos/bio/booking/pricing/payment markup and behavior unchanged. Unused scroll helper retained to avoid unrelated cleanup.
- Inverse source comparison proves the entire document unchanged apart from the approved wrapper deletion. Independent read-only review passed. Changed only page, two related source/order regressions and tracker.
- Passed 41 focused tests, TypeScript and build. Full suite: 596 passed, 2 integrations skipped, 1 documented pre-existing imported-content compliance failure. Intercepted responsive 320/375/768/1440px checks verify no pill/spacer, direct video→Featured In→bio adjacency, all logos loaded, preserved exact protected-section DOM/styles, accessible bio/pricing controls, loaded YouTube Play control, no overflow/runtime errors. Six production routes HTTP200 and mobile smoke passed; temporary server stopped. No payments, bookings or submissions.
- Checkpoint only; not published.

## Masterclass2 Visible Physician Bio Introduction — 2026-10-23
- Added the approved visible local heading “Meet Dr. Jumana Al-Deek, DO” and subtext “Her background, qualifications & approach to care.” directly above the full bio on /masterclass2. Reused existing Montserrat and pink/purple palette with compact responsive hierarchy; preserved aria-labelledby/heading ID.
- Replacing only the new header with the prior screen-reader heading restores the entire profile component byte-for-byte. Credentials, specialties, training, quote, narratives, accordion data/controls and portrait absence unchanged. Masterclass2 page/video/banner/booking, homepage, original masterclass, shared styles, pricing, payments and other routes untouched. Independent review passed.
- Passed 42 focused tests, TypeScript and build. Full suite: 597 passed, 2 opt-in integrations skipped, 1 documented pre-existing imported-content compliance failure. Intercepted 320/375/768/1440px browser checks: exact visible intro, accessible heading, fit/fonts/colors, working bio/pricing controls, preserved protected-section DOM/styles, no overflow/errors or submissions. Mobile/desktop screenshots reviewed. Six production routes HTTP200 and production mobile smoke passed; temporary server stopped.
- Checkpoint only; not published.

## Masterclass2 Work With Me + One-Time $39 Video Visit — 2026-10-23
- Replaced only `/masterclass2`'s old 45-minute/deposit CTA section and expandable pricing with the approved Work With Me introduction: “Thoughtful care. A plan built around you.” Two responsive cards offer the existing free 15-minute Care Team call and “Book Now — $39 per visit.” Added “About the cost of a copay—with a visit focused on you.” with explicit self-pay / insurance-copays-vary / medication-separate clarification. No visit duration or new-patient restriction was invented.
- Added isolated new checkout components and a dedicated tRPC router registered in the existing router. The new offer is one-time $39.00 USD only, using the existing protected active payment provider and sandbox/live settings. PayPal-hosted cards and eligibility-gated black Apple Pay are supported; Stripe uses its hosted Payment Element. No recurring billing, deposit, remaining balance, saved-payment mandate or shared product price was added or changed.
- Server owns product, amount, currency, signed checkout identity and mode. PayPal verifies exact requested order, approved state before capture, bound purchase unit and final independently retrieved order/capture identity/amount; capture retries use a stable provider request ID. Stripe verifies intent identity, succeeded status, received $39.00 USD and bound metadata. Wrong amount/identity/state is rejected without booking navigation. Existing payment ledger/schema is reused without migrations; no intake questionnaire or Keragon changes.
- Provider creation is idempotent, and server confirmation uses purpose-bound opaque signed tokens with stable production signing. Browser storage contains only opaque checkout/payment IDs, tokens and phase, not name/email/phone/card data. Storage failures are caught. Returning 3DS/approved payments auto-open the original-provider confirmation path; no active-provider switch, SDK reload or new purchase is used for recovery. Only server-confirmed success redirects to `/thank-you-video`; declined/unfinished/failed verification stays in checkout and retries the same payment.
- All original `/masterclass`, homepage/profile, biography on masterclass2, video/Featured In/banner/footer, shared consultation/payment components and routers, intake/thank-you flows, weight-loss pages, pricing catalog, database schema and tracking files remain unchanged. New UI and backend are page/product isolated.
- Validated 50 focused tests across seven suites; TypeScript and final build passed. Full suite: 620 passed, 2 opt-in live integration tests skipped, 1 unchanged documented imported-content LegitScript compliance scan failure. Browser QA passed at 320/375/768/1440px: approved copy/CTA order, removed old pricing, no overflow/runtime errors, compact modal, hosted-card mocked payment redirect and Escape. Additional mocked Apple Pay eligible/ineligible cases and PayPal/Stripe confirming/provider-approved recovery passed; failed confirmation never created another order/intent. Built production smoke: nine protected/current routes HTTP 200, mobile layout/payment redirect and all four same-provider recovery cases passed. No real charge, appointment, provider API call or Keragon handoff was performed.
- `git diff --check` and protected-file scope checks passed. Screenshot: `/home/ubuntu/masterclass2-work-with-me.png`. Checkpoint only; not published.

## Masterclass2 Mobile Sticky Booking Pill — 2026-10-23
- Added only on `/masterclass2`: mobile sticky rounded “Book Now — $39 per visit” button, fixed to the bottom while scrolling. Uses the page's existing magenta/purple palette and Montserrat, a 56px minimum target, visible focus ring, and safe-area-aware side/bottom offsets.
- Opens the existing $39 checkout; hides while checkout is open and returns on close. Keeps the button mounted and restores keyboard focus after the existing dialog's closing animation, without scrolling or modifying any shared checkout component. Only sticky-triggered checkout closes invoke this focus recovery.
- Reserves mobile-only bottom content clearance; hidden at >=768px, with no added desktop padding. All existing page wording, desktop layout, biography, video, banners, original `/masterclass`, prices, payment/receipt/provider code, intake and other pages are unchanged. Exact inverse comparison restores the whole page to pre-pill checkpoint `7b4cfd36`.
- Passed 48 focused tests, TypeScript and build. Full suite: 623 passed / 2 opt-in live integration tests skipped / 1 unchanged documented imported-content LegitScript compliance failure. Chromium 320/375/390/430/767/768/1024/1440px checks passed: fixed viewport position through scroll, contained target, footer clear, modal hide/restore, keyboard focus/Escape/close, no payment/submission calls or page errors, no pill on original masterclass. Mobile visual review completed. Built production six-route HTTP 200 smoke plus 375/768/1440px interaction checks passed; temporary server stopped.
- Scope review and `git diff --check` passed. Checkpoint only; not published.

## Masterclass2 Mobile Virtual-Visit Wording — 2026-10-23
- Changed only the mobile sticky button label from “Book Now — $39 per visit” to “Book a Virtual Visit — $39”. Preserved the existing “100% virtual care” statement, all other copy, $39 one-time pricing, design, safe-area positioning, modal/focus behavior and desktop visibility rules.
- Exact inverse comparison restores the entire page to `a549acfd`. Only the page's single text line, exact-label regression and this tracker changed; checkout, backend and other pages unchanged.
- Passed 48 focused tests, TypeScript/build, eight-width intercepted scroll/modal/focus/virtual-care-copy checks, mobile visual review, and production six-route HTTP 200 plus 375/768/1440px smoke checks. Full suite: 623 passing / 2 opt-in integrations skipped / 1 unchanged documented imported-content LegitScript compliance assertion failing. No real payment, booking or patient submission. `git diff --check` passed. Checkpoint only; not published.

## Masterclass2 Patient-Focused Main Headline — 2026-10-23
- On `/masterclass2` only, replaced the three-question main headline with “Thinking about becoming a patient?” and “Meet Dr. Jumana Al-Deek, DO.” Removed only the adjacent repeated credential paragraph. Kept original headline typography/colors/classes and natural responsive wrapping.
- Preserved “Watch Now—Get Answers.”, arrow/video/embed settings, Featured In, the entire full biography and its expandable sections, all booking CTAs and mobile pill, $39 checkout/payment behavior, metadata/tracking and every other page. Independent review proves exactly the two approved source transformations from `f16301b5` with all protected files byte-identical.
- Passed 49 focused regressions, TypeScript/build, six-width no-submission browser checks for exact copy/fit, biography controls and booking/modal behavior, loaded YouTube Play controls and mobile/desktop visual review, plus six production HTTP 200 routes and 375/768/1440px production checks. Browser-only control-label assumption was corrected to YouTube's actual “Play video” mobile label; website video code unchanged. Full suite: 624 passing, 2 live integration tests skipped, 1 unchanged documented imported-content LegitScript compliance assertion failing. No real payments, bookings or patient submissions. `git diff --check` passed. Checkpoint only; not published.

## Masterclass2 Homepage-Style Hero Header — 2026-10-24
- On `/masterclass2` only, replaced “Thinking about becoming a patient? Meet Dr. Jumana Al-Deek, DO.” with the four-line homepage-style headline: “Menopause,” / “Hormones” / “& Weight Loss.” / “Done Right for You.” Added “100% Virtual” directly underneath. No repeated credential block restored.
- Copied the homepage's exact Montserrat typography, 900-weight/1.05 line-height headline, -0.02em spacing, responsive clamp, and 135deg #E8339E-to-#7A1E7E clipped-text gradient from HomeHrt3/MedicalTeam. Copied its 800-weight #111111 virtual subheading, responsive clamp and -0.01em spacing. Preserved this page's centered layout, hero surfaces and spacing outside the replaced heading block.
- Preserved video/arrow/Watch Now cue, Featured In, full biography/accordions, $39 booking buttons/mobile pill, payment/storage/server behavior, routing/SEO/tracking and all other pages including homepage and original masterclass. Independent review confirms replacing only the new H1 and removing only the new virtual paragraph restores the exact prior page from d8dac759.
- Passed 49 existing focused regressions and 3 new exact-copy/style tests, TypeScript/build, six-width development and 375/768/1440px production browser tests, exact computed homepage font/gradient/subheading parity, four unwrapped lines, no clipping/overlap/overflow or first-party runtime errors, retained video Play controls and bio/booking behavior. Six production routes HTTP 200; mobile/desktop visual review completed. Full suite: 627 passing, 2 live integrations skipped, 1 unchanged documented imported-content LegitScript assertion failing. Tight homepage line-height's normal glyph metrics were accounted for in browser-only assertions; no extra website edits made. No real bookings, payments or patient submissions. `git diff --check` and protected-file scope checks passed.
- Checkpoint only; not published.

## Masterclass2 Original Family Photo Restoration — 2026-10-24
- On `/masterclass2` only, restored the original `/manus-storage/jumana-family-masterclass_238b56a3.webp` family photo directly below Featured In and above the existing doctor biography. Reused original alt text and dimensions; moderate centered 340px mobile / 390px desktop maximum width, natural height and object-contain preserve the full image. No caption or new portrait.
- Removing only the 13-line image block restores the page byte-for-byte to the prior saved checkpoint. Existing headline, YouTube/arrow, banner, full biography/accordions, Work With Me, mobile booking pill and checkout remain unchanged. Original `/masterclass`, homepage, intake, pricing, payment/backend and all other pages are untouched. Adapted only related photo/placement/asset tests.
- Validated 35 focused regressions, TypeScript and production build. Full suite: 630 passed, 2 opt-in integrations skipped, 1 documented pre-existing imported-content LegitScript compliance failure; no new regressions. Responsive actual image load and preserved full aspect ratio passed at 320/375/430/768/1024/1440px, with no overflow or page errors. Bio accordions, video controls and unchanged booking modal checked with external actions blocked. Mobile/desktop screenshots visually reviewed.
- Production smoke: six routes HTTP 200; restored photo and preserved controls passed at 375/768/1440px. Temporary server stopped by the finite runner. Independent scope review and git diff --check passed. No booking, payment or patient submission performed. Checkpoint only; not published.

## Masterclass2 Compact Stacked Booking Pills — 2026-10-24
- On `/masterclass2` only, replaced the large Work With Me offer cards, repetitive headings and paragraphs with two compact full-width stacked pills under a simple Work With Me heading. Preserved the existing 100% virtual care / 17-state availability line.
- Outlined first CTA: Book a Free 15-Minute Call; helper: Care Team · General information, not medical advice. Gradient second CTA: Book a Virtual Visit — $39; helper: About the cost of a copay—with care focused on you. Clear small disclosure: Self-pay—we don’t accept insurance. Copays vary by plan. Medication priced separately.
- Original free-call destination and paid-modal handler remain unchanged, as do sticky mobile booking, header, video, Featured In, original family photo, full bio/accordions, footer, all payment/server code, homepage, original masterclass, intake and other routes. Reversing only the booking-section replacement reconstructs the prior page byte-for-byte. Independent review passed.
- Validated 36 focused tests, TypeScript and production build; six-width intercepted browser layout and existing navigation/modal/sticky checks passed (320/375/430/768/1024/1440px), no overflow or first-party runtime errors. Six production routes HTTP 200; production 375/768/1440px checks passed. Full suite: 631 passed / 2 opt-in integration tests skipped / 1 documented pre-existing imported-content LegitScript compliance failure. No new regressions, real orders, charges, bookings or submissions. Mobile/desktop screenshots reviewed; git diff --check clean.
- Checkpoint only; not published.

## Masterclass2 Connection-Option Clarity — 2026-10-24
- On `/masterclass2` only, renamed the section to “Choose How to Connect”; retained the free-call pill and Care Team/general-information helper; changed only the section’s paid pill to “Book a Video Visit — $39” and its helper to “With Dr. Al-Deek · About the cost of a copay.”
- Grouped each helper closer to its button (6px), tightened stacked gaps (16px), and made the unchanged self-pay/insurance/medication disclosure darker using the existing #5a4452 color. Preserved equal pill dimensions, outlined/gradient styling, free-call destination, paid modal action and mobile sticky wording.
- Independent review proves the page is byte-identical outside the booking section. No checkout/backend, intake, homepage, original masterclass, biography, family photo, video, banner, footer or other route changes.
- Validated 37 focused tests, TypeScript/build, six responsive widths (320/375/430/768/1024/1440) and three production widths. Both booking actions passed intercepted browser checks; six production routes HTTP 200. Mobile/desktop screenshots reviewed. Full suite: 632 passed, 2 opt-in integration tests skipped, 1 documented pre-existing imported-content compliance failure; no new regressions. Clean git diff whitespace. No real payment, booking or submission.
- Checkpoint only; not published.

## Masterclass2 Supporting Text Readability — 2026-10-24
- On `/masterclass2` only, increased the four supporting paragraphs in Choose How to Connect (availability, free-call helper, video-visit helper, self-pay disclosure) to 15px, medium weight 500, 24px line height and existing darker charcoal #5a4452.
- All wording, heading, buttons, pill dimensions/styles, spacing, booking actions and sticky button remain unchanged; no other section, checkout, backend, intake or page changes. Independent exact inverse comparison restores the full source to the previous checkpoint by reversing only four paragraph class strings.
- Validated 38 focused tests, TypeScript/build, six responsive widths and three production widths: all four text styles computed correctly with no overflow; both booking actions and sticky behavior preserved. Six production routes HTTP 200; mobile/desktop screenshots reviewed. Full suite: 633 passed, 2 opt-in integrations skipped, 1 documented pre-existing imported-content compliance failure, no new regressions. Clean diff whitespace; no real booking, payment or submission.
- Checkpoint only; not published.

## Masterclass2 Book My Visit CTA — 2026-10-24
- On `/masterclass2` only, changed the main paid booking button and mobile sticky pill to `Book My Visit — $39`. Changed the main paid helper to `Meet with Dr. Al-Deek by video · About the cost of a copay.`
- Preserved free-call copy/action, insurance disclosure, all styles/typography/spacing, existing $39 checkout, mobile behavior, biography/video and all other pages. Independent reversal of exactly three literal text replacements restores the previous page byte-for-byte.
- Validated 32 focused tests, TypeScript/build, six responsive widths and three production widths with no overflow/errors and unchanged free-call navigation, paid-modal opening and sticky behavior. Six production routes HTTP 200; mobile/desktop visuals reviewed. Full suite 633 passing, 2 opt-in integrations skipped, 1 documented pre-existing imported-content compliance assertion failing; no new failures. No real booking, payment or submission.
- Checkpoint only; not published.

## Masterclass2 Disclosure-Line Removal — 2026-10-24
- Removed only the requested `Self-pay—we don’t accept insurance. Copays vary by plan. Medication priced separately.` paragraph from `/masterclass2`. Preserved the copay comparison, both booking pills, mobile sticky pill, all styling/handlers, $39 payment behavior and every other page.
- Independent byte-level inverse confirms reinserting the sole deleted paragraph restores the complete previous page. Related section tests now guard absence of this paragraph and the unchanged three remaining readable supporting paragraphs.
- Validated 32 focused tests, TypeScript/build, six responsive widths and three built-production widths with unchanged free-call/paid-modal actions; six production routes HTTP 200. Mobile screenshot reviewed; no overflow/errors or external submissions/payments. Full suite: 633 passing, 2 opt-in integrations skipped, 1 documented pre-existing imported-content compliance failure; no new regressions. Whitespace/protected-file checks passed.
- Checkpoint only; not published.

## Masterclass2 Only $39 Booking CTA — 2026-10-24
- On `/masterclass2` only, changed both the main paid booking button and mobile sticky pill to `Book My Video Visit — Only $39!`.
- Exactly two literal label replacements; independent inverse restores the entire previous page byte-for-byte. All supporting copy, copay comparison, styles, spacing, booking handlers, $39-per-visit charge, free-call action and other pages unchanged.
- Validated 32 focused tests, TypeScript/build, six responsive widths and three built-production widths with exact labels fully contained in both pills, unchanged free-call navigation/modal opening and sticky behavior; six production routes HTTP 200. Mobile visual reviewed. Full suite: 633 passing, 2 opt-in integrations skipped, 1 documented pre-existing imported-content compliance failure; no new failures. Whitespace/protected-file checks passed. No actual payment, booking or submission.
- Checkpoint only; not published.

## Masterclass2 Hero Hierarchy Refinement — 2026-10-24
- On `/masterclass2` only, preserved the exact four-line homepage-style headline, Montserrat and pink/purple gradient while refining scale and line-height. Changed the single `100% Virtual` line into a small outlined pill. Made the unchanged `Watch Now—Get Answers.` prompt smaller with one decorative standard play icon and tighter cue spacing.
- Original background, pulsing/reduced-motion arrow, full YouTube iframe, Featured In, family photo, biography, main/sticky booking labels/actions, actual $39 charge, checkout/backend and every other page unchanged. Independent read-only diff/normalization review passed. Updated only hero/approved-comparison tests.
- Validated 37 focused regressions, TypeScript/build, six responsive widths and three production widths: exact four lines without clipping/overlap, original homepage font/gradient, small badge, decorative play cue, loaded YouTube Play controls, preserved bio accordion/modal/sticky behavior. Six built-production routes HTTP 200; mobile/desktop visuals reviewed. Full suite: 635 passing, 2 opt-in integrations skipped, 1 documented pre-existing imported-content compliance failure; no new regressions. Whitespace/protected-file checks passed. No payment, booking or submission.
- Checkpoint only; not published.

## Masterclass2 Hero Refinement Revert — 2026-10-24
- Per explicit approval, reverted only the latest hero refinement on `/masterclass2`: previous headline size/line-height, large `100% Virtual` text and bold `Watch Now—Get Answers.` cue without the play icon; previous cue gaps restored.
- Page and three hero-related regression files now match checkpoint 5395a2dd byte-for-byte. Both `Book My Video Visit — Only $39!` booking labels remain. Original background, arrow animation, video, family photo, biography, all booking/payment handlers, $39 charge, other pages and backend unchanged. Prior tracker history retained; this is not a whole-project rollback.
- Validated 35 focused tests, TypeScript/build, six responsive widths and three built-production widths, loaded video controls and original homepage style parity; six production routes HTTP 200. Mobile visual and independent exact-source review passed. Full suite: 633 passing, 2 opt-in integrations skipped, 1 documented pre-existing imported-content compliance failure; no new failures. Whitespace/protected-file checks passed. No payment, booking or submission.
- Checkpoint only; not published.

## Masterclass2 Orlando Family Recognition Badge — 2026-10-24
- Added only one compact linked badge beneath `Meet Dr. Jumana Al-Deek, DO` in the local masterclass2 biography: `Recognized as a 2026 Top Physician` / `Orlando Family Magazine`. Existing introduction, biography data, credentials, accordions, page hero/video/photo, both Only $39 booking buttons and actual checkout unchanged. No homepage, original masterclass, intake, backend, routing or global-style changes.
- Official source verified Dr. Jumana Al-Deek under Family Medicine: https://www.orlandofamilymagazine.com/current-issue/2026-top-physicians/. Linked directly with safe new-tab attributes and accessible new-tab text. Reused the profile's Montserrat and soft pink/purple palette; no numerical ranking, #1 claim, endorsement claim or fabricated official logo.
- Independent exact-source check: removing the sole added anchor restores the profile byte-for-byte to baseline 52fb73f4. Updated only its related regression test. Validated 36 focused tests, TypeScript/build, six responsive widths and three production widths: badge fit/placement, source URL, keyboard access and original hero/video/bio/booking/sticky behavior; six production routes HTTP 200. Mobile/desktop screenshots reviewed, protected-file/whitespace checks passed. Full suite: 634 passing, 2 opt-in integrations skipped, 1 documented pre-existing imported-content compliance failure; no new failures. No payment, booking or submission.
- Checkpoint only; not published.

## Masterclass2 Balanced Headline Layout — 2026-10-24
- On `/masterclass2` only, retained exact headline wording in three centered lines: `Menopause, Hormones` / `& Weight Loss.` / `Done Right for You.`. Grouped the topics into two lines and made the promise 0.8em with an 8px/12px mobile/desktop gap. Responsive topic sizing is `clamp(1.375rem, 7vw, 3.5rem)`, measured to fit narrow phones. Original Montserrat, weight, relative line-height/tracking and pink-purple gradient retained; no forced nowrap.
- Everything outside the single h1 is byte-identical to 824dc8db: 100% Virtual and its typography, watch prompt/arrow/video, recognition badge, biography, family photo, both Only $39 buttons, booking and payment logic. Updated only the associated homepage-headline regression. Other pages, shared components, backend, intake, prices and routing untouched.
- Independent scope review and inverse source equality passed. Validated 37 focused tests, TypeScript/build, six responsive widths (320/375/430/768/1024/1440) and three built-production widths: all three lines fit and are centered, promise is smaller with exact gap, font/gradient/virtual subheading unchanged, badge/bio/booking/sticky work with no browser errors or submissions. Six production routes HTTP 200; mobile/desktop visuals reviewed. Full suite: 635 passing, 2 opt-in integration tests skipped, 1 unchanged documented imported-content compliance failure; no new regressions. `git diff --check` and protected-file scope checks passed.
- Checkpoint only; not published. No bookings, payments or patient submissions.

## Masterclass2 Paid-First Booking Pills — 2026-10-24
- Swapped only the two complete booking blocks on `/masterclass2`: Book My Video Visit — Only $39! first, Book a Free 15-Minute Call second. Each supporting line moved with its button. Wording, colors, styles, spacing, actions, mobile sticky CTA and the rest of the page remain unchanged.
- Independent read-only review proves each block byte-identical to baseline 65b3b2a6 and inverse swap restores the entire document. Updated only the order-specific test title/assertion. All protected pages, shared components, backend and payment logic unchanged.
- Passed 30 focused tests, TypeScript/build, six responsive widths (320/375/430/768/1024/1440), three built-production widths and six production HTTP 200 routes. Paid-first order, equal pill sizes, helper attachment/readability, free-call navigation, existing checkout opening and sticky controls passed with no overflow/errors/submissions/payments. Mobile/desktop visuals reviewed. Full suite: 635 pass / 2 opt-in skipped / 1 unchanged documented imported-content compliance failure. Whitespace and scope checks passed.
- Checkpoint only; not published.

## Weight-Loss & Menopause V2 Duplicate — 2026-10-24
- Duplicated `/weight-loss-menopause` as independent `/weight-loss-menopauseV2` with isolated component, CSS selectors/keyframes and root-scoped interactions. Preserved exact design, wording, prices, images, shared catalog rendering (seven GLP-1 and four pictured HRT cards), header/footer, interactions and external intake destination `https://intake.medmethoddirect.com/`. Original page, shared catalog, intake/payment workflows and other pages unchanged.
- Registered exact user-cased and trailing-slash routes, matched social-proof suppression, and copied route metadata with the V2 canonical URL and `noindex,follow`. V2 remains outside the sitemap. Added six inverse-parity, routing, namespace, catalog/link and metadata regressions.
- Validation: 16 original/V2 targeted tests passed; TypeScript and build passed. Responsive text, image, link and computed-style parity passed at 320/375/768/1440px, including medication toggles, estimator, app tabs, FAQ, sticky CTA, SPA navigation and intercepted intake navigation. Mobile/desktop screenshots reviewed; six built-production routes HTTP 200 and production parity passed at 375/1440px. Scope and whitespace checks passed. Full suite: 641 passed, 2 opt-in integrations skipped, 1 documented pre-existing LegitScript imported-content scan failure in `client/index.html`, left unchanged and out of scope.
- No real patient submissions, SMS, payments or external provider actions. Checkpoint only; not published.

## Menopause V2 Preview Entry Cleanup — 2026-10-24
- Removed only the redundant `/weight-loss-menopauseV2/` Route declaration so the preview lists one original page and one V2 page. All original/V2 page, style, interaction, pricing, link and metadata files remain unchanged. The existing router still accepts a trailing slash without a separate declaration.
- Updated the regression to require exactly one V2 Route entry. Passed all 16 original/V2 tests, TypeScript, whitespace and protected-file scope checks. Safely intercepted browser checks confirmed original, V2 and trailing-slash V2 each render exactly one correct page.
- Checkpoint only; not published.

## Menopause V2 Hero Copy — 2026-10-24
- On `/weight-loss-menopauseV2` only, changed the hero headline to `Text a Doctor NOW — For FREE!` and the supporting pill to `Explore your options for Weight Loss, GLP-1s, Menopause & Hormone Therapy.` Topic names remain bold and `For FREE!` reuses the existing pink/purple headline emphasis. Existing Montserrat, CSS, responsive wrapping, design, pricing, intake links and all other content unchanged; original `/weight-loss-menopause` untouched.
- Updated exact-copy and inverse-source regressions, preserving whole-page parity outside the two approved hero lines. Passed 17 original/V2 tests, TypeScript and whitespace/protected-file checks. Safely intercepted browser checks passed at 320/375/768/1440px for exact text, bold topics, existing font/gradient, unchanged pricing and no clipping/overflow/overlap; original headline confirmed unchanged.
- Checkpoint only; not published. No patient submissions, messages, payment or provider actions.

## Menopause V2 Hero Breathing Room — 2026-10-24
- On V2 only, removed the entire hero membership-price/refund/billing block. Converted the supporting pill to clean 17–20px paragraph text without its border or dot, retaining exact wording and bold purple topic names. Balanced the existing headline sizing and added 26–32px headline-to-description and 32–36px description-to-button gaps, with extra mobile top padding. Original fonts/colors, CTA wording/link, animated phone, other pricing and sections, original page and payment/intake workflows untouched.
- Extended inverse-source tests to reverse only the approved hero changes and appended hero-scoped CSS. Passed 18 original/V2 regressions, TypeScript and whitespace/protected-file checks. Safely intercepted browser checks at 320/375/768/1440px verified exact copy, readable typography, measured gaps, no hero price/pill, no clipping/overflow, existing intake link and other pricing, and unchanged original hero.
- Checkpoint only; not published. No patient submissions, messages, payment or provider actions.

## Menopause V2 Specialist Headline — 2026-10-24
- Changed only the V2 hero wording to `Text a Weight Loss & Hormone Specialist NOW — For FREE!` and `Explore your options for GLP-1s, Menopause & Hormone Therapy.` Current refined design, fonts/colors, spacing, natural wrapping, bold topic styling, removed hero pricing block, phone, CTA links and all other content retained. Original page, CSS, interactions, routing and backend unchanged.
- Updated exact-copy regression expectations. All 18 original/V2 tests, TypeScript and whitespace/protected-file checks passed. Safely intercepted responsive checks at 320/375/768/1440px passed for exact wording, wrapping without clipping/overflow, original spacing/font/gradient and intake link.
- Checkpoint only; not published. No patient submissions, messages, payment or provider actions.

## Menopause V2 Bodoni Moda Trial — 2026-10-24
- Applied Bodoni Moda at the existing 700 weight only to the V2 hero headline, with optical sizing enabled. Loaded the verified Google Fonts stylesheet through the V2 page head only. Supporting text, buttons, phone and all other sections remain in their existing Montserrat fonts. Wording, colors/gradient, sizes and spacing retained; original page and all other files/workflows untouched.
- Passed 19 original/V2 regressions, TypeScript and whitespace/protected-file checks. Safely intercepted browser checks at 320/375/768/1440px confirmed the actual Bodoni Moda font loads (not a fallback), headline fits without clipping/overflow, existing gaps/gradient, and unchanged supporting/button/phone typography. Original remains Montserrat and the V2 font link is removed when leaving the page.
- Verified source: `https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,700&display=swap`. Checkpoint only; not published. No patient submissions, messages, payments or provider actions.

## Menopause V2 Playfair Display Replacement — 2026-10-24
- Replaced Bodoni Moda with Playfair Display at the existing 700 weight only on the V2 hero headline. Changed only the V2-owned font link and h1 font-family rule, plus corresponding regressions. Exact wording, colors/gradient, sizes and spacing retained. Supporting text, buttons, phone and other sections remain in their existing Montserrat fonts; original page, shared font assets and all other pages/workflows untouched. No Bodoni link or font rule remains in V2.
- Passed 19 original/V2 regressions, TypeScript and whitespace/protected-file checks. Browser checks at 320/375/768/1440px confirmed actual Playfair Display loading, no clipping/overflow, existing gaps/gradient/intake link, and unchanged supporting/button/phone fonts. Original remains Montserrat and V2-owned font link is removed when leaving the page. Existing shared Playfair assets serving unrelated pages were preserved.
- Verified source: `https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap`. Checkpoint only; not published. No patient submissions, messages or payments.

## Menopause V2 Reference Font Only — 2026-10-24
- Per the user's latest clarification, use only the reference page's DM Serif Display headline font at its natural regular 400 weight. Restored the original V2 design before applying the font-only change; no reference palette/layout/phone/button redesign retained. Black headline, pink/purple gradient, original background, spacing, sizes, phone content/appearance, links and all other sections unchanged. Supporting text, buttons and phone retain Montserrat. Original/reference pages untouched.
- Changed only the page-owned font link and V2 h1 font family/weight, with corresponding regressions. Exact inverse comparison against checkpoint dd0aaab2 proves all remaining page/CSS bytes are identical. Passed 19 original/V2 tests, TypeScript and scope/whitespace checks. Provider-blocked browser checks at 320/375/768/1440px confirmed actual DM Serif Display loading, original black/pink/purple colors/background/button gradient, preserved spacing and other fonts, no clipping/overflow, and original route unchanged.
- Checkpoint only; not published. No patient submissions, messages, payments or provider actions.

## Menopause V2 Concise Doctor Hero — 2026-10-24
- Applied the approved two-line headline “Text a Doctor now” / “For FREE!” and supporting line “to explore GLP-1s, menopause & hormone therapy.” Enlarged the existing DM Serif Display headline and used a smaller regular serif supporting line, preserving the original black/pink/purple colors, background, CTA, phone, wording/prices elsewhere, links and all other sections/pages. Only two hero markup lines and appended hero-scoped typography rules changed.
- Independent regression update passed 20 original/V2 tests. TypeScript, build, whitespace and protected-file checks passed. Exact inverse comparison against b5dd9ba5 restores the whole page; CSS prefix remains byte-identical and the append contains typography only. Safely intercepted browser checks at 320/375/430/768/1024/1440px confirmed exactly two larger headline lines, smaller serif supporting text, actual font load, preserved palette/button/phone/intake link, and no clipping, overlap or overflow. Mobile/desktop screenshots reviewed.
- Checkpoint only; not published. No patient submissions, messages, payments or provider actions.

## Menopause V2 Supporting-Line Readability — 2026-10-24
- Refined only “to explore GLP-1s, menopause & hormone therapy.” using medium-weight Montserrat, slightly larger responsive sizes and 1.5 line-height. Intro uses existing black and treatment names existing deep purple. Wording, DM Serif Display headline, buttons, phone, all page markup/images/prices/links/interactions, original/reference pages and every other section remain unchanged.
- Appended five supporting-text-only CSS lines plus related regression/tracker changes. CSS prefix is byte-identical to checkpoint 23648d0b; page TSX and protected files unchanged. Independent regressions: 21 original/V2 tests passed. TypeScript/build, scope and whitespace checks passed. Provider-blocked browser checks at 320/375/430/768/1024/1440px confirmed medium Montserrat, larger size/line spacing, black/purple contrast 17.95:1 and 8.62:1, unchanged headline/button/phone computed styles, preserved intake link, and no clipping/overlap/overflow. Mobile/desktop visuals reviewed.
- Checkpoint only; not published. No patient submissions, messages, payments or provider actions.

## Menopause V2 Compact How It Works — 2026-10-24
- Simplified only V2's How it works into the exact three approved steps: “Complete your intake (5–10 min)”, “Text with your doctor”, and “Discuss your options with your doctor, based on your evaluation.” Removed explanatory paragraphs/list. Compact numbered cards use the hero's DM Serif Display for headings, Montserrat numbers, existing black/pink-purple palette, downward arrows in a mobile stack and rightward arrows across three desktop columns. Tighter padding/spacing and phone-safe text sizing; no teal recoloring.
- Whole-page inverse comparison restores checkpoint 7461a773 after replacing only the section; original CSS prefix remains byte-identical with appended #how-it-works-only rules. Hero/supporting line, other sections, prices/images/intake links, interactions, original/reference pages and backend untouched. Independent and final focused regression checks passed 23 original/V2 tests; TypeScript, final build, whitespace and protected-file checks passed. Provider-blocked browser QA at 320/375/430/768/1024/1440px passed exact copy/three cards, no extra text, serif/palette/arrows/layout, unclipped content and unchanged styles across all other sections. Existing medication toggle behavior retained. Mobile/desktop section screenshots reviewed.
- Checkpoint only; not published. No patient submissions, messages, payments or provider actions.

## Menopause V2 How It Works Placement — 2026-10-24
- Moved the exact unchanged How it works block directly below Featured In on V2 only. Order is now Hero → Featured In → How it works → medication pricing → estimator → remaining sections. No duplicate block. All copy, styles, prices, images, links, interactions and other pages unchanged; CSS untouched.
- Inverse move restores the entire page byte-for-byte to checkpoint 9c29f266. Updated only order/parity regressions and tracker. Passed 24 original/V2 tests, TypeScript/build, whitespace and protected-file checks. Provider-blocked browser checks at 320/375/768/1440px confirmed direct sibling adjacency, one section, preserved copy/serif/responsive cards/intake link, and no overlap/overflow.
- Checkpoint only; not published. No patient submissions, messages, payments or provider actions.

## Menopause V2 GLP-1 Medication Display Update — 2026-10-24
- Updated only the seven V2 GLP-1 cards to the approved exact names, prices and dose/supply details. Reused the already-approved shared read-only display entries without modifying the shared catalog: Semaglutide $129/month fixed; Tirzepatide $149 to $299/month; Liraglutide $115 with 28-day supply (no /month); Wegovy Pen $349/month fixed; Wegovy Pill $149 to $299/month; Zepbound KwikPen $299 to $449/month; Foundayo Pill $149 to $299/month. Displayed vial ranges, multidose formulation, pill strengths and pen quantities/doses exactly as approved. HRT retains its original data/rendering. Existing images, clinical notes, card CSS, external intake links, membership prices, other sections and original/intake/reference pages unchanged.
- Only V2 card display typing/renderer plus corresponding regressions/tracker changed. Exact inverse restores the whole V2 source to checkpoint 1c42f1f2; shared catalog, CSS, interactions and protected files unchanged. Independent original/V2 regressions passed 25 tests; TypeScript/build, whitespace and scope checks passed. Provider-blocked browser QA at 320/375/430/768/1024/1440px verified all seven exact names/prices/supplies/specs, existing images/notes/links, GLP-1/HRT toggles, and unchanged HRT DOM excluding development-only source-location annotations; no clipping or overflow. Desktop cards visually reviewed.
- Automatically saved as a checkpoint only; not published. No patient submissions, messages, payments or provider actions.

## Menopause V2 Same-Price-at-Every-Dose Labels — 2026-10-24
- Replaced “fixed price” only on V2’s two fixed-price GLP-1 cards: Compounded Semaglutide now “$129/month — same price at every dose”; Wegovy Pen now “$349/month — same price at every dose.” All numerical prices, dose-based ranges, Liraglutide’s $115 / 28-day supply, dose details, HRT, styles, images, notes, intake links, other sections and pages remain unchanged. Shared catalog untouched; display-only wording replacement occurs inside V2’s GLP-1 branch.
- Exact inverse of the single price-expression line restores the entire page to checkpoint c3c3073b. Only that source line, related regressions and tracker changed. Passed 26 original/V2 tests, TypeScript/build, whitespace and protected-file checks. Provider-blocked browser QA at 320/375/430/768/1024/1440px confirmed both new labels and every unchanged card detail, original images/notes/HRT DOM/links, working toggles and no clipping/overflow.
- Automatically saved as a checkpoint only; not published. No patient submissions, messages, payments or provider actions.

## Menopause V2 Uploaded Hero Design — 2026-10-24
- Applied the user-uploaded `medmethod_hero.html` design only to the V2 hero: exact “Text a Weight Loss & Hormone Doctor now. For FREE!” headline, Playfair Display headline / DM Sans supporting text, white/navy/pink-purple design, underlined FREE, updated CTA proportions and spacing, exact “Explore your options for GLP-1s, menopause & hormone therapy.” supporting text and retained by-text/no-video note. Kept original phone frame/notch, doctor photo and HIPAA badge, with a smaller 310px phone / 580px screen and 18px message text. Replaced the lengthy conversation with the two exact uploaded patient/doctor messages; illustrative label and reduced-motion-safe sequencing retained. Composer is decorative, not a functional messaging control. Original secure-intake CTA remains `https://intake.medmethoddirect.com/`, not the attachment’s landing-page backlink.
- Full hero inverse plus removal of the new page-owned font link restores the complete page to checkpoint 14aeda50. Previous CSS retained, with only hero-scoped rules appended; unchanged DM Serif link retained for How it works. Interactions, navigation, Featured In → How it works placement, GLP-1 labels/pricing/HRT/catalog, every other section/page and backend untouched. Independent strict original/V2 regressions passed 26 tests; TypeScript/build, whitespace and protected-file scope checks passed. Provider-blocked browser QA at 320/375/430/768/1024/1440px verified exact copy/fonts, smaller original phone/photo/badge, complete 18px message fit above composer, correct CTA, no text clipping/overflow, and computed-style parity across all non-hero sections. Normal animation and reduced-motion checks passed; desktop/mobile screenshots visually reviewed.
- Automatically saved as a checkpoint only; not published. No patient submissions, messages, payments or provider actions.

## Menopause V2 Simple Headline Ampersand — 2026-10-24
- Changed only the headline “&” from ornate Playfair Display to the existing DM Sans font using one symbol-only span and CSS rule. A zero-height inline line box prevents the alternate font metrics from enlarging the headline; the visible glyph keeps the original font size, color, weight and letter spacing. All other headline wording/fonts, hero styling/layout, phone, links, pricing, sections/pages and interactions unchanged. No new font asset or global stylesheet change.
- Exact inverse of the ampersand wrapper and its one CSS rule restores the page/styles byte-for-byte to checkpoint 0e26c98f. Passed 27 original/V2 tests, TypeScript, final build, whitespace and protected-file checks. Provider-blocked browser checks at 320/375/768/1440px confirmed DM Sans only on the symbol, Playfair for the rest, unchanged visible glyph size/color/weight/tracking and exact headline bounds, no overflow/clipping, and unchanged secure-intake link.
- Automatically saved as a checkpoint only; not published. No patient submissions, messages, payments or provider actions.

## Menopause V2 Uploaded Ampersand Shape — 2026-10-24
- Replaced only the V2 headline ampersand’s visual shape with the exact user-uploaded `IMG_8814.PNG` glyph. Original upload untouched; white background/margins removed into a 101×117px transparent PNG stored outside the project and uploaded via webdev storage as `/manus-storage/menopause-v2-reference-ampersand_40428d79.png`. Applied as a contained, nonrepeating inline CSS mask so the glyph inherits the existing headline color. Kept the accessible ampersand text and all TSX unchanged; symbol-only sizing/baseline/overflow rules keep the headline’s original dimensions. No generated replacement shape or guessed font.
- Only the existing symbol CSS rule, corresponding regression and tracker changed; original page, all other V2 typography/layout, phone/messages, pricing/catalog, sections, links, interactions and backend untouched. Passed 27 original/V2 tests, TypeScript/final build, whitespace and protected-file checks. Provider-blocked browser checks at 320/375/768/1440px verified real 101×117 asset loading, existing headline color and exact bounds, unchanged accessible wording, no clipping/overflow, and original intake URL. Mobile/desktop previews visually confirmed the reference shape.
- Automatically saved as a checkpoint only; not published. No patient submissions, messages, payments or provider actions.

## Menopause V2 Featured In Straight Bottom Edge — 2026-10-24
- Removed only the curved overlay at the Featured In → How it works boundary by hiding `#how-it-works.wave-top::before` inside V2’s isolated CSS scope. Banner itself, colors, logo images/animation, section spacing, content/order, uploaded ampersand/hero, cards/prices, interactions and other pages unchanged. All TSX and original/global CSS untouched.
- Removing the one-line override restores the whole stylesheet byte-for-byte to checkpoint 93822eea. Passed 28 original/V2 tests, TypeScript/build, whitespace and protected-file checks. Provider-blocked browser checks at 320/375/768/1440px confirmed the hidden wave/straight edge, exact unchanged banner dimensions/colors/padding/animation/logo sources, unchanged How it works geometry/direct adjacency and no overflow. Original menopause page’s curve remains unchanged. Mobile/desktop previews checked.
- Automatically saved as a checkpoint only; not published. No patient submissions, messages, payments or provider actions.

## Menopause V2 Free Doctor Evaluation and Text Care — 2026-10-24
- Replaced all old $49/month membership/first-month payment copy on V2 with free doctor evaluation and care by text; medication remains priced separately. Updated medication-section intro, main pricing heading/body/accessible label, FREE price block, mobile sticky FREE text-care label and aria label. Updated medication-cost/app FAQ and Patient perspectives label; replaced the old $49 refund FAQ with a free-care FAQ retaining clinician-appropriate prescribing. Removed the obsolete $30 video add-on without adding a new video offer. Existing free app bonus/testimonials, clinical safety language, medication names/prices/doses/images/notes, hero/ampersand, colors/styles, straight Featured In edge, section order, links and other pages unchanged. No intake/checkout/backend changes.
- Eleven exact copy replacements reverse to the complete prior V2 source at checkpoint 6b9a64f3. CSS, V2 interactions, shared catalog, original pages, routing/metadata and backend untouched. Independent strict original/V2 regression checks passed 30 tests, including reverse-copy normalization, free-care FAQs/pricing/sticky label/ARIA and absence of old fee/payment/refund/$30 wording. TypeScript/build, whitespace and protected-file checks passed. Provider-blocked responsive checks at 320/375/430/768/1024/1440px confirmed free-care messaging, every unchanged seven GLP-1 and four HRT price, medication toggles/FAQ, sticky CTA and original external-intake destination, no clipping/overflow. Mobile/desktop pricing and mobile medication/sticky screenshots visually reviewed.
- Automatically saved as a checkpoint only; not published. No patient submissions, messages, payments or provider actions.

## Menopause V2 Homepage-Style Doctor Biography — 2026-10-25
- Replaced only V2's doctor section with an independent homepage-style physician profile component. Reused the actual homepage portrait and existing content: Meet Dr. Jumana Al-Deek, DO, MS; three credential pills and six specialty/focus pills; 50,000+ patients seen proof and free direct-text-care line; five existing education/training entries, NASM pre-medicine background, physician quote, expanded Practice Focus/Philosophy, and three native accessible clinical/training details. White two-column desktop card with soft rose education panel; mobile stacks the intro/uncropped portrait/bio and training panel. No new credentials, state-count claims, coach section, extra Featured In or booking/paid offer. Existing homepage/shared component remains untouched.
- Added only the isolated V2 bio component import/invocation and #doctor-scoped CSS after a new marker. Full page inverse returns source to checkpoint 2a9b60a4; old CSS prefix remains byte-identical. Hero/ampersand/phone, straight banner edge, section order, free-care pricing, medication catalog/cards/prices, links/interactions, homepage/original/other pages and backend untouched. Independent and final targeted original/V2 regression suites passed 35 tests, including homepage fact/content parity, complete inverse normalization, portrait/native accordion and CSS isolation contracts. Final TypeScript/build, whitespace and protected-file checks passed.
- Provider-blocked QA at 320/375/430/768/1024/1440px passed real homepage portrait loading without cropping, one visible portrait, exact credentials/focus/training counts, three mouse/Enter/Space-operable details, single plus/minus icons, balanced headings and no overflow. Six-width free-care/medication QA also passed all unchanged seven GLP-1/four HRT prices, toggles/FAQ/sticky/intake link. Desktop and mobile intro/training previews reviewed.
- Automatically saved as a checkpoint only; not published. No patient submissions, messages, payments or provider actions.

## Menopause V2 Complete Homepage Credential Badges — 2026-10-25
- Added only the three missing homepage credential-row badges: Metabolism, Mom of Four and Licensed in 12 states. User explicitly confirmed that 12 states is current. V2 now matches all six homepage badges in the same order: Board-Certified DO, Menopause Specialist, Metabolism, Author, Mom of Four, Licensed in 12 states. No other bio content, focus areas, education, portrait, design/CSS, hero, prices, links, page sections, homepage/original pages or backend changes.
- The single credential-array line reverses to the complete prior bio component at checkpoint f776c9b6. Updated only corresponding exact homepage-list and confirmed-license assertions plus tracker. Passed 35 original/V2 targeted tests, TypeScript/build, whitespace and implementation-file scope checks. Provider-blocked QA at 320/375/430/768/1024/1440px confirmed the exact six badges, clean wrapping/no overflow and unchanged focus/training/details/free-care messaging. Mobile/desktop badge previews checked.
- Automatically saved as a checkpoint only; not published. No patient submissions, messages, payments or provider actions.

## Menopause V2 Optional $39 Zoom Visit — 2026-10-25
- Added only the approved optional offer beneath FREE text-care pricing: “Prefer face-to-face care? Add a virtual Zoom visit — only $39 per visit.” Reused the existing video-addon styling without CSS changes. Added one native FAQ, “Can I add a virtual Zoom visit?”, clarifying it is optional and $39 per visit, doctor evaluation/text care remain free, and medication is priced separately. No new CTA or checkout/intake/payment changes; all medication prices, current bio/credential badges, hero/phone, design, existing links and other pages remain unchanged.
- Removing the two added HTML fragments restores the complete page to checkpoint 9e23bba5. Updated strict source normalization and added optional-offer/FAQ/per-visit/no-checkout regressions. Passed 36 original/V2 targeted tests, TypeScript/build, whitespace and implementation-file scope checks. Provider-blocked QA at 320/375/430/768/1024/1440px verified exact offer wording, FREE care and medication separation, native FAQ click/keyboard behavior, unchanged intake destination and credential badges, no clipping/overflow. Mobile/desktop pricing previews reviewed.
- Automatically saved as a checkpoint only; not published. No patient submissions, messages, payments or provider actions.

## Masterclass2 Physician Heading MS Credential — 2026-10-25
- Changed only the masterclass2 physician introduction heading to the exact approved “Meet Dr. Jumana Al-Deek, DO,MS”. One text line in its isolated PhysicianProfile component; all styling, other biography/credentials/recognition, page content, booking buttons and $39 checkout, V2, homepage/original pages and backend remain unchanged.
- Reversing the heading text restores the complete component byte-for-byte to checkpoint 393aabb2. Updated only the exact-heading assertion and tracker. Passed all 30 masterclass2 tests across six suites, TypeScript/build, whitespace and protected-file scope checks. Provider-blocked browser checks at 320/375/768/1440px confirmed exact visible text, original 26px/32px font sizes/weight/purple color, one heading, preserved recognition and no clipping/overflow. Browser interception permits local app library imports while blocking external provider/API actions; no server or source infrastructure changes were needed.
- Automatically saved as a checkpoint only; not published. No patient submissions, messages, bookings, charges or provider actions.

## Masterclass2 Free Doctor Visit — Text Only Option — 2026-10-25
- Added only the confirmed middle option in Choose How to Connect: “Free Doctor Visit — Text Only”, linking directly to https://intake.medmethoddirect.com/. Helper: “Complete your intake (5–10 min), then instantly connect with your doctor through text messaging.” Disclosure: “Ongoing care by text. No video visit. Medication priced separately.” Messaging access after intake is distinct from immediate physician response. Equal-width soft-pink/purple-text pill sits between the existing $39 video visit and free 15-minute Care Team call. Both existing blocks/actions, mobile video-booking pill and all other content remain unchanged. No form, chat, checkout/payment behavior, tracking or patient-prefill URL added.
- Removing the one new block restores the complete page byte-for-byte to checkpoint b2158ffa. Only page insertion, corresponding booking regressions and tracker changed. Independent six-suite masterclass2 tests passed 32 tests; TypeScript/build, whitespace and protected-file scope checks passed. Provider-blocked browser QA at 320/375/430/768/1024/1440px verified exact three-option order/copy, equal pill widths, soft-pink/purple colors, disclosures, no clipping/overflow, original video/sticky labels and MS heading, plus keyboard navigation to the exact intake URL intercepted without loading or submitting a real intake. Mobile/desktop booking previews reviewed. Original/homepage/V2 pages, doctor profile, all prices, checkout/intake/backend and global CSS untouched.
- Automatically saved as a checkpoint only; not published. No patient submissions, messages, bookings, charges or provider actions.

## Masterclass2 Reference-Style Connection Rows — 2026-10-25
- Redesigned only Choose How to Connect to follow the approved reference: stronger heading and existing virtual/17-state subtitle; three full-width, rounded, fully clickable rows with decorative video/message/phone icons, right arrows and helper text inside each control. Paid gradient row: “Book My Video Visit” / “Only $39”; soft-pink row: “Free Doctor Visit — Text Only” / “Complete your intake (5–10 min), then start messaging with your doctor.”; outlined white row: “Free 15-Minute Discovery Call” / “Talk with our care team, ask questions, and find the best option for you.” Compact shared disclosures below: “Ongoing text care included. Medication priced separately.” and “Care Team call: general information, not medical advice.” Native button/links retain the exact original checkout, intake and Care Team actions; mobile sticky paid-video button unchanged.
- Only the booking-section markup and standard Lucide icon import changed in implementation. Reversing both restores the entire page byte-for-byte to checkpoint 7b5eb414. Updated section contracts and the strict duplicate's approved icon-import normalization only. Passed 31 tests in all six masterclass2 suites, final TypeScript, build, whitespace and protected-file checks. Provider-blocked QA at 320/375/430/768/1024/1440px passed exact row order/copy/disclosures, equal widths, decorative hidden icons, native controls without nesting, internal helper layout, readable wrapping/no clipping or overflow, keyboard focus and safely intercepted intake/Care Team destinations. Mobile/desktop previews reviewed. Doctor profile/MS heading, video/bio/family image, all prices, mobile controls, original/homepage/V2 pages, global CSS and checkout/intake/backend untouched.
- Automatically saved as a checkpoint only; not published. No patient submissions, messages, bookings, charges or provider actions.

## Masterclass2 Three-Option Mobile Connection Bar — 2026-10-25
- Replaced only the single mobile sticky paid pill with a compact white floating bar: equal-width Video Visit / $39 (gradient), Text Your Doctor / Free (soft pink), and Care Team Call / Free · 15 min (white). Each has its matching decorative icon, two-line label, native accessible control and at least 68px touch height. Paid opens the same $39 checkout; text and Care Team retain the exact intake and /care-team-booking destinations. Whole bar hides while checkout is open and restores afterward with the existing paid-button keyboard focus recovery. Side/bottom safe-area expressions retained; mobile-only content padding increased from 88px to 112px. Desktop and the main three-option section remain unchanged.
- Exact replacement of the old pill and padding restores the entire page to checkpoint 77c55b95. Related mobile tests, strict duplicate normalization and the obsolete Work With Me sticky-label assertion updated only; required accessible paid-price label is excluded from visible-price counting. All six masterclass2 suites passed 33 tests, TypeScript/build and whitespace/scope checks passed. Provider-blocked browser QA at 320/375/430/767/768/1024/1440px verified equal control widths/unclipped two-line labels, fixed scroll behavior, safe spacing, mobile-only visibility, checkout opening/hide/close/focus recovery and safely intercepted text/Care Team navigation; short 375×568 viewport confirmed the page footer clears the bar. Final mobile previews reviewed. Other page content, MS bio, video/family image, prices, original/homepage/V2 pages, global CSS and checkout/intake/backend untouched.
- Automatically saved as a checkpoint only; not published. No patient submissions, messages, bookings, charges or provider actions.

## Masterclass2 Reference-Matched Mobile Bar and Clinic Dialer — 2026-10-25
- Matched the supplied reference’s mobile-bar order and exact visible labels: left Text Visit / Free; center Video Visit / $39; right Call Now / For more info. White purple-outlined outer buttons, white lightly outlined container, smaller reference-style rounded corners, sampled pink/purple center gradient, larger decorative icons and bold first-line labels. Retained three equal-width 68px touch controls, safe-area positioning, 112px mobile content clearance, desktop hiding and checkout hide/restore with paid-button focus recovery. User explicitly approved Call Now opening the clinic dialer; this mobile anchor now uses tel:+18883627011 instead of Care Team booking. The main Care Team discovery-call row still links to /care-team-booking, and the existing intake/checkout actions remain unchanged.
- Replacing only the nav block with baseline restores the entire page byte-for-byte to checkpoint 72e5b6e0. Updated only mobile-bar regressions and tracker. All six masterclass2 suites passed 33 tests; final TypeScript/build and whitespace/scope checks passed. Provider-blocked browser QA at 320/375/430/767/768/1024/1440px verified exact order/copy, equal outlined white buttons/center gradient, single-line label fit, fixed scrolling, native accessible controls, checkout opening/hide/close/focus recovery and safely intercepted intake/tel actions. The tel click was prevented before OS dialing; no real call placed. Short 375×568 viewport footer-clearance passed; final bar and wider-phone previews reviewed. All other page content, main rows, prices, bio, original/homepage/V2 pages, global CSS and checkout/intake/backend unchanged.
- Automatically saved as a checkpoint only; not published. No patient submissions, messages, bookings, charges, real calls or provider actions.

## Masterclass2 Mobile Bar Clearer Labels and Subtle Elevation — 2026-10-25
- Updated only the mobile bar’s labels to Text a Doctor / Free, Video Visit / $39 per visit, and Call Now / Clinic info. Text/video accessible names match the new wording; phone accessible name and clinic number unchanged. Added one soft outer shadow (0 6px 20px rgba(61,22,64,0.12)), without shadows on individual controls. Preserved all icon/style/color/order/geometry/safe-area/mobile-only behavior, intake/checkout/tel actions and checkout hiding/focus recovery. No main connection-section or other-page changes.
- Exact six-line inverse restores the entire page to checkpoint 969195a9. Only page, two relevant regression files and tracker changed. All 33 tests across six masterclass2 suites, TypeScript/build and whitespace/scope checks passed. Provider-blocked browser checks at 320/375/430/767/768/1024/1440px verified all labels fit, equal controls, exact visible shadow, unchanged colors/borders/gradient, fixed scrolling, checkout opening/hide/close/focus return and safely intercepted intake/tel clicks. Short 375×568 footer-clearance passed; 375px bar and 430px full-screen previews visually reviewed. All prices, other content/pages/global styles and checkout/intake/backend unchanged.
- Automatically saved as a checkpoint only; not published. No patient submissions, messages, bookings, charges, real calls or provider actions.

## Masterclass2 Mobile Left Label Restored to Text Visit — 2026-10-25
- Changed only the mobile left label from Text a Doctor to Text Visit and aligned its accessible name to Text visit — free. Free remains beneath it. Kept Video Visit / $39 per visit, Call Now / Clinic info, subtle outer shadow, every style/icon/layout/action, links, checkout hide/focus behavior, all other sections/pages and backend unchanged.
- Exact two-line inverse restores the page byte-for-byte to checkpoint 04572a54. Only page, exact mobile regression and tracker changed. All 33 tests across six masterclass2 suites, TypeScript and whitespace/scope checks passed. Provider-blocked browser checks at 320/375/430/768/1440px verified exact labels, retained shadow and links, clean label fit, touch height, mobile/desktop visibility and no horizontal overflow. No real calls, payments, messages, bookings or submissions.
- Automatically saved as a checkpoint only; not published.

## Weight-Loss & Menopause V2 Matching Three-Option Mobile Bar — 2026-10-25
- Replaced only V2’s old single mobile sticky CTA with an isolated copy of the finalized masterclass2 bar: Text Visit / Free links to https://intake.medmethoddirect.com/; Video Visit / $39 per visit opens the existing unchanged $39 checkout; Call Now / Clinic info uses tel:+18883627011. Exact icons, labels, outlines, gradient, subtle outer shadow, equal 68px controls and safe-area spacing copied. Explicit Montserrat/base-color inheritance matches the reference. Mounted outside legacy content styling, visible while scrolling on mobile only, hidden during checkout and restored on close with video-button focus recovery. Added 112px mobile-only footer clearance. Rest of page, desktop and legacy interactions unchanged; old sticky queries safely no-op.
- Exact page inverse and CSS-prefix comparison confirm only import/mount/old-sticky removal and appended mobile clearance changed. Masterclass2, original menopause page, doctor bio, shared catalog/prices/assets, intake and checkout/backend source untouched. All 73 tests across nine original/V2/masterclass2 suites, TypeScript/build and whitespace/scope checks passed. Provider-blocked seven-width QA (320/375/430/767/768/1024/1440px) verified exact rendered reference style/font/control parity, touch/label fit, fixed scrolling, desktop hiding, original seven GLP-1/four HRT prices, checkout open/hide/close/focus recovery, unchanged medication toggles/estimator and footer clearance. Short 375×568 viewport and original route leakage checks passed. Final 375px bar/430px full-screen visuals reviewed.
- Automatically saved as a checkpoint only; not published. Intake navigation and clinic dialer clicks intercepted; no real calls, submissions, charges, messages, bookings or provider actions.

## Menopause V2 Hero Text/Video Option Note — 2026-10-25
- Changed only the line beneath the V2 hero button to the exact approved “100% by text message or add a video visit for only $39.” Kept the same element, classes, styling and placement. All other wording, prices, buttons, phone, mobile bar, links, other pages and payment/intake behavior unchanged.
- Exact one-line inverse restores the full page to checkpoint 08a68eac. Updated the corresponding exact-text assertion and the price-mention count for this approved additional hero mention. All 73 relevant tests across nine original/V2/masterclass2 suites, TypeScript/build and whitespace/scope checks passed. Provider-blocked browser checks at 320/375/768/1440px verified exact visible wording, unchanged font/size/weight/color/line-height/spacing/width/alignment, same placement after the hero button, no clipping/overflow and unchanged intake/bar behavior. CSS and all other implementation files untouched.
- Automatically saved as a checkpoint only; not published. No real calls, patient submissions, messages, bookings, charges or provider actions.

## Menopause V2 Hero Note Removal — 2026-10-25
- Removed only the entire hero paragraph “100% by text message or add a video visit for only $39.” to reduce clutter beneath the hero button. Headline, supporting copy, button, original phone, mobile bar, all other content, pricing, styling, links and payment/intake behavior remain unchanged. Optional $39 video visit still appears in the existing pricing offer, FAQ and mobile bar.
- Single-line deletion exactly matches checkpoint 8f5edc68 with that paragraph removed. Updated only the absence assertion and price-mention count for the retained offer/FAQ. All 73 relevant tests across nine original/V2/masterclass2 suites, TypeScript/build and whitespace/scope checks passed. Provider-blocked browser checks at 320/375/768/1440px confirmed no hero note, hero button as the last copy element, intact phone/chat messages/intake destination/video offer/mobile bar and no horizontal overflow. CSS and all other implementation files untouched.
- Automatically saved as a checkpoint only; not published. No real calls, patient submissions, messages, bookings, charges or provider actions.

## Menopause V2 Hero Button Intake Helper — 2026-10-25
- Updated only the hero button’s smaller line from “5–10 min” to the exact reference wording “Complete intake · 5–10 min”. Kept “Start your visit →”, all button styling/sizing/placement, the external intake destination, removed-note state, phone, mobile bar, other content/prices and payment behavior unchanged.
- Exact helper-text inverse restores the full page byte-for-byte to checkpoint 73a9c633. Only the page text, corresponding exact regression and tracker changed. All 73 relevant tests across nine original/V2/masterclass2 suites, TypeScript/build and whitespace/scope checks passed. Provider-blocked browser checks at 320/375/768/1440px confirmed both exact text lines, unchanged button size/font/gradient/color/radius/padding/gap, clean text fit, unchanged intake destination/mobile bar and no clipping/overflow. CSS and all other implementation files untouched.
- Automatically saved as a checkpoint only; not published. No real calls, patient submissions, messages, bookings, charges or provider actions.

## Menopause V2 Scroll-Triggered Mobile Bar Visibility — 2026-10-25
- Changed only the isolated V2 bar’s visibility: hidden on initial hero; appears after the hero Start your visit button’s bottom passes above the real sticky-header bottom; hides again when scrolling upward to that button. Short/landscape screens with the hero CTA below the viewport do not show the bar prematurely. Retained exact bar markup, labels, icons, colors, sizes, shadow, safe-area placement, three destinations/actions, desktop hiding, permanent footer clearance and checkout hide/restore. No animation or layout change added. Frame-coalesced passive scroll plus resize/orientation/pageshow/media/visual-viewport updates and CTA/header ResizeObserver handle layout changes with full cleanup. Existing 250ms prevent-scroll paid-button focus restoration now checks rendered client rectangles, avoiding focus on a hidden bar after rotating/resizing during checkout.
- Exact JSX comparison confirms the approved display condition is the only rendered markup difference from checkpoint d48acf72. Only the bar component, corresponding regression guards and tracker changed; V2 page/CSS/legacy interactions, masterclass2/reference/original pages, all copy/prices/links, shared catalog and checkout/backend unchanged. All 74 relevant tests across nine suites, TypeScript/build and whitespace/scope checks passed. Provider-blocked QA at 320×568, 375×667, 375×844, 390×844, 430×932, 667×375, 767×844 and 768×1024 verified initial/small-scroll hiding, both sides of the precise threshold, return-to-top hiding, no layout shift/overflow, original control fit and touch sizing, intercepted intake/tel actions, footer clearance and checkout open/hide/close/focus recovery. Pageshow and breakpoint resize checks passed, including no hidden focus target when checkout closes on desktop. Final initial-hero and scrolling-bio mobile previews reviewed.
- Automatically saved as a checkpoint only; not published. No real calls, patient submissions, messages, bookings, charges or provider actions.

## Menopause V2 Mobile Header Without Tagline — 2026-10-25
- Removed the painted “Feel Like Yourself Again” tagline from V2’s mobile header only, using a precisely measured bottom clip of the existing logo image. Preserved the original image, colors and 48px image scale/native width; centered the MedMethod Direct wordmark and kept the hamburger at its unchanged right-side position. Page-scoped max-width:767px CSS only: no shared Navbar, image asset or V2 page markup modifications. Header height, hero geometry, menu interaction and scroll-triggered floating-bar behavior unchanged. Desktop/tablet >=768px and other pages retain their full original header/tagline.
- All prior V2 CSS is byte-identical to checkpoint 1b172dc3; only the approved scoped header block appended. Updated the two existing stylesheet-boundary/header regressions and tracker. All 75 relevant tests across nine original/V2/masterclass2 suites, TypeScript/build and whitespace/scope checks passed. Provider-blocked browser QA compared rendered styles/geometry with the new CSS temporarily disabled at 320/375/430/767/768/1024/1440px for V2, original menopause and actual homepage: exact mobile logo size/centering and unclipped wordmark, unchanged header/hero/menu geometry, keyboard menu open/close, preserved bar hiding/scrolling, no overflow, and identical desktop/reference headers. Mobile 320/375px screenshots reviewed. Logo pixel bands were measured from a read-only asset copy outside the project; no asset generation or original-image alteration.
- Automatically saved as a checkpoint only; not published. No real calls, patient submissions, messages, bookings, charges or provider actions.

## Menopause V2 First-Free Visit and Fitness-App Removal — 2026-10-25
- Landing-page-only stage approved. Removed the full Fitness & Nutrition app section, header/footer app links, FREE BONUS pricing banner, app FAQ, app-related support cards and the two app-only testimonials. Retained four original non-app testimonials without rewriting quotations, all doctor credentials/education/history/portrait and the complete medication renderer/prices. Removed the V2-only outdated Subscription & Refunds navigation link rather than implying a required subscription; shared policy unchanged.
- Updated hero to “First visit FREE!” and “Start your free visit”; How it works now explains intake, doctor assessment by text and seven days of follow-up support. Pricing, doctor-bio line, medication introduction and FAQs distinguish the first free assessment from unlimited free care: seven days of messaging support for that visit’s care plan; new concerns/additional treatments require a separate visit. No start-time promise added before that operational detail is confirmed. Medication remains separate; no membership or long-term commitment. Mobile bar retains its design/actions/scroll gate, with only Free → First free and matching accessible label changed. Current functioning $39 video offer is retained with seven-day support; proposed $47 video and $19.99 paid-text offers/checkout implementation deferred because user requested this page only.
- Scoped layout additions balance three clinical support cards and four retained testimonials with mobile single-column layouts; all earlier CSS unchanged. Exact inverse restores the complete page, one bio line and two mobile-label edits to checkpoint 6745f1b7. Independent strict original/V2/reference parity plus new app-removal/visit-scope tests passed: 34 focused tests and all 77 relevant tests across nine suites. Final TypeScript/build, whitespace and complete changed-file scope checks passed. Provider-blocked QA at 320/375/430/767/768/1440px verified exact first-free/CTA/FAQ wording, app absence, seven-day boundaries, preserved seven GLP-1 prices/four HRT cards and toggles, intact intake destination, hidden-in-hero/visible-on-scroll bar, balanced grids and no clipping/overflow. Mobile hero/pricing and desktop clinical-card previews reviewed.
- Intake forms, all payment/checkout/server code, masterclass2, homepage/original menopause page, shared catalog and legacy interactions remain untouched. Automatically saved as a checkpoint only; not published. No real calls, patient submissions, messages, bookings, charges or provider actions.

## Masterclass2 First-Free Visit and Seven-Day Follow-Up Wording — 2026-10-25
- Applied only the confirmed wording: “Free First Doctor Visit — Text Only”; helper “Complete your intake (5–10 min), then connect with your doctor by text.” Added “Includes seven days of follow-up messaging.” beneath the unchanged Only $39 video price using the existing helper typography. Replaced unlimited-sounding ongoing-care disclosure with: “Every doctor visit includes seven days of follow-up messaging about your care plan. New concerns or additional treatments require a separate visit. Medication priced separately.” Care Team disclaimer unchanged. Mobile bar remains Text Visit / First free, Video Visit / $39 per visit, Call Now / Clinic info, with matching first-free accessible label. No $47/$19.99 offers or payment changes.
- Reversing exactly six copy edits restores the complete page byte-for-byte to checkpoint e741dc8e. Only that page, corresponding connection/mobile regressions, obsolete V2 reference-label normalization and tracker changed. V2 production files, biography/MS heading, hero/video, colors/classes/design, all links, native actions, Care Team option, safe areas, checkout/intake/backend and shared catalog unchanged. All 77 relevant tests across nine suites, TypeScript/build and whitespace/scope checks passed. Provider-blocked browser QA at 320/375/430/767/768/1440px verified exact wording, three equal-width rows, unclipped text, native destinations, first-free bar label/mobile-only visibility, preserved $39 checkout open/hide/close and paid-button focus recovery. Final mobile/desktop connection previews reviewed. New wording naturally increases text height only; no styling or spacing classes changed.
- Automatically saved as a checkpoint only; not published. No real calls, patient submissions, messages, bookings, charges or provider actions.

## Masterclass2-Only $47.99 Video Visit and Verified Checkout — 2026-10-25
- Updated masterclass2's main price, mobile price/accessibility label, checkout summary, one-time terms, PayPal/Card/Apple Pay totals and Stripe pay labels to $47.99 per visit. Existing styles, free-first text option, seven-day support, Care Team action, biography and page layout remain unchanged. Dedicated cloned client path and server router use immutable 4799 cents / 47.99 USD rather than a browser-selected amount; provider IDs, purpose, idempotency namespace, signed payment bindings and exact ledger/amount/currency verification are isolated from the original $39 path. No recurring billing, customer/vault/future-use setup or schema/settings change added.
- Original $39 checkout clients/server/tests and every V2 production file remain byte-identical. New opaque pending-storage key prevents cross-price recovery; an already-started original $39 payment on masterclass2 delegates to its unchanged original checkout instead of creating or repricing a payment. Original /thank-you-video and its $39 receipt remain unchanged. New /thank-you-video-4799 is a noindex confirmation copy with the correct $47.99 wording and the exact same calendar, styling and follow-up steps; registered once, not added to sitemap. New successful server-confirmed payments allowlist this route; old payments keep the old route. Intake/payment settings/legacy subscription flows and shared catalog untouched.
- Independent mocked server and client regressions passed 113 tests across 12 relevant suites, including original $39 and new $47.99 creation/capture/verification, non-USD and $39/$47/$47.98/underpayment rejection, forged/cross-route binding rejection before provider actions, idempotent retries, no recapture, separate provider UUID namespaces/storage, Apple Pay amount, 3DS return and legacy delegation. TypeScript/build, whitespace and protected-file checks passed. Provider-blocked browser checks at 320/375/430/767/768/1440px confirmed masterclass2's exact $47.99 price/modal terms, text fit and checkout hide/close/keyboard focus recovery. V2 still opens its $39.00 checkout; both confirmation pages show their exact amounts and unchanged booking iframe. No real payment, call, booking or patient submission occurred.
- Checkpoint only; not published. Price becomes live only if this checkpoint is explicitly published later.

## Thank-You-Video Intake Receipt and $39 Payment Gate — 2026-10-26
- Added page-only signed-intake receipt validation via the unchanged /api/intake/video/status endpoint before rendering any checkout or booking iframe. Missing, forged, expired and server-unavailable receipts never expose the calendar; absent/invalid receipts show the exact approved free-intake message and /intake/ button. Network/unknown status fails closed with retry and do-not-pay-again guidance. Only receipt-bound paid COMPLETED capture or WAIVED amount 0.00 results unlock the unchanged calendar and next steps. Paid/waived visits skip checkout entirely and refresh does not ask for another payment. Waived confirmation accurately says waiver rather than claiming a paid capture.
- Added an isolated React-owned adapter of the existing $39 intake PayPal hosted card fields, conditional Apple Pay, referral validation/submission, original pending-order recovery, exact demo environment gate and server-verified capture contracts. Root-scoped DOM controls and disposal aborts prevent writes/callbacks after unmount. No intake/thank-you, intake questionnaire, router, provider settings, payment API/server amount, webhook, shared checkout, other page or route was modified. Existing teal CSS retained byte-for-byte with payment-panel-only styles appended.
- Passed 105 focused tests across ten suites, TypeScript, production build, whitespace and protected-file scope checks. Full suite: 701 passed / 2 opt-in integrations skipped / 1 unchanged documented pre-existing imported-content LegitScript compliance failure. Provider-blocked browser QA verified completed checked/unchecked intake submissions, $39 card payment gate, eligible mocked Apple Pay amount, valid submitted waiver vs invalid code, failed capture remaining locked, pending-order recovery without creation, prior payment/no second charge, refresh, no-receipt and invalid-receipt blocking, and responsive 320/375/768/1440px fit with 56px hosted-field containers. Screenshots reviewed and archived outside the project under /home/ubuntu/thank-you-video-qa. All intake/payment/calendar provider responses in QA were synthetic; no patient submissions, messages, bookings, real charges or provider operations occurred.
- Scope caveat recorded: the current saved local intake server redirects both interest choices to /intake/thank-you/; that existing redirect was deliberately preserved. The checked-submission QA carries that successful receipt to /thank-you-video explicitly to validate the requested destination; it does not claim the current intake redirect changes automatically. As requested, this page now requires the intake receipt rather than treating unrelated masterclass/legacy payment metadata as an intake entitlement. Receipt expiry and process-local recovery limits are unchanged.
- Checkpoint only; not published.

## Thank-You-Video and Intake C/D Wording Only — 2026-10-26
- Applied the attachment's exact before-payment, secured-after-payment/waiver, scheduling, and What Happens Next wording on /thank-you-video. Preparation steps now use calendar/person/video icons with the exact Zoom-link, Patient Portal invite and Zoom-visit instructions; removed only Create Account button. Existing phone button, exploration link, receipt/pay/waiver gates, native calendar, teal styles and all checkout controls/callbacks unchanged. Same secured wording after payment or valid waiver; no unsupported claim that the time is already booked.
- Intake display branches depend only on the existing answers.videoVisitInterest===true. Selected video shows the approved $39 pricing, plan line, submit summary, submit/pending labels and Review & submission progress label; unselected keeps its original free literals exactly. Eight reversible display fragments restore the entire intake HTML to checkpoint fe1c06d5; submission, phone verification, payload, data/state handling, clinical consents, payment and redirect code untouched. The current intake already skips pricing/review screens: that flow is deliberately unchanged. Screenshots for those templates were rendered from intercepted test responses, explicitly labelled DEMO TEMPLATE PREVIEW; actual submit screenshots and held/released synthetic submissions cover both checkbox choices.
- Strict C/D, original receipt/payment/waiver, routing and client regressions passed; obsolete exact-copy assertions updated without weakening clinical/verification/navigation guards. Final full suite: 703 passed / 2 opt-in integrations skipped / 1 unchanged documented imported-content LegitScript failure. TypeScript/build, exact intake/payment-panel inverses, whitespace and full allowed-file/protected-file scope checks passed. CSS, receipt/checkout adapters, intake thank-you, App/router/backend, shared catalog/schema, $47.99 receipt, masterclass2 and V2 production files unchanged.
- Provider-blocked browser QA captured before-payment, after-payment and after-waiver confirmation; all six ticked/unticked pricing/review/actual-submit screenshots; checked exact pending labels, selected -> unselected -> selected template rerenders, no calendar before payment, unchanged iframe after completion, no repeat order on reload, and no checkout after a valid waiver. Nine screenshots plus notes are verified in /home/ubuntu/wording-c-d-qa/wording-update-screenshots.zip. No real payment, patient submission, booking, email, text, call or provider operation occurred.
- Checkpoint only; not published.

## Menopause V2 Pricing Offer Card Redesign — 2026-10-26
- Redesigned only the pricing section as one white rounded offer card on the existing soft-pink background, with a clearer heading, prominent FREE first-visit price, and three scannable benefits preserving the existing assessment/care-plan/seven-day support statement. A distinct soft-pink optional Zoom panel clearly shows only $39 per visit and its seven-day follow-up. The existing intake CTA and all follow-up/new-concern, medication-separate and no-membership/long-term-commitment wording remain intact. Two-column desktop layout stacks on mobile; no new payment action or pricing change.
- Replacing the section with its saved original restores the entire V2 page byte-for-byte to checkpoint d109f16b. Every preceding CSS rule is byte-identical; appended rules are scoped exclusively under .wlm-v2-content #pricing. Independent tests preserve original-source normalization and all established medication/clinical/FAQ/reference guards, with one new card/scope regression. Original/V2 targeted tests passed 40/40, TypeScript/build and whitespace checks passed. Provider-blocked QA at 320/375/430/768/1024/1440px verified text fit, white card, one intake destination, correct one/two-column layout, exact FREE/$39/support notes and unchanged non-pricing computed styles. Mobile/desktop section previews reviewed. All other production files, masterclass2/$47.99 path, intake, checkout, shared catalog, mobile bar, hero and doctor profile untouched.
- Checkpoint only; not published. No real patient submissions, payments, bookings, calls, messages or external provider actions.

## Masterclass2 Mobile Video Visit Intake Link — 2026-10-26
- Changed only the Video Visit control in the three-option mobile bar to a native same-tab link to https://intake.medmethoddirect.com/?video=1. Retained exact Video Visit / $47.99 per visit text, aria-label, icon, all class/style tokens and bar visibility/spacing. Text Visit and Call Now remain byte-identical. Removed only this control’s former checkout-click/dialog semantics and matched its ref type to the anchor; existing page state/recovery and main paid-row checkout remain untouched.
- Exact inverse of this native control conversion plus its ref type restores the whole page to checkpoint 3a6ef984. TypeScript/build and whitespace passed. Provider-blocked browser checks at 320/375/430/768/1440px verified exact three labels/prices/destinations, native keyboard navigation intercepted at the exact ?video=1 URL, responsive fit, desktop-hidden bar and unchanged main booking-button type. No actual intake, payment, call, message or patient submission occurred. All other production files and other pages remain unchanged.
- Checkpoint only; not published.
- Final independent regressions: 46 tests passed across eight masterclass2/V2-bar/$47.99 client suites. Native anchor versus former button computed font/color/gradient/radius/padding/dimensions/decoration comparison passed unchanged at 375px. Updated only exact native-link/ref expectations and explicit masterclass2-to-V2 action parity exception; V2’s $39 modal action remains intact.

## Masterclass2 Main Video Visit Intake Link — 2026-10-26
- Changed only the main Book My Video Visit connection row (desktop and mobile) from a checkout-trigger button to a native same-tab link to https://intake.medmethoddirect.com/?video=1, matching the previously approved floating bar. Preserved exact Book My Video Visit / Only $47.99 / Includes seven days of follow-up messaging. copy, all icons/classes/style tokens and neighboring text/care-team destinations. Existing checkout/recovery infrastructure, three-option mobile bar, other pages and payment code remain untouched.
- Replacing only this native-link row with its preceding version restores the whole page byte-for-byte to checkpoint67991662. 46 tests passed across eight related suites; TypeScript/build/whitespace passed. Provider-blocked browser checks at320/375/768/1440px confirmed exact href, retained text/price and adjacent links, identical computed button-versus-link parent/child font/color/gradient/radius/padding/shadow/dimensions/decoration, no overflow and intercepted native Enter navigation to the exact ?video=1 URL. Only page, exact main-row regression and tracker changed. No real intake, payment, call, message or patient submission.
- Checkpoint only; not published.

## V2 Combined Pricing Design Draft — Price Alignment — 2026-10-26
- Combined process/pricing design remains directly below the hero; latest refinement only balances the FREE, $29 and $97 price amounts on one right edge. Each amount is centered with its treatment label. The smaller “each” sits directly beneath $29 without shifting its numeric baseline. Uniform row padding and minimum heights retain even spacing; all prices, text, buttons, colors and other sections remain unchanged from this design draft.
- Focused V2/bar tests: 35 passed; TypeScript passed. Provider-blocked browser checks at 320/375/430/767/768/1440px passed exact values, column/label alignment, even row spacing, no collisions and no qualifier/divider overlap or overflow. Mobile pricing-card preview reviewed. Earlier combined-design tests: 107 passed and build passed. Only V2 page, V2 CSS, corresponding integration tests and this tracker are in the draft diff.
- DESIGN DRAFT ONLY — NOT PUBLISH-READY: displayed video price is $97, but the existing V2 video action still opens its unchanged $39 checkout pending the user's scope answer. No $29 checkout activated. All six new payment drafts are parked outside the project at /home/ubuntu/medmethod-direct-drafts/v2-checkout97; App, router registration, existing payments/intake and other pages match baseline. Save this draft for design review/restoration only; do not publish or describe the $97 payment flow as complete until resolved.
- Not published. No real charges, submissions, calls, bookings, messages or provider actions.

## V2 $97 Checkout Activated — 2026-10-26
- Explicitly resolves the prior design-draft warning: V2's mobile bar now shows Video Visit / $97 per visit, with matching accessible label and isolated $97.00 checkout. Combined pricing design, medication prices, Text Visit/Call Now actions, styling, scroll gate and safe areas unchanged.
- Dedicated server route uses immutable 9700 cents / 97.00 USD for PayPal, hosted cards/eligible Apple Pay and Stripe, with exact provider/ledger/currency checks, signed source/provider/payment bindings and isolated idempotency/storage. Old $39 and $47.99 paths and intake remain byte-identical; stored legacy $39 payments resume unchanged instead of being repriced or charged again. No schema, settings, customer/vault, recurring or future-charge change.
- New noindex /thank-you-video-97 is registered once, excluded from sitemap/notifications. Calendar loads only with an opaque receipt and server-paid ledger response for exactly 97.00. Direct/malformed, unpaid and wrong-price access remain blocked. Existing confirmation pages unchanged.
- Independent mocked regressions: 159 passed across 15 relevant suites. Full suite: 733 passed, 2 opt-in skipped, 1 documented pre-existing LegitScript imported-content failure. TypeScript/build and whitespace/protected-file checks passed. Provider-blocked browser QA at 320/375/430/767/768/1440px verified label/checkout/one-time price fit, visibility and hide/close/focus recovery, unchanged destinations, legacy $39 recovery, masterclass2's unchanged $47.99 price/link and paid-only calendar entitlement. Final mobile bar/checkout previews reviewed.
- Checkpoint only; not published. No real charges, provider calls, calls, bookings, messages or submissions. $29 paid-text checkout is not activated by this change.

## V2 Thin Section Dividers — 2026-10-26
- Added restrained straight 1px pink–purple–pink gradient lines with transparent ends at the How-it-works, medication pricing, doctor, support, testimonials and FAQ boundaries. Lines match the existing 1180px content maximum and 40px desktop / 28px mobile gutters; conflicting curved pseudo-elements are reset only on these V2 targets. No new bands, shadows, spacing or content changes.
- Original V2 CSS is byte-preserved before the appended block. All markup, other pages, prices, mobile bar, intake, checkout and backend remain unchanged. Updated only the existing combined-CSS slice boundary and added a pinned-baseline divider guard.
- 48 focused original/V2 tests, TypeScript, production build and whitespace checks passed. Provider-blocked browser QA at 320/375/768/1440px verified all six content-aligned 1px lines, straight/no-mask/no-shadow treatment, unchanged section geometry/padding/backgrounds, prices and intake CTA, usable FAQ and no overflow. Settled mobile/desktop screenshots reviewed outside the repository.
- Checkpoint only; not published. No real charges, submissions, calls, messages, bookings or provider actions.

## V2 Hero Supporting Copy — 2026-10-26
- Replaced only the hero supporting paragraph with bold “GLP-1s, menopause & hormone therapy.” followed by “Done right for you. 100% virtual”. Preserved existing paragraph/emphasis classes and all CSS, headlines, buttons, dividers, prices, mobile bar, checkout, intake and other pages.
- Exact inverse restores the whole V2 page to checkpoint 9b081b83; CSS remains byte-identical. Updated only the exact hero-copy regressions and the divider guard’s narrow approved-copy normalization. Independent 49 focused tests passed; TypeScript/build/whitespace passed. Provider-blocked checks at 320/375/768/1440px verified exact wording, preserved fonts/colors/spacing, fit without clipping/overflow, unchanged intake CTA and intact divider. Mobile/desktop visuals reviewed outside project.
- Checkpoint only; not published. No real submissions, charges, calls, messages, bookings or provider actions.

## V2 Hero Supporting Line Bold — 2026-10-26
- Made only “Done right for you. 100% virtual” bold using the existing b font-weight rule. Exact wording, inherited black color, size, font, spacing, first supporting line, headline, CTA, phone, dividers, prices, mobile bar, intake, payments and all other pages remain unchanged. No CSS modification.
- Exact bold-wrapper inverse restores the complete V2 page to checkpoint 01fc6439, with byte-identical CSS. Updated only the exact formatting/history tests and divider guard’s precise approved-paragraph normalization. Independent 49 focused tests passed; TypeScript/build/whitespace passed. Provider-blocked browser checks at 320/375/768/1440px confirmed weight 700 versus prior 400, unchanged font/size/color/spacing and first line, same intake CTA, no clipping/overflow. Mobile/desktop screenshots reviewed outside project.
- Checkpoint only; not published. No real charges, patient submissions, calls, messages, bookings or provider actions.

## V2 First Text Visit Follow-up Note — 2026-10-26
- Added exactly “Includes 7 days of follow-up messaging.” directly under “First text visit” as smaller 15px muted helper text. FREE remains beside the main label, matching the supplied reference; other rows and all prices, seven-day benefit panel, hero, dividers, mobile bar, checkout, intake and other pages remain unchanged.
- Single-row inverse restores the entire V2 page to ac46db89. All existing CSS is byte-preserved before the appended helper marker, with exactly two V2 How-it-works pricing rules: helper typography and first-row top alignment. Strict historic/regression pins normalize only this exact approved row and isolate the CSS append.
- 50 focused original/V2/divider/mobile-bar tests passed; TypeScript/build/whitespace passed. Provider-blocked 320/375/768/1440px browser QA verified exact helper wording/placement, smaller muted typography, FREE alignment, preserved neighboring $29/$97 row styles and no clipping/collision/overflow. Mobile/desktop pricing-card screenshots reviewed outside project.
- Checkpoint only; not published. No real charges, patient submissions, calls, messages, bookings or provider actions.

## Masterclass2 Process and Visit Pricing — 2026-10-26
- Added the approved screenshot’s complete process/pricing section immediately below the full PhysicianProfile and before the unchanged Choose How to Connect section. Includes Your doctor. One text away., three intake/text/plan steps, FREE first text visit plus exact follow-up helper, $29 each additional text visits, $97 video visit, seven-day benefit, medication/scope/no-membership notes and native Start Your Free Text Visit intake link. Desktop two-column layout stacks on mobile, with isolated white/pink/lavender styling and pink-to-purple CTA.
- Existing main Video Visit label now Only $97; existing mobile visible/accessible price now $97 per visit. Both video anchors retain exactly https://intake.medmethoddirect.com/?video=1; adjacent Text/Call actions and all other page code unchanged. Existing $47.99/$39 pending payment recovery and checkout contracts deliberately retained unchanged; no intake/payment-processing changes were authorized or made. V2 and other pages unchanged.
- Exact inverse removes only the new component import/mount and reverses three label strings to restore entire Masterclass2 page to f7c2c7e7. Strict new guards verify one placement, exact clinical/pricing copy, native CTA, unique IDs, scoped PostCSS selectors/responsiveness and byte-identical protected V2/profile/backend/intake/payment source. Main 115 tests across 14 suites passed; independent expanded related run 130 tests passed. TypeScript/build/whitespace passed. Provider-blocked 320/375/768/1024/1440px browser QA verified section placement/copy/amount alignment/stacking, no clipping/overflow, unchanged existing-section computed styling and mobile bar, exact $97 labels and intercepted native keyboard destinations. Mobile/desktop visuals reviewed outside project; no uploaded reference reopened.
- Checkpoint only; not published. No real charges, patient submissions, calls, messages, bookings or provider actions.

## Masterclass2 Credential Badge — 2026-10-26
- Changed only the first credential pill from “Board-Certified DO” to the confirmed “Board-Certified Family Physician” in the isolated Masterclass2 PhysicianProfile. All classes, colors, fonts, padding, other credentials, bio, prices, links, layout code, intake and payment behavior unchanged; homepage/original/V2 untouched.
- Exact single-literal inverse restores the full profile to checkpoint 75d55770. Updated only two strict regression guards to normalize that exact approved literal, retaining complete-profile equality and all protected-source/history pins. All 39 tests across seven Masterclass2 suites, TypeScript/build/whitespace passed. Provider-blocked 320/375/768/1440px browser checks confirmed exact label once, original computed badge styling, clean wrapping/no clipping or overflow, retained five other pills and $97 video label. Mobile/desktop views reviewed outside project.
- Checkpoint only; not published. No real charges, patient submissions, calls, messages, bookings or provider actions.

## Masterclass2 Short Credential Badge — 2026-10-26
- Shortened only the first credential pill to the confirmed “Family Physician”, replacing “Board-Certified Family Physician”. Retained all existing classes, font, colors, border, padding, five other pills, biography, prices, links, payment/intake behavior and other pages.
- Exact single-literal inverse restores the complete profile to e4960372. Two affected regressions retain immediate/historical full-profile equality and all other protected-source guards. All 39 tests across seven Masterclass2 suites, TypeScript/build/whitespace passed. Provider-blocked 320/375/768/1440px browser QA confirmed the exact shorter badge once, narrower width, identical styling, retained neighboring pills and no clipping/overflow.
- Automatically saved checkpoint only; not published. No real charges, submissions, calls, messages, bookings or provider actions.

## V2 Family Physician Credential Badge — 2026-10-26
- Replaced only the first V2 credential pill “Board-Certified DO” with confirmed “Family Physician”. All classes, styling, portrait, five neighboring credentials, clinical intro/full bio, prices, dividers, links, mobile bar and checkout/intake behavior unchanged. Masterclass2/homepage/original pages untouched.
- Exact single-literal inverse restores the complete V2 biography to d587bc75. Updated only three affected regression guards, retaining exact new-label assertions, full-biography equality, normalized homepage credential parity and historical protected-source pins. All 89 tests across eleven original/V2/Masterclass2 suites, TypeScript/build/whitespace passed. Provider-blocked 320/375/768/1440px browser checks verified exact shorter badge once, narrower width, identical computed styling, retained other pills/clinical intro/FREE-$29-$97 prices and no clipping/overflow.
- Automatically saved checkpoint only; not published. No real charges, submissions, calls, messages, bookings or provider actions.

## Weight-loss Intake Landing Visit-Pricing Copy — 2026-10-27
- Updated /weight-loss-intake only to the approved first text visit FREE with 7 days of follow-up messaging, additional text visits $29 each, video visits $97, and medication extra. Updated exact hero/pricing/FAQ wording and other text terminology; removed stale language also from description metadata and the already-hidden archived review (only deleted its word “ongoing”; no new testimonial claims).
- No design, CSS, scripts, buttons, links, medication cards/catalog/prices, intake, checkout/payment, routing or other production pages changed. Exact baseline-forward comparison to 83a2d916 allows only the 12 ordered copy replacements. Source and full rendered DOM have zero case-insensitive matches for $39, ongoing, per visit and secure text.
- All 56 tests across eight landing-page suites, TypeScript/build/whitespace passed. Provider-blocked baseline comparison at 320/375/768/1440px verified exact new hero/heading/expanded FAQ copy, identical control markup/computed styling, seven identical rendered medication cards, unchanged text styles and no clipping/overflow.
- Saved checkpoint only; not published. No real charges, submissions, bookings, calls, messages or provider actions.

## Intake Single-Screen Introduction and $97 Video Model — 2026-10-27
- Replaced the start and Weight Care overview with one teal introduction: exact approved journey, FREE first text visit, 7 days of follow-up, $29 additional text visits, $97 video, medication extra, unchecked optional video selection, conditional CTA, helper and fine print. Scoped CTA stacking and spacing only to the new introduction; retained existing teal colors/fonts, clinical questions, phone/consent/submission payloads and medication prices/catalog.
- Updated intake, intake thank-you and thank-you-video copy/client/Apple Pay totals plus server verification to immutable 97.00 USD. Normal checked submissions route to /thank-you-video; unchecked route to /intake/thank-you/ and can still add a video visit later. Explicit approved sandbox demo routing remains isolated. Signed delivered receipt and verified paid/waived gate remain required before calendar, including refresh/no-repeat-payment recovery.
- Historical v2 payment approvals can reconcile an already-completed original payment only; never create/capture a retired-price order, silently reprice, or duplicate payment. Retained the named 39.00 historical constant and strict recovery code/tests, not current checkout copy. Source search across all six current intake frontend files: zero matches for all seven requested retired terms. Project-wide search still finds required legacy tests/history/unrelated offers; clinical uses of ongoing vomiting/ongoing medication use are unchanged.
- Full suite: 750 passed, 2 opt-in skipped, 1 unchanged pre-existing LegitScript imported-content failure. TypeScript, production build and whitespace passed. Provider-blocked 320/375/768/1440px browser QA covered exact copy/default/conditional labels, CTA/helper/fine-print order, both synthetic routing paths, $97 payment/calendar gates, failed capture, direct access, waiver, Apple Pay and no repeat payment. Four mobile/desktop checked/unchecked screenshots saved outside repository at /home/ubuntu/intake97-screenshots/.
- Unrelated landing pages, V2/Masterclass2, shared catalog, App/router registrations, existing other-priced checkout routes and thank-you-video teal stylesheet are byte-identical to 7080fa2c. Saved checkpoint only; not published. No real submissions, charges, webhook deliveries, bookings, calls or provider actions.

## Masterclass Route Swap with Approved Tracking/Bank-Return Exceptions — 2026-10-28
- Swapped only App route component assignments: /masterclass now loads existing Masterclass2; /masterclass2 now loads existing MasterclassVideoFirst. Neither page copied or renamed. Updated only each page's canonical and explicit og:url. Titles/descriptions and all visible content, design, styles, videos, profiles, forms, prices, buttons and destinations—including intake.medmethoddirect.com and ?video=1—are unchanged.
- Completed read-only hard-coded-reference audit and obtained explicit approval before edits. Approved narrow exceptions move the original page's Pixel installer/deduplication and server noscript target to /masterclass2, retaining Pixel ID/event code, and move retained Masterclass2 Stripe bank returns to /masterclass. Shared legacy Stripe return changes only when invoked on /masterclass (including trailing slash); other consumers keep their exact legacy fallback. Existing server route metadata already matches public paths and remains unchanged apart from the noscript condition.
- Preserved established /masterclass and /masterclass2 payment attribution/source contracts, storage/API identities, amounts, Apple Pay eligibility checks, GHL payload source, all thank-you/receipt gates and redirects, shared GTM/other tracking code, V2/intake/all other page sources, and both routes' existing social-proof suppression. Exact baseline bd30bdec inverse guards enforce the entire seven-file production delta and protected-file parity; no global replacement.
- All 117 focused tests across 13 suites passed; full suite 757 passed, 2 skipped, only the previously documented unrelated LegitScript imported-content assertion failed. TypeScript, production build, whitespace and exact 14-file checkpoint scope passed.
- Safe mobile/desktop browser comparisons at 375/1440px proved exact pre/post swapped page DOM, rendered styles, video URL, link destinations, title/description, correct React/server canonical+OG, relocated Pixel/noscript, unchanged GTM, and no overflow. Verified intercepted external video-intake navigation and original consultation form on the new paths. Eight mocked legacy/$47.99 recovery cases across PayPal/Stripe and confirming/provider-approved phases preserved same-provider verification, failed-confirmation safety, no new checkout and original receipt destinations. Evaluated actual bank-return expressions including unaffected non-Masterclass fallback. Screenshots reviewed and saved outside project in /home/ubuntu/masterclass-route-swap-screenshots/; embedded video preview rendered without playback.
- Saved checkpoint only; not published. No real charges, patient submissions, webhook deliveries, bookings, calls or conversion/tracking events were sent by QA. No DNS/domain changes.

## V2 Final-Document FAQ and Footer — 2026-10-27
- Replaced only /weight-loss-menopauseV2 FAQ with all 44 owner-supplied questions and answers verbatim from WeightLoss^0MenopauseFAQ–Final2.docx, preserving exact wording/punctuation/document order in categories Cost/Visits/Weight loss/Menopause/Both/Safety (9/7/11/7/3/7). Independent Word XML extraction fixture verifies every production question/answer plus closing/footer exactly; no rewritten or added questions.
- Cost initially selected, first three questions visible per category, Show all [count] questions/Show fewer reveal-hide remaining items; all 44 remain mounted in category panels. Native details defaults open Cost's free-first/monthly-cost questions and Visits' video-appointment question. Accessible single-row horizontally scrolling chips with keyboard navigation, six exact category CTAs, exact requested left-column subhead and desktop CTA bounded to the question column, and final Still have questions block with exact document text/large CTA/small tap-to-call link. All new CTAs use existing external intake URL.
- Replaced only specified prototype footer disclosures/copyright with exact New footer, including Arizona, Colorado, District of Columbia, Florida, Georgia, Illinois, Maryland, Michigan, North Carolina, Pennsylvania, Texas, Virginia and © 2026 MedMethod Direct. All rights reserved. Existing footer wordmark, navigation, phone, legal links/seal and style remain unchanged. Existing entire V2 CSS byte-identical; new controls use #faq-scoped CSS and current colors/fonts/button/accordion treatment. Every other page/section, hero, biography, medication prices/catalog, privacy band, mobile bar, payment/intake/router/tracking remains untouched.
- Provider-blocked 320/375/768/1440px browser QA confirmed all 44 DOM questions/answers equal the exact source, counts/order/defaults, all six show-all/fewer controls, native question toggles, keyboard chips, one visible category, sideways mobile row, desktop bounded CTA, exact closing/footer, intercepted intake destination, and no overflow/runtime errors. Pre/post snapshots prove identical non-FAQ section DOM/styles, header, and retained footer controls. Requested mobile/desktop chips, Cost three/two-open, expanded Weight loss eleven, and footer screenshots verified outside repository at /home/ubuntu/v2-final-faq-screenshots/. Screenshot-only header/bar overlays hidden temporarily for unobstructed captures, restored afterward; production behavior unchanged.
- Focused 64 tests/6 suites passed; final FAQ/masterclass parity 11 tests/2 suites passed. Full suite 762 passed, 2 opt-in skipped, only the known unrelated pre-existing LegitScript imported-content assertion failed. TypeScript, production build, exact 11-file scope, fixture validation and whitespace passed. Baseline7ed813a6 inverse enforces FAQ/import/footer-only page delta. Saved checkpoint only; not published. No real submissions, charges, bookings, calls, webhooks or tracking/conversion events.

## V2 Mobile FAQ Chip Grid — 2026-10-27
- Confirmed mobile-only update: at widths <=767px, FAQ chips now occupy a three-column/two-row grid in unchanged document order: Cost / Visits / Weight loss, then Menopause / Both / Safety. Equal-width 44px-high pills, centered full labels, no sideways scrolling or fade. Retained all preceding CSS bytes, colors/fonts/borders/radii, purple selected state and current static/sticky behavior; >=768px original desktop/tablet row unchanged. Only appended #faq-scoped media-query layout rules; FAQ component/data/44 exact questions/defaults/CTA/footer/page and all other production sources untouched.
- Provider-blocked browser checks at320/375/430/767/768/900/1440 verified six full labels, exact requested two rows, equal cell dimensions, no clipping/horizontal overflow, original styles and desktop computed geometry, unchanged DOM/non-chip text styles, category selection/purple fill, keyboard navigation and Cost3shown/2open. Mobile375 screenshot reviewed outside project at /home/ubuntu/v2-faq-mobile-grid-screenshots/mobile-grid-375.png; capture-only header/bar visibility temporarily hidden and restored; keyboard focus blurred for natural tap-state appearance.
- New narrow regression guards exact94e43fdc stylesheet prefix, append/scope, ordered immutable category labels/default Cost, and allotherproduction parity.49 focused tests/5 suites, TypeScript/build/whitespace and exact3-file scope passed. Automatically saved checkpoint only; not published. No real submissions, payments, calls, bookings, webhooks or conversion events.

## Masterclass Final FAQ Copy — 2026-10-27
- Added only a new FAQ directly above the existing footer on /masterclass (Masterclass2 component after approved route swap), with all44 exact V2 questions/answers in6categories9/7/11/7/3/7. Reuses unchanged read-only V2 FAQ data/left-subhead/closing text; no duplication or rewriting. Native accordions, first3visible/category, Cost default with cost0/2open and Visits0open, Show all [count]/Show fewer, six category CTAs, sticky desktop leftCTA, and final Still have questions block/largeCTA/small (888)362-7011 tap-to-call link. Every FAQ Start link matches main Start Your Free Text Visit URL https://intake.medmethoddirect.com/.
- Masterclass-only component/CSS match existing Montserrat/pink-purple palette. Chips one row >=768px, equal3columns/2rows<=767px. Dark #463b46 answers at17px. Bounded chip pinning below actual fixed/sticky header and desktopCTA pinning avoid existing article overflow clipping without altering article/layout. Show fewer scrolls back to category title below chips/header, including reduced-motion handling. Existing V2 files remain byte-identical40e49baf; no V2 updates attempted. Masterclass page inverse removes exactly one import and one FAQ mount to restore full baseline; hero/video/profile/process/booking/footer/mobilebar/payments/links/metadata/tracking and all otherpages untouched.
- Provider-blocked browser QA320/375/768/1024/1440 verified44exactQ&A/categorycounts/order/defaults, allshowall/fewer/title-scroll, exactexistingintakehref/closingphone, dark17pxreadability, mobilefull-labelgrid/desktoprow, stickychips/desktopCTA and64pxsimulatedheaderclearance, keyboard/nativecontrols, nooverflow/runtimeerrors, and identical pre/post entireexistingmainDOM+sectionstyles withnewFAQremoved. Six requested chips/Cost/Stillhavequestions mobile375 anddesktop1440screenshots reviewed/verified outsideproject /home/ubuntu/masterclass-final-faq-screenshots/. Capture-only mobilebarvisibility temporarilyhidden/restored.
- Independent focused31tests/5suites passed; fullsuite only the known pre-existing unrelated LegitScript content assertion failed, with no newFAQ/parity failures. TypeScript/build/whitespace and exact9-file scope passed. Newtests pin allV2productionfiles, exactcopyfixture, requestedbehavior/scopedstyles, and routing/payment sources; historicalguards normalize only approvedFAQimport/mount. Automatically saved checkpoint only; not published. No realsubmissions/payments/calls/bookings/webhooks or conversionevents.

## Masterclass LegitScript Footer Seal — 2026-10-27
- Added only the existing hosted LegitScript certified seal beneath the unchanged /masterclass footer text. Reused /manus-storage/legitscript-certified-seal-51795425_51edddb5.png and existing verification URL/title/alt, with target=_blank and rel=noopener noreferrer. Centered badge with61px mobile/73px sm+object-contain sizing, native73x79dimensions, eager/async loading and purple keyboard focus outline. No new assets, CSS, imports, claims, or other footer/page edits.
- Exact uniquely marked19-line insertion inverse restores Masterclass2.tsx to ea6bf90f. Entire FAQ/44questions/component/CSS, allV2sources, otherMasterclasssections/links/colors/fonts/footertext/logo/phone, mobilebar, routing/metadata/tracking/intake/payment code and allotherpages unchanged. Historical regression guards normalize only this specific badge block, preserving original assets and other protections.
- Provider-blocked320/375/768/1440 browser QA confirmed real hosted image loaded, centered clear fit/no clipping or overflow, intact verification href/title/alt/target/rel, keyboard focus, and exact pre/post originalmainDOMandcomputedstyleparity withsealremoved. Mobile/desktopfooter screenshots reviewed in/tmp only; capture-onlymobilebarvisibility restored.35focusedtests/6suites, TypeScript/build/whitespace and exact8-filescope passed. Fullsuite retains only the documented pre-existing unrelated prohibited-content LegitScript assertion. Saved checkpoint only; notpublished. No real submissions, payments, bookings, calls, webhooks or conversionevents.

## Masterclass Small FAQ, Mobile and Footer Fixes — 2026-10-27
- Applied only the four directly approved /masterclass fixes: show-all/fewer button is rendered only for categories with more than3questions (Both stillshowsall3andcategoryCTA); mobile<=767px main bottompadding increased112->144px+safe-area; footer adds the exact2unchangedV2disclaimerparagraphs covering compounded medication notFDAapproved/clinicalappropriateness/risks and adults18+/12states/emergency911; stickyVideoVisitprice/accessiblename now$97withoutpervisit. Preserved existingtwo-linebarlayout, icons/style/intake?video=1link, othercontrols andprices.
- Footer reuses read-only V2_FAQ_FOOTER_PARAGRAPHS, retaining existing footer logo/phone/disclaimer/LegitScriptseal. FAQ change is an exact2-lineconditionalwrapper around unchangedbutton; all44questions/answers/categories/defaults/show-fewer-scroll/CTAs/style/stickybehavior unchanged. V2data/allV2productionfiles and MasterclassFAQCSS byte-identical15da38f3. Only Masterclass2.tsx/FinalFaq.tsx productionfileschanged; strictapprovedinverseguardsrestorefullbaseline. No intake/payments/routing/tracking/meta/otherpages changed.
- Provider-blocked320/375/430/767/768/1440QA confirmed exact44Q&Afixture, noBothshowall/allotherfivecategoryexpansionandshowfewertitlescroll, exactdisclaimertext, unchangedotherDOM/styles/links, mobile144pxpadding/footerabout50pxabovebaratpageend, closingblockclearance, simulated24pxsafearea, desktopunchangedpadding/barhidden, nooverflow/runtimeerrors. MobileBoth/footeranddesktopfooter screenshotsreviewedin/tmp only. TypeScript/build/whitespace and74focusedtests/12suitespassed; fullsuite retains onlyknownunrelatedpre-existingLegitScriptprohibited-contentfailure. Exactcheckpointscopevalidated. Saved checkpoint only; notpublished. No realsubmissions/charges/bookings/calls/webhooks/conversionevents.

## V2 Hero Headline — Homepage Font Match — 2026-10-27
- Applied the explicitly confirmed font-only change to /weight-loss-menopauseV2: the main hero headline now uses Montserrat at weight 900, matching the actual homepage hero h1. Added only a six-line terminal CSS block scoped to .wlm-v2-content .hero[data-medmethod-scope] h1. Every preceding stylesheet byte remains identical to c8783393. Existing headline markup/wording, font sizes, line heights, letter spacing, colors/gradient, underline, custom masked ampersand, spacing rules, phone, buttons and links unchanged. Natural text widths/wrapping follow the new font; no sizing or layout rules adjusted.
- Read-only homepage/global-font source checks confirm Montserrat 900 is already loaded and the homepage uses the same family/weight. Provider-blocked browser comparisons at 320/375/430/768/1024/1440 confirmed exact homepage font match, unchanged headline text/markup/non-font styles and non-headline typography, no clipping or overflow. Mobile/desktop hero screenshots reviewed outside the repository in /tmp; final mobile capture starts at page top to avoid the fixed header overlay. No source-header changes.
- Only V2 CSS is changed in production. Homepage, V2 JSX/content, all FAQ/data, other pages, shared fonts/styles, intake, checkout, prices, routing and tracking are unchanged. New font-only regression pins the exact baseline prefix/append and scope; historical guards normalize only that precise CSS append. 71 focused tests across 9 suites, TypeScript, production build and whitespace passed; full suite retains only the known unrelated pre-existing LegitScript prohibited-content assertion. Exact checkpoint file scope verified. Automatically saved checkpoint only; not published. No real submissions, payments, bookings, calls, webhooks or conversion events.

## V2 Desktop Hero — Restrained Headline Sizing — 2026-10-27
- Applied the explicitly confirmed desktop-only hero refinement on /weight-loss-menopauseV2. Appended only a seven-line @media(min-width:1025px) block setting the scoped h1 font-size to clamp(36px,3vw,50px). The existing 1.22em First visit FREE line scales with it. Entire preceding stylesheet remains byte-identical to120cf596; all<=1024px mobile/tablet styles are untouched. No changes to Montserrat900 family/weight, wording/markup, colors/gradient, line-height/letter-spacing rules, underline, custom ampersand, phone, CTA/links, padding or grid/alignment rules.
- Provider-blocked QA at320/375/430/768/900/1024 confirmed exact baseline DOM/computed styles/geometry. At1025/1280/1366/1440/1536/1920/2560, the main headline fits two lines and First visit FREE stays on one line; headline size remains36–50px and text/phone columns are vertically centered within1px. Other hero styles, phone, button, supporting text and downstream sections unchanged; the hero’s natural content height can shrink with the smaller headline. No overflow or runtime errors.1440/1920desktop screenshots reviewed outside repository in/tmp.
- Only V2 CSS is changed in production. New desktop-only regression pins the exact baseline prefix/one-property terminal append; prior font test and historical guards preserve their checks while normalizing only this precise sizing append.39focusedtests/8suites, TypeScript/build/whitespace and exact checkpoint scope passed. Full suite:790tests passed,2opt-in skipped, only the known unrelated pre-existing LegitScript prohibited-content failure. V2 FAQ, other pages, intake/payment/prices/routing/tracking remain unchanged. Automatically saved checkpoint only; not published. No real submissions, charges, bookings, calls, webhooks or conversion events.

## V2 UI Audit — Three Approved Priority Fixes — 2026-10-27
- Applied only the three priority fixes explicitly approved after the read-only UI audit. Appended a901–1024px V2-only hero rule using the existing restrained clamp(36px,3vw,50px), so the two-column hero is36px on both sides of1024/1025px without changing<=900px or>=1025px typography. Appended only .doctor-bio-book color#7A1E7E, improving the existing book-title strong from3.89:1 to9.07:1 contrast. Appended aV2 FAQ answer-only font-size:17px rule; existing answer color and1.6leading retained. Entire baseline62bec055prefix of both CSSfiles remains byte-identical.
- All44FAQ questions/answers, chips/defaults/expansion/links/leftCTA/closingblock and every page markup, medication price, image, button, intake/payment/checkout/routing/tracking file remain unchanged. Did not apply lower-priority fine-print, Featured In, small-control or footer polish suggestions. Only two production CSSfiles changed; new exact-prefix/scope regression and eight historical guards normalize only the precise appends on their correct paths.
- Provider-blocked responsive QA passed at320/375/430/768/900/901/960/1024/1025/1280/1440/1920. All44answers were individually rendered and measured at17px with exactcopy/link parity; snapshot comparisons confirmed non-target styles unchanged. No overflow/runtime errors. Axe reported zero violations in the tested rule set at375/1440; this is not full accessibility certification. Fresh-page screenshots confirmed preserved14px mobile FAQ gutters, readable answers/defaults and dark-purple book highlight;901/1024hero reviewed. No real provider, payment, booking, intake, call, webhook or conversion action occurred.
- Final44tests across9affected suites, TypeScript, production build and whitespace checks passed. Full suite retains only the documented unrelated pre-existing LegitScript prohibited-content failure. Exact12-file checkpoint scope verified; screenshots/scripts remain outside repo. Saved checkpoint only; not published.

## Masterclass + V2 FAQ — Consistent First Three Answers Open — 2026-10-28
- Applied the expressly authorized FAQ-behavior-only change on /masterclass and /weight-loss-menopauseV2. Both components derive all18 default-open IDs from the first3items in each of6categories. Mouse/keyboard category selection and active-chip reselection reset that category to three shown/open answers, with later questions hidden/collapsed. Native manual open/close remains available; Show all/Show fewer resets only later-question state, so newly revealed questions are collapsed and first-three manual choices are retained while browsing. Both already had three questions; its redundant Show all is now suppressed on V2 as well as Masterclass. Existing Masterclass show-fewer scroll/sticky-header/chip/CTA logic unchanged.
- All44exact questions/answers, category order/labels, fonts/colors/CSS/layout, CTA text/URLs, phone link, footer, other page sections/routes and all intake/payment/medication/tracking code remain unchanged. Only the two isolated FAQ component TSXfiles changed in production. New strict baseline9c65e262 inverse/scope/behavior test and eight historical guards cover only the precise approved component edits.
- Provider-blocked browser QA passed both routes at320/375/768/1440, with identical category/default/reset states across the two pages: all6first-three-open defaults, initially hidden extras, collapsed extras after every reveal, manual toggles, switch-away/back and active-chip reset, keyboard arrows/Home/End, reload and Both button absence.44word-for-wordQ&A per page confirmed; no overflow/runtime errors. FAQ controls centered above the unchanged sticky bar for native tap checks; no provider calls, charges, submissions, bookings, webhooks or conversion actions. Captured6categories at375/1440 onV2 outside the repo; desktop category screenshots reviewed, all12image files complete.
- Focused36tests/7suites, TypeScript and production build/whitespace passed. Fullsuite800passed/2opt-in skipped and only the known unrelated pre-existing LegitScript prohibited-content failure. Exact12-file checkpoint scope verified. Save checkpoint only; do not publish.

## V2 Credential Pill — Menopause Certified (MSCP) — 2026-10-28
- Added the explicitly approved "Menopause Certified (MSCP)" credential immediately after "Family Physician" on /weight-loss-menopauseV2 only. Existing six pills remain intact and in order. Reused the current pill markup and styling; no certificate photograph, extra biography/training copy, heading change or asset was added. Removing the single new credential literal restores the entire biography exactly to46eba676.
- Only production change: one CREDENTIALS-array line in WeightLossMenopauseV2DoctorBio.tsx. All CSS/colors/fonts, other V2 content,44FAQ questions and latest behavior, Masterclass/homepage/original pages, prices/buttons/links, routes/intake/payment/tracking remain unchanged. New exact-order/single-literal-inverse/whole-project-production-scope guard plus path-specific historical test normalizations preserve earlier approvals.
-192relevant tests across28suites, TypeScript, production build and whitespace passed. Provider-blocked browser checks at320/375/430/768/1440 confirmed exact seven-pill order, same font/color/padding/border/radius, fully readable label without clipping/overflow, retained headings/intro/FREE-$29-$97 rates and44FAQ items. Mobile/desktop badge screenshots reviewed outside the repo; no real provider, intake, payment, booking, call, webhook or conversion actions.
- Final intended file scope verified: one production biography file,13regression files and tracker. Automatically save checkpoint only; do not publish.

## Masterclass Credential Pill — Menopause Certified (MSCP) — 2026-10-28
- Added only the explicitly approved "Menopause Certified (MSCP)" pill immediately after "Family Physician" in the /masterclass physician credentials. Retained every former pill and its order, existing pink-purple badge classes/styles, heading, biography, training and all other Masterclass sections. One inserted CREDENTIAL_PILLS-array line in the isolated PhysicianProfile.tsx is the only production diff; removing that exact line restores the entire profile toad683186.
- /weight-loss-menopauseV2 remains byte-identical, including its existing MSCP badge,44FAQ questions and latest behavior. Masterclass44FAQ wording/defaults/sticky controls, prices/buttons/intake and?video=1URLs, footer, payment/routing/tracking and all other pages/styles are unchanged. Exact seven-pill/order/line-inverse/other-production scope test plus narrow path-specific historical guard updates preserve all prior approved changes.
-195relevant tests across29suites, TypeScript, production build and whitespace passed. Provider-blocked320/375/430/768/1440browser QA confirmed full readable label, correct second position, unchanged former pill styling, no clipping/overflow/runtime errors, exact retained heading/intro,44FAQ items withCostfirst3open, text/video intake URLs. Mobile/desktop badge screenshots outside project reviewed. No real provider, intake, payment, booking, call, webhook or conversion action.
- Intended production/test/tracker scope verified. Automatically save checkpoint only; do not publish.

## Main Homepage Credential Pill — Menopause Certified (MSCP) — 2026-10-28
- Added the explicitly approved "Menopause Certified (MSCP)" pill immediately after the existing "Board-Certified DO" pill on the main homepage only. All previous labels and current pink-purple pill styling remain intact. Used a default-false showMscpCredential prop in the shared home1/MedicalTeam component, enabled only by HomeHrt3; the shared /lp/hrt3 consumer retains its original six credentials. No content was copied or shared defaults modified.
- Exact inverse of the homepage flag plus four small component fragments restores both full source files toede96ffe. All homepage copy, heading, photo, bio/training, styles, price/payment/booking actions, metadata and other sections remain unchanged. LpHrt3, V2 including its MSCP badge/44FAQ behavior, Masterclass including its MSCP badge/44FAQ behavior and all other production files remain byte-identical.
-228relevant tests across38suites, TypeScript, production build and whitespace passed. New default-six/opt-in-second-pill/root-only/exact-two-file-inverse/other-production-scope regression plus nine precise historical guards preserve prior approvals. Provider-blocked root and /lp/hrt3 QA at320/375/430/768/1440 confirmed homepage7pills/newsecond/style parity/readable fit, sharedconsumer6pills/noMSCP, retained homepage CTAs and no clipping/overflow/runtime errors. Main mobile/desktop badge screenshots reviewed outside repo. No real provider, intake, payment, booking, call, webhook or conversion action.
- Exact production/test/tracker checkpoint scope verified. Automatically save checkpoint only; do not publish.

## V2 Doctor Heading — MSCP Credential — 2026-10-29
- Changed only the approved V2 doctor h2 to "Meet Dr. Jumana Al-Deek, DO, MS, MSCP". Preserved the heading element/id, font, size, weight, colors and spacing. Exact one-H2 inverse restores the full biography source to de623f2d; existing portrait alts, seven credential pills, education, biography and all other page/FAQ/pricing/payment/route/tracking content remain untouched. Homepage, Masterclass and all other production files are unchanged.
- 229 relevant tests across 38 suites, TypeScript, production build and whitespace passed. Exact heading/count/one-H2 inverse/all-production parity/unchanged-alt regression and narrow historical guard updates preserve prior approved changes. Provider-blocked 320/375/430/768/1440 browser checks confirmed full heading, unchanged typography, readable fit, seven original pills, intro, portrait alts, FREE/$29/$97 prices and all 44 FAQ items, with no clipping, overflow or runtime errors. Mobile/desktop heading screenshots outside project reviewed. No provider calls, charges, patient submissions, bookings, phone calls or conversion actions.
- Exact one-production-file, 16-test-file and tracker scope verified. Save checkpoint only; do not publish.
