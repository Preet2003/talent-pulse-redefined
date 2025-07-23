import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeatureHighlights } from "@/components/feature-highlights"
import { HowItWorks } from "@/components/how-it-works"
import { UsedBySection } from "@/components/used-by-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ProductScreenshot } from "@/components/product-screenshot"
import { WhyChooseUs } from "@/components/why-choose-us"
import { FAQSection } from "@/components/faq-section"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeatureHighlights />
      <HowItWorks />
      <UsedBySection />
      <TestimonialsSection />
      <ProductScreenshot />
      <WhyChooseUs />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </div>
  )
}
