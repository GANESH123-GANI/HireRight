"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  ChevronDown,
  BarChart3,
  User as UserIcon,
  LogOut,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

interface UserDropdownProps {
  onLogoutClick: () => void;
  customName?: string;
}

export default function UserDropdown({ onLogoutClick, customName }: UserDropdownProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName = customName || user?.name || "User";
  const initial = displayName.charAt(0).toUpperCase() || "U";
  const displayEmail = user?.email || "candidate@techcitta.com";

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleViewResult = async () => {
    setIsOpen(false);
    // 1. Check cached interview ID in sessionStorage
    if (typeof window !== "undefined") {
      const cachedId = sessionStorage.getItem("tcInterviewId");
      if (cachedId) {
        router.push(`/interview/${cachedId}/results`);
        return;
      }
    }

    // 2. Try fetching from /api/interview
    try {
      const res = await fetch("/api/interview", { credentials: "include" });
      const data = await res.json();
      if (data?.success && data?.interview?.id) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("tcInterviewId", data.interview.id);
        }
        router.push(`/interview/${data.interview.id}/results`);
        return;
      }
    } catch (err) {
      console.warn("View result navigation error:", err);
    }

    // 3. Fallback to /interview/results route
    router.push("/interview/results");
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button: [A] Hi, Alex Morgan ▾ */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#FFF9F5] hover:bg-[#FCE8DD]/60 border border-[#EFE3DB] hover:border-[#D97757]/40 transition-all duration-200 cursor-pointer shadow-2xs group"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Open account menu"
      >
        <div className="w-8 h-8 rounded-full bg-[#FCE8DD] border border-[#D97757]/30 flex items-center justify-center text-[#D97757] font-bold text-sm shrink-0 group-hover:scale-105 transition-transform">
          {initial}
        </div>
        <span className="text-xs sm:text-sm font-semibold text-[#382A25] group-hover:text-[#D97757] transition-colors truncate max-w-[95px] xs:max-w-[130px] sm:max-w-[180px]">
          Hi, {displayName}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#81736C] group-hover:text-[#D97757] transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-[#D97757]" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl shadow-xl border border-[#EFE3DB] py-2 z-50 animate-in fade-in zoom-in-95 origin-top-right overflow-hidden"
          role="menu"
        >
          {/* Header Info */}
          <div className="px-4 py-3 bg-[#FFF9F5] border-b border-[#EFE3DB]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FCE8DD] border border-[#D97757]/30 flex items-center justify-center text-[#D97757] font-bold text-base shrink-0">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#382A25] truncate">{displayName}</p>
                <p className="text-xs text-[#81736C] truncate">{displayEmail}</p>
              </div>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FCE8DD] text-[#D97757] border border-[#D97757]/20">
                <ShieldCheck className="w-3 h-3 text-[#D97757]" />
                {user?.role === "admin" ? "Admin" : "Verified Candidate"}
              </span>
            </div>
          </div>

          {/* Action List */}
          <div className="py-1">
            {/* 1. View Result */}
            <button
              type="button"
              onClick={handleViewResult}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-semibold text-[#382A25] hover:bg-[#FCE8DD]/40 hover:text-[#D97757] transition-colors cursor-pointer group"
              role="menuitem"
            >
              <div className="w-8 h-8 rounded-lg bg-[#FCE8DD]/60 group-hover:bg-[#FCE8DD] flex items-center justify-center text-[#D97757] shrink-0 border border-[#D97757]/20 transition-colors">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block font-semibold">View Result</span>
                <span className="block text-[11px] text-[#81736C] font-normal">Scorecard & AI evaluation</span>
              </div>
            </button>

            {/* 2. My Profile */}
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-[#382A25] hover:bg-[#FCE8DD]/40 hover:text-[#D97757] transition-colors group"
              role="menuitem"
            >
              <div className="w-8 h-8 rounded-lg bg-[#FCE8DD]/60 group-hover:bg-[#FCE8DD] flex items-center justify-center text-[#D97757] shrink-0 border border-[#D97757]/20 transition-colors">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block font-semibold">My Profile</span>
                <span className="block text-[11px] text-[#81736C] font-normal">Resume, skills & details</span>
              </div>
            </Link>
          </div>

          {/* Divider */}
          <div className="my-1 border-t border-[#EFE3DB]" />

          {/* Logout */}
          <div className="px-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onLogoutClick();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-sm font-semibold text-[#81736C] hover:text-[#B91C1C] hover:bg-red-50 transition-colors cursor-pointer"
              role="menuitem"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
