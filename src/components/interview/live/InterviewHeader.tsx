import { Clock, ShieldCheck, ShieldAlert } from "lucide-react";
import type { InterviewHeaderProps } from "./types";

export default function InterviewHeader({
  elapsedTime,
  proctorStatus,
  proctorLoading,
  formatTime,
}: InterviewHeaderProps) {
  return (
    <header className="bg-[#181310] px-4 sm:px-6 py-2.5 shadow-md shrink-0 w-full">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-1.5">
            <img src="/logo.png" alt="HireRight" className="h-6 w-auto rounded drop-shadow-md" />
          </div>
          <span className="px-2.5 py-0.5 bg-[#D97757]/15 text-[#FCE8DD] text-xs font-bold rounded-full">
            AI Live Studio
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[#E8DDD7] bg-[#241C17] px-3 py-1 rounded-full text-xs">
            <Clock className="w-3.5 h-3.5 text-[#D97757]" />
            <span className="font-mono font-bold text-white">{formatTime(elapsedTime)}</span>
          </div>
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              proctorStatus.state === "violating"
                ? "bg-red-600 text-white animate-pulse"
                : proctorStatus.state === "ok"
                ? "bg-emerald-950/40 text-emerald-300"
                : proctorLoading
                ? "bg-amber-950/40 text-amber-300"
                : "bg-[#241C17] text-[#A89890]"
            }`}
            title={proctorStatus.state === "violating" ? (proctorStatus.detail || "Malpractice detected") : "Anti-cheating monitor"}
          >
            {proctorStatus.state === "violating" ? (
              <ShieldAlert className="w-3.5 h-3.5" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5" />
            )}
            {proctorStatus.state === "violating"
              ? "Alert"
              : proctorStatus.state === "ok"
              ? "Monitoring"
              : proctorLoading
              ? "Starting monitor..."
              : "Monitor off"}
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-[#A89890] font-mono">15:00</span>
            <div className="w-24 h-2 bg-[#241C17] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D97757] to-[#B95F42] transition-all"
                style={{ width: `${Math.min((elapsedTime / 900) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
