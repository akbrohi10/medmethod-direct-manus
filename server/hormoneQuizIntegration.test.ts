import { describe,it,expect,vi } from "vitest";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { QUIZ_QUESTIONS,QUIZ_ITEMS,computeQuizScore,createTestQuizAnswers,quizAnswerTexts,validateQuizAnswers } from "./hormoneQuizModel";
import { createQuizService,buildGhlQuizPayload,buildKeragonQuizPayload,normalizeQuizPhone,type StoredQuizRecord } from "./hormoneQuizService";
import { decryptQuizRecord,encryptQuizRecord } from "./hormoneQuizSecurity";
import { createQuizPrivateReports } from "./hormoneQuizPrivateReport";
import { generateQuizReportPdf } from "./hormoneQuizPdf";
import type { QuizStore,QuizRecordRow,QuizClaim } from "./hormoneQuizStore";
import { hormoneQuizRouter } from "./routers/hormoneQuiz";

const source=readFileSync(resolve(import.meta.dirname,"../client/public/hormone-symptom-quiz.html"),"utf8");
function fakeStore(now:()=>number){
 const rows=new Map<string,QuizRecordRow>(),jobs:Map<string,any>=new Map();
 const store:QuizStore={
  async find(key){return rows.get(key)??null},
  async insert(row,maxAttempts){const existing=rows.get(row.requestKeyHash);if(existing)return existing;rows.set(row.requestKeyHash,row);for(const provider of ["keragon","ghl"]){jobs.set(row.quizId+provider,{quizId:row.quizId,provider,attempts:0,maxAttempts,status:"pending",nextAttemptAt:now(),httpStatus:0})}return row},
  async claim(owner,quizId){const job=[...jobs.values()].find(j=>(!quizId||j.quizId===quizId)&&j.status==="pending"&&j.nextAttemptAt<=now()&&j.attempts<j.maxAttempts);if(!job)return null;job.attempts++;job.status="processing";job.leaseOwner=owner;return {...job,encryptedRecord:[...rows.values()].find(r=>r.quizId===job.quizId)!.encryptedRecord} as QuizClaim},
  async finish(claim,status,success){const job=jobs.get(claim.quizId+claim.provider);job.httpStatus=status;job.status=success?"sent":claim.attempts>=claim.maxAttempts?"failed":"pending";job.nextAttemptAt=now()+30000;},
  async statuses(quizId){return [...jobs.values()].filter(j=>j.quizId===quizId)},
 };
 return {store,rows,jobs};
}
const input=(request_key="1".repeat(48))=>({request_key,name:"Test Quiz",email:"test+quiz@medmethoddirect.com",phone:"+15555550100",answers:createTestQuizAnswers()});
const reports={prepare:vi.fn(async()=>({url:"https://example.invalid/private-token",expiresAt:Date.now()+86400000})),cleanup:vi.fn(async()=>({deleted:0}))};
const pdf=vi.fn(async()=>Buffer.from("%PDF-synthetic-test"));
const configuration=()=>({keragon:"https://keragon.example.invalid/hook",ghl:"https://ghl.example.invalid/hook"});

describe("completed Hormone Symptom Quiz integration",()=>{
 it("keeps every client question and model weight exact, 30 core questions plus recognition/conditional answers, and scores identical across varied full answer sets",()=>{
  const context:any={};runInNewContext([...source.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1],context);
  expect(QUIZ_QUESTIONS).toEqual(JSON.parse(JSON.stringify(context.QUESTIONS.map((q:any)=>({id:q.id,sec:q.sec,text:q.text,...q.multi?{multi:q.multi}:{},...q.conditional?{conditional:q.conditional}:{},opts:q.opts})))));
  expect(QUIZ_QUESTIONS.filter(q=>q.id!=="recognize"&&!q.conditional)).toHaveLength(30);
  const scoring=source.slice(source.indexOf("    var ITEM_DEFS = ["),source.indexOf("    function subscore("));
  for(let mode=0;mode<8;mode++){
   const answers=createTestQuizAnswers();QUIZ_QUESTIONS.filter(q=>!q.conditional&&!q.multi).forEach((q,i)=>answers[q.id]=(i+mode)%q.opts.length);
   context.answers=answers;context.label=(q:any,i:number)=>q.opts[i][0];context.isSkip=(q:any,i:number)=>q.opts[i]?.[2]==="skip";context.sev=(q:any,i:number)=>typeof q.opts[i]?.[1]==="number"?q.opts[i][1]:null;
   runInNewContext(scoring,context);expect(QUIZ_ITEMS).toEqual(JSON.parse(JSON.stringify(context.ITEM_DEFS)));
   const actual=computeQuizScore(validateQuizAnswers(answers)),client=context.computeModel();expect(actual.balance_index).toBe(client.index);expect(actual.domain_scores).toEqual(JSON.parse(JSON.stringify(client.scores)));expect(actual.score_band).toBe(context.bandOf("index",client.index)?.name??"Insufficient data");
  }
  expect(quizAnswerTexts(createTestQuizAnswers())).toHaveLength(32);
  const answers=createTestQuizAnswers();answers.weird=[12];delete answers.weirdWorst;expect(quizAnswerTexts(validateQuizAnswers(answers))).toHaveLength(31);
 }),
 it("rejects partial quizzes, unknown IDs, invalid selections, conflicting none and invalid follow-up before any record/PDF/POST",async()=>{
  let now=1000000;const f=fakeStore(()=>now),post=vi.fn();const service=createQuizService({store:f.store,pdf,reports,fetch:post,configuration});
  for(const answers of [{}, {...createTestQuizAnswers(),wakeNights:99},{...createTestQuizAnswers(),secret:0},{...createTestQuizAnswers(),weird:[0,12]},{...createTestQuizAnswers(),weirdWorst:9}])await expect(service.complete({...input(),answers},"https://medmethoddirect.com")).rejects.toThrow();
  expect(f.rows.size).toBe(0);expect(post).not.toHaveBeenCalled();
  for(const raw of ["5555550100","(555) 555-0100","+1 555 555 0100","15555550100"])expect(normalizeQuizPhone(raw)).toBe("+15555550100");
  expect(()=>normalizeQuizPhone("555555010012")).toThrow();
 }),
 it("stores one AES-GCM encrypted completion with server UUID and stable duplicate key even on concurrent submissions; payload projection never leaks health data to GHL",async()=>{
  const f=fakeStore(Date.now),post=vi.fn(async(_url:any,_init?:RequestInit)=>new Response(null,{status:204}));const service=createQuizService({store:f.store,pdf,reports,fetch:post,configuration});
  const result=await Promise.all([service.complete(input(),"https://medmethoddirect.com"),service.complete(input(),"https://medmethoddirect.com")]);
  expect(result[0].quiz_id).toBe(result[1].quiz_id);expect(result[0].quiz_id).toMatch(/^[0-9a-f-]{36}$/);expect(f.rows.size).toBe(1);expect(post).not.toHaveBeenCalled();
  const row=[...f.rows.values()][0];expect(row.encryptedRecord.toString()).not.toContain("Test");expect(row.encryptedRecord.toString()).not.toContain("wakeNights");
  const record=decryptQuizRecord<StoredQuizRecord>(row.quizId,row.encryptedRecord);expect(record.phone).toBe("+15555550100");expect(record.answers.map(a=>a.id)).toEqual(quizAnswerTexts(createTestQuizAnswers()).map(a=>a.id));
  expect(Object.keys(buildGhlQuizPayload({...record,...{unexpectedHealth:"DO NOT SEND"}} as StoredQuizRecord))).toEqual(["first_name","last_name","email","phone","tags","source","submitted_at","quiz_answers"]);
  const full=buildKeragonQuizPayload(record);expect(full.event).toBe("mmd_quiz.completed");expect(full.quiz_id).toBe(result[0].quiz_id);expect(full.report_document_name).toMatch(/^Hormone Symptom Quiz Report - \d{4}-\d{2}-\d{2}$/);expect(full.report_document_name).not.toContain("&");expect(full.balance_index).toBe(computeQuizScore(createTestQuizAnswers()).balance_index);
  await service.flush();expect(post).toHaveBeenCalledTimes(2);await service.flush();expect(post).toHaveBeenCalledTimes(2);
  const bodies=post.mock.calls.map(c=>JSON.parse((c[1] as RequestInit).body as string));expect(bodies.find(b=>b.tags)).toEqual(buildGhlQuizPayload(record));
  await expect(service.complete({...input(),name:"Changed name"},"https://medmethoddirect.com")).rejects.toThrow();
 }),
 it("retries each failed destination only once, never before thirty seconds, isolates provider success, never reads response bodies, and logs status plus quiz_id only",async()=>{
  let now=1000000;const f=fakeStore(()=>now),warnings:any[]=[];const post=vi.fn(async(url:any,_init?:RequestInit)=>new Response(null,{status:String(url).includes("keragon")?503:200}));
  const service=createQuizService({store:f.store,pdf,reports,now:()=>now,fetch:post,configuration,warn:v=>warnings.push(v)});
  const accepted=await service.complete(input(),"https://medmethoddirect.com");await service.flush();expect(post).toHaveBeenCalledTimes(2);expect(warnings).toHaveLength(0);
  now+=29999;await service.flush();expect(post).toHaveBeenCalledTimes(2);now++;await service.flush();expect(post).toHaveBeenCalledTimes(3);await service.flush();expect(post).toHaveBeenCalledTimes(3);
  expect(warnings).toEqual([{status_code:503,quiz_id:accepted.quiz_id}]);expect([...f.jobs.values()].map(j=>j.attempts).sort()).toEqual([1,2]);
  for(const call of post.mock.calls){expect((call[1] as RequestInit).redirect).toBe("error");expect((call[1] as RequestInit).headers).toMatchObject({"Idempotency-Key":expect.stringContaining(accepted.quiz_id)});}
 }),
 it("admin test sends exactly one fixed dummy record to each destination and duplicate admin clicks never issue extra requests",async()=>{
  const f=fakeStore(Date.now),post=vi.fn(async(_url:any,_init?:RequestInit)=>new Response(null,{status:202}));const service=createQuizService({store:f.store,pdf,reports,fetch:post,configuration});
  const result=await service.sendTest("2".repeat(48),"https://medmethoddirect.com");expect(result.keragon_http_status).toBe(202);expect(result.ghl_http_status).toBe(202);expect(post).toHaveBeenCalledTimes(2);
  await service.sendTest("2".repeat(48),"https://medmethoddirect.com");expect(post).toHaveBeenCalledTimes(2);
  for(const call of post.mock.calls){const body=JSON.parse((call[1] as RequestInit).body as string);expect(body.first_name).toBe("Test");expect(body.last_name).toBe("Quiz");expect(body.email).toBe("test+quiz@medmethoddirect.com");expect(body.phone).toBe("+15555550100");}
 }),
 it("private PDFs are generated server-side, random/HMAC signed, valid before exact expiry, invalid when tampered or expired, and deleted via encrypted storage",async()=>{
  let now=Date.now();const objects=new Map<string,{bytes:Buffer;expiry:number}>();
  const blobs:any={put:async(k:string,b:Buffer,e:number)=>objects.set(k,{bytes:b,expiry:e}),get:async(k:string)=>objects.get(k)?.bytes??null,delete:async(k:string)=>objects.delete(k),cleanup:async()=>({deleted:0})};
  const reportStore=createQuizPrivateReports({blobs,now:()=>now});
  const bytes=await generateQuizReportPdf({name:"Test Quiz",submitted_at:new Date(now).toISOString(),balance_index:73,score_band:"Moderate",answers:quizAnswerTexts(createTestQuizAnswers())});expect(bytes.subarray(0,5).toString()).toBe("%PDF-");expect(bytes.length).toBeLessThan(2*1024*1024);
  const prepared=await reportStore.prepare(bytes,"https://medmethoddirect.com");const token=prepared.url.split("/").at(-1)!;expect(prepared.expiresAt).toBe(now+86400000);expect(token.split(".")[0]).toHaveLength(43);expect(prepared.url).not.toContain("Test");expect(await reportStore.download(token)).toEqual(bytes);expect(await reportStore.download(token.slice(0,-1)+"Z")).toBeNull();
  now=prepared.expiresAt-1;expect(await reportStore.download(token)).toEqual(bytes);now++;expect(await reportStore.download(token)).toBeNull();expect(objects.size).toBe(0);
  const cipher=encryptQuizRecord(randomUUID(),{health:"dummy"});cipher[cipher.length-1]^=1;expect(()=>decryptQuizRecord(randomUUID(),cipher)).toThrow("Quiz storage unavailable.");
 }),
 it("the admin test and configuration procedures reject unauthenticated and ordinary-user callers",async()=>{
  const anonymous:any={user:null,req:{headers:{host:"medmethoddirect.com"}},res:{}};
  await expect(hormoneQuizRouter.createCaller(anonymous).sendTest({request_key:"3".repeat(48)})).rejects.toMatchObject({code:"FORBIDDEN"});
  await expect(hormoneQuizRouter.createCaller({...anonymous,user:{role:"user"}}).configuration()).rejects.toMatchObject({code:"FORBIDDEN"});
 }),
 it("quiz HTML preserves design/report/scoring; transport fires only after contact validation and renderReport and resets only with explicit restart",()=>{
  expect(source).toContain('renderReport();\n      if (window.mmdQuizComplete) window.mmdQuizComplete(submissionRecord);');
  expect(source.indexOf('if (!phoneOk)')).toBeLessThan(source.indexOf('if (window.mmdQuizComplete)'));
  expect(source.match(/window\.mmdQuizComplete\(submissionRecord\)/g)).toHaveLength(1);
  expect(source).toContain('if (window.mmdQuizReset) window.mmdQuizReset();');
  expect(source).not.toContain("KERAGON_QUIZ_WEBHOOK_URL");expect(source).not.toContain("GHL_QUIZ_WEBHOOK_URL");
 });
});
