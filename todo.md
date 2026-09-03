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
