import mysql, { type Pool, type RowDataPacket, type ResultSetHeader } from "mysql2/promise";
import { ENV } from "./_core/env";

export type QuizProvider="keragon"|"ghl";
export type QuizRecordRow={quizId:string;requestKeyHash:string;encryptedRecord:Buffer;submittedAt:number;isTest:number};
export type QuizClaim={quizId:string;provider:QuizProvider;attempts:number;maxAttempts:number;leaseOwner:string;encryptedRecord:Buffer};
export type QuizDeliveryStatus={provider:QuizProvider;status:string;attempts:number;httpStatus:number;nextAttemptAt:number};
export interface QuizStore{
  find(requestKeyHash:string):Promise<QuizRecordRow|null>;
  insert(row:QuizRecordRow,maxAttempts:number):Promise<QuizRecordRow>;
  claim(owner:string,quizId?:string):Promise<QuizClaim|null>;
  finish(claim:QuizClaim,status:number,success:boolean):Promise<void>;
  statuses(quizId:string):Promise<QuizDeliveryStatus[]>;
}
const NOW="CAST(UNIX_TIMESTAMP(CURRENT_TIMESTAMP(3))*1000 AS UNSIGNED)";
const ELIGIBLE=`((d.status='pending' AND d.nextAttemptAt<=${NOW}) OR (d.status='processing' AND d.leaseExpiresAt<=${NOW}))`;
export function createQuizSqlStore(injected?:Pool):QuizStore{
  let pool=injected;const db=()=>pool??=mysql.createPool(ENV.databaseUrl);
  async function execute<T extends RowDataPacket[]|ResultSetHeader>(query:string,values:(string|number|Buffer|null)[]=[]):Promise<T>{try{const [r]=await db().execute<T>(query,values);return r}catch{throw new Error("Quiz storage unavailable.")}}
  return {
    async find(requestKeyHash){const rows=await execute<RowDataPacket[]>("SELECT quizId,requestKeyHash,encryptedRecord,submittedAt,isTest FROM hormone_quiz_records WHERE requestKeyHash=? LIMIT 1",[requestKeyHash]);return rows.length?rows[0] as QuizRecordRow:null},
    async insert(row,maxAttempts){
      const connection=await db().getConnection().catch(()=>{throw new Error("Quiz storage unavailable.")});
      try{
        await connection.beginTransaction();
        await connection.execute("INSERT INTO hormone_quiz_records (quizId,requestKeyHash,encryptedRecord,submittedAt,isTest) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE requestKeyHash=requestKeyHash",[row.quizId,row.requestKeyHash,row.encryptedRecord,row.submittedAt,row.isTest]);
        const [rows]=await connection.execute<RowDataPacket[]>("SELECT quizId,requestKeyHash,encryptedRecord,submittedAt,isTest FROM hormone_quiz_records WHERE requestKeyHash=? LIMIT 1",[row.requestKeyHash]);
        const saved=rows[0] as QuizRecordRow;
        if(saved.quizId===row.quizId)for(const provider of ["keragon","ghl"]){await connection.execute(`INSERT INTO hormone_quiz_deliveries (quizId,provider,status,attempts,maxAttempts,nextAttemptAt) VALUES (?,?,'pending',0,?,${NOW})`,[saved.quizId,provider,maxAttempts])}
        await connection.commit();return saved;
      }catch{await connection.rollback().catch(()=>{});throw new Error("Quiz storage unavailable.")}finally{connection.release()}
    },
    async claim(owner,quizId){
      const scope=quizId?" AND d.quizId=?":"",values=quizId?[quizId]:[];
      const candidates=await execute<RowDataPacket[]>(`SELECT d.quizId,d.provider FROM hormone_quiz_deliveries d WHERE ${ELIGIBLE}${scope} ORDER BY d.nextAttemptAt LIMIT 10`,values);
      for(const row of candidates){
        const result=await execute<ResultSetHeader>(`UPDATE hormone_quiz_deliveries d SET status='processing',leaseOwner=?,leaseExpiresAt=${NOW}+45000 WHERE d.quizId=? AND d.provider=? AND ${ELIGIBLE}`,[owner,row.quizId,row.provider]);
        if(result.affectedRows!==1)continue;
        // Reserve before outbound HTTP. Crash recovery cannot reset or exceed the attempt cap.
        const reserved=await execute<ResultSetHeader>(`UPDATE hormone_quiz_deliveries SET attempts=attempts+1 WHERE quizId=? AND provider=? AND leaseOwner=? AND status='processing' AND leaseExpiresAt>${NOW} AND attempts<maxAttempts`,[row.quizId,row.provider,owner]);
        if(reserved.affectedRows!==1){await execute<ResultSetHeader>("UPDATE hormone_quiz_deliveries SET status='failed',leaseOwner=NULL,leaseExpiresAt=NULL WHERE quizId=? AND provider=? AND leaseOwner=?",[row.quizId,row.provider,owner]);continue}
        const rows=await execute<RowDataPacket[]>(`SELECT d.quizId,d.provider,d.attempts,d.maxAttempts,d.leaseOwner,r.encryptedRecord FROM hormone_quiz_deliveries d JOIN hormone_quiz_records r ON r.quizId=d.quizId WHERE d.quizId=? AND d.provider=? AND d.leaseOwner=? AND d.status='processing' AND d.leaseExpiresAt>${NOW}`,[row.quizId,row.provider,owner]);
        if(rows.length)return rows[0] as QuizClaim;
      }return null;
    },
    async finish(claim,status,success){
      const next=success?"sent":claim.attempts>=claim.maxAttempts?"failed":"pending";
      await execute<ResultSetHeader>(`UPDATE hormone_quiz_deliveries SET status=?,httpStatus=?,nextAttemptAt=${NOW}+30000,leaseOwner=NULL,leaseExpiresAt=NULL WHERE quizId=? AND provider=? AND leaseOwner=? AND status='processing' AND leaseExpiresAt>${NOW}`,[next,status,claim.quizId,claim.provider,claim.leaseOwner]);
    },
    async statuses(quizId){return await execute<RowDataPacket[]>("SELECT provider,status,attempts,httpStatus,nextAttemptAt FROM hormone_quiz_deliveries WHERE quizId=? ORDER BY provider",[quizId]) as QuizDeliveryStatus[]},
  };
}
