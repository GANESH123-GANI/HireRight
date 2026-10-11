"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, CheckCircle, XCircle, RefreshCw, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const { user, token: authToken } = useAuth();
  const token = searchParams.get("token");
  const pendingEmail = searchParams.get("email");
  const initialVerifyUrl = searchParams.get("verifyUrl") || "";
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">(
    token ? "verifying" : "idle"
  );
  const [message, setMessage] = useState("");
  const [verifyUrl, setVerifyUrl] = useState(initialVerifyUrl);
  const [resending, setResending] = useState(false);
  const verifyAttempted = useRef(false);

  useEffect(() => {
    if (!token || status !== "verifying" || verifyAttempted.current) return;
    verifyAttempted.current = true;
    (async () => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await response.json();
        if (response.ok) {
          setStatus("success");
          setMessage("Your email has been verified. You can now sign in.");
        } else {
          setStatus("error");
          if (data.error === "invalid-token") {
            setMessage("This verification link has already been used or is invalid. Please request a new one.");
          } else if (data.error === "expired-token") {
            setMessage("This verification link has expired. Please request a new one.");
          } else {
            setMessage(data.error || "Verification failed. Please try again.");
          }
        }
      } catch {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    })();
  }, [token, status]);

  const handleResend = async () => {
    setResending(true);
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken || ""}`,
        },
        body: JSON.stringify({ email: user?.email || pendingEmail || "" }),
      });
      const data = await response.json();
      setMessage(data.message || (data.error || "Please try again later."));
      if (data.verifyUrl) {
        setVerifyUrl(data.verifyUrl);
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setResending(false);
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

        <div className="bg-white border border-[#EFE3DB] shadow-[0_8px_30px_rgb(56,42,37,0.06)] rounded-2xl p-8 text-center">
          <div className="mb-4 flex justify-center">
            {status === "success" ? (
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                <CheckCircle className="w-8 h-8 text-[#15803D]" />
              </div>
            ) : status === "error" ? (
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
                <XCircle className="w-8 h-8 text-[#B91C1C]" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#FCE8DD] flex items-center justify-center border border-[#EFE3DB]">
                <Mail className="w-8 h-8 text-[#D97757]" />
              </div>
            )}
          </div>

          <h1 className="text-2xl font-bold text-[#382A25] mb-2">
            {status === "success"
              ? "Email Verified!"
              : status === "error"
              ? "Verification Failed"
              : "Check Your Inbox"}
          </h1>

          <p className="text-[#81736C] mb-6 text-sm">
            {status === "verifying"
              ? "Verifying your email..."
              : status === "success"
              ? message
              : status === "error" && token
              ? message
              : "We sent a verification link to your email. Click it to verify your account. If you didn't receive it, you can resend below."}
          </p>

          {status !== "success" && (
            <>
              <button
                onClick={handleResend}
                disabled={resending}
                className="w-full bg-[#D97757] text-white py-3 rounded-xl font-semibold hover:bg-[#B95F42] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${resending ? "animate-spin" : ""}`} />
                {resending ? "Sending..." : "Resend Verification Email"}
              </button>

              {verifyUrl && (
                <div className="mt-4 p-3 bg-[#FFF9F5] border border-[#EFE3DB] rounded-xl text-left">
                  <p className="text-[#81736C] text-xs mb-1.5 font-medium">Direct verification link (email not configured):</p>
                  <a
                    href={verifyUrl}
                    className="text-[#D97757] text-xs break-all hover:underline font-mono"
                  >
                    {verifyUrl}
                  </a>
                </div>
              )}
            </>
          )}

          <div className="mt-6">
            {status === "success" ? (
              <Link href="/login" className="w-full bg-[#D97757] text-white py-3 rounded-xl font-semibold hover:bg-[#B95F42] transition-colors flex items-center justify-center shadow-sm">
                Go to Sign In
              </Link>
            ) : (
              <Link href="/login" className="text-[#D97757] font-semibold hover:text-[#B95F42] text-sm">
                Go to Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FFF9F5]">
          <div className="animate-spin h-8 w-8 border-4 border-[#D97757] border-t-transparent rounded-full" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
