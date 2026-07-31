/**
 * Manual test: sends a realistic payment_success payload directly to the GHL webhook URL.
 * Run with: node send-test-ghl-webhook.mjs
 */

const GHL_URL =
  "https://services.leadconnectorhq.com/hooks/cFQraxSJv1aDKQFAghbI/webhook-trigger/d37a2de2-c00f-40ed-bb00-a8efa3127093";

const payload = {
  event: "payment_success",
  landing_page_path: "/lp/hrt3",
  email: "testlead@medmethoddirect.com",
  phone: "+15550001234",
  first_name: "Test",
  last_name: "Lead",
  payment_amount: "50.00",
  payment_currency: "USD",
  payment_status: "succeeded",
  transaction_id: `test_txn_${Date.now()}`,
  product_name: "Initial Consultation Deposit",
  stripe_customer_id: "cus_test_manual",
  payment_method_type: "card",
  created_at: new Date().toISOString(),
};

console.log("Sending test GHL webhook payload...");
console.log("URL:", GHL_URL);
console.log("Payload:", JSON.stringify(payload, null, 2));

try {
  const resp = await fetch(GHL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15_000),
  });
  const body = await resp.text().catch(() => "(no body)");
  console.log(`\nHTTP Status: ${resp.status} ${resp.statusText}`);
  console.log("Response body:", body);
  if (resp.ok) {
    console.log("\n✅ SUCCESS — GHL received the payload.");
    console.log("Check GHL for a new contact: testlead@medmethoddirect.com");
  } else {
    console.log("\n❌ FAILED — GHL returned a non-2xx status.");
  }
} catch (err) {
  console.error("\n❌ Network error:", err.message);
}
