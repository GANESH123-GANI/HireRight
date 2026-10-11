"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Clock, Sun, Sunset, Check } from "lucide-react";

export interface TimeSlotOption {
  value: string;
  label: string;
  period: "Morning" | "Afternoon" | "Evening";
  timeRange: string;
  description: string;
}

export const TIME_SLOT_OPTIONS: TimeSlotOption[] = [
  {
    value: "Morning (9 AM - 12 PM)",
    label: "Morning (9 AM - 12 PM)",
    period: "Morning",
    timeRange: "09:00 AM – 12:00 PM",
    description: "Best for focused early morning assessments",
  },
  {
    value: "Afternoon (12 PM - 4 PM)",
    label: "Afternoon (12 PM - 4 PM)",
    period: "Afternoon",
    timeRange: "12:00 PM – 04:00 PM",
    description: "Convenient midday interview slot",
  },
  {
    value: "Evening (4 PM - 7 PM)",
    label: "Evening (4 PM - 7 PM)",
    period: "Evening",
    timeRange: "04:00 PM – 07:00 PM",
    description: "Flexible post-work evening session",
  },
];

interface TimeSlotPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  id?: string;
}

export default function TimeSlotPicker({
  value,
  onChange,
  className = "",
  id = "time-slot-picker",
}: TimeSlotPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = TIME_SLOT_OPTIONS.find((opt) => opt.value === value);

  // Close on outside click or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const getPeriodIcon = (period: string, isSelected: boolean) => {
    switch (period) {
      case "Morning":
        return <Sun className={`w-4 h-4 ${isSelected ? "text-[#D97757]" : "text-[#D97757]"}`} />;
      case "Afternoon":
        return <Clock className={`w-4 h-4 ${isSelected ? "text-[#D97757]" : "text-[#D97757]"}`} />;
      case "Evening":
        return <Sunset className={`w-4 h-4 ${isSelected ? "text-[#D97757]" : "text-[#D97757]"}`} />;
      default:
        return <Clock className="w-4 h-4 text-[#D97757]" />;
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Button styled in our warm brand UI */}
      <button
        id={id}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full rounded-xl border p-2.5 sm:p-3 text-sm font-medium transition-all duration-200 flex items-center justify-between cursor-pointer bg-white ${
          isOpen
            ? "border-[#D97757] ring-2 ring-[#D97757]/20 shadow-xs"
            : "border-[#EFE3DB] hover:border-[#D97757]/60 hover:bg-[#FFF9F5]"
        }`}
      >
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
              selectedOption
                ? "bg-[#FCE8DD] border-[#D97757]/30 text-[#D97757]"
                : "bg-[#FFF9F5] border-[#EFE3DB] text-[#81736C]"
            }`}
          >
            {selectedOption ? (
              getPeriodIcon(selectedOption.period, true)
            ) : (
              <Clock className="w-4 h-4 text-[#81736C]" />
            )}
          </div>
          <div className="min-w-0 text-left">
            {selectedOption ? (
              <span className="block text-xs sm:text-sm font-semibold text-[#382A25] truncate">
                {selectedOption.label}
              </span>
            ) : (
              <span className="block text-xs sm:text-sm text-[#81736C] font-normal">
                Select preferred time slot
              </span>
            )}
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-[#81736C] transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? "rotate-180 text-[#D97757]" : ""
          }`}
        />
      </button>

      {/* Custom UI Dropdown Popover */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white rounded-2xl border border-[#EFE3DB] shadow-xl p-1.5 animate-in fade-in zoom-in-95 origin-top overflow-hidden max-h-[60vh] sm:max-h-[70vh] overflow-y-auto"
        >
          <div className="px-3 py-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#81736C] border-b border-[#EFE3DB]/60 flex items-center justify-between">
            <span>Available Time Slots</span>
            <span className="text-[10px] text-[#D97757] font-semibold">15 Min Session</span>
          </div>

          <div className="space-y-1 pt-1.5">
            {TIME_SLOT_OPTIONS.map((option) => {
              const isSelected = option.value === value;
              return (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl transition-all duration-150 cursor-pointer group ${
                    isSelected
                      ? "bg-[#FCE8DD] text-[#382A25] font-semibold border border-[#D97757]/30"
                      : "hover:bg-[#FFF9F5] text-[#382A25] border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                        isSelected
                          ? "bg-white border-[#D97757]/30"
                          : "bg-[#FFF9F5] border-[#EFE3DB] group-hover:border-[#D97757]/30 group-hover:bg-[#FCE8DD]/40"
                      }`}
                    >
                      {getPeriodIcon(option.period, isSelected)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="text-xs sm:text-sm font-semibold text-[#382A25]">
                          {option.label}
                        </span>
                        <span
                          className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full ${
                            isSelected
                              ? "bg-white text-[#D97757] border border-[#D97757]/30"
                              : "bg-[#FFF9F5] text-[#81736C] border border-[#EFE3DB]"
                          }`}
                        >
                          {option.period}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-[#81736C] mt-0.5 truncate">
                        {option.description}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#D97757] flex items-center justify-center text-white shrink-0 ml-2 shadow-2xs">
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
