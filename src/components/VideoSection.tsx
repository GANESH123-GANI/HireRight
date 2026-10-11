"use client";

import { useState } from "react";
import { Play, X, CheckCircle } from "lucide-react";

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const benefits = [
    "AI-powered job matching",
    "15-minute video interviews",
    "Instant background verification",
    "Real-time progress tracking",
  ];

  return (
    <section className="py-24 bg-[#FFF9F5] relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-[10%] w-[400px] h-[400px] bg-[#FCE8DD]/40 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block px-4 py-1.5 bg-[#FCE8DD] border border-[#EFE3DB] rounded-full text-xs font-semibold mb-4 text-[#D97757]">
              See It In Action
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-[#382A25]">
              See How <span className="text-[#D97757]">Techcitta</span> Works
            </h2>
            <p className="text-[#81736C] mb-8 text-lg leading-relaxed">
              Watch how our AI-powered platform connects you with the right opportunities in just a few simple steps.
            </p>
            <div className="space-y-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#15803D]" />
                  <span className="text-[#382A25] text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden bg-white border border-[#EFE3DB] aspect-video shadow-[0_8px_30px_rgb(56,42,37,0.06)]">
              {!isPlaying ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FCE8DD]/60 to-[#FFF9F5] flex items-center justify-center">
                    <div className="text-center">
                      <div className="mb-6">
                        <svg className="w-20 h-20 mx-auto opacity-80" viewBox="0 0 100 100" fill="none">
                          <circle cx="50" cy="50" r="48" stroke="#D97757" strokeWidth="2" opacity="0.4" />
                          <path d="M40 30 L70 50 L40 70 Z" fill="#D97757" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-[#382A25] mb-2">Techcitta Demo</h3>
                      <p className="text-[#81736C]">Watch how it works in 60 seconds</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center group"
                  >
                    <div className="w-20 h-20 bg-white/90 backdrop-blur-sm border border-[#EFE3DB] rounded-full flex items-center justify-center group-hover:scale-110 group-hover:border-[#D97757] transition-all duration-300 shadow-md">
                      <Play className="w-8 h-8 text-[#D97757] ml-1 fill-[#D97757]" />
                    </div>
                  </button>
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#D97757]/30 rounded-tl-lg" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#D97757]/30 rounded-tr-lg" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#D97757]/30 rounded-bl-lg" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#D97757]/30 rounded-br-lg" />
                </>
              ) : videoError ? (
                <div className="absolute inset-0 bg-[#FFF9F5] flex flex-col items-center justify-center p-6 text-center">
                  <h3 className="text-xl font-bold text-[#382A25] mb-2">Demo video unavailable</h3>
                  <p className="text-[#81736C] text-sm">Please try again later.</p>
                </div>
              ) : (
                <>
                  <video
                    className="absolute inset-0 w-full h-full object-cover"
                    src="/videos/demo.mp4"
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    onError={() => setVideoError(true)}
                  />
                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      setVideoError(false);
                    }}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors duration-200 z-10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
