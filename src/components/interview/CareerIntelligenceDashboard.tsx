"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  HelpCircle,
  Target,
  Lock,
  Calendar,
  Briefcase,
  IdCard,
  Star,
  Printer,
  Share2,
  Sparkles,
  Bot,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Code,
  Layers,
  Database,
  Cloud,
  CheckCircle,
  Flame,
  ArrowUpRight,
  Info,
  Terminal,
  Server,
  Cpu,
  FileCheck2,
  BookOpen,
} from "lucide-react";

export interface QuestionScoreItem {
  number?: number;
  topic?: string;
  question: string;
  answer?: string;
  technicalAccuracy?: number;
  clarity?: number;
  realTimeUnderstanding?: number;
  architectureDepth?: number;
  total?: number;
  score?: number;
  feedback?: string;
}

export interface CareerIntelligenceData {
  isCompleted: boolean;
  candidateName: string;
  candidateTitle?: string;
  careerTrack?: string;
  candidateId?: string;
  avatarUrl?: string;
  interviewDate?: string;
  interviewDurationMinutes?: number;
  totalQuestions?: number;
  resumeVisibility?: string;
  primarySkills?: string[];
  careerScore?: number; // 0 - 1000
  industryStatus?: string;
  scoreBandInterpretation?: string;
  healthDistribution?: {
    technical: number;
    practical: number;
    cloud: number;
    systemDesign: number;
    communication: number;
  };
  specializedSummary?: {
    backend: { rating: number; label: string };
    api: { rating: number; label: string };
    auth: { rating: number; label: string };
    problemSolving: { rating: number; label: string };
    cloud: { rating: number; label: string };
    systemDesign: { rating: number; label: string };
    communication: { rating: number; label: string };
  };
  questions?: QuestionScoreItem[];
  radarSkills?: {
    backend: number;
    frontend: number;
    database: number;
    cloud: number;
    devops: number;
    systemDesign: number;
    communication: number;
  };
  growthPotential?: Array<{ role: string; score: number }>;
  marketPriorities?: Array<{ id: number; title: string; description: string; color: string }>;
  topStrengths?: string[];
  topGrowthAreas?: string[];
  coachNotes?: string;
  industryAlignment?: number;
  recommendedRoles?: string[];
  nextStep?: string;
}

// Benchmark mock data when previewing completed report or fallback
export const BENCHMARK_REPORT_DATA: CareerIntelligenceData = {
  isCompleted: true,
  candidateName: "Deepak Kumbhar",
  candidateTitle: "Software Engineer | 5+ Years Experience",
  careerTrack: "Full Stack / Backend Engineering",
  candidateId: "HRT-AI-IND-10482",
  avatarUrl: "/hero-candidate.jpg",
  interviewDate: "18 May 2025",
  interviewDurationMinutes: 42,
  totalQuestions: 18,
  resumeVisibility: "Private — Not Shared",
  primarySkills: [
    "Node.js",
    "Angular",
    "React.js",
    "MongoDB",
    "AWS",
    "GCP",
    "Docker",
    "Microservices",
    "REST APIs",
    "GraphQL",
  ],
  careerScore: 742,
  industryStatus: "Industry Ready",
  scoreBandInterpretation:
    "Candidate is ready for mid-level full-stack/backend roles. Focus on system design, cloud ownership and architecture communication to reach the next career band.",
  healthDistribution: {
    technical: 78,
    practical: 81,
    cloud: 68,
    systemDesign: 61,
    communication: 64,
  },
  specializedSummary: {
    backend: { rating: 4, label: "Strong" },
    api: { rating: 4, label: "Strong" },
    auth: { rating: 3, label: "Good" },
    problemSolving: { rating: 3, label: "Moderate" },
    cloud: { rating: 3, label: "Moderate" },
    systemDesign: { rating: 2, label: "Developing" },
    communication: { rating: 3, label: "Moderate" },
  },
  questions: [
    {
      number: 1,
      topic: "REST APIs",
      question: "Explain REST APIs you developed and how request-response handling was managed.",
      technicalAccuracy: 8,
      clarity: 7,
      realTimeUnderstanding: 8,
      architectureDepth: 6,
      total: 29,
      score: 7.3,
      feedback:
        "Good implementation understanding and API flow awareness. Explaining scalability and reusable API design strategies can help.",
    },
    {
      number: 2,
      topic: "JWT Authentication",
      question: "Explain JWT authentication flow in your application.",
      technicalAccuracy: 8,
      clarity: 6,
      realTimeUnderstanding: 7,
      architectureDepth: 8,
      total: 29,
      score: 7.3,
      feedback:
        "Good understanding of token validation and auth flow. Improve knowledge around token expiry, refresh handling and gateway validation.",
    },
    {
      number: 3,
      topic: "Microservices & Error Handling",
      question: "How would you handle failures between microservices in a distributed environment?",
      technicalAccuracy: 6,
      clarity: 5,
      realTimeUnderstanding: 7,
      architectureDepth: 5,
      total: 23,
      score: 5.8,
      feedback:
        "Implementation-level understanding. Strengthen concepts like retries, circuit breakers, logging, tracing and fault tolerance.",
    },
    {
      number: 4,
      topic: "Cloud Exposure",
      question: "Which AWS or GCP services did you directly use and what was your responsibility?",
      technicalAccuracy: 7,
      clarity: 7,
      realTimeUnderstanding: 5,
      architectureDepth: 6,
      total: 25,
      score: 6.3,
      feedback:
        "Awareness of cloud services is good. Provide deeper deployment examples and DevOps exposure.",
    },
    {
      number: 5,
      topic: "Production Issues",
      question: "If API latency increases in production, how would you debug the issue?",
      technicalAccuracy: 7,
      clarity: 5,
      realTimeUnderstanding: 6,
      architectureDepth: 7,
      total: 25,
      score: 6.3,
      feedback:
        "Logical debugging approach shown. Improve with monitoring tools, profiling and performance optimization concepts.",
    },
    {
      number: 6,
      topic: "Socket Communication",
      question: "Explain how socket communication was handled in your chat application.",
      technicalAccuracy: 8,
      clarity: 7,
      realTimeUnderstanding: 6,
      architectureDepth: 5,
      total: 26,
      score: 6.5,
      feedback:
        "Good practical understanding of sockets. Improve scalability and concurrent user handling concepts.",
    },
  ],
  radarSkills: {
    backend: 82,
    frontend: 70,
    database: 75,
    cloud: 68,
    devops: 60,
    systemDesign: 61,
    communication: 64,
  },
  growthPotential: [
    { role: "MERN / MEAN Developer", score: 90 },
    { role: "Backend Engineer", score: 84 },
    { role: "Full Stack Developer", score: 86 },
    { role: "Cloud-Native Engineer", score: 68 },
    { role: "Technical Lead", score: 56 },
    { role: "Solution Architect", score: 42 },
  ],
  marketPriorities: [
    {
      id: 1,
      title: "System Design & Scalability",
      description:
        "Focus on distributed systems, caching, queues, API gateway, load balancing and high concurrency.",
      color: "bg-emerald-600 text-white",
    },
    {
      id: 2,
      title: "Cloud & Deployment Readiness",
      description:
        "Strengthen Docker, Kubernetes, CI/CD pipelines, AWS deployment, monitoring & observability.",
      color: "bg-blue-600 text-white",
    },
    {
      id: 3,
      title: "Communication Structuring",
      description:
        "Use structured approach: Problem → Your Role → Solution → Challenges → Business Outcome.",
      color: "bg-amber-600 text-white",
    },
    {
      id: 4,
      title: "Production Engineering Skills",
      description:
        "Learn monitoring, logging, profiling and debugging tools for real-time production environments.",
      color: "bg-purple-600 text-white",
    },
  ],
  topStrengths: [
    "Strong backend development skills",
    "Good API design & integration",
    "Practical real-time application exposure",
    "Quick learner & adaptable",
    "Hands-on with modern technologies",
  ],
  topGrowthAreas: [
    "System design & scalability",
    "Cloud deployment expertise",
    "Architecture communication depth",
    "Production debugging skills",
  ],
  coachNotes:
    "Your profile demonstrates strong practical engineering exposure and adaptability across modern backend and full-stack technologies. Your implementation-level understanding is a strong foundation for mid-level engineering opportunities. With focused improvements in system design, deployment architecture, and communication structure, you can significantly improve your readiness for premium product and enterprise engineering roles.",
  industryAlignment: 74,
  recommendedRoles: [
    "Full Stack Engineering",
    "Backend Development",
    "Product Engineering",
    "API & Integration Projects",
    "Modern Web Applications",
  ],
  nextStep:
    "Strengthen system design, cloud deployment exposure, architecture communication and production engineering skills to move into the next career band (850+).",
};

interface Props {
  initialData?: Partial<CareerIntelligenceData>;
  isCompleted?: boolean;
}

export default function CareerIntelligenceDashboard({
  initialData,
  isCompleted: passedIsCompleted,
}: Props) {
  // Determine if completed from props or initial data
  const isInterviewCompleted =
    passedIsCompleted !== undefined
      ? passedIsCompleted
      : Boolean(initialData?.isCompleted);

  // Toggle between actual state and benchmark preview
  const [showBenchmarkPreview, setShowBenchmarkPreview] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Active dataset
  const data: CareerIntelligenceData = showBenchmarkPreview
    ? BENCHMARK_REPORT_DATA
    : {
        ...BENCHMARK_REPORT_DATA,
        ...initialData,
        isCompleted: isInterviewCompleted,
      };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Helper for star rating
  const renderStars = (rating: number, max = 5) => {
    return (
      <div className="flex items-center gap-0.5 text-amber-500">
        {Array.from({ length: max }).map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < rating
                ? "fill-amber-400 text-amber-500"
                : "text-slate-200 fill-slate-100"
            }`}
          />
        ))}
      </div>
    );
  };

  // Gauge calculations for the speed gauge (0 - 1000)
  const currentScore = data.isCompleted ? data.careerScore ?? 742 : 0;
  // Calculate needle angle: 0 score = -90deg, 1000 score = +90deg
  const needleAngle = -90 + (Math.min(1000, Math.max(0, currentScore)) / 1000) * 180;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans print:bg-white print:p-0">
      {/* Top Action Bar (Print / Share / Notice) */}
      <div className="max-w-[1240px] mx-auto pt-6 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href="/interview"
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
          >
            &larr; Back to Portal
          </Link>

          {!isInterviewCompleted && (
            <button
              onClick={() => setShowBenchmarkPreview((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-2xs ${
                showBenchmarkPreview
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              {showBenchmarkPreview
                ? "Viewing Benchmark Preview (Click to see Live State)"
                : "Preview Benchmark Sample Report"}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{copiedLink ? "Link Copied!" : "Share Link"}</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Main Report Container */}
      <div className="max-w-[1240px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6 print:p-0 print:space-y-4">
        {/* NOT YET DONE BANNER (if not completed and not in sample preview mode) */}
        {!isInterviewCompleted && !showBenchmarkPreview && (
          <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-300/80 rounded-2xl p-5 sm:p-6 shadow-sm print:hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
                      Action Required
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      Interview Not Yet Done
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                    Hi {data.candidateName || "Candidate"}! This exact AI-Powered Career
                    Intelligence Scorecard will be analyzed and generated in real-time as soon as you
                    complete your AI video interview session. Below is the framework and benchmark
                    metrics that will be evaluated.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/interview"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D97757] to-[#B95F42] hover:from-[#B95F42] hover:to-[#A04E35] text-white font-bold text-sm shadow-md transition-all text-center"
                >
                  <span>Start or Schedule Interview</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* EXECUTIVE REPORT CARD WRAPPER (Exact visual clone of requested dashboard) */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_12px_45px_rgb(0,0,0,0.06)] p-5 sm:p-7 lg:p-9 space-y-6 print:shadow-none print:border-none print:p-0">
          
          {/* HEADER SECTION */}
          <div className="pb-5 border-b border-slate-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            {/* Left: Logo & Subtitle */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-sm">
                H
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-2xl font-black tracking-tight text-[#1E3A8A]">
                    HireRighttt<span className="text-blue-500 font-bold text-sm align-top">™</span>
                  </h1>
                </div>
                <p className="text-xs font-semibold text-slate-500 tracking-wide">
                  AI-Powered Career Intelligence Dashboard
                </p>
              </div>
            </div>

            {/* Middle: Candidate Info & Avatar */}
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-100 shrink-0 shadow-2xs">
                {data.avatarUrl ? (
                  <Image
                    src={data.avatarUrl}
                    alt={data.candidateName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-slate-700 text-lg bg-blue-100">
                    {data.candidateName.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {data.candidateName}
                </h2>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">
                  {data.candidateTitle || "Software Engineer | 5+ Years Experience"}
                </p>
                <p className="text-[11px] font-medium text-slate-500">
                  {data.careerTrack || "Full Stack / Backend Engineering"}
                </p>
              </div>
            </div>

            {/* Right: Meta Details (Candidate ID, Status, Date, Resume, Track) */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[11px] border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 w-full lg:w-auto">
              {/* Candidate ID */}
              <div className="flex items-center gap-2">
                <IdCard className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Candidate ID</span>
                  <span className="font-bold text-slate-800">{data.candidateId || "HRT-AI-IND-10482"}</span>
                </div>
              </div>

              {/* Resume Visibility */}
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-500 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Resume Visibility</span>
                  <span className="font-bold text-rose-600">{data.resumeVisibility || "Private — Not Shared"}</span>
                </div>
              </div>

              {/* Interview Status */}
              <div className="flex items-center gap-2">
                {data.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                )}
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Interview Status</span>
                  {data.isCompleted ? (
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                      Completed
                    </span>
                  ) : (
                    <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                      Not Yet Done Interview
                    </span>
                  )}
                </div>
              </div>

              {/* Career Track */}
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Career Track</span>
                  <span className="font-bold text-slate-800 truncate max-w-[140px] block">
                    {data.careerTrack || "Full Stack / Backend Engineering"}
                  </span>
                </div>
              </div>

              {/* Interview Date */}
              <div className="flex items-center gap-2 col-span-2">
                <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Interview Date</span>
                  <span className="font-bold text-slate-800">
                    {data.isCompleted
                      ? data.interviewDate || "18 May 2025"
                      : "Pending Live Assessment"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PRIMARY SKILLS & INDUSTRY STATUS RIBBON */}
          <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-blue-50/70 px-4 py-2.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-blue-800 uppercase tracking-wider text-[11px] bg-blue-100/90 px-2.5 py-1 rounded-md">
                PRIMARY SKILLS:
              </span>
              <span className="font-semibold text-slate-700">
                {data.primarySkills?.join(", ") ||
                  "Node.js, Angular, React.js, MongoDB, AWS, GCP, Docker, Microservices, REST APIs, GraphQL"}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="font-bold text-blue-900 text-[11px] uppercase tracking-wider">
                INDUSTRY STATUS:
              </span>
              <span
                className={`font-extrabold px-3 py-1 rounded-full text-xs shadow-2xs ${
                  data.isCompleted
                    ? "bg-emerald-600 text-white"
                    : "bg-amber-500 text-white"
                }`}
              >
                {data.isCompleted ? data.industryStatus || "Industry Ready" : "Pending AI Assessment"}
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ROW 1: CAREER SCORE GAUGE + SCORE BAND EXPLANATION + CAREER HEALTH */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* CARD 1: HIRERIGHT CAREER SCORE GAUGE (Speedometer) */}
            <div className="md:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 flex flex-col items-center justify-between text-center shadow-2xs relative">
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-2">
                HIRERIGHTTT CAREER SCORE<span className="align-top text-[9px]">™</span>
              </h3>

              {/* Gauge Meter Graphic */}
              <div className="relative w-56 h-28 my-2 flex items-end justify-center overflow-hidden">
                <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
                  {/* Gauge Arc: Red (0-550) */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 75 25"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  {/* Gauge Arc: Orange/Yellow (550-700) */}
                  <path
                    d="M 75 25 A 80 80 0 0 1 125 25"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="16"
                  />
                  {/* Gauge Arc: Green (700-1000) */}
                  <path
                    d="M 125 25 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  {/* Scale Labels */}
                  <text x="15" y="105" fontSize="11" fontWeight="bold" fill="#64748B">
                    0
                  </text>
                  <text x="165" y="105" fontSize="11" fontWeight="bold" fill="#64748B">
                    1000
                  </text>

                  {/* Indicator Needle */}
                  <g transform={`translate(100, 100) rotate(${needleAngle})`}>
                    <line x1="0" y1="0" x2="0" y2="-72" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
                    <circle cx="0" cy="0" r="6" fill="#1E293B" />
                  </g>
                </svg>
              </div>

              {/* Central Big Score */}
              <div className="mt-1">
                <div className="text-4xl font-black text-blue-900 tracking-tight">
                  {data.isCompleted ? data.careerScore || 742 : "--"}
                </div>
                <div className="text-xs font-semibold text-slate-500">/ 1000</div>
              </div>

              {/* Status Badge */}
              <div className="mt-3">
                <span
                  className={`inline-block font-extrabold text-xs px-3.5 py-1 rounded-full ${
                    data.isCompleted
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-amber-100 text-amber-800 border border-amber-300"
                  }`}
                >
                  {data.isCompleted ? data.industryStatus || "Industry Ready" : "Pending Evaluation"}
                </span>
                <p className="text-[11px] font-semibold text-emerald-700 mt-1">
                  {data.isCompleted ? "Growth Acceleration Recommended" : "Complete Interview to Benchmark"}
                </p>
              </div>
            </div>

            {/* CARD 2: SCORE BAND EXPLANATION */}
            <div className="md:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between shadow-2xs text-xs">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-3 text-center">
                  SCORE BAND EXPLANATION
                </h3>

                {/* Tiers List */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-20 font-bold px-2 py-0.5 rounded bg-emerald-700 text-white text-[11px] text-center">
                      850 – 1000
                    </span>
                    <span className="font-bold text-slate-800 text-[11px]">
                      Premium Market-Ready Talent
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="w-20 font-bold px-2 py-0.5 rounded bg-emerald-500 text-white text-[11px] text-center">
                      700 – 849
                    </span>
                    <span className="font-bold text-slate-800 text-[11px]">
                      Industry Ready
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="w-20 font-bold px-2 py-0.5 rounded bg-amber-500 text-white text-[11px] text-center">
                      550 – 699
                    </span>
                    <span className="font-bold text-slate-800 text-[11px]">
                      Growth Potential
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="w-20 font-bold px-2 py-0.5 rounded bg-rose-600 text-white text-[11px] text-center">
                      Below 550
                    </span>
                    <span className="font-bold text-slate-800 text-[11px]">
                      Skill Enhancement Recommended
                    </span>
                  </div>
                </div>
              </div>

              {/* Interpretation Callout */}
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-[11px] leading-relaxed text-slate-700">
                <span className="font-black text-blue-900 flex items-center gap-1 mb-1">
                  <Info className="w-3.5 h-3.5 text-blue-700 inline" />
                  INTERPRETATION:
                </span>
                {data.isCompleted
                  ? data.scoreBandInterpretation ||
                    `${data.candidateName} is ready for mid-level full-stack/backend roles. Focus on system design, cloud ownership and architecture communication to reach the next career band.`
                  : "Candidate has not yet completed the AI video interview. Take the interview session to generate personalized band placement and executive interpretation."}
              </div>
            </div>

            {/* CARD 3: CAREER HEALTH DISTRIBUTION */}
            <div className="md:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between shadow-2xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-3 text-center">
                CAREER HEALTH DISTRIBUTION
              </h3>

              {/* 5 Circular Rings */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 my-auto">
                {/* 1. Technical */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-14 h-14">
                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="3.5" />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="3.5"
                        strokeDasharray={2 * Math.PI * 14}
                        strokeDashoffset={
                          2 * Math.PI * 14 * (1 - (data.isCompleted ? (data.healthDistribution?.technical ?? 78) : 0) / 100)
                        }
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center font-black text-xs text-slate-800">
                      {data.isCompleted ? `${data.healthDistribution?.technical ?? 78}%` : "--"}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 mt-1">Technical</span>
                  <span className="text-[10px] font-semibold text-emerald-700">Strong</span>
                </div>

                {/* 2. Practical */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-14 h-14">
                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="3.5" />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="3.5"
                        strokeDasharray={2 * Math.PI * 14}
                        strokeDashoffset={
                          2 * Math.PI * 14 * (1 - (data.isCompleted ? (data.healthDistribution?.practical ?? 81) : 0) / 100)
                        }
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center font-black text-xs text-slate-800">
                      {data.isCompleted ? `${data.healthDistribution?.practical ?? 81}%` : "--"}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 mt-1">Practical</span>
                  <span className="text-[10px] font-semibold text-emerald-700">Strong</span>
                </div>

                {/* 3. Cloud */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-14 h-14">
                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="3.5" />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="3.5"
                        strokeDasharray={2 * Math.PI * 14}
                        strokeDashoffset={
                          2 * Math.PI * 14 * (1 - (data.isCompleted ? (data.healthDistribution?.cloud ?? 68) : 0) / 100)
                        }
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center font-black text-xs text-slate-800">
                      {data.isCompleted ? `${data.healthDistribution?.cloud ?? 68}%` : "--"}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 mt-1">Cloud</span>
                  <span className="text-[10px] font-semibold text-amber-700">Developing</span>
                </div>

                {/* 4. System Design */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-14 h-14">
                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="3.5" />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#EA580C"
                        strokeWidth="3.5"
                        strokeDasharray={2 * Math.PI * 14}
                        strokeDashoffset={
                          2 * Math.PI * 14 * (1 - (data.isCompleted ? (data.healthDistribution?.systemDesign ?? 61) : 0) / 100)
                        }
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center font-black text-xs text-slate-800">
                      {data.isCompleted ? `${data.healthDistribution?.systemDesign ?? 61}%` : "--"}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 mt-1 leading-tight">System Design</span>
                  <span className="text-[9px] font-semibold text-orange-700">Needs Strengthening</span>
                </div>

                {/* 5. Communication */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-14 h-14">
                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="3.5" />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="3.5"
                        strokeDasharray={2 * Math.PI * 14}
                        strokeDashoffset={
                          2 * Math.PI * 14 * (1 - (data.healthDistribution?.communication ?? 64) / 100)
                        }
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center font-black text-xs text-slate-800">
                      {data.isCompleted ? `${data.healthDistribution?.communication ?? 64}%` : "--"}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 mt-1">Communication</span>
                  <span className="text-[9px] font-semibold text-amber-700">Moderate</span>
                </div>
              </div>

              {/* Health Legend */}
              <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-100 text-[10px] font-semibold text-slate-600">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Strong (70%+)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Moderate (50%-69%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Needs Improvement (&lt;50%)
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ROW 2: DETAILED HEALTH METRICS & SPECIALIZED PATTERN ASSESSMENT */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* LEFT: DETAILED CAREER HEALTH METRICS */}
            <div className="md:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs text-xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-4 text-center">
                DETAILED CAREER HEALTH METRICS
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1.5 uppercase">
                  <span>Category</span>
                  <div className="flex items-center gap-6">
                    <span>Score</span>
                    <span>Performance</span>
                  </div>
                </div>

                {/* Metric 1: Technical Knowledge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 w-44 truncate">
                    <Code className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Technical Knowledge</span>
                  </div>
                  <div className="flex-1 max-w-[100px] bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${data.isCompleted ? 78 : 0}%` }}
                    />
                  </div>
                  <span className="font-extrabold text-slate-800 w-8 text-right">
                    {data.isCompleted ? "78%" : "--"}
                  </span>
                  <span className="w-28 text-right font-extrabold text-emerald-600 text-[11px]">
                    Strong
                  </span>
                </div>

                {/* Metric 2: Practical Development Exposure */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 w-44 truncate">
                    <Terminal className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Practical Development Exposure</span>
                  </div>
                  <div className="flex-1 max-w-[100px] bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${data.isCompleted ? 81 : 0}%` }}
                    />
                  </div>
                  <span className="font-extrabold text-slate-800 w-8 text-right">
                    {data.isCompleted ? "81%" : "--"}
                  </span>
                  <span className="w-28 text-right font-extrabold text-emerald-600 text-[11px]">
                    Strong
                  </span>
                </div>

                {/* Metric 3: API Development & Integrations */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 w-44 truncate">
                    <Server className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>API Development & Integrations</span>
                  </div>
                  <div className="flex-1 max-w-[100px] bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${data.isCompleted ? 82 : 0}%` }}
                    />
                  </div>
                  <span className="font-extrabold text-slate-800 w-8 text-right">
                    {data.isCompleted ? "82%" : "--"}
                  </span>
                  <span className="w-28 text-right font-extrabold text-emerald-600 text-[11px]">
                    Strong
                  </span>
                </div>

                {/* Metric 4: Cloud & Deployment Readiness */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 w-44 truncate">
                    <Cloud className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Cloud & Deployment Readiness</span>
                  </div>
                  <div className="flex-1 max-w-[100px] bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${data.isCompleted ? 68 : 0}%` }}
                    />
                  </div>
                  <span className="font-extrabold text-slate-800 w-8 text-right">
                    {data.isCompleted ? "68%" : "--"}
                  </span>
                  <span className="w-28 text-right font-extrabold text-amber-600 text-[11px]">
                    Developing
                  </span>
                </div>

                {/* Metric 5: System Design & Scalability */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 w-44 truncate">
                    <Layers className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>System Design & Scalability</span>
                  </div>
                  <div className="flex-1 max-w-[100px] bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-orange-500 h-full rounded-full"
                      style={{ width: `${data.isCompleted ? 61 : 0}%` }}
                    />
                  </div>
                  <span className="font-extrabold text-slate-800 w-8 text-right">
                    {data.isCompleted ? "61%" : "--"}
                  </span>
                  <span className="w-28 text-right font-extrabold text-orange-600 text-[11px]">
                    Needs Strengthening
                  </span>
                </div>

                {/* Metric 6: Communication Clarity */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 w-44 truncate">
                    <Bot className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Communication Clarity</span>
                  </div>
                  <div className="flex-1 max-w-[100px] bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${data.isCompleted ? 64 : 0}%` }}
                    />
                  </div>
                  <span className="font-extrabold text-slate-800 w-8 text-right">
                    {data.isCompleted ? "64%" : "--"}
                  </span>
                  <span className="w-28 text-right font-extrabold text-amber-600 text-[11px]">
                    Moderate
                  </span>
                </div>

                {/* Metric 7: Overall Career Readiness */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 font-black text-blue-900 w-44 truncate">
                    <Target className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    <span>Overall Career Readiness</span>
                  </div>
                  <div className="flex-1 max-w-[100px] bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${data.isCompleted ? 72 : 0}%` }}
                    />
                  </div>
                  <span className="font-extrabold text-blue-900 w-8 text-right">
                    {data.isCompleted ? "72%" : "--"}
                  </span>
                  <span className="w-28 text-right font-black text-blue-700 text-[11px]">
                    Industry Ready
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT: SPECIALIZED INTERVIEW PATTERN ASSESSMENT */}
            <div className="md:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-4 text-center">
                  SPECIALIZED INTERVIEW PATTERN ASSESSMENT<span className="align-top text-[9px]">™</span>
                </h3>

                {/* 3 Metric Stat Boxes */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {/* Duration */}
                  <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/80 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-slate-900">
                        {data.isCompleted ? `${data.interviewDurationMinutes || 42}` : "--"}
                        <span className="text-xs font-bold text-slate-500 ml-1">Minutes</span>
                      </div>
                      <div className="text-[10px] font-bold text-purple-800 uppercase tracking-wide">
                        Interview Duration
                      </div>
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center shrink-0">
                      <HelpCircle className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-slate-900">
                        {data.isCompleted ? `${data.totalQuestions || 18}` : "--"}
                        <span className="text-xs font-bold text-slate-500 ml-1">Questions</span>
                      </div>
                      <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wide">
                        Questions Asked
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                      <Target className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-slate-900">
                        {data.isCompleted ? "74" : "--"}
                        <span className="text-xs font-bold text-slate-500 ml-1">/ 100</span>
                      </div>
                      <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                        Overall Interview Score
                      </div>
                    </div>
                  </div>
                </div>

                {/* Purple Interview Type Pill */}
                <div className="py-1.5 px-4 rounded-lg bg-purple-100/70 text-purple-900 text-center font-bold text-xs mb-4">
                  Interview Type: Full Stack Engineering Technical Interview
                </div>
              </div>

              {/* INTERVIEW PERFORMANCE SUMMARY RATING COLUMNS */}
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-wider text-blue-900 text-center mb-3">
                  INTERVIEW PERFORMANCE SUMMARY
                </h4>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 text-center text-xs">
                  {/* 1. Backend Development */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-700 h-7 flex items-center justify-center">
                      Backend Development
                    </span>
                    <div className="my-1">{renderStars(data.isCompleted ? 4 : 0)}</div>
                    <span className="text-[10px] font-bold text-emerald-700">Strong</span>
                  </div>

                  {/* 2. API Development */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-700 h-7 flex items-center justify-center">
                      API Development
                    </span>
                    <div className="my-1">{renderStars(data.isCompleted ? 4 : 0)}</div>
                    <span className="text-[10px] font-bold text-emerald-700">Strong</span>
                  </div>

                  {/* 3. Authentication */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-700 h-7 flex items-center justify-center">
                      Authentication Concepts
                    </span>
                    <div className="my-1">{renderStars(data.isCompleted ? 3 : 0)}</div>
                    <span className="text-[10px] font-bold text-emerald-600">Good</span>
                  </div>

                  {/* 4. Real-Time Problem Solving */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-700 h-7 flex items-center justify-center leading-tight">
                      Real-Time Problem Solving
                    </span>
                    <div className="my-1">{renderStars(data.isCompleted ? 3 : 0)}</div>
                    <span className="text-[10px] font-bold text-amber-600">Moderate</span>
                  </div>

                  {/* 5. Cloud & Deployment */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-700 h-7 flex items-center justify-center">
                      Cloud & Deployment
                    </span>
                    <div className="my-1">{renderStars(data.isCompleted ? 3 : 0)}</div>
                    <span className="text-[10px] font-bold text-amber-600">Moderate</span>
                  </div>

                  {/* 6. System Design */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-700 h-7 flex items-center justify-center">
                      System Design
                    </span>
                    <div className="my-1">{renderStars(data.isCompleted ? 2 : 0)}</div>
                    <span className="text-[10px] font-bold text-orange-600">Developing</span>
                  </div>

                  {/* 7. Communication Structuring */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-700 h-7 flex items-center justify-center leading-tight">
                      Communication Structuring
                    </span>
                    <div className="my-1">{renderStars(data.isCompleted ? 3 : 0)}</div>
                    <span className="text-[10px] font-bold text-amber-600">Moderate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ROW 3: ACTUAL INTERVIEW QUESTIONS & SCORING (Comprehensive Wide Table) */}
          {/* ========================================================================= */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-3 text-center">
              ACTUAL INTERVIEW QUESTIONS & SCORING
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-black uppercase tracking-wider text-slate-600">
                    <th className="py-2.5 px-3 text-center w-8">#</th>
                    <th className="py-2.5 px-3 w-36">TOPIC</th>
                    <th className="py-2.5 px-3 min-w-[220px]">QUESTION ASKED</th>
                    <th className="py-2.5 px-3 text-center" colSpan={4}>
                      <div className="border-b border-slate-200 pb-1 mb-1">
                        SCORE BREAKDOWN (OUT OF 10)
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-[9px] font-bold">
                        <span>TECHNICAL ACCURACY</span>
                        <span>CLARITY</span>
                        <span>REAL-TIME UNDERSTANDING</span>
                        <span>ARCHITECTURE / DEPTH</span>
                      </div>
                    </th>
                    <th className="py-2.5 px-3 text-center w-20">TOTAL (OUT OF 40)</th>
                    <th className="py-2.5 px-3 text-center w-24">PERFORMANCE</th>
                    <th className="py-2.5 px-3 min-w-[220px]">AI FEEDBACK SUMMARY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.questions && data.questions.length > 0 ? (
                    data.questions.map((q, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-3 text-center">
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] inline-flex items-center justify-center">
                            {q.number || idx + 1}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-800 text-[11px]">
                          {q.topic || `Question ${idx + 1}`}
                        </td>
                        <td className="py-3 px-3 text-slate-700 text-[11px] leading-relaxed">
                          {q.question}
                        </td>
                        {/* Breakdown 4 columns */}
                        <td className="py-3 px-1 text-center font-bold text-slate-700">
                          {data.isCompleted ? q.technicalAccuracy ?? 8 : "--"}
                        </td>
                        <td className="py-3 px-1 text-center font-bold text-slate-700">
                          {data.isCompleted ? q.clarity ?? 7 : "--"}
                        </td>
                        <td className="py-3 px-1 text-center font-bold text-slate-700">
                          {data.isCompleted ? q.realTimeUnderstanding ?? 7 : "--"}
                        </td>
                        <td className="py-3 px-1 text-center font-bold text-slate-700">
                          {data.isCompleted ? q.architectureDepth ?? 6 : "--"}
                        </td>
                        {/* Total */}
                        <td className="py-3 px-3 text-center font-black text-slate-900 text-xs">
                          {data.isCompleted ? `${q.total ?? 28}/40` : "--/40"}
                        </td>
                        {/* Performance Stars */}
                        <td className="py-3 px-3 text-center">
                          <div className="flex justify-center">
                            {renderStars(data.isCompleted ? Math.round((q.score || 7) / 2) : 0, 4)}
                          </div>
                        </td>
                        {/* Feedback */}
                        <td className="py-3 px-3 text-[11px] text-slate-600 leading-relaxed">
                          {data.isCompleted
                            ? q.feedback || "Good implementation-level understanding shown."
                            : "Candidate responses will be transcribed and evaluated here following the interview."}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-500 text-sm">
                        No questions recorded yet. Complete the interview to generate detailed question evaluation.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ROW 4: RADAR CHART + CAREER GROWTH POTENTIAL + MARKET-BASED PRIORITIES */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* 1. SKILL STRENGTH RADAR */}
            <div className="md:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 flex flex-col items-center justify-between shadow-2xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-2 text-center">
                SKILL STRENGTH RADAR
              </h3>

              {/* Spider Radar SVG */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                <svg viewBox="0 0 240 240" className="w-full h-full overflow-visible">
                  {/* Concentric Web Rings (20, 40, 60, 80, 100) */}
                  {[20, 40, 60, 80].map((radius, i) => (
                    <circle
                      key={i}
                      cx="120"
                      cy="120"
                      r={radius}
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="1"
                    />
                  ))}
                  {/* Axis Spokes (7 angles: 0, 51.4, 102.8, 154.2, 205.7, 257.1, 308.5 deg) */}
                  {[
                    { label: "Backend\n(82%)", x: 120, y: 25 },
                    { label: "Frontend\n(70%)", x: 195, y: 65 },
                    { label: "Database\n(75%)", x: 200, y: 155 },
                    { label: "Cloud\n(68%)", x: 145, y: 215 },
                    { label: "DevOps\n(60%)", x: 75, y: 215 },
                    { label: "System Design\n(61%)", x: 25, y: 155 },
                    { label: "Communication\n(64%)", x: 30, y: 65 },
                  ].map((spoke, idx) => (
                    <g key={idx}>
                      <line
                        x1="120"
                        y1="120"
                        x2={spoke.x}
                        y2={spoke.y}
                        stroke="#E2E8F0"
                        strokeWidth="1"
                      />
                      <text
                        x={spoke.x}
                        y={spoke.y - (spoke.y < 120 ? 8 : -14)}
                        fontSize="9"
                        fontWeight="bold"
                        fill="#334155"
                        textAnchor="middle"
                      >
                        {spoke.label.split("\n")[0]}
                      </text>
                      <text
                        x={spoke.x}
                        y={spoke.y - (spoke.y < 120 ? -2 : -24)}
                        fontSize="8"
                        fontWeight="extrabold"
                        fill="#64748B"
                        textAnchor="middle"
                      >
                        {data.isCompleted ? spoke.label.split("\n")[1] : "(--%)"}
                      </text>
                    </g>
                  ))}

                  {/* Filled Value Polygon */}
                  {data.isCompleted && (
                    <polygon
                      points="120,40 180,75 185,148 140,185 85,180 50,145 55,75"
                      fill="#3B82F6"
                      fillOpacity="0.25"
                      stroke="#2563EB"
                      strokeWidth="2"
                    />
                  )}
                  {/* Vertex Points */}
                  {data.isCompleted &&
                    [
                      [120, 40],
                      [180, 75],
                      [185, 148],
                      [140, 185],
                      [85, 180],
                      [50, 145],
                      [55, 75],
                    ].map(([px, py], i) => (
                      <circle key={i} cx={px} cy={py} r="3.5" fill="#2563EB" />
                    ))}
                </svg>
              </div>
            </div>

            {/* 2. CAREER GROWTH POTENTIAL */}
            <div className="md:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between text-xs">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-4 text-center">
                  CAREER GROWTH POTENTIAL
                </h3>

                <div className="space-y-3">
                  {[
                    { role: "MERN / MEAN Developer", score: 90, color: "bg-emerald-500" },
                    { role: "Backend Engineer", score: 84, color: "bg-emerald-500" },
                    { role: "Full Stack Developer", score: 86, color: "bg-emerald-500" },
                    { role: "Cloud-Native Engineer", score: 68, color: "bg-amber-500" },
                    { role: "Technical Lead", score: 56, color: "bg-amber-500" },
                    { role: "Solution Architect", score: 42, color: "bg-rose-500" },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-[11px] font-bold text-slate-800">
                        <span>{item.role}</span>
                        <span className="font-extrabold">{data.isCompleted ? `${item.score}%` : "--%"}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.color}`}
                          style={{ width: `${data.isCompleted ? item.score : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scale Axis */}
              <div className="flex justify-between text-[10px] font-bold text-slate-400 pt-3 border-t border-slate-100 mt-2 px-1">
                <span>0</span>
                <span>20</span>
                <span>40</span>
                <span>60</span>
                <span>80</span>
                <span>100</span>
              </div>
            </div>

            {/* 3. MARKET-BASED IMPROVEMENT PRIORITIES */}
            <div className="md:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between text-xs">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-4 text-center">
                  MARKET-BASED IMPROVEMENT PRIORITIES
                </h3>

                <div className="space-y-3">
                  {(data.marketPriorities || BENCHMARK_REPORT_DATA.marketPriorities!).map(
                    (p, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-xs shrink-0 shadow-2xs ${p.color}`}
                        >
                          {p.id}
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-900 text-[11px] leading-tight">
                            {p.title}
                          </h4>
                          <p className="text-[10px] text-slate-600 mt-0.5 leading-relaxed">
                            {p.description}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ROW 5: RESUME POSITIONING + ALIGNMENT + STRENGTHS/GROWTH + AI COACH */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* 1. RESUME POSITIONING INTELLIGENCE */}
            <div className="md:col-span-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between text-xs">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-1">
                  RESUME POSITIONING INTELLIGENCE<span className="align-top text-[9px]">™</span>
                </h3>
                <p className="text-[10px] text-slate-500 mb-3">
                  Your resume is currently kept private and not shared with recruiters.
                </p>

                <p className="text-[11px] font-bold text-slate-800 mb-3">
                  HireRighttt recommends improving:
                </p>

                <div className="grid grid-cols-5 gap-1.5 text-center my-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-700 leading-tight">Project Storytelling</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
                      <Layers className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-700 leading-tight">Architecture Visibility</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-700 leading-tight">Business Impact</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
                      <Cloud className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-700 leading-tight">Deployment Ownership</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-700 leading-tight">Technical Leadership</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 text-[10px] font-semibold leading-relaxed mt-3">
                These improvements will significantly increase recruiter visibility and interview opportunities.
              </div>
            </div>

            {/* 2. INDUSTRY ALIGNMENT */}
            <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col items-center justify-between text-center">
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-2">
                INDUSTRY ALIGNMENT
              </h3>

              <div className="relative w-24 h-24 my-auto">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeDasharray={2 * Math.PI * 14}
                    strokeDashoffset={
                      2 * Math.PI * 14 * (1 - (data.isCompleted ? (data.industryAlignment ?? 74) : 0) / 100)
                    }
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-black text-xl text-slate-900">
                  {data.isCompleted ? `${data.industryAlignment ?? 74}%` : "--"}
                </span>
              </div>

              <p className="text-[10px] font-bold text-slate-600 mt-2 leading-tight">
                Aligned with current industry expectations
              </p>
            </div>

            {/* 3. TOP STRENGTHS & TOP GROWTH AREAS */}
            <div className="md:col-span-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between text-xs">
              {/* TOP STRENGTHS */}
              <div className="mb-3">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  TOP STRENGTHS
                </h4>
                <ul className="space-y-1">
                  {(data.topStrengths || BENCHMARK_REPORT_DATA.topStrengths!).map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-[10px] font-semibold text-slate-700">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* TOP GROWTH AREAS */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-rose-800 flex items-center gap-1.5 mb-2">
                  <Target className="w-3.5 h-3.5 text-rose-600" />
                  TOP GROWTH AREAS
                </h4>
                <ul className="space-y-1">
                  {(data.topGrowthAreas || BENCHMARK_REPORT_DATA.topGrowthAreas!).map((g, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-[10px] font-semibold text-slate-700">
                      <Target className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 4. AI CAREER COACH NOTES */}
            <div className="md:col-span-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50 p-5 shadow-2xs flex flex-col justify-between text-xs relative">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-2">
                  AI CAREER COACH NOTES<span className="align-top text-[9px]">™</span>
                </h3>

                <div className="relative pl-6">
                  <span className="absolute left-0 top-0 text-3xl font-serif text-blue-300 select-none">
                    “
                  </span>
                  <p className="text-[11px] text-slate-700 leading-relaxed italic">
                    {data.isCompleted
                      ? data.coachNotes ||
                        `${data.candidateName}, your profile demonstrates strong practical engineering exposure and adaptability across modern backend and full-stack technologies. Your implementation-level understanding is a strong foundation for mid-level engineering opportunities. With focused improvements in system design, deployment architecture, and communication structure, you can significantly improve your readiness for premium product and enterprise engineering roles.`
                      : "Complete your AI video interview session to unlock comprehensive AI coaching guidance customized to your personal coding execution and interview dialogue."}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-blue-100 mt-3">
                <span className="text-[10px] font-extrabold text-blue-900">
                  — HireRighttt AI Career Coach
                </span>
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* BOTTOM STATUS RIBBON (FINAL STATUS, RECOMMENDED FOR, NEXT STEP) */}
          {/* ========================================================================= */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-xs">
            {/* Final Career Status */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="font-black text-blue-900 uppercase text-[11px] tracking-wider">
                FINAL CAREER STATUS
              </span>
              <span
                className={`font-black px-3.5 py-1.5 rounded-full text-xs flex items-center gap-1.5 shadow-2xs ${
                  data.isCompleted
                    ? "bg-emerald-600 text-white"
                    : "bg-amber-500 text-white"
                }`}
              >
                {data.isCompleted ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Industry Ready</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5" />
                    <span>Pending Interview</span>
                  </>
                )}
              </span>
            </div>

            {/* Recommended For */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">
                RECOMMENDED FOR
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(data.recommendedRoles || BENCHMARK_REPORT_DATA.recommendedRoles!).map(
                  (role, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-bold text-[10px] shadow-2xs"
                    >
                      {role}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Next Recommended Step */}
            <div className="flex items-center gap-2 max-w-sm">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div>
                <span className="font-black text-blue-900 block text-[10px] uppercase">
                  NEXT RECOMMENDED STEP
                </span>
                <p className="text-[10px] font-semibold text-slate-600 leading-tight">
                  {data.nextStep ||
                    "Strengthen system design, cloud deployment exposure, architecture communication and production engineering skills to move into the next career band (850+)."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
