"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Users,
  FileText,
  Globe,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    designation: "",
    email: "",
    subject: "Enterprise Background Verification",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 6000);
      setFormData({
        fullName: "",
        designation: "",
        email: "",
        subject: "Enterprise Background Verification",
        message: "",
      });
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#382A25] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full">
        {/* ========================================================
            HERO BANNER - Warm Cocoa & Peach Gradient
            ======================================================== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#2A201B] via-[#382A25] to-[#45342E] text-white pt-32 pb-20 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28">
          {/* Ambient Lighting & Glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#D97757]/15 blur-3xl" />
            <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-[#FCE8DD]/10 blur-3xl" />
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              
              {/* Left Column: Contact Details */}
              <div className="lg:col-span-6 xl:col-span-6 space-y-6">
                <ScrollReveal delay={60} direction="up">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-[#FCE8DD] mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#D97757]" />
                    <span>Get in Touch with HireRight</span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.1] text-white">
                    Contact Us
                  </h1>
                </ScrollReveal>

                {/* Headquarters Address */}
                <ScrollReveal delay={140} direction="up">
                  <div className="flex items-start gap-3.5 text-[#EFE3DB] text-sm sm:text-base leading-relaxed">
                    <MapPin className="w-5 h-5 text-[#D97757] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">Global Headquarters</p>
                      <p className="text-[#EFE3DB]/90">
                        15th Floor, HireRight Tower, Botanical Garden Road, Kondapur,
                        <br />
                        Hyderabad – 500084, Telangana, India.
                      </p>
                      <p className="text-xs text-[#EFE3DB]/75 mt-1 font-mono tracking-wide">
                        CIN: L24110TG1991PLC012471 &bull; ISO 27001 &bull; SOC 2 Type II
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Direct Phone Lines */}
                <ScrollReveal delay={200} direction="up">
                  <div className="flex items-start gap-3.5 text-[#EFE3DB] text-sm sm:text-base">
                    <Phone className="w-5 h-5 text-[#D97757] flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-medium">
                        <a href="tel:+914069043500" className="hover:text-white transition-colors underline-offset-2 hover:underline">
                          +91 40 69043500
                        </a>
                      </p>
                      <p className="font-medium">
                        <a href="tel:+914023115145" className="hover:text-white transition-colors underline-offset-2 hover:underline">
                          +91 40 23115145
                        </a>
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Departmental Emails */}
                <ScrollReveal delay={260} direction="up">
                  <div className="space-y-3 pt-2 border-t border-white/15">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-[#D97757] flex-shrink-0" />
                      <div>
                        <span className="text-[#EFE3DB]/80 font-medium">General Enquiries: </span>
                        <a href="mailto:mail@hireright.ai" className="text-white font-semibold hover:underline">
                          mail@hireright.ai
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-[#D97757] flex-shrink-0" />
                      <div>
                        <span className="text-[#EFE3DB]/80 font-medium">Business Enquiries: </span>
                        <a href="mailto:sales@hireright.ai" className="text-white font-semibold hover:underline">
                          sales@hireright.ai
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-[#D97757] flex-shrink-0" />
                      <div>
                        <span className="text-[#EFE3DB]/80 font-medium">Media Enquiries: </span>
                        <a href="mailto:media@hireright.ai" className="text-white font-semibold hover:underline">
                          media@hireright.ai
                        </a>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              {/* Right Column: Floating Contact Form Card */}
              <div className="lg:col-span-6 xl:col-span-6">
                <ScrollReveal delay={120} direction="right">
                  <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-9 shadow-2xl border border-[#EFE3DB] text-[#382A25] relative">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#382A25] mb-1 tracking-tight">
                      Send Us a Message
                    </h2>
                    <p className="text-xs sm:text-sm text-[#81736C] mb-6">
                      Fill out the form below and our team will get back to you within 24 hours.
                    </p>

                    {submitted && (
                      <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 text-sm animate-fade-in">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Message sent successfully!</p>
                          <p className="text-xs text-emerald-700 mt-0.5">Thank you for reaching out. A representative will contact you shortly.</p>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#382A25] mb-1">
                            Full Name <span className="text-[#B91C1C]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE3DB] text-[#382A25] placeholder:text-[#81736C]/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/20 focus:border-[#D97757] transition-all bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#382A25] mb-1">
                            Designation
                          </label>
                          <input
                            type="text"
                            placeholder="Designation"
                            value={formData.designation}
                            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE3DB] text-[#382A25] placeholder:text-[#81736C]/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/20 focus:border-[#D97757] transition-all bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#382A25] mb-1">
                            Email address <span className="text-[#B91C1C]">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="Email address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE3DB] text-[#382A25] placeholder:text-[#81736C]/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/20 focus:border-[#D97757] transition-all bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#382A25] mb-1">
                            Choose subject
                          </label>
                          <select
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE3DB] text-[#382A25] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/20 focus:border-[#D97757] transition-all bg-white cursor-pointer"
                          >
                            <option value="Enterprise Background Verification">Enterprise Background Verification</option>
                            <option value="AI Autonomous Video Interviews">AI Autonomous Video Interviews</option>
                            <option value="Government & Public Sector Solutions">Government & Public Sector</option>
                            <option value="Partnership & Integration Enquiries">Partnership & Integration</option>
                            <option value="Investor Relations">Investor Relations</option>
                            <option value="Candidate Grievance">Candidate Grievance</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#382A25] mb-1">
                          Write your message here <span className="text-[#B91C1C]">*</span>
                        </label>
                        <textarea
                          rows={4}
                          required
                          placeholder="Write your message here..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE3DB] text-[#382A25] placeholder:text-[#81736C]/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/20 focus:border-[#D97757] transition-all resize-y bg-white"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D97757] hover:bg-[#B95F42] text-white font-bold px-8 py-3.5 rounded-xl text-xs tracking-wider uppercase shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <span>SENDING...</span>
                        ) : (
                          <>
                            <span>SEND MESSAGE</span>
                            <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </ScrollReveal>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================
            CARD 1: Adverse Event & Candidate Grievance Reporting
            ======================================================== */}
        <section className="py-12 sm:py-16 bg-[#FFF9F5] border-b border-[#EFE3DB]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal delay={60} direction="up">
              <div className="bg-white rounded-2xl p-7 sm:p-9 border border-[#EFE3DB] shadow-sm transition-all hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FCE8DD] border border-[#D97757]/20 flex items-center justify-center flex-shrink-0 text-[#D97757]">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-[#382A25] tracking-tight">
                      For Adverse Event &amp; Verification Reporting
                    </h3>
                    <p className="mt-2 text-sm sm:text-base text-[#81736C] leading-relaxed max-w-3xl">
                      To report an adverse experience with a background verification report, candidate privacy escalation, or interview proctoring incident, please call or email the HireRight Trust &amp; Safety Compliance Team.
                    </p>

                    {/* Pill Badges */}
                    <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
                      <a
                        href="tel:18777703183"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#EFE3DB] bg-[#FFF9F5] hover:bg-[#FCE8DD]/50 text-[#382A25] text-xs sm:text-sm font-semibold transition-all hover:scale-105"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#D97757]" />
                        <span>1-877-770-3183</span>
                      </a>
                      <a
                        href="mailto:trust.safety@hireright.ai"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#EFE3DB] bg-[#FFF9F5] hover:bg-[#FCE8DD]/50 text-[#382A25] text-xs sm:text-sm font-semibold transition-all hover:scale-105"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#D97757]" />
                        <span>trust.safety@hireright.ai</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ========================================================
            CARD 2: Investor Relations & Grievance Contact
            ======================================================== */}
        <section className="py-14 sm:py-18 bg-[#FFF9F5]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <ScrollReveal delay={60} direction="up">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#382A25] tracking-tight">
                Investor Relations Contact
              </h2>
            </ScrollReveal>

            {/* Block A: Investor Relations */}
            <ScrollReveal delay={120} direction="up">
              <div className="pb-8 border-b border-[#EFE3DB]">
                <h3 className="text-lg font-bold text-[#382A25] mb-3">Investor Relations</h3>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <a
                    href="tel:+04069043500"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#EFE3DB] bg-white hover:bg-[#FCE8DD]/40 text-[#382A25] text-xs sm:text-sm font-semibold transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#D97757]" />
                    <span>+040-69043500</span>
                  </a>
                  <a
                    href="mailto:investorrelations@hireright.ai"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#EFE3DB] bg-white hover:bg-[#FCE8DD]/40 text-[#382A25] text-xs sm:text-sm font-semibold transition-all"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#D97757]" />
                    <span>investorrelations@hireright.ai</span>
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Block B: Retail Investors & Grievance */}
            <ScrollReveal delay={180} direction="up">
              <div className="pb-8 border-b border-[#EFE3DB]">
                <h3 className="text-lg font-bold text-[#382A25] mb-1">Retail Investors &amp; Grievance</h3>
                <p className="text-sm text-[#81736C] mb-3">
                  Ms. Chaitanya Tummala — Company Secretary &amp; Nodal Officer
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="mailto:chaitanya.tummala@hireright.ai"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#EFE3DB] bg-white hover:bg-[#FCE8DD]/40 text-[#382A25] text-xs sm:text-sm font-semibold transition-all"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#D97757]" />
                    <span>chaitanya.tummala@hireright.ai</span>
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Block C: Registrar */}
            <ScrollReveal delay={240} direction="up">
              <div>
                <h3 className="text-lg font-bold text-[#382A25] mb-1">Registrar — KFin Technologies</h3>
                <p className="text-sm text-[#81736C] mb-3">
                  Selenium Tower B, Gachibowli, Financial District, Hyderabad – 500 032.
                </p>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <a
                    href="tel:18003094001"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#EFE3DB] bg-white hover:bg-[#FCE8DD]/40 text-[#382A25] text-xs sm:text-sm font-semibold transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#D97757]" />
                    <span>1-800-309-4001 (Toll Free)</span>
                  </a>
                  <a
                    href="mailto:einward.ris@kfintech.com"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#EFE3DB] bg-white hover:bg-[#FCE8DD]/40 text-[#382A25] text-xs sm:text-sm font-semibold transition-all"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#D97757]" />
                    <span>einward.ris@kfintech.com</span>
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ========================================================
            CARD 3: Follow Us Social Section
            ======================================================== */}
        <section className="py-16 sm:py-20 bg-white border-t border-[#EFE3DB]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
            <ScrollReveal delay={60} direction="up">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#382A25] tracking-tight leading-tight">
                  Follow us for updates
                  <br />
                  and company news
                </h2>
                <p className="text-sm text-[#81736C] mt-2">
                  Stay informed with the latest AI interviewing &amp; screening announcements.
                </p>
              </div>
            </ScrollReveal>

            {/* Terracotta Peach Social Icons */}
            <ScrollReveal delay={120} direction="left">
              <div className="flex items-center justify-center sm:justify-end gap-3.5 sm:gap-4">
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-12 h-12 rounded-full bg-[#D97757] hover:bg-[#B95F42] text-white flex items-center justify-center shadow-md hover:scale-110 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-12 h-12 rounded-full bg-[#D97757] hover:bg-[#B95F42] text-white flex items-center justify-center shadow-md hover:scale-110 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
                {/* X / Twitter */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                  className="w-12 h-12 rounded-full bg-[#D97757] hover:bg-[#B95F42] text-white flex items-center justify-center shadow-md hover:scale-110 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-12 h-12 rounded-full bg-[#D97757] hover:bg-[#B95F42] text-white flex items-center justify-center shadow-md hover:scale-110 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3V2.5h-4a4.5 4.5 0 0 0-4.5 4.5v2.51h-3v3.98h3v8.01z"/>
                  </svg>
                </a>
                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-12 h-12 rounded-full bg-[#D97757] hover:bg-[#B95F42] text-white flex items-center justify-center shadow-md hover:scale-110 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
