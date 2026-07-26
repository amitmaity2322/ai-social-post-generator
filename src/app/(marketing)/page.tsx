import { HeroSection } from "@/presentation/components/marketing/HeroSection";
import { FeaturesSection } from "@/presentation/components/marketing/FeaturesSection";
import { WorkflowSection } from "@/presentation/components/marketing/WorkflowSection";
import { TestimonialsSection } from "@/presentation/components/marketing/TestimonialsSection";
import { PricingSection } from "@/presentation/components/marketing/PricingSection";
import { FAQSection } from "@/presentation/components/marketing/FAQSection";
import { CTASection } from "@/presentation/components/marketing/CTASection";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <WorkflowSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
