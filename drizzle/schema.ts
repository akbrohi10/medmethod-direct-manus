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
  /** UTC timestamp (ms) of the appointment date — $149 is charged on this date */
  appointmentDate: bigint("appointmentDate", { mode: "number" }),
  /** Deposit amount in cents (default 5000 = $50) */
  depositAmount: int("depositAmount").default(5000).notNull(),
  /** Remaining amount in cents (default 14900 = $149) */
  remainingAmount: int("remainingAmount").default(14900).notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 64 }),
  stripePaymentMethodId: varchar("stripePaymentMethodId", { length: 64 }),
  depositPaymentIntentId: varchar("depositPaymentIntentId", { length: 64 }),
  scheduledChargePaymentIntentId: varchar("scheduledChargePaymentIntentId", { length: 64 }),
  status: mysqlEnum("status", ["deposit_paid", "fully_paid", "failed"]).default("deposit_paid").notNull(),
  /** Which landing page triggered this payment (e.g. 'hrt2') */
  landingPage: varchar("landingPage", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;
