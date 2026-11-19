import { createTRPCProxyClient, httpLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "../server/routers";

// The standalone intake cannot mount the site's React providers. It uses the same
// official, typed tRPC transport; no new REST endpoints or clinical URL parameters.
const client = createTRPCProxyClient<AppRouter>({
  links: [httpLink({ url: "/api/trpc", transformer: superjson, headers: { "X-MMD-Text-Payment": "1" } })],
});
const payment = client.intakeTextPayment;
// Demo may select only Sandbox, never Live. No secret credentials enter this client.
const demoSandbox = new URLSearchParams(window.location.search).get("prefill") === "demo";
const pendingKey = demoSandbox ? "mmd_text_payment_demo_v1" : "mmd_text_payment_v1";
const safeError = "Your payment didn't go through. Please try again or use a different card.";
function input(options?: { body?: string }) {
  return options?.body ? JSON.parse(options.body) : {};
}
const api = {
  async request(path: string, options?: { body?: string }) {
    switch (path) {
      case "/api/intake/text-payment/config": return payment.config.query(demoSandbox ? { demo_mode: true } : undefined);
      case "/api/intake/text-payment/order": return payment.order.mutate(input(options));
      case "/api/intake/text-payment/capture": return payment.capture.mutate(input(options));
      case "/api/intake/text-payment/status": return payment.status.mutate(input(options));
      default: throw new Error(safeError);
    }
  },
  async restore() {
    const raw = window.sessionStorage.getItem(pendingKey);
    const value = raw ? JSON.parse(raw) : null;
    if (!value || typeof value.payment_token !== "string") throw new Error("Your saved intake is unavailable or expired. Please start a new assessment.");
    const result = await payment.restore.mutate({ payment_token: value.payment_token });
    window.sessionStorage.setItem(pendingKey, JSON.stringify({ payment_token: result.payment_token, order_id: result.order_id }));
    return result;
  },
  async resume(token: string) {
    const result = await payment.resume.mutate({ token });
    // No answers, names, phone numbers, signatures, or files are saved in the browser.
    window.sessionStorage.setItem(pendingKey, JSON.stringify({
      payment_token: result.payment_token, order_id: result.order_id,
    }));
    return result;
  },
};
Object.assign(window, { MmdTextPaymentApi: api });
