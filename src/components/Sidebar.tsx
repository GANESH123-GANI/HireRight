"use client";

import { CheckCircle, Headphones, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

interface SidebarProps {
  currentStep?: number;
  progress: number;
}

export default function Sidebar({ currentStep: _currentStep, progress }: SidebarProps) {
  const { organization } = useAuth();
  const brandName = organization?.name || "HireRight";
  const features = [
    "AI-powered matching with the right roles",
    "Interview with confidence",
    "Trusted by top companies globally",
    "100% secure & privacy-first",
    "Helping talent grow, one connection at a time",
  ];

  return (
    <>
      <aside
        className={`w-full lg:w-80 lg:fixed lg:top-0 lg:left-0 lg:bottom-0 lg:h-screen lg:overflow-y-auto bg-white text-[#382A25] p-5 sm:p-6 lg:p-6 flex flex-col justify-between border-r border-[#EFE3DB] shrink-0 z-30 shadow-xs ${plusJakarta.className}`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D97757] to-[#B95F42] flex items-center justify-center text-white shadow-md shadow-[#D97757]/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[#382A25] font-bold text-lg tracking-tight block leading-tight">
                {brandName}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97757] block">
                AI Platform
              </span>
            </div>
          </div>

          <div className="mb-5">
            <h2 className="text-xl font-bold leading-snug tracking-tight text-[#382A25]">
              Your Journey to the{" "}
              <span className="text-[#D97757]">
                Right
              </span>{" "}
              Opportunity Starts Here.
            </h2>
            <p className="text-xs sm:text-sm text-[#81736C] mt-1.5 leading-relaxed">
              We&apos;re here to understand you better, so we can connect you with opportunities that truly fit your potential.
            </p>
          </div>

          {/* Progress indicator */}
          <div className="bg-gradient-to-br from-[#FCE8DD] via-[#FFF2E8] to-[#FCE8DD] p-4 mb-4 border border-[#E8C9B8] rounded-2xl shadow-xs">
            <p className="text-[11px] font-bold text-[#81736C] mb-2.5 uppercase tracking-wider text-center sm:text-left">
              Your Progress
            </p>
            <div className="relative w-20 h-20 mx-auto">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#EFE3DB" strokeWidth="7" fill="white" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#D97757"
                  strokeWidth="7"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${progress * 2.513} 251.32`}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-base font-bold text-[#382A25] tracking-tight">{progress}%</span>
              </div>
            </div>
            <p className="text-xs text-[#81736C] text-center mt-2.5 font-medium">
              {progress >= 100 ? "All set! You're ready to go." : "Great! Just a few more steps."}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-xs font-bold text-[#81736C] mb-2.5 uppercase tracking-wider">Why {brandName}?</h3>
            <ul className="space-y-2">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#D97757] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-[#382A25] leading-snug">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-3.5 border-t border-[#EFE3DB] shrink-0 mt-2">
          <div className="flex items-center gap-2.5 text-xs text-[#81736C]">
            <div className="w-7 h-7 rounded-lg bg-[#FCE8DD]/60 border border-[#EFE3DB] flex items-center justify-center text-[#D97757]">
              <Headphones className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-semibold text-[#382A25] text-xs">Need help?</p>
              <p className="text-[#81736C] text-[11px]">care@hireright.com</p>
            </div>
          </div>
        </div>
      </aside>
      {/* Spacer to preserve layout flow on desktop */}
      <div className="hidden lg:block lg:w-80 lg:shrink-0" aria-hidden="true" />
    </>
  );
}
