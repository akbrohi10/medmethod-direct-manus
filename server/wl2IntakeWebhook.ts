import { ENV } from "./_core/env";

export interface WL2IntakeWebhookPayload {
  first_name: string;
  email: string;
  phone: string;
  zip_code: string;
  weight_goal: string;
  weight_duration: string;
  glp1_before: string;
  glp1_details: string;
  conditions: string;
  medications: string;
  has_labs: string;
  primary_goal: string;
  activity_level: string;
  height: string;
  weight_lbs: string;
  age: string;
  sex: string;
  landing_page: "/lp/WL2";
}

export interface WL2WebhookDeliveryResult {
  delivered: boolean;
  status: number;
}

/** Sends a completed WL2 intake to GoHighLevel without exposing the URL in the browser. */
export async function deliverWL2IntakeToGhl(
  payload: WL2IntakeWebhookPayload,
): Promise<WL2WebhookDeliveryResult> {
  const webhookUrl = ENV.ghlWl2IntakeWebhookUrl;

  if (!webhookUrl) {
    console.error("[WL2 intake webhook] Destination URL is not configured.");
    return { delivered: false, status: 0 };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.error(`[WL2 intake webhook] Delivery failed with HTTP ${response.status}.`);
    }

    return { delivered: response.ok, status: response.status };
  } catch (error) {
    console.error("[WL2 intake webhook] Delivery request failed.", error instanceof Error ? error.name : "Unknown error");
    return { delivered: false, status: 0 };
  }
}
