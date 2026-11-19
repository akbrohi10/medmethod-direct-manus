import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const source = readFileSync(resolve(import.meta.dirname, "../client/public/intake/text-payment.js"), "utf8");
const css = readFileSync(resolve(import.meta.dirname, "../client/public/intake/text-payment.css"), "utf8");
const config = { configured: true, client_id: "sandbox_public_client_123", environment: "sandbox", amount: "29.00", currency: "USD" };
const pair = { payment_token: "opaque.payment.capability", order_id: "ORDER_29" };
const receipt = { payment_status: "COMPLETED", payment_provider: "paypal", amount: "29.00", environment: "sandbox", redirect_url: "/intake/thank-you/", submission_token: "receipt_only" };
const decline = "Your payment didn't go through. Please try again or use a different card.";
const tick = () => new Promise<void>(resolve => setImmediate(resolve));
const fieldNames = ["NameField", "NumberField", "ExpiryField", "CVVField"] as const;

// Minimal deterministic React hooks/DOM harness. SDK scripts never execute and every request is mocked.
// Provider fields contain no PAN/CVV/name values: only validity and opaque provider order IDs are modeled.
function harness(options: { config?: any; saved?: any; savedDemo?: any; search?: string; cardEligible?: boolean; cardValid?: boolean; request?: any; autoSdk?: boolean; missingCardFields?: boolean; fieldRender?: (name: string, host: any) => Promise<void>; submit?: (opts: any) => Promise<any> } = {}) {
  const entries = new Map<string, string>();
  if (options.saved) entries.set("mmd_text_payment_v1", JSON.stringify(options.saved));
  if (options.savedDemo) entries.set("mmd_text_payment_demo_v1", JSON.stringify(options.savedDemo));
  const sdkOptions: any[] = [], sdkInstances: any[] = [], scripts: any[] = [], nodes: any[] = [];
  let tree: any, pending = false, cursor = 0, renderNumber = 0;
  const hooks: any[] = [], effects: (() => void)[] = [], timers = new Map<number, () => void>();
  let timerId = 0;
  const parent = { nodeType: 1, parentElement: null, attributes: {} as any, setAttribute(name: string, value: any) { this.attributes[name] = value; } };
  const sdk: any = {};
  if (!options.missingCardFields) sdk.CardFields = vi.fn((opts: any) => {
    sdkOptions.push(opts);
    const instance: any = {
      isEligible: vi.fn(() => options.cardEligible !== false),
      getState: vi.fn(async () => ({ isFormValid: options.cardValid !== false })),
      submit: vi.fn(async () => {
        if (options.submit) return options.submit(opts);
        const orderID = await opts.createOrder();
        return opts.onApprove({ orderID });
      }),
      close: vi.fn(async () => {}),
      fields: {} as any,
    };
    fieldNames.forEach(name => {
      const field = {
        render: vi.fn(async (host: any) => { if (options.fieldRender) await options.fieldRender(name, host); }),
        close: vi.fn(async () => {}),
      };
      instance.fields[name] = field;
      instance[name] = vi.fn(() => field);
    });
    sdkInstances.push(instance);
    return instance;
  });
  const window: any = {
    sessionStorage: {
      getItem: vi.fn((key: string) => entries.get(key) || null),
      setItem: vi.fn((key: string, value: string) => entries.set(key, value)),
      removeItem: vi.fn((key: string) => entries.delete(key)),
    },
    setTimeout: (callback: () => void) => { const id = ++timerId; timers.set(id, callback); return id; },
    clearTimeout: (id: number) => timers.delete(id),
  };
  if (options.search !== undefined) window.location = { search: options.search };
  const document = {
    querySelector: () => scripts.find(script => !script.removed) || null,
    createElement: () => {
      const listeners: any = {};
      return {
        src: "", removed: false, attributes: {} as any,
        setAttribute(name: string, value: any) { this.attributes[name] = value; },
        getAttribute(name: string) { return this.attributes[name]; },
        addEventListener: (name: string, listener: any) => { listeners[name] = listener; },
        removeEventListener: (name: string, listener: any) => { if (listeners[name] === listener) delete listeners[name]; },
        remove() { this.removed = true; },
        fire(name: string) { listeners[name]?.(); },
      };
    },
    head: { appendChild: (script: any) => {
      scripts.push(script);
      if (options.autoSdk !== false) { window.mmdTextPayPal = sdk; queueMicrotask(() => script.fire("load")); }
    } },
  };
  const request = options.request || vi.fn(async (path: string) => {
    if (path.endsWith("/config")) return options.config || config;
    if (path.endsWith("/order")) return { ...pair, environment: "sandbox" };
    if (path.endsWith("/capture")) return receipt;
    if (path.endsWith("/status")) return { ...pair, payment_status: "PENDING", amount: "29.00", environment: "sandbox" };
    throw Error("Unexpected mocked endpoint");
  });
  const props: any = {
    valid: true, busy: false,
    onValidate: vi.fn(() => props.valid), getInput: vi.fn(async () => ({ intake: { submission_id: "local-test" }, signing: { opaque: "snapshot" } })),
    onComplete: vi.fn(async () => {}),
  };
  function depsEqual(before: any[], after: any[]) { return before.length === after.length && before.every((item, index) => Object.is(item, after[index])); }
  const React = {
    useRef(value: any) { const index = cursor++; hooks[index] ??= { current: value }; return hooks[index]; },
    useState(value: any) {
      const index = cursor++; hooks[index] ??= { value: typeof value === "function" ? value() : value };
      return [hooks[index].value, (next: any) => {
        const value = typeof next === "function" ? next(hooks[index].value) : next;
        if (!Object.is(value, hooks[index].value)) { hooks[index].value = value; pending = true; }
      }];
    },
    useEffect(callback: () => any, deps: any[]) {
      const index = cursor++, before = hooks[index];
      if (!before || !depsEqual(before.deps, deps)) {
        hooks[index] = { deps, cleanup: before?.cleanup };
        effects.push(() => { hooks[index].cleanup?.(); hooks[index].cleanup = callback(); });
      }
    },
    useLayoutEffect(callback: () => any, deps: any[]) { React.useEffect(callback, deps); },
  };
  function jsx(type: any, attributes: any) { return { type, props: attributes }; }
  runInNewContext(source, { window, document, URL, URLSearchParams, Promise, Set, Error, JSON });
  const Component = window.MmdCreateTextPayment(React, { jsx, jsxs: jsx }, { request });
  function attach(node: any) {
    if (!node || typeof node !== "object") return;
    if (node.props?.ref && !node.props.ref.current) {
      const element = { nodeType: 1, parentElement: parent, attributes: {} as any, setAttribute(name: string, value: any) { this.attributes[name] = value; } };
      nodes.push(element); node.props.ref.current = element;
    }
    const children = node.props?.children;
    (Array.isArray(children) ? children : [children]).forEach(attach);
  }
  function render() {
    if (++renderNumber > 150) throw Error("Unexpected hook loop");
    pending = false; cursor = 0; tree = Component(props); attach(tree);
    effects.splice(0).forEach(effect => effect());
  }
  async function flush() { for (let i = 0; i < 12; i++) { if (pending) render(); await tick(); } }
  function walk(predicate: (node: any) => boolean, node = tree): any[] {
    if (!node || typeof node !== "object") return [];
    const children = node.props?.children;
    return [...(predicate(node) ? [node] : []), ...(Array.isArray(children) ? children : [children]).flatMap(child => child === undefined ? [] : walk(predicate, child))];
  }
  function text(node = tree): string {
    if (node === false || node === null || node === undefined) return "";
    if (typeof node !== "object") return String(node);
    const children = node.props?.children;
    return (Array.isArray(children) ? children : [children]).map(child => child === undefined ? "" : text(child)).join(" ");
  }
  function payButton() { return walk(node => node.type === "button" && node.props?.className === "mmd-text-payment-pay")[0]; }
  render();
  return { props, request, flush, sdk, sdkOptions, sdkInstances, scripts, timers, entries, window, parent, nodes, walk, text, payButton,
    rerender: () => { pending = true; }, tree: () => tree };
}

describe("isolated $29 text intake payment UI", () => {
  it("uses a single namespaced CardFields SDK, four embedded fields, public config and sandbox-only buyer-country", async () => {
    const h = harness(); await h.flush();
    expect(h.scripts).toHaveLength(1);
    const url = new URL(h.scripts[0].src);
    expect(url.origin + url.pathname).toBe("https://www.paypal.com/sdk/js");
    expect(Object.fromEntries(url.searchParams)).toEqual({ "client-id": config.client_id, components: "card-fields", "disable-funding": "paylater,venmo", currency: "USD", intent: "capture", "buyer-country": "US" });
    expect(h.scripts[0].attributes["data-namespace"]).toBe("mmdTextPayPal");
    expect(h.sdkOptions).toHaveLength(1);
    expect(h.sdk.CardFields).toHaveBeenCalledTimes(1);
    expect(h.sdkOptions[0]).toEqual(expect.objectContaining({ createOrder: expect.any(Function), onApprove: expect.any(Function), onError: expect.any(Function), onCancel: expect.any(Function), style: expect.any(Object) }));
    const hosts: any[] = [];
    fieldNames.forEach(name => {
      expect(h.sdkInstances[0][name]).toHaveBeenCalledTimes(1);
      expect(h.sdkInstances[0].fields[name].render).toHaveBeenCalledTimes(1);
      const host = h.sdkInstances[0].fields[name].render.mock.calls[0][0];
      expect(host.nodeType).toBe(1); expect(h.nodes).toContain(host); hosts.push(host);
    });
    expect(new Set(hosts).size).toBe(4);
    expect(h.payButton().props.disabled).toBe(false);
    expect(h.text(h.payButton())).toBe("Pay $29 securely →");
    expect(h.text()).not.toMatch(/Pay with PayPal|PayPal wallet|You can use PayPal/);
    expect(h.walk(node => node.type === "input")).toHaveLength(0);
    expect(h.text()).toContain("Credit card payment – $29 today");
    expect(h.text()).toContain("Sandbox test payment — no real charge.");
    expect(h.text()).toContain("Charged once. Full refund if Dr. Al-Deek determines you're not a candidate. Medication costs are separate.");
    expect(h.parent.attributes).toEqual({ "data-hj-suppress": "true", "data-cs-mask": "true" });
    expect(css).toContain("font: 400 12px/1.5 Inter");
    const payStyles = css.match(/\.mmd-text-payment\s+\.mmd-text-payment-pay\s*\{([^}]+)\}/)?.[1];
    expect(payStyles).toMatch(/width:\s*100%/);
    expect(payStyles).toMatch(/min-height:\s*48px/);
    expect(payStyles).toMatch(/border-radius:\s*999px/);
    expect(css).not.toMatch(/position:\s*(fixed|sticky)/);
    h.props.valid = false; h.rerender(); await h.flush();
    expect(h.scripts).toHaveLength(1); expect(h.sdkOptions).toHaveLength(1);
    expect(h.request.mock.calls.filter(([path]: any[]) => path.endsWith("/config"))).toHaveLength(1);
  });

  it("orders four provider-hosted labels with an expiry/CVV row and one exact secure Pay CTA without app-owned name input or storage", async () => {
    const h = harness(); await h.flush();
    const labels = ["Cardholder name", "Card number", "Expiration date", "Security code"];
    expect(h.walk(node => node.props?.className === "mmd-text-card-label").map(node => h.text(node))).toEqual(labels);
    const hosts = h.walk(node => node.props?.className === "mmd-text-card-host");
    expect(hosts).toHaveLength(4);
    expect(hosts.map(node => node.props["aria-label"])).toEqual(labels);
    fieldNames.forEach((name, index) => {
      expect(hosts[index].type).toBe("div");
      expect(h.sdkInstances[0].fields[name].render).toHaveBeenCalledTimes(1);
      expect(h.sdkInstances[0].fields[name].render).toHaveBeenCalledWith(hosts[index].props.ref.current);
      expect(hosts[index].props).not.toHaveProperty("value");
      expect(hosts[index].props).not.toHaveProperty("defaultValue");
      expect(hosts[index].props).not.toHaveProperty("onInput");
      expect(hosts[index].props).not.toHaveProperty("onChange");
    });
    const rows = h.walk(node => node.props?.className === "mmd-text-card-row");
    expect(rows).toHaveLength(1);
    expect(h.walk(node => node.props?.className === "mmd-text-card-label", rows[0]).map(node => h.text(node))).toEqual(labels.slice(2));
    const payButtons = h.walk(node => node.type === "button" && /\bPay\b/.test(h.text(node)));
    expect(payButtons).toHaveLength(1);
    expect(payButtons[0]).toBe(h.payButton());
    expect(h.text(payButtons[0])).toBe("Pay $29 securely →");
    expect(source).toContain(".NameField(");
    expect(source).not.toMatch(/\.value\b|\[\s*["']value["']\s*\]/);
    expect(h.walk(node => node.type === "input" || node.type === "textarea" || node.type === "iframe" || node.props?.contentEditable)).toHaveLength(0);
    expect(h.window.sessionStorage.setItem).not.toHaveBeenCalled();
    h.payButton().props.onClick(); await h.flush();
    expect(h.window.sessionStorage.setItem).toHaveBeenCalledTimes(1);
    expect(h.window.sessionStorage.setItem).toHaveBeenCalledWith("mmd_text_payment_v1", JSON.stringify(pair));
    const order = h.request.mock.calls.find(([path]: any[]) => path.endsWith("/order"));
    const capture = h.request.mock.calls.find(([path]: any[]) => path.endsWith("/capture"));
    expect(JSON.parse(order[1].body)).toEqual({ intake: { submission_id: "local-test" }, signing: { opaque: "snapshot" } });
    expect(JSON.parse(capture[1].body)).toEqual(pair);
    expect(h.props.onComplete).toHaveBeenCalledTimes(1);
    expect(h.props.onComplete).toHaveBeenCalledWith(receipt);
    expect(h.entries.size).toBe(0);
  });

  it("omits sandbox-only parameters in live mode and fails closed for invalid config", async () => {
    const live = harness({ config: { ...config, environment: "live" } }); await live.flush();
    expect(new URL(live.scripts[0].src).searchParams.has("buyer-country")).toBe(false);
    for (const invalid of [{ ...config, amount: "1.00" }, { ...config, environment: "production" }, { ...config, configured: false }, { ...config, currency: "EUR" }]) {
      const h = harness({ config: invalid }); await h.flush();
      expect(h.scripts).toHaveLength(0); expect(h.text()).toContain("isn't configured correctly"); expect(h.props.onComplete).not.toHaveBeenCalled();
    }
  });

  it("renders SDK funding even when invalid, disables it and intercepts accessible validation taps", async () => {
    const h = harness(); h.props.valid = false; h.rerender(); await h.flush();
    expect(h.sdkOptions).toHaveLength(1);
    fieldNames.forEach(name => expect(h.sdkInstances[0].fields[name].render).toHaveBeenCalledTimes(1));
    // Required intake fields must remain tappable so native Pay can run accessible validation.
    expect(h.payButton().props.disabled).toBe(false);
    expect(h.payButton().props["aria-disabled"]).toBe(true);
    h.payButton().props.onClick(); await h.flush();
    expect(h.props.onValidate).toHaveBeenCalled();
    expect(h.sdkInstances[0].submit).not.toHaveBeenCalled();
    await expect(h.sdkOptions[0].createOrder()).rejects.toThrow(decline);
    expect(h.props.getInput).not.toHaveBeenCalled();
    expect(h.request.mock.calls.filter(([path]: any[]) => path.endsWith("/order"))).toHaveLength(0);
    h.props.valid = true; h.rerender(); await h.flush();
    expect(h.payButton().props.disabled).toBe(false);
    h.props.busy = true; h.rerender(); await h.flush();
    expect(h.payButton().props.disabled).toBe(true);
  });

  it("uses the latest callback snapshot, deduplicates concurrent order/capture and completes once after verification", async () => {
    const h = harness(); await h.flush();
    h.props.getInput = vi.fn(async () => ({ intake: { fresh: "answer-memory-only" }, signing: { opaque: "fresh" } }));
    h.rerender(); await h.flush();
    const first = h.sdkOptions[0].createOrder(), duplicate = h.sdkOptions[0].createOrder();
    expect(duplicate).toBe(first); expect(await first).toBe(pair.order_id); await h.flush();
    expect(h.text()).toContain("Processing your payment…");
    expect(h.payButton().props.disabled).toBe(true);
    const orders = h.request.mock.calls.filter(([path]: any[]) => path.endsWith("/order"));
    expect(orders).toHaveLength(1);
    expect(JSON.parse(orders[0][1].body)).toEqual({ intake: { fresh: "answer-memory-only" }, signing: { opaque: "fresh" } });
    expect(JSON.parse(h.entries.get("mmd_text_payment_v1")!)).toEqual(pair);
    expect(JSON.stringify(h.tree())).not.toContain(pair.payment_token);
    const capture = h.sdkOptions[0].onApprove({ orderID: pair.order_id });
    const duplicateCapture = h.sdkOptions[0].onApprove({ orderID: pair.order_id });
    expect(duplicateCapture).toBe(capture); await capture; await h.flush();
    expect(h.request.mock.calls.filter(([path]: any[]) => path.endsWith("/capture"))).toHaveLength(1);
    const payload = h.request.mock.calls.find(([path]: any[]) => path.endsWith("/capture"));
    expect(JSON.parse(payload[1].body)).toEqual(pair);
    expect(h.props.onComplete).toHaveBeenCalledTimes(1); expect(h.props.onComplete).toHaveBeenCalledWith(receipt);
    await h.sdkOptions[0].onApprove({ orderID: pair.order_id }); expect(h.props.onComplete).toHaveBeenCalledTimes(1);
    expect(h.entries.has("mmd_text_payment_v1")).toBe(false);
    expect(h.payButton().props.disabled).toBe(true);
  });

  it("keeps the cached order and input intact across cancellation and provider errors", async () => {
    const h = harness(); await h.flush(); await h.sdkOptions[0].createOrder();
    h.sdkOptions[0].onCancel(); await h.flush();
    expect(h.text()).toContain(decline); expect(h.props.onComplete).not.toHaveBeenCalled();
    expect(await h.sdkOptions[0].createOrder()).toBe(pair.order_id);
    expect(h.request.mock.calls.filter(([path]: any[]) => path.endsWith("/order"))).toHaveLength(1);
    h.sdkOptions[0].onError(new Error("private SDK detail")); await h.flush();
    expect(h.text()).toContain(decline); expect(h.text()).not.toContain("private SDK detail");
  });

  it("does not submit on declined, wrong amount, mismatched mode, redirect or order results", async () => {
    for (const result of [{ ...receipt, payment_status: "DECLINED" }, { ...receipt, payment_provider: "none" }, { ...receipt, amount: "28.00" }, { ...receipt, environment: "live" }, { ...receipt, client_id: "another_public_client_123" }, { ...receipt, redirect_url: "https://untrusted.invalid/" }, { ...receipt, redirect_url: "/intake/thank-you/?prefill=demo" }, { ...receipt, paypal_order_id: "WRONG" }]) {
      const request = vi.fn(async (path: string) => path.endsWith("/config") ? config : path.endsWith("/order") ? pair : result);
      const h = harness({ request }); await h.flush(); await h.sdkOptions[0].createOrder();
      await expect(h.sdkOptions[0].onApprove({ orderID: pair.order_id })).rejects.toThrow(decline);
      await h.flush(); expect(h.props.onComplete).not.toHaveBeenCalled(); expect(h.text()).toContain(decline);
      await expect(h.sdkOptions[0].createOrder()).rejects.toThrow(decline);
      expect(request.mock.calls.filter(([path]) => path.endsWith("/order"))).toHaveLength(1);
    }
    const h = harness(); await h.flush(); await h.sdkOptions[0].createOrder();
    await expect(h.sdkOptions[0].onApprove({ orderID: "WRONG" })).rejects.toThrow(decline);
    expect(h.request.mock.calls.filter(([path]: any[]) => path.endsWith("/capture"))).toHaveLength(0);
  });

  it("accepts demo thank-you only for explicitly test-marked sandbox completion", async () => {
    const result = { ...receipt, is_test: true, redirect_url: "/intake/thank-you/?prefill=demo" };
    const h = harness({ request: vi.fn(async (path: string) => path.endsWith("/config") ? config : path.endsWith("/order") ? pair : result) });
    await h.flush(); await h.sdkOptions[0].createOrder(); await h.sdkOptions[0].onApprove({ orderID: pair.order_id });
    expect(h.props.onComplete).toHaveBeenCalledWith(result);
    const live = harness({ request: vi.fn(async (path: string) => path.endsWith("/config") ? { ...config, environment: "live" } : path.endsWith("/order") ? pair : { ...result, environment: "live" }) });
    await live.flush(); await live.sdkOptions[0].createOrder();
    await expect(live.sdkOptions[0].onApprove({ orderID: pair.order_id })).rejects.toThrow(decline);
    expect(live.props.onComplete).not.toHaveBeenCalled();
  });

  it("checks opaque refresh recovery with the server and never trusts a paid storage flag", async () => {
    const h = harness({ saved: { ...pair, payment_status: "COMPLETED", answers: "must not be persisted" } }); await h.flush();
    const status = h.request.mock.calls.find(([path]: any[]) => path.endsWith("/status"));
    expect(JSON.parse(status[1].body)).toEqual({ payment_token: pair.payment_token });
    expect(h.props.onComplete).not.toHaveBeenCalled();
    expect(await h.sdkOptions[0].createOrder()).toBe(pair.order_id);
    expect(h.request.mock.calls.filter(([path]: any[]) => path.endsWith("/order"))).toHaveLength(0);
    const paid = harness({ saved: pair, request: vi.fn(async (path: string) => path.endsWith("/config") ? config : receipt) }); await paid.flush();
    expect(paid.props.onComplete).toHaveBeenCalledTimes(1);
    expect(paid.request.mock.calls.filter(([path]: any[]) => path.endsWith("/capture"))).toHaveLength(0);
  });

  it("holds ambiguous capture failures until status confirms and never creates an additional order", async () => {
    const request = vi.fn(async (path: string) => {
      if (path.endsWith("/config")) return config;
      if (path.endsWith("/order")) return pair;
      if (path.endsWith("/capture")) throw Error("lost capture acknowledgement");
      if (path.endsWith("/status")) return receipt;
    });
    const h = harness({ request }); await h.flush(); await h.sdkOptions[0].createOrder();
    await expect(h.sdkOptions[0].onApprove({ orderID: pair.order_id })).rejects.toThrow(decline); await h.flush();
    expect(h.props.onComplete).not.toHaveBeenCalled();
    expect(h.payButton().props.disabled).toBe(true);
    await expect(h.sdkOptions[0].createOrder()).rejects.toThrow(decline);
    h.walk(node => node.type === "button" && node.props.children === "Check payment status again")[0].props.onClick(); await h.flush();
    expect(h.props.onComplete).toHaveBeenCalledTimes(1);
    expect(request.mock.calls.filter(([path]) => path.endsWith("/order"))).toHaveLength(1);
    expect(request.mock.calls.filter(([path]) => path.endsWith("/capture"))).toHaveLength(1);
  });

  it("reports guest card ineligibility honestly rather than rendering a fake payment button", async () => {
    const h = harness({ cardEligible: false }); await h.flush();
    expect(h.sdk.CardFields).toHaveBeenCalledTimes(1);
    expect(h.sdkInstances[0].isEligible).toHaveBeenCalledTimes(1);
    expect(h.text()).toContain("Credit card payment is not enabled for this account or browser. Please contact the Care Team at (888) 362-7011.");
    expect(h.walk(node => node.props?.className === "mmd-text-payment-options").find(node => node.props.hidden)).toBeTruthy();
    fieldNames.forEach(name => {
      expect(h.sdkInstances[0][name]).not.toHaveBeenCalled();
      expect(h.sdkInstances[0].fields[name].render).not.toHaveBeenCalled();
    });
    expect(h.walk(node => node.type === "input" || node.type === "iframe")).toHaveLength(0);
    expect(h.payButton() === undefined || h.payButton().props.disabled === true).toBe(true);
    expect(h.text()).not.toMatch(/Pay with PayPal|PayPal wallet|You can use PayPal/);
    expect(h.sdkInstances[0].submit).not.toHaveBeenCalled();
    expect(h.request.mock.calls.filter(([path]: any[]) => path.endsWith("/order"))).toHaveLength(0);
    expect(h.props.onComplete).not.toHaveBeenCalled();
  });

  it("times out SDK loading and retries locally without creating orders or touching the video namespace", async () => {
    const h = harness({ autoSdk: false }); await h.flush();
    expect(h.payButton() === undefined || h.payButton().props.disabled === true).toBe(true);
    expect(h.timers.size).toBe(1); Array.from(h.timers.values())[0](); await h.flush();
    expect(h.text()).toContain("temporarily unavailable");
    h.walk(node => node.type === "button" && node.props.children === "Retry loading payment options")[0].props.onClick(); await h.flush();
    expect(h.scripts).toHaveLength(2); expect(h.scripts[0].removed).toBe(true);
    expect(h.request.mock.calls.filter(([path]: any[]) => path.endsWith("/order"))).toHaveLength(0);
    expect(h.window.paypal).toBeUndefined();
  });

  it("never logs, identifies, runs analytics, handles card data or persists patient input", async () => {
    expect(source).not.toMatch(/console\.|\.identify\(|\.track\(|gtag\(|fbq\(|localStorage|actions\.order\.capture/);
    // CVVField is a provider factory, not card-data handling; raw payment values stay in provider frames.
    expect(source).toContain(".CVVField(");
    expect(source).not.toMatch(/client.secret|client_secret|card_number|\b(?:cvv|pan|cardNumber|securityCode)\s*:|["'](?:cvv|pan|cardNumber|securityCode)["']\s*:|\.value\b|\[\s*["']value["']\s*\]/i);
    expect(source).not.toMatch(/\.Buttons\s*\(|\bFUNDING\b|components:\s*["']buttons["']/);
    expect(source).toContain('JSON.stringify(opaquePair(pair))');
    expect(source).toContain('"data-hj-suppress", "true"');
    expect(source).toContain('"data-cs-mask", "true"');
    const h = harness(); await h.flush(); h.payButton().props.onClick(); await h.flush();
    const order = h.request.mock.calls.find(([path]: any[]) => path.endsWith("/order"));
    const capture = h.request.mock.calls.find(([path]: any[]) => path.endsWith("/capture"));
    expect(JSON.parse(order[1].body)).toEqual({ intake: { submission_id: "local-test" }, signing: { opaque: "snapshot" } });
    expect(JSON.parse(capture[1].body)).toEqual(pair);
    h.window.sessionStorage.setItem.mock.calls.forEach(([key, value]: any[]) => {
      expect(key).toBe("mmd_text_payment_v1"); expect(JSON.parse(value)).toEqual(pair);
    });
    expect(h.props.onComplete).toHaveBeenCalledWith(receipt);
  });

  it("rejects invalid provider card state before submit or order creation", async () => {
    const h = harness({ cardValid: false }); await h.flush();
    expect(h.payButton().props.disabled).toBe(false);
    h.payButton().props.onClick(); await h.flush();
    expect(h.props.onValidate).toHaveBeenCalled();
    expect(h.sdkInstances[0].getState).toHaveBeenCalledTimes(1);
    expect(h.sdkInstances[0].submit).not.toHaveBeenCalled();
    expect(h.props.getInput).not.toHaveBeenCalled();
    expect(h.request.mock.calls.filter(([path]: any[]) => path.endsWith("/order") || path.endsWith("/capture"))).toHaveLength(0);
    expect(h.window.sessionStorage.setItem).not.toHaveBeenCalled();
    expect(h.props.onComplete).not.toHaveBeenCalled();
    expect(h.text()).toContain("Please complete your card details.");
    expect(h.walk(node => node.props?.role === "alert").length).toBeGreaterThan(0);
  });

  it("blocks demo intake before provider card submission or order creation in live mode", async () => {
    const h = harness({ config: { ...config, environment: "live" } }); await h.flush();
    h.props.getInput = vi.fn(async () => ({ demo_mode: true, intake: { submission_id: "local-test" }, signing: { opaque: "snapshot" } }));
    h.rerender(); await h.flush();
    h.payButton().props.onClick(); await h.flush();
    expect(h.props.getInput).toHaveBeenCalledTimes(1);
    expect(h.text()).toContain("Demo intakes require Sandbox payment settings. No live payment was started.");
    expect(h.sdkInstances[0].getState).not.toHaveBeenCalled();
    expect(h.sdkInstances[0].submit).not.toHaveBeenCalled();
    expect(h.request.mock.calls.filter(([path]: any[]) => path.endsWith("/order") || path.endsWith("/capture"))).toHaveLength(0);
    expect(h.window.sessionStorage.setItem).not.toHaveBeenCalled();
    expect(h.props.onComplete).not.toHaveBeenCalled();
    expect(h.payButton().props.disabled).toBe(false);
  });

  it("deduplicates native Pay double taps through provider submit and verified capture", async () => {
    let release!: () => void;
    const wait = new Promise<void>(resolve => { release = resolve; });
    const h = harness({ submit: async opts => { await wait; const orderID = await opts.createOrder(); return opts.onApprove({ orderID }); } });
    await h.flush();
    const click = h.payButton().props.onClick;
    click(); click(); await h.flush();
    expect(h.sdkInstances[0].getState).toHaveBeenCalledTimes(1);
    expect(h.sdkInstances[0].submit).toHaveBeenCalledTimes(1);
    expect(h.payButton().props.disabled).toBe(true);
    expect(h.request.mock.calls.filter(([path]: any[]) => path.endsWith("/order"))).toHaveLength(0);
    release(); await h.flush();
    expect(h.request.mock.calls.filter(([path]: any[]) => path.endsWith("/order"))).toHaveLength(1);
    expect(h.request.mock.calls.filter(([path]: any[]) => path.endsWith("/capture"))).toHaveLength(1);
    expect(h.props.onComplete).toHaveBeenCalledTimes(1);
    expect(h.props.onComplete).toHaveBeenCalledWith(receipt);
    click(); await h.flush();
    expect(h.sdkInstances[0].submit).toHaveBeenCalledTimes(1);
    expect(h.payButton().props.disabled).toBe(true);
  });

  it("requires CardFields in the namespaced SDK without wallet or fake-form fallback", async () => {
    const h = harness({ missingCardFields: true }); await h.flush();
    expect(h.text()).toContain("temporarily unavailable");
    expect(h.sdkOptions).toHaveLength(0);
    expect(h.walk(node => node.type === "input" || node.type === "iframe")).toHaveLength(0);
    expect(h.payButton() === undefined || h.payButton().props.disabled === true).toBe(true);
    expect(h.text()).not.toMatch(/Pay with PayPal|PayPal wallet|You can use PayPal/);
    expect(h.request.mock.calls.filter(([path]: any[]) => path.endsWith("/order") || path.endsWith("/capture"))).toHaveLength(0);
    expect(h.props.onComplete).not.toHaveBeenCalled();
    expect(h.window.paypal).toBeUndefined();
  });

  it.each(fieldNames)("keeps native Pay disabled until all four provider fields finish rendering, including pending %s", async pendingField => {
    const release = new Map<string, () => void>();
    const h = harness({ fieldRender: name => new Promise<void>(resolve => { release.set(name, resolve); }) });
    await h.flush();
    expect([...release.keys()]).toEqual(fieldNames);
    expect(release.size).toBe(4);
    expect(h.payButton() === undefined || h.payButton().props.disabled === true).toBe(true);
    for (const name of fieldNames.filter(name => name !== pendingField)) {
      release.get(name)!(); await h.flush();
      expect(h.payButton() === undefined || h.payButton().props.disabled === true).toBe(true);
      h.payButton()?.props.onClick(); await h.flush();
      expect(h.sdkInstances[0].getState).not.toHaveBeenCalled();
      expect(h.sdkInstances[0].submit).not.toHaveBeenCalled();
      expect(h.props.getInput).not.toHaveBeenCalled();
      expect(h.request.mock.calls.filter(([path]: any[]) => path.endsWith("/order") || path.endsWith("/capture"))).toHaveLength(0);
      expect(h.window.sessionStorage.setItem).not.toHaveBeenCalled();
      expect(h.props.onComplete).not.toHaveBeenCalled();
    }
    release.get(pendingField)!(); await h.flush();
    expect(h.payButton().props.disabled).toBe(false);
    expect(h.sdkOptions).toHaveLength(1);
    expect(h.request.mock.calls.filter(([path]: any[]) => path.endsWith("/order"))).toHaveLength(0);
    h.payButton().props.onClick(); await h.flush();
    expect(h.sdkInstances[0].getState).toHaveBeenCalledTimes(1);
    expect(h.sdkInstances[0].submit).toHaveBeenCalledTimes(1);
    expect(h.request.mock.calls.filter(([path]: any[]) => path.endsWith("/order"))).toHaveLength(1);
    expect(h.request.mock.calls.filter(([path]: any[]) => path.endsWith("/capture"))).toHaveLength(1);
    expect(h.props.onComplete).toHaveBeenCalledTimes(1);
    expect(h.props.onComplete).toHaveBeenCalledWith(receipt);
  });
});

describe("text checkout readiness and immutable SDK settings (mock-only)", () => {
  const storageError = "Payment checkout is not configured. Please contact the Care Team; do not make another payment.";
  const modeError = "The payment mode changed. Please refresh checkout or contact the Care Team; do not make another payment.";
  const confirmationError = "Payment confirmation is unavailable. Please retry or contact the Care Team; do not make another payment.";
  const configError = "Secure payment isn't configured correctly. Please contact the Care Team at (888) 362-7011.";
  const unavailable = { configured: false, readiness_reason: "payment_storage_unavailable" };
  const privateDetail = "private mocked configuration/provider detail";

  function controlledConfig(initial: any = config) {
    let current: any = { ...initial };
    const request = vi.fn(async (path: string) => {
      if (path.endsWith("/config")) {
        if (current instanceof Error) throw current;
        if (typeof current === "function") return current();
        return current && { ...current };
      }
      if (path.endsWith("/order")) return { ...pair, environment: initial.environment };
      if (path.endsWith("/capture")) return { ...receipt, environment: initial.environment };
      if (path.endsWith("/status")) return { ...pair, payment_status: "PENDING", amount: "29.00", environment: initial.environment };
      throw Error("Unexpected mocked endpoint");
    });
    return { request, set: (next: any) => { current = next; } };
  }
  function endpointCalls(h: ReturnType<typeof harness>, endpoint: string) {
    return h.request.mock.calls.filter(([path]: any[]) => path.endsWith("/" + endpoint));
  }
  function expectNoCharge(h: ReturnType<typeof harness>) {
    expect(endpointCalls(h, "order")).toHaveLength(0);
    expect(endpointCalls(h, "capture")).toHaveLength(0);
    expect(h.props.onComplete).not.toHaveBeenCalled();
  }
  function expectOriginalSdk(h: ReturnType<typeof harness>, initial: any = config) {
    expect(h.scripts).toHaveLength(1);
    expect(h.scripts[0].removed).toBe(false);
    expect(new URL(h.scripts[0].src).searchParams.get("client-id")).toBe(initial.client_id);
    expect(new URL(h.scripts[0].src).searchParams.has("buyer-country")).toBe(initial.environment === "sandbox");
    expect(h.sdk.CardFields).toHaveBeenCalledTimes(1);
    expect(h.sdkOptions).toHaveLength(1);
    fieldNames.forEach(name => expect(h.sdkInstances[0].fields[name].render).toHaveBeenCalledTimes(1));
    expect(h.sdkInstances[0].close).not.toHaveBeenCalled();
  }
  async function expectSafeAlertAfterLateSdkError(h: ReturnType<typeof harness>, message: string) {
    await h.flush();
    expect(h.walk(node => node.props?.role === "alert").map(node => h.text(node))).toContain(message);
    h.sdkOptions[0].onError(new Error(privateDetail));
    await h.flush();
    expect(h.walk(node => node.props?.role === "alert").map(node => h.text(node))).toContain(message);
    h.sdkOptions[0].onError({ message: privateDetail, details: { sensitive: privateDetail } });
    await h.flush();
    expect(h.walk(node => node.props?.role === "alert").map(node => h.text(node))).toContain(message);
    expect(h.text()).not.toContain(privateDetail);
  }

  it("blocks missing durable payment storage at startup before loading the SDK", async () => {
    const h = harness({ config: { ...unavailable, detail: privateDetail } });
    await h.flush();
    expect(endpointCalls(h, "config")).toHaveLength(1);
    expect(h.scripts).toHaveLength(0);
    expect(h.sdk.CardFields).not.toHaveBeenCalled();
    expect(h.walk(node => node.props?.role === "alert").map(node => h.text(node))).toContain(storageError);
    expect(h.text()).not.toContain(privateDetail);
    expect(h.props.getInput).not.toHaveBeenCalled();
    expectNoCharge(h);
  });

  it("keeps startup config-network failures on the existing configuration fallback without loading an SDK", async () => {
    // The intake request helper sanitizes network diagnostics to the caller-supplied fallback.
    const request = vi.fn(async (_path: string, _opts: any, fallback: string) => { throw Error(fallback); });
    const h = harness({ request }); await h.flush();
    expect(h.scripts).toHaveLength(0);
    expect(h.sdk.CardFields).not.toHaveBeenCalled();
    expect(h.text()).toContain(configError);
    expect(h.text()).not.toContain(privateDetail);
    expectNoCharge(h);
  });

  it.each([
    ["missing", undefined], ["null", null], ["numeric", 29], ["integer string", "29"],
    ["short precision", "29.0"], ["leading zero", "029.00"], ["trailing space", "29.00 "],
    ["extra precision", "29.000"], ["exponential", "2.9e1"], ["different amount", "30.00"],
  ])("never accepts a malformed %s startup amount", async (_label, amount) => {
    const h = harness({ config: { ...config, amount } }); await h.flush();
    expect(h.scripts).toHaveLength(0);
    expect(h.sdk.CardFields).not.toHaveBeenCalled();
    expect(h.text()).toContain(configError);
    expectNoCharge(h);
  });

  it.each(["sandbox", "live"])("refreshes %s readiness before native card state, submit, or input and preserves the storage error", async environment => {
    const initial = { ...config, environment };
    const control = controlledConfig(initial);
    const h = harness({ request: control.request }); await h.flush();
    expect(endpointCalls(h, "config")).toHaveLength(1);
    control.set(unavailable);
    await h.payButton().props.onClick(); await h.flush();
    expect(endpointCalls(h, "config")).toHaveLength(2);
    expect(endpointCalls(h, "config")[1][1]).toEqual(expect.objectContaining({ method: "GET" }));
    expect(h.sdkInstances[0].getState).not.toHaveBeenCalled();
    expect(h.sdkInstances[0].submit).not.toHaveBeenCalled();
    expect(h.props.getInput).not.toHaveBeenCalled();
    expectNoCharge(h);
    expectOriginalSdk(h, initial);
    await expectSafeAlertAfterLateSdkError(h, storageError);
  });

  const driftCases = [
    { label: "Sandbox to Live", initial: config, changed: { ...config, environment: "live" } },
    { label: "Live to Sandbox", initial: { ...config, environment: "live" }, changed: config },
    { label: "public client ID", initial: config, changed: { ...config, client_id: "different_public_client_123" } },
  ];

  it.each(driftCases)("stops native submission for $label drift without switching or reloading SDK settings", async ({ initial, changed }) => {
    const control = controlledConfig(initial);
    const h = harness({ request: control.request }); await h.flush();
    control.set(changed);
    await h.payButton().props.onClick(); await h.flush();
    expect(endpointCalls(h, "config")).toHaveLength(2);
    expect(h.sdkInstances[0].getState).not.toHaveBeenCalled();
    expect(h.sdkInstances[0].submit).not.toHaveBeenCalled();
    expect(h.props.getInput).not.toHaveBeenCalled();
    expectNoCharge(h);
    expectOriginalSdk(h, initial);
    await expectSafeAlertAfterLateSdkError(h, modeError);
  });

  it.each(driftCases)("checks fresh settings before createOrder and getInput for $label drift", async ({ initial, changed }) => {
    const control = controlledConfig(initial);
    const h = harness({ request: control.request }); await h.flush();
    control.set(changed);
    await expect(h.sdkOptions[0].createOrder()).rejects.toThrow(modeError);
    expect(endpointCalls(h, "config")).toHaveLength(2);
    expect(h.props.getInput).not.toHaveBeenCalled();
    expectNoCharge(h);
    expectOriginalSdk(h, initial);
    await expectSafeAlertAfterLateSdkError(h, modeError);
  });

  it.each(driftCases)("does not reuse an opaque cached pair after $label drift and retains recovery capability", async ({ initial, changed }) => {
    const control = controlledConfig(initial);
    const h = harness({ request: control.request, saved: pair }); await h.flush();
    expect(endpointCalls(h, "status")).toHaveLength(1);
    expect(endpointCalls(h, "config")).toHaveLength(1);
    control.set(changed);
    await expect(h.sdkOptions[0].createOrder()).rejects.toThrow(modeError);
    expect(endpointCalls(h, "config")).toHaveLength(2);
    expect(h.props.getInput).not.toHaveBeenCalled();
    expectNoCharge(h);
    expect(JSON.parse(h.entries.get("mmd_text_payment_v1")!)).toEqual(pair);
    expect(h.window.sessionStorage.removeItem).not.toHaveBeenCalled();
    expectOriginalSdk(h, initial);
    await expectSafeAlertAfterLateSdkError(h, modeError);
  });

  it.each(driftCases)("checks fresh settings before capture for $label drift and keeps the original opaque pair", async ({ initial, changed }) => {
    const control = controlledConfig(initial);
    const h = harness({ request: control.request }); await h.flush();
    expect(await h.sdkOptions[0].createOrder()).toBe(pair.order_id);
    expect(endpointCalls(h, "config")).toHaveLength(2);
    control.set(changed);
    await expect(h.sdkOptions[0].onApprove({ orderID: pair.order_id })).rejects.toThrow(modeError);
    expect(endpointCalls(h, "config")).toHaveLength(3);
    expect(endpointCalls(h, "order")).toHaveLength(1);
    expect(endpointCalls(h, "capture")).toHaveLength(0);
    expect(h.props.onComplete).not.toHaveBeenCalled();
    expect(JSON.parse(h.entries.get("mmd_text_payment_v1")!)).toEqual(pair);
    expect(h.window.sessionStorage.removeItem).not.toHaveBeenCalled();
    expectOriginalSdk(h, initial);
    await expectSafeAlertAfterLateSdkError(h, modeError);
  });

  it.each(["create", "cached create", "capture"])("fails closed on readiness false during %s callbacks", async stage => {
    const control = controlledConfig();
    const h = harness({ request: control.request, saved: stage === "cached create" ? pair : undefined }); await h.flush();
    if (stage === "capture") await h.sdkOptions[0].createOrder();
    const inputCalls = h.props.getInput.mock.calls.length;
    control.set(unavailable);
    const attempt = stage === "capture" ? h.sdkOptions[0].onApprove({ orderID: pair.order_id }) : h.sdkOptions[0].createOrder();
    await expect(attempt).rejects.toThrow(storageError);
    expect(h.props.getInput).toHaveBeenCalledTimes(inputCalls);
    expect(endpointCalls(h, "order")).toHaveLength(stage === "capture" ? 1 : 0);
    expect(endpointCalls(h, "capture")).toHaveLength(0);
    expect(h.props.onComplete).not.toHaveBeenCalled();
    if (stage !== "create") expect(JSON.parse(h.entries.get("mmd_text_payment_v1")!)).toEqual(pair);
    expectOriginalSdk(h);
    await expectSafeAlertAfterLateSdkError(h, storageError);
  });

  it.each(["native", "create", "capture"])("fails closed when the fresh %s config check times out without leaking an arbitrary error", async stage => {
    const control = controlledConfig();
    const h = harness({ request: control.request }); await h.flush();
    if (stage === "capture") await h.sdkOptions[0].createOrder();
    control.set(new Error(privateDetail));
    if (stage === "native") await h.payButton().props.onClick();
    else await expect(stage === "capture" ? h.sdkOptions[0].onApprove({ orderID: pair.order_id }) : h.sdkOptions[0].createOrder()).rejects.toThrow(configError);
    await h.flush();
    expect(endpointCalls(h, "order")).toHaveLength(stage === "capture" ? 1 : 0);
    expect(endpointCalls(h, "capture")).toHaveLength(0);
    expect(h.sdkInstances[0].getState).not.toHaveBeenCalled();
    expect(h.sdkInstances[0].submit).not.toHaveBeenCalled();
    expect(h.props.getInput).toHaveBeenCalledTimes(stage === "capture" ? 1 : 0);
    expect(h.props.onComplete).not.toHaveBeenCalled();
    expectOriginalSdk(h);
    await expectSafeAlertAfterLateSdkError(h, configError);
  });

  it.each([
    { label: "unconfigured", changed: { ...config, configured: false } },
    { label: "invalid client ID", changed: { ...config, client_id: "bad" } },
    { label: "invalid environment", changed: { ...config, environment: "production" } },
    { label: "missing amount", changed: { ...config, amount: undefined } },
    { label: "numeric amount", changed: { ...config, amount: 29 } },
    { label: "different amount", changed: { ...config, amount: "30.00" } },
    { label: "different currency", changed: { ...config, currency: "EUR" } },
  ])("does not accept fresh $label config before provider activity and preserves the safe configuration error", async ({ changed }) => {
    const control = controlledConfig();
    const h = harness({ request: control.request }); await h.flush();
    control.set(changed);
    await expect(h.sdkOptions[0].createOrder()).rejects.toThrow(configError);
    expect(h.props.getInput).not.toHaveBeenCalled();
    expectNoCharge(h);
    expectOriginalSdk(h);
    await expectSafeAlertAfterLateSdkError(h, configError);
  });

  it("shares the pending fresh native check across concurrent taps and completes stable settings exactly once", async () => {
    let releaseConfig!: (value: any) => void, releaseSubmit!: () => void;
    const configWait = new Promise(resolve => { releaseConfig = resolve; });
    const submitWait = new Promise<void>(resolve => { releaseSubmit = resolve; });
    const control = controlledConfig();
    const h = harness({ request: control.request, submit: async opts => {
      await submitWait;
      const first = opts.createOrder(), duplicate = opts.createOrder();
      expect(duplicate).toBe(first);
      const orderID = await first;
      const capture = opts.onApprove({ orderID }), duplicateCapture = opts.onApprove({ orderID });
      expect(duplicateCapture).toBe(capture);
      return capture;
    } });
    await h.flush();
    expect(endpointCalls(h, "config")).toHaveLength(1);
    control.set(() => configWait);
    const click = h.payButton().props.onClick;
    const first = click(), duplicate = click();
    expect(duplicate).toBe(first);
    await h.flush();
    expect(endpointCalls(h, "config")).toHaveLength(2);
    expect(h.sdkInstances[0].getState).not.toHaveBeenCalled();
    expect(h.sdkInstances[0].submit).not.toHaveBeenCalled();
    expect(h.props.getInput).not.toHaveBeenCalled();
    expectNoCharge(h);
    control.set(config); releaseConfig({ ...config }); await h.flush();
    expect(endpointCalls(h, "config")).toHaveLength(2);
    expect(h.sdkInstances[0].getState).toHaveBeenCalledTimes(1);
    expect(h.sdkInstances[0].submit).toHaveBeenCalledTimes(1);
    expectNoCharge(h);
    releaseSubmit(); await first; await h.flush();
    expect(endpointCalls(h, "config")).toHaveLength(4);
    endpointCalls(h, "config").forEach(([, opts]: any[]) => expect(opts).toEqual(expect.objectContaining({ method: "GET" })));
    expect(endpointCalls(h, "order")).toHaveLength(1);
    expect(endpointCalls(h, "capture")).toHaveLength(1);
    expect(h.props.getInput).toHaveBeenCalledTimes(1);
    expect(h.props.onComplete).toHaveBeenCalledTimes(1);
    expect(h.props.onComplete).toHaveBeenCalledWith(receipt);
    expect(h.entries.size).toBe(0);
    expectOriginalSdk(h);
    await click(); await h.sdkOptions[0].onApprove({ orderID: pair.order_id }); await h.flush();
    expect(endpointCalls(h, "config")).toHaveLength(4);
    expect(endpointCalls(h, "order")).toHaveLength(1);
    expect(endpointCalls(h, "capture")).toHaveLength(1);
    expect(h.props.onComplete).toHaveBeenCalledTimes(1);
  });

  it.each(["native", "create", "capture"])("retains the exact safe confirmation-unavailable error during %s after late SDK errors", async stage => {
    const control = controlledConfig();
    const h = harness({ request: control.request }); await h.flush();
    if (stage === "capture") await h.sdkOptions[0].createOrder();
    control.set(new Error(confirmationError));
    if (stage === "native") await h.payButton().props.onClick();
    else await expect(stage === "capture" ? h.sdkOptions[0].onApprove({ orderID: pair.order_id }) : h.sdkOptions[0].createOrder()).rejects.toThrow(confirmationError);
    expect(endpointCalls(h, "order")).toHaveLength(stage === "capture" ? 1 : 0);
    expect(endpointCalls(h, "capture")).toHaveLength(0);
    expect(h.sdkInstances[0].getState).not.toHaveBeenCalled();
    expect(h.sdkInstances[0].submit).not.toHaveBeenCalled();
    expect(h.props.onComplete).not.toHaveBeenCalled();
    expectOriginalSdk(h);
    await expectSafeAlertAfterLateSdkError(h, confirmationError);
  });

  it("keeps unknown input, order and provider exceptions on the generic decline message", async () => {
    for (const stage of ["input", "order", "provider"]) {
      const request = vi.fn(async (path: string) => {
        if (path.endsWith("/config")) return { ...config };
        if (path.endsWith("/order")) throw Error(privateDetail);
        throw Error("Unexpected mocked endpoint");
      });
      const h = harness({ request, submit: stage === "provider" ? async () => { throw Error(privateDetail); } : undefined });
      await h.flush();
      if (stage === "input") h.props.getInput = vi.fn(async () => { throw Error(privateDetail); });
      if (stage === "provider") await h.payButton().props.onClick();
      else await expect(h.sdkOptions[0].createOrder()).rejects.toThrow(decline);
      await h.flush();
      expect(h.text()).toContain(decline);
      expect(h.text()).not.toContain(privateDetail);
      h.sdkOptions[0].onError({ message: privateDetail }); await h.flush();
      expect(h.text()).toContain(decline);
      expect(h.text()).not.toContain(privateDetail);
      expect(endpointCalls(h, "capture")).toHaveLength(0);
      expect(h.props.onComplete).not.toHaveBeenCalled();
    }
  });
});
describe("exact Demo-prefill Sandbox isolation (mock-only)", () => {
  const normalKey = "mmd_text_payment_v1", demoKey = "mmd_text_payment_demo_v1";
  const liveConfig = { ...config, client_id: "live_public_client_123", environment: "live" };
  const livePair = { payment_token: "opaque.live.capability", order_id: "LIVE_ORDER_29" };
  const demoReceipt = { ...receipt, is_test: true, redirect_url: "/intake/thank-you/?prefill=demo" };
  const configError = "Secure payment isn't configured correctly. Please contact the Care Team at (888) 362-7011.";
  const privateDetail = "sandbox-private-credential-never-expose";

  // Model saved admin settings without changing them: only the request's explicit Demo flag selects Sandbox.
  function savedSettings(initialEnvironment = "live") {
    let environment = initialEnvironment;
    const request = vi.fn(async (path: string, opts: any) => {
      if (path.endsWith("/config")) return { ...(opts?.demo_mode === true ? config : environment === "live" ? liveConfig : config) };
      if (path.endsWith("/order")) {
        const input = JSON.parse(opts.body);
        return { ...(input.demo_mode === true ? pair : livePair), environment: input.demo_mode === true ? "sandbox" : environment };
      }
      if (path.endsWith("/capture")) return JSON.parse(opts.body).payment_token === pair.payment_token ? demoReceipt : { ...receipt, environment: "live" };
      if (path.endsWith("/status")) return { ...pair, payment_status: "PENDING", amount: "29.00", environment: "sandbox" };
      throw Error("Unexpected mocked endpoint");
    });
    return { request, set: (next: string) => { environment = next; }, current: () => environment };
  }
  function calls(h: ReturnType<typeof harness>, endpoint: string) {
    return h.request.mock.calls.filter(([path]: any[]) => path.endsWith("/" + endpoint));
  }
  function expectDemoConfigCalls(h: ReturnType<typeof harness>, count: number) {
    expect(calls(h, "config")).toHaveLength(count);
    calls(h, "config").forEach(([, opts, fallback]: any[]) => {
      expect(opts).toEqual({ method: "GET", demo_mode: true });
      expect(fallback).toBe(configError);
    });
  }
  function expectSandboxSdk(h: ReturnType<typeof harness>) {
    expect(h.scripts).toHaveLength(1);
    expect(h.scripts[0].removed).toBe(false);
    const url = new URL(h.scripts[0].src);
    expect(url.origin + url.pathname).toBe("https://www.paypal.com/sdk/js");
    expect(Object.fromEntries(url.searchParams)).toEqual({ "client-id": config.client_id, components: "card-fields", "disable-funding": "paylater,venmo", currency: "USD", intent: "capture", "buyer-country": "US" });
    expect(h.scripts[0].src).not.toContain(liveConfig.client_id);
    expect(h.scripts[0].attributes["data-namespace"]).toBe("mmdTextPayPal");
    expect(h.sdk.CardFields).toHaveBeenCalledTimes(1);
    expect(h.sdkOptions).toHaveLength(1);
    fieldNames.forEach(name => expect(h.sdkInstances[0].fields[name].render).toHaveBeenCalledTimes(1));
    expect(h.sdkInstances[0].close).not.toHaveBeenCalled();
  }
  function expectNoCharge(h: ReturnType<typeof harness>) {
    expect(calls(h, "order")).toHaveLength(0);
    expect(calls(h, "capture")).toHaveLength(0);
    expect(h.props.onComplete).not.toHaveBeenCalled();
  }

  it("selects actual Sandbox SDK credentials and marks every initial/fresh config request with Demo despite saved Live settings", async () => {
    const control = savedSettings();
    const h = harness({ search: "?prefill=demo", request: control.request }); await h.flush();
    expectDemoConfigCalls(h, 1);
    expectSandboxSdk(h);
    expect(h.request.mock.invocationCallOrder[0]).toBeLessThan(h.sdk.CardFields.mock.invocationCallOrder[0]);
    expect(h.text()).toContain("Sandbox test payment — no real charge.");
    await h.payButton().props.onClick(); await h.flush();
    expectDemoConfigCalls(h, 4);
    expect(h.request.mock.calls.map(([path]: any[]) => path.split("/").pop())).toEqual(["config", "config", "config", "order", "config", "capture"]);
    expect(calls(h, "order")).toHaveLength(1);
    expect(JSON.parse(calls(h, "order")[0][1].body)).toEqual({ demo_mode: true, intake: { submission_id: "local-test" }, signing: { opaque: "snapshot" } });
    expect(calls(h, "capture")).toHaveLength(1);
    expect(JSON.parse(calls(h, "capture")[0][1].body)).toEqual(pair);
    expect(h.sdkInstances[0].getState).toHaveBeenCalledTimes(1);
    expect(h.sdkInstances[0].submit).toHaveBeenCalledTimes(1);
    expect(h.window.sessionStorage.setItem).toHaveBeenCalledWith(demoKey, JSON.stringify(pair));
    expect(h.window.sessionStorage.removeItem).toHaveBeenCalledWith(demoKey);
    expect(h.props.onComplete).toHaveBeenCalledTimes(1);
    expect(h.props.onComplete).toHaveBeenCalledWith(demoReceipt);
    expect(control.current()).toBe("live");
    expectSandboxSdk(h);
  });

  it.each([undefined, false, true])("forces server Demo marker using an immutable input copy when getInput marker is %s", async marker => {
    const control = savedSettings();
    const h = harness({ search: "?prefill=demo", request: control.request }); await h.flush();
    const input = Object.freeze({ ...(marker === undefined ? {} : { demo_mode: marker }), intake: Object.freeze({ submission_id: "immutable-local-test" }), signing: Object.freeze({ opaque: "immutable-snapshot" }) });
    h.props.getInput = vi.fn(async () => input); h.rerender(); await h.flush();
    expect(await h.sdkOptions[0].createOrder()).toBe(pair.order_id);
    expectDemoConfigCalls(h, 2);
    expect(JSON.parse(calls(h, "order")[0][1].body)).toEqual({ ...input, demo_mode: true });
    expect(Object.isFrozen(input)).toBe(true);
    if (marker === undefined) expect(input).not.toHaveProperty("demo_mode");
    else expect(input.demo_mode).toBe(marker);
    expect(h.entries.get(demoKey)).toBe(JSON.stringify(pair));
    expect(h.entries.has(normalKey)).toBe(false);
    expect(h.props.getInput).toHaveBeenCalledTimes(1);
  });

  it("pins Demo across saved-mode flips and later URL changes without switching or reloading the Sandbox SDK", async () => {
    const control = savedSettings("sandbox");
    const h = harness({ search: "?prefill=demo", request: control.request }); await h.flush();
    control.set("live"); h.window.location.search = "?prefill=Demo"; h.rerender(); await h.flush();
    expect(await h.sdkOptions[0].createOrder()).toBe(pair.order_id);
    expect(control.current()).toBe("live");
    control.set("sandbox");
    await h.sdkOptions[0].onApprove({ orderID: pair.order_id }); await h.flush();
    expectDemoConfigCalls(h, 3);
    expect(calls(h, "order")).toHaveLength(1); expect(calls(h, "capture")).toHaveLength(1);
    expect(h.props.onComplete).toHaveBeenCalledWith(demoReceipt);
    expectSandboxSdk(h);
  });

  it.each(["?prefill=Demo", "?prefill=demo2", "", undefined, "?other=demo", "?prefill=Demo&prefill=demo"])("retains original Live settings and normal storage for non-exact URL search %s", async search => {
    const control = savedSettings();
    const h = harness({ search, request: control.request }); await h.flush();
    if (search === undefined) expect(h.window.location).toBeUndefined();
    expect(h.scripts).toHaveLength(1);
    const url = new URL(h.scripts[0].src);
    expect(url.searchParams.get("client-id")).toBe(liveConfig.client_id);
    expect(url.searchParams.has("buyer-country")).toBe(false);
    expect(h.text()).not.toContain("Sandbox test payment — no real charge.");
    expect(await h.sdkOptions[0].createOrder()).toBe(livePair.order_id);
    await h.sdkOptions[0].onApprove({ orderID: livePair.order_id }); await h.flush();
    expect(calls(h, "config")).toHaveLength(3);
    calls(h, "config").forEach(([, opts]: any[]) => expect(opts).toEqual({ method: "GET" }));
    expect(JSON.parse(calls(h, "order")[0][1].body)).toEqual({ intake: { submission_id: "local-test" }, signing: { opaque: "snapshot" } });
    expect(h.window.sessionStorage.setItem).toHaveBeenCalledWith(normalKey, JSON.stringify(livePair));
    expect(h.window.sessionStorage.removeItem).toHaveBeenCalledWith(normalKey);
    expect(h.window.sessionStorage.setItem.mock.calls.every(([key]: any[]) => key === normalKey)).toBe(true);
    expect(h.props.onComplete).toHaveBeenCalledWith({ ...receipt, environment: "live" });
    expect(control.current()).toBe("live");
  });

  it("does not activate a Demo override midway through a normal Live document", async () => {
    const control = savedSettings();
    const h = harness({ search: "", request: control.request }); await h.flush();
    h.window.location.search = "?prefill=demo"; h.rerender(); await h.flush();
    expect(await h.sdkOptions[0].createOrder()).toBe(livePair.order_id);
    calls(h, "config").forEach(([, opts]: any[]) => expect(opts).toEqual({ method: "GET" }));
    expect(JSON.parse(calls(h, "order")[0][1].body)).not.toHaveProperty("demo_mode");
    expect(new URL(h.scripts[0].src).searchParams.get("client-id")).toBe(liveConfig.client_id);
    expect(h.entries.get(normalKey)).toBe(JSON.stringify(livePair));
    expect(h.entries.has(demoKey)).toBe(false);
  });

  it.each([
    { label: "unavailable Sandbox credentials", value: { configured: false, environment: "sandbox", amount: "29.00", currency: "USD", readiness_reason: "sandbox_credentials_unavailable", detail: privateDetail } },
    { label: "incorrect Live server configuration", value: liveConfig },
  ])("fails closed before any SDK or charge for $label and never falls back to Live", async ({ value }) => {
    const request = vi.fn(async (path: string, opts: any) => {
      if (path.endsWith("/config")) return opts?.demo_mode === true ? value : liveConfig;
      throw Error("Unexpected mocked charge endpoint");
    });
    const h = harness({ search: "?prefill=demo", request }); await h.flush();
    expectDemoConfigCalls(h, 1);
    expect(h.scripts).toHaveLength(0); expect(h.sdk.CardFields).not.toHaveBeenCalled();
    expect(h.text()).toContain(configError); expect(h.text()).not.toContain(privateDetail);
    expect(h.props.getInput).not.toHaveBeenCalled(); expectNoCharge(h);
    h.payButton()?.props.onClick(); await h.flush(); expectNoCharge(h);
    h.walk(node => node.type === "button" && node.props.children === "Retry loading payment options")[0].props.onClick(); await h.flush();
    expectDemoConfigCalls(h, 2);
    expect(h.scripts).toHaveLength(0); expect(h.sdk.CardFields).not.toHaveBeenCalled();
    expect(h.text()).toContain(configError); expectNoCharge(h);
    expect(h.window.sessionStorage.setItem).not.toHaveBeenCalled();
  });

  it.each(["native", "create", "capture"])("rejects a bad fresh Live response during Demo %s before provider activity or a new charge", async stage => {
    let current: any = config;
    const request = vi.fn(async (path: string) => {
      if (path.endsWith("/config")) return { ...current };
      if (path.endsWith("/order")) return { ...pair, environment: "sandbox" };
      if (path.endsWith("/capture")) return demoReceipt;
      throw Error("Unexpected mocked endpoint");
    });
    const h = harness({ search: "?prefill=demo", request }); await h.flush();
    if (stage === "capture") await h.sdkOptions[0].createOrder();
    current = liveConfig;
    if (stage === "native") await h.payButton().props.onClick();
    else await expect(stage === "capture" ? h.sdkOptions[0].onApprove({ orderID: pair.order_id }) : h.sdkOptions[0].createOrder()).rejects.toThrow(configError);
    await h.flush();
    expectDemoConfigCalls(h, stage === "capture" ? 3 : 2);
    expect(calls(h, "order")).toHaveLength(stage === "capture" ? 1 : 0);
    expect(calls(h, "capture")).toHaveLength(0);
    expect(h.sdkInstances[0].getState).not.toHaveBeenCalled(); expect(h.sdkInstances[0].submit).not.toHaveBeenCalled();
    expect(h.props.getInput).toHaveBeenCalledTimes(stage === "capture" ? 1 : 0);
    expect(h.props.onComplete).not.toHaveBeenCalled();
    expect(h.text()).toContain(configError);
    h.sdkOptions[0].onError(new Error(privateDetail)); await h.flush();
    expect(h.text()).toContain(configError); expect(h.text()).not.toContain(privateDetail);
    if (stage === "capture") expect(h.entries.get(demoKey)).toBe(JSON.stringify(pair));
    expectSandboxSdk(h);
  });

  it("ignores and preserves a saved normal-key Live pair while creating and capturing a new Demo pair", async () => {
    const control = savedSettings();
    const saved = { ...livePair, environment: "live", payment_status: "COMPLETED" };
    const h = harness({ search: "?prefill=demo", saved, request: control.request }); await h.flush();
    expect(calls(h, "status")).toHaveLength(0);
    expect(h.window.sessionStorage.getItem.mock.calls.every(([key]: any[]) => key === demoKey)).toBe(true);
    expect(h.entries.get(normalKey)).toBe(JSON.stringify(saved));
    expect(await h.sdkOptions[0].createOrder()).toBe(pair.order_id);
    expect(h.entries.get(demoKey)).toBe(JSON.stringify(pair));
    await h.sdkOptions[0].onApprove({ orderID: pair.order_id }); await h.flush();
    expect(calls(h, "order")).toHaveLength(1); expect(calls(h, "capture")).toHaveLength(1);
    expect(h.entries.get(normalKey)).toBe(JSON.stringify(saved)); expect(h.entries.has(demoKey)).toBe(false);
    expect(h.window.sessionStorage.setItem.mock.calls.every(([key]: any[]) => key === demoKey)).toBe(true);
    expect(h.window.sessionStorage.removeItem.mock.calls).toEqual([[demoKey]]);
    expect(h.props.onComplete).toHaveBeenCalledWith(demoReceipt);
  });

  it("recovers only the Demo-key opaque pair, checks it server-side, and leaves the normal Live pair untouched", async () => {
    const control = savedSettings();
    const savedDemo = { ...pair, payment_status: "COMPLETED", answers: "never-trust-saved-demo-answers" };
    const h = harness({ search: "?prefill=demo", saved: livePair, savedDemo, request: control.request }); await h.flush();
    expectDemoConfigCalls(h, 1);
    expect(calls(h, "status")).toHaveLength(1);
    expect(JSON.parse(calls(h, "status")[0][1].body)).toEqual({ payment_token: pair.payment_token });
    expect(h.props.onComplete).not.toHaveBeenCalled();
    expect(await h.sdkOptions[0].createOrder()).toBe(pair.order_id);
    expect(h.props.getInput).not.toHaveBeenCalled(); expect(calls(h, "order")).toHaveLength(0);
    expect(h.entries.get(demoKey)).toBe(JSON.stringify(pair));
    await h.sdkOptions[0].onApprove({ orderID: pair.order_id }); await h.flush();
    expectDemoConfigCalls(h, 3);
    expect(calls(h, "capture")).toHaveLength(1);
    expect(h.entries.get(normalKey)).toBe(JSON.stringify(livePair)); expect(h.entries.has(demoKey)).toBe(false);
    expect(h.window.sessionStorage.getItem.mock.calls.every(([key]: any[]) => key === demoKey)).toBe(true);
    expect(h.window.sessionStorage.setItem.mock.calls.every(([key, value]: any[]) => key === demoKey && value === JSON.stringify(pair))).toBe(true);
    expect(h.window.sessionStorage.removeItem.mock.calls).toEqual([[demoKey]]);
    expect(h.text()).not.toContain(savedDemo.answers); expect(h.props.onComplete).toHaveBeenCalledWith(demoReceipt);
  });

  it("ignores incoming resume-payment props in Demo so a normal Live candidate cannot replace Demo recovery", async () => {
    const control = savedSettings();
    const h = harness({ search: "?prefill=demo", savedDemo: pair, request: control.request }); await h.flush();
    h.props.resumePayment = livePair; h.rerender(); await h.flush();
    expect(calls(h, "status")).toHaveLength(1);
    expect(await h.sdkOptions[0].createOrder()).toBe(pair.order_id);
    expect(calls(h, "order")).toHaveLength(0);
    expect(h.entries.get(demoKey)).toBe(JSON.stringify(pair));
    expect(h.window.sessionStorage.setItem.mock.calls.every(([, value]: any[]) => value === JSON.stringify(pair))).toBe(true);
    expect(h.request.mock.calls.filter(([, opts]: any[]) => opts?.body?.includes(livePair.payment_token))).toHaveLength(0);
  });

  it("does not recover a late Live resume-payment prop when the Demo-key has no pair", async () => {
    const control = savedSettings();
    const h = harness({ search: "?prefill=demo", request: control.request }); await h.flush();
    h.props.resumePayment = livePair; h.rerender(); await h.flush();
    expect(calls(h, "status")).toHaveLength(0);
    expect(await h.sdkOptions[0].createOrder()).toBe(pair.order_id);
    expect(calls(h, "order")).toHaveLength(1);
    expect(h.entries.get(demoKey)).toBe(JSON.stringify(pair)); expect(h.entries.has(normalKey)).toBe(false);
  });

  it("keeps Demo secrets and opaque capabilities out of markup, scripts and diagnostics without localStorage or analytics", async () => {
    const request = vi.fn(async (path: string) => path.endsWith("/config") ? { ...config, detail: privateDetail } : path.endsWith("/order") ? pair : demoReceipt);
    const h = harness({ search: "?prefill=demo", request }); await h.flush();
    await h.sdkOptions[0].createOrder(); await h.flush();
    for (const sensitive of [privateDetail, pair.payment_token]) {
      expect(h.text()).not.toContain(sensitive); expect(JSON.stringify(h.tree())).not.toContain(sensitive);
      expect(h.scripts[0].src).not.toContain(sensitive);
    }
    expect(source).not.toMatch(/console\.|\.identify\(|\.track\(|gtag\(|fbq\(|localStorage/);
    expect(h.window).not.toHaveProperty("localStorage");
    expect(h.window.sessionStorage.setItem.mock.calls).toEqual([[demoKey, JSON.stringify(pair)]]);
    h.sdkOptions[0].onError(new Error(privateDetail)); await h.flush();
    expect(h.text()).toContain(decline); expect(h.text()).not.toContain(privateDetail);
    expectSandboxSdk(h);
  });

  it("preserves the exact $29 four-field markup, secure CTA, fine print and provider styling in Demo", async () => {
    const control = savedSettings();
    const h = harness({ search: "?prefill=demo", request: control.request }); await h.flush();
    const labels = ["Cardholder name", "Card number", "Expiration date", "Security code"];
    expect(h.walk(node => node.props?.className === "mmd-text-card-label").map(node => h.text(node))).toEqual(labels);
    expect(h.walk(node => node.props?.className === "mmd-text-card-host").map(node => node.props["aria-label"])).toEqual(labels);
    const rows = h.walk(node => node.props?.className === "mmd-text-card-row");
    expect(rows).toHaveLength(1);
    expect(h.walk(node => node.props?.className === "mmd-text-card-label", rows[0]).map(node => h.text(node))).toEqual(labels.slice(2));
    expect(h.walk(node => node.type === "button" && /\bPay\b/.test(h.text(node)))).toHaveLength(1);
    expect(h.text(h.payButton())).toBe("Pay $29 securely →"); expect(h.payButton().props.disabled).toBe(false);
    expect(h.text()).toContain("Credit card payment – $29 today");
    expect(h.text()).toContain("Charged once. Full refund if Dr. Al-Deek determines you're not a candidate. Medication costs are separate.");
    expect(h.text()).not.toMatch(/Pay with PayPal|PayPal wallet|You can use PayPal/);
    expect(h.walk(node => node.type === "input" || node.type === "textarea" || node.type === "iframe" || node.props?.contentEditable)).toHaveLength(0);
    expect(h.parent.attributes).toEqual({ "data-hj-suppress": "true", "data-cs-mask": "true" });
    expect(h.sdkOptions[0].style).toEqual({ input: { "font-size": "16px", "font-family": "Arial, sans-serif", color: "#113A3A", padding: "12px", border: "0", "box-shadow": "none" }, ":focus": { color: "#113A3A" }, ".invalid": { color: "#a52c35" } });
    expect(css).toContain("font: 400 12px/1.5 Inter");
    expect(css).toContain("grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 12px;");
    expect(css).toContain("width: 100%; height: 48px; min-width: 0; overflow: hidden;");
    const payStyles = css.match(/\.mmd-text-payment\s+\.mmd-text-payment-pay\s*\{([^}]+)\}/)?.[1];
    expect(payStyles).toMatch(/width:\s*100%/); expect(payStyles).toMatch(/min-height:\s*48px/); expect(payStyles).toMatch(/border-radius:\s*999px/);
    expect(css).not.toMatch(/position:\s*(fixed|sticky)/);
    expectSandboxSdk(h); expectNoCharge(h);
  });
});
