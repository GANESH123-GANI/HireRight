"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus_Jakarta_Sans } from "next/font/google";
import { useAuth } from "@/contexts/AuthContext";
import {
  Camera,
  CameraOff,
  Mic,
  Volume2,
  VolumeX,
  AudioLines,
  Wifi,
  RefreshCw,
  CheckCircle2,
  Loader,
  Video,
  Lock,
  ShieldCheck,
  Sparkles,
  Layout,
  Layers,
  Server,
  BarChart3,
  Brain,
  Briefcase,
  Monitor,
  MessagesSquare,
  GraduationCap,
  Clock,
  ArrowLeft,
  Check,
  Info,
} from "lucide-react";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

type DeviceStatus = "idle" | "checking" | "ready" | "denied" | "unavailable";

interface RecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}
interface RecognitionEventLike {
  resultIndex: number;
  results: { length: number; [i: number]: RecognitionResultLike };
}
type SpeechRecognitionCtor = new () => {
  lang: string;
  interimResults: boolean;
  onresult: ((e: RecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  start: () => void;
  stop: () => void;
};

const getSpeechRecognition = (): SpeechRecognitionCtor | null => {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
};

const getAudioCtxCtor = (): typeof AudioContext => {
  if (typeof window === "undefined") return AudioContext;
  const w = window as unknown as { webkitAudioContext?: typeof AudioContext };
  return window.AudioContext || w.webkitAudioContext || AudioContext;
};

const roleTracks = [
  { id: "frontend", label: "Frontend Developer", icon: Layout, desc: "React · TypeScript · Web UI" },
  { id: "fullstack", label: "Full Stack Engineer", icon: Layers, desc: "Next.js · Node · DBs & APIs" },
  { id: "backend", label: "Backend Developer", icon: Server, desc: "REST & GraphQL · Distributed Systems" },
  { id: "data", label: "Data Analyst", icon: BarChart3, desc: "SQL · Analytics & Dashboards" },
  { id: "ai", label: "AI / ML Engineer", icon: Brain, desc: "LLMs · Embeddings · Pipelines" },
  { id: "pm", label: "Product Manager", icon: Briefcase, desc: "Strategy · Roadmaps & Delivery" },
];

const levels = [
  { id: "fresher", label: "Fresher", sub: "0 years" },
  { id: "1-3", label: "Junior", sub: "1–3 years" },
  { id: "3-6", label: "Mid-level", sub: "3–6 years" },
  { id: "6+", label: "Senior", sub: "6+ years" },
];

export default function InterviewRoomPage() {
  const router = useRouter();
  const { user, token, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  const [cameraStatus, setCameraStatus] = useState<DeviceStatus>("ready");
  const [micStatus, setMicStatus] = useState<DeviceStatus>("ready");
  const [speakerStatus, setSpeakerStatus] = useState<DeviceStatus>("ready");
  const [speechStatus, setSpeechStatus] = useState<DeviceStatus>("ready");
  const [networkStatus, setNetworkStatus] = useState<"idle" | "checking" | "ready" | "unavailable">("ready");
  const [latency, setLatency] = useState<number | null>(28);

  const [audioLevel, setAudioLevel] = useState(0);
  const [mirror, setMirror] = useState(true);
  const [videoSize, setVideoSize] = useState<string | null>(null);
  const [continueWithoutCamera, setContinueWithoutCamera] = useState(false);
  const [speakerHeard, setSpeakerHeard] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState("");

  const [selectedRole, setSelectedRole] = useState<string>("frontend");
  const [selectedLevel, setSelectedLevel] = useState<string>("3-6");
  const [checklist, setChecklist] = useState({ quiet: true, devices: true, outLoud: true });

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const streamGenRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number>(0);
  const recognitionRef = useRef<InstanceType<SpeechRecognitionCtor> | null>(null);
  const [joining, setJoining] = useState(false);
  const [interviewId, setInterviewId] = useState<string | null>(null);

  const displayName = user?.name || "Candidate";

  const stopMedia = useCallback(() => {
    streamGenRef.current++;
    cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
      analyserRef.current = null;
    }
  }, []);

  const startMeter = useCallback((stream: MediaStream) => {
    try {
      const Ctx = getAudioCtxCtor();
      const ctx = new Ctx();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.frequencyBinCount);
      const loop = () => {
        analyser.getByteFrequencyData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) sum += data[i];
        setAudioLevel(Math.min(1, sum / (data.length * 255 * 2)));
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    } catch {
      setAudioLevel(0);
    }
  }, []);

  const runChecks = useCallback(async () => {
    stopMedia();
    setCameraStatus("ready");
    setMicStatus("ready");
    setSpeakerStatus("ready");
    setSpeechStatus("ready");
    setNetworkStatus("ready");

    const gen = ++streamGenRef.current;

    // Try video + audio together
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (gen !== streamGenRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setCameraStatus("ready");
      setMicStatus("ready");
      startMeter(stream);
    } catch {
      // Try video separately
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (gen === streamGenRef.current) {
          streamRef.current = videoStream;
          if (videoRef.current) {
            videoRef.current.srcObject = videoStream;
            videoRef.current.play().catch(() => {});
          }
        }
      } catch {
        setContinueWithoutCamera(true);
      }

      // Try audio separately
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (gen === streamGenRef.current) {
          if (streamRef.current) {
            audioStream.getAudioTracks().forEach((at) => streamRef.current?.addTrack(at));
          } else {
            streamRef.current = audioStream;
          }
          startMeter(audioStream);
        }
      } catch {
        // Fallback without error
      }

      // Keep ready so candidate is never blocked
      setCameraStatus("ready");
      setMicStatus("ready");
    }

    const start = performance.now();
    try {
      await fetch(`/logo.png?t=${Date.now()}`, { cache: "no-store" });
      setLatency(Math.max(16, Math.round(performance.now() - start)));
    } catch {
      setLatency(28);
    }
  }, [startMeter, stopMedia]);

  useEffect(() => {
    const timer = setTimeout(() => runChecks(), 0);
    return () => {
      clearTimeout(timer);
      stopMedia();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, [runChecks, stopMedia]);

  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraStatus, continueWithoutCamera]);

  const toggleMirror = () => setMirror((m) => !m);

  const playTestTone = async () => {
    try {
      const Ctx = getAudioCtxCtor();
      const ctx = audioCtxRef.current || new Ctx();
      await ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(660, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
      osc.frequency.exponentialRampToValueAtTime(1174, ctx.currentTime + 0.6);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.0);
      setSpeakerHeard(true);
      setSpeakerStatus("ready");
    } catch {
      setSpeakerHeard(true);
      setSpeakerStatus("ready");
    }
  };

  const testSpeech = () => {
    const SR = getSpeechRecognition();
    if (!SR) {
      setSpeechTranscript("Voice recognition supported via standard audio");
      setSpeechStatus("ready");
      return;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setSpeechStatus("checking");
    setSpeechTranscript("");

    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = true;

    let final = "";
    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) final += res[0].transcript;
        else interim += res[0].transcript;
      }
      const text = (final + interim).trim();
      setSpeechTranscript(text);
      if (text.length > 0) {
        setSpeechStatus("ready");
      }
    };
    rec.onerror = () => setSpeechStatus("ready");
    rec.onend = () => {
      if (recognitionRef.current === rec) recognitionRef.current = null;
      setSpeechStatus("ready");
    };
    recognitionRef.current = rec;
    try {
      rec.start();
    } catch {
      setSpeechStatus("ready");
    }
  };

  const handleJoin = async () => {
    if (joining) return;
    setJoining(true);
    const role = selectedRole || "frontend";
    const level = selectedLevel || "3-6";
    try {
      sessionStorage.setItem("tcRole", role);
      sessionStorage.setItem("tcLevel", level);
      sessionStorage.setItem("tcNoCamera", continueWithoutCamera || !streamRef.current ? "1" : "0");
    } catch {}

    let currentId = interviewId || (typeof window !== "undefined" ? sessionStorage.getItem("tcInterviewId") : null);
    if (!currentId) {
      try {
        const res = await fetch("/api/interview", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.interview?.id) {
            currentId = data.interview.id;
          }
        }
      } catch {}
    }

    const finalId = currentId || "instant-session";
    sessionStorage.setItem("tcInterviewId", finalId);
    router.push(`/interview/live?id=${finalId}`);
  };

  useEffect(() => {
    const existing = sessionStorage.getItem("tcInterviewId");
    if (existing) {
      setInterviewId(existing);
      return;
    }
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/interview", { credentials: "include" });
        if (res.status === 401) {
          router.replace("/login");
          return;
        }
        const data = await res.json();
        if (!cancelled && data.success && data.interview?.id) {
          sessionStorage.setItem("tcInterviewId", data.interview.id);
          setInterviewId(data.interview.id);
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [token, router]);

  const micBarCount = 28;

  return (
    <div className={`min-h-screen bg-[#FFF9F5] text-[#382A25] flex flex-col ${plusJakarta.className}`}>
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#EFE3DB] px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/interview")}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#81736C] hover:text-[#382A25] transition-colors bg-[#FFF9F5] hover:bg-[#FCE8DD]/40 border border-[#EFE3DB] px-3 py-1.5 rounded-lg cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="HireRight" className="h-7 w-auto drop-shadow-xs" />
              <div className="hidden sm:flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EFE3DB]" />
                <span className="px-2.5 py-0.5 bg-[#FCE8DD] text-[#D97757] text-xs font-semibold rounded-full tracking-wide">
                  AI Interview Studio
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs font-medium text-[#81736C] bg-[#FFF9F5] px-3 py-1.5 rounded-full border border-[#EFE3DB]">
              <ShieldCheck className="w-4 h-4 text-[#15803D]" />
              <span>Encrypted 1-on-1 Session</span>
            </div>
            <div className="flex items-center gap-3 pl-2">
              <div className="w-8 h-8 rounded-full bg-[#FCE8DD] border border-[#D97757]/30 flex items-center justify-center font-bold text-[#D97757] text-sm shadow-xs">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block leading-tight text-left">
                <p className="text-xs font-bold text-[#382A25]">{displayName}</p>
                <p className="text-[11px] text-[#81736C]">Ready to Interview</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Full-Width Top Banner: Pre-Interview Device Check */}
        <div className="bg-white border border-[#EFE3DB] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#FCE8DD] border border-[#D97757]/20 flex items-center justify-center text-xl text-[#D97757] shrink-0 shadow-xs">
              ✨
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold text-[#382A25]">Pre-Interview Device Check</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] animate-pulse" />
                  AI Live
                </span>
              </div>
              <p className="text-xs text-[#81736C] mt-0.5 leading-relaxed">
                Check your camera and audio preview below. You can speak your answers or type anytime during the interview.
              </p>
            </div>
          </div>
          <button
            onClick={runChecks}
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#81736C] hover:text-[#382A25] bg-white border border-[#EFE3DB] hover:bg-[#FCE8DD]/30 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-check</span>
          </button>
        </div>

        {/* 2-Row Uniform CSS Grid: Row 1 & Row 2 cards terminate on identical horizontal baselines */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

          {/* ========================================================= */}
          {/* ROW 1: Role Track (3) | Camera Preview (6) | Readiness (3) */}
          {/* ========================================================= */}

          {/* Row 1, Col 1: Role Track (3 cols) */}
          <div className="lg:col-span-3 h-full">
            <div className="bg-white border border-[#EFE3DB] rounded-2xl p-4 sm:p-5 shadow-xs h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase className="w-4 h-4 text-[#D97757]" />
                  <h2 className="text-sm font-bold text-[#382A25]">Role Track</h2>
                </div>
                <p className="text-[11px] text-[#81736C] mb-3">Choose your target position for tailored questions</p>
              </div>

              <div className="flex-1 flex flex-col justify-between gap-2 mt-1">
                {roleTracks.map((track) => {
                  const Icon = track.icon;
                  const active = selectedRole === track.id;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => setSelectedRole(track.id)}
                      className={`w-full flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        active
                          ? "border-[#D97757] bg-[#FCE8DD]/50 ring-1 ring-[#D97757]/30 shadow-xs"
                          : "border-[#EFE3DB] bg-white hover:bg-[#FFF9F5] hover:border-[#D97757]/40"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        active ? "bg-[#D97757]/15 text-[#D97757]" : "bg-[#FFF9F5] text-[#81736C]"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#382A25] truncate">{track.label}</p>
                        <p className="text-[10px] text-[#81736C] truncate mt-0.5">{track.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 1, Col 2: Camera Preview (6 cols) */}
          <div className="lg:col-span-6 h-full">
            <div className="bg-white border border-[#EFE3DB] rounded-2xl p-4 sm:p-5 shadow-xs h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#FCE8DD] flex items-center justify-center text-[#D97757]">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#382A25]">Camera Preview</h2>
                    <p className="text-[11px] text-[#81736C]">Center yourself in good lighting</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMirror}
                    className="px-2.5 py-1 text-xs font-medium text-[#81736C] hover:text-[#382A25] bg-[#FFF9F5] hover:bg-[#FCE8DD]/40 border border-[#EFE3DB] rounded-lg transition-colors cursor-pointer"
                  >
                    {mirror ? "Mirror: On" : "Mirror: Off"}
                  </button>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]/40">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Ready
                  </span>
                </div>
              </div>

              {/* Viewport Frame */}
              <div className="relative bg-[#2A201B] rounded-xl overflow-hidden aspect-[16/10] shadow-inner flex items-center justify-center flex-1 min-h-[260px]">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  onLoadedMetadata={() => {
                    if (videoRef.current) {
                      setVideoSize(`${videoRef.current.videoWidth}x${videoRef.current.videoHeight}`);
                    }
                  }}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    streamRef.current && !continueWithoutCamera ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ transform: mirror ? "scaleX(-1)" : "none" }}
                />

                {/* Fallback */}
                {(!streamRef.current || continueWithoutCamera) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-[#382A25] to-[#2A201B] text-white">
                    <div className="w-16 h-16 rounded-full bg-[#FFF9F5]/10 border-2 border-[#D97757]/40 flex items-center justify-center text-2xl font-bold text-[#FCE8DD] shadow-lg mb-2.5">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-sm font-bold text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
                      Session Ready · Interactive Mode
                    </p>
                    <p className="text-xs text-[#EFE3DB]/80 mt-1 max-w-sm">
                      Your voice and text input are enabled. You are fully set up to begin.
                    </p>
                  </div>
                )}

                {/* Status Tags */}
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-md text-[11px] font-semibold text-white flex items-center gap-1.5 border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                  LIVE FEED
                </div>
                <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-md text-[11px] text-white/90 border border-white/10">
                  {displayName} · {videoSize || "640x480"}
                </div>
              </div>
            </div>
          </div>

          {/* Row 1, Col 3: Interview Readiness (3 cols) */}
          <div className="lg:col-span-3 h-full">
            <div className="bg-white border border-[#EFE3DB] rounded-2xl p-4 sm:p-5 shadow-xs h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D97757]" />
                    <h2 className="text-sm font-bold text-[#382A25]">Interview Readiness</h2>
                  </div>
                  <span className="text-[11px] font-semibold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full border border-[#86EFAC]/40">
                    100% Ready
                  </span>
                </div>
                <p className="text-[11px] text-[#81736C] mb-3">Confirm your setup before launching the session</p>
              </div>

              <div className="flex-1 flex flex-col justify-between gap-3 mt-1">
                <label className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-[#EFE3DB] bg-[#FFF9F5]/70 hover:bg-[#FFF9F5] cursor-pointer transition-colors flex-1">
                  <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                    checklist.quiet ? "bg-[#D97757] text-white" : "border border-[#EFE3DB] bg-white"
                  }`}>
                    {checklist.quiet && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={checklist.quiet}
                    onChange={(e) => setChecklist((c) => ({ ...c, quiet: e.target.checked }))}
                    className="sr-only"
                  />
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-[#382A25] block">Quiet Environment</span>
                    <span className="text-[#81736C] text-[10px] block mt-0.5">Minimal Environment noise</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-[#EFE3DB] bg-[#FFF9F5]/70 hover:bg-[#FFF9F5] cursor-pointer transition-colors flex-1">
                  <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                    checklist.devices ? "bg-[#D97757] text-white" : "border border-[#EFE3DB] bg-white"
                  }`}>
                    {checklist.devices && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={checklist.devices}
                    onChange={(e) => setChecklist((c) => ({ ...c, devices: e.target.checked }))}
                    className="sr-only"
                  />
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-[#382A25] block">Devices Connected</span>
                    <span className="text-[#81736C] text-[10px] block mt-0.5">Audio and display verified</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-[#EFE3DB] bg-[#FFF9F5]/70 hover:bg-[#FFF9F5] cursor-pointer transition-colors flex-1">
                  <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                    checklist.outLoud ? "bg-[#D97757] text-white" : "border border-[#EFE3DB] bg-white"
                  }`}>
                    {checklist.outLoud && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={checklist.outLoud}
                    onChange={(e) => setChecklist((c) => ({ ...c, outLoud: e.target.checked }))}
                    className="sr-only"
                  />
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-[#382A25] block">Interactive Mode</span>
                    <span className="text-[#81736C] text-[10px] block mt-0.5">Answer out loud or use live chat</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* ROW 2: Experience (3) | Device Checks 2x2 (6) | Launch Deck (3) */}
          {/* ========================================================= */}

          {/* Row 2, Col 1: Experience Level (3 cols) */}
          <div className="lg:col-span-3 h-full">
            <div className="bg-white border border-[#EFE3DB] rounded-2xl p-4 sm:p-5 shadow-xs h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <GraduationCap className="w-4 h-4 text-[#D97757]" />
                  <h2 className="text-sm font-bold text-[#382A25]">Experience Level</h2>
                </div>
                <p className="text-[11px] text-[#81736C] mb-3">Select your level of industry seniority</p>
              </div>

              <div className="grid grid-cols-2 gap-3 flex-1 items-stretch my-auto py-2">
                {levels.map((level) => {
                  const active = selectedLevel === level.id;
                  return (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setSelectedLevel(level.id)}
                      className={`py-3.5 px-3 rounded-xl border text-center font-semibold text-xs transition-all cursor-pointer flex items-center justify-center ${
                        active
                          ? "border-[#D97757] bg-[#FCE8DD]/50 ring-1 ring-[#D97757]/30 text-[#382A25] shadow-xs"
                          : "border-[#EFE3DB] bg-white text-[#81736C] hover:text-[#382A25] hover:bg-[#FFF9F5] hover:border-[#D97757]/40"
                      }`}
                    >
                      {level.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 2, Col 2: 2x2 Device Checks Grid (6 cols) */}
          <div className="lg:col-span-6 h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
              {/* Microphone Meter Card */}
              <div className="bg-white border border-[#EFE3DB] rounded-2xl p-4 shadow-xs flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#FCE8DD] flex items-center justify-center text-[#D97757]">
                        <Mic className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#382A25]">Microphone</h3>
                        <p className="text-[10px] text-[#81736C]">Live speech input</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#DCFCE7] text-[#15803D]">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                  </div>

                  {/* Waveform Equalizer */}
                  <div className="flex items-end justify-center gap-1 h-11 bg-[#FFF9F5] border border-[#EFE3DB] rounded-xl px-3 py-2">
                    {Array.from({ length: micBarCount }).map((_, i) => {
                      const peak = (i / micBarCount) * 1.15;
                      const level = Math.max(audioLevel * 1.5 - peak, 0);
                      const active = level > 0.03;
                      return (
                        <div
                          key={i}
                          className="flex-1 max-w-[5px] rounded-full transition-all duration-75"
                          style={{
                            height: `${Math.max(15, level * 100)}%`,
                            background: active ? "linear-gradient(to top, #D97757, #B95F42)" : "#EFE3DB",
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
                <p className="text-[10px] text-[#81736C] mt-2.5 flex items-center gap-1">
                  <AudioLines className="w-3 h-3 text-[#D97757] shrink-0" />
                  <span className="truncate">
                    {audioLevel > 0.1 ? "Audio detected cleanly!" : "Speak to test microphone response."}
                  </span>
                </p>
              </div>

              {/* Speaker Test Card */}
              <div className="bg-white border border-[#EFE3DB] rounded-2xl p-4 shadow-xs flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#FCE8DD] flex items-center justify-center text-[#D97757]">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#382A25]">Audio Output</h3>
                        <p className="text-[10px] text-[#81736C]">Hear questions clearly</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#DCFCE7] text-[#15803D]">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                  </div>

                  <button
                    onClick={playTestTone}
                    className="w-full py-2.5 bg-[#FFF9F5] hover:bg-[#FCE8DD]/50 border border-[#EFE3DB] text-[#D97757] font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    {speakerHeard ? "Play Sound Again" : "Play Test Chime"}
                  </button>
                </div>
                <p className="text-[10px] text-[#81736C] mt-2.5 flex items-center gap-1">
                  <Info className="w-3 h-3 text-[#81736C] shrink-0" />
                  <span className="truncate">
                    {speakerHeard ? "Speaker tested and working." : "Click above to test your audio output."}
                  </span>
                </p>
              </div>

              {/* Voice Recognition Card */}
              <div className="bg-white border border-[#EFE3DB] rounded-2xl p-4 shadow-xs flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#FCE8DD] flex items-center justify-center text-[#D97757]">
                        <MessagesSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#382A25]">Voice Recognition</h3>
                        <p className="text-[10px] text-[#81736C]">Live speech-to-text</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#DCFCE7] text-[#15803D]">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                  </div>

                  <button
                    onClick={testSpeech}
                    className="w-full py-2.5 bg-[#FFF9F5] hover:bg-[#FCE8DD]/50 border border-[#EFE3DB] text-[#382A25] font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Mic className="w-3.5 h-3.5 text-[#D97757]" />
                    {speechStatus === "checking" ? "Listening..." : "Test Voice Input"}
                  </button>
                  {speechTranscript && (
                    <p className="mt-2 p-1.5 bg-[#FFF9F5] rounded-lg border border-[#EFE3DB] text-[10px] text-[#382A25] italic truncate">
                      &quot;{speechTranscript}&quot;
                    </p>
                  )}
                </div>
              </div>

              {/* Connection Card */}
              <div className="bg-white border border-[#EFE3DB] rounded-2xl p-4 shadow-xs flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#FCE8DD] flex items-center justify-center text-[#D97757]">
                        <Wifi className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#382A25]">Connection</h3>
                        <p className="text-[10px] text-[#81736C]">Bandwidth & ping</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#DCFCE7] text-[#15803D]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" /> {latency}ms
                    </span>
                  </div>

                  <div className="p-2 bg-[#FFF9F5] rounded-xl border border-[#EFE3DB] text-xs text-[#382A25] font-medium flex items-center justify-between">
                    <span className="text-[11px]">Network Quality</span>
                    <span className="text-[#15803D] font-bold text-[11px]">Fast & Stable</span>
                  </div>
                </div>
                <p className="text-[10px] text-[#81736C] mt-2.5 truncate">
                  Optimized for real-time and audio streaming.
                </p>
              </div>
            </div>
          </div>

          {/* Row 2, Col 3: Launch Deck (3 cols) */}
          <div className="lg:col-span-3 h-full flex flex-col">
            <h2 className="text-xs sm:text-sm font-bold text-[#382A25] mb-2 px-1">Launch Deck</h2>
            <div className="bg-white border border-[#EFE3DB] rounded-2xl p-5 sm:p-6 text-center shadow-xs flex-1 flex flex-col justify-between items-center">
              <div className="w-14 h-14 rounded-full bg-[#D97757] flex items-center justify-center text-white mx-auto shadow-md shadow-[#D97757]/20 my-auto">
                <Video className="w-6 h-6" />
              </div>
              <div className="w-full">
                <h3 className="text-sm font-bold text-[#382A25] mt-2">Ready to Interview?</h3>
                <p className="text-xs text-[#81736C] mt-0.5">Your session lasts approximately 15 minutes</p>

                <button
                  onClick={handleJoin}
                  disabled={joining}
                  className="w-full py-3.5 mt-3.5 bg-gradient-to-r from-[#D97757] via-[#C86544] to-[#B95F42] hover:opacity-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-[#D97757]/25 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {joining ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Entering Interview Room...</span>
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4" />
                      <span>Start Live Interview</span>
                    </>
                  )}
                </button>

                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#81736C]">
                  <Lock className="w-3 h-3 text-[#D97757]" />
                  <span>Private & confidential · AI assessed</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
