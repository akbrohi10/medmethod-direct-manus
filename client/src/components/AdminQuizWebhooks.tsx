import { useRef } from "react";
import { trpc } from "@/lib/trpc";

export default function AdminQuizWebhooks(){
  const config=trpc.hormoneQuiz.configuration.useQuery();
  const key=useRef<string|null>(null);
  const test=trpc.hormoneQuiz.sendTest.useMutation();
  const send=()=>{
    key.current??=Array.from(crypto.getRandomValues(new Uint8Array(24)),v=>v.toString(16).padStart(2,"0")).join("");
    test.mutate({request_key:key.current});
  };
  return <section className="bg-white rounded-xl border border-gray-200 p-6 max-w-3xl">
    <h2 className="text-base font-bold text-gray-900">Hormone Symptom Quiz Webhooks</h2>
    <p className="text-sm text-gray-600 mt-2">Keragon receives the full quiz and a private PDF. GoHighLevel receives contact information only. Webhook URLs are server-only secrets and are never displayed here.</p>
    <p className="text-sm text-gray-700 mt-4">Keragon: {config.data?.keragon_configured?"Configured":"Not configured"} · GoHighLevel: {config.data?.ghl_configured?"Configured":"Not configured"}</p>
    <p className="text-sm text-gray-600 mt-3">This sends one dummy quiz to each destination for field mapping: Test Quiz, test+quiz@medmethoddirect.com, +15555550100. It does not submit the live quiz or use patient data.</p>
    <button type="button" onClick={send} disabled={!config.data?.keragon_configured||!config.data?.ghl_configured||test.isPending||Boolean(test.data)} className="mt-5 px-5 py-3 rounded-lg bg-purple-700 text-white font-bold hover:bg-purple-800 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700">
      {test.isPending?"Sending dummy quiz…":test.data?"Test quiz sent":"Send test quiz webhooks"}
    </button>
    {test.error&&<p className="mt-3 text-sm text-red-700" role="alert">The test could not complete. Try again with the same test key; duplicate sends are prevented.</p>}
    {test.data&&<div className="mt-5 p-4 rounded-lg bg-gray-50 text-sm text-gray-800" aria-live="polite">
      <p>Keragon HTTP status: <strong>{test.data.keragon_http_status}</strong></p>
      <p>GoHighLevel HTTP status: <strong>{test.data.ghl_http_status}</strong></p>
      <p className="mt-2">Quiz ID: <code className="break-all">{test.data.quiz_id}</code></p>
      <p className="mt-2"><a className="text-purple-800 underline font-bold" href={test.data.report_pdf_url} target="_blank" rel="noopener noreferrer">Open private test PDF</a></p>
      <p className="mt-1">Expires: {new Date(test.data.report_expires_at).toLocaleString()}</p>
      <p className="mt-2">This action uses one attempt per destination only, so field-mapping captures are not duplicated.</p>
    </div>}
  </section>;
}
