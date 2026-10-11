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
    <footer
      className="relative text-[#E0D2CB] border-t border-[#D97757]/30 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 85% 65% at 5% 0%, rgba(217, 119, 87, 0.32) 0%, rgba(98, 60, 50, 0.45) 38%, transparent 75%),
          radial-gradient(circle at 92% 90%, rgba(185, 95, 66, 0.15) 0%, transparent 60%),
          linear-gradient(135deg, #442E26 0%, #36241E 30%, #271915 70%, #1A100E 100%)
        `,
      }}
    >
      {/* Top Warm Terracotta & Amber Shine Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E88C6F]/70 to-transparent pointer-events-none" />

      {/* Luminous Warm Shine Glow radiating from top-left */}
      <div
        className="absolute -top-32 -left-20 w-[560px] h-[440px] rounded-full pointer-events-none blur-3xl opacity-40"
        style={{
          background: "radial-gradient(circle, rgba(235, 140, 105, 0.4) 0%, rgba(140, 75, 55, 0.22) 50%, transparent 75%)",
        }}
      />
      <div
        className="absolute -bottom-24 right-1/4 w-96 h-96 rounded-full pointer-events-none blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(217, 119, 87, 0.25) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 relative z-10 w-full">
        {/* Main Desktop Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Brand & Trust Badges (4 columns) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <Link href="/" className="inline-flex items-center gap-2.5 mb-2.5 group">
                <div className="w-8 h-8 bg-gradient-to-br from-[#D97757] to-[#B95F42] rounded-lg flex items-center justify-center shadow-xs shadow-[#D97757]/30 group-hover:scale-105 transition-transform duration-200">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold text-white tracking-tight">HireRight</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#D97757]/25 text-[#FFB096] border border-[#D97757]/40">
                    AI
                  </span>
                </div>
              </Link>
              <p className="text-xs sm:text-[13px] text-[#CBB9B0] leading-relaxed max-w-sm mb-3.5">
                Autonomous AI video interviews, MediaPipe gaze anti-cheating proctoring, and intelligent screening for high-performing teams.
              </p>

              {/* Compact Contact Chips */}
              <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-xs text-[#CBB9B0] mb-3.5">
                <a
                  href="mailto:care@hireright.com"
                  className="inline-flex items-center gap-1.5 hover:text-[#FFA482] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#E88C6F]" />
                  <span>care@hireright.com</span>
                </a>
                <span className="text-white/20 hidden sm:inline">•</span>
                <a
                  href="tel:+18885554473"
                  className="inline-flex items-center gap-1.5 hover:text-[#FFA482] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#E88C6F]" />
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
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.06] border border-white/10 rounded-md shadow-2xs backdrop-blur-xs"
                >
                  <badge.icon className="w-3 h-3 text-[#34D399]" />
                  <span className="text-[10.5px] font-medium text-[#F2E7E1]">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Single-Row Navigation Columns (8 columns: 4 aligned columns) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {Object.entries(footerNavigation).map(([title, links]) => (
              <div key={title} className="flex flex-col">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFF1EB] mb-3">
                  {title}
                </h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-xs sm:text-[13px] text-[#C4B2AA] hover:text-[#FFA482] transition-colors duration-150 block py-0.5"
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
        <div className="border-t border-white/10 mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#A8968E]">
          <p>© 2026 HireRight AI. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            <Link href="/privacy" className="hover:text-[#FFA482] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#FFA482] transition-colors">
              Terms of Service
            </Link>
            <Link href="/dpa" className="hover:text-[#FFA482] transition-colors">
              Data Processing (DPA)
            </Link>
            <Link href="/settings" className="hover:text-[#FFA482] transition-colors">
              GDPR Compliance
            </Link>
            <Link href="/enterprise" className="hover:text-[#FFA482] transition-colors">
              Security Standards
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
