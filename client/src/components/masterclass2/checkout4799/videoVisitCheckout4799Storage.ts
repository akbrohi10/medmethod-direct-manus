import { getVideoVisitPendingCheckout as getLegacyVideoVisitPendingCheckout } from "../videoVisitCheckoutStorage";

export const MASTERCLASS_VIDEO_4799_PENDING_KEY = "masterclass-video4799-pending-v1";

export type VideoVisitProvider = "paypal" | "stripe";

export type VideoVisitPendingCheckout = {
  version: 1;
  provider: VideoVisitProvider;
  checkoutId: string;
  checkoutToken: string;
  orderId?: string;
  paymentIntentId?: string;
  paymentMethod?: "card" | "apple_pay";
  phase?: "created" | "confirming" | "provider_approved";
};

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function isUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    )
  );
}

function isPendingCheckout(value: unknown): value is VideoVisitPendingCheckout {
  if (!value || typeof value !== "object") return false;
  const pending = value as Partial<VideoVisitPendingCheckout>;
  if (
    pending.version !== 1 ||
    (pending.provider !== "paypal" && pending.provider !== "stripe") ||
    !isUuid(pending.checkoutId) ||
    typeof pending.checkoutToken !== "string" ||
    pending.checkoutToken.length === 0
  ) {
    return false;
  }
  if (
    pending.phase !== undefined &&
    pending.phase !== "created" &&
    pending.phase !== "confirming" &&
    pending.phase !== "provider_approved"
  )
    return false;

  if (pending.provider === "paypal") {
    return (
      typeof pending.orderId === "string" &&
      pending.orderId.length > 0 &&
      (pending.paymentMethod === "card" ||
        pending.paymentMethod === "apple_pay")
    );
  }

  return (
    typeof pending.paymentIntentId === "string" &&
    pending.paymentIntentId.length > 0
  );
}

function browserStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

/**
 * Stores only anonymous provider-recovery metadata. Contact information and
 * provider secrets intentionally never enter browser storage.
 */
export function saveVideoVisitPendingCheckout(
  pending: VideoVisitPendingCheckout,
  storage: StorageLike | null = browserStorage()
): void {
  if (!storage || !isPendingCheckout(pending)) return;
  try {
    storage.setItem(MASTERCLASS_VIDEO_4799_PENDING_KEY, JSON.stringify(pending));
  } catch {
    // Private browsing, security policy, or quota failures must not make a
    // successful provider payment look like a failed payment to the patient.
  }
}

export function getVideoVisitPendingCheckout(
  storage: StorageLike | null = browserStorage()
): VideoVisitPendingCheckout | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(MASTERCLASS_VIDEO_4799_PENDING_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isPendingCheckout(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearVideoVisitPendingCheckout(
  storage: StorageLike | null = browserStorage()
): void {
  if (!storage) return;
  try {
    storage.removeItem(MASTERCLASS_VIDEO_4799_PENDING_KEY);
  } catch {
    // Clearing recovery metadata is best-effort for the same browser-storage
    // failures handled while saving it.
  }
}

export function createVideoVisitCheckoutId(): string | null {
  if (typeof crypto === "undefined") return null;
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();

  if (typeof crypto.getRandomValues !== "function") return null;
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function isVideoVisitThankYouPath(
  value: unknown
): value is "/thank-you-video-4799" {
  return value === "/thank-you-video-4799";
}

/** Redirect only after a server-confirmed, exact allowlisted path. */
export function redirectToVideoVisitThankYou(value: unknown): boolean {
  if (!isVideoVisitThankYouPath(value) || typeof window === "undefined")
    return false;
  window.location.assign(value);
  return true;
}

/** Resume old confirmed/approved payments before offering a new-price checkout. */
export function getMasterclass2VideoPendingCheckout(): VideoVisitPendingCheckout | null {
  return getLegacyVideoVisitPendingCheckout() ?? getVideoVisitPendingCheckout();
}
