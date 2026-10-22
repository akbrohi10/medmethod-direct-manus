import { it } from "vitest";

/**
 * Intentionally disabled integration harness.
 *
 * The intake is now free-first and payment is a separate optional $39 video visit.
 * This repository's regular test suite must never contact Keragon, PayPal, Spruce,
 * or any endpoint with patient data. The mocked unit coverage in
 * intakePaidFinalization.test.ts covers free delivery, receipts, video payment,
 * waiver, retries, and concurrency without external traffic.
 *
 * If a separately authorized staging exercise is ever needed, create a reviewed,
 * synthetic-only procedure outside the automated test suite. Do not enable this test
 * with an environment variable and do not run it against production.
 */
it.skip("external intake handoff integration is intentionally disabled; mocked tests only", () => {});
