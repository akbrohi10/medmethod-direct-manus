/**
 * Admin Settings Page — /admin/settings
 *
 * Allows the admin to:
 * - Toggle between test and live Stripe modes
 * - Enter/update test publishable + secret keys
 * - Enter/update live publishable + secret keys
 * - View all payment records
 *
 * Protected: only accessible to users with role = 'admin'
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, CheckCircle, AlertCircle, CreditCard, Settings, RefreshCw, DollarSign } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Mode = "test" | "live";

// ─── Sub-components ──────────────────────────────────────────────────────────

function SecretInput({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  const [show, setShow] = useState(false);
  const isRedacted = value.includes("...");

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-12 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {hint && (
        <p className="text-xs text-gray-400">{hint}</p>
      )}
      {isRedacted && (
        <p className="text-xs text-amber-600">
          ⚠ This key is saved. Enter a new value to replace it, or leave as-is to keep the current key.
        </p>
      )}
    </div>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    deposit_paid: { label: "Deposit Paid", color: "bg-blue-100 text-blue-700" },
    fully_paid: { label: "Fully Paid", color: "bg-green-100 text-green-700" },
    failed: { label: "Failed", color: "bg-red-100 text-red-700" },
  };
  const info = map[status] ?? { label: status, color: "bg-gray-100 text-gray-700" };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${info.color}`}>
      {info.label}
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AdminSettings() {
  const { user, loading, isAuthenticated } = useAuth();

  // Stripe settings query
  const settingsQuery = trpc.stripe.getSettings.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  // Payments query
  const paymentsQuery = trpc.stripe.listPayments.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  // Update settings mutation
  const updateMutation = trpc.stripe.updateSettings.useMutation({
    onSuccess: () => {
      toast.success("Stripe settings saved successfully!");
      settingsQuery.refetch();
    },
    onError: (err) => {
      toast.error(`Failed to save: ${err.message}`);
    },
  });

  // Local form state
  const [mode, setMode] = useState<Mode>("test");
  const [testPubKey, setTestPubKey] = useState("");
  const [testSecKey, setTestSecKey] = useState("");
  const [livePubKey, setLivePubKey] = useState("");
  const [liveSecKey, setLiveSecKey] = useState("");
  const [activeTab, setActiveTab] = useState<"settings" | "payments">("settings");

  // Populate form from fetched settings
  useEffect(() => {
    if (settingsQuery.data) {
      setMode(settingsQuery.data.mode);
      setTestPubKey(settingsQuery.data.testPublishableKey ?? "");
      setTestSecKey(settingsQuery.data.testSecretKey ?? "");
      setLivePubKey(settingsQuery.data.livePublishableKey ?? "");
      setLiveSecKey(settingsQuery.data.liveSecretKey ?? "");
    }
  }, [settingsQuery.data]);

  const handleSave = () => {
    updateMutation.mutate({
      mode,
      testPublishableKey: testPubKey || undefined,
      testSecretKey: testSecKey || undefined,
      livePublishableKey: livePubKey || undefined,
      liveSecretKey: liveSecKey || undefined,
    });
  };

  // ── Auth guard ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-sm">
          <AlertCircle className="mx-auto mb-4 text-red-400" size={48} />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-500 text-sm">
            You must be an admin to access this page.
          </p>
          <a href="/" className="mt-4 inline-block text-pink-600 hover:underline text-sm">
            ← Back to home
          </a>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  const payments = paymentsQuery.data ?? [];
  const totalRevenue = payments.reduce((sum, p) => {
    if (p.status === "deposit_paid") return sum + p.depositAmount;
    if (p.status === "fully_paid") return sum + p.depositAmount + p.remainingAmount;
    return sum;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "Montserrat, sans-serif" }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
              <Settings size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">MedMethod Direct</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Logged in as <strong>{user?.name ?? user?.email}</strong></span>
            <a
              href="/"
              className="text-xs text-pink-600 hover:underline"
            >
              ← Back to site
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <CreditCard size={18} className="text-blue-500" />
              </div>
              <span className="text-sm text-gray-500 font-medium">Total Payments</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
                <DollarSign size={18} className="text-green-500" />
              </div>
              <span className="text-sm text-gray-500 font-medium">Revenue Collected</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${(totalRevenue / 100).toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-pink-50 rounded-lg flex items-center justify-center">
                <CheckCircle size={18} className="text-pink-500" />
              </div>
              <span className="text-sm text-gray-500 font-medium">Active Mode</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 capitalize">
              {settingsQuery.data?.mode ?? "—"}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
              activeTab === "settings"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Stripe Settings
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
              activeTab === "payments"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Payments ({payments.length})
          </button>
        </div>

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-gray-900">Stripe Configuration</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Manage your Stripe API keys and payment mode.
                </p>
              </div>
              {settingsQuery.isLoading && (
                <RefreshCw size={16} className="animate-spin text-gray-400" />
              )}
            </div>

            {/* Mode Toggle */}
            <div className="mb-8">
              <label className="text-sm font-semibold text-gray-700 block mb-3">
                Active Payment Mode
              </label>
              <div className="flex gap-3">
                {(["test", "live"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 max-w-[180px] py-3 px-5 rounded-xl border-2 text-sm font-bold transition ${
                      mode === m
                        ? m === "live"
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-400 hover:border-gray-300"
                    }`}
                  >
                    {m === "test" ? "🧪 Test Mode" : "🚀 Live Mode"}
                  </button>
                ))}
              </div>
              {mode === "live" && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-700 font-medium">
                    ⚠ Live mode is active. Real charges will be made to customers' cards.
                    Make sure your live keys are correct before saving.
                  </p>
                </div>
              )}
            </div>

            {/* Test Keys */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Test Keys
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SecretInput
                  label="Test Publishable Key"
                  value={testPubKey}
                  onChange={setTestPubKey}
                  placeholder="pk_test_..."
                  hint="Starts with pk_test_"
                />
                <SecretInput
                  label="Test Secret Key"
                  value={testSecKey}
                  onChange={setTestSecKey}
                  placeholder="sk_test_..."
                  hint="Starts with sk_test_ — never share this"
                />
              </div>
            </div>

            {/* Live Keys */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Live Keys
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SecretInput
                  label="Live Publishable Key"
                  value={livePubKey}
                  onChange={setLivePubKey}
                  placeholder="pk_live_..."
                  hint="Starts with pk_live_"
                />
                <SecretInput
                  label="Live Secret Key"
                  value={liveSecKey}
                  onChange={setLiveSecKey}
                  placeholder="sk_live_..."
                  hint="Starts with sk_live_ — never share this"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
              <button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-300 text-white text-sm font-bold rounded-lg transition flex items-center gap-2"
              >
                {updateMutation.isPending ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle size={14} />
                    Save Settings
                  </>
                )}
              </button>
              <p className="text-xs text-gray-400">
                Secret keys are encrypted at rest. Publishable keys are safe to expose to the frontend.
              </p>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Payment Records</h2>
              <button
                onClick={() => paymentsQuery.refetch()}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <RefreshCw size={16} className={paymentsQuery.isFetching ? "animate-spin" : ""} />
              </button>
            </div>

            {payments.length === 0 ? (
              <div className="py-16 text-center">
                <CreditCard size={40} className="mx-auto mb-3 text-gray-200" />
                <p className="text-gray-400 text-sm">No payments yet.</p>
                <p className="text-gray-300 text-xs mt-1">
                  Payments will appear here after a patient completes the deposit step.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Deposit</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Remaining</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Appt. Date</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 font-medium text-gray-900">{p.patientName ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-500">{p.patientEmail ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-700">${(p.depositAmount / 100).toFixed(2)}</td>
                        <td className="px-4 py-3 text-gray-700">${(p.remainingAmount / 100).toFixed(2)}</td>
                        <td className="px-4 py-3 text-gray-500">
                          {p.appointmentDate
                            ? new Date(p.appointmentDate).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <PaymentStatusBadge status={p.status} />
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">
                          {new Date(p.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
