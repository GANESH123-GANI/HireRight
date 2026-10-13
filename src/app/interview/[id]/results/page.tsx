"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import CareerIntelligenceDashboard, {
  CareerIntelligenceData,
} from "@/components/interview/CareerIntelligenceDashboard";
import { mapInterviewToCareerIntelligence } from "@/lib/mapInterviewToReport";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function InterviewIdResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<CareerIntelligenceData | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadInterview() {
      try {
        const res = await fetch(`/api/interviews/${id}`, {
          credentials: "same-origin",
        });
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
          // If specific interview id not found, fallback to candidate report template
          const fallback = mapInterviewToCareerIntelligence(null, user, null);
          setReportData(fallback);
        }
      } catch (err) {
        console.error("Failed to load interview results:", err);
        if (!cancelled) {
          const fallback = mapInterviewToCareerIntelligence(null, user, null);
          setReportData(fallback);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadInterview();

    return () => {
      cancelled = true;
    };
  }, [id, user]);

  if (loading) {
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
