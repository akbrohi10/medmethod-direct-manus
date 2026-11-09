import { createCipheriv, createDecipheriv, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { ENV } from "./_core/env";

const DOMAIN = "mmd-hormone-quiz-v1";
function secret() { const value=ENV.cookieSecret; if (!value || value.length<16) throw new Error("Quiz storage unavailable."); return value; }
export function quizDigest(kind:string,value:string){return createHmac("sha256",secret()).update(`${DOMAIN}:${kind}:`).update(value).digest("hex");}
function key(){return createHmac("sha256",secret()).update(`${DOMAIN}:aes-256-gcm`).digest();}
export function encryptQuizRecord(id:string,record:unknown){
  const iv=randomBytes(12),cipher=createCipheriv("aes-256-gcm",key(),iv);cipher.setAAD(Buffer.from(`${DOMAIN}:${id}`));
  const ciphertext=Buffer.concat([cipher.update(JSON.stringify(record),"utf8"),cipher.final()]);
  return Buffer.concat([Buffer.from([1]),iv,cipher.getAuthTag(),ciphertext]);
}
export function decryptQuizRecord<T>(id:string,bytes:Buffer):T{
  try{
    if(!Buffer.isBuffer(bytes)||bytes.length<29||bytes[0]!==1)throw new Error();
    const decipher=createDecipheriv("aes-256-gcm",key(),bytes.subarray(1,13));decipher.setAAD(Buffer.from(`${DOMAIN}:${id}`));decipher.setAuthTag(bytes.subarray(13,29));
    return JSON.parse(Buffer.concat([decipher.update(bytes.subarray(29)),decipher.final()]).toString("utf8")) as T;
  }catch{throw new Error("Quiz storage unavailable.");}
}
export function signQuizPdfToken(nonce:string,expiresAt:number){return createHmac("sha256",secret()).update(`${DOMAIN}:pdf:${nonce}:${expiresAt}`).digest("base64url");}
export function equalQuizToken(a:string,b:string){const aa=Buffer.from(a),bb=Buffer.from(b);return aa.length===bb.length&&timingSafeEqual(aa,bb);}
