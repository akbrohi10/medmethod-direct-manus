import { runSweep } from "./scheduledChargeHandler";

async function main() {
  const result = await runSweep();
  console.log(JSON.stringify(result));
  if (!result.ok) process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error("[SweepOnce] Failed:", error);
  process.exitCode = 1;
});
