import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";

export default function ResumeNichePage() {
  return (
    <div className="min-h-screen bg-[#FFF9F5] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#FCE8DD] border border-[#EFE3DB] flex items-center justify-center mx-auto mb-6">
          <FileText className="w-8 h-8 text-[#D97757]" />
        </div>
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-[#FCE8DD] text-[#D97757] border border-[#EFE3DB] mb-3">
          Resume Engineering
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#382A25] tracking-tight mb-4">Executive Resume Writing</h1>
        <p className="text-[#81736C] text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Craft an ATS-optimized, high-impact resume vetted by senior recruiters. Highlight metrics, scope, and technical depth.
        </p>
        <Link
          href="/experts"
          className="inline-flex items-center gap-2 bg-[#D97757] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#B95F42] transition-colors shadow-sm"
        >
          Get Resume Help
          <ArrowRight className="w-4 h-4" />
        </Link>
      </main>
      <Footer />
    </div>
  );
}
