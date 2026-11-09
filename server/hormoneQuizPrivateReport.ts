import { randomBytes } from "node:crypto";
import type { Express } from "express";
import { createIntakePrivateBlobDb, type IntakePrivateBlobDb } from "./intakePrivateBlobDb";
import { equalQuizToken, quizDigest, signQuizPdfToken } from "./hormoneQuizSecurity";

const TTL=24*60*60*1000;
const SAFE_ORIGINS=new Set(["https://medmethoddirect.com","https://www.medmethoddirect.com","https://medmethod-kywclyds.manus.space","https://3000-i96796e94ozetw9qpb6zg-37388edb.us1.manus.computer"]);
type QuizOriginHeaders={origin?:string|string[];"x-forwarded-host"?:string|string[];referer?:string|string[]};
function trustedQuizOrigin(value:unknown,hostOnly=false):string|null{
  if(typeof value!=="string"||!value||value.length>2048||/[\u0000-\u0020\u007f,\\]/.test(value))return null;
  try{
    const parsed=new URL(hostOnly?`https://${value}`:value);
    if(parsed.protocol!=="https:"||parsed.username||parsed.password||!SAFE_ORIGINS.has(parsed.origin))return null;
    if(hostOnly&&(parsed.pathname!=="/"||parsed.search||parsed.hash))return null;
    return parsed.origin;
  }catch{return null;}
}
export function quizReportOrigin(host:string,headers:QuizOriginHeaders={}){
  // Browser Origin survives reverse proxies whose upstream Host is internal.
  // Never trust an arbitrary forwarded host or manufacture a public PDF origin.
  if(headers.origin!==undefined){
    if(process.env.NODE_ENV!=="production"&&typeof headers.origin==="string"&&/^https?:\/\/(localhost|127\.0\.0\.1)(:\d{1,5})?$/.test(headers.origin)){
      try{if(new URL(headers.origin).host===host)return "https://3000-i96796e94ozetw9qpb6zg-37388edb.us1.manus.computer";}catch{/* Fall through to strict validation. */}
    }
    const origin=trustedQuizOrigin(headers.origin);
    if(!origin||typeof headers.origin!=="string"||new URL(headers.origin).origin!==headers.origin)throw new Error("Quiz origin unavailable.");
    return origin;
  }
  const direct=trustedQuizOrigin(host,true);if(direct)return direct;
  const forwarded=trustedQuizOrigin(headers["x-forwarded-host"],true);if(forwarded)return forwarded;
  const referrer=trustedQuizOrigin(headers.referer);if(referrer)return referrer;
  if(process.env.NODE_ENV!=="production"&&/^(localhost|127\.0\.0\.1)(:\d{1,5})?$/.test(host))return "https://3000-i96796e94ozetw9qpb6zg-37388edb.us1.manus.computer";
  throw new Error("Quiz origin unavailable.");
}
export function createQuizPrivateReports(deps:{blobs?:IntakePrivateBlobDb;now?:()=>number}={}){
  const now=deps.now??Date.now;let store: IntakePrivateBlobDb|undefined;
  const blobs=()=>store??=(deps.blobs??createIntakePrivateBlobDb());
  const key=(nonce:string)=>`mmd/quiz-report/v1/${quizDigest("pdf",nonce)}`;
  function parseToken(token:string){
    const parts=token.split(".");if(parts.length!==3||!/^[A-Za-z0-9_-]{43}$/.test(parts[0])||!/^\d{13}$/.test(parts[1])||!/^[A-Za-z0-9_-]{43}$/.test(parts[2]))return null;
    const expiry=Number(parts[1]);
    if(!Number.isSafeInteger(expiry)||!equalQuizToken(parts[2],signQuizPdfToken(parts[0],expiry)))return null;
    return {nonce:parts[0],expiresAt:expiry};
  }
  return {
    async prepare(bytes:Buffer,origin:string){
      if(!SAFE_ORIGINS.has(origin)&&!(process.env.NODE_ENV!=="production"&&/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)))throw new Error("Quiz origin unavailable.");
      if(bytes.length>2*1024*1024||bytes.subarray(0,5).toString()!=="%PDF-")throw new Error("Quiz PDF unavailable.");
      const nonce=randomBytes(32).toString("base64url"),expiresAt=now()+TTL,token=`${nonce}.${expiresAt}.${signQuizPdfToken(nonce,expiresAt)}`;
      await blobs().put(key(nonce),bytes,expiresAt);
      return {url:`${origin}/api/quiz/report/${token}`,expiresAt};
    },
    async download(token:string):Promise<Buffer|null>{
      const parsed=parseToken(token);if(!parsed)return null;
      if(parsed.expiresAt<=now()){await blobs().delete(key(parsed.nonce)).catch(()=>{});return null}
      const bytes=await blobs().get(key(parsed.nonce));return bytes&&bytes.subarray(0,5).toString()==="%PDF-"?bytes:null;
    },
    async cleanup(){return blobs().cleanup();},
    register(app:Express){
      app.get("/api/quiz/report/:token",(req,res)=>{
        res.set({"Cache-Control":"no-store, private, max-age=0",Pragma:"no-cache",Expires:"0","X-Content-Type-Options":"nosniff","X-Robots-Tag":"noindex, nofollow, noarchive","Referrer-Policy":"no-referrer","Content-Security-Policy":"default-src 'none'; sandbox"});
        void this.download(req.params.token).then(bytes=>{
          if(!bytes){res.status(404).json({error:"This report link is unavailable or expired."});return}
          res.set({"Content-Type":"application/pdf","Content-Disposition":"inline; filename=\"Hormone-Symptom-Quiz-Report.pdf\""});res.status(200).send(bytes);
        },()=>{res.status(503).json({error:"This report is temporarily unavailable."});});
      });
    },
  };
}
export const quizPrivateReports=createQuizPrivateReports();
