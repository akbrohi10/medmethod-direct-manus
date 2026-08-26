import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");

function read(relativePath: string): string {
  return readFileSync(resolve(projectRoot, relativePath), "utf8");
}

describe("Shipping Policy page and footer link", () => {
  it("registers the dedicated public route", () => {
    const appSource = read("client/src/App.tsx");

    expect(appSource).toContain(
      'const ShippingPolicy = lazy(() => import("@/pages/ShippingPolicy"));',
    );
    expect(appSource).toContain(
      '<Route path="/shipping-policy" component={ShippingPolicy} />',
    );
  });

  it("preserves the supplied policy title, effective date, and key fulfillment terms", () => {
    const policySource = read("client/src/pages/ShippingPolicy.tsx");

    expect(policySource).toContain("Shipping Policy");
    expect(policySource).toContain("Effective Date: August 25, 2026");
    expect(policySource).toContain(
      "All prescription medication orders, shipping charges,",
    );
    expect(policySource).toContain("1. Pharmacy Fulfillment");
    expect(policySource).toContain("6. Temperature-Sensitive Medications");
    expect(policySource).toContain(
      "7. Damaged, Incorrect, Missing, or Compromised Shipments",
    );
    expect(policySource).toContain(
      "9. No Returns, Exchanges, or Routine Refunds",
    );
    expect(policySource).toContain("10. Questions and Contact");
  });

  it("links the page from both footer variants and the public page index", () => {
    const footerSources = [
      read("client/src/components/Footer.tsx"),
      read("client/src/components/home1/Footer.tsx"),
    ];
    const llms = read("client/public/llms.txt");

    for (const footer of footerSources) {
      expect(footer).toContain(
        '{ label: "Shipping Policy", href: "/shipping-policy"',
      );
    }

    expect(llms).toContain(
      "https://medmethoddirect.com/shipping-policy",
    );
  });
});
