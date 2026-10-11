"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Mail,
  CheckCircle,
  XCircle,
  CreditCard,
  Download,
  Trash2,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PLAN_PRICES_USD, formatPrice } from "@/lib/pricing";
import { useCurrency } from "@/lib/useCurrency";
import CurrencySelector from "@/components/CurrencySelector";

const TIMEZONES = [
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Hong_Kong",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Australia/Sydney",
  "Africa/Nairobi",
  "Africa/Lagos",
];

const PLANS = [
  {
    id: "pro",
    name: "Pro",
    period: "/month",
    features: [
      "100 interviews / month",
      "Full video & analytics",
      "Email + WhatsApp reminders",
      "Priority AI evaluations",
    ],
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    period: "/month",
    features: [
      "Unlimited interviews",
      "Everything in Pro",
      "Custom branding & roles",
      "Priority support",
    ],
    highlighted: false,
  },
];

interface AccountInfo {
  user: { email: string; name: string | null; emailVerified: boolean };
  organization: { id: string; name: string; plan: string; planStatus: string | null } | null;
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, token, logout, isLoading: authLoading } = useAuth();
  const { currency } = useCurrency();
  const [info, setInfo] = useState<AccountInfo | null>(null);
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [timezoneSaving, setTimezoneSaving] = useState(false);
  const [tzMessage, setTzMessage] = useState("");
  const [billingBusy, setBillingBusy] = useState(false);
  const [billingError, setBillingError] = useState("");
  const [verificationMsg, setVerificationMsg] = useState("");
  const [verificationBusy, setVerificationBusy] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (!user || !token) return;
    let cancelled = false;

    (async () => {
      try {
        const [meRes, profileRes] = await Promise.all([
          fetch("/api/account/me"),
          fetch("/api/profile"),
        ]);
        const me = await meRes.json();
        const profile = await profileRes.json();
        if (cancelled) return;
        if (me.success) setInfo(me);
        if (profile.success && profile.profile?.timezone) {
          setTimezone(profile.profile.timezone);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, token]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const emailVerified = info?.user?.emailVerified ?? user?.emailVerified ?? false;

  const handleResendVerification = async () => {
    setVerificationBusy(true);
    setVerificationMsg("");
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user?.email || "" }),
      });
      const data = await response.json();
      setVerificationMsg(data.message || data.error || "Please try again later.");
    } catch {
      setVerificationMsg("Something went wrong. Please try again.");
    } finally {
      setVerificationBusy(false);
    }
  };

  const handleSaveTimezone = async () => {
    if (!token) return;
    setTimezoneSaving(true);
    setTzMessage("");
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ timezone }),
      });
      const data = await response.json();
      setTzMessage(data.success ? "Timezone saved." : (data.error || "Failed to save timezone."));
    } finally {
      setTimezoneSaving(false);
    }
  };

  const handleCheckout = async (plan: string) => {
    setBillingBusy(true);
    setBillingError("");
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan, currency }),
      });
      const data = await response.json();
      if (data.billingDisabled) {
        setBillingError("Billing is not configured on this deployment yet.");
        return;
      }
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Could not start checkout");
      }
      window.location.assign(data.url);
    } catch (err) {
      setBillingError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setBillingBusy(false);
    }
  };

  const handlePortal = async () => {
    setBillingBusy(true);
    setBillingError("");
    try {
      const response = await fetch("/api/billing/portal", {
        method: "POST",
      });
      const data = await response.json();
      if (data.billingDisabled) {
        setBillingError("Billing is not configured on this deployment yet.");
        return;
      }
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Could not open billing portal");
      }
      window.location.assign(data.url);
    } catch (err) {
      setBillingError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setBillingBusy(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch("/api/account/export");
      if (!response.ok) {
        throw new Error("Export failed");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "hireright-account-data.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setBillingError(err instanceof Error ? err.message : "Export failed");
    }
  };

  const handleDelete = async () => {
    setDeleteError("");
    if (deleteConfirm.trim() !== "DELETE") {
      setDeleteError('Please type DELETE to confirm.');
      return;
    }
    setDeleting(true);
    try {
      const response = await fetch("/api/account/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ confirmation: "DELETE" }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Deletion failed");
      }
      logout();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setDeleting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9F5]">
        <div className="animate-spin h-8 w-8 border-4 border-[#D97757] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const plan = info?.organization?.plan || "starter";
  const planStatus = info?.organization?.planStatus;

  return (
    <div className="min-h-screen bg-[#FFF9F5]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#382A25]">Account Settings</h1>
          <p className="text-[#81736C] mt-1 text-sm">Manage verification, billing, and your personal data.</p>
        </div>

        {/* Email verification */}
        <section className="bg-white border border-[#EFE3DB] shadow-[0_8px_30px_rgb(56,42,37,0.06)] rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#FCE8DD] flex items-center justify-center border border-[#EFE3DB]">
              <Mail className="w-5 h-5 text-[#D97757]" />
            </div>
            <h2 className="text-lg font-bold text-[#382A25]">Email Verification</h2>
          </div>
          {emailVerified ? (
            <div className="flex items-center gap-2.5 text-[#15803D] bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-semibold">{info?.user?.email || user.email} is verified.</span>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2.5 text-[#B45309] bg-amber-50 border border-amber-200 p-4 rounded-xl mb-4">
                <XCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">
                  Your email is not verified yet. Verify it to unlock the full experience.
                </span>
              </div>
              <button
                onClick={handleResendVerification}
                disabled={verificationBusy}
                className="bg-[#D97757] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#B95F42] transition-colors disabled:opacity-50 rounded-xl shadow-sm"
              >
                {verificationBusy ? "Sending..." : "Resend Verification Email"}
              </button>
              {verificationMsg && (
                <p className="text-sm text-[#81736C] mt-3">{verificationMsg}</p>
              )}
            </div>
          )}
        </section>

        {/* Billing */}
        <section className="bg-white border border-[#EFE3DB] shadow-[0_8px_30px_rgb(56,42,37,0.06)] rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#FCE8DD] flex items-center justify-center border border-[#EFE3DB]">
              <CreditCard className="w-5 h-5 text-[#D97757]" />
            </div>
            <h2 className="text-lg font-bold text-[#382A25]">Plan & Billing</h2>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-[#81736C]">Current plan:</span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#D97757] bg-[#FCE8DD] px-3 py-1 rounded-full capitalize border border-[#EFE3DB]">
              {plan}
              {planStatus && planStatus !== "active" && plan !== "starter" && (
                <span className="text-xs text-[#B91C1C] lowercase">({planStatus})</span>
              )}
            </span>
          </div>

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border border-[#EFE3DB] bg-[#FFF9F5] px-4 py-3 rounded-xl">
            <p className="text-xs text-[#81736C]">
              Prices shown in your currency. Billed by Stripe in the plan&apos;s currency.
            </p>
            <CurrencySelector className="bg-white border border-[#EFE3DB] text-[#382A25] px-3 py-1.5 rounded-lg text-sm" />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {PLANS.map((p) => {
              const isCurrent = plan === p.id;
              return (
                <div
                  key={p.id}
                  className={`border p-5 rounded-2xl transition-all ${
                    p.highlighted
                      ? "border-[#D97757] bg-[#FFF9F5] shadow-sm"
                      : "border-[#EFE3DB] bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-[#382A25] flex items-center gap-1.5">
                      {p.name}
                      {p.highlighted && <Sparkles className="w-4 h-4 text-[#D97757]" />}
                    </h3>
                    {isCurrent && (
                      <span className="text-xs font-semibold text-[#15803D] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-[#382A25]">
                      {formatPrice(PLAN_PRICES_USD[p.id].monthly, currency)}
                    </span>
                    <span className="text-sm text-[#81736C] ml-1">{p.period}</span>
                  </div>
                  <ul className="space-y-1.5 mb-5">
                    {p.features.map((f) => (
                      <li key={f} className="text-sm text-[#81736C] flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#15803D] flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  {!isCurrent && (
                    <button
                      onClick={() => handleCheckout(p.id)}
                      disabled={billingBusy}
                      className="w-full bg-[#D97757] text-white py-2.5 text-sm font-semibold hover:bg-[#B95F42] transition-colors disabled:opacity-50 rounded-xl shadow-sm"
                    >
                      Upgrade to {p.name}
                    </button>
                  )}
                  {isCurrent && plan !== "starter" && (
                    <button
                      onClick={handlePortal}
                      disabled={billingBusy}
                      className="w-full border border-[#EFE3DB] bg-white text-[#382A25] py-2.5 text-sm font-medium hover:bg-[#FFF9F5] transition-colors disabled:opacity-50 rounded-xl"
                    >
                      Manage Subscription
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-xs text-[#81736C]">
            Start free on the Starter plan (3 interviews / month). Upgrade anytime to unlock more interviews,
            video analytics, and longer retention.
          </p>

          {billingError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-[#B91C1C] text-sm rounded-xl">
              {billingError}
            </div>
          )}
        </section>

        {/* Timezone */}
        <section className="bg-white border border-[#EFE3DB] shadow-[0_8px_30px_rgb(56,42,37,0.06)] rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#FCE8DD] flex items-center justify-center border border-[#EFE3DB]">
              <Clock className="w-5 h-5 text-[#D97757]" />
            </div>
            <h2 className="text-lg font-bold text-[#382A25]">Timezone</h2>
          </div>
          <p className="text-sm text-[#81736C] mb-4">
            Your interview schedule and reminders will be shown in this timezone.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="bg-white border border-[#EFE3DB] p-2.5 text-sm text-[#382A25] rounded-xl focus:border-[#D97757] focus:ring-2 focus:ring-[#D97757]/20 outline-none"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
            <button
              onClick={handleSaveTimezone}
              disabled={timezoneSaving}
              className="bg-[#D97757] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#B95F42] transition-colors disabled:opacity-50 rounded-xl shadow-sm"
            >
              {timezoneSaving ? "Saving..." : "Save Timezone"}
            </button>
            {tzMessage && <span className="text-sm text-[#15803D] font-medium">{tzMessage}</span>}
          </div>
        </section>

        {/* Privacy */}
        <section className="bg-white border border-[#EFE3DB] shadow-[0_8px_30px_rgb(56,42,37,0.06)] rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#FCE8DD] flex items-center justify-center border border-[#EFE3DB]">
              <Shield className="w-5 h-5 text-[#D97757]" />
            </div>
            <h2 className="text-lg font-bold text-[#382A25]">Your Data (GDPR)</h2>
          </div>
          <p className="text-sm text-[#81736C] mb-4 leading-relaxed">
            You can download everything we store about you, or permanently delete your account and all
            associated data (profile, resume, interview recordings, and evaluations).
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 border border-[#EFE3DB] bg-white text-[#382A25] px-5 py-2.5 text-sm font-medium hover:bg-[#FFF9F5] transition-colors rounded-xl shadow-sm"
            >
              <Download className="w-4 h-4 text-[#81736C]" />
              Export My Data
            </button>
          </div>
          <div className="bg-red-50/50 border border-red-200 p-5 rounded-2xl">
            <p className="text-sm font-bold text-[#B91C1C] mb-1.5 flex items-center gap-1.5">
              <Trash2 className="w-4 h-4" />
              Delete Account
            </p>
            <p className="text-xs text-[#B91C1C]/80 mb-4 leading-relaxed">
              This permanently deletes your account and all associated data. This action cannot be undone.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder='Type DELETE to confirm'
                className="bg-white border border-red-200 p-2.5 text-sm text-[#382A25] placeholder:text-[#81736C]/60 rounded-xl focus:border-[#B91C1C] focus:ring-2 focus:ring-[#B91C1C]/20 outline-none"
              />
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 bg-[#B91C1C] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#991B1B] transition-colors disabled:opacity-50 rounded-xl shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
                {deleting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
            {deleteError && <p className="text-sm text-[#B91C1C] mt-3">{deleteError}</p>}
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link href="/profile" className="text-[#D97757] font-semibold hover:text-[#B95F42] inline-flex items-center gap-1.5">
            Back to profile <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
