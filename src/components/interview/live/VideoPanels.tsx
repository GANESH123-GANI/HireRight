import { AlertTriangle } from "lucide-react";
import type { VideoPanelsProps } from "./types";

const PROCTOR_MESSAGES: Record<string, string> = {
  look_away: "Malpractice alert: you looked away from the camera!",
  face_hidden: "Malpractice alert: your face is not visible!",
  multiple_faces: "Malpractice alert: multiple people detected in frame!",
  eyes_closed: "Keep your eyes on the screen.",
};

export default function VideoPanels({
  videoEnabled,
  user,
  videoRef,
  interviewStarted,
  interviewEnded,
  showCaptions,
  setShowCaptions,
  isListening,
  liveTranscript,
  isAiSpeaking,
  lastAiMessage,
  proctorStatus,
  proctorWarnings,
  currentDifficulty,
  questionNumber,
}: VideoPanelsProps) {
  return (
    <div className="relative flex-1 min-h-0 w-full h-full rounded-2xl overflow-hidden bg-[#17120F] shadow-2xl shadow-black/60 flex items-center justify-center">
      {/* Candidate Video */}
      {videoEnabled ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#1F1814] to-[#140F0D] text-[#FFF9F5] p-6">
          <div className="w-24 h-24 rounded-full bg-[#241C17] flex items-center justify-center text-3xl font-bold text-[#FCE8DD] shadow-lg mb-3">
            {user?.name?.charAt(0) || "U"}
          </div>
          <p className="text-sm font-semibold text-[#FFF9F5]/90">Camera is turned off</p>
          <p className="text-xs text-[#FFF9F5]/50 mt-1">Audio and text inputs are active</p>
        </div>
      )}

      {/* Malpractice Warning Banner */}
      {proctorStatus.state === "violating" && (
        <div className="absolute top-4 left-4 right-4 z-30 px-4 py-2.5 bg-red-600/95 backdrop-blur-md text-white text-xs font-semibold rounded-xl flex items-center gap-2.5 animate-pulse shadow-xl">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{PROCTOR_MESSAGES[proctorStatus.type] || "Malpractice alert: your face is not visible!"}</span>
        </div>
      )}

      {/* REC Indicator Badge */}
      {interviewStarted && !interviewEnded && (
        <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-red-600/90 backdrop-blur-md rounded-full text-xs font-semibold text-white flex items-center gap-1.5 shadow-md">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> REC
        </div>
      )}

      {/* Warnings count pill if any */}
      {proctorWarnings > 0 && proctorStatus.state !== "violating" && interviewStarted && !interviewEnded && (
        <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-amber-500/90 backdrop-blur-md rounded-full text-xs font-semibold text-black flex items-center gap-1.5 shadow-md">
          <AlertTriangle className="w-3.5 h-3.5" />
          {proctorWarnings} warning{proctorWarnings === 1 ? "" : "s"}
        </div>
      )}

      {/* Live Captions Subtitle Box over video */}
      {interviewStarted && showCaptions && (isListening || liveTranscript) && (
        <div className="absolute bottom-24 left-8 right-8 z-20 px-4 py-2.5 bg-black/85 backdrop-blur-md rounded-xl text-sm text-[#FFF9F5] text-center shadow-xl max-w-xl mx-auto">
          {liveTranscript || <span className="text-[#FCE8DD] animate-pulse">Listening — speak your answer now…</span>}
        </div>
      )}

      {/* Bottom-Left: "You" Candidate Tag */}
      <div className="absolute bottom-4 left-4 z-20 px-3.5 py-1.5 bg-[#17120F]/85 backdrop-blur-md rounded-xl text-xs font-semibold text-[#FFF9F5] flex items-center gap-2 shadow-lg">
        <span>You</span>
        {videoEnabled && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
      </div>

      {/* Picture-in-Picture (PiP) Floating AI Interviewer Card on Bottom-Right */}
      <div className="absolute bottom-4 right-4 z-20 w-64 bg-gradient-to-br from-[#261D18]/95 via-[#201713]/95 to-[#18110E]/95 rounded-2xl p-3.5 shadow-2xl shadow-black/70 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#D97757]/15 flex items-center justify-center text-2xl shadow-inner shrink-0">
            🤖
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#FFF9F5] truncate">AI Interviewer</p>
            <p className="text-[11px] text-[#C4B5AE] truncate">HireRight</p>
            {questionNumber > 0 && (
              <p className="text-[10px] text-[#FCE8DD] font-medium mt-0.5">Question {questionNumber}/5</p>
            )}
          </div>
          {isAiSpeaking && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/60 text-emerald-300 animate-pulse">
              Speaking
            </span>
          )}
        </div>

        {/* Captions Toggle & Status Row */}
        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-[#C4B5AE]">
          <span>AI Interviewer Captions</span>
          <button
            onClick={() => setShowCaptions && setShowCaptions(!showCaptions)}
            className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
              showCaptions
                ? "bg-[#D97757] text-white shadow-xs"
                : "bg-[#2C211B] text-[#C4B5AE] hover:bg-[#362A24]"
            }`}
          >
            {showCaptions ? "On" : "Off"}
          </button>
        </div>
      </div>
    </div>
  );
}
