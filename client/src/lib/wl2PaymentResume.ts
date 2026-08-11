export const WL2_PAYMENT_RESUME_KEY = "wl2-payment-resume";

export type WL2PaymentResume = {
  paymentId: number;
  firstName: string;
  email: string;
  phone: string;
};

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function createWl2ThreeDsReturnUrl(origin: string): string {
  return `${origin}/lp/WL2?wl2_3ds=1`;
}

export function getWl2ThreeDsPaymentIntent(search: string): string | null {
  const params = new URLSearchParams(search);
  if (params.get("wl2_3ds") !== "1" || params.get("redirect_status") !== "succeeded") return null;
  return params.get("payment_intent");
}

export function saveWl2PaymentResume(payload: WL2PaymentResume, storage: StorageLike = sessionStorage): void {
  storage.setItem(WL2_PAYMENT_RESUME_KEY, JSON.stringify(payload));
}

export function getWl2PaymentResume(storage: StorageLike = sessionStorage): WL2PaymentResume | null {
  try {
    const raw = storage.getItem(WL2_PAYMENT_RESUME_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WL2PaymentResume;
    if (!Number.isInteger(parsed.paymentId) || !parsed.firstName || !parsed.email || !parsed.phone) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearWl2PaymentResume(storage: StorageLike = sessionStorage): void {
  storage.removeItem(WL2_PAYMENT_RESUME_KEY);
}
