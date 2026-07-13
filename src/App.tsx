import { useCallback } from 'react'
import { AnnouncementBar } from './components/AnnouncementBar'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Speakers } from './components/Speakers'
import { Tickets } from './components/Tickets'
import { Footer } from './components/Footer'

export default function App() {
  const scrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <>
      <AnnouncementBar onNavigate={scrollToSection} />
      <Nav onNavigate={scrollToSection} />
      <main id="main-content">
        <Hero onNavigate={scrollToSection} />
        <About />
        <Speakers />
        <Tickets />
      </main>
      <Footer onNavigate={scrollToSection} />
    </>
  )
}
