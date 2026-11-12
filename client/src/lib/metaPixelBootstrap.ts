/** Retired compatibility API. Historical route data never enables tracking. */
type MetaConversionEvent = "Lead" | "Schedule" | "CompleteRegistration";

export const CONFIRMATION_PIXEL_EVENTS = new Map<string, MetaConversionEvent>([
  ["/webinar-registration-confirmed", "Lead"],
  ["/live-webinar3-confirmed", "Lead"],
  ["/care-team-booking-confirmed", "Lead"],
  ["/thank-you", "CompleteRegistration"],
]);

/** Historical metadata only; not an instruction to dispatch an event. */
export function getMetaPixelEventForPath(pathname: string): MetaConversionEvent | undefined {
  return CONFIRMATION_PIXEL_EVENTS.get(pathname);
}

/** Retired: no collection URL can be constructed by this API. */
export function buildMetaEventFallbackUrl(
  _eventName: MetaConversionEvent,
  _pageUrl: string,
  _timestamp: number,
): string {
  return "";
}

/** Retired on every route, including historical confirmation routes. */
export function shouldInstallMetaPixel(_pathname: string): boolean {
  return false;
}

/** Retained for old imports; intentionally has no browser or network effects. */
export function installMetaPixelForCurrentRoute(): boolean {
  return false;
}
