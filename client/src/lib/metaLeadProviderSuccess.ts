import {
  CARE_TEAM_BOOKING_CONFIRMATION_PATH,
  CARE_TEAM_CALENDAR_ORIGIN,
} from "./careTeamBookingRedirect";

export const CARE_TEAM_CALENDAR_ID = "18sbmUpLKjc7pcLE8jdN";
export const WEBINAR_REGISTRATION_FORM_ID = "A3e1g5dCf1hc3tY3xpHi";
export const WEBINAR_FORM_ORIGIN = "https://link.sendmeapro.com";

const EXTERNAL_CONFIRMATION_PATHS = new Set([
  CARE_TEAM_BOOKING_CONFIRMATION_PATH,
  "/webinar-registration-confirmed",
  "/live-webinar3-confirmed",
]);

type ProviderMessage = Pick<MessageEvent, "origin" | "source" | "data">;
export type ExternalMetaLeadWindow = Window & {
  MmdMetaLead?: {
    arm: (destination: string, options?: { excluded?: boolean }) => unknown;
  };
};

function fromExactFrame(
  event: ProviderMessage,
  frameWindow: MessageEventSource | null | undefined,
  origin: string,
): boolean {
  return !!frameWindow && event.source === frameWindow && event.origin === origin;
}

/**
 * Verified public GHL default calendar source (2026-11-12): D00GsoYB.js ct(a)
 * posts ["msgsndr-booking-complete", {fingerprint:a.fingerprint,calendarId:...}]
 * only in the completed-booking branch, after the appointment API succeeds.
 * modify-parent-url is also emitted during payment URL cleanup: never success.
 * Do not return, persist, log, or forward the provider fingerprint/contact data.
 */
export function isVerifiedCareTeamBookingSuccess(
  event: ProviderMessage,
  frameWindow: MessageEventSource | null | undefined,
): boolean {
  if (!fromExactFrame(event, frameWindow, CARE_TEAM_CALENDAR_ORIGIN)) return false;
  if (!Array.isArray(event.data) || event.data.length !== 2) return false;
  const [kind, receipt] = event.data;
  if (kind !== "msgsndr-booking-complete" || !receipt || typeof receipt !== "object" || Array.isArray(receipt)) return false;
  return receipt.calendarId === CARE_TEAM_CALENDAR_ID &&
    typeof receipt.fingerprint === "string" && receipt.fingerprint.trim().length > 0;
}

/**
 * Navigation compatibility only, not conversion authorization. Require the
 * exact form identity even for these previously accepted legacy object aliases.
 * Current hosted formNativeWrapperEnabled:true FormCore has no documented
 * form-specific success postMessage; its onSubmit event is Vue-local. Sticky
 * contacts and provider redirects must never arm a Meta Lead. In particular,
 * do not guess that an array formSubmit or FORM_SUBMITTED alias is persisted.
 */
export function isWebinarRegistrationNavigationMessage(
  event: ProviderMessage,
  frameWindow: MessageEventSource | null | undefined,
): boolean {
  if (!fromExactFrame(event, frameWindow, WEBINAR_FORM_ORIGIN)) return false;
  let data: unknown = event.data;
  if (typeof data === "string") {
    try { data = JSON.parse(data); } catch { return false; }
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) return false;
  const message = data as Record<string, unknown>;
  const nestedForm = message.form;
  const identities = [
    message.formId,
    message.form_id,
    nestedForm && typeof nestedForm === "object" && !Array.isArray(nestedForm)
      ? (nestedForm as Record<string, unknown>).id : undefined,
  ].filter(value => value !== undefined);
  if (!identities.length || identities.some(value => value !== WEBINAR_REGISTRATION_FORM_ID)) return false;
  return [message.type, message.event, message.action].some(value =>
    ["formSubmit", "form_submission", "formSubmitted", "FORM_SUBMITTED"].includes(value as string),
  );
}

/** Fail closed until this deployed webinar form has a verified success bridge. */
export const WEBINAR_META_LEAD_BLOCKED_REASON =
  "The hosted FormCore exposes no exact-form persisted-success postMessage. Configure a trusted provider after-success bridge or server-verified one-use redirect token before enabling webinar Meta Leads.";

/** URLs with query/hash context and explicitly non-production sources are excluded. */
export function isExternalMetaLeadExcludedContext(
  location: Pick<Location, "pathname" | "search" | "hash">,
  source = "",
): boolean {
  return !!location.search || !!location.hash ||
    /(?:^|\/)(?:admin|test|demo|preview)(?:\/|$|[-_])/i.test(location.pathname) ||
    /(?:^|[^a-z])(?:admin|test|demo|preview)(?:$|[^a-z])/i.test(source);
}

/** Call arm synchronously before navigation; redirects must work if it is absent. */
export function armExternalMetaLead(
  destination: string,
  options: { excluded?: boolean } = {},
  host: ExternalMetaLeadWindow | undefined = typeof window === "undefined"
    ? undefined : window as ExternalMetaLeadWindow,
): void {
  if (!host || !EXTERNAL_CONFIRMATION_PATHS.has(destination)) return;
  try {
    host.MmdMetaLead?.arm(destination, {
      excluded: options.excluded === true || isExternalMetaLeadExcludedContext(host.location),
    });
  } catch {
    // Conversion infrastructure is optional and must never break booking navigation.
  }
}
