import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertPayment,
  InsertStripeSettings,
  InsertUser,
  Payment,
  StripeSettings,
  SuperAdminCredential,
  payments,
  stripeSettings,
  superAdminCredentials,
  users,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ─── Stripe Settings ────────────────────────────────────────────────────────

/**
 * Get the single stripe settings row (id = 1).
 * Returns null if not yet configured.
 */
export async function getStripeSettings(): Promise<StripeSettings | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(stripeSettings).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * Upsert the stripe settings row (always id = 1).
 */
export async function upsertStripeSettings(
  data: Partial<InsertStripeSettings>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getStripeSettings();
  if (existing) {
    await db
      .update(stripeSettings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(stripeSettings.id, existing.id));
  } else {
    await db.insert(stripeSettings).values({
      mode: "test",
      ...data,
    });
  }
}

// ─── Payments ───────────────────────────────────────────────────────────────

/**
 * Create a new payment record after the $50 deposit is collected.
 */
export async function createPayment(data: InsertPayment): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(payments).values(data);
  return (result[0] as { insertId: number }).insertId;
}

/**
 * Update an existing payment record (e.g., after scheduling the $149 charge).
 */
export async function updatePayment(
  id: number,
  data: Partial<InsertPayment>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(payments)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(payments.id, id));
}

/**
 * Get a payment record by ID.
 */
export async function getPaymentById(id: number): Promise<Payment | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(payments).where(eq(payments.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * Get all payments (for admin dashboard), optionally filtered by Stripe mode.
 */
export async function getAllPayments(mode?: "test" | "live"): Promise<Payment[]> {
  const db = await getDb();
  if (!db) return [];
  if (mode) {
    return db
      .select()
      .from(payments)
      .where(eq(payments.stripeMode, mode))
      .orderBy(payments.createdAt);
  }
  return db.select().from(payments).orderBy(payments.createdAt);
}

// ─── Super Admin Credentials ─────────────────────────────────────────────────

/**
 * Get a super admin credential row by email.
 */
export async function getSuperAdminByEmail(
  email: string
): Promise<SuperAdminCredential | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(superAdminCredentials)
    .where(eq(superAdminCredentials.email, email.toLowerCase().trim()))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}
