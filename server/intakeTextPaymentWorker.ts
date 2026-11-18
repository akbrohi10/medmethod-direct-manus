import type { Request, Response } from "express";
import { and, eq } from "drizzle-orm";
import { intakeTextPaymentWorker } from "../drizzle/schema";
import { getDb } from "./db";
import { getIntakeTextPaymentService } from "./intakeTextPaymentIntegration";

/** No startup registration or timer. Activate a project Heartbeat only AFTER deployment. */
export async function intakeTextPaymentSweep(req: Request, res: Response) {
  res.setHeader("Cache-Control", "no-store");
  try {
    const { sdk } = await import("./_core/sdk");
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) return res.status(403).json({ error: "cron-only" });
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "worker-unavailable" });
    const rows = await db.select().from(intakeTextPaymentWorker).where(and(
      eq(intakeTextPaymentWorker.id, 1), eq(intakeTextPaymentWorker.enabled, 1),
      eq(intakeTextPaymentWorker.scheduleCronTaskUid, user.taskUid),
    )).limit(1);
    if (!rows.length) return res.json({ ok: true, skipped: "unbound-worker" });
    const result = await getIntakeTextPaymentService().sweep();
    return res.json({ ok: true, ...result });
  } catch { return res.status(503).json({ error: "worker-unavailable" }); }
}
