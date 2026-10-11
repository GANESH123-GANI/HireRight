"use client";

import Link from "next/link";
import { Building2, CheckCircle, ArrowRight, Users, Zap, Lock, BarChart3, Headphones } from "lucide-react";
import { VERIFICATION_PRICES_USD, formatPrice } from "@/lib/pricing";
import { useCurrency } from "@/lib/useCurrency";
import CurrencySelector from "@/components/CurrencySelector";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const features = [
  {
    icon: Building2,
    title: "Enterprise Integration",
    description: "Seamless integration with your existing HRIS, ATS, and ERP systems via our robust API.",
  },
  {
    icon: Users,
    title: "Bulk Verification",
    description: "Process thousands of candidates simultaneously with automated workflows.",
  },
  {
    icon: Zap,
    title: "Real-Time Results",
    description: "Get instant verification results with our AI-powered background check engine.",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "SOC 2 Type II certified with end-to-end encryption and audit trails.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Comprehensive analytics and reporting for data-driven hiring decisions.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "24/7 priority support with a dedicated account manager for your organization.",
  },
];

const plans = [
  {
    name: "Startup",
    usd: VERIFICATION_PRICES_USD.startup.monthly,
    period: "/month",
    features: ["Up to 100 verifications", "Basic analytics", "Email support", "API access"],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Business",
    usd: VERIFICATION_PRICES_USD.business.monthly,
    period: "/month",
    features: ["Up to 1,000 verifications", "Advanced analytics", "Priority support", "Custom integrations", "Dedicated account manager"],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    usd: null,
    custom: true,
    period: "",
    features: ["Unlimited verifications", "Enterprise analytics", "24/7 support", "Custom workflows", "SLA guarantee", "On-premise option"],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function EnterprisePage() {
  const { currency } = useCurrency();
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
              <Building2 className="w-4 h-4 text-[#D97757]" />
              <span className="text-sm font-semibold text-[#D97757]">Enterprise-Grade Solutions</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-[#382A25] mb-6 tracking-tight">
              Enterprise <span className="text-[#D97757]">Solutions</span>
            </h1>
            <p className="text-xl text-[#81736C] mb-8 leading-relaxed">
              Scalable, secure, and customizable background verification solutions for large organizations
              and enterprises.
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

      {/* Features */}
      <section className="py-24 bg-[#FFF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#382A25] mb-4 tracking-tight">Built for Enterprise</h2>
            <p className="text-[#81736C] max-w-2xl mx-auto text-lg">
              Everything you need to scale your hiring process with confidence
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

      {/* Pricing */}
      <section className="py-24 bg-white border-y border-[#EFE3DB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#382A25] mb-4 tracking-tight">Simple, Transparent Pricing</h2>
            <p className="text-[#81736C] max-w-2xl mx-auto text-lg">
              Choose the plan that fits your organization&apos;s needs
            </p>
            <div className="mt-6 flex justify-center">
              <CurrencySelector className="bg-white border border-[#EFE3DB] text-[#382A25] px-3 py-1.5 rounded-xl shadow-xs" />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white p-8 border rounded-2xl transition-all duration-300 ${
                  plan.popular 
                    ? "border-2 border-[#D97757] shadow-xl shadow-[#D97757]/10 ring-4 ring-[#FCE8DD]/50 md:-translate-y-2" 
                    : "border-[#EFE3DB] shadow-sm hover:border-[#D97757]/50 hover:shadow-md"
                } relative flex flex-col`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#D97757] text-white px-3.5 py-1 text-xs font-bold rounded-full shadow-md uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-[#382A25] mb-2">{plan.name}</h3>
                <div className="mb-6 pb-6 border-b border-[#EFE3DB]">
                  <span className="text-4xl font-extrabold text-[#382A25]">
                    {plan.custom ? "Custom" : formatPrice(plan.usd!, currency)}
                  </span>
                  <span className="text-[#81736C] font-medium"> {plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-[#382A25]">
                      <CheckCircle className="w-4 h-4 text-[#15803D] flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`block text-center py-3.5 font-semibold transition-all text-sm rounded-xl ${
                    plan.popular
                      ? "bg-[#D97757] hover:bg-[#B95F42] text-white shadow-md hover:shadow-lg shadow-[#D97757]/20"
                      : "border border-[#EFE3DB] bg-white text-[#382A25] hover:bg-[#FCE8DD]/40 hover:border-[#D97757]"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#D97757] to-[#B95F42] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Scale Your Hiring?</h2>
          <p className="text-white/90 mb-8 text-lg">
            Join 1000+ enterprises already using HireRight for efficient, reliable background screening.
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
