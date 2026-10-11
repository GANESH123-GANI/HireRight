"use client";

import Link from "next/link";
import { User, FileCheck, CheckCircle, Briefcase, ArrowRight } from "lucide-react";
import { useGlare } from "@/lib/useGlare";

const steps = [
  {
    number: 1,
    icon: User,
    title: "Create Your Profile",
    description: "Sign up in minutes and share your professional details securely.",
  },
  {
    number: 2,
    icon: FileCheck,
    title: "AI-Powered Screening",
    description: "Our advanced AI verifies your information quickly & accurately.",
  },
  {
    number: 3,
    icon: CheckCircle,
    title: "Get Matched",
    description: "Receive personalized job matches based on your skills and preferences.",
  },
  {
    number: 4,
    icon: Briefcase,
    title: "Land Your Dream Job",
    description: "Move forward with confidence. More trust. More opportunities.",
  },
];

export default function HowItWorks() {
  const { onMouseMove } = useGlare<HTMLDivElement>();
  return (
    <section className="py-24 bg-[#FFF9F5] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FCE8DD]/40 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-[#FCE8DD] border border-[#EFE3DB] rounded-full text-xs font-semibold mb-4 text-[#D97757]">
            Simple Process
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-[#382A25]">
            How <span className="text-[#D97757]">Techcitta</span> Works
          </h2>
          <p className="text-[#81736C] max-w-2xl mx-auto text-lg">
            Get verified and matched with the right opportunities in just 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative" onMouseMove={onMouseMove}>
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-[#D97757]/30 via-[#FCE8DD] to-[#D97757]/30 rounded-full" />

          {steps.map((step) => (
            <div key={step.number} className="text-center relative group">
              <div className="w-28 h-28 bg-white border border-[#EFE3DB] rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10 shadow-[0_8px_30px_rgb(56,42,37,0.06)] group-hover:scale-105 group-hover:border-[#D97757] transition-all duration-300">
                <step.icon className="w-12 h-12 text-[#D97757]" />
              </div>
              <div className="text-xs font-bold text-[#D97757] mb-2 uppercase tracking-wider">Step {step.number}</div>
              <h3 className="text-lg font-bold text-[#382A25] mb-2">{step.title}</h3>
              <p className="text-sm text-[#81736C] max-w-[200px] mx-auto leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-[#D97757] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#B95F42] transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Start Your Journey
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
