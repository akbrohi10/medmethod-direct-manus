import { describe, expect, it } from "vitest";

// Opt-in only: normal test runs must never contact configured patient/lead services.
describe.skipIf(process.env.VALIDATE_QUIZ_WEBHOOK_SECRETS !== "yes")("quiz webhook server-only secrets", () => {
  for (const key of ["KERAGON_QUIZ_WEBHOOK_URL", "GHL_QUIZ_WEBHOOK_URL"] as const) {
    it(`${key} has a reachable HTTPS gateway without sending a lead (POST delivery is tested separately)`, async () => {
      let url: URL | undefined;
      try { url = new URL(process.env[key] ?? ""); } catch { /* Never include the secret in errors. */ }
      expect(Boolean(url && url.protocol === "https:" && !url.username && !url.password && !url.hash)).toBe(true);
      let reachable = false;
      try {
        const response = await fetch(url!.toString(), { method: "HEAD", redirect: "manual", signal: AbortSignal.timeout(10000) });
        reachable = (response.status >= 200 && response.status < 400) || response.status === 405;
        await response.body?.cancel();
        if (!reachable && key === "KERAGON_QUIZ_WEBHOOK_URL" && response.status === 403) {
          const options = await fetch(url!.toString(), { method: "OPTIONS", redirect: "manual", signal: AbortSignal.timeout(10000) });
          let message = "";
          try { const body = await options.json() as { message?: unknown }; if (typeof body.message === "string") message = body.message; } catch { /* No response bodies are logged. */ }
          // API Gateway returns this exact method-routing response for a POST-only trigger.
          // This proves gateway reachability, NOT that a mapping POST will be accepted.
          reachable = options.status === 403 && message === "Missing Authentication Token";
        }
      } catch { throw new Error(`${key}: secure webhook reachability check failed`); }
      expect(reachable).toBe(true);
    }, 25000);
  }
});
