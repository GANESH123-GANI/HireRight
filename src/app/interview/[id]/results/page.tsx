"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Brain, CheckCircle, AlertTriangle, XCircle, Clock, ArrowLeft, MessageSquare, Lock, FileDown, Star, Loader } from "lucide-react";
import PayPalUnlockButton from "@/components/PayPalUnlockButton";
import { generateReportPdf } from "@/lib/generateReportPdf";

interface InterviewData {
  id: string;
  candidateName: string;
  format: string;
  status: string;
  startedAt: string | null;
  completedAt: string | null;
  durationSeconds: number;
  overallScore: number;
  aiSummary: string | null;
  aiRecommendation: string | null;
  resultsUnlocked?: boolean;
}

interface QuestionData {
  id: string;
  questionNumber: number;
  question: string;
  category: string;
  answer: string | null;
  timeSpentSeconds: number;
  score: number;
  aiFeedback: string | null;
}

interface InterviewSummary {
  summary?: string;
  strengths?: string[];
  weaknesses?: string[];
  interviewPrediction?: string;
}

export default function InterviewResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [interview, setInterview] = useState<InterviewData | null>(null);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedQ, setExpandedQ] = useState<number | null>(null);
  const [resultsUnlocked, setResultsUnlocked] = useState(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("unlocked") === "success";
  });

  const fetchInterview = async () => {
    try {
      const res = await fetch(`/api/interviews/${id}`, { credentials: "same-origin" });
      const data = await res.json();
      if (data.success) {
        setInterview(data.interview);
        setQuestions(data.questions);
        setResultsUnlocked((prev) => prev || (data.interview.resultsUnlocked ?? false));
      }
    } catch (err) {
      console.error("Failed to fetch interview:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchInterview);
    // Clean up URL if unlock was successful
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("unlocked") === "success") {
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, []);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-[#15803D] bg-emerald-50 border border-emerald-200";
    if (score >= 50) return "text-[#B45309] bg-amber-50 border border-amber-200";
    return "text-[#B91C1C] bg-red-50 border border-red-200";
  };

  const getRecommendationIcon = (rec: string) => {
    switch (rec?.toUpperCase()) {
      case "STRONG HIRE":
      case "HIRE":
        return <CheckCircle className="h-6 w-6 text-[#15803D]" />;
      case "MAYBE":
        return <AlertTriangle className="h-6 w-6 text-[#B45309]" />;
      default:
        return <XCircle className="h-6 w-6 text-[#B91C1C]" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "technical":
        return "bg-blue-50 text-[#2563EB] border border-blue-200";
      case "behavioral":
        return "bg-[#FCE8DD] text-[#D97757] border border-[#EFE3DB]";
      case "project_based":
        return "bg-emerald-50 text-[#15803D] border border-emerald-200";
      case "problem_solving":
        return "bg-amber-50 text-[#B45309] border border-amber-200";
      default:
        return "bg-[#FFF9F5] text-[#81736C] border border-[#EFE3DB]";
    }
  };

  const downloadReport = async () => {
    if (!resultsUnlocked) return;
    try {
      const res = await fetch(`/api/interview/${id}/report`, { credentials: "same-origin" });
      const data = await res.json();
      if (data.success && data.report) {
        generateReportPdf(data.report);
      }
    } catch (err) {
      console.error("Failed to download report:", err);
    }
  };

  let summary: InterviewSummary = {};
  try {
    summary = interview?.aiSummary ? JSON.parse(interview.aiSummary) as InterviewSummary : {};
  } catch {}

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-[#D97757] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#81736C]">Interview not found</p>
          <button onClick={() => router.back()} className="mt-4 text-[#D97757] font-semibold hover:underline">
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5]">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#81736C] hover:text-[#382A25] mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Interviews
        </button>

        {/* Score Card */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(56,42,37,0.06)] border border-[#EFE3DB] p-6 sm:p-8 mb-6">
          <div className="text-center mb-6">
            <div className={`h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
              getScoreColor(interview.overallScore)
            }`}>
              <span className="text-3xl font-bold">{interview.overallScore}</span>
            </div>
            <h1 className="text-2xl font-bold text-[#382A25]">{interview.candidateName}</h1>
            <p className="text-[#81736C] text-sm mt-0.5">Interview Evaluation Results</p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center border-t border-[#EFE3DB] pt-6">
            <div>
              <p className="text-xs text-[#81736C] font-medium uppercase tracking-wider mb-1">Duration</p>
              <p className="font-bold text-[#382A25]">{formatDuration(interview.durationSeconds)}</p>
            </div>
            <div>
              <p className="text-xs text-[#81736C] font-medium uppercase tracking-wider mb-1">Questions</p>
              <p className="font-bold text-[#382A25]">{questions.length}</p>
            </div>
            <div>
              <p className="text-xs text-[#81736C] font-medium uppercase tracking-wider mb-1">Format</p>
              <p className="font-bold text-[#382A25] capitalize">{interview.format}</p>
            </div>
          </div>
        </div>

        {/* Download button (when unlocked) */}
        {resultsUnlocked && (
          <button
            onClick={downloadReport}
            className="w-full mb-6 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#D97757] text-white font-semibold hover:bg-[#B95F42] shadow-sm transition-colors"
          >
            <FileDown className="w-5 h-5" />
            Download Evaluation Report (PDF)
          </button>
        )}

        {/* Recommendation */}
        {interview.aiRecommendation && (
          <div className="relative bg-white rounded-2xl shadow-[0_8px_30px_rgb(56,42,37,0.06)] border border-[#EFE3DB] p-6 sm:p-8 mb-6">
            {!resultsUnlocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/85 rounded-2xl backdrop-blur-[2px] z-10 p-4">
                <div className="bg-white rounded-2xl shadow-xl border border-[#EFE3DB] p-6 max-w-sm w-full text-center">
                  <div className="w-14 h-14 bg-[#FCE8DD] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#EFE3DB]">
                    <Lock className="w-6 h-6 text-[#D97757]" />
                  </div>
                  <h4 className="text-lg font-bold text-[#382A25] mb-2">Unlock Your Results</h4>
                  <p className="text-sm text-[#81736C] mb-2 leading-relaxed">View full recommendations, strengths, weaknesses, and detailed feedback.</p>
                  <p className="text-2xl font-bold text-[#D97757] mb-4">$5.99</p>
                  <PayPalUnlockButton
                    interviewId={id}
                    priceUsd={5.99}
                    onUnlockSuccess={() => {
                      setResultsUnlocked(true);
                      fetchInterview();
                    }}
                  />
                  <p className="text-xs text-[#81736C] mt-3">One-time payment. Instant full report access.</p>
                </div>
              </div>
            )}
            <div className={!resultsUnlocked ? "blur-sm pointer-events-none select-none opacity-60" : ""}>
              <div className="flex items-center gap-3 mb-4">
                {getRecommendationIcon(interview.aiRecommendation)}
                <h2 className="text-lg font-bold text-[#382A25]">
                  {interview.aiRecommendation}
                </h2>
              </div>
              {summary.summary && (
                <p className="text-[#81736C] text-sm leading-relaxed">{summary.summary}</p>
              )}
            </div>
          </div>
        )}

        {/* Strengths & Weaknesses */}
        <div className="relative space-y-6">
          {!resultsUnlocked && interview.aiRecommendation && (
            <div className="absolute inset-0 z-10" />
          )}
          <div className={!resultsUnlocked && interview.aiRecommendation ? "blur-sm pointer-events-none select-none opacity-60 space-y-6" : "space-y-6"}>
            {summary.strengths && summary.strengths.length > 0 && (
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(56,42,37,0.06)] border border-[#EFE3DB] p-6 sm:p-8">
                <h3 className="font-bold text-[#15803D] mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Key Strengths
                </h3>
                <ul className="space-y-2">
                  {summary.strengths.map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[#382A25]">
                      <CheckCircle className="h-4 w-4 text-[#15803D] mt-0.5 flex-shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {summary.weaknesses && summary.weaknesses.length > 0 && (
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(56,42,37,0.06)] border border-[#EFE3DB] p-6 sm:p-8">
                <h3 className="font-bold text-[#B91C1C] mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {summary.weaknesses.map((w: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[#382A25]">
                      <AlertTriangle className="h-4 w-4 text-[#B91C1C] mt-0.5 flex-shrink-0" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Interview Prediction */}
            {summary.interviewPrediction && (
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(56,42,37,0.06)] border border-[#EFE3DB] p-6 sm:p-8">
                <h3 className="font-bold text-[#382A25] mb-2">Interview Prediction</h3>
                <p className="text-sm text-[#81736C] leading-relaxed">{summary.interviewPrediction}</p>
              </div>
            )}

            {/* Q&A Details */}
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(56,42,37,0.06)] border border-[#EFE3DB] p-6 sm:p-8">
              <h3 className="font-bold text-[#382A25] mb-4">Question & Answer Breakdown</h3>
              <div className="space-y-3">
                {questions.map((q) => (
                  <div
                    key={q.id}
                    className="border border-[#EFE3DB] rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setExpandedQ(expandedQ === q.questionNumber ? null : q.questionNumber)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#FFF9F5] transition-colors"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <span className="text-sm font-semibold text-[#81736C]">Q{q.questionNumber}</span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getCategoryColor(q.category)}`}>
                          {q.category.replace("_", " ")}
                        </span>
                        <span className="text-sm text-[#382A25] font-medium truncate max-w-md">{q.question}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          q.score >= 7 ? "bg-emerald-50 text-[#15803D] border border-emerald-200" :
                          q.score >= 5 ? "bg-amber-50 text-[#B45309] border border-amber-200" :
                          "bg-red-50 text-[#B91C1C] border border-red-200"
                        }`}>
                          {q.score}/10
                        </span>
                      </div>
                    </button>
                    {expandedQ === q.questionNumber && (
                      <div className="px-4 pb-4 pt-2 border-t border-[#EFE3DB] bg-[#FFF9F5]/40 space-y-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-[#81736C] mb-1">Question</p>
                          <p className="text-sm text-[#382A25] font-medium">{q.question}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-[#81736C] mb-1">Answer</p>
                          <p className="text-sm text-[#382A25] bg-white border border-[#EFE3DB] p-3 rounded-xl leading-relaxed">
                            {q.answer || "No answer provided"}
                          </p>
                        </div>
                        {q.aiFeedback && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#81736C] mb-1">AI Feedback</p>
                            <p className="text-sm text-[#81736C] leading-relaxed">{q.aiFeedback}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
