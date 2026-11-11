import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "../server/routers";

// Used ONLY by the standalone isolation prototype. The ordinary quiz bundle is unchanged.
const api = createTRPCProxyClient<AppRouter>({ links: [httpBatchLink({ url: "/api/trpc", transformer: superjson })] });
type Contact = { name: string; email: string; phone: string; answers: Record<string, number | number[]> };
type QuizWindow = Window & { mmdQuizComplete?: (data: Contact) => void; mmdQuizReset?: () => void; mmdIsolationProgress?: (step: string) => void };
const quizWindow = window as QuizWindow;
let submitted: Promise<unknown> | null = null;
let requestKey: string | null = null;
let generation = 0;
quizWindow.mmdQuizComplete = data => {
  if (submitted) return;
  requestKey ??= Array.from(crypto.getRandomValues(new Uint8Array(24)), v => v.toString(16).padStart(2, "0")).join("");
  const input = { request_key: requestKey, name: data.name, email: data.email, phone: data.phone, answers: JSON.parse(JSON.stringify(data.answers)) as Record<string, number | number[]> };
  const completionGeneration = generation;
  const send = () => api.hormoneQuiz.complete.mutate(input);
  // As before, the report renders synchronously; API errors never block it.
  submitted = send().catch(send).then(result => {
    if (completionGeneration === generation && result.ok === true) quizWindow.mmdIsolationProgress?.("submitted");
  }).catch(() => undefined);
};
quizWindow.mmdQuizReset = () => { generation++; submitted = null; requestKey = null; };
