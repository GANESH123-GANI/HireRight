"use client";

import { useEffect } from "react";
import { LogOut, X, AlertCircle } from "lucide-react";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export default function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure you want to log out?",
  message = "Your progress has been saved. You will be logged out and returned to the main landing page with Sign In and Sign Up options.",
  confirmText = "Yes, Log Out",
  cancelText = "No, Stay Here",
}: LogoutConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#EFE3DB] p-6 sm:p-7 text-center overflow-hidden transition-all duration-200 transform scale-100 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#81736C] hover:text-[#382A25] hover:bg-[#FCE8DD]/40 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon Circle */}
        <div className="w-14 h-14 rounded-full bg-[#FCE8DD] border border-[#D97757]/30 flex items-center justify-center mx-auto mb-4 text-[#D97757] shadow-xs">
          <LogOut className="w-6 h-6 stroke-[2.2]" />
        </div>

        {/* Title */}
        <h3 id="logout-modal-title" className="text-xl font-bold text-[#382A25] tracking-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[#81736C] mt-2 mb-6 leading-relaxed">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl border border-[#EFE3DB] bg-[#FFF9F5] text-sm font-semibold text-[#382A25] hover:bg-[#FCE8DD]/40 hover:border-[#D97757]/30 transition-all duration-200 cursor-pointer shadow-2xs"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D97757] to-[#B95F42] hover:from-[#B95F42] hover:to-[#A04E35] text-sm font-bold text-white shadow-md shadow-[#D97757]/25 transition-all duration-200 cursor-pointer hover:shadow-lg"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
