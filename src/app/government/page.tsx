"use client";

import Link from "next/link";
import { Shield, ArrowRight, Users, Lock, FileCheck, Globe, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const features = [
  {
    icon: Shield,
    title: "National Security Clearance",
    description: "Automated verification for security-sensitive positions with multi-layered background checks.",
  },
  {
    icon: FileCheck,
    title: "Document Verification",
    description: "AI-powered document authentication detecting fraud and forgery in real-time.",
  },
  {
    icon: Users,
    title: "Bulk Processing",
    description: "Process thousands of verifications simultaneously with our enterprise-grade infrastructure.",
  },
  {
    icon: Lock,
    title: "Data Sovereignty",
    description: "Deployment and data-location requirements are reviewed and agreed for each customer environment.",
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    description: "Available in 22+ Indian languages and 50+ global languages for inclusive access.",
  },
  {
    icon: Award,
    title: "Compliance Ready",
    description: "Pre-built templates for government regulations and international standards.",
  },
];

const stats = [
  { number: "50+", label: "Government Departments" },
  { number: "10M+", label: "Verifications Completed" },
  { number: "24/7", label: "Workflow Access" },
  { number: "< 24hrs", label: "Average Turnaround" },
];

export default function GovernmentPage() {
  return (
    <div className="min-h-screen bg-[#FFF9F5]">
      <Navbar />
      {/* Hero */}
      <section className="bg-[#FFF9F5] pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-[#FCE8DD]/50 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#D97757]/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#FCE8DD] border border-[#D97757]/20 px-4 py-2 mb-6 rounded-full">
              <Shield className="w-4 h-4 text-[#D97757]" />
              <span className="text-sm font-semibold text-[#D97757]">Trusted by Government of India</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-[#382A25] mb-6 tracking-tight">
              Government <span className="text-[#D97757]">Solutions</span>
            </h1>
            <p className="text-xl text-[#81736C] mb-8 leading-relaxed">
              Secure, compliant, and scalable background verification solutions designed specifically
              for government departments and public sector organizations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-[#D97757] hover:bg-[#B95F42] text-white px-8 py-3.5 font-semibold rounded-xl text-sm shadow-md transition-all"
              >
                <span>Request Demo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-[#EFE3DB] bg-white text-[#382A25] hover:bg-[#FCE8DD]/40 hover:border-[#D97757] px-8 py-3.5 font-medium transition-all rounded-xl text-sm shadow-xs"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-y border-[#EFE3DB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-extrabold text-[#D97757]">{stat.number}</p>
                <p className="text-[#81736C] mt-2 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-[#FFF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#382A25] mb-4 tracking-tight">Government-Grade Features</h2>
            <p className="text-[#81736C] max-w-2xl mx-auto text-lg">
              Purpose-built for the security and compliance requirements of government operations
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white p-8 border border-[#EFE3DB] rounded-2xl hover:border-[#D97757] hover:shadow-md transition-all shadow-xs">
                <div className="w-14 h-14 bg-[#FCE8DD] border border-[#D97757]/20 flex items-center justify-center mb-6 rounded-xl">
                  <feature.icon className="w-7 h-7 text-[#D97757]" />
                </div>
                <h3 className="text-xl font-bold text-[#382A25] mb-3">{feature.title}</h3>
                <p className="text-[#81736C] leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#D97757] to-[#B95F42] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Verification Process?</h2>
          <p className="text-white/90 mb-8 text-lg">
            Join 50+ government departments already using HireRight for secure, efficient background screening.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-[#382A25] hover:bg-[#FFF9F5] px-8 py-4 font-bold transition-all rounded-xl shadow-lg"
          >
            Get Started Today
            <ArrowRight className="w-4 h-4 text-[#D97757]" />
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
