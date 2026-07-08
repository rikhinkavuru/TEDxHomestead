import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Speakers from './components/Speakers'
import Tickets from './components/Tickets'
import Venue from './components/Venue'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Speakers />
        <Tickets />
        <Venue />
      </main>
      <Footer />
    </>
  )
}
