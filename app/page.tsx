import { HeroHeader } from "@/components/header";
import { Hero } from "@/components/landing/hero";
import { HeroImage } from "@/components/landing/hero-image";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { TechStack } from "@/components/landing/tech-stack";
import FooterSection from "@/components/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroHeader />
      <main className="flex-1 overflow-hidden">
        <Hero />
        <HeroImage />
        <HowItWorks />
        <Features />
        <Pricing />
        <FAQ />
        <TechStack />
      </main>
      <FooterSection />
    </div>
  );
}
