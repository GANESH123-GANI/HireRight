"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, ChevronDown, Menu, X, Shield, Building2, Users, LogOut, Sparkles, Video, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user, organization, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const solutions = [
    { name: "For Job Seekers", href: "/profile", icon: Users, description: "Build your profile and get AI matched" },
    { name: "Recruiter Dashboard", href: "/admin", icon: Building2, description: "Screen & manage candidates efficiently" },
    { name: "For Government", href: "/government", icon: Shield, description: "Verified background screening & checks" },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-[100] bg-white/95 text-slate-800 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] w-full transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16">
          
          {/* Left: Brand Logo & Main Nav Links */}
          <div className="flex items-center gap-7 lg:gap-10">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center group shrink-0" title="HireRight Home">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gradient-to-br from-[#D97757] to-[#B95F42] rounded-lg flex items-center justify-center shadow-md shadow-[#D97757]/25 group-hover:scale-105 transition-transform duration-200">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-black tracking-tight text-slate-900 group-hover:text-[#D97757] transition-colors">
                      HIRE <span className="text-[#D97757]">RIGHT</span>
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-orange-50 text-[#D97757] border border-[#D97757]/30">
                      AI
                    </span>
                  </div>
                  <span className="block text-[9px] font-medium text-slate-400 -mt-0.5 tracking-tight select-none">
                    Right People. Right Decisions.
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-5 lg:gap-7">
              <Link
                href="/"
                className={`relative py-2 text-sm font-semibold transition-colors duration-200 group ${
                  isActive("/") ? "text-[#D97757] font-bold" : "text-slate-700 hover:text-[#D97757]"
                }`}
              >
                <span>Home</span>
                <span
                  className={`absolute -bottom-1 left-0 right-0 h-[3px] bg-[#D97757] rounded-full shadow-[0_2px_8px_rgba(217,119,87,0.35)] transition-all duration-300 ease-out origin-center ${
                    isActive("/")
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                  }`}
                />
              </Link>

              <Link
                href="/profile"
                className={`relative py-2 text-sm font-semibold transition-colors duration-200 group ${
                  isActive("/profile") ? "text-[#D97757] font-bold" : "text-slate-700 hover:text-[#D97757]"
                }`}
              >
                <span>For Job Seekers</span>
                <span
                  className={`absolute -bottom-1 left-0 right-0 h-[3px] bg-[#D97757] rounded-full shadow-[0_2px_8px_rgba(217,119,87,0.35)] transition-all duration-300 ease-out origin-center ${
                    isActive("/profile")
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                  }`}
                />
              </Link>

              {/* Solutions Dropdown */}
              <div
                className="relative py-2 group"
                onMouseEnter={() => setActiveDropdown("solutions")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={`flex items-center gap-1 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                    activeDropdown === "solutions" ? "text-[#D97757] font-bold" : "text-slate-700 group-hover:text-[#D97757]"
                  }`}
                >
                  <span>Solutions</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeDropdown === "solutions" ? "rotate-180 text-[#D97757]" : "text-slate-400 group-hover:text-[#D97757]"
                    }`}
                  />
                </button>
                <span
                  className={`absolute -bottom-1 left-0 right-0 h-[3px] bg-[#D97757] rounded-full shadow-[0_2px_8px_rgba(217,119,87,0.35)] transition-all duration-300 ease-out origin-center ${
                    activeDropdown === "solutions"
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                  }`}
                />

                {activeDropdown === "solutions" && (
                  <div className="absolute top-full left-0 w-80 bg-white border border-slate-200/90 shadow-xl py-2 mt-2 rounded-2xl z-50 animate-in fade-in zoom-in-95 origin-top-left overflow-hidden">
                    {solutions.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors duration-200 border-l-2 border-transparent hover:border-[#D97757]"
                      >
                        <div className="w-10 h-10 bg-orange-50/80 border border-orange-100 flex items-center justify-center flex-shrink-0 rounded-xl text-[#D97757]">
                          <item.icon className="w-5 h-5 text-[#D97757]" />
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

              <Link
                href="/government"
                className={`relative py-2 text-sm font-semibold transition-colors duration-200 group ${
                  isActive("/government") ? "text-[#D97757] font-bold" : "text-slate-700 hover:text-[#D97757]"
                }`}
              >
                <span>Government</span>
                <span
                  className={`absolute -bottom-1 left-0 right-0 h-[3px] bg-[#D97757] rounded-full shadow-[0_2px_8px_rgba(217,119,87,0.35)] transition-all duration-300 ease-out origin-center ${
                    isActive("/government")
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                  }`}
                />
              </Link>

              <Link
                href="/enterprise"
                className={`relative py-2 text-sm font-semibold transition-colors duration-200 group ${
                  isActive("/enterprise") ? "text-[#D97757] font-bold" : "text-slate-700 hover:text-[#D97757]"
                }`}
              >
                <span>Enterprise</span>
                <span
                  className={`absolute -bottom-1 left-0 right-0 h-[3px] bg-[#D97757] rounded-full shadow-[0_2px_8px_rgba(217,119,87,0.35)] transition-all duration-300 ease-out origin-center ${
                    isActive("/enterprise")
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                  }`}
                />
              </Link>

              <Link
                href="/pricing"
                className={`relative py-2 text-sm font-semibold transition-colors duration-200 group ${
                  isActive("/pricing") ? "text-[#D97757] font-bold" : "text-slate-700 hover:text-[#D97757]"
                }`}
              >
                <span>Pricing</span>
                <span
                  className={`absolute -bottom-1 left-0 right-0 h-[3px] bg-[#D97757] rounded-full shadow-[0_2px_8px_rgba(217,119,87,0.35)] transition-all duration-300 ease-out origin-center ${
                    isActive("/pricing")
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                  }`}
                />
              </Link>

              <Link
                href="/contact"
                className={`relative py-2 text-sm font-semibold transition-colors duration-200 group ${
                  isActive("/contact") ? "text-[#D97757] font-bold" : "text-slate-700 hover:text-[#D97757]"
                }`}
              >
                <span>Contact Us</span>
                <span
                  className={`absolute -bottom-1 left-0 right-0 h-[3px] bg-[#D97757] rounded-full shadow-[0_2px_8px_rgba(217,119,87,0.35)] transition-all duration-300 ease-out origin-center ${
                    isActive("/contact")
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            </div>
          </div>

          {/* Right: Quick Action Buttons & Auth */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {/* Quick Links: AI Interview Button */}
            <Link
              href="/interview"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all duration-200 cursor-pointer"
            >
              <Video className="w-3.5 h-3.5 text-orange-400" />
              <span>AI Interview</span>
            </Link>

            {user ? (
              <>
                {user.role === "admin" || user.role === "employer" ? (
                  <Link
                    href="/admin"
                    className="text-xs font-bold text-[#D97757] hover:text-[#B95F42] px-3 py-1.5 bg-orange-50 hover:bg-orange-100/80 rounded-lg border border-orange-200/60 transition-colors flex items-center gap-1.5"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </Link>
                ) : null}

                <Link
                  href={user.role === "admin" ? "/admin" : "/profile"}
                  className="inline-flex items-center gap-2 max-w-[170px] truncate px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-full border border-slate-200/90 transition-colors shadow-2xs"
                  title={user.name || "View Profile"}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 ring-2 ring-emerald-100" />
                  <span className="truncate">{user.name || (user.role === "admin" ? "Admin" : "Job Seeker")}</span>
                </Link>

                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 px-3 py-1.5 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
                  title="Sign out of account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-[#D97757] px-3.5 py-1.5 hover:bg-slate-50 rounded-lg transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-[#D97757] to-[#B95F42] hover:from-[#B95F42] hover:to-[#A04E35] text-white px-5 py-2 text-sm font-bold rounded-full shadow-md shadow-[#D97757]/20 hover:shadow-lg hover:shadow-[#D97757]/30 transition-all duration-200 cursor-pointer"
                >
                  <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            className="md:hidden p-2 text-slate-700 hover:text-[#D97757] hover:bg-slate-50 rounded-lg focus:outline-none transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-slate-800" /> : <Menu className="w-6 h-6 text-slate-800" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200/80 shadow-2xl transition-all">
          <div className="px-4 py-4 space-y-1.5">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-sm font-semibold px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive("/") ? "text-[#D97757] bg-orange-50/80 border-l-4 border-[#D97757] font-bold" : "text-slate-700 hover:text-[#D97757] hover:bg-slate-50"
              }`}
            >
              Home
            </Link>

            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-sm font-semibold px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive("/profile") ? "text-[#D97757] bg-orange-50/80 border-l-4 border-[#D97757] font-bold" : "text-slate-700 hover:text-[#D97757] hover:bg-slate-50"
              }`}
            >
              For Job Seekers
            </Link>

            <Link
              href="/interview"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 text-sm font-semibold px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive("/interview") ? "text-[#D97757] bg-orange-50/80 border-l-4 border-[#D97757] font-bold" : "text-slate-700 hover:text-[#D97757] hover:bg-slate-50"
              }`}
            >
              <Video className="w-4 h-4 text-[#D97757]" />
              <span>AI Video Interview</span>
            </Link>

            <Link
              href="/government"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-sm font-semibold px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive("/government") ? "text-[#D97757] bg-orange-50/80 border-l-4 border-[#D97757] font-bold" : "text-slate-700 hover:text-[#D97757] hover:bg-slate-50"
              }`}
            >
              Government
            </Link>

            <Link
              href="/enterprise"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-sm font-semibold px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive("/enterprise") ? "text-[#D97757] bg-orange-50/80 border-l-4 border-[#D97757] font-bold" : "text-slate-700 hover:text-[#D97757] hover:bg-slate-50"
              }`}
            >
              Enterprise
            </Link>

            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-sm font-semibold px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive("/pricing") ? "text-[#D97757] bg-orange-50/80 border-l-4 border-[#D97757] font-bold" : "text-slate-700 hover:text-[#D97757] hover:bg-slate-50"
              }`}
            >
              Pricing
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-sm font-semibold px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive("/contact") ? "text-[#D97757] bg-orange-50/80 border-l-4 border-[#D97757] font-bold" : "text-slate-700 hover:text-[#D97757] hover:bg-slate-50"
              }`}
            >
              Contact Us
            </Link>

            {user ? (
              <>
                <div className="pt-2 border-t border-slate-100">
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-semibold text-slate-800 hover:text-[#D97757] px-3 py-2.5 hover:bg-slate-50 rounded-lg transition-all duration-200"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left text-sm font-semibold text-red-600 px-3 py-2.5 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <hr className="my-2 border-slate-100" />
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold text-slate-700 hover:text-[#D97757] px-3 py-2.5 hover:bg-slate-50 rounded-lg transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block bg-gradient-to-r from-[#D97757] to-[#B95F42] text-white px-4 py-2.5 text-sm font-bold text-center rounded-full shadow-md transition-all duration-200"
                >
                  <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
