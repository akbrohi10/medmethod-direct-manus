# MedMethod Direct → Replit Migration Runbook

**Author:** Manus AI  
**Scope:** Code, empty database structure, public marketing assets, configuration template, and operational setup. **No live patient, payment, admin-credential, or production database records are included.**

For a ready-to-paste Replit Agent prompt and a shorter ordered checklist, start with [`REPLIT_AGENT_PROMPT.md`](./REPLIT_AGENT_PROMPT.md).

## 1. What this package contains

| Item | Location | Contains live data? |
|---|---|---:|
| Application code | GitHub repository | No database records |
| Empty MySQL schema | `migration/replit/schema.mysql.sql` | No |
| Replit configuration | `.replit` | No |
| Secret-name template | `migration/replit/.env.replit.example` | No secret values |
| Public asset installer | `migration/replit/install-assets.sh` | No |
| Public image archive | Delivered separately as `medmethod-public-assets.zip` | Public marketing assets only |
| Large video archive | Delivered separately as `medmethod-large-video.zip` | Public marketing video only |
| Integrity hashes | `SHA256SUMS.txt` delivered with the archives | No |

The project has six database tables: `users`, `stripe_settings`, `payments`, `super_admin_credentials`, `payment_webhook_log`, and `paypal_settings`. The supplied SQL creates those tables empty.

## 2. Database decision

Replit's current built-in database is PostgreSQL 16, while MedMethod Direct uses Drizzle's MySQL driver, MySQL enums, and a MySQL/TiDB schema. Replit documents its current database as PostgreSQL, so it is not a drop-in replacement for this code.[1]

| Approach | Tradeoffs | Cost | Setup complexity |
|---|---|---:|---:|
| **External MySQL 8/TiDB database** | Preserves the current code and schema; requires a separate database provider | Provider-dependent | Medium |
| Convert the application to Replit PostgreSQL | Uses Replit's built-in database but requires schema, query, migration, and payment-flow retesting | Replit usage-based database cost | High |

This package follows the **external MySQL 8/TiDB** approach because it minimizes application changes and payment risk.

## 3. Security boundary

The approved migration scope is empty tables/test data only. Do not import production patient or payment records into Replit unless MedMethod Direct has independently confirmed a HIPAA-compliant environment and appropriate BAA. HHS states that a cloud provider creating, receiving, maintaining, or transmitting ePHI on behalf of a covered entity must be covered by a HIPAA-compliant business associate agreement.[2]

> **Do not place database passwords, Stripe/PayPal keys, webhook secrets, or admin passwords in GitHub.** Replit's Secrets tool exposes encrypted values to the app as environment variables.[3]

## 4. Import the repository

Import the connected GitHub repository into a new private Replit App. Replit reads `.replit` for the development run command and production build/run commands.[4]

After import, open the Shell and run:

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm test
```

Do not publish yet.

## 5. Create the empty MySQL database

Provision a new, empty MySQL 8-compatible or TiDB database with TLS enabled. Do not point the Replit development copy at the Manus production database.

Import the schema using the provider's SQL console or MySQL client:

```bash
mysql --ssl-mode=REQUIRED -h HOST -u USER -p DATABASE < migration/replit/schema.mysql.sql
```

Confirm that all six tables exist and contain zero rows. Then add the new connection string to Replit Secrets as `DATABASE_URL`.

## 6. Add Replit Secrets

Use `migration/replit/.env.replit.example` as the key checklist. Add values through the Replit **Secrets** panel, not through a committed `.env` file. Replit documents Secrets as encrypted environment variables intended for API keys, tokens, and database connection strings.[3]

At minimum, configure:

| Secret | Purpose |
|---|---|
| `DATABASE_URL` | New empty MySQL database |
| `JWT_SECRET` | New random session-signing secret |
| `LOCAL_ASSET_MODE=true` | Serve migrated files locally instead of using Manus Forge |
| `DISABLE_MANUS_HEARTBEAT=true` | Prevent Manus-specific cron registration |
| `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` | One-time admin seed values |
| `STRIPE_WEBHOOK_SECRET` | Replit test webhook signing secret |
| `GHL_PAYMENT_WEBHOOK_URL` | Outbound GHL payment destination |
| `GHL_WL2_INTAKE_WEBHOOK_URL` | Outbound WL2 intake destination |

Keep Stripe in **test mode** and PayPal in **sandbox mode** until the full migration checklist passes.

## 7. Install public assets

Upload `medmethod-public-assets.zip`, `medmethod-large-video.zip`, and `SHA256SUMS.txt` to the Replit project temporarily. Verify them:

```bash
sha256sum -c SHA256SUMS.txt
bash migration/replit/install-assets.sh medmethod-public-assets.zip medmethod-large-video.zip
```

The installer places files under `client/public/manus-storage/`. Existing `/manus-storage/<filename>` references will therefore continue working when `LOCAL_ASSET_MODE=true`.

The large video archive contains a roughly 446 MiB consultation video. For long-term production, moving that file to dedicated object storage/CDN is preferable to bundling it into every application deployment. If moved, update the single reference in `client/src/components/home1/ConsultationModal.tsx`.

After extraction, delete the ZIP files from the Replit project so they are not included in every build.

## 8. Build and seed the new admin

```bash
pnpm build
pnpm admin:seed
```

The seed command hashes the password and creates or updates the direct super-admin credential. Remove `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` from Replit Secrets after the seed succeeds. Never copy the existing production password hash or credential table into this test environment.

## 9. Authentication differences

The public website and direct `/admin/login` flow can run on Replit. Manus OAuth is Manus-specific and will not operate as a portable identity service without a replacement. Patient Login links to the external patient portal and is unaffected.

For this schema-only migration, use the direct super-admin login and leave Manus OAuth variables empty. If general website-user accounts are later required, implement a new identity provider before production cutover.

## 10. Webhooks and integrations

Create provider-side **test** webhooks using the Replit preview/deployment URL:

| Integration | Endpoint/action |
|---|---|
| Stripe | `POST /api/webhooks/stripe-payment`; subscribe to `payment_intent.succeeded` |
| PayPal | `POST /api/webhooks/paypal-payment`; subscribe to `PAYMENT.CAPTURE.COMPLETED` |
| GoHighLevel booking | `POST /api/ghl/booking-confirmed` |
| GHL intake/payment destinations | Configure the outbound URL Secrets listed above |

Use newly generated test webhook signing secrets. Do not copy the current production Stripe webhook secret to a different endpoint.

## 11. Recreate the hourly charge sweep

The Manus deployment uses a Manus-specific Heartbeat job. Replit supports Scheduled Deployments that run a command on a schedule and stop afterward.[5]

Create a separate Replit **Scheduled Deployment** from the same repository:

| Setting | Value |
|---|---|
| Schedule | Every hour at minute `00` |
| Build command | `pnpm install --frozen-lockfile && pnpm build` |
| Run command | `pnpm sweep` |
| Required Secrets | Same new `DATABASE_URL`; test/sandbox payment configuration must exist in the empty database |

The `pnpm sweep` command calls the existing deterministic sweep logic directly and does not depend on a public cron callback or Manus cron identity.

## 12. Validation before publishing

Complete every item below using synthetic data only:

| Test | Expected result |
|---|---|
| `pnpm check` | TypeScript passes |
| `pnpm test` | All tests pass |
| `pnpm build` | Client and server bundles build |
| Homepage and `/lp/hrt3` | Images, fonts, phone link, and CTAs render |
| `/lp/WL2` | Intake validates and reaches $15 test payment |
| Stripe test deposit | Empty `payments` table receives a test record |
| PayPal sandbox deposit | Test record is created with sandbox mode |
| Stripe/PayPal webhooks | Replit receives valid test callbacks |
| GHL webhooks | Synthetic lead/payment payloads arrive once |
| Admin login | New seeded credential works |
| Manual sweep | Admin sweep handles only synthetic due payments |
| Scheduled sweep | Hourly test run succeeds and is idempotent |

Do not connect the custom domain or enable live payment keys until these tests pass.

## 13. Domain cutover

Keep the Manus production site live during testing. Add the custom domain to the validated Replit deployment, obtain working TLS, and only then update DNS. Test both `medmethoddirect.com` and `www.medmethoddirect.com` before public cutover.

Because the existing site handles payment webhooks and scheduled charges, use a controlled maintenance window. Confirm that no test webhook endpoints or sandbox payment modes remain active before enabling live traffic.

## 14. Items intentionally not migrated

This package does not include production database rows, patient details, payment processor tokens, PayPal vault tokens, Stripe customer/payment-method identifiers, existing admin credentials, secrets, Manus OAuth sessions, Manus Heartbeat task IDs, analytics history, custom-domain DNS credentials, or private/user-uploaded files.

## References

[1]: https://docs.replit.com/features/data-and-storage/development-and-production "Replit: Development and production databases"
[2]: https://www.hhs.gov/hipaa/for-professionals/faq/2075/may-a-hipaa-covered-entity-or-business-associate-use-cloud-service-to-store-or-process-ephi/index.html "HHS: May a HIPAA covered entity use a cloud service to store or process ePHI?"
[3]: https://docs.replit.com/core-concepts/project-editor/app-setup/secrets "Replit: Secrets"
[4]: https://docs.replit.com/features/project-setup/configuration "Replit: App Configuration"
[5]: https://docs.replit.com/features/publishing/deployment-types "Replit: Deployment types"
