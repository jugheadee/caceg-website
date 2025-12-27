// app/certification-iso/page.tsx
"use client";

import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer"; // Extract this too if not already
import HeroSection from "./components/HeroSection";
import IntroSection from "./components/IntroSection";
import BenefitsSection from "./components/BenefitsSection";
import ServicesSection from "./components/ServicesSection";
import CallToAction from "./components/CallToAction";

export default function CertificationISOPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="h-16 lg:h-20"></div> {/* Navbar spacer */}
      <HeroSection />
      <IntroSection />
      <BenefitsSection />
      <ServicesSection />
      <Footer />
    </main>
  );
}
