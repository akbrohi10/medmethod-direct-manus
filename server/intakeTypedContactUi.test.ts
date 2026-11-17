import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..');
const read=(file:string)=>fs.readFileSync(path.join(root,file),'utf8');
function helpers(query='', hj?:Function){
 const window:any={ location:{search:query},hj,setTimeout,clearTimeout };window.self=window;window.top=window;
 const context:any={window,URLSearchParams,document:{},Promise};
 vm.runInNewContext(read('client/public/intake/typed-signature.js'),context);
 vm.runInNewContext(read('client/public/intake/contact-step.js'),context);
 return {window,context,typed:window.MmdTypedSignature};
}
describe('typed-signature and final-contact presentation',()=>{
 it.each(['Test Quiz',"Anne-Marie O’Neill",'José García'])('accepts a complete typed name %s',name=>{expect(helpers().typed.valid(name)).toBe(true)});
 it.each(['','Test','1 2','Test '+ 'A'.repeat(161)])('rejects incomplete or oversized names',name=>{expect(helpers().typed.valid(name)).toBe(false)});
 it('normalizes identical name whitespace without changing spelling',()=>{expect(helpers().typed.name('  Test   Quiz  ')).toBe('Test Quiz')});
 it('uses the three requested styles and no drawing/storage APIs',()=>{const h=helpers();expect(h.typed.styles.map((s:any)=>s.id)).toEqual(['dancing_script','great_vibes','homemade_apple']);const ui=read('client/public/intake/sign-forms-ui.js');expect(ui).not.toContain('onPointerDown');expect(ui).not.toContain('localStorage');expect(ui).not.toContain('sessionStorage');expect(ui).toContain('signature_method: "typed"');expect(ui).toContain('image.name === normalized');expect(ui).toContain('image.style === choice')});
 it('waits for all font outcomes and allows a failed style to fall back',async()=>{const h=helpers();h.window.setTimeout=()=>0;h.context.document.fonts={load:(font:string)=>font.includes('Dancing')?Promise.reject(new Error('font failed')):Promise.resolve([{}]),check:()=>true};expect(Array.from(await h.typed.load())).toEqual([false,true,true])});
 it('emits only static sign-error events, with no name or answer parameters',()=>{const calls:any[]=[];const h=helpers('',(...v:any[])=>calls.push(v));h.typed.event('name_incomplete',false);h.typed.event('font_load_failed',false);h.typed.event('Test Quiz',false);expect(calls).toEqual([['event','sign_error_name_incomplete'],['event','sign_error_font_load_failed']])});
 it.each(['?prefill=demo','?test=true','?preview=results','?admin=1'])('excludes sign-error telemetry in %s',query=>{const calls:any[]=[];const h=helpers(query,(...v:any[])=>calls.push(v));h.typed.event('name_incomplete',false);expect(calls).toEqual([])});
 it.each(['4045550123','(404) 555-0123','+1 404 555 0123'])('accepts US phone format %s',phone=>{expect(helpers().window.MmdCareUsPhone(phone)).toBe(true)});
 it.each(['1111111111','+44 2071234567','abc4045550123','404555012'])('rejects invalid/non-US phone %s',phone=>{expect(helpers().window.MmdCareUsPhone(phone)).toBe(false)});
 it('requires a matching typed name/style while retaining the five audit checks',()=>{
  const h=helpers(), html=read('client/intake/index.html'),start=html.indexOf('function MmdSigningPayloadReady(');vm.runInNewContext(html.slice(start,html.indexOf('function MmdIntakeFinish(',start)),h.context);
  const signing:any={version:'2026-10',signer_name:'Test Quiz',typed_name:'Test Quiz',relation:'',signed_at:'2026-11-17T17:00:00.000Z',document_checks:{glp1:true,general:true,telehealth:true,privacy:true,policy:true},electronic_agreement:true,signature_png:'data:image/png;base64,sample',signature_method:'typed',signature_style:'dancing_script'};
  expect(h.context.MmdSigningPayloadReady(signing)).toBe(true);expect(h.context.MmdSigningPayloadReady({...signing,typed_name:'Other Name'})).toBe(false);expect(h.context.MmdSigningPayloadReady({...signing,signature_style:'unknown'})).toBe(false);expect(h.context.MmdSigningPayloadReady({...signing,electronic_agreement:false})).toBe(false);
 });
 it('keeps consent required, exact wording, merged checked agreements and no verification component',()=>{
  const source=read('client/public/intake/contact-step.js');expect(source).toContain('checked: answers.smsOptIn === true');expect(source).toContain('checked: answers.terms === true && answers.checkoutAck === true');expect(source).toContain('update("terms", e.target.checked); update("checkoutAck", e.target.checked)');expect(source).not.toContain('MmdPhoneVerification');expect(source).toContain("Texts aren't encrypted. Msg frequency varies; msg & data rates may apply. Reply STOP to opt out, HELP for help.");const html=read('client/intake/index.html');expect(html).toContain('terms:true,checkoutAck:true,smsOptIn:false');expect(html).not.toContain('phone_verification_token:MmdLivePhoneVerificationToken(answers)');expect(html).toContain('Submit & start my text visit →');
 });
 it('exactly reconstructs the previous intake source by reversing only authorized edits',()=>{
  const fixture=JSON.parse(read('server/fixtures/intake-typed-contact-client-edits.json'));let source=read('client/intake/index.html');for(const edit of [...fixture.edits].reverse()){expect(source.slice(edit.position,edit.position+edit.new.length)).toBe(edit.new);source=source.slice(0,edit.position)+edit.old+source.slice(edit.position+edit.new.length)}expect(crypto.createHash('sha256').update(source).digest('hex')).toBe(fixture.baselineSha256);
 });
});
