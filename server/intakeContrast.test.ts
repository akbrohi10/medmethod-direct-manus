import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { describe, it, expect } from 'vitest';
const css=readFileSync('client/public/intake/contrast.css','utf8');
const html=readFileSync('client/intake/index.html','utf8');
const baseline=execFileSync('git',['show','5e5e676b:client/intake/index.html'],{encoding:'utf8',maxBuffer:10000000});
function luminance(hex:string){const values=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);return values.reduce((v,c,i)=>v+c*[.2126,.7152,.0722][i],0);}
function ratio(a:string,b:string){const values=[luminance(a),luminance(b)].sort((x,y)=>x-y);return (values[1]+.05)/(values[0]+.05);}
describe('Weight Care intake contrast-only layer',()=>{
 it('all control boundaries meet 3:1 against panel, white fields and selected tint',()=>{for(const border of ['#758E89','#6B827D','#0E7C7B'])for(const surface of ['#F5F8F7','#FFFFFF','#E8F4F3'])expect(ratio(border,surface)).toBeGreaterThanOrEqual(3);});
 it('documents why supplied pale control lines cannot meet the requested contrast',()=>{for(const border of ['#B9C7C4','#C5D1CE','#8FA7A3'])expect(ratio(border,'#F5F8F7')).toBeLessThan(3);expect(css).toContain('--mmd-control-line: #758E89');});
 it('only adds the last-loaded intake stylesheet to the existing document',()=>{const anchor='<link rel="stylesheet" href="/intake/usability.css?v=20261117" />';expect(html).toBe(baseline.replace(anchor,anchor+'\n    <link rel="stylesheet" href="/intake/contrast.css?v=20261118" />'));});
 it('uses opaque tinted panel, white controls, specified ink/placeholder and depth shadow',()=>{for(const value of ['background: #F5F8F7','background: #FFFFFF !important','color: #113A3A !important','color: #8A9895 !important','0 1px 2px rgba(17,58,58,0.06)'])expect(css).toContain(value);expect(css.replace(/\.premium-form-panel input\[type="checkbox"\] \{[^}]*\}/,'')).not.toMatch(/(?:padding|margin|max-width|grid-template-columns):[^;]+!important/);});
 it('retains green 2px focus/selected boundary with 3px focus ring and current selected pop',()=>{expect(css).toContain('border: 2px solid #0E7C7B !important');expect(css).toContain('0 0 0 3px rgba(14,124,123,0.15)');expect(css).toContain('background: #E8F4F3 !important');expect(css).toContain('0 0 0 4px rgba(14,124,123,0.08)');});
 it('covers native fields, answer families and real signature selected-state class',()=>{for(const selector of ['select,textarea','.choice','.treatment-option-card','.typed-signature-card.is-selected','.choice .dot','.typed-style-check','input[type="checkbox"]'])expect(css).toContain(selector);expect(css).not.toContain('.treatment-card-select {');});
 it('keeps actual checkbox nodes and provides checked, focus and forced-color rendering',()=>{expect(css).toContain('width: 20px !important');expect(css).toContain('height: 20px !important');expect(css).toContain('input[type="checkbox"]:checked');expect(css).toContain("stroke='white'");expect(css).toContain('@media (forced-colors: active)');expect(css).toContain('appearance: auto');});
 it('reveals only existing DOB sublabels and retains established invalid-field feedback',()=>{expect(css).toContain('.dob-inputs>label>span.sr-only');expect(css).toContain('font-size: 13px !important');expect(css).toContain('font-weight: 500 !important');expect(css).toContain('border-color: var(--mmd-sign-error, #a52c35) !important');expect(css).not.toMatch(/(?:^|\n)\.sr-only\s*\{/);});
});
