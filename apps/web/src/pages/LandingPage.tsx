import { useEffect } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { LandingNav } from '../components/landing/LandingNav'
import { HeroSection } from '../components/landing/HeroSection'
import { LogosSection } from '../components/landing/LogosSection'
import { BentoSection } from '../components/landing/BentoSection'
import { PricingSection } from '../components/landing/PricingSection'
import { TestimonialsSection } from '../components/landing/TestimonialsSection'
import { FaqSection } from '../components/landing/FaqSection'
import { CtaSection } from '../components/landing/CtaSection'
import { LandingFooter } from '../components/landing/LandingFooter'
import { BackToTop } from '../components/landing/BackToTop'
import { useCursorTrail } from '../hooks/useCursorTrail'

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