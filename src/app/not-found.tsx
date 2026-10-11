import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-4">
      <div className="bg-white border border-[#EFE3DB] shadow-[0_8px_30px_rgb(56,42,37,0.06)] rounded-2xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-[#FCE8DD] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#EFE3DB]">
          <span className="text-2xl font-bold text-[#D97757]">404</span>
        </div>
        <h2 className="text-xl font-bold text-[#382A25] mb-2">Page not found</h2>
        <p className="text-sm text-[#81736C] mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex px-6 py-2.5 bg-[#D97757] text-white text-sm font-semibold rounded-xl hover:bg-[#B95F42] transition-colors shadow-sm"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
