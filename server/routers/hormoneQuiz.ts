import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router, superAdminOrAdminProcedure } from "../_core/trpc";
import { quizService } from "../hormoneQuizService";
import { quizReportOrigin } from "../hormoneQuizPrivateReport";

const completion=z.object({request_key:z.string().regex(/^[A-Za-z0-9_-]{32,128}$/),name:z.string().min(1).max(200),email:z.string().email().max(320),phone:z.string().min(10).max(64),answers:z.record(z.string(),z.union([z.number().int().nonnegative().max(100),z.array(z.number().int().nonnegative().max(100)).min(1).max(20)])).refine(v=>Object.keys(v).length<=32)}).strict();
export const hormoneQuizRouter=router({
  complete:publicProcedure.input(completion).mutation(async({input,ctx})=>{
    try{
      const origin=quizReportOrigin(ctx.req.headers.host??"",ctx.req.headers);
      const accepted=await quizService.complete(input,origin);
      // Caller has already shown the report. No webhook latency is awaited by the patient API.
      void quizService.flush(accepted.quiz_id).catch(()=>{});
      return {ok:true,quiz_id:accepted.quiz_id,duplicate:accepted.duplicate};
    }catch{throw new TRPCError({code:"BAD_REQUEST",message:"Quiz completion could not be recorded."});}
  }),
  configuration:superAdminOrAdminProcedure.query(()=>({keragon_configured:Boolean(process.env.KERAGON_QUIZ_WEBHOOK_URL),ghl_configured:Boolean(process.env.GHL_QUIZ_WEBHOOK_URL)})),
  sendTest:superAdminOrAdminProcedure.input(z.object({request_key:z.string().regex(/^[A-Za-z0-9_-]{32,128}$/)}).strict()).mutation(async({input,ctx})=>{
    try{return await quizService.sendTest(input.request_key,quizReportOrigin(ctx.req.headers.host??"",ctx.req.headers));}
    catch{throw new TRPCError({code:"INTERNAL_SERVER_ERROR",message:"The dummy quiz test could not complete. No private error details are shown."});}
  }),
});
