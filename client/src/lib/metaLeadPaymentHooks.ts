/** First-party success provenance only. No provider/contact/receipt data reaches the Lead helper. */
export const META_LEAD_PAYMENT_PREFIX = "mmd_meta_payment_v1:";
export const KNOWN_INTAKE_RECEIPTS = [
  "mmd_free_intake_receipt",
  "mmd_video_visit_checkout",
  "mmd_meta_intake_accepted_v1",
  "mmd_meta_session_excluded_v1",
] as const;

const PAYMENT_DESTINATIONS = [
  "/thank-you", "/thank-you2", "/thank-you-video", "/thank-you-video-4799", "/thank-you-video-97",
] as const;
type Provider = "stripe" | "paypal";
type PaymentWindow = Window & { MmdMetaLead?: { arm: (destination: string, options: { excluded: boolean }) => unknown } };
type PaymentMark = { v: 1; excluded: boolean; finished: boolean };

function paymentKey(provider: Provider, id: unknown): string | null {
  return (provider === "stripe" || provider === "paypal") && typeof id === "string" && /^[A-Za-z0-9_-]{1,128}$/.test(id)
    ? `${META_LEAD_PAYMENT_PREFIX}${provider}:${id}` : null;
}
function browser(): PaymentWindow | null {
  return typeof window === "undefined" ? null : window as PaymentWindow;
}
function excludedSession(win: PaymentWindow): boolean {
  // Presence only: never parse intake receipts, patient answers, contact details, or URLs.
  return KNOWN_INTAKE_RECEIPTS.some(key => win.sessionStorage.getItem(key) !== null);
}
function readMark(win: PaymentWindow, key: string): PaymentMark | null {
  const mark = JSON.parse(win.sessionStorage.getItem(key) || "null");
  return mark?.v === 1 && typeof mark.excluded === "boolean" && typeof mark.finished === "boolean" ? mark : null;
}

/** Called at an existing provider-created result, not a conversion. Exclusion is sticky per payment. */
export function rememberPaymentLeadProvenance(provider: Provider, id: unknown, options: { excluded?: boolean } = {}): void {
  try {
    const win = browser();
    const key = paymentKey(provider, id);
    if (!win || !key) return;
    const prior = readMark(win, key);
    const excluded = options.excluded === true || excludedSession(win) || prior?.excluded === true;
    win.sessionStorage.setItem(key, JSON.stringify({ v: 1, excluded, finished: prior?.finished === true }));
  } catch { /* Measurement must never affect payment processing. */ }
}

/** Invoke ONLY after an existing SDK/server has verified actual completed payment. */
export function armVerifiedPaymentLead(destination: unknown, provider: Provider, id: unknown, live: boolean): boolean {
  try {
    const win = browser();
    const key = paymentKey(provider, id);
    if (!win || !key || typeof destination !== "string" || !PAYMENT_DESTINATIONS.some(path => path === destination)) return false;
    const prior = readMark(win, key);
    // This destination is also owned by accepted intake: never arm over its intake flag.
    if (destination === "/thank-you-video" && (prior?.excluded || excludedSession(win))) return false;
    // Unknown/pre-existing checkout provenance cannot be promoted to a new standalone Lead.
    const excluded = live !== true || !prior || prior.excluded || excludedSession(win);
    if (prior?.finished && (!excluded || prior.excluded)) return false;
    if (typeof win.MmdMetaLead?.arm !== "function") return false;
    // Mark before arming: repeated callbacks must never refresh an already consumed token/TTL.
    win.sessionStorage.setItem(key, JSON.stringify({ v: 1, excluded, finished: true }));
    win.MmdMetaLead.arm(destination, { excluded });
    return !excluded;
  } catch { return false; }
}

type VerifiedToken = { v?: unknown; kind?: unknown; provider?: unknown; providerId?: unknown; mode?: unknown; source?: unknown };
const VIDEO_SOURCES: Record<string, string> = {
  "/thank-you-video": "/masterclass2",
  "/thank-you-video-4799": "/masterclass2",
  "/thank-you-video-97": "/weight-loss-menopauseV2",
};

/** Metadata from the exact signed token already authenticated by the successful server mutation. */
export function armVerifiedVideoPaymentLead(destination: unknown, provider: Provider, id: string, verifiedCheckoutToken: string): boolean {
  try {
    if (typeof destination !== "string" || !Object.hasOwn(VIDEO_SOURCES, destination)) return false;
    const parts = verifiedCheckoutToken.split(".");
    if (parts.length !== 2 || !parts[0] || !parts[1]) return false;
    const token = JSON.parse(atob(parts[0].replace(/-/g, "+").replace(/_/g, "/"))) as VerifiedToken;
    if (token.v !== 1 || token.kind !== "checkout" || token.provider !== provider || token.providerId !== id || token.source !== VIDEO_SOURCES[destination]) return false;
    return armVerifiedPaymentLead(destination, provider, id, token.mode === "live");
  } catch { return false; }
}
