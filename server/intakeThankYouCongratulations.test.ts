import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const pagePath = "client/intake/thank-you/index.html", jsPath = "client/public/intake/video-visit.js";
const page = readFileSync(resolve(root, pagePath), "utf8"), script = readFileSync(resolve(root, jsPath), "utf8");
const baseline = (path: string) => execFileSync("git", ["show", `76d1479d:${path}`], { cwd: root, encoding: "utf8" });
const packet = JSON.parse(readFileSync(resolve(root, "server/fixtures/intakeThankYouWordingFragments.json"), "utf8"));
function extract(text: string, name: string, next: string) { const p = text.search(new RegExp(`  (?:async )?function ${name}\\(`)); expect(p).toBeGreaterThanOrEqual(0); const offset = text.slice(p).search(new RegExp(`\\n\\n  (?:async )?function ${next}\\(`)); expect(offset).toBeGreaterThan(0); return text.slice(p, p + offset); }
const step1 = "You should receive a text (or call) from MedMethod Direct shortly. Please reply to our message so we can stay connected!";

describe("Intake thank-you congratulations wording and timeline", () => {
  it.each([pagePath, jsPath])("makes only the approved exact fragments in %s", path => {
    let restored = path === pagePath ? page : script;
    for (const f of [...packet.files[path]].reverse()) { expect(restored.split(f.new).length - 1).toBe(f.count); restored = restored.split(f.new).join(f.old); }
    expect(restored).toBe(baseline(path));
  });

  it("uses exact heading/subtitle/Step1/closing text while preserving Steps2 and3 complete markup", () => {
    expect(page).toContain('<h1 id="confirmation-title">Congratulations, your intake is complete!</h1>');
    expect(page).toContain('Your free intake has been received. Dr. Al-Deek will review your answers and text you soon.');
    expect(page).toContain(`<strong id="care-message-title">Check your text messages</strong><span id="care-message-copy">${step1}</span>`);
    expect(page).toContain('Complete these steps so Dr. Al-Deek and our Care Team can help with your next steps.');
    const steps = (text: string) => text.match(/<section class="confirmation-next-steps"[\s\S]*?<\/section>/)![0].match(/<li>[\s\S]*?<\/li>/g)!;
    expect(steps(page)).toHaveLength(3); expect(steps(page).slice(1)).toEqual(steps(baseline(pagePath)).slice(1));
  });

  it("preserves both icons and numbered-circle layout while changing only the connector pseudo-elements", () => {
    expect(page.match(/<svg[\s\S]*?<\/svg>/g)).toEqual(baseline(pagePath).match(/<svg[\s\S]*?<\/svg>/g));
    expect(page.match(/\.step-number \{[^}]+\}/)![0]).toBe(baseline(pagePath).match(/\.step-number \{[^}]+\}/)![0]);
    expect(page.match(/\.confirmation-next-steps li \{[^}]+\}/)![0]).toBe(baseline(pagePath).match(/\.confirmation-next-steps li \{[^}]+\}/)![0]);
    expect(page).toContain('top: calc(50% + 21px); bottom: -16px; left: 20px; width: 2px; background: #84cbc7;');
    expect(page).toContain('li:not(:first-child)::before { position: absolute; top: 0; height: calc(50% - 21px); left: 20px; width: 2px; background: #84cbc7;');
    expect(page).toContain('align-items: center; gap: 14px; min-height: 42px;');
    expect(page).toContain('display: grid; gap: 16px;');
  });

  it("uses exact optional video description/reassurance and retains the existing Add Video Visit button markup", () => {
    expect(page).toContain('Add a Zoom video visit with Dr. Al-Deek - <strong>$97.</strong>');
    expect(page).toContain('Includes 7 days of follow-up messaging. Totally optional - your free intake is already complete.');
    const button = '<button class="primary" id="open-video-checkout" type="button">Add a Video Visit — $97</button>';
    expect(page).toContain(button); expect(baseline(pagePath)).toContain(button);
    expect(script).toContain('const VIDEO_VISIT_AMOUNT = "97.00";');
  });

  it("normalizes only phone display and preserves every tap-to-call/email destination", () => {
    const phones = [...page.matchAll(/<a href="tel:([^"]+)">([^<]+)<\/a>/g)];
    expect(phones).toHaveLength(2);
    for (const match of phones) { expect(match[1]).toBe('+18883627011'); expect(match[2]).toBe('(888) 362-7011'); }
    expect(script).toContain('const CARE_PHONE = "(888) 362-7011";');
    expect(page).not.toContain('>888-362-7011<');
    expect(page.match(/href="(?:tel:|mailto:)[^"]+"/g)).toEqual(baseline(pagePath).match(/href="(?:tel:|mailto:)[^"]+"/g));
  });

  it("updates only the bottom Start over destination, keeping header and direct-access intake links unchanged", () => {
    expect(page).toContain('<a class="start-over" href="https://www.medmethoddirect.com">Back to MedMethod Direct</a>');
    expect(page).toContain('<a class="back" href="/intake/">← Back</a>');
    expect(page).toContain('<a class="secondary" href="/intake/">Complete your free intake</a>');
    expect(page).not.toContain('>Start over</a>');
  });

  it("keeps payment/receipt/coupon/recovery/redirect implementations and anonymous gating byte-identical", () => {
    const old = baseline(jsPath);
    for (const [name, next] of [['parseReceipt','readReceipt'],['createVideoOrder','captureVideoOrder'],['captureVideoOrder','validateCoupon'],['validateCoupon','submitCoupon'],['submitCoupon','normalizeVideoStatus'],['recoverVideoStatus','loadPayPalSdk'],['continueToVideoBooking','finishConfirmedVideoVisit'],['initializePage','__end']]) {
      if (next === '__end') { const take=(s:string)=>s.slice(s.indexOf('  function initializePage(')); expect(take(script)).toBe(take(old)); }
      else expect(extract(script,name,next)).toBe(extract(old,name,next));
    }
    const anonymous = (s:string)=>s.match(/<section class="anonymous-panel"[\s\S]*?<\/section>/)![0]; expect(anonymous(page)).toBe(anonymous(baseline(pagePath)));
  });

  it.each([true,false])("shows new Step1 text with SMS=%s without touching receipt or verification/payment state", sms => {
    const nodes = { 'care-message-title': {textContent:'Check your text messages'}, 'care-message-copy': {textContent:step1} };
    const context=vm.createContext({document:{getElementById:(id:keyof typeof nodes)=>nodes[id]??null}});
    new vm.Script(extract(script,'byId','safeJson')+'\n'+extract(script,'applySmsCopy','initializePage')+'\nglobalThis.apply=applySmsCopy;').runInContext(context);
    const receipt={sms_opt_in:sms,submission_id:'synthetic-only',submission_token:'synthetic-only-no-action',video_visit_interest:false,is_test:true,payment_status:'NOT_REQUIRED'};
    const before=JSON.stringify(receipt);context.apply(receipt);expect(nodes['care-message-copy'].textContent).toBe(step1);expect(nodes['care-message-title'].textContent).toBe('Check your text messages');expect(JSON.stringify(receipt)).toBe(before);
  });

  it.each(['paid','waived'])("uses correct tap-to-call display in the legacy %s completion without altering destinations", kind => {
    const nodes = new Map<string,any>([['video-complete-copy',{innerHTML:''}],['video-complete-title',{textContent:''}]]);
    const context=vm.createContext({document:{getElementById:(id:string)=>nodes.get(id)??null}});
    const constants=script.match(/const CARE_EMAIL = [^;]+;/)![0]+'\n'+script.match(/const CARE_PHONE = [^;]+;/)![0];
    new vm.Script(constants+'\n'+extract(script,'byId','safeJson')+'\n'+extract(script,'showComplete','initializeCheckout')+'\nglobalThis.show=showComplete;').runInContext(context);context.show(kind);
    expect(nodes.get('video-complete-copy').innerHTML).toContain('<a href="tel:+18883627011">(888) 362-7011</a>');
  });
});
