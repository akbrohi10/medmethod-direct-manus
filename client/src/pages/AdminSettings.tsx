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
import { Eye, EyeOff, CheckCircle, AlertCircle, CreditCard, Settings, RefreshCw, DollarSign, LogOut } from "lucide-react";
import { useLocation } from "wouter";

// ─── Types ───────────────────────────────────────────────────────────────────

type Mode = "test" | "live";
type PayPalMode = "sandbox" | "live";
type ActiveProvider = "stripe" | "paypal";

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
  const [, navigate] = useLocation();

  // Super admin session check
  const saMe = trpc.superAdmin.me.useQuery();
  const saLogout = trpc.superAdmin.logout.useMutation({
    onSuccess: () => {
      navigate("/admin/login");
    },
  });

  // Access is granted if: Manus OAuth admin OR super admin session
  const isSuperAdmin = saMe.data?.isSuperAdmin === true;
  const isOAuthAdmin = isAuthenticated && user?.role === "admin";
  const hasAccess = isSuperAdmin || isOAuthAdmin;
  const isCheckingAuth = loading || saMe.isLoading;

  // Display name for header
  const displayName = isSuperAdmin
    ? saMe.data?.email
    : (user?.name ?? user?.email);

  // Stripe settings query
  const settingsQuery = trpc.stripe.getSettings.useQuery(undefined, {
    enabled: hasAccess,
  });

  // PayPal settings query
  const paypalSettingsQuery = trpc.paypal.getSettings.useQuery(undefined, {
    enabled: hasAccess,
  });

  // Payments query
  const paymentsQuery = trpc.stripe.listPayments.useQuery(undefined, {
    enabled: hasAccess,
  });

  // Stripe: Schedule remaining charge mutation
  const scheduleChargeMutation = trpc.stripe.scheduleRemainingCharge.useMutation({
    onSuccess: () => {
      toast.success("\u2713 Remaining balance scheduled for the appointment date.");
      paymentsQuery.refetch();
    },
    onError: (err) => {
      toast.error(`Schedule failed: ${err.message}`);
    },
  });

  // Stripe: Charge now mutation
  const chargeNowMutation = trpc.stripe.chargeNow.useMutation({
    onSuccess: (data) => {
      toast.success(`\u2713 $${data.amount.toFixed(2)} charged successfully! Payment marked as fully paid.`);
      paymentsQuery.refetch();
    },
    onError: (err) => {
      toast.error(`Charge failed: ${err.message}`);
    },
  });

  // PayPal: Schedule remaining charge mutation
  const ppScheduleChargeMutation = trpc.paypal.scheduleRemainingCharge.useMutation({
    onSuccess: () => {
      toast.success("\u2713 Remaining balance scheduled for the appointment date via PayPal.");
      paymentsQuery.refetch();
    },
    onError: (err) => {
      toast.error(`PayPal schedule failed: ${err.message}`);
    },
  });

  // Trigger sweep mutation
  const triggerSweepMutation = trpc.stripe.triggerSweep.useMutation({
    onSuccess: (data) => {
      if (data.swept === 0) {
        toast.success("Sweep complete — no due payments found.");
      } else {
        toast.success(`✓ Sweep complete — ${data.swept} payment(s) processed.`);
      }
      paymentsQuery.refetch();
    },
    onError: (err) => {
      toast.error(`Sweep failed: ${err.message}`);
    },
  });

  // Retry Failed PayPal payments mutation
  const retryFailedMutation = trpc.paypal.retryFailed.useMutation({
    onSuccess: (data) => {
      if (data.attempted === 0) {
        toast.success("No failed payments with a saved card found.");
      } else {
        toast.success(`✓ Retry complete — ${data.charged}/${data.attempted} payment(s) charged.`);
      }
      paymentsQuery.refetch();
    },
    onError: (err) => {
      toast.error(`Retry failed: ${err.message}`);
    },
  });

  // PayPal: Charge now mutation
  const ppChargeNowMutation = trpc.paypal.chargeNow.useMutation({
    onSuccess: (data) => {
      toast.success(`\u2713 $${data.amount.toFixed(2)} charged via PayPal! Payment marked as fully paid.`);
      paymentsQuery.refetch();
    },
    onError: (err) => {
      toast.error(`PayPal charge failed: ${err.message}`);
    },
  });

  const [schedulingPaymentId, setSchedulingPaymentId] = useState<number | null>(null);
  const [apptDateInputs, setApptDateInputs] = useState<Record<number, string>>({});
  const [chargeNowConfirmId, setChargeNowConfirmId] = useState<number | null>(null);

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

  // PayPal update mutation
  const updatePaypalMutation = trpc.paypal.updateSettings.useMutation({
    onSuccess: () => {
      toast.success("PayPal settings saved successfully!");
      paypalSettingsQuery.refetch();
    },
    onError: (err) => {
      toast.error(`Failed to save PayPal settings: ${err.message}`);
    },
  });

  // Local form state
  const [mode, setMode] = useState<Mode>("test");
  const [testPubKey, setTestPubKey] = useState("");
  const [testSecKey, setTestSecKey] = useState("");
  const [livePubKey, setLivePubKey] = useState("");
  const [liveSecKey, setLiveSecKey] = useState("");
  const [activeTab, setActiveTab] = useState<"settings" | "paypal" | "payments">("settings");

  // PayPal local form state
  const [ppMode, setPpMode] = useState<PayPalMode>("sandbox");
  const [ppActiveProvider, setPpActiveProvider] = useState<ActiveProvider>("stripe");
  const [ppSandboxClientId, setPpSandboxClientId] = useState("");
  const [ppSandboxClientSecret, setPpSandboxClientSecret] = useState("");
  const [ppLiveClientId, setPpLiveClientId] = useState("");
  const [ppLiveClientSecret, setPpLiveClientSecret] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "deposit_paid" | "fully_paid" | "failed">("all");

  // Populate Stripe form from fetched settings
  useEffect(() => {
    if (settingsQuery.data) {
      setMode(settingsQuery.data.mode);
      setTestPubKey(settingsQuery.data.testPublishableKey ?? "");
      setTestSecKey(settingsQuery.data.testSecretKey ?? "");
      setLivePubKey(settingsQuery.data.livePublishableKey ?? "");
      setLiveSecKey(settingsQuery.data.liveSecretKey ?? "");
    }
  }, [settingsQuery.data]);

  // Populate PayPal form from fetched settings
  useEffect(() => {
    if (paypalSettingsQuery.data) {
      setPpMode(paypalSettingsQuery.data.mode as PayPalMode);
      setPpActiveProvider((paypalSettingsQuery.data.activeProvider ?? "stripe") as ActiveProvider);
      setPpSandboxClientId(paypalSettingsQuery.data.sandboxClientIdMasked ?? "");
      setPpSandboxClientSecret(paypalSettingsQuery.data.sandboxClientSecretMasked ?? "");
      setPpLiveClientId(paypalSettingsQuery.data.liveClientIdMasked ?? "");
      setPpLiveClientSecret(paypalSettingsQuery.data.liveClientSecretMasked ?? "");
    }
  }, [paypalSettingsQuery.data]);

  const handlePaypalSave = () => {
    updatePaypalMutation.mutate({
      mode: ppMode,
      activeProvider: ppActiveProvider,
      sandboxClientId: ppSandboxClientId.includes("...") ? undefined : ppSandboxClientId || undefined,
      sandboxClientSecret: ppSandboxClientSecret.includes("...") ? undefined : ppSandboxClientSecret || undefined,
      liveClientId: ppLiveClientId.includes("...") ? undefined : ppLiveClientId || undefined,
      liveClientSecret: ppLiveClientSecret.includes("...") ? undefined : ppLiveClientSecret || undefined,
    });
  };

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

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-sm">
          <AlertCircle className="mx-auto mb-4 text-red-400" size={48} />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-500 text-sm mb-4">
            You must be an admin to access this page.
          </p>
          <a
            href="/admin/login"
            className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition"
          >
            Admin Login
          </a>
          <br />
          <a href="/" className="mt-3 inline-block text-pink-600 hover:underline text-sm">
            ← Back to home
          </a>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  const RECORDS_PER_PAGE = 30;

  const payments = paymentsQuery.data ?? [];
  const statusCounts = {
    all: payments.length,
    pending: payments.filter(p => p.status === "pending").length,
    deposit_paid: payments.filter(p => p.status === "deposit_paid").length,
    fully_paid: payments.filter(p => p.status === "fully_paid").length,
    failed: payments.filter(p => p.status === "failed").length,
  };
  const filteredPayments = statusFilter === "all" ? payments : payments.filter(p => p.status === statusFilter);
  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / RECORDS_PER_PAGE));
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * RECORDS_PER_PAGE,
    currentPage * RECORDS_PER_PAGE
  );

  const totalRevenue = payments.reduce((sum, p) => {
    if (p.status === "deposit_paid") return sum + p.depositAmount;
    if (p.status === "fully_paid") return sum + p.depositAmount + p.remainingAmount;
    return sum;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "Montserrat, sans-serif" }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
            <span className="text-xs text-gray-500">
              Logged in as <strong>{displayName}</strong>
              {isSuperAdmin && (
                <span className="ml-1 px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-bold">
                  Super Admin
                </span>
              )}
            </span>
            {isSuperAdmin ? (
              <button
                onClick={() => saLogout.mutate()}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition"
              >
                <LogOut size={12} />
                Logout
              </button>
            ) : (
              <a href="/" className="text-xs text-pink-600 hover:underline">
                ← Back to site
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <CreditCard size={18} className="text-blue-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 font-medium">Total Payments</span>
                <span className="text-xs font-semibold mt-0.5 text-gray-400">All providers</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
                <DollarSign size={18} className="text-green-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 font-medium">Revenue Collected</span>
                <span className="text-xs font-semibold mt-0.5 text-gray-400">Deposits + full payments</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${(totalRevenue / 100).toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                ppActiveProvider === "paypal" ? "bg-blue-50" : settingsQuery.data?.mode === "live" ? "bg-green-50" : "bg-amber-50"
              }`}>
                <CheckCircle size={18} className={ppActiveProvider === "paypal" ? "text-blue-500" : settingsQuery.data?.mode === "live" ? "text-green-500" : "text-amber-500"} />
              </div>
              <span className="text-sm text-gray-500 font-medium">Active Provider</span>
            </div>
            <p className={`text-2xl font-bold capitalize ${
              ppActiveProvider === "paypal" ? "text-blue-700" : settingsQuery.data?.mode === "live" ? "text-green-700" : "text-amber-700"
            }`}>
              {ppActiveProvider === "paypal"
                ? `🅿 PayPal (${ppMode})`
                : settingsQuery.data?.mode === "live" ? "🟢 Stripe Live" : settingsQuery.data?.mode === "test" ? "🧪 Stripe Test" : "—"}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit flex-wrap">
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
            onClick={() => setActiveTab("paypal")}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
              activeTab === "paypal"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            PayPal Settings
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

        {/* PayPal Settings Tab */}
        {activeTab === "paypal" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-gray-900">PayPal Configuration</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Manage your PayPal API credentials, payment mode, and active payment provider.
                </p>
              </div>
              {paypalSettingsQuery.isLoading && (
                <RefreshCw size={16} className="animate-spin text-gray-400" />
              )}
            </div>

            {/* Active Provider Toggle */}
            <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <label className="text-sm font-semibold text-gray-700 block mb-3">
                Active Payment Provider
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Choose which payment processor is shown to customers on the checkout page.
              </p>
              <div className="flex gap-3">
                {(["stripe", "paypal"] as ActiveProvider[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPpActiveProvider(p)}
                    className={`flex-1 max-w-[180px] py-3 px-5 rounded-xl border-2 text-sm font-bold transition ${
                      ppActiveProvider === p
                        ? p === "paypal"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-gray-200 bg-white text-gray-400 hover:border-gray-300"
                    }`}
                  >
                    {p === "stripe" ? "💳 Stripe" : "🅿 PayPal"}
                  </button>
                ))}
              </div>
              {ppActiveProvider === "paypal" && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-700 font-medium">
                    PayPal is active. Customers will see the PayPal button at checkout.
                    Make sure your PayPal credentials are saved below.
                  </p>
                </div>
              )}
            </div>

            {/* PayPal Mode Toggle */}
            <div className="mb-8">
              <label className="text-sm font-semibold text-gray-700 block mb-3">
                PayPal Environment
              </label>
              <div className="flex gap-3">
                {(["sandbox", "live"] as PayPalMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setPpMode(m)}
                    className={`flex-1 max-w-[180px] py-3 px-5 rounded-xl border-2 text-sm font-bold transition ${
                      ppMode === m
                        ? m === "live"
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-400 hover:border-gray-300"
                    }`}
                  >
                    {m === "sandbox" ? "🧪 Sandbox" : "🚀 Live"}
                  </button>
                ))}
              </div>
              {ppMode === "live" && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-700 font-medium">
                    ⚠ Live mode is active. Real charges will be made via PayPal.
                    Make sure your live credentials are correct before saving.
                  </p>
                </div>
              )}
            </div>

            {/* Sandbox Keys */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Sandbox Credentials
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SecretInput
                  label="Sandbox Client ID"
                  value={ppSandboxClientId}
                  onChange={setPpSandboxClientId}
                  placeholder="AYour_Sandbox_Client_ID..."
                  hint="From PayPal Developer Dashboard → Sandbox app"
                />
                <SecretInput
                  label="Sandbox Client Secret"
                  value={ppSandboxClientSecret}
                  onChange={setPpSandboxClientSecret}
                  placeholder="EYour_Sandbox_Secret..."
                  hint="Never share this — keep it server-side only"
                />
              </div>
            </div>

            {/* Live Keys */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Live Credentials
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SecretInput
                  label="Live Client ID"
                  value={ppLiveClientId}
                  onChange={setPpLiveClientId}
                  placeholder="AYour_Live_Client_ID..."
                  hint="From PayPal Developer Dashboard → Live app"
                />
                <SecretInput
                  label="Live Client Secret"
                  value={ppLiveClientSecret}
                  onChange={setPpLiveClientSecret}
                  placeholder="EYour_Live_Secret..."
                  hint="Never share this — keep it server-side only"
                />
              </div>
            </div>

            {/* Webhook URL */}
            <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-sm font-bold text-gray-700 mb-2">PayPal Webhook URL</h3>
              <p className="text-xs text-gray-500 mb-3">
                Add this URL in your PayPal Developer Dashboard → your app → Webhooks.
                Select event: <strong>PAYMENT.CAPTURE.COMPLETED</strong>
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 font-mono text-gray-800 break-all">
                  https://medmethoddirect.com/api/webhooks/paypal-payment
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("https://medmethoddirect.com/api/webhooks/paypal-payment");
                    toast.success("Copied to clipboard!");
                  }}
                  className="px-3 py-2 text-xs bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-gray-700 transition whitespace-nowrap"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
              <button
                onClick={handlePaypalSave}
                disabled={updatePaypalMutation.isPending}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-bold rounded-lg transition flex items-center gap-2"
              >
                {updatePaypalMutation.isPending ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle size={14} />
                    Save PayPal Settings
                  </>
                )}
              </button>
              <p className="text-xs text-gray-400">
                Credentials are encrypted at rest.
              </p>
            </div>
          </div>
        )}

        {/* Stripe Settings Tab */}
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
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-gray-900">Payment Records</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => retryFailedMutation.mutate()}
                    disabled={retryFailedMutation.isPending}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition"
                    title="Retry all Failed payments that have a saved card"
                  >
                    {retryFailedMutation.isPending ? (
                      <><RefreshCw size={12} className="animate-spin" /> Retrying...</>
                    ) : (
                      <><RefreshCw size={12} /> Retry Failed</>  
                    )}
                  </button>
                  <button
                    onClick={() => triggerSweepMutation.mutate()}
                    disabled={triggerSweepMutation.isPending}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition"
                    title="Manually run the sweep cron to charge all due payments now"
                  >
                    {triggerSweepMutation.isPending ? (
                      <><RefreshCw size={12} className="animate-spin" /> Running...</>
                    ) : (
                      <><RefreshCw size={12} /> Trigger Sweep Now</>
                    )}
                  </button>
                  <button
                    onClick={() => paymentsQuery.refetch()}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <RefreshCw size={16} className={paymentsQuery.isFetching ? "animate-spin" : ""} />
                  </button>
                </div>
              </div>
              {/* Status filter pills */}
              <div className="flex flex-wrap gap-2">
                {([
                  { key: "all" as const, label: "All" },
                  { key: "pending" as const, label: "Pending" },
                  { key: "deposit_paid" as const, label: "Deposit Paid" },
                  { key: "fully_paid" as const, label: "Fully Paid" },
                  { key: "failed" as const, label: "Failed" },
                ]).map(({ key, label }) => {
                  const active = statusFilter === key;
                  const activeCls =
                    key === "all" ? "bg-gray-800 text-white border-gray-800" :
                    key === "pending" ? "bg-gray-500 text-white border-gray-500" :
                    key === "deposit_paid" ? "bg-blue-600 text-white border-blue-600" :
                    key === "fully_paid" ? "bg-green-600 text-white border-green-600" :
                    "bg-red-600 text-white border-red-600";
                  return (
                    <button
                      key={key}
                      onClick={() => { setStatusFilter(key); setCurrentPage(1); }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                        active ? activeCls : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
                      }`}
                    >
                      {label}
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        active ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"
                      }`}>
                        {statusCounts[key]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {filteredPayments.length === 0 ? (
              <div className="py-16 text-center">
                <CreditCard size={40} className="mx-auto mb-3 text-gray-200" />
                <p className="text-gray-400 text-sm">No payments yet.</p>
                <p className="text-gray-300 text-xs mt-1">
                  Payments will appear here after a patient completes the deposit step.
                </p>
              </div>
            ) : (
              <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Deposit</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Remaining</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Referral</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Appt. Date</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Card Saved</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 font-medium text-gray-900">{p.patientName ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-500">{p.patientEmail ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-700">${(p.depositAmount / 100).toFixed(2)}</td>
                        <td className="px-4 py-3 text-gray-700">${(p.remainingAmount / 100).toFixed(2)}</td>
                        <td className="px-4 py-3 text-gray-500">
                          {p.referralCode ? (
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold text-purple-700">{p.referralCode}</span>
                              <span className="text-[10px] text-green-700">−${(p.referralCreditAmount / 100).toFixed(2)} credit</span>
                            </div>
                          ) : "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {p.appointmentDate
                            ? new Date(p.appointmentDate).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <PaymentStatusBadge status={p.status} />
                        </td>
                        <td className="px-4 py-3">
                          {p.paymentProvider === "paypal" ? (
                            p.paypalVaultToken ? (
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700"
                                title={`Card is vaulted — $${(p.remainingAmount / 100).toFixed(2)} can be auto-charged`}
                              >
                                ✓ Card saved
                              </span>
                            ) : (
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700"
                                title={`No vault token — $${(p.remainingAmount / 100).toFixed(2)} cannot be auto-charged. Patient must re-pay or use manual collection.`}
                              >
                                ⚠ No card
                              </span>
                            )
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">
                          {new Date(p.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          {/* ── Fully paid ── */}
                          {p.status === "fully_paid" && (
                            <span className="text-xs text-green-600 font-medium">✓ Paid in full</span>
                          )}

                          {/* ── Scheduled (cron set) ── */}
                          {p.status !== "fully_paid" && p.scheduledChargePaymentCronTaskUid && !p.scheduledChargePaymentCronTaskUid.startsWith("cancelled") && (
                            <div className="flex flex-col gap-2">
                              <span className="text-xs text-blue-600 font-medium">✓ Scheduled</span>
                              {/* Charge Now — for missed cron windows */}
                              <div className="border-t border-gray-100 pt-1">
                                {chargeNowConfirmId === p.id ? (
                                  <div className="flex flex-col gap-1">
                                    <p className="text-[10px] text-orange-700 font-semibold">Charge ${(p.remainingAmount / 100).toFixed(2)} now?</p>
                                    <p className="text-[10px] text-gray-500">Immediately charges the card on file and cancels the scheduled cron.</p>
                                    <div className="flex gap-1">
                                      <button
                                        onClick={() => {
                                          chargeNowMutation.mutate({ paymentId: p.id });
                                          setChargeNowConfirmId(null);
                                        }}
                                        disabled={chargeNowMutation.isPending}
                                        className="text-xs px-2 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
                                      >
                                        {chargeNowMutation.isPending ? "Charging..." : "Yes, Charge Now"}
                                      </button>
                                      <button
                                        onClick={() => setChargeNowConfirmId(null)}
                                        className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setChargeNowConfirmId(p.id)}
                                    className="text-xs px-2 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded hover:bg-orange-100 transition whitespace-nowrap"
                                  >
                                    Charge ${(p.remainingAmount / 100).toFixed(2)} Now
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          {/* ── deposit_paid, not yet scheduled ── */}
                          {p.status === "deposit_paid" && (!p.scheduledChargePaymentCronTaskUid || p.scheduledChargePaymentCronTaskUid.startsWith("cancelled")) && (() => {
                            const isPayPal = p.paymentProvider === "paypal";
                            const schedMut = isPayPal ? ppScheduleChargeMutation : scheduleChargeMutation;
                            const chargeMut = isPayPal ? ppChargeNowMutation : chargeNowMutation;
                            return (
                            <div className="flex flex-col gap-2">
                              {/* Provider badge */}
                              {isPayPal && (
                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">PayPal</span>
                              )}

                              {/* Schedule remaining-balance section */}
                              {schedulingPaymentId === p.id ? (
                                <div className="flex flex-col gap-1">
                                  <label className="text-[10px] text-gray-500 font-medium">Appointment date</label>
                                  <input
                                    type="date"
                                    value={apptDateInputs[p.id] ?? ""}
                                    onChange={(e) => setApptDateInputs(prev => ({ ...prev, [p.id]: e.target.value }))}
                                    className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-pink-400"
                                  />
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => {
                                        const dateStr = apptDateInputs[p.id];
                                        if (!dateStr) { toast.error("Please select an appointment date"); return; }
                                        const ts = new Date(dateStr + "T09:00:00Z").getTime();
                                        schedMut.mutate({ paymentId: p.id, appointmentDate: ts });
                                        setSchedulingPaymentId(null);
                                      }}
                                      disabled={schedMut.isPending}
                                      className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                    >
                                      {schedMut.isPending ? "Scheduling..." : "Confirm Schedule"}
                                    </button>
                                    <button
                                      onClick={() => setSchedulingPaymentId(null)}
                                      className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setSchedulingPaymentId(p.id)}
                                  className="text-xs px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 transition whitespace-nowrap"
                                >
                                  Schedule ${(p.remainingAmount / 100).toFixed(2)}
                                </button>
                              )}

                              {/* Divider */}
                              <div className="border-t border-gray-100 pt-1">
                                {/* Charge Now section */}
                                {chargeNowConfirmId === p.id ? (
                                  <div className="flex flex-col gap-1">
                                    <p className="text-[10px] text-orange-700 font-semibold">Charge ${(p.remainingAmount / 100).toFixed(2)} now?</p>
                                    <p className="text-[10px] text-gray-500">
                                      {isPayPal
                                        ? "Immediately charges via PayPal. No future cron charge."
                                        : "Immediately charges the card on file. No future cron charge."}
                                    </p>
                                    <div className="flex gap-1">
                                      <button
                                        onClick={() => {
                                          chargeMut.mutate({ paymentId: p.id });
                                          setChargeNowConfirmId(null);
                                        }}
                                        disabled={chargeMut.isPending}
                                        className="text-xs px-2 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
                                      >
                                        {chargeMut.isPending ? "Charging..." : "Yes, Charge Now"}
                                      </button>
                                      <button
                                        onClick={() => setChargeNowConfirmId(null)}
                                        className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setChargeNowConfirmId(p.id)}
                                    className="text-xs px-2 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded hover:bg-orange-100 transition whitespace-nowrap"
                                  >
                                    Charge ${(p.remainingAmount / 100).toFixed(2)} Now
                                  </button>
                                )}
                              </div>
                            </div>
                            );
                          })()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination footer */}
              {totalPages > 1 && (
                <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    Showing {(currentPage - 1) * RECORDS_PER_PAGE + 1}–{Math.min(currentPage * RECORDS_PER_PAGE, filteredPayments.length)} of {filteredPayments.length} payments
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-2 py-1 text-xs rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      ← Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-2.5 py-1 text-xs rounded border transition ${
                          page === currentPage
                            ? "bg-pink-600 text-white border-pink-600"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-2 py-1 text-xs rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
