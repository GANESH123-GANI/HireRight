import {
  Video, VideoOff, Mic, MicOff, Phone, Captions, Keyboard, ScrollText, FileCode, Loader,
} from "lucide-react";
import type { InterviewControlsProps } from "./types";

export default function InterviewControls({
  videoEnabled,
  audioEnabled,
  hasStream,
  noCamera,
  interviewStarted,
  saving,
  codingLoading,
  codingMode,
  useKeyboard,
  showCaptions,
  showTranscript,
  toggleVideo,
  toggleAudio,
  finishInterview,
  switchToKeyboard,
  setShowCaptions,
  setShowTranscript,
  startCodingChallenge,
}: InterviewControlsProps) {
  return (
    <div className="shrink-0 flex items-center justify-center w-full py-1">
      <div className="bg-[#1C1613]/95 backdrop-blur-xl px-5 py-2 rounded-full flex items-center gap-3 shadow-2xl shadow-black/70">
        {/* Video Toggle Button */}
        <button
          onClick={toggleVideo}
          disabled={!hasStream || noCamera}
          title={videoEnabled ? "Turn off camera" : "Turn on camera"}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md disabled:opacity-40 ${
            videoEnabled
              ? "bg-[#29201B] hover:bg-[#362A24] text-[#FFF9F5]"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        {/* Audio Toggle Button */}
        <button
          onClick={toggleAudio}
          disabled={!hasStream}
          title={audioEnabled ? "Mute microphone" : "Unmute microphone"}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md disabled:opacity-40 ${
            audioEnabled
              ? "bg-[#29201B] hover:bg-[#362A24] text-[#FFF9F5]"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        {/* End Call / Leave Button (RED) */}
        <button
          onClick={finishInterview}
          disabled={!interviewStarted || saving}
          title="End Interview"
          className="w-11 h-11 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/30 transition-all cursor-pointer disabled:opacity-40 hover:scale-105 active:scale-95"
        >
          <Phone className="w-5 h-5 rotate-[135deg]" />
        </button>

        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Caption Toggle Pill Button */}
        <button
          onClick={() => setShowCaptions(!showCaptions)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-xs ${
            showCaptions
              ? "bg-[#D97757] text-white shadow-sm"
              : "bg-[#29201B] text-[#C4B5AE] hover:bg-[#362A24] hover:text-white"
          }`}
        >
          <Captions className="w-4 h-4" />
          <span>Caption</span>
        </button>

        {/* Transcript Toggle Pill Button */}
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-xs ${
            showTranscript
              ? "bg-[#D97757] text-white shadow-sm"
              : "bg-[#29201B] text-[#C4B5AE] hover:bg-[#362A24] hover:text-white"
          }`}
        >
          <ScrollText className="w-4 h-4" />
          <span>Transcript</span>
        </button>

        {/* Keyboard Mode Button */}
        {interviewStarted && (
          <button
            onClick={switchToKeyboard}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-xs ${
              useKeyboard
                ? "bg-emerald-600 text-white"
                : "bg-[#29201B] text-[#C4B5AE] hover:bg-[#362A24] hover:text-white"
            }`}
          >
            <Keyboard className="w-4 h-4" />
            <span className="hidden sm:inline">Keyboard</span>
          </button>
        )}

        {/* Coding Challenge Button */}
        {interviewStarted && !codingMode && (
          <button
            onClick={startCodingChallenge}
            disabled={codingLoading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer bg-[#29201B] text-[#C4B5AE] hover:bg-[#362A24] hover:text-white disabled:opacity-40"
          >
            {codingLoading ? (
              <Loader className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileCode className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Code</span>
          </button>
        )}
      </div>
    </div>
  );
}
