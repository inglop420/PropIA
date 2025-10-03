
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroSection } from "./_components/hero-section";
import { BenefitsSection } from "./_components/benefits-section";
import { StatsSection } from "./_components/stats-section";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-[#F5F5DC]">
      <Navbar />
      <HeroSection />
      <BenefitsSection />
      <StatsSection />
      <Footer />
    </main>
  );
}
