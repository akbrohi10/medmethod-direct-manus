import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "../server/routers";

const api=createTRPCProxyClient<AppRouter>({links:[httpBatchLink({url:"/api/trpc",transformer:superjson})]});
type QuizContact={name:string;email:string;phone:string;answers:Record<string,number|number[]>};
let submitted:Promise<unknown>|null=null;
let requestKey:string|null=null;
const quizWindow=window as Window&{mmdQuizComplete?:(data:QuizContact)=>void;mmdQuizReset?:()=>void};
quizWindow.mmdQuizComplete=(data)=>{
  if(submitted)return;
  requestKey??=Array.from(crypto.getRandomValues(new Uint8Array(24)),v=>v.toString(16).padStart(2,"0")).join("");
  const input={request_key:requestKey,name:data.name,email:data.email,phone:data.phone,answers:JSON.parse(JSON.stringify(data.answers)) as Record<string,number|number[]>};
  // Report rendering is synchronous and already complete before this bridge is invoked.
  // A lost API acknowledgement retries the same completion key; server dedup prevents new deliveries.
  submitted=api.hormoneQuiz.complete.mutate(input).catch(()=>api.hormoneQuiz.complete.mutate(input)).catch(()=>undefined);
};
quizWindow.mmdQuizReset=()=>{submitted=null;requestKey=null;};
