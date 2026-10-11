"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, CheckCircle, Shield } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetUrl, setResetUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      setSent(true);
      if (data.resetUrl) {
        setResetUrl(data.resetUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

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

        <div className="bg-white border border-[#EFE3DB] shadow-[0_8px_30px_rgb(56,42,37,0.06)] rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#382A25]">Reset Password</h1>
            <p className="text-[#81736C] mt-2 text-sm">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          {sent ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                  <CheckCircle className="w-8 h-8 text-[#15803D]" />
                </div>
              </div>
              {resetUrl ? (
                <>
                  <p className="text-[#81736C] mb-4 text-sm">
                    Password reset link generated. Click below to reset your password.
                  </p>
                  <a
                    href={resetUrl}
                    className="inline-block w-full bg-[#D97757] text-white py-3 rounded-xl font-semibold text-center hover:bg-[#B95F42] transition-colors mb-3 shadow-sm"
                  >
                    Reset Password Now
                  </a>
                </>
              ) : (
                <p className="text-[#81736C] mb-6 text-sm">
                  If an account exists for <span className="font-semibold text-[#382A25]">{email}</span>,
                  we&apos;ve sent a password reset link to your inbox. It expires in 1 hour.
                </p>
              )}
              <Link
                href="/login"
                className="inline-block w-full bg-[#FFF9F5] border border-[#EFE3DB] text-[#382A25] py-3 rounded-xl font-medium text-center hover:bg-[#FCE8DD]/40 transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 text-[#B91C1C] px-4 py-3 mb-4 text-sm rounded-xl">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#382A25] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#81736C]" />
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EFE3DB] text-[#382A25] placeholder:text-[#81736C]/60 text-sm rounded-xl focus:border-[#D97757] focus:ring-2 focus:ring-[#D97757]/20 outline-none transition-all"
                      placeholder="you@example.com"
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
                      Sending...
                    </span>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-[#81736C]">
                  Remembered your password?{" "}
                  <Link href="/login" className="text-[#D97757] font-semibold hover:text-[#B95F42]">
                    Sign In
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
