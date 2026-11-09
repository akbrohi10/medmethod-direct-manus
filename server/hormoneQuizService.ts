import { randomUUID, randomBytes } from "node:crypto";
import { computeQuizScore, createTestQuizAnswers, quizAnswerTexts, validateQuizAnswers, type QuizAnswers, type QuizAnswerText } from "./hormoneQuizModel";
import { decryptQuizRecord, encryptQuizRecord, quizDigest } from "./hormoneQuizSecurity";
import { generateQuizReportPdf, quizDocumentName } from "./hormoneQuizPdf";
import { quizPrivateReports } from "./hormoneQuizPrivateReport";
import { createQuizSqlStore, type QuizStore, type QuizProvider } from "./hormoneQuizStore";

export type QuizCompletionInput={request_key:string;name:string;email:string;phone:string;answers:unknown};
export type StoredQuizRecord={quiz_id:string;submitted_at:string;first_name:string;last_name:string;name:string;email:string;phone:string;balance_index:number|null;score_band:string;answers:QuizAnswerText[];selections:QuizAnswers;report_pdf_url:string;report_document_name:string;report_expires_at:number;fingerprint:string;is_test:boolean};
export function normalizeQuizPhone(raw:string){let digits=raw.replace(/\D/g,"");if(digits.length===11&&digits[0]==="1")digits=digits.slice(1);if(!/^\d{10}$/.test(digits))throw new Error("A valid US phone number is required.");return "+1"+digits;}
export function buildKeragonQuizPayload(record:StoredQuizRecord){return {event:"mmd_quiz.completed",quiz_id:record.quiz_id,submitted_at:record.submitted_at,first_name:record.first_name,last_name:record.last_name,email:record.email,phone:record.phone,balance_index:record.balance_index,score_band:record.score_band,answers:record.answers.map(a=>({id:a.id,section:a.section,question:a.question,answer:a.answer})),report_pdf_url:record.report_pdf_url,report_document_name:record.report_document_name};}
export function buildGhlQuizPayload(record:StoredQuizRecord){return {first_name:record.first_name,last_name:record.last_name,email:record.email,phone:record.phone,tags:"quiz-completed",source:"hormone-symptom-quiz",submitted_at:record.submitted_at};}
export type QuizServiceDependencies={store?:QuizStore;reports?:Pick<typeof quizPrivateReports,"prepare"|"cleanup">;pdf?:typeof generateQuizReportPdf;now?:()=>number;fetch?:typeof fetch;configuration?:()=>{keragon:string;ghl:string};warn?:(value:{status_code:number;quiz_id:string})=>void};
export function createQuizService(deps:QuizServiceDependencies={}){
  const store=deps.store??createQuizSqlStore(),reports=deps.reports??quizPrivateReports,now=deps.now??Date.now,fetcher=deps.fetch??globalThis.fetch;
  const locks=new Map<string,Promise<unknown>>();
  function configuration(){return deps.configuration?.()??{keragon:process.env.KERAGON_QUIZ_WEBHOOK_URL??"",ghl:process.env.GHL_QUIZ_WEBHOOK_URL??""};}
  function warning(status_code:number,quiz_id:string){try{(deps.warn??console.warn)({status_code,quiz_id})}catch{}}
  function inputValues(input:QuizCompletionInput){
    const name=input.name.trim(),email=input.email.trim();
    if(!name||name.length>200||/[\u0000-\u001f\u007f]/.test(name)||email.length>320||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||/[\u0000-\u001f\u007f]/.test(email))throw new Error("Invalid quiz contact details.");
    const phone=normalizeQuizPhone(input.phone),answers=validateQuizAnswers(input.answers),parts=name.split(/\s+/);
    return {name,email,phone,answers,first_name:parts[0],last_name:parts.slice(1).join(" ")};
  }
  async function complete(input:QuizCompletionInput,origin:string,isTest=false){
    if(!/^[A-Za-z0-9_-]{32,128}$/.test(input.request_key))throw new Error("Invalid quiz completion key.");
    const values=inputValues(input),hash=quizDigest("completion",input.request_key),fingerprint=quizDigest("content",JSON.stringify(values));
    const existingLock=locks.get(hash);if(existingLock)await existingLock;
    const work=(async()=>{
      const existing=await store.find(hash);
      if(existing){const record=decryptQuizRecord<StoredQuizRecord>(existing.quizId,existing.encryptedRecord);if(record.fingerprint!==fingerprint)throw new Error("Quiz completion already recorded.");return {quiz_id:record.quiz_id,duplicate:true};}
      const quiz_id=randomUUID(),submitted_at=new Date(now()).toISOString(),score=computeQuizScore(values.answers),answerTexts=quizAnswerTexts(values.answers);
      const pdf=await (deps.pdf??generateQuizReportPdf)({name:values.name,submitted_at,balance_index:score.balance_index,score_band:score.score_band,answers:answerTexts});
      const report=await reports.prepare(pdf,origin);
      const record:StoredQuizRecord={quiz_id,submitted_at,first_name:values.first_name,last_name:values.last_name,name:values.name,email:values.email,phone:values.phone,balance_index:score.balance_index,score_band:score.score_band,answers:answerTexts,selections:values.answers,report_pdf_url:report.url,report_document_name:quizDocumentName(submitted_at),report_expires_at:report.expiresAt,fingerprint,is_test:isTest};
      const saved=await store.insert({quizId:quiz_id,requestKeyHash:hash,encryptedRecord:encryptQuizRecord(quiz_id,record),submittedAt:now(),isTest:isTest?1:0},isTest?1:2);
      const savedRecord=decryptQuizRecord<StoredQuizRecord>(saved.quizId,saved.encryptedRecord);
      if(savedRecord.fingerprint!==fingerprint)throw new Error("Quiz completion already recorded.");
      return {quiz_id:saved.quizId,duplicate:saved.quizId!==quiz_id};
    })();locks.set(hash,work);
    try{return await work}finally{if(locks.get(hash)===work)locks.delete(hash)}
  }
  async function flush(quizId?:string){
    const result={attempted:0,sent:0,failed:0};
    // Ordinary tests must never inherit real webhook secrets. Injected fixtures opt in explicitly.
    if(process.env.VITEST&&!deps.configuration)return result;
    for(let i=0;i<4;i++){
      const claim=await store.claim(randomBytes(24).toString("hex"),quizId);if(!claim)break;
      let status=0;
      try{
        const record=decryptQuizRecord<StoredQuizRecord>(claim.quizId,claim.encryptedRecord),url=configuration()[claim.provider];
        const parsed=new URL(url);if(parsed.protocol!=="https:"||parsed.username||parsed.password||parsed.hash)throw new Error();
        const payload=claim.provider==="keragon"?buildKeragonQuizPayload(record):buildGhlQuizPayload(record);
        const response=await fetcher(url,{method:"POST",headers:{"Content-Type":"application/json","Idempotency-Key":`${claim.quizId}:${claim.provider}`},body:JSON.stringify(payload),redirect:"error",signal:AbortSignal.timeout(8000)});
        status=response.status;try{void response.body?.cancel().catch(()=>{})}catch{}
      }catch{/* Never expose a URL, response body, contact, answers, score, or token. */}
      result.attempted++;const success=status>=200&&status<300;
      await store.finish(claim,status,success);
      if(success)result.sent++;else if(claim.attempts>=claim.maxAttempts){result.failed++;warning(status,claim.quizId)}
    }return result;
  }
  async function sendTest(requestKey:string,origin:string){
    const accepted=await complete({request_key:requestKey,name:"Test Quiz",email:"test+quiz@medmethoddirect.com",phone:"+15555550100",answers:createTestQuizAnswers()},origin,true);
    await flush(accepted.quiz_id);
    const rows=await store.statuses(accepted.quiz_id),row=await store.find(quizDigest("completion",requestKey));
    if(!row)throw new Error("Quiz test unavailable.");const record=decryptQuizRecord<StoredQuizRecord>(row.quizId,row.encryptedRecord);
    const status=(provider:QuizProvider)=>rows.find(r=>r.provider===provider)?.httpStatus??0;
    return {quiz_id:accepted.quiz_id,keragon_http_status:status("keragon"),ghl_http_status:status("ghl"),report_pdf_url:record.report_pdf_url,report_expires_at:new Date(record.report_expires_at).toISOString(),report_document_name:record.report_document_name,duplicate:accepted.duplicate};
  }
  return {complete,flush,sendTest,cleanup:()=>reports.cleanup()};
}
export const quizService=createQuizService();
