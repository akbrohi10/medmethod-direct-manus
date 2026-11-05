import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe,expect,it} from 'vitest';
const root=resolve(import.meta.dirname,'..'),intakePath='client/intake/index.html';
export const progressFixturePath='server/fixtures/intakeProgressFragments.json',progressAssetPath='client/public/intake/progress.js';
const packetText=readFileSync(resolve(root,progressFixturePath),'utf8'),packetHash='ea35a3e938fbb1573c0c87bcbb0fd1df42cadcd03f9439b4ddb245a307bd32d0',assetHash='f0923b67f0f28867cacb8a646f3cfcb87b0f8ee11accd7e7332b87b63196f659';
type Fragment={old:string;new:string;count:number};
const packet:{baseline:string;fragments:Fragment[];introduced_asset:string}=JSON.parse(packetText);
if(createHash('sha256').update(packetText).digest('hex')!==packetHash||packet.baseline!=='bcd801c8'||packet.introduced_asset!==progressAssetPath||packet.fragments.length!==4||packet.fragments.some(f=>f.count!==1||!f.old||!f.new||f.old===f.new))throw new Error('Unexpected approved intake progress packet');
export function inverseApprovedIntakeProgress(path:string,source:string){if(path!==intakePath)return source;for(const f of [...packet.fragments].reverse()){if(source.split(f.new).length-1!==f.count)throw new Error('Unexpected authorized intake progress fragment count');source=source.split(f.new).join(f.old);}return source;}
const read=(p:string)=>readFileSync(resolve(root,p),'utf8'),old=(p:string)=>execFileSync('git',['show',`bcd801c8:${p}`],{cwd:root,encoding:'utf8'});
describe('intake progress exact presentation scope',()=>{
 it('freezes the exact public progress component and four approved HTML hooks',()=>{expect(createHash('sha256').update(read(progressAssetPath)).digest('hex')).toBe(assetHash);expect(createHash('sha256').update(packetText).digest('hex')).toBe(packetHash);});
 it('restores the full intake source to bcd801c8 byte for byte',()=>{expect(inverseApprovedIntakeProgress(intakePath,read(intakePath))).toBe(old(intakePath));});
 it('rejects missing/duplicate hooks and preserves detection of unrelated edits',()=>{const source=read(intakePath);for(const f of packet.fragments){expect(()=>inverseApprovedIntakeProgress(intakePath,source.replace(f.new,f.old))).toThrow('Unexpected authorized intake progress fragment count');expect(()=>inverseApprovedIntakeProgress(intakePath,source+f.new)).toThrow('Unexpected authorized intake progress fragment count');}expect(inverseApprovedIntakeProgress(intakePath,source+'\nUNAPPROVED')).not.toBe(old(intakePath));expect(inverseApprovedIntakeProgress('server/intakePaymentRoutes.ts','unchanged')).toBe('unchanged');});
 it('allows only the two presentation production paths and retains every previous fixture',()=>{const scope=['client','server','shared','drizzle','package.json','pnpm-lock.yaml','vite.config.ts'];const paths=[...execFileSync('git',['diff','--name-only','bcd801c8','--',...scope],{cwd:root,encoding:'utf8'}).split('\n'),...execFileSync('git',['ls-files','--others','--exclude-standard','--',...scope],{cwd:root,encoding:'utf8'}).split('\n')].filter(p=>p&&!/\.test\.[cm]?[jt]sx?$/.test(p)&&p!==progressFixturePath);expect([...new Set(paths)].sort()).toEqual([intakePath,progressAssetPath].sort());for(const path of['server/fixtures/intakeGlp1CombinedFragments.json','server/fixtures/intakeLatePatientInfoFragments.json'])expect(read(path)).toBe(old(path));});
});
