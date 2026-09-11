export const CARE_TEAM_BOOKING_CONFIRMATION_PATH = "/care-team-booking-confirmed";
export const CARE_TEAM_CALENDAR_ORIGIN = "https://link.sendmeapro.com";

export function getCareTeamConfirmationRedirectTarget(data: unknown): string | null {
  if (!Array.isArray(data) || data[0] !== "modify-parent-url" || typeof data[1] !== "string") {
    return null;
  }

  try {
    const target = new URL(data[1], "https://medmethoddirect.com");
    if (target.pathname.replace(/\/+$/, "") !== CARE_TEAM_BOOKING_CONFIRMATION_PATH) return null;
    return `${CARE_TEAM_BOOKING_CONFIRMATION_PATH}${target.search}${target.hash}`;
  } catch {
    return null;
  }
}

export function isCareTeamConfirmationRedirectMessage(data: unknown): boolean {
  return getCareTeamConfirmationRedirectTarget(data) !== null;
}
