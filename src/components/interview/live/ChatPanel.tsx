import {
  MessageSquare, Video, Mic, Send, Wifi, WifiOff, ArrowRight, Loader, ShieldCheck, Calendar, Flag,
} from "lucide-react";
import type { ChatPanelProps } from "./types";

export default function ChatPanel({
  messages,
  interviewStarted,
  isAiTyping,
  isListening,
  liveTranscript,
  showManualInput,
  useKeyboard,
  manualInput,
  noCamera,
  supportsSpeech,
  liveKitAvailable,
  liveKitLoading,
  liveKitError,
  loading,
  proctorStatus,
  proctorLoading,
  startError,
  wordCount,
  setManualInput,
  sendManual,
  startInterview,
  startLiveKitInterview,
  messagesEndRef,
}: ChatPanelProps) {
  return (
    <div className="w-[320px] lg:w-[340px] xl:w-[360px] shrink-0 h-full flex flex-col min-h-0">
      <div className="bg-[#1A1412] rounded-2xl flex-1 h-full min-h-0 flex flex-col overflow-hidden shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="px-4 py-3.5 flex items-center justify-between bg-[#15100E] shrink-0">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-4 h-4 text-[#D97757]" />
            <span className="text-[#FFF9F5] text-sm font-bold tracking-tight">Interview Chat</span>
          </div>
          <span className="text-[#A89890] text-xs font-mono">{messages.length} messages</span>
        </div>

        {/* Content Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3.5">
          {!interviewStarted ? (
            <div className="space-y-3">
              {/* Stepper Card 1: Setup Guidance */}
              <div className="bg-[#241C17] rounded-xl p-3.5 text-left transition-all hover:bg-[#2C221D] shadow-sm">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#D97757]/15 text-[#D97757] flex items-center justify-center shrink-0 mt-0.5">
                    <Flag className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#FFF9F5] mb-1">Ready to Start?</h4>
                    <p className="text-[11px] text-[#C4B5AE] leading-relaxed">
                      Check your lighting and position your face in the front camera field. You can speak or type your answers anytime.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stepper Card 2: Interactive Interview Flow */}
              <div className="bg-[#241C17] rounded-xl p-3.5 text-left transition-all hover:bg-[#2C221D] shadow-sm">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#D97757]/15 text-[#D97757] flex items-center justify-center shrink-0 mt-0.5">
                    <Video className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#FFF9F5] mb-1">Interactive Voice & AI</h4>
                    <p className="text-[11px] text-[#C4B5AE] leading-relaxed">
                      {noCamera
                        ? "The AI interviewer asks questions aloud and you respond naturally. Your voice is recorded and evaluated in real time."
                        : "The AI interviewer will ask questions aloud and you answer naturally. Your camera and voice are evaluated in real time."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stepper Card 3: Anti-Cheating Monitoring Badge */}
              {!noCamera && (
                <div className={`rounded-xl p-3.5 text-left transition-all ${
                  proctorStatus.state === "ok" || proctorStatus.state === "violating"
                    ? "bg-emerald-950/40 text-emerald-300"
                    : proctorLoading
                    ? "bg-amber-950/40 text-amber-300"
                    : "bg-[#241C17] text-[#C4B5AE]"
                }`}>
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#FFF9F5] mb-1">
                        Anti-cheating monitoring is active
                      </h4>
                      <p className="text-[11px] leading-relaxed text-[#C4B5AE]">
                        Keep your focus on the screen. Turning away or hiding your face is flagged as malpractice and included in your report.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Notifications */}
              {startError && startError === "__NO_INTERVIEW__" ? (
                <div className="bg-amber-950/30 text-amber-300 text-xs rounded-xl p-3 text-center">
                  <Calendar className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                  <p className="font-bold mb-1">No interview scheduled</p>
                  <p className="text-amber-300/80 text-[11px] mb-2.5">Schedule a slot to start this session.</p>
                  <a
                    href="/interview"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D97757] text-white rounded-lg font-semibold text-xs hover:bg-[#B95F42] transition-colors"
                  >
                    Schedule Interview <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : startError ? (
                <div className="bg-red-950/40 text-red-400 text-xs rounded-xl p-3">
                  {startError}
                </div>
              ) : null}

              {liveKitError && (
                <div className="bg-yellow-950/40 text-yellow-400 text-xs rounded-xl p-3 flex items-start gap-2">
                  <WifiOff className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{liveKitError}</span>
                </div>
              )}
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs ${
                    msg.role === "user"
                      ? "bg-[#D97757] text-white rounded-br-none shadow-md"
                      : "bg-[#241C17] text-[#FFF9F5] rounded-bl-none shadow-sm"
                  }`}>
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-1.5 mb-1 text-[11px] text-[#FCE8DD] font-bold">
                        <span>🤖</span>
                        <span>AI Interviewer</span>
                      </div>
                    )}
                    <p className="leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}

              {liveTranscript && (
                <div className="flex justify-end">
                  <div className="bg-[#D97757]/20 text-[#FFF9F5] rounded-2xl rounded-br-none px-3.5 py-2.5 text-xs shadow-md">
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] text-[#FCE8DD]">
                      <Mic className="w-3 h-3 text-[#FCE8DD] animate-pulse" />
                      <span>Listening...</span>
                    </div>
                    <p className="leading-relaxed">{liveTranscript}</p>
                  </div>
                </div>
              )}

              {isAiTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#241C17] rounded-2xl rounded-bl-none px-3.5 py-2.5 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🤖</span>
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-[#D97757] rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-[#D97757] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-[#D97757] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Pinned bottom footer: Action Buttons if not started, or Input Bar if started */}
        {!interviewStarted ? (
          <div className="p-4 bg-[#15100E] shrink-0 space-y-2">
            {liveKitAvailable && (
              <button
                onClick={startLiveKitInterview}
                disabled={liveKitLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-700 to-[#D97757] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {liveKitLoading ? (
                  <><Loader className="animate-spin w-3.5 h-3.5" /> Connecting...</>
                ) : (
                  <><Wifi className="w-3.5 h-3.5" /> Start Voice Interview <ArrowRight className="w-3.5 h-3.5" /></>
                )}
              </button>
            )}

            <button
              onClick={startInterview}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#D97757] via-[#C86544] to-[#B95F42] hover:opacity-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#D97757]/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? (
                <><Loader className="animate-spin w-4 h-4" /> Connecting Live Interview...</>
              ) : (
                <>Start Browser Interview <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            {!liveKitAvailable && !supportsSpeech && (
              <p className="text-yellow-400 text-[11px] text-center mt-2">
                Voice input is not supported in this browser. You can type your answers instead.
              </p>
            )}
          </div>
        ) : (
          <div className="p-3 bg-[#15100E] shrink-0">
            {isListening ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-[#D97757]/15 rounded-xl text-xs text-[#FCE8DD]">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-[#D97757] rounded-full animate-pulse" />
                  <span className="w-1.5 h-1.5 bg-[#D97757] rounded-full animate-pulse" style={{ animationDelay: "200ms" }} />
                  <span className="w-1.5 h-1.5 bg-[#D97757] rounded-full animate-pulse" style={{ animationDelay: "400ms" }} />
                </div>
                <span className="flex-1 truncate">Listening — speak your answer now</span>
                {wordCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-[#D97757]/30 text-white rounded-md text-[10px] font-bold">
                    {wordCount}w
                  </span>
                )}
              </div>
            ) : showManualInput || !supportsSpeech || useKeyboard ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendManual()}
                  placeholder="Type your answer..."
                  className="flex-1 bg-[#241C17] text-[#FFF9F5] text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#D97757] placeholder-[#A89890]"
                  disabled={isAiTyping}
                />
                <button
                  onClick={sendManual}
                  disabled={!manualInput.trim() || isAiTyping}
                  className="px-3 py-2.5 bg-[#D97757] hover:bg-[#B95F42] text-white rounded-xl disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5 text-[#A89890] text-xs py-1">
                <Mic className="w-3.5 h-3.5 text-[#D97757]" />
                <span>Ready for next question...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
