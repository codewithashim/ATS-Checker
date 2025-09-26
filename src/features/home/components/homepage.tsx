"use client";

import { HeroSection } from "../sections/hero-section";
import { FeaturesSection } from "../sections/features-section";
import { HowItWorksSection } from "../sections/how-it-works-section";
import { StatsSection } from "../sections/stats-section";
import { CTASection } from "../sections/cta-section";

export function Homepage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <CTASection />
    </div>
  );
}
