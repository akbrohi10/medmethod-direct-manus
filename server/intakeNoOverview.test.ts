import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';
import { describe, expect, it } from 'vitest';
const path='client/intake/index.html';
const source=readFileSync(path,'utf8');
const baseline=execFileSync('git',['show',`3a39384e:${path}`],{encoding:'utf8',maxBuffer:10000000});
const old='...(find("w39")?[signing]:[]),find("w01"),find("w02")?';
const current='...(find("w39")?[signing]:[]),find("w02")?';
function flow(html:string,screens:any[]){const start=html.indexOf('function MmdIntakeFlowScreens('),end=html.indexOf('function MmdIntakeSubmitScreen(',start);const box:any={MmdGlp1:{combine:(v:any)=>v},w:()=>screens};vm.runInNewContext(html.slice(start,end)+';this.flow=MmdIntakeFlowScreens;',box);return box.flow({});}
const screens=['w01','w02','w03a','w04','w05','w30','wShippingAddress','wScalePhoto','w38','w39'].map(id=>({id,type:id==='w02'?'identity':'question',required:true,question_text:id}));
describe('remove late How it works, retain last-step payment',()=>{
 it('changes only the active overview entry in the entire intake document',()=>{expect(baseline.split(old)).toHaveLength(2);expect(source).toBe(baseline.replace(old,current));});
 it('never reintroduces overview at the front and goes directly from signing to identity',()=>{const ids=flow(source,screens).map((x:any)=>x.id);expect(ids).not.toContain('w01');expect(ids.slice(-2)).toEqual(['wSignForms','w02']);expect(ids.filter((id:string)=>id==='w02')).toHaveLength(1);});
 it('keeps every other active screen and definition in the same order',()=>{const before=flow(baseline,screens),after=flow(source,screens);expect(JSON.stringify(after)).toBe(JSON.stringify(before.filter((x:any)=>x.id!=='w01')));});
 it('preserves optional conditional screens and final identity when no signing definition is visible',()=>{const subset=screens.filter(x=>!['wShippingAddress','wScalePhoto','w39'].includes(x.id));const after=flow(source,subset).map((x:any)=>x.id);expect(after.at(-1)).toBe('w02');expect(after).not.toContain('w01');expect(after).not.toContain('wSignForms');});
 it('payment stays gated to the final identity screen, not the welcome or signing',()=>{expect(source).toContain('function MmdIntakeSubmitScreen(screen){return screen?.type==="identity"}');expect(source).toContain('MmdIntakeSubmitScreen(screen)&&(0,M.jsx)(MmdTextPayment,{valid:canContinue');expect(source).toContain('!localReceipt&&screen&&!MmdIntakeSubmitScreen(screen)&&(0,M.jsx)("footer",');});
 it('progress uses the shortened list and marks only final identity as last step',()=>{const box:any={window:{}};vm.runInNewContext(readFileSync('client/public/intake/progress.js','utf8'),box);const api=box.window.MmdCreateIntakeProgress({},{}),list=flow(source,screens);const penultimate=api.project(null,list.at(-2),list,list.slice(0,-2).map((x:any)=>x.id),false),last=api.project(penultimate,list.at(-1),list,list.slice(0,-1).map((x:any)=>x.id),false);expect(penultimate.label).not.toBe('Last step!');expect(last.label).toBe('Last step!');expect(last.rounded).toBe(100);});
});
