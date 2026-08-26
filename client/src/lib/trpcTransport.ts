const INVALID_HEADER_VALUE = /[\u0000-\u001F\u007F]/;

export function resolveTrpcEndpoint(baseUrl?: string): string {
  if (!baseUrl) return "/api/trpc";

  try {
    return new URL("/api/trpc", baseUrl).toString();
  } catch {
    return "/api/trpc";
  }
}

export function readPreviewBearerToken(
  rawCookie: string | null,
  cookieName: string,
): string | undefined {
  if (!rawCookie) return undefined;

  const prefix = `${cookieName}=`;
  const pair = rawCookie
    .split(";")
    .find(value => value.trim().startsWith(prefix));
  const token = pair?.trim().slice(prefix.length);

  if (!token || INVALID_HEADER_VALUE.test(token)) return undefined;
  return token;
}
