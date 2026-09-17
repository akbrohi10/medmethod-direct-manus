import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Google Tag Manager installation", () => {
  const documentTemplate = readFileSync(
    resolve(process.cwd(), "client/index.html"),
    "utf8",
  );

  it("loads the supplied GTM container at the top of the shared head", () => {
    expect(documentTemplate).toMatch(
      /<head>\s*<meta charset="UTF-8"\s*\/>\s*<!-- Google Tag Manager -->/,
    );
    expect(documentTemplate).toContain("GTM-KMBG6HSR");
    expect(documentTemplate).toContain(
      'https://www.googletagmanager.com/gtm.js?id=" + i + dl',
    );
    expect(documentTemplate.match(/GTM-KMBG6HSR/g)).toHaveLength(2);
  });

  it("keeps the supplied noscript fallback immediately inside the body", () => {
    expect(documentTemplate).toMatch(
      /<body>\s*<!-- Google Tag Manager \(noscript\) -->\s*<noscript><iframe src="https:\/\/www\.googletagmanager\.com\/ns\.html\?id=GTM-KMBG6HSR"/,
    );
  });
});
