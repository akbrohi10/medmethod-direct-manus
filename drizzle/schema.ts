import { bigint, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Stripe settings table — stores test and live API keys plus the active mode.
 * Only one row should exist (id = 1). Use upsert pattern to update.
 */
export const stripeSettings = mysqlTable("stripe_settings", {
  id: int("id").autoincrement().primaryKey(),
  mode: mysqlEnum("mode", ["test", "live"]).default("test").notNull(),
  testPublishableKey: text("testPublishableKey"),
  testSecretKey: text("testSecretKey"),
  livePublishableKey: text("livePublishableKey"),
  liveSecretKey: text("liveSecretKey"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StripeSettings = typeof stripeSettings.$inferSelect;
export type InsertStripeSettings = typeof stripeSettings.$inferInsert;

/**
 * Payments table — tracks the two-charge split payment flow.
 * depositAmount and remainingAmount are stored in cents (integer).
 * status transitions: deposit_paid → fully_paid (or failed at any point).
 */
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  patientName: varchar("patientName", { length: 255 }),
  patientEmail: varchar("patientEmail", { length: 320 }),
  patientPhone: varchar("patientPhone", { length: 32 }),
  /** UTC timestamp (ms) of the appointment date — the persisted remaining balance is charged on this date */
  appointmentDate: bigint("appointmentDate", { mode: "number" }),
  /** Total consultation price in cents after any referral credit (default 19900 = $199) */
  consultationTotalAmount: int("consultationTotalAmount").default(19900).notNull(),
  /** Deposit amount in cents (default 5000 = $50) */
  depositAmount: int("depositAmount").default(5000).notNull(),
  /** Remaining amount in cents (default 14900 = $149) */
  remainingAmount: int("remainingAmount").default(14900).notNull(),
  /** Normalized referral code applied to this payment, if any */
  referralCode: varchar("referralCode", { length: 64 }),
  /** Referral credit applied to the consultation total in cents */
  referralCreditAmount: int("referralCreditAmount").default(0).notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 64 }),
  stripePaymentMethodId: varchar("stripePaymentMethodId", { length: 64 }),
  depositPaymentIntentId: varchar("depositPaymentIntentId", { length: 64 }),
  scheduledChargePaymentIntentId: varchar("scheduledChargePaymentIntentId", { length: 64 }),
  status: mysqlEnum("status", ["pending", "deposit_paid", "fully_paid", "failed"]).default("pending").notNull(),
  /** Which landing page triggered this payment (e.g. 'hrt2') */
  landingPage: varchar("landingPage", { length: 64 }),
  /** Heartbeat cron task UID for the scheduled $149 remaining charge */
  scheduledChargePaymentCronTaskUid: varchar("scheduledChargePaymentCronTaskUid", { length: 65 }),
  /** Which Stripe environment was used to create this payment (test or live) */
  stripeMode: mysqlEnum("stripeMode", ["test", "live"]).default("test").notNull(),
  /** Which payment processor was used: stripe or paypal */
  paymentProvider: mysqlEnum("paymentProvider", ["stripe", "paypal"]).default("stripe").notNull(),
  /** PayPal Order ID for the $50 deposit (when paymentProvider = paypal) */
  paypalOrderId: varchar("paypalOrderId", { length: 64 }),
  /** PayPal Order ID for the $149 remaining charge (when paymentProvider = paypal) */
  paypalRemainingOrderId: varchar("paypalRemainingOrderId", { length: 64 }),
  /** PayPal environment used: sandbox or live */
  paypalMode: mysqlEnum("paypalMode", ["sandbox", "live"]).default("sandbox"),
  /** PayPal Vault token — saved payment method for future server-side charges */
  paypalVaultToken: varchar("paypalVaultToken", { length: 128 }),
  /** PayPal customer ID associated with the vault token */
  paypalCustomerId: varchar("paypalCustomerId", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * Super admin credentials table — stores email/password pairs for direct
 * admin access without requiring Manus OAuth. Passwords are bcrypt-hashed.
 * This is separate from the Manus OAuth user table.
 */
export const superAdminCredentials = mysqlTable("super_admin_credentials", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SuperAdminCredential = typeof superAdminCredentials.$inferSelect;
export type InsertSuperAdminCredential = typeof superAdminCredentials.$inferInsert;

/**
 * Payment webhook log — tracks every GHL payment-success webhook attempt.
 * The transaction_id column acts as the idempotency key so a retried Stripe
 * event never fires the GHL webhook twice for the same payment.
 *
 * One row is inserted per attempt (up to 3 per transaction_id).
 * A successful attempt has http_status 2xx and error_message = null.
 */
export const paymentWebhookLog = mysqlTable("payment_webhook_log", {
  id: int("id").autoincrement().primaryKey(),
  /** Stripe PaymentIntent ID — used as idempotency key */
  transactionId: varchar("transactionId", { length: 128 }).notNull(),
  /** /lp/glp1 or /lp/hrt3 */
  landingPagePath: varchar("landingPagePath", { length: 64 }).notNull(),
  /** Attempt number: 1, 2, or 3 */
  attemptNumber: int("attemptNumber").notNull().default(1),
  /** Full JSON payload sent to GHL */
  requestBody: text("requestBody").notNull(),
  /** HTTP status code returned by GHL (0 if network error) */
  httpStatus: int("httpStatus").notNull().default(0),
  /** GHL response body (truncated to 2000 chars) */
  responseBody: text("responseBody"),
  /** Error message if the attempt threw (network error, timeout, etc.) */
  errorMessage: text("errorMessage"),
  /** Whether this attempt was considered successful (2xx) */
  success: int("success").notNull().default(0), // 0 = false, 1 = true
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type PaymentWebhookLog = typeof paymentWebhookLog.$inferSelect;
export type InsertPaymentWebhookLog = typeof paymentWebhookLog.$inferInsert;

/**
 * PayPal settings table — stores sandbox and live credentials plus the active mode.
 * Also controls which payment provider (Stripe vs PayPal) is active site-wide.
 * Only one row should exist (id = 1). Use upsert pattern to update.
 */
export const paypalSettings = mysqlTable("paypal_settings", {
  id: int("id").autoincrement().primaryKey(),
  /** Active PayPal environment */
  mode: mysqlEnum("mode", ["sandbox", "live"]).default("sandbox").notNull(),
  /** Which payment provider is active site-wide */
  activeProvider: mysqlEnum("activeProvider", ["stripe", "paypal"]).default("stripe").notNull(),
  sandboxClientId: text("sandboxClientId"),
  sandboxClientSecret: text("sandboxClientSecret"),
  liveClientId: text("liveClientId"),
  liveClientSecret: text("liveClientSecret"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PaypalSettings = typeof paypalSettings.$inferSelect;
export type InsertPaypalSettings = typeof paypalSettings.$inferInsert;
