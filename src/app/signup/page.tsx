"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus_Jakarta_Sans } from "next/font/google";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Phone,
  Briefcase,
  Building2,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Sparkles,
  Zap,
  Award,
  Video,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

/**
 * Animated 3D Digital Particle Globe with crimson & sapphire depth accents
 */
function ParticleGlobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 800);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    const pointCount = 550;
    const radius = Math.min(width, height) * 0.42;
    const points: { x: number; y: number; z: number }[] = [];

    // Fibonacci sphere distribution
    for (let i = 0; i < pointCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / pointCount);
      const theta = Math.sqrt(pointCount * Math.PI) * phi;
      points.push({
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
      });
    }

    let rotationAngle = 0;
    const tilt = 0.26;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      rotationAngle += 0.0022;
      const cosA = Math.cos(rotationAngle);
      const sinA = Math.sin(rotationAngle);
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);

      const cx = width * 0.48;
      const cy = height * 0.48;

      const projected: { px: number; py: number; pz: number; alpha: number }[] = [];

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        // Rotate around Y
        const rx = p.x * cosA - p.z * sinA;
        const rz = p.x * sinA + p.z * cosA;
        // Tilt around X
        const ry = p.y * cosT - rz * sinT;
        const rz2 = p.y * sinT + rz * cosT;

        const fov = 450;
        const scale = fov / (fov + rz2);
        const px = cx + rx * scale;
        const py = cy + ry * scale;
        const alpha = Math.max(0.06, (rz2 + radius) / (2 * radius));

        projected.push({ px, py, pz: rz2, alpha });
      }

      // Constellation lines between nearby front points
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i += 3) {
        const p1 = projected[i];
        if (p1.pz < -radius * 0.15) continue;
        for (let j = i + 1; j < Math.min(i + 10, projected.length); j++) {
          const p2 = projected[j];
          if (p2.pz < -radius * 0.15) continue;
          const dx = p1.px - p2.px;
          const dy = p1.py - p2.py;
          const distSq = dx * dx + dy * dy;
          if (distSq < 1300) {
            const lineAlpha = (1 - distSq / 1300) * 0.15 * p1.alpha;
            ctx.strokeStyle = `rgba(225, 29, 72, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        }
      }

      // Draw points with luminous depth
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const isFront = p.pz > 0;
        const dotSize = isFront ? 1.3 : 0.75;
        ctx.fillStyle = isFront
          ? `rgba(255, 228, 230, ${p.alpha * 0.88})`
          : `rgba(100, 116, 139, ${p.alpha * 0.35})`;
        ctx.beginPath();
        ctx.arc(p.px, p.py, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
      aria-hidden="true"
    />
  );
}

export default function SignupPage() {
  const router = useRouter();
  const { organization } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [orgName, setOrgName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"jobseeker" | "employer">("jobseeker");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, orgName, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      router.push(
        `/verify-email?email=${encodeURIComponent(email)}&verifyUrl=${encodeURIComponent(
          data.verifyUrl || ""
        )}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const companyName = organization?.name || "Techcitta";
  const productName = "HireRight";

  return (
    <div
      className={`h-screen max-h-screen overflow-hidden flex flex-col lg:flex-row bg-[#2A201B] ${plusJakarta.className}`}
    >
      {/* ============================================================
          LEFT SIDE: Dark Cocoa Product Branding & Matter
         ============================================================ */}
      <div className="lg:w-[50%] xl:w-[52%] relative bg-[#2A201B] text-white flex flex-col justify-between p-6 sm:p-8 lg:p-10 xl:p-12 h-full max-h-screen overflow-hidden border-b lg:border-b-0 lg:border-r border-[#3D302A]">
        {/* Animated Digital Particle Globe */}
        <ParticleGlobe />

        {/* Ambient Warm Peach Aurora Glows */}
        <div
          className="absolute -top-32 -left-32 w-80 h-80 bg-[#D97757]/15 rounded-full blur-[100px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 -right-24 w-72 h-72 bg-[#FCE8DD]/10 rounded-full blur-[90px] pointer-events-none"
          aria-hidden="true"
        />

        {/* Radial Dark Vignette */}
        <div
          className="absolute inset-0 bg-radial-[circle_at_center,transparent_0%,rgba(42,32,27,0.85)_80%] pointer-events-none"
          aria-hidden="true"
        />

        {/* TOP: Brand Logo Header */}
        <div className="relative z-10 flex items-center justify-between shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D97757] to-[#B95F42] text-white flex items-center justify-center shadow-md shadow-[#D97757]/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-white font-bold text-lg tracking-tight">
                  {productName}
                </span>
                <span className="text-[9px] font-bold uppercase px-1 py-0.5 rounded bg-[#FCE8DD]/20 text-[#FCE8DD] border border-[#D97757]/40">
                  AI
                </span>
              </div>
              <span className="text-[#B5A59E] text-[11px] font-medium tracking-wide block mt-0.5">
                by {companyName} Enterprise
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-[#B5A59E] hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full"
          >
            <span>Back to site</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* CENTER: Compact Product Title, Matter & 3 Feature Bullets */}
        <div className="relative z-10 my-auto py-4 xl:py-6 shrink-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D97757]/20 text-[#FCE8DD] text-[11px] font-semibold mb-3 shadow-xs">
            <Zap className="w-3 h-3 text-[#D97757]" />
            <span>Autonomous Talent Intelligence &amp; Verification</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-extrabold text-white tracking-tight leading-[1.15]">
            Hire with confidence.{" "}
            <span className="block mt-0.5 bg-gradient-to-r from-[#FCE8DD] via-[#D97757] to-[#B95F42] bg-clip-text text-transparent">
              Verify with AI certainty.
            </span>
          </h1>

          {/* Matter / Description */}
          <p className="text-[#B5A59E] text-xs sm:text-sm leading-relaxed mt-2.5 max-w-lg">
            Screen and evaluate candidates 10x faster with adaptive conversational AI video interviews, real-time MediaPipe anti-cheating, and objective rubric scoring.
          </p>

          {/* 3 Compact Feature Cards - Borderless */}
          <div className="mt-4 space-y-2 max-w-lg">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.04] backdrop-blur-xs">
              <div className="w-7 h-7 rounded-lg bg-[#FCE8DD]/20 text-[#D97757] flex items-center justify-center shrink-0">
                <Video className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xs font-bold text-white leading-tight">Autonomous AI Video Interviews</h2>
                <p className="text-[11px] text-[#B5A59E] leading-tight truncate">
                  Adaptive voice &amp; video interviewer tailors dynamic questions in real-time.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.04] backdrop-blur-xs">
              <div className="w-7 h-7 rounded-lg bg-[#DCFCE7]/20 text-[#15803D] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xs font-bold text-white leading-tight">MediaPipe Anti-Cheating Proctoring</h2>
                <p className="text-[11px] text-[#B5A59E] leading-tight truncate">
                  3D gaze tracking, face posture verification &amp; multi-speaker anomaly detection.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.04] backdrop-blur-xs">
              <div className="w-7 h-7 rounded-lg bg-[#FCE8DD]/20 text-[#D97757] flex items-center justify-center shrink-0">
                <Award className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xs font-bold text-white leading-tight">Objective Rubric &amp; Skill Scoring</h2>
                <p className="text-[11px] text-[#B5A59E] leading-tight truncate">
                  Unbiased benchmarking and instant candidate scorecards with full audit trails.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: Compact Metric Row & Security Tags - Borderless */}
        <div className="relative z-10 pt-3 shrink-0">
          <div className="grid grid-cols-3 gap-2.5 mb-2.5">
            <div className="py-1.5 px-2 rounded-lg bg-white/[0.04] text-center">
              <div className="text-base sm:text-lg font-extrabold text-white">10x</div>
              <div className="text-[10px] text-[#B5A59E]">Faster Hiring</div>
            </div>
            <div className="py-1.5 px-2 rounded-lg bg-white/[0.04] text-center">
              <div className="text-base sm:text-lg font-extrabold text-[#D97757]">99.4%</div>
              <div className="text-[10px] text-[#B5A59E]">Accuracy</div>
            </div>
            <div className="py-1.5 px-2 rounded-lg bg-white/[0.04] text-center">
              <div className="text-base sm:text-lg font-extrabold text-white">50k+</div>
              <div className="text-[10px] text-[#B5A59E]">Interviews</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#B5A59E]">
            <span className="flex items-center gap-1 text-[#D97757]">
              <ShieldCheck className="w-3 h-3" />
              SOC 2 Type II
            </span>
            <span>•</span>
            <span>256-Bit TLS</span>
            <span>•</span>
            <span>GDPR &amp; ISO 27001 Ready</span>
          </div>
        </div>
      </div>

      {/* ============================================================
          RIGHT SIDE: Pure Clean Peach + Cream Sign Up Form
         ============================================================ */}
      <div className="lg:w-[50%] xl:w-[48%] bg-white flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-5 sm:py-6 h-full max-h-screen overflow-y-auto">
        <div className="w-full max-w-[460px] mx-auto">
          {/* Header */}
          <div className="mb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#382A25] tracking-tight leading-snug">
              Create an account
            </h2>
            <p className="text-xs text-[#81736C] mt-0.5 font-medium">
              Join <span className="font-semibold text-[#382A25]">HireRight</span> for verified talent &amp; automated screening
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              className="mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-[#B91C1C] text-xs flex items-start gap-2 animate-in fade-in"
              role="alert"
            >
              <AlertCircle className="w-3.5 h-3.5 text-[#B91C1C] shrink-0 mt-0.5" />
              <div className="leading-snug font-medium text-[11px]">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* User Type Selector */}
            <div>
              <label className="block text-[10px] font-bold text-[#382A25] tracking-wider uppercase mb-1.5">
                I want to join as
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("jobseeker")}
                  className={`py-2 px-3 rounded-lg border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    role === "jobseeker"
                      ? "border-[#D97757] bg-[#FCE8DD] text-[#382A25] ring-2 ring-[#D97757]/20 shadow-xs font-bold"
                      : "border-[#EFE3DB] bg-[#FFF9F5] hover:bg-[#FCE8DD]/40 text-[#81736C] font-semibold"
                  }`}
                >
                  <Briefcase
                    className={`w-3.5 h-3.5 ${
                      role === "jobseeker" ? "text-[#D97757]" : "text-[#81736C]"
                    }`}
                  />
                  <span className="text-xs">Job Seeker</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("employer")}
                  className={`py-2 px-3 rounded-lg border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    role === "employer"
                      ? "border-[#D97757] bg-[#FCE8DD] text-[#382A25] ring-2 ring-[#D97757]/20 shadow-xs font-bold"
                      : "border-[#EFE3DB] bg-[#FFF9F5] hover:bg-[#FCE8DD]/40 text-[#81736C] font-semibold"
                  }`}
                >
                  <Building2
                    className={`w-3.5 h-3.5 ${
                      role === "employer" ? "text-[#D97757]" : "text-[#81736C]"
                    }`}
                  />
                  <span className="text-xs">Employer</span>
                </button>
              </div>
            </div>

            {/* Row 1: Full Name & Email Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-[#382A25] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#81736C]" />
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white hover:bg-[#FFF9F5]/40 focus:bg-white border border-[#EFE3DB] rounded-lg text-[#382A25] placeholder:text-[#81736C]/60 text-xs focus:outline-none focus:border-[#D97757] focus:ring-2 focus:ring-[#D97757]/20 transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#382A25] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#81736C]" />
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white hover:bg-[#FFF9F5]/40 focus:bg-white border border-[#EFE3DB] rounded-lg text-[#382A25] placeholder:text-[#81736C]/60 text-xs focus:outline-none focus:border-[#D97757] focus:ring-2 focus:ring-[#D97757]/20 transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Phone & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-[#382A25] mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#81736C]" />
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white hover:bg-[#FFF9F5]/40 focus:bg-white border border-[#EFE3DB] rounded-lg text-[#382A25] placeholder:text-[#81736C]/60 text-xs focus:outline-none focus:border-[#D97757] focus:ring-2 focus:ring-[#D97757]/20 transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-semibold text-[#382A25]">
                    Company
                  </label>
                  <span className="text-[10px] text-[#81736C] font-medium">Optional</span>
                </div>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#81736C]" />
                  <input
                    type="text"
                    name="organization"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white hover:bg-[#FFF9F5]/40 focus:bg-white border border-[#EFE3DB] rounded-lg text-[#382A25] placeholder:text-[#81736C]/60 text-xs focus:outline-none focus:border-[#D97757] focus:ring-2 focus:ring-[#D97757]/20 transition-all"
                    placeholder="e.g. Acme Corp"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-[#382A25] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#81736C]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white hover:bg-[#FFF9F5]/40 focus:bg-white border border-[#EFE3DB] rounded-lg text-[#382A25] placeholder:text-[#81736C]/60 text-xs focus:outline-none focus:border-[#D97757] focus:ring-2 focus:ring-[#D97757]/20 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#382A25] mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#81736C]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white hover:bg-[#FFF9F5]/40 focus:bg-white border border-[#EFE3DB] rounded-lg text-[#382A25] placeholder:text-[#81736C]/60 text-xs focus:outline-none focus:border-[#D97757] focus:ring-2 focus:ring-[#D97757]/20 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password toggle & strength reminder */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#81736C] hover:text-[#382A25] font-medium flex items-center gap-1.5 cursor-pointer transition-colors text-[11px]"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? "Hide password" : "Show password"}</span>
              </button>
              <span className="text-[10px] text-[#81736C]">Min. 8 characters</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#D97757] via-[#D97757] to-[#B95F42] hover:from-[#B95F42] hover:to-[#a04e33] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#D97757]/25 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span className="drop-shadow-sm">Create Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Existing user link */}
          <div className="mt-3.5 pt-3 border-t border-[#EFE3DB] text-center">
            <p className="text-xs text-[#81736C]">
              Existing user?{" "}
              <Link
                href="/login"
                className="text-[#D97757] hover:text-[#B95F42] font-bold hover:underline transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Security / Trust Badges */}
          <div className="mt-3 flex items-center justify-center gap-3 text-[10px] text-[#81736C] font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#15803D]" />
              256-bit Encrypted
            </span>
            <span className="text-[#EFE3DB]">•</span>
            <span>SOC 2 Type II</span>
            <span className="text-[#EFE3DB]">•</span>
            <span>GDPR Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
