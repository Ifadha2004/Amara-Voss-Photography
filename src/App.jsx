import Header from "./components/Header"
import Hero from "./components/Hero"
import Gallery from "./components/Gallery"
import Events from "./components/Events"
import About from "./components/About"
import Contact from "./components/Contact"
import Footer from "./components/Footer"

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Gallery />
        <Events />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App