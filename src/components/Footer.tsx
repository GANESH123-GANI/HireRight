import Link from "next/link";
import { Mail, Phone, Sparkles, Shield, Lock, CheckCircle } from "lucide-react";

const footerNavigation = {
  Platform: [
    { name: "AI Video Interview", href: "/interview" },
    { name: "MediaPipe Proctoring", href: "/interview/room" },
    { name: "Resume & Skill Parser", href: "/profile" },
    { name: "Recruiter Dashboard", href: "/admin" },
  ],
  Solutions: [
    { name: "For Enterprises", href: "/enterprise" },
    { name: "Technical Recruiters", href: "/admin" },
    { name: "For Job Seekers", href: "/profile" },
    { name: "Engineering Teams", href: "/enterprise" },
  ],
  Resources: [
    { name: "Pricing Plans", href: "/pricing" },
    { name: "Device Check Room", href: "/interview/room" },
    { name: "Candidate Portal", href: "/profile" },
    { name: "API Documentation", href: "/api-docs" },
  ],
  Company: [
    { name: "About HireRight", href: "/" },
    { name: "Contact & Support", href: "/contact" },
    { name: "Enterprise Sales", href: "/enterprise" },
    { name: "Security & Trust", href: "/enterprise" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-[#060613] text-[#9ca3af] border-t border-white/10 overflow-hidden">
      {/* Top Terracotta Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D97757]/50 to-transparent pointer-events-none" />

      {/* Ambient Dark Aura Orbs */}
      <div className="absolute -top-24 left-1/4 w-80 h-80 rounded-full bg-[#D97757]/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative z-10 w-full">
        {/* Main Single-Row Desktop Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Brand & Trust Badges (4 columns) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <Link href="/" className="inline-flex items-center gap-2.5 mb-2.5 group">
                <div className="w-8 h-8 bg-gradient-to-br from-[#D97757] to-[#B95F42] rounded-lg flex items-center justify-center shadow-xs shadow-[#D97757]/25 group-hover:scale-105 transition-transform duration-200">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold text-white tracking-tight">HireRight</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#D97757]/20 text-[#D97757] border border-[#D97757]/30">AI</span>
                </div>
              </Link>
              <p className="text-xs sm:text-[13px] text-[#9ca3af] leading-relaxed max-w-sm mb-3.5">
                Autonomous AI video interviews, MediaPipe gaze anti-cheating proctoring, and intelligent screening for high-performing teams.
              </p>

              {/* Compact Contact Chips */}
              <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-xs text-[#9ca3af] mb-3.5">
                <a
                  href="mailto:care@hireright.com"
                  className="inline-flex items-center gap-1.5 hover:text-[#D97757] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#D97757]" />
                  <span>care@hireright.com</span>
                </a>
                <span className="text-white/20 hidden sm:inline">•</span>
                <a
                  href="tel:+18885554473"
                  className="inline-flex items-center gap-1.5 hover:text-[#D97757] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D97757]" />
                  <span>+1 (888) 555-HIRE</span>
                </a>
              </div>
            </div>

            {/* Trust Badges in a Compact Pill Row */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {[
                { icon: Shield, label: "SOC 2 Type II" },
                { icon: Lock, label: "GDPR Compliant" },
                { icon: CheckCircle, label: "ISO 27001" },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-md shadow-2xs backdrop-blur-xs"
                >
                  <badge.icon className="w-3 h-3 text-[#15803D]" />
                  <span className="text-[10.5px] font-medium text-gray-200">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Single-Row Navigation Columns (8 columns: 4 aligned columns) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {Object.entries(footerNavigation).map(([title, links]) => (
              <div key={title} className="flex flex-col">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                  {title}
                </h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-xs sm:text-[13px] text-[#9ca3af] hover:text-[#D97757] transition-colors duration-150 block py-0.5"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal in a Balanced Single Row */}
        <div className="border-t border-white/10 mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9ca3af]">
          <p>© 2026 Techcitta. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            <Link href="/privacy" className="hover:text-[#D97757] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#D97757] transition-colors">
              Terms of Service
            </Link>
            <Link href="/dpa" className="hover:text-[#D97757] transition-colors">
              Data Processing (DPA)
            </Link>
            <Link href="/settings" className="hover:text-[#D97757] transition-colors">
              GDPR Compliance
            </Link>
            <Link href="/enterprise" className="hover:text-[#D97757] transition-colors">
              Security Standards
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
