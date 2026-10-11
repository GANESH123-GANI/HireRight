"use client";

import { Star, Quote, ArrowRight, TrendingUp, Clock, Users, Building2 } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "VP of Talent Acquisition",
    company: "Global Tech Enterprise",
    companyLogo: "GT",
    quote: "HireRight AI transformed our engineering hiring pipeline. The autonomous video interviews and MediaPipe gaze tracking eliminated proxy test-takers and delivered pre-evaluated, high-signal talent in minutes.",
    metrics: { metric: "75%", label: "Faster hiring" },
    rating: 5,
  },
  {
    name: "Michael Torres",
    role: "Head of Engineering Recruiting",
    company: "Fintech Cloud Systems",
    companyLogo: "FC",
    quote: "Conducting 400+ technical screens every month was burning out our senior engineers. HireRight's AI interviewer and Monaco code runner handle round 1 flawlessly with zero scheduling friction.",
    metrics: { metric: "85%", label: "Engineering hours saved" },
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Chief People Officer",
    company: "Scale-up SaaS Network",
    companyLogo: "SN",
    quote: "Compliance and academic integrity were our top priorities. MediaPipe proctoring detected suspicious tab switching and multiple faces effortlessly, giving us an audit-ready hiring pipeline.",
    metrics: { metric: "100%", label: "Verified integrity" },
    rating: 5,
  },
];

const stats = [
  { value: "50,000+", label: "AI Interviews Conducted", icon: Users },
  { value: "99.7%", label: "Proctoring Integrity Accuracy", icon: TrendingUp },
  { value: "15 min", label: "Average Evaluation Turnaround", icon: Clock },
  { value: "1,200+", label: "Enterprise Teams", icon: Building2 },
];

export default function Testimonials() {
  return (
    <section className="py-28 bg-background relative overflow-hidden w-full">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-secondary/[0.015] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full overflow-hidden">
        {/* Header */}
        <ScrollReveal delay={50} direction="up" className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-surface border border-border">
            <Star className="w-4 h-4 text-[#D97757]" />
            <span className="text-sm text-muted-foreground font-medium">Trusted by industry leaders</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
            <span className="text-foreground">See what our</span>
            <br />
            <span className="bg-gradient-to-r from-[#D97757] to-[#B95F42] bg-clip-text text-transparent">enterprise clients</span>
            <span className="text-foreground"> say</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Real results from organizations that transformed their hiring with HireRight AI.
          </p>
        </ScrollReveal>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal
              key={testimonial.name}
              delay={index * 100}
              direction="up"
            >
              <div className="h-full bg-surface border border-border rounded-2xl p-7 relative group hover:border-primary/20 transition-all duration-500">
                {/* Quote icon */}
                <Quote className="absolute top-6 right-6 w-8 h-8 text-border group-hover:text-primary/10 transition-colors duration-500" />

                {/* Stars */}
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-warning fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-muted-foreground text-sm leading-[1.8] mb-6 relative">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Metric highlight */}
                <div className="flex items-center gap-3 p-4 bg-surface border border-border rounded-xl mb-6">
                  <p className="text-3xl font-bold text-[#D97757]">{testimonial.metrics.metric}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.metrics.label}</p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FCE8DD] rounded-xl flex items-center justify-center text-sm font-bold text-[#D97757] border border-[#D97757]/20">
                    {testimonial.companyLogo}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-[#D97757]">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Stats bar */}
        <ScrollReveal delay={120} direction="up">
          <div className="bg-surface border border-border rounded-2xl p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <ScrollReveal key={stat.label} delay={i * 60} direction="scale">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
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
