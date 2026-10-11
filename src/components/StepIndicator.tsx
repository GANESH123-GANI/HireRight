"use client";

import { Check } from "lucide-react";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

interface Step {
  number: number;
  label: string;
  sublabel: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepNumber: number) => void;
  className?: string;
}

export default function StepIndicator({ steps, currentStep, onStepClick, className = "" }: StepIndicatorProps) {
  return (
    <div className={`w-full px-2 sm:px-6 lg:px-8 py-2 ${plusJakarta.className} ${className}`}>
      <div className="w-full">
        <div className="flex items-center justify-between relative">
          {steps.map((step, index) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;

            return (
              <div key={step.number} className="flex items-center flex-1 last:flex-none relative">
                <button
                  type="button"
                  onClick={() => onStepClick?.(step.number)}
                  className={`flex flex-col items-center relative z-10 mx-auto group text-center focus:outline-none transition-transform ${
                    onStepClick ? "cursor-pointer hover:scale-105" : "cursor-default"
                  }`}
                  aria-label={`Go to step ${step.number}: ${step.label}`}
                >
                  {/* Step Badge */}
                  <div
                    className={`w-8 h-8 xs:w-9 xs:h-9 sm:w-11 sm:h-11 flex items-center justify-center text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 ${
                      isCompleted
                        ? "bg-[#15803D] text-white shadow-xs"
                        : isCurrent
                        ? "bg-gradient-to-br from-[#D97757] to-[#B95F42] text-white shadow-xs ring-1 ring-[#D97757]/30"
                        : "bg-white text-[#81736C] border border-[#EFE3DB] group-hover:border-[#D97757]/50"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.5]" />
                    ) : (
                      <span>{step.number}</span>
                    )}
                  </div>

                  {/* Step Label & Sublabel */}
                  <div className="text-center mt-1.5 sm:mt-2.5 max-w-[62px] xs:max-w-[75px] sm:max-w-[130px]">
                    <p
                      className={`text-[10px] xs:text-[11px] sm:text-[13px] font-bold tracking-tight transition-colors duration-200 leading-tight truncate sm:whitespace-normal ${
                        isCurrent
                          ? "text-[#D97757]"
                          : isCompleted
                          ? "text-[#382A25] group-hover:text-[#D97757]"
                          : "text-[#81736C] group-hover:text-[#382A25]"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p
                      className={`text-[10px] sm:text-[11px] mt-0.5 hidden md:block leading-tight line-clamp-1 transition-colors duration-200 ${
                        isCurrent
                          ? "text-[#81736C] font-medium"
                          : "text-[#81736C]/70"
                      }`}
                    >
                      {step.sublabel}
                    </p>
                  </div>
                </button>

                {/* Connecting Progress Track */}
                {index < steps.length - 1 && (
                  <div className="block flex-1 h-0.5 sm:h-1 mx-1 sm:mx-2 -mt-5 xs:-mt-6 sm:-mt-7 bg-[#EFE3DB] rounded-full overflow-hidden pointer-events-none">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isCompleted
                          ? "w-full bg-[#15803D]"
                          : isCurrent
                          ? "w-1/2 bg-[#D97757]"
                          : "w-0"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
