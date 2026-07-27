/**
 * Test script: sends two dummy GHL payment-success payloads
 * — one for /lp/glp1, one for /lp/hrt3 —
 * directly to the GoHighLevel inbound webhook URL.
 *
 * Usage:
 *   node scripts/test-payment-webhook.mjs
 *
 * This bypasses Stripe signature verification and calls the GHL URL directly
 * so you can confirm the field mapping in GHL before going live.
 */

const GHL_URL =
  "https://services.leadconnectorhq.com/hooks/cFQraxSJv1aDKQFAghbI/webhook-trigger/d37a2de2-c00f-40ed-bb00-a8efa3127093";

const payloads = [
  {
    label: "TEST 1 — /lp/glp1",
    body: {
      event: "payment_success",
      landing_page_path: "/lp/glp1",
      email: "test.patient.glp1@medmethodtest.com",
      phone: "+15551234567",
      first_name: "Jane",
      last_name: "Doe",
      form_submission_id: "test-pay-001",
      payment_amount: "50.00",
      payment_currency: "USD",
      payment_status: "succeeded",
      transaction_id: "pi_test_glp1_dummy_001",
      payment_processor: "stripe",
      product_name: "MedMethod Direct — $50 deposit (GLP-1 consultation)",
      paid_at: new Date().toISOString(),
    },
  },
  {
    label: "TEST 2 — /lp/hrt3",
    body: {
      event: "payment_success",
      landing_page_path: "/lp/hrt3",
      email: "test.patient.hrt3@medmethodtest.com",
      phone: "+15559876543",
      first_name: "Sarah",
      last_name: "Smith",
      form_submission_id: "test-pay-002",
      payment_amount: "50.00",
      payment_currency: "USD",
      payment_status: "succeeded",
      transaction_id: "pi_test_hrt3_dummy_001",
      payment_processor: "stripe",
      product_name: "MedMethod Direct — $50 deposit (HRT consultation)",
      paid_at: new Date().toISOString(),
    },
  },
];

async function sendPayload(label, body) {
  console.log(`\n──────────────────────────────────────────`);
  console.log(`Sending: ${label}`);
  console.log(`Payload:\n${JSON.stringify(body, null, 2)}`);

  try {
    const resp = await fetch(GHL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await resp.text();
    console.log(`HTTP Status: ${resp.status}`);
    console.log(`Response: ${text}`);
    if (resp.ok) {
      console.log(`✅ ${label} — DELIVERED`);
    } else {
      console.log(`❌ ${label} — FAILED (${resp.status})`);
    }
  } catch (err) {
    console.error(`❌ ${label} — NETWORK ERROR: ${err.message}`);
  }
}

for (const { label, body } of payloads) {
  await sendPayload(label, body);
}

console.log("\n──────────────────────────────────────────");
console.log("Done. Check GHL → Contacts for the two test contacts.");
console.log("Email 1: test.patient.glp1@medmethodtest.com");
console.log("Email 2: test.patient.hrt3@medmethodtest.com");
