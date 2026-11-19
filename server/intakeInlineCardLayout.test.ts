import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Read-only, offline source QA. No SDK evaluation, browser, requests, secrets, or payments.
const root = resolve(import.meta.dirname, "..");
const baseline = "3ec72dbc4d6a4659e65fc76ed78c1709dd853c24";
const version = "?v=20261119-inline-card-v2";
const htmlPath = "client/intake/index.html";
const jsPath = "client/public/intake/text-payment.js";
const cssPath = "client/public/intake/text-payment.css";
const apiPath = "client/public/intake/text-payment-api.js";
const servicePath = "server/intakeTextPaymentService.ts";
const selfPath = "server/intakeInlineCardLayout.test.ts";
const assets = ["text-payment.css", "text-payment-api.js", "text-payment.js"] as const;
const git = (...args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
const current = (path: string) => readFileSync(resolve(root, path), "utf8");
const historical = (path: string) => git("show", `${baseline}:${path}`);
const sha256 = (source: string | Buffer) => createHash("sha256").update(source).digest("hex");
const occurrences = (source: string, fragment: string) => source.split(fragment).length - 1;
const html = current(htmlPath);
const source = current(jsPath);
const css = current(cssPath);
const beforeHtml = historical(htmlPath);
const beforeJs = historical(jsPath);

// Independently computed from git show 3ec72dbc:<path>, not the working tree.
const baselineHashes: Record<string, string> = {
  [htmlPath]: "c594739e8211e15a7d5eb38886cece359626125e1d0109273ac9bc6d3cad4462",
  [jsPath]: "bb062f4c6118225fba814c9e49e9761ecba75e02a6c1da6c9f437a4623d4f065",
  [cssPath]: "3db9dbd301f2091fc764803200d76cbd4d6f0b097038cee0dd258868c2dd9f4d",
  [apiPath]: "b07fa08c750839fa92a68105a2020a913495393f1febcfbbc2d6856fec3e9c4d",
  "client/intake-text-payment-transport.ts": "a006a5ba9fe3f7a2fe1e0c7ceb0a540316ea9d59a3f3306d1daa8b96a4ca5fca",
  [servicePath]: "6736cc5d9ecae6ba1129ae6c81dd5fcbf800103a703935131d1d1b3d3149d241",
};

function inverseAssetVersions(input: string): string {
  let restored = input;
  for (const asset of assets) {
    const approved = `/intake/${asset}${version}`;
    if (occurrences(restored, approved) !== 1) throw new Error(`Expected exactly one approved version: ${asset}`);
    // Intentionally not a global suffix removal: only these three complete paths qualify.
    restored = restored.replace(approved, `/intake/${asset}`);
  }
  return restored;
}

type Fragment = { label: string; old: string; approved: string };
const fragments: Fragment[] = [
  {
    label: "hosted name ref",
    old: "      var root = React.useRef(null), numberHost = React.useRef(null), expiryHost = React.useRef(null), securityHost = React.useRef(null);\n",
    approved: "      var root = React.useRef(null), nameHost = React.useRef(null), numberHost = React.useRef(null), expiryHost = React.useRef(null), securityHost = React.useRef(null);\n",
  },
  {
    label: "name host readiness guard",
    old: "        if (!sdk || !config || !numberHost.current || !expiryHost.current || !securityHost.current) return;\n",
    approved: "        if (!sdk || !config || !nameHost.current || !numberHost.current || !expiryHost.current || !securityHost.current) return;\n",
  },
  {
    label: "provider NameField factory",
    old: "",
    approved: "          var name = instance.NameField({ placeholder: \"Cardholder name\" });\n",
  },
  {
    label: "four provider fields for cleanup",
    old: "          fields = [number, expiry, security];\n",
    approved: "          fields = [name, number, expiry, security];\n",
  },
  {
    label: "wait for all four hosted renders",
    old: "          Promise.all([number.render(numberHost.current), expiry.render(expiryHost.current), security.render(securityHost.current)])\n",
    approved: "          Promise.all([name.render(nameHost.current), number.render(numberHost.current), expiry.render(expiryHost.current), security.render(securityHost.current)])\n",
  },
  {
    label: "name label and hosted container before number",
    old: "",
    approved: "          field(nameHost, \"Cardholder name\", \"mmd-text-card-name\"),\n",
  },
  {
    label: "secure $29 CTA wording",
    old: "            \"aria-disabled\": props.valid !== true || undefined, onClick: submitCard, children: busy ? \"Processing payment…\" : \"Pay $29\" }),\n",
    approved: "            \"aria-disabled\": props.valid !== true || undefined, onClick: submitCard, children: busy ? \"Processing payment…\" : \"Pay $29 securely →\" }),\n",
  },
];

function inverseInlineCard(input: string): string {
  let restored = input;
  for (const fragment of [...fragments].reverse()) {
    if (occurrences(restored, fragment.approved) !== 1) throw new Error(`Unexpected approved fragment count: ${fragment.label}`);
    restored = restored.replace(fragment.approved, fragment.old);
  }
  return restored;
}

function block(input: string, start: string, end: string): string {
  if (occurrences(input, start) !== 1 || occurrences(input, end) < 1) throw new Error(`Missing or nonunique block boundaries: ${start}`);
  const first = input.indexOf(start), last = input.indexOf(end, first + start.length);
  if (last < first) throw new Error(`Invalid block boundaries: ${start}`);
  return input.slice(first, last);
}

const callbacks = [
  ["createOrder", "      function createOrder() {", "      function approve(data) {"],
  ["approve", "      function approve(data) {", "      function checkStatus(activeConfig) {"],
  ["checkStatus", "      function checkStatus(activeConfig) {", "      React.useLayoutEffect(function () {"],
  ["submitCard", "      function submitCard() {", "      function field(ref, label, extra) {"],
] as const;

const frozenPaymentPaths = [
  apiPath,
  "client/intake-text-payment-transport.ts",
  servicePath,
  "server/intakeTextPaymentStore.ts",
  "server/intakeTextPaymentIntegration.ts",
  "server/intakeTextPaymentWorker.ts",
  "server/routers/intakeTextPayment.ts",
  "server/intakePaymentRoutes.ts",
  "server/intakeSubmissionContract.ts",
  "server/paypalPaymentWebhook.ts",
  "server/routers/paypal.ts",
  "server/referralCredits.ts",
  "server/routers/referralCredits.ts",
  "shared/treatmentCatalog.json",
  "client/public/treatment-catalog.js",
];

describe("approved inline card layout and cache-version exact scope against 3ec72dbc", () => {
  it("pins the independently computed baseline commit and SHA-256 values", () => {
    expect(git("rev-parse", "3ec72dbc").trim()).toBe(baseline);
    for (const [path, digest] of Object.entries(baselineHashes)) expect(sha256(historical(path)), path).toBe(digest);
  });

  it("links each of exactly three checkout assets once with the same approved version", () => {
    const references = [...html.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/g)].map(match => match[1]);
    const linked = references.filter(reference => assets.some(asset => reference.startsWith(`/intake/${asset}`)));
    expect(linked).toHaveLength(3);
    for (const asset of assets) {
      expect(linked.filter(reference => reference === `/intake/${asset}${version}`), asset).toHaveLength(1);
      expect(occurrences(html, `/intake/${asset}`), asset).toBe(1);
    }
    expect(occurrences(html, version)).toBe(3);
    expect(html).toContain(`<link rel="stylesheet" href="/intake/text-payment.css${version}" />`);
    expect(html).toContain(`<script src="/intake/text-payment-api.js${version}"></script>`);
    expect(html).toContain(`<script src="/intake/text-payment.js${version}"></script>`);
  });

  it("restores all HTML bytes and hash after removing versions from only the three allowed paths", () => {
    const restored = inverseAssetVersions(html);
    expect(sha256(restored)).toBe(baselineHashes[htmlPath]);
    expect(restored).toBe(beforeHtml);
    // Full-source equality freezes every inline panel style, questionnaire, $349 price, and referral flow.
    expect(occurrences(restored, "349")).toBe(occurrences(beforeHtml, "349"));
    expect(occurrences(restored.toLowerCase(), "referral")).toBe(occurrences(beforeHtml.toLowerCase(), "referral"));
    expect([...restored.matchAll(/<style\b[^>]*>[\s\S]*?<\/style>/g)].map(match => match[0]))
      .toEqual([...beforeHtml.matchAll(/<style\b[^>]*>[\s\S]*?<\/style>/g)].map(match => match[0]));
  });

  it("rejects missing, duplicated, or wrong-version HTML links and cannot hide unrelated changes", () => {
    for (const asset of assets) {
      const approved = `/intake/${asset}${version}`;
      expect(() => inverseAssetVersions(html.replace(approved, `/intake/${asset}`))).toThrow();
      expect(() => inverseAssetVersions(html + approved)).toThrow();
      expect(() => inverseAssetVersions(html.replace(approved, `/intake/${asset}?v=unapproved`))).toThrow();
    }
    const unrelated = html + `<script src="/intake/unapproved.js${version}"></script>`;
    expect(inverseAssetVersions(unrelated)).toContain(`/intake/unapproved.js${version}`);
    expect(sha256(inverseAssetVersions(unrelated))).not.toBe(baselineHashes[htmlPath]);
  });

  it("inverses exactly seven approved JS fragments to the complete baseline source and SHA", () => {
    expect(fragments).toHaveLength(7);
    for (const fragment of fragments) {
      expect(occurrences(beforeJs, fragment.approved), fragment.label).toBe(0);
      if (fragment.old) expect(occurrences(beforeJs, fragment.old), fragment.label).toBe(1);
    }
    const restored = inverseInlineCard(source);
    expect(sha256(restored)).toBe(baselineHashes[jsPath]);
    expect(restored).toBe(beforeJs);
  });

  it("rejects missing or duplicated approved JS fragments and exposes nonapproved source edits", () => {
    for (const fragment of fragments) {
      expect(() => inverseInlineCard(source.replace(fragment.approved, fragment.old))).toThrow();
      expect(() => inverseInlineCard(source + fragment.approved)).toThrow();
    }
    expect(sha256(inverseInlineCard(source + "\n// UNAPPROVED SOURCE CHANGE\n"))).not.toBe(baselineHashes[jsPath]);
  });

  it.each(callbacks)("keeps the %s payment callback byte-identical to baseline", (_name, start, end) => {
    expect(block(source, start, end)).toBe(block(beforeJs, start, end));
  });

  it("keeps SDK initialization, namespace, mode guards, configuration, and privacy blocks unchanged", () => {
    const boundary = "  window.MmdCreateTextPayment = function (React, JSX, helpers) {";
    expect(source.slice(0, source.indexOf(boundary))).toBe(beforeJs.slice(0, beforeJs.indexOf(boundary)));
    expect(block(source, boundary, "    return function TextPayment(props) {"))
      .toBe(block(beforeJs, boundary, "    return function TextPayment(props) {"));
    expect(block(source, "      React.useLayoutEffect(function () {", "      React.useEffect(function () {"))
      .toBe(block(beforeJs, "      React.useLayoutEffect(function () {", "      React.useEffect(function () {"));
    expect(block(source, "      function field(ref, label, extra) {", "      var unavailable = loading === \"ready\" && funding.card === false;"))
      .toBe(block(beforeJs, "      function field(ref, label, extra) {", "      var unavailable = loading === \"ready\" && funding.card === false;"));
    expect(source).toContain('var NAMESPACE = "mmdTextPayPal";');
    expect(source).toContain('createOrder: createOrder, onApprove: approve, onCancel: paymentFailed, onError: paymentFailed,');
  });

  it("uses provider NameField before NumberField and preserves the expiry/CVV row and exact secure CTA", () => {
    expect(occurrences(source, '.NameField(')).toBe(1);
    expect(source).toContain('fields = [name, number, expiry, security];');
    expect(source).toContain('Promise.all([name.render(nameHost.current), number.render(numberHost.current), expiry.render(expiryHost.current), security.render(securityHost.current)])');
    expect(source).toContain([
      '          field(nameHost, "Cardholder name", "mmd-text-card-name"),',
      '          field(numberHost, "Card number", "mmd-text-card-number"),',
      '          JSX.jsxs("div", { className: "mmd-text-card-row", children: [field(expiryHost, "Expiration date"), field(securityHost, "Security code")] }),',
    ].join("\n"));
    expect(source.indexOf("instance.NameField(")).toBeLessThan(source.indexOf("instance.NumberField("));
    expect(occurrences(source, '"Pay $29 securely →"')).toBe(1);
    expect(occurrences(source, 'className: "mmd-text-payment-pay"')).toBe(1);
    expect(source).not.toMatch(/JSX\.jsxs?\(["'](?:input|textarea|iframe)["']|\.value\b|\[\s*["']value["']\s*\]|\b(?:defaultValue|onInput|onChange)\s*:/);
    expect(source).not.toMatch(/card_number|\b(?:cvv|pan|cardNumber|securityCode)\s*:|["'](?:cvv|pan|cardNumber|securityCode)["']\s*:/i);
    expect(source).not.toMatch(/console\.|\.identify\(|\.track\(|gtag\(|fbq\(|localStorage|client_secret|client\.secret/);
    expect(source).toContain('JSON.stringify(opaquePair(pair))');
  });

  it("freezes every checkout CSS byte including existing two-column expiry/CVV styling", () => {
    expect(sha256(readFileSync(resolve(root, cssPath)))).toBe(baselineHashes[cssPath]);
    expect(css).toBe(historical(cssPath));
    expect(css).toContain('.mmd-text-card-row { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 12px; }');
    expect(css).toContain('display: block; width: 100%; min-height: 48px; margin: 4px 0 0;');
  });

  it("freezes payment transport/services, mode/payment processing, treatment pricing, and referral source hashes", () => {
    for (const path of frozenPaymentPaths) {
      const digest = sha256(historical(path));
      expect(sha256(readFileSync(resolve(root, path))), path).toBe(digest);
      if (baselineHashes[path]) expect(digest, path).toBe(baselineHashes[path]);
    }
  });

  it("keeps every other standalone intake CSS/JS/HTML asset and referenced panel stylesheet unchanged", () => {
    const paths = git("ls-tree", "-r", "--name-only", baseline, "--", "client/public/intake").trim().split("\n")
      .filter(path => /\.(?:css|js|html)$/.test(path) && path !== jsPath);
    expect(paths.length).toBeGreaterThan(20);
    for (const path of paths) expect(sha256(readFileSync(resolve(root, path))), path).toBe(sha256(historical(path)));
    const panelPaths = ["client/public/intake/premium.css", "client/public/intake/usability.css", "client/public/intake/contrast.css", "client/public/intake/premium-ui.js"];
    for (const path of panelPaths) expect(paths).toContain(path);
  });

  it("permits no changed or new source files outside the approved HTML/JS and the two QA tests", () => {
    const scope = ["client", "server", "shared", "drizzle", "package.json", "pnpm-lock.yaml", "vite.config.ts", "vitest.config.ts"];
    const changed = git("diff", "--name-only", baseline, "--", ...scope).trim().split("\n").filter(Boolean);
    const untracked = git("ls-files", "--others", "--exclude-standard", "--", ...scope).trim().split("\n").filter(Boolean);
    const allowed = new Set([htmlPath, jsPath, "server/intakeTextPaymentUi.test.ts", selfPath]);
    expect([...new Set([...changed, ...untracked])].filter(path => !allowed.has(path))).toEqual([]);
  });
});
