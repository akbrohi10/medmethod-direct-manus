/**
 * AdminLogin — /admin/login
 *
 * Standalone email + password login page for the super admin.
 * Does NOT use Manus OAuth — authenticates against the super_admin_credentials table.
 * On success, redirects to /admin/settings.
 */

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Check if already logged in as super admin
  const meQuery = trpc.superAdmin.me.useQuery();

  useEffect(() => {
    if (meQuery.data?.isSuperAdmin) {
      navigate("/admin/settings");
    }
  }, [meQuery.data, navigate]);

  const loginMutation = trpc.superAdmin.login.useMutation({
    onSuccess: () => {
      toast.success("Welcome back!");
      navigate("/admin/settings");
    },
    onError: (err) => {
      toast.error(err.message || "Invalid email or password");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    loginMutation.mutate({ email: email.trim(), password });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <div className="w-full max-w-md px-4">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div
            className="px-8 py-8 text-center"
            style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #2d1155 100%)" }}
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 mb-4">
              <ShieldCheck size={28} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-white mb-1">Admin Portal</h1>
            <p className="text-sm text-white/60">MedMethod Direct</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  autoComplete="email"
                  required
                  className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full border border-gray-300 rounded-lg pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loginMutation.isPending || !email || !password}
              className="w-full py-3 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #e8339e 100%)",
                boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
              }}
            >
              {loginMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Back link */}
            <p className="text-center text-xs text-gray-400">
              <a href="/" className="hover:text-gray-600 transition">
                ← Back to site
              </a>
            </p>
          </form>
        </div>

        <p className="text-center text-xs text-gray-300 mt-4">
          This portal is for authorized administrators only.
        </p>
      </div>
    </div>
  );
}
