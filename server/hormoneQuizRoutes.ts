import type { Express } from "express";
import { quizPrivateReports } from "./hormoneQuizPrivateReport";
import { quizService } from "./hormoneQuizService";

export function registerHormoneQuizRoutes(app:Express){
  quizPrivateReports.register(app);
  // No in-process scheduler or automatic external schedule activation. This callback may be
  // activated as a project Heartbeat only after publishing, with the user's selected retry timing.
  app.post("/api/scheduled/hormone-quiz-webhooks",async(req,res)=>{
    try{
      const {sdk}=await import("./_core/sdk");const user=await sdk.authenticateRequest(req);
      if(!user.isCron||!user.taskUid)return res.status(403).json({error:"cron-only"});
    }catch{return res.status(403).json({error:"cron-only"});}
    try{
      const delivery=await quizService.flush();await quizService.cleanup();
      return res.json({ok:true,...delivery});
    }catch{return res.status(503).json({error:"Quiz delivery worker unavailable."});}
  });
}
