export type WebinarRegistrationDataLayerEvent =
  | "webinar_registration_complete"
  | "live_webinar3_registration_complete";

/**
 * Keep webinar conversion metadata generic. GTM can still distinguish the
 * existing event names for routing, but no condition or treatment category is
 * sent with the lead event.
 */
export function buildNeutralWebinarRegistrationPayload(
  event: WebinarRegistrationDataLayerEvent,
) {
  return {
    event,
    content_name: "Webinar Registration",
    content_category: "Lead",
  } as const;
}
