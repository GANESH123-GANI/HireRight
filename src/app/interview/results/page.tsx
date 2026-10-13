"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import CareerIntelligenceDashboard, {
  CareerIntelligenceData,
} from "@/components/interview/CareerIntelligenceDashboard";
import { mapInterviewToCareerIntelligence } from "@/lib/mapInterviewToReport";
import { Loader2 } from "lucide-react";

export default function InterviewResultsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<CareerIntelligenceData | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadInterviewReport() {
      try {
        // Fetch current user's interview
        const res = await fetch("/api/interview", { credentials: "include" });
        const data = await res.json();
        if (cancelled) return;

        if (data?.success && data?.interview) {
          const mapped = mapInterviewToCareerIntelligence(
            data.interview,
            data.user || user,
            data.profile
          );
          setReportData(mapped);
        } else {
          // No interview record found for user
          const fallback = mapInterviewToCareerIntelligence(null, user, null);
          setReportData(fallback);
        }
      } catch (err) {
        console.warn("Failed to load interview report:", err);
        if (!cancelled) {
          const fallback = mapInterviewToCareerIntelligence(null, user, null);
          setReportData(fallback);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (!authLoading) {
      void loadInterviewReport();
    }

    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-slate-800">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-4 shadow-sm animate-pulse">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <p className="text-base font-bold text-slate-900">
          Generating Career Intelligence Dashboard...
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Analyzing interview evaluation & role readiness metrics
        </p>
      </div>
    );
  }

  return (
    <CareerIntelligenceDashboard
      initialData={reportData || undefined}
      isCompleted={reportData?.isCompleted}
    />
  );
}
