import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { FeaturedProperties } from "@/components/landing/featured-properties"
import { HowItWorks } from "@/components/landing/how-it-works"
import { StatsBand } from "@/components/landing/stats-band"
import { Services } from "@/components/landing/services"
import { Testimonials } from "@/components/landing/testimonials"
import { Team } from "@/components/landing/team"
import { Contact } from "@/components/landing/contact"
import { Footer } from "@/components/landing/footer"
import { WhatsappButton } from "@/components/landing/whatsapp-button"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedProperties />
        <HowItWorks />
        <StatsBand />
        <Services />
        <Testimonials />
        <Team />
        <Contact />
      </main>
      <Footer />
      <WhatsappButton />
    </>
  )
}
