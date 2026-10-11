"use client";

import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import StepIndicator from "@/components/StepIndicator";
import { useAuth } from "@/contexts/AuthContext";
import { timezoneLabel } from "@/lib/timezone";
import { formatTimeLabel } from "@/lib/time";
import { CheckCircle, Calendar, Clock, Video, Info, Mail, MessageCircle, ChevronRight, Shield, Star, X, ArrowRight, LogOut } from "lucide-react";
import LogoutConfirmModal from "@/components/LogoutConfirmModal";
import UserDropdown from "@/components/UserDropdown";

const steps = [
  { number: 1, label: "Profile", sublabel: "Tell us who you are" },
  { number: 2, label: "Resume", sublabel: "Your expertise" },
  { number: 3, label: "Skills & Projects", sublabel: "Your experience & tech stacks" },
  { number: 4, label: "AI Interview", sublabel: "Schedule assessment" },
  { number: 5, label: "All Set!", sublabel: "You're all set!" },
];

interface InterviewData {
  date: string;
  time: string;
  emailSent?: boolean;
  whatsappSent?: boolean;
  reminder24hSent?: boolean;
  reminder1hSent?: boolean;
  reminder15mSent?: boolean;
  reminderNowSent?: boolean;
  [key: string]: unknown;
}

interface ProfileData {
  phone?: string | null;
  timezone?: string | null;
  [key: string]: unknown;
}

export default function ConfirmationPage() {
  const router = useRouter();
  const { user, token, logout } = useAuth();
  const [currentStep] = useState(5);
  const [interview, setInterview] = useState<InterviewData | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const progress = Math.round((currentStep / steps.length) * 100);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    (async () => {
      try {
        const [interviewRes, profileRes] = await Promise.all([
          fetch("/api/interview"),
          fetch("/api/profile"),
        ]);
        const interviewData = await interviewRes.json();
        const profileData = await profileRes.json();
        if (cancelled) return;
        if (interviewData.success && interviewData.interview) {
          setInterview(interviewData.interview as InterviewData);
          if (interviewData.interview.id) {
            sessionStorage.setItem("tcInterviewId", interviewData.interview.id);
          }
        }
        if (profileData.success && profileData.profile) {
          setProfile(profileData.profile as ProfileData);
        }
      } catch (error) {
        console.error("Failed to fetch interview details:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "TBD";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  };

  const formatShortDate = (dateStr: string) => {
    if (!dateStr) return "TBD";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const displayName = user?.name || "there";
  const displayEmail = user?.email || "your email";
  const displayPhone = user?.phone || profile?.phone || "Not provided";
  const interviewDate = interview?.date || "2025-05-19";
  // Stored as HH:MM (24-hour); older rows may still hold "01:30 PM".
  const interviewTime = formatTimeLabel(interview?.time || "01:30 PM");
  const tzLabel = timezoneLabel(profile?.timezone || "Asia/Kolkata");

  const addToCalendar = () => {
    const dateStr = interviewDate.replace(/-/g, "");
    const timeMatch = interviewTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!timeMatch) return;

    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const period = timeMatch[3].toUpperCase();
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    const end = new Date(2000, 0, 1, hours, minutes + 15);
    const pad = (n: number) => String(n).padStart(2, "0");
    const startTimeStr = `${pad(hours)}${pad(minutes)}00`;
    const endTimeStr = `${pad(end.getHours())}${pad(end.getMinutes())}00`;

    const title = encodeURIComponent("HireRight AI Interview");
    const details = encodeURIComponent(`Your 15-minute AI interview with HireRight.\n\nMode: AI Video Interview\nType: Technical + Behavioral Assessment\n\nWe look forward to meeting you!\n– Team HireRight`);
    const location = encodeURIComponent("Online - AI Video Interview");
    
    // Google Calendar link
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}T${startTimeStr}/${dateStr}T${endTimeStr}&details=${details}&location=${location}`;
    
    window.open(googleUrl, "_blank");
  };

  const interviewGuide = {
    technical: [
      "Review your resume and be ready to discuss your projects in detail",
      "Prepare examples of technical challenges you've solved",
      "Be ready to explain your problem-solving approach",
      "Know your tech stack and be honest about areas you're still learning",
    ],
    behavioral: [
      "Use the STAR method (Situation, Task, Action, Result) for answers",
      "Prepare examples of teamwork and leadership",
      "Be ready to discuss how you handle challenges and conflicts",
      "Show enthusiasm for learning and growth",
    ],
    general: [
      "Test your camera and microphone before the interview",
      "Find a quiet, well-lit space with minimal distractions",
      "Dress professionally even for a virtual interview",
      "Keep your resume handy for reference during the conversation",
      "Prepare thoughtful questions about the role and company",
      "Be authentic - the AI adapts to your responses",
    ],
  };

  return (
    <div className={`h-screen w-full overflow-hidden flex flex-col lg:flex-row bg-white ${plusJakarta.className}`}>
      <Sidebar currentStep={currentStep} progress={progress} />
      <main className="flex-1 bg-white min-w-0 h-screen flex flex-col overflow-hidden">
        {/* Fixed Header: Top Bar + StepIndicator - permanently fixed at top, never moves when scrolling up or down */}
        <div className="shrink-0 bg-white z-20">
          <div className="h-14 px-4 sm:px-6 lg:px-8 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-[#81736C] font-medium tracking-wide">
              <Shield className="w-4 h-4 text-[#D97757]" />
              Your data is safe with us
            </div>
            <div className="flex items-center gap-3">
              <UserDropdown onLogoutClick={() => setShowLogoutModal(true)} customName={displayName} />
            </div>
          </div>
          <StepIndicator
            steps={steps}
            currentStep={currentStep}
            onStepClick={(step) => {
              if (step <= 3) router.push(`/profile?step=${step}`);
              else if (step === 4) router.push("/interview");
            }}
          />
        </div>
        {/* Scrollable Main Content: Only this container scrolls, header stays permanently fixed at top */}
        <div className="flex-1 overflow-y-auto w-full px-4 sm:px-6 lg:px-8 pb-12 pt-2">
          {/* Success Banner */}
          <div className="bg-white border border-[#EFE3DB] rounded-2xl p-6 sm:p-7 mb-6 flex items-center gap-6 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#FCE8DD] border border-[#D97757]/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-7 h-7 text-[#15803D]" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#382A25]">All Set, {displayName}!</h3>
              <p className="text-base font-semibold text-[#D97757]">Your 15-Minute AI Interview is Confirmed!</p>
              <p className="text-sm text-[#81736C] mt-1">We&apos;re excited to connect with you and help you take the next step in your career journey.</p>
            </div>
            <div className="hidden lg:flex w-20 h-20 bg-[#FCE8DD]/60 rounded-2xl border border-[#EFE3DB] items-center justify-center">
              <span className="text-3xl">🤖</span>
            </div>
          </div>

          {/* Start Live Interview CTA */}
          <div className="bg-white border border-[#EFE3DB] rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FCE8DD] border border-[#D97757]/20 flex items-center justify-center flex-shrink-0">
                <Video className="w-6 h-6 text-[#D97757]" />
              </div>
              <div>
                <p className="font-bold text-[#382A25]">Ready when you are!</p>
                <p className="text-sm text-[#81736C]">Start your 15-minute AI video interview now.</p>
              </div>
            </div>
            <Link
              href="/interview/room"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D97757] hover:bg-[#B95F42] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all w-full sm:w-auto shrink-0"
            >
              Start Live Interview
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Interview Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-[#EFE3DB] rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#382A25] mb-4 uppercase tracking-wider text-xs">Your Interview Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#D97757] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-[#81736C] uppercase tracking-wider">Date</p>
                    <p className="text-sm font-bold text-[#382A25]">{formatDate(interviewDate)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#D97757] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-[#81736C] uppercase tracking-wider">Time</p>
                    <p className="text-sm font-bold text-[#382A25] flex items-center flex-wrap gap-2">
                      {interviewTime} ({tzLabel}) 
                      <span className="px-2.5 py-0.5 bg-[#FCE8DD] text-[#D97757] text-xs font-semibold rounded-md border border-[#D97757]/20">15 Min Interview</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Video className="w-5 h-5 text-[#D97757] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-[#81736C] uppercase tracking-wider">Interview Mode</p>
                    <p className="text-sm font-bold text-[#382A25]">AI Video Interview</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#D97757] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-[#81736C] uppercase tracking-wider">Interview Type</p>
                    <p className="text-sm font-bold text-[#382A25]">Technical + Behavioral Assessment</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={addToCalendar}
                className="w-full mt-6 py-3 border border-[#EFE3DB] bg-[#FFF9F5] text-[#D97757] text-sm font-semibold rounded-xl hover:bg-[#FCE8DD]/50 hover:border-[#D97757] transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <Calendar className="w-4 h-4" />
                Add to Calendar
              </button>
            </div>

            <div className="bg-white border border-[#EFE3DB] rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#382A25] mb-4 uppercase tracking-wider text-xs">What&apos;s Next?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#15803D] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[#81736C]">Our AI will conduct a fair and personalized conversation to understand you better.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#15803D] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[#81736C]">Showcase your skills, experiences and problem-solving approach.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#15803D] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[#81736C]">Get matched with opportunities that are the right fit for you.</span>
                </li>
              </ul>
              <button 
                onClick={() => setShowGuide(true)}
                className="w-full mt-6 py-3 bg-[#D97757] hover:bg-[#B95F42] text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                View Interview Guide
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Confirmation Sent */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-[#382A25]">We&apos;ve Sent You a Confirmation!</h3>
            <p className="text-sm text-[#81736C]">Check your email and WhatsApp for all the details.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Email */}
            <div className="bg-white border border-[#EFE3DB] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#D97757]" />
                  <span className="font-bold text-[#382A25] text-sm">Email</span>
                </div>
                {interview?.emailSent ? (
                  <span className="flex items-center gap-1 text-xs text-[#15803D] font-bold"><CheckCircle className="w-3.5 h-3.5" /> Sent</span>
                ) : (
                  <span className="text-xs text-[#81736C] font-medium">Not sent</span>
                )}
              </div>
              <div className="text-sm text-[#81736C] mb-3">
                <p>To: <span className="text-[#382A25] font-semibold">{displayEmail}</span></p>
                <p className="line-clamp-1">Subject: <span className="text-[#382A25] font-semibold">Your AI Interview is Confirmed – {formatShortDate(interviewDate)}</span></p>
              </div>
              <div className="bg-[#FFF9F5] border border-[#EFE3DB] rounded-xl p-4 text-xs text-[#81736C] space-y-1.5">
                <p className="font-semibold text-[#382A25]">Hi {displayName},</p>
                <p>Great news! Your 15-minute AI interview is confirmed.</p>
                <p className="font-medium text-[#382A25]">📅 Date: {formatDate(interviewDate)}</p>
                <p className="font-medium text-[#382A25]">🕐 Time: {interviewTime} ({tzLabel})</p>
                <p>We look forward to meeting you!</p>
                <p className="text-[#81736C]">– Team HireRight</p>
              </div>
              <button 
                onClick={() => {
                  const subject = encodeURIComponent(`Your AI Interview is Confirmed – ${formatShortDate(interviewDate)}`);
                  const body = encodeURIComponent(`Hi ${displayName},\n\nGreat news! Your 15-minute AI interview is confirmed.\n\n📅 Date: ${formatDate(interviewDate)}\n🕐 Time: ${interviewTime} (${tzLabel})\n\nWe look forward to meeting you!\n\n– Team HireRight`);
                  window.open(`mailto:${displayEmail}?subject=${subject}&body=${body}`, "_blank");
                }}
                className="w-full mt-4 py-2.5 border border-[#EFE3DB] bg-[#FFF9F5] text-[#382A25] text-xs font-semibold rounded-xl hover:bg-[#FCE8DD]/40 hover:border-[#D97757] transition-all"
              >
                Open Email
              </button>
            </div>

            {/* WhatsApp */}
            <div className="bg-white border border-[#EFE3DB] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#15803D]" />
                  <span className="font-bold text-[#382A25] text-sm">WhatsApp</span>
                </div>
                {interview?.whatsappSent ? (
                  <span className="flex items-center gap-1 text-xs text-[#15803D] font-bold"><CheckCircle className="w-3.5 h-3.5" /> Sent</span>
                ) : (
                  <span className="text-xs text-[#81736C] font-medium">Not sent</span>
                )}
              </div>
              <div className="text-sm text-[#81736C] mb-3">
                <p>To: <span className="text-[#382A25] font-semibold">{displayPhone}</span></p>
              </div>
              <div className="bg-[#FFF9F5] border border-[#EFE3DB] rounded-xl p-4 text-xs text-[#81736C] space-y-1.5">
                <p className="font-semibold text-[#382A25]">Hi {displayName}!</p>
                <p>Your 15-minute AI Interview is confirmed.</p>
                <p className="font-medium text-[#382A25]">📅 {formatShortDate(interviewDate)}</p>
                <p className="font-medium text-[#382A25]">🕐 {interviewTime} ({tzLabel})</p>
                <p>We&apos;re excited to connect with you and help you find the right opportunities.</p>
                <p className="text-[#81736C]">– Team HireRight</p>
              </div>
              <button 
                onClick={() => {
                  const phone = displayPhone.replace(/[^0-9]/g, "");
                  const message = encodeURIComponent(`Hi ${displayName}!\n\nYour 15-minute AI Interview is confirmed.\n\n📅 ${formatShortDate(interviewDate)}\n🕐 ${interviewTime} (${tzLabel})\n\nWe're excited to connect with you and help you find the right opportunities.\n\n– Team HireRight`);
                  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
                }}
                className="w-full mt-4 py-2.5 bg-[#15803D] hover:bg-[#15803D]/90 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                Open WhatsApp
              </button>
            </div>
          </div>

          {/* Reminders */}
          <div className="bg-white border border-[#EFE3DB] rounded-2xl p-6 mb-6 shadow-sm">
            <h3 className="text-base font-bold text-[#382A25] mb-1">We&apos;ll Remind You!</h3>
            <p className="text-sm text-[#81736C] mb-6">You&apos;ll get reminders so you never miss your interview.</p>
            <div className="flex items-center justify-between">
              {[
                { 
                  time: "24 Hours Before", 
                  desc: "Reminder via Email & WhatsApp.", 
                  icon: "📧",
                  sent: interview?.reminder24hSent || false,
                  field: "reminder24hSent"
                },
                { 
                  time: "1 Hour Before", 
                  desc: "Quick reminder with tips.", 
                  icon: "⏰",
                  sent: interview?.reminder1hSent || false,
                  field: "reminder1hSent"
                },
                { 
                  time: "15 Min Before", 
                  desc: "Final reminder to join.", 
                  icon: "🔔",
                  sent: interview?.reminder15mSent || false,
                  field: "reminder15mSent"
                },
                { 
                  time: "Interview Time", 
                  desc: "Join and ace your session!", 
                  icon: "🎯",
                  sent: interview?.reminderNowSent || false,
                  field: "reminderNowSent"
                },
              ].map((reminder, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="text-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 border ${
                      reminder.sent 
                        ? "bg-[#15803D]/10 border-[#15803D]/30" 
                        : "bg-[#FCE8DD] border-[#D97757]/20"
                    }`}>
                      {reminder.sent ? (
                        <CheckCircle className="w-6 h-6 text-[#15803D]" />
                      ) : (
                        <span className="text-xl">{reminder.icon}</span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-[#382A25]">{reminder.time}</p>
                    <p className="text-[10px] text-[#81736C] max-w-[100px] mt-0.5">{reminder.desc}</p>
                    {reminder.sent && (
                      <p className="text-[10px] text-[#15803D] font-bold mt-1">✓ Sent</p>
                    )}
                  </div>
                  {i < 3 && <ChevronRight className="w-4 h-4 text-[#EFE3DB]" />}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-r from-[#D97757] to-[#B95F42] rounded-2xl p-6 sm:p-7 flex items-center gap-6 shadow-md text-white">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Star className="w-7 h-7 text-white fill-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold">You&apos;ve Taken the Right Step!</h4>
              <p className="text-sm text-white/90 mt-1">Believe in yourself. Showcase your best. Opportunities are waiting for you!</p>
              <p className="text-sm text-white/90">We&apos;re with you, every step of the way.</p>
            </div>
          </div>
          <p className="text-center text-xs text-[#81736C] mt-6">
            If you need any help, reach out to us at <span className="text-[#D97757] font-semibold">care@hireright.com</span>
          </p>
        </div>
      </main>

      {/* Interview Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-[#EFE3DB] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-[#EFE3DB] px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#382A25]">AI Interview Guide</h2>
                <p className="text-sm text-[#81736C]">Tips to help you succeed in your 15-minute interview</p>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="w-9 h-9 rounded-xl hover:bg-[#FCE8DD] flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-[#81736C]" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Technical Questions */}
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FCE8DD] flex items-center justify-center">
                    <span className="text-base">💻</span>
                  </div>
                  <h3 className="font-bold text-[#382A25] text-sm uppercase tracking-wide">Technical Questions</h3>
                </div>
                <ul className="space-y-2 ml-10">
                  {interviewGuide.technical.map((tip, i) => (
                    <li key={i} className="text-sm text-[#81736C] flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#15803D] mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Behavioral Questions */}
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FCE8DD] flex items-center justify-center">
                    <span className="text-base">🤝</span>
                  </div>
                  <h3 className="font-bold text-[#382A25] text-sm uppercase tracking-wide">Behavioral Questions</h3>
                </div>
                <ul className="space-y-2 ml-10">
                  {interviewGuide.behavioral.map((tip, i) => (
                    <li key={i} className="text-sm text-[#81736C] flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#15803D] mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* General Tips */}
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FCE8DD] flex items-center justify-center">
                    <span className="text-base">✅</span>
                  </div>
                  <h3 className="font-bold text-[#382A25] text-sm uppercase tracking-wide">General Tips</h3>
                </div>
                <ul className="space-y-2 ml-10">
                  {interviewGuide.general.map((tip, i) => (
                    <li key={i} className="text-sm text-[#81736C] flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#15803D] mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interview Format */}
              <div className="bg-[#FFF9F5] border border-[#EFE3DB] rounded-xl p-5">
                <h3 className="font-bold text-[#D97757] mb-3 text-xs uppercase tracking-wider">Interview Format</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#D97757]" />
                    <span className="text-[#382A25] font-medium">Duration: 15 minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#D97757]" />
                    <span className="text-[#382A25] font-medium">Mode: AI Video Interview</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#D97757]" />
                    <span className="text-[#382A25] font-medium">5-6 questions total</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#D97757]" />
                    <span className="text-[#382A25] font-medium">Fair & unbiased evaluation</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-[#EFE3DB] px-6 py-4">
              <button
                onClick={() => setShowGuide(false)}
                className="w-full py-3 bg-[#D97757] hover:bg-[#B95F42] text-white font-semibold rounded-xl transition-colors shadow-sm"
              >
                Got it, I&apos;m Ready!
              </button>
            </div>
          </div>
        </div>
      )}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          logout();
        }}
      />
    </div>
  );
}
