"use client";

import Link from "next/link";
import { CheckCircle, Sparkles } from "lucide-react";
import { PLAN_PRICES_USD, formatPrice } from "@/lib/pricing";
import { useCurrency } from "@/lib/useCurrency";
import CurrencySelector from "@/components/CurrencySelector";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    period: "forever",
    description: "For trying out the AI interview platform.",
    features: [
      "3 interviews / month",
      "1 candidate profile",
      "Email confirmation",
      "Basic AI evaluation",
    ],
    highlighted: false,
    cta: "Start Free",
    href: "/signup",
  },
  {
    id: "pro",
    name: "Pro",
    period: "/month",
    description: "For growing teams that screen regularly.",
    features: [
      "100 interviews / month",
      "Full video & analytics",
      "Email + WhatsApp reminders",
      "Priority AI evaluations",
      "6-month video retention",
    ],
    highlighted: true,
    cta: "Choose Pro",
    href: "/signup",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    period: "/month",
    description: "For organizations with high-volume hiring.",
    features: [
      "Unlimited interviews",
      "Everything in Pro",
      "Custom branding & roles",
      "1-year video retention",
      "Priority support",
    ],
    highlighted: false,
    cta: "Choose Enterprise",
    href: "/signup",
  },
];

export default function PricingPage() {
  const { currency } = useCurrency();

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex flex-col justify-between">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-32 pb-20 flex-1 w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FCE8DD] text-[#D97757] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Flexible Investment
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#382A25] mb-4 tracking-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="text-[#81736C] text-lg max-w-2xl mx-auto">
            Start free, upgrade when you need more interviews. No hidden fees, cancel anytime.
          </p>
          <div className="mt-6 flex justify-center">
            <CurrencySelector className="bg-white border border-[#EFE3DB] text-[#382A25] px-3 py-1.5 rounded-xl shadow-xs" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`p-8 flex flex-col rounded-2xl transition-all duration-300 ${
                plan.highlighted
                  ? "bg-white border-2 border-[#D97757] md:-translate-y-2 shadow-xl shadow-[#D97757]/10 ring-4 ring-[#FCE8DD]/50"
                  : "bg-white border border-[#EFE3DB] shadow-sm hover:border-[#D97757]/50 hover:shadow-md"
              }`}
            >
              {plan.highlighted && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCE8DD] text-[#D97757] text-xs font-bold mb-4 w-fit border border-[#D97757]/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  Most Popular
                </div>
              )}
              <h2 className="text-2xl font-bold text-[#382A25] mb-1">{plan.name}</h2>
              <p className="text-sm text-[#81736C] mb-6">{plan.description}</p>
              <div className="mb-6 pb-6 border-b border-[#EFE3DB]">
                <span className="text-4xl font-extrabold text-[#382A25]">
                  {formatPrice(PLAN_PRICES_USD[plan.id].monthly, currency)}
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
                href={plan.href}
                className={`text-center py-3.5 font-semibold transition-all text-sm rounded-xl ${
                  plan.highlighted
                    ? "bg-[#D97757] hover:bg-[#B95F42] text-white shadow-md hover:shadow-lg shadow-[#D97757]/20"
                    : "border border-[#EFE3DB] bg-white text-[#382A25] hover:bg-[#FCE8DD]/40 hover:border-[#D97757]"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-[#81736C] text-sm mt-12">
          Questions? Reach out at{" "}
          <a href="mailto:support@hireright.com" className="text-[#D97757] font-semibold hover:underline">
            support@hireright.com
          </a>
        </p>
      </div>
      <Footer />
    </div>
  );
}
