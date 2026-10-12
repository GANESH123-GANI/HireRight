"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  X,
  Shield,
  Building2,
  Users,
  LogOut,
  Video,
  LayoutDashboard,
  FileCheck2,
  BookOpen,
  DollarSign,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const solutions = [
    {
      name: "For Job Seekers",
      href: "/profile",
      icon: Users,
      description: "Build your verified profile and get AI matched",
    },
    {
      name: "Recruiter Dashboard",
      href: "/admin",
      icon: Building2,
      description: "Screen candidates with autonomous AI interviews",
    },
    {
      name: "Government Screening",
      href: "/government",
      icon: Shield,
      description: "Official verified background & ID screening",
    },
    {
      name: "Enterprise Solutions",
      href: "/enterprise",
      icon: Building2,
      description: "Scale hiring with custom ATS & SSO integrations",
    },
  ];

  const resources = [
    {
      name: "Career Intelligence Results",
      href: "/interview/results",
      icon: FileCheck2,
      description: "Executive scorecard & AI evaluation reports",
    },
    {
      name: "Pricing & Plans",
      href: "/pricing",
      icon: DollarSign,
      description: "Flexible pay-per-screen & enterprise tiers",
    },
    {
      name: "API Documentation",
      href: "/api-docs",
      icon: BookOpen,
      description: "RESTful endpoints for custom integrations",
    },
    {
      name: "Help & Contact",
      href: "/contact",
      icon: HelpCircle,
      description: "24/7 dedicated enterprise support team",
    },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-[100] bg-white text-slate-800 border-b border-gray-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] w-full transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16">
          
          {/* ========================================= */}
          {/* LEFT: BRAND LOGO                          */}
          {/* ========================================= */}
          <div className="flex items-center gap-8 lg:gap-11">
            <Link href="/" className="flex items-center group shrink-0" title="HireRight Home">
              <div className="flex flex-col">
                <div className="flex items-center tracking-tight leading-none">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    HIRE
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-[#DC2626] ml-1 tracking-tight">
                    RIGHT
                  </span>
                </div>
                <span className="text-[9px] font-medium text-slate-500 tracking-tight mt-0.5 select-none">
                  Right People. Right Decisions.
                </span>
              </div>
            </Link>

            {/* ========================================= */}
            {/* CENTER: DESKTOP NAVIGATION LINKS          */}
            {/* ========================================= */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {/* 1. For Job Seekers */}
              <Link
                href="/profile"
                className={`relative py-2 text-sm font-semibold transition-colors duration-200 group ${
                  isActive("/profile") ? "text-[#DC2626] font-bold" : "text-slate-700 hover:text-[#DC2626]"
                }`}
              >
                <span>For Job Seekers</span>
                <span
                  className={`absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#DC2626] rounded-full transition-all duration-300 ease-out origin-center ${
                    isActive("/profile")
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                  }`}
                />
              </Link>

              {/* 2. Why HireRight */}
              <Link
                href="/enterprise"
                className={`relative py-2 text-sm font-semibold transition-colors duration-200 group ${
                  isActive("/enterprise") ? "text-[#DC2626] font-bold" : "text-slate-700 hover:text-[#DC2626]"
                }`}
              >
                <span>Why HireRight</span>
                <span
                  className={`absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#DC2626] rounded-full transition-all duration-300 ease-out origin-center ${
                    isActive("/enterprise")
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                  }`}
                />
              </Link>

              {/* 3. Solutions Dropdown */}
              <div
                className="relative py-2 group"
                onMouseEnter={() => setActiveDropdown("solutions")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  className={`flex items-center gap-1 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                    activeDropdown === "solutions" ? "text-[#DC2626] font-bold" : "text-slate-700 group-hover:text-[#DC2626]"
                  }`}
                >
                  <span>Solutions</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeDropdown === "solutions" ? "rotate-180 text-[#DC2626]" : "text-slate-400 group-hover:text-[#DC2626]"
                    }`}
                  />
                </button>
                <span
                  className={`absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#DC2626] rounded-full transition-all duration-300 ease-out origin-center ${
                    activeDropdown === "solutions"
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                  }`}
                />

                {activeDropdown === "solutions" && (
                  <div className="absolute top-full left-0 w-80 bg-white border border-gray-100 shadow-xl py-2 mt-2 rounded-2xl z-50 animate-in fade-in zoom-in-95 origin-top-left overflow-hidden">
                    {solutions.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors duration-200 border-l-2 border-transparent hover:border-[#DC2626]"
                      >
                        <div className="w-10 h-10 bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0 rounded-xl text-[#DC2626]">
                          <item.icon className="w-5 h-5 text-[#DC2626]" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Resources Dropdown */}
              <div
                className="relative py-2 group"
                onMouseEnter={() => setActiveDropdown("resources")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  className={`flex items-center gap-1 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                    activeDropdown === "resources" ? "text-[#DC2626] font-bold" : "text-slate-700 group-hover:text-[#DC2626]"
                  }`}
                >
                  <span>Resources</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeDropdown === "resources" ? "rotate-180 text-[#DC2626]" : "text-slate-400 group-hover:text-[#DC2626]"
                    }`}
                  />
                </button>
                <span
                  className={`absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#DC2626] rounded-full transition-all duration-300 ease-out origin-center ${
                    activeDropdown === "resources"
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                  }`}
                />

                {activeDropdown === "resources" && (
                  <div className="absolute top-full left-0 w-80 bg-white border border-gray-100 shadow-xl py-2 mt-2 rounded-2xl z-50 animate-in fade-in zoom-in-95 origin-top-left overflow-hidden">
                    {resources.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors duration-200 border-l-2 border-transparent hover:border-[#DC2626]"
                      >
                        <div className="w-10 h-10 bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 rounded-xl text-slate-700">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. About Us */}
              <Link
                href="/contact"
                className={`relative py-2 text-sm font-semibold transition-colors duration-200 group ${
                  isActive("/contact") ? "text-[#DC2626] font-bold" : "text-slate-700 hover:text-[#DC2626]"
                }`}
              >
                <span>About Us</span>
                <span
                  className={`absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#DC2626] rounded-full transition-all duration-300 ease-out origin-center ${
                    isActive("/contact")
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            </div>
          </div>

          {/* ========================================= */}
          {/* RIGHT: DASHBOARD + AI INTERVIEW + AUTH    */}
          {/* ========================================= */}
          <div className="hidden md:flex items-center gap-3.5 shrink-0">
            {/* Dashboard Link */}
            <Link
              href="/dashboard"
              className={`text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive("/dashboard") || isActive("/admin")
                  ? "text-[#DC2626] font-bold bg-red-50/80"
                  : "text-slate-700 hover:text-[#DC2626] hover:bg-slate-50"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-slate-600" />
              <span>Dashboard</span>
            </Link>

            {/* AI Interview Pill Button (Matching reference) */}
            <Link
              href="/interview"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950 hover:bg-black text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer"
            >
              <Video className="w-3.5 h-3.5 text-red-400" />
              <span>AI Interview</span>
            </Link>

            {/* User State or Sign In / Sign Up */}
            {user ? (
              <div className="flex items-center gap-2 ml-1">
                <Link
                  href={user.role === "admin" ? "/admin" : "/profile"}
                  className="inline-flex items-center gap-2 max-w-[160px] truncate px-3 py-1.5 bg-slate-100/80 hover:bg-slate-200/80 text-slate-800 text-xs font-semibold rounded-full border border-slate-200 transition-colors"
                  title={user.name || "View Profile"}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="truncate">{user.name || (user.role === "admin" ? "Admin" : "Candidate")}</span>
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-[#DC2626] px-3 py-1.5 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-4 py-2 text-xs font-bold rounded-full shadow-sm hover:shadow transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* ========================================= */}
          {/* MOBILE MENU TOGGLE BUTTON                 */}
          {/* ========================================= */}
          <button
            type="button"
            className="md:hidden p-2 text-slate-700 hover:text-[#DC2626] hover:bg-slate-50 rounded-lg focus:outline-none transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6 text-slate-900" />}
          </button>
        </div>
      </div>

      {/* ========================================= */}
      {/* MOBILE MENU PANEL                         */}
      {/* ========================================= */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-2xl transition-all">
          <div className="px-4 py-4 space-y-1.5">
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-sm font-semibold px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive("/profile") ? "text-[#DC2626] bg-red-50/80 font-bold border-l-4 border-[#DC2626]" : "text-slate-700 hover:text-[#DC2626] hover:bg-slate-50"
              }`}
            >
              For Job Seekers
            </Link>

            <Link
              href="/enterprise"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-sm font-semibold px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive("/enterprise") ? "text-[#DC2626] bg-red-50/80 font-bold border-l-4 border-[#DC2626]" : "text-slate-700 hover:text-[#DC2626] hover:bg-slate-50"
              }`}
            >
              Why HireRight
            </Link>

            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 text-sm font-semibold px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive("/dashboard") ? "text-[#DC2626] bg-red-50/80 font-bold border-l-4 border-[#DC2626]" : "text-slate-700 hover:text-[#DC2626] hover:bg-slate-50"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-slate-500" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/interview"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 text-sm font-semibold px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive("/interview") ? "text-[#DC2626] bg-red-50/80 font-bold border-l-4 border-[#DC2626]" : "text-slate-700 hover:text-[#DC2626] hover:bg-slate-50"
              }`}
            >
              <Video className="w-4 h-4 text-[#DC2626]" />
              <span>AI Interview</span>
            </Link>

            <Link
              href="/interview/results"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-sm font-semibold px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive("/interview/results") ? "text-[#DC2626] bg-red-50/80 font-bold border-l-4 border-[#DC2626]" : "text-slate-700 hover:text-[#DC2626] hover:bg-slate-50"
              }`}
            >
              Results & Scorecards
            </Link>

            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-sm font-semibold px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive("/pricing") ? "text-[#DC2626] bg-red-50/80 font-bold border-l-4 border-[#DC2626]" : "text-slate-700 hover:text-[#DC2626] hover:bg-slate-50"
              }`}
            >
              Pricing
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-sm font-semibold px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive("/contact") ? "text-[#DC2626] bg-red-50/80 font-bold border-l-4 border-[#DC2626]" : "text-slate-700 hover:text-[#DC2626] hover:bg-slate-50"
              }`}
            >
              About Us / Contact
            </Link>

            <div className="pt-2 border-t border-gray-100">
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left text-sm font-semibold text-red-600 px-3 py-2.5 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <div className="space-y-2 pt-1">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-semibold text-slate-700 hover:text-[#DC2626] px-3 py-2.5 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block bg-[#DC2626] text-white px-4 py-2.5 text-sm font-bold text-center rounded-full shadow-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
