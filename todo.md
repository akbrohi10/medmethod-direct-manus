# Testimonial Update Task

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
