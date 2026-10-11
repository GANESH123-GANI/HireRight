"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle, XCircle, Shield } from "lucide-react";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 12) {
      setError("Password must be at least 12 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Password reset failed");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="bg-white border border-[#EFE3DB] shadow-[0_8px_30px_rgb(56,42,37,0.06)] rounded-2xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
            <CheckCircle className="w-8 h-8 text-[#15803D]" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-[#382A25] mb-2">Password Reset!</h1>
        <p className="text-[#81736C] mb-6 text-sm">Your password has been updated. You can now sign in with your new password.</p>
        <button
          onClick={() => router.push("/login")}
          className="w-full bg-[#D97757] text-white py-3 rounded-xl font-semibold hover:bg-[#B95F42] transition-colors shadow-sm"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#EFE3DB] shadow-[0_8px_30px_rgb(56,42,37,0.06)] rounded-2xl p-8">
      <div className="text-center mb-8">
        {token ? (
          <>
            <h1 className="text-2xl font-bold text-[#382A25]">Set a New Password</h1>
            <p className="text-[#81736C] mt-2 text-sm">Choose a strong password for your account.</p>
          </>
        ) : (
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
              <XCircle className="w-8 h-8 text-[#B91C1C]" />
            </div>
          </div>
        )}
      </div>

      {!token && (
        <p className="text-[#81736C] text-center mb-6 text-sm">
          {error}
        </p>
      )}

      {token && (
        <>
          {error && (
            <div className="bg-red-50 border border-red-200 text-[#B91C1C] px-4 py-3 mb-4 text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#382A25] mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#81736C]" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2.5 bg-white border border-[#EFE3DB] text-[#382A25] placeholder:text-[#81736C]/60 text-sm rounded-xl focus:border-[#D97757] focus:ring-2 focus:ring-[#D97757]/20 outline-none transition-all"
                  placeholder="At least 12 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#81736C] hover:text-[#382A25]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#382A25] mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#81736C]" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full pl-10 pr-12 py-2.5 bg-white border border-[#EFE3DB] text-[#382A25] placeholder:text-[#81736C]/60 text-sm rounded-xl focus:border-[#D97757] focus:ring-2 focus:ring-[#D97757]/20 outline-none transition-all"
                  placeholder="Re-enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D97757] text-white py-3 rounded-xl font-semibold hover:bg-[#B95F42] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Resetting...
                </span>
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </>
      )}

      <div className="mt-6 text-center">
        <Link href="/login" className="text-[#D97757] font-semibold hover:text-[#B95F42]">
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,119,87,0.06)_0%,transparent_60%)]" />

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center mb-8 group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FCE8DD] flex items-center justify-center border border-[#EFE3DB]">
              <Shield className="w-5 h-5 text-[#D97757]" />
            </div>
            <span className="text-2xl font-bold text-[#382A25] tracking-tight">Techcitta</span>
          </div>
        </Link>

        <Suspense
          fallback={
            <div className="bg-white border border-[#EFE3DB] shadow-[0_8px_30px_rgb(56,42,37,0.06)] rounded-2xl p-8 flex justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-[#D97757] border-t-transparent rounded-full" />
            </div>
          }
        >
          <ResetPasswordContent />
        </Suspense>
      </div>
    </div>
  );
}
