import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { superAdminCredentials } from "../drizzle/schema";
import { getDb } from "./db";

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD before running admin:seed");
  }
  if (password.length < 14) {
    throw new Error("SUPER_ADMIN_PASSWORD must be at least 14 characters");
  }

  const db = await getDb();
  if (!db) throw new Error("DATABASE_URL is not configured or the database is unavailable");

  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await db
    .select({ id: superAdminCredentials.id })
    .from(superAdminCredentials)
    .where(eq(superAdminCredentials.email, email))
    .limit(1);

  if (existing[0]) {
    await db
      .update(superAdminCredentials)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(superAdminCredentials.id, existing[0].id));
    console.log(`Updated super admin credential for ${email}`);
  } else {
    await db.insert(superAdminCredentials).values({ email, passwordHash });
    console.log(`Created super admin credential for ${email}`);
  }
}

main().catch((error: unknown) => {
  console.error("[SeedSuperAdmin] Failed:", error);
  process.exitCode = 1;
});
