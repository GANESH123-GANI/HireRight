import { ScrollText, Mic, Volume2, Keyboard, X } from "lucide-react";
import type { TranscriptPanelProps } from "./types";

export default function TranscriptPanel({
  interviewStarted,
  lastAiMessage,
  lastUserMessage,
  questionNumber,
  isListening,
  isAiSpeaking,
  liveTranscript,
  wordCount,
  useKeyboard,
  switchToKeyboard,
  setShowTranscript,
}: TranscriptPanelProps) {
  return (
    <div className="w-[300px] lg:w-[320px] xl:w-[340px] shrink-0 h-full flex flex-col min-h-0">
      <div className="bg-[#1A1412] rounded-2xl flex-1 h-full min-h-0 flex flex-col overflow-hidden shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="px-4 py-3.5 flex items-center justify-between bg-[#15100E] shrink-0">
          <div className="flex items-center gap-2.5">
            <ScrollText className="w-4 h-4 text-[#D97757]" />
            <span className="text-[#FFF9F5] text-sm font-bold tracking-tight">Live Transcript</span>
          </div>
          <button
            onClick={() => setShowTranscript(false)}
            className="text-[#A89890] hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close transcript"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Transcript Feed */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
          {!interviewStarted ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <div className="w-12 h-12 rounded-2xl bg-[#241C17] flex items-center justify-center mb-3 text-[#D97757]">
                <ScrollText className="w-6 h-6" />
              </div>
              <p className="text-xs text-[#E8DDD7] font-medium">Live captions will appear here once the interview starts.</p>
              <p className="text-[11px] text-[#A89890] mt-1">Real-time speech-to-text will display questions and answers.</p>
            </div>
          ) : (
            <>
              {lastAiMessage && (
                <div>
                  <p className="text-[11px] text-[#FCE8DD] font-bold mb-1.5 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-[#D97757]" />
                    <span>Question {questionNumber}</span>
                  </p>
                  <div className="bg-[#241C17] rounded-xl p-3 text-xs text-[#FFF9F5] leading-relaxed shadow-sm">
                    {lastAiMessage.content}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5" />
                    <span>Your answer</span>
                  </p>
                  <span className="text-[10px] text-[#A89890] font-mono">
                    {isListening
                      ? `${wordCount} words`
                      : lastUserMessage
                      ? `${(lastUserMessage.content.trim().split(/\s+/).filter(Boolean) || []).length} words`
                      : "0 words"}
                  </span>
                </div>
                <div className="rounded-xl p-3 text-xs min-h-[90px] leading-relaxed bg-[#D97757]/15 text-[#FFF9F5] shadow-sm">
                  {isListening ? (
                    liveTranscript ? (
                      liveTranscript
                    ) : (
                      <span className="text-[#FCE8DD] animate-pulse">Listening — speak your answer now…</span>
                    )
                  ) : lastUserMessage ? (
                    lastUserMessage.content
                  ) : (
                    <span className="text-[#A89890] italic">Speak now. Your answer appears here in real time.</span>
                  )}
                </div>
              </div>

              {isAiSpeaking && (
                <div className="text-[11px] text-[#FCE8DD] flex items-center gap-2 p-2 bg-[#D97757]/10 rounded-lg">
                  <Volume2 className="w-3.5 h-3.5 text-[#D97757] animate-pulse" />
                  <span>The interviewer is speaking out loud…</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Keyboard mode fallback button */}
        {interviewStarted && (
          <div className="p-3 bg-[#15100E] shrink-0">
            <button
              onClick={switchToKeyboard}
              className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                useKeyboard
                  ? "bg-emerald-600 text-white"
                  : "bg-[#241C17] text-[#E8DDD7] hover:bg-[#2F241E] hover:text-white"
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>{useKeyboard ? "Keyboard mode active" : "Use keyboard to answer"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
