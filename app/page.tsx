import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import RegistrationTicker from '@/components/RegistrationTicker'
import StatsSection from '@/components/StatsSection'
import TabSection from '@/components/TabSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import FeatureSection from '@/components/FeatureSection'
import EnSection from '@/components/EnSection'
import ChatWidget from '@/components/ChatWidget'
import FAQSection from '@/components/FAQSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <RegistrationTicker />
        <StatsSection />
        <TabSection />
        <TestimonialsSection />
        <FeatureSection />
        <EnSection />
        <FAQSection />
      </main>
      <Footer />
      <ChatWidget />
    </>
  )
}
