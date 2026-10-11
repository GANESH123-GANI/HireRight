"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Mic, Clock, Brain, ChevronRight, ArrowLeft } from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  email: string | null;
  currentRole: string | null;
  currentCompany: string | null;
  totalExperience: string | null;
  skills: string | null;
}

export default function InterviewSetupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [format, setFormat] = useState<"text" | "voice">("text");
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  const fetchCandidate = async () => {
    try {
      const res = await fetch(`/api/agency/candidates`, { credentials: "same-origin" });
      const data = await res.json();
      if (data.success) {
        const c = data.candidates?.find((c: Candidate) => c.id === id);
        setCandidate(c || null);
      }
    } catch (err) {
      console.error("Failed to fetch candidate:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchCandidate);
  }, []);

  const handleStart = async () => {
    setStarting(true);
    try {
      const res = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ candidateId: id, format }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/interview/${data.interviewId}`);
      } else {
        alert(data.error || data.detail || "Failed to start interview");
      }
    } catch (err) {
      alert("Failed to start interview");
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-[#D97757] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#81736C]">Candidate not found</p>
          <button onClick={() => router.back()} className="mt-4 text-[#D97757] font-semibold hover:underline">
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5]">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#81736C] hover:text-[#382A25] mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-[#FCE8DD] border border-[#EFE3DB] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Brain className="h-8 w-8 text-[#D97757]" />
          </div>
          <h1 className="text-2xl font-bold text-[#382A25]">AI Interview Setup</h1>
          <p className="text-[#81736C] mt-1 text-sm">15-minute personalized interview for {candidate.name}</p>
        </div>

        {/* Candidate Info Card */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(56,42,37,0.06)] border border-[#EFE3DB] p-6 sm:p-8 mb-6">
          <h2 className="font-bold text-[#382A25] mb-4">Candidate Profile</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[#81736C] text-xs font-medium uppercase tracking-wider block mb-0.5">Name</span>
              <p className="font-semibold text-[#382A25]">{candidate.name}</p>
            </div>
            {candidate.currentRole && (
              <div>
                <span className="text-[#81736C] text-xs font-medium uppercase tracking-wider block mb-0.5">Role</span>
                <p className="font-semibold text-[#382A25]">{candidate.currentRole}</p>
              </div>
            )}
            {candidate.currentCompany && (
              <div>
                <span className="text-[#81736C] text-xs font-medium uppercase tracking-wider block mb-0.5">Company</span>
                <p className="font-semibold text-[#382A25]">{candidate.currentCompany}</p>
              </div>
            )}
            {candidate.totalExperience && (
              <div>
                <span className="text-[#81736C] text-xs font-medium uppercase tracking-wider block mb-0.5">Experience</span>
                <p className="font-semibold text-[#382A25]">{candidate.totalExperience}</p>
              </div>
            )}
          </div>
          {candidate.skills && (
            <div className="mt-5 pt-4 border-t border-[#EFE3DB]">
              <span className="text-[#81736C] text-xs font-medium uppercase tracking-wider block mb-2">Skills</span>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.split(",").slice(0, 10).map((skill, i) => (
                  <span key={i} className="text-xs bg-[#FCE8DD] text-[#D97757] border border-[#EFE3DB] px-2.5 py-1 rounded-full font-medium">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Interview Format Selection */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(56,42,37,0.06)] border border-[#EFE3DB] p-6 sm:p-8 mb-6">
          <h2 className="font-bold text-[#382A25] mb-4">Interview Format</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setFormat("text")}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                format === "text"
                  ? "border-[#D97757] bg-[#FCE8DD]/30"
                  : "border-[#EFE3DB] bg-white hover:border-[#D97757]/40"
              }`}
            >
              <MessageSquare className={`h-6 w-6 mb-2 ${format === "text" ? "text-[#D97757]" : "text-[#81736C]"}`} />
              <p className="font-bold text-[#382A25]">Text Chat</p>
              <p className="text-xs text-[#81736C] mt-1 leading-relaxed">Type your answers. Works on all devices.</p>
            </button>
            <button
              onClick={() => setFormat("voice")}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                format === "voice"
                  ? "border-[#D97757] bg-[#FCE8DD]/30"
                  : "border-[#EFE3DB] bg-white hover:border-[#D97757]/40"
              }`}
            >
              <Mic className={`h-6 w-6 mb-2 ${format === "voice" ? "text-[#D97757]" : "text-[#81736C]"}`} />
              <p className="font-bold text-[#382A25]">Voice Call</p>
              <p className="text-xs text-[#81736C] mt-1 leading-relaxed">Speak your answers. More realistic.</p>
            </button>
          </div>
        </div>

        {/* Interview Details */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(56,42,37,0.06)] border border-[#EFE3DB] p-6 sm:p-8 mb-6">
          <h2 className="font-bold text-[#382A25] mb-4">What to Expect</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-[#D97757]" />
              <span className="text-sm text-[#382A25] font-medium">15 minutes total duration</span>
            </div>
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5 text-[#D97757]" />
              <span className="text-sm text-[#382A25] font-medium">10 personalized questions based on resume</span>
            </div>
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-[#D97757]" />
              <span className="text-sm text-[#382A25] font-medium">Mix of technical, behavioral, and problem-solving questions</span>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          disabled={starting}
          className="w-full flex items-center justify-center gap-2 bg-[#D97757] text-white py-3.5 px-6 rounded-xl hover:bg-[#B95F42] disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-sm transition-colors"
        >
          {starting ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating Questions...
            </>
          ) : (
            <>
              Start Interview
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
