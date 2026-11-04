import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
export const latePatientInfoFixturePath = "server/fixtures/intakeLatePatientInfoFragments.json";
const fragments = JSON.parse(readFileSync(resolve(root, latePatientInfoFixturePath), "utf8")) as Array<{ old: string; new: string; count?: number }>;

/** Reverse only the exact separately authorized intake fragments; unexpected changes remain visible. */
export function inverseApprovedLatePatientInfo(path: string, source: string): string {
  if (path !== "client/intake/index.html") return source;
  for (const fragment of [...fragments].reverse()) {
    if (source.split(fragment.new).length - 1 !== (fragment.count ?? 1)) throw new Error("Unexpected authorized late-patient-info source fragment count");
    source = source.split(fragment.new).join(fragment.old);
  }
  return source;
}

describe("late patient info complete production scope", () => {
  it("restores the complete intake source and changes no other production file from 87fcd00d", () => {
    const changed = execFileSync("git", ["diff", "--name-only", "87fcd00d", "--", "client", "server", "shared", "package.json", "pnpm-lock.yaml", "vite.config.ts", "drizzle"], { cwd: root, encoding: "utf8" })
      .trim().split("\n").filter(Boolean).filter(path => !/\.test\.[cm]?[jt]sx?$/.test(path) && path !== latePatientInfoFixturePath);
    expect(changed).toEqual(["client/intake/index.html"]);
    const current = readFileSync(resolve(root, "client/intake/index.html"), "utf8");
    expect(inverseApprovedLatePatientInfo("client/intake/index.html", current)).toBe(execFileSync("git", ["show", "87fcd00d:client/intake/index.html"], { cwd: root, encoding: "utf8" }));
  });
});
