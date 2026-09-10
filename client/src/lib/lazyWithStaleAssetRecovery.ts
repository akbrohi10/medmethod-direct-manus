import {
  lazy as reactLazy,
  type ComponentType,
  type LazyExoticComponent,
} from "react";

export const STALE_ASSET_RETRY_PARAM = "__mm_asset_retry";

const STALE_ASSET_ERROR_PATTERNS = [
  /failed to fetch dynamically imported module/i,
  /error loading dynamically imported module/i,
  /importing a module script failed/i,
  /loading chunk [\w-]+ failed/i,
  /chunkloaderror/i,
  /css_chunk_load_failed/i,
  /unable to preload css/i,
];

export function isStaleDeploymentAssetError(error: unknown): boolean {
  const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  return STALE_ASSET_ERROR_PATTERNS.some(pattern => pattern.test(message));
}

export function buildStaleAssetRecoveryUrl(href: string): string {
  const url = new URL(href);
  url.searchParams.set(STALE_ASSET_RETRY_PARAM, "1");
  return url.toString();
}

export function hasAlreadyRetriedStaleAssets(href: string): boolean {
  return new URL(href).searchParams.get(STALE_ASSET_RETRY_PARAM) === "1";
}

function clearSuccessfulRetryMarker(): void {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  if (!url.searchParams.has(STALE_ASSET_RETRY_PARAM)) return;

  url.searchParams.delete(STALE_ASSET_RETRY_PARAM);
  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
}

/**
 * React.lazy wrapper that recovers once when an open browser tab requests a
 * hashed route chunk from a previous deployment. The URL marker prevents a
 * reload loop; real component errors still reach the application boundary.
 */
export function lazyWithStaleAssetRecovery<T extends ComponentType<any>>(
  loader: () => Promise<{ default: T }>,
): LazyExoticComponent<T> {
  return reactLazy(async () => {
    try {
      const loadedModule = await loader();
      clearSuccessfulRetryMarker();
      return loadedModule;
    } catch (error) {
      if (
        typeof window === "undefined" ||
        !isStaleDeploymentAssetError(error) ||
        hasAlreadyRetriedStaleAssets(window.location.href)
      ) {
        throw error;
      }

      window.location.replace(buildStaleAssetRecoveryUrl(window.location.href));
      return new Promise<never>(() => undefined);
    }
  });
}
