import { useEffect } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useCursorTrail } from '../../hooks/useCursorTrail'
import { LandingNav } from './components/LandingNav/LandingNav'
import { HeroSection } from './components/HeroSection/HeroSection'
import { LogosSection } from './components/LogosSection/LogosSection'
import { BentoSection } from './components/BentoSection/BentoSection'
import { PricingSection } from './components/PricingSection/PricingSection'
import { TestimonialsSection } from './components/TestimonialsSection/TestimonialsSection'
import { FaqSection } from './components/FaqSection/FaqSection'
import { CtaSection } from './components/CtaSection/CtaSection'
import { LandingFooter } from './components/LandingFooter/LandingFooter'
import { BackToTop } from './components/BackToTop/BackToTop'

export default function LandingPage() {
  useScrollReveal()
  useCursorTrail()

  useEffect(() => {
    document.title = 'RecruitApex — Recruiting that actually works'
  }, [])

  return (
    <>
      <LandingNav />
      <main>
        <HeroSection />
        <LogosSection />
        <BentoSection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <LandingFooter />
      <BackToTop />
    </>
  )
}
