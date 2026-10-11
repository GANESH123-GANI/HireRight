"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, Loader } from "lucide-react";

function AcceptInviteForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) setError("Invalid invitation link — no token found.");
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Invalid invitation link.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, name: name || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to accept invitation.");
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9F5] px-4">
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(56,42,37,0.06)] p-10 text-center max-w-md w-full border border-[#EFE3DB]">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
            <Check className="w-8 h-8 text-[#15803D]" />
          </div>
          <h1 className="text-2xl font-bold text-[#382A25] mb-2">Welcome to the team!</h1>
          <p className="text-[#81736C] mb-4 text-sm">
            Your account is ready. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF9F5] px-4">
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(56,42,37,0.06)] p-8 max-w-md w-full border border-[#EFE3DB]">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#382A25]">Accept Invitation</h1>
          <p className="text-[#81736C] mt-1 text-sm">Set your name and password to join the team</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-[#B91C1C] rounded-xl px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#382A25] mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-[#EFE3DB] rounded-xl px-3.5 py-2.5 bg-white text-[#382A25] placeholder-[#81736C]/60 focus:ring-2 focus:ring-[#D97757]/20 focus:border-[#D97757] outline-none transition-all text-sm"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#382A25] mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-[#EFE3DB] rounded-xl px-3.5 py-2.5 bg-white text-[#382A25] placeholder-[#81736C]/60 focus:ring-2 focus:ring-[#D97757]/20 focus:border-[#D97757] outline-none transition-all text-sm"
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#382A25] mb-1.5">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border border-[#EFE3DB] rounded-xl px-3.5 py-2.5 bg-white text-[#382A25] placeholder-[#81736C]/60 focus:ring-2 focus:ring-[#D97757]/20 focus:border-[#D97757] outline-none transition-all text-sm"
              placeholder="Repeat your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full bg-[#D97757] text-white py-3 rounded-xl font-semibold hover:bg-[#B95F42] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Setting up...
              </>
            ) : (
              "Accept & Join"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FFF9F5]">
          <Loader className="w-8 h-8 text-[#D97757] animate-spin" />
        </div>
      }
    >
      <AcceptInviteForm />
    </Suspense>
  );
}
