"use client";

import React, { useState, useEffect, useRef } from "react";
import { Shield, Zap, Lock, Sparkles, Globe, BarChart3, Users, Brain, FileCheck, Clock, Video, Eye, Bot, FileText, Code2, CheckCircle2 } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const cardVectors = [
  // Top row (Row 0): pulled inward towards the center
  { dx: 60, dy: 45, rotate: -2, delay: 0 },      // Card 0: Top-Left
  { dx: 0, dy: 50, rotate: 0, delay: 80 },       // Card 1: Top-Center
  { dx: -60, dy: 45, rotate: 2, delay: 160 },     // Card 2: Top-Right
  // Bottom row (Row 1): pulled inward towards the center
  { dx: 60, dy: -45, rotate: -1.5, delay: 240 },  // Card 3: Bottom-Left
  { dx: 0, dy: -50, rotate: 0, delay: 320 },     // Card 4: Bottom-Center
  { dx: -60, dy: -45, rotate: 1.5, delay: 400 },  // Card 5: Bottom-Right
];

const features = [
  {
    icon: Video,
    title: "Autonomous Voice & Video AI Interviews",
    description: "Conduct real-time, dynamic interviews powered by OpenAI and Deepgram speech recognition. Questions adapt automatically based on candidate answers.",
    color: "var(--primary)",
    metric: "Real-Time",
    metricLabel: "Speech & Video",
  },
  {
    icon: Eye,
    title: "MediaPipe Anti-Cheating Proctoring",
    description: "On-device computer vision tracks gaze direction, head pose angles, looking away, and multiple faces to guarantee complete interview integrity.",
    color: "var(--secondary)",
    metric: "99.7%",
    metricLabel: "Integrity Rate",
  },
  {
    icon: CheckCircle2,
    title: "Automated Evaluation & Scorecards",
    description: "Generates comprehensive scorecards with per-question rubric grades, strengths, weaknesses, and clear Hire / Consider / Pass recommendations.",
    color: "var(--success)",
    metric: "15 min",
    metricLabel: "Turnaround",
  },
  {
    icon: FileText,
    title: "Semantic Resume & Skill Parsing",
    description: "Extract candidate tech stacks, work history, seniority level, and calculate ATS job-fit alignment instantly from PDF and DOCX files.",
    color: "var(--primary)",
    metric: "98%",
    metricLabel: "Parsing Match",
  },
  {
    icon: Code2,
    title: "Integrated Coding Assessments",
    description: "Built-in Monaco code editor supporting multi-language technical challenges with automated unit test runner and anti-plagiarism guardrails.",
    color: "var(--primary)",
    metric: "20+",
    metricLabel: "Languages",
  },
  {
    icon: BarChart3,
    title: "Recruiter Intelligence & Pipeline",
    description: "Centralized recruiter dashboard with interview video playback, synchronized transcripts, proctoring incident audits, and automated reminders.",
    color: "var(--primary)",
    metric: "85%",
    metricLabel: "Time Saved",
  },
];

const capabilities = [
  { icon: Video, label: "Live AI Video Interview" },
  { icon: Eye, label: "MediaPipe Proctoring" },
  { icon: FileText, label: "Resume Skill Parsing" },
  { icon: Code2, label: "Coding Assessment" },
  { icon: CheckCircle2, label: "Automated Scorecards" },
  { icon: Shield, label: "GDPR & Incident Audit" },
];

export default function Features() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsExpanded(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When scrolling in: expand outward to respective places
        // When scrolling out: re-compress inward so it can expand again when scrolling in
        if (entry.isIntersecting) {
          setIsExpanded(true);
        } else {
          setIsExpanded(false);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);

    // Initial check in case already scrolled into view on load
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      requestAnimationFrame(() => setIsExpanded(true));
    }

    return () => observer.disconnect();
  }, []);

  const getCardStyle = (index: number) => {
    const vector = cardVectors[index];
    const dx = isMobile ? 0 : vector.dx;
    const dy = isMobile ? (index < 3 ? 35 : -35) : vector.dy;
    const rotate = isMobile ? 0 : vector.rotate;

    if (!isExpanded) {
      return {
        transform: `translate3d(${dx}px, ${dy}px, 0) scale(0.82) rotate(${rotate}deg)`,
        opacity: 0.2,
        filter: "blur(3px)",
        transition: "transform 450ms ease-in, opacity 400ms ease-in, filter 400ms ease-in",
        willChange: "transform, opacity, filter" as const,
      };
    }

    return {
      transform: "translate3d(0, 0, 0) scale(1) rotate(0deg)",
      opacity: 1,
      filter: "blur(0px)",
      transition: `transform 750ms cubic-bezier(0.34, 1.42, 0.64, 1) ${vector.delay}ms, opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) ${vector.delay}ms, filter 550ms ease ${vector.delay}ms`,
      willChange: "transform, opacity, filter" as const,
    };
  };

  return (
    <section className="py-28 bg-background relative overflow-hidden w-full">
      {/* Background matching Testimonials and CTA sections */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute top-1/4 right-0 w-[550px] h-[550px] bg-primary/[0.02] rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-0 w-[550px] h-[550px] bg-secondary/[0.015] rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full overflow-hidden">
        {/* Section header matching Testimonials/Pricing */}
        <ScrollReveal delay={50} direction="up" className="max-w-2xl mx-auto text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-surface border border-border shadow-xs">
            <Sparkles className="w-4 h-4 text-[#D97757]" />
            <span className="text-sm text-muted-foreground font-medium">Why top engineering teams choose HireRight AI</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight text-foreground">
            Built to screen and <br />
            <span className="bg-gradient-to-r from-[#D97757] via-[#C86544] to-[#B95F42] bg-clip-text text-transparent">
              hire talent at scale
            </span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed font-normal">
            Eliminate hours of manual phone screens and unproctored quizzes. HireRight combines autonomous AI interviewing with military-grade proctoring.
          </p>
        </ScrollReveal>

        {/* Features grid with compress-and-expand scroll animation & hover matter expansion */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => {
            const isHovered = hoveredCard === index;

            return (
              <div
                key={feature.title}
                style={getCardStyle(index)}
                className="h-full"
              >
                <div
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`group h-[235px] sm:h-[245px] rounded-2xl sm:rounded-3xl p-6 sm:p-7 transition-all duration-400 relative overflow-hidden flex flex-col justify-between cursor-pointer border ${
                    isHovered
                      ? "bg-surface-elevated border-primary/30 shadow-xl shadow-primary/5 -translate-y-1"
                      : "bg-surface border-border shadow-sm hover:border-primary/20 hover:shadow-md"
                  }`}
                >
                  {/* Subtle top accent line on hover */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-400 bg-gradient-to-r from-transparent via-[#D97757] to-transparent" />

                  {/* Top Row: Icon Badge + Metric Tag */}
                  <div className="flex items-start justify-between w-full relative z-10">
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      {/* Icon Badge */}
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#FCE8DD] text-[#D97757] border border-[#D97757]/20 flex items-center justify-center shadow-xs flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                        <feature.icon className="w-5 h-5 text-[#D97757]" />
                      </div>

                      {/* When Hovered: Head Text moves to the Top Row beside Icon (Image 3) */}
                      <div
                        className={`transition-all duration-300 overflow-hidden ${
                          isHovered
                            ? "opacity-100 max-w-[210px] sm:max-w-[240px] translate-x-0"
                            : "opacity-0 max-w-0 -translate-x-3 pointer-events-none"
                        }`}
                      >
                        <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-[#D97757] leading-tight line-clamp-2 transition-colors">
                          {feature.title}
                        </h3>
                      </div>
                    </div>

                    {/* Metric Tag Badge */}
                    <div className="text-right flex-shrink-0 ml-2">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-surface border border-border text-xs font-bold text-[#D97757] tracking-tight shadow-xs">
                        {feature.metric}
                      </span>
                    </div>
                  </div>

                  {/* Middle Area: The Matter / Description (Reveals when Hovered - Image 3) */}
                  <div
                    className={`transition-all duration-300 my-auto relative z-10 ${
                      isHovered
                        ? "opacity-100 max-h-[140px] translate-y-0"
                        : "opacity-0 max-h-0 -translate-y-2 pointer-events-none overflow-hidden"
                    }`}
                  >
                    <div className="feature-matter-scroll max-h-[125px] overflow-y-auto pr-1 text-sm text-muted-foreground leading-relaxed font-normal">
                      {feature.description}
                    </div>
                  </div>

                  {/* Bottom Area: Head Text when NOT Hovered (Image 2 style) */}
                  <div
                    className={`transition-all duration-300 relative z-10 ${
                      isHovered
                        ? "opacity-0 max-h-0 pointer-events-none overflow-hidden -translate-y-2"
                        : "opacity-100 max-h-16 translate-y-0"
                    }`}
                  >
                    <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight leading-snug group-hover:text-[#D97757] transition-colors">
                      {feature.title}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Capabilities bar matching Testimonials stats styling */}
        <ScrollReveal delay={100} direction="up">
          <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-foreground mb-2">Complete Autonomous Hiring Engine</h3>
              <p className="text-sm text-muted-foreground">Everything your talent team needs from application to final offer</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {capabilities.map((cap, i) => (
                <ScrollReveal key={cap.label} delay={i * 50} direction="scale">
                  <div className="flex flex-col items-center gap-3 p-4 bg-background border border-border rounded-xl hover:border-[#D97757]/30 hover:bg-surface-elevated transition-all duration-300 group shadow-xs hover:shadow-md hover:-translate-y-0.5">
                    <div className="w-10 h-10 bg-[#FCE8DD] rounded-lg flex items-center justify-center group-hover:bg-[#FCE8DD]/80 transition-colors">
                      <cap.icon className="w-5 h-5 text-[#D97757]" />
                    </div>
                    <span className="text-xs text-muted-foreground group-hover:text-foreground text-center font-medium transition-colors">{cap.label}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
