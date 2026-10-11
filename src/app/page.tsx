import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CompanyLogos from "@/components/CompanyLogos";
import Features from "@/components/Features";
import Enterprise from "@/components/Enterprise";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background w-full max-w-full overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <Enterprise />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
