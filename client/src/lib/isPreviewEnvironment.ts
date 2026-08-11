/** Preview hosts are served through Manus' temporary computer domains, never the live site. */
export function isPreviewEnvironment(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return host.endsWith(".manus.computer") || host.endsWith(".manuspre.computer");
}
