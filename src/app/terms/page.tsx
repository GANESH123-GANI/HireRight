"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FFF9F5] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-[#D97757] hover:text-[#B95F42] font-semibold text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white border border-[#EFE3DB] rounded-2xl p-8 lg:p-12 shadow-sm text-[#382A25]">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#382A25] mb-2 tracking-tight">Terms of Service</h1>
          <p className="text-[#81736C] mb-8 text-sm">Last updated: January 2026</p>

          <div className="space-y-8 text-[#382A25]">
            <section>
              <h2 className="text-xl font-bold text-[#382A25] mb-3">1. Acceptance of Terms</h2>
              <p className="text-[#81736C] leading-relaxed">
                By accessing and using HireRight (&quot;the Platform&quot;), you agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#382A25] mb-3">2. Description of Services</h2>
              <p className="text-[#81736C] leading-relaxed">
                HireRight provides an AI-powered background screening and job matching platform. Our services include:
              </p>
              <ul className="list-disc list-inside text-[#81736C] mt-2 space-y-1">
                <li>Profile creation and verification</li>
                <li>AI-powered job matching</li>
                <li>Virtual interview scheduling and conduction</li>
                <li>Background verification services</li>
                <li>Employer recruitment solutions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#382A25] mb-3">3. User Accounts</h2>
              <p className="text-[#81736C] leading-relaxed">
                You must provide accurate, current, and complete information during registration.
                You are responsible for maintaining the confidentiality of your account credentials
                and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#382A25] mb-3">4. User Responsibilities</h2>
              <p className="text-[#81736C] leading-relaxed">Users agree to:</p>
              <ul className="list-disc list-inside text-[#81736C] mt-2 space-y-1">
                <li>Provide truthful and accurate information</li>
                <li>Not misrepresent their identity or qualifications</li>
                <li>Not use the platform for any illegal purposes</li>
                <li>Not attempt to circumvent security measures</li>
                <li>Respect the rights of other users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#382A25] mb-3">5. Privacy and Data Protection</h2>
              <p className="text-[#81736C] leading-relaxed">
                Your privacy is important to us. Our collection and use of personal information is governed by our
                <Link href="/privacy" className="text-[#D97757] hover:underline font-semibold ml-1">Privacy Policy</Link>.
                By using our services, you consent to the data practices described therein.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#382A25] mb-3">6. Intellectual Property</h2>
              <p className="text-[#81736C] leading-relaxed">
                All content, features, and functionality of the Platform are owned by HireRight and are protected
                by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#382A25] mb-3">7. Limitation of Liability</h2>
              <p className="text-[#81736C] leading-relaxed">
                HireRight shall not be liable for any indirect, incidental, special, consequential, or punitive
                damages resulting from your use of or inability to use the Platform. We do not guarantee employment
                outcomes or the accuracy of third-party information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#382A25] mb-3">8. Termination</h2>
              <p className="text-[#81736C] leading-relaxed">
                We may terminate or suspend your account and access to the Platform at our sole discretion,
                without prior notice, for conduct that we believe violates these Terms or is harmful to other users,
                us, or third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#382A25] mb-3">9. Changes to Terms</h2>
              <p className="text-[#81736C] leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of any material
                changes via email or through the Platform. Continued use after changes constitutes acceptance
                of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#382A25] mb-3">10. Contact Us</h2>
              <p className="text-[#81736C] leading-relaxed">
                For questions about these Terms, please contact us at:
              </p>
              <p className="text-[#81736C] mt-2">
                <strong className="text-[#382A25]">Email:</strong> legal@hireright.com<br />
                <strong className="text-[#382A25]">Address:</strong> HireRight, Bangalore, India
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
