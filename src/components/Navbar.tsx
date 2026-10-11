"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, ChevronDown, Menu, X, Shield, Building2, Users, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user, organization, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const solutions = [
    { name: "For Job Seekers", href: "/profile", icon: Users, description: "Build your profile and get matched" },
    { name: "Recruiter Dashboard", href: "/admin", icon: Building2, description: "Manage hiring efficiently" },
    { name: "For Government", href: "/government", icon: Shield, description: "Verified background screening" },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-[100] bg-[#FFF9F5]/95 text-[#382A25] backdrop-blur-md border-b border-[#EFE3DB] shadow-xs w-full transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-7 lg:gap-10">
            <Link href="/" className="flex items-center group shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gradient-to-br from-[#D97757] to-[#B95F42] rounded-lg flex items-center justify-center shadow-md">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold text-[#382A25] tracking-tight">HireRight</span>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-[#FCE8DD] text-[#D97757] border border-[#D97757]/30">AI</span>
                </div>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-5 lg:gap-7">
              <Link
                href="/"
                className={`relative py-2 text-sm font-semibold transition-colors duration-200 group ${
                  isActive("/") ? "text-[#D97757]" : "text-[#382A25]/90 hover:text-[#D97757]"
                }`}
              >
                <span>Home</span>
                <span
                  className={`absolute -bottom-1 left-0 right-0 h-[3.5px] bg-[#D97757] rounded-full shadow-[0_2px_8px_rgba(217,119,87,0.35)] transition-all duration-300 ease-out origin-center ${
                    isActive("/")
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                  }`}
                />
              </Link>
              <Link
                href="/profile"
                className={`relative py-2 text-sm font-semibold transition-colors duration-200 group ${
                  isActive("/profile") ? "text-[#D97757]" : "text-[#382A25]/90 hover:text-[#D97757]"
                }`}
              >
                <span>For Job Seekers</span>
                <span
                  className={`absolute -bottom-1 left-0 right-0 h-[3.5px] bg-[#D97757] rounded-full shadow-[0_2px_8px_rgba(217,119,87,0.35)] transition-all duration-300 ease-out origin-center ${
                    isActive("/profile")
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                  }`}
                />
              </Link>
              <div
                className="relative py-2 group"
                onMouseEnter={() => setActiveDropdown("solutions")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={`flex items-center gap-1 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                    activeDropdown === "solutions" ? "text-[#D97757]" : "text-[#382A25]/90 group-hover:text-[#D97757]"
                  }`}
                >
                  <span>Solutions</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeDropdown === "solutions" ? "rotate-180 text-[#D97757]" : ""
                    }`}
                  />
                </button>
                <span
                  className={`absolute -bottom-1 left-0 right-0 h-[3.5px] bg-[#D97757] rounded-full shadow-[0_2px_8px_rgba(217,119,87,0.35)] transition-all duration-300 ease-out origin-center ${
                    activeDropdown === "solutions"
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                  }`}
                />
                {activeDropdown === "solutions" && (
                  <div className="absolute top-full left-0 w-80 bg-white border border-[#EFE3DB] shadow-xl py-2 mt-2 rounded-xl z-50">
                    {solutions.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-[#FFF9F5] transition-colors duration-200 border-l-2 border-transparent hover:border-[#D97757]"
                      >
                        <div className="w-10 h-10 bg-[#FCE8DD]/50 flex items-center justify-center flex-shrink-0 rounded-lg border border-[#EFE3DB]">
                          <item.icon className="w-5 h-5 text-[#D97757]" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#382A25] text-sm">{item.name}</p>
                          <p className="text-xs text-[#81736C]">{item.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link
                href="/government"
                className={`relative py-2 text-sm font-semibold transition-colors duration-200 group ${
                  isActive("/government") ? "text-[#D97757]" : "text-[#382A25]/90 hover:text-[#D97757]"
                }`}
              >
                <span>Government</span>
                <span
                  className={`absolute -bottom-1 left-0 right-0 h-[3.5px] bg-[#D97757] rounded-full shadow-[0_2px_8px_rgba(217,119,87,0.35)] transition-all duration-300 ease-out origin-center ${
                    isActive("/government")
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                  }`}
                />
              </Link>
              <Link
                href="/enterprise"
                className={`relative py-2 text-sm font-semibold transition-colors duration-200 group ${
                  isActive("/enterprise") ? "text-[#D97757]" : "text-[#382A25]/90 hover:text-[#D97757]"
                }`}
              >
                <span>Enterprise</span>
                <span
                  className={`absolute -bottom-1 left-0 right-0 h-[3.5px] bg-[#D97757] rounded-full shadow-[0_2px_8px_rgba(217,119,87,0.35)] transition-all duration-300 ease-out origin-center ${
                    isActive("/enterprise")
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                  }`}
                />
              </Link>
              <Link
                href="/pricing"
                className={`relative py-2 text-sm font-semibold transition-colors duration-200 group ${
                  isActive("/pricing") ? "text-[#D97757]" : "text-[#382A25]/90 hover:text-[#D97757]"
                }`}
              >
                <span>Pricing</span>
                <span
                  className={`absolute -bottom-1 left-0 right-0 h-[3.5px] bg-[#D97757] rounded-full shadow-[0_2px_8px_rgba(217,119,87,0.35)] transition-all duration-300 ease-out origin-center ${
                    isActive("/pricing")
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                  }`}
                />
              </Link>
              <Link
                href="/contact"
                className={`relative py-2 text-sm font-semibold transition-colors duration-200 group ${
                  isActive("/contact") ? "text-[#D97757]" : "text-[#382A25]/90 hover:text-[#D97757]"
                }`}
              >
                <span>Contact Us</span>
                <span
                  className={`absolute -bottom-1 left-0 right-0 h-[3.5px] bg-[#D97757] rounded-full shadow-[0_2px_8px_rgba(217,119,87,0.35)] transition-all duration-300 ease-out origin-center ${
                    isActive("/contact")
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {user ? (
              <>
                {user.role === "admin" || user.role === "employer" ? (
                  <Link
                    href="/admin"
                    className="text-xs sm:text-sm font-semibold text-[#D97757] hover:text-[#B95F42] px-3 py-1.5 bg-[#FCE8DD]/50 hover:bg-[#FCE8DD] rounded-lg transition-colors"
                  >
                    Recruiter Dashboard
                  </Link>
                ) : null}
                <Link
                  href={user.role === "admin" ? "/admin" : "/profile"}
                  className="inline-flex items-center gap-2 max-w-[160px] truncate px-3 py-1.5 bg-[#FCE8DD]/60 hover:bg-[#FCE8DD] text-[#382A25] text-xs font-semibold rounded-full border border-[#EFE3DB] transition-colors"
                  title={user.name || "View Profile"}
                >
                  <span className="w-2 h-2 rounded-full bg-[#15803D] shrink-0" />
                  <span className="truncate">{user.name || (user.role === "admin" ? "Admin" : "Job Seeker")}</span>
                </Link>
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#81736C] hover:text-[#B91C1C] px-3 py-1.5 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-[#382A25] hover:text-[#D97757] px-4 py-2 hover:bg-[#FCE8DD]/30 rounded-lg transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="btn-gradient-pill text-white px-5 py-2 text-sm font-bold rounded-full shadow-md transition-all duration-200 cursor-pointer"
                >
                  <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">Sign Up</span>
                </Link>
              </div>
            )}
          </div>
          <button
            className="md:hidden p-2 text-[#382A25] hover:text-[#D97757] focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#382A25]" /> : <Menu className="w-6 h-6 text-[#382A25]" />}
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFF9F5] border-t border-[#EFE3DB] shadow-xl transition-all">
          <div className="px-4 py-4 space-y-1.5">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-sm font-semibold px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive("/") ? "text-[#D97757] bg-[#FCE8DD]/40 border-l-4 border-[#D97757]" : "text-[#382A25] hover:text-[#D97757] hover:bg-[#FCE8DD]/20"
              }`}
            >
              Home
            </Link>
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-sm font-semibold px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive("/profile") ? "text-[#D97757] bg-[#FCE8DD]/40 border-l-4 border-[#D97757]" : "text-[#382A25] hover:text-[#D97757] hover:bg-[#FCE8DD]/20"
              }`}
            >
              For Job Seekers
            </Link>
            <Link
              href="/government"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-sm font-semibold px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive("/government") ? "text-[#D97757] bg-[#FCE8DD]/40 border-l-4 border-[#D97757]" : "text-[#382A25] hover:text-[#D97757] hover:bg-[#FCE8DD]/20"
              }`}
            >
              Government
            </Link>
            <Link
              href="/enterprise"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-sm font-semibold px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive("/enterprise") ? "text-[#D97757] bg-[#FCE8DD]/40 border-l-4 border-[#D97757]" : "text-[#382A25] hover:text-[#D97757] hover:bg-[#FCE8DD]/20"
              }`}
            >
              Enterprise
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-sm font-semibold px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive("/pricing") ? "text-[#D97757] bg-[#FCE8DD]/40 border-l-4 border-[#D97757]" : "text-[#382A25] hover:text-[#D97757] hover:bg-[#FCE8DD]/20"
              }`}
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-sm font-semibold px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive("/contact") ? "text-[#D97757] bg-[#FCE8DD]/40 border-l-4 border-[#D97757]" : "text-[#382A25] hover:text-[#D97757] hover:bg-[#FCE8DD]/20"
              }`}
            >
              Contact Us
            </Link>
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-semibold text-[#382A25] hover:text-[#D97757] px-3 py-2.5 hover:bg-[#FCE8DD]/30 rounded-lg transition-all duration-200"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left text-sm font-semibold text-[#B91C1C] px-3 py-2.5 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <hr className="my-2 border-[#EFE3DB]" />
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold text-[#382A25] hover:text-[#D97757] px-3 py-2.5 hover:bg-[#FCE8DD]/30 rounded-lg transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block btn-gradient-pill text-white px-4 py-2.5 text-sm font-bold text-center rounded-full shadow-md transition-all duration-200"
                >
                  <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
