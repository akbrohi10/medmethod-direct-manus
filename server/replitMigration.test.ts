import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath: string) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");

describe("Replit migration package", () => {
  it("creates every current database table without exporting rows", () => {
    const sql = read("migration/replit/schema.mysql.sql");
    const tables = [
      "users",
      "stripe_settings",
      "payments",
      "super_admin_credentials",
      "payment_webhook_log",
      "paypal_settings",
    ];

    for (const table of tables) {
      expect(sql).toContain(`CREATE TABLE IF NOT EXISTS \`${table}\``);
    }
    expect(sql).not.toMatch(/\bINSERT\s+INTO\b/i);
    expect(sql).not.toContain("sk_live_");
    expect(sql).not.toContain("sk_test_");
  });

  it("includes the sensitive payment and scheduler columns required by the app", () => {
    const sql = read("migration/replit/schema.mysql.sql");
    for (const column of [
      "appointmentDate",
      "scheduledChargePaymentIntentId",
      "paypalVaultToken",
      "scheduledChargePaymentCronTaskUid",
      "paymentProvider",
      "stripeMode",
    ]) {
      expect(sql).toContain(`\`${column}\``);
    }
  });

  it("provides placeholder-only Replit configuration", () => {
    const envTemplate = read("migration/replit/.env.replit.example");
    expect(envTemplate).toContain("DATABASE_URL=mysql://USER:PASSWORD@HOST");
    expect(envTemplate).toContain("LOCAL_ASSET_MODE=true");
    expect(envTemplate).toContain("DISABLE_MANUS_HEARTBEAT=true");
    expect(envTemplate).not.toMatch(/sk_(test|live)_[A-Za-z0-9]/);
    expect(envTemplate).not.toMatch(/AKIA[A-Z0-9]{16}/);
  });

  it("builds the portable admin seed and one-off sweep entrypoints", () => {
    const packageJson = JSON.parse(read("package.json")) as {
      scripts: Record<string, string>;
    };
    expect(packageJson.scripts.build).toContain("server/runSweepOnce.ts");
    expect(packageJson.scripts.build).toContain("server/seedSuperAdmin.ts");
    expect(packageJson.scripts.sweep).toContain("dist/runSweepOnce.js");
    expect(packageJson.scripts["admin:seed"]).toContain("dist/seedSuperAdmin.js");
  });

  it("supports disabling Manus-only storage and Heartbeat services", () => {
    const server = read("server/_core/index.ts");
    expect(server).toContain('process.env.LOCAL_ASSET_MODE !== "true"');
    expect(server).toContain('process.env.DISABLE_MANUS_HEARTBEAT !== "true"');
  });
});
