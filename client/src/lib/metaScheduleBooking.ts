/** Physician booking completion only; receipt data never leaves the calendar guard. */
export const PHYSICIAN_CALENDAR_ID = "Ew0Y6y4FVcwaZeb9Y826";
const PROVIDER_ORIGIN = "https://link.sendmeapro.com";

export function isPhysicianBookingComplete(event: MessageEvent, frame: HTMLIFrameElement | null): boolean {
  if (!frame || !frame.contentWindow || event.source !== frame.contentWindow || event.origin !== PROVIDER_ORIGIN) return false;
  try {
    const url = new URL(frame.src);
    if (url.origin !== PROVIDER_ORIGIN || url.pathname !== `/widget/booking/${PHYSICIAN_CALENDAR_ID}`) return false;
  } catch { return false; }
  const data: unknown = event.data;
  if (!Array.isArray(data) || data.length !== 2 || data[0] !== "msgsndr-booking-complete") return false;
  const receipt = data[1];
  if (!receipt || typeof receipt !== "object" || Array.isArray(receipt)) return false;
  return receipt.calendarId === PHYSICIAN_CALENDAR_ID && typeof receipt.fingerprint === "string" && receipt.fingerprint.trim().length > 0;
}

export function installPhysicianScheduleListener(): () => void {
  if (window.location.pathname.replace(/\/$/, "").toLowerCase() !== "/thank-you") return () => {};
  let handled = false;
  const listener = (event: MessageEvent) => {
    if (handled) return;
    const frame = document.querySelector<HTMLIFrameElement>("iframe[data-appointment-calendar-embed]");
    if (!isPhysicianBookingComplete(event, frame)) return;
    const tracking = (window as typeof window & { MmdMetaLead?: { schedule?: () => boolean } }).MmdMetaLead;
    if (tracking?.schedule?.() === true) handled = true;
  };
  window.addEventListener("message", listener);
  return () => window.removeEventListener("message", listener);
}
