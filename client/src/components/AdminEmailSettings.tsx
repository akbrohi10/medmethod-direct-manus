import { trpc } from "@/lib/trpc";
import { CheckCircle, ChevronDown, Mail, RefreshCw, Send, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type TemplateKey = "deposit_paid" | "balance_paid";

type EditableTemplate = {
  templateKey: TemplateKey;
  displayName: string;
  subject: string;
  htmlBody: string;
  textBody: string;
};

export default function AdminEmailSettings() {
  const settingsQuery = trpc.emailSettings.getSettings.useQuery();
  const templatesQuery = trpc.emailSettings.listTemplates.useQuery();
  const deliveryLogsQuery = trpc.emailSettings.listDeliveryLogs.useQuery();
  const variablesQuery = trpc.emailSettings.templateVariables.useQuery();

  const [enabled, setEnabled] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [senderName, setSenderName] = useState("MedMethod Direct");
  const [senderEmail, setSenderEmail] = useState("");
  const [replyToEmail, setReplyToEmail] = useState("");
  const [testRecipient, setTestRecipient] = useState("");
  const [testTemplateKey, setTestTemplateKey] = useState<TemplateKey>("deposit_paid");
  const [templates, setTemplates] = useState<Record<string, EditableTemplate>>({});

  useEffect(() => {
    if (!settingsQuery.data) return;
    setEnabled(settingsQuery.data.enabled);
    setSenderName(settingsQuery.data.senderName);
    setSenderEmail(settingsQuery.data.senderEmail);
    setReplyToEmail(settingsQuery.data.replyToEmail);
  }, [settingsQuery.data]);

  useEffect(() => {
    if (!templatesQuery.data) return;
    setTemplates(
      Object.fromEntries(
        templatesQuery.data.map((template) => [
          template.templateKey,
          {
            templateKey: template.templateKey as TemplateKey,
            displayName: template.displayName,
            subject: template.subject,
            htmlBody: template.htmlBody,
            textBody: template.textBody,
          },
        ])
      )
    );
  }, [templatesQuery.data]);

  const updateSettings = trpc.emailSettings.updateSettings.useMutation({
    onSuccess: () => {
      toast.success("Email settings saved.");
      setApiKey("");
      settingsQuery.refetch();
    },
    onError: (error) => toast.error(`Email settings were not saved: ${error.message}`),
  });

  const updateTemplate = trpc.emailSettings.updateTemplate.useMutation({
    onSuccess: () => {
      toast.success("Email template updated.");
      templatesQuery.refetch();
    },
    onError: (error) => toast.error(`Template update failed: ${error.message}`),
  });

  const sendTest = trpc.emailSettings.sendTest.useMutation({
    onSuccess: () => toast.success("Test email sent through Resend."),
    onError: (error) => toast.error(`Test email failed: ${error.message}`),
  });

  const configured = settingsQuery.data?.apiKeyConfigured && !!senderEmail;
  const templateList = useMemo(
    () => (["deposit_paid", "balance_paid"] as TemplateKey[]).map((key) => templates[key]).filter(Boolean),
    [templates]
  );

  const saveSettings = () => {
    updateSettings.mutate({
      enabled,
      apiKey: apiKey.trim() || undefined,
      senderName,
      senderEmail,
      replyToEmail,
    });
  };

  const removeApiKey = () => {
    if (!window.confirm("Remove the saved Resend API key and disable customer emails?")) return;
    setEnabled(false);
    updateSettings.mutate({
      enabled: false,
      removeApiKey: true,
      senderName,
      senderEmail,
      replyToEmail,
    });
  };

  const saveTemplate = (template: EditableTemplate) => {
    updateTemplate.mutate({
      templateKey: template.templateKey,
      subject: template.subject,
      htmlBody: template.htmlBody,
      textBody: template.textBody,
    });
  };

  const updateTemplateField = (
    templateKey: TemplateKey,
    field: "subject" | "htmlBody" | "textBody",
    value: string
  ) => {
    setTemplates((current) => ({
      ...current,
      [templateKey]: { ...current[templateKey], [field]: value },
    }));
  };

  if (settingsQuery.isLoading || templatesQuery.isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-10 flex items-center justify-center">
        <RefreshCw size={22} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">
              <Mail size={19} className="text-cyan-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Email Notifications</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Powered by Resend. Customer emails are sent only after successful payment events.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
              {enabled ? "Active" : "Disabled"}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              onClick={() => setEnabled((value) => !value)}
              className={`relative w-12 h-7 rounded-full transition ${enabled ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`} />
              <span className="sr-only">Enable customer payment emails</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <label htmlFor="resend-api-key" className="text-sm font-semibold text-gray-700">Resend API Key</label>
              {settingsQuery.data?.apiKeyConfigured && (
                <span className="text-xs font-semibold text-green-700 flex items-center gap-1"><CheckCircle size={13} /> Configured</span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="resend-api-key"
                type="password"
                autoComplete="new-password"
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                placeholder={settingsQuery.data?.apiKeyConfigured ? settingsQuery.data.apiKeyMasked ?? "Saved key" : "re_..."}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
              {settingsQuery.data?.apiKeyConfigured && (
                <button
                  type="button"
                  onClick={removeApiKey}
                  disabled={updateSettings.isPending}
                  className="px-3 py-2.5 border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={15} /> Remove key
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1.5">Encrypted before database storage. The saved key is never returned to the browser.</p>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-gray-700">Sender Name</span>
            <input value={senderName} onChange={(event) => setSenderName(event.target.value)} className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-gray-700">Verified Sender Email</span>
            <input type="email" value={senderEmail} onChange={(event) => setSenderEmail(event.target.value)} placeholder="notifications@medmethoddirect.com" className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            <span className="text-xs text-gray-400">This address must belong to a domain verified in Resend.</span>
          </label>
          <label className="flex flex-col gap-1.5 lg:col-span-2">
            <span className="text-sm font-semibold text-gray-700">Reply-To Email (optional)</span>
            <input type="email" value={replyToEmail} onChange={(event) => setReplyToEmail(event.target.value)} placeholder="support@medmethoddirect.com" className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
          </label>
        </div>

        {enabled && !configured && (
          <p className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs font-medium text-amber-700">
            Add a Resend API key and verified sender email before saving the enabled state.
          </p>
        )}

        <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={saveSettings}
            disabled={updateSettings.isPending}
            className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-300 text-white text-sm font-bold rounded-lg transition flex items-center gap-2"
          >
            {updateSettings.isPending ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />}
            Save Email Settings
          </button>
          <span className="text-xs text-gray-400">Payment success is never reversed if an email provider request fails.</span>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
        <h2 className="text-base font-bold text-gray-900">Send Test Email</h2>
        <p className="text-sm text-gray-500 mt-1 mb-4">Verify the saved key, sender domain, and selected template before enabling customer emails.</p>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_260px_auto] gap-3">
          <input type="email" value={testRecipient} onChange={(event) => setTestRecipient(event.target.value)} placeholder="recipient@example.com" className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
          <select value={testTemplateKey} onChange={(event) => setTestTemplateKey(event.target.value as TemplateKey)} className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400">
            <option value="deposit_paid">Initial $50 payment</option>
            <option value="balance_paid">Appointment balance payment</option>
          </select>
          <button type="button" onClick={() => sendTest.mutate({ recipientEmail: testRecipient, templateKey: testTemplateKey })} disabled={sendTest.isPending || !testRecipient} className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm font-bold rounded-lg transition flex items-center justify-center gap-2">
            {sendTest.isPending ? <RefreshCw size={14} className="animate-spin" /> : <Send size={15} />} Send Test
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">Customer Email Templates</h2>
          <p className="text-sm text-gray-500 mt-1">Edit each subject, HTML message, and plain-text fallback. Template variables are inserted when the payment succeeds.</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {(variablesQuery.data?.variables ?? []).map((variable) => (
              <code key={variable} className="px-2 py-1 rounded bg-pink-50 text-pink-700 text-[11px] font-semibold">{variable}</code>
            ))}
          </div>
        </div>

        {templateList.map((template) => (
          <details key={template.templateKey} className="group bg-white rounded-xl border border-gray-200 overflow-hidden" open>
            <summary className="px-5 py-4 cursor-pointer flex items-center justify-between gap-3 list-none">
              <div>
                <p className="text-sm font-bold text-gray-900">{template.displayName}</p>
                <p className="text-xs text-gray-500 mt-0.5">{template.templateKey === "deposit_paid" ? "Sent after the successful $50 deposit." : "Sent after the appointment-date $149 or referral-adjusted $99 charge."}</p>
              </div>
              <ChevronDown size={18} className="text-gray-400 transition group-open:rotate-180" />
            </summary>
            <div className="border-t border-gray-100 px-5 py-5 space-y-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-gray-700">Subject</span>
                <input value={template.subject} onChange={(event) => updateTemplateField(template.templateKey, "subject", event.target.value)} className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-gray-700">HTML Message</span>
                <textarea value={template.htmlBody} onChange={(event) => updateTemplateField(template.templateKey, "htmlBody", event.target.value)} rows={7} className="border border-gray-300 rounded-lg px-4 py-3 text-sm font-mono leading-6 focus:outline-none focus:ring-2 focus:ring-pink-400" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-gray-700">Plain-Text Message</span>
                <textarea value={template.textBody} onChange={(event) => updateTemplateField(template.templateKey, "textBody", event.target.value)} rows={6} className="border border-gray-300 rounded-lg px-4 py-3 text-sm font-mono leading-6 focus:outline-none focus:ring-2 focus:ring-pink-400" />
              </label>
              <button type="button" onClick={() => saveTemplate(template)} disabled={updateTemplate.isPending} className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-300 text-white text-sm font-bold rounded-lg transition flex items-center gap-2">
                {updateTemplate.isPending ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />} Update Template
              </button>
            </div>
          </details>
        ))}
      </section>

      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">Recent Email Deliveries</h2>
            <p className="text-xs text-gray-500 mt-0.5">Permanent payment-event logs prevent duplicate customer emails.</p>
          </div>
          <button type="button" onClick={() => deliveryLogsQuery.refetch()} className="text-gray-400 hover:text-gray-700"><RefreshCw size={16} className={deliveryLogsQuery.isFetching ? "animate-spin" : ""} /></button>
        </div>
        {(deliveryLogsQuery.data?.length ?? 0) === 0 ? (
          <p className="px-5 py-10 text-sm text-center text-gray-400">No customer payment emails have been recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 text-left"><th className="px-4 py-3 text-xs font-semibold text-gray-500">Recipient</th><th className="px-4 py-3 text-xs font-semibold text-gray-500">Event</th><th className="px-4 py-3 text-xs font-semibold text-gray-500">Amount</th><th className="px-4 py-3 text-xs font-semibold text-gray-500">Status</th><th className="px-4 py-3 text-xs font-semibold text-gray-500">Created</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {(deliveryLogsQuery.data ?? []).slice(0, 12).map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-3 text-gray-700">{log.recipientEmail}</td>
                    <td className="px-4 py-3 text-gray-600">{log.templateKey === "deposit_paid" ? "Initial payment" : "Balance payment"}</td>
                    <td className="px-4 py-3 text-gray-600">${(log.chargedAmount / 100).toFixed(2)}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-[11px] font-bold ${log.status === "sent" ? "bg-green-100 text-green-700" : log.status === "failed" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>{log.status}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
