import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ExpertsPage() {
  const experts = [
    { name: "Priya Sharma", role: "Staff Software Engineer @ Google", focus: "Specialized in System Design, Distributed Systems, and DSA interviews.", rate: "$75/hr" },
    { name: "David Chen", role: "Principal Architect @ Amazon", focus: "Over 8 years conducting bar-raiser interviews. Cloud & distributed microservices.", rate: "$80/hr" },
    { name: "Elena Rostova", role: "Engineering Lead @ Microsoft", focus: "Expert in frontend architecture, full-stack design, and senior leadership loops.", rate: "$70/hr" },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mb-12">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-[#FCE8DD] text-[#D97757] border border-[#EFE3DB] mb-3">
            Industry Leaders
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#382A25] tracking-tight">Our Interview Experts</h1>
          <p className="text-[#81736C] text-base mt-2">Connect directly with calibrated hiring managers and tech leads for mock sessions and detailed feedback.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {experts.map((exp, i) => (
            <div key={i} className="bg-white border border-[#EFE3DB] rounded-2xl p-6 shadow-[0_8px_30px_rgb(56,42,37,0.06)] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-14 w-14 bg-[#FCE8DD] border border-[#EFE3DB] rounded-2xl flex items-center justify-center text-[#D97757] font-bold text-lg">
                    {exp.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#382A25]">{exp.name}</h3>
                    <p className="text-xs text-[#81736C] font-medium">{exp.role}</p>
                  </div>
                </div>
                <p className="text-sm text-[#81736C] mb-6 leading-relaxed">{exp.focus}</p>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-[#EFE3DB]">
                <span className="font-bold text-[#382A25] text-lg">{exp.rate}</span>
                <button className="bg-[#D97757] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#B95F42] transition-colors shadow-xs">
                  Book Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
