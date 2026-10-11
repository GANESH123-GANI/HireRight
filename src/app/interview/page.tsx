"use client";

import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import StepIndicator from "@/components/StepIndicator";
import { useAuth } from "@/contexts/AuthContext";
import { timezoneLabel } from "@/lib/timezone";
import { to24HourTime } from "@/lib/time";
import { ChevronLeft, ChevronRight, CheckCircle, Clock, Lock, ArrowLeft, ArrowRight, Shield, Calendar, Video, Info, LogOut } from "lucide-react";
import LogoutConfirmModal from "@/components/LogoutConfirmModal";
import UserDropdown from "@/components/UserDropdown";

const steps = [
  { number: 1, label: "Profile", sublabel: "Tell us who you are" },
  { number: 2, label: "Resume", sublabel: "Your expertise" },
  { number: 3, label: "Skills & Projects", sublabel: "Your experience & tech stacks" },
  { number: 4, label: "AI Interview", sublabel: "Schedule assessment" },
  { number: 5, label: "All Set!", sublabel: "You're all set!" },
];

const timeSlots = {
  morning: ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"],
  afternoon: ["12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"],
  evening: ["04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM"],
};

export default function InterviewSchedulePage() {
  const router = useRouter();
  const { user, token, logout } = useAuth();
  const [currentStep, setCurrentStep] = useState(4);
  const [selectedTime, setSelectedTime] = useState("01:30 PM");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();
        if (!cancelled && data.success && data.profile?.timezone) {
          setTimezone(data.profile.timezone);
        }
      } catch {
        // keep default
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const tzLabel = timezoneLabel(timezone);

  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const [currentMonth, setCurrentMonth] = useState(() =>
    new Date(today.getFullYear(), today.getMonth() + (today.getDate() > 25 ? 1 : 0), 1)
  );

  const isWeekend = (day: number) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).getDay();
    return d === 0 || d === 6;
  };

  const isPastDay = (day: number) =>
    new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day) < todayMidnight;

  const [selectedDate, setSelectedDate] = useState<number | null>(() => {
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth();
    for (let d = 1; d <= 28; d++) {
      const date = new Date(y, m, d);
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      if (date >= todayMidnight) return d;
    }
    return null;
  });

  const changeMonth = (offset: number) => {
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);
    setCurrentMonth(next);
    if (selectedDate === null) return;
    const selected = new Date(next.getFullYear(), next.getMonth(), selectedDate);
    if (selected.getDay() === 0 || selected.getDay() === 6 || selected < todayMidnight) {
      for (let day = 1; day <= 28; day++) {
        const cand = new Date(next.getFullYear(), next.getMonth(), day);
        if (cand.getDay() !== 0 && cand.getDay() !== 6 && cand >= todayMidnight) {
          setSelectedDate(day);
          break;
        }
      }
    }
  };

  const progress = Math.round((currentStep / steps.length) * 100);
  const displayName = user?.name || "User";

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  const limitedDays = [8, 9, 15, 16, 22, 23, 29, 30];

  const selectedDateLabel =
    selectedDate !== null
      ? currentMonth.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
      : "Select a date";

  const selectedDateShort =
    selectedDate !== null
      ? currentMonth.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
      : "Select a date";

  const saveInterview = async () => {
    if (!token || selectedDate === null) return false;
    setSaving(true);
    setSaveError(null);
    try {
      const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: dateStr,
          // The slot labels are 12-hour ("01:30 PM"); the API expects HH:MM.
          time: to24HourTime(selectedTime) ?? selectedTime,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setSaveError(data.error || "Failed to schedule interview");
        return false;
      }
      if (data.success && data.interview?.id) {
        sessionStorage.setItem("tcInterviewId", data.interview.id);
      }
      return data.success;
    } catch (error) {
      console.error("Failed to save interview:", error);
      setSaveError("Network error. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleConfirm = async () => {
    const saved = await saveInterview();
    if (saved) {
      router.push("/confirmation");
    }
  };

  const handleStartLive = async () => {
    const saved = await saveInterview();
    if (saved) {
      router.push("/interview/room");
    }
  };

  return (
    <div className={`h-screen w-full overflow-hidden flex flex-col lg:flex-row bg-white ${plusJakarta.className}`}>
      <Sidebar currentStep={currentStep} progress={progress} />
      <main className="flex-1 bg-white min-w-0 h-screen flex flex-col overflow-hidden">
        {/* Fixed Header: Top Bar + StepIndicator - permanently fixed at top, never moves when scrolling up or down */}
        <div className="shrink-0 bg-white z-20">
          <div className="h-14 px-4 sm:px-6 lg:px-8 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-[#81736C]">
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
            }}
          />
        </div>
        {/* Scrollable Main Content: Only this container scrolls, header stays permanently fixed at top */}
        <div className="flex-1 overflow-y-auto w-full px-4 sm:px-6 lg:px-8 pb-8 pt-2">
          {/* Success Banner */}
          <div className="bg-white border border-[#EFE3DB] rounded-2xl p-6 mb-6 flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#DCFCE7] flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-[#15803D]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#382A25]">Great! Your resume is uploaded successfully!</h3>
              <p className="text-sm text-[#81736C]">Let&apos;s book your 15-minute AI interview. Choose a time that works best for you.</p>
            </div>
          </div>

          {/* AI Interview Info */}
          <div className="bg-[#FCE8DD]/60 border border-[#D97757]/20 rounded-2xl p-6 mb-6 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-xs">
            <div className="w-12 h-12 bg-white rounded-xl shadow-xs flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">✨</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#D97757]">Just 15 minutes to open doors to endless opportunities.</p>
              <p className="text-xs text-[#81736C] mt-1">Our AI interview is designed to understand you better and match you with roles where you can shine.</p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <Clock className="w-6 h-6 text-[#D97757] mx-auto" />
                <p className="text-[10px] text-[#81736C] mt-1">15 Min<br/>Interview</p>
              </div>
              <div className="text-center">
                <span className="text-2xl">🧠</span>
                <p className="text-[10px] text-[#81736C] mt-1">AI-Powered<br/>Assessment</p>
              </div>
              <div className="text-center">
                <Lock className="w-6 h-6 text-[#D97757] mx-auto" />
                <p className="text-[10px] text-[#81736C] mt-1">Secure &amp;<br/>Private</p>
              </div>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="bg-white border border-[#EFE3DB] rounded-2xl p-6 mb-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#382A25]">4. Select Your 15-Minute Interview Slot</h3>
              <span className="text-xs text-[#81736C] flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#D97757]" />
                Interview duration: 15 minutes
              </span>
            </div>
            <p className="text-sm text-[#81736C] mb-6">All times are shown in <span className="font-semibold text-[#D97757]">{tzLabel} ({timezone})</span></p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Calendar */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-[#382A25]">{monthName}</h4>
                  <div className="flex gap-1">
                    <button
                      onClick={() => changeMonth(-1)}
                      className="p-1.5 hover:bg-[#FCE8DD]/40 text-[#382A25] rounded-lg transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => changeMonth(1)}
                      className="p-1.5 hover:bg-[#FCE8DD]/40 text-[#382A25] rounded-lg transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-[#81736C] py-2">{day}</div>
                  ))}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isAvailable = !isWeekend(day) && !isPastDay(day);
                    const isLimited = isAvailable && limitedDays.includes(day);
                    const isSelected = day === selectedDate;

                    return (
                      <button
                        key={day}
                        onClick={() => isAvailable && setSelectedDate(day)}
                        disabled={!isAvailable}
                        className={`relative w-full aspect-square flex items-center justify-center text-sm rounded-xl transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#D97757] text-white font-bold shadow-xs"
                            : isAvailable
                            ? "hover:bg-[#FCE8DD]/40 text-[#382A25] font-medium"
                            : "text-[#81736C]/40 cursor-not-allowed"
                        }`}
                      >
                        {day}
                        {isAvailable && !isSelected && (
                          <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isLimited ? "bg-[#B45309]" : "bg-[#D97757]"}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs text-[#81736C]">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#D97757]" /> Available</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#B45309]" /> Limited Slots</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#EFE3DB]" /> Unavailable</span>
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <h4 className="font-bold text-[#382A25] mb-4 uppercase tracking-wider text-xs">{selectedDateLabel}</h4>
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold text-[#81736C] uppercase tracking-wider mb-3">Morning</p>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.morning.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`time-slot ${selectedTime === time ? "selected" : ""}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#81736C] uppercase tracking-wider mb-3">Afternoon</p>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.afternoon.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`time-slot ${selectedTime === time ? "selected" : ""}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#81736C] uppercase tracking-wider mb-3">Evening</p>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.evening.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`time-slot ${selectedTime === time ? "selected" : ""}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Time Confirmation */}
          <div className="bg-white border border-[#EFE3DB] rounded-2xl p-4 sm:p-5 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-[#15803D]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#382A25]">You&apos;ve selected</p>
                <p className="text-sm text-[#81736C]">{selectedDateShort}</p>
                <p className="text-sm font-semibold text-[#D97757]">{selectedTime} ({tzLabel})</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-xs text-[#81736C]">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#D97757]" /> Reminder before interview</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#D97757]" /> Reschedule anytime</span>
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-[#15803D]" /> Secure &amp; distraction-free</span>
            </div>
          </div>

          {/* All Set Banner */}
          <div className="bg-[#FCE8DD]/40 border border-[#D97757]/20 rounded-2xl p-6 mb-6 flex items-center gap-4 shadow-xs">
            <span className="text-4xl">🎉</span>
            <div className="flex-1">
              <h4 className="font-bold text-[#382A25]">All Set! You&apos;re Good to Go!</h4>
              <p className="text-sm text-[#81736C]">We&apos;re looking forward to your interview. Get ready to showcase your <strong>best</strong> self.</p>
            </div>
            <div className="w-12 h-12 bg-[#D97757] rounded-xl flex items-center justify-center text-white shadow-xs">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <button
              onClick={() => router.push("/profile")}
              className="rounded-xl flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 border border-[#EFE3DB] bg-white text-[#382A25] text-sm font-semibold hover:bg-[#FCE8DD]/30 transition-colors shadow-xs cursor-pointer w-full sm:w-auto order-2 sm:order-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto order-1 sm:order-2">
              <button
                onClick={handleStartLive}
                disabled={saving || selectedDate === null}
                className="rounded-xl flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-[#FCE8DD] border border-[#D97757]/30 text-[#D97757] hover:bg-[#D97757] hover:text-white text-sm font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer w-full sm:w-auto"
              >
                {saving ? (
                  <>Saving...</>
                ) : (
                  <><Video className="w-4 h-4" /> Start Live Interview</>
                )}
              </button>
              <button
                onClick={handleConfirm}
                disabled={saving || selectedDate === null}
                className="rounded-xl flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#D97757] to-[#B95F42] hover:from-[#B95F42] hover:to-[#a04e33] text-white text-sm font-bold transition-all shadow-md shadow-[#D97757]/25 disabled:opacity-50 cursor-pointer w-full sm:w-auto"
              >
                {saving ? "Saving..." : "Confirm & Continue"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {saveError && (
              <div className="mt-3 bg-red-50 border border-red-200 text-[#B91C1C] text-sm rounded-xl p-3 text-center w-full">
                {saveError}
              </div>
            )}
          </div>
          <p className="text-center text-xs text-[#81736C] mt-5 flex items-center justify-center gap-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 text-[#D97757]" />
            Your information is encrypted and secure
          </p>
        </div>
        <LogoutConfirmModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={() => {
            setShowLogoutModal(false);
            logout();
          }}
        />
      </main>
    </div>
  );
}
