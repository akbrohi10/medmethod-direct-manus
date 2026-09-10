import { describe, expect, it } from "vitest";
import {
  STALE_ASSET_RETRY_PARAM,
  buildStaleAssetRecoveryUrl,
  hasAlreadyRetriedStaleAssets,
  isStaleDeploymentAssetError,
} from "../client/src/lib/lazyWithStaleAssetRecovery";

describe("stale deployment asset recovery", () => {
  it.each([
    "Failed to fetch dynamically imported module: https://example.com/assets/Home-old.js",
    "Importing a module script failed.",
    "Loading chunk HomeHrt3 failed",
    "ChunkLoadError: Loading chunk 42 failed",
    "Unable to preload CSS for /assets/page-old.css",
  ])("recognizes recoverable lazy-asset failures: %s", message => {
    expect(isStaleDeploymentAssetError(new TypeError(message))).toBe(true);
  });

  it("does not hide ordinary component errors behind a reload", () => {
    expect(isStaleDeploymentAssetError(new Error("Cannot read properties of undefined"))).toBe(false);
  });

  it("adds one cache-busting retry marker without losing the route, query, or hash", () => {
    const recoveryUrl = new URL(
      buildStaleAssetRecoveryUrl("https://medmethoddirect.com/thank-you?source=meta#calendar"),
    );

    expect(recoveryUrl.pathname).toBe("/thank-you");
    expect(recoveryUrl.searchParams.get("source")).toBe("meta");
    expect(recoveryUrl.searchParams.get(STALE_ASSET_RETRY_PARAM)).toBe("1");
    expect(recoveryUrl.hash).toBe("#calendar");
    expect(hasAlreadyRetriedStaleAssets(recoveryUrl.toString())).toBe(true);
  });

  it("does not mark an ordinary route as already retried", () => {
    expect(hasAlreadyRetriedStaleAssets("https://medmethoddirect.com/")).toBe(false);
  });
});
