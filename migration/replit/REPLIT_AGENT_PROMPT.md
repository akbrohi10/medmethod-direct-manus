# Replit Agent Prompt and Duplication Checklist

**Author:** Manus AI  
**Purpose:** Duplicate the complete MedMethod Direct application in Replit using an empty database and synthetic test data only.

## Important GitHub clarification

The latest **saved checkpoint** is what records and synchronizes code changes with the connected GitHub repository. **Publish** updates the hosted Manus website from that checkpoint; publishing is not the action that backs up the repository. The deployment-entrypoint repair is included in checkpoint `241f5939`.

## Copy-paste prompt for Replit Agent

Paste the full block below into Replit Agent **after importing the GitHub repository**:

```text
You are duplicating an existing production React/Express application named MedMethod Direct. Do not redesign it, rewrite its copy, change prices, alter routes, replace payment flows, or remove features.

First inspect the repository and read these files completely:
- migration/replit/README.md
- migration/replit/REPLIT_AGENT_PROMPT.md
- migration/replit/schema.mysql.sql
- migration/replit/.env.replit.example
- migration/replit/ASSETS.md
- migration/replit/VALIDATION.md
- .replit
- package.json

Migration scope and safety rules:
1. Use an EMPTY external MySQL 8-compatible or TiDB database. Do not use Replit's built-in PostgreSQL database and do not convert the ORM or schema unless I separately approve that project.
2. Do not connect to the original production database.
3. Do not import patient data, payment records, PayPal vault tokens, Stripe customer/payment-method identifiers, existing admin credentials, sessions, logs, or private uploads.
4. Use synthetic test data only.
5. Do not hardcode or print secrets. Tell me which values I must add through Replit Secrets.
6. Keep Stripe in test mode and PayPal in sandbox mode. Do not enable live payments.
7. Do not fabricate, seed, or add reviews or testimonials.
8. Preserve every existing route, page, image reference, font, icon, form, webhook handler, admin feature, and responsive layout.

Required tasks, in order:
A. Run pnpm install --frozen-lockfile, pnpm check, and pnpm test. Report any failure before changing application behavior.
B. Confirm the production build creates dist/index.js, dist/runSweepOnce.js, and dist/seedSuperAdmin.js.
C. Ask me to create an external empty MySQL/TiDB database and add its TLS DATABASE_URL through Replit Secrets. Do not create or use PostgreSQL.
D. Have me import migration/replit/schema.mysql.sql through the database provider's SQL console. Verify these six empty tables exist: users, stripe_settings, payments, super_admin_credentials, payment_webhook_log, and paypal_settings.
E. Ask me to upload medmethod-public-assets.zip and medmethod-large-video.zip. Verify SHA256SUMS.txt, then run migration/replit/install-assets.sh. Do not leave ZIP archives inside the deployment after extraction. Recommend moving the 446 MiB video to object storage/CDN and updating its single source reference rather than bundling it long-term.
F. Ask me to add the variable names from migration/replit/.env.replit.example in Replit Secrets. Use LOCAL_ASSET_MODE=true and DISABLE_MANUS_HEARTBEAT=true.
G. Run pnpm build, then run pnpm admin:seed only after SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD are supplied through Secrets. Tell me to remove those two seed Secrets after success.
H. Start the application with pnpm start. Verify the homepage and the main routes render without 404s, missing assets, or console errors.
I. Configure provider test webhooks for Stripe, PayPal sandbox, and GoHighLevel using the Replit preview/deployment URL. Do not reuse a webhook signing secret from a different endpoint.
J. Create a separate Replit Scheduled Deployment that runs every hour. Build command: pnpm install --frozen-lockfile && pnpm build. Run command: pnpm sweep.
K. Test the $50 deposit flow, $15 WL2 flow, Stripe 3DS return, PayPal sandbox flow, GHL intake/payment webhooks, admin login, manual sweep, and scheduled sweep with synthetic users only.
L. Do not connect medmethoddirect.com or enable live payment keys until I explicitly confirm every test passed.

At the end, give me a table with: completed item, evidence, remaining manual action, and whether it is safe for test deployment. Stop and ask me whenever a credential, provider-dashboard action, database console action, payment confirmation, domain change, or other sensitive operation is required.
```

## Step-by-step instructions for you

### Step 1 — Confirm the repository is current

The fixed project checkpoint is `241f5939`. In Manus, the code was saved before publishing. In GitHub, confirm that the latest commit includes:

| Required file/change | What it confirms |
|---|---|
| `.replit` | Replit run/build configuration |
| `migration/replit/README.md` | Full migration runbook |
| `migration/replit/schema.mysql.sql` | Empty six-table MySQL structure |
| `migration/replit/.env.replit.example` | Secret-name checklist without values |
| `migration/replit/install-assets.sh` | Public asset installer |
| `server/runSweepOnce.ts` | Portable hourly payment sweep |
| `server/seedSuperAdmin.ts` | Secure empty-database admin setup |
| `package.json` builds `dist/index.js` | Production deployment fix |

### Step 2 — Import the GitHub repository

Create a **private** Replit App by importing the connected GitHub repository. Do not start with a blank template and do not ask Replit Agent to recreate the pages from screenshots. Importing the repository preserves all application pages, components, fonts, package dependencies, routes, forms, and icons that are stored in code.

### Step 3 — Download the migration files

Download these four files locally, then upload the two asset ZIPs and checksum file to the Replit project when instructed:

| File | Download |
|---|---|
| Updated migration kit | [Download](https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/tAqcInqezLqWIxiJ.zip) |
| Public images/assets — about 93 MiB | [Download](https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/fzoEmIpVBdUySQeJ.zip) |
| Large consultation video — about 446 MiB | [Download](https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/EViYDhPSOekNYiOk.zip) |
| SHA-256 checksums | [Download](https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/dqrbRDHFMQEkyaAv.txt) |

The migration kit is a convenience copy. The authoritative application source is the imported GitHub repository.

### Step 4 — Give Replit Agent the prompt

Paste the prompt from the previous section into Replit Agent. Let it inspect the existing project; do not tell it to generate a new website.

### Step 5 — Install dependencies and run the baseline checks

In the Replit Shell:

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build
```

Expected baseline: TypeScript passes, **108 tests** pass, and the build creates `dist/index.js`, `dist/runSweepOnce.js`, and `dist/seedSuperAdmin.js`.

### Step 6 — Create the empty database

Use a separate **MySQL 8-compatible or TiDB** provider. Replit's built-in database is PostgreSQL and is not directly compatible with this application's current Drizzle MySQL schema.[1]

In the new provider's SQL console, execute:

```text
migration/replit/schema.mysql.sql
```

Confirm all six tables exist and are empty. Add the new TLS connection string to Replit Secrets as `DATABASE_URL`. Never add the current production connection string.

### Step 7 — Restore public assets

Upload the asset archives and checksum file to the Replit project, then run:

```bash
sha256sum -c SHA256SUMS.txt
bash migration/replit/install-assets.sh medmethod-public-assets.zip medmethod-large-video.zip
rm medmethod-public-assets.zip medmethod-large-video.zip
```

This restores **81 public marketing assets** to the existing `/manus-storage/...` paths. Google Fonts remain externally loaded by the browser; package-based icons are restored by `pnpm install`.

The 446 MiB video should preferably move to object storage/CDN before production. Ask Replit Agent to update only its single source reference after you have the new video URL.

### Step 8 — Add Secrets

Open `migration/replit/.env.replit.example` and add the required keys through Replit **Secrets**. Replit documents Secrets as encrypted environment variables for API keys and database connection strings.[2]

Use new/test-specific values. Do not paste secrets into Agent chat, code, GitHub, or screenshots.

### Step 9 — Seed the empty admin account

After adding temporary `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` Secrets:

```bash
pnpm build
pnpm admin:seed
```

Remove those two temporary seed Secrets after the command succeeds. The hashed credential remains in the new empty database.

### Step 10 — Start and inspect the duplicate

Run:

```bash
pnpm start
```

Check the homepage, `/lp/hrt3`, `/lp/hrt2`, `/lp/WL2`, `/thank-you`, `/thank-you2`, `/care-team-booking`, `/admin/login`, and representative state/city pages. Confirm all public images, fonts, icons, forms, and mobile layouts render.

### Step 11 — Configure integrations in test mode

Use the Replit test URL to configure new provider-side callbacks:

| Provider | Replit endpoint/action |
|---|---|
| Stripe test | `POST /api/webhooks/stripe-payment` |
| PayPal sandbox | `POST /api/webhooks/paypal-payment` |
| GHL booking | `POST /api/ghl/booking-confirmed` |
| GHL outbound intake/payment | Add the destination URLs through Replit Secrets |

Keep live Stripe and PayPal credentials disabled until every synthetic test passes.

### Step 12 — Recreate the hourly payment sweep

Create a separate Replit **Scheduled Deployment**. Replit documents Scheduled Deployments as commands that run on a schedule and then stop.[3]

| Setting | Value |
|---|---|
| Schedule | Every hour at minute `00` |
| Build | `pnpm install --frozen-lockfile && pnpm build` |
| Run | `pnpm sweep` |

Test it only against synthetic sandbox/test payments in the new empty database.

### Step 13 — Do not move the domain yet

Keep the Manus site live while validating Replit. Only after the duplicate passes all page, payment, webhook, admin, asset, mobile, and scheduler tests should you plan the domain cutover. Test both `medmethoddirect.com` and `www.medmethoddirect.com` with valid TLS before sending traffic.

## What will and will not be duplicated

| Item | Result |
|---|---|
| All source-controlled pages and routes | Duplicated through GitHub |
| React/Express/tRPC code | Duplicated through GitHub |
| Fonts and npm icon libraries | Restored through external font requests and `pnpm install` |
| 81 public marketing assets | Restored from the public asset archive |
| Large consultation video | Backed up separately; preferably move to CDN/object storage |
| Database tables and columns | Created empty from the MySQL schema |
| Live patient/payment records | **Not duplicated** |
| Existing payment tokens/vault IDs | **Not duplicated** |
| Existing secrets/admin password | **Not duplicated** |
| Manus OAuth/Heartbeat | Replaced or disabled for the Replit test environment |
| Domain/DNS | Moved only after validation |

## References

[1]: https://docs.replit.com/features/data-and-storage/development-and-production "Replit: Development and production databases"
[2]: https://docs.replit.com/core-concepts/project-editor/app-setup/secrets "Replit: Secrets"
[3]: https://docs.replit.com/features/publishing/deployment-types "Replit: Deployment types"
