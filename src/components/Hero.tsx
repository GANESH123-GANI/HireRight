"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Play, Rocket, ShieldCheck, Lock, X } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const heroCompanies = [
  {
    id: "tata",
    node: (
      <div className="flex items-center gap-1.5 font-bold tracking-wider text-[#0066B3] text-lg sm:text-xl select-none">
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 5h2v2h-2V7zm-4 4h10v2H7v-2zm2 4h6v2H9v-2z"/>
        </svg>
        <span>TATA</span>
      </div>
    ),
  },
  {
    id: "wipro",
    node: (
      <div className="flex items-center gap-2 text-slate-800 text-lg sm:text-xl select-none">
        <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-pink-500 via-amber-400 to-cyan-500 inline-block shadow-sm" />
        <span className="font-semibold text-slate-800 tracking-tight">wipro</span>
      </div>
    ),
  },
  {
    id: "infosys",
    node: (
      <div className="font-serif font-bold text-[#007CC3] text-xl sm:text-2xl tracking-normal select-none">
        Infosys
      </div>
    ),
  },
  {
    id: "accenture",
    node: (
      <div className="font-bold text-slate-900 text-lg sm:text-xl tracking-tight flex items-center select-none">
        accenture<span className="text-[#A100FF] font-black ml-0.5">&gt;</span>
      </div>
    ),
  },
  {
    id: "amazon",
    node: (
      <div className="flex flex-col items-center select-none">
        <span className="font-bold text-slate-900 text-lg sm:text-xl tracking-tight leading-none">amazon</span>
        <span className="text-[#FF9900] text-sm font-black tracking-widest leading-none -mt-0.5">&#x2323;</span>
      </div>
    ),
  },
  {
    id: "deloitte",
    node: (
      <div className="font-bold text-slate-900 text-lg sm:text-xl tracking-tight select-none">
        Deloitte<span className="text-[#86BC25] font-black">.</span>
      </div>
    ),
  },
  {
    id: "google",
    node: (
      <div className="font-bold text-lg sm:text-xl tracking-tight flex items-center gap-0.5 select-none">
        <span className="text-[#4285F4]">G</span>
        <span className="text-[#EA4335]">o</span>
        <span className="text-[#FBBC05]">o</span>
        <span className="text-[#4285F4]">g</span>
        <span className="text-[#34A853]">l</span>
        <span className="text-[#EA4335]">e</span>
      </div>
    ),
  },
  {
    id: "microsoft",
    node: (
      <div className="flex items-center gap-2 font-semibold text-slate-800 text-lg sm:text-xl select-none">
        <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
          <span className="bg-[#F25022] w-1.5 h-1.5 rounded-[1px]" />
          <span className="bg-[#7FBA00] w-1.5 h-1.5 rounded-[1px]" />
          <span className="bg-[#00A4EF] w-1.5 h-1.5 rounded-[1px]" />
          <span className="bg-[#FFB900] w-1.5 h-1.5 rounded-[1px]" />
        </div>
        <span>Microsoft</span>
      </div>
    ),
  },
  {
    id: "tcs",
    node: (
      <div className="font-black text-lg sm:text-xl tracking-wider text-[#0066B3] select-none">
        TCS
      </div>
    ),
  },
  {
    id: "hsbc",
    node: (
      <div className="flex items-center gap-1.5 font-bold text-slate-900 text-lg sm:text-xl select-none">
        <span className="text-[#DB0011] text-xs font-black">▲▼</span>
        <span>HSBC</span>
      </div>
    ),
  },
];

export default function Hero() {
  const [showVideo, setShowVideo] = useState(false);
  const router = useRouter();

  return (
    <section className="bg-[#FFF9F5] w-full pt-20 sm:pt-24 pb-12 sm:pb-16 px-3 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        {/* Contained Hero - Warm Light Cream Box with Soft Peach Accents */}
        <div className="relative bg-gradient-to-br from-[#FFF9F5] via-[#FCE8DD]/40 to-[#FFF9F5] rounded-3xl overflow-hidden pt-10 sm:pt-14 lg:pt-16 pb-16 sm:pb-20 lg:pb-24 px-5 sm:px-8 lg:px-12 border border-[#EFE3DB] shadow-lg">
          {/* Subtle Warm Amber & Peach Ambience */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Orb 1: Soft Peach Glow */}
            <div className="animate-orb-1 absolute -top-20 -left-10 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#D97757]/15 via-[#FCE8DD]/30 to-transparent blur-[100px]" />

            {/* Orb 2: Warm Sand Aura */}
            <div className="animate-orb-2 absolute top-1/4 right-0 w-[540px] h-[540px] rounded-full bg-gradient-to-br from-[#FCE8DD]/35 via-[#EFE3DB]/30 to-transparent blur-[110px]" />

            {/* Orb 3: Terracotta Ambience */}
            <div className="animate-orb-3 absolute -bottom-24 left-1/3 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-[#D97757]/10 via-[#FCE8DD]/20 to-transparent blur-[100px]" />

            {/* Subtle Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          </div>

          <div className="relative z-10 w-full">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              
              {/* Left Column - Content */}
              <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
                {/* Headline matching reference with entry animation */}
                <ScrollReveal delay={60} direction="up" duration={700}>
                  <h1 className="text-4xl sm:text-5xl lg:text-[3.85rem] font-extrabold leading-[1.08] tracking-tight text-[#382A25]">
                    Your Dream Job <br />
                    Deserves the <br />
                    <span className="text-[#D97757]">Right</span> Start.
                  </h1>
                </ScrollReveal>

                {/* Subtitle with entry animation */}
                <ScrollReveal delay={180} direction="up" duration={700}>
                  <p className="mt-6 text-base sm:text-lg text-[#81736C] max-w-lg leading-relaxed font-normal">
                    Background screening and autonomous AI interviews you can trust. Confidence you can carry into your future.
                  </p>
                </ScrollReveal>

                {/* CTA Buttons with entry animation matching reference */}
                <ScrollReveal delay={300} direction="up" duration={700}>
                  <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-5">
                    <button
                      onClick={() => router.push("/signup")}
                      className="group btn-gradient-pill inline-flex items-center gap-4 text-white px-8 py-3.5 sm:px-9 sm:py-4 rounded-full font-bold text-base sm:text-lg tracking-tight cursor-pointer"
                    >
                      <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">Get Started</span>
                      <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full btn-arrow-bubble flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200">
                        <ArrowRight className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white stroke-[2.5]" />
                      </span>
                    </button>

                    <button
                      onClick={() => setShowVideo(true)}
                      className="inline-flex items-center gap-3 bg-white hover:bg-[#FCE8DD]/40 text-[#382A25] border border-[#EFE3DB] px-7 py-3.5 rounded-full font-semibold text-sm sm:text-base shadow-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span>How It Works</span>
                      <span className="w-6 h-6 rounded-full bg-[#FCE8DD] text-[#D97757] flex items-center justify-center">
                        <Play className="w-3 h-3 ml-0.5 fill-current" />
                      </span>
                    </button>
                  </div>
                </ScrollReveal>

                {/* Social Proof */}
                <ScrollReveal delay={420} direction="up" duration={700}>
                  <div className="mt-8 sm:mt-10">
                    <p className="text-xs sm:text-sm text-[#81736C] font-medium leading-relaxed">
                      <span className="text-[#382A25] font-semibold">Trusted by 1000+ employers</span>{" "}
                      and millions of job seekers worldwide.
                    </p>
                  </div>
                </ScrollReveal>
              </div>

          {/* Right Column - Candidate with Glowing Tech Circle and 3 Floating Cards */}
          <div className="lg:col-span-6 xl:col-span-6 relative flex justify-center items-center">
            {/* Glowing Tech Radar / Orbit Halo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] rounded-full border border-[#D97757]/20 pointer-events-none animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] sm:w-[540px] sm:h-[540px] rounded-full border border-dashed border-[#D97757]/15 pointer-events-none" />

            {/* Candidate Image Container */}
            <div className="relative z-10 w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[450px]">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#EFE3DB] bg-white aspect-[4/3] sm:aspect-[4/3.2]">
                <img
                  src="/hero-candidate.jpg"
                  alt="Young candidate holding laptop"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* 3 Floating Badges matching the reference */}
            <div className="absolute -right-2 sm:-right-4 lg:-right-6 top-6 sm:top-8 z-20 flex flex-col gap-3.5 sm:gap-4 max-w-[210px] sm:max-w-[240px]">
              {/* Card 1 - Fast & Secure */}
              <ScrollReveal delay={200} direction="left">
                <div
                  className="bg-white text-[#382A25] rounded-2xl p-2.5 sm:p-3 shadow-lg hover:shadow-2xl border border-[#EFE3DB] flex items-center gap-3 backdrop-blur-md animate-float cursor-pointer hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: "0s" }}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FCE8DD] text-[#D97757] flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-[#D97757]" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#382A25] leading-tight">Fast &amp; Secure</p>
                    <p className="text-[10px] sm:text-[11px] text-[#81736C] mt-0.5 leading-tight">Quick turnaround you can rely on</p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Card 2 - Trusted by */}
              <ScrollReveal delay={350} direction="left">
                <div
                  className="bg-white text-[#382A25] rounded-2xl p-2.5 sm:p-3 shadow-lg hover:shadow-2xl border border-[#EFE3DB] flex items-center gap-3 backdrop-blur-md animate-float-delayed cursor-pointer hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: "1.2s" }}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#DCFCE7] text-[#15803D] flex items-center justify-center flex-shrink-0 shadow-xs">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#15803D]" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#382A25] leading-tight">Trusted by</p>
                    <p className="text-[10px] sm:text-[11px] text-[#81736C] mt-0.5 leading-tight">Top Employers globally</p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Card 3 - Your Privacy */}
              <ScrollReveal delay={500} direction="left">
                <div
                  className="bg-white text-[#382A25] rounded-2xl p-2.5 sm:p-3 shadow-lg hover:shadow-2xl border border-[#EFE3DB] flex items-center gap-3 backdrop-blur-md animate-float-slow cursor-pointer hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: "2.4s" }}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FCE8DD] text-[#D97757] flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-[#D97757]" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#382A25] leading-tight">Your Privacy</p>
                    <p className="text-[10px] sm:text-[11px] text-[#81736C] mt-0.5 leading-tight">Always Protected</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>

          </div>
        </div>

        {/* Logos Marquee Card - Centered directly in the middle on the bottom border of the Hero section */}
        <ScrollReveal delay={100} direction="up" className="relative z-30 -mt-12 sm:-mt-16 lg:-mt-20 max-w-6xl mx-auto px-2 sm:px-4">
          <div className="marquee-container bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-[#382A25]/8 border border-[#EFE3DB] p-5 sm:p-7 w-full overflow-hidden">
            <p className="text-center text-xs sm:text-sm font-bold text-[#382A25] tracking-tight mb-5">
              Powering Confident Hiring Decisions for Top Companies
            </p>

            <div className="relative overflow-hidden w-full py-1.5">
              {/* Left and Right Smooth Fade Edge Masks */}
              <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

              {/* Scrolling track moving from left to right, looping seamlessly, pauses on hover */}
              <div className="flex w-max items-center animate-marquee-ltr hover:[animation-play-state:paused]">
                {/* 4 duplicates with dividers matching the reference image */}
                {[...heroCompanies, ...heroCompanies, ...heroCompanies, ...heroCompanies].map((company, index) => (
                  <div
                    key={`${company.id}-${index}`}
                    className="flex-shrink-0 flex items-center"
                  >
                    <div className="px-6 sm:px-9 flex items-center justify-center transition-transform hover:scale-105 duration-200 cursor-pointer">
                      {company.node}
                    </div>
                    {/* Subtle vertical divider between logos matching reference */}
                    <div className="h-6 w-px bg-[#EFE3DB] shrink-0" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 w-10 h-10 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/20 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="bg-slate-900 border border-slate-800 overflow-hidden rounded-2xl shadow-2xl aspect-video flex items-center justify-center">
              <video
                className="w-full h-full object-cover"
                src="/videos/demo.mp4"
                controls
                autoPlay
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
