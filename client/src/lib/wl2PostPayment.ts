export const WL2_POST_PAYMENT_PATH = "/thank-you2";
export const WL2_PREVIEW_PAYMENT_SKIP_PATH = "/thank-you2?preview=1";

export interface Wl2PostPaymentPayload {
  first_name: string;
  email: string;
  phone: string;
  payment_id: number;
  transaction_id: string;
  payment_processor: string;
  landing_page: "/lp/WL2";
  amount: 15;
  remaining_amount: 0;
  payment_status: "fully_paid";
  payment_type: "one_time_refundable_hold";
}

type FetchLike = (input: string, init: RequestInit) => Promise<unknown>;
type Navigate = (path: string) => void;

/** Sends the conversion webhook without delaying navigation to the URL-trackable thank-you page. */
export function handoffWl2PostPayment({
  fetchImpl,
  navigate,
  webhookUrl,
  payload,
}: {
  fetchImpl: FetchLike;
  navigate: Navigate;
  webhookUrl: string;
  payload: Wl2PostPaymentPayload;
}) {
  void fetchImpl(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify(payload),
  }).catch(() => undefined);

  navigate(WL2_POST_PAYMENT_PATH);
}
