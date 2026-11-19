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
const fieldNames = ["NumberField", "ExpiryField", "CVVField"] as const;

// Minimal deterministic React hooks/DOM harness. SDK scripts never execute and every request is mocked.
// Provider fields contain no PAN/CVV/name values: only validity and opaque provider order IDs are modeled.
function harness(options: { config?: any; saved?: any; cardEligible?: boolean; cardValid?: boolean; request?: any; autoSdk?: boolean; missingCardFields?: boolean; fieldRender?: (name: string, host: any) => Promise<void>; submit?: (opts: any) => Promise<any> } = {}) {
  const entries = new Map<string, string>();
  if (options.saved) entries.set("mmd_text_payment_v1", JSON.stringify(options.saved));
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
  it("uses a single namespaced CardFields SDK, three embedded fields, public config and sandbox-only buyer-country", async () => {
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
    expect(new Set(hosts).size).toBe(3);
    expect(h.payButton().props.disabled).toBe(false);
    expect(h.text(h.payButton())).toMatch(/Pay.*\$29/i);
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

  it("keeps native Pay disabled until all three provider fields finish rendering", async () => {
    const release: (() => void)[] = [];
    const h = harness({ fieldRender: () => new Promise<void>(resolve => release.push(resolve)) });
    await h.flush();
    expect(release).toHaveLength(3);
    expect(h.payButton() === undefined || h.payButton().props.disabled === true).toBe(true);
    release.slice(0, 2).forEach(done => done()); await h.flush();
    expect(h.payButton() === undefined || h.payButton().props.disabled === true).toBe(true);
    release[2](); await h.flush();
    expect(h.payButton().props.disabled).toBe(false);
    expect(h.sdkOptions).toHaveLength(1);
    expect(h.request.mock.calls.filter(([path]: any[]) => path.endsWith("/order"))).toHaveLength(0);
  });
});
