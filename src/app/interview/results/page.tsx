"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart3,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  ChevronLeft,
  Loader2,
  FileCheck
} from "lucide-react";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export default function InterviewResultsRedirectPage() {
  const router = useRouter();
  const { user, token, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [noInterview, setNoInterview] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkInterview() {
      // 1. Check session storage cache
      if (typeof window !== "undefined") {
        const cachedId = sessionStorage.getItem("tcInterviewId");
        if (cachedId) {
          router.replace(`/interview/${cachedId}/results`);
          return;
        }
      }

      // 2. Fetch latest interview from API
      try {
        const res = await fetch("/api/interview", { credentials: "include" });
        const data = await res.json();
        if (cancelled) return;

        if (data?.success && data?.interview?.id) {
          if (typeof window !== "undefined") {
            sessionStorage.setItem("tcInterviewId", data.interview.id);
          }
          router.replace(`/interview/${data.interview.id}/results`);
          return;
        } else {
          setNoInterview(true);
        }
      } catch (err) {
        console.warn("Check interview error:", err);
        if (!cancelled) setNoInterview(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (!authLoading) {
      void checkInterview();
    }

    return () => {
      cancelled = true;
    };
  }, [authLoading, router]);

  if (loading || authLoading) {
    return (
      <div className={`min-h-screen bg-[#FFF9F5] flex flex-col items-center justify-center p-6 ${plusJakarta.className}`}>
        <div className="w-16 h-16 rounded-2xl bg-[#FCE8DD] border border-[#D97757]/30 flex items-center justify-center text-[#D97757] mb-4 shadow-sm animate-pulse">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <p className="text-base font-bold text-[#382A25]">Loading Your Interview Results...</p>
        <p className="text-xs text-[#81736C] mt-1">Retrieving AI scorecard & proctoring evaluation</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#FFF9F5] flex flex-col ${plusJakarta.className}`}>
      {/* Top Bar */}
      <header className="border-b border-[#EFE3DB] bg-white/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <Link href="/profile" className="flex items-center gap-2 text-sm font-semibold text-[#81736C] hover:text-[#D97757] transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-[#81736C]">
          <Shield className="w-4 h-4 text-[#D97757]" />
          <span>HireRight Secure Candidate Portal</span>
        </div>
      </header>

      {/* Main Empty / Action Card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-[#EFE3DB] p-8 sm:p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#FCE8DD] border border-[#D97757]/30 flex items-center justify-center text-[#D97757] mx-auto mb-5 shadow-xs">
            <BarChart3 className="w-8 h-8 stroke-[2.2]" />
          </div>

          <h1 className="text-2xl font-extrabold text-[#382A25] tracking-tight">
            No Interview Results Yet
          </h1>

          <p className="text-sm text-[#81736C] mt-2 mb-8 leading-relaxed">
            Hi {user?.name || "there"}! Once you complete your 15-minute AI video interview assessment, your comprehensive scorecard, MediaPipe anti-cheating audit report, and role recommendation will be available here.
          </p>

          <div className="space-y-3">
            <Link
              href="/interview"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D97757] to-[#B95F42] hover:from-[#B95F42] hover:to-[#A04E35] text-sm font-bold text-white shadow-md shadow-[#D97757]/25 transition-all"
            >
              <span>Schedule or Start Interview</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/profile"
              className="w-full block py-3 px-6 rounded-xl border border-[#EFE3DB] bg-[#FFF9F5] hover:bg-[#FCE8DD]/40 text-sm font-semibold text-[#382A25] transition-colors"
            >
              Return to Profile Builder
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
