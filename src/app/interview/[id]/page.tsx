"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { Send, Clock, Brain, CheckCircle, AlertCircle, MessageSquare } from "lucide-react";

interface Question {
  id: string;
  questionNumber: number;
  question: string;
  category: string;
  skill: string | null;
}

interface ChatMessage {
  role: "ai" | "user";
  content: string;
  category?: string;
  skill?: string | null;
  questionNumber?: number;
  score?: number;
  feedback?: string;
  timestamp: Date;
}

export default function InterviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(15 * 60);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [sending, setSending] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchNextQuestion = async () => {
    try {
      const res = await fetch(`/api/interviews/${id}/next-question`, {
        credentials: "same-origin",
      });
      const data = await res.json();
      if (data.success) {
        setCurrentQuestion(data.question);
        setTotalQuestions(data.totalQuestions);
        setTimeRemaining(data.timeRemainingSeconds);
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: data.question.question,
            category: data.question.category,
            skill: data.question.skill,
            questionNumber: data.question.questionNumber,
            timestamp: new Date(),
          },
        ]);
      } else {
        setCompleted(true);
      }
    } catch (err) {
      console.error("Failed to fetch question:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!answer.trim() || !currentQuestion || sending) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: answer.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setSending(true);
    setAnswer("");

    try {
      const res = await fetch(`/api/interviews/${id}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          questionId: currentQuestion.id,
          answer: userMessage.content,
          timeSpentSeconds: 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Show AI feedback
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: data.completed
              ? "Thank you for completing the interview! Generating your results..."
              : data.evaluation?.feedback || "Thank you for your answer.",
            score: data.evaluation?.score,
            feedback: data.evaluation?.feedback,
            timestamp: new Date(),
          },
        ]);

        if (data.completed) {
          setCompleted(true);
          setTimeout(() => {
            router.push(`/interview/${id}/results`);
          }, 2000);
        } else if (data.nextQuestion) {
          setCurrentQuestion(data.nextQuestion);
          setMessages((prev) => [
            ...prev,
            {
              role: "ai",
              content: data.nextQuestion.question,
              category: data.nextQuestion.category,
              skill: data.nextQuestion.skill,
              questionNumber: data.nextQuestion.questionNumber,
              timestamp: new Date(),
            },
          ]);
        }
      }
    } catch (err) {
      console.error("Failed to submit answer:", err);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleEndInterview = async () => {
    try {
      await fetch(`/api/interviews/${id}/end`, {
        method: "POST",
        credentials: "same-origin",
      });
      setCompleted(true);
      router.push(`/interview/${id}/results`);
    } catch (err) {
      console.error("Failed to end interview:", err);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchNextQuestion);
  }, []);

  useEffect(() => {
    if (timeRemaining <= 0 && !completed) {
      void Promise.resolve().then(handleEndInterview);
      return;
    }
    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, completed]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "technical":
        return "bg-blue-50 text-[#2563EB] border border-blue-200";
      case "behavioral":
        return "bg-[#FCE8DD] text-[#D97757] border border-[#EFE3DB]";
      case "project_based":
        return "bg-emerald-50 text-[#15803D] border border-emerald-200";
      case "problem_solving":
        return "bg-amber-50 text-[#B45309] border border-amber-200";
      case "skill_based":
        return "bg-[#FCE8DD] text-[#D97757] border border-[#EFE3DB]";
      default:
        return "bg-[#FFF9F5] text-[#81736C] border border-[#EFE3DB]";
    }
  };

  const getTimelineSegments = () => {
    const total = 15 * 60;
    const elapsed = total - timeRemaining;
    const segments = [
      { label: "15:00", position: 0 },
      { label: "12:00", position: 20 },
      { label: "9:00", position: 40 },
      { label: "6:00", position: 60 },
      { label: "3:00", position: 80 },
      { label: "0:00", position: 100 },
    ];
    return { elapsed: (elapsed / total) * 100, segments };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-[#D97757] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#81736C] text-sm font-medium">Loading interview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#EFE3DB] px-4 py-3 shadow-[0_2px_10px_rgb(56,42,37,0.03)]">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FCE8DD] border border-[#EFE3DB] flex items-center justify-center">
                <Brain className="h-4 w-4 text-[#D97757]" />
              </div>
              <span className="font-bold text-[#382A25]">AI Interview</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FFF9F5] border border-[#EFE3DB] text-[#81736C]">
                Q{currentQuestion?.questionNumber || 0}/{totalQuestions}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
                timeRemaining < 60 ? "bg-red-50 text-[#B91C1C] border-red-200" :
                timeRemaining < 180 ? "bg-amber-50 text-[#B45309] border-amber-200" :
                "bg-[#FCE8DD] text-[#D97757] border-[#EFE3DB]"
              }`}>
                <Clock className="h-3.5 w-3.5" />
                <span className="font-mono">{formatTime(timeRemaining)}</span>
              </div>
              <button
                onClick={handleEndInterview}
                className="text-xs font-medium text-[#81736C] hover:text-[#B91C1C] transition-colors"
              >
                End Interview
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline bar background */}
            <div className="h-2 bg-[#EFE3DB] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  timeRemaining < 60 ? "bg-[#B91C1C]" :
                  timeRemaining < 180 ? "bg-[#B45309]" :
                  "bg-[#D97757]"
                }`}
                style={{ width: `${getTimelineSegments().elapsed}%` }}
              />
            </div>
            {/* Timeline labels */}
            <div className="flex justify-between mt-1">
              {getTimelineSegments().segments.map((seg, i) => (
                <span key={i} className="text-[10px] text-[#81736C] font-mono">
                  {seg.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Question Progress */}
      <div className="bg-white border-b border-[#EFE3DB]">
        <div className="max-w-3xl mx-auto">
          <div className="h-1 bg-[#EFE3DB]">
            <div
              className="h-1 bg-[#D97757] transition-all duration-300"
              style={{ width: `${((currentQuestion?.questionNumber || 0) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 bg-[#FFF9F5]">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${
                msg.role === "user"
                  ? "bg-[#D97757] text-white shadow-sm"
                  : "bg-white border border-[#EFE3DB] text-[#382A25] shadow-[0_4px_16px_rgb(56,42,37,0.04)]"
              }`}>
                {msg.role === "ai" && msg.category && (
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${getCategoryColor(msg.category)}`}>
                      {msg.category.replace("_", " ")}
                    </span>
                    {msg.skill && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#FFF9F5] border border-[#EFE3DB] text-[#81736C]">
                        {msg.skill}
                      </span>
                    )}
                    {msg.questionNumber && (
                      <span className="text-xs text-[#81736C] font-semibold">Q{msg.questionNumber}</span>
                    )}
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                {msg.score !== undefined && (
                  <div className="mt-2.5 pt-2 border-t border-[#EFE3DB] flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                      msg.score >= 7 ? "bg-emerald-50 text-[#15803D] border border-emerald-200" :
                      msg.score >= 5 ? "bg-amber-50 text-[#B45309] border border-amber-200" :
                      "bg-red-50 text-[#B91C1C] border border-red-200"
                    }`}>
                      Score: {msg.score}/10
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="bg-white border border-[#EFE3DB] rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-[#D97757] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="h-2 w-2 bg-[#D97757] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="h-2 w-2 bg-[#D97757] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      {!completed && (
        <div className="bg-white border-t border-[#EFE3DB] px-4 py-4 shadow-sm">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-3">
              <textarea
                ref={inputRef}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your answer..."
                rows={2}
                className="flex-1 resize-none border border-[#EFE3DB] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#D97757]/20 focus:border-[#D97757] bg-[#FFF9F5] text-[#382A25] placeholder-[#81736C]/60 outline-none transition-all"
                disabled={sending}
              />
              <button
                onClick={handleSend}
                disabled={!answer.trim() || sending}
                className="bg-[#D97757] text-white p-3 rounded-xl hover:bg-[#B95F42] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-[#81736C] mt-2">Press Enter to send, Shift+Enter for new line</p>
          </div>
        </div>
      )}
    </div>
  );
}
