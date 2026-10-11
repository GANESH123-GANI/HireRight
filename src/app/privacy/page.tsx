"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FFF9F5] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-[#D97757] hover:text-[#B95F42] font-semibold text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white border border-[#EFE3DB] rounded-2xl p-8 lg:p-12 shadow-sm text-[#382A25]">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#382A25] mb-2 tracking-tight">Privacy Policy</h1>
          <p className="text-[#81736C] mb-8 text-sm">Last updated: January 2026</p>

          <div className="space-y-8 text-[#382A25]">
            <section>
              <h2 className="text-xl font-bold text-[#382A25] mb-3">1. Introduction</h2>
              <p className="text-[#81736C] leading-relaxed">
                Welcome to HireRight (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your personal
                information and your right to privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#382A25] mb-3">2. Information We Collect</h2>
              <p className="text-[#81736C] leading-relaxed">We may collect information that you provide directly to us:</p>
              <ul className="list-disc list-inside text-[#81736C] mt-2 space-y-1">
                <li><strong className="text-[#382A25]">Personal Information:</strong> Name, email address, phone number, date of birth</li>
                <li><strong className="text-[#382A25]">Professional Information:</strong> Resume, work history, education, skills</li>
                <li><strong className="text-[#382A25]">Verification Documents:</strong> Government IDs, address proof (for background verification)</li>
                <li><strong className="text-[#382A25]">Account Information:</strong> Username, password, account preferences</li>
                <li><strong className="text-[#382A25]">Communication:</strong> Messages, feedback, and correspondence with us</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#382A25] mb-3">3. How We Use Your Information</h2>
              <p className="text-[#81736C] leading-relaxed">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-[#81736C] mt-2 space-y-1">
                <li>Provide, operate, and maintain our services</li>
                <li>Process your job applications and matches</li>
                <li>Conduct AI-powered interviews</li>
                <li>Perform background verification (with your consent)</li>
                <li>Communicate with you about services, updates, and offers</li>
                <li>Improve and personalize your experience</li>
                <li>Ensure platform security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#382A25] mb-3">4. AI and Automated Decisions</h2>
              <p className="text-[#81736C] leading-relaxed">
                Our platform uses artificial intelligence for job matching and interviews. AI decisions are
                assisted by human review. You may request human intervention in any automated decision that
                significantly affects you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#382A25] mb-3">5. Data Sharing</h2>
              <p className="text-[#81736C] leading-relaxed">We may share your information with:</p>
              <ul className="list-disc list-inside text-[#81736C] mt-2 space-y-1">
                <li><strong className="text-[#382A25]">Employers:</strong> When you apply for a job or are matched with an opportunity</li>
                <li><strong className="text-[#382A25]">Verification Partners:</strong> For background checks (with your explicit consent)</li>
                <li><strong className="text-[#382A25]">Service Providers:</strong> Who assist in operating our platform</li>
                <li><strong className="text-[#382A25]">Legal Authorities:</strong> When required by law or to protect rights</li>
              </ul>
              <p className="text-[#81736C] mt-2">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#382A25] mb-3">6. Data Security</h2>
              <p className="text-[#81736C] leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your
                personal data against unauthorized access, alteration, disclosure, or destruction. However,
                no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#382A25] mb-3">7. Data Retention</h2>
              <p className="text-[#81736C] leading-relaxed">
                We retain your personal information for as long as your account is active or as needed to
                provide services. You may request deletion of your data at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#382A25] mb-3">8. Your Rights</h2>
              <p className="text-[#81736C] leading-relaxed">You have the right to:</p>
              <ul className="list-disc list-inside text-[#81736C] mt-2 space-y-1">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Request data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#382A25] mb-3">9. Cookies</h2>
              <p className="text-[#81736C] leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience. You can control
                cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#382A25] mb-3">10. Children&apos;s Privacy</h2>
              <p className="text-[#81736C] leading-relaxed">
                Our services are not intended for individuals under 18 years of age. We do not knowingly
                collect personal information from children.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#382A25] mb-3">11. Changes to This Policy</h2>
              <p className="text-[#81736C] leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by
                posting the new policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#382A25] mb-3">12. Contact Us</h2>
              <p className="text-[#81736C] leading-relaxed">
                If you have questions about this Privacy Policy, please contact us:
              </p>
              <p className="text-[#81736C] mt-2">
                <strong className="text-[#382A25]">Email:</strong> privacy@hireright.com<br />
                <strong className="text-[#382A25]">Address:</strong> HireRight, Bangalore, India
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
