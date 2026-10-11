"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus_Jakarta_Sans } from "next/font/google";
import {
  Eye,
  EyeOff,
  AlertCircle,
  AlertTriangle,
  Loader2,
  KeyRound,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

/**
 * 3D Particle Canvas Globe (Inspired by HackerRank's interactive world globe)
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

    const pointCount = 650;
    const radius = Math.min(width, height) * 0.44;
    const points: { x: number; y: number; z: number }[] = [];

    // Fibonacci sphere distribution for uniform spherical coverage
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
    const tilt = 0.28;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      rotationAngle += 0.0025;
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

      // Draw subtle constellation lines between nearby front-facing points
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i += 3) {
        const p1 = projected[i];
        if (p1.pz < -radius * 0.15) continue;
        for (let j = i + 1; j < Math.min(i + 14, projected.length); j++) {
          const p2 = projected[j];
          if (p2.pz < -radius * 0.15) continue;
          const dx = p1.px - p2.px;
          const dy = p1.py - p2.py;
          const distSq = dx * dx + dy * dy;
          if (distSq < 1300) {
            const lineAlpha = (1 - distSq / 1300) * 0.14 * p1.alpha;
            ctx.strokeStyle = `rgba(148, 163, 184, ${lineAlpha})`;
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
        const dotSize = isFront ? 1.35 : 0.8;
        ctx.fillStyle = isFront
          ? `rgba(226, 232, 240, ${p.alpha * 0.85})`
          : `rgba(71, 85, 105, ${p.alpha * 0.35})`;
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
      className="absolute inset-0 w-full h-full pointer-events-none opacity-85"
      aria-hidden="true"
    />
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { login, organization } = useAuth();
  const [email, setEmail] = useState("candidate@techcitta.com");
  const [password, setPassword] = useState("candidate123");
  const [rememberMe, setRememberMe] = useState(true);
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [twoFactorSetupRequired, setTwoFactorSetupRequired] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, twoFactorToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.twoFactorRequired) setTwoFactorRequired(true);
        if (data.twoFactorSetupRequired) setTwoFactorSetupRequired(true);
        throw new Error(data.error || "Login failed");
      }

      login(data.token, data.user, data.organization);

      if (data.user.role === "employer" || data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/profile");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const companyName = organization?.name || "Techcitta";
  const productName = "HireRight";

  return (
    <div className={`min-h-screen w-full flex flex-col md:flex-row bg-[#2A201B] ${plusJakarta.className}`}>
      {/* ============================================================
          LEFT SIDE: Dark Cocoa Immersive Particle Globe
         ============================================================ */}
      <div className="md:w-1/2 lg:w-[52%] relative bg-[#2A201B] text-white flex flex-col justify-between p-8 sm:p-12 lg:p-16 min-h-[460px] md:min-h-screen overflow-hidden border-b md:border-b-0 md:border-r border-[#3D302A]">
        {/* Animated 3D Digital Particle Globe */}
        <ParticleGlobe />

        {/* Ambient Radial Vignette */}
        <div
          className="absolute inset-0 bg-radial-[circle_at_center,transparent_0%,rgba(42,32,27,0.85)_85%] pointer-events-none"
          aria-hidden="true"
        />

        {/* TOP LEFT: Brand Logo & Product Tag */}
        <div className="relative z-10 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D97757] to-[#B95F42] text-white flex items-center justify-center shadow-lg shadow-[#D97757]/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold text-xl tracking-tight leading-tight">
                  {productName}
                </span>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-[#FCE8DD]/20 text-[#FCE8DD] border border-[#D97757]/40">
                  AI
                </span>
              </div>
              <span className="text-[#B5A59E] text-xs font-medium tracking-wide block">
                by {companyName} Enterprise
              </span>
            </div>
          </Link>
        </div>

        {/* CENTER: Hero Statement */}
        <div className="relative z-10 my-auto py-8 lg:py-12">
          <div className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.08] select-none">
            <span className="block text-white drop-shadow-sm">Hire with</span>
            <span className="block text-white drop-shadow-sm">confidence.</span>
            <span className="block mt-1.5 sm:mt-2 text-[#D97757]">Verify with</span>
            <span className="block bg-gradient-to-r from-[#FCE8DD] via-[#D97757] to-[#B95F42] bg-clip-text text-transparent">
              certainty.
            </span>
          </div>
        </div>

        {/* BOTTOM LEFT: Community Headline */}
        <div className="relative z-10 mt-auto pt-16">
          <p className="text-[#B5A59E] text-sm font-medium tracking-wide">
            Welcome to
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-white tracking-tight mt-1 mb-3 leading-tight">
            {companyName} Community
          </h2>
          <p className="text-[#B5A59E] text-xs sm:text-sm leading-relaxed max-w-md">
            Home to verified talent and automated background screening worldwide.
            Hire with confidence, verify with certainty.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D97757] hover:text-[#B95F42] mt-4 transition-colors group"
          >
            <span>Know more</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* ============================================================
          RIGHT SIDE: Pure Clean Light Login Form
         ============================================================ */}
      <div className="md:w-1/2 lg:w-[48%] bg-white flex items-center justify-center p-6 sm:p-10 lg:p-16 min-h-screen">
        <div className="w-full max-w-[390px] mx-auto">
          {/* Header */}
          <div className="mb-7">
            <h1 className="text-2xl sm:text-[26px] font-bold text-[#382A25] tracking-tight leading-snug">
              Welcome back!
            </h1>
            <h2 className="text-xl sm:text-[22px] font-bold text-[#382A25] tracking-tight leading-snug mt-0.5">
              Login to your account
            </h2>
            <p className="text-xs text-[#81736C] mt-2 font-medium">
              Sign in to access your Job Seeker Portal &amp; AI Interviews
            </p>
          </div>


          {/* Error Banner */}
          {error && (
            <div
              className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-[#B91C1C] text-xs flex items-start gap-2.5"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 text-[#B91C1C] shrink-0 mt-0.5" />
              <div className="leading-normal font-medium">{error}</div>
            </div>
          )}

          {/* 2FA Setup Notice */}
          {twoFactorSetupRequired && (
            <div
              className="mb-5 p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-[#B45309] text-xs flex items-start gap-2.5"
              role="status"
            >
              <AlertTriangle className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">2FA Setup Required</strong>
                <p className="text-amber-800 mt-0.5">
                  Two-factor authentication is required for your account.{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/settings")}
                    className="underline text-[#382A25] font-semibold cursor-pointer"
                  >
                    Set up 2FA now
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Main Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate={false}>
            {/* Username / Email Field */}
            <div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your username or email"
                required
                className="w-full px-4 py-3 bg-white border border-[#EFE3DB] rounded-lg text-[#382A25] placeholder:text-[#81736C]/60 text-xs sm:text-sm focus:outline-none focus:border-[#D97757] focus:ring-1 focus:ring-[#D97757] transition-colors"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                className="w-full pl-4 pr-11 py-3 bg-white border border-[#EFE3DB] rounded-lg text-[#382A25] placeholder:text-[#81736C]/60 text-xs sm:text-sm focus:outline-none focus:border-[#D97757] focus:ring-1 focus:ring-[#D97757] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#81736C] hover:text-[#382A25] focus:outline-none cursor-pointer transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Two-Factor Authentication (conditional) */}
            {twoFactorRequired && (
              <div className="p-3.5 rounded-lg bg-[#FFF9F5] border border-[#EFE3DB] space-y-2">
                <div className="flex items-center gap-2 text-[#382A25] text-xs font-semibold">
                  <KeyRound className="w-4 h-4 text-[#15803D]" />
                  <label htmlFor="twoFactorToken">Authentication Code</label>
                </div>
                <input
                  id="twoFactorToken"
                  name="one-time-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={twoFactorToken}
                  onChange={(e) =>
                    setTwoFactorToken(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  required
                  className="w-full py-2.5 px-3 bg-white border border-[#EFE3DB] rounded-lg text-[#382A25] text-center font-mono text-base tracking-[0.3em] focus:outline-none focus:border-[#D97757] focus:ring-1 focus:ring-[#D97757] transition-colors"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                email && password
                  ? "bg-[#D97757] hover:bg-[#B95F42] text-white shadow-md shadow-[#D97757]/20"
                  : "bg-[#EFE3DB] text-[#81736C] hover:bg-[#D97757] hover:text-white"
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Log In</span>
              )}
            </button>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 text-[#382A25] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[#D97757] border-[#EFE3DB] focus:ring-[#D97757] cursor-pointer accent-[#D97757]"
                />
                <span className="text-[#81736C] text-xs">Remember me</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-xs text-[#D97757] hover:text-[#B95F42] font-semibold hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </form>

          {/* "or" Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#EFE3DB]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-[#81736C] font-medium text-[11px]">or</span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="space-y-2.5">
            {/* Continue with Google */}
            <button
              type="button"
              onClick={() => {
                window.location.href = "/api/auth/sso?provider=google";
              }}
              className="w-full py-2.5 px-4 bg-white border border-[#EFE3DB] hover:bg-[#FFF9F5] hover:border-[#D97757]/40 rounded-lg text-[#382A25] text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* LinkedIn & GitHub row */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/api/auth/sso?provider=linkedin";
                }}
                className="py-2.5 px-3 bg-white border border-[#EFE3DB] hover:bg-[#FFF9F5] hover:border-[#D97757]/40 rounded-lg text-[#382A25] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 fill-[#0A66C2]" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.45 1.45 0 1 0 0-2.9 1.45 1.45 0 0 0 0 2.9m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                </svg>
                <span>LinkedIn</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  window.location.href = "/api/auth/sso?provider=github";
                }}
                className="py-2.5 px-3 bg-white border border-[#EFE3DB] hover:bg-[#FFF9F5] hover:border-[#D97757]/40 rounded-lg text-[#382A25] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 fill-[#382A25]" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>GitHub</span>
              </button>
            </div>
          </div>

          {/* Sign up link */}
          <div className="mt-8 text-center text-xs text-[#81736C]">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-[#D97757] hover:text-[#B95F42] font-bold hover:underline transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
