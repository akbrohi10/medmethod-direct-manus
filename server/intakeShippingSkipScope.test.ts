import { inverseApprovedV2HeroQuestion } from "./weightLossMenopauseV2HeroQuestion.test";
import { verifyApprovedHormoneSymptomQuizAsset } from "./hormoneSymptomQuizScope.test";
import {inverseApprovedFinalProgressLabel,finalProgressLabelFixturePath} from './intakeFinalProgressLabelScope.test';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe,expect,it} from 'vitest';
const root=resolve(import.meta.dirname,'..');
export const shippingSkipFixturePath='server/fixtures/intakeShippingSkipFragments.json';
const raw=readFileSync(resolve(root,shippingSkipFixturePath),'utf8');
const hash='e9eb3219e5d1e729fbdc5a992b5b64d924e5324a177ad1a38c56445091fc704d';
type Fragment={old:string;new:string;count:number};
const packet:{baseline:string;files:Record<string,Fragment[]>}=JSON.parse(raw);
if(createHash('sha256').update(raw).digest('hex')!==hash||packet.baseline!=='5fcf1b75'||Object.keys(packet.files).sort().join('|')!=='client/intake/index.html|server/intakeSubmissionContract.ts'||packet.files['client/intake/index.html'].length!==10||packet.files['server/intakeSubmissionContract.ts'].length!==4||Object.values(packet.files).flat().some(f=>f.count!==1||!f.old||!f.new||f.old===f.new))throw new Error('Unexpected approved shipping skip packet');
export function inverseApprovedShippingSkip(path:string,source:string){source=inverseApprovedFinalProgressLabel(path,source);for(const f of [...(packet.files[path]??[])].reverse()){if(source.split(f.new).length-1!==f.count)throw new Error('Unexpected authorized shipping skip fragment count');source=source.split(f.new).join(f.old);}return source;}
const read=(p:string)=>readFileSync(resolve(root,p),'utf8'),old=(p:string)=>execFileSync('git',['show',`5fcf1b75:${p}`],{cwd:root,encoding:'utf8'});
describe('shipping skip exact authorized scope',()=>{
 it('freezes all14approved source fragments and restores both entire files',()=>{expect(createHash('sha256').update(raw).digest('hex')).toBe(hash);for(const path of Object.keys(packet.files))expect(inverseApprovedShippingSkip(path,read(path))).toBe(old(path));});
 it('rejects missing/duplicate fragments and does not hide unrelated edits',()=>{for(const[path,fragments]of Object.entries(packet.files)){const s=read(path);for(const f of fragments){expect(()=>inverseApprovedShippingSkip(path,s.replace(f.new,f.old))).toThrow('Unexpected authorized shipping skip fragment count');expect(()=>inverseApprovedShippingSkip(path,s+f.new)).toThrow('Unexpected authorized shipping skip fragment count');}expect(inverseApprovedShippingSkip(path,s+'\nUNAPPROVED')).not.toBe(old(path));}expect(inverseApprovedShippingSkip('server/intakePaymentRoutes.ts','unchanged')).toBe('unchanged');});
 it('allows only the two shipping files and retains every previous fixture and progress asset',()=>{const scope=['client','server','shared','drizzle','package.json','pnpm-lock.yaml','vite.config.ts'];const paths=[...execFileSync('git',['diff','--name-only','5fcf1b75','--',...scope],{cwd:root,encoding:'utf8'}).split('\n'),...execFileSync('git',['ls-files','--others','--exclude-standard','--',...scope],{cwd:root,encoding:'utf8'}).split('\n')].filter(p=>p&&!/\.test\.[cm]?[jt]sx?$/.test(p)&&![shippingSkipFixturePath,finalProgressLabelFixturePath].includes(p))
      .filter(p => !["client/src/pages/WeightLossMenopauseV2.tsx", "client/src/pages/WeightLossMenopauseV2.css"].includes(p) || inverseApprovedV2HeroQuestion(p, readFileSync(resolve(process.cwd(), p), "utf8")) !== execFileSync("git", ["show", String('5fcf1b75') + ":" + p], { cwd: process.cwd(), encoding: "utf8" }))
      .filter(p => !verifyApprovedHormoneSymptomQuizAsset(p, readFileSync(resolve(process.cwd(), p), "utf8")))
      .filter(p => !["client/src/App.tsx", "server/_core/index.ts"].includes(p) || inverseApprovedFinalProgressLabel(p, readFileSync(resolve(process.cwd(), p), "utf8")) !== execFileSync("git", ["show", `5fcf1b75:${p}`], { cwd: process.cwd(), encoding: "utf8" })).filter(p=>p!=='client/public/intake/progress.js'||inverseApprovedFinalProgressLabel(p,read(p))!==old(p));expect([...new Set(paths)].sort()).toEqual(Object.keys(packet.files).sort());for(const path of execFileSync('git',['ls-tree','-r','--name-only','5fcf1b75','--','server/fixtures'],{cwd:root,encoding:'utf8'}).trim().split('\n'))expect(read(path)).toBe(old(path));expect(inverseApprovedFinalProgressLabel('client/public/intake/progress.js',read('client/public/intake/progress.js'))).toBe(old('client/public/intake/progress.js'));});
});
