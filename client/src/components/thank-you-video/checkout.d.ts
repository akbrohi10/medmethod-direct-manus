export interface ThankYouVideoReceipt {
  submission_id: string;
  submission_token: string;
  sms_opt_in: boolean;
  video_visit_interest: boolean;
  is_test: boolean;
  payment_status: "NOT_REQUIRED";
}

export type ThankYouVideoCheckoutDisposer = () => void;

export declare function initializeThankYouVideoCheckout(
  root: HTMLElement,
  receipt: ThankYouVideoReceipt,
  onConfirmed: () => void,
): ThankYouVideoCheckoutDisposer;
